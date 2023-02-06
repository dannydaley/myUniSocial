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
                        <AskQuestion
                            changeFeed={this.changeFeed}
                            userProfilePicture={this.props.userProfilePicture}
                            userData={this.props.userData}
                            userID={this.props.userID}
                            userFirstName={this.props.userFirstName}
                            userLastName={this.props.userLastName}
                        />
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default AskQuestionPage;
