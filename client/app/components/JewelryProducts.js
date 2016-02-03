import React from 'react';
import { Link } from 'react-router';
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
          <Column header="Description" cell={piece => ( <Cell><Link to={"/jewelry/" + piece.id}>{piece.description}</Link></Cell> )}/>
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
