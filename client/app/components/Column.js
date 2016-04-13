import React, { PropTypes } from 'react';

class Column extends React.Component {
  render() {
    return null;
  }
}

Column.propTypes = {
  cell: PropTypes.func.isRequired,
  classes: PropTypes.string,
  header: PropTypes.string.isRequired
};

export default Column;
