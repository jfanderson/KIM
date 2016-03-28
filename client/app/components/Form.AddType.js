import React from 'react';
import classnames from 'classnames';
import _ from 'underscore';
import h from '../helpers.js';
import j from '../services/jewelryService.js';
import m from '../services/materialService.js';
import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class AddTypeForm extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      lowStock: ''
    };
  }

  _handleLowStockChange(event) {
    this.setState({ lowStock: event.target.value });
  }

  _handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  _handleSubmit(event) {
    event.preventDefault();

    let state = this.state;

    if (!state.name) {
      sign.setMessage('Give it a name');
      return;
    }

    let lowStock = Number(state.lowStock);

    if (isNaN(lowStock) || lowStock % 1 !== 0) {
      sign.setMessage('Make sure quantity is a whole number.');
    } else if (lowStock) {
      this.props.submit(state.name, lowStock);
      this.props.cancel();
    } else {
      this.props.submit(state.name, 0);
      this.props.cancel();
    }
  }

  render() {
    let props = this.props;
    let state = this.state;

    let classes = classnames({
      popup: true,
      [props.type]: true
    });

    return (
      <div className={classes}>
        <h2>Make a New {h.capitalize(props.type)} Type</h2>
        <form onSubmit={this._handleSubmit.bind(this)}>
          <input autoFocus
            onChange={this._handleNameChange.bind(this)}
            placeholder="Name"
            type="text"
            value={state.name}
          />
          <input onChange={this._handleLowStockChange.bind(this)}
            placeholder="Low Stock Quantity (optional)"
            type="text"
            value={state.lowStock}
          />
          <button className="save" type="submit">Add</button>
          <button className="cancel-form" type="text" onClick={props.cancel.bind(this)}>Cancel</button>
        </form>
      </div>
    );
  }
}

AddTypeForm.propTypes = {
  cancel: PropTypes.func,
  submit: PropTypes.func.isRequired,
  // 'material' or 'piece'
  type: PropTypes.string.isRequired
};

export default AddTypeForm;
