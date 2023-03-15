import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { Navigate } from 'react-router';
import { TextField } from '../components/Form';
import { ErrorBox } from '../components/Notication';
import { TokenResponseType, getResponseErrorMessage, requestUnauthorized } from '../hooks/useRequest';
import { useAuthenticationContext } from '../AuthenticationContext';

/**
 * Prevents unccesary asyncronous validation calls by only re-xecuting when value changes and ensuring only one request is queued at a time
 * @param asyncValidate Validation callback function
 * @returns The wrapped validator function
 */
const concurrentControledTest = (asyncValidate: (value: string) => Promise<boolean>) => {
    let valid = false; // Stores latest validation result
    let previousValue = ''; // Stores previous input value that was validated
    let currentPromise: Promise<boolean> | null = null; // Stores reference to currently executing validation promise
    const requestStack: (() => void)[] = []; // stack to store requests made while waiting for the current promise to resolve

    const executeRequest = async (value: any) => {
        const response = await asyncValidate(value);

        valid = response;
        currentPromise = null;

        // resolve all the requests in the stack with the validation result
        while (requestStack.length > 0) {
            const nextRequest = requestStack.pop();
            if (nextRequest) {
                nextRequest();
            }
        }

        return response;
    };

    return async (value: any) => {
        if (value === previousValue) { // if the value is the same as the previous one, return the cached result
            return valid;
        }

        if (!currentPromise) { // if there is no current promise, make a new one
            previousValue = value;
            currentPromise = executeRequest(value);
            return currentPromise;
        }

        return new Promise<boolean>((resolve) => {
            // if there is a current promise, add the resolve function to the stack
            // it will be called once the current promise is resolved
            requestStack.push(async () => {
                await currentPromise; // wait for the current promise to resolve
                resolve(valid); // resolve with the cached validation result
            });
        });
    };
};

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
                    <Form className="
                            flex flex-col justify-around items-center p-10 gap-5
                            rounded-md bg-navy-800 border-slate-500 border-2 border-opacity-50
                        "
                    >
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
