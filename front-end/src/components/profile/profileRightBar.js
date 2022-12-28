import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import RightBarImages from './rightBarImages';

export default class ProfileRightBar extends React.Component { 

  render () {
  const { userFirstName, loggedInUsername, userProfileToGet } = this.props
    return (
      <div style={{position: 'fixed', width: '100vw'}}>
        <React.Fragment >
          <CssBaseline />      
          <Container  maxWidth="sm" sx={{float: 'right',  bgcolor: '#343434', height: '80vh', width: 300, mr: 4 ,mt: 16, display: 'flex', flexDirection: 'column',  justifyContent: 'flex-start', alignItems: 'center'}} >
            <Typography variant="h6" component="div" color="white" sx={{textAlign: 'center', mt: 2, paddingTop: 1, paddingBottom: 2, bgcolor: 'none' }}>{userFirstName}'s images</Typography>
            <div style={{height: '100%', overflow: 'hidden'}}>
              <RightBarImages loggedInUsername={loggedInUsername} userProfileToGet={userProfileToGet} />
            </div>
          </Container>
      </React.Fragment>
      </div>
    );
  }
}