import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { TextField } from '../components/Form';

const SignUpSchema = Yup.object().shape({
    email: Yup.string().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Not valid email').required('Required'),
    username: Yup.string().min(2, 'Too short').max(15, 'Too long').required('Required'),
    password: Yup.string().min(2, 'Too short').max(15, 'Too long').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Passwords must match').required('Required'),
});

export const SignUp = () => (
    <div className="flex flex-col items-center gap-5">
        <span className="text-5xl mt-7">Sign Up for <span className="text-blue-light">robohub</span></span>
        <Formik
            initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
            onSubmit={() => new Promise<void>((resolve) => {
                setTimeout(resolve, 1000);
            })}
            validationSchema={SignUpSchema}
        >
            {({ submitForm, isSubmitting }) => (
                <Form className="flex flex-col justify-around items-center p-5 gap-5">
                    <TextField name="email" placeholder="email" />
                    <TextField name="username" placeholder="username" />
                    <TextField name="password" placeholder="password" type="password" />
                    <TextField name="confirmPassword" placeholder="confirm password" type="password" />

                    <button type="submit" onClick={submitForm}>Submit {isSubmitting && 'loading'}</button>
                </Form>
            )}
        </Formik>
    </div>
);
