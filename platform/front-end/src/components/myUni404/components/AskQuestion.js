import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import CodeEditor from "./CodeEditor";

export default class AskQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorID: this.props.userID,
            author: this.props.userFirstName + " " + this.props.userLastName,
            title: "none",
            text: "",
            code: "",
            language: "none",
            category: "none",
            shortSubmit: false,
        };
    }

    // calls when title text field and applies to state
    onTitleChange = (event) => this.setState({ title: event.target.value });

    // calls when text field and applies to state
    onTextChange = (event) => this.setState({ text: event.target.value });

    // calls when code text field and applies to state
    onCodeChange = (event) => this.setState({ code: event.target.value });

    // calls when language field and applies to state
    onLanguageChange = (event) =>
        this.setState({ language: event.target.value });

    // calls when category field and applies to state
    onCatChange = (event) => this.setState({ category: event.target.value });

    //Function controls logging in and updates the session on success.
    submitQuestion = () => {
        // if question doesnt is less than 20 character, no category selected or no title
        // activate short submit state prompting user to add more information
        if (
            this.state.text.length < 20 ||
            this.state.category === "none" ||
            this.state.title === "none"
        ) {
            this.setState({ shortSubmit: true });
        } else {
            // send question data to server
            fetch(process.env.REACT_APP_SERVER + "/posts/postQuestion", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    authorID: this.state.authorID,
                    author: this.state.author,
                    title: this.state.title,
                    text: this.state.text,
                    code: this.state.code,
                    relativePostID: 0,
                    language: this.state.language,
                    category: this.state.category,
                    authorProfilePicture:
                        this.props.userData.userProfilePicture,
                }),
            })
                // turn response into a JSON object
                .then((response) => response.json())
                .then((data) => {
                    // if response returns success,
                    if (data.status === "success") {
                        // redirect to question page
                        window.location.replace("/question/" + data.id);
                    }
                });
        }
    };

    render() {
        return (
            <div style={{ margin: "10px" }}>
                <Card sx={{ minWidth: 275, pb: 2, margin: "0 auto" }}>
                    <form syle={{ margin: "0 auto" }}>
                        <CardContent>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "baseline",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundImage:
                                            "url(" +
                                            process.env.REACT_APP_SERVER +
                                            "/public/" +
                                            this.props.userData
                                                .userProfilePicture +
                                            ")",
                                        backgroundSize: "cover",
                                        minWidth: "60px",
                                        height: "60px",
                                        border: "1px solid gray",
                                        borderRadius: "50%",
                                    }}
                                    onClick={() =>
                                        this.props.viewProfile(
                                            this.props.authorID
                                        )
                                    }
                                ></div>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {this.props.userData.userFirstName}{" "}
                                    {this.props.userData.userLastName}
                                </Typography>
                            </div>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                    margin: "30px auto 10px",
                                    textAlign: "center",
                                }}
                            >
                                Ask a question
                            </Typography>
                            <Typography
                                variant="h7"
                                component="div"
                                sx={{ mb: 2 }}
                            >
                                Try to include as much detail as possible
                            </Typography>
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                <input
                                    onChange={this.onTitleChange}
                                    type="text"
                                    style={{
                                        height: "40px",
                                        margin: "0 auto 10px",
                                        width: "90%",
                                    }}
                                    placeholder="Write a title for your question"
                                />
                            </div>
                            <div
                                style={{
                                    minHeight: "200px",
                                    margin: "0 auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <textarea
                                    placeholder="Write the body of your question here"
                                    spellCheck="true"
                                    style={{
                                        width: "90%",
                                        minHeight: "200px",
                                        fontSize: "18pt",
                                        padding: "10px",
                                        margin: "0 auto 10px",
                                        maxWidth: "90%",
                                    }}
                                    onChange={this.onTextChange}
                                />
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{ mb: 2 }}
                                >
                                    Add any code relevant to your question
                                </Typography>
                                <CodeEditor onCodeChange={this.onCodeChange} />
                            </div>
                        </CardContent>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                marginBottom: "50px",
                            }}
                        >
                            <div>
                                <h3>Category</h3>
                                <select onChange={this.onCatChange}>
                                    <option>Please Select</option>
                                    <option value={"Web"}>Web</option>
                                    <option value={"GamDev"}>Game Dev</option>
                                    <option value={"SysOS"}>System/OS</option>
                                    <option value={"Robotics"}>Robotics</option>
                                </select>
                            </div>
                            <div>
                                <h3>Language</h3>
                                <select onChange={this.onLanguageChange}>
                                    <option>Please Select</option>
                                    <option value={"javascript"}>
                                        Javascript
                                    </option>
                                    <option value={"csharp"}>C#</option>
                                    <option value={"cpp"}>C++</option>
                                    <option value={"htmlbars"}>HTML</option>
                                </select>
                            </div>
                        </div>
                        {this.state.shortSubmit ? (
                            <div
                                style={{
                                    width: "400px",
                                    border: "2px solid red",
                                    margin: "0 auto",
                                    marginBottom: "20px",
                                }}
                            >
                                <h2>
                                    Your question is either missing a title, too
                                    short or no category is selected
                                </h2>
                            </div>
                        ) : (
                            ""
                        )}
                        <div style={{ padding: "0 20px", display: "flex" }}>
                            <Button
                                variant="contained"
                                onClick={this.submitQuestion}
                                style={{ margin: "0 auto" }}
                            >
                                Submit Question
                            </Button>
                        </div>
                    </form>
                </Card>
                <Divider sx={{ marginTop: "10px" }} />
            </div>
        );
    }
}
