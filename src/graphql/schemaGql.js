import { gql } from "apollo-server";

const typeDefs = gql`
  enum CallStatus {
    PENDING
    TODAY
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

  enum DeviceTypeEnum {
    Ups_Battery
    Inverter_Battery
    Stabilizer
    Solar
    Computer
    Printer
    CCTV
  }

  enum SiteTypeEnum {
    Onsite
    Offsite
  }

  enum WorkTypeEnum {
    Warrenty
    AMC
    Installation
    SiteInspection
    Chargeable
    PM
    Service
  }

  input ThreeInputPhaseInput {
    ac_input_three_phase_RY: String
    ac_input_three_phase_YB: String
    ac_input_three_phase_RB: String
    ac_input_three_phase_NR: String
  }

  input ThreeOutputPhaseInput {
    ac_output_three_phase_RY: String
    ac_output_three_phase_YB: String
    ac_output_three_phase_RB: String
    ac_output_three_phase_NR: String
  }

  input SingleInputPhaseInput {
    ac_input_single_phase_LN: String
    ac_input_single_phase_NE: String
    ac_input_single_phase_LE: String
  }

  input SingleOutputPhaseInput {
    ac_output_single_phase_LN: String
    ac_output_single_phase_NE: String
    ac_output_single_phase_LE: String
  }

  input DCInput {
    V: String
    V_withMains: String
    V_withoutMains: String
  }

  input BatteryTestReportInput {
    battery_catch_code: String
    with_mains: String
    without_mains: String
    after_5_min: String
    after_10_min: String
    after_20_min: String
    after_40_min: String
    after_1_hour: String
  }

  input ReportInput {
    company_name: String
    call_id: String
    eng_emp: String
    complain_id: String
    date: String
    time: String
    client_name: String
    atm_id: String
    contact: String
    address: String
    site_type: SiteTypeEnum
    work_type: WorkTypeEnum
    device_type: DeviceTypeEnum
    product_make: String
    product_slNo: String
    buy_back_details: String
    nature_of_complaint: String
    ac_input_three_phase: ThreeInputPhaseInput
    ac_output_three_phase: ThreeOutputPhaseInput
    ac_input_single_phase: SingleInputPhaseInput
    ac_output_single_phase: SingleOutputPhaseInput
    DC: DCInput
    site_images: [String]
    power_cut: String
    battery_make: String
    battery_type: String
    battery_AH: String
    quantity: String
    battery_test_report: [BatteryTestReportInput]
    customer_sign: String
    eng_sign: String
  }

  type ThreeInputPhase {
    ac_input_three_phase_RY: String
    ac_input_three_phase_YB: String
    ac_input_three_phase_RB: String
    ac_input_three_phase_NR: String
  }

  type ThreeOutputPhase {
    ac_output_three_phase_RY: String
    ac_output_three_phase_YB: String
    ac_output_three_phase_RB: String
    ac_output_three_phase_NR: String
  }

  type SingelInputPhase {
    ac_input_single_phase_LN: String
    ac_input_single_phase_NE: String
    ac_input_single_phase_LE: String
  }

  type SingelOutputPhase {
    ac_output_single_phase_LN: String
    ac_output_single_phase_NE: String
    ac_output_single_phase_LE: String
  }

  type DCType {
    V: String
    V_withMains: String
    V_withoutMains: String
  }

  type BatteryTestReportType {
    battery_catch_code: String
    with_mains: String
    without_mains: String
    after_5_min: String
    after_10_min: String
    after_20_min: String
    after_40_min: String
    after_1_hour: String
  }

  type Report {
    _id: ID
    company_name: String
    call_id: String
    eng_emp: String
    complain_id: String
    date: String
    time: String
    client_name: String
    atm_id: String
    contact: String
    address: String
    site_type: SiteTypeEnum
    work_type: WorkTypeEnum
    device_type: DeviceTypeEnum
    product_make: String
    product_slNo: String
    buy_back_details: String
    nature_of_complaint: String
    ac_input_three_phase: ThreeInputPhase
    ac_output_three_phase: ThreeOutputPhase
    ac_input_single_phase: SingelInputPhase
    ac_output_single_phase: SingelOutputPhase
    DC: DCType
    site_images: [String]
    power_cut: String
    battery_make: String
    battery_type: String
    battery_AH: String
    quantity: String
    battery_test_report: [BatteryTestReportType]
    customer_sign: String
    eng_sign: String
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
    total_kilometer: String
    expense_amount: String
    isApprove: ExpenseApproveEnum
    status: ExpenseStatus
    eng_desc: String
    admin_desc: String
  }

  type EngineerExpense {
    eng_emp: String
    eng_name: String
    expense_list: [ExpenseDetails]
  }

  input ExpenseReportInput {
    date: String!
    time: String!
    eng_emp: String!
    eng_name: String!
    company_name: String!
    company_location: String!
    call_id: String!
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
    eng_emp: String
    address: String
    email: String
    password: String
    designation: String
    eng_sign: String
  }

  input EngineerInput {
    Fname: String!
    Lname: String!
    contact: String!
    age: String!
    eng_emp: String!
    address: String!
    email: String!
    password: String!
    designation: String
    eng_sign: String!
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

  # type ForgotPassword {
  #   token: String
  #   message: String
  # }

  type Message {
    message: String
  }

  type EngineerCall {
    eng_emp: String
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

  # input ResetPasswordInput {
  #   email: String!
  #   password: String!
  # }

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
    eng_desc: String!
    admin_desc: String!
    call_id: String!
    customer_contact: String!
    submit_date: String
    visit_date: String
    completed: Boolean
    site_images: [String]
    expense_amount: String
    report: String
    status: CallStatus
  }

  input UpdateCallInput {
    submit_date: String!
    status: CallStatus!
    report: String!
  }

  input CallInput {
    company_name: String!
    company_details: String!
    company_location: String!
    company_address: String!
    eng_name: String!
    eng_emp: String!
    assigned_date: String!
    assigned_time: String!
    call_id: String!
    customer_contact: String!
    submit_date: String
    visit_date: String
    completed: Boolean
    site_images: [String]
    expense_amount: String
    report: String
    status: CallStatus
    eng_desc: String!
    admin_desc: String!
  }

  input RescheduleInput {
    call_id: String!
    visit_date: String!
    eng_desc: String!
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
    eng_desc: String!
    admin_desc: String!
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
    time: String
    location: String
  }

  scalar SuccessMessage

  type Query {
    users: [User]
    user(email: String!): User
    engineers: [Engineer]
    engineer(eng_emp: String!): Engineer
    engineerByObject(_id: ID!): Engineer
    admins: [Admin]
    admin(_id: ID!): Admin
    allReports: [Report]
    report(_id: ID!): Report
    reportByCompany(company: String!): [Report]
    reportByEngineer(eng_emp: String!): [Report]
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
    # getQRCode: String
  }

  type Mutation {
    createAdmin(admin: AdminInput!): Admin
    createEngineer(engineer: EngineerInput!, adminId: ID!): Engineer
    deleteEngineer(eng_emp: String!): Message
    loginUser(userLogin: LoginInput!): Token
    # forgotPassword(email: String!): ForgotPassword
    resetPassword(email: String!, password: String!): SuccessMessage
    createReport(report: ReportInput!): Report
    editReport(report: ReportInput!): Report
    deleteReport(_id: ID!): Message
    createExpenseReport(
      expenseReport: ExpenseReportInput!
    ): SubmitExpenseResponse
    updateExpenseReport(upExpReport: ExpenseReportInput!): ExpenseReport
    approveExpenseReport(
      call_id: String!
      approveStatus: ExpenseApproveEnum!
      admin_desc: String
    ): ExpenseReport
    deleteExpReport(_id: ID!): Message
    createCall(call: CallInput!): Message
    updateCallByEng(
      call_id: String!
      eng_emp: String!
      updateCall: UpdateCallInput!
    ): Call
    editCall_by_Admin(call: CallInput!): Call
    updateCallStatus(_id: ID, status: CallStatus!): Call
    rescheduleCall(call: RescheduleInput!): Call
    deleteCall(_id: ID!): Message
    submitAttendence(attendence: AttendenceInput!): SubmitAttendenceResponse
    # sendPdf(pdf_link: String!, customer_num: String!): String
  }
`;

export default typeDefs;
