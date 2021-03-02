import { useState } from 'react';
import { API, Storage } from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import { useDispatch } from 'react-redux';
import * as RentalListingActions from '../util/actions/rental_listing_actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';

function RentalForm({ closeModal }) {
    const initialState = {
        type: "RentalListing",
        address: "",
        propertyType: "",
        monthlyRent: "",
        numberRooms: "",
        areaPin: "",
        description: "",
        photos: []
    };
    const [state, setState] = useState(initialState);
    const { address, propertyType, monthlyRent, numberRooms, areaPin, description } = state;
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [imageState, setImage] = useState({ images: [], display: "block" });

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

    function handleImageInput(e) {
        let file = e.target.files[0];
        e.target.value = "";
        if (!file) return;
        let nextState = { ...imageState };
        nextState.images.push(file);
        if (nextState.images.length >= 3) {
            nextState.display = "none";
        };
        setImage(nextState);
    };

    function removeImage(e, idx) {
        e.stopPropagation();
        let nextState = { ...imageState };
        nextState.images.splice(idx, 1);
        nextState.display = "block";
        setImage(nextState);
    };

    function handleSubmit(e) {
        e.preventDefault();
        
        setError("讀取中...");

        let data = { ...state };
        if (state.areaPin === "") {
            data.areaPin = 0;
        };

        API.graphql({
            query: mutations.createRentalListing,
            variables: { input: data }
        })
            .then(res => {
                setError("uploading");
                let listing = res.data.createRentalListing;
                dispatch(RentalListingActions.createRentalListing(listing));

                if (imageState.images[0]) {
                    let imageKeys = [];
                    let uploadPromise = [];

                    for (let file of imageState.images) {
                        const extension = file.name.split(".")[1];
                        const { type: mimeType } = file;
                        const key = `images/${uuid()}_${listing.id}.${extension}`;

                        imageKeys.push(key);

                        let promise = Storage.put(key, file, {
                            contentType: mimeType
                        });

                        uploadPromise.push(promise);
                    };

                    Promise.all(uploadPromise)
                        .then(() => {
                            return API.graphql({
                                query: mutations.updateRentalListing,
                                variables: {
                                    input: {
                                        id: listing.id,
                                        photos: imageKeys
                                    }
                                }
                            });
                        })
                        .then(res => {
                            let listing = res.data.updateRentalListing;
                            dispatch(RentalListingActions.updateRentalListing(listing));
                        });
                };
            })
            .then(() => {
                setError("");
                closeModal();
            })
            .catch(err => {
                console.log("create rental listing error:", err);
                setError("Error creating reantal listing");
            });
    };

    return (
        <form className="rental-form" onSubmit={handleSubmit}>
            <button disabled style={{ display: "none" }} />
            <div className="rental-form__input">
                <label htmlFor="address" className="rental-form__label">地址<span style={{ color: "crimson" }}>*</span></label>
                <input
                    id="address"
                    name="address"
                    required
                    maxLength="250"
                    onChange={handleInput}
                    value={address}
                    placeholder="地址"
                    autoComplete="off"
                />
            </div>
            <div className="rental-form__input">
                <label htmlFor="propertyType" className="rental-form__label">類型<span style={{ color: "crimson" }}>*</span></label>
                <select
                    id="propertyType"
                    name="propertyType"
                    onChange={handleInput}
                    required
                    value={propertyType}
                >
                    <option value="" disabled hidden>選擇類型</option>
                    <option value="整層住家">整層住家</option>
                    <option value="獨立套房">獨立套房</option>
                    <option value="分租套房">分租套房</option>
                    <option value="雅房">雅房</option>
                </select>
            </div>
            <div className="rental-form__input">
                <label htmlFor="monthlyRent" className="rental-form__label">租金(月租)<span style={{ color: "crimson" }}>*</span></label>
                <input
                    id="monthlyRent"
                    type="number"
                    name="monthlyRent"
                    required
                    onChange={handleNumInput}
                    value={monthlyRent}
                    placeholder="租金"
                    autoComplete="off"
                />
            </div>
            <div className="rental-form__input">
                <label htmlFor="numberRooms" className="rental-form__label">格局<span style={{ color: "crimson" }}>*</span></label>
                <select
                    id="numberRooms"
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
            </div>
            <div className="rental-form__input">
                <label htmlFor="areaPin" className="rental-form__label">坪數</label>
                <input
                    id="areaPin"
                    type="number"
                    name="areaPin"
                    onChange={handleNumInput}
                    value={areaPin}
                    placeholder="坪數"
                    autoComplete="off"
                />
            </div>
            <div className="rental-form__input rental-form__input--full-width">
                <label htmlFor="description" className="rental-form__label">Detailed description</label>
                <textarea
                    className="rental-form__textarea"
                    id="description"
                    maxLength="500"
                    name="description"
                    onChange={handleInput}
                    value={description}
                    autoComplete="off"
                />
                <small>{`${description.length}/500`}</small>
            </div>
            <div className="rental-form__input rental-form__input--full-width">
                <label className="rental-form__label">上傳照片(最多3張)</label>
                <div className="rental-form__image-wrapper">
                    {
                        imageState.images.map((image, i) => (
                            <div key={i} className="rental-form__image-padding">
                                <div className="rental-form__image" 
                                    style={{ backgroundImage: `url(${URL.createObjectURL(image)})`}}>
                                    <FontAwesomeIcon
                                        className="rental-form__remove-image"
                                        icon={faTimes}
                                        size="2x"
                                        transform="up-0.2"
                                        onClick={e => {removeImage(e, i)}}
                                    />
                                </div>
                            </div>
                            
                        ))
                    }
                    <div className="rental-form__add-image" style={{ display: `${imageState.display}` }}>
                        <label htmlFor="image-uploads">
                            <FontAwesomeIcon
                                icon={faPlusSquare}
                                size="4x"
                                transform="right-0.9"
                            />
                        </label>
                        <input 
                            type="file" 
                            id="image-uploads" 
                            accept="image/*"
                            onChange={handleImageInput}
                            style={{ opacity: "0", width: "0" }}
                        />
                    </div>
                </div>
            </div>
            <div className="rental-form__error rental-form__input--full-width">
                <p>{error}</p>
            </div>
            <div className="rental-form__input rental-form__input--full-width">
                <button className="rental-form__button rental-form__button--submit">確定</button>
            </div>
            <div className="rental-form__input rental-form__input--full-width">
                <button className="rental-form__button" type="button" onClick={closeModal}>取消</button>
            </div>
        </form>
    );
};

export default RentalForm;