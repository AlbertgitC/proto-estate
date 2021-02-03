import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Modal from './modal';
import { useState } from 'react';
import NavLinks from './nav-links';

function Header() {
    const [modalState, setModal] = useState({ show: false, animation: "modal__wrapper--hide" });

    function toggleNavLinks() {
        if (!modalState.show) {
            setModal({ show: true, animation: "modal__wrapper--show" });
        } else {
            setModal({ ...modalState, animation: "modal__wrapper--hide" });
            setTimeout(() => {
                setModal({ ...modalState, show: false });
            }, 500);
        };
    };

    return (
        <header className="header">
            <div className="header__logo">PState</div>
            <FontAwesomeIcon 
                icon={faBars} 
                transform="down-3" 
                className="header__nav"
                onClick={toggleNavLinks}
            />
            <Modal show={modalState.show} animeState={modalState.animation} toggleNavLinks={toggleNavLinks}>
                <NavLinks toggleNavLinks={toggleNavLinks}/>
            </Modal>
        </header>
    );
}

export default Header;