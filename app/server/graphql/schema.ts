import { gql } from "apollo-server-express";

export const schema = gql`
  type Query {
    recentOrders: RecentOrdersPayload
  }

  type Mutation {
    orderBeverage(input: OrderBeverageInput): OrderBeveragePayload
  }


  enum BeverageEnum {
    MOCCA
    CAPUCCINO
    LATTE_MACCHIATO
    COLD_BREW
    GREEN_TEA
    JASMIN_TEA
    BLACK_TEA
    ICE_TEA
  }

  input OrderBeverageInput {
    usertoken: String!
    beverage: BeverageEnum!
  }

  type RecentOrdersPayload {
    orders: [Order!]!
  }
  type OrderBeveragePayload {
    order: Order!
  }

  type Order {
    _id: String!
    email: String!
    beverage: BeverageEnum!
    createdAt: String!
  }
`;
