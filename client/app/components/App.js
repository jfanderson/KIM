import React from 'react';
import { Link } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1>Welcome to KIM!</h1>
        <ul className="navbar">
          <li><Link to={'/jewelry'}>Jewelry Products</Link></li>
          <li><Link to={'/materials'}>Materials</Link></li>
          <li><Link to={'/products'}>Other Products</Link></li>
          <li><Link to={'/purchaseorders'}>Purchase Orders</Link></li>
          <li><Link to={'/sales'}>Sales</Link></li>
          <li><Link to={'/vendors'}>Vendors</Link></li>
          <li><Link to={'/settings'}>Settings</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default App;
