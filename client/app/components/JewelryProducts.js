import React from 'react';
import { Link } from 'react-router';
import s from '../services/jewelryService.js';

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
    s.getAllPieces()
      .then(pieces => this.setState({ pieces: pieces }))
      .catch(() => {
        // TODO: display error sign

        this.setState({ pieces: [] });
      });
  }

  render() {
    return (
      <div className="content">
        <div className="filters">
          <span>All</span>
          <span>Other</span>
          <span>Low Stock</span>
          <span>Out of Stock</span>

          <button className="add-button">+</button>
        </div>

        <Table data={this.state.pieces} uniqueId="item">
          <Column header="Item #" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.item}</Link></Cell> )}/>
          <Column classes="extra-wide" header="Description" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.description}</Link></Cell> )}/>
          <Column header="Type" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}></Link></Cell> )}/>
          <Column header="Cost" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{'$' + piece.totalCost}</Link></Cell> )}/>
          <Column header="Wholesale" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{'$' + piece.wholesalePrice}</Link></Cell> )}/>
          <Column header="MSRP" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{'$' + piece.msrp}</Link></Cell> )}/>
          <Column header="Qty on Order" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.qtyOnOrder}</Link></Cell> )}/>
          <Column header="Qty in Stock" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.qtyInStock}</Link></Cell> )}/>
        </Table>
      </div>
    );
  }
}

export default JewelryProducts;
