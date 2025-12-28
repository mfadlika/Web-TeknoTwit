const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    // fetch users for posts to include user name
    const userIds = Array.from(
      new Set(posts.map((p) => p.userId).filter(Boolean))
    );
    let users = [];
    if (userIds.length) {
      users = await prisma.user.findMany({ where: { id: { in: userIds } } });
    }
    const usersById = Object.fromEntries(users.map((u) => [u.id, u]));

    const postsWithUser = posts.map((p) => ({
      ...p,
      user: usersById[p.userId] || null,
    }));

    res.json(postsWithUser);
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

    // attach user
    const user = await prisma.user.findUnique({ where: { id: post.userId } });
    res.json({ ...post, user });
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

    // attach user info (single user)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const postsWithUser = posts.map((p) => ({ ...p, user }));

    res.json(postsWithUser);
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

    // attach user to response
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    res.json({
      message: "Post created successfully",
      post: { ...post, user },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
