const mongoose = require('mongoose');
const BookSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter book name']
        },
        author: {
            type: String,
            required: [true, 'Please enter author name']
        },
        pages: {
            type: Number,
            required: [true, 'Please enter number of pages in the book']
        },
        price: {
            type: Number,
            required: [true, 'Please enter price of the book']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


module.exports = mongoose.model('Book', BookSchema);