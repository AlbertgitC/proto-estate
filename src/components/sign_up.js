import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import SignIn from './sign_in';

export function SignUpForm(props) {
    const initialState = {
        email: "",
        password: "",
        name: "",
        phone_number: "",
        err: ""
    };
    const [state, updateState] = useState(initialState);
    const { email, password, name, phone_number, err } = state;
    const { setComponent } = props;
    const animation = props.animation ? props.animation : "";

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

        Auth.signUp({
            username: email,
            password: password,
            attributes: {
                name: name,
                phone_number: phoneNumber
            }
        }).then(() => { 
                setComponent(<ConfirmSignUp setComponent={setComponent} email={email}/>); 
            })
            .catch( error => {
                console.log("sign up error:", error);
                updateState({ ...state, err: error.message });
            });
    };

    function handleInput(e) {
        updateState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div className={`sign-up ${animation}`}>
            <form className='sign-up__form' onSubmit={handleSubmit}>
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

export function ConfirmSignUp(props) {
    const initialState = {
        email: "",
        code: "",
        err: ""
    };
    const [state, setState] = useState(initialState);
    const { email, code, err } = state;
    const { setComponent } = props;

    useEffect(() => {
        if (props.email) setState(s => ({ 
            ...s, 
            email: props.email, 
            err: `驗證碼已寄到 ${props.email}` 
        }));
    }, [props]);

    function confirmSignUp() {
        if (code === "" || email === "") {
            setState({ ...state, err: "請輸入Email和驗證碼" });
            return;
        };

        setState({ ...state, err: "讀取中..." });

        Auth.confirmSignUp(email, code)
            .then(() => {
                setComponent(<SignIn setComponent={setComponent} email={email}/>);
            })
            .catch(err => {
                console.log("confirm sign up error:", err);
                setState({ ...state, err: err.message });
            });
    };

    function resendConfirm() {
        if (email === "") {
            setState({ ...state, err: "請輸入Email" });
            return;
        };

        setState({ ...state, err: "讀取中..." });

        Auth.resendSignUp(email)
            .then(() => {
                setState({ ...state, err: `驗證碼已寄到 ${email}` });
            })
            .catch(err => {
                console.log("resend confirm error:", err);
                setState({ ...state, err: err.message });
            });
    };

    function handleInput(e) {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div className="confirm-user">
            <input
                className='confirm-user__input'
                name='email'
                type='email'
                onChange={handleInput}
                value={email}
                placeholder='Email'
                autoComplete="username"
            />
            <input
                className='confirm-user__input'
                name='code'
                onChange={handleInput}
                value={code}
                placeholder='驗證碼'
            />
            <button className='confirm-user__button' onClick={confirmSignUp}>驗證帳號</button>
            <button className='confirm-user__button' onClick={resendConfirm}>重新寄出驗證碼</button>
            <div>{err}</div>
        </div>
    );
};