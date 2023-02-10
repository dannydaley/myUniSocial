import * as React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Message from "./Message";
import NewMessage from "./NewMessage";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

export default class MessageFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: this.props.circle,
            posts: [],
            chatSelected: this.props.chatSelected,
            chatData: this.props.chatData,
            dataIsLoaded: false,
            roomID: "",
        };

        // increments every message to provide unique key
        this.messageKey = 1;

        // create reference to allow auto scroll to bottom
        this.bottomRef = React.createRef();

        // empty chat array
        this.chat = [];

        // auto scrolling fucntion
        this.autoScroll = async (ref, smoothAuto) => {
            // wait half a second for component to render
            await new Promise((res) => setTimeout(res, 500));
            // if our reference point has loaded and isnt null
            if (!ref.current !== null && this.state.dataIsLoaded) {
                // scroll to reference point
                ref.current.scrollIntoView({
                    behavior: smoothAuto,
                    block: "end",
                });
            }
        };
    }

    // runs every send or receive message
    SetMessage = (messageData) => {
        // push incoming message data to chat array
        this.chat.push(messageData);
        // reapply the state to reload the chat windiw
        this.setState({
            dataIsLoaded: true,
        });
        // then scroll to the new bottom of window
        this.autoScroll(this.bottomRef, "smooth");
    };

    // runs when component mounts
    componentDidMount = async () => {
        // if there is a chat selected
        if (this.props.chatSelected) {
            // initiate loading screen
            this.setState({ dataIsLoaded: false });
            // get the chat by chatID coming in through props
            await fetch(process.env.REACT_APP_SERVER + "/messages/getChat", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: this.props.loggedInUsername,
                    chatId: this.props.chatId,
                    partner: this.props.partner,
                }),
            })
                //TURN THE RESPONSE INTO A JSON OBJECT
                .then((response) => response.json())
                .then((data) => {
                    // reverse the messages array so we can read new messages from the bottom
                    this.chat = data.messages.reverse();
                    // join a socket room using the chatID as room ID
                    this.props.socket.emit("join_room", data.chatData.chatId);
                    // apply chat data to the state and trigger dataIsLoaded to disable loading screen
                    this.setState({
                        chatData: data.chatData,
                        dataIsLoaded: true,
                    });
                });
            // when receive message socket event fires
            this.props.socket.on("receive_message", (data) => {
                // set Message to update feed with new message data
                this.SetMessage(data);
            });
            // auto scrtoll to bottom on initial load
            this.autoScroll(this.bottomRef, "auto");
        }
    };

    // leaves the socket room
    LeaveRoom = () => {
        this.props.socket.emit("leave_room", this.state.chatData.chatId);
    };

    // runs when component unmounts
    componentWillUnmount = () => {
        // leave the socket room when component unmounts
        this.LeaveRoom(this.state.chatData.chatId);
    };

    render() {
        const {
            userFirstName,
            userLastName,
            loggedInUsername,
            userProfilePicture,
        } = this.props;

        //SETTING UP ACCESS TO THE STATE VARIABLES
        const { chatSelected, dataIsLoaded, chatData } = this.state;
        if (!chatSelected && !dataIsLoaded) {
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        minHeight: "40vh",
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
                    <h1 ref={this.bottomRef} style={{ color: "white" }}>
                        Select a chat to start talking!
                    </h1>
                    <Divider variant="middle" sx={{ mt: 1.5, mb: 1.5 }} />
                </Container>
            );
        } else if (chatSelected && !dataIsLoaded) {
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        minHeight: "40vh",
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
                    <CircularProgress sx={{ mt: 6 }} />
                    <h1 ref={this.bottomRef} style={{ color: "white" }}>
                        Loading chat
                    </h1>
                    <Divider variant="middle" sx={{ mt: 1.5, mb: 1.5 }} />
                </Container>
            );
        } else if (this.props.chat) {
            // OTHERWISE RUN THE GOOD STUFF
            return (
                <Container
                    maxWidth="lg"
                    sx={{
                        minHeight: "20vh",

                        padding: "20px",
                        zIndex: 2,
                        backgroundColor: "#292929",
                        borderRadius: "0px 0px 30px 30px",
                        width: "100%",

                        ml: 2,
                        mr: 2,
                    }}
                >
                    <Box
                        className="chatWindow"
                        sx={{
                            padding: 2,
                            bgcolor: "gray",
                            height: "80%",
                            maxHeight: "600px",
                            borderRadius: "0px 0px 30px 30px",
                            overflowY: "scroll",
                            overflowX: "hidden",
                        }}
                    >
                        <div ref={this.bottomRef}>
                            {/* <p on={() => alert("loaded")}>hellooooo</p> */}
                            <Stack
                                spacing={2}
                                sx={{
                                    width: "100%",
                                    margin: "50px auto 0",
                                }}
                                style={{ flexDirection: "column" }}
                            >
                                {/* .MAP IS OUR FOR EACH LOOP, 'ITEM' IS JUST WHAT WE CALL EACH ELEMENT IN THE LIST SO IS INTERCHANGEABLE */}
                                {this.chat.map((message) => (
                                    /* RENDER THE COMPONENT WITH PROPS PASSED IN FROM THE SPECIFIC ITEM WERE CURRENTLY ON FOR EACH ITEM PASSED OVER BY THE .MAP */
                                    <Message
                                        key={this.messageKey++}
                                        chatId={chatData.chatId}
                                        chatUser1={chatData.user1}
                                        chatUser2={chatData.user2}
                                        loggedInUsername={loggedInUsername}
                                        userFirstName={userFirstName}
                                        userLastName={userLastName}
                                        userProfilePicture={userProfilePicture}
                                        partnerFirstName={chatData.firstName}
                                        partnerLastName={chatData.lastName}
                                        partnerProfilePicture={
                                            chatData.profilePicture
                                        }
                                        message={message.message}
                                        messageSender={message.sender}
                                        date={message.date}
                                        seenByUser1={chatData.seenByUser1}
                                        seenByUser2={chatData.seenByUser2}
                                        setChatAsSeen={this.setChatAsSeen}
                                    />
                                ))}{" "}
                            </Stack>
                        </div>
                    </Box>

                    {this.state.chatData.chatId ? (
                        <NewMessage
                            LeaveRoom={this.LeaveRoom}
                            SetMessage={this.SetMessage}
                            roomID={this.state.chatData.chatId}
                            socket={this.props.socket}
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
            );
        }
    }
}
