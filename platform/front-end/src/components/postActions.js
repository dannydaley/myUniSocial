import * as React from "react";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Button from "@mui/material/Button";

export default class PostActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginBottom: "10px",
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
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#f5c732",
                                mb: "50px",
                                "&:hover": { backgroundColor: "gray" },
                            }}
                            size="medium"
                            title="Commenting is not yet functional"
                        >
                            View / Add Comment
                        </Button>
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
                <div
                    style={{
                        width: "40vw",
                        height: "30px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                    }}
                >
                    <AddCommentIcon
                        style={{ marginRight: "10px", color: "white" }}
                        title="Post comment count placeholder"
                    />
                    <p
                        style={{ color: "#217cd8", fontWeight: "bold" }}
                        title="Post comment count placeholder"
                    >
                        123
                    </p>
                </div>
            </div>
        );
    }
}
