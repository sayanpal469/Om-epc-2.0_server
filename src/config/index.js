import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  db_url:
    "mongodb+srv://sayanpal469:MAAIeb6t1Iuj8a2m@cluster0.hclda9t.mongodb.net/",
  jwt_secret: "hbdjcbdbcicbkjnxzcn",
};
