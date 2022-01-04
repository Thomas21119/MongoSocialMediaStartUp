const router = require('express').Router();

const {
  getAllThoughts,
  getThoughtById,
  addThought,
  removeThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getAllThoughts);

router.route('/:userId').post(addThought);

router.route('/:thoughtId').get(getThoughtById).delete(removeThought);

router.route('/:thoughtId/reactions').post(addReaction).delete(removeReaction);

module.exports = router;
