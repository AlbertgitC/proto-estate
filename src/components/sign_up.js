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
    const { setModalComponent, setAuthPage, location } = props;
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

        /* data check */
        // if (email === "" || password === "" || name === "" || phone_number === "") {
        //     let missing = [];
        //     if (email === "") missing.push("Email");
        //     if (password === "") missing.push("密碼");
        //     if (name === "") missing.push("姓名");
        //     if (phone_number === "") missing.push("手機號碼");
        //     let missingString = missing.reduce((accu, val) => {
        //         return accu + `, ${val}`;
        //     });
        //     updateState({ ...state, err: `資料不完全: ${missingString}` });
        //     return;
        // } else if (password.length < 8 || password.length > 20) {
        //     updateState({ ...state, err: "密碼長度必須在8-20內" });
        //     return;
        // } else 
        if (phoneNumber.length !== 13) {
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
        })
        .then(() => { 
            if (setModalComponent) setModalComponent({ component: ConfirmSignUp, props: { email: email } });
            if (setAuthPage) setAuthPage(<ConfirmSignUp setAuthPage={setAuthPage} email={email} location={location}/>); 
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
            <form className="sign-up__form" onSubmit={handleSubmit}>
                <button disabled style={{ display: "none" }} />
                <label htmlFor="email">Email</label>
                <input
                    className="sign-up__input"
                    id="email"
                    name="email"
                    required
                    type="email"
                    maxLength="250"
                    onChange={handleInput}
                    value={email}
                    placeholder="輸入Email"
                    autoComplete="username"
                />
                <label htmlFor="password">密碼</label>
                <input
                    className="sign-up__input"
                    id="password"
                    name="password"
                    required
                    type="password"
                    minLength="8"
                    maxLength="20"
                    onChange={handleInput}
                    value={password}
                    placeholder="輸入密碼"
                    autoComplete="new-password"
                />
                <label htmlFor="name">姓名</label>
                <input
                    className="sign-up__input"
                    id="name"
                    name="name"
                    required
                    maxLength="250"
                    onChange={handleInput}
                    value={name}
                    placeholder="輸入姓名"
                />
                <label htmlFor="phone_number">手機號碼</label>
                <input
                    className="sign-up__input"
                    id="phone_number"
                    name="phone_number"
                    required
                    maxLength="250"
                    onChange={handleInput}
                    value={phone_number}
                    placeholder="輸入手機號碼"
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
    const { setModalComponent, setAuthPage, location } = props;

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
                if (setModalComponent) setModalComponent({ component: SignIn, props: { email: email } });
                if (setAuthPage) setAuthPage(<SignIn setAuthPage={setAuthPage} email={email} location={location}/>);
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
            />
            <input
                className='confirm-user__input'
                name='code'
                onChange={handleInput}
                value={code}
                placeholder='驗證碼'
                autoComplete="off"
            />
            <button className='confirm-user__button' onClick={confirmSignUp}>驗證帳號</button>
            <button className='confirm-user__button' onClick={resendConfirm}>重新寄出驗證碼</button>
            <div>{err}</div>
        </div>
    );
};