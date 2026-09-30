import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout header={<h1>Inicio</h1>}>
            <Head title="Inicio" />
            <p>Tu cuenta está lista.</p>
        </AuthenticatedLayout>
    );
}
