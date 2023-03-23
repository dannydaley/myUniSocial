import * as React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/SocialHome/HomeLeft";
import Feed from "../components/SocialHome/Feed";
import HomeRight from "../components/SocialHome/HomeRight";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: "general",
            circleLoaded: true,
            posts: [],
            dataIsLoaded: false,
            showCircles: false,
        };
    }

    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = async () => {
        await this.delay(1000);
    };

    //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    getFeed = async (newCircle) => {
        if (!newCircle || newCircle === undefined) {
            newCircle = "general";
        }
        this.setState({ dataIsLoaded: false, circle: newCircle });
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/feeds/getFeedFriendsOnly", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
                profilePicture: this.props.userProfilePicture,
                circle: newCircle,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // .then(await this.delayFunction())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                let posts = [];
                let comments = [];
                data.posts.forEach((element) => {
                    element.relativePostId > 0
                        ? comments.push(element)
                        : posts.push(element);
                });
                this.setState({
                    circle: newCircle,
                    posts: posts,
                    comments: comments,
                    dataIsLoaded: true,
                });

                this.props.getNotifications();
            });
    };

    componentDidMount() {
        this.getFeed(this.state.circle);

        this.props.SwitchPlatform("myUniSocial");
    }

    changeCircle = (newCircle) => {
        this.getFeed(newCircle);
    };

    render() {
        const {
            onRouteChange,
            userFirstName,
            userLastName,
            loggedInUsername,
            userProfilePicture,
            getNotifications,
        } = this.props;
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
                        paddingRight: { xs: "30px" },
                        margin: "0 auto",
                        marginTop: { xs: "-20px" },
                        paddingBottom: "50px",
                        minHeight: "100vh",
                    }}
                >
                    {this.state.showCircles ? (
                        <div
                            style={{
                                backgroundColor: "white",
                                position: "absolute",
                                marginTop: "300px",
                                zIndex: 100,

                                bottom: 0,
                            }}
                        >
                            <HomeLeft
                                changeCircle={this.changeCircle}
                                onRouteChange={onRouteChange}
                                userProfilePicture={userProfilePicture}
                                loggedInUsername={loggedInUsername}
                            />
                        </div>
                    ) : (
                        ""
                    )}

                    <Feed
                        onClick={() => this.setState({ showCircles: false })}
                        style={{ zIndex: 10 }}
                        posts={this.state.posts}
                        comments={this.state.comments}
                        circle={this.state.circle}
                        changeCircle={this.changeCircle}
                        getNotifications={getNotifications}
                        changeMailNotifications={this.changeMailNotifications}
                        onRouteChange={onRouteChange}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        loggedInUsername={loggedInUsername}
                        userProfilePicture={userProfilePicture}
                        dataIsLoaded={this.state.dataIsLoaded}
                    />
                    <AppBar
                        position="fixed"
                        color="primary"
                        sx={{
                            zIndex: 1000,
                            backgroundColor: "#f5c732",
                            top: "auto",
                            bottom: 0,
                            display: { xs: "block", md: "none" },
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                            >
                                <MenuIcon
                                    onClick={() =>
                                        this.setState({
                                            showCircles:
                                                !this.state.showCircles,
                                        })
                                    }
                                />
                            </IconButton>
                            {/* <StyledFab color="secondary" aria-label="add">
                                <AddIcon />
                            </StyledFab> */}
                            <Box sx={{ flexGrow: 1 }} />
                            {/* <IconButton color="inherit">
                                <SearchIcon />
                            </IconButton> */}
                            <IconButton color="inherit">
                                <MoreIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
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
