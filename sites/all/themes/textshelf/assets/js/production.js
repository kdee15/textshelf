/**
* @preserve HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed  
*/
;(function(window, document) {
/*jshint evil:true  */
  /** version */
  var version = '3.6.2';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements    */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive   if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

    /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/\w+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

}(this, document));

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT / GPLv2 License.
*/
(function(w){

  // This fix addresses an iOS bug, so return early if the UA claims it's something else.
  var ua = navigator.userAgent;
  if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){
    return;
  }

    var doc = w.document;

    if( !doc.querySelector ){ return; }

    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
    x, y, z, aig;

    if( !meta ){ return; }

    function restoreZoom(){
      window.setTimeout(function() {
        enabled = true;
      }, 50);
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;

    }

    function checkTilt( e ){
    aig = e.accelerationIncludingGravity;
    x = Math.abs( aig.x );
    y = Math.abs( aig.y );
    z = Math.abs( aig.z );

    // If portrait orientation and in one of the danger zones
    if( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
      if( enabled ){
        disableZoom();
      }
    }
    else if( !enabled ){
      restoreZoom();
    }
  }

  w.addEventListener( "orientationchange", restoreZoom, false );
  w.addEventListener( "devicemotion", checkTilt, false );

})( this );

/*!
 * jCarousel Lite - v1.8.8 - 2014-05-04
 * http://kswedberg.github.com/jquery-carousel-lite/
 * Copyright (c) 2014 Karl Swedberg
 * Licensed MIT (http://kswedberg.github.com/jquery-carousel-lite/blob/master/LICENSE-MIT)
 */


