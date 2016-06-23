import React from "react";

import Universe from "../../../models/universe_model";
import BoardView from "../../board/components/board_view_model";
import classnames from "classnames";

//////////////////////////////////////////////////////////////////////////////
// ToolBox Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IToolBoxProps {
  worldId?: string;
}

interface IToolboxState {
  activeTool: string;
}

export default class ToolBox extends React.Component<IToolBoxProps, IToolboxState> {
  activeItem: any;

  constructor() {
    super();

    this.state = {
      activeTool: "edit"
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // HELPERS                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  toolItems(): IThemedTile[] {
    if (!this.props.worldId) {
      return null;
    }
    let world = Universe.getWorld(this.props.worldId);
    if (world) {
      if (!world.themes) {
        alert(mf("world.hasNoTheme", ""));
        return;
      }

      return world.themes[0].tiles;
    }
    return [];
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  selectTool(tool: string, e: React.SyntheticEvent) {
    BoardView.editTool = tool;

    this.setState({ activeTool: tool });
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    if (!this.toolItems()) {
      return <div></div>;
    }
    let tile: IThemedTile;
    let index: number;

    return (
      <div>
        <div className="ui vertical icon menu toolBox" style={{width: 65}}>
          <a className={classnames("item toolItem", { active: this.state.activeTool === "edit" }) } onClick={this.selectTool.bind(this, "edit") }>
            <i className="icon pointing up centered" style={{ marginTop: 10 }} />
          </a>
          <For each="tile" index="index" of={this.toolItems()}>
            <a key={index} className={classnames("item toolItem", { active: this.state.activeTool === tile.name }) } onClick={this.selectTool.bind(this, tile.name) }>
              <img className="ui image" src={ tile.url } alt={ tile.name } />
            </a>
          </For>
          <a className={classnames("item toolItem", { active: this.state.activeTool === "delete" }) } onClick={this.selectTool.bind(this, "delete") }>
            <i className="icon trash" />
          </a>
        </div>
      </div>
    );
  }
}
