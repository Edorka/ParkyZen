import React, { Component } from 'react';
import Feed from './feed';
import Compose from './compose';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
    overflowX: 'hidden'
});


class ChatView extends Component {
  render() {
    const { classes } = this.props;
    return (
            <Grid container 
                className={classes.root}
                spacing={8} 
                alignItems="center"
                direction="column"
                justify="center">
                <Grid item xs={12} style={{overflow: 'auto'}}>
                    <Feed source={this.props.source} />
                </Grid>
                <Grid item xs={4}>
                    <Compose target={this.props.target} />
                </Grid>
            </Grid>
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
