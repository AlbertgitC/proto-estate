import { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import * as queries from './graphql/queries';
import { SignupForm, ConfirmSignUp } from './components/signUp';
import SignIn from './components/signIn';
import Header from './components/header';

function App() {
	const [listings, setListings] = useState([]);
	const [user, setUser] = useState("Not Sign In");
	
	useEffect(() => {
		getListings().then((res) => {
			setListings(res.data.listListings.items);
		}).catch((error) => {
			console.log(error);
		});

		Auth.currentAuthenticatedUser()
			.then(res => {
				setUser(res);
			})
			.catch(err => {
				console.log("error finding user:", err);
			});
	}, []);

	async function getListings() {
		try {
			return await API.graphql({
				query: queries.listListings,
				authMode: "AWS_IAM"
			});
		} catch (err) {
			return err;
		};
	};

	return (
		<div className="App">
			<Header />
			<div></div>
			<footer></footer>
		</div>
	);
}

export default App;
