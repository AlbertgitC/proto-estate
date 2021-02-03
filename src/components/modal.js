
function Modal(props) {
    if (!props.show) {
        return null;
    };
    const { toggleNavLinks } = props;
    return (
        <div className="modal" onClick={toggleNavLinks}>
            <div className={`modal__wrapper ${props.animeState}`} onClick={e => e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;