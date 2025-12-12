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