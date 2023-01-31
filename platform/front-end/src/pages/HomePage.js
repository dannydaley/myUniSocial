import React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import HomeLeft from "../components/SocialHome/HomeLeft";
import Feed from "../components/SocialHome/Feed";
import HomeRight from "../components/SocialHome/HomeRight";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: "general",
            circleLoaded: true,
            posts: [],
            dataIsLoaded: false,
        };
    }

    delay = (ms) => new Promise((res) => setTimeout(res, ms));

    delayFunction = async () => {
        await this.delay(1000);
    };

    //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    getFeed = async (newCircle) => {
        if (!newCircle || newCircle === undefined) {
            newCircle = "general";
        }
        this.setState({ dataIsLoaded: false, circle: newCircle });
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/getFeedFriendsOnly", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
                profilePicture: this.props.userProfilePicture,
                circle: newCircle,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then(await this.delayFunction())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({
                    circle: newCircle,
                    posts: data.posts,
                    dataIsLoaded: true,
                });

                this.props.getNotifications();
            });
    };

    componentDidMount() {
        this.getFeed(this.state.circle);
    }
    // //CHANGE CIRCLE SHOULD BE REMOVED AND JUST CALL GET FEED INSTEAD, THIS IS AN UNNESSECARY MIDDLE MAN
    changeCircle = (newCircle) => {
        this.getFeed(newCircle);
    };

    render() {
        const {
            onRouteChange,
            userFirstName,
            userLastName,
            loggedInUsername,
            userProfilePicture,
            getNotifications,
        } = this.props;
        return (
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
                        changeCircle={this.changeCircle}
                        onRouteChange={onRouteChange}
                        userProfilePicture={userProfilePicture}
                        loggedInUsername={loggedInUsername}
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
                    <Feed
                        posts={this.state.posts}
                        circle={this.state.circle}
                        changeCircle={this.changeCircle}
                        getNotifications={getNotifications}
                        changeMailNotifications={this.changeMailNotifications}
                        onRouteChange={onRouteChange}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        loggedInUsername={loggedInUsername}
                        userProfilePicture={userProfilePicture}
                        dataIsLoaded={this.state.dataIsLoaded}
                    />
                </Grid>
                <Grid item sx={{ width: "225px" }}>
                    <HomeRight loggedInUsername={loggedInUsername} />
                </Grid>
            </Grid>
        );
    }
}
