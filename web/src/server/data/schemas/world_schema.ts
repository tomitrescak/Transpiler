import { ioSchema, modificationSchema } from 'meteor/tomi:apollo-mantra';
import { Worlds } from '../../../lib/collections/collections';

console.log(modificationSchema);

const schema = `
  ${ioSchema(`ThemedTileAnimation$Input {
    name: String
    frames: [String]
  }`)}

  ${ioSchema(`ThemedTile$Input {
    tileId: Int
    name: String
    url: String
    scale: Float
    animations: [ThemedTileAnimation$Input]
  }`)}

  ${ioSchema(`WorldOptions$Input {
    editorColor: String
    lineColor: String
    lineWidth: Int
    lineHighlightColor: String
    spacing: Int
  }`)}

  ${ioSchema(`Theme$Input {
    _id: String
    name: String
    worldOptions: WorldOptions$Input
    tiles: [ThemedTile$Input]
  }`)}

  ${ioSchema(`Tile$Input {
    id: Int
    name: String
    tags: [String]
    zIndex: Int
    className: String
    stamp: String
  }`)}

  ${ioSchema(`World$Input {
    _id: String
    name: String
    globals: [String]
    tiles: [Tile$Input]
    files: [TextFile$Input]
    themes: [Theme$Input]
    permissions: Permissions$Input
    ${modificationSchema()}
  }`)}
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

const mutationText = `
  saveWorld(world: WorldInput): Boolean
`;

interface ISaveWorld {
  world: IWorldDAO;
}

const mutations = {
  saveWorld(root: any, { world }: ISaveWorld) {
    const id = world._id;
    delete(world._id);
    Worlds.upsert({_id: id + '_backup'}, { $set: world });
    Worlds.update({_id: id}, { $set: world });
    return true;
  }
};

export default {
  schema,
  resolvers,
  queryText,
  queries,
  mutationText,
  mutations
};
