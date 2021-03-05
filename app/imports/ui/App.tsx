import React from 'react';
import { Login } from './Login';
import { RecentOrders } from './RecentOrders';

export const App = () => (
  <div>
    <h1>Welcome to our GraphQL cafe</h1>
    <Login />
    <RecentOrders />
  </div>
);
