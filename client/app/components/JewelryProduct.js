import React from 'react';
import s from '../services/jewelryService.js';
import sign from '../services/sign.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';

class JewelryProduct extends React.Component {
  constructor() {
    super();

    this.state = {
      piece: null
    };
  }

  componentDidMount() {
    s.getPiece(this.props.params.pieceId)
      .then(piece => this.setState({ piece: piece }))
      .catch(() => {
        sign.setError('Failed to retrieve jewelry piece. Try refreshing.');

        this.setState({ piece: null });
      });
  }

  _modifyField(field, value) {
    this.state.piece[field] = value;
    this.setState({ piece: this.state.piece });

    s.modifyPiece(this.props.params.pieceId, field, value)
      .catch(() => {
        sign.setError('Failed to modify jewelry piece.');

        this.setState({ piece: null });
      });
  }

  render() {
    // table needs an array of data
    let data = [];
    if (this.state.piece) {
      data.push(this.state.piece);
    }

    return (
      <Table classes="piece" data={data} uniqueId="item">
        <Column header="Item #" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'item')}>{piece.item}</Cell>
        )}/>
        <Column classes="extra-wide" header="Description" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'description')}>{piece.description}</Cell>
        )}/>
        <Column header="Type" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'type')}></Cell>
        )}/>
        <Column header="Cost" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'totalCost')}>{'$' + piece.totalCost}</Cell>
        )}/>
        <Column header="Wholesale" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'wholesalePrice')}>{'$' + piece.wholesalePrice}</Cell>
        )}/>
        <Column header="MSRP" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'msrp')}>{'$' + piece.msrp}</Cell>
        )}/>
        <Column header="Qty on Order" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'qtyOnOrder')}>{piece.qtyOnOrder}</Cell>
        )}/>
        <Column header="Qty in Stock" cell={piece => (
          <Cell modifyField={this._modifyField.bind(this, 'qtyInStock')}>{piece.qtyInStock}</Cell>
        )}/>
      </Table>

    );
  }
}

export default JewelryProduct;
