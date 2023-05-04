import { motion } from 'framer-motion';
import { FC, PropsWithChildren, ReactElement, createContext, useCallback, useContext } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { useDialogContext } from './DialogContext';

const ConfirmationContext = createContext<(value: ReactElement) => Promise<boolean>>(undefined!);

interface ConfirmationDialogProps {
    onSelect: (value: boolean) => void;
}

export const ConfirmationDialog: FC<PropsWithChildren<ConfirmationDialogProps>> = ({ onSelect, children }) => (
    <motion.div
        className="card flex flex-col items-center gap-2 p-3"
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        exit={{ y: 150 }}
    >
        <span className="w-full text-left text-2xl">Confirm</span>
        <span className="text-lg">{children}</span>
        <div className="flex w-full justify-between">
            <CircleX size={40} className="cursor-pointer duration-200 hover:stroke-red-500" onClick={() => onSelect(false)} />
            <CircleCheck size={40} className="cursor-pointer duration-200 hover:stroke-green-500" onClick={() => onSelect(true)} />
        </div>
    </motion.div>
);

export const ConfirmationContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const openDialog = useDialogContext();

    const callback = useCallback((value: ReactElement) => new Promise<boolean>((resolve) => {
        openDialog(
            <ConfirmationDialog onSelect={(value) => {
                resolve(value);
                openDialog(null);
            }}
            >
                {value}
            </ConfirmationDialog>,
            () => resolve(false),
        );
    }), [openDialog]);

    return (
        <ConfirmationContext.Provider value={callback}>
            {children}
        </ConfirmationContext.Provider>
    );
};

export const useConfirmation = () => useContext(ConfirmationContext);
