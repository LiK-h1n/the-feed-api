const prisma = require("../db");

const getLatestUsers = async (req, res) => {
  // If user isn't logged in, currentUserId is 0
  const currentUserId = req.user?.id || 0; 
  
  const users = await prisma.user.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      followers: { 
        where: { followerId: Number(currentUserId) } 
      }
    }
  });

  const formatted = users.map(u => ({
    id: u.id,
    name: u.displayName,
    username: u.username,
    avatar: u.displayName.charAt(0).toUpperCase(),
    // If the followers array has an entry, it means we follow them
    isFollowing: u.followers.length > 0 
  }));
  
  res.json(formatted);
};

const toggleFollow = async (req, res) => {
  const followerId = req.user?.id; 
  const { followingId } = req.body;

  if (!followerId) return res.status(401).json({ error: "User not authenticated" });
  if (followerId === Number(followingId)) {
    return res.status(400).json({ error: "Cannot follow yourself" });
  }

  try {
    const fId = Number(followerId);
    const targetId = Number(followingId);

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: fId,
          followingId: targetId
        }
      }
    });

    if (existing) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: fId,
            followingId: targetId
          }
        }
      });
      return res.json({ followed: false });
    } else {
      await prisma.follow.create({
        data: {
          followerId: fId,
          followingId: targetId
        }
      });
      return res.json({ followed: true });
    }
  } catch (err) {
    console.error("Prisma error:", err);
    res.status(500).json({ error: "Database operation failed" });
  }
};

const getMostFollowed = async (req, res) => {
  const currentUserId = req.user?.id || 0;
  try {
    const users = await prisma.user.findMany({
      take: 3,
      orderBy: { followers: { _count: 'desc' } },
      include: { 
        followers: { where: { followerId: currentUserId } } // Check if current user follows them
      }
    });

    const formatted = users.map(u => ({
      id: u.id,
      name: u.displayName,
      username: u.username,
      avatar: u.displayName.charAt(0).toUpperCase(),
      isFollowing: u.followers.length > 0
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
};

module.exports = { getLatestUsers, toggleFollow, getMostFollowed }; 