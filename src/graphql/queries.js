/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRentalListing = /* GraphQL */ `
  query GetRentalListing($id: ID!) {
    getRentalListing(id: $id) {
      id
      createdBy
      createdAt
      address
      type
      monthlyRent
      numberRooms
      areaPin
      description
      updatedAt
    }
  }
`;
export const listRentalListings = /* GraphQL */ `
  query ListRentalListings(
    $filter: ModelRentalListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRentalListings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdBy
        createdAt
        address
        type
        monthlyRent
        numberRooms
        areaPin
        description
        updatedAt
      }
      nextToken
    }
  }
`;
