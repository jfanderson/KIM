import React from 'react';

import h from '../helpers.js';
import j from '../services/jewelryService.js';
import m from '../services/materialService.js';
import sign from '../services/sign.js';

import AddTypeForm from './Form.AddType.js';
import Cell from './Cell.js';
import Column from './Column.js';
import Table from './Table.js';

const { PropTypes } = React;

class TypeSettings extends React.Component {
  constructor(props) {
    super(props);

    if (props.type === 'piece') {
      this._service = j;
    } else {
      this._service = m;
    }

    this.state = {
      types: [],
      removeMode: false,
      isAddTypeFormOpen: false
    };
  }

  componentDidMount() {
    this._updateTypes();
  }

  //-----------------------------------
  // RENDERING
  //-----------------------------------
  render() {
    let title = this.props.type === 'piece' ? 'Jewelry' : 'Materials';

    return (
      <div>
        <h2 className="with-button" ref={h2 => { this._typeTitle = h2; }}>Types of {title}</h2>
        <button className="add-button inner" onClick={this._handleAddClick.bind(this)}>+</button>
        <button className="remove-button inner" onClick={this._handleRemoveModeClick.bind(this)}>--</button>
        <Table classes="inner" data={this.state.types} uniqueId="name">
          <Column header="Type" cell={type => (
              <Cell modifyField={this._modifyType.bind(this, type.id, 'name')}>{type.name}</Cell>
            )}
          />
          <Column header="Low Stock" cell={type => (
              <Cell modifyField={this._modifyType.bind(this, type.id, 'lowStock')} integer>{type.lowStock}</Cell>
            )}
          />
          {this._renderUnitColumn()}
          {this._renderTypeRemoveColumn()}
        </Table>


        {this._renderAddTypeForm()}
      </div>
    );
  }

  _renderUnitColumn() {
    if (this.props.type === 'material') {
      return (
        <Column header="Unit" cell={type => (
            <Cell modifyField={this._modifyType.bind(this, type.id, 'unit')}>{type.unit}</Cell>
          )}
        />
      );
    }
  }

  _renderAddTypeForm() {
    if (this.state.isAddTypeFormOpen) {
      return (
        <AddTypeForm cancel={this._handleAddClick.bind(this)}
          submit={this._handleTypeSubmit.bind(this)}
          top={h.findPopupTopValue(this._typeTitle)}
          type={this.props.type}
        />
      );
    }
  }

  _renderTypeRemoveColumn() {
    if (this.state.removeMode) {
      return (
        <Column header="Remove" cell={type => (
            <Cell className="remove"><div onClick={this._removeType.bind(this, type)}>X</div></Cell>
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

    this.setState({ isAddTypeFormOpen: !this.state.isAddTypeFormOpen });
  }

  _handleRemoveModeClick() {
    this.setState({ removeMode: !this.state.removeMode });
  }

  _handleTypeSubmit(name, lowStock) {
    this._service.addType({
      name,
      lowStock
    }).then(() => {
      this._updateTypes();
    }).catch(() => {
      sign.setError('Failed to add new type.');
    });
  }

  _modifyType(typeId, key, value) {
    let types = this.state.types;

    for (let i = 0; i < types.length; i++) {
      if (types[i].id === typeId) {
        types[i][key] = value;
        break;
      }
    }

    this.setState({ types });

    this._service.modifyType(typeId, key, value)
      .catch(() => {
        sign.setError('Failed to modify the type. Try refreshing.');
        this.state.types = null;
      });
  }

  _removeType(type) {
    let confirmed = confirm(`Are you sure you want to remove ${type.name}?`);

    if (confirmed) {
      this._service.removeType(type.id).then(() => {
        this._updateTypes();
      }).catch(() => {
        sign.setError('Failed to remove type.');
      });
    }
  }

  _updateTypes() {
    this._service.getTypes().then(types => {
      this.setState({ types });
    }).catch(() => {
      sign.setError('Failed to retrieve types. Try refreshing.');
    });
  }
}

TypeSettings.propTypes = {
  type: PropTypes.oneOf(['material', 'piece']).isRequired
};

export default TypeSettings;
