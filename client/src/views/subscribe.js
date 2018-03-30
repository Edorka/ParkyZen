import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import React, { Component } from 'react';


class SubscribeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        plate: '',
        valid: false
    };
  }
  handleClick = () => {
    console.log('trying to subscribe', this);
    const account = this.props.account;
    return account.subscribe(this.state.plate).then(this.props.onSubscribe);
  }
  plateChanged = (event) => {
    const plate = event.target.value;
    const valid = plate.length > 0;
    this.setState({
        plate,
        valid
    });
  }
  render() {
    return (
        <Grid container 
            spacing={24} 
            alignItems="center"
            direction="column"
            justify="center">
            <Grid item xs={12}>
                <TextField
                    id="new-plate"
                    label="Plate number"
                    margin="normal"
                    value={this.state.plate}
                    onChange={this.plateChanged}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="raised" color="primary"
                    onClick={this.handleClick} 
                    disabled={this.state.valid !== true} >
                  Subscribe
                </Button>        
            </Grid>
        </Grid>
    )
  }
}

export default SubscribeView;
