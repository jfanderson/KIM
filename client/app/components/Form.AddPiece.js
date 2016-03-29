import React from 'react';

import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class AddPieceForm extends React.Component {
  constructor() {
    super();

    this.state = {
      description: '',
      item: ''
    };
  }

  _handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  _handleItemChange(event) {
    this.setState({ item: event.target.value });
  }

  _handleSubmit(event) {
    event.preventDefault();

    let state = this.state;

    if (!state.item || !state.description) {
      sign.setMessage('Give it an item number and description.');
    } else {
      this.props.submit(state.item, state.description);
      this.props.cancel();
    }
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <div className="popup">
        <h2>Make a New Jewelry Piece</h2>
        <form onSubmit={this._handleSubmit.bind(this)}>
          <input autoFocus
            onChange={this._handleItemChange.bind(this)}
            placeholder="Item Number"
            type="text"
            value={state.item}
          />
          <input onChange={this._handleDescriptionChange.bind(this)}
            placeholder="Description"
            type="text"
            value={state.description}
          />
          <button className="save" type="submit">Add</button>
          <button className="cancel-form" type="text" onClick={props.cancel.bind(this)}>Cancel</button>
        </form>
      </div>
    );
  }
}

AddPieceForm.propTypes = {
  cancel: PropTypes.func,
  submit: PropTypes.func.isRequired
};

export default AddPieceForm;
