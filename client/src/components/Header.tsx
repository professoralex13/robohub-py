import { Search } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Transition } from 'react-transition-group';
import profilePicture from '../assets/profile_pic.png';
import caretIcon from '../assets/Caret.svg';
import { useProfileContext } from '../ProfileContext';

interface LinkProps {
    to: string;
}

const Link: FC<PropsWithChildren<LinkProps>> = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => clsx('text-xl link', isActive && 'underline text-navy-300')}>{children}</NavLink>
);

const AccountModal: FC<{ username: string, open: boolean }> = ({ username, open }) => {
    const ref = useRef(null);

    return (
        <Transition in={open} nodeRef={ref} timeout={250} unmountOnExit>
            {(state) => (
                <div
                    ref={ref}
                    className={clsx(
                        'card flex flex-col w-max absolute right-0 top-16',
                        state === 'entering' && 'animate-slidedown',
                        state === 'exiting' && 'animate-slidedownRev',
                    )}
                >
                    <span className="px-4 py-2 border-b-2 border-slate-700 text-lg">Username: <br /><strong>{username}</strong></span>
                    <NavLink to="/organisations" className="modal-item">
                        Your organisations
                    </NavLink>
                    <NavLink to="/settings" className="modal-item">
                        Settings
                    </NavLink>
                    <NavLink to="/logout" className="modal-item rounded-b-md border-t-2 border-slate-700">
                        Sign out
                    </NavLink>
                </div>
            )}
        </Transition>
    );
};

const AccountSection = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const profile = useProfileContext();

    // TODO: Make a generic way to do this
    useEffect(() => {
        const callback = () => {
            setModalOpen(false);
        };

        if (modalOpen) {
            document.addEventListener('click', callback);
        } else {
            document.removeEventListener('click', callback);
        }
    }, [modalOpen]);

    if (!profile) {
        return (
            <>
                <Link to="/sign-in">Sign In</Link>
                <Link to="/sign-up">Sign Up</Link>
            </>
        );
    }

    return (
        <div className="relative">
            <button
                className="flex flex-row gap-2 items-center"
                onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen((state) => !state);
                }}
                type="button"
            >
                <img src={profilePicture} alt="profile" className="h-12 w-12 rounded-full" />
                <img src={caretIcon} alt="caret" />
            </button>
            <AccountModal username={profile.username} open={modalOpen} />
        </div>
    );
};

export const Header = () => (
    <header className="flex items-center p-5 border-b-4 gap-16 border-navy-300 justify-between fixed top-0 w-screen z-10">
        <NavLink to="/" className="text-navy-300 text-5xl mr-auto">robohub</NavLink>
        <Link to="/blogs">Blogs</Link>
        <Link to="/teams">Teams</Link>
        <AccountSection />
        <Search className="hover:stroke-navy-300 duration-100" />
    </header>
);
