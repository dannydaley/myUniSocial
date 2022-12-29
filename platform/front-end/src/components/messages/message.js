import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function Message(props) {
    
const {
    chatId,
    messageId,    
    chatUser1,
    chatUser2,
    loggedInUsername, 
    userFirstName,
    userLastName,
    userProfilePicture,
    partnerFirstName,
    partnerLastName,
    partnerProfilePicture,
    message,
    messageSender,
    seenByUser1,
    seenByUser2 
        } = props; 

    let  partnerUsername = '';
    // get the partners username from chat where 
    // the name does not equal the logged in users
    if (chatUser1 !== loggedInUsername) {
        partnerUsername = chatUser1
    } else {
        partnerUsername = chatUser2
    }
        if(messageSender === loggedInUsername) {
            return (
                <div style={{display: 'flex', flexDirection: 'row', justifyContent:'right', width: '100%'}}>
                    <div style={{width: '50%', border: '2px solid #1a8afa', borderRadius: '10px', backgroundColor: '#217cd8 ',boxShadow: '0px 2px 10px 0px grey',}}>
                        <CardContent sx={{display: 'flex', mb: 2}} >
                            {(loggedInUsername === chatUser1) && (seenByUser1) === 0 ? props.setChatAsSeen(chatId) : ''}
                            {(loggedInUsername === chatUser2) && (seenByUser2) === 0 ? props.setChatAsSeen(chatId) : ''}
                            <Link to={`/${loggedInUsername}`}>
                                <img alt=""
                                src={
                                    process.env.REACT_APP_SERVER + '/public/' + userProfilePicture
                                    }
                                    width="100px"
                                    height="100px"
                                    style={{ boxShadow: "1px 3px 5px 0px black", mb: 3 }}                        
                                />
                            </Link>                     
                            <div style={{width: '80%', marginLeft: '5%'}} id={"postId=$" + messageId}>
                                <Link to={`/${loggedInUsername}`} style={{textDecoration: 'none'}}>
                                    <Typography
                                    variant="h5"
                                    component="div"
                                    color="white"
                                    sx={{textAlign: 'left', ml: -2, mb: 2, fontWeight: 'bold'}}>                            
                                        {userFirstName} {userLastName}
                                    </Typography>
                                </Link>
                                <Typography sx={{ mb: 1.5 , overflowX: 'hidden', color:"white", fontSize: 16 , textAlign: 'left'}}>
                                    {message}
                                </Typography>
                            </div>
                        </CardContent>            
                    </div>
                </div>
            )
        } else {
        return (
            <div style={{display: 'flex', flexDirection: 'row', justifyContent:'left', width: '100%'}}>
                <div style={{width: '50%', border: '2px solid #343434', borderRadius: '10px', backgroundColor: '#343434 ',boxShadow: '0px 2px 10px 0px grey'}}>
                    <CardContent sx={{display: 'flex', mb: 2}} >
                    {loggedInUsername === chatUser1 && seenByUser1 === false ? props.setChatAsSeen(chatId) : ''}
                            {loggedInUsername === chatUser2 && seenByUser2 === false ? props.setChatAsSeen(chatId) : ''}
                        <Link to={`/${partnerUsername}`}>
                            <img alt=""
                            src={
                                process.env.REACT_APP_SERVER + '/public/' + partnerProfilePicture
                                }
                                width="100px"
                                height="100px"
                                style={{ boxShadow: "1px 3px 5px 0px black", mb: 3 }}                        
                            />
                        </Link>                     
                        <div style={{width: '80%', marginLeft: '5%'}} id={"postId=$" + messageId}>
                            <Link to={`/${partnerUsername}`} style={{textDecoration: 'none'}}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    color="white"
                                    sx={{textAlign: 'left', ml: -2, mb: 2, fontWeight: 'bold'}}>                            
                                        {partnerFirstName} {partnerLastName}
                                </Typography>
                            </Link>
                            <Typography sx={{ mb: 1.5 , overflowX: 'hidden', color:"white", fontSize: 16 , textAlign: 'left'}}>
                                {message}
                            </Typography>
                        </div>
                    </CardContent>        
                </div>
            </div>
        )
    }
}