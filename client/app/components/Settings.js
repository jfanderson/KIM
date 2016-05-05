import React from 'react';

import h from '../helpers.js';
import j from '../services/jewelryService.js';
import m from '../services/materialService.js';
import s from '../services/settingsService.js';
import v from '../services/vendorService.js';
import sign from '../services/sign.js';

import Cell from './Cell.js';
import Column from './Column.js';
import Table from './Table.js';
import AddTypeForm from './Form.AddType.js';
import AddVendorForm from './Form.AddVendor.js';

class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      isPieceTypeFormOpen: false,
      isMaterialTypeFormOpen: false,
      isVendorFormOpen: false,
      laborCost: 0,
      materialTypeRemoveMode: false,
      materialTypes: [],
      pieceTypeRemoveMode: false,
      pieceTypes: [],
      vendorRemoveMode: false,
      vendors: []
    };
  }

  //-----------------------------------
  // LIFECYCLE
  //-----------------------------------
  componentDidMount() {
    s.getSettings().then(settings => {
      this.setState({ laborCost: settings.laborCost });
    }).catch(() => {
      sign.setError('Failed to retrieve settings. Try refreshing.');
    });

    this._updatePieceTypes();
    this._updateMaterialTypes();
    this._updateVendors();
  }

  //-----------------------------------
  // PRIVATE METHODS
  //-----------------------------------
  _handleAddFormClick(form, event) {
    if (event) {
      event.preventDefault();
    }

    let state = this.state;
    this.setState({
      isMaterialTypeFormOpen: form === 'materialType' && !state.isMaterialTypeFormOpen,
      isPieceTypeFormOpen: form === 'pieceType' && !state.isPieceTypeFormOpen,
      isVendorFormOpen: form === 'vendor' && !state.isVendorFormOpen
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
    }).catch(() => {
      sign.setError('Failed to add new material type.');
    });
  }

  _handlePieceTypeSubmit(name, lowStock) {
    j.addPieceType({
      name,
      lowStock
    }).then(() => {
      this._updatePieceTypes();
    }).catch(() => {
      sign.setError('Failed to add new jewelry type.');
    });
  }

  _handleRemoveModeClick(entity) {
    this.setState({ [`${entity}RemoveMode`]: !this.state[`${entity}RemoveMode`] });
  }

  _handleVendorSubmit(vendor) {
    v.addVendor(vendor).then(() => {
      this._updateVendors();
    }).catch(() => {
      sign.setError('Failed to add new vendor.');
    });
  }

  _modifyMaterialType(typeId, field, value) {
    let types = this.state.materialTypes;

    for (let i = 0; i < types.length; i++) {
      if (types[i].id === typeId) {
        types[i][field] = value;
        break;
      }
    }

    this.setState({ materialTypes: types });

    m.modifyType(typeId, field, value)
      .catch(() => {
        sign.setError('Failed to modify material type. Try refreshing.');
        this.state.materialTypes = null;
      });
  }

  _modifyPieceType(typeId, field, value) {
    let types = this.state.pieceTypes;

    for (let i = 0; i < types.length; i++) {
      if (types[i].id === typeId) {
        types[i][field] = value;
        break;
      }
    }

    this.setState({ pieceTypes: types });

    j.modifyType(typeId, field, value)
      .catch(() => {
        sign.setError('Failed to modify jewelry type. Try refreshing.');
        this.state.pieceTypes = null;
      });
  }

  _modifyVendor(vendorId, field, value) {
    let vendors = this.state.vendors;

    for (let i = 0; i < vendors.length; i++) {
      if (vendors[i].id === vendorId) {
        vendors[i][field] = value;
        break;
      }
    }

    this.setState({ vendors });

    v.modifyVendor(vendorId, field, value)
      .catch(() => {
        sign.setError('Failed to modify vendor. Try refreshing.');
        this.state.vendors = null;
      });
  }

  _removeMaterialType(type) {
    let confirmed = confirm(`Are you sure you want to remove ${type.name}?`);

    if (confirmed) {
      m.removeMaterialType(type.id).then(() => {
        this._updateMaterialTypes();
      }).catch(() => {
        sign.setError('Failed to remove material type.');
      });
    }
  }

  _removePieceType(type) {
    let confirmed = confirm(`Are you sure you want to remove ${type.name}?`);

    if (confirmed) {
      j.removePieceType(type.id).then(() => {
        this._updatePieceTypes();
      }).catch(() => {
        sign.setError('Failed to remove jewelry type.');
      });
    }
  }

  _removeVendor(vendor) {
    let confirmed = confirm(`Are you sure you want to remove ${vendor.company}?`);

    if (confirmed) {
      v.removeVendor(vendor.id).then(() => {
        this._updateVendors();
      }).catch(() => {
        sign.setError('Failed to remove vendor.');
      });
    }
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

  _updateVendors() {
    v.getVendors().then(vendors => {
      this.setState({ vendors });
    }).catch(() => {
      sign.setError('Failed to retrieve vendors. Try refreshing.');
    });
  }

  //-----------------------------------
  // RENDERING
  //-----------------------------------
  render() {
    let state = this.state;

    return (
      <div className="content settings">
        <div className="container-50">
          <div>
            <h2>Labor Cost</h2>
            <input className="labor-cost" type="text" value={state.laborCost} onChange={this._handleLaborCostChange.bind(this)} />
            <button className="save" type="button" onClick={this._handleLaborCostButtonClick.bind(this)}>Save</button>
          </div>

          <h2 className="with-button" ref={h2 => { this._vendorTitle = h2; }}>Vendors</h2>
          <button className="add-button inner" onClick={this._handleAddFormClick.bind(this, 'vendor')}>+</button>
          <button className="remove-button inner" onClick={this._handleRemoveModeClick.bind(this, 'vendor')}>--</button>
          <Table classes="inner" data={state.vendors} uniqueId="company">
            <Column header="Company" cell={vendor => (
                <Cell modifyField={this._modifyVendor.bind(this, vendor.id, 'company')}>{vendor.company}</Cell>
              )}
            />
            <Column header="Address" cell={vendor => (
                <Cell modifyField={this._modifyVendor.bind(this, vendor.id, 'address')}>{vendor.address}</Cell>
              )}
            />
            <Column header="Phone" cell={vendor => (
                <Cell modifyField={this._modifyVendor.bind(this, vendor.id, 'phone')}>{vendor.phone}</Cell>
              )}
            />
            <Column header="Email" cell={vendor => (
                <Cell modifyField={this._modifyVendor.bind(this, vendor.id, 'email')}>{vendor.email}</Cell>
              )}
            />
            {this._renderVendorRemoveColumn()}
          </Table>

          <h2 className="with-button" ref={h2 => { this._pieceTypeTitle = h2; }}>Types of Jewelry</h2>
          <button className="add-button inner" onClick={this._handleAddFormClick.bind(this, 'pieceType')}>+</button>
          <button className="remove-button inner" onClick={this._handleRemoveModeClick.bind(this, 'pieceType')}>--</button>
          <Table classes="inner" data={state.pieceTypes} uniqueId="name">
            <Column header="Type" cell={type => (
                <Cell modifyField={this._modifyPieceType.bind(this, type.id, 'name')}>{type.name}</Cell>
              )}
            />
            <Column header="Low Stock" cell={type => (
                <Cell modifyField={this._modifyPieceType.bind(this, type.id, 'lowStock')} integer>{type.lowStock}</Cell>
              )}
            />
            {this._renderPieceTypeRemoveColumn()}
          </Table>

          <h2 className="with-button" ref={h2 => { this._materialTypeTitle = h2; }}>Types of Materials</h2>
          <button className="add-button inner" onClick={this._handleAddFormClick.bind(this, 'materialType')}>+</button>
          <button className="remove-button inner" onClick={this._handleRemoveModeClick.bind(this, 'materialType')}>--</button>
          <Table classes="inner" data={state.materialTypes} uniqueId="name">
            <Column header="Type" cell={type => (
                <Cell modifyField={this._modifyMaterialType.bind(this, type.id, 'name')}>{type.name}</Cell>
              )}
            />
            <Column header="Low Stock" cell={type => (
                <Cell modifyField={this._modifyMaterialType.bind(this, type.id, 'lowStock')} integer>{type.lowStock}</Cell>
              )}
            />
            <Column header="Unit" cell={type => (
                <Cell modifyField={this._modifyMaterialType.bind(this, type.id, 'unit')}>{type.unit}</Cell>
              )}
            />
            {this._renderMaterialTypeRemoveColumn()}
          </Table>
        </div>

        {this._renderVendorForm()}
        {this._renderPieceTypeForm()}
        {this._renderMaterialTypeForm()}
      </div>
    );
  }

  _renderPieceTypeForm() {
    if (this.state.isPieceTypeFormOpen) {
      return (
        <AddTypeForm cancel={this._handleAddFormClick.bind(this, 'pieceType')}
          submit={this._handlePieceTypeSubmit.bind(this)}
          top={h.findPopupTopValue(this._pieceTypeTitle)}
          type="piece"
        />
      );
    }
  }

  _renderPieceTypeRemoveColumn() {
    if (this.state.pieceTypeRemoveMode) {
      return (
        <Column header="Remove" cell={pieceType => (
            <Cell className="remove"><div onClick={this._removePieceType.bind(this, pieceType)}>X</div></Cell>
          )}
        />
      );
    }
  }

  _renderMaterialTypeForm() {
    if (this.state.isMaterialTypeFormOpen) {
      return (
        <AddTypeForm cancel={this._handleAddFormClick.bind(this, 'materialType')}
          submit={this._handleMaterialTypeSubmit.bind(this)}
          top={h.findPopupTopValue(this._materialTypeTitle)}
          type="material"
        />
      );
    }
  }

  _renderMaterialTypeRemoveColumn() {
    if (this.state.materialTypeRemoveMode) {
      return (
        <Column header="Remove" cell={materialType => (
            <Cell className="remove"><div onClick={this._removeMaterialType.bind(this, materialType)}>X</div></Cell>
          )}
        />
      );
    }
  }

  _renderVendorForm() {
    if (this.state.isVendorFormOpen) {
      return (
        <AddVendorForm cancel={this._handleAddFormClick.bind(this, 'vendor')}
          submit={this._handleVendorSubmit.bind(this)}
          top={h.findPopupTopValue(this._vendorTitle)}
        />
      );
    }
  }

  _renderVendorRemoveColumn() {
    if (this.state.vendorRemoveMode) {
      return (
        <Column header="Remove" cell={vendor => (
            <Cell className="remove"><div onClick={this._removeVendor.bind(this, vendor)}>X</div></Cell>
          )}
        />
      );
    }
  }
}

export default Settings;
