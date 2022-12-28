import * as React from 'react';
import RightBar from "./rightBar";
import LeftBar from "./LeftBar";
            
export default class  Overlay extends React.Component {


    render () {
        const { onRouteChange, changeCircle, userProfilePicture, loggedInUsername } = this.props;
        return (
            <div style={{width: '100vw', display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>            
                <RightBar loggedInUsername={loggedInUsername} />                
                <LeftBar changeCircle={changeCircle} onRouteChange={onRouteChange} userProfilePicture={userProfilePicture} loggedInUsername={loggedInUsername}/>
            </div>

        )       
    }

}