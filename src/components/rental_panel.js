import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import RentalModal from './rental_panel_modal';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as ListingAction from '../util/actions/rental_listing_actions';
import OwnerListing from './listing_owner';

function RentalPanel() {
    const initialState = { show: false, action: "Create", listing: null };
    const [modalState, setModal] = useState(initialState);
    const user = useSelector(state => state.user);
    const listings = useSelector(state => state.rentalListings);
    const dispatch = useDispatch();

    useEffect(() => {
        if (listings[0]) return;

        API.graphql({
            query: queries.listRentalListings,
            variables: {
                createdBy: user.username, sortDirection: "ASC"
            }
        })
            .then(res => {
                dispatch(ListingAction.fetchRentalListings(res.data.listRentalListings.items));
            })
            .catch(err => {
                console.log("fetch rental listing error:", err);
            });
    }, [user, listings, dispatch]);

    // function editListing(props) {
    //     console.log(props);
    // };

    return (
        <div className="rental-panel">
            <RentalModal modalState={modalState} setModal={setModal}/>
            <div className="rental-panel__header">
                <h3>Rental Properties</h3>
                <div className="rental-panel__add" onClick={() => { setModal({ show: true, action: "Create", listing: null })}}>
                    <FontAwesomeIcon
                        icon={faPlusSquare}
                        transform="left-5"
                    />Add a property
                </div>
            </div>
            <ul className="rental-panel__item-list">
                {listings[0] ? listings.map((listing, i) => (
                    <OwnerListing key={i} listing={listing} callBack={() => { 
                        setModal({ show: true, action: "Update", listing: listing }); 
                    }}/>
                )) : null}
            </ul>
        </div>
    );
};

export default RentalPanel;