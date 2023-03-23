import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/home/HomeLeft";
import React from "react";
import AskQuestion from "../components/AskQuestion";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";

class AskQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: "feed",
            viewFeed: "Web",
            viewProfile: 0,
            key: 1,
            showSideBar: false,
            questionInfo: {
                authorProfilePicture: "",
                title: "",
                author: "",
                text: "",
                code: "",
                postID: "",
            },
        };
    }

    // calls when component first mounts
    componentDidMount() {
        // change nav bar logo to 404
        this.props.SwitchPlatform("myUni404");
    }

    // runs when user clicks on link to view profile
    viewProfile = (num) =>
        // set viewprofile state to user ID input (num) and change route to profile
        this.setState({ viewProfile: num, route: "profile" });

    // change route to profile
    changeRoute = (route) => this.setState({ route: route });

    // gets question data ready to render
    readyQuestion = (
        authorProfilePicture,
        title,
        author,
        text,
        code,
        postID,
        language,
        authorID
    ) => {
        // apply readied data to state to render
        this.setState({
            questionInfo: {
                authorProfilePicture: authorProfilePicture,
                title: title,
                author: author,
                text: text,
                code: code,
                postID: postID,
                language: language,
                authorID: authorID,
            },
        });
    };

    // calls when user clicks on different feed to view from side bar
    changeFeed = (key, feed) => {
        // apply feed to view and component key to state
        this.setState({ key: key, viewFeed: feed });
        // change route to feed to switch view
        this.changeRoute("feed");
    };

    render() {
        return (
            <>
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
                            width: { md: "1500px", lg: "225px" },
                            // width: "225px",
                        }}
                    >
                        <HomeLeft
                            userProfilePicture={this.props.userProfilePicture}
                            key={this.state.key}
                            userID={this.props.userID}
                            changeFeed={this.changeFeed}
                            changeRoute={this.changeRoute}
                            userData={this.props.userData}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={9}
                        lg={6}
                        sx={{
                            paddingRight: { xs: "0px" },
                            margin: "0 auto",
                            marginTop: { xs: "-20px" },
                            paddingBottom: "50px",
                            minHeight: "100vh",
                            marginLeft: { md: "18%" },
                        }}
                    >
                        {this.state.showSideBar ? (
                            <div
                                style={{
                                    backgroundColor: "white",
                                    position: "absolute",
                                    marginTop: "300px",
                                    zIndex: 100,
                                    width: "300px",
                                    bottom: 0,
                                }}
                            >
                                <HomeLeft
                                    userProfilePicture={
                                        this.props.userProfilePicture
                                    }
                                    key={this.state.key}
                                    userID={this.props.userID}
                                    changeFeed={this.changeFeed}
                                    changeRoute={this.changeRoute}
                                    userData={this.props.userData}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <AskQuestion
                            changeFeed={this.changeFeed}
                            userProfilePicture={this.props.userProfilePicture}
                            userData={this.props.userData}
                            userID={this.props.userID}
                            userFirstName={this.props.userFirstName}
                            userLastName={this.props.userLastName}
                            loggedInUsername={this.props.loggedInUsername}
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
                                                showSideBar:
                                                    !this.state.showSideBar,
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
                </Grid>
            </>
        );
    }
}

export default AskQuestionPage;
