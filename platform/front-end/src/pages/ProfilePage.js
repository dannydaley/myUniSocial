import ProfileHeader from "../components/profile/profileHeader";
import ProfileFeed from "../components/profile/profileFeed";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid"; // Grid version 1
import ProfileRightBar from "../components/profile/profileRightBar";
import ProfileLeftBar from "../components/profile/profileLeftBar";

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFriendsWithLoggedInUser: false,
            firstName: "",
            lastName: "",
            username: this.props.username,
            aboutMe: "",
            profilePicture: "",
            coverPicture: "",
            contentIsLoaded: false,
        };
    }

    // calls when component mounts
    componentDidMount = () => {
        // change nav bar logo to social
        this.props.SwitchPlatform("myUniSocial");
        // request user profile data from server
        fetch(process.env.REACT_APP_SERVER + "/profile/getUserProfile", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                loggedInUsername: this.props.loggedInUsername,
                userProfileToGet: this.props.userProfileToGet,
            }),
        })
            //turn the response into a json object
            .then((response) => response.json())
            // apply user profile data to state and set content loaded to true to disable loading screen
            .then((data) => {
                this.setState({
                    isFriendsWithLoggedInUser: data.isFriendsWithLoggedInUser,
                    firstName: data.profileData.firstName,
                    lastName: data.profileData.lastName,
                    aboutMe: data.profileData.aboutMe,
                    profilePicture: data.profileData.profilePicture,
                    coverPicture: data.profileData.coverPicture,
                    contentIsLoaded: true,
                });
                // check for notifications
                this.props.getNotifications();
            });
    };

    // calls when logged in user sends a friend request to profile
    sendFriendRequest = () => {
        // send friend request to server
        fetch(process.env.REACT_APP_SERVER + "/friends/friendRequest", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: this.props.loggedInUsername,
                recipient: this.props.userProfileToGet,
            }),
            // turn response into a JSON object
        }).then((response) => response.json());
    };

    render() {
        const {
            changeAlertNotifications,
            loggedInUsername,
            userProfileToGet,
            userFirstName,
            userLastName,
            userProfilePicture,
        } = this.props;
        const { contentIsLoaded, coverPicture, isFriendsWithLoggedInUser } =
            this.state;
        if (contentIsLoaded) {
            return (
                <Grid
                    container
                    spacing={3}
                    sx={{
                        overflow: "hidden",
                        backgroundColor: "#333",
                        marginTop: "55px",
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
                        <ProfileLeftBar
                            userProfileToGet={userProfileToGet}
                            sendFriendRequest={this.sendFriendRequest}
                            userFirstName={userFirstName}
                            userLastName={userLastName}
                            isFriendsWithLoggedInUser={
                                isFriendsWithLoggedInUser
                            }
                            changeAlertNotifications={changeAlertNotifications}
                            userProfilePicture={userProfilePicture}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            backgroundColor: "#292929",
                            paddingRight: { xs: "30px" },
                            margin: "0 auto",
                            marginTop: { xs: "-20px" },
                            paddingBottom: "50px",
                            minHeight: "100vh",
                        }}
                    >
                        <ProfileHeader coverPicture={coverPicture} />
                        <ProfileFeed
                            userProfileToGet={userProfileToGet}
                            isFriendsWithLoggedInUser={
                                isFriendsWithLoggedInUser
                            }
                            loggedInUsername={loggedInUsername}
                            userFirstName={this.state.firstName}
                            userLastName={this.state.lastName}
                            userProfilePicture={userProfilePicture}
                        />
                    </Grid>
                    <Grid
                        item
                        sx={{
                            display: { xs: "none", md: "none", lg: "block" },
                            width: "275px",
                        }}
                    >
                        <ProfileRightBar
                            userFirstName={this.state.firstName}
                            userLastName={this.state.lastName}
                            userProfileToGet={userProfileToGet}
                        />
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <div style={{ paddingTop: "40vh" }}>
                    <CircularProgress />
                </div>
            );
        }
    }
}
