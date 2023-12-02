import jwt from "jsonwebtoken";
import { Admin } from "../app/modules/admin/admin.model.js";
import { Engineer } from "../app/modules/engineer/engineer.model.js";
import { User } from "../app/modules/user/user.model.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import generateRandomNumber from "../utils/randomNum.js";
import { Report } from "../app/modules/report/report.model.js";
import { ExpenseReport } from "../app/modules/expenseReport/expenseReport.model.js";
import { Call } from "../app/modules/call/call.model.js";

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

    engineer: async (_, { EMP_id }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const engineer = await Engineer.findOne({ EMP_id: EMP_id });

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

    report: async (_, { createdId }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const report = await Report.findOne({ createdId: createdId });
      console.log(createdId);

      if (!report) throw new Error("Report not found");

      return report;
    },

    reportByCompany: async (_, { company }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const report = await Report.find({
        company: { $regex: new RegExp(company, "i") },
      });

      if (!report || report.length === 0) throw new Error("Report not found");

      return report;
    },

    reportByEngineer: async (_, { engineer_EMP }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const report = await Report.find({ engineer_EMP: engineer_EMP });

      if (!report) throw new Error("Report not found");

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

    allExpenseReports: async (_, __, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const expenseReports = await ExpenseReport.find();

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

    allCalls: async (_, __, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }

      const calls = await Call.find();

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

    callsByEng: async (_, { eng_emp }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      
      const availableEngineer = await Engineer.findOne({
        EMP_id: eng_emp,
      });

      if (!availableEngineer) {
        throw new Error("Engineer does not exist");
      }


      const calls = await Call.find({ eng_emp: eng_emp });

      if (!calls || calls.length === 0) throw new Error("Calls not found");

      return calls;
    },

    callsByDate: async (_, { date }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      const calls = await Call.find({ date: date });

      if (!calls || calls.length === 0) {
        throw new Error("No calls found for the given date");
      }

      return calls;
    },
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
          console.error(error.message);
          throw new Error("Unable to save admin");
        }
      } catch (error) {
        console.error("Error creating engineer:", error);
        throw new Error("Unable to create admin");
      }
    },
    createEngineer: async (_, { engineer, adminId }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      try {
        const existingEng = await Engineer.findOne({ email: engineer.email });
        const isAdmin = await Admin.findById(adminId);

        if (!isAdmin) {
          throw new Error("Admin id is not true");
        }

        if (existingEng) {
          throw new Error("Email already in use");
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
          console.error(error.message);
          throw new Error("Unable to create engineer");
        }
      } catch (error) {
        // console.error("Error creating engineer:", error);
        throw new Error(error.message);
      }
    },

    loginUser: async (_, { userLogin }) => {
      const user = await User.findOne({ email: userLogin.email });
      if (!user) {
        throw new Error("User dosent exists with that email");
      }

      const doMatch = await bcrypt.compare(userLogin.password, user.password);
      if (!doMatch) {
        throw new Error("wrong credentials");
      }
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        config.jwt_secret,
        {
          expiresIn: "1h",
        }
      );
      return { token };
    },

    forgotPassword: async (_, { email }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Generate a unique reset password token and set an expiration time
      const resetPasswordToken = jwt.sign(
        { userId: user._id },
        config.jwt_secret,
        { expiresIn: "1h" }
      );

      // Log the token (remove this in production)
      // console.log("Reset Password Token:", resetPasswordToken);

      // Send the reset password token to the user via email or other means

      return {
        token: resetPasswordToken,
        message: "Password reset token sent",
      };
    },

    resetPassword: async (_, { newPassword }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const user = await User.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        if (!newPassword) {
          throw new Error("New password is required");
        }

        // Hash the new password and update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        // Save the updated user document
        await user.save();

        // Generate a new token for the user and return it
        const newToken = jwt.sign({ userId: user._id }, config.jwt_secret, {
          expiresIn: "1h",
        });

        return { token: newToken };
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw new Error(
            "Token has expired. Please generate a new reset password token."
          );
        } else {
          console.error(err);
          throw new Error("Invalid token or password");
        }
      }
    },

    createReport: async (_, { report }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const availableEngineer = await Engineer.findOne({
          EMP_id: report.engineer_EMP,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const existingReport = await Report.findOne({
          createdId: report.createdId,
        });

        if (existingReport) {
          throw new Error("This report has already been created");
        }

        const makeCreatedId = generateRandomNumber(100, 999);

        const reportNew = new Report({
          ...report,
          engineer_name: report.engineer_name.toLowerCase(),
          company: report.company.toLowerCase(),
          createdId: makeCreatedId,
        });

        try {
          await reportNew.save();
          return reportNew;
        } catch (error) {
          console.error(error.message);
          throw new Error("Unable to save report");
        }
      } catch (error) {
        console.error("Error creating report:", error.message);
        throw new Error(error.message);
      }
    },

    editReport: async (_, { report }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Check if the engineer exists
        const availableEngineer = await Engineer.findOne({
          EMP_id: report.engineer_EMP,
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
        console.error("Error updating report:", error.message);
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
        console.error("Error deleting report:", error.message);
        throw new Error(error.message);
      }
    },

    createExpenseReport: async (_, { expenseReport }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const availableEngineer = await Engineer.findOne({
          EMP_id: expenseReport.engineer_EMP,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const existingReport = await ExpenseReport.findOne({
          _id: expenseReport._id,
        });

        if (existingReport) {
          throw new Error("This report has already been created");
        }

        const reportNew = new ExpenseReport({
          ...expenseReport,
          engineer_name: expenseReport.engineer_name.toLowerCase(),
          location: expenseReport.location.toLowerCase(),
        });

        try {
          await reportNew.save();
          return reportNew;
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
          EMP_id: upExpReport.engineer_EMP,
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
              amount: upExpReport.amount,
              engineer_EMP: upExpReport.engineer_EMP,
              engineer_name: upExpReport.engineer_name.toLowerCase(),
              location: upExpReport.location.toLowerCase(),
            },
          },
          { new: true }
        );

        if (!updatedExpReport) {
          throw new Error("Expense report does not exist");
        }

        return updatedExpReport;
      } catch (error) {
        console.error("Error updating report:", error.message);
        throw new Error(error.message);
      }
    },

    approveExpenseReport: async (_, { _id, approveExpReport }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        if (approveExpReport === true) {
          const approvedExpReport = await ExpenseReport.findOneAndUpdate(
            { _id: _id },
            {
              $set: {
                isApprove: approveExpReport,
              },
            },
            { new: true }
          );

          if (!approvedExpReport) {
            throw new Error("Expense report does not exist");
          }

          return approvedExpReport;
        } else {
          throw new Error("Invalid data provided");
        }
      } catch (error) {
        console.error("Error approving report:", error.message);
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
        console.error("Error deleting report:", error.message);
        throw new Error(error.message);
      }
    },

    createCall: async (_, { call }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        const availableEngineer = await Engineer.findOne({
          EMP_id: call.eng_emp,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        const callNew = new Call({
          ...call,
          assign_eng: call.assign_eng.toLowerCase(),
          location: call.location.toLowerCase(),
        });

        try {
          await callNew.save();
          return callNew;
        } catch (error) {
          console.error(error.message);
          throw new Error("Unable to save call");
        }
      } catch (error) {
        console.error("Error creating call:", error.message);
        throw new Error(error.message);
      }
    },

    editCall: async (_, { call }, { userId }) => {
      try {
        if (!userId) {
          throw new Error("Authentication required");
        }

        // Check if the engineer exists
        const availableEngineer = await Engineer.findOne({
          EMP_id: call.eng_emp,
        });

        if (!availableEngineer) {
          throw new Error("Engineer does not exist");
        }

        // Use findByIdAndUpdate to find and update the report
        const editedCall = await Call.findOneAndUpdate(
          { _id: call._id },
          {
            $set: {
              date: call.date,
              time: call.time,
              amount: call.amount,
              location: call.location.toLowerCase(),
              assign_eng: call.assign_eng.toLowerCase(),
              eng_emp: call.eng_emp,
            },
          },
          { new: true }
        );

        if (!editedCall) {
          throw new Error("Call does not exist");
        }

        return editedCall;
      } catch (error) {
        console.error("Error updating call:", error.message);
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
        console.error("Error approving call:", error.message);
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
        console.error("Error deleting call:", error.message);
        throw new Error(error.message);
      }
    },
  },
};

export default resolvers;
