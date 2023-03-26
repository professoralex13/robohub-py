import clsx from 'clsx';
import { FC, PropsWithChildren, ReactElement, ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Transition } from 'react-transition-group';
import { CircleCheck, CircleX } from 'tabler-icons-react';

const ConfirmationContext = createContext<(value: ReactElement) => Promise<boolean>>(undefined!);

interface ConfirmationDialogProps {
    onExited: (value: boolean) => void;
}

export const ConfirmationDialog: FC<PropsWithChildren<ConfirmationDialogProps>> = ({ onExited, children }) => {
    const [shown, setShown] = useState(true);

    const [selection, setSelection] = useState<boolean | undefined>(undefined);

    const select = useCallback((value: boolean) => {
        setShown(false);
        setSelection(value);
    }, []);

    return (
        <Transition in={shown} timeout={250} onExited={() => onExited(selection ?? false)} unmountOnExit appear>
            {(state) => (
                <div
                    id="dialog-background"
                    className={clsx(
                        'absolute z-20 flex h-screen w-screen flex-col items-center justify-end overflow-hidden p-10 backdrop-blur-md',
                        state === 'entering' && 'animate-fadeinOpacity',
                        state === 'exiting' && 'animate-fadeoutOpacity',
                    )}
                >
                    <div className={clsx(
                        'card flex flex-col items-center gap-5 p-3',
                        state === 'entering' && 'animate-fadein',
                        state === 'exiting' && 'animate-fadeout',
                    )}
                    >
                        {children}
                        <div className="flex w-full justify-between gap-5">
                            <CircleCheck size={40} className="duration-200 hover:stroke-green-500" onClick={() => select(true)} />
                            <CircleX size={40} className="duration-200 hover:stroke-red-500" onClick={() => select(false)} />
                        </div>
                    </div>
                </div>
            )}
        </Transition>
    );
};

export const ConfirmationContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentElement, setCurrentElement] = useState<ReactNode>(null);

    const callback = useCallback((value: ReactElement) => new Promise<boolean>((resolve) => {
        setCurrentElement(
            <ConfirmationDialog onExited={(value) => {
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
            {currentElement}
            {useMemo(() => children, [children])}
        </ConfirmationContext.Provider>
    );
};

export const useConfirmation = () => useContext(ConfirmationContext);
