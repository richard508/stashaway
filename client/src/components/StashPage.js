import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const IdeaStyles = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 200px;
  height: 200px;
  background: #f1faee;
  margin: 10px 0;
  button {
    position: absolute;
    top: 5px;
    right: 10px;
  }

  input,
  textarea {
    background-color: transparent;
    border: none;
  }

  input {
    height: 30%;
    font-size: 1.3rem;
  }
  textarea {
    height: 70%;
  }
`

const IdeasContainerStyle = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-content: flex-start;
`

class StashPage extends Component {
  state = {
    user: {},
    stashes: [],
    newStash:{
      title: '',
      total: 0,
      group: false,
      amountIn: 0
    }
  }
  componentDidMount() {
    // make an api call to get one single user
    const userId = this.props.match.params.userId
    axios.get(`/api/users/${userId}`).then(res => {
      this.setState({
        user: res.data,
        stashes: res.data.stashes
      })
    })
  }

  handleNewChange = (event) => {
    const updatedNewStash = {...this.state.newStash}

    // Event Target Name will be either 'Stash'

    event.target.name == "group" ? 
      updatedNewStash[event.target.name] = event.target.checked 
    : updatedNewStash[event.target.name] = event.target.value
    console.log(updatedNewStash)
    this.setState({newStash: updatedNewStash})
  }

  handleSubmit = (event) => {
    const userId = this.props.match.params.userId
    event.preventDefault()
    const payload = {
      title: this.state.newStash.title,
      total: this.state.newStash.total,
      group: this.state.newStash.group,
      amountIn: 0
    }
    axios.post(`/api/users/${userId}/stashes`, payload).then(res => {
      const newStash = res.data
      const newStatenewStash = [...this.state.stashes, newStash]
      this.setState({ stashes: newStatenewStash })
    })
    
  }
  handleDelete = stashId => {
    const userId = this.props.match.params.userId
    // some unique value
    axios.delete(`/api/users/${userId}/stashes/${stashId}`).then(() => {
      //Remove the stash with stashId from this.state.stashes
      const newStashes = [...this.state.stashes]
      // Return only stashes that are NOT the id provided
      const filtered = newStashes.filter(stash => {
        return stash._id !== stashId // ! = =
      })
      // Take filtered data and set it to stashes
      this.setState({stashes: filtered})
    })
  }
  handleChange = (event, stashId) => {
    const { value, name } = event.target
    const newStashes = [...this.state.stashes]
    const updatedVals = newStashes.map(stash => {
      if (stash._id === stashId){
        stash[name] = value
      }
      return stash
    }) 

    this.setState({stashes: updatedVals})
  }

  handleUpdate = (stashId) => {
    const userId = this.props.match.params.userId
    // Find the individual updated stash from this.state.stashes
    const stashToUpdate = this.state.stashes.find(stash => {
      return stash._id === stashId
    })
    // axios post the endpoint with updated data
    axios.patch(`/api/users/${userId}/stashes/${stashId}`, stashToUpdate).then(() => {
      console.log("Updated stash")  
    })
  }
  render() {
    return (
      <div>
        <h1>{this.state.user.name}'s Stash Page</h1>
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
        <IdeasContainerStyle>
          {this.state.stashes.map(stash => {
            const deleteStash = () => {
              return this.handleDelete(stash._id)
            }

            return (
              <IdeaStyles>
                <input 
                  onBlur={() => this.handleUpdate(stash._id)}
                  onChange={(event) => this.handleChange(event, stash._id)} 
                  type="text" name="title" 
                  value={stash.title} 
                />
                <p>{stash.total}</p>
                <input 
                  onBlur={() => this.handleUpdate(stash._id)}
                  onChange={(event) => this.handleChange(event, stash._id)} 
                  type="number" name="amountIn" 
                  value={stash.amountIn} 
                />
                <button onClick={deleteStash}>X</button>
              </IdeaStyles>
            )
          })}
        </IdeasContainerStyle>
      </div>
    );
  }
}

export default StashPage