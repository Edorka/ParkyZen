import React, { Component } from 'react';
import './App.css';
import {Account} from './account';
import SubscribeView from './views/subscribe.js';
import ChatView from './views/chat.js';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.account = new Account();
    this.state = {
      subscribed: false,
      values: [1,2,3].map( (i) => <a key={i}>{i}</a>)
    };
  }
  componentDidMount() {
    const app = this;
    const provider = this.account.getKey();
    provider.load()
        .then((key) => {
            app.openChat();    
        })
        .catch((notLoaded) => {
            app.openSubscribe();
        });
  }
  openSubscribe() {
    console.log('to subscribe');
    this.setState((state) => ({subscribed: false}));
  }
  openChat() {
    console.log('to chat');
    this.setState((state) => ({subscribed: true}));
  }
  render() {
    const app = this;
    const { classes } = this.props;
    return (
      <div className={classes.root} >
        <AppBar position="static" color="default"> 
            <Toolbar>
                <Typography variant="title" color="inherit">
                    ParkyZen
                </Typography>
            </Toolbar>
        </AppBar>
        { this.state.subscribed
            ? <ChatView 
                account={app.account} />
            : <SubscribeView 
                account={app.account} 
                onSubscribe={app.openChat} />
        }
      </div>
    );
  }
}

export default withStyles(styles)(App);
