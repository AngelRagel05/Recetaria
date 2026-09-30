import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import styles from './Profile.module.css';

export default function Edit({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    return (
        <AuthenticatedLayout header={<h1>Perfil</h1>}>
            <Head title="Perfil" />
            <div className={styles.sections}>
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </div>
        </AuthenticatedLayout>
    );
}
