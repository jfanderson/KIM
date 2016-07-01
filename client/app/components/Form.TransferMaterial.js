import React from 'react';

import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class TransferMaterialForm extends React.Component {
  constructor() {
    super();

    this.state = {
      qty: '',
    };
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <div className="popup">
        <h2>Transfer {props.material.description} to {props.contractor.name}</h2>
        <form onSubmit={this._handleSubmit.bind(this)}>
          <input autoFocus
            onChange={this._handleQtyChange.bind(this)}
            placeholder="Quantity"
            type="text"
            value={state.qty}
          />
          <button className="save" type="submit">Transfer</button>
          <button className="cancel-form" type="text" onClick={props.cancel.bind(this)}>Cancel</button>
        </form>
      </div>
    );
  }

  _handleQtyChange(event) {
    this.setState({ qty: event.target.value });
  }

  _handleSubmit(event) {
    event.preventDefault();

    let state = this.state;

    let qty = Number(state.qty);

    if (!qty) {
      sign.setMessage('No quantity given.');
    } else if (isNaN(qty) || qty % 1 !== 0) {
      sign.setMessage('Make sure quantity is a whole number.');
    } else if (qty > this.props.material.qtyInStock) {
      sign.setMessage('That\'s more than you have in stock.');
    } else {
      this.props.submit(qty);
      this.props.cancel();
    }
  }
}

TransferMaterialForm.propTypes = {
  cancel: PropTypes.func,
  contractor: PropTypes.object,
  material: PropTypes.object,
  submit: PropTypes.func.isRequired,
};

export default TransferMaterialForm;
