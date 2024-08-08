const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction.js');

// Helper function to format date as a localized string
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// Define the Thought schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => formatDate(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual property to calculate the number of reactions
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Create the Thought model using the thoughtSchema
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;