import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Link } from "react-router-dom";

export default class LeftBar extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      circles: []
    }

  } 

  componentDidMount = () => {
    this.setState({ dataIsLoaded: false })
    fetch(process.env.REACT_APP_SERVER + '/getUsersCircles', {
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
      this.setState({circles: data, dataIsLoaded: true})
    })
  }
  render () {
    const { changeCircle, userProfilePicture } = this.props;
    const { dataIsLoaded } = this.state;

    if (!dataIsLoaded) {
      return (
        <div>
          <React.Fragment>
          <CssBaseline />
          <Container position="fixed" maxWidth="sm" sx={{ position: 'fixed', bgcolor: '#343434', border: '', height: '80vh', width: 300, ml: 2, mr:2,  mt: 16, justifyContent: 'flex-start', alignItems: 'center'}} >
            <Box sx={{ padding: 2, bgcolor: 'none'}}>
            <Link to="/myProfile">
                <img alt=""
                src={process.env.REACT_APP_SERVER + '/public/' + userProfilePicture} width="200px" height="150px" sx={{ ":hover": { cursor: 'pointer' }}} style={{ boxShadow: "1px 3px 5px 0px black", mb: 3, "hover": { cursor: 'pointer' } }}  
                            /></Link>
                <Stack spacing={2} sx={{  width: 200, margin: '50px auto 0' }}>              
                    <Button variant="contained" onClick={()=>changeCircle('general')} sx={{width: 200, margin: '0 auto'}} >GENERAL</Button>
                </Stack>
              </Box>
            </Container>
          </React.Fragment>
        </div>
      );
    } else {
        return (
          <div>
            <React.Fragment>
            <CssBaseline />
            <Container position="fixed" maxWidth="sm" sx={{ position: 'fixed', bgcolor: '#343434', border: '', height: '80vh', width: 300, ml: 2, mr:2,  mt: 16, justifyContent: 'flex-start', alignItems: 'center'}} >
              <Box sx={{ padding: 2, bgcolor: 'none'}}>
              <Link to="/myProfile">
                  <img alt=""
                  src={process.env.REACT_APP_SERVER + '/public/' + userProfilePicture} width="200px" height="150px" sx={{ ":hover": { cursor: 'pointer' }}} style={{ boxShadow: "1px 3px 5px 0px black", mb: 3, "hover": { cursor: 'pointer' } }}  
                  /></Link>
                  <Stack spacing={2} sx={{  width: 240, margin: '50px auto 0', height: '500px', overflowY: 'auto'}}>              
                      <Button variant="contained" onClick={()=>changeCircle('general')} style={{width: '200px', margin: '5px auto'}} >GENERAL</Button>
                      {this.state.circles.map(circle => (
                        circle.length > 2 ?
                          <Button key={circle} variant="contained" onClick={()=>changeCircle(`${circle}`)} style={{width: '200px', margin: '5px auto'}} >{circle}</Button>
                        : ''
                      ))}
                  </Stack>
                </Box>
              </Container>
            </React.Fragment>
          </div>
        );

    }


  }
}