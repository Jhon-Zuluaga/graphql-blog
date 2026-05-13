const { GraphQLString, GraphQLID } = require("graphql");
const { User, Post } = require("../models");
const { createJWTToken } = require("../util/auth");
const { PostType } = require("./types");

const register = {
  type: GraphQLString,
  description: "Register a new user and returns a JWT token",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, email, password, displayName } = args;

    const user = new User({ username, email, password, displayName });
    await user.save();

    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });
    return token;
  },
};

const login = {
  type: GraphQLString,
  description: "login a user and returns a token",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    const user = await User.findOne({ email: args.email }).select("+password");

    if (!user || args.password !== user.password) {
      throw new Error("Invalid credentials");
    }

    const token = createJWTToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });

    return token;
  },
};

const createPost = {
  type: PostType,
  description: "Create a new post",
  args: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
  async resolve(_, args, { verifiedUser }) {
    console.log(verifiedUser);
    const newPost = new Post({
      title: args.title,
      content: args.content,
      authorId: verifiedUser._id,
    });
    await newPost.save();
    return newPost;
  },
};

const updatePost = {
  type: PostType,
  description: "Update a post",
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
  async resolve(_, { id, title, content }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, authorId: verifiedUser._id },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return updatedPost;
  },
};

const deletePost = {
  type: GraphQLString,
  description: "Delete a post",
  args: {
    postId: { type: GraphQLID },
  },
  async resolve(_, { postId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unathorized");

    const deletedPost = await Post.findByIdAndDelete({
      _id: postId,
      authorId: verifiedUser._id,
    });

    if (!deletedPost) throw new Error("Post not found");

    return "Post deleted";
  },
};

module.exports = { register, login, createPost, updatePost, deletePost };
