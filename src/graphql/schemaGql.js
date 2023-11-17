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

  input UserInput {
    email: String!
    password: String!
    role: String!
    engineer: ID
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

  input LoginInput {
    email: String!
    password: String!
  }

  input ResetPasswordInput {
    # token: String!
    newPassword: String!
  }

  type Token {
    token: String
  }

  type ForgotPassword {
    token: String
    message: String
  }

  type Query {
    users: [User]
    user(email: String): User
    engineers: [Engineer]
    engineer(EMP_id: String): Engineer
    admins: [Admin]
    admin(_id: ID!): Admin
  }

  type Mutation {
    createUser(newUser: UserInput!): User
    createAdmin(admin: AdminInput!): Admin
    createEngineer(engineer: EngineerInput!): Engineer
    loginUser(userLogin: LoginInput!): Token
    forgotPassword(email: String!): ForgotPassword
    resetPassword(resetPassword: ResetPasswordInput!): Token
  }
`;

export default typeDefs;
