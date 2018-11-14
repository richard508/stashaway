import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import StashForm from './StashForm';

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
    showGrouped: false,
    filteredStash: []
  }
  componentDidMount() {
    // make an api call to get one single user
    
    const userId = this.props.match.params.userId
    axios.get(`/api/users/${userId}`).then(res => {
      const filtered = res.data.stashes.filter(stash => {
        return stash.group === false
      })
      this.setState({
        user: res.data,
        stashes: res.data.stashes,
        filteredStash: filtered
      })
    })
    this.state.showGrouped === true ? this.notGrouped() : this.grouped()
  }

  addToStash = (newStash) => {
    const userId = this.props.match.params.userId
    axios.post(`/api/users/${userId}/stashes`, newStash).then(res => {
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
      const newfilteredStash = [...this.state.filteredStash]
      // Return only stashes that are NOT the id provided
      const filteredStash = newfilteredStash.filter(stash => {
        return stash._id !== stashId // ! = =
      })
      const filtered = newStashes.filter(stash => {
        return stash._id !== stashId // ! = =
      })
      // Take filtered data and set it to stashes
      this.setState({stashes: filtered, filteredStash: filteredStash})
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
  toggleGroup = () => {
    this.setState({
      showGrouped: !this.state.showGrouped
    })
    this.state.showGrouped === true ? this.notGrouped() : this.grouped()
  }
  grouped = () => {
    const filtered = this.state.stashes.filter( stash => {
      return stash.group === true
    })
    this.setState({
      filteredStash: filtered
    })
  }
  notGrouped = () => {
    const filtered = this.state.stashes.filter( stash => {
      return stash.group === false
    })
    this.setState({
      filteredStash: filtered
    })
  }
  render() {
    return (
      <div>
        <StashForm user={this.state.user} addToStash={this.addToStash}/>
        <button onClick={this.toggleGroup}>{this.state.showGrouped == false ?
        <span>My Personal stash</span> : <span>My Group stash</span>}</button>
        <IdeasContainerStyle>
          {this.state.filteredStash.map(stash => {
            const deleteStash = () => {
              return this.handleDelete(stash._id)
            }

            return (
              <IdeaStyles key={stash._id}>
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