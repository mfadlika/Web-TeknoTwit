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