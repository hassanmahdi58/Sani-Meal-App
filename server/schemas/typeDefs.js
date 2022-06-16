const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    savedMeals: [MealSchema]
  }
  type MealSchema {
    mealId: ID!
    title: String!
    description: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }
  input SaveMealSchema {
    mealId: ID!
    title: String!
    description: String
    image: String
  }

  type Recipe {
    mealId: ID!
    title: String!
    description: String!
    image: String!
  }

  type Query {
    me: User
    searchRecipes(searchTerm: String!): [Recipe]!
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveMeal(mealInfo: SaveMealSchema!): User
    removeMeal(mealId: ID!): User
  }
`;

module.exports = typeDefs;
