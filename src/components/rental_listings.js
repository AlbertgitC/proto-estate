import SearchBar from './search_bar';
import ListingItem from './listing_item';
import { useEffect, useState } from 'react';
import * as queries from '../graphql/queries';
import * as ListingAction from '../util/actions/public_rental_listing_actions';
import { useSelector, useDispatch } from 'react-redux';
import { API } from 'aws-amplify';
import Footer from './footer';
import GoogleMap from './google_map';
import ErrBoundary from '../util/error_boundary';
import { useLocation, useHistory } from 'react-router-dom';

function RentalListings() {
    const dispatch = useDispatch();
    const publicRentalListings = useSelector(state => state.publicRentalListings);
    const [mapState, setMap] = useState(
        { 
            list: "flex", 
            map: "rental-listings__map-mobile--hide", 
            button: "MAP"
        }
    );
    const location = useLocation();
    const [loading, setLoadingState] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [rentFilter, setRentFilter] = useState("");
    const [rentFilterError, setRentFilterError] = useState("");
    // const defaultFilter = {
    //     city: "",
    //     district: "",
    //     propertyType: "",
    //     rentMin: "",
    //     rentMax: "",
    //     numberRooms: "",
    //     areaPin: ""
    // };
    const [rentLimit, setRentLimit] = useState({ min: "", max: "" });
    const history = useHistory();

    useEffect(() => {
        if (!location.search) {
            // API.graphql({
            //     query: queries.rentalListingsSortByCreatedAt,
            //     authMode: "AWS_IAM",
            //     variables: {
            //         type: "RentalListing",
            //         sortDirection: "DESC",
            //     /* should change to user's current location */
            //         filter: { address: { contains: "台北市" } }
            //     }
            // })
            //     .then(res => {
            //         let data = res.data.rentalListingsSortByCreatedAt.items;
            //         dispatch(ListingAction.fetchPublicRentalListings(data));
            //         setLoadingState(false);
            //     })
            //     .catch(err => {
            //         console.log("fetch rental listing error:", err);
            //         setLoadingState(false);
            //     });
            history.replace("/rental-listings?q=");
        } else {
            const searchParams = new URLSearchParams(location.search);
            const filter = searchParams.get("filter") ? JSON.parse(searchParams.get("filter")) : null;
            if (filter && filter.monthlyRent) {
                let min = "";
                let max = "";
                if ("le" in filter.monthlyRent) {
                    max = filter.monthlyRent.le;
                } else if ("ge" in filter.monthlyRent) {
                    min = filter.monthlyRent.ge;
                } else if ("between" in filter.monthlyRent) {
                    min = filter.monthlyRent.between[0];
                    max = filter.monthlyRent.between[1];
                };
                setRentLimit({ min, max });
            };
        };
    }, [location.search, dispatch]);

    function switchMap() {
        if (mapState.button === "MAP") {
            setMap({ list: "none", map: "", button: "LIST" });
        } else {
            setMap({ list: "flex", map: "rental-listings__map-mobile--hide", button: "MAP" });
        };
    };

    function confirmRentFilter() {
        if (rentLimit.min !== "" && rentLimit.max !== "" && rentLimit.min > rentLimit.max) {
            setRentFilterError("rental-listings__filter-error--show");
        } else {
            setTimeout(() => { setRentFilter(""); }, 450);
            setRentFilterError("");
            setRentFilter("rental-listings__filter-rent-wrapper--hide");
            const searchParams = new URLSearchParams(location.search);
            const filter = JSON.parse(searchParams.get("filter"));
            if (rentLimit.min === "" && rentLimit.max === "") {
                if (filter) {
                    delete filter.monthlyRent;
                    searchParams.set("filter", `${JSON.stringify(filter)}`);
                    history.replace(`/rental-listings?${searchParams.toString()}`);
                };
            } else if (rentLimit.min === "" && rentLimit.max !== "") {
                if (filter) {
                    filter.monthlyRent = { le: rentLimit.max };
                    searchParams.set("filter", `${JSON.stringify(filter)}`);
                    history.replace(`/rental-listings?${searchParams.toString()}`);
                } else {
                    searchParams.set("filter", `${JSON.stringify({ monthlyRent: { le: rentLimit.max } })}`);
                    history.replace(`/rental-listings?${searchParams.toString()}`);
                };
            } else if (rentLimit.min !== "" && rentLimit.max === "") {
                if (filter) {
                    filter.monthlyRent = { ge: rentLimit.min };
                    searchParams.set("filter", `${JSON.stringify(filter)}`);
                    history.replace(`/rental-listings?${searchParams.toString()}`);
                } else {
                    searchParams.set("filter", `${JSON.stringify({ monthlyRent: { ge: rentLimit.min } })}`);
                    history.replace(`/rental-listings?${searchParams.toString()}`);
                };
            } else {
                if (filter) {
                    filter.monthlyRent = { between: [rentLimit.min, rentLimit.max] };
                    searchParams.set("filter", `${JSON.stringify(filter)}`);
                    history.replace(`/rental-listings?${searchParams.toString()}`);
                } else {
                    searchParams.set("filter", `${JSON.stringify({ monthlyRent: { between: [rentLimit.min, rentLimit.max] } })}`);
                    history.replace(`/rental-listings?${searchParams.toString()}`);
                };
            };
            // if (!location.search) {
            //     /* should change to user's current location */
            //     history.push(`/rental-listings?q=台北市&rent={"min":"${rentMin}","max":"${rentMax}"}`);
            // } else {
            //     const searchParams = new URLSearchParams(location.search);
            //     searchParams.set("rent", `{"min":"${rentMin}","max":"${rentMax}"}`);
            //     history.replace(`/rental-listings?${searchParams.toString()}`);
            // };
        };
    };

    function handleRentInput(e) {
        let value = e.target.value === "" ? "" : parseFloat(e.target.value);
        setRentLimit({ ...rentLimit, [e.target.name]: value });
    };

    return (
        <div className="rental-listings">
            <div className="rental-listings__dt-map">
                <ErrBoundary>
                    <GoogleMap
                        listings={publicRentalListings.listings}
                        mode="desktop"
                        setSelectedId={setSelectedId}
                    />
                </ErrBoundary>
            </div>
            <div className="rental-listings__list-wrapper">
                <div className="rental-listings__list">
                    <SearchBar setLoadingState={setLoadingState} />
                    <h2 className="rental-listings__header">租屋列表</h2>
                    <div className="rental-listings__filter">
                        <div className="rental-listings__filter-option">
                            <button 
                                type="button" 
                                className="rental-listings__filter-button"
                                onClick={() => { setRentFilter("rental-listings__filter-rent-wrapper--show") }}
                            >月租: 不限</button>
                            <button type="button" className="rental-listings__filter-button">其他條件</button>
                            <button type="button" className="rental-listings__filter-button-green">儲存選擇</button>
                        </div>
                        <div className={`rental-listings__filter-rent-wrapper ${rentFilter}`}>
                            最低
                            <input
                                className="rental-listings__rent-input"
                                id="rent-min"
                                placeholder="不限"
                                type="number"
                                autoComplete="off"
                                name="min"
                                onChange={handleRentInput}
                                value={rentLimit.min}
                            ></input>元 - 最高
                            <input
                                className="rental-listings__rent-input"
                                id="rent-max"
                                placeholder="不限"
                                type="number"
                                autoComplete="off"
                                name="max"
                                onChange={handleRentInput}
                                value={rentLimit.max}
                            ></input>元
                            <button 
                                type="button" 
                                className="rental-listings__filter-button-rent"
                                onClick={confirmRentFilter}
                            >確定</button>
                            <div className={`rental-listings__filter-error ${rentFilterError}`}>
                                <span style={{ color: "crimson" }}>!</span>
                                最高租金不能低於最低租金
                                <span style={{ color: "crimson" }}>!</span>
                            </div>
                        </div>
                    </div>
                    {
                        !publicRentalListings.listings[0] && !loading ? <p>找不到，抱歉啦...</p> : null
                    }
                    <div className={`rental-listings__map-mobile ${mapState.map}`}>
                        {
                            mapState.map === "" ?
                                <ErrBoundary>
                                    <GoogleMap
                                        listings={publicRentalListings.listings}
                                        mode="mobile"
                                    />
                                </ErrBoundary>
                                : null
                        }
                    </div>
                    {
                        loading ? <p>讀取中...</p> :
                            <ul className="rental-listings__ul" style={{ display: `${mapState.list}` }}>
                                {
                                    publicRentalListings.listings[0] ?
                                        publicRentalListings.listings.map((listing, i) => {
                                            return (
                                                <ListingItem 
                                                    key={i} 
                                                    listing={listing} 
                                                    selected={selectedId === listing.id ? true : false}
                                                />
                                            );
                                        }) : null
                                }
                            </ul>
                    }
                    <button 
                        className="rental-listings__map-button" 
                        type="button"
                        onClick={switchMap}
                    >
                        {mapState.button}
                    </button>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default RentalListings;