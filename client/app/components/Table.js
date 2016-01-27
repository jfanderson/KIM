import React, {PropTypes} from 'react';

class Table extends React.Component {
  render() {
    let headers = React.Children.map(this.props.children, column => {
      return <th key="column.props.header">{column.props.header}</th>;
    });

    let rows = this.props.data.map(item => {
      let cells = React.Children.map(this.props.children, column => {
        return column.props.cell(item);
      });

      return <tr key={item[this.props.uniqueId]}>{cells}</tr>;
    });

    return (
      <table>
        <tbody>
          <tr>{headers}</tr>
          {rows}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  uniqueId: PropTypes.string.isRequired
};

export default Table;