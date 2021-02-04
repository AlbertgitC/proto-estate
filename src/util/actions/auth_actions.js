export const signIn = res => ({
    type: "SIGN_IN",
    payload: res
});

export const signOut = () => ({
    type: "SIGN_OUT"
});