import { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import { useDispatch } from 'react-redux';
import * as RentalListingActions from '../util/actions/rental_listing_actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';
import config from '../aws-exports';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config

function RentalUpdateForm({ closeModal, listing }) {
    // const initialState = {
    //     type: "RentalListing",
    //     address: "",
    //     propertyType: "",
    //     monthlyRent: "",
    //     numberRooms: "",
    //     areaPin: "",
    //     description: ""
    // };
    const [state, setState] = useState(listing);
    const { address, propertyType, monthlyRent, numberRooms, areaPin, description, photos, postPhoto } = state;
    const [error, setError] = useState("");
    // const { closeModal, action, listing } = props;
    const dispatch = useDispatch();
    const [imageState, setImage] = useState({ 
        images: [], 
        display: photos.length < 3 ? "block" : "none"
    });

    // useEffect(() => {
    //     if (action === "Update") setState({
    //         id: listing.id,
    //         type: "RentalListing",
    //         address: listing.address,
    //         propertyType: listing.propertyType,
    //         monthlyRent: listing.monthlyRent,
    //         numberRooms: listing.numberRooms,
    //         areaPin: listing.areaPin > 0 ? listing.areaPin : "",
    //         description: listing.description
    //     });
    // }, [action, listing]);

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

    function setPostPhoto(imageKey) {
        setState({ ...state, postPhoto: imageKey });
    };

    function handleSubmit(e) {
        e.preventDefault();

        setError("讀取中...");

        let data = { ...state };
        if (state.areaPin === "") {
            data.areaPin = 0;
        };

        API.graphql({
            query: mutations.updateRentalListing,
            variables: { input: data }
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

        // if (action === "Create") {
        //     API.graphql({
        //         query: mutations.createRentalListing,
        //         variables: { input: data }
        //     })
        //         .then(res => {
        //             setError("uploading");
        //             let listing = res.data.createRentalListing;
        //             dispatch(RentalListingActions.createRentalListing(listing));

        //             if (imageState.images[0]) {
        //                 let imageKeys = [];
        //                 let uploadPromise = [];

        //                 for (let file of imageState.images) {
        //                     const extension = file.name.split(".")[1];
        //                     const { type: mimeType } = file;
        //                     const key = `images/${uuid()}_${listing.id}.${extension}`;
        //                     // live site url
        //                     // const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;

        //                     // mock storage url
        //                     // const url = `http://localhost:20005/${bucket}/public/${key}`;

        //                     imageKeys.push(key);

        //                     let promise = Storage.put(key, file, {
        //                         contentType: mimeType
        //                     });

        //                     uploadPromise.push(promise);
        //                 };

        //                 Promise.all(uploadPromise)
        //                     .then(() => {
        //                         return API.graphql({
        //                             query: mutations.updateRentalListing,
        //                             variables: {
        //                                 input: {
        //                                     id: listing.id,
        //                                     photos: imageKeys,
        //                                     postPhoto: imageKeys[0]
        //                                 }
        //                             }
        //                         });
        //                     })
        //                     .then(res => {
        //                         let listing = res.data.updateRentalListing;
        //                         dispatch(RentalListingActions.updateRentalListing(listing));
        //                     });
        //             };
        //         })
        //         .then(() => {
        //             setError("");
        //             closeModal();
        //         })
        //         .catch(err => {
        //             console.log("create rental listing error:", err);
        //             setError("Error creating reantal listing");
        //         });
        // } else if (action === "Update") {
        //     API.graphql({
        //         query: mutations.updateRentalListing,
        //         variables: { input: data }
        //     })
        //         .then(res => {
        //             setError("");
        //             let listing = res.data.updateRentalListing;
        //             dispatch(RentalListingActions.updateRentalListing(listing));
        //             closeModal();
        //         })
        //         .catch(err => {
        //             console.log("update rental listing error:", err);
        //             setError("Error updating reantal listing");
        //         });
        // };
    };

    return (
        <form className="rental-form" onSubmit={handleSubmit}>
            <label htmlFor="address" className="rental-form__label">地址<span style={{ color: "crimson" }}>*</span></label>
            <input
                className="rental-form__input"
                id="address"
                name="address"
                required
                maxLength="250"
                onChange={handleInput}
                value={address}
                placeholder="地址"
                autoComplete="off"
            />
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
            <label htmlFor="monthlyRent" className="rental-form__label">租金(月租)<span style={{ color: "crimson" }}>*</span></label>
            <input
                className="rental-form__input"
                id="monthlyRent"
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
            <label htmlFor="areaPin" className="rental-form__label">坪數</label>
            <input
                className="rental-form__input"
                id="areaPin"
                type="number"
                name="areaPin"
                onChange={handleNumInput}
                value={areaPin}
                placeholder="坪數"
                autoComplete="off"
            />
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
            <label className="rental-form__label">上傳照片(最多3張)</label>
            <div className="rental-form__image-wrapper">
                {
                    photos.map((imageKey, i) => {
                        let tag = null;
                        if (postPhoto === imageKey) tag = <div className="rental-form__image-tag">封面照片</div>;
                        return (
                            <div key={i} className="rental-form__image"
                                style={{ backgroundImage: `url(http://localhost:20005/${bucket}/public/${imageKey})` }}
                                onClick={() => { setPostPhoto(imageKey) }}>
                                {tag}
                                <FontAwesomeIcon
                                    className="rental-form__remove-image"
                                    icon={faTimes}
                                    size="2x"
                                    transform="up-0.2"
                                    // onClick={e => { removeImage(e, i) }}
                                />
                            </div>
                        );
                    })
                }
                {
                    imageState.images.map((image, i) => (
                        <div key={i} className="rental-form__image"
                            style={{ backgroundImage: `url(${URL.createObjectURL(image)})` }}>
                            {/* <div className="rental-form__image-tag">封面照片</div> */}
                            <FontAwesomeIcon
                                className="rental-form__remove-image"
                                icon={faTimes}
                                size="2x"
                                transform="up-0.2"
                                onClick={e => { removeImage(e, i) }}
                            />
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
            <button className="rental-form__button">確定</button>
            <p>{error}</p>
        </form>
    );
};

export default RentalUpdateForm;