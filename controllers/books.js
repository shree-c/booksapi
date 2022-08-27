const path = require('path');
//importing mongoose schema
const Book = require('../models/Book');
//importing custom error object
const ErrorResponse = require('../utils/customError');
//importing async handler
//takes a function resolves it and calls next(error) for error handling
//to get rid of try..catch blocks
const async_handler = require('../utils/asynchandler');
//bringing in node-geocoder to convert zipcode to latitude and longitudes

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getAllBooks = async_handler(async (req, res, next) => {
    //using advanced results middleware
    const books = await Book.find();
    res.status(200).json({
        success: true,
        data: books
    });
});

// @desc    create book
// @route   POST /api/v1/books
// @access  Private
exports.createBook = async_handler(async (req, res, next) => {
    //assigning user field from the protect route
    req.body.user = req.user;
    if (req.user.role !== 'publisher' && req.user.role !== 'admin') {
        return next(new ErrorResponse('you should be a publisher to create bootcmaps', 400));
    }
    //the data is added according to model and validation checks are done
    const book = await book.create(req.body);
    res.status(200).json({
        status: 'success',
        data: book
    });
});

// @desc    Get single books
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = async_handler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        //correct format but not found
        return next(new ErrorResponse(`book not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        status: 'success',
        id: req.params.id,
        data: book
    });
});

// @desc    Update single book
// @route   PUT /api/v1/book/:id
// @access  Private
exports.updateBook = async_handler(async (req, res, next) => {
    let book = await Book.findById(req.params.id);
    //if the id is not found but in valid format
    //return because you can set properties more than once even though thery are in if statements etc.
    if (!book) {
        return next(new ErrorResponse(`book not found with id: ${req.params.id}`, 404));
    }
    //make sure the user is book owner or an admin
    if (book.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`you are not authorized to do this action`));
    }
    Object.keys(req.body).forEach((val) => {
        book[val] = req.body[val];
    });
    await book.save({ validateBeforeSave: true });
    res.status(200).json({
        status: 'success',
        id: req.params.id,
        data: book
    });
});

// @desc    Delete single book
// @route   DELETE /api/v1/books/:id
// @access  Private
exports.deleteBook = async_handler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    //if the id is not found but in valid format
    //return because you can set properties more than once even though thery are in if statements etc.
    if (!book) {
        return next(new ErrorResponse(`book not found with id: ${req.params.id}`, 404));
    }
    //make sure the user is book owner or an admin
    if (book.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`you are not authorized to do this action`));
    }
    book.remove();
    res.status(200).json({
        status: 'success',
        id: req.params.id,
        data: book
    });
});

// @desc    upload file to server
// @route   PUT /api/v1/books/:id/photo
// @access  Private
//remember the photo has to be sent with the key value 'file'
exports.bookPhotoUpload = async_handler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return next(new ErrorResponse(`book not found with id: ${req.params.id}`, 404));
    }
    //make sure the user is book owner or an admin
    if (book.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`you are not authorized to do this action`));
    }
    if (!req.files) {
        return next(new ErrorResponse(`please upload a file`, 400));
    }
    const file = req.files.file;
    //file validations
    //file type
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`the file has to be an image`, 400));
    }
    //file size
    if (file.size > process.env.FILE_MAX_SIZE) {
        return next(new ErrorResponse(`the file is too large(< 1 MB)`, 400));
    }
    //changing the file name to an unique name
    file.name = `photo_${book._id}${path.extname(file.name)}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`server error happened, please try later`, 500));
        }
        await Book.findByIdAndUpdate(book._id, {
            photo: file.name
        });
        res.status(200).json({
            status: 'success',
            data: file.name
        });
    });
});