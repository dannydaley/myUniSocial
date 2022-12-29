import * as React from 'react';
import { useState } from 'react';
import myUniSocial from "./../../src/logo.png";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import myCircleText from '../Images/myCircleText.svg'
import FalF from "./../assets/FalF.png";
import SearchBar from './SearchBar';
import ShowNotifications from './navBar/showNotifications';
import { Link } from "react-router-dom";
import ShowMessages from './navBar/showMessages';

 function NavBar({
   getNotifications,
    refuseFriendRequest,
    confirmFriendRequest,
    notifications,
    onRouteChange,
    alertNotifications,
    mailNotifications,
    loggedInUsername}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  var [showNotifications, showNotificationsToggle ]  = useState(false)
  var [showMessages, showMessagesToggle = () => ShowMessages = !showMessages ]  = useState(false)
 
  const handleProfileMenuOpen = (event) => { 
    showMessagesToggle(showMessages = false)
    showNotificationsToggle(showNotifications = false)
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

  const menuId = 'primary-search-account-menu';
  //DESKTOP MENU!!

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
      //  onClick={()=>onRouteChange('profile')}
       >
        <Link
          to="/"
          onClick={handleMenuClose}
          style={{textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold'
            }}>
              My Feed
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          to="/myProfile"
          onClick={handleMenuClose}
          style={{textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold'
            }}>
          My Profile
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          to="/myAccount"
          onClick={handleMenuClose}
          style={{textDecoration: 'none',
          color: 'black',
          fontWeight: 'bold'
          }}>
          My Account
        </Link>
       </MenuItem>
      <MenuItem
        style={{textDecoration: 'none',
          color: 'black'
        }}
       onClick={() => onRouteChange('signout')}
       >
         Sign Out
       </MenuItem>      
    </Menu>
  );  

  const mobileMenuId = 'primary-search-account-menu-mobile';
      //MOBILE MENU!!
  const renderMobileMenu = (
    <Menu
    anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={mailNotifications} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>     
      {/* <NotificationsButton alertNotifications={alertNotifications} notifications={notifications} /> */}
      Notifications 
      <MenuItem 
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
        <p 
        // onClick={()=>onRouteChange('profile')}
        ><Link to="/myProfile">My Profile</Link></p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Sign Out</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <nav>
    <Box sx={{ flexGrow: 1, justifyItems: "spaceBetween", backgroundColor: "#f5c732"}}>
          <AppBar position="fixed"
            sx={{ backgroundColor: "#f5c732"}}>      
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
            sx={{ display: { xs: 'none', sm: 'block' }, ml: 6 ,width: 250, mt: 1, ":hover": { cursor: 'pointer' } }}
            onClick={()=>onRouteChange('home')}
          >
            <Link to="/"
            onClick={() => {showMessagesToggle(showMessages = false)
              showNotificationsToggle(showNotifications = false)}}>
                 <img alt="" src={FalF} style={{ width: "45px" }} />
                 
              <img alt="" src={myUniSocial} height="50px" width="200px"/>
            </Link>
              </Typography>
              
          <Box sx={{ flexGrow: 0.6 }} />
          <SearchBar />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* Messages button */}
                <IconButton
                  sx={{ color: "#0d0d0d" }} 
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => {
                showMessagesToggle(showMessages = !showMessages)
                showNotificationsToggle(showMessages = false)}}>
        	    <Badge badgeContent={mailNotifications} color="error">
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
              showNotificationsToggle(showNotifications = !showNotifications)
              showMessagesToggle(showMessages = false)}}>
              <Badge badgeContent={alertNotifications} color="error">
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
              color="inherit">
              <AccountCircle sx={{ color: "#0d0d0d" }} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
    {showNotifications===true ?
      <ShowNotifications
        loggedInUsername={loggedInUsername}
        notifications={notifications}
        confirmFriendRequest={confirmFriendRequest}
        refuseFriendRequest={refuseFriendRequest}
        getNotifications={getNotifications}
        logged/>
      : ''}
      {showMessages===true ?
      <ShowMessages  showMessagesToggle={showMessagesToggle}/>
      : ''}
    </>
  );
}
export default NavBar