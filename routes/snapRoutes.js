const express = require("express");
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  login,
  startPhotoSession,
  endPhotoSession,
  getFilters,
  submitFeedback,
  savePhoto,
  getPhotosBySession,
  getUserPhotos,
  getFavoritePhotos,
  getPhotoById,
  deletePhoto,
  togglePhotoFavorite,
  getPhotoStatistics,
} = require("../controllers/snapControllers");

const router = express.Router();

router.post("/login", login);
router.post("/auth/login", login); 
router.post("/register", addUser);
router.post("/auth/register", addUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/start-session", startPhotoSession);
router.post("/end-session", endPhotoSession);
router.get("/filters", getFilters);
router.post("/feedback", submitFeedback);
router.post("/photos", savePhoto);
router.get("/photos/session/:session_id", getPhotosBySession);
router.get("/photos/user/:user_id", getUserPhotos);
router.get("/photos/favorites/:user_id", getFavoritePhotos);
router.get("/photos/:photo_id", getPhotoById);
router.delete("/photos/:photo_id", deletePhoto);
router.put("/photos/:photo_id/favorite", togglePhotoFavorite);
router.get("/photos/statistics/:user_id", getPhotoStatistics);

module.exports = router;
