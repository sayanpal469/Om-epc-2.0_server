import { Admin } from "../app/modules/admin/admin.model.js";
import { Engineer } from "../app/modules/engineer/engineer.model.js";
import { User } from "../app/modules/user/user.model.js";
import bcrypt from "bcrypt";

const resolvers = {
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
    createEngineer: async (_, { engineer }) => {
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
        console.error("Error creating engineer:", error);
        throw new Error("Unable to create engineer");
      }
    },
    createUser: async (_, { newUser }) => {
      const existingUser = await User.findOne({ email: newUser.email });

      if (existingUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(newUser.password, 12);

      const userNew = new User({
        ...newUser,
        password: hashedPassword,
      });

      try {
        await userNew.save();
        return userNew;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Unable to create user");
      }
    },
  },
};

export default resolvers;
