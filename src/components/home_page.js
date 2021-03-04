import Landing from './landing';
import Promo from './promo';
import SearchBar from './search_bar';
import { testPromos } from '../util/test_data';
import Amplify from 'aws-amplify';

function HomePage() {
    console.log(Amplify)
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
        </div>
    );
};

export default HomePage;