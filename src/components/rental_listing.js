import ListingItem from './listing_item';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import * as queries from '../graphql/queries';

function RentalListing() {
    const { listingId } = useParams();
    const publicRentalListings = useSelector(state => state.publicRentalListings);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let curListing = null;
        for (let listing of publicRentalListings.listings) {
            if (listing.id === listingId) curListing = listing;
        };
        if (!curListing) {
            API.graphql({
                query: queries.getRentalListing,
                authMode: "AWS_IAM",
                variables: {
                    id: listingId
                }
            })
                .then(res => {
                    setListing(res.data.getRentalListing);
                    setLoading(false);
                })
                .catch(err => {
                    console.log("fetch rental listing error:", err);
                    setLoading(false);
                });
        } else {
            setListing(curListing);
            setLoading(false);
        };
    }, [listingId, publicRentalListings.listings]);

    if (loading) {
        return (
            <div className="rental-listing">
                <p>讀取中...</p>
            </div>
        );
    } else if (!listing) {
        return (
            <div className="rental-listing">
                <p>資料不存在:(</p>
            </div>
        );
    } else {
        return (
            <div className="rental-listing">
                <ListingItem listing={listing} />
            </div>
        );
    };
};

export default RentalListing;