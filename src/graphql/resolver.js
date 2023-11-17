import jwt from "jsonwebtoken";
import { Admin } from "../app/modules/admin/admin.model.js";
import { Engineer } from "../app/modules/engineer/engineer.model.js";
import { User } from "../app/modules/user/user.model.js";
import bcrypt from "bcrypt";
import config from "../config/index.js";

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

        try {
          await adminNew.save();
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
    createEngineer: async (_, { engineer }, { userId }) => {
      if (!userId) {
        // If the user is not authenticated (no token), throw an error
        throw new Error("Authentication required");
      }
      try {
        const existingEng = await Engineer.findOne({ email: engineer.email });

        if (existingEng) {
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(engineer.password, 12);

        const engNew = new Engineer({
          ...engineer,
          password: hashedPassword,
        });

        try {
          await engNew.save();
          return engNew;
        } catch (error) {
          console.error(error.message);
          throw new Error("Unable to save engineer");
        }
      } catch (error) {
        // console.error("Error creating engineer:", error);
        throw new Error(error.message);
      }
    },
    createUser: async (_, { newUser }) => {
      const existingUser = await User.findOne({ email: newUser.email });
      const isEngineer = await Engineer.findOne({
        $and: [{ _id: newUser.engineer }, { email: newUser.email }],
      });
      const isAdmin = await Admin.findOne({
        $and: [{ $or: [{ _id: newUser.admin }, { email: newUser.email }] }],
      });

      if (!isAdmin) {
        throw new Error("Admin id not match");
      }

      if (existingUser) {
        throw new Error("Email already in use");
      } else if (!isEngineer && isAdmin && newUser.role !== "Engineer") {
        // Create a user with the role set to "Admin" and the corresponding admin ID
        if (isAdmin.email !== newUser.email) {
          throw new Error("Admin email not match");
        }
        const hashedPassword = await bcrypt.hash(newUser.password, 12);
        const userNew = new User({
          ...newUser,
          password: hashedPassword,
          role: "Admin",
          engineer: null,
        });

        try {
          await userNew.save();
          return userNew;
        } catch (error) {
          console.error("Error creating user:", error);
          throw new Error("Unable to create user");
        }
      } else if (isEngineer && newUser.role !== "Engineer") {
        throw new Error("Engineer found but the role is not 'Engineer'");
      } else if (!isEngineer) {
        if (!isAdmin) {
          throw new Error("Engineer not found and Admin not found");
        } else {
          throw new Error("Engineer not found");
        }
      }

      // If an engineer is found and the role is "Engineer," create the user with the engineer's ID
      const hashedPassword = await bcrypt.hash(newUser.password, 12);
      const userNew = new User({
        ...newUser,
        password: hashedPassword,
        engineer: isEngineer._id,
      });

      try {
        await userNew.save();
        return userNew;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Unable to create user");
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
      const token = jwt.sign({ userId: user._id }, config.jwt_secret, {
        expiresIn: "1h",
      });
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
  },
};

export default resolvers;