(function($) {
$.jCarouselLite = {
  version: '1.8.8',
  curr: 0
};

$.fn.jCarouselLite = function(options) {
  var o = $.extend(true, {}, $.fn.jCarouselLite.defaults, options),
      ceil = Math.ceil,
      mabs = Math.abs;

  this.each(function() {

    var beforeCirc, afterCirc, pageNav, pageNavCount, resize,
        prepResize, touchEvents, $btnsGo,
        isTouch = 'ontouchend' in document,
        styles = { div: {}, ul: {}, li: {} },
        firstCss = true,
        running = false,
        animCss = o.vertical ? 'top': 'left',
        aniProps = {},
        sizeProp = o.vertical ? 'height': 'width',
        outerMethod = o.vertical ? 'outerHeight': 'outerWidth',
        self = this,
        div = $(this),
        ul = div.find('ul').eq(0),
        tLi = ul.children('li'),
        tl = tLi.length,
        visibleNum = o.visible,
        // need visibleCeil and visibleFloor in case we want a fractional number of visible items at a time
        visibleCeil = ceil(visibleNum),
        visibleFloor = Math.floor(visibleNum),
        start = Math.min(o.start, tl - 1),
        direction = 1,
        activeBtnOffset = 0,
        activeBtnTypes = {},
        startTouch = {},
        endTouch = {},
        axisPrimary = o.vertical ? 'y' : 'x',
        axisSecondary = o.vertical ? 'x' : 'y';


    var init = o.init.call(this, o, tLi);
    // bail out for this carousel if the o.init() callback returns `false`
    if ( init === false ) {
      return;
    }

    div.data('dirjc', direction);
    div.data(animCss + 'jc', div.css(animCss));

    if (o.circular) {

      beforeCirc = tLi.slice( tl - visibleCeil ).clone(true).each(fixIds);
      afterCirc = tLi.slice( 0, visibleCeil ).clone(true).each(fixIds);
      ul.prepend( beforeCirc )
        .append( afterCirc );
      start += visibleCeil;
      activeBtnOffset = visibleCeil;

    }

    if (o.btnGo && o.btnGo.length) {

      if ( $.isArray(o.btnGo) && typeof o.btnGo[0] === 'string' ) {
        $btnsGo = $( o.btnGo.join() );
      } else {
        $btnsGo = $(o.btnGo);
      }

      $btnsGo.each(function(i) {
        $(this).bind('click.jc', function(event) {
          event.preventDefault();
          return go(o.circular ? visibleNum + i : i);
        });
      });
      activeBtnTypes.go = 1;
    }

    var setActiveBtn = function(i, types) {
      i = ceil(i);

      var activeBtnIndex = (i - activeBtnOffset) % tl,
          visEnd = activeBtnIndex + visibleFloor;

      if ( types.go ) {
        // remove active and visible classes from all the go buttons
        $btnsGo.removeClass(o.activeClass).removeClass(o.visibleClass);
        // add active class to the go button corresponding to the first visible slide
        $btnsGo.eq(activeBtnIndex).addClass(o.activeClass);
        // add visible class to go buttons corresponding to all visible slides
        $btnsGo.slice(activeBtnIndex, activeBtnIndex + visibleFloor).addClass(o.visibleClass);

        if ( visEnd > $btnsGo.length ) {
          $btnsGo.slice(0, visEnd - $btnsGo.length).addClass(o.visibleClass);
        }
      }

      if ( types.pager ) {
        pageNav.removeClass(o.activeClass);
        pageNav.eq( ceil(activeBtnIndex / visibleNum) ).addClass(o.activeClass);
      }
      return activeBtnIndex;
    };

    var li = ul.children('li'),
        itemLength = li.length,
        curr = start;

    $.jCarouselLite.curr = curr;

    var getDimensions = function(reset) {
      var liSize, ulSize, divSize;

      if (reset) {

        styles.div[sizeProp] = '';
        styles.li = {
          width: '', height: ''
        };
        // bail out with the reset styles
        return styles;
      }

      // Full li size(incl margin)-Used for animation
      liSize = li[outerMethod](true);

      // size of full ul(total length, not just for the visible items)
      ulSize = liSize * itemLength;

      // size of entire div(total length for just the visible items)
      divSize = liSize * visibleNum;

      styles.div[sizeProp] = divSize + 'px';
      styles.ul[sizeProp] = ulSize + 'px';
      styles.ul[animCss] = -(curr * liSize) + 'px';
      styles.li = {
        width: li.width(), height: li.height()
      };
      styles.liSize = liSize;
      return styles;
    };


    var setDimensions = function(reset) {
      var css, tmpDivSize;
      var prelimCss = {
        div: {visibility: 'visible', position: 'relative', zIndex: 2, left: '0'},
        ul: {margin: '0', padding: '0', position: 'relative', listStyleType: 'none', zIndex: 1},
        li: {overflow: o.vertical ? 'hidden' : 'visible', 'float': o.vertical ? 'none' : 'left'}
      };

      if (reset) {
        css = getDimensions(true);
        div.css(css.div);
        ul.css(css.ul);
        li.css(css.li);
      }

      css = getDimensions();

      if (o.autoCSS && firstCss) {
        $.extend(true, css, prelimCss);
        firstCss = false;
      }

      if (o.autoWidth) {
        tmpDivSize = parseInt(div.css(sizeProp), 10);
        styles.liSize = tmpDivSize / o.visible;
        css.li[sizeProp] = styles.liSize - (li[outerMethod](true) - parseInt(li.css(sizeProp), 10));

        // Need to adjust other settings to fit with li width
        css.ul[sizeProp] = (styles.liSize * itemLength) + 'px';
        css.ul[animCss] = -(curr * styles.liSize) + 'px';
        css.div[sizeProp] = tmpDivSize;
      }

      if (o.autoCSS) {
        li.css(css.li);
        ul.css(css.ul);
        div.css(css.div);
      }
    };

    setDimensions();

    // set up timed advancer
    var advanceCounter = 0,
        autoStop = iterations(tl, o),
        autoScrollBy = typeof o.auto === 'number' ? o.auto : o.scroll;

    var advancer = function() {
      self.setAutoAdvance = setTimeout(function() {

        if (!autoStop || autoStop > advanceCounter) {
          direction = div.data('dirjc');
          go( curr + (direction * autoScrollBy), {auto: true} );
          advanceCounter++;
          advancer();
        }
      }, o.timeout);
    };

    // bind click handlers to prev and next buttons, if set
    $.each([ 'btnPrev', 'btnNext' ], function(index, btn) {
      if ( o[btn] ) {
        o['$' + btn] = $.isFunction( o[btn] ) ? o[btn].call( div[0] ) : $( o[btn] );
        o['$' + btn].bind('click.jc', function(event) {
          event.preventDefault();
          var step = index === 0 ? curr - o.scroll : curr + o.scroll;
          if (o.directional) {
            // set direction of subsequent scrolls to:
            //  1 if "btnNext" clicked
            // -1 if "btnPrev" clicked
            div.data( 'dirjc', (index ? 1 : -1) );
          }
          return go( step );
        });
      }
    });

    if (!o.circular) {
      if (o.btnPrev && start === 0) {
        o.$btnPrev.addClass(o.btnDisabledClass);
      }

      if ( o.btnNext && start + visibleFloor >= itemLength ) {
        o.$btnNext.addClass(o.btnDisabledClass);
      }
    }

    if (o.autoPager) {
      pageNavCount = ceil(tl / visibleNum);
      pageNav = [];
      for (var i=0; i < pageNavCount; i++) {
        pageNav.push('<li><a href="#">' + (i+1) + '</a></li>');
      }
      if (pageNav.length > 1) {
        pageNav = $('<ul>' + pageNav.join('') + '</ul>').appendTo(o.autoPager).find('li');
        pageNav.find('a').each(function(i) {
          $(this).bind('click.jc', function(event) {
            event.preventDefault();
            var slide = i * visibleNum;
            if (o.circular) {
              slide += visibleNum;
            }
            return go(slide);
          });
        });
        activeBtnTypes.pager = 1;
      }
    }

    // set the active class on the btn corresponding to the "start" li
    setActiveBtn(start, activeBtnTypes);

    if (o.mouseWheel && div.mousewheel) {
      div.bind('mousewheel.jc', function(e, d) {
        return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll);
      });
    }

    if (o.pause && o.auto && !isTouch) {
      div.bind('mouseenter.jc', function() {
        div.trigger('pauseCarousel.jc');
      }).bind('mouseleave.jc', function() {
        div.trigger('resumeCarousel.jc');
      });
    }

    if (o.auto) {
      advancer();
    }

    function vis() {
      return li.slice(curr).slice(0, visibleCeil);
    }

    $.jCarouselLite.vis = vis;

    function go(to, settings) {
      if (running) { return false; }
      settings = settings || {};
      var prev = curr,
          direction = to > curr,
          speed = settings.speed || o.speed,
          // offset appears if touch moves slides
          offset = settings.offset || 0;


      if (o.beforeStart) {
        o.beforeStart.call(div, vis(), direction);
      }

      li.removeClass(o.activeClass);

      // If circular and we are in first or last, then go to the other end
      if (o.circular) {
        if (to > curr && to > itemLength - visibleCeil) {
          curr = curr % tl;
          to = curr + (settings.auto ? autoScrollBy : o.scroll);
          ul.css(animCss, (-curr * styles.liSize) - offset);
        } else if ( to < curr && to < 0) {
          curr += tl;
          to += tl;
          ul.css(animCss, (-curr * styles.liSize) - offset);
        }

        curr = to + (to % 1);

      // If non-circular and "to" points beyond first or last, we change to first or last.
      } else {
        if (to < 0) {
          to = 0;
        } else if  (to > itemLength - visibleFloor) {
          to = itemLength - visibleFloor;
        }

        curr = to;

        if (curr === 0 && o.first) {
          o.first.call(this, vis(), direction);
        }

        if (curr === itemLength - visibleFloor && o.last) {
          o.last.call(this, vis(), direction);
        }

        // Disable buttons when the carousel reaches the last/first, and enable when not
        if (o.btnPrev) {
          o.$btnPrev.toggleClass(o.btnDisabledClass, curr === 0);
        }
        if (o.btnNext) {
          o.$btnNext.toggleClass(o.btnDisabledClass, curr === itemLength - visibleFloor);
        }
      }

      // if btnGo, set the active class on the btnGo element corresponding to the first visible carousel li
      // if autoPager, set active class on the appropriate autopager element
      setActiveBtn(curr, activeBtnTypes);

      $.jCarouselLite.curr = curr;

      if (prev === curr && !settings.force) {
        if (o.afterEnd) {
          o.afterEnd.call(div, vis(), direction);
        }
        return curr;
      }

      running = true;

      aniProps[animCss] = -(curr * styles.liSize);
      ul.animate(aniProps, speed, o.easing, function() {
        if (o.afterEnd) {
          o.afterEnd.call(div, vis(), direction);
        }
        running = false;
      });

      li.eq(curr).addClass(o.activeClass);

      return curr;
    } // end go function

    // bind custom events so they can be triggered by user
    div
    .bind('go.jc', function(e, to, settings) {

      if (typeof to === 'undefined') {
        to = '+=1';
      }

      var todir = typeof to === 'string' && /(\+=|-=)(\d+)/.exec(to);

      if ( todir ) {
        to = todir[1] === '-=' ? curr - todir[2] * 1 : curr + todir[2] * 1;
      } else {
        to += start;
      }
      go(to, settings);
    })
    .bind('startCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;
      div.trigger('go', '+=' + o.scroll);
      advancer();
      div.removeData('pausedjc').removeData('stoppedjc');
    })
    .bind('resumeCarousel.jc', function(event, forceRun) {
      if (self.setAutoAdvance) { return; }
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;

      var stopped = div.data('stoppedjc');
      if ( forceRun || !stopped ) {
        advancer();
        div.removeData('pausedjc');
        if (stopped) {
          div.removeData('stoppedjc');
        }
      }
    })

    .bind('pauseCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;
      div.data('pausedjc', true);
    })
    .bind('stopCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;

      div.data('stoppedjc', true);
    })

    .bind('refreshCarousel.jc', function(event) {
      setDimensions(o.autoCSS);
    })

    .bind('endCarousel.jc', function() {
      if (self.setAutoAdvance) {
        clearTimeout(self.setAutoAdvance);
        self.setAutoAdvance = undefined;
      }
      if (o.btnPrev) {
        o.$btnPrev.addClass(o.btnDisabledClass).unbind('.jc');
      }
      if (o.btnNext) {
        o.$btnNext.addClass(o.btnDisabledClass).unbind('.jc');
      }
      if (o.btnGo) {
        $.each(o.btnGo, function(i, val) {
          $(val).unbind('.jc');
        });
      }

      if (o.circular) {
        li.slice(0, visibleCeil).remove();
        li.slice(-visibleCeil).remove();
      }
      $.each([animCss + 'jc', 'pausedjc', 'stoppedjc', 'dirjc'], function(i, d) {
        div.removeData(d);
      });
      div.unbind('.jc');
    });

    // touch gesture support

    touchEvents = {
      touchstart: function(event) {
        endTouch.x = 0;
        endTouch.y = 0;
        startTouch.x = event.targetTouches[0].pageX;
        startTouch.y = event.targetTouches[0].pageY;
        startTouch[animCss] = parseFloat( ul.css(animCss) );
        startTouch.time = +new Date();
      },

      touchmove: function(event) {
        var tlength = event.targetTouches.length;

        if (tlength === 1) {
          endTouch.x = event.targetTouches[0].pageX;
          endTouch.y = event.targetTouches[0].pageY;
          aniProps[animCss] = startTouch[animCss] + (endTouch[axisPrimary] - startTouch[axisPrimary]);
          ul.css(aniProps);
          if (o.preventTouchWindowScroll) {
            event.preventDefault();
          }
        } else {
          endTouch.x = startTouch.x;
          endTouch.y = startTouch.y;
        }
      },

      touchend: function(event) {
        // bail out early if there is no touch movement
        if (!endTouch.x) {
          return;
        }

        var pxDelta = startTouch[axisPrimary] - endTouch[axisPrimary],
            pxAbsDelta = mabs( pxDelta ),
            primaryAxisGood = pxAbsDelta > o.swipeThresholds[axisPrimary],
            secondaryAxisGood =  mabs(startTouch[axisSecondary] - endTouch[axisSecondary]) < o.swipeThresholds[axisSecondary],
            timeDelta = +new Date() - startTouch.time,
            quickSwipe = timeDelta < o.swipeThresholds.time,
            operator = pxDelta > 0 ? '+=' : '-=',
            to = operator + o.scroll,
            swipeInfo  = { force: true };

        // quick, clean swipe
        if ( quickSwipe && primaryAxisGood && secondaryAxisGood ) {
          // set animation speed to twice as fast as that set in speed option
          swipeInfo.speed = o.speed / 2;
        }
        else
        // slow swipe < 1/2 slide width, OR
        // not enough movement for swipe, OR
        // too much movement on secondary axis when quick swipe
        if ( (!quickSwipe && pxAbsDelta < styles.liSize / 2) ||
          !primaryAxisGood ||
          (quickSwipe && !secondaryAxisGood)
          ) {
          // revert to same slide
          to = '+=0';
        }
        else
        // slow swipe > 1/2 slide width
        if ( !quickSwipe && pxAbsDelta > styles.liSize / 2 ) {
          to = Math.round(pxAbsDelta / styles.liSize);
          to = operator + (to > o.visible ? o.visible : to);

          // send pxDelta along as offset in case carousel is circular and needs to reset
          swipeInfo.offset = pxDelta;
        }

        div.trigger('go.jc', [to, swipeInfo]);
        endTouch = {};
      },

      handle: function(event) {
        event = event.originalEvent;
        touchEvents[event.type](event);
      }
    };

    if ( isTouch && o.swipe ) {
      div.bind('touchstart.jc touchmove.jc touchend.jc', touchEvents.handle);
    } // end swipe events

    // Responsive design handling:
    // Reset dimensions on window.resize
    if (o.responsive) {
      prepResize = o.autoCSS;
      $(window).bind('resize', function(event) {
        if (prepResize) {
          ul.width( ul.width() * 2 );
          prepResize = false;
        }

        clearTimeout(resize);
        resize = setTimeout(function() {
          div.trigger('refreshCarousel.jc');
          prepResize = o.autoCSS;
        }, 100);

      });
    }



  }); // end each

  return this;
};

