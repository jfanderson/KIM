import React from 'react';
import classnames from 'classnames';
import _ from 'underscore';

import m from '../services/materialService.js';
import v from '../services/vendorService.js';
import c from '../services/contractorService.js';
import sign from '../services/sign.js';
import h from '../helpers.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';
import SelectCell from './Cell.Select.js';
import AddMaterialForm from './Form.AddMaterial.js';
import TransferMaterialForm from './Form.TransferMaterial.js';

class Materials extends React.Component {
  constructor() {
    super();

    this.state = {
      filteredMaterials: [],
      isAddMaterialFormOpen: false,
      isTransferMaterialFormOpen: false,
      materials: [],
      removeMode: false, // If true, display removal column in table
      transferContractor: null,
      transferMaterial: null,
      types: [],
      vendors: [],
    };
  }

  //-----------------------------------
  // LIFECYCLE METHODS
  //-----------------------------------
  componentDidMount() {
    this._getMaterials().then(materials => {
      this._orderedContractorNames = materials[0].contractors.map(contractor => contractor.name);

      this.setState({
        materials,
        filteredMaterials: materials,
      });
    });

    m.getTypes().then(types => {
      this.setState({ types });
    }).catch(() => {
      sign.setError('Failed to retrieve material types. Try refreshing.');
    });

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

    let removeClasses = {
      'remove-button': true,
      active: state.removeMode,
    };

    return (
      <div>
        <div className="filters-container">
          <div className="filters">
            <span onClick={this._clearFilter.bind(this)}>All</span>
            {state.types.map(type => {
              if (type.name === 'none') {
                return null;
              }

              return <span key={type.id} onClick={this._filterByType.bind(this, type.id)}>{type.name}</span>;
            })}
            <span onClick={this._filterByLowStock.bind(this)}>Low Stock</span>
            <span onClick={this._filterByOutOfStock.bind(this)}>Out of Stock</span>

            <button className="add-button" onClick={this._handleAddMaterialClick.bind(this)}>+</button>
            <button className={classnames(removeClasses)} onClick={this._handleRemoveClick.bind(this)}>--</button>
          </div>
        </div>

        <div className="content">
          <Table data={state.filteredMaterials} uniqueId="item">
            <Column header="Item #" cell={material => (
                <Cell modifyField={this._modifyField.bind(this, material.id, 'item')}>{material.item}</Cell>
              )}
            />
            <Column classes="extra-wide" header="Description" cell={material => (
                <Cell modifyField={this._modifyField.bind(this, material.id, 'description')}>{material.description}</Cell>
              )}
            />
            <Column header="Type" cell={material => (
                <SelectCell modifyField={this._modifyField.bind(this, material.id, 'type')}
                  options={state.types.map(type => type.name)}
                  defaultValue={h.findTypeName(state.types, material.typeId)}
                />
              )}
            />
            <Column header="Vendor" cell={material => (
                <SelectCell modifyField={this._modifyField.bind(this, material.id, 'vendor')}
                  options={state.vendors.map(vendor => vendor.company)}
                  defaultValue={h.findVendorCompany(state.vendors, material.vendorId)}
                />
              )}
            />
            <Column header="Cost / Unit" cell={material => {
              let type = _.findWhere(state.types, { id: material.typeId });

              if (!type) {
                return <Cell />;
              }

              return (
                <Cell modifyField={this._modifyField.bind(this, material.id, 'costPerUnit')} pricePerUnit>
                  {h.displayPricePerUnit(material.costPerUnit, type.unit)}
                </Cell>
              );
            }}
            />
            <Column header="Qty on Order" cell={material => (
                <Cell modifyField={this._modifyField.bind(this, material.id, 'qtyOnOrder')} integer>{material.qtyOnOrder}</Cell>
              )}
            />
            {this._renderContractorQtys()}
            <Column header="Qty in Stock" cell={material => (
                <Cell modifyField={this._modifyField.bind(this, material.id, 'qtyInStock')} integer>{material.qtyInStock}</Cell>
              )}
            />
            {this._renderRemoveColumn()}
          </Table>
        </div>

        {this._renderAddMaterialForm()}
        {this._renderTransferMaterialForm()}
      </div>
    );
  }

  _renderContractorQtys() {
    if (this._orderedContractorNames) {
      return this._orderedContractorNames.map(name => {
        return (
          <Column key={name} header={`Qty with ${name}`} cell={material => {
            let contractor = material.contractors.find(con => con.name === name);

            return (
              <Cell className="editable"
                integer
                onClick={this._handleTransferMaterialClick.bind(this, material, contractor)}
              >
                {contractor.ContractorMaterial.qty}
              </Cell>
            );
          }}
          />
        );
      });
    }
  }

