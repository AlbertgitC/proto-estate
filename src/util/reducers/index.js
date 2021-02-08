import { combineReducers } from 'redux';
import userReducer from './user_reducer';
import rentalListingReducer from './rental_listing_reducer';

const rootReducer = combineReducers({
    user: userReducer,
    rentalListings: rentalListingReducer
});

export default rootReducer;