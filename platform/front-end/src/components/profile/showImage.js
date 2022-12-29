import React from "react";

export default class ShowImage extends React.Component {  

    render() {
        const { image } = this.props
        return(
            <div style={{position: 'absolute', border: '2px solid blue', width: '1000px', height: '1000px'}}>
                <img
                alt="" 
                width="1000px"
                height="1000px"
                src={image}/>
            </div>
        )
    }
}