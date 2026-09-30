import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Recetaria';

void createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    progress: {
        color: '#325c3f',
    },
});
