import React from 'react';

import h from '../helpers.js';
import c from '../services/contractorService.js';
import sign from '../services/sign.js';

import AddContractorForm from './Form.AddContractor.js';
import Cell from './Cell.js';
import Column from './Column.js';
import Table from './Table.js';

class ContractorSettings extends React.Component {
  constructor() {
    super();

    this.state = {
      contractors: [],
      removeMode: false,
      isAddContractorFormOpen: false
    };
  }

  componentDidMount() {
    this._updateContractors();
  }

  render() {
    return (
      <div className="contractors">
        <h2 className="with-button" ref={h2 => { this._contractorTitle = h2; }}>Contractors</h2>
        <button className="add-button inner" onClick={this._handleAddClick.bind(this)}>+</button>
        <button className="remove-button inner" onClick={this._handleRemoveModeClick.bind(this)}>--</button>
        <Table classes="inner" data={this.state.contractors} uniqueId="name">
          <Column header="Name" cell={contractor => (
              <Cell modifyField={this._modifyContractor.bind(this, contractor.id, 'name')}>{contractor.name}</Cell>
            )}
          />
          {this._renderRemoveColumn()}
        </Table>

        {this._renderAddContractorForm()}
      </div>
    );
  }

  _renderRemoveColumn() {
    if (this.state.removeMode) {
      return (
        <Column header="Remove" cell={contractor => (
            <Cell className="remove"><div onClick={this._removeContractor.bind(this, contractor)}>X</div></Cell>
          )}
        />
      );
    }
  }

  _renderAddContractorForm() {
    if (this.state.isAddContractorFormOpen) {
      return (
        <AddContractorForm cancel={this._handleAddClick.bind(this)}
          submit={this._handleContractorSubmit.bind(this)}
          top={h.findPopupTopValue(this._contractorTitle)}
        />
      );
    }
  }

  _handleAddClick(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isAddContractorFormOpen: !this.state.isAddContractorFormOpen });
  }

  _handleContractorSubmit(contractor) {
    c.addContractor(contractor).then(() => {
      this._updateContractors();
    }).catch(() => {
      sign.setError('Failed to add new contractor.');
    });
  }

  _handleRemoveModeClick() {
    this.setState({ removeMode: !this.state.removeMode });
  }

  _modifyContractor(contractorId, key, value) {
    let contractors = this.state.contractors;

    for (let i = 0; i < contractors.length; i++) {
      if (contractors[i].id === contractorId) {
        contractors[i][key] = value;
        break;
      }
    }

    this.setState({ contractors });

    c.modifyContractor(contractorId, key, value)
      .catch(() => {
        sign.setError('Failed to modify contractor. Try refreshing.');
        this.state.contractors = null;
      });
  }

  _removeContractor(contractor) {
    let confirmed = confirm(`Are you sure you want to remove ${contractor.name}?`);

    if (confirmed) {
      c.removeContractor(contractor.id).then(() => {
        this._updateContractors();
      }).catch(() => {
        sign.setError('Failed to remove contractor.');
      });
    }
  }

  _updateContractors() {
    c.getContractors().then(contractors => {
      this.setState({ contractors });
    }).catch(() => {
      sign.setError('Failed to retrieve contractors. Try refreshing.');
    });
  }
}

export default ContractorSettings;
