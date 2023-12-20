import { Router } from "express";
import multer from "multer";
import { authentication } from "../middlewares/authentication.js";
import {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  getMyData,
  editProfilePicture,
  searchUsers,
} from "../controllers/user.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(authentication);
router.get("/my-data", getMyData);
router.put("/editprofile", upload.single("file"), editProfilePicture);
router.get("/search", searchUsers);
router.get("/:userId", getUserById);

export { router as userRouter };
