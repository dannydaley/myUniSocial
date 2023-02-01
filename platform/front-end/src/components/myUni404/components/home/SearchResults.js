import React from "react";
import { Typography } from "@mui/material";

export default class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataIsLoaded: "false",
            results: [],
        };
    }

    componentDidMount = () => {
        fetch(process.env.REACT_APP_SERVER + "/search", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                search: this.props.searchInput,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    this.setState({
                        results: data.results,
                        dataIsLoaded: true,
                    });
                }
            });
    };

    goToQuestion = (
        authorProfilePicture,
        title,
        author,
        question,
        code,
        postID,
        language,
        authorID
    ) => {
        this.props.readyQuestion(
            authorProfilePicture,
            title,
            author,
            question,
            code,
            postID,
            language,
            authorID
        );
        this.props.changeRoute("question");
    };

    render() {
        if (this.state.dataIsLoaded && this.state.results.length > 0) {
            return (
                <>
                    <div
                        style={{
                            height: "1000vh",
                            width: "1000vw",
                            position: "absolute",
                            overflow: "hidden",
                            marginLeft: "-140%",
                            zIndex: "10",
                        }}
                    ></div>
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#292929",
                            zIndex: "1000",
                            position: "absolute",
                            display: "flex",
                            color: "black",
                            justifyContent: "center",
                            flexDirection: "column",
                            borderRadius: "0 0 20px 20px",
                            boxShadow: "-1px 3px 5px 0px black",
                        }}
                    >
                        {this.state.results.map((item) => (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundImage:
                                            "url(" +
                                            process.env.REACT_APP_SERVER +
                                            "/public/" +
                                            item.authorProfilePicture +
                                            ")",
                                        backgroundSize: "cover",
                                        minWidth: "50px",
                                        height: "50px",

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
                                    variant="h7"
                                    sx={{
                                        maxWidth: "400px",
                                        marginLeft: "10px",
                                        color: "white",
                                        ":hover": {
                                            textDecoration: "underline",
                                        },
                                        fontWeight: "bold",
                                    }}
                                    onClick={() =>
                                        this.goToQuestion(
                                            item.authorProfilePicture,
                                            item.title,
                                            item.poster,
                                            item.question,
                                            item.code,
                                            item.postID,
                                            item.language,
                                            item.authorID
                                        )
                                    }
                                >
                                    {item.title}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div
                        style={{
                            height: "55px",
                            width: "100%",
                            backgroundColor: "white",
                            zIndex: "1000",
                            position: "absolute",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "0 0 20px 20px",
                            boxShadow: "-1px 3px 5px 0px black",
                        }}
                    ></div>
                </>
            );
        }
    }
}
