import React from 'react';
import 'whatwg-fetch';
import h from '../helpers.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';

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
        <Table data={this.state.pieces} uniqueId="item">
          <Column header="Item #" cell={piece => ( <Cell>{piece.item}</Cell> )}/>
          <Column header="Description" cell={piece => ( <Cell>{piece.description}</Cell> )}/>
          <Column header="Type" cell={piece => ( <Cell></Cell> )}/>
          <Column header="Cost" cell={piece => ( <Cell>{piece.totalCost}</Cell> )}/>
          <Column header="Wholesale" cell={piece => ( <Cell>{piece.wholesalePrice}</Cell> )}/>
          <Column header="MSRP" cell={piece => ( <Cell>{piece.msrp}</Cell> )}/>
          <Column header="Qty on Order" cell={piece => ( <Cell>{piece.qtyOnOrder}</Cell> )}/>
          <Column header="Qty in Stock" cell={piece => ( <Cell>{piece.qtyInStock}</Cell> )}/>
        </Table>
      </div>
    );
  }
}

export default JewelryProducts;
