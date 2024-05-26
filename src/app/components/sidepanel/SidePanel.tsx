import React, {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {useFlats} from '@/context/FlatContext';
import Modal from '@/app/components/modal/modal';
import CreateAd from '@/app/components/createAd/createAd';
import './sidePanel.scss';

const SidePanel = ({isOpen}) => {
    const {auth} = useAuth();
    const {myFlats} = useFlats();
    const [showFlats, setShowFlats] = useState(false);
    const [openModal, setModalOpen] = useState(false);
    const [showFlatsForRent, setShowFlatsForRent] = useState(false);
    const [showFlatsForSale, setShowFlatsForSale] = useState(false);

    const toggleFlatsForRent = () => {
        setShowFlatsForRent(!showFlatsForRent);
        setShowFlatsForSale(false);
    };

    const toggleFlatsForSale = () => {
        setShowFlatsForSale(!showFlatsForSale);
        setShowFlatsForRent(false);
    };

    return (
        <>
            <div className={`side-panel ${isOpen ? 'open' : ''}`}>
                <div className="panel-content">
                    {auth && (
                        <>

                            <button onClick={() => setShowFlats(!showFlats)} className={showFlats ? 'active' : ''}>
                                My Flats
                            </button>
                            {showFlats && (
                                <div>
                                    <div className="menu-item" onClick={toggleFlatsForRent}>
                                        <button className={showFlatsForRent ? 'active' : ''}>Flats for Rent</button>
                                    </div>
                                    {showFlatsForRent && (
                                        <div>
                                            {myFlats.flatsForRent.map((flat, index) => (
                                                <div key={index} className="flat-item">
                                                    {flat.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="menu-item" onClick={toggleFlatsForSale}>
                                        <button className={showFlatsForSale ? 'active' : ''}>Flats for Sale</button>
                                    </div>
                                    {showFlatsForSale && (
                                        <div>
                                            {myFlats.flatsForSale.map((flat, index) => (
                                                <div key={index} className="flat-item">
                                                    {flat.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <h3>Filters</h3>
                    <div className="filters">
                        <input type="text" placeholder="Search by title..."/>
                        <input type="number" placeholder="Min price"/>
                        <input type="number" placeholder="Max price"/>
                    </div>
                    <button className="add-flat-button">Apply Filters</button>
                    <button onClick={() => setModalOpen(true)} className="add-flat-button">
                        Add New Property
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
