import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import CodeBlock from "../CodeBlock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from "@mui/icons-material/Reply";
import CreateReply from "./CreateReply";
import Answer from "./Answer";
import { Link } from "react-router-dom";

export default class FullQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentLoaded: false,
            replyData: [],
        };
    }

    // calls when component mounts
    componentDidMount = async () => {
        // reset loading screen if is disabled when function runs
        this.setState({ contentLoaded: false });
        // fetch the questions replies from server
        fetch(process.env.REACT_APP_SERVER + "/feeds/getQuestionReplies", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postID: this.props.postID,
            }),
        })
            // turn response into JSON object
            .then((response) => response.json())
            // apply response data to state
            .then((data) => {
                this.setState({ replyData: data });
                this.setState({ contentLoaded: true });
            });
    };

    // refresh the question by re-calling mount function
    refreshQuestion = () => {
        this.componentDidMount();
    };

    render() {
        if (!this.state.contentLoaded) {
            return (
                <div style={{ margin: "20px 0" }}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "baseline",
                                }}
                            >
                                <Link
                                    to={`/${this.props.authorID}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        style={{
                                            backgroundImage:
                                                "url(" +
                                                process.env.REACT_APP_SERVER +
                                                "/public/" +
                                                this.props
                                                    .authorProfilePicture +
                                                ")",
                                            backgroundSize: "cover",
                                            minWidth: "60px",
                                            height: "60px",
                                            border: "1px solid gray",
                                            borderRadius: "50%",
                                        }}
                                    ></div>
                                </Link>
                                <Link
                                    to={`/${this.props.authorID}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Typography
                                        sx={{ fontSize: 18 }}
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        {this.props.author}
                                    </Typography>
                                </Link>
                                <CardActions sx={{ marginLeft: "auto" }}>
                                    <div
                                        style={{
                                            marginLeft: "auto",
                                            display: "flex",
                                            flexDirection: "row",
                                            verticalAlign: "center",
                                        }}
                                    >
                                        <VisibilityIcon
                                            sx={{ color: "gray" }}
                                        />
                                    </div>
                                    <ReplyIcon
                                        sx={{
                                            color: "gray",
                                            paddingLeft: "5px",
                                        }}
                                    />
                                    <Typography
                                        color="text.secondary"
                                        sx={{ paddingRight: "15px" }}
                                    >
                                        {this.state.replyData.length}
                                    </Typography>
                                </CardActions>
                            </div>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{ mb: 2 }}
                            >
                                {this.props.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "left" }}
                            >
                                {this.props.text}
                                {this.props.code.length > 0 ? (
                                    <CodeBlock codeString={this.props.code} />
                                ) : (
                                    ""
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Divider sx={{ marginTop: "10px" }} />
                    <CreateReply />
                </div>
            );
        } else if (this.state.contentLoaded) {
            return (
                <div style={{ margin: "20px 0" }}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "baseline",
                                }}
                            >
                                <Link
                                    to={`/${this.props.authorID}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        style={{
                                            backgroundImage:
                                                "url(" +
                                                process.env.REACT_APP_SERVER +
                                                "/public/" +
                                                this.props
                                                    .authorProfilePicture +
                                                ")",
                                            backgroundSize: "cover",
                                            minWidth: "60px",
                                            height: "60px",
                                            border: "1px solid gray",
                                            borderRadius: "50%",
                                        }}
                                    ></div>
                                </Link>
                                <Link
                                    to={`/${this.props.authorID}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Typography
                                        sx={{ fontSize: 18 }}
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        {this.props.author}
                                    </Typography>
                                </Link>
                                <CardActions sx={{ marginLeft: "auto" }}>
                                    <div
                                        style={{
                                            marginLeft: "auto",
                                            display: "flex",
                                            flexDirection: "row",
                                            verticalAlign: "center",
                                        }}
                                    ></div>
                                    <ReplyIcon
                                        sx={{
                                            color: "gray",
                                            paddingLeft: "5px",
                                        }}
                                    />
                                    <Typography
                                        color="text.secondary"
                                        sx={{ paddingRight: "15px" }}
                                    >
                                        {this.state.replyData.length}
                                    </Typography>
                                </CardActions>
                            </div>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{ mb: 2 }}
                            >
                                {this.props.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "left" }}
                            >
                                {this.props.text}
                                {this.props.code.length > 0 ? (
                                    <CodeBlock codeString={this.props.code} />
                                ) : (
                                    ""
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Divider sx={{ marginTop: "10px" }} />
                    {this.state.replyData.length > 0 ? (
                        <Card>
                            <Typography
                                sx={{
                                    fontSize: 18,
                                    textAlign: "center",
                                    margin: "20px auto 0",
                                }}
                                color="text.secondary"
                                gutterBottom
                            >
                                {this.state.replyData.length} answer
                                {this.state.replyData.length > 1 ? "s" : ""}
                            </Typography>
                            {this.state.replyData.map((item) => (
                                <>
                                    <Answer
                                        postID={item.postID}
                                        authorID={item.authorID}
                                        author={item.author}
                                        text={item.text}
                                        code={item.code}
                                        score={item.score}
                                        language={item.language}
                                        authorProfilePicture={
                                            item.authorProfilePicture
                                        }
                                    />
                                    <Divider />
                                </>
                            ))}
                        </Card>
                    ) : (
                        ""
                    )}
                    <CreateReply
                        loggedInUsername={this.props.loggedInUsername}
                        userProfilePicture={this.props.userProfilePicture}
                        refreshQuestion={this.refreshQuestion}
                        relativePostID={this.props.postID}
                        category={this.props.category}
                        language={this.props.language}
                        userData={this.props.userData}
                        userID={this.props.userID}
                        userFirstName={this.props.userFirstName}
                        userLastName={this.props.userLastName}
                        authorID={this.props.authorID}
                    />
                </div>
            );
        }
    }
}
