const initialState = { initialFetch: false, listings: {}, currentSearch: { term: "", result: [] } };

const publicRentalListingReducer = (state = initialState, action) => {
    let nextState = { ...state };
    switch (action.type) {
        case "FETCH_PUBLIC_RENTAL_LISTINGS":
            if (!nextState.initialFetch) nextState.initialFetch = true;
            nextState.listings[action.payload.searchTerm] = action.payload.data;
            nextState.currentSearch = { term: action.payload.searchTerm, result: action.payload.data };
            return nextState;
        case "SIGN_OUT":
            return { initialFetch: false, listings: {} };
        default:
            return state;
    }
};

export default publicRentalListingReducer;