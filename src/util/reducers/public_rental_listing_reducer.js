const publicRentalListingReducer = (state = [], action) => {
    switch (action.type) {
        case "FETCH_PUBLIC_RENTAL_LISTINGS":
            return action.payload;
        default:
            return state;
    }
};

export default publicRentalListingReducer;