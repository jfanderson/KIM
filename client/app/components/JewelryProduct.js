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
        this.setState({ piece: [data.piece] });
      })
      .catch(error => {
        console.log('Error fetching piece: ', error);

        // TODO: display sign
        this.setState({ piece: null });
      });
  }

  _modifyField(field, value) {
    this.state.piece[0][field] = value;

    this.setState({ piece: this.state.piece });

    console.log(this.state);
    // post to api
  }

  render() {
    return (
      <Table classes="piece" data={ this.state.piece } uniqueId="item">
        <Column header="Item #" cell={piece => (
          <Cell modifyField={value => this._modifyField('item', value)}>{piece.item}</Cell>
        )}/>
        <Column header="Description" cell={piece => (
          <Cell modifyField={value => this._modifyField('description', value)}>{piece.description}</Cell>
        )}/>
        <Column header="Type" cell={piece => (
          <Cell modifyField={value => this._modifyField('type', value)}></Cell>
        )}/>
        <Column header="Cost" cell={piece => (
          <Cell modifyField={value => this._modifyField('totalCost', value)}>{'$' + piece.totalCost}</Cell>
        )}/>
        <Column header="Wholesale" cell={piece => (
          <Cell modifyField={value => this._modifyField('wholesalePrice', value)}>{'$' + piece.wholesalePrice}</Cell>
        )}/>
        <Column header="MSRP" cell={piece => (
          <Cell modifyField={value => this._modifyField('msrp', value)}>{'$' + piece.msrp}</Cell>
        )}/>
        <Column header="Qty on Order" cell={piece => (
          <Cell modifyField={value => this._modifyField('qtyOnOrder', value)}>{piece.qtyOnOrder}</Cell>
        )}/>
        <Column header="Qty in Stock" cell={piece => (
          <Cell modifyField={value => this._modifyField('qtyInStock', value)}>{piece.qtyInStock}</Cell>
        )}/>
      </Table>

    );
  }
}

export default JewelryProduct;
