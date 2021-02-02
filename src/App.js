import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import * as queries from './graphql/queries';
import { SignupForm, ConfirmSignUp } from './components/sign-up';
import SignIn from './components/sign-in';

function App() {
	const [listings, setListings] = useState([]);
	
	useEffect(() => {
		getListings().then((res) => {
			console.log(res);
			setListings(res.data.listListings.items);
		}).catch((error) => {
			console.log(error);
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
			<ul>
				{listings.map((listing, i) =>
					<li key={i}>
						<h4>{listing.title}</h4>
						<p>{listing.content}</p>
					</li>
				)}
			</ul>
			<div>
				<SignIn />
				<SignupForm />
				<ConfirmSignUp />
			</div>
		</div>
	);
}

export default App;
