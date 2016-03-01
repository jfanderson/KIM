import React from 'react';
import j from '../services/jewelryService.js';
import h from '../helpers.js';
import sign from '../services/sign.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';
import SelectCell from './Cell.Select.js';

class JewelryProduct extends React.Component {
  constructor() {
    super();

    this.state = {
      piece: null,
      types: [],
    };
  }

  componentDidMount() {
    j.getPiece(this.props.params.pieceId)
      .then(piece => {
        this.setState({ piece: piece });
      }).catch(() => {
        sign.setError('Failed to retrieve jewelry piece. Try refreshing.');
        this.setState({ piece: null });
      });

    j.getTypes()
      .then(types => {
        this.setState({ types: types });
      }).catch(() => {
        sign.setError('Failed to retrieve jewelry types. Try refreshing.');
      });
  }

  _handleAdd() {}

  _modifyField(field, value) {
    if (field === 'type') {
      this.state.piece.typeId = h.findTypeId(this.state.types, value);
    } else {
      this.state.piece[field] = value;
    }
    this.setState({ piece: this.state.piece });

    j.modifyPiece(this.props.params.pieceId, field, value)
      .catch(() => {
        sign.setError('Failed to modify jewelry piece.');
        this.setState({ piece: null });
      });
  }

  _modifyMaterialQty() {

  }

  _renderMaterials() {
    console.log(this.state.piece);
    let materials = [];
    if (this.state.piece) {
      materials = this.state.piece.materials;
    }

    return (
      <Table data={materials} uniqueId="item">
        <Column header="Part #" cell={material => (<Cell>{material.item}</Cell>)}/>
        <Column header="Description" classes="extra-wide" cell={material => (<Cell>{material.description}</Cell>)}/>
        <Column header="Cost/Unit" cell={material => (<Cell>{material.costPerUnit}</Cell>)}/>
        <Column header="Qty" cell={material => (
          <Cell modifyField={this._modifyMaterialQty.bind(this)}>{material.PieceMaterial.qty}</Cell>
        )}/>
      </Table>
    );
  }

  render() {
    let state = this.state;

    // table needs an array of data
    let data = [];
    if (state.piece) {
      data.push(state.piece);
    } else {
      return (<h6>Loading...</h6>);
    }

    return (
      <div className="content">
        <Table classes="piece" data={data} uniqueId="item">
          <Column header="Item #" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'item')}>{piece.item}</Cell>
          )}/>
          <Column header="Description" classes="extra-wide" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'description')}>{piece.description}</Cell>
          )}/>
          <Column header="Type" cell={piece => (
            <SelectCell modifyField={this._modifyField.bind(this, 'type')}
              options={state.types.map(type => type.name)}
              defaultValue={h.findTypeName(state.types, piece.typeId)}/>
          )}/>
          <Column header="Cost" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'totalCost')} price={true}>{h.displayPrice(piece.totalCost)}</Cell>
          )}/>
          <Column header="Wholesale" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'wholesalePrice')} price={true}>{h.displayPrice(piece.wholesalePrice)}</Cell>
          )}/>
          <Column header="MSRP" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'msrp')} price={true}>{h.displayPrice(piece.msrp)}</Cell>
          )}/>
          <Column header="Qty on Order" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'qtyOnOrder')}>{piece.qtyOnOrder}</Cell>
          )}/>
          <Column header="Qty in Stock" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'qtyInStock')}>{piece.qtyInStock}</Cell>
          )}/>
        </Table>

        <div className="container-left">
          <h2>Bill of Materials</h2>
          <button className="add-button" onClick={this._handleAdd.bind(this)}>+</button>
          {this._renderMaterials()}
        </div>
      </div>
    );
  }
}

export default JewelryProduct;
