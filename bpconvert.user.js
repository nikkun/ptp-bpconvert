// ==UserScript==
// @name PTP Bonus to Upload Converter
// @namespace passthepopcorn.me
// @author nikkun
// @version 1.0.1
// @description If you have at least 50,000 bonus points, creates a button that will convert all available bonus points (in 50,000 point increments) to upload credit
// @icon https://tls.passthepopcorn.me/favicon.ico
// @include *://*.passthepopcorn.me/*
// @downloadURL https://nikkun.in/userscripts/bpconvert.user.js
// @updateURL https://nikkun.in/userscripts/bpconvert.user.js
// @grant none
// ==/UserScript==

// Problems, suggestions?
// PTP: nikkun
// Email: nikkun01@gmail.com

// Conversion urls, sort in descending order by point cost
var urls = [
  {
    points: 2500000,
    url: 'https://tls.passthepopcorn.me/bonus.php?action=purchase&type=2&itemid=17&confirm=1',
  },
  {
    points: 250000,
    url: 'https://tls.passthepopcorn.me/bonus.php?action=purchase&type=2&itemid=16&confirm=1',
  },
  {
    points: 50000,
    url: 'https://tls.passthepopcorn.me/bonus.php?action=purchase&type=2&itemid=8&confirm=1',
  },
];

// Call XMLHttpRequest GET request
var request = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = callback;
  xhr.send();
};

// Find current bonus point value using text of #nav_bonus in menu bar
var getCurrentPoints = function() {
  var str = document.getElementById('nav_bonus').innerText;
  str = str.substring(7, str.length - 1);
  str = str.replace(',', '');
  return parseInt(str);
};

// Return function that makes all our conversion requests
var getConverter = function() {
  var points = getCurrentPoints();

  // This will find the largest conversion we can afford, and request it
  // If we cannot afford any upload conversions, the page will refresh
  // Since it passes itself as a callback, it will keep getting called until we're out
  var makeRequest = function() {
    var sufficientFunds = false;
    for (var i = 0; i < urls.length; i++) {
      if (points >= urls[i].points) {
        sufficientFunds = true;
        points -= urls[i].points;
        // Make the actual request
        request(urls[i].url, makeRequest);
        break;
      };
    };
    if (!sufficientFunds) {
      // Refresh page
      window.location = window.location;
    };
  };

  return makeRequest;
};

// Only create button if you have sufficient bonus points
if (getCurrentPoints() >= 50000) {

  // Containing <li> tag
  var li = document.createElement('li');
  li.className = 'user-info-bar__item user-info-bar__link--important';

  // Actual <a> tag
  var link = document.createElement('a');
  link.className = 'user-info-bar__link';
  link.href = 'javascript:void(0)';
  link.title = 'Convert bonus points';
  link.innerText = 'Convert';

  // Bind link to function
  link.onclick = getConverter();

  li.appendChild(link);

  // Space character for consistent spacing
  var space = document.createTextNode(' ');

  // Add it all in
  var donateLink = document.getElementById('nav_donate');
  if (donateLink) {
    donateLink.parentNode.insertBefore(li, donateLink);
    donateLink.parentNode.insertBefore(space, donateLink);
  };

};
