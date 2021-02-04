import React, { useState, useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';
// import ResendConfirm from './resend-confirm';
// import './sign-in.css';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../util/actions/auth_actions';
// import { useHistory } from 'react-router-dom';
// import { UserContext } from './util/global-store';


function SignIn(prop) {
    const initialState = {
        email: "",
        password: "",
        err: ""
    };
    // const [authState, dispatch] = useContext(UserContext);
    const [state, updateState] = useState(initialState);
    const { email, password, err } = state;
    const dispatch = useDispatch();
    // const history = useHistory();

    useEffect(() => {
        if (prop.email) {
            updateState(s => ({ ...s, email: prop.email }));
        };
    }, [prop]);

    async function signIn(e) {
        e.preventDefault();
        if (email === "" || password === "") {
            updateState({ ...state, err: "Email / 密碼錯誤" });
            return;
        };

        updateState({ ...state, err: "讀取中..." });

        try {
            await Auth.signIn(email, password).then(
                res => {
                    dispatch(AuthActions.signIn(res));
                    // dispatch({
                    //     type: 'SIGN_IN',
                    //     payload: res
                    // });
                    // history.push("/user-panel");
                }
            );
        } catch (error) {
            console.log('error signing in', error);
            updateState({ ...state, err: error.message });
        };
    };

    // function resendConfirm() {
    //     prop.modalAction({
    //         component: <ResendConfirm
    //             modalAction={prop.modalAction}
    //         />
    //     });
    // };

    // function close() {
    //     prop.modalAction({ component: "" });
    // };

    function handleInput(e) {
        updateState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div className="sign-in">
            <h3>Online Menu Merchant</h3>
            <form onSubmit={signIn}>
                <input
                    name='email'
                    type='email'
                    onChange={handleInput}
                    value={email}
                    placeholder='Email'
                    autoComplete="username"
                />
                <input
                    name='password'
                    type='password'
                    onChange={handleInput}
                    value={password}
                    placeholder='Password'
                    autoComplete="password"
                />
                <button>Sign In</button>
            </form>
            <div>{err}</div>
            {/* <div onClick={resendConfirm}>Resend Confirmation</div> */}
            {/* <button onClick={close}>Close</button> */}
        </div>
    );
};

export default SignIn;