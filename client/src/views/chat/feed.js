import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';


class Feed extends Component {
    constructor(props) {
        super(props);
        this.messages = [];   
    }
    render() {
        const sectionId = "feed";
        const messages = this.messages;
        return (
            <div id="feed">    
            { 
            messages.length === 0 
                ? <h5 className="centered">No messages</h5>
                : <List style={{overflow: "auto"}}>
                    {messages.map(item => (
                        <ListItem key={`item-${sectionId}-${item}`}>
                            <ListItemText primary={`Item ${item}`} />
                        </ListItem>
                    ))}
                  </List>
            }
            </div>    
          )
    }
}

export default Feed;
