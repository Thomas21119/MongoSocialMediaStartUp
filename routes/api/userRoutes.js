const router = require('express').Router();

const {
  getAllUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
  getUserById,
} = require('../../controllers/userController');

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).delete(deleteUser).put(updateUser);

router.route('/:id/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
