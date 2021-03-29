function Listing(props) {
    const { listing } = props;

    return (
        <div>
            Listing ID: {listing.id}
        </div>
    );
};

export default Listing;