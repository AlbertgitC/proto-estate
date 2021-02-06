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
			<Landing 
				imgFileName="patrick-perkins-3wylDrjxH-E-unsplash.jpg" 
				title="Some Cheesy Slogan01 廣告01放這"
				component={<SearchBar />}
			/>
			{testPromos.map((promo, i) => (
				<Promo key={i} imgFile={promo.imgFile} title={promo.title} content={promo.content} />
			))}
			<Footer />
		</div>
	);
}

export default App;
