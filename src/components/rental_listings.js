import SearchBar from './search_bar';
import ListingItem from './listing_item';
import { useEffect, useState,useRef } from 'react';
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
    const [mapState, setMap] = useState({ list: "flex", map: false, button: "MAP" });
    const location = useLocation();
    const [loading, setLoadingState] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const selectedListingRef = useRef(null);

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

    useEffect(() => {
        if (selectedListingRef.current) {
            selectedListingRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedId]);

    function switchMap() {
        if (mapState.button === "MAP") {
            setMap({ list: "none", map: true, button: "LIST" });
        } else {
            setMap({ list: "flex", map: false, button: "MAP" });
        };
    };

    return (
        <div className="rental-listings">
            <div className="rental-listings__dt-map">
                <ErrBoundary>
                    <GoogleMap
                        listings={publicRentalListings.listings}
                        display={true}
                        mode="desktop"
                        setSelectedId={setSelectedId}
                    />
                </ErrBoundary>
            </div>
            <div className="rental-listings__list-wrapper">
                <div className="rental-listings__list">
                    <SearchBar setLoadingState={setLoadingState} />
                    <h2 className="rental-listings__header">Rental Listings</h2>
                    {
                        !publicRentalListings.listings[0] && !loading ? <p>No Result Found</p> : null
                    }
                    <ErrBoundary>
                        <GoogleMap 
                            listings={publicRentalListings.listings} 
                            display={mapState.map}
                            mode="mobile"
                        />
                    </ErrBoundary>
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
                                                    selectedListingRef={selectedId === listing.id ? selectedListingRef : null}
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