import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function RentalModal(props) {
    const initialState = {
        address: "",
        type: "",
        monthlyRent: "",
        numberRooms: "",
        areaPin: "",
        description: "",
        err: ""
    };
    const [state, setState] = useState(initialState);
    const { show, action } = props.modalState;
    const { setModal } = props;
    const { address, monthlyRent, areaPin, description, err } = state;

    if (!show) {
        return null;
    };

    function closeModal() {
        setModal({ show: false, action: "Create" });
    };

    function handleInput(e) {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    function handleSubmit(e) {
        e.preventDefault();
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
                <form className="rental-form" onSubmit={handleSubmit}>
                    <label for="address" className="rental-form__label">地址<span style={{ color: "crimson" }}>*</span></label>
                    <input
                        className="rental-form__input"
                        name="address"
                        required
                        onChange={handleInput}
                        value={address}
                        placeholder="地址"
                        autocomplete="off"
                    />
                    <label for="type" className="rental-form__label">類型<span style={{ color: "crimson" }}>*</span></label>
                    <select 
                        name="type" 
                        onChange={handleInput}
                        required
                    >
                        <option value="" disabled selected hidden>選擇類型</option>
                        <option value="整層住家">整層住家</option>
                        <option value="獨立套房">獨立套房</option>
                        <option value="分租套房">分租套房</option>
                        <option value="雅房">雅房</option>
                    </select>
                    <label for="monthlyRent" className="rental-form__label">租金(月租)<span style={{ color: "crimson" }}>*</span></label>
                    <input
                        className="rental-form__input"
                        type="number"
                        name="monthlyRent"
                        required
                        onChange={handleInput}
                        value={monthlyRent}
                        placeholder="租金"
                        autocomplete="off"
                    />
                    <label for="numberRooms" className="rental-form__label">格局<span style={{ color: "crimson" }}>*</span></label>
                    <select
                        name="numberRooms"
                        onChange={handleInput}
                        required
                    >
                        <option value="" disabled selected hidden>選擇格局</option>
                        <option value="1">1房</option>
                        <option value="2">2房</option>
                        <option value="3">3房</option>
                        <option value="4">4房</option>
                        <option value="5">5房</option>
                        <option value="6">6房</option>
                        <option value="7">7房</option>
                        <option value="8">8房</option>
                    </select>
                    <label for="areaPin" className="rental-form__label">坪數</label>
                    <input
                        className="rental-form__input"
                        type="number"
                        name="areaPin"
                        onChange={handleInput}
                        value={areaPin}
                        placeholder="坪數"
                        autocomplete="off"
                    />
                    <label for="description" className="rental-form__label">Detailed description</label>
                    <textarea
                        className="rental-form__input"
                        maxLength="250"
                        name="description"
                        onChange={handleInput}
                        value={description}
                        autocomplete="off"
                    />
                    <button className="rental-form__button">確定</button>
                </form>
            </div>
        </div>
    );
};

export default RentalModal;