import React from 'react';
import { Link } from 'react-router';
import s from '../services/jewelryService.js';
import sign from '../services/sign.js';
import h from '../helpers.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';

class JewelryProducts extends React.Component {
  constructor() {
    super();

    this.state = {
      pieces: [],
      types: []
    };
  }

  componentDidMount() {
    s.getAllPieces()
      .then(pieces => this.setState({ pieces: pieces }))
      .catch(() => {
        sign.setError('Failed to retrieve jewelry pieces. Try refreshing.');
        this.setState({ pieces: [] });
      });

    s.getTypes()
      .then(types => {
        this.setState({ types: types });
      }).catch(() => {
        sign.setError('Failed to retrieve jewelry types. Try refreshing.');
      });
  }

  _handleAdd() {}

  render() {
    let types = this.state.types;

    return (
      <div>
        <div className="filters">
          <span>All</span>
          <span>Other</span>
          <span>Low Stock</span>
          <span>Out of Stock</span>

          <button className="add-button" onClick={this._handleAdd.bind(this)}>+</button>
        </div>

        <div className="content">
          <Table data={this.state.pieces} uniqueId="item">
            <Column header="Item #" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.item}</Link></Cell> )}/>
            <Column classes="extra-wide" header="Description" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.description}</Link></Cell> )}/>
            <Column header="Type" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{h.findTypeName(types, piece.typeId)}</Link></Cell> )}/>
            <Column header="Cost" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{h.displayPrice(piece.totalCost)}</Link></Cell> )}/>
            <Column header="Wholesale" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{h.displayPrice(piece.wholesalePrice)}</Link></Cell> )}/>
            <Column header="MSRP" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{h.displayPrice(piece.msrp)}</Link></Cell> )}/>
            <Column header="Qty on Order" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.qtyOnOrder}</Link></Cell> )}/>
            <Column header="Qty in Stock" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.qtyInStock}</Link></Cell> )}/>
          </Table>
        </div>
      </div>
    );
  }
}

export default JewelryProducts;
