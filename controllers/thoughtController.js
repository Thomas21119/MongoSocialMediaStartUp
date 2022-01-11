const { Thought, User, Types } = require('../models');

const ThoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .then((thoughtData) => {
        res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json('no thought found with this id');
          return;
        } else {
          res.status(200).json(thoughtData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
      });
  },
  addThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findByIdAndUpdate(
          req.params.userId,
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        console.log(userData);
        if (!userData) {
          res.status(400).json({ message: 'no user found with this id' });
          return;
        } else {
          res.status(200).json(userData);
        }
      });
  },
  removeThought(req, res) {
    Thought.findOneAndRemove(req.params.thoughtId)
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'does not exist.' });
        }
        res.status(200).json({ message: 'deleted.' });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'no user found with this id' });
          return;
        } else {
          res.status(200).json(userData);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = ThoughtController;
