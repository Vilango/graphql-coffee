import { Meteor } from "meteor/meteor";
import React, { Fragment, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { OrdersCollection } from "/imports/api/orders";
import moment from "moment";
import useInterval from "@use-it/interval";

export const RecentOrders = () => {
  const [toggle, setToggle] = useState(false);
  const { isLoading, recentOrders } = useTracker(() => {
    const subscription = Meteor.subscribe("recentOrders");

    const recentOrders = OrdersCollection.find({}).fetch();
    const isLoading = !subscription.ready();
    console.log("-", isLoading, recentOrders);
    return { isLoading, recentOrders };
  });

  useInterval(() => {
    setToggle(!toggle);
  }, 1000);

  const Loading = <div>... loading recent orders ...</div>;

  const RecentOrders = (
    <Fragment>
      {recentOrders?.map((o) => {
        return (
          <div key={o._id}>
            {o.beverage} | {o.email} - {moment(o.createdAt).fromNow()}
          </div>
        );
      })}
    </Fragment>
  );

  return (
    <div>
      <h2>{toggle ? "☕" : "🔥" } Recent orders</h2>
      {isLoading ? Loading : RecentOrders}
    </div>
  );
};
