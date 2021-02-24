import { useState } from 'react';
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
    const initialState = { 
        id: listing.id,
        address: listing.address,
        propertyType: listing.propertyType,
        monthlyRent: listing.monthlyRent,
        numberRooms: listing.numberRooms,
        areaPin: listing.areaPin,
        description: listing.description,
        photos: listing.photos.slice(),
        postPhoto: listing.postPhoto
    };
    const [state, setState] = useState(initialState);
    const { id, address, propertyType, monthlyRent, numberRooms, areaPin, description, photos, postPhoto } = state;
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [imageState, setImage] = useState({ 
        images: [],
        deleteQueue: []
    });
    const { images, deleteQueue } = imageState;

    function renderPlus() {
        let display = photos.length - deleteQueue.length +
            images.length < 3 ? "block" : "none";

        return (
            <div className="rental-form__add-image" style={{ display: `${display}` }}>
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
        );
    };

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
        setImage(nextState);
        if (postPhoto === "") setState({ ...state, postPhoto: file.name });
    };

    function removeImage(e, idx) {
        e.stopPropagation();
        let nextState = { ...imageState };
        let imgName = images[idx].name;
        nextState.images.splice(idx, 1);
        setImage(nextState);

        if (postPhoto === imgName) {
            let nextPostPhoto;
            if (photos.length > deleteQueue.length) {
                let diff = photos.filter(key => !deleteQueue.includes(key));
                nextPostPhoto = diff[0];
            } else if (nextState.images[0]) {
                nextPostPhoto = nextState.images[0].name;
            } else {
                nextPostPhoto = "";
            };
            setState({ ...state, postPhoto: nextPostPhoto });
        };
    };

    function setPostPhoto(imageKey) {
        if (postPhoto !== imageKey && !(deleteQueue.includes(imageKey))) 
            setState({ ...state, postPhoto: imageKey });
    };

    function deleteQueueAction(e, imageKey) {
        e.stopPropagation();
        if (!deleteQueue.includes(imageKey)) {
            deleteQueue.push(imageKey);
            if (postPhoto === imageKey) {
                let nextPostPhoto;
                if (photos.length > deleteQueue.length) {
                    let diff = photos.filter(key => !deleteQueue.includes(key));
                    nextPostPhoto = diff[0];
                } else if (images[0]) {
                    nextPostPhoto = images[0].name;
                } else {
                    nextPostPhoto = "";
                };
                setState({ ...state, postPhoto: nextPostPhoto });
            };
        } else {
            let idx = deleteQueue.indexOf(imageKey);
            deleteQueue.splice(idx, 1);
            let total = photos.length - deleteQueue.length + images.length;
            if (total > 3) {
                let i = images.length - 1;
                removeImage(e, i);
            };
            if (postPhoto === "") setState({ ...state, postPhoto: imageKey });
        }
        setImage({ ...imageState });
    };

    function handleSubmit(e) {
        e.preventDefault();

        setError("讀取中...");

        let data = { ...state, photos: state.photos.slice() };
        if (data.areaPin === "") {
            data.areaPin = 0;
        };

        const actionItems = [];
        if (images[0]) {
            for (let file of images) {
                const extension = file.name.split(".")[1];
                const { type: mimeType } = file;
                const key = `images/${uuid()}_${id}.${extension}`;
                data.photos.push(key);
                if (file.name === postPhoto) data.postPhoto = key;
                actionItems.push(Storage.put(key, file, { contentType: mimeType }));
            };
        };

        if (deleteQueue[0]) {
            for (let key of deleteQueue) {
                let idx = data.photos.indexOf(key);
                data.photos.splice(idx, 1);
                actionItems.push(Storage.remove(key));
            };
        };

        actionItems.push(API.graphql({ 
            query: mutations.updateRentalListing,
            variables: { input: data }
        }));

        Promise.all(actionItems)
            .then(res => {
                setError("");
                let newListing = res[res.length - 1].data.updateRentalListing;
                dispatch(RentalListingActions.updateRentalListing(newListing));
                closeModal();
            })
            .catch(err => {
                console.log("update rental listing error:", err);
                setError("Error updating reantal listing");
            });
    };

    return (
        <form className="rental-form" onSubmit={handleSubmit}>
            <button disabled style={{ display: "none" }} />
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
            <label className="rental-form__label">上傳照片(最多3張，點擊照片選擇封面照片)</label>
            <div className="rental-form__image-wrapper">
                {
                    photos.map((imageKey, i) => {
                        let tag = null;
                        if (postPhoto === imageKey) tag = <div className="rental-form__image-tag">封面照片</div>;
                        let whiteOut = "";
                        let red = "";
                        if (deleteQueue.includes(imageKey)) {
                            whiteOut = "rental-form__image-overlay--white-out";
                            red = "rental-form__remove-image--selected";
                        };
                        return (
                            <div 
                                key={i} 
                                className="rental-form__image"
                                // live site url
                                // const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${imageKey}`;

                                // mock storage url
                                // const url = `http://localhost:20005/${bucket}/public/${imageKey}`;
                                style={{ backgroundImage: `url(http://localhost:20005/${bucket}/public/${imageKey})` }}
                                onClick={() => { setPostPhoto(imageKey) }}
                            >
                                <div className={`rental-form__image-overlay ${whiteOut}`}>
                                    {tag}
                                    <FontAwesomeIcon
                                        className={`rental-form__remove-image ${red}`}
                                        icon={faTimes}
                                        size="2x"
                                        transform="up-0.2"
                                        onClick={e => { deleteQueueAction(e, imageKey) }}
                                    />
                                </div>
                            </div>
                        );
                    })
                }
                {
                    images.map((image, i) => {
                        let tag = null;
                        if (postPhoto === image.name) tag = <div className="rental-form__image-tag">封面照片</div>;
                        return (
                            <div 
                                key={i} 
                                className="rental-form__image rental-form__image-overlay"
                                style={{ backgroundImage: `url(${URL.createObjectURL(image)})` }}
                                onClick={() => { setPostPhoto(image.name) }}>
                                {tag}
                                <FontAwesomeIcon
                                    className="rental-form__remove-image"
                                    icon={faTimes}
                                    size="2x"
                                    transform="up-0.2"
                                    onClick={e => { removeImage(e, i) }}
                                />
                            </div>
                        );
                    })
                }
                {renderPlus()}
            </div>
            <p>{error}</p>
            <button className="rental-form__button">確定</button>
            <button className="rental-form__cancel-button" type="button" onClick={closeModal}>取消</button>
        </form>
    );
};

export default RentalUpdateForm;