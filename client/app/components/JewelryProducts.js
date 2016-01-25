import React from 'react';
import 'whatwg-fetch';

import h from '../helpers.js';

class JewelryProducts extends React.Component {
  constructor() {
    super();

    this.state = {
      pieces: []
    };
  }

  componentDidMount() {
    fetch('/a/pieces')
      .then(h.checkStatus)
      .then(h.parseJSON)
      .then(data => {
        this.setState({ pieces: data.pieces });
      })
      .catch(error => {
        console.log('Error fetching pieces: ', error);

        // TODO: display sign
        this.setState({ pieces: null });
      });
  }

  render() {
    return (
      <div>
        <h1>Jewelry Products</h1>
        <ul>
          {this.state.pieces.map(piece => {
            return (
              <li>
                <h5>{piece.description}</h5>
                <div>${piece.msrp}</div>
                <div>Qty: {piece.qtyInStock}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default JewelryProducts;
