import express from "express";
import superheroRouter from "./superhero";

const router = express.Router();

router.use("/superheros", superheroRouter);

export default router;
