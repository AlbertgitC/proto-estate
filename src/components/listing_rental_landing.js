import Landing from './landing';
import Promo from './promo';
import { testPromos } from '../util/test_data';
import { Link } from "react-router-dom";

function ListingRentalLanding() {

    return (
        <div>
            <Landing
                imgFileName="jarek-ceborski-jn7uVeCdf6U-unsplash.jpg"
                title="Promo for Listing Rental Here"
                content="馬推型美外心果四制也造論期馬、業精的人夜常如，心一媽；提變人合包目者取士書太，故只區車課驗。"
            >
                <button className="promo__button">
                    <Link to={location => ({ pathname: "/sign-in", state: { from: location.pathname } })}>立即刊登出租廣告</Link>
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