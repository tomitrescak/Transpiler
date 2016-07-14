
import { initActions } from '../../text_editor/actions/text_editor_actions';

export const ADD_FILE = 'WORLD: Add File';
export const REMOVE_FILE = 'WORLD: Remove File';
export const RENAME_FILE = 'WORLD: Rename File';
export const CHANGE_TYPE_FILE = 'WORLD: Change Type File';
export const FILE_MOVE_LEFT = 'WORLD: File Move Left';
export const FILE_MOVE_RIGHT = 'WORLD: File Move Right';

export const fileActions = initActions(ADD_FILE, REMOVE_FILE, RENAME_FILE, CHANGE_TYPE_FILE, FILE_MOVE_LEFT, FILE_MOVE_RIGHT);

export function save(context: IContext, world: IWorldDAO) {
  return context.Apollo.mutationWithFeedback({
    query: `
      mutation saveWorld(
        $world: WorldInput!
      ) {
        saveWorld(world: $world)
      }
    `,
    variables: {
      world
    }
  });
}
