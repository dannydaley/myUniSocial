import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

class SignInForm extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''            
        }
    }
    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }
    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

applySession = (firstName, lastName, username, profilePicture) => {
                this.props.updateSession(firstName, lastName, username, profilePicture)
                this.props.onRouteChange('home')  
}

    componentDidMount() {     
        fetch(process.env.REACT_APP_SERVER + '/refreshSessionStatus', {
          status: 'session-exists'
        }).then(response => response.json())
          .then(data => data.status === "session-exists" ? this.applySession(data.firstName, data.lastName, data.username, data.profilePicture) :''
          )
          }

onSubmitSignIn = () => {
    fetch(process.env.REACT_APP_SERVER + '/signin', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'email': this.state.signInEmail,
            'password': this.state.signInPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {            
            this.props.updateSession(data.firstName, data.lastName, data.username, data.profilePicture, data.coverPicture);
            this.props.onRouteChange('home')}
        }
    )
}

    render () { 
        const { onRouteChange } = this.props;
        return (
                        <div
            style={{
                width: "30%",
                padding: "10ch",
                backgroundColor: "#f5c732",
            }}
        >
                    <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '30ch' } }} noValidate autoComplete="off">
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} onSubmit={()=> this.onSubmitSignIn()}>
                            <TextField
                            required
                            id="outlined-required"
                            type="email"
                            label="Email Address"
                            placeholder="Email Address"
                            onChange={this.onEmailChange}
                            />
                            <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            onChange={this.onPasswordChange}
                            />
                            <Button variant="contained" sx={{width: '33ch'}}        
                            onSubmit={()=> this.onSubmitSignIn()}                            
                            onClick={()=> this.onSubmitSignIn()}>
                                Sign In
                            </Button>
                            <p>Forgotten Password?</p>
                        </div>
                        <Divider variant="middle" style={{marginTop: '20px', marginBottom: '40px'}}/>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Button variant="contained" sx={{width: '33ch'}} onClick={()=>onRouteChange('signup')}>Sign Up</Button>        
                        </div>
                    </Box>
                </div>
            );
        }
}

export default SignInForm;