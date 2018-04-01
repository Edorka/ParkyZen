import React, { Component } from 'react';
import Feed from './feed';
import { MessageInput, MessageOutput } from '../../api';
import Compose from './compose';

class ChatView extends Component {
  constructor(props) {
    super(props);
    const account = this.props.account;
    this.income = new MessageInput(account);
    this.output = new MessageOutput(account);
  }
  render() {
    const chat = this;
    return (
        <div className="column" >
            <div className="row extended" style={{overflow: 'auto'}}>
                <Feed source={chat.income} />
            </div>
            <div className="row" >
                <Compose target={chat.output} />
            </div>
        </div>
        )
  }
  
}

export default ChatView;
