interface Tile {
  name: string;
}

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
