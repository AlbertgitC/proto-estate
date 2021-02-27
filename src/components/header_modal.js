import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function HeaderModal(props) {
    const { toggleModal, modalState } = props;
    const user = useSelector(state => state.user);

    if (!modalState.show) {
        return null;
    };

    return (
        <div className="modal" onClick={toggleModal}>
            <div className={`modal__wrapper ${modalState.animation}`} onClick={e => e.stopPropagation()}>
                <div className="modal__head">
                    <div className="modal__title">
                        { user ? user.attributes.name : "PState" }
                    </div>
                    <FontAwesomeIcon
                        icon={faTimes}
                        transform="down-3"
                        onClick={toggleModal}
                    />
                </div>
                { props.children }
            </div>
        </div>
    );
};

export default HeaderModal;