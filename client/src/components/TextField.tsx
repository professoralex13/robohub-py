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
                    hasError ? 'text-red-400' : 'text-neutral-50',
                    'bg-navy-800 absolute left-2 top-[-0.7rem] px-1 duration-100',
                )}
            >
                {props.placeholder}
            </span>
            <Field {...props} type={type} className={clsx(hasError && 'error')} />
            <span
                className={clsx(
                    !hasError && 'opacity-0',
                    'text-xs text-red-400 duration-100',
                )}
            >
                &nbsp;{meta.error}
            </span>
        </div>
    );
};
