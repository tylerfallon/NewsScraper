var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var expressHB = require('express-handlebars');
var request = require('request');
var mongoose = require('mongoose');
var Article = require('./article.js');

var articleTitle = [];

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

app.engine('handlebars', expressHB({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://heroku_khqqz0bm:h18g2civa1umooco2atl63kfn2@ds029436.mlab.com:29436/heroku_khqqz0bm');
var db = mongoose.connection;


db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

request('http://www.huffingtonpost.com/section/sports', function(err, res, html) {
  var $ = cheerio.load(html);

  $('h2.card__headline').each(function(i, element) {
    var title = $(this).text();
    articleTitle.push(title);
  });

});

app.get('/populate', function(req, res) {
  Article.remove({}, function() {
    for (var i = 0; i < articleTitle.length; i++) {
      Article.create({title: articleTitle[i]}, function(err, article) {
        if (err) return handleError(err);
      });
    };
    res.send('Populated.');
  })
});

app.get('/', function(req, res) {
  Article.find({}).exec(function(err, article) {
    if (err) console.log (err)
    else res.render('home', {article: article});
  });
});

app.listen(process.env.port || 3000);