import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/home/HomeLeft";
import React from "react";
import { useLocation } from "react-router-dom";

import FullQuestion from "../components/FullQuestion/FullQuestion";
// import AskQuestion from "../AskQuestion";
// import Profile from "../Profile/Profile";
import NavBar from "../../navBar";

class QuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: "feed",
            viewFeed: "Web",
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

    delayFunction = async () => {
        await this.delay(1000);
    };

    componentDidMount = async () => {
        this.setState({ contentLoaded: false });
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/feeds/getQuestion", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postID: this.props.questionToGet,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then((data) => {
                this.setState({ questionInfo: data[0] });
                this.setState({ contentLoaded: true });
            });
    };

    refreshQuestion = () => {
        this.componentDidMount();
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
                    <Grid xs={6} sx={{ margin: "0 auto" }}>
                        <FullQuestion
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
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default QuestionPage;
