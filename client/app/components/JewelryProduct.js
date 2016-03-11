import React from 'react';
import _ from 'underscore';
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

  _modifyMaterialQty(materialId, qty) {
    let material = _.findWhere(this.state.piece.materials, { id: materialId });
    material.PieceMaterial.qty = qty;
    this.setState({ piece: this.state.piece });

    j.modifyMaterialQty(this.props.params.pieceId, materialId, qty)
      .catch(() => {
        sign.setError('Failed to modify material quantity.');
        this.setState({ piece: null });
      });
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
        <Table classes="single" data={data} uniqueId="item">
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
            <Cell modifyField={this._modifyField.bind(this, 'totalCost')} price>{h.displayPrice(piece.totalCost)}</Cell>
          )}/>
          <Column header="Wholesale" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'wholesalePrice')} price>{h.displayPrice(piece.wholesalePrice)}</Cell>
          )}/>
          <Column header="MSRP" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'msrp')} price>{h.displayPrice(piece.msrp)}</Cell>
          )}/>
          <Column header="Qty on Order" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'qtyOnOrder')} number>{piece.qtyOnOrder}</Cell>
          )}/>
          <Column header="Qty in Stock" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'qtyInStock')} number>{piece.qtyInStock}</Cell>
          )}/>
        </Table>

        <div className="container-70">
          <h2>Bill of Materials</h2>
          <button className="add-button inner" onClick={this._handleAdd.bind(this)}>+</button>
          {this._renderMaterials()}
        </div>

        <div className="container-30">
          <div className="labels">
            <div>Material Cost Subtotal</div>
            <div>Labor in Minutes</div>
            <div>Labor Cost</div>
            <div className="total">Total Cost</div>
            <button className="convert">Convert Back to Parts</button>
            <button className="cancel">Cancel</button>
          </div>

          <div className="values">
            <div>$31.22</div>
            <div>45</div>
            <div>$31.22</div>
            <div className="total">$100</div>
            <button className="duplicate">Duplicate</button>
            <button className="save">Save</button>
          </div>
        </div>
      </div>
    );
  }

  _renderMaterials() {
    let materials = [];
    if (this.state.piece) {
      materials = this.state.piece.materials;
    }

    return (
      <Table classes="inner" data={materials} uniqueId="item">
        <Column header="Part #" cell={material => (<Cell>{material.item}</Cell>)}/>
        <Column header="Description" classes="extra-wide" cell={material => (<Cell>{material.description}</Cell>)}/>
        <Column header="Cost / Unit" cell={material => (<Cell>{h.displayPrice(material.costPerUnit)}</Cell>)}/>
        <Column header="Qty" cell={material => (
          <Cell modifyField={this._modifyMaterialQty.bind(this, material.id)}>{material.PieceMaterial.qty}</Cell>
        )}/>
      </Table>
    );
  }
}

export default JewelryProduct;
