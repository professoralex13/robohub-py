import { FC, PropsWithChildren } from 'react';
import { AlertCircle, AlertTriangle } from 'tabler-icons-react';

export const ErrorBox: FC<PropsWithChildren> = ({ children }) => (
    <div className="
        bg-blue-dark border-red-400 border-2 rounded-md mb-4
        flex flex-row gap-3 items-center p-3"
    >
        <AlertCircle size={30} className="stroke-red-400" />
        <span className="text-lg text-red-400">{children}</span>
    </div>
);

export const WarningBox: FC<PropsWithChildren> = ({ children }) => (
    <div className="
        bg-blue-dark border-yellow-400 border-2 rounded-md mb-4
        flex flex-row gap-3 items-center p-3"
    >
        <AlertTriangle size={30} className="stroke-yellow-400" />
        <span className="text-lg text-yellow-300">{children}</span>
    </div>
);

export const MessageBox: FC<PropsWithChildren> = ({ children }) => (
    <div className="
        bg-blue-dark border-green-400 border-2 rounded-md mb-4
        flex flex-row gap-3 items-center p-3"
    >
        <span className="text-lg text-green-300">{children}</span>
    </div>
);
