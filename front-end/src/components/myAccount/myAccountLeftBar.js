import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Link } from "react-router-dom";

export default class MyAccountLeftBar extends React.Component  {
  
  render () {   
    const { userFirstName, changeSettings, userProfilePicture } = this.props
    return (
      <div>
        <React.Fragment>
          <CssBaseline />
          <Container position="fixed" maxWidth="sm" sx={{ position: 'fixed', bgcolor: '#343434', border: '', height: '80vh', width: 300, ml: 2, mr:2,  mt: 16, justifyContent: 'flex-start', alignItems: 'center'}} >
            <Box sx={{ padding: 2, bgcolor: 'none'}}>
              <Link to="/myProfile">
                <img alt="" src={process.env.REACT_APP_SERVER + '/public/' + userProfilePicture} width="200px" height="150px" style={{ boxShadow: "1px 3px 5px 0px black", mb: 3 }} />
              </Link>              
                <Typography variant="h5" component="div" color="white" sx={{textAlign: 'center', mt: 2}}>{userFirstName}'s settings</Typography>
                <Stack spacing={2} sx={{  width: 200, margin: '50px auto 0' }}>
                  <Button variant="contained" sx={{textTransform: 'none'}} onClick={()=>changeSettings('My information')}>General</Button>
                  <Button variant="contained" sx={{textTransform: 'none'}} onClick={()=>changeSettings('My Circles')}>My Circles</Button>
                  <Button variant="contained" sx={{textTransform: 'none'}} onClick={()=>changeSettings('My friends')}>My friends</Button>
                  <Button variant="contained" sx={{textTransform: 'none'}} onClick={()=>changeSettings('My login info')}>My login info</Button>
                </Stack>
            </Box>
            {/* <Typography variant="h6" component="div" color="white" sx={{textAlign: 'center', mt: 2}}>Users info</Typography> */}
          </Container>
        </React.Fragment>
      </div>
    );
  }
}