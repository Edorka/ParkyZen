import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        const source = this.props.source;
        source.feed(this.loads);
        source.start();
    }
    getInitialState() {
        console.log('imitial items', this);
        return {
            messages: []
        };
    }
    loads = (response) => {
        console.log('loaded items', response.items, this.state);
        const returnMaxIndex = (prev, current) => {
            return current.index > prev ? current.index: prev;
        }
        const maxIndex = response.items.reduce(returnMaxIndex, 0);
        this.props.source.setIndex(maxIndex);
        this.setState({
            messages: this.state.messages.concat(response.items)
        });
    }
    render() {
        const sectionId = "feed";
        const messages = this.state.messages;
        return (
            <div id="feed">    
            { 
            messages.length === 0 
                ? <h5 className="centered">No messages</h5>
                : <List style={{overflow: "auto"}}>
                    {messages.map(item => (
                        <ListItem key={`item-${item.index}`}>
                            <ListItemText primary={`Item ${item.message}`} />
                        </ListItem>
                    ))}
                  </List>
            }
            </div>    
          )
    }
}

export default Feed;
