var Model = require('./model');
var Scraper = require('./scraper');
var Pages = [];
var express = require('express');
var router = express.Router();
var Crawler = require("crawler");
var url = require('url');


function generateUrls() {

  var url = 'http://www.dreamdictionary.org/';

  var alpha = ['a', 'b', 'c','d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

  var urls = [];

  var j;


  for (j=0; j < alpha.length; j++) {
    urls.push(url + alpha[j] + '/');
  }
  

  return urls;
}

/*
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server

       
        $('a').each(function(index, a) {

          var toQueueUrl = $(a).attr('href');
          var nofollowref = $(a).attr('rel');

          if(toQueueUrl!= null) {

              console.log('***************** ' + toQueueUrl);
              c.queue(toQueueUrl);             
          }

        });


        generateUrls();

    },
    skipDuplicates : true,
    onDrain: function() {onDrain()},
})

c.queue('http://www.dreamdictionary.org/a/');
*/

Pages = generateUrls();


function wizard() {
  // if the Pages array is empty, we are Done!!
  if (!Pages.length) {
    return console.log('Done!!!!');
  }

  var url = Pages.pop();
  var scraper = new Scraper(url);
  var model;

  console.log('Requests Left: ' + Pages.length);
  // if the error occurs we still want to create our
  // next request
  scraper.on('error', function (error) {
    console.log('here' + error);
    wizard();
  });

  // if the request completed successfully
  // we want to store the results in our database
  scraper.on('complete', function (listing) {
    
    model = new Model(listing);
    model.save(function(err) {
      if (err) {
        console.log('Database err saving: ' + url);
      }

    });
    wizard(); 
  });
}

var numberOfParallelRequests = 5;

for (var i = 0; i < numberOfParallelRequests; i++) {
    wizard();
}


function onDrain () {
    console.log("QUEUE DRAINED");
    process.exit();
} 

