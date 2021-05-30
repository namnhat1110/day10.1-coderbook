const Reaction = require('../models/Reaction');
const mongoose = require('mongoose');

const {
    AppError,
    catchAsync,
    sendResponse,
} = require('../helpers/utils.helper');

const reactionController = {};

reactionController.create = catchAsync(async (req, res) => {
    const reaction = await Reaction.create({
        ...req.body,
        owner: req.userId,
    });

    const reactionableKlass = await mongoose
        .model(req.body.reactionableType)
        .findById(req.params.id);

    await reactionableKlass.reactions.push(reaction._id);
    await reactionableKlass
        .populate('owner')
        .populate({ path: 'comments', populate: { path: 'owner' } })
        .populate({ path: 'reactions', populate: { path: 'owner' } });
    await reactionableKlass.execPopulate();
    await reaction.save();
    await reactionableKlass.save();

    return sendResponse(
        res,
        200,
        true,
        { reactionableKlass, reaction },
        null,
        'Reacted!'
    );
});

reactionController.read = async (req, res) => {
    const reaction = await Reaction.findOne({ _id: req.params.id }).populate(
        'owner'
    );
    if (!reaction) {
        res.status(404).json({ message: 'reaction  not found.' });
    } else {
        res.json(reaction);
    }
};

reactionController.update = async (req, res) => {
    let newReaction = await Reaction.findByIdAndUpdate(
        { _id: req.params.reactionId },
        { ...req.body },
        { new: true }
    );
    if (!newReaction)
        return res.status(404).json({ message: 'Reaction not found' });
    let reaction = await Reaction.findById(req.params.reactionId).populate(
        'owner'
    );
    res.status(200).json(reaction);
};

reactionController.destroy = async (req, res) => {
    let reaction = await Reaction.findByIdAndDelete(req.params.reactionId);
    if (!reaction) return res.status(404).json({ msg: 'reaction not found' });
    res.status(200).json(reaction);
};

reactionController.list = async (req, res) => {
    await Reaction.find({}, (err, reactions) => {
        if (!reactions) {
            res.status(404).json({ message: 'Reactions not found.' });
        } else {
            res.json(reactions);
        }
    });
};

module.exports = reactionController;