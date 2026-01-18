import express from 'express';
import {
    createSuperhero, deleteSingleImage,
    deleteSuperhero,
    getAllSuperheros,
    getSuperhero,
    updateSuperhero
} from "../controllers/superhero";

const superheroRouter = express.Router();

superheroRouter.post("/", createSuperhero);
superheroRouter.put("/:id", updateSuperhero);
superheroRouter.get("/all", getAllSuperheros);
superheroRouter.get("/:id", getSuperhero);
superheroRouter.delete("/:id", deleteSuperhero);
superheroRouter.delete("/:id/image", deleteSingleImage);

export default superheroRouter;
