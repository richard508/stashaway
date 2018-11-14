import React, { Component } from 'react'
import axios from 'axios'

class StashForm extends Component {
  state={
    newStash:{
      title: '',
      total: 0,
      group: false,
      amountIn: 0
    }
  }
  handleNewChange = (event) => {
    const updatedNewStash = {...this.state.newStash}

    event.target.name == "group" ? 
      updatedNewStash[event.target.name] = event.target.checked 
    : updatedNewStash[event.target.name] = event.target.value
    this.setState({newStash: updatedNewStash})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      title: this.state.newStash.title,
      total: this.state.newStash.total,
      group: this.state.newStash.group,
      amountIn: 0
    }

    this.props.addToStash(payload)
  }
  render() {
    return (
      <div>
        <h1>{this.props.user.name}'s Stash Page</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="title">Title: </label>
            <input onChange={this.handleNewChange} value={this.state.newStash.title} type="text" name="title"/>
          </div>
          <div>
            <label htmlFor="total">Total: </label>
            <input onChange={this.handleNewChange} value={this.state.newStash.total} type="number" name="total"/>
          </div>
          <div>
            <input onChange={this.handleNewChange} type="checkbox" name="group" />
            <label htmlFor="group">Group Stash</label>
          </div>
          <button type="submit">Create Stash</button>
        </form>
      </div>
    );
  }
}

export default StashForm;