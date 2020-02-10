const BookInstance = require('../models/bookinstance')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const Book = require('../models/book')

exports.book_instance_list = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec(function(err, list_bookinstances) {
      if(err) { return next(err) }
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    })
}

exports.book_instance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance) {
      if(err) return next(err)
      if(bookinstance == null) {
        var err = new Error('Book copy not found')
        err.status = 404
        return next(err)
      }
      res.render('bookinstance_detail', {title: 'Book:', bookinstance: bookinstance})
    })
}

exports.book_instance_create_get = (req, res) => {
  Book.find({}, 'title')
    .exec(function(err, books) {
      if(err) return next(err)
      res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, status: BookInstance.schema.obj.status.enum})
    })
}

exports.book_instance_create_post = [
  // Validate fields.
  body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
  body('imprint', 'Imprint must be specified').isLength({ min: 1}).trim(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),
  
  (req, res, next) => {
    const errors = validationResult(req)

    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if(!errors.isEmpty()) {
      Book.find({}, 'title')
        .exec(function(err, books) {
          if(err) return next(err)
          res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array() })
        });
      return 
    }else {
      bookinstance.save(function(err) {
        if(err) return next(err)
        res.redirect(bookinstance.url)
      })
    }
  }
]

exports.book_instance_delete_get = (req, res) => {
  res.send('未实现：藏书副本删除表单的GET')
}

exports.book_instance_delete_post = (req, res) => {
  res.send('未实现：删除藏书副本的POST')
}

exports.book_instance_update_get = (req, res) => {
  res.send('未实现：藏书副本更新表单的GET')
}

exports.book_instance_update_post = (req, res) => {
  res.send('未实现：更新藏书副本的POST')
}
