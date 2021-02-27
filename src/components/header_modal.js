import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function HeaderModal(props) {
    const { toggleModal, modalState, closeModal } = props;
    const user = useSelector(state => state.user);

    if (!modalState.show) {
        return null;
    };

    function modalAction() {
        if (modalState.desktop) {
            closeModal();
        } else {
            toggleModal();
        };
    };

    return (
        <div className="modal" onClick={modalAction}>
            <div className={`modal__wrapper ${modalState.animation}`} onClick={e => e.stopPropagation()}>
                <div className="modal__head">
                    <div className="modal__title">
                        { user ? user.attributes.name : "PState" }
                    </div>
                    <FontAwesomeIcon
                        className="modal__close"
                        icon={faTimes}
                        transform="down-3"
                        onClick={modalAction}
                    />
                </div>
                { props.children }
            </div>
        </div>
    );
};

export default HeaderModal;