import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import * as queries from '../graphql/queries';
import * as ListingAction from '../util/actions/public_rental_listing_actions';
import { API } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';


function SearchBar() {
    const [searchInput, setInput] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    function handleInput(e) {
        setInput(e.target.value);
    };
    
    function search(e) {
        e.preventDefault();
        if (!searchInput) return;

        if (location.pathname !== "/rental-listings") {
            history.push("/rental-listings");
        };

        API.graphql({
            query: queries.rentalListingsSortByCreatedAt,
            authMode: "AWS_IAM",
            variables: {
                type: "RentalListing",
                sortDirection: "DESC",
                filter: { address: { contains: searchInput } }
            }
        })
            .then(res => {
                dispatch(ListingAction.fetchPublicRentalListings(res.data.rentalListingsSortByCreatedAt.items));
            })
            .catch(err => {
                console.log("fetch rental listing error:", err);
            });
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