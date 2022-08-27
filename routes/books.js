const router = require('express').Router();
const { getAllBooks, getBook, updateBook, deleteBook, bookPhotoUpload, createBook } = require('../controllers/books');
const { protect, authorize } = require('../middlewares/auth');
router.route('/')
    .get(protect, getAllBooks)
    .post(protect, authorize('publisher', 'admin'), createBook);

router.route('/:id')
    .get(protect, getBook)
    .put(protect, authorize('publisher', 'admin'), updateBook)
    .delete(protect, authorize('publisher', 'admin'), deleteBook);

router.route('/photo/:id')
    .put(protect, authorize('publisher', 'admin'), bookPhotoUpload);

module.exports = router;