import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import _ from 'underscore';

import j from '../services/jewelryService.js';
import sign from '../services/sign.js';
import h from '../helpers.js';

import Table from './Table.js';
import Column from './Column.js';
import Cell from './Cell.js';
import AddPieceForm from './Form.AddPiece.js';

class JewelryProducts extends React.Component {
  constructor() {
    super();

    this.state = {
      filteredPieces: [],
      isFormOpen: false,
      pieces: [],
      removeMode: false, // If true, display removal column in table
      types: []
    };
  }

  //-----------------------------------
  // LIFECYCLE METHODS
  //-----------------------------------
  componentDidMount() {
    this._getPieces().then(pieces => {
      this.setState({
        pieces,
        filteredPieces: pieces
      });
    });

    j.getTypes()
      .then(types => {
        this.setState({ types });
      }).catch(() => {
        sign.setError('Failed to retrieve jewelry types. Try refreshing.');
      });
  }

  //-----------------------------------
  // RENDERING
  //-----------------------------------
  render() {
    let state = this.state;
    let types = state.types;

    let removeClasses = {
      'remove-button': true,
      active: state.removeMode
    };

    return (
      <div>
        <div className="filters-container">
          <div className="filters">
            <span onClick={this._clearFilter.bind(this)}>All</span>
            {state.types.map(type => {
              if (type.name === 'none') {
                return null;
              }

              return <span key={type.id} onClick={this._filterByType.bind(this, type.id)}>{type.name}</span>;
            })}
            <span onClick={this._filterByLowStock.bind(this)}>Low Stock</span>
            <span onClick={this._filterByOutOfStock.bind(this)}>Out of Stock</span>

            <button className="add-button" onClick={this._handleAddClick.bind(this)}>+</button>
            <button className={classnames(removeClasses)} onClick={this._handleRemoveClick.bind(this)}>--</button>
          </div>
        </div>

        <div className="content">
          <Table classes="row-select" data={state.filteredPieces} uniqueId="item">
            <Column header="Item #" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{piece.item}</Link></Cell>
              )}
            />
            <Column classes="extra-wide" header="Description" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{piece.description}</Link></Cell>
              )}
            />
            <Column header="Type" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{h.findTypeName(types, piece.typeId)}</Link></Cell>
              )}
            />
            <Column header="Cost" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{h.displayPrice(piece.totalCost)}</Link></Cell>
              )}
            />
            <Column header="Wholesale" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{h.displayPrice(piece.wholesalePrice)}</Link></Cell>
              )}
            />
            <Column header="MSRP" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{h.displayPrice(piece.msrp)}</Link></Cell>
              )}
            />
            <Column header="Qty on Order" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{piece.qtyOnOrder}</Link></Cell>
              )}
            />
            <Column header="Qty in Stock" cell={piece => (
                <Cell><Link to={`/jewelry/${piece.id}`}>{piece.qtyInStock}</Link></Cell>
              )}
            />
            {this._renderRemoveColumn()}
          </Table>
        </div>

        {this._renderForm()}
      </div>
    );
  }

  _renderForm() {
    if (this.state.isFormOpen) {
      return (
        <AddPieceForm
          cancel={this._handleAddClick.bind(this)}
          submit={this._handleFormSubmit.bind(this)}
        />
      );
    }
  }

  _renderRemoveColumn() {
    if (this.state.removeMode) {
      return (
        <Column header="Remove" cell={piece => (
            <Cell><div onClick={this._removePiece.bind(this, piece)}>X</div></Cell>
          )}
        />
      );
    }
  }

  //-----------------------------------
  // PRIVATE METHODS
  //-----------------------------------
  _clearFilter() {
    this.setState({ filteredPieces: this.state.pieces });
  }

  _filterByLowStock() {
    let filteredPieces = this.state.pieces.filter(piece => {
      let type = _.findWhere(this.state.types, { id: piece.typeId });

      return piece.qtyInStock <= type.lowStock;
    });

    this.setState({ filteredPieces });
  }

  _filterByOutOfStock() {
    let filteredPieces = this.state.pieces.filter(piece => piece.qtyInStock <= 0);

    this.setState({ filteredPieces });
  }

  _filterByType(typeId) {
    let filteredPieces = this.state.pieces.filter(piece => piece.typeId === typeId);

    this.setState({ filteredPieces });
  }

  _handleAddClick(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ isFormOpen: !this.state.isFormOpen });
  }

  _handleFormSubmit(item, description) {
    j.addPiece({
      item,
      description
    }).then(() => {
      this._getPieces().then(pieces => {
        // Revert to "All" filter when new piece is added.
        this.setState({
          pieces,
          filteredPieces: pieces
        });

        sign.setMessage('Showing all jewelry products');
      });
    }).catch(() => {
      sign.setError('Failed to add jewelry piece. Try refreshing.');
    });

    // TODO: link to piece page
  }

  _handleRemoveClick() {
    this.setState({ removeMode: !this.state.removeMode });
  }

  _removePiece(piece) {
    let confirmed = confirm(`Are you sure you want to remove ${piece.description}?`);

    if (confirmed) {
      j.removePiece(piece.id).then(() => {
        this._getPieces().then(pieces => {
          // Remove piece from filtered set.
          let filteredPieces = this.state.filteredPieces.slice(0);

          for (let i = 0; i < filteredPieces.length; i++) {
            if (filteredPieces[i].id === piece.id) {
              filteredPieces.splice(i, 1);
              break;
            }
          }

          this.setState({
            pieces,
            filteredPieces
          });
        });
      }).catch(() => {
        sign.setError('Failed to remove piece.');
      });
    }
  }

  _getPieces() {
    return j.getAllPieces().catch(() => {
      sign.setError('Failed to retrieve jewelry pieces. Try refreshing.');
      this.setState({ pieces: [] });
    });
  }
}

export default JewelryProducts;
