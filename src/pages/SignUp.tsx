import { Field, FieldAttributes, Form, Formik, useField } from 'formik';
import { FC } from 'react';
import clsx from 'clsx';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

function validateEmail(email: string) {
    if (!email.match(emailRegex)) {
        return 'Invalid Email Format';
    }
    // TODO: Check for email already taken
    return '';
}

const TextField: FC<FieldAttributes<any>> = (props) => {
    const [_, meta] = useField(props);

    return (
        <div className="flex flex-col">
            <span className={clsx((!meta.error || !meta.touched) && 'opacity-0', 'text-red-600 ml-auto duration-100')}>&nbsp;{meta.error}</span>
            <Field {...props} type="text" className={clsx(meta.error ? 'border-red-600' : 'border-blue-light')} />
        </div>
    );
};

export const SignUp = () => (
    <div className="flex flex-col justify-around items-center p-5">
        <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={() => {}}
        >
            {() => (
                <Form>
                    <TextField name="email" placeholder="email" validate={validateEmail} />
                </Form>
            )}
        </Formik>
    </div>
);
