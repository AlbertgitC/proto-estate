import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import RentalModal from './rental_panel_modal';
import Footer from './footer';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as ListingAction from '../util/actions/rental_listing_actions';
import OwnerListing from './listing_owner';

function RentalPanel() {
    const initialState = { show: false, action: "Create", listing: null };
    const [modalState, setModal] = useState(initialState);
    const user = useSelector(state => state.user);
    const rentalListings = useSelector(state => state.rentalListings);
    const dispatch = useDispatch();

    useEffect(() => {
        API.graphql({
            query: queries.rentalListingsByAuthor,
            variables: {
                createdBy: user.id, sortDirection: "DESC"
            }
        })
            .then(res => {
                dispatch(ListingAction.fetchRentalListings(res.data.rentalListingsByAuthor.items));
            })
            .catch(err => {
                console.log("fetch rental listing error:", err);
            });
    }, [dispatch, user.id]);

    return (
        <div>
            <div className="rental-panel">
                <RentalModal modalState={modalState} setModal={setModal}/>
                <div className="rental-panel__header">
                    <h2>Rental Properties</h2>
                    <div className="rental-panel__add" onClick={() => { setModal({ show: true, action: "Create" })}}>
                        <FontAwesomeIcon
                            icon={faPlusSquare}
                            transform="left-5"
                        />Add a property
                    </div>
                </div>
                <ul className="rental-panel__item-list">
                    {
                        rentalListings.listings.map((listing, i) => (
                            <OwnerListing 
                                key={i} 
                                listing={listing} 
                                callBack={() => { 
                                    setModal({ show: true, action: "Update", listing: listing }); }}
                            />
                        ))
                    }
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default RentalPanel;