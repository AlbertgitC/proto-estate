import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function NavLinks(props) {

    const { toggleNavLinks } = props;

    return (
        <div className="nav">
            <div className="nav__head">
                <div className="nav__logo">PState</div>
                <FontAwesomeIcon
                    icon={faTimes}
                    transform="down-3"
                    onClick={toggleNavLinks}
                />
            </div>
            <div className="nav__auth">
                <button className="nav__button">登入</button>
                <button className="nav__button">註冊</button>
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