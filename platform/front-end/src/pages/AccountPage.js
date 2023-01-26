import React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import AccountLeft from "../components/myAccount/AccountLeft";
import AccountSettings from "../components/myAccount/AccountSettings";

export default class AccountPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            userFirstName,
            userLastName,
            changeSettings,
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
                <Grid item width={"225px"}>
                    <AccountLeft
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        changeSettings={changeSettings}
                        userProfilePicture={userProfilePicture}
                    />
                </Grid>

                <Grid item xs={6} sx={{ margin: "0 auto", width: "100px" }}>
                    <AccountSettings
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        userProfilePicture={userProfilePicture}
                        userCoverPicture={userCoverPicture}
                        loggedInUsername={loggedInUsername}
                        getNotifications={getNotifications}
                        refreshData={refreshData}
                    />
                </Grid>
                <Grid item width={"225px"}></Grid>
            </Grid>
        );
    }
}
