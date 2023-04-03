import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren, ReactElement, ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';

const ConfirmationContext = createContext<(value: ReactElement) => Promise<boolean>>(undefined!);

interface ConfirmationDialogProps {
    onSelect: (value: boolean) => void;
}

export const ConfirmationDialog: FC<PropsWithChildren<ConfirmationDialogProps>> = ({ onSelect, children }) => (
    <motion.div
        className="absolute z-20 flex h-screen w-screen flex-col items-center justify-end overflow-hidden p-10 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onSelect(false)}
    >
        <motion.div
            className="card flex flex-col items-center gap-2 p-3"
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            onClick={(e) => e.stopPropagation()}
        >
            <span className="w-full text-left text-2xl">Confirm</span>
            <span className="text-lg">{children}</span>
            <div className="flex w-full justify-between">
                <CircleX size={40} className="cursor-pointer duration-200 hover:stroke-red-500" onClick={() => onSelect(false)} />
                <CircleCheck size={40} className="cursor-pointer duration-200 hover:stroke-green-500" onClick={() => onSelect(true)} />
            </div>
        </motion.div>
    </motion.div>
);

export const ConfirmationContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentElement, setCurrentElement] = useState<ReactNode>(null);

    const callback = useCallback((value: ReactElement) => new Promise<boolean>((resolve) => {
        setCurrentElement(
            <ConfirmationDialog onSelect={(value) => {
                setCurrentElement(null);
                resolve(value);
            }}
            >
                {value}
            </ConfirmationDialog>,
        );
    }), []);

    return (
        <ConfirmationContext.Provider value={callback}>
            <AnimatePresence>
                {currentElement}
            </AnimatePresence>
            {useMemo(() => children, [children])}
        </ConfirmationContext.Provider>
    );
};

export const useConfirmation = () => useContext(ConfirmationContext);
