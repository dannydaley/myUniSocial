import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
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
        if (this.props.platform === "myUniSocial") {
            fetch(process.env.REACT_APP_SERVER + "/search/search-users", {
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
        } else {
            fetch(process.env.REACT_APP_SERVER + "/search/search-questions", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
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
        }
    };

    render() {
        if (
            this.state.dataIsLoaded &&
            this.state.results.length > 0 &&
            this.props.platform === "myUniSocial"
        ) {
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
                        onClick={this.props.unmountMe}
                    ></div>
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "white",
                            // blueeeeee #217cd8
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
                            <Link
                                key={item.username}
                                to={`/${item.username}`}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                    marginBottom: "10px",
                                }}
                                onClick={() => this.props.deleteInput()}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        alt=""
                                        src={
                                            process.env.REACT_APP_SERVER +
                                            "/public/" +
                                            item.profilePicture
                                        }
                                        width="50px"
                                        height="50px"
                                        style={{
                                            boxShadow: "1px 3px 5px 0px black",
                                            mb: 3,
                                            marginLeft: "20%",
                                            marginRight: "10%",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            ":hover": {
                                                textDecoration: "underline",
                                            },
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {item.firstName} {item.lastName}
                                    </Typography>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            );
        } else if (
            this.state.dataIsLoaded &&
            this.state.results.length > 0 &&
            this.props.platform === "myUni404"
        ) {
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
                        {this.state.results.map((item) =>
                            item.title !== "reply" ? (
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
                                    <Link
                                        sx={{
                                            textDecoration: "none",
                                            margin: "0 auto",
                                        }}
                                        to={`/question/${item.postID}`}
                                    >
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
                                                this.props.deleteInput()
                                            }
                                        >
                                            {item.title}
                                        </Typography>
                                    </Link>
                                </div>
                            ) : (
                                ""
                            )
                        )}
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
                    >
                        <CircularProgress />
                    </div>
                </>
            );
        }
    }
}