$.fn.jCarouselLite.defaults = {
  btnPrev: null,
  btnNext: null,

  // array (or jQuery object) of elements. When clicked, makes the corresponding carousel LI the first visible one
  btnGo: null,

  // selector (or jQuery object) indicating the containing element for pagination navigation.
  autoPager: null,
  btnDisabledClass: 'disabled',

  // class applied to the active slide and btnGo element
  activeClass: 'active',

  // class applied to the btnGo elements corresponding to the visible slides
  visibleClass: 'vis',
  mouseWheel: false,
  speed: 200,
  easing: null,

  // milliseconds between scrolls
  timeout: 4000,

  // true to enable auto scrolling; number to auto-scroll by different number at a time than that of scroll option
  auto: false,


  // true to enable changing direction of auto scrolling when user clicks prev or next button
  directional: false,

  // number of times before autoscrolling will stop. (if circular is false, won't iterate more than number of items)
  autoStop: false,

  // pause scrolling on hover
  pause: true,
  vertical: false,

  // continue scrolling when reach the last item
  circular: true,

  // the number to be visible at a given time.
  visible: 3,

  // index of item to show initially in the first posiition
  start: 0,

  // number of items to scroll at a time
  scroll: 1,

  // whether to set initial styles on the carousel elements. See readme for info
  autoCSS: true,

  // whether the dimensions should change on resize
  responsive: false,

  // whether to set width of <li>s (and left/top of <ul>) based on width of <div>
  autoWidth: false,

  // touch options
  swipe: true,
  swipeThresholds: {
    x: 80,
    y: 40,
    time: 150
  },

  // whether to prevent vertical scrolling of the document window when swiping
  preventTouchWindowScroll: true,

  // Function to be called for each matched carousel when .jCaourselLite() is called.
  // Inside the function, `this` is the carousel div.
  // The function can take 2 arguments:
      // 1. The merged options object
      // 2. A jQuery object containing the <li> items in the carousel
  // If the function returns `false`, the plugin will skip all the carousel magic for that carousel div
  init: function() {},

  // function to be called once the first slide is hit
  first: null,

  // function to be called once the last slide is hit
  last: null,

  // function to be called before each transition starts
  beforeStart: null,

  // function to be called after each transition ends
  afterEnd: null
};

function iterations(itemLength, options) {
  return options.autoStop && (options.circular ? options.autoStop : Math.min(itemLength, options.autoStop));
}

function fixIds(i) {
  if ( this.id ) {
    this.id += i;
  }
}
})(jQuery);

/*!
 * jCarousel Lite - v1.8.8 - 2014-05-04
 * http://kswedberg.github.com/jquery-carousel-lite/
 * Copyright (c) 2014 Karl Swedberg
 * Licensed MIT (http://kswedberg.github.com/jquery-carousel-lite/blob/master/LICENSE-MIT)
 */

(function(e){function t(e,t){return t.autoStop&&(t.circular?t.autoStop:Math.min(e,t.autoStop))}function i(e){this.id&&(this.id+=e)}e.jCarouselLite={version:"1.8.8",curr:0},e.fn.jCarouselLite=function(a){var s=e.extend(!0,{},e.fn.jCarouselLite.defaults,a),n=Math.ceil,l=Math.abs;return this.each(function(){function a(){return Y.slice(Q).slice(0,G)}function o(t,i){if(j)return!1;i=i||{};var n=Q,l=t>Q,o=i.speed||s.speed,r=i.offset||0;return s.beforeStart&&s.beforeStart.call(T,a(),l),Y.removeClass(s.activeClass),s.circular?(t>Q&&t>H-G?(Q%=z,t=Q+(i.auto?R:s.scroll),D.css(m,-Q*C.liSize-r)):Q>t&&0>t&&(Q+=z,t+=z,D.css(m,-Q*C.liSize-r)),Q=t+t%1):(0>t?t=0:t>H-N&&(t=H-N),Q=t,0===Q&&s.first&&s.first.call(this,a(),l),Q===H-N&&s.last&&s.last.call(this,a(),l),s.btnPrev&&s.$btnPrev.toggleClass(s.btnDisabledClass,0===Q),s.btnNext&&s.$btnNext.toggleClass(s.btnDisabledClass,Q===H-N)),X(Q,E),e.jCarouselLite.curr=Q,n!==Q||i.force?(j=!0,S[m]=-(Q*C.liSize),D.animate(S,o,s.easing,function(){s.afterEnd&&s.afterEnd.call(T,a(),l),j=!1}),Y.eq(Q).addClass(s.activeClass),Q):(s.afterEnd&&s.afterEnd.call(T,a(),l),Q)}var r,c,u,d,v,f,h,b,p="ontouchend"in document,C={div:{},ul:{},li:{}},g=!0,j=!1,m=s.vertical?"top":"left",S={},x=s.vertical?"height":"width",A=s.vertical?"outerHeight":"outerWidth",w=this,T=e(this),D=T.find("ul").eq(0),y=D.children("li"),z=y.length,P=s.visible,G=n(P),N=Math.floor(P),$=Math.min(s.start,z-1),L=1,W=0,E={},M={},q={},I=s.vertical?"y":"x",k=s.vertical?"x":"y",F=s.init.call(this,s,y);if(F!==!1){T.data("dirjc",L),T.data(m+"jc",T.css(m)),s.circular&&(r=y.slice(z-G).clone(!0).each(i),c=y.slice(0,G).clone(!0).each(i),D.prepend(r).append(c),$+=G,W=G),s.btnGo&&s.btnGo.length&&(b=e.isArray(s.btnGo)&&"string"==typeof s.btnGo[0]?e(s.btnGo.join()):e(s.btnGo),b.each(function(t){e(this).bind("click.jc",function(e){return e.preventDefault(),o(s.circular?P+t:t)})}),E.go=1);var X=function(e,t){e=n(e);var i=(e-W)%z,a=i+N;return t.go&&(b.removeClass(s.activeClass).removeClass(s.visibleClass),b.eq(i).addClass(s.activeClass),b.slice(i,i+N).addClass(s.visibleClass),a>b.length&&b.slice(0,a-b.length).addClass(s.visibleClass)),t.pager&&(u.removeClass(s.activeClass),u.eq(n(i/P)).addClass(s.activeClass)),i},Y=D.children("li"),H=Y.length,Q=$;e.jCarouselLite.curr=Q;var B=function(e){var t,i,a;return e?(C.div[x]="",C.li={width:"",height:""},C):(t=Y[A](!0),i=t*H,a=t*P,C.div[x]=a+"px",C.ul[x]=i+"px",C.ul[m]=-(Q*t)+"px",C.li={width:Y.width(),height:Y.height()},C.liSize=t,C)},J=function(t){var i,a,n={div:{visibility:"visible",position:"relative",zIndex:2,left:"0"},ul:{margin:"0",padding:"0",position:"relative",listStyleType:"none",zIndex:1},li:{overflow:s.vertical?"hidden":"visible","float":s.vertical?"none":"left"}};t&&(i=B(!0),T.css(i.div),D.css(i.ul),Y.css(i.li)),i=B(),s.autoCSS&&g&&(e.extend(!0,i,n),g=!1),s.autoWidth&&(a=parseInt(T.css(x),10),C.liSize=a/s.visible,i.li[x]=C.liSize-(Y[A](!0)-parseInt(Y.css(x),10)),i.ul[x]=C.liSize*H+"px",i.ul[m]=-(Q*C.liSize)+"px",i.div[x]=a),s.autoCSS&&(Y.css(i.li),D.css(i.ul),T.css(i.div))};J();var K=0,O=t(z,s),R="number"==typeof s.auto?s.auto:s.scroll,U=function(){w.setAutoAdvance=setTimeout(function(){(!O||O>K)&&(L=T.data("dirjc"),o(Q+L*R,{auto:!0}),K++,U())},s.timeout)};if(e.each(["btnPrev","btnNext"],function(t,i){s[i]&&(s["$"+i]=e.isFunction(s[i])?s[i].call(T[0]):e(s[i]),s["$"+i].bind("click.jc",function(e){e.preventDefault();var i=0===t?Q-s.scroll:Q+s.scroll;return s.directional&&T.data("dirjc",t?1:-1),o(i)}))}),s.circular||(s.btnPrev&&0===$&&s.$btnPrev.addClass(s.btnDisabledClass),s.btnNext&&$+N>=H&&s.$btnNext.addClass(s.btnDisabledClass)),s.autoPager){d=n(z/P),u=[];for(var V=0;d>V;V++)u.push('<li><a href="#">'+(V+1)+"</a></li>");u.length>1&&(u=e("<ul>"+u.join("")+"</ul>").appendTo(s.autoPager).find("li"),u.find("a").each(function(t){e(this).bind("click.jc",function(e){e.preventDefault();var i=t*P;return s.circular&&(i+=P),o(i)})}),E.pager=1)}X($,E),s.mouseWheel&&T.mousewheel&&T.bind("mousewheel.jc",function(e,t){return t>0?o(Q-s.scroll):o(Q+s.scroll)}),s.pause&&s.auto&&!p&&T.bind("mouseenter.jc",function(){T.trigger("pauseCarousel.jc")}).bind("mouseleave.jc",function(){T.trigger("resumeCarousel.jc")}),s.auto&&U(),e.jCarouselLite.vis=a,T.bind("go.jc",function(e,t,i){t===void 0&&(t="+=1");var a="string"==typeof t&&/(\+=|-=)(\d+)/.exec(t);a?t="-="===a[1]?Q-1*a[2]:Q+1*a[2]:t+=$,o(t,i)}).bind("startCarousel.jc",function(){clearTimeout(w.setAutoAdvance),w.setAutoAdvance=void 0,T.trigger("go","+="+s.scroll),U(),T.removeData("pausedjc").removeData("stoppedjc")}).bind("resumeCarousel.jc",function(e,t){if(!w.setAutoAdvance){clearTimeout(w.setAutoAdvance),w.setAutoAdvance=void 0;var i=T.data("stoppedjc");(t||!i)&&(U(),T.removeData("pausedjc"),i&&T.removeData("stoppedjc"))}}).bind("pauseCarousel.jc",function(){clearTimeout(w.setAutoAdvance),w.setAutoAdvance=void 0,T.data("pausedjc",!0)}).bind("stopCarousel.jc",function(){clearTimeout(w.setAutoAdvance),w.setAutoAdvance=void 0,T.data("stoppedjc",!0)}).bind("refreshCarousel.jc",function(){J(s.autoCSS)}).bind("endCarousel.jc",function(){w.setAutoAdvance&&(clearTimeout(w.setAutoAdvance),w.setAutoAdvance=void 0),s.btnPrev&&s.$btnPrev.addClass(s.btnDisabledClass).unbind(".jc"),s.btnNext&&s.$btnNext.addClass(s.btnDisabledClass).unbind(".jc"),s.btnGo&&e.each(s.btnGo,function(t,i){e(i).unbind(".jc")}),s.circular&&(Y.slice(0,G).remove(),Y.slice(-G).remove()),e.each([m+"jc","pausedjc","stoppedjc","dirjc"],function(e,t){T.removeData(t)}),T.unbind(".jc")}),h={touchstart:function(e){q.x=0,q.y=0,M.x=e.targetTouches[0].pageX,M.y=e.targetTouches[0].pageY,M[m]=parseFloat(D.css(m)),M.time=+new Date},touchmove:function(e){var t=e.targetTouches.length;1===t?(q.x=e.targetTouches[0].pageX,q.y=e.targetTouches[0].pageY,S[m]=M[m]+(q[I]-M[I]),D.css(S),s.preventTouchWindowScroll&&e.preventDefault()):(q.x=M.x,q.y=M.y)},touchend:function(){if(q.x){var e=M[I]-q[I],t=l(e),i=t>s.swipeThresholds[I],a=l(M[k]-q[k])<s.swipeThresholds[k],n=+new Date-M.time,o=s.swipeThresholds.time>n,r=e>0?"+=":"-=",c=r+s.scroll,u={force:!0};o&&i&&a?u.speed=s.speed/2:!o&&C.liSize/2>t||!i||o&&!a?c="+=0":!o&&t>C.liSize/2&&(c=Math.round(t/C.liSize),c=r+(c>s.visible?s.visible:c),u.offset=e),T.trigger("go.jc",[c,u]),q={}}},handle:function(e){e=e.originalEvent,h[e.type](e)}},p&&s.swipe&&T.bind("touchstart.jc touchmove.jc touchend.jc",h.handle),s.responsive&&(f=s.autoCSS,e(window).bind("resize",function(){f&&(D.width(2*D.width()),f=!1),clearTimeout(v),v=setTimeout(function(){T.trigger("refreshCarousel.jc"),f=s.autoCSS},100)}))}}),this},e.fn.jCarouselLite.defaults={btnPrev:null,btnNext:null,btnGo:null,autoPager:null,btnDisabledClass:"disabled",activeClass:"active",visibleClass:"vis",mouseWheel:!1,speed:200,easing:null,timeout:4e3,auto:!1,directional:!1,autoStop:!1,pause:!0,vertical:!1,circular:!0,visible:3,start:0,scroll:1,autoCSS:!0,responsive:!1,autoWidth:!1,swipe:!0,swipeThresholds:{x:80,y:40,time:150},preventTouchWindowScroll:!0,init:function(){},first:null,last:null,beforeStart:null,afterEnd:null}})(jQuery);

(function($) {
$.jCarouselLite = {
  version: '1.8.8',
  curr: 0
};

$.fn.jCarouselLite = function(options) {
  var o = $.extend(true, {}, $.fn.jCarouselLite.defaults, options),
      ceil = Math.ceil,
      mabs = Math.abs;

  this.each(function() {

    var beforeCirc, afterCirc, pageNav, pageNavCount, resize,
        prepResize, touchEvents, $btnsGo,
        isTouch = 'ontouchend' in document,
        styles = { div: {}, ul: {}, li: {} },
        firstCss = true,
        running = false,
        animCss = o.vertical ? 'top': 'left',
        aniProps = {},
        sizeProp = o.vertical ? 'height': 'width',
        outerMethod = o.vertical ? 'outerHeight': 'outerWidth',
        self = this,
        div = $(this),
        ul = div.find('ul').eq(0),
        tLi = ul.children('li'),
        tl = tLi.length,
        visibleNum = o.visible,
        // need visibleCeil and visibleFloor in case we want a fractional number of visible items at a time
        visibleCeil = ceil(visibleNum),
        visibleFloor = Math.floor(visibleNum),
        start = Math.min(o.start, tl - 1),
        direction = 1,
        activeBtnOffset = 0,
        activeBtnTypes = {},
        startTouch = {},
        endTouch = {},
        axisPrimary = o.vertical ? 'y' : 'x',
        axisSecondary = o.vertical ? 'x' : 'y';


    var init = o.init.call(this, o, tLi);
    // bail out for this carousel if the o.init() callback returns `false`
    if ( init === false ) {
      return;
    }

    div.data('dirjc', direction);
    div.data(animCss + 'jc', div.css(animCss));

    if (o.circular) {

      beforeCirc = tLi.slice( tl - visibleCeil ).clone(true).each(fixIds);
      afterCirc = tLi.slice( 0, visibleCeil ).clone(true).each(fixIds);
      ul.prepend( beforeCirc )
        .append( afterCirc );
      start += visibleCeil;
      activeBtnOffset = visibleCeil;

    }

    if (o.btnGo && o.btnGo.length) {

      if ( $.isArray(o.btnGo) && typeof o.btnGo[0] === 'string' ) {
        $btnsGo = $( o.btnGo.join() );
      } else {
        $btnsGo = $(o.btnGo);
      }

      $btnsGo.each(function(i) {
        $(this).bind('click.jc', function(event) {
          event.preventDefault();
          return go(o.circular ? visibleNum + i : i);
        });
      });
      activeBtnTypes.go = 1;
    }

    var setActiveBtn = function(i, types) {
      i = ceil(i);

      var activeBtnIndex = (i - activeBtnOffset) % tl,
          visEnd = activeBtnIndex + visibleFloor;

      if ( types.go ) {
        // remove active and visible classes from all the go buttons
        $btnsGo.removeClass(o.activeClass).removeClass(o.visibleClass);
        // add active class to the go button corresponding to the first visible slide
        $btnsGo.eq(activeBtnIndex).addClass(o.activeClass);
        // add visible class to go buttons corresponding to all visible slides
        $btnsGo.slice(activeBtnIndex, activeBtnIndex + visibleFloor).addClass(o.visibleClass);

        if ( visEnd > $btnsGo.length ) {
          $btnsGo.slice(0, visEnd - $btnsGo.length).addClass(o.visibleClass);
        }
      }

      if ( types.pager ) {
        pageNav.removeClass(o.activeClass);
        pageNav.eq( ceil(activeBtnIndex / visibleNum) ).addClass(o.activeClass);
      }
      return activeBtnIndex;
    };

    var li = ul.children('li'),
        itemLength = li.length,
        curr = start;

    $.jCarouselLite.curr = curr;

    var getDimensions = function(reset) {
      var liSize, ulSize, divSize;

      if (reset) {

        styles.div[sizeProp] = '';
        styles.li = {
          width: '', height: ''
        };
        // bail out with the reset styles
        return styles;
      }

      // Full li size(incl margin)-Used for animation
      liSize = li[outerMethod](true);

      // size of full ul(total length, not just for the visible items)
      ulSize = liSize * itemLength;

      // size of entire div(total length for just the visible items)
      divSize = liSize * visibleNum;

      styles.div[sizeProp] = divSize + 'px';
      styles.ul[sizeProp] = ulSize + 'px';
      styles.ul[animCss] = -(curr * liSize) + 'px';
      styles.li = {
        width: li.width(), height: li.height()
      };
      styles.liSize = liSize;
      return styles;
    };


    var setDimensions = function(reset) {
      var css, tmpDivSize;
      var prelimCss = {
        div: {visibility: 'visible', position: 'relative', zIndex: 2, left: '0'},
        ul: {margin: '0', padding: '0', position: 'relative', listStyleType: 'none', zIndex: 1},
        li: {overflow: o.vertical ? 'hidden' : 'visible', 'float': o.vertical ? 'none' : 'left'}
      };

      if (reset) {
        css = getDimensions(true);
        div.css(css.div);
        ul.css(css.ul);
        li.css(css.li);
      }

      css = getDimensions();

      if (o.autoCSS && firstCss) {
        $.extend(true, css, prelimCss);
        firstCss = false;
      }

      if (o.autoWidth) {
        tmpDivSize = parseInt(div.css(sizeProp), 10);
        styles.liSize = tmpDivSize / o.visible;
        css.li[sizeProp] = styles.liSize - (li[outerMethod](true) - parseInt(li.css(sizeProp), 10));

        // Need to adjust other settings to fit with li width
        css.ul[sizeProp] = (styles.liSize * itemLength) + 'px';
        css.ul[animCss] = -(curr * styles.liSize) + 'px';
        css.div[sizeProp] = tmpDivSize;
      }

      if (o.autoCSS) {
        li.css(css.li);
        ul.css(css.ul);
        div.css(css.div);
      }
    };

    setDimensions();

    // set up timed advancer
    var advanceCounter = 0,
        autoStop = iterations(tl, o),
        autoScrollBy = typeof o.auto === 'number' ? o.auto : o.scroll;

    var advancer = function() {
      self.setAutoAdvance = setTimeout(function() {

        if (!autoStop || autoStop > advanceCounter) {
          direction = div.data('dirjc');
          go( curr + (direction * autoScrollBy), {auto: true} );
          advanceCounter++;
          advancer();
        }
      }, o.timeout);
    };

    // bind click handlers to prev and next buttons, if set
    $.each([ 'btnPrev', 'btnNext' ], function(index, btn) {
      if ( o[btn] ) {
        o['$' + btn] = $.isFunction( o[btn] ) ? o[btn].call( div[0] ) : $( o[btn] );
        o['$' + btn].bind('click.jc', function(event) {
          event.preventDefault();
          var step = index === 0 ? curr - o.scroll : curr + o.scroll;
          if (o.directional) {
            // set direction of subsequent scrolls to:
            //  1 if "btnNext" clicked
            // -1 if "btnPrev" clicked
            div.data( 'dirjc', (index ? 1 : -1) );
          }
          return go( step );
        });
      }
    });

    if (!o.circular) {
      if (o.btnPrev && start === 0) {
        o.$btnPrev.addClass(o.btnDisabledClass);
      }

      if ( o.btnNext && start + visibleFloor >= itemLength ) {
        o.$btnNext.addClass(o.btnDisabledClass);
      }
    }

    if (o.autoPager) {
      pageNavCount = ceil(tl / visibleNum);
      pageNav = [];
      for (var i=0; i < pageNavCount; i++) {
        pageNav.push('<li><a href="#">' + (i+1) + '</a></li>');
      }
      if (pageNav.length > 1) {
        pageNav = $('<ul>' + pageNav.join('') + '</ul>').appendTo(o.autoPager).find('li');
        pageNav.find('a').each(function(i) {
          $(this).bind('click.jc', function(event) {
            event.preventDefault();
            var slide = i * visibleNum;
            if (o.circular) {
              slide += visibleNum;
            }
            return go(slide);
          });
        });
        activeBtnTypes.pager = 1;
      }
    }

    // set the active class on the btn corresponding to the "start" li
    setActiveBtn(start, activeBtnTypes);

    if (o.mouseWheel && div.mousewheel) {
      div.bind('mousewheel.jc', function(e, d) {
        return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll);
      });
    }

    if (o.pause && o.auto && !isTouch) {
      div.bind('mouseenter.jc', function() {
        div.trigger('pauseCarousel.jc');
      }).bind('mouseleave.jc', function() {
        div.trigger('resumeCarousel.jc');
      });
    }

    if (o.auto) {
      advancer();
    }

    function vis() {
      return li.slice(curr).slice(0, visibleCeil);
    }

    $.jCarouselLite.vis = vis;

    function go(to, settings) {
      if (running) { return false; }
      settings = settings || {};
      var prev = curr,
          direction = to > curr,
          speed = settings.speed || o.speed,
          // offset appears if touch moves slides
          offset = settings.offset || 0;


      if (o.beforeStart) {
        o.beforeStart.call(div, vis(), direction);
      }

      li.removeClass(o.activeClass);

      // If circular and we are in first or last, then go to the other end
      if (o.circular) {
        if (to > curr && to > itemLength - visibleCeil) {
          curr = curr % tl;
          to = curr + (settings.auto ? autoScrollBy : o.scroll);
          ul.css(animCss, (-curr * styles.liSize) - offset);
        } else if ( to < curr && to < 0) {
          curr += tl;
          to += tl;
          ul.css(animCss, (-curr * styles.liSize) - offset);
        }

        curr = to + (to % 1);

      // If non-circular and "to" points beyond first or last, we change to first or last.
      } else {
        if (to < 0) {
          to = 0;
        } else if  (to > itemLength - visibleFloor) {
          to = itemLength - visibleFloor;
        }

        curr = to;

        if (curr === 0 && o.first) {
          o.first.call(this, vis(), direction);
        }

        if (curr === itemLength - visibleFloor && o.last) {
          o.last.call(this, vis(), direction);
        }

        // Disable buttons when the carousel reaches the last/first, and enable when not
        if (o.btnPrev) {
          o.$btnPrev.toggleClass(o.btnDisabledClass, curr === 0);
        }
        if (o.btnNext) {
          o.$btnNext.toggleClass(o.btnDisabledClass, curr === itemLength - visibleFloor);
        }
      }

      // if btnGo, set the active class on the btnGo element corresponding to the first visible carousel li
      // if autoPager, set active class on the appropriate autopager element
      setActiveBtn(curr, activeBtnTypes);

      $.jCarouselLite.curr = curr;

      if (prev === curr && !settings.force) {
        if (o.afterEnd) {
          o.afterEnd.call(div, vis(), direction);
        }
        return curr;
      }

      running = true;

      aniProps[animCss] = -(curr * styles.liSize);
      ul.animate(aniProps, speed, o.easing, function() {
        if (o.afterEnd) {
          o.afterEnd.call(div, vis(), direction);
        }
        running = false;
      });

      li.eq(curr).addClass(o.activeClass);

      return curr;
    } // end go function

    // bind custom events so they can be triggered by user
    div
    .bind('go.jc', function(e, to, settings) {

      if (typeof to === 'undefined') {
        to = '+=1';
      }

      var todir = typeof to === 'string' && /(\+=|-=)(\d+)/.exec(to);

      if ( todir ) {
        to = todir[1] === '-=' ? curr - todir[2] * 1 : curr + todir[2] * 1;
      } else {
        to += start;
      }
      go(to, settings);
    })
    .bind('startCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;
      div.trigger('go', '+=' + o.scroll);
      advancer();
      div.removeData('pausedjc').removeData('stoppedjc');
    })
    .bind('resumeCarousel.jc', function(event, forceRun) {
      if (self.setAutoAdvance) { return; }
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;

      var stopped = div.data('stoppedjc');
      if ( forceRun || !stopped ) {
        advancer();
        div.removeData('pausedjc');
        if (stopped) {
          div.removeData('stoppedjc');
        }
      }
    })

    .bind('pauseCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;
      div.data('pausedjc', true);
    })
    .bind('stopCarousel.jc', function(event) {
      clearTimeout(self.setAutoAdvance);
      self.setAutoAdvance = undefined;

      div.data('stoppedjc', true);
    })

    .bind('refreshCarousel.jc', function(event) {
      setDimensions(o.autoCSS);
    })

    .bind('endCarousel.jc', function() {
      if (self.setAutoAdvance) {
        clearTimeout(self.setAutoAdvance);
        self.setAutoAdvance = undefined;
      }
      if (o.btnPrev) {
        o.$btnPrev.addClass(o.btnDisabledClass).unbind('.jc');
      }
      if (o.btnNext) {
        o.$btnNext.addClass(o.btnDisabledClass).unbind('.jc');
      }
      if (o.btnGo) {
        $.each(o.btnGo, function(i, val) {
          $(val).unbind('.jc');
        });
      }

      if (o.circular) {
        li.slice(0, visibleCeil).remove();
        li.slice(-visibleCeil).remove();
      }
      $.each([animCss + 'jc', 'pausedjc', 'stoppedjc', 'dirjc'], function(i, d) {
        div.removeData(d);
      });
      div.unbind('.jc');
    });

    // touch gesture support

    touchEvents = {
      touchstart: function(event) {
        endTouch.x = 0;
        endTouch.y = 0;
        startTouch.x = event.targetTouches[0].pageX;
        startTouch.y = event.targetTouches[0].pageY;
        startTouch[animCss] = parseFloat( ul.css(animCss) );
        startTouch.time = +new Date();
      },

      touchmove: function(event) {
        var tlength = event.targetTouches.length;

        if (tlength === 1) {
          endTouch.x = event.targetTouches[0].pageX;
          endTouch.y = event.targetTouches[0].pageY;
          aniProps[animCss] = startTouch[animCss] + (endTouch[axisPrimary] - startTouch[axisPrimary]);
          ul.css(aniProps);
          if (o.preventTouchWindowScroll) {
            event.preventDefault();
          }
        } else {
          endTouch.x = startTouch.x;
          endTouch.y = startTouch.y;
        }
      },

      touchend: function(event) {
        // bail out early if there is no touch movement
        if (!endTouch.x) {
          return;
        }

        var pxDelta = startTouch[axisPrimary] - endTouch[axisPrimary],
            pxAbsDelta = mabs( pxDelta ),
            primaryAxisGood = pxAbsDelta > o.swipeThresholds[axisPrimary],
            secondaryAxisGood =  mabs(startTouch[axisSecondary] - endTouch[axisSecondary]) < o.swipeThresholds[axisSecondary],
            timeDelta = +new Date() - startTouch.time,
            quickSwipe = timeDelta < o.swipeThresholds.time,
            operator = pxDelta > 0 ? '+=' : '-=',
            to = operator + o.scroll,
            swipeInfo  = { force: true };

        // quick, clean swipe
        if ( quickSwipe && primaryAxisGood && secondaryAxisGood ) {
          // set animation speed to twice as fast as that set in speed option
          swipeInfo.speed = o.speed / 2;
        }
        else
        // slow swipe < 1/2 slide width, OR
        // not enough movement for swipe, OR
        // too much movement on secondary axis when quick swipe
        if ( (!quickSwipe && pxAbsDelta < styles.liSize / 2) ||
          !primaryAxisGood ||
          (quickSwipe && !secondaryAxisGood)
          ) {
          // revert to same slide
          to = '+=0';
        }
        else
        // slow swipe > 1/2 slide width
        if ( !quickSwipe && pxAbsDelta > styles.liSize / 2 ) {
          to = Math.round(pxAbsDelta / styles.liSize);
          to = operator + (to > o.visible ? o.visible : to);

          // send pxDelta along as offset in case carousel is circular and needs to reset
          swipeInfo.offset = pxDelta;
        }

        div.trigger('go.jc', [to, swipeInfo]);
        endTouch = {};
      },

      handle: function(event) {
        event = event.originalEvent;
        touchEvents[event.type](event);
      }
    };

    if ( isTouch && o.swipe ) {
      div.bind('touchstart.jc touchmove.jc touchend.jc', touchEvents.handle);
    } // end swipe events

    // Responsive design handling:
    // Reset dimensions on window.resize
    if (o.responsive) {
      prepResize = o.autoCSS;
      $(window).bind('resize', function(event) {
        if (prepResize) {
          ul.width( ul.width() * 2 );
          prepResize = false;
        }

        clearTimeout(resize);
        resize = setTimeout(function() {
          div.trigger('refreshCarousel.jc');
          prepResize = o.autoCSS;
        }, 100);

      });
    }



  }); // end each

  return this;
};

$.fn.jCarouselLite.defaults = {
  btnPrev: null,
  btnNext: null,

  // array (or jQuery object) of elements. When clicked, makes the corresponding carousel LI the first visible one
  btnGo: null,

  // selector (or jQuery object) indicating the containing element for pagination navigation.
  autoPager: null,
  btnDisabledClass: 'disabled',

  // class applied to the active slide and btnGo element
  activeClass: 'active',

  // class applied to the btnGo elements corresponding to the visible slides
  visibleClass: 'vis',
  mouseWheel: false,
  speed: 200,
  easing: null,

  // milliseconds between scrolls
  timeout: 4000,

  // true to enable auto scrolling; number to auto-scroll by different number at a time than that of scroll option
  auto: false,


  // true to enable changing direction of auto scrolling when user clicks prev or next button
  directional: false,

  // number of times before autoscrolling will stop. (if circular is false, won't iterate more than number of items)
  autoStop: false,

  // pause scrolling on hover
  pause: true,
  vertical: false,

  // continue scrolling when reach the last item
  circular: true,

  // the number to be visible at a given time.
  visible: 3,

  // index of item to show initially in the first posiition
  start: 0,

  // number of items to scroll at a time
  scroll: 1,

  // whether to set initial styles on the carousel elements. See readme for info
  autoCSS: true,

  // whether the dimensions should change on resize
  responsive: false,

  // whether to set width of <li>s (and left/top of <ul>) based on width of <div>
  autoWidth: false,

  // touch options
  swipe: true,
  swipeThresholds: {
    x: 80,
    y: 40,
    time: 150
  },

  // whether to prevent vertical scrolling of the document window when swiping
  preventTouchWindowScroll: true,

  // Function to be called for each matched carousel when .jCaourselLite() is called.
  // Inside the function, `this` is the carousel div.
  // The function can take 2 arguments:
      // 1. The merged options object
      // 2. A jQuery object containing the <li> items in the carousel
  // If the function returns `false`, the plugin will skip all the carousel magic for that carousel div
  init: function() {},

  // function to be called once the first slide is hit
  first: null,

  // function to be called once the last slide is hit
  last: null,

  // function to be called before each transition starts
  beforeStart: null,

  // function to be called after each transition ends
  afterEnd: null
};

