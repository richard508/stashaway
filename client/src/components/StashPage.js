import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import StashForm from './StashForm'
import '../css/button.css'
import '../css/form.css'


const FlexStyle = styled.div`
display: flex;
justify-content: center;
.widthStyle{
  width:80%
}
`

const StashStyles = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  background: #f1faee;
  margin: 10px 0;
  border-radius: 10px;
  textarea {
    background-color: transparent;
    border: none;
  }
  input {
    height: 30%;
    font-size: 1rem;
  }
  textarea {
    height: 70%;
  }
  .stashBox{
    padding: 10px;
  }
`

const StashsContainerStyle = styled.div`
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
    filteredStash: [],
    requestedStash: [],
    completedStash: []
  }
  async componentDidMount() {
    await this.currentNumber()
  }

  currentNumber = () => {
    const userId = this.props.match.params.userId
    axios.get(`/api/users/${userId}`).then(res => {
      const filtered = res.data.stashes.filter(stash => {
        return stash.group === false && stash.completed === false && stash.requested === false
      })
      const filteredCompletes = res.data.stashes.filter(stash => {
        return stash.completed === true && stash.requested === false
      })
      const requestedStash = res.data.stashes.filter(stash => {
        return stash.requested === true
      })
      this.setState({
        user: res.data,
        stashes: res.data.stashes,
        filteredStash: filtered,
        completedStash: filteredCompletes,
        requestedStash: requestedStash
      })
    })
    this.state.showGrouped === true ? this.notGrouped() : this.grouped()
  }

  checkComplete = (userId, stashId) => {
    // Find the individual updated stash from this.state.stashes
    const stashToUpdate = this.state.stashes.find(stash => {
      return stash._id === stashId
    })
    stashToUpdate.savedStash >= stashToUpdate.total ? 
    stashToUpdate.completed = true 
      : stashToUpdate.completed = false
    
      axios.patch(`/api/users/${userId}/stashes/${stashId}`, stashToUpdate).then((res) => {
      console.log("Updated stash")
    })
  }

  addToStash = (newStash) => {
    const userId = this.props.match.params.userId
    axios.post(`/api/users/${userId}/stashes`, newStash).then(res => {
      const newStash = res.data
      const newStatenewStash = [...this.state.stashes, newStash]
      this.setState({ stashes: newStatenewStash })
      this.currentNumber()
    })
  }

  handleDelete = stashId => {
    const userId = this.props.match.params.userId
    axios.delete(`/api/users/${userId}/stashes/${stashId}`).then(() => {
      const newStashes = [...this.state.stashes]
      const newfilteredStash = [...this.state.filteredStash]
      const filteredStash = newfilteredStash.filter(stash => {
        return stash._id !== stashId
      })
      const filtered = newStashes.filter(stash => {
        return stash._id !== stashId
      })
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
  // KNOWNBUGS: Page refreshes when updating
  updateSavedStash = (stashId, event) => {
    event.preventDefault()
    const userId = this.props.match.params.userId
    // Find the individual updated stash from this.state.stashes
    const stashToUpdate = this.state.stashes.find(stash => {
      return stash._id === stashId
    })
    stashToUpdate.savedStash += parseInt(stashToUpdate.amountIn)
    // axios post the endpoint with updated data
    axios.patch(`/api/users/${userId}/stashes/${stashId}`, stashToUpdate).then(() => {
      console.log("Updated stash")
      this.checkComplete(userId, stashId)
      this.currentNumber()
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
      return stash.group === true && stash.completed === false && stash.requested === false
    })
    this.setState({
      filteredStash: filtered
    })
  }
  notGrouped = () => {
    const filtered = this.state.stashes.filter( stash => {
      return stash.group === false && stash.completed === false && stash.requested === false
    })
    this.setState({
      filteredStash: filtered
    })
  }

  handleRequest = (stashId) => {
    const userId = this.props.match.params.userId
    const stashToUpdate = this.state.stashes.find(stash => {
      return stash._id === stashId
    })
    stashToUpdate.requested = true
    axios.patch(`/api/users/${userId}/stashes/${stashId}`, stashToUpdate).then((res) => {
      const removeStash = [...this.state.stashes]
      const removeFilteredStash = [...this.state.filteredStash]
      const newRquestedStash = [...this.state.requestedStash, res.data]
      const filteredStash = removeFilteredStash.filter(stash => {
        return stash._id !== stashId
      })
      const filtered = removeStash.filter(stash => {
        return stash._id !== stashId
      })
      this.setState({
        stashes: filtered, 
        filteredStash: filteredStash, 
        requestedStash: newRquestedStash
      })
      this.currentNumber()
    })
  }
  render() {
    return (
      <FlexStyle>
      <div className="widthStyle">
        <StashForm user={this.state.user} addToStash={this.addToStash}/>
        <button className="btn topMargin" onClick={this.toggleGroup}>{this.state.showGrouped === false ?
        <span>My Personal stash</span> : <span>My Group stash</span>}</button>
        <StashsContainerStyle>
          {this.state.completedStash.map(stash => {
              const requestStash = () => {
                return this.handleRequest(stash._id)
              }

              return (
                <StashStyles key={stash._id} className="stashBox">
                <div style={{backgroundColor: '#4aee64'}} className="stashBox">
                  <span><strong>{stash.title}:</strong></span> Funded: {stash.savedStash}/{stash.total} 
                  <button className="btn success" style={{float: 'right'}} onClick={requestStash}>Request Funds</button>
                </div>
                </StashStyles>
              )
            })}
          {this.state.filteredStash.map(stash => {
            const requestStash = () => {
              return this.handleRequest(stash._id)
            }

            return (
              <StashStyles key={stash._id} className="stashBox">
              <div className="stashBox">
                <input 
                  onBlur={() => this.handleUpdate(stash._id)}
                  onChange={(event) => this.handleChange(event, stash._id)} 
                  type="text" name="title" 
                  value={stash.title} 
                />
                <p>{stash.savedStash}/{stash.total}</p>
                <p>Monthly recurring amount</p>
                <input className="formControl bottomMargin"
                  onBlur={() => this.handleUpdate(stash._id)}
                  onChange={(event) => this.handleChange(event, stash._id)} 
                  type="number" name="amountIn" 
                  value={stash.amountIn} 
                /> 
                  <button className="btn success" onClick={(event) => this.updateSavedStash(stash._id, event)}>Add Funds Now!</button>
                <div>
                  <button className="btn warning" onClick={requestStash}>Request Funds</button>
                </div>
                </div>
              </StashStyles>
            )
          })}
          {this.state.requestedStash.map(stash => {
            return (
              <StashStyles key={stash._id} className="stashBox">
              <div style={stash.completed ? {backgroundColor: '#166d8a'} : {backgroundColor: '#620e05', color: '#FFAEAE'}} className="stashBox">
                <span><strong>{stash.title}:</strong></span> Funded: {stash.savedStash}/{stash.total} 
                <button className="btn default disabled" style={{float: 'right'}} disabled>Funds Requested</button>
              </div>
              </StashStyles>
            )
          })}
        </StashsContainerStyle>
      </div>
      </FlexStyle>
    );
  }
}

export default StashPage