  _renderRemoveColumn() {
    if (this.state.removeMode) {
      return (
        <Column header="Remove" cell={material => (
            <Cell className="remove"><div onClick={this._removeMaterial.bind(this, material)}>X</div></Cell>
          )}
        />
      );
    }
  }

  _renderAddMaterialForm() {
    if (this.state.isAddMaterialFormOpen) {
      return (
        <AddMaterialForm
          cancel={this._handleAddMaterialClick.bind(this)}
          submit={this._submitAddForm.bind(this)}
        />
      );
    }
  }

  _renderTransferMaterialForm() {
    if (this.state.isTransferMaterialFormOpen) {
      return (
        <TransferMaterialForm
          cancel={this._closeTransferMaterialForm.bind(this)}
          contractor={this.state.transferContractor}
          material={this.state.transferMaterial}
          submit={this._submitTransferForm.bind(this)}
        />
      );
    }
  }

  //-----------------------------------
  // PRIVATE METHODS
  //-----------------------------------
  _clearFilter() {
    this.setState({ filteredMaterials: this.state.materials });
  }

  _closeTransferMaterialForm(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isTransferMaterialFormOpen: false });
  }

  _filterByLowStock() {
    let filteredMaterials = this.state.materials.filter(material => {
      let type = _.findWhere(this.state.types, { id: material.typeId });

      return material.qtyInStock <= type.lowStock;
    });

    this.setState({ filteredMaterials });
  }

  _filterByOutOfStock() {
    let filteredMaterials = this.state.materials.filter(material => material.qtyInStock <= 0);

    this.setState({ filteredMaterials });
  }

  _filterByType(typeId) {
    let filteredMaterials = this.state.materials.filter(material => material.typeId === typeId);

    this.setState({ filteredMaterials });
  }

  _getMaterials() {
    return m.getAllMaterials().catch(error => {
      console.log('[Component] Error retrieving materials: ', error);
      sign.setError('Failed to retrieve materials. Try refreshing.');
      this.setState({ materials: [] });
    });
  }

  _handleAddMaterialClick(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isAddMaterialFormOpen: !this.state.isAddMaterialFormOpen });
  }

  _handleTransferMaterialClick(material, contractor) {
    this.setState({
      isTransferMaterialFormOpen: true,
      transferContractor: contractor,
      transferMaterial: material,
    });
  }

  _handleRemoveClick() {
    this.setState({ removeMode: !this.state.removeMode });
  }

  _modifyField(materialId, field, value) {
    let state = this.state;
    let materials = state.materials;

    for (let i = 0; i < materials.length; i++) {
      if (materials[i].id === materialId) {
        if (field === 'type') {
          materials[i].typeId = h.findTypeId(state.types, value);
        } else if (field === 'vendor') {
          materials[i].vendorId = h.findVendorId(state.vendors, value);
        } else {
          materials[i][field] = value;
        }

        this.setState({ materials });
        break;
      }
    }

    m.modifyMaterial(materialId, field, value)
      .catch(() => {
        sign.setError('Failed to modify material.');
        this.setState({ materials: [] });
      });
  }

  _removeMaterial(material) {
    let confirmed = confirm(`Are you sure you want to remove ${material.description}?`);

    if (confirmed) {
      m.removeMaterial(material.id).then(() => {
        // Remove material from filtered set.
        this._getMaterials().then(materials => {
          let filteredMaterials = this.state.filteredMaterials.slice(0);

          for (let i = 0; i < filteredMaterials.length; i++) {
            if (filteredMaterials[i].id === material.id) {
              filteredMaterials.splice(i, 1);
              break;
            }
          }

          this.setState({
            materials,
            filteredMaterials,
          });
        });
      }).catch(() => {
        sign.setError('Failed to remove material.');
      });
    }
  }

  _submitAddForm(item, description) {
    m.addMaterial({
      item,
      description,
    }).then(() => {
      this._getMaterials().then(materials => {
        // Revert to "All" filter when new material is added.
        this.setState({
          materials,
          filteredMaterials: materials,
        });

        sign.setMessage('Showing all materials');
      });
    }).catch(() => {
      sign.setError('Failed to add material. Try refreshing.');
    });
  }

  _submitTransferForm(qty) {
    let { transferContractor, transferMaterial } = this.state;

    let materials = this.state.materials.slice(0);
    let material = this.state.materials.find(mat => mat.id === transferMaterial.id);
    let contractor = material.contractors.find(con => con.id === transferContractor.id);

    material.qtyInStock -= qty;
    contractor.ContractorMaterial.qty += qty;

    this.setState({ materials });

    c.transferMaterial(transferContractor.id, transferMaterial.id, qty).then(() => {
      sign.setMessage(`Transferred materials to ${transferContractor.name}`);
    }).catch(() => {
      sign.setError(`Failed to transfer materials to ${transferContractor.name}. Try refreshing.`);
    });
  }
}

export default Materials;
