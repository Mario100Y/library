const Genre = require('../models/genre')
const Book = require('../models/book')
const async = require('async')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_genres) {
      if(err) return next(err)
      res.render('genre_list', {title: 'genre_list', genre_list: list_genres})
    })
}

exports.genre_detail = (req, res, next) => {
  
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id)
        .exec(callback)
    },

    genre_books: function(callback) {
      Book.find({ 'genre': req.params.id })
        .exec(callback)
    }
  }, function(err, results) {
    if(err) return next(err)
    if(results.genre == null) {
      var err = new Error('Genre not found')
      err.status = 404
      return next(err)
    }
    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books})
  })
}

exports.genre_create_get = (req, res) => {
  res.render('genre_form', {title: 'Create Genre'})
}

exports.genre_create_post = [
  body('name', 'Genre name required').isLength({ min: 1 }).trim(),

  sanitizeBody('name').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    var genre = new Genre(
      {name: req.body.name}
    )

    if(!errors.isEmpty()) {
      res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()})
      return 
    } else {
      Genre.findOne({ 'name': req.body.name })
        .exec(function(err, found_genre) {
          if(err) return next(err)

          if(found_genre) {
            res.redirect(found_genre.url)
          }else{
            genre.save(function(err) {
              if(err) return next(err)
              res.redirect(genre.url)
            })
          }
        })
    }
  }
]

exports.genre_delete_get = (req, res) => {
  // 标签的删除 需要返回所有标签
  genre.find({})
  .sort([['name', 'ascending']])
  exec(function(err, genres) {
    console.log(genres)
    res.render('genre_delete', { title: 'Delete Genre', genres: genres})
  })
}

exports.genre_delete_post = (req, res) => {
  res.send('未实现：删除藏书种类的POST')
}

exports.genre_update_get = (req, res) => {
  res.send('未实现：藏书种类更新表单的GET')
}

exports.genre_update_post = (req, res) => {
  res.send('未实现：更新藏书种类的POST')
}
