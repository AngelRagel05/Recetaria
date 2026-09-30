import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import FormField from './FormField';

test('muestra el error asociado al campo y permite introducir texto', () => {
    let value = '';
    render(
        <FormField
            error="El correo es obligatorio"
            id="email"
            label="Correo electrónico"
            onChange={(event) => {
                value = event.target.value;
            }}
        />,
    );

    const input = screen.getByRole('textbox', { name: 'Correo electrónico' });
    fireEvent.change(input, { target: { value: 'ana@example.com' } });

    expect(value).toBe('ana@example.com');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe(
        'El correo es obligatorio',
    );
});
