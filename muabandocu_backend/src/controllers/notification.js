const db = require("../config/database");

async function getNotifications(userId) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notification WHERE user_id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return {
        code: 200,
        data: [],
      };
    }
    return {
      code: 200,
      data: rows,
    };
  } catch (error) {
    throw error;
  }
}

async function newNotification(userId, message) {
  const [rows] = await db.execute(
    "INSERT INTO notification (user_id, message) VALUES (?, ?)",
    [userId, message]
  );
  return rows;
}

module.exports = {
  getNotifications,
};
