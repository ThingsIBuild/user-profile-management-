import { Router } from "express";
import { getSystemInfo } from "./system.controller";

const router = Router();

router.get("/info", getSystemInfo);

export default router;