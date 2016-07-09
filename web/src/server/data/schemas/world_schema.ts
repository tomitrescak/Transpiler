import { Worlds } from '../../../lib/collections/collections';

const schema = `
  type ThemedTileAnimation {
    name: String
    frames: [String]
  }

  type ThemedTile {
    tileId: Int
    name: String
    url: String
    scale: Float
    animations: [ThemedTileAnimation]
  }

  type WorldOptions {
    editorColor: String
    lineColor: String
    lineWidth: Int
    lineHighlightColor: String
    spacing: Int
  }

  type Theme {
    _id: String
    name: String
    worldOptions: WorldOptions
    tiles: [ThemedTile]
  }

  type Tile {
    id: Int
    name: String
    tags: [String]
    zIndex: Int
    className: String
    stamp: String
  }

  type World {
    _id: String
    name: String
    globals: [String]
    tiles: [Tile]
    files: [TextFile]
    themes: [Theme]
    permissions: Permissions
  }
`;

const resolvers = {
  ThemedTile: {
    animations(themedTile: IThemedTileDAO) {
      return themedTile.animations;
    }
  },
  Theme: {
    worldOptions(theme: IThemeDAO) {
      return theme.worldOptions;
    },
    tiles(theme: IThemeDAO) {
      return theme.tiles;
    }
  },
  World: {
    tiles(world: IWorldDAO) {
      return world.tiles;
    },
    files(world: IWorldDAO) {
      return world.files;
    },
    themes(world: IWorldDAO) {
      return world.themes;
    },
    permissions(world: IWorldDAO) {
      return world.permissions;
    }
  }
};

const queryText = `
  worlds: [World]
`;

const queries = {
  worlds() {
    return Worlds.find().fetch();
  }
};

export default {
  schema,
  resolvers,
  queryText,
  queries
};
