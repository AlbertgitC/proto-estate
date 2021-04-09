import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import * as queries from '../graphql/queries';
import * as ListingAction from '../util/actions/public_rental_listing_actions';
import { API } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';


function SearchBar(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [searchInput, setInput] = useState("");
    const { setLoadingState } = props;
    
    useEffect(() => {
        if (location.search) {
            const searchParams = new URLSearchParams(location.search);
            const query = searchParams.get("q");
            const rentLimit = JSON.parse(searchParams.get("rent"));
            console.log(rentLimit);
            setInput(query);

            API.graphql({
                query: queries.rentalListingsSortByCreatedAt,
                authMode: "AWS_IAM",
                variables: {
                    type: "RentalListing",
                    sortDirection: "DESC",
                    filter: { address: { contains: query } }
                }
            })
                .then(res => {
                    let data = res.data.rentalListingsSortByCreatedAt.items;
                    dispatch(ListingAction.fetchPublicRentalListings(data));
                    setLoadingState(false);
                })
                .catch(err => {
                    console.log("fetch rental listing error:", err);
                    setLoadingState(false);
                });
        } else {
            setInput("");
        };
    }, [location.search, dispatch, setLoadingState]);

    function handleInput(e) {
        setInput(e.target.value);
    };
    
    function search(e) {
        e.preventDefault();

        if (!searchInput) return;

        history.push(`/rental-listings?q=${searchInput}`);
    };

    return (
        <form className="search-bar" onSubmit={search}>
            <input
                value={searchInput}
                onChange={handleInput}
                className="search-bar__input" 
                placeholder="搜尋關鍵字: 城市, 社區 ,街道 , 商圈..."
            />
            <button className="search-bar__button">
                <FontAwesomeIcon
                    icon={faSearch}
                />
            </button>
        </form>
    );
}

export default SearchBar;