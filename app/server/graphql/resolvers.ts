import { OrdersCollection } from "/imports/api/orders";

const recentOrders = () => {
  const recentOrders = OrdersCollection.find(
    {},
    {
      limit: 30,
      sort: { createdAt: -1 },
    }
  ).fetch();

  return { orders: recentOrders };
};

export const resolvers = {
  Query: {
    recentOrders,
  },
};
