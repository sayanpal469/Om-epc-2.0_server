import { gql } from "apollo-server";

const typeDefs = gql`
  enum CallStatus {
    PENDING
    RUNNING
    COMPLETED
    ALL
  }

  enum ExpenseApproveEnum {
    APPROVE
    REJECT
    PENDING
  }

  enum ExpenseStatus {
    APPROVE
    REJECT
    RECENT
    PENDING
    ALL
  }

  type SubmitExpenseResponse {
    call_id: String
    message: String
  }

  type ExpenseReport {
    _id: ID
    date: String
    time: String
    eng_emp: String
    eng_name: String
    company_name: String
    company_location: String
    call_id: String
    total_expense: String
    total_kilometer: String
    expense_amount: String
    isApprove: ExpenseApproveEnum
    status: ExpenseStatus
    eng_desc: String
    admin_desc: String
  }

  type ExpenseDetails {
    date: String
    time: String
    eng_emp: String
    eng_name: String
    company_name: String
    company_location: String
    call_id: String
    total_expense: String
    total_kilometer: String
    expense_amount: String
    isApprove: ExpenseApproveEnum
    status: ExpenseStatus
    eng_desc: String
    admin_desc: String
  }

  type EngineerExpense {
    eng_id: String
    eng_name: String
    expense_list: [ExpenseDetails]
  }

  input ExpenseReportInput {
    _id: ID
    date: String!
    time: String!
    eng_emp: String!
    eng_name: String!
    company_name: String!
    company_location: String!
    call_id: String!
    total_expense: String!
    total_kilometer: String!
    expense_amount: String!
    isApprove: ExpenseApproveEnum
    status: ExpenseStatus
    eng_desc: String!
    admin_desc: String
  }

  type Engineer {
    _id: ID
    Fname: String
    Lname: String
    contact: String
    age: String
    EMP_id: String
    address: String
    email: String
    password: String
    designation: String
  }

  input EngineerInput {
    Fname: String!
    Lname: String!
    contact: String!
    age: String!
    EMP_id: String!
    address: String!
    email: String!
    password: String!
    designation: String
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

  type Message {
    message: String
  }

  type Call {
    _id: ID
    company_name: String!
    company_details: String!
    company_location: String!
    company_address: String!
    eng_name: String!
    eng_emp: String!
    assigned_date: String!
    assigned_time: String!
    description: String!
    call_id: String!
    customer_contact: String!
    submit_date: String
    visit_date: String
    completed: Boolean
    expense_amount: String
    report: String
    status: CallStatus
  }

  type CallDetails {
    call_id: String
    company_name: String
    company_details: String
    company_location: String
    company_address: String
    assigned_date: String
    assigned_time: String
    submit_date: String
    visit_date: String
    customer_contact: String
    report: String
    description: String
  }

  type EngineerCall {
    eng_id: String
    eng_name: String
    call_list: [CallDetails]
  }

  input AdminInput {
    name: String
    email: String
    password: String
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

  input CallInput {
    _id: ID
    company_name: String!
    company_details: String!
    company_location: String!
    company_address: String!
    eng_name: String!
    eng_emp: String!
    assigned_date: String!
    assigned_time: String!
    description: String!
    call_id: String!
    customer_contact: String!
    submit_date: String
    visit_date: String
    completed: Boolean
    expense_amount: String
    report: String
    status: CallStatus
  }

  type Attendence {
    _id: ID
    date: String
    eng_name: String
    eng_emp: String
    time: String
    location: String
  }

  type SubmitAttendenceResponse {
    eng_name: String
    eng_emp: String
    message: String
  }

  type AttendenceTimestamp {
    time: String
    date: String
  }

  type GetAttendenceResponse {
    eng_name: String
    eng_emp: String
    attendence: [AttendenceTimestamp]
  }

  input AttendenceInput {
    date: String!
    eng_name: String!
    eng_emp: String!
    time: String!
    location: String!
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
    expenseReportsByStatus(status: ExpenseStatus!): [ExpenseReport]
    expenseReport(_id: ID!): ExpenseReport
    expenseReportByDate(date: String!): [ExpenseReport]
    expenseReportByEng(eng_emp: String!): EngineerExpense
    callsByStatus(status: String!): [Call]
    call(_id: ID!): Call
    callsByEng(eng_emp: String!, status: CallStatus!): EngineerCall
    callsByDate(date: String): [Call]
    getAttendenceByEng(eng_emp: String!): GetAttendenceResponse
  }

  type Mutation {
    createAdmin(admin: AdminInput!): Admin
    createEngineer(engineer: EngineerInput!, adminId: ID!): Engineer
    deleteEngineer(eng_emp: String!): Message
    loginUser(userLogin: LoginInput!): Token
    forgotPassword(email: String!): ForgotPassword
    resetPassword(resetPassword: ResetPasswordInput!): Token
    createReport(report: ReportInput!): Report
    editReport(report: ReportInput!): Report
    deleteReport(_id: ID!): Message
    createExpenseReport(
      expenseReport: ExpenseReportInput!
    ): SubmitExpenseResponse
    updateExpenseReport(upExpReport: ExpenseReportInput!): ExpenseReport
    approveExpenseReport(
      _id: ID!
      approveStatus: ExpenseApproveEnum!
      admin_desc: String
    ): ExpenseReport
    deleteExpReport(_id: ID!): Message
    createCall(call: CallInput!): Message
    editCall(call: CallInput!): Call
    updateCallStatus(_id: ID, status: CallStatus!): Call
    deleteCall(_id: ID!): Message
    submitAttendence(attendence: AttendenceInput!): SubmitAttendenceResponse
  }
`;

export default typeDefs;
