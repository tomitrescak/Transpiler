import * as React from 'react';

export default class Modal extends React.Component<{}, {}> {
  render() {
    return (
      <div className="ui modal" id="previewModal" ref="modal">
        <i className="close icon" />
        <div className="header" id="previewModalHeader">
        </div>
        <div className="content" id="previewModalContent">
        </div>
      </div>
    );
  }
}
