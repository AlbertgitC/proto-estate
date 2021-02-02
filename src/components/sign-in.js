import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const initialState = {
    email: "",
    password: "",
    err: ""
};

function SignIn() {
    // const [authState, dispatch] = useContext(UserContext);
    const [state, updateState] = useState(initialState);
    const { email, password, err } = state;
    // const history = useHistory();

    // useEffect(() => {
    //     if (prop.email) {
    //         updateState(s => ({ ...s, email: prop.email }));
    //     };
    // }, [prop]);

    async function signIn() {
        return await Auth.signIn(email, password);
    }

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

    function submitSignIn(e) {
        e.preventDefault();
        if (email === "" || password === "") {
            updateState({ ...state, err: "Wrong Credential" });
            return;
        };

        updateState({ ...state, err: "loading..." });

        signIn()
            .then(res => {
                console.log(res);
                updateState({ ...state, err: "" });
            },
            error => {
                console.log('error signing in', error);
                updateState({ ...state, err: error.message });
            });
    };

    return (
        <div>
            <h3>Sign In</h3>
            <form onSubmit={submitSignIn}>
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
        </div>
    );
};

export default SignIn;