import React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import MessagesRight from "../components/messages/MessagesRight";
import MessagesLeft from "../components/messages/MessagesLeft";
import MessagesFeed from "../components/messages/MessageFeed";

export default class MessagesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: this.props.circle,
            chatId: null,
            partner: "",
            posts: [],
            chatSelected: false,
            chatData: [],
            chatFeed: [],
            dataIsLoaded: false,
            roomID: "",
            messageKey: 1,
        };
        //         this.this.bottomRef = React.createRef();
        this.chat = [];
    }

    SwitchChat = (loggedInUsername, chatId, partner) => {
        this.setState({ chatSelected: false });
        this.LeaveRoom();
        this.setState({
            chatId: chatId,
            partner: partner,
            chatSelected: true,
            messageKey: this.state.messageKey + 1,
        });
    };

    LeaveRoom = () => {
        this.props.socket.emit("leave_room", this.state.chatData.chatId);
    };

    componentWillUnmount = () => {
        this.LeaveRoom(this.state.chatData.chatId);
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
                this.setState({
                    dataIsLoaded: true,
                });
            });
    };
    autoScroll = (ref) => {
        if (!ref.current) return;
        ref.current.scrollIntoView();
    };

    // SetMessage = (messageData) => {
    //     // let chat = [...this.state.chatFeed, messageData];
    //     this.setState({
    //         dataIsLoaded: false,
    //     });
    //     this.chat.push(messageData);
    //     this.setState({
    //         dataIsLoaded: true,
    //     });
    //     this.autoScroll(this.bottomRef);
    // };

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
                        width: "225px",
                    }}
                >
                    <MessagesLeft
                        SwitchChat={this.SwitchChat}
                        LeaveRoom={this.LeaveRoom}
                        onRouteChange={onRouteChange}
                        userProfilePicture={userProfilePicture}
                        loggedInUsername={loggedInUsername}
                        getChat={this.getChat}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        paddingRight: { xs: "30px" },
                        margin: "0 auto",
                        marginTop: { xs: "-20px" },
                        paddingBottom: "50px",
                        minHeight: "100vh",
                    }}
                >
                    <MessagesFeed
                        key={this.state.messageKey}
                        partner={this.state.partner}
                        chatId={this.state.chatId}
                        chatSelected={this.state.chatSelected}
                        chat={this.chat}
                        chatData={this.state.chatData}
                        chatFeed={this.state.chatFeed}
                        socket={this.props.socket}
                        getNotifications={getNotifications}
                        circle={this.state.circle}
                        changeMailNotifications={this.changeMailNotifications}
                        onRouteChange={onRouteChange}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        loggedInUsername={loggedInUsername}
                        userProfilePicture={userProfilePicture}
                    />
                </Grid>
                <Grid
                    item
                    sx={{
                        display: { xs: "none", md: "block" },
                        width: "225px",
                    }}
                >
                    <MessagesRight
                        SwitchChat={this.SwitchChat}
                        LeaveRoom={this.LeaveRoom}
                        loggedInUsername={loggedInUsername}
                        getChat={this.getChat}
                        onRouteChange={onRouteChange}
                        userProfilePicture={userProfilePicture}
                    />
                </Grid>
            </Grid>
        );
    }
}
