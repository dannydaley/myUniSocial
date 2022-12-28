import React from "react";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button } from "@mui/material";

export default class MyCircles extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            circles: [],
            followedCircles: [],
            dataIsLoaded: false
        }
      }

      componentDidMount = () => {
        this.setState({ dataIsLoaded: false })
        fetch(process.env.REACT_APP_SERVER + '/getAllCircles', {
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
            this.setState({circles: data.circles, followedCircles: data.followedCircles, dataIsLoaded: true})
            })
        }

        addCircle = (circleName) => {
            this.setState({ dataIsLoaded: false })
            fetch(process.env.REACT_APP_SERVER + '/addCircle', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                user: this.props.loggedInUsername,
                circleName: circleName 
                })    
            })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then(response => response.json())    
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then(this.componentDidMount())
        }

        deleteCircle = (circleName) => {
            this.setState({ dataIsLoaded: false })
            fetch(process.env.REACT_APP_SERVER + '/deleteCircle', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                user: this.props.loggedInUsername,
                circleName: circleName 
                })    
            })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then(response => response.json())    
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then(this.componentDidMount())
        }

    render() {
        const { settings } = this.props; 
        const { circles, followedCircles, dataIsLoaded } = this.state;
        if (!dataIsLoaded) {
            return(
                <div>
                    <Typography
                        variant="h3"
                        component="div"
                        color="white"
                        sx={{
                            textAlign: 'center',
                            mt: 2,
                            paddingTop: 1,
                            paddingBottom: 2,
                            bgcolor: 'none'
                            }}>
                                {settings}
                    </Typography>
                </div>
            )
        } else {
            return(
                <div>
                    <Typography
                        variant="h3"
                        component="div"
                        color="white"
                        sx={{
                            textAlign: 'center',
                            mt: 2,
                            paddingTop: 1,
                            paddingBottom: 2,
                            bgcolor: 'none'
                            }}>
                                {settings}
                    </Typography>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mt: 4}}>
                        {circles.map(circle => 
                            followedCircles.indexOf(circle.circleName) > -1 ?
                                <Grid item xs={12} md={6} lg={4}>
                                    <Button
                                        onClick={() => this.deleteCircle(circle.circleName)}
                                        variant="contained"
                                        sx={{width: '90%', height: '60px'}}
                                        >
                                        {circle.circleName}
                                    </Button>
                                 </Grid>                        
                            :
                                <Grid item xs={12} md={6} lg={4}>
                                    <Button
                                        onClick={() => this.addCircle(circle.circleName)}
                                        variant="outlined"
                                        sx={{width: '90%', height: '60px', backgroundColor: 'gray', color: 'white'}}
                                        >
                                        {circle.circleName}
                                    </Button>
                                </Grid>
                        )}
                    </Grid>        
                </div>
            ) 
        }

    }
}