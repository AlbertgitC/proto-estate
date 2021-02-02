import { useState } from 'react';
import { Auth } from 'aws-amplify';

const initialState = {
    email: "",
    password: "",
    name: "",
    phone_number: "",
    err: ""
};

const initialConfirm = {
    email: "",
    code: "",
    err: ""
};

export function SignupForm() {
    const [state, updateState] = useState(initialState);
    const { email, password, name, phone_number, err } = state;

    async function signUp(phoneNumber) {
        return await Auth.signUp({
            username: email,
            password: password,
            attributes: {
                name: name,
                phone_number: phoneNumber
            }
        });
    };

    function handleSubmit(e) {
        e.preventDefault();

        let phoneNumber;
        if (!phone_number.match(/\d+/g)) {
            phoneNumber = "";
        } else {
            phoneNumber = "+1" + phone_number.match(/\d+/g).join("");
        };

        if (email === "" || password === "" || name === "" || phone_number === "") {
            let missing = [];
            if (email === "") missing.push("Email");
            if (password === "") missing.push("Password");
            if (name === "") missing.push("User Name");
            if (phone_number === "") missing.push("Phone Number");
            let missingString = missing.reduce((accu, val) => {
                return accu + `, ${val}`;
            });
            updateState({ ...state, err: `Infomation missing: ${missingString}` });
            return;
        } else if (password.length < 8) {
            updateState({ ...state, err: "Password must be 8 characters or more" });
            return;
        } else if (phoneNumber.length !== 12) {
            updateState({ ...state, err: "Invalid phone number" });
            return;
        };

        signUp(phoneNumber)
            .then(res => { 
                console.log(res);
                updateState(initialState); 
            })
            .catch( error => {
                console.log('error signing up:', error);
                updateState({ ...state, err: error.message });
            });
    };

    function handleInput(e) {
        updateState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                    autoComplete="new-password"
                />
                <input
                    name='name'
                    onChange={handleInput}
                    value={name}
                    placeholder='User Name'
                />
                <input
                    name='phone_number'
                    onChange={handleInput}
                    value={phone_number}
                    placeholder='Phone Number'
                />
                <button>Create User</button>
            </form>
            <div>{err}</div>
        </div>

    );
};

export function ConfirmSignUp() {
    const [confirmState, updateConfirm] = useState(initialConfirm);
    const { email, code, err } = confirmState;

    async function confirmSignUp() {
        return await Auth.confirmSignUp(email, code);
    };

    async function resendConfirm() {
        return await Auth.resendSignUp(email);
    };

    function handleConfirm(e) {
        updateConfirm({ ...confirmState, [e.target.name]: e.target.value });
    };

    function submitConfirm() {
        if (email === "") {
            updateConfirm({ ...confirmState, err: "Please enter email" });
            return;
        } else if (code === "") {
            updateConfirm({ ...confirmState, err: "Please enter confirmation code" });
            return;
        };
        confirmSignUp()
            .then(res => {
                console.log(res);
                updateConfirm(initialConfirm);
            })
            .catch(error => {
                console.log('error confirming sign up', error);
                updateConfirm({ ...confirmState, err: error.message });
            });
    };

    function submitResend() {
        if (email === "") {
            updateConfirm({ ...confirmState, err: "Please enter email" });
            return;
        };

        resendConfirm()
            .then(res => {
                console.log(res);
                updateConfirm({ ...confirmState, err: "" });
            })
            .catch(error => {
                console.log('error resending confirm', error);
                updateConfirm({ ...confirmState, err: error.message });
            });
    };

    return (
        <div>
            <div>Confirmation Code Sent to: {email}</div>
            <input
                name='email'
                type='email'
                onChange={handleConfirm}
                value={email}
                placeholder='Email'
                autoComplete="username"
            />
            <input
                name='code'
                onChange={handleConfirm}
                value={code}
                placeholder='Confirmation Code'
            />
            <button onClick={submitConfirm}>Confirm User</button>
            <button onClick={submitResend}>Resend Confirmation</button>
            <div>{err}</div>
        </div>
    );
};