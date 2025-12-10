import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import {getEvents} from "../controllers/event.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/events", getEvents);
export default router;
