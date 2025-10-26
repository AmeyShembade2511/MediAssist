import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

console.log("DB_USER:", process.env.ACCESS_TOKEN_EXPIRES);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
