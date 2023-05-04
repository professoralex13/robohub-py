import { Search } from 'tabler-icons-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FC, PropsWithChildren, useState } from 'react';
import clsx from 'clsx';
import caretIcon from 'assets/Caret.svg';
import { useProfileContext } from 'contexts/ProfileContext';
import { useAuthenticationContext } from 'contexts/AuthenticationContext';
import { motion } from 'framer-motion';
import { API_URL } from 'hooks/useRequest';
import { ModalWrapper } from './ModalWrapper';

interface LinkProps {
    to: string;
}

const Link: FC<PropsWithChildren<LinkProps>> = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => clsx('link text-xl', isActive && 'text-navy-300 underline')}>{children}</NavLink>
);

interface AccountModalProps {
    username: string;
    onSelect: () => void;
}

const AccountModal: FC<AccountModalProps> = ({ username, onSelect }) => {
    const { logout } = useAuthenticationContext();

    const navigate = useNavigate();

    return (
        <motion.div
            className="card absolute right-0 top-16 flex w-max flex-col"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
        >
            <span className="border-b-2 border-slate-700 px-4 py-2 text-lg">Username: <br /><strong>{username}</strong></span>
            <div className="flex flex-col" onClick={onSelect}>
                <NavLink to="/organisations" className="modal-item" onClick={onSelect}>
                    Your organisations
                </NavLink>
                <NavLink to="/settings" className="modal-item" onClick={onSelect}>
                    Settings
                </NavLink>

                <button onClick={() => logout().finally(() => navigate('/'))} type="button" className="modal-item rounded-b-md border-t-2 border-slate-700 text-left">
                    Sign out
                </button>
            </div>
        </motion.div>
    );
};

const AccountSection = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const profile = useProfileContext();

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
                className="flex flex-row items-center gap-2"
                onClick={() => setModalOpen(true)}
                type="button"
            >
                <img src={`${API_URL}/content/avatar/users/${profile.id}`} alt="profile" className="h-12 w-12 rounded-full" />
                <img src={caretIcon} alt="caret" />
            </button>
            <ModalWrapper open={modalOpen} onClose={() => setModalOpen(false)}>
                <AccountModal onSelect={() => setModalOpen(false)} username={profile.username} />
            </ModalWrapper>
        </div>
    );
};

export const Header = () => (
    <header className="border-navy-300 fixed top-0 z-10 flex w-screen items-center justify-between gap-16 border-b-4 p-5">
        <NavLink to="/" className="text-navy-300 mr-auto text-5xl">robohub</NavLink>
        <Link to="/blogs">Blogs</Link>
        <Link to="/teams">Teams</Link>
        <AccountSection />
        <Search className="hover:stroke-navy-300 duration-100" />
    </header>
);
