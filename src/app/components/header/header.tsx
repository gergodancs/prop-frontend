import React, {useState} from 'react';
import './header.scss';
import Modal from '@/app/components/modal/modal';
import Register from '@/app/components/register/register';
import {useAuth} from '@/context/AuthContext';
import {useTranslation} from "react-i18next";
import i18n from "i18next";

const Header = ({onToggleSidePanel}) => {
    const [openModal, setModalOpen] = useState(false);
    const {auth, logout} = useAuth();
    const {t} = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    return (
        <>
            <div className="header">
                <button onClick={onToggleSidePanel} className="toggle-button">
                    ☰
                </button>
                <div className="flex">
                    <div className="language-buttons">
                        <button onClick={() => changeLanguage('en')}>EN</button>
                        <button onClick={() => changeLanguage('de')}>DE</button>
                    </div>
                    {auth ? (
                        <div className="auth-info">
                            <span>{t("header.authInfo") + auth.user}</span>
                            <button onClick={logout} className="logout-button">{t("header.logout")}</button>
                        </div>
                    ) : (
                        <button onClick={() => setModalOpen(true)} className="auth-button">{t("header.signIn")}</button>
                    )}
                </div>

            </div>
            {openModal && (
                <Modal onClose={() => setModalOpen(false)}>
                    <Register onClose={() => setModalOpen(false)}/>
                </Modal>
            )}
        </>
    );
};

export default Header;
