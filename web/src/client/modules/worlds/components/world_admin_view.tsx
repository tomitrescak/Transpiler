import React from 'react';

import TextEditor from '../../exercises/containers/tabbed_editor_container';
import { Segment, Header2, Header4, Dropdown, Button, Fields, Field, Input, DropdownItem, Tabs, Tab, Link } from 'semanticui-react';
import jss from '../../../configs/jss';

//////////////////////////////////////////////////////////////////////////////
// WorldAdminView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentActions {
  fileActions: IFileEditorActions;
  save(world: IWorldDAO): void;
}

export interface IComponentProps {
  world: IWorldDAO;
  context: IContext;
}

interface IProps extends IComponentProps, IComponentActions { }


let themedTile: IThemedTileDAO;
let index: number;

const css = jss({
  tilesContainer: {
    '& img': {
      width: '50px',
      height: '50px'
    }
  }
});

const WorldAdminView = ({ world, context, save, fileActions }: IProps) => {

  // for loop variables
  let tile: ITileDAO;
  let theme: IThemeDAO;
  let index: number;
  // let global: string;

  context.Utils.Ui.registerSaveListener(() => save(world));

  return (
    <Segment classes="form">
      <Header2 icon="world">{ world.name }</Header2>
      <Field text="world.name">
        <Input type="text"
          placeholder="world.name"
          defaultValue={ world.name } />
      </Field>
      {/* FILES */}
      <div style={{ height: 400, position: 'relative' }}>
        <TextEditor id={world._id}
          files={ world.files }
          fileActions={fileActions}
          classes="darkTabs"
           />
      </div>
      {/* TILES */}
      <Segment>
        <Header4 dividing icon="block layout" text="world.tiles" />
        <Fields>
          <Field width={3} text="tile.name" />
          <Field width={2} text="tile.stamp" />
          <Field width={6} text="tile.tags" />
          <Field width={4} text="tile.field" />
        </Fields>
        <For each="tile" of={world.tiles} index="index">
          <TileView key={index} tile={tile} context={context} />
        </For>
      </Segment>

      {/* THEMES */}
      <Header4 dividing icon="theme" text="world.themes" />

      <Tabs id="themes">
        <For each="theme" index="index" of={world.themes}>
          <Tab name={theme.name} title={theme.name} key={index}>
            <Field text="theme.name">
              <Input placeholder="theme.name" defaultValue={ theme.name } />
            </Field>
            <Fields>
              <Field width={3} text="theme.editorColor">
                <Input placeholder="theme.editorColor"
                  defaultValue={theme.worldOptions.editorColor} />
              </Field>
              <Field width={3} text="theme.lineColor">
                <Input placeholder="theme.lineColor"
                  defaultValue={theme.worldOptions.lineColor} />
              </Field>
              <Field width={3} text="theme.lineHighlightColor">
                <Input placeholder="theme.lineHighlightColor"
                  defaultValue={theme.worldOptions.lineHighlightColor} />
              </Field>
              <Field width={3} text="theme.lineWidth">
                <Input placeholder="theme.lineWidth"
                  defaultValue={theme.worldOptions.lineWidth.toString() } />
              </Field>
              <Field width={3} text="theme.spacing">
                <input placeholder="theme.spacing"
                  defaultValue={theme.worldOptions.spacing.toString() } />
              </Field>
              <Field width={1}>
                <label>&nbsp; </label>
                <Button icon="eyedropper" url="http://colourco.de" target="_blank" />
              </Field>
            </Fields>

            <Header4 dividing icon="grid layout" text="theme.tiles" />

            <div className={css.tilesContainer}>
              <For each="themedTile" of={theme.tiles} index="index">
                <ThemedTileView key={index} tile={themedTile} worldTiles={world.tiles} />
              </For>
            </div>

            <Header4 dividing icon="file outline" text="theme.images" />

            {/* <Uploads
                      formData={{ id: theme._id }}
                      images={theme.images}
                      saveable={world} /> */}
          </Tab>
        </For>
      </Tabs>

      {/* GLOBALS */}
      <Segment classes="level2">
        <Header4 dividing icon="cubes" text="world.globals" />

        <For each="global" index="index" of={world.globals}>
          <Fields key={index}>
            <Field width={15}>
              <Input type="text" placeholder="world.globalVariable" defaultValue={ global } />
            </Field>
            <Field width={15}>
              <Button color="red" icon="trash" />
            </Field>
          </Fields>
        </For>

        <Button labeled="left" icon="plus" color="primary" text="add" />
      </Segment>
    </Segment>

  );
}


