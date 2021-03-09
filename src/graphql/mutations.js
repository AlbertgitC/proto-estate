/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRentalListing = /* GraphQL */ `
  mutation CreateRentalListing(
    $input: CreateRentalListingInput!
    $condition: ModelRentalListingConditionInput
  ) {
    createRentalListing(input: $input, condition: $condition) {
      id
      createdBy
      createdAt
      type
      address
      subAddress
      geometry
      postalCode
      city
      district
      propertyType
      monthlyRent
      numberRooms
      areaPin
      description
      photos
      updatedAt
    }
  }
`;
export const updateRentalListing = /* GraphQL */ `
  mutation UpdateRentalListing(
    $input: UpdateRentalListingInput!
    $condition: ModelRentalListingConditionInput
  ) {
    updateRentalListing(input: $input, condition: $condition) {
      id
      createdBy
      createdAt
      type
      address
      subAddress
      geometry
      postalCode
      city
      district
      propertyType
      monthlyRent
      numberRooms
      areaPin
      description
      photos
      updatedAt
    }
  }
`;
export const deleteRentalListing = /* GraphQL */ `
  mutation DeleteRentalListing(
    $input: DeleteRentalListingInput!
    $condition: ModelRentalListingConditionInput
  ) {
    deleteRentalListing(input: $input, condition: $condition) {
      id
      createdBy
      createdAt
      type
      address
      subAddress
      geometry
      postalCode
      city
      district
      propertyType
      monthlyRent
      numberRooms
      areaPin
      description
      photos
      updatedAt
    }
  }
`;
