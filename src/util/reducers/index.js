import { combineReducers } from 'redux';
import userReducer from './user_reducer';
import rentalListingReducer from './rental_listing_reducer';
import publicRentalListingReducer from './public_rental_listing_reducer';

const rootReducer = combineReducers({
    user: userReducer,
    rentalListings: rentalListingReducer,
    publicRentalListings: publicRentalListingReducer
});

export default rootReducer;