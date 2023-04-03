import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { Navigate } from 'react-router-dom';
import { ErrorBox } from 'components/Notication';
import { TextField } from 'components/Form';
import { TokenResponseType, getResponseErrorMessage, requestUnauthorized } from 'hooks/useRequest';
import { useAuthenticationContext } from 'AuthenticationContext';
import { motion } from 'framer-motion';

const SignInSchema = Yup.object().shape({
    emailUsername: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
});

export const SignIn = () => {
    const { token, setToken } = useAuthenticationContext();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex h-screen flex-col items-center justify-center gap-16"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="text-6xl">Sign In to <span className="text-navy-300">robohub</span></span>
                <Formik
                    initialValues={{ emailUsername: '', password: '' }}
                    onSubmit={async ({ emailUsername, password }, { setStatus }) => requestUnauthorized<TokenResponseType>(
                        '/auth/token',
                        'POST',
                        {
                            email: emailUsername,
                            password,
                        },
                    ).then(({ data }) => {
                        setToken(data.token);
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
                        <Form className="card flex flex-col items-center justify-around gap-5 p-10">
                            <TextField name="emailUsername" placeholder="Email / Username" />
                            <TextField name="password" placeholder="Password" type="password" />

                            {status && (
                                <ErrorBox>{status}</ErrorBox>
                            )}

                            {isSubmitting ? <Oval stroke="#64a9e9" />
                                : <button type="submit" onClick={submitForm} className="button">Submit</button>}
                        </Form>
                    )}
                </Formik>
            </motion.div>
        </div>
    );
};
