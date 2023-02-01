import { Divider, Typography } from "@mui/material";
import React from "react";
import FriendRequest from "./friendRequest";
import ReactionNotification from "./reactionNotification";

export default class ShowNotifications extends React.Component {
    clearSingleNotification = (actionId) => {
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(
            process.env.REACT_APP_SERVER +
                "/notifications/clearSingleNotification",
            {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    actionId: actionId,
                }),
            }
        )
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then((data) => {
                this.props.getNotifications();
            });
    };
    clearNotifications = () => {
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(
            process.env.REACT_APP_SERVER + "/notifications/clearNotifications",
            {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: this.props.loggedInUsername,
                }),
            }
        )
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then((data) =>
                data === "success" ? this.props.getNotifications() : ""
            );
    };

    render() {
        const {
            notifications,
            confirmFriendRequest,
            refuseFriendRequest,
            getNotifications,
        } = this.props;
        return (
            <div
                style={{
                    zIndex: "3",
                    padding: "0 10px",
                    backgroundColor: "white",
                    marginTop: "0px",
                    paddingTop: "20px",
                    position: "fixed",
                    right: "0",
                    borderRadius: "5px",
                    boxShadow: "0px 2px 10px 0px grey",
                    width: "300px",
                }}
            >
                {notifications.map((item) => {
                    if (item.type === "friendRequest") {
                        return (
                            <FriendRequest
                                key={item.actionId}
                                actionId={item.actionId}
                                seen={item.seen}
                                firstName={item.firstName}
                                lastName={item.lastName}
                                senderUsername={item.sender}
                                loggedInUser={item.recipient}
                                message={item.message}
                                confirmFriendRequest={confirmFriendRequest}
                                refuseFriendRequest={refuseFriendRequest}
                                getNotifications={getNotifications}
                            />
                        );
                    } else {
                        return (
                            <ReactionNotification
                                key={item.actionId}
                                actionId={item.actionId}
                                seen={item.seen}
                                firstName={item.firstName}
                                lastName={item.lastName}
                                senderUsername={item.sender}
                                loggedInUser={item.recipient}
                                message={item.message}
                                relativePost={item.relativePost}
                                recipientUsername={item.recipient}
                                clearSingleNotification={
                                    this.clearSingleNotification
                                }
                            />
                        );
                    }
                })}
                <Divider sx={{ mt: 2 }} variant="middle" />
                {notifications.length >= 1 ? (
                    <Typography
                        variant="h7"
                        noWrap
                        sx={{
                            color: "#217cd8",
                            marginLeft: "5px",
                            ":hover": { cursor: "pointer" },
                        }}
                        onClick={() => this.clearNotifications()}
                    >
                        Clear all seen
                    </Typography>
                ) : (
                    ""
                )}
                <Typography>end of notifications</Typography>
            </div>
        );
    }
}
