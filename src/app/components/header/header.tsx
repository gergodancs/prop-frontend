import React, { useState } from 'react';
import './header.scss';
import Modal from '@/app/components/modal/modal';
import Register from '@/app/components/register/register';
import { useAuth } from '@/context/AuthContext';

const Header = ({ onToggleSidePanel }) => {
    const [openModal, setModalOpen] = useState(false);
    const { auth, logout } = useAuth();

    return (
        <>
            <div className="header">
                <button onClick={onToggleSidePanel} className="toggle-button">
                    ☰
                </button>
                {auth ? (
                    <div className="auth-info">
                        <span>Logged in as: {auth.user}</span>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </div>
                ) : (
                    <button onClick={() => setModalOpen(true)} className="auth-button">Sign in / Sign up</button>
                )}
            </div>
            {openModal && (
                <Modal onClose={() => setModalOpen(false)}>
                    <Register onClose={() => setModalOpen(false)} />
                </Modal>
            )}
        </>
    );
};

export default Header;
