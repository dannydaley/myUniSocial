import React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/HomeLeft";
import Feed from "../components/feed";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: "general",
        };
    }

    render() {
        const {
            onRouteChange,
            userFirstName,
            userLastName,
            loggedInUsername,
            userProfilePicture,
            getNotifications,
            changeCircle,
        } = this.props;
        return (
            <Grid>
                <Grid width={"225px"}>
                    <HomeLeft
                        changeCircle={changeCircle}
                        onRouteChange={onRouteChange}
                        userProfilePicture={userProfilePicture}
                        loggedInUsername={loggedInUsername}
                    />
                </Grid>

                <Grid xs={6} sx={{ margin: "0 auto" }}>
                    {" "}
                    <Feed
                        getNotifications={getNotifications}
                        circle={this.state.circle}
                        changeMailNotifications={this.changeMailNotifications}
                        onRouteChange={onRouteChange}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        loggedInUsername={loggedInUsername}
                        userProfilePicture={userProfilePicture}
                    />
                </Grid>
            </Grid>
        );
    }
}
