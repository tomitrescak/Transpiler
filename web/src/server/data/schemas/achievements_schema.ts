const schema = `
  type Achievement {
    _id: String
    userId: String
    scheduleId: String
    practicalId: String
    exerciseId: String
    locRank: Int
    type: Int
    rank: Int
    count: Int
    solutions: [String]
    descriptions: [String]
  }
`
const queryText = `
  achievements: [Achievement]
`;

export default {
  schema
};
