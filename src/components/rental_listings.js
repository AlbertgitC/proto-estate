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
import { useLocation } from 'react-router-dom';

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

    useEffect(() => {
        if (!location.search) {
            API.graphql({
                query: queries.rentalListingsSortByCreatedAt,
                authMode: "AWS_IAM",
                variables: {
                    type: "RentalListing",
                    sortDirection: "DESC",
                /* should change to user's current location */
                    filter: { address: { contains: "台北市" } }
                }
            })
                .then(res => {
                    let data = res.data.rentalListingsSortByCreatedAt.items;
                    dispatch(ListingAction.fetchPublicRentalListings(data));
                    setLoadingState(false);
                })
                .catch(err => {
                    console.log("fetch rental listing error:", err);
                    setLoadingState(false);
                });
        }
    }, [location.search, dispatch]);

    function switchMap() {
        if (mapState.button === "MAP") {
            setMap({ list: "none", map: "", button: "LIST" });
        } else {
            setMap({ list: "flex", map: "rental-listings__map-mobile--hide", button: "MAP" });
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
                        <div className="rental-listings__filter-rent-wrapper">
                            <div>月租:</div>
                            <div className="rental-listings__filter-rent">
                                <label htmlFor="rent-min">最低</label>
                                <input 
                                    className="rental-listings__rent-input"
                                    id="rent-min"
                                    placeholder="不限"
                                    type="number"
                                ></input>元 -
                            </div>
                            <div className="rental-listings__filter-rent">
                                <label htmlFor="rent-max">最高</label>
                                <input 
                                    className="rental-listings__rent-input"
                                    id="rent-max"
                                    placeholder="不限"
                                    type="number"
                                ></input>元
                            </div>
                        </div>
                        <div className="rental-listings__filter-option">
                            <button type="button" className="rental-listings__filter-option-button">其他條件</button>
                            <button type="button" className="rental-listings__filter-save-button">儲存選擇</button>
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