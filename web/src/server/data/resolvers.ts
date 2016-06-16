//import { Posts, Comments } from '../collections';

const queries = {
  posts() {
    //return Posts.find({}).fetch();
  },
  post(root: any, { id }: any) {
    //return Posts.findOne(id);
  },
  comments(root: any, { postId }: any) {
    //return Comments.find({ postId }).fetch();
  }
};

const mutations = {
  addPost(root: any, { title, content }: any) {
    // const postId = Posts.insert({ title, content });
    // return postId;
  },
  removePost(root: any, { id }: any) {
    // Posts.remove(id);
    // return true;
  },
  addComment(root: any, { postId, comment }: any, context: any) {
    // console.log("adding: " + context);
    // const id = Comments.insert({ postId: postId, text: comment, createdAt: new Date().getTime(), author: context.user._id });
    // return Posts.findOne(id);
  }
};

// root resolver

let resolvers = {
  RootQuery: {},
  RootMutation: {}
};

// add queries

resolvers.RootQuery = Object.assign(resolvers.RootQuery, queries);

// add mutations

resolvers.RootMutation = Object.assign(resolvers.RootMutation, mutations);

// add object resolvers

export default resolvers;
