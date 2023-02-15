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
                <Box
                    sx={{
                        backgroundColor: "#292929",
                        display: "flex",
                        flexDirection: "row",
                        width: "100vw",
                        height: "100vh",
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
                            display: { xs: "none", md: "none", lg: "block" },
                            height: "50%",
                        }}
                    />
                    <SignInForm
                        onRouteChange={onRouteChange}
                        updateSession={updateSession}
                    />
                </Box>
            );
        } else if (route === "signup") {
            return (
                <Box
                    sx={{
                        backgroundColor: "#292929",
                        display: "flex",
                        flexDirection: "row",
                        width: "100vw",
                        height: "100vh",
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
                            display: { xs: "none", md: "none", lg: "block" },
                            height: "50%",
                        }}
                    />
                    <SignUpForm onRouteChange={onRouteChange} />
                </Box>
            );
        } else if (route === "resetPassword") {
            return (
                <Box
                    sx={{
                        backgroundColor: "#292929",
                        display: "flex",
                        flexDirection: "row",
                        width: "100vw",
                        height: "100vh",
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
                            display: { xs: "none", md: "none", lg: "block" },
                            height: "50%",
                        }}
                    />
                    <ResetPassword onRouteChange={onRouteChange} />
                </Box>
            );
        }
    }
}
