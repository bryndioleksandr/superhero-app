import express from "express";
import superheroRouter from "./superhero";

const router = express.Router();

router.use("/superheroes", superheroRouter);

export default router;
