import React, { Component } from 'react';
import MessageItem from './MessageItem';
import styled from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const MessagesContainer = styled.div`
  position: relative;
  max-width: 240px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-flow: column-reverse;
  padding-bottom: 160px;
`;

export class MessageList extends Component {
  render() {
    const { messages } = this.props;
    return (
        <MessagesContainer>
          <ReactCSSTransitionGroup
              transitionAppear={false}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={200}
              transitionName="fadeIn"
          >
            {messages && messages.length > 0 ? messages.map((item, key) =>
                <MessageItem item={item}
                             key={key}/>) : null}
          </ReactCSSTransitionGroup>
        </MessagesContainer>
    );
  }
}

MessageList.propTypes = {};
MessageList.defaultProps = {
  messages: []
};

export default MessageList;
