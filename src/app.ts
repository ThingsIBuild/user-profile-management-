import express , {type Application , type Request, type Response} from "express"
import cors from "cors"
import systemRoutes from "./modules/system/system.routes"
import { getDBStatus } from "./config/db"
import path from "node:path"
import {requestLogger} from './middleware/logger.middleware'

const app:Application  = express()

app.use(requestLogger)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"*",
    credentials:true
}))

// 👇 SET VIEW ENGINE
app.set("view engine", "ejs");

// 👇 SET VIEWS DIRECTORY
app.set("views", path.join(__dirname, "../src/views"));


app.use('/api/system', systemRoutes)

app.get("/", (req: Request, res: Response) => {
  const db = getDBStatus();

  res.render("index", {
    env: process.env.NODE_ENV,
    uptime: `${Math.floor(process.uptime())} sec`,
    db
  });
});


export default app;