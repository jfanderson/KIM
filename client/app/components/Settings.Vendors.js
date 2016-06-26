import React from 'react';

import h from '../helpers.js';
import v from '../services/vendorService.js';
import sign from '../services/sign.js';

import AddVendorForm from './Form.AddVendor.js';
import Cell from './Cell.js';
import Column from './Column.js';
import Table from './Table.js';

class VendorSettings extends React.Component {
  constructor() {
    super();

    this.state = {
      vendors: [],
      removeMode: false,
      isAddVendorFormOpen: false
    };
  }

  componentDidMount() {
    this._updateVendors();
  }

  //-----------------------------------
  // RENDERING
  //-----------------------------------
  render() {
    return (
      <div>
        <h2 className="with-button" ref={h2 => { this._vendorTitle = h2; }}>Vendors</h2>
        <button className="add-button inner" onClick={this._handleAddClick.bind(this)}>+</button>
        <button className="remove-button inner" onClick={this._handleRemoveModeClick.bind(this)}>--</button>
        <Table classes="inner" data={this.state.vendors} uniqueId="company">
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

        {this._renderAddVendorForm()}
      </div>
    );
  }

  _renderAddVendorForm() {
    if (this.state.isAddVendorFormOpen) {
      return (
        <AddVendorForm cancel={this._handleAddClick.bind(this)}
          submit={this._handleVendorSubmit.bind(this)}
          top={h.findPopupTopValue(this._vendorTitle)}
        />
      );
    }
  }

  _renderVendorRemoveColumn() {
    if (this.state.removeMode) {
      return (
        <Column header="Remove" cell={vendor => (
            <Cell className="remove"><div onClick={this._removeVendor.bind(this, vendor)}>X</div></Cell>
          )}
        />
      );
    }
  }

  //-----------------------------------
  // PRIVATE METHODS
  //-----------------------------------
  _handleAddClick(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isAddVendorFormOpen: !this.state.isAddVendorFormOpen });
  }

  _handleRemoveModeClick() {
    this.setState({ removeMode: !this.state.removeMode });
  }

  _handleVendorSubmit(vendor) {
    v.addVendor(vendor).then(() => {
      this._updateVendors();
    }).catch(() => {
      sign.setError('Failed to add new vendor.');
    });
  }

  _modifyVendor(vendorId, key, value) {
    let vendors = this.state.vendors;

    for (let i = 0; i < vendors.length; i++) {
      if (vendors[i].id === vendorId) {
        vendors[i][key] = value;
        break;
      }
    }

    this.setState({ vendors });

    v.modifyVendor(vendorId, key, value)
      .catch(() => {
        sign.setError('Failed to modify vendor. Try refreshing.');
        this.state.vendors = null;
      });
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

  _updateVendors() {
    v.getVendors().then(vendors => {
      this.setState({ vendors });
    }).catch(() => {
      sign.setError('Failed to retrieve vendors. Try refreshing.');
    });
  }
}

export default VendorSettings;
