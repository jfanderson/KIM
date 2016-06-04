import React from 'react';
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

  render() {
    let props = this.props;
    let state = this.state;

    // So the user sees 'Jewelry Type' instead of 'Piece Type'
    let title = props.type === 'material' ? props.type : 'jewelry';

    return (
      <div className="popup" style={{ top: props.top }}>
        <h2>Make a New {title} Type</h2>
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
}

AddTypeForm.propTypes = {
  cancel: PropTypes.func,
  submit: PropTypes.func.isRequired,
  top: PropTypes.number,
  // 'material' or 'piece'
  type: PropTypes.string.isRequired
};

export default AddTypeForm;
