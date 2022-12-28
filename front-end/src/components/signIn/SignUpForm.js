import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

export default class SignUpForm extends React.Component 
  {
      constructor(props) {
          super(props);
          this.state = {
              signUpEmail: '',
              signUpUserName: '',
              signUpFirstName: '',
              signUpLastName: '',
              signUpPassword: '',
              confirmSignUpPassword: ''            
          }
      }
      onEmailChange = (event) => {
        this.setState({signUpEmail: event.target.value})
      }
      onUserNameChange = (event) => {
        this.setState({signUpUserName: event.target.value})
      }
      onFirstNameChange = (event) => {
        this.setState({signUpFirstName: event.target.value})
      }
      onLastNameChange = (event) => {
        this.setState({signUpLastName: event.target.value})
      }
      onPasswordChange = (event) => {
        this.setState({signUpPassword: event.target.value})
      }
      onPasswordConfirmChange = (event) => {
        this.setState({confirmSignUpPassword: event.target.value})
      }
  
  onSubmitSignUp = () => {
      fetch(process.env.REACT_APP_SERVER + '/signUp', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              'signUpEmail': this.state.signUpEmail,
              'signUpUserName': this.state.signUpUserName,
              'signUpFirstName': this.state.signUpFirstName,
              'signUpLastName': this.state.signUpLastName,
              'signUpPassword': this.state.signUpPassword,
              'confirmSignUpPassword': this.state.confirmSignUpPassword   
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {            
              this.props.updateSession(data.firstName, data.lastName, data.username, data.profilePicture);
            }
          }
      ).then(this.props.onRouteChange('signin'))
  }

render() {
  const { onRouteChange } = this.props
  return (
    <div style={{width: '30%', padding: '10ch',backgroundColor: "#f5c732"}}>
        <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '30ch' } }} noValidate autoComplete="off">
            <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
              <TextField
                required
                name="email"
                id="outlined-required"
                type="email"
                label="Email Address"
                placeholder="Email Address"
                onChange={this.onEmailChange}
              />  
              <TextField
                required
                name="username"
                id="outlined-required"
                type="text"
                label="Username"
                placeholder="Username"
                onChange={this.onUserNameChange}
              />                 
              <TextField
                required
                name="firstName"
                id="outlined-required"
                type="text"
                label="First name"
                placeholder="first name"
                onChange={this.onFirstNameChange}
              />
              <TextField
                required
                name="lastName"
                id="outlined-required"
                type="text"
                label="Last name"
                placeholder="last name"
                onChange={this.onLastNameChange}
              />
              <TextField
                name="password"
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="off"
                placeholder='create password'
                onChange={this.onPasswordChange}
              />
              <TextField
              name="confirmPassword"
                id="outlined-password-input"
                label="Confirm Password"
                type="password"
                autoComplete="off"
                placeholder='repeat password'
                onChange={this.onPasswordConfirmChange}
              />
              <Button variant="contained" sx={{width: '33ch', marginTop: '20px'}}  value="Sign Up" 
                onClick={() => this.onSubmitSignUp()}
                >Sign Up
              </Button>
            </form>
            <Divider variant="middle" style={{marginTop: '20px', marginBottom: '40px'}}/>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Button variant="contained" sx={{width: '33ch'}} onClick={() => onRouteChange('signin')}>Sign In</Button>        
            </div>
        </Box>
    </div>
  );

  }


}