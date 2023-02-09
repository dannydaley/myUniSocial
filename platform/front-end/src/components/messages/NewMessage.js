import React from "react";
import TextField from "@mui/material/TextField";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";

export default class NewMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sender: this.props.loggedInUsername,
            message: "",
            recipient: "",
            socket: "",
        };
    }

    // runs on startup
    componentDidMount = () => {
        // find out if recipient is chatUser1 or 2 ready for db posting
        if (this.props.chatUser1 === this.props.loggedInUsername) {
            this.setState({ recipient: this.props.chatUser2 });
        } else {
            this.setState({ recipient: this.props.chatUser1 });
        }
    };

    // update message state on input change
    onMessageChange = (event) => {
        this.setState({ message: event.target.value });
    };

    onPostSubmit = async (DOMID) => {
        // If message state has a positive value
        if (this.state.message) {
            // set message to new variable
            let messageContent = this.state.message;
            // clear the state to prevent spamming
            this.setState({ message: "" });
            // create message data object
            const messageData = {
                chatId: this.props.chatId,
                room: this.props.roomID,
                sender: this.props.loggedInUsername,
                recipient: this.state.recipient,
                message: messageContent,
                // create date formatting
                date:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };
            // emit the message through socket
            this.props.socket.emit("send_message", messageData);
            // call SetMessage (MessageFeed.js) to update chat
            this.props.SetMessage(messageData);
            // clear input field at parameter ID
            document.getElementById(DOMID).value = "";
            //post message to database
            fetch(process.env.REACT_APP_SERVER + "/messages/newMessage", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId: this.props.chatId,
                    sender: this.props.loggedInUsername,
                    message: messageContent,
                    recipient: this.state.recipient,
                    user1: this.props.chatUser1,
                    user2: this.props.chatUser2,
                }),
            });
        }
    };

    render() {
        return (
            <div style={{ marginTop: "20px" }}>
                <Divider variant="middle" sx={{ mt: 5 }} />
                <label htmlFor="file-input">
                    <ImageIcon
                        fontSize="large"
                        sx={{ mt: 3, fontSize: 70, color: "white", mr: 2 }}
                    />
                </label>
                <input
                    id="file-input"
                    type="file"
                    name="file"
                    multiple
                    hidden
                />
                <TextField
                    autoFocus={true}
                    style={{
                        backgroundColor: "white",
                        opacity: "0.5",
                        borderRadius: "5px",
                        width: "50%",
                        maxHeight: "200px",
                    }}
                    sx={{
                        mt: 2,
                        mr: 2,
                    }}
                    id="filled-textarea"
                    label="New message"
                    placeholder="I've got something to say!"
                    multiline
                    onChange={this.onMessageChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            this.onPostSubmit("filled-textarea");
                        }
                    }}
                />
                <LoadingButton
                    onClick={() => this.onPostSubmit("filled-textarea")}
                    endIcon={<SendIcon />}
                    loadingPosition="end"
                    variant="contained"
                    sx={{ mb: 3 }}
                >
                    Send
                </LoadingButton>
            </div>
        );
    }
}
