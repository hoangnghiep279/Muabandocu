const db = require("../config/database");

async function getNotifications(userId) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notification WHERE user_id = ? ORDER BY created_at DESC",
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

// API đánh dấu thông báo là đã đọc
async function markNotificationsAsRead(userId) {
  try {
    await db.execute("UPDATE notification SET is_read = 1 WHERE user_id = ?", [
      userId,
    ]);
    return { code: 200, message: "Notifications marked as read." };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getNotifications,
  markNotificationsAsRead,
};
