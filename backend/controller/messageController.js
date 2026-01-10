const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getAuthUserId(req) {
  return req.user && req.user.id ? Number(req.user.id) : null;
}


exports.sendMessage = async (req, res) => {
  try {
    const senderId = getAuthUserId(req);
    const receiverId = Number(req.body.receiverId);
    const content = typeof req.body.content === "string" ? req.body.content : null;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!receiverId || receiverId === senderId) {
      return res.status(400).json({ message: "Invalid receiver" });
    }
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });

    res.json({ message: "Message sent successfully", data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};