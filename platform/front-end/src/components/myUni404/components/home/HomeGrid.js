import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "./HomeLeft";
import React from "react";
import QuestionFeed from "./QuestionFeed";
import FullQuestion from "../FullQuestion/FullQuestion";
import AskQuestion from "../AskQuestion";
import Profile from "../Profile/Profile";
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

    viewProfile = (num) =>
        this.setState({ viewProfile: num, route: "profile" });

    changeRoute = (route) => this.setState({ route: route });

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
    changeFeed = (key, feed) => {
        this.setState({ key: key, viewFeed: feed });
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
                    sx={{ backgroundColor: "#333", marginTop: "60px" }}
                >
                    <Grid width={"225px"}>
                        <HomeLeft
                            key={this.state.key}
                            userID={this.props.userID}
                            changeFeed={this.changeFeed}
                            changeRoute={this.changeRoute}
                            userData={this.props.userData}
                        />
                    </Grid>
                    <Grid xs={6} sx={{ margin: "0 auto" }}>
                        {/* <Routes>
                            <Route path="question"
                                element={
                                    <FullQuestion
                                    title={this.state.questionInfo.title}
                                    author={this.state.questionInfo.author}
                                    text={this.state.questionInfo.text}
                                    code={this.state.questionInfo.code}
                                    postID={this.state.questionInfo.postID}
                                    />
                                    }
                            />
                            <Route path="feed"
                                element={
                                    <QuestionFeed
                                    userData={ this.props.userData }
                                    changeRoute={this.changeRoute}
                                    readyQuestion={this.readyQuestion}
                                    />
                                    }
                            />
                            <Route path="question"
                                element={
                                    <FullQuestion
                                    userData={ this.props.userData }
                                    title={this.state.questionInfo.title}
                                    author={this.state.questionInfo.author}
                                    text={this.state.questionInfo.text}
                                    code={this.state.questionInfo.code}
                                    postID={this.state.questionInfo.postID}
                                    />
                                    }
                            />
                            <Route path="ask"
                                element={
                                    <AskQuestion 
                                    userData={ this.props.userData }
                                    />
                                    }
                            /> 
                    </Routes> */}

                        <h1>{this.props.loggedInEmail}</h1>
                        {this.state.route === "feed" ? (
                            <QuestionFeed
                                key={this.state.key}
                                userID={this.props.userID}
                                userData={this.props.userData}
                                viewFeed={this.state.viewFeed}
                                changeRoute={this.changeRoute}
                                readyQuestion={this.readyQuestion}
                                viewProfile={this.viewProfile}
                            />
                        ) : (
                            ""
                        )}
                        {this.state.route === "question" ? (
                            <FullQuestion
                                userProfilePicture={
                                    this.props.userProfilePicture
                                }
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
                                postID={this.state.questionInfo.postID}
                                authorID={this.state.questionInfo.authorID}
                            />
                        ) : (
                            ""
                        )}
                        {this.state.route === "ask" ? (
                            <AskQuestion
                                changeFeed={this.changeFeed}
                                userProfilePicture={
                                    this.props.userProfilePicture
                                }
                                userData={this.props.userData}
                                userID={this.props.userID}
                                userFirstName={this.props.userFirstName}
                                userLastName={this.props.userLastName}
                            />
                        ) : (
                            ""
                        )}
                        {this.state.route === "myProfile" ? (
                            <Profile
                                updateProfilePicture={
                                    this.props.updateProfilePicture
                                }
                                key={this.state.key}
                                changeKey={this.props.changeKey}
                                userProfilePicture={
                                    this.props.userProfilePicture
                                }
                                loggedInEmail={this.props.loggedInEmail}
                                userData={this.props.userData}
                                userID={this.props.userID}
                                userFirstName={this.props.userFirstName}
                                userLastName={this.props.userLastName}
                            />
                        ) : (
                            ""
                        )}
                        {this.state.route === "profile" ? (
                            <Profile
                                updateProfilePicture={
                                    this.props.updateProfilePicture
                                }
                                key={this.state.key}
                                changeKey={this.props.changeKey}
                                loggedInEmail={this.props.loggedInEmail}
                                userData={this.props.userData}
                                userID={this.state.viewProfile}
                                userFirstName={this.props.userFirstName}
                                userLastName={this.props.userLastName}
                            />
                        ) : (
                            ""
                        )}
                        {/* <Outlet {...props}/> */}
                    </Grid>
                    {/* <Grid xs>
                    <div>xs</div>
                </Grid> */}
                </Grid>
            </>
        );
    }
}

export default HomeGrid;
