import express from "express";
import statusRoutes from "./routes/statusRoutes";
import apiV1 from "./routes/v1"

const router = express.Router();

router.use("/status", statusRoutes);

router.use("/v1", apiV1)

export default router;