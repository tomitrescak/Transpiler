import { Mongo } from 'meteor/mongo';

declare global {
  /**
   * @interface IThemedTileAnimationDAO
   */
  export interface IThemedTileAnimationDAO {
    name: string;
    frames: Array<string>;
  }

  /**
   * @interface IThemedTileDAO
   */
  export interface IThemedTileDAO {
    tileId: number;
    name: string;
    url: string;
    scale?: number;
    animations?: Array<IThemedTileAnimationDAO>;
  }

  /**
   * @interface IWorldOptions
   */
  export interface IWorldOptions {
    editorColor: string;
    lineColor: string;
    lineWidth: number;
    lineHighlightColor: string;
    spacing: number;
  }

  /**
   * @interface IThemeDAO
   */
  export interface IThemeDAO {
    _id: string;
    name: string;
    worldOptions: IWorldOptions;
    tiles: Array<IThemedTileDAO>;
  }

  /**
   * @interface ITileDAO
   */
  export interface ITileDAO {
    id?: number;
    name: string;
    tags?: Array<string>;
    zIndex?: number;
    className?: string;
    stamp?: string;
  }

  /**
   * @interface IPluginDAO
   */
  export interface IPluginDAO {
    id?: string;
    type: string;
    name: string;
    source: string;
    position?: IEditorPosition;
    index?: number;
  }

  /**
   * @interface IWorldDAO
   */
  export interface IWorldDAO {
    _id?: string;
    name: string;
    globals: string[];
    tiles?: ITileDAO[];
    files?: IPluginDAO[];
    themes?: IThemeDAO[];
    permissions: IPermissionsDAO;
  }

}

// import { PermissionSchema } from './schemas/permission_schema';
// import { SchemaHelpers } from './schemas/schema_helpers';
// import { TextFileSchema } from './schemas/text_file';
// import { Security } from '../models/security_model';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//
// let themedTileAnimationSchema = new SimpleSchema({
//   name: {
//     type: String
//   },
//   frames: {
//     type: [String]
//   }
// });
//
// let themedTileSchema = new SimpleSchema({
//   tileId: {
//     type: Number
//   },
//   name: {
//     type: String
//   },
//   url: {
//     type: String
//   },
//   scale: {
//     type: Number,
//     decimal: true,
//     optional: true
//   },
//   animations: {
//     type: [themedTileAnimationSchema],
//     optional: true
//   }
// });
//
// let WorldOptionsSchema = new SimpleSchema({
//   editorColor: {
//     type: String
//   },
//   lineColor: {
//     type: String
//   },
//   lineWidth: {
//     type: Number
//   },
//   lineHighlightColor: {
//     type: String
//   },
//   spacing: {
//     type: Number
//   }
// });
//
// let themeSchema = new SimpleSchema({
//   _id: {
//     type: String
//   },
//   name: {
//     type: String
//   },
//   worldOptions: {
//     type: WorldOptionsSchema
//   },
//   tiles: {
//     type: [themedTileSchema]
//   }
// });
//
// let tileSchema = new SimpleSchema({
//   id: {
//     type: Number
//   },
//   name: {
//     type: String
//   },
//   tags: {
//     type: [String]
//   },
//   zIndex: {
//     type: Number,
//     optional: true
//   },
//   className: {
//     type: String,
//     optional: true
//   },
//   stamp: {
//     type: String,
//     optional: true
//   }
// });
//
// let worldSchema = SchemaHelpers.addAccessSchema({
//   name: {
//     type: String
//   },
//   globals: {
//     type: [String],
//     optional: true
//   },
//   tiles: {
//     type: [tileSchema],
//     optional: true
//   },
//   files: {
//     type: [TextFileSchema],
//     optional: true
//   },
//   themes: {
//     type: [themeSchema],
//     optional: true
//   },
//   permissions: {
//     type: PermissionSchema
//   }
// });

export let Worlds: Mongo.Collection<IWorldDAO> = new Mongo.Collection<IWorldDAO>('worlds');
// Worlds.attachSchema(worldSchema);
// Worlds.allow({
//   insert: (userId: string, doc: any) => Security.isAdmin(userId),
//   update: (userId: string, doc: any) => Security.isAdmin(userId),
//   remove: (userId: string, doc: any) => Security.isAdmin(userId)
// });

export default Worlds;
