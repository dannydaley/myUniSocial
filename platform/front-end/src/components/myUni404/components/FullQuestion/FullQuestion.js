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
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default class FullQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentLoaded: false,
            replyData: [],
            deleted: false,
            anchorEl: false,
        };
    }

    options = ["delete question"];
    ITEM_HEIGHT = 48;
    open = () => this.setState({ anchorEl: !this.state.anchorEl });
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClose = (option) => {
        this.setState({ anchorEl: null });
        if (option === "delete question") {
            //FETCH IS A GET REQUEST BY DEFAULT, POINT IT TO THE ENDPOINT ON THE BACKEND
            fetch(process.env.REACT_APP_SERVER + "/posts/deletePost", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item: "question",
                    postId: this.props.postID,
                }),
            })
                //TURN THE RESPONSE INTO A JSON OBJECT
                .then((response) => response.json())
                .then((data) => {
                    if (data === "question removed") {
                        this.setState({ deleted: true });
                    }
                });
        }
    };

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
                    {this.props.loggedInUsername === this.props.authorID ? (
                        <>
                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={
                                    this.open ? "long-menu" : undefined
                                }
                                aria-expanded={this.open ? "true" : undefined}
                                aria-haspopup="true"
                                onClick={this.handleClick}
                                sx={{ marginLeft: "95%" }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                    "aria-labelledby": "long-button",
                                }}
                                anchorEl={this.state.anchorEl}
                                open={this.state.anchorEl}
                                onClose={this.handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: this.ITEM_HEIGHT * 4.5,
                                        width: "20ch",
                                    },
                                }}
                            >
                                {this.options.map((option) => (
                                    <MenuItem
                                        key={option}
                                        selected={option}
                                        onClick={() => this.handleClose(option)}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    ) : (
                        ""
                    )}
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
                        {this.props.loggedInUsername === this.props.authorID ? (
                            <>
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={
                                        this.open ? "long-menu" : undefined
                                    }
                                    aria-expanded={
                                        this.state.anchorEl ? "true" : undefined
                                    }
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                    sx={{ marginLeft: "95%" }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    MenuListProps={{
                                        "aria-labelledby": "long-button",
                                    }}
                                    anchorEl={this.state.anchorEl}
                                    open={this.state.anchorEl}
                                    onClose={this.handleClose}
                                    PaperProps={{
                                        style: {
                                            maxHeight: this.ITEM_HEIGHT * 4.5,
                                            width: "20ch",
                                        },
                                    }}
                                >
                                    {this.options.map((option) => (
                                        <MenuItem
                                            key={option}
                                            selected={option}
                                            onClick={() =>
                                                this.handleClose(option)
                                            }
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            ""
                        )}
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
                            {this.state.deleted ? (
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{ mb: 2 }}
                                >
                                    {"Question deleted"}
                                </Typography>
                            ) : (
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{ mb: 2 }}
                                >
                                    {this.props.title}
                                </Typography>
                            )}
                            {this.state.deleted ? (
                                <Typography
                                    variant="body2"
                                    sx={{ textAlign: "left" }}
                                >
                                    {"Question deleted"}
                                    {this.props.code.length > 0 ? (
                                        <CodeBlock
                                            codeString={this.props.code}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </Typography>
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{ textAlign: "left" }}
                                >
                                    {this.props.text}
                                    {this.props.code.length > 0 ? (
                                        <CodeBlock
                                            codeString={this.props.code}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </Typography>
                            )}
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
                                        loggedInUsername={
                                            this.props.loggedInUsername
                                        }
                                        postID={item.postID}
                                        authorID={item.authorID}
                                        author={item.author}
                                        text={item.text}
                                        code={item.code}
                                        score={item.score}
                                        language={item.language}
                                        authorProfilePicture={
                                            item.profilePicture
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
                        title={this.props.title}
                    />
                </div>
            );
        }
    }
}
