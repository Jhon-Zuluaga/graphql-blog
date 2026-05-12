const {GraphQLSchema, GraphQLObjectType} = require ('graphql');
const { hello } = require('./querys');

const QueryType = new GraphQLObjectType({
    name: "QueryType",
    description: 'the root query type',
    fields: {
        hello
    }
})

module.exports = new GraphQLSchema({
    query: QueryType
});

