import Landing from './landing';
import Promo from './promo';
import SearchBar from './search_bar';
import { testPromos } from '../util/test_data';
import config from '../aws-exports';

function HomePage() {
    return (
        <div className="home-page">
            <Landing
                imgFileName="patrick-perkins-3wylDrjxH-E-unsplash.jpg"
                title="Some Cheesy Slogan01 廣告01放這"
            >
                <SearchBar />
            </Landing>
            {
                testPromos.map((promo, i) => (
                    <Promo key={i} imgFile={promo.imgFile} title={promo.title} content={promo.content} />
                ))
            }
            <p>{`config: ${Object.entries(config)}`}</p>
        </div>
    );
};

export default HomePage;