import React from 'react';

class Cell extends React.Component {
  render() {
    return (
      <td>
        {this.props.children}
      </td>
    );
  }
}

export default Cell;
