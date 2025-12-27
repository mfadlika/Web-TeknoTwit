const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// User login controller
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//         content,
//         userId,
//       },
//     });
