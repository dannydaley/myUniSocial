import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/home/HomeLeft";
import React from "react";
import QuestionFeed from "../components/home/QuestionFeed";

import { Navigate } from "react-router-dom";

class HomePage404 extends React.Component {
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

    // params = useLocation();
    // pathname = this.params.pathname;
    // feedToGet = this.pathname.substring(10);

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
        // navigate("/myuni404");
    };
    componentDidMount() {
        this.props.SwitchPlatform("myUni404");
    }

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

export default HomePage404;
