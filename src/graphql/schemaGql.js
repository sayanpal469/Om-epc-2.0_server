import { gql } from "apollo-server";

const typeDefs = gql`
  type Engineer {
    _id: ID
    Fname: String
    Lname: String
    phone: String
    EMP_id: String
    image: String
    address: String
    email: String
    password: String
  }

  type Admin {
    _id: ID
    name: String
    email: String
    password: String
  }

  type User {
    _id: ID
    email: String
    password: String
    role: String
    engineer: Engineer
    admin: Admin
  }

  type Query {
    users: [User]
    user(_id: ID!): User
  }

  input UserInput {
    email: String!
    password: String!
    role: String!
    engineer: ID!
    admin: ID!
  }

  input AdminInput {
    name: String
    email: String
    password: String
  }

  input EngineerInput {
    Fname: String!
    Lname: String!
    phone: String!
    EMP_id: String!
    image: String!
    address: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(newUser: UserInput!): User
    createAdmin(admin: AdminInput!): Admin
    createEngineer(engineer: EngineerInput!): Engineer
  }
`;

export default typeDefs;
