import { Divider } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default class ShowMessages extends React.Component {
    render() {
        const { showMessagesToggle } = this.props;
        return (
            <div
                style={{
                    zIndex: "3",
                    padding: "10px 10px 0px",
                    backgroundColor: "white",
                    marginTop: "0px",
                    position: "fixed",
                    right: "0",
                    borderRadius: "5px",
                    boxShadow: "0px 2px 10px 0px grey",
                    width: "300px",
                }}
            >
                <Divider sx={{ mt: 0 }} variant="middle" />
                <Link to="/messages" onClick={() => showMessagesToggle()}>
                    <h4 style={{ color: "#217cd8" }}>Go to messages</h4>
                </Link>
            </div>
        );
    }
}
