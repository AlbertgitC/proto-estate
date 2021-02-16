const publicRentalListingReducer = (state = [], action) => {
    switch (action.type) {
        case "FETCH_PUBLIC_RENTAL_LISTINGS":
            if (action.payload.length === 0) return state;
            return action.payload;
        case "SIGN_OUT":
            return [];
        default:
            return state;
    }
};

export default publicRentalListingReducer;