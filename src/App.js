import { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import * as queries from './graphql/queries';
import Header from './components/header';
import { useDispatch } from 'react-redux';
import * as AuthActions from './util/actions/auth_actions';
import HomePage from './components/home_page';
import ListingRentalLanding from './components/listing_rental_landing';
import SignInPage from './components/sign_in_page';
import Footer from './components/footer';
import RentalPanel from './components/rental_panel';
import { Route, Switch } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './util/routes';

function App() {
	// const [listings, setListings] = useState([]);
	const dispatch = useDispatch();
	
	useEffect(() => {
		// getListings().then((res) => {
		// 	setListings(res.data.listListings.items);
		// }).catch((error) => {
		// 	console.log(error);
		// });

		Auth.currentAuthenticatedUser()
			.then(res => {
				dispatch(AuthActions.signIn(res));
			})
			.catch(err => {
				console.log("user not sign in:", err);
			});
	}, [dispatch]);

	// async function getListings() {
	// 	try {
	// 		return await API.graphql({
	// 			query: queries.listListings,
	// 			authMode: "AWS_IAM"
	// 		});
	// 	} catch (err) {
	// 		return err;
	// 	};
	// };

	return (
		<div className="App">
			<Header />
			<Switch>
				<PublicRoute path="/sign-in" component={SignInPage} />
				{/* <Route path="/sign-in" render={(routeProps) => <SignInPage {...routeProps}/>} /> */}
				<Route path="/list-rental-promo">
					<ListingRentalLanding />
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
