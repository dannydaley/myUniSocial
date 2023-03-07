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

    // function adds a 1 second delay
    delayFunction = async () => {
        await new Promise((res) => setTimeout(res, 1000));
    };

    //component did mount is built in and runs when the component mounts
    componentDidMount = async (newCircle) => {
        if (!newCircle) {
            newCircle = "general";
            this.setState({ dataIsLoaded: false, circle: newCircle });
            // get feed data from server
            fetch(process.env.REACT_APP_SERVER + "/profile/getFeedByUser", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    loggedInUsername: this.props.loggedInUsername,
                    userProfileToGet: this.props.userProfileToGet,
                    circle: newCircle,
                }),
            })
                //turn the response into a json object
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
            // get the users myUni404 question feed from the server
            fetch(process.env.REACT_APP_SERVER + "/feeds/getUserQuestionFeed", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: this.props.userProfileToGet,
                }),
            })
                //turn the response into a json object
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

    // calls when user switched view tab
    changeCircle = (newCircle) => {
        this.componentDidMount(newCircle);
    };

    render() {
        const {
            userProfileToGet,
            loggedInUsername,
            userFirstName,
            userLastName,
            userProfilePicture,
            userID,
            userData,
            readyQuestion,
            viewProfile,
            changeRoute,
        } = this.props;
        //setting up access to the state variables
        const { posts, dataIsLoaded, isFriendsWithLoggedInUser } = this.state;
        // if the data isnt loaded yet, load an alternative while we wait
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
                                    zIndex: 0,
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
                                    userFirstName={userFirstName}
                                    userLastName={userLastName}
                                    userProfilePicture={userProfilePicture}
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
                                        zIndex: 0,
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
                                        zIndex: 0,
                                        backgroundColor: "#333",
                                        borderRadius: "0px 0px 30px 30px",
                                        width: "100%",
                                        pb: 2,
                                    }}
                                >
                                    <NewPost
                                        recipient={userProfileToGet}
                                        loggedInUsername={loggedInUsername}
                                        userFirstName={userFirstName}
                                        userLastName={userLastName}
                                        userProfilePicture={userProfilePicture}
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
                                                              loggedInUsername
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
                                                                        userID
                                                                    }
                                                                    userData={
                                                                        userData
                                                                    }
                                                                    readyQuestion={
                                                                        readyQuestion
                                                                    }
                                                                    viewProfile={
                                                                        viewProfile
                                                                    }
                                                                    changeRoute={
                                                                        changeRoute
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
                                                                        userID
                                                                    }
                                                                    userData={
                                                                        userData
                                                                    }
                                                                    readyQuestion={
                                                                        readyQuestion
                                                                    }
                                                                    viewProfile={
                                                                        viewProfile
                                                                    }
                                                                    changeRoute={
                                                                        changeRoute
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
