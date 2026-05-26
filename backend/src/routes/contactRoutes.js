import express from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
  markAsRead,
} from "../controllers/contactController.js";

const router = express.Router();

// Public Route - Anyone can submit contact form
router.post("/", createContact);

// Admin Routes
router.get("/", getAllContacts);
router.delete("/:id", deleteContact);
router.patch("/:id/read", markAsRead);

export default router;
