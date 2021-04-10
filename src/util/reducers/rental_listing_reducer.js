const rentalListingReducer = (state = { listings: [] }, action) => {
    let nextState = { ...state };
    switch (action.type) {
        case "CREATE_RENTAL_LISTING":
            nextState.listings.unshift(action.payload);
            return nextState;
        case "FETCH_RENTAL_LISTINGS":
            nextState.listings = action.payload;
            return nextState;
        case "UPDATE_RENTAL_LISTING":
            for (let i = 0; i < nextState.listings.length; i++) {
                if (nextState.listings[i].id === action.payload.id) {
                    nextState.listings.splice(i, 1, action.payload);
                    break;
                };
            };
            return nextState;
        case "SIGN_OUT":
            return { listings: [] };
        default:
            return state;
    };
};

export default rentalListingReducer;