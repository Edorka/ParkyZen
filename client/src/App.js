import React, { Component } from 'react';
import './App.css';
import {Account} from './account';
import SubscribeView from './views/subscribe';
import ChatView from './views/chat';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';


const styles = {
    root: {
        flexGrow: 1,
        display: 'flex',
        flexFlow: 'column',
    },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.account = new Account();
    this.state = {
      subscribed: false,
    };
  }
  componentDidMount() {
    const app = this;
    const keys = this.account.getKeys();
    const keysLoad = Promise.all([keys.cypher.load(), keys.signer.load()])
    keysLoad
        .then((key) => {
            app.openChat();    
        })
        .catch((notLoaded) => {
            app.openSubscribe();
        });
  }
  openSubscribe = () => {
    this.setState((state) => ({subscribed: false}));
  }
  openChat = () => {
    this.setState((state) => ({subscribed: true}));
  }
  render() {
    const app = this;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className="column">
            <div className="row">
                <AppBar position="static" color="default" style={{flex: 0}}> 
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            ParkyZen
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="row extended padded" >
            { this.state.subscribed
                ? <ChatView 
                    account={app.account} />
                : <SubscribeView 
                    account={app.account} 
                    onSubscribe={app.openChat} />
            }
            </div>
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
