import React from 'react';
import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class Cell extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false,
      value: ''
    };
  }

  _handleBlur(event) {
    this.setState({ editing: false });
  }

  _handleChange(event) {
    this.setState({ value: event.target.value });
  }

  _handleKeyDown(event) {
    let props = this.props;
    let state = this.state;

    if (event.keyCode === 13) {
      // Validation
      if (props.number || props.price || props.integer) {
        if (isNaN(Number(state.value))) {
          sign.setError('Value must be a number');
          return;
        } else if (props.integer && state.value % 1 !== 0) {
          sign.setError('Value must be a whole number');
          return;
        }
      }

      props.modifyField(state.value);
      this.setState({ editing: false });
    } else if (event.keyCode === 27) {
      this.setState({ editing: false });
    }
  }

  _startEditing() {
    if (this.props.price) {
      this.setState({
        editing: true,
        value: this.props.children.slice(1)
      });
    } else {
      this.setState({
        editing: true,
        value: this.props.children
      });
    }

    setTimeout(() => {
      this.refs.inputField.select();
    }, 0);
  }

  render() {
    let props = this.props;
    let state = this.state;

    if (props.modifyField && state.editing) {
      return (
        <td className="editing">
          <input autoFocus type="text"
            ref="inputField"
            value={state.value}
            list="items"
            onKeyDown={this._handleKeyDown.bind(this)}
            onChange={this._handleChange.bind(this)}
            onBlur={this._handleBlur.bind(this)}/>

          <datalist id="items">
            {props.datalist.map(item =>
              <option key={item} value={item}/>
            )}
          </datalist>
        </td>
      );
    } else if (props.modifyField) {
      return (
        <td className="editable" onClick={this._startEditing.bind(this)}>
          {props.children}
        </td>
      );
    } else {
      return (
        <td>
          {props.children}
        </td>
      );
    }
  }
}

Cell.propTypes = {
  // List of items for input autocomplete.
  datalist: PropTypes.array,
  // True if value must be an integer.
  integer: PropTypes.bool,
  // If passed, make cell editable on click.
  // Callback invoked with new cell value.
  modifyField: PropTypes.func,
  // True if cell represents a numerical value
  number: PropTypes.bool,
  // True if cell represents a price value
  price: PropTypes.bool
};

Cell.defaultProps = {
  datalist: [],
  int: false,
  price: false
};

export default Cell;
