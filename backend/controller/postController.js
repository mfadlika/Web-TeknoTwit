const posts = [
  { id: 1, title: "First Post", content: "This is the first post." },
  { id: 2, title: "Second Post", content: "This is the second post." },
];

const fetchPosts = async () => {
  await Promise.resolve();
  return posts;
};

const getPosts = async (req, res) => {
  try {
    const data = await fetchPosts();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load posts" });
  }
};

module.exports = {
  getPosts,
};
