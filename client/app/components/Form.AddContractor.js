import React from 'react';

import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class AddContractorForm extends React.Component {
  constructor() {
    super();

    this.state = {
      name: ''
    };
  }

  render() {
    let props = this.props;

    return (
      <div className="popup" style={{ top: props.top }}>
        <h2>Make a New Contractor</h2>
        <form onSubmit={this._handleSubmit.bind(this)}>
          <input autoFocus
            onChange={this._handleFieldChange.bind(this, 'name')}
            placeholder="Contractor Name"
            type="text"
            value={this.state.name}
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

    if (!this.state.name) {
      sign.setMessage('Give your contractor a name!');
    } else {
      let contractor = this.state;
      this.props.submit(contractor);
      this.props.cancel();
    }
  }
}

AddContractorForm.propTypes = {
  cancel: PropTypes.func,
  submit: PropTypes.func.isRequired,
  top: PropTypes.number
};

export default AddContractorForm;
