import SearchBar from './search_bar';
import ListingItem from './listing_item';
import { useEffect } from 'react';
import * as queries from '../graphql/queries';
import * as ListingAction from '../util/actions/public_rental_listing_actions';
import { useSelector, useDispatch } from 'react-redux';
import { API } from 'aws-amplify';

function RentalListings() {
    const dispatch = useDispatch();
    const publicRentalListings = useSelector(state => state.publicRentalListings);

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

    return (
        <div className="rental-listings">
            <SearchBar />
            <h2 className="rental-listings__header">Rental Listings</h2>
            <ul className="rental-listings__ul">
                {
                    publicRentalListings.currentSearch.result[0] ?
                        publicRentalListings.currentSearch.result.map((listing, i) => {
                            return (<ListingItem key={i} listing={listing} />);
                        }) : <p>No Result Found</p>
                }
            </ul>
        </div>
    );
};

export default RentalListings;