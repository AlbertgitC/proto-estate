const publicRentalListingReducer = (state = { initialFetch: false, listings: [] }, action) => {
    let nextState = { ...state };
    switch (action.type) {
        case "FETCH_PUBLIC_RENTAL_LISTINGS":
            if (!nextState.initialFetch) nextState.initialFetch = true;
            nextState.listings = action.payload;
            return nextState;
        case "SIGN_OUT":
            return { initialFetch: false, listings: [] };
        default:
            return state;
    }
};

export default publicRentalListingReducer;