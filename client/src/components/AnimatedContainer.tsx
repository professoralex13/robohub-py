import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';
import useMeasure from 'react-use-measure';

interface AnimatedContainerProps {
    duration?: number;
}

export const AnimatedContainer: FC<PropsWithChildren<AnimatedContainerProps>> = ({ duration, children }) => {
    const [ref, { height }] = useMeasure();

    return (
        <motion.div
            className="overflow-hidden"
            animate={{ height }}
            transition={{ duration }}
            initial={false}
        >
            <AnimatePresence initial={false}>
                <div ref={ref}>
                    {children}
                </div>
            </AnimatePresence>
        </motion.div>
    );
};
