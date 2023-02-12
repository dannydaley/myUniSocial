import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

export default class ReactionNotification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seen: this.props.seen,
        };
    }

    setNotificationAsSeen = () => {
        // send request to server and set notification to seen at database
        if (!this.state.seen) {
            fetch(
                process.env.REACT_APP_SERVER +
                    "/notifications/setNotificationAsSeen",
                {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        actionId: this.props.actionId,
                    }),
                }
            )
                //turn the response into a json object
                .then((response) => response.json())
                // if response returns success, update seen state to true to update view
                .then((data) =>
                    data === "success" ? this.setState({ seen: true }) : ""
                );
        }
    };

    render() {
        const {
            firstName,
            lastName,
            message,
            senderUsername,
            clearSingleNotification,
        } = this.props;
        if (!this.state.seen) {
            return (
                <Button
                    variant="contained"
                    style={{
                        width: "100%",
                        fontSize: "14px",
                        lineBreak: "strict",
                    }}
                    onClick={() => this.setNotificationAsSeen()}
                >
                    <Link
                        style={{
                            width: "45%",
                            lineBreak: "strict",
                            textDecoration: "none",
                            marginRight: "0",
                        }}
                        to={`/${senderUsername}`}
                        onClick={this.setNotificationAsSeen}
                    >
                        {firstName} {lastName}
                    </Link>
                    <Link to={`/post/${this.props.relativePost}`}>
                        <p
                            style={{
                                width: "60%",
                                lineBreak: "strict",
                                marginLeft: "0",
                            }}
                        >
                            {message}
                        </p>
                    </Link>
                </Button>
            );
        } else {
            return (
                <Button
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Link
                        to={`/${senderUsername}`}
                        onClick={this.setNotificationAsSeen}
                    >
                        <h4 style={{ color: "#217cd8" }}>{firstName}</h4>
                    </Link>

                    <Link to={`/post/${this.props.relativePost}`}>
                        {" "}
                        <h4
                            style={{ color: "#217cd8", marginLeft: "5px" }}
                            onClick={() => this.setNotificationAsSeen()}
                        >
                            {message}
                        </h4>
                    </Link>
                    <Button
                        variant="outlined"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        onClick={() =>
                            clearSingleNotification(this.props.actionId)
                        }
                    >
                        Clear
                    </Button>
                </Button>
            );
        }
    }
}
