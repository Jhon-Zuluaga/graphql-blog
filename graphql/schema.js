const {GraphQLSchema, GraphQLObjectType} = require ('graphql');
const { users, user } = require('./querys');
const { register, login, createPost } = require('./mutations');

const QueryType = new GraphQLObjectType({
    name: "QueryType",
    description: 'the root query type',
    fields: {
        users,
        user,
    },
});

const MutationType = new GraphQLObjectType({
    name: "MutationType",
    description: "The root mutation type",
    fields: {
        register,
        login, 
        createPost,
    }
});

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});

