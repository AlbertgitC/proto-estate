const rentalListingReducer = (state = [], action) => {
    switch (action.type) {
        case "CREATE_RENTAL_LISTING":
            state.unshift(action.payload);
            return state;
        case "FETCH_RENTAL_LISTINGS":
            return action.payload;
        case "UPDATE_RENTAL_LISTING":
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.payload.id) {
                    state.splice(i, 1, action.payload);
                    break;
                };
            };
            return state;
        case "SIGN_OUT":
            return [];
        default:
            return state;
    }
};

export default rentalListingReducer;