import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";

export default function Comment(props) {
    const {
        authorUsername,
        authorFirstName,
        authorLastName,
        profilePicture,
        content,
        postId,
    } = props;

    return (
        <div>
            <CardContent
                sx={{
                    display: "flex",
                    mb: 2,
                    width: "90%",
                    backgroundColor: "#333",
                    margin: "0 auto 2 auto",
                    borderRadius: "10px",
                }}
            >
                <Link to={`/${authorUsername}`}>
                    <div
                        style={{
                            backgroundImage:
                                "url(" +
                                process.env.REACT_APP_SERVER +
                                "/public/" +
                                profilePicture +
                                ")",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            minWidth: "10px",
                            minHeight: "10px",
                            marginBottom: "50px",
                            border: "1px solid gray",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            ":hover": { cursor: "pointer" },
                        }}
                    ></div>
                </Link>
                <div
                    style={{ width: "80%", marginLeft: "5%" }}
                    id={"postId=$" + postId}
                >
                    <Link
                        to={`/${authorUsername}`}
                        style={{ textDecoration: "none" }}
                    >
                        <Typography
                            variant="h8"
                            component="div"
                            color="white"
                            sx={{
                                textAlign: "left",
                                ml: -2,
                                mb: 2,
                                fontWeight: "bold",
                            }}
                        >
                            {authorFirstName} {authorLastName}
                        </Typography>
                    </Link>
                    <Typography
                        sx={{
                            mb: 1.5,
                            overflowX: "hidden",
                            color: "white",
                            fontSize: 12,
                            textAlign: "left",
                        }}
                    >
                        {content}
                    </Typography>
                </div>
            </CardContent>

            <Divider variant="middle" />
        </div>
    );
}
