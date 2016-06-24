import React from "react";

//////////////////////////////////////////////////////////////////////////////
// DATA                                                                    //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  messages: IBoardMessage[]
}

export default class ConsoleViewMeteor extends React.Component<IComponentProps, {}> {

  render() {
    let message: IBoardMessage;

    return (
      <div>
        { this.props.messages.length === 0 ? "" :
          <div className="ui message consoleView">
              <div className="ui list">
                  <div className="item">
                      <b>Console</b>
                  </div>
                  <For each="message" index="index" of={this.props.messages}>
                    <div className="item">{ message.message }</div>
                  </For>
              </div>
          </div> }
      </div>
    );
  }
}
