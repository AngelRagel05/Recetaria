import DeleteUserForm from '@/Components/Profile/DeleteUserForm/DeleteUserForm';
import UpdatePasswordForm from '@/Components/Profile/UpdatePasswordForm/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Components/Profile/UpdateProfileInformationForm/UpdateProfileInformationForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import styles from './Edit.module.css';

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
