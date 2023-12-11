import { Router } from "express";
import {
  getArts,
  getMyArts,
  getArtById,
  likeArt,
  unlikeArt,
  uploadArt,
  donation,
  getDonationHistory,
  saveArt,
  unsaveArt,
  deleteArt,
  editArtCaption,
  getMySavedArts,
} from "../controllers/art.controller";

const router = Router();

router.get("/", getArts);
router.get("/myarts", getMyArts);
router.get("/my-saved-arts", getMySavedArts);
router.get("/:artwork_id", getArtById);

router.post("/upload", uploadArt);
router.delete("/:artworkId", deleteArt);
router.put("/caption/:artworkId", editArtCaption);

router.post("/like/:artwork_id", likeArt);
router.post("/unlike/:artwork_id", unlikeArt);

router.post("/save/:artworkId", saveArt);
router.delete("/unsave/:artworkId", unsaveArt);

router.post("/donate/:user_id", donation); // user_id = recipient_user_id (yg nerima koin)
router.get("/donate/history", getDonationHistory);

export { router as artRouter };
