import dotenv from "dotenv"
import path from "path"

const NODE_ENV = process.env.NODE_ENV || "development"




dotenv.config({
    path:path.resolve(process.cwd(), `.env.${NODE_ENV}`)
})


const required = (key:string):string => {
    const value = process.env[key]
 
    if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
    return value
}

export const env = {
  NODE_ENV,

  PORT: required("PORT"),
  MONGO_URI: required("MONGO_URI"),

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: required("JWT_EXPIRES_IN"),

  REFRESH_TOKEN_SECRET: required("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRES_IN: required("REFRESH_TOKEN_EXPIRES_IN"),

  EMAIL_HOST: required("EMAIL_HOST"),
  EMAIL_PORT: required("EMAIL_PORT"),
  EMAIL_USER: required("EMAIL_USER"),
  EMAIL_PASS: required("EMAIL_PASS")
};