import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PostActions from "../postActions";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "@mui/material";

export default function FeedPost(props) {
    const [expanded, expand] = useState("false");
    const [deleted, setDeleted] = React.useState(false);
    const [showImage, setShowImage] = React.useState(false);
    const {
        authorUsername,
        authorFirstName,
        authorLastName,
        profilePicture,
        images,
        content,
        postId,
        likes,
        dislikes,
        loggedInUsername,
        comments,
        changeCircle,
        circle,
    } = props;

    const options = ["delete post"];
    const currentImage = React.useRef();
    const ITEM_HEIGHT = 48;

    const openImage = (image) => {
        currentImage.current = image;
        setShowImage(true);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (option) => {
        setAnchorEl(null);
        if (option === "delete post") {
            //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
            fetch(process.env.REACT_APP_SERVER + "/posts/deletePost", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item: "post",
                    userId: loggedInUsername,
                    postId: postId,
                }),
            })
                //TURN THE RESPONSE INTO A JSON OBJECT
                .then((response) => response.json())

                .then((data) => {
                    if (data === "post removed") {
                        setDeleted(true);
                    }
                });
        }
    };

    return (
        <div
            style={{
                borderRadius: "10px",
                margin: "10px 0 10px",
                backgroundColor: "#292929",
                paddingRight: "10px",
            }}
        >
            {authorUsername === loggedInUsername ? (
                <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{ marginLeft: "95%" }}
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
                            marginBottom: "50px",
                            border: "1px solid gray",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            ":hover": { cursor: "pointer" },
                        }}
                    ></div>
                </Link>

                <div
                    style={{
                        width: "80%",
                        marginLeft: "5%",
                    }}
                    id={"postId=$" + postId}
                >
                    <Link
                        to={`/${authorUsername}`}
                        style={{ textDecoration: "none" }}
                    >
                        <Typography
                            variant="h6"
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
                            Post deleted
                        </Typography>
                    ) : (
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
                    )}
                    <div
                        style={{
                            paddingBottom: "30px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                        }}
                    >
                        {images
                            ? images.map((image) => (
                                  /* RENDER THE COMPONENT WITH PROPS PASSED IN FROM THE SPECIFIC ITEM WERE CURRENTLY ON FOR EACH ITEM PASSED OVER BY THE .MAP */
                                  <img
                                      alt=""
                                      key={authorLastName + postId + image}
                                      src={
                                          process.env.REACT_APP_SERVER +
                                          "/public/" +
                                          image
                                      }
                                      onClick={() => openImage(image)}
                                      width={"200px"}
                                  />
                              ))
                            : ""}
                    </div>
                </div>
            </CardContent>
            {showImage ? (
                <>
                    <Box
                        sx={{
                            paddingTop: "50px",
                            position: "fixed",
                            top: 0,
                            display: { xs: "none", md: "block" },
                            left: 220,
                            height: "100vh",
                            width: "80vw",
                            backgroundColor: "rgba(0,0,0,0.8)",
                        }}
                        onClick={() => setShowImage(false)}
                    >
                        <img
                            alt=""
                            key={authorLastName + postId + currentImage.current}
                            src={
                                process.env.REACT_APP_SERVER +
                                "/public/" +
                                currentImage.current
                            }
                            style={{
                                margin: "auto",
                                marginTop: "125px",
                            }}
                            height="75%"
                        />
                        <CloseIcon
                            sx={{
                                color: "white",
                                size: "200px",
                                position: "fixed",
                                marginTop: "2%",
                                right: 300,
                                "&:hover": { cursor: "pointer" },
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            paddingTop: "50px",
                            position: "fixed",
                            top: 0,
                            display: {
                                xs: "block",
                                md: "none",
                                lg: "none",
                            },
                            left: 0,
                            height: "100vh",
                            width: "100vw",
                            backgroundColor: "rgba(0,0,0,0.8)",
                        }}
                        onClick={() => setShowImage(false)}
                    >
                        {" "}
                        <CloseIcon
                            sx={{
                                color: "white",

                                position: "fixed",
                                marginTop: "10%",
                                right: 3,
                                "&:hover": { cursor: "pointer" },
                            }}
                        />
                        <img
                            alt=""
                            key={authorLastName + postId + currentImage.current}
                            src={
                                process.env.REACT_APP_SERVER +
                                "/public/" +
                                currentImage.current
                            }
                            style={{
                                margin: "auto",
                                marginTop: "100px",
                            }}
                            width="95%"
                        />
                    </Box>
                </>
            ) : (
                ""
            )}
            {content ===
            "You do not have access to this post, add the author as a friend to view." ? (
                ""
            ) : (
                <PostActions
                    circle={circle}
                    postId={postId}
                    likes={likes}
                    dislikes={dislikes}
                    loggedInUsername={loggedInUsername}
                    authorUsername={authorUsername}
                    commentCount={comments ? comments.length : 0}
                    changeCircle={changeCircle}
                />
            )}
            {!props.comments || props.comments.length === 0 ? (
                ""
            ) : (
                <div>
                    <Typography
                        variant="h6"
                        component="div"
                        color="gray"
                        sx={{
                            marginLeft: "15%",
                            fontWeight: "bold",
                            ":hover": { cursor: "pointer" },
                            display: "inline-block",
                        }}
                        onClick={() => expand(!expanded)}
                    >
                        view/hide comments
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        color="gray"
                        sx={{
                            float: "right",

                            fontWeight: "bold",
                            ":hover": { cursor: "pointer" },
                            display: "inline-block",
                        }}
                        onClick={() => expand(!expanded)}
                    >
                        {props.comments !== undefined && props.comments.length
                            ? props.comments.length
                            : 0}{" "}
                        comments
                    </Typography>
                </div>
            )}
            <Divider variant="middle" sx={{ mb: 2 }} />
            <div style={{ marginLeft: "7%" }}>
                {!expanded ? (
                    props.comments ? (
                        comments.map((comment) =>
                            comment.content === content ? (
                                ""
                            ) : (
                                <Comment
                                    key={comment.id}
                                    loggedInUsername={loggedInUsername}
                                    authorUsername={comment.author}
                                    authorFirstName={comment.firstName}
                                    authorLastName={comment.lastName}
                                    content={comment.content}
                                    profilePicture={comment.profilePicture}
                                    images={comment.images}
                                    postId={comment.id}
                                    likes={comment.likes}
                                    dislikes={comment.dislikes}
                                    onRouteChange={props.onRouteChange}
                                    comments={comment.comments}
                                />
                            )
                        )
                    ) : (
                        ""
                    )
                ) : props.comments !== undefined && props.comments.length ? (
                    <Comment
                        key={props.comments[props.comments.length - 1].id}
                        loggedInUsername={loggedInUsername}
                        authorUsername={
                            props.comments[props.comments.length - 1].author
                        }
                        authorFirstName={
                            props.comments[props.comments.length - 1].firstName
                        }
                        authorLastName={
                            props.comments[props.comments.length - 1].lastName
                        }
                        content={
                            props.comments[props.comments.length - 1].content
                        }
                        profilePicture={
                            props.comments[props.comments.length - 1]
                                .profilePicture
                        }
                        images={
                            props.comments[props.comments.length - 1].images
                        }
                        postId={props.comments[props.comments.length - 1].id}
                        likes={props.comments[props.comments.length - 1].likes}
                        dislikes={
                            props.comments[props.comments.length - 1].dislikes
                        }
                        onRouteChange={props.onRouteChange}
                        comments={comments[props.comments.length - 1].comments}
                    />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
