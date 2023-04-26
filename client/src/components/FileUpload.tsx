import { useField } from 'formik';
import { FC, PropsWithChildren } from 'react';

interface FileUploadProps {
    name: string;
    acceptedType: string;
}

export const FileUpload: FC<PropsWithChildren<FileUploadProps>> = ({ name, acceptedType, children }) => {
    const [,, { setValue, setTouched }] = useField<File>(name);

    const handleSelect = () => {
        const element = document.createElement('input');
        element.type = 'file';
        element.accept = acceptedType;
        element.click();
        setTouched(true);
        element.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                return;
            }
            if (file.type !== 'image/png') {
                return;
            }
            setValue(file);
        };
    };

    return (
        <div onClick={handleSelect}>
            {children}
        </div>
    );
};
