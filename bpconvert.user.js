// ==UserScript==
// @name PTP Bonus to Upload Converter
// @namespace passthepopcorn.me
// @author nikkun
// @version 1.0.4
// @description If you have at least 50,000 bonus points, creates a button that will convert all available bonus points (in 50,000 point increments) to upload credit
// @icon https://tls.passthepopcorn.me/favicon.ico
// @include *://*.passthepopcorn.me/*
// @downloadURL https://raw.githubusercontent.com/nikkun/ptp-bpconvert/master/bpconvert.user.js
// @updateURL https://raw.githubusercontent.com/nikkun/ptp-bpconvert/master/bpconvert.user.js
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
  var pointElem = document.getElementById('nav_bonus');
  if (!pointElem)
    return -1;
  var pointStr = pointElem.textContent;
  pointStr = pointStr.substring(7, pointStr.length - 1);
  pointStr = pointStr.replace(/,/g, '');
  return parseInt(pointStr);
};

// Return function that makes all our conversion requests
var convert = function() {
  var points = getCurrentPoints();

  var remaining = 0;
  for (var i = 0; i < urls.length;) {
    if (points >= urls[i].points) {
      sufficientFunds = true;
      var xhr = request(urls[i].url, function() {
        if (--remaining === 0) {
          window.location = window.location;
        }
      });
      remaining++;
      points -= urls[i].points;
    } else {
      i++;
    }
  }
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
  link.textContent = 'Convert';

  // Bind link to function
  link.onclick = convert;

  li.appendChild(link);

  // Space character for consistent spacing
  var space = document.createTextNode(' ');

  // Add it all in
  var donateLink = document.getElementById('nav_donate');
  if (donateLink) {
    donateLink.parentNode.insertBefore(li, donateLink);
    donateLink.parentNode.insertBefore(space, donateLink);
  }

}
