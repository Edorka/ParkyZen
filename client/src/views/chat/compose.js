import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';


class Compose extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container 
                spacing={8} 
                alignItems="center"
                direction="column"
                justify="center">
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
              Subscribe
            </Button>        
            </Grid>
           )
    }
}

export default Compose;
