import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const appEntryPath = resolve(process.cwd(), 'resources/js/app.tsx');
const globalCssPath = resolve(process.cwd(), 'resources/css/global.css');
const expectedColors = {
    background: '#000020',
    surface: '#171a4a',
    'surface-elevated': '#2f2c79',
    action: '#ffff00',
    'action-soft': '#ffff6a',
    text: '#ffffff',
    'text-muted': '#c7c8e8',
    success: '#64e6a3',
    error: '#ff7b72',
    info: '#8da2ff',
    'on-action': '#000020',
} as const;

function channelToLinear(channel: number): number {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
    const channels = hex
        .slice(1)
        .match(/.{2}/g)
        ?.map((value) => channelToLinear(Number.parseInt(value, 16)));

    if (!channels || channels.length !== 3) {
        throw new Error(`Color hexadecimal inválido: ${hex}`);
    }

    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first: string, second: string): number {
    const lighter = Math.max(luminance(first), luminance(second));
    const darker = Math.min(luminance(first), luminance(second));
    return (lighter + 0.05) / (darker + 0.05);
}

function readColorTokens(): Record<string, string> {
    const css = readFileSync(globalCssPath, 'utf8');
    return Object.fromEntries(
        [...css.matchAll(/--color-([\w-]+):\s*(#[\da-f]{6});/gi)].map(
            ([, name, value]) => [name, value.toLowerCase()],
        ),
    );
}

describe('contrato del tema oscuro', () => {
    test('carga global.css una sola vez desde app.tsx', () => {
        const appEntry = readFileSync(appEntryPath, 'utf8');
        const imports = appEntry.match(
            /import\s+['"]\.\.\/css\/global\.css['"];?/g,
        );

        expect(imports).toHaveLength(1);
    });

    test('mantiene exactamente la paleta aprobada', () => {
        const tokens = readColorTokens();

        for (const [name, value] of Object.entries(expectedColors)) {
            expect(tokens[name], `Falta o cambió --color-${name}`).toBe(value);
        }
    });

    test('cumple los contrastes base de WCAG 2.2 AA', () => {
        const colors = readColorTokens();
        const textPairs = [
            ['text', 'background'],
            ['text', 'surface'],
            ['text-muted', 'background'],
            ['text-muted', 'surface'],
            ['success', 'surface'],
            ['error', 'surface'],
            ['info', 'surface'],
            ['on-action', 'action'],
        ] as const;
        const controlPairs = [
            ['action', 'background'],
            ['action', 'surface'],
            ['action', 'surface-elevated'],
            ['info', 'surface'],
        ] as const;

        for (const [foreground, background] of textPairs) {
            expect(
                contrast(colors[foreground], colors[background]),
                `${foreground} sobre ${background} debe alcanzar 4.5:1`,
            ).toBeGreaterThanOrEqual(4.5);
        }

        for (const [foreground, background] of controlPairs) {
            expect(
                contrast(colors[foreground], colors[background]),
                `${foreground} frente a ${background} debe alcanzar 3:1`,
            ).toBeGreaterThanOrEqual(3);
        }
    });
});
