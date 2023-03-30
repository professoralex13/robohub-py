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
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                    id="dialog-background"
                    className={clsx(
                        'absolute z-20 flex h-screen w-screen flex-col items-center justify-end overflow-hidden p-10 backdrop-blur-md',
                        state === 'entering' && 'animate-fadeIn',
                        state === 'exiting' && 'animate-fadeInRev',
                    )}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            select(false);
                        }
                    }}
                >
                    <div className={clsx(
                        'card flex flex-col items-center gap-2 p-3',
                        state === 'entering' && 'animate-fadeUp',
                        state === 'exiting' && 'animate-fadeUpRev',
                    )}
                    >
                        <span className="w-full text-left text-2xl">Confirm</span>
                        <span className="text-lg">{children}</span>
                        <div className="flex w-full justify-between">
                            <CircleX size={40} className="cursor-pointer duration-200 hover:stroke-red-500" onClick={() => select(false)} />
                            <CircleCheck size={40} className="cursor-pointer duration-200 hover:stroke-green-500" onClick={() => select(true)} />
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
