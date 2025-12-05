const usersService = require("../service/snapService");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await usersService.getUserByEmail(email);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Email not found" });
    if (user.password !== password)
      return res
        .status(401)
        .json({ status: "error", code: 401, message: "Invalid password" });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Login successful",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Users retrieved",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await usersService.getUserById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "User not found" });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User retrieved",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function addUser(req, res) {
  try {
    const newUser = await usersService.addUser(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      message: "User created",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const updatedUser = await usersService.updateUser(req.params.id, req.body);
    if (!updatedUser)
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "User not found" });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const deletedUser = await usersService.deleteUser(req.params.id);
    if (!deletedUser)
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "User not found" });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User deleted",
      data: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function startPhotoSession(req, res) {
  try {
    const { user_id, filter } = req.body;
    if (!user_id || !filter) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "User ID and filter required",
      });
    }
    const newSession = await usersService.startSession(user_id, filter);
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Session started",
      data: newSession,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function endPhotoSession(req, res) {
  try {
    const { session_id } = req.body;
    if (!session_id)
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Session ID required" });
    const endedSession = await usersService.endSession(session_id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Session ended",
      data: endedSession,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getFilters(req, res) {
  try {
    const filters = await usersService.getAllFilters();
    res.status(200).json({ status: "success", code: 200, data: filters });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function submitFeedback(req, res) {
  try {
    const { session_id, rating, comment } = req.body;

    if (!rating) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Rating is required" });
    }

    const feedback = await usersService.saveFeedback(
      session_id,
      rating,
      comment
    );
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Feedback saved",
      data: feedback,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

// Photo management controllers
async function savePhoto(req, res) {
  try {
    const {
      session_id,
      file_name,
      file_path,
      file_size,
      mime_type,
      filter_applied,
      metadata,
    } = req.body;

    if (!session_id || !file_name || !file_path) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Session ID, file name, and file path are required",
      });
    }

    const newPhoto = await usersService.savePhoto(
      session_id,
      file_name,
      file_path,
      file_size,
      mime_type,
      filter_applied,
      metadata
    );
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Photo saved successfully",
      data: newPhoto,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getPhotosBySession(req, res) {
  try {
    const { session_id } = req.params;
    const photos = await usersService.getPhotosBySession(session_id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Photos retrieved",
      data: photos,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getUserPhotos(req, res) {
  try {
    const { user_id } = req.params;
    const { include_deleted } = req.query;
    const photos = await usersService.getUserPhotos(
      user_id,
      include_deleted === "true"
    );
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User photos retrieved",
      data: photos,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getFavoritePhotos(req, res) {
  try {
    const { user_id } = req.params;
    const photos = await usersService.getFavoritePhotos(user_id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Favorite photos retrieved",
      data: photos,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getPhotoById(req, res) {
  try {
    const { photo_id } = req.params;
    const photo = await usersService.getPhotoById(photo_id);
    if (!photo)
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Photo not found" });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Photo retrieved",
      data: photo,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function deletePhoto(req, res) {
  try {
    const { photo_id } = req.params;
    const deletedPhoto = await usersService.softDeletePhoto(photo_id);
    if (!deletedPhoto)
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Photo not found" });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Photo deleted successfully",
      data: deletedPhoto,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function togglePhotoFavorite(req, res) {
  try {
    const { photo_id } = req.params;
    const updatedPhoto = await usersService.togglePhotoFavorite(photo_id);
    if (!updatedPhoto)
      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Photo not found" });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Photo favorite status updated",
      data: updatedPhoto,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getPhotoStatistics(req, res) {
  try {
    const { user_id } = req.params;
    const stats = await usersService.getPhotoStatistics(user_id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Photo statistics retrieved",
      data: stats,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

module.exports = {
  login,
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
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
};
