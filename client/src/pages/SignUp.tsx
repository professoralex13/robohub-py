import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { Navigate } from 'react-router';
import { TextField } from '../components/Form';
import { ErrorBox } from '../components/Notication';
import { TokenResponseType, getResponseErrorMessage, requestUnauthorized } from '../hooks/useRequest';
import { useAuthenticationContext } from '../AuthenticationContext';
import { concurrentControledTest } from '../concurrencyControl';

/**
 * Schema for validating the SignUp page fields
 */
const SignUpSchema = Yup.object().shape({
    email: Yup
        .string()
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Not valid email')
        .test('is-available', 'Email taken', concurrentControledTest(async (value) => !(await requestUnauthorized<boolean>(`/auth/email-taken/${value}`, 'GET')).data))
        .required('Required'),
    username: Yup
        .string()
        .min(2, 'Too short')
        .max(15, 'Too long')
        // TODO: ensure username is valid url string before sending to prevent 404 errors, or use a post request
        .test('is-available', 'Username taken', concurrentControledTest(async (value) => !(await requestUnauthorized<boolean>(`/auth/username-taken/${value}`, 'GET')).data))
        .required('Required'),
    password: Yup
        .string()
        .min(2, 'Too short')
        .max(15, 'Too long')
        .required('Required'),
    confirmPassword: Yup
        .string()
        // Yup.ref(...) returns the value of another field in the object
        .oneOf([Yup.ref('password'), ''], 'Passwords must match')
        .required('Required'),
});

export const SignUp = () => {
    const { token, setToken } = useAuthenticationContext();

    if (token) {
        return <Navigate to="/" />;
    }
    return (
        <div className="flex flex-col items-center justify-center gap-16 h-screen">
            <span className="text-6xl">Sign Up for <span className="text-navy-300">robohub</span></span>
            <Formik
                initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
                onSubmit={async ({ email, username, password }, { setStatus }) => requestUnauthorized<TokenResponseType>(
                    '/auth/sign-up',
                    'POST',
                    {
                        email,
                        username,
                        password,
                    },
                ).then(({ data }) => {
                    setToken(data.token);
                }).catch((error) => {
                    setStatus(getResponseErrorMessage(error)[0]);
                })}
                validationSchema={SignUpSchema}
            >
                {({ submitForm, isSubmitting, status }) => (
                    <Form className="flex flex-col justify-around items-center p-10 gap-5 card">
                        <TextField name="email" placeholder="Email" />
                        <TextField name="username" placeholder="Username" />
                        <TextField name="password" placeholder="Password" type="password" />
                        <TextField name="confirmPassword" placeholder="Confirm Password" type="password" />

                        {status && (
                            <ErrorBox>{status}</ErrorBox>
                        )}

                        {isSubmitting ? <Oval stroke="#64a9e9" />
                            : <button type="submit" onClick={submitForm} className="button">Submit</button>}
                    </Form>
                )}
            </Formik>
        </div>
    );
};
