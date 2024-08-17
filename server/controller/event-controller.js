const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');


exports.getEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find();

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    });
});


exports.getEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: event
    });
});


exports.createEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.create(req.body);

    res.status(201).json({
        success: true,
        data: event
    });
});


exports.updateEvent = asyncHandler(async (req, res, next) => {
    let event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    await event.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
