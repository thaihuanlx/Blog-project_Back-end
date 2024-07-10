const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const verifyToken = require("../verifyToken");

//CREATE
router.post("/create", verifyToken, postsController.createPost);
router.put("/:id", verifyToken, postsController.updatePost);
router.delete("/:id", verifyToken, postsController.deletePost);
router.get("/:id", postsController.getPostDetails);
router.get("/", postsController.getPosts);
router.get("/user/:userId", postsController.getUserPosts);

module.exports = router;
