import dotenv from "dotenv";
dotenv.config();

console.log("DB_USER:", process.env.DB_USER);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
