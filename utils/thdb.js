/* eslint-disable */

module.exports = {
  debounce: function(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}},
  throttle: function(n,l,t){var a,u,e,r=null,i=0;t||(t={});var o=function(){i=t.leading===!1?0:Date.now(),r=null,e=n.apply(a,u),r||(a=u=null)};return function(){var c=Date.now();i||t.leading!==!1||(i=c);var p=l-(c-i);return a=this,u=arguments,p<=0||p>l?(r&&(clearTimeout(r),r=null),i=c,e=n.apply(a,u),r||(a=u=null)):r||t.trailing===!1||(r=setTimeout(o,p)),e}}
}
