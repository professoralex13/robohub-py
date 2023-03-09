import { Field, FieldAttributes, Form, Formik, useField } from 'formik';
import { FC } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
    email: Yup.string().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Not valid email').required('Required'),
    username: Yup.string().min(2, 'Too short').max(15, 'Too long').required('Required'),
    password: Yup.string().min(2, 'Too short').max(15, 'Too long').required('Required'),
});

const TextField: FC<FieldAttributes<any>> = ({ type = 'text', ...props }) => {
    const [field, meta] = useField(props);

    const hasError = meta.error && meta.touched;

    return (
        <div className="relative flex flex-col">
            <span
                className={clsx(
                    !field.value && 'opacity-0',
                    hasError ? 'text-red-600' : 'text-grey-light',
                    'duration-100 absolute left-2 top-[-0.7rem] bg-blue-dark px-1',
                )}
            >
                {field.name}
            </span>
            <Field {...props} type={type} className={clsx(hasError ? 'border-red-600' : 'border-blue-light')} />
            <span
                className={clsx(
                    !hasError && 'opacity-0',
                    'text-red-600 duration-100 text-xs',
                )}
            >
                &nbsp;{meta.error}
            </span>
        </div>
    );
};

export const SignUp = () => (
    <div>
        <Formik
            initialValues={{ email: '', username: '', password: '' }}
            onSubmit={() => { }}
            validationSchema={SignUpSchema}
        >
            {({ submitForm }) => (
                <Form className="flex flex-col justify-around items-center p-5 space-y-5">
                    <TextField name="email" placeholder="email" />
                    <TextField name="username" placeholder="username" />
                    <TextField name="password" placeholder="password" type="password" />

                    <button type="submit" onClick={submitForm}>Sign Up</button>
                </Form>
            )}
        </Formik>
    </div>
);
