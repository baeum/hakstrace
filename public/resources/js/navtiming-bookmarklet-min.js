/**
 * Created by noongs on 2015-08-19.
 */
(function() {
  var DEFAULT_NOTIFIER_ENDPOINT = "http://localhost:3000/api/navtimings/YosiJoA/post";

  setTimeout(function(){
    var performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
    if(performance === undefined) {
      console.log('Unfortunately, your browser does not support the Navigation Timing API');
      return;
    }
    var t = performance.timing;
    var navtiming = {
      navigationStart: t.navigationStart,
      domainLookupStart: t.domainLookupStart,
      connectStart: t.connectStart,
      requestStart: t.requestStart,
      responseStart: t.responseStart,
      responseEnd: t.responseEnd,
      domLoading: t.domLoading,
      loadEventStart: t.loadEventStart,
      loadEventEnd: t.loadEventEnd
    };

    console.log(navtiming);
    console.log('1st client:%d', navtiming.domainLookupStart - navtiming.navigationStart);
    console.log('1st n/w:%d', navtiming.requestStart - navtiming.domainLookupStart);
    console.log('1st server:%d', navtiming.responseStart - navtiming.requestStart);
    console.log('2nd n/w:%d', navtiming.responseEnd - navtiming.responseStart);
    console.log('2nd client:%d', navtiming.loadEventEnd - navtiming.responseEnd);

    sendToHakstrace(navtiming);

  }, 0);

  // Deeply serialize an object into a query string. We use the PHP-style
  // nested object syntax, `nested[keys]=val`, to support heirachical
  // objects. Similar to jQuery's `$.param` method.
  function serialize(obj, prefix) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && p != null && obj[p] != null) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v === "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }


  // Send an error to Hakstrace.
  function sendToHakstrace(t) {

    var location = window.location;
    var sendObj = {
      host: location.protocol + "//" + location.host,
      uri: location.pathname,
      url: window.location.href,
      userAgent: navigator.userAgent,
      navigationStart: t.navigationStart,
      domainLookupStart: t.domainLookupStart,
      connectStart: t.connectStart,
      requestStart: t.requestStart,
      responseStart: t.responseStart,
      responseEnd: t.responseEnd,
      domLoading: t.domLoading,
      loadEventStart: t.loadEventStart,
      loadEventEnd: t.loadEventEnd
    };

    console.log(sendObj);

    request(DEFAULT_NOTIFIER_ENDPOINT, sendObj);
  }

  // Make a HTTP request with given `url` and `params` object.
  // For maximum browser compatibility and cross-domain support, requests are
  // made by creating a temporary JavaScript `Image` object.
  function request(url, params) {
    var img = new Image();
    img.src = url + "?" + serialize(params) + "&ct=img&cb=" + new Date().getTime();
  }

})();