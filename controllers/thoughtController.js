const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async fetchAllThoughts(req, res) {
    try {
      const allThoughts = await Thought.find();
      res.json(allThoughts);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Get a single thought by ID
  async fetchThoughtById(req, res) {
    try {
      const singleThought = await Thought.findById(req.params.thoughtId);

      if (!singleThought) {
        return res.status(404).json({ message: 'No thought found with this ID' });
      }

      res.json(singleThought);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Create a new thought and associate it with a user
  async createNewThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      const associatedUser = await User.findByIdAndUpdate(
        req.body.userId,
        { $addToSet: { thoughts: newThought._id } },
        { new: true }
      );

      if (!associatedUser) {
        return res.status(404).json({ message: 'Thought created, but no user found with this ID' });
      }

      res.json({ message: 'Thought successfully created' });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  },

  // Update an existing thought by ID
  async modifyThought(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID' });
      }

      res.json(updatedThought);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  },

  // Delete a thought by ID and remove it from the associated user's thoughts
  async removeThought(req, res) {
    try {
      const deletedThought = await Thought.findByIdAndRemove(req.params.thoughtId);

      if (!deletedThought) {
        return res.status(404).json({ message: 'No thought found with this ID' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'Thought deleted, but no user found with this ID' });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Add a reaction to a thought
  async appendReaction(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID' });
      }

      res.json(updatedThought);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Remove a reaction from a thought
  async removeReaction(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: req.params.reactionId } },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No reaction found with this ID' });
      }

      res.json(updatedThought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};