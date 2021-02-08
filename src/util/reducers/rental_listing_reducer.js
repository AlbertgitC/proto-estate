const rentalListingReducer = (state = [], action) => {
    switch (action.type) {
        case "CREATE_RENTAL_LISTING":
            state.push(action.payload);
            return state;
        case "FETCH_RENTAL_LISTINGS":
            return action.payload;
        case "SIGN_OUT":
            return [];
        default:
            return state;
    }
};

export default rentalListingReducer;