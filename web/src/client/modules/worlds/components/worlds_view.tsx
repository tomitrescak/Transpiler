import React from "react";
import { Segment, Header2, Items, Item } from 'semanticui-react';

//////////////////////////////////////////////////////////////////////////////
// WorldView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  worlds: IWorldDAO[];
  context: IContext;
}

let world: IWorldDAO;

const WorldView = ({ context, worlds }: IComponentProps) => (
  <Segment>
    <Header2 icon="world" text="worlds" />
    <Items>
      <For each="world" index="index" of={worlds}>
        <Item.Main key={world._id} link={`/admin/world/${context.Utils.Router.encodeUrlName(world.name)}/${world._id}`} header={world.name} />
      </For>
    </Items>
  </Segment>
);

export default WorldView;
