import Header from './components/header';
import HomePage from './components/home_page';
import ListingRentalLanding from './components/listing_rental_landing';
import SignInPage from './components/sign_in_page';
import Footer from './components/footer';
import RentalPanel from './components/rental_panel';
import { Route, Switch } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './util/routes';
import RentalListings from './components/rental_listings';

function App() {

	return (
		<div className="App">
			<Header />
			<Switch>
				<PublicRoute path="/sign-in" component={SignInPage} />
				<Route path="/list-rental-promo">
					<ListingRentalLanding />
				</Route>
				<Route path="/rental-listings">
					<RentalListings />
				</Route>
				<ProtectedRoute path="/rental-panel" component={RentalPanel} />
				<Route path="/">
					<HomePage />
				</Route>
			</Switch>
			<Footer />
		</div>
	);
}

export default App;