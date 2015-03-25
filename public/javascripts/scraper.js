var http = require('http');
var cheerio = require('cheerio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var STATUS_CODES = http.STATUS_CODES;
/*
 * Scraper Constructor
**/
function Scraper (url) {
    this.url = url;
    this.init();
}
/*
 * Make it an EventEmitter
**/
util.inherits(Scraper, EventEmitter);

/*
 * Initialize scraping
**/
Scraper.prototype.init = function () {
    var model;

    var self = this;

    self.on('loaded', function (html) {
        self.parsePage(html);
    });
    self.loadWebPage();
};

Scraper.prototype.loadWebPage = function () {
  var self = this;

  console.log('\n\nLoading ' + self.url);

  http.get(self.url, function (res) {
    var body = '';
    if(res.statusCode !== 200) {
      return self.emit('error', STATUS_CODES[res.statusCode]);
    }
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      self.emit('loaded', body);
    });
  })
  .on('error', function (err) {
    self.emit('error', err);
  });      
};

/*
 * Parse html and return an object
**/

Scraper.prototype.parsePage = function (html) {
  var $ = cheerio.load(html);
  var self = this;

  var item = "";
  var meaning = [];


  $('.entry').filter(function(){

      var data = $(this);
            var model = {
              item: item || '',
              meaning: meaning || '',
              source: this.url
            };
            //self.emit('complete', model);
      $('p', data).each(function(index,value){

          if (value.firstChild.tagName == 'strong'){
            item = $('strong', value).text();
            item = item.split(":")[0];
            item = item.split("-")[0];
            item = item.split("\u2013")[0];
            item = item.split("\u2014")[0];
            item = item.trim();
            console.log(item);

            var model = {
              item: item || '',
              meaning: meaning || '',
              source: this.url
            };

            self.emit('complete', model);
          } 
          
      });

  });

};

module.exports = Scraper;
