const prisma = require("../db");

exports.getFeed = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profilePicture: true,
          },
        },
        likes: {
          select: { userId: true },
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Get feed error:", error);
    res.status(500).json({ error: "Failed to fetch the feed" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { body, gitLink, repoLink } = req.body;
    const userId = req.user.userId;

    let attachment = null;
    let public_id = null;

    if (req.file) {
      attachment = req.file.path;
      public_id = req.file.filename;
    }

    if (!body && !attachment) {
      return res
        .status(400)
        .json({ error: "Post must contain either text or an image." });
    }

    const newPost = await prisma.post.create({
      data: {
        body: body || "",
        gitLink,
        repoLink,
        attachment,
        public_id,
        userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profilePicture: true,
          },
        },
        likes: true,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.userId;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({ where: { id: existingLike.id } });
      return res.status(200).json({ message: "Post unliked" });
    } else {
      await prisma.postLike.create({
        data: { userId, postId },
      });
      return res.status(200).json({ message: "Post liked" });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};
