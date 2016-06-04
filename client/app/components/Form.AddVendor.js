import React from 'react';

import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class AddVendorForm extends React.Component {
  constructor() {
    super();

    this.state = {
      company: '',
      address: '',
      phone: '',
      email: ''
    };
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <div className="popup" style={{ top: props.top }}>
        <h2>Make a New Vendor</h2>
        <form onSubmit={this._handleSubmit.bind(this)}>
          <input autoFocus
            onChange={this._handleFieldChange.bind(this, 'company')}
            placeholder="Company Name"
            type="text"
            value={state.company}
          />
          <input onChange={this._handleFieldChange.bind(this, 'address')}
            placeholder="Address (optional)"
            type="text"
            value={state.address}
          />
          <input onChange={this._handleFieldChange.bind(this, 'phone')}
            placeholder="Phone Number (optional)"
            type="text"
            value={state.phone}
          />
          <input onChange={this._handleFieldChange.bind(this, 'email')}
            placeholder="Email Address (optional)"
            type="text"
            value={state.email}
          />
          <button className="save" type="submit">Add</button>
          <button className="cancel-form" type="text" onClick={props.cancel.bind(this)}>Cancel</button>
        </form>
      </div>
    );
  }

  _handleFieldChange(field, event) {
    this.setState({ [field]: event.target.value });
  }

  _handleSubmit(event) {
    event.preventDefault();

    if (!this.state.company) {
      sign.setMessage('Give it a company name.');
    } else {
      let vendor = this.state;
      this.props.submit(vendor);
      this.props.cancel();
    }
  }
}

AddVendorForm.propTypes = {
  cancel: PropTypes.func,
  submit: PropTypes.func.isRequired,
  top: PropTypes.number
};

export default AddVendorForm;
