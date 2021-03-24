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

function RentalListings() {
    const dispatch = useDispatch();
    const publicRentalListings = useSelector(state => state.publicRentalListings);
    const [mapState, setMap] = useState({ list: "flex", map: false, button: "MAP" });

    useEffect(() => {
        if (publicRentalListings.initialFetch) return;
        API.graphql({
            query: queries.rentalListingsSortByCreatedAt,
            authMode: "AWS_IAM",
            variables: {
                type: "RentalListing",
                sortDirection: "DESC",
                filter: { address: { contains: "台北市" } }
            }
        })
            .then(res => {
                let result = res.data.rentalListingsSortByCreatedAt.items;
                let payload = { searchTerm: "", data: result };
                dispatch(ListingAction.fetchPublicRentalListings(payload));
            })
            .catch(err => {
                console.log("fetch rental listing error:", err);
            });
    }, [publicRentalListings, dispatch]);

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
                        listings={publicRentalListings.currentSearch.result}
                        display={true}
                        mode="desktop"
                    />
                </ErrBoundary>
            </div>
            <div>
                <div className="rental-listings__list">
                    <SearchBar />
                    <h2 className="rental-listings__header">Rental Listings</h2>
                    <ErrBoundary>
                        <GoogleMap 
                            listings={publicRentalListings.currentSearch.result} 
                            display={mapState.map}
                            mode="mobile"
                        />
                    </ErrBoundary>
                    <ul className="rental-listings__ul" style={{ display: `${mapState.list}` }}>
                        {
                            publicRentalListings.currentSearch.result[0] ?
                                publicRentalListings.currentSearch.result.map((listing, i) => {
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