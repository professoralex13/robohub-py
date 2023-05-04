import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren, ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

const DialogContext = createContext<(dialog: ReactNode, onClose?: () => void) => void>(undefined!);

export const DialogContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [dialog, setDialog] = useState<ReactNode>(null);
    const [onClose, setOnClose] = useState<() => void>(() => () => { });

    return (
        <DialogContext.Provider value={useCallback((dialog, onClose) => {
            setDialog(dialog);
            // Setting a state value to a function is strange because react can accept a function as a constructor for a state value
            // If set function is not wrapped react will call onClose it like its a constructor
            if (onClose) {
                setOnClose(() => () => onClose());
            } else {
                setOnClose(() => () => { });
            }
        }, [])}
        >
            <AnimatePresence>
                {dialog && (
                    <motion.div
                        className="absolute z-20 flex h-screen w-screen flex-col items-center justify-end overflow-hidden p-10 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            // Prevents closing of other dialogs which may have been opened already behind
                            e.stopPropagation();

                            // Ensures that this click event was only triggered on the backdrop and not on the dialog itself
                            if (e.currentTarget !== e.target) return;
                            setDialog(null);
                            onClose();
                        }}
                    >
                        {dialog}
                    </motion.div>
                )}
            </AnimatePresence>
            {useMemo(() => children, [children])}
        </DialogContext.Provider>
    );
};

export const useDialogContext = () => useContext(DialogContext);
