import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import h from '../helpers.js';
import j from '../services/jewelryService.js';
import s from '../services/settingsService.js';
import sign from '../services/sign.js';

import Cell from './Cell.js';
import Column from './Column.js';
import LinkMaterialForm from './Form.LinkMaterial.js';
import SelectCell from './Cell.Select.js';
import Table from './Table.js';

class JewelryProduct extends React.Component {
  constructor() {
    super();

    this.state = {
      isFormOpen: false,
      laborCost: 0,
      piece: null,
      removeMode: false, // If true, display removal column in table
      types: []
    };
  }

  componentDidMount() {
    this._updatePiece();

    j.getTypes()
      .then(types => {
        this.setState({ types: types });
      }).catch(() => {
        sign.setError('Failed to retrieve jewelry types. Try refreshing.');
      });

    s.getSettings()
      .then(settings => {
        this.setState({ laborCost: settings.laborCost });
      }).catch(() => {
        sign.setError('Failed to retrieve labor cost. Try refreshing.');
      });
  }

  _calculateMaterialCost() {
    let materials = this.state.piece.materials;
    let cost = 0;

    for (let i = 0; i < materials.length; i++) {
      cost += materials[i].PieceMaterial.qty * materials[i].costPerUnit;
    }

    return cost;
  }

  _calculateTotalCost(materialCost) {
    let state = this.state;

    return state.piece.laborTime/60 * state.laborCost + materialCost;
  }

  _handleAddClick(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isFormOpen: !this.state.isFormOpen });
  }

  _handleFormSubmit(material, qty) {
    j.linkMaterial(this.props.params.pieceId, material.id, { qty: qty })
      .then(() => {
        this._updatePiece();
      }).catch(error => {
        sign.setError('Failed to add material. Try refreshing.');
      });
  }

  _handleRemove() {
    this.setState({ removeMode: !this.state.removeMode });
  }

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

  _removeMaterial(material) {
    let confirmed = confirm('Are you sure you want to remove ' + material.description + '?');

    if (confirmed) {
      j.unlinkMaterial(this.state.piece.id, material.id).then(() => {
        this._updatePiece();
      }).catch(error => {
        sign.setError('Failed to remove material.');
      });
    }
  }

  _updatePiece() {
    j.getPiece(this.props.params.pieceId)
      .then(piece => {
        this.setState({ piece: piece });
      }).catch(() => {
        sign.setError('Failed to retrieve jewelry piece. Try refreshing.');
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

    let removeClasses = {
      'remove-button': true,
      'inner': true,
      'active': this.state.removeMode
    };

    // Calculate costs associated with jewelry piece
    let materialCost = this._calculateMaterialCost();
    let totalCost = this._calculateTotalCost(materialCost);

    return (
      <div className="content jewelry-product">
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
              defaultValue={h.findTypeName(state.types, piece.typeId)}
            />
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
            <Cell modifyField={this._modifyField.bind(this, 'qtyOnOrder')} integer>{piece.qtyOnOrder}</Cell>
          )}/>
          <Column header="Qty in Stock" cell={piece => (
            <Cell modifyField={this._modifyField.bind(this, 'qtyInStock')} integer>{piece.qtyInStock}</Cell>
          )}/>
        </Table>

        <div className="container-70">
          <h2>Bill of Materials</h2>
          <button className="add-button inner" onClick={this._handleAddClick.bind(this)}>+</button>
          <button className={classnames(removeClasses)} onClick={this._handleRemove.bind(this)}>--</button>
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
            <div>{h.displayPrice(materialCost)}</div>
            <table className="single-cell"><tbody><tr>
              <Cell modifyField={this._modifyField.bind(this, 'laborTime')} integer>
                {state.piece.laborTime}
              </Cell>
            </tr></tbody></table>
            <div>{h.displayPrice(state.laborCost)}</div>
            <div className="total">{h.displayPrice(totalCost)}</div>
            <button className="duplicate">Duplicate</button>
            <button className="save">Save</button>
          </div>
        </div>

        {this._renderForm()}
      </div>
    );
  }

  _renderForm() {
    if (this.state.isFormOpen) {
      return (
        <LinkMaterialForm
          cancel={this._handleAddClick.bind(this)}
          pieceDescription={this.state.piece.description}
          submit={this._handleFormSubmit.bind(this)}
        />
      );
    }
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
        {this._renderRemoveColumn()}
      </Table>
    );
  }

  _renderRemoveColumn() {
    if (this.state.removeMode) {
      return (
        <Column header="Remove" cell={material => (
          <Cell className="remove"><div onClick={this._removeMaterial.bind(this, material)}>X</div></Cell>
        )}/>
      );
    }
  }
}

export default JewelryProduct;
