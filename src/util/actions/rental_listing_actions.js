export const fetchRentalListings = res => ({
    type: "FETCH_RENTAL_LISTINGS",
    payload: res
});

export const createRentalListing = res => ({
    type: "CREATE_RENTAL_LISTING",
    payload: res
});

export const updateRentalListing = res => ({
    type: "UPDATE_RENTAL_LISTING",
    payload: res
});