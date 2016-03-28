import React from 'react';

import j from '../services/jewelryService.js';
import m from '../services/materialService.js';
import s from '../services/settingsService.js';
import sign from '../services/sign.js';

import Cell from './Cell.js';
import Column from './Column.js';
import Table from './Table.js';
import AddTypeForm from './Form.AddType.js';

class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      isPieceFormOpen: false,
      isMaterialFormOpen: false,
      laborCost: 0,
      materialTypes: [],
      pieceTypes: []
    };
  }

  componentDidMount() {
    s.getSettings().then(settings => {
      this.setState({ laborCost: settings.laborCost });
    }).catch(() => {
      sign.setError('Failed to retrieve settings. Try refreshing.');
    });

    this._updatePieceTypes();
    this._updateMaterialTypes();
  }

  _handleAddPieceType(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      isMaterialFormOpen: false,
      isPieceFormOpen: !this.state.isPieceFormOpen
    });
  }

  _handleAddMaterialType(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      isMaterialFormOpen: !this.state.isMaterialFormOpen,
      isPieceFormOpen: false
    });
  }

  _handleLaborCostButtonClick() {
    s.modifyLaborCost(this.state.laborCost).then(() => {
      sign.setMessage('Labor cost saved.');
    }).catch(() => {
      sign.setError('Failed to save labor cost.');
    });
  }

  _handleLaborCostChange(event) {
    this.setState({ laborCost: event.target.value });
  }

  _handleMaterialTypeSubmit(name, lowStock) {
    m.addMaterialType({
      name,
      lowStock
    }).then(() => {
      this._updateMaterialTypes();
    }).catch(error => {
      sign.setError('Failed to add new material type.');
    });
  }

  _handlePieceTypeSubmit(name, lowStock) {
    j.addPieceType({
      name,
      lowStock
    }).then(() => {
      this._updatePieceTypes();
    }).catch(error => {
      sign.setError('Failed to add new jewelry type.');
    });
  }

  _modifyMaterialType(typeId, field, value) {
    var types = this.state.materialTypes;

    for (var i = 0; i < types.length; i++) {
      if (types[i].id === typeId) {
        types[i][field] = value;
        break;
      }
    }

    this.setState({ materialTypes: types });

    m.modifyType(typeId, field, value)
      .catch(error => {
        sign.setError('Failed to modify material type. Try refreshing.');
        this.state.materialTypes = null;
      });
  }

  _modifyPieceType(typeId, field, value) {
    var types = this.state.pieceTypes;

    for (var i = 0; i < types.length; i++) {
      if (types[i].id === typeId) {
        types[i][field] = value;
        break;
      }
    }

    this.setState({ pieceTypes: types });

    j.modifyType(typeId, field, value)
      .catch(error => {
        sign.setError('Failed to modify jewelry type. Try refreshing.');
        this.state.pieceTypes = null;
      });
  }

  _updateMaterialTypes() {
    m.getTypes().then(types => {
      this.setState({ materialTypes: types });
    }).catch(() => {
      sign.setError('Failed to retrieve material types. Try refreshing.');
    });
  }

  _updatePieceTypes() {
    j.getTypes().then(types => {
      this.setState({ pieceTypes: types });
    }).catch(() => {
      sign.setError('Failed to retrieve jewelry types. Try refreshing.');
    });
  }

  render() {
    let state = this.state;

    return (
      <div className="content settings">
        <div className="container-50">
          <div>
            <h2>Labor Cost</h2>
            <input className="labor-cost" type="text" value={state.laborCost} onChange={this._handleLaborCostChange.bind(this)}/>
            <button className="save" type="button" onClick={this._handleLaborCostButtonClick.bind(this)}>Save</button>
          </div>

          <h2 className="with-button">Types of Jewelry</h2>
          <button className="add-button inner" onClick={this._handleAddPieceType.bind(this)}>+</button>
          <Table classes="inner" data={state.pieceTypes} uniqueId="name">
            <Column header="Type" cell={type => (
              <Cell modifyField={this._modifyPieceType.bind(this, type.id, 'name')}>{type.name}</Cell>
            )}/>
            <Column header="Low Stock" cell={type => (
              <Cell modifyField={this._modifyPieceType.bind(this, type.id, 'lowStock')} integer>{type.lowStock}</Cell>
            )}/>
          </Table>

          <h2 className="with-button">Types of Materials</h2>
          <button className="add-button inner" onClick={this._handleAddMaterialType.bind(this)}>+</button>
          <Table classes="inner" data={state.materialTypes} uniqueId="name">
            <Column header="Type" cell={type => (
              <Cell modifyField={this._modifyMaterialType.bind(this, type.id, 'name')}>{type.name}</Cell>
            )}/>
            <Column header="Low Stock" cell={type => (
              <Cell modifyField={this._modifyMaterialType.bind(this, type.id, 'lowStock')} integer>{type.lowStock}</Cell>
            )}/>
          </Table>
        </div>

        {this._renderPieceForm()}
        {this._renderMaterialForm()}
      </div>
    );
  }

  _renderPieceForm() {
    if (this.state.isPieceFormOpen) {
      return (
        <AddTypeForm cancel={this._handleAddPieceType.bind(this)}
          submit={this._handlePieceTypeSubmit.bind(this)}
          type="piece"
        />
      );
    }
  }

  _renderMaterialForm() {
    if (this.state.isMaterialFormOpen) {
      return (
        <AddTypeForm cancel={this._handleAddMaterialType.bind(this)}
          submit={this._handleMaterialTypeSubmit.bind(this)}
          type="material"
        />
      );
    }
  }
}

export default Settings;
