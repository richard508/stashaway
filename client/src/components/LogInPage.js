import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import axios from 'axios'
import config from '../config.json'
import styled from 'styled-components'

const HeaderStyle = styled.div`
   display: flex;
   justify-content: center;
`
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
      console.log(res)
      this.setState({isAuthenticated: true, user: res})
      this.props.history.push(`/users/${res.data._id}`)
    })
  }
  render() {
    const responseGoogle = (response) => {
      console.log(response)
      this.signup(response)
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
                    clientId={config.GOOGLE_CLIENT_ID}
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