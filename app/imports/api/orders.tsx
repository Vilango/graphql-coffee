import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export interface Orders {
  _id?: string;
  email: string;
  beverage: string;
  createdAt: Date;
}

export const OrdersCollection = new Mongo.Collection<Orders>("orders");

if (Meteor.isServer) {
  OrdersCollection.rawCollection().createIndex({ createdAt: -1, email: -1 });

  OrdersCollection.insert({
    email: "testorder@y134.com",
    beverage: "MOCCA",
    createdAt: new Date(),
  });
}
