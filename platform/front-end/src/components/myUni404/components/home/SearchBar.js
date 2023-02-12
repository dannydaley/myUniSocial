import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import SearchResults from "./SearchResults";
export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            newInput: "false",
            renderChild: true,
            results: [],
        };
        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    // when child component unmounts, set renderChild state to false
    handleChildUnmount() {
        this.setState({ renderChild: false });
    }

    StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: "#0d0d0d",
        "& .MuiInputBase-input": {
            padding: theme.spacing(1, 1, 1, 1),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: "100%",
            },
        },
    }));

    Search = styled("div")(({ theme }) => ({
        width: "100%",
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            margin: "0 auto",
            minWidth: "500px",
            maxWidth: "100%",
        },
    }));

    SearchIconWrapper = styled("div")(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }));

    // calls when seach input field is changed, applies field value to search input state and refreshes the view
    onInputChange = (event) => {
        this.setState({ searchInput: event.target.value, newInput: false });
        this.setState({ newInput: true, renderChild: true });
    };

    render() {
        return (
            <this.Search sx={{ margin: "0 auto", width: "500px" }}>
                <this.SearchIconWrapper>
                    <SearchIcon sx={{ color: "#0d0d0d" }} />
                </this.SearchIconWrapper>
                <this.StyledInputBase
                    onChange={this.onInputChange}
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                />
                {this.state.searchInput.length > 2 ? (
                    <SearchResults
                        changeRoute={this.props.changeRoute}
                        readyQuestion={this.props.readyQuestion}
                        searchInput={this.state.searchInput}
                        unmountMe={this.handleChildUnmount}
                    />
                ) : (
                    ""
                )}
            </this.Search>
        );
    }
}
