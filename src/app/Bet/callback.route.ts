import express from "express";
import { generateTestPayload, handleCallback } from "./callback.controller";

export const callbackRoute = express.Router();

// small parsers for Postman JSON form
callbackRoute.use(express.urlencoded({ extended: true, limit: "32kb" }));
callbackRoute.use(express.json({ limit: "32kb" }));

// Both GET & POST supported (for easy manual tests)
// callbackRoute.get("/test-payload", generateTestPayload);
// somewhere in your routes file
callbackRoute.get("/test-payload", generateTestPayload);

callbackRoute.get("/", handleCallback);
callbackRoute.post("/", handleCallback);
