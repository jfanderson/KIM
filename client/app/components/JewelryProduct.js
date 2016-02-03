import React from 'react';
import 'whatwg-fetch';
import h from '../helpers.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';

class JewelryProduct extends React.Component {
  constructor() {
    super();

    this.state = {
      piece: []
    };
  }

  componentDidMount() {
    fetch('/a/pieces/' + this.props.params.pieceId)
      .then(h.checkStatus)
      .then(h.parseJSON)
      .then(data => {
        this.setState({ piece: data.piece });
      })
      .catch(error => {
        console.log('Error fetching piece: ', error);

        // TODO: display sign
        this.setState({ piece: null });
      });
  }

  render() {
    // pass piece as array
    let pieceArray = [this.state.piece];

    return (
      <Table data={ pieceArray } uniqueId="item">
        <Column header="Item #" cell={piece => ( <Cell>{piece.item}</Cell> )}/>
        <Column header="Description" cell={piece => ( <Cell>{piece.description}</Cell> )}/>
        <Column header="Type" cell={piece => ( <Cell></Cell> )}/>
        <Column header="Cost" cell={piece => ( <Cell>{piece.totalCost}</Cell> )}/>
        <Column header="Wholesale" cell={piece => ( <Cell>{piece.wholesalePrice}</Cell> )}/>
        <Column header="MSRP" cell={piece => ( <Cell>{piece.msrp}</Cell> )}/>
        <Column header="Qty on Order" cell={piece => ( <Cell>{piece.qtyOnOrder}</Cell> )}/>
        <Column header="Qty in Stock" cell={piece => ( <Cell>{piece.qtyInStock}</Cell> )}/>
      </Table>

    );
  }
}

export default JewelryProduct;
