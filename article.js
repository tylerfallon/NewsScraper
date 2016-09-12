var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var allArticles = new Schema({
  title: {
    type: String,
    trim: true,
  }
});

var Article = mongoose.model('Article', allArticles);

module.exports = Article;