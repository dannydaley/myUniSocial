import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

export default class MyCircles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circles: [],
            followedCircles: [],
            dataIsLoaded: false,
        };
    }

    // calls once when component mounts
    componentDidMount = () => {
        // reinitiate loading screen incase is true when this function is called by another function
        this.setState({ dataIsLoaded: false });
        // fetch all modules from server
        fetch(process.env.REACT_APP_SERVER + "/modules/getAllCircles", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
            }),
        })
            // turn response into a JSON object
            .then((response) => response.json())
            // apply response data to state
            .then((data) => {
                this.setState({
                    circles: data.circles,
                    followedCircles: data.followedCircles,
                    dataIsLoaded: true,
                });
            });
    };

    // calls when user adds a circle
    addCircle = (circleName) => {
        // reinitiate loading screen
        this.setState({ dataIsLoaded: false });
        // send add module request to server
        fetch(process.env.REACT_APP_SERVER + "/modules/addCircle", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
                circleName: circleName,
            }),
        })
            //turn response into a JSON object
            .then((response) => response.json())
            // remount the component and update this component
            .then(this.componentDidMount());
    };

    // calls when user unfollows a module
    deleteCircle = (circleName) => {
        // reinitiate loading screen
        this.setState({ dataIsLoaded: false });
        // send delete module request to server
        fetch(process.env.REACT_APP_SERVER + "/modules/deleteCircle", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
                circleName: circleName,
            }),
        })
            //turn response into a JSON object
            .then((response) => response.json())
            // remount the component and update this component
            .then(this.componentDidMount());
    };

    render() {
        const { circles, followedCircles, dataIsLoaded } = this.state;
        if (!dataIsLoaded) {
            return (
                <div>
                    <Typography
                        variant="h3"
                        component="div"
                        color="white"
                        sx={{
                            textAlign: "center",
                            mt: 2,
                            paddingTop: 1,
                            paddingBottom: 2,
                            bgcolor: "none",
                        }}
                    >
                        My Modules
                    </Typography>
                </div>
            );
        } else {
            return (
                <div>
                    <Typography
                        variant="h3"
                        component="div"
                        color="white"
                        sx={{
                            textAlign: "center",
                            mt: 2,
                            paddingTop: 1,
                            paddingBottom: 2,
                            bgcolor: "none",
                        }}
                    >
                        My Modules
                    </Typography>
                    <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        sx={{ mt: 4 }}
                    >
                        {circles.map((circle) =>
                            followedCircles.indexOf(circle.circleName) > -1 ? (
                                <Grid item xs={12} md={6} lg={4}>
                                    <Button
                                        onClick={() =>
                                            this.deleteCircle(circle.circleName)
                                        }
                                        variant="contained"
                                        sx={{ width: "90%", height: "60px" }}
                                    >
                                        {circle.circleName}
                                    </Button>
                                </Grid>
                            ) : (
                                <Grid item xs={12} md={6} lg={4}>
                                    <Button
                                        onClick={() =>
                                            this.addCircle(circle.circleName)
                                        }
                                        variant="outlined"
                                        sx={{
                                            width: "90%",
                                            height: "60px",
                                            backgroundColor: "gray",
                                            color: "white",
                                        }}
                                    >
                                        {circle.circleName}
                                    </Button>
                                </Grid>
                            )
                        )}
                    </Grid>
                </div>
            );
        }
    }
}