//////////////////////////////////////////////////////////////////////////////
// TileView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface ITileViewProps {
  tile?: ITileDAO;
  key: any;
  context: IContext;
}

const TileView = ({tile, context}: ITileViewProps) => (
  <Fields>
    <Field width={3}>
      <Input placeholder="tile.name" defaultValue={ tile.name } />
    </Field>
    <Field width={2}>
      <Input type="text" placeholder="tile.stamp" defaultValue={ tile.stamp}  />
    </Field>
    <Field width={6}>
      <Input type="text" placeholder="tile.tags" defaultValue={tile.tags.join(",") } />
    </Field>
    <Field width={4}>
      <Input type="text"
        placeholder="tile.className"
        defaultValue={tile.className} />
    </Field>
    <Field width={1}>
      <div className="ui red icon button">
        <i className="icon trash" />
      </div>
    </Field>
  </Fields>
);

//////////////////////////////////////////////////////////////////////////////
// ThemesView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IThemesViewProps {
  theme: IThemeDAO;
  worldTiles: ITileDAO[];
  key: number;
}

interface IThemesViewState {
  bar: string;
}

//////////////////////////////////////////////////////////////////////////////
// ThemedTileView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IThemedTileViewProps {
  tile: IThemedTileDAO;
  worldTiles: ITileDAO[];
  key: any;
}

const ThemedTileView = ({tile, worldTiles}: IThemedTileViewProps) => (
  <div>
    <Fields>
      <Field width={1} style={{ paddingTop: 12 }}>
        <img src={ tile.url } alt="{ name }" />
      </Field>
      <Field width={4} text="theme.tile">
        <Dropdown id={'tt' + tile.tileId} activation="click" defaultText={tile.name}>
          <For each="tile" index="index" of={worldTiles}>
            <DropdownItem key={index} >{tile.name} </DropdownItem>
          </For>
        </Dropdown>
      </Field>
      <Field width={2} text="theme.scale">
        <Input type="number"
          step="0.01"
          placeholder="theme.scale"
          defaultValue={ tile.scale.toString() } />
      </Field>
      <Field width={8} text="theme.url">
        <Input type="text" step="0.01" placeholder="theme.url" defaultValue={ tile.url } />
      </Field>
      <Field width={1}>
        <Button color="red" icon="trash" />
      </Field>
    </Fields>

    <If condition={tile.animations && tile.animations.length}>
      <AnimationsView tile={ tile} />
    </If>
  </div>
);

//////////////////////////////////////////////////////////////////////////////
// AnimationsView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IAnimationsViewProps {
  tile: IThemedTileDAO;
  foo?: string;
}

let anim: IThemedTileAnimationDAO;

const AnimationsView = ({ tile }: IAnimationsViewProps) => (
  <Fields>
    <Field width={1} />
    <Field width={15}>
      <Header4 icon="video ouline" text="theme.animations" />
      <For each="anim" index="index" of={tile.animations}>
        <AnimationView key={index} animation={anim} />
      </For>
    </Field>
  </Fields>
);

//////////////////////////////////////////////////////////////////////////////
// AnimationView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IAnimationViewProps {
  animation: IThemedTileAnimationDAO;
  key: any;
}

let frame: string;
const AnimationView = ({ animation }: IAnimationViewProps) => (

  <Segment classes="level3" style={{ margin: '1rem 0rem' }}>
    <Fields>
      <Field width={14} text="animations.name">
        <Input placeholder="animation.name" defaultValue={ animation.name } />
      </Field>
      <Field width={2} label="&nbsp;">
        <Button color="primary" labeled="left" icon="file video outline" text="add" />
      </Field>
    </Fields>
    <Field text="animations.frames" />
    <For each="frame" index="index" of={animation.frames}>
      <FrameView key={index} frame={frame} />
    </For>
  </Segment>
);

//////////////////////////////////////////////////////////////////////////////
// FrameView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IFrameViewProps {
  frame: string;
}

const FrameView = ({ frame }: IFrameViewProps) => (
  <Fields>
    <Field width={15}>
      <Input placeholder="animation.name" defaultValue={frame} />
    </Field>
    <Field width={1}>
      <Button color="red" icon="trash" />
    </Field>
  </Fields>
);

export default WorldAdminView;
