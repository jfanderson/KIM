import React from 'react';
import classnames from 'classnames';
import _ from 'underscore';

import m from '../services/materialService.js';
import v from '../services/vendorService.js';
import sign from '../services/sign.js';
import h from '../helpers.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';
import AddMaterialForm from './Form.AddMaterial.js';
import SelectCell from './Cell.Select.js';

class Materials extends React.Component {
  constructor() {
    super();

    this.state = {
      filteredMaterials: [],
      isFormOpen: false,
      materials: [],
      removeMode: false, // If true, display removal column in table
      types: [],
      vendors: []
    };
  }

  //-----------------------------------
  // LIFECYCLE METHODS
  //-----------------------------------
  componentDidMount() {
    this._updateMaterials();

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
      active: state.removeMode
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

            <button className="add-button" onClick={this._handleAddClick.bind(this)}>+</button>
            <button className={classnames(removeClasses)} onClick={this._handleRemove.bind(this)}>--</button>
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
            <Column header="Qty in Stock" cell={material => (
                <Cell modifyField={this._modifyField.bind(this, material.id, 'qtyInStock')} integer>{material.qtyInStock}</Cell>
              )}
            />
            {this._renderRemoveColumn()}
          </Table>
        </div>

        {this._renderForm()}
      </div>
    );
  }

  _renderForm() {
    if (this.state.isFormOpen) {
      return (
        <AddMaterialForm
          cancel={this._handleAddClick.bind(this)}
          submit={this._handleFormSubmit.bind(this)}
        />
      );
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

  //-----------------------------------
  // PRIVATE METHODS
  //-----------------------------------
  _clearFilter() {
    this.setState({ filteredMaterials: this.state.materials });
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

  _handleAddClick(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isFormOpen: !this.state.isFormOpen });
  }

  _handleFormSubmit(item, description) {
    m.addMaterial({
      item,
      description
    }).then(() => {
      this._updateMaterials();
    }).catch(() => {
      sign.setError('Failed to add material. Try refreshing.');
    });
  }

  _handleRemove() {
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
        this._updateMaterials();

        // Remove from array of filtered materials.
        let filteredMaterials = this.state.filteredMaterials.slice(0);
        for (let i = 0; i < filteredMaterials; i++) {
          if (filteredMaterials[i].id === material.id) {
            let newFilteredMaterials = filteredMaterials.splice(i, 1);

            this.setState({ filteredMaterials: newFilteredMaterials });
          }
        }
      }).catch(() => {
        sign.setError('Failed to remove material.');
      });
    }
  }

  _updateMaterials() {
    m.getAllMaterials()
      .then(materials => this.setState({ materials }, () => {
        // Reset to "All" filter if there are no items displayed.
        if (this.state.filteredMaterials.length === 0) {
          this.setState({ filteredMaterials: this.state.materials });
        }
      }))
      .catch(error => {
        console.log('[Component] Error retrieving materials: ', error);
        sign.setError('Failed to retrieve materials. Try refreshing.');
        this.setState({ materials: [] });
      });
  }
}

export default Materials;
