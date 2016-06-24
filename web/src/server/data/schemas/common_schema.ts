const schema = `
  type TextFile {
    id: String
    type: String
    name: String
    source: String
    position: Position
    top: Int
    index: Int
  }

  type Position {
    row: Int
    column: Int
  }
`

const resolvers = {
  TextFile: {
    position(file: ITextFileDAO) {
      return file.position;
    }
  }
};

export default {
  schema,
  resolvers
};
