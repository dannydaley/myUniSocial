import * as React from "react";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FeedPost from "../SocialHome/FeedPost";
import NewPost from "../SocialHome/NewPost";
import CircularProgress from "@mui/material/CircularProgress";
import QuestionCard from "../myUni404/components/home/QuestionCard";
import NoQuestions from "../myUni404/components/home/NoQuestions";

import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";

export default class ProfileFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: props.circle,
            isFriendsWithLoggedInUser: this.props.isFriendsWithLoggedInUser,
            posts: [],
            dataIsLoaded: false,
        };
    }

    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = async () => {
        await this.delay(1000);
    };

    //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    componentDidMount = async (newCircle) => {
        if (!newCircle) {
            newCircle = "general";
            this.setState({ dataIsLoaded: false, circle: newCircle });
            //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
            fetch(process.env.REACT_APP_SERVER + "/profile/getFeedByUser", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    loggedInUsername: this.props.loggedInUsername,
                    userProfileToGet: this.props.userProfileToGet,
                    circle: newCircle,
                }),
            })
                //TURN THE RESPONSE INTO A JSON OBJECT
                .then((response) => response.json())
                .then(await this.delayFunction())
                .then((data) => {
                    this.setState({
                        circle: newCircle,
                        posts: data.posts,
                        dataIsLoaded: true,
                    });
                });
        } else if (newCircle === "asked" || newCircle === "answered") {
            this.setState({
                dataIsLoaded: false,
                circle: newCircle,
            });
            //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
            fetch(process.env.REACT_APP_SERVER + "/feeds/getUserQuestionFeed", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: this.props.userProfileToGet,
                }),
            })
                //TURN THE RESPONSE INTO A JSON OBJECT
                .then((response) => response.json())
                .then(await this.delayFunction())
                .then((data) => {
                    this.setState({
                        posts: data.postData,
                        dataIsLoaded: true,
                    });
                });
        }
    };

    changeCircle = (newCircle) => {
        this.componentDidMount(newCircle);
    };

    render() {
        const { userProfileToGet, loggedInUsername } = this.props;
        //SETTING UP ACCESS TO THE STATE VARIABLES
        const { posts, dataIsLoaded, isFriendsWithLoggedInUser } = this.state;
        // IF THE DATA ISNT LOADED YET, LOAD AN ALTERNATIVE WHILE WE WAIT
        if (!dataIsLoaded) {
            return (
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "100px",
                            minHeight: "100vh",
                        }}
                    >
                        <div
                            style={{
                                width: "30%",
                                height: "100px",
                            }}
                        ></div>
                        <React.Fragment>
                            <CssBaseline />
                            <Container
                                maxWidth="lg"
                                sx={{
                                    zIndex: 10,
                                    backgroundColor: "#292929",
                                    bgcolor: "#292929",
                                    borderRadius: "0px 0px 30px 30px",
                                    width: "100%",
                                    pb: 2,
                                    ml: 2,
                                    mr: 2,
                                    mt: 12,
                                }}
                            >
                                <NewPost
                                    recipient={userProfileToGet}
                                    loggedInUserName={loggedInUsername}
                                    userFirstName={this.props.userFirstName}
                                    userLastName={this.props.userLastName}
                                    userProfilePicture={
                                        this.props.userProfilePicture
                                    }
                                />
                                <Box
                                    sx={{
                                        padding: 2,
                                        bgcolor: "none",
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 2,
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                                <h1 style={{ color: "white" }}>
                                    loading {this.state.circle}
                                </h1>
                                <Divider
                                    variant="middle"
                                    sx={{
                                        mt: 1.5,
                                        mb: 1.5,
                                    }}
                                />
                                <Typography
                                    color="white"
                                    sx={{ fontSize: 16, mb: 1.5 }}
                                >
                                    End of posts
                                </Typography>
                            </Container>
                        </React.Fragment>
                        <div
                            style={{
                                width: "30%",
                                height: "100px",
                            }}
                        ></div>
                    </div>
                </div>
            );
        } else {
            if (!isFriendsWithLoggedInUser) {
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: "100px",
                                minHeight: "100vh",
                            }}
                        >
                            <div
                                style={{ width: "30%", height: "100px" }}
                            ></div>
                            <React.Fragment>
                                <CssBaseline />
                                <Container
                                    maxWidth="lg"
                                    sx={{
                                        zIndex: 10,
                                        bgcolor: "#292929",
                                        borderRadius: "0px 0px 30px 30px",
                                        width: "100%",
                                        pb: 2,
                                        ml: 2,
                                        mr: 2,
                                        mt: 12,
                                    }}
                                >
                                    <Typography>
                                        Add this user as a friend to interact
                                        with them
                                    </Typography>
                                </Container>
                            </React.Fragment>
                            <div
                                style={{
                                    width: "30%",
                                    height: "100px",
                                }}
                            ></div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: "100px",
                                minHeight: "100vh",
                            }}
                        >
                            <div
                                style={{ width: "30%", height: "100px" }}
                            ></div>
                            <React.Fragment>
                                <CssBaseline />
                                <Container
                                    maxWidth="lg"
                                    sx={{
                                        zIndex: 10,
                                        bgcolor: "#292929",
                                        borderRadius: "0px 0px 30px 30px",
                                        width: "100%",
                                        pb: 2,

                                        // mt: 12,
                                    }}
                                >
                                    <NewPost
                                        recipient={userProfileToGet}
                                        loggedInUsername={loggedInUsername}
                                        userFirstName={this.props.userFirstName}
                                        userLastName={this.props.userLastName}
                                        userProfilePicture={
                                            this.props.userProfilePicture
                                        }
                                        changeCircle={this.changeCircle}
                                    />
                                    <Box sx={{ padding: 2, bgcolor: "none" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-evenly",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    this.componentDidMount()
                                                }
                                            >
                                                Posts
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    this.componentDidMount(
                                                        "asked"
                                                    )
                                                }
                                            >
                                                Asked
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    this.componentDidMount(
                                                        "answered"
                                                    )
                                                }
                                            >
                                                Answered
                                            </Button>
                                        </Box>
                                        <Stack
                                            spacing={2}
                                            sx={{
                                                width: "100%",
                                                margin: "50px auto 0",
                                            }}
                                        >
                                            {/* .MAP IS OUR FOR EACH LOOP, 'ITEM' IS JUST WHAT WE CALL EACH ELEMENT IN THE LIST SO IS INTERCHANGEABLE */}
                                            {this.state.circle === "general"
                                                ? posts.map((item) => (
                                                      /* RENDER THE COMPONENT WITH PROPS PASSED IN FROM THE SPECIFIC ITEM WERE CURRENTLY ON FOR EACH ITEM PASSED OVER BY THE .MAP */
                                                      <FeedPost
                                                          key={item.id}
                                                          loggedInUsername={
                                                              this.props
                                                                  .loggedInUsername
                                                          }
                                                          authorUsername={
                                                              item.author
                                                          }
                                                          authorFirstName={
                                                              item.firstName
                                                          }
                                                          authorLastName={
                                                              item.lastName
                                                          }
                                                          content={item.content}
                                                          profilePicture={
                                                              item.profilePicture
                                                          }
                                                          images={item.images}
                                                          postId={item.id}
                                                          likes={item.likes}
                                                          dislikes={
                                                              item.dislikes
                                                          }
                                                      />
                                                  ))
                                                : ""}
                                            {this.state.circle === "asked" ? (
                                                posts.length > 0 ? (
                                                    posts
                                                        .reverse()
                                                        .map((item) =>
                                                            item.relativePostID ===
                                                            0 ? (
                                                                <QuestionCard
                                                                    key={
                                                                        item.postID
                                                                    }
                                                                    userID={
                                                                        this
                                                                            .props
                                                                            .userID
                                                                    }
                                                                    userData={
                                                                        this
                                                                            .props
                                                                            .userData
                                                                    }
                                                                    readyQuestion={
                                                                        this
                                                                            .props
                                                                            .readyQuestion
                                                                    }
                                                                    viewProfile={
                                                                        this
                                                                            .props
                                                                            .viewProfile
                                                                    }
                                                                    changeRoute={
                                                                        this
                                                                            .props
                                                                            .changeRoute
                                                                    }
                                                                    authorProfilePicture={
                                                                        item.authorProfilePicture
                                                                    }
                                                                    poster={
                                                                        item.author
                                                                    }
                                                                    authorID={
                                                                        item.authorID
                                                                    }
                                                                    title={
                                                                        item.title
                                                                    }
                                                                    question={
                                                                        item.text
                                                                    }
                                                                    code={
                                                                        item.code
                                                                    }
                                                                    postID={
                                                                        item.postID
                                                                    }
                                                                    language={
                                                                        item.language
                                                                    }
                                                                    number={
                                                                        item.score
                                                                    }
                                                                    replies={0}
                                                                />
                                                            ) : (
                                                                ""
                                                            )
                                                        )
                                                ) : (
                                                    <NoQuestions
                                                        fromProfile={true}
                                                    />
                                                )
                                            ) : (
                                                ""
                                            )}
                                            {this.state.circle ===
                                            "answered" ? (
                                                posts.length > 0 ? (
                                                    posts
                                                        .reverse()
                                                        .map((item) =>
                                                            item.relativePostID !==
                                                            0 ? (
                                                                <QuestionCard
                                                                    key={
                                                                        item.postID
                                                                    }
                                                                    userID={
                                                                        this
                                                                            .props
                                                                            .userID
                                                                    }
                                                                    userData={
                                                                        this
                                                                            .props
                                                                            .userData
                                                                    }
                                                                    readyQuestion={
                                                                        this
                                                                            .props
                                                                            .readyQuestion
                                                                    }
                                                                    viewProfile={
                                                                        this
                                                                            .props
                                                                            .viewProfile
                                                                    }
                                                                    changeRoute={
                                                                        this
                                                                            .props
                                                                            .changeRoute
                                                                    }
                                                                    authorProfilePicture={
                                                                        item.authorProfilePicture
                                                                    }
                                                                    poster={
                                                                        item.author
                                                                    }
                                                                    authorID={
                                                                        item.authorID
                                                                    }
                                                                    title={
                                                                        item.title
                                                                    }
                                                                    question={
                                                                        item.text
                                                                    }
                                                                    code={
                                                                        item.code
                                                                    }
                                                                    postID={
                                                                        item.postID
                                                                    }
                                                                    language={
                                                                        item.language
                                                                    }
                                                                    number={
                                                                        item.score
                                                                    }
                                                                    replies={0}
                                                                />
                                                            ) : (
                                                                ""
                                                            )
                                                        )
                                                ) : (
                                                    <NoQuestions
                                                        fromProfile={true}
                                                    />
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </Stack>
                                    </Box>
                                    <Typography
                                        color="white"
                                        sx={{ fontSize: 16, mb: 1.5 }}
                                    >
                                        End of posts
                                    </Typography>
                                </Container>
                            </React.Fragment>
                            <div
                                style={{
                                    width: "30%",
                                    height: "100px",
                                }}
                            ></div>
                        </div>
                    </div>
                );
            }
        }
    }
}
