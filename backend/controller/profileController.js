const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET profile by userId
exports.getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update profile (authenticated)
exports.updateProfile = async (req, res) => {
    try {
        const authUserId = req.user && req.user.id ? Number(req.user.id) : null;
        const userId = parseInt(req.params.userId);
        
        if (authUserId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { bio, avatarUrl } = req.body;
        
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { bio, avatarUrl },
        });
        
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });   
      
    }
};

// DELETE profile (authenticated)