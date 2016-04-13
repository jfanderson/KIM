import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

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
      isFormOpen: false,
      pieces: [],
      removeMode: false, // If true, display removal column in table
      types: []
    };
  }

  componentDidMount() {
    this._updatePieces();

    j.getTypes()
      .then(types => {
        this.setState({ types });
      }).catch(() => {
        sign.setError('Failed to retrieve jewelry types. Try refreshing.');
      });
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
      this._updatePieces();
    }).catch(() => {
      sign.setError('Failed to add jewelry piece. Try refreshing.');
    });

    // TODO: link to piece page
  }

  _handleRemove() {
    this.setState({ removeMode: !this.state.removeMode });
  }

  _removePiece(piece) {
    let confirmed = confirm(`Are you sure you want to remove ${piece.description}?`);

    if (confirmed) {
      j.removePiece(piece.id).then(() => {
        this._updatePieces();
      }).catch(() => {
        sign.setError('Failed to remove piece.');
      });
    }
  }

  _updatePieces() {
    j.getAllPieces()
      .then(pieces => this.setState({ pieces }))
      .catch(() => {
        sign.setError('Failed to retrieve jewelry pieces. Try refreshing.');
        this.setState({ pieces: [] });
      });
  }

  render() {
    let types = this.state.types;

    let removeClasses = {
      'remove-button': true,
      active: this.state.removeMode
    };

    return (
      <div>
        <div className="filters-container">
          <div className="filters">
            <span>All</span>
            <span>Other</span>
            <span>Low Stock</span>
            <span>Out of Stock</span>

            <button className="add-button" onClick={this._handleAddClick.bind(this)}>+</button>
            <button className={classnames(removeClasses)} onClick={this._handleRemove.bind(this)}>--</button>
          </div>
        </div>

        <div className="content">
          <Table classes="row-select" data={this.state.pieces} uniqueId="item">
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
}

export default JewelryProducts;
