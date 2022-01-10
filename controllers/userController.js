const { ReadableStreamBYOBRequest } = require('stream/web');
const { User, Thought } = require('../models');
// need server help so this is winging without test
const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .then((userData) => {
        if (!userData) {
          res.status(400).json('No user found with this ID');
          return;
        } else {
          res.status(200).json(userData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'no user with this id exists' });
        } else {
          Thought.findOneAndUpdate(
            { users: req.params.userId },
            { $pull: { users: req.params.userId } },
            { new: true }
          );
        }
      })
      .then((thought) => {
        if (!thought) {
          res
            .status(404)
            .json({ message: 'user deleted but no messages found' });
        } else {
          res.status(200).json({ message: 'user succesfully deleted' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // very unsure about this
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this ID' });
          return;
        } else {
          res.json(userData);
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  addFriend(req, res) {
    User.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { friends: req.params.friends } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          console.log('no user data');
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

  removeFriend(req, res) {
    User.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { friends: req.params.friends } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'no user found with that id' });
          return;
        } else {
          res.status(200).json(userData);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};

module.exports = userController;
