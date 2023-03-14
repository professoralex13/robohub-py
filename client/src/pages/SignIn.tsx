import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../components/Form';
import { getResponseErrorMessage, useRequest } from '../hooks/useRequest';
import { ErrorBox } from '../components/Notication';

const SignInSchema = Yup.object().shape({
    emailUsername: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
});

export const SignIn = () => {
    const navigate = useNavigate();

    const request = useRequest();

    return (
        <div className="flex flex-col items-center justify-center gap-16 h-screen">
            <span className="text-6xl">Sign In to <span className="text-navy-300">robohub</span></span>
            <Formik
                initialValues={{ emailUsername: '', password: '' }}
                onSubmit={async ({ emailUsername, password }, { setStatus }) => request(
                    '/auth/token',
                    'POST',
                    {
                        email: emailUsername,
                        password,
                    },
                ).then(() => {
                    navigate('/');
                }).catch((error) => {
                    const [message, status] = getResponseErrorMessage(error);
                    if (status === 401) {
                        setStatus('Invalid Email / Username or Password');
                    } else {
                        setStatus(message);
                    }
                })}
                validationSchema={SignInSchema}
            >
                {({ submitForm, isSubmitting, status }) => (
                    <Form className="flex flex-col justify-around items-center p-10 gap-5 rounded-md bg-navy-800 border-slate-500 border-2 border-opacity-50">
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
