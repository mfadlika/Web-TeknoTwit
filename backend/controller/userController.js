const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};