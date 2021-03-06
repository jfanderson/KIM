import React, { PropTypes } from 'react';

class Table extends React.Component {
  render() {
    let headers = React.Children.map(this.props.children, column => {
      if (column) {
        return <th className={column.props.classes} key={column.props.header}>{column.props.header}</th>;
      }
    });

    let rows = this.props.data.map(item => {
      let cells = React.Children.map(this.props.children, column => {
        if (column) {
          return column.props.cell(item);
        }
      });

      return <tr className="table-row" key={item[this.props.uniqueId]}>{cells}</tr>;
    });

    return (
      <table className={this.props.classes}>
        <tbody>
          <tr key="headers">{headers}</tr>
          {rows}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.string,
  data: PropTypes.array.isRequired,
  uniqueId: PropTypes.string.isRequired
};

export default Table;
