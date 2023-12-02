import { gql } from "apollo-server";

const typeDefs = gql`
  enum CallStatus {
    PENDING
    RUNNING
    COMPLETED
  }

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

  type Token {
    token: String
  }

  type ForgotPassword {
    token: String
    message: String
  }

  type Report {
    _id: ID
    date: String
    pdf: String
    engineer_EMP: String
    engineer_name: String
    company: String
    createdId: String
  }

  type ExpenseReport {
    _id: ID
    date: String
    time: String
    amount: String
    engineer_EMP: String
    engineer_name: String
    location: String
    isApprove: Boolean
  }

  type Message {
    message: String
  }

  type Call {
    _id: ID
    date: String
    time: String
    amount: String
    location: String
    assign_eng: String
    eng_emp: String
    status: CallStatus
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

  input ReportInput {
    date: String!
    time: String!
    pdf: String!
    engineer_EMP: String!
    engineer_name: String!
    company: String!
    createdId: String
  }

  input ExpenseReportInput {
    _id: ID
    date: String!
    time: String!
    amount: String!
    engineer_EMP: String!
    engineer_name: String!
    location: String!
    isApprove: Boolean
  }


  input CallInput {
    _id: ID
    date: String!
    time: String!
    amount: String!
    location: String!
    assign_eng: String!
    eng_emp: String!
    status: CallStatus
  }

  type Query {
    users: [User]
    user(email: String): User
    engineers: [Engineer]
    engineer(EMP_id: String): Engineer
    admins: [Admin]
    admin(_id: ID!): Admin
    allReports: [Report]
    report(createdId: String!): Report
    reportByCompany(company: String!): [Report]
    reportByEngineer(engineer_EMP: String!): [Report]
    reportByDate(date: String): [Report]
    allExpenseReports: [ExpenseReport]
    expenseReport(_id: ID!): ExpenseReport
    expenseReportByDate(date: String): [ExpenseReport]
    allCalls: [Call]
    call(_id: ID!): Call
    callsByEng(eng_emp: String!): [Call]
    callsByDate(date: String): [Call]
  }

  type Mutation {
    createAdmin(admin: AdminInput!): Admin
    createEngineer(engineer: EngineerInput!, adminId: ID!): Engineer
    loginUser(userLogin: LoginInput!): Token
    forgotPassword(email: String!): ForgotPassword
    resetPassword(resetPassword: ResetPasswordInput!): Token
    createReport(report: ReportInput!): Report
    editReport(report: ReportInput!): Report
    deleteReport(_id: ID!): Message
    createExpenseReport(expenseReport: ExpenseReportInput!): ExpenseReport
    updateExpenseReport(upExpReport: ExpenseReportInput!): ExpenseReport
    approveExpenseReport(_id: ID!, approveExpReport: Boolean!): ExpenseReport
    deleteExpReport(_id: ID!): Message
    createCall(call: CallInput!): Call
    editCall(call: CallInput!): Call
    updateCallStatus(_id: ID, status: CallStatus!): Call
    deleteCall(_id: ID!): Message  
  }
`;

export default typeDefs;
