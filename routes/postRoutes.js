const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/", authMiddleware, postController.getFeed);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost,
);

router.post("/:postId/like", authMiddleware, postController.toggleLike);

module.exports = router;
