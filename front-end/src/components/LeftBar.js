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

          <Container position="fixed" maxWidth="sm" sx={{position: 'fixed', bgcolor: '#343434', border: '',display: "flex", height: '80vh', width: 300, mt: 16, flexDirection: "column",justifyContent: 'flex-start', alignItems: 'center'}} >
            <Box sx={{ padding: 2, bgcolor: 'none'}}>
            <Link to="/myProfile">
                                <div    style={{
                        backgroundImage:
                            "url(" +
                            process.env.REACT_APP_SERVER +
                            "/public/" +
                            userProfilePicture +
                            ")",
                        backgroundSize: "cover",
                        minWidth: "120px",
                        height: "120px",
                        marginBottom: "50px",
                        border: "1px solid gray",
                    borderRadius: "50%",
                    width: '200px',
                    height: '200px',
                    ":hover": { cursor: 'pointer' }
                    }}
                
                            ></div></Link>
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
          <Container position="fixed" maxWidth="sm" sx={{  position: 'fixed', bgcolor: '#343434', border: '',display: "flex", height: '80vh', width: 300, mt: 16, flexDirection: "column",justifyContent: 'flex-start', alignItems: 'center'}} >
            <Box sx={{ padding: 2, bgcolor: 'none'}}>
              <Link to="/myProfile">
                <div
                  style={{
                    backgroundImage:
                      "url(" +
                      process.env.REACT_APP_SERVER +
                      "/public/" +
                      userProfilePicture +
                      ")",
                    backgroundSize: "cover",
                    minWidth: "120px",
                    height: "120px",
                    marginBottom: "50px",
                    border: "1px solid gray",
                    borderRadius: "50%",
                    width: '200px',
                    height: '200px',
                    ":hover": { cursor: 'pointer' }
                      }}>
                    </div>
                  </Link>
                  <Stack spacing={2} sx={{  width: 240, margin: '50px auto 0', height: '500px', overflowY: 'auto'}}>              
                                              <Button
                            variant="contained"
                            sx={{backgroundColor: "#f5c732",mb: "50px","&:hover": { backgroundColor: "gray" }}}
                size="medium" onClick={()=>changeCircle('general')}>GENERAL</Button>
                      {this.state.circles.map(circle => (
                        circle.length > 2 ?
                          <Button
                            variant="contained"
                            sx={{backgroundColor: "#f5c732",mb: "50px","&:hover": { backgroundColor: "gray" }}}
                size="medium"
                 onClick={() => changeCircle(`${circle}`)}>{circle}</Button>
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