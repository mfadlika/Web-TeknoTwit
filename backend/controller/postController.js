const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET post by ID
exports.getPost = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET posts by user ID
exports.getPostsByUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const posts = await prisma.post.findMany({
      where: { userId },
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new post (authenticated)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    // prefer authenticated user id from middleware
    const authUserId = req.user && req.user.id ? Number(req.user.id) : null;
    const bodyUserId = req.body.userId ? Number(req.body.userId) : null;
    const userId = authUserId || bodyUserId;

    if (!title || !content || !userId) {
      return res
        .status(400)
        .json({ message: "Missing required fields or unauthorized" });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: Number(userId),
      },
    });

    res.json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
