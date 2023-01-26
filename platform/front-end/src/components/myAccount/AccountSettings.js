import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import MyInformation from "./settingsGroups/myInformation";
import MyLoginInfo from "./settingsGroups/myLoginInfo";
import MyCircles from "./settingsGroups/myCircles";
import MyFriends from "./settingsGroups/myFriends";

export default class AccountSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.settings,
            posts: [],
            dataIsLoaded: true,
        };
    }

    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = async () => {
        await this.delay(1000);
    };

    //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    // componentDidMount = async (newSettings) => {
    //     if (!newSettings) {
    //         newSettings = this.props.settings;
    //     }
    //     this.setState({ dataIsLoaded: false, settings: newSettings });
    //     //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
    //     fetch(process.env.REACT_APP_SERVER + "/getFeedByUser", {
    //         method: "post",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             user: this.props.loggedInUsername,
    //             settings: newSettings,
    //         }),
    //     })
    //         //TURN THE RESPONSE INTO A JSON OBJECT
    //         .then((response) => response.json())
    //         .then(await this.delayFunction())
    //         // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
    //         .then((data) => {
    //             this.setState({
    //                 settings: newSettings,
    //                 posts: data,
    //                 dataIsLoaded: true,
    //             });
    //         });
    // };

    changeSettings = (newSettings) => {
        // this.componentDidMount(newSettings);
        this.setState({ settings: newSettings });
    };

    settingsGroup = (selection) => {
        switch (selection) {
            case "My information":
                return (
                    <MyInformation
                        updateSession={this.props.updateSession}
                        settings={this.props.settings}
                        remountParent={this.componentDidMount}
                        loggedInUsername={this.props.loggedInUsername}
                        refreshData={this.props.refreshData}
                    />
                );
            case "My Circles":
                return (
                    <MyCircles
                        settings={this.props.settings}
                        loggedInUsername={this.props.loggedInUsername}
                    />
                );
            case "My friends":
                return (
                    <MyFriends
                        settings={this.props.settings}
                        loggedInUsername={this.props.loggedInUsername}
                    />
                );
            case "My login info":
                return (
                    <MyLoginInfo
                        settings={this.props.settings}
                        mountComponent={this.componentDidMount}
                    />
                );
            default:
                return <MyInformation settings={this.props.settings} />;
        }
    };

    render() {
        // const {
        //     userFirstName,
        //     userLastName,
        //     userProfilePicture,
        //     loggedInUsername,
        // } = this.props;
        //SETTING UP ACCESS TO THE STATE VARIABLES
        const { dataIsLoaded } = this.state;
        // IF THE DATA ISNT LOADED YET, LOAD AN ALTERNATIVE WHILE WE WAIT
        if (!dataIsLoaded) {
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        padding: "20px",
                        zIndex: 2,
                        backgroundColor: "#292929",
                        borderRadius: "0px 0px 30px 30px",
                        width: "100%",
                        pb: 2,
                        ml: 2,
                        mr: 2,
                        mt: 5,
                    }}
                >
                    <Box
                        sx={{
                            padding: 2,
                            bgcolor: "none",
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                    <h1 style={{ color: "white" }}>
                        loading {/* {this.state.settings}*/}
                    </h1>
                    <Divider variant="middle" sx={{ mt: 1.5, mb: 1.5 }} />
                </Container>
            );
        } else {
            // OTHERWISE RUN THE GOOD STUFF
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        padding: "20px",
                        zIndex: 2,
                        backgroundColor: "#292929",
                        borderRadius: "0px 0px 30px 30px",
                        width: "100%",
                        pb: 2,
                        ml: 2,
                        mr: 2,
                        mt: 5,
                    }}
                >
                    {this.settingsGroup(this.props.settings)}
                </Container>
            );
        }
    }
}
