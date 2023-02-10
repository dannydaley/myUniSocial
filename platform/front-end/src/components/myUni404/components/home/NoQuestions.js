import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

export default class NoQuestions extends React.Component {
    goToQuestion = (title, author, question, code, postID, language) => {
        this.props.readyQuestion(
            title,
            author,
            question,
            code,
            postID,
            language
        );
        // updates the route to navigate site, applies parameter input to route state
        this.props.changeRoute("question");
    };
    render() {
        return (
            <div style={{ marginBottom: "10px", color: "white" }}>
                <Card
                    sx={{
                        minWidth: 275,
                        backgroundColor: "#292929",
                        padding: "50px",
                    }}
                >
                    <CardContent>
                        <div style={{ width: "80%", marginLeft: "auto" }}>
                            <Typography
                                variant="h5"
                                style={{ textAlign: "left", color: "white" }}
                                component="div"
                                onClick={() =>
                                    this.goToQuestion(
                                        this.props.title,
                                        this.props.poster,
                                        this.props.question,
                                        this.props.code,
                                        this.props.postID,
                                        this.props.language
                                    )
                                }
                            >
                                No questions yet :(
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "left", color: "white" }}
                            >
                                Try posting one!
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
                <Divider sx={{ marginTop: "10px" }} />
            </div>
        );
    }
}
