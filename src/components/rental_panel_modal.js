import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import RentalForm from './rental_form';

function RentalModal(props) {
    const { show, action } = props.modalState;
    const { setModal } = props;

    if (!show) {
        return null;
    };

    function closeModal() {
        setModal({ show: false, action: "Create" });
    };

    return (
        <div className="rental-modal" onClick={closeModal}>
            <div className="rental-modal__wrapper" onClick={e => e.stopPropagation()}>
                <div className="rental-modal__head">
                    <h3 className="rental-modal__title">
                        {`${action} Rental Property`}
                    </h3>
                    <FontAwesomeIcon
                        icon={faTimes}
                        transform="down-3"
                        onClick={closeModal}
                    />
                </div>
                <RentalForm closeModal={closeModal}/>
            </div>
        </div>
    );
};

export default RentalModal;