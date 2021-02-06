import { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import * as queries from './graphql/queries';
import Header from './components/header';
import { useDispatch } from 'react-redux';
import * as AuthActions from './util/actions/auth_actions';
import Landing from './components/landing';
import Promo from './components/promo';
import { testPromos } from './util/test_data';
import Footer from './components/footer';
import SearchBar from './components/search_bar';
import { Route, Switch } from "react-router-dom";

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
				<Route path="/list-rental">
					<Landing
						key="list-rental"
						imgFileName="jarek-ceborski-jn7uVeCdf6U-unsplash.jpg"
						title="Promo for Listing Rental Here"
						content="馬推型美外心果四制也造論期馬、業精的人夜常如，心一媽；提變人合包目者取士書太，故只區車課驗。"
					/>
					{testPromos.map((promo, i) => (
						<Promo key={`list-rental-${i}`} imgFile={promo.imgFile} title={promo.title} content={promo.content} />
					))}
				</Route>
				<Route path="/">
					<Landing
						key="home" 
						imgFileName="patrick-perkins-3wylDrjxH-E-unsplash.jpg" 
						title="Some Cheesy Slogan01 廣告01放這"
						component={<SearchBar />}
					/>
					{testPromos.map((promo, i) => (
						<Promo key={`home-${i}`} imgFile={promo.imgFile} title={promo.title} content={promo.content} />
					))}
				</Route>
			</Switch>
			<Footer />
		</div>
	);
}

export default App;
