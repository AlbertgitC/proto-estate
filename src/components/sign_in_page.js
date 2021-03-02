import { SignUpForm } from './sign_up';
import SignIn from './sign_in';
import { useState, useEffect } from 'react';

function SignInPage(props) {
    const initialState = {
        signIn: "sign-in-page--selected",
        signUp: ""
    };
    const [state, setState] = useState(initialState);
    const [component, setAuthPage] = useState(null);

    useEffect(() => {
        setAuthPage(<SignIn setAuthPage={setAuthPage} location={props.location}/>);
    }, [props]);

    function clickSignIn() {
        setState({
            signIn: "sign-in-page--selected",
            signUp: ""
        });
        setAuthPage(<SignIn setAuthPage={setAuthPage} location={props.location}/>);
    };

    function clickSignUp() {
        setState({
            signIn: "",
            signUp: "sign-in-page--selected"
        });
        setAuthPage(<SignUpForm setAuthPage={setAuthPage} location={props.location}/>);
    };

    return (
        <div className="sign-in-page">
            <h2 className="sign-in-page__tab">
                <span className={state.signIn} onClick={clickSignIn}>登入</span> | 
                <span className={state.signUp} onClick={clickSignUp}> 用戶註冊</span>
            </h2>
            {component}
        </div>
    );
};

export default SignInPage;