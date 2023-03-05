import SignInForm from "../components/signIn/SignInForm";
import SignUpForm from "../components/signIn/SignUpForm";
import SignInLeft from "../components/signIn/SignInLeft";
import Divider from "@mui/material/Divider";
import React from "react";
import { Box } from "@material-ui/core";
import ResetPassword from "../components/signIn/ResetPassword";

export default class SignIn extends React.Component {
    render() {
        let { onRouteChange, route, updateSession } = this.props;

        if (route === "signin" || route === "signout") {
            return (
                <div style={{ backgroundColor: "#292929" }}>
                    <Box
                        sx={{
                            backgroundColor: "#292929",
                            display: "flex",
                            flexDirection: "row",
                            width: "100vw",
                            height: "97vh",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <SignInLeft />
                        </Box>
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "none",
                                    lg: "block",
                                },
                                height: "50%",
                            }}
                        />
                        <SignInForm
                            onRouteChange={onRouteChange}
                            updateSession={updateSession}
                        />
                    </Box>
                    <div
                        style={{
                            paddingTop: "5px",
                            backgroundColor: "#292929",
                        }}
                    >
                        <a
                            style={{
                                color: "white",
                                textDecoration: "none",
                                marginRight: "10px",
                            }}
                            href={
                                process.env.REACT_APP_SERVER +
                                "/public/privacy-policy.html"
                            }
                            rel="noreferrer"
                            target="_blank"
                        >
                            Privacy Policy
                        </a>
                        <a
                            style={{
                                color: "white",
                                textDecoration: "none",
                                marginLeft: "10px",
                            }}
                            href={
                                process.env.REACT_APP_SERVER +
                                "/public/cookie-policy.html"
                            }
                            rel="noreferrer"
                            target="_blank"
                        >
                            Cookie Policy
                        </a>
                    </div>
                </div>
            );
        } else if (route === "signup") {
            return (
                <div style={{ backgroundColor: "#292929" }}>
                    <Box
                        sx={{
                            backgroundColor: "#292929",
                            display: "flex",
                            flexDirection: "row",
                            width: "100vw",
                            height: "97vh",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <SignInLeft />
                        </Box>
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "none",
                                    lg: "block",
                                },
                                height: "50%",
                            }}
                        />
                        <SignUpForm onRouteChange={onRouteChange} />
                    </Box>
                    <div
                        style={{
                            paddingTop: "5px",
                            backgroundColor: "#292929",
                        }}
                    >
                        <a
                            style={{
                                color: "white",
                                textDecoration: "none",
                                marginRight: "10px",
                            }}
                            href={
                                process.env.REACT_APP_SERVER +
                                "/public/privacy-policy.html"
                            }
                            rel="noreferrer"
                            target="_blank"
                        >
                            Privacy Policy
                        </a>
                        <a
                            style={{
                                color: "white",
                                textDecoration: "none",
                                marginLeft: "10px",
                            }}
                            href={
                                process.env.REACT_APP_SERVER +
                                "/public/cookie-policy.html"
                            }
                            rel="noreferrer"
                            target="_blank"
                        >
                            Cookie Policy
                        </a>
                    </div>
                </div>
            );
        } else if (route === "resetPassword") {
            return (
                <div style={{ backgroundColor: "#292929" }}>
                    <Box
                        sx={{
                            backgroundColor: "#292929",
                            display: "flex",
                            flexDirection: "row",
                            width: "100vw",
                            height: "97vh",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <SignInLeft />
                        </Box>
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "none",
                                    lg: "block",
                                },
                                height: "50%",
                            }}
                        />
                        <ResetPassword onRouteChange={onRouteChange} />
                    </Box>
                    <div
                        style={{
                            paddingTop: "5px",
                            backgroundColor: "#292929",
                        }}
                    >
                        <a
                            style={{
                                color: "white",
                                textDecoration: "none",
                                marginRight: "10px",
                            }}
                            href={
                                process.env.REACT_APP_SERVER +
                                "/public/privacy-policy.html"
                            }
                            rel="noreferrer"
                            target="_blank"
                        >
                            Privacy Policy
                        </a>
                        <a
                            style={{
                                color: "white",
                                textDecoration: "none",
                                marginLeft: "10px",
                            }}
                            href={
                                process.env.REACT_APP_SERVER +
                                "/public/cookie-policy.html"
                            }
                            rel="noreferrer"
                            target="_blank"
                        >
                            Cookie Policy
                        </a>
                    </div>
                </div>
            );
        }
    }
}
