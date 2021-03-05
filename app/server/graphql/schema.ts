import { gql } from "apollo-server-express";

export const schema = gql`
  type Query {
    recentOrders: RecentOrdersPayload
    # orderStatus(input: OrderStatusInput!): OrderStatusPayload
    # dhlLocations(input: GeolocationInput!): DhlLocationsPayload
  }

  #   type Mutation {
  #     # setShippingChoiceToPreferredDay(input: SetShippingChoiceInput): OrderStatusPayload
  #     # updateBuyerChoiceToPreferredDay(input: UpdateBuyerChoicePreferredDayInput!): OrderStatusPayload!
  #     # updateBuyerChoiceToPreferredNeighbour(input: UpdateBuyerChoicePreferredNeighbourInput!): OrderStatusPayload!
  #     # updateBuyerChoiceToPreferredLocation(input: UpdateBuyerChoicePreferredLocationInput!): OrderStatusPayload!
  #     # updateBuyerChoiceToAddress(input: UpdateBuyerChoiceAddressInput!): OrderStatusPayload!
  #     # updateBuyerChoiceToPackstation(input: UpdateBuyerChoicePackstationInput!): OrderStatusPayload!
  #   }

  
  enum BeverageEnum {
    MOCCA
    CAPUCCINO
    LATTE_MACCHIATO
    COLD_BREW
    GREEN_TEE
    JASMIN_TEE
    BLACK_TEE
    ICE_TEE
  }

  type RecentOrdersPayload {
    orders: [Order!]!
  }

  type Order {
    _id: String!
    email: String!
    beverage: BeverageEnum!
    createdAt: String!
  }
`;
