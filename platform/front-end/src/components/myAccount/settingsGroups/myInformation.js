import React from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import ImageIcon from '@mui/icons-material/Image';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

export default class MyInformation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',            
            aboutMe : '',
            location : "",
            education : '',
            work: '',
            profilePicture : '',
            coverPicture : '',
            dataIsLoaded: false
        }
    }

    onFirstNameChange = (event) => {
        this.setState({firstName: event.target.value})
    }
    onLastNameChange = (event) => {
        this.setState({lastName: event.target.value})
    }
    onAboutMeChange = (event) => {
        this.setState({aboutMe: event.target.value})
    }
    onLocationChange = (event) => {
        this.setState({location: event.target.value})
    }
    onEducationChange = (event) => {
        this.setState({education: event.target.value})
    }
    onWorkChange = (event) => {
        this.setState({work: event.target.value})
    }
    onProfilePictureChange = (event) => {    
        this.updateProfilePicture(event.target.files[0])
    }
    onCoverPictureChange = (event) => {    
        this.updateCoverPicture(event.target.files[0])
    }

    delay = ms => new Promise(res => setTimeout(res, ms));

    delayFunction = async () => {
      await this.delay(10000);
    };

    updateProfilePicture = async (image) => {        
        let formData = new FormData()       
        formData.append('image', image)   
        formData.append('username', this.props.loggedInUsername)    
        await axios.post(process.env.REACT_APP_SERVER + '/changeProfilePicture', formData, {        
            headers: { "Content-Type": "multipart/form-data" } ,
            body: JSON.stringify({
                "username": this.props.loggedInUsername
            })
        })    
        .then(res => {        
            this.setState({profilePicture: res.profilePicture})
            this.props.remountParent() 
            this.props.refreshData()
            }
        )
    }

    updateCoverPicture = async (image) => {
        let formData = new FormData()       
        formData.append('image', image)   
        formData.append('username', this.props.loggedInUsername)    
        await axios.post(process.env.REACT_APP_SERVER + '/changeCoverPicture', formData, {        
            headers: { "Content-Type": "multipart/form-data" } ,
            body: JSON.stringify({
                "username": this.props.loggedInUsername
            })
        })    
        .then(res => {        
            this.setState({coverPicture: res.coverPicture})
            this.props.remountParent() 
            this.props.refreshData()
            }
        )
    }

    updateUserGeneralInfo = () => {
        const { firstName, lastName, aboutMe, location, education, work } = this.state
        fetch(process.env.REACT_APP_SERVER + '/updateUserGeneralInfo', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            username: this.props.loggedInUsername,
            firstName: firstName,
            lastName: lastName,            
            aboutMe : aboutMe,
            location : location,
            education : education,
            work: work
            })    
        })
        //TURN THE RESPONSE INTO A JSON OBJECT
        .then(response => response.json())        
        // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
        .then(data => { 
            this.props.remountParent() 
            this.props.refreshData()
        })
    }

    componentDidMount = async (newCircle) => {
        if (!newCircle) {
          newCircle = 'general'
        }  
        this.setState({ dataIsLoaded: false })     
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + '/getUserGeneralInfo', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          user: this.props.loggedInUsername
          })    
        })
        //TURN THE RESPONSE INTO A JSON OBJECT
        .then(response => response.json())        
        // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
        .then(data => {    
          this.setState({ 
            firstName: data.firstName,
            lastName: data.lastName,
            aboutMe : data.aboutMe,
            location : data.location,
            education : data.education,
            coverPicture : data.coverPicture,
            work: data.work,
            profilePicture: data.profilePicture,
            dataIsLoaded: true
          });
        })
    }

    render() {
        const { settings } = this.props; 
        const { firstName,lastName, aboutMe,location,education, work, profilePicture, coverPicture, dataIsLoaded } = this.state
        if (!dataIsLoaded) {
            return(
                <Box sx={{ padding: 2, bgcolor: 'none', display: 'flex', justifyContent: 'center', mt: 2}}>
                    <CircularProgress />                    
                </Box>
            )
        } else {
            return (            
                <div style={{height: '100%'}}>
                    <Typography variant="h3" component="div" color="white" sx={{textAlign: 'center', mt: 2, paddingTop: 1, paddingBottom: 2, bgcolor: 'none' }}>{settings}</Typography>                    
                    <div style={{marginTop: '30px', display: 'block'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '70%', margin: '0 auto'}}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <img alt=""
                                    src={
                                        process.env.REACT_APP_SERVER + '/public/' + profilePicture
                                        // process.env.REACT_APP_SERVER + process.env.REACT_APP_SERVERPUBLICDIRECTORY + props.profilePicture 
                                        } width="200px" height="150px" style={{ boxShadow: "1px 3px 5px 0px black", mb: 3 }}
                                        // onClick={()=>this.props.onRouteChange('profile')}
                                        />            
                                <label htmlFor="file-input">
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <ImageIcon fontSize="large" sx={{ mt: 3, fontSize: 70,  color: 'white', mr: 1, ":hover": { cursor: 'pointer' } }} />
                                        <Typography variant="h6" component="div" sx={{textAlign: 'center', mt: 2, paddingTop: 1, paddingBottom: 3, bgcolor: 'none', color:'white',":hover": { cursor: 'pointer' } }}>Change profile picture</Typography>
                                    </div>
                                </label>
                                <input id="file-input" type="file" name="file" onChange={this.onProfilePictureChange.bind(this)} hidden/>  
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <img alt=""
                                    src={
                                        process.env.REACT_APP_SERVER + '/public/' + coverPicture
                                        // process.env.REACT_APP_SERVER + process.env.REACT_APP_SERVERPUBLICDIRECTORY + props.profilePicture 
                                        } width="200px" height="150px" style={{ boxShadow: "1px 3px 5px 0px black", mb: 3 }}
                                        // onClick={()=>this.props.onRouteChange('profile')}
                                        />            
                                <label htmlFor="cover-file-input">
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <ImageIcon fontSize="large" sx={{ mt: 3, fontSize: 70,  color: 'white', mr: 1, ":hover": { cursor: 'pointer' } }} />
                                        <Typography variant="h6" component="div" sx={{textAlign: 'center', mt: 2, paddingTop: 1, paddingBottom: 3, bgcolor: 'none', color:'white',":hover": { cursor: 'pointer' } }}>Change cover picture</Typography>
                                    </div>
                                </label>
                                <input id="cover-file-input" type="file" name="coverfile" onChange={this.onCoverPictureChange.bind(this)} hidden/>  
                            </div>                
                        </div>    
                        <PersonIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} /> 
                        <TextField
                            sx={{mr: '5%' ,maxWidth: '30%', width: '25%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white' }}
                            id="outlined-textarea"
                            label="First name"
                            placeholder="Your first name"                     
                            multiline                    
                            defaultValue={firstName}
                            onChange={this.onFirstNameChange}
                        />                    
                        <TextField
                            sx={{maxWidth: '30%', width: '30%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}
                            id="outlined-textarea"
                            label="Last name"
                            placeholder="Your last name"                     
                            multiline                    
                            defaultValue={lastName}
                            onChange={this.onLastNameChange}
                        />
                    </div>
                    <div  style={{marginTop: '30px'}}>
                        <InfoIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} /> 
                        <TextField
                            sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}
                            id="outlined-textarea"
                            label="About me"
                            placeholder="Tell them who you are!"    
                            multiline
                            minRows={4}
                            defaultValue={aboutMe}
                            onChange={this.onAboutMeChange}
                            />
                    </div>
                    <div style={{marginTop: '30px'}}>
                        <LocationCityIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} /> 
                        <TextField
                            sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}
                            id="outlined-textarea"
                            label="Location"
                            placeholder="Tell them where you are!"                     
                            multiline 
                            defaultValue={location}
                            onChange={this.onLocationChange}
                            />
                    </div>
                    <div style={{marginTop: '30px'}}>
                        <SchoolIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}}/> 
                        <TextField
                            sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}
                            id="outlined-textarea"
                            label="School/University"
                            placeholder="Tell them where you went to school!"                     
                            multiline 
                            defaultValue={education}
                            onChange={this.onEducationChange}                         
                            />
                    </div>
                    <div style={{marginTop: '30px', marginBottom: '30px'}}>
                        <WorkIcon sx={{mr: 2, color: 'rgba(255, 255, 255, 0.7)'}} /> 
                        <TextField
                            sx={{maxWidth: '60%', width: '60%', border: '6px solid white', borderRadius: '4px',backgroundColor: 'white'}}
                            id="outlined-textarea"
                            label="Work"
                            placeholder="Tell them where you work!"                     
                            multiline                    
                            defaultValue={work}
                            onChange={this.onWorkChange}
                            />
                    </div>
                    <div>
                        <Button variant="contained"
                        onClick={()=>this.updateUserGeneralInfo()}>Update</Button>   
                    </div>                    
                </div>
            )
        }
    }
}