import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
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
        <div className="column extended">
            <div className="row">

                <TextField
                    id="new-plate"
                    label="Plate number"
                    margin="normal"
                    fullWidth={true}
                    value={this.state.plate}
                    onChange={this.plateChanged}
                />
            </div>
            <div className="row">
                <Button variant="raised" color="primary"
                    fullWidth={true}
                    onClick={this.handleClick} 
                    disabled={this.state.valid !== true} >
                  Subscribe
                </Button>        
            </div>
        </div>
    )
  }
}

export default SubscribeView;
