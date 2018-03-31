import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


class Compose extends Component {
    render() {
        return (
            <div className="column">
                <TextField
                    fullWidth={true}
                    id="new-plate"
                    label="Plate number"
                    margin="normal"/>
                <TextField
                    fullWidth={true}
                    id="new-plate"
                    label="Message"
                    margin="normal"/>
                <Button variant="raised" color="primary" >
                  Send
                </Button>        
            </div>
           )
    }
}

export default Compose;
