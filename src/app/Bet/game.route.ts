// src/routes/game.route.ts
import express, { Router } from "express";
import { launchGame, newlaunchGame } from "./game.controller";

const router = Router();

// 👇 add parsers here
router.use(express.urlencoded({ extended: true, limit: "32kb" }));
router.use(express.json({ limit: "32kb" }));

router.get("/", launchGame);
router.post("/", launchGame);

export const launchGameRoute = router;
