import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NavLinks from './nav_links';

function Modal(props) {
    const { toggleNavLinks, modalState } = props;
    const [component, setComponent] = useState(null);

    if (!modalState.show) {
        return null;
    };

    function closeModal() {
        toggleNavLinks();
        setTimeout(() => {
            setComponent(null);
        }, 600);
    };
    
    return (
        <div className="modal" onClick={closeModal}>
            <div className={`modal__wrapper ${modalState.animation}`} onClick={e => e.stopPropagation()}>
                <div className="modal__head">
                    <div className="modal__logo">PState</div>
                    <FontAwesomeIcon
                        icon={faTimes}
                        transform="down-3"
                        onClick={closeModal}
                    />
                </div>
                {component ? component : <NavLinks setComponent={setComponent}/>}
            </div>
        </div>
    );
};

export default Modal;