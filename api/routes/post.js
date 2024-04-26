const express = require("express");
const Post = require("../models/post");
const router = express.Router();

router.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newPostData = {
      user: userId,
    };

    if (content) {
      newPostData.content = content;
    }

    const newPost = new Post(newPostData);

    await newPost.save();

    res.status(200).json({ message: "Yazı başarıyla oluşturuldu" });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
    res.status(500).json({ message: "Yazı oluşturulurken hata" });
  }
});

// like
router.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "yazı bulunamadı" });
    }

    updatedPost.user = post.user;

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log("🚀 ~ router.put ~ error:", error);
    res.status(500).json({ message: "Beğenirken hata oluştur" });
  }
});

// unlike
router.put("/post/:postId/:userId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "yazı bulunamadı" });
    }

    updatedPost.user = post.user;

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log("🚀 ~ router.put ~ error:", error);
    res.status(500).json({ message: "Beğenirken hata oluştur" });
  }
});

router.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

      res.status(200).json(posts)
  } catch (error) {
    console.log("🚀 ~ router.get ~ error:", error);
  }
});

router.get("/user/:userId/posts", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPosts = await Post.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(userPosts);
  } catch (error) {
    console.error("🚀 ~ router.get ~ error:", error);
    res.status(500).json({ message: "Gönderiler alınırken hata oluştu" });
  }
});


module.exports = router;
