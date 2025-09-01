var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _defineProperty$1(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && typeof navigator !== "undefined";
var timeoutDuration = function() {
  var longerTimeoutBrowsers = ["Edge", "Trident", "Firefox"];
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }
  return 0;
}();
function microtaskDebounce(fn) {
  var called = false;
  return function() {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function() {
      called = false;
      fn();
    });
  };
}
function taskDebounce(fn) {
  var scheduled = false;
  return function() {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function() {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}
var supportsMicroTasks = isBrowser && window.Promise;
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;
function isFunction$5(functionToCheck) {
  var getType2 = {};
  return functionToCheck && getType2.toString.call(functionToCheck) === "[object Function]";
}
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  var window2 = element.ownerDocument.defaultView;
  var css = window2.getComputedStyle(element, null);
  return property ? css[property] : css;
}
function getParentNode(element) {
  if (element.nodeName === "HTML") {
    return element;
  }
  return element.parentNode || element.host;
}
function getScrollParent(element) {
  if (!element) {
    return document.body;
  }
  switch (element.nodeName) {
    case "HTML":
    case "BODY":
      return element.ownerDocument.body;
    case "#document":
      return element.body;
  }
  var _getStyleComputedProp = getStyleComputedProperty(element), overflow = _getStyleComputedProp.overflow, overflowX = _getStyleComputedProp.overflowX, overflowY = _getStyleComputedProp.overflowY;
  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }
  return getScrollParent(getParentNode(element));
}
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}
var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);
function isIE$1(version2) {
  if (version2 === 11) {
    return isIE11;
  }
  if (version2 === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }
  var noOffsetParent = isIE$1(10) ? document.body : null;
  var offsetParent = element.offsetParent || null;
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }
  var nodeName = offsetParent && offsetParent.nodeName;
  if (!nodeName || nodeName === "BODY" || nodeName === "HTML") {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }
  if (["TH", "TD", "TABLE"].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, "position") === "static") {
    return getOffsetParent(offsetParent);
  }
  return offsetParent;
}
function isOffsetContainer(element) {
  var nodeName = element.nodeName;
  if (nodeName === "BODY") {
    return false;
  }
  return nodeName === "HTML" || getOffsetParent(element.firstElementChild) === element;
}
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }
  return node;
}
function findCommonOffsetParent(element1, element2) {
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;
  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }
    return getOffsetParent(commonAncestorContainer);
  }
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "top";
  var upperSide = side === "top" ? "scrollTop" : "scrollLeft";
  var nodeName = element.nodeName;
  if (nodeName === "BODY" || nodeName === "HTML") {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }
  return element[upperSide];
}
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var scrollTop = getScroll(element, "top");
  var scrollLeft = getScroll(element, "left");
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}
function getBordersSize(styles2, axis) {
  var sideA = axis === "x" ? "Left" : "Top";
  var sideB = sideA === "Left" ? "Right" : "Bottom";
  return parseFloat(styles2["border" + sideA + "Width"]) + parseFloat(styles2["border" + sideB + "Width"]);
}
function getSize(axis, body, html, computedStyle) {
  return Math.max(body["offset" + axis], body["scroll" + axis], html["client" + axis], html["offset" + axis], html["scroll" + axis], isIE$1(10) ? parseInt(html["offset" + axis]) + parseInt(computedStyle["margin" + (axis === "Height" ? "Top" : "Left")]) + parseInt(computedStyle["margin" + (axis === "Height" ? "Bottom" : "Right")]) : 0);
}
function getWindowSizes(document2) {
  var body = document2.body;
  var html = document2.documentElement;
  var computedStyle = isIE$1(10) && getComputedStyle(html);
  return {
    height: getSize("Height", body, html, computedStyle),
    width: getSize("Width", body, html, computedStyle)
  };
}
var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var defineProperty$3 = function(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
};
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}
function getBoundingClientRect(element) {
  var rect = {};
  try {
    if (isIE$1(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, "top");
      var scrollLeft = getScroll(element, "left");
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {
  }
  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };
  var sizes = element.nodeName === "HTML" ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;
  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;
  if (horizScrollbar || vertScrollbar) {
    var styles2 = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles2, "x");
    vertScrollbar -= getBordersSize(styles2, "y");
    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }
  return getClientRect(result);
}
function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var isIE102 = isIE$1(10);
  var isHTML = parent.nodeName === "HTML";
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);
  var styles2 = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles2.borderTopWidth);
  var borderLeftWidth = parseFloat(styles2.borderLeftWidth);
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;
  if (!isIE102 && isHTML) {
    var marginTop = parseFloat(styles2.marginTop);
    var marginLeft = parseFloat(styles2.marginLeft);
    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }
  if (isIE102 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== "BODY") {
    offsets = includeScroll(offsets, parent);
  }
  return offsets;
}
function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);
  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, "left") : 0;
  var offset2 = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width,
    height
  };
  return getClientRect(offset2);
}
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === "BODY" || nodeName === "HTML") {
    return false;
  }
  if (getStyleComputedProperty(element, "position") === "fixed") {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}
function getFixedPositionOffsetParent(element) {
  if (!element || !element.parentElement || isIE$1()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, "transform") === "none") {
    el = el.parentElement;
  }
  return el || document.documentElement;
}
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  if (boundariesElement === "viewport") {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    var boundariesNode = void 0;
    if (boundariesElement === "scrollParent") {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === "BODY") {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === "window") {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }
    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);
    if (boundariesNode.nodeName === "HTML" && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument), height = _getWindowSizes.height, width = _getWindowSizes.width;
      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      boundaries = offsets;
    }
  }
  padding = padding || 0;
  var isPaddingNumber = typeof padding === "number";
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;
  return boundaries;
}
function getArea(_ref) {
  var width = _ref.width, height = _ref.height;
  return width * height;
}
function computeAutoPlacement(placement2, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 0;
  if (placement2.indexOf("auto") === -1) {
    return placement2;
  }
  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);
  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };
  var sortedAreas = Object.keys(rects).map(function(key) {
    return _extends({
      key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function(a, b) {
    return b.area - a.area;
  });
  var filteredAreas = sortedAreas.filter(function(_ref2) {
    var width = _ref2.width, height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });
  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;
  var variation = placement2.split("-")[1];
  return computedPlacement + (variation ? "-" + variation : "");
}
function getReferenceOffsets(state2, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}
function getOuterSizes(element) {
  var window2 = element.ownerDocument.defaultView;
  var styles2 = window2.getComputedStyle(element);
  var x = parseFloat(styles2.marginTop || 0) + parseFloat(styles2.marginBottom || 0);
  var y = parseFloat(styles2.marginLeft || 0) + parseFloat(styles2.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}
function getOppositePlacement(placement2) {
  var hash = { left: "right", right: "left", bottom: "top", top: "bottom" };
  return placement2.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}
function getPopperOffsets(popper, referenceOffsets, placement2) {
  placement2 = placement2.split("-")[0];
  var popperRect = getOuterSizes(popper);
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };
  var isHoriz = ["right", "left"].indexOf(placement2) !== -1;
  var mainSide = isHoriz ? "top" : "left";
  var secondarySide = isHoriz ? "left" : "top";
  var measurement = isHoriz ? "height" : "width";
  var secondaryMeasurement = !isHoriz ? "height" : "width";
  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement2 === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }
  return popperOffsets;
}
function find(arr, check) {
  if (Array.prototype.find) {
    return arr.find(check);
  }
  return arr.filter(check)[0];
}
function findIndex(arr, prop, value) {
  if (Array.prototype.findIndex) {
    return arr.findIndex(function(cur) {
      return cur[prop] === value;
    });
  }
  var match = find(arr, function(obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}
function runModifiers(modifiers2, data2, ends) {
  var modifiersToRun = ends === void 0 ? modifiers2 : modifiers2.slice(0, findIndex(modifiers2, "name", ends));
  modifiersToRun.forEach(function(modifier) {
    if (modifier["function"]) {
      console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
    }
    var fn = modifier["function"] || modifier.fn;
    if (modifier.enabled && isFunction$5(fn)) {
      data2.offsets.popper = getClientRect(data2.offsets.popper);
      data2.offsets.reference = getClientRect(data2.offsets.reference);
      data2 = fn(data2, modifier);
    }
  });
  return data2;
}
function update() {
  if (this.state.isDestroyed) {
    return;
  }
  var data2 = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };
  data2.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);
  data2.placement = computeAutoPlacement(this.options.placement, data2.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);
  data2.originalPlacement = data2.placement;
  data2.positionFixed = this.options.positionFixed;
  data2.offsets.popper = getPopperOffsets(this.popper, data2.offsets.reference, data2.placement);
  data2.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute";
  data2 = runModifiers(this.modifiers, data2);
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data2);
  } else {
    this.options.onUpdate(data2);
  }
}
function isModifierEnabled(modifiers2, modifierName) {
  return modifiers2.some(function(_ref) {
    var name = _ref.name, enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}
function getSupportedPropertyName(property) {
  var prefixes2 = [false, "ms", "Webkit", "Moz", "O"];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);
  for (var i = 0; i < prefixes2.length; i++) {
    var prefix = prefixes2[i];
    var toCheck = prefix ? "" + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== "undefined") {
      return toCheck;
    }
  }
  return null;
}
function destroy() {
  this.state.isDestroyed = true;
  if (isModifierEnabled(this.modifiers, "applyStyle")) {
    this.popper.removeAttribute("x-placement");
    this.popper.style.position = "";
    this.popper.style.top = "";
    this.popper.style.left = "";
    this.popper.style.right = "";
    this.popper.style.bottom = "";
    this.popper.style.willChange = "";
    this.popper.style[getSupportedPropertyName("transform")] = "";
  }
  this.disableEventListeners();
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}
function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === "BODY";
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });
  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}
function setupEventListeners(reference, options, state2, updateBound) {
  state2.updateBound = updateBound;
  getWindow(reference).addEventListener("resize", state2.updateBound, { passive: true });
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, "scroll", state2.updateBound, state2.scrollParents);
  state2.scrollElement = scrollElement;
  state2.eventsEnabled = true;
  return state2;
}
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}
function removeEventListeners(reference, state2) {
  getWindow(reference).removeEventListener("resize", state2.updateBound);
  state2.scrollParents.forEach(function(target) {
    target.removeEventListener("scroll", state2.updateBound);
  });
  state2.updateBound = null;
  state2.scrollParents = [];
  state2.scrollElement = null;
  state2.eventsEnabled = false;
  return state2;
}
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}
function isNumeric(n) {
  return n !== "" && !isNaN(parseFloat(n)) && isFinite(n);
}
function setStyles(element, styles2) {
  Object.keys(styles2).forEach(function(prop) {
    var unit = "";
    if (["width", "height", "top", "right", "bottom", "left"].indexOf(prop) !== -1 && isNumeric(styles2[prop])) {
      unit = "px";
    }
    element.style[prop] = styles2[prop] + unit;
  });
}
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function(prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}
function applyStyle(data2) {
  setStyles(data2.instance.popper, data2.styles);
  setAttributes(data2.instance.popper, data2.attributes);
  if (data2.arrowElement && Object.keys(data2.arrowStyles).length) {
    setStyles(data2.arrowElement, data2.arrowStyles);
  }
  return data2;
}
function applyStyleOnLoad(reference, popper, options, modifierOptions, state2) {
  var referenceOffsets = getReferenceOffsets(state2, popper, reference, options.positionFixed);
  var placement2 = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);
  popper.setAttribute("x-placement", placement2);
  setStyles(popper, { position: options.positionFixed ? "fixed" : "absolute" });
  return options;
}
function getRoundedOffsets(data2, shouldRound) {
  var _data$offsets = data2.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var round = Math.round, floor = Math.floor;
  var noRound = function noRound2(v) {
    return v;
  };
  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);
  var isVertical = ["left", "right"].indexOf(data2.placement) !== -1;
  var isVariation = data2.placement.indexOf("-") !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;
  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;
  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}
var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);
function computeStyle(data2, options) {
  var x = options.x, y = options.y;
  var popper = data2.offsets.popper;
  var legacyGpuAccelerationOption = find(data2.instance.modifiers, function(modifier) {
    return modifier.name === "applyStyle";
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== void 0) {
    console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== void 0 ? legacyGpuAccelerationOption : options.gpuAcceleration;
  var offsetParent = getOffsetParent(data2.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);
  var styles2 = {
    position: popper.position
  };
  var offsets = getRoundedOffsets(data2, window.devicePixelRatio < 2 || !isFirefox);
  var sideA = x === "bottom" ? "top" : "bottom";
  var sideB = y === "right" ? "left" : "right";
  var prefixedProperty = getSupportedPropertyName("transform");
  var left = void 0, top = void 0;
  if (sideA === "bottom") {
    if (offsetParent.nodeName === "HTML") {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === "right") {
    if (offsetParent.nodeName === "HTML") {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles2[prefixedProperty] = "translate3d(" + left + "px, " + top + "px, 0)";
    styles2[sideA] = 0;
    styles2[sideB] = 0;
    styles2.willChange = "transform";
  } else {
    var invertTop = sideA === "bottom" ? -1 : 1;
    var invertLeft = sideB === "right" ? -1 : 1;
    styles2[sideA] = top * invertTop;
    styles2[sideB] = left * invertLeft;
    styles2.willChange = sideA + ", " + sideB;
  }
  var attributes = {
    "x-placement": data2.placement
  };
  data2.attributes = _extends({}, attributes, data2.attributes);
  data2.styles = _extends({}, styles2, data2.styles);
  data2.arrowStyles = _extends({}, data2.offsets.arrow, data2.arrowStyles);
  return data2;
}
function isModifierRequired(modifiers2, requestingName, requestedName) {
  var requesting = find(modifiers2, function(_ref) {
    var name = _ref.name;
    return name === requestingName;
  });
  var isRequired = !!requesting && modifiers2.some(function(modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });
  if (!isRequired) {
    var _requesting = "`" + requestingName + "`";
    var requested = "`" + requestedName + "`";
    console.warn(requested + " modifier is required by " + _requesting + " modifier in order to work, be sure to include it before " + _requesting + "!");
  }
  return isRequired;
}
function arrow(data2, options) {
  var _data$offsets$arrow;
  if (!isModifierRequired(data2.instance.modifiers, "arrow", "keepTogether")) {
    return data2;
  }
  var arrowElement = options.element;
  if (typeof arrowElement === "string") {
    arrowElement = data2.instance.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return data2;
    }
  } else {
    if (!data2.instance.popper.contains(arrowElement)) {
      console.warn("WARNING: `arrow.element` must be child of its popper element!");
      return data2;
    }
  }
  var placement2 = data2.placement.split("-")[0];
  var _data$offsets = data2.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var isVertical = ["left", "right"].indexOf(placement2) !== -1;
  var len = isVertical ? "height" : "width";
  var sideCapitalized = isVertical ? "Top" : "Left";
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? "left" : "top";
  var opSide = isVertical ? "bottom" : "right";
  var arrowElementSize = getOuterSizes(arrowElement)[len];
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data2.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data2.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data2.offsets.popper = getClientRect(data2.offsets.popper);
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;
  var css = getStyleComputedProperty(data2.instance.popper);
  var popperMarginSide = parseFloat(css["margin" + sideCapitalized]);
  var popperBorderSide = parseFloat(css["border" + sideCapitalized + "Width"]);
  var sideValue = center - data2.offsets.popper[side] - popperMarginSide - popperBorderSide;
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);
  data2.arrowElement = arrowElement;
  data2.offsets.arrow = (_data$offsets$arrow = {}, defineProperty$3(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty$3(_data$offsets$arrow, altSide, ""), _data$offsets$arrow);
  return data2;
}
function getOppositeVariation(variation) {
  if (variation === "end") {
    return "start";
  } else if (variation === "start") {
    return "end";
  }
  return variation;
}
var placements = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"];
var validPlacements = placements.slice(3);
function clockwise(placement2) {
  var counter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var index = validPlacements.indexOf(placement2);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}
var BEHAVIORS = {
  FLIP: "flip",
  CLOCKWISE: "clockwise",
  COUNTERCLOCKWISE: "counterclockwise"
};
function flip(data2, options) {
  if (isModifierEnabled(data2.instance.modifiers, "inner")) {
    return data2;
  }
  if (data2.flipped && data2.placement === data2.originalPlacement) {
    return data2;
  }
  var boundaries = getBoundaries(data2.instance.popper, data2.instance.reference, options.padding, options.boundariesElement, data2.positionFixed);
  var placement2 = data2.placement.split("-")[0];
  var placementOpposite = getOppositePlacement(placement2);
  var variation = data2.placement.split("-")[1] || "";
  var flipOrder = [];
  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement2, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement2);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement2, true);
      break;
    default:
      flipOrder = options.behavior;
  }
  flipOrder.forEach(function(step, index) {
    if (placement2 !== step || flipOrder.length === index + 1) {
      return data2;
    }
    placement2 = data2.placement.split("-")[0];
    placementOpposite = getOppositePlacement(placement2);
    var popperOffsets = data2.offsets.popper;
    var refOffsets = data2.offsets.reference;
    var floor = Math.floor;
    var overlapsRef = placement2 === "left" && floor(popperOffsets.right) > floor(refOffsets.left) || placement2 === "right" && floor(popperOffsets.left) < floor(refOffsets.right) || placement2 === "top" && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement2 === "bottom" && floor(popperOffsets.top) < floor(refOffsets.bottom);
    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);
    var overflowsBoundaries = placement2 === "left" && overflowsLeft || placement2 === "right" && overflowsRight || placement2 === "top" && overflowsTop || placement2 === "bottom" && overflowsBottom;
    var isVertical = ["top", "bottom"].indexOf(placement2) !== -1;
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === "start" && overflowsLeft || isVertical && variation === "end" && overflowsRight || !isVertical && variation === "start" && overflowsTop || !isVertical && variation === "end" && overflowsBottom);
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === "start" && overflowsRight || isVertical && variation === "end" && overflowsLeft || !isVertical && variation === "start" && overflowsBottom || !isVertical && variation === "end" && overflowsTop);
    var flippedVariation = flippedVariationByRef || flippedVariationByContent;
    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      data2.flipped = true;
      if (overlapsRef || overflowsBoundaries) {
        placement2 = flipOrder[index + 1];
      }
      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }
      data2.placement = placement2 + (variation ? "-" + variation : "");
      data2.offsets.popper = _extends({}, data2.offsets.popper, getPopperOffsets(data2.instance.popper, data2.offsets.reference, data2.placement));
      data2 = runModifiers(data2.instance.modifiers, data2, "flip");
    }
  });
  return data2;
}
function keepTogether(data2) {
  var _data$offsets = data2.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var placement2 = data2.placement.split("-")[0];
  var floor = Math.floor;
  var isVertical = ["top", "bottom"].indexOf(placement2) !== -1;
  var side = isVertical ? "right" : "bottom";
  var opSide = isVertical ? "left" : "top";
  var measurement = isVertical ? "width" : "height";
  if (popper[side] < floor(reference[opSide])) {
    data2.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data2.offsets.popper[opSide] = floor(reference[side]);
  }
  return data2;
}
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];
  if (!value) {
    return str;
  }
  if (unit.indexOf("%") === 0) {
    var element = void 0;
    switch (unit) {
      case "%p":
        element = popperOffsets;
        break;
      case "%":
      case "%r":
      default:
        element = referenceOffsets;
    }
    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === "vh" || unit === "vw") {
    var size2 = void 0;
    if (unit === "vh") {
      size2 = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size2 = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size2 / 100 * value;
  } else {
    return value;
  }
}
function parseOffset(offset2, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];
  var useHeight = ["right", "left"].indexOf(basePlacement) !== -1;
  var fragments = offset2.split(/(\+|\-)/).map(function(frag) {
    return frag.trim();
  });
  var divider = fragments.indexOf(find(fragments, function(frag) {
    return frag.search(/,|\s/) !== -1;
  }));
  if (fragments[divider] && fragments[divider].indexOf(",") === -1) {
    console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
  }
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];
  ops = ops.map(function(op, index) {
    var measurement = (index === 1 ? !useHeight : useHeight) ? "height" : "width";
    var mergeWithPrevious = false;
    return op.reduce(function(a, b) {
      if (a[a.length - 1] === "" && ["+", "-"].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, []).map(function(str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });
  ops.forEach(function(op, index) {
    op.forEach(function(frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === "-" ? -1 : 1);
      }
    });
  });
  return offsets;
}
function offset(data2, _ref) {
  var offset2 = _ref.offset;
  var placement2 = data2.placement, _data$offsets = data2.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var basePlacement = placement2.split("-")[0];
  var offsets = void 0;
  if (isNumeric(+offset2)) {
    offsets = [+offset2, 0];
  } else {
    offsets = parseOffset(offset2, popper, reference, basePlacement);
  }
  if (basePlacement === "left") {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === "right") {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === "top") {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === "bottom") {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }
  data2.popper = popper;
  return data2;
}
function preventOverflow(data2, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data2.instance.popper);
  if (data2.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }
  var transformProp = getSupportedPropertyName("transform");
  var popperStyles = data2.instance.popper.style;
  var top = popperStyles.top, left = popperStyles.left, transform = popperStyles[transformProp];
  popperStyles.top = "";
  popperStyles.left = "";
  popperStyles[transformProp] = "";
  var boundaries = getBoundaries(data2.instance.popper, data2.instance.reference, options.padding, boundariesElement, data2.positionFixed);
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;
  options.boundaries = boundaries;
  var order = options.priority;
  var popper = data2.offsets.popper;
  var check = {
    primary: function primary(placement2) {
      var value = popper[placement2];
      if (popper[placement2] < boundaries[placement2] && !options.escapeWithReference) {
        value = Math.max(popper[placement2], boundaries[placement2]);
      }
      return defineProperty$3({}, placement2, value);
    },
    secondary: function secondary(placement2) {
      var mainSide = placement2 === "right" ? "left" : "top";
      var value = popper[mainSide];
      if (popper[placement2] > boundaries[placement2] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement2] - (placement2 === "right" ? popper.width : popper.height));
      }
      return defineProperty$3({}, mainSide, value);
    }
  };
  order.forEach(function(placement2) {
    var side = ["left", "top"].indexOf(placement2) !== -1 ? "primary" : "secondary";
    popper = _extends({}, popper, check[side](placement2));
  });
  data2.offsets.popper = popper;
  return data2;
}
function shift(data2) {
  var placement2 = data2.placement;
  var basePlacement = placement2.split("-")[0];
  var shiftvariation = placement2.split("-")[1];
  if (shiftvariation) {
    var _data$offsets = data2.offsets, reference = _data$offsets.reference, popper = _data$offsets.popper;
    var isVertical = ["bottom", "top"].indexOf(basePlacement) !== -1;
    var side = isVertical ? "left" : "top";
    var measurement = isVertical ? "width" : "height";
    var shiftOffsets = {
      start: defineProperty$3({}, side, reference[side]),
      end: defineProperty$3({}, side, reference[side] + reference[measurement] - popper[measurement])
    };
    data2.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }
  return data2;
}
function hide(data2) {
  if (!isModifierRequired(data2.instance.modifiers, "hide", "preventOverflow")) {
    return data2;
  }
  var refRect = data2.offsets.reference;
  var bound = find(data2.instance.modifiers, function(modifier) {
    return modifier.name === "preventOverflow";
  }).boundaries;
  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    if (data2.hide === true) {
      return data2;
    }
    data2.hide = true;
    data2.attributes["x-out-of-boundaries"] = "";
  } else {
    if (data2.hide === false) {
      return data2;
    }
    data2.hide = false;
    data2.attributes["x-out-of-boundaries"] = false;
  }
  return data2;
}
function inner(data2) {
  var placement2 = data2.placement;
  var basePlacement = placement2.split("-")[0];
  var _data$offsets = data2.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
  var isHoriz = ["left", "right"].indexOf(basePlacement) !== -1;
  var subtractLength = ["top", "left"].indexOf(basePlacement) === -1;
  popper[isHoriz ? "left" : "top"] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? "width" : "height"] : 0);
  data2.placement = getOppositePlacement(placement2);
  data2.offsets.popper = getClientRect(popper);
  return data2;
}
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },
  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },
  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ["left", "right", "top", "bottom"],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: "scrollParent"
  },
  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },
  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: "[x-arrow]"
  },
  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: "flip",
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: "viewport",
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },
  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },
  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },
  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: "bottom",
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: "right"
  },
  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: void 0
  }
};
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: "bottom",
  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,
  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,
  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,
  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {
  },
  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {
  },
  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers
};
var Popper = function() {
  function Popper2(reference, popper) {
    var _this = this;
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    classCallCheck(this, Popper2);
    this.scheduleUpdate = function() {
      return requestAnimationFrame(_this.update);
    };
    this.update = debounce(this.update.bind(this));
    this.options = _extends({}, Popper2.Defaults, options);
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper2.Defaults.modifiers, options.modifiers)).forEach(function(name) {
      _this.options.modifiers[name] = _extends({}, Popper2.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });
    this.modifiers = Object.keys(this.options.modifiers).map(function(name) {
      return _extends({
        name
      }, _this.options.modifiers[name]);
    }).sort(function(a, b) {
      return a.order - b.order;
    });
    this.modifiers.forEach(function(modifierOptions) {
      if (modifierOptions.enabled && isFunction$5(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });
    this.update();
    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      this.enableEventListeners();
    }
    this.state.eventsEnabled = eventsEnabled;
  }
  createClass(Popper2, [{
    key: "update",
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: "destroy",
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: "enableEventListeners",
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: "disableEventListeners",
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }
    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */
    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */
  }]);
  return Popper2;
}();
Popper.Utils = (typeof window !== "undefined" ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}
var _listCacheClear = listCacheClear$1;
function eq$5(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_1 = eq$5;
var eq$4 = eq_1;
function assocIndexOf$4(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$4(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var _assocIndexOf = assocIndexOf$4;
var assocIndexOf$3 = _assocIndexOf;
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete$1(key) {
  var data2 = this.__data__, index = assocIndexOf$3(data2, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data2.length - 1;
  if (index == lastIndex) {
    data2.pop();
  } else {
    splice.call(data2, index, 1);
  }
  --this.size;
  return true;
}
var _listCacheDelete = listCacheDelete$1;
var assocIndexOf$2 = _assocIndexOf;
function listCacheGet$1(key) {
  var data2 = this.__data__, index = assocIndexOf$2(data2, key);
  return index < 0 ? void 0 : data2[index][1];
}
var _listCacheGet = listCacheGet$1;
var assocIndexOf$1 = _assocIndexOf;
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}
var _listCacheHas = listCacheHas$1;
var assocIndexOf = _assocIndexOf;
function listCacheSet$1(key, value) {
  var data2 = this.__data__, index = assocIndexOf(data2, key);
  if (index < 0) {
    ++this.size;
    data2.push([key, value]);
  } else {
    data2[index][1] = value;
  }
  return this;
}
var _listCacheSet = listCacheSet$1;
var listCacheClear = _listCacheClear, listCacheDelete = _listCacheDelete, listCacheGet = _listCacheGet, listCacheHas = _listCacheHas, listCacheSet = _listCacheSet;
function ListCache$4(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache$4.prototype.clear = listCacheClear;
ListCache$4.prototype["delete"] = listCacheDelete;
ListCache$4.prototype.get = listCacheGet;
ListCache$4.prototype.has = listCacheHas;
ListCache$4.prototype.set = listCacheSet;
var _ListCache = ListCache$4;
var ListCache$3 = _ListCache;
function stackClear$1() {
  this.__data__ = new ListCache$3();
  this.size = 0;
}
var _stackClear = stackClear$1;
function stackDelete$1(key) {
  var data2 = this.__data__, result = data2["delete"](key);
  this.size = data2.size;
  return result;
}
var _stackDelete = stackDelete$1;
function stackGet$1(key) {
  return this.__data__.get(key);
}
var _stackGet = stackGet$1;
function stackHas$1(key) {
  return this.__data__.has(key);
}
var _stackHas = stackHas$1;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$8 = freeGlobal || freeSelf || Function("return this")();
var _root = root$8;
var root$7 = _root;
var Symbol$4 = root$7.Symbol;
var _Symbol = Symbol$4;
var Symbol$3 = _Symbol;
var objectProto$e = Object.prototype;
var hasOwnProperty$d = objectProto$e.hasOwnProperty;
var nativeObjectToString$1 = objectProto$e.toString;
var symToStringTag$1 = Symbol$3 ? Symbol$3.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$d.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;
var objectProto$d = Object.prototype;
var nativeObjectToString = objectProto$d.toString;
function objectToString$2(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$2;
var Symbol$2 = _Symbol, getRawTag = _getRawTag, objectToString$1 = _objectToString;
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag$5(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString$1(value);
}
var _baseGetTag = baseGetTag$5;
function isObject$8(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_1 = isObject$8;
var baseGetTag$4 = _baseGetTag, isObject$7 = isObject_1;
var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$4(value) {
  if (!isObject$7(value)) {
    return false;
  }
  var tag = baseGetTag$4(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_1 = isFunction$4;
var root$6 = _root;
var coreJsData$1 = root$6["__core-js_shared__"];
var _coreJsData = coreJsData$1;
var coreJsData = _coreJsData;
var maskSrcKey = function() {
  var uid2 = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid2 ? "Symbol(src)_1." + uid2 : "";
}();
function isMasked$1(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked = isMasked$1;
var funcProto$2 = Function.prototype;
var funcToString$2 = funcProto$2.toString;
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var _toSource = toSource$2;
var isFunction$3 = isFunction_1, isMasked = _isMasked, isObject$6 = isObject_1, toSource$1 = _toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype, objectProto$c = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$c = objectProto$c.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString$1.call(hasOwnProperty$c).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative$1(value) {
  if (!isObject$6(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$3(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource$1(value));
}
var _baseIsNative = baseIsNative$1;
function getValue$1(object, key) {
  return object == null ? void 0 : object[key];
}
var _getValue = getValue$1;
var baseIsNative = _baseIsNative, getValue = _getValue;
function getNative$7(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var _getNative = getNative$7;
var getNative$6 = _getNative, root$5 = _root;
var Map$4 = getNative$6(root$5, "Map");
var _Map = Map$4;
var getNative$5 = _getNative;
var nativeCreate$4 = getNative$5(Object, "create");
var _nativeCreate = nativeCreate$4;
var nativeCreate$3 = _nativeCreate;
function hashClear$1() {
  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
  this.size = 0;
}
var _hashClear = hashClear$1;
function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var _hashDelete = hashDelete$1;
var nativeCreate$2 = _nativeCreate;
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$b = Object.prototype;
var hasOwnProperty$b = objectProto$b.hasOwnProperty;
function hashGet$1(key) {
  var data2 = this.__data__;
  if (nativeCreate$2) {
    var result = data2[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$b.call(data2, key) ? data2[key] : void 0;
}
var _hashGet = hashGet$1;
var nativeCreate$1 = _nativeCreate;
var objectProto$a = Object.prototype;
var hasOwnProperty$a = objectProto$a.hasOwnProperty;
function hashHas$1(key) {
  var data2 = this.__data__;
  return nativeCreate$1 ? data2[key] !== void 0 : hasOwnProperty$a.call(data2, key);
}
var _hashHas = hashHas$1;
var nativeCreate = _nativeCreate;
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet$1(key, value) {
  var data2 = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data2[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
var _hashSet = hashSet$1;
var hashClear = _hashClear, hashDelete = _hashDelete, hashGet = _hashGet, hashHas = _hashHas, hashSet = _hashSet;
function Hash$1(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash$1.prototype.clear = hashClear;
Hash$1.prototype["delete"] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;
var _Hash = Hash$1;
var Hash = _Hash, ListCache$2 = _ListCache, Map$3 = _Map;
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$3 || ListCache$2)(),
    "string": new Hash()
  };
}
var _mapCacheClear = mapCacheClear$1;
function isKeyable$1(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var _isKeyable = isKeyable$1;
var isKeyable = _isKeyable;
function getMapData$4(map, key) {
  var data2 = map.__data__;
  return isKeyable(key) ? data2[typeof key == "string" ? "string" : "hash"] : data2.map;
}
var _getMapData = getMapData$4;
var getMapData$3 = _getMapData;
function mapCacheDelete$1(key) {
  var result = getMapData$3(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var _mapCacheDelete = mapCacheDelete$1;
var getMapData$2 = _getMapData;
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}
var _mapCacheGet = mapCacheGet$1;
var getMapData$1 = _getMapData;
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}
var _mapCacheHas = mapCacheHas$1;
var getMapData = _getMapData;
function mapCacheSet$1(key, value) {
  var data2 = getMapData(this, key), size2 = data2.size;
  data2.set(key, value);
  this.size += data2.size == size2 ? 0 : 1;
  return this;
}
var _mapCacheSet = mapCacheSet$1;
var mapCacheClear = _mapCacheClear, mapCacheDelete = _mapCacheDelete, mapCacheGet = _mapCacheGet, mapCacheHas = _mapCacheHas, mapCacheSet = _mapCacheSet;
function MapCache$2(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache$2.prototype.clear = mapCacheClear;
MapCache$2.prototype["delete"] = mapCacheDelete;
MapCache$2.prototype.get = mapCacheGet;
MapCache$2.prototype.has = mapCacheHas;
MapCache$2.prototype.set = mapCacheSet;
var _MapCache = MapCache$2;
var ListCache$1 = _ListCache, Map$2 = _Map, MapCache$1 = _MapCache;
var LARGE_ARRAY_SIZE = 200;
function stackSet$1(key, value) {
  var data2 = this.__data__;
  if (data2 instanceof ListCache$1) {
    var pairs = data2.__data__;
    if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data2.size;
      return this;
    }
    data2 = this.__data__ = new MapCache$1(pairs);
  }
  data2.set(key, value);
  this.size = data2.size;
  return this;
}
var _stackSet = stackSet$1;
var ListCache = _ListCache, stackClear = _stackClear, stackDelete = _stackDelete, stackGet = _stackGet, stackHas = _stackHas, stackSet = _stackSet;
function Stack$2(entries) {
  var data2 = this.__data__ = new ListCache(entries);
  this.size = data2.size;
}
Stack$2.prototype.clear = stackClear;
Stack$2.prototype["delete"] = stackDelete;
Stack$2.prototype.get = stackGet;
Stack$2.prototype.has = stackHas;
Stack$2.prototype.set = stackSet;
var _Stack = Stack$2;
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
var _setCacheAdd = setCacheAdd$1;
function setCacheHas$1(value) {
  return this.__data__.has(value);
}
var _setCacheHas = setCacheHas$1;
var MapCache = _MapCache, setCacheAdd = _setCacheAdd, setCacheHas = _setCacheHas;
function SetCache$1(values) {
  var index = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd;
SetCache$1.prototype.has = setCacheHas;
var _SetCache = SetCache$1;
function arraySome$1(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
var _arraySome = arraySome$1;
function cacheHas$1(cache, key) {
  return cache.has(key);
}
var _cacheHas = cacheHas$1;
var SetCache = _SetCache, arraySome = _arraySome, cacheHas = _cacheHas;
var COMPARE_PARTIAL_FLAG$3 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function equalArrays$2(array, other, bitmask, customizer, equalFunc, stack2) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack2.get(array);
  var othStacked = stack2.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0;
  stack2.set(array, other);
  stack2.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack2) : customizer(arrValue, othValue, index, array, other, stack2);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack2))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack2))) {
      result = false;
      break;
    }
  }
  stack2["delete"](array);
  stack2["delete"](other);
  return result;
}
var _equalArrays = equalArrays$2;
var root$4 = _root;
var Uint8Array$2 = root$4.Uint8Array;
var _Uint8Array = Uint8Array$2;
function mapToArray$1(map) {
  var index = -1, result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
var _mapToArray = mapToArray$1;
function setToArray$1(set2) {
  var index = -1, result = Array(set2.size);
  set2.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
var _setToArray = setToArray$1;
var Symbol$1 = _Symbol, Uint8Array$1 = _Uint8Array, eq$3 = eq_1, equalArrays$1 = _equalArrays, mapToArray = _mapToArray, setToArray = _setToArray;
var COMPARE_PARTIAL_FLAG$2 = 1, COMPARE_UNORDERED_FLAG = 2;
var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag = "[object Symbol]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]";
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack2) {
  switch (tag) {
    case dataViewTag$2:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag$1:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;
    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      return eq$3(+object, +other);
    case errorTag$1:
      return object.name == other.name && object.message == other.message;
    case regexpTag$1:
    case stringTag$1:
      return object == other + "";
    case mapTag$2:
      var convert = mapToArray;
    case setTag$2:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack2.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;
      stack2.set(object, other);
      var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack2);
      stack2["delete"](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
var _equalByTag = equalByTag$1;
function arrayPush$1(array, values) {
  var index = -1, length = values.length, offset2 = array.length;
  while (++index < length) {
    array[offset2 + index] = values[index];
  }
  return array;
}
var _arrayPush = arrayPush$1;
var isArray$5 = Array.isArray;
var isArray_1 = isArray$5;
var arrayPush = _arrayPush, isArray$4 = isArray_1;
function baseGetAllKeys$1(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$4(object) ? result : arrayPush(result, symbolsFunc(object));
}
var _baseGetAllKeys = baseGetAllKeys$1;
function arrayFilter$1(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var _arrayFilter = arrayFilter$1;
function stubArray$1() {
  return [];
}
var stubArray_1 = stubArray$1;
var arrayFilter = _arrayFilter, stubArray = stubArray_1;
var objectProto$9 = Object.prototype;
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols$1 = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};
var _getSymbols = getSymbols$1;
function baseTimes$1(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var _baseTimes = baseTimes$1;
function isObjectLike$6(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_1 = isObjectLike$6;
var baseGetTag$3 = _baseGetTag, isObjectLike$5 = isObjectLike_1;
var argsTag$2 = "[object Arguments]";
function baseIsArguments$1(value) {
  return isObjectLike$5(value) && baseGetTag$3(value) == argsTag$2;
}
var _baseIsArguments = baseIsArguments$1;
var baseIsArguments = _baseIsArguments, isObjectLike$4 = isObjectLike_1;
var objectProto$8 = Object.prototype;
var hasOwnProperty$9 = objectProto$8.hasOwnProperty;
var propertyIsEnumerable = objectProto$8.propertyIsEnumerable;
var isArguments$2 = baseIsArguments(/* @__PURE__ */ function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike$4(value) && hasOwnProperty$9.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_1 = isArguments$2;
var isBuffer$3 = { exports: {} };
function stubFalse() {
  return false;
}
var stubFalse_1 = stubFalse;
isBuffer$3.exports;
(function(module, exports) {
  var root2 = _root, stubFalse2 = stubFalse_1;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root2.Buffer : void 0;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
  var isBuffer2 = nativeIsBuffer || stubFalse2;
  module.exports = isBuffer2;
})(isBuffer$3, isBuffer$3.exports);
var isBufferExports = isBuffer$3.exports;
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex$2(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var _isIndex = isIndex$2;
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength$2(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
var isLength_1 = isLength$2;
var baseGetTag$2 = _baseGetTag, isLength$1 = isLength_1, isObjectLike$3 = isObjectLike_1;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag$1 = "[object Map]", numberTag = "[object Number]", objectTag$3 = "[object Object]", regexpTag = "[object RegExp]", setTag$1 = "[object Set]", stringTag = "[object String]", weakMapTag$1 = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag] = typedArrayTags[setTag$1] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag$1] = false;
function baseIsTypedArray$1(value) {
  return isObjectLike$3(value) && isLength$1(value.length) && !!typedArrayTags[baseGetTag$2(value)];
}
var _baseIsTypedArray = baseIsTypedArray$1;
function baseUnary$1(func) {
  return function(value) {
    return func(value);
  };
}
var _baseUnary = baseUnary$1;
var _nodeUtil = { exports: {} };
_nodeUtil.exports;
(function(module, exports) {
  var freeGlobal2 = _freeGlobal;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil2 = function() {
    try {
      var types = freeModule && freeModule.require && freeModule.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  module.exports = nodeUtil2;
})(_nodeUtil, _nodeUtil.exports);
var _nodeUtilExports = _nodeUtil.exports;
var baseIsTypedArray = _baseIsTypedArray, baseUnary = _baseUnary, nodeUtil = _nodeUtilExports;
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray$3 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray_1 = isTypedArray$3;
var baseTimes = _baseTimes, isArguments$1 = isArguments_1, isArray$3 = isArray_1, isBuffer$2 = isBufferExports, isIndex$1 = _isIndex, isTypedArray$2 = isTypedArray_1;
var objectProto$7 = Object.prototype;
var hasOwnProperty$8 = objectProto$7.hasOwnProperty;
function arrayLikeKeys$2(value, inherited) {
  var isArr = isArray$3(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$2(value), isType = !isArr && !isArg && !isBuff && isTypedArray$2(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$8.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex$1(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var _arrayLikeKeys = arrayLikeKeys$2;
var objectProto$6 = Object.prototype;
function isPrototype$3(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$6;
  return value === proto;
}
var _isPrototype = isPrototype$3;
function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var _overArg = overArg$2;
var overArg$1 = _overArg;
var nativeKeys$1 = overArg$1(Object.keys, Object);
var _nativeKeys = nativeKeys$1;
var isPrototype$2 = _isPrototype, nativeKeys = _nativeKeys;
var objectProto$5 = Object.prototype;
var hasOwnProperty$7 = objectProto$5.hasOwnProperty;
function baseKeys$1(object) {
  if (!isPrototype$2(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var _baseKeys = baseKeys$1;
var isFunction$2 = isFunction_1, isLength = isLength_1;
function isArrayLike$4(value) {
  return value != null && isLength(value.length) && !isFunction$2(value);
}
var isArrayLike_1 = isArrayLike$4;
var arrayLikeKeys$1 = _arrayLikeKeys, baseKeys = _baseKeys, isArrayLike$3 = isArrayLike_1;
function keys$1(object) {
  return isArrayLike$3(object) ? arrayLikeKeys$1(object) : baseKeys(object);
}
var keys_1 = keys$1;
var baseGetAllKeys = _baseGetAllKeys, getSymbols = _getSymbols, keys = keys_1;
function getAllKeys$1(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}
var _getAllKeys = getAllKeys$1;
var getAllKeys = _getAllKeys;
var COMPARE_PARTIAL_FLAG$1 = 1;
var objectProto$4 = Object.prototype;
var hasOwnProperty$6 = objectProto$4.hasOwnProperty;
function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack2) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$6.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack2.get(object);
  var othStacked = stack2.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack2.set(object, other);
  stack2.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack2) : customizer(objValue, othValue, key, object, other, stack2);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack2) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack2["delete"](object);
  stack2["delete"](other);
  return result;
}
var _equalObjects = equalObjects$1;
var getNative$4 = _getNative, root$3 = _root;
var DataView$1 = getNative$4(root$3, "DataView");
var _DataView = DataView$1;
var getNative$3 = _getNative, root$2 = _root;
var Promise$2 = getNative$3(root$2, "Promise");
var _Promise = Promise$2;
var getNative$2 = _getNative, root$1 = _root;
var Set$2 = getNative$2(root$1, "Set");
var _Set = Set$2;
var getNative$1 = _getNative, root = _root;
var WeakMap$2 = getNative$1(root, "WeakMap");
var _WeakMap = WeakMap$2;
var DataView = _DataView, Map$1 = _Map, Promise$1 = _Promise, Set$1 = _Set, WeakMap$1 = _WeakMap, baseGetTag$1 = _baseGetTag, toSource = _toSource;
var mapTag = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
var dataViewTag = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
var getTag$1 = baseGetTag$1;
if (DataView && getTag$1(new DataView(new ArrayBuffer(1))) != dataViewTag || Map$1 && getTag$1(new Map$1()) != mapTag || Promise$1 && getTag$1(Promise$1.resolve()) != promiseTag || Set$1 && getTag$1(new Set$1()) != setTag || WeakMap$1 && getTag$1(new WeakMap$1()) != weakMapTag) {
  getTag$1 = function(value) {
    var result = baseGetTag$1(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}
var _getTag = getTag$1;
var Stack$1 = _Stack, equalArrays = _equalArrays, equalByTag = _equalByTag, equalObjects = _equalObjects, getTag = _getTag, isArray$2 = isArray_1, isBuffer$1 = isBufferExports, isTypedArray$1 = isTypedArray_1;
var COMPARE_PARTIAL_FLAG = 1;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag$1 = "[object Object]";
var objectProto$3 = Object.prototype;
var hasOwnProperty$5 = objectProto$3.hasOwnProperty;
function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack2) {
  var objIsArr = isArray$2(object), othIsArr = isArray$2(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
  objTag = objTag == argsTag ? objectTag$1 : objTag;
  othTag = othTag == argsTag ? objectTag$1 : othTag;
  var objIsObj = objTag == objectTag$1, othIsObj = othTag == objectTag$1, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer$1(object)) {
    if (!isBuffer$1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack2 || (stack2 = new Stack$1());
    return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack2) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack2);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty$5.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$5.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack2 || (stack2 = new Stack$1());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack2);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack2 || (stack2 = new Stack$1());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack2);
}
var _baseIsEqualDeep = baseIsEqualDeep$1;
var baseIsEqualDeep = _baseIsEqualDeep, isObjectLike$2 = isObjectLike_1;
function baseIsEqual$1(value, other, bitmask, customizer, stack2) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike$2(value) && !isObjectLike$2(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$1, stack2);
}
var _baseIsEqual = baseIsEqual$1;
var baseIsEqual = _baseIsEqual;
function isEqual(value, other) {
  return baseIsEqual(value, other);
}
var isEqual_1 = isEqual;
const isEqual$1 = /* @__PURE__ */ getDefaultExportFromCjs(isEqual_1);
function getInternetExplorerVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }
  var trident = ua.indexOf("Trident/");
  if (trident > 0) {
    var rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }
  var edge = ua.indexOf("Edge/");
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }
  return -1;
}
var isIE;
function initCompat() {
  if (!initCompat.init) {
    initCompat.init = true;
    isIE = getInternetExplorerVersion() !== -1;
  }
}
var script$1 = {
  name: "ResizeObserver",
  props: {
    emitOnMount: {
      type: Boolean,
      default: false
    },
    ignoreWidth: {
      type: Boolean,
      default: false
    },
    ignoreHeight: {
      type: Boolean,
      default: false
    }
  },
  mounted: function mounted() {
    var _this = this;
    initCompat();
    this.$nextTick(function() {
      _this._w = _this.$el.offsetWidth;
      _this._h = _this.$el.offsetHeight;
      if (_this.emitOnMount) {
        _this.emitSize();
      }
    });
    var object = document.createElement("object");
    this._resizeObject = object;
    object.setAttribute("aria-hidden", "true");
    object.setAttribute("tabindex", -1);
    object.onload = this.addResizeHandlers;
    object.type = "text/html";
    if (isIE) {
      this.$el.appendChild(object);
    }
    object.data = "about:blank";
    if (!isIE) {
      this.$el.appendChild(object);
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.removeResizeHandlers();
  },
  methods: {
    compareAndNotify: function compareAndNotify() {
      if (!this.ignoreWidth && this._w !== this.$el.offsetWidth || !this.ignoreHeight && this._h !== this.$el.offsetHeight) {
        this._w = this.$el.offsetWidth;
        this._h = this.$el.offsetHeight;
        this.emitSize();
      }
    },
    emitSize: function emitSize() {
      this.$emit("notify", {
        width: this._w,
        height: this._h
      });
    },
    addResizeHandlers: function addResizeHandlers() {
      this._resizeObject.contentDocument.defaultView.addEventListener("resize", this.compareAndNotify);
      this.compareAndNotify();
    },
    removeResizeHandlers: function removeResizeHandlers() {
      if (this._resizeObject && this._resizeObject.onload) {
        if (!isIE && this._resizeObject.contentDocument) {
          this._resizeObject.contentDocument.defaultView.removeEventListener("resize", this.compareAndNotify);
        }
        this.$el.removeChild(this._resizeObject);
        this._resizeObject.onload = null;
        this._resizeObject = null;
      }
    }
  }
};
function normalizeComponent$1(template, style, script2, scopeId, isFunctionalTemplate, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  var options = typeof script2 === "function" ? script2.options : script2;
  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true;
  }
  {
    options._scopeId = scopeId;
  }
  return script2;
}
var __vue_script__$1 = script$1;
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "resize-observer",
    attrs: {
      tabindex: "-1"
    }
  });
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;
var __vue_inject_styles__$1 = void 0;
var __vue_scope_id__ = "data-v-8859cc6c";
var __vue_component__$1 = /* @__PURE__ */ normalizeComponent$1({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__);
function install$1(Vue) {
  Vue.component("resize-observer", __vue_component__$1);
  Vue.component("ResizeObserver", __vue_component__$1);
}
var plugin$1 = {
  // eslint-disable-next-line no-undef
  version: "1.0.1",
  install: install$1
};
var GlobalVue$1 = null;
if (typeof window !== "undefined") {
  GlobalVue$1 = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue$1 = global.Vue;
}
if (GlobalVue$1) {
  GlobalVue$1.use(plugin$1);
}
var getNative = _getNative;
var defineProperty$2 = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var _defineProperty = defineProperty$2;
var defineProperty$1 = _defineProperty;
function baseAssignValue$3(object, key, value) {
  if (key == "__proto__" && defineProperty$1) {
    defineProperty$1(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var _baseAssignValue = baseAssignValue$3;
var baseAssignValue$2 = _baseAssignValue, eq$2 = eq_1;
function assignMergeValue$2(object, key, value) {
  if (value !== void 0 && !eq$2(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue$2(object, key, value);
  }
}
var _assignMergeValue = assignMergeValue$2;
function createBaseFor$1(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var _createBaseFor = createBaseFor$1;
var createBaseFor = _createBaseFor;
var baseFor$1 = createBaseFor();
var _baseFor = baseFor$1;
var _cloneBuffer = { exports: {} };
_cloneBuffer.exports;
(function(module, exports) {
  var root2 = _root;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root2.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
  function cloneBuffer2(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  module.exports = cloneBuffer2;
})(_cloneBuffer, _cloneBuffer.exports);
var _cloneBufferExports = _cloneBuffer.exports;
var Uint8Array2 = _Uint8Array;
function cloneArrayBuffer$1(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
  return result;
}
var _cloneArrayBuffer = cloneArrayBuffer$1;
var cloneArrayBuffer = _cloneArrayBuffer;
function cloneTypedArray$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var _cloneTypedArray = cloneTypedArray$1;
function copyArray$1(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
var _copyArray = copyArray$1;
var isObject$5 = isObject_1;
var objectCreate = Object.create;
var baseCreate$1 = /* @__PURE__ */ function() {
  function object() {
  }
  return function(proto) {
    if (!isObject$5(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var _baseCreate = baseCreate$1;
var overArg = _overArg;
var getPrototype$2 = overArg(Object.getPrototypeOf, Object);
var _getPrototype = getPrototype$2;
var baseCreate = _baseCreate, getPrototype$1 = _getPrototype, isPrototype$1 = _isPrototype;
function initCloneObject$1(object) {
  return typeof object.constructor == "function" && !isPrototype$1(object) ? baseCreate(getPrototype$1(object)) : {};
}
var _initCloneObject = initCloneObject$1;
var isArrayLike$2 = isArrayLike_1, isObjectLike$1 = isObjectLike_1;
function isArrayLikeObject$1(value) {
  return isObjectLike$1(value) && isArrayLike$2(value);
}
var isArrayLikeObject_1 = isArrayLikeObject$1;
var baseGetTag = _baseGetTag, getPrototype = _getPrototype, isObjectLike = isObjectLike_1;
var objectTag = "[object Object]";
var funcProto = Function.prototype, objectProto$2 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$4 = objectProto$2.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject$2(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$4.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
var isPlainObject_1 = isPlainObject$2;
function safeGet$2(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
var _safeGet = safeGet$2;
var baseAssignValue$1 = _baseAssignValue, eq$1 = eq_1;
var objectProto$1 = Object.prototype;
var hasOwnProperty$3 = objectProto$1.hasOwnProperty;
function assignValue$1(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$3.call(object, key) && eq$1(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue$1(object, key, value);
  }
}
var _assignValue = assignValue$1;
var assignValue = _assignValue, baseAssignValue = _baseAssignValue;
function copyObject$1(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}
var _copyObject = copyObject$1;
function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var _nativeKeysIn = nativeKeysIn$1;
var isObject$4 = isObject_1, isPrototype = _isPrototype, nativeKeysIn = _nativeKeysIn;
var objectProto = Object.prototype;
var hasOwnProperty$2 = objectProto.hasOwnProperty;
function baseKeysIn$1(object) {
  if (!isObject$4(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$2.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var _baseKeysIn = baseKeysIn$1;
var arrayLikeKeys = _arrayLikeKeys, baseKeysIn = _baseKeysIn, isArrayLike$1 = isArrayLike_1;
function keysIn$2(object) {
  return isArrayLike$1(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
var keysIn_1 = keysIn$2;
var copyObject = _copyObject, keysIn$1 = keysIn_1;
function toPlainObject$1(value) {
  return copyObject(value, keysIn$1(value));
}
var toPlainObject_1 = toPlainObject$1;
var assignMergeValue$1 = _assignMergeValue, cloneBuffer = _cloneBufferExports, cloneTypedArray = _cloneTypedArray, copyArray = _copyArray, initCloneObject = _initCloneObject, isArguments = isArguments_1, isArray$1 = isArray_1, isArrayLikeObject = isArrayLikeObject_1, isBuffer = isBufferExports, isFunction$1 = isFunction_1, isObject$3 = isObject_1, isPlainObject$1 = isPlainObject_1, isTypedArray = isTypedArray_1, safeGet$1 = _safeGet, toPlainObject = toPlainObject_1;
function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack2) {
  var objValue = safeGet$1(object, key), srcValue = safeGet$1(source, key), stacked = stack2.get(srcValue);
  if (stacked) {
    assignMergeValue$1(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack2) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray$1(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray$1(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject$1(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject$3(objValue) || isFunction$1(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack2.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack2);
    stack2["delete"](srcValue);
  }
  assignMergeValue$1(object, key, newValue);
}
var _baseMergeDeep = baseMergeDeep$1;
var Stack = _Stack, assignMergeValue = _assignMergeValue, baseFor = _baseFor, baseMergeDeep = _baseMergeDeep, isObject$2 = isObject_1, keysIn = keysIn_1, safeGet = _safeGet;
function baseMerge$1(object, source, srcIndex, customizer, stack2) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack2 || (stack2 = new Stack());
    if (isObject$2(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge$1, customizer, stack2);
    } else {
      var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack2) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}
var _baseMerge = baseMerge$1;
function identity$2(value) {
  return value;
}
var identity_1 = identity$2;
function apply$1(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var _apply = apply$1;
var apply = _apply;
var nativeMax = Math.max;
function overRest$1(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}
var _overRest = overRest$1;
function constant$1(value) {
  return function() {
    return value;
  };
}
var constant_1 = constant$1;
var constant = constant_1, defineProperty = _defineProperty, identity$1 = identity_1;
var baseSetToString$1 = !defineProperty ? identity$1 : function(func, string) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
var _baseSetToString = baseSetToString$1;
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut$1(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var _shortOut = shortOut$1;
var baseSetToString = _baseSetToString, shortOut = _shortOut;
var setToString$1 = shortOut(baseSetToString);
var _setToString = setToString$1;
var identity = identity_1, overRest = _overRest, setToString = _setToString;
function baseRest$1(func, start) {
  return setToString(overRest(func, start, identity), func + "");
}
var _baseRest = baseRest$1;
var eq = eq_1, isArrayLike = isArrayLike_1, isIndex = _isIndex, isObject$1 = isObject_1;
function isIterateeCall$1(value, index, object) {
  if (!isObject$1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
    return eq(object[index], value);
  }
  return false;
}
var _isIterateeCall = isIterateeCall$1;
var baseRest = _baseRest, isIterateeCall = _isIterateeCall;
function createAssigner$1(assigner) {
  return baseRest(function(object, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
var _createAssigner = createAssigner$1;
var baseMerge = _baseMerge, createAssigner = _createAssigner;
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});
var merge_1 = merge;
const merge$1 = /* @__PURE__ */ getDefaultExportFromCjs(merge_1);
var SVGAnimatedString = function SVGAnimatedString2() {
};
if (typeof window !== "undefined") {
  SVGAnimatedString = window.SVGAnimatedString;
}
function convertToArray(value) {
  if (typeof value === "string") {
    value = value.split(" ");
  }
  return value;
}
function addClasses(el, classes) {
  var newClasses = convertToArray(classes);
  var classList;
  if (el.className instanceof SVGAnimatedString) {
    classList = convertToArray(el.className.baseVal);
  } else {
    classList = convertToArray(el.className);
  }
  newClasses.forEach(function(newClass) {
    if (classList.indexOf(newClass) === -1) {
      classList.push(newClass);
    }
  });
  if (el instanceof SVGElement) {
    el.setAttribute("class", classList.join(" "));
  } else {
    el.className = classList.join(" ");
  }
}
function removeClasses(el, classes) {
  var newClasses = convertToArray(classes);
  var classList;
  if (el.className instanceof SVGAnimatedString) {
    classList = convertToArray(el.className.baseVal);
  } else {
    classList = convertToArray(el.className);
  }
  newClasses.forEach(function(newClass) {
    var index = classList.indexOf(newClass);
    if (index !== -1) {
      classList.splice(index, 1);
    }
  });
  if (el instanceof SVGElement) {
    el.setAttribute("class", classList.join(" "));
  } else {
    el.className = classList.join(" ");
  }
}
var supportsPassive = false;
if (typeof window !== "undefined") {
  supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function get2() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
}
function ownKeys$2(object, enumerableOnly) {
  var keys2 = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys2.push.apply(keys2, symbols);
  }
  return keys2;
}
function _objectSpread$2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys$2(Object(source), true).forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$2(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
var DEFAULT_OPTIONS = {
  container: false,
  delay: 0,
  html: false,
  placement: "top",
  title: "",
  template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  trigger: "hover focus",
  offset: 0
};
var openTooltips = [];
var Tooltip = /* @__PURE__ */ function() {
  function Tooltip2(_reference, _options) {
    var _this = this;
    _classCallCheck(this, Tooltip2);
    _defineProperty$1(this, "_events", []);
    _defineProperty$1(this, "_setTooltipNodeEvent", function(evt, reference, delay, options) {
      var relatedreference = evt.relatedreference || evt.toElement || evt.relatedTarget;
      var callback = function callback2(evt2) {
        var relatedreference2 = evt2.relatedreference || evt2.toElement || evt2.relatedTarget;
        _this._tooltipNode.removeEventListener(evt.type, callback2);
        if (!reference.contains(relatedreference2)) {
          _this._scheduleHide(reference, options.delay, options, evt2);
        }
      };
      if (_this._tooltipNode.contains(relatedreference)) {
        _this._tooltipNode.addEventListener(evt.type, callback);
        return true;
      }
      return false;
    });
    _options = _objectSpread$2(_objectSpread$2({}, DEFAULT_OPTIONS), _options);
    _reference.jquery && (_reference = _reference[0]);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.reference = _reference;
    this.options = _options;
    this._isOpen = false;
    this._init();
  }
  _createClass(Tooltip2, [{
    key: "show",
    value: function show2() {
      this._show(this.reference, this.options);
    }
    /**
     * Hides an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @method Tooltip#hide
     * @memberof Tooltip
     */
  }, {
    key: "hide",
    value: function hide3() {
      this._hide();
    }
    /**
     * Hides and destroys an element’s tooltip.
     * @method Tooltip#dispose
     * @memberof Tooltip
     */
  }, {
    key: "dispose",
    value: function dispose2() {
      this._dispose();
    }
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @method Tooltip#toggle
     * @memberof Tooltip
     */
  }, {
    key: "toggle",
    value: function toggle() {
      if (this._isOpen) {
        return this.hide();
      } else {
        return this.show();
      }
    }
  }, {
    key: "setClasses",
    value: function setClasses(classes) {
      this._classes = classes;
    }
  }, {
    key: "setContent",
    value: function setContent(content) {
      this.options.title = content;
      if (this._tooltipNode) {
        this._setContent(content, this.options);
      }
    }
  }, {
    key: "setOptions",
    value: function setOptions(options) {
      var classesUpdated = false;
      var classes = options && options.classes || directive.options.defaultClass;
      if (!isEqual$1(this._classes, classes)) {
        this.setClasses(classes);
        classesUpdated = true;
      }
      options = getOptions(options);
      var needPopperUpdate = false;
      var needRestart = false;
      if (this.options.offset !== options.offset || this.options.placement !== options.placement) {
        needPopperUpdate = true;
      }
      if (this.options.template !== options.template || this.options.trigger !== options.trigger || this.options.container !== options.container || classesUpdated) {
        needRestart = true;
      }
      for (var key in options) {
        this.options[key] = options[key];
      }
      if (this._tooltipNode) {
        if (needRestart) {
          var isOpen = this._isOpen;
          this.dispose();
          this._init();
          if (isOpen) {
            this.show();
          }
        } else if (needPopperUpdate) {
          this.popperInstance.update();
        }
      }
    }
    //
    // Private methods
    //
  }, {
    key: "_init",
    value: function _init() {
      var events = typeof this.options.trigger === "string" ? this.options.trigger.split(" ") : [];
      this._isDisposed = false;
      this._enableDocumentTouch = events.indexOf("manual") === -1;
      events = events.filter(function(trigger3) {
        return ["click", "hover", "focus"].indexOf(trigger3) !== -1;
      });
      this._setEventListeners(this.reference, events, this.options);
      this.$_originalTitle = this.reference.getAttribute("title");
      this.reference.removeAttribute("title");
      this.reference.setAttribute("data-original-title", this.$_originalTitle);
    }
    /**
     * Creates a new tooltip node
     * @memberof Tooltip
     * @private
     * @param {HTMLElement} reference
     * @param {String} template
     * @param {String|HTMLElement|TitleFunction} title
     * @param {Boolean} allowHtml
     * @return {HTMLelement} tooltipNode
     */
  }, {
    key: "_create",
    value: function _create(reference, template) {
      var _this2 = this;
      var tooltipGenerator = window.document.createElement("div");
      tooltipGenerator.innerHTML = template.trim();
      var tooltipNode = tooltipGenerator.childNodes[0];
      tooltipNode.id = this.options.ariaId || "tooltip_".concat(Math.random().toString(36).substr(2, 10));
      tooltipNode.setAttribute("aria-hidden", "true");
      if (this.options.autoHide && this.options.trigger.indexOf("hover") !== -1) {
        tooltipNode.addEventListener("mouseenter", function(evt) {
          return _this2._scheduleHide(reference, _this2.options.delay, _this2.options, evt);
        });
        tooltipNode.addEventListener("click", function(evt) {
          return _this2._scheduleHide(reference, _this2.options.delay, _this2.options, evt);
        });
      }
      return tooltipNode;
    }
  }, {
    key: "_setContent",
    value: function _setContent(content, options) {
      var _this3 = this;
      this.asyncContent = false;
      this._applyContent(content, options).then(function() {
        if (!_this3.popperInstance)
          return;
        _this3.popperInstance.update();
      });
    }
  }, {
    key: "_applyContent",
    value: function _applyContent(title, options) {
      var _this4 = this;
      return new Promise(function(resolve2, reject) {
        var allowHtml = options.html;
        var rootNode = _this4._tooltipNode;
        if (!rootNode)
          return;
        var titleNode = rootNode.querySelector(_this4.options.innerSelector);
        if (title.nodeType === 1) {
          if (allowHtml) {
            while (titleNode.firstChild) {
              titleNode.removeChild(titleNode.firstChild);
            }
            titleNode.appendChild(title);
          }
        } else if (typeof title === "function") {
          var result = title();
          if (result && typeof result.then === "function") {
            _this4.asyncContent = true;
            options.loadingClass && addClasses(rootNode, options.loadingClass);
            if (options.loadingContent) {
              _this4._applyContent(options.loadingContent, options);
            }
            result.then(function(asyncResult) {
              options.loadingClass && removeClasses(rootNode, options.loadingClass);
              return _this4._applyContent(asyncResult, options);
            }).then(resolve2).catch(reject);
          } else {
            _this4._applyContent(result, options).then(resolve2).catch(reject);
          }
          return;
        } else {
          allowHtml ? titleNode.innerHTML = title : titleNode.innerText = title;
        }
        resolve2();
      });
    }
  }, {
    key: "_show",
    value: function _show(reference, options) {
      if (options && typeof options.container === "string") {
        var container2 = document.querySelector(options.container);
        if (!container2)
          return;
      }
      clearTimeout(this._disposeTimer);
      options = Object.assign({}, options);
      delete options.offset;
      var updateClasses = true;
      if (this._tooltipNode) {
        addClasses(this._tooltipNode, this._classes);
        updateClasses = false;
      }
      var result = this._ensureShown(reference, options);
      if (updateClasses && this._tooltipNode) {
        addClasses(this._tooltipNode, this._classes);
      }
      addClasses(reference, ["v-tooltip-open"]);
      return result;
    }
  }, {
    key: "_ensureShown",
    value: function _ensureShown(reference, options) {
      var _this5 = this;
      if (this._isOpen) {
        return this;
      }
      this._isOpen = true;
      openTooltips.push(this);
      if (this._tooltipNode) {
        this._tooltipNode.style.display = "";
        this._tooltipNode.setAttribute("aria-hidden", "false");
        this.popperInstance.enableEventListeners();
        this.popperInstance.update();
        if (this.asyncContent) {
          this._setContent(options.title, options);
        }
        return this;
      }
      var title = reference.getAttribute("title") || options.title;
      if (!title) {
        return this;
      }
      var tooltipNode = this._create(reference, options.template);
      this._tooltipNode = tooltipNode;
      reference.setAttribute("aria-describedby", tooltipNode.id);
      var container2 = this._findContainer(options.container, reference);
      this._append(tooltipNode, container2);
      var popperOptions = _objectSpread$2(_objectSpread$2({}, options.popperOptions), {}, {
        placement: options.placement
      });
      popperOptions.modifiers = _objectSpread$2(_objectSpread$2({}, popperOptions.modifiers), {}, {
        arrow: {
          element: this.options.arrowSelector
        }
      });
      if (options.boundariesElement) {
        popperOptions.modifiers.preventOverflow = {
          boundariesElement: options.boundariesElement
        };
      }
      this.popperInstance = new Popper(reference, tooltipNode, popperOptions);
      this._setContent(title, options);
      requestAnimationFrame(function() {
        if (!_this5._isDisposed && _this5.popperInstance) {
          _this5.popperInstance.update();
          requestAnimationFrame(function() {
            if (!_this5._isDisposed) {
              _this5._isOpen && tooltipNode.setAttribute("aria-hidden", "false");
            } else {
              _this5.dispose();
            }
          });
        } else {
          _this5.dispose();
        }
      });
      return this;
    }
  }, {
    key: "_noLongerOpen",
    value: function _noLongerOpen() {
      var index = openTooltips.indexOf(this);
      if (index !== -1) {
        openTooltips.splice(index, 1);
      }
    }
  }, {
    key: "_hide",
    value: function _hide() {
      var _this6 = this;
      if (!this._isOpen) {
        return this;
      }
      this._isOpen = false;
      this._noLongerOpen();
      this._tooltipNode.style.display = "none";
      this._tooltipNode.setAttribute("aria-hidden", "true");
      if (this.popperInstance) {
        this.popperInstance.disableEventListeners();
      }
      clearTimeout(this._disposeTimer);
      var disposeTime = directive.options.disposeTimeout;
      if (disposeTime !== null) {
        this._disposeTimer = setTimeout(function() {
          if (_this6._tooltipNode) {
            _this6._tooltipNode.removeEventListener("mouseenter", _this6.hide);
            _this6._tooltipNode.removeEventListener("click", _this6.hide);
            _this6._removeTooltipNode();
          }
        }, disposeTime);
      }
      removeClasses(this.reference, ["v-tooltip-open"]);
      return this;
    }
  }, {
    key: "_removeTooltipNode",
    value: function _removeTooltipNode() {
      if (!this._tooltipNode)
        return;
      var parentNode = this._tooltipNode.parentNode;
      if (parentNode) {
        parentNode.removeChild(this._tooltipNode);
        this.reference.removeAttribute("aria-describedby");
      }
      this._tooltipNode = null;
    }
  }, {
    key: "_dispose",
    value: function _dispose() {
      var _this7 = this;
      this._isDisposed = true;
      this.reference.removeAttribute("data-original-title");
      if (this.$_originalTitle) {
        this.reference.setAttribute("title", this.$_originalTitle);
      }
      this._events.forEach(function(_ref) {
        var func = _ref.func, event = _ref.event;
        _this7.reference.removeEventListener(event, func);
      });
      this._events = [];
      if (this._tooltipNode) {
        this._hide();
        this._tooltipNode.removeEventListener("mouseenter", this.hide);
        this._tooltipNode.removeEventListener("click", this.hide);
        this.popperInstance.destroy();
        if (!this.popperInstance.options.removeOnDestroy) {
          this._removeTooltipNode();
        }
      } else {
        this._noLongerOpen();
      }
      return this;
    }
  }, {
    key: "_findContainer",
    value: function _findContainer(container2, reference) {
      if (typeof container2 === "string") {
        container2 = window.document.querySelector(container2);
      } else if (container2 === false) {
        container2 = reference.parentNode;
      }
      return container2;
    }
    /**
     * Append tooltip to container
     * @memberof Tooltip
     * @private
     * @param {HTMLElement} tooltip
     * @param {HTMLElement|String|false} container
     */
  }, {
    key: "_append",
    value: function _append(tooltipNode, container2) {
      container2.appendChild(tooltipNode);
    }
  }, {
    key: "_setEventListeners",
    value: function _setEventListeners(reference, events, options) {
      var _this8 = this;
      var directEvents = [];
      var oppositeEvents = [];
      events.forEach(function(event) {
        switch (event) {
          case "hover":
            directEvents.push("mouseenter");
            oppositeEvents.push("mouseleave");
            if (_this8.options.hideOnTargetClick)
              oppositeEvents.push("click");
            break;
          case "focus":
            directEvents.push("focus");
            oppositeEvents.push("blur");
            if (_this8.options.hideOnTargetClick)
              oppositeEvents.push("click");
            break;
          case "click":
            directEvents.push("click");
            oppositeEvents.push("click");
            break;
        }
      });
      directEvents.forEach(function(event) {
        var func = function func2(evt) {
          if (_this8._isOpen === true) {
            return;
          }
          evt.usedByTooltip = true;
          _this8._scheduleShow(reference, options.delay, options, evt);
        };
        _this8._events.push({
          event,
          func
        });
        reference.addEventListener(event, func);
      });
      oppositeEvents.forEach(function(event) {
        var func = function func2(evt) {
          if (evt.usedByTooltip === true) {
            return;
          }
          _this8._scheduleHide(reference, options.delay, options, evt);
        };
        _this8._events.push({
          event,
          func
        });
        reference.addEventListener(event, func);
      });
    }
  }, {
    key: "_onDocumentTouch",
    value: function _onDocumentTouch(event) {
      if (this._enableDocumentTouch) {
        this._scheduleHide(this.reference, this.options.delay, this.options, event);
      }
    }
  }, {
    key: "_scheduleShow",
    value: function _scheduleShow(reference, delay, options) {
      var _this9 = this;
      var computedDelay = delay && delay.show || delay || 0;
      clearTimeout(this._scheduleTimer);
      this._scheduleTimer = window.setTimeout(function() {
        return _this9._show(reference, options);
      }, computedDelay);
    }
  }, {
    key: "_scheduleHide",
    value: function _scheduleHide(reference, delay, options, evt) {
      var _this10 = this;
      var computedDelay = delay && delay.hide || delay || 0;
      clearTimeout(this._scheduleTimer);
      this._scheduleTimer = window.setTimeout(function() {
        if (_this10._isOpen === false) {
          return;
        }
        if (!_this10._tooltipNode.ownerDocument.body.contains(_this10._tooltipNode)) {
          return;
        }
        if (evt.type === "mouseleave") {
          var isSet2 = _this10._setTooltipNodeEvent(evt, reference, delay, options);
          if (isSet2) {
            return;
          }
        }
        _this10._hide(reference, options);
      }, computedDelay);
    }
  }]);
  return Tooltip2;
}();
if (typeof document !== "undefined") {
  document.addEventListener("touchstart", function(event) {
    for (var i = 0; i < openTooltips.length; i++) {
      openTooltips[i]._onDocumentTouch(event);
    }
  }, supportsPassive ? {
    passive: true,
    capture: true
  } : true);
}
function ownKeys$1(object, enumerableOnly) {
  var keys2 = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys2.push.apply(keys2, symbols);
  }
  return keys2;
}
function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys$1(Object(source), true).forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
var state = {
  enabled: true
};
var positions = ["top", "top-start", "top-end", "right", "right-start", "right-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end"];
var defaultOptions = {
  // Default tooltip placement relative to target element
  defaultPlacement: "top",
  // Default CSS classes applied to the tooltip element
  defaultClass: "vue-tooltip-theme",
  // Default CSS classes applied to the target element of the tooltip
  defaultTargetClass: "has-tooltip",
  // Is the content HTML by default?
  defaultHtml: true,
  // Default HTML template of the tooltip element
  // It must include `tooltip-arrow` & `tooltip-inner` CSS classes (can be configured, see below)
  // Change if the classes conflict with other libraries (for example bootstrap)
  defaultTemplate: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  // Selector used to get the arrow element in the tooltip template
  defaultArrowSelector: ".tooltip-arrow, .tooltip__arrow",
  // Selector used to get the inner content element in the tooltip template
  defaultInnerSelector: ".tooltip-inner, .tooltip__inner",
  // Delay (ms)
  defaultDelay: 0,
  // Default events that trigger the tooltip
  defaultTrigger: "hover focus",
  // Default position offset (px)
  defaultOffset: 0,
  // Default container where the tooltip will be appended
  defaultContainer: "body",
  defaultBoundariesElement: void 0,
  defaultPopperOptions: {},
  // Class added when content is loading
  defaultLoadingClass: "tooltip-loading",
  // Displayed when tooltip content is loading
  defaultLoadingContent: "...",
  // Hide on mouseover tooltip
  autoHide: true,
  // Close tooltip on click on tooltip target?
  defaultHideOnTargetClick: true,
  // Auto destroy tooltip DOM nodes (ms)
  disposeTimeout: 5e3,
  // Options for popover
  popover: {
    defaultPlacement: "bottom",
    // Use the `popoverClass` prop for theming
    defaultClass: "vue-popover-theme",
    // Base class (change if conflicts with other libraries)
    defaultBaseClass: "tooltip popover",
    // Wrapper class (contains arrow and inner)
    defaultWrapperClass: "wrapper",
    // Inner content class
    defaultInnerClass: "tooltip-inner popover-inner",
    // Arrow class
    defaultArrowClass: "tooltip-arrow popover-arrow",
    // Class added when popover is open
    defaultOpenClass: "open",
    defaultDelay: 0,
    defaultTrigger: "click",
    defaultOffset: 0,
    defaultContainer: "body",
    defaultBoundariesElement: void 0,
    defaultPopperOptions: {},
    // Hides if clicked outside of popover
    defaultAutoHide: true,
    // Update popper on content resize
    defaultHandleResize: true
  }
};
function getOptions(options) {
  var result = {
    placement: typeof options.placement !== "undefined" ? options.placement : directive.options.defaultPlacement,
    delay: typeof options.delay !== "undefined" ? options.delay : directive.options.defaultDelay,
    html: typeof options.html !== "undefined" ? options.html : directive.options.defaultHtml,
    template: typeof options.template !== "undefined" ? options.template : directive.options.defaultTemplate,
    arrowSelector: typeof options.arrowSelector !== "undefined" ? options.arrowSelector : directive.options.defaultArrowSelector,
    innerSelector: typeof options.innerSelector !== "undefined" ? options.innerSelector : directive.options.defaultInnerSelector,
    trigger: typeof options.trigger !== "undefined" ? options.trigger : directive.options.defaultTrigger,
    offset: typeof options.offset !== "undefined" ? options.offset : directive.options.defaultOffset,
    container: typeof options.container !== "undefined" ? options.container : directive.options.defaultContainer,
    boundariesElement: typeof options.boundariesElement !== "undefined" ? options.boundariesElement : directive.options.defaultBoundariesElement,
    autoHide: typeof options.autoHide !== "undefined" ? options.autoHide : directive.options.autoHide,
    hideOnTargetClick: typeof options.hideOnTargetClick !== "undefined" ? options.hideOnTargetClick : directive.options.defaultHideOnTargetClick,
    loadingClass: typeof options.loadingClass !== "undefined" ? options.loadingClass : directive.options.defaultLoadingClass,
    loadingContent: typeof options.loadingContent !== "undefined" ? options.loadingContent : directive.options.defaultLoadingContent,
    popperOptions: _objectSpread$1({}, typeof options.popperOptions !== "undefined" ? options.popperOptions : directive.options.defaultPopperOptions)
  };
  if (result.offset) {
    var typeofOffset = _typeof(result.offset);
    var offset2 = result.offset;
    if (typeofOffset === "number" || typeofOffset === "string" && offset2.indexOf(",") === -1) {
      offset2 = "0, ".concat(offset2);
    }
    if (!result.popperOptions.modifiers) {
      result.popperOptions.modifiers = {};
    }
    result.popperOptions.modifiers.offset = {
      offset: offset2
    };
  }
  if (result.trigger && result.trigger.indexOf("click") !== -1) {
    result.hideOnTargetClick = false;
  }
  return result;
}
function getPlacement(value, modifiers2) {
  var placement2 = value.placement;
  for (var i = 0; i < positions.length; i++) {
    var pos = positions[i];
    if (modifiers2[pos]) {
      placement2 = pos;
    }
  }
  return placement2;
}
function getContent(value) {
  var type = _typeof(value);
  if (type === "string") {
    return value;
  } else if (value && type === "object") {
    return value.content;
  } else {
    return false;
  }
}
function createTooltip(el, value) {
  var modifiers2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var content = getContent(value);
  var classes = typeof value.classes !== "undefined" ? value.classes : directive.options.defaultClass;
  var opts = _objectSpread$1({
    title: content
  }, getOptions(_objectSpread$1(_objectSpread$1({}, _typeof(value) === "object" ? value : {}), {}, {
    placement: getPlacement(value, modifiers2)
  })));
  var tooltip = el._tooltip = new Tooltip(el, opts);
  tooltip.setClasses(classes);
  tooltip._vueEl = el;
  var targetClasses = typeof value.targetClasses !== "undefined" ? value.targetClasses : directive.options.defaultTargetClass;
  el._tooltipTargetClasses = targetClasses;
  addClasses(el, targetClasses);
  return tooltip;
}
function destroyTooltip(el) {
  if (el._tooltip) {
    el._tooltip.dispose();
    delete el._tooltip;
    delete el._tooltipOldShow;
  }
  if (el._tooltipTargetClasses) {
    removeClasses(el, el._tooltipTargetClasses);
    delete el._tooltipTargetClasses;
  }
}
function bind(el, _ref) {
  var value = _ref.value;
  _ref.oldValue;
  var modifiers2 = _ref.modifiers;
  var content = getContent(value);
  if (!content || !state.enabled) {
    destroyTooltip(el);
  } else {
    var tooltip;
    if (el._tooltip) {
      tooltip = el._tooltip;
      tooltip.setContent(content);
      tooltip.setOptions(_objectSpread$1(_objectSpread$1({}, value), {}, {
        placement: getPlacement(value, modifiers2)
      }));
    } else {
      tooltip = createTooltip(el, value, modifiers2);
    }
    if (typeof value.show !== "undefined" && value.show !== el._tooltipOldShow) {
      el._tooltipOldShow = value.show;
      value.show ? tooltip.show() : tooltip.hide();
    }
  }
}
var directive = {
  options: defaultOptions,
  bind,
  update: bind,
  unbind: function unbind(el) {
    destroyTooltip(el);
  }
};
function addListeners(el) {
  el.addEventListener("click", onClick);
  el.addEventListener("touchstart", onTouchStart, supportsPassive ? {
    passive: true
  } : false);
}
function removeListeners(el) {
  el.removeEventListener("click", onClick);
  el.removeEventListener("touchstart", onTouchStart);
  el.removeEventListener("touchend", onTouchEnd);
  el.removeEventListener("touchcancel", onTouchCancel);
}
function onClick(event) {
  var el = event.currentTarget;
  event.closePopover = !el.$_vclosepopover_touch;
  event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all;
}
function onTouchStart(event) {
  if (event.changedTouches.length === 1) {
    var el = event.currentTarget;
    el.$_vclosepopover_touch = true;
    var touch = event.changedTouches[0];
    el.$_vclosepopover_touchPoint = touch;
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchCancel);
  }
}
function onTouchEnd(event) {
  var el = event.currentTarget;
  el.$_vclosepopover_touch = false;
  if (event.changedTouches.length === 1) {
    var touch = event.changedTouches[0];
    var firstTouch = el.$_vclosepopover_touchPoint;
    event.closePopover = Math.abs(touch.screenY - firstTouch.screenY) < 20 && Math.abs(touch.screenX - firstTouch.screenX) < 20;
    event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all;
  }
}
function onTouchCancel(event) {
  var el = event.currentTarget;
  el.$_vclosepopover_touch = false;
}
var vclosepopover = {
  bind: function bind2(el, _ref) {
    var value = _ref.value, modifiers2 = _ref.modifiers;
    el.$_closePopoverModifiers = modifiers2;
    if (typeof value === "undefined" || value) {
      addListeners(el);
    }
  },
  update: function update2(el, _ref2) {
    var value = _ref2.value, oldValue = _ref2.oldValue, modifiers2 = _ref2.modifiers;
    el.$_closePopoverModifiers = modifiers2;
    if (value !== oldValue) {
      if (typeof value === "undefined" || value) {
        addListeners(el);
      } else {
        removeListeners(el);
      }
    }
  },
  unbind: function unbind2(el) {
    removeListeners(el);
  }
};
function ownKeys(object, enumerableOnly) {
  var keys2 = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys2.push.apply(keys2, symbols);
  }
  return keys2;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function getDefault(key) {
  var value = directive.options.popover[key];
  if (typeof value === "undefined") {
    return directive.options[key];
  }
  return value;
}
var isIOS = false;
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
var openPopovers = [];
var Element$1 = function Element2() {
};
if (typeof window !== "undefined") {
  Element$1 = window.Element;
}
var script = {
  name: "VPopover",
  components: {
    ResizeObserver: __vue_component__$1
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: function _default() {
        return getDefault("defaultPlacement");
      }
    },
    delay: {
      type: [String, Number, Object],
      default: function _default2() {
        return getDefault("defaultDelay");
      }
    },
    offset: {
      type: [String, Number],
      default: function _default3() {
        return getDefault("defaultOffset");
      }
    },
    trigger: {
      type: String,
      default: function _default4() {
        return getDefault("defaultTrigger");
      }
    },
    container: {
      type: [String, Object, Element$1, Boolean],
      default: function _default5() {
        return getDefault("defaultContainer");
      }
    },
    boundariesElement: {
      type: [String, Element$1],
      default: function _default6() {
        return getDefault("defaultBoundariesElement");
      }
    },
    popperOptions: {
      type: Object,
      default: function _default7() {
        return getDefault("defaultPopperOptions");
      }
    },
    popoverClass: {
      type: [String, Array],
      default: function _default8() {
        return getDefault("defaultClass");
      }
    },
    popoverBaseClass: {
      type: [String, Array],
      default: function _default9() {
        return directive.options.popover.defaultBaseClass;
      }
    },
    popoverInnerClass: {
      type: [String, Array],
      default: function _default10() {
        return directive.options.popover.defaultInnerClass;
      }
    },
    popoverWrapperClass: {
      type: [String, Array],
      default: function _default11() {
        return directive.options.popover.defaultWrapperClass;
      }
    },
    popoverArrowClass: {
      type: [String, Array],
      default: function _default12() {
        return directive.options.popover.defaultArrowClass;
      }
    },
    autoHide: {
      type: Boolean,
      default: function _default13() {
        return directive.options.popover.defaultAutoHide;
      }
    },
    handleResize: {
      type: Boolean,
      default: function _default14() {
        return directive.options.popover.defaultHandleResize;
      }
    },
    openGroup: {
      type: String,
      default: null
    },
    openClass: {
      type: [String, Array],
      default: function _default15() {
        return directive.options.popover.defaultOpenClass;
      }
    },
    ariaId: {
      default: null
    }
  },
  data: function data() {
    return {
      isOpen: false,
      id: Math.random().toString(36).substr(2, 10)
    };
  },
  computed: {
    cssClass: function cssClass() {
      return _defineProperty$1({}, this.openClass, this.isOpen);
    },
    popoverId: function popoverId() {
      return "popover_".concat(this.ariaId != null ? this.ariaId : this.id);
    }
  },
  watch: {
    open: function open(val) {
      if (val) {
        this.show();
      } else {
        this.hide();
      }
    },
    disabled: function disabled(val, oldVal) {
      if (val !== oldVal) {
        if (val) {
          this.hide();
        } else if (this.open) {
          this.show();
        }
      }
    },
    container: function container(val) {
      if (this.isOpen && this.popperInstance) {
        var popoverNode = this.$refs.popover;
        var reference = this.$refs.trigger;
        var container2 = this.$_findContainer(this.container, reference);
        if (!container2) {
          console.warn("No container for popover", this);
          return;
        }
        container2.appendChild(popoverNode);
        this.popperInstance.scheduleUpdate();
      }
    },
    trigger: function trigger(val) {
      this.$_removeEventListeners();
      this.$_addEventListeners();
    },
    placement: function placement(val) {
      var _this = this;
      this.$_updatePopper(function() {
        _this.popperInstance.options.placement = val;
      });
    },
    offset: "$_restartPopper",
    boundariesElement: "$_restartPopper",
    popperOptions: {
      handler: "$_restartPopper",
      deep: true
    }
  },
  created: function created() {
    this.$_isDisposed = false;
    this.$_mounted = false;
    this.$_events = [];
    this.$_preventOpen = false;
  },
  mounted: function mounted2() {
    var popoverNode = this.$refs.popover;
    popoverNode.parentNode && popoverNode.parentNode.removeChild(popoverNode);
    this.$_init();
    if (this.open) {
      this.show();
    }
  },
  deactivated: function deactivated() {
    this.hide();
  },
  beforeDestroy: function beforeDestroy2() {
    this.dispose();
  },
  methods: {
    show: function show() {
      var _this2 = this;
      var _ref2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, event = _ref2.event;
      _ref2.skipDelay;
      var _ref2$force = _ref2.force, force = _ref2$force === void 0 ? false : _ref2$force;
      if (force || !this.disabled) {
        this.$_scheduleShow(event);
        this.$emit("show");
      }
      this.$emit("update:open", true);
      this.$_beingShowed = true;
      requestAnimationFrame(function() {
        _this2.$_beingShowed = false;
      });
    },
    hide: function hide2() {
      var _ref3 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, event = _ref3.event;
      _ref3.skipDelay;
      this.$_scheduleHide(event);
      this.$emit("hide");
      this.$emit("update:open", false);
    },
    dispose: function dispose() {
      this.$_isDisposed = true;
      this.$_removeEventListeners();
      this.hide({
        skipDelay: true
      });
      if (this.popperInstance) {
        this.popperInstance.destroy();
        if (!this.popperInstance.options.removeOnDestroy) {
          var popoverNode = this.$refs.popover;
          popoverNode.parentNode && popoverNode.parentNode.removeChild(popoverNode);
        }
      }
      this.$_mounted = false;
      this.popperInstance = null;
      this.isOpen = false;
      this.$emit("dispose");
    },
    $_init: function $_init() {
      if (this.trigger.indexOf("manual") === -1) {
        this.$_addEventListeners();
      }
    },
    $_show: function $_show() {
      var _this3 = this;
      var reference = this.$refs.trigger;
      var popoverNode = this.$refs.popover;
      clearTimeout(this.$_disposeTimer);
      if (this.isOpen) {
        return;
      }
      if (this.popperInstance) {
        this.isOpen = true;
        this.popperInstance.enableEventListeners();
        this.popperInstance.scheduleUpdate();
      }
      if (!this.$_mounted) {
        var container2 = this.$_findContainer(this.container, reference);
        if (!container2) {
          console.warn("No container for popover", this);
          return;
        }
        container2.appendChild(popoverNode);
        this.$_mounted = true;
        this.isOpen = false;
        if (this.popperInstance) {
          requestAnimationFrame(function() {
            if (!_this3.hidden) {
              _this3.isOpen = true;
            }
          });
        }
      }
      if (!this.popperInstance) {
        var popperOptions = _objectSpread(_objectSpread({}, this.popperOptions), {}, {
          placement: this.placement
        });
        popperOptions.modifiers = _objectSpread(_objectSpread({}, popperOptions.modifiers), {}, {
          arrow: _objectSpread(_objectSpread({}, popperOptions.modifiers && popperOptions.modifiers.arrow), {}, {
            element: this.$refs.arrow
          })
        });
        if (this.offset) {
          var offset2 = this.$_getOffset();
          popperOptions.modifiers.offset = _objectSpread(_objectSpread({}, popperOptions.modifiers && popperOptions.modifiers.offset), {}, {
            offset: offset2
          });
        }
        if (this.boundariesElement) {
          popperOptions.modifiers.preventOverflow = _objectSpread(_objectSpread({}, popperOptions.modifiers && popperOptions.modifiers.preventOverflow), {}, {
            boundariesElement: this.boundariesElement
          });
        }
        this.popperInstance = new Popper(reference, popoverNode, popperOptions);
        requestAnimationFrame(function() {
          if (_this3.hidden) {
            _this3.hidden = false;
            _this3.$_hide();
            return;
          }
          if (!_this3.$_isDisposed && _this3.popperInstance) {
            _this3.popperInstance.scheduleUpdate();
            requestAnimationFrame(function() {
              if (_this3.hidden) {
                _this3.hidden = false;
                _this3.$_hide();
                return;
              }
              if (!_this3.$_isDisposed) {
                _this3.isOpen = true;
              } else {
                _this3.dispose();
              }
            });
          } else {
            _this3.dispose();
          }
        });
      }
      var openGroup = this.openGroup;
      if (openGroup) {
        var popover;
        for (var i = 0; i < openPopovers.length; i++) {
          popover = openPopovers[i];
          if (popover.openGroup !== openGroup) {
            popover.hide();
            popover.$emit("close-group");
          }
        }
      }
      openPopovers.push(this);
      this.$emit("apply-show");
    },
    $_hide: function $_hide() {
      var _this4 = this;
      if (!this.isOpen) {
        return;
      }
      var index = openPopovers.indexOf(this);
      if (index !== -1) {
        openPopovers.splice(index, 1);
      }
      this.isOpen = false;
      if (this.popperInstance) {
        this.popperInstance.disableEventListeners();
      }
      clearTimeout(this.$_disposeTimer);
      var disposeTime = directive.options.popover.disposeTimeout || directive.options.disposeTimeout;
      if (disposeTime !== null) {
        this.$_disposeTimer = setTimeout(function() {
          var popoverNode = _this4.$refs.popover;
          if (popoverNode) {
            popoverNode.parentNode && popoverNode.parentNode.removeChild(popoverNode);
            _this4.$_mounted = false;
          }
        }, disposeTime);
      }
      this.$emit("apply-hide");
    },
    $_findContainer: function $_findContainer(container2, reference) {
      if (typeof container2 === "string") {
        container2 = window.document.querySelector(container2);
      } else if (container2 === false) {
        container2 = reference.parentNode;
      }
      return container2;
    },
    $_getOffset: function $_getOffset() {
      var typeofOffset = _typeof(this.offset);
      var offset2 = this.offset;
      if (typeofOffset === "number" || typeofOffset === "string" && offset2.indexOf(",") === -1) {
        offset2 = "0, ".concat(offset2);
      }
      return offset2;
    },
    $_addEventListeners: function $_addEventListeners() {
      var _this5 = this;
      var reference = this.$refs.trigger;
      var directEvents = [];
      var oppositeEvents = [];
      var events = typeof this.trigger === "string" ? this.trigger.split(" ").filter(function(trigger3) {
        return ["click", "hover", "focus"].indexOf(trigger3) !== -1;
      }) : [];
      events.forEach(function(event) {
        switch (event) {
          case "hover":
            directEvents.push("mouseenter");
            oppositeEvents.push("mouseleave");
            break;
          case "focus":
            directEvents.push("focus");
            oppositeEvents.push("blur");
            break;
          case "click":
            directEvents.push("click");
            oppositeEvents.push("click");
            break;
        }
      });
      directEvents.forEach(function(event) {
        var func = function func2(event2) {
          if (_this5.isOpen) {
            return;
          }
          event2.usedByTooltip = true;
          !_this5.$_preventOpen && _this5.show({
            event: event2
          });
          _this5.hidden = false;
        };
        _this5.$_events.push({
          event,
          func
        });
        reference.addEventListener(event, func);
      });
      oppositeEvents.forEach(function(event) {
        var func = function func2(event2) {
          if (event2.usedByTooltip) {
            return;
          }
          _this5.hide({
            event: event2
          });
          _this5.hidden = true;
        };
        _this5.$_events.push({
          event,
          func
        });
        reference.addEventListener(event, func);
      });
    },
    $_scheduleShow: function $_scheduleShow() {
      var skipDelay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      clearTimeout(this.$_scheduleTimer);
      if (skipDelay) {
        this.$_show();
      } else {
        var computedDelay = parseInt(this.delay && this.delay.show || this.delay || 0);
        this.$_scheduleTimer = setTimeout(this.$_show.bind(this), computedDelay);
      }
    },
    $_scheduleHide: function $_scheduleHide() {
      var _this6 = this;
      var event = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      var skipDelay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      clearTimeout(this.$_scheduleTimer);
      if (skipDelay) {
        this.$_hide();
      } else {
        var computedDelay = parseInt(this.delay && this.delay.hide || this.delay || 0);
        this.$_scheduleTimer = setTimeout(function() {
          if (!_this6.isOpen) {
            return;
          }
          if (event && event.type === "mouseleave") {
            var isSet2 = _this6.$_setTooltipNodeEvent(event);
            if (isSet2) {
              return;
            }
          }
          _this6.$_hide();
        }, computedDelay);
      }
    },
    $_setTooltipNodeEvent: function $_setTooltipNodeEvent(event) {
      var _this7 = this;
      var reference = this.$refs.trigger;
      var popoverNode = this.$refs.popover;
      var relatedreference = event.relatedreference || event.toElement || event.relatedTarget;
      var callback = function callback2(event2) {
        var relatedreference2 = event2.relatedreference || event2.toElement || event2.relatedTarget;
        popoverNode.removeEventListener(event.type, callback2);
        if (!reference.contains(relatedreference2)) {
          _this7.hide({
            event: event2
          });
        }
      };
      if (popoverNode.contains(relatedreference)) {
        popoverNode.addEventListener(event.type, callback);
        return true;
      }
      return false;
    },
    $_removeEventListeners: function $_removeEventListeners() {
      var reference = this.$refs.trigger;
      this.$_events.forEach(function(_ref4) {
        var func = _ref4.func, event = _ref4.event;
        reference.removeEventListener(event, func);
      });
      this.$_events = [];
    },
    $_updatePopper: function $_updatePopper(cb) {
      if (this.popperInstance) {
        cb();
        if (this.isOpen)
          this.popperInstance.scheduleUpdate();
      }
    },
    $_restartPopper: function $_restartPopper() {
      if (this.popperInstance) {
        var isOpen = this.isOpen;
        this.dispose();
        this.$_isDisposed = false;
        this.$_init();
        if (isOpen) {
          this.show({
            skipDelay: true,
            force: true
          });
        }
      }
    },
    $_handleGlobalClose: function $_handleGlobalClose(event) {
      var _this8 = this;
      var touch = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (this.$_beingShowed)
        return;
      this.hide({
        event
      });
      if (event.closePopover) {
        this.$emit("close-directive");
      } else {
        this.$emit("auto-hide");
      }
      if (touch) {
        this.$_preventOpen = true;
        setTimeout(function() {
          _this8.$_preventOpen = false;
        }, 300);
      }
    },
    $_handleResize: function $_handleResize() {
      if (this.isOpen && this.popperInstance) {
        this.popperInstance.scheduleUpdate();
        this.$emit("resize");
      }
    }
  }
};
if (typeof document !== "undefined" && typeof window !== "undefined") {
  if (isIOS) {
    document.addEventListener("touchend", handleGlobalTouchend, supportsPassive ? {
      passive: true,
      capture: true
    } : true);
  } else {
    window.addEventListener("click", handleGlobalClick, true);
  }
}
function handleGlobalClick(event) {
  handleGlobalClose(event);
}
function handleGlobalTouchend(event) {
  handleGlobalClose(event, true);
}
function handleGlobalClose(event) {
  var touch = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var _loop = function _loop2(i2) {
    var popover = openPopovers[i2];
    if (popover.$refs.popover) {
      var contains = popover.$refs.popover.contains(event.target);
      requestAnimationFrame(function() {
        if (event.closeAllPopover || event.closePopover && contains || popover.autoHide && !contains) {
          popover.$_handleGlobalClose(event, touch);
        }
      });
    }
  };
  for (var i = 0; i < openPopovers.length; i++) {
    _loop(i);
  }
}
function normalizeComponent(template, style, script2, scopeId, isFunctionalTemplate, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const options = typeof script2 === "function" ? script2.options : script2;
  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true;
  }
  return script2;
}
var __vue_script__ = script;
var __vue_render__2 = function __vue_render__3() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "v-popover",
    class: _vm.cssClass
  }, [_c("div", {
    ref: "trigger",
    staticClass: "trigger",
    staticStyle: {
      display: "inline-block"
    },
    attrs: {
      "aria-describedby": _vm.isOpen ? _vm.popoverId : void 0,
      tabindex: _vm.trigger.indexOf("focus") !== -1 ? 0 : void 0
    }
  }, [_vm._t("default")], 2), _vm._v(" "), _c("div", {
    ref: "popover",
    class: [_vm.popoverBaseClass, _vm.popoverClass, _vm.cssClass],
    style: {
      visibility: _vm.isOpen ? "visible" : "hidden"
    },
    attrs: {
      id: _vm.popoverId,
      "aria-hidden": _vm.isOpen ? "false" : "true",
      tabindex: _vm.autoHide ? 0 : void 0
    },
    on: {
      keyup: function keyup($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
          return null;
        }
        _vm.autoHide && _vm.hide();
      }
    }
  }, [_c("div", {
    class: _vm.popoverWrapperClass
  }, [_c("div", {
    ref: "inner",
    class: _vm.popoverInnerClass,
    staticStyle: {
      position: "relative"
    }
  }, [_c("div", [_vm._t("popover", null, {
    isOpen: _vm.isOpen
  })], 2), _vm._v(" "), _vm.handleResize ? _c("ResizeObserver", {
    on: {
      notify: _vm.$_handleResize
    }
  }) : _vm._e()], 1), _vm._v(" "), _c("div", {
    ref: "arrow",
    class: _vm.popoverArrowClass
  })])])]);
};
var __vue_staticRenderFns__ = [];
__vue_render__2._withStripped = true;
var __vue_inject_styles__ = void 0;
var __vue_component__ = /* @__PURE__ */ normalizeComponent({
  render: __vue_render__2,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__);
function styleInject(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z = ".resize-observer[data-v-8859cc6c]{position:absolute;top:0;left:0;z-index:-1;width:100%;height:100%;border:none;background-color:transparent;pointer-events:none;display:block;overflow:hidden;opacity:0}.resize-observer[data-v-8859cc6c] object{display:block;position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1}";
styleInject(css_248z);
function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (install.installed)
    return;
  install.installed = true;
  var finalOptions = {};
  merge$1(finalOptions, defaultOptions, options);
  plugin.options = finalOptions;
  directive.options = finalOptions;
  Vue.directive("tooltip", directive);
  Vue.directive("close-popover", vclosepopover);
  Vue.component("VPopover", __vue_component__);
}
var plugin = {
  install,
  get enabled() {
    return state.enabled;
  },
  set enabled(value) {
    state.enabled = value;
  }
};
var GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}
/**
* @vue/shared v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return (val) => set2.has(val);
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove$1 = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger22, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger22;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep
    );
  }
}
function trigger2(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  if (!isSymbol(key))
    key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger2(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger2(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger2(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger2(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger2(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger2(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger2(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger2(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      )
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel
    );
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
/**
* @vue/runtime-core v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open2 = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open2, ...formatProps(vnode.props), close] : [open2 + close];
}
function formatProps(props) {
  const res = [];
  const keys2 = Object.keys(props);
  keys2.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys2.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      pauseTracking();
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data: data2,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data2,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root2 = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys2 = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root2;
    if (keys2.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys2.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root2 = cloneVNode(root2, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root2 = cloneVNode(root2, null, false, true);
    root2.dirs = root2.dirs ? root2.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root2.transition = vnode.transition;
  }
  {
    result = root2;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root2 = parent.subTree;
    if (root2.suspense && root2.suspense.activeBranch === vnode) {
      root2.el = vnode.el;
    }
    if (root2 === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove$1(scope.effects, effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
  }
  return value;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(currentRenderingInstance) || currentRenderingInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers2 = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers: modifiers2
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove$1(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys2 = Object.keys(source);
      ret = new Array(keys2.length);
      for (let i = 0, l = keys2.length; i < l; i++) {
        const key = keys2[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default")
      props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state2, key) => state2 !== EMPTY_OBJ && !state2.__isScriptSetup && hasOwn(state2, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data: data2, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data2[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data2 !== EMPTY_OBJ && hasOwn(data2, key)) {
        accessCache[key] = 2;
        return data2[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data: data2, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data2 !== EMPTY_OBJ && hasOwn(data2, key)) {
      data2[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data: data2, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data2 !== EMPTY_OBJ && hasOwn(data2, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created: created2,
    beforeMount,
    mounted: mounted3,
    beforeUpdate,
    updated,
    activated,
    deactivated: deactivated2,
    beforeDestroy: beforeDestroy3,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data2 = dataOptions.call(publicThis, publicThis);
    if (!isObject(data2))
      ;
    else {
      instance.data = reactive(data2);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created2) {
    callHook(created2, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted3);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated2);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version: version$1,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2))
          ;
        else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive2) {
        if (!directive2) {
          return context.directives[name];
        }
        context.directives[name] = directive2;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger2(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys2] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys2)
        needCastKeys.push(...keys2);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
function getType(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      extend(slots, children);
      def(slots, "_", type, true);
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray(existing) && remove$1(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (hasOwn(setupState, ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (hasOwn(setupState, ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container2, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container2, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container2, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container2, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container2,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container2, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container2,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container2, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container2,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container2, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container2,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container2, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container2, nextSibling);
      el = next;
    }
    hostInsert(anchor, container2, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container2, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container2,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container2, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container2, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container2, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container2,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          namespace
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                namespace,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        namespace
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container2 = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container2,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container2, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container2, anchor);
      hostInsert(fragmentEndAnchor, container2, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container2,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container2,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container2, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container2,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container2,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container2, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container2, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container2,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.effect.dirty = true;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container2, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container2,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container2 = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect2 = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      NOOP,
      () => queueJob(update3),
      instance.scope
      // track it in component's effect scope
    );
    const update3 = instance.update = () => {
      if (effect2.dirty) {
        effect2.run();
      }
    };
    update3.id = instance.uid;
    toggleRecurse(instance, true);
    update3();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container2, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container2,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container2,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container2, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container2, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container2, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container2,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container2,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container2, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container2,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container2,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container2,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container2,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container2, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container2, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container2, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container2, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container2, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container2, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container2, anchor, moveType);
      }
      hostInsert(vnode.anchor, container2, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container2, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container2, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container2, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container2, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update: update3, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update3) {
      update3.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  let isFlushing2 = false;
  const render = (vnode, container2, namespace) => {
    if (vnode == null) {
      if (container2._vnode) {
        unmount(container2._vnode, null, null, true);
      }
    } else {
      patch(
        container2._vnode || null,
        vnode,
        container2,
        null,
        null,
        null,
        namespace
      );
    }
    if (!isFlushing2) {
      isFlushing2 = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing2 = false;
    }
    container2._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, update: update3 }, allowed) {
  effect2.allowRecurse = update3.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    cloned.transition = transition.clone(cloned);
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key]))
      setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1)
        setters.forEach((set2) => set2(v));
      else
        setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
const version$1 = "3.4.27";
/**
* @vue/runtime-dom v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el[vShowOriginalDisplay] : "none";
  el[vShowHidden] = !value;
}
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean2 = isSpecialBooleanAttr(key);
    if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean2 ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers2) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers2.includes(m))
};
const withModifiers = (fn, modifiers2) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers2.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
    for (let i = 0; i < modifiers2.length; i++) {
      const guard = modifierGuards[modifiers2[i]];
      if (guard && guard(event, modifiers2))
        return;
    }
    return fn(event, ...args);
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container2 = normalizeContainer(containerOrSelector);
    if (!container2)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container2.innerHTML;
    }
    container2.innerHTML = "";
    const proxy = mount(container2, false, resolveRootNamespace(container2));
    if (container2 instanceof Element) {
      container2.removeAttribute("v-cloak");
      container2.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function resolveRootNamespace(container2) {
  if (container2 instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container2 instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container2) {
  if (isString(container2)) {
    const res = document.querySelector(container2);
    return res;
  }
  return container2;
}
const styles = ':root {\n  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  font-weight: 500;\n  color: #393db0;\n  text-decoration: inherit;\n}\n\na:hover {\n  color: #2d308c;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\n\nbutton:hover {\n  border-color: #646cff;\n}\n\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n\n.card {\n  padding: 2em;\n}\n\n#app {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    color: #213547;\n    background-color: #ffffff;\n  }\n  a:hover {\n    color: #0e142c;\n  }\n  button {\n    background-color: #f9f9f9;\n  }\n}\n.sc-message--emoji {\n  font-size: 40px;\n}\n\n.sc-message--file {\n  border-radius: 6px;\n  font-weight: 300;\n  font-size: 14px;\n  line-height: 1.4;\n  -webkit-font-smoothing: subpixel-antialiased;\n}\n\n.sc-message--content.sent .sc-message--file {\n  word-wrap: break-word;\n}\n\n.sc-message--file-icon {\n  text-align: center;\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 15px;\n  margin-bottom: 0px;\n}\n\n.sc-image {\n  max-width: 100%;\n  min-width: 100%;\n}\n\n.sc-message--file-text {\n  padding: 17px 20px;\n  border-radius: 6px;\n  font-weight: 300;\n  font-size: 14px;\n  line-height: 1.4;\n  white-space: pre-wrap;\n  -webkit-font-smoothing: subpixel-antialiased;\n}\n\n.sc-message--file-name {\n  color: white;\n  padding-left: 15px;\n  padding-right: 15px;\n  padding-top: 0;\n  font-size: x-small;\n  text-align: center;\n}\n\n.sc-message--file-name a {\n  text-decoration: none;\n  color: #ece7e7;\n}\n\n.sc-message--file-name a:hover {\n  color: white;\n}\n\n.sc-message--content.sent .sc-message--file-text {\n  color: white;\n  background-color: #4e8cff;\n  word-wrap: break-word;\n}\n\n.sc-message--content.received .sc-message--file {\n  color: #263238;\n  background-color: #f4f7f9;\n  margin-right: 40px;\n}\n\n.sc-message--content.received .sc-message--file-name {\n  color: #000;\n}\n\n.sc-message--content.received .sc-message--file a {\n  color: rgba(43, 40, 40, 0.7);\n}\n\n.sc-message--content.received .sc-message--file a:hover {\n  color: #0c0c0c;\n}\n\n.sc-message--system {\n  padding: 8px 20px;\n  border-radius: 6px;\n  font-weight: 300;\n  font-size: 12px;\n  line-height: 1.2;\n  white-space: pre-wrap;\n  -webkit-font-smoothing: subpixel-antialiased;\n  font-style: italic;\n  opacity: 0.55;\n}\n\n.sc-message--meta {\n  font-size: xx-small;\n  margin-bottom: 0px;\n  margin-top: 5px;\n  opacity: 0.5;\n  text-align: center;\n}\n\n.sc-message--text {\n  padding: 5px !important;\n  border-radius: 6px;\n  font-weight: 300;\n  font-size: 14px;\n  line-height: 1.4;\n  position: relative;\n  -webkit-font-smoothing: subpixel-antialiased;\n}\n\n.sc-message--text ::v-deep .sc-message--text-content {\n  margin: 0;\n  white-space: pre-wrap;\n}\n\n.sc-message--text:hover .sc-message--toolbox {\n  left: -20px;\n  opacity: 1;\n}\n\n.sc-message--text .sc-message--toolbox {\n  transition: left 0.2s ease-out 0s;\n  white-space: normal;\n  opacity: 0;\n  position: absolute;\n  left: 0px;\n  width: 25px;\n  top: 0;\n}\n\n.sc-message--text .sc-message--toolbox button {\n  background: none;\n  border: none;\n  padding: 0px;\n  margin: 0px;\n  outline: none;\n  width: 100%;\n  text-align: center;\n  cursor: pointer;\n}\n\n.sc-message--text .sc-message--toolbox button:focus {\n  outline: none;\n}\n\n.sc-message--text .sc-message--toolbox ::v-deep svg {\n  margin-left: 5px;\n}\n\n.sc-message--text code {\n  font-family: "Courier New", Courier, monospace !important;\n}\n\n.sc-message--content.sent .sc-message--text {\n  color: white;\n  background-color: #4e8cff;\n  max-width: calc(100% - 120px);\n  word-wrap: break-word;\n}\n\n.sc-message--content.received .sc-message--text {\n  color: #263238;\n  background-color: #f4f7f9;\n  margin-right: 40px;\n}\n\na.chatLink {\n  color: inherit !important;\n}\n\n.sc-typing-indicator {\n  text-align: center;\n  padding: 4px 10px;\n  border-radius: 6px;\n}\n\n.sc-typing-indicator span {\n  display: inline-block;\n  background-color: #b6b5ba;\n  width: 10px;\n  height: 10px;\n  border-radius: 100%;\n  margin-right: 3px;\n  animation: bob 2s infinite;\n}\n\n/* SAFARI GLITCH */\n.sc-typing-indicator span:nth-child(1) {\n  animation-delay: -1s;\n}\n\n.sc-typing-indicator span:nth-child(2) {\n  animation-delay: -0.85s;\n}\n\n.sc-typing-indicator span:nth-child(3) {\n  animation-delay: -0.7s;\n}\n\n@keyframes bob {\n  10% {\n    transform: translateY(-10px);\n    background-color: #9e9da2;\n  }\n\n  50% {\n    transform: translateY(0);\n    background-color: #b6b5ba;\n  }\n}\n\n.sc-chat-window {\n  width: 370px;\n  height: calc(100% - 120px);\n  max-height: 590px;\n  position: fixed;\n  right: 25px;\n  bottom: 95px;\n  box-sizing: border-box;\n  box-shadow: 0px 7px 40px 2px rgba(150, 148, 148, 0.21);\n  background: white;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  border-radius: 10px;\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  animation: fadeIn;\n  animation-duration: 0.3s;\n  animation-timing-function: ease-in-out;\n}\n\n.sc-chat-window.closed {\n  opacity: 0;\n  display: none;\n  bottom: 90px;\n}\n\n@keyframes fadeIn {\n  0% {\n    display: none;\n    opacity: 0;\n  }\n\n  100% {\n    display: flex;\n    opacity: 1;\n  }\n}\n\n.sc-message--me {\n  text-align: right;\n}\n\n.sc-message--them {\n  text-align: left;\n}\n\n@media (max-width: 450px) {\n  .sc-chat-window {\n    width: 100%;\n    height: 100%;\n    max-height: 100%;\n    right: 0px;\n    bottom: 0px;\n    border-radius: 0px;\n  }\n\n  .sc-chat-window {\n    transition: 0.1s ease-in-out;\n  }\n\n  .sc-chat-window.closed {\n    bottom: 0px;\n  }\n}\n\n.sc-header {\n  min-height: 75px;\n  border-top-left-radius: 9px;\n  border-top-right-radius: 9px;\n  padding: 10px;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);\n  position: relative;\n  box-sizing: border-box;\n  display: flex;\n}\n\n.sc-header--img {\n  /*border-radius: 50%;*/\n  align-self: center;\n  padding: 10px;\n  height: 35px !important;\n  /*width: 60px !important; skip for current plugin*/\n}\n\n.sc-header--title {\n  align-self: center;\n  padding: 10px;\n  flex: 1;\n  user-select: none;\n  font-size: 20px;\n}\n\n.sc-header--close-button {\n  width: 40px;\n  align-self: center;\n  height: 40px;\n  margin-right: 10px;\n  box-sizing: border-box;\n  cursor: pointer;\n  border-radius: 5px;\n  margin-left: auto;\n}\n\n.sc-header--close-button:hover {\n  box-shadow: 0px 2px 5px rgba(0, 0, 1, 0.1);\n}\n\n.sc-header--close-button img {\n  width: 100%;\n  height: 100%;\n  padding: 13px;\n  box-sizing: border-box;\n}\n\n@media (max-width: 450px) {\n  .sc-header {\n    border-radius: 0px;\n  }\n}\n\n.sc-launcher {\n  width: 60px;\n  height: 60px;\n  background-position: center;\n  background-repeat: no-repeat;\n  position: fixed;\n  right: 25px;\n  bottom: 25px;\n  border-radius: 50%;\n  box-shadow: none;\n  transition: box-shadow 0.2s ease-in-out;\n  cursor: pointer;\n}\n\n.sc-launcher:before {\n  content: "";\n  position: relative;\n  display: block;\n  width: 60px;\n  height: 60px;\n  border-radius: 50%;\n  transition: box-shadow 0.2s ease-in-out;\n}\n\n.sc-launcher .sc-open-icon,\n.sc-launcher .sc-closed-icon {\n  width: 60px;\n  height: 60px;\n  position: fixed;\n  right: 25px;\n  bottom: 25px;\n  transition: opacity 100ms ease-in-out, transform 100ms ease-in-out;\n}\n\n.sc-launcher .sc-closed-icon {\n  transition: opacity 100ms ease-in-out, transform 100ms ease-in-out;\n  width: 60px;\n  height: 60px;\n}\n\n.sc-launcher .sc-open-icon {\n  padding: 20px;\n  box-sizing: border-box;\n  opacity: 1;\n}\n\n.sc-launcher.opened .sc-open-icon {\n  transform: rotate(-90deg);\n  opacity: 1;\n}\n\n.sc-launcher.opened .sc-closed-icon {\n  transform: rotate(-90deg);\n  opacity: 1;\n}\n\n.sc-launcher.opened:before {\n  box-shadow: 0px 0px 400px 250px rgba(148, 149, 150, 0.2);\n}\n\n.sc-launcher:hover {\n  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.2);\n}\n\n.sc-new-messsages-count {\n  position: absolute;\n  top: -3px;\n  left: 41px;\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  border-radius: 50%;\n  width: 22px;\n  height: 22px;\n  background: #ff4646;\n  color: white;\n  text-align: center;\n  margin: auto;\n  font-size: 12px;\n  font-weight: 500;\n}\n\n.sc-new-messsages-count {\n  position: absolute;\n  top: -3px;\n  left: 41px;\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  border-radius: 50%;\n  width: 22px;\n  height: 22px;\n  background: #ff4646;\n  color: white;\n  text-align: center;\n  margin: auto;\n  font-size: 12px;\n  font-weight: 500;\n}\n\n/* TODO: re-org and scope this style block */\n.sc-message {\n  margin-bottom: 10px;\n  display: flex;\n}\n\n.sc-message .sc-message--edited {\n  opacity: 0.7;\n  word-wrap: normal;\n  font-size: xx-small;\n  text-align: left;\n}\n\n.sc-message--content {\n  width: 100%;\n  display: flex;\n}\n\n.sc-message--content.sent {\n  justify-content: flex-end;\n}\n\n.sc-message--content.system {\n  justify-content: center;\n}\n\n.sc-message--content.sent .sc-message--avatar {\n  display: none;\n}\n\n.sc-message--avatar {\n  align-self: baseline;\n  background-repeat: no-repeat;\n  background-size: 100%;\n  background-position: center;\n  min-width: 30px;\n  min-height: 30px;\n  border-radius: 50%;\n  margin-right: 15px;\n}\n\n.sc-message--meta {\n  font-size: xx-small;\n  margin-bottom: 0px;\n  color: white;\n  text-align: center;\n}\n\n.tooltip {\n  display: block !important;\n  z-index: 10000;\n}\n\n.tooltip .tooltip-inner {\n  background: black;\n  color: white;\n  border-radius: 16px;\n  padding: 5px 10px 4px;\n}\n\n.tooltip .tooltip-arrow {\n  width: 0;\n  height: 0;\n  border-style: solid;\n  position: absolute;\n  margin: 5px;\n  border-color: black;\n  z-index: 1;\n}\n\n.tooltip[x-placement^="top"] {\n  margin-bottom: 5px;\n}\n\n.tooltip[x-placement^="top"] .tooltip-arrow {\n  border-width: 5px 5px 0 5px;\n  border-left-color: transparent !important;\n  border-right-color: transparent !important;\n  border-bottom-color: transparent !important;\n  bottom: -5px;\n  left: calc(50% - 5px);\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.tooltip[x-placement^="bottom"] {\n  margin-top: 5px;\n}\n\n.tooltip[x-placement^="bottom"] .tooltip-arrow {\n  border-width: 0 5px 5px 5px;\n  border-left-color: transparent !important;\n  border-right-color: transparent !important;\n  border-top-color: transparent !important;\n  top: -5px;\n  left: calc(50% - 5px);\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.tooltip[x-placement^="right"] {\n  margin-left: 5px;\n}\n\n.tooltip[x-placement^="right"] .tooltip-arrow {\n  border-width: 5px 5px 5px 0;\n  border-left-color: transparent !important;\n  border-top-color: transparent !important;\n  border-bottom-color: transparent !important;\n  left: -5px;\n  top: calc(50% - 5px);\n  margin-left: 0;\n  margin-right: 0;\n}\n\n.tooltip[x-placement^="left"] {\n  margin-right: 5px;\n}\n\n.tooltip[x-placement^="left"] .tooltip-arrow {\n  border-width: 5px 0 5px 5px;\n  border-top-color: transparent !important;\n  border-right-color: transparent !important;\n  border-bottom-color: transparent !important;\n  right: -5px;\n  top: calc(50% - 5px);\n  margin-left: 0;\n  margin-right: 0;\n}\n\n.tooltip[aria-hidden="true"] {\n  visibility: hidden;\n  opacity: 0;\n  transition: opacity 0.15s, visibility 0.15s;\n}\n\n.tooltip[aria-hidden="false"] {\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.15s;\n}\n\n.tooltip.info .tooltip-inner {\n  background: rgba(0, 68, 153, 0.9);\n  color: white;\n  padding: 24px;\n  border-radius: 5px;\n  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);\n}\n\n.tooltip.info .tooltip-arrow {\n  border-color: rgba(0, 68, 153, 0.9);\n}\n\n.tooltip.popover .popover-inner {\n  background: #f9f9f9;\n  color: black;\n  padding: 24px;\n  border-radius: 5px;\n  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);\n}\n\n.tooltip.popover .popover-arrow {\n  border-color: #f9f9f9;\n}\n\n.sc-message-list {\n  height: 80%;\n  overflow-y: auto;\n  background-size: 100%;\n  padding: 40px 20px;\n}\n\n.sc-suggestions-row {\n  text-align: center;\n  background: inherit;\n}\n\n.sc-suggestions-element {\n  margin: 3px;\n  padding: 5px 10px 5px 10px;\n  border: 1px solid;\n  border-radius: 15px;\n  font-size: 14px;\n  background: inherit;\n  cursor: pointer;\n}\n\n.sc-user-input {\n  min-height: 55px;\n  margin: 0px;\n  position: relative;\n  bottom: 0;\n  display: flex;\n  background-color: #f4f7f9;\n  border-bottom-left-radius: 10px;\n  border-bottom-right-radius: 10px;\n  transition: background-color 0.2s ease, box-shadow 0.2s ease;\n}\n\n.sc-user-input--text {\n  text-align: left;\n  flex-grow: 1;\n  outline: none;\n  border-bottom-left-radius: 10px;\n  box-sizing: border-box;\n  padding: 18px;\n  font-size: 15px;\n  line-height: 1.33;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  color: #565867;\n  -webkit-font-smoothing: antialiased;\n  max-height: 200px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.sc-user-input--text:empty:before {\n  content: attr(placeholder);\n  display: block;\n    /* For Firefox */\n  filter: contrast(15%);\n  outline: none;\n  cursor: text;\n}\n\n.sc-user-input--buttons {\n  display: flex;\n  align-items: center;\n  padding: 0 4px;\n}\n\n.sc-user-input--button {\n  margin: 0 4px;\n}\n\n.sc-user-input.active {\n  box-shadow: none;\n  background-color: white;\n  box-shadow: 0px -5px 20px 0px rgba(150, 165, 190, 0.2);\n}\n\n.files-container {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background-color: #f4f7f9;\n  padding: 5px 20px;\n  color: #565867;\n  height: 80px;\n  overflow: auto;\n}\n\n.attachment-name {\n  cursor: pointer;\n  white-space: nowrap;\n  color: rgb(255, 255, 255);\n  overflow: hidden;\n  word-break: break-word;\n  text-overflow: ellipsis;\n  max-width: 200px;\n  text-decoration: underline;\n}\n\n.non-clickable-attachment {\n  cursor: default;\n  text-decoration: none;\n}\n\n.file-default {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  border: 1px solid #d7d8df;\n  border-radius: 10px;\n  padding: 6px;\n  padding-left: 0px;\n}\n\n.file {\n  position: relative;\n}\n\n.delete-file-button {\n  display: none;\n  position: absolute;\n  right: -5px;\n  top: -5px;\n  cursor: pointer;\n  z-index: 1000;\n}\n\n.file:hover .delete-file-button {\n  display: block;\n}\n\n.file-name {\n  color: #263238;\n  white-space: nowrap;\n  overflow: hidden;\n  word-break: break-word;\n  text-overflow: ellipsis;\n  max-width: 100px;\n}\n\n/* .file-default:hover {\n  background: #ebebeb;\n} */\n\n.files-container img {\n  cursor: pointer;\n  border-radius: 10px;\n  width: 32px;\n  height: 32px;\n}\n\n.delete-file-message {\n  font-style: normal;\n  float: right;\n  cursor: pointer;\n  color: #c8cad0;\n}\n\n.delete-file-message:hover {\n  color: #5d5e6d;\n}\n\n.icon-file-message {\n  margin-right: 5px;\n}\n\n.sc-user-input {\n  min-height: 55px;\n  margin: 0px;\n  position: relative;\n  bottom: 0;\n  display: flex;\n  background-color: #f4f7f9;\n  border-bottom-left-radius: 10px;\n  border-bottom-right-radius: 10px;\n  transition: background-color 0.2s ease, box-shadow 0.2s ease;\n}\n\n.sc-user-input--text {\n  text-align: left;\n  flex-grow: 1;\n  outline: none;\n  border-bottom-left-radius: 10px;\n  box-sizing: border-box;\n  padding: 18px;\n  font-size: 15px;\n  line-height: 1.33;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  color: #565867;\n  -webkit-font-smoothing: antialiased;\n  max-height: 200px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.sc-user-input--text:empty:before {\n  content: attr(placeholder);\n  display: block;\n    /* For Firefox */\n  filter: contrast(15%);\n  outline: none;\n  cursor: text;\n}\n\n.sc-user-input--buttons {\n  display: flex;\n  align-items: center;\n  padding: 0 4px;\n}\n\n.sc-user-input--button {\n  margin: 0 4px;\n}\n\n.sc-user-input.active {\n  box-shadow: none;\n  background-color: white;\n  box-shadow: 0px -5px 20px 0px rgba(150, 165, 190, 0.2);\n}\n\n.delete-file-message {\n  font-style: normal;\n  float: right;\n  cursor: pointer;\n  color: #c8cad0;\n}\n\n.delete-file-message:hover {\n  color: #5d5e6d;\n}\n\n.icon-file-message {\n  margin-right: 5px;\n}\n\n.sc-user-input--button-icon-wrapper {\n  display: block;\n  background: none;\n  border: none;\n  padding: 0px;\n  margin: 0px;\n  outline: none;\n  cursor: pointer;\n}\n\n.user-list {\n  height: 100%;\n  overflow: auto;\n  padding-left: 5px;\n  padding-top: 8px;\n}\n\n.img-msg {\n  border-radius: 50%;\n  width: 50px;\n  margin-right: 5px;\n}\n\n.user-element {\n  font-size: 20px;\n  vertical-align: middle;\n}\n\n.sc-user-input--emoji-icon-wrapper {\n  display: block;\n  background: none;\n  border: none;\n  padding: 0px;\n  margin: 0px;\n  outline: none;\n}\n\n.sc-user-input--emoji-icon-wrapper:focus {\n  outline: none;\n}\n\n.sc-user-input--emoji-icon {\n  display: block;\n  cursor: pointer;\n}\n\ninput[type="file"] {\n  display: none;\n}\n\n.sc-user-input--file-icon-wrapper {\n  display: block;\n  cursor: pointer;\n}\n\n.sc-user-input--file-icon {\n  display: block;\n}\n\n.sc-emoji-picker {\n  position: absolute;\n  bottom: 50px;\n  right: 12px;\n  width: 330px;\n  max-height: 215px;\n  box-shadow: 0px 7px 40px 2px rgba(148, 149, 150, 0.3);\n  background: white;\n  border-radius: 10px;\n  outline: none;\n}\n\n.sc-emoji-picker:after {\n  content: "";\n  width: 14px;\n  height: 14px;\n  background: white;\n  position: absolute;\n  bottom: -6px;\n  right: 55px;\n  transform: rotate(45deg);\n  border-radius: 2px;\n}\n\n.sc-emoji-picker--content {\n  padding: 10px;\n  overflow: auto;\n  width: 100%;\n  max-height: 195px;\n  margin-top: 7px;\n  box-sizing: border-box;\n}\n\n.sc-emoji-picker--category {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n}\n\n.sc-emoji-picker--category-title {\n  min-width: 100%;\n  color: #b8c3ca;\n  font-size: 13px;\n  margin: 5px;\n  letter-spacing: 1px;\n}\n\n.sc-emoji-picker--emoji {\n  margin: 5px;\n  width: 30px;\n  line-height: 30px;\n  text-align: center;\n  cursor: pointer;\n  vertical-align: middle;\n  font-size: 28px;\n  transition: transform 60ms ease-out;\n}\n\n.sc-emoji-picker--emoji:hover {\n  transform: scale(1.4);\n}\n\n.spiner-wrapper {\n  background: var(--gray_400);\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1000000;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.spiner-wrapper img {\n  width: 220px;\n  height: 248px;\n}\n\n.spiner-wrapper.spiner-wrapper__page {\n  position: fixed;\n}\n\n.spiner-wrapper.spiner-wrapper__local {\n  position: absolute;\n}\n\n.spiner-wrapper.spiner-wrapper__local img {\n  width: 80px;\n  height: 100px;\n}\n\n.sc-user-inpu--loader.spiner-wrapper.spiner-wrapper__local img {\n  width: 40px;\n  margin-right: 30px;\n}\n\n.sc-user-error {\n  padding: 10px;\n}\n\n.is-loaded {\n  background-color: rgba(0, 0, 0, 0.53);\n  position: absolute;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.reconnect-button {\n  color: #2d308c;\n  cursor: pointer;\n}\n\n* {\n  &::-webkit-scrollbar-track {\n    border-radius: 10px;\n    background-color: #fff;\n  }\n\n  &::-webkit-scrollbar {\n    width: 7px;\n    height: 7px;\n    background-color: #fff;\n  }\n\n  &::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background-color: #c1c1c1;\n  }\n\n  &::-webkit-scrollbar-corner {\n    background-color: #fff;\n  }\n}';
const availableColors = {
  red: {
    header: {
      bg: "#D32F2F",
      text: "#fff"
    },
    launcher: {
      bg: "#D32F2F"
    },
    messageList: {
      bg: "#fff"
    },
    sentMessage: {
      bg: "#F44336",
      text: "#fff"
    },
    receivedMessage: {
      bg: "#eaeaea",
      text: "#222222"
    },
    userInput: {
      bg: "#fff",
      text: "#212121"
    },
    userList: {
      bg: "#fff",
      text: "#212121"
    }
  },
  green: {
    header: {
      bg: "#388E3C",
      text: "#fff"
    },
    launcher: {
      bg: "#388E3C"
    },
    messageList: {
      bg: "#fff"
    },
    sentMessage: {
      bg: "#4CAF50",
      text: "#fff"
    },
    receivedMessage: {
      bg: "#eaeaea",
      text: "#222222"
    },
    userInput: {
      bg: "#fff",
      text: "#212121"
    },
    userList: {
      bg: "#fff",
      text: "#212121"
    }
  },
  blue: {
    errorInfo: {
      bg: "#ffffff",
      text: "#D32F2F"
    },
    header: {
      bg: "#4e8cff",
      text: "#ffffff",
      bgError: "#D32F2F"
    },
    launcher: {
      bg: "#4e8cff",
      bgError: "#D32F2F"
    },
    messageList: {
      bg: "#ffffff"
    },
    sentMessage: {
      bg: "#4e8cff",
      text: "#ffffff"
    },
    receivedMessage: {
      bg: "#eaeaea",
      text: "#222222"
    },
    userInput: {
      bg: "#f4f7f9",
      text: "#565867"
    },
    userList: {
      bg: "#fff",
      text: "#212121"
    }
  },
  dark: {
    header: {
      bg: "#466281",
      text: "#ecf0f1"
    },
    launcher: {
      bg: "#466281"
    },
    messageList: {
      bg: "#466281"
    },
    sentMessage: {
      bg: "#7f8c8d",
      text: "#ecf0f1"
    },
    receivedMessage: {
      bg: "#95a5a6",
      text: "#ecf0f1"
    },
    userInput: {
      bg: "#34495e",
      text: "#ecf0f1"
    },
    userList: {
      bg: "#2c3e50",
      text: "#ecf0f1"
    }
  }
};
var tinyEmitter = { exports: {} };
function E() {
}
E.prototype = {
  on: function(name, callback, ctx) {
    var e = this.e || (this.e = {});
    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx
    });
    return this;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data2 = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data2);
    }
    return this;
  },
  off: function(name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];
    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }
    liveEvents.length ? e[name] = liveEvents : delete e[name];
    return this;
  }
};
tinyEmitter.exports = E;
tinyEmitter.exports.TinyEmitter = E;
var tinyEmitterExports = tinyEmitter.exports;
const Emitter = /* @__PURE__ */ getDefaultExportFromCjs(tinyEmitterExports);
const emit = new Emitter();
const emitter = {
  $on: (...args) => emit.on(...args),
  $once: (...args) => emit.once(...args),
  $off: (...args) => emit.off(...args),
  $emit: (...args) => emit.emit(...args)
};
const EZEE_PUBLIC_CHAT_SESSION_ID = "ezee.publicChat.sessionId";
const store = {
  state: ref({
    editMessage: null,
    loadedConnection: false,
    error: null,
    isMessageSending: true,
    sessionId: null
  }),
  tokens: {
    access_token: null,
    refresh_token: null
  },
  socket: null,
  setSocket(socket2) {
    this.socket = socket2;
  },
  setupFirst: () => {
    store.state = ref({
      editMessage: null,
      sessionId: store.getSessionId()
    });
  },
  setState(key, val) {
    console.log("Setting state", key, val);
    this.state.value = {
      ...this.state.value,
      [key]: val
    };
  },
  getSessionId() {
    let sessionId = window.sessionStorage.getItem(EZEE_PUBLIC_CHAT_SESSION_ID);
    console.log(`Session ID from Session Storage: ${sessionId}`);
    if (sessionId === null) {
      sessionId = window.crypto.randomUUID();
      window.sessionStorage.setItem(EZEE_PUBLIC_CHAT_SESSION_ID, sessionId);
      console.log(`Generated Session ID: ${sessionId}`);
    }
    return sessionId;
  }
};
function mapState(keys2) {
  const map = {};
  keys2.forEach((key) => {
    map[key] = computed(() => {
      return store.state.value[key];
    });
  });
  return map;
}
function sendSocketMessage(message, attachments = []) {
  if (store.socket) {
    store.socket.send(
      JSON.stringify({
        version: "v1",
        message,
        session_id: store.state.sessionId,
        attachments
      })
    );
  }
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function getMediaMessage(author, id, file) {
  return {
    type: "file",
    author,
    id: id + Math.random(),
    data: {
      // text: `What about this one instead?? `,
      file: {
        url: file
      }
      // meta: '✓✓ Read'
    }
  };
}
const _sfc_main$o = {
  name: "App",
  data() {
    const { chatConfig } = mapState(["chatConfig"]);
    return {
      botTitle: chatConfig.value.botTitle || "EzeeAssist Helper",
      titleImageUrl: chatConfig.value.wordpressPluginPath + "/bot-logo.png",
      messageList: [],
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: "",
      colors: null,
      availableColors,
      chosenColor: null,
      alwaysScrollToBottom: true,
      messageStyling: true,
      userIsTyping: false,
      showFile: true,
      types: {
        user: "me",
        bot: "bot"
      },
      messageListCopy: []
    };
  },
  computed: {
    linkColor() {
      return this.chosenColor === "dark" ? this.colors.sentMessage.text : this.colors.launcher.bg;
    },
    backgroundColor() {
      return this.chosenColor === "dark" ? this.colors.messageList.bg : "#fff";
    },
    ...mapState(["error"])
  },
  watch: {
    error(value) {
      if (!value) {
        this.messageList = [];
      }
    }
  },
  created() {
    this.setColor("blue");
  },
  mounted() {
    emitter.$on("onmessage", (event) => {
      if (Array.isArray(event)) {
        event.forEach((item) => {
          Array.isArray(item) ? item.forEach((nested) => this.handleItemSocketAnswer(nested)) : this.handleItemSocketAnswer(item);
        });
        if (event.length == 1 && event[0].msg_type == "bot" && !this.isChatOpen) {
          this.newMessagesCount = this.newMessagesCount + 1;
        }
      } else {
        this.handleItemSocketAnswer(event);
      }
    });
    this.messageList.forEach((x) => x.liked = false);
  },
  methods: {
    handleItemSocketAnswer(event) {
      var _a, _b;
      if (event.msg_type === "system" && !event.success) {
        Object.assign(
          {},
          {
            type: "system",
            data: {
              text: event.response,
              attachments: event == null ? void 0 : event.attachments
            },
            author: `bot`
          },
          { id: event.id }
        );
        this.showTypingIndicator = false;
      }
      if (!event.msg_type || this.types[event.msg_type]) {
        const message = Object.assign(
          {},
          {
            type: "text",
            data: {
              text: event.response,
              attachments: event == null ? void 0 : event.attachments
            },
            author: this.types[event.msg_type] || `bot`
          },
          { id: event.id }
        );
        if (this.isChatOpen) {
          this.messageList = [
            ...this.messageList,
            message,
            ...((_a = event.media_urls) == null ? void 0 : _a.map(
              (i) => getMediaMessage(`bot`, event.id, i.url)
            )) || []
          ];
        } else {
          this.messageList = [
            ...this.messageList,
            message,
            ...((_b = event.media_urls) == null ? void 0 : _b.map(
              (i) => getMediaMessage(`bot`, event.id, i.url)
            )) || []
          ];
        }
        this.showTypingIndicator = false;
      }
    },
    async uploadFileByS3PresignedURL(file, presigned_url) {
      const formData = new FormData();
      Object.entries(presigned_url.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file, file.name);
      try {
        const httpResponse = await fetch(presigned_url.url, {
          method: "POST",
          body: formData
        });
        return httpResponse.status === 204;
      } catch (error) {
        return false;
      }
    },
    async onMessageWasSent(message) {
      var _a, _b;
      const messageText = message.type === "emoji" ? message.data.emoji : message.data.text;
      const { chatConfig } = mapState(["chatConfig"]);
      const attachments = [];
      if ((_a = message.files) == null ? void 0 : _a.length) {
        const access_token = store.tokens.access_token;
        const presignedUrl = `${chatConfig.value.apiBaseUrl}/api/attachments/create/post-presigned-url/${chatConfig.value.org_token}?token=${access_token}`;
        const presignedAttachments = message.files.map(({ name, type }) => {
          return {
            content_type: type,
            name
          };
        });
        const presignedFilesDataRes = await fetch(
          presignedUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              attachments: presignedAttachments
            })
          }
        );
        const presignedFilesData = await presignedFilesDataRes.json();
        if ((_b = presignedFilesData == null ? void 0 : presignedFilesData.attachments) == null ? void 0 : _b.length) {
          presignedFilesData.attachments.forEach((attachment, index) => {
            const uploaded = this.uploadFileByS3PresignedURL(
              message.files[index],
              attachment.presigned_url
            );
            if (uploaded) {
              attachments.push({
                file_name: attachment.file_name,
                s3_key: attachment.s3_key,
                bucket: attachment.bucket
              });
            }
          });
        }
      }
      message.data.attachments = attachments.map(({ file_name }) => {
        return {
          filename: file_name,
          url: ""
        };
      });
      sendSocketMessage(messageText, attachments);
      this.showTypingIndicator = true;
      this.messageList = [
        ...this.messageList,
        Object.assign({}, message, { id: Math.random() })
      ];
      store.setState("isMessageSending", false);
    },
    openChat() {
      this.isChatOpen = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.newMessagesCount = 0;
        });
      }, 0);
    },
    closeChat() {
      this.isChatOpen = false;
    },
    setColor(color) {
      this.colors = this.availableColors[color];
      this.chosenColor = color;
    },
    showStylingInfo() {
      this.$modal.show("dialog", {
        title: "Info",
        text: "You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>"
      });
    },
    messageStylingToggled(e) {
      this.messageStyling = e.target.checked;
    },
    handleOnType() {
      emitter.$emit("onType");
      this.userIsTyping = true;
    },
    editMessage(message) {
      const m = this.messageList.find((m2) => m2.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
    removeMessage(message) {
      if (confirm("Delete?")) {
        const m = this.messageList.find((m2) => m2.id === message.id);
        m.type = "system";
        m.data.text = "This message has been removed";
      }
    },
    like(id) {
      const m = this.messageList.findIndex((m2) => m2.id === id);
      var msg = this.messageList[m];
      msg.liked = !msg.liked;
      this.$set(this.messageList, m, msg);
    }
  }
};
const _hoisted_1$l = ["onClick"];
const _hoisted_2$c = ["innerHTML"];
const _hoisted_3$a = {
  key: 1,
  class: "sc-message--edited"
};
function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BubbleChat = resolveComponent("BubbleChat");
  return openBlock(), createBlock(_component_BubbleChat, {
    "always-scroll-to-bottom": $data.alwaysScrollToBottom,
    close: $options.closeChat,
    colors: $data.colors,
    "is-open": $data.isChatOpen,
    "message-list": $data.messageList,
    "message-styling": $data.messageStyling,
    "new-messages-count": $data.newMessagesCount,
    "on-message-was-sent": $options.onMessageWasSent,
    open: $options.openChat,
    "show-close-button": true,
    "show-launcher": true,
    "show-emoji": false,
    "show-file": $data.showFile,
    "show-typing-indicator": $data.showTypingIndicator,
    "show-edition": true,
    "show-deletion": true,
    title: $data.botTitle,
    "title-image-url": $data.titleImageUrl,
    "disable-user-list-toggle": true,
    onOnType: $options.handleOnType,
    onEdit: $options.editMessage,
    onRemove: $options.removeMessage
  }, {
    "text-message-toolbox": withCtx((scopedProps) => [
      !scopedProps.me && scopedProps.message.type === "text" ? (openBlock(), createElementBlock("button", {
        key: 0,
        onClick: withModifiers(($event) => $options.like(scopedProps.message.id), ["prevent"])
      }, " 👍 ", 8, _hoisted_1$l)) : createCommentVNode("", true)
    ]),
    "text-message-body": withCtx((scopedProps) => [
      createBaseVNode("p", {
        class: "sc-message--text-content",
        innerHTML: scopedProps.message.data.text
      }, null, 8, _hoisted_2$c),
      scopedProps.message.data.meta ? (openBlock(), createElementBlock("p", {
        key: 0,
        class: "sc-message--meta",
        style: normalizeStyle({ color: scopedProps.messageColors.color })
      }, toDisplayString(scopedProps.message.data.meta), 5)) : createCommentVNode("", true),
      scopedProps.message.isEdited || scopedProps.message.liked ? (openBlock(), createElementBlock("p", _hoisted_3$a, [
        scopedProps.message.isEdited ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createTextVNode("✎")
        ], 64)) : createCommentVNode("", true),
        scopedProps.message.liked ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createTextVNode("👍")
        ], 64)) : createCommentVNode("", true)
      ])) : createCommentVNode("", true)
    ]),
    "system-message-body": withCtx(({ message }) => [
      createTextVNode(" [System]: " + toDisplayString(message.text), 1)
    ]),
    _: 1
  }, 8, ["always-scroll-to-bottom", "close", "colors", "is-open", "message-list", "message-styling", "new-messages-count", "on-message-was-sent", "open", "show-file", "show-typing-indicator", "title", "title-image-url", "onOnType", "onEdit", "onRemove"]);
}
const App = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-a635f609"]]);
const CloseIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUxpcf///////////////////////////////////////////////////////3EAnbYAAAAOdFJOUwADZ66SoQjEhnS7/gsNGQL7+wAAAKtJREFUKM+F01sOhCAQRNESFV/I/pc70Og0YJfyJbmHhBAbGGYHstw8IPV4EOGOmERYIhGpxyUAJxHSz/xlC+1FxE64qB1yj1ZID7oXsel+63ovnj2JXUXue+hvrcLugL+EdG+9XBG8X+Kl34J3YM1g/egvIvdx5EK691RIz78YEXdnQrst6m6JqemXmNo+D/WJNAyVePZWWL0WdlfB+l+UAQQReaAc65DB/wGsZgzLN0IQWAAAAABJRU5ErkJggg==";
const _sfc_main$n = {
  props: {
    icons: {
      type: Object,
      default: function() {
        return {
          close: {
            img: CloseIcon$1,
            name: "default"
          }
        };
      }
    },
    title: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inUserList: false
    };
  },
  setup() {
    return {
      ...mapState(["disableUserListToggle", "titleImageUrl", "showCloseButton"])
    };
  },
  methods: {
    toggleUserList() {
      this.inUserList = !this.inUserList;
      this.$emit("userList", this.inUserList);
    }
  }
};
const _hoisted_1$k = ["src"];
const _hoisted_2$b = {
  key: 1,
  class: "sc-header--title"
};
const _hoisted_3$9 = {
  key: 2,
  class: "sc-header--title"
};
const _hoisted_4$5 = ["src", "alt"];
function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "sc-header",
    style: normalizeStyle({ background: $props.colors.header.bg, color: $props.colors.header.text })
  }, [
    _ctx.titleImageUrl ? (openBlock(), createElementBlock("img", {
      key: 0,
      class: "sc-header--img",
      src: _ctx.titleImageUrl,
      height: "60px",
      alt: ""
    }, null, 8, _hoisted_1$k)) : createCommentVNode("", true),
    !_ctx.disableUserListToggle ? (openBlock(), createElementBlock("div", _hoisted_2$b, toDisplayString($props.title), 1)) : (openBlock(), createElementBlock("div", _hoisted_3$9, toDisplayString($props.title), 1)),
    _ctx.showCloseButton ? (openBlock(), createElementBlock("div", {
      key: 3,
      class: "sc-header--close-button",
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
    }, [
      createBaseVNode("img", {
        src: $props.icons.close.img,
        alt: $props.icons.close.name
      }, null, 8, _hoisted_4$5)
    ])) : createCommentVNode("", true)
  ], 4);
}
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m]]);
const _sfc_main$m = {
  props: {
    iconName: {
      type: String,
      default: "box"
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    viewBox: {
      type: String,
      default: "0 0 18 18"
    },
    iconColor: {
      type: String,
      default: "currentColor"
    }
  }
};
const _hoisted_1$j = ["width", "height", "viewBox", "aria-labelledby"];
const _hoisted_2$a = ["id"];
const _hoisted_3$8 = ["fill"];
function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: $props.width,
    height: $props.height,
    viewBox: $props.viewBox,
    "aria-labelledby": $props.iconName,
    role: "presentation"
  }, [
    createBaseVNode("title", {
      id: $props.iconName,
      lang: "en"
    }, toDisplayString($props.iconName), 9, _hoisted_2$a),
    createBaseVNode("g", { fill: $props.iconColor }, [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 8, _hoisted_3$8)
  ], 8, _hoisted_1$j);
}
const IconBase = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-58f0e8b2"]]);
const _sfc_main$l = {};
const _hoisted_1$i = { d: "M19.404,6.65l-5.998-5.996c-0.292-0.292-0.765-0.292-1.056,0l-2.22,2.22l-8.311,8.313l-0.003,0.001v0.003l-0.161,0.161c-0.114,0.112-0.187,0.258-0.21,0.417l-1.059,7.051c-0.035,0.233,0.044,0.47,0.21,0.639c0.143,0.14,0.333,0.219,0.528,0.219c0.038,0,0.073-0.003,0.111-0.009l7.054-1.055c0.158-0.025,0.306-0.098,0.417-0.211l8.478-8.476l2.22-2.22C19.695,7.414,19.695,6.941,19.404,6.65z M8.341,16.656l-0.989-0.99l7.258-7.258l0.989,0.99L8.341,16.656z M2.332,15.919l0.411-2.748l4.143,4.143l-2.748,0.41L2.332,15.919z M13.554,7.351L6.296,14.61l-0.849-0.848l7.259-7.258l0.423,0.424L13.554,7.351zM10.658,4.457l0.992,0.99l-7.259,7.258L3.4,11.715L10.658,4.457z M16.656,8.342l-1.517-1.517V6.823h-0.003l-0.951-0.951l-2.471-2.471l1.164-1.164l4.942,4.94L16.656,8.342z" };
function _sfc_render$k(_ctx, _cache) {
  return openBlock(), createElementBlock("path", _hoisted_1$i);
}
const IconEdit = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k]]);
const _sfc_main$k = {};
const _hoisted_1$h = { d: "M15.9 4.04a.7.7 0 00-.99 0l-4.7 4.72-4.72-4.71a.7.7 0 00-.98.98l4.7 4.71-4.7 4.71a.7.7 0 00.98.99l4.71-4.71 4.71 4.7a.7.7 0 00.99 0 .7.7 0 000-.98l-4.71-4.7 4.7-4.72a.7.7 0 000-.99z" };
function _sfc_render$j(_ctx, _cache) {
  return openBlock(), createElementBlock("path", _hoisted_1$h);
}
const IconCross = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j]]);
const _htmlEscape = (string) => string.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function htmlEscape(strings, ...values) {
  if (typeof strings === "string") {
    return _htmlEscape(strings);
  }
  let output = strings[0];
  for (const [index, value] of values.entries()) {
    output = output + _htmlEscape(String(value)) + strings[index + 1];
  }
  return output;
}
var version = "4.0.0";
function isUndefined(value) {
  return value === void 0;
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function defaults(dest, src) {
  for (var prop in src) {
    if (src.hasOwnProperty(prop) && isUndefined(dest[prop])) {
      dest[prop] = src[prop];
    }
  }
  return dest;
}
function ellipsis(str, truncateLen, ellipsisChars) {
  var ellipsisLength;
  if (str.length > truncateLen) {
    if (ellipsisChars == null) {
      ellipsisChars = "&hellip;";
      ellipsisLength = 3;
    } else {
      ellipsisLength = ellipsisChars.length;
    }
    str = str.substring(0, truncateLen - ellipsisLength) + ellipsisChars;
  }
  return str;
}
function remove(arr, item) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === item) {
      arr.splice(i, 1);
    }
  }
}
function removeWithPredicate(arr, fn) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (fn(arr[i]) === true) {
      arr.splice(i, 1);
    }
  }
}
function assertNever(theValue) {
  throw new Error("Unhandled case for value: '".concat(theValue, "'"));
}
var letterRe = /[A-Za-z]/;
var digitRe = /[\d]/;
var whitespaceRe = /\s/;
var quoteRe = /['"]/;
var controlCharsRe = /[\x00-\x1F\x7F]/;
var alphaCharsStr = /A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC/.source;
var emojiStr = /\u2700-\u27bf\udde6-\uddff\ud800-\udbff\udc00-\udfff\ufe0e\ufe0f\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0\ud83c\udffb-\udfff\u200d\u3299\u3297\u303d\u3030\u24c2\ud83c\udd70-\udd71\udd7e-\udd7f\udd8e\udd91-\udd9a\udde6-\uddff\ude01-\ude02\ude1a\ude2f\ude32-\ude3a\ude50-\ude51\u203c\u2049\u25aa-\u25ab\u25b6\u25c0\u25fb-\u25fe\u00a9\u00ae\u2122\u2139\udc04\u2600-\u26FF\u2b05\u2b06\u2b07\u2b1b\u2b1c\u2b50\u2b55\u231a\u231b\u2328\u23cf\u23e9-\u23f3\u23f8-\u23fa\udccf\u2935\u2934\u2190-\u21ff/.source;
var marksStr = /\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F/.source;
var alphaCharsAndMarksStr = alphaCharsStr + emojiStr + marksStr;
var decimalNumbersStr = /0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19/.source;
var alphaNumericAndMarksCharsStr = alphaCharsAndMarksStr + decimalNumbersStr;
var alphaNumericAndMarksRe = new RegExp("[".concat(alphaNumericAndMarksCharsStr, "]"));
var HtmlTag = (
  /** @class */
  function() {
    function HtmlTag2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.tagName = "";
      this.attrs = {};
      this.innerHTML = "";
      this.tagName = cfg.tagName || "";
      this.attrs = cfg.attrs || {};
      this.innerHTML = cfg.innerHtml || cfg.innerHTML || "";
    }
    HtmlTag2.prototype.setTagName = function(tagName) {
      this.tagName = tagName;
      return this;
    };
    HtmlTag2.prototype.getTagName = function() {
      return this.tagName || "";
    };
    HtmlTag2.prototype.setAttr = function(attrName, attrValue) {
      var tagAttrs = this.getAttrs();
      tagAttrs[attrName] = attrValue;
      return this;
    };
    HtmlTag2.prototype.getAttr = function(attrName) {
      return this.getAttrs()[attrName];
    };
    HtmlTag2.prototype.setAttrs = function(attrs) {
      Object.assign(this.getAttrs(), attrs);
      return this;
    };
    HtmlTag2.prototype.getAttrs = function() {
      return this.attrs || (this.attrs = {});
    };
    HtmlTag2.prototype.setClass = function(cssClass2) {
      return this.setAttr("class", cssClass2);
    };
    HtmlTag2.prototype.addClass = function(cssClass2) {
      var classAttr = this.getClass(), classes = !classAttr ? [] : classAttr.split(whitespaceRe), newClasses = cssClass2.split(whitespaceRe), newClass;
      while (newClass = newClasses.shift()) {
        if (classes.indexOf(newClass) === -1) {
          classes.push(newClass);
        }
      }
      this.getAttrs()["class"] = classes.join(" ");
      return this;
    };
    HtmlTag2.prototype.removeClass = function(cssClass2) {
      var classAttr = this.getClass(), classes = !classAttr ? [] : classAttr.split(whitespaceRe), removeClasses2 = cssClass2.split(whitespaceRe), removeClass;
      while (classes.length && (removeClass = removeClasses2.shift())) {
        var idx = classes.indexOf(removeClass);
        if (idx !== -1) {
          classes.splice(idx, 1);
        }
      }
      this.getAttrs()["class"] = classes.join(" ");
      return this;
    };
    HtmlTag2.prototype.getClass = function() {
      return this.getAttrs()["class"] || "";
    };
    HtmlTag2.prototype.hasClass = function(cssClass2) {
      return (" " + this.getClass() + " ").indexOf(" " + cssClass2 + " ") !== -1;
    };
    HtmlTag2.prototype.setInnerHTML = function(html) {
      this.innerHTML = html;
      return this;
    };
    HtmlTag2.prototype.setInnerHtml = function(html) {
      return this.setInnerHTML(html);
    };
    HtmlTag2.prototype.getInnerHTML = function() {
      return this.innerHTML || "";
    };
    HtmlTag2.prototype.getInnerHtml = function() {
      return this.getInnerHTML();
    };
    HtmlTag2.prototype.toAnchorString = function() {
      var tagName = this.getTagName(), attrsStr = this.buildAttrsStr();
      attrsStr = attrsStr ? " " + attrsStr : "";
      return ["<", tagName, attrsStr, ">", this.getInnerHtml(), "</", tagName, ">"].join("");
    };
    HtmlTag2.prototype.buildAttrsStr = function() {
      if (!this.attrs)
        return "";
      var attrs = this.getAttrs(), attrsArr = [];
      for (var prop in attrs) {
        if (attrs.hasOwnProperty(prop)) {
          attrsArr.push(prop + '="' + attrs[prop] + '"');
        }
      }
      return attrsArr.join(" ");
    };
    return HtmlTag2;
  }()
);
function truncateSmart(url, truncateLen, ellipsisChars) {
  var ellipsisLengthBeforeParsing;
  var ellipsisLength;
  if (ellipsisChars == null) {
    ellipsisChars = "&hellip;";
    ellipsisLength = 3;
    ellipsisLengthBeforeParsing = 8;
  } else {
    ellipsisLength = ellipsisChars.length;
    ellipsisLengthBeforeParsing = ellipsisChars.length;
  }
  var parse_url = function(url2) {
    var urlObj2 = {};
    var urlSub = url2;
    var match = urlSub.match(/^([a-z]+):\/\//i);
    if (match) {
      urlObj2.scheme = match[1];
      urlSub = urlSub.substr(match[0].length);
    }
    match = urlSub.match(/^(.*?)(?=(\?|#|\/|$))/i);
    if (match) {
      urlObj2.host = match[1];
      urlSub = urlSub.substr(match[0].length);
    }
    match = urlSub.match(/^\/(.*?)(?=(\?|#|$))/i);
    if (match) {
      urlObj2.path = match[1];
      urlSub = urlSub.substr(match[0].length);
    }
    match = urlSub.match(/^\?(.*?)(?=(#|$))/i);
    if (match) {
      urlObj2.query = match[1];
      urlSub = urlSub.substr(match[0].length);
    }
    match = urlSub.match(/^#(.*?)$/i);
    if (match) {
      urlObj2.fragment = match[1];
    }
    return urlObj2;
  };
  var buildUrl = function(urlObj2) {
    var url2 = "";
    if (urlObj2.scheme && urlObj2.host) {
      url2 += urlObj2.scheme + "://";
    }
    if (urlObj2.host) {
      url2 += urlObj2.host;
    }
    if (urlObj2.path) {
      url2 += "/" + urlObj2.path;
    }
    if (urlObj2.query) {
      url2 += "?" + urlObj2.query;
    }
    if (urlObj2.fragment) {
      url2 += "#" + urlObj2.fragment;
    }
    return url2;
  };
  var buildSegment = function(segment, remainingAvailableLength3) {
    var remainingAvailableLengthHalf = remainingAvailableLength3 / 2, startOffset = Math.ceil(remainingAvailableLengthHalf), endOffset = -1 * Math.floor(remainingAvailableLengthHalf), end2 = "";
    if (endOffset < 0) {
      end2 = segment.substr(endOffset);
    }
    return segment.substr(0, startOffset) + ellipsisChars + end2;
  };
  if (url.length <= truncateLen) {
    return url;
  }
  var availableLength = truncateLen - ellipsisLength;
  var urlObj = parse_url(url);
  if (urlObj.query) {
    var matchQuery = urlObj.query.match(/^(.*?)(?=(\?|\#))(.*?)$/i);
    if (matchQuery) {
      urlObj.query = urlObj.query.substr(0, matchQuery[1].length);
      url = buildUrl(urlObj);
    }
  }
  if (url.length <= truncateLen) {
    return url;
  }
  if (urlObj.host) {
    urlObj.host = urlObj.host.replace(/^www\./, "");
    url = buildUrl(urlObj);
  }
  if (url.length <= truncateLen) {
    return url;
  }
  var str = "";
  if (urlObj.host) {
    str += urlObj.host;
  }
  if (str.length >= availableLength) {
    if (urlObj.host.length == truncateLen) {
      return (urlObj.host.substr(0, truncateLen - ellipsisLength) + ellipsisChars).substr(0, availableLength + ellipsisLengthBeforeParsing);
    }
    return buildSegment(str, availableLength).substr(0, availableLength + ellipsisLengthBeforeParsing);
  }
  var pathAndQuery = "";
  if (urlObj.path) {
    pathAndQuery += "/" + urlObj.path;
  }
  if (urlObj.query) {
    pathAndQuery += "?" + urlObj.query;
  }
  if (pathAndQuery) {
    if ((str + pathAndQuery).length >= availableLength) {
      if ((str + pathAndQuery).length == truncateLen) {
        return (str + pathAndQuery).substr(0, truncateLen);
      }
      var remainingAvailableLength = availableLength - str.length;
      return (str + buildSegment(pathAndQuery, remainingAvailableLength)).substr(0, availableLength + ellipsisLengthBeforeParsing);
    } else {
      str += pathAndQuery;
    }
  }
  if (urlObj.fragment) {
    var fragment = "#" + urlObj.fragment;
    if ((str + fragment).length >= availableLength) {
      if ((str + fragment).length == truncateLen) {
        return (str + fragment).substr(0, truncateLen);
      }
      var remainingAvailableLength2 = availableLength - str.length;
      return (str + buildSegment(fragment, remainingAvailableLength2)).substr(0, availableLength + ellipsisLengthBeforeParsing);
    } else {
      str += fragment;
    }
  }
  if (urlObj.scheme && urlObj.host) {
    var scheme = urlObj.scheme + "://";
    if ((str + scheme).length < availableLength) {
      return (scheme + str).substr(0, truncateLen);
    }
  }
  if (str.length <= truncateLen) {
    return str;
  }
  var end = "";
  if (availableLength > 0) {
    end = str.substr(-1 * Math.floor(availableLength / 2));
  }
  return (str.substr(0, Math.ceil(availableLength / 2)) + ellipsisChars + end).substr(0, availableLength + ellipsisLengthBeforeParsing);
}
function truncateMiddle(url, truncateLen, ellipsisChars) {
  if (url.length <= truncateLen) {
    return url;
  }
  var ellipsisLengthBeforeParsing;
  var ellipsisLength;
  if (ellipsisChars == null) {
    ellipsisChars = "&hellip;";
    ellipsisLengthBeforeParsing = 8;
    ellipsisLength = 3;
  } else {
    ellipsisLengthBeforeParsing = ellipsisChars.length;
    ellipsisLength = ellipsisChars.length;
  }
  var availableLength = truncateLen - ellipsisLength;
  var end = "";
  if (availableLength > 0) {
    end = url.substr(-1 * Math.floor(availableLength / 2));
  }
  return (url.substr(0, Math.ceil(availableLength / 2)) + ellipsisChars + end).substr(0, availableLength + ellipsisLengthBeforeParsing);
}
function truncateEnd(anchorText, truncateLen, ellipsisChars) {
  return ellipsis(anchorText, truncateLen, ellipsisChars);
}
var AnchorTagBuilder = (
  /** @class */
  function() {
    function AnchorTagBuilder2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.newWindow = false;
      this.truncate = {};
      this.className = "";
      this.newWindow = cfg.newWindow || false;
      this.truncate = cfg.truncate || {};
      this.className = cfg.className || "";
    }
    AnchorTagBuilder2.prototype.build = function(match) {
      return new HtmlTag({
        tagName: "a",
        attrs: this.createAttrs(match),
        innerHtml: this.processAnchorText(match.getAnchorText())
      });
    };
    AnchorTagBuilder2.prototype.createAttrs = function(match) {
      var attrs = {
        href: match.getAnchorHref()
        // we'll always have the `href` attribute
      };
      var cssClass2 = this.createCssClass(match);
      if (cssClass2) {
        attrs["class"] = cssClass2;
      }
      if (this.newWindow) {
        attrs["target"] = "_blank";
        attrs["rel"] = "noopener noreferrer";
      }
      if (this.truncate) {
        if (this.truncate.length && this.truncate.length < match.getAnchorText().length) {
          attrs["title"] = match.getAnchorHref();
        }
      }
      return attrs;
    };
    AnchorTagBuilder2.prototype.createCssClass = function(match) {
      var className = this.className;
      if (!className) {
        return "";
      } else {
        var returnClasses = [className], cssClassSuffixes = match.getCssClassSuffixes();
        for (var i = 0, len = cssClassSuffixes.length; i < len; i++) {
          returnClasses.push(className + "-" + cssClassSuffixes[i]);
        }
        return returnClasses.join(" ");
      }
    };
    AnchorTagBuilder2.prototype.processAnchorText = function(anchorText) {
      anchorText = this.doTruncate(anchorText);
      return anchorText;
    };
    AnchorTagBuilder2.prototype.doTruncate = function(anchorText) {
      var truncate = this.truncate;
      if (!truncate || !truncate.length)
        return anchorText;
      var truncateLength = truncate.length, truncateLocation = truncate.location;
      if (truncateLocation === "smart") {
        return truncateSmart(anchorText, truncateLength);
      } else if (truncateLocation === "middle") {
        return truncateMiddle(anchorText, truncateLength);
      } else {
        return truncateEnd(anchorText, truncateLength);
      }
    };
    return AnchorTagBuilder2;
  }()
);
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p2 in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p2))
        d2[p2] = b2[p2];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t[p2] = s[p2];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var AbstractMatch = (
  /** @class */
  function() {
    function AbstractMatch2(cfg) {
      this._ = null;
      this.matchedText = "";
      this.offset = 0;
      this.tagBuilder = cfg.tagBuilder;
      this.matchedText = cfg.matchedText;
      this.offset = cfg.offset;
    }
    AbstractMatch2.prototype.getMatchedText = function() {
      return this.matchedText;
    };
    AbstractMatch2.prototype.setOffset = function(offset2) {
      this.offset = offset2;
    };
    AbstractMatch2.prototype.getOffset = function() {
      return this.offset;
    };
    AbstractMatch2.prototype.getCssClassSuffixes = function() {
      return [this.type];
    };
    AbstractMatch2.prototype.buildTag = function() {
      return this.tagBuilder.build(this);
    };
    return AbstractMatch2;
  }()
);
var tldRegexStr = "(?:xn--vermgensberatung-pwb|xn--vermgensberater-ctb|xn--clchc0ea0b2g2a9gcd|xn--w4r85el8fhu5dnra|northwesternmutual|travelersinsurance|vermögensberatung|xn--5su34j936bgsg|xn--bck1b9a5dre4c|xn--mgbah1a3hjkrd|xn--mgbai9azgqp6j|xn--mgberp4a5d4ar|xn--xkc2dl3a5ee0h|vermögensberater|xn--fzys8d69uvgm|xn--mgba7c0bbn0a|xn--mgbcpq6gpa1a|xn--xkc2al3hye2a|americanexpress|kerryproperties|sandvikcoromant|xn--i1b6b1a6a2e|xn--kcrx77d1x4a|xn--lgbbat1ad8j|xn--mgba3a4f16a|xn--mgbaakc7dvf|xn--mgbc0a9azcg|xn--nqv7fs00ema|americanfamily|bananarepublic|cancerresearch|cookingchannel|kerrylogistics|weatherchannel|xn--54b7fta0cc|xn--6qq986b3xl|xn--80aqecdr1a|xn--b4w605ferd|xn--fiq228c5hs|xn--h2breg3eve|xn--jlq480n2rg|xn--jlq61u9w7b|xn--mgba3a3ejt|xn--mgbaam7a8h|xn--mgbayh7gpa|xn--mgbbh1a71e|xn--mgbca7dzdo|xn--mgbi4ecexp|xn--mgbx4cd0ab|xn--rvc1e0am3e|international|lifeinsurance|travelchannel|wolterskluwer|xn--cckwcxetd|xn--eckvdtc9d|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--h2brj9c8c|xn--tiq49xqyj|xn--yfro4i67o|xn--ygbi2ammx|construction|lplfinancial|scholarships|versicherung|xn--3e0b707e|xn--45br5cyl|xn--4dbrk0ce|xn--80adxhks|xn--80asehdb|xn--8y0a063a|xn--gckr3f0f|xn--mgb9awbf|xn--mgbab2bd|xn--mgbgu82a|xn--mgbpl2fh|xn--mgbt3dhd|xn--mk1bu44c|xn--ngbc5azd|xn--ngbe9e0a|xn--ogbpf8fl|xn--qcka1pmc|accountants|barclaycard|blackfriday|blockbuster|bridgestone|calvinklein|contractors|creditunion|engineering|enterprises|foodnetwork|investments|kerryhotels|lamborghini|motorcycles|olayangroup|photography|playstation|productions|progressive|redumbrella|williamhill|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--2scrj9c|xn--3bst00m|xn--3ds443g|xn--3hcrj9c|xn--42c2d9a|xn--45brj9c|xn--55qw42g|xn--6frz82g|xn--80ao21a|xn--9krt00a|xn--cck2b3b|xn--czr694b|xn--d1acj3b|xn--efvy88h|xn--fct429k|xn--fjq720a|xn--flw351e|xn--g2xx48c|xn--gecrj9c|xn--gk3at1e|xn--h2brj9c|xn--hxt814e|xn--imr513n|xn--j6w193g|xn--jvr189m|xn--kprw13d|xn--kpry57d|xn--mgbbh1a|xn--mgbtx2b|xn--mix891f|xn--nyqy26a|xn--otu796d|xn--pgbs0dh|xn--q9jyb4c|xn--rhqv96g|xn--rovu88b|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--vuq861b|xn--w4rs40l|xn--xhq521b|xn--zfr164b|சிங்கப்பூர்|accountant|apartments|associates|basketball|bnpparibas|boehringer|capitalone|consulting|creditcard|cuisinella|eurovision|extraspace|foundation|healthcare|immobilien|industries|management|mitsubishi|nextdirect|properties|protection|prudential|realestate|republican|restaurant|schaeffler|tatamotors|technology|university|vlaanderen|volkswagen|xn--30rr7y|xn--3pxu8k|xn--45q11c|xn--4gbrim|xn--55qx5d|xn--5tzm5g|xn--80aswg|xn--90a3ac|xn--9dbq2a|xn--9et52u|xn--c2br7g|xn--cg4bki|xn--czrs0t|xn--czru2d|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--io0a7i|xn--kput3i|xn--mxtq1m|xn--o3cw4h|xn--pssy2u|xn--q7ce6a|xn--unup4y|xn--wgbh1c|xn--wgbl6a|xn--y9a3aq|accenture|alfaromeo|allfinanz|amsterdam|analytics|aquarelle|barcelona|bloomberg|christmas|community|directory|education|equipment|fairwinds|financial|firestone|fresenius|frontdoor|furniture|goldpoint|hisamitsu|homedepot|homegoods|homesense|institute|insurance|kuokgroup|lancaster|landrover|lifestyle|marketing|marshalls|melbourne|microsoft|panasonic|passagens|pramerica|richardli|shangrila|solutions|statebank|statefarm|stockholm|travelers|vacations|xn--90ais|xn--c1avg|xn--d1alf|xn--e1a4c|xn--fhbei|xn--j1aef|xn--j1amh|xn--l1acc|xn--ngbrx|xn--nqv7f|xn--p1acf|xn--qxa6a|xn--tckwe|xn--vhquv|yodobashi|موريتانيا|abudhabi|airforce|allstate|attorney|barclays|barefoot|bargains|baseball|boutique|bradesco|broadway|brussels|builders|business|capetown|catering|catholic|cipriani|cityeats|cleaning|clinique|clothing|commbank|computer|delivery|deloitte|democrat|diamonds|discount|discover|download|engineer|ericsson|etisalat|exchange|feedback|fidelity|firmdale|football|frontier|goodyear|grainger|graphics|guardian|hdfcbank|helsinki|holdings|hospital|infiniti|ipiranga|istanbul|jpmorgan|lighting|lundbeck|marriott|maserati|mckinsey|memorial|merckmsd|mortgage|observer|partners|pharmacy|pictures|plumbing|property|redstone|reliance|saarland|samsclub|security|services|shopping|showtime|softbank|software|stcgroup|supplies|training|vanguard|ventures|verisign|woodside|xn--90ae|xn--node|xn--p1ai|xn--qxam|yokohama|السعودية|abogado|academy|agakhan|alibaba|android|athleta|auction|audible|auspost|avianca|banamex|bauhaus|bentley|bestbuy|booking|brother|bugatti|capital|caravan|careers|channel|charity|chintai|citadel|clubmed|college|cologne|comcast|company|compare|contact|cooking|corsica|country|coupons|courses|cricket|cruises|dentist|digital|domains|exposed|express|farmers|fashion|ferrari|ferrero|finance|fishing|fitness|flights|florist|flowers|forsale|frogans|fujitsu|gallery|genting|godaddy|grocery|guitars|hamburg|hangout|hitachi|holiday|hosting|hoteles|hotmail|hyundai|ismaili|jewelry|juniper|kitchen|komatsu|lacaixa|lanxess|lasalle|latrobe|leclerc|limited|lincoln|markets|monster|netbank|netflix|network|neustar|okinawa|oldnavy|organic|origins|philips|pioneer|politie|realtor|recipes|rentals|reviews|rexroth|samsung|sandvik|schmidt|schwarz|science|shiksha|singles|staples|storage|support|surgery|systems|temasek|theater|theatre|tickets|tiffany|toshiba|trading|walmart|wanggou|watches|weather|website|wedding|whoswho|windows|winners|xfinity|yamaxun|youtube|zuerich|католик|اتصالات|البحرين|الجزائر|العليان|پاکستان|كاثوليك|இந்தியா|abarth|abbott|abbvie|africa|agency|airbus|airtel|alipay|alsace|alstom|amazon|anquan|aramco|author|bayern|beauty|berlin|bharti|bostik|boston|broker|camera|career|casino|center|chanel|chrome|church|circle|claims|clinic|coffee|comsec|condos|coupon|credit|cruise|dating|datsun|dealer|degree|dental|design|direct|doctor|dunlop|dupont|durban|emerck|energy|estate|events|expert|family|flickr|futbol|gallup|garden|george|giving|global|google|gratis|health|hermes|hiphop|hockey|hotels|hughes|imamat|insure|intuit|jaguar|joburg|juegos|kaufen|kinder|kindle|kosher|lancia|latino|lawyer|lefrak|living|locker|london|luxury|madrid|maison|makeup|market|mattel|mobile|monash|mormon|moscow|museum|mutual|nagoya|natura|nissan|nissay|norton|nowruz|office|olayan|online|oracle|orange|otsuka|pfizer|photos|physio|pictet|quebec|racing|realty|reisen|repair|report|review|rocher|rogers|ryukyu|safety|sakura|sanofi|school|schule|search|secure|select|shouji|soccer|social|stream|studio|supply|suzuki|swatch|sydney|taipei|taobao|target|tattoo|tennis|tienda|tjmaxx|tkmaxx|toyota|travel|unicom|viajes|viking|villas|virgin|vision|voting|voyage|vuelos|walter|webcam|xihuan|yachts|yandex|zappos|москва|онлайн|ابوظبي|ارامكو|الاردن|المغرب|امارات|فلسطين|مليسيا|भारतम्|இலங்கை|ファッション|actor|adult|aetna|amfam|amica|apple|archi|audio|autos|azure|baidu|beats|bible|bingo|black|boats|bosch|build|canon|cards|chase|cheap|cisco|citic|click|cloud|coach|codes|crown|cymru|dabur|dance|deals|delta|drive|dubai|earth|edeka|email|epson|faith|fedex|final|forex|forum|gallo|games|gifts|gives|glass|globo|gmail|green|gripe|group|gucci|guide|homes|honda|horse|house|hyatt|ikano|irish|jetzt|koeln|kyoto|lamer|lease|legal|lexus|lilly|linde|lipsy|loans|locus|lotte|lotto|macys|mango|media|miami|money|movie|music|nexus|nikon|ninja|nokia|nowtv|omega|osaka|paris|parts|party|phone|photo|pizza|place|poker|praxi|press|prime|promo|quest|radio|rehab|reise|ricoh|rocks|rodeo|rugby|salon|sener|seven|sharp|shell|shoes|skype|sling|smart|smile|solar|space|sport|stada|store|study|style|sucks|swiss|tatar|tires|tirol|tmall|today|tokyo|tools|toray|total|tours|trade|trust|tunes|tushu|ubank|vegas|video|vodka|volvo|wales|watch|weber|weibo|works|world|xerox|yahoo|ישראל|ایران|بازار|بھارت|سودان|سورية|همراه|भारोत|संगठन|বাংলা|భారత్|ഭാരതം|嘉里大酒店|aarp|able|adac|aero|akdn|ally|amex|arab|army|arpa|arte|asda|asia|audi|auto|baby|band|bank|bbva|beer|best|bike|bing|blog|blue|bofa|bond|book|buzz|cafe|call|camp|care|cars|casa|case|cash|cbre|cern|chat|citi|city|club|cool|coop|cyou|data|date|dclk|deal|dell|desi|diet|dish|docs|dvag|erni|fage|fail|fans|farm|fast|fiat|fido|film|fire|fish|flir|food|ford|free|fund|game|gbiz|gent|ggee|gift|gmbh|gold|golf|goog|guge|guru|hair|haus|hdfc|help|here|hgtv|host|hsbc|icbc|ieee|imdb|immo|info|itau|java|jeep|jobs|jprs|kddi|kids|kiwi|kpmg|kred|land|lego|lgbt|lidl|life|like|limo|link|live|loan|loft|love|ltda|luxe|maif|meet|meme|menu|mini|mint|mobi|moda|moto|name|navy|news|next|nico|nike|ollo|open|page|pars|pccw|pics|ping|pink|play|plus|pohl|porn|post|prod|prof|qpon|read|reit|rent|rest|rich|room|rsvp|ruhr|safe|sale|sarl|save|saxo|scot|seat|seek|sexy|shaw|shia|shop|show|silk|sina|site|skin|sncf|sohu|song|sony|spot|star|surf|talk|taxi|team|tech|teva|tiaa|tips|town|toys|tube|vana|visa|viva|vivo|vote|voto|wang|weir|wien|wiki|wine|work|xbox|yoga|zara|zero|zone|дети|сайт|بارت|بيتك|ڀارت|تونس|شبكة|عراق|عمان|موقع|भारत|ভারত|ভাৰত|ਭਾਰਤ|ભારત|ଭାରତ|ಭಾರತ|ලංකා|アマゾン|グーグル|クラウド|ポイント|组织机构|電訊盈科|香格里拉|aaa|abb|abc|aco|ads|aeg|afl|aig|anz|aol|app|art|aws|axa|bar|bbc|bbt|bcg|bcn|bet|bid|bio|biz|bms|bmw|bom|boo|bot|box|buy|bzh|cab|cal|cam|car|cat|cba|cbn|cbs|ceo|cfa|cfd|com|cpa|crs|dad|day|dds|dev|dhl|diy|dnp|dog|dot|dtv|dvr|eat|eco|edu|esq|eus|fan|fit|fly|foo|fox|frl|ftr|fun|fyi|gal|gap|gay|gdn|gea|gle|gmo|gmx|goo|gop|got|gov|hbo|hiv|hkt|hot|how|ibm|ice|icu|ifm|inc|ing|ink|int|ist|itv|jcb|jio|jll|jmp|jnj|jot|joy|kfh|kia|kim|kpn|krd|lat|law|lds|llc|llp|lol|lpl|ltd|man|map|mba|med|men|mil|mit|mlb|mls|mma|moe|moi|mom|mov|msd|mtn|mtr|nab|nba|nec|net|new|nfl|ngo|nhk|now|nra|nrw|ntt|nyc|obi|one|ong|onl|ooo|org|ott|ovh|pay|pet|phd|pid|pin|pnc|pro|pru|pub|pwc|red|ren|ril|rio|rip|run|rwe|sap|sas|sbi|sbs|sca|scb|ses|sew|sex|sfr|ski|sky|soy|spa|srl|stc|tab|tax|tci|tdk|tel|thd|tjx|top|trv|tui|tvs|ubs|uno|uol|ups|vet|vig|vin|vip|wed|win|wme|wow|wtc|wtf|xin|xxx|xyz|you|yun|zip|бел|ком|қаз|мкд|мон|орг|рус|срб|укр|հայ|קום|عرب|قطر|كوم|مصر|कॉम|नेट|คอม|ไทย|ລາວ|ストア|セール|みんな|中文网|亚马逊|天主教|我爱你|新加坡|淡马锡|诺基亚|飞利浦|ac|ad|ae|af|ag|ai|al|am|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|ελ|ευ|бг|ею|рф|გე|닷넷|닷컴|삼성|한국|コム|世界|中信|中国|中國|企业|佛山|信息|健康|八卦|公司|公益|台湾|台灣|商城|商店|商标|嘉里|在线|大拿|娱乐|家電|广东|微博|慈善|手机|招聘|政务|政府|新闻|时尚|書籍|机构|游戏|澳門|点看|移动|网址|网店|网站|网络|联通|谷歌|购物|通販|集团|食品|餐厅|香港)";
var tldRegex = new RegExp("^" + tldRegexStr + "$");
var urlSuffixStartCharsRe = /[\/?#]/;
var urlSuffixAllowedSpecialCharsRe = /[-+&@#/%=~_()|'$*\[\]{}\u2713]/;
var urlSuffixNotAllowedAsLastCharRe = /[?!:,.;^]/;
var httpSchemeRe = /https?:\/\//i;
var httpSchemePrefixRe = new RegExp("^" + httpSchemeRe.source, "i");
var urlSuffixedCharsNotAllowedAtEndRe = new RegExp(urlSuffixNotAllowedAsLastCharRe.source + "$");
var invalidSchemeRe = /^(javascript|vbscript):/i;
var schemeUrlRe = /^[A-Za-z][-.+A-Za-z0-9]*:(\/\/)?([^:/]*)/;
var tldUrlHostRe = /^(?:\/\/)?([^/#?:]+)/;
function isSchemeStartChar(char) {
  return letterRe.test(char);
}
function isSchemeChar(char) {
  return letterRe.test(char) || digitRe.test(char) || char === "+" || char === "-" || char === ".";
}
function isDomainLabelStartChar(char) {
  return alphaNumericAndMarksRe.test(char);
}
function isDomainLabelChar(char) {
  return char === "_" || isDomainLabelStartChar(char);
}
function isPathChar(char) {
  return alphaNumericAndMarksRe.test(char) || urlSuffixAllowedSpecialCharsRe.test(char) || urlSuffixNotAllowedAsLastCharRe.test(char);
}
function isUrlSuffixStartChar(char) {
  return urlSuffixStartCharsRe.test(char);
}
function isKnownTld(tld) {
  return tldRegex.test(tld.toLowerCase());
}
function isValidSchemeUrl(url) {
  if (invalidSchemeRe.test(url)) {
    return false;
  }
  var schemeMatch = url.match(schemeUrlRe);
  if (!schemeMatch) {
    return false;
  }
  var isAuthorityMatch = !!schemeMatch[1];
  var host = schemeMatch[2];
  if (isAuthorityMatch) {
    return true;
  }
  if (host.indexOf(".") === -1 || !letterRe.test(host)) {
    return false;
  }
  return true;
}
function isValidTldMatch(url) {
  var tldUrlHostMatch = url.match(tldUrlHostRe);
  if (!tldUrlHostMatch) {
    return false;
  }
  var host = tldUrlHostMatch[0];
  var hostLabels = host.split(".");
  if (hostLabels.length < 2) {
    return false;
  }
  var tld = hostLabels[hostLabels.length - 1];
  if (!isKnownTld(tld)) {
    return false;
  }
  return true;
}
var ipV4Re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
var ipV4PartRe = /[:/?#]/;
function isValidIpV4Address(url) {
  var ipV4Part = url.split(ipV4PartRe, 1)[0];
  return ipV4Re.test(ipV4Part);
}
var wwwPrefixRegex = /^(https?:\/\/)?(www\.)?/i;
var protocolRelativeRegex = /^\/\//;
var UrlMatch = (
  /** @class */
  function(_super) {
    __extends(UrlMatch2, _super);
    function UrlMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "url";
      _this.url = "";
      _this.urlMatchType = "scheme";
      _this.protocolRelativeMatch = false;
      _this.stripPrefix = {
        scheme: true,
        www: true
      };
      _this.stripTrailingSlash = true;
      _this.decodePercentEncoding = true;
      _this.protocolPrepended = false;
      _this.urlMatchType = cfg.urlMatchType;
      _this.url = cfg.url;
      _this.protocolRelativeMatch = cfg.protocolRelativeMatch;
      _this.stripPrefix = cfg.stripPrefix;
      _this.stripTrailingSlash = cfg.stripTrailingSlash;
      _this.decodePercentEncoding = cfg.decodePercentEncoding;
      return _this;
    }
    UrlMatch2.prototype.getType = function() {
      return "url";
    };
    UrlMatch2.prototype.getUrlMatchType = function() {
      return this.urlMatchType;
    };
    UrlMatch2.prototype.getUrl = function() {
      var url = this.url;
      if (!this.protocolRelativeMatch && this.urlMatchType !== "scheme" && !this.protocolPrepended) {
        url = this.url = "http://" + url;
        this.protocolPrepended = true;
      }
      return url;
    };
    UrlMatch2.prototype.getAnchorHref = function() {
      var url = this.getUrl();
      return url.replace(/&amp;/g, "&");
    };
    UrlMatch2.prototype.getAnchorText = function() {
      var anchorText = this.getMatchedText();
      if (this.protocolRelativeMatch) {
        anchorText = stripProtocolRelativePrefix(anchorText);
      }
      if (this.stripPrefix.scheme) {
        anchorText = stripSchemePrefix(anchorText);
      }
      if (this.stripPrefix.www) {
        anchorText = stripWwwPrefix(anchorText);
      }
      if (this.stripTrailingSlash) {
        anchorText = removeTrailingSlash(anchorText);
      }
      if (this.decodePercentEncoding) {
        anchorText = removePercentEncoding(anchorText);
      }
      return anchorText;
    };
    return UrlMatch2;
  }(AbstractMatch)
);
function stripSchemePrefix(url) {
  return url.replace(httpSchemePrefixRe, "");
}
function stripWwwPrefix(url) {
  return url.replace(wwwPrefixRegex, "$1");
}
function stripProtocolRelativePrefix(text) {
  return text.replace(protocolRelativeRegex, "");
}
function removeTrailingSlash(anchorText) {
  if (anchorText.charAt(anchorText.length - 1) === "/") {
    anchorText = anchorText.slice(0, -1);
  }
  return anchorText;
}
function removePercentEncoding(anchorText) {
  var preProcessedEntityAnchorText = anchorText.replace(/%22/gi, "&quot;").replace(/%26/gi, "&amp;").replace(/%27/gi, "&#39;").replace(/%3C/gi, "&lt;").replace(/%3E/gi, "&gt;");
  try {
    return decodeURIComponent(preProcessedEntityAnchorText);
  } catch (e) {
    return preProcessedEntityAnchorText;
  }
}
var mailtoSchemePrefixRe = /^mailto:/i;
var emailLocalPartCharRegex = new RegExp("[".concat(alphaNumericAndMarksCharsStr, "!#$%&'*+/=?^_`{|}~-]"));
function isEmailLocalPartStartChar(char) {
  return alphaNumericAndMarksRe.test(char);
}
function isEmailLocalPartChar(char) {
  return emailLocalPartCharRegex.test(char);
}
function isValidEmail(emailAddress) {
  var emailAddressTld = emailAddress.split(".").pop() || "";
  return isKnownTld(emailAddressTld);
}
var EmailMatch = (
  /** @class */
  function(_super) {
    __extends(EmailMatch2, _super);
    function EmailMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "email";
      _this.email = "";
      _this.email = cfg.email;
      return _this;
    }
    EmailMatch2.prototype.getType = function() {
      return "email";
    };
    EmailMatch2.prototype.getEmail = function() {
      return this.email;
    };
    EmailMatch2.prototype.getAnchorHref = function() {
      return "mailto:" + this.email;
    };
    EmailMatch2.prototype.getAnchorText = function() {
      return this.email;
    };
    return EmailMatch2;
  }(AbstractMatch)
);
function isHashtagTextChar(char) {
  return char === "_" || alphaNumericAndMarksRe.test(char);
}
function isValidHashtag(hashtag) {
  return hashtag.length <= 140;
}
var hashtagServices = ["twitter", "facebook", "instagram", "tiktok"];
var HashtagMatch = (
  /** @class */
  function(_super) {
    __extends(HashtagMatch2, _super);
    function HashtagMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "hashtag";
      _this.serviceName = "twitter";
      _this.hashtag = "";
      _this.serviceName = cfg.serviceName;
      _this.hashtag = cfg.hashtag;
      return _this;
    }
    HashtagMatch2.prototype.getType = function() {
      return "hashtag";
    };
    HashtagMatch2.prototype.getServiceName = function() {
      return this.serviceName;
    };
    HashtagMatch2.prototype.getHashtag = function() {
      return this.hashtag;
    };
    HashtagMatch2.prototype.getAnchorHref = function() {
      var serviceName = this.serviceName, hashtag = this.hashtag;
      switch (serviceName) {
        case "twitter":
          return "https://twitter.com/hashtag/" + hashtag;
        case "facebook":
          return "https://www.facebook.com/hashtag/" + hashtag;
        case "instagram":
          return "https://instagram.com/explore/tags/" + hashtag;
        case "tiktok":
          return "https://www.tiktok.com/tag/" + hashtag;
        default:
          assertNever(serviceName);
          throw new Error("Invalid hashtag service: ".concat(serviceName));
      }
    };
    HashtagMatch2.prototype.getAnchorText = function() {
      return "#" + this.hashtag;
    };
    HashtagMatch2.prototype.getCssClassSuffixes = function() {
      var cssClassSuffixes = _super.prototype.getCssClassSuffixes.call(this), serviceName = this.getServiceName();
      if (serviceName) {
        cssClassSuffixes.push(serviceName);
      }
      return cssClassSuffixes;
    };
    return HashtagMatch2;
  }(AbstractMatch)
);
var mentionRegexes = {
  twitter: /^@\w{1,15}$/,
  instagram: /^@[_\w]{1,30}$/,
  soundcloud: /^@[-a-z0-9_]{3,25}$/,
  // TikTok usernames are 1-24 characters containing letters, numbers, underscores
  // and periods, but cannot end in a period: https://support.tiktok.com/en/getting-started/setting-up-your-profile/changing-your-username
  tiktok: /^@[.\w]{1,23}[\w]$/
};
var mentionTextCharRe = /[-\w.]/;
function isMentionTextChar(char) {
  return mentionTextCharRe.test(char);
}
function isValidMention(mention, serviceName) {
  var re = mentionRegexes[serviceName];
  return re.test(mention);
}
var mentionServices = ["twitter", "instagram", "soundcloud", "tiktok"];
var MentionMatch = (
  /** @class */
  function(_super) {
    __extends(MentionMatch2, _super);
    function MentionMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "mention";
      _this.serviceName = "twitter";
      _this.mention = "";
      _this.mention = cfg.mention;
      _this.serviceName = cfg.serviceName;
      return _this;
    }
    MentionMatch2.prototype.getType = function() {
      return "mention";
    };
    MentionMatch2.prototype.getMention = function() {
      return this.mention;
    };
    MentionMatch2.prototype.getServiceName = function() {
      return this.serviceName;
    };
    MentionMatch2.prototype.getAnchorHref = function() {
      switch (this.serviceName) {
        case "twitter":
          return "https://twitter.com/" + this.mention;
        case "instagram":
          return "https://instagram.com/" + this.mention;
        case "soundcloud":
          return "https://soundcloud.com/" + this.mention;
        case "tiktok":
          return "https://www.tiktok.com/@" + this.mention;
        default:
          throw new Error("Unknown service name to point mention to: " + this.serviceName);
      }
    };
    MentionMatch2.prototype.getAnchorText = function() {
      return "@" + this.mention;
    };
    MentionMatch2.prototype.getCssClassSuffixes = function() {
      var cssClassSuffixes = _super.prototype.getCssClassSuffixes.call(this), serviceName = this.getServiceName();
      if (serviceName) {
        cssClassSuffixes.push(serviceName);
      }
      return cssClassSuffixes;
    };
    return MentionMatch2;
  }(AbstractMatch)
);
var separatorCharRe = /[-. ]/;
var hasDelimCharsRe = /[-. ()]/;
var controlCharRe = /[,;]/;
var mostPhoneNumbers = /(?:(?:(?:(\+)?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4})|(?:(\+)(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)[-. ]?(?:\d[-. ]?){6,12}\d+))([,;]+[0-9]+#?)*/;
var japanesePhoneRe = /(0([1-9]-?[1-9]\d{3}|[1-9]{2}-?\d{3}|[1-9]{2}\d{1}-?\d{2}|[1-9]{2}\d{2}-?\d{1})-?\d{4}|0[789]0-?\d{4}-?\d{4}|050-?\d{4}-?\d{4})/;
var validPhoneNumberRe = new RegExp("^".concat(mostPhoneNumbers.source, "|").concat(japanesePhoneRe.source, "$"));
function isPhoneNumberSeparatorChar(char) {
  return separatorCharRe.test(char);
}
function isPhoneNumberControlChar(char) {
  return controlCharRe.test(char);
}
function isValidPhoneNumber(phoneNumberText) {
  var hasDelimiters = phoneNumberText.charAt(0) === "+" || hasDelimCharsRe.test(phoneNumberText);
  return hasDelimiters && validPhoneNumberRe.test(phoneNumberText);
}
var PhoneMatch = (
  /** @class */
  function(_super) {
    __extends(PhoneMatch2, _super);
    function PhoneMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "phone";
      _this.number = "";
      _this.plusSign = false;
      _this.number = cfg.number;
      _this.plusSign = cfg.plusSign;
      return _this;
    }
    PhoneMatch2.prototype.getType = function() {
      return "phone";
    };
    PhoneMatch2.prototype.getPhoneNumber = function() {
      return this.number;
    };
    PhoneMatch2.prototype.getNumber = function() {
      return this.getPhoneNumber();
    };
    PhoneMatch2.prototype.getAnchorHref = function() {
      return "tel:" + (this.plusSign ? "+" : "") + this.number;
    };
    PhoneMatch2.prototype.getAnchorText = function() {
      return this.matchedText;
    };
    return PhoneMatch2;
  }(AbstractMatch)
);
function parseMatches(text, args) {
  var tagBuilder = args.tagBuilder;
  var stripPrefix = args.stripPrefix;
  var stripTrailingSlash = args.stripTrailingSlash;
  var decodePercentEncoding = args.decodePercentEncoding;
  var hashtagServiceName = args.hashtagServiceName;
  var mentionServiceName = args.mentionServiceName;
  var matches = [];
  var textLen = text.length;
  var stateMachines = [];
  var charIdx = 0;
  for (; charIdx < textLen; charIdx++) {
    var char = text.charAt(charIdx);
    if (stateMachines.length === 0) {
      stateNoMatch(char);
    } else {
      for (var stateIdx = stateMachines.length - 1; stateIdx >= 0; stateIdx--) {
        var stateMachine = stateMachines[stateIdx];
        switch (stateMachine.state) {
          case 11:
            stateProtocolRelativeSlash1(stateMachine, char);
            break;
          case 12:
            stateProtocolRelativeSlash2(stateMachine, char);
            break;
          case 0:
            stateSchemeChar(stateMachine, char);
            break;
          case 1:
            stateSchemeHyphen(stateMachine, char);
            break;
          case 2:
            stateSchemeColon(stateMachine, char);
            break;
          case 3:
            stateSchemeSlash1(stateMachine, char);
            break;
          case 4:
            stateSchemeSlash2(stateMachine, char);
            break;
          case 5:
            stateDomainLabelChar(stateMachine, char);
            break;
          case 6:
            stateDomainHyphen(stateMachine, char);
            break;
          case 7:
            stateDomainDot(stateMachine, char);
            break;
          case 13:
            stateIpV4Digit(stateMachine, char);
            break;
          case 14:
            stateIPv4Dot(stateMachine, char);
            break;
          case 8:
            statePortColon(stateMachine, char);
            break;
          case 9:
            statePortNumber(stateMachine, char);
            break;
          case 10:
            statePath(stateMachine, char);
            break;
          case 15:
            stateEmailMailto_M(stateMachine, char);
            break;
          case 16:
            stateEmailMailto_A(stateMachine, char);
            break;
          case 17:
            stateEmailMailto_I(stateMachine, char);
            break;
          case 18:
            stateEmailMailto_L(stateMachine, char);
            break;
          case 19:
            stateEmailMailto_T(stateMachine, char);
            break;
          case 20:
            stateEmailMailto_O(stateMachine, char);
            break;
          case 21:
            stateEmailMailtoColon(stateMachine, char);
            break;
          case 22:
            stateEmailLocalPart(stateMachine, char);
            break;
          case 23:
            stateEmailLocalPartDot(stateMachine, char);
            break;
          case 24:
            stateEmailAtSign(stateMachine, char);
            break;
          case 25:
            stateEmailDomainChar(stateMachine, char);
            break;
          case 26:
            stateEmailDomainHyphen(stateMachine, char);
            break;
          case 27:
            stateEmailDomainDot(stateMachine, char);
            break;
          case 28:
            stateHashtagHashChar(stateMachine, char);
            break;
          case 29:
            stateHashtagTextChar(stateMachine, char);
            break;
          case 30:
            stateMentionAtChar(stateMachine, char);
            break;
          case 31:
            stateMentionTextChar(stateMachine, char);
            break;
          case 32:
            statePhoneNumberOpenParen(stateMachine, char);
            break;
          case 33:
            statePhoneNumberAreaCodeDigit1(stateMachine, char);
            break;
          case 34:
            statePhoneNumberAreaCodeDigit2(stateMachine, char);
            break;
          case 35:
            statePhoneNumberAreaCodeDigit3(stateMachine, char);
            break;
          case 36:
            statePhoneNumberCloseParen(stateMachine, char);
            break;
          case 37:
            statePhoneNumberPlus(stateMachine, char);
            break;
          case 38:
            statePhoneNumberDigit(stateMachine, char);
            break;
          case 39:
            statePhoneNumberSeparator(stateMachine, char);
            break;
          case 40:
            statePhoneNumberControlChar(stateMachine, char);
            break;
          case 41:
            statePhoneNumberPoundChar(stateMachine, char);
            break;
          default:
            assertNever(stateMachine.state);
        }
      }
    }
  }
  for (var i = stateMachines.length - 1; i >= 0; i--) {
    stateMachines.forEach(function(stateMachine2) {
      return captureMatchIfValidAndRemove(stateMachine2);
    });
  }
  return matches;
  function stateNoMatch(char2) {
    if (char2 === "#") {
      stateMachines.push(createHashtagStateMachine(
        charIdx,
        28
        /* HashtagHashChar */
      ));
    } else if (char2 === "@") {
      stateMachines.push(createMentionStateMachine(
        charIdx,
        30
        /* MentionAtChar */
      ));
    } else if (char2 === "/") {
      stateMachines.push(createTldUrlStateMachine(
        charIdx,
        11
        /* ProtocolRelativeSlash1 */
      ));
    } else if (char2 === "+") {
      stateMachines.push(createPhoneNumberStateMachine(
        charIdx,
        37
        /* PhoneNumberPlus */
      ));
    } else if (char2 === "(") {
      stateMachines.push(createPhoneNumberStateMachine(
        charIdx,
        32
        /* PhoneNumberOpenParen */
      ));
    } else {
      if (digitRe.test(char2)) {
        stateMachines.push(createPhoneNumberStateMachine(
          charIdx,
          38
          /* PhoneNumberDigit */
        ));
        stateMachines.push(createIpV4UrlStateMachine(
          charIdx,
          13
          /* IpV4Digit */
        ));
      }
      if (isEmailLocalPartStartChar(char2)) {
        var startState = char2.toLowerCase() === "m" ? 15 : 22;
        stateMachines.push(createEmailStateMachine(charIdx, startState));
      }
      if (isSchemeStartChar(char2)) {
        stateMachines.push(createSchemeUrlStateMachine(
          charIdx,
          0
          /* SchemeChar */
        ));
      }
      if (alphaNumericAndMarksRe.test(char2)) {
        stateMachines.push(createTldUrlStateMachine(
          charIdx,
          5
          /* DomainLabelChar */
        ));
      }
    }
  }
  function stateSchemeChar(stateMachine2, char2) {
    if (char2 === ":") {
      stateMachine2.state = 2;
    } else if (char2 === "-") {
      stateMachine2.state = 1;
    } else if (isSchemeChar(char2))
      ;
    else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateSchemeHyphen(stateMachine2, char2) {
    if (char2 === "-")
      ;
    else if (char2 === "/") {
      remove(stateMachines, stateMachine2);
      stateMachines.push(createTldUrlStateMachine(
        charIdx,
        11
        /* ProtocolRelativeSlash1 */
      ));
    } else if (isSchemeChar(char2)) {
      stateMachine2.state = 0;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateSchemeColon(stateMachine2, char2) {
    if (char2 === "/") {
      stateMachine2.state = 3;
    } else if (char2 === ".") {
      remove(stateMachines, stateMachine2);
    } else if (isDomainLabelStartChar(char2)) {
      stateMachine2.state = 5;
      if (isSchemeStartChar(char2)) {
        stateMachines.push(createSchemeUrlStateMachine(
          charIdx,
          0
          /* SchemeChar */
        ));
      }
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateSchemeSlash1(stateMachine2, char2) {
    if (char2 === "/") {
      stateMachine2.state = 4;
    } else if (isPathChar(char2)) {
      stateMachine2.state = 10;
      stateMachine2.acceptStateReached = true;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateSchemeSlash2(stateMachine2, char2) {
    if (char2 === "/") {
      stateMachine2.state = 10;
    } else if (isDomainLabelStartChar(char2)) {
      stateMachine2.state = 5;
      stateMachine2.acceptStateReached = true;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateProtocolRelativeSlash1(stateMachine2, char2) {
    if (char2 === "/") {
      stateMachine2.state = 12;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateProtocolRelativeSlash2(stateMachine2, char2) {
    if (isDomainLabelStartChar(char2)) {
      stateMachine2.state = 5;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateDomainLabelChar(stateMachine2, char2) {
    if (char2 === ".") {
      stateMachine2.state = 7;
    } else if (char2 === "-") {
      stateMachine2.state = 6;
    } else if (char2 === ":") {
      stateMachine2.state = 8;
    } else if (isUrlSuffixStartChar(char2)) {
      stateMachine2.state = 10;
    } else if (isDomainLabelChar(char2))
      ;
    else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateDomainHyphen(stateMachine2, char2) {
    if (char2 === "-")
      ;
    else if (char2 === ".") {
      captureMatchIfValidAndRemove(stateMachine2);
    } else if (isDomainLabelStartChar(char2)) {
      stateMachine2.state = 5;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateDomainDot(stateMachine2, char2) {
    if (char2 === ".") {
      captureMatchIfValidAndRemove(stateMachine2);
    } else if (isDomainLabelStartChar(char2)) {
      stateMachine2.state = 5;
      stateMachine2.acceptStateReached = true;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateIpV4Digit(stateMachine2, char2) {
    if (char2 === ".") {
      stateMachine2.state = 14;
    } else if (char2 === ":") {
      stateMachine2.state = 8;
    } else if (digitRe.test(char2))
      ;
    else if (isUrlSuffixStartChar(char2)) {
      stateMachine2.state = 10;
    } else if (alphaNumericAndMarksRe.test(char2)) {
      remove(stateMachines, stateMachine2);
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateIPv4Dot(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.octetsEncountered++;
      if (stateMachine2.octetsEncountered === 4) {
        stateMachine2.acceptStateReached = true;
      }
      stateMachine2.state = 13;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function statePortColon(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.state = 9;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function statePortNumber(stateMachine2, char2) {
    if (digitRe.test(char2))
      ;
    else if (isUrlSuffixStartChar(char2)) {
      stateMachine2.state = 10;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function statePath(stateMachine2, char2) {
    if (isPathChar(char2))
      ;
    else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateEmailMailto_M(stateMachine2, char2) {
    if (char2.toLowerCase() === "a") {
      stateMachine2.state = 16;
    } else {
      stateEmailLocalPart(stateMachine2, char2);
    }
  }
  function stateEmailMailto_A(stateMachine2, char2) {
    if (char2.toLowerCase() === "i") {
      stateMachine2.state = 17;
    } else {
      stateEmailLocalPart(stateMachine2, char2);
    }
  }
  function stateEmailMailto_I(stateMachine2, char2) {
    if (char2.toLowerCase() === "l") {
      stateMachine2.state = 18;
    } else {
      stateEmailLocalPart(stateMachine2, char2);
    }
  }
  function stateEmailMailto_L(stateMachine2, char2) {
    if (char2.toLowerCase() === "t") {
      stateMachine2.state = 19;
    } else {
      stateEmailLocalPart(stateMachine2, char2);
    }
  }
  function stateEmailMailto_T(stateMachine2, char2) {
    if (char2.toLowerCase() === "o") {
      stateMachine2.state = 20;
    } else {
      stateEmailLocalPart(stateMachine2, char2);
    }
  }
  function stateEmailMailto_O(stateMachine2, char2) {
    if (char2.toLowerCase() === ":") {
      stateMachine2.state = 21;
    } else {
      stateEmailLocalPart(stateMachine2, char2);
    }
  }
  function stateEmailMailtoColon(stateMachine2, char2) {
    if (isEmailLocalPartChar(char2)) {
      stateMachine2.state = 22;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateEmailLocalPart(stateMachine2, char2) {
    if (char2 === ".") {
      stateMachine2.state = 23;
    } else if (char2 === "@") {
      stateMachine2.state = 24;
    } else if (isEmailLocalPartChar(char2)) {
      stateMachine2.state = 22;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateEmailLocalPartDot(stateMachine2, char2) {
    if (char2 === ".") {
      remove(stateMachines, stateMachine2);
    } else if (char2 === "@") {
      remove(stateMachines, stateMachine2);
    } else if (isEmailLocalPartChar(char2)) {
      stateMachine2.state = 22;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateEmailAtSign(stateMachine2, char2) {
    if (isDomainLabelStartChar(char2)) {
      stateMachine2.state = 25;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateEmailDomainChar(stateMachine2, char2) {
    if (char2 === ".") {
      stateMachine2.state = 27;
    } else if (char2 === "-") {
      stateMachine2.state = 26;
    } else if (isDomainLabelChar(char2))
      ;
    else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateEmailDomainHyphen(stateMachine2, char2) {
    if (char2 === "-" || char2 === ".") {
      captureMatchIfValidAndRemove(stateMachine2);
    } else if (isDomainLabelChar(char2)) {
      stateMachine2.state = 25;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateEmailDomainDot(stateMachine2, char2) {
    if (char2 === "." || char2 === "-") {
      captureMatchIfValidAndRemove(stateMachine2);
    } else if (isDomainLabelStartChar(char2)) {
      stateMachine2.state = 25;
      stateMachine2.acceptStateReached = true;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateHashtagHashChar(stateMachine2, char2) {
    if (isHashtagTextChar(char2)) {
      stateMachine2.state = 29;
      stateMachine2.acceptStateReached = true;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateHashtagTextChar(stateMachine2, char2) {
    if (isHashtagTextChar(char2))
      ;
    else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function stateMentionAtChar(stateMachine2, char2) {
    if (isMentionTextChar(char2)) {
      stateMachine2.state = 31;
      stateMachine2.acceptStateReached = true;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function stateMentionTextChar(stateMachine2, char2) {
    if (isMentionTextChar(char2))
      ;
    else if (alphaNumericAndMarksRe.test(char2)) {
      remove(stateMachines, stateMachine2);
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function statePhoneNumberPlus(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.state = 38;
    } else {
      remove(stateMachines, stateMachine2);
      stateNoMatch(char2);
    }
  }
  function statePhoneNumberOpenParen(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.state = 33;
    } else {
      remove(stateMachines, stateMachine2);
    }
    stateNoMatch(char2);
  }
  function statePhoneNumberAreaCodeDigit1(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.state = 34;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function statePhoneNumberAreaCodeDigit2(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.state = 35;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function statePhoneNumberAreaCodeDigit3(stateMachine2, char2) {
    if (char2 === ")") {
      stateMachine2.state = 36;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function statePhoneNumberCloseParen(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.state = 38;
    } else if (isPhoneNumberSeparatorChar(char2)) {
      stateMachine2.state = 39;
    } else {
      remove(stateMachines, stateMachine2);
    }
  }
  function statePhoneNumberDigit(stateMachine2, char2) {
    stateMachine2.acceptStateReached = true;
    if (isPhoneNumberControlChar(char2)) {
      stateMachine2.state = 40;
    } else if (char2 === "#") {
      stateMachine2.state = 41;
    } else if (digitRe.test(char2))
      ;
    else if (char2 === "(") {
      stateMachine2.state = 32;
    } else if (isPhoneNumberSeparatorChar(char2)) {
      stateMachine2.state = 39;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
      if (isSchemeStartChar(char2)) {
        stateMachines.push(createSchemeUrlStateMachine(
          charIdx,
          0
          /* SchemeChar */
        ));
      }
    }
  }
  function statePhoneNumberSeparator(stateMachine2, char2) {
    if (digitRe.test(char2)) {
      stateMachine2.state = 38;
    } else if (char2 === "(") {
      stateMachine2.state = 32;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
      stateNoMatch(char2);
    }
  }
  function statePhoneNumberControlChar(stateMachine2, char2) {
    if (isPhoneNumberControlChar(char2))
      ;
    else if (char2 === "#") {
      stateMachine2.state = 41;
    } else if (digitRe.test(char2)) {
      stateMachine2.state = 38;
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function statePhoneNumberPoundChar(stateMachine2, char2) {
    if (isPhoneNumberControlChar(char2)) {
      stateMachine2.state = 40;
    } else if (digitRe.test(char2)) {
      remove(stateMachines, stateMachine2);
    } else {
      captureMatchIfValidAndRemove(stateMachine2);
    }
  }
  function captureMatchIfValidAndRemove(stateMachine2) {
    remove(stateMachines, stateMachine2);
    if (!stateMachine2.acceptStateReached) {
      return;
    }
    var startIdx = stateMachine2.startIdx;
    var matchedText = text.slice(stateMachine2.startIdx, charIdx);
    matchedText = excludeUnbalancedTrailingBracesAndPunctuation(matchedText);
    if (stateMachine2.type === "url") {
      var charBeforeUrlMatch = text.charAt(stateMachine2.startIdx - 1);
      if (charBeforeUrlMatch === "@") {
        return;
      }
      var urlMatchType = stateMachine2.matchType;
      if (urlMatchType === "scheme") {
        var httpSchemeMatch = httpSchemeRe.exec(matchedText);
        if (httpSchemeMatch) {
          startIdx = startIdx + httpSchemeMatch.index;
          matchedText = matchedText.slice(httpSchemeMatch.index);
        }
        if (!isValidSchemeUrl(matchedText)) {
          return;
        }
      } else if (urlMatchType === "tld") {
        if (!isValidTldMatch(matchedText)) {
          return;
        }
      } else if (urlMatchType === "ipV4") {
        if (!isValidIpV4Address(matchedText)) {
          return;
        }
      } else {
        assertNever(urlMatchType);
      }
      matches.push(new UrlMatch({
        tagBuilder,
        matchedText,
        offset: startIdx,
        urlMatchType,
        url: matchedText,
        protocolRelativeMatch: matchedText.slice(0, 2) === "//",
        // TODO: Do these settings need to be passed to the match,
        // or should we handle them here in UrlMatcher?
        stripPrefix,
        stripTrailingSlash,
        decodePercentEncoding
      }));
    } else if (stateMachine2.type === "email") {
      if (isValidEmail(matchedText)) {
        matches.push(new EmailMatch({
          tagBuilder,
          matchedText,
          offset: startIdx,
          email: matchedText.replace(mailtoSchemePrefixRe, "")
        }));
      }
    } else if (stateMachine2.type === "hashtag") {
      if (isValidHashtag(matchedText)) {
        matches.push(new HashtagMatch({
          tagBuilder,
          matchedText,
          offset: startIdx,
          serviceName: hashtagServiceName,
          hashtag: matchedText.slice(1)
        }));
      }
    } else if (stateMachine2.type === "mention") {
      if (isValidMention(matchedText, mentionServiceName)) {
        matches.push(new MentionMatch({
          tagBuilder,
          matchedText,
          offset: startIdx,
          serviceName: mentionServiceName,
          mention: matchedText.slice(1)
          // strip off the '@' character at the beginning
        }));
      }
    } else if (stateMachine2.type === "phone") {
      matchedText = matchedText.replace(/ +$/g, "");
      if (isValidPhoneNumber(matchedText)) {
        var cleanNumber = matchedText.replace(/[^0-9,;#]/g, "");
        matches.push(new PhoneMatch({
          tagBuilder,
          matchedText,
          offset: startIdx,
          number: cleanNumber,
          plusSign: matchedText.charAt(0) === "+"
        }));
      }
    } else {
      assertNever(stateMachine2);
    }
  }
}
var openBraceRe = /[\(\{\[]/;
var closeBraceRe = /[\)\}\]]/;
var oppositeBrace = {
  ")": "(",
  "}": "{",
  "]": "["
};
function excludeUnbalancedTrailingBracesAndPunctuation(matchedText) {
  var braceCounts = {
    "(": 0,
    "{": 0,
    "[": 0
  };
  for (var i = 0; i < matchedText.length; i++) {
    var char_1 = matchedText.charAt(i);
    if (openBraceRe.test(char_1)) {
      braceCounts[char_1]++;
    } else if (closeBraceRe.test(char_1)) {
      braceCounts[oppositeBrace[char_1]]--;
    }
  }
  var endIdx = matchedText.length - 1;
  var char;
  while (endIdx >= 0) {
    char = matchedText.charAt(endIdx);
    if (closeBraceRe.test(char)) {
      var oppositeBraceChar = oppositeBrace[char];
      if (braceCounts[oppositeBraceChar] < 0) {
        braceCounts[oppositeBraceChar]++;
        endIdx--;
      } else {
        break;
      }
    } else if (urlSuffixedCharsNotAllowedAtEndRe.test(char)) {
      endIdx--;
    } else {
      break;
    }
  }
  return matchedText.slice(0, endIdx + 1);
}
function createSchemeUrlStateMachine(startIdx, state2) {
  return {
    type: "url",
    startIdx,
    state: state2,
    acceptStateReached: false,
    matchType: "scheme"
  };
}
function createTldUrlStateMachine(startIdx, state2) {
  return {
    type: "url",
    startIdx,
    state: state2,
    acceptStateReached: false,
    matchType: "tld"
  };
}
function createIpV4UrlStateMachine(startIdx, state2) {
  return {
    type: "url",
    startIdx,
    state: state2,
    acceptStateReached: false,
    matchType: "ipV4",
    octetsEncountered: 1
    // starts at 1 because we create this machine when encountering the first octet
  };
}
function createEmailStateMachine(startIdx, state2) {
  return {
    type: "email",
    startIdx,
    state: state2,
    acceptStateReached: false
  };
}
function createHashtagStateMachine(startIdx, state2) {
  return {
    type: "hashtag",
    startIdx,
    state: state2,
    acceptStateReached: false
  };
}
function createMentionStateMachine(startIdx, state2) {
  return {
    type: "mention",
    startIdx,
    state: state2,
    acceptStateReached: false
  };
}
function createPhoneNumberStateMachine(startIdx, state2) {
  return {
    type: "phone",
    startIdx,
    state: state2,
    acceptStateReached: false
  };
}
function parseHtml(html, _a) {
  var onOpenTag = _a.onOpenTag, onCloseTag = _a.onCloseTag, onText = _a.onText, onComment = _a.onComment, onDoctype = _a.onDoctype;
  var noCurrentTag = new CurrentTag();
  var charIdx = 0, len = html.length, state2 = 0, currentDataIdx = 0, currentTag = noCurrentTag;
  while (charIdx < len) {
    var char = html.charAt(charIdx);
    switch (state2) {
      case 0:
        stateData(char);
        break;
      case 1:
        stateTagOpen(char);
        break;
      case 2:
        stateEndTagOpen(char);
        break;
      case 3:
        stateTagName(char);
        break;
      case 4:
        stateBeforeAttributeName(char);
        break;
      case 5:
        stateAttributeName(char);
        break;
      case 6:
        stateAfterAttributeName(char);
        break;
      case 7:
        stateBeforeAttributeValue(char);
        break;
      case 8:
        stateAttributeValueDoubleQuoted(char);
        break;
      case 9:
        stateAttributeValueSingleQuoted(char);
        break;
      case 10:
        stateAttributeValueUnquoted(char);
        break;
      case 11:
        stateAfterAttributeValueQuoted(char);
        break;
      case 12:
        stateSelfClosingStartTag(char);
        break;
      case 13:
        stateMarkupDeclarationOpen();
        break;
      case 14:
        stateCommentStart(char);
        break;
      case 15:
        stateCommentStartDash(char);
        break;
      case 16:
        stateComment(char);
        break;
      case 17:
        stateCommentEndDash(char);
        break;
      case 18:
        stateCommentEnd(char);
        break;
      case 19:
        stateCommentEndBang(char);
        break;
      case 20:
        stateDoctype(char);
        break;
      default:
        assertNever(state2);
    }
    charIdx++;
  }
  if (currentDataIdx < charIdx) {
    emitText();
  }
  function stateData(char2) {
    if (char2 === "<") {
      startNewTag();
    }
  }
  function stateTagOpen(char2) {
    if (char2 === "!") {
      state2 = 13;
    } else if (char2 === "/") {
      state2 = 2;
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { isClosing: true }));
    } else if (char2 === "<") {
      startNewTag();
    } else if (letterRe.test(char2)) {
      state2 = 3;
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { isOpening: true }));
    } else {
      state2 = 0;
      currentTag = noCurrentTag;
    }
  }
  function stateTagName(char2) {
    if (whitespaceRe.test(char2)) {
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { name: captureTagName() }));
      state2 = 4;
    } else if (char2 === "<") {
      startNewTag();
    } else if (char2 === "/") {
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { name: captureTagName() }));
      state2 = 12;
    } else if (char2 === ">") {
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { name: captureTagName() }));
      emitTagAndPreviousTextNode();
    } else if (!letterRe.test(char2) && !digitRe.test(char2) && char2 !== ":") {
      resetToDataState();
    } else
      ;
  }
  function stateEndTagOpen(char2) {
    if (char2 === ">") {
      resetToDataState();
    } else if (letterRe.test(char2)) {
      state2 = 3;
    } else {
      resetToDataState();
    }
  }
  function stateBeforeAttributeName(char2) {
    if (whitespaceRe.test(char2))
      ;
    else if (char2 === "/") {
      state2 = 12;
    } else if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else if (char2 === "<") {
      startNewTag();
    } else if (char2 === "=" || quoteRe.test(char2) || controlCharsRe.test(char2)) {
      resetToDataState();
    } else {
      state2 = 5;
    }
  }
  function stateAttributeName(char2) {
    if (whitespaceRe.test(char2)) {
      state2 = 6;
    } else if (char2 === "/") {
      state2 = 12;
    } else if (char2 === "=") {
      state2 = 7;
    } else if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else if (char2 === "<") {
      startNewTag();
    } else if (quoteRe.test(char2)) {
      resetToDataState();
    } else
      ;
  }
  function stateAfterAttributeName(char2) {
    if (whitespaceRe.test(char2))
      ;
    else if (char2 === "/") {
      state2 = 12;
    } else if (char2 === "=") {
      state2 = 7;
    } else if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else if (char2 === "<") {
      startNewTag();
    } else if (quoteRe.test(char2)) {
      resetToDataState();
    } else {
      state2 = 5;
    }
  }
  function stateBeforeAttributeValue(char2) {
    if (whitespaceRe.test(char2))
      ;
    else if (char2 === '"') {
      state2 = 8;
    } else if (char2 === "'") {
      state2 = 9;
    } else if (/[>=`]/.test(char2)) {
      resetToDataState();
    } else if (char2 === "<") {
      startNewTag();
    } else {
      state2 = 10;
    }
  }
  function stateAttributeValueDoubleQuoted(char2) {
    if (char2 === '"') {
      state2 = 11;
    }
  }
  function stateAttributeValueSingleQuoted(char2) {
    if (char2 === "'") {
      state2 = 11;
    }
  }
  function stateAttributeValueUnquoted(char2) {
    if (whitespaceRe.test(char2)) {
      state2 = 4;
    } else if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else if (char2 === "<") {
      startNewTag();
    } else
      ;
  }
  function stateAfterAttributeValueQuoted(char2) {
    if (whitespaceRe.test(char2)) {
      state2 = 4;
    } else if (char2 === "/") {
      state2 = 12;
    } else if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else if (char2 === "<") {
      startNewTag();
    } else {
      state2 = 4;
      reconsumeCurrentCharacter();
    }
  }
  function stateSelfClosingStartTag(char2) {
    if (char2 === ">") {
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { isClosing: true }));
      emitTagAndPreviousTextNode();
    } else {
      state2 = 4;
    }
  }
  function stateMarkupDeclarationOpen(char2) {
    if (html.substr(charIdx, 2) === "--") {
      charIdx += 2;
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { type: "comment" }));
      state2 = 14;
    } else if (html.substr(charIdx, 7).toUpperCase() === "DOCTYPE") {
      charIdx += 7;
      currentTag = new CurrentTag(__assign(__assign({}, currentTag), { type: "doctype" }));
      state2 = 20;
    } else {
      resetToDataState();
    }
  }
  function stateCommentStart(char2) {
    if (char2 === "-") {
      state2 = 15;
    } else if (char2 === ">") {
      resetToDataState();
    } else {
      state2 = 16;
    }
  }
  function stateCommentStartDash(char2) {
    if (char2 === "-") {
      state2 = 18;
    } else if (char2 === ">") {
      resetToDataState();
    } else {
      state2 = 16;
    }
  }
  function stateComment(char2) {
    if (char2 === "-") {
      state2 = 17;
    }
  }
  function stateCommentEndDash(char2) {
    if (char2 === "-") {
      state2 = 18;
    } else {
      state2 = 16;
    }
  }
  function stateCommentEnd(char2) {
    if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else if (char2 === "!") {
      state2 = 19;
    } else if (char2 === "-")
      ;
    else {
      state2 = 16;
    }
  }
  function stateCommentEndBang(char2) {
    if (char2 === "-") {
      state2 = 17;
    } else if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else {
      state2 = 16;
    }
  }
  function stateDoctype(char2) {
    if (char2 === ">") {
      emitTagAndPreviousTextNode();
    } else if (char2 === "<") {
      startNewTag();
    } else
      ;
  }
  function resetToDataState() {
    state2 = 0;
    currentTag = noCurrentTag;
  }
  function startNewTag() {
    state2 = 1;
    currentTag = new CurrentTag({ idx: charIdx });
  }
  function emitTagAndPreviousTextNode() {
    var textBeforeTag = html.slice(currentDataIdx, currentTag.idx);
    if (textBeforeTag) {
      onText(textBeforeTag, currentDataIdx);
    }
    if (currentTag.type === "comment") {
      onComment(currentTag.idx);
    } else if (currentTag.type === "doctype") {
      onDoctype(currentTag.idx);
    } else {
      if (currentTag.isOpening) {
        onOpenTag(currentTag.name, currentTag.idx);
      }
      if (currentTag.isClosing) {
        onCloseTag(currentTag.name, currentTag.idx);
      }
    }
    resetToDataState();
    currentDataIdx = charIdx + 1;
  }
  function emitText() {
    var text = html.slice(currentDataIdx, charIdx);
    onText(text, currentDataIdx);
    currentDataIdx = charIdx + 1;
  }
  function captureTagName() {
    var startIdx = currentTag.idx + (currentTag.isClosing ? 2 : 1);
    return html.slice(startIdx, charIdx).toLowerCase();
  }
  function reconsumeCurrentCharacter() {
    charIdx--;
  }
}
var CurrentTag = (
  /** @class */
  /* @__PURE__ */ function() {
    function CurrentTag2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.idx = cfg.idx !== void 0 ? cfg.idx : -1;
      this.type = cfg.type || "tag";
      this.name = cfg.name || "";
      this.isOpening = !!cfg.isOpening;
      this.isClosing = !!cfg.isClosing;
    }
    return CurrentTag2;
  }()
);
var Autolinker = (
  /** @class */
  function() {
    function Autolinker2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.version = Autolinker2.version;
      this.urls = {};
      this.email = true;
      this.phone = true;
      this.hashtag = false;
      this.mention = false;
      this.newWindow = true;
      this.stripPrefix = {
        scheme: true,
        www: true
      };
      this.stripTrailingSlash = true;
      this.decodePercentEncoding = true;
      this.truncate = {
        length: 0,
        location: "end"
      };
      this.className = "";
      this.replaceFn = null;
      this.context = void 0;
      this.sanitizeHtml = false;
      this.tagBuilder = null;
      this.urls = normalizeUrlsCfg(cfg.urls);
      this.email = isBoolean(cfg.email) ? cfg.email : this.email;
      this.phone = isBoolean(cfg.phone) ? cfg.phone : this.phone;
      this.hashtag = cfg.hashtag || this.hashtag;
      this.mention = cfg.mention || this.mention;
      this.newWindow = isBoolean(cfg.newWindow) ? cfg.newWindow : this.newWindow;
      this.stripPrefix = normalizeStripPrefixCfg(cfg.stripPrefix);
      this.stripTrailingSlash = isBoolean(cfg.stripTrailingSlash) ? cfg.stripTrailingSlash : this.stripTrailingSlash;
      this.decodePercentEncoding = isBoolean(cfg.decodePercentEncoding) ? cfg.decodePercentEncoding : this.decodePercentEncoding;
      this.sanitizeHtml = cfg.sanitizeHtml || false;
      var mention = this.mention;
      if (mention !== false && mentionServices.indexOf(mention) === -1) {
        throw new Error("invalid `mention` cfg '".concat(mention, "' - see docs"));
      }
      var hashtag = this.hashtag;
      if (hashtag !== false && hashtagServices.indexOf(hashtag) === -1) {
        throw new Error("invalid `hashtag` cfg '".concat(hashtag, "' - see docs"));
      }
      this.truncate = normalizeTruncateCfg(cfg.truncate);
      this.className = cfg.className || this.className;
      this.replaceFn = cfg.replaceFn || this.replaceFn;
      this.context = cfg.context || this;
    }
    Autolinker2.link = function(textOrHtml, options) {
      var autolinker = new Autolinker2(options);
      return autolinker.link(textOrHtml);
    };
    Autolinker2.parse = function(textOrHtml, options) {
      var autolinker = new Autolinker2(options);
      return autolinker.parse(textOrHtml);
    };
    Autolinker2.prototype.parse = function(textOrHtml) {
      var _this = this;
      var skipTagNames = ["a", "style", "script"], skipTagsStackCount = 0, matches = [];
      parseHtml(textOrHtml, {
        onOpenTag: function(tagName) {
          if (skipTagNames.indexOf(tagName) >= 0) {
            skipTagsStackCount++;
          }
        },
        onText: function(text, offset2) {
          if (skipTagsStackCount === 0) {
            var htmlCharacterEntitiesRegex = /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi;
            var textSplit = text.split(htmlCharacterEntitiesRegex);
            var currentOffset_1 = offset2;
            textSplit.forEach(function(splitText, i) {
              if (i % 2 === 0) {
                var textNodeMatches = _this.parseText(splitText, currentOffset_1);
                matches.push.apply(matches, textNodeMatches);
              }
              currentOffset_1 += splitText.length;
            });
          }
        },
        onCloseTag: function(tagName) {
          if (skipTagNames.indexOf(tagName) >= 0) {
            skipTagsStackCount = Math.max(skipTagsStackCount - 1, 0);
          }
        },
        onComment: function(_offset) {
        },
        onDoctype: function(_offset) {
        }
        // no need to process doctype nodes
      });
      matches = this.compactMatches(matches);
      matches = this.removeUnwantedMatches(matches);
      return matches;
    };
    Autolinker2.prototype.compactMatches = function(matches) {
      matches.sort(function(a, b) {
        return a.getOffset() - b.getOffset();
      });
      var i = 0;
      while (i < matches.length - 1) {
        var match = matches[i], offset2 = match.getOffset(), matchedTextLength = match.getMatchedText().length, endIdx = offset2 + matchedTextLength;
        if (i + 1 < matches.length) {
          if (matches[i + 1].getOffset() === offset2) {
            var removeIdx = matches[i + 1].getMatchedText().length > matchedTextLength ? i : i + 1;
            matches.splice(removeIdx, 1);
            continue;
          }
          if (matches[i + 1].getOffset() < endIdx) {
            matches.splice(i + 1, 1);
            continue;
          }
        }
        i++;
      }
      return matches;
    };
    Autolinker2.prototype.removeUnwantedMatches = function(matches) {
      if (!this.hashtag)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "hashtag";
        });
      if (!this.email)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "email";
        });
      if (!this.phone)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "phone";
        });
      if (!this.mention)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "mention";
        });
      if (!this.urls.schemeMatches) {
        removeWithPredicate(matches, function(m) {
          return m.getType() === "url" && m.getUrlMatchType() === "scheme";
        });
      }
      if (!this.urls.tldMatches) {
        removeWithPredicate(matches, function(m) {
          return m.getType() === "url" && m.getUrlMatchType() === "tld";
        });
      }
      if (!this.urls.ipV4Matches) {
        removeWithPredicate(matches, function(m) {
          return m.getType() === "url" && m.getUrlMatchType() === "ipV4";
        });
      }
      return matches;
    };
    Autolinker2.prototype.parseText = function(text, offset2) {
      if (offset2 === void 0) {
        offset2 = 0;
      }
      offset2 = offset2 || 0;
      var matches = parseMatches(text, {
        tagBuilder: this.getTagBuilder(),
        stripPrefix: this.stripPrefix,
        stripTrailingSlash: this.stripTrailingSlash,
        decodePercentEncoding: this.decodePercentEncoding,
        hashtagServiceName: this.hashtag,
        mentionServiceName: this.mention || "twitter"
      });
      for (var i = 0, numTextMatches = matches.length; i < numTextMatches; i++) {
        matches[i].setOffset(offset2 + matches[i].getOffset());
      }
      return matches;
    };
    Autolinker2.prototype.link = function(textOrHtml) {
      if (!textOrHtml) {
        return "";
      }
      if (this.sanitizeHtml) {
        textOrHtml = textOrHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      var matches = this.parse(textOrHtml), newHtml = [], lastIndex = 0;
      for (var i = 0, len = matches.length; i < len; i++) {
        var match = matches[i];
        newHtml.push(textOrHtml.substring(lastIndex, match.getOffset()));
        newHtml.push(this.createMatchReturnVal(match));
        lastIndex = match.getOffset() + match.getMatchedText().length;
      }
      newHtml.push(textOrHtml.substring(lastIndex));
      return newHtml.join("");
    };
    Autolinker2.prototype.createMatchReturnVal = function(match) {
      var replaceFnResult;
      if (this.replaceFn) {
        replaceFnResult = this.replaceFn.call(this.context, match);
      }
      if (typeof replaceFnResult === "string") {
        return replaceFnResult;
      } else if (replaceFnResult === false) {
        return match.getMatchedText();
      } else if (replaceFnResult instanceof HtmlTag) {
        return replaceFnResult.toAnchorString();
      } else {
        var anchorTag = match.buildTag();
        return anchorTag.toAnchorString();
      }
    };
    Autolinker2.prototype.getTagBuilder = function() {
      var tagBuilder = this.tagBuilder;
      if (!tagBuilder) {
        tagBuilder = this.tagBuilder = new AnchorTagBuilder({
          newWindow: this.newWindow,
          truncate: this.truncate,
          className: this.className
        });
      }
      return tagBuilder;
    };
    Autolinker2.version = version;
    return Autolinker2;
  }()
);
function normalizeUrlsCfg(urls) {
  if (urls == null)
    urls = true;
  if (isBoolean(urls)) {
    return { schemeMatches: urls, tldMatches: urls, ipV4Matches: urls };
  } else {
    return {
      schemeMatches: isBoolean(urls.schemeMatches) ? urls.schemeMatches : true,
      tldMatches: isBoolean(urls.tldMatches) ? urls.tldMatches : true,
      ipV4Matches: isBoolean(urls.ipV4Matches) ? urls.ipV4Matches : true
    };
  }
}
function normalizeStripPrefixCfg(stripPrefix) {
  if (stripPrefix == null)
    stripPrefix = true;
  if (isBoolean(stripPrefix)) {
    return { scheme: stripPrefix, www: stripPrefix };
  } else {
    return {
      scheme: isBoolean(stripPrefix.scheme) ? stripPrefix.scheme : true,
      www: isBoolean(stripPrefix.www) ? stripPrefix.www : true
    };
  }
}
function normalizeTruncateCfg(truncate) {
  if (typeof truncate === "number") {
    return { length: truncate, location: "end" };
  } else {
    return defaults(truncate || {}, {
      length: Number.POSITIVE_INFINITY,
      location: "end"
    });
  }
}
const defaultTokens = {
  bold: { delimiter: "*", tag: "strong" },
  italic: { delimiter: "/", tag: "em" },
  underline: { delimiter: "_", tag: "u" },
  strike: { delimiter: "~", tag: "del" },
  code: { delimiter: "`", tag: "code" },
  sup: { delimiter: "^", tag: "sup" },
  sub: { delimiter: "¡", tag: "sub" }
};
const openTag = (tag) => `<${tag}>`;
const closeTag = (tag) => `</${tag}>`;
const encloseTag = (text, tag) => `${openTag(tag)}${text}${closeTag(tag)}`;
const parseToken = (text, stopDelimiter) => {
  let index = 0;
  let content = "";
  while (index < text.length && text[index] !== stopDelimiter) {
    content += text[index];
    index++;
  }
  if (index === text.length) {
    return "";
  } else {
    return content;
  }
};
var msgdown = (text, tokens = defaultTokens) => {
  tokens = Object.assign({}, defaultTokens, tokens);
  let html = "";
  let index = 0;
  const consumeChar = () => {
    html += text[index];
    index++;
  };
  const consumeAll = (textRemaining, delimiter) => {
    html += delimiter + textRemaining;
    index += textRemaining.length;
  };
  const consumeToken = (token) => {
    index++;
    if (text[index] === " ") {
      html += token.delimiter;
      consumeChar();
    } else {
      const textRemaining = text.substr(index);
      const tokenContent = parseToken(textRemaining, token.delimiter);
      if (tokenContent.length === 0) {
        consumeAll(textRemaining, token.delimiter);
      } else {
        html += encloseTag(tokenContent, token.tag);
        index += tokenContent.length + 1;
      }
    }
  };
  while (index < text.length) {
    const charCurrent = text[index];
    if (charCurrent === tokens.bold.delimiter) {
      consumeToken(tokens.bold);
    } else if (charCurrent === tokens.italic.delimiter) {
      consumeToken(tokens.italic);
    } else if (charCurrent === tokens.underline.delimiter) {
      consumeToken(tokens.underline);
    } else if (charCurrent === tokens.strike.delimiter) {
      consumeToken(tokens.strike);
    } else if (charCurrent === tokens.code.delimiter) {
      consumeToken(tokens.code);
    } else if (charCurrent === tokens.sup.delimiter) {
      consumeToken(tokens.sup);
    } else if (charCurrent === tokens.sub.delimiter) {
      consumeToken(tokens.sub);
    } else {
      consumeChar();
    }
  }
  return html;
};
const fmt = /* @__PURE__ */ getDefaultExportFromCjs(msgdown);
const _sfc_main$j = {
  components: {
    IconBase,
    IconCross,
    IconEdit
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const attachments = [
      "unknown.pdf",
      "unknown.unknown",
      "https://cdn-icons-png.flaticon.com/128/2659/2659360.png"
    ];
    const attachmentsIcons = (attachmentLink) => {
      return {
        default: "https://cdn-icons-png.flaticon.com/128/2258/2258853.png",
        pdf: "https://cdn-icons-png.flaticon.com/128/337/337946.png",
        png: attachmentLink,
        jpg: attachmentLink,
        jpeg: attachmentLink,
        svg: attachmentLink
      };
    };
    const detectIconForAttachment = (attachmentLink) => {
      const attachmentExtension = attachmentLink.split(".").pop().split("?")[0];
      const attchmentIcon = attachmentsIcons(attachmentLink)[attachmentExtension] ?? attachmentsIcons(attachmentLink).default;
      return attchmentIcon;
    };
    const downloadAttachment = (attachment) => {
      if (attachment.url) {
        var link = document.createElement("a");
        link.target = "_blank";
        link.href = attachment.url;
        link.download = "Download.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    return {
      attachments,
      attachmentsIcons,
      detectIconForAttachment,
      downloadAttachment,
      ...mapState(["showDeletion", "showEdition"])
    };
  },
  computed: {
    messageText() {
      const escaped = htmlEscape(this.message.data.text);
      try {
        return Autolinker.link(this.messageStyling ? fmt(escaped) : escaped, {
          className: "chatLink",
          truncate: { length: 50, location: "smart" }
        });
      } catch (e) {
        console.log(e);
      }
      return escaped;
    },
    me() {
      return this.message.author === "me";
    },
    isEditing() {
      return (store.state.editMessage && store.state.editMessage.id) === this.message.id;
    }
  },
  methods: {
    edit() {
      store.setState("editMessage", this.message);
    }
  }
};
const _hoisted_1$g = ["disabled"];
const _hoisted_2$9 = ["innerHTML"];
const _hoisted_3$7 = {
  key: 1,
  class: "sc-message--edited"
};
const _hoisted_4$4 = { class: "sc-message-atachments" };
const _hoisted_5$1 = ["onClick"];
function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconEdit = resolveComponent("IconEdit");
  const _component_IconBase = resolveComponent("IconBase");
  const _component_IconCross = resolveComponent("IconCross");
  return openBlock(), createElementBlock("div", {
    class: "sc-message--text",
    style: normalizeStyle($props.messageColors)
  }, [
    createBaseVNode("template", null, [
      createBaseVNode("div", {
        class: "sc-message--toolbox",
        style: normalizeStyle({ background: $props.messageColors.backgroundColor })
      }, [
        _ctx.showEdition && $options.me && $props.message.id ? (openBlock(), createElementBlock("button", {
          key: 0,
          disabled: $options.isEditing,
          onClick: _cache[0] || (_cache[0] = (...args) => $options.edit && $options.edit(...args))
        }, [
          createVNode(_component_IconBase, {
            color: $options.isEditing ? "black" : $props.messageColors.color,
            width: "10",
            "icon-name": "edit"
          }, {
            default: withCtx(() => [
              createVNode(_component_IconEdit)
            ]),
            _: 1
          }, 8, ["color"])
        ], 8, _hoisted_1$g)) : createCommentVNode("", true),
        _ctx.showDeletion && $options.me && $props.message.id ? (openBlock(), createElementBlock("button", {
          key: 1,
          onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("remove"))
        }, [
          createVNode(_component_IconBase, {
            color: $props.messageColors.color,
            width: "10",
            "icon-name": "remove"
          }, {
            default: withCtx(() => [
              createVNode(_component_IconCross)
            ]),
            _: 1
          }, 8, ["color"])
        ])) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "text-message-toolbox", {
          message: $props.message,
          me: $options.me
        }, void 0, true)
      ], 4)
    ]),
    renderSlot(_ctx.$slots, "default", {
      message: $props.message,
      messageText: $options.messageText,
      messageColors: $props.messageColors,
      me: $options.me
    }, () => [
      createBaseVNode("p", {
        class: "sc-message--text-content",
        innerHTML: $props.message.data.text
      }, null, 8, _hoisted_2$9),
      $props.message.data.meta ? (openBlock(), createElementBlock("p", {
        key: 0,
        class: "sc-message--meta",
        style: normalizeStyle({ color: $props.messageColors.color })
      }, toDisplayString($props.message.data.meta), 5)) : createCommentVNode("", true),
      $props.message.isEdited ? (openBlock(), createElementBlock("p", _hoisted_3$7, [
        createVNode(_component_IconBase, {
          width: "10",
          "icon-name": "edited"
        }, {
          default: withCtx(() => [
            createVNode(_component_IconEdit)
          ]),
          _: 1
        }),
        createTextVNode(" edited ")
      ])) : createCommentVNode("", true)
    ], true),
    createBaseVNode("div", _hoisted_4$4, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.message.data.attachments, (attachment) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass([
            "attachment-name",
            { "non-clickable-attachment": !attachment.url }
          ]),
          onClick: ($event) => $setup.downloadAttachment(attachment)
        }, toDisplayString(attachment.filename), 11, _hoisted_5$1);
      }), 256))
    ])
  ], 4);
}
const TextMessage = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-eca02fb1"]]);
const _sfc_main$i = {
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  }
};
const _hoisted_1$f = { class: "sc-message--file-icon" };
const _hoisted_2$8 = ["src"];
const _hoisted_3$6 = ["href"];
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "sc-message--file",
    style: normalizeStyle($props.messageColors)
  }, [
    createBaseVNode("div", _hoisted_1$f, [
      createBaseVNode("img", {
        src: $props.data.file.url,
        class: "sc-image"
      }, null, 8, _hoisted_2$8)
    ]),
    createBaseVNode("div", {
      class: "sc-message--file-name",
      style: normalizeStyle($props.messageColors)
    }, [
      createBaseVNode("a", {
        href: $props.data.file.url ? $props.data.file.url : "#",
        target: "_blank"
      }, toDisplayString($props.data.file.name || ""), 9, _hoisted_3$6)
    ], 4),
    createBaseVNode("div", {
      class: "sc-message--file-text",
      style: normalizeStyle($props.messageColors)
    }, [
      createTextVNode(toDisplayString($props.data.text) + " ", 1),
      $props.data.meta ? (openBlock(), createElementBlock("p", {
        key: 0,
        class: "sc-message--meta",
        style: normalizeStyle($props.messageColors)
      }, toDisplayString($props.data.meta), 5)) : createCommentVNode("", true)
    ], 4)
  ], 4);
}
const FileMessage = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h]]);
const _sfc_main$h = {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
const _hoisted_1$e = { class: "sc-message--emoji" };
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$e, toDisplayString($props.data.emoji), 1);
}
const EmojiMessage = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g]]);
const _sfc_main$g = {
  props: {
    messageColors: {
      type: Object,
      required: true
    }
  }
};
const _hoisted_1$d = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_2$7 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_3$5 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_4$3 = [
  _hoisted_1$d,
  _hoisted_2$7,
  _hoisted_3$5
];
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "sc-typing-indicator",
    style: normalizeStyle($props.messageColors)
  }, _hoisted_4$3, 4);
}
const TypingMessage = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f]]);
const _sfc_main$f = {
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  }
};
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "sc-message--system",
    style: normalizeStyle($props.messageColors)
  }, [
    renderSlot(_ctx.$slots, "default", { message: $props.data }, () => [
      createTextVNode(toDisplayString($props.data.text) + " ", 1),
      $props.data.meta ? (openBlock(), createElementBlock("p", {
        key: 0,
        class: "sc-message--meta",
        style: normalizeStyle({ color: $props.messageColors.color })
      }, toDisplayString($props.data.meta), 5)) : createCommentVNode("", true)
    ])
  ], 4);
}
const SystemMessage = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e]]);
const chatIcon = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='-4749.48%20-5020%2035.036%2035.036'%3e%3cdefs%3e%3cstyle%3e.a{fill:none;}.b{fill:%234e8cff;}.c{clip-path:url(%23a);}.d{fill:%23fff;}.e{fill:%23eff4f9;}%3c/style%3e%3cclipPath%20id='a'%3e%3cpath%20class='a'%20d='M0-399.479H17.555v17.555H0Z'%20transform='translate(0%20399.479)'/%3e%3c/clipPath%3e%3c/defs%3e%3cg%20transform='translate(-4886%20-5075)'%3e%3ccircle%20class='b'%20cx='17.518'%20cy='17.518'%20r='17.518'%20transform='translate(136.52%2055)'/%3e%3cg%20transform='translate(145.13%2064)'%3e%3cg%20class='c'%3e%3cg%20transform='translate(0%200)'%3e%3cpath%20class='d'%20d='M-381.924-190.962a8.778,8.778,0,0,0-8.778-8.778,8.778,8.778,0,0,0-8.778,8.778,8.745,8.745,0,0,0,2.26,5.879v1.442c0,.8.492,1.457,1.1,1.457h5.83a.843.843,0,0,0,.183-.02,8.778,8.778,0,0,0,8.184-8.757'%20transform='translate(399.479%20199.74)'/%3e%3c/g%3e%3cg%20transform='translate(0%200)'%3e%3cpath%20class='e'%20d='M-68.763-194.079a9.292,9.292,0,0,1,6.38-8.888c-.252-.022-.506-.033-.763-.033a8.774,8.774,0,0,0-8.778,8.778A9.508,9.508,0,0,0-69.7-188.3c.005,0,0,.009,0,.01-.311.352-1.924,2.849.021,2.849h2.25c-1.23-.022,1.263-2.107.269-3.494a8.225,8.225,0,0,1-1.6-5.141'%20transform='translate(71.924%20203)'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
const _sfc_main$e = {
  components: {
    TextMessage,
    FileMessage,
    EmojiMessage,
    TypingMessage,
    SystemMessage
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    emojiSymbols() {
      return {
        ":-1:": "👎",
        ":+1:": "👍"
      };
    },
    isEmoji() {
      var _a, _b;
      return this.message.type === "emoji" || Object.keys(this.emojiSymbols).includes((_b = (_a = this.message) == null ? void 0 : _a.data) == null ? void 0 : _b.text);
    },
    authorName() {
      return this.user && this.user.name;
    },
    chatImageUrl() {
      return this.user && this.user.imageUrl || chatIcon;
    },
    messageColors() {
      return this.message.author === "me" ? this.sentColorsStyle : this.receivedColorsStyle;
    },
    receivedColorsStyle() {
      return {
        color: this.colors.receivedMessage.text,
        backgroundColor: this.colors.receivedMessage.bg
      };
    },
    sentColorsStyle() {
      return {
        color: this.colors.sentMessage.text,
        backgroundColor: this.colors.sentMessage.bg
      };
    }
  }
};
const _hoisted_1$c = ["id"];
const _hoisted_2$6 = ["title"];
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TextMessage = resolveComponent("TextMessage");
  const _component_EmojiMessage = resolveComponent("EmojiMessage");
  const _component_FileMessage = resolveComponent("FileMessage");
  const _component_TypingMessage = resolveComponent("TypingMessage");
  const _component_SystemMessage = resolveComponent("SystemMessage");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock("div", {
    id: $props.message.id,
    class: "sc-message"
  }, [
    createBaseVNode("div", {
      class: normalizeClass(["sc-message--content", {
        sent: $props.message.author === "me",
        received: $props.message.author !== "me" && $props.message.type !== "system",
        system: $props.message.type === "system"
      }])
    }, [
      renderSlot(_ctx.$slots, "user-avatar", {
        message: $props.message,
        user: $props.user
      }, () => [
        $props.message.type !== "system" && $options.authorName && $options.authorName !== "me" ? withDirectives((openBlock(), createElementBlock("div", {
          key: 0,
          title: $options.authorName,
          class: "sc-message--avatar",
          style: normalizeStyle({
            backgroundImage: `url(${$options.chatImageUrl})`
          })
        }, null, 12, _hoisted_2$6)), [
          [_directive_tooltip, $options.authorName]
        ]) : createCommentVNode("", true)
      ]),
      $props.message.type === "text" && !$options.isEmoji ? (openBlock(), createBlock(_component_TextMessage, {
        key: 0,
        message: $props.message,
        "message-colors": $options.messageColors,
        "message-styling": $props.messageStyling,
        onRemove: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("remove"))
      }, {
        default: withCtx((scopedProps) => [
          renderSlot(_ctx.$slots, "text-message-body", {
            message: scopedProps.message,
            messageText: scopedProps.messageText,
            messageColors: scopedProps.messageColors,
            me: scopedProps.me
          })
        ]),
        "text-message-toolbox": withCtx((scopedProps) => [
          renderSlot(_ctx.$slots, "text-message-toolbox", {
            message: scopedProps.message,
            me: scopedProps.me
          })
        ]),
        _: 3
      }, 8, ["message", "message-colors", "message-styling"])) : $options.isEmoji ? (openBlock(), createBlock(_component_EmojiMessage, {
        key: 1,
        data: { emoji: $props.message.data.emoji ?? $options.emojiSymbols[$props.message.data.text] }
      }, null, 8, ["data"])) : $props.message.type === "file" ? (openBlock(), createBlock(_component_FileMessage, {
        key: 2,
        data: $props.message.data,
        "message-colors": $options.messageColors
      }, null, 8, ["data", "message-colors"])) : $props.message.type === "typing" ? (openBlock(), createBlock(_component_TypingMessage, {
        key: 3,
        "message-colors": $options.messageColors
      }, null, 8, ["message-colors"])) : $props.message.type === "system" ? (openBlock(), createBlock(_component_SystemMessage, {
        key: 4,
        data: $props.message.data,
        "message-colors": $options.messageColors
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "system-message-body", {
            message: $props.message.data
          })
        ]),
        _: 3
      }, 8, ["data", "message-colors"])) : createCommentVNode("", true)
    ], 2)
  ], 8, _hoisted_1$c);
}
const Message = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d]]);
const _sfc_main$d = {
  components: {
    Message
  },
  props: {
    participants: {
      type: Array,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    showTypingIndicator: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    defaultChatIcon() {
      return chatIcon;
    }
  },
  mounted() {
    this.$nextTick(this._scrollDown());
  },
  updated() {
    if (this.shouldScrollToBottom())
      this.$nextTick(this._scrollDown(true));
  },
  methods: {
    _scrollDown(isSmooth = false) {
      setTimeout(() => {
        this.$refs.scrollList.scrollTo({
          top: this.$refs.scrollList.scrollHeight,
          behavior: isSmooth ? "smooth" : void 0
        });
      }, 10);
    },
    handleScroll(e) {
      if (e.target.scrollTop === 0) {
        this.$emit("scrollToTop");
      }
    },
    shouldScrollToBottom() {
      const scrollTop = this.$refs.scrollList.scrollTop;
      const scrollable = scrollTop > this.$refs.scrollList.scrollHeight - 600;
      return this.alwaysScrollToBottom || scrollable;
    },
    profile(author) {
      return { imageUrl: "", name: "" };
    }
  }
};
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Message = resolveComponent("Message");
  return openBlock(), createElementBlock("div", {
    ref: "scrollList",
    class: "sc-message-list",
    style: normalizeStyle({ backgroundColor: $props.colors.messageList.bg }),
    onScroll: _cache[0] || (_cache[0] = (...args) => $options.handleScroll && $options.handleScroll(...args))
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.messages, (message, idx) => {
      return openBlock(), createBlock(_component_Message, {
        key: idx,
        message,
        user: $options.profile(message.author),
        colors: $props.colors,
        "message-styling": $props.messageStyling,
        onRemove: ($event) => _ctx.$emit("remove", message)
      }, {
        "user-avatar": withCtx((scopedProps) => [
          renderSlot(_ctx.$slots, "user-avatar", {
            user: scopedProps.user,
            message: scopedProps.message
          })
        ]),
        "text-message-body": withCtx((scopedProps) => [
          renderSlot(_ctx.$slots, "text-message-body", {
            message: scopedProps.message,
            messageText: scopedProps.messageText,
            messageColors: scopedProps.messageColors,
            me: scopedProps.me
          })
        ]),
        "system-message-body": withCtx((scopedProps) => [
          renderSlot(_ctx.$slots, "system-message-body", {
            message: scopedProps.message
          })
        ]),
        "text-message-toolbox": withCtx((scopedProps) => [
          renderSlot(_ctx.$slots, "text-message-toolbox", {
            message: scopedProps.message,
            me: scopedProps.me
          })
        ]),
        _: 2
      }, 1032, ["message", "user", "colors", "message-styling", "onRemove"]);
    }), 128)),
    withDirectives(createVNode(_component_Message, {
      message: { author: $props.showTypingIndicator, type: "typing" },
      user: $options.profile($props.showTypingIndicator),
      colors: $props.colors,
      "message-styling": $props.messageStyling
    }, null, 8, ["message", "user", "colors", "message-styling"]), [
      [vShow, $props.showTypingIndicator]
    ])
  ], 36);
}
const MessageList = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c]]);
var emoji = { exports: {} };
(function(module, exports) {
  (function() {
    var root2 = this;
    var previous_emoji = root2.EmojiConvertor;
    var emoji2 = function() {
      var self2 = this;
      self2.img_set = "apple";
      self2.img_sets = {
        "apple": { "path": "/emoji-data/img-apple-64/", "sheet": "/emoji-data/sheet_apple_64.png", "sheet_size": 64, "mask": 1 },
        "google": { "path": "/emoji-data/img-google-64/", "sheet": "/emoji-data/sheet_google_64.png", "sheet_size": 64, "mask": 2 },
        "twitter": { "path": "/emoji-data/img-twitter-64/", "sheet": "/emoji-data/sheet_twitter_64.png", "sheet_size": 64, "mask": 4 },
        "facebook": { "path": "/emoji-data/img-facebook-64/", "sheet": "/emoji-data/sheet_facebook_64.png", "sheet_size": 64, "mask": 8 }
      };
      self2.use_css_imgs = false;
      self2.colons_mode = false;
      self2.text_mode = false;
      self2.include_title = false;
      self2.include_text = false;
      self2.allow_native = true;
      self2.wrap_native = false;
      self2.use_sheet = false;
      self2.avoid_ms_emoji = true;
      self2.allow_caps = false;
      self2.img_suffix = "";
      self2.inits = {};
      self2.map = {};
      self2.init_env();
      return self2;
    };
    emoji2.prototype.noConflict = function() {
      root2.EmojiConvertor = previous_emoji;
      return emoji2;
    };
    emoji2.prototype.replace_emoticons = function(str) {
      var self2 = this;
      var colonized = self2.replace_emoticons_with_colons(str);
      return self2.replace_colons(colonized);
    };
    emoji2.prototype.replace_emoticons_with_colons = function(str) {
      var self2 = this;
      self2.init_emoticons();
      var _prev_offset = 0;
      var emoticons_with_parens = [];
      var str_replaced = str.replace(self2.rx_emoticons, function(m, $1, emoticon, offset2) {
        var prev_offset = _prev_offset;
        _prev_offset = offset2 + m.length;
        var has_open_paren = emoticon.indexOf("(") !== -1;
        var has_close_paren = emoticon.indexOf(")") !== -1;
        if ((has_open_paren || has_close_paren) && emoticons_with_parens.indexOf(emoticon) == -1) {
          emoticons_with_parens.push(emoticon);
        }
        if (has_close_paren && !has_open_paren) {
          var piece = str.substring(prev_offset, offset2);
          if (piece.indexOf("(") !== -1 && piece.indexOf(")") === -1)
            return m;
        }
        if (m === "\n8)") {
          var before_match = str.substring(0, offset2);
          if (/\n?(6\)|7\))/.test(before_match))
            return m;
        }
        var val = self2.data[self2.map.emoticons[emoticon]][3][0];
        return val ? $1 + ":" + val + ":" : m;
      });
      if (emoticons_with_parens.length) {
        var escaped_emoticons = emoticons_with_parens.map(self2.escape_rx);
        var parenthetical_rx = new RegExp("(\\(.+)(" + escaped_emoticons.join("|") + ")(.+\\))", "g");
        str_replaced = str_replaced.replace(parenthetical_rx, function(m, $1, emoticon, $2) {
          var val = self2.data[self2.map.emoticons[emoticon]][3][0];
          return val ? $1 + ":" + val + ":" + $2 : m;
        });
      }
      return str_replaced;
    };
    emoji2.prototype.replace_colons = function(str) {
      var self2 = this;
      self2.init_colons();
      return str.replace(self2.rx_colons, function(m) {
        var idx = m.substr(1, m.length - 2);
        if (self2.allow_caps)
          idx = idx.toLowerCase();
        if (idx.indexOf("::skin-tone-") > -1) {
          var skin_tone = idx.substr(-1, 1);
          var skin_idx = "skin-tone-" + skin_tone;
          var skin_val = self2.map.colons[skin_idx];
          idx = idx.substr(0, idx.length - 13);
          var val = self2.map.colons[idx];
          if (val) {
            return self2.replacement(val, idx, ":", {
              "idx": skin_val,
              "actual": skin_idx,
              "wrapper": ":"
            });
          } else {
            return ":" + idx + ":" + self2.replacement(skin_val, skin_idx, ":");
          }
        } else {
          var val = self2.map.colons[idx];
          return val ? self2.replacement(val, idx, ":") : m;
        }
      });
    };
    emoji2.prototype.replace_unified = function(str) {
      var self2 = this;
      self2.init_unified();
      return str.replace(self2.rx_unified, function(m, p1, p2) {
        var val = self2.map.unified[p1];
        if (val) {
          var idx = null;
          if (p2 == "🏻")
            idx = "1f3fb";
          if (p2 == "🏼")
            idx = "1f3fc";
          if (p2 == "🏽")
            idx = "1f3fd";
          if (p2 == "🏾")
            idx = "1f3fe";
          if (p2 == "🏿")
            idx = "1f3ff";
          if (idx) {
            return self2.replacement(val, null, null, {
              idx,
              actual: p2,
              wrapper: ""
            });
          }
          return self2.replacement(val);
        }
        val = self2.map.unified_vars[p1];
        if (val) {
          return self2.replacement(val[0], null, null, {
            "idx": val[1],
            "actual": "",
            "wrapper": ""
          });
        }
        return m;
      });
    };
    emoji2.prototype.addAliases = function(map) {
      var self2 = this;
      self2.init_colons();
      for (var i in map) {
        self2.map.colons[i] = map[i];
      }
    };
    emoji2.prototype.removeAliases = function(list) {
      var self2 = this;
      for (var i = 0; i < list.length; i++) {
        var alias = list[i];
        delete self2.map.colons[alias];
        finder_block: {
          for (var j in self2.data) {
            for (var k = 0; k < self2.data[j][3].length; k++) {
              if (alias == self2.data[j][3][k]) {
                self2.map.colons[alias] = j;
                break finder_block;
              }
            }
          }
        }
      }
    };
    emoji2.prototype.replacement = function(idx, actual, wrapper, variation, is_extra) {
      var self2 = this;
      var extra = "";
      var var_idx = null;
      if (typeof variation === "object") {
        extra = self2.replacement(variation.idx, variation.actual, variation.wrapper, void 0, true);
        var_idx = variation.idx;
      }
      wrapper = wrapper || "";
      if (self2.colons_mode)
        return ":" + self2.data[idx][3][0] + ":" + extra;
      var text_name = actual ? wrapper + actual + wrapper : self2.data[idx][8] || wrapper + self2.data[idx][3][0] + wrapper;
      if (self2.text_mode)
        return text_name + extra;
      var img = self2.find_image(idx, var_idx);
      self2.init_env();
      if (self2.replace_mode == "softbank" && self2.allow_native && self2.data[idx][1])
        return self2.format_native(self2.data[idx][1] + extra, !is_extra);
      if (self2.replace_mode == "google" && self2.allow_native && self2.data[idx][2])
        return self2.format_native(self2.data[idx][2] + extra, !is_extra);
      if (img.is_var) {
        extra = "";
      }
      if (self2.replace_mode == "unified" && self2.allow_native)
        return self2.format_native(img.unified + extra, !is_extra);
      var title = self2.include_title ? ' title="' + (actual || self2.data[idx][3][0]) + '"' : "";
      var text = self2.include_text ? wrapper + (actual || self2.data[idx][3][0]) + wrapper : "";
      if (self2.data[idx][7]) {
        img.path = self2.data[idx][7];
        img.px = null;
        img.py = null;
        img.is_var = false;
      }
      if (img.is_var && self2.include_text && variation && variation.actual && variation.wrapper) {
        text += variation.wrapper + variation.actual + variation.wrapper;
      }
      if (self2.replace_mode == "css") {
        if (self2.use_sheet && img.px != null && img.py != null) {
          var sheet_x = 100 * img.px / (self2.sheet_size - 1);
          var sheet_y = 100 * img.py / (self2.sheet_size - 1);
          var sheet_sz = 100 * self2.sheet_size;
          var style = "background: url(" + img.sheet + ");background-position:" + sheet_x + "% " + sheet_y + "%;background-size:" + sheet_sz + "% " + sheet_sz + "%";
          return '<span class="emoji-outer emoji-sizer"><span class="emoji-inner" style="' + style + '"' + title + ' data-codepoints="' + img.full_idx + '">' + text + "</span></span>" + extra;
        } else if (self2.use_css_imgs) {
          return '<span class="emoji emoji-' + idx + '"' + title + ' data-codepoints="' + img.full_idx + '">' + text + "</span>" + extra;
        } else {
          return '<span class="emoji emoji-sizer" style="background-image:url(' + img.path + ')"' + title + ' data-codepoints="' + img.full_idx + '">' + text + "</span>" + extra;
        }
      }
      return '<img src="' + img.path + '" class="emoji" data-codepoints="' + img.full_idx + '" ' + title + "/>" + extra;
    };
    emoji2.prototype.format_native = function(native, allow_wrap) {
      var self2 = this;
      if (self2.wrap_native && allow_wrap) {
        return '<span class="emoji-native">' + native + "</span>";
      }
      return native;
    };
    emoji2.prototype.find_image = function(idx, var_idx) {
      var self2 = this;
      var out = {
        "path": "",
        "sheet": "",
        "sheet_size": 0,
        "px": self2.data[idx][4],
        "py": self2.data[idx][5],
        "full_idx": idx,
        "is_var": false,
        "unified": self2.data[idx][0][0]
      };
      var use_mask = self2.data[idx][6];
      if (var_idx && self2.variations_data[idx] && self2.variations_data[idx][var_idx]) {
        var var_data = self2.variations_data[idx][var_idx];
        out.px = var_data[1];
        out.py = var_data[2];
        out.full_idx = var_data[0];
        out.is_var = true;
        out.unified = var_data[4][0];
        use_mask = var_data[3];
      }
      var try_order = [self2.img_set, "apple", "google", "twitter", "facebook", "messenger"];
      for (var j = 0; j < try_order.length; j++) {
        if (!self2.img_sets[try_order[j]]) {
          throw Error("Invalid value for img_set");
        }
        if (use_mask & self2.img_sets[try_order[j]].mask) {
          out.path = self2.img_sets[try_order[j]].path + out.full_idx + ".png" + self2.img_suffix;
          out.sheet = self2.img_sets[self2.img_set].sheet;
          out.sheet_size = self2.img_sets[self2.img_set].sheet_size;
          return out;
        }
        if (self2.obsoletes_data[out.full_idx]) {
          var ob_data = self2.obsoletes_data[out.full_idx];
          if (ob_data[3] & self2.img_sets[try_order[j]].mask) {
            out.path = self2.img_sets[try_order[j]].path + ob_data[0] + ".png" + self2.img_suffix;
            out.sheet = self2.img_sets[try_order[j]].sheet;
            out.sheet_size = self2.img_sets[try_order[j]].sheet_size;
            out.px = ob_data[1];
            out.py = ob_data[2];
            return out;
          }
        }
      }
      return out;
    };
    emoji2.prototype.init_emoticons = function() {
      var self2 = this;
      if (self2.inits.emoticons)
        return;
      self2.init_colons();
      self2.inits.emoticons = 1;
      var a = [];
      self2.map.emoticons = {};
      for (var i in self2.emoticons_data) {
        var emoticon = i.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
        if (!self2.map.colons[self2.emoticons_data[i]])
          continue;
        self2.map.emoticons[emoticon] = self2.map.colons[self2.emoticons_data[i]];
        a.push(self2.escape_rx(emoticon));
      }
      self2.rx_emoticons = new RegExp("(^|\\s)(" + a.join("|") + ")(?=$|[\\s|\\?\\.,!])", "g");
    };
    emoji2.prototype.init_colons = function() {
      var self2 = this;
      if (self2.inits.colons)
        return;
      self2.inits.colons = 1;
      self2.rx_colons = new RegExp(":[a-zA-Z0-9-_+]+:(:skin-tone-[2-6]:)?", "g");
      self2.map.colons = {};
      for (var i in self2.data) {
        for (var j = 0; j < self2.data[i][3].length; j++) {
          self2.map.colons[self2.data[i][3][j]] = i;
        }
      }
    };
    emoji2.prototype.init_unified = function() {
      var self2 = this;
      if (self2.inits.unified)
        return;
      self2.inits.unified = 1;
      var a = [];
      self2.map.unified = {};
      self2.map.unified_vars = {};
      for (var i in self2.data) {
        for (var j = 0; j < self2.data[i][0].length; j++) {
          a.push(self2.data[i][0][j].replace("*", "\\*"));
          self2.map.unified[self2.data[i][0][j]] = i;
        }
      }
      for (var i in self2.variations_data) {
        if (self2.variations_data[i]["1f3fb"]) {
          if (self2.variations_data[i]["1f3fb"][0] == i + "-1f3fb")
            continue;
        }
        for (var k in self2.variations_data[i]) {
          for (var j = 0; j < self2.variations_data[i][k][4].length; j++) {
            a.push(self2.variations_data[i][k][4][j].replace("*", "\\*"));
            self2.map.unified_vars[self2.variations_data[i][k][4][j]] = [i, k];
          }
        }
      }
      a = a.sort(function(a2, b) {
        return b.length - a2.length;
      });
      self2.rx_unified = new RegExp("(" + a.join("|") + ")(\uD83C[\uDFFB-\uDFFF])?", "g");
    };
    emoji2.prototype.init_env = function() {
      var self2 = this;
      if (self2.inits.env)
        return;
      self2.inits.env = 1;
      self2.replace_mode = "img";
      var supports_css = false;
      if (typeof navigator !== "undefined") {
        var ua = navigator.userAgent;
        if (typeof window !== "undefined" && window.getComputedStyle) {
          try {
            var st = window.getComputedStyle(document.body);
            if (st["background-size"] || st["backgroundSize"]) {
              supports_css = true;
            }
          } catch (e) {
            if (ua.match(/Firefox/i)) {
              supports_css = true;
            }
          }
        }
        if (navigator.product.match(/ReactNative/i)) {
          self2.replace_mode = "unified";
          return;
        }
        if (ua.match(/(iPhone|iPod|iPad|iPhone\s+Simulator)/i)) {
          if (ua.match(/OS\s+[12345]/i)) {
            self2.replace_mode = "softbank";
            return;
          }
          if (ua.match(/OS\s+[6789]/i)) {
            self2.replace_mode = "unified";
            return;
          }
        }
        if (ua.match(/Mac OS X (10[._ ](?:[789]|1)|11[._ ]\d)/i)) {
          self2.replace_mode = "unified";
          return;
        }
        if (!self2.avoid_ms_emoji) {
          if (ua.match(/Windows NT 6.[1-9]/i) || ua.match(/Windows NT 10.[0-9]/i)) {
            if (!ua.match(/Chrome/i) && !ua.match(/MSIE 8/i)) {
              self2.replace_mode = "unified";
              return;
            }
          }
        }
      }
      if (supports_css) {
        self2.replace_mode = "css";
        return;
      }
    };
    emoji2.prototype.escape_rx = function(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    emoji2.prototype.sheet_size = 61;
    emoji2.prototype.data = {
      "0023-fe0f-20e3": [["#️⃣", "#⃣"], "", "󾠬", ["hash"], 0, 0, 7, 0],
      "002a-fe0f-20e3": [["*️⃣", "*⃣"], "", "", ["keycap_star"], 0, 1, 7, 0],
      "0030-fe0f-20e3": [["0️⃣", "0⃣"], "", "󾠷", ["zero"], 0, 2, 7, 0],
      "0031-fe0f-20e3": [["1️⃣", "1⃣"], "", "󾠮", ["one"], 0, 3, 7, 0],
      "0032-fe0f-20e3": [["2️⃣", "2⃣"], "", "󾠯", ["two"], 0, 4, 7, 0],
      "0033-fe0f-20e3": [["3️⃣", "3⃣"], "", "󾠰", ["three"], 0, 5, 7, 0],
      "0034-fe0f-20e3": [["4️⃣", "4⃣"], "", "󾠱", ["four"], 0, 6, 7, 0],
      "0035-fe0f-20e3": [["5️⃣", "5⃣"], "", "󾠲", ["five"], 0, 7, 7, 0],
      "0036-fe0f-20e3": [["6️⃣", "6⃣"], "", "󾠳", ["six"], 0, 8, 7, 0],
      "0037-fe0f-20e3": [["7️⃣", "7⃣"], "", "󾠴", ["seven"], 0, 9, 7, 0],
      "0038-fe0f-20e3": [["8️⃣", "8⃣"], "", "󾠵", ["eight"], 0, 10, 7, 0],
      "0039-fe0f-20e3": [["9️⃣", "9⃣"], "", "󾠶", ["nine"], 0, 11, 7, 0],
      "00a9-fe0f": [["©️", "©"], "", "󾬩", ["copyright"], 0, 12, 7, 0],
      "00ae-fe0f": [["®️", "®"], "", "󾬭", ["registered"], 0, 13, 7, 0],
      "1f004": [["🀄"], "", "󾠋", ["mahjong"], 0, 14, 15, 0],
      "1f0cf": [["🃏"], "", "󾠒", ["black_joker"], 0, 15, 15, 0],
      "1f170-fe0f": [["🅰️", "🅰"], "", "󾔋", ["a"], 0, 16, 15, 0],
      "1f171-fe0f": [["🅱️", "🅱"], "", "󾔌", ["b"], 0, 17, 15, 0],
      "1f17e-fe0f": [["🅾️", "🅾"], "", "󾔎", ["o2"], 0, 18, 15, 0],
      "1f17f-fe0f": [["🅿️", "🅿"], "", "󾟶", ["parking"], 0, 19, 15, 0],
      "1f18e": [["🆎"], "", "󾔍", ["ab"], 0, 20, 15, 0],
      "1f191": [["🆑"], "", "󾮄", ["cl"], 0, 21, 15, 0],
      "1f192": [["🆒"], "", "󾬸", ["cool"], 0, 22, 15, 0],
      "1f193": [["🆓"], "", "󾬡", ["free"], 0, 23, 15, 0],
      "1f194": [["🆔"], "", "󾮁", ["id"], 0, 24, 15, 0],
      "1f195": [["🆕"], "", "󾬶", ["new"], 0, 25, 15, 0],
      "1f196": [["🆖"], "", "󾬨", ["ng"], 0, 26, 15, 0],
      "1f197": [["🆗"], "", "󾬧", ["ok"], 0, 27, 15, 0],
      "1f198": [["🆘"], "", "󾭏", ["sos"], 0, 28, 15, 0],
      "1f199": [["🆙"], "", "󾬷", ["up"], 0, 29, 15, 0],
      "1f19a": [["🆚"], "", "󾬲", ["vs"], 0, 30, 15, 0],
      "1f1e6-1f1e8": [["🇦🇨"], "", "", ["flag-ac"], 0, 31, 15, 0],
      "1f1e6-1f1e9": [["🇦🇩"], "", "", ["flag-ad"], 0, 32, 15, 0],
      "1f1e6-1f1ea": [["🇦🇪"], "", "", ["flag-ae"], 0, 33, 15, 0],
      "1f1e6-1f1eb": [["🇦🇫"], "", "", ["flag-af"], 0, 34, 15, 0],
      "1f1e6-1f1ec": [["🇦🇬"], "", "", ["flag-ag"], 0, 35, 15, 0],
      "1f1e6-1f1ee": [["🇦🇮"], "", "", ["flag-ai"], 0, 36, 15, 0],
      "1f1e6-1f1f1": [["🇦🇱"], "", "", ["flag-al"], 0, 37, 15, 0],
      "1f1e6-1f1f2": [["🇦🇲"], "", "", ["flag-am"], 0, 38, 15, 0],
      "1f1e6-1f1f4": [["🇦🇴"], "", "", ["flag-ao"], 0, 39, 15, 0],
      "1f1e6-1f1f6": [["🇦🇶"], "", "", ["flag-aq"], 0, 40, 15, 0],
      "1f1e6-1f1f7": [["🇦🇷"], "", "", ["flag-ar"], 0, 41, 15, 0],
      "1f1e6-1f1f8": [["🇦🇸"], "", "", ["flag-as"], 0, 42, 15, 0],
      "1f1e6-1f1f9": [["🇦🇹"], "", "", ["flag-at"], 0, 43, 15, 0],
      "1f1e6-1f1fa": [["🇦🇺"], "", "", ["flag-au"], 0, 44, 15, 0],
      "1f1e6-1f1fc": [["🇦🇼"], "", "", ["flag-aw"], 0, 45, 15, 0],
      "1f1e6-1f1fd": [["🇦🇽"], "", "", ["flag-ax"], 0, 46, 15, 0],
      "1f1e6-1f1ff": [["🇦🇿"], "", "", ["flag-az"], 0, 47, 15, 0],
      "1f1e7-1f1e6": [["🇧🇦"], "", "", ["flag-ba"], 0, 48, 15, 0],
      "1f1e7-1f1e7": [["🇧🇧"], "", "", ["flag-bb"], 0, 49, 15, 0],
      "1f1e7-1f1e9": [["🇧🇩"], "", "", ["flag-bd"], 0, 50, 15, 0],
      "1f1e7-1f1ea": [["🇧🇪"], "", "", ["flag-be"], 0, 51, 15, 0],
      "1f1e7-1f1eb": [["🇧🇫"], "", "", ["flag-bf"], 0, 52, 15, 0],
      "1f1e7-1f1ec": [["🇧🇬"], "", "", ["flag-bg"], 0, 53, 15, 0],
      "1f1e7-1f1ed": [["🇧🇭"], "", "", ["flag-bh"], 0, 54, 15, 0],
      "1f1e7-1f1ee": [["🇧🇮"], "", "", ["flag-bi"], 0, 55, 15, 0],
      "1f1e7-1f1ef": [["🇧🇯"], "", "", ["flag-bj"], 0, 56, 15, 0],
      "1f1e7-1f1f1": [["🇧🇱"], "", "", ["flag-bl"], 0, 57, 15, 0],
      "1f1e7-1f1f2": [["🇧🇲"], "", "", ["flag-bm"], 0, 58, 15, 0],
      "1f1e7-1f1f3": [["🇧🇳"], "", "", ["flag-bn"], 0, 59, 15, 0],
      "1f1e7-1f1f4": [["🇧🇴"], "", "", ["flag-bo"], 0, 60, 15, 0],
      "1f1e7-1f1f6": [["🇧🇶"], "", "", ["flag-bq"], 1, 0, 15, 0],
      "1f1e7-1f1f7": [["🇧🇷"], "", "", ["flag-br"], 1, 1, 15, 0],
      "1f1e7-1f1f8": [["🇧🇸"], "", "", ["flag-bs"], 1, 2, 15, 0],
      "1f1e7-1f1f9": [["🇧🇹"], "", "", ["flag-bt"], 1, 3, 15, 0],
      "1f1e7-1f1fb": [["🇧🇻"], "", "", ["flag-bv"], 1, 4, 15, 0],
      "1f1e7-1f1fc": [["🇧🇼"], "", "", ["flag-bw"], 1, 5, 15, 0],
      "1f1e7-1f1fe": [["🇧🇾"], "", "", ["flag-by"], 1, 6, 15, 0],
      "1f1e7-1f1ff": [["🇧🇿"], "", "", ["flag-bz"], 1, 7, 15, 0],
      "1f1e8-1f1e6": [["🇨🇦"], "", "", ["flag-ca"], 1, 8, 15, 0],
      "1f1e8-1f1e8": [["🇨🇨"], "", "", ["flag-cc"], 1, 9, 15, 0],
      "1f1e8-1f1e9": [["🇨🇩"], "", "", ["flag-cd"], 1, 10, 15, 0],
      "1f1e8-1f1eb": [["🇨🇫"], "", "", ["flag-cf"], 1, 11, 15, 0],
      "1f1e8-1f1ec": [["🇨🇬"], "", "", ["flag-cg"], 1, 12, 15, 0],
      "1f1e8-1f1ed": [["🇨🇭"], "", "", ["flag-ch"], 1, 13, 15, 0],
      "1f1e8-1f1ee": [["🇨🇮"], "", "", ["flag-ci"], 1, 14, 15, 0],
      "1f1e8-1f1f0": [["🇨🇰"], "", "", ["flag-ck"], 1, 15, 15, 0],
      "1f1e8-1f1f1": [["🇨🇱"], "", "", ["flag-cl"], 1, 16, 15, 0],
      "1f1e8-1f1f2": [["🇨🇲"], "", "", ["flag-cm"], 1, 17, 15, 0],
      "1f1e8-1f1f3": [["🇨🇳"], "", "󾓭", ["cn", "flag-cn"], 1, 18, 15, 0],
      "1f1e8-1f1f4": [["🇨🇴"], "", "", ["flag-co"], 1, 19, 15, 0],
      "1f1e8-1f1f5": [["🇨🇵"], "", "", ["flag-cp"], 1, 20, 15, 0],
      "1f1e8-1f1f7": [["🇨🇷"], "", "", ["flag-cr"], 1, 21, 15, 0],
      "1f1e8-1f1fa": [["🇨🇺"], "", "", ["flag-cu"], 1, 22, 15, 0],
      "1f1e8-1f1fb": [["🇨🇻"], "", "", ["flag-cv"], 1, 23, 15, 0],
      "1f1e8-1f1fc": [["🇨🇼"], "", "", ["flag-cw"], 1, 24, 15, 0],
      "1f1e8-1f1fd": [["🇨🇽"], "", "", ["flag-cx"], 1, 25, 15, 0],
      "1f1e8-1f1fe": [["🇨🇾"], "", "", ["flag-cy"], 1, 26, 15, 0],
      "1f1e8-1f1ff": [["🇨🇿"], "", "", ["flag-cz"], 1, 27, 15, 0],
      "1f1e9-1f1ea": [["🇩🇪"], "", "󾓨", ["de", "flag-de"], 1, 28, 15, 0],
      "1f1e9-1f1ec": [["🇩🇬"], "", "", ["flag-dg"], 1, 29, 15, 0],
      "1f1e9-1f1ef": [["🇩🇯"], "", "", ["flag-dj"], 1, 30, 15, 0],
      "1f1e9-1f1f0": [["🇩🇰"], "", "", ["flag-dk"], 1, 31, 15, 0],
      "1f1e9-1f1f2": [["🇩🇲"], "", "", ["flag-dm"], 1, 32, 15, 0],
      "1f1e9-1f1f4": [["🇩🇴"], "", "", ["flag-do"], 1, 33, 15, 0],
      "1f1e9-1f1ff": [["🇩🇿"], "", "", ["flag-dz"], 1, 34, 15, 0],
      "1f1ea-1f1e6": [["🇪🇦"], "", "", ["flag-ea"], 1, 35, 15, 0],
      "1f1ea-1f1e8": [["🇪🇨"], "", "", ["flag-ec"], 1, 36, 15, 0],
      "1f1ea-1f1ea": [["🇪🇪"], "", "", ["flag-ee"], 1, 37, 15, 0],
      "1f1ea-1f1ec": [["🇪🇬"], "", "", ["flag-eg"], 1, 38, 15, 0],
      "1f1ea-1f1ed": [["🇪🇭"], "", "", ["flag-eh"], 1, 39, 15, 0],
      "1f1ea-1f1f7": [["🇪🇷"], "", "", ["flag-er"], 1, 40, 15, 0],
      "1f1ea-1f1f8": [["🇪🇸"], "", "󾓫", ["es", "flag-es"], 1, 41, 15, 0],
      "1f1ea-1f1f9": [["🇪🇹"], "", "", ["flag-et"], 1, 42, 15, 0],
      "1f1ea-1f1fa": [["🇪🇺"], "", "", ["flag-eu"], 1, 43, 15, 0],
      "1f1eb-1f1ee": [["🇫🇮"], "", "", ["flag-fi"], 1, 44, 15, 0],
      "1f1eb-1f1ef": [["🇫🇯"], "", "", ["flag-fj"], 1, 45, 15, 0],
      "1f1eb-1f1f0": [["🇫🇰"], "", "", ["flag-fk"], 1, 46, 15, 0],
      "1f1eb-1f1f2": [["🇫🇲"], "", "", ["flag-fm"], 1, 47, 15, 0],
      "1f1eb-1f1f4": [["🇫🇴"], "", "", ["flag-fo"], 1, 48, 15, 0],
      "1f1eb-1f1f7": [["🇫🇷"], "", "󾓧", ["fr", "flag-fr"], 1, 49, 15, 0],
      "1f1ec-1f1e6": [["🇬🇦"], "", "", ["flag-ga"], 1, 50, 15, 0],
      "1f1ec-1f1e7": [["🇬🇧"], "", "󾓪", ["gb", "uk", "flag-gb"], 1, 51, 15, 0],
      "1f1ec-1f1e9": [["🇬🇩"], "", "", ["flag-gd"], 1, 52, 15, 0],
      "1f1ec-1f1ea": [["🇬🇪"], "", "", ["flag-ge"], 1, 53, 15, 0],
      "1f1ec-1f1eb": [["🇬🇫"], "", "", ["flag-gf"], 1, 54, 15, 0],
      "1f1ec-1f1ec": [["🇬🇬"], "", "", ["flag-gg"], 1, 55, 15, 0],
      "1f1ec-1f1ed": [["🇬🇭"], "", "", ["flag-gh"], 1, 56, 15, 0],
      "1f1ec-1f1ee": [["🇬🇮"], "", "", ["flag-gi"], 1, 57, 15, 0],
      "1f1ec-1f1f1": [["🇬🇱"], "", "", ["flag-gl"], 1, 58, 15, 0],
      "1f1ec-1f1f2": [["🇬🇲"], "", "", ["flag-gm"], 1, 59, 15, 0],
      "1f1ec-1f1f3": [["🇬🇳"], "", "", ["flag-gn"], 1, 60, 15, 0],
      "1f1ec-1f1f5": [["🇬🇵"], "", "", ["flag-gp"], 2, 0, 15, 0],
      "1f1ec-1f1f6": [["🇬🇶"], "", "", ["flag-gq"], 2, 1, 15, 0],
      "1f1ec-1f1f7": [["🇬🇷"], "", "", ["flag-gr"], 2, 2, 15, 0],
      "1f1ec-1f1f8": [["🇬🇸"], "", "", ["flag-gs"], 2, 3, 15, 0],
      "1f1ec-1f1f9": [["🇬🇹"], "", "", ["flag-gt"], 2, 4, 15, 0],
      "1f1ec-1f1fa": [["🇬🇺"], "", "", ["flag-gu"], 2, 5, 15, 0],
      "1f1ec-1f1fc": [["🇬🇼"], "", "", ["flag-gw"], 2, 6, 15, 0],
      "1f1ec-1f1fe": [["🇬🇾"], "", "", ["flag-gy"], 2, 7, 15, 0],
      "1f1ed-1f1f0": [["🇭🇰"], "", "", ["flag-hk"], 2, 8, 15, 0],
      "1f1ed-1f1f2": [["🇭🇲"], "", "", ["flag-hm"], 2, 9, 15, 0],
      "1f1ed-1f1f3": [["🇭🇳"], "", "", ["flag-hn"], 2, 10, 15, 0],
      "1f1ed-1f1f7": [["🇭🇷"], "", "", ["flag-hr"], 2, 11, 15, 0],
      "1f1ed-1f1f9": [["🇭🇹"], "", "", ["flag-ht"], 2, 12, 15, 0],
      "1f1ed-1f1fa": [["🇭🇺"], "", "", ["flag-hu"], 2, 13, 15, 0],
      "1f1ee-1f1e8": [["🇮🇨"], "", "", ["flag-ic"], 2, 14, 15, 0],
      "1f1ee-1f1e9": [["🇮🇩"], "", "", ["flag-id"], 2, 15, 15, 0],
      "1f1ee-1f1ea": [["🇮🇪"], "", "", ["flag-ie"], 2, 16, 15, 0],
      "1f1ee-1f1f1": [["🇮🇱"], "", "", ["flag-il"], 2, 17, 15, 0],
      "1f1ee-1f1f2": [["🇮🇲"], "", "", ["flag-im"], 2, 18, 15, 0],
      "1f1ee-1f1f3": [["🇮🇳"], "", "", ["flag-in"], 2, 19, 15, 0],
      "1f1ee-1f1f4": [["🇮🇴"], "", "", ["flag-io"], 2, 20, 15, 0],
      "1f1ee-1f1f6": [["🇮🇶"], "", "", ["flag-iq"], 2, 21, 15, 0],
      "1f1ee-1f1f7": [["🇮🇷"], "", "", ["flag-ir"], 2, 22, 15, 0],
      "1f1ee-1f1f8": [["🇮🇸"], "", "", ["flag-is"], 2, 23, 15, 0],
      "1f1ee-1f1f9": [["🇮🇹"], "", "󾓩", ["it", "flag-it"], 2, 24, 15, 0],
      "1f1ef-1f1ea": [["🇯🇪"], "", "", ["flag-je"], 2, 25, 15, 0],
      "1f1ef-1f1f2": [["🇯🇲"], "", "", ["flag-jm"], 2, 26, 15, 0],
      "1f1ef-1f1f4": [["🇯🇴"], "", "", ["flag-jo"], 2, 27, 15, 0],
      "1f1ef-1f1f5": [["🇯🇵"], "", "󾓥", ["jp", "flag-jp"], 2, 28, 15, 0],
      "1f1f0-1f1ea": [["🇰🇪"], "", "", ["flag-ke"], 2, 29, 15, 0],
      "1f1f0-1f1ec": [["🇰🇬"], "", "", ["flag-kg"], 2, 30, 15, 0],
      "1f1f0-1f1ed": [["🇰🇭"], "", "", ["flag-kh"], 2, 31, 15, 0],
      "1f1f0-1f1ee": [["🇰🇮"], "", "", ["flag-ki"], 2, 32, 15, 0],
      "1f1f0-1f1f2": [["🇰🇲"], "", "", ["flag-km"], 2, 33, 15, 0],
      "1f1f0-1f1f3": [["🇰🇳"], "", "", ["flag-kn"], 2, 34, 15, 0],
      "1f1f0-1f1f5": [["🇰🇵"], "", "", ["flag-kp"], 2, 35, 15, 0],
      "1f1f0-1f1f7": [["🇰🇷"], "", "󾓮", ["kr", "flag-kr"], 2, 36, 15, 0],
      "1f1f0-1f1fc": [["🇰🇼"], "", "", ["flag-kw"], 2, 37, 15, 0],
      "1f1f0-1f1fe": [["🇰🇾"], "", "", ["flag-ky"], 2, 38, 15, 0],
      "1f1f0-1f1ff": [["🇰🇿"], "", "", ["flag-kz"], 2, 39, 15, 0],
      "1f1f1-1f1e6": [["🇱🇦"], "", "", ["flag-la"], 2, 40, 15, 0],
      "1f1f1-1f1e7": [["🇱🇧"], "", "", ["flag-lb"], 2, 41, 15, 0],
      "1f1f1-1f1e8": [["🇱🇨"], "", "", ["flag-lc"], 2, 42, 15, 0],
      "1f1f1-1f1ee": [["🇱🇮"], "", "", ["flag-li"], 2, 43, 15, 0],
      "1f1f1-1f1f0": [["🇱🇰"], "", "", ["flag-lk"], 2, 44, 15, 0],
      "1f1f1-1f1f7": [["🇱🇷"], "", "", ["flag-lr"], 2, 45, 15, 0],
      "1f1f1-1f1f8": [["🇱🇸"], "", "", ["flag-ls"], 2, 46, 15, 0],
      "1f1f1-1f1f9": [["🇱🇹"], "", "", ["flag-lt"], 2, 47, 15, 0],
      "1f1f1-1f1fa": [["🇱🇺"], "", "", ["flag-lu"], 2, 48, 15, 0],
      "1f1f1-1f1fb": [["🇱🇻"], "", "", ["flag-lv"], 2, 49, 15, 0],
      "1f1f1-1f1fe": [["🇱🇾"], "", "", ["flag-ly"], 2, 50, 15, 0],
      "1f1f2-1f1e6": [["🇲🇦"], "", "", ["flag-ma"], 2, 51, 15, 0],
      "1f1f2-1f1e8": [["🇲🇨"], "", "", ["flag-mc"], 2, 52, 15, 0],
      "1f1f2-1f1e9": [["🇲🇩"], "", "", ["flag-md"], 2, 53, 15, 0],
      "1f1f2-1f1ea": [["🇲🇪"], "", "", ["flag-me"], 2, 54, 15, 0],
      "1f1f2-1f1eb": [["🇲🇫"], "", "", ["flag-mf"], 2, 55, 15, 0],
      "1f1f2-1f1ec": [["🇲🇬"], "", "", ["flag-mg"], 2, 56, 15, 0],
      "1f1f2-1f1ed": [["🇲🇭"], "", "", ["flag-mh"], 2, 57, 15, 0],
      "1f1f2-1f1f0": [["🇲🇰"], "", "", ["flag-mk"], 2, 58, 15, 0],
      "1f1f2-1f1f1": [["🇲🇱"], "", "", ["flag-ml"], 2, 59, 15, 0],
      "1f1f2-1f1f2": [["🇲🇲"], "", "", ["flag-mm"], 2, 60, 15, 0],
      "1f1f2-1f1f3": [["🇲🇳"], "", "", ["flag-mn"], 3, 0, 15, 0],
      "1f1f2-1f1f4": [["🇲🇴"], "", "", ["flag-mo"], 3, 1, 15, 0],
      "1f1f2-1f1f5": [["🇲🇵"], "", "", ["flag-mp"], 3, 2, 15, 0],
      "1f1f2-1f1f6": [["🇲🇶"], "", "", ["flag-mq"], 3, 3, 15, 0],
      "1f1f2-1f1f7": [["🇲🇷"], "", "", ["flag-mr"], 3, 4, 15, 0],
      "1f1f2-1f1f8": [["🇲🇸"], "", "", ["flag-ms"], 3, 5, 15, 0],
      "1f1f2-1f1f9": [["🇲🇹"], "", "", ["flag-mt"], 3, 6, 15, 0],
      "1f1f2-1f1fa": [["🇲🇺"], "", "", ["flag-mu"], 3, 7, 15, 0],
      "1f1f2-1f1fb": [["🇲🇻"], "", "", ["flag-mv"], 3, 8, 15, 0],
      "1f1f2-1f1fc": [["🇲🇼"], "", "", ["flag-mw"], 3, 9, 15, 0],
      "1f1f2-1f1fd": [["🇲🇽"], "", "", ["flag-mx"], 3, 10, 15, 0],
      "1f1f2-1f1fe": [["🇲🇾"], "", "", ["flag-my"], 3, 11, 15, 0],
      "1f1f2-1f1ff": [["🇲🇿"], "", "", ["flag-mz"], 3, 12, 15, 0],
      "1f1f3-1f1e6": [["🇳🇦"], "", "", ["flag-na"], 3, 13, 15, 0],
      "1f1f3-1f1e8": [["🇳🇨"], "", "", ["flag-nc"], 3, 14, 15, 0],
      "1f1f3-1f1ea": [["🇳🇪"], "", "", ["flag-ne"], 3, 15, 15, 0],
      "1f1f3-1f1eb": [["🇳🇫"], "", "", ["flag-nf"], 3, 16, 15, 0],
      "1f1f3-1f1ec": [["🇳🇬"], "", "", ["flag-ng"], 3, 17, 15, 0],
      "1f1f3-1f1ee": [["🇳🇮"], "", "", ["flag-ni"], 3, 18, 15, 0],
      "1f1f3-1f1f1": [["🇳🇱"], "", "", ["flag-nl"], 3, 19, 15, 0],
      "1f1f3-1f1f4": [["🇳🇴"], "", "", ["flag-no"], 3, 20, 15, 0],
      "1f1f3-1f1f5": [["🇳🇵"], "", "", ["flag-np"], 3, 21, 15, 0],
      "1f1f3-1f1f7": [["🇳🇷"], "", "", ["flag-nr"], 3, 22, 15, 0],
      "1f1f3-1f1fa": [["🇳🇺"], "", "", ["flag-nu"], 3, 23, 15, 0],
      "1f1f3-1f1ff": [["🇳🇿"], "", "", ["flag-nz"], 3, 24, 15, 0],
      "1f1f4-1f1f2": [["🇴🇲"], "", "", ["flag-om"], 3, 25, 15, 0],
      "1f1f5-1f1e6": [["🇵🇦"], "", "", ["flag-pa"], 3, 26, 15, 0],
      "1f1f5-1f1ea": [["🇵🇪"], "", "", ["flag-pe"], 3, 27, 15, 0],
      "1f1f5-1f1eb": [["🇵🇫"], "", "", ["flag-pf"], 3, 28, 15, 0],
      "1f1f5-1f1ec": [["🇵🇬"], "", "", ["flag-pg"], 3, 29, 15, 0],
      "1f1f5-1f1ed": [["🇵🇭"], "", "", ["flag-ph"], 3, 30, 15, 0],
      "1f1f5-1f1f0": [["🇵🇰"], "", "", ["flag-pk"], 3, 31, 15, 0],
      "1f1f5-1f1f1": [["🇵🇱"], "", "", ["flag-pl"], 3, 32, 15, 0],
      "1f1f5-1f1f2": [["🇵🇲"], "", "", ["flag-pm"], 3, 33, 15, 0],
      "1f1f5-1f1f3": [["🇵🇳"], "", "", ["flag-pn"], 3, 34, 15, 0],
      "1f1f5-1f1f7": [["🇵🇷"], "", "", ["flag-pr"], 3, 35, 15, 0],
      "1f1f5-1f1f8": [["🇵🇸"], "", "", ["flag-ps"], 3, 36, 15, 0],
      "1f1f5-1f1f9": [["🇵🇹"], "", "", ["flag-pt"], 3, 37, 15, 0],
      "1f1f5-1f1fc": [["🇵🇼"], "", "", ["flag-pw"], 3, 38, 15, 0],
      "1f1f5-1f1fe": [["🇵🇾"], "", "", ["flag-py"], 3, 39, 15, 0],
      "1f1f6-1f1e6": [["🇶🇦"], "", "", ["flag-qa"], 3, 40, 15, 0],
      "1f1f7-1f1ea": [["🇷🇪"], "", "", ["flag-re"], 3, 41, 15, 0],
      "1f1f7-1f1f4": [["🇷🇴"], "", "", ["flag-ro"], 3, 42, 15, 0],
      "1f1f7-1f1f8": [["🇷🇸"], "", "", ["flag-rs"], 3, 43, 15, 0],
      "1f1f7-1f1fa": [["🇷🇺"], "", "󾓬", ["ru", "flag-ru"], 3, 44, 15, 0],
      "1f1f7-1f1fc": [["🇷🇼"], "", "", ["flag-rw"], 3, 45, 15, 0],
      "1f1f8-1f1e6": [["🇸🇦"], "", "", ["flag-sa"], 3, 46, 15, 0],
      "1f1f8-1f1e7": [["🇸🇧"], "", "", ["flag-sb"], 3, 47, 15, 0],
      "1f1f8-1f1e8": [["🇸🇨"], "", "", ["flag-sc"], 3, 48, 15, 0],
      "1f1f8-1f1e9": [["🇸🇩"], "", "", ["flag-sd"], 3, 49, 15, 0],
      "1f1f8-1f1ea": [["🇸🇪"], "", "", ["flag-se"], 3, 50, 15, 0],
      "1f1f8-1f1ec": [["🇸🇬"], "", "", ["flag-sg"], 3, 51, 15, 0],
      "1f1f8-1f1ed": [["🇸🇭"], "", "", ["flag-sh"], 3, 52, 15, 0],
      "1f1f8-1f1ee": [["🇸🇮"], "", "", ["flag-si"], 3, 53, 15, 0],
      "1f1f8-1f1ef": [["🇸🇯"], "", "", ["flag-sj"], 3, 54, 15, 0],
      "1f1f8-1f1f0": [["🇸🇰"], "", "", ["flag-sk"], 3, 55, 15, 0],
      "1f1f8-1f1f1": [["🇸🇱"], "", "", ["flag-sl"], 3, 56, 15, 0],
      "1f1f8-1f1f2": [["🇸🇲"], "", "", ["flag-sm"], 3, 57, 15, 0],
      "1f1f8-1f1f3": [["🇸🇳"], "", "", ["flag-sn"], 3, 58, 15, 0],
      "1f1f8-1f1f4": [["🇸🇴"], "", "", ["flag-so"], 3, 59, 15, 0],
      "1f1f8-1f1f7": [["🇸🇷"], "", "", ["flag-sr"], 3, 60, 15, 0],
      "1f1f8-1f1f8": [["🇸🇸"], "", "", ["flag-ss"], 4, 0, 15, 0],
      "1f1f8-1f1f9": [["🇸🇹"], "", "", ["flag-st"], 4, 1, 15, 0],
      "1f1f8-1f1fb": [["🇸🇻"], "", "", ["flag-sv"], 4, 2, 15, 0],
      "1f1f8-1f1fd": [["🇸🇽"], "", "", ["flag-sx"], 4, 3, 15, 0],
      "1f1f8-1f1fe": [["🇸🇾"], "", "", ["flag-sy"], 4, 4, 15, 0],
      "1f1f8-1f1ff": [["🇸🇿"], "", "", ["flag-sz"], 4, 5, 15, 0],
      "1f1f9-1f1e6": [["🇹🇦"], "", "", ["flag-ta"], 4, 6, 15, 0],
      "1f1f9-1f1e8": [["🇹🇨"], "", "", ["flag-tc"], 4, 7, 15, 0],
      "1f1f9-1f1e9": [["🇹🇩"], "", "", ["flag-td"], 4, 8, 15, 0],
      "1f1f9-1f1eb": [["🇹🇫"], "", "", ["flag-tf"], 4, 9, 15, 0],
      "1f1f9-1f1ec": [["🇹🇬"], "", "", ["flag-tg"], 4, 10, 15, 0],
      "1f1f9-1f1ed": [["🇹🇭"], "", "", ["flag-th"], 4, 11, 15, 0],
      "1f1f9-1f1ef": [["🇹🇯"], "", "", ["flag-tj"], 4, 12, 15, 0],
      "1f1f9-1f1f0": [["🇹🇰"], "", "", ["flag-tk"], 4, 13, 15, 0],
      "1f1f9-1f1f1": [["🇹🇱"], "", "", ["flag-tl"], 4, 14, 15, 0],
      "1f1f9-1f1f2": [["🇹🇲"], "", "", ["flag-tm"], 4, 15, 15, 0],
      "1f1f9-1f1f3": [["🇹🇳"], "", "", ["flag-tn"], 4, 16, 15, 0],
      "1f1f9-1f1f4": [["🇹🇴"], "", "", ["flag-to"], 4, 17, 15, 0],
      "1f1f9-1f1f7": [["🇹🇷"], "", "", ["flag-tr"], 4, 18, 15, 0],
      "1f1f9-1f1f9": [["🇹🇹"], "", "", ["flag-tt"], 4, 19, 15, 0],
      "1f1f9-1f1fb": [["🇹🇻"], "", "", ["flag-tv"], 4, 20, 15, 0],
      "1f1f9-1f1fc": [["🇹🇼"], "", "", ["flag-tw"], 4, 21, 15, 0],
      "1f1f9-1f1ff": [["🇹🇿"], "", "", ["flag-tz"], 4, 22, 15, 0],
      "1f1fa-1f1e6": [["🇺🇦"], "", "", ["flag-ua"], 4, 23, 15, 0],
      "1f1fa-1f1ec": [["🇺🇬"], "", "", ["flag-ug"], 4, 24, 15, 0],
      "1f1fa-1f1f2": [["🇺🇲"], "", "", ["flag-um"], 4, 25, 15, 0],
      "1f1fa-1f1f3": [["🇺🇳"], "", "", ["flag-un"], 4, 26, 15, 0],
      "1f1fa-1f1f8": [["🇺🇸"], "", "󾓦", ["us", "flag-us"], 4, 27, 15, 0],
      "1f1fa-1f1fe": [["🇺🇾"], "", "", ["flag-uy"], 4, 28, 15, 0],
      "1f1fa-1f1ff": [["🇺🇿"], "", "", ["flag-uz"], 4, 29, 15, 0],
      "1f1fb-1f1e6": [["🇻🇦"], "", "", ["flag-va"], 4, 30, 15, 0],
      "1f1fb-1f1e8": [["🇻🇨"], "", "", ["flag-vc"], 4, 31, 15, 0],
      "1f1fb-1f1ea": [["🇻🇪"], "", "", ["flag-ve"], 4, 32, 15, 0],
      "1f1fb-1f1ec": [["🇻🇬"], "", "", ["flag-vg"], 4, 33, 15, 0],
      "1f1fb-1f1ee": [["🇻🇮"], "", "", ["flag-vi"], 4, 34, 15, 0],
      "1f1fb-1f1f3": [["🇻🇳"], "", "", ["flag-vn"], 4, 35, 15, 0],
      "1f1fb-1f1fa": [["🇻🇺"], "", "", ["flag-vu"], 4, 36, 15, 0],
      "1f1fc-1f1eb": [["🇼🇫"], "", "", ["flag-wf"], 4, 37, 15, 0],
      "1f1fc-1f1f8": [["🇼🇸"], "", "", ["flag-ws"], 4, 38, 15, 0],
      "1f1fd-1f1f0": [["🇽🇰"], "", "", ["flag-xk"], 4, 39, 15, 0],
      "1f1fe-1f1ea": [["🇾🇪"], "", "", ["flag-ye"], 4, 40, 15, 0],
      "1f1fe-1f1f9": [["🇾🇹"], "", "", ["flag-yt"], 4, 41, 15, 0],
      "1f1ff-1f1e6": [["🇿🇦"], "", "", ["flag-za"], 4, 42, 15, 0],
      "1f1ff-1f1f2": [["🇿🇲"], "", "", ["flag-zm"], 4, 43, 15, 0],
      "1f1ff-1f1fc": [["🇿🇼"], "", "", ["flag-zw"], 4, 44, 15, 0],
      "1f201": [["🈁"], "", "󾬤", ["koko"], 4, 45, 15, 0],
      "1f202-fe0f": [["🈂️", "🈂"], "", "󾬿", ["sa"], 4, 46, 15, 0],
      "1f21a": [["🈚"], "", "󾬺", ["u7121"], 4, 47, 15, 0],
      "1f22f": [["🈯"], "", "󾭀", ["u6307"], 4, 48, 15, 0],
      "1f232": [["🈲"], "", "󾬮", ["u7981"], 4, 49, 15, 0],
      "1f233": [["🈳"], "", "󾬯", ["u7a7a"], 4, 50, 15, 0],
      "1f234": [["🈴"], "", "󾬰", ["u5408"], 4, 51, 15, 0],
      "1f235": [["🈵"], "", "󾬱", ["u6e80"], 4, 52, 15, 0],
      "1f236": [["🈶"], "", "󾬹", ["u6709"], 4, 53, 15, 0],
      "1f237-fe0f": [["🈷️", "🈷"], "", "󾬻", ["u6708"], 4, 54, 15, 0],
      "1f238": [["🈸"], "", "󾬼", ["u7533"], 4, 55, 15, 0],
      "1f239": [["🈹"], "", "󾬾", ["u5272"], 4, 56, 15, 0],
      "1f23a": [["🈺"], "", "󾭁", ["u55b6"], 4, 57, 15, 0],
      "1f250": [["🉐"], "", "󾬽", ["ideograph_advantage"], 4, 58, 15, 0],
      "1f251": [["🉑"], "", "󾭐", ["accept"], 4, 59, 15, 0],
      "1f300": [["🌀"], "", "󾀅", ["cyclone"], 4, 60, 15, 0],
      "1f301": [["🌁"], "", "󾀆", ["foggy"], 5, 0, 15, 0],
      "1f302": [["🌂"], "", "󾀇", ["closed_umbrella"], 5, 1, 15, 0],
      "1f303": [["🌃"], "", "󾀈", ["night_with_stars"], 5, 2, 15, 0],
      "1f304": [["🌄"], "", "󾀉", ["sunrise_over_mountains"], 5, 3, 15, 0],
      "1f305": [["🌅"], "", "󾀊", ["sunrise"], 5, 4, 15, 0],
      "1f306": [["🌆"], "", "󾀋", ["city_sunset"], 5, 5, 15, 0],
      "1f307": [["🌇"], "", "󾀌", ["city_sunrise"], 5, 6, 15, 0],
      "1f308": [["🌈"], "", "󾀍", ["rainbow"], 5, 7, 15, 0],
      "1f309": [["🌉"], "", "󾀐", ["bridge_at_night"], 5, 8, 15, 0],
      "1f30a": [["🌊"], "", "󾀸", ["ocean"], 5, 9, 15, 0],
      "1f30b": [["🌋"], "", "󾀺", ["volcano"], 5, 10, 15, 0],
      "1f30c": [["🌌"], "", "󾀻", ["milky_way"], 5, 11, 15, 0],
      "1f30d": [["🌍"], "", "", ["earth_africa"], 5, 12, 15, 0],
      "1f30e": [["🌎"], "", "", ["earth_americas"], 5, 13, 15, 0],
      "1f30f": [["🌏"], "", "󾀹", ["earth_asia"], 5, 14, 15, 0],
      "1f310": [["🌐"], "", "", ["globe_with_meridians"], 5, 15, 15, 0],
      "1f311": [["🌑"], "", "󾀑", ["new_moon"], 5, 16, 15, 0],
      "1f312": [["🌒"], "", "", ["waxing_crescent_moon"], 5, 17, 15, 0],
      "1f313": [["🌓"], "", "󾀓", ["first_quarter_moon"], 5, 18, 15, 0],
      "1f314": [["🌔"], "", "󾀒", ["moon", "waxing_gibbous_moon"], 5, 19, 15, 0],
      "1f315": [["🌕"], "", "󾀕", ["full_moon"], 5, 20, 15, 0],
      "1f316": [["🌖"], "", "", ["waning_gibbous_moon"], 5, 21, 15, 0],
      "1f317": [["🌗"], "", "", ["last_quarter_moon"], 5, 22, 15, 0],
      "1f318": [["🌘"], "", "", ["waning_crescent_moon"], 5, 23, 15, 0],
      "1f319": [["🌙"], "", "󾀔", ["crescent_moon"], 5, 24, 15, 0],
      "1f31a": [["🌚"], "", "", ["new_moon_with_face"], 5, 25, 15, 0],
      "1f31b": [["🌛"], "", "󾀖", ["first_quarter_moon_with_face"], 5, 26, 15, 0],
      "1f31c": [["🌜"], "", "", ["last_quarter_moon_with_face"], 5, 27, 15, 0],
      "1f31d": [["🌝"], "", "", ["full_moon_with_face"], 5, 28, 15, 0],
      "1f31e": [["🌞"], "", "", ["sun_with_face"], 5, 29, 15, 0],
      "1f31f": [["🌟"], "", "󾭩", ["star2"], 5, 30, 15, 0],
      "1f320": [["🌠"], "", "󾭪", ["stars"], 5, 31, 15, 0],
      "1f321-fe0f": [["🌡️", "🌡"], "", "", ["thermometer"], 5, 32, 15, 0],
      "1f324-fe0f": [["🌤️", "🌤"], "", "", ["mostly_sunny", "sun_small_cloud"], 5, 33, 15, 0],
      "1f325-fe0f": [["🌥️", "🌥"], "", "", ["barely_sunny", "sun_behind_cloud"], 5, 34, 15, 0],
      "1f326-fe0f": [["🌦️", "🌦"], "", "", ["partly_sunny_rain", "sun_behind_rain_cloud"], 5, 35, 15, 0],
      "1f327-fe0f": [["🌧️", "🌧"], "", "", ["rain_cloud"], 5, 36, 15, 0],
      "1f328-fe0f": [["🌨️", "🌨"], "", "", ["snow_cloud"], 5, 37, 15, 0],
      "1f329-fe0f": [["🌩️", "🌩"], "", "", ["lightning", "lightning_cloud"], 5, 38, 15, 0],
      "1f32a-fe0f": [["🌪️", "🌪"], "", "", ["tornado", "tornado_cloud"], 5, 39, 15, 0],
      "1f32b-fe0f": [["🌫️", "🌫"], "", "", ["fog"], 5, 40, 15, 0],
      "1f32c-fe0f": [["🌬️", "🌬"], "", "", ["wind_blowing_face"], 5, 41, 15, 0],
      "1f32d": [["🌭"], "", "", ["hotdog"], 5, 42, 15, 0],
      "1f32e": [["🌮"], "", "", ["taco"], 5, 43, 15, 0],
      "1f32f": [["🌯"], "", "", ["burrito"], 5, 44, 15, 0],
      "1f330": [["🌰"], "", "󾁌", ["chestnut"], 5, 45, 15, 0],
      "1f331": [["🌱"], "", "󾀾", ["seedling"], 5, 46, 15, 0],
      "1f332": [["🌲"], "", "", ["evergreen_tree"], 5, 47, 15, 0],
      "1f333": [["🌳"], "", "", ["deciduous_tree"], 5, 48, 15, 0],
      "1f334": [["🌴"], "", "󾁇", ["palm_tree"], 5, 49, 15, 0],
      "1f335": [["🌵"], "", "󾁈", ["cactus"], 5, 50, 15, 0],
      "1f336-fe0f": [["🌶️", "🌶"], "", "", ["hot_pepper"], 5, 51, 15, 0],
      "1f337": [["🌷"], "", "󾀽", ["tulip"], 5, 52, 15, 0],
      "1f338": [["🌸"], "", "󾁀", ["cherry_blossom"], 5, 53, 15, 0],
      "1f339": [["🌹"], "", "󾁁", ["rose"], 5, 54, 15, 0],
      "1f33a": [["🌺"], "", "󾁅", ["hibiscus"], 5, 55, 15, 0],
      "1f33b": [["🌻"], "", "󾁆", ["sunflower"], 5, 56, 15, 0],
      "1f33c": [["🌼"], "", "󾁍", ["blossom"], 5, 57, 15, 0],
      "1f33d": [["🌽"], "", "󾁊", ["corn"], 5, 58, 15, 0],
      "1f33e": [["🌾"], "", "󾁉", ["ear_of_rice"], 5, 59, 15, 0],
      "1f33f": [["🌿"], "", "󾁎", ["herb"], 5, 60, 15, 0],
      "1f340": [["🍀"], "", "󾀼", ["four_leaf_clover"], 6, 0, 15, 0],
      "1f341": [["🍁"], "", "󾀿", ["maple_leaf"], 6, 1, 15, 0],
      "1f342": [["🍂"], "", "󾁂", ["fallen_leaf"], 6, 2, 15, 0],
      "1f343": [["🍃"], "", "󾁃", ["leaves"], 6, 3, 15, 0],
      "1f344": [["🍄"], "", "󾁋", ["mushroom"], 6, 4, 15, 0],
      "1f345": [["🍅"], "", "󾁕", ["tomato"], 6, 5, 15, 0],
      "1f346": [["🍆"], "", "󾁖", ["eggplant"], 6, 6, 15, 0],
      "1f347": [["🍇"], "", "󾁙", ["grapes"], 6, 7, 15, 0],
      "1f348": [["🍈"], "", "󾁗", ["melon"], 6, 8, 15, 0],
      "1f349": [["🍉"], "", "󾁔", ["watermelon"], 6, 9, 15, 0],
      "1f34a": [["🍊"], "", "󾁒", ["tangerine"], 6, 10, 15, 0],
      "1f34b": [["🍋"], "", "", ["lemon"], 6, 11, 15, 0],
      "1f34c": [["🍌"], "", "󾁐", ["banana"], 6, 12, 15, 0],
      "1f34d": [["🍍"], "", "󾁘", ["pineapple"], 6, 13, 15, 0],
      "1f34e": [["🍎"], "", "󾁑", ["apple"], 6, 14, 15, 0],
      "1f34f": [["🍏"], "", "󾁛", ["green_apple"], 6, 15, 15, 0],
      "1f350": [["🍐"], "", "", ["pear"], 6, 16, 15, 0],
      "1f351": [["🍑"], "", "󾁚", ["peach"], 6, 17, 15, 0],
      "1f352": [["🍒"], "", "󾁏", ["cherries"], 6, 18, 15, 0],
      "1f353": [["🍓"], "", "󾁓", ["strawberry"], 6, 19, 15, 0],
      "1f354": [["🍔"], "", "󾥠", ["hamburger"], 6, 20, 15, 0],
      "1f355": [["🍕"], "", "󾥵", ["pizza"], 6, 21, 15, 0],
      "1f356": [["🍖"], "", "󾥲", ["meat_on_bone"], 6, 22, 15, 0],
      "1f357": [["🍗"], "", "󾥶", ["poultry_leg"], 6, 23, 15, 0],
      "1f358": [["🍘"], "", "󾥩", ["rice_cracker"], 6, 24, 15, 0],
      "1f359": [["🍙"], "", "󾥡", ["rice_ball"], 6, 25, 15, 0],
      "1f35a": [["🍚"], "", "󾥪", ["rice"], 6, 26, 15, 0],
      "1f35b": [["🍛"], "", "󾥬", ["curry"], 6, 27, 15, 0],
      "1f35c": [["🍜"], "", "󾥣", ["ramen"], 6, 28, 15, 0],
      "1f35d": [["🍝"], "", "󾥫", ["spaghetti"], 6, 29, 15, 0],
      "1f35e": [["🍞"], "", "󾥤", ["bread"], 6, 30, 15, 0],
      "1f35f": [["🍟"], "", "󾥧", ["fries"], 6, 31, 15, 0],
      "1f360": [["🍠"], "", "󾥴", ["sweet_potato"], 6, 32, 15, 0],
      "1f361": [["🍡"], "", "󾥨", ["dango"], 6, 33, 15, 0],
      "1f362": [["🍢"], "", "󾥭", ["oden"], 6, 34, 15, 0],
      "1f363": [["🍣"], "", "󾥮", ["sushi"], 6, 35, 15, 0],
      "1f364": [["🍤"], "", "󾥿", ["fried_shrimp"], 6, 36, 15, 0],
      "1f365": [["🍥"], "", "󾥳", ["fish_cake"], 6, 37, 15, 0],
      "1f366": [["🍦"], "", "󾥦", ["icecream"], 6, 38, 15, 0],
      "1f367": [["🍧"], "", "󾥱", ["shaved_ice"], 6, 39, 15, 0],
      "1f368": [["🍨"], "", "󾥷", ["ice_cream"], 6, 40, 15, 0],
      "1f369": [["🍩"], "", "󾥸", ["doughnut"], 6, 41, 15, 0],
      "1f36a": [["🍪"], "", "󾥹", ["cookie"], 6, 42, 15, 0],
      "1f36b": [["🍫"], "", "󾥺", ["chocolate_bar"], 6, 43, 15, 0],
      "1f36c": [["🍬"], "", "󾥻", ["candy"], 6, 44, 15, 0],
      "1f36d": [["🍭"], "", "󾥼", ["lollipop"], 6, 45, 15, 0],
      "1f36e": [["🍮"], "", "󾥽", ["custard"], 6, 46, 15, 0],
      "1f36f": [["🍯"], "", "󾥾", ["honey_pot"], 6, 47, 15, 0],
      "1f370": [["🍰"], "", "󾥢", ["cake"], 6, 48, 15, 0],
      "1f371": [["🍱"], "", "󾥯", ["bento"], 6, 49, 15, 0],
      "1f372": [["🍲"], "", "󾥰", ["stew"], 6, 50, 15, 0],
      "1f373": [["🍳"], "", "󾥥", ["fried_egg", "cooking"], 6, 51, 15, 0],
      "1f374": [["🍴"], "", "󾦀", ["fork_and_knife"], 6, 52, 15, 0],
      "1f375": [["🍵"], "", "󾦄", ["tea"], 6, 53, 15, 0],
      "1f376": [["🍶"], "", "󾦅", ["sake"], 6, 54, 15, 0],
      "1f377": [["🍷"], "", "󾦆", ["wine_glass"], 6, 55, 15, 0],
      "1f378": [["🍸"], "", "󾦂", ["cocktail"], 6, 56, 15, 0],
      "1f379": [["🍹"], "", "󾦈", ["tropical_drink"], 6, 57, 15, 0],
      "1f37a": [["🍺"], "", "󾦃", ["beer"], 6, 58, 15, 0],
      "1f37b": [["🍻"], "", "󾦇", ["beers"], 6, 59, 15, 0],
      "1f37c": [["🍼"], "", "", ["baby_bottle"], 6, 60, 15, 0],
      "1f37d-fe0f": [["🍽️", "🍽"], "", "", ["knife_fork_plate"], 7, 0, 15, 0],
      "1f37e": [["🍾"], "", "", ["champagne"], 7, 1, 15, 0],
      "1f37f": [["🍿"], "", "", ["popcorn"], 7, 2, 15, 0],
      "1f380": [["🎀"], "", "󾔏", ["ribbon"], 7, 3, 15, 0],
      "1f381": [["🎁"], "", "󾔐", ["gift"], 7, 4, 15, 0],
      "1f382": [["🎂"], "", "󾔑", ["birthday"], 7, 5, 15, 0],
      "1f383": [["🎃"], "", "󾔟", ["jack_o_lantern"], 7, 6, 15, 0],
      "1f384": [["🎄"], "", "󾔒", ["christmas_tree"], 7, 7, 15, 0],
      "1f385": [["🎅"], "", "󾔓", ["santa"], 7, 8, 15, 0],
      "1f386": [["🎆"], "", "󾔕", ["fireworks"], 7, 14, 15, 0],
      "1f387": [["🎇"], "", "󾔝", ["sparkler"], 7, 15, 15, 0],
      "1f388": [["🎈"], "", "󾔖", ["balloon"], 7, 16, 15, 0],
      "1f389": [["🎉"], "", "󾔗", ["tada"], 7, 17, 15, 0],
      "1f38a": [["🎊"], "", "󾔠", ["confetti_ball"], 7, 18, 15, 0],
      "1f38b": [["🎋"], "", "󾔡", ["tanabata_tree"], 7, 19, 15, 0],
      "1f38c": [["🎌"], "", "󾔔", ["crossed_flags"], 7, 20, 15, 0],
      "1f38d": [["🎍"], "", "󾔘", ["bamboo"], 7, 21, 15, 0],
      "1f38e": [["🎎"], "", "󾔙", ["dolls"], 7, 22, 15, 0],
      "1f38f": [["🎏"], "", "󾔜", ["flags"], 7, 23, 15, 0],
      "1f390": [["🎐"], "", "󾔞", ["wind_chime"], 7, 24, 15, 0],
      "1f391": [["🎑"], "", "󾀗", ["rice_scene"], 7, 25, 15, 0],
      "1f392": [["🎒"], "", "󾔛", ["school_satchel"], 7, 26, 15, 0],
      "1f393": [["🎓"], "", "󾔚", ["mortar_board"], 7, 27, 15, 0],
      "1f396-fe0f": [["🎖️", "🎖"], "", "", ["medal"], 7, 28, 15, 0],
      "1f397-fe0f": [["🎗️", "🎗"], "", "", ["reminder_ribbon"], 7, 29, 15, 0],
      "1f399-fe0f": [["🎙️", "🎙"], "", "", ["studio_microphone"], 7, 30, 15, 0],
      "1f39a-fe0f": [["🎚️", "🎚"], "", "", ["level_slider"], 7, 31, 15, 0],
      "1f39b-fe0f": [["🎛️", "🎛"], "", "", ["control_knobs"], 7, 32, 15, 0],
      "1f39e-fe0f": [["🎞️", "🎞"], "", "", ["film_frames"], 7, 33, 15, 0],
      "1f39f-fe0f": [["🎟️", "🎟"], "", "", ["admission_tickets"], 7, 34, 15, 0],
      "1f3a0": [["🎠"], "", "󾟼", ["carousel_horse"], 7, 35, 15, 0],
      "1f3a1": [["🎡"], "", "󾟽", ["ferris_wheel"], 7, 36, 15, 0],
      "1f3a2": [["🎢"], "", "󾟾", ["roller_coaster"], 7, 37, 15, 0],
      "1f3a3": [["🎣"], "", "󾟿", ["fishing_pole_and_fish"], 7, 38, 15, 0],
      "1f3a4": [["🎤"], "", "󾠀", ["microphone"], 7, 39, 15, 0],
      "1f3a5": [["🎥"], "", "󾠁", ["movie_camera"], 7, 40, 15, 0],
      "1f3a6": [["🎦"], "", "󾠂", ["cinema"], 7, 41, 15, 0],
      "1f3a7": [["🎧"], "", "󾠃", ["headphones"], 7, 42, 15, 0],
      "1f3a8": [["🎨"], "", "󾠄", ["art"], 7, 43, 15, 0],
      "1f3a9": [["🎩"], "", "󾠅", ["tophat"], 7, 44, 15, 0],
      "1f3aa": [["🎪"], "", "󾠆", ["circus_tent"], 7, 45, 15, 0],
      "1f3ab": [["🎫"], "", "󾠇", ["ticket"], 7, 46, 15, 0],
      "1f3ac": [["🎬"], "", "󾠈", ["clapper"], 7, 47, 15, 0],
      "1f3ad": [["🎭"], "", "󾠉", ["performing_arts"], 7, 48, 15, 0],
      "1f3ae": [["🎮"], "", "󾠊", ["video_game"], 7, 49, 15, 0],
      "1f3af": [["🎯"], "", "󾠌", ["dart"], 7, 50, 15, 0],
      "1f3b0": [["🎰"], "", "󾠍", ["slot_machine"], 7, 51, 15, 0],
      "1f3b1": [["🎱"], "", "󾠎", ["8ball"], 7, 52, 15, 0],
      "1f3b2": [["🎲"], "", "󾠏", ["game_die"], 7, 53, 15, 0],
      "1f3b3": [["🎳"], "", "󾠐", ["bowling"], 7, 54, 15, 0],
      "1f3b4": [["🎴"], "", "󾠑", ["flower_playing_cards"], 7, 55, 15, 0],
      "1f3b5": [["🎵"], "", "󾠓", ["musical_note"], 7, 56, 15, 0],
      "1f3b6": [["🎶"], "", "󾠔", ["notes"], 7, 57, 15, 0],
      "1f3b7": [["🎷"], "", "󾠕", ["saxophone"], 7, 58, 15, 0],
      "1f3b8": [["🎸"], "", "󾠖", ["guitar"], 7, 59, 15, 0],
      "1f3b9": [["🎹"], "", "󾠗", ["musical_keyboard"], 7, 60, 15, 0],
      "1f3ba": [["🎺"], "", "󾠘", ["trumpet"], 8, 0, 15, 0],
      "1f3bb": [["🎻"], "", "󾠙", ["violin"], 8, 1, 15, 0],
      "1f3bc": [["🎼"], "", "󾠚", ["musical_score"], 8, 2, 15, 0],
      "1f3bd": [["🎽"], "", "󾟐", ["running_shirt_with_sash"], 8, 3, 15, 0],
      "1f3be": [["🎾"], "", "󾟓", ["tennis"], 8, 4, 15, 0],
      "1f3bf": [["🎿"], "", "󾟕", ["ski"], 8, 5, 15, 0],
      "1f3c0": [["🏀"], "", "󾟖", ["basketball"], 8, 6, 15, 0],
      "1f3c1": [["🏁"], "", "󾟗", ["checkered_flag"], 8, 7, 15, 0],
      "1f3c2": [["🏂"], "", "󾟘", ["snowboarder"], 8, 8, 15, 0],
      "1f3c3-200d-2640-fe0f": [["🏃‍♀️", "🏃‍♀"], "", "", ["woman-running"], 8, 14, 15, 0],
      "1f3c3-200d-2642-fe0f": [["🏃‍♂️", "🏃‍♂", "🏃"], "", "", ["man-running", "runner", "running"], 8, 20, 15, 0],
      "1f3c4-200d-2640-fe0f": [["🏄‍♀️", "🏄‍♀"], "", "", ["woman-surfing"], 8, 32, 15, 0],
      "1f3c4-200d-2642-fe0f": [["🏄‍♂️", "🏄‍♂", "🏄"], "", "", ["man-surfing", "surfer"], 8, 38, 15, 0],
      "1f3c5": [["🏅"], "", "", ["sports_medal"], 8, 50, 15, 0],
      "1f3c6": [["🏆"], "", "󾟛", ["trophy"], 8, 51, 15, 0],
      "1f3c7": [["🏇"], "", "", ["horse_racing"], 8, 52, 15, 0],
      "1f3c8": [["🏈"], "", "󾟝", ["football"], 8, 58, 15, 0],
      "1f3c9": [["🏉"], "", "", ["rugby_football"], 8, 59, 15, 0],
      "1f3ca-200d-2640-fe0f": [["🏊‍♀️", "🏊‍♀"], "", "", ["woman-swimming"], 8, 60, 15, 0],
      "1f3ca-200d-2642-fe0f": [["🏊‍♂️", "🏊‍♂", "🏊"], "", "", ["man-swimming", "swimmer"], 9, 5, 15, 0],
      "1f3cb-fe0f-200d-2640-fe0f": [["🏋️‍♀️"], "", "", ["woman-lifting-weights"], 9, 17, 7, 0],
      "1f3cb-fe0f-200d-2642-fe0f": [["🏋️‍♂️", "🏋️", "🏋"], "", "", ["man-lifting-weights", "weight_lifter"], 9, 23, 7, 0],
      "1f3cc-fe0f-200d-2640-fe0f": [["🏌️‍♀️"], "", "", ["woman-golfing"], 9, 35, 7, 0],
      "1f3cc-fe0f-200d-2642-fe0f": [["🏌️‍♂️", "🏌️", "🏌"], "", "", ["man-golfing", "golfer"], 9, 41, 7, 0],
      "1f3cd-fe0f": [["🏍️", "🏍"], "", "", ["racing_motorcycle"], 9, 53, 15, 0],
      "1f3ce-fe0f": [["🏎️", "🏎"], "", "", ["racing_car"], 9, 54, 15, 0],
      "1f3cf": [["🏏"], "", "", ["cricket_bat_and_ball"], 9, 55, 15, 0],
      "1f3d0": [["🏐"], "", "", ["volleyball"], 9, 56, 15, 0],
      "1f3d1": [["🏑"], "", "", ["field_hockey_stick_and_ball"], 9, 57, 15, 0],
      "1f3d2": [["🏒"], "", "", ["ice_hockey_stick_and_puck"], 9, 58, 15, 0],
      "1f3d3": [["🏓"], "", "", ["table_tennis_paddle_and_ball"], 9, 59, 15, 0],
      "1f3d4-fe0f": [["🏔️", "🏔"], "", "", ["snow_capped_mountain"], 9, 60, 15, 0],
      "1f3d5-fe0f": [["🏕️", "🏕"], "", "", ["camping"], 10, 0, 15, 0],
      "1f3d6-fe0f": [["🏖️", "🏖"], "", "", ["beach_with_umbrella"], 10, 1, 15, 0],
      "1f3d7-fe0f": [["🏗️", "🏗"], "", "", ["building_construction"], 10, 2, 15, 0],
      "1f3d8-fe0f": [["🏘️", "🏘"], "", "", ["house_buildings"], 10, 3, 15, 0],
      "1f3d9-fe0f": [["🏙️", "🏙"], "", "", ["cityscape"], 10, 4, 15, 0],
      "1f3da-fe0f": [["🏚️", "🏚"], "", "", ["derelict_house_building"], 10, 5, 15, 0],
      "1f3db-fe0f": [["🏛️", "🏛"], "", "", ["classical_building"], 10, 6, 15, 0],
      "1f3dc-fe0f": [["🏜️", "🏜"], "", "", ["desert"], 10, 7, 15, 0],
      "1f3dd-fe0f": [["🏝️", "🏝"], "", "", ["desert_island"], 10, 8, 15, 0],
      "1f3de-fe0f": [["🏞️", "🏞"], "", "", ["national_park"], 10, 9, 15, 0],
      "1f3df-fe0f": [["🏟️", "🏟"], "", "", ["stadium"], 10, 10, 15, 0],
      "1f3e0": [["🏠"], "", "󾒰", ["house"], 10, 11, 15, 0],
      "1f3e1": [["🏡"], "", "󾒱", ["house_with_garden"], 10, 12, 15, 0],
      "1f3e2": [["🏢"], "", "󾒲", ["office"], 10, 13, 15, 0],
      "1f3e3": [["🏣"], "", "󾒳", ["post_office"], 10, 14, 15, 0],
      "1f3e4": [["🏤"], "", "", ["european_post_office"], 10, 15, 15, 0],
      "1f3e5": [["🏥"], "", "󾒴", ["hospital"], 10, 16, 15, 0],
      "1f3e6": [["🏦"], "", "󾒵", ["bank"], 10, 17, 15, 0],
      "1f3e7": [["🏧"], "", "󾒶", ["atm"], 10, 18, 15, 0],
      "1f3e8": [["🏨"], "", "󾒷", ["hotel"], 10, 19, 15, 0],
      "1f3e9": [["🏩"], "", "󾒸", ["love_hotel"], 10, 20, 15, 0],
      "1f3ea": [["🏪"], "", "󾒹", ["convenience_store"], 10, 21, 15, 0],
      "1f3eb": [["🏫"], "", "󾒺", ["school"], 10, 22, 15, 0],
      "1f3ec": [["🏬"], "", "󾒽", ["department_store"], 10, 23, 15, 0],
      "1f3ed": [["🏭"], "", "󾓀", ["factory"], 10, 24, 15, 0],
      "1f3ee": [["🏮"], "", "󾓂", ["izakaya_lantern", "lantern"], 10, 25, 15, 0],
      "1f3ef": [["🏯"], "", "󾒾", ["japanese_castle"], 10, 26, 15, 0],
      "1f3f0": [["🏰"], "", "󾒿", ["european_castle"], 10, 27, 15, 0],
      "1f3f3-fe0f-200d-1f308": [["🏳️‍🌈", "🏳‍🌈"], "", "", ["rainbow-flag"], 10, 28, 15, 0],
      "1f3f3-fe0f-200d-26a7-fe0f": [["🏳️‍⚧️"], "", "", ["transgender_flag"], 10, 29, 7, 0],
      "1f3f3-fe0f": [["🏳️", "🏳"], "", "", ["waving_white_flag"], 10, 30, 15, 0],
      "1f3f4-200d-2620-fe0f": [["🏴‍☠️", "🏴‍☠"], "", "", ["pirate_flag"], 10, 31, 15, 0],
      "1f3f4-e0067-e0062-e0065-e006e-e0067-e007f": [["🏴󠁧󠁢󠁥󠁮󠁧󠁿"], "", "", ["flag-england"], 10, 32, 15, 0],
      "1f3f4-e0067-e0062-e0073-e0063-e0074-e007f": [["🏴󠁧󠁢󠁳󠁣󠁴󠁿"], "", "", ["flag-scotland"], 10, 33, 15, 0],
      "1f3f4-e0067-e0062-e0077-e006c-e0073-e007f": [["🏴󠁧󠁢󠁷󠁬󠁳󠁿"], "", "", ["flag-wales"], 10, 34, 15, 0],
      "1f3f4": [["🏴"], "", "", ["waving_black_flag"], 10, 35, 15, 0],
      "1f3f5-fe0f": [["🏵️", "🏵"], "", "", ["rosette"], 10, 36, 15, 0],
      "1f3f7-fe0f": [["🏷️", "🏷"], "", "", ["label"], 10, 37, 15, 0],
      "1f3f8": [["🏸"], "", "", ["badminton_racquet_and_shuttlecock"], 10, 38, 15, 0],
      "1f3f9": [["🏹"], "", "", ["bow_and_arrow"], 10, 39, 15, 0],
      "1f3fa": [["🏺"], "", "", ["amphora"], 10, 40, 15, 0],
      "1f3fb": [["🏻"], "", "", ["skin-tone-2"], 10, 41, 15, 0],
      "1f3fc": [["🏼"], "", "", ["skin-tone-3"], 10, 42, 15, 0],
      "1f3fd": [["🏽"], "", "", ["skin-tone-4"], 10, 43, 15, 0],
      "1f3fe": [["🏾"], "", "", ["skin-tone-5"], 10, 44, 15, 0],
      "1f3ff": [["🏿"], "", "", ["skin-tone-6"], 10, 45, 15, 0],
      "1f400": [["🐀"], "", "", ["rat"], 10, 46, 15, 0],
      "1f401": [["🐁"], "", "", ["mouse2"], 10, 47, 15, 0],
      "1f402": [["🐂"], "", "", ["ox"], 10, 48, 15, 0],
      "1f403": [["🐃"], "", "", ["water_buffalo"], 10, 49, 15, 0],
      "1f404": [["🐄"], "", "", ["cow2"], 10, 50, 15, 0],
      "1f405": [["🐅"], "", "", ["tiger2"], 10, 51, 15, 0],
      "1f406": [["🐆"], "", "", ["leopard"], 10, 52, 15, 0],
      "1f407": [["🐇"], "", "", ["rabbit2"], 10, 53, 15, 0],
      "1f408-200d-2b1b": [["🐈‍⬛"], "", "", ["black_cat"], 10, 54, 15, 0],
      "1f408": [["🐈"], "", "", ["cat2"], 10, 55, 15, 0],
      "1f409": [["🐉"], "", "", ["dragon"], 10, 56, 15, 0],
      "1f40a": [["🐊"], "", "", ["crocodile"], 10, 57, 15, 0],
      "1f40b": [["🐋"], "", "", ["whale2"], 10, 58, 15, 0],
      "1f40c": [["🐌"], "", "󾆹", ["snail"], 10, 59, 15, 0],
      "1f40d": [["🐍"], "", "󾇓", ["snake"], 10, 60, 15, 0],
      "1f40e": [["🐎"], "", "󾟜", ["racehorse"], 11, 0, 15, 0],
      "1f40f": [["🐏"], "", "", ["ram"], 11, 1, 15, 0],
      "1f410": [["🐐"], "", "", ["goat"], 11, 2, 15, 0],
      "1f411": [["🐑"], "", "󾇏", ["sheep"], 11, 3, 15, 0],
      "1f412": [["🐒"], "", "󾇎", ["monkey"], 11, 4, 15, 0],
      "1f413": [["🐓"], "", "", ["rooster"], 11, 5, 15, 0],
      "1f414": [["🐔"], "", "󾇔", ["chicken"], 11, 6, 15, 0],
      "1f415-200d-1f9ba": [["🐕‍🦺"], "", "", ["service_dog"], 11, 7, 15, 0],
      "1f415": [["🐕"], "", "", ["dog2"], 11, 8, 15, 0],
      "1f416": [["🐖"], "", "", ["pig2"], 11, 9, 15, 0],
      "1f417": [["🐗"], "", "󾇕", ["boar"], 11, 10, 15, 0],
      "1f418": [["🐘"], "", "󾇌", ["elephant"], 11, 11, 15, 0],
      "1f419": [["🐙"], "", "󾇅", ["octopus"], 11, 12, 15, 0],
      "1f41a": [["🐚"], "", "󾇆", ["shell"], 11, 13, 15, 0],
      "1f41b": [["🐛"], "", "󾇋", ["bug"], 11, 14, 15, 0],
      "1f41c": [["🐜"], "", "󾇚", ["ant"], 11, 15, 15, 0],
      "1f41d": [["🐝"], "", "󾇡", ["bee", "honeybee"], 11, 16, 15, 0],
      "1f41e": [["🐞"], "", "󾇢", ["ladybug", "lady_beetle"], 11, 17, 15, 0],
      "1f41f": [["🐟"], "", "󾆽", ["fish"], 11, 18, 15, 0],
      "1f420": [["🐠"], "", "󾇉", ["tropical_fish"], 11, 19, 15, 0],
      "1f421": [["🐡"], "", "󾇙", ["blowfish"], 11, 20, 15, 0],
      "1f422": [["🐢"], "", "󾇜", ["turtle"], 11, 21, 15, 0],
      "1f423": [["🐣"], "", "󾇝", ["hatching_chick"], 11, 22, 15, 0],
      "1f424": [["🐤"], "", "󾆺", ["baby_chick"], 11, 23, 15, 0],
      "1f425": [["🐥"], "", "󾆻", ["hatched_chick"], 11, 24, 15, 0],
      "1f426-200d-2b1b": [["🐦‍⬛"], "", "", ["black_bird"], 11, 25, 3, 0],
      "1f426": [["🐦"], "", "󾇈", ["bird"], 11, 26, 15, 0],
      "1f427": [["🐧"], "", "󾆼", ["penguin"], 11, 27, 15, 0],
      "1f428": [["🐨"], "", "󾇍", ["koala"], 11, 28, 15, 0],
      "1f429": [["🐩"], "", "󾇘", ["poodle"], 11, 29, 15, 0],
      "1f42a": [["🐪"], "", "", ["dromedary_camel"], 11, 30, 15, 0],
      "1f42b": [["🐫"], "", "󾇖", ["camel"], 11, 31, 15, 0],
      "1f42c": [["🐬"], "", "󾇇", ["dolphin", "flipper"], 11, 32, 15, 0],
      "1f42d": [["🐭"], "", "󾇂", ["mouse"], 11, 33, 15, 0],
      "1f42e": [["🐮"], "", "󾇑", ["cow"], 11, 34, 15, 0],
      "1f42f": [["🐯"], "", "󾇀", ["tiger"], 11, 35, 15, 0],
      "1f430": [["🐰"], "", "󾇒", ["rabbit"], 11, 36, 15, 0],
      "1f431": [["🐱"], "", "󾆸", ["cat"], 11, 37, 15, 0],
      "1f432": [["🐲"], "", "󾇞", ["dragon_face"], 11, 38, 15, 0],
      "1f433": [["🐳"], "", "󾇃", ["whale"], 11, 39, 15, 0],
      "1f434": [["🐴"], "", "󾆾", ["horse"], 11, 40, 15, 0],
      "1f435": [["🐵"], "", "󾇄", ["monkey_face"], 11, 41, 15, 0],
      "1f436": [["🐶"], "", "󾆷", ["dog"], 11, 42, 15, 0],
      "1f437": [["🐷"], "", "󾆿", ["pig"], 11, 43, 15, 0],
      "1f438": [["🐸"], "", "󾇗", ["frog"], 11, 44, 15, 0],
      "1f439": [["🐹"], "", "󾇊", ["hamster"], 11, 45, 15, 0],
      "1f43a": [["🐺"], "", "󾇐", ["wolf"], 11, 46, 15, 0],
      "1f43b-200d-2744-fe0f": [["🐻‍❄️", "🐻‍❄"], "", "", ["polar_bear"], 11, 47, 15, 0],
      "1f43b": [["🐻"], "", "󾇁", ["bear"], 11, 48, 15, 0],
      "1f43c": [["🐼"], "", "󾇟", ["panda_face"], 11, 49, 15, 0],
      "1f43d": [["🐽"], "", "󾇠", ["pig_nose"], 11, 50, 15, 0],
      "1f43e": [["🐾"], "", "󾇛", ["feet", "paw_prints"], 11, 51, 15, 0],
      "1f43f-fe0f": [["🐿️", "🐿"], "", "", ["chipmunk"], 11, 52, 15, 0],
      "1f440": [["👀"], "", "󾆐", ["eyes"], 11, 53, 15, 0],
      "1f441-fe0f-200d-1f5e8-fe0f": [["👁️‍🗨️"], "", "", ["eye-in-speech-bubble"], 11, 54, 7, 0],
      "1f441-fe0f": [["👁️", "👁"], "", "", ["eye"], 11, 55, 15, 0],
      "1f442": [["👂"], "", "󾆑", ["ear"], 11, 56, 15, 0],
      "1f443": [["👃"], "", "󾆒", ["nose"], 12, 1, 15, 0],
      "1f444": [["👄"], "", "󾆓", ["lips"], 12, 7, 15, 0],
      "1f445": [["👅"], "", "󾆔", ["tongue"], 12, 8, 15, 0],
      "1f446": [["👆"], "", "󾮙", ["point_up_2"], 12, 9, 15, 0],
      "1f447": [["👇"], "", "󾮚", ["point_down"], 12, 15, 15, 0],
      "1f448": [["👈"], "", "󾮛", ["point_left"], 12, 21, 15, 0],
      "1f449": [["👉"], "", "󾮜", ["point_right"], 12, 27, 15, 0],
      "1f44a": [["👊"], "", "󾮖", ["facepunch", "punch"], 12, 33, 15, 0],
      "1f44b": [["👋"], "", "󾮝", ["wave"], 12, 39, 15, 0],
      "1f44c": [["👌"], "", "󾮟", ["ok_hand"], 12, 45, 15, 0],
      "1f44d": [["👍"], "", "󾮗", ["+1", "thumbsup"], 12, 51, 15, 0],
      "1f44e": [["👎"], "", "󾮠", ["-1", "thumbsdown"], 12, 57, 15, 0],
      "1f44f": [["👏"], "", "󾮞", ["clap"], 13, 2, 15, 0],
      "1f450": [["👐"], "", "󾮡", ["open_hands"], 13, 8, 15, 0],
      "1f451": [["👑"], "", "󾓑", ["crown"], 13, 14, 15, 0],
      "1f452": [["👒"], "", "󾓔", ["womans_hat"], 13, 15, 15, 0],
      "1f453": [["👓"], "", "󾓎", ["eyeglasses"], 13, 16, 15, 0],
      "1f454": [["👔"], "", "󾓓", ["necktie"], 13, 17, 15, 0],
      "1f455": [["👕"], "", "󾓏", ["shirt", "tshirt"], 13, 18, 15, 0],
      "1f456": [["👖"], "", "󾓐", ["jeans"], 13, 19, 15, 0],
      "1f457": [["👗"], "", "󾓕", ["dress"], 13, 20, 15, 0],
      "1f458": [["👘"], "", "󾓙", ["kimono"], 13, 21, 15, 0],
      "1f459": [["👙"], "", "󾓚", ["bikini"], 13, 22, 15, 0],
      "1f45a": [["👚"], "", "󾓛", ["womans_clothes"], 13, 23, 15, 0],
      "1f45b": [["👛"], "", "󾓜", ["purse"], 13, 24, 15, 0],
      "1f45c": [["👜"], "", "󾓰", ["handbag"], 13, 25, 15, 0],
      "1f45d": [["👝"], "", "󾓱", ["pouch"], 13, 26, 15, 0],
      "1f45e": [["👞"], "", "󾓌", ["mans_shoe", "shoe"], 13, 27, 15, 0],
      "1f45f": [["👟"], "", "󾓍", ["athletic_shoe"], 13, 28, 15, 0],
      "1f460": [["👠"], "", "󾓖", ["high_heel"], 13, 29, 15, 0],
      "1f461": [["👡"], "", "󾓗", ["sandal"], 13, 30, 15, 0],
      "1f462": [["👢"], "", "󾓘", ["boot"], 13, 31, 15, 0],
      "1f463": [["👣"], "", "󾕓", ["footprints"], 13, 32, 15, 0],
      "1f464": [["👤"], "", "󾆚", ["bust_in_silhouette"], 13, 33, 15, 0],
      "1f465": [["👥"], "", "", ["busts_in_silhouette"], 13, 34, 15, 0],
      "1f466": [["👦"], "", "󾆛", ["boy"], 13, 35, 15, 0],
      "1f467": [["👧"], "", "󾆜", ["girl"], 13, 41, 15, 0],
      "1f468-200d-1f33e": [["👨‍🌾"], "", "", ["male-farmer"], 13, 47, 15, 0],
      "1f468-200d-1f373": [["👨‍🍳"], "", "", ["male-cook"], 13, 53, 15, 0],
      "1f468-200d-1f37c": [["👨‍🍼"], "", "", ["man_feeding_baby"], 13, 59, 15, 0],
      "1f468-200d-1f393": [["👨‍🎓"], "", "", ["male-student"], 14, 4, 15, 0],
      "1f468-200d-1f3a4": [["👨‍🎤"], "", "", ["male-singer"], 14, 10, 15, 0],
      "1f468-200d-1f3a8": [["👨‍🎨"], "", "", ["male-artist"], 14, 16, 15, 0],
      "1f468-200d-1f3eb": [["👨‍🏫"], "", "", ["male-teacher"], 14, 22, 15, 0],
      "1f468-200d-1f3ed": [["👨‍🏭"], "", "", ["male-factory-worker"], 14, 28, 15, 0],
      "1f468-200d-1f466-200d-1f466": [["👨‍👦‍👦"], "", "", ["man-boy-boy"], 14, 34, 15, 0],
      "1f468-200d-1f466": [["👨‍👦"], "", "", ["man-boy"], 14, 35, 15, 0],
      "1f468-200d-1f467-200d-1f466": [["👨‍👧‍👦"], "", "", ["man-girl-boy"], 14, 36, 15, 0],
      "1f468-200d-1f467-200d-1f467": [["👨‍👧‍👧"], "", "", ["man-girl-girl"], 14, 37, 15, 0],
      "1f468-200d-1f467": [["👨‍👧"], "", "", ["man-girl"], 14, 38, 15, 0],
      "1f468-200d-1f468-200d-1f466": [["👨‍👨‍👦"], "", "", ["man-man-boy"], 14, 39, 15, 0],
      "1f468-200d-1f468-200d-1f466-200d-1f466": [["👨‍👨‍👦‍👦"], "", "", ["man-man-boy-boy"], 14, 40, 15, 0],
      "1f468-200d-1f468-200d-1f467": [["👨‍👨‍👧"], "", "", ["man-man-girl"], 14, 41, 15, 0],
      "1f468-200d-1f468-200d-1f467-200d-1f466": [["👨‍👨‍👧‍👦"], "", "", ["man-man-girl-boy"], 14, 42, 15, 0],
      "1f468-200d-1f468-200d-1f467-200d-1f467": [["👨‍👨‍👧‍👧"], "", "", ["man-man-girl-girl"], 14, 43, 15, 0],
      "1f468-200d-1f469-200d-1f466": [["👨‍👩‍👦", "👪"], "", "", ["man-woman-boy", "family"], 14, 44, 15, 0],
      "1f468-200d-1f469-200d-1f466-200d-1f466": [["👨‍👩‍👦‍👦"], "", "", ["man-woman-boy-boy"], 14, 45, 15, 0],
      "1f468-200d-1f469-200d-1f467": [["👨‍👩‍👧"], "", "", ["man-woman-girl"], 14, 46, 15, 0],
      "1f468-200d-1f469-200d-1f467-200d-1f466": [["👨‍👩‍👧‍👦"], "", "", ["man-woman-girl-boy"], 14, 47, 15, 0],
      "1f468-200d-1f469-200d-1f467-200d-1f467": [["👨‍👩‍👧‍👧"], "", "", ["man-woman-girl-girl"], 14, 48, 15, 0],
      "1f468-200d-1f4bb": [["👨‍💻"], "", "", ["male-technologist"], 14, 49, 15, 0],
      "1f468-200d-1f4bc": [["👨‍💼"], "", "", ["male-office-worker"], 14, 55, 15, 0],
      "1f468-200d-1f527": [["👨‍🔧"], "", "", ["male-mechanic"], 15, 0, 15, 0],
      "1f468-200d-1f52c": [["👨‍🔬"], "", "", ["male-scientist"], 15, 6, 15, 0],
      "1f468-200d-1f680": [["👨‍🚀"], "", "", ["male-astronaut"], 15, 12, 15, 0],
      "1f468-200d-1f692": [["👨‍🚒"], "", "", ["male-firefighter"], 15, 18, 15, 0],
      "1f468-200d-1f9af": [["👨‍🦯"], "", "", ["man_with_probing_cane"], 15, 24, 15, 0],
      "1f468-200d-1f9b0": [["👨‍🦰"], "", "", ["red_haired_man"], 15, 30, 15, 0],
      "1f468-200d-1f9b1": [["👨‍🦱"], "", "", ["curly_haired_man"], 15, 36, 15, 0],
      "1f468-200d-1f9b2": [["👨‍🦲"], "", "", ["bald_man"], 15, 42, 15, 0],
      "1f468-200d-1f9b3": [["👨‍🦳"], "", "", ["white_haired_man"], 15, 48, 15, 0],
      "1f468-200d-1f9bc": [["👨‍🦼"], "", "", ["man_in_motorized_wheelchair"], 15, 54, 15, 0],
      "1f468-200d-1f9bd": [["👨‍🦽"], "", "", ["man_in_manual_wheelchair"], 15, 60, 15, 0],
      "1f468-200d-2695-fe0f": [["👨‍⚕️", "👨‍⚕"], "", "", ["male-doctor"], 16, 5, 15, 0],
      "1f468-200d-2696-fe0f": [["👨‍⚖️", "👨‍⚖"], "", "", ["male-judge"], 16, 11, 15, 0],
      "1f468-200d-2708-fe0f": [["👨‍✈️", "👨‍✈"], "", "", ["male-pilot"], 16, 17, 15, 0],
      "1f468-200d-2764-fe0f-200d-1f468": [["👨‍❤️‍👨", "👨‍❤‍👨"], "", "", ["man-heart-man"], 16, 23, 15, 0],
      "1f468-200d-2764-fe0f-200d-1f48b-200d-1f468": [["👨‍❤️‍💋‍👨", "👨‍❤‍💋‍👨"], "", "", ["man-kiss-man"], 16, 49, 15, 0],
      "1f468": [["👨"], "", "󾆝", ["man"], 17, 14, 15, 0],
      "1f469-200d-1f33e": [["👩‍🌾"], "", "", ["female-farmer"], 17, 20, 15, 0],
      "1f469-200d-1f373": [["👩‍🍳"], "", "", ["female-cook"], 17, 26, 15, 0],
      "1f469-200d-1f37c": [["👩‍🍼"], "", "", ["woman_feeding_baby"], 17, 32, 15, 0],
      "1f469-200d-1f393": [["👩‍🎓"], "", "", ["female-student"], 17, 38, 15, 0],
      "1f469-200d-1f3a4": [["👩‍🎤"], "", "", ["female-singer"], 17, 44, 15, 0],
      "1f469-200d-1f3a8": [["👩‍🎨"], "", "", ["female-artist"], 17, 50, 15, 0],
      "1f469-200d-1f3eb": [["👩‍🏫"], "", "", ["female-teacher"], 17, 56, 15, 0],
      "1f469-200d-1f3ed": [["👩‍🏭"], "", "", ["female-factory-worker"], 18, 1, 15, 0],
      "1f469-200d-1f466-200d-1f466": [["👩‍👦‍👦"], "", "", ["woman-boy-boy"], 18, 7, 15, 0],
      "1f469-200d-1f466": [["👩‍👦"], "", "", ["woman-boy"], 18, 8, 15, 0],
      "1f469-200d-1f467-200d-1f466": [["👩‍👧‍👦"], "", "", ["woman-girl-boy"], 18, 9, 15, 0],
      "1f469-200d-1f467-200d-1f467": [["👩‍👧‍👧"], "", "", ["woman-girl-girl"], 18, 10, 15, 0],
      "1f469-200d-1f467": [["👩‍👧"], "", "", ["woman-girl"], 18, 11, 15, 0],
      "1f469-200d-1f469-200d-1f466": [["👩‍👩‍👦"], "", "", ["woman-woman-boy"], 18, 12, 15, 0],
      "1f469-200d-1f469-200d-1f466-200d-1f466": [["👩‍👩‍👦‍👦"], "", "", ["woman-woman-boy-boy"], 18, 13, 15, 0],
      "1f469-200d-1f469-200d-1f467": [["👩‍👩‍👧"], "", "", ["woman-woman-girl"], 18, 14, 15, 0],
      "1f469-200d-1f469-200d-1f467-200d-1f466": [["👩‍👩‍👧‍👦"], "", "", ["woman-woman-girl-boy"], 18, 15, 15, 0],
      "1f469-200d-1f469-200d-1f467-200d-1f467": [["👩‍👩‍👧‍👧"], "", "", ["woman-woman-girl-girl"], 18, 16, 15, 0],
      "1f469-200d-1f4bb": [["👩‍💻"], "", "", ["female-technologist"], 18, 17, 15, 0],
      "1f469-200d-1f4bc": [["👩‍💼"], "", "", ["female-office-worker"], 18, 23, 15, 0],
      "1f469-200d-1f527": [["👩‍🔧"], "", "", ["female-mechanic"], 18, 29, 15, 0],
      "1f469-200d-1f52c": [["👩‍🔬"], "", "", ["female-scientist"], 18, 35, 15, 0],
      "1f469-200d-1f680": [["👩‍🚀"], "", "", ["female-astronaut"], 18, 41, 15, 0],
      "1f469-200d-1f692": [["👩‍🚒"], "", "", ["female-firefighter"], 18, 47, 15, 0],
      "1f469-200d-1f9af": [["👩‍🦯"], "", "", ["woman_with_probing_cane"], 18, 53, 15, 0],
      "1f469-200d-1f9b0": [["👩‍🦰"], "", "", ["red_haired_woman"], 18, 59, 15, 0],
      "1f469-200d-1f9b1": [["👩‍🦱"], "", "", ["curly_haired_woman"], 19, 4, 15, 0],
      "1f469-200d-1f9b2": [["👩‍🦲"], "", "", ["bald_woman"], 19, 10, 15, 0],
      "1f469-200d-1f9b3": [["👩‍🦳"], "", "", ["white_haired_woman"], 19, 16, 15, 0],
      "1f469-200d-1f9bc": [["👩‍🦼"], "", "", ["woman_in_motorized_wheelchair"], 19, 22, 15, 0],
      "1f469-200d-1f9bd": [["👩‍🦽"], "", "", ["woman_in_manual_wheelchair"], 19, 28, 15, 0],
      "1f469-200d-2695-fe0f": [["👩‍⚕️", "👩‍⚕"], "", "", ["female-doctor"], 19, 34, 15, 0],
      "1f469-200d-2696-fe0f": [["👩‍⚖️", "👩‍⚖"], "", "", ["female-judge"], 19, 40, 15, 0],
      "1f469-200d-2708-fe0f": [["👩‍✈️", "👩‍✈"], "", "", ["female-pilot"], 19, 46, 15, 0],
      "1f469-200d-2764-fe0f-200d-1f468": [["👩‍❤️‍👨", "👩‍❤‍👨"], "", "", ["woman-heart-man"], 19, 52, 15, 0],
      "1f469-200d-2764-fe0f-200d-1f469": [["👩‍❤️‍👩", "👩‍❤‍👩"], "", "", ["woman-heart-woman"], 20, 17, 15, 0],
      "1f469-200d-2764-fe0f-200d-1f48b-200d-1f468": [["👩‍❤️‍💋‍👨", "👩‍❤‍💋‍👨"], "", "", ["woman-kiss-man"], 20, 43, 15, 0],
      "1f469-200d-2764-fe0f-200d-1f48b-200d-1f469": [["👩‍❤️‍💋‍👩", "👩‍❤‍💋‍👩"], "", "", ["woman-kiss-woman"], 21, 8, 15, 0],
      "1f469": [["👩"], "", "󾆞", ["woman"], 21, 34, 15, 0],
      "1f46b": [["👫"], "", "󾆠", ["man_and_woman_holding_hands", "woman_and_man_holding_hands", "couple"], 21, 41, 15, 0],
      "1f46c": [["👬"], "", "", ["two_men_holding_hands", "men_holding_hands"], 22, 6, 15, 0],
      "1f46d": [["👭"], "", "", ["two_women_holding_hands", "women_holding_hands"], 22, 32, 15, 0],
      "1f46e-200d-2640-fe0f": [["👮‍♀️", "👮‍♀"], "", "", ["female-police-officer"], 22, 58, 15, 0],
      "1f46e-200d-2642-fe0f": [["👮‍♂️", "👮‍♂", "👮"], "", "", ["male-police-officer", "cop"], 23, 3, 15, 0],
      "1f46f-200d-2640-fe0f": [["👯‍♀️", "👯‍♀", "👯"], "", "", ["women-with-bunny-ears-partying", "woman-with-bunny-ears-partying", "dancers"], 23, 15, 15, 0],
      "1f46f-200d-2642-fe0f": [["👯‍♂️", "👯‍♂"], "", "", ["men-with-bunny-ears-partying", "man-with-bunny-ears-partying"], 23, 16, 15, 0],
      "1f470-200d-2640-fe0f": [["👰‍♀️", "👰‍♀"], "", "", ["woman_with_veil"], 23, 18, 15, 0],
      "1f470-200d-2642-fe0f": [["👰‍♂️", "👰‍♂"], "", "", ["man_with_veil"], 23, 24, 15, 0],
      "1f470": [["👰"], "", "󾆣", ["bride_with_veil"], 23, 30, 15, 0],
      "1f471-200d-2640-fe0f": [["👱‍♀️", "👱‍♀"], "", "", ["blond-haired-woman"], 23, 36, 15, 0],
      "1f471-200d-2642-fe0f": [["👱‍♂️", "👱‍♂", "👱"], "", "", ["blond-haired-man", "person_with_blond_hair"], 23, 42, 15, 0],
      "1f472": [["👲"], "", "󾆥", ["man_with_gua_pi_mao"], 23, 54, 15, 0],
      "1f473-200d-2640-fe0f": [["👳‍♀️", "👳‍♀"], "", "", ["woman-wearing-turban"], 23, 60, 15, 0],
      "1f473-200d-2642-fe0f": [["👳‍♂️", "👳‍♂", "👳"], "", "", ["man-wearing-turban", "man_with_turban"], 24, 5, 15, 0],
      "1f474": [["👴"], "", "󾆧", ["older_man"], 24, 17, 15, 0],
      "1f475": [["👵"], "", "󾆨", ["older_woman"], 24, 23, 15, 0],
      "1f476": [["👶"], "", "󾆩", ["baby"], 24, 29, 15, 0],
      "1f477-200d-2640-fe0f": [["👷‍♀️", "👷‍♀"], "", "", ["female-construction-worker"], 24, 35, 15, 0],
      "1f477-200d-2642-fe0f": [["👷‍♂️", "👷‍♂", "👷"], "", "", ["male-construction-worker", "construction_worker"], 24, 41, 15, 0],
      "1f478": [["👸"], "", "󾆫", ["princess"], 24, 53, 15, 0],
      "1f479": [["👹"], "", "󾆬", ["japanese_ogre"], 24, 59, 15, 0],
      "1f47a": [["👺"], "", "󾆭", ["japanese_goblin"], 24, 60, 15, 0],
      "1f47b": [["👻"], "", "󾆮", ["ghost"], 25, 0, 15, 0],
      "1f47c": [["👼"], "", "󾆯", ["angel"], 25, 1, 15, 0],
      "1f47d": [["👽"], "", "󾆰", ["alien"], 25, 7, 15, 0],
      "1f47e": [["👾"], "", "󾆱", ["space_invader"], 25, 8, 15, 0],
      "1f47f": [["👿"], "", "󾆲", ["imp"], 25, 9, 15, 0],
      "1f480": [["💀"], "", "󾆳", ["skull"], 25, 10, 15, 0],
      "1f481-200d-2640-fe0f": [["💁‍♀️", "💁‍♀", "💁"], "", "", ["woman-tipping-hand", "information_desk_person"], 25, 11, 15, 0],
      "1f481-200d-2642-fe0f": [["💁‍♂️", "💁‍♂"], "", "", ["man-tipping-hand"], 25, 17, 15, 0],
      "1f482-200d-2640-fe0f": [["💂‍♀️", "💂‍♀"], "", "", ["female-guard"], 25, 29, 15, 0],
      "1f482-200d-2642-fe0f": [["💂‍♂️", "💂‍♂", "💂"], "", "", ["male-guard", "guardsman"], 25, 35, 15, 0],
      "1f483": [["💃"], "", "󾆶", ["dancer"], 25, 47, 15, 0],
      "1f484": [["💄"], "", "󾆕", ["lipstick"], 25, 53, 15, 0],
      "1f485": [["💅"], "", "󾆖", ["nail_care"], 25, 54, 15, 0],
      "1f486-200d-2640-fe0f": [["💆‍♀️", "💆‍♀", "💆"], "", "", ["woman-getting-massage", "massage"], 25, 60, 15, 0],
      "1f486-200d-2642-fe0f": [["💆‍♂️", "💆‍♂"], "", "", ["man-getting-massage"], 26, 5, 15, 0],
      "1f487-200d-2640-fe0f": [["💇‍♀️", "💇‍♀", "💇"], "", "", ["woman-getting-haircut", "haircut"], 26, 17, 15, 0],
      "1f487-200d-2642-fe0f": [["💇‍♂️", "💇‍♂"], "", "", ["man-getting-haircut"], 26, 23, 15, 0],
      "1f488": [["💈"], "", "󾆙", ["barber"], 26, 35, 15, 0],
      "1f489": [["💉"], "", "󾔉", ["syringe"], 26, 36, 15, 0],
      "1f48a": [["💊"], "", "󾔊", ["pill"], 26, 37, 15, 0],
      "1f48b": [["💋"], "", "󾠣", ["kiss"], 26, 38, 15, 0],
      "1f48c": [["💌"], "", "󾠤", ["love_letter"], 26, 39, 15, 0],
      "1f48d": [["💍"], "", "󾠥", ["ring"], 26, 40, 15, 0],
      "1f48e": [["💎"], "", "󾠦", ["gem"], 26, 41, 15, 0],
      "1f48f": [["💏"], "", "󾠧", ["couplekiss"], 26, 42, 15, 0],
      "1f490": [["💐"], "", "󾠨", ["bouquet"], 27, 7, 15, 0],
      "1f491": [["💑"], "", "󾠩", ["couple_with_heart"], 27, 8, 15, 0],
      "1f492": [["💒"], "", "󾠪", ["wedding"], 27, 34, 15, 0],
      "1f493": [["💓"], "", "󾬍", ["heartbeat"], 27, 35, 15, 0],
      "1f494": [["💔"], "", "󾬎", ["broken_heart"], 27, 36, 15, 0, "</3"],
      "1f495": [["💕"], "", "󾬏", ["two_hearts"], 27, 37, 15, 0],
      "1f496": [["💖"], "", "󾬐", ["sparkling_heart"], 27, 38, 15, 0],
      "1f497": [["💗"], "", "󾬑", ["heartpulse"], 27, 39, 15, 0],
      "1f498": [["💘"], "", "󾬒", ["cupid"], 27, 40, 15, 0],
      "1f499": [["💙"], "", "󾬓", ["blue_heart"], 27, 41, 15, 0, "<3"],
      "1f49a": [["💚"], "", "󾬔", ["green_heart"], 27, 42, 15, 0, "<3"],
      "1f49b": [["💛"], "", "󾬕", ["yellow_heart"], 27, 43, 15, 0, "<3"],
      "1f49c": [["💜"], "", "󾬖", ["purple_heart"], 27, 44, 15, 0, "<3"],
      "1f49d": [["💝"], "", "󾬗", ["gift_heart"], 27, 45, 15, 0],
      "1f49e": [["💞"], "", "󾬘", ["revolving_hearts"], 27, 46, 15, 0],
      "1f49f": [["💟"], "", "󾬙", ["heart_decoration"], 27, 47, 15, 0],
      "1f4a0": [["💠"], "", "󾭕", ["diamond_shape_with_a_dot_inside"], 27, 48, 15, 0],
      "1f4a1": [["💡"], "", "󾭖", ["bulb"], 27, 49, 15, 0],
      "1f4a2": [["💢"], "", "󾭗", ["anger"], 27, 50, 15, 0],
      "1f4a3": [["💣"], "", "󾭘", ["bomb"], 27, 51, 15, 0],
      "1f4a4": [["💤"], "", "󾭙", ["zzz"], 27, 52, 15, 0],
      "1f4a5": [["💥"], "", "󾭚", ["boom", "collision"], 27, 53, 15, 0],
      "1f4a6": [["💦"], "", "󾭛", ["sweat_drops"], 27, 54, 15, 0],
      "1f4a7": [["💧"], "", "󾭜", ["droplet"], 27, 55, 15, 0],
      "1f4a8": [["💨"], "", "󾭝", ["dash"], 27, 56, 15, 0],
      "1f4a9": [["💩"], "", "󾓴", ["hankey", "poop", "shit"], 27, 57, 15, 0],
      "1f4aa": [["💪"], "", "󾭞", ["muscle"], 27, 58, 15, 0],
      "1f4ab": [["💫"], "", "󾭟", ["dizzy"], 28, 3, 15, 0],
      "1f4ac": [["💬"], "", "󾔲", ["speech_balloon"], 28, 4, 15, 0],
      "1f4ad": [["💭"], "", "", ["thought_balloon"], 28, 5, 15, 0],
      "1f4ae": [["💮"], "", "󾭺", ["white_flower"], 28, 6, 15, 0],
      "1f4af": [["💯"], "", "󾭻", ["100"], 28, 7, 15, 0],
      "1f4b0": [["💰"], "", "󾓝", ["moneybag"], 28, 8, 15, 0],
      "1f4b1": [["💱"], "", "󾓞", ["currency_exchange"], 28, 9, 15, 0],
      "1f4b2": [["💲"], "", "󾓠", ["heavy_dollar_sign"], 28, 10, 15, 0],
      "1f4b3": [["💳"], "", "󾓡", ["credit_card"], 28, 11, 15, 0],
      "1f4b4": [["💴"], "", "󾓢", ["yen"], 28, 12, 15, 0],
      "1f4b5": [["💵"], "", "󾓣", ["dollar"], 28, 13, 15, 0],
      "1f4b6": [["💶"], "", "", ["euro"], 28, 14, 15, 0],
      "1f4b7": [["💷"], "", "", ["pound"], 28, 15, 15, 0],
      "1f4b8": [["💸"], "", "󾓤", ["money_with_wings"], 28, 16, 15, 0],
      "1f4b9": [["💹"], "", "󾓟", ["chart"], 28, 17, 15, 0],
      "1f4ba": [["💺"], "", "󾔷", ["seat"], 28, 18, 15, 0],
      "1f4bb": [["💻"], "", "󾔸", ["computer"], 28, 19, 15, 0],
      "1f4bc": [["💼"], "", "󾔻", ["briefcase"], 28, 20, 15, 0],
      "1f4bd": [["💽"], "", "󾔼", ["minidisc"], 28, 21, 15, 0],
      "1f4be": [["💾"], "", "󾔽", ["floppy_disk"], 28, 22, 15, 0],
      "1f4bf": [["💿"], "", "󾠝", ["cd"], 28, 23, 15, 0],
      "1f4c0": [["📀"], "", "󾠞", ["dvd"], 28, 24, 15, 0],
      "1f4c1": [["📁"], "", "󾕃", ["file_folder"], 28, 25, 15, 0],
      "1f4c2": [["📂"], "", "󾕄", ["open_file_folder"], 28, 26, 15, 0],
      "1f4c3": [["📃"], "", "󾕀", ["page_with_curl"], 28, 27, 15, 0],
      "1f4c4": [["📄"], "", "󾕁", ["page_facing_up"], 28, 28, 15, 0],
      "1f4c5": [["📅"], "", "󾕂", ["date"], 28, 29, 15, 0],
      "1f4c6": [["📆"], "", "󾕉", ["calendar"], 28, 30, 15, 0],
      "1f4c7": [["📇"], "", "󾕍", ["card_index"], 28, 31, 15, 0],
      "1f4c8": [["📈"], "", "󾕋", ["chart_with_upwards_trend"], 28, 32, 15, 0],
      "1f4c9": [["📉"], "", "󾕌", ["chart_with_downwards_trend"], 28, 33, 15, 0],
      "1f4ca": [["📊"], "", "󾕊", ["bar_chart"], 28, 34, 15, 0],
      "1f4cb": [["📋"], "", "󾕈", ["clipboard"], 28, 35, 15, 0],
      "1f4cc": [["📌"], "", "󾕎", ["pushpin"], 28, 36, 15, 0],
      "1f4cd": [["📍"], "", "󾔿", ["round_pushpin"], 28, 37, 15, 0],
      "1f4ce": [["📎"], "", "󾔺", ["paperclip"], 28, 38, 15, 0],
      "1f4cf": [["📏"], "", "󾕐", ["straight_ruler"], 28, 39, 15, 0],
      "1f4d0": [["📐"], "", "󾕑", ["triangular_ruler"], 28, 40, 15, 0],
      "1f4d1": [["📑"], "", "󾕒", ["bookmark_tabs"], 28, 41, 15, 0],
      "1f4d2": [["📒"], "", "󾕏", ["ledger"], 28, 42, 15, 0],
      "1f4d3": [["📓"], "", "󾕅", ["notebook"], 28, 43, 15, 0],
      "1f4d4": [["📔"], "", "󾕇", ["notebook_with_decorative_cover"], 28, 44, 15, 0],
      "1f4d5": [["📕"], "", "󾔂", ["closed_book"], 28, 45, 15, 0],
      "1f4d6": [["📖"], "", "󾕆", ["book", "open_book"], 28, 46, 15, 0],
      "1f4d7": [["📗"], "", "󾓿", ["green_book"], 28, 47, 15, 0],
      "1f4d8": [["📘"], "", "󾔀", ["blue_book"], 28, 48, 15, 0],
      "1f4d9": [["📙"], "", "󾔁", ["orange_book"], 28, 49, 15, 0],
      "1f4da": [["📚"], "", "󾔃", ["books"], 28, 50, 15, 0],
      "1f4db": [["📛"], "", "󾔄", ["name_badge"], 28, 51, 15, 0],
      "1f4dc": [["📜"], "", "󾓽", ["scroll"], 28, 52, 15, 0],
      "1f4dd": [["📝"], "", "󾔧", ["memo", "pencil"], 28, 53, 15, 0],
      "1f4de": [["📞"], "", "󾔤", ["telephone_receiver"], 28, 54, 15, 0],
      "1f4df": [["📟"], "", "󾔢", ["pager"], 28, 55, 15, 0],
      "1f4e0": [["📠"], "", "󾔨", ["fax"], 28, 56, 15, 0],
      "1f4e1": [["📡"], "", "󾔱", ["satellite_antenna"], 28, 57, 15, 0],
      "1f4e2": [["📢"], "", "󾔯", ["loudspeaker"], 28, 58, 15, 0],
      "1f4e3": [["📣"], "", "󾔰", ["mega"], 28, 59, 15, 0],
      "1f4e4": [["📤"], "", "󾔳", ["outbox_tray"], 28, 60, 15, 0],
      "1f4e5": [["📥"], "", "󾔴", ["inbox_tray"], 29, 0, 15, 0],
      "1f4e6": [["📦"], "", "󾔵", ["package"], 29, 1, 15, 0],
      "1f4e7": [["📧"], "", "󾮒", ["e-mail"], 29, 2, 15, 0],
      "1f4e8": [["📨"], "", "󾔪", ["incoming_envelope"], 29, 3, 15, 0],
      "1f4e9": [["📩"], "", "󾔫", ["envelope_with_arrow"], 29, 4, 15, 0],
      "1f4ea": [["📪"], "", "󾔬", ["mailbox_closed"], 29, 5, 15, 0],
      "1f4eb": [["📫"], "", "󾔭", ["mailbox"], 29, 6, 15, 0],
      "1f4ec": [["📬"], "", "", ["mailbox_with_mail"], 29, 7, 15, 0],
      "1f4ed": [["📭"], "", "", ["mailbox_with_no_mail"], 29, 8, 15, 0],
      "1f4ee": [["📮"], "", "󾔮", ["postbox"], 29, 9, 15, 0],
      "1f4ef": [["📯"], "", "", ["postal_horn"], 29, 10, 15, 0],
      "1f4f0": [["📰"], "", "󾠢", ["newspaper"], 29, 11, 15, 0],
      "1f4f1": [["📱"], "", "󾔥", ["iphone"], 29, 12, 15, 0],
      "1f4f2": [["📲"], "", "󾔦", ["calling"], 29, 13, 15, 0],
      "1f4f3": [["📳"], "", "󾠹", ["vibration_mode"], 29, 14, 15, 0],
      "1f4f4": [["📴"], "", "󾠺", ["mobile_phone_off"], 29, 15, 15, 0],
      "1f4f5": [["📵"], "", "", ["no_mobile_phones"], 29, 16, 15, 0],
      "1f4f6": [["📶"], "", "󾠸", ["signal_strength"], 29, 17, 15, 0],
      "1f4f7": [["📷"], "", "󾓯", ["camera"], 29, 18, 15, 0],
      "1f4f8": [["📸"], "", "", ["camera_with_flash"], 29, 19, 15, 0],
      "1f4f9": [["📹"], "", "󾓹", ["video_camera"], 29, 20, 15, 0],
      "1f4fa": [["📺"], "", "󾠜", ["tv"], 29, 21, 15, 0],
      "1f4fb": [["📻"], "", "󾠟", ["radio"], 29, 22, 15, 0],
      "1f4fc": [["📼"], "", "󾠠", ["vhs"], 29, 23, 15, 0],
      "1f4fd-fe0f": [["📽️", "📽"], "", "", ["film_projector"], 29, 24, 15, 0],
      "1f4ff": [["📿"], "", "", ["prayer_beads"], 29, 25, 15, 0],
      "1f500": [["🔀"], "", "", ["twisted_rightwards_arrows"], 29, 26, 15, 0],
      "1f501": [["🔁"], "", "", ["repeat"], 29, 27, 15, 0],
      "1f502": [["🔂"], "", "", ["repeat_one"], 29, 28, 15, 0],
      "1f503": [["🔃"], "", "󾮑", ["arrows_clockwise"], 29, 29, 15, 0],
      "1f504": [["🔄"], "", "", ["arrows_counterclockwise"], 29, 30, 15, 0],
      "1f505": [["🔅"], "", "", ["low_brightness"], 29, 31, 15, 0],
      "1f506": [["🔆"], "", "", ["high_brightness"], 29, 32, 15, 0],
      "1f507": [["🔇"], "", "", ["mute"], 29, 33, 15, 0],
      "1f508": [["🔈"], "", "", ["speaker"], 29, 34, 15, 0],
      "1f509": [["🔉"], "", "", ["sound"], 29, 35, 15, 0],
      "1f50a": [["🔊"], "", "󾠡", ["loud_sound"], 29, 36, 15, 0],
      "1f50b": [["🔋"], "", "󾓼", ["battery"], 29, 37, 15, 0],
      "1f50c": [["🔌"], "", "󾓾", ["electric_plug"], 29, 38, 15, 0],
      "1f50d": [["🔍"], "", "󾮅", ["mag"], 29, 39, 15, 0],
      "1f50e": [["🔎"], "", "󾮍", ["mag_right"], 29, 40, 15, 0],
      "1f50f": [["🔏"], "", "󾮐", ["lock_with_ink_pen"], 29, 41, 15, 0],
      "1f510": [["🔐"], "", "󾮊", ["closed_lock_with_key"], 29, 42, 15, 0],
      "1f511": [["🔑"], "", "󾮂", ["key"], 29, 43, 15, 0],
      "1f512": [["🔒"], "", "󾮆", ["lock"], 29, 44, 15, 0],
      "1f513": [["🔓"], "", "󾮇", ["unlock"], 29, 45, 15, 0],
      "1f514": [["🔔"], "", "󾓲", ["bell"], 29, 46, 15, 0],
      "1f515": [["🔕"], "", "", ["no_bell"], 29, 47, 15, 0],
      "1f516": [["🔖"], "", "󾮏", ["bookmark"], 29, 48, 15, 0],
      "1f517": [["🔗"], "", "󾭋", ["link"], 29, 49, 15, 0],
      "1f518": [["🔘"], "", "󾮌", ["radio_button"], 29, 50, 15, 0],
      "1f519": [["🔙"], "", "󾮎", ["back"], 29, 51, 15, 0],
      "1f51a": [["🔚"], "", "󾀚", ["end"], 29, 52, 15, 0],
      "1f51b": [["🔛"], "", "󾀙", ["on"], 29, 53, 15, 0],
      "1f51c": [["🔜"], "", "󾀘", ["soon"], 29, 54, 15, 0],
      "1f51d": [["🔝"], "", "󾭂", ["top"], 29, 55, 15, 0],
      "1f51e": [["🔞"], "", "󾬥", ["underage"], 29, 56, 15, 0],
      "1f51f": [["🔟"], "", "󾠻", ["keycap_ten"], 29, 57, 15, 0],
      "1f520": [["🔠"], "", "󾭼", ["capital_abcd"], 29, 58, 15, 0],
      "1f521": [["🔡"], "", "󾭽", ["abcd"], 29, 59, 15, 0],
      "1f522": [["🔢"], "", "󾭾", ["1234"], 29, 60, 15, 0],
      "1f523": [["🔣"], "", "󾭿", ["symbols"], 30, 0, 15, 0],
      "1f524": [["🔤"], "", "󾮀", ["abc"], 30, 1, 15, 0],
      "1f525": [["🔥"], "", "󾓶", ["fire"], 30, 2, 15, 0],
      "1f526": [["🔦"], "", "󾓻", ["flashlight"], 30, 3, 15, 0],
      "1f527": [["🔧"], "", "󾓉", ["wrench"], 30, 4, 15, 0],
      "1f528": [["🔨"], "", "󾓊", ["hammer"], 30, 5, 15, 0],
      "1f529": [["🔩"], "", "󾓋", ["nut_and_bolt"], 30, 6, 15, 0],
      "1f52a": [["🔪"], "", "󾓺", ["hocho", "knife"], 30, 7, 15, 0],
      "1f52b": [["🔫"], "", "󾓵", ["gun"], 30, 8, 15, 0],
      "1f52c": [["🔬"], "", "", ["microscope"], 30, 9, 15, 0],
      "1f52d": [["🔭"], "", "", ["telescope"], 30, 10, 15, 0],
      "1f52e": [["🔮"], "", "󾓷", ["crystal_ball"], 30, 11, 15, 0],
      "1f52f": [["🔯"], "", "󾓸", ["six_pointed_star"], 30, 12, 15, 0],
      "1f530": [["🔰"], "", "󾁄", ["beginner"], 30, 13, 15, 0],
      "1f531": [["🔱"], "", "󾓒", ["trident"], 30, 14, 15, 0],
      "1f532": [["🔲"], "", "󾭤", ["black_square_button"], 30, 15, 15, 0],
      "1f533": [["🔳"], "", "󾭧", ["white_square_button"], 30, 16, 15, 0],
      "1f534": [["🔴"], "", "󾭣", ["red_circle"], 30, 17, 15, 0],
      "1f535": [["🔵"], "", "󾭤", ["large_blue_circle"], 30, 18, 15, 0],
      "1f536": [["🔶"], "", "󾭳", ["large_orange_diamond"], 30, 19, 15, 0],
      "1f537": [["🔷"], "", "󾭴", ["large_blue_diamond"], 30, 20, 15, 0],
      "1f538": [["🔸"], "", "󾭵", ["small_orange_diamond"], 30, 21, 15, 0],
      "1f539": [["🔹"], "", "󾭶", ["small_blue_diamond"], 30, 22, 15, 0],
      "1f53a": [["🔺"], "", "󾭸", ["small_red_triangle"], 30, 23, 15, 0],
      "1f53b": [["🔻"], "", "󾭹", ["small_red_triangle_down"], 30, 24, 15, 0],
      "1f53c": [["🔼"], "", "󾬁", ["arrow_up_small"], 30, 25, 15, 0],
      "1f53d": [["🔽"], "", "󾬀", ["arrow_down_small"], 30, 26, 15, 0],
      "1f549-fe0f": [["🕉️", "🕉"], "", "", ["om_symbol"], 30, 27, 15, 0],
      "1f54a-fe0f": [["🕊️", "🕊"], "", "", ["dove_of_peace"], 30, 28, 15, 0],
      "1f54b": [["🕋"], "", "", ["kaaba"], 30, 29, 15, 0],
      "1f54c": [["🕌"], "", "", ["mosque"], 30, 30, 15, 0],
      "1f54d": [["🕍"], "", "", ["synagogue"], 30, 31, 15, 0],
      "1f54e": [["🕎"], "", "", ["menorah_with_nine_branches"], 30, 32, 15, 0],
      "1f550": [["🕐"], "", "󾀞", ["clock1"], 30, 33, 15, 0],
      "1f551": [["🕑"], "", "󾀟", ["clock2"], 30, 34, 15, 0],
      "1f552": [["🕒"], "", "󾀠", ["clock3"], 30, 35, 15, 0],
      "1f553": [["🕓"], "", "󾀡", ["clock4"], 30, 36, 15, 0],
      "1f554": [["🕔"], "", "󾀢", ["clock5"], 30, 37, 15, 0],
      "1f555": [["🕕"], "", "󾀣", ["clock6"], 30, 38, 15, 0],
      "1f556": [["🕖"], "", "󾀤", ["clock7"], 30, 39, 15, 0],
      "1f557": [["🕗"], "", "󾀥", ["clock8"], 30, 40, 15, 0],
      "1f558": [["🕘"], "", "󾀦", ["clock9"], 30, 41, 15, 0],
      "1f559": [["🕙"], "", "󾀧", ["clock10"], 30, 42, 15, 0],
      "1f55a": [["🕚"], "", "󾀨", ["clock11"], 30, 43, 15, 0],
      "1f55b": [["🕛"], "", "󾀩", ["clock12"], 30, 44, 15, 0],
      "1f55c": [["🕜"], "", "", ["clock130"], 30, 45, 15, 0],
      "1f55d": [["🕝"], "", "", ["clock230"], 30, 46, 15, 0],
      "1f55e": [["🕞"], "", "", ["clock330"], 30, 47, 15, 0],
      "1f55f": [["🕟"], "", "", ["clock430"], 30, 48, 15, 0],
      "1f560": [["🕠"], "", "", ["clock530"], 30, 49, 15, 0],
      "1f561": [["🕡"], "", "", ["clock630"], 30, 50, 15, 0],
      "1f562": [["🕢"], "", "", ["clock730"], 30, 51, 15, 0],
      "1f563": [["🕣"], "", "", ["clock830"], 30, 52, 15, 0],
      "1f564": [["🕤"], "", "", ["clock930"], 30, 53, 15, 0],
      "1f565": [["🕥"], "", "", ["clock1030"], 30, 54, 15, 0],
      "1f566": [["🕦"], "", "", ["clock1130"], 30, 55, 15, 0],
      "1f567": [["🕧"], "", "", ["clock1230"], 30, 56, 15, 0],
      "1f56f-fe0f": [["🕯️", "🕯"], "", "", ["candle"], 30, 57, 15, 0],
      "1f570-fe0f": [["🕰️", "🕰"], "", "", ["mantelpiece_clock"], 30, 58, 15, 0],
      "1f573-fe0f": [["🕳️", "🕳"], "", "", ["hole"], 30, 59, 15, 0],
      "1f574-fe0f": [["🕴️", "🕴"], "", "", ["man_in_business_suit_levitating"], 30, 60, 15, 0],
      "1f575-fe0f-200d-2640-fe0f": [["🕵️‍♀️"], "", "", ["female-detective"], 31, 5, 7, 0],
      "1f575-fe0f-200d-2642-fe0f": [["🕵️‍♂️", "🕵️", "🕵"], "", "", ["male-detective", "sleuth_or_spy"], 31, 11, 7, 0],
      "1f576-fe0f": [["🕶️", "🕶"], "", "", ["dark_sunglasses"], 31, 23, 15, 0],
      "1f577-fe0f": [["🕷️", "🕷"], "", "", ["spider"], 31, 24, 15, 0],
      "1f578-fe0f": [["🕸️", "🕸"], "", "", ["spider_web"], 31, 25, 15, 0],
      "1f579-fe0f": [["🕹️", "🕹"], "", "", ["joystick"], 31, 26, 15, 0],
      "1f57a": [["🕺"], "", "", ["man_dancing"], 31, 27, 15, 0],
      "1f587-fe0f": [["🖇️", "🖇"], "", "", ["linked_paperclips"], 31, 33, 15, 0],
      "1f58a-fe0f": [["🖊️", "🖊"], "", "", ["lower_left_ballpoint_pen"], 31, 34, 15, 0],
      "1f58b-fe0f": [["🖋️", "🖋"], "", "", ["lower_left_fountain_pen"], 31, 35, 15, 0],
      "1f58c-fe0f": [["🖌️", "🖌"], "", "", ["lower_left_paintbrush"], 31, 36, 15, 0],
      "1f58d-fe0f": [["🖍️", "🖍"], "", "", ["lower_left_crayon"], 31, 37, 15, 0],
      "1f590-fe0f": [["🖐️", "🖐"], "", "", ["raised_hand_with_fingers_splayed"], 31, 38, 15, 0],
      "1f595": [["🖕"], "", "", ["middle_finger", "reversed_hand_with_middle_finger_extended"], 31, 44, 15, 0],
      "1f596": [["🖖"], "", "", ["spock-hand"], 31, 50, 15, 0],
      "1f5a4": [["🖤"], "", "", ["black_heart"], 31, 56, 15, 0],
      "1f5a5-fe0f": [["🖥️", "🖥"], "", "", ["desktop_computer"], 31, 57, 15, 0],
      "1f5a8-fe0f": [["🖨️", "🖨"], "", "", ["printer"], 31, 58, 15, 0],
      "1f5b1-fe0f": [["🖱️", "🖱"], "", "", ["three_button_mouse"], 31, 59, 15, 0],
      "1f5b2-fe0f": [["🖲️", "🖲"], "", "", ["trackball"], 31, 60, 15, 0],
      "1f5bc-fe0f": [["🖼️", "🖼"], "", "", ["frame_with_picture"], 32, 0, 15, 0],
      "1f5c2-fe0f": [["🗂️", "🗂"], "", "", ["card_index_dividers"], 32, 1, 15, 0],
      "1f5c3-fe0f": [["🗃️", "🗃"], "", "", ["card_file_box"], 32, 2, 15, 0],
      "1f5c4-fe0f": [["🗄️", "🗄"], "", "", ["file_cabinet"], 32, 3, 15, 0],
      "1f5d1-fe0f": [["🗑️", "🗑"], "", "", ["wastebasket"], 32, 4, 15, 0],
      "1f5d2-fe0f": [["🗒️", "🗒"], "", "", ["spiral_note_pad"], 32, 5, 15, 0],
      "1f5d3-fe0f": [["🗓️", "🗓"], "", "", ["spiral_calendar_pad"], 32, 6, 15, 0],
      "1f5dc-fe0f": [["🗜️", "🗜"], "", "", ["compression"], 32, 7, 15, 0],
      "1f5dd-fe0f": [["🗝️", "🗝"], "", "", ["old_key"], 32, 8, 15, 0],
      "1f5de-fe0f": [["🗞️", "🗞"], "", "", ["rolled_up_newspaper"], 32, 9, 15, 0],
      "1f5e1-fe0f": [["🗡️", "🗡"], "", "", ["dagger_knife"], 32, 10, 15, 0],
      "1f5e3-fe0f": [["🗣️", "🗣"], "", "", ["speaking_head_in_silhouette"], 32, 11, 15, 0],
      "1f5e8-fe0f": [["🗨️", "🗨"], "", "", ["left_speech_bubble"], 32, 12, 15, 0],
      "1f5ef-fe0f": [["🗯️", "🗯"], "", "", ["right_anger_bubble"], 32, 13, 15, 0],
      "1f5f3-fe0f": [["🗳️", "🗳"], "", "", ["ballot_box_with_ballot"], 32, 14, 15, 0],
      "1f5fa-fe0f": [["🗺️", "🗺"], "", "", ["world_map"], 32, 15, 15, 0],
      "1f5fb": [["🗻"], "", "󾓃", ["mount_fuji"], 32, 16, 15, 0],
      "1f5fc": [["🗼"], "", "󾓄", ["tokyo_tower"], 32, 17, 15, 0],
      "1f5fd": [["🗽"], "", "󾓆", ["statue_of_liberty"], 32, 18, 15, 0],
      "1f5fe": [["🗾"], "", "󾓇", ["japan"], 32, 19, 15, 0],
      "1f5ff": [["🗿"], "", "󾓈", ["moyai"], 32, 20, 15, 0],
      "1f600": [["😀"], "", "", ["grinning"], 32, 21, 15, 0, ":D"],
      "1f601": [["😁"], "", "󾌳", ["grin"], 32, 22, 15, 0],
      "1f602": [["😂"], "", "󾌴", ["joy"], 32, 23, 15, 0],
      "1f603": [["😃"], "", "󾌰", ["smiley"], 32, 24, 15, 0, ":)"],
      "1f604": [["😄"], "", "󾌸", ["smile"], 32, 25, 15, 0, ":)"],
      "1f605": [["😅"], "", "󾌱", ["sweat_smile"], 32, 26, 15, 0],
      "1f606": [["😆"], "", "󾌲", ["laughing", "satisfied"], 32, 27, 15, 0],
      "1f607": [["😇"], "", "", ["innocent"], 32, 28, 15, 0],
      "1f608": [["😈"], "", "", ["smiling_imp"], 32, 29, 15, 0],
      "1f609": [["😉"], "", "󾍇", ["wink"], 32, 30, 15, 0, ";)"],
      "1f60a": [["😊"], "", "󾌵", ["blush"], 32, 31, 15, 0, ":)"],
      "1f60b": [["😋"], "", "󾌫", ["yum"], 32, 32, 15, 0],
      "1f60c": [["😌"], "", "󾌾", ["relieved"], 32, 33, 15, 0],
      "1f60d": [["😍"], "", "󾌧", ["heart_eyes"], 32, 34, 15, 0],
      "1f60e": [["😎"], "", "", ["sunglasses"], 32, 35, 15, 0],
      "1f60f": [["😏"], "", "󾍃", ["smirk"], 32, 36, 15, 0],
      "1f610": [["😐"], "", "", ["neutral_face"], 32, 37, 15, 0],
      "1f611": [["😑"], "", "", ["expressionless"], 32, 38, 15, 0],
      "1f612": [["😒"], "", "󾌦", ["unamused"], 32, 39, 15, 0, ":("],
      "1f613": [["😓"], "", "󾍄", ["sweat"], 32, 40, 15, 0],
      "1f614": [["😔"], "", "󾍀", ["pensive"], 32, 41, 15, 0],
      "1f615": [["😕"], "", "", ["confused"], 32, 42, 15, 0],
      "1f616": [["😖"], "", "󾌿", ["confounded"], 32, 43, 15, 0],
      "1f617": [["😗"], "", "", ["kissing"], 32, 44, 15, 0],
      "1f618": [["😘"], "", "󾌬", ["kissing_heart"], 32, 45, 15, 0],
      "1f619": [["😙"], "", "", ["kissing_smiling_eyes"], 32, 46, 15, 0],
      "1f61a": [["😚"], "", "󾌭", ["kissing_closed_eyes"], 32, 47, 15, 0],
      "1f61b": [["😛"], "", "", ["stuck_out_tongue"], 32, 48, 15, 0, ":p"],
      "1f61c": [["😜"], "", "󾌩", ["stuck_out_tongue_winking_eye"], 32, 49, 15, 0, ";p"],
      "1f61d": [["😝"], "", "󾌪", ["stuck_out_tongue_closed_eyes"], 32, 50, 15, 0],
      "1f61e": [["😞"], "", "󾌣", ["disappointed"], 32, 51, 15, 0, ":("],
      "1f61f": [["😟"], "", "", ["worried"], 32, 52, 15, 0],
      "1f620": [["😠"], "", "󾌠", ["angry"], 32, 53, 15, 0],
      "1f621": [["😡"], "", "󾌽", ["rage"], 32, 54, 15, 0],
      "1f622": [["😢"], "", "󾌹", ["cry"], 32, 55, 15, 0, ":'("],
      "1f623": [["😣"], "", "󾌼", ["persevere"], 32, 56, 15, 0],
      "1f624": [["😤"], "", "󾌨", ["triumph"], 32, 57, 15, 0],
      "1f625": [["😥"], "", "󾍅", ["disappointed_relieved"], 32, 58, 15, 0],
      "1f626": [["😦"], "", "", ["frowning"], 32, 59, 15, 0],
      "1f627": [["😧"], "", "", ["anguished"], 32, 60, 15, 0],
      "1f628": [["😨"], "", "󾌻", ["fearful"], 33, 0, 15, 0],
      "1f629": [["😩"], "", "󾌡", ["weary"], 33, 1, 15, 0],
      "1f62a": [["😪"], "", "󾍂", ["sleepy"], 33, 2, 15, 0],
      "1f62b": [["😫"], "", "󾍆", ["tired_face"], 33, 3, 15, 0],
      "1f62c": [["😬"], "", "", ["grimacing"], 33, 4, 15, 0],
      "1f62d": [["😭"], "", "󾌺", ["sob"], 33, 5, 15, 0, ":'("],
      "1f62e-200d-1f4a8": [["😮‍💨"], "", "", ["face_exhaling"], 33, 6, 15, 0],
      "1f62e": [["😮"], "", "", ["open_mouth"], 33, 7, 15, 0],
      "1f62f": [["😯"], "", "", ["hushed"], 33, 8, 15, 0],
      "1f630": [["😰"], "", "󾌥", ["cold_sweat"], 33, 9, 15, 0],
      "1f631": [["😱"], "", "󾍁", ["scream"], 33, 10, 15, 0],
      "1f632": [["😲"], "", "󾌢", ["astonished"], 33, 11, 15, 0],
      "1f633": [["😳"], "", "󾌯", ["flushed"], 33, 12, 15, 0],
      "1f634": [["😴"], "", "", ["sleeping"], 33, 13, 15, 0],
      "1f635-200d-1f4ab": [["😵‍💫"], "", "", ["face_with_spiral_eyes"], 33, 14, 15, 0],
      "1f635": [["😵"], "", "󾌤", ["dizzy_face"], 33, 15, 15, 0],
      "1f636-200d-1f32b-fe0f": [["😶‍🌫️", "😶‍🌫"], "", "", ["face_in_clouds"], 33, 16, 15, 0],
      "1f636": [["😶"], "", "", ["no_mouth"], 33, 17, 15, 0],
      "1f637": [["😷"], "", "󾌮", ["mask"], 33, 18, 15, 0],
      "1f638": [["😸"], "", "󾍉", ["smile_cat"], 33, 19, 15, 0],
      "1f639": [["😹"], "", "󾍊", ["joy_cat"], 33, 20, 15, 0],
      "1f63a": [["😺"], "", "󾍈", ["smiley_cat"], 33, 21, 15, 0],
      "1f63b": [["😻"], "", "󾍌", ["heart_eyes_cat"], 33, 22, 15, 0],
      "1f63c": [["😼"], "", "󾍏", ["smirk_cat"], 33, 23, 15, 0],
      "1f63d": [["😽"], "", "󾍋", ["kissing_cat"], 33, 24, 15, 0],
      "1f63e": [["😾"], "", "󾍎", ["pouting_cat"], 33, 25, 15, 0],
      "1f63f": [["😿"], "", "󾍍", ["crying_cat_face"], 33, 26, 15, 0],
      "1f640": [["🙀"], "", "󾍐", ["scream_cat"], 33, 27, 15, 0],
      "1f641": [["🙁"], "", "", ["slightly_frowning_face"], 33, 28, 15, 0],
      "1f642": [["🙂"], "", "", ["slightly_smiling_face"], 33, 29, 15, 0],
      "1f643": [["🙃"], "", "", ["upside_down_face"], 33, 30, 15, 0],
      "1f644": [["🙄"], "", "", ["face_with_rolling_eyes"], 33, 31, 15, 0],
      "1f645-200d-2640-fe0f": [["🙅‍♀️", "🙅‍♀", "🙅"], "", "", ["woman-gesturing-no", "no_good"], 33, 32, 15, 0],
      "1f645-200d-2642-fe0f": [["🙅‍♂️", "🙅‍♂"], "", "", ["man-gesturing-no"], 33, 38, 15, 0],
      "1f646-200d-2640-fe0f": [["🙆‍♀️", "🙆‍♀", "🙆"], "", "", ["woman-gesturing-ok", "ok_woman"], 33, 50, 15, 0],
      "1f646-200d-2642-fe0f": [["🙆‍♂️", "🙆‍♂"], "", "", ["man-gesturing-ok"], 33, 56, 15, 0],
      "1f647-200d-2640-fe0f": [["🙇‍♀️", "🙇‍♀"], "", "", ["woman-bowing"], 34, 7, 15, 0],
      "1f647-200d-2642-fe0f": [["🙇‍♂️", "🙇‍♂"], "", "", ["man-bowing"], 34, 13, 15, 0],
      "1f647": [["🙇"], "", "󾍓", ["bow"], 34, 19, 15, 0],
      "1f648": [["🙈"], "", "󾍔", ["see_no_evil"], 34, 25, 15, 0],
      "1f649": [["🙉"], "", "󾍖", ["hear_no_evil"], 34, 26, 15, 0],
      "1f64a": [["🙊"], "", "󾍕", ["speak_no_evil"], 34, 27, 15, 0],
      "1f64b-200d-2640-fe0f": [["🙋‍♀️", "🙋‍♀", "🙋"], "", "", ["woman-raising-hand", "raising_hand"], 34, 28, 15, 0],
      "1f64b-200d-2642-fe0f": [["🙋‍♂️", "🙋‍♂"], "", "", ["man-raising-hand"], 34, 34, 15, 0],
      "1f64c": [["🙌"], "", "󾍘", ["raised_hands"], 34, 46, 15, 0],
      "1f64d-200d-2640-fe0f": [["🙍‍♀️", "🙍‍♀", "🙍"], "", "", ["woman-frowning", "person_frowning"], 34, 52, 15, 0],
      "1f64d-200d-2642-fe0f": [["🙍‍♂️", "🙍‍♂"], "", "", ["man-frowning"], 34, 58, 15, 0],
      "1f64e-200d-2640-fe0f": [["🙎‍♀️", "🙎‍♀", "🙎"], "", "", ["woman-pouting", "person_with_pouting_face"], 35, 9, 15, 0],
      "1f64e-200d-2642-fe0f": [["🙎‍♂️", "🙎‍♂"], "", "", ["man-pouting"], 35, 15, 15, 0],
      "1f64f": [["🙏"], "", "󾍛", ["pray"], 35, 27, 15, 0],
      "1f680": [["🚀"], "", "󾟭", ["rocket"], 35, 33, 15, 0],
      "1f681": [["🚁"], "", "", ["helicopter"], 35, 34, 15, 0],
      "1f682": [["🚂"], "", "", ["steam_locomotive"], 35, 35, 15, 0],
      "1f683": [["🚃"], "", "󾟟", ["railway_car"], 35, 36, 15, 0],
      "1f684": [["🚄"], "", "󾟢", ["bullettrain_side"], 35, 37, 15, 0],
      "1f685": [["🚅"], "", "󾟣", ["bullettrain_front"], 35, 38, 15, 0],
      "1f686": [["🚆"], "", "", ["train2"], 35, 39, 15, 0],
      "1f687": [["🚇"], "", "󾟠", ["metro"], 35, 40, 15, 0],
      "1f688": [["🚈"], "", "", ["light_rail"], 35, 41, 15, 0],
      "1f689": [["🚉"], "", "󾟬", ["station"], 35, 42, 15, 0],
      "1f68a": [["🚊"], "", "", ["tram"], 35, 43, 15, 0],
      "1f68b": [["🚋"], "", "", ["train"], 35, 44, 15, 0],
      "1f68c": [["🚌"], "", "󾟦", ["bus"], 35, 45, 15, 0],
      "1f68d": [["🚍"], "", "", ["oncoming_bus"], 35, 46, 15, 0],
      "1f68e": [["🚎"], "", "", ["trolleybus"], 35, 47, 15, 0],
      "1f68f": [["🚏"], "", "󾟧", ["busstop"], 35, 48, 15, 0],
      "1f690": [["🚐"], "", "", ["minibus"], 35, 49, 15, 0],
      "1f691": [["🚑"], "", "󾟳", ["ambulance"], 35, 50, 15, 0],
      "1f692": [["🚒"], "", "󾟲", ["fire_engine"], 35, 51, 15, 0],
      "1f693": [["🚓"], "", "󾟴", ["police_car"], 35, 52, 15, 0],
      "1f694": [["🚔"], "", "", ["oncoming_police_car"], 35, 53, 15, 0],
      "1f695": [["🚕"], "", "󾟯", ["taxi"], 35, 54, 15, 0],
      "1f696": [["🚖"], "", "", ["oncoming_taxi"], 35, 55, 15, 0],
      "1f697": [["🚗"], "", "󾟤", ["car", "red_car"], 35, 56, 15, 0],
      "1f698": [["🚘"], "", "", ["oncoming_automobile"], 35, 57, 15, 0],
      "1f699": [["🚙"], "", "󾟥", ["blue_car"], 35, 58, 15, 0],
      "1f69a": [["🚚"], "", "󾟱", ["truck"], 35, 59, 15, 0],
      "1f69b": [["🚛"], "", "", ["articulated_lorry"], 35, 60, 15, 0],
      "1f69c": [["🚜"], "", "", ["tractor"], 36, 0, 15, 0],
      "1f69d": [["🚝"], "", "", ["monorail"], 36, 1, 15, 0],
      "1f69e": [["🚞"], "", "", ["mountain_railway"], 36, 2, 15, 0],
      "1f69f": [["🚟"], "", "", ["suspension_railway"], 36, 3, 15, 0],
      "1f6a0": [["🚠"], "", "", ["mountain_cableway"], 36, 4, 15, 0],
      "1f6a1": [["🚡"], "", "", ["aerial_tramway"], 36, 5, 15, 0],
      "1f6a2": [["🚢"], "", "󾟨", ["ship"], 36, 6, 15, 0],
      "1f6a3-200d-2640-fe0f": [["🚣‍♀️", "🚣‍♀"], "", "", ["woman-rowing-boat"], 36, 7, 15, 0],
      "1f6a3-200d-2642-fe0f": [["🚣‍♂️", "🚣‍♂", "🚣"], "", "", ["man-rowing-boat", "rowboat"], 36, 13, 15, 0],
      "1f6a4": [["🚤"], "", "󾟮", ["speedboat"], 36, 25, 15, 0],
      "1f6a5": [["🚥"], "", "󾟷", ["traffic_light"], 36, 26, 15, 0],
      "1f6a6": [["🚦"], "", "", ["vertical_traffic_light"], 36, 27, 15, 0],
      "1f6a7": [["🚧"], "", "󾟸", ["construction"], 36, 28, 15, 0],
      "1f6a8": [["🚨"], "", "󾟹", ["rotating_light"], 36, 29, 15, 0],
      "1f6a9": [["🚩"], "", "󾬢", ["triangular_flag_on_post"], 36, 30, 15, 0],
      "1f6aa": [["🚪"], "", "󾓳", ["door"], 36, 31, 15, 0],
      "1f6ab": [["🚫"], "", "󾭈", ["no_entry_sign"], 36, 32, 15, 0],
      "1f6ac": [["🚬"], "", "󾬞", ["smoking"], 36, 33, 15, 0],
      "1f6ad": [["🚭"], "", "󾬟", ["no_smoking"], 36, 34, 15, 0],
      "1f6ae": [["🚮"], "", "", ["put_litter_in_its_place"], 36, 35, 15, 0],
      "1f6af": [["🚯"], "", "", ["do_not_litter"], 36, 36, 15, 0],
      "1f6b0": [["🚰"], "", "", ["potable_water"], 36, 37, 15, 0],
      "1f6b1": [["🚱"], "", "", ["non-potable_water"], 36, 38, 15, 0],
      "1f6b2": [["🚲"], "", "󾟫", ["bike"], 36, 39, 15, 0],
      "1f6b3": [["🚳"], "", "", ["no_bicycles"], 36, 40, 15, 0],
      "1f6b4-200d-2640-fe0f": [["🚴‍♀️", "🚴‍♀"], "", "", ["woman-biking"], 36, 41, 15, 0],
      "1f6b4-200d-2642-fe0f": [["🚴‍♂️", "🚴‍♂", "🚴"], "", "", ["man-biking", "bicyclist"], 36, 47, 15, 0],
      "1f6b5-200d-2640-fe0f": [["🚵‍♀️", "🚵‍♀"], "", "", ["woman-mountain-biking"], 36, 59, 15, 0],
      "1f6b5-200d-2642-fe0f": [["🚵‍♂️", "🚵‍♂", "🚵"], "", "", ["man-mountain-biking", "mountain_bicyclist"], 37, 4, 15, 0],
      "1f6b6-200d-2640-fe0f": [["🚶‍♀️", "🚶‍♀"], "", "", ["woman-walking"], 37, 16, 15, 0],
      "1f6b6-200d-2642-fe0f": [["🚶‍♂️", "🚶‍♂", "🚶"], "", "", ["man-walking", "walking"], 37, 22, 15, 0],
      "1f6b7": [["🚷"], "", "", ["no_pedestrians"], 37, 34, 15, 0],
      "1f6b8": [["🚸"], "", "", ["children_crossing"], 37, 35, 15, 0],
      "1f6b9": [["🚹"], "", "󾬳", ["mens"], 37, 36, 15, 0],
      "1f6ba": [["🚺"], "", "󾬴", ["womens"], 37, 37, 15, 0],
      "1f6bb": [["🚻"], "", "󾔆", ["restroom"], 37, 38, 15, 0],
      "1f6bc": [["🚼"], "", "󾬵", ["baby_symbol"], 37, 39, 15, 0],
      "1f6bd": [["🚽"], "", "󾔇", ["toilet"], 37, 40, 15, 0],
      "1f6be": [["🚾"], "", "󾔈", ["wc"], 37, 41, 15, 0],
      "1f6bf": [["🚿"], "", "", ["shower"], 37, 42, 15, 0],
      "1f6c0": [["🛀"], "", "󾔅", ["bath"], 37, 43, 15, 0],
      "1f6c1": [["🛁"], "", "", ["bathtub"], 37, 49, 15, 0],
      "1f6c2": [["🛂"], "", "", ["passport_control"], 37, 50, 15, 0],
      "1f6c3": [["🛃"], "", "", ["customs"], 37, 51, 15, 0],
      "1f6c4": [["🛄"], "", "", ["baggage_claim"], 37, 52, 15, 0],
      "1f6c5": [["🛅"], "", "", ["left_luggage"], 37, 53, 15, 0],
      "1f6cb-fe0f": [["🛋️", "🛋"], "", "", ["couch_and_lamp"], 37, 54, 15, 0],
      "1f6cc": [["🛌"], "", "", ["sleeping_accommodation"], 37, 55, 15, 0],
      "1f6cd-fe0f": [["🛍️", "🛍"], "", "", ["shopping_bags"], 38, 0, 15, 0],
      "1f6ce-fe0f": [["🛎️", "🛎"], "", "", ["bellhop_bell"], 38, 1, 15, 0],
      "1f6cf-fe0f": [["🛏️", "🛏"], "", "", ["bed"], 38, 2, 15, 0],
      "1f6d0": [["🛐"], "", "", ["place_of_worship"], 38, 3, 15, 0],
      "1f6d1": [["🛑"], "", "", ["octagonal_sign"], 38, 4, 15, 0],
      "1f6d2": [["🛒"], "", "", ["shopping_trolley"], 38, 5, 15, 0],
      "1f6d5": [["🛕"], "", "", ["hindu_temple"], 38, 6, 15, 0],
      "1f6d6": [["🛖"], "", "", ["hut"], 38, 7, 15, 0],
      "1f6d7": [["🛗"], "", "", ["elevator"], 38, 8, 15, 0],
      "1f6dc": [["🛜"], "", "", ["wireless"], 38, 9, 3, 0],
      "1f6dd": [["🛝"], "", "", ["playground_slide"], 38, 10, 15, 0],
      "1f6de": [["🛞"], "", "", ["wheel"], 38, 11, 15, 0],
      "1f6df": [["🛟"], "", "", ["ring_buoy"], 38, 12, 15, 0],
      "1f6e0-fe0f": [["🛠️", "🛠"], "", "", ["hammer_and_wrench"], 38, 13, 15, 0],
      "1f6e1-fe0f": [["🛡️", "🛡"], "", "", ["shield"], 38, 14, 15, 0],
      "1f6e2-fe0f": [["🛢️", "🛢"], "", "", ["oil_drum"], 38, 15, 15, 0],
      "1f6e3-fe0f": [["🛣️", "🛣"], "", "", ["motorway"], 38, 16, 15, 0],
      "1f6e4-fe0f": [["🛤️", "🛤"], "", "", ["railway_track"], 38, 17, 15, 0],
      "1f6e5-fe0f": [["🛥️", "🛥"], "", "", ["motor_boat"], 38, 18, 15, 0],
      "1f6e9-fe0f": [["🛩️", "🛩"], "", "", ["small_airplane"], 38, 19, 15, 0],
      "1f6eb": [["🛫"], "", "", ["airplane_departure"], 38, 20, 15, 0],
      "1f6ec": [["🛬"], "", "", ["airplane_arriving"], 38, 21, 15, 0],
      "1f6f0-fe0f": [["🛰️", "🛰"], "", "", ["satellite"], 38, 22, 15, 0],
      "1f6f3-fe0f": [["🛳️", "🛳"], "", "", ["passenger_ship"], 38, 23, 15, 0],
      "1f6f4": [["🛴"], "", "", ["scooter"], 38, 24, 15, 0],
      "1f6f5": [["🛵"], "", "", ["motor_scooter"], 38, 25, 15, 0],
      "1f6f6": [["🛶"], "", "", ["canoe"], 38, 26, 15, 0],
      "1f6f7": [["🛷"], "", "", ["sled"], 38, 27, 15, 0],
      "1f6f8": [["🛸"], "", "", ["flying_saucer"], 38, 28, 15, 0],
      "1f6f9": [["🛹"], "", "", ["skateboard"], 38, 29, 15, 0],
      "1f6fa": [["🛺"], "", "", ["auto_rickshaw"], 38, 30, 15, 0],
      "1f6fb": [["🛻"], "", "", ["pickup_truck"], 38, 31, 15, 0],
      "1f6fc": [["🛼"], "", "", ["roller_skate"], 38, 32, 15, 0],
      "1f7e0": [["🟠"], "", "", ["large_orange_circle"], 38, 33, 15, 0],
      "1f7e1": [["🟡"], "", "", ["large_yellow_circle"], 38, 34, 15, 0],
      "1f7e2": [["🟢"], "", "", ["large_green_circle"], 38, 35, 15, 0],
      "1f7e3": [["🟣"], "", "", ["large_purple_circle"], 38, 36, 15, 0],
      "1f7e4": [["🟤"], "", "", ["large_brown_circle"], 38, 37, 15, 0],
      "1f7e5": [["🟥"], "", "", ["large_red_square"], 38, 38, 15, 0],
      "1f7e6": [["🟦"], "", "", ["large_blue_square"], 38, 39, 15, 0],
      "1f7e7": [["🟧"], "", "", ["large_orange_square"], 38, 40, 15, 0],
      "1f7e8": [["🟨"], "", "", ["large_yellow_square"], 38, 41, 15, 0],
      "1f7e9": [["🟩"], "", "", ["large_green_square"], 38, 42, 15, 0],
      "1f7ea": [["🟪"], "", "", ["large_purple_square"], 38, 43, 15, 0],
      "1f7eb": [["🟫"], "", "", ["large_brown_square"], 38, 44, 15, 0],
      "1f7f0": [["🟰"], "", "", ["heavy_equals_sign"], 38, 45, 15, 0],
      "1f90c": [["🤌"], "", "", ["pinched_fingers"], 38, 46, 15, 0],
      "1f90d": [["🤍"], "", "", ["white_heart"], 38, 52, 15, 0],
      "1f90e": [["🤎"], "", "", ["brown_heart"], 38, 53, 15, 0],
      "1f90f": [["🤏"], "", "", ["pinching_hand"], 38, 54, 15, 0],
      "1f910": [["🤐"], "", "", ["zipper_mouth_face"], 38, 60, 15, 0],
      "1f911": [["🤑"], "", "", ["money_mouth_face"], 39, 0, 15, 0],
      "1f912": [["🤒"], "", "", ["face_with_thermometer"], 39, 1, 15, 0],
      "1f913": [["🤓"], "", "", ["nerd_face"], 39, 2, 15, 0],
      "1f914": [["🤔"], "", "", ["thinking_face"], 39, 3, 15, 0],
      "1f915": [["🤕"], "", "", ["face_with_head_bandage"], 39, 4, 15, 0],
      "1f916": [["🤖"], "", "", ["robot_face"], 39, 5, 15, 0],
      "1f917": [["🤗"], "", "", ["hugging_face"], 39, 6, 15, 0],
      "1f918": [["🤘"], "", "", ["the_horns", "sign_of_the_horns"], 39, 7, 15, 0],
      "1f919": [["🤙"], "", "", ["call_me_hand"], 39, 13, 15, 0],
      "1f91a": [["🤚"], "", "", ["raised_back_of_hand"], 39, 19, 15, 0],
      "1f91b": [["🤛"], "", "", ["left-facing_fist"], 39, 25, 15, 0],
      "1f91c": [["🤜"], "", "", ["right-facing_fist"], 39, 31, 15, 0],
      "1f91d": [["🤝"], "", "", ["handshake"], 39, 37, 15, 0],
      "1f91e": [["🤞"], "", "", ["crossed_fingers", "hand_with_index_and_middle_fingers_crossed"], 40, 2, 15, 0],
      "1f91f": [["🤟"], "", "", ["i_love_you_hand_sign"], 40, 8, 15, 0],
      "1f920": [["🤠"], "", "", ["face_with_cowboy_hat"], 40, 14, 15, 0],
      "1f921": [["🤡"], "", "", ["clown_face"], 40, 15, 15, 0],
      "1f922": [["🤢"], "", "", ["nauseated_face"], 40, 16, 15, 0],
      "1f923": [["🤣"], "", "", ["rolling_on_the_floor_laughing"], 40, 17, 15, 0],
      "1f924": [["🤤"], "", "", ["drooling_face"], 40, 18, 15, 0],
      "1f925": [["🤥"], "", "", ["lying_face"], 40, 19, 15, 0],
      "1f926-200d-2640-fe0f": [["🤦‍♀️", "🤦‍♀"], "", "", ["woman-facepalming"], 40, 20, 15, 0],
      "1f926-200d-2642-fe0f": [["🤦‍♂️", "🤦‍♂"], "", "", ["man-facepalming"], 40, 26, 15, 0],
      "1f926": [["🤦"], "", "", ["face_palm"], 40, 32, 15, 0],
      "1f927": [["🤧"], "", "", ["sneezing_face"], 40, 38, 15, 0],
      "1f928": [["🤨"], "", "", ["face_with_raised_eyebrow", "face_with_one_eyebrow_raised"], 40, 39, 15, 0],
      "1f929": [["🤩"], "", "", ["star-struck", "grinning_face_with_star_eyes"], 40, 40, 15, 0],
      "1f92a": [["🤪"], "", "", ["zany_face", "grinning_face_with_one_large_and_one_small_eye"], 40, 41, 15, 0],
      "1f92b": [["🤫"], "", "", ["shushing_face", "face_with_finger_covering_closed_lips"], 40, 42, 15, 0],
      "1f92c": [["🤬"], "", "", ["face_with_symbols_on_mouth", "serious_face_with_symbols_covering_mouth"], 40, 43, 15, 0],
      "1f92d": [["🤭"], "", "", ["face_with_hand_over_mouth", "smiling_face_with_smiling_eyes_and_hand_covering_mouth"], 40, 44, 15, 0],
      "1f92e": [["🤮"], "", "", ["face_vomiting", "face_with_open_mouth_vomiting"], 40, 45, 15, 0],
      "1f92f": [["🤯"], "", "", ["exploding_head", "shocked_face_with_exploding_head"], 40, 46, 15, 0],
      "1f930": [["🤰"], "", "", ["pregnant_woman"], 40, 47, 15, 0],
      "1f931": [["🤱"], "", "", ["breast-feeding"], 40, 53, 15, 0],
      "1f932": [["🤲"], "", "", ["palms_up_together"], 40, 59, 15, 0],
      "1f933": [["🤳"], "", "", ["selfie"], 41, 4, 15, 0],
      "1f934": [["🤴"], "", "", ["prince"], 41, 10, 15, 0],
      "1f935-200d-2640-fe0f": [["🤵‍♀️", "🤵‍♀"], "", "", ["woman_in_tuxedo"], 41, 16, 15, 0],
      "1f935-200d-2642-fe0f": [["🤵‍♂️", "🤵‍♂"], "", "", ["man_in_tuxedo"], 41, 22, 15, 0],
      "1f935": [["🤵"], "", "", ["person_in_tuxedo"], 41, 28, 15, 0],
      "1f936": [["🤶"], "", "", ["mrs_claus", "mother_christmas"], 41, 34, 15, 0],
      "1f937-200d-2640-fe0f": [["🤷‍♀️", "🤷‍♀"], "", "", ["woman-shrugging"], 41, 40, 15, 0],
      "1f937-200d-2642-fe0f": [["🤷‍♂️", "🤷‍♂"], "", "", ["man-shrugging"], 41, 46, 15, 0],
      "1f937": [["🤷"], "", "", ["shrug"], 41, 52, 15, 0],
      "1f938-200d-2640-fe0f": [["🤸‍♀️", "🤸‍♀"], "", "", ["woman-cartwheeling"], 41, 58, 15, 0],
      "1f938-200d-2642-fe0f": [["🤸‍♂️", "🤸‍♂"], "", "", ["man-cartwheeling"], 42, 3, 15, 0],
      "1f938": [["🤸"], "", "", ["person_doing_cartwheel"], 42, 9, 15, 0],
      "1f939-200d-2640-fe0f": [["🤹‍♀️", "🤹‍♀"], "", "", ["woman-juggling"], 42, 15, 15, 0],
      "1f939-200d-2642-fe0f": [["🤹‍♂️", "🤹‍♂"], "", "", ["man-juggling"], 42, 21, 15, 0],
      "1f939": [["🤹"], "", "", ["juggling"], 42, 27, 15, 0],
      "1f93a": [["🤺"], "", "", ["fencer"], 42, 33, 15, 0],
      "1f93c-200d-2640-fe0f": [["🤼‍♀️", "🤼‍♀"], "", "", ["woman-wrestling"], 42, 34, 15, 0],
      "1f93c-200d-2642-fe0f": [["🤼‍♂️", "🤼‍♂"], "", "", ["man-wrestling"], 42, 35, 15, 0],
      "1f93c": [["🤼"], "", "", ["wrestlers"], 42, 36, 15, 0],
      "1f93d-200d-2640-fe0f": [["🤽‍♀️", "🤽‍♀"], "", "", ["woman-playing-water-polo"], 42, 37, 15, 0],
      "1f93d-200d-2642-fe0f": [["🤽‍♂️", "🤽‍♂"], "", "", ["man-playing-water-polo"], 42, 43, 15, 0],
      "1f93d": [["🤽"], "", "", ["water_polo"], 42, 49, 15, 0],
      "1f93e-200d-2640-fe0f": [["🤾‍♀️", "🤾‍♀"], "", "", ["woman-playing-handball"], 42, 55, 15, 0],
      "1f93e-200d-2642-fe0f": [["🤾‍♂️", "🤾‍♂"], "", "", ["man-playing-handball"], 43, 0, 15, 0],
      "1f93e": [["🤾"], "", "", ["handball"], 43, 6, 15, 0],
      "1f93f": [["🤿"], "", "", ["diving_mask"], 43, 12, 15, 0],
      "1f940": [["🥀"], "", "", ["wilted_flower"], 43, 13, 15, 0],
      "1f941": [["🥁"], "", "", ["drum_with_drumsticks"], 43, 14, 15, 0],
      "1f942": [["🥂"], "", "", ["clinking_glasses"], 43, 15, 15, 0],
      "1f943": [["🥃"], "", "", ["tumbler_glass"], 43, 16, 15, 0],
      "1f944": [["🥄"], "", "", ["spoon"], 43, 17, 15, 0],
      "1f945": [["🥅"], "", "", ["goal_net"], 43, 18, 15, 0],
      "1f947": [["🥇"], "", "", ["first_place_medal"], 43, 19, 15, 0],
      "1f948": [["🥈"], "", "", ["second_place_medal"], 43, 20, 15, 0],
      "1f949": [["🥉"], "", "", ["third_place_medal"], 43, 21, 15, 0],
      "1f94a": [["🥊"], "", "", ["boxing_glove"], 43, 22, 15, 0],
      "1f94b": [["🥋"], "", "", ["martial_arts_uniform"], 43, 23, 15, 0],
      "1f94c": [["🥌"], "", "", ["curling_stone"], 43, 24, 15, 0],
      "1f94d": [["🥍"], "", "", ["lacrosse"], 43, 25, 15, 0],
      "1f94e": [["🥎"], "", "", ["softball"], 43, 26, 15, 0],
      "1f94f": [["🥏"], "", "", ["flying_disc"], 43, 27, 15, 0],
      "1f950": [["🥐"], "", "", ["croissant"], 43, 28, 15, 0],
      "1f951": [["🥑"], "", "", ["avocado"], 43, 29, 15, 0],
      "1f952": [["🥒"], "", "", ["cucumber"], 43, 30, 15, 0],
      "1f953": [["🥓"], "", "", ["bacon"], 43, 31, 15, 0],
      "1f954": [["🥔"], "", "", ["potato"], 43, 32, 15, 0],
      "1f955": [["🥕"], "", "", ["carrot"], 43, 33, 15, 0],
      "1f956": [["🥖"], "", "", ["baguette_bread"], 43, 34, 15, 0],
      "1f957": [["🥗"], "", "", ["green_salad"], 43, 35, 15, 0],
      "1f958": [["🥘"], "", "", ["shallow_pan_of_food"], 43, 36, 15, 0],
      "1f959": [["🥙"], "", "", ["stuffed_flatbread"], 43, 37, 15, 0],
      "1f95a": [["🥚"], "", "", ["egg"], 43, 38, 15, 0],
      "1f95b": [["🥛"], "", "", ["glass_of_milk"], 43, 39, 15, 0],
      "1f95c": [["🥜"], "", "", ["peanuts"], 43, 40, 15, 0],
      "1f95d": [["🥝"], "", "", ["kiwifruit"], 43, 41, 15, 0],
      "1f95e": [["🥞"], "", "", ["pancakes"], 43, 42, 15, 0],
      "1f95f": [["🥟"], "", "", ["dumpling"], 43, 43, 15, 0],
      "1f960": [["🥠"], "", "", ["fortune_cookie"], 43, 44, 15, 0],
      "1f961": [["🥡"], "", "", ["takeout_box"], 43, 45, 15, 0],
      "1f962": [["🥢"], "", "", ["chopsticks"], 43, 46, 15, 0],
      "1f963": [["🥣"], "", "", ["bowl_with_spoon"], 43, 47, 15, 0],
      "1f964": [["🥤"], "", "", ["cup_with_straw"], 43, 48, 15, 0],
      "1f965": [["🥥"], "", "", ["coconut"], 43, 49, 15, 0],
      "1f966": [["🥦"], "", "", ["broccoli"], 43, 50, 15, 0],
      "1f967": [["🥧"], "", "", ["pie"], 43, 51, 15, 0],
      "1f968": [["🥨"], "", "", ["pretzel"], 43, 52, 15, 0],
      "1f969": [["🥩"], "", "", ["cut_of_meat"], 43, 53, 15, 0],
      "1f96a": [["🥪"], "", "", ["sandwich"], 43, 54, 15, 0],
      "1f96b": [["🥫"], "", "", ["canned_food"], 43, 55, 15, 0],
      "1f96c": [["🥬"], "", "", ["leafy_green"], 43, 56, 15, 0],
      "1f96d": [["🥭"], "", "", ["mango"], 43, 57, 15, 0],
      "1f96e": [["🥮"], "", "", ["moon_cake"], 43, 58, 15, 0],
      "1f96f": [["🥯"], "", "", ["bagel"], 43, 59, 15, 0],
      "1f970": [["🥰"], "", "", ["smiling_face_with_3_hearts"], 43, 60, 15, 0],
      "1f971": [["🥱"], "", "", ["yawning_face"], 44, 0, 15, 0],
      "1f972": [["🥲"], "", "", ["smiling_face_with_tear"], 44, 1, 15, 0],
      "1f973": [["🥳"], "", "", ["partying_face"], 44, 2, 15, 0],
      "1f974": [["🥴"], "", "", ["woozy_face"], 44, 3, 15, 0],
      "1f975": [["🥵"], "", "", ["hot_face"], 44, 4, 15, 0],
      "1f976": [["🥶"], "", "", ["cold_face"], 44, 5, 15, 0],
      "1f977": [["🥷"], "", "", ["ninja"], 44, 6, 15, 0],
      "1f978": [["🥸"], "", "", ["disguised_face"], 44, 12, 15, 0],
      "1f979": [["🥹"], "", "", ["face_holding_back_tears"], 44, 13, 15, 0],
      "1f97a": [["🥺"], "", "", ["pleading_face"], 44, 14, 15, 0],
      "1f97b": [["🥻"], "", "", ["sari"], 44, 15, 15, 0],
      "1f97c": [["🥼"], "", "", ["lab_coat"], 44, 16, 15, 0],
      "1f97d": [["🥽"], "", "", ["goggles"], 44, 17, 15, 0],
      "1f97e": [["🥾"], "", "", ["hiking_boot"], 44, 18, 15, 0],
      "1f97f": [["🥿"], "", "", ["womans_flat_shoe"], 44, 19, 15, 0],
      "1f980": [["🦀"], "", "", ["crab"], 44, 20, 15, 0],
      "1f981": [["🦁"], "", "", ["lion_face"], 44, 21, 15, 0],
      "1f982": [["🦂"], "", "", ["scorpion"], 44, 22, 15, 0],
      "1f983": [["🦃"], "", "", ["turkey"], 44, 23, 15, 0],
      "1f984": [["🦄"], "", "", ["unicorn_face"], 44, 24, 15, 0],
      "1f985": [["🦅"], "", "", ["eagle"], 44, 25, 15, 0],
      "1f986": [["🦆"], "", "", ["duck"], 44, 26, 15, 0],
      "1f987": [["🦇"], "", "", ["bat"], 44, 27, 15, 0],
      "1f988": [["🦈"], "", "", ["shark"], 44, 28, 15, 0],
      "1f989": [["🦉"], "", "", ["owl"], 44, 29, 15, 0],
      "1f98a": [["🦊"], "", "", ["fox_face"], 44, 30, 15, 0],
      "1f98b": [["🦋"], "", "", ["butterfly"], 44, 31, 15, 0],
      "1f98c": [["🦌"], "", "", ["deer"], 44, 32, 15, 0],
      "1f98d": [["🦍"], "", "", ["gorilla"], 44, 33, 15, 0],
      "1f98e": [["🦎"], "", "", ["lizard"], 44, 34, 15, 0],
      "1f98f": [["🦏"], "", "", ["rhinoceros"], 44, 35, 15, 0],
      "1f990": [["🦐"], "", "", ["shrimp"], 44, 36, 15, 0],
      "1f991": [["🦑"], "", "", ["squid"], 44, 37, 15, 0],
      "1f992": [["🦒"], "", "", ["giraffe_face"], 44, 38, 15, 0],
      "1f993": [["🦓"], "", "", ["zebra_face"], 44, 39, 15, 0],
      "1f994": [["🦔"], "", "", ["hedgehog"], 44, 40, 15, 0],
      "1f995": [["🦕"], "", "", ["sauropod"], 44, 41, 15, 0],
      "1f996": [["🦖"], "", "", ["t-rex"], 44, 42, 15, 0],
      "1f997": [["🦗"], "", "", ["cricket"], 44, 43, 15, 0],
      "1f998": [["🦘"], "", "", ["kangaroo"], 44, 44, 15, 0],
      "1f999": [["🦙"], "", "", ["llama"], 44, 45, 15, 0],
      "1f99a": [["🦚"], "", "", ["peacock"], 44, 46, 15, 0],
      "1f99b": [["🦛"], "", "", ["hippopotamus"], 44, 47, 15, 0],
      "1f99c": [["🦜"], "", "", ["parrot"], 44, 48, 15, 0],
      "1f99d": [["🦝"], "", "", ["raccoon"], 44, 49, 15, 0],
      "1f99e": [["🦞"], "", "", ["lobster"], 44, 50, 15, 0],
      "1f99f": [["🦟"], "", "", ["mosquito"], 44, 51, 15, 0],
      "1f9a0": [["🦠"], "", "", ["microbe"], 44, 52, 15, 0],
      "1f9a1": [["🦡"], "", "", ["badger"], 44, 53, 15, 0],
      "1f9a2": [["🦢"], "", "", ["swan"], 44, 54, 15, 0],
      "1f9a3": [["🦣"], "", "", ["mammoth"], 44, 55, 15, 0],
      "1f9a4": [["🦤"], "", "", ["dodo"], 44, 56, 15, 0],
      "1f9a5": [["🦥"], "", "", ["sloth"], 44, 57, 15, 0],
      "1f9a6": [["🦦"], "", "", ["otter"], 44, 58, 15, 0],
      "1f9a7": [["🦧"], "", "", ["orangutan"], 44, 59, 15, 0],
      "1f9a8": [["🦨"], "", "", ["skunk"], 44, 60, 15, 0],
      "1f9a9": [["🦩"], "", "", ["flamingo"], 45, 0, 15, 0],
      "1f9aa": [["🦪"], "", "", ["oyster"], 45, 1, 15, 0],
      "1f9ab": [["🦫"], "", "", ["beaver"], 45, 2, 15, 0],
      "1f9ac": [["🦬"], "", "", ["bison"], 45, 3, 15, 0],
      "1f9ad": [["🦭"], "", "", ["seal"], 45, 4, 15, 0],
      "1f9ae": [["🦮"], "", "", ["guide_dog"], 45, 5, 15, 0],
      "1f9af": [["🦯"], "", "", ["probing_cane"], 45, 6, 15, 0],
      "1f9b4": [["🦴"], "", "", ["bone"], 45, 7, 15, 0],
      "1f9b5": [["🦵"], "", "", ["leg"], 45, 8, 15, 0],
      "1f9b6": [["🦶"], "", "", ["foot"], 45, 14, 15, 0],
      "1f9b7": [["🦷"], "", "", ["tooth"], 45, 20, 15, 0],
      "1f9b8-200d-2640-fe0f": [["🦸‍♀️", "🦸‍♀"], "", "", ["female_superhero"], 45, 21, 15, 0],
      "1f9b8-200d-2642-fe0f": [["🦸‍♂️", "🦸‍♂"], "", "", ["male_superhero"], 45, 27, 15, 0],
      "1f9b8": [["🦸"], "", "", ["superhero"], 45, 33, 15, 0],
      "1f9b9-200d-2640-fe0f": [["🦹‍♀️", "🦹‍♀"], "", "", ["female_supervillain"], 45, 39, 15, 0],
      "1f9b9-200d-2642-fe0f": [["🦹‍♂️", "🦹‍♂"], "", "", ["male_supervillain"], 45, 45, 15, 0],
      "1f9b9": [["🦹"], "", "", ["supervillain"], 45, 51, 15, 0],
      "1f9ba": [["🦺"], "", "", ["safety_vest"], 45, 57, 15, 0],
      "1f9bb": [["🦻"], "", "", ["ear_with_hearing_aid"], 45, 58, 15, 0],
      "1f9bc": [["🦼"], "", "", ["motorized_wheelchair"], 46, 3, 15, 0],
      "1f9bd": [["🦽"], "", "", ["manual_wheelchair"], 46, 4, 15, 0],
      "1f9be": [["🦾"], "", "", ["mechanical_arm"], 46, 5, 15, 0],
      "1f9bf": [["🦿"], "", "", ["mechanical_leg"], 46, 6, 15, 0],
      "1f9c0": [["🧀"], "", "", ["cheese_wedge"], 46, 7, 15, 0],
      "1f9c1": [["🧁"], "", "", ["cupcake"], 46, 8, 15, 0],
      "1f9c2": [["🧂"], "", "", ["salt"], 46, 9, 15, 0],
      "1f9c3": [["🧃"], "", "", ["beverage_box"], 46, 10, 15, 0],
      "1f9c4": [["🧄"], "", "", ["garlic"], 46, 11, 15, 0],
      "1f9c5": [["🧅"], "", "", ["onion"], 46, 12, 15, 0],
      "1f9c6": [["🧆"], "", "", ["falafel"], 46, 13, 15, 0],
      "1f9c7": [["🧇"], "", "", ["waffle"], 46, 14, 15, 0],
      "1f9c8": [["🧈"], "", "", ["butter"], 46, 15, 15, 0],
      "1f9c9": [["🧉"], "", "", ["mate_drink"], 46, 16, 15, 0],
      "1f9ca": [["🧊"], "", "", ["ice_cube"], 46, 17, 15, 0],
      "1f9cb": [["🧋"], "", "", ["bubble_tea"], 46, 18, 15, 0],
      "1f9cc": [["🧌"], "", "", ["troll"], 46, 19, 15, 0],
      "1f9cd-200d-2640-fe0f": [["🧍‍♀️", "🧍‍♀"], "", "", ["woman_standing"], 46, 20, 15, 0],
      "1f9cd-200d-2642-fe0f": [["🧍‍♂️", "🧍‍♂"], "", "", ["man_standing"], 46, 26, 15, 0],
      "1f9cd": [["🧍"], "", "", ["standing_person"], 46, 32, 15, 0],
      "1f9ce-200d-2640-fe0f": [["🧎‍♀️", "🧎‍♀"], "", "", ["woman_kneeling"], 46, 38, 15, 0],
      "1f9ce-200d-2642-fe0f": [["🧎‍♂️", "🧎‍♂"], "", "", ["man_kneeling"], 46, 44, 15, 0],
      "1f9ce": [["🧎"], "", "", ["kneeling_person"], 46, 50, 15, 0],
      "1f9cf-200d-2640-fe0f": [["🧏‍♀️", "🧏‍♀"], "", "", ["deaf_woman"], 46, 56, 15, 0],
      "1f9cf-200d-2642-fe0f": [["🧏‍♂️", "🧏‍♂"], "", "", ["deaf_man"], 47, 1, 15, 0],
      "1f9cf": [["🧏"], "", "", ["deaf_person"], 47, 7, 15, 0],
      "1f9d0": [["🧐"], "", "", ["face_with_monocle"], 47, 13, 15, 0],
      "1f9d1-200d-1f33e": [["🧑‍🌾"], "", "", ["farmer"], 47, 14, 15, 0],
      "1f9d1-200d-1f373": [["🧑‍🍳"], "", "", ["cook"], 47, 20, 15, 0],
      "1f9d1-200d-1f37c": [["🧑‍🍼"], "", "", ["person_feeding_baby"], 47, 26, 15, 0],
      "1f9d1-200d-1f384": [["🧑‍🎄"], "", "", ["mx_claus"], 47, 32, 15, 0],
      "1f9d1-200d-1f393": [["🧑‍🎓"], "", "", ["student"], 47, 38, 15, 0],
      "1f9d1-200d-1f3a4": [["🧑‍🎤"], "", "", ["singer"], 47, 44, 15, 0],
      "1f9d1-200d-1f3a8": [["🧑‍🎨"], "", "", ["artist"], 47, 50, 15, 0],
      "1f9d1-200d-1f3eb": [["🧑‍🏫"], "", "", ["teacher"], 47, 56, 15, 0],
      "1f9d1-200d-1f3ed": [["🧑‍🏭"], "", "", ["factory_worker"], 48, 1, 15, 0],
      "1f9d1-200d-1f4bb": [["🧑‍💻"], "", "", ["technologist"], 48, 7, 15, 0],
      "1f9d1-200d-1f4bc": [["🧑‍💼"], "", "", ["office_worker"], 48, 13, 15, 0],
      "1f9d1-200d-1f527": [["🧑‍🔧"], "", "", ["mechanic"], 48, 19, 15, 0],
      "1f9d1-200d-1f52c": [["🧑‍🔬"], "", "", ["scientist"], 48, 25, 15, 0],
      "1f9d1-200d-1f680": [["🧑‍🚀"], "", "", ["astronaut"], 48, 31, 15, 0],
      "1f9d1-200d-1f692": [["🧑‍🚒"], "", "", ["firefighter"], 48, 37, 15, 0],
      "1f9d1-200d-1f91d-200d-1f9d1": [["🧑‍🤝‍🧑"], "", "", ["people_holding_hands"], 48, 43, 15, 0],
      "1f9d1-200d-1f9af": [["🧑‍🦯"], "", "", ["person_with_probing_cane"], 49, 8, 15, 0],
      "1f9d1-200d-1f9b0": [["🧑‍🦰"], "", "", ["red_haired_person"], 49, 14, 15, 0],
      "1f9d1-200d-1f9b1": [["🧑‍🦱"], "", "", ["curly_haired_person"], 49, 20, 15, 0],
      "1f9d1-200d-1f9b2": [["🧑‍🦲"], "", "", ["bald_person"], 49, 26, 15, 0],
      "1f9d1-200d-1f9b3": [["🧑‍🦳"], "", "", ["white_haired_person"], 49, 32, 15, 0],
      "1f9d1-200d-1f9bc": [["🧑‍🦼"], "", "", ["person_in_motorized_wheelchair"], 49, 38, 15, 0],
      "1f9d1-200d-1f9bd": [["🧑‍🦽"], "", "", ["person_in_manual_wheelchair"], 49, 44, 15, 0],
      "1f9d1-200d-2695-fe0f": [["🧑‍⚕️", "🧑‍⚕"], "", "", ["health_worker"], 49, 50, 15, 0],
      "1f9d1-200d-2696-fe0f": [["🧑‍⚖️", "🧑‍⚖"], "", "", ["judge"], 49, 56, 15, 0],
      "1f9d1-200d-2708-fe0f": [["🧑‍✈️", "🧑‍✈"], "", "", ["pilot"], 50, 1, 15, 0],
      "1f9d1": [["🧑"], "", "", ["adult"], 50, 7, 15, 0],
      "1f9d2": [["🧒"], "", "", ["child"], 50, 13, 15, 0],
      "1f9d3": [["🧓"], "", "", ["older_adult"], 50, 19, 15, 0],
      "1f9d4-200d-2640-fe0f": [["🧔‍♀️", "🧔‍♀"], "", "", ["woman_with_beard"], 50, 25, 15, 0],
      "1f9d4-200d-2642-fe0f": [["🧔‍♂️", "🧔‍♂"], "", "", ["man_with_beard"], 50, 31, 15, 0],
      "1f9d4": [["🧔"], "", "", ["bearded_person"], 50, 37, 15, 0],
      "1f9d5": [["🧕"], "", "", ["person_with_headscarf"], 50, 43, 15, 0],
      "1f9d6-200d-2640-fe0f": [["🧖‍♀️", "🧖‍♀"], "", "", ["woman_in_steamy_room"], 50, 49, 15, 0],
      "1f9d6-200d-2642-fe0f": [["🧖‍♂️", "🧖‍♂", "🧖"], "", "", ["man_in_steamy_room", "person_in_steamy_room"], 50, 55, 15, 0],
      "1f9d7-200d-2640-fe0f": [["🧗‍♀️", "🧗‍♀", "🧗"], "", "", ["woman_climbing", "person_climbing"], 51, 6, 15, 0],
      "1f9d7-200d-2642-fe0f": [["🧗‍♂️", "🧗‍♂"], "", "", ["man_climbing"], 51, 12, 15, 0],
      "1f9d8-200d-2640-fe0f": [["🧘‍♀️", "🧘‍♀", "🧘"], "", "", ["woman_in_lotus_position", "person_in_lotus_position"], 51, 24, 15, 0],
      "1f9d8-200d-2642-fe0f": [["🧘‍♂️", "🧘‍♂"], "", "", ["man_in_lotus_position"], 51, 30, 15, 0],
      "1f9d9-200d-2640-fe0f": [["🧙‍♀️", "🧙‍♀", "🧙"], "", "", ["female_mage", "mage"], 51, 42, 15, 0],
      "1f9d9-200d-2642-fe0f": [["🧙‍♂️", "🧙‍♂"], "", "", ["male_mage"], 51, 48, 15, 0],
      "1f9da-200d-2640-fe0f": [["🧚‍♀️", "🧚‍♀", "🧚"], "", "", ["female_fairy", "fairy"], 51, 60, 15, 0],
      "1f9da-200d-2642-fe0f": [["🧚‍♂️", "🧚‍♂"], "", "", ["male_fairy"], 52, 5, 15, 0],
      "1f9db-200d-2640-fe0f": [["🧛‍♀️", "🧛‍♀", "🧛"], "", "", ["female_vampire", "vampire"], 52, 17, 15, 0],
      "1f9db-200d-2642-fe0f": [["🧛‍♂️", "🧛‍♂"], "", "", ["male_vampire"], 52, 23, 15, 0],
      "1f9dc-200d-2640-fe0f": [["🧜‍♀️", "🧜‍♀"], "", "", ["mermaid"], 52, 35, 15, 0],
      "1f9dc-200d-2642-fe0f": [["🧜‍♂️", "🧜‍♂", "🧜"], "", "", ["merman", "merperson"], 52, 41, 15, 0],
      "1f9dd-200d-2640-fe0f": [["🧝‍♀️", "🧝‍♀"], "", "", ["female_elf"], 52, 53, 15, 0],
      "1f9dd-200d-2642-fe0f": [["🧝‍♂️", "🧝‍♂", "🧝"], "", "", ["male_elf", "elf"], 52, 59, 15, 0],
      "1f9de-200d-2640-fe0f": [["🧞‍♀️", "🧞‍♀"], "", "", ["female_genie"], 53, 10, 15, 0],
      "1f9de-200d-2642-fe0f": [["🧞‍♂️", "🧞‍♂", "🧞"], "", "", ["male_genie", "genie"], 53, 11, 15, 0],
      "1f9df-200d-2640-fe0f": [["🧟‍♀️", "🧟‍♀"], "", "", ["female_zombie"], 53, 13, 15, 0],
      "1f9df-200d-2642-fe0f": [["🧟‍♂️", "🧟‍♂", "🧟"], "", "", ["male_zombie", "zombie"], 53, 14, 15, 0],
      "1f9e0": [["🧠"], "", "", ["brain"], 53, 16, 15, 0],
      "1f9e1": [["🧡"], "", "", ["orange_heart"], 53, 17, 15, 0],
      "1f9e2": [["🧢"], "", "", ["billed_cap"], 53, 18, 15, 0],
      "1f9e3": [["🧣"], "", "", ["scarf"], 53, 19, 15, 0],
      "1f9e4": [["🧤"], "", "", ["gloves"], 53, 20, 15, 0],
      "1f9e5": [["🧥"], "", "", ["coat"], 53, 21, 15, 0],
      "1f9e6": [["🧦"], "", "", ["socks"], 53, 22, 15, 0],
      "1f9e7": [["🧧"], "", "", ["red_envelope"], 53, 23, 15, 0],
      "1f9e8": [["🧨"], "", "", ["firecracker"], 53, 24, 15, 0],
      "1f9e9": [["🧩"], "", "", ["jigsaw"], 53, 25, 15, 0],
      "1f9ea": [["🧪"], "", "", ["test_tube"], 53, 26, 15, 0],
      "1f9eb": [["🧫"], "", "", ["petri_dish"], 53, 27, 15, 0],
      "1f9ec": [["🧬"], "", "", ["dna"], 53, 28, 15, 0],
      "1f9ed": [["🧭"], "", "", ["compass"], 53, 29, 15, 0],
      "1f9ee": [["🧮"], "", "", ["abacus"], 53, 30, 15, 0],
      "1f9ef": [["🧯"], "", "", ["fire_extinguisher"], 53, 31, 15, 0],
      "1f9f0": [["🧰"], "", "", ["toolbox"], 53, 32, 15, 0],
      "1f9f1": [["🧱"], "", "", ["bricks"], 53, 33, 15, 0],
      "1f9f2": [["🧲"], "", "", ["magnet"], 53, 34, 15, 0],
      "1f9f3": [["🧳"], "", "", ["luggage"], 53, 35, 15, 0],
      "1f9f4": [["🧴"], "", "", ["lotion_bottle"], 53, 36, 15, 0],
      "1f9f5": [["🧵"], "", "", ["thread"], 53, 37, 15, 0],
      "1f9f6": [["🧶"], "", "", ["yarn"], 53, 38, 15, 0],
      "1f9f7": [["🧷"], "", "", ["safety_pin"], 53, 39, 15, 0],
      "1f9f8": [["🧸"], "", "", ["teddy_bear"], 53, 40, 15, 0],
      "1f9f9": [["🧹"], "", "", ["broom"], 53, 41, 15, 0],
      "1f9fa": [["🧺"], "", "", ["basket"], 53, 42, 15, 0],
      "1f9fb": [["🧻"], "", "", ["roll_of_paper"], 53, 43, 15, 0],
      "1f9fc": [["🧼"], "", "", ["soap"], 53, 44, 15, 0],
      "1f9fd": [["🧽"], "", "", ["sponge"], 53, 45, 15, 0],
      "1f9fe": [["🧾"], "", "", ["receipt"], 53, 46, 15, 0],
      "1f9ff": [["🧿"], "", "", ["nazar_amulet"], 53, 47, 15, 0],
      "1fa70": [["🩰"], "", "", ["ballet_shoes"], 53, 48, 15, 0],
      "1fa71": [["🩱"], "", "", ["one-piece_swimsuit"], 53, 49, 15, 0],
      "1fa72": [["🩲"], "", "", ["briefs"], 53, 50, 15, 0],
      "1fa73": [["🩳"], "", "", ["shorts"], 53, 51, 15, 0],
      "1fa74": [["🩴"], "", "", ["thong_sandal"], 53, 52, 15, 0],
      "1fa75": [["🩵"], "", "", ["light_blue_heart"], 53, 53, 3, 0],
      "1fa76": [["🩶"], "", "", ["grey_heart"], 53, 54, 3, 0],
      "1fa77": [["🩷"], "", "", ["pink_heart"], 53, 55, 3, 0],
      "1fa78": [["🩸"], "", "", ["drop_of_blood"], 53, 56, 15, 0],
      "1fa79": [["🩹"], "", "", ["adhesive_bandage"], 53, 57, 15, 0],
      "1fa7a": [["🩺"], "", "", ["stethoscope"], 53, 58, 15, 0],
      "1fa7b": [["🩻"], "", "", ["x-ray"], 53, 59, 15, 0],
      "1fa7c": [["🩼"], "", "", ["crutch"], 53, 60, 15, 0],
      "1fa80": [["🪀"], "", "", ["yo-yo"], 54, 0, 15, 0],
      "1fa81": [["🪁"], "", "", ["kite"], 54, 1, 15, 0],
      "1fa82": [["🪂"], "", "", ["parachute"], 54, 2, 15, 0],
      "1fa83": [["🪃"], "", "", ["boomerang"], 54, 3, 15, 0],
      "1fa84": [["🪄"], "", "", ["magic_wand"], 54, 4, 15, 0],
      "1fa85": [["🪅"], "", "", ["pinata"], 54, 5, 15, 0],
      "1fa86": [["🪆"], "", "", ["nesting_dolls"], 54, 6, 15, 0],
      "1fa87": [["🪇"], "", "", ["maracas"], 54, 7, 3, 0],
      "1fa88": [["🪈"], "", "", ["flute"], 54, 8, 3, 0],
      "1fa90": [["🪐"], "", "", ["ringed_planet"], 54, 9, 15, 0],
      "1fa91": [["🪑"], "", "", ["chair"], 54, 10, 15, 0],
      "1fa92": [["🪒"], "", "", ["razor"], 54, 11, 15, 0],
      "1fa93": [["🪓"], "", "", ["axe"], 54, 12, 15, 0],
      "1fa94": [["🪔"], "", "", ["diya_lamp"], 54, 13, 15, 0],
      "1fa95": [["🪕"], "", "", ["banjo"], 54, 14, 15, 0],
      "1fa96": [["🪖"], "", "", ["military_helmet"], 54, 15, 15, 0],
      "1fa97": [["🪗"], "", "", ["accordion"], 54, 16, 15, 0],
      "1fa98": [["🪘"], "", "", ["long_drum"], 54, 17, 15, 0],
      "1fa99": [["🪙"], "", "", ["coin"], 54, 18, 15, 0],
      "1fa9a": [["🪚"], "", "", ["carpentry_saw"], 54, 19, 15, 0],
      "1fa9b": [["🪛"], "", "", ["screwdriver"], 54, 20, 15, 0],
      "1fa9c": [["🪜"], "", "", ["ladder"], 54, 21, 15, 0],
      "1fa9d": [["🪝"], "", "", ["hook"], 54, 22, 15, 0],
      "1fa9e": [["🪞"], "", "", ["mirror"], 54, 23, 15, 0],
      "1fa9f": [["🪟"], "", "", ["window"], 54, 24, 15, 0],
      "1faa0": [["🪠"], "", "", ["plunger"], 54, 25, 15, 0],
      "1faa1": [["🪡"], "", "", ["sewing_needle"], 54, 26, 15, 0],
      "1faa2": [["🪢"], "", "", ["knot"], 54, 27, 15, 0],
      "1faa3": [["🪣"], "", "", ["bucket"], 54, 28, 15, 0],
      "1faa4": [["🪤"], "", "", ["mouse_trap"], 54, 29, 15, 0],
      "1faa5": [["🪥"], "", "", ["toothbrush"], 54, 30, 15, 0],
      "1faa6": [["🪦"], "", "", ["headstone"], 54, 31, 15, 0],
      "1faa7": [["🪧"], "", "", ["placard"], 54, 32, 15, 0],
      "1faa8": [["🪨"], "", "", ["rock"], 54, 33, 15, 0],
      "1faa9": [["🪩"], "", "", ["mirror_ball"], 54, 34, 15, 0],
      "1faaa": [["🪪"], "", "", ["identification_card"], 54, 35, 15, 0],
      "1faab": [["🪫"], "", "", ["low_battery"], 54, 36, 15, 0],
      "1faac": [["🪬"], "", "", ["hamsa"], 54, 37, 15, 0],
      "1faad": [["🪭"], "", "", ["folding_hand_fan"], 54, 38, 3, 0],
      "1faae": [["🪮"], "", "", ["hair_pick"], 54, 39, 3, 0],
      "1faaf": [["🪯"], "", "", ["khanda"], 54, 40, 3, 0],
      "1fab0": [["🪰"], "", "", ["fly"], 54, 41, 15, 0],
      "1fab1": [["🪱"], "", "", ["worm"], 54, 42, 15, 0],
      "1fab2": [["🪲"], "", "", ["beetle"], 54, 43, 15, 0],
      "1fab3": [["🪳"], "", "", ["cockroach"], 54, 44, 15, 0],
      "1fab4": [["🪴"], "", "", ["potted_plant"], 54, 45, 15, 0],
      "1fab5": [["🪵"], "", "", ["wood"], 54, 46, 15, 0],
      "1fab6": [["🪶"], "", "", ["feather"], 54, 47, 15, 0],
      "1fab7": [["🪷"], "", "", ["lotus"], 54, 48, 15, 0],
      "1fab8": [["🪸"], "", "", ["coral"], 54, 49, 15, 0],
      "1fab9": [["🪹"], "", "", ["empty_nest"], 54, 50, 15, 0],
      "1faba": [["🪺"], "", "", ["nest_with_eggs"], 54, 51, 15, 0],
      "1fabb": [["🪻"], "", "", ["hyacinth"], 54, 52, 3, 0],
      "1fabc": [["🪼"], "", "", ["jellyfish"], 54, 53, 3, 0],
      "1fabd": [["🪽"], "", "", ["wing"], 54, 54, 3, 0],
      "1fabf": [["🪿"], "", "", ["goose"], 54, 55, 3, 0],
      "1fac0": [["🫀"], "", "", ["anatomical_heart"], 54, 56, 15, 0],
      "1fac1": [["🫁"], "", "", ["lungs"], 54, 57, 15, 0],
      "1fac2": [["🫂"], "", "", ["people_hugging"], 54, 58, 15, 0],
      "1fac3": [["🫃"], "", "", ["pregnant_man"], 54, 59, 15, 0],
      "1fac4": [["🫄"], "", "", ["pregnant_person"], 55, 4, 15, 0],
      "1fac5": [["🫅"], "", "", ["person_with_crown"], 55, 10, 15, 0],
      "1face": [["🫎"], "", "", ["moose"], 55, 16, 3, 0],
      "1facf": [["🫏"], "", "", ["donkey"], 55, 17, 3, 0],
      "1fad0": [["🫐"], "", "", ["blueberries"], 55, 18, 15, 0],
      "1fad1": [["🫑"], "", "", ["bell_pepper"], 55, 19, 15, 0],
      "1fad2": [["🫒"], "", "", ["olive"], 55, 20, 15, 0],
      "1fad3": [["🫓"], "", "", ["flatbread"], 55, 21, 15, 0],
      "1fad4": [["🫔"], "", "", ["tamale"], 55, 22, 15, 0],
      "1fad5": [["🫕"], "", "", ["fondue"], 55, 23, 15, 0],
      "1fad6": [["🫖"], "", "", ["teapot"], 55, 24, 15, 0],
      "1fad7": [["🫗"], "", "", ["pouring_liquid"], 55, 25, 15, 0],
      "1fad8": [["🫘"], "", "", ["beans"], 55, 26, 15, 0],
      "1fad9": [["🫙"], "", "", ["jar"], 55, 27, 15, 0],
      "1fada": [["🫚"], "", "", ["ginger_root"], 55, 28, 3, 0],
      "1fadb": [["🫛"], "", "", ["pea_pod"], 55, 29, 3, 0],
      "1fae0": [["🫠"], "", "", ["melting_face"], 55, 30, 15, 0],
      "1fae1": [["🫡"], "", "", ["saluting_face"], 55, 31, 15, 0],
      "1fae2": [["🫢"], "", "", ["face_with_open_eyes_and_hand_over_mouth"], 55, 32, 15, 0],
      "1fae3": [["🫣"], "", "", ["face_with_peeking_eye"], 55, 33, 15, 0],
      "1fae4": [["🫤"], "", "", ["face_with_diagonal_mouth"], 55, 34, 15, 0],
      "1fae5": [["🫥"], "", "", ["dotted_line_face"], 55, 35, 15, 0],
      "1fae6": [["🫦"], "", "", ["biting_lip"], 55, 36, 15, 0],
      "1fae7": [["🫧"], "", "", ["bubbles"], 55, 37, 15, 0],
      "1fae8": [["🫨"], "", "", ["shaking_face"], 55, 38, 3, 0],
      "1faf0": [["🫰"], "", "", ["hand_with_index_finger_and_thumb_crossed"], 55, 39, 15, 0],
      "1faf1": [["🫱"], "", "", ["rightwards_hand"], 55, 45, 15, 0],
      "1faf2": [["🫲"], "", "", ["leftwards_hand"], 55, 51, 15, 0],
      "1faf3": [["🫳"], "", "", ["palm_down_hand"], 55, 57, 15, 0],
      "1faf4": [["🫴"], "", "", ["palm_up_hand"], 56, 2, 15, 0],
      "1faf5": [["🫵"], "", "", ["index_pointing_at_the_viewer"], 56, 8, 15, 0],
      "1faf6": [["🫶"], "", "", ["heart_hands"], 56, 14, 15, 0],
      "1faf7": [["🫷"], "", "", ["leftwards_pushing_hand"], 56, 20, 3, 0],
      "1faf8": [["🫸"], "", "", ["rightwards_pushing_hand"], 56, 26, 3, 0],
      "203c-fe0f": [["‼️", "‼"], "", "󾬆", ["bangbang"], 56, 32, 15, 0],
      "2049-fe0f": [["⁉️", "⁉"], "", "󾬅", ["interrobang"], 56, 33, 15, 0],
      "2122-fe0f": [["™️", "™"], "", "󾬪", ["tm"], 56, 34, 15, 0],
      "2139-fe0f": [["ℹ️", "ℹ"], "", "󾭇", ["information_source"], 56, 35, 15, 0],
      "2194-fe0f": [["↔️", "↔"], "", "󾫶", ["left_right_arrow"], 56, 36, 15, 0],
      "2195-fe0f": [["↕️", "↕"], "", "󾫷", ["arrow_up_down"], 56, 37, 15, 0],
      "2196-fe0f": [["↖️", "↖"], "", "󾫲", ["arrow_upper_left"], 56, 38, 15, 0],
      "2197-fe0f": [["↗️", "↗"], "", "󾫰", ["arrow_upper_right"], 56, 39, 15, 0],
      "2198-fe0f": [["↘️", "↘"], "", "󾫱", ["arrow_lower_right"], 56, 40, 15, 0],
      "2199-fe0f": [["↙️", "↙"], "", "󾫳", ["arrow_lower_left"], 56, 41, 15, 0],
      "21a9-fe0f": [["↩️", "↩"], "", "󾮃", ["leftwards_arrow_with_hook"], 56, 42, 15, 0],
      "21aa-fe0f": [["↪️", "↪"], "", "󾮈", ["arrow_right_hook"], 56, 43, 15, 0],
      "231a": [["⌚"], "", "󾀝", ["watch"], 56, 44, 15, 0],
      "231b": [["⌛"], "", "󾀜", ["hourglass"], 56, 45, 15, 0],
      "2328-fe0f": [["⌨️", "⌨"], "", "", ["keyboard"], 56, 46, 15, 0],
      "23cf-fe0f": [["⏏️", "⏏"], "", "", ["eject"], 56, 47, 15, 0],
      "23e9": [["⏩"], "", "󾫾", ["fast_forward"], 56, 48, 15, 0],
      "23ea": [["⏪"], "", "󾫿", ["rewind"], 56, 49, 15, 0],
      "23eb": [["⏫"], "", "󾬃", ["arrow_double_up"], 56, 50, 15, 0],
      "23ec": [["⏬"], "", "󾬂", ["arrow_double_down"], 56, 51, 15, 0],
      "23ed-fe0f": [["⏭️", "⏭"], "", "", ["black_right_pointing_double_triangle_with_vertical_bar"], 56, 52, 15, 0],
      "23ee-fe0f": [["⏮️", "⏮"], "", "", ["black_left_pointing_double_triangle_with_vertical_bar"], 56, 53, 15, 0],
      "23ef-fe0f": [["⏯️", "⏯"], "", "", ["black_right_pointing_triangle_with_double_vertical_bar"], 56, 54, 15, 0],
      "23f0": [["⏰"], "", "󾀪", ["alarm_clock"], 56, 55, 15, 0],
      "23f1-fe0f": [["⏱️", "⏱"], "", "", ["stopwatch"], 56, 56, 15, 0],
      "23f2-fe0f": [["⏲️", "⏲"], "", "", ["timer_clock"], 56, 57, 15, 0],
      "23f3": [["⏳"], "", "󾀛", ["hourglass_flowing_sand"], 56, 58, 15, 0],
      "23f8-fe0f": [["⏸️", "⏸"], "", "", ["double_vertical_bar"], 56, 59, 15, 0],
      "23f9-fe0f": [["⏹️", "⏹"], "", "", ["black_square_for_stop"], 56, 60, 15, 0],
      "23fa-fe0f": [["⏺️", "⏺"], "", "", ["black_circle_for_record"], 57, 0, 15, 0],
      "24c2-fe0f": [["Ⓜ️", "Ⓜ"], "", "󾟡", ["m"], 57, 1, 15, 0],
      "25aa-fe0f": [["▪️", "▪"], "", "󾭮", ["black_small_square"], 57, 2, 15, 0],
      "25ab-fe0f": [["▫️", "▫"], "", "󾭭", ["white_small_square"], 57, 3, 15, 0],
      "25b6-fe0f": [["▶️", "▶"], "", "󾫼", ["arrow_forward"], 57, 4, 15, 0],
      "25c0-fe0f": [["◀️", "◀"], "", "󾫽", ["arrow_backward"], 57, 5, 15, 0],
      "25fb-fe0f": [["◻️", "◻"], "", "󾭱", ["white_medium_square"], 57, 6, 15, 0],
      "25fc-fe0f": [["◼️", "◼"], "", "󾭲", ["black_medium_square"], 57, 7, 15, 0],
      "25fd": [["◽"], "", "󾭯", ["white_medium_small_square"], 57, 8, 15, 0],
      "25fe": [["◾"], "", "󾭰", ["black_medium_small_square"], 57, 9, 15, 0],
      "2600-fe0f": [["☀️", "☀"], "", "󾀀", ["sunny"], 57, 10, 15, 0],
      "2601-fe0f": [["☁️", "☁"], "", "󾀁", ["cloud"], 57, 11, 15, 0],
      "2602-fe0f": [["☂️", "☂"], "", "", ["umbrella"], 57, 12, 15, 0],
      "2603-fe0f": [["☃️", "☃"], "", "", ["snowman"], 57, 13, 15, 0],
      "2604-fe0f": [["☄️", "☄"], "", "", ["comet"], 57, 14, 15, 0],
      "260e-fe0f": [["☎️", "☎"], "", "󾔣", ["phone", "telephone"], 57, 15, 15, 0],
      "2611-fe0f": [["☑️", "☑"], "", "󾮋", ["ballot_box_with_check"], 57, 16, 15, 0],
      "2614": [["☔"], "", "󾀂", ["umbrella_with_rain_drops"], 57, 17, 15, 0],
      "2615": [["☕"], "", "󾦁", ["coffee"], 57, 18, 15, 0],
      "2618-fe0f": [["☘️", "☘"], "", "", ["shamrock"], 57, 19, 15, 0],
      "261d-fe0f": [["☝️", "☝"], "", "󾮘", ["point_up"], 57, 20, 15, 0],
      "2620-fe0f": [["☠️", "☠"], "", "", ["skull_and_crossbones"], 57, 26, 15, 0],
      "2622-fe0f": [["☢️", "☢"], "", "", ["radioactive_sign"], 57, 27, 15, 0],
      "2623-fe0f": [["☣️", "☣"], "", "", ["biohazard_sign"], 57, 28, 15, 0],
      "2626-fe0f": [["☦️", "☦"], "", "", ["orthodox_cross"], 57, 29, 15, 0],
      "262a-fe0f": [["☪️", "☪"], "", "", ["star_and_crescent"], 57, 30, 15, 0],
      "262e-fe0f": [["☮️", "☮"], "", "", ["peace_symbol"], 57, 31, 15, 0],
      "262f-fe0f": [["☯️", "☯"], "", "", ["yin_yang"], 57, 32, 15, 0],
      "2638-fe0f": [["☸️", "☸"], "", "", ["wheel_of_dharma"], 57, 33, 15, 0],
      "2639-fe0f": [["☹️", "☹"], "", "", ["white_frowning_face"], 57, 34, 15, 0],
      "263a-fe0f": [["☺️", "☺"], "", "󾌶", ["relaxed"], 57, 35, 15, 0],
      "2640-fe0f": [["♀️", "♀"], "", "", ["female_sign"], 57, 36, 14, 0],
      "2642-fe0f": [["♂️", "♂"], "", "", ["male_sign"], 57, 37, 14, 0],
      "2648": [["♈"], "", "󾀫", ["aries"], 57, 38, 15, 0],
      "2649": [["♉"], "", "󾀬", ["taurus"], 57, 39, 15, 0],
      "264a": [["♊"], "", "󾀭", ["gemini"], 57, 40, 15, 0],
      "264b": [["♋"], "", "󾀮", ["cancer"], 57, 41, 15, 0],
      "264c": [["♌"], "", "󾀯", ["leo"], 57, 42, 15, 0],
      "264d": [["♍"], "", "󾀰", ["virgo"], 57, 43, 15, 0],
      "264e": [["♎"], "", "󾀱", ["libra"], 57, 44, 15, 0],
      "264f": [["♏"], "", "󾀲", ["scorpius"], 57, 45, 15, 0],
      "2650": [["♐"], "", "󾀳", ["sagittarius"], 57, 46, 15, 0],
      "2651": [["♑"], "", "󾀴", ["capricorn"], 57, 47, 15, 0],
      "2652": [["♒"], "", "󾀵", ["aquarius"], 57, 48, 15, 0],
      "2653": [["♓"], "", "󾀶", ["pisces"], 57, 49, 15, 0],
      "265f-fe0f": [["♟️", "♟"], "", "", ["chess_pawn"], 57, 50, 15, 0],
      "2660-fe0f": [["♠️", "♠"], "", "󾬛", ["spades"], 57, 51, 15, 0],
      "2663-fe0f": [["♣️", "♣"], "", "󾬝", ["clubs"], 57, 52, 15, 0],
      "2665-fe0f": [["♥️", "♥"], "", "󾬚", ["hearts"], 57, 53, 15, 0],
      "2666-fe0f": [["♦️", "♦"], "", "󾬜", ["diamonds"], 57, 54, 15, 0],
      "2668-fe0f": [["♨️", "♨"], "", "󾟺", ["hotsprings"], 57, 55, 15, 0],
      "267b-fe0f": [["♻️", "♻"], "", "󾬬", ["recycle"], 57, 56, 15, 0],
      "267e-fe0f": [["♾️", "♾"], "", "", ["infinity"], 57, 57, 15, 0],
      "267f": [["♿"], "", "󾬠", ["wheelchair"], 57, 58, 15, 0],
      "2692-fe0f": [["⚒️", "⚒"], "", "", ["hammer_and_pick"], 57, 59, 15, 0],
      "2693": [["⚓"], "", "󾓁", ["anchor"], 57, 60, 15, 0],
      "2694-fe0f": [["⚔️", "⚔"], "", "", ["crossed_swords"], 58, 0, 15, 0],
      "2695-fe0f": [["⚕️", "⚕"], "", "", ["medical_symbol", "staff_of_aesculapius"], 58, 1, 14, 0],
      "2696-fe0f": [["⚖️", "⚖"], "", "", ["scales"], 58, 2, 15, 0],
      "2697-fe0f": [["⚗️", "⚗"], "", "", ["alembic"], 58, 3, 15, 0],
      "2699-fe0f": [["⚙️", "⚙"], "", "", ["gear"], 58, 4, 15, 0],
      "269b-fe0f": [["⚛️", "⚛"], "", "", ["atom_symbol"], 58, 5, 15, 0],
      "269c-fe0f": [["⚜️", "⚜"], "", "", ["fleur_de_lis"], 58, 6, 15, 0],
      "26a0-fe0f": [["⚠️", "⚠"], "", "󾬣", ["warning"], 58, 7, 15, 0],
      "26a1": [["⚡"], "", "󾀄", ["zap"], 58, 8, 15, 0],
      "26a7-fe0f": [["⚧️", "⚧"], "", "", ["transgender_symbol"], 58, 9, 15, 0],
      "26aa": [["⚪"], "", "󾭥", ["white_circle"], 58, 10, 15, 0],
      "26ab": [["⚫"], "", "󾭦", ["black_circle"], 58, 11, 15, 0],
      "26b0-fe0f": [["⚰️", "⚰"], "", "", ["coffin"], 58, 12, 15, 0],
      "26b1-fe0f": [["⚱️", "⚱"], "", "", ["funeral_urn"], 58, 13, 15, 0],
      "26bd": [["⚽"], "", "󾟔", ["soccer"], 58, 14, 15, 0],
      "26be": [["⚾"], "", "󾟑", ["baseball"], 58, 15, 15, 0],
      "26c4": [["⛄"], "", "󾀃", ["snowman_without_snow"], 58, 16, 15, 0],
      "26c5": [["⛅"], "", "󾀏", ["partly_sunny"], 58, 17, 15, 0],
      "26c8-fe0f": [["⛈️", "⛈"], "", "", ["thunder_cloud_and_rain"], 58, 18, 15, 0],
      "26ce": [["⛎"], "", "󾀷", ["ophiuchus"], 58, 19, 15, 0],
      "26cf-fe0f": [["⛏️", "⛏"], "", "", ["pick"], 58, 20, 15, 0],
      "26d1-fe0f": [["⛑️", "⛑"], "", "", ["helmet_with_white_cross"], 58, 21, 15, 0],
      "26d3-fe0f": [["⛓️", "⛓"], "", "", ["chains"], 58, 22, 15, 0],
      "26d4": [["⛔"], "", "󾬦", ["no_entry"], 58, 23, 15, 0],
      "26e9-fe0f": [["⛩️", "⛩"], "", "", ["shinto_shrine"], 58, 24, 15, 0],
      "26ea": [["⛪"], "", "󾒻", ["church"], 58, 25, 15, 0],
      "26f0-fe0f": [["⛰️", "⛰"], "", "", ["mountain"], 58, 26, 15, 0],
      "26f1-fe0f": [["⛱️", "⛱"], "", "", ["umbrella_on_ground"], 58, 27, 15, 0],
      "26f2": [["⛲"], "", "󾒼", ["fountain"], 58, 28, 15, 0],
      "26f3": [["⛳"], "", "󾟒", ["golf"], 58, 29, 15, 0],
      "26f4-fe0f": [["⛴️", "⛴"], "", "", ["ferry"], 58, 30, 15, 0],
      "26f5": [["⛵"], "", "󾟪", ["boat", "sailboat"], 58, 31, 15, 0],
      "26f7-fe0f": [["⛷️", "⛷"], "", "", ["skier"], 58, 32, 15, 0],
      "26f8-fe0f": [["⛸️", "⛸"], "", "", ["ice_skate"], 58, 33, 15, 0],
      "26f9-fe0f-200d-2640-fe0f": [["⛹️‍♀️"], "", "", ["woman-bouncing-ball"], 58, 34, 7, 0],
      "26f9-fe0f-200d-2642-fe0f": [["⛹️‍♂️", "⛹️", "⛹"], "", "", ["man-bouncing-ball", "person_with_ball"], 58, 40, 7, 0],
      "26fa": [["⛺"], "", "󾟻", ["tent"], 58, 52, 15, 0],
      "26fd": [["⛽"], "", "󾟵", ["fuelpump"], 58, 53, 15, 0],
      "2702-fe0f": [["✂️", "✂"], "", "󾔾", ["scissors"], 58, 54, 15, 0],
      "2705": [["✅"], "", "󾭊", ["white_check_mark"], 58, 55, 15, 0],
      "2708-fe0f": [["✈️", "✈"], "", "󾟩", ["airplane"], 58, 56, 15, 0],
      "2709-fe0f": [["✉️", "✉"], "", "󾔩", ["email", "envelope"], 58, 57, 15, 0],
      "270a": [["✊"], "", "󾮓", ["fist"], 58, 58, 15, 0],
      "270b": [["✋"], "", "󾮕", ["hand", "raised_hand"], 59, 3, 15, 0],
      "270c-fe0f": [["✌️", "✌"], "", "󾮔", ["v"], 59, 9, 15, 0],
      "270d-fe0f": [["✍️", "✍"], "", "", ["writing_hand"], 59, 15, 15, 0],
      "270f-fe0f": [["✏️", "✏"], "", "󾔹", ["pencil2"], 59, 21, 15, 0],
      "2712-fe0f": [["✒️", "✒"], "", "󾔶", ["black_nib"], 59, 22, 15, 0],
      "2714-fe0f": [["✔️", "✔"], "", "󾭉", ["heavy_check_mark"], 59, 23, 15, 0],
      "2716-fe0f": [["✖️", "✖"], "", "󾭓", ["heavy_multiplication_x"], 59, 24, 15, 0],
      "271d-fe0f": [["✝️", "✝"], "", "", ["latin_cross"], 59, 25, 15, 0],
      "2721-fe0f": [["✡️", "✡"], "", "", ["star_of_david"], 59, 26, 15, 0],
      "2728": [["✨"], "", "󾭠", ["sparkles"], 59, 27, 15, 0],
      "2733-fe0f": [["✳️", "✳"], "", "󾭢", ["eight_spoked_asterisk"], 59, 28, 15, 0],
      "2734-fe0f": [["✴️", "✴"], "", "󾭡", ["eight_pointed_black_star"], 59, 29, 15, 0],
      "2744-fe0f": [["❄️", "❄"], "", "󾀎", ["snowflake"], 59, 30, 15, 0],
      "2747-fe0f": [["❇️", "❇"], "", "󾭷", ["sparkle"], 59, 31, 15, 0],
      "274c": [["❌"], "", "󾭅", ["x"], 59, 32, 15, 0],
      "274e": [["❎"], "", "󾭆", ["negative_squared_cross_mark"], 59, 33, 15, 0],
      "2753": [["❓"], "", "󾬉", ["question"], 59, 34, 15, 0],
      "2754": [["❔"], "", "󾬊", ["grey_question"], 59, 35, 15, 0],
      "2755": [["❕"], "", "󾬋", ["grey_exclamation"], 59, 36, 15, 0],
      "2757": [["❗"], "", "󾬄", ["exclamation", "heavy_exclamation_mark"], 59, 37, 15, 0],
      "2763-fe0f": [["❣️", "❣"], "", "", ["heavy_heart_exclamation_mark_ornament"], 59, 38, 15, 0],
      "2764-fe0f-200d-1f525": [["❤️‍🔥", "❤‍🔥"], "", "", ["heart_on_fire"], 59, 39, 15, 0],
      "2764-fe0f-200d-1fa79": [["❤️‍🩹", "❤‍🩹"], "", "", ["mending_heart"], 59, 40, 15, 0],
      "2764-fe0f": [["❤️", "❤"], "", "󾬌", ["heart"], 59, 41, 15, 0, "<3"],
      "2795": [["➕"], "", "󾭑", ["heavy_plus_sign"], 59, 42, 15, 0],
      "2796": [["➖"], "", "󾭒", ["heavy_minus_sign"], 59, 43, 15, 0],
      "2797": [["➗"], "", "󾭔", ["heavy_division_sign"], 59, 44, 15, 0],
      "27a1-fe0f": [["➡️", "➡"], "", "󾫺", ["arrow_right"], 59, 45, 15, 0],
      "27b0": [["➰"], "", "󾬈", ["curly_loop"], 59, 46, 15, 0],
      "27bf": [["➿"], "", "󾠫", ["loop"], 59, 47, 15, 0],
      "2934-fe0f": [["⤴️", "⤴"], "", "󾫴", ["arrow_heading_up"], 59, 48, 15, 0],
      "2935-fe0f": [["⤵️", "⤵"], "", "󾫵", ["arrow_heading_down"], 59, 49, 15, 0],
      "2b05-fe0f": [["⬅️", "⬅"], "", "󾫻", ["arrow_left"], 59, 50, 15, 0],
      "2b06-fe0f": [["⬆️", "⬆"], "", "󾫸", ["arrow_up"], 59, 51, 15, 0],
      "2b07-fe0f": [["⬇️", "⬇"], "", "󾫹", ["arrow_down"], 59, 52, 15, 0],
      "2b1b": [["⬛"], "", "󾭬", ["black_large_square"], 59, 53, 15, 0],
      "2b1c": [["⬜"], "", "󾭫", ["white_large_square"], 59, 54, 15, 0],
      "2b50": [["⭐"], "", "󾭨", ["star"], 59, 55, 15, 0],
      "2b55": [["⭕"], "", "󾭄", ["o"], 59, 56, 15, 0],
      "3030-fe0f": [["〰️", "〰"], "", "󾬇", ["wavy_dash"], 59, 57, 15, 0],
      "303d-fe0f": [["〽️", "〽"], "", "󾠛", ["part_alternation_mark"], 59, 58, 15, 0],
      "3297-fe0f": [["㊗️", "㊗"], "", "󾭃", ["congratulations"], 59, 59, 15, 0],
      "3299-fe0f": [["㊙️", "㊙"], "", "󾬫", ["secret"], 59, 60, 15, 0]
    };
    emoji2.prototype.emoticons_data = {
      ":o)": "monkey_face",
      "</3": "broken_heart",
      "=)": "smiley",
      "=-)": "smiley",
      "C:": "smile",
      "c:": "smile",
      ":D": "smile",
      ":-D": "smile",
      ":>": "laughing",
      ":->": "laughing",
      ";)": "wink",
      ";-)": "wink",
      "8)": "sunglasses",
      ":|": "neutral_face",
      ":-|": "neutral_face",
      ":\\": "confused",
      ":-\\": "confused",
      ":/": "confused",
      ":-/": "confused",
      ":*": "kissing_heart",
      ":-*": "kissing_heart",
      ":p": "stuck_out_tongue",
      ":-p": "stuck_out_tongue",
      ":P": "stuck_out_tongue",
      ":-P": "stuck_out_tongue",
      ":b": "stuck_out_tongue",
      ":-b": "stuck_out_tongue",
      ";p": "stuck_out_tongue_winking_eye",
      ";-p": "stuck_out_tongue_winking_eye",
      ";b": "stuck_out_tongue_winking_eye",
      ";-b": "stuck_out_tongue_winking_eye",
      ";P": "stuck_out_tongue_winking_eye",
      ";-P": "stuck_out_tongue_winking_eye",
      "):": "disappointed",
      ":(": "disappointed",
      ":-(": "disappointed",
      ">:(": "angry",
      ">:-(": "angry",
      ":'(": "cry",
      "D:": "anguished",
      ":o": "open_mouth",
      ":-o": "open_mouth",
      ":O": "open_mouth",
      ":-O": "open_mouth",
      ":)": "slightly_smiling_face",
      "(:": "slightly_smiling_face",
      ":-)": "slightly_smiling_face",
      "<3": "heart"
    };
    emoji2.prototype.variations_data = {
      "1f385": { "1f3fb": ["1f385-1f3fb", 7, 9, 15, ["🎅🏻"]], "1f3fc": ["1f385-1f3fc", 7, 10, 15, ["🎅🏼"]], "1f3fd": ["1f385-1f3fd", 7, 11, 15, ["🎅🏽"]], "1f3fe": ["1f385-1f3fe", 7, 12, 15, ["🎅🏾"]], "1f3ff": ["1f385-1f3ff", 7, 13, 15, ["🎅🏿"]] },
      "1f3c2": { "1f3fb": ["1f3c2-1f3fb", 8, 9, 15, ["🏂🏻"]], "1f3fc": ["1f3c2-1f3fc", 8, 10, 15, ["🏂🏼"]], "1f3fd": ["1f3c2-1f3fd", 8, 11, 15, ["🏂🏽"]], "1f3fe": ["1f3c2-1f3fe", 8, 12, 15, ["🏂🏾"]], "1f3ff": ["1f3c2-1f3ff", 8, 13, 15, ["🏂🏿"]] },
      "1f3c3-200d-2640-fe0f": { "1f3fb": ["1f3c3-1f3fb-200d-2640-fe0f", 8, 15, 15, ["🏃🏻‍♀️"]], "1f3fc": ["1f3c3-1f3fc-200d-2640-fe0f", 8, 16, 15, ["🏃🏼‍♀️"]], "1f3fd": ["1f3c3-1f3fd-200d-2640-fe0f", 8, 17, 15, ["🏃🏽‍♀️"]], "1f3fe": ["1f3c3-1f3fe-200d-2640-fe0f", 8, 18, 15, ["🏃🏾‍♀️"]], "1f3ff": ["1f3c3-1f3ff-200d-2640-fe0f", 8, 19, 15, ["🏃🏿‍♀️"]] },
      "1f3c3-200d-2642-fe0f": { "1f3fb": ["1f3c3-1f3fb-200d-2642-fe0f", 8, 21, 15, ["🏃🏻‍♂️", "🏃🏻"]], "1f3fc": ["1f3c3-1f3fc-200d-2642-fe0f", 8, 22, 15, ["🏃🏼‍♂️", "🏃🏼"]], "1f3fd": ["1f3c3-1f3fd-200d-2642-fe0f", 8, 23, 15, ["🏃🏽‍♂️", "🏃🏽"]], "1f3fe": ["1f3c3-1f3fe-200d-2642-fe0f", 8, 24, 15, ["🏃🏾‍♂️", "🏃🏾"]], "1f3ff": ["1f3c3-1f3ff-200d-2642-fe0f", 8, 25, 15, ["🏃🏿‍♂️", "🏃🏿"]] },
      "1f3c4-200d-2640-fe0f": { "1f3fb": ["1f3c4-1f3fb-200d-2640-fe0f", 8, 33, 15, ["🏄🏻‍♀️"]], "1f3fc": ["1f3c4-1f3fc-200d-2640-fe0f", 8, 34, 15, ["🏄🏼‍♀️"]], "1f3fd": ["1f3c4-1f3fd-200d-2640-fe0f", 8, 35, 15, ["🏄🏽‍♀️"]], "1f3fe": ["1f3c4-1f3fe-200d-2640-fe0f", 8, 36, 15, ["🏄🏾‍♀️"]], "1f3ff": ["1f3c4-1f3ff-200d-2640-fe0f", 8, 37, 15, ["🏄🏿‍♀️"]] },
      "1f3c4-200d-2642-fe0f": { "1f3fb": ["1f3c4-1f3fb-200d-2642-fe0f", 8, 39, 15, ["🏄🏻‍♂️", "🏄🏻"]], "1f3fc": ["1f3c4-1f3fc-200d-2642-fe0f", 8, 40, 15, ["🏄🏼‍♂️", "🏄🏼"]], "1f3fd": ["1f3c4-1f3fd-200d-2642-fe0f", 8, 41, 15, ["🏄🏽‍♂️", "🏄🏽"]], "1f3fe": ["1f3c4-1f3fe-200d-2642-fe0f", 8, 42, 15, ["🏄🏾‍♂️", "🏄🏾"]], "1f3ff": ["1f3c4-1f3ff-200d-2642-fe0f", 8, 43, 15, ["🏄🏿‍♂️", "🏄🏿"]] },
      "1f3c7": { "1f3fb": ["1f3c7-1f3fb", 8, 53, 15, ["🏇🏻"]], "1f3fc": ["1f3c7-1f3fc", 8, 54, 15, ["🏇🏼"]], "1f3fd": ["1f3c7-1f3fd", 8, 55, 15, ["🏇🏽"]], "1f3fe": ["1f3c7-1f3fe", 8, 56, 15, ["🏇🏾"]], "1f3ff": ["1f3c7-1f3ff", 8, 57, 15, ["🏇🏿"]] },
      "1f3ca-200d-2640-fe0f": { "1f3fb": ["1f3ca-1f3fb-200d-2640-fe0f", 9, 0, 15, ["🏊🏻‍♀️"]], "1f3fc": ["1f3ca-1f3fc-200d-2640-fe0f", 9, 1, 15, ["🏊🏼‍♀️"]], "1f3fd": ["1f3ca-1f3fd-200d-2640-fe0f", 9, 2, 15, ["🏊🏽‍♀️"]], "1f3fe": ["1f3ca-1f3fe-200d-2640-fe0f", 9, 3, 15, ["🏊🏾‍♀️"]], "1f3ff": ["1f3ca-1f3ff-200d-2640-fe0f", 9, 4, 15, ["🏊🏿‍♀️"]] },
      "1f3ca-200d-2642-fe0f": { "1f3fb": ["1f3ca-1f3fb-200d-2642-fe0f", 9, 6, 15, ["🏊🏻‍♂️", "🏊🏻"]], "1f3fc": ["1f3ca-1f3fc-200d-2642-fe0f", 9, 7, 15, ["🏊🏼‍♂️", "🏊🏼"]], "1f3fd": ["1f3ca-1f3fd-200d-2642-fe0f", 9, 8, 15, ["🏊🏽‍♂️", "🏊🏽"]], "1f3fe": ["1f3ca-1f3fe-200d-2642-fe0f", 9, 9, 15, ["🏊🏾‍♂️", "🏊🏾"]], "1f3ff": ["1f3ca-1f3ff-200d-2642-fe0f", 9, 10, 15, ["🏊🏿‍♂️", "🏊🏿"]] },
      "1f3cb-fe0f-200d-2640-fe0f": { "1f3fb": ["1f3cb-1f3fb-200d-2640-fe0f", 9, 18, 15, ["🏋🏻‍♀️"]], "1f3fc": ["1f3cb-1f3fc-200d-2640-fe0f", 9, 19, 15, ["🏋🏼‍♀️"]], "1f3fd": ["1f3cb-1f3fd-200d-2640-fe0f", 9, 20, 15, ["🏋🏽‍♀️"]], "1f3fe": ["1f3cb-1f3fe-200d-2640-fe0f", 9, 21, 15, ["🏋🏾‍♀️"]], "1f3ff": ["1f3cb-1f3ff-200d-2640-fe0f", 9, 22, 15, ["🏋🏿‍♀️"]] },
      "1f3cb-fe0f-200d-2642-fe0f": { "1f3fb": ["1f3cb-1f3fb-200d-2642-fe0f", 9, 24, 15, ["🏋🏻‍♂️", "🏋🏻"]], "1f3fc": ["1f3cb-1f3fc-200d-2642-fe0f", 9, 25, 15, ["🏋🏼‍♂️", "🏋🏼"]], "1f3fd": ["1f3cb-1f3fd-200d-2642-fe0f", 9, 26, 15, ["🏋🏽‍♂️", "🏋🏽"]], "1f3fe": ["1f3cb-1f3fe-200d-2642-fe0f", 9, 27, 15, ["🏋🏾‍♂️", "🏋🏾"]], "1f3ff": ["1f3cb-1f3ff-200d-2642-fe0f", 9, 28, 15, ["🏋🏿‍♂️", "🏋🏿"]] },
      "1f3cc-fe0f-200d-2640-fe0f": { "1f3fb": ["1f3cc-1f3fb-200d-2640-fe0f", 9, 36, 15, ["🏌🏻‍♀️"]], "1f3fc": ["1f3cc-1f3fc-200d-2640-fe0f", 9, 37, 15, ["🏌🏼‍♀️"]], "1f3fd": ["1f3cc-1f3fd-200d-2640-fe0f", 9, 38, 15, ["🏌🏽‍♀️"]], "1f3fe": ["1f3cc-1f3fe-200d-2640-fe0f", 9, 39, 15, ["🏌🏾‍♀️"]], "1f3ff": ["1f3cc-1f3ff-200d-2640-fe0f", 9, 40, 15, ["🏌🏿‍♀️"]] },
      "1f3cc-fe0f-200d-2642-fe0f": { "1f3fb": ["1f3cc-1f3fb-200d-2642-fe0f", 9, 42, 15, ["🏌🏻‍♂️", "🏌🏻"]], "1f3fc": ["1f3cc-1f3fc-200d-2642-fe0f", 9, 43, 15, ["🏌🏼‍♂️", "🏌🏼"]], "1f3fd": ["1f3cc-1f3fd-200d-2642-fe0f", 9, 44, 15, ["🏌🏽‍♂️", "🏌🏽"]], "1f3fe": ["1f3cc-1f3fe-200d-2642-fe0f", 9, 45, 15, ["🏌🏾‍♂️", "🏌🏾"]], "1f3ff": ["1f3cc-1f3ff-200d-2642-fe0f", 9, 46, 15, ["🏌🏿‍♂️", "🏌🏿"]] },
      "1f442": { "1f3fb": ["1f442-1f3fb", 11, 57, 15, ["👂🏻"]], "1f3fc": ["1f442-1f3fc", 11, 58, 15, ["👂🏼"]], "1f3fd": ["1f442-1f3fd", 11, 59, 15, ["👂🏽"]], "1f3fe": ["1f442-1f3fe", 11, 60, 15, ["👂🏾"]], "1f3ff": ["1f442-1f3ff", 12, 0, 15, ["👂🏿"]] },
      "1f443": { "1f3fb": ["1f443-1f3fb", 12, 2, 15, ["👃🏻"]], "1f3fc": ["1f443-1f3fc", 12, 3, 15, ["👃🏼"]], "1f3fd": ["1f443-1f3fd", 12, 4, 15, ["👃🏽"]], "1f3fe": ["1f443-1f3fe", 12, 5, 15, ["👃🏾"]], "1f3ff": ["1f443-1f3ff", 12, 6, 15, ["👃🏿"]] },
      "1f446": { "1f3fb": ["1f446-1f3fb", 12, 10, 15, ["👆🏻"]], "1f3fc": ["1f446-1f3fc", 12, 11, 15, ["👆🏼"]], "1f3fd": ["1f446-1f3fd", 12, 12, 15, ["👆🏽"]], "1f3fe": ["1f446-1f3fe", 12, 13, 15, ["👆🏾"]], "1f3ff": ["1f446-1f3ff", 12, 14, 15, ["👆🏿"]] },
      "1f447": { "1f3fb": ["1f447-1f3fb", 12, 16, 15, ["👇🏻"]], "1f3fc": ["1f447-1f3fc", 12, 17, 15, ["👇🏼"]], "1f3fd": ["1f447-1f3fd", 12, 18, 15, ["👇🏽"]], "1f3fe": ["1f447-1f3fe", 12, 19, 15, ["👇🏾"]], "1f3ff": ["1f447-1f3ff", 12, 20, 15, ["👇🏿"]] },
      "1f448": { "1f3fb": ["1f448-1f3fb", 12, 22, 15, ["👈🏻"]], "1f3fc": ["1f448-1f3fc", 12, 23, 15, ["👈🏼"]], "1f3fd": ["1f448-1f3fd", 12, 24, 15, ["👈🏽"]], "1f3fe": ["1f448-1f3fe", 12, 25, 15, ["👈🏾"]], "1f3ff": ["1f448-1f3ff", 12, 26, 15, ["👈🏿"]] },
      "1f449": { "1f3fb": ["1f449-1f3fb", 12, 28, 15, ["👉🏻"]], "1f3fc": ["1f449-1f3fc", 12, 29, 15, ["👉🏼"]], "1f3fd": ["1f449-1f3fd", 12, 30, 15, ["👉🏽"]], "1f3fe": ["1f449-1f3fe", 12, 31, 15, ["👉🏾"]], "1f3ff": ["1f449-1f3ff", 12, 32, 15, ["👉🏿"]] },
      "1f44a": { "1f3fb": ["1f44a-1f3fb", 12, 34, 15, ["👊🏻"]], "1f3fc": ["1f44a-1f3fc", 12, 35, 15, ["👊🏼"]], "1f3fd": ["1f44a-1f3fd", 12, 36, 15, ["👊🏽"]], "1f3fe": ["1f44a-1f3fe", 12, 37, 15, ["👊🏾"]], "1f3ff": ["1f44a-1f3ff", 12, 38, 15, ["👊🏿"]] },
      "1f44b": { "1f3fb": ["1f44b-1f3fb", 12, 40, 15, ["👋🏻"]], "1f3fc": ["1f44b-1f3fc", 12, 41, 15, ["👋🏼"]], "1f3fd": ["1f44b-1f3fd", 12, 42, 15, ["👋🏽"]], "1f3fe": ["1f44b-1f3fe", 12, 43, 15, ["👋🏾"]], "1f3ff": ["1f44b-1f3ff", 12, 44, 15, ["👋🏿"]] },
      "1f44c": { "1f3fb": ["1f44c-1f3fb", 12, 46, 15, ["👌🏻"]], "1f3fc": ["1f44c-1f3fc", 12, 47, 15, ["👌🏼"]], "1f3fd": ["1f44c-1f3fd", 12, 48, 15, ["👌🏽"]], "1f3fe": ["1f44c-1f3fe", 12, 49, 15, ["👌🏾"]], "1f3ff": ["1f44c-1f3ff", 12, 50, 15, ["👌🏿"]] },
      "1f44d": { "1f3fb": ["1f44d-1f3fb", 12, 52, 15, ["👍🏻"]], "1f3fc": ["1f44d-1f3fc", 12, 53, 15, ["👍🏼"]], "1f3fd": ["1f44d-1f3fd", 12, 54, 15, ["👍🏽"]], "1f3fe": ["1f44d-1f3fe", 12, 55, 15, ["👍🏾"]], "1f3ff": ["1f44d-1f3ff", 12, 56, 15, ["👍🏿"]] },
      "1f44e": { "1f3fb": ["1f44e-1f3fb", 12, 58, 15, ["👎🏻"]], "1f3fc": ["1f44e-1f3fc", 12, 59, 15, ["👎🏼"]], "1f3fd": ["1f44e-1f3fd", 12, 60, 15, ["👎🏽"]], "1f3fe": ["1f44e-1f3fe", 13, 0, 15, ["👎🏾"]], "1f3ff": ["1f44e-1f3ff", 13, 1, 15, ["👎🏿"]] },
      "1f44f": { "1f3fb": ["1f44f-1f3fb", 13, 3, 15, ["👏🏻"]], "1f3fc": ["1f44f-1f3fc", 13, 4, 15, ["👏🏼"]], "1f3fd": ["1f44f-1f3fd", 13, 5, 15, ["👏🏽"]], "1f3fe": ["1f44f-1f3fe", 13, 6, 15, ["👏🏾"]], "1f3ff": ["1f44f-1f3ff", 13, 7, 15, ["👏🏿"]] },
      "1f450": { "1f3fb": ["1f450-1f3fb", 13, 9, 15, ["👐🏻"]], "1f3fc": ["1f450-1f3fc", 13, 10, 15, ["👐🏼"]], "1f3fd": ["1f450-1f3fd", 13, 11, 15, ["👐🏽"]], "1f3fe": ["1f450-1f3fe", 13, 12, 15, ["👐🏾"]], "1f3ff": ["1f450-1f3ff", 13, 13, 15, ["👐🏿"]] },
      "1f466": { "1f3fb": ["1f466-1f3fb", 13, 36, 15, ["👦🏻"]], "1f3fc": ["1f466-1f3fc", 13, 37, 15, ["👦🏼"]], "1f3fd": ["1f466-1f3fd", 13, 38, 15, ["👦🏽"]], "1f3fe": ["1f466-1f3fe", 13, 39, 15, ["👦🏾"]], "1f3ff": ["1f466-1f3ff", 13, 40, 15, ["👦🏿"]] },
      "1f467": { "1f3fb": ["1f467-1f3fb", 13, 42, 15, ["👧🏻"]], "1f3fc": ["1f467-1f3fc", 13, 43, 15, ["👧🏼"]], "1f3fd": ["1f467-1f3fd", 13, 44, 15, ["👧🏽"]], "1f3fe": ["1f467-1f3fe", 13, 45, 15, ["👧🏾"]], "1f3ff": ["1f467-1f3ff", 13, 46, 15, ["👧🏿"]] },
      "1f468-200d-1f33e": { "1f3fb": ["1f468-1f3fb-200d-1f33e", 13, 48, 15, ["👨🏻‍🌾"]], "1f3fc": ["1f468-1f3fc-200d-1f33e", 13, 49, 15, ["👨🏼‍🌾"]], "1f3fd": ["1f468-1f3fd-200d-1f33e", 13, 50, 15, ["👨🏽‍🌾"]], "1f3fe": ["1f468-1f3fe-200d-1f33e", 13, 51, 15, ["👨🏾‍🌾"]], "1f3ff": ["1f468-1f3ff-200d-1f33e", 13, 52, 15, ["👨🏿‍🌾"]] },
      "1f468-200d-1f373": { "1f3fb": ["1f468-1f3fb-200d-1f373", 13, 54, 15, ["👨🏻‍🍳"]], "1f3fc": ["1f468-1f3fc-200d-1f373", 13, 55, 15, ["👨🏼‍🍳"]], "1f3fd": ["1f468-1f3fd-200d-1f373", 13, 56, 15, ["👨🏽‍🍳"]], "1f3fe": ["1f468-1f3fe-200d-1f373", 13, 57, 15, ["👨🏾‍🍳"]], "1f3ff": ["1f468-1f3ff-200d-1f373", 13, 58, 15, ["👨🏿‍🍳"]] },
      "1f468-200d-1f37c": { "1f3fb": ["1f468-1f3fb-200d-1f37c", 13, 60, 15, ["👨🏻‍🍼"]], "1f3fc": ["1f468-1f3fc-200d-1f37c", 14, 0, 15, ["👨🏼‍🍼"]], "1f3fd": ["1f468-1f3fd-200d-1f37c", 14, 1, 15, ["👨🏽‍🍼"]], "1f3fe": ["1f468-1f3fe-200d-1f37c", 14, 2, 15, ["👨🏾‍🍼"]], "1f3ff": ["1f468-1f3ff-200d-1f37c", 14, 3, 15, ["👨🏿‍🍼"]] },
      "1f468-200d-1f393": { "1f3fb": ["1f468-1f3fb-200d-1f393", 14, 5, 15, ["👨🏻‍🎓"]], "1f3fc": ["1f468-1f3fc-200d-1f393", 14, 6, 15, ["👨🏼‍🎓"]], "1f3fd": ["1f468-1f3fd-200d-1f393", 14, 7, 15, ["👨🏽‍🎓"]], "1f3fe": ["1f468-1f3fe-200d-1f393", 14, 8, 15, ["👨🏾‍🎓"]], "1f3ff": ["1f468-1f3ff-200d-1f393", 14, 9, 15, ["👨🏿‍🎓"]] },
      "1f468-200d-1f3a4": { "1f3fb": ["1f468-1f3fb-200d-1f3a4", 14, 11, 15, ["👨🏻‍🎤"]], "1f3fc": ["1f468-1f3fc-200d-1f3a4", 14, 12, 15, ["👨🏼‍🎤"]], "1f3fd": ["1f468-1f3fd-200d-1f3a4", 14, 13, 15, ["👨🏽‍🎤"]], "1f3fe": ["1f468-1f3fe-200d-1f3a4", 14, 14, 15, ["👨🏾‍🎤"]], "1f3ff": ["1f468-1f3ff-200d-1f3a4", 14, 15, 15, ["👨🏿‍🎤"]] },
      "1f468-200d-1f3a8": { "1f3fb": ["1f468-1f3fb-200d-1f3a8", 14, 17, 15, ["👨🏻‍🎨"]], "1f3fc": ["1f468-1f3fc-200d-1f3a8", 14, 18, 15, ["👨🏼‍🎨"]], "1f3fd": ["1f468-1f3fd-200d-1f3a8", 14, 19, 15, ["👨🏽‍🎨"]], "1f3fe": ["1f468-1f3fe-200d-1f3a8", 14, 20, 15, ["👨🏾‍🎨"]], "1f3ff": ["1f468-1f3ff-200d-1f3a8", 14, 21, 15, ["👨🏿‍🎨"]] },
      "1f468-200d-1f3eb": { "1f3fb": ["1f468-1f3fb-200d-1f3eb", 14, 23, 15, ["👨🏻‍🏫"]], "1f3fc": ["1f468-1f3fc-200d-1f3eb", 14, 24, 15, ["👨🏼‍🏫"]], "1f3fd": ["1f468-1f3fd-200d-1f3eb", 14, 25, 15, ["👨🏽‍🏫"]], "1f3fe": ["1f468-1f3fe-200d-1f3eb", 14, 26, 15, ["👨🏾‍🏫"]], "1f3ff": ["1f468-1f3ff-200d-1f3eb", 14, 27, 15, ["👨🏿‍🏫"]] },
      "1f468-200d-1f3ed": { "1f3fb": ["1f468-1f3fb-200d-1f3ed", 14, 29, 15, ["👨🏻‍🏭"]], "1f3fc": ["1f468-1f3fc-200d-1f3ed", 14, 30, 15, ["👨🏼‍🏭"]], "1f3fd": ["1f468-1f3fd-200d-1f3ed", 14, 31, 15, ["👨🏽‍🏭"]], "1f3fe": ["1f468-1f3fe-200d-1f3ed", 14, 32, 15, ["👨🏾‍🏭"]], "1f3ff": ["1f468-1f3ff-200d-1f3ed", 14, 33, 15, ["👨🏿‍🏭"]] },
      "1f468-200d-1f4bb": { "1f3fb": ["1f468-1f3fb-200d-1f4bb", 14, 50, 15, ["👨🏻‍💻"]], "1f3fc": ["1f468-1f3fc-200d-1f4bb", 14, 51, 15, ["👨🏼‍💻"]], "1f3fd": ["1f468-1f3fd-200d-1f4bb", 14, 52, 15, ["👨🏽‍💻"]], "1f3fe": ["1f468-1f3fe-200d-1f4bb", 14, 53, 15, ["👨🏾‍💻"]], "1f3ff": ["1f468-1f3ff-200d-1f4bb", 14, 54, 15, ["👨🏿‍💻"]] },
      "1f468-200d-1f4bc": { "1f3fb": ["1f468-1f3fb-200d-1f4bc", 14, 56, 15, ["👨🏻‍💼"]], "1f3fc": ["1f468-1f3fc-200d-1f4bc", 14, 57, 15, ["👨🏼‍💼"]], "1f3fd": ["1f468-1f3fd-200d-1f4bc", 14, 58, 15, ["👨🏽‍💼"]], "1f3fe": ["1f468-1f3fe-200d-1f4bc", 14, 59, 15, ["👨🏾‍💼"]], "1f3ff": ["1f468-1f3ff-200d-1f4bc", 14, 60, 15, ["👨🏿‍💼"]] },
      "1f468-200d-1f527": { "1f3fb": ["1f468-1f3fb-200d-1f527", 15, 1, 15, ["👨🏻‍🔧"]], "1f3fc": ["1f468-1f3fc-200d-1f527", 15, 2, 15, ["👨🏼‍🔧"]], "1f3fd": ["1f468-1f3fd-200d-1f527", 15, 3, 15, ["👨🏽‍🔧"]], "1f3fe": ["1f468-1f3fe-200d-1f527", 15, 4, 15, ["👨🏾‍🔧"]], "1f3ff": ["1f468-1f3ff-200d-1f527", 15, 5, 15, ["👨🏿‍🔧"]] },
      "1f468-200d-1f52c": { "1f3fb": ["1f468-1f3fb-200d-1f52c", 15, 7, 15, ["👨🏻‍🔬"]], "1f3fc": ["1f468-1f3fc-200d-1f52c", 15, 8, 15, ["👨🏼‍🔬"]], "1f3fd": ["1f468-1f3fd-200d-1f52c", 15, 9, 15, ["👨🏽‍🔬"]], "1f3fe": ["1f468-1f3fe-200d-1f52c", 15, 10, 15, ["👨🏾‍🔬"]], "1f3ff": ["1f468-1f3ff-200d-1f52c", 15, 11, 15, ["👨🏿‍🔬"]] },
      "1f468-200d-1f680": { "1f3fb": ["1f468-1f3fb-200d-1f680", 15, 13, 15, ["👨🏻‍🚀"]], "1f3fc": ["1f468-1f3fc-200d-1f680", 15, 14, 15, ["👨🏼‍🚀"]], "1f3fd": ["1f468-1f3fd-200d-1f680", 15, 15, 15, ["👨🏽‍🚀"]], "1f3fe": ["1f468-1f3fe-200d-1f680", 15, 16, 15, ["👨🏾‍🚀"]], "1f3ff": ["1f468-1f3ff-200d-1f680", 15, 17, 15, ["👨🏿‍🚀"]] },
      "1f468-200d-1f692": { "1f3fb": ["1f468-1f3fb-200d-1f692", 15, 19, 15, ["👨🏻‍🚒"]], "1f3fc": ["1f468-1f3fc-200d-1f692", 15, 20, 15, ["👨🏼‍🚒"]], "1f3fd": ["1f468-1f3fd-200d-1f692", 15, 21, 15, ["👨🏽‍🚒"]], "1f3fe": ["1f468-1f3fe-200d-1f692", 15, 22, 15, ["👨🏾‍🚒"]], "1f3ff": ["1f468-1f3ff-200d-1f692", 15, 23, 15, ["👨🏿‍🚒"]] },
      "1f468-200d-1f9af": { "1f3fb": ["1f468-1f3fb-200d-1f9af", 15, 25, 15, ["👨🏻‍🦯"]], "1f3fc": ["1f468-1f3fc-200d-1f9af", 15, 26, 15, ["👨🏼‍🦯"]], "1f3fd": ["1f468-1f3fd-200d-1f9af", 15, 27, 15, ["👨🏽‍🦯"]], "1f3fe": ["1f468-1f3fe-200d-1f9af", 15, 28, 15, ["👨🏾‍🦯"]], "1f3ff": ["1f468-1f3ff-200d-1f9af", 15, 29, 15, ["👨🏿‍🦯"]] },
      "1f468-200d-1f9b0": { "1f3fb": ["1f468-1f3fb-200d-1f9b0", 15, 31, 15, ["👨🏻‍🦰"]], "1f3fc": ["1f468-1f3fc-200d-1f9b0", 15, 32, 15, ["👨🏼‍🦰"]], "1f3fd": ["1f468-1f3fd-200d-1f9b0", 15, 33, 15, ["👨🏽‍🦰"]], "1f3fe": ["1f468-1f3fe-200d-1f9b0", 15, 34, 15, ["👨🏾‍🦰"]], "1f3ff": ["1f468-1f3ff-200d-1f9b0", 15, 35, 15, ["👨🏿‍🦰"]] },
      "1f468-200d-1f9b1": { "1f3fb": ["1f468-1f3fb-200d-1f9b1", 15, 37, 15, ["👨🏻‍🦱"]], "1f3fc": ["1f468-1f3fc-200d-1f9b1", 15, 38, 15, ["👨🏼‍🦱"]], "1f3fd": ["1f468-1f3fd-200d-1f9b1", 15, 39, 15, ["👨🏽‍🦱"]], "1f3fe": ["1f468-1f3fe-200d-1f9b1", 15, 40, 15, ["👨🏾‍🦱"]], "1f3ff": ["1f468-1f3ff-200d-1f9b1", 15, 41, 15, ["👨🏿‍🦱"]] },
      "1f468-200d-1f9b2": { "1f3fb": ["1f468-1f3fb-200d-1f9b2", 15, 43, 15, ["👨🏻‍🦲"]], "1f3fc": ["1f468-1f3fc-200d-1f9b2", 15, 44, 15, ["👨🏼‍🦲"]], "1f3fd": ["1f468-1f3fd-200d-1f9b2", 15, 45, 15, ["👨🏽‍🦲"]], "1f3fe": ["1f468-1f3fe-200d-1f9b2", 15, 46, 15, ["👨🏾‍🦲"]], "1f3ff": ["1f468-1f3ff-200d-1f9b2", 15, 47, 15, ["👨🏿‍🦲"]] },
      "1f468-200d-1f9b3": { "1f3fb": ["1f468-1f3fb-200d-1f9b3", 15, 49, 15, ["👨🏻‍🦳"]], "1f3fc": ["1f468-1f3fc-200d-1f9b3", 15, 50, 15, ["👨🏼‍🦳"]], "1f3fd": ["1f468-1f3fd-200d-1f9b3", 15, 51, 15, ["👨🏽‍🦳"]], "1f3fe": ["1f468-1f3fe-200d-1f9b3", 15, 52, 15, ["👨🏾‍🦳"]], "1f3ff": ["1f468-1f3ff-200d-1f9b3", 15, 53, 15, ["👨🏿‍🦳"]] },
      "1f468-200d-1f9bc": { "1f3fb": ["1f468-1f3fb-200d-1f9bc", 15, 55, 15, ["👨🏻‍🦼"]], "1f3fc": ["1f468-1f3fc-200d-1f9bc", 15, 56, 15, ["👨🏼‍🦼"]], "1f3fd": ["1f468-1f3fd-200d-1f9bc", 15, 57, 15, ["👨🏽‍🦼"]], "1f3fe": ["1f468-1f3fe-200d-1f9bc", 15, 58, 15, ["👨🏾‍🦼"]], "1f3ff": ["1f468-1f3ff-200d-1f9bc", 15, 59, 15, ["👨🏿‍🦼"]] },
      "1f468-200d-1f9bd": { "1f3fb": ["1f468-1f3fb-200d-1f9bd", 16, 0, 15, ["👨🏻‍🦽"]], "1f3fc": ["1f468-1f3fc-200d-1f9bd", 16, 1, 15, ["👨🏼‍🦽"]], "1f3fd": ["1f468-1f3fd-200d-1f9bd", 16, 2, 15, ["👨🏽‍🦽"]], "1f3fe": ["1f468-1f3fe-200d-1f9bd", 16, 3, 15, ["👨🏾‍🦽"]], "1f3ff": ["1f468-1f3ff-200d-1f9bd", 16, 4, 15, ["👨🏿‍🦽"]] },
      "1f468-200d-2695-fe0f": { "1f3fb": ["1f468-1f3fb-200d-2695-fe0f", 16, 6, 15, ["👨🏻‍⚕️"]], "1f3fc": ["1f468-1f3fc-200d-2695-fe0f", 16, 7, 15, ["👨🏼‍⚕️"]], "1f3fd": ["1f468-1f3fd-200d-2695-fe0f", 16, 8, 15, ["👨🏽‍⚕️"]], "1f3fe": ["1f468-1f3fe-200d-2695-fe0f", 16, 9, 15, ["👨🏾‍⚕️"]], "1f3ff": ["1f468-1f3ff-200d-2695-fe0f", 16, 10, 15, ["👨🏿‍⚕️"]] },
      "1f468-200d-2696-fe0f": { "1f3fb": ["1f468-1f3fb-200d-2696-fe0f", 16, 12, 15, ["👨🏻‍⚖️"]], "1f3fc": ["1f468-1f3fc-200d-2696-fe0f", 16, 13, 15, ["👨🏼‍⚖️"]], "1f3fd": ["1f468-1f3fd-200d-2696-fe0f", 16, 14, 15, ["👨🏽‍⚖️"]], "1f3fe": ["1f468-1f3fe-200d-2696-fe0f", 16, 15, 15, ["👨🏾‍⚖️"]], "1f3ff": ["1f468-1f3ff-200d-2696-fe0f", 16, 16, 15, ["👨🏿‍⚖️"]] },
      "1f468-200d-2708-fe0f": { "1f3fb": ["1f468-1f3fb-200d-2708-fe0f", 16, 18, 15, ["👨🏻‍✈️"]], "1f3fc": ["1f468-1f3fc-200d-2708-fe0f", 16, 19, 15, ["👨🏼‍✈️"]], "1f3fd": ["1f468-1f3fd-200d-2708-fe0f", 16, 20, 15, ["👨🏽‍✈️"]], "1f3fe": ["1f468-1f3fe-200d-2708-fe0f", 16, 21, 15, ["👨🏾‍✈️"]], "1f3ff": ["1f468-1f3ff-200d-2708-fe0f", 16, 22, 15, ["👨🏿‍✈️"]] },
      "1f468-200d-2764-fe0f-200d-1f468": { "1f3fb-1f3fb": ["1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fb", 16, 24, 15, ["👨🏻‍❤️‍👨🏻"]], "1f3fb-1f3fc": ["1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fc", 16, 25, 15, ["👨🏻‍❤️‍👨🏼"]], "1f3fb-1f3fd": ["1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fd", 16, 26, 15, ["👨🏻‍❤️‍👨🏽"]], "1f3fb-1f3fe": ["1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fe", 16, 27, 15, ["👨🏻‍❤️‍👨🏾"]], "1f3fb-1f3ff": ["1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3ff", 16, 28, 15, ["👨🏻‍❤️‍👨🏿"]], "1f3fc-1f3fb": ["1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fb", 16, 29, 15, ["👨🏼‍❤️‍👨🏻"]], "1f3fc-1f3fc": ["1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fc", 16, 30, 15, ["👨🏼‍❤️‍👨🏼"]], "1f3fc-1f3fd": ["1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fd", 16, 31, 15, ["👨🏼‍❤️‍👨🏽"]], "1f3fc-1f3fe": ["1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fe", 16, 32, 15, ["👨🏼‍❤️‍👨🏾"]], "1f3fc-1f3ff": ["1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3ff", 16, 33, 15, ["👨🏼‍❤️‍👨🏿"]], "1f3fd-1f3fb": ["1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fb", 16, 34, 15, ["👨🏽‍❤️‍👨🏻"]], "1f3fd-1f3fc": ["1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fc", 16, 35, 15, ["👨🏽‍❤️‍👨🏼"]], "1f3fd-1f3fd": ["1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fd", 16, 36, 15, ["👨🏽‍❤️‍👨🏽"]], "1f3fd-1f3fe": ["1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fe", 16, 37, 15, ["👨🏽‍❤️‍👨🏾"]], "1f3fd-1f3ff": ["1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3ff", 16, 38, 15, ["👨🏽‍❤️‍👨🏿"]], "1f3fe-1f3fb": ["1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fb", 16, 39, 15, ["👨🏾‍❤️‍👨🏻"]], "1f3fe-1f3fc": ["1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fc", 16, 40, 15, ["👨🏾‍❤️‍👨🏼"]], "1f3fe-1f3fd": ["1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fd", 16, 41, 15, ["👨🏾‍❤️‍👨🏽"]], "1f3fe-1f3fe": ["1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fe", 16, 42, 15, ["👨🏾‍❤️‍👨🏾"]], "1f3fe-1f3ff": ["1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3ff", 16, 43, 15, ["👨🏾‍❤️‍👨🏿"]], "1f3ff-1f3fb": ["1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fb", 16, 44, 15, ["👨🏿‍❤️‍👨🏻"]], "1f3ff-1f3fc": ["1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fc", 16, 45, 15, ["👨🏿‍❤️‍👨🏼"]], "1f3ff-1f3fd": ["1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fd", 16, 46, 15, ["👨🏿‍❤️‍👨🏽"]], "1f3ff-1f3fe": ["1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fe", 16, 47, 15, ["👨🏿‍❤️‍👨🏾"]], "1f3ff-1f3ff": ["1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3ff", 16, 48, 15, ["👨🏿‍❤️‍👨🏿"]] },
      "1f468-200d-2764-fe0f-200d-1f48b-200d-1f468": { "1f3fb-1f3fb": ["1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 16, 50, 15, ["👨🏻‍❤️‍💋‍👨🏻"]], "1f3fb-1f3fc": ["1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 16, 51, 15, ["👨🏻‍❤️‍💋‍👨🏼"]], "1f3fb-1f3fd": ["1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 16, 52, 15, ["👨🏻‍❤️‍💋‍👨🏽"]], "1f3fb-1f3fe": ["1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 16, 53, 15, ["👨🏻‍❤️‍💋‍👨🏾"]], "1f3fb-1f3ff": ["1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 16, 54, 15, ["👨🏻‍❤️‍💋‍👨🏿"]], "1f3fc-1f3fb": ["1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 16, 55, 15, ["👨🏼‍❤️‍💋‍👨🏻"]], "1f3fc-1f3fc": ["1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 16, 56, 15, ["👨🏼‍❤️‍💋‍👨🏼"]], "1f3fc-1f3fd": ["1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 16, 57, 15, ["👨🏼‍❤️‍💋‍👨🏽"]], "1f3fc-1f3fe": ["1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 16, 58, 15, ["👨🏼‍❤️‍💋‍👨🏾"]], "1f3fc-1f3ff": ["1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 16, 59, 15, ["👨🏼‍❤️‍💋‍👨🏿"]], "1f3fd-1f3fb": ["1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 16, 60, 15, ["👨🏽‍❤️‍💋‍👨🏻"]], "1f3fd-1f3fc": ["1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 17, 0, 15, ["👨🏽‍❤️‍💋‍👨🏼"]], "1f3fd-1f3fd": ["1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 17, 1, 15, ["👨🏽‍❤️‍💋‍👨🏽"]], "1f3fd-1f3fe": ["1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 17, 2, 15, ["👨🏽‍❤️‍💋‍👨🏾"]], "1f3fd-1f3ff": ["1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 17, 3, 15, ["👨🏽‍❤️‍💋‍👨🏿"]], "1f3fe-1f3fb": ["1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 17, 4, 15, ["👨🏾‍❤️‍💋‍👨🏻"]], "1f3fe-1f3fc": ["1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 17, 5, 15, ["👨🏾‍❤️‍💋‍👨🏼"]], "1f3fe-1f3fd": ["1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 17, 6, 15, ["👨🏾‍❤️‍💋‍👨🏽"]], "1f3fe-1f3fe": ["1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 17, 7, 15, ["👨🏾‍❤️‍💋‍👨🏾"]], "1f3fe-1f3ff": ["1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 17, 8, 15, ["👨🏾‍❤️‍💋‍👨🏿"]], "1f3ff-1f3fb": ["1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 17, 9, 15, ["👨🏿‍❤️‍💋‍👨🏻"]], "1f3ff-1f3fc": ["1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 17, 10, 15, ["👨🏿‍❤️‍💋‍👨🏼"]], "1f3ff-1f3fd": ["1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 17, 11, 15, ["👨🏿‍❤️‍💋‍👨🏽"]], "1f3ff-1f3fe": ["1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 17, 12, 15, ["👨🏿‍❤️‍💋‍👨🏾"]], "1f3ff-1f3ff": ["1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 17, 13, 15, ["👨🏿‍❤️‍💋‍👨🏿"]] },
      "1f468": { "1f3fb": ["1f468-1f3fb", 17, 15, 15, ["👨🏻"]], "1f3fc": ["1f468-1f3fc", 17, 16, 15, ["👨🏼"]], "1f3fd": ["1f468-1f3fd", 17, 17, 15, ["👨🏽"]], "1f3fe": ["1f468-1f3fe", 17, 18, 15, ["👨🏾"]], "1f3ff": ["1f468-1f3ff", 17, 19, 15, ["👨🏿"]] },
      "1f469-200d-1f33e": { "1f3fb": ["1f469-1f3fb-200d-1f33e", 17, 21, 15, ["👩🏻‍🌾"]], "1f3fc": ["1f469-1f3fc-200d-1f33e", 17, 22, 15, ["👩🏼‍🌾"]], "1f3fd": ["1f469-1f3fd-200d-1f33e", 17, 23, 15, ["👩🏽‍🌾"]], "1f3fe": ["1f469-1f3fe-200d-1f33e", 17, 24, 15, ["👩🏾‍🌾"]], "1f3ff": ["1f469-1f3ff-200d-1f33e", 17, 25, 15, ["👩🏿‍🌾"]] },
      "1f469-200d-1f373": { "1f3fb": ["1f469-1f3fb-200d-1f373", 17, 27, 15, ["👩🏻‍🍳"]], "1f3fc": ["1f469-1f3fc-200d-1f373", 17, 28, 15, ["👩🏼‍🍳"]], "1f3fd": ["1f469-1f3fd-200d-1f373", 17, 29, 15, ["👩🏽‍🍳"]], "1f3fe": ["1f469-1f3fe-200d-1f373", 17, 30, 15, ["👩🏾‍🍳"]], "1f3ff": ["1f469-1f3ff-200d-1f373", 17, 31, 15, ["👩🏿‍🍳"]] },
      "1f469-200d-1f37c": { "1f3fb": ["1f469-1f3fb-200d-1f37c", 17, 33, 15, ["👩🏻‍🍼"]], "1f3fc": ["1f469-1f3fc-200d-1f37c", 17, 34, 15, ["👩🏼‍🍼"]], "1f3fd": ["1f469-1f3fd-200d-1f37c", 17, 35, 15, ["👩🏽‍🍼"]], "1f3fe": ["1f469-1f3fe-200d-1f37c", 17, 36, 15, ["👩🏾‍🍼"]], "1f3ff": ["1f469-1f3ff-200d-1f37c", 17, 37, 15, ["👩🏿‍🍼"]] },
      "1f469-200d-1f393": { "1f3fb": ["1f469-1f3fb-200d-1f393", 17, 39, 15, ["👩🏻‍🎓"]], "1f3fc": ["1f469-1f3fc-200d-1f393", 17, 40, 15, ["👩🏼‍🎓"]], "1f3fd": ["1f469-1f3fd-200d-1f393", 17, 41, 15, ["👩🏽‍🎓"]], "1f3fe": ["1f469-1f3fe-200d-1f393", 17, 42, 15, ["👩🏾‍🎓"]], "1f3ff": ["1f469-1f3ff-200d-1f393", 17, 43, 15, ["👩🏿‍🎓"]] },
      "1f469-200d-1f3a4": { "1f3fb": ["1f469-1f3fb-200d-1f3a4", 17, 45, 15, ["👩🏻‍🎤"]], "1f3fc": ["1f469-1f3fc-200d-1f3a4", 17, 46, 15, ["👩🏼‍🎤"]], "1f3fd": ["1f469-1f3fd-200d-1f3a4", 17, 47, 15, ["👩🏽‍🎤"]], "1f3fe": ["1f469-1f3fe-200d-1f3a4", 17, 48, 15, ["👩🏾‍🎤"]], "1f3ff": ["1f469-1f3ff-200d-1f3a4", 17, 49, 15, ["👩🏿‍🎤"]] },
      "1f469-200d-1f3a8": { "1f3fb": ["1f469-1f3fb-200d-1f3a8", 17, 51, 15, ["👩🏻‍🎨"]], "1f3fc": ["1f469-1f3fc-200d-1f3a8", 17, 52, 15, ["👩🏼‍🎨"]], "1f3fd": ["1f469-1f3fd-200d-1f3a8", 17, 53, 15, ["👩🏽‍🎨"]], "1f3fe": ["1f469-1f3fe-200d-1f3a8", 17, 54, 15, ["👩🏾‍🎨"]], "1f3ff": ["1f469-1f3ff-200d-1f3a8", 17, 55, 15, ["👩🏿‍🎨"]] },
      "1f469-200d-1f3eb": { "1f3fb": ["1f469-1f3fb-200d-1f3eb", 17, 57, 15, ["👩🏻‍🏫"]], "1f3fc": ["1f469-1f3fc-200d-1f3eb", 17, 58, 15, ["👩🏼‍🏫"]], "1f3fd": ["1f469-1f3fd-200d-1f3eb", 17, 59, 15, ["👩🏽‍🏫"]], "1f3fe": ["1f469-1f3fe-200d-1f3eb", 17, 60, 15, ["👩🏾‍🏫"]], "1f3ff": ["1f469-1f3ff-200d-1f3eb", 18, 0, 15, ["👩🏿‍🏫"]] },
      "1f469-200d-1f3ed": { "1f3fb": ["1f469-1f3fb-200d-1f3ed", 18, 2, 15, ["👩🏻‍🏭"]], "1f3fc": ["1f469-1f3fc-200d-1f3ed", 18, 3, 15, ["👩🏼‍🏭"]], "1f3fd": ["1f469-1f3fd-200d-1f3ed", 18, 4, 15, ["👩🏽‍🏭"]], "1f3fe": ["1f469-1f3fe-200d-1f3ed", 18, 5, 15, ["👩🏾‍🏭"]], "1f3ff": ["1f469-1f3ff-200d-1f3ed", 18, 6, 15, ["👩🏿‍🏭"]] },
      "1f469-200d-1f4bb": { "1f3fb": ["1f469-1f3fb-200d-1f4bb", 18, 18, 15, ["👩🏻‍💻"]], "1f3fc": ["1f469-1f3fc-200d-1f4bb", 18, 19, 15, ["👩🏼‍💻"]], "1f3fd": ["1f469-1f3fd-200d-1f4bb", 18, 20, 15, ["👩🏽‍💻"]], "1f3fe": ["1f469-1f3fe-200d-1f4bb", 18, 21, 15, ["👩🏾‍💻"]], "1f3ff": ["1f469-1f3ff-200d-1f4bb", 18, 22, 15, ["👩🏿‍💻"]] },
      "1f469-200d-1f4bc": { "1f3fb": ["1f469-1f3fb-200d-1f4bc", 18, 24, 15, ["👩🏻‍💼"]], "1f3fc": ["1f469-1f3fc-200d-1f4bc", 18, 25, 15, ["👩🏼‍💼"]], "1f3fd": ["1f469-1f3fd-200d-1f4bc", 18, 26, 15, ["👩🏽‍💼"]], "1f3fe": ["1f469-1f3fe-200d-1f4bc", 18, 27, 15, ["👩🏾‍💼"]], "1f3ff": ["1f469-1f3ff-200d-1f4bc", 18, 28, 15, ["👩🏿‍💼"]] },
      "1f469-200d-1f527": { "1f3fb": ["1f469-1f3fb-200d-1f527", 18, 30, 15, ["👩🏻‍🔧"]], "1f3fc": ["1f469-1f3fc-200d-1f527", 18, 31, 15, ["👩🏼‍🔧"]], "1f3fd": ["1f469-1f3fd-200d-1f527", 18, 32, 15, ["👩🏽‍🔧"]], "1f3fe": ["1f469-1f3fe-200d-1f527", 18, 33, 15, ["👩🏾‍🔧"]], "1f3ff": ["1f469-1f3ff-200d-1f527", 18, 34, 15, ["👩🏿‍🔧"]] },
      "1f469-200d-1f52c": { "1f3fb": ["1f469-1f3fb-200d-1f52c", 18, 36, 15, ["👩🏻‍🔬"]], "1f3fc": ["1f469-1f3fc-200d-1f52c", 18, 37, 15, ["👩🏼‍🔬"]], "1f3fd": ["1f469-1f3fd-200d-1f52c", 18, 38, 15, ["👩🏽‍🔬"]], "1f3fe": ["1f469-1f3fe-200d-1f52c", 18, 39, 15, ["👩🏾‍🔬"]], "1f3ff": ["1f469-1f3ff-200d-1f52c", 18, 40, 15, ["👩🏿‍🔬"]] },
      "1f469-200d-1f680": { "1f3fb": ["1f469-1f3fb-200d-1f680", 18, 42, 15, ["👩🏻‍🚀"]], "1f3fc": ["1f469-1f3fc-200d-1f680", 18, 43, 15, ["👩🏼‍🚀"]], "1f3fd": ["1f469-1f3fd-200d-1f680", 18, 44, 15, ["👩🏽‍🚀"]], "1f3fe": ["1f469-1f3fe-200d-1f680", 18, 45, 15, ["👩🏾‍🚀"]], "1f3ff": ["1f469-1f3ff-200d-1f680", 18, 46, 15, ["👩🏿‍🚀"]] },
      "1f469-200d-1f692": { "1f3fb": ["1f469-1f3fb-200d-1f692", 18, 48, 15, ["👩🏻‍🚒"]], "1f3fc": ["1f469-1f3fc-200d-1f692", 18, 49, 15, ["👩🏼‍🚒"]], "1f3fd": ["1f469-1f3fd-200d-1f692", 18, 50, 15, ["👩🏽‍🚒"]], "1f3fe": ["1f469-1f3fe-200d-1f692", 18, 51, 15, ["👩🏾‍🚒"]], "1f3ff": ["1f469-1f3ff-200d-1f692", 18, 52, 15, ["👩🏿‍🚒"]] },
      "1f469-200d-1f9af": { "1f3fb": ["1f469-1f3fb-200d-1f9af", 18, 54, 15, ["👩🏻‍🦯"]], "1f3fc": ["1f469-1f3fc-200d-1f9af", 18, 55, 15, ["👩🏼‍🦯"]], "1f3fd": ["1f469-1f3fd-200d-1f9af", 18, 56, 15, ["👩🏽‍🦯"]], "1f3fe": ["1f469-1f3fe-200d-1f9af", 18, 57, 15, ["👩🏾‍🦯"]], "1f3ff": ["1f469-1f3ff-200d-1f9af", 18, 58, 15, ["👩🏿‍🦯"]] },
      "1f469-200d-1f9b0": { "1f3fb": ["1f469-1f3fb-200d-1f9b0", 18, 60, 15, ["👩🏻‍🦰"]], "1f3fc": ["1f469-1f3fc-200d-1f9b0", 19, 0, 15, ["👩🏼‍🦰"]], "1f3fd": ["1f469-1f3fd-200d-1f9b0", 19, 1, 15, ["👩🏽‍🦰"]], "1f3fe": ["1f469-1f3fe-200d-1f9b0", 19, 2, 15, ["👩🏾‍🦰"]], "1f3ff": ["1f469-1f3ff-200d-1f9b0", 19, 3, 15, ["👩🏿‍🦰"]] },
      "1f469-200d-1f9b1": { "1f3fb": ["1f469-1f3fb-200d-1f9b1", 19, 5, 15, ["👩🏻‍🦱"]], "1f3fc": ["1f469-1f3fc-200d-1f9b1", 19, 6, 15, ["👩🏼‍🦱"]], "1f3fd": ["1f469-1f3fd-200d-1f9b1", 19, 7, 15, ["👩🏽‍🦱"]], "1f3fe": ["1f469-1f3fe-200d-1f9b1", 19, 8, 15, ["👩🏾‍🦱"]], "1f3ff": ["1f469-1f3ff-200d-1f9b1", 19, 9, 15, ["👩🏿‍🦱"]] },
      "1f469-200d-1f9b2": { "1f3fb": ["1f469-1f3fb-200d-1f9b2", 19, 11, 15, ["👩🏻‍🦲"]], "1f3fc": ["1f469-1f3fc-200d-1f9b2", 19, 12, 15, ["👩🏼‍🦲"]], "1f3fd": ["1f469-1f3fd-200d-1f9b2", 19, 13, 15, ["👩🏽‍🦲"]], "1f3fe": ["1f469-1f3fe-200d-1f9b2", 19, 14, 15, ["👩🏾‍🦲"]], "1f3ff": ["1f469-1f3ff-200d-1f9b2", 19, 15, 15, ["👩🏿‍🦲"]] },
      "1f469-200d-1f9b3": { "1f3fb": ["1f469-1f3fb-200d-1f9b3", 19, 17, 15, ["👩🏻‍🦳"]], "1f3fc": ["1f469-1f3fc-200d-1f9b3", 19, 18, 15, ["👩🏼‍🦳"]], "1f3fd": ["1f469-1f3fd-200d-1f9b3", 19, 19, 15, ["👩🏽‍🦳"]], "1f3fe": ["1f469-1f3fe-200d-1f9b3", 19, 20, 15, ["👩🏾‍🦳"]], "1f3ff": ["1f469-1f3ff-200d-1f9b3", 19, 21, 15, ["👩🏿‍🦳"]] },
      "1f469-200d-1f9bc": { "1f3fb": ["1f469-1f3fb-200d-1f9bc", 19, 23, 15, ["👩🏻‍🦼"]], "1f3fc": ["1f469-1f3fc-200d-1f9bc", 19, 24, 15, ["👩🏼‍🦼"]], "1f3fd": ["1f469-1f3fd-200d-1f9bc", 19, 25, 15, ["👩🏽‍🦼"]], "1f3fe": ["1f469-1f3fe-200d-1f9bc", 19, 26, 15, ["👩🏾‍🦼"]], "1f3ff": ["1f469-1f3ff-200d-1f9bc", 19, 27, 15, ["👩🏿‍🦼"]] },
      "1f469-200d-1f9bd": { "1f3fb": ["1f469-1f3fb-200d-1f9bd", 19, 29, 15, ["👩🏻‍🦽"]], "1f3fc": ["1f469-1f3fc-200d-1f9bd", 19, 30, 15, ["👩🏼‍🦽"]], "1f3fd": ["1f469-1f3fd-200d-1f9bd", 19, 31, 15, ["👩🏽‍🦽"]], "1f3fe": ["1f469-1f3fe-200d-1f9bd", 19, 32, 15, ["👩🏾‍🦽"]], "1f3ff": ["1f469-1f3ff-200d-1f9bd", 19, 33, 15, ["👩🏿‍🦽"]] },
      "1f469-200d-2695-fe0f": { "1f3fb": ["1f469-1f3fb-200d-2695-fe0f", 19, 35, 15, ["👩🏻‍⚕️"]], "1f3fc": ["1f469-1f3fc-200d-2695-fe0f", 19, 36, 15, ["👩🏼‍⚕️"]], "1f3fd": ["1f469-1f3fd-200d-2695-fe0f", 19, 37, 15, ["👩🏽‍⚕️"]], "1f3fe": ["1f469-1f3fe-200d-2695-fe0f", 19, 38, 15, ["👩🏾‍⚕️"]], "1f3ff": ["1f469-1f3ff-200d-2695-fe0f", 19, 39, 15, ["👩🏿‍⚕️"]] },
      "1f469-200d-2696-fe0f": { "1f3fb": ["1f469-1f3fb-200d-2696-fe0f", 19, 41, 15, ["👩🏻‍⚖️"]], "1f3fc": ["1f469-1f3fc-200d-2696-fe0f", 19, 42, 15, ["👩🏼‍⚖️"]], "1f3fd": ["1f469-1f3fd-200d-2696-fe0f", 19, 43, 15, ["👩🏽‍⚖️"]], "1f3fe": ["1f469-1f3fe-200d-2696-fe0f", 19, 44, 15, ["👩🏾‍⚖️"]], "1f3ff": ["1f469-1f3ff-200d-2696-fe0f", 19, 45, 15, ["👩🏿‍⚖️"]] },
      "1f469-200d-2708-fe0f": { "1f3fb": ["1f469-1f3fb-200d-2708-fe0f", 19, 47, 15, ["👩🏻‍✈️"]], "1f3fc": ["1f469-1f3fc-200d-2708-fe0f", 19, 48, 15, ["👩🏼‍✈️"]], "1f3fd": ["1f469-1f3fd-200d-2708-fe0f", 19, 49, 15, ["👩🏽‍✈️"]], "1f3fe": ["1f469-1f3fe-200d-2708-fe0f", 19, 50, 15, ["👩🏾‍✈️"]], "1f3ff": ["1f469-1f3ff-200d-2708-fe0f", 19, 51, 15, ["👩🏿‍✈️"]] },
      "1f469-200d-2764-fe0f-200d-1f468": { "1f3fb-1f3fb": ["1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fb", 19, 53, 15, ["👩🏻‍❤️‍👨🏻"]], "1f3fb-1f3fc": ["1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fc", 19, 54, 15, ["👩🏻‍❤️‍👨🏼"]], "1f3fb-1f3fd": ["1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fd", 19, 55, 15, ["👩🏻‍❤️‍👨🏽"]], "1f3fb-1f3fe": ["1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fe", 19, 56, 15, ["👩🏻‍❤️‍👨🏾"]], "1f3fb-1f3ff": ["1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3ff", 19, 57, 15, ["👩🏻‍❤️‍👨🏿"]], "1f3fc-1f3fb": ["1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fb", 19, 58, 15, ["👩🏼‍❤️‍👨🏻"]], "1f3fc-1f3fc": ["1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fc", 19, 59, 15, ["👩🏼‍❤️‍👨🏼"]], "1f3fc-1f3fd": ["1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fd", 19, 60, 15, ["👩🏼‍❤️‍👨🏽"]], "1f3fc-1f3fe": ["1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fe", 20, 0, 15, ["👩🏼‍❤️‍👨🏾"]], "1f3fc-1f3ff": ["1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3ff", 20, 1, 15, ["👩🏼‍❤️‍👨🏿"]], "1f3fd-1f3fb": ["1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fb", 20, 2, 15, ["👩🏽‍❤️‍👨🏻"]], "1f3fd-1f3fc": ["1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fc", 20, 3, 15, ["👩🏽‍❤️‍👨🏼"]], "1f3fd-1f3fd": ["1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fd", 20, 4, 15, ["👩🏽‍❤️‍👨🏽"]], "1f3fd-1f3fe": ["1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fe", 20, 5, 15, ["👩🏽‍❤️‍👨🏾"]], "1f3fd-1f3ff": ["1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3ff", 20, 6, 15, ["👩🏽‍❤️‍👨🏿"]], "1f3fe-1f3fb": ["1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fb", 20, 7, 15, ["👩🏾‍❤️‍👨🏻"]], "1f3fe-1f3fc": ["1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fc", 20, 8, 15, ["👩🏾‍❤️‍👨🏼"]], "1f3fe-1f3fd": ["1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fd", 20, 9, 15, ["👩🏾‍❤️‍👨🏽"]], "1f3fe-1f3fe": ["1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fe", 20, 10, 15, ["👩🏾‍❤️‍👨🏾"]], "1f3fe-1f3ff": ["1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3ff", 20, 11, 15, ["👩🏾‍❤️‍👨🏿"]], "1f3ff-1f3fb": ["1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fb", 20, 12, 15, ["👩🏿‍❤️‍👨🏻"]], "1f3ff-1f3fc": ["1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fc", 20, 13, 15, ["👩🏿‍❤️‍👨🏼"]], "1f3ff-1f3fd": ["1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fd", 20, 14, 15, ["👩🏿‍❤️‍👨🏽"]], "1f3ff-1f3fe": ["1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fe", 20, 15, 15, ["👩🏿‍❤️‍👨🏾"]], "1f3ff-1f3ff": ["1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3ff", 20, 16, 15, ["👩🏿‍❤️‍👨🏿"]] },
      "1f469-200d-2764-fe0f-200d-1f469": { "1f3fb-1f3fb": ["1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fb", 20, 18, 15, ["👩🏻‍❤️‍👩🏻"]], "1f3fb-1f3fc": ["1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fc", 20, 19, 15, ["👩🏻‍❤️‍👩🏼"]], "1f3fb-1f3fd": ["1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fd", 20, 20, 15, ["👩🏻‍❤️‍👩🏽"]], "1f3fb-1f3fe": ["1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fe", 20, 21, 15, ["👩🏻‍❤️‍👩🏾"]], "1f3fb-1f3ff": ["1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3ff", 20, 22, 15, ["👩🏻‍❤️‍👩🏿"]], "1f3fc-1f3fb": ["1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fb", 20, 23, 15, ["👩🏼‍❤️‍👩🏻"]], "1f3fc-1f3fc": ["1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fc", 20, 24, 15, ["👩🏼‍❤️‍👩🏼"]], "1f3fc-1f3fd": ["1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fd", 20, 25, 15, ["👩🏼‍❤️‍👩🏽"]], "1f3fc-1f3fe": ["1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fe", 20, 26, 15, ["👩🏼‍❤️‍👩🏾"]], "1f3fc-1f3ff": ["1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3ff", 20, 27, 15, ["👩🏼‍❤️‍👩🏿"]], "1f3fd-1f3fb": ["1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fb", 20, 28, 15, ["👩🏽‍❤️‍👩🏻"]], "1f3fd-1f3fc": ["1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fc", 20, 29, 15, ["👩🏽‍❤️‍👩🏼"]], "1f3fd-1f3fd": ["1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fd", 20, 30, 15, ["👩🏽‍❤️‍👩🏽"]], "1f3fd-1f3fe": ["1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fe", 20, 31, 15, ["👩🏽‍❤️‍👩🏾"]], "1f3fd-1f3ff": ["1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3ff", 20, 32, 15, ["👩🏽‍❤️‍👩🏿"]], "1f3fe-1f3fb": ["1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fb", 20, 33, 15, ["👩🏾‍❤️‍👩🏻"]], "1f3fe-1f3fc": ["1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fc", 20, 34, 15, ["👩🏾‍❤️‍👩🏼"]], "1f3fe-1f3fd": ["1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fd", 20, 35, 15, ["👩🏾‍❤️‍👩🏽"]], "1f3fe-1f3fe": ["1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fe", 20, 36, 15, ["👩🏾‍❤️‍👩🏾"]], "1f3fe-1f3ff": ["1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3ff", 20, 37, 15, ["👩🏾‍❤️‍👩🏿"]], "1f3ff-1f3fb": ["1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fb", 20, 38, 15, ["👩🏿‍❤️‍👩🏻"]], "1f3ff-1f3fc": ["1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fc", 20, 39, 15, ["👩🏿‍❤️‍👩🏼"]], "1f3ff-1f3fd": ["1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fd", 20, 40, 15, ["👩🏿‍❤️‍👩🏽"]], "1f3ff-1f3fe": ["1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fe", 20, 41, 15, ["👩🏿‍❤️‍👩🏾"]], "1f3ff-1f3ff": ["1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3ff", 20, 42, 15, ["👩🏿‍❤️‍👩🏿"]] },
      "1f469-200d-2764-fe0f-200d-1f48b-200d-1f468": { "1f3fb-1f3fb": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 20, 44, 15, ["👩🏻‍❤️‍💋‍👨🏻"]], "1f3fb-1f3fc": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 20, 45, 15, ["👩🏻‍❤️‍💋‍👨🏼"]], "1f3fb-1f3fd": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 20, 46, 15, ["👩🏻‍❤️‍💋‍👨🏽"]], "1f3fb-1f3fe": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 20, 47, 15, ["👩🏻‍❤️‍💋‍👨🏾"]], "1f3fb-1f3ff": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 20, 48, 15, ["👩🏻‍❤️‍💋‍👨🏿"]], "1f3fc-1f3fb": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 20, 49, 15, ["👩🏼‍❤️‍💋‍👨🏻"]], "1f3fc-1f3fc": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 20, 50, 15, ["👩🏼‍❤️‍💋‍👨🏼"]], "1f3fc-1f3fd": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 20, 51, 15, ["👩🏼‍❤️‍💋‍👨🏽"]], "1f3fc-1f3fe": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 20, 52, 15, ["👩🏼‍❤️‍💋‍👨🏾"]], "1f3fc-1f3ff": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 20, 53, 15, ["👩🏼‍❤️‍💋‍👨🏿"]], "1f3fd-1f3fb": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 20, 54, 15, ["👩🏽‍❤️‍💋‍👨🏻"]], "1f3fd-1f3fc": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 20, 55, 15, ["👩🏽‍❤️‍💋‍👨🏼"]], "1f3fd-1f3fd": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 20, 56, 15, ["👩🏽‍❤️‍💋‍👨🏽"]], "1f3fd-1f3fe": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 20, 57, 15, ["👩🏽‍❤️‍💋‍👨🏾"]], "1f3fd-1f3ff": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 20, 58, 15, ["👩🏽‍❤️‍💋‍👨🏿"]], "1f3fe-1f3fb": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 20, 59, 15, ["👩🏾‍❤️‍💋‍👨🏻"]], "1f3fe-1f3fc": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 20, 60, 15, ["👩🏾‍❤️‍💋‍👨🏼"]], "1f3fe-1f3fd": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 21, 0, 15, ["👩🏾‍❤️‍💋‍👨🏽"]], "1f3fe-1f3fe": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 21, 1, 15, ["👩🏾‍❤️‍💋‍👨🏾"]], "1f3fe-1f3ff": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 21, 2, 15, ["👩🏾‍❤️‍💋‍👨🏿"]], "1f3ff-1f3fb": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb", 21, 3, 15, ["👩🏿‍❤️‍💋‍👨🏻"]], "1f3ff-1f3fc": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc", 21, 4, 15, ["👩🏿‍❤️‍💋‍👨🏼"]], "1f3ff-1f3fd": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd", 21, 5, 15, ["👩🏿‍❤️‍💋‍👨🏽"]], "1f3ff-1f3fe": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe", 21, 6, 15, ["👩🏿‍❤️‍💋‍👨🏾"]], "1f3ff-1f3ff": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff", 21, 7, 15, ["👩🏿‍❤️‍💋‍👨🏿"]] },
      "1f469-200d-2764-fe0f-200d-1f48b-200d-1f469": { "1f3fb-1f3fb": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb", 21, 9, 15, ["👩🏻‍❤️‍💋‍👩🏻"]], "1f3fb-1f3fc": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc", 21, 10, 15, ["👩🏻‍❤️‍💋‍👩🏼"]], "1f3fb-1f3fd": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd", 21, 11, 15, ["👩🏻‍❤️‍💋‍👩🏽"]], "1f3fb-1f3fe": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe", 21, 12, 15, ["👩🏻‍❤️‍💋‍👩🏾"]], "1f3fb-1f3ff": ["1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff", 21, 13, 15, ["👩🏻‍❤️‍💋‍👩🏿"]], "1f3fc-1f3fb": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb", 21, 14, 15, ["👩🏼‍❤️‍💋‍👩🏻"]], "1f3fc-1f3fc": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc", 21, 15, 15, ["👩🏼‍❤️‍💋‍👩🏼"]], "1f3fc-1f3fd": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd", 21, 16, 15, ["👩🏼‍❤️‍💋‍👩🏽"]], "1f3fc-1f3fe": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe", 21, 17, 15, ["👩🏼‍❤️‍💋‍👩🏾"]], "1f3fc-1f3ff": ["1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff", 21, 18, 15, ["👩🏼‍❤️‍💋‍👩🏿"]], "1f3fd-1f3fb": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb", 21, 19, 15, ["👩🏽‍❤️‍💋‍👩🏻"]], "1f3fd-1f3fc": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc", 21, 20, 15, ["👩🏽‍❤️‍💋‍👩🏼"]], "1f3fd-1f3fd": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd", 21, 21, 15, ["👩🏽‍❤️‍💋‍👩🏽"]], "1f3fd-1f3fe": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe", 21, 22, 15, ["👩🏽‍❤️‍💋‍👩🏾"]], "1f3fd-1f3ff": ["1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff", 21, 23, 15, ["👩🏽‍❤️‍💋‍👩🏿"]], "1f3fe-1f3fb": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb", 21, 24, 15, ["👩🏾‍❤️‍💋‍👩🏻"]], "1f3fe-1f3fc": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc", 21, 25, 15, ["👩🏾‍❤️‍💋‍👩🏼"]], "1f3fe-1f3fd": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd", 21, 26, 15, ["👩🏾‍❤️‍💋‍👩🏽"]], "1f3fe-1f3fe": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe", 21, 27, 15, ["👩🏾‍❤️‍💋‍👩🏾"]], "1f3fe-1f3ff": ["1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff", 21, 28, 15, ["👩🏾‍❤️‍💋‍👩🏿"]], "1f3ff-1f3fb": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb", 21, 29, 15, ["👩🏿‍❤️‍💋‍👩🏻"]], "1f3ff-1f3fc": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc", 21, 30, 15, ["👩🏿‍❤️‍💋‍👩🏼"]], "1f3ff-1f3fd": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd", 21, 31, 15, ["👩🏿‍❤️‍💋‍👩🏽"]], "1f3ff-1f3fe": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe", 21, 32, 15, ["👩🏿‍❤️‍💋‍👩🏾"]], "1f3ff-1f3ff": ["1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff", 21, 33, 15, ["👩🏿‍❤️‍💋‍👩🏿"]] },
      "1f469": { "1f3fb": ["1f469-1f3fb", 21, 35, 15, ["👩🏻"]], "1f3fc": ["1f469-1f3fc", 21, 36, 15, ["👩🏼"]], "1f3fd": ["1f469-1f3fd", 21, 37, 15, ["👩🏽"]], "1f3fe": ["1f469-1f3fe", 21, 38, 15, ["👩🏾"]], "1f3ff": ["1f469-1f3ff", 21, 39, 15, ["👩🏿"]] },
      "1f46b": { "1f3fb": ["1f46b-1f3fb", 21, 42, 15, ["👫🏻"]], "1f3fc": ["1f46b-1f3fc", 21, 43, 15, ["👫🏼"]], "1f3fd": ["1f46b-1f3fd", 21, 44, 15, ["👫🏽"]], "1f3fe": ["1f46b-1f3fe", 21, 45, 15, ["👫🏾"]], "1f3ff": ["1f46b-1f3ff", 21, 46, 15, ["👫🏿"]], "1f3fb-1f3fc": ["1f469-1f3fb-200d-1f91d-200d-1f468-1f3fc", 21, 47, 15, ["👩🏻‍🤝‍👨🏼"]], "1f3fb-1f3fd": ["1f469-1f3fb-200d-1f91d-200d-1f468-1f3fd", 21, 48, 15, ["👩🏻‍🤝‍👨🏽"]], "1f3fb-1f3fe": ["1f469-1f3fb-200d-1f91d-200d-1f468-1f3fe", 21, 49, 15, ["👩🏻‍🤝‍👨🏾"]], "1f3fb-1f3ff": ["1f469-1f3fb-200d-1f91d-200d-1f468-1f3ff", 21, 50, 15, ["👩🏻‍🤝‍👨🏿"]], "1f3fc-1f3fb": ["1f469-1f3fc-200d-1f91d-200d-1f468-1f3fb", 21, 51, 15, ["👩🏼‍🤝‍👨🏻"]], "1f3fc-1f3fd": ["1f469-1f3fc-200d-1f91d-200d-1f468-1f3fd", 21, 52, 15, ["👩🏼‍🤝‍👨🏽"]], "1f3fc-1f3fe": ["1f469-1f3fc-200d-1f91d-200d-1f468-1f3fe", 21, 53, 15, ["👩🏼‍🤝‍👨🏾"]], "1f3fc-1f3ff": ["1f469-1f3fc-200d-1f91d-200d-1f468-1f3ff", 21, 54, 15, ["👩🏼‍🤝‍👨🏿"]], "1f3fd-1f3fb": ["1f469-1f3fd-200d-1f91d-200d-1f468-1f3fb", 21, 55, 15, ["👩🏽‍🤝‍👨🏻"]], "1f3fd-1f3fc": ["1f469-1f3fd-200d-1f91d-200d-1f468-1f3fc", 21, 56, 15, ["👩🏽‍🤝‍👨🏼"]], "1f3fd-1f3fe": ["1f469-1f3fd-200d-1f91d-200d-1f468-1f3fe", 21, 57, 15, ["👩🏽‍🤝‍👨🏾"]], "1f3fd-1f3ff": ["1f469-1f3fd-200d-1f91d-200d-1f468-1f3ff", 21, 58, 15, ["👩🏽‍🤝‍👨🏿"]], "1f3fe-1f3fb": ["1f469-1f3fe-200d-1f91d-200d-1f468-1f3fb", 21, 59, 15, ["👩🏾‍🤝‍👨🏻"]], "1f3fe-1f3fc": ["1f469-1f3fe-200d-1f91d-200d-1f468-1f3fc", 21, 60, 15, ["👩🏾‍🤝‍👨🏼"]], "1f3fe-1f3fd": ["1f469-1f3fe-200d-1f91d-200d-1f468-1f3fd", 22, 0, 15, ["👩🏾‍🤝‍👨🏽"]], "1f3fe-1f3ff": ["1f469-1f3fe-200d-1f91d-200d-1f468-1f3ff", 22, 1, 15, ["👩🏾‍🤝‍👨🏿"]], "1f3ff-1f3fb": ["1f469-1f3ff-200d-1f91d-200d-1f468-1f3fb", 22, 2, 15, ["👩🏿‍🤝‍👨🏻"]], "1f3ff-1f3fc": ["1f469-1f3ff-200d-1f91d-200d-1f468-1f3fc", 22, 3, 15, ["👩🏿‍🤝‍👨🏼"]], "1f3ff-1f3fd": ["1f469-1f3ff-200d-1f91d-200d-1f468-1f3fd", 22, 4, 15, ["👩🏿‍🤝‍👨🏽"]], "1f3ff-1f3fe": ["1f469-1f3ff-200d-1f91d-200d-1f468-1f3fe", 22, 5, 15, ["👩🏿‍🤝‍👨🏾"]] },
      "1f46c": { "1f3fb": ["1f46c-1f3fb", 22, 7, 15, ["👬🏻"]], "1f3fc": ["1f46c-1f3fc", 22, 8, 15, ["👬🏼"]], "1f3fd": ["1f46c-1f3fd", 22, 9, 15, ["👬🏽"]], "1f3fe": ["1f46c-1f3fe", 22, 10, 15, ["👬🏾"]], "1f3ff": ["1f46c-1f3ff", 22, 11, 15, ["👬🏿"]], "1f3fb-1f3fc": ["1f468-1f3fb-200d-1f91d-200d-1f468-1f3fc", 22, 12, 15, ["👨🏻‍🤝‍👨🏼"]], "1f3fb-1f3fd": ["1f468-1f3fb-200d-1f91d-200d-1f468-1f3fd", 22, 13, 15, ["👨🏻‍🤝‍👨🏽"]], "1f3fb-1f3fe": ["1f468-1f3fb-200d-1f91d-200d-1f468-1f3fe", 22, 14, 15, ["👨🏻‍🤝‍👨🏾"]], "1f3fb-1f3ff": ["1f468-1f3fb-200d-1f91d-200d-1f468-1f3ff", 22, 15, 15, ["👨🏻‍🤝‍👨🏿"]], "1f3fc-1f3fb": ["1f468-1f3fc-200d-1f91d-200d-1f468-1f3fb", 22, 16, 15, ["👨🏼‍🤝‍👨🏻"]], "1f3fc-1f3fd": ["1f468-1f3fc-200d-1f91d-200d-1f468-1f3fd", 22, 17, 15, ["👨🏼‍🤝‍👨🏽"]], "1f3fc-1f3fe": ["1f468-1f3fc-200d-1f91d-200d-1f468-1f3fe", 22, 18, 15, ["👨🏼‍🤝‍👨🏾"]], "1f3fc-1f3ff": ["1f468-1f3fc-200d-1f91d-200d-1f468-1f3ff", 22, 19, 15, ["👨🏼‍🤝‍👨🏿"]], "1f3fd-1f3fb": ["1f468-1f3fd-200d-1f91d-200d-1f468-1f3fb", 22, 20, 15, ["👨🏽‍🤝‍👨🏻"]], "1f3fd-1f3fc": ["1f468-1f3fd-200d-1f91d-200d-1f468-1f3fc", 22, 21, 15, ["👨🏽‍🤝‍👨🏼"]], "1f3fd-1f3fe": ["1f468-1f3fd-200d-1f91d-200d-1f468-1f3fe", 22, 22, 15, ["👨🏽‍🤝‍👨🏾"]], "1f3fd-1f3ff": ["1f468-1f3fd-200d-1f91d-200d-1f468-1f3ff", 22, 23, 15, ["👨🏽‍🤝‍👨🏿"]], "1f3fe-1f3fb": ["1f468-1f3fe-200d-1f91d-200d-1f468-1f3fb", 22, 24, 15, ["👨🏾‍🤝‍👨🏻"]], "1f3fe-1f3fc": ["1f468-1f3fe-200d-1f91d-200d-1f468-1f3fc", 22, 25, 15, ["👨🏾‍🤝‍👨🏼"]], "1f3fe-1f3fd": ["1f468-1f3fe-200d-1f91d-200d-1f468-1f3fd", 22, 26, 15, ["👨🏾‍🤝‍👨🏽"]], "1f3fe-1f3ff": ["1f468-1f3fe-200d-1f91d-200d-1f468-1f3ff", 22, 27, 15, ["👨🏾‍🤝‍👨🏿"]], "1f3ff-1f3fb": ["1f468-1f3ff-200d-1f91d-200d-1f468-1f3fb", 22, 28, 15, ["👨🏿‍🤝‍👨🏻"]], "1f3ff-1f3fc": ["1f468-1f3ff-200d-1f91d-200d-1f468-1f3fc", 22, 29, 15, ["👨🏿‍🤝‍👨🏼"]], "1f3ff-1f3fd": ["1f468-1f3ff-200d-1f91d-200d-1f468-1f3fd", 22, 30, 15, ["👨🏿‍🤝‍👨🏽"]], "1f3ff-1f3fe": ["1f468-1f3ff-200d-1f91d-200d-1f468-1f3fe", 22, 31, 15, ["👨🏿‍🤝‍👨🏾"]] },
      "1f46d": { "1f3fb": ["1f46d-1f3fb", 22, 33, 15, ["👭🏻"]], "1f3fc": ["1f46d-1f3fc", 22, 34, 15, ["👭🏼"]], "1f3fd": ["1f46d-1f3fd", 22, 35, 15, ["👭🏽"]], "1f3fe": ["1f46d-1f3fe", 22, 36, 15, ["👭🏾"]], "1f3ff": ["1f46d-1f3ff", 22, 37, 15, ["👭🏿"]], "1f3fb-1f3fc": ["1f469-1f3fb-200d-1f91d-200d-1f469-1f3fc", 22, 38, 15, ["👩🏻‍🤝‍👩🏼"]], "1f3fb-1f3fd": ["1f469-1f3fb-200d-1f91d-200d-1f469-1f3fd", 22, 39, 15, ["👩🏻‍🤝‍👩🏽"]], "1f3fb-1f3fe": ["1f469-1f3fb-200d-1f91d-200d-1f469-1f3fe", 22, 40, 15, ["👩🏻‍🤝‍👩🏾"]], "1f3fb-1f3ff": ["1f469-1f3fb-200d-1f91d-200d-1f469-1f3ff", 22, 41, 15, ["👩🏻‍🤝‍👩🏿"]], "1f3fc-1f3fb": ["1f469-1f3fc-200d-1f91d-200d-1f469-1f3fb", 22, 42, 15, ["👩🏼‍🤝‍👩🏻"]], "1f3fc-1f3fd": ["1f469-1f3fc-200d-1f91d-200d-1f469-1f3fd", 22, 43, 15, ["👩🏼‍🤝‍👩🏽"]], "1f3fc-1f3fe": ["1f469-1f3fc-200d-1f91d-200d-1f469-1f3fe", 22, 44, 15, ["👩🏼‍🤝‍👩🏾"]], "1f3fc-1f3ff": ["1f469-1f3fc-200d-1f91d-200d-1f469-1f3ff", 22, 45, 15, ["👩🏼‍🤝‍👩🏿"]], "1f3fd-1f3fb": ["1f469-1f3fd-200d-1f91d-200d-1f469-1f3fb", 22, 46, 15, ["👩🏽‍🤝‍👩🏻"]], "1f3fd-1f3fc": ["1f469-1f3fd-200d-1f91d-200d-1f469-1f3fc", 22, 47, 15, ["👩🏽‍🤝‍👩🏼"]], "1f3fd-1f3fe": ["1f469-1f3fd-200d-1f91d-200d-1f469-1f3fe", 22, 48, 15, ["👩🏽‍🤝‍👩🏾"]], "1f3fd-1f3ff": ["1f469-1f3fd-200d-1f91d-200d-1f469-1f3ff", 22, 49, 15, ["👩🏽‍🤝‍👩🏿"]], "1f3fe-1f3fb": ["1f469-1f3fe-200d-1f91d-200d-1f469-1f3fb", 22, 50, 15, ["👩🏾‍🤝‍👩🏻"]], "1f3fe-1f3fc": ["1f469-1f3fe-200d-1f91d-200d-1f469-1f3fc", 22, 51, 15, ["👩🏾‍🤝‍👩🏼"]], "1f3fe-1f3fd": ["1f469-1f3fe-200d-1f91d-200d-1f469-1f3fd", 22, 52, 15, ["👩🏾‍🤝‍👩🏽"]], "1f3fe-1f3ff": ["1f469-1f3fe-200d-1f91d-200d-1f469-1f3ff", 22, 53, 15, ["👩🏾‍🤝‍👩🏿"]], "1f3ff-1f3fb": ["1f469-1f3ff-200d-1f91d-200d-1f469-1f3fb", 22, 54, 15, ["👩🏿‍🤝‍👩🏻"]], "1f3ff-1f3fc": ["1f469-1f3ff-200d-1f91d-200d-1f469-1f3fc", 22, 55, 15, ["👩🏿‍🤝‍👩🏼"]], "1f3ff-1f3fd": ["1f469-1f3ff-200d-1f91d-200d-1f469-1f3fd", 22, 56, 15, ["👩🏿‍🤝‍👩🏽"]], "1f3ff-1f3fe": ["1f469-1f3ff-200d-1f91d-200d-1f469-1f3fe", 22, 57, 15, ["👩🏿‍🤝‍👩🏾"]] },
      "1f46e-200d-2640-fe0f": { "1f3fb": ["1f46e-1f3fb-200d-2640-fe0f", 22, 59, 15, ["👮🏻‍♀️"]], "1f3fc": ["1f46e-1f3fc-200d-2640-fe0f", 22, 60, 15, ["👮🏼‍♀️"]], "1f3fd": ["1f46e-1f3fd-200d-2640-fe0f", 23, 0, 15, ["👮🏽‍♀️"]], "1f3fe": ["1f46e-1f3fe-200d-2640-fe0f", 23, 1, 15, ["👮🏾‍♀️"]], "1f3ff": ["1f46e-1f3ff-200d-2640-fe0f", 23, 2, 15, ["👮🏿‍♀️"]] },
      "1f46e-200d-2642-fe0f": { "1f3fb": ["1f46e-1f3fb-200d-2642-fe0f", 23, 4, 15, ["👮🏻‍♂️", "👮🏻"]], "1f3fc": ["1f46e-1f3fc-200d-2642-fe0f", 23, 5, 15, ["👮🏼‍♂️", "👮🏼"]], "1f3fd": ["1f46e-1f3fd-200d-2642-fe0f", 23, 6, 15, ["👮🏽‍♂️", "👮🏽"]], "1f3fe": ["1f46e-1f3fe-200d-2642-fe0f", 23, 7, 15, ["👮🏾‍♂️", "👮🏾"]], "1f3ff": ["1f46e-1f3ff-200d-2642-fe0f", 23, 8, 15, ["👮🏿‍♂️", "👮🏿"]] },
      "1f470-200d-2640-fe0f": { "1f3fb": ["1f470-1f3fb-200d-2640-fe0f", 23, 19, 15, ["👰🏻‍♀️"]], "1f3fc": ["1f470-1f3fc-200d-2640-fe0f", 23, 20, 15, ["👰🏼‍♀️"]], "1f3fd": ["1f470-1f3fd-200d-2640-fe0f", 23, 21, 15, ["👰🏽‍♀️"]], "1f3fe": ["1f470-1f3fe-200d-2640-fe0f", 23, 22, 15, ["👰🏾‍♀️"]], "1f3ff": ["1f470-1f3ff-200d-2640-fe0f", 23, 23, 15, ["👰🏿‍♀️"]] },
      "1f470-200d-2642-fe0f": { "1f3fb": ["1f470-1f3fb-200d-2642-fe0f", 23, 25, 15, ["👰🏻‍♂️"]], "1f3fc": ["1f470-1f3fc-200d-2642-fe0f", 23, 26, 15, ["👰🏼‍♂️"]], "1f3fd": ["1f470-1f3fd-200d-2642-fe0f", 23, 27, 15, ["👰🏽‍♂️"]], "1f3fe": ["1f470-1f3fe-200d-2642-fe0f", 23, 28, 15, ["👰🏾‍♂️"]], "1f3ff": ["1f470-1f3ff-200d-2642-fe0f", 23, 29, 15, ["👰🏿‍♂️"]] },
      "1f470": { "1f3fb": ["1f470-1f3fb", 23, 31, 15, ["👰🏻"]], "1f3fc": ["1f470-1f3fc", 23, 32, 15, ["👰🏼"]], "1f3fd": ["1f470-1f3fd", 23, 33, 15, ["👰🏽"]], "1f3fe": ["1f470-1f3fe", 23, 34, 15, ["👰🏾"]], "1f3ff": ["1f470-1f3ff", 23, 35, 15, ["👰🏿"]] },
      "1f471-200d-2640-fe0f": { "1f3fb": ["1f471-1f3fb-200d-2640-fe0f", 23, 37, 15, ["👱🏻‍♀️"]], "1f3fc": ["1f471-1f3fc-200d-2640-fe0f", 23, 38, 15, ["👱🏼‍♀️"]], "1f3fd": ["1f471-1f3fd-200d-2640-fe0f", 23, 39, 15, ["👱🏽‍♀️"]], "1f3fe": ["1f471-1f3fe-200d-2640-fe0f", 23, 40, 15, ["👱🏾‍♀️"]], "1f3ff": ["1f471-1f3ff-200d-2640-fe0f", 23, 41, 15, ["👱🏿‍♀️"]] },
      "1f471-200d-2642-fe0f": { "1f3fb": ["1f471-1f3fb-200d-2642-fe0f", 23, 43, 15, ["👱🏻‍♂️", "👱🏻"]], "1f3fc": ["1f471-1f3fc-200d-2642-fe0f", 23, 44, 15, ["👱🏼‍♂️", "👱🏼"]], "1f3fd": ["1f471-1f3fd-200d-2642-fe0f", 23, 45, 15, ["👱🏽‍♂️", "👱🏽"]], "1f3fe": ["1f471-1f3fe-200d-2642-fe0f", 23, 46, 15, ["👱🏾‍♂️", "👱🏾"]], "1f3ff": ["1f471-1f3ff-200d-2642-fe0f", 23, 47, 15, ["👱🏿‍♂️", "👱🏿"]] },
      "1f472": { "1f3fb": ["1f472-1f3fb", 23, 55, 15, ["👲🏻"]], "1f3fc": ["1f472-1f3fc", 23, 56, 15, ["👲🏼"]], "1f3fd": ["1f472-1f3fd", 23, 57, 15, ["👲🏽"]], "1f3fe": ["1f472-1f3fe", 23, 58, 15, ["👲🏾"]], "1f3ff": ["1f472-1f3ff", 23, 59, 15, ["👲🏿"]] },
      "1f473-200d-2640-fe0f": { "1f3fb": ["1f473-1f3fb-200d-2640-fe0f", 24, 0, 15, ["👳🏻‍♀️"]], "1f3fc": ["1f473-1f3fc-200d-2640-fe0f", 24, 1, 15, ["👳🏼‍♀️"]], "1f3fd": ["1f473-1f3fd-200d-2640-fe0f", 24, 2, 15, ["👳🏽‍♀️"]], "1f3fe": ["1f473-1f3fe-200d-2640-fe0f", 24, 3, 15, ["👳🏾‍♀️"]], "1f3ff": ["1f473-1f3ff-200d-2640-fe0f", 24, 4, 15, ["👳🏿‍♀️"]] },
      "1f473-200d-2642-fe0f": { "1f3fb": ["1f473-1f3fb-200d-2642-fe0f", 24, 6, 15, ["👳🏻‍♂️", "👳🏻"]], "1f3fc": ["1f473-1f3fc-200d-2642-fe0f", 24, 7, 15, ["👳🏼‍♂️", "👳🏼"]], "1f3fd": ["1f473-1f3fd-200d-2642-fe0f", 24, 8, 15, ["👳🏽‍♂️", "👳🏽"]], "1f3fe": ["1f473-1f3fe-200d-2642-fe0f", 24, 9, 15, ["👳🏾‍♂️", "👳🏾"]], "1f3ff": ["1f473-1f3ff-200d-2642-fe0f", 24, 10, 15, ["👳🏿‍♂️", "👳🏿"]] },
      "1f474": { "1f3fb": ["1f474-1f3fb", 24, 18, 15, ["👴🏻"]], "1f3fc": ["1f474-1f3fc", 24, 19, 15, ["👴🏼"]], "1f3fd": ["1f474-1f3fd", 24, 20, 15, ["👴🏽"]], "1f3fe": ["1f474-1f3fe", 24, 21, 15, ["👴🏾"]], "1f3ff": ["1f474-1f3ff", 24, 22, 15, ["👴🏿"]] },
      "1f475": { "1f3fb": ["1f475-1f3fb", 24, 24, 15, ["👵🏻"]], "1f3fc": ["1f475-1f3fc", 24, 25, 15, ["👵🏼"]], "1f3fd": ["1f475-1f3fd", 24, 26, 15, ["👵🏽"]], "1f3fe": ["1f475-1f3fe", 24, 27, 15, ["👵🏾"]], "1f3ff": ["1f475-1f3ff", 24, 28, 15, ["👵🏿"]] },
      "1f476": { "1f3fb": ["1f476-1f3fb", 24, 30, 15, ["👶🏻"]], "1f3fc": ["1f476-1f3fc", 24, 31, 15, ["👶🏼"]], "1f3fd": ["1f476-1f3fd", 24, 32, 15, ["👶🏽"]], "1f3fe": ["1f476-1f3fe", 24, 33, 15, ["👶🏾"]], "1f3ff": ["1f476-1f3ff", 24, 34, 15, ["👶🏿"]] },
      "1f477-200d-2640-fe0f": { "1f3fb": ["1f477-1f3fb-200d-2640-fe0f", 24, 36, 15, ["👷🏻‍♀️"]], "1f3fc": ["1f477-1f3fc-200d-2640-fe0f", 24, 37, 15, ["👷🏼‍♀️"]], "1f3fd": ["1f477-1f3fd-200d-2640-fe0f", 24, 38, 15, ["👷🏽‍♀️"]], "1f3fe": ["1f477-1f3fe-200d-2640-fe0f", 24, 39, 15, ["👷🏾‍♀️"]], "1f3ff": ["1f477-1f3ff-200d-2640-fe0f", 24, 40, 15, ["👷🏿‍♀️"]] },
      "1f477-200d-2642-fe0f": { "1f3fb": ["1f477-1f3fb-200d-2642-fe0f", 24, 42, 15, ["👷🏻‍♂️", "👷🏻"]], "1f3fc": ["1f477-1f3fc-200d-2642-fe0f", 24, 43, 15, ["👷🏼‍♂️", "👷🏼"]], "1f3fd": ["1f477-1f3fd-200d-2642-fe0f", 24, 44, 15, ["👷🏽‍♂️", "👷🏽"]], "1f3fe": ["1f477-1f3fe-200d-2642-fe0f", 24, 45, 15, ["👷🏾‍♂️", "👷🏾"]], "1f3ff": ["1f477-1f3ff-200d-2642-fe0f", 24, 46, 15, ["👷🏿‍♂️", "👷🏿"]] },
      "1f478": { "1f3fb": ["1f478-1f3fb", 24, 54, 15, ["👸🏻"]], "1f3fc": ["1f478-1f3fc", 24, 55, 15, ["👸🏼"]], "1f3fd": ["1f478-1f3fd", 24, 56, 15, ["👸🏽"]], "1f3fe": ["1f478-1f3fe", 24, 57, 15, ["👸🏾"]], "1f3ff": ["1f478-1f3ff", 24, 58, 15, ["👸🏿"]] },
      "1f47c": { "1f3fb": ["1f47c-1f3fb", 25, 2, 15, ["👼🏻"]], "1f3fc": ["1f47c-1f3fc", 25, 3, 15, ["👼🏼"]], "1f3fd": ["1f47c-1f3fd", 25, 4, 15, ["👼🏽"]], "1f3fe": ["1f47c-1f3fe", 25, 5, 15, ["👼🏾"]], "1f3ff": ["1f47c-1f3ff", 25, 6, 15, ["👼🏿"]] },
      "1f481-200d-2640-fe0f": { "1f3fb": ["1f481-1f3fb-200d-2640-fe0f", 25, 12, 15, ["💁🏻‍♀️", "💁🏻"]], "1f3fc": ["1f481-1f3fc-200d-2640-fe0f", 25, 13, 15, ["💁🏼‍♀️", "💁🏼"]], "1f3fd": ["1f481-1f3fd-200d-2640-fe0f", 25, 14, 15, ["💁🏽‍♀️", "💁🏽"]], "1f3fe": ["1f481-1f3fe-200d-2640-fe0f", 25, 15, 15, ["💁🏾‍♀️", "💁🏾"]], "1f3ff": ["1f481-1f3ff-200d-2640-fe0f", 25, 16, 15, ["💁🏿‍♀️", "💁🏿"]] },
      "1f481-200d-2642-fe0f": { "1f3fb": ["1f481-1f3fb-200d-2642-fe0f", 25, 18, 15, ["💁🏻‍♂️"]], "1f3fc": ["1f481-1f3fc-200d-2642-fe0f", 25, 19, 15, ["💁🏼‍♂️"]], "1f3fd": ["1f481-1f3fd-200d-2642-fe0f", 25, 20, 15, ["💁🏽‍♂️"]], "1f3fe": ["1f481-1f3fe-200d-2642-fe0f", 25, 21, 15, ["💁🏾‍♂️"]], "1f3ff": ["1f481-1f3ff-200d-2642-fe0f", 25, 22, 15, ["💁🏿‍♂️"]] },
      "1f482-200d-2640-fe0f": { "1f3fb": ["1f482-1f3fb-200d-2640-fe0f", 25, 30, 15, ["💂🏻‍♀️"]], "1f3fc": ["1f482-1f3fc-200d-2640-fe0f", 25, 31, 15, ["💂🏼‍♀️"]], "1f3fd": ["1f482-1f3fd-200d-2640-fe0f", 25, 32, 15, ["💂🏽‍♀️"]], "1f3fe": ["1f482-1f3fe-200d-2640-fe0f", 25, 33, 15, ["💂🏾‍♀️"]], "1f3ff": ["1f482-1f3ff-200d-2640-fe0f", 25, 34, 15, ["💂🏿‍♀️"]] },
      "1f482-200d-2642-fe0f": { "1f3fb": ["1f482-1f3fb-200d-2642-fe0f", 25, 36, 15, ["💂🏻‍♂️", "💂🏻"]], "1f3fc": ["1f482-1f3fc-200d-2642-fe0f", 25, 37, 15, ["💂🏼‍♂️", "💂🏼"]], "1f3fd": ["1f482-1f3fd-200d-2642-fe0f", 25, 38, 15, ["💂🏽‍♂️", "💂🏽"]], "1f3fe": ["1f482-1f3fe-200d-2642-fe0f", 25, 39, 15, ["💂🏾‍♂️", "💂🏾"]], "1f3ff": ["1f482-1f3ff-200d-2642-fe0f", 25, 40, 15, ["💂🏿‍♂️", "💂🏿"]] },
      "1f483": { "1f3fb": ["1f483-1f3fb", 25, 48, 15, ["💃🏻"]], "1f3fc": ["1f483-1f3fc", 25, 49, 15, ["💃🏼"]], "1f3fd": ["1f483-1f3fd", 25, 50, 15, ["💃🏽"]], "1f3fe": ["1f483-1f3fe", 25, 51, 15, ["💃🏾"]], "1f3ff": ["1f483-1f3ff", 25, 52, 15, ["💃🏿"]] },
      "1f485": { "1f3fb": ["1f485-1f3fb", 25, 55, 15, ["💅🏻"]], "1f3fc": ["1f485-1f3fc", 25, 56, 15, ["💅🏼"]], "1f3fd": ["1f485-1f3fd", 25, 57, 15, ["💅🏽"]], "1f3fe": ["1f485-1f3fe", 25, 58, 15, ["💅🏾"]], "1f3ff": ["1f485-1f3ff", 25, 59, 15, ["💅🏿"]] },
      "1f486-200d-2640-fe0f": { "1f3fb": ["1f486-1f3fb-200d-2640-fe0f", 26, 0, 15, ["💆🏻‍♀️", "💆🏻"]], "1f3fc": ["1f486-1f3fc-200d-2640-fe0f", 26, 1, 15, ["💆🏼‍♀️", "💆🏼"]], "1f3fd": ["1f486-1f3fd-200d-2640-fe0f", 26, 2, 15, ["💆🏽‍♀️", "💆🏽"]], "1f3fe": ["1f486-1f3fe-200d-2640-fe0f", 26, 3, 15, ["💆🏾‍♀️", "💆🏾"]], "1f3ff": ["1f486-1f3ff-200d-2640-fe0f", 26, 4, 15, ["💆🏿‍♀️", "💆🏿"]] },
      "1f486-200d-2642-fe0f": { "1f3fb": ["1f486-1f3fb-200d-2642-fe0f", 26, 6, 15, ["💆🏻‍♂️"]], "1f3fc": ["1f486-1f3fc-200d-2642-fe0f", 26, 7, 15, ["💆🏼‍♂️"]], "1f3fd": ["1f486-1f3fd-200d-2642-fe0f", 26, 8, 15, ["💆🏽‍♂️"]], "1f3fe": ["1f486-1f3fe-200d-2642-fe0f", 26, 9, 15, ["💆🏾‍♂️"]], "1f3ff": ["1f486-1f3ff-200d-2642-fe0f", 26, 10, 15, ["💆🏿‍♂️"]] },
      "1f487-200d-2640-fe0f": { "1f3fb": ["1f487-1f3fb-200d-2640-fe0f", 26, 18, 15, ["💇🏻‍♀️", "💇🏻"]], "1f3fc": ["1f487-1f3fc-200d-2640-fe0f", 26, 19, 15, ["💇🏼‍♀️", "💇🏼"]], "1f3fd": ["1f487-1f3fd-200d-2640-fe0f", 26, 20, 15, ["💇🏽‍♀️", "💇🏽"]], "1f3fe": ["1f487-1f3fe-200d-2640-fe0f", 26, 21, 15, ["💇🏾‍♀️", "💇🏾"]], "1f3ff": ["1f487-1f3ff-200d-2640-fe0f", 26, 22, 15, ["💇🏿‍♀️", "💇🏿"]] },
      "1f487-200d-2642-fe0f": { "1f3fb": ["1f487-1f3fb-200d-2642-fe0f", 26, 24, 15, ["💇🏻‍♂️"]], "1f3fc": ["1f487-1f3fc-200d-2642-fe0f", 26, 25, 15, ["💇🏼‍♂️"]], "1f3fd": ["1f487-1f3fd-200d-2642-fe0f", 26, 26, 15, ["💇🏽‍♂️"]], "1f3fe": ["1f487-1f3fe-200d-2642-fe0f", 26, 27, 15, ["💇🏾‍♂️"]], "1f3ff": ["1f487-1f3ff-200d-2642-fe0f", 26, 28, 15, ["💇🏿‍♂️"]] },
      "1f48f": { "1f3fb": ["1f48f-1f3fb", 26, 43, 15, ["💏🏻"]], "1f3fc": ["1f48f-1f3fc", 26, 44, 15, ["💏🏼"]], "1f3fd": ["1f48f-1f3fd", 26, 45, 15, ["💏🏽"]], "1f3fe": ["1f48f-1f3fe", 26, 46, 15, ["💏🏾"]], "1f3ff": ["1f48f-1f3ff", 26, 47, 15, ["💏🏿"]], "1f3fb-1f3fc": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc", 26, 48, 15, ["🧑🏻‍❤️‍💋‍🧑🏼"]], "1f3fb-1f3fd": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd", 26, 49, 15, ["🧑🏻‍❤️‍💋‍🧑🏽"]], "1f3fb-1f3fe": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe", 26, 50, 15, ["🧑🏻‍❤️‍💋‍🧑🏾"]], "1f3fb-1f3ff": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff", 26, 51, 15, ["🧑🏻‍❤️‍💋‍🧑🏿"]], "1f3fc-1f3fb": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb", 26, 52, 15, ["🧑🏼‍❤️‍💋‍🧑🏻"]], "1f3fc-1f3fd": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd", 26, 53, 15, ["🧑🏼‍❤️‍💋‍🧑🏽"]], "1f3fc-1f3fe": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe", 26, 54, 15, ["🧑🏼‍❤️‍💋‍🧑🏾"]], "1f3fc-1f3ff": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff", 26, 55, 15, ["🧑🏼‍❤️‍💋‍🧑🏿"]], "1f3fd-1f3fb": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb", 26, 56, 15, ["🧑🏽‍❤️‍💋‍🧑🏻"]], "1f3fd-1f3fc": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc", 26, 57, 15, ["🧑🏽‍❤️‍💋‍🧑🏼"]], "1f3fd-1f3fe": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe", 26, 58, 15, ["🧑🏽‍❤️‍💋‍🧑🏾"]], "1f3fd-1f3ff": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff", 26, 59, 15, ["🧑🏽‍❤️‍💋‍🧑🏿"]], "1f3fe-1f3fb": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb", 26, 60, 15, ["🧑🏾‍❤️‍💋‍🧑🏻"]], "1f3fe-1f3fc": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc", 27, 0, 15, ["🧑🏾‍❤️‍💋‍🧑🏼"]], "1f3fe-1f3fd": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd", 27, 1, 15, ["🧑🏾‍❤️‍💋‍🧑🏽"]], "1f3fe-1f3ff": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff", 27, 2, 15, ["🧑🏾‍❤️‍💋‍🧑🏿"]], "1f3ff-1f3fb": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb", 27, 3, 15, ["🧑🏿‍❤️‍💋‍🧑🏻"]], "1f3ff-1f3fc": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc", 27, 4, 15, ["🧑🏿‍❤️‍💋‍🧑🏼"]], "1f3ff-1f3fd": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd", 27, 5, 15, ["🧑🏿‍❤️‍💋‍🧑🏽"]], "1f3ff-1f3fe": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe", 27, 6, 15, ["🧑🏿‍❤️‍💋‍🧑🏾"]] },
      "1f491": { "1f3fb": ["1f491-1f3fb", 27, 9, 15, ["💑🏻"]], "1f3fc": ["1f491-1f3fc", 27, 10, 15, ["💑🏼"]], "1f3fd": ["1f491-1f3fd", 27, 11, 15, ["💑🏽"]], "1f3fe": ["1f491-1f3fe", 27, 12, 15, ["💑🏾"]], "1f3ff": ["1f491-1f3ff", 27, 13, 15, ["💑🏿"]], "1f3fb-1f3fc": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fc", 27, 14, 15, ["🧑🏻‍❤️‍🧑🏼"]], "1f3fb-1f3fd": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fd", 27, 15, 15, ["🧑🏻‍❤️‍🧑🏽"]], "1f3fb-1f3fe": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fe", 27, 16, 15, ["🧑🏻‍❤️‍🧑🏾"]], "1f3fb-1f3ff": ["1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3ff", 27, 17, 15, ["🧑🏻‍❤️‍🧑🏿"]], "1f3fc-1f3fb": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fb", 27, 18, 15, ["🧑🏼‍❤️‍🧑🏻"]], "1f3fc-1f3fd": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fd", 27, 19, 15, ["🧑🏼‍❤️‍🧑🏽"]], "1f3fc-1f3fe": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe", 27, 20, 15, ["🧑🏼‍❤️‍🧑🏾"]], "1f3fc-1f3ff": ["1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3ff", 27, 21, 15, ["🧑🏼‍❤️‍🧑🏿"]], "1f3fd-1f3fb": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3fb", 27, 22, 15, ["🧑🏽‍❤️‍🧑🏻"]], "1f3fd-1f3fc": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3fc", 27, 23, 15, ["🧑🏽‍❤️‍🧑🏼"]], "1f3fd-1f3fe": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3fe", 27, 24, 15, ["🧑🏽‍❤️‍🧑🏾"]], "1f3fd-1f3ff": ["1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3ff", 27, 25, 15, ["🧑🏽‍❤️‍🧑🏿"]], "1f3fe-1f3fb": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3fb", 27, 26, 15, ["🧑🏾‍❤️‍🧑🏻"]], "1f3fe-1f3fc": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3fc", 27, 27, 15, ["🧑🏾‍❤️‍🧑🏼"]], "1f3fe-1f3fd": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3fd", 27, 28, 15, ["🧑🏾‍❤️‍🧑🏽"]], "1f3fe-1f3ff": ["1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3ff", 27, 29, 15, ["🧑🏾‍❤️‍🧑🏿"]], "1f3ff-1f3fb": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fb", 27, 30, 15, ["🧑🏿‍❤️‍🧑🏻"]], "1f3ff-1f3fc": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fc", 27, 31, 15, ["🧑🏿‍❤️‍🧑🏼"]], "1f3ff-1f3fd": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fd", 27, 32, 15, ["🧑🏿‍❤️‍🧑🏽"]], "1f3ff-1f3fe": ["1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fe", 27, 33, 15, ["🧑🏿‍❤️‍🧑🏾"]] },
      "1f4aa": { "1f3fb": ["1f4aa-1f3fb", 27, 59, 15, ["💪🏻"]], "1f3fc": ["1f4aa-1f3fc", 27, 60, 15, ["💪🏼"]], "1f3fd": ["1f4aa-1f3fd", 28, 0, 15, ["💪🏽"]], "1f3fe": ["1f4aa-1f3fe", 28, 1, 15, ["💪🏾"]], "1f3ff": ["1f4aa-1f3ff", 28, 2, 15, ["💪🏿"]] },
      "1f574-fe0f": { "1f3fb": ["1f574-1f3fb", 31, 0, 15, ["🕴🏻"]], "1f3fc": ["1f574-1f3fc", 31, 1, 15, ["🕴🏼"]], "1f3fd": ["1f574-1f3fd", 31, 2, 15, ["🕴🏽"]], "1f3fe": ["1f574-1f3fe", 31, 3, 15, ["🕴🏾"]], "1f3ff": ["1f574-1f3ff", 31, 4, 15, ["🕴🏿"]] },
      "1f575-fe0f-200d-2640-fe0f": { "1f3fb": ["1f575-1f3fb-200d-2640-fe0f", 31, 6, 15, ["🕵🏻‍♀️"]], "1f3fc": ["1f575-1f3fc-200d-2640-fe0f", 31, 7, 15, ["🕵🏼‍♀️"]], "1f3fd": ["1f575-1f3fd-200d-2640-fe0f", 31, 8, 15, ["🕵🏽‍♀️"]], "1f3fe": ["1f575-1f3fe-200d-2640-fe0f", 31, 9, 15, ["🕵🏾‍♀️"]], "1f3ff": ["1f575-1f3ff-200d-2640-fe0f", 31, 10, 15, ["🕵🏿‍♀️"]] },
      "1f575-fe0f-200d-2642-fe0f": { "1f3fb": ["1f575-1f3fb-200d-2642-fe0f", 31, 12, 15, ["🕵🏻‍♂️", "🕵🏻"]], "1f3fc": ["1f575-1f3fc-200d-2642-fe0f", 31, 13, 15, ["🕵🏼‍♂️", "🕵🏼"]], "1f3fd": ["1f575-1f3fd-200d-2642-fe0f", 31, 14, 15, ["🕵🏽‍♂️", "🕵🏽"]], "1f3fe": ["1f575-1f3fe-200d-2642-fe0f", 31, 15, 15, ["🕵🏾‍♂️", "🕵🏾"]], "1f3ff": ["1f575-1f3ff-200d-2642-fe0f", 31, 16, 15, ["🕵🏿‍♂️", "🕵🏿"]] },
      "1f57a": { "1f3fb": ["1f57a-1f3fb", 31, 28, 15, ["🕺🏻"]], "1f3fc": ["1f57a-1f3fc", 31, 29, 15, ["🕺🏼"]], "1f3fd": ["1f57a-1f3fd", 31, 30, 15, ["🕺🏽"]], "1f3fe": ["1f57a-1f3fe", 31, 31, 15, ["🕺🏾"]], "1f3ff": ["1f57a-1f3ff", 31, 32, 15, ["🕺🏿"]] },
      "1f590-fe0f": { "1f3fb": ["1f590-1f3fb", 31, 39, 15, ["🖐🏻"]], "1f3fc": ["1f590-1f3fc", 31, 40, 15, ["🖐🏼"]], "1f3fd": ["1f590-1f3fd", 31, 41, 15, ["🖐🏽"]], "1f3fe": ["1f590-1f3fe", 31, 42, 15, ["🖐🏾"]], "1f3ff": ["1f590-1f3ff", 31, 43, 15, ["🖐🏿"]] },
      "1f595": { "1f3fb": ["1f595-1f3fb", 31, 45, 15, ["🖕🏻"]], "1f3fc": ["1f595-1f3fc", 31, 46, 15, ["🖕🏼"]], "1f3fd": ["1f595-1f3fd", 31, 47, 15, ["🖕🏽"]], "1f3fe": ["1f595-1f3fe", 31, 48, 15, ["🖕🏾"]], "1f3ff": ["1f595-1f3ff", 31, 49, 15, ["🖕🏿"]] },
      "1f596": { "1f3fb": ["1f596-1f3fb", 31, 51, 15, ["🖖🏻"]], "1f3fc": ["1f596-1f3fc", 31, 52, 15, ["🖖🏼"]], "1f3fd": ["1f596-1f3fd", 31, 53, 15, ["🖖🏽"]], "1f3fe": ["1f596-1f3fe", 31, 54, 15, ["🖖🏾"]], "1f3ff": ["1f596-1f3ff", 31, 55, 15, ["🖖🏿"]] },
      "1f645-200d-2640-fe0f": { "1f3fb": ["1f645-1f3fb-200d-2640-fe0f", 33, 33, 15, ["🙅🏻‍♀️", "🙅🏻"]], "1f3fc": ["1f645-1f3fc-200d-2640-fe0f", 33, 34, 15, ["🙅🏼‍♀️", "🙅🏼"]], "1f3fd": ["1f645-1f3fd-200d-2640-fe0f", 33, 35, 15, ["🙅🏽‍♀️", "🙅🏽"]], "1f3fe": ["1f645-1f3fe-200d-2640-fe0f", 33, 36, 15, ["🙅🏾‍♀️", "🙅🏾"]], "1f3ff": ["1f645-1f3ff-200d-2640-fe0f", 33, 37, 15, ["🙅🏿‍♀️", "🙅🏿"]] },
      "1f645-200d-2642-fe0f": { "1f3fb": ["1f645-1f3fb-200d-2642-fe0f", 33, 39, 15, ["🙅🏻‍♂️"]], "1f3fc": ["1f645-1f3fc-200d-2642-fe0f", 33, 40, 15, ["🙅🏼‍♂️"]], "1f3fd": ["1f645-1f3fd-200d-2642-fe0f", 33, 41, 15, ["🙅🏽‍♂️"]], "1f3fe": ["1f645-1f3fe-200d-2642-fe0f", 33, 42, 15, ["🙅🏾‍♂️"]], "1f3ff": ["1f645-1f3ff-200d-2642-fe0f", 33, 43, 15, ["🙅🏿‍♂️"]] },
      "1f646-200d-2640-fe0f": { "1f3fb": ["1f646-1f3fb-200d-2640-fe0f", 33, 51, 15, ["🙆🏻‍♀️", "🙆🏻"]], "1f3fc": ["1f646-1f3fc-200d-2640-fe0f", 33, 52, 15, ["🙆🏼‍♀️", "🙆🏼"]], "1f3fd": ["1f646-1f3fd-200d-2640-fe0f", 33, 53, 15, ["🙆🏽‍♀️", "🙆🏽"]], "1f3fe": ["1f646-1f3fe-200d-2640-fe0f", 33, 54, 15, ["🙆🏾‍♀️", "🙆🏾"]], "1f3ff": ["1f646-1f3ff-200d-2640-fe0f", 33, 55, 15, ["🙆🏿‍♀️", "🙆🏿"]] },
      "1f646-200d-2642-fe0f": { "1f3fb": ["1f646-1f3fb-200d-2642-fe0f", 33, 57, 15, ["🙆🏻‍♂️"]], "1f3fc": ["1f646-1f3fc-200d-2642-fe0f", 33, 58, 15, ["🙆🏼‍♂️"]], "1f3fd": ["1f646-1f3fd-200d-2642-fe0f", 33, 59, 15, ["🙆🏽‍♂️"]], "1f3fe": ["1f646-1f3fe-200d-2642-fe0f", 33, 60, 15, ["🙆🏾‍♂️"]], "1f3ff": ["1f646-1f3ff-200d-2642-fe0f", 34, 0, 15, ["🙆🏿‍♂️"]] },
      "1f647-200d-2640-fe0f": { "1f3fb": ["1f647-1f3fb-200d-2640-fe0f", 34, 8, 15, ["🙇🏻‍♀️"]], "1f3fc": ["1f647-1f3fc-200d-2640-fe0f", 34, 9, 15, ["🙇🏼‍♀️"]], "1f3fd": ["1f647-1f3fd-200d-2640-fe0f", 34, 10, 15, ["🙇🏽‍♀️"]], "1f3fe": ["1f647-1f3fe-200d-2640-fe0f", 34, 11, 15, ["🙇🏾‍♀️"]], "1f3ff": ["1f647-1f3ff-200d-2640-fe0f", 34, 12, 15, ["🙇🏿‍♀️"]] },
      "1f647-200d-2642-fe0f": { "1f3fb": ["1f647-1f3fb-200d-2642-fe0f", 34, 14, 15, ["🙇🏻‍♂️"]], "1f3fc": ["1f647-1f3fc-200d-2642-fe0f", 34, 15, 15, ["🙇🏼‍♂️"]], "1f3fd": ["1f647-1f3fd-200d-2642-fe0f", 34, 16, 15, ["🙇🏽‍♂️"]], "1f3fe": ["1f647-1f3fe-200d-2642-fe0f", 34, 17, 15, ["🙇🏾‍♂️"]], "1f3ff": ["1f647-1f3ff-200d-2642-fe0f", 34, 18, 15, ["🙇🏿‍♂️"]] },
      "1f647": { "1f3fb": ["1f647-1f3fb", 34, 20, 15, ["🙇🏻"]], "1f3fc": ["1f647-1f3fc", 34, 21, 15, ["🙇🏼"]], "1f3fd": ["1f647-1f3fd", 34, 22, 15, ["🙇🏽"]], "1f3fe": ["1f647-1f3fe", 34, 23, 15, ["🙇🏾"]], "1f3ff": ["1f647-1f3ff", 34, 24, 15, ["🙇🏿"]] },
      "1f64b-200d-2640-fe0f": { "1f3fb": ["1f64b-1f3fb-200d-2640-fe0f", 34, 29, 15, ["🙋🏻‍♀️", "🙋🏻"]], "1f3fc": ["1f64b-1f3fc-200d-2640-fe0f", 34, 30, 15, ["🙋🏼‍♀️", "🙋🏼"]], "1f3fd": ["1f64b-1f3fd-200d-2640-fe0f", 34, 31, 15, ["🙋🏽‍♀️", "🙋🏽"]], "1f3fe": ["1f64b-1f3fe-200d-2640-fe0f", 34, 32, 15, ["🙋🏾‍♀️", "🙋🏾"]], "1f3ff": ["1f64b-1f3ff-200d-2640-fe0f", 34, 33, 15, ["🙋🏿‍♀️", "🙋🏿"]] },
      "1f64b-200d-2642-fe0f": { "1f3fb": ["1f64b-1f3fb-200d-2642-fe0f", 34, 35, 15, ["🙋🏻‍♂️"]], "1f3fc": ["1f64b-1f3fc-200d-2642-fe0f", 34, 36, 15, ["🙋🏼‍♂️"]], "1f3fd": ["1f64b-1f3fd-200d-2642-fe0f", 34, 37, 15, ["🙋🏽‍♂️"]], "1f3fe": ["1f64b-1f3fe-200d-2642-fe0f", 34, 38, 15, ["🙋🏾‍♂️"]], "1f3ff": ["1f64b-1f3ff-200d-2642-fe0f", 34, 39, 15, ["🙋🏿‍♂️"]] },
      "1f64c": { "1f3fb": ["1f64c-1f3fb", 34, 47, 15, ["🙌🏻"]], "1f3fc": ["1f64c-1f3fc", 34, 48, 15, ["🙌🏼"]], "1f3fd": ["1f64c-1f3fd", 34, 49, 15, ["🙌🏽"]], "1f3fe": ["1f64c-1f3fe", 34, 50, 15, ["🙌🏾"]], "1f3ff": ["1f64c-1f3ff", 34, 51, 15, ["🙌🏿"]] },
      "1f64d-200d-2640-fe0f": { "1f3fb": ["1f64d-1f3fb-200d-2640-fe0f", 34, 53, 15, ["🙍🏻‍♀️", "🙍🏻"]], "1f3fc": ["1f64d-1f3fc-200d-2640-fe0f", 34, 54, 15, ["🙍🏼‍♀️", "🙍🏼"]], "1f3fd": ["1f64d-1f3fd-200d-2640-fe0f", 34, 55, 15, ["🙍🏽‍♀️", "🙍🏽"]], "1f3fe": ["1f64d-1f3fe-200d-2640-fe0f", 34, 56, 15, ["🙍🏾‍♀️", "🙍🏾"]], "1f3ff": ["1f64d-1f3ff-200d-2640-fe0f", 34, 57, 15, ["🙍🏿‍♀️", "🙍🏿"]] },
      "1f64d-200d-2642-fe0f": { "1f3fb": ["1f64d-1f3fb-200d-2642-fe0f", 34, 59, 15, ["🙍🏻‍♂️"]], "1f3fc": ["1f64d-1f3fc-200d-2642-fe0f", 34, 60, 15, ["🙍🏼‍♂️"]], "1f3fd": ["1f64d-1f3fd-200d-2642-fe0f", 35, 0, 15, ["🙍🏽‍♂️"]], "1f3fe": ["1f64d-1f3fe-200d-2642-fe0f", 35, 1, 15, ["🙍🏾‍♂️"]], "1f3ff": ["1f64d-1f3ff-200d-2642-fe0f", 35, 2, 15, ["🙍🏿‍♂️"]] },
      "1f64e-200d-2640-fe0f": { "1f3fb": ["1f64e-1f3fb-200d-2640-fe0f", 35, 10, 15, ["🙎🏻‍♀️", "🙎🏻"]], "1f3fc": ["1f64e-1f3fc-200d-2640-fe0f", 35, 11, 15, ["🙎🏼‍♀️", "🙎🏼"]], "1f3fd": ["1f64e-1f3fd-200d-2640-fe0f", 35, 12, 15, ["🙎🏽‍♀️", "🙎🏽"]], "1f3fe": ["1f64e-1f3fe-200d-2640-fe0f", 35, 13, 15, ["🙎🏾‍♀️", "🙎🏾"]], "1f3ff": ["1f64e-1f3ff-200d-2640-fe0f", 35, 14, 15, ["🙎🏿‍♀️", "🙎🏿"]] },
      "1f64e-200d-2642-fe0f": { "1f3fb": ["1f64e-1f3fb-200d-2642-fe0f", 35, 16, 15, ["🙎🏻‍♂️"]], "1f3fc": ["1f64e-1f3fc-200d-2642-fe0f", 35, 17, 15, ["🙎🏼‍♂️"]], "1f3fd": ["1f64e-1f3fd-200d-2642-fe0f", 35, 18, 15, ["🙎🏽‍♂️"]], "1f3fe": ["1f64e-1f3fe-200d-2642-fe0f", 35, 19, 15, ["🙎🏾‍♂️"]], "1f3ff": ["1f64e-1f3ff-200d-2642-fe0f", 35, 20, 15, ["🙎🏿‍♂️"]] },
      "1f64f": { "1f3fb": ["1f64f-1f3fb", 35, 28, 15, ["🙏🏻"]], "1f3fc": ["1f64f-1f3fc", 35, 29, 15, ["🙏🏼"]], "1f3fd": ["1f64f-1f3fd", 35, 30, 15, ["🙏🏽"]], "1f3fe": ["1f64f-1f3fe", 35, 31, 15, ["🙏🏾"]], "1f3ff": ["1f64f-1f3ff", 35, 32, 15, ["🙏🏿"]] },
      "1f6a3-200d-2640-fe0f": { "1f3fb": ["1f6a3-1f3fb-200d-2640-fe0f", 36, 8, 15, ["🚣🏻‍♀️"]], "1f3fc": ["1f6a3-1f3fc-200d-2640-fe0f", 36, 9, 15, ["🚣🏼‍♀️"]], "1f3fd": ["1f6a3-1f3fd-200d-2640-fe0f", 36, 10, 15, ["🚣🏽‍♀️"]], "1f3fe": ["1f6a3-1f3fe-200d-2640-fe0f", 36, 11, 15, ["🚣🏾‍♀️"]], "1f3ff": ["1f6a3-1f3ff-200d-2640-fe0f", 36, 12, 15, ["🚣🏿‍♀️"]] },
      "1f6a3-200d-2642-fe0f": { "1f3fb": ["1f6a3-1f3fb-200d-2642-fe0f", 36, 14, 15, ["🚣🏻‍♂️", "🚣🏻"]], "1f3fc": ["1f6a3-1f3fc-200d-2642-fe0f", 36, 15, 15, ["🚣🏼‍♂️", "🚣🏼"]], "1f3fd": ["1f6a3-1f3fd-200d-2642-fe0f", 36, 16, 15, ["🚣🏽‍♂️", "🚣🏽"]], "1f3fe": ["1f6a3-1f3fe-200d-2642-fe0f", 36, 17, 15, ["🚣🏾‍♂️", "🚣🏾"]], "1f3ff": ["1f6a3-1f3ff-200d-2642-fe0f", 36, 18, 15, ["🚣🏿‍♂️", "🚣🏿"]] },
      "1f6b4-200d-2640-fe0f": { "1f3fb": ["1f6b4-1f3fb-200d-2640-fe0f", 36, 42, 15, ["🚴🏻‍♀️"]], "1f3fc": ["1f6b4-1f3fc-200d-2640-fe0f", 36, 43, 15, ["🚴🏼‍♀️"]], "1f3fd": ["1f6b4-1f3fd-200d-2640-fe0f", 36, 44, 15, ["🚴🏽‍♀️"]], "1f3fe": ["1f6b4-1f3fe-200d-2640-fe0f", 36, 45, 15, ["🚴🏾‍♀️"]], "1f3ff": ["1f6b4-1f3ff-200d-2640-fe0f", 36, 46, 15, ["🚴🏿‍♀️"]] },
      "1f6b4-200d-2642-fe0f": { "1f3fb": ["1f6b4-1f3fb-200d-2642-fe0f", 36, 48, 15, ["🚴🏻‍♂️", "🚴🏻"]], "1f3fc": ["1f6b4-1f3fc-200d-2642-fe0f", 36, 49, 15, ["🚴🏼‍♂️", "🚴🏼"]], "1f3fd": ["1f6b4-1f3fd-200d-2642-fe0f", 36, 50, 15, ["🚴🏽‍♂️", "🚴🏽"]], "1f3fe": ["1f6b4-1f3fe-200d-2642-fe0f", 36, 51, 15, ["🚴🏾‍♂️", "🚴🏾"]], "1f3ff": ["1f6b4-1f3ff-200d-2642-fe0f", 36, 52, 15, ["🚴🏿‍♂️", "🚴🏿"]] },
      "1f6b5-200d-2640-fe0f": { "1f3fb": ["1f6b5-1f3fb-200d-2640-fe0f", 36, 60, 15, ["🚵🏻‍♀️"]], "1f3fc": ["1f6b5-1f3fc-200d-2640-fe0f", 37, 0, 15, ["🚵🏼‍♀️"]], "1f3fd": ["1f6b5-1f3fd-200d-2640-fe0f", 37, 1, 15, ["🚵🏽‍♀️"]], "1f3fe": ["1f6b5-1f3fe-200d-2640-fe0f", 37, 2, 15, ["🚵🏾‍♀️"]], "1f3ff": ["1f6b5-1f3ff-200d-2640-fe0f", 37, 3, 15, ["🚵🏿‍♀️"]] },
      "1f6b5-200d-2642-fe0f": { "1f3fb": ["1f6b5-1f3fb-200d-2642-fe0f", 37, 5, 15, ["🚵🏻‍♂️", "🚵🏻"]], "1f3fc": ["1f6b5-1f3fc-200d-2642-fe0f", 37, 6, 15, ["🚵🏼‍♂️", "🚵🏼"]], "1f3fd": ["1f6b5-1f3fd-200d-2642-fe0f", 37, 7, 15, ["🚵🏽‍♂️", "🚵🏽"]], "1f3fe": ["1f6b5-1f3fe-200d-2642-fe0f", 37, 8, 15, ["🚵🏾‍♂️", "🚵🏾"]], "1f3ff": ["1f6b5-1f3ff-200d-2642-fe0f", 37, 9, 15, ["🚵🏿‍♂️", "🚵🏿"]] },
      "1f6b6-200d-2640-fe0f": { "1f3fb": ["1f6b6-1f3fb-200d-2640-fe0f", 37, 17, 15, ["🚶🏻‍♀️"]], "1f3fc": ["1f6b6-1f3fc-200d-2640-fe0f", 37, 18, 15, ["🚶🏼‍♀️"]], "1f3fd": ["1f6b6-1f3fd-200d-2640-fe0f", 37, 19, 15, ["🚶🏽‍♀️"]], "1f3fe": ["1f6b6-1f3fe-200d-2640-fe0f", 37, 20, 15, ["🚶🏾‍♀️"]], "1f3ff": ["1f6b6-1f3ff-200d-2640-fe0f", 37, 21, 15, ["🚶🏿‍♀️"]] },
      "1f6b6-200d-2642-fe0f": { "1f3fb": ["1f6b6-1f3fb-200d-2642-fe0f", 37, 23, 15, ["🚶🏻‍♂️", "🚶🏻"]], "1f3fc": ["1f6b6-1f3fc-200d-2642-fe0f", 37, 24, 15, ["🚶🏼‍♂️", "🚶🏼"]], "1f3fd": ["1f6b6-1f3fd-200d-2642-fe0f", 37, 25, 15, ["🚶🏽‍♂️", "🚶🏽"]], "1f3fe": ["1f6b6-1f3fe-200d-2642-fe0f", 37, 26, 15, ["🚶🏾‍♂️", "🚶🏾"]], "1f3ff": ["1f6b6-1f3ff-200d-2642-fe0f", 37, 27, 15, ["🚶🏿‍♂️", "🚶🏿"]] },
      "1f6c0": { "1f3fb": ["1f6c0-1f3fb", 37, 44, 15, ["🛀🏻"]], "1f3fc": ["1f6c0-1f3fc", 37, 45, 15, ["🛀🏼"]], "1f3fd": ["1f6c0-1f3fd", 37, 46, 15, ["🛀🏽"]], "1f3fe": ["1f6c0-1f3fe", 37, 47, 15, ["🛀🏾"]], "1f3ff": ["1f6c0-1f3ff", 37, 48, 15, ["🛀🏿"]] },
      "1f6cc": { "1f3fb": ["1f6cc-1f3fb", 37, 56, 15, ["🛌🏻"]], "1f3fc": ["1f6cc-1f3fc", 37, 57, 15, ["🛌🏼"]], "1f3fd": ["1f6cc-1f3fd", 37, 58, 15, ["🛌🏽"]], "1f3fe": ["1f6cc-1f3fe", 37, 59, 15, ["🛌🏾"]], "1f3ff": ["1f6cc-1f3ff", 37, 60, 15, ["🛌🏿"]] },
      "1f90c": { "1f3fb": ["1f90c-1f3fb", 38, 47, 15, ["🤌🏻"]], "1f3fc": ["1f90c-1f3fc", 38, 48, 15, ["🤌🏼"]], "1f3fd": ["1f90c-1f3fd", 38, 49, 15, ["🤌🏽"]], "1f3fe": ["1f90c-1f3fe", 38, 50, 15, ["🤌🏾"]], "1f3ff": ["1f90c-1f3ff", 38, 51, 15, ["🤌🏿"]] },
      "1f90f": { "1f3fb": ["1f90f-1f3fb", 38, 55, 15, ["🤏🏻"]], "1f3fc": ["1f90f-1f3fc", 38, 56, 15, ["🤏🏼"]], "1f3fd": ["1f90f-1f3fd", 38, 57, 15, ["🤏🏽"]], "1f3fe": ["1f90f-1f3fe", 38, 58, 15, ["🤏🏾"]], "1f3ff": ["1f90f-1f3ff", 38, 59, 15, ["🤏🏿"]] },
      "1f918": { "1f3fb": ["1f918-1f3fb", 39, 8, 15, ["🤘🏻"]], "1f3fc": ["1f918-1f3fc", 39, 9, 15, ["🤘🏼"]], "1f3fd": ["1f918-1f3fd", 39, 10, 15, ["🤘🏽"]], "1f3fe": ["1f918-1f3fe", 39, 11, 15, ["🤘🏾"]], "1f3ff": ["1f918-1f3ff", 39, 12, 15, ["🤘🏿"]] },
      "1f919": { "1f3fb": ["1f919-1f3fb", 39, 14, 15, ["🤙🏻"]], "1f3fc": ["1f919-1f3fc", 39, 15, 15, ["🤙🏼"]], "1f3fd": ["1f919-1f3fd", 39, 16, 15, ["🤙🏽"]], "1f3fe": ["1f919-1f3fe", 39, 17, 15, ["🤙🏾"]], "1f3ff": ["1f919-1f3ff", 39, 18, 15, ["🤙🏿"]] },
      "1f91a": { "1f3fb": ["1f91a-1f3fb", 39, 20, 15, ["🤚🏻"]], "1f3fc": ["1f91a-1f3fc", 39, 21, 15, ["🤚🏼"]], "1f3fd": ["1f91a-1f3fd", 39, 22, 15, ["🤚🏽"]], "1f3fe": ["1f91a-1f3fe", 39, 23, 15, ["🤚🏾"]], "1f3ff": ["1f91a-1f3ff", 39, 24, 15, ["🤚🏿"]] },
      "1f91b": { "1f3fb": ["1f91b-1f3fb", 39, 26, 15, ["🤛🏻"]], "1f3fc": ["1f91b-1f3fc", 39, 27, 15, ["🤛🏼"]], "1f3fd": ["1f91b-1f3fd", 39, 28, 15, ["🤛🏽"]], "1f3fe": ["1f91b-1f3fe", 39, 29, 15, ["🤛🏾"]], "1f3ff": ["1f91b-1f3ff", 39, 30, 15, ["🤛🏿"]] },
      "1f91c": { "1f3fb": ["1f91c-1f3fb", 39, 32, 15, ["🤜🏻"]], "1f3fc": ["1f91c-1f3fc", 39, 33, 15, ["🤜🏼"]], "1f3fd": ["1f91c-1f3fd", 39, 34, 15, ["🤜🏽"]], "1f3fe": ["1f91c-1f3fe", 39, 35, 15, ["🤜🏾"]], "1f3ff": ["1f91c-1f3ff", 39, 36, 15, ["🤜🏿"]] },
      "1f91d": { "1f3fb": ["1f91d-1f3fb", 39, 38, 15, ["🤝🏻"]], "1f3fc": ["1f91d-1f3fc", 39, 39, 15, ["🤝🏼"]], "1f3fd": ["1f91d-1f3fd", 39, 40, 15, ["🤝🏽"]], "1f3fe": ["1f91d-1f3fe", 39, 41, 15, ["🤝🏾"]], "1f3ff": ["1f91d-1f3ff", 39, 42, 15, ["🤝🏿"]], "1f3fb-1f3fc": ["1faf1-1f3fb-200d-1faf2-1f3fc", 39, 43, 15, ["🫱🏻‍🫲🏼"]], "1f3fb-1f3fd": ["1faf1-1f3fb-200d-1faf2-1f3fd", 39, 44, 15, ["🫱🏻‍🫲🏽"]], "1f3fb-1f3fe": ["1faf1-1f3fb-200d-1faf2-1f3fe", 39, 45, 15, ["🫱🏻‍🫲🏾"]], "1f3fb-1f3ff": ["1faf1-1f3fb-200d-1faf2-1f3ff", 39, 46, 15, ["🫱🏻‍🫲🏿"]], "1f3fc-1f3fb": ["1faf1-1f3fc-200d-1faf2-1f3fb", 39, 47, 15, ["🫱🏼‍🫲🏻"]], "1f3fc-1f3fd": ["1faf1-1f3fc-200d-1faf2-1f3fd", 39, 48, 15, ["🫱🏼‍🫲🏽"]], "1f3fc-1f3fe": ["1faf1-1f3fc-200d-1faf2-1f3fe", 39, 49, 15, ["🫱🏼‍🫲🏾"]], "1f3fc-1f3ff": ["1faf1-1f3fc-200d-1faf2-1f3ff", 39, 50, 15, ["🫱🏼‍🫲🏿"]], "1f3fd-1f3fb": ["1faf1-1f3fd-200d-1faf2-1f3fb", 39, 51, 15, ["🫱🏽‍🫲🏻"]], "1f3fd-1f3fc": ["1faf1-1f3fd-200d-1faf2-1f3fc", 39, 52, 15, ["🫱🏽‍🫲🏼"]], "1f3fd-1f3fe": ["1faf1-1f3fd-200d-1faf2-1f3fe", 39, 53, 15, ["🫱🏽‍🫲🏾"]], "1f3fd-1f3ff": ["1faf1-1f3fd-200d-1faf2-1f3ff", 39, 54, 15, ["🫱🏽‍🫲🏿"]], "1f3fe-1f3fb": ["1faf1-1f3fe-200d-1faf2-1f3fb", 39, 55, 15, ["🫱🏾‍🫲🏻"]], "1f3fe-1f3fc": ["1faf1-1f3fe-200d-1faf2-1f3fc", 39, 56, 15, ["🫱🏾‍🫲🏼"]], "1f3fe-1f3fd": ["1faf1-1f3fe-200d-1faf2-1f3fd", 39, 57, 15, ["🫱🏾‍🫲🏽"]], "1f3fe-1f3ff": ["1faf1-1f3fe-200d-1faf2-1f3ff", 39, 58, 15, ["🫱🏾‍🫲🏿"]], "1f3ff-1f3fb": ["1faf1-1f3ff-200d-1faf2-1f3fb", 39, 59, 15, ["🫱🏿‍🫲🏻"]], "1f3ff-1f3fc": ["1faf1-1f3ff-200d-1faf2-1f3fc", 39, 60, 15, ["🫱🏿‍🫲🏼"]], "1f3ff-1f3fd": ["1faf1-1f3ff-200d-1faf2-1f3fd", 40, 0, 15, ["🫱🏿‍🫲🏽"]], "1f3ff-1f3fe": ["1faf1-1f3ff-200d-1faf2-1f3fe", 40, 1, 15, ["🫱🏿‍🫲🏾"]] },
      "1f91e": { "1f3fb": ["1f91e-1f3fb", 40, 3, 15, ["🤞🏻"]], "1f3fc": ["1f91e-1f3fc", 40, 4, 15, ["🤞🏼"]], "1f3fd": ["1f91e-1f3fd", 40, 5, 15, ["🤞🏽"]], "1f3fe": ["1f91e-1f3fe", 40, 6, 15, ["🤞🏾"]], "1f3ff": ["1f91e-1f3ff", 40, 7, 15, ["🤞🏿"]] },
      "1f91f": { "1f3fb": ["1f91f-1f3fb", 40, 9, 15, ["🤟🏻"]], "1f3fc": ["1f91f-1f3fc", 40, 10, 15, ["🤟🏼"]], "1f3fd": ["1f91f-1f3fd", 40, 11, 15, ["🤟🏽"]], "1f3fe": ["1f91f-1f3fe", 40, 12, 15, ["🤟🏾"]], "1f3ff": ["1f91f-1f3ff", 40, 13, 15, ["🤟🏿"]] },
      "1f926-200d-2640-fe0f": { "1f3fb": ["1f926-1f3fb-200d-2640-fe0f", 40, 21, 15, ["🤦🏻‍♀️"]], "1f3fc": ["1f926-1f3fc-200d-2640-fe0f", 40, 22, 15, ["🤦🏼‍♀️"]], "1f3fd": ["1f926-1f3fd-200d-2640-fe0f", 40, 23, 15, ["🤦🏽‍♀️"]], "1f3fe": ["1f926-1f3fe-200d-2640-fe0f", 40, 24, 15, ["🤦🏾‍♀️"]], "1f3ff": ["1f926-1f3ff-200d-2640-fe0f", 40, 25, 15, ["🤦🏿‍♀️"]] },
      "1f926-200d-2642-fe0f": { "1f3fb": ["1f926-1f3fb-200d-2642-fe0f", 40, 27, 15, ["🤦🏻‍♂️"]], "1f3fc": ["1f926-1f3fc-200d-2642-fe0f", 40, 28, 15, ["🤦🏼‍♂️"]], "1f3fd": ["1f926-1f3fd-200d-2642-fe0f", 40, 29, 15, ["🤦🏽‍♂️"]], "1f3fe": ["1f926-1f3fe-200d-2642-fe0f", 40, 30, 15, ["🤦🏾‍♂️"]], "1f3ff": ["1f926-1f3ff-200d-2642-fe0f", 40, 31, 15, ["🤦🏿‍♂️"]] },
      "1f926": { "1f3fb": ["1f926-1f3fb", 40, 33, 15, ["🤦🏻"]], "1f3fc": ["1f926-1f3fc", 40, 34, 15, ["🤦🏼"]], "1f3fd": ["1f926-1f3fd", 40, 35, 15, ["🤦🏽"]], "1f3fe": ["1f926-1f3fe", 40, 36, 15, ["🤦🏾"]], "1f3ff": ["1f926-1f3ff", 40, 37, 15, ["🤦🏿"]] },
      "1f930": { "1f3fb": ["1f930-1f3fb", 40, 48, 15, ["🤰🏻"]], "1f3fc": ["1f930-1f3fc", 40, 49, 15, ["🤰🏼"]], "1f3fd": ["1f930-1f3fd", 40, 50, 15, ["🤰🏽"]], "1f3fe": ["1f930-1f3fe", 40, 51, 15, ["🤰🏾"]], "1f3ff": ["1f930-1f3ff", 40, 52, 15, ["🤰🏿"]] },
      "1f931": { "1f3fb": ["1f931-1f3fb", 40, 54, 15, ["🤱🏻"]], "1f3fc": ["1f931-1f3fc", 40, 55, 15, ["🤱🏼"]], "1f3fd": ["1f931-1f3fd", 40, 56, 15, ["🤱🏽"]], "1f3fe": ["1f931-1f3fe", 40, 57, 15, ["🤱🏾"]], "1f3ff": ["1f931-1f3ff", 40, 58, 15, ["🤱🏿"]] },
      "1f932": { "1f3fb": ["1f932-1f3fb", 40, 60, 15, ["🤲🏻"]], "1f3fc": ["1f932-1f3fc", 41, 0, 15, ["🤲🏼"]], "1f3fd": ["1f932-1f3fd", 41, 1, 15, ["🤲🏽"]], "1f3fe": ["1f932-1f3fe", 41, 2, 15, ["🤲🏾"]], "1f3ff": ["1f932-1f3ff", 41, 3, 15, ["🤲🏿"]] },
      "1f933": { "1f3fb": ["1f933-1f3fb", 41, 5, 15, ["🤳🏻"]], "1f3fc": ["1f933-1f3fc", 41, 6, 15, ["🤳🏼"]], "1f3fd": ["1f933-1f3fd", 41, 7, 15, ["🤳🏽"]], "1f3fe": ["1f933-1f3fe", 41, 8, 15, ["🤳🏾"]], "1f3ff": ["1f933-1f3ff", 41, 9, 15, ["🤳🏿"]] },
      "1f934": { "1f3fb": ["1f934-1f3fb", 41, 11, 15, ["🤴🏻"]], "1f3fc": ["1f934-1f3fc", 41, 12, 15, ["🤴🏼"]], "1f3fd": ["1f934-1f3fd", 41, 13, 15, ["🤴🏽"]], "1f3fe": ["1f934-1f3fe", 41, 14, 15, ["🤴🏾"]], "1f3ff": ["1f934-1f3ff", 41, 15, 15, ["🤴🏿"]] },
      "1f935-200d-2640-fe0f": { "1f3fb": ["1f935-1f3fb-200d-2640-fe0f", 41, 17, 15, ["🤵🏻‍♀️"]], "1f3fc": ["1f935-1f3fc-200d-2640-fe0f", 41, 18, 15, ["🤵🏼‍♀️"]], "1f3fd": ["1f935-1f3fd-200d-2640-fe0f", 41, 19, 15, ["🤵🏽‍♀️"]], "1f3fe": ["1f935-1f3fe-200d-2640-fe0f", 41, 20, 15, ["🤵🏾‍♀️"]], "1f3ff": ["1f935-1f3ff-200d-2640-fe0f", 41, 21, 15, ["🤵🏿‍♀️"]] },
      "1f935-200d-2642-fe0f": { "1f3fb": ["1f935-1f3fb-200d-2642-fe0f", 41, 23, 15, ["🤵🏻‍♂️"]], "1f3fc": ["1f935-1f3fc-200d-2642-fe0f", 41, 24, 15, ["🤵🏼‍♂️"]], "1f3fd": ["1f935-1f3fd-200d-2642-fe0f", 41, 25, 15, ["🤵🏽‍♂️"]], "1f3fe": ["1f935-1f3fe-200d-2642-fe0f", 41, 26, 15, ["🤵🏾‍♂️"]], "1f3ff": ["1f935-1f3ff-200d-2642-fe0f", 41, 27, 15, ["🤵🏿‍♂️"]] },
      "1f935": { "1f3fb": ["1f935-1f3fb", 41, 29, 15, ["🤵🏻"]], "1f3fc": ["1f935-1f3fc", 41, 30, 15, ["🤵🏼"]], "1f3fd": ["1f935-1f3fd", 41, 31, 15, ["🤵🏽"]], "1f3fe": ["1f935-1f3fe", 41, 32, 15, ["🤵🏾"]], "1f3ff": ["1f935-1f3ff", 41, 33, 15, ["🤵🏿"]] },
      "1f936": { "1f3fb": ["1f936-1f3fb", 41, 35, 15, ["🤶🏻"]], "1f3fc": ["1f936-1f3fc", 41, 36, 15, ["🤶🏼"]], "1f3fd": ["1f936-1f3fd", 41, 37, 15, ["🤶🏽"]], "1f3fe": ["1f936-1f3fe", 41, 38, 15, ["🤶🏾"]], "1f3ff": ["1f936-1f3ff", 41, 39, 15, ["🤶🏿"]] },
      "1f937-200d-2640-fe0f": { "1f3fb": ["1f937-1f3fb-200d-2640-fe0f", 41, 41, 15, ["🤷🏻‍♀️"]], "1f3fc": ["1f937-1f3fc-200d-2640-fe0f", 41, 42, 15, ["🤷🏼‍♀️"]], "1f3fd": ["1f937-1f3fd-200d-2640-fe0f", 41, 43, 15, ["🤷🏽‍♀️"]], "1f3fe": ["1f937-1f3fe-200d-2640-fe0f", 41, 44, 15, ["🤷🏾‍♀️"]], "1f3ff": ["1f937-1f3ff-200d-2640-fe0f", 41, 45, 15, ["🤷🏿‍♀️"]] },
      "1f937-200d-2642-fe0f": { "1f3fb": ["1f937-1f3fb-200d-2642-fe0f", 41, 47, 15, ["🤷🏻‍♂️"]], "1f3fc": ["1f937-1f3fc-200d-2642-fe0f", 41, 48, 15, ["🤷🏼‍♂️"]], "1f3fd": ["1f937-1f3fd-200d-2642-fe0f", 41, 49, 15, ["🤷🏽‍♂️"]], "1f3fe": ["1f937-1f3fe-200d-2642-fe0f", 41, 50, 15, ["🤷🏾‍♂️"]], "1f3ff": ["1f937-1f3ff-200d-2642-fe0f", 41, 51, 15, ["🤷🏿‍♂️"]] },
      "1f937": { "1f3fb": ["1f937-1f3fb", 41, 53, 15, ["🤷🏻"]], "1f3fc": ["1f937-1f3fc", 41, 54, 15, ["🤷🏼"]], "1f3fd": ["1f937-1f3fd", 41, 55, 15, ["🤷🏽"]], "1f3fe": ["1f937-1f3fe", 41, 56, 15, ["🤷🏾"]], "1f3ff": ["1f937-1f3ff", 41, 57, 15, ["🤷🏿"]] },
      "1f938-200d-2640-fe0f": { "1f3fb": ["1f938-1f3fb-200d-2640-fe0f", 41, 59, 15, ["🤸🏻‍♀️"]], "1f3fc": ["1f938-1f3fc-200d-2640-fe0f", 41, 60, 15, ["🤸🏼‍♀️"]], "1f3fd": ["1f938-1f3fd-200d-2640-fe0f", 42, 0, 15, ["🤸🏽‍♀️"]], "1f3fe": ["1f938-1f3fe-200d-2640-fe0f", 42, 1, 15, ["🤸🏾‍♀️"]], "1f3ff": ["1f938-1f3ff-200d-2640-fe0f", 42, 2, 15, ["🤸🏿‍♀️"]] },
      "1f938-200d-2642-fe0f": { "1f3fb": ["1f938-1f3fb-200d-2642-fe0f", 42, 4, 15, ["🤸🏻‍♂️"]], "1f3fc": ["1f938-1f3fc-200d-2642-fe0f", 42, 5, 15, ["🤸🏼‍♂️"]], "1f3fd": ["1f938-1f3fd-200d-2642-fe0f", 42, 6, 15, ["🤸🏽‍♂️"]], "1f3fe": ["1f938-1f3fe-200d-2642-fe0f", 42, 7, 15, ["🤸🏾‍♂️"]], "1f3ff": ["1f938-1f3ff-200d-2642-fe0f", 42, 8, 15, ["🤸🏿‍♂️"]] },
      "1f938": { "1f3fb": ["1f938-1f3fb", 42, 10, 15, ["🤸🏻"]], "1f3fc": ["1f938-1f3fc", 42, 11, 15, ["🤸🏼"]], "1f3fd": ["1f938-1f3fd", 42, 12, 15, ["🤸🏽"]], "1f3fe": ["1f938-1f3fe", 42, 13, 15, ["🤸🏾"]], "1f3ff": ["1f938-1f3ff", 42, 14, 15, ["🤸🏿"]] },
      "1f939-200d-2640-fe0f": { "1f3fb": ["1f939-1f3fb-200d-2640-fe0f", 42, 16, 15, ["🤹🏻‍♀️"]], "1f3fc": ["1f939-1f3fc-200d-2640-fe0f", 42, 17, 15, ["🤹🏼‍♀️"]], "1f3fd": ["1f939-1f3fd-200d-2640-fe0f", 42, 18, 15, ["🤹🏽‍♀️"]], "1f3fe": ["1f939-1f3fe-200d-2640-fe0f", 42, 19, 15, ["🤹🏾‍♀️"]], "1f3ff": ["1f939-1f3ff-200d-2640-fe0f", 42, 20, 15, ["🤹🏿‍♀️"]] },
      "1f939-200d-2642-fe0f": { "1f3fb": ["1f939-1f3fb-200d-2642-fe0f", 42, 22, 15, ["🤹🏻‍♂️"]], "1f3fc": ["1f939-1f3fc-200d-2642-fe0f", 42, 23, 15, ["🤹🏼‍♂️"]], "1f3fd": ["1f939-1f3fd-200d-2642-fe0f", 42, 24, 15, ["🤹🏽‍♂️"]], "1f3fe": ["1f939-1f3fe-200d-2642-fe0f", 42, 25, 15, ["🤹🏾‍♂️"]], "1f3ff": ["1f939-1f3ff-200d-2642-fe0f", 42, 26, 15, ["🤹🏿‍♂️"]] },
      "1f939": { "1f3fb": ["1f939-1f3fb", 42, 28, 15, ["🤹🏻"]], "1f3fc": ["1f939-1f3fc", 42, 29, 15, ["🤹🏼"]], "1f3fd": ["1f939-1f3fd", 42, 30, 15, ["🤹🏽"]], "1f3fe": ["1f939-1f3fe", 42, 31, 15, ["🤹🏾"]], "1f3ff": ["1f939-1f3ff", 42, 32, 15, ["🤹🏿"]] },
      "1f93d-200d-2640-fe0f": { "1f3fb": ["1f93d-1f3fb-200d-2640-fe0f", 42, 38, 15, ["🤽🏻‍♀️"]], "1f3fc": ["1f93d-1f3fc-200d-2640-fe0f", 42, 39, 15, ["🤽🏼‍♀️"]], "1f3fd": ["1f93d-1f3fd-200d-2640-fe0f", 42, 40, 15, ["🤽🏽‍♀️"]], "1f3fe": ["1f93d-1f3fe-200d-2640-fe0f", 42, 41, 15, ["🤽🏾‍♀️"]], "1f3ff": ["1f93d-1f3ff-200d-2640-fe0f", 42, 42, 15, ["🤽🏿‍♀️"]] },
      "1f93d-200d-2642-fe0f": { "1f3fb": ["1f93d-1f3fb-200d-2642-fe0f", 42, 44, 15, ["🤽🏻‍♂️"]], "1f3fc": ["1f93d-1f3fc-200d-2642-fe0f", 42, 45, 15, ["🤽🏼‍♂️"]], "1f3fd": ["1f93d-1f3fd-200d-2642-fe0f", 42, 46, 15, ["🤽🏽‍♂️"]], "1f3fe": ["1f93d-1f3fe-200d-2642-fe0f", 42, 47, 15, ["🤽🏾‍♂️"]], "1f3ff": ["1f93d-1f3ff-200d-2642-fe0f", 42, 48, 15, ["🤽🏿‍♂️"]] },
      "1f93d": { "1f3fb": ["1f93d-1f3fb", 42, 50, 15, ["🤽🏻"]], "1f3fc": ["1f93d-1f3fc", 42, 51, 15, ["🤽🏼"]], "1f3fd": ["1f93d-1f3fd", 42, 52, 15, ["🤽🏽"]], "1f3fe": ["1f93d-1f3fe", 42, 53, 15, ["🤽🏾"]], "1f3ff": ["1f93d-1f3ff", 42, 54, 15, ["🤽🏿"]] },
      "1f93e-200d-2640-fe0f": { "1f3fb": ["1f93e-1f3fb-200d-2640-fe0f", 42, 56, 15, ["🤾🏻‍♀️"]], "1f3fc": ["1f93e-1f3fc-200d-2640-fe0f", 42, 57, 15, ["🤾🏼‍♀️"]], "1f3fd": ["1f93e-1f3fd-200d-2640-fe0f", 42, 58, 15, ["🤾🏽‍♀️"]], "1f3fe": ["1f93e-1f3fe-200d-2640-fe0f", 42, 59, 15, ["🤾🏾‍♀️"]], "1f3ff": ["1f93e-1f3ff-200d-2640-fe0f", 42, 60, 15, ["🤾🏿‍♀️"]] },
      "1f93e-200d-2642-fe0f": { "1f3fb": ["1f93e-1f3fb-200d-2642-fe0f", 43, 1, 15, ["🤾🏻‍♂️"]], "1f3fc": ["1f93e-1f3fc-200d-2642-fe0f", 43, 2, 15, ["🤾🏼‍♂️"]], "1f3fd": ["1f93e-1f3fd-200d-2642-fe0f", 43, 3, 15, ["🤾🏽‍♂️"]], "1f3fe": ["1f93e-1f3fe-200d-2642-fe0f", 43, 4, 15, ["🤾🏾‍♂️"]], "1f3ff": ["1f93e-1f3ff-200d-2642-fe0f", 43, 5, 15, ["🤾🏿‍♂️"]] },
      "1f93e": { "1f3fb": ["1f93e-1f3fb", 43, 7, 15, ["🤾🏻"]], "1f3fc": ["1f93e-1f3fc", 43, 8, 15, ["🤾🏼"]], "1f3fd": ["1f93e-1f3fd", 43, 9, 15, ["🤾🏽"]], "1f3fe": ["1f93e-1f3fe", 43, 10, 15, ["🤾🏾"]], "1f3ff": ["1f93e-1f3ff", 43, 11, 15, ["🤾🏿"]] },
      "1f977": { "1f3fb": ["1f977-1f3fb", 44, 7, 15, ["🥷🏻"]], "1f3fc": ["1f977-1f3fc", 44, 8, 15, ["🥷🏼"]], "1f3fd": ["1f977-1f3fd", 44, 9, 15, ["🥷🏽"]], "1f3fe": ["1f977-1f3fe", 44, 10, 15, ["🥷🏾"]], "1f3ff": ["1f977-1f3ff", 44, 11, 15, ["🥷🏿"]] },
      "1f9b5": { "1f3fb": ["1f9b5-1f3fb", 45, 9, 15, ["🦵🏻"]], "1f3fc": ["1f9b5-1f3fc", 45, 10, 15, ["🦵🏼"]], "1f3fd": ["1f9b5-1f3fd", 45, 11, 15, ["🦵🏽"]], "1f3fe": ["1f9b5-1f3fe", 45, 12, 15, ["🦵🏾"]], "1f3ff": ["1f9b5-1f3ff", 45, 13, 15, ["🦵🏿"]] },
      "1f9b6": { "1f3fb": ["1f9b6-1f3fb", 45, 15, 15, ["🦶🏻"]], "1f3fc": ["1f9b6-1f3fc", 45, 16, 15, ["🦶🏼"]], "1f3fd": ["1f9b6-1f3fd", 45, 17, 15, ["🦶🏽"]], "1f3fe": ["1f9b6-1f3fe", 45, 18, 15, ["🦶🏾"]], "1f3ff": ["1f9b6-1f3ff", 45, 19, 15, ["🦶🏿"]] },
      "1f9b8-200d-2640-fe0f": { "1f3fb": ["1f9b8-1f3fb-200d-2640-fe0f", 45, 22, 15, ["🦸🏻‍♀️"]], "1f3fc": ["1f9b8-1f3fc-200d-2640-fe0f", 45, 23, 15, ["🦸🏼‍♀️"]], "1f3fd": ["1f9b8-1f3fd-200d-2640-fe0f", 45, 24, 15, ["🦸🏽‍♀️"]], "1f3fe": ["1f9b8-1f3fe-200d-2640-fe0f", 45, 25, 15, ["🦸🏾‍♀️"]], "1f3ff": ["1f9b8-1f3ff-200d-2640-fe0f", 45, 26, 15, ["🦸🏿‍♀️"]] },
      "1f9b8-200d-2642-fe0f": { "1f3fb": ["1f9b8-1f3fb-200d-2642-fe0f", 45, 28, 15, ["🦸🏻‍♂️"]], "1f3fc": ["1f9b8-1f3fc-200d-2642-fe0f", 45, 29, 15, ["🦸🏼‍♂️"]], "1f3fd": ["1f9b8-1f3fd-200d-2642-fe0f", 45, 30, 15, ["🦸🏽‍♂️"]], "1f3fe": ["1f9b8-1f3fe-200d-2642-fe0f", 45, 31, 15, ["🦸🏾‍♂️"]], "1f3ff": ["1f9b8-1f3ff-200d-2642-fe0f", 45, 32, 15, ["🦸🏿‍♂️"]] },
      "1f9b8": { "1f3fb": ["1f9b8-1f3fb", 45, 34, 15, ["🦸🏻"]], "1f3fc": ["1f9b8-1f3fc", 45, 35, 15, ["🦸🏼"]], "1f3fd": ["1f9b8-1f3fd", 45, 36, 15, ["🦸🏽"]], "1f3fe": ["1f9b8-1f3fe", 45, 37, 15, ["🦸🏾"]], "1f3ff": ["1f9b8-1f3ff", 45, 38, 15, ["🦸🏿"]] },
      "1f9b9-200d-2640-fe0f": { "1f3fb": ["1f9b9-1f3fb-200d-2640-fe0f", 45, 40, 15, ["🦹🏻‍♀️"]], "1f3fc": ["1f9b9-1f3fc-200d-2640-fe0f", 45, 41, 15, ["🦹🏼‍♀️"]], "1f3fd": ["1f9b9-1f3fd-200d-2640-fe0f", 45, 42, 15, ["🦹🏽‍♀️"]], "1f3fe": ["1f9b9-1f3fe-200d-2640-fe0f", 45, 43, 15, ["🦹🏾‍♀️"]], "1f3ff": ["1f9b9-1f3ff-200d-2640-fe0f", 45, 44, 15, ["🦹🏿‍♀️"]] },
      "1f9b9-200d-2642-fe0f": { "1f3fb": ["1f9b9-1f3fb-200d-2642-fe0f", 45, 46, 15, ["🦹🏻‍♂️"]], "1f3fc": ["1f9b9-1f3fc-200d-2642-fe0f", 45, 47, 15, ["🦹🏼‍♂️"]], "1f3fd": ["1f9b9-1f3fd-200d-2642-fe0f", 45, 48, 15, ["🦹🏽‍♂️"]], "1f3fe": ["1f9b9-1f3fe-200d-2642-fe0f", 45, 49, 15, ["🦹🏾‍♂️"]], "1f3ff": ["1f9b9-1f3ff-200d-2642-fe0f", 45, 50, 15, ["🦹🏿‍♂️"]] },
      "1f9b9": { "1f3fb": ["1f9b9-1f3fb", 45, 52, 15, ["🦹🏻"]], "1f3fc": ["1f9b9-1f3fc", 45, 53, 15, ["🦹🏼"]], "1f3fd": ["1f9b9-1f3fd", 45, 54, 15, ["🦹🏽"]], "1f3fe": ["1f9b9-1f3fe", 45, 55, 15, ["🦹🏾"]], "1f3ff": ["1f9b9-1f3ff", 45, 56, 15, ["🦹🏿"]] },
      "1f9bb": { "1f3fb": ["1f9bb-1f3fb", 45, 59, 15, ["🦻🏻"]], "1f3fc": ["1f9bb-1f3fc", 45, 60, 15, ["🦻🏼"]], "1f3fd": ["1f9bb-1f3fd", 46, 0, 15, ["🦻🏽"]], "1f3fe": ["1f9bb-1f3fe", 46, 1, 15, ["🦻🏾"]], "1f3ff": ["1f9bb-1f3ff", 46, 2, 15, ["🦻🏿"]] },
      "1f9cd-200d-2640-fe0f": { "1f3fb": ["1f9cd-1f3fb-200d-2640-fe0f", 46, 21, 15, ["🧍🏻‍♀️"]], "1f3fc": ["1f9cd-1f3fc-200d-2640-fe0f", 46, 22, 15, ["🧍🏼‍♀️"]], "1f3fd": ["1f9cd-1f3fd-200d-2640-fe0f", 46, 23, 15, ["🧍🏽‍♀️"]], "1f3fe": ["1f9cd-1f3fe-200d-2640-fe0f", 46, 24, 15, ["🧍🏾‍♀️"]], "1f3ff": ["1f9cd-1f3ff-200d-2640-fe0f", 46, 25, 15, ["🧍🏿‍♀️"]] },
      "1f9cd-200d-2642-fe0f": { "1f3fb": ["1f9cd-1f3fb-200d-2642-fe0f", 46, 27, 15, ["🧍🏻‍♂️"]], "1f3fc": ["1f9cd-1f3fc-200d-2642-fe0f", 46, 28, 15, ["🧍🏼‍♂️"]], "1f3fd": ["1f9cd-1f3fd-200d-2642-fe0f", 46, 29, 15, ["🧍🏽‍♂️"]], "1f3fe": ["1f9cd-1f3fe-200d-2642-fe0f", 46, 30, 15, ["🧍🏾‍♂️"]], "1f3ff": ["1f9cd-1f3ff-200d-2642-fe0f", 46, 31, 15, ["🧍🏿‍♂️"]] },
      "1f9cd": { "1f3fb": ["1f9cd-1f3fb", 46, 33, 15, ["🧍🏻"]], "1f3fc": ["1f9cd-1f3fc", 46, 34, 15, ["🧍🏼"]], "1f3fd": ["1f9cd-1f3fd", 46, 35, 15, ["🧍🏽"]], "1f3fe": ["1f9cd-1f3fe", 46, 36, 15, ["🧍🏾"]], "1f3ff": ["1f9cd-1f3ff", 46, 37, 15, ["🧍🏿"]] },
      "1f9ce-200d-2640-fe0f": { "1f3fb": ["1f9ce-1f3fb-200d-2640-fe0f", 46, 39, 15, ["🧎🏻‍♀️"]], "1f3fc": ["1f9ce-1f3fc-200d-2640-fe0f", 46, 40, 15, ["🧎🏼‍♀️"]], "1f3fd": ["1f9ce-1f3fd-200d-2640-fe0f", 46, 41, 15, ["🧎🏽‍♀️"]], "1f3fe": ["1f9ce-1f3fe-200d-2640-fe0f", 46, 42, 15, ["🧎🏾‍♀️"]], "1f3ff": ["1f9ce-1f3ff-200d-2640-fe0f", 46, 43, 15, ["🧎🏿‍♀️"]] },
      "1f9ce-200d-2642-fe0f": { "1f3fb": ["1f9ce-1f3fb-200d-2642-fe0f", 46, 45, 15, ["🧎🏻‍♂️"]], "1f3fc": ["1f9ce-1f3fc-200d-2642-fe0f", 46, 46, 15, ["🧎🏼‍♂️"]], "1f3fd": ["1f9ce-1f3fd-200d-2642-fe0f", 46, 47, 15, ["🧎🏽‍♂️"]], "1f3fe": ["1f9ce-1f3fe-200d-2642-fe0f", 46, 48, 15, ["🧎🏾‍♂️"]], "1f3ff": ["1f9ce-1f3ff-200d-2642-fe0f", 46, 49, 15, ["🧎🏿‍♂️"]] },
      "1f9ce": { "1f3fb": ["1f9ce-1f3fb", 46, 51, 15, ["🧎🏻"]], "1f3fc": ["1f9ce-1f3fc", 46, 52, 15, ["🧎🏼"]], "1f3fd": ["1f9ce-1f3fd", 46, 53, 15, ["🧎🏽"]], "1f3fe": ["1f9ce-1f3fe", 46, 54, 15, ["🧎🏾"]], "1f3ff": ["1f9ce-1f3ff", 46, 55, 15, ["🧎🏿"]] },
      "1f9cf-200d-2640-fe0f": { "1f3fb": ["1f9cf-1f3fb-200d-2640-fe0f", 46, 57, 15, ["🧏🏻‍♀️"]], "1f3fc": ["1f9cf-1f3fc-200d-2640-fe0f", 46, 58, 15, ["🧏🏼‍♀️"]], "1f3fd": ["1f9cf-1f3fd-200d-2640-fe0f", 46, 59, 15, ["🧏🏽‍♀️"]], "1f3fe": ["1f9cf-1f3fe-200d-2640-fe0f", 46, 60, 15, ["🧏🏾‍♀️"]], "1f3ff": ["1f9cf-1f3ff-200d-2640-fe0f", 47, 0, 15, ["🧏🏿‍♀️"]] },
      "1f9cf-200d-2642-fe0f": { "1f3fb": ["1f9cf-1f3fb-200d-2642-fe0f", 47, 2, 15, ["🧏🏻‍♂️"]], "1f3fc": ["1f9cf-1f3fc-200d-2642-fe0f", 47, 3, 15, ["🧏🏼‍♂️"]], "1f3fd": ["1f9cf-1f3fd-200d-2642-fe0f", 47, 4, 15, ["🧏🏽‍♂️"]], "1f3fe": ["1f9cf-1f3fe-200d-2642-fe0f", 47, 5, 15, ["🧏🏾‍♂️"]], "1f3ff": ["1f9cf-1f3ff-200d-2642-fe0f", 47, 6, 15, ["🧏🏿‍♂️"]] },
      "1f9cf": { "1f3fb": ["1f9cf-1f3fb", 47, 8, 15, ["🧏🏻"]], "1f3fc": ["1f9cf-1f3fc", 47, 9, 15, ["🧏🏼"]], "1f3fd": ["1f9cf-1f3fd", 47, 10, 15, ["🧏🏽"]], "1f3fe": ["1f9cf-1f3fe", 47, 11, 15, ["🧏🏾"]], "1f3ff": ["1f9cf-1f3ff", 47, 12, 15, ["🧏🏿"]] },
      "1f9d1-200d-1f33e": { "1f3fb": ["1f9d1-1f3fb-200d-1f33e", 47, 15, 15, ["🧑🏻‍🌾"]], "1f3fc": ["1f9d1-1f3fc-200d-1f33e", 47, 16, 15, ["🧑🏼‍🌾"]], "1f3fd": ["1f9d1-1f3fd-200d-1f33e", 47, 17, 15, ["🧑🏽‍🌾"]], "1f3fe": ["1f9d1-1f3fe-200d-1f33e", 47, 18, 15, ["🧑🏾‍🌾"]], "1f3ff": ["1f9d1-1f3ff-200d-1f33e", 47, 19, 15, ["🧑🏿‍🌾"]] },
      "1f9d1-200d-1f373": { "1f3fb": ["1f9d1-1f3fb-200d-1f373", 47, 21, 15, ["🧑🏻‍🍳"]], "1f3fc": ["1f9d1-1f3fc-200d-1f373", 47, 22, 15, ["🧑🏼‍🍳"]], "1f3fd": ["1f9d1-1f3fd-200d-1f373", 47, 23, 15, ["🧑🏽‍🍳"]], "1f3fe": ["1f9d1-1f3fe-200d-1f373", 47, 24, 15, ["🧑🏾‍🍳"]], "1f3ff": ["1f9d1-1f3ff-200d-1f373", 47, 25, 15, ["🧑🏿‍🍳"]] },
      "1f9d1-200d-1f37c": { "1f3fb": ["1f9d1-1f3fb-200d-1f37c", 47, 27, 15, ["🧑🏻‍🍼"]], "1f3fc": ["1f9d1-1f3fc-200d-1f37c", 47, 28, 15, ["🧑🏼‍🍼"]], "1f3fd": ["1f9d1-1f3fd-200d-1f37c", 47, 29, 15, ["🧑🏽‍🍼"]], "1f3fe": ["1f9d1-1f3fe-200d-1f37c", 47, 30, 15, ["🧑🏾‍🍼"]], "1f3ff": ["1f9d1-1f3ff-200d-1f37c", 47, 31, 15, ["🧑🏿‍🍼"]] },
      "1f9d1-200d-1f384": { "1f3fb": ["1f9d1-1f3fb-200d-1f384", 47, 33, 15, ["🧑🏻‍🎄"]], "1f3fc": ["1f9d1-1f3fc-200d-1f384", 47, 34, 15, ["🧑🏼‍🎄"]], "1f3fd": ["1f9d1-1f3fd-200d-1f384", 47, 35, 15, ["🧑🏽‍🎄"]], "1f3fe": ["1f9d1-1f3fe-200d-1f384", 47, 36, 15, ["🧑🏾‍🎄"]], "1f3ff": ["1f9d1-1f3ff-200d-1f384", 47, 37, 15, ["🧑🏿‍🎄"]] },
      "1f9d1-200d-1f393": { "1f3fb": ["1f9d1-1f3fb-200d-1f393", 47, 39, 15, ["🧑🏻‍🎓"]], "1f3fc": ["1f9d1-1f3fc-200d-1f393", 47, 40, 15, ["🧑🏼‍🎓"]], "1f3fd": ["1f9d1-1f3fd-200d-1f393", 47, 41, 15, ["🧑🏽‍🎓"]], "1f3fe": ["1f9d1-1f3fe-200d-1f393", 47, 42, 15, ["🧑🏾‍🎓"]], "1f3ff": ["1f9d1-1f3ff-200d-1f393", 47, 43, 15, ["🧑🏿‍🎓"]] },
      "1f9d1-200d-1f3a4": { "1f3fb": ["1f9d1-1f3fb-200d-1f3a4", 47, 45, 15, ["🧑🏻‍🎤"]], "1f3fc": ["1f9d1-1f3fc-200d-1f3a4", 47, 46, 15, ["🧑🏼‍🎤"]], "1f3fd": ["1f9d1-1f3fd-200d-1f3a4", 47, 47, 15, ["🧑🏽‍🎤"]], "1f3fe": ["1f9d1-1f3fe-200d-1f3a4", 47, 48, 15, ["🧑🏾‍🎤"]], "1f3ff": ["1f9d1-1f3ff-200d-1f3a4", 47, 49, 15, ["🧑🏿‍🎤"]] },
      "1f9d1-200d-1f3a8": { "1f3fb": ["1f9d1-1f3fb-200d-1f3a8", 47, 51, 15, ["🧑🏻‍🎨"]], "1f3fc": ["1f9d1-1f3fc-200d-1f3a8", 47, 52, 15, ["🧑🏼‍🎨"]], "1f3fd": ["1f9d1-1f3fd-200d-1f3a8", 47, 53, 15, ["🧑🏽‍🎨"]], "1f3fe": ["1f9d1-1f3fe-200d-1f3a8", 47, 54, 15, ["🧑🏾‍🎨"]], "1f3ff": ["1f9d1-1f3ff-200d-1f3a8", 47, 55, 15, ["🧑🏿‍🎨"]] },
      "1f9d1-200d-1f3eb": { "1f3fb": ["1f9d1-1f3fb-200d-1f3eb", 47, 57, 15, ["🧑🏻‍🏫"]], "1f3fc": ["1f9d1-1f3fc-200d-1f3eb", 47, 58, 15, ["🧑🏼‍🏫"]], "1f3fd": ["1f9d1-1f3fd-200d-1f3eb", 47, 59, 15, ["🧑🏽‍🏫"]], "1f3fe": ["1f9d1-1f3fe-200d-1f3eb", 47, 60, 15, ["🧑🏾‍🏫"]], "1f3ff": ["1f9d1-1f3ff-200d-1f3eb", 48, 0, 15, ["🧑🏿‍🏫"]] },
      "1f9d1-200d-1f3ed": { "1f3fb": ["1f9d1-1f3fb-200d-1f3ed", 48, 2, 15, ["🧑🏻‍🏭"]], "1f3fc": ["1f9d1-1f3fc-200d-1f3ed", 48, 3, 15, ["🧑🏼‍🏭"]], "1f3fd": ["1f9d1-1f3fd-200d-1f3ed", 48, 4, 15, ["🧑🏽‍🏭"]], "1f3fe": ["1f9d1-1f3fe-200d-1f3ed", 48, 5, 15, ["🧑🏾‍🏭"]], "1f3ff": ["1f9d1-1f3ff-200d-1f3ed", 48, 6, 15, ["🧑🏿‍🏭"]] },
      "1f9d1-200d-1f4bb": { "1f3fb": ["1f9d1-1f3fb-200d-1f4bb", 48, 8, 15, ["🧑🏻‍💻"]], "1f3fc": ["1f9d1-1f3fc-200d-1f4bb", 48, 9, 15, ["🧑🏼‍💻"]], "1f3fd": ["1f9d1-1f3fd-200d-1f4bb", 48, 10, 15, ["🧑🏽‍💻"]], "1f3fe": ["1f9d1-1f3fe-200d-1f4bb", 48, 11, 15, ["🧑🏾‍💻"]], "1f3ff": ["1f9d1-1f3ff-200d-1f4bb", 48, 12, 15, ["🧑🏿‍💻"]] },
      "1f9d1-200d-1f4bc": { "1f3fb": ["1f9d1-1f3fb-200d-1f4bc", 48, 14, 15, ["🧑🏻‍💼"]], "1f3fc": ["1f9d1-1f3fc-200d-1f4bc", 48, 15, 15, ["🧑🏼‍💼"]], "1f3fd": ["1f9d1-1f3fd-200d-1f4bc", 48, 16, 15, ["🧑🏽‍💼"]], "1f3fe": ["1f9d1-1f3fe-200d-1f4bc", 48, 17, 15, ["🧑🏾‍💼"]], "1f3ff": ["1f9d1-1f3ff-200d-1f4bc", 48, 18, 15, ["🧑🏿‍💼"]] },
      "1f9d1-200d-1f527": { "1f3fb": ["1f9d1-1f3fb-200d-1f527", 48, 20, 15, ["🧑🏻‍🔧"]], "1f3fc": ["1f9d1-1f3fc-200d-1f527", 48, 21, 15, ["🧑🏼‍🔧"]], "1f3fd": ["1f9d1-1f3fd-200d-1f527", 48, 22, 15, ["🧑🏽‍🔧"]], "1f3fe": ["1f9d1-1f3fe-200d-1f527", 48, 23, 15, ["🧑🏾‍🔧"]], "1f3ff": ["1f9d1-1f3ff-200d-1f527", 48, 24, 15, ["🧑🏿‍🔧"]] },
      "1f9d1-200d-1f52c": { "1f3fb": ["1f9d1-1f3fb-200d-1f52c", 48, 26, 15, ["🧑🏻‍🔬"]], "1f3fc": ["1f9d1-1f3fc-200d-1f52c", 48, 27, 15, ["🧑🏼‍🔬"]], "1f3fd": ["1f9d1-1f3fd-200d-1f52c", 48, 28, 15, ["🧑🏽‍🔬"]], "1f3fe": ["1f9d1-1f3fe-200d-1f52c", 48, 29, 15, ["🧑🏾‍🔬"]], "1f3ff": ["1f9d1-1f3ff-200d-1f52c", 48, 30, 15, ["🧑🏿‍🔬"]] },
      "1f9d1-200d-1f680": { "1f3fb": ["1f9d1-1f3fb-200d-1f680", 48, 32, 15, ["🧑🏻‍🚀"]], "1f3fc": ["1f9d1-1f3fc-200d-1f680", 48, 33, 15, ["🧑🏼‍🚀"]], "1f3fd": ["1f9d1-1f3fd-200d-1f680", 48, 34, 15, ["🧑🏽‍🚀"]], "1f3fe": ["1f9d1-1f3fe-200d-1f680", 48, 35, 15, ["🧑🏾‍🚀"]], "1f3ff": ["1f9d1-1f3ff-200d-1f680", 48, 36, 15, ["🧑🏿‍🚀"]] },
      "1f9d1-200d-1f692": { "1f3fb": ["1f9d1-1f3fb-200d-1f692", 48, 38, 15, ["🧑🏻‍🚒"]], "1f3fc": ["1f9d1-1f3fc-200d-1f692", 48, 39, 15, ["🧑🏼‍🚒"]], "1f3fd": ["1f9d1-1f3fd-200d-1f692", 48, 40, 15, ["🧑🏽‍🚒"]], "1f3fe": ["1f9d1-1f3fe-200d-1f692", 48, 41, 15, ["🧑🏾‍🚒"]], "1f3ff": ["1f9d1-1f3ff-200d-1f692", 48, 42, 15, ["🧑🏿‍🚒"]] },
      "1f9d1-200d-1f91d-200d-1f9d1": { "1f3fb-1f3fb": ["1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fb", 48, 44, 15, ["🧑🏻‍🤝‍🧑🏻"]], "1f3fb-1f3fc": ["1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fc", 48, 45, 15, ["🧑🏻‍🤝‍🧑🏼"]], "1f3fb-1f3fd": ["1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fd", 48, 46, 15, ["🧑🏻‍🤝‍🧑🏽"]], "1f3fb-1f3fe": ["1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fe", 48, 47, 15, ["🧑🏻‍🤝‍🧑🏾"]], "1f3fb-1f3ff": ["1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3ff", 48, 48, 15, ["🧑🏻‍🤝‍🧑🏿"]], "1f3fc-1f3fb": ["1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fb", 48, 49, 15, ["🧑🏼‍🤝‍🧑🏻"]], "1f3fc-1f3fc": ["1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fc", 48, 50, 15, ["🧑🏼‍🤝‍🧑🏼"]], "1f3fc-1f3fd": ["1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fd", 48, 51, 15, ["🧑🏼‍🤝‍🧑🏽"]], "1f3fc-1f3fe": ["1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fe", 48, 52, 15, ["🧑🏼‍🤝‍🧑🏾"]], "1f3fc-1f3ff": ["1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3ff", 48, 53, 15, ["🧑🏼‍🤝‍🧑🏿"]], "1f3fd-1f3fb": ["1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fb", 48, 54, 15, ["🧑🏽‍🤝‍🧑🏻"]], "1f3fd-1f3fc": ["1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fc", 48, 55, 15, ["🧑🏽‍🤝‍🧑🏼"]], "1f3fd-1f3fd": ["1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fd", 48, 56, 15, ["🧑🏽‍🤝‍🧑🏽"]], "1f3fd-1f3fe": ["1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fe", 48, 57, 15, ["🧑🏽‍🤝‍🧑🏾"]], "1f3fd-1f3ff": ["1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3ff", 48, 58, 15, ["🧑🏽‍🤝‍🧑🏿"]], "1f3fe-1f3fb": ["1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fb", 48, 59, 15, ["🧑🏾‍🤝‍🧑🏻"]], "1f3fe-1f3fc": ["1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fc", 48, 60, 15, ["🧑🏾‍🤝‍🧑🏼"]], "1f3fe-1f3fd": ["1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fd", 49, 0, 15, ["🧑🏾‍🤝‍🧑🏽"]], "1f3fe-1f3fe": ["1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fe", 49, 1, 15, ["🧑🏾‍🤝‍🧑🏾"]], "1f3fe-1f3ff": ["1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3ff", 49, 2, 15, ["🧑🏾‍🤝‍🧑🏿"]], "1f3ff-1f3fb": ["1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fb", 49, 3, 15, ["🧑🏿‍🤝‍🧑🏻"]], "1f3ff-1f3fc": ["1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fc", 49, 4, 15, ["🧑🏿‍🤝‍🧑🏼"]], "1f3ff-1f3fd": ["1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fd", 49, 5, 15, ["🧑🏿‍🤝‍🧑🏽"]], "1f3ff-1f3fe": ["1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fe", 49, 6, 15, ["🧑🏿‍🤝‍🧑🏾"]], "1f3ff-1f3ff": ["1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3ff", 49, 7, 15, ["🧑🏿‍🤝‍🧑🏿"]] },
      "1f9d1-200d-1f9af": { "1f3fb": ["1f9d1-1f3fb-200d-1f9af", 49, 9, 15, ["🧑🏻‍🦯"]], "1f3fc": ["1f9d1-1f3fc-200d-1f9af", 49, 10, 15, ["🧑🏼‍🦯"]], "1f3fd": ["1f9d1-1f3fd-200d-1f9af", 49, 11, 15, ["🧑🏽‍🦯"]], "1f3fe": ["1f9d1-1f3fe-200d-1f9af", 49, 12, 15, ["🧑🏾‍🦯"]], "1f3ff": ["1f9d1-1f3ff-200d-1f9af", 49, 13, 15, ["🧑🏿‍🦯"]] },
      "1f9d1-200d-1f9b0": { "1f3fb": ["1f9d1-1f3fb-200d-1f9b0", 49, 15, 15, ["🧑🏻‍🦰"]], "1f3fc": ["1f9d1-1f3fc-200d-1f9b0", 49, 16, 15, ["🧑🏼‍🦰"]], "1f3fd": ["1f9d1-1f3fd-200d-1f9b0", 49, 17, 15, ["🧑🏽‍🦰"]], "1f3fe": ["1f9d1-1f3fe-200d-1f9b0", 49, 18, 15, ["🧑🏾‍🦰"]], "1f3ff": ["1f9d1-1f3ff-200d-1f9b0", 49, 19, 15, ["🧑🏿‍🦰"]] },
      "1f9d1-200d-1f9b1": { "1f3fb": ["1f9d1-1f3fb-200d-1f9b1", 49, 21, 15, ["🧑🏻‍🦱"]], "1f3fc": ["1f9d1-1f3fc-200d-1f9b1", 49, 22, 15, ["🧑🏼‍🦱"]], "1f3fd": ["1f9d1-1f3fd-200d-1f9b1", 49, 23, 15, ["🧑🏽‍🦱"]], "1f3fe": ["1f9d1-1f3fe-200d-1f9b1", 49, 24, 15, ["🧑🏾‍🦱"]], "1f3ff": ["1f9d1-1f3ff-200d-1f9b1", 49, 25, 15, ["🧑🏿‍🦱"]] },
      "1f9d1-200d-1f9b2": { "1f3fb": ["1f9d1-1f3fb-200d-1f9b2", 49, 27, 15, ["🧑🏻‍🦲"]], "1f3fc": ["1f9d1-1f3fc-200d-1f9b2", 49, 28, 15, ["🧑🏼‍🦲"]], "1f3fd": ["1f9d1-1f3fd-200d-1f9b2", 49, 29, 15, ["🧑🏽‍🦲"]], "1f3fe": ["1f9d1-1f3fe-200d-1f9b2", 49, 30, 15, ["🧑🏾‍🦲"]], "1f3ff": ["1f9d1-1f3ff-200d-1f9b2", 49, 31, 15, ["🧑🏿‍🦲"]] },
      "1f9d1-200d-1f9b3": { "1f3fb": ["1f9d1-1f3fb-200d-1f9b3", 49, 33, 15, ["🧑🏻‍🦳"]], "1f3fc": ["1f9d1-1f3fc-200d-1f9b3", 49, 34, 15, ["🧑🏼‍🦳"]], "1f3fd": ["1f9d1-1f3fd-200d-1f9b3", 49, 35, 15, ["🧑🏽‍🦳"]], "1f3fe": ["1f9d1-1f3fe-200d-1f9b3", 49, 36, 15, ["🧑🏾‍🦳"]], "1f3ff": ["1f9d1-1f3ff-200d-1f9b3", 49, 37, 15, ["🧑🏿‍🦳"]] },
      "1f9d1-200d-1f9bc": { "1f3fb": ["1f9d1-1f3fb-200d-1f9bc", 49, 39, 15, ["🧑🏻‍🦼"]], "1f3fc": ["1f9d1-1f3fc-200d-1f9bc", 49, 40, 15, ["🧑🏼‍🦼"]], "1f3fd": ["1f9d1-1f3fd-200d-1f9bc", 49, 41, 15, ["🧑🏽‍🦼"]], "1f3fe": ["1f9d1-1f3fe-200d-1f9bc", 49, 42, 15, ["🧑🏾‍🦼"]], "1f3ff": ["1f9d1-1f3ff-200d-1f9bc", 49, 43, 15, ["🧑🏿‍🦼"]] },
      "1f9d1-200d-1f9bd": { "1f3fb": ["1f9d1-1f3fb-200d-1f9bd", 49, 45, 15, ["🧑🏻‍🦽"]], "1f3fc": ["1f9d1-1f3fc-200d-1f9bd", 49, 46, 15, ["🧑🏼‍🦽"]], "1f3fd": ["1f9d1-1f3fd-200d-1f9bd", 49, 47, 15, ["🧑🏽‍🦽"]], "1f3fe": ["1f9d1-1f3fe-200d-1f9bd", 49, 48, 15, ["🧑🏾‍🦽"]], "1f3ff": ["1f9d1-1f3ff-200d-1f9bd", 49, 49, 15, ["🧑🏿‍🦽"]] },
      "1f9d1-200d-2695-fe0f": { "1f3fb": ["1f9d1-1f3fb-200d-2695-fe0f", 49, 51, 15, ["🧑🏻‍⚕️"]], "1f3fc": ["1f9d1-1f3fc-200d-2695-fe0f", 49, 52, 15, ["🧑🏼‍⚕️"]], "1f3fd": ["1f9d1-1f3fd-200d-2695-fe0f", 49, 53, 15, ["🧑🏽‍⚕️"]], "1f3fe": ["1f9d1-1f3fe-200d-2695-fe0f", 49, 54, 15, ["🧑🏾‍⚕️"]], "1f3ff": ["1f9d1-1f3ff-200d-2695-fe0f", 49, 55, 15, ["🧑🏿‍⚕️"]] },
      "1f9d1-200d-2696-fe0f": { "1f3fb": ["1f9d1-1f3fb-200d-2696-fe0f", 49, 57, 15, ["🧑🏻‍⚖️"]], "1f3fc": ["1f9d1-1f3fc-200d-2696-fe0f", 49, 58, 15, ["🧑🏼‍⚖️"]], "1f3fd": ["1f9d1-1f3fd-200d-2696-fe0f", 49, 59, 15, ["🧑🏽‍⚖️"]], "1f3fe": ["1f9d1-1f3fe-200d-2696-fe0f", 49, 60, 15, ["🧑🏾‍⚖️"]], "1f3ff": ["1f9d1-1f3ff-200d-2696-fe0f", 50, 0, 15, ["🧑🏿‍⚖️"]] },
      "1f9d1-200d-2708-fe0f": { "1f3fb": ["1f9d1-1f3fb-200d-2708-fe0f", 50, 2, 15, ["🧑🏻‍✈️"]], "1f3fc": ["1f9d1-1f3fc-200d-2708-fe0f", 50, 3, 15, ["🧑🏼‍✈️"]], "1f3fd": ["1f9d1-1f3fd-200d-2708-fe0f", 50, 4, 15, ["🧑🏽‍✈️"]], "1f3fe": ["1f9d1-1f3fe-200d-2708-fe0f", 50, 5, 15, ["🧑🏾‍✈️"]], "1f3ff": ["1f9d1-1f3ff-200d-2708-fe0f", 50, 6, 15, ["🧑🏿‍✈️"]] },
      "1f9d1": { "1f3fb": ["1f9d1-1f3fb", 50, 8, 15, ["🧑🏻"]], "1f3fc": ["1f9d1-1f3fc", 50, 9, 15, ["🧑🏼"]], "1f3fd": ["1f9d1-1f3fd", 50, 10, 15, ["🧑🏽"]], "1f3fe": ["1f9d1-1f3fe", 50, 11, 15, ["🧑🏾"]], "1f3ff": ["1f9d1-1f3ff", 50, 12, 15, ["🧑🏿"]] },
      "1f9d2": { "1f3fb": ["1f9d2-1f3fb", 50, 14, 15, ["🧒🏻"]], "1f3fc": ["1f9d2-1f3fc", 50, 15, 15, ["🧒🏼"]], "1f3fd": ["1f9d2-1f3fd", 50, 16, 15, ["🧒🏽"]], "1f3fe": ["1f9d2-1f3fe", 50, 17, 15, ["🧒🏾"]], "1f3ff": ["1f9d2-1f3ff", 50, 18, 15, ["🧒🏿"]] },
      "1f9d3": { "1f3fb": ["1f9d3-1f3fb", 50, 20, 15, ["🧓🏻"]], "1f3fc": ["1f9d3-1f3fc", 50, 21, 15, ["🧓🏼"]], "1f3fd": ["1f9d3-1f3fd", 50, 22, 15, ["🧓🏽"]], "1f3fe": ["1f9d3-1f3fe", 50, 23, 15, ["🧓🏾"]], "1f3ff": ["1f9d3-1f3ff", 50, 24, 15, ["🧓🏿"]] },
      "1f9d4-200d-2640-fe0f": { "1f3fb": ["1f9d4-1f3fb-200d-2640-fe0f", 50, 26, 15, ["🧔🏻‍♀️"]], "1f3fc": ["1f9d4-1f3fc-200d-2640-fe0f", 50, 27, 15, ["🧔🏼‍♀️"]], "1f3fd": ["1f9d4-1f3fd-200d-2640-fe0f", 50, 28, 15, ["🧔🏽‍♀️"]], "1f3fe": ["1f9d4-1f3fe-200d-2640-fe0f", 50, 29, 15, ["🧔🏾‍♀️"]], "1f3ff": ["1f9d4-1f3ff-200d-2640-fe0f", 50, 30, 15, ["🧔🏿‍♀️"]] },
      "1f9d4-200d-2642-fe0f": { "1f3fb": ["1f9d4-1f3fb-200d-2642-fe0f", 50, 32, 15, ["🧔🏻‍♂️"]], "1f3fc": ["1f9d4-1f3fc-200d-2642-fe0f", 50, 33, 15, ["🧔🏼‍♂️"]], "1f3fd": ["1f9d4-1f3fd-200d-2642-fe0f", 50, 34, 15, ["🧔🏽‍♂️"]], "1f3fe": ["1f9d4-1f3fe-200d-2642-fe0f", 50, 35, 15, ["🧔🏾‍♂️"]], "1f3ff": ["1f9d4-1f3ff-200d-2642-fe0f", 50, 36, 15, ["🧔🏿‍♂️"]] },
      "1f9d4": { "1f3fb": ["1f9d4-1f3fb", 50, 38, 15, ["🧔🏻"]], "1f3fc": ["1f9d4-1f3fc", 50, 39, 15, ["🧔🏼"]], "1f3fd": ["1f9d4-1f3fd", 50, 40, 15, ["🧔🏽"]], "1f3fe": ["1f9d4-1f3fe", 50, 41, 15, ["🧔🏾"]], "1f3ff": ["1f9d4-1f3ff", 50, 42, 15, ["🧔🏿"]] },
      "1f9d5": { "1f3fb": ["1f9d5-1f3fb", 50, 44, 15, ["🧕🏻"]], "1f3fc": ["1f9d5-1f3fc", 50, 45, 15, ["🧕🏼"]], "1f3fd": ["1f9d5-1f3fd", 50, 46, 15, ["🧕🏽"]], "1f3fe": ["1f9d5-1f3fe", 50, 47, 15, ["🧕🏾"]], "1f3ff": ["1f9d5-1f3ff", 50, 48, 15, ["🧕🏿"]] },
      "1f9d6-200d-2640-fe0f": { "1f3fb": ["1f9d6-1f3fb-200d-2640-fe0f", 50, 50, 15, ["🧖🏻‍♀️"]], "1f3fc": ["1f9d6-1f3fc-200d-2640-fe0f", 50, 51, 15, ["🧖🏼‍♀️"]], "1f3fd": ["1f9d6-1f3fd-200d-2640-fe0f", 50, 52, 15, ["🧖🏽‍♀️"]], "1f3fe": ["1f9d6-1f3fe-200d-2640-fe0f", 50, 53, 15, ["🧖🏾‍♀️"]], "1f3ff": ["1f9d6-1f3ff-200d-2640-fe0f", 50, 54, 15, ["🧖🏿‍♀️"]] },
      "1f9d6-200d-2642-fe0f": { "1f3fb": ["1f9d6-1f3fb-200d-2642-fe0f", 50, 56, 15, ["🧖🏻‍♂️", "🧖🏻"]], "1f3fc": ["1f9d6-1f3fc-200d-2642-fe0f", 50, 57, 15, ["🧖🏼‍♂️", "🧖🏼"]], "1f3fd": ["1f9d6-1f3fd-200d-2642-fe0f", 50, 58, 15, ["🧖🏽‍♂️", "🧖🏽"]], "1f3fe": ["1f9d6-1f3fe-200d-2642-fe0f", 50, 59, 15, ["🧖🏾‍♂️", "🧖🏾"]], "1f3ff": ["1f9d6-1f3ff-200d-2642-fe0f", 50, 60, 15, ["🧖🏿‍♂️", "🧖🏿"]] },
      "1f9d7-200d-2640-fe0f": { "1f3fb": ["1f9d7-1f3fb-200d-2640-fe0f", 51, 7, 15, ["🧗🏻‍♀️", "🧗🏻"]], "1f3fc": ["1f9d7-1f3fc-200d-2640-fe0f", 51, 8, 15, ["🧗🏼‍♀️", "🧗🏼"]], "1f3fd": ["1f9d7-1f3fd-200d-2640-fe0f", 51, 9, 15, ["🧗🏽‍♀️", "🧗🏽"]], "1f3fe": ["1f9d7-1f3fe-200d-2640-fe0f", 51, 10, 15, ["🧗🏾‍♀️", "🧗🏾"]], "1f3ff": ["1f9d7-1f3ff-200d-2640-fe0f", 51, 11, 15, ["🧗🏿‍♀️", "🧗🏿"]] },
      "1f9d7-200d-2642-fe0f": { "1f3fb": ["1f9d7-1f3fb-200d-2642-fe0f", 51, 13, 15, ["🧗🏻‍♂️"]], "1f3fc": ["1f9d7-1f3fc-200d-2642-fe0f", 51, 14, 15, ["🧗🏼‍♂️"]], "1f3fd": ["1f9d7-1f3fd-200d-2642-fe0f", 51, 15, 15, ["🧗🏽‍♂️"]], "1f3fe": ["1f9d7-1f3fe-200d-2642-fe0f", 51, 16, 15, ["🧗🏾‍♂️"]], "1f3ff": ["1f9d7-1f3ff-200d-2642-fe0f", 51, 17, 15, ["🧗🏿‍♂️"]] },
      "1f9d8-200d-2640-fe0f": { "1f3fb": ["1f9d8-1f3fb-200d-2640-fe0f", 51, 25, 15, ["🧘🏻‍♀️", "🧘🏻"]], "1f3fc": ["1f9d8-1f3fc-200d-2640-fe0f", 51, 26, 15, ["🧘🏼‍♀️", "🧘🏼"]], "1f3fd": ["1f9d8-1f3fd-200d-2640-fe0f", 51, 27, 15, ["🧘🏽‍♀️", "🧘🏽"]], "1f3fe": ["1f9d8-1f3fe-200d-2640-fe0f", 51, 28, 15, ["🧘🏾‍♀️", "🧘🏾"]], "1f3ff": ["1f9d8-1f3ff-200d-2640-fe0f", 51, 29, 15, ["🧘🏿‍♀️", "🧘🏿"]] },
      "1f9d8-200d-2642-fe0f": { "1f3fb": ["1f9d8-1f3fb-200d-2642-fe0f", 51, 31, 15, ["🧘🏻‍♂️"]], "1f3fc": ["1f9d8-1f3fc-200d-2642-fe0f", 51, 32, 15, ["🧘🏼‍♂️"]], "1f3fd": ["1f9d8-1f3fd-200d-2642-fe0f", 51, 33, 15, ["🧘🏽‍♂️"]], "1f3fe": ["1f9d8-1f3fe-200d-2642-fe0f", 51, 34, 15, ["🧘🏾‍♂️"]], "1f3ff": ["1f9d8-1f3ff-200d-2642-fe0f", 51, 35, 15, ["🧘🏿‍♂️"]] },
      "1f9d9-200d-2640-fe0f": { "1f3fb": ["1f9d9-1f3fb-200d-2640-fe0f", 51, 43, 15, ["🧙🏻‍♀️", "🧙🏻"]], "1f3fc": ["1f9d9-1f3fc-200d-2640-fe0f", 51, 44, 15, ["🧙🏼‍♀️", "🧙🏼"]], "1f3fd": ["1f9d9-1f3fd-200d-2640-fe0f", 51, 45, 15, ["🧙🏽‍♀️", "🧙🏽"]], "1f3fe": ["1f9d9-1f3fe-200d-2640-fe0f", 51, 46, 15, ["🧙🏾‍♀️", "🧙🏾"]], "1f3ff": ["1f9d9-1f3ff-200d-2640-fe0f", 51, 47, 15, ["🧙🏿‍♀️", "🧙🏿"]] },
      "1f9d9-200d-2642-fe0f": { "1f3fb": ["1f9d9-1f3fb-200d-2642-fe0f", 51, 49, 15, ["🧙🏻‍♂️"]], "1f3fc": ["1f9d9-1f3fc-200d-2642-fe0f", 51, 50, 15, ["🧙🏼‍♂️"]], "1f3fd": ["1f9d9-1f3fd-200d-2642-fe0f", 51, 51, 15, ["🧙🏽‍♂️"]], "1f3fe": ["1f9d9-1f3fe-200d-2642-fe0f", 51, 52, 15, ["🧙🏾‍♂️"]], "1f3ff": ["1f9d9-1f3ff-200d-2642-fe0f", 51, 53, 15, ["🧙🏿‍♂️"]] },
      "1f9da-200d-2640-fe0f": { "1f3fb": ["1f9da-1f3fb-200d-2640-fe0f", 52, 0, 15, ["🧚🏻‍♀️", "🧚🏻"]], "1f3fc": ["1f9da-1f3fc-200d-2640-fe0f", 52, 1, 15, ["🧚🏼‍♀️", "🧚🏼"]], "1f3fd": ["1f9da-1f3fd-200d-2640-fe0f", 52, 2, 15, ["🧚🏽‍♀️", "🧚🏽"]], "1f3fe": ["1f9da-1f3fe-200d-2640-fe0f", 52, 3, 15, ["🧚🏾‍♀️", "🧚🏾"]], "1f3ff": ["1f9da-1f3ff-200d-2640-fe0f", 52, 4, 15, ["🧚🏿‍♀️", "🧚🏿"]] },
      "1f9da-200d-2642-fe0f": { "1f3fb": ["1f9da-1f3fb-200d-2642-fe0f", 52, 6, 15, ["🧚🏻‍♂️"]], "1f3fc": ["1f9da-1f3fc-200d-2642-fe0f", 52, 7, 15, ["🧚🏼‍♂️"]], "1f3fd": ["1f9da-1f3fd-200d-2642-fe0f", 52, 8, 15, ["🧚🏽‍♂️"]], "1f3fe": ["1f9da-1f3fe-200d-2642-fe0f", 52, 9, 15, ["🧚🏾‍♂️"]], "1f3ff": ["1f9da-1f3ff-200d-2642-fe0f", 52, 10, 15, ["🧚🏿‍♂️"]] },
      "1f9db-200d-2640-fe0f": { "1f3fb": ["1f9db-1f3fb-200d-2640-fe0f", 52, 18, 15, ["🧛🏻‍♀️", "🧛🏻"]], "1f3fc": ["1f9db-1f3fc-200d-2640-fe0f", 52, 19, 15, ["🧛🏼‍♀️", "🧛🏼"]], "1f3fd": ["1f9db-1f3fd-200d-2640-fe0f", 52, 20, 15, ["🧛🏽‍♀️", "🧛🏽"]], "1f3fe": ["1f9db-1f3fe-200d-2640-fe0f", 52, 21, 15, ["🧛🏾‍♀️", "🧛🏾"]], "1f3ff": ["1f9db-1f3ff-200d-2640-fe0f", 52, 22, 15, ["🧛🏿‍♀️", "🧛🏿"]] },
      "1f9db-200d-2642-fe0f": { "1f3fb": ["1f9db-1f3fb-200d-2642-fe0f", 52, 24, 15, ["🧛🏻‍♂️"]], "1f3fc": ["1f9db-1f3fc-200d-2642-fe0f", 52, 25, 15, ["🧛🏼‍♂️"]], "1f3fd": ["1f9db-1f3fd-200d-2642-fe0f", 52, 26, 15, ["🧛🏽‍♂️"]], "1f3fe": ["1f9db-1f3fe-200d-2642-fe0f", 52, 27, 15, ["🧛🏾‍♂️"]], "1f3ff": ["1f9db-1f3ff-200d-2642-fe0f", 52, 28, 15, ["🧛🏿‍♂️"]] },
      "1f9dc-200d-2640-fe0f": { "1f3fb": ["1f9dc-1f3fb-200d-2640-fe0f", 52, 36, 15, ["🧜🏻‍♀️"]], "1f3fc": ["1f9dc-1f3fc-200d-2640-fe0f", 52, 37, 15, ["🧜🏼‍♀️"]], "1f3fd": ["1f9dc-1f3fd-200d-2640-fe0f", 52, 38, 15, ["🧜🏽‍♀️"]], "1f3fe": ["1f9dc-1f3fe-200d-2640-fe0f", 52, 39, 15, ["🧜🏾‍♀️"]], "1f3ff": ["1f9dc-1f3ff-200d-2640-fe0f", 52, 40, 15, ["🧜🏿‍♀️"]] },
      "1f9dc-200d-2642-fe0f": { "1f3fb": ["1f9dc-1f3fb-200d-2642-fe0f", 52, 42, 15, ["🧜🏻‍♂️", "🧜🏻"]], "1f3fc": ["1f9dc-1f3fc-200d-2642-fe0f", 52, 43, 15, ["🧜🏼‍♂️", "🧜🏼"]], "1f3fd": ["1f9dc-1f3fd-200d-2642-fe0f", 52, 44, 15, ["🧜🏽‍♂️", "🧜🏽"]], "1f3fe": ["1f9dc-1f3fe-200d-2642-fe0f", 52, 45, 15, ["🧜🏾‍♂️", "🧜🏾"]], "1f3ff": ["1f9dc-1f3ff-200d-2642-fe0f", 52, 46, 15, ["🧜🏿‍♂️", "🧜🏿"]] },
      "1f9dd-200d-2640-fe0f": { "1f3fb": ["1f9dd-1f3fb-200d-2640-fe0f", 52, 54, 15, ["🧝🏻‍♀️"]], "1f3fc": ["1f9dd-1f3fc-200d-2640-fe0f", 52, 55, 15, ["🧝🏼‍♀️"]], "1f3fd": ["1f9dd-1f3fd-200d-2640-fe0f", 52, 56, 15, ["🧝🏽‍♀️"]], "1f3fe": ["1f9dd-1f3fe-200d-2640-fe0f", 52, 57, 15, ["🧝🏾‍♀️"]], "1f3ff": ["1f9dd-1f3ff-200d-2640-fe0f", 52, 58, 15, ["🧝🏿‍♀️"]] },
      "1f9dd-200d-2642-fe0f": { "1f3fb": ["1f9dd-1f3fb-200d-2642-fe0f", 52, 60, 15, ["🧝🏻‍♂️", "🧝🏻"]], "1f3fc": ["1f9dd-1f3fc-200d-2642-fe0f", 53, 0, 15, ["🧝🏼‍♂️", "🧝🏼"]], "1f3fd": ["1f9dd-1f3fd-200d-2642-fe0f", 53, 1, 15, ["🧝🏽‍♂️", "🧝🏽"]], "1f3fe": ["1f9dd-1f3fe-200d-2642-fe0f", 53, 2, 15, ["🧝🏾‍♂️", "🧝🏾"]], "1f3ff": ["1f9dd-1f3ff-200d-2642-fe0f", 53, 3, 15, ["🧝🏿‍♂️", "🧝🏿"]] },
      "1fac3": { "1f3fb": ["1fac3-1f3fb", 54, 60, 15, ["🫃🏻"]], "1f3fc": ["1fac3-1f3fc", 55, 0, 15, ["🫃🏼"]], "1f3fd": ["1fac3-1f3fd", 55, 1, 15, ["🫃🏽"]], "1f3fe": ["1fac3-1f3fe", 55, 2, 15, ["🫃🏾"]], "1f3ff": ["1fac3-1f3ff", 55, 3, 15, ["🫃🏿"]] },
      "1fac4": { "1f3fb": ["1fac4-1f3fb", 55, 5, 15, ["🫄🏻"]], "1f3fc": ["1fac4-1f3fc", 55, 6, 15, ["🫄🏼"]], "1f3fd": ["1fac4-1f3fd", 55, 7, 15, ["🫄🏽"]], "1f3fe": ["1fac4-1f3fe", 55, 8, 15, ["🫄🏾"]], "1f3ff": ["1fac4-1f3ff", 55, 9, 15, ["🫄🏿"]] },
      "1fac5": { "1f3fb": ["1fac5-1f3fb", 55, 11, 15, ["🫅🏻"]], "1f3fc": ["1fac5-1f3fc", 55, 12, 15, ["🫅🏼"]], "1f3fd": ["1fac5-1f3fd", 55, 13, 15, ["🫅🏽"]], "1f3fe": ["1fac5-1f3fe", 55, 14, 15, ["🫅🏾"]], "1f3ff": ["1fac5-1f3ff", 55, 15, 15, ["🫅🏿"]] },
      "1faf0": { "1f3fb": ["1faf0-1f3fb", 55, 40, 15, ["🫰🏻"]], "1f3fc": ["1faf0-1f3fc", 55, 41, 15, ["🫰🏼"]], "1f3fd": ["1faf0-1f3fd", 55, 42, 15, ["🫰🏽"]], "1f3fe": ["1faf0-1f3fe", 55, 43, 15, ["🫰🏾"]], "1f3ff": ["1faf0-1f3ff", 55, 44, 15, ["🫰🏿"]] },
      "1faf1": { "1f3fb": ["1faf1-1f3fb", 55, 46, 15, ["🫱🏻"]], "1f3fc": ["1faf1-1f3fc", 55, 47, 15, ["🫱🏼"]], "1f3fd": ["1faf1-1f3fd", 55, 48, 15, ["🫱🏽"]], "1f3fe": ["1faf1-1f3fe", 55, 49, 15, ["🫱🏾"]], "1f3ff": ["1faf1-1f3ff", 55, 50, 15, ["🫱🏿"]] },
      "1faf2": { "1f3fb": ["1faf2-1f3fb", 55, 52, 15, ["🫲🏻"]], "1f3fc": ["1faf2-1f3fc", 55, 53, 15, ["🫲🏼"]], "1f3fd": ["1faf2-1f3fd", 55, 54, 15, ["🫲🏽"]], "1f3fe": ["1faf2-1f3fe", 55, 55, 15, ["🫲🏾"]], "1f3ff": ["1faf2-1f3ff", 55, 56, 15, ["🫲🏿"]] },
      "1faf3": { "1f3fb": ["1faf3-1f3fb", 55, 58, 15, ["🫳🏻"]], "1f3fc": ["1faf3-1f3fc", 55, 59, 15, ["🫳🏼"]], "1f3fd": ["1faf3-1f3fd", 55, 60, 15, ["🫳🏽"]], "1f3fe": ["1faf3-1f3fe", 56, 0, 15, ["🫳🏾"]], "1f3ff": ["1faf3-1f3ff", 56, 1, 15, ["🫳🏿"]] },
      "1faf4": { "1f3fb": ["1faf4-1f3fb", 56, 3, 15, ["🫴🏻"]], "1f3fc": ["1faf4-1f3fc", 56, 4, 15, ["🫴🏼"]], "1f3fd": ["1faf4-1f3fd", 56, 5, 15, ["🫴🏽"]], "1f3fe": ["1faf4-1f3fe", 56, 6, 15, ["🫴🏾"]], "1f3ff": ["1faf4-1f3ff", 56, 7, 15, ["🫴🏿"]] },
      "1faf5": { "1f3fb": ["1faf5-1f3fb", 56, 9, 15, ["🫵🏻"]], "1f3fc": ["1faf5-1f3fc", 56, 10, 15, ["🫵🏼"]], "1f3fd": ["1faf5-1f3fd", 56, 11, 15, ["🫵🏽"]], "1f3fe": ["1faf5-1f3fe", 56, 12, 15, ["🫵🏾"]], "1f3ff": ["1faf5-1f3ff", 56, 13, 15, ["🫵🏿"]] },
      "1faf6": { "1f3fb": ["1faf6-1f3fb", 56, 15, 15, ["🫶🏻"]], "1f3fc": ["1faf6-1f3fc", 56, 16, 15, ["🫶🏼"]], "1f3fd": ["1faf6-1f3fd", 56, 17, 15, ["🫶🏽"]], "1f3fe": ["1faf6-1f3fe", 56, 18, 15, ["🫶🏾"]], "1f3ff": ["1faf6-1f3ff", 56, 19, 15, ["🫶🏿"]] },
      "1faf7": { "1f3fb": ["1faf7-1f3fb", 56, 21, 3, ["🫷🏻"]], "1f3fc": ["1faf7-1f3fc", 56, 22, 3, ["🫷🏼"]], "1f3fd": ["1faf7-1f3fd", 56, 23, 3, ["🫷🏽"]], "1f3fe": ["1faf7-1f3fe", 56, 24, 3, ["🫷🏾"]], "1f3ff": ["1faf7-1f3ff", 56, 25, 3, ["🫷🏿"]] },
      "1faf8": { "1f3fb": ["1faf8-1f3fb", 56, 27, 3, ["🫸🏻"]], "1f3fc": ["1faf8-1f3fc", 56, 28, 3, ["🫸🏼"]], "1f3fd": ["1faf8-1f3fd", 56, 29, 3, ["🫸🏽"]], "1f3fe": ["1faf8-1f3fe", 56, 30, 3, ["🫸🏾"]], "1f3ff": ["1faf8-1f3ff", 56, 31, 3, ["🫸🏿"]] },
      "261d-fe0f": { "1f3fb": ["261d-1f3fb", 57, 21, 15, ["☝🏻"]], "1f3fc": ["261d-1f3fc", 57, 22, 15, ["☝🏼"]], "1f3fd": ["261d-1f3fd", 57, 23, 15, ["☝🏽"]], "1f3fe": ["261d-1f3fe", 57, 24, 15, ["☝🏾"]], "1f3ff": ["261d-1f3ff", 57, 25, 15, ["☝🏿"]] },
      "26f9-fe0f-200d-2640-fe0f": { "1f3fb": ["26f9-1f3fb-200d-2640-fe0f", 58, 35, 15, ["⛹🏻‍♀️"]], "1f3fc": ["26f9-1f3fc-200d-2640-fe0f", 58, 36, 15, ["⛹🏼‍♀️"]], "1f3fd": ["26f9-1f3fd-200d-2640-fe0f", 58, 37, 15, ["⛹🏽‍♀️"]], "1f3fe": ["26f9-1f3fe-200d-2640-fe0f", 58, 38, 15, ["⛹🏾‍♀️"]], "1f3ff": ["26f9-1f3ff-200d-2640-fe0f", 58, 39, 15, ["⛹🏿‍♀️"]] },
      "26f9-fe0f-200d-2642-fe0f": { "1f3fb": ["26f9-1f3fb-200d-2642-fe0f", 58, 41, 15, ["⛹🏻‍♂️", "⛹🏻"]], "1f3fc": ["26f9-1f3fc-200d-2642-fe0f", 58, 42, 15, ["⛹🏼‍♂️", "⛹🏼"]], "1f3fd": ["26f9-1f3fd-200d-2642-fe0f", 58, 43, 15, ["⛹🏽‍♂️", "⛹🏽"]], "1f3fe": ["26f9-1f3fe-200d-2642-fe0f", 58, 44, 15, ["⛹🏾‍♂️", "⛹🏾"]], "1f3ff": ["26f9-1f3ff-200d-2642-fe0f", 58, 45, 15, ["⛹🏿‍♂️", "⛹🏿"]] },
      "270a": { "1f3fb": ["270a-1f3fb", 58, 59, 15, ["✊🏻"]], "1f3fc": ["270a-1f3fc", 58, 60, 15, ["✊🏼"]], "1f3fd": ["270a-1f3fd", 59, 0, 15, ["✊🏽"]], "1f3fe": ["270a-1f3fe", 59, 1, 15, ["✊🏾"]], "1f3ff": ["270a-1f3ff", 59, 2, 15, ["✊🏿"]] },
      "270b": { "1f3fb": ["270b-1f3fb", 59, 4, 15, ["✋🏻"]], "1f3fc": ["270b-1f3fc", 59, 5, 15, ["✋🏼"]], "1f3fd": ["270b-1f3fd", 59, 6, 15, ["✋🏽"]], "1f3fe": ["270b-1f3fe", 59, 7, 15, ["✋🏾"]], "1f3ff": ["270b-1f3ff", 59, 8, 15, ["✋🏿"]] },
      "270c-fe0f": { "1f3fb": ["270c-1f3fb", 59, 10, 15, ["✌🏻"]], "1f3fc": ["270c-1f3fc", 59, 11, 15, ["✌🏼"]], "1f3fd": ["270c-1f3fd", 59, 12, 15, ["✌🏽"]], "1f3fe": ["270c-1f3fe", 59, 13, 15, ["✌🏾"]], "1f3ff": ["270c-1f3ff", 59, 14, 15, ["✌🏿"]] },
      "270d-fe0f": { "1f3fb": ["270d-1f3fb", 59, 16, 15, ["✍🏻"]], "1f3fc": ["270d-1f3fc", 59, 17, 15, ["✍🏼"]], "1f3fd": ["270d-1f3fd", 59, 18, 15, ["✍🏽"]], "1f3fe": ["270d-1f3fe", 59, 19, 15, ["✍🏾"]], "1f3ff": ["270d-1f3ff", 59, 20, 15, ["✍🏿"]] }
    };
    emoji2.prototype.obsoletes_data = {
      "1f3c3-200d-2642-fe0f": ["1f3c3", 8, 26, 15],
      "1f3c3-1f3fb-200d-2642-fe0f": ["1f3c3-1f3fb", 8, 27, 15],
      "1f3c3-1f3fc-200d-2642-fe0f": ["1f3c3-1f3fc", 8, 28, 15],
      "1f3c3-1f3fd-200d-2642-fe0f": ["1f3c3-1f3fd", 8, 29, 15],
      "1f3c3-1f3fe-200d-2642-fe0f": ["1f3c3-1f3fe", 8, 30, 15],
      "1f3c3-1f3ff-200d-2642-fe0f": ["1f3c3-1f3ff", 8, 31, 15],
      "1f3c4-200d-2642-fe0f": ["1f3c4", 8, 44, 15],
      "1f3c4-1f3fb-200d-2642-fe0f": ["1f3c4-1f3fb", 8, 45, 15],
      "1f3c4-1f3fc-200d-2642-fe0f": ["1f3c4-1f3fc", 8, 46, 15],
      "1f3c4-1f3fd-200d-2642-fe0f": ["1f3c4-1f3fd", 8, 47, 15],
      "1f3c4-1f3fe-200d-2642-fe0f": ["1f3c4-1f3fe", 8, 48, 15],
      "1f3c4-1f3ff-200d-2642-fe0f": ["1f3c4-1f3ff", 8, 49, 15],
      "1f3ca-200d-2642-fe0f": ["1f3ca", 9, 11, 15],
      "1f3ca-1f3fb-200d-2642-fe0f": ["1f3ca-1f3fb", 9, 12, 15],
      "1f3ca-1f3fc-200d-2642-fe0f": ["1f3ca-1f3fc", 9, 13, 15],
      "1f3ca-1f3fd-200d-2642-fe0f": ["1f3ca-1f3fd", 9, 14, 15],
      "1f3ca-1f3fe-200d-2642-fe0f": ["1f3ca-1f3fe", 9, 15, 15],
      "1f3ca-1f3ff-200d-2642-fe0f": ["1f3ca-1f3ff", 9, 16, 15],
      "1f3cb-fe0f-200d-2642-fe0f": ["1f3cb-fe0f", 9, 29, 15],
      "1f3cb-1f3fb-200d-2642-fe0f": ["1f3cb-1f3fb", 9, 30, 15],
      "1f3cb-1f3fc-200d-2642-fe0f": ["1f3cb-1f3fc", 9, 31, 15],
      "1f3cb-1f3fd-200d-2642-fe0f": ["1f3cb-1f3fd", 9, 32, 15],
      "1f3cb-1f3fe-200d-2642-fe0f": ["1f3cb-1f3fe", 9, 33, 15],
      "1f3cb-1f3ff-200d-2642-fe0f": ["1f3cb-1f3ff", 9, 34, 15],
      "1f3cc-fe0f-200d-2642-fe0f": ["1f3cc-fe0f", 9, 47, 15],
      "1f3cc-1f3fb-200d-2642-fe0f": ["1f3cc-1f3fb", 9, 48, 15],
      "1f3cc-1f3fc-200d-2642-fe0f": ["1f3cc-1f3fc", 9, 49, 15],
      "1f3cc-1f3fd-200d-2642-fe0f": ["1f3cc-1f3fd", 9, 50, 15],
      "1f3cc-1f3fe-200d-2642-fe0f": ["1f3cc-1f3fe", 9, 51, 15],
      "1f3cc-1f3ff-200d-2642-fe0f": ["1f3cc-1f3ff", 9, 52, 15],
      "1f468-200d-1f469-200d-1f466": ["1f46a", 21, 40, 15],
      "1f46e-200d-2642-fe0f": ["1f46e", 23, 9, 15],
      "1f46e-1f3fb-200d-2642-fe0f": ["1f46e-1f3fb", 23, 10, 15],
      "1f46e-1f3fc-200d-2642-fe0f": ["1f46e-1f3fc", 23, 11, 15],
      "1f46e-1f3fd-200d-2642-fe0f": ["1f46e-1f3fd", 23, 12, 15],
      "1f46e-1f3fe-200d-2642-fe0f": ["1f46e-1f3fe", 23, 13, 15],
      "1f46e-1f3ff-200d-2642-fe0f": ["1f46e-1f3ff", 23, 14, 15],
      "1f46f-200d-2640-fe0f": ["1f46f", 23, 17, 15],
      "1f471-200d-2642-fe0f": ["1f471", 23, 48, 15],
      "1f471-1f3fb-200d-2642-fe0f": ["1f471-1f3fb", 23, 49, 15],
      "1f471-1f3fc-200d-2642-fe0f": ["1f471-1f3fc", 23, 50, 15],
      "1f471-1f3fd-200d-2642-fe0f": ["1f471-1f3fd", 23, 51, 15],
      "1f471-1f3fe-200d-2642-fe0f": ["1f471-1f3fe", 23, 52, 15],
      "1f471-1f3ff-200d-2642-fe0f": ["1f471-1f3ff", 23, 53, 15],
      "1f473-200d-2642-fe0f": ["1f473", 24, 11, 15],
      "1f473-1f3fb-200d-2642-fe0f": ["1f473-1f3fb", 24, 12, 15],
      "1f473-1f3fc-200d-2642-fe0f": ["1f473-1f3fc", 24, 13, 15],
      "1f473-1f3fd-200d-2642-fe0f": ["1f473-1f3fd", 24, 14, 15],
      "1f473-1f3fe-200d-2642-fe0f": ["1f473-1f3fe", 24, 15, 15],
      "1f473-1f3ff-200d-2642-fe0f": ["1f473-1f3ff", 24, 16, 15],
      "1f477-200d-2642-fe0f": ["1f477", 24, 47, 15],
      "1f477-1f3fb-200d-2642-fe0f": ["1f477-1f3fb", 24, 48, 15],
      "1f477-1f3fc-200d-2642-fe0f": ["1f477-1f3fc", 24, 49, 15],
      "1f477-1f3fd-200d-2642-fe0f": ["1f477-1f3fd", 24, 50, 15],
      "1f477-1f3fe-200d-2642-fe0f": ["1f477-1f3fe", 24, 51, 15],
      "1f477-1f3ff-200d-2642-fe0f": ["1f477-1f3ff", 24, 52, 15],
      "1f481-200d-2640-fe0f": ["1f481", 25, 23, 15],
      "1f481-1f3fb-200d-2640-fe0f": ["1f481-1f3fb", 25, 24, 15],
      "1f481-1f3fc-200d-2640-fe0f": ["1f481-1f3fc", 25, 25, 15],
      "1f481-1f3fd-200d-2640-fe0f": ["1f481-1f3fd", 25, 26, 15],
      "1f481-1f3fe-200d-2640-fe0f": ["1f481-1f3fe", 25, 27, 15],
      "1f481-1f3ff-200d-2640-fe0f": ["1f481-1f3ff", 25, 28, 15],
      "1f482-200d-2642-fe0f": ["1f482", 25, 41, 15],
      "1f482-1f3fb-200d-2642-fe0f": ["1f482-1f3fb", 25, 42, 15],
      "1f482-1f3fc-200d-2642-fe0f": ["1f482-1f3fc", 25, 43, 15],
      "1f482-1f3fd-200d-2642-fe0f": ["1f482-1f3fd", 25, 44, 15],
      "1f482-1f3fe-200d-2642-fe0f": ["1f482-1f3fe", 25, 45, 15],
      "1f482-1f3ff-200d-2642-fe0f": ["1f482-1f3ff", 25, 46, 15],
      "1f486-200d-2640-fe0f": ["1f486", 26, 11, 15],
      "1f486-1f3fb-200d-2640-fe0f": ["1f486-1f3fb", 26, 12, 15],
      "1f486-1f3fc-200d-2640-fe0f": ["1f486-1f3fc", 26, 13, 15],
      "1f486-1f3fd-200d-2640-fe0f": ["1f486-1f3fd", 26, 14, 15],
      "1f486-1f3fe-200d-2640-fe0f": ["1f486-1f3fe", 26, 15, 15],
      "1f486-1f3ff-200d-2640-fe0f": ["1f486-1f3ff", 26, 16, 15],
      "1f487-200d-2640-fe0f": ["1f487", 26, 29, 15],
      "1f487-1f3fb-200d-2640-fe0f": ["1f487-1f3fb", 26, 30, 15],
      "1f487-1f3fc-200d-2640-fe0f": ["1f487-1f3fc", 26, 31, 15],
      "1f487-1f3fd-200d-2640-fe0f": ["1f487-1f3fd", 26, 32, 15],
      "1f487-1f3fe-200d-2640-fe0f": ["1f487-1f3fe", 26, 33, 15],
      "1f487-1f3ff-200d-2640-fe0f": ["1f487-1f3ff", 26, 34, 15],
      "1f575-fe0f-200d-2642-fe0f": ["1f575-fe0f", 31, 17, 15],
      "1f575-1f3fb-200d-2642-fe0f": ["1f575-1f3fb", 31, 18, 15],
      "1f575-1f3fc-200d-2642-fe0f": ["1f575-1f3fc", 31, 19, 15],
      "1f575-1f3fd-200d-2642-fe0f": ["1f575-1f3fd", 31, 20, 15],
      "1f575-1f3fe-200d-2642-fe0f": ["1f575-1f3fe", 31, 21, 15],
      "1f575-1f3ff-200d-2642-fe0f": ["1f575-1f3ff", 31, 22, 15],
      "1f645-200d-2640-fe0f": ["1f645", 33, 44, 15],
      "1f645-1f3fb-200d-2640-fe0f": ["1f645-1f3fb", 33, 45, 15],
      "1f645-1f3fc-200d-2640-fe0f": ["1f645-1f3fc", 33, 46, 15],
      "1f645-1f3fd-200d-2640-fe0f": ["1f645-1f3fd", 33, 47, 15],
      "1f645-1f3fe-200d-2640-fe0f": ["1f645-1f3fe", 33, 48, 15],
      "1f645-1f3ff-200d-2640-fe0f": ["1f645-1f3ff", 33, 49, 15],
      "1f646-200d-2640-fe0f": ["1f646", 34, 1, 15],
      "1f646-1f3fb-200d-2640-fe0f": ["1f646-1f3fb", 34, 2, 15],
      "1f646-1f3fc-200d-2640-fe0f": ["1f646-1f3fc", 34, 3, 15],
      "1f646-1f3fd-200d-2640-fe0f": ["1f646-1f3fd", 34, 4, 15],
      "1f646-1f3fe-200d-2640-fe0f": ["1f646-1f3fe", 34, 5, 15],
      "1f646-1f3ff-200d-2640-fe0f": ["1f646-1f3ff", 34, 6, 15],
      "1f64b-200d-2640-fe0f": ["1f64b", 34, 40, 15],
      "1f64b-1f3fb-200d-2640-fe0f": ["1f64b-1f3fb", 34, 41, 15],
      "1f64b-1f3fc-200d-2640-fe0f": ["1f64b-1f3fc", 34, 42, 15],
      "1f64b-1f3fd-200d-2640-fe0f": ["1f64b-1f3fd", 34, 43, 15],
      "1f64b-1f3fe-200d-2640-fe0f": ["1f64b-1f3fe", 34, 44, 15],
      "1f64b-1f3ff-200d-2640-fe0f": ["1f64b-1f3ff", 34, 45, 15],
      "1f64d-200d-2640-fe0f": ["1f64d", 35, 3, 15],
      "1f64d-1f3fb-200d-2640-fe0f": ["1f64d-1f3fb", 35, 4, 15],
      "1f64d-1f3fc-200d-2640-fe0f": ["1f64d-1f3fc", 35, 5, 15],
      "1f64d-1f3fd-200d-2640-fe0f": ["1f64d-1f3fd", 35, 6, 15],
      "1f64d-1f3fe-200d-2640-fe0f": ["1f64d-1f3fe", 35, 7, 15],
      "1f64d-1f3ff-200d-2640-fe0f": ["1f64d-1f3ff", 35, 8, 15],
      "1f64e-200d-2640-fe0f": ["1f64e", 35, 21, 15],
      "1f64e-1f3fb-200d-2640-fe0f": ["1f64e-1f3fb", 35, 22, 15],
      "1f64e-1f3fc-200d-2640-fe0f": ["1f64e-1f3fc", 35, 23, 15],
      "1f64e-1f3fd-200d-2640-fe0f": ["1f64e-1f3fd", 35, 24, 15],
      "1f64e-1f3fe-200d-2640-fe0f": ["1f64e-1f3fe", 35, 25, 15],
      "1f64e-1f3ff-200d-2640-fe0f": ["1f64e-1f3ff", 35, 26, 15],
      "1f6a3-200d-2642-fe0f": ["1f6a3", 36, 19, 15],
      "1f6a3-1f3fb-200d-2642-fe0f": ["1f6a3-1f3fb", 36, 20, 15],
      "1f6a3-1f3fc-200d-2642-fe0f": ["1f6a3-1f3fc", 36, 21, 15],
      "1f6a3-1f3fd-200d-2642-fe0f": ["1f6a3-1f3fd", 36, 22, 15],
      "1f6a3-1f3fe-200d-2642-fe0f": ["1f6a3-1f3fe", 36, 23, 15],
      "1f6a3-1f3ff-200d-2642-fe0f": ["1f6a3-1f3ff", 36, 24, 15],
      "1f6b4-200d-2642-fe0f": ["1f6b4", 36, 53, 15],
      "1f6b4-1f3fb-200d-2642-fe0f": ["1f6b4-1f3fb", 36, 54, 15],
      "1f6b4-1f3fc-200d-2642-fe0f": ["1f6b4-1f3fc", 36, 55, 15],
      "1f6b4-1f3fd-200d-2642-fe0f": ["1f6b4-1f3fd", 36, 56, 15],
      "1f6b4-1f3fe-200d-2642-fe0f": ["1f6b4-1f3fe", 36, 57, 15],
      "1f6b4-1f3ff-200d-2642-fe0f": ["1f6b4-1f3ff", 36, 58, 15],
      "1f6b5-200d-2642-fe0f": ["1f6b5", 37, 10, 15],
      "1f6b5-1f3fb-200d-2642-fe0f": ["1f6b5-1f3fb", 37, 11, 15],
      "1f6b5-1f3fc-200d-2642-fe0f": ["1f6b5-1f3fc", 37, 12, 15],
      "1f6b5-1f3fd-200d-2642-fe0f": ["1f6b5-1f3fd", 37, 13, 15],
      "1f6b5-1f3fe-200d-2642-fe0f": ["1f6b5-1f3fe", 37, 14, 15],
      "1f6b5-1f3ff-200d-2642-fe0f": ["1f6b5-1f3ff", 37, 15, 15],
      "1f6b6-200d-2642-fe0f": ["1f6b6", 37, 28, 15],
      "1f6b6-1f3fb-200d-2642-fe0f": ["1f6b6-1f3fb", 37, 29, 15],
      "1f6b6-1f3fc-200d-2642-fe0f": ["1f6b6-1f3fc", 37, 30, 15],
      "1f6b6-1f3fd-200d-2642-fe0f": ["1f6b6-1f3fd", 37, 31, 15],
      "1f6b6-1f3fe-200d-2642-fe0f": ["1f6b6-1f3fe", 37, 32, 15],
      "1f6b6-1f3ff-200d-2642-fe0f": ["1f6b6-1f3ff", 37, 33, 15],
      "1f9d6-200d-2642-fe0f": ["1f9d6", 51, 0, 15],
      "1f9d6-1f3fb-200d-2642-fe0f": ["1f9d6-1f3fb", 51, 1, 15],
      "1f9d6-1f3fc-200d-2642-fe0f": ["1f9d6-1f3fc", 51, 2, 15],
      "1f9d6-1f3fd-200d-2642-fe0f": ["1f9d6-1f3fd", 51, 3, 15],
      "1f9d6-1f3fe-200d-2642-fe0f": ["1f9d6-1f3fe", 51, 4, 15],
      "1f9d6-1f3ff-200d-2642-fe0f": ["1f9d6-1f3ff", 51, 5, 15],
      "1f9d7-200d-2640-fe0f": ["1f9d7", 51, 18, 15],
      "1f9d7-1f3fb-200d-2640-fe0f": ["1f9d7-1f3fb", 51, 19, 15],
      "1f9d7-1f3fc-200d-2640-fe0f": ["1f9d7-1f3fc", 51, 20, 15],
      "1f9d7-1f3fd-200d-2640-fe0f": ["1f9d7-1f3fd", 51, 21, 15],
      "1f9d7-1f3fe-200d-2640-fe0f": ["1f9d7-1f3fe", 51, 22, 15],
      "1f9d7-1f3ff-200d-2640-fe0f": ["1f9d7-1f3ff", 51, 23, 15],
      "1f9d8-200d-2640-fe0f": ["1f9d8", 51, 36, 15],
      "1f9d8-1f3fb-200d-2640-fe0f": ["1f9d8-1f3fb", 51, 37, 15],
      "1f9d8-1f3fc-200d-2640-fe0f": ["1f9d8-1f3fc", 51, 38, 15],
      "1f9d8-1f3fd-200d-2640-fe0f": ["1f9d8-1f3fd", 51, 39, 15],
      "1f9d8-1f3fe-200d-2640-fe0f": ["1f9d8-1f3fe", 51, 40, 15],
      "1f9d8-1f3ff-200d-2640-fe0f": ["1f9d8-1f3ff", 51, 41, 15],
      "1f9d9-200d-2640-fe0f": ["1f9d9", 51, 54, 15],
      "1f9d9-1f3fb-200d-2640-fe0f": ["1f9d9-1f3fb", 51, 55, 15],
      "1f9d9-1f3fc-200d-2640-fe0f": ["1f9d9-1f3fc", 51, 56, 15],
      "1f9d9-1f3fd-200d-2640-fe0f": ["1f9d9-1f3fd", 51, 57, 15],
      "1f9d9-1f3fe-200d-2640-fe0f": ["1f9d9-1f3fe", 51, 58, 15],
      "1f9d9-1f3ff-200d-2640-fe0f": ["1f9d9-1f3ff", 51, 59, 15],
      "1f9da-200d-2640-fe0f": ["1f9da", 52, 11, 15],
      "1f9da-1f3fb-200d-2640-fe0f": ["1f9da-1f3fb", 52, 12, 15],
      "1f9da-1f3fc-200d-2640-fe0f": ["1f9da-1f3fc", 52, 13, 15],
      "1f9da-1f3fd-200d-2640-fe0f": ["1f9da-1f3fd", 52, 14, 15],
      "1f9da-1f3fe-200d-2640-fe0f": ["1f9da-1f3fe", 52, 15, 15],
      "1f9da-1f3ff-200d-2640-fe0f": ["1f9da-1f3ff", 52, 16, 15],
      "1f9db-200d-2640-fe0f": ["1f9db", 52, 29, 15],
      "1f9db-1f3fb-200d-2640-fe0f": ["1f9db-1f3fb", 52, 30, 15],
      "1f9db-1f3fc-200d-2640-fe0f": ["1f9db-1f3fc", 52, 31, 15],
      "1f9db-1f3fd-200d-2640-fe0f": ["1f9db-1f3fd", 52, 32, 15],
      "1f9db-1f3fe-200d-2640-fe0f": ["1f9db-1f3fe", 52, 33, 15],
      "1f9db-1f3ff-200d-2640-fe0f": ["1f9db-1f3ff", 52, 34, 15],
      "1f9dc-200d-2642-fe0f": ["1f9dc", 52, 47, 15],
      "1f9dc-1f3fb-200d-2642-fe0f": ["1f9dc-1f3fb", 52, 48, 15],
      "1f9dc-1f3fc-200d-2642-fe0f": ["1f9dc-1f3fc", 52, 49, 15],
      "1f9dc-1f3fd-200d-2642-fe0f": ["1f9dc-1f3fd", 52, 50, 15],
      "1f9dc-1f3fe-200d-2642-fe0f": ["1f9dc-1f3fe", 52, 51, 15],
      "1f9dc-1f3ff-200d-2642-fe0f": ["1f9dc-1f3ff", 52, 52, 15],
      "1f9dd-200d-2642-fe0f": ["1f9dd", 53, 4, 15],
      "1f9dd-1f3fb-200d-2642-fe0f": ["1f9dd-1f3fb", 53, 5, 15],
      "1f9dd-1f3fc-200d-2642-fe0f": ["1f9dd-1f3fc", 53, 6, 15],
      "1f9dd-1f3fd-200d-2642-fe0f": ["1f9dd-1f3fd", 53, 7, 15],
      "1f9dd-1f3fe-200d-2642-fe0f": ["1f9dd-1f3fe", 53, 8, 15],
      "1f9dd-1f3ff-200d-2642-fe0f": ["1f9dd-1f3ff", 53, 9, 15],
      "1f9de-200d-2642-fe0f": ["1f9de", 53, 12, 15],
      "1f9df-200d-2642-fe0f": ["1f9df", 53, 15, 15],
      "26f9-fe0f-200d-2642-fe0f": ["26f9-fe0f", 58, 46, 15],
      "26f9-1f3fb-200d-2642-fe0f": ["26f9-1f3fb", 58, 47, 15],
      "26f9-1f3fc-200d-2642-fe0f": ["26f9-1f3fc", 58, 48, 15],
      "26f9-1f3fd-200d-2642-fe0f": ["26f9-1f3fd", 58, 49, 15],
      "26f9-1f3fe-200d-2642-fe0f": ["26f9-1f3fe", 58, 50, 15],
      "26f9-1f3ff-200d-2642-fe0f": ["26f9-1f3ff", 58, 51, 15]
    };
    {
      if (module.exports) {
        exports = module.exports = emoji2;
      }
      exports.EmojiConvertor = emoji2;
    }
  }).call(/* @__PURE__ */ function() {
    return this || (typeof window !== "undefined" ? window : commonjsGlobal);
  }());
})(emoji, emoji.exports);
var emojiExports = emoji.exports;
const EmojiConvertor = /* @__PURE__ */ getDefaultExportFromCjs(emojiExports);
const emojiData = [
  {
    name: "People",
    emojis: [
      "😄",
      "😃",
      "😀",
      "😊",
      "😉",
      "😍",
      "😘",
      "😚",
      "😗",
      "😙",
      "😜",
      "😝",
      "😛",
      "😳",
      "😁",
      "😔",
      "😌",
      "😒",
      "😞",
      "😣",
      "😢",
      "😂",
      "😭",
      "😪",
      "😥",
      "😰",
      "😅",
      "😓",
      "😩",
      "😫",
      "😨",
      "😱",
      "😠",
      "😡",
      "😤",
      "😖",
      "😆",
      "😋",
      "😷",
      "😎",
      "😴",
      "😵",
      "😲",
      "😟",
      "😦",
      "😧",
      "👿",
      "😮",
      "😬",
      "😐",
      "😕",
      "😯",
      "😏",
      "😑",
      "👲",
      "👳",
      "👮",
      "👷",
      "💂",
      "👶",
      "👦",
      "👧",
      "👨",
      "👩",
      "👴",
      "👵",
      "👱",
      "👼",
      "👸",
      "😺",
      "😸",
      "😻",
      "😽",
      "😼",
      "🙀",
      "😿",
      "😹",
      "😾",
      "👹",
      "👺",
      "🙈",
      "🙉",
      "🙊",
      "💀",
      "👽",
      "💩",
      "🔥",
      "✨",
      "🌟",
      "💫",
      "💥",
      "💢",
      "💦",
      "💧",
      "💤",
      "💨",
      "👂",
      "👀",
      "👃",
      "👅",
      "👄",
      "👍",
      "👎",
      "👌",
      "👊",
      "✊",
      "👋",
      "✋",
      "👐",
      "👆",
      "👇",
      "👉",
      "👈",
      "🙌",
      "🙏",
      "👏",
      "💪",
      "🚶",
      "🏃",
      "💃",
      "👫",
      "👪",
      "💏",
      "💑",
      "👯",
      "🙆",
      "🙅",
      "💁",
      "🙋",
      "💆",
      "💇",
      "💅",
      "👰",
      "🙎",
      "🙍",
      "🙇",
      "🎩",
      "👑",
      "👒",
      "👟",
      "👞",
      "👡",
      "👠",
      "👢",
      "👕",
      "👔",
      "👚",
      "👗",
      "🎽",
      "👖",
      "👘",
      "👙",
      "💼",
      "👜",
      "👝",
      "👛",
      "👓",
      "🎀",
      "🌂",
      "💄",
      "💛",
      "💙",
      "💜",
      "💚",
      "💔",
      "💗",
      "💓",
      "💕",
      "💖",
      "💞",
      "💘",
      "💌",
      "💋",
      "💍",
      "💎",
      "👤",
      "💬",
      "👣"
    ]
  },
  {
    name: "Nature",
    emojis: [
      "🐶",
      "🐺",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🐸",
      "🐯",
      "🐨",
      "🐻",
      "🐷",
      "🐽",
      "🐮",
      "🐗",
      "🐵",
      "🐒",
      "🐴",
      "🐑",
      "🐘",
      "🐼",
      "🐧",
      "🐦",
      "🐤",
      "🐥",
      "🐣",
      "🐔",
      "🐍",
      "🐢",
      "🐛",
      "🐝",
      "🐜",
      "🐞",
      "🐌",
      "🐙",
      "🐚",
      "🐠",
      "🐟",
      "🐬",
      "🐳",
      "🐎",
      "🐲",
      "🐡",
      "🐫",
      "🐩",
      "🐾",
      "💐",
      "🌸",
      "🌷",
      "🍀",
      "🌹",
      "🌻",
      "🌺",
      "🍁",
      "🍃",
      "🍂",
      "🌿",
      "🌾",
      "🍄",
      "🌵",
      "🌴",
      "🌰",
      "🌱",
      "🌼",
      "🌑",
      "🌓",
      "🌔",
      "🌕",
      "🌛",
      "🌙",
      "🌏",
      "🌋",
      "🌌",
      "🌠",
      "⛅",
      "⛄",
      "🌀",
      "🌁",
      "🌈",
      "🌊"
    ]
  },
  {
    name: "Objects",
    emojis: [
      "🎍",
      "💝",
      "🎎",
      "🎒",
      "🎓",
      "🎏",
      "🎆",
      "🎇",
      "🎐",
      "🎑",
      "🎃",
      "👻",
      "🎅",
      "🎄",
      "🎁",
      "🎋",
      "🎉",
      "🎊",
      "🎈",
      "🎌",
      "🔮",
      "🎥",
      "📷",
      "📹",
      "📼",
      "💿",
      "📀",
      "💽",
      "💾",
      "💻",
      "📱",
      "📞",
      "📟",
      "📠",
      "📡",
      "📺",
      "📻",
      "🔊",
      "🔔",
      "📢",
      "📣",
      "⏳",
      "⌛",
      "⏰",
      "⌚",
      "🔓",
      "🔒",
      "🔏",
      "🔐",
      "🔑",
      "🔎",
      "💡",
      "🔦",
      "🔌",
      "🔋",
      "🔍",
      "🛀",
      "🚽",
      "🔧",
      "🔩",
      "🔨",
      "🚪",
      "🚬",
      "💣",
      "🔫",
      "🔪",
      "💊",
      "💉",
      "💰",
      "💴",
      "💵",
      "💳",
      "💸",
      "📲",
      "📧",
      "📥",
      "📤",
      "📩",
      "📨",
      "📫",
      "📪",
      "📮",
      "📦",
      "📝",
      "📄",
      "📃",
      "📑",
      "📊",
      "📈",
      "📉",
      "📜",
      "📋",
      "📅",
      "📆",
      "📇",
      "📁",
      "📂",
      "📌",
      "📎",
      "📏",
      "📐",
      "📕",
      "📗",
      "📘",
      "📙",
      "📓",
      "📔",
      "📒",
      "📚",
      "📖",
      "🔖",
      "📛",
      "📰",
      "🎨",
      "🎬",
      "🎤",
      "🎧",
      "🎼",
      "🎵",
      "🎶",
      "🎹",
      "🎻",
      "🎺",
      "🎷",
      "🎸",
      "👾",
      "🎮",
      "🃏",
      "🎴",
      "🀄",
      "🎲",
      "🎯",
      "🏈",
      "🏀",
      "⚽",
      "⚾",
      "🎾",
      "🎱",
      "🎳",
      "⛳",
      "🏁",
      "🏆",
      "🎿",
      "🏂",
      "🏊",
      "🏄",
      "🎣",
      "🍵",
      "🍶",
      "🍺",
      "🍻",
      "🍸",
      "🍹",
      "🍷",
      "🍴",
      "🍕",
      "🍔",
      "🍟",
      "🍗",
      "🍖",
      "🍝",
      "🍛",
      "🍤",
      "🍱",
      "🍣",
      "🍥",
      "🍙",
      "🍘",
      "🍚",
      "🍜",
      "🍲",
      "🍢",
      "🍡",
      "🍳",
      "🍞",
      "🍩",
      "🍮",
      "🍦",
      "🍨",
      "🍧",
      "🎂",
      "🍰",
      "🍪",
      "🍫",
      "🍬",
      "🍭",
      "🍯",
      "🍎",
      "🍏",
      "🍊",
      "🍒",
      "🍇",
      "🍉",
      "🍓",
      "🍑",
      "🍈",
      "🍌",
      "🍍",
      "🍠",
      "🍆",
      "🍅",
      "🌽"
    ]
  },
  {
    name: "Places",
    emojis: [
      "🏠",
      "🏡",
      "🏫",
      "🏢",
      "🏣",
      "🏥",
      "🏦",
      "🏪",
      "🏩",
      "🏨",
      "💒",
      "⛪",
      "🏬",
      "🌇",
      "🌆",
      "🏯",
      "🏰",
      "⛺",
      "🏭",
      "🗼",
      "🗾",
      "🗻",
      "🌄",
      "🌅",
      "🌃",
      "🗽",
      "🌉",
      "🎠",
      "🎡",
      "⛲",
      "🎢",
      "🚢",
      "⛵",
      "🚤",
      "🚀",
      "💺",
      "🚉",
      "🚄",
      "🚅",
      "🚇",
      "🚃",
      "🚌",
      "🚙",
      "🚗",
      "🚕",
      "🚚",
      "🚨",
      "🚓",
      "🚒",
      "🚑",
      "🚲",
      "💈",
      "🚏",
      "🎫",
      "🚥",
      "🚧",
      "🔰",
      "⛽",
      "🏮",
      "🎰",
      "🗿",
      "🎪",
      "🎭",
      "📍",
      "🚩"
    ]
  },
  {
    name: "Symbols",
    emojis: [
      "🔟",
      "🔢",
      "🔣",
      "🔠",
      "🔡",
      "🔤",
      "🔼",
      "🔽",
      "⏪",
      "⏩",
      "⏫",
      "⏬",
      "🆗",
      "🆕",
      "🆙",
      "🆒",
      "🆓",
      "🆖",
      "📶",
      "🎦",
      "🈁",
      "🈯",
      "🈳",
      "🈵",
      "🈴",
      "🈲",
      "🉐",
      "🈹",
      "🈺",
      "🈶",
      "🈚",
      "🚻",
      "🚹",
      "🚺",
      "🚼",
      "🚾",
      "🚭",
      "🈸",
      "🉑",
      "🆑",
      "🆘",
      "🆔",
      "🚫",
      "🔞",
      "⛔",
      "❎",
      "✅",
      "💟",
      "🆚",
      "📳",
      "📴",
      "🆎",
      "💠",
      "⛎",
      "🔯",
      "🏧",
      "💹",
      "💲",
      "💱",
      "❌",
      "❗",
      "❓",
      "❕",
      "❔",
      "⭕",
      "🔝",
      "🔚",
      "🔙",
      "🔛",
      "🔜",
      "🔃",
      "🕛",
      "🕐",
      "🕑",
      "🕒",
      "🕓",
      "🕔",
      "🕕",
      "🕖",
      "🕗",
      "🕘",
      "🕙",
      "🕚",
      "➕",
      "➖",
      "➗",
      "💮",
      "💯",
      "🔘",
      "🔗",
      "➰",
      "🔱",
      "🔺",
      "🔲",
      "🔳",
      "🔴",
      "🔵",
      "🔻",
      "⬜",
      "⬛",
      "🔶",
      "🔷",
      "🔸",
      "🔹"
    ]
  }
];
const _sfc_main$c = {
  props: {
    onBlur: {
      type: Function,
      required: true
    },
    onEmojiPicked: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      emojiData,
      emojiConvertor: new EmojiConvertor()
    };
  },
  mounted() {
    const elem = this.$refs.domNode;
    elem.style.opacity = 0;
    window.requestAnimationFrame(() => {
      elem.style.transition = "opacity 350ms";
      elem.style.opacity = 1;
    });
    this.$refs.domNode.focus();
    this.emojiConvertor.init_env();
  },
  methods: {
    emojiClicked(emoji2) {
      this.onEmojiPicked(emoji2);
      this.$refs.domNode.blur();
    }
  }
};
const _hoisted_1$b = { class: "sc-emoji-picker--content" };
const _hoisted_2$5 = { class: "sc-emoji-picker--category-title" };
const _hoisted_3$4 = ["onClick"];
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "domNode",
    tabIndex: "0",
    class: "sc-emoji-picker",
    onBlur: _cache[0] || (_cache[0] = (...args) => $props.onBlur && $props.onBlur(...args))
  }, [
    createBaseVNode("div", _hoisted_1$b, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($data.emojiData, (category) => {
        return openBlock(), createElementBlock("div", {
          key: category.name,
          class: "sc-emoji-picker--category"
        }, [
          createBaseVNode("div", _hoisted_2$5, toDisplayString(category.name), 1),
          (openBlock(true), createElementBlock(Fragment, null, renderList(category.emojis, (emoji2) => {
            return openBlock(), createElementBlock("span", {
              key: emoji2,
              class: "sc-emoji-picker--emoji",
              onClick: ($event) => $options.emojiClicked(emoji2)
            }, toDisplayString(emoji2), 9, _hoisted_3$4);
          }), 128))
        ]);
      }), 128))
    ])
  ], 544);
}
const EmojiPicker = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b]]);
const _sfc_main$b = {
  components: {
    EmojiPicker
  },
  props: {
    onEmojiPicked: {
      type: Function,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isActive: false
    };
  },
  methods: {
    _openPicker(e) {
      this.isActive = !this.isActive;
    },
    _handlePickerBlur() {
      this.isActive = false;
    }
  }
};
const _hoisted_1$a = { class: "sc-user-input--picker-wrapper" };
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_EmojiPicker = resolveComponent("EmojiPicker");
  return openBlock(), createElementBlock("div", _hoisted_1$a, [
    $data.isActive ? (openBlock(), createBlock(_component_EmojiPicker, {
      key: 0,
      "on-emoji-picked": $props.onEmojiPicked,
      "on-blur": $options._handlePickerBlur
    }, null, 8, ["on-emoji-picked", "on-blur"])) : createCommentVNode("", true),
    createBaseVNode("button", {
      class: "sc-user-input--emoji-icon-wrapper",
      onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options._openPicker && $options._openPicker(...args), ["prevent"]))
    }, [
      (openBlock(), createElementBlock("svg", {
        class: normalizeClass(["sc-user-input--emoji-icon", { active: $data.isActive }]),
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 37.4 37.4"
      }, [
        createBaseVNode("path", {
          style: normalizeStyle({ fill: $props.color }),
          d: "M18.7 37.4C8.39 37.4 0 29 0 18.7 0 8.39 8.39 0 18.7 0 29 0 37.4 8.39 37.4 18.7c0 10.3-8.4 18.7-18.7 18.7zm0-35.4C9.49 2 2 9.49 2 18.7c0 9.2 7.49 16.7 16.7 16.7 9.2 0 16.7-7.5 16.7-16.7C35.4 9.49 27.9 2 18.7 2z"
        }, null, 4),
        createBaseVNode("circle", {
          style: normalizeStyle({ fill: $props.color }),
          cx: "12.38",
          cy: "14.36",
          r: "1.94"
        }, null, 4),
        createBaseVNode("circle", {
          style: normalizeStyle({ fill: $props.color }),
          cx: "24.37",
          cy: "14.41",
          r: "1.99"
        }, null, 4),
        createBaseVNode("path", {
          style: normalizeStyle({ fill: $props.color }),
          d: "M18.04 27.45a10 10 0 01-8.45-4.35 1 1 0 011.7-1.04c.1.15 2.17 3.4 6.75 3.4 4.7 0 7.51-3.47 7.54-3.5a1 1 0 011.57 1.24c-.14.17-3.45 4.25-9.11 4.25z"
        }, null, 4)
      ], 2))
    ])
  ]);
}
const EmojiIcon = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a]]);
const Loader$1 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20style='margin:%20auto;%20display:%20block;%20shape-rendering:%20auto;'%20width='200px'%20height='200px'%20viewBox='0%200%20100%20100'%20preserveAspectRatio='xMidYMid'%3e%3ccircle%20cx='50'%20cy='50'%20r='0'%20fill='none'%20stroke='%23658ad9'%20stroke-width='2'%3e%3canimate%20attributeName='r'%20repeatCount='indefinite'%20dur='1s'%20values='0;40'%20keyTimes='0;1'%20keySplines='0%200.2%200.8%201'%20calcMode='spline'%20begin='0s'%3e%3c/animate%3e%3canimate%20attributeName='opacity'%20repeatCount='indefinite'%20dur='1s'%20values='1;0'%20keyTimes='0;1'%20keySplines='0.2%200%200.8%201'%20calcMode='spline'%20begin='0s'%3e%3c/animate%3e%3c/circle%3e%3ccircle%20cx='50'%20cy='50'%20r='0'%20fill='none'%20stroke='%23284892'%20stroke-width='2'%3e%3canimate%20attributeName='r'%20repeatCount='indefinite'%20dur='1s'%20values='0;40'%20keyTimes='0;1'%20keySplines='0%200.2%200.8%201'%20calcMode='spline'%20begin='-0.5s'%3e%3c/animate%3e%3canimate%20attributeName='opacity'%20repeatCount='indefinite'%20dur='1s'%20values='1;0'%20keyTimes='0;1'%20keySplines='0.2%200%200.8%201'%20calcMode='spline'%20begin='-0.5s'%3e%3c/animate%3e%3c/circle%3e%3c!--%20[ldio]%20generated%20by%20https://loading.io/%20--%3e%3c/svg%3e";
class LoaderManager {
  constructor() {
    __publicField(this, "loaders", {});
  }
  getLoaderByName(name) {
    if (!this.loaders[name]) {
      throw new Error(`[LoaderManager]: can't find instance ${name}`);
    }
    return this.loaders[name];
  }
  registerLoaderInstance(name, instance) {
    if (this.loaders[name]) {
      throw new Error(`[LoaderManager]: instance ${name} already exist`);
    }
    this.loaders[name] = instance;
  }
  unRegisterLoaderInstance(name) {
    if (this.loaders[name]) {
      delete this.loaders[name];
    }
  }
  startSpinnerByName(name) {
    const loader = this.getLoaderByName(name);
    if (!loader)
      return;
    loader.vnode.el.parentNode.style.positionOld = loader.vnode.el.parentNode.style.position;
    loader.vnode.el.parentNode.style.position = "relative";
    loader.props.isLoading = true;
  }
  finishSpinnerByName(name) {
    const loader = this.getLoaderByName(name);
    if (!loader)
      return;
    loader.vnode.el.parentNode.style.position = loader.vnode.el.parentNode.style.positionOld;
    delete loader.vnode.el.parentNode.style.positionOld;
    loader.props.isLoading = false;
  }
}
ref(false);
const LoaderManagerInstance = new LoaderManager();
const startSpinnerByName = (name) => {
  LoaderManagerInstance.startSpinnerByName(name);
};
const finishSpinnerByName = (name) => {
  LoaderManagerInstance.finishSpinnerByName(name);
};
const _hoisted_1$9 = ["src"];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "Loader",
  props: {
    isLoading: { default: false },
    type: { default: "local" },
    name: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const loading = ref(props.isLoading);
    if (props.name) {
      LoaderManagerInstance.registerLoaderInstance(props.name, getCurrentInstance());
    }
    onBeforeUnmount(() => {
      LoaderManagerInstance.unRegisterLoaderInstance(props.name);
    });
    watch(
      () => props.isLoading,
      (newData) => {
        loading.value = newData;
      }
    );
    return (_ctx, _cache) => {
      return loading.value ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["spiner-wrapper", [
          _ctx.type === "global" ? "spiner-wrapper__page" : "spiner-wrapper__local"
        ]])
      }, [
        createBaseVNode("img", {
          src: unref(Loader$1),
          alt: "Loader"
        }, null, 8, _hoisted_1$9)
      ], 2)) : createCommentVNode("", true);
    };
  }
});
const Loader = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-b2acf048"]]);
const _sfc_main$9 = {
  props: {
    onChange: {
      type: Function,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  methods: {
    _handleChange(e) {
      const files = e.target.files;
      const loadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          file.url = event.target.result;
          loadedFiles.push(file);
          if (loadedFiles.length === files.length) {
            this.onChange(loadedFiles);
          }
        };
        reader.readAsDataURL(file);
      }
      console.log(files);
    }
  }
};
const _hoisted_1$8 = {
  class: "sc-user-input--file-icon-wrapper",
  role: "button"
};
const _hoisted_2$4 = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "sc-user-input--file-icon",
  width: "20",
  height: "20",
  viewBox: "0 0 31.4 34.4"
};
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", _hoisted_1$8, [
    (openBlock(), createElementBlock("svg", _hoisted_2$4, [
      createBaseVNode("path", {
        style: normalizeStyle({ fill: $props.color }),
        d: "M20.8 10.22l-2.02-2.03L8.63 18.34a4.3 4.3 0 106.09 6.09L26.9 12.25A7.17 7.17 0 1016.75 2.1L3.96 14.9l-.03.02A10 10 0 1018.1 29.07l.02-.03 8.73-8.73-2.03-2.02L16.1 27l-.03.03a7.15 7.15 0 01-10.1-10.1l.03-.02L18.78 4.13a4.31 4.31 0 016.09 6.09L12.69 22.4a1.44 1.44 0 01-2.03-2.03l10.15-10.15z"
      }, null, 4)
    ])),
    createBaseVNode("input", {
      type: "file",
      onChange: _cache[0] || (_cache[0] = (...args) => $options._handleChange && $options._handleChange(...args)),
      multiple: ""
    }, null, 32)
  ]);
}
const FileIcons = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
const _sfc_main$8 = {
  components: {
    IconBase
  },
  props: {
    color: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      default: ""
    }
  }
};
const _hoisted_1$7 = { class: "sc-user-input--button-icon-wrapper" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconBase = resolveComponent("IconBase");
  return openBlock(), createElementBlock("button", _hoisted_1$7, [
    createVNode(_component_IconBase, {
      color: $props.color,
      width: "20",
      height: "20",
      "view-box": "2.24 2.24 15.52 15.52",
      "icon-name": $props.tooltip
    }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "default")
      ]),
      _: 3
    }, 8, ["color", "icon-name"])
  ]);
}
const UserInputButton = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const _sfc_main$7 = {
  props: {
    suggestions: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  }
};
const _hoisted_1$6 = ["onClick"];
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "sc-suggestions-row",
    style: normalizeStyle({ background: $props.colors.messageList.bg })
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.suggestions, (suggestion, idx) => {
      return openBlock(), createElementBlock("button", {
        key: idx,
        class: "sc-suggestions-element",
        style: normalizeStyle({
          borderColor: $props.colors.sentMessage.bg,
          color: $props.colors.sentMessage.bg
        }),
        onClick: ($event) => _ctx.$emit("sendSuggestion", suggestion)
      }, toDisplayString(suggestion), 13, _hoisted_1$6);
    }), 128))
  ], 4);
}
const Suggestions = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const FileIcon = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='iso-8859-1'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2018.0.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20version='1.1'%20id='Capa_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%2056%2056'%20style='enable-background:new%200%200%2056%2056;'%20xml:space='preserve'%3e%3cg%20id='svg_1'%3e%3cpath%20id='svg_2'%20fill='%23E9E9E0'%20d='m36.985,0l-29.022,0c-0.808,0%20-1.463,0.655%20-1.463,1.926l0,53.074c0,0.345%200.655,1%201.463,1l40.074,0c0.808,0%201.463,-0.655%201.463,-1l0,-42.022c0,-0.696%20-0.093,-0.92%20-0.257,-1.085l-11.636,-11.636c-0.165,-0.164%20-0.389,-0.257%20-0.622,-0.257z'/%3e%3cpolygon%20id='svg_3'%20fill='%23D9D7CA'%20points='37.5,0.151%2037.5,12%2049.349,12%20'/%3e%3cpath%20id='svg_4'%20fill='%2395A5A5'%20d='m48.037,56l-40.074,0c-0.808,0%20-1.463,-0.655%20-1.463,-1.463l0,-15.537l43,0l0,15.537c0,0.808%20-0.655,1.463%20-1.463,1.463z'/%3e%3cpath%20id='svg_9'%20fill='%23C8BDB8'%20d='m18.5,13l-6,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l6,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_10'%20fill='%23C8BDB8'%20d='m21.5,18l-9,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l9,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_11'%20fill='%23C8BDB8'%20d='m25.5,18c-0.26,0%20-0.521,-0.11%20-0.71,-0.29c-0.181,-0.19%20-0.29,-0.44%20-0.29,-0.71s0.109,-0.52%200.3,-0.71c0.36,-0.37%201.04,-0.37%201.41,0c0.18,0.19%200.29,0.45%200.29,0.71c0,0.26%20-0.11,0.52%20-0.29,0.71c-0.19,0.18%20-0.45,0.29%20-0.71,0.29z'/%3e%3cpath%20id='svg_12'%20fill='%23C8BDB8'%20d='m37.5,18l-8,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l8,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_13'%20fill='%23C8BDB8'%20d='m12.5,33c-0.26,0%20-0.521,-0.11%20-0.71,-0.29c-0.181,-0.19%20-0.29,-0.45%20-0.29,-0.71c0,-0.26%200.109,-0.52%200.29,-0.71c0.37,-0.37%201.05,-0.37%201.42,0.01c0.18,0.18%200.29,0.44%200.29,0.7c0,0.26%20-0.11,0.52%20-0.29,0.71c-0.19,0.18%20-0.45,0.29%20-0.71,0.29z'/%3e%3cpath%20id='svg_14'%20fill='%23C8BDB8'%20d='m24.5,33l-8,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l8,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_15'%20fill='%23C8BDB8'%20d='m43.5,18l-2,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l2,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_16'%20fill='%23C8BDB8'%20d='m34.5,23l-22,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l22,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_17'%20fill='%23C8BDB8'%20d='m43.5,23l-6,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l6,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_18'%20fill='%23C8BDB8'%20d='m16.5,28l-4,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l4,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_19'%20fill='%23C8BDB8'%20d='m30.5,28l-10,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l10,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3cpath%20id='svg_20'%20fill='%23C8BDB8'%20d='m43.5,28l-9,0c-0.553,0%20-1,-0.448%20-1,-1s0.447,-1%201,-1l9,0c0.553,0%201,0.448%201,1s-0.447,1%20-1,1z'/%3e%3c/g%3e%3cg%20id='svg_21'/%3e%3cg%20id='svg_22'/%3e%3cg%20id='svg_23'/%3e%3cg%20id='svg_24'/%3e%3cg%20id='svg_25'/%3e%3cg%20id='svg_26'/%3e%3cg%20id='svg_27'/%3e%3cg%20id='svg_28'/%3e%3cg%20id='svg_29'/%3e%3cg%20id='svg_30'/%3e%3cg%20id='svg_31'/%3e%3cg%20id='svg_32'/%3e%3cg%20id='svg_33'/%3e%3cg%20id='svg_34'/%3e%3cg%20id='svg_35'/%3e%3c/svg%3e";
const CloseIconSvg = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='iso-8859-1'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2019.0.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version='1.1'%20id='Capa_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%2047.971%2047.971'%20style='enable-background:new%200%200%2047.971%2047.971;'%20xml:space='preserve'%3e%3cg%3e%3cpath%20d='M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88%20c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242%20C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879%20s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z'/%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3cg%3e%3c/g%3e%3c/svg%3e";
const _sfc_main$6 = {};
const _hoisted_1$5 = { d: "M7.63 14.57a.64.64 0 00.91 0l8.22-8.22a.64.64 0 10-.91-.92L8.08 13.2 4.15 9.27a.65.65 0 00-.9.9l4.38 4.4z" };
function _sfc_render$6(_ctx, _cache) {
  return openBlock(), createElementBlock("path", _hoisted_1$5);
}
const IconOk = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = {};
const _hoisted_1$4 = {
  width: "15px",
  height: "15px",
  viewBox: "0 0 32 32",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "xmlns:sketch": "http://www.bohemiancoding.com/sketch/ns"
};
const _hoisted_2$3 = /* @__PURE__ */ createBaseVNode("defs", null, null, -1);
const _hoisted_3$3 = /* @__PURE__ */ createBaseVNode("g", {
  id: "Page-1",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd",
  "sketch:type": "MSPage"
}, [
  /* @__PURE__ */ createBaseVNode("g", {
    id: "Icon-Set-Filled",
    "sketch:type": "MSLayerGroup",
    transform: "translate(-570.000000, -1089.000000)",
    fill: "#000000"
  }, [
    /* @__PURE__ */ createBaseVNode("path", {
      d: "M591.657,1109.24 C592.048,1109.63 592.048,1110.27 591.657,1110.66 C591.267,1111.05 590.633,1111.05 590.242,1110.66 L586.006,1106.42 L581.74,1110.69 C581.346,1111.08 580.708,1111.08 580.314,1110.69 C579.921,1110.29 579.921,1109.65 580.314,1109.26 L584.58,1104.99 L580.344,1100.76 C579.953,1100.37 579.953,1099.73 580.344,1099.34 C580.733,1098.95 581.367,1098.95 581.758,1099.34 L585.994,1103.58 L590.292,1099.28 C590.686,1098.89 591.323,1098.89 591.717,1099.28 C592.11,1099.68 592.11,1100.31 591.717,1100.71 L587.42,1105.01 L591.657,1109.24 L591.657,1109.24 Z M586,1089 C577.163,1089 570,1096.16 570,1105 C570,1113.84 577.163,1121 586,1121 C594.837,1121 602,1113.84 602,1105 C602,1096.16 594.837,1089 586,1089 L586,1089 Z",
      id: "cross-circle",
      "sketch:type": "MSShapeGroup"
    })
  ])
], -1);
const _hoisted_4$2 = [
  _hoisted_2$3,
  _hoisted_3$3
];
function _sfc_render$5(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$4, _hoisted_4$2);
}
const IconDeleteAttachment = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const _sfc_main$4 = {};
const _hoisted_1$3 = { d: "M17.22 2.27L2.48 8.39c-.35.14-.32.66.06.74l6.79 1.54 1.53 6.79c.09.37.6.41.75.06l6.12-14.74a.4.4 0 00-.51-.51M3.92 8.64l11.77-4.89-6.15 6.16-5.62-1.27zm7.44 7.44l-1.27-5.61 6.16-6.16-4.9 11.77z" };
function _sfc_render$4(_ctx, _cache) {
  return openBlock(), createElementBlock("path", _hoisted_1$3);
}
const IconSend = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const ErrorTypes = {
  1e3: "Error 1000: Wrong or missing tokens",
  1001: "Error 1001: Server connection lost",
  1002: "Error 1002: Empty data received on refresh",
  1003: "Error 1003: Server error while refreshing tokens",
  1004: "Error 1004: Connection error",
  1005: "Error 1005: Connection was closed"
};
let socket;
const createSocketConnection = () => {
  const createConnection = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
    const { chatConfig } = mapState(["chatConfig"]);
    socket = new WebSocket(
      `${chatConfig.value.wsBaseUrl}/api/publicchat/in?token=${chatConfig.value.publicToken}&session_id=${store.state.value.sessionId}`
    );
    socket.onopen = function(e) {
      setTimeout(() => {
        store.setState("loadedConnection", true);
      }, 1e3);
      console.log("[socket] connected");
      store.setSocket(socket);
    };
    socket.onmessage = function(event) {
      try {
        const msg = JSON.parse(event.data);
        console.log(
          `[socket] get message from server: ${JSON.stringify(msg, null, 2)}`
        );
        emitter.$emit("onmessage", msg);
      } catch (error) {
        console.error(
          `[socket] error on message: ${error.message}
original message: ${event.data}`
        );
      }
    };
    socket.onclose = function(event) {
      if (event.wasClean) {
        store.setState("error", 1005);
        console.log(
          `[close] connection closed clearly, code=${event.code} message=${event.reason}`
        );
      } else {
        store.setState("error", 1001);
        console.error(
          "[close] connection closed dirty ",
          event.code,
          event.reason
        );
        throw new Error(ErrorTypes["1001"]);
      }
      emitter.$emit("connection-close");
    };
    socket.onerror = function(error) {
      store.setState("error", 1004);
      console.error(`[error]`, error);
      store.setState("loadedConnection", true);
      throw new Error(ErrorTypes["1004"]);
    };
    return socket;
  };
  return createConnection();
};
const _sfc_main$3 = {
  components: {
    EmojiIcon,
    FileIcons,
    UserInputButton,
    Suggestions,
    IconDeleteAttachment,
    IconCross,
    IconOk,
    IconSend,
    Loader
  },
  setup() {
    function reconnect() {
      store.setState("loadedConnection", false);
      store.setState("error", null);
      createSocketConnection();
    }
    return {
      ...mapState(["error"]),
      reconnect
    };
  },
  props: {
    icons: {
      type: Object,
      default: function() {
        return {
          file: {
            img: FileIcon,
            name: "default"
          },
          closeSvg: {
            img: CloseIconSvg,
            name: "default"
          }
        };
      }
    },
    showEmoji: {
      type: Boolean,
      default: () => false
    },
    suggestions: {
      type: Array,
      default: () => []
    },
    showFile: {
      type: Boolean,
      default: () => false
    },
    onSubmit: {
      type: Function,
      required: true
    },
    placeholder: {
      type: String,
      default: "Write something..."
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      files: [],
      file: null,
      inputActive: false,
      fileImageTypes: ["image/png", "image/jpeg", "image/jpg"],
      presignedFilesData: [],
      isMessageSending: false
    };
  },
  computed: {
    ErrorTypes() {
      return ErrorTypes;
    },
    editMessageId() {
      return this.isEditing && store.state.editMessage.id;
    },
    isEditing() {
      return store.state.editMessage && store.state.editMessage.id;
    }
  },
  watch: {
    editMessageId(m) {
      if (store.state.editMessage != null && store.state.editMessage != void 0) {
        this.$refs.userInput.focus();
        this.$refs.userInput.textContent = store.state.editMessage.data.text;
      } else {
        this.$refs.userInput.textContent = "";
      }
    }
  },
  mounted() {
    emitter.$on("focusUserInput", () => {
      if (this.$refs.userInput) {
        this.focusUserInput();
      }
    });
  },
  methods: {
    cancelFile() {
      this.file = null;
    },
    setInputActive(onoff) {
      this.inputActive = onoff;
    },
    handleKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        if (!this.isEditing) {
          this._submitText(event);
        } else {
          this._editText(event);
        }
        this._editFinish();
        event.preventDefault();
      } else if (event.keyCode === 27) {
        this._editFinish();
        event.preventDefault();
      }
      this.$emit("onType");
    },
    focusUserInput() {
      this.$nextTick(() => {
        this.$refs.userInput.focus();
      });
    },
    _submitSuggestion(suggestion) {
      this.onSubmit({ author: "me", type: "text", data: { text: suggestion } });
    },
    _checkSubmitSuccess(success) {
      this.isMessageSending = true;
      if (Promise !== void 0) {
        Promise.resolve(success).then(
          (function(wasSuccessful) {
            if (wasSuccessful === void 0 || wasSuccessful) {
              this.files = [];
              this.$refs.userInput.innerHTML = "";
              this.isMessageSending = false;
            }
          }).bind(this)
        );
      } else {
        this.$refs.userInput.innerHTML = "";
        this.files = [];
        this.isMessageSending = false;
      }
    },
    _submitText(event) {
      const text = this.$refs.userInput.textContent;
      const file = this.file;
      if (file) {
        this._submitTextWhenFile(event, text, file);
      } else {
        if (text && text.length > 0) {
          this._checkSubmitSuccess(
            this.onSubmit({
              author: "me",
              type: "text",
              data: { text },
              files: this.files
            })
          );
        }
      }
    },
    _submitTextWhenFile(event, text, file) {
      if (text && text.length > 0) {
        this._checkSubmitSuccess(
          this.onSubmit({
            author: "me",
            type: "file",
            data: { text, file }
          })
        );
      } else {
        this._checkSubmitSuccess(
          this.onSubmit({
            author: "me",
            type: "file",
            data: { file }
          })
        );
      }
    },
    _editText(event) {
      const text = this.$refs.userInput.textContent;
      if (text && text.length) {
        this.$emit("edit", {
          author: "me",
          type: "text",
          id: store.state.editMessage.id,
          data: { text }
        });
        this._editFinish();
      }
    },
    _handleEmojiPicked(emoji2) {
      this._checkSubmitSuccess(
        this.onSubmit({
          author: "me",
          type: "emoji",
          data: { emoji: emoji2 }
        })
      );
    },
    async _handleFileSubmit(files) {
      this.files = this.files.concat(files);
    },
    _editFinish() {
      store.setState("editMessage", null);
    },
    removeFileAttachment(file) {
      this.files.splice(this.files.indexOf(file), 1);
    }
  }
};
const _hoisted_1$2 = ["placeholder"];
const _hoisted_2$2 = { class: "sc-user-input--buttons" };
const _hoisted_3$2 = {
  key: 0,
  class: "sc-user-input--button"
};
const _hoisted_4$1 = {
  key: 3,
  class: "sc-user-input--button"
};
const _hoisted_5 = {
  key: 4,
  class: "sc-user-input--button"
};
const _hoisted_6 = { class: "sc-user-input--button" };
const _hoisted_7 = {
  key: 1,
  style: { "position": "relative" }
};
const _hoisted_8 = {
  key: 0,
  class: "files-container"
};
const _hoisted_9 = { class: "file" };
const _hoisted_10 = ["src"];
const _hoisted_11 = {
  key: 2,
  class: "file-default"
};
const _hoisted_12 = /* @__PURE__ */ createBaseVNode("img", {
  src: "https://cdn-icons-png.flaticon.com/128/2258/2258853.png",
  alt: ""
}, null, -1);
const _hoisted_13 = {
  class: "file-name",
  style: { "font-size": "12px" }
};
const _hoisted_14 = {
  class: "file-extention",
  style: { "font-size": "12px" }
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Suggestions = resolveComponent("Suggestions");
  const _component_EmojiIcon = resolveComponent("EmojiIcon");
  const _component_FileIcons = resolveComponent("FileIcons");
  const _component_IconCross = resolveComponent("IconCross");
  const _component_UserInputButton = resolveComponent("UserInputButton");
  const _component_IconOk = resolveComponent("IconOk");
  const _component_IconSend = resolveComponent("IconSend");
  const _component_Loader = resolveComponent("Loader");
  const _component_IconDeleteAttachment = resolveComponent("IconDeleteAttachment");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", null, [
      createVNode(_component_Suggestions, {
        suggestions: $props.suggestions,
        colors: $props.colors,
        onSendSuggestion: $options._submitSuggestion
      }, null, 8, ["suggestions", "colors", "onSendSuggestion"]),
      !_ctx.error ? (openBlock(), createElementBlock("form", {
        key: 0,
        class: normalizeClass(["sc-user-input", { active: $data.inputActive }]),
        style: normalizeStyle({ background: $props.colors.userInput.bg })
      }, [
        createBaseVNode("div", {
          ref: "userInput",
          role: "button",
          tabIndex: "0",
          contentEditable: "true",
          placeholder: $props.placeholder,
          class: "sc-user-input--text",
          style: normalizeStyle({ color: $props.colors.userInput.text }),
          onFocus: _cache[0] || (_cache[0] = ($event) => $options.setInputActive(true)),
          onBlur: _cache[1] || (_cache[1] = ($event) => $options.setInputActive(false)),
          onKeydown: _cache[2] || (_cache[2] = (...args) => $options.handleKey && $options.handleKey(...args)),
          "on:focusUserInput": _cache[3] || (_cache[3] = ($event) => $options.focusUserInput())
        }, null, 44, _hoisted_1$2),
        createBaseVNode("div", _hoisted_2$2, [
          $props.showEmoji && !$options.isEditing && !$data.isMessageSending ? (openBlock(), createElementBlock("div", _hoisted_3$2, [
            createVNode(_component_EmojiIcon, {
              "on-emoji-picked": $options._handleEmojiPicked,
              color: $props.colors.userInput.text
            }, null, 8, ["on-emoji-picked", "color"])
          ])) : createCommentVNode("", true),
          !$data.isMessageSending ? (openBlock(), createElementBlock("div", {
            key: 1,
            onClick: _cache[4] || (_cache[4] = ($event) => $options._handleEmojiPicked("👎")),
            class: "sc-user-input--button",
            style: { "cursor": "pointer", "margin-right": "10px" }
          }, " 👎 ")) : createCommentVNode("", true),
          !$data.isMessageSending ? (openBlock(), createElementBlock("div", {
            key: 2,
            onClick: _cache[5] || (_cache[5] = ($event) => $options._handleEmojiPicked("👍")),
            class: "sc-user-input--button",
            style: { "cursor": "pointer", "margin-right": "10px" }
          }, " 👍 ")) : createCommentVNode("", true),
          $props.showFile && !$options.isEditing && !$data.isMessageSending ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
            createVNode(_component_FileIcons, {
              "on-change": $options._handleFileSubmit,
              color: $props.colors.userInput.text
            }, null, 8, ["on-change", "color"])
          ])) : createCommentVNode("", true),
          $options.isEditing ? (openBlock(), createElementBlock("div", _hoisted_5, [
            createVNode(_component_UserInputButton, {
              color: $props.colors.userInput.text,
              tooltip: "Cancel",
              onClick: withModifiers($options._editFinish, ["prevent"])
            }, {
              default: withCtx(() => [
                createVNode(_component_IconCross)
              ]),
              _: 1
            }, 8, ["color", "onClick"])
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_6, [
            $options.isEditing ? (openBlock(), createBlock(_component_UserInputButton, {
              key: 0,
              color: $props.colors.userInput.text,
              tooltip: "Edit",
              onClick: withModifiers($options._editText, ["prevent"])
            }, {
              default: withCtx(() => [
                createVNode(_component_IconOk)
              ]),
              _: 1
            }, 8, ["color", "onClick"])) : (openBlock(), createElementBlock("div", _hoisted_7, [
              !$data.isMessageSending ? (openBlock(), createBlock(_component_UserInputButton, {
                key: 0,
                color: $props.colors.userInput.text,
                tooltip: "Send",
                onClick: withModifiers($options._submitText, ["prevent"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_IconSend)
                ]),
                _: 1
              }, 8, ["color", "onClick"])) : createCommentVNode("", true),
              createVNode(_component_Loader, {
                class: "sc-user-inpu--loader",
                isLoading: $data.isMessageSending
              }, null, 8, ["isLoading"])
            ]))
          ])
        ])
      ], 6)) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: "sc-user-input sc-user-error",
        style: normalizeStyle({
          background: $props.colors.errorInfo.bg,
          color: $props.colors.errorInfo.text
        })
      }, [
        createBaseVNode("div", null, [
          createTextVNode(" Connection to the server lost (id " + toDisplayString(_ctx.error) + "); ", 1),
          createBaseVNode("a", {
            class: "reconnect-button",
            onClick: _cache[6] || (_cache[6] = withModifiers((...args) => $setup.reconnect && $setup.reconnect(...args), ["prevent"]))
          }, " Click here to reconnect ")
        ])
      ], 4))
    ]),
    $data.files.length ? (openBlock(), createElementBlock("div", _hoisted_8, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($data.files, (file) => {
        return openBlock(), createElementBlock("div", _hoisted_9, [
          !$data.isMessageSending ? (openBlock(), createBlock(_component_IconDeleteAttachment, {
            key: 0,
            class: "delete-file-button",
            onClick: withModifiers(($event) => $options.removeFileAttachment(file), ["prevent", "stop"])
          }, null, 8, ["onClick"])) : createCommentVNode("", true),
          $data.fileImageTypes.includes(file.type) ? (openBlock(), createElementBlock("img", {
            key: 1,
            class: "file-image",
            src: file.url,
            alt: ""
          }, null, 8, _hoisted_10)) : (openBlock(), createElementBlock("div", _hoisted_11, [
            _hoisted_12,
            createBaseVNode("div", null, [
              createBaseVNode("div", _hoisted_13, toDisplayString(file.name), 1),
              createBaseVNode("div", _hoisted_14, toDisplayString(file.name.substring(file.name.lastIndexOf(".") + 1)), 1)
            ])
          ]))
        ]);
      }), 256))
    ])) : createCommentVNode("", true)
  ], 64);
}
const UserInput = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  props: {
    participants: {
      type: Array,
      required: true
    },
    colors: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    userListColor() {
      const defaultColors = {
        userList: {
          bg: "#FFFFFF",
          text: "#000000"
        }
      };
      return Object.assign(defaultColors, this.colors);
    }
  }
};
const _hoisted_1$1 = { style: { "padding-top": "5px" } };
const _hoisted_2$1 = { style: { "text-align": "center" } };
const _hoisted_3$1 = ["src"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "user-list",
    style: normalizeStyle({ background: $options.userListColor.userList.bg })
  }, [
    createBaseVNode("table", _hoisted_1$1, [
      createBaseVNode("tbody", null, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.participants, (user) => {
          return openBlock(), createElementBlock("tr", {
            key: user.id
          }, [
            createBaseVNode("td", _hoisted_2$1, [
              createBaseVNode("img", {
                src: user.imageUrl,
                class: "img-msg"
              }, null, 8, _hoisted_3$1)
            ]),
            createBaseVNode("td", {
              class: "user-element",
              style: normalizeStyle({ color: $options.userListColor.userList.text })
            }, toDisplayString(user.name), 5)
          ]);
        }), 128))
      ])
    ])
  ], 4);
}
const UserList = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
  components: {
    Header,
    MessageList,
    UserInput,
    UserList
  },
  props: {
    showEmoji: {
      type: Boolean,
      default: false
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    isLoaded: {
      type: Boolean,
      default: true
    },
    participants: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    onUserInputSubmit: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    placeholder: {
      type: String,
      required: true
    },
    showTypingIndicator: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    // Watch the 'message' prop
    // isOpen(newVal, oldVal) {
    //   this.$refs.messagesList._scrollDown();
    // },
  },
  data() {
    return {
      showUserList: false
    };
  },
  computed: {
    messages() {
      let messages = this.messageList;
      return messages;
    }
  },
  methods: {
    handleUserListToggle(showUserList) {
      this.showUserList = showUserList;
    },
    getSuggestions() {
      return this.messages.length > 0 ? this.messages[this.messages.length - 1].suggestions : [];
    }
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Header = resolveComponent("Header");
  const _component_UserList = resolveComponent("UserList");
  const _component_MessageList = resolveComponent("MessageList");
  const _component_UserInput = resolveComponent("UserInput");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["sc-chat-window", { opened: $props.isOpen, closed: !$props.isOpen }])
  }, [
    $props.showHeader ? (openBlock(), createBlock(_component_Header, {
      key: 0,
      title: $props.title,
      colors: $props.colors,
      onClose: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close")),
      onUserList: $options.handleUserListToggle
    }, {
      default: withCtx(() => [
        createBaseVNode("template", null, [
          renderSlot(_ctx.$slots, "header")
        ])
      ]),
      _: 3
    }, 8, ["title", "colors", "onUserList"])) : createCommentVNode("", true),
    $data.showUserList ? (openBlock(), createBlock(_component_UserList, {
      key: 1,
      colors: $props.colors,
      participants: $props.participants
    }, null, 8, ["colors", "participants"])) : createCommentVNode("", true),
    !$data.showUserList && $props.isOpen ? (openBlock(), createBlock(_component_MessageList, {
      key: 2,
      ref: "messagesList",
      messages: $options.messages,
      participants: $props.participants,
      "show-typing-indicator": $props.showTypingIndicator,
      colors: $props.colors,
      "always-scroll-to-bottom": $props.alwaysScrollToBottom,
      "message-styling": $props.messageStyling,
      onScrollToTop: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("scrollToTop")),
      onRemove: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("remove", $event))
    }, {
      "user-avatar": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "user-avatar", {
          user: scopedProps.user,
          message: scopedProps.message
        })
      ]),
      "text-message-body": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "text-message-body", {
          message: scopedProps.message,
          messageText: scopedProps.messageText,
          messageColors: scopedProps.messageColors,
          me: scopedProps.me
        })
      ]),
      "system-message-body": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "system-message-body", {
          message: scopedProps.message
        })
      ]),
      "text-message-toolbox": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "text-message-toolbox", {
          message: scopedProps.message,
          me: scopedProps.me
        })
      ]),
      _: 3
    }, 8, ["messages", "participants", "show-typing-indicator", "colors", "always-scroll-to-bottom", "message-styling"])) : createCommentVNode("", true),
    !$data.showUserList ? (openBlock(), createBlock(_component_UserInput, {
      key: 3,
      "show-emoji": $props.showEmoji,
      "on-submit": $props.onUserInputSubmit,
      suggestions: $options.getSuggestions(),
      "show-file": $props.showFile,
      placeholder: $props.placeholder,
      colors: $props.colors,
      onOnType: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("onType")),
      onEdit: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("edit", $event))
    }, null, 8, ["show-emoji", "on-submit", "suggestions", "show-file", "placeholder", "colors"])) : createCommentVNode("", true),
    createBaseVNode("div", {
      class: normalizeClass({ "is-loaded": !$props.isLoaded })
    }, null, 2)
  ], 2);
}
const ChatWindow = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const CloseIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAKVQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////uP3jVQAAADd0Uk5TAE9lCAXd9XA4y/9zDQJG7HYB8Hc3yHoPQ8fuezMSoYPrEcEugj0tqb6G+Lw5ifHcKk3SIAx/MjRpS8YAAADsSURBVHic7dDJDoIwEIDhQURwQNGiIBVkUQH3BfX9H00MEvHW9qj9L3RIvkxTAJlMJvu1lI7aHtWOwm67Wk9vz3pP67Jro4+m1QyWiX2D3cJgqNmjt7ZGtjYccGAYK8R26qNjE2XMY6smU3Q9AM/F6YSTVrtnPp173pz6M969Lx1Q6rqUBgK2KvAR/UCIAoQLxEUoiCMSxyQSokmE6XKZYpQI2BVJ1wDrlKz4dXXn7PXN+G8e5lhk9TErMOd6tXCz3e2bYb/bbnj04Xg6f6bz6Xhgtxe8lu25vOKFGd/uj+8fj/uNfbVMJpP9QU/STxAzeUFqVwAAAABJRU5ErkJggg==";
const OpenIcon = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='18'%20height='18'%3e%3crect%20id='backgroundrect'%20width='100%25'%20height='100%25'%20x='0'%20y='0'%20fill='none'%20stroke='none'/%3e%3cdefs%3e%3cstyle%3e.a{fill:none;}.b{fill:%234e8cff;}.c{clip-path:url(%23a);}.d{fill:%23fff;}.e{fill:%23eff4f9;}%3c/style%3e%3cclipPath%20id='a'%3e%3cpath%20class='a'%20d='M%200%200%20H%2017.555%20v%2017.555%20H%200%20Z'%20id='svg_1'%20transform=''/%3e%3c/clipPath%3e%3c/defs%3e%3cg%20class='currentLayer'%20style=''%3e%3ctitle%3eLayer%201%3c/title%3e%3cg%20id='svg_2'%20class='selected'%20transform=''%3e%3cg%20id='svg_3'%20transform=''%3e%3cg%20class='c'%20id='svg_4'%20transform=''%3e%3cg%20id='svg_5'%20transform=''%3e%3cpath%20class='d'%20d='M%2017.556%208.77842%20a%208.778%208.778%200%200%200%20-8.778%20-8.778%20a%208.778%208.778%200%200%200%20-8.778%208.778%20a%208.745%208.745%200%200%200%202.26%205.879%20v%201.442%20c%200%200.8%200.492%201.457%201.1%201.457%20h%205.83%20a%200.843%200.843%200%200%200%200.183%20-0.02%20a%208.778%208.778%200%200%200%208.184%20-8.757'%20id='svg_6'%20transform=''/%3e%3c/g%3e%3cg%20id='svg_7'%20transform=''%3e%3cpath%20class='e'%20d='M%203.16148%208.921%20a%209.292%209.292%200%200%201%206.38%20-8.888%20c%20-0.252%20-0.022%20-0.506%20-0.033%20-0.763%20-0.033%20a%208.774%208.774%200%200%200%20-8.778%208.778%20A%209.508%209.508%200%200%200%202.22447%2014.7003%20c%200.005%200%200%200.009%200%200.01%20c%20-0.311%200.352%20-1.924%202.849%200.021%202.849%20h%202.25%20c%20-1.23%20-0.022%201.263%20-2.107%200.269%20-3.494%20a%208.225%208.225%200%200%201%20-1.6%20-5.141'%20id='svg_8'%20transform=''/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
const _sfc_main = {
  components: {
    Loader,
    ChatWindow
  },
  props: {
    icons: {
      type: Object,
      default: function() {
        return {
          open: {
            img: OpenIcon,
            name: "default"
          },
          close: {
            img: CloseIcon,
            name: "default"
          }
        };
      }
    },
    showEmoji: {
      type: Boolean,
      default: false
    },
    showEdition: {
      type: Boolean,
      default: false
    },
    showDeletion: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    open: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showLauncher: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    participants: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: () => ""
    },
    titleImageUrl: {
      type: String,
      default: () => ""
    },
    onMessageWasSent: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    newMessagesCount: {
      type: Number,
      default: () => 0
    },
    placeholder: {
      type: String,
      default: "Write a message..."
    },
    showTypingIndicator: {
      type: String,
      default: () => ""
    },
    colors: {
      type: Object,
      validator: (c) => "header" in c && "bg" in c.header && "text" in c.header && "launcher" in c && "bg" in c.launcher && "messageList" in c && "bg" in c.messageList && "sentMessage" in c && "bg" in c.sentMessage && "text" in c.sentMessage && "receivedMessage" in c && "bg" in c.receivedMessage && "text" in c.receivedMessage && "userInput" in c && "bg" in c.userInput && "text" in c.userInput,
      default: function() {
        return {
          header: {
            bg: "#4e8cff",
            text: "#ffffff"
          },
          launcher: {
            bg: "#4e8cff"
          },
          messageList: {
            bg: "#ffffff"
          },
          sentMessage: {
            bg: "#4e8cff",
            text: "#ffffff"
          },
          receivedMessage: {
            bg: "#f4f7f9",
            text: "#ffffff"
          },
          userInput: {
            bg: "#f4f7f9",
            text: "#565867"
          }
        };
      }
    },
    alwaysScrollToBottom: {
      type: Boolean,
      default: () => false
    },
    messageStyling: {
      type: Boolean,
      default: () => false
    },
    disableUserListToggle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    chatWindowTitle() {
      if (this.title !== "")
        return this.title;
      return "";
    }
  },
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler(props) {
        for (const prop in props) {
          store.setState(prop, props[prop]);
        }
      }
    }
  },
  setup() {
    const {
      chatConfig,
      loadedConnection,
      error
    } = mapState(["chatConfig", "loadedConnection", "error"]);
    setTimeout(() => {
      startSpinnerByName("showLauncher");
      createSocketConnection();
    }, 0);
    watch(loadedConnection, (value) => {
      if (value) {
        finishSpinnerByName("showLauncher");
      } else {
        startSpinnerByName("showLauncher");
      }
    });
    return {
      chatConfig,
      loadedConnection,
      error
    };
  },
  methods: {
    openAndFocus() {
      this.open();
      emitter.$emit("focusUserInput");
    }
  }
};
const _hoisted_1 = {
  key: 0,
  class: "sc-new-messsages-count"
};
const _hoisted_2 = ["src", "alt"];
const _hoisted_3 = ["src", "alt"];
const _hoisted_4 = { style: { "position": "absolute", "top": "-100%", "left": "0", "width": "100%", "height": "100%" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Loader = resolveComponent("Loader");
  const _component_ChatWindow = resolveComponent("ChatWindow");
  return withDirectives((openBlock(), createElementBlock("div", null, [
    withDirectives(createBaseVNode("div", {
      class: normalizeClass(["sc-launcher", { opened: $props.isOpen }]),
      style: normalizeStyle({ backgroundColor: $props.colors.launcher.bg }),
      onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $props.isOpen ? $props.close() : $setup.loadedConnection && $options.openAndFocus(), ["prevent"]))
    }, [
      $props.newMessagesCount > 0 && !$props.isOpen ? (openBlock(), createElementBlock("div", _hoisted_1, toDisplayString($props.newMessagesCount), 1)) : createCommentVNode("", true),
      $setup.loadedConnection ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        $props.isOpen ? (openBlock(), createElementBlock("img", {
          key: 0,
          class: "sc-closed-icon",
          src: $props.icons.close.img,
          alt: $props.icons.close.name
        }, null, 8, _hoisted_2)) : (openBlock(), createElementBlock("img", {
          key: 1,
          class: "sc-open-icon",
          src: $props.icons.open.img,
          alt: $props.icons.open.name
        }, null, 8, _hoisted_3))
      ], 64)) : createCommentVNode("", true),
      withDirectives(createBaseVNode("div", _hoisted_4, [
        createVNode(_component_Loader, { name: "showLauncher" })
      ], 512), [
        [vShow, !$setup.loadedConnection]
      ])
    ], 6), [
      [vShow, $props.showLauncher]
    ]),
    createVNode(_component_ChatWindow, {
      "message-list": $props.messageList,
      "is-loaded": $setup.loadedConnection,
      "on-user-input-submit": $props.onMessageWasSent,
      participants: $props.participants,
      title: $options.chatWindowTitle,
      "is-open": $props.isOpen,
      "show-emoji": $props.showEmoji,
      "show-file": $props.showFile,
      "show-header": $props.showHeader,
      placeholder: $props.placeholder,
      "show-typing-indicator": $props.showTypingIndicator,
      colors: $props.colors,
      "always-scroll-to-bottom": $props.alwaysScrollToBottom,
      "message-styling": $props.messageStyling,
      onClose: $props.close,
      onScrollToTop: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("scrollToTop")),
      onOnType: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("onType")),
      onEdit: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("edit", $event)),
      onRemove: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("remove", $event))
    }, {
      header: withCtx(() => [
        renderSlot(_ctx.$slots, "header")
      ]),
      "user-avatar": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "user-avatar", {
          user: scopedProps.user,
          message: scopedProps.message
        })
      ]),
      "text-message-body": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "text-message-body", {
          message: scopedProps.message,
          messageText: scopedProps.messageText,
          messageColors: scopedProps.messageColors,
          me: scopedProps.me
        })
      ]),
      "system-message-body": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "system-message-body", {
          message: scopedProps.message
        })
      ]),
      "text-message-toolbox": withCtx((scopedProps) => [
        renderSlot(_ctx.$slots, "text-message-toolbox", {
          message: scopedProps.message,
          me: scopedProps.me
        })
      ]),
      _: 3
    }, 8, ["message-list", "is-loaded", "on-user-input-submit", "participants", "title", "is-open", "show-emoji", "show-file", "show-header", "placeholder", "show-typing-indicator", "colors", "always-scroll-to-bottom", "message-styling", "onClose"])
  ], 512)), [
    [vShow, $setup.chatConfig]
  ]);
}
const Launcher = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
(function() {
  window.ezee = window.ezee || {};
  store.setupFirst();
  window.ezee.setupChatConfig = ({
    publicToken,
    botTitle = "Ezee Assist Public Agent",
    apiBaseUrl = "https://channel.dev.ezeeassist.io",
    wsBaseUrl = "wss://channel.dev.ezeeassist.io",
    wordpressPluginPath = ""
  } = {}) => {
    if (!publicToken) {
      throw new Error("Ezee Assist Public Chat requires a Public Token");
    }
    store.setState("chatConfig", {
      publicToken,
      botTitle,
      apiBaseUrl,
      wsBaseUrl,
      wordpressPluginPath
    });
  };
  const shadowRoot = document.createElement("div");
  shadowRoot.style.position = "absolute";
  shadowRoot.style.zIndex = "100000000000000000";
  document.body.append(shadowRoot);
  if (shadowRoot) {
    const shadow = shadowRoot.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const chat = document.createElement("div");
    chat.id = "chat";
    style.textContent = styles;
    shadow.appendChild(style);
    shadow.appendChild(chat);
    createApp(App).component("BubbleChat", Launcher).use(plugin).mount(chat);
  }
})();
