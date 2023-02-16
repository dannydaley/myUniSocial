import * as React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FeedPost from "./FeedPost";
import NewPost from "./NewPost";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: props.circle,
            posts: [],
            comments: [],
            dataIsLoaded: false,
            passedFirstLoad: false,
        };
    }
    componentDidMount = async () => {
        this.setState({ dataIsLoaded: false });
        await new Promise((res) => setTimeout(res, 2000));
        this.props.posts.forEach((post) => {
            post.comments = [];
            this.props.comments.forEach((comment) => {
                if (comment.relativePostId === post.id) {
                    post.comments.push(comment);
                }
            });
        });

        this.setState({ dataIsLoaded: true });
    };

    componentDidUpdate = () => {
        this.props.posts.forEach((post) => {
            post.comments = [];
            this.props.comments.forEach((comment) => {
                if (comment.relativePostId === post.id) {
                    post.comments.push(comment);
                }
            });
        });
    };

    render() {
        const {
            onRouteChange,
            userFirstName,
            userLastName,
            loggedInUsername,
            userProfilePicture,
        } = this.props;
        //SETTING UP ACCESS TO THE STATE VARIABLES
        const { circle, posts } = this.props;
        const { dataIsLoaded } = this.state;

        // IF THE DATA ISNT LOADED YET, LOAD AN ALTERNATIVE WHILE WE WAIT
        if (!dataIsLoaded) {
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        padding: "20px",
                        zIndex: 2,
                        // backgroundColor: "#292929",
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
                        Loading {this.props.circle}
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
                        padding: "0 20px 20px 20px",
                        zIndex: 2,
                        // backgroundColor: "#292929",
                        borderRadius: "0px 0px 30px 30px",
                        width: "100%",
                        pb: 2,
                        ml: 2,
                        mr: 2,
                        mt: 1,
                    }}
                >
                    <h1 style={{ color: "white" }}>{circle}</h1>
                    <NewPost
                        circle={circle}
                        changeCircle={this.props.changeCircle}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        loggedInUsername={loggedInUsername}
                    />
                    <Divider variant="middle" sx={{ mt: 3, mb: 3 }} />
                    <Box sx={{ padding: 0, bgcolor: "none" }}>
                        <Stack
                            spacing={2}
                            sx={{
                                width: "100%",
                                margin: "0 auto",
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
                                    comments={
                                        item.comments
                                            ? item.comments.reverse()
                                            : ""
                                    }
                                    changeCircle={this.props.changeCircle}
                                    circle={this.props.circle}
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
