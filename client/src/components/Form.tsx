import { FC } from 'react';
import { Field, FieldAttributes, useField } from 'formik';
import clsx from 'clsx';

export const TextField: FC<FieldAttributes<any>> = ({ type = 'text', ...props }) => {
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
                {props.placeholder}
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
