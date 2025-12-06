const users = [
  { id: 1, username: "tekno_admin", fullName: "Tekno Admin" },
  { id: 2, username: "kiki", fullName: "Kiki" },
];

const fetchUsers = async () => {
  await Promise.resolve();
  return users;
};

const getUsers = async (req, res) => {
  try {
    const data = await fetchUsers();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load users" });
  }
};

module.exports = {
  getUsers,
};
