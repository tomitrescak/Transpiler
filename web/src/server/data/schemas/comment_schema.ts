const schema = `
type Comment {
  id: String
  senderId: String
  senderName: String
  senderAvatar: String
  message: String
  sent: Date
}
`

export default {
  schema
}
