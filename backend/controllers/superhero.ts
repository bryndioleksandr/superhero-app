import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import Superhero from "../models/superhero";
import mongoose from "mongoose";
import { Request, Response } from 'express';
import { UploadApiResponse } from "cloudinary";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createSuperhero = async (req: Request, res: Response) => {
    try {
        upload.array("images", 5)(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const superheroData = req.body;

            const files = req.files as Express.Multer.File[];

            const uploadedImages: string[] = [];

            try {
                for (const file of files) {
                    const result = await new Promise<UploadApiResponse>(async (resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {folder: "superheros"},
                            (error, result) => {
                                if (error) return reject(error);
                                if (!result) return reject(new Error("No result from Cloudinary"));
                                resolve(result);
                            }
                        );
                        stream.end(file.buffer);
                    });
                    uploadedImages.push(result.secure_url);
                }
            }
            catch (uploadError) {
                return res.status(500).json({ msg: "error uploading images" });
            }

            const newSuperhero = new Superhero({
                ...superheroData,
                images: uploadedImages,
            });

            await newSuperhero.save();
            res.status(200).json(newSuperhero);
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "server error" });
    }
};

export const updateSuperhero = async (req: Request, res: Response) => {
    try {
        upload.array("images", 5)(req, res, async (err) => {
            if (err) return res.status(400).json({ message: "image upload error" });

            const { id } = req.params;
            const updates = req.body;
            const files = req.files as Express.Multer.File[];
            const newImages: string[] = [];

            if (files && files.length > 0) {
                try {
                    for (const file of files) {
                        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                            const stream = cloudinary.uploader.upload_stream(
                                { folder: "superheros" },
                                (error, result) => {
                                    if (error) reject(error);
                                    else resolve(result!);
                                }
                            );
                            stream.end(file.buffer);
                        });
                        newImages.push(result.secure_url);
                    }
                } catch (uploadError) {
                    return res.status(500).json({ message: "cloudinary error" });
                }
            }

            const oldSuperhero = await Superhero.findById(id);
            if (!oldSuperhero) return res.status(404).json({ message: "superhero not found" });

            const updatedImages = [...oldSuperhero.images, ...newImages];

            const updatedSuperhero = await Superhero.findByIdAndUpdate(
                id,
                { ...updates, images: updatedImages },
                { new: true }
            );

            res.status(200).json(updatedSuperhero);
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "server error" });
    }
};

export const getAllSuperheros = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        const superheroes = await Superhero.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Superhero.countDocuments();

        res.status(200).json({
            superheroes,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "server error" });
    }
};

export const getSuperhero = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const superhero = await Superhero.findById(id);

        if (!superhero) {
            return res.status(404).json({ message: "superhero not found" });
        }

        res.status(200).json(superhero);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "server error" });
    }
};

export const deleteSuperhero = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedSuperhero = await Superhero.findByIdAndDelete(id);

        if (!deletedSuperhero) {
            return res.status(404).json({ message: "superhero not found" });
        }

        res.status(200).json({ message: "superhero deleted" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "server error" });
    }
};

