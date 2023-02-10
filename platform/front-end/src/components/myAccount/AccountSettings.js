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

    // calls when user selects what settings to change and takes to update form
    changeSettings = (newSettings) => {
        // apply settings type to state
        this.setState({ settings: newSettings });
    };

    // grabs the correct form component depending on settings selection
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
        const { dataIsLoaded } = this.state;
        // if data isnt loaded yet..
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
                    <h1 style={{ color: "white" }}>loading</h1>
                    <Divider variant="middle" sx={{ mt: 1.5, mb: 1.5 }} />
                </Container>
            );
        } else {
            // load this if data is loaded
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
