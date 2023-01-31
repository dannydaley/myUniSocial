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
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/setNotificationAsSeen", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                actionId: this.props.actionId,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json())
            .then((data) =>
                data === "success" ? this.setState({ seen: true }) : ""
            );
    };

    render() {
        const { firstName, message, senderUsername, clearSingleNotification } =
            this.props;
        if (!this.state.seen) {
            return (
                <Button
                    variant="contained"
                    style={{
                        width: "100%",
                        fontSize: "14px",
                        //  display: 'flex',
                        //  flexDirection: 'row', alignItems: 'center',
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
                        {firstName}
                    </Link>
                    <p
                        style={{
                            width: "60%",
                            lineBreak: "strict",
                            marginLeft: "0",
                        }}
                    >
                        {message}
                    </p>
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
                    <h4
                        style={{ color: "#217cd8", marginLeft: "5px" }}
                        onClick={() => this.setNotificationAsSeen()}
                    >
                        {message}
                    </h4>

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
