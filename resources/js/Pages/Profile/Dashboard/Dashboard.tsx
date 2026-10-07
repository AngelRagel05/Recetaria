import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    return (
        <AuthenticatedLayout header={<h1>Inicio</h1>}>
            <Head title="Inicio" />
            <section className={styles.panel}>
                <span aria-hidden="true">✦</span>
                <div>
                    <h2>Tu cuenta está lista.</h2>
                    <p>
                        Ya puedes volver al inicio para explorar el prototipo
                        social de Recetaria.
                    </p>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
