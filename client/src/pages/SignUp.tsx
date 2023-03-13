import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { useNavigate } from 'react-router';
import { TextField } from '../components/Form';
import { ErrorBox } from '../components/Notication';
import { getResponseErrorMessage, requestUnauthorized, useRequest } from '../hooks/useRequest';

/**
 * Prevents unccesary asyncronous validation calls by rate limiting and only re executing when the value changes
 * @param asyncValidate Validation callback function
 * @param maxRate Maximum rate the validation can be called in milliseconds
 * @returns The wrapped validator function
 */
const cacheRateLimitedTest = (asyncValidate: (val: string) => Promise<boolean>, maxRate: number = 1000) => {
    let valid = false;
    let previousValue = '';
    let previousTimestamp = Date.now();

    return async (value: any) => {
        if (value !== previousValue && Date.now() - previousTimestamp > maxRate) {
            const response = await asyncValidate(value);
            previousValue = value;
            valid = response;
            previousTimestamp = Date.now();
            return response;
        }
        return valid;
    };
};

/**
 * Schema for validating the SignUp page fields
 */
const SignUpSchema = Yup.object().shape({
    email: Yup
        .string()
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Not valid email')
        .test('is-available', 'Email taken', cacheRateLimitedTest(async (value) => !(await requestUnauthorized<boolean>(`/auth/email-taken/${value}`, 'GET')).data))
        .required('Required'),
    username: Yup
        .string()
        .min(2, 'Too short')
        .max(15, 'Too long')
        .test('is-available', 'Username taken', cacheRateLimitedTest(async (value) => !(await requestUnauthorized<boolean>(`/auth/username-taken/${value}`, 'GET')).data))
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
    const navigate = useNavigate();

    const request = useRequest();

    return (
        <div className="flex flex-col items-center gap-5">
            <span className="text-5xl mt-7">Sign Up for <span className="text-blue-light">robohub</span></span>
            <Formik
                initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
                onSubmit={async ({ email, username, password }, { setStatus }) => request(
                    '/auth/sign-up',
                    'POST',
                    {
                        email,
                        username,
                        password,
                    },
                ).then(() => {
                    navigate('/');
                }).catch((error) => {
                    setStatus(getResponseErrorMessage(error)[0]);
                })}
                validationSchema={SignUpSchema}
            >
                {({ submitForm, isSubmitting, status }) => (
                    <Form className="flex flex-col justify-around items-center p-5 gap-5">
                        <TextField name="email" placeholder="Email" />
                        <TextField name="username" placeholder="Username" />
                        <TextField name="password" placeholder="Password" type="password" />
                        <TextField name="confirmPassword" placeholder="Confirm Password" type="password" />

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
