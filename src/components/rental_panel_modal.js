import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import RentalForm from './rental_form';
import RentalUpdateForm from './rental_update_form';

function RentalModal(props) {
    const { show, action, listing } = props.modalState;
    const { setModal } = props;

    if (!show) {
        return null;
    };

    function closeModal() {
        setModal({ show: false, action: "Create", listing: null });
    };

    let component;
    if (action === "Create") component = <RentalForm closeModal={closeModal} />;
    if (action === "Update") component = <RentalUpdateForm closeModal={closeModal} listing={listing} />;

    return (
        <div className="rental-modal" onClick={closeModal}>
            <div className="rental-modal__wrapper" onClick={e => e.stopPropagation()}>
                <div className="rental-modal__head">
                    <h3 className="rental-modal__title">
                        {`${action} Rental Property`}
                    </h3>
                    <FontAwesomeIcon
                        className="rental-modal__close"
                        icon={faTimes}
                        transform="down-3"
                        onClick={closeModal}
                    />
                </div>
                {component}
            </div>
        </div>
    );
};

export default RentalModal;