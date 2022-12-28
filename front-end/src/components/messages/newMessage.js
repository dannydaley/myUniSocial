import React from 'react';
import TextField from '@mui/material/TextField';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';


export default class NewMessage extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
        'sender': this.props.loggedInUsername,
        'message': '',
        "recipient": '',
            
      }
  }

  componentDidMount = () => {
    if (this.props.chatUser1 === this.props.loggedInUsername) {
      this.setState({recipient: this.props.chatUser2})
    } else {
      this.setState({recipient: this.props.chatUser1})
    }
  }

  onMessageChange = (event) => {
    this.setState({message: event.target.value})        
  }

  onPostSubmit = async () => {    
    fetch(process.env.REACT_APP_SERVER + '/newMessage', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        chatId: this.props.chatId,
        sender: this.props.loggedInUsername,
        message: this.state.message,
        recipient: this.state.recipient,
        user1: this.props.chatUser1,
        user2: this.props.chatUser2
      })    
    })
    .then(data => {    
      if (data) {              
        this.props.getChat(this.props.loggedInUsername, this.props.chatId, null)
      } else {
        console.log(data)
      }
    })
  }

  render () {         
    return (
      <div style={{marginTop: '20px'}}>
        <Divider variant="middle" sx={{mt: 5}} />
        <label htmlFor="file-input">
            <ImageIcon fontSize="large" sx={{ mt: 3, fontSize: 70,  color: 'white', mr: 2}} />
        </label>
        <input id="file-input" type="file" name="file"  multiple hidden/>   
        <TextField
          style={{
            backgroundColor: 'white',
            opacity: '0.5',
            borderRadius: '5px',
            width: '50%',
            maxHeight: '200px'
          }}
          sx={{
            mt: 2,
            mr: 2
          }}
          id="filled-textarea"
          label="New message"              
          placeholder="I've got something to say!"
          multiline
          onChange={this.onMessageChange}                    
        />
        <LoadingButton                
          onClick={()=> this.onPostSubmit()}                
          endIcon={<SendIcon />}
          loadingPosition="end" 
          variant="contained"
          sx={{mb: 3}}
        >
          Send
        </LoadingButton>               
      </div>
    );
  }
}