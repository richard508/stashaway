import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import axios from 'axios'
import styled from 'styled-components'

const LoginStyle = styled.div`
   display: flex;
   justify-content: center;
`
const H3Style = styled.h3`
   display: flex;
   justify-content: center;
`
class LogInPage extends Component {
  state = { 
    isAuthenticated: false,
    user: null,
    token: ''
  }

  logout = () => {
    this.setState({
      isAuthenticated: false, 
      user: null,
      token: ''
    })
  }
  signup(response){ 
    axios.post('/api/users/',response.profileObj).then(res => {
      this.setState({isAuthenticated: true, user: res})
      this.props.history.push(`/users/${res.data._id}`)
    })
  }

  doesUserExist = (response) => {
    axios.get('/api/users/').then(res => {
      const requestedUser = res.data.find(user => {
        return user.googleId === response.profileObj.googleId
      })
      if(requestedUser !== undefined){ 
        this.setState({isAuthenticated: true, user: res})
        this.props.history.push(`/users/${requestedUser._id}`)
      } else {
        this.signup(response)
      }
    })
  }
  render() {
    const responseGoogle = (response) => {
      this.doesUserExist(response)
    }

    let content = !!this.state.isAuthenticated ?
      (
        <div>
          <p>Login</p>
          <div>
            {this.state.user.email}
          </div>
          <div>
            <button onClick={this.logout} className="button">Log out</button>
          </div>
        </div>
      ) 
      : (
          <div>
            <div>
              <H3Style>Login with Google: </H3Style>
              <LoginStyle>
                <GoogleLogin
                    clientId="690444099886-97p0viqlgr4b2b7p55ri50o520pg0aea.apps.googleusercontent.com"
                    buttonText="Google+"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                  />
              </LoginStyle>
            </div>
          </div>
        )
    return (
      <div>
        {content}
      </div>
    );
  }
}

export default LogInPage;