import '../css/global.css';

import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Recetaria';

void createInertiaApp({
    pages: {
        path: './Pages',
        extension: '.tsx',
        transform: (name) => `${name}/${name.split('/').at(-1)}`,
    },
    title: (title) => `${title} - ${appName}`,
    progress: {
        color: '#ffff00',
    },
});
