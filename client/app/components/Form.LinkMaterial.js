import React from 'react';
import _ from 'underscore';
import m from '../services/materialService.js';
import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class LinkMaterialForm extends React.Component {
  constructor() {
    super();

    this.state = {
      description: '',
      materials: [],
      qty: '',
      selectedMaterial: null
    };
  }

  componentDidMount() {
    m.getAllMaterials().then(materials => {
      this.setState({ materials });
    });
  }

  _handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  _handleQtyChange(event) {
    this.setState({ qty: event.target.value });
  }

  _handleSubmit(event) {
    event.preventDefault();

    let state = this.state;
    let material = _.findWhere(state.materials, { description: state.description });
    let qty = Number(state.qty);

    if (material) {
      if (isNaN(qty) || qty % 1 !== 0) {
        sign.setMessage('Make sure quantity is a whole number.');
      } else if (qty) {
        this.props.submit(material, qty);
        this.props.cancel();
      } else {
        this.props.submit(material, 0);
        this.props.cancel();
      }
    } else {
      sign.setMessage('That\'s not a material.');
    }
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <div className="popup">
        <h2>Add a Material to {props.pieceDescription}</h2>
        <form onSubmit={this._handleSubmit.bind(this)}>
          <input autoFocus
            list="materials"
            onChange={this._handleDescriptionChange.bind(this)}
            placeholder="Description"
            type="text"
            value={state.description}
          />
          <input onChange={this._handleQtyChange.bind(this)}
            placeholder="Quantity (optional)"
            type="text"
            value={state.qty}
          />
          <button className="save" type="submit">Add</button>
          <button className="cancel-form" type="text" onClick={props.cancel.bind(this)}>Cancel</button>
        </form>

        <datalist id="materials">
          {state.materials.map(material =>
            <option key={material.item} value={material.description} />
          )}
        </datalist>
      </div>
    );
  }
}

LinkMaterialForm.propTypes = {
  cancel: PropTypes.func,
  pieceDescription: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired
};

export default LinkMaterialForm;
