const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async fetchAllUsers(req, res) {
    try {
      const allUsers = await User.find();
      res.json(allUsers);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single user by ID
  async fetchUserById(req, res) {
    try {
      const singleUser = await User.findOne({ _id: req.params.userId }).select('-__v');

      if (!singleUser) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }

      res.json(singleUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new user
  async createNewUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update an existing user by ID
  async modifyUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user and their associated thoughts
  async removeUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });

      if (!deletedUser) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }

      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend to a user's friend list
  async appendFriend(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this ID!' });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this ID!' });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};