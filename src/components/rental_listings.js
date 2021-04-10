import SearchBar from './search_bar';
import ListingItem from './listing_item';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    const [rentDisplay, setRentDisplay] = useState("不限");
    const history = useHistory();

    useEffect(() => {
        if (!location.search) {
            history.replace("/rental-listings?q=");
        } else {
            const searchParams = new URLSearchParams(location.search);
            const filter = parseJSONSafe(searchParams.get("filter"));
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
                setRentDisplay(parseRentLimit(min, max));
            };
        };
    }, [location.search, dispatch, history]);

    function parseJSONSafe(string) {
        try {
            return JSON.parse(string);
        } catch (error) {
            return null;
        };
    };

    function switchMap() {
        if (mapState.button === "MAP") {
            setMap({ list: "none", map: "", button: "LIST" });
        } else {
            setMap({ list: "flex", map: "rental-listings__map-mobile--hide", button: "MAP" });
        };
    };

    function confirmRentFilter() {
        const searchParams = new URLSearchParams(location.search);
        function applyFilter(filter) {
            searchParams.set("filter", `${JSON.stringify(filter)}`);
            history.replace(`/rental-listings?${searchParams.toString()}`);
        };

        if (rentLimit.min !== "" && rentLimit.max !== "" && rentLimit.min > rentLimit.max) {
            setRentFilterError("rental-listings__filter-error--show");
        } else {
            setTimeout(() => { setRentFilter(""); }, 200);
            setRentFilterError("");
            setRentFilter("rental-listings__filter-rent-wrapper--hide");
            const filter = parseJSONSafe(searchParams.get("filter")); 
            if (rentLimit.min === "" && rentLimit.max === "") {
                setRentDisplay("不限");
                if (filter) {
                    delete filter.monthlyRent;
                    applyFilter(filter);
                };
            } else if (rentLimit.min === "" && rentLimit.max !== "") {
                if (filter) {
                    filter.monthlyRent = { le: rentLimit.max };
                    applyFilter(filter);
                } else {
                    applyFilter({ monthlyRent: { le: rentLimit.max } });
                };
            } else if (rentLimit.min !== "" && rentLimit.max === "") {
                if (filter) {
                    filter.monthlyRent = { ge: rentLimit.min };
                    applyFilter(filter);
                } else {
                    applyFilter({ monthlyRent: { ge: rentLimit.min } });
                };
            } else {
                if (filter) {
                    filter.monthlyRent = { between: [rentLimit.min, rentLimit.max] };
                    applyFilter(filter);
                } else {
                    applyFilter({ monthlyRent: { between: [rentLimit.min, rentLimit.max] } });
                };
            };
        };
    };

    function handleRentInput(e) {
        let value = e.target.value === "" ? "" : parseFloat(e.target.value);
        setRentLimit({ ...rentLimit, [e.target.name]: value });
    };

    function toggleRentFilter() {
        if (!rentFilter) {
            setRentFilter("rental-listings__filter-rent-wrapper--show");
        } else if (rentFilter === "rental-listings__filter-rent-wrapper--show") {
            setTimeout(() => { setRentFilter(""); }, 200);
            setRentFilter("rental-listings__filter-rent-wrapper--hide");
        };
    };

    function parseRentLimit(min, max) {
        if (min === "" && max === "") {
            return "不限";
        } else if (min === "" && max !== "") {
            return `${max}元以下`;
        } else if (min !== "" && max === "") {
            return `${min}元以上`;
        } else if (min !== "" && max !== "") {
            return `${min} - ${max}元`;
        };
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
                                onClick={toggleRentFilter}
                            >月租: {rentDisplay}</button>
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