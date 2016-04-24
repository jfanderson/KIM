import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from './components/App.js';
import JewelryProducts from './components/JewelryProducts.js';
import JewelryProduct from './components/JewelryProduct.js';
import Materials from './components/Materials.js';
import OtherProducts from './components/OtherProducts.js';
import PurchaseOrders from './components/PurchaseOrders.js';
import Sales from './components/Sales.js';
import Settings from './components/Settings.js';
import NoMatch from './components/NoMatch.js';

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={JewelryProducts} />
      <Route path="products" component={OtherProducts} />
      <Route path="materials" component={Materials} />
      <Route path="purchaseorders" component={PurchaseOrders} />
      <Route path="sales" component={Sales} />
      <Route path="settings" component={Settings} />
      <Route path="jewelry/:pieceId" component={JewelryProduct} />
    </Route>
    <Route path="*" component={NoMatch} />
  </Router>
), document.getElementById('main'));
