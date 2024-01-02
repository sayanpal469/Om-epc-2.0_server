import jwt from "jsonwebtoken";
import { Admin } from "../app/modules/admin/admin.model.js";
import { Engineer } from "../app/modules/engineer/engineer.model.js";
import { User } from "../app/modules/user/user.model.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import { Report } from "../app/modules/report/report.model.js";
import { ExpenseReport } from "../app/modules/expenseReport/expenseReport.model.js";
import { Call } from "../app/modules/call/call.model.js";
import { Attendence } from "../app/modules/attendence/attendence.model.js";
// import { client, generateQRCode } from "../server.js";

const resolvers = {
  Query: {
    users: async (_, __, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const users = await User.find();

      if (!users || users.length === 0) throw new Error("User not found");
      return users;
    },

    user: async (_, { email }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const user = await User.findOne({ email: email });

      if (!user) throw new Error("User not found");

      return user;
    },
    engineers: async (_, __, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const engineers = await Engineer.find();

      if (!engineers) throw new Error("Engineer not found");
      return engineers;
    },

    engineer: async (_, { eng_emp }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const engineer = await Engineer.findOne({ eng_emp: eng_emp });

      if (!engineer) throw new Error("Engineer not found");

      return engineer;
    },

    engineerByObject: async (_, { _id }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const engineer = await Engineer.findOne({ _id: _id });

      if (!engineer) throw new Error("Engineer not found");

      return engineer;
    },

    admins: async (_, __, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const admins = await Admin.find();

      if (!admins) throw new Error("Admin not found");
      return admins;
    },

    admin: async (_, { _id }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const admin = await Admin.findById(_id);

      if (!admin) throw new Error("Admin not found");

      return admin;
    },

    allReports: async (_, __, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const reports = await Report.find();

      if (!reports || reports.length === 0) throw new Error("Report not found");
      return reports;
    },

    report: async (_, { _id }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const report = await Report.findOne({ _id: _id });
      // console.log(_id);

      if (!report) throw new Error("Report not found");

      return report;
    },

    reportByCompany: async (_, { company }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const report = await Report.find({
        company_name: { $regex: new RegExp(company, "i") },
      });

      if (!report || report.length === 0) throw new Error("Report not found");

      return report;
    },

    reportByEngineer: async (_, { eng_emp }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const report = await Report.find({ eng_emp: eng_emp });

      if (!report || report.length === 0) throw new Error("Report not found");

      return report;
    },

    reportByDate: async (_, { date }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const reports = await Report.find({ date: date });

      if (!reports || reports.length === 0) {
        throw new Error("No reports found for the given date");
      }

      return reports;
    },

    expenseReportsByStatus: async (_, { status }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      let expenseReports;

      if (status == "ALL") {
        expenseReports = await ExpenseReport.find();
      } else if (status == "RECENT") {
        expenseReports = await ExpenseReport.find()
          .sort({ createdAt: -1 })
          .limit(5);
      } else {
        expenseReports = await ExpenseReport.find({ status: status });
      }

      if (!expenseReports || expenseReports.length === 0)
        throw new Error("Expense report not found");
      return expenseReports;
    },

    expenseReport: async (_, { _id }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const expenseReport = await ExpenseReport.findById(_id);

      if (!expenseReport) throw new Error("Expense report not found");

      return expenseReport;
    },

    expenseReportByDate: async (_, { date }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const expenseReports = await ExpenseReport.find({ date: date });

      if (!expenseReports || expenseReports.length === 0) {
        throw new Error("No expense reports found for the given date");
      }

      return expenseReports;
    },

    expenseReportByEng: async (_, { eng_emp }, { userId }) => {
      if (!userId) {
        throw new Error("Authentication required");
      }

      const availableEngineer = await Engineer.findOne({
        eng_emp: eng_emp,
      });

      if (!availableEngineer) {
        throw new Error("Engineer does not exist");
      }

      const expenseReports = await ExpenseReport.find({
        eng_emp: eng_emp,
      });

      if (!expenseReports || expenseReports.length === 0)
        throw new Error("Expense report not found");

      const engineerExpense = {
        eng_emp: eng_emp,
        eng_name: expenseReports[0].eng_name,
        expense_list: expenseReports.map((expense) => ({
          date: expense.date,
          time: expense.time,
          eng_emp: expense.eng_emp,
          eng_name: expense.eng_name,
          company_name: expense.company_name,
          company_location: expense.company_location,
          call_id: expense.call_id,
          total_kilometer: expense.total_kilometer,
          expense_amount: expense.expense_amount,
          isApprove: expense.isApprove,
          status: expense.status,
          eng_desc: expense.eng_desc,
          admin_desc: expense.admin_desc,
        })),
      };

      return engineerExpense;
    },

    callsByStatus: async (_, { status }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      let calls;

      if (status == "ALL") {
        calls = await Call.find();
      } else if (status === "TODAY") {
        const today = new Date();
        today.setHours(6, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Get the start of the next day

        calls = await Call.find({
          createdAt: { $gte: today, $lt: tomorrow },
        });
      } else {
        calls = await Call.find({ status: status });
      }

      if (!calls || calls.length === 0) throw new Error("Calls not found");
      return calls;
    },

    call: async (_, { _id }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const call = await Call.findById(_id);

      if (!call) throw new Error("Call not found");

      return call;
    },

    callsByEng: async (_, { eng_emp, status }, { userId }) => {
      if (!userId) {
        throw new Error("Authentication required");
      }

      let calls;

      if (status == "ALL") {
        calls = await Call.find({ eng_emp: eng_emp });
      } else {
        calls = await Call.find({
          $and: [{ eng_emp: eng_emp }, { status: status }],
        });
      }

      if (!calls || calls.length === 0) throw new Error("Calls not found");

      const engineerCall = {
        eng_emp: eng_emp,
        eng_name: calls[0].eng_name,
        call_list: calls.map((call) => ({
          call_id: call.call_id,
          company_name: call.company_name,
          company_details: call.company_details,
          company_location: call.company_location,
          company_address: call.company_address,
          assigned_date: call.assigned_date,
          customer_contact: call.customer_contact,
          assigned_time: call.assigned_time,
          submit_date: call.submit_date || "-",
          visit_date: call.visit_date || "-",
          report: call.report || "-",
          status: call.status,
          eng_desc: call.eng_desc || "_",
          admin_desc: call.admin_desc || "_",
        })),
      };

      return engineerCall;
    },

    callsByDate: async (_, { date }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const calls = await Call.find({ assigned_date: date });

      if (!calls || calls.length === 0) {
        throw new Error("No calls found for the given date");
      }

      return calls;
    },

    getAttendenceByEng: async (_, { eng_emp }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const existingEng = await Engineer.findOne({ eng_emp: eng_emp });

      if (!existingEng) {
        throw new Error("Engineer not found");
      }

      const checkAttendence = await Attendence.find({ eng_emp: eng_emp });

      if (!checkAttendence || checkAttendence.length === 0) {
        throw new Error("Attendence not found");
      }

      // Assuming each entry in checkAttendence has properties 'time' and 'date'
      const attendanceList = checkAttendence.map((entry) => ({
        time: entry.time,
        date: entry.date,
      }));

      // console.log(attendanceList);

      const response = {
        eng_name: checkAttendence[0].eng_name, // Assuming eng_name is the same for all entries
        eng_emp: eng_emp,
        attendence: attendanceList,
      };

      return response;
    },

    // getQRCode: async (_, __, { userId }) => {
    //   try {
    //     if (!userId) {
    //       throw new Error("Authentication required");
    //     }

    //     const qr = await generateQRCode();
    //     // console.log(qr);
    //     return qr;
    //   } catch (error) {
    //     throw new Error("Failed to generate QR code");
    //   }
    // },
  },

  Mutation: {
    createAdmin: async (_, { admin }) => {
      try {
        const existingAdmin = await Admin.findOne({ email: admin.email });

        if (existingAdmin) {
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(admin.password, 12);

        const adminNew = new Admin({
          ...admin,
          password: hashedPassword,
        });

        const adminUser = new User({
          email: admin.email,
          password: hashedPassword,
          role: "Admin",
          admin: adminNew._id,
        });

        try {
          await adminNew.save();
          await adminUser.save();
          return adminNew;
        } catch (error) {
          // console.error(error.message);
          throw new Error("Unable to save admin");
        }
      } catch (error) {
        // console.error("Error creating engineer:", error);
        throw new Error("Error creating engineer:", error);
      }
    },

    createEngineer: async (_, { engineer, adminId }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      try {
        const existingEng = await Engineer.findOne({ email: engineer.email });
        const existingEmp = await Engineer.findOne({
          eng_emp: engineer.eng_emp,
        });
        const isAdmin = await Admin.findById(adminId);

        if (!isAdmin) {
          throw new Error("Admin id is not true");
        }

        if (existingEng) {
          throw new Error("Email already in use");
        }

        if (existingEmp) {
          throw new Error("This Employee ID already in use");
        }

        const hashedPassword = await bcrypt.hash(engineer.password, 12);

        const engNew = new Engineer({
          ...engineer,
          password: hashedPassword,
        });

        const engUser = new User({
          email: engineer.email,
          password: hashedPassword,
          role: "Engineer",
          admin: adminId,
          engineer: engNew._id,
        });

        try {
          await engNew.save();
          await engUser.save();
          return engNew;
        } catch (error) {
          // console.error(error.message);
          throw new Error("Unable to create engineer");
        }
      } catch (error) {
        // console.error("Error creating engineer:", error);
        throw new Error(error.message);
      }
    },

    deleteEngineer: async (_, { eng_emp }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const existingEng = await Engineer.findOne({ eng_emp: eng_emp });

        console.log(existingEng._id);

        if (!existingEng) {
          throw new Error("Engineer does not exist");
        } else {
          await User.findOneAndDelete({ engineer: existingEng._id });
          await Engineer.findOneAndDelete({ eng_emp: eng_emp });
        }

        return {
          message: "Engineer deleted successfully",
        };
      } catch (error) {
        // console.error("Error deleting engineer:", error.message);
        throw new Error(error.message);
      }
    },

    loginUser: async (_, { userLogin }) => {
      const user = await User.findOne({ email: userLogin.email });
      if (!user) {
        throw new Error("User dosent exists with that email");
      }

      let engineer;

      if (user.engineer) {
        engineer = user.engineer;
      } else {
        engineer = undefined;
      }

      const doMatch = await bcrypt.compare(userLogin.password, user.password);
      if (!doMatch) {
        throw new Error("wrong credentials");
      }
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          admin: user.admin,
          engineer: engineer,
        },
        config.jwt_secret,
        {
          expiresIn: "1h",
        }
      );
      return { token };
    },

    // forgotPassword: async (_, { email }) => {
    //   const user = await User.findOne({ email });

    //   if (!user) {
    //     throw new Error("User not found");
    //   }

    //   // Generate a unique reset password token and set an expiration time
    //   const resetPasswordToken = jwt.sign(
    //     { userId: user._id },
    //     config.jwt_secret,
    //     { expiresIn: "1h" }
    //   );

    //   // Log the token (remove this in production)
    //   // console.log("Reset Password Token:", resetPasswordToken);

    //   // Send the reset password token to the user via email or other means

    //   return {
    //     token: resetPasswordToken,
    //     message: "Password reset token sent",
    //   };
    // },

    resetPassword: async (_, { email, password }) => {
      const user = await User.findOne({ email: email });
      // console.log(user);

      if (!user) {
        throw new Error("User not found");
      }

      if (!password) {
        throw new Error("New password is required");
      }

      if (user) {
        if (user.role == "Admin") {
          await Admin.findOneAndUpdate(
            { email: email },
            {
              $set: {
                password: await bcrypt.hash(password, 12),
              },
            },
            {
              new: true,
            }
          );
          await User.findOneAndUpdate(
            { email: email },
            {
              $set: {
                password: await bcrypt.hash(password, 12),
              },
            },
            {
              new: true,
            }
          );
        } else if (user.role == "Engineer") {
          await Engineer.findOneAndUpdate(
            { email: email },
            {
              $set: {
                password: await bcrypt.hash(password, 12),
              },
            },
            {
              new: true,
            }
          );
          await User.findOneAndUpdate(
            { email: email },
            {
              $set: {
                password: await bcrypt.hash(password, 12),
              },
            },
            {
              new: true,
            }
          );
        }
      }

      return "Password changed successfully";
    },

    createReport: async (_, { report }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const availableEngineer = await Engineer.findOne({
          eng_emp: report.eng_emp,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const existingReport = await Report.findOne({
          call_id: report.call_id,
        });

        if (existingReport) {
          throw new Error("This report has already been created");
        }

        const newReport = new Report({ ...report });

        await newReport.save();
        return newReport;
      } catch (error) {
        throw new Error("Unable to create report");
      }
    },

    editReport: async (_, { report }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Check if the engineer exists
        const availableEngineer = await Engineer.findOne({
          eng_emp: report.engineer_EMP,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        // Use findByIdAndUpdate to find and update the report
        const updatedReport = await Report.findOneAndUpdate(
          { createdId: report.createdId },
          {
            $set: {
              date: report.date,
              time: report.time,
              pdf: report.pdf,
              engineer_EMP: report.engineer_EMP,
              engineer_name: report.engineer_name.toLowerCase(),
              company: report.company.toLowerCase(),
            },
          },
          { new: true }
        );

        if (!updatedReport) {
          throw new Error("Report does not exist");
        }

        return updatedReport;
      } catch (error) {
        // console.error("Error updating report:", error.message);
        throw new Error(error.message);
      }
    },

    deleteReport: async (_, { _id }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Use findByIdAndDelete to find and delete the report
        const deleteReport = await Report.findOneAndDelete({
          _id: _id,
        });

        if (!deleteReport) {
          throw new Error("Report does not exist");
        }

        return {
          message: "Report deleted successfully",
        };
      } catch (error) {
        // console.error("Error deleting report:", error.message);
        throw new Error(error.message);
      }
    },

    createExpenseReport: async (_, { expenseReport }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const availableEngineer = await Engineer.findOne({
          eng_emp: expenseReport.eng_emp,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const existingReport = await ExpenseReport.findOne({
          call_id: expenseReport.call_id,
        });

        if (existingReport) {
          throw new Error("This report has been already created");
        }

        const existsCallId = await Call.findOne({
          call_id: expenseReport.call_id,
        });

        if (!existsCallId) {
          throw new Error("Call id does not exist");
        }

        const reportNew = new ExpenseReport({
          ...expenseReport,
          eng_name: expenseReport.eng_name.toLowerCase(),
        });

        try {
          await reportNew.save();
          const response = {
            call_id: reportNew.call_id,
            message: "Expense report submitted",
          };
          return response;
        } catch (error) {
          // console.error(error.message);
          throw new Error("Unable to save expenses report");
        }
      } catch (error) {
        // console.error("Error creating expense report:", error.message);
        throw new Error(error.message);
      }
    },

    updateExpenseReport: async (_, { upExpReport }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Check if the engineer exists
        const availableEngineer = await Engineer.findOne({
          eng_emp: upExpReport.engineer_EMP,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        // Use findByIdAndUpdate to find and update the report
        const updatedExpReport = await ExpenseReport.findOneAndUpdate(
          { _id: upExpReport._id },
          {
            $set: {
              date: upExpReport.date,
              time: upExpReport.time,
              eng_emp: upExpReport.engineer_EMP,
              eng_name: upExpReport.engineer_name,
              company_name: upExpReport.company_name,
              company_location: upExpReport.company_location,
              call_id: upExpReport.call_id,
              total_kilometer: upExpReport.total_kilometer,
              expense_amount: upExpReport.expense_amount,
              isApprove: upExpReport.isApprove,
              eng_desc: upExpReport.eng_desc,
              admin_desc: upExpReport.admin_desc,
            },
          },
          { new: true }
        );

        if (!updatedExpReport) {
          throw new Error("Expense report does not exist");
        }

        return updatedExpReport;
      } catch (error) {
        // console.error("Error updating report:", error.message);
        throw new Error(error.message);
      }
    },

    approveExpenseReport: async (
      _,
      { call_id, approveStatus, admin_desc },
      { userId }
    ) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // const existsReport = await ExpenseReport.findOne({ call_id: call_id });

        const existsCallId = await Call.findOne({ call_id: call_id });

        // if (existsReport) {
        //   throw new Error("Expense report already exist");
        // }

        const expenseReport = await ExpenseReport.findOne({ call_id: call_id });

        let reportStatus;

        if (existsCallId) {
          if (approveStatus == "APPROVE") {
            reportStatus = await ExpenseReport.findOneAndUpdate(
              { call_id: call_id },
              {
                $set: {
                  isApprove: approveStatus,
                  status: approveStatus,
                  admin_desc: "Report approved",
                },
              },
              { new: true }
            );

            await Call.findOneAndUpdate(
              { call_id: call_id },
              {
                $set: {
                  expense_amount: expenseReport.expense_amount,
                },
              },
              { new: true }
            );
          } else if (approveStatus == "REJECT") {
            reportStatus = await ExpenseReport.findOneAndUpdate(
              { call_id: call_id },
              {
                $set: {
                  isApprove: approveStatus,
                  status: approveStatus,
                  admin_desc: admin_desc,
                },
              },
              { new: true }
            );

            await Call.findOneAndUpdate(
              { call_id: call_id },
              {
                $set: {
                  expense_amount: "",
                },
              },
              { new: true }
            );
          }
        } else {
          throw new Error("Call id does not exist");
        }

        return reportStatus;
      } catch (error) {
        // console.error("Error approving report:", error.message);
        throw new Error(error.message);
      }
    },

    deleteExpReport: async (_, { _id }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Use findByIdAndDelete to find and delete the report
        const deleteExpReport = await ExpenseReport.findOneAndDelete({
          _id: _id,
        });

        if (!deleteExpReport) {
          throw new Error("Expense report does not exist");
        }

        return {
          message: "Expense report deleted successfully",
        };
      } catch (error) {
        // console.error("Error deleting report:", error.message);
        throw new Error(error.message);
      }
    },

    createCall: async (_, { call }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const availableEngineer = await Engineer.findOne({
          eng_emp: call.eng_emp,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const existingCall = await Call.findOne({
          call_id: call.call_id,
        });

        if (existingCall) {
          throw new Error("This call id already exists");
        }

        const callNew = new Call({
          ...call,
          eng_name: call.eng_name.toLowerCase(),
        });

        try {
          await callNew.save();
          return {
            message: "Call created",
          };
        } catch (error) {
          // console.error(error.message);
          throw new Error("Unable to create call");
        }
      } catch (error) {
        // console.error("Error creating call:", error.message);
        throw new Error(error.message);
      }
    },

    updateCallByEng: async (
      _,
      { call_id, eng_emp, updateCall },
      { userId }
    ) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Check if the engineer exists
        const availableEngineer = await Engineer.findOne({
          eng_emp: eng_emp,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const existingCall = await Call.findOne({
          call_id: call_id,
          eng_emp: eng_emp,
        });

        if (!existingCall) {
          throw new Error("Call does not exist");
        }

        if (existingCall.completed) {
          throw new Error("Call is already completed");
        }

        const exitingReport = await Report.findOne({
          call_id: call_id,
        });

        if (!existingCall) {
          throw new Error("Report does not exist");
        }

        const updatedCall = await Call.findOneAndUpdate(
          { call_id: call_id, eng_emp: eng_emp },
          {
            $set: {
              status: updateCall.status,
              submit_date: updateCall.submit_date,
              completed: true,
              report: updateCall.report,
              site_images: exitingReport.site_images,
            },
          },
          { new: true }
        );

        return updatedCall;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    editCall_by_Admin: async (_, { call }) => {
      try {
        const existingCall = await Call.findOne({ call_id: call.call_id });

        if (!existingCall) {
          throw new Error("Call does not exist");
        }

        const editedCall = await Call.findOneAndUpdate(
          { call_id: call.call_id },
          {
            $set: {
              company_name: call.company_name,
              company_details: call.company_details,
              company_location: call.company_location,
              company_address: call.company_address,
              eng_name: call.eng_name,
              eng_emp: call.eng_emp,
              assigned_date: call.assigned_date,
              assigned_time: call.assigned_time,
              admin_desc: call.admin_desc,
              customer_contact: call.customer_contact,
              submit_date:
                call.submit_date === "-" ? undefined : call.submit_date,
              visit_date:
                call.visit_date === "-" ? undefined : call.submit_date,
              completed: call.completed,
              expense_amount: call.expense_amount.split(" | ")[0], // Extracting the value before " | "
              report: call.report === "-" ? undefined : call.report,
            },
          },
          { new: true }
        );

        if (!editedCall) {
          throw new Error("Error updating call");
        }

        return editedCall;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateCallStatus: async (_, { _id, status }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const updateCallStatus = await Call.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              status: status,
            },
          },
          { new: true }
        );

        if (!updateCallStatus) {
          throw new Error("Call does not exist");
        }

        return updateCallStatus;
      } catch (error) {
        // console.error("Error approving call:", error.message);
        throw new Error(error.message);
      }
    },

    rescheduleCall: async (_, { call }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const rescheduleCall = await Call.findOneAndUpdate(
          { call_id: call.call_id },
          {
            $set: {
              visit_date: call.visit_date,
              eng_desc: call.eng_desc,
            },
          },
          { new: true }
        );

        if (!rescheduleCall) {
          throw new Error("Call does not exist");
        }

        return rescheduleCall;
      } catch (error) {
        // console.error("Error approving call:", error.message);
        throw new Error(error.message);
      }
    },

    deleteCall: async (_, { _id }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Use findByIdAndDelete to find and delete the report
        const deleteCall = await Call.findOneAndDelete({
          _id: _id,
        });

        if (!deleteCall) {
          throw new Error("Call does not exist");
        }

        return {
          message: "Call deleted successfully",
        };
      } catch (error) {
        // console.error("Error deleting call:", error.message);
        throw new Error(error.message);
      }
    },

    submitAttendence: async (_, { attendence }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const availableEngineer = await Engineer.findOne({
          eng_emp: attendence.eng_emp,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const submitedAttendence = new Attendence({
          ...attendence,
          date: attendence.date,
          time: attendence.time,
          eng_name: attendence.eng_name.toLowerCase(),
        });
        console.log(submitedAttendence);
        try {
          await submitedAttendence.save();
          const response = {
            eng_name: attendence.eng_name,
            eng_emp: attendence.eng_emp,
            message: "Successfully log in",
          };

          return response;
        } catch (error) {
          console.error(error.message);
          throw new Error("Unable to save attendence");
        }
      } catch (error) {
        // console.error("Error creating expense report:", error.message);
        throw new Error(error.message);
      }
    },

    // sendPdf: async (_, { pdf_link, customer_num }, { userId }) => {
    //   try {
    //     if (!userId) {
    //       throw new Error("Authentication required");
    //     }

    //     await new Promise((resolve) => {
    //       client.on("ready", resolve);
    //     });

    //     const chatId = customer_num.substring(1) + "@c.us";
    //     const response = await client.sendMessage(chatId, pdf_link);

    //     return `Pdf sent successfully: ${response}`;
    //   } catch (error) {
    //     throw new Error("Failed to send message");
    //   }
    // },
  },
};

export default resolvers;
