import { FileUpload } from 'components/FileUpload';
import { useProtectedRouteProfile } from 'components/ProtectedRoute';
import { Formik } from 'formik';
import { API_URL, useRequest } from 'hooks/useRequest';

export const Settings = () => {
    const profile = useProtectedRouteProfile();

    const request = useRequest();

    return (
        <div className="mt-28 flex flex-col items-center gap-5">
            <span className="text-5xl">User Settings</span>
            <Formik<{ avatar: File | undefined }>
                initialValues={{ avatar: undefined }}
                onSubmit={async ({ avatar }) => {
                    if (!avatar) {
                        return;
                    }
                    const data = new FormData();
                    data.append('avatar', avatar);

                    request('/account/profile/avatar', 'POST', data).then(() => {
                        window.location.reload();
                    });
                }}
            >
                {({ values, submitForm }) => (
                    <div className="card p-3">
                        <FileUpload name="avatar" acceptedType="image/png">
                            <button className="group relative cursor-pointer" type="button">
                                <img
                                    src={values.avatar ? URL.createObjectURL(values.avatar) : `${API_URL}/content/avatar/users/${profile.id}`}
                                    alt="profile"
                                    className="h-36 w-36 rounded-full duration-200 group-hover:opacity-50"
                                />
                                <span className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 opacity-0 duration-200 group-hover:opacity-100">Change Avatar</span>
                            </button>
                        </FileUpload>
                        {values.avatar && <button className="button" type="submit" onClick={submitForm}>Upload Avatar</button>}
                    </div>
                )}
            </Formik>
        </div>
    );
};
