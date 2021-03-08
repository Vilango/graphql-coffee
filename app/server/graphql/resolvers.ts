import { ApolloError } from "apollo-server-errors";
import { Meteor } from "meteor/meteor";
import moment from "moment";
import { anonymizeEmail } from "../main";
import { OrdersCollection } from "/imports/api/orders";
import { UsertokensCollection } from "/imports/api/usertokens";

const recentOrders = () => {
  const recentOrders = OrdersCollection.find(
    {},
    {
      limit: 30,
      sort: { createdAt: -1 },
      transform: function (doc) {
        doc.email = anonymizeEmail(doc.email);
        return doc;
      }
    }
  ).fetch();

  return { orders: recentOrders };
};

const orderBeverage = (obj, { input }, context, _info) => {
  console.log("orderBeverage", JSON.stringify(input, null, "\t"));
  const ut = UsertokensCollection.findOne({ token: input.usertoken });
  console.log("orderBeverage", ut);

  if (!ut) {
    const url = Meteor.absoluteUrl();
    throw new ApolloError(
      `This usertoken is unknown. Get your token here: ${url}`,
      "unknownUsertoken"
    );
  }

  const duplicateOrder = OrdersCollection.findOne({
    email: ut.email,
    beverage: input.beverage,
    createdAt: { $gt: moment().subtract(1, "minute").toDate() },
  });

  if (duplicateOrder) {
    throw new ApolloError(
      `You already ordered ${input.beverage} - you can buy your next in a minute`,
      "duplicateOrder",
      { order: duplicateOrder }
    );
  }

  const orderId = OrdersCollection.insert({
    email: ut.email,
    beverage: input.beverage,
    createdAt: new Date(),
  });

  const order = OrdersCollection.findOne({ _id: orderId });

  return { order };
};

export const resolvers = {
  Query: {
    recentOrders,
  },
  Mutation: {
    orderBeverage,
  },
};
