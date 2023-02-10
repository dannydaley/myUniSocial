import Grid from "@mui/material/Grid";
import HomeLeft from "./HomeLeft";
import React from "react";
import QuestionFeed from "./QuestionFeed";
import NavBar from "../../../navBar";

class HomeGrid extends React.Component {
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

    // gets called when user clicks to view a users profile
    viewProfile = (num) =>
        // set state and update route to go to profile
        this.setState({ viewProfile: num, route: "profile" });

    // updates the route to navigate site, applies parameter input to route state
    changeRoute = (route) => this.setState({ route: route });

    // gets called when a question is selected to view, it gets the question data together and applies to state
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

    // gets called when user selects a different field to view (web, game dev, etc)
    changeFeed = (key, feed) => {
        // updates the 'key' state to refresh the component and view feed to move to new feed
        this.setState({ key: key, viewFeed: feed });
        // changes the route to feed, with the above data already prepared
        this.changeRoute("feed");
    };

    render() {
        return (
            <>
                <NavBar
                    userData={this.props.userData}
                    userID={this.props.userID}
                    viewProfile={this.viewProfile}
                    readyQuestion={this.readyQuestion}
                    changeRoute={this.changeRoute}
                />
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
                        xs={6}
                        sx={{
                            margin: "0 auto",
                            width: "100px",
                            paddingBottom: "50px",
                            minHeight: "100vh",
                        }}
                    >
                        <QuestionFeed
                            key={this.state.key}
                            userID={this.props.userID}
                            userData={this.props.userData}
                            viewFeed={this.state.viewFeed}
                            changeRoute={this.changeRoute}
                            readyQuestion={this.readyQuestion}
                            viewProfile={this.viewProfile}
                        />
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default HomeGrid;
