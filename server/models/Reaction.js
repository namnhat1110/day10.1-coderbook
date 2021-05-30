const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
  {
    type: {
      type: String,
      enum: {
        required: true,
        values: ["Like", "Heart", "Care", "Laugh", "Angry", "Sad"],
        message: "{VALUE} is not supported",
      },
    },
    reactionableId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    reactionableType: {
      type: String,
      enum: {
        required: true,
        values: ["Post", "Comment", "Photo", "Message"],
        message: "{VALUE} is not supported",
      },
    },
    owner: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;