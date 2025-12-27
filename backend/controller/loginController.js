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
// User signup controller
exports.postSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    // only allow teknokrat.ac.id emails
    const allowedDomain = "@teknokrat.ac.id";
    if (!String(email).toLowerCase().endsWith(allowedDomain)) {
      return res
        .status(400)
        .json({ message: `Only ${allowedDomain} emails are allowed` });
    }

    if (typeof password === "string" && password.length > 20) {
      return res
        .status(400)
        .json({ message: "Password must be 20 characters or less" });
    }

    // check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json({ message: "User created", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
