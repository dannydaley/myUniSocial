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

    componentDidMount = () => {
        this.props.SwitchPlatform("myUniSocial");

        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/profile/getUserProfile", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                loggedInUsername: this.props.loggedInUsername,
                userProfileToGet: this.props.userProfileToGet,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
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
                this.props.getNotifications();
            });
    };

    sendFriendRequest = () => {
        fetch(process.env.REACT_APP_SERVER + "/friends/friendRequest", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: this.props.loggedInUsername,
                recipient: this.props.userProfileToGet,
            }),
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
                            userFirstName={userFirstName}
                            userLastName={userLastName}
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
                            userFirstName={userFirstName}
                            userLastName={userLastName}
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
