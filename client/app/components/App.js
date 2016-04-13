import React from 'react';
import { Link, IndexLink } from 'react-router';

const PropTypes = React.PropTypes;

const App = (props) =>
  <div className="app">
    <div className="logo-wrapper">
      <img className="logo" src="../../assets/WebsiteHeader.png" alt="Kristin Miller Jewelry" />
    </div>
    <div className="navbar">
      <div className="tabs">
        <IndexLink to={"/"} className="navlink" activeClassName="active">Jewelry Products</IndexLink>
        <Link to={"/materials"} className="navlink" activeClassName="active">Materials</Link>
        <Link to={"/products"} className="navlink" activeClassName="active">Other Products</Link>
        <Link to={"/purchaseorders"} className="navlink" activeClassName="active">Purchase Orders</Link>
        <Link to={"/sales"} className="navlink" activeClassName="active">Sales</Link>
        <Link to={"/vendors"} className="navlink" activeClassName="active">Vendors</Link>
        <Link to={"/settings"} className="navlink" activeClassName="active">Settings</Link>
      </div>
    </div>
    {props.children}
  </div>;

App.propTypes = {
  // Contains the page corresponding to the currently selected tab.
  children: PropTypes.node
};

export default App;
