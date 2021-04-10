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
            const query = searchParams.get("q") === null ? "" : searchParams.get("q");
            setInput(query);

            function parseJSONSafe(string) {
                try {
                    return JSON.parse(string);
                } catch (error) {
                    return null;
                };
            };

            const filter = parseJSONSafe(searchParams.get("filter"));

            function fetchData(filter) {
                API.graphql({
                    query: queries.rentalListingsSortByCreatedAt,
                    authMode: "AWS_IAM",
                    variables: {
                        type: "RentalListing",
                        sortDirection: "DESC",
                        filter: filter
                    }
                })
                    .then(res => {
                        let data = res.data.rentalListingsSortByCreatedAt.items;
                        dispatch(ListingAction.fetchPublicRentalListings(data));
                        setLoadingState(false);
                    })
                    .catch(err => {
                        console.log("fetch rental listing error:", err);
                        dispatch(ListingAction.fetchPublicRentalListings([]));
                        setLoadingState(false);
                    });
            };

            if (!filter && !query) {
                /* should change to user's location */
                let newFilter = { city: { eq: "台北市" } };
                fetchData(newFilter);
            } else if (filter && !query) {
                /* should change to user's location */
                let newFilter = { ...filter, city: { eq: "台北市" } };
                fetchData(newFilter);
            } else if (filter && query) {
                let newFilter = { ...filter, address: { contains: query } };
                fetchData(newFilter);
            } else {
                let newFilter = { address: { contains: query } };
                fetchData(newFilter);
            };
        } else {
            setInput("");
        };
    }, [location.search, dispatch, setLoadingState]);

    function handleInput(e) {
        setInput(e.target.value);
    };
    
    function search(e) {
        e.preventDefault();

        if (!location.search) {
            history.push(`/rental-listings?q=${searchInput}`);
        } else {
            const searchParams = new URLSearchParams(location.search);
            searchParams.set("q", `${searchInput}`);
            history.push(`/rental-listings?${searchParams.toString()}`);
        };
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