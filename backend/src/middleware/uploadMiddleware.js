import multer from "multer";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { AppError } from "./error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Allowed MIME types ───────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// ─── Safe disk storage (randomized filenames, no path traversal) ──────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Resolve to an absolute path so multer always writes to the same folder
    // regardless of the working directory the server was started from.
    const uploadDir = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(__dirname, "../../../uploads"); // backend/uploads
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Cryptographically random filename — never trust original filename
    const safeName = `${Date.now()}-${crypto.randomBytes(16).toString("hex")}${ext}`;
    cb(null, safeName);
  },
});

// ─── File filter: check MIME + extension ─────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new AppError(
        `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
        400
      ),
      false
    );
  }
  cb(null, true);
};

// ─── Max size from env (default 5 MB) ────────────────────────────────────────
const MAX_SIZE_BYTES = (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
});

// ─── Multer error handler wrapper ─────────────────────────────────────────────
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError(`File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 5}MB`, 400));
    }
    return next(new AppError(`Upload error: ${err.message}`, 400));
  }
  next(err);
};

export default upload;
