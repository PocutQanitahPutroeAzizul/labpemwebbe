const pool = require("../config/db");

async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function addUser(data) {
  const { username, email, password } = data;
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
}

async function updateUser(id, data) {
  const { username, email, password } = data;
  const result = await pool.query(
    `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`,
    [username, email, password, id]
  );
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function startSession(userId, filterUsed) {
  const result = await pool.query(
    "INSERT INTO photo_sessions (user_id, date_time_start, filter_used, number_of_photos) VALUES ($1, NOW(), $2, 0) RETURNING *",
    [userId, filterUsed]
  );
  return result.rows[0];
}

async function endSession(sessionId) {
  const result = await pool.query(
    "UPDATE photo_sessions SET date_time_end = NOW() WHERE session_id = $1 RETURNING *",
    [sessionId]
  );
  return result.rows[0];
}

async function getAllFilters() {
  const result = await pool.query(
    "SELECT * FROM filters WHERE is_active = TRUE"
  );
  return result.rows;
}

async function saveFeedback(sessionId, rating, comment) {
  const result = await pool.query(
    "INSERT INTO feedback (session_id, rating, comment) VALUES ($1, $2, $3) RETURNING *",
    [sessionId, rating, comment]
  );
  return result.rows[0];
}

// Photo management functions
async function savePhoto(
  sessionId,
  fileName,
  filePath,
  fileSize,
  mimeType,
  filterApplied,
  metadata = null
) {
  const result = await pool.query(
    `INSERT INTO photos (session_id, file_name, file_path, file_size, mime_type, filter_applied, metadata) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [sessionId, fileName, filePath, fileSize, mimeType, filterApplied, metadata]
  );
  return result.rows[0];
}

async function getPhotosBySession(sessionId) {
  const result = await pool.query(
    `SELECT photo_id, file_name, file_path, file_size, mime_type, filter_applied, 
            capture_timestamp, is_favorite, metadata
     FROM photos 
     WHERE session_id = $1 AND is_deleted = FALSE 
     ORDER BY capture_timestamp DESC`,
    [sessionId]
  );
  return result.rows;
}

async function getUserPhotos(userId, includeDeleted = false) {
  const deletedCondition = includeDeleted ? "" : "AND p.is_deleted = FALSE";
  const result = await pool.query(
    `SELECT p.photo_id, p.session_id, p.file_name, p.file_path, p.file_size, 
            p.mime_type, p.filter_applied, p.capture_timestamp, p.is_favorite, p.metadata
     FROM photos p
     JOIN photo_sessions ps ON p.session_id = ps.session_id
     WHERE ps.user_id = $1 ${deletedCondition}
     ORDER BY p.capture_timestamp DESC`,
    [userId]
  );
  return result.rows;
}

async function getFavoritePhotos(userId) {
  const result = await pool.query(
    `SELECT p.photo_id, p.session_id, p.file_name, p.file_path, p.file_size, 
            p.mime_type, p.filter_applied, p.capture_timestamp, p.metadata
     FROM photos p
     JOIN photo_sessions ps ON p.session_id = ps.session_id
     WHERE ps.user_id = $1 AND p.is_deleted = FALSE AND p.is_favorite = TRUE
     ORDER BY p.capture_timestamp DESC`,
    [userId]
  );
  return result.rows;
}

async function getPhotoById(photoId) {
  const result = await pool.query(
    `SELECT p.*, ps.user_id
     FROM photos p
     JOIN photo_sessions ps ON p.session_id = ps.session_id
     WHERE p.photo_id = $1`,
    [photoId]
  );
  return result.rows[0];
}

async function softDeletePhoto(photoId) {
  const result = await pool.query(
    "UPDATE photos SET is_deleted = TRUE WHERE photo_id = $1 RETURNING *",
    [photoId]
  );
  return result.rows[0];
}

async function togglePhotoFavorite(photoId) {
  const result = await pool.query(
    "UPDATE photos SET is_favorite = NOT is_favorite WHERE photo_id = $1 AND is_deleted = FALSE RETURNING *",
    [photoId]
  );
  return result.rows[0];
}

async function getPhotoStatistics(userId) {
  const result = await pool.query(
    `SELECT COUNT(*) as total_photos,
            COUNT(CASE WHEN is_favorite = TRUE THEN 1 END) as favorite_photos,
            COUNT(CASE WHEN is_deleted = TRUE THEN 1 END) as deleted_photos,
            MAX(capture_timestamp) as last_photo_date
     FROM photos p
     JOIN photo_sessions ps ON p.session_id = ps.session_id
     WHERE ps.user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  startSession,
  endSession,
  getAllFilters,
  saveFeedback,
  savePhoto,
  getPhotosBySession,
  getUserPhotos,
  getFavoritePhotos,
  getPhotoById,
  softDeletePhoto,
  togglePhotoFavorite,
  getPhotoStatistics,
};
