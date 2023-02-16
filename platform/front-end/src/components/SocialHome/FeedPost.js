import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PostActions from "../postActions";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useState } from "react";

export default function FeedPost(props) {
    const [expanded, expand] = useState("false");

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

    return (
        <div
            style={{
                borderRadius: "10px",
                margin: "10px 0 10px",
                backgroundColor: "#292929",
                paddingRight: "10px",
            }}
        >
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
                    style={{ width: "80%", marginLeft: "5%" }}
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
                                      width={"200px"}
                                  />
                              ))
                            : ""}
                    </div>
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
                </div>
            </CardContent>
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
