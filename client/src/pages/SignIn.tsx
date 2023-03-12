import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { TextField } from '../components/Form';
import { useRequest } from '../hooks/useRequest';
import { ErrorBox } from '../components/Notication';

const SignInSchema = Yup.object().shape({
    emailUsername: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
});

export const SignIn = () => {
    const navigate = useNavigate();

    const request = useRequest();

    return (
        <div className="flex flex-col items-center gap-5">
            <span className="text-5xl mt-7">Sign In to <span className="text-blue-light">robohub</span></span>
            <Formik
                initialValues={{ emailUsername: '', password: '' }}
                onSubmit={async ({ emailUsername, password }, { setStatus }) => request<{ token: string }>(
                    '/auth/token',
                    'POST',
                    {
                        email: emailUsername,
                        password,
                    },
                ).then(() => {
                    navigate('/');
                }).catch((error) => {
                    if (error instanceof AxiosError && error.response?.status === 401) {
                        setStatus(error.response.data.error);
                    }
                })}
                validationSchema={SignInSchema}
            >
                {({ submitForm, isSubmitting, status }) => (
                    <Form className="flex flex-col justify-around items-center p-5 gap-5">
                        <TextField name="emailUsername" placeholder="Email / Username" />
                        <TextField name="password" placeholder="Password" type="password" />
                        {status && (
                            <ErrorBox>{status}</ErrorBox>
                        )}
                        {isSubmitting ? <Oval stroke="#64a9e9" />
                            : <button type="submit" onClick={submitForm}>Submit</button>}
                    </Form>
                )}
            </Formik>
        </div>
    );
};
