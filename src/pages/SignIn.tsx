import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../components/Form';

const SignInSchema = Yup.object().shape({
    emailUsername: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
});

export const SignIn = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center space-y-5">
            <span className="text-5xl mt-7">Sign In to <span className="text-blue-light">robohub</span></span>
            <Formik
                initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
                onSubmit={() => new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                        navigate('/');
                    }, 1000);
                })}
                validationSchema={SignInSchema}
            >
                {({ submitForm, isSubmitting }) => (
                    <Form className="flex flex-col justify-around items-center p-5 space-y-5">
                        <TextField name="emailUsername" placeholder="email / username" />
                        <TextField name="password" placeholder="password" type="password" />

                        {isSubmitting ? <Oval stroke="#64a9e9" />
                            : <button type="submit" onClick={submitForm}>Submit</button>}
                    </Form>
                )}
            </Formik>
        </div>
    );
};
