const { GraphQLString } = require('graphql');
const { User, Post } = require('../models');
const { createJWTToken } = require('../util/auth');
const { PostType } = require('./types');


const register = {
    type: GraphQLString,
    description: 'Register a new user and returns a JWT token',
    args: {
        username: { type: GraphQLString},
        email: { type: GraphQLString},
        password: { type: GraphQLString},
        displayName: { type: GraphQLString},
    },
    async resolve(_, args){
        const { username, email, password, displayName } = args;

        const user = new User({ username, email, password, displayName });
        await user.save();

        const token = createJWTToken({_id: user._id, username: user.username, email: user.email, displayName: user.displayName });
        return token;
    },
};

const login = {
    type: GraphQLString,
    description: "login a user and returns a token",
    args: {
        email: { type: GraphQLString},
        password: { type: GraphQLString},
    },
    async resolve(_, args){
        const user = await User.findOne({ email: args.email}).select("+password");

        if(!user || args.password !== user.password){
            throw new Error("Invalid credentials");
        }

        const token = createJWTToken({_id: user._id, username: user.username, email: user.email, displayName: user.displayName });

        return token;
    },
};

const createPost = {
    type: PostType,
    description: 'Create a new post',
    args: {
        title: { type: GraphQLString},
        content: { type: GraphQLString},
    },
    async resolve(_, args) {
        console.log(args);
        const newPost = new Post({
            title: args.title,
            content: args.content,
            authorId: '6a038ca67fc76371bd223e6c'
        });

        return newPost;
    }
}

module.exports = { register, login, createPost }