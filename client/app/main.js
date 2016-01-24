import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from './components/App.js';
import JewelryProducts from './components/JewelryProducts.js';
import Materials from './components/Materials.js';
import OtherProducts from './components/OtherProducts.js';
import PurchaseOrders from './components/PurchaseOrders.js';
import Sales from './components/Sales.js';
import Vendors from './components/Vendors.js';
import Settings from './components/Settings.js';
import NoMatch from './components/NoMatch.js';

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='jewelry' component={JewelryProducts}/>
      <Route path='materials' component={Materials}/>
      <Route path='products' component={OtherProducts}/>
      <Route path='purchaseorders' component={PurchaseOrders}/>
      <Route path='sales' component={Sales}/>
      <Route path='vendors' component={Vendors}/>
      <Route path='settings' component={Settings}/>
    </Route>
    <Route path='*' component={NoMatch}/>
  </Router>
), document.getElementById('main'));