function iterations(itemLength, options) {
  return options.autoStop && (options.circular ? options.autoStop : Math.min(itemLength, options.autoStop));
}

function fixIds(i) {
  if ( this.id ) {
    this.id += i;
  }
}
})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-toucddh-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load    
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

jQuery(document).ready(function($) {

// A.1. User Interaction
	
	//A.1.1 Show/Hide element
	

	$(".reveal").click(function(e) {
		var target = $(this).attr('href');
		if ($(target).css('display') === 'none') {
		  $('.aside-info').fadeOut(50);
		  $(target).fadeIn(100);
		}
		else {
		  $(target).fadeOut(50);
		}
		e.preventDefault();
	  });

	
	//A.1.1 End
	
	//A.1.2 Show/Hide element for mobile
	
	$(".mobi-reveal").click(function(e) {
		var target = $(this).attr('href');
		if ($(target).css('display') === 'none') {
		  $(target).fadeIn(130);
		}
		else {
		  $(target).fadeOut(130);
		}
		e.preventDefault();
	  });
	
	//A.1.2 End
	
// A.1. End
	
// A.2. Page Elements/Effects
	
	// A.2.1 Showcase Carousel Config
	
	var carouselOptions = {

		auto: true,
		autoCSS: true,
		circular: true,
		autoWidth: true,
		responsive: true,
		visible: 1,
		speed: 300,
		pause: true,
		btnPrev: function() {

			return $(this).find('.prev');

		},

		btnNext: function() {

			return $(this).find('.next');

		}
	};

	$('div.showcase-carousel').jCarouselLite(carouselOptions);
	
	// A.2.1. End
    
    
    // A.2.3. Client Carousel Config
	
	var clientcarouselOptions = {

		auto: true,
		autoCSS: true,
		circular: true,
		autoWidth: true,
		responsive: true,
		visible:6,
		speed: 300,
		pause: true,
		btnPrev: function() {

			return $(this).find('.prev');

		},

		btnNext: function() {

			return $(this).find('.next');

		}
	};

	$('div.client-carousel').jCarouselLite(clientcarouselOptions);
	
	// A.2.3. End
	
	
	// A.2.2 Truncate blog block on homepage
	
	$('.post-description').text(function(index, currentText) {
		
    	return currentText.substr(0, 70);
		
	});
	
	// A.2.2 End
    
    
    /**
     * Written by Rob Schmitt, The Web Developer's Blog
     * http://webdeveloper.beforeseven.com/
     */

    /**
     * The following variables may be adjusted
     */
    var active_color = '#000'; // Colour of user provided text
    var inactive_color = '#ccc'; // Colour of default text

    /**
     * No need to modify anything below this line
     */

      $('input.default-value').css('color', inactive_color);
      var default_values = new Array();
      $('input.default-value').focus(function() {
        if (!default_values[this.id]) {
          default_values[this.id] = this.value;
        }
        if (this.value == default_values[this.id]) {
          this.value = '';
          this.style.color = active_color;
        }
        $(this).blur(function() {
          if (this.value == '') {
            this.style.color = inactive_color;
            this.value = default_values[this.id];
          }
        });
      });



	// A.2.2 End
	
// A.2. End
	
	
});