import { useState } from 'react';
import { Auth } from 'aws-amplify';

export function SignUpForm() {
    const initialState = {
        email: "",
        password: "",
        name: "",
        phone_number: "",
        err: ""
    };
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
            let digits = phone_number.match(/\d+/g).join("");
            if (digits[0] === "0") digits = digits.slice(1);
            phoneNumber = "+886" + digits;
        };

        if (email === "" || password === "" || name === "" || phone_number === "") {
            let missing = [];
            if (email === "") missing.push("Email");
            if (password === "") missing.push("密碼");
            if (name === "") missing.push("姓名");
            if (phone_number === "") missing.push("手機號碼");
            let missingString = missing.reduce((accu, val) => {
                return accu + `, ${val}`;
            });
            updateState({ ...state, err: `資料不完全: ${missingString}` });
            return;
        } else if (password.length < 8 || password.length > 20) {
            updateState({ ...state, err: "密碼長度必須在8-20內" });
            return;
        } else if (phoneNumber.length !== 13) {
            updateState({ ...state, err: "手機號碼不正確" });
            return;
        };

        updateState({ ...state, err: "讀取中..." });
        
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
        <div className="sign-up sign-up--show">
            <form onSubmit={handleSubmit}>
                <input
                    className='sign-up__input'
                    name='email'
                    type='email'
                    onChange={handleInput}
                    value={email}
                    placeholder='Email'
                    autoComplete="username"
                />
                <input
                    className='sign-up__input'
                    name='password'
                    type='password'
                    onChange={handleInput}
                    value={password}
                    placeholder='密碼'
                    autoComplete="new-password"
                />
                <input
                    className='sign-up__input'
                    name='name'
                    onChange={handleInput}
                    value={name}
                    placeholder='姓名'
                />
                <input
                    className='sign-up__input'
                    name='phone_number'
                    onChange={handleInput}
                    value={phone_number}
                    placeholder='手機號碼'
                />
                <button className="sign-up__button">註冊帳號</button>
            </form>
            <div>{err}</div>
        </div>

    );
};

export function ConfirmSignUp() {
    const initialConfirm = {
        email: "",
        code: "",
        err: ""
    };
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