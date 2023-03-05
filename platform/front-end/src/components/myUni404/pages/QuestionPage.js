import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/home/HomeLeft";
import React from "react";
import FullQuestion from "../components/FullQuestion/FullQuestion";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";

class QuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: "feed",
            viewFeed: "Web",
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

    //calls when component mounts
    componentDidMount = async () => {
        // change nav bar logo to 404
        this.props.SwitchPlatform("myUni404");
        // change content loaded to false to inititate loading screen
        this.setState({ contentLoaded: false });
        // request question data from server
        fetch(process.env.REACT_APP_SERVER + "/feeds/getQuestion", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postID: this.props.questionToGet,
            }),
        })
            //turn the response into a json object
            .then((response) => response.json())
            // apply response data to state and switch content loading screen off
            .then((data) => {
                this.setState({ questionInfo: data[0] });
                this.setState({ contentLoaded: true });
            });
    };

    // delays for 1second when called
    delayFunction = async () => {
        await this.delay(1000);
    };

    // remounts component to refresh question data
    refreshQuestion = () => {
        this.componentDidMount();
    };

    // calls when user clicks on different feed to view from side bar
    changeFeed = (key, feed) => {
        // apply feed to view and component key to state
        this.setState({ key: key, viewFeed: feed });
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
                            width: "225px",
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
                        <FullQuestion
                            loggedInUsername={this.props.loggedInUsername}
                            userProfilePicture={this.props.userProfilePicture}
                            authorProfilePicture={
                                this.state.questionInfo.authorProfilePicture
                            }
                            viewProfile={this.viewProfile}
                            key={this.state.key}
                            userID={this.props.userID}
                            userFirstName={this.props.userFirstName}
                            userLastName={this.props.userLastName}
                            userData={this.props.userData}
                            title={this.state.questionInfo.title}
                            author={this.state.questionInfo.author}
                            text={this.state.questionInfo.text}
                            code={this.state.questionInfo.code}
                            postID={this.props.questionToGet}
                            authorID={this.state.questionInfo.authorID}
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

export default QuestionPage;
