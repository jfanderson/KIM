import React, {PropTypes} from 'react';

class Column extends React.Component {
  render() {}
}

Column.propTypes = {
  header: PropTypes.string.isRequired,
  cell: PropTypes.func.isRequired
};

export default Column;
