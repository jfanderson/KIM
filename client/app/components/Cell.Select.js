import React from 'react';

const PropTypes = React.PropTypes;

class SelectCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.defaultValue });
  }

  _handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.modifyField(event.target.value);
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <td>
        <select value={state.value} onChange={this._handleChange.bind(this)}>
          {props.options.map(item =>
            <option key={item} value={item}>{item}</option>
          )}
        </select>
      </td>
    );
  }
}

SelectCell.propTypes = {
  // Default value of select element
  defaultValue: PropTypes.string,
  // List of items for select element
  options: PropTypes.array,
  // If passed, make cell editable on click.
  // Callback invoked with new cell value.
  modifyField: PropTypes.func,
};

SelectCell.defaultProps = {
  options: []
};

export default SelectCell;
