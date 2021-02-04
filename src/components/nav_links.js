import SignIn from './sign_in';
import { SignUpForm } from './sign_up';

function NavLinks(props) {

    const { setComponent } = props;

    function clickSignIn() {
        setComponent(<SignIn setComponent={setComponent}/>);
    };

    function clickSignUp() {
        setComponent(<SignUpForm />);
    };

    return (
        <div className="nav">
            <div className="nav__auth">
                <button className="nav__button" onClick={clickSignIn}>登入</button>
                <button className="nav__button" onClick={clickSignUp}>註冊</button>
            </div>
            <ul className="nav__ul">
                <li className="nav__li">
                    <a>租房</a>
                </li>
                <li className="nav__li">
                    <a>買房</a>
                </li>
                <li className="nav__li">
                    <a>出租</a>
                </li>
                <li className="nav__li">
                    <a>賣房</a>
                </li>
                <li className="nav__li">
                    <a>找仲介</a>
                </li>
                <li className="nav__li">
                    <a>廣告</a>
                </li>
                <li className="nav__li">
                    <a>幫助</a>
                </li>
            </ul>
        </div>
    );
}

export default NavLinks;