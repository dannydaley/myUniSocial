import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import PostActions from './postActions';
import { Link } from 'react-router-dom';

export default function FeedPost(props) {
    
    const { authorUsername, authorFirstName, authorLastName, profilePicture, images, content, postId, likes, dislikes, loggedInUsername } = props;


    return (
        <div>
            <CardContent sx={{display: 'flex', mb: 2}} >
                <Link to={`/${authorUsername}`}>
                    <img 
                    alt=""
                    src={
                        process.env.REACT_APP_SERVER + '/public/' + profilePicture
                        }
                        width="100px"
                        height="100px"
                        style={{ boxShadow: "1px 3px 5px 0px black", mb: 3 }}                        
                    />
                </Link>                     
                <div style={{width: '80%', marginLeft: '5%'}} id={"postId=$" + postId}>
                    <Link to={`/${authorUsername}`} style={{textDecoration: 'none'}}>
                        <Typography
                        variant="h5"
                        component="div"
                        color="white"
                        sx={{textAlign: 'left', ml: -2, mb: 2, fontWeight: 'bold'}}>                            
                            {authorFirstName} {authorLastName}
                        </Typography>
                    </Link>
                    <Typography sx={{ mb: 1.5 , overflowX: 'hidden', color:"white", fontSize: 16 , textAlign: 'left'}}>
                        {content}
                    </Typography>
                    <div style={{paddingBottom: '30px',display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    {images ? images.map(image => (                                                             
                                  /* RENDER THE COMPONENT WITH PROPS PASSED IN FROM THE SPECIFIC ITEM WERE CURRENTLY ON FOR EACH ITEM PASSED OVER BY THE .MAP */
                                    <img alt=""
                                    key={authorLastName + postId + image} src={process.env.REACT_APP_SERVER + '/public/' + image}
                                    width={"200px"}
                                     />                                     
                    )) : ''}
                    </div>
                    <PostActions
                        postId={postId}
                        likes={likes}
                        dislikes={dislikes}
                        loggedInUsername={loggedInUsername}
                        authorUsername={authorUsername}
                    />
                                </div>
            </CardContent>

            <Divider variant="middle" />
        </div>
    )
}