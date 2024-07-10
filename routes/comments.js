const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../verifyToken");

router.post("/create", verifyToken, commentController.createComment);
router.put("/:id", verifyToken, commentController.updateComment);
router.delete("/:id", verifyToken, commentController.deleteComment);
router.get("/post/:postId", commentController.getCommentsByPostId);

module.exports = router;
