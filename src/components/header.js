import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Modal from './modal';
import { useState } from 'react';

function Header() {
    const [modalState, setModal] = useState({ show: false, animation: "modal__wrapper--hide" });

    function toggleNavLinks() {
        if (!modalState.show) {
            setModal({ show: true, animation: "modal__wrapper--show" });
        } else {
            setModal({ ...modalState, animation: "modal__wrapper--hide" });
            setTimeout(() => {
                setModal({ ...modalState, show: false });
            }, 300);
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
            <Modal modalState={modalState} toggleNavLinks={toggleNavLinks}/>
        </header>
    );
}

export default Header;