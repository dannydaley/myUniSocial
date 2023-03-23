import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/SocialHome/HomeLeft";
import HomeRight from "../components/SocialHome/HomeRight";
import FeedPost from "../components/SocialHome/FeedPost";

export default class PostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFriendsWithLoggedInUser: false,
            postId: this.props.postToGet,
            firstName: "",
            lastName: "",
            authorUsername: this.props.username,
            profilePicture: "",
            content: "",
            likes: 0,
            dislikes: 0,
            images: [],
            comments: [],
            contentIsLoaded: false,
        };
    }

    // calls when component mounts
    componentDidMount = () => {
        // switches nav logo to social
        this.props.SwitchPlatform("myUniSocial");
        // fetch the post data from the server
        fetch(process.env.REACT_APP_SERVER + "/feeds/getPost", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                loggedInUsername: this.props.loggedInUsername,
                postID: this.props.postToGet,
            }),
        })
            //turn the response into a json object
            .then((response) => response.json())
            // apply response data to state, then switch 'contentIsLoaded' to toggle loading screen
            .then((data) => {
                this.setState({
                    isFriendsWithLoggedInUser: data.isFriendsWithLoggedInUser,
                    firstName: data.postData[0].firstName,
                    lastName: data.postData[0].lastName,
                    authorUsername: data.postData[0].author,
                    profilePicture: data.postData[0].profilePicture,
                    content: data.postData[0].content,
                    likes: data.postData[0].likes,
                    dislikes: data.postData[0].dislikes,
                    images: data.postData[0].images,
                    comments: data.postData,
                    contentIsLoaded: true,
                });
                // look for notifications
                this.props.getNotifications();
            });
    };

    render() {
        const { onRouteChange, loggedInUsername, userProfilePicture } =
            this.props;
        const { contentIsLoaded, isFriendsWithLoggedInUser } = this.state;
        if (contentIsLoaded && isFriendsWithLoggedInUser) {
            return (
                <Grid
                    container
                    spacing={3}
                    sx={{
                        overflow: "hidden",
                        backgroundColor: "#333",
                        marginTop: "55px",
                        minHeight: "100vh",
                    }}
                >
                    <Grid
                        item
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: "225px",
                        }}
                    >
                        <HomeLeft
                            changeCircle={this.changeCircle}
                            onRouteChange={onRouteChange}
                            userProfilePicture={userProfilePicture}
                            loggedInUsername={loggedInUsername}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            backgroundColor: "#292929",
                            margin: {
                                xs: "-20px 0 0 0 ",
                                md: "50px auto",
                                lg: "50px auto",
                            },
                            padding: {
                                xs: "-20px 30px 0 0",
                                md: "50px 0",
                            },
                        }}
                    >
                        <FeedPost
                            key={1}
                            loggedInUsername={loggedInUsername}
                            authorUsername={this.state.authorUsername}
                            authorFirstName={this.state.firstName}
                            authorLastName={this.state.lastName}
                            content={this.state.content}
                            profilePicture={this.state.profilePicture}
                            images={this.state.images}
                            postId={this.props.postToGet}
                            likes={this.state.likes}
                            dislikes={this.state.dislikes}
                            onRouteChange={onRouteChange}
                            comments={this.state.comments}
                            changeCircle={this.props.changeCircle}
                            circle={this.props.circle}
                        />
                    </Grid>
                    <Grid
                        item
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: "225px",
                        }}
                    >
                        <HomeRight loggedInUsername={loggedInUsername} />
                    </Grid>
                </Grid>
            );
        } else if (contentIsLoaded && !isFriendsWithLoggedInUser) {
            return (
                <Grid
                    container
                    spacing={3}
                    sx={{
                        overflow: "hidden",
                        backgroundColor: "#333",
                        marginTop: "55px",
                        minHeight: "100vh",
                    }}
                >
                    <Grid
                        item
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: "225px",
                        }}
                    >
                        <HomeLeft
                            changeCircle={this.changeCircle}
                            onRouteChange={onRouteChange}
                            userProfilePicture={userProfilePicture}
                            loggedInUsername={loggedInUsername}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            backgroundColor: "#292929",
                            margin: {
                                xs: "-20px 0 0 0 ",
                                md: "50px auto",
                                lg: "50px auto",
                            },
                            padding: {
                                xs: "-20px 30px 0 0",
                                md: "50px 0",
                            },
                        }}
                    >
                        <FeedPost
                            key={1}
                            loggedInUsername={loggedInUsername}
                            authorUsername={this.state.authorUsername}
                            authorFirstName={this.state.firstName}
                            authorLastName={this.state.lastName}
                            content={
                                "You do not have access to this post, add the author as a friend to view."
                            }
                            profilePicture={this.state.profilePicture}
                            images={[]}
                            postId={this.props.postToGet}
                            likes={0}
                            dislikes={0}
                            onRouteChange={onRouteChange}
                        />
                    </Grid>
                    <Grid
                        item
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: "225px",
                        }}
                    >
                        <HomeRight loggedInUsername={loggedInUsername} />
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid
                    container
                    spacing={3}
                    sx={{
                        overflow: "hidden",
                        backgroundColor: "#333",
                        marginTop: "55px",
                        minHeight: "20vh",
                    }}
                >
                    <Grid
                        item
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: "225px",
                        }}
                    >
                        <HomeLeft
                            changeCircle={this.changeCircle}
                            onRouteChange={onRouteChange}
                            userProfilePicture={userProfilePicture}
                            loggedInUsername={loggedInUsername}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            backgroundColor: "#292929",

                            margin: "0 auto",
                            marginTop: { xs: "-20px" },
                            paddingBottom: "50px",
                            minHeight: "20vh",
                        }}
                    >
                        <CircularProgress sx={{ marginTop: "40vh" }} />
                    </Grid>
                    <Grid
                        item
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: "225px",
                        }}
                    >
                        <HomeRight loggedInUsername={loggedInUsername} />
                    </Grid>
                </Grid>
            );
        }
    }
}
