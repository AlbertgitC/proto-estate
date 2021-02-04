const userReducer = (state = "temp user from reducer", action) => {
    switch (action.type) {
        case "SIGN_IN":
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};

export default userReducer;