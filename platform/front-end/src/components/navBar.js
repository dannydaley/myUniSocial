import * as React from "react";
import { useState } from "react";
import myUniSocial from "../assets/myUniSocial.png";
import myUni404 from "../assets/myUni404small.png";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import FalF from "./../assets/FalF.png";
import SearchBar from "./SearchBar";
import ShowNotifications from "./navBar/showNotifications";
import { Link } from "react-router-dom";
import ShowMessages from "./navBar/showMessages";

function NavBar({
    platform,

    getNotifications,
    refuseFriendRequest,
    confirmFriendRequest,
    notifications,
    onRouteChange,
    alertNotifications,
    mailNotifications,
    loggedInUsername,
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    var [showNotifications, showNotificationsToggle] = useState(false);
    var [
        showMessages,
        showMessagesToggle = () => (ShowMessages = !showMessages),
    ] = useState(false);

    const handleProfileMenuOpen = (event) => {
        // showMessagesToggle((showMessages = false));
        // showNotificationsToggle((showNotifications = false));
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = "primary-search-account-menu";
    //DESKTOP MENU!!

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            sx={{ marginTop: "45px", zIndex: "0" }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>
                <Link
                    to="/"
                    onClick={handleMenuClose}
                    style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    My Feed
                </Link>
            </MenuItem>
            <MenuItem>
                <Link
                    to="/myProfile"
                    onClick={handleMenuClose}
                    style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    My Profile
                </Link>
            </MenuItem>
            <MenuItem>
                <Link
                    to="/myAccount"
                    onClick={handleMenuClose}
                    style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    My Account
                </Link>
            </MenuItem>
            <MenuItem
                style={{ textDecoration: "none", color: "black" }}
                onClick={() => onRouteChange("signout")}
            >
                Sign Out
            </MenuItem>
            <MenuItem
                style={{ textDecoration: "none", color: "black" }}
                onClick={() => onRouteChange("signoutAndDelete")}
            >
                Sign Out & Delete Data
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    //MOBILE MENU!!
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            // onClick={handleProfileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                >
                    <Badge badgeContent={mailNotifications} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <Link
                    to="/messages"
                    onClick={handleMenuClose}
                    style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: 16,
                        // fontWeight: "bold",
                    }}
                >
                    Messages
                </Link>
            </MenuItem>

            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                    <Link
                        to="/myProfile"
                        onClick={handleMenuClose}
                        style={{
                            textDecoration: "none",
                            color: "black",
                            fontSize: 16,
                            // fontWeight: "bold",
                        }}
                    >
                        My Profile
                    </Link>
                </IconButton>
            </MenuItem>
            <MenuItem>
                <Link
                    to="/myAccount"
                    onClick={handleMenuClose}
                    style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    My Account
                </Link>
            </MenuItem>
            <MenuItem
                style={{ textDecoration: "none", color: "black" }}
                onClick={() => onRouteChange("signout")}
            >
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                Sign Out
            </MenuItem>
            <MenuItem
                style={{ textDecoration: "none", color: "black" }}
                onClick={() => onRouteChange("signoutAndDelete")}
            >
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                Sign Out & Delete Data
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <nav>
                <Box
                    sx={{
                        flexGrow: 1,
                        // justifyItems: "spaceBetween",
                    }}
                >
                    <AppBar
                        position="sticky"
                        sx={{
                            backgroundColor: "#f5c732",
                            position: "fixed",
                            marginBottom: "50px",
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            >
                                {/* <MenuIcon /> */}
                            </IconButton>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{
                                    display: { xs: "none", sm: "block" },

                                    mt: 1,
                                    ":hover": { cursor: "pointer" },
                                }}
                                onClick={() => onRouteChange("home")}
                            >
                                {platform === "myUniSocial" ? (
                                    <Link
                                        to="/"
                                        onClick={() => {
                                            showMessagesToggle(
                                                (showMessages = false)
                                            );
                                            showNotificationsToggle(
                                                (showNotifications = false)
                                            );
                                        }}
                                    >
                                        <img
                                            alt=""
                                            src={FalF}
                                            style={{ width: "45px" }}
                                        />
                                        <img
                                            alt=""
                                            src={myUniSocial}
                                            // height="50px"
                                            width="150px"
                                        />
                                    </Link>
                                ) : (
                                    <Link
                                        to="/myuni404/feed/Web"
                                        onClick={() => {
                                            showMessagesToggle(
                                                (showMessages = false)
                                            );
                                            showNotificationsToggle(
                                                (showNotifications = false)
                                            );
                                        }}
                                    >
                                        <img
                                            alt=""
                                            src={FalF}
                                            style={{ width: "45px" }}
                                        />
                                        <img
                                            alt=""
                                            src={myUni404}
                                            // height="50px"
                                            width="150px"
                                        />
                                    </Link>
                                )}
                            </Typography>

                            <Box sx={{ flexGrow: 0.8 }} />
                            <SearchBar platform={platform} />
                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                                {/* Messages button */}
                                <IconButton
                                    sx={{ color: "#0d0d0d" }}
                                    size="large"
                                    aria-label="show 4 new mails"
                                    color="inherit"
                                    onClick={() => {
                                        showMessagesToggle(
                                            (showMessages = !showMessages)
                                        );
                                        showNotificationsToggle(
                                            (showMessages = false)
                                        );
                                    }}
                                >
                                    <Badge
                                        badgeContent={mailNotifications}
                                        color="error"
                                    >
                                        <MailIcon sx={{ color: "#0d0d0d" }} />
                                    </Badge>
                                </IconButton>
                                {/* Notifications button */}
                                <IconButton
                                    sx={{ color: "#0d0d0d" }}
                                    size="large"
                                    aria-label="show 17 new notifications"
                                    color="inherit"
                                    onClick={() => {
                                        showNotificationsToggle(
                                            (showNotifications =
                                                !showNotifications)
                                        );
                                        showMessagesToggle(
                                            (showMessages = false)
                                        );
                                    }}
                                >
                                    <Badge
                                        badgeContent={alertNotifications}
                                        color="error"
                                    >
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    sx={{ color: "#0d0d0d" }}
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle sx={{ color: "#0d0d0d" }} />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: { xs: "flex", md: "none" } }}>
                                <IconButton
                                    size="large"
                                    aria-label="show more"
                                    aria-controls={mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={handleMobileMenuOpen}
                                    color="inherit"
                                >
                                    <MoreIcon />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    {renderMobileMenu}
                    {renderMenu}
                </Box>
            </nav>
            {showNotifications === true ? (
                <ShowNotifications
                    loggedInUsername={loggedInUsername}
                    notifications={notifications}
                    confirmFriendRequest={confirmFriendRequest}
                    refuseFriendRequest={refuseFriendRequest}
                    getNotifications={getNotifications}
                    logged
                />
            ) : (
                ""
            )}
            {showMessages === true ? (
                <ShowMessages showMessagesToggle={showMessagesToggle} />
            ) : (
                ""
            )}
        </>
    );
}
export default NavBar;
