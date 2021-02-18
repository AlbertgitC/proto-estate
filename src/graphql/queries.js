/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRentalListing = /* GraphQL */ `
  query GetRentalListing($id: ID!) {
    getRentalListing(id: $id) {
      id
      createdBy
      createdAt
      type
      address
      propertyType
      monthlyRent
      numberRooms
      areaPin
      description
      photos
      postPhoto
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
        type
        address
        propertyType
        monthlyRent
        numberRooms
        areaPin
        description
        photos
        postPhoto
        updatedAt
      }
      nextToken
    }
  }
`;
export const rentalListingsByAuthor = /* GraphQL */ `
  query RentalListingsByAuthor(
    $createdBy: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelRentalListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    rentalListingsByAuthor(
      createdBy: $createdBy
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdBy
        createdAt
        type
        address
        propertyType
        monthlyRent
        numberRooms
        areaPin
        description
        photos
        postPhoto
        updatedAt
      }
      nextToken
    }
  }
`;
export const rentalListingsSortByCreatedAt = /* GraphQL */ `
  query RentalListingsSortByCreatedAt(
    $type: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelRentalListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    rentalListingsSortByCreatedAt(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdBy
        createdAt
        type
        address
        propertyType
        monthlyRent
        numberRooms
        areaPin
        description
        photos
        postPhoto
        updatedAt
      }
      nextToken
    }
  }
`;
