import React from 'react';

import s from '../services/settingsService.js';
import sign from '../services/sign.js';

import ContractorSettings from './Settings.Contractors.js';
import VendorSettings from './Settings.Vendors.js';
import TypeSettings from './Settings.Types.js';

class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      isPieceTypeFormOpen: false,
      isMaterialTypeFormOpen: false,
      laborCost: 0,
      materialTypeRemoveMode: false,
      materialTypes: [],
      pieceTypeRemoveMode: false,
      pieceTypes: []
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

          <ContractorSettings />
          <VendorSettings />
          <TypeSettings type="piece" />
          <TypeSettings type="material" />
        </div>
      </div>
    );
  }

  //-----------------------------------
  // PRIVATE METHODS
  //-----------------------------------
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
}

export default Settings;
