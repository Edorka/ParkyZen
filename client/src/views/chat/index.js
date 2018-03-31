import React, { Component } from 'react';
import Feed from './feed';
import Compose from './compose';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
    root: {
        width: '100%'
    }
});


class ChatView extends Component {
  render() {
    return (
        <div className="column" >
            <div className="row extended" style={{overflow: 'auto'}}>
                <Feed source={this.props.source} />
            </div>
            <div className="row" >
                <Compose target={this.props.target} />
            </div>
        </div>
        )
  }
  load() {
    fetch('http://localhost:8080/blocks')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
}

export default withStyles(styles)(ChatView);
