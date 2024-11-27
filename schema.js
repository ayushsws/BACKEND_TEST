const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Item {
        id: ID!
        name: String!
        price: Float!
    }

    type Expense {
        id: ID!
        user: User!
        item: Item!
        date: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        items: [Item]
        users: [User]
        userExpenses(userId: ID!): [Expense]
    }

    type Mutation {
        register(name: String!, email: String!, password: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
        addItem(name: String!, price: Float!): Item
        addExpense(userId: ID!, itemId: ID!): Expense
    }
`;

module.exports = typeDefs;
