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
        return User.findOneAndUpdate(
          { _id: req.params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          res.status(400).json({ message: 'no user found with this id' });
          return;
        } else {
          res.status(200).json(userData);
        }
      });
  },
  removeThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'no thought with this id' });
        } else {
          return User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          );
        }
      })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'no Thoughts detected' });
        }
        res.status(200).json(userData);
      })
      .catch((err) => {
        console.log(err);
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
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((data) => {
        if (!data) {
          return res
            .status(404)
            .json({ message: 'no user found with that id' });
        }
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = ThoughtController;
