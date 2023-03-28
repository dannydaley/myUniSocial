import * as React from "react";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Divider, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

export default class PostActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hideInput: true,
            commentContent: "",
            contentBorder: "50px",
            postId: this.props.postId,
            likes: this.props.likes,
            dislikes: this.props.dislikes,
            voted: false,
        };
    }

    likeAction = () => {
        if (!this.state.voted) {
            this.applyVote(1, 0);
            this.setState({ likes: this.state.likes + 1, voted: true });
        }
    };

    dislikeAction = () => {
        if (!this.state.voted) {
            this.applyVote(0, 1);
            this.setState({ dislikes: this.state.dislikes + 1, voted: true });
        }
    };

    onContentChange = (event) => {
        this.setState({ commentContent: event.target.value });
        if (event.target.value.length > 70) {
            this.setState({ contentBorder: "10px" });
        }
    };

    applyVote = (addLike, addDislike) => {
        //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
        fetch(process.env.REACT_APP_SERVER + "/posts/votePost", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: this.props.loggedInUsername,
                recipient: this.props.authorUsername,
                postId: this.props.postId,
                like: this.state.likes + addLike,
                dislike: this.state.dislikes + addDislike,
            }),
        })
            //TURN THE RESPONSE INTO A JSON OBJECT
            .then((response) => response.json());
        // WHAT WE DO WITH THE DATA WE RECEIVE (data => console.log(data)) SHOULD SHOW WHAT WE GET
    };

    onCommentSubmit = async (event) => {
        if (this.state.commentContent.length < 1) {
            return;
        }
        event.target.value = "";
        fetch(process.env.REACT_APP_SERVER + "/posts/newPost", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                relativePostId: this.props.postId,
                username: this.props.loggedInUsername,
                recipient: "none",
                postStrict: 0,
                postContent: this.state.commentContent,
                circle: this.props.circle,
            }),
        }).then((data) => {
            if (data.statusText === "OK") {
                this.props.changeCircle(this.props.circle);
            }
        });
    };

    render() {
        const { likes, dislikes } = this.state;
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Divider variant="middle" />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        // marginBottom: "10px",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            height: "30px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        {!this.state.voted ? (
                            <>
                                <ThumbDownIcon
                                    data-testid="thumb-down-button"
                                    style={{
                                        color: "white",
                                        marginRight: "5px",
                                    }}
                                    onClick={this.dislikeAction}
                                />
                                <p
                                    style={{
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {dislikes}
                                </p>
                            </>
                        ) : (
                            <>
                                <ThumbDownIcon
                                    style={{
                                        color: "#217cd8",
                                        marginRight: "5px",
                                    }}
                                />
                                <p style={{ color: "#217cd8" }}>{dislikes}</p>
                            </>
                        )}
                    </div>
                    <div style={{ width: "20vw" }}>
                        {this.state.hideInput ? (
                            <Typography
                                variant="h6"
                                component="div"
                                color="gray"
                                sx={{
                                    fontWeight: "bold",
                                    ":hover": { cursor: "pointer" },
                                    display: "inline-block",
                                }}
                                onClick={() =>
                                    this.setState({ hideInput: false })
                                }
                            >
                                Add Comment
                            </Typography>
                        ) : (
                            <TextField
                                data-testid="comment-field"
                                style={{
                                    backgroundColor: "white",
                                    opacity: "0.5",
                                    borderRadius: this.state.contentBorder,
                                    width: "100%",
                                }}
                                sx={{ mr: 2, p: 0 }}
                                size="small"
                                id="filled-textarea"
                                label="New comment"
                                placeholder="I've got something to say!"
                                multiline
                                onChange={this.onContentChange}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        this.onCommentSubmit(event);
                                    }
                                }}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            height: "30px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        {!this.state.voted ? (
                            <>
                                <ThumbUpIcon
                                    data-testid="thumb-up-button"
                                    style={{
                                        color: "white",
                                        marginRight: "5px",
                                    }}
                                    onClick={this.likeAction}
                                />
                                <p
                                    style={{
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {likes}
                                </p>
                            </>
                        ) : (
                            <>
                                <ThumbUpIcon
                                    style={{
                                        color: "#217cd8",
                                        marginRight: "5px",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#217cd8",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {likes}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
