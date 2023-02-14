import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/home/HomeLeft";
import React from "react";
import AskQuestion from "../components/AskQuestion";

class AskQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: "feed",
            viewFeed: "Web",
            viewProfile: 0,
            key: 1,
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
                        <AskQuestion
                            changeFeed={this.changeFeed}
                            userProfilePicture={this.props.userProfilePicture}
                            userData={this.props.userData}
                            userID={this.props.userID}
                            userFirstName={this.props.userFirstName}
                            userLastName={this.props.userLastName}
                            loggedInUsername={this.props.loggedInUsername}
                        />
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default AskQuestionPage;
