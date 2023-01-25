import * as React from "react";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FeedPost from "./feedPost";
import NewPost from "./newPost";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Overlay from "./overlay";

export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: props.circle,
            posts: [],
            dataIsLoaded: false,
            passedFirstLoad: false,
        };
    }

    // delay = (ms) => new Promise((res) => setTimeout(res, ms));

    // delayFunction = async () => {
    //     await this.delay(1000);
    // };

    // posts = [];
    // //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    // getFeed = async (newCircle) => {
    //     alert(newCircle);
    //     if (!newCircle || newCircle === undefined) {
    //         newCircle = "general";
    //     }
    //     this.setState({ dataIsLoaded: false, circle: newCircle });
    //     //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
    //     fetch(process.env.REACT_APP_SERVER + "/getFeedFriendsOnly", {
    //         method: "post",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             user: this.props.loggedInUsername,
    //             profilePicture: this.props.userProfilePicture,
    //             circle: newCircle,
    //         }),
    //     })
    //         //TURN THE RESPONSE INTO A JSON OBJECT
    //         .then((response) => response.json())
    //         .then(await this.delayFunction())
    //         // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
    //         .then((data) => {
    //             this.posts = data.posts;
    //             this.setState({
    //                 // circle: newCircle,
    //                 // posts: data.posts,
    //                 dataIsLoaded: true,
    //             });

    //             // this.props.getNotifications();
    //         });
    // };

    // componentDidMount() {
    //     // this.getFeed(this.props.circle);
    // }

    render() {
        const {
            onRouteChange,
            userFirstName,
            userLastName,
            loggedInUsername,
            userProfilePicture,
        } = this.props;
        //SETTING UP ACCESS TO THE STATE VARIABLES
        const { circle, posts, dataIsLoaded } = this.props;
        console.log(posts);
        // IF THE DATA ISNT LOADED YET, LOAD AN ALTERNATIVE WHILE WE WAIT
        if (!dataIsLoaded) {
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        padding: "20px",
                        zIndex: 2,
                        backgroundColor: "#292929",
                        borderRadius: "0px 0px 30px 30px",
                        width: "100%",
                        pb: 2,
                        ml: 2,
                        mr: 2,
                        mt: 5,
                    }}
                >
                    <NewPost
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        loggedInUsername={loggedInUsername}
                        circle={circle}
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
                    <Divider variant="middle" sx={{ mt: 1.5, mb: 1.5 }} />
                    <Typography color="white" sx={{ fontSize: 16, mb: 1.5 }}>
                        End of posts
                    </Typography>
                </Container>
            );
        } else {
            // OTHERWISE RUN THE GOOD STUFF
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        padding: "20px",
                        zIndex: 2,
                        backgroundColor: "#292929",
                        borderRadius: "0px 0px 30px 30px",
                        width: "100%",
                        pb: 2,
                        ml: 2,
                        mr: 2,
                        mt: 5,
                        minHeight: "100vh",
                    }}
                >
                    <h1 style={{ color: "white" }}>{this.state.circle}</h1>
                    <NewPost
                        circle={circle}
                        changeCircle={this.changeCircle}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        loggedInUsername={loggedInUsername}
                    />

                    <p>{this.feedPosts}</p>
                    <Box sx={{ padding: 2, bgcolor: "none" }}>
                        <Stack
                            spacing={2}
                            sx={{
                                width: "100%",
                                margin: "50px auto 0",
                            }}
                        >
                            {/* .MAP IS OUR FOR EACH LOOP, 'ITEM' IS JUST WHAT WE CALL EACH ELEMENT IN THE LIST SO IS INTERCHANGEABLE */}
                            {posts.map((item) => (
                                /* RENDER THE COMPONENT WITH PROPS PASSED IN FROM THE SPECIFIC ITEM WERE CURRENTLY ON FOR EACH ITEM PASSED OVER BY THE .MAP */
                                <FeedPost
                                    key={item.id}
                                    loggedInUsername={loggedInUsername}
                                    authorUsername={item.author}
                                    authorFirstName={item.firstName}
                                    authorLastName={item.lastName}
                                    content={item.content}
                                    profilePicture={item.profilePicture}
                                    images={item.images}
                                    postId={item.id}
                                    likes={item.likes}
                                    dislikes={item.dislikes}
                                    onRouteChange={onRouteChange}
                                />
                            ))}
                        </Stack>
                    </Box>
                    <Typography color="white" sx={{ fontSize: 16, mb: 1.5 }}>
                        End of posts
                    </Typography>
                </Container>
            );
        }
    }
}
