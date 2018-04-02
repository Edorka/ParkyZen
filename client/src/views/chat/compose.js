import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


class Compose extends Component {
    constructor(props){
        super(props);
        this.target = props.target;
        this.state = {
            recipient: '',
            content: ''
        };
    }
    submit = (event) => {
        console.log(this, event);
        this.target.send(this.state.content, this.state.recipient)
            .then(console.log);
    }
    updateRecipient = (evt) => {
        this.setState({recipient: evt.target.value});
    }
    updateContent = (evt) => {
        this.setState({content: evt.target.value});
    }
    render() {
        return (
            <div className="column">
                <TextField
                    fullWidth={true}
                    id="recipient-plate"
                    value={this.state.recipient}
                    onChange={this.updateRecipient}
                    label="Plate number"
                    margin="normal"/>
                <TextField
                    fullWidth={true}
                    id="content"
                    value={this.state.content}
                    onChange={this.updateContent}
                    label="Message"
                    margin="normal"/>
                <Button onClick={this.submit}
                    variant="raised" color="primary" >
                  Send
                </Button>        
            </div>
           )
    }
}

export default Compose;
