const publicRentalListingReducer = (state = { listings: [] }, action) => {
    let nextState = { ...state };
    switch (action.type) {
        case "FETCH_PUBLIC_RENTAL_LISTINGS":
            nextState.listings = action.payload;
            return nextState;
        case "SIGN_OUT":
            return { listings: [] };
        default:
            return state;
    };
};

export default publicRentalListingReducer;