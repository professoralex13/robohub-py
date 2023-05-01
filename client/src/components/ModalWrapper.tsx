import { AnimatePresence } from 'framer-motion';
import { FC, PropsWithChildren, useEffect } from 'react';

interface ModalWrapperProps {
    open: boolean;
    onClose: () => void;
}

export const ModalWrapper: FC<PropsWithChildren<ModalWrapperProps>> = ({ open, onClose, children }) => {
    useEffect(() => {
        const callback = () => {
            if (open) {
                onClose();
            }
        };

        // Timeout with zero delay defers the adding of the event listener until then next event cycle.
        // This will be after the click event that opened the modal finishes propogating
        // Which prevents modal from closing immediately after opening
        setTimeout(() => document.addEventListener('click', callback), 0);

        return () => document.removeEventListener('click', callback);

        // We do not want onClose as a dependency because it is not a memoised value and will be a new function instance on each re render
        // This would sometimes cause the event listener to be added multiple times due to the derference in adding it
        //
        // Open should be a depdency because want the click handler to be removed and re added when the modal is opened and closed
        // Allowing us to delay the adding of the click handler until after the click event that opened the modal finishes propogating
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        // Prevents clicking inside the modal from closing it
        <div onClick={(e) => e.stopPropagation()}>
            <AnimatePresence>
                {open && children}
            </AnimatePresence>
        </div>
    );
};
