import express from "express";
import CommentService from "../businesslayer/commentService";
import { checkJwt, checkPermissions } from "../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const comments = await CommentService.getComments();
    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const comment = await CommentService.getCommentById(req.params.id);
    res.json(comment);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const comment = await CommentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const comment = await CommentService.updateComment(req.params.id, req.body);
    res.json(comment);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.patch("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const comment = await CommentService.updateComment(req.params.id, req.body);
    res.json(comment);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.delete("/:id", checkJwt, checkPermissions(), async (req, res) => {
  try {
    const comment = await CommentService.deleteComment(req.params.id);
    res.json(comment);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
