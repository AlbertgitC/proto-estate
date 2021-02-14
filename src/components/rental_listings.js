import SearchBar from './search_bar';
import ListingItem from './listing_item';
import { useEffect } from 'react';
import * as queries from '../graphql/queries';
import * as ListingAction from '../util/actions/public_rental_listing_actions';
import { useSelector, useDispatch } from 'react-redux';
import { API } from 'aws-amplify';

function RentalListings() {
    const dispatch = useDispatch();
    const listings = useSelector(state => state.publicRentalListings);

    useEffect(() => {
        if (listings[0]) return;

        API.graphql({
            query: queries.listRentalListings,
            authMode: "AWS_IAM",
            variables: {
                filter: { address: { contains: "台北市" } }
            }
        })
            .then(res => {
                dispatch(ListingAction.fetchPublicRentalListings(res.data.listRentalListings.items));
            })
            .catch(err => {
                console.log("fetch rental listing error:", err);
            });
    }, [listings, dispatch]);

    return (
        <div className="rental-listings">
            <SearchBar />
            <h2 className="rental-listings__header">Rental Listings</h2>
            <ul className="rental-listings__ul">
                {listings.map((listing, i) => {
                    return (<ListingItem key={i} listing={listing} imgFile="norbert-levajsics-oTJ92KUXHls-unsplash.jpg" />);
                })}
            </ul>
        </div>
    );
};

export default RentalListings;