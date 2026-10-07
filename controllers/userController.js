const prisma = require("../db");

const getLatestUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { 
        id: true, 
        displayName: true,  
        username: true 
      }
    });
    
    const formattedUsers = users.map(u => ({
      ...u,
      name: u.displayName, 
      avatar: u.displayName ? u.displayName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    res.status(500).json({ error: "Failed to fetch latest users" });
  }
};

module.exports = { getLatestUsers };