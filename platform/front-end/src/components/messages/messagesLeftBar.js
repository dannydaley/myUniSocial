import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { Link } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";

export default class MessagesLeftBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatsAreLoaded: false,
            chats: [],
        };
    }

    componentDidMount = () => {
        this.setState({ chatsAreLoaded: false });
        fetch(process.env.REACT_APP_SERVER + "/messages/getAllUsersChats", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
            .then((data) => {
                this.setState({ chats: data, chatsAreLoaded: true });
            });
    };
    SwitchChat = (loggedInUsername, chatId) => {
        this.props.LeaveRoom();
        this.props.getChat(loggedInUsername, chatId);
    };

    render() {
        const { userProfilePicture, loggedInUsername, getChat } = this.props;
        const { chatsAreLoaded } = this.state;
        if (!chatsAreLoaded) {
            return (
                <div>
                    <React.Fragment>
                        <CssBaseline />
                        <Container
                            position="fixed"
                            maxWidth="sm"
                            sx={{
                                position: "fixed",
                                bgcolor: "#343434",
                                border: "",
                                height: "80vh",
                                width: 300,
                                ml: 2,
                                mr: 2,
                                mt: 16,
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}
                        >
                            <Box sx={{ padding: 2, bgcolor: "none" }}>
                                <Link to="/myProfile">
                                    <img
                                        alt=""
                                        src={
                                            process.env.REACT_APP_SERVER +
                                            "/public/" +
                                            userProfilePicture
                                        }
                                        width="200px"
                                        height="150px"
                                        sx={{ ":hover": { cursor: "pointer" } }}
                                        style={{
                                            boxShadow: "1px 3px 5px 0px black",
                                            mb: 3,
                                            hover: { cursor: "pointer" },
                                        }}
                                    />
                                </Link>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    color="white"
                                    sx={{ textAlign: "center", mt: 2 }}
                                >
                                    Chats
                                </Typography>
                                <CircularProgress sx={{ mt: 6 }} />
                                <Typography
                                    variant="h6"
                                    component="div"
                                    color="white"
                                    sx={{ textAlign: "center", mt: 2 }}
                                >
                                    Loading chats..
                                </Typography>
                            </Box>
                        </Container>
                    </React.Fragment>
                </div>
            );
        } else {
            return (
                <div>
                    <React.Fragment>
                        <CssBaseline />
                        <Container
                            position="fixed"
                            maxWidth="sm"
                            sx={{
                                position: "fixed",
                                bgcolor: "#343434",
                                border: "",
                                height: "80vh",
                                width: 300,
                                ml: 2,
                                mr: 2,
                                mt: 16,
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}
                        >
                            <Box sx={{ padding: 2, bgcolor: "none" }}>
                                <Link to="/myProfile">
                                    <img
                                        alt=""
                                        src={
                                            process.env.REACT_APP_SERVER +
                                            "/public/" +
                                            userProfilePicture
                                        }
                                        width="200px"
                                        height="150px"
                                        sx={{ ":hover": { cursor: "pointer" } }}
                                        style={{
                                            boxShadow: "1px 3px 5px 0px black",
                                            mb: 3,
                                            hover: { cursor: "pointer" },
                                        }}
                                        // onClick={()=>this.props.onRouteChange('profile')}
                                    />
                                </Link>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    color="white"
                                    sx={{ textAlign: "center", mt: 2 }}
                                >
                                    Chats
                                </Typography>
                                <Stack
                                    spacing={2}
                                    sx={{
                                        margin: "50px auto 0",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {this.state.chats.map((chat) =>
                                        (chat.user1 === loggedInUsername &&
                                            chat.seenByUser1) ||
                                        (chat.user2 === loggedInUsername &&
                                            chat.seenByUser2) ? (
                                            <Button
                                                variant="contained"
                                                key={chat.chatId}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    backgroundColor: "gray",
                                                    width: "270px",
                                                }}
                                                onClick={() =>
                                                    this.SwitchChat(
                                                        loggedInUsername,
                                                        chat.chatId
                                                    )
                                                }
                                            >
                                                <img
                                                    alt=""
                                                    src={
                                                        process.env
                                                            .REACT_APP_SERVER +
                                                        "/public/" +
                                                        chat.profilePicture
                                                    }
                                                    width="50px"
                                                    height="50px"
                                                    style={{
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                                {chat.firstName} {chat.lastName}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                key={chat.chatId}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    width: "270px",
                                                }}
                                                onClick={() =>
                                                    getChat(
                                                        loggedInUsername,
                                                        chat.chatId
                                                    )
                                                }
                                            >
                                                <img
                                                    alt=""
                                                    src={
                                                        process.env
                                                            .REACT_APP_SERVER +
                                                        "/public/" +
                                                        chat.profilePicture
                                                    }
                                                    width="50px"
                                                    height="50px"
                                                    style={{
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                                {chat.firstName} {chat.lastName}
                                            </Button>
                                        )
                                    )}
                                </Stack>
                            </Box>
                        </Container>
                    </React.Fragment>
                </div>
            );
        }
    }
}
