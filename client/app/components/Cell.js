import React from 'react';
import classnames from 'classnames';
import sign from '../services/sign.js';

const PropTypes = React.PropTypes;

class Cell extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false,
      value: '',
    };
  }

  //-----------------------------------
  // RENDERING
  //-----------------------------------
  render() {
    let props = this.props;
    let state = this.state;

    let classes = {
      [props.className]: props.className,
    };

    if (props.modifyField && state.editing) {
      return (
        <td className="editing">
          <input autoFocus type="text"
            ref="inputField"
            value={state.value}
            list="items"
            onKeyDown={this._handleKeyDown.bind(this)}
            onChange={this._handleChange.bind(this)}
            onBlur={this._handleBlur.bind(this)}
          />

          <datalist id="items">
            {props.datalist.map(item =>
              <option key={item} value={item} />
            )}
          </datalist>
        </td>
      );
    } else if (props.modifyField) {
      classes.editable = true;

      return (
        <td className={classnames(classes)} onClick={this._startEditing.bind(this)}>
          {props.children}
        </td>
      );
    }

    return (
      <td className={classnames(classes)} onClick={props.onClick}>
        {props.children}
      </td>
    );
  }


  //-----------------------------------
  // PRIVATE METHODS
  //-----------------------------------
  _handleBlur() {
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
      if (props.number || props.price || props.pricePerUnit || props.integer) {
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
    let props = this.props;

    // Trim dollar signs or units as necessary, so only numerical value is left.
    if (props.price) {
      this.setState({
        editing: true,
        value: props.children.slice(1),
      });
    } else if (props.pricePerUnit) {
      this.setState({
        editing: true,
        value: props.children.slice(1, props.children.indexOf('/') - 1),
      });
    } else {
      this.setState({
        editing: true,
        value: props.children || '',
      });
    }

    setTimeout(() => {
      this.refs.inputField.select();
    }, 0);
  }
}

Cell.propTypes = {
  // Contents of the Cell.
  children: PropTypes.node,
  className: PropTypes.string,
  // List of items for input autocomplete.
  datalist: PropTypes.array,
  // True if value must be an integer.
  integer: PropTypes.bool,
  // If passed, make cell editable on click.
  // Callback invoked with new cell value.
  modifyField: PropTypes.func,
  // True if cell represents a numerical value.
  number: PropTypes.bool,
  // onClick function can only be applied to non-editable cells.
  onClick: PropTypes.func,
  // True if cell represents a price value.
  price: PropTypes.bool,
  // True if cell represents a price per unit value.
  pricePerUnit: PropTypes.bool,
};

Cell.defaultProps = {
  datalist: [],
  int: false,
  price: false,
  pricePerUnit: false,
};

export default Cell;
