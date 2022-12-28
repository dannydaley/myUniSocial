import React from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ShieldIcon from '@mui/icons-material/Shield';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

export default class MyLoginInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            email: '',
            password: '',
            changeEmail: '',
            changePassword: '',
            changePasswordConfirm: '' ,
            okPassword: 'hidden',
            passwordMatch: 'hidden'    
        }
      }

      updateUserLoginInfo = () => {
        const { email, password, changeEmail, changePassword, changePasswordConfirm } = this.state
        fetch(process.env.REACT_APP_SERVER + '/updateUserLoginInfo', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            username: this.props.loggedInUsername,
            email: email,
            password: password,
            changeEmail: changeEmail,
            changePassword: changePassword,
            changePasswordConfirm:  changePasswordConfirm
            })    
        })
        //TURN THE RESPONSE INTO A JSON OBJECT
        .then(response => response.json())        
        // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
        .then(data => { 
            this.props.mountComponent()
        })
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    onPasswordChange = (event) => {
    this.setState({password: event.target.value})
    }

    onChangeEmailChange = (event) => {
        this.setState({changeEmail: event.target.value})
    }

    field1 = '';
    field2 = '';

    onChangePasswordChange = (event) => {
        this.field1 = event.target.value
        if ((this.field1 === this.field2) && (this.field1.length > 5)) {            
            this.setState({changePassword: event.target.value, passwordMatch: 'visible'})
        } else {
            this.setState({changePassword: event.target.value, passwordMatch: 'hidden'})
        }
    }

    onPasswordChangeConfirm = (event) => {
        this.field2 = event.target.value
        if ((this.field1 === this.field2) && (this.field1.length > 5)) {            
            this.setState({changePasswordConfirm: event.target.value, passwordMatch: 'visible'})
        } else {
            this.setState({changePasswordConfirm: event.target.value, passwordMatch: 'hidden'})
        }
    }   

    render() {        
        const { settings } = this.props; 
        const { passwordMatch } = this.state        
        return(
            <form
            style={{        
                height: '100%'
                }}>
                <Typography variant="h3" component="div" color="white" sx={{textAlign: 'center', mt: 2, paddingTop: 1, paddingBottom: 2, bgcolor: 'none' }}>{settings}</Typography>                
                <div
                    style={{marginTop: '100px'}}
                    >
                    <ContactMailIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} />                    
                    <TextField
                    sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}                   
                    label="Verify email address"
                    type="email"
                    onChange={this.onEmailChange}
                    required
                    />
                </div>
                <div style={{marginTop: '30px'}}>
                    <LockOpenIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}}/> 
                    <TextField
                        sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}                       
                        label="Verify password"
                        type="password"
                        autoComplete="no"
                        onChange={this.onPasswordChange}   
                        required                 
                    />
                </div>
                <Divider variant="middle" sx={{mt: '35px', mb: '35px'}} />
                <div>
                    <ContactMailIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} />                    
                    <TextField
                        sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}                    
                        label="New email address (Leave blank if no change)"
                        type="email"
                        onChange={this.onChangeEmailChange}
                    />
                </div>
                <div style={{marginTop: '30px'}}>
                    <LockIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} />                 
                    <TextField
                        sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}                   
                        label="New password (Leave blank if no change)"
                        type="password"
                        onChange={this.onChangePasswordChange}
                    />
                    <DoneIcon sx={{color: 'lightGreen', position: 'absolute', visibility: passwordMatch}} />
                </div>
                <div id="confirm" style={{marginTop: '30px',marginBottom: '30px'}}>
                    <ShieldIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} />
                    <TextField
                        sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}                       
                        label="Confirm password (Leave blank if no change)"
                        type="password"
                        onChange={this.onPasswordChangeConfirm}
                    />  
                    <DoneAllIcon variant="success" sx={{color: 'lightGreen', position: 'absolute', visibility: passwordMatch}} />                                                                          
                </div>
                <div>
                    <Button variant="contained"
                        onClick={() => this.updateUserLoginInfo()}>Update
                    </Button>   
                </div>
            </form>
        )
    }
}