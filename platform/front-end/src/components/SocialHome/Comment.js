import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function Comment(props) {
    const {
        authorUsername,
        authorFirstName,
        authorLastName,
        profilePicture,
        content,
        postId,
        loggedInUsername,
    } = props;

    const options = ["delete comment"];

    const ITEM_HEIGHT = 48;
    const [deleted, setDeleted] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (option) => {
        setAnchorEl(null);
        if (option === "delete comment") {
            //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
            fetch(process.env.REACT_APP_SERVER + "/posts/deletePost", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item: "comment",
                    userId: loggedInUsername,
                    postId: postId,
                }),
            })
                //TURN THE RESPONSE INTO A JSON OBJECT
                .then((response) => response.json())
                .then((data) => {
                    if (data === "comment removed") {
                        setDeleted(true);
                    }
                });
        }
    };

    return (
        <div>
            {" "}
            {authorUsername === loggedInUsername ? (
                <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{ marginLeft: "95%", marginBottom: "-30px" }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                            },
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option}
                                onClick={() => handleClose(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            ) : (
                ""
            )}
            <CardContent
                sx={{
                    display: "flex",
                    mb: 2,
                    width: "90%",
                    backgroundColor: "#333",
                    borderRadius: "10px",
                    minHeight: "10px",
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
                            backgroundSize: "cover",
                            minWidth: "10px",
                            minHeight: "10px",
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
                    {deleted ? (
                        <Typography
                            sx={{
                                overflowX: "hidden",
                                color: "gray",
                                fontSize: 12,
                                textAlign: "left",
                            }}
                        >
                            Comment deleted
                        </Typography>
                    ) : (
                        <Typography
                            sx={{
                                overflowX: "hidden",
                                color: "white",
                                fontSize: 12,
                                textAlign: "left",
                            }}
                        >
                            {content}
                        </Typography>
                    )}
                </div>
            </CardContent>
        </div>
    );
}
