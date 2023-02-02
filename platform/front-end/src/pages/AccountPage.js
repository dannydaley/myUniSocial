import React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import AccountLeft from "../components/myAccount/AccountLeft";
import AccountSettings from "../components/myAccount/AccountSettings";

export default class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: "My information",
            posts: [],
            dataIsLoaded: false,
        };
    }

    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = async () => {
        await this.delay(1000);
    };

    //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    componentDidMount = async (newSettings) => {
        if (!newSettings) {
            newSettings = this.state.settings;
        }
        this.setState({ dataIsLoaded: false, settings: newSettings });
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/account/getFeedByUser", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
                settings: newSettings,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then(await this.delayFunction())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({
                    settings: newSettings,
                    posts: data,
                    dataIsLoaded: true,
                });
            });
    };

    changeSettings = (newSettings) => {
        // this.componentDidMount(newSettings);
        this.setState({ settings: newSettings });
    };

    render() {
        const {
            userFirstName,
            userLastName,

            userProfilePicture,
            loggedInUsername,
            userCoverPicture,
            getNotifications,
            refreshData,
        } = this.props;
        return (
            <Grid
                container
                spacing={3}
                sx={{
                    backgroundColor: "#333",
                    marginTop: "60px",
                    minHeight: "90vh",
                }}
            >
                <Grid
                    item
                    sx={{
                        display: { xs: "none", md: "block" },
                        width: "225px",
                    }}
                >
                    <AccountLeft
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        changeSettings={this.changeSettings}
                        userProfilePicture={userProfilePicture}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        paddingRight: { xs: "30px" },
                        margin: "0 auto",
                        marginTop: { xs: "-20px" },
                        paddingBottom: "50px",
                        minHeight: "100vh",
                    }}
                >
                    <AccountSettings
                        settings={this.state.settings}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        userProfilePicture={userProfilePicture}
                        userCoverPicture={userCoverPicture}
                        loggedInUsername={loggedInUsername}
                        getNotifications={getNotifications}
                        refreshData={refreshData}
                    />
                </Grid>
                <Grid
                    item
                    sx={{
                        display: {
                            xs: "none",
                            md: "block",
                        },
                        width: "225px",
                    }}
                ></Grid>
            </Grid>
        );
    }
}
