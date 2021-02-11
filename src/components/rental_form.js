import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import { useDispatch } from 'react-redux';
import * as RentalListingActions from '../util/actions/rental_listing_actions';

function RentalForm(props) {
    const initialState = {
        address: "",
        type: "",
        monthlyRent: "",
        numberRooms: "",
        areaPin: "",
        description: ""
    };
    const [state, setState] = useState(initialState);
    const { address, type, monthlyRent, numberRooms, areaPin, description } = state;
    const [error, setError] = useState("");
    const { closeModal, action, listing } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (action === "Update") setState({
            id: listing.id,
            address: listing.address,
            type: listing.type,
            monthlyRent: listing.monthlyRent,
            numberRooms: listing.numberRooms,
            areaPin: listing.areaPin,
            description: listing.description
        });
    },[action, listing]);

    function handleInput(e) {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    function handleNumInput(e) {
        let val = e.target.value;
        if (val === "") {
            setState({ ...state, [e.target.name]: val });
        } else {
            let numVal = parseFloat(val);
            setState({ ...state, [e.target.name]: numVal });
        };
    };

    function handleSubmit(e) {
        e.preventDefault();
        
        setError("讀取中...");

        if (action === "Create") {
            API.graphql({
                query: mutations.createRentalListing,
                variables: { input: state }
            })
                .then(res => {
                    setError("");
                    let listing = res.data.createRentalListing;
                    dispatch(RentalListingActions.createRentalListing(listing));
                    closeModal();
                })
                .catch(err => {
                    console.log("create rental listing error:", err);
                    setError("Error creating reantal listing");
                });
        } else if (action === "Update") {
            API.graphql({
                query: mutations.updateRentalListing,
                variables: { input: state }
            })
                .then(res => {
                    setError("");
                    let listing = res.data.updateRentalListing;
                    dispatch(RentalListingActions.updateRentalListing(listing));
                    closeModal();
                })
                .catch(err => {
                    console.log("update rental listing error:", err);
                    setError("Error updating reantal listing");
                });
        };
    };

    return (
        <form className="rental-form" onSubmit={handleSubmit}>
            <label htmlFor="address" className="rental-form__label">地址<span style={{ color: "crimson" }}>*</span></label>
            <input
                className="rental-form__input"
                name="address"
                required
                maxLength="250"
                onChange={handleInput}
                value={address}
                placeholder="地址"
                autoComplete="off"
            />
            <label htmlFor="type" className="rental-form__label">類型<span style={{ color: "crimson" }}>*</span></label>
            <select
                name="type"
                onChange={handleInput}
                required
                value={type}
            >
                <option value="" disabled hidden>選擇類型</option>
                <option value="整層住家">整層住家</option>
                <option value="獨立套房">獨立套房</option>
                <option value="分租套房">分租套房</option>
                <option value="雅房">雅房</option>
            </select>
            <label htmlFor="monthlyRent" className="rental-form__label">租金(月租)<span style={{ color: "crimson" }}>*</span></label>
            <input
                className="rental-form__input"
                type="number"
                name="monthlyRent"
                required
                onChange={handleNumInput}
                value={monthlyRent}
                placeholder="租金"
                autoComplete="off"
            />
            <label htmlFor="numberRooms" className="rental-form__label">格局<span style={{ color: "crimson" }}>*</span></label>
            <select
                name="numberRooms"
                onChange={handleNumInput}
                required
                value={numberRooms}
            >
                <option value="" disabled hidden>選擇格局</option>
                <option value="1">1房</option>
                <option value="2">2房</option>
                <option value="3">3房</option>
                <option value="4">4房</option>
                <option value="5">5房</option>
                <option value="6">6房</option>
                <option value="7">7房</option>
                <option value="8">8房</option>
            </select>
            <label htmlFor="areaPin" className="rental-form__label">坪數</label>
            <input
                className="rental-form__input"
                type="number"
                name="areaPin"
                onChange={handleNumInput}
                value={areaPin}
                placeholder="坪數"
                autoComplete="off"
            />
            <label htmlFor="description" className="rental-form__label">Detailed description</label>
            <textarea
                className="rental-form__input"
                maxLength="250"
                name="description"
                onChange={handleInput}
                value={description}
                autoComplete="off"
            />
            <button className="rental-form__button">確定</button>
            <p>{error}</p>
        </form>
    );
};

export default RentalForm;