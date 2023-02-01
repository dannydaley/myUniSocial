import * as React from "react";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Message from "./message";
import NewMessage from "./newMessage";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MessagesOverlay from "./messagesOverlay";

export default class MessageFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: this.props.circle,
            posts: [],
            chatSelected: false,
            chatData: [],
            chatFeed: [],
            dataIsLoaded: false,
        };
    }

    scrollToBottom = () => {
        document.getElementsByClassName("chatWindow")[0].scrollTop =
            document.getElementsByClassName("chatWindow")[0].scrollHeight;
    };

    //COMPONENT DID MOUNT IS BUILT IN AND RUNS WHEN THE COMPONENT MOUNTS
    getChat = async (loggedInUsername, chatId, partner) => {
        this.setState({ dataIsLoaded: false });
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        await fetch(process.env.REACT_APP_SERVER + "/messages/getChat", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: loggedInUsername,
                chatId: chatId,
                partner: partner,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    chatData: data.chatData,
                    chatFeed: data.messages,
                    dataIsLoaded: true,
                });
            });
    };

    setChatAsSeen = (chatId) => {
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/messages/setChatAsSeen", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: this.props.loggedInUsername,
                chatId: chatId,
                user1: this.state.chatData.user1,
                user2: this.state.chatData.user2,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then((data) => {
                if (data.messages) {
                    data.messages.forEach((message) =>
                        this.state.chatFeed.push(message)
                    );
                    this.setState({
                        chatData: data.chatData,
                        dataIsLoaded: true,
                    });
                } else {
                    this.setState({
                        chatData: data.chatData,
                        dataIsLoaded: true,
                    });
                }
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
        const { chatSelected, dataIsLoaded, chatData, chatFeed } = this.state;
        // IF THE DATA ISNT LOADED YET, LOAD AN ALTERNATIVE WHILE WE WAIT
        if (!chatSelected && !dataIsLoaded) {
            return (
                <div>
                    <MessagesOverlay
                        changeCircle={this.changeCircle}
                        userProfilePicture={userProfilePicture}
                        loggedInUsername={loggedInUsername}
                        getChat={this.getChat}
                    />
                    <div
                        style={{
                            backgroundColor: "#010101",
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "100px",
                            minHeight: "100vh",
                        }}
                    >
                        <div style={{ width: "30%", height: "100px" }}></div>
                        <React.Fragment>
                            <CssBaseline />
                            <Container
                                maxWidth="lg"
                                sx={{
                                    zIndex: 10,
                                    bgcolor: "#343434",
                                    borderRadius: "0px 0px 30px 30px",
                                    width: "100%",
                                    pb: 2,
                                    ml: 2,
                                    mr: 2,
                                    mt: 12,
                                }}
                            >
                                {/* <Box sx={{ padding: 2, bgcolor: 'none', display: 'flex', justifyContent: 'center', mt: 2}}>
                      <CircularProgress />                    
                  </Box> */}
                                <h1 style={{ color: "white" }}>
                                    Select a chat to start talking!
                                </h1>
                                <Divider
                                    variant="middle"
                                    sx={{ mt: 1.5, mb: 1.5 }}
                                />
                                {/* <Typography color="white" sx={{ fontSize: 16, mb: 1.5  }}>
                      Select a chat to start talking!
                  </Typography> */}
                            </Container>
                        </React.Fragment>
                        <div style={{ width: "30%", height: "100px" }}></div>
                    </div>
                </div>
            );
        } else if (chatSelected && !dataIsLoaded) {
            return (
                <div>
                    <MessagesOverlay
                        changeCircle={this.changeCircle}
                        userProfilePicture={userProfilePicture}
                        loggedInUsername={loggedInUsername}
                        getChat={this.getChat}
                    />
                    <div
                        style={{
                            backgroundColor: "#010101",
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "100px",
                            minHeight: "100vh",
                        }}
                    >
                        <div style={{ width: "30%", height: "100px" }}></div>
                        <React.Fragment>
                            <CssBaseline />
                            <Container
                                maxWidth="lg"
                                sx={{
                                    zIndex: 10,
                                    bgcolor: "#343434",
                                    borderRadius: "0px 0px 30px 30px",
                                    width: "100%",
                                    pb: 2,
                                    ml: 2,
                                    mr: 2,
                                    mt: 12,
                                }}
                            >
                                <CircularProgress sx={{ mt: 6 }} />
                                <h1 style={{ color: "white" }}>Loading chat</h1>
                                <Divider
                                    variant="middle"
                                    sx={{ mt: 1.5, mb: 1.5 }}
                                />
                            </Container>
                        </React.Fragment>
                        <div style={{ width: "30%", height: "100px" }}></div>
                    </div>
                </div>
            );
        } else {
            // OTHERWISE RUN THE GOOD STUFF
            return (
                <div>
                    <MessagesOverlay
                        changeCircle={this.changeCircle}
                        onRouteChange={onRouteChange}
                        userProfilePicture={userProfilePicture}
                        loggedInUsername={loggedInUsername}
                        getChat={this.getChat}
                    />
                    <div
                        style={{
                            backgroundColor: "#010101",
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "100px",
                            height: "1000px",
                            maxHeight: "1000px",
                        }}
                    >
                        <div style={{ width: "30%" }}></div>
                        <React.Fragment>
                            <CssBaseline />
                            <Container
                                maxWidth="lg"
                                sx={{
                                    zIndex: 2,
                                    bgcolor: "#343434",
                                    borderRadius: "0px 0px 30px 30px",
                                    width: "100%",
                                    pb: 2,
                                    ml: 2,
                                    mr: 2,
                                    mt: 12,
                                }}
                            >
                                <p>{this.feedPosts}</p>
                                <Box
                                    className="chatWindow"
                                    sx={{
                                        padding: 2,
                                        bgcolor: "gray",
                                        height: "80%",
                                        maxHeight: "600px",
                                        borderRadius: "0px 0px 30px 30px",
                                        overflowY: "scroll",
                                    }}
                                >
                                    <Stack
                                        spacing={2}
                                        sx={{
                                            width: "100%",
                                            margin: "50px auto 0",
                                        }}
                                        style={{ flexDirection: "column" }}
                                    >
                                        {/* .MAP IS OUR FOR EACH LOOP, 'ITEM' IS JUST WHAT WE CALL EACH ELEMENT IN THE LIST SO IS INTERCHANGEABLE */}
                                        {chatFeed.map((message) => (
                                            /* RENDER THE COMPONENT WITH PROPS PASSED IN FROM THE SPECIFIC ITEM WERE CURRENTLY ON FOR EACH ITEM PASSED OVER BY THE .MAP */
                                            <Message
                                                key={message.messageId}
                                                chatId={chatData.chatId}
                                                chatUser1={chatData.user1}
                                                chatUser2={chatData.user2}
                                                loggedInUsername={
                                                    loggedInUsername
                                                }
                                                userFirstName={userFirstName}
                                                userLastName={userLastName}
                                                userProfilePicture={
                                                    userProfilePicture
                                                }
                                                partnerFirstName={
                                                    chatData.firstName
                                                }
                                                partnerLastName={
                                                    chatData.lastName
                                                }
                                                partnerProfilePicture={
                                                    chatData.profilePicture
                                                }
                                                message={message.message}
                                                messageSender={message.sender}
                                                date={message.date}
                                                seenByUser1={
                                                    chatData.seenByUser1
                                                }
                                                seenByUser2={
                                                    chatData.seenByUser2
                                                }
                                                setChatAsSeen={
                                                    this.setChatAsSeen
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                                {this.state.chatData.chatId ? (
                                    <NewMessage
                                        chatId={chatData.chatId}
                                        chatUser1={chatData.user1}
                                        chatUser2={chatData.user2}
                                        userFirstName={userFirstName}
                                        userLastName={userLastName}
                                        loggedInUsername={loggedInUsername}
                                        getChat={this.getChat}
                                    />
                                ) : (
                                    ""
                                )}
                            </Container>
                        </React.Fragment>
                        <div style={{ width: "30%", height: "100px" }}></div>
                    </div>
                </div>
            );
        }
    }
}
