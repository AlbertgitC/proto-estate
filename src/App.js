import Header from './components/header';
import HomePage from './components/home_page';
import ListingRentalLanding from './components/listing_rental_landing';
import SignInPage from './components/sign_in_page';
import Footer from './components/footer';
import RentalPanel from './components/rental_panel';
import { Route, Switch } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './util/routes';
import RentalListings from './components/rental_listings';
import Listing from './components/rental_listing';

function App() {

	return (
		<div className="App__wrapper">
			<div className="App">
				<Header />
				<Switch>
					<PublicRoute path="/sign-in" component={SignInPage} />
					<Route path="/list-rental-promo">
						<ListingRentalLanding />
						<Footer />
					</Route>
					<Route path="/rental-listings/:listingId">
						<Listing />
						<Footer />
					</Route>
					<Route path="/rental-listings">
						<RentalListings />
					</Route>
					<ProtectedRoute path="/rental-panel" component={RentalPanel} />
					<Route path="/">
						<HomePage />
						<Footer />
					</Route>
				</Switch>
			</div>
		</div>
	);
}

export default App;