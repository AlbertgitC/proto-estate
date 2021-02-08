import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import RentalModal from './rental_panel_modal';
import { useState } from 'react';

function RentalPanel(props) {
    const [modalState, setModal] = useState({ show: false, action: "Create" });

    return (
        <div className="rental-panel">
            <RentalModal modalState={modalState} setModal={setModal}/>
            <div className="rental-panel__header">
                <h3>Rental Properties</h3>
                <div className="rental-panel__add" onClick={() => { setModal({ show: true, action: "Create" })}}>
                    <FontAwesomeIcon
                        icon={faPlusSquare}
                        transform="left-5"
                    />Add a property
                </div>
            </div>
            <ul>

            </ul>
        </div>
    );
};

export default RentalPanel;