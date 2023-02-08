import * as React from "react";
import MessagesRightBar from "./messagesRightBar";
import MessagesLeftBar from "./messagesLeftBar";

export default class MessagesOverlay extends React.Component {
    render() {
        const { onRouteChange, userProfilePicture, loggedInUsername, getChat } =
            this.props;
        return (
            <div
                style={{
                    width: "100vw",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                }}
            >
                <MessagesRightBar
                    LeaveRoom={this.props.LeaveRoom}
                    loggedInUsername={loggedInUsername}
                    getChat={getChat}
                    onRouteChange={onRouteChange}
                    userProfilePicture={userProfilePicture}
                />
                <MessagesLeftBar
                    LeaveRoom={this.props.LeaveRoom}
                    onRouteChange={onRouteChange}
                    userProfilePicture={userProfilePicture}
                    loggedInUsername={loggedInUsername}
                    getChat={getChat}
                />
            </div>
        );
    }
}
