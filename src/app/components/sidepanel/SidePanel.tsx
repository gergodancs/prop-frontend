import React, {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {useFlats} from '@/context/FlatContext';
import Modal from '@/app/components/modal/modal';
import CreateAd from '@/app/components/createAd/createAd';
import './sidePanel.scss';
import {useTranslation} from "react-i18next";

const SidePanel = ({isOpen}) => {
    const {auth} = useAuth();
    const {myFlats} = useFlats();
    const {t} = useTranslation();
    const [showFlats, setShowFlats] = useState(false);
    const [openModal, setModalOpen] = useState(false);
    const [showFlatsForRent, setShowFlatsForRent] = useState(false);
    const [showFlatsForSale, setShowFlatsForSale] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const toggleFlatsForRent = () => {
        setShowFlatsForRent(!showFlatsForRent);
        setShowFlatsForSale(false);
    };

    const toggleFlatsForSale = () => {
        setShowFlatsForSale(!showFlatsForSale);
        setShowFlatsForRent(false);
    };

    const toggleShowFilter = () => {
        setShowFilters(prevState => !prevState);
        setShowFlatsForSale(false);
        setShowFlatsForRent(false);
    }

    return (
        <>
            <div className={`side-panel ${isOpen ? 'open' : ''}`}>
                <div className="panel-content">
                    {auth && (
                        <>
                            <div className="bottom-border">
                                <button onClick={() => setShowFlats(!showFlats)}
                                        className={showFlats ? 'active' : ''}>
                                    {t("sidePanel.menu.myProperty")}
                                </button>
                            </div>
                            {showFlats && (
                                <div>
                                    <div className="menu-item bottom-border"
                                         onClick={toggleFlatsForRent}>
                                        <button className={showFlatsForRent ? 'active' : ''}>
                                            {t("sidePanel.menu.propertyForRent")}
                                        </button>
                                    </div>
                                    {showFlatsForRent && (
                                        <div>
                                            {myFlats.flatsForRent.map((flat, index) => (
                                                <div key={index}
                                                     className="flat-item bottom-border">
                                                    {flat.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="menu-item bottom-border"
                                         onClick={toggleFlatsForSale}>
                                        <button className={showFlatsForSale ? 'active' : ''}>
                                            {t("sidePanel.menu.propertyForSale")}
                                        </button>
                                    </div>
                                    {showFlatsForSale && (
                                        <div>
                                            {myFlats.flatsForSale.map((flat, index) => (
                                                <div key={index}
                                                     className="flat-item bottom-border">
                                                    {flat.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <div className="bottom-border">
                        <button onClick={() => toggleShowFilter()}
                                className={showFlats ? 'active' : ''}>
                            {t("sidePanel.menu.filters")}
                        </button>
                    </div>
                    {showFilters &&
                        <>
                            <div className="filters">
                                <input type="text" placeholder="Search by title..."/>
                                <input type="number" placeholder="Min price"/>
                                <input type="number" placeholder="Max price"/>
                            </div>
                            <button className="add-flat-button w-100 center">
                                {t("sidePanel.button.applyFilters")}
                            </button>
                        </>}
                    <button onClick={() => setModalOpen(true)}
                            className="add-flat-button w-100 center">
                        {t("sidePanel.button.addNewProperty")}
                    </button>
                </div>
            </div>
            {openModal && (
                <Modal onClose={() => setModalOpen(false)}>
                    <CreateAd onClose={() => setModalOpen(false)}/>
                </Modal>
            )}
        </>
    );
};

export default SidePanel;
