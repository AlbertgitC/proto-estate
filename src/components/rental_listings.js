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
    const [mapState, setMap] = useState({ list: "flex", map: false, button: "MAP" });
    const [initSearch, setSearch] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (!location.search) {
            setSearch(false);
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
                })
                .catch(err => {
                    console.log("fetch rental listing error:", err);
                });
        }
    }, [location.search, dispatch]);

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
                    />
                </ErrBoundary>
            </div>
            <div className="rental-listings__list-wrapper">
                <div className="rental-listings__list">
                    <SearchBar />
                    <h2 className="rental-listings__header">Rental Listings</h2>
                    <ErrBoundary>
                        <GoogleMap 
                            listings={publicRentalListings.listings} 
                            display={mapState.map}
                            mode="mobile"
                        />
                    </ErrBoundary>
                    {
                        initSearch ? null : <p>推薦地點:</p>
                    }
                    <ul className="rental-listings__ul" style={{ display: `${mapState.list}` }}>
                        {
                            publicRentalListings.listings[0] ?
                                publicRentalListings.listings.map((listing, i) => {
                                    return (<ListingItem key={i} listing={listing} />);
                                }) : <p>No Result Found</p>
                        }
                    </ul>
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