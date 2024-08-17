const Research = require('../models/Research');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all research updates
// @route   GET /api/v1/research
// @access  Public
exports.getResearchUpdates = asyncHandler(async (req, res, next) => {
    const researchUpdates = await Research.find();

    res.status(200).json({
        success: true,
        count: researchUpdates.length,
        data: researchUpdates
    });
});

// @desc    Get single research update
// @route   GET /api/v1/research/:id
// @access  Public
exports.getResearchUpdate = asyncHandler(async (req, res, next) => {
    const researchUpdate = await Research.findById(req.params.id);

    if (!researchUpdate) {
        return next(new ErrorResponse(`Research update not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: researchUpdate
    });
});

// @desc    Create new research update
// @route   POST /api/v1/research
// @access  Private
exports.createResearchUpdate = asyncHandler(async (req, res, next) => {
    const researchUpdate = await Research.create(req.body);

    res.status(201).json({
        success: true,
        data: researchUpdate
    });
});

// @desc    Update research update
// @route   PUT /api/v1/research/:id
// @access  Private
exports.updateResearchUpdate = asyncHandler(async (req, res, next) => {
    let researchUpdate = await Research.findById(req.params.id);

    if (!researchUpdate) {
        return next(new ErrorResponse(`Research update not found with id of ${req.params.id}`, 404));
    }

    researchUpdate = await Research.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: researchUpdate
    });
});

// @desc    Delete research update
// @route   DELETE /api/v1/research/:id
// @access  Private
exports.deleteResearchUpdate = asyncHandler(async (req, res, next) => {
    const researchUpdate = await Research.findById(req.params.id);

    if (!researchUpdate) {
        return next(new ErrorResponse(`Research update not found with id of ${req.params.id}`, 404));
    }

    await researchUpdate.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
