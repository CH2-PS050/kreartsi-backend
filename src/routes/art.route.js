import { Router } from "express";
import multer from "multer";
import {
  getArts,
  getMyArts,
  getArtById,
  likeArt,
  isLikedArt,
  unlikeArt,
  uploadArt,
  donation,
  getDonationHistory,
  saveArt,
  unsaveArt,
  isSavedArt,
  deleteArt,
  editArtCaption,
  getMySavedArts,
} from "../controllers/art.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/", getArts);
router.get("/my-arts", getMyArts);
router.get("/my-saved-arts", getMySavedArts);
router.get("/:artworkId", getArtById);

router.post("/upload", upload.single("file"), uploadArt);
router.delete("/:artworkId", deleteArt);
router.put("/caption/:artworkId", editArtCaption);

router.post("/like/:artworkId", likeArt);
router.post("/unlike/:artworkId", unlikeArt);
router.get("/isliked/:artworkId", isLikedArt);

router.post("/save/:artworkId", saveArt);
router.delete("/unsave/:artworkId", unsaveArt);
router.get("/issaved/:artworkId", isSavedArt);

router.post("/donate/:userId", donation); // user_id = recipient_user_id (yg nerima koin)
router.get("/donate/history", getDonationHistory);

export { router as artRouter };
