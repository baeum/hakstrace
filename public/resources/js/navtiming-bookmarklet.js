javascript:!function(){function o(t,n){var e=[];for(var a in t)if(t.hasOwnProperty(a)&&null!=a&&null!=t[a]){var r=n?n+"["+a+"]":a,s=t[a];e.push("object"==typeof s?o(s,r):encodeURIComponent(r)+"="+encodeURIComponent(s))}return e.join("&")}function t(o){var t=window.location,a={host:t.protocol+"//"+t.host,uri:t.pathname,url:window.location.href,userAgent:navigator.userAgent,navigationStart:o.navigationStart,domainLookupStart:o.domainLookupStart,connectStart:o.connectStart,requestStart:o.requestStart,responseStart:o.responseStart,responseEnd:o.responseEnd,domLoading:o.domLoading,loadEventStart:o.loadEventStart,loadEventEnd:o.loadEventEnd};console.log(a),n(e,a)}function n(t,n){var e=new Image;e.src=t+"?"+o(n)+"&ct=img&cb="+(new Date).getTime()}var e="http://52.69.50.81:3000/api/navtimings/YosiJoA/post";setTimeout(function(){var o=window.performance||window.webkitPerformance||window.msPerformance||window.mozPerformance;if(void 0===o)return void console.log("Unfortunately, your browser does not support the Navigation Timing API");var n=o.timing,e={navigationStart:n.navigationStart,domainLookupStart:n.domainLookupStart,connectStart:n.connectStart,requestStart:n.requestStart,responseStart:n.responseStart,responseEnd:n.responseEnd,domLoading:n.domLoading,loadEventStart:n.loadEventStart,loadEventEnd:n.loadEventEnd};console.log(e),console.log("1st client:%d",e.domainLookupStart-e.navigationStart),console.log("1st n/w:%d",e.requestStart-e.domainLookupStart),console.log("1st server:%d",e.responseStart-e.requestStart),console.log("2nd n/w:%d",e.responseEnd-e.responseStart),console.log("2nd client:%d",e.loadEventEnd-e.responseEnd),t(e)},0)}();