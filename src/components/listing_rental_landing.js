import Landing from './landing';
import Promo from './promo';
import { testPromos } from '../util/test_data';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function ListingRentalLanding() {
    const user = useSelector(state => state.user);


    return (
        <div>
            <Landing
                imgFileName="jarek-ceborski-jn7uVeCdf6U-unsplash.jpg"
                title="List Your Rentals Here"
                content="馬推型美外心果四制也造論期馬、業精的人夜常如，心一媽；提變人合包目者取士書太，故只區車課驗。"
            >
                <button type="button" className="promo__button">
                    <Link to={location => {
                        if (user) return { pathname: "/rental-panel" };
                        return { pathname: "/sign-in", state: { from: location } };
                    }}>立即刊登出租廣告</Link>
                </button>
            </Landing>
            {
                testPromos.map((promo, i) => (
                    <Promo key={i} imgFile={promo.imgFile} title={promo.title} content={promo.content} />
                ))
            }
        </div>
    );
};

export default ListingRentalLanding;