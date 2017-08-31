			var hlLogo = new Raster({
				source: 'hl',
				position: view.bounds.topRight - [70, -70]
			});
			hlLogo.opacity = 0;
			//logoText.jss
			(function(window, document) {
				'use strict';
				function Pathformer(element) {
						if (typeof element === 'undefined') {
							throw new Error('Pathformer [constructor]: "element" parameter is required');
						}
						if (element.constructor === String) {
							element = document.getElementById(element);
							if (!element) {
								throw new Error('Pathformer [constructor]: "element" parameter is not related to an existing ID');
							}
						}
						if (element.constructor instanceof window.SVGElement || /^svg$/i.test(element.nodeName)) {
							this.el = element;
						} else {
							throw new Error('Pathformer [constructor]: "element" parameter must be a string or a SVGelement');
						}
						this.scan(element);
					}
				Pathformer.prototype.TYPES = ['line', 'ellipse', 'circle', 'polygon', 'polyline', 'rect'];
				Pathformer.prototype.ATTR_WATCH = ['cx', 'cy', 'points', 'r', 'rx', 'ry', 'x', 'x1', 'x2', 'y', 'y1', 'y2'];
				Pathformer.prototype.scan = function(svg) {
					var fn, element, pathData, pathDom,
						elements = svg.querySelectorAll(this.TYPES.join(','));
					for (var i = 0; i < elements.length; i++) {
						element = elements[i];
						fn = this[element.tagName.toLowerCase() + 'ToPath'];
						pathData = fn(this.parseAttr(element.attributes));
						pathDom = this.pathMaker(element, pathData);
						element.parentNode.replaceChild(pathDom, element);
					}
				};
				Pathformer.prototype.lineToPath = function(element) {
					var newElement = {};
					newElement.d = 'M' + element.x1 + ',' + element.y1 + 'L' + element.x2 + ',' + element.y2;
					return newElement;
				};
				Pathformer.prototype.rectToPath = function(element) {
					var newElement = {},
						x = parseFloat(element.x) || 0,
						y = parseFloat(element.y) || 0,
						width = parseFloat(element.width) || 0,
						height = parseFloat(element.height) || 0;
					newElement.d = 'M' + x + ' ' + y + ' ';
					newElement.d += 'L' + (x + width) + ' ' + y + ' ';
					newElement.d += 'L' + (x + width) + ' ' + (y + height) + ' ';
					newElement.d += 'L' + x + ' ' + (y + height) + ' Z';
					return newElement;
				};
				Pathformer.prototype.polylineToPath = function(element) {
					var i, path;
					var newElement = {};
					var points = element.points.trim().split(' ');
					// Reformatting if points are defined without commas
					if (element.points.indexOf(',') === -1) {
						var formattedPoints = [];
						for (i = 0; i < points.length; i += 2) {
							formattedPoints.push(points[i] + ',' + points[i + 1]);
						}
						points = formattedPoints;
					}
					// Generate the path.d value
					path = 'M' + points[0];
					for (i = 1; i < points.length; i++) {
						if (points[i].indexOf(',') !== -1) {
							path += 'L' + points[i];
						}
					}
					newElement.d = path;
					return newElement;
				};
				Pathformer.prototype.polygonToPath = function(element) {
					var newElement = Pathformer.prototype.polylineToPath(element);
					newElement.d += 'Z';
					return newElement;
				};
				Pathformer.prototype.ellipseToPath = function(element) {
					var startX = element.cx - element.rx,
						startY = element.cy;
					var endX = parseFloat(element.cx) + parseFloat(element.rx),
						endY = element.cy;
					var newElement = {};
					newElement.d = 'M' + startX + ',' + startY + 'A' + element.rx + ',' + element.ry + ' 0,1,1 ' + endX + ',' + endY + 'A' + element.rx + ',' + element.ry + ' 0,1,1 ' + startX + ',' + endY;
					return newElement;
				};
				Pathformer.prototype.circleToPath = function(element) {
					var newElement = {};
					var startX = element.cx - element.r,
						startY = element.cy;
					var endX = parseFloat(element.cx) + parseFloat(element.r),
						endY = element.cy;
					newElement.d = 'M' + startX + ',' + startY + 'A' + element.r + ',' + element.r + ' 0,1,1 ' + endX + ',' + endY + 'A' + element.r + ',' + element.r + ' 0,1,1 ' + startX + ',' + endY;
					return newElement;
				};
				Pathformer.prototype.pathMaker = function(element, pathData) {
					var i, attr, pathTag = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					for (i = 0; i < element.attributes.length; i++) {
						attr = element.attributes[i];
						if (this.ATTR_WATCH.indexOf(attr.name) === -1) {
							pathTag.setAttribute(attr.name, attr.value);
						}
					}
					for (i in pathData) {
						pathTag.setAttribute(i, pathData[i]);
					}
					return pathTag;
				};
				Pathformer.prototype.parseAttr = function(element) {
					var attr, output = {};
					for (var i = 0; i < element.length; i++) {
						attr = element[i];
						// Check if no data attribute contains '%', or the transformation is impossible
						if (this.ATTR_WATCH.indexOf(attr.name) !== -1 && attr.value.indexOf('%') !== -1) {
							throw new Error('Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into \'path\' tags. Please use \'viewBox\'.');
						}
						output[attr.name] = attr.value;
					}
					return output;
				};
				'use strict';
				var requestAnimFrame, cancelAnimFrame, parsePositiveInt;
				function logoText(element, options, callback) {
						// Setup
						this.isReady = false;
						this.setElement(element, options);
						this.setOptions(options);
						this.setCallback(callback);
						if (this.isReady) {
							this.init();
						}
					}
				logoText.LINEAR = function(x) {
					return x;
				};
				logoText.EASE = function(x) {
					return -Math.cos(x * Math.PI) / 2 + 0.5;
				};
				logoText.EASE_OUT = function(x) {
					return 1 - Math.pow(1 - x, 3);
				};
				logoText.EASE_IN = function(x) {
					return Math.pow(x, 3);
				};
				logoText.EASE_OUT_BOUNCE = function(x) {
					var base = -Math.cos(x * (0.5 * Math.PI)) + 1,
						rate = Math.pow(base, 1.5),
						rateR = Math.pow(1 - x, 2),
						progress = -Math.abs(Math.cos(rate * (2.5 * Math.PI))) + 1;
					return (1 - rateR) + (progress * rateR);
				};
				logoText.prototype.setElement = function(element, options) {
					// Basic check
					if (typeof element === 'undefined') {
						throw new Error('logoText [constructor]: "element" parameter is required');
					}
					// Set the element
					if (element.constructor === String) {
						element = document.getElementById(element);
						if (!element) {
							throw new Error('logoText [constructor]: "element" parameter is not related to an existing ID');
						}
					}
					this.parentEl = element;
					// Create the object element if the property `file` exists in the options object
					if (options && options.file) {
						var objElm = document.createElement('object');
						objElm.setAttribute('type', 'image/svg+xml');
						objElm.setAttribute('data', options.file);
						objElm.setAttribute('built-by-vivus', 'true');
						element.appendChild(objElm);
						element = objElm;
					}
					switch (element.constructor) {
						case window.SVGSVGElement:
						case window.SVGElement:
							this.el = element;
							this.isReady = true;
							break;
						case window.HTMLObjectElement:
							// If we have to wait for it
							var onLoad, self;
							self = this;
							onLoad = function(e) {
								if (self.isReady) {
									return;
								}
								self.el = element.contentDocument && element.contentDocument.querySelector('svg');
								if (!self.el && e) {
									throw new Error('logoText [constructor]: object loaded does not contain any SVG');
								} else if (self.el) {
									if (element.getAttribute('built-by-vivus')) {
										self.parentEl.insertBefore(self.el, element);
										self.parentEl.removeChild(element);
										self.el.setAttribute('width', '100%');
										self.el.setAttribute('height', '100%');
									}
									self.isReady = true;
									self.init();
									return true;
								}
							};
							if (!onLoad()) {
								element.addEventListener('load', onLoad);
							}
							break;
						default:
							throw new Error('logoText [constructor]: "element" parameter is not valid (or miss the "file" attribute)');
					}
				};
				logoText.prototype.setOptions = function(options) {
					var allowedTypes = ['delayed', 'async', 'oneByOne', 'scenario', 'scenario-sync'];
					var allowedStarts = ['inViewport', 'manual', 'autostart'];
					// Basic check
					if (options !== undefined && options.constructor !== Object) {
						throw new Error('logoText [constructor]: "options" parameter must be an object');
					} else {
						options = options || {};
					}
					// Set the animation type
					if (options.type && allowedTypes.indexOf(options.type) === -1) {
						throw new Error('logoText [constructor]: ' + options.type + ' is not an existing animation `type`');
					} else {
						this.type = options.type || allowedTypes[0];
					}
					// Set the start type
					if (options.start && allowedStarts.indexOf(options.start) === -1) {
						throw new Error('logoText [constructor]: ' + options.start + ' is not an existing `start` option');
					} else {
						this.start = options.start || allowedStarts[0];
					}
					this.isIE = (window.navigator.userAgent.indexOf('MSIE') !== -1 || window.navigator.userAgent.indexOf('Trident/') !== -1 || window.navigator.userAgent.indexOf('Edge/') !== -1);
					this.duration = parsePositiveInt(options.duration, 120);
					this.delay = parsePositiveInt(options.delay, null);
					this.dashGap = parsePositiveInt(options.dashGap, 1);
					this.forceRender = options.hasOwnProperty('forceRender') ? !!options.forceRender : this.isIE;
					this.selfDestroy = !!options.selfDestroy;
					this.onReady = options.onReady;
					this.frameLength = this.currentFrame = this.map = this.delayUnit = this.speed = this.handle = null;
					this.ignoreInvisible = options.hasOwnProperty('ignoreInvisible') ? !!options.ignoreInvisible : false;
					this.animTimingFunction = options.animTimingFunction || logoText.LINEAR;
					this.pathTimingFunction = options.pathTimingFunction || logoText.LINEAR;
					if (this.delay >= this.duration) {
						throw new Error('logoText [constructor]: delay must be shorter than duration');
					}
				};
				logoText.prototype.setCallback = function(callback) {
					// Basic check
					if (!!callback && callback.constructor !== Function) {
						throw new Error('logoText [constructor]: "callback" parameter must be a function');
					}
					this.callback = callback || function() {};
				};
				logoText.prototype.mapping = function() {
					var i, paths, path, pAttrs, pathObj, totalLength, lengthMeter, timePoint;
					timePoint = totalLength = lengthMeter = 0;
					paths = this.el.querySelectorAll('path');
					for (i = 0; i < paths.length; i++) {
						path = paths[i];
						if (this.isInvisible(path)) {
							continue;
						}
						pathObj = {
							el: path,
							length: Math.ceil(path.getTotalLength())
						};
						// Test if the path length is correct
						if (isNaN(pathObj.length)) {
							if (window.console && console.warn) {
								console.warn('logoText [mapping]: cannot retrieve a path element length', path);
							}
							continue;
						}
						this.map.push(pathObj);
						path.style.strokeDasharray = pathObj.length + ' ' + (pathObj.length + this.dashGap * 2);
						path.style.strokeDashoffset = pathObj.length + this.dashGap;
						pathObj.length += this.dashGap;
						totalLength += pathObj.length;
						this.renderPath(i);
					}
					totalLength = totalLength === 0 ? 1 : totalLength;
					this.delay = this.delay === null ? this.duration / 3 : this.delay;
					this.delayUnit = this.delay / (paths.length > 1 ? paths.length - 1 : 1);
					for (i = 0; i < this.map.length; i++) {
						pathObj = this.map[i];
						switch (this.type) {
							case 'delayed':
								pathObj.startAt = this.delayUnit * i;
								pathObj.duration = this.duration - this.delay;
								break;
							case 'oneByOne':
								pathObj.startAt = lengthMeter / totalLength * this.duration;
								pathObj.duration = pathObj.length / totalLength * this.duration;
								break;
							case 'async':
								pathObj.startAt = 0;
								pathObj.duration = this.duration;
								break;
							case 'scenario-sync':
								path = paths[i];
								pAttrs = this.parseAttr(path);
								pathObj.startAt = timePoint + (parsePositiveInt(pAttrs['data-delay'], this.delayUnit) || 0);
								pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
								timePoint = pAttrs['data-async'] !== undefined ? pathObj.startAt : pathObj.startAt + pathObj.duration;
								this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
								break;
							case 'scenario':
								path = paths[i];
								pAttrs = this.parseAttr(path);
								pathObj.startAt = parsePositiveInt(pAttrs['data-start'], this.delayUnit) || 0;
								pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
								this.frameLength = Math.max(this.frameLength, (pathObj.startAt + pathObj.duration));
								break;
						}
						lengthMeter += pathObj.length;
						this.frameLength = this.frameLength || this.duration;
					}
				};
				logoText.prototype.drawer = function() {
					var self = this;
					this.currentFrame += this.speed;
					if (this.currentFrame <= 0) {
						this.stop();
						this.reset();
						this.callback(this);
					} else if (this.currentFrame >= this.frameLength) {
						this.stop();
						this.currentFrame = this.frameLength;
						this.trace();
						if (this.selfDestroy) {
							this.destroy();
						}
						this.callback(this);
					} else {
						this.trace();
						this.handle = requestAnimFrame(function() {
							self.drawer();
						});
					}
				};
				logoText.prototype.trace = function() {
					var i, progress, path, currentFrame;
					currentFrame = this.animTimingFunction(this.currentFrame / this.frameLength) * this.frameLength;
					for (i = 0; i < this.map.length; i++) {
						path = this.map[i];
						progress = (currentFrame - path.startAt) / path.duration;
						progress = this.pathTimingFunction(Math.max(0, Math.min(1, progress)));
						if (path.progress !== progress) {
							path.progress = progress;
							path.el.style.strokeDashoffset = Math.floor(path.length * (1 - progress));
							this.renderPath(i);
						}
					}
				};
				logoText.prototype.renderPath = function(index) {
					if (this.forceRender && this.map && this.map[index]) {
						var pathObj = this.map[index],
							newPath = pathObj.el.cloneNode(true);
						pathObj.el.parentNode.replaceChild(newPath, pathObj.el);
						pathObj.el = newPath;
					}
				};
				logoText.prototype.init = function() {
					// Set object variables
					this.frameLength = 0;
					this.currentFrame = 0;
					this.map = [];
					// Start
					new Pathformer(this.el);
					this.mapping();
					this.starter();
					if (this.onReady) {
						this.onReady(this);
					}
				};
				logoText.prototype.starter = function() {
					switch (this.start) {
						case 'manual':
							return;
						case 'autostart':
							this.play();
							break;
						case 'inViewport':
							var self = this,
								listener = function() {
									if (self.isInViewport(self.parentEl, 1)) {
										self.play();
										window.removeEventListener('scroll', listener);
									}
								};
							window.addEventListener('scroll', listener);
							listener();
							break;
					}
				};
				logoText.prototype.getStatus = function() {
					return this.currentFrame === 0 ? 'start' : this.currentFrame === this.frameLength ? 'end' : 'progress';
				};
				logoText.prototype.reset = function() {
					return this.setFrameProgress(0);
				};
				logoText.prototype.finish = function() {
					return this.setFrameProgress(1);
				};
				logoText.prototype.setFrameProgress = function(progress) {
					progress = Math.min(1, Math.max(0, progress));
					this.currentFrame = Math.round(this.frameLength * progress);
					this.trace();
					return this;
				};
				logoText.prototype.play = function(speed) {
					if (speed && typeof speed !== 'number') {
						throw new Error('logoText [play]: invalid speed');
					}
					this.speed = speed || 1;
					if (!this.handle) {
						this.drawer();
					}
					return this;
				};
				logoText.prototype.stop = function() {
					if (this.handle) {
						cancelAnimFrame(this.handle);
						this.handle = null;
					}
					return this;
				};
				logoText.prototype.destroy = function() {
					var i, path;
					for (i = 0; i < this.map.length; i++) {
						path = this.map[i];
						path.el.style.strokeDashoffset = null;
						path.el.style.strokeDasharray = null;
						this.renderPath(i);
					}
				};
				logoText.prototype.isInvisible = function(el) {
					var rect,
						ignoreAttr = el.getAttribute('data-ignore');
					if (ignoreAttr !== null) {
						return ignoreAttr !== 'false';
					}
					if (this.ignoreInvisible) {
						rect = el.getBoundingClientRect();
						return !rect.width && !rect.height;
					} else {
						return false;
					}
				};
				logoText.prototype.parseAttr = function(element) {
					var attr, output = {};
					if (element && element.attributes) {
						for (var i = 0; i < element.attributes.length; i++) {
							attr = element.attributes[i];
							output[attr.name] = attr.value;
						}
					}
					return output;
				};
				logoText.prototype.isInViewport = function(el, h) {
					var scrolled = this.scrollY(),
						viewed = scrolled + this.getViewportH(),
						elBCR = el.getBoundingClientRect(),
						elHeight = elBCR.height,
						elTop = scrolled + elBCR.top,
						elBottom = elTop + elHeight;
					// if 0, the element is considered in the viewport as soon as it enters.
					// if 1, the element is considered in the viewport only when it's fully inside
					// value in percentage (1 >= h >= 0)
					h = h || 0;
					return (elTop + elHeight * h) <= viewed && (elBottom) >= scrolled;
				};
				logoText.prototype.docElem = window.document.documentElement;
				logoText.prototype.getViewportH = function() {
					var client = this.docElem.clientHeight,
						inner = window.innerHeight;
					if (client < inner) {
						return inner;
					} else {
						return client;
					}
				};
				logoText.prototype.scrollY = function() {
					return window.pageYOffset || this.docElem.scrollTop;
				};
				requestAnimFrame = (function() {
					return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function( /* function */ callback) {
						return window.setTimeout(callback, 1000 / 60);
					});
				})();
				cancelAnimFrame = (function() {
					return (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(id) {
						return window.clearTimeout(id);
					});
				})();
				parsePositiveInt = function(value, defaultValue) {
					var output = parseInt(value, 10);
					return (output >= 0) ? output : defaultValue;
				};
				if (typeof define === 'function' && define.amd) {
					// AMD. Register as an anonymous module.
					define([], function() {
						return logoText;
					});
				} else if (typeof exports === 'object') {
					// Node. Does not work with strict CommonJS, but
					// only CommonJS-like environments that support module.exports,
					// like Node.
					module.exports = logoText;
				} else {
					// Browser globals
					window.logoText = logoText;
				}
			}(window, document));
			//config.jss
			var typePoints = [
				//A
				[0, 8, 2.5, 0, 5, 8, 3.75, 4, 1.25, 4, 3.75, 4, 3.75, 4, 3.75, 4],
				//B
				[0, 8, 5, 8, 5, 4, 0, 4, 3, 4, 3, 0, 0, 0, 0, 8],
				//C
				[5, 0, 0, 0, 0, 8, 5, 8, 0, 8, 0, 0, 2, 0, 4, 0],
				//D
				[3, 0, 0, 0, 0, 8, 4, 8, 5, 4, 3, 0, 0, 0, 0, 8],
				//E
				[5, 0, 0, 0, 0, 4, 5, 4, 0, 4, 0, 8, 5, 8, 4, 8],
				//F
				[5, 0, 0, 0, 0, 4, 5, 4, 0, 4, 0, 8, 0, 4, 5, 4],
				//G
				[5, 0, 0, 0, 0, 8, 5, 8, 5, 4, 2.5, 4, 2.5, 4, 2.5, 4],
				//H
				[0, 0, 0, 4, 0, 8, 0, 4, 5, 4, 5, 8, 5, 4, 5, 0],
				//I
				[2.5, 0, 2.5, 8, 2.5, 0, 2.5, 8, 2.5, 0, 2.5, 8, 2.5, 8, 2.5, 8],
				//J
				[5, 0, 5, 4, 5, 8, 0, 8, 0, 4, 0, 8, 0, 4, 0, 8],
				//K
				[0, 0, 0, 8, 0, 4, 5, 0, 0, 4, 5, 8, 0, 4, 5, 8],
				//L
				[0, 0, 0, 4, 0, 8, 2, 8, 5, 8, 0, 8, 5, 8, 0, 8],
				//M
				[0, 8, 0, 0, 2.5, 6, 5, 0, 5, 8, 5, 0, 5, 8, 5, 0],
				//N
				[0, 8, 0, 0, 5, 8, 5, 0, 5, 8, 0, 0, 5, 8, 0, 0],
				//O
				[0, 0, 0, 8, 5, 8, 5, 0, 0, 0, 0, 8, 0, 0, 0, 8],
				//P
				[0, 0, 0, 8, 0, 4, 5, 4, 5, 0, 0, 0, 5, 0, 0, 0],
				//Q
				[5, 0, 0, 0, 0, 8, 5, 8, 5, 0, 5, 8, 3, 6, 5, 8, 3, 6],
				//R
				[0, 4, 5, 4, 5, 0, 0, 0, 0, 8, 0, 4, 5, 8, 0, 4],
				//S
				[5, 0, 0, 0, 0, 4, 5, 4, 5, 8, 0, 8, 5, 8, 0, 8],
				//T
				[0, 0, 2.5, 0, 5, 0, 2.5, 0, 2.5, 8, 2.5, 0, 2.5, 8, 2.5, 0],
				//U
				[0, 0, 0, 8, 5, 8, 5, 0, 5, 8, 0, 8, 5, 8, 0, 8],
				//V
				[0, 0, 2.5, 8, 5, 0, 2.5, 8, 0, 0, 2.5, 8, 0, 0, 2.5, 8],
				//W
				[0, 0, 0, 8, 2.5, 2, 5, 8, 5, 0, 5, 8, 5, 0, 5, 8],
				//X
				[0, 0, 2.5, 4, 5, 0, 0, 8, 2.5, 4, 5, 8, 2.5, 4, 5, 8],
				//Y
				[0, 0, 2.5, 4, 5, 0, 2.5, 4, 2.5, 8, 2.5, 4, 2.5, 8, 2.5, 4],
				//Z
				[0, 0, 5, 0, 0, 8, 5, 8, 0, 8, 5, 0, 0, 8, 5, 0],
				//= space
				[2.5, 4, 2.5, 4, 2.5, 4, 2.5, 4, 2.5, 4, 2.5, 4, 2.5, 4, 2.5, 4],
				//- line
				[0, 4, 1, 4, 2, 4, 3, 4, 4, 4, 5, 4, 4, 4, 3, 4],
				//| line
				[0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7],
				//# square
				[0, 0, 5, 0, 5, 8, 0, 8, 0, 0, 5, 0, 5, 8, 0, 8],
				//<  <-
				[2.5, 2, 0, 4, 0, 4, 0, 4, 2.5, 6, 2.5, 6, 2.5, 6, 0, 4],
				//>  ->
				[2.5, 2, 5, 4, 5, 4, 5, 4, 2.5, 6, 2.5, 6, 2.5, 6, 5, 4],
				//{ ↑
				[0, 4, 2.5, 0, 5, 4, 2.5, 0, 0, 4, 2.5, 0, 5, 4, 2.5, 0],
				//} ↓
				[0, 4, 1.25, 6, 2.5, 8, 3.75, 6, 5, 4, 5, 4, 5, 4, 5, 4],
				//[ 「
				[-4, 4, -4, 3, -4, 2, -4, 0, 1, 0, 2, 0, 3, 0, 5, 0],
				//]  ↓
				[0, 5, 2.5, 8, 5, 5, 2.5, 8, 2.5, 3, 2.5, 8, 2.5, 3, 2.5, 8],
				//0
				[0, 0, 0, 8, 5, 8, 5, 0, 0, 0, 0, 8, 0, 0, 0, 8],
				//1
				[5, 0, 5, 1, 5, 2, 5, 3, 5, 4, 5, 5, 5, 6, 5, 8],
				//2
				[0, 0, 5, 0, 5, 4, 2.5, 4, 0, 4, 0, 8, 2.5, 8, 5, 8],
				//3
				[0, 0, 5, 0, 5, 4, 0, 4, 5, 4, 5, 8, 2.5, 8, 0, 8],
				//4
				[0, 0, 0, 4, 5, 4, 5, 0, 5, 4, 5, 8, 5, 4, 5, 0],
				//5
				[5, 0, 2.5, 0, 0, 0, 0, 2, 0, 4, 5, 4, 5, 8, 0, 8],
				//6
				[5, 0, 0, 0, 0, 2, 0, 4, 0, 8, 5, 8, 5, 4, 0, 4],
				//7
				[0, 0, 2, 0, 4, 0, 5, 0, 5, 2, 5, 4, 5, 6, 5, 8],
				//8
				[0, 0, 0, 8, 5, 8, 5, 0, 0, 0, 0, 4, 2.5, 4, 5, 4],
				//9
				[5, 8, 5, 4, 5, 0, 2.5, 0, 0, 0, 0, 4, 2.5, 4, 5, 4],
				//. dot
				[5, 8, 4, 8, 5, 8, 4, 8, 5, 8, 4, 8, 5, 8, 4, 8],
				//@
				[5, 2, 2.5, 2, 2.5, 6, 5, 6, 5, 0, 0, 0, 0, 8, 5, 8],
				//?
				[0, 0, 5, 0, 5, 4, 2.5, 4, 2.5, 8, 2.5, 4, 2.5, 8, 2.5, 4],
				//!
				[2.5, 0, 2.5, 6, 3.5, 6, 3.5, 8, 1.5, 8, 1.5, 6, 2.5, 6, 2.5, 6],
				//_  
				[0, 8, 1, 8, 2, 8, 3, 8, 4, 8, 5, 8, 4, 8, 3, 8],
				// /  slash
				[5, 0, 5, 0, 5, 0, 5, 0, 0, 8, 0, 8, 0, 8, 0, 8],
				//(  <-
				[2.5, 2, 0, 4, 2.5, 4, 5, 4, 2.5, 4, 0, 4, 2.5, 6, 0, 4],
				//)  ->
				[2.5, 2, 5, 4, 2.5, 4, 0, 4, 2.5, 4, 5, 4, 2.5, 6, 5, 4],
				//a 8
				[0, 4, 5, 4, 5, 8, 0, 8, 0, 6, 5, 6, 5, 8, 0, 8],
				//b
				[0, 0, 0, 4, 0, 8, 5, 8, 5, 4, 3, 4, 2, 4, 0, 4],
				//c
				[5, 4, 3, 4, 0, 4, 0, 6, 0, 8, 2, 8, 3, 8, 5, 8],
				//d
				[5, 0, 5, 2, 5, 4, 5, 6, 5, 8, 0, 8, 0, 4, 5, 4],
				//e
				[0, 6, 5, 6, 5, 4, 0, 4, 0, 6, 0, 8, 3, 8, 5, 8],
				//f
				[5, 0, 2.5, 0, 2.5, 4, 0, 4, 2.5, 4, 2.5, 8, 2.5, 4, 5, 4],
				//g
				[0, 12, 5, 12, 5, 4, 0, 4, 0, 8, 2, 8, 3, 8, 5, 8],
				//h
				[0, 0, 0, 4, 0, 8, 0, 4, 2, 4, 3, 4, 5, 4, 5, 8],
				//i
				[3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 7, 3, 6, 3, 4],
				//j
				[3, 4, 3, 6, 3, 8, 3, 12, 0, 12, 3, 12, 3, 5, 3, 4],
				//k
				[0, 0, 0, 6, 4, 4, 0, 6, 4, 8, 0, 6, 0, 8, 0, 0],
				//l
				[3, 0, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 8],
				//m
				[0, 8, 0, 4, 2.5, 4, 2.5, 8, 2.5, 4, 5, 4, 5, 6, 5, 8],
				//n
				[0, 8, 0, 6, 0, 4, 2, 4, 3, 4, 4, 4, 5, 4, 5, 8],
				//o
				[0, 4, 0, 8, 3, 8, 5, 8, 5, 6, 5, 4, 3, 4, 0, 4],
				//p
				[0, 12, 0, 8, 0, 4, 3, 4, 5, 4, 5, 6, 5, 8, 0, 8],
				//q
				[5, 12, 5, 8, 5, 4, 3, 4, 0, 4, 0, 8, 3, 8, 5, 8],
				//r
				[0, 4, 0, 4, 5, 4, 0, 4, 0, 8, 0, 4, 0, 4, 0, 4],
				//s
				[5, 4, 3, 4, 0, 4, 0, 6, 5, 6, 5, 8, 3, 8, 0, 8],
				//t
				[2.5, 2, 2.5, 8, 5, 8, 2.5, 8, 2.5, 4, 0, 4, 2.5, 4, 5, 4],
				//u
				[0, 4, 0, 6, 0, 8, 3, 8, 5, 8, 5, 6, 5, 4, 5, 4],
				//v
				[0, 4, 2.5, 8, 5, 4, 2.5, 8, 0, 4, 2.5, 8, 5, 4, 2.5, 8],
				//w
				[0, 4, 0, 8, 2.5, 8, 2.5, 4, 2.5, 8, 5, 8, 5, 4, 5, 4],
				//x
				[0, 4, 2.5, 6, 5, 8, 2.5, 6, 0, 8, 2.5, 6, 5, 4, 2.5, 6],
				//y
				[0, 4, 0, 8, 5, 8, 5, 4, 5, 8, 5, 12, 0, 12, 5, 12],
				//z
				[0, 4, 3, 4, 5, 4, 0, 8, 2, 8, 3, 8, 4, 8, 5, 8]
			]
			var manPoints = [
				[-100, -10, -53, -10, -6, -10, 41, -10, 88, -10, 135, -10, 182, -10, 229, -10, 276, -10, 323, -10, 370, -10, 417, -10, 464, -10, 511, -10, 558, -10, 604.9, -10, 651.9, -10, 698.9, -10, 745.9, -10, 792.9, -10, 839.9, -10, 886.9, -10, 933.9, -10, 980.9, -10, 1027.9, -10, 1074.9, -10, 1121.9, -10, 1168.9, -10, 1215.9, -10, 1262.8, -10, 1309.8, -10, 1356.8, -10, 1403.8, -10, 1450.8, -10, 1497.8, -10, 1544.8, -10, 1780, -10, 1780, 24.2, 1780, 51.6, 1780, 79, 1780, 106.3, 1780, 133.7, 1780, 161, 1780, 188.4, 1780, 215.7, 1780, 243.1, 1780, 270.5, 1780, 297.8, 1780, 325.2, 1780, 352.5, 1780, 379.9, 1780, 407.2, 1780, 434.6, 1780, 462, 1780, 489.3, 1780, 516.7, 1780, 544, 1780, 571.4, 1780, 598.7, 1780, 626.1, 1780, 653.4, 1780, 680.8, 1780, 708.2, 1780, 735.5, 1780, 762.9, 1780, 790.2, 1780, 817.6, 1780, 844.9, 1780, 872.3, 1780, 899.7, 1780, 927, 1780, 998, 1756, 998, 1709, 998, 1662, 998, 1615.6, 998, 1568.6, 998, 1521.6, 998, 1474.6, 998, 1427.6, 998, 1380.6, 998, 1333.6, 998, 1286.6, 998, 1239.6, 998, 1192.6, 998, 1145.6, 998, 1098.7, 998, 1051.7, 998, 1004.7, 998, 957.7, 998, 910.7, 998, 863.7, 998, 816.7, 998, 769.7, 998, 722.7, 998, 675.7, 998, 628.7, 998, 581.7, 998, 534.7, 998, 487.7, 998, 440.7, 998, 393.8, 998, 346.8, 998, 299.8, 998, 252.8, 998, 205.8, 998, 158.8, 998, 111.8, 998, -100, 998, -100, 950.2, -100, 922.8, -100, 895.5, -100, 868.1, -100, 840.7, -100, 813.4, -100, 786, -100, 758.7, -100, 731.3, -100, 704, -100, 676.6, -100, 649.3, -100, 621.9, -100, 594.5, -100, 567.2, -100, 539.8, -100, 512.5, -100, 485.1, -100, 457.8, -100, 430.4, -100, 403, -100, 375.7, -100, 348.3, -100, 321, -100, 293.6, -100, 266.3, -100, 238.9, -100, 211.5, -100, 184.2, -100, 156.8, -100, 129.5, -100, 102.1, -100, 50, -100, -10],
				[98.7, 128.2, 99.2, 127.7, 99.9, 127.1, 99.6, 125.9, 100.8, 124.6, 101.9, 123.2, 102.5, 121.7, 102.6, 120.1, 103.3, 118.7, 104.7, 117.3, 106.2, 117.6, 106.8, 117.3, 106.3, 115.5, 107.1, 115.3, 107.3, 114.7, 107.6, 114, 107.7, 113.4, 109.2, 113, 110.2, 113, 111.1, 112.3, 113.2, 112.4, 113.4, 111.5, 113.9, 111, 114.9, 110.1, 116.7, 110.1, 117.8, 110.2, 118.6, 110.4, 119.2, 109.8, 120.1, 109.3, 121.5, 109.3, 123.6, 109.7, 125.7, 110.1, 127.5, 111.3, 129, 111.3, 130.4, 111.8, 131.6, 112.3, 132.8, 112.5, 134.1, 112.8, 135.8, 113.2, 136.4, 114, 138, 115, 138.9, 115.2, 139.8, 116, 140.7, 117.3, 142.2, 118.7, 142.6, 119.6, 143.5, 120.8, 144.2, 121.7, 145.4, 122.7, 146.1, 123.4, 146.7, 124, 147.3, 124.9, 147.3, 125.7, 147.9, 126.3, 148.2, 127.9, 148.8, 129, 148.6, 129.4, 149.2, 130.4, 149.3, 131.7, 149.6, 132.5, 149.6, 134, 149.7, 135.1, 149.6, 135.9, 149.4, 136.8, 148.9, 138, 148.5, 138.7, 148.4, 139.4, 148.1, 140.2, 147.9, 140.7, 147.7, 141.3, 147.7, 141.8, 147.2, 142.8, 146.5, 143.4, 146.2, 144.2, 145.7, 145.1, 145.9, 146.4, 145.6, 147.5, 145, 148.4, 144.6, 149.1, 144, 150.2, 143.3, 151.4, 143, 152.6, 142.1, 153.8, 141.1, 154.7, 140, 155.5, 138.5, 157.1, 137.2, 157.7, 135.4, 158.2, 133.8, 158.4, 132.3, 158.5, 130.4, 158.7, 130.3, 158.7, 129.6, 158.7, 129.3, 158.7, 128.4, 158.7, 127.3, 158.6, 125.7, 158.5, 124.4, 158.4, 123.8, 158.4, 123.1, 157.7, 123, 158.5, 121.4, 158.7, 121.1, 159.1, 120, 159.1, 119.7, 159.6, 119.2, 159.6, 118.4, 159.3, 117.5, 159.3, 116.3, 159.2, 114.3, 158.6, 111.1, 155.4, 110.1, 154, 109.1, 153.4, 107, 152.1, 106.9, 151, 106.6, 149.9, 106, 149.5, 105.6, 149.2, 105.2, 148.5, 105, 148.2, 104.3, 148.4, 104.2, 147.2, 103.5, 147.5, 102.4, 146.9, 101.5, 146.2, 101.3, 144.7, 100, 144, 99.2, 143.3, 98.7, 141.8, 98.9, 141.1, 98.4, 141, 98.1, 139.8, 97.6, 139.2, 97.4, 138.2, 97.6, 137.1, 98.2, 136.4, 98.8, 135.6, 97.4, 133.5, 98.1, 132.1, 98.2, 131.6, 98.7, 131, 98.8, 130.4, 99.2, 129.5],
				[74.1, 153.3, 75.9, 148.9, 77.7, 145.6, 79.9, 142.6, 82.8, 139.9, 87.7, 137, 94.3, 135.2, 99, 135.2, 104.8, 134.2, 109, 132.5, 111.7, 131.4, 114.4, 130.2, 118.1, 128.7, 120.6, 126.9, 123.4, 125.7, 126.3, 124.9, 128.3, 123.9, 128.4, 121.9, 127.8, 119.5, 126.5, 116.5, 126, 113, 126.2, 109.6, 126.4, 107.1, 127.3, 103.8, 128.5, 101.5, 129.1, 100.6, 130.2, 99.1, 131.8, 97.7, 134.4, 96.5, 136.5, 95.7, 140, 94.4, 142.7, 93.9, 146.1, 93.7, 150.6, 93.9, 154.4, 95, 158.1, 96.5, 163, 99.3, 165.3, 101.1, 167.5, 103.6, 169.2, 105.6, 170.1, 107.4, 170.6, 109.4, 170.4, 111.2, 169.9, 114.3, 169.5, 117.5, 169.2, 120.1, 167.9, 123.1, 168.6, 125.1, 169.9, 127.1, 167.3, 128.5, 166.6, 130.2, 164.6, 130.7, 161.5, 131.7, 162.4, 134.2, 162.1, 135.6, 159.7, 135.3, 159, 137.8, 161, 140.8, 162.1, 144.7, 163.9, 149.5, 166.4, 154, 169.3, 157.3, 172.1, 160.8, 173.2, 163.9, 175.2, 169.2, 177.2, 175.6, 181.3, 176.6, 183.2, 177.9, 184.2, 179.9, 182.3, 180.7, 178.1, 180.9, 174.3, 179.9, 169.9, 179.3, 168.1, 181.1, 165.7, 181.6, 165.2, 180.2, 165.9, 178.4, 165.9, 175.9, 165, 174, 161, 169.5, 156.8, 163.6, 154.3, 159.9, 152.8, 155.5, 150.8, 149.9, 148.3, 150.8, 143.5, 154.1, 137.9, 156.8, 132.3, 160.1, 127.5, 163.6, 122.8, 164.9, 121.2, 166.2, 121.7, 168.7, 122.4, 173.1, 124.3, 175.6, 126.3, 175.9, 133.9, 177.8, 136.8, 180.2, 136.8, 183, 135, 183, 133, 181.4, 132.6, 183.4, 130.4, 183.7, 129.5, 181.9, 126.4, 182.1, 125.5, 183.2, 125.2, 185.2, 123.5, 185.2, 122.4, 183.2, 118.6, 182.6, 115.5, 181.9, 112.8, 180.4, 110.8, 176.4, 108.1, 177.9, 104.8, 178.1, 99.7, 176.6, 95.5, 174.5, 92.3, 172.3, 89.4, 170, 88.1, 170.2, 87.2, 172.6, 85.7, 175.3, 84.1, 176.9, 81.4, 178.1, 79, 178.4, 76.3, 178.9, 72.6, 178.9, 68.8, 177.1, 66.3, 175.2, 65, 171.2, 63.4, 172.1, 61.9, 171.8, 61.2, 168.7, 59.5, 167.2, 59, 164.4, 59.5, 161.6, 61.4, 159.8, 63.2, 157.8, 64.6, 154.5, 67.9, 150.8, 70.1, 151.3, 71.5, 153.5, 72.3, 155.8, 73.4, 156.6],
				[103.2, 75.1, 105.2, 73.1, 109.2, 71.8, 114.2, 69.4, 114, 65, 113.8, 61.4, 120.2, 60.4, 117.2, 55.8, 115.5, 51.4, 113.8, 44.4, 113, 40.3, 111.5, 37.8, 111.8, 32.1, 113.2, 26.1, 116.8, 21.8, 123.8, 18.4, 129.5, 16.4, 135.2, 19.1, 140.2, 23.8, 142, 26.3, 145, 29, 145.3, 34.9, 146, 38.3, 145.5, 39.1, 146.7, 42.3, 144.8, 45.8, 142.8, 49.4, 141.2, 51.4, 140.7, 53.7, 137.8, 54.8, 136.2, 57.1, 136.5, 59.1, 140.2, 59.4, 141.3, 64, 148.5, 66.1, 156.5, 68.1, 162.8, 70.1, 165.2, 73.8, 166.8, 81.8, 167.8, 92.1, 168.8, 103.4, 171.2, 117.4, 171.2, 128.1, 171.3, 135, 171.8, 142.3, 175.3, 157.3, 169.3, 157.7, 166.7, 170.7, 165.3, 176.7, 160, 180.3, 155.3, 184.3, 158, 164.7, 158, 153.7, 159.3, 147, 155.8, 112.4, 153.3, 108.7, 152, 118, 151.7, 129.7, 153.3, 143.3, 154.3, 152.7, 152, 164.7, 159, 157.3, 158.3, 181.7, 153.3, 186, 147.7, 220, 144, 252.7, 143, 282, 140.7, 282.7, 139.7, 297, 137, 302.7, 122.8, 304.4, 115.8, 300.3, 117.8, 296.1, 123.2, 287.1, 128, 279.7, 129.2, 262.4, 130.5, 246.1, 130.5, 236.4, 130.5, 228.1, 131.2, 219.4, 130.8, 210.4, 130.1, 203.2, 126.8, 193.4, 125.5, 200.4, 123.7, 205.7, 121.3, 213, 119.7, 222.7, 119.3, 231, 119.3, 239.1, 119.3, 245.7, 119.6, 261.2, 120.6, 265.6, 120.6, 272.9, 121.6, 280.2, 123.3, 289.2, 117, 292.2, 113, 292.9, 110, 293.7, 108.6, 290.9, 105.6, 291.9, 102, 292.3, 96.3, 292.6, 90.5, 291.4, 86.3, 290.6, 86, 286.9, 91.3, 285.6, 96.6, 284.3, 101, 281.9, 104, 278.9, 104.6, 273.9, 104.6, 266.3, 104.6, 257.9, 104, 251.9, 102.6, 243.6, 101, 236.9, 100.7, 228.3, 101, 221.7, 100.7, 215, 101.7, 208.7, 101.3, 199.7, 100.7, 193.7, 99.7, 186, 98, 181.7, 92.5, 181.8, 90.2, 178.8, 88.5, 174.4, 89.2, 169.8, 91.8, 164.1, 92.8, 159.1, 90.2, 158.1, 89.2, 154.8, 92.2, 145.4, 94.5, 138.4, 96.5, 129.8, 97.8, 122.8, 99.2, 118.4, 99.5, 112.8, 98.5, 109.1, 98.8, 105.4, 99.2, 102.8, 99.5, 92.1, 99.2, 82.8, 100.5, 77.4],
				[70.3, 76.7, 86, 75.4, 99.5, 75.7, 108.5, 72.7, 128, 69.7, 136.8, 63.7, 138.2, 60.8, 139.5, 58.1, 136.8, 49.4, 134.5, 45.4, 133.2, 40.1, 132.2, 36.1, 133.2, 32.1, 133.8, 28.4, 137.5, 24.4, 145.2, 20.1, 151.8, 19.4, 159.5, 23.1, 161.8, 26.4, 164.5, 30.1, 165.5, 32.8, 165.8, 35.8, 166.6, 37.6, 168.5, 41.1, 166.8, 43.8, 165.8, 47.8, 164.2, 52.7, 163, 54.7, 162.2, 56.4, 165.8, 58.9, 168.8, 59.9, 169.2, 56.7, 172.5, 56.7, 177.2, 58.9, 180, 62.2, 179.5, 67.4, 191.8, 72.4, 196.8, 74.9, 206, 79.4, 210, 86.9, 207, 92.4, 192.2, 92.4, 180.8, 90.9, 177, 108.4, 171.2, 129.9, 173.8, 138.4, 176, 153.7, 169.5, 163.8, 168.8, 168.8, 168.8, 172.4, 168.5, 176.1, 167.2, 182.4, 164.8, 183.8, 164.5, 190.8, 163.8, 197.1, 162.8, 203.8, 163.2, 210.8, 163.8, 219.4, 164.8, 228.4, 165.5, 236.1, 166.2, 246.8, 165.5, 256.8, 165.5, 265.4, 164.5, 275.4, 164.8, 284.4, 162.5, 292.1, 163.5, 301.1, 162.2, 304.8, 154.2, 305.1, 144.2, 309.4, 138.2, 308.8, 132.8, 306.1, 131.8, 303.4, 141.2, 298.1, 149.5, 269.8, 149.2, 261.4, 149.8, 249.1, 150.5, 238.8, 150.8, 231.1, 150.2, 223.1, 149.2, 217.4, 149.5, 210.4, 149.8, 195.4, 152.8, 202.4, 151.5, 211.1, 151.2, 221.7, 151.5, 231.8, 151.5, 239.1, 152.8, 247.8, 152.8, 254.4, 151.2, 260.8, 150.5, 266.1, 149.8, 273.1, 150.8, 280.4, 152.5, 289.4, 148.5, 295.8, 142.2, 297.4, 137.5, 298.1, 134.5, 298.8, 126, 299.7, 118.8, 298.7, 115, 293.7, 120.2, 289.2, 128, 286.2, 134.8, 282.7, 136.2, 272.9, 133.5, 251.7, 130, 229.7, 127.8, 209.9, 125, 181.9, 126, 169.9, 125.5, 133.4, 124.2, 122.9, 121.2, 108.7, 119.8, 91.7, 102, 89.7, 91.5, 91.4, 49.3, 89.2, 42.3, 91.4, 41.3, 114.4, 58.3, 150.7, 102.3, 174, 120.5, 189.7, 118, 190.7, 103, 177, 58.3, 156.7, 32.7, 119, 36.7, 92.3, 31.3, 87.3, 33.3, 78.7, 36, 77, 33, 58.9, 30.5, 46.9, 58, -0.8, 102.5, -22.8, 117.3, -37.3, 119.5, -36.8, 102.8, -21.1, 59, 3.2, 40.8, 53.2, 42.8, 76.9, 50.8, 77.2, 57, 79.2],
				[56, 65.7, 40, 58.7, 26, 69.2, 26, 87.2, 41.5, 94.7, 42.5, 116.5, -16.5, 146, -18, 52.2, 37.5, 36.7, 37.5, 3.7, 178, -24.6, 178, 21.7, 183.8, 23, 179.5, 28.5, 168.7, 28.7, 164, 38, 168.8, 46.8, 179.2, 46.2, 184.8, 37.5, 178.3, 26.3, 181.6, 24.4, 186.4, 25.6, 193.1, 32.2, 192.2, 32.9, 195.2, 40.1, 193.1, 42.8, 194.7, 47.8, 193.3, 48.2, 194.3, 55.7, 192.3, 54, 190.3, 62, 185.6, 64, 183.3, 72.9, 187.6, 81.9, 191.1, 100.8, 183.5, 141.7, 178, 158.2, 174, 168.2, 174.5, 173.7, 172.5, 180.7, 167, 190.2, 161, 196.7, 153.5, 200.7, 146, 204.2, 141, 205.2, 135.5, 205.7, 130, 205.7, 125, 206.2, 117, 206.2, 111.6, 206.1, 108.8, 206.1, 105, 205.6, 101.9, 204.7, 99.8, 205.6, 96, 204.4, 92.2, 204.4, 89.2, 206.1, 87.8, 212, 88.9, 221.2, 94.1, 234.5, 98.2, 248.4, 98.4, 254.6, 96.7, 259.5, 92.5, 260.5, 89.4, 263.1, 88.7, 273, 88, 276.6, 81.4, 277.7, 79.2, 282.2, 75.7, 285.3, 66.6, 285.5, 56.9, 287.1, 50.7, 287.1, 40.6, 287.4, 33, 285.5, 27.3, 281.9, 26.4, 276.7, 31.8, 271.8, 41.3, 271.1, 51.7, 267, 57.1, 262.8, 51.9, 260.7, 47.4, 258.1, 46, 254.7, 48.6, 250.5, 53.3, 250.5, 56.4, 250.5, 60.7, 247.6, 63.5, 240.6, 65.4, 233, 63.5, 222.6, 56.1, 210.1, 52.3, 201.3, 50.4, 191.2, 51.8, 182.7, 59.2, 179.1, 63.7, 175.5, 65.2, 171.8, 69.6, 167.7, 74.9, 165.8, 121.2, 164.4, 125, 163.2, 127.1, 159.2, 128.4, 148.6, 131.5, 138.2, 122.8, 141.7, 107.6, 140.2, 100, 136.2, 89.5, 132.7, 85, 128.2, 75.5, 129.7, 68.5, 127.2, 71.5, 122.2, 82, 119.2, 90.5, 119.7, 118, 122.7, 133.2, 117.1, 140.3, 105.6, 148.3, 84.5, 153.3, 78.6, 163, 73.9, 165, 71.2, 166.5, 67.7, 159.5, 68.7, 154.5, 61.6, 156, 59.9, 153.5, 58.7, 154, 55.2, 150, 52.2, 153, 45.2, 153, 37.2, 158.5, 29.2, 162.3, 25.1, 169.5, 22.2, 176.5, 21.7, 177, -22.6, 39, 4.7, 39, 36.2, 84.5, 23.7, 84.5, 97, 40.5, 117.5, 39.5, 95.7, 56, 83.2],
				[89.6, 59, 92.9, 53.8, 97.6, 50.7, 102.4, 49.2, 108.2, 46.8, 111.4, 45.2, 114.5, 42.9, 115.3, 39.5, 113.7, 35.4, 112.1, 28.6, 110.3, 22.9, 111.6, 19.8, 113.2, 16.4, 116.5, 12.3, 119.7, 9.4, 122, 7.8, 124.9, 6.5, 129, 7.1, 131.6, 6.3, 135.5, 7.8, 138.1, 11.7, 140.4, 14.3, 142, 19.3, 143, 23.4, 142.2, 26.5, 140.9, 30.2, 138.9, 36.1, 136.3, 40, 133.4, 43.7, 135.5, 47.6, 137.6, 50.1, 144.6, 53, 148.5, 55.1, 151.6, 58.5, 152.4, 62.9, 151.9, 70.4, 150.8, 79.7, 150.3, 84.9, 150.6, 90.9, 151.3, 97.1, 153.1, 103.4, 156, 109.6, 159.1, 115.3, 160.4, 121, 161.5, 126.7, 162.8, 132.7, 162, 136.6, 157, 140, 154.4, 142.8, 153.1, 148.8, 148.2, 146.7, 146.9, 151.1, 148, 156.8, 148.2, 162.5, 146.4, 167.5, 146.4, 171.1, 146.7, 175.3, 146.9, 179.7, 146.7, 189, 145.9, 197.3, 145.6, 205.1, 145.4, 213.2, 144.1, 223.5, 142.8, 233.1, 144.3, 242.5, 146.4, 253.7, 145.9, 267.7, 146.7, 274.9, 150.3, 278.8, 157, 280.9, 160.9, 283.2, 162.5, 286.4, 159.9, 288.4, 156.3, 289.7, 150, 290, 143.5, 289.7, 139.4, 287.7, 136, 286.4, 131.1, 286.6, 124.6, 285.3, 125.4, 280.7, 125.4, 262.2, 124.1, 250.5, 123.7, 225.3, 115.3, 225.3, 117.6, 254.4, 118.9, 265.3, 117.6, 273.1, 115.3, 277.3, 115.8, 280.4, 115.5, 287.1, 114.5, 292.6, 111.1, 295.2, 106.2, 295.4, 101, 294.4, 98.6, 290.3, 98.4, 287.1, 100.2, 284.5, 101.2, 281.4, 101, 278.8, 99.9, 276.8, 99.4, 275.1, 99.4, 272.6, 99.4, 269.2, 98.4, 264.6, 96.8, 260.7, 95.8, 257, 94.5, 252.1, 94.7, 247.7, 94.7, 241.7, 93.8, 223.3, 83.3, 223, 76.1, 223, 54.2, 223.2, 54.2, 215.7, 54.2, 205.1, 54.2, 191.8, 54.2, 176.8, 54.2, 165.9, 82, 165.3, 85.9, 158.6, 87, 153.7, 87, 149.5, 87, 144.6, 87, 141.5, 86.4, 150.1, 87, 146.7, 87.5, 142.5, 87.2, 137.8, 87.8, 132.8, 87.2, 129.3, 86.7, 125.4, 87.2, 120.8, 87, 118.2, 86.7, 113.2, 85.9, 108.3, 86.2, 103.6, 86.4, 98.2, 86.4, 91.4, 86.4, 86.7, 87, 80.5, 87.7, 73, 88.8, 65.2],
				[79.1, 141, 83.6, 144.4, 89, 123.6, 83.2, 121.3, 94.5, 82.4, 97.6, 65.6, 101.6, 57.8, 123.9, 46.3, 123.2, 42, 120.8, 35.3, 119.5, 28.1, 117.6, 25.9, 117.4, 16.6, 121.1, 8.5, 128.5, 3.3, 141.2, 4.8, 149.4, 15.1, 147.1, 15.6, 150.4, 18.3, 148.8, 20.9, 150.4, 24.3, 148.1, 28.4, 148.8, 33.5, 145.5, 36.6, 143.9, 39.5, 143.1, 45, 147.4, 47, 155, 48.4, 161, 50.5, 168.2, 58.4, 174.2, 72.1, 177.6, 90.9, 181.9, 128.4, 177.9, 127.9, 176, 130, 176.4, 142.8, 175.6, 146.6, 176.2, 156.1, 173.5, 162.8, 167, 165.4, 164, 163.3, 162, 158.4, 162.1, 153, 166.4, 147.1, 167.6, 137.3, 160.8, 105.6, 160.9, 117, 160.4, 127.5, 157.8, 137.4, 161.5, 164.6, 158.4, 167.5, 160.9, 190.3, 157.5, 189.9, 155.8, 205.1, 153.9, 226.8, 151, 240.5, 149.6, 254.9, 149.5, 264.4, 146.8, 270.4, 148.1, 274.6, 155.4, 278.6, 157.4, 283.4, 153.6, 285.5, 136.9, 285.4, 133.1, 283.1, 132.6, 278.1, 130.5, 274.9, 130.1, 269.9, 135.4, 255.9, 135.4, 237.1, 135.9, 229.4, 136.5, 198.1, 134.6, 191.3, 124.2, 191.6, 122.4, 202.4, 119.4, 209.9, 117.5, 223.6, 116.9, 254.6, 115.8, 263.3, 116.5, 270, 114.2, 279.6, 109.2, 281.9, 104.6, 287.6, 92.1, 288.1, 90.9, 284.5, 96.6, 277.3, 97.5, 274, 98.4, 270.8, 97.6, 267.8, 97.6, 265.8, 96.8, 263.5, 98.1, 259.9, 98.8, 257.6, 99.4, 255.4, 99.9, 252.5, 99.8, 249.1, 99.6, 246.1, 99.6, 242.6, 99.4, 238.4, 99.2, 232.8, 98.8, 227.8, 101.8, 221.4, 100.6, 201.9, 101.6, 192.4, 96.9, 192.6, 100.2, 164.3, 98.5, 159.9, 100.6, 157.8, 102.8, 144.1, 102.5, 121.6, 100.2, 126.3, 98.2, 125.8, 94.1, 133.4, 92.5, 142.6, 94, 147.9, 91.9, 154.9, 89.6, 154.8, 86.4, 155.6, 82.5, 149.5, 82.9, 146.4, 78, 143.1, 74.5, 147.9, 68.8, 143.4, 72.2, 139.3, 70.9, 138.3, 69.9, 140, 66.4, 141.3, 63.4, 139.8, 62.2, 137.1, 63.8, 133.6, 62.2, 132.4, 59.2, 136.6, 54.6, 126.4, 66, 126.8, 63.9, 130.9, 65.1, 131.6, 67.6, 130.1, 70.8, 130.8, 72.9, 133.5, 72.2, 136.6, 73.2, 137.4, 76.5, 133.1, 81.8, 136.8],
				[84.5, 68.8, 87.5, 64.8, 88.3, 61.2, 91.7, 57.8, 96.5, 56.8, 108, 54.2, 113, 53.7, 114.5, 49.7, 111.5, 44.1, 107.5, 41.7, 107.5, 35.4, 105, 29.7, 107.5, 23.7, 109.2, 19.8, 112.8, 15.4, 120.2, 10.4, 126.5, 12.1, 132.2, 12.8, 137.2, 17.4, 139.8, 22.1, 139.5, 24.4, 142.3, 28.6, 140.6, 29.3, 142.5, 32.8, 141.8, 36.8, 139.8, 39.4, 138.8, 41.1, 136.8, 43.8, 135, 50.2, 137, 53.7, 146.5, 56.2, 149.3, 58.3, 152, 59.2, 156, 60.2, 158.5, 63.4, 161.2, 67.1, 163.2, 72.1, 164.5, 77.1, 165.5, 83.4, 166.5, 89.8, 167.8, 98.8, 169.8, 105.8, 172, 114.7, 173, 121.7, 176.5, 128.1, 178.2, 137.8, 178, 142.3, 179.7, 149.7, 180.5, 154.2, 181.7, 157.8, 182, 161, 180.2, 162.3, 182.2, 169.2, 191, 169.7, 196, 191.4, 179.7, 212.7, 145.7, 209, 162, 188.3, 155.7, 168.3, 157.5, 166.7, 167.7, 167.2, 167.5, 165, 168, 160, 166.8, 159, 163.5, 140.2, 156.2, 120.4, 153.5, 116.8, 151.8, 133.1, 153.5, 146.2, 154, 152.2, 152.5, 167.2, 151.8, 183.1, 153.8, 192.8, 149.2, 212.1, 148.2, 225.1, 148.8, 234.8, 143.8, 248.4, 143.8, 265.4, 142.8, 274.4, 139.5, 280.1, 144.2, 286.1, 152.5, 290.8, 150.5, 296.4, 139.8, 297.4, 131.5, 296.4, 123.8, 293.8, 121.2, 287.4, 120.3, 280.3, 123.2, 269.1, 124.2, 247.8, 124.8, 232.8, 127.5, 222.8, 125.5, 215.4, 125.5, 208.8, 126.5, 200.1, 125, 187.7, 119.2, 170.4, 115.8, 170.1, 111.2, 184.1, 107.8, 207.4, 107.2, 215.4, 106.2, 224.4, 106.2, 246.4, 105.2, 260.8, 104.8, 270.8, 106.2, 277.8, 101.8, 285.4, 99.2, 289.4, 93.5, 291.4, 90.2, 295.8, 85.2, 296.4, 74.5, 294.7, 74.2, 290.4, 80.5, 285.8, 89.1, 269.2, 87.5, 256.7, 87, 242.2, 87.5, 226.2, 87.5, 215.2, 79.2, 156.9, 81.5, 157.7, 83.2, 158.4, 88.2, 174.7, 65, 166.7, 47.7, 160.9, 45.7, 158.4, 45.2, 155.7, 33.5, 151.4, 32.7, 150.4, 33.5, 147.4, 34.6, 146.5, 47.5, 150.7, 49.2, 149.3, 51.7, 148.9, 63.9, 152.5, 64, 150.4, 66.7, 146.4, 67.5, 140.7, 69.7, 136.2, 69.7, 123, 70.9, 105.5, 73.8, 92.6, 81.5, 74.1],
				[86, 82.2, 86.2, 79.2, 86.8, 75, 87.5, 70.7, 89.5, 66, 90.5, 60.4, 95, 56.2, 98.3, 53.9, 101.2, 52.4, 106.8, 48.4, 112, 41, 110.2, 37, 107.2, 33, 104.5, 26.2, 102.8, 17.7, 103.5, 9.4, 107.2, 5.4, 113.2, 1.4, 122.8, 1.7, 128.2, 6.4, 132.8, 14.4, 132.8, 19, 131.5, 21.7, 131.2, 26.7, 128, 31.2, 129, 35.2, 131.8, 39.4, 136.3, 43.7, 140.2, 46, 152.5, 49.7, 158.8, 53.5, 160.8, 61.4, 162.5, 70.4, 163.5, 77.7, 164.5, 85.5, 164.5, 94.4, 164.3, 101.5, 162, 112.2, 155, 119.2, 152.5, 125.7, 152, 129.7, 152, 136.2, 151, 142.7, 151.5, 147.7, 151.5, 151.2, 152, 155.5, 151.2, 158.7, 153.2, 163, 152.2, 167.4, 152.8, 172.4, 154.2, 176, 155, 180.2, 156.3, 185.9, 157.2, 195.2, 158.5, 201.5, 159.3, 208.5, 160.3, 214.4, 161, 223, 161.7, 227.9, 161.2, 238, 160.8, 245.5, 160.7, 253.4, 160.8, 261.7, 161.3, 270.2, 161, 275.2, 161.7, 279.4, 161.7, 282.4, 159, 284.7, 156.7, 287.4, 155.8, 289.4, 151.3, 293.7, 147.3, 295.7, 140.2, 296.2, 136, 294.7, 133.7, 291, 137.8, 285, 144.2, 279.9, 144.7, 275.4, 140, 269.5, 139.3, 249.2, 138.2, 230.2, 135, 213, 126, 190.9, 124.8, 200, 124.2, 210, 123.5, 217.5, 123.7, 224.2, 123, 230.4, 122.8, 233.7, 123, 242, 123, 247.5, 122.7, 254.7, 121, 259.9, 119.7, 264.5, 118, 268.4, 116, 269.7, 113.5, 270.7, 109.8, 270.7, 107.2, 271, 104.3, 271.2, 98.5, 274.7, 91.7, 275.7, 85.5, 276.4, 81, 273.9, 80.5, 271.2, 84, 267.4, 87.2, 266, 91, 264.9, 94.7, 262, 97.2, 260.4, 98.8, 256.9, 99.7, 251.7, 101.3, 246.5, 102.2, 241.4, 103.2, 231, 103.5, 222.4, 102.8, 215.4, 102.2, 209.7, 101.8, 203.7, 102.2, 198.7, 100.2, 187.7, 97.2, 179, 96.8, 171.7, 95.2, 167, 94.5, 161.4, 94.2, 155.7, 92.5, 147, 92.8, 140.7, 92.5, 135.7, 89.2, 130.7, 86.5, 127, 85.2, 121, 85.2, 116, 85.2, 112, 85.7, 108.7, 85.8, 105.5, 86.3, 103, 86.3, 100, 85.8, 96, 85.5, 93.4, 85.3, 90.9, 86.2, 87.7, 86, 84.9],
				[65, 55.1, 75, 62.8, 76, 61.8, 98.3, 74.5, 106.5, 69.9, 118.5, 59.4, 119.5, 56.4, 124.5, 50.5, 130, 44.5, 136.5, 43.5, 142.5, 41.5, 143.3, 36.9, 139.7, 35.5, 137.3, 24.5, 136.7, 12.8, 136.3, 8.8, 139.2, 4.6, 145.2, 0.7, 154.8, 1, 160.2, 5.6, 163, 8.8, 165.3, 17.1, 162, 19, 161, 24.5, 160, 30.5, 160, 34.5, 162, 40.5, 166, 43.5, 171.5, 47, 186, 51.5, 191, 56, 191, 61.4, 191, 65.9, 196.5, 76.4, 199, 86.9, 203.5, 97.4, 203.5, 103.9, 200.5, 114.4, 195, 121.9, 190.5, 128.4, 190, 132.4, 192, 138.9, 193, 145.4, 193.5, 150.4, 193.5, 153.9, 187, 155.4, 181.5, 157.4, 176.5, 157.4, 174, 148.4, 172, 144.4, 169, 154.9, 167, 167.4, 166, 177.9, 166, 188.9, 166.5, 197.9, 168, 204.4, 169.5, 209.9, 172, 218.4, 172, 224.4, 172, 232.4, 171, 240.9, 169.5, 249.9, 168, 259.4, 166.5, 265.4, 165.5, 273.9, 164, 277.4, 164, 282.9, 160, 287.9, 153, 291.4, 147, 292.4, 140, 292.4, 135, 289.9, 141.5, 281.9, 147, 276.9, 148, 270.4, 146.5, 259.4, 153, 242.9, 150, 232.9, 149.5, 225.9, 147.5, 213.9, 144.5, 199.9, 141.5, 190.9, 139.5, 183.9, 135, 194.9, 132, 204.9, 130, 211.4, 127, 219.9, 127, 225.9, 129, 236.4, 129, 242.4, 129, 250.4, 129.5, 255.4, 130, 263.4, 132, 269.4, 132.5, 275.4, 132.5, 281.4, 130.5, 284.9, 124, 284.9, 120, 284.9, 116, 280.4, 113.5, 284.4, 107, 284.9, 101, 286.4, 95, 286.4, 91, 286.9, 87, 283.4, 90.5, 278.4, 98.5, 276.4, 104, 274.4, 108.5, 271.9, 113.5, 262.4, 111, 255.9, 112.5, 248.4, 110, 242.9, 109.5, 230.4, 109.7, 180.1, 114.3, 148.8, 110.7, 144.8, 111.7, 136.1, 121, 88.5, 119.7, 83.5, 116, 84.5, 100, 92.5, 86.3, 87.1, 79.3, 82.8, 70, 77.5, 70, 75.5, 68, 74.5, 69.3, 71.1, 66.8, 67.8, 61.8, 67.2, 58.8, 64.8, 55.8, 65.8, 51.8, 61.2, 50.8, 57.2, 48, 58.8, 46.4, 57.2, 48.3, 55.1, 21, 33.1, 21.7, 31.9, 50.8, 53.1, 53.3, 52.8, 62.3, 52.1],
				[87.9, 74.5, 91.8, 68.3, 96.4, 61.4, 104.7, 52.2, 109.8, 47.1, 117.3, 42.2, 112.5, 41.9, 109.6, 37.4, 108.6, 32.4, 107.8, 24.2, 107.8, 20.7, 107.2, 14.9, 107.6, 11.9, 108.3, 8.5, 110, 6.1, 112.8, 2.7, 116.2, 1.4, 121.8, 0, 126, 0.6, 130.2, 2.9, 134, 6.5, 136.4, 9.5, 137.7, 13.7, 138.2, 17.1, 138.2, 19.4, 137.4, 23.6, 136.5, 27.9, 135.3, 32, 135, 35.7, 138.3, 35.4, 140.1, 39.3, 142.1, 41.7, 149.9, 44.7, 158.4, 50.3, 161.9, 52.5, 164.3, 59.9, 167.7, 70, 172.8, 86.8, 174.9, 93.1, 174.5, 100, 173.3, 104.5, 171.8, 107.9, 169.5, 110.3, 166.2, 114.7, 162.7, 120.7, 159.5, 127, 157.7, 129.8, 156.8, 132.1, 157.4, 137.7, 158, 142.8, 158.4, 146.8, 159.8, 151, 160.4, 155.8, 157.7, 158.5, 154.1, 160.8, 151.1, 162.4, 149, 163.9, 150.5, 169.9, 150, 177.9, 148.4, 184.9, 147, 194.4, 145.8, 207.8, 144.8, 224.7, 142.4, 268.2, 141, 276.8, 138.6, 277.4, 140.3, 285.8, 139.5, 291.2, 135.9, 295.9, 127.4, 304.7, 123, 306.2, 120, 306.1, 116.8, 305.2, 113.8, 303.8, 112.6, 300.7, 113.7, 298.3, 115.3, 295, 118, 289.4, 120.7, 284.9, 122.1, 282.2, 122.2, 279.5, 120.3, 278.8, 119.2, 276.2, 118.3, 274.1, 116.4, 275.9, 113.2, 277.3, 108.7, 277.6, 104.4, 277.9, 99.3, 278.2, 94.6, 279.1, 91.6, 279.8, 87.3, 279.7, 84.4, 278.9, 82, 278, 81, 277, 80.8, 275, 82.5, 271.9, 85.8, 270.5, 91.8, 269.3, 94.2, 268.2, 96.9, 265.2, 97.8, 263.9, 96, 262.4, 97.2, 260.4, 98.8, 256.8, 99.3, 254.7, 97.6, 252.2, 95.7, 250.2, 96.9, 248.4, 97.8, 245.4, 98.1, 239.7, 96.7, 229.5, 94.3, 218.9, 90.4, 205.1, 87.3, 193.3, 84.6, 182.1, 82.8, 174.7, 81.4, 167.2, 80.4, 161.1, 79.3, 155.4, 79.2, 151.5, 79.5, 149.7, 77.8, 149.1, 75.6, 148.3, 74.9, 147.4, 73.4, 146.4, 73.3, 142.8, 73.8, 138.7, 73.5, 134.2, 74.1, 129.4, 74.4, 125.5, 74.6, 121.7, 75.3, 117.5, 75.7, 114.4, 76, 111.4, 76, 110, 76, 109, 76.3, 106.9, 76.8, 103.7, 77.4, 99.7, 78.7, 94.1, 81.4, 86.9, 84.6, 80.2],
				[95, 97.2, 94.6, 93.7, 94.6, 84.3, 94.2, 75.6, 95.8, 68.4, 94.8, 61.3, 93, 57.8, 94.1, 54.3, 90.8, 54.2, 84.5, 57.5, 82.8, 49.4, 80.5, 44.5, 75.2, 42.5, 77.2, 34.5, 72.7, 27.2, 72.8, 18.5, 75.3, 15.9, 80, 10.2, 88.2, 7.9, 97.7, 8.2, 102.3, 11.9, 104.5, 18.5, 106.8, 23, 106.8, 27, 107.3, 30.5, 111.7, 32.4, 114, 34.9, 121.2, 37.9, 127.2, 40.5, 133.8, 45.2, 141.2, 51.9, 145.2, 61.2, 149, 70.9, 151.2, 80.9, 152.8, 93.4, 154.7, 106.7, 156.5, 116.9, 157.5, 123.9, 158.5, 135, 158.8, 140.2, 158.7, 146, 157.8, 149.5, 157.8, 153.9, 155, 154.9, 155, 158.2, 154, 162.7, 152.2, 169.7, 152.2, 176.7, 161.8, 171.4, 169.5, 168.9, 180, 168.2, 190.2, 170.7, 201.5, 177.2, 208, 184.7, 213.2, 194.7, 224.2, 197.9, 231.8, 203.9, 237.8, 210.9, 242.2, 221.2, 243.5, 230.7, 243, 240.2, 240, 249.2, 234.5, 255.4, 225.5, 263.2, 216.8, 266.4, 215.2, 273.2, 210.8, 281.7, 204.2, 288.7, 198.5, 292.7, 190.5, 296.4, 180, 297.7, 170, 295.9, 162.2, 293.2, 156.5, 289.2, 153, 285.7, 149.8, 281.9, 146.5, 286.9, 140, 295.4, 136.2, 298.4, 132.5, 300.7, 128.2, 302.4, 124.8, 303.4, 120.9, 303.9, 116.9, 304.4, 110.2, 304.9, 103, 303.2, 95.5, 300.1, 90.2, 296.4, 84.5, 291.2, 79, 283.1, 76.6, 276.7, 71.8, 278.9, 64.9, 280.4, 54.9, 281.1, 43.6, 278.3, 32.1, 270.8, 26.1, 262.7, 21.2, 250.7, 21, 235.9, 25.1, 225.2, 32.2, 215.1, 41.9, 208.2, 49.5, 206.1, 52.4, 197.9, 62.5, 186.2, 74.8, 180.2, 87.2, 178.9, 97, 179.9, 100, 168.3, 102.2, 155.8, 100, 156.6, 96.4, 154.6, 96.6, 146.1, 97.1, 137.2, 97.1, 130.7, 97.2, 126.1, 97.5, 119.9, 97.6, 116.6, 96, 118.2, 93.4, 119.1, 91.4, 117.8, 89.2, 115.6, 89.2, 117.4, 88.6, 118.9, 86, 120.8, 83.4, 121.8, 84.9, 122.6, 85.2, 123.9, 84.5, 124.8, 81, 124.4, 78.8, 125.3, 77.5, 124.2, 76.6, 121.8, 73, 120.3, 72.2, 118.6, 71, 115.2, 72, 113.2, 74.4, 110.3, 77.8, 107.3, 81, 107.1, 84.2, 106.7, 86.5, 104.6, 90.1, 101.1, 95, 97.2],
				[100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180, 100, 180],
				[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 35, 1, 35, 2, 35, 3, 35, 4, 35, 5, 35, 6, 35, 7, 35, 8, 35, 9, 35, 10, 35, 11, 35, 12, 35, 13, 35, 14, 35, 15, 35, 16, 35, 17, 35, 18, 35, 19, 35, 20, 35, 21, 35, 22, 35, 23, 35, 24, 35, 25, 35, 26, 35, 27, 35, 28, 35, 29, 35, 30, 35, 31, 35, 32, 35, 33, 35, 34, 35, 35, 34, 35, 33, 35, 32, 35, 31, 35, 30, 35, 29, 35, 28, 35, 27, 35, 26, 35, 25, 35, 24, 35, 23, 35, 22, 35, 21, 35, 20, 35, 19, 35, 18, 35, 17, 35, 16, 35, 15, 35, 14, 35, 13, 35, 12, 35, 11, 35, 10, 35, 9, 35, 8, 35, 7, 35, 6, 35, 5, 35, 4, 35, 3, 35, 2, 35, 1, 35, 0, 35, 0, 34, 0, 33, 0, 32, 0, 31, 0, 30, 0, 29, 0, 28, 0, 27, 0, 26, 0, 25, 0, 24, 0, 23, 0, 22, 0, 21, 0, 20, 0, 19, 0, 18, 0, 17, 0, 16, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 1],
				[0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 35, 1, 35, 2, 35, 3, 35, 4, 35, 5, 35, 6, 35, 7, 35, 8, 35, 9, 35, 10, 35, 11, 35, 12, 35, 13, 35, 14, 35, 15, 35, 16, 35, 17, 35, 18, 35, 19, 35, 20, 35, 21, 35, 22, 35, 23, 35, 24, 35, 25, 35, 26, 35, 27, 35, 28, 35, 29, 35, 30, 35, 31, 35, 32, 35, 33, 35, 34, 35, 35, 34, 35, 33, 35, 32, 35, 31, 35, 30, 35, 29, 35, 28, 35, 27, 35, 26, 35, 25, 35, 24, 35, 23, 35, 22, 35, 21, 35, 20, 35, 19, 35, 18, 35, 17, 35, 16, 35, 15, 35, 14, 35, 13, 35, 12, 35, 11, 35, 10, 35, 9, 35, 8, 35, 7, 35, 6, 35, 5, 35, 4, 35, 3, 35, 2, 35, 1, 35, 0, 35, 0, 34, 0, 33, 0, 32, 0, 31, 0, 30, 0, 29, 0, 28, 0, 27, 0, 26, 0, 25, 0, 24, 0, 23, 0, 22, 0, 21, 0, 20, 0, 19, 0, 18, 0, 17, 0, 16, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0],
				[0, 0, 6.3, 0, 12.6, 0, 18.9, 0, 25.2, 0, 31.5, 0, 37.8, 0, 44.1, 0, 50.4, 0, 56.7, 0, 63, 0, 69.3, 0, 75.6, 0, 81.9, 0, 88.2, 0, 94.5, 0, 100.7, 0, 107, 0, 113.3, 0, 119.6, 0, 125.9, 0, 132.2, 0, 138.5, 0, 144.8, 0, 151.1, 0, 157.4, 0, 163.7, 0, 170, 0, 176.3, 0, 182.6, 0, 188.9, 0, 195.2, 0, 201.4, 0, 207.7, 0, 214, 0, 225, 0, 225, 1.6, 225, 7.9, 225, 14.2, 225, 20.5, 225, 26.8, 225, 33.1, 225, 39.4, 225, 45.7, 225, 52, 225, 58.3, 225, 64.6, 225, 70.9, 225, 77.1, 225, 83.4, 225, 89.7, 225, 96, 225, 102.3, 225, 108.6, 225, 114.9, 225, 121.2, 225, 127.5, 225, 133.8, 225, 140.1, 225, 146.4, 225, 152.7, 225, 159, 225, 165.3, 225, 171.6, 225, 177.8, 225, 184.1, 225, 190.4, 225, 196.7, 225, 203, 225, 209.3, 225, 215.6, 225, 225, 221.9, 225, 215.6, 225, 209.3, 225, 203, 225, 196.7, 225, 190.4, 225, 184.1, 225, 177.8, 225, 171.6, 225, 165.3, 225, 159, 225, 152.7, 225, 146.4, 225, 140.1, 225, 133.8, 225, 127.5, 225, 121.2, 225, 114.9, 225, 108.6, 225, 102.3, 225, 96, 225, 89.7, 225, 83.4, 225, 77.1, 225, 70.9, 225, 64.6, 225, 58.3, 225, 52, 225, 45.7, 225, 39.4, 225, 33.1, 225, 26.8, 225, 20.5, 225, 14.2, 225, 7.9, 225, 0, 225, 0, 220.3, 0, 214, 0, 207.7, 0, 201.4, 0, 195.2, 0, 188.9, 0, 182.6, 0, 176.3, 0, 170, 0, 163.7, 0, 157.4, 0, 151.1, 0, 144.8, 0, 138.5, 0, 132.2, 0, 125.9, 0, 119.6, 0, 113.3, 0, 107, 0, 100.7, 0, 94.5, 0, 88.2, 0, 81.9, 0, 75.6, 0, 69.3, 0, 63, 0, 56.7, 0, 50.4, 0, 44.1, 0, 37.8, 0, 31.5, 0, 25.2, 0, 18.9, 0, 12.6, 0, 0],
				[78.6, 123, 72.4, 119.4, 73.3, 116.1, 70.8, 110.7, 65.9, 102.7, 67.5, 99.3, 65.3, 96, 61.9, 87.1, 67.5, 92.7, 73.3, 94.2, 90.9, 90.4, 86.9, 94.4, 89.8, 97.3, 90.7, 100.7, 93.8, 101.8, 105.6, 98.7, 110.7, 97.8, 108, 93.3, 104.9, 94.7, 100.5, 96.4, 96.5, 94.9, 93.8, 96.7, 91.8, 99.8, 91.8, 96, 97.1, 79.5, 98.5, 74.6, 101.7, 74.5, 110.4, 88.4, 118, 88.6, 132.8, 85, 137.1, 79.4, 138.6, 75.5, 139.1, 71.8, 141.1, 70.2, 143.1, 85.3, 146.5, 72.3, 141.8, 64.9, 132.4, 57.9, 115.7, 57.9, 104, 65.6, 131.4, 62.9, 135.4, 74.1, 134.7, 78.1, 132.3, 82.7, 115.9, 85.4, 110.6, 82.8, 106.7, 72.4, 113.5, 74.9, 120.7, 72.6, 127.5, 74.1, 135.1, 69.4, 132.8, 65, 103.5, 65.6, 94.9, 67.5, 91.6, 85.1, 87.6, 89.3, 70.4, 90.2, 65.3, 86.2, 67.7, 84.6, 77.1, 87.8, 84.9, 85.1, 78, 85.3, 74.9, 83.3, 69.7, 80, 82.4, 80.9, 95.1, 75.1, 95.6, 69.5, 72.4, 73.3, 72.2, 70.2, 98.7, 69.7, 98.9, 67, 73.5, 67.3, 80.6, 63.7, 88.9, 68.2, 96.7, 67.5, 82.9, 59.7, 70.2, 62.6, 63.7, 69.9, 59.9, 71.3, 62.6, 64.1, 64.6, 56.6, 65.5, 47.7, 67.5, 41.2, 83.5, 33.2, 101.1, 30.3, 110.5, 33.8, 134.3, 48.5, 139.7, 63.5, 140.1, 57.9, 148.6, 45.9, 143.2, 29.8, 121.6, 12, 103.8, 5.1, 84.9, 4.2, 66.2, 12.2, 57.3, 25.2, 59.9, 34.5, 56.4, 44.5, 55.5, 74.2, 58.4, 82.9, 54.4, 85.8, 54.6, 90.2, 59.5, 89.3, 58.6, 95.8, 63.3, 104.9, 58.9, 106.4, 66.8, 114.9, 74.4, 137.4, 50.8, 145.2, 0, 180.2, 205.4, 180.9, 193.2, 154.4, 173.1, 144.6, 153.7, 138.8, 140.8, 129.6, 139.9, 178.4, 83.1, 177.5, 80.2, 137.9, 108.3, 151.9, 116.1, 151.2, 135.5, 127.9, 106.4, 138.1, 102, 128.1, 109.8, 121.6, 99.4, 120.7, 96.7, 117.2, 106.7, 116.5, 121.9, 115.4, 125.2, 113.2, 122.1, 110.9, 117, 112.3, 100.9, 112, 94.9, 114, 88.7, 114, 82.2, 113.6, 81.3, 116.7, 88.9, 121.6, 96.2, 121.8, 92.9, 125.9, 99.4, 129.6, 105.2, 141, 95.4, 137.4, 80.9, 130.3],
				[111, -144.2, 117.4, -137.8, 123.9, -131.3, 130.3, -124.9, 136.8, -118.4, 143.2, -112, 149.7, -105.6, 156.1, -99.1, 162.5, -92.7, 169, -86.2, 175.4, -79.8, 181.9, -73.4, 188.3, -66.9, 194.7, -60.5, 201.2, -54, 207.6, -47.6, 214.1, -41.2, 220.5, -34.7, 226.9, -28.3, 233.4, -21.8, 239.8, -15.4, 246.3, -9, 252.7, -2.5, 259.1, 3.9, 249.5, 13.6, 239.9, 23.3, 230.2, 32.9, 220.6, 42.6, 210.9, 52.2, 201.3, 61.9, 191.6, 71.5, 182, 81.2, 172.3, 90.8, 162.7, 100.5, 153, 110.2, 143.3, 119.8, 133.7, 129.4, 124.1, 139.1, 114.4, 148.7, 104.8, 158.4, 95.1, 168.1, 85.4, 177.7, 75.8, 187.3, 66.1, 197, 56.5, 206.7, 46.8, 216.3, 37.2, 225.9, 27.6, 235.6, 17.9, 245.3, 8.3, 254.9, 2.8, 249.5, -2.7, 244, -8.1, 238.5, -13.6, 233.1, -19.1, 227.6, -24.5, 222.2, -30, 216.7, -35.4, 211.2, -40.9, 205.8, -46.3, 200.3, -51.8, 194.8, -57.2, 189.3, -62.7, 183.9, -68.2, 178.4, -73.6, 173, -79.1, 167.5, -84.6, 162.1, -90, 156.6, -95.5, 151.1, -101, 145.7, -106.4, 140.2, -111.9, 134.7, -117.3, 129.3, -122.8, 123.8, -128.2, 118.3, -133.7, 112.9, -139.2, 107.4, -144.6, 101.9, -150.1, 96.5, -155.6, 91, -161, 85.6, -166.5, 80.1, -171.9, 74.6, -177.4, 69.2, -182.9, 63.7, -188.3, 58.2, -193.8, 52.8, -199.3, 47.3, -204.7, 41.9, -210.2, 36.4, -215.6, 30.9, -221.1, 25.5, -226.6, 20, -232, 14.6, -237.5, 9.1, -242.9, 3.6, -234.9, -4.5, -226.8, -12.6, -218.7, -20.7, -210.6, -28.7, -202.5, -36.8, -194.4, -44.9, -186.3, -53, -178.2, -61.1, -170.1, -69.2, -162, -77.3, -153.9, -85.4, -145.8, -93.5, -137.7, -101.6, -129.6, -109.7, -121.5, -117.8, -113.5, -125.9, -105.4, -134, -97.3, -142.1, -89.2, -150.1, -81.1, -158.2, -73, -166.3, -64.9, -174.4, -56.8, -182.5, -48.7, -190.6, -40.6, -198.7, -32.5, -206.8, -24.4, -214.9, -16.3, -223, -8.2, -231.1, -0.1, -239.2, 8, -247.3, 14.4, -240.8, 20.8, -234.4, 27.3, -227.9, 33.7, -221.5, 40.2, -215.1, 46.6, -208.6, 53, -202.2, 59.5, -195.7, 65.9, -189.3, 72.4, -182.9, 78.8, -176.4, 85.2, -169.9, 91.7, -163.5, 98.1, -157.1, 104.6, -150.7]
			]
			var manPoint = [
				[-733.4, 4800, -417.2, 4800, -259.2, 4800, -101, 4800, 57, 4800, 215.2, 4800, 373.2, 4800, 531.4, 4800, 689.4, 4800, 847.6, 4800, 1005.6, 4800, 1480, 4800, 1321.8, 4800, 1638, 4800, 1163.8, 4800, 1796.2, 4800, 1954.2, 4800, 2112.4, 4800, 2270.4, 4800, 2428.6, 4800, 2586.6, 4800, 2744.8, 4800, 2902.8, 4800, 3061, 4800, 3219, 4800, 3377.2, 4800, 3535.2, 4800, 3693.4, 4800, 3851.4, 4800, 4009.6, 4800, 4167.6, 4800, 4325.8, 4800, 4483.8, 4800, 4642, 4800, 4800, 4800, 4800, 444, 4800, -432.4, 4800, -610.6, 4800, -923.8, 4800, -1366.8, 4800, -2726.2, 4800, -5600, 4800, -5600, 4800, -5600, 4800, -5600, 4800, -5600, 4800, -5600, 4800, -5600, 4800, -5600, 995.4, -5600, 791.4, -5600, 560.8, -5600, -5600, -5600, -5600, -5600, -5600, -5600, -5600, -5600, -5600, -3117.4, -5600, -2921.2, -5600, -2311, -5600, -1643.2, -5600, -1335.8, -5600, -1028.4, -5600, -738.4, -5600, -222.6, -5600, 252.4, -5600, 391.4, -5600, 841.2, -5600, 4800, -5442, 4800, -5283.8, 4800, -5000.8, 4800], //-733.4
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[248.6, 740.8, 258.6, 740.8, 266.7, 738.7, 273.1, 734.5, 270.7, 725.7, 256.6, 710.1, 249.8, 699.9, 249.1, 688.7, 255.1, 686.6,
					257.5, 682.8, 262.7, 622.3, 269.6, 572, 282.7, 511.1, 290.5, 493.1, 297.8, 535.2, 302.6, 589.9, 306.7, 655.8, 307.5, 659.1, 313.7, 676.4,
					317.4, 681.5, 332.1, 684.5, 343, 687.7, 360.4, 695.4, 383.6, 695.8, 390.2, 688.4, 385.1, 682.1, 362.8, 671, 348.7, 652.7, 339, 602.1,
					339.3, 557.4, 344.6, 501.4, 349.4, 454.5, 360.1, 393.2, 362.8, 387.2, 375.5, 365.3, 376.5, 334.3, 370.7, 239.3, 355.3, 215.2, 349.4, 211.6,
					320.7, 195, 330.8, 180.9, 333.5, 169.2, 339.5, 137.1, 339.9, 119.8, 314.3, 101, 295.8, 105.3, 282.6, 115.3, 267.7, 132.8, 281.7, 158.3,
					282.6, 177.3, 283.4, 184.5, 272.3, 191.1, 233.4, 207.2, 222.6, 220.9, 209.5, 263.5, 205.9, 310.2, 210.6, 331.7, 230.9, 353.2, 235.2, 373.4,
					230.7, 409.5, 228.3, 442.7, 232.7, 452.4, 232.6, 483.8, 225, 550.3, 219.6, 585.6, 214.6, 663.1, 204, 700.2, 215.7, 721.7, 218.7, 724.2,
					242.5, 739, 248.6, 740.8
				],
				[249.2, 737.3, 259.2, 737.3, 267.2, 735.2, 273.7, 731, 271.3, 722.2, 257.2, 706.6, 250.3, 696.4, 249.7, 685.2, 255.7, 683.1,
					258, 679.3, 263.3, 618.8, 270.1, 568.5, 289.3, 507.6, 291.1, 503.6, 293.4, 531.7, 297.1, 586.4, 299.3, 652.3, 300.1, 655.6, 306.3, 672.9,
					310, 678, 332.7, 681, 343.6, 684.2, 361, 691.9, 384.2, 692.3, 390.7, 684.9, 385.7, 678.6, 363.4, 667.5, 349.3, 649.2, 339.6, 598.6, 339.9, 553.9,
					345.2, 515.9, 348, 461.3, 361.1, 399.7, 360.5, 374.4, 376.1, 361.8, 377.1, 330.8, 371.3, 235.8, 355.9, 211.7, 349.9, 208.1, 330.3, 191.5,
					332.1, 182.3, 337.1, 172.7, 343.1, 140.6, 343.5, 123.3, 317.8, 104.5, 299.4, 108.8, 286.2, 118.8, 280.3, 130.3, 283.2, 161.8, 280.2, 180.8,
					270.9, 181, 260.9, 187.6, 224, 208.7, 213.2, 222.4, 210, 260, 206.5, 306.7, 211.2, 328.2, 225.5, 349.7, 229.8, 369.9, 225.3, 406, 222.8, 439.2,
					227.3, 448.9, 223.2, 480.3, 211.6, 546.8, 206.2, 582.1, 207.2, 659.6, 204.6, 696.7, 216.3, 718.2, 219.3, 720.7, 243.1, 735.5, 249.2, 737.3
				],
				[279.1, 664.3, 289.1, 664.3, 297.2, 662.2, 303.6, 658, 301.2, 649.2, 287.1, 633.7, 280.3, 623.4, 279.6, 612.2, 285.6, 610.1,
					288, 606.4, 290.2, 552.8, 297.1, 502.5, 288.6, 455.7, 297.4, 436.7, 327.9, 455.6, 375, 510.3, 373.2, 570.2, 374, 573.5, 373.2, 590.9,
					376.9, 595.9, 391.6, 599, 402.5, 602.1, 419.9, 609.8, 443.1, 610.3, 449.6, 602.9, 444.6, 596.5, 422.3, 585.4, 408.2, 567.2, 404.5, 522.5,
					404.8, 477.8, 374.7, 421.9, 355.2, 399.1, 372.8, 365.2, 397.9, 361, 412.2, 365.2, 443.1, 336.4, 456.7, 302.4, 453, 274, 449.1, 268.3,
					430.2, 241.1, 421.2, 238.3, 428.7, 228.8, 447.7, 202.3, 455.4, 186.8, 440.2, 158.9, 421.6, 155, 405.5, 158.5, 391.8, 179.9, 386.3, 197,
					379.1, 214.6, 376.8, 221.4, 363.9, 222.7, 354.7, 220.7, 326.4, 230.9, 305.2, 247.8, 262.5, 273.4, 238.6, 318.5, 260.6, 352, 125.3, 404.6,
					129.1, 416.7, 254.6, 369.2, 237.5, 401.9, 238.5, 428.5, 241.7, 456.2, 256.1, 509.1, 248.2, 586.6, 234.5, 623.7, 246.2, 645.2, 249.2, 647.7,
					273, 662.5, 279.1, 664.3
				],
				[200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 200],
				[0, 0, 100, 0, 200, 0, 300, 0, 400, 0, 500, 0, 600, 0, 700, 0, 800, 0, 900, 0, 1000, 0, 1100, 0, 1200, 0, 1300, 0, 1400, 0, 1500, 0, 1600, 0, 1700, 0, 1800, 0, 1900, 0, 2000, 0, 2100, 0, 2200, 0, 2300, 0, 2400, 0, 2500, 0, 2600, 0, 2700, 0, 2800, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 0, 2900, 1000, 0, 1000],
			];
			// contact  origami /////////////////////////
			var mailInnerPoints = [
				[25, 16.4, 41.5, 16.4, 41.5, 25, 41.5, 33.5, 25, 33.5, 8.5, 33.5, 8.5, 25, 8.5, 16.4], //01
			];
			var mailOuterPoints = [
				[25, 0, 41.5, 16.5, 50, 25, 41.5, 33.5, 25, 50, 8.5, 33.5, 0, 25, 8.5, 16.5], //start
				[25, 0, 41.5, 16.5, 50, 25, 41.5, 33.5, 25, 50, 8.5, 33.5, 17, 25, 8.5, 16.5], //left
				[25, 0, 41.5, 16.5, 33, 25, 41.5, 33.5, 25, 50, 8.5, 33.5, 17, 25, 8.5, 16.5], //right
				[25, 0, 41.5, 16.5, 33, 25, 41.5, 33.5, 25, 17, 8.5, 33.5, 17, 25, 8.5, 16.5], //bottom
				[25, 33, 41.5, 16.5, 33, 25, 41.5, 33.5, 25, 17, 8.5, 33.5, 17, 25, 8.5, 16.5], //top
			];
			var mailOuterTopPoints = [
				[8.5, 16.5, 25, 0, 41.5, 16.5],
				[8.5, 16.5, 25, 33, 41.5, 16.5]
			];
			var mailOuterOtherPoints = [
				[8.5, 16.5, 17, 25, 8.5, 33.5, 25, 17, 41.5, 33.5, 33, 25, 41.5, 16.5, 41.5, 33.5, 8.5, 33.5],
			];
			var origamiPoints = [
				[0, 0, 25, 0, 50, 0, 75, 0, 100, 0, 100, 25, 100, 50, 100, 75, 100, 100, 75, 100, 50, 100, 25, 100, 0, 100, 0, 75, 0, 50, 0, 25, 0, 0],
				[0, 0, 25, 0, 50, 0, 50, 25, 50, 50, 75, 50, 100, 50, 100, 75, 100, 100, 75, 100, 50, 100, 25, 100, 0, 100, 0, 75, 0, 50, 0, 25, 0, 0],
				[50, 50, 50, 25, 50, 0, 50, 25, 50, 50, 75, 50, 100, 50, 100, 75, 100, 100, 75, 100, 50, 100, 25, 100, 0, 100, 0, 75, 0, 50, 25, 50, 50, 50],
				[50, 50, 50, 25, 50, 0, 50, 25, 50, 50, 50, 50, 50, 50, 50, 75, 50, 100, 50, 100, 50, 100, 25, 100, 0, 100, 0, 75, 0, 50, 25, 50, 50, 50],
				[25, 50, 25, 25, 25, 25, 25, 25, 25, 50, 25, 50, 25, 50, 25, 75, 25, 100, 25, 100, 25, 100, 25, 100, 0, 100, 0, 75, 0, 50, 25, 50, 25, 50],
				[25, 50, 25, 25, 25, 25, 25, 25, 25, 50, 25, 50, 25, 50, 25, 75, 25, 100, 25, 100, 25, 100, 25, 100, 0, 100, 0, 75, 0, 50, 25, 50, 25, 50],
				[25, 50, 25, 25, 25, 25, 25, 25, 25, 50, 25, 50, 25, 50, 25, 75, 25, 100, 25, 100, 25, 100, 25, 100, 0, 100, 0, 75, 0, 50, 25, 50, 25, 50]
			];
			var formBoxPoints = [
				[0, 0, 25, 0, 50, 0, 75, 0, 100, 0, 100, 25, 100, 50, 100, 75, 100, 100, 75, 100, 50, 100, 25, 100, 0, 100, 0, 75, 0, 50, 0, 25, 0, 0],
			]
			var origamiBackLeftPoints = [
				[50, 100, 25, 100, 0, 100, 0, 75, 0, 50, 25, 25, 50, 0]
			];
			var origamiBackLeft2Points = [
				[25, 50, 25, 100, 0, 100, 0, 75, 0, 50, 25, 25, 25, 50, 25, 50],
				[25, 50, 25, 100, 25, 100, 25, 75, 25, 50, 25, 25, 25, 50, 25, 50],
				[25, 50, 25, 100, 65, 110, 65, 75, 65, 55, 25, 25, 25, 50, 65, 55]
			]
			var origamiBackRightPoints = [
				[50, 0, 75, 25, 100, 50, 100, 75, 100, 100, 75, 100, 50, 100, 50, 0],
				[50, 0, 75, 25, 100, 50, 100, 75, 100, 100, 75, 100, 50, 100, 50, 0],
				[50, 0, 75, 25, 100, 50, 100, 75, 100, 100, 75, 100, 50, 100, 50, 0],
				[50, 0, 50, 25, 50, 50, 50, 75, 50, 100, 50, 100, 50, 100, 50, 0],
				[50, 0, 25, 25, 0, 50, 0, 75, 0, 100, 25, 100, 50, 100, 50, 0],
				[50, 0, 25, 25, 0, 50, 0, 75, 0, 100, 25, 100, 50, 100, 50, 0],
				[50, 0, 25, 25, 0, 50, 0, 75, 0, 100, 25, 100, 50, 100, 50, 0]
			];
			var thankuPos = [1, 0.5, 8, 0.5, 15, 0.5, 22, 0.5, 29, 0.5, 36.8, 0.5, 44.7, 0.5, 52.5, 0.5, 60.3, 0.5, 99, 48.5, 106, 48.5, 113, 48.5, 120, 48.5, 127, 48.5, 134.8, 48.5, 142.7, 48.5, 150.5, 48.5, 158.3, 48.5, 207, 48.5, 210.6, 48.5, 214.2, 48.5, 217.8, 48.5, 221.4, 48.5, 225.4, 48.5, 229.4, 48.5, 233.5, 48.5, 237.5, 48.5, 30.7, 96.2, 30.7, 84.3, 30.7, 72.5, 30.7, 60.7, 30.7, 48.8, 30.7, 37, 30.7, 25.2, 30.7, 13.3, 30.7, 1.5, 97.2, 96.2, 97.2, 84.3, 97.2, 72.5, 97.2, 60.7, 97.2, 48.8, 97.2, 37, 97.2, 25.2, 97.2, 13.3, 97.2, 1.5, 157.7, 96.2, 157.7, 84.3, 157.7, 72.5, 157.7, 60.7, 157.7, 48.8, 157.7, 37, 157.7, 25.2, 157.7, 13.3, 157.7, 1.5, 385.7, 96.2, 385.7, 84.3, 385.7, 72.5, 385.7, 60.7, 385.7, 48.8, 385.7, 37, 385.7, 25.2, 385.7, 13.3, 385.7, 1.5, 192, 95, 195.9, 83.2, 199.8, 71.5, 203.6, 59.8, 207.5, 48, 211.4, 36.2, 215.2, 24.5, 219.1, 12.8, 223, 1, 226.8, 12.8, 230.5, 24.6, 234.2, 36.4, 238, 48.2, 241.8, 60.1, 245.5, 71.9, 249.2, 83.7, 253, 95.5, 288.5, 96.5, 288.5, 84.6, 288.5, 72.6, 288.5, 60.7, 288.5, 48.8, 288.5, 36.8, 288.5, 24.9, 288.5, 12.9, 288.5, 1, 296, 13.1, 303.5, 25.1, 311, 37.2, 318.5, 49.2, 326, 61.3, 333.5, 73.4, 341, 85.4, 348.5, 97.5, 348.6, 85.4, 348.6, 73.4, 348.7, 61.3, 348.8, 49.2, 348.8, 37.2, 348.9, 25.1, 348.9, 13.1, 349, 1, 526, 0.5, 526.1, 12.6, 526.1, 24.6, 526.2, 36.7, 526.2, 48.8, 526.3, 60.8, 526.4, 72.9, 526.4, 84.9, 526.5, 97, 533.9, 97, 541.2, 97, 548.6, 97, 556, 97, 563.4, 97, 570.8, 97, 578.1, 97, 585.5, 97, 585.5, 84.9, 585.5, 72.8, 585.5, 60.6, 585.5, 48.5, 585.5, 36.4, 585.5, 24.2, 585.5, 12.1, 585.5, 0, 444.5, 0.5, 437.1, 6.6, 429.8, 12.8, 422.4, 18.9, 415, 25, 407.6, 31.1, 400.2, 37.2, 392.9, 43.4, 385.5, 49.5, 392.9, 55.3, 400.2, 61.1, 407.6, 66.9, 415, 72.8, 422.4, 78.6, 429.8, 84.4, 437.1, 90.2, 444.5, 96];
			//main.jss
			var loadFinishFlag = false;
			var transformRange = 0.05;
			var transformRatio = 10;
			var totalObjects = 200;
			var topBtn = new Array();
			var baseFontW = 5;
			var baseFontH = 8;
			var date = new Date();
			var eventYear = [1981, 1982, 1997, 2000, 2004, 2008, 2010, 2012, 2015, date.getFullYear(), 2032, 2081];
			var yearCount = 9;
			//skills
			var waveHeight = 0;
			var waveCount = 0;
			var skillFlag = false;
			var objects = new Array();
			var rectObjects = new Array();
			var manObject;
			var worksStart = false;
			//12<=20<
			var wboxPatternNum = worksDescription.length;
			var startWorkOrigamiPattern = 99;
			//contact
			var contactFlag = false;
			var contactKeyInputFlag = false;
			var contactBackButton;
			var sendButton;
			var uppercaseFlag = true;
			//origami
			var orx, ory;
			var mailOuterTop, mailOuterOther, mailInner, mailGroup, mailGroupAnim, mailOuterTopAnim, mailInnerAnim, mailOuterAnim;
			var mailFlag = false;
			var mailAnimCount = 0;
			var mailBackColor = "#f0f0f0";
			//stage
			var transformTypeList = new Array();
			var fontsize = 3;
			var direction = 1;
			var typePath = function(type, x, y, scaleX, scaleY, fontSize, fontColor, strokeWidth) {
					this.path = new Path();
					this.type = type;
					this.transforming = false;
					this.fontSize = fontSize;
					this.path.strokeColor = fontColor;
					this.path.strokeWidth = strokeWidth;
					this.x = x;
					this.y = y;
					this.typeNum = typeList.indexOf(this.type);
					this.objArray = typePoints[this.typeNum];
					this.acceleration = Math.floor(Math.random() * 10) + 2;
					this.remove = false;
					this.premove = false;
					for (var t = 0; t < this.objArray.length / 2; t++) {
						this.path.add(new Point(this.x + this.objArray[t * 2] * this.fontSize * scaleX, this.y + this.objArray[t * 2 + 1] * this.fontSize * scaleY));
					}
				}
				//class makeType method
			typePath.prototype.transform = function() {
				var vectorX, vectorY, seg, lastX, lastY;
				var num = typeList.indexOf(this.type);
				var finishFlag = 0;
				var objArray = typePoints[num];
				for (var i = 0; i < this.path.segments.length; i++) {
					seg = this.path.segments[i];
					vectorX = this.x + objArray[i * 2] * this.fontSize - seg.point.x;
					vectorY = this.y + objArray[i * 2 + 1] * this.fontSize - seg.point.y;
					seg.point.x += vectorX / this.acceleration;
					seg.point.y += vectorY / this.acceleration; //8
					if (((Math.abs(vectorX) + Math.abs(vectorY)) / transformRatio) > transformRange) {
						finishFlag++;
					} else {
						seg.point.x = this.x + objArray[i * 2] * this.fontSize;
						seg.point.y = this.y + objArray[i * 2 + 1] * this.fontSize;
					}
				}
				if (finishFlag == 0) {
					this.transforming = false;
					if (this.remove) {
						this.path.remove();
					}
				}
			}
			var manPath = function(age, x, y, fontColor, strokeWidth, scale) {
					this.path = new Path();
					this.age = age;
					this.scale = scale;
					this.transforming = false;
					this.path.fillColor = "#f0f0f0";
					this.x = x;
					this.y = y;
					this.acceleration = 10;
					this.nextNum = 0;
					for (var t = 0; t < manPoints[0].length / 2; t++) {
						this.path.add(new Point(this.x + manPoints[0][(t * 2)] * this.scale, this.y + manPoints[0][(t * 2 + 1)] * this.scale));
					}
				}
				//class makeType method
			manPath.prototype.transform = function() {
				var vectorX, vectorY, seg;
				var objArray = manPoints[this.nextNum];
				var scX = 1;
				var scY = 1;
				if (this.nextNum == 15) {
					scX = view.size.width / 70;
					scY = view.size.height / 35;
				}
				var checkTotal = 1;
				var finishFlag = 0;
				for (var i = 0; i < this.path.segments.length; i++) {
					seg = this.path.segments[i];
					vectorX = this.x + objArray[i * 2] * this.scale * scX - seg.point.x;
					vectorY = this.y + objArray[i * 2 + 1] * this.scale * scY - seg.point.y;
					seg.point.x += vectorX / this.acceleration;
					seg.point.y += vectorY / this.acceleration;
					if ((Math.abs(vectorX) + Math.abs(vectorY)) / 20 > transformRange) {
						finishFlag++;
					} else {
						seg.point.x = this.x + objArray[i * 2] * this.scale * scX;
						seg.point.y = this.y + objArray[i * 2 + 1] * this.scale * scY;
					}
				}
				if (finishFlag == 0) {
					this.transforming = false;
					waveFlag = false;
					if (this.callback) this.callback();
					if (worksStart) {
						startWorkOrigami(startWorkOrigamiPattern);
					}
				}
			}
			var animationObj = function(group) {
				this.transforming = false;
				this.group = group;
				this.acceleration = 5;
				this.num = 1;
				this.ex = 0;
				this.ey = 0;
				this.er = 0;
				this.rad = 0;
			}
			animationObj.prototype.transform = function() {
				var x = this.ex - this.group.position.x;
				var y = this.ey - this.group.position.y;
				this.group.position.x += x / this.acceleration;
				this.group.position.y += y / this.acceleration;
				if (Math.abs(x) < transformRange && Math.abs(y) < transformRange && this.rad >= this.er) {
					this.transforming = false;
					this.group.position.x = this.ex;
					this.group.position.y = this.ey;
					this.num++;
					origamiControl();
				}
			}
			var origami = function(data, x, y, bgcolor) {
				this.path = new Path();
				if (data != formBoxPoints) this.path.fillColor = bgcolor;
				this.path.strokeColor = "#ffffff";
				this.path.strokeWidth = 2;
				this.scale = 10;
				this.finish = false;
				this.points = data;
				this.x = x;
				this.y = y;
				this.w = 100;
				this.num = 0;
				this.transforming = false;
				this.acceleration = 8;
				for (var t = 0; t < this.points[0].length / 2; t++) {
					this.path.add(new Point(this.x + this.points[0][(t * 2)] * this.scale, this.y + this.points[0][(t * 2 + 1)] * this.scale));
				}
			}
			origami.prototype.transform = function() {
				var vectorX, vectorY, seg, lastX, lastY;
				var finishFlag = 0;
				var objArray = this.points[this.num];
				for (var i = 0; i < this.path.segments.length; i++) {
					seg = this.path.segments[i];
					vectorX = this.x + objArray[i * 2] * this.scale - seg.point.x;
					vectorY = this.y + objArray[i * 2 + 1] * this.scale - seg.point.y;
					seg.point.x += vectorX / this.acceleration;
					seg.point.y += vectorY / this.acceleration; //8
					if ((Math.abs(vectorX) + Math.abs(vectorY)) > transformRange * 50) {
						finishFlag++;
					} else {
						seg.point.x = this.x + objArray[i * 2] * this.scale;
						seg.point.y = this.y + objArray[i * 2 + 1] * this.scale;
					}
				}
				if (finishFlag == 0) {
					this.transforming = false;
					if (mailFlag) {
						mailAnimCount++;
						if (mailAnimCount == 4) {
							origamiControl();
						} else if (mailAnimCount > 4) {
							origamiControl();
						}
					}
				}
			}

			function makeType(word, posX, posY, scaleX, scaleY, fontSize, fontColor, strokeWidth, direction, objFlag) {
				var typeObject;
				for (var i = 0; i < word.length; i++) {
					//type number
					var type = word.substr(i, 1);
					if (direction) typeObject = new typePath(type, posX + fontSize * 10 * i, posY, scaleX, scaleY, fontSize, fontColor, strokeWidth);
					else typeObject = new typePath(type, posX, posY + fontSize * 13 * i, scaleX, scaleY, fontSize, fontColor, strokeWidth);
					if (!objFlag) objects.push(typeObject);
				}
			}

			function transformType(transformList, direction, startNum) {
				if (!startNum) startNum = 0;
				for (var j = startNum; j < totalObjects; j++) {
					var r = Math.floor(Math.random() * typeList.length);
					objects[j].type = typeList[r];
					objects[j].x = range(2000, 0);
					objects[j].y = range(1000, 1);
					objects[j].transforming = true;
					objects[j].fontSize = Math.floor(Math.random() * 10);
				}
				setTimeout(function() {
					transformTypeNext(transformList, direction)
				}, 800);
			}

			function transformTypeNext(transformList, direction) {
				var typeCount = 0;
				var pitchX = 10;
				var pitchY = 12;
				var shiftX = 0,
					shiftY = 0;
				for (var j = 0; j < transformList.length; j++) {
					if (transformList[j][5] != null) direction = transformList[j][5];
					if (transformList[j][4] != null) {
						if (direction == 0) pitchX = transformList[j][4];
						else pitchY = transformList[j][4];
					}
					for (var i = 0; i < transformList[j][0].length; i++) {
						var transType = transformList[j][0].substr(i, 1);
						if (transType) {
							objects[typeCount].type = transType;
						}
						objects[typeCount].transforming = true;
						objects[typeCount].fontSize = transformList[j][3];
						if (direction == 0) {
							shiftX = objects[typeCount].fontSize * pitchX * i;
							shiftY = 0;
						} else {
							shiftX = 0;
							shiftY = objects[typeCount].fontSize * pitchY * i;
						}
						objects[typeCount].x = transformList[j][1] + shiftX;
						objects[typeCount].y = transformList[j][2] + shiftY;
						typeCount++;
					}
				}
			}

			function range(num, pos) {
				var value;
				if (!pos) value = view.center.x;
				else value = view.center.y;
				return ((value - num / 2) + Math.floor(Math.random() * num));
			}

			function countArrayNum(array) {
				var menuTitleWordTotal = 0;
				for (var i in array) {
					menuTitleWordTotal += array[i].length;
				}
				return menuTitleWordTotal;
			}

			function zeroPlus(num, n) {
				var res;
				if ((num / Math.pow(10, n)) < 1) {
					res = '0' + String(num);
				} else res = num;
				return String(res);
			}

			function touchRect(xs, ys, xe, ye, nextNum, clickPattern, color, arrayFlag) {
				var rect = new Rectangle(new Point(xs, ys), new Point(xe, ye));
				var path = new Path.Rectangle(rect);
				if (!color) color = "white";
				path.data.nextNum = nextNum;
				path.data.clickPattern = 1;
				path.data.category = 0;
				path.style = {
					fillColor: color
				};
				path.opacity = 0.0;
				path.onClick = function() {
					switch (path.data.clickPattern) {
						case 0:
							//マウスオーバー時のアクションが消してものこるのを削除
							rectObjects[i].onMouseLeave = function() {};
							rectObjects[path.data.rectCount].remove();
							rectObjects = [];
							break;
						case 1:
							removeRectButton();
							break;
					}
					moveNext(path.data.nextNum);
				}
				path.onMouseEnter = function() {
					this.opacity = 0.0;
					document.body.style.cursor = 'pointer';
				}
				path.onMouseLeave = function() {
					this.opacity = 0.0;
					document.body.style.cursor = 'auto';
				}
				if (!arrayFlag) {
					rectObjects.push(path);
				}
				return path;
			}

			function removeRectButton(removeObjects, arrayFlag) {
				if (!removeObjects) removeObjects = rectObjects;
				for (var i = 0; i < removeObjects.length; i++) {
					removeObjects[i].onMouseEnter = function() {};
					removeObjects[i].onMouseLeave = function() {};
					removeObjects[i].remove();
				}
				removeObjects = [];
				document.body.style.cursor = 'auto';
			}

			function removeSingleButton(button) {
				button.onMouseLeave = function() {};
				button.remove();
			}
			var workflag = false,
				movecount = 0,
				preid = 0;

			function workDetailMoveEnd() {
				workflag = false;
			}

			function workDetail(id) {
					id--;
					if (!workflag) {
						startWorkOrigami(id); //workOrigami.js
					} else if (id != preid) {
						startWorkOrigami(id); //workOrigami.js
					}
					preid = id;
					workflag = true;
					transformTypeList = [];
					transformTypeList[0] = [worksMenuTitle[0], aboutPosX[0], aboutPosY[0], fontSize2]; //>WORKS
					for (var i = 1; i < worksMenuTitle.length; i++) {
						transformTypeList[i] = [worksMenuTitle[i], view.center.x + (i - worksMenuTitle.length / 2) * 50, aboutPosY[1] + 20, fontSize3];
					}
					for (var i = 1; i <= wboxPatternNum; i++) {
						if (i <= (wboxPatternNum + 1) / 2) transformTypeList.push([zeroPlus(i, 1), view.center.x - 297 + (i - 1) * 52, (82 + 420) + 30, fontSize3, 8, 0]);
						else transformTypeList.push([zeroPlus(i, 1), view.center.x + 297 - (wboxPatternNum - i) * 52 - 20, (82 + 420) + 30 + 40, fontSize3, 8, 0]);
					}
					transformTypeList.push([worksDescription[id][0], view.center.x + 440, aboutPosY[0] + 0, 1.7, 13, 1]);
					transformTypeList.push([worksDescription[id][1], view.center.x + 475, aboutPosY[0] + 0, 1, 12, 1]);
					transformTypeList.push([worksDescription[id][2], view.center.x + 500, aboutPosY[0] + 0, 1, 12, 1]);
					for (var i = 0; i < (objects.length - countArrayNum(worksMenuTitle) - wboxPatternNum * 2 - 0 - countArrayNum(worksDescription[id][0]) - countArrayNum(worksDescription[id][1]) - countArrayNum(worksDescription[id][2])); i++) {
						transformTypeList.push(["=", range(200, 0), range(1000, 0) + 2000, 1]);
					}
					transformType(transformTypeList, 1, 49);
					if (linkButton) {
						removeSingleButton(linkButton);
					}
					if (url = worksDescription[id][3]) {
						linkButton = touchRect(view.center.x + 495, aboutPosY[0], view.center.x + 500 + baseFontH * 1.7, aboutPosY[0] + 150, 1, 1, "yellow");
						linkButton.onClick = function() {
							gotoURL(url);
						}
					}
				}
				// var groupObj = new animationObj();
				//var tpath;
				//var firstManObjectPosX = 0;
				//var firstManObjectPosY = 0;
			function init() {
				var logo = new logoText('betavn', {
					type: 'delayed',
					duration: 200,
					start: 'autostart',
					dashGap: 20,
					forceRender: false
				}, function(obj) {
					console.log('finished logo')
					loadFinishFlag = true;
				});
				//ひと作成
				manObject = new manPath(0, 0, 0, "#aaaaaa", 1, 1);
				var fontSize = 12;
				for (var i = 0; i < menuTitle[0].length; i++) {
					makeType(menuTitle[0][i], range(view.size.width * 2, 0) - fontSize * baseFontW / 2, view.center.y - fontSize * baseFontH / 2, 1, 1, fontSize, "#555555", 1, 1);
				}
				var posArrayX = new Array();
				// posArrayY = new Array();
				for (var i = 0; i < menuTitle[1].length; i++) {
					posArrayX[i] = Math.floor((range(view.size.width, 0) - fontSize * baseFontW / 2) * 2);
					makeType(menuTitle[1][i], posArrayX[i], view.center.y - fontSize * baseFontH / 2, 1, 1, fontSize, "#555555", 1, 1);
				}
				for (var j = 0; j < (totalObjects - countArrayNum(menuTitle)); j++) {
					makeType("=", range(1000, 0), range(window.innerHeight / 2, 1), 1, 1, 1, "#555555", 1, 1);
				}
				var loadState = 0;
				$("<div>", {
					"id": "loadBar"
				}).appendTo("body");
				var loadAll = worksDescription.length;
				for (var k = 0; k < loadAll; k++) {
					var loadImg = new Image();
					loadImg.num = k;
          //@3T https://i.imgur.com/
					loadImg.src = "https://w.áq.vn/img/" + (worksDescription[k][3]).substring(0, 7) + ".png";
					loadImg.onload = function() {
						loadState++;
						$("#container").append($(this).addClass('minImage'));
						$('#loadBar').animate({
							'width': loadState * 100 / loadAll + "%",
							'margin-left': -loadState * 50 / loadAll + "%"
						}, '100');
						if (loadState == loadAll) {
							$('#loadBar').fadeOut(500, function() {
								$(this).remove();
								$('#header,#loadBar').fadeOut('500', function() {
									$('#awwwards, .csslight, .cssreel').fadeOut('500', function() {
										$(this).remove();
									});
									$(this).remove();
									var button = touchRect(0, 0, window.innerWidth, window.innerHeight, 1, 0);
									button.onClick = function() {
										this.remove();
										moveNext(1);
									}
									button.onMouseEnter = function() {
										document.body.style.cursor = "pointer";
										transformTypeList = [];
										for (var i = 0; i < menuTitle[0].length; i++) {
											transformTypeList.push([
												menuTitle[0][i],
												view.center.x - fontSize * 5 * baseFontW + (i % 7) * fontSize * 8,
												view.center.y - fontSize * baseFontH / 2 + (fontSize * baseFontH) / 4,
												fontSize * 0.5
											]);
										}
										for (var i = 0; i < menuTitle[1].length / 2; i++) {
											transformTypeList.push([menuTitle[1][i], -fontSize * baseFontW - 10 - Math.floor(Math.random() * 500), view.center.y - fontSize * baseFontH / 2, fontSize]);
										}
										for (var i = menuTitle[1].length / 2; i < menuTitle[1].length; i++) {
											transformTypeList.push([menuTitle[1][i], view.size.width + fontSize * baseFontW + Math.floor(Math.random() * 500), view.center.y - fontSize * baseFontH / 2, fontSize]);
										}
										transformTypeNext(transformTypeList, 0);
									}
									button.onMouseLeave = function() {
										document.body.style.cursor = "auto";
									}
								});
							});
						}
					};
				}
			}

			function moveNext(num) {
					transformTypeList = [];
					transformRatio = 10;
					switch (num) {
						case 1: //menu
							makeMenuStage();
							break;
						case 2: //about
							makeAboutStage();
							break;
						case 3: //contact
							makeContactStage();
							break;
						case 4: //works
							initLogo();
							makeWorkStage();
							window.initTSecret();
							break;
						case 5: //blogs
							initBird();
							animateBird();
							makeBlogStage();
							window.initTSecret();
							break;
					}
				}
				////////////////////////////////////////////////////////////////////////////////////
				//  menu : about contact work  
				////////////////////////////////////////////////////////////////////////////////////
			function makeMenuStage() {
					fontsize = 3;
					direction = 1;
					manObject.nextNum = 0;
					manObject.x = 0; //firstManObjectPosX;
					manObject.y = 0; // firstManObjectPosY;
					manObject.transforming = true;
					menuTitle = ["ABOUTME=", "CONTACT=", "MYWORKS=", "WEBLOGS="];
					var topMenuPosX = [
						view.center.x - 150,
						view.center.x - 50,
						view.center.x + 50,
						view.center.x + 150,
					]
					var topMenuPosY = [
						view.center.y - 120,
						view.center.y - 120,
						view.center.y - 120,
						view.center.y - 120
					]
					for (var i = 0; i < menuTitle.length; i++) {
						transformTypeList.push([menuTitle[i], topMenuPosX[i], topMenuPosY[i], fontsize]);
						topBtn[i] = touchRect(topMenuPosX[i], topMenuPosY[i], topMenuPosX[i] + fontsize * baseFontW, topMenuPosY[i] + baseFontH * fontsize * menuTitle[i].length * 1.5, i + 2, 1);
						topBtn[i].num = i;
						topBtn[i].title = menuTitle[i];
						topBtn[i].onMouseEnter = function() {
							transformTypeList[this.num] = [this.title.replace('=', '}'),
								topMenuPosX[this.num],
								topMenuPosY[this.num],
								fontsize
							];
							transformTypeNext(transformTypeList, direction);
							document.body.style.cursor = "pointer";
							this.opacity = 0.0;
						}
						topBtn[i].onMouseLeave = function() {
							transformTypeList[this.num] = [this.title.replace('}', '='),
								topMenuPosX[this.num],
								topMenuPosY[this.num],
								fontsize
							];
							transformTypeNext(transformTypeList, direction);
							document.body.style.cursor = "auto";
							this.opacity = 0.0;
						}
					}
					for (var i = countArrayNum(menuTitle); i < objects.length; i++) transformTypeList.push(["=", range(2000, 0), range(1500, 1), 0]);
					transformType(transformTypeList, direction);
				}
				////////////////////////////////////////////////////////////////////////////////////
				//  about   
				////////////////////////////////////////////////////////////////////////////////////
			var aboutPosX = [
				view.center.x - 450, //About
				view.center.x - 320, //history
				view.center.x - 270, //skills
				view.center.x - 30, //<
				view.center.x + 30 //>
			];
			var aboutPosY = [
				85, //About
				85, //history
				85, //skills
				view.center.y + 250, //<
				view.center.y + 250 //>
			];
			var fontSize2 = 3.5;
			var fontSize3 = 1.5;
			var fontSize4 = 1.2;
			var manScale = 1.2;
			var manX = view.center.x - 150;
			var manY = view.center.y - 200;
			var fontSize = [
				2.5,
				1.5,
				1.5,
				1.5,
				1, 1, 1, 1, 1, 1, 1
			]

			function makeAboutStage() {
				manObject.x = view.center.x * 2 - 170;
				manObject.y = window.innerHeight - 250;
				manObject.scale = 1.5;
				manObject.nextNum = 17;
				manObject.acceleration = 7;
				manObject.transforming = true;
				fontsize = 3;
				direction = 1;
				transformTypeList = [];
				var nowAge = String(date.getFullYear() - 1982);
				var shift = 50;
				menuTitle = ["ABOUT", "BIOGRAPHY=", "SKILLS=", "HUU=LUONG", "QUANGAI=VIETNAM", "AGE=" + (date.getFullYear() - 1982), "DESIGNER", "PROGRAMMER", "CONSTRUCTOR", "M=O=B=I=]", "6=7=0=3=7=0=5"];
				var topMenuPosX = [
					aboutPosX[0],
					view.center.x - 300,
					view.center.x - 250,
					manObject.x - 325 + shift,
					manObject.x - 275 + shift,
					manObject.x - 250 + shift,
					manObject.x - 210 + shift,
					manObject.x - 185 + shift,
					manObject.x - 160 + shift,
					manObject.x - 120 + shift,
					manObject.x - 95 + shift,
				]
				for (var i = 0; i < menuTitle.length; i++) {
					var shift = aboutPosY[0];
					if (i > 2) shift = view.center.y * 2 - 240;
					transformTypeList.push([menuTitle[i], topMenuPosX[i], shift, fontSize[i]]);
				}
				for (var i = 0; i < (objects.length - countArrayNum(menuTitle)); i++) transformTypeList.push(["=", range(2000, 0), range(1000, 1), 0]);
				transformType(transformTypeList, direction);
				var backButton = touchRect(aboutPosX[0], aboutPosY[0], aboutPosX[0] + baseFontW * fontsize, aboutPosY[0] + menuTitle[0].length * baseFontH * fontSize2 * 1.5, 1, 1, "#fffff0");
				backButton.onMouseEnter = function() {
					console.log(transformTypeList[0]);
					transformTypeList[0] = ["(BACK",
						aboutPosX[0],
						aboutPosY[0],
						fontSize[0]
					];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "pointer";
				}
				backButton.onMouseLeave = function() {
					transformTypeList[0] = [menuTitle[0],
						aboutPosX[0],
						aboutPosY[0],
						fontSize[0]
					];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "auto";
				}
				backButton.onClick = function() {
					skillFlag = false;
					//smooth reset
					for (var i = 0, l = manObject.path.segments.length; i < l; i++) {
						var segment = manObject.path.segments[i];
						segment.handleIn = segment.handleOut = null;
					}
					manObject.x = manX;
					manObject.y = manY;
					manObject.scale = manScale;
					manObject.nextNum = 0;
					removeRectButton();
					removeRectButton(aboutSubButtons);
					document.body.style.cursor = "auto";
					moveNext(1);
				}
				var historyButton = touchRect(topMenuPosX[1], aboutPosY[0], topMenuPosX[1] + baseFontW * fontSize[1], aboutPosY[0] + baseFontH * fontSize[1] * menuTitle[1].length * 1.5, 2, 2, "#ffffff");
				historyButton.onClick = function() {
					manObject.x = manX + 30;
					manObject.y = manY + 30;
					manObject.scale = manScale;
					manObject.nextNum = 10;
					manObject.transforming = true;
					makeAboutButtons(0, skillJunle);
					yearCount = 9;
					historyMove(yearCount);
					skillFlag = false;
					//smooth reset
					for (var i = 0, l = manObject.path.segments.length; i < l; i++) {
						var segment = manObject.path.segments[i];
						segment.handleIn = segment.handleOut = null;
					}
				}
				historyButton.onMouseEnter = function() {
					transformTypeList[1] = ["BIOGRAPHY}",
						topMenuPosX[1],
						aboutPosY[0],
						fontSize[1]
					];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "pointer";
					this.opacity = 0.0;
				}
				historyButton.onMouseLeave = function() {
					transformTypeList[1] = ["BIOGRAPHY=",
						topMenuPosX[1],
						aboutPosY[0],
						fontSize[1]
					];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "auto";
					this.opacity = 0.0;
				}
				var skillButton = touchRect(topMenuPosX[2], aboutPosY[0], topMenuPosX[2] + baseFontW * fontSize[2], aboutPosY[0] + baseFontH * fontSize[2] * menuTitle[2].length * 1.5, 2, 2, "#ffffff");
				skillButton.onClick = function() {
					makeAboutButtons(1, skillJunle, skillTitle, menuTitle);
					manObject.nextNum = 15;
					manObject.scale = 10;
					manObject.y = view.center.y;
					manObject.x = -200;
					manObject.transforming = true;
					skillFlag = true;
					transformTypeList = [];
					var preTypeListTotal = transformTypeList.length;
					transformTypeList[0] = ['SKILLS===', topMenuPosX[0], aboutPosY[0], fontSize[0]];
					for (var i = 0; i < skillJunle.length; i++) {
						transformTypeList.push([skillJunle[i], view.center.x - 300 + i * 40, 85, fontSize[2]]);
					}
					for (var i = 0; i < totalObjects - skillJunle.length; i++) {
						transformTypeList.push(['=', range(1000, 0), range(1500, 1), 0]);
					}
					transformType(transformTypeList, direction);
				}
				skillButton.onMouseEnter = function() {
					transformTypeList[2] = ["SKILLS}",
						topMenuPosX[2],
						aboutPosY[0],
						fontSize[1]
					];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "pointer";
					this.opacity = 0.0;
				}
				skillButton.onMouseLeave = function() {
					transformTypeList[2] = ["SKILLS=",
						topMenuPosX[2],
						aboutPosY[0],
						fontSize[1]
					];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "auto";
					this.opacity = 0.0;
				}
				rectObjects[2].onMouseEnter = function() {
					document.body.style.cursor = "pointer";
					this.fillColor = "#ffffff";
					this.opacity = 0.0;
				}
			}
			var aboutSubButtons = new Array();

			function makeAboutButtons(n, skillJunle, skillTitle) {
				if (n == 0) {
					removeRectButton();
					removeRectButton(aboutSubButtons);
					var backButton = touchRect(aboutPosX[0], aboutPosY[0], aboutPosX[0] + baseFontW * fontsize, aboutPosY[0] + 9 * baseFontH * fontSize2 * 1.5, 1, 1, "#fffff0");
					backButton.onMouseEnter = function() {
						transformTypeList[0] = ["(BACK====",
							aboutPosX[0],
							aboutPosY[0],
							fontSize[0]
						];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "pointer";
					}
					backButton.onMouseLeave = function() {
						transformTypeList[0] = ["BIOGRAPHY",
							aboutPosX[0],
							aboutPosY[0],
							fontSize[0]
						];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "auto";
					}
					backButton.onClick = function() {
							skillFlag = false;
							//smooth reset
							for (var i = 0, l = manObject.path.segments.length; i < l; i++) {
								var segment = manObject.path.segments[i];
								segment.handleIn = segment.handleOut = null;
							}
							manObject.x = manX + 20;
							manObject.y = window.innerHeight - 250;
							manObject.scale = 1.5;
							manObject.nextNum = 17;
							removeRectButton();
							removeRectButton(aboutSubButtons);
							document.body.style.cursor = "auto";
							moveNext(2);
						}
						// upbutton
					button1 = touchRect(aboutPosX[3] - 200, view.center.y - 20, aboutPosX[3] - 180, view.center.y + 30, 1, 99, "#ffffff");
					aboutSubButtons.push(button1);
					button1.onClick = function() {
							if (yearCount > 0) {
								yearCount--;
								manObject.nextNum = yearCount + 1;
								manObject.transforming = true;
								historyMove(yearCount);
							}
						}
						//Down Button
					button2 = touchRect(aboutPosX[4] + 210, view.center.y - 20, aboutPosX[4] + 230, view.center.y + 30, 1, 99, "#ffffff");
					aboutSubButtons.push(button2);
					button2.onClick = function() {
						if (yearCount < eventYear.length - 1) {
							yearCount++;
							manObject.nextNum = yearCount + 1; //次は番号1の形に変形
							manObject.transforming = true;
							historyMove(yearCount);
						}
					}
				} else {
					var nowRectsTotal = rectObjects.length;
					transformRatio = 30;
					removeRectButton();
					removeRectButton(aboutSubButtons);
					var backButton = touchRect(aboutPosX[0], aboutPosY[0], aboutPosX[0] + baseFontW * fontsize, aboutPosY[0] + 9 * baseFontH * fontSize2 * 1.5, 1, 1, "#fffff0");
					backButton.onMouseEnter = function() {
						transformTypeList[0] = ["(BACK====",
							aboutPosX[0],
							aboutPosY[0],
							fontSize[0]
						];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "pointer";
					}
					backButton.onMouseLeave = function() {
						transformTypeList[0] = ['SKILLS===',
							aboutPosX[0],
							aboutPosY[0],
							fontSize[0]
						];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "auto";
					}
					backButton.onClick = function() {
						skillFlag = false;
						for (var i = 0, l = manObject.path.segments.length; i < l; i++) {
							var segment = manObject.path.segments[i];
							segment.handleIn = segment.handleOut = null;
						}
						manObject.x = manX + 20;
						manObject.y = window.innerHeight - 250;
						manObject.scale = 1.5;
						manObject.nextNum = 17;
						removeRectButton();
						removeRectButton(aboutSubButtons);
						document.body.style.cursor = "auto";
						moveNext(2);
					}
					var junleFontSize;
					for (var i = 0; i < skillJunle.length; i++) {
						var button = touchRect(view.center.x - 300 + i * 40, aboutPosY[0], view.center.x - 300 + i * 40 + baseFontW * 2, aboutPosY[0] + skillJunle[i].length * fontSize[2] * 1.5 * baseFontH, 1, 99, "#ffffff");
						aboutSubButtons.push(button);
						button.data.category = i;
						button.onClick = function() {
							var count = 0;
							transformTypeList = [];
							transformTypeList.push(['SKILLS===', aboutPosX[0], aboutPosY[0], fontSize[0]]);
							for (var i = 0; i < skillJunle.length; i++) {
								if (i == this.data.category) junleFontSize = 2.2;
								else junleFontSize = fontSize[2];
								transformTypeList.push([skillJunle[i], view.center.x - 300 + i * 40, 85, junleFontSize]);
							}
							var randomEmpty = Math.floor(Math.random() * 50);
							for (var i = 0; i < randomEmpty; i++) {
								transformTypeList.push(['=', range(1000, 0), range(1500, 1), 0]);
							}
							for (var k = 0; k < skillTitle[this.data.category].length; k++) {
								transformTypeList.push(
									[
										skillTitle[this.data.category][k],
										view.center.x + k * 35,
										aboutPosY[0],
										1.2, 12, 1
									]);
							}
							for (var n = 0; n < (totalObjects - countArrayNum(skillJunle) - countArrayNum(skillTitle[this.data.category]) - randomEmpty); n++) {
								transformTypeList.push(["=", range(1000, 0), range(1000, 1), 0]);
							}
							transformTypeNext(transformTypeList, direction);
							waveCount = 0;
							r = Math.floor(Math.random() * 6) + 2;
							waveHeight = Math.random() * 100 + 150;
						}
						button.onMouseEnter = function() {
							document.body.style.cursor = "pointer";
							this.opacity = 0.0;
							transformTypeList[this.data.category + 1] = [skillJunle[this.data.category].replace('=', '}'), view.center.x - 300 + this.data.category * 40, 85, fontSize[2]];
							transformTypeNext(transformTypeList, direction);
						}
						button.onMouseLeave = function() {
							transformTypeList[this.data.category + 1] = [skillJunle[this.data.category], view.center.x - 300 + this.data.category * 40, 85, fontSize[2]];
							transformTypeNext(transformTypeList, direction);
							this.opacity = 0;
						}
					}
				}
			}

			function historyMove(yearCount) {
					var age = ("0" + String(eventYear[yearCount] - eventYear[1])).slice(-2);
					if (age <= 0) age = "==";
					transformTypeList = [];
					transformTypeList.push(["BIOGRAPHY", aboutPosX[0], aboutPosY[0], fontSize[0]]);
					transformTypeList.push(["<", aboutPosX[3] - 200, view.center.y - 20, 6]);
					transformTypeList.push([">", aboutPosX[4] + 200, view.center.y - 20, 6]);
					transformTypeList.push([age, view.center.x - 50, view.center.y - 40, 10, 8, 0]);
					transformTypeList.push([eventText[yearCount], view.center.x + 420, aboutPosY[0], fontSize4, 12, 1]);
					transformTypeList.push([eventText2[yearCount], view.center.x + 445, aboutPosY[0], fontSize4, 12, 1]);
					for (var i = 0; i < (totalObjects - (13 + eventText[yearCount].length + eventText2[yearCount].length)); i++) {
						transformTypeList.push(["=", range(1000, 0), range(1000, 1), 0]);
					}
					transformType(transformTypeList, direction, 11);
				}
				////////////////////////////////////////////////////////////////////////////////////
				//  contact
				////////////////////////////////////////////////////////////////////////////////////
			var contactMakeFlag = false;
			var contactTypeArray = new Array();

			function makeContactStage() {
					contactFlag = true;
					fontsize = 5;
					contactReset();
					for (var i = 0; i < 300; i++) {
						contactTypeArray[i] = new typePath("=", range(500, 0), range(500, 1), 1, 1, 0, "#555555", 1);
					}
					direction = 1;
					transformTypeList = [];
					menuTitle = ["=======", "====", "=", "=", "=", "===", "====", "===", "=====", "====", "======="];
					for (var i = 0; i < menuTitle.length; i++) transformTypeList.push([menuTitle[i], range(1400, 0), aboutPosY[0], 5, 14]); //message
					for (var i = 0; i < (objects.length - countArrayNum(menuTitle)); i++) transformTypeList.push(["=", range(1500, 0), range(1000, 0), 0]);
					transformType(transformTypeList, direction);
					makeContactTypeStage();
					contactBackButton = touchRect(aboutPosX[0], aboutPosY[0], aboutPosX[0] + fontSize[0] * baseFontW, aboutPosY[0] + menuTitle[0].length * 2.3 * baseFontH, 1, "#eeeeee", 1);
					contactBackButton.onMouseEnter = function() {
						transformTypeList[0] = ["(BACK==", aboutPosX[0], aboutPosY[0], fontSize[0]];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "pointer";
					}
					contactBackButton.onMouseLeave = function() {
						transformTypeList[0] = ["CONTACT", aboutPosX[0], aboutPosY[0], fontSize[0]];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "auto";
					}
					contactBackButton.onClick = function() {
						for (var i = 0; i < 300; i++) {
							contactTypeArray[i].type = "=";
							contactTypeArray[i].x = range(1000, 0);
							contactTypeArray[i].y = range(1000, 0);
							contactTypeArray[i].transforming = true;
							contactTypeArray[i].remove = true;
						}
						document.body.style.cursor = "auto";
						removeRectButton();
						contactKeyInputFlag = false;
						moveNext(1);
					}
				}
				////////////////////////////////////////////////////////////////////////////////////
				//  works
				////////////////////////////////////////////////////////////////////////////////////
			var linkButton;
			var worksMenuTitle = ["WORKS", "=Administrator", "==OmegaDesign", "===Designer", "====betavn"];

			function makeWorkStage() {
					worksStart = true;
					direction = 1;
					fontsize = 5;
					//workBack.js 3d
					$("#workView").append(renderer.domElement);
					workBackInit(manObject);
					renderer.render(scene, camera);
					workBackFirstFlag = true;
					workBackEndFlag = false;
					manObject.path.opacity = 0.0;
					// origami
					workFirstFlag = true;
					workEndFlag = false;
					openFlag = false;
					/*
					$('<div class="workBox"></div>').appendTo('body').slideUp(0).slideDown(500, function(){
						startWorkOrigami(-1, workDetailMoveEnd); //workOrigami.js
					});
					*/
					$("#article").append('<div class="workBox"></div>').slideUp(0).slideDown(500, function() {
						startWorkOrigami(-1, workDetailMoveEnd); //workOrigami.js
					});
					var pos = Math.floor(Math.random() * 8);
					boxSmallSet(pos);
					transformTypeList = [];
					transformTypeList[0] = [worksMenuTitle[0], aboutPosX[0], aboutPosY[0], fontSize2]; //>WORKS
					for (var i = 1; i < worksMenuTitle.length; i++) {
						transformTypeList.push([worksMenuTitle[i], aboutPosX[1] + (i - 1) * 50, aboutPosY[1], fontSize3]);
					}
					//works num
					for (var i = 1; i <= wboxPatternNum; i++) {
						if (i <= (wboxPatternNum + 1) / 2) transformTypeList.push([zeroPlus(i, 1), view.center.x - 297 + (i - 1) * 52, (82 + 420) + 30, fontSize3, 8, 0]);
						else transformTypeList.push([zeroPlus(i, 1), view.center.x + 297 - (wboxPatternNum - i) * 52 - 20, (82 + 420) + 30 + 40, fontSize3, 8, 0]);
					}
					for (var i = 0; i < (objects.length - countArrayNum(worksMenuTitle) - wboxPatternNum * 2 - 0); i++) {
						transformTypeList.push(["=", range(200, 0), range(1000, 0) + 2000, 1]);
					}
					transformType(transformTypeList, direction);
					anim();
					breakShapes();
					var backButton = touchRect(aboutPosX[0], aboutPosY[0], aboutPosX[0] + 1.5 * baseFontW * fontsize, aboutPosY[0] + worksMenuTitle[0].length * 1.5 * baseFontH * fontsize, 1, direction);
					backButton.onMouseEnter = function() {
						transformTypeList[0] = ["<BACK", aboutPosX[0], aboutPosY[0], fontSize2];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "pointer";
					}
					backButton.onMouseLeave = function() {
						transformTypeList[0] = [worksMenuTitle[0], aboutPosX[0], aboutPosY[0], fontSize2];
						transformTypeNext(transformTypeList, direction);
						document.body.style.cursor = "auto";
					}
					backButton.onClick = function() {
						removeRectButton();
						//workBack.js
						breakShapes();
						workBackPattern = 0;
						workBackEndFlag = true;
						endWorkOrigami();
						workflag = false;
						moveNext(1);
					}
					var subButtons = new Array();
					for (var i = 0; i < (worksMenuTitle.length - 1); i++) {
						subButtons[i] = touchRect(aboutPosX[1] + (i) * 50, aboutPosY[1], aboutPosX[1] + (i) * 50 + baseFontW, aboutPosY[1] + worksMenuTitle[(i + 1)].length * baseFontH * fontsize / 2, 1, 99);
						subButtons[i].data.category = i;
						subButtons[i].onClick = function() {
							worksRectAnimation(this.data.category);
						}
					}
					// works num button
					var startNum = worksMenuTitle.length;
					for (var i = 0; i <= wboxPatternNum - 1; i++) {
						if (i + 1 <= (wboxPatternNum + 1) / 2) {
							var worksNumBtnX = view.center.x - 297 + i * 52;
							var worksNumBtnY = (82 + 420) + 30 - 10;
						} else {
							var worksNumBtnX = view.center.x + 297 - (wboxPatternNum - i - 1) * 52 - 20;
							var worksNumBtnY = 40 + (82 + 420) + 30 - 10;
						}
						subButtons[startNum + i] = touchRect(worksNumBtnX - 5, worksNumBtnY, worksNumBtnX + 25, worksNumBtnY + 30, 1, 99);
						subButtons[startNum + i].data.category = i;
						subButtons[startNum + i].onClick = function() {
							breakShapes();
							workDetail(this.data.category + 1);
						}
					}
				}
				/*

						function origamiReset(paper,x,y){

							paper.path.position = new Point(x,y);
							paper.num = 0;
							paper.transforming = true;
							paper.finish = false;
							paper.path.scale(1.0,1.0);
							paper.path.bringToFront();

						}
				*/
				////////////////////////////////////////////////////////////////////////////////////
				//  blogs
				////////////////////////////////////////////////////////////////////////////////////
			function makeBlogStage() {
				$.ajax({
					type: 'POST',
					url: 'login.html',
					data: {
						'message': date
					},
					error: function() {
						sendSuccess();
						setTimeout(function() {
							$('#article').fadeTo('500', '0.1', function() {
								$(this).remove();
								//$(".save-button").css('');
								$("#container").append('<canvas id="blog"></canvas>');
								window.blogT = new blogText();
								window.blogT.initialize();
							});
						}, 2000);
					}
				});
			}

			function onFrame(e) {
				//all objects
				for (var i = 0; i < objects.length; i++) {
					if (objects[i].transforming) {
						objects[i].transform();
					}
				}
				//man objects
				if (manObject.transforming) {
					manObject.transform();
				}
				//contact letters
				if (contactFlag) {
					var contactTypeMoving = 0;
					for (var i = 0; i < contactTypeArray.length; i++) {
						if (contactTypeArray[i].transforming) {
							contactTypeArray[i].transform();
							contactTypeMoving++;
						}
					}
					if (mailAnimCount == 7 && contactTypeMoving == 0) {
						mailAnimCount = 8;
						contactFlag = false;
						origamiControl();
					}
				}
				//contact mail
				if (mailFlag) {
					if (mailInner.transforming) mailInner.transform();
					if (mailOuter.transforming) mailOuter.transform();
					if (mailOuterTop.transforming) mailOuterTop.transform();
					if (mailOuterOther.transforming) mailOuterOther.transform();
				}
				if (skillFlag) {
					waveCount++;
					if (waveCount < waveHeight) {
						speed = 5;
						manObject.path.segments[r].point.y = view.center.y - Math.sin(waveCount / speed) * (waveHeight / 2 - waveCount * 0.5);
						manObject.path.smooth();
						manObject.transforming = true;
					} else {
						waveCount = waveHeight;
						r = 0;
					}
				}
			}

			function makeMailObject() {
				orx = view.center.x - 250;
				ory = view.center.y * 2 + 300;
				//mail
				mailOuterTop = new origami(mailOuterTopPoints, orx, ory, mailBackColor);
				mailOuterTop.path.strokeWidth = 2;
				mailInner = new origami(mailInnerPoints, orx, ory, mailBackColor);
				mailInner.path.closed = true;
				mailOuter = new origami(mailOuterPoints, orx, ory, mailBackColor);
				mailOuter.path.closed = true;
				// upper
				mailOuterOther = new origami(mailOuterOtherPoints, orx, ory, mailBackColor);
				mailOuterOther.path.closed = true;
				mailOuterOther.path.strokeWidth = 2;
				// move bottom layer
				mailOuter.path.sendToBack();
				mailInner.path.sendToBack();
				mailOuterTop.path.sendToBack();
				mailOuterOther.path.sendToBack();
				manObject.path.sendToBack();
			}
			var num = 0;
			var typecount = 0;
			var typePosX = 0,
				typePosY = 150;
			var contactFirstKeyDown = false;
			var messageType = "";

			function onKeyDown(event) {
				if (contactKeyInputFlag) {
					if (!contactFirstKeyDown) {
						contactFirstKeyDown = true;
						for (var i = 5; i < (objects.length - 38); i++) transformTypeList[i] = ["=", range(2000, 0), range(1000, 0) - 300, 0];
						transformTypeNext(transformTypeList, 1);
					}
					var typeUpper = event.key.toUpperCase();
					var type = event.key;
					if (uppercaseFlag) type = typeUpper;
					var fontSize = 2;
					if (typeUpper != "SHIFT" && typeUpper != "CONTROL") {
						if (typeUpper == "BACKSPACE") {
							if (typecount > 0) {
								typecount--;
								typePosX--;
							}
							if (typePosX < 0 && typecount > 0) {
								typePosY -= fontSize * 20;
								typePosX = (contactTypeArray[typecount].x + 200 - view.center.x) / 10 / fontSize;
							}
							contactTypeArray[typecount].y = -50;
							contactTypeArray[typecount].transforming = true;
							messageType = messageType.slice(0, -1);;
						} else if (typeUpper == "ENTER") {
							contactTypeArray[typecount].type = "=";
							contactTypeArray[typecount].x = view.center.x - 200 + fontSize * 10 * typePosX;
							contactTypeArray[typecount].y = typePosY;
							typecount++;
							typePosX = 0;
							typePosY += fontSize * 20;
							messageType += "\n";
						} else if (type.match(/[A-Za-z@.!?\-_/0-9]/)) {
							if (type.length == 1 || typeUpper == "SPACE") {
								if (typeUpper == "SPACE") type = "=";
								contactTypeArray[typecount].type = type;
								contactTypeArray[typecount].x = view.center.x - 200 + fontSize * 10 * typePosX;
								contactTypeArray[typecount].y = typePosY;
								contactTypeArray[typecount].fontSize = 2;
								contactTypeArray[typecount].transforming = true;
								typecount++;
								typePosX++;
								messageType += type;
							}
						}
					}
				}
			}

			function onKeyUp(event) {
					if (event) { //FireFox
						//backspace
						if (event.keyCode == 8) {
							if (event.target.nodeName != "textarea" && event.target.nodeName != "input") {
								event.preventDefault();
								event.stopPropagation();
								return false;
							}
						}
					} else if (event) { //IE
						//backspace
						if (event.keyCode == 8) {
							if (event.srcElement.type == null) {
								event.returnValue = false;
								event.cancelBubble = true;
								return false;
							}
						}
					}
				}
				//  contact
			function makeContactTypeStage() {
				transformTypeList = [];
				menuTitle = ["CONTACT", "SEND=", "A", "=", "-", "KEY", "DOWN", "AND", "INPUT", "YOUR", "MESSAGE"];
				makeMailObject();
				manObject.nextNum = 18;
				manObject.x = view.center.x;
				manObject.y = view.center.y;
				manObject.transforming = true;
				manObject.callback = function() {
					manObject.y = view.center.y * 2 + 300;
					manObject.transforming = true;
					manObject.callback = function() {
						manObject.transforming = false;
						for (var i = 0; i < manObject.path.segments.length; i++) {
							manObject.path.segments[i].point.x = view.size.width / manObject.path.segments.length * i;
							manObject.path.segments[i].point.y = view.size.height + 100;
						}
						//CONTACT
						transformTypeList[0] = [menuTitle[0], aboutPosX[0], aboutPosY[0], fontSize[0]];
						//SEND
						transformTypeList[1] = [menuTitle[1], aboutPosX[0] + 70, aboutPosY[0], fontSize[1]];
						// A
						transformTypeList[2] = [menuTitle[2], view.center.x + 450, aboutPosY[0], 2];
						// a
						transformTypeList[3] = [menuTitle[3], view.center.x + 450, aboutPosY[0] + 30, 2];
						// -
						transformTypeList[4] = [menuTitle[4], view.center.x + 450, aboutPosY[0] + 15, 2];
						for (var i = 5; i < menuTitle.length; i++) {
							transformTypeList[i] = [menuTitle[i], view.center.x + (i - 5) * 90 - 230, view.center.y - 200, 5];
						}
						for (var i = menuTitle.length; i < (objects.length - countArrayNum(menuTitle)); i++) {
							transformTypeList[i] = ["=", range(2000, 0), range(1000, 0) - 300, 0];
						}
						transformTypeNext(transformTypeList, 1);
						makeContactButton(menuTitle);
						//onKeydown
						contactKeyInputFlag = true;
						//callback rest
						manObject.callback = '';
					};
				};
			}

			function makeContactButton(menuTitle) {
				// send button
				sendButton = touchRect(aboutPosX[0] + 70, aboutPosY[0], aboutPosX[0] + 70 + baseFontW * fontSize[1], aboutPosY[0] * baseFontH * 2.3 * menuTitle[1].length, 1, "#ff9900", 1);
				sendButton.onMouseEnter = function() {
					transformTypeList[1] = ["SEND}", aboutPosX[0] + 70, aboutPosY[0], fontSize[1]];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "pointer";
				}
				sendButton.onMouseLeave = function() {
					transformTypeList[1] = ["SEND=", aboutPosX[0] + 70, aboutPosY[0], fontSize[1]];
					transformTypeNext(transformTypeList, direction);
					document.body.style.cursor = "auto";
				}
				sendButton.onClick = function() {
						document.body.style.cursor = 'auto';
						//object remove
						sendButton.onMouseEnter = function() {};
						sendButton.onMouseLeave = function() {};
						sendButton.remove();
						contactBackButton.onMouseEnter = function() {}
						contactBackButton.onMouseLeave = function() {}
						contactBackButton.remove();
						for (var i = 0; i < (objects.length); i++) transformTypeList[i] = ["=", range(2000, 0), range(1000, 0) - 300, 0];
						transformType(transformTypeList, 1);
						contactKeyInputFlag = false;
						mailFlag = true;
						mailAnimCount = 0;
						origamiControl();
					}
					//upper charactar button
				charactarButton1 = touchRect(view.center.x + 440, aboutPosY[0] - 10, view.center.x + 460 + baseFontW * fontSize[1], aboutPosY[0] + baseFontH * 2.3, 1, "#ff9900", 1);
				charactarButton1.onMouseEnter = function() {
					document.body.style.cursor = "pointer";
					if (uppercaseFlag) aType = "a";
					else aType = "A";
					transformTypeList[2] = [aType, view.center.x + 450, aboutPosY[0], 2];
					transformTypeNext(transformTypeList, 1);
				}
				charactarButton1.onMouseLeave = function() {
					document.body.style.cursor = "auto";
					if (uppercaseFlag) aType = "A";
					else aType = "a";
					transformTypeList[2] = [aType, view.center.x + 450, aboutPosY[0], 2];
					transformTypeNext(transformTypeList, 1);
				}
				charactarButton1.onClick = function() {
					uppercaseFlag = !uppercaseFlag;
					if (uppercaseFlag) aType = "A";
					else aType = "a";
					transformTypeList[2] = [aType, view.center.x + 450, aboutPosY[0], 2];
					transformTypeNext(transformTypeList, 1);
				}
			}

			function sendMessage(message) {
				for (var i = 0; i < manObject.path.segments.length; i++) {
					manObject.path.segments[i].point.x = view.size.width / manObject.path.segments.length * i;
					manObject.path.segments[i].point.y = -300;
				}
				$.ajax({
					type: 'POST',
					url: 'sendMessage.php',
					data: {
						'message': message
					},
					success: function(data) {
						if (data == 'ok') {
							console.log('ok');
							sendSuccess();
						} else {
							sendError();
						}
					},
					error: function() {
						sendError();
					}
				});
			}

			function sendSuccess() {
				transformTypeList = [];
				var k = 0;
				for (var i = 0; i < 294; i++) {
					var r = Math.floor(Math.random() * (typeList.length));
					transformTypeList[i] = [
						typeList[r],
						thankuPos[k] * 1.2 + view.center.x - 330,
						thankuPos[k + 1] * 1.2 + view.center.y - 100,
						Math.floor(Math.random() * 2) + 1, 15, 0
					];
					k += 2;
				}
				transformTypeNext(transformTypeList, 1);
				setTimeout(function() {
					moveNext(1);
				}, 4000);
			}

			function sendError() {
				transformTypeList = [];
				var message = "[gmailjM33TH=|=SORRY.message=is=not=sent";
				var messageFontSize = 2;
				transformTypeList[0] = [message, view.center.x - message.length * baseFontW * messageFontSize / 2 * 2.1, view.center.y - baseFontH / 2, messageFontSize, 10, 0];
				transformTypeNext(transformTypeList, 1);
				returnTopButton = touchRect(0, 0, view.center.x * 2, view.center.y * 2.2, 1, 99);
				returnTopButton.onClick = function() {
					removeRectButton();
					moveNext(1);
				}
			}

			function contactReset() {
				typecount = 0;
				typePosX = 0;
				typePosY = 150;
				contactTypeArray = [];
				firstContact = false;
				mailFlag = false;
				contactFirstKeyDown = false;
				messageType = "";
			}

			function origamiControl() {
				if (mailAnimCount == 0) {
					var posY = 400;
					mailInner.y = posY;
					mailInner.transforming = true;
					mailOuter.y = posY;
					mailOuter.transforming = true;
					mailOuterTop.y = posY;
					mailOuterTop.transforming = true;
					mailOuterOther.y = posY;
					mailOuterOther.transforming = true;
				}
				if (mailAnimCount == 4) {
					mailOuter.transforming = true;
					mailOuter.num++;
				}
				if (mailAnimCount == 5) {
					mailOuter.transforming = true;
					mailOuter.num++;
				}
				if (mailAnimCount == 6) {
					mailOuter.transforming = true;
					mailOuter.num++;
				}
				if (mailAnimCount == 7) {
					mailOuterOther.path.bringToFront();
					transformRatio = 100;
					contactKeyInputFlag = false;
					for (var i = 0; i < typecount; i++) {
						contactTypeArray[i].x = view.center.x - 50 + Math.random() * 100;
						contactTypeArray[i].y = 650;
						contactTypeArray[i].transforming = true;
					}
				}
				if (mailAnimCount == 8) {
					for (var i = 0; i < 300; i++) {
						contactTypeArray[i].path.remove();
					}
					transformRatio = 40;
					mailOuterTop.path.bringToFront();
					mailOuter.transforming = true;
					mailOuter.num++;
					mailOuterTop.transforming = true;
					mailOuterTop.num++;
				}
				if (mailAnimCount == 10) {
					mailOuterOther.path.remove();
					Sleep(300);
					mailInner.y = -400;
					mailInner.transforming = true;
					mailOuter.y = -400;
					mailOuter.transforming = true;
					mailOuterTop.y = -400;
					mailOuterTop.transforming = true;
				}
				if (mailAnimCount == 11) {
					mailOuter.path.remove();
					mailInner.path.remove();
					mailOuterTop.path.remove();
					mailOuterOther.path.remove();
					sendMessage(messageType);
				}
			}

			function Sleep(milli_second) {
				var start = new Date();
				while (new Date() - start < milli_second);
			}

			function gotoURL(url) {
				if (url.length < 10) window.open().location.href = url;
				else {
					$.onebook(url.split(" "), {
						skin: ['light', 'dark'],
						bgDark: '#56998c url(https://w.áq.vn/img/HzaFx9z.jpg)',
						bgLight: '#d97f6f url(https://w.áq.vn/img/TuaAYqN.jpg)',
						cesh: false,
            language:'en'
					});
				}
			}
			$(document).keydown(function(e) {
				if (e.keyCode === 8) {
					var tag = e.target.nodeName.toLowerCase();
					var $target = $(e.target);
					if ((tag !== 'input' && tag !== 'textarea') || $target.attr('readonly') || $target.is(':disabled')) {
						return false;
					}
				}
				return true;
			});
			init();
			//Detector.jss
			/**
			 * @author alteredq / http://alteredqualia.com/
			 * @author mr.doob / http://mrdoob.com/
			 */
			var Detector = {
				canvas: !!window.CanvasRenderingContext2D,
				webgl: (function() {
					try {
						var canvas = document.createElement('canvas');
						return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
					} catch (e) {
						return false;
					}
				})(),
				workers: !!window.Worker,
				fileapi: window.File && window.FileReader && window.FileList && window.Blob,
				getWebGLErrorMessage: function() {
					var element = document.createElement('div');
					element.id = 'webgl-error-message';
					element.style.fontFamily = 'TCVN';
					element.style.fontSize = '13px';
					element.style.fontWeight = 'normal';
					element.style.textAlign = 'center';
					element.style.background = '#fff';
					element.style.color = '#000';
					element.style.padding = '1.5em';
					element.style.width = '400px';
					element.style.margin = '5em auto 0';
					if (!this.webgl) {
						element.innerHTML = window.WebGLRenderingContext ? ['Your graphics card does not seem to support <a href="https://get.webgl.org/get-a-webgl-implementation/" style="color:#000">WebGL</a>.<br />', 'Find out how to get it <a href="https://get.webgl.org/" style="color:#000">here</a>.'].join('\n') : ['Your browser does not seem to support <a href="https://get.webgl.org/get-a-webgl-implementation/" style="color:#000">WebGL</a>.<br/>', 'Find out how to get it <a href="https://get.webgl.org/" style="color:#000">here</a>.'].join('\n');
					}
					return element;
				},
				addGetWebGLMessage: function(parameters) {
					var parent, id, element;
					parameters = parameters || {};
					parent = parameters.parent !== undefined ? parameters.parent : document.body;
					id = parameters.id !== undefined ? parameters.id : 'oldie';
					element = Detector.getWebGLErrorMessage();
					element.id = id;
					parent.appendChild(element);
				}
			};
			//back.jss
			function initLogo() {
				/*var */
				triMesh = new Array();
				/*var */
				shapeNum = 250;
				/*var */
				shapePositionX = new Array();
				/*var */
				shapePositionY = new Array();
				/*var */
				shapePositionZ = new Array();
				/*var */
				triSize = 150;
				/*var */
				shapeMoveFinish = false;
				/*var */
				colors = new Array();
				/*var */
				duration = 1000;
				/*var */
				theta = 0;
				/*var */
				renderer = (Detector.webgl) ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
				/*var */
				group = new THREE.Object3D();
				/*var */
				scene = new THREE.Scene();
				/*var */
				workBackFirstFlag = true;
				/*var */
				workBackEndFlag = false;
				/*var */
				workBackPattern = 0;
				/*var */
				randX = new Array();
				/*var */
				randY = new Array();
				/*var */
				randZ = new Array();
				/*var */
				randR = new Array();
				var manObject;
				for (var i = 0; i < 3; i++) {
					randX[i] = new Array();
					randY[i] = new Array();
					randZ[i] = new Array();
					randR[i] = new Array();
				}
				renderer.setSize(window.innerWidth, window.innerHeight);
				/*var */
				fov = 40;
				/*var */
				aspect = window.innerWidth / window.innerHeight;
				/*var */
				near = 1;
				/*var */
				far = 4000;
				/*var */
				camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
				camera.position.z = 1300;
				scene.add(camera);
				light = new THREE.DirectionalLight(0xffffff, 1.0);
				light.position = new THREE.Vector3(0, 0, 500);
				scene.add(light);
				/*var */
				material = new THREE.MeshLambertMaterial({
					color: 0xeeeeee,
					side: THREE.DoubleSide
				})
				var shape = new THREE.Shape();
				/*var */
				triX = triSize / 2;
				/*var */
				triY = Math.sqrt(3) * triSize / 4;
				/*
				shape.moveTo(  0, triY );
				shape.lineTo(  -triSize/2, -triY );
				shape.lineTo(  triSize/2, -triY );
				shape.lineTo(  0, triY );
				*/
				shape.moveTo(-15, 33.094);
				shape.lineTo(-16.736, 32.942);
				shape.lineTo(-18.42, 32.491);
				shape.lineTo(-20, 31.754);
				shape.lineTo(-21.428, 30.755);
				shape.lineTo(-22.66, 29.522);
				shape.lineTo(-23.66, 28.094);
				shape.lineTo(-24.397, 26.514);
				shape.lineTo(-24.848, 24.831);
				shape.lineTo(-25, 23.093);
				shape.lineTo(-25, -23.092);
				shape.lineTo(-24.848, -24.83);
				shape.lineTo(-24.397, -26.514);
				shape.lineTo(-23.66, -28.094);
				shape.lineTo(-22.66, -29.521);
				shape.lineTo(-21.428, -30.754);
				shape.lineTo(-20, -31.754);
				shape.lineTo(-18.42, -32.49);
				shape.lineTo(-16.736, -32.941);
				shape.lineTo(-15, -33.093);
				shape.lineTo(-13.263, -32.941);
				shape.lineTo(-11.58, -32.49);
				shape.lineTo(-9.98, -31.745);
				shape.lineTo(29.999, -8.66);
				shape.lineTo(31.426, -7.66);
				shape.lineTo(32.659, -6.428);
				shape.lineTo(33.659, -5);
				shape.lineTo(34.395, -3.42);
				shape.lineTo(34.846, -1.736);
				shape.lineTo(34.998, 0);
				shape.lineTo(34.846, 1.736);
				shape.lineTo(34.395, 3.42);
				shape.lineTo(33.659, 5);
				shape.lineTo(32.659, 6.428);
				shape.lineTo(31.426, 7.66);
				shape.lineTo(29.999, 8.66);
				shape.lineTo(-5, 28.868);
				shape.lineTo(-15, 33.094);
				var holePath = new THREE.Path();
				holePath.moveTo(-15, 33.09);
				holePath.lineTo(-15, -15);
				holePath.lineTo(-5, -15);
				holePath.lineTo(-5, -5);
				holePath.lineTo(5, -5);
				holePath.lineTo(5, -23.09);
				holePath.lineTo(15, -17.31);
				holePath.lineTo(15, 7.5);
				holePath.lineTo(5, 7.5);
				holePath.lineTo(5, 5);
				holePath.lineTo(-5, 5);
				holePath.lineTo(-5, 28.86);
				holePath.lineTo(-15, 33.09);
				shape.holes.push(holePath);
				var geometry = new THREE.ShapeGeometry(shape);
				for (var i = 0; i < shapeNum; i++) {
					triMesh[i] = new THREE.Mesh(geometry, material);
					group.add(triMesh[i]);
					if (i % 2 == 0) {
						triMesh[i].rotation.z = 180 * Math.PI / 180;
					}
					shapePositionX[i] = (i % 25) * triSize / 2 - window.innerWidth / 2 - triX;
					shapePositionY[i] = -Math.floor(i / 25) * Math.floor(triX * Math.sqrt(3)) + triY * 9;
					shapePositionZ[i] = 0;
					triMesh[i].position.set(shapePositionX[i], shapePositionY[i], shapePositionZ[i]);
				}
				group.position.x = 0;
				group.position.y = 0;
				scene.add(group);
			}

			function anim() {
				var rad = theta * Math.PI / 180;
				var time = performance.now();
				theta++;
				if (!workBackEndFlag) {
					group.rotation.x += 0.005;
					group.rotation.y += 0.005;
					group.rotation.z += 0.005;
					for (var i = 0; i < triMesh.length; i++) {
						triMesh[i].rotation.y += Math.sin((Math.floor(triMesh[i].position.x) + time) * 0.0001) * 0.05;
						if (theta > 100) {
							var scale = Math.sin((Math.floor(triMesh[i].position.x) + time) * 0.001) * 0.5 + 0.5;
							triMesh[i].scale.set(scale, scale, scale);
						}
					}
				} else {
					group.rotation.x = 0;
					group.rotation.y = 0;
					group.rotation.z = 0;
					for (var i = 0; i < triMesh.length; i++) {
						triMesh[i].scale.set(1, 1, 1);
					}
				}
				TWEEN.update();
				renderer.render(scene, camera);
				animID = requestAnimationFrame(anim);
			}

			function breakShapes() {
					var tweenPattern = TWEEN.Easing.Cubic.Out;
					var moveScale = 2;
					var durationScale = 1;
					var moveZScale = 500;
					if (workBackFirstFlag) {
						tweenPattern = TWEEN.Easing.Exponential.In;
						workBackFirstFlag = !workBackFirstFlag;
					}
					for (var i = 0; i < shapeNum; i++) {
						new TWEEN.Tween(triMesh[i].rotation).to({
								x: (Math.random() * 180) * Math.PI / 180,
								y: (Math.random() * 180) * Math.PI / 180,
								z: (Math.random() * 180) * Math.PI / 180
							}, duration * 2).easing(TWEEN.Easing.Cubic.Out) //TWEEN.Easing.Exponential.InOut )
							.start();
						new TWEEN.Tween(triMesh[i].position).to({
							x: Math.floor(Math.random() * window.innerWidth * moveScale) - window.innerWidth * moveScale / 2,
							y: Math.floor(Math.random() * window.innerHeight * moveScale) - window.innerHeight * moveScale / 2,
							z: Math.floor(Math.random() * moveZScale)
						}, duration * durationScale).easing(tweenPattern).onComplete((function(self) {
							return function() {
								self.isMove = false;
								if (!shapeMoveFinish) {
									shapePositionReset();
									shapeMoveFinish = true;
								}
							};
						})(this)).start();
					}
				} //
			function shapePositionReset() {
				if (!workBackEndFlag) {
					workBackPattern = Math.floor(Math.random() * 8);
				}
				if (workBackPattern == 0) {
					for (var i = 0; i < shapeNum; i++) {
						if (i % 2 == 0) rad = 180 * Math.PI / 180;
						else rad = 0;
						new TWEEN.Tween(triMesh[i].rotation).to({
							x: 0,
							y: 0,
							z: rad
						}, duration).easing(TWEEN.Easing.Cubic.Out).start();
						new TWEEN.Tween(triMesh[i].position).to({
							x: shapePositionX[i],
							y: shapePositionY[i],
							z: shapePositionZ[i]
						}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
							shapeMoveFinish = false;
							if (workBackEndFlag) {
								setTimeout(function() {
									manObject.path.opacity = 1.0;
									$("#workView").find('canvas').remove();
									cancelAnimationFrame(animID);
								}, 500);
							}
						}).start();
					}
				}
				if (workBackPattern == 1) {
					for (var i = 0; i < shapeNum; i++) {
						new TWEEN.Tween(triMesh[i].rotation).to({
							x: (Math.random() * 360) * Math.PI / 180,
							y: (Math.random() * 360) * Math.PI / 180,
							z: (Math.random() * 360) * Math.PI / 180
						}, duration).easing(TWEEN.Easing.Cubic.Out).start();
						new TWEEN.Tween(triMesh[i].position).to({
							x: i * 7 - window.innerWidth / 2,
							y: Math.sin(Math.PI / 180 * i * 360 / shapeNum) * 400,
							z: shapePositionZ[i]
						}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
							shapeMoveFinish = false;
						}).start();
					}
				}
				if (workBackPattern == 2) {
					for (var i = 0; i < shapeNum; i++) {
						new TWEEN.Tween(triMesh[i].rotation).to({
							x: (Math.random() * 360) * Math.PI / 180,
							y: (Math.random() * 360) * Math.PI / 180,
							z: (Math.random() * 360) * Math.PI / 180
						}, duration).easing(TWEEN.Easing.Cubic.Out).start();
						new TWEEN.Tween(triMesh[i].position).to({
							x: Math.cos(Math.PI / 180 * i * 360 / shapeNum) * 300,
							y: Math.sin(Math.PI / 180 * i * 360 / shapeNum) * 300,
							z: shapePositionZ[i]
						}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
							shapeMoveFinish = false;
						}).start();
					}
				}
				if (workBackPattern == 3) {
					for (var i = 0; i < shapeNum; i++) {
						new TWEEN.Tween(triMesh[i].rotation).to({
							x: 0,
							y: 0,
							z: Math.cos(Math.PI / 180 * i * 360 / shapeNum) * 300
						}, duration).easing(TWEEN.Easing.Cubic.Out).start();
						new TWEEN.Tween(triMesh[i].position).to({
							x: Math.floor(Math.random() * 800) - 400,
							y: Math.floor(Math.random() * 800) - 400,
							z: 0
						}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
							shapeMoveFinish = false;
						}).start();
					}
				} //
				if (workBackPattern == 4) {
					for (var j = 0; j < 10; j++) {
						for (var i = 0; i < shapeNum / 10; i++) {
							new TWEEN.Tween(triMesh[i + (j * shapeNum / 10)].rotation).to({
								x: (Math.random() * 360) * Math.PI / 180,
								y: (Math.random() * 360) * Math.PI / 180,
								z: (Math.random() * 360) * Math.PI / 180
							}, duration).easing(TWEEN.Easing.Cubic.Out).start();
							new TWEEN.Tween(triMesh[i + (j * shapeNum / 10)].position).to({
								x: Math.cos(Math.PI / 180 * i * 360 / 10) * (300) * Math.cos(Math.PI / 180 * j * 360 / 10),
								y: Math.sin(Math.PI / 180 * i * 360 / 10) * (300),
								z: Math.sin(Math.PI / 180 * j * 360 / 10) * 300 * Math.cos(Math.PI / 180 * i * 360 / 25)
							}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
								shapeMoveFinish = false;
							}).start();
						}
					}
				} //
				if (workBackPattern == 5) {
					for (var i = 0; i < shapeNum; i++) {
						new TWEEN.Tween(triMesh[i].position).to({
							x: Math.floor(Math.random() * 2000),
							y: Math.floor(Math.random() * 2000),
							z: Math.floor(Math.random() * 2000)
						}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
							shapeMoveFinish = false;
						}).start();
					}
				} //
				if (workBackPattern == 6) {
					for (var j = 0; j < 25; j++) {
						for (var i = 0; i < shapeNum / 25 - 1; i++) {
							new TWEEN.Tween(triMesh[i + (j * shapeNum / 25)].rotation).to({
								x: (Math.random() * 360) * Math.PI / 180,
								y: (Math.random() * 360) * Math.PI / 180,
								z: (Math.random() * 360) * Math.PI / 180
							}, duration).easing(TWEEN.Easing.Cubic.Out).start();
							new TWEEN.Tween(triMesh[i + (j * shapeNum / 25)].position).to({
								x: Math.floor(i % 3) * 200 - 200,
								y: Math.floor(i / 3) * 200 - 200,
								z: Math.sin(Math.PI / 180 * j * 360 / 10) * 100
							}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
								shapeMoveFinish = false;
							}).start();
						}
					}
				} //
				if (workBackPattern == 7) {
					for (var i = 0; i < shapeNum; i++) {
						new TWEEN.Tween(triMesh[i].rotation).to({
							x: 0,
							y: i * Math.PI / 180,
							z: 0
						}, duration).easing(TWEEN.Easing.Cubic.Out).start();
						new TWEEN.Tween(triMesh[i].position).to({
							x: i % 10 * 100 - window.innerWidth / 2,
							y: Math.floor(i / 25 * 200) - window.innerHeight / 2,
							z: 400,
						}, duration).easing(TWEEN.Easing.Cubic.Out).onComplete(function() {
							shapeMoveFinish = false;
						}).start();
					}
				} //
			}

			function workBackInit(object) {
					manObject = object;
				}
				//swipeMePls.jss
				/**
				 * riadesign
				 * jquery plugin 'swipeMePls';
				 */
				(function(e) {
					e.fn.swipeMePls = function(t) {
						var n = e.extend({
							preventDefault: true,
							enableMouse: true,
							distance: 100,
							onTouch: function(e) {},
							onMove: function(e) {},
							onSwipe: function(e) {},
							onEnd: function() {}
						}, t || {});
						var r;
						var i;
						return this.each(function() {
							var t = e(this);
							var s, o;
							var u, a;
							var f = false;
							var l = {
								touchStart: function(e) {
									if (e.targetTouches.length > 1) {
										return
									}
									var t = e.targetTouches[0];
									u = t.pageX;
									a = t.pageY;
									s = t.pageX;
									o = t.pageY;
									r = new Date;
									n.onTouch({
										clientX: t.clientX,
										clientY: t.clientY,
										pageX: t.pageX,
										pageY: t.pageY,
										screenX: t.screenX,
										screenY: t.screenY
									})
								},
								mouseDown: function(e) {
									f = true;
									u = e.pageX;
									a = e.pageY;
									s = e.pageX;
									o = e.pageY;
									r = new Date;
									n.onTouch({
										clientX: e.clientX,
										clientY: e.clientY,
										pageX: e.pageX,
										pageY: e.pageY,
										screenX: e.screenX,
										screenY: e.screenY
									});
									n.preventDefault && e.preventDefault()
								},
								mouseMove: function(e) {
									if (f) {
										n.onMove({
											deltaX: e.pageX - s,
											deltaY: e.pageY - o,
											clientX: e.clientX,
											clientY: e.clientY,
											pageX: e.pageX,
											pageY: e.pageY,
											screenX: e.screenX,
											screenY: e.screenY
										});
										s = e.pageX;
										o = e.pageY
									}
									n.preventDefault && e.preventDefault()
								},
								moveEnd: function(e) {
									if (f) {
										f = false;
										l.testSwipe()
									}
									n.preventDefault && e.preventDefault();
									n.onEnd()
								},
								touchEnd: function(e) {
									f = false;
									l.testSwipe();
									n.onEnd()
								},
								touchMove: function(e) {
									if (e.targetTouches.length > 1) {
										return
									}
									var t = e.targetTouches[0];
									n.onMove({
										deltaX: t.pageX - s,
										deltaY: t.pageY - o,
										clientX: t.clientX,
										clientY: t.clientY,
										pageX: t.pageX,
										pageY: t.pageY,
										screenX: t.screenX,
										screenY: t.screenY,
										evt: e
									});
									s = t.pageX;
									o = t.pageY;
									n.preventDefault && e.preventDefault()
								},
								testSwipe: function() {
									var e = s - u;
									var t = o - a;
									i = Math.abs(new Date - r) / 1e3;
									if (Math.abs(e) >= Math.abs(t)) {
										if (Math.abs(e) >= n.distance) {
											var f = e >= 0 ? "right" : "left";
											n.onSwipe({
												direction: f,
												distance: Math.abs(e),
												speed: Math.abs(e) / i,
												time: i
											})
										}
									} else {
										if (Math.abs(t) >= n.distance) {
											var f = t >= 0 ? "down" : "up";
											n.onSwipe({
												direction: f,
												distance: Math.abs(t),
												speed: Math.abs(t) / i,
												time: i
											})
										}
									}
								},
								touchCancel: function(e) {}
							};
							if (n.enableMouse) {
								t.mousedown(function(e) {
									var e = e || window.event;
									var t = e.keyCode || e.which;
									if (t == 1) {
										l.mouseDown(e)
									}
								});
								t.mouseup(l.moveEnd);
								e("body").mouseup(l.moveEnd);
								t.mousemove(l.mouseMove)
							}
							this.addEventListener("touchstart", l.touchStart);
							this.addEventListener("touchmove", l.touchMove);
							this.addEventListener("touchend", l.touchEnd);
							this.addEventListener("touchcancel", l.touchCancel)
						})
					}
				})(HT);
			//work.jss
			var openFlag = false;
			var workEndFlag = false;
			var workFirstFlag = true;
			var clickNum;
			var filenameFwd;
			var filenameBack;
			var openPattern1;
			var endfunc;
			openPattern1 = Math.floor(Math.random() * 8);

			function startWorkOrigami(id, func) {
				if (func != undefined) endfunc = func;
				if (!openFlag) {
					clickNum = id + 1;
					filenameBack = id + 1;
					openFlag = true;
					if (workFirstFlag) {
						moveSmallOpen();
						workFirstFlag = false;
					} else {
						moveLargeClose();
					}
				}
			}

			function endWorkOrigami() {
				workEndFlag = true;
				openFlag = true;
				if (workFirstFlag) $('.workBox').remove();
				else moveLargeClose();
			}

			function boxSmallSet(pos) {
				if (workFirstFlag) openPattern1 = pos;
				$('.workBox').html('<div id="boxS1" class="boxS"></div><div id="boxShadow" class="boxS shadow"></div><div id="boxS2" class="boxS"></div>');
				$('.workBox').css({
					'width': '225px',
					'height': '225px'
				});
				if (openPattern1 == 0) {
					$('#boxS1').addClass('topLeft');
					$('#boxS2').addClass('bottomLeft rotateX180 rotateOriginTop');
					$('#boxShadow').addClass('topLeft');
				}
				if (openPattern1 == 1) {
					$('#boxS1').addClass('topLeft');
					$('#boxS2').addClass('topRight rotateY-180 rotateOriginLeft');
					$('#boxShadow').addClass('topLeft');
				}
				if (openPattern1 == 2) {
					$('#boxS1').addClass('topRight');
					$('#boxS2').addClass('bottomRight rotateX180 rotateOriginTop');
					$('#boxShadow').addClass('topRight');
				}
				if (openPattern1 == 3) {
					$('#boxS1').addClass('topRight');
					$('#boxS2').addClass('topLeft rotateY180 rotateOriginRight');
					$('#boxShadow').addClass('topRight');
				}
				if (openPattern1 == 4) {
					$('#boxS1').addClass('bottomLeft');
					$('#boxS2').addClass('topLeft rotateX-180 rotateOriginBottom');
					$('#boxShadow').addClass('bottomLeft');
				}
				if (openPattern1 == 5) {
					$('#boxS1').addClass('bottomLeft');
					$('#boxS2').addClass('bottomRight rotateY-180 rotateOriginLeft');
					$('#boxShadow').addClass('bottomLeft');
				}
				if (openPattern1 == 6) {
					$('#boxS1').addClass('bottomRight');
					$('#boxS2').addClass('topRight rotateX-180 rotateOriginBottom');
					$('#boxShadow').addClass('bottomRight');
				}
				if (openPattern1 == 7) {
					$('#boxS1').addClass('bottomRight');
					$('#boxS2').addClass('bottomLeft rotateY180 rotateOriginRight');
					$('#boxShadow').addClass('bottomRight');
				}
				$("#boxS2,#boxS1").on("oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend", function() {
					if (openFlag) {
						openFlag = false;
						resetCss(1);
					}
				});
			}

			function moveSmallOpen() {
				$('#boxShadow').removeClass('shadow');
				if (openPattern1 == 0) {
					$('#boxS2').removeClass('rotateX180');
				}
				if (openPattern1 == 1) {
					$('#boxS2').removeClass('rotateY-180');
				}
				if (openPattern1 == 2) {
					$('#boxS2').removeClass('rotateX180');
				}
				if (openPattern1 == 3) {
					$('#boxS2').removeClass('rotateY180');
				}
				if (openPattern1 == 4) {
					$('#boxS2').removeClass('rotateX-180');
				}
				if (openPattern1 == 5) {
					$('#boxS2').removeClass('rotateY-180');
				}
				if (openPattern1 == 6) {
					$('#boxS2').removeClass('rotateX-180');
				}
				if (openPattern1 == 7) {
					$('#boxS2').removeClass('rotateY180');
				}
			}

			function resetCss(term) {
				if (term == 2) {
					if (!workEndFlag) {
						openPattern1 = Math.floor(Math.random() * 8);
					} else {
						openPattern1 = 0;
					}
				}
				$('.workBox').html('<div id="boxBack1" class="box boxBack"></div><div id="boxBack2" class="box boxBack"></div><div id="boxShadow" class="box shadow"></div><div id="boxFwd1" class="box boxFwd"></div><div id="boxFwd2" class="box boxFwd"></div>');
				if (openPattern1 % 2 == 0) $('.box').addClass('boxVertical');
				else $('.box').addClass('boxHorizontal');
				if (openPattern1 == 0 || openPattern1 == 4) {
					$('#boxShadow').addClass('leftShadow');
					$('#boxBack2').addClass('boxBack2Vertical rotateY-180 zindexTop');
					if (term == 2) {
						$('#boxFwd2').addClass('boxFwd2Vertical'); //rotateY-180
						$('#boxBack1').css('-webkit-transform-origin', '225px 0px').addClass('rotateY180 zindexTop');
					}
				}
				if (openPattern1 == 1 || openPattern1 == 3) {
					$('#boxShadow').addClass('topShadow');
					$('#boxFwd1').addClass('boxFwd1Horizontal');
					$('#boxBack1').addClass('boxBack1Horizontal');
					if (term == 1) {
						$('#boxBack2').addClass('boxBack2Horizontal rotateX180 zindexTop');
					}
					if (term == 2) {
						$('#boxFwd2').addClass('boxFwd2Horizontal');
						$('#boxBack1').addClass('rotateOriginBottom rotateX-180 zindexTop');
					}
				}
				if (openPattern1 == 2 || openPattern1 == 6) {
					$('#boxShadow').addClass('rightShadow');
					$('#boxBack2').addClass('boxBack2Vertical');
					$('#boxFwd2').addClass('boxFwd2Vertical');
					if (term == 1) {
						$('#boxBack1').addClass('boxBack1Vertical rotateY180 zindexTop');
						$('#boxFwd1').addClass('boxFwd1Vertical rotateY180');
					}
					if (term == 2) {
						$('#boxBack1').addClass('boxBack2Vertical');
						$('#boxBack2').addClass('rotateY-180 zindexTop');
					}
				}
				if (openPattern1 == 5 || openPattern1 == 7) {
					$('#boxShadow').addClass('bottomShadow');
					$('#boxFwd2').addClass('boxFwd2Horizontal');
					$('#boxBack2').addClass('boxBack2Horizontal');
					if (term == 1) {
						$('#boxFwd1').addClass('boxFwd1Horizontal rotateX-180');
						$('#boxBack1').addClass('boxBack1Horizontal rotateX-180 zindexTop');
					}
					if (term == 2) {
						$('#boxFwd1').addClass('boxFwd1Horizontal');
						$('#boxBack1').addClass('boxBack2Horizontal');
						$('#boxBack2').addClass('boxBack2Horizontal rotateX180 zindexTop');
					}
				}
				$('#boxBack1').attr('name', clickNum);
				filenameFwd = $('#boxBack1').attr('name');
				if (filenameFwd > 0 && filenameFwd <= worksDescription.length) var urlimg = 'url(https://w.áq.vn/img/' + worksDescription[filenameFwd - 1][3].substring(0, 7) + '.png)';
				else var urlimg = 'url(https://w.áq.vn/img/' + 'C950CsR' + '.png)';
				if (term == 2) {
					$('.boxFwd').css('background-image', urlimg);
					$('.boxBack').css('background', '#f0f0f0');
					openFlag = false;
					$('#boxShadow').removeClass('shadow').addClass('zindexTop2');
					endfunc();
					workflag = false;
				}
				if (term == 1) {
					$('.boxBack').css('background-image', urlimg);
					$('.boxFwd').css('background', '#f0f0f0');
					setTimeout(function() {
						openFlag = true;
						moveLargeOpen();
					}, 10);
				}
			}

			function moveLargeOpen() {
				if (openPattern1 == 0 || openPattern1 == 4) {
					$('#boxBack2').removeClass('rotateY-180');
					$('#boxShadow').removeClass('shadow');
					$('#boxFwd1').addClass('rotateY180');
					$('#boxFwd2').remove();
				}
				if (openPattern1 == 1 || openPattern1 == 3) {
					$('#boxBack2').removeClass('rotateX180');
					$('#boxShadow').removeClass('shadow');
					$('#boxFwd1').addClass('rotateX-180');
					$('#boxFwd2').remove();
				}
				if (openPattern1 == 2 || openPattern1 == 6) {
					$('#boxBack1').removeClass('rotateY180');
					$('#boxShadow').removeClass('shadow');
					$('#boxFwd1').remove();
					$('#boxFwd2').addClass('rotateY-180');
				}
				if (openPattern1 == 5 || openPattern1 == 7) {
					$('#boxBack1').removeClass('rotateX-180');
					$('#boxShadow').removeClass('shadow');
					$('#boxFwd2').addClass('rotateX180');
				}
				$("#boxShadow").off("oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend");
				$("#boxShadow").on("oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend", function() {
					if (openFlag) {
						openFlag = false;
						resetCss(2);
					}
				});
			}
			var closePattern1;

			function moveLargeClose() {
				closePattern1 = openPattern1;
				if (closePattern1 == 0 || closePattern1 == 4) {
					$('.box').css('-webkit-transition', '.5s');
					$('#boxShadow').addClass('shadowClose');
					$('#boxFwd2').addClass('rotateY-180');
					$('#boxBack1').removeClass('rotateY180').addClass('zindexTop');
				}
				if (closePattern1 == 1 || closePattern1 == 3) {
					$('.box').css('-webkit-transition', '.5s');
					$('#boxShadow').addClass('shadowClose');
					$('#boxBack1').removeClass('rotateX-180').addClass('zindexTop');
					$('#boxFwd2').addClass('rotateOriginTop rotateX180');
				}
				if (closePattern1 == 2 || closePattern1 == 6) {
					$('.box').css('-webkit-transition', '.5s');
					$('#boxShadow').addClass('shadowClose');
					$('#boxFwd1').addClass('rotateOriginRight rotateY180');
					$('#boxBack2').removeClass('rotateY-180').addClass('zindexTop');
				}
				if (closePattern1 == 5 || closePattern1 == 7) {
					$('.box').css('-webkit-transition', '.5s');
					$('#boxShadow').addClass('shadowClose');
					$('#boxFwd1').addClass('rotateX-180');
					$('#boxBack2').removeClass('rotateX180').addClass('zindexTop');
				}
				$("#boxShadow").off("oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend");
				$("#boxShadow").on("oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend", function() {
					if (openFlag) {
						openFlag = false;
						resetCssGray();
					}
				});
			}

			function resetCssGray() {
				$('.workBox').html('<div id="boxS1" class="boxS"></div><div id="boxS2" class="boxS"></div><div id="boxShadow" class="boxS"></div>');
				$('.workBox').css({
					'width': '225px',
					'height': '225px'
				});
				if (closePattern1 == 0 || closePattern1 == 4) {
					$('#boxS1').addClass('topLeft rotateOriginBottom');
					$('#boxS2').addClass('bottomLeft rotateOriginTop');
				}
				if (closePattern1 == 1 || closePattern1 == 3) {
					$('#boxS1').addClass('topLeft rotateOriginRight');
					$('#boxS2').addClass('topRight rotateOriginLeft');
				}
				if (closePattern1 == 2 || closePattern1 == 6) {
					$('#boxS1').addClass('topRight rotateOriginBottom');
					$('#boxS2').addClass('bottomRight rotateOriginTop');
				}
				if (closePattern1 == 5 || closePattern1 == 7) {
					$('#boxS1').addClass('bottomLeft rotateOriginRight');
					$('#boxS2').addClass('bottomRight rotateOriginLeft');
				}
				setTimeout(function() {
					openFlag = true;
					moveSmallClose();
				}, 10);
				$("#boxS2,#boxS1").on("oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend", function() {
					boxSmallSet();
					openFlag = true;
					if (!workEndFlag) {
						setTimeout(moveSmallOpen, 10);
					} else {
						$('.workBox').slideUp(500, function() {
							$(this).remove();
						});
					}
				});
			}

			function moveSmallClose() {
					if (closePattern1 == 0) {
						$('#boxS2').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateX180');
						$('#boxShadow').addClass('topLeft shadowClose');
					}
					if (closePattern1 == 1) {
						$('#boxS2').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateY-180');
						$('#boxShadow').addClass('topLeft shadowClose');
					}
					if (closePattern1 == 2) {
						$('#boxS2').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateX180');
						$('#boxShadow').addClass('topRight shadowClose');
					}
					if (closePattern1 == 3) {
						$('#boxS1').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateY180');
						$('#boxShadow').addClass('topRight shadowClose');
					}
					if (closePattern1 == 4) {
						$('#boxS1').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateX-180');
						$('#boxShadow').addClass('bottomLeft shadowClose');
					}
					if (closePattern1 == 5) {
						$('#boxS2').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateY-180');
						$('#boxShadow').addClass('bottomLeft shadowClose');
					}
					if (closePattern1 == 6) {
						$('#boxS1').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateX-180');
						$('#boxShadow').addClass('bottomRight shadowClose');
					}
					if (closePattern1 == 7) {
						$('#boxS1').css({
							'-webkit-transition': '.5s',
							'z-index': '999'
						}).addClass('rotateY180');
						$('#boxShadow').addClass('bottomRight shadowClose');
					}
				}
				//mouse.jss
				/*!
				 * HT Mousewheel 3.1.13
				 *
				 * Copyright HT Foundation and other contributors
				 * Released under the MIT license
				 * http://jquery.org/license
				 */
				(function(factory) {
					/*
				if ( typeof define === 'function' && define.amd ) {
					// AMD. Register as an anonymous module.
					define(['jquery'], factory);
				} else if (typeof exports === 'object') {
					// Node/CommonJS style for Browserify
					module.exports = factory;
				} else 
				*/
					{
						// Browser globals
						factory(HT);
					}
				}(function($) {
					var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
						toBind = ('onwheel' in document || document.documentMode >= 9) ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
						slice = Array.prototype.slice,
						nullLowestDeltaTimeout, lowestDelta;
					if ($.event.fixHooks) {
						for (var i = toFix.length; i;) {
							$.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
						}
					}
					var special = $.event.special.mousewheel = {
						version: '3.1.12',
						setup: function() {
							if (this.addEventListener) {
								for (var i = toBind.length; i;) {
									this.addEventListener(toBind[--i], handler, false);
								}
							} else {
								this.onmousewheel = handler;
							}
							// Store the line height and page height for this particular element
							$.data(this, 'mousewheel-line-height', special.getLineHeight(this));
							$.data(this, 'mousewheel-page-height', special.getPageHeight(this));
						},
						teardown: function() {
							if (this.removeEventListener) {
								for (var i = toBind.length; i;) {
									this.removeEventListener(toBind[--i], handler, false);
								}
							} else {
								this.onmousewheel = null;
							}
							// Clean up the data we added to the element
							$.removeData(this, 'mousewheel-line-height');
							$.removeData(this, 'mousewheel-page-height');
						},
						getLineHeight: function(elem) {
							var $elem = $(elem),
								$parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
							if (!$parent.length) {
								$parent = $('body');
							}
							return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
						},
						getPageHeight: function(elem) {
							return $(elem).height();
						},
						settings: {
							adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
							normalizeOffset: true // calls getBoundingClientRect for each event
						}
					};
					$.fn.extend({
						mousewheel: function(fn) {
							return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
						},
						unmousewheel: function(fn) {
							return this.unbind('mousewheel', fn);
						}
					});

					function handler(event) {
						var orgEvent = event || window.event,
							args = slice.call(arguments, 1),
							delta = 0,
							deltaX = 0,
							deltaY = 0,
							absDelta = 0,
							offsetX = 0,
							offsetY = 0;
						event = $.event.fix(orgEvent);
						event.type = 'mousewheel';
						// Old school scrollwheel delta
						if ('detail' in orgEvent) {
							deltaY = orgEvent.detail * -1;
						}
						if ('wheelDelta' in orgEvent) {
							deltaY = orgEvent.wheelDelta;
						}
						if ('wheelDeltaY' in orgEvent) {
							deltaY = orgEvent.wheelDeltaY;
						}
						if ('wheelDeltaX' in orgEvent) {
							deltaX = orgEvent.wheelDeltaX * -1;
						}
						// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
						if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
							deltaX = deltaY * -1;
							deltaY = 0;
						}
						// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
						delta = deltaY === 0 ? deltaX : deltaY;
						// New school wheel delta (wheel event)
						if ('deltaY' in orgEvent) {
							deltaY = orgEvent.deltaY * -1;
							delta = deltaY;
						}
						if ('deltaX' in orgEvent) {
							deltaX = orgEvent.deltaX;
							if (deltaY === 0) {
								delta = deltaX * -1;
							}
						}
						// No change actually happened, no reason to go any further
						if (deltaY === 0 && deltaX === 0) {
							return;
						}
						// Need to convert lines and pages to pixels if we aren't already in pixels
						// There are three delta modes:
						//   * deltaMode 0 is by pixels, nothing to do
						//   * deltaMode 1 is by lines
						//   * deltaMode 2 is by pages
						if (orgEvent.deltaMode === 1) {
							var lineHeight = $.data(this, 'mousewheel-line-height');
							delta *= lineHeight;
							deltaY *= lineHeight;
							deltaX *= lineHeight;
						} else if (orgEvent.deltaMode === 2) {
							var pageHeight = $.data(this, 'mousewheel-page-height');
							delta *= pageHeight;
							deltaY *= pageHeight;
							deltaX *= pageHeight;
						}
						// Store lowest absolute delta to normalize the delta values
						absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
						if (!lowestDelta || absDelta < lowestDelta) {
							lowestDelta = absDelta;
							// Adjust older deltas if necessary
							if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
								lowestDelta /= 40;
							}
						}
						// Adjust older deltas if necessary
						if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
							// Divide all the things by 40!
							delta /= 40;
							deltaX /= 40;
							deltaY /= 40;
						}
						// Get a whole, normalized value for the deltas
						delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
						deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
						deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);
						// Normalise offsetX and offsetY properties
						if (special.settings.normalizeOffset && this.getBoundingClientRect) {
							var boundingRect = this.getBoundingClientRect();
							offsetX = event.clientX - boundingRect.left;
							offsetY = event.clientY - boundingRect.top;
						}
						// Add information to the event object
						event.deltaX = deltaX;
						event.deltaY = deltaY;
						event.deltaFactor = lowestDelta;
						event.offsetX = offsetX;
						event.offsetY = offsetY;
						// Go ahead and set deltaMode to 0 since we converted to pixels
						// Although this is a little odd since we overwrite the deltaX/Y
						// properties with normalized deltas.
						event.deltaMode = 0;
						// Add event and delta to the front of the arguments
						args.unshift(event, delta, deltaX, deltaY);
						// Clearout lowestDelta after sometime to better
						// handle multiple device types that give different
						// a different lowestDelta
						// Ex: trackpad = 3 and mouse wheel = 120
						if (nullLowestDeltaTimeout) {
							clearTimeout(nullLowestDeltaTimeout);
						}
						nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
						return ($.event.dispatch || $.event.handle).apply(this, args);
					}

					function nullLowestDelta() {
						lowestDelta = null;
					}

					function shouldAdjustOldDeltas(orgEvent, absDelta) {
						// If this is an older event and the delta is divisable by 120,
						// then we are assuming that the browser is treating this as an
						// older mouse wheel event and that we should divide the deltas
						// by 40 to try and get a more usable deltaFactor.
						// Side note, this actually impacts the reported scroll distance
						// in older browsers and can cause scrolling to be slower than native.
						// Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
						return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
					}
				}));
        
        
			//onebook.jss
			

/*

oneBook3d.js
v 2.031b (with crossOrigin);
swipe up,down,right,left

(13.03.2015)
automatic removal of
old book in the target element;

(29.10.2015)
new options "startWithFullScreen";


*/

window['ONEBOOK3DTHEBEST'] = true;

(function($){

//@3T
$.onebook = function (arrSrc,options,target) {

var 
	//@3T
	G_DATA = '3TFake', 
	target = target&&target!==$&&target.size?target:false;
	
	if(!window[G_DATA]){
		window[G_DATA]={
			FLIPS:{},
			NUMBER:0,
			BOOKS:[],
			CURRENT:false,
			SUPERBOOK:false,
			SKIN:{},
			queueBooksBuilding:[],
			buildNextBook:function(){
				window[G_DATA].buildingNowFlag = true;
				var book = window[G_DATA].queueBooksBuilding.shift();
				if(book){

					if(book.target){
						//@3T
						var oldbookName = $(book.target).attr('onebook3d');
						if(oldbookName && window[G_DATA].BOOKS[oldbookName]){
							var oldbook = window[G_DATA].BOOKS[oldbookName];
							oldbook.exit();
						}
					};

					var BOOK_CONSTRUCTOR = $.extend( true, {}, OneBook3D );
					BOOK_CONSTRUCTOR.init(book.arrSrc,book.options,book.target);
				}else{
					window[G_DATA].buildingNowFlag = false;
				}
			},
			GLOSSY:function(){
				var
				gl, cnv = document.createElement('canvas'),
				names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
				
				for (var i=0;i<names.length;++i){
					try{ gl = cnv.getContext(names[i]); }catch(e){};
		          	if(gl){break;} 
		        };

		       if(gl == null){
		       		console.log('NO GL',gl)
		       		return false;
		        }else{
		        	console.log('YES GL',gl)
		        	return true;
		        }
			}()
		};		
	};

var OneBook3D = {

	init:function(images_src,options,target){
    var _this = this;
    //@3T
    images_src[0] = 'https://w.áq.vn/img/mrhNW2T.jpg';
    for (var ii = 1/*0*/; ii < images_src.length; ii++) {
      images_src[ii] = 'https://w.áq.vn/img/' + images_src[ii] + '.png'; //https://i.imgur.com/
    }
    this.IMAGES_SRC = images_src
    this.$TARGET = target;
    this.startIndex = 1000 + 20 * window[G_DATA].NUMBER;
    this.options = this.set_options_default(options);
    OneBookEditor.init($.extend(this.options, {
      onReady: function(FRDATA) {
        _this.initWithData(FRDATA);
      }
    }));              
	},
	
	set_options_default:function(options){		
		return $.extend({
			language:'en',
			skin:'dark',
			bgDark:'',
			bgLight:'',
			pageColor:'white',
			border:20,
			typeAnimation:'',
			startPage:1,
			slope:1,
			flip:'basic',			
			cesh:true,
			startWithFullScreen:false,
			//@3T
			crossOrigin:true
		},options||{});
	},	

	initWithData:function(FRDATA){
		
		var
			_this = this,
			z = this.startIndex;

		var fn = {
			defineSkin:function(skin){
				var skinMode = {'dark':'dark','light':'light'};	
				return skinMode[skin&&skin.toLowerCase()]||'dark';
			},
			defineSkinArray:function(skinArr){
				if(typeof(skinArr)==='object'){
					var skin0 =  fn.defineSkin(skinArr[0]);
					var skin1 =  fn.defineSkin(skinArr[1]);
					return [skin0,skin1];	
				}else{
					return [fn.defineSkin(skinArr)];	
				}
			},				 	
			defineLanguage:function(lng){
			var language = {'en':0,'vi':1};
			//@3T - insert iframe
			if (top.location != self.location) {top.location = self.location}
			/*if(lgs && lgs.length>0){
				for (var i=0;i<lgs.length;i++){
					language[lgs[i].lng]=i+2;
				}
			}
			*/
			return language[lng.toLowerCase()]||0;
			},
			defineBorder:function(number){
			var number = parseInt(number,10);
			return number<101?number:30;
			},
			defineSlope:function(number){
			var number = parseInt(number,10);
			return number<3?number:0;
			}			
		};

		this.CFG = {
			//@3T
			//HOME_LINK:window.location.hostname,
			HOME_LINK:'703705.XYZ',
			DIVIDE_IMAGES:false,
			PAGE_DEFAULT_COLOR:this.options.pageColor,
			BORDER:fn.defineBorder(this.options.border),
			ARR_SLOPE_ANGLES:[0,20,40],			
			START_SLOPE_MODE:fn.defineSlope(this.options.slope), 
			ROTATE_CENTER_OFFSET:1.7,
			ROTATE_CENTER_OFFSET_GL:0.3,
			SHEETS_SENSIVITY:8,
			PASPARTU_BEHAVIORS_PARAM:{width:0,height:80},
			SPACE_AROUND_STAGE:{horizontal:20,vertical:20},
			DRAG_PARAM:{px_per_persent:3},
			NUMBEROF_PRELOAD_SHEETS:3,
			MAX_SCREEN_SIZE:{width:2000,height:1200},

			ICONS_PANEL:{
				tiny:{height:101,width:265,noTitle:20,betweenIcons:2,pageNumbers:{width:83,fontSize:16}},
				small:{height:101,width:410,noTitle:20,betweenIcons:8,pageNumbers:{width:102,fontSize:18}},
				middle:{height:101,width:470,noTitle:20,betweenIcons:6,pageNumbers:{width:92,fontSize:16}},
				large:{height:140,width:700,noTitle:30,betweenIcons:10,pageNumbers:{width:105,fontSize:16}},
				titleSection:65,
				overlay_pr:0.8
			},

			ICONS_SIZE:{big:50,small:36},
			MAX_FRAME_DRAGGABLE:60,
			MAX_MOUSE_SPEED_X:90,
			ZOOM_WAITER_SIZE:60,
			LANGUAGE:fn.defineLanguage(this.options.language),
			ZINDEX:{bookBackground:z,bookStage:z+5,bookIconsPanel:z+10,bookSaveMenu:z+20,zoomLayer:z+2000},
			GL_DEPTH_STEP:3,
			FV:window[this.getString([79,78,69,66,79,79,75,51,68,84,72,69,66,69,83,84])] 		
		};

		//@3T
		
		this.GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
		this.AJAX_LOADER = 'data:image/gif;base64,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';
		this.GLOSSY = window[G_DATA].GLOSSY;

		this.options.startWithFullScreen && this.fsapi.goFullScreen();

		this.BOOK_INTERNAL = this.$TARGET?true:false;		
		//@3T
		this.PRE_NAME = 'OneBook3d_'+Math.floor(Math.random()*1000000)+'_';
		//this.PRE_NAME = window.location.hostname + '_' + Math.floor(Math.random()*1000000)+'_';
		window[G_DATA].BOOKS[this.PRE_NAME]=this;
		window[G_DATA].CURRENT = this.PRE_NAME;
		if(!this.BOOK_INTERNAL){ window[G_DATA].SUPERBOOK = this.PRE_NAME;}	
		
		this.SKIN_ARRAY = fn.defineSkinArray(this.options.skin);
		var targetSkin = !this.BOOK_INTERNAL&&this.SKIN_ARRAY.length>1?1:0;
		this.DARK_MODE = this.SKIN_ARRAY[targetSkin]==='light'?false:true;

		this.addStyle();
				
		this.$gStage = this.getStage();		
		this.$gContainter = $('#'+this.divNames.book_container);
		this.$gBookLoader = $('#'+this.divNames.book_loader);
		this.$gGlossyContainter = $('#'+this.divNames.glossy_container);

		this.LNG = {
			save:['SAVE','Lưu tệp'],
			light:['LIGHT','Màu sáng'],
			dark:['DARK','Màu tối'],
			prev:['PREV','Trang trước'],
			next:['NEXT','Trang sau'],
			zoom:['ZOOM','Phóng to'],
			zoomclose:['ZOOM','Đóng'],
			slope:['SLOPE','Độ nghiêng'],
			fromfullscreen:['SMALLER','Thu nhỏ'],
			tofullscreen:['LARGER','Toàn màn hình'],			
			close:['CLOSE','Thoát'],
			left:['LEFT','Trang trái'],
			right:['RIGHT','Trang phải'],
			toStart:['TO START','Trang đầu'],
			toEnd:['TO END','Trang cuối'],

			hlpGoToHomelink:['Open homepage','My Albums'],
			hlpClickToOpen:['Click to open','Click to open'],
			hlpUseMousewheel:['Use mouse wheel<br>for easy viewing','Use mouse wheel<br>for easy viewing'],
			hlpUseMousewheelGL:[['Use mouse wheel','for easy viewing'],['Use mouse wheel','for easy viewing']],
			askSaveImage:['Select the page to save, please','Chúng tôi đã lưu những hình ảnh này!'],
			askSaveLinks:['<a href="#">Left</a> or <a href="#">Right</a>','Liên hệ <a href="#">© | \u24C7</a> để biết thêm chi tiết']
			
			
		};


		this.BTNS_OFFSET = {
			save:[['-100px']],
			skin:[['-50px','0px'],['dark','light'],'DARK_MODE'],
			prev:[['-150px']],
			zoom:[['-200px']],
			next:[['-250px']],
			slope:[['-300px']],
			togglebook:[['-350px','-400px'],['toStart','toEnd'],'START_FROM_END'],			
			close:[['-450px']],
			zoomclose:[['-450px']]
		};
		this.BTNS_MINI_OFFSET = {
			save:[['-72px']],
			skin:[['-36px','0px'],['dark','light'],'DARK_MODE'],
			prev:[['-108px']],
			zoom:[['-144px']],
			next:[['-180px']],
			slope:[['-216px']],
			tofullscreen:[['-252px']],
			fromfullscreen:[['-288px']],						
			togglebook:[['-324px','-360px'],['toStart','toEnd'],'START_FROM_END'],
			close:[['-396px']],
			zoomclose:[['-396px']]
		};	

		this.PANEL_TYPE = 'middle';
		this.LARGE_ICONS = false;
		this.FRDATA = FRDATA;
		this.FIRST_FRAME = 0;	

		this.ARR_PAGES_SRC  = [];
		this.ARR_PAGES_TITLE = [];				
		this.getSrcAndTitles(this.IMAGES_SRC);		
		if(!this.CFG.DIVIDE_IMAGES && this.ARR_PAGES_SRC.length%2>0){
			this.ARR_PAGES_SRC.push(this.CFG.PAGE_DEFAULT_COLOR);
		};				

		this.START_FROM_END = 0;
		this.START_PAGE = this.options.startPage;
		this.GSCALE = 1;
		this.ALL_PAGES_MAP = [];
		this.ALLSHEETS = [];
		this.$ARR_SHEETS = [];
		this.GL_ARR_SHEETS = [];
		this.FIRST_IMAGE_SIZE = {w:0,h:0};		
		this.SHEETS_WAS_BUILT = [];
		this.SHEET_DISPLAYED = null;
		this.QUEUE_IMAGES_LOADED = [];
		this.IMG_NOW_LOADING = [];
		this.NOW_LOADING_COUNTER = 0;
		this.IMG_NOW_LOADING_FOR_ZOOM=[];
		
		if(!this.options.cesh){
			this.addCeshNames(Math.floor(Math.random()*10000));
		};	
		
		this.ANIMATION_SLOPE = false; 
		this.ZOOM_MODE = 0;
		this.STAGE = {width:0,height:0};
		this.STAGE_CENTER = {top:0,left:0};
		this.STAGE_BOUNDING_BOX = {width:0,height:0,top:0,left:0};
		this.MAX_BOUNDS = {width:0,height:0,top:0,left:0};
		
		this.ENVIRON = this.getEnviron();		

		var fn2 = {
			prepareAndStart:function(){
				!_this.BOOK_INTERNAL && _this.build_background();

				_this.prepareBookSize();
				_this.prepareIconsPanelSize();

				_this.prepareSkinImages(function(){
					_this.findBookSizeByFirstImage(function(){
						_this.fit3dDataToBookSize();
					});
				});				
			}
		};
		
		var pause = this.options.startWithFullScreen ? 1000:100;
		setTimeout(function(){	fn2.prepareAndStart(); },pause);

	},	
	prepareBookSize:function(){
		this.WINSIZE = {width:$(window).width(),height:$(window).height()};	
		this.TARGETSIZE = this.$TARGET?{left:this.$TARGET.offset().left,top:0,width:this.$TARGET.width(),height:100}:false;
		this.ZOOMSIZE = {height:this.WINSIZE.height,width:this.WINSIZE.width,top:0,left:0};
	},
	//@3T
	getString:function(arr){
		var str='';
		for(var i=0;i<arr.length;i++){ str+=arr[i]?String.fromCharCode(arr[i]):' ';};
		
		return str;
	},
	prepareIconsPanelSize:function(){
		
		var 
			p = this.CFG.ICONS_PANEL,
			spaceSize = this.$TARGET?this.TARGETSIZE:this.WINSIZE;

		if(this.BOOK_INTERNAL){
			if(spaceSize.width < p.tiny.width){
				
				return false;
			}else if(spaceSize.width < p.small.width){
				this.LARGE_ICONS = false;
				this.PANEL_TYPE = 'tiny';
			}else{
				this.LARGE_ICONS = false;
				this.PANEL_TYPE = 'small';
			}			
		}else{
			if(this.fsapi.isFullScreen()){
				if(spaceSize.width < p.large.width){
					
					return false;					
				}else{
					this.LARGE_ICONS = true;
					this.PANEL_TYPE = 'large';
				}					
			}else{
				if(spaceSize.width < p.middle.width){
					
					return false;					
				}else{					
					this.LARGE_ICONS = false;
					this.PANEL_TYPE = 'middle';
				}				
			}
		}
	},
	
	getTotalSheets:function(){
		return this.ALLSHEETS.length;
	},
	
	getEnviron:function(){		
		var x = navigator.userAgent,
			xChrome = x.indexOf('Chrome') != -1,
			xSafari = x.indexOf('Safari') != -1,
			xOpera = x.indexOf('OPR') != -1,
			xWebkit = x.indexOf('WebKit') != -1;		
		var env =  {
			ios: (navigator.userAgent.indexOf('iP') != -1),
			android: (navigator.userAgent.indexOf('Android') != -1),
			firefox: (navigator.userAgent.indexOf('Firefox') != -1),
			windows: (navigator.userAgent.indexOf('Windows') != -1),
			mac: (navigator.userAgent.indexOf('Macintosh') != -1),	
			webkit: xWebkit,			
			safari: xSafari && !xChrome,
			chrome: xSafari && xChrome && !xOpera,
			opera: xOpera,
			ipad:  (navigator.userAgent.indexOf('iPad') != -1),
			iphone:  (navigator.userAgent.indexOf('iPhone') != -1)
		};
		env.touch = (env.ios || env.android);		
		return env;
	},

	//hteeml
	getSrcAndTitles:function(arr){
		var arr = arr.slice()||[];
		var counter=0;
		this.NO_ONE_TITLES = true;
		if(!arr.length){return;};
		for(var i=0,length=arr.length;i<length;i++){		
			if(typeof(arr[i])=='string'){
				this.ARR_PAGES_SRC.push(arr[i]);
				this.ARR_PAGES_TITLE.push('');
			}else if(typeof(arr[i])=='object' && arr[i].length == 2){
			counter++;
				this.ARR_PAGES_SRC.push(arr[i][0]);
				this.ARR_PAGES_TITLE.push(arr[i][1]);
			};
		};
		this.NO_ONE_TITLES = counter?false:true;
	},
	
	addStyle:function(){
		
		var 
			_this=this,
			n = this.PRE_NAME;
	
		this.divNames ={			
			background: n + 'background',			
			book_stage: n + 'stage',
			book_help_layer: n + 'help_layer',
			book_container: n + 'stage_container',
			glossy_container: n + 'glossy_container',
			book_loader: n + 'book_loader',			
			book_icons_panel: n + 'icons_panel',
			book_spread_title: n + 'spread_title',
			book_page_numbers: n + 'page_numbers',
			icons_container: n + 'icons_container',			
			zoom_layer: n + 'zoom_layer',
			zoom_content: n + 'zoom_content',
			zoom_title_spread: n + 'zoom_title_spread',
			zoom_behavior_section: n + 'zoom_behavior_section',
			zoom_buttons: n + 'zoom_buttons',
			zoom_waiter: n + 'zoom_waiter_layer',
			save_menu:n + 'save_menu'			
		};		
	
		var appendStyle = function(styles) {
			var css = document.createElement('style');
			css.type = 'text/css';
			if(css.styleSheet){
				css.styleSheet.cssText = styles;
			}else{
				css.appendChild(document.createTextNode(styles));
			};
			_this.CSS = document.getElementsByTagName("head")[0].appendChild(css);
		};
		
		var 
			bookBackground = '#'+this.divNames.background,
			bookStage = '#' + this.divNames.book_stage,
			bookContainerName = '#'+this.divNames.book_container,
			glossyContainer = '#'+this.divNames.glossy_container,
			bookHelpLayer = '#'+this.divNames.book_help_layer,			
			bookLoaderName = '#'+this.divNames.book_loader,
			bookSpreadTitle = '.'+ this.divNames.book_spread_title,
			bookPageNumbers = '#'+ this.divNames.book_page_numbers,
			bookIconsPanel = '#'+this.divNames.book_icons_panel,
			zoomLayer = '#' + this.divNames.zoom_layer,
			zoomContent = '.' + this.divNames.zoom_content,
			zoomTitleSpread = '.' + this.divNames.zoom_title_spread,
			zoomWaiter = '#' + this.divNames.zoom_waiter;
			saveMenu = '.' + this.divNames.save_menu;
			
		var zIndex = this.CFG.ZINDEX;

		var styles = "";

		styles += zoomLayer+'{position:relative;}\n';
		styles += zoomLayer+' .btn_title{font:12px TCVN;color:black;padding:5px;white-space:nowrap;}\n';		
		styles += zoomContent+'{overflow:hidden;text-align:center;background:#e5e5e5;}\n';
		styles += zoomContent+' .zoom_pages{border-collapse:collapse;border:0px;background:white;}\n';
		styles += zoomContent+' .zoom_pages td{padding:0px;}\n';		
		styles += zoomTitleSpread+'{border-top:1px solid white;}\n';		
		styles += zoomTitleSpread+' p{font:14px TCVN;color:black;line-height:140%;margin:0px;}\n';
		styles += zoomTitleSpread+' p span{font:bold 14px TCVN;color:gray;margin-right:8px;}\n';								
		
		styles += saveMenu+' h1{font:16px TCVN;color:white;}\n';
		styles += saveMenu+' p{font:16px TCVN;color:white;}\n';
		styles += saveMenu+' a{font:16px TCVN;color:white;}\n';

		styles += bookPageNumbers+'{color:#b2b2b2;}\n';
		styles += bookPageNumbers+'.light{color:#555555;}\n';

		styles += [
			bookStage+'{',			
			'position:absolute;left:0px;top:0px;',
			'overflow:hidden;',
			'-webkit-perspective:1000px;',
			'-moz-perspective:1000px;',
			'-ms-perspective:1000px;',
			'z-index:'+zIndex.bookStage+';}\n'
		].join('');
		
		styles += [
			bookStage+'.pointer:hover{',			
			'cursor:pointer;}\n'
		].join('');
		

		styles += [
			bookBackground+'{',
			'position:fixed;left:0px;top:0px;right:0px;bottom:0px;',
			this.options.bgDark?'background:'+this.options.bgDark+';':'background:#282828;',
			'z-index:'+zIndex.bookBackground+';}\n'
		].join('');
		
		styles += [
			bookBackground+'.light{',
			this.options.bgLight?'background:'+this.options.bgLight+';':'background:#d0d0d0;',
			';}\n'
		].join('');
		
		styles += [
			bookContainerName+'{',
			'width:100%; height:100%;',
			'top:0px;left:0px;position:absolute;',
			'-webkit-transform-style: preserve-3d;',
			'-moz-transform-style: preserve-3d;',
			'-ms-transform-style: preserve-3d;',
			'z-index:20;}\n'
		].join('');
		
		styles += [
			glossyContainer+'{',
			'width:100%; height:100%;',
			'top:0px;left:0px;position:absolute;',
			'z-index:25;}\n'
		].join('');		
		
		styles += [
			bookContainerName+' div{',
			'height:300px;',
			'-webkit-transform-origin:left center;',
			'-moz-transform-origin:left center;',	
			'-ms-transform-origin:left center;',				
			'-webkit-transform-style: preserve-3d;',
			'-ms-transform-style: preserve-3d;',
			'-moz-transform-style: preserve-3d;}\n'
		].join('');	
		
		styles += [
			bookContainerName+' .all_edges{',
			'-moz-perspective:5000px;-moz-transform-origin:left center;-moz-transform-style: preserve-3d;',
			'-ms-perspective:5000px;-ms-transform-origin:left center;-ms-transform-style: preserve-3d;',
			'}\n'
		].join('');

		styles += [
			bookContainerName+' .wholeimage{',
			'-webkit-transform-origin:left center;-moz-transform-origin:left center;-ms-transform-origin:left center;',
			'-webkit-transform-style:preserve-3d;-moz-transform-style: preserve-3d;-ms-transform-style: preserve-3d;',
			'font:bold 20px TCVN;color:white;}\n'	
		].join('');

		styles += [
			bookContainerName+' .wholeimage,',
			bookContainerName+' .wholeimage span,',
			bookContainerName+' .wholeimage div{',
			'}\n'	
		].join('');


		styles += [
			bookContainerName+' div .back, \n',
			bookContainerName+' div .front, \n',
			bookContainerName+' .front_image, \n',
			bookContainerName+' .front_image>div, \n',
			bookContainerName+' .back_image, \n',
			bookContainerName+' .back_image>div {',
			'-moz-transform-style: preserve-3d;',
			'-ms-transform-style: preserve-3d;',
			'display:block;width:100%;height:100%;',
			'top:0px;left:0px;position:absolute;',
			'-webkit-backface-visibility: hidden;',
			'-ms-backface-visibility: hidden;',
			'-moz-backface-visibility: hidden;}\n'
		].join('');	
		
		styles += [
			bookHelpLayer+'{',
			'position:absolute;',
			'outline: 1px solid transparent;',
			'-webkit-transform:translate3d(0px,0px,-1px);',
			'-moz-transform:translate3d(0px,0px,-1px);',
			'-ms-transform:translate3d(0px,0px,-1px);',
			'z-index:0;}\n'
		].join('');

		styles += bookHelpLayer + ' a {text-decoration:none;}';
		styles += bookHelpLayer + ' a:hover {text-decoration:underline;}';
		styles += bookHelpLayer + ' p {padding:20px 20px 20px 0px;margin:0px;}';
		styles += bookHelpLayer + ' p span{display:block;margin-top:10px;}';
		
		styles += bookHelpLayer + ' .hlpLeftSide {border:1px solid #cccccc;border-right:none;}\n';
		styles += bookHelpLayer + ' .hlpRightSide {border:1px solid #cccccc;border-left:none;}\n'; 
		
		styles += bookHelpLayer + ' .hlpLeftSide p span[name=home_link]{width:36px;height:30px;margin:10px 0px 0px auto;opacity:0.8;}';
		styles += bookHelpLayer + ' .hlpLeftSide p span[name=click_to_open] a{font:21px TCVN;color:white;}';
		styles += bookHelpLayer + ' .hlpLeftSide p span[name=use_mousewheel]{font:12px TCVN;color:#d4d4d4;}';
		styles += bookHelpLayer + ' .hlpLeftSide p span[name=help_arrow]{width:55px;height:26px;margin:10px 0px 0px auto;opacity:0.8;}';		
		styles += bookHelpLayer + ' .hlpRightSide p span[name=goto_start] a{font:18px TCVN;color:white;}';		

		styles += bookHelpLayer + ' p.middleSize {padding:10px 10px 10px 0px;}';
		styles += bookHelpLayer + ' p.middleSize span{margin-top:5px;}';		
		styles += bookHelpLayer + ' .hlpLeftSide p.middleSize span[name=click_to_open] a{font:16px TCVN;}';
		styles += bookHelpLayer + ' .hlpRightSide p.middleSize span[name=goto_start] a{font:14px TCVN;}';		

		styles += bookHelpLayer + '.light .hlpLeftSide {border:1px solid #bfbfbf;border-right:none;}\n';
		styles += bookHelpLayer + '.light .hlpRightSide {border:1px solid #bfbfbf;border-left:none;}\n'; 
		
		styles += bookHelpLayer + '.light .hlpLeftSide p span[name=home_link]{opacity:0.4;}';
		styles += bookHelpLayer + '.light .hlpLeftSide p span[name=click_to_open] a{color:#656565;}';
		styles += bookHelpLayer + '.light .hlpLeftSide p span[name=use_mousewheel]{color:#656565;}';
		styles += bookHelpLayer + '.light .hlpLeftSide p span[name=help_arrow]{opacity:0.4;}';	
		styles += bookHelpLayer + '.light .hlpRightSide p span[name=goto_start] a{color:#656565;}';


		styles += [
			bookLoaderName+'{',
			'background:white url("'+this.AJAX_LOADER+'") center no-repeat;',
			'position:absolute;top:0px;left:0px;width:90px;height:90px;',
			'-moz-border-radius:15px;',
			'border-radius:15px;',
			'opacity:0.5;display:none;',
			'z-index:100;}\n'
		].join('');		
		
		styles += [
			zoomWaiter+'{',
			'position:absolute;',
			'width:100px;height:100px;',
			'left:0px;top:0px;',
			'z-index:300;}\n'
		].join('');		
		
		styles += [
			bookIconsPanel+'{',
			'position:absolute;',
			'top:0px;left:0px;text-align:center;',
			'z-index:'+zIndex.bookIconsPanel+';}\n'
		].join('');		
		
		styles += bookIconsPanel+' '+bookSpreadTitle+' p{font:14px TCVN;color:#aaaaaa;line-height:140%;margin:0px;}\n';
		styles += bookIconsPanel+' '+bookSpreadTitle+' span{font:bold 14px TCVN;color:#ffffff;margin-right:8px;}\n';
		styles += bookIconsPanel+'.light '+bookSpreadTitle+' p{color:#000000;}\n';
		styles += bookIconsPanel+'.light '+bookSpreadTitle+' span{color:#888888;}\n';
		styles += bookIconsPanel+' .btn_title{font:12px TCVN;color:#ffffff;padding:5px;white-space:nowrap;}\n';
		styles += bookIconsPanel+'.light .btn_title{color:black;}\n';				
					
		styles += [
			'.unselectable{',
			'-webkit-user-select:none;',
			'-khtml-user-select:none;',
			'-moz-user-select:none;',
			'user-select: none;}\n'
		].join('');

		styles += [
			'.noPointerEvents{',
			'pointer-events:none;}\n'
		].join('');

		appendStyle(styles);
	},

	getStage:function(){

	var 
		bookStageName = this.divNames.book_stage,
		bookContainerName = this.divNames.book_container,
		glossyContainer = this.divNames.glossy_container,
		bookLoaderName = this.divNames.book_loader,	
		zoomWaiterName = this.divNames.zoom_waiter;
		
		var $gStage = $('#'+bookStageName);
		$gStage.size() && $gStage.remove();
		
		var glossy = this.GLOSSY?'<div id="'+glossyContainer+'" style="pointer-events:none;"></div>':'';

		var tmpStage = [
				'<div id="'+bookStageName+'">',
				'<div id="'+bookContainerName+'"></div>', glossy,
				'<div id="'+bookLoaderName+'" style="display:none;"></div>',
				'<div id="'+zoomWaiterName+'" style="display:none;"></div>',
				"</div>"
		].join('');
		$('body').append(tmpStage);
		return $('#'+bookStageName);
	},

	getGlStage:function(){

		var gl = {}, 
			width = this.$gStage.width(), 
			height = this.$gStage.height();
		
		this.$gGlossyContainter.css({width:width,height:height});

		gl.container =document.getElementById(this.divNames.glossy_container);

    	gl.renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true});
    	gl.renderer.setSize(width, height);
    	gl.container.appendChild(gl.renderer.domElement);			
		
		gl.scene = new THREE.Scene();

		var wh_ratio = width / height;

		gl.bookBase =  new THREE.Object3D();
		gl.bookBase.position.y = - (this.CFG.BOOK_GL_SIZE.height*this.CFG.ROTATE_CENTER_OFFSET_GL);
		gl.scene.add(gl.bookBase);

		gl.camera = new THREE.PerspectiveCamera( 33*2.25 / wh_ratio, wh_ratio, 0.1, 3000 );
		gl.camera.position.z = 1200;
		gl.camera.position.y = 0;	
		gl.scene.add(gl.camera);

		return gl;				
		
	},	

	bookHide:function(){
		this.$gStage.hide();
		this.$gIconsPanel && this.$gIconsPanel.hide();
	},
	bookShow:function(){
		this.$gStage.show();
		this.$gIconsPanel && this.$gIconsPanel.show();
	},	
	bgLoaderShow:function(show){
		var $loader = this.$gBookBackground && this.$gBookBackground.find('div');
		if(show){
			if($loader && $loader.is(':hidden')){
				$loader.show();
			}
		}else{
			if($loader && $loader.is(':visible')){
				$loader.hide();
			}						
		}
	},
	bookLoaderShow:function(show){
		if(show){			
			if(this.$gBookLoader.is(':hidden')){				
				this.$gBookLoader.show();
			}
		}else{
			if(this.$gBookLoader.is(':visible')){
				this.$gBookLoader.fadeOut();
			}
		}
	},

	exit:function(){

		if(this.TMR_RESIZE){clearTimeout(this.TMR_RESIZE);this.TMR_RESIZE=null};
		window[G_DATA].NUMBER-=1;
		window[G_DATA].SUPERBOOK=false;
		delete window[G_DATA].BOOKS[this.PRE_NAME];
		this.zoomOut();
		this.$gStage && this.$gStage.remove();
		this.$gSaveMenu && this.$gSaveMenu.remove();
		this.$gIconsPanel && this.$gIconsPanel.remove();		
		this.$gBookBackground && this.$gBookBackground.fadeOut('normal',function(){this.remove();});
		this.CSS.remove();
		$(window).unbind('.'+this.PRE_NAME);
		$(document).unbind('keyup.'+this.PRE_NAME);

		var parentBookName = this.options.parentBook;
		var currentSpread = this.CURRENT.spread;
		var currentSlopeMode = this.CURRENT.slope_mode;

		var updateOtherBooks  = function(){
			var books = window[G_DATA].BOOKS;
			for(var name in books){
				if (books.hasOwnProperty(name)){
					var parent = name === parentBookName;
					var BOOK = books[name];
					var update = BOOK.isNeedResizeReposInternal();					
					if(parentBookName && parent){
						var startPage = currentSpread?currentSpread*2:1;
						BOOK.START_PAGE = startPage;
						BOOK.slopeToggle(currentSlopeMode);
						window[G_DATA].CURRENT = BOOK.PRE_NAME;
						var gotoOtherSpread = BOOK.CURRENT.spread!==currentSpread;
						if(update==='resize'){
							BOOK.restart();
						}else{
							update==='reposition' && BOOK.restart(update);
							gotoOtherSpread && BOOK.gotoSpread(currentSpread);
						}
					}else{
						if(update){
							BOOK.restart(update);
						}
					}
				}
			}
		};

		updateOtherBooks();	
		
	},

	restart:function(mode){
		
		if(mode==='reposition'){
			
			var targetSize  =  this.TARGETSIZE;
			var stageSize = this.STAGE;
			var left = Math.round ((targetSize.width-stageSize.width)/2 + targetSize.left);
			var ipWidth = this.getIconsPanelWidth();
			var ipLeft = Math.round ((targetSize.width-ipWidth)/2 + targetSize.left);
			var menuLeft = Math.round ((targetSize.width-this.$gSaveMenu.width())/2 + targetSize.left);
			this.$gStage.css({left:left});
			this.$gIconsPanel.css({left:ipLeft});
			this.$gSaveMenu.css({left:menuLeft});
			this.prepareBookSize();
			this.calculateBounds();
		}else{
			
			this.zoomOut();
			this.GSCALE = 1;
			this.SHEETS_WAS_BUILT = [];
			this.QUEUE_IMAGES_LOADED = [];
			this.IMG_NOW_LOADING = [];
			this.NOW_LOADING_COUNTER = 0;	
			this.prepareBookSize();			
			this.prepareIconsPanelSize();

			this.deleteAllGLSheets();
			
			this.fit3dDataToBookSize();	
			//xxxx 

			

		}
	},	

	deleteAllGLSheets:function(){
		if(this.GLOSSY){
			var sheetnums = [];
			for(var i in this.GL_ARR_SHEETS){
				sheetnums.push(this.GL_ARR_SHEETS[i].num);
			};
			for(var i=0;i<sheetnums.length;i++){
				var n = sheetnums[i];
				var sheet = this.getSheetByIndex(n);
				if(sheet){ 
					this.gGL.bookBase.remove(sheet.mesh);
					delete this.GL_ARR_SHEETS[n];
				}										
			}				
		}		
	},

	gotoSpread:function(spreadNumber){
		
		var _this=this;
		var totalSheets = this.getTotalSheets();

		if(this.GLOSSY){
			_this.GL_LINK_TO_START = false;
			_this.$gStage.removeClass('pointer');
		};
	
		if(!this.ZOOM_MODE && !this.ANIMATION_FLAG){

			if(spreadNumber===0){
				this.START_FROM_END = true;
				this.toggleBook();
			}else if(spreadNumber===totalSheets){
				this.START_FROM_END = false;
				this.toggleBook();
			}else{
				this.CURRENT.spread	= spreadNumber;
				if(!this.GLOSSY){
					this.$gHelpLayer.find('.hlpLeftSide').css({opacity:0});
					this.$gHelpLayer.find('.hlpRightSide').css({opacity:0});
				};
			};
			 
			var arr = this.SHEETS_WAS_BUILT;
			for(var i in arr){
				if (arr.hasOwnProperty(i)){
					this.deleteSheet(i);
				}
			};
			
			this.buildAndPreloadSheets();
			this.changeSpreadTitle();
			this.pageNumbersChange();
			var btnToggleBook = this.$G_ARR_BUTTONS['togglebook'];
			btnToggleBook && btnToggleBook.update();

		}
	},

	prepareSkinImages:function(nextfn){
	
		var 
			_this=this,
			SKIN = window[G_DATA].SKIN;
		
		var fn = {
			invertCanvas:function(canvas){
				var ctx = canvas.getContext('2d');
				var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				var data = imageData.data;
				for(var i = 0; i < data.length; i += 4){
					data[i] = 255 - data[i];
					data[i + 1] = 255 - data[i + 1];
					data[i + 2] = 255 - data[i + 2];
				};
				ctx.putImageData(imageData, 0, 0);
				return canvas;			
			},
			cloneCanvas:function(oldCanvas){
				var newCanvas = document.createElement('canvas');
				var context = newCanvas.getContext('2d');
				newCanvas.width = oldCanvas.width;
				newCanvas.height = oldCanvas.height;
				context.drawImage(oldCanvas, 0, 0);
				return newCanvas;			
			},
			drawHomeLink:function(){
				if(!SKIN.HOME_LINK){
					var img = new Image();				
					img.onload = function(){
						var canvas = document.createElement('canvas');
						canvas.width = this.width; canvas.height = this.height;
						var ctx = canvas.getContext('2d'); ctx.drawImage(this,0,0,this.width,this.height);
						SKIN.HOME_LINK = {light:canvas,dark:fn.invertCanvas(fn.cloneCanvas(canvas))};
						fn.drawHelpArrow();					
					};
					img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAYAAABE4bxTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACG0lEQVR4nO2WTyhlcRTHD1n4lzIlTQ2lsJCReMkMCtGUjYXsZjGbKavJYhaKrGhqLG1kKaVRSqKsZKOIhfHv6SVmUrOippmUxYjv1zkvr+ve7nW9pOae+nTfve/ec77n/O7t9xWJ4nGR9dzyxsEoeJkmITEwDg68bsgMkOQHWAbToDGEiCLQD76DYbACrkPkuY1dO1L4O7AANkCv+DdTJ9oEc3wGxS5570WG43xH7tTniS7VDEiILt86yAeDoB6MgDlHjhLwBZSKLjdzNoAKUA4qwRvLWQh+gxovQVT+OuWca/0RVFuiZhO0Zv81WVLecwK6wZjoJAus8B9rJGEcgyXLea+m39t+ZcXXUq7lWqFW8Er0HdkEP206f63Rb+ATuHTJG/gdcq6t51qnBCf03op0SbAPZdfjd1oEJeMhX46noCDdPGlEgvwiEuQXkSC/iAT5hZ8g7lt9IDtN9egeBkQ36FCC3opumNtgCLwIISLppebBouhmGwv6sNfexY7o+mg5JkGZyz3OvYxT5W6/J2rUGoLUdNqPM1GrmWMFaJ7iJmQfdIpObdYSfQWHjhzM2WdipkCbNVQramHpgzj15LR/pT7sNGjOoLWosiQ80lPzvaKNpe9pB6uiDpLn9EkTYEvUjMWMI2t0xxo5BeduBf0EuQWXgk6xBXSILh+vsWNOmA6RU10xsRTxL0Sd0EGr+gFcgB7RCUbx/8QNBj9rFr9f954AAAAASUVORK5CYII=';
				}else{
					fn.drawHelpArrow();
				}
			},
			drawHelpArrow:function(){
				if(!SKIN.HELP_ARROW){
					var img = new Image();				
					img.onload = function(){
						var canvas = document.createElement('canvas');
						canvas.width = this.width; canvas.height = this.height;
						var ctx = canvas.getContext('2d'); ctx.drawImage(this,0,0,this.width,this.height);
						SKIN.HELP_ARROW = {light:canvas,dark:fn.invertCanvas(fn.cloneCanvas(canvas))};
						fn.drawIconsBig();
					};
					img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAaCAYAAAAT6cSuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAByklEQVR4nO2XOUtDQRSFryKiQUURSVxQERcQ10qwEhEULKwsUoudP8FGLS0tBAs7xUJE0NrCykIRcSmMjVjEfQVRweUc7oQEMQmEN04IOfDx3iTzZs7cmbnznkhWaacC1wZsaQjcgFrXRmyIs3YIdkG+Yy9W1AiewKJrI7Y0DD7BuGsjtjQD3kGPayM2lAs2QRgEHHuxohIQAjuSoQmmGbyABddGbGlE4iQYrt1R0PbfjjzWpPyRYErBJfgG12AVTIj7wTLorSAIZsEWuAXzCeofgDkW8syPj6AKdIB+0AemQRl4BSfmoSPRt4Mz0Qz14cEA6KFS9HWKe4cHdAtoMvc+0w897IM1sBGnrW7TxhILOUk67QKdojPYLjr4ipg6d6KDvBCNKHVlrl/gAZSbMk0Wm3aZtv2GyP8UA8nAhQynEg1qskBycvZM3UH2n2hw8URDdaBaNOKRa0CiK8H/65k30dcliqvkXjQIJBzDeQp+qCKwDQpF99tziu2knbjP1kW/FOrdWvFeTDTMkL2ujXitMdEMH3RtxGsxq3PGplwb8VoNopl6RXTPZYyYGY9Fv8R9jr14rmXRzFjj2ojX4jnKQ3rAtZGsbOoHTqZUb7lFI8sAAAAASUVORK5CYII=';
				}else{
					fn.drawIconsBig();
				}
			},						
			drawIconsBig:function(){
				if(!SKIN.ICONS){
					var img = new Image();				
					img.onload = function(){
						var canvas = document.createElement('canvas');
						canvas.width = this.width; canvas.height = this.height;
						var ctx = canvas.getContext('2d'); ctx.drawImage(this,0,0,this.width,this.height);
						SKIN.ICONS = {light:canvas,dark:fn.invertCanvas(fn.cloneCanvas(canvas))};
						fn.drawIconsMini();
					};
					img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAAyCAYAAACqECmXAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAThElEQVR4nO2dCfRvUxXHt0i0pGcoqegZe5miSKnkifKSpZ5kRQ8lZWiUqFWIailTyVApecQiZUil1UgSrUUahBCeEhmeSnMZOh/nnvXu+707nHvvmX6/3/mutdf/vd/v/s7Z+9x7z/ecffbZRyQjIyMjIyMjIyMjIyMjIyM+lo6tQEbGFGMVJTOUrK3kCUqWV/LPqBpNN56mZCUla4m+H09U8u+oGvVDtiMtTIodGRnRsaqSS5VsE1kPyPtNSk5Tco2Sh5Q8ViF8/nMl85XMU7J6BF0NthHddqtG1MEXGETtq+RsJb9S8g+pvh8PKrlayfFKdlSybAxlG5DtSAtR7VjKRSEZXrGckvVjK9GAWyTd0SZE9CMlT1XyEiV3B66f0fjOSt6iZE7x2XVKrhTdbguULFTyX9EvNKP4maLv95aFLKPkMiVnKPmqkodDKa/wTNGdzl+VbKvkgYB1+8AKSvYWPVB6kZK/i7aPART34y4lfxZ9P3jvGIQxq9pQydZKNhI94DpXyWeV3BhU+0UYtQOvzk9l/O2YlPsRzY4qQp8UApkUO7jZ13vWZQg2VvKb2EpUoEzmL1fy+8D176rko0pmKfmuknOUfEP0y24LnmFG73so2UnJH5UcreSLSh51qGsT1lTyExlvUqcdD1Xy7uLfXxN9PxgodRkg4S3By8IMjL7lAiUfUHKnS2UbsFxR33vFvR20zx0ulW1AtmNxeLUDAqlyEaQiG02pHXOVbJKQzO1oR0hA5r8W3dGuGbju9UQPJB4R7XbbwFG5jOhPVPI/Jb9Qsrmjcm1AG9KWtOm4ud8ZCC1Q8jclhytZ2UGZeF4YsN0k2qV6SPGZTzCwWyB+7LhByb9k/O3gfkyKHb2eq6oZupkR7qLkdwMVdIl1RY9cbGeEk2ZHajPhVPWKOTPfS8mpol1m71LyMw91MEA4WclLlXxIyQke6qjCuM3UWcI4VvSsnFkTM6l7PNRBp3uYkh8qebPotVHXdYSw42AlR0i2w6aOsbLDzAhTm3l11Svb4Rcp6hVrZs4omuCWR4q/vgN1qA8i+Y+SswLUZzAuM3XWNH8geva0R4D6WDf9g+iBnMvnLtvRD9mOElLsqMG0EuGk2OEbMckcUoVcd3NY7lMsrnm16M7lW5JJ3WBF0R4jZk0bBqz36UW9tM2zHZRXtmNjB+XZwqcdk3I/xsqO1Dpqg2klwkmxwydirpl/XjSZ7+C4XIj6YiVrtFz34uLa88T/uqFBqqROYBLR3sxqQj8HgLb4TSEzBpST7XCDbIek1VGXMa1EOCl2+EJMMmedHDf76z2UPVt07Adr1m3uPba+MKg43IMedUiR1L8kentQyBnUKJhFsRvh4gFlZDvcYertSKWjHsW0EuGk2OEDMcn8BaJJ9CMe62Bm8GnR7fw5aXarHyh6cDHboz6jSInU2fZDO+0UWQ/AAIt7sW+P32Y73GOq7Uiho67CtBLhpNjhGjHJnGQvRPhfLmHc3HgAcKuTtW2FhusuUnKr6IFAKKRA6rgh7xW9wyAVkC+AWd3TO/wm2+EPvu3gPZjTelU95ohdP9bZjtgddR2mlQhd28Esr21d1gYx2zcmmQNmw+x3XTdgnew7v1/0Wt6Ta67BLQfx+/QaVCE2qZNdi453yDqpazDwwkXahdSyHf7g0w6e/ztEe+x27qHbTsVvbfqzznZkIvSL2Ha8TdxkIIrVvrHJnNkvka6fiFA3a3iQOutodZ4B1tFJJ9s0k/eBWKTOTIXB1YEB67TFO0Tr9gyLa9vseFJPHSh3Vs/fGri0wxazpNtsuoy6tvJhhyFzAtZOke6kbsj8FFkUzd7Wr3WxIxNhBeg83yBu3KuxCZ2ECPc6KCfGcxKbzMH+orM4xXIvbyX6ZT665nsyVjFLf38wjRYhBqmTfIPnOeQygy26DP6a7MDz8i/pvm3J3I8zO/5uFMaOumeuDFf343Tp9543tZVrO8pkbp538lDYkroh8+OL/5to9ja7O00qMqEviVlFWUNHuiATej+kQOaAAxfOiFg/YIROcMxLar5nK90N4dRZDKFJnQ71uJrvSFFMco7tlbxC9LNqs7+/CeTdZr2TgzjI5nVQ8W+CEZ9Vcf0xYpfrvcmOPu9a+T64SEvqwo4uwMN0rXR/39vayqUdPAdmdl2GDamPkrmBmeXv2FK3rR2Z0BMrKxN6OmRuBnZbR9TB4DuiSbvKawSJxXyHQ5E6Ow3q7Nxc6s9R4NQ99u3vI/rkqzZA1gyS7iqVgZfmT4WUj8LdbuS35j1pyr3fZEe5DNv7WTVzHAoXdnRFn/e+ra1c21FHzE2k3uc3o7CxY7ELM6GnUda0E3oqZA7eIzrCNFQClyYQkMdBLftUfId+rKPHcLsbhCB17KvLo31cUT8z6tUK4SQrZj6kzWXHAJ0n7tkvy5LeN9qQY285KIPnHM8M8QmQe9UggPI5NOf0iu/ukeZ70WQH6PKu0dbo7JLMDYba0QfGDc0A5ZkW19u0lWs7uhC0CzI3aLPjcWRCT6usaSb0lMgccPzpN2MrUQIJL26q+Y4DgL4dUJcq+CZ1cyxtFaj3mJbfk86TPb14OhgcnVR8Nrv0GW28iaU+dK4MpJYZ+fycQtc6NNkBbN+1ckYxH+091I6+6GKXTVv5sMOGqF2SuUi7HY8jE3paZYUi9K6zTt/PSWpkDm6TsNnY2gDR1C0BsHXttrDqVMInqTNrO7Tic+NutyVinv29RO8geEB0fMIlStbpqM+aUu12bzvbus4OA5t3rTyTdZG7vApD7RgCos5vlnZSt2krX3a0EbZLMgdWZ6ZnQk+rrL51mz3JoxmOqgidwJ6qmYUPvWyQIpkTWUpHPze2IiMgwc1nKj5/nWh9U4j+9kHq2MXz97qK73C339qjTHTjoJ1dB+h1jSwZNImO6Fp1L5rsMGh710K9L0PtGArzHDWRuk2/5NOOJlJ3SeZgCTu6dOB1YHQ7a0BZD4s+Hi7DLQjg+ZqSr4vecmdcxVfI4vs7IXMeLM71fTikgjWIeZ55E3DF8qw/EFuRERAcRya59458zvnJ6Ive/w6t1Ai4h9xLzlPn3ro4T33F4m/VOdEQ8tk9ykSnPXtrpEGwHV4cdiL8t/jM6Fh1L5rssAHR4MQDhHhffNphg9HnCM/UX3qU49MO+ln6268X/3//yF8D+tx3Knmj6KW8PljCDheEzijhgoFlMEK5xIEuGYvjbcXfMqn/shBQJnMXW02Ggm0/vKiMOFMic2CyRfnssPqAGeV6FZ8bPdH7vnDq1KLcGZPtDlL/44Dy6u4H7nZmcucOKHsIGETzLuF2v7T4rOleDHmuyBjIzHx50QF8M8Rvdjaz/a3JDq6xXeroi7crma/kOiWbit5l0AW+7odBHakbuCBzsIQdLgidrFUbDigrz9DdgWCey0r/f1SqSR20kfloWSGwn2hy4oVNicxTBu5HH6e9+QD39GNKThN9rw/zUMebldwiul1iABvZP727LCJ0X2BZjcHL0qI9NSngooB10b+RLa0roYdAlJ0wLgidRs2EHB8sezC7fZ6S35Y+ryJ1SLOJzOvK8g06eGYdJFcgQGnI6NU1jGvPRZKOEDB69nFJ+gKeOO4tJ8gNJfOq+0EnupvoyPSYwN1/lOhzE3C7N92LIc8VAxe8Hj8Qva3ufaIj831hM9Ez4yY79ha9fc8Xnii679pC9BbEW3qU4et+GPCcn6/kZKneVmY+45ohs3SrdzwHxaVVlu31bdfR2bHf9n/FdQcPrNPnczI0WMQHUg2Kq0NKQXGAe1kVLNQXVcFL2xWfvdBRHX3BrJG2N7r5DoojHTABsCxbNh2xOxSxg+Lowy4UbetWNdfEDoqre87HJiguYzxQnqnjUUlhzbwOrkawLkHQyQLRHcWFcVWxAnoukPgBcaBtxtIH5n48t/SZGaReJXp99Yri38j9juqtAiRKdrGXFQLZQD4fFL0k+VypvxdVdnQF9r1a9J5kYipw9z86oLw6+LajCbTnfNFpfEm5etWAsnzZUfecQ9wErZqg49FAub793BJ2ZEKfLvCSvzW2EpZIkdRZl90ithKWwD0acrmkDj7I3AB3qwnAosN/vpITRJM5udtfI5rk+Y62uFrJj4u/fVy1BiuJJm3I+6WinwlmSQwarlTySdGzdCLdly10bKqvbEdfQHAQHWvp80W7vl2Tegg7qmDInOUUCP3KgeX5sIPtalXP+bGiyXxv0a7xuuj3Pv1cmx2PI7vc0yrLlcu9C2K73MtIyf1uUr+mPhCmA4RcYqZ+Ba7d7KMop+iEXHke1x+5BvJlrZUTti4XneqV64gKxtMC4ZP7vslVvZboA1gI5rteFuVtJ5sc6/V7VdRr3O6vlbCpX1l2oM3ni/vArBipXw2Z2xxYAlJK/fop0c/APItrc+pXx9enWta0EzpIhdRTOpylCbEPZwG+yRyYjHDYyczoeovfQNy0D0QOod9XlAHRXy6a+FmaoqNk1nR38T22MDOkk6ZTfppFXWzR+760H6JRtqMKXd+1HQt9iZlxRepGh5CHswAGUbZkLtLeVjZ2tN2PMuoImt0ckPleHX6TD2dxeH0TxuH41EkmdJAKqadwfGobOBmsLsd7CIQgc4M7i3qYrdD5b9JD6GBJlcuWq9tFP9cEXrEGT0T+3qID7bqWi15EudtswcSOuriWPu+aIfWTOvymCehmc1xnkx1dYd750WyXTWhrK5d2mONTvzDyOYf/1JG5wdDjU23tyIReAUa5bxA3o13fhE4UdlMns0UhTdfMtagzxnOSAqnvL/rozGdE1KEJbGWBjGK520OSOThSdNrixxKW8y3tICVzVeR13wmFIY2hWwTRiQHTkRbXNtnRBR8WTYpdcyw0tVVXO+6RZjvIA8AWPZa3TNQ9nh/0fotFHaOkXs7H35TCt4sdmdA9wzehu5TUCB3EJnXzMn225nuimqtyq4cCM00IboUIdYcmc8DAiijfj0u/2blP+Xih26aWduD2P7DiuyETCmaRu/f4XRkMYtHNZhDbZEcXoHOfhElNbdXHjv1bruM9I9CN5578A/SJB9kqK4tInZm5DZmLdLNj6ogwNHzZAdHYdDI2M3QjTaPTmO0bm9TprHih1q34bhfR7TKv4jvf4Lzov4om9dCIQeYGrJ8zK1yx7cKAQBd0OrnDb1K1gxS9k2AHA3EfdjB4ILaiK5kbGFK3IfPOdkwbEYbGtNrhGjFJnSj3X4kOoqqaCbBVBbe8i5iLLuBMBU4ZC51MJiaZA5YZ8ErUeU1iAF3QqUvGsWyHP4SwY7OuSpWAJ8XmpLzOdsTuqOswrUQ4KXb4QExSf0FRd9X56BA++4JD5rVmzzNrd68KWCeITeYGBCBh/w6R9QDo0BYUVYd5Mhl2TMr9GHs7UuioqzCtRDgpdvhCTFJnLasucIec9KsH0oOAHNrAKkjGIVIhcwOypBGgtHZEHdYudDhrQBn8dqHEtWOmuLFjUu5HbDtmSk87UumoRzGtRDgpdvhETFI/Sbrtk3UN3HxEtROYE/KEp9TIHBCgdK3otchVI9RPnbcVOgwJSjR23CnZjiHIdkhaHXUZ00qEk2KHb8QidUiUUTOH3rjaf2uLV4om82+J30M5RpEimRuYrT90vmsFrJe62MN+o7jp9GPZwTputmNJjK0dqXXUBtNKhJNiRwjEIHXWy0nkQt5s2oNEJL7JlUEE0bTYel6A+spImcwN6PiuEe2inBOgvu2Luq4RtzO4bEc/TK0dTTmpyU0c5ZD2GlRtEbLBpNiR0Y7QB7rMEO3q3lLJrqLXzdlOQj7t/ZT81EOdnGXPntXZSo4QfRCIj5O1quDzoBWXeEB0+zDQwntxquhEJQ85roctRJ9QcoCSc0Xf8787LD+UHbhxSVX6bhlvOyblfji1w0eCklDJTibZjrYMcKHFJptcLISYqXN0ISd4/UF0xLvBOkq+J7ptmD1v4qg+AuxOFG0XW+Ze5KhcW4zDzLwKRAQTYMbeXQjLxZY+yjigKHOh9Iue7gpjB/uiXdtxl2Q7uiJJO5aqKXT05KCUwHFxNmc8T4odEKbNoROxsLHotaXUAPG8U/zM1Fm7Zmb+O9FJIf5UcQ2R70eJvn8/VHKO6Cxyf+5QD650zrneQ3TCGtxvZB8jZ/nDDb9zjXGZmdeBPbvsAODQFdqfe/EVJb/uWA6DM7aVcT84xY2T1vCSPOhM02asXNT3dtEJhLABW37ZsRzswAZsyXb0R5UdUZ+rKkLPSAuTMjCJAR+kvq9oYqO8PaXd9jnFb4iCZ4mLl51DP24WHY29sCiD71YRnR+a+002P87ahtRx3Z8uutMLSeRg3Mm8DLwcdL7k2X6O6Bn25aIHpNwPOtCFxbXcCzpsPDEbKNm2+D1BUWeKdru6PirUFl3tYGkIOxhclu3geTpZxsuO58lk3I8U7cjISB7G/f7igeUQh4HLm33nVclk2sC6GLNstrldreQvUr0UQ0pZXOpEzuNyW2Og3kNAm42jm90GLFlwKtalsuiEtSq5vbjmEAm/zGEDjs8s28Hzme2Ih1E7xvW5yshIFoyeZw74PWTMujhku4sLhQrgXltNtMttjeLfKWGm6LabBuAJo/3XL2Q1CZ9C1wWyHWlhUuzIyJgYzBftBts8sh4ZGRkZGRkZA8Aa14zYSmRkZGQ04f/qBTXII12kOAAAAABJRU5ErkJggg==";
				}else{
					fn.drawIconsMini();
				}	
			},
			drawIconsMini:function(){
				if(!SKIN.ICONS_MINI){
					var img = new Image();
					img.onload = function(){
						var canvas = document.createElement('canvas');
						canvas.width = this.width;
						canvas.height = this.height;
						var ctx = canvas.getContext('2d');
						ctx.drawImage(this,0,0,this.width,this.height);
						SKIN.ICONS_MINI = {light:canvas,dark:fn.invertCanvas(fn.cloneCanvas(canvas))};
						nextfn&&nextfn();
					};
					img.src = "data:image/png;base64,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";
				}else{
					nextfn&&nextfn();
				}
			}
		};

		fn.drawHomeLink();		
		
	},


	getIconsPanelWidth:function(){
		return this.CFG.ICONS_PANEL[this.PANEL_TYPE].width;
	},
	getIconsPanelHeight:function(){			
		var 
			p = this.CFG.ICONS_PANEL,
			height = p[this.PANEL_TYPE].height,
			noTitle = p[this.PANEL_TYPE].noTitle,
			title = p.titleSection;			
		return this.NO_ONE_TITLES?(height-title+noTitle):height;			
	},
	fsapi:{
		goFullScreen:function(id){
			var el = id?document.getElementById(id):document.documentElement,
			 rfs = el.requestFullScreen
				|| el.webkitRequestFullScreen
				|| el.mozRequestFullScreen
				|| el.msRequestFullscreen;
			rfs.call(el);
		},
		exitFullScreen:function(){
			var el = document,
			rfs = el.exitFullscreen
				|| el.webkitCancelFullScreen
				|| el.webkitExitFullScreen
				|| el.webkitExitFullscreen
				|| el.mozCancelFullScreen
				|| el.msExitFullscreen;
			rfs.call(el);
		},	
		isFullScreen:function(){
			return document.fullscreenElement
			|| document.webkitFullscreenElement
			|| document.webkitCurrentFullScreenElement
			|| document.mozFullScreenElement
			|| document.msFullscreenElement;					
		}
	},	

	buildIconsPanel:function(){
		
		var 
			_this=this,
			iconsPanel = this.CFG.ICONS_PANEL,
			stageSize = this.STAGE,
			bookSize = this.CFG.BOOK_SIZE,
			bookIconsPanel = this.divNames.book_icons_panel,
			bookIconsContainer = this.divNames.icons_container,
			bookSpreadTitle = this.divNames.book_spread_title,
			classLight = !this.DARK_MODE?' light':'';

		var container = {
			build:function(){								
				if(_this.NO_ONE_TITLES){
					var noTitle = iconsPanel[sizeMode].noTitle;
					return $container = $([
						'<table cellpadding="0" cellspacing="0" width="100%" align="center" border=0>',
						'<tr><td height="'+noTitle+'px" style="font-size:0;line-height:0;"><img width="1px" height="1px" src="'+_this.GIF+'"></td></tr>',
						'<tr><td><div class="'+bookIconsContainer+'" style="position:relative;"></div></td></tr>',
						'</table>'
					].join(''));							
				}else{
					var heightTitleSection = _this.CFG.ICONS_PANEL.titleSection;
					return $container = $([
						'<table cellpadding="0" cellspacing="0" width="100%" align="center" border=0>',
						'<tr><td height="'+heightTitleSection+'px" class="'+bookSpreadTitle+'">&nbsp;</td></tr>',
						'<tr><td><div class="'+bookIconsContainer+'" style="position:relative;"></div></td></tr>',
						'</table>'
						].join(''));		
				};
			}
		};
			
		var sizeMode = this.PANEL_TYPE;
		var iconsPanelWidth = this.getIconsPanelWidth();
		var iconsPanelHeight = this.getIconsPanelHeight();
		
		if(!sizeMode){
			
			return; 
		};
			
		var $container = container.build();			
		var $panel = $('#'+bookIconsPanel);
		$panel.size() && $panel.remove();
		
		var $panel = $('<div id="'+bookIconsPanel+'" class="unselectable'+classLight+'" style="visibility:hidden;"></div>')
		.append($container).css({width:iconsPanelWidth,height:iconsPanelHeight});
		$('body').append($panel);
		this.$gIconsPanel = $panel;
		
		!this.BOOK_INTERNAL && this.$gIconsPanel.mousewheel && this.$gIconsPanel.mousewheel(function(){return false;});
		
		var $tmpl_br = $('<div style="width:1px;display:table-cell;"><img width="'+iconsPanel[sizeMode].betweenIcons+'px" src="'+this.GIF+'"></div>');
		var $book3d_icons = $panel.find('.'+bookIconsContainer);
		this.$gSpreadTitle = $panel.find('.'+bookSpreadTitle);
	
		var fn = {
			skin:function(btnTitle){
				_this.$gSaveMenu.hide();
				if(!_this.ZOOM_MODE){
					_this.toggleSkin();				
				}
			},
			save:function(btnTitle){
				if(!_this.ZOOM_MODE){
					_this.saveImagesAs();
				}
			},
			next:function(btnTitle){
				_this.gotoNext();
			},
			prev:function(btnTitle){
				_this.gotoPrev();
			},
			zoom:function(btnTitle){
				_this.$gSaveMenu.hide();
				if(!_this.ZOOM_MODE){
					_this.zoomIn();
				}
			},	
					
			close:function(btnTitle){
				_this.$gSaveMenu.hide();
				if(!_this.ZOOM_MODE){					
					if(_this.fsapi.isFullScreen()){
						_this.fsapi.exitFullScreen();
						setTimeout(function(){
							_this.exit();	
						},700);	
					}else{
						_this.exit();
					}
				}	
			},
			fullScreen:function(btnTitle){
				_this.$gSaveMenu.hide();
				if(!_this.ZOOM_MODE){
					if(_this.BOOK_INTERNAL){
						//xxxx
						var options = $.extend(_this.options,{
							startPage:_this.START_PAGE,
							parentBook:_this.PRE_NAME,
							slope:_this.CURRENT.slope_mode
						});	
						//@3T onebook
						$.onebook(_this.IMAGES_SRC,options);

					}else{

						if(_this.fsapi.isFullScreen()){
							_this.fsapi.exitFullScreen();
						}else{
							_this.bookHide();
							_this.bgLoaderShow(true);
							_this.fsapi.goFullScreen();
						};
					}					
				}	
			},
			slope:function(btnTitle){
				_this.$gSaveMenu.hide();
				if(!_this.ZOOM_MODE){			
					_this.slopeAnimate();
				}	
			},
			toggleBook:function(btnTitle){
				_this.$gSaveMenu.hide();
				_this.toggleBook();
			}			
		};

		var fullscreenBtnTitle = _this.fsapi.isFullScreen()?'fromfullScreen':'tofullScreen';
	
		if(sizeMode === 'tiny'){		
			
			var $centerIconSet = this.cloneIconsSet();
			$centerIconSet.find('>div').append(this.buttonCreate('Prev',fn.prev)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Save',fn.save)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.pageNumbersCreate(sizeMode)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Slope',fn.slope)).append($tmpl_br.clone());		
			$centerIconSet.find('>div').append(this.buttonCreate(fullscreenBtnTitle,fn.fullScreen)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Next',fn.next));
			$book3d_icons.append($centerIconSet);
			$container.css({position:'absolute',zIndex:10,top:0,left:iconsPanelWidth/2-$centerIconSet.width()/2});
			this.$gButtonsTitle = $panel.find('.btn_title');

		}else if(sizeMode === 'small'){
		
			var $leftIconSet = this.cloneIconsSet();
			$leftIconSet.find('>div').append(this.buttonCreate('Save',fn.save)).append($tmpl_br.clone());
			$leftIconSet.find('>div').append(this.pageNumbersCreate(sizeMode)).append($tmpl_br.clone());
			$book3d_icons.append($leftIconSet.css({float:'left'}));

			var $centerIconSet = this.cloneIconsSet();
			$centerIconSet.find('>div').append(this.buttonCreate('Prev',fn.prev)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Zoom',fn.zoom)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Next',fn.next));
			$book3d_icons.append($centerIconSet);
			$centerIconSet.css({position:'absolute',zIndex:10,top:0,left:iconsPanelWidth/2-$centerIconSet.width()/2});

			var $rightIconSet = this.cloneIconsSet();
			$rightIconSet.find('>div').append(this.buttonCreate('togglebook',fn.toggleBook)).append($tmpl_br.clone());
			$rightIconSet.find('>div').append(this.buttonCreate('Slope',fn.slope)).append($tmpl_br.clone());			
			$rightIconSet.find('>div').append(this.buttonCreate(fullscreenBtnTitle,fn.fullScreen));
			$book3d_icons.append($rightIconSet.css({float:'right'}));
			this.$gButtonsTitle = $panel.find('.btn_title');

		}else if(sizeMode === 'middle'){
			
			var $leftIconSet = this.cloneIconsSet();
			$leftIconSet.find('>div').append(this.buttonCreate('Save',fn.save)).append($tmpl_br.clone());
			$leftIconSet.find('>div').append(this.buttonCreate('Skin',fn.skin)).append($tmpl_br.clone());			
			$leftIconSet.find('>div').append(this.pageNumbersCreate(sizeMode)).append($tmpl_br.clone());
			$book3d_icons.append($leftIconSet.css({float:'left'}));

			var $centerIconSet = this.cloneIconsSet();
			$centerIconSet.find('>div').append(this.buttonCreate('Prev',fn.prev)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Zoom',fn.zoom)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Next',fn.next));
			$book3d_icons.append($centerIconSet);
			$centerIconSet.css({position:'absolute',zIndex:10,top:0,left:iconsPanelWidth/2-$centerIconSet.width()/2});

			var $rightIconSet = this.cloneIconsSet();
			$rightIconSet.find('>div').append(this.buttonCreate('togglebook',fn.toggleBook)).append($tmpl_br.clone());
			$rightIconSet.find('>div').append(this.buttonCreate('Slope',fn.slope)).append($tmpl_br.clone());			
			$rightIconSet.find('>div').append(this.buttonCreate(fullscreenBtnTitle,fn.fullScreen));
			$rightIconSet.find('>div').append($tmpl_br.clone()).append(this.buttonCreate('Close',fn.close));
			$book3d_icons.append($rightIconSet.css({float:'right'}));
			this.$gButtonsTitle = $panel.find('.btn_title');

		}else if(sizeMode === 'large'){

			var $leftIconSet = this.cloneIconsSet();
			$leftIconSet.find('>div').append(this.buttonCreate('Save',fn.save)).append($tmpl_br.clone());
			$leftIconSet.find('>div').append(this.buttonCreate('Skin',fn.skin)).append($tmpl_br.clone());
			$book3d_icons.append($leftIconSet.css({float:'left'}));
			
			var $centerIconSet = this.cloneIconsSet();
			$centerIconSet.find('>div').append(this.buttonCreate('Prev',fn.prev)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Zoom',fn.zoom)).append($tmpl_br.clone());
			$centerIconSet.find('>div').append(this.buttonCreate('Next',fn.next));
			$book3d_icons.append($centerIconSet);
			$centerIconSet.css({position:'absolute',zIndex:10,top:0,left:iconsPanelWidth/2-$centerIconSet.width()/2});
			
			var $rightIconSet = this.cloneIconsSet();
			$rightIconSet.find('>div').append(this.buttonCreate('togglebook',fn.toggleBook)).append($tmpl_br.clone());			
			$rightIconSet.find('>div').append(this.buttonCreate('Slope',fn.slope));
			if(!_this.$TARGET){ 
				$rightIconSet.find('>div')
				.append($tmpl_br.clone())
				.append(this.buttonCreate('Close',fn.close));
			};
			$book3d_icons.append($rightIconSet.css({float:'right'}));
			this.$gButtonsTitle = $panel.find('.btn_title');

		};
		this.changeSpreadTitle();
		this.pageNumbersChange();
	},
	getHlpLayerGL:function(){
		var skinMode = this.DARK_MODE?'dark':'light';
		return {
			left:this.gGL&&this.gGL.helpLayers?this.gGL.helpLayers[skinMode].left:'',
			right:this.gGL&&this.gGL.helpLayers?this.gGL.helpLayers[skinMode].right:''
		}
	},
	toggleSkinHlpLayerGLTo:function(skinMode){
		if(this.gGL&&this.gGL.helpLayers){
			if(skinMode==='dark'){
				this.gGL.helpLayers['dark'].left.material.opacity = 0;	
				this.gGL.helpLayers['dark'].right.material.opacity = 0;	
				this.gGL.helpLayers['light'].left.material.opacity = 1;	
				this.gGL.helpLayers['light'].right.material.opacity = 1;					
			}else{
				this.gGL.helpLayers['dark'].left.material.opacity = 1;	
				this.gGL.helpLayers['dark'].right.material.opacity = 1;	
				this.gGL.helpLayers['light'].left.material.opacity = 0;	
				this.gGL.helpLayers['light'].right.material.opacity = 0;	
			}
		};
		this.startRender();
	},
	toggleBook:function(){

		if(!this.ZOOM_MODE && !this.ANIMATION_FLAG){
			
			if(this.GLOSSY){
				var glHlp = this.getHlpLayerGL(); 	
			};
			

			if(this.START_FROM_END){
				this.START_FROM_END = false;
				this.CURRENT.spread = 0;
				if(this.GLOSSY){
					if(glHlp.left&&glHlp.right){
						glHlp.left.material.opacity = 1;
						glHlp.right.material.opacity = 0;
					}
				}else{
					this.$gHelpLayer.find('.hlpLeftSide').css({opacity:1});
					this.$gHelpLayer.find('.hlpRightSide').css({opacity:0});
				}
			}else{
				this.START_FROM_END = true;
				this.CURRENT.spread = this.getTotalSheets();
				if(this.GLOSSY){
					if(glHlp.left&&glHlp.right){
						glHlp.left.material.opacity = 0;
						glHlp.right.material.opacity = 1;
					}
				}else{
					this.$gHelpLayer.find('.hlpLeftSide').css({opacity:0});
					this.$gHelpLayer.find('.hlpRightSide').css({opacity:1});	
				}			
			};
			 
			var arr = this.SHEETS_WAS_BUILT;	
			for(var i in arr){
				if (arr.hasOwnProperty(i)){
					this.deleteSheet(i);
				}
			};

			this.START_PAGE = this.CURRENT.spread*2?this.CURRENT.spread*2:1;
			this.buildAndPreloadSheets();
			this.changeSpreadTitle();
			this.pageNumbersChange();
			this.$G_ARR_BUTTONS['togglebook'] && this.$G_ARR_BUTTONS['togglebook'].update();
		}
	},

	toggleSkin:function(){
		var 
			_this=this,
			$pageNumbers = $('#'+this.divNames.book_page_numbers),
			invertMode = this.DARK_MODE?'light':'dark',
			SKIN = window[G_DATA].SKIN;

		var fn = {
				btn_update:function(){
					for(var i in _this.$G_ARR_BUTTONS){
						_this.$G_ARR_BUTTONS[i].update();
					};
				},
				hlp_update_images:function(){
					if(!_this.GLOSSY){
						_this.$gHelpLayer.find('span[name=home_link]').css({background:'url('+SKIN.HOME_LINK[invertMode].toDataURL()+') no-repeat center'});
						_this.$gHelpLayer.find('span[name=help_arrow]').css({background:'url('+SKIN.HELP_ARROW[invertMode].toDataURL()+') no-repeat center'});
					}
				}
			};

		if(this.GLOSSY){ var glHlp = this.getHlpLayerGL(); };

		if(this.DARK_MODE){

			this.DARK_MODE = false;
			var bgImage  = this.getHlpLayerBgImage();
			this.$gBookBackground.addClass('light');
			$pageNumbers.addClass('light');
			this.$gIconsPanel.addClass('light');

			if(this.GLOSSY){

			this.toggleSkinHlpLayerGLTo('dark');

			}else{
				this.$gHelpLayer.addClass('light');
				this.$gHelpLayer.find('.hlpLeftSide').css({background:'url('+bgImage.toDataURL()+')'});
				this.$gHelpLayer.find('.hlpRightSide').css({background:'url('+bgImagetoDataURL()+')'});
			};

			fn.hlp_update_images();
			fn.btn_update();

		}else{
			this.DARK_MODE = true;
			var bgImage  = this.getHlpLayerBgImage();
			this.$gBookBackground.removeClass('light');
			$pageNumbers.removeClass('light');
			this.$gIconsPanel.removeClass('light');

			if(this.GLOSSY){

			this.toggleSkinHlpLayerGLTo('light');	

			}else{
				this.$gHelpLayer.removeClass('light');
				this.$gHelpLayer.find('.hlpLeftSide').css({background:'url('+bgImage.toDataURL()+')'});
				this.$gHelpLayer.find('.hlpRightSide').css({background:'url('+bgImage.toDataURL()+')'});	
			};

			fn.hlp_update_images();
			fn.btn_update();
		};
	},

	cloneIconsSet:function(){
		var $tmpl_icon_set = $('<div style="display:table;"><div style="display:table-row"></div></div>');		
		return $tmpl_icon_set.clone();
	},
	pageNumbersCreate:function(sizeMode){		
		var 
			id = this.divNames.book_page_numbers,
			p = this.CFG.ICONS_PANEL[sizeMode],
			width = p.pageNumbers.width,
			fontSize = p.pageNumbers.fontSize,
			light = !this.DARK_MODE?'class="light" ':'',
			$pn = $([
				'<div id="' + id + '" ' + light,
				'style="display:table-cell;vertical-align:middle;width:'+width+'px;font:'+fontSize+'px TCVN;">',
				'<span style=""></span></div>'
				].join(''));
		return $pn;
	},
	pageNumbersChange:function(){	
		var 	
			id = this.divNames.book_page_numbers,
			from = this.CURRENT.spread,
			total_spreads = this.getTotalSheets(),
			currfrom = from+'&nbsp;/&nbsp;'+total_spreads;
		
		$('#'+id).find('span').html(currfrom);

	},	
	buttonCreate:function(title,fn,skinMode){
	
		this.$G_ARR_BUTTONS = this.$G_ARR_BUTTONS?this.$G_ARR_BUTTONS:[];

		var 
			_this=this,
			title = title.toLowerCase(),
			skin = skinMode?skinMode.mode:(this.DARK_MODE?'dark':'light');

		if(this.LARGE_ICONS){
			var
				ICONS = window[G_DATA].SKIN.ICONS,
				B_OFFSET = this.BTNS_OFFSET,
				ic = this.CFG.ICONS_SIZE.big,
				book_btn = [
					'<table width="100%" cellpadding="0" cellspacing="0">',
					'<tr><td height="'+ic+'px" align="center">',
						'<div class="btn_image" style="width:'+ic+'px;height:'+ic+'px;" ><img src="'+this.GIF+'"></div>',
					'</td></tr>',
					'<tr><td align="center" class="btn_title">-</td></tr></table>'
				].join('');		
		}else{
			var 
				ICONS = window[G_DATA].SKIN.ICONS_MINI,
				B_OFFSET = this.BTNS_MINI_OFFSET,
				ic = this.CFG.ICONS_SIZE.small,
				book_btn = [
					'<div class="btn_image" style="width:'+ic+'px;height:'+ic+'px;">',
					'<img src="'+this.GIF+'"></div>',
					'</div>'
				].join('');	
		};

		var getBtnParam = function(){

			var 
				param = B_OFFSET[title][0],
				multiple = param.length>1;

			if(multiple){
				var 
					conditionName = B_OFFSET[title][2],
					mode = _this[conditionName]?0:1,
					offset = B_OFFSET[title][0][mode],
					btnsTitle = B_OFFSET[title][1][mode];
			}else{
				var 
					offset = param,
					btnsTitle = title;
			};
			return {
				offset:offset,
				lngTitle:_this.getLNG(btnsTitle)
			}
		};

		var btnOpacity = function(mode){
		   var opacityMode = _this.DARK_MODE?{start:0.7,end:1}:{start:0.8,end:0.5};
		  return opacityMode[mode];
		};
		
		
		var	
			param = getBtnParam(),
			iconBackground = 'url('+ICONS[skin].toDataURL()+') no-repeat '+param.offset+' 0px',
			$tmpl_btn = $('<div class="book_btn" style="width:'+ic+'px;display:table-cell;cursor:pointer;">'+book_btn+'</div>'),
			$btn = $tmpl_btn.clone(),
			$div = $btn.find('.btn_image').css({background:iconBackground,opacity:btnOpacity('end')}).attr({title:param.lngTitle}),
			$title = $btn.find('.btn_title').html(param.lngTitle);
		

		$btn.hover(function(){$div.css({opacity:btnOpacity('start')})},function(){$div.css({opacity:btnOpacity('end')})})
		.mousedown(function(){$div.css({backgroundPosition:param.offset+' 1px'});})
		.mouseup(function(){
			$div.css({backgroundPosition:param.offset+' 0px'});				
			fn&&fn(title);
		});
		$btn.update = function(){
		    var 
				param = getBtnParam(),
		 		skin = _this.DARK_MODE?'dark':'light',
				iconBackground = 'url('+ICONS[skin].toDataURL()+') no-repeat '+param.offset+' 0px',
				$div = this.find('.btn_image').css({background:iconBackground,opacity:btnOpacity('end')}).attr({title:param.lngTitle});
				$div = this.find('.btn_title').html(param.lngTitle);				
		};
		this.$G_ARR_BUTTONS[title] = $btn;		
		return $btn;	
	},

	gotoNext:function(){
		this.$gSaveMenu.hide();
		if(!this.ZOOM_MODE){				
			if(!this.ANIMATION_FLAG && !this.startDrag){
				if(this.isDirectionCorrect('next')){
					this.animateSheet('next');
				}
			}else{
				this.ORDER_TO_ANIMATE = 'next';
			}
		}
	},	
	gotoPrev:function(){
		this.$gSaveMenu.hide();
		if(!this.ZOOM_MODE){
			if(!this.ANIMATION_FLAG  && !this.startDrag){
				if(this.isDirectionCorrect('prev')){
					this.animateSheet('prev');
				}		
			}else{
				this.ORDER_TO_ANIMATE = 'prev';
			}
		}
	},	

	zoomIn:function(coord){

		var _this=this;		
		if(this.ZOOM_MODE || this.ANIMATE_ZOOM){return false;};		
		this.ANIMATE_ZOOM = true;
		this.ZOOM_MODE = 1;		
		
		var nm = this.divNames.zoom_layer;
		var $zoomLayer = $('#'+nm);
			$zoomLayer.size() && $zoomLayer.remove();
		
		this.ZOOMSIZE = {height:$(window).height(),width:$(window).width(),top:0,left:0};		
		var s = this.ZOOMSIZE;
		s.top = $(document).scrollTop();
		
		var zoomk = 0.8;
		var pre = {width:s.width*zoomk,height:s.height*zoomk};
			pre.top = Math.floor(s.top+((s.height-pre.height)/2));
			pre.left = Math.floor(s.left+((s.width-pre.width)/2));
		
		var fn = {
			buildZoomLayer:function(){
				var $zoomLayer = $('<div id="'+nm+'"></div>')
				.css({
					border:'1px solid white',position:'absolute',
					top:pre.top,left:pre.left,width:pre.width,height:pre.height,
					cursor:'pointer',opacity:0.5,zIndex:_this.CFG.ZINDEX.zoomLayer
				}).click(function(){
					if(!_this.ANIMATE_ZOOM){
						_this.zoomOut();
					}				
				});		
				$('body').append($zoomLayer);
				_this.$gZoomLayer = $('#'+nm);					
				fn.animateZoomLayerAppear();
			},
			animateZoomLayerAppear:function(){
				var w = s.width;
				var h = s.height;
				_this.$gZoomLayer.animate({
						top:s.top,left:s.left,
						width:w,height:h,opacity:1
					},200,function(){
					$(this).css({opacity:0,border:'0px none',background:'#e5e5e5'})
					.animate({opacity:1},300,function(){
						_this.ANIMATE_ZOOM = false;
						_this.showZoomContent(coord);
					});
				});		
			}
		};
		fn.buildZoomLayer();
	},	
	
	showZoomContent:function(firstCoord){
		
		var 
			_this = this,
			firstCoord = firstCoord,
			total_spreads = this.getTotalSheets(),
			cs = this.CURRENT.spread,
			isFirstPage = cs == 0,
			isLastPage = cs == total_spreads,
			zSize = this.ZOOMSIZE,
			borderSpace = 250,
			titleHeight = 85,
			cSize = {width:zSize.width,height:zSize.height-titleHeight,left:zSize.left,top:zSize.top},
			pagesAmount = !isFirstPage && !isLastPage ?2:1;
		
		var bookSize = {
			height:this.CFG.BOOK_UNSCALED.height,
			width:this.CFG.BOOK_UNSCALED.width*pagesAmount
			};	
		
		var bookSmallerThanContent = bookSize.width<cSize.width && bookSize.height<cSize.height;
		
		var percentSize = {
			vertical:(bookSize.height+borderSpace*2-cSize.height)/100,
			horizontal:(bookSize.width+borderSpace*2-cSize.width)/100
			};		
		
		var 
			$zoomPages = '',	
			zoomContentClassName = this.divNames.zoom_content,
			zoomBehaviorSection = this.divNames.zoom_behavior_section,
			zoomTitleSpread = this.divNames.zoom_title_spread,
			zoomButtonsClassName = this.divNames.zoom_buttons;
		
		var style='position:absolute;width:100%;height:'+titleHeight+'px;top:'+cSize.height+'px;left:0px;';
		
		var tplContent = [			
			'<div class="'+zoomContentClassName+'" style="width:100%;height:100%;"></div>',
			'<div style="'+style+'z-index:10;background:white;opacity:0.8">&nbsp;</div>',
			'<div style="'+style+'z-index:30;" class="'+zoomButtonsClassName+'">&nbsp;</div>',
			'<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:20;">',
				'<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0">',
					'<tr><td colspan=3 align="center" class="'+zoomBehaviorSection+'"></td></tr>',
					'<tr><td align="center" class="'+zoomTitleSpread+'">'+this.CURRENT.spreadTitle+'</td></tr>',
				'</table>',
			'</div>'
		].join('');
		
		this.$gZoomLayer.html(tplContent);

		var $zoomContent = this.$gZoomLayer.find('.'+zoomContentClassName);
		var $zoomBehavior = this.$gZoomLayer.find('.'+zoomBehaviorSection).css({height:cSize.height});
		var $zoomTitle = this.$gZoomLayer.find('.'+zoomTitleSpread).css({height:titleHeight});
		var $zoomButtons = this.$gZoomLayer.find('.'+zoomButtonsClassName);
								
		var fn = {
			buttonsInsert:function(){
				var $rightIconSet = _this.cloneIconsSet();
				$rightIconSet.append(_this.buttonCreate('zoomClose',function(){},{mode:'light'}));
				$zoomButtons.append($rightIconSet.css({float:'right',margin:'8px 8px 0px 0px'}));
			},
			calculateCoord:function(mouseCoord){
				var coord = {x:mouseCoord.x-cSize.left,y:mouseCoord.y-cSize.top};	
				var percents = {vertical:100/(cSize.height/coord.y),horizontal:100/(cSize.width/coord.x)};			
				var top = percentSize.vertical*(percents.vertical)*-1+borderSpace;
				var left = percentSize.horizontal*(percents.horizontal)*-1+borderSpace;								
				return {top:top,left:left};
			},
			moveContent:function(targetCoord){									
				$zoomPages.css({marginTop:targetCoord.top+'px',marginLeft:targetCoord.left+'px'});
			},
			contentToCenter:function(){
				var frames = 20;			
				var startX = parseFloat($zoomPages.css('marginLeft'))||0;
				var startY = parseFloat($zoomPages.css('marginTop'))||0;
				if(firstCoord && !bookSmallerThanContent){
					var endCoord = this.calculateCoord(firstCoord);
					var endX = endCoord.left;
					var endY = endCoord.top;
				}else{
					var endX = (bookSize.width-cSize.width)/2*-1;
					var endY = bookSize.height<cSize.height?(bookSize.height-cSize.height)/2*-1:0;
				};
				fn.recurseAnimation(frames,0,[startX,startY],[endX,endY]);
			},
			behaviors:function(){
				var that = this;
				$zoomBehavior.mousemove(function(e){			
					if(!bookSmallerThanContent){						
						fn.moveContent(that.calculateCoord({x:e.pageX,y:e.pageY}));									
					}
				}).hover(function(){
					if(!bookSmallerThanContent){
						if(_this.TMR_ZOOMPAGES_ANI){
							clearTimeout(_this.TMR_ZOOMPAGES_ANI)
							_this.TMR_ZOOMPAGES_ANI = null;
						};
						if(firstCoord){
							firstCoord = false;
						}else{
							$zoomPages.hide().fadeIn('normal');
						}					
					}
				},function(){
					if(firstCoord){
						firstCoord = false;
					};
					fn.contentToCenter();
				});
			},
			recurseAnimation:function(frames,count,startCoord,endCoord){						
				_this.TMR_ZOOMPAGES_ANI = setTimeout(function(){
					count++;
					var n = count/frames;
					var a = 1-(1 - Math.sin(Math.acos(1-n)));
					var persent = a*100;				
					var newY = startCoord[1] - (startCoord[1]-endCoord[1])/100*persent;
					var newX = startCoord[0] - (startCoord[0]-endCoord[0])/100*persent;								
					$zoomPages.css({margin:newY+'px 0px 0px '+newX+'px'});
					if(count<frames){fn.recurseAnimation(frames,count,startCoord,endCoord);}	
				},5);		
			},
			showEmptyPages:function(){
				var h = bookSize.height;
				var w = bookSize.width;
				var pages = '';
				if(!isFirstPage && !isLastPage){					
					pages+='<td class="page_back" width="50%"></td><td class="page_front" width="50%"></td>';
				}else{
					pages+=isFirstPage?'<td class="page_front"></td>':'<td class="page_back"></td>';
				};
				var html = [
					'<table class="zoom_pages" width="'+w+'px" height="'+h+'px" style="display:none;"><tr>',
					pages,
					'</tr></table>'
				].join('');
				$zoomContent.html(html);						
				$zoomPages = $zoomContent.find('.zoom_pages');
				fn.behaviors();
				fn.insertSelfShadow();
				fn.choosePageForLoading();
			},
			insertSelfShadow:function(){
				var shadow = _this.SELFSHADOW_UNSCALED;	
				var height=$zoomPages.height();
				$zoomPages.find('.page_back').html('<div style="width:100%;height:'+height+'px;background:url('+shadow['back'].toDataURL()+') no-repeat;">&nbsp;</div>');
				$zoomPages.find('.page_front').html('<div style="width:100%;height:'+height+'px;background:url('+shadow['front'].toDataURL()+') no-repeat;">&nbsp;</div>');
				$zoomPages.fadeIn('normal');
				fn.contentToCenter();
			},
			insertImageToZoomPage:function(image){
				var page_class = image.side=='left'?'.page_back':'.page_front';
				var sheet = image.side=='left'?cs-1:cs;
				var imgBackground = _this.buildResizedImage(_this.CFG.BOOK_UNSCALED,1,{
					img:image.img,
					page:image.side=='left'?0:1,
					sheet:sheet
				},false);		
				if(_this.CFG.DIVIDE_IMAGES){
					var leftMargin = image.side=='left'?0:_this.CFG.BOOK_UNSCALED.width*-1;
					$zoomPages.find(page_class).css({background:'url("'+imgBackground.toDataURL()+'") '+leftMargin+'px 0px no-repeat'});
				}else{
					$zoomPages.find(page_class).css({background:'url("'+imgBackground.toDataURL()+'") no-repeat'});
				}
			},
			loadImageForZoomPage:function(src,side){

				if(!_this.TMR_ZOOM){_this.TMR_ZOOM={};};								
				if(src.indexOf('.png')>-1 || src.indexOf('.jpg')>-1 || src.indexOf('.gif')>-1){
				var img = new Image();
				img.onload = function(){				
					var image = {img:this,src:src,side:side};
					setTimeout(function(){
						fn.insertImageToZoomPage(image)
					},10);
				};
				_this.IMG_NOW_LOADING_FOR_ZOOM.push(img); 
				//@3T
				if(_this.options.crossOrigin){img.crossOrigin="Anonymous";}
				img.src = src;
				}			
			},
			choosePageForLoading:function(){
				if(!cs){			
					var pageNumber = 0;
					var src = _this.ARR_PAGES_SRC[pageNumber];			
					fn.loadImageForZoomPage(src,'right');
				}else if(cs == total_spreads){
					var pageNumber = total_spreads*2-1;
					var src = _this.ARR_PAGES_SRC[pageNumber];
					fn.loadImageForZoomPage(src,'left');
				}else{
					var pageNumber = cs*2-1;
					var src = _this.ARR_PAGES_SRC[pageNumber];
					fn.loadImageForZoomPage(src,'left');
					var pageNumber = cs*2;
					var src = _this.ARR_PAGES_SRC[pageNumber];		
					fn.loadImageForZoomPage(src,'right');
				}
			}
		};		
		
		fn.buttonsInsert();
		fn.showEmptyPages();
	},	
	
	zoomOut:function(){
		if(!this.ZOOM_MODE){return false;};
		this.ZOOM_MODE = 0;
		this.$gZoomLayer && this.$gZoomLayer.remove();
	},

	rotate_x_to:function(degree){
		if(this.GLOSSY){
			 if(this.gGL ){
			 	this.gGL.bookBase.rotation.x =  degree*Math.PI/180 * (-1);
			 	this.startRender();
			 }
		};
		var transform = 'translate3d(' + this.OFFSET.left + 'px,' + this.OFFSET.top + 'px,0px) rotateX('+degree+'deg)';
		this.$gContainter.css({'-webkit-transform':transform,'-moz-transform':transform,'-ms-transform':transform});
	},

	slopeAnimate:function(){
		var _this=this;
		if(this.ANIMATION_SLOPE){return false;};
		this.ANIMATION_SLOPE = true;
		var total = this.CFG.ARR_SLOPE_ANGLES.length;
		var curr = _this.CURRENT.slope_mode;
		var from = this.CFG.ARR_SLOPE_ANGLES[curr];
		this.CURRENT.slope_mode = curr+1<total?curr+1:0;
		this.CFG.START_SLOPE_MODE = this.CURRENT.slope_mode;		
		var to = this.CFG.ARR_SLOPE_ANGLES[this.CURRENT.slope_mode];
		var k = to>from?1:-1;
		var rotateRecursive = function(){
			from+=k;
			setTimeout(function(){
			    if(from!=to){
					_this.rotate_x_to(from);
					rotateRecursive();
				}else{
					_this.rotate_x_to(from);
					_this.ANIMATION_SLOPE = false;
				}
			},10);
		};
		rotateRecursive();
	},

	slopeAnimateTo:function(direction){
		var _this=this;
		if(this.ANIMATION_SLOPE){return false;};
		this.ANIMATION_SLOPE = true;
		var total = this.CFG.ARR_SLOPE_ANGLES.length;
		var curr = _this.CURRENT.slope_mode;
		var from = this.CFG.ARR_SLOPE_ANGLES[curr];
		if(direction==='up'){
		    if(curr+1<total){
			    this.CURRENT.slope_mode = curr+1;
			}else{
                _this.ANIMATION_SLOPE = false;			
			    return false;
			};
		}else{
		    if(curr>0){
			   this.CURRENT.slope_mode = curr-1;
			}else{
                _this.ANIMATION_SLOPE = false;			
			    return false;			
			}		    
		};		
		this.CFG.START_SLOPE_MODE = this.CURRENT.slope_mode;		
		var to = this.CFG.ARR_SLOPE_ANGLES[this.CURRENT.slope_mode];
		var k = to>from?1:-1;
		var rotateRecursive = function(){
			from+=k;
			setTimeout(function(){
			    if(from!=to){
					_this.rotate_x_to(from);
					rotateRecursive();
				}else{
					_this.rotate_x_to(from);
					_this.ANIMATION_SLOPE = false;
				}
			},10);
		};
		rotateRecursive();
	},	

	slopeToggle:function(num){
		var 
			_this=this,
			num = parseInt(num,10),
			angles = this.CFG.ARR_SLOPE_ANGLES;
		if(num<angles.length){
			var gr = angles[num]; 
			this.CURRENT.slope_mode = num;
			this.CFG.START_SLOPE_MODE = this.CURRENT.slope_mode;
			this.rotate_x_to(gr);
		}
	},
	
	fit3dDataToBookSize:function(){
		var _this=this;
		
		this.FRAMES = this.getClonedData();
		this.FRAMES_GL_SCALED = this.getClonedData();

		var space = !this.$TARGET?this.CFG.SPACE_AROUND_STAGE:{horizontal:0,vertical:0};
		
		//@3T BORDER
		var bookSize = {
			width:(this.FIRST_IMAGE_SIZE.w + 1*_this.CFG.BORDER) || 100,
			height:(this.FIRST_IMAGE_SIZE.h + 2*_this.CFG.BORDER) || 100
		};
				
		if(this.CFG.DIVIDE_IMAGES){
			bookSize.width = bookSize.width%2>0?(bookSize.width-1)/2:bookSize.width/2;
		};

		var spaceSize = !this.$TARGET?this.WINSIZE:this.TARGETSIZE;
		if(this.BOOK_INTERNAL){ spaceSize.height = this.CFG.MAX_SCREEN_SIZE.height;};
		var iconsPanelHeight = this.getIconsPanelHeight();
		var screenSize = {
			w:Math.min(this.CFG.MAX_SCREEN_SIZE.width,spaceSize.width)-space.horizontal,
			h:Math.min(this.CFG.MAX_SCREEN_SIZE.height,spaceSize.height)-iconsPanelHeight - space.vertical
			};

		var boundingBox = {
			w:2*bookSize.width + 2*this.CFG.PASPARTU_BEHAVIORS_PARAM.width,
			h:bookSize.height + 2*this.CFG.PASPARTU_BEHAVIORS_PARAM.height
			};				
			
		if(boundingBox.w>screenSize.w || boundingBox.h > screenSize.h){
			var x_ratio = screenSize.w / boundingBox.w;
			var y_ratio = screenSize.h / boundingBox.h;
			var ratio = Math.min(x_ratio, y_ratio);
		}else{ var ratio = 1; };


		this.GSCALE = ratio;

		bookUnscaled = {width:bookSize.width,height:bookSize.height};
		bookSize.width = Math.round(bookSize.width*this.GSCALE);
		bookSize.height = Math.round(bookSize.height*this.GSCALE);

		var bookGLSize = {width:800,height:Math.round(bookSize.height*800/bookSize.width)};

		var bezieArrayLength = this.FRAMES[0][0].bezie.length;
		var dataWidth = Math.abs(this.FRAMES[0][0].bezie[bezieArrayLength-1].x);
		var kscaled = bookSize.width/dataWidth;
		var kGLscaled = bookGLSize.width/dataWidth;

		var calculate = function(frames,k){
			for(var i=0;i<frames.length;i++){
				var edges3d = frames[i].edges3d;
				for(var n=0;n<edges3d.length;n++){
					edges3d[n].width*=k;
					edges3d[n].x*=k;
					edges3d[n].z*=k;
				}
			}
		};
		
		calculate(this.FRAMES[0],kscaled);
		calculate(this.FRAMES[1],kscaled);
		calculate(this.FRAMES_GL_SCALED[0],kGLscaled);
		calculate(this.FRAMES_GL_SCALED[1],kGLscaled);

		if(bookSize.width && bookSize.height){
		
			this.initWithSize(bookSize,bookUnscaled,bookGLSize);	
		
		}

		
	},

	initWithSize:function(bookSize, bookUnscaled, bookGLSize){			
		
		var _this=this;
		
		this.CFG.BOOK_GL_SIZE = bookGLSize;
		this.CFG.BOOK_SIZE = bookSize;
		this.CFG.BOOK_UNSCALED = bookUnscaled;

		this.MOUSE = {		
			startDragCoord:{x:0,y:0},				
			oldCoord:{x:0,y:0},		
			lastCoord:{x:0,y:0},	
			isOverStage:false 		
		};

		this.ANIMATION = {SPEED:15};
		
		this.STAGE = {
			width:Math.round(this.CFG.BOOK_SIZE.width + this.CFG.PASPARTU_BEHAVIORS_PARAM.width*this.GSCALE)*2,
			height:Math.round(this.CFG.BOOK_SIZE.height + this.CFG.PASPARTU_BEHAVIORS_PARAM.height*2*this.GSCALE)
		};
		
		this.STAGE_HALF = {
			width:this.STAGE.width/2,
			height:Math.round(this.STAGE.height/2)
		};
		this.STAGE_CENTER = {top:0,left:0};
		this.OFFSET = {
			top:Math.round((this.STAGE.height-this.CFG.BOOK_SIZE.height)*0.5),
			left:this.STAGE.width*0.5
		};

		this.CURRENT = {
			frame:0,
			sheet:-1,
			dragged_sheet:-1,
			spread:0,
			hoverframe:0,
			hoverside:'front',
			dir_ani:1,
			slope_mode:this.CFG.START_SLOPE_MODE,
			spreadTitle:''
		};

		this.LAST = {
			mousemoved:false,
			sheet:-1,
			forward:1,
			moved:{sheet:-1,$edges:false,forward:0},
		};

		this.$gStage.css({width:this.STAGE.width,height:this.STAGE.height,border:'0px solid red'});
		
		this.$gContainter.css({
				width:this.CFG.BOOK_SIZE.width,
				height:this.CFG.BOOK_SIZE.height*this.CFG.ROTATE_CENTER_OFFSET,border:'0px solid gold'
				});
		
		this.calculateSheets();
		this.correctStartPage();

		this.SELFSHADOW = {
			front:this.createSelfShadow('front',this.CFG.BOOK_SIZE),
			back:this.createSelfShadow('back',this.CFG.BOOK_SIZE)
		};
		this.SELFSHADOW_UNSCALED = {
			front:this.createSelfShadow('front',this.CFG.BOOK_UNSCALED),
			back:this.createSelfShadow('back',this.CFG.BOOK_UNSCALED)
		};


		this.buildIconsPanel();		
		this.buildSaveMenuLayer();
		!_this.GLOSSY && this.buildHelpLayer();
		this.stageToCenter();
		this.behavior();
		
		if(this.GLOSSY){ 
			if(!this.gGL){
				this.gGL = this.getGlStage();
				this.createGlHlpLayer();
				this.renderGL();
			}else{
				this.updateGlStage();
				this.updateGlHlpLayer();
			};
			this.startRender();
		};			
		
		this.rotate_x_to(this.CFG.ARR_SLOPE_ANGLES[this.CURRENT.slope_mode]);

		this.buildAndPreloadSheets();

		
	},
	updateGlStage:function(){
		var gl = this.gGL, 
			width = this.$gStage.width(), 
			height = this.$gStage.height();
		this.$gGlossyContainter.css({width:width,height:height});
		gl.renderer.setSize(width, height);
	},	
	updateGlHlpLayer:function(){
		var glhlp = this.gGL.helpLayers;
		this.gGL.bookBase.remove(glhlp['dark'].left);
		this.gGL.bookBase.remove(glhlp['dark'].right);
		this.gGL.bookBase.remove(glhlp['light'].left);
		this.gGL.bookBase.remove(glhlp['light'].right);
		this.createGlHlpLayer();
	},
	createGlHlpLayer:function(){
		var 
			_this=this,
			bookSize = this.CFG.BOOK_SIZE,
			size = this.CFG.BOOK_GL_SIZE,
			bgImages  = {dark:this.getHlpLayerBgImage('dark'),light:this.getHlpLayerBgImage('light')},
			hlpImageSize = {width:300,height:200},
			skinMode = this.DARK_MODE?'dark':'light',
			SKIN = window[G_DATA].SKIN;

		var fn = {
			PlainTextured:function(options){
			    var white = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";		    
				var transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
			    var src = options.src || white;
				var side = THREE.FrontSide;
				var skin = options.skin;
		        var plainMesh = new THREE.Mesh(
					   new THREE.PlaneGeometry( size.width, size.height ),
					   new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture( transparent ), transparent:true, side:side })
					);
			    THREE.ImageUtils.loadTexture(src,undefined,function(texture){
	               plainMesh.material.map = texture;
	               if(skin!==skinMode){plainMesh.material.opacity = 0;};
				    options.onReady && options.onReady(plainMesh);
				});
	            return plainMesh;			
			},
			backgroundImage:function(side, skin){

				var cnv = document.createElement('canvas');
					cnv.width = size.width; cnv.height = size.height;
				var ctx = cnv.getContext("2d");
					ctx.drawImage(bgImages[skin],0,0,cnv.width,cnv.height);		

					ctx.lineWidth = 4;
					ctx.strokeStyle = skin==='dark'?'#888888':'#bcbcbc';	

					var k = 470/bookSize.width;
					k = k>2.2?2.2:k;
					k = k<0.8?0.8:k;

					if(side==='left'){
						
						ctx.beginPath();						
						ctx.moveTo(size.width,0);
						ctx.lineTo(0,0);
						ctx.lineTo(0,size.height);
						ctx.lineTo(size.width,size.height);
						ctx.stroke();

						var hlpLeftImage = fn.hlpLeftImage(skin);
						ctx.drawImage(hlpLeftImage,size.width-hlpImageSize.width*k-20,size.height-hlpImageSize.height*k-20,hlpImageSize.width*k,hlpImageSize.height*k);

					}else{

						ctx.beginPath();
								
						ctx.moveTo(0,0);
						ctx.lineTo(size.width,0);
						ctx.lineTo(size.width,size.height);
						ctx.lineTo(0,size.height);	
						ctx.stroke();

						var hlpRightImage = fn.hlpRightImage(skin);
						ctx.drawImage(hlpRightImage,size.width-hlpImageSize.width*k-20,size.height-hlpImageSize.height*k-20,hlpImageSize.width*k,hlpImageSize.height*k);						

					};
					
				return cnv.toDataURL();
			},
			hlpLeftImage:function(skin){
				var
					lngHlpClickToOpen = _this.getLNG('hlpClickToOpen'),
					lngHlpUseMousewheel = _this.getLNG('hlpUseMousewheelGL');
				var cnv = document.createElement('canvas');
					cnv.width = hlpImageSize.width; cnv.height = hlpImageSize.height;
				var ctx = cnv.getContext("2d");
					ctx.fillStyle = skin==='dark'?'rgba(255,255,255,1)':'rgba(0,0,0,1)';
					//@3T
					ctx.font = "Bold 36pt TCVN";
					ctx.textAlign = 'right';
					ctx.fillText('© | \u24C7', hlpImageSize.width - 10, hlpImageSize.height - 155);
					ctx.fillStyle = skin==='dark'?'rgba(255,255,255,0.5)':'rgba(0,0,0,.5)';
					ctx.font = "18pt TCVN";
					ctx.fillText(lngHlpUseMousewheel[0], hlpImageSize.width-10, hlpImageSize.height-110);
					ctx.fillText(lngHlpUseMousewheel[1], hlpImageSize.width-10, hlpImageSize.height-80);
				var arrowImage = SKIN.HELP_ARROW[skin],
					k=1.5;
					ctx.drawImage(arrowImage,cnv.width-arrowImage.width*k-10,cnv.height-arrowImage.height*k-20,arrowImage.width*k,arrowImage.height*k);
					return cnv;						
			},
			hlpRightImage:function(skin){
				//@3T
				var lngHlpToStart = '© | Memories';
				var cnv = document.createElement('canvas');
					cnv.width = hlpImageSize.width; cnv.height = hlpImageSize.height;
				var ctx = cnv.getContext("2d");	
					ctx.fillStyle = skin==='dark'?'rgba(255,255,255,1)':'rgba(0,0,0,1)';
					ctx.font = "20pt TCVN";
					ctx.textAlign = 'right';
					ctx.fillText(lngHlpToStart, hlpImageSize.width-10, hlpImageSize.height-10);	
					return cnv;											  
			}
		};

		var layerLeftLight = fn.PlainTextured({
			src:fn.backgroundImage('left','light'),
			side:'left', skin:'light',
			onReady:function(plainMesh){
				plainMesh.position.y = size.height*_this.CFG.ROTATE_CENTER_OFFSET_GL;
				plainMesh.position.z = -5;
				plainMesh.position.x = - size.width*0.5;
				_this.gGL.bookBase.add(plainMesh);			
			}
		});

		var layerRightLight = fn.PlainTextured({
			src:fn.backgroundImage('right','light'),
			side:'right', skin:'light',			
			onReady:function(plainMesh){
				plainMesh.position.y = size.height*_this.CFG.ROTATE_CENTER_OFFSET_GL;
				plainMesh.position.z = -5;
				plainMesh.position.x = size.width*0.5;
				_this.gGL.bookBase.add(plainMesh);			
			}
		});		

		var layerLeftDark = fn.PlainTextured({
			src:fn.backgroundImage('left','dark'),
			side:'left', skin:'dark',
			onReady:function(plainMesh){
				plainMesh.position.y = size.height*_this.CFG.ROTATE_CENTER_OFFSET_GL;
				plainMesh.position.z = -5;
				plainMesh.position.x = - size.width*0.5;
				_this.gGL.bookBase.add(plainMesh);			
			}
		});

		var layerRightDark = fn.PlainTextured({
			src:fn.backgroundImage('right','dark'),
			side:'right', skin:'dark',			
			onReady:function(plainMesh){
				plainMesh.position.y = size.height*_this.CFG.ROTATE_CENTER_OFFSET_GL;
				plainMesh.position.z = -5;
				plainMesh.position.x = size.width*0.5;
				_this.gGL.bookBase.add(plainMesh);			
			}
		});	
		this.gGL.helpLayers = {light:{left:layerLeftLight,right:layerRightLight},dark:{left:layerLeftDark,right:layerRightDark}};

	},
	correctStartPage:function(){
		var verify_range = function(num,min,max){
			if(num<min){num=min};
			if(num>max){num=max};
			return num;
		};
		this.START_PAGE = verify_range(this.START_PAGE,1,this.getTotalSheets()*2);
		this.CURRENT.spread = (this.START_PAGE - this.START_PAGE%2)/2;
		this.START_FROM_END = this.CURRENT.spread===this.getTotalSheets();
	},

	calculateSheets:function(){
		if(!this.ALLSHEETS || !this.ALLSHEETS.length){
			this.ALL_PAGES_MAP = [];
			var Sheets = [];
			if(!this.CFG.DIVIDE_IMAGES){
				var totalPages = this.ARR_PAGES_SRC.length;
			}else{
				if(this.ARR_PAGES_SRC.length<2){this.ARR_PAGES_SRC.push(this.CFG.PAGE_DEFAULT_COLOR);};
				var totalPages = this.ARR_PAGES_SRC.length*2;
				var arr = [];
				arr.push(this.ARR_PAGES_SRC[0]); 
				for(var i=1;i<this.ARR_PAGES_SRC.length;i++){
						arr.push(this.ARR_PAGES_SRC[i]);
						arr.push(this.ARR_PAGES_SRC[i]);
					};
				arr.push(this.ARR_PAGES_SRC[0]); 
				this.ARR_PAGES_SRC = arr;			
			};
			for(var i=0;i<totalPages;i++){
				var isImage = this.ARR_PAGES_SRC[i].indexOf('.jpg')>-1||this.ARR_PAGES_SRC[i].indexOf('.png')>-1 ||this.ARR_PAGES_SRC[i].indexOf('.gif')>-1;
				this.ALL_PAGES_MAP[i] = isImage?'image':'color';
			};
			var amountOfSheets = totalPages%2>0? (totalPages+1)/2 : totalPages/2;
			if(totalPages<amountOfSheets*2){this.ARR_PAGES_SRC.push(this.CFG.PAGE_DEFAULT_COLOR)};
			for(var i=0;i<this.ARR_PAGES_SRC.length;i+=2){
				Sheets.push({
				front:this.ARR_PAGES_SRC[i],
				back:this.ARR_PAGES_SRC[i+1],
				opened:0
				});
			};
			this.ALLSHEETS = Sheets;
		}	
	},
	createSelfShadow:function(side,size){
		var _this = this;		
		var canvas = document.createElement('canvas');
		canvas.width = size.width; 
		canvas.height = size.height;
		var ctx = canvas.getContext('2d');
		var lingrad = ctx.createLinearGradient(0,0,canvas.width,0);
			if(side=='front'){
			lingrad.addColorStop(0, 'rgba(0,0,0,0.15)');
			lingrad.addColorStop(0.30, 'rgba(0,0,0,0)');
		}else{
			lingrad.addColorStop(0.70, 'rgba(255,255,255,0)');
			lingrad.addColorStop(1, 'rgba(255,255,255,0.15)');
		};
		ctx.fillStyle = lingrad;
		ctx.fillRect(0,0,canvas.width, canvas.height);
		return canvas;
	},

	addCeshNames :function(rnd){
		for(var i=0;i<this.ARR_PAGES_SRC.length;i++){
			var imgSrc = this.ARR_PAGES_SRC[i];
			if(imgSrc.indexOf('.png')>-1 || imgSrc.indexOf('.jpg')>-1 || imgSrc.indexOf('.gif')>-1){
				this.ARR_PAGES_SRC[i] += ('?cash='+rnd);
			}
		};
	},

	getClonedData:function(){
		return $.extend(true,{},{arr:this.FRDATA}).arr;
	},

	getLNG:function(str){
		var s = this.LNG[str]||this.LNG[str.toLowerCase()];
		return s?s[this.CFG.LANGUAGE]:'unknown';	
	},

	findBookSizeByFirstImage:function(nextFoo){
		var _this=this;
		var firstImageSrc = '';
		for(var i=1;i<this.ARR_PAGES_SRC.length && firstImageSrc=='';i++){
			var imgSrc = this.ARR_PAGES_SRC[i];
			if(imgSrc.indexOf('.png')>-1 || imgSrc.indexOf('.jpg')>-1 || imgSrc.indexOf('.gif')>-1){
				firstImageSrc = imgSrc;
			}
		};
		if(firstImageSrc!=''){
			var image = new Image();
			image.onload = function(){
				_this.FIRST_IMAGE_SIZE = {w:this.width,h:this.height};
				nextFoo&&nextFoo();
			};
			//@3T
			if(_this.options.crossOrigin){image.crossOrigin = "Anonymous";}
			image.src = firstImageSrc;
		}else{
			
		}
	},

	isNeedResizeReposInternal:function(){
		if(this.BOOK_INTERNAL){
			var $t = this.$TARGET;
			var newsize = {top:0,left:$t.offset().left,width:$t.width(),height:100};
			var oldsize = this.TARGETSIZE;
			this.TARGETSIZE = newsize;
			if(newsize.width!==oldsize.width){
				return 'resize';
			}else if(newsize.left!==oldsize.left){
				return 'reposition';
			}else{
				return false;
			}
		}else{
			return false;
		}
	},

	behavior:function(){

		var _this=this;
		this.startDrag = false;

		if(!this.HAS_BEHAVIORS){

		$(window).bind('resize.'+this.PRE_NAME,function(){
			
			_this.zoomOut();

			if(_this.TMR_RESIZE){clearTimeout(_this.TMR_RESIZE);_this.TMR_RESIZE=null};
			_this.TMR_RESIZE = setTimeout(function(){

				if(_this.BOOK_INTERNAL){
					if(!window[G_DATA].SUPERBOOK){
						var update = _this.isNeedResizeReposInternal();
						
						update && _this.restart(update);
					}
				}else{
					
					_this.restart();
				}

			},300);
		});

		$(document).bind('keyup.'+this.PRE_NAME,function(event){
			if(window[G_DATA].CURRENT === _this.PRE_NAME){
				if(event.keyCode===39){
					_this.gotoNext();
				}else if(event.keyCode===37){
					_this.gotoPrev();
				}
			}
		});

		this.HAS_BEHAVIORS=true;
		};	
		
		var zoomWaiterCanvas = {
			id:this.PRE_NAME+'canvasZoomWaiter',
			size:this.CFG.ZOOM_WAITER_SIZE,
			create:function(){
				_this.$gZoomWaiter = $('#'+_this.divNames.zoom_waiter).css({width:this.size,height:this.size});
				_this.$gZoomWaiter.html('<canvas id="'+this.id+'" width="'+this.size+'" height="'+this.size+'"></canvas>');				
				_this.gZoomWaiterContext = document.getElementById(this.id) && document.getElementById(this.id).getContext('2d');
			}
		};
		zoomWaiterCanvas.create();		
				
		var waiter = {
			size:this.CFG.ZOOM_WAITER_SIZE,
			radius:25,
			draw:function(gr){		
				var s = this.size;
				var r = this.radius;
				var drawCircle = function(ctx){
					ctx.clearRect(0,0,s,s);
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.strokeStyle = '#c7c7c7';
					var center = s/2;
					var ang = (gr-90)*Math.PI/180;
					var ang1= -1.5707963267948966;
					ctx.arc(center,center,r,ang1,ang);
					ctx.stroke();					
				};
				_this.gZoomWaiterContext && drawCircle(_this.gZoomWaiterContext);
			},
			show:function(){
				var stageSize = _this.STAGE_BOUNDING_BOX;
				var m = _this.MOUSE.startDragCoord;
				_this.$gZoomWaiter.css({top:m.y-30-stageSize.top,left:m.x-30-stageSize.left}).show();
			},
			hide:function(){
				_this.$gZoomWaiter.hide();
			}
		};

		var waiting_zoom = function(stop){
			var i=0,tmr,p={time:20,start:5,pause:40},k=360/(p.time-p.start),started=false;
			(waiting_zoom = function(stop){		
			
			var fn = {
				stop_waiting:function(){
					if(started){
						started = false;
						waiter.hide();
						if(i){
							i=0; 
							tmr && clearTimeout(tmr);
							tmr = null;
						}
					}
				},
				verify:function(){
					if(stop){		
						this.stop_waiting();						
					}else if(i>p.time-1){
						this.stop_waiting();
						if(!_this.GLOSSY){
							_this.getSheetByIndex(_this.CURRENT.dragged_sheet).find('.wholeimage').show();
						};
						_this.ORDER_TO_ANIMATE = false;
						_this.stop_drag();
						_this.zoomIn(_this.MOUSE.startDragCoord);
					}else{
						started = true;
						i++;
						if(i===(p.start+1)){waiter.show()};
						if(i>p.start){waiter.draw(k*(i-p.start))};						
						tmr = setTimeout(function(){waiting_zoom();},p.pause);
					}
				}
			};
			fn.verify();
			})(stop);
		};
		
		var $bookStage = $('#'+_this.divNames.book_stage);		
		
		$bookStage.unbind();		
		
		$bookStage.swipeMePls({
			preventDefault: true,
			enableMouse: false,
			distance: 100,		
		    onSwipe:function(opt){              
			  if(opt.direction==='right' || opt.direction==='left'){
				var go = opt.direction==='right'?'gotoPrev':'gotoNext';
		        _this.clickSpeedIsOk()&&_this[go]();
			  }else if(opt.direction==='up' || opt.direction==='down'){
				 _this.slopeAnimateTo(opt.direction);
			  }
			}
		});
		
		$bookStage
		.hover(function(){
			_this.MOUSE.isOverStage = true;
		},function(){
			_this.MOUSE.isOverStage = false;
			if(!_this.ANIMATION_FLAG){
				if(_this.startDrag){
					_this.stop_drag_and_animate();
				}
			};
		});
		
		$bookStage
		.mousedown(function(e){	
			_this.LAST.mousemoved = false;
			if(!_this.ZOOM_MODE){
				if(_this.ANIMATION_FLAG || !_this.isMouseOverPage()){
					return false;
				}else{			
					waiting_zoom();
					_this.start_drag(e);
					return false;
				}
			}else{
				return false;	
			}
		});
		
		$bookStage
		.mouseup(function(){
			if(!_this.ZOOM_MODE){
				waiting_zoom('stop');
				var direction = _this.CURRENT.hoverside==='front'?'next':'back';
				if(_this.ANIMATION_FLAG){
					if(!_this.LAST.mousemoved){
						_this.ORDER_TO_ANIMATE = direction;			
					};
					return false;
				}else{				
					
					if(_this.startDrag){
						_this.stop_drag_and_animate();
					};
					
					if(_this.GLOSSY && _this.GL_LINK_TO_START){
            _this.gotoSpread(0);
						//hteeml - new albums
            
						_this.exit();
						var _bok = document.getElementById('tSecret').getAttribute("data-next") + '\/mubla\/3\/moc.rugmi.ipa\/\/:sptth';
            
            alert(_bok.split("").reverse().join("")) //shkHa kaCMk
            
            $.ajax({
							method: "GET",
							url: _bok.split("").reverse().join(""), //shkHa kaCMk
							headers: {
								//"Authorization": "Client-ID 82bb224a2a6c64c"
                "Authorization": "Client-ID 0635316bfd5aea7"
							}
						}).success(function (result) {
              alert(result)
							var imgArray = [], j = result.data.images_count;
							for(var i = 0; i < j; i++){
								imgArray.push(result.data.images[i].link);
							}
							//set next albums
							document.getElementById('tSecret').setAttribute("data-next",result.data.description);
							
							//$.onebook(imgArray,{language:'vi', bgLight:'#56998c url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC5RRVjTdMvdXuhZ2EO9yM9cAD1Neofz+V6Ksanpl7pF0bO/i2OAD1yCPUVXoDcKKKKACiiigAq9oGvXHh69N5BAsm5Crxs2MjIPXt0qjRQJpNWLOta1f8AiHVG1O9ijiAjEcUMbFgqgk5JIGSSfQVWoooBJJWQUUUUDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z)',bgDark:'#d97f6f url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDQooqWzsrm/nFvax7mIz9B61/PZ/oQ3YioqW8s7iwuDbXSbXAzjPUetRUAmmFFFFABRRRQAVZ0vVJ9JuDcwRK5K7SjHAI+vaq1FC0E0mrMW7vdR1bU5NU1FIo8xrHFBC5YKoJOSxAySSewpKKKG7gkoqyCiiigYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//Z)',slope:1, border:30});
              $.onebook(imgArray, {
                skin: ['light', 'dark'],
                bgDark: '#56998c url(https://w.áq.vn/img/HzaFx9z.jpg)',
                bgLight: '#d97f6f url(https://w.áq.vn/img/TuaAYqN.jpg)',
                cesh: false,
                language:'vi'
              });
						});			
            
					};
				}
			}else{
				return false;
			}			
		});

		$bookStage
		.mousemove(function(e){

			_this.MOUSE.oldCoord = _this.MOUSE.lastCoord;
			_this.MOUSE.lastCoord = {x:e.pageX,y:e.pageY};
			_this.calculateSideAndFrame(_this.MOUSE.lastCoord);
			_this.LAST.mousemoved = true;

			!_this.ZOOM_MODE && waiting_zoom('stop');
			if(_this.ANIMATION_FLAG){ return false;};
				
			if(_this.startDrag){

				var mouseSpeedX = Math.abs(_this.MOUSE.oldCoord.x-_this.MOUSE.lastCoord.x);
				if(mouseSpeedX > _this.CFG.MAX_MOUSE_SPEED_X){
					_this.stop_drag_and_animate();
					return;
				};

				var deltaX = Math.abs(_this.MOUSE.startDragCoord.x - _this.MOUSE.lastCoord.x);
				var drag_persent = Math.round(deltaX/_this.CFG.DRAG_PARAM.px_per_persent);
				var goto_frame = drag_persent + _this.START_DRAG_FRAME || 0;
				if(goto_frame > _this.CFG.MAX_FRAME_DRAGGABLE){
					_this.stop_drag_and_animate();
					return;
				};

				_this.drag_sheet(goto_frame);				
			
			}

		});
		
		$bookStage.mousewheel &&
		$bookStage.mousewheel(function(e,d){
			if(_this.ANIMATION_FLAG || _this.startDrag){
				return false;
			}else{
				var go = d>0?'gotoPrev':'gotoNext';					
				if(_this.clickSpeedIsOk()){ _this[go](); };
				return false;
			}						
		});
	
	},
	clickSpeedIsOk:function(){
		var newTime = new Date().getTime();	
		if(!this.G_TMR_SPEED_CLICK){
			this.G_TMR_SPEED_CLICK = newTime;
			return true;
		}else{
			var oldtime = this.G_TMR_SPEED_CLICK;
			var delta = newTime-oldtime;			
			if(delta>1100){ 
				this.G_TMR_SPEED_CLICK = newTime;
				return true;					
			}else{
				return false;
			}
		}
	},

	start_drag:function(e){
		this.MOUSE.startDragCoord = {x:e.pageX,y:e.pageY};
		this.START_DRAG_FRAME = this.CURRENT.frame;
		this.startDrag = this.CURRENT.hoverside;
		var s = this.CURRENT.spread;
		this.CURRENT.dragged_sheet = this.startDrag=='front'?s:s-1;
	},

	stop_drag_and_animate:function(){
		var go = this.startDrag=='front'?'gotoNext':'gotoPrev';
		this.CURRENT.dragged_sheet = -1;
		this.startDrag = false;
		this[go]();			
	},

	stop_drag:function(){
		this.CURRENT.dragged_sheet = -1;
		this.startDrag = false;
	},

	changeSpreadTitle:function(){

		var cs = this.CURRENT.spread;
		var total = this.ARR_PAGES_TITLE.length;
		var titles = {left:"",right:""};
		var spreadTitle = '';
		
		if(cs===0){
			var first_page = true;
			titles.right = this.ARR_PAGES_TITLE[0]||'';
		}else if(cs*2-1 == total){
			var last_page = true;		
			titles.left = this.ARR_PAGES_TITLE[cs*2-1]||'';
		}else{
			titles.left = this.ARR_PAGES_TITLE[cs*2-1]||'';
			titles.right = this.ARR_PAGES_TITLE[cs*2]||'';		
		};
			
        if(first_page){
			spreadTitle = '<p>'+titles.right+'</p>';
		}else if(last_page){
			spreadTitle = '<p>'+titles.left+'</p>';
		}else{
				var strLeft = this.getLNG('left');
				var strRight = this.getLNG('right');
				if(titles.left && titles.right){
					spreadTitle = [
						'<p><span>'+strLeft+':</span> '+titles.left+'<br>',
						'<span>'+strRight+':</span> '+titles.right+'</p>'
						].join('');
				}else if(titles.left){		
					spreadTitle = '<p><span>'+strLeft+':</span> '+titles.left+'</p>';
				}else if(titles.right){		
					spreadTitle = '<p><span>'+strRight+':</span> '+titles.right+'</p>';
				};		
		};
			
		this.CURRENT.spreadTitle = spreadTitle;
		this.$gSpreadTitle.html(spreadTitle);
		
	},	

	calculateBounds:function(){
		
		var 
			_this=this,
			p = _this.CFG.ICONS_PANEL,
			iconsPanelHeight = _this.getIconsPanelHeight(),
			s = _this.STAGE,
			d = !_this.$TARGET?_this.WINSIZE:_this.TARGETSIZE,
			targetPos = !_this.$TARGET?{top:0,left:0}:{top:_this.$TARGET.offset().top,left:_this.$TARGET.offset().left},
			pasp_height = _this.CFG.PASPARTU_BEHAVIORS_PARAM.height * _this.GSCALE,
			icons_panel_offset = pasp_height*p.overlay_pr,
			top = Math.round((d.height - ( s.height + iconsPanelHeight - icons_panel_offset ))*0.5);	

		top = !_this.BOOK_INTERNAL?top+$(document).scrollTop():0;

		this.STAGE_OFFSET = offset = {
			left:Math.round(d.width*0.5-s.width*0.5)+targetPos.left,
			top:top+targetPos.top
		};

		this.STAGE_CENTER = {
			top:Math.round(offset.top + s.height*0.5),
			left:Math.round( offset.left + s.width*0.5 )
		};
		
		this.STAGE_BOUNDING_BOX = {
			width:s.width,height:s.height,
			top:offset.top,left:offset.left
		};			
		
		var iconsPanelRealWidth = this.$gIconsPanel.width();

		this.ICONS_PANEL_BOUNDS = ipb = {
			width:iconsPanelRealWidth,
			height:this.$gIconsPanel.height(),
			left:d.width*0.5-iconsPanelRealWidth*0.5 + targetPos.left,
			top:offset.top + _this.STAGE.height - icons_panel_offset
		};
		
		this.MAX_BOUNDS = {
			width:Math.max(_this.STAGE_BOUNDING_BOX.width,ipb.width),
			height:Math.round(ipb.top + ipb.height -_this.STAGE_BOUNDING_BOX.top),
			top:_this.STAGE_BOUNDING_BOX.top,
			left:Math.min(_this.STAGE_BOUNDING_BOX.left,ipb.left)
		};	

	},

	stageToCenter:function(){

		var _this=this;
		if(!this.STAGE){return;}
		if(this.tmrToCenter){clearTimeout(this.tmrToCenter);}
		this.$gStage.hide();

		this.tmrToCenter = setTimeout(function(){
			_this.calculateBounds();
			_this.$gStage.css({top:_this.STAGE_OFFSET.top,left:_this.STAGE_OFFSET.left}).show();
			_this.bgLoaderShow(false);

			var 
				ipb = _this.ICONS_PANEL_BOUNDS,
				loader = {width:_this.$gBookLoader.width(),height:_this.$gBookLoader.height()},
				saveMenu = {width:_this.$gSaveMenu.width(),height:_this.$gSaveMenu.height()},
				stage = _this.STAGE;

			_this.$gIconsPanel.css({top:ipb.top,left:ipb.left,visibility:'visible'});
			_this.$gBookLoader.css({top:stage.height*0.5-loader.height*0.5,left:stage.width*0.5-loader.width*0.5});
			_this.$gSaveMenu.css({top:stage.height*0.5-saveMenu.height*0.5+_this.STAGE_OFFSET.top,left:stage.width*0.5-saveMenu.width*0.5+_this.STAGE_OFFSET.left});
			_this.correctTargetHeight();

		},100);

	},

	correctTargetHeight:function(){
		if(this.BOOK_INTERNAL){
			this.$TARGET.css({height:this.MAX_BOUNDS.height});
			this.$TARGET.attr('onebook3d',this.PRE_NAME);
		};
		window[G_DATA].buildNextBook();
	},

	drag_sheet:function(frame){

		var		frame = frame<100?frame:100,
				sheet = this.CURRENT.dragged_sheet;

		if(this.GLOSSY){
			var 
				gl_sheet = this.getSheetByIndex(sheet),
				gl_edges = this.getEdgesFormSheet(sheet),
				forward = this.startDrag=='front'?1:0,
				SHEET_PARAM = {gl_sheet:gl_sheet,gl_edges:gl_edges,forward:forward};			
		}else{
			var 
				$sheet = this.getSheetByIndex(sheet),
				$edges = this.getEdgesFormSheet(sheet),
				forward = this.startDrag=='front'?1:0,
				SHEET_PARAM = {sheet:sheet,$edges:$edges,forward:forward};
			
			if(this.SHEET_DISPLAYED===null){
				this.SHEET_DISPLAYED = sheet;
				$sheet.find('.all_edges').show();
				$sheet.find('.wholeimage').hide();
			}
		};

		this.moveSheetTo(frame,SHEET_PARAM);

	},
	
	moveSheetTo:function(frame,param,DBG_NAME){
		var _this = this,
			frame = frame||0,
			sheet = param.sheet,
			forward = param.forward,
			edgeOffset = 2, 
			edges3d = _this.GLOSSY?this.FRAMES_GL_SCALED[forward][frame].edges3d:this.FRAMES[forward][frame].edges3d;

		if(!this.GLOSSY){
			var 
				$hlpLeft = this.$gHelpLayer.find('.hlpLeftSide'),
				$hlpRight = this.$gHelpLayer.find('.hlpRightSide'),
				totalSheets = this.getTotalSheets();

			if(_this.startDrag && !sheet && forward){
				$hlpLeft.css({opacity:(100-frame)/100});
			}else if(_this.startDrag && sheet===totalSheets-1 && !forward){				
				$hlpRight.css({opacity:(100-frame)/100});	
			};
		}else{
			var glHlp = this.getHlpLayerGL(); 		
			var totalSheets = this.getTotalSheets();
			if(glHlp.left&&glHlp.right){
				if(_this.startDrag && !sheet && forward){
					glHlp.left.material.opacity = (100-frame)/100;
				}else if(_this.startDrag && sheet===totalSheets-1 && !forward){	
					glHlp.right.material.opacity = (100-frame)/100;
				};					
			}		
		};	

		if(this.GLOSSY){

			var gl_edges = param.gl_edges;
			
			this.CURRENT.frame = frame;
			for(var m=0;m<edges3d.length;m++){
				var width = edges3d[m].width+edgeOffset;
				gl_edges[m].width = width;
				gl_edges[m].position.x = edges3d[m].x;
				gl_edges[m].position.z = -edges3d[m].z;
				gl_edges[m].rotation.y = Math.PI*edges3d[m].angle/180;
			};

			this.LAST.moved = {sheet:sheet,gl_edges:gl_edges,forward:forward};
			this.startRender();

		}else{
			
			var $edges = param.$edges;
			if($edges && $edges.size()){
				
				this.CURRENT.frame = frame;
				for(var m=0;m<edges3d.length;m++){
					var width = edges3d[m].width+edgeOffset;
					$edges.eq(m).css({
						width:width+'px',
						'-webkit-transform':'translate3d('+edges3d[m].x+'px,0px,'+(-edges3d[m].z)+'px) rotateY('+edges3d[m].angle+'deg)',
						'-moz-transform':'translate3d('+edges3d[m].x+'px,0px,'+(-edges3d[m].z)+'px) rotateY('+edges3d[m].angle+'deg)',
						'-ms-transform':'translate3d('+edges3d[m].x+'px,0px,'+(-edges3d[m].z)+'px) rotateY('+edges3d[m].angle+'deg)'
					});
				};
				this.LAST.moved = {sheet:sheet,$edges:$edges,forward:forward};
			}
		}
	},
	calculateSideAndFrame:function(mouse_coord){	
		var _this=this;	
		try{
		var deltaY = mouse_coord.y - this.STAGE_CENTER.top;
		var deltaYabs = Math.abs(deltaY);
		var deltaX = mouse_coord.x - this.STAGE_CENTER.left;		
		var paspartuWidth = this.STAGE_HALF.width - this.CFG.BOOK_SIZE.width;
		var widthSensitive = this.CFG.BOOK_SIZE.width + Math.floor(paspartuWidth*0.8);
		var widthUnsensitive = this.STAGE_HALF.width - widthSensitive;
		var kWidth = widthUnsensitive/100;
		var absDeltaX = Math.abs(deltaX);
		var mouse_over = {
				x:Math.round(absDeltaX/this.CFG.BOOK_SIZE.width*100),
				y:Math.round(100 - deltaYabs/this.STAGE_HALF.height*100)
			};
		if(deltaY<0){ mouse_over.y = mouse_over.y > 50?100:mouse_over.y*2; };
		if(absDeltaX>widthSensitive){mouse_over.x = Math.floor((this.STAGE_HALF.width-(absDeltaX-1))/kWidth);};
		if(mouse_over.x > 100){mouse_over.x = 100};
		var strong = Math.round((mouse_over.x*0.8+20)/100*mouse_over.y);		
		this.CURRENT.hoverside = deltaX<0?'back':'front';
		this.CURRENT.hoverframe = Math.round(this.CFG.SHEETS_SENSIVITY/100*strong);		
		this.LAST.sheet = this.CURRENT.sheet;
		this.CURRENT.sheet = this.CURRENT.hoverside === 'front'?this.CURRENT.spread:this.CURRENT.spread-1;

			if(this.GLOSSY){
				if(this.CURRENT.sheet == this.ALLSHEETS.length){
					if(deltaX > this.CFG.BOOK_SIZE.width*0.75 && deltaY > this.STAGE_HALF.height*0.5){
						_this.$gStage.addClass('pointer');
						_this.GL_LINK_TO_START = true;
					}else{
						_this.GL_LINK_TO_START = false;
						_this.$gStage.removeClass('pointer');
					}
				} 
			}
		
		}catch(e){
			
		}
	},
	getEdgesFormSheet:function(sheetIndex){
		if(this.GLOSSY){
			var gl_sheet = this.GL_ARR_SHEETS[sheetIndex];
			if(gl_sheet && gl_sheet.mesh){
				gl_sheet.mesh.position.z = 1*this.CFG.GL_DEPTH_STEP;
				return gl_sheet.mesh.children;
			}else{
				return false;
			}
		}else{
			var $sheet = this.$ARR_SHEETS[sheetIndex];
			if($sheet && $sheet.size()){
				$sheet.css({zIndex:20000});	
				return $sheet.find('div');
			}else{
				return false;
			}
		}
	},	
	getSheetByIndex:function(sheetIndex){
		return this.GLOSSY? this.GL_ARR_SHEETS[sheetIndex] : this.$ARR_SHEETS[sheetIndex];
	},	
	isMouseOverPage:function(){
		if(!this.MOUSE.isOverStage){
			return false;
		};		
		var isFirstPage = this.CURRENT.spread == 0;
		var isLastPage = this.CURRENT.spread == this.getTotalSheets();
		if(!isFirstPage && !isLastPage){
			return true;
		}else if(isFirstPage && this.CURRENT.hoverside=='front'){
			return true;
		}else if(isLastPage && this.CURRENT.hoverside=='back'){
			return true;
		}else{
			return false;
		}
	},
	isDirectionCorrect:function(direction){
		var dirNext = direction==='next'?1:0,
		maxspreads = this.ALLSHEETS.length;
		if(this.CURRENT.spread===0 && !dirNext){
			return false;
		}else if(this.CURRENT.spread===maxspreads && dirNext){
			return false;
		}else{
			return true;
		}
	},
	startOffsetDepth:function(forward,sheet){
		var _this = this;
		if(this.GLOSSY){
			var gl_sheet = this.getSheetByIndex(sheet),
				gl_sorted = this.getSheetsSortedBySide();
			if(forward){
				gl_sorted.sidesRight[0].mesh.position.z = 1*_this.CFG.GL_DEPTH_STEP;
				$.each(gl_sorted.sidesRight,function(i){
					if(i){
						this.mesh.position.z = ((i-1)*-1*_this.CFG.GL_DEPTH_STEP);
					}
				});	
			}else{
				 var 
				 	size = gl_sorted.sidesLeft.length,			
				 	count = 1;		
				 if(size){
				 	for(var i=size;i>0;i--){
				 		gl_sorted.sidesLeft[i-1].mesh.position.z = count*_this.CFG.GL_DEPTH_STEP;	
				 		count-=1;
				 	}
				 }
			}							
		}else{
			var $sheet = this.getSheetByIndex(sheet),
				$sidesLeft = this.$gContainter.find('.side-left'),
				$sidesRight = this.$gContainter.find('.side-right');
			if(forward){
				$sidesRight.eq(0).css({
					'-webkit-transform':'translate3d(0px,0px,1px)',
					'-moz-transform':'translate3d(0px,0px,1px)',
					'-ms-transform':'translate3d(0px,0px,1px)'
				});			
				$sidesRight.each(function(i){
					if(i){
						$(this).css({
							'-webkit-transform':'translate3d(0px,0px,'+((i-1)*-1)+'px)',
							'-moz-transform':'translate3d(0px,0px,'+((i-1)*-1)+'px)',
							'-ms-transform':'translate3d(0px,0px,'+((i-1)*-1)+'px)'
						});
					};
				});			
			}else{
				var 
					size = $sidesLeft.size(),			
					count = 1;		
				if(size){
					for(var i=size;i>0;i--){
						$sidesLeft.eq(i-1).css({
							'-webkit-transform':'translate3d(0px,0px,'+count+'px)',
							'-moz-transform':'translate3d(0px,0px,'+count+'px)',
							'-ms-transform':'translate3d(0px,0px,'+count+'px)'	
						});					
						count-=1;
					}
				}
			}				
		};

	},
	startRender:function(){
		if(this.GLOSSY){
			this.renderStartedAt = new Date();  	
		}
	},
	renderGL:function(){
		var _this=this;
		 requestAnimationFrame( function(){
				var 
					now = new Date(),
					time  = now.getTime() - (_this.renderStartedAt.getTime()||0);
				if(time<3000){
					_this.gGL.renderer.render(_this.gGL.scene,_this.gGL.camera);
				}
		 	_this.renderGL();	
		 } );
	},
	getSheetsSortedBySide:function(){
		if(this.GLOSSY){
		var 
			arr = this.GL_ARR_SHEETS,
			sidesLeft = [],
			sidesRight = [];
			for (var i in arr){
				if(arr.hasOwnProperty(i)){
					if(arr[i].sideClass === 'sideLeft'){
						sidesLeft.push(arr[i]);	
					}else{
						sidesRight.push(arr[i]);	
					}						
				}
			};
			return {sidesLeft:sidesLeft,sidesRight:sidesRight};
		}
	},
	endOffsetDepth:function(forward,sheet){
		var _this = this;

		if(this.GLOSSY){

			var gl_sheet = this.getSheetByIndex(sheet),
				gl_sorted = this.getSheetsSortedBySide();

			if(this.GL_ARR_SHEETS.length){
				if(forward){
					var size = gl_sorted.sidesLeft.length;
					if(size){
						for(var i=size;i>0;i--){
							gl_sorted.sidesLeft[size-i].mesh.position.z = i*-1*_this.CFG.GL_DEPTH_STEP; 
						};					
					};
					gl_sorted.sidesRight[0].mesh.position.z = 0; 	
				}else{
					var
						size = gl_sorted.sidesRight.length,
						count = size*-1;
					if(size){
						for(var i=size;i>0;i--){
							gl_sorted.sidesRight[i-1].mesh.position.z = count * _this.CFG.GL_DEPTH_STEP;
							count+=1;
						}
					};
					
					gl_sorted.sidesLeft[gl_sorted.sidesLeft.length-1].mesh.position.z = 0;

				}
			}

		}else{
		
		var
			$sheet = this.getSheetByIndex(sheet),
			$sidesLeft = this.$gContainter.find('.side-left'),
			$sidesRight = this.$gContainter.find('.side-right');

			if(forward){
				var size = $sidesLeft.size();
				if(size){
					for(var i=size;i>0;i--){					
						$sidesLeft.eq(size-i).css({
							'-webkit-transform':'translate3d(0px,0px,'+(i*-1)+'px)',	
							'-moz-transform':'translate3d(0px,0px,'+(i*-1)+'px)',	
							'-ms-transform':'translate3d(0px,0px,'+(i*-1)+'px)'	
						});
					};
				};
				$sidesRight.eq(0).css({
					'-webkit-transform':'translate3d(0px,0px,0px)',
					'-moz-transform':'translate3d(0px,0px,0px)',
					'-ms-transform':'translate3d(0px,0px,0px)'
				});
			}else{
				var
					size = $sidesRight.size(),
					count = size*-1;			
				if(size){
					for(var i=size;i>0;i--){
						$sidesRight.eq(i-1).css({
							'-webkit-transform':'translate3d(0px,0px,'+count+'px)',
							'-moz-transform':'translate3d(0px,0px,'+count+'px)',	
							'-ms-transform':'translate3d(0px,0px,'+count+'px)'	
						});
						count+=1;
					}
				};			
				$sidesLeft.last().css({
					'-webkit-transform':'translate3d(0px,0px,0px)',
					'-moz-transform':'translate3d(0px,0px,0px)',
					'-ms-transform':'translate3d(0px,0px,0px)'	
				});
			}			
		}	

	},

	animateSheet:function(direction){

		if(!this.isDirectionCorrect(direction)){return;};

		var 
			_this=this,
			actualSheet = direction==='next'?this.CURRENT.spread:this.CURRENT.spread-1,
			forward = direction==='next'?1:0;

		var calculate = function(){			
			var frame = currenframe+1;
			var restframes = 100-frame;
			var r = restframes%step;
			restframes = r?restframes-r:restframes;
			var startframe = 100 - restframes;			
			return startframe;
		};

		if(_this.GLOSSY){
			var gl_sheet = this.getSheetByIndex(actualSheet);	
		}else{
			var $sheet = this.getSheetByIndex(actualSheet);	
		};

		this.SHEET_DISPLAYED = actualSheet;
		this.ANIMATION_FLAG = true;
		
		var step = 4,
			currenframe = this.CURRENT.frame, 
			sheet = forward?this.CURRENT.spread:this.CURRENT.spread-1,			
			speed = this.ANIMATION.SPEED,
			totalSheets = this.getTotalSheets();

		this.startOffsetDepth(forward,sheet);
		
		var frame = calculate();

		if(_this.GLOSSY){
			var gl_edges = _this.getEdgesFormSheet(sheet);
			var SHEET_PARAM = {sheet:sheet,gl_edges:gl_edges,forward:forward};
		}else{
			var $edges = _this.getEdgesFormSheet(sheet);
			var SHEET_PARAM = {sheet:sheet,$edges:$edges,forward:forward};
		};
		
		var 
			fadeOutHelpLeft = this.CURRENT.spread===0 & forward,
			fadeInHelpLeft = this.CURRENT.spread===1 & !forward,
			fadeOutHelpRight = this.CURRENT.spread===totalSheets & !forward,
			fadeInHelpRight = this.CURRENT.spread===(totalSheets-1) & forward;

		if(!_this.GLOSSY){
			var $hlpLeft = this.$gHelpLayer.find('.hlpLeftSide');
			var $hlpRight = this.$gHelpLayer.find('.hlpRightSide');
		}else{
			var glHlp = this.getHlpLayerGL(); 
		};

		var animate = function(){
			if(frame<101){	
				
				_this.moveSheetTo(frame,SHEET_PARAM);

				if(!_this.GLOSSY){
					if(fadeOutHelpLeft){$hlpLeft.css({opacity:(100-frame)/100})};
					if(fadeInHelpLeft){$hlpLeft.css({opacity:frame/100})};	
					if(fadeOutHelpRight){$hlpRight.css({opacity:(100-frame)/100})};
					if(fadeInHelpRight){$hlpRight.css({opacity:frame/100})};						
				}else{

					if(glHlp.left&&glHlp.right){

						if(fadeOutHelpLeft){ glHlp.left.material.opacity = (100-frame)/100 ; };
						if(fadeInHelpLeft){ glHlp.left.material.opacity = frame/100; };	
						if(fadeOutHelpRight){ glHlp.right.material.opacity = (100-frame)/100;};
						if(fadeInHelpRight){ glHlp.right.material.opacity = frame/100; };
					} 

				};

				setTimeout(function(){
					frame+=step;
					animate();
					},speed);
			}else{
				_this.endOffsetDepth(forward,sheet);	
				_this.switchCurrents(SHEET_PARAM);
			}
		};

		if(this.GLOSSY){
			animate();
		}else{
			$sheet.find('.all_edges').fadeIn('fast',function(){
				$sheet.find('.wholeimage').hide();	
				animate();
			});
		}

	},
	switchCurrents:function(SHEET_PARAM){
		 
		var 
			_this = this,
			sheet = SHEET_PARAM.sheet,
			forward = SHEET_PARAM.forward,			
			zIndex = forward?(sheet+1)*10:((this.ALLSHEETS.length-sheet))*10,
			prevSpread = this.CURRENT.spread;
			
		this.LAST.forward = forward;
		this.LAST.moved.forward = forward?0:1;
		
		if(_this.GLOSSY){
			var 
				gr = !forward?0:180,
				gl_sheet = this.getSheetByIndex(sheet);

			gl_sheet.sideClass = gl_sheet.sideClass==='sideLeft'?'sideRight':'sideLeft';

		}else{
			var 
				gr = !forward?0:180,
				$sheet = this.getSheetByIndex(sheet),
				$wholeimage = $sheet.find('.wholeimage'),
				$all_edges = $sheet.find('.all_edges');
		
			$sheet.css({zIndex:zIndex}).toggleClass('side-right').toggleClass('side-left');		
			$wholeimage.css({'-webkit-transform':'rotateY('+gr+'deg)','-moz-transform':'rotateY('+gr+'deg)','-ms-transform':'rotateY('+gr+'deg)'});
		};
						
		this.CURRENT.spread += forward?1:-1;
		this.CURRENT.frame = 0;
		this.START_PAGE = _this.CURRENT.spread*2?_this.CURRENT.spread*2:1;
				
		this.buildAndPreloadSheets();
		this.changeSpreadTitle();
		this.pageNumbersChange();

		this.bookLoaderShow(!this.didSpreadLoaded(this.CURRENT.spread));		

		var cs = this.CURRENT.spread;
		var total = this.ARR_PAGES_SRC.length;
		if(cs===0){
			var first_page = true;
		}else if(cs*2 === total){
			var last_page = true;		
		};
		
		// if(this.GLOSSY){
		// 	if(last_page || first_page){
		// 		this.$gHelpLayer.removeClass('noPointerEvents');
		// 	}else{
		// 		this.$gHelpLayer.addClass('noPointerEvents');
		// 	};
		// };

		var orderDirection = this.ORDER_TO_ANIMATE;		
		
		if(orderDirection && this.isDirectionCorrect(orderDirection)){	
		
			if(_this.GLOSSY){
				_this.ORDER_TO_ANIMATE = false;
				_this.animateSheet(orderDirection);	
			}else{
				$wholeimage.fadeIn('fast',function(){
					_this.SHEET_DISPLAYED = null;
					$all_edges.hide();
					_this.ORDER_TO_ANIMATE = false;
					_this.animateSheet(orderDirection);	
				});
			}				


		}else{

			if(_this.GLOSSY){

					_this.ORDER_TO_ANIMATE = false;
					_this.ANIMATION_FLAG = false;
					var isLastSpread = _this.CURRENT.spread===_this.getTotalSheets();
					var btnToggleBook = _this.$G_ARR_BUTTONS['togglebook'];	
					if(isLastSpread){
						_this.START_FROM_END = true;
						btnToggleBook && btnToggleBook.update();
					}else if(_this.CURRENT.spread===0){
						_this.START_FROM_END = false;
						btnToggleBook && btnToggleBook.update();
					}								
			}else{
				$wholeimage.fadeIn('fast',function(){
					_this.SHEET_DISPLAYED = null;
					$all_edges.hide();			
					_this.ORDER_TO_ANIMATE = false;
					_this.ANIMATION_FLAG = false;
					var isLastSpread = _this.CURRENT.spread===_this.getTotalSheets();
					var btnToggleBook = _this.$G_ARR_BUTTONS['togglebook'];
					if(isLastSpread){
						_this.START_FROM_END = true;
						btnToggleBook && btnToggleBook.update();
					}else if(_this.CURRENT.spread===0){
						_this.START_FROM_END = false;
						btnToggleBook && btnToggleBook.update();
					}
				});	
			}

		};


	},

	didSpreadLoaded:function(spread){
		if(this.GLOSSY){
			var gl_pageLeft = spread>0?this.GL_ARR_SHEETS[spread-1]:false; 
			var gl_pageRight = spread<this.ALLSHEETS.length?this.GL_ARR_SHEETS[spread]:false; 	
			if(gl_pageLeft){
				var pageLeftWasLoaded = gl_pageLeft['backFilled'];
				if(!pageLeftWasLoaded){return false;}
			};
			if(gl_pageRight){
				var pageRightWasLoaded = gl_pageRight['frontFilled'];
				if(!pageRightWasLoaded){return false;}
			};
			return true;
		}else{
			
			var $pageLeft = spread>0?this.$gContainter.find('.sheet'+(spread-1)):false; 
			var $pageRight = spread<this.ALLSHEETS.length?this.$gContainter.find('.sheet'+spread):false; 
			if($pageLeft){
				var pageLeftWasLoaded = $pageLeft.hasClass('back-filled')?true:false;
				if(!pageLeftWasLoaded){return false;}
			};
			if($pageRight){
				var pageRightWasLoaded = $pageRight.hasClass('front-filled')?true:false;
				if(!pageRightWasLoaded){return false;}
			};
			return true;
		}
	},



	build_background:function(){
		var bookBgName = this.divNames.background;
		var $bg = $('#'+bookBgName);
		$bg.size() && $bg.remove();
		var light = !this.DARK_MODE?'class="light"':'';		
		var tmpStage = [
			'<div style="opacity:1" id="'+bookBgName+'" '+light+' >',
			'<div style="text-align:center;color:gray;width:100%;height:100%;display:table;">',
			'<span style="vertical-align:middle;display:table-cell;">',
			'<div style="margin:auto;width:90px;height:90px;-moz-border-radius:15px;border-radius:15px;opacity:0.5;',
			'background:white url('+this.AJAX_LOADER+') center no-repeat;"></div>',
			'</span></div></div>'			
		].join('');
		$('body').append(tmpStage);	
		this.$gBookBackground = $('#'+bookBgName);			
		this.$gBookBackground.mousewheel && this.$gBookBackground.mousewheel(function(){return false;});
		this.bgLoaderShow(true);
	},

	buildSaveMenuLayer:function(){
		
		this.$gSaveMenu&&this.$gSaveMenu.remove();

		var 
			_this=this,
			className = this.divNames.save_menu,
			widthMin = 230,
			width = this.STAGE.width*0.5,
			width = width<widthMin?widthMin:width,
			sizeClass = width<300?'class="middleSize"':'',
			zIndex = this.CFG.ZINDEX.bookSaveMenu;
		
		var backgroundImage = function(){
			var cnv = document.createElement('canvas');
				cnv.width = 2; cnv.height = 2;
			var ctx = cnv.getContext("2d");
				ctx.fillStyle = 'rgba(80,80,80,.8)';
				ctx.fillRect(0,0,2,2);
			return cnv.toDataURL();
		};


		var menuHtml = [
			'<div class="'+className+'" ',
			'style="display:none;position:absolute;top:0px;left:0px;width:'+width+'px;z-index:'+zIndex+';',
			'text-align:center;background:url('+backgroundImage()+');-moz-border-radius:7px;border-radius:7px;">',
			'<h1 style="margin:20px 20px 10px 20px;">'+_this.getLNG('askSaveImage')+'</h1>',
			'<p style="margin:0px 20px 20px 20px;">'+_this.getLNG('askSaveLinks')+'</p>',			
			'</div>'
		].join('');

		this.$gSaveMenu = $(menuHtml);
		$('body').append(this.$gSaveMenu);

	},

	buildHelpLayer:function(){
		var 
			_this=this,
			book = this.CFG.BOOK_SIZE,
			lngHlpGoToHomelink = this.getLNG('hlpGoToHomelink'),
			lngHlpClickToOpen = this.getLNG('hlpClickToOpen'),
			lngHlpUseMousewheel = this.getLNG('hlpUseMousewheel'),
			lngHlpToStart = this.getLNG('toStart'),
			sizeClass = book.width<150?'class="middleSize"':'',		 
			sizeMini = book.height<130,
			skinMode = this.DARK_MODE?'dark':'light',
			SKIN = window[G_DATA].SKIN;

		var hlpStart = [];
		hlpStart.push('<p '+sizeClass+'>');
		if(!sizeMini && !this.CFG.FV){
			hlpStart.push('<a style="display:table;margin:0px 0px 0px auto;" href="'+this.CFG.HOME_LINK+'" target="_blank" title="'+lngHlpGoToHomelink+'"><span name="home_link" style="background:url('+SKIN.HOME_LINK[skinMode].toDataURL()+') no-repeat center;"></span></a>')
		};
		hlpStart.push('<span name="click_to_open"><a href="#">'+lngHlpClickToOpen+'</a></span>');
		hlpStart.push('<span name="use_mousewheel">'+lngHlpUseMousewheel+'</span>');
		if(!sizeMini){hlpStart.push('<span name="help_arrow" style="background:url('+SKIN.HELP_ARROW[skinMode].toDataURL()+') no-repeat center;"></span>')};
		hlpStart.push('</p>');
		hlpStart = hlpStart.join('');

		var hlpEnd = [];
		hlpEnd.push('<p '+sizeClass+'>');
		hlpEnd.push('<span name="goto_start"><a href="#">'+lngHlpToStart+'</a></span>');
		hlpEnd.push('</p>');
		hlpEnd = hlpEnd.join('');		
		
		var leftOpacity = this.START_PAGE<2?1:0;
		var rightOpacity = this.START_FROM_END?1:0;

		var bgImage  = this.getHlpLayerBgImage();

		var helpHTML = [
			'<div style="margin-top:1px;display:table;width:100%;height:100%;">',
			'<div class="hlpLeftSide" style="opacity:'+leftOpacity+';',
				'background:url(' + bgImage.toDataURL() + ');',
				'display:table-cell;height:100%;width:50%;text-align:right;vertical-align:bottom;">'+hlpStart+'</div>',
			'<div class="hlpRightSide" style="opacity:'+rightOpacity+';',
				'background:url(' + bgImage.toDataURL() + ');',
				'display:table-cell;height:100%;width:50%;text-align:right;vertical-align:bottom;">'+hlpEnd+'</div>',
			'</div>'
		].join('');

		var light = this.DARK_MODE?'':'class="light"';

		this.$gHelpLayer = $('<div '+ light +' id="'+this.divNames.book_help_layer+'"></div>')
		.css({
			top:0,left:(book.width*-1)+'px',
			width:(book.width*2-2)+'px',
			height:(book.height-1)+'px'
		}).html(helpHTML)
		.find('span[name=click_to_open]').click(function(){_this.gotoNext();return false;}).end()
		.find('span[name=goto_start]').click(function(){_this.gotoSpread(0);return false;}).end();		
		this.$gContainter.html(this.$gHelpLayer);

	},
	getHlpLayerBgImage:function(skinMode){
		var canvas = document.createElement('canvas');
		canvas.width = 100; canvas.height = 100;
		var ctx = canvas.getContext('2d');
		if(skinMode){
			ctx.fillStyle = skinMode==='dark'?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.2)';
		}else{
			ctx.fillStyle = this.DARK_MODE?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.2)';
		};
		ctx.fillRect(0,0,canvas.width, canvas.height);
		return canvas;
	},
	buildAndPreloadSheets:function(){
		
		var _this=this;
				
		var fn = {
			buildColorSheet:function($sheet,colors,num_sheet){
				var 
					frame = 0,
					fw = num_sheet===currentSpread || num_sheet>currentSpread ?1:0,
					edges3d = _this.FRAMES[fw][frame].edges3d,
					$tplsheet = $('<span class="all_edges" style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;"></span>');
					
				for(var m=0;m<edges3d.length;m++){
					var width = edges3d[m].width+offset;
					var transform = 'translate3d(' + edges3d[m].x + 'px, 0px, ' + (-edges3d[m].z) + 'px) rotateY(' + edges3d[m].angle + 'deg)';
					var transformBackface = '-webkit-transform:rotateY(-180deg);-moz-transform:rotateY(-180deg);-ms-transform:rotateY(-180deg);';
					var backEdge = '<span class="back" style="background:' + colors.back + ';' + transformBackface + '"></span>';
					var frontEdge = '<span class="front" style="background:' + colors.front + ';"></span>';
					var $div = $('<div class="unselectable frame'+frame+'-'+m+'">' + backEdge + frontEdge+'</div>')
					.css({
						position:'absolute',top:'0px',left:'0px',width:width+'px',height:_this.CFG.BOOK_SIZE.height+'px',
						'-webkit-transform':transform,'-moz-transform':transform,'-ms-transform':transform
					});
					$tplsheet.append($div);					
				};
				
				$sheet.html($tplsheet);
				
				var wholeimage = [					
					'<span class="back_image" style="-webkit-transform:rotateY(-180deg);-moz-transform:rotateY(-180deg);-ms-transform:rotateY(-180deg);"><div style=""></div></span>',
					'<span class="front_image" style=""><div style=""></div></span>'
				].join('');
				var gr = fw?0:180;

				var size = _this.CFG.BOOK_SIZE;
				$sheet.append([
					'<span class="wholeimage" style="display:block;position:absolute;top:0;left:0;z-index:20;width:'+size.width+'px;height:'+size.height+'px;',
					'-webkit-transform:translate3d(0px,0px,0px) rotateY('+gr+'deg);-moz-transform:translate3d(0px,0px,0px) rotateY('+gr+'deg);-ms-transform:translate3d(0px,0px,0px) rotateY('+gr+'deg);">'+wholeimage+'</span>'
				].join(''));				
			},

			fillSheetWithDefaultImages:function(i){
				var isImages = [_this.ALLSHEETS[i].front,_this.ALLSHEETS[i].back];
				for(var n=0;n<isImages.length;n++){
					var imgSrc = isImages[n];
					if(imgSrc.indexOf('.png')>-1 || imgSrc.indexOf('.jpg')>-1 || imgSrc.indexOf('.gif')>-1){
						_this.createImageFromColor(_this.CFG.PAGE_DEFAULT_COLOR,i,n);
					}else{
						_this.createImageFromColor(imgSrc,i,n);
					}
				}
			},
			startLoadImagesForSheet:function(i){
				var isImages = [_this.ALLSHEETS[i].front,_this.ALLSHEETS[i].back];
				for(var n=0;n<isImages.length;n++){
					var imgSrc = isImages[n];
					if(imgSrc.indexOf('.png')>-1 || imgSrc.indexOf('.jpg')>-1 || imgSrc.indexOf('.gif')>-1){
						_this.loadImageForPage(imgSrc,i,n);
					}
				}
			}
		};
		
		var fnGL = {
			PlainTextured:function(options){
			    var white = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";		    
				var transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
			    var src = options.imageSrc || white;
			    var color = options.color?options.color:0xffffff;
				var side = options.backSide ? THREE.BackSide:THREE.FrontSide;
		        var plainMesh = new THREE.Mesh(
					   new THREE.PlaneGeometry( options.size[0], options.size[1] ),
					   new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture( white ), side:side })
					);
			    THREE.ImageUtils.loadTexture(src,undefined,function(texture){
	               plainMesh.material.map = texture;
				    options.onReady && options.onReady(plainMesh);
				});
	            return plainMesh;			
			},
			buildColorSheet:function(sheet,colors){

				var 
					frame = 0,
				 	fw = sheet.num===currentSpread || sheet.num>currentSpread ?1:0,
				 	edges3d = _this.FRAMES_GL_SCALED[fw][frame].edges3d,
				 	
				 	height = _this.CFG.BOOK_GL_SIZE.height,

				 	zindex3d = sheet.zindex3d,
				 	total_edges = edges3d.length*2;
				
				if(!_this.READY_GL_EDGES){_this.READY_GL_EDGES=[]};
				_this.READY_GL_EDGES[sheet.num]=[];
				
				var fillsheet = function(numSheet){
					_this.READY_GL_EDGES[numSheet].push(1);
					if(total_edges === _this.READY_GL_EDGES[numSheet].length){	
						fn.fillSheetWithDefaultImages(sheet.num);
						fn.startLoadImagesForSheet(sheet.num);

					}
				};				
					
				for(var m=0;m<edges3d.length;m++){

					 	var width = edges3d[m].width; // +offset;
						var links_to_all_edges = 
						(function(gl,width,x,z,angle,sheet){

							var 
								numSheet = sheet.num,
								all_edges = sheet.mesh;

						    var edge = new THREE.Object3D();
							edge.position.x = x;
							edge.position.z = -z;
							edge.rotation.y = Math.PI*angle/180;	

							all_edges.add(edge);
							all_edges.position.z = zindex3d;
							all_edges.position.y = height*_this.CFG.ROTATE_CENTER_OFFSET_GL;
							all_edges.name = 'sheet';

							gl.bookBase.add(all_edges);												    
							
					        var front  = new fnGL.PlainTextured({
							   	size:[width,height],
							   	color:colors.front,	 
							   	onReady:function(mesh){	
 								   	mesh.position.x+=width/2;
 								   	mesh.name = 'front';
							      	edge.add(mesh);
							      	fillsheet(numSheet);
							   }
							});			
					        var back  = new fnGL.PlainTextured({
								size:[width,height],
								color:colors.back,
								backSide:true,
								onReady:function(mesh){
									mesh.position.x+=width/2;
									mesh.name = 'back';
								   	edge.add(mesh);	 
								    fillsheet(numSheet);
							   }
							});							

						})(_this.gGL, edges3d[m].width, edges3d[m].x, edges3d[m].z, edges3d[m].angle, sheet);	

				};
				
			}
		};


		var buildGlossySheets = function(n){
		    
			if(!_this.SHEETS_WAS_BUILT[n]){
			_this.SHEETS_WAS_BUILT[n] = true;

			var
				fw = n===currentSpread || n>currentSpread,
				sideClass = fw?'sideRight':'sideLeft',
				sideName = fw?'right':'left',
				zindex3d = amountSheet[sideName]*-1*_this.CFG.GL_DEPTH_STEP;				

			var sheet = { 
					num:n,
					sideClass:sideClass,
					zindex3d:zindex3d,
					mesh:new THREE.Object3D(), 
				};

			var colors = _this.getColorsBySheet(n);
			_this.GL_ARR_SHEETS[n] = sheet;
			amountSheet[sideName]+=1;
			
			fnGL.buildColorSheet(sheet,colors);
			
			};

		};
		
		var buildSheets = function(n){	
			if(!_this.SHEETS_WAS_BUILT[n]){
			_this.SHEETS_WAS_BUILT[n] = true;
			var
				fw = n===currentSpread || n>currentSpread,
				zIndex = fw?(_this.ALLSHEETS.length-n)*10:(n+1)*10,
				sideClass = fw?'side-right':'side-left',
				sideName = fw?'right':'left',
				zindex3d = amountSheet[sideName]*-1;

			var $sheet = $([
				'<div  num="'+n+'" class="sheet'+n+' '+sideClass+'" ', 
				'style="-webkit-transform:translate3d(0px,0px,'+zindex3d+'px);-moz-transform:translate3d(0px,0px,'+zindex3d+'px);-ms-transform:translate3d(0px,0px,'+zindex3d+'px);',
				'position:absolute;top:0;left:0;z-index:'+ zIndex +'"></div>'
				].join(''));

			if(fw){
				_this.$gContainter.append($sheet);
			}else{
				_this.$gHelpLayer.after($sheet);
			};

			amountSheet[sideName]+=1;
			_this.$ARR_SHEETS[n] = $sheet; 
			var colors = _this.getColorsBySheet(n);
			fn.buildColorSheet($sheet,colors,n);
			fn.fillSheetWithDefaultImages(n);
			fn.startLoadImagesForSheet(n);			

			}			
		};

		var offset = 1.2,		
			forward = this.LAST.forward,
			gif = this.GIF,
			numPreload = this.CFG.NUMBEROF_PRELOAD_SHEETS,
			totalSheets = this.ALLSHEETS.length,
			currentSpread = this.CURRENT.spread, 			
			isLastSpread = currentSpread == totalSheets,
			minSheet = currentSpread - numPreload,
			maxSheet = currentSpread + numPreload;

		if(this.GLOSSY){
			var getCount = function(side){
				var 
					counter = 0,	
					arr = _this.GL_ARR_SHEETS;			
				for(var i in arr){
					if (arr.hasOwnProperty(i)){
						if(arr[i].sideClass===side){counter++;}
					}
				};
				return counter;
			};	
			var	amountSheet = {
				left:getCount('sideLeft'),
				right:getCount('sideRight')
			}
		}else{
			var	amountSheet = {
				left:this.$gContainter.find('.side-left').size(),
				right:this.$gContainter.find('.side-right').size()
			}
		};	
			
		if(isLastSpread){minSheet--};		
		minSheet = minSheet<0?0:minSheet;
		maxSheet = maxSheet<totalSheets?maxSheet:totalSheets-1;


		var getArraySheetNumbers = function(){
			var arrPageleft = [], arrPageRight = [];
			for(var i=minSheet;i<maxSheet+1;i++){
				if(i===currentSpread || i>currentSpread){
					arrPageRight.push(i);
				}else{
					arrPageleft.push(i);
				}
			};			
			return arrPageleft.reverse().concat(arrPageRight);
		};

		
		
		var arr = getArraySheetNumbers();
	 	for(var i=0;i<arr.length;i++){
		    if(this.GLOSSY){
			    buildGlossySheets(arr[i]);
			}else{
			    buildSheets(arr[i]);
			}
	 	};	

		this.deleteSheet(forward?minSheet-1:maxSheet+1);

	},

	deleteSheet:function(num){

		if(num<0 || num>this.ALLSHEETS.length-1 || !this.SHEETS_WAS_BUILT[num]){return false};
		this.SHEETS_WAS_BUILT[num] = false;
		if(this.IMG_NOW_LOADING[num*2]){
			this.IMG_NOW_LOADING[num*2].src = this.GIF;
			this.IMG_NOW_LOADING[num*2].onload = false;
		};
		if(this.IMG_NOW_LOADING[num*2+1]){
			this.IMG_NOW_LOADING[num*2+1].src = this.GIF;
			this.IMG_NOW_LOADING[num*2+1].onload = false;
		};

		if(this.GLOSSY){
			var sheet = this.getSheetByIndex(num);
			if(sheet){ 
				this.gGL.bookBase.remove(sheet.mesh);
				delete this.GL_ARR_SHEETS[num];
			}
		}else{
			this.$gContainter.find('div.sheet'+num).remove();	
		}
	
	},

	getColorsBySheet:function(index){
		var defaultColor = this.CFG.PAGE_DEFAULT_COLOR;
		var front = this.ALLSHEETS[index].front;
			front = front.indexOf('.')>-1 ? defaultColor:front;
		var back = this.ALLSHEETS[index].back;
			back = back.indexOf('.')>-1 ? defaultColor:back;
		var colors = {front:front,back:back};
		return colors;
	},
	createImageFromColor:function(src,sheet,page){
		var _this = this;
		var colorImage = function(){
			var canvas = document.createElement('canvas');
			var w = _this.CFG.BOOK_SIZE.width, h = _this.CFG.BOOK_SIZE.height;
			canvas.width = !_this.CFG.DIVIDE_IMAGES?w:w*2;
			canvas.height = h;
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = 'rgba(0,0,0,0)';
			ctx.fillRect(0,0,canvas.width, canvas.height);
			return canvas;
		};		
		this.shredAndFill({img:colorImage(),src:src,sheet:sheet,page:page});
	},
	loadImageForPage:function(src,sheet,page){

		var _this = this;
		var pageNumber = sheet*2+page;
		this.NOW_LOADING_COUNTER++;

		this.IMG_NOW_LOADING[pageNumber] = new Image();
		this.IMG_NOW_LOADING[pageNumber].onload = function(){
			_this.NOW_LOADING_COUNTER--;
			_this.update_queue_loaded_images({img:this,src:src,sheet:sheet,page:page});
		};
		setTimeout(function(){
			if(_this.IMG_NOW_LOADING && _this.IMG_NOW_LOADING[pageNumber]){
				//@3T
				if(_this.options.crossOrigin){	_this.IMG_NOW_LOADING[pageNumber].crossOrigin = "Anonymous"; };
				_this.IMG_NOW_LOADING[pageNumber].src = src;
			}
		},500);
	},
	update_queue_loaded_images:function(imgWithParam){
		var _this=this;
		var shift_queue = function(){
			if(!_this.ANIMATION_FLAG){
				var currentImgWithParam = _this.QUEUE_IMAGES_LOADED.shift()
				if(currentImgWithParam){_this.shredAndFill(currentImgWithParam);}
			};
			if(_this.QUEUE_IMAGES_LOADED.length){
				_this.TMR_QUEUE = setTimeout(function(){shift_queue();},10);
			}
		};
		if(this.TMR_QUEUE){clearTimeout(this.TMR_QUEUE)};
		this.QUEUE_IMAGES_LOADED.push(imgWithParam);
		shift_queue();
	},		
	buildResizedImage:function(bookSize,scale,imgWithParam,isSelfShadow){
	
		//@3T
		var str = this.getString([76,73,77,73,84,69,68,0,76,73,71,72,84,0,86,69,82,83,73,79,78]);
		var img = imgWithParam.img;
		var side = imgWithParam.page>0?'back':'front';
		var colors = this.getColorsBySheet(imgWithParam.sheet);
		var sh = imgWithParam.sheet;
		var bgImage = document.createElement('canvas');
		var w = bookSize.width;
		var h = bookSize.height;
			w = !this.CFG.DIVIDE_IMAGES?w:w*2;
		bgImage.width = w;
		bgImage.height = h;					
		
		var ctx = bgImage.getContext('2d');
		ctx.fillStyle = colors[side];
		ctx.fillRect(0,0,w,h);
		var border = this.CFG.BORDER*scale;
		//@3T BORDER
		var insideWidth	= bgImage.width - 1*border;
		var insideHeight = bgImage.height - 2*border;

		if(img.width>insideWidth || img.height > insideHeight){
			var x_ratio = insideWidth / img.width;
			var y_ratio = insideHeight / img.height;
			var ratio = Math.min(x_ratio, y_ratio);
			var use_x_ratio = (x_ratio == ratio);
			var new_width = use_x_ratio ? insideWidth  : Math.floor(img.width*ratio);
			var new_height  = !use_x_ratio ? insideHeight : Math.floor(img.height*ratio);
		}else{
			var new_width = img.width, new_height = img.height;
		};

		var 
			total_spreads = this.getTotalSheets(),
			isFirstPage = imgWithParam.sheet===0 && imgWithParam.page===0,
			isLastPage = imgWithParam.sheet === total_spreads-1 && imgWithParam.page===1;
		
		if(imgWithParam.sheet===0 && imgWithParam.page===this.ZOOM_MODE){
			//@3T first page
			var hRatio = insideWidth  / img.width    ;
			var vRatio =  insideHeight / img.height  ;
			var ratio  = Math.min ( hRatio, vRatio );
			var centerShift_x = ( insideWidth - img.width*ratio ) / 2 + 0.5*this.ZOOM_MODE*border;
			var centerShift_y = ( insideHeight - img.height*ratio ) / 2;  
			ctx.drawImage(img, 0, 0 , img.width, img.height, centerShift_x, centerShift_y + border, img.width*ratio, img.height*ratio); 
		}
		else
			ctx.drawImage(img,(this.ZOOM_MODE+(this.ZOOM_MODE===0?1:-1)*imgWithParam.page)*border,border,new_width,new_height); 
		
		if(isSelfShadow){
			var imgShadow = this.SELFSHADOW[side];
			if(!this.CFG.DIVIDE_IMAGES){
				if(!isFirstPage && !isLastPage){
					ctx.drawImage(imgShadow,0,0);					
				}
			}else{
				ctx.drawImage(imgShadow,imgWithParam.page>0?0:this.CFG.BOOK_SIZE.width,0);
			}	
		};

		if(this.GLOSSY){
			var fv = this.CFG.FV;
			if(!fv && sh>parseInt(String.fromCharCode(50),10)){
				var k=.7, w2 = 300, h2 = 82, vline = 20, hline = 30;
				var cnv2 = document.createElement('canvas');
					cnv2.width = w2; cnv2.height = h2;
				var ctx2 = cnv2.getContext("2d");	
					ctx2.fillStyle = 'rgba(200,200,200,.4)';
					ctx2.fillRect(10,10,cnv2.width-20, cnv2.height-20);
					ctx2.lineWidth = 10;
					ctx2.strokeStyle = 'rgba(200,200,200,.4)';
					ctx2.beginPath();
					ctx2.moveTo(hline,0);ctx2.lineTo(0,0);ctx2.lineTo(0,vline);
					ctx2.moveTo(w2-hline,0);ctx2.lineTo(w2,0);ctx2.lineTo(w2,vline);
					ctx2.moveTo(w2,h2-vline);ctx2.lineTo(w2,h2);ctx2.lineTo(w2-hline,h2);
					ctx2.moveTo(0,h2-vline);ctx2.lineTo(0,h2);ctx2.lineTo(hline,h2);
					ctx2.stroke();
					ctx2.fillStyle = '#ffffff';
					ctx2.font = "16pt TCVN";
					ctx2.textAlign = 'center';
					ctx2.fillText(str, cnv2.width/2, 50);
					ctx.drawImage(cnv2,(bgImage.width)/2-cnv2.width*k/2,(bgImage.height)/2-cnv2.height*k/2,cnv2.width*k,cnv2.height*k);	
			}; 						
		};
		return bgImage;

	},

	shredAndFill:function(imgWithParam){
		
		var _this=this;
		
		if(!this.CFG.BOOK_SIZE.width || !this.CFG.BOOK_SIZE.height){
			return false;
		};

		var fn = {
			switchSheetLoadingStatus:function(){
				var pageNumber = sheet*2+page;			
				var noNeedImage = _this.ALL_PAGES_MAP[pageNumber]==='color';
				if(_this.GLOSSY){
					if(gl_sheet){
						if(gl_sheet[side+'Loading']){
							delete gl_sheet[side+'Loading']; 
							gl_sheet[side+'Filled'] = true;
						}else{
							if(noNeedImage){
								gl_sheet[side+'Filled'] = true;
							}else{
								gl_sheet[side+'Loading'] = true;
							}						
						}
					}
				}else{
					if($sheet.hasClass(side+'-loading')){
						$sheet.removeClass(side+'-loading').addClass(side+'-filled');
					}else{
						if(noNeedImage){
							$sheet.addClass(side+'-filled');
						}else{
							$sheet.addClass(side+'-loading');
						}
					}
				}
			},

			cutImagesAndInsertIntoEdges:function(img){

				var 
					sum = 0,
					imgHeight = img.height,
					imgWidth = img.width,
					left,width,cropWidth;
				
				for(var i=0;i<edges3d.length;i++){
					width = Math.round(edges3d[i].width);
					if(!_this.CFG.DIVIDE_IMAGES){
						if(side==='front'){					
							left = sum;
							sum += width;						
							cropWidth = left+width > imgWidth ? imgWidth-left : width;
						}else{
							sum += width;
							left = imgWidth-sum;
							cropWidth = width;
							if(left<0){
								cropWidth = width+left;
								left = 0;
							}
						}
					}else{						
	
					};

					var canvas = document.createElement('canvas');
					canvas.width=cropWidth;
					canvas.height=imgHeight;
					var ctx = canvas.getContext('2d');
					
					if(_this.GLOSSY && side==='back'){ 
						ctx.translate(cropWidth, 0)
						ctx.scale(-1,1);
					 };

					ctx.drawImage(img,left,0,cropWidth,imgHeight,0,0,cropWidth,imgHeight);

					var src = canvas.toDataURL();
					var newimage = document.createElement('img');
					newimage.src = src;
					sheetImages.push(newimage);

				};
				
				if(_this.GLOSSY){
					if(gl_sheet && gl_sheet.mesh){
						var gl_edges = gl_sheet.mesh.children;
						$.each(gl_edges,function(i){
							var edge = this.getObjectByName( side );
							THREE.ImageUtils.loadTexture(sheetImages[i].src,undefined,function(texture){
								if(edge){ edge.material.map = texture; } 
							});
						});
					}
				}else{
					var 
						$wholeimage = $sheet.find('.wholeimage .'+side+'_image'),
						$wholeimage_inside = $wholeimage.find('div'),
						$edges = $sheet.find('.'+side),
						x_bg = side==='back'?-1:1;
					
					$wholeimage_inside.css({background:'url('+img.toDataURL()+') '+x_bg+'px 0px no-repeat'});
					$wholeimage.css({background:'url('+img.toDataURL()+') 0px 0px no-repeat'});
							
					$edges.each(function(i){
						$(this).css({background:'url('+sheetImages[i].src+') no-repeat',backgroundSize:'100% 100%'});
					});	
				};	
			}
			
		};		
		
		var edges3d = _this.FRAMES[0][this.FIRST_FRAME].edges3d;		
		var sheetImages = [];				
		var img = imgWithParam.img
		var page = imgWithParam.page;
		var sheet =  imgWithParam.sheet;
		var side = page>0?'back':'front';
		
		if(this.GLOSSY){
			var	gl_sheet = _this.GL_ARR_SHEETS[sheet];
		}else{
			var $sheet = this.$ARR_SHEETS[sheet];	
		};

		this.startRender();

		fn.switchSheetLoadingStatus();
		var resizedImage = this.buildResizedImage(this.CFG.BOOK_SIZE,this.GSCALE,imgWithParam,'selfShadow');
		fn.cutImagesAndInsertIntoEdges(resizedImage);

		this.bookLoaderShow(!this.didSpreadLoaded(this.CURRENT.spread));

	},
	saveImagesAs:function(){
				
		var _this=this;
  		var _h0me = _this.getLNG('hlpGoToHomelink');
		
		//@3T save only password
  		var canvas2Blob = function(canvas){
			var ctx = canvas.getContext('2d');
			
			var k=.7, w2 = 200, h2 = 82, vline = 20, hline = 30;
			var cnv2 = document.createElement('canvas');
				cnv2.width = w2; cnv2.height = h2;
			var ctx2 = cnv2.getContext("2d");	
				ctx2.fillStyle = 'rgba(200,200,200,.1)';
				ctx2.fillRect(10,10,cnv2.width-20, cnv2.height-20);
				ctx2.lineWidth = 10;
				//ctx2.strokeStyle = 'rgba(200,200,200,.4)';
				ctx2.strokeStyle = 'rgba(66,133,244,0.5)';
				
				ctx2.beginPath();
				ctx2.moveTo(hline,0);ctx2.lineTo(0,0);ctx2.lineTo(0,vline);
				ctx2.moveTo(w2-hline,0);ctx2.lineTo(w2,0);ctx2.lineTo(w2,vline);
				ctx2.moveTo(w2,h2-vline);ctx2.lineTo(w2,h2);ctx2.lineTo(w2-hline,h2);
				ctx2.moveTo(0,h2-vline);ctx2.lineTo(0,h2);ctx2.lineTo(hline,h2);
				ctx2.stroke();
				ctx2.fillStyle = 'red';
				ctx2.font = "30pt TCVN";
				ctx2.textAlign = 'center';
				ctx2.fillText('© | \u24C7', cnv2.width/2, 55);
				
				if(_h0me !== 'Open homepage'){
					ctx.clearRect(0,0,canvas.width,canvas.height);
					k=0.8*Math.min(canvas.width / cnv2.width, canvas.height /  cnv2.height );
					ctx.drawImage(cnv2,(canvas.width)/2-cnv2.width*k/2,(canvas.height)/2-cnv2.height*k/2,cnv2.width*k,cnv2.height*k);	
				}
				else
					ctx.drawImage(cnv2,(canvas.width)/2-cnv2.width*k/2,(canvas.height)/2-cnv2.height*k/2,cnv2.width*k,cnv2.height*k);	
				
				//var v=document.getElementById("barcode");
				//ctx.drawImage(v,(canvas.width)/2-84*k/2,(canvas.height)/2-84*k/2,84*k,84*k);
			
			var 
				parts = canvas.toDataURL().match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/),
				binStr = atob(parts[3]),
				buf = new ArrayBuffer(binStr.length),
				view = new Uint8Array(buf);
			for (var i = 0; i < view.length; i++){view[i] = binStr.charCodeAt(i);};
  			return new Blob([view], {'type': parts[1]});
  		};

		var fn = {
			loadImage:function(src){
				var img = new Image();				
				img.onload = function(){
					var canvas = document.createElement('canvas');
					canvas.width = this.width; canvas.height = this.height;
					var ctx = canvas.getContext('2d'); ctx.drawImage(this,0,0,this.width,this.height);
					fn.saveImage(canvas);
				};
				//@3T
				if(_this.options.crossOrigin){img.crossOrigin="Anonymous";};
				img.src = src;
			},
			saveImage:function(canvas){
	    		var URL = window.URL || webkitURL;
				var a = document.createElement('a');
				var blob = canvas2Blob(canvas);
				a.download = "beta.vn.png";
				a.href = URL.createObjectURL(blob);
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);				
				setTimeout(function(){
					URL.revokeObjectURL(blob);
				},100);
			},
			showMenu:function(){
				_this.$gSaveMenu.toggle();
			}
		};

		var
			isFirstPage = this.CURRENT.spread == 0,	
			isLastPage = this.CURRENT.spread == this.getTotalSheets(),
			arrSrc = this.ARR_PAGES_SRC;

		if(isFirstPage){
			fn.loadImage(arrSrc[0]);
		}else if(isLastPage){
			fn.loadImage(arrSrc[arrSrc.length-1]);
		}else{
			_this.$gSaveMenu.find('a').unbind().each(function(i){
				$(this).click(function(){
					var index = i?_this.CURRENT.spread*2:_this.CURRENT.spread*2-1;
					arrSrc[index] && fn.loadImage(arrSrc[index]);					
					fn.showMenu();
					return false;
				})	
			});			
			fn.showMenu();
		}

	}

};

var OneBookEditor = {

	init:function(options){
		
		this.MATH = OneBookEditorMath.init();
		this.onReady = options.onReady;
		this.ARR_ANIMATIONS = [];
		this.CURRENT_FLIP_NAME = options.flip||'';
		
		this.FLIP_NAMES = [];
		this.CURRENT_KEYFRAME = 1;
		this.CURRENT_LINE = 0;
		this.CFG = {
			SPEED_ANIMATION:15,
			BOOK_HEIGHT:300,
			YSCALETOP:0.3,
			YSCALE:0.08,
			BEZIE_ROUGH:window[G_DATA].GLOSSY?10:4,
			BOOK_ROTATE_X:0,
			ARR_BOOK_WIDTH:[]
		};


		this.ARR_ANI = [
			'<div id="animations" style="display:none;">',
			'<div class="book" name="basic">',
				'<div class="points" xy="-40,0 -60,0 -80,0 -80,0 -120,0"></div>',
				'<div class="frame" fr="0" ang="0 0 0 0 0"></div>',
				'<div class="frame" fr="30" ang="100 15 5 5 -30"></div>',
				'<div class="frame" fr="60" ang="140 120 40 40 -30"></div>',
				'<div class="frame" fr="80" ang="130 145 195 195 190"></div>',
				'<div class="frame" fr="100" ang="180 180 180 180 180"></div>',
			'</div>',			
			'<div class="book" name="soft">',
				'<div class="points" xy="-40,0 -60,0 -80,0 -80,0 -120,0"></div>',
				'<div class="frame" fr="0" ang="0 0 0 0 0"></div>',
				'<div class="frame" fr="30" ang="95 60 10 10 -50"></div>',
				'<div class="frame" fr="60" ang="150 145 60 60 -30"></div>',
				'<div class="frame" fr="80" ang="175 170 105 105 60"></div>',
				'<div class="frame" fr="100" ang="180 180 180 180 180"></div>',
			'</div>'
			].join('');		
		this.load_animations_from_html();
	},	
	load_animations_from_html:function(){
		var _this=this;
		var calculate_book_width = function(POINTS){
			var width = 0;
			for(var n=0;n<POINTS.length;n++){
				width+=	POINTS[n][0];
			};
			width = width<0?width*-1:width;
			return width;
		};
		$(this.ARR_ANI).find('.book').each(function(){
			var KEY_FRAMES = [];
			var name =  $(this).attr('name');
			var POINTS = $(this).find('.points').attr('xy').split(' ')
			.map(function(allpoints){
					return allpoints.split(',')
					.map( function(point){ return parseInt(point); } );
			});
			$(this).find('.frame').each(function(i){
				var fr = parseInt($(this).attr('fr'),10);
				var arrang = $(this).attr('ang').split(' ').map(function(ang){return parseInt(ang);});
				var KF = {frame:fr,line:[]};
				for(var n=0;n<POINTS.length;n++){
					KF.line[n] = {xy:POINTS[n],ang:arrang[n],center:[0,0]};
				};
				KEY_FRAMES.push(KF);
			});
			_this.CFG.ARR_BOOK_WIDTH.push(calculate_book_width(POINTS));
			_this.FLIP_NAMES.push(name);
			_this.ARR_ANIMATIONS[name] = KEY_FRAMES;
		});
		
		
		this.CURRENT_FLIP_NAME = $.inArray(this.CURRENT_FLIP_NAME,this.FLIP_NAMES)!==-1?this.CURRENT_FLIP_NAME:this.FLIP_NAMES[0];
		
		var data  = window[G_DATA].FLIPS[this.CURRENT_FLIP_NAME];
		data?this.onReady(data):this.rebuild();
			
	},
	rebuild:function(){
		

		
		var KEY_FRAMES = this.ARR_ANIMATIONS[this.CURRENT_FLIP_NAME];
		this.FIRST_KEYFRAME = KEY_FRAMES[0].frame;

		var ALL_FRAMES = this.buildAllFramesFrom(KEY_FRAMES);
		this.ALL_FRAMES = this.calculateCenters(ALL_FRAMES);

		this.calculateBezie();
		this.calculateEdgeSkewY();
		
		this.CFG.AMOUNT_ADGES_3D = this.ALL_FRAMES[0].edges3d.length;

		var ALL_FRAMES2 = [];
		for(var i=0;i<this.ALL_FRAMES.length;i++){
			var fr = this.ALL_FRAMES[i];
			var edges3d = [];
			for(var n=0;n<fr.edges3d.length;n++){
				edges3d[n] = {
					angle:180-fr.edges3d[n].angle,
					width:fr.edges3d[n].width,
					x:fr.edges3d[n].x*-1,
					z:fr.edges3d[n].z
				};
			};
			ALL_FRAMES2.push({
				bezie:fr.bezie,
				edges3d:edges3d,
				frame:fr.frame,
				keyframe:fr.keyframe,
				line:fr.line,
				skewYbottom:fr.skewYbottom,
				skewYtop:fr.skewYtop
			});
		};
		
		var data = [this.ALL_FRAMES,ALL_FRAMES2];
		window[G_DATA].FLIPS[this.CURRENT_FLIP_NAME] = data;
		this.onReady(data);
	},

	buildAllFramesFrom:function(KF){
		var KF = KF;
		var AF = [];
		if(KF.length<1)return [];
		for(var i=0;i<KF.length;i++){
			AF[KF[i].frame] = $.extend(true,{},KF[i]);
			AF[KF[i].frame].keyframe = true;
		};
		for(var i=1;i<KF.length;i++){
			var from = KF[i-1];
			var to = KF[i];
			var amount = to.frame-from.frame;
			for(var frame=1;frame<amount;frame++){
				var number_of_frame = from.frame+frame;
				var newline = [];
				for(var p=0;p < to.line.length;p++){
					var ang = Math.floor( (to.line[p].ang-from.line[p].ang) / amount * frame + from.line[p].ang );
					var xy = [to.line[p].xy[0],to.line[p].xy[1]];
					newline.push({xy:xy,ang:ang,center:[0,0]});
				};
				AF[number_of_frame] = {frame:number_of_frame,line:newline};
			}
		};
		return AF;
	},

	calculateCenters:function(AF){
		var _this=this;
		var AF = AF;
		$.each(AF,function(i){
			if(i<_this.FIRST_KEYFRAME){return;}
			var line = this.line;
			for (var i=0;i<line.length;i++){
				var ang = line[i].ang;
				var sign = ang>0?1:-1; 
				var angle = ang*sign; 
				var center = line[i].center;
				var matrix = [_this.MATH.COS[angle],sign*-_this.MATH.SIN[angle],center[0],
							 sign*_this.MATH.SIN[angle],_this.MATH.COS[angle],center[1]];
				var xy = line[i].xy ;
				var new_xy = _this.MATH.xy_matrix2d(xy,matrix);
				line[i].xy = new_xy;
				if(line[i+1]){line[i+1].center = new_xy};
			};
		});
		return AF;
	},

	calculateBezie:function(){

		var _this=this;
		var AF = this.ALL_FRAMES;
		var rough = this.CFG.BEZIE_ROUGH;
		$.each(AF,function(i){
		var lns = this.line;
		if(lns.length<3){return;};
		var bezie_points=[{x:0,y:0}], t=0, newX=0, newY=0, P0=[0,0], P1=lns[0].xy, P2=lns[1].xy, P3=lns[2].xy;
			for(var n=1;n<rough;n++){
				t = 1/rough*n;
				newX = (1-t)*(1-t)*(1-t)*P0[0]  +  3*t*(1-t)*(1-t)*P1[0]  +  3*t*t*(1-t)*P2[0]  +  t*t*t*P3[0];
				newY = (1-t)*(1-t)*(1-t)*P0[1]  +  3*t*(1-t)*(1-t)*P1[1]  +  3*t*t*(1-t)*P2[1]  +  t*t*t*P3[1];
				bezie_points.push({x:newX,y:newY});
			};
			bezie_points.push({x:P3[0],y:P3[1]});
		if(lns.length===5 || lns.length>5){
		var t=0, newX=0, newY=0, P0=lns[2].xy, P1=lns[3].xy, P2=lns[4].xy;
			for(var n=1;n<rough;n++){
				t = 1/rough*n;
				newX = (1-t)*(1-t)*P0[0]  +  2*t*(1-t)*P1[0]  +  t*t*P2[0];
				newY = (1-t)*(1-t)*P0[1]  +  2*t*(1-t)*P1[1]  +  t*t*P2[1];
				bezie_points.push({x:newX,y:newY});
			};
			bezie_points.push({x:P2[0],y:P2[1]});
		};
		this.bezie = bezie_points;
		});
		this.ALL_FRAMES = AF;
	},

	calculateEdgeSkewY:function(){
		var _this=this;
		var BOOK_HEIGHT = this.CFG.BOOK_HEIGHT;
		var YSCALE = this.CFG.YSCALE;
		var YSCALETOP = this.CFG.YSCALETOP;
		var AF = this.ALL_FRAMES;

		$.each(AF,function(i){
			var edge = this.bezie;
			var skewYtop = [];
			var skewYbottom = [];
			var edges3d = [];

			for(var n=0;n<edge.length-1;n++){
				var p1,p2,y1top,y2top;
				
				p1=edge[n];
				p2=edge[n+1];
				
				var width = Math.sqrt((p2.y-p1.y)*(p2.y-p1.y)+(p2.x-p1.x)*(p2.x-p1.x));
				var angle = ((Math.atan2(p2.y-p1.y,p2.x-p1.x))*180/Math.PI).toFixed(15);
				edges3d.push({x:p1.x,z:p1.y,width:width,angle:angle});
				
				y1top = p1.y*YSCALETOP-BOOK_HEIGHT;
				y2top = p2.y*YSCALETOP-BOOK_HEIGHT;
				skewYtop.push( ((Math.atan2(y2top-y1top,p2.x-p1.x))*180/Math.PI).toFixed(15));

				y1bottom = p1.y*YSCALE-BOOK_HEIGHT;
				y2bottom = p2.y*YSCALE-BOOK_HEIGHT;
				skewYbottom.push( ((Math.atan2(y2bottom-y1bottom,p2.x-p1.x))*180/Math.PI).toFixed(15));
			};
			this.edges3d = edges3d;
			this.skewYtop = skewYtop;
			this.skewYbottom = skewYbottom;
		});
		this.ALL_FRAMES = AF;
	},

	get_total_keyframes:function(){
		var keyframes = this.ARR_ANIMATIONS[this.CURRENT_ANIMATION];
		return keyframes.length;
	},
	get_total_lines:function(){
		var totalLines = this.ALL_FRAMES[this.FIRST_KEYFRAME].line;
		return totalLines.length;
	}
};
	

var OneBookEditorMath = {
	init:function(){
		this.SIN = [];
		this.COS = [];
		this._calculate();
		return this;
	},	
	_calculate:function(){
		for(var i=0;i<360;i++){this.SIN[i] = Math.sin(i*Math.PI/180).toFixed(15)};
		for(var i=0;i<360;i++){this.COS[i] = Math.cos(i*Math.PI/180).toFixed(15)};		
		(function(fn){
			if(!fn.map){fn.map= function(f){ var len=this.length;var res = new Array(len);for(var i=0;i<len;i++){if(i in this){res[i]=f.call(false,this[i],i,this)}};return res;}}
		})(Array.prototype);
	},
	xy_matrix2d:function(xy,matrix){
		var v = xy; v.push(1);
		var m = matrix;	
		return [
			m[0]*v[0]+m[1]*v[1]+m[2]*v[2],
			m[3]*v[0]+m[4]*v[1]+m[5]*v[2]
		]
	}	
};	

	var wholeBooks = window[G_DATA].NUMBER;
	window[G_DATA].NUMBER +=1;
	window[G_DATA].queueBooksBuilding.push({arrSrc:arrSrc,options:options,target:target});
	if(!wholeBooks || !window[G_DATA].buildingNowFlag){
		window[G_DATA].buildNextBook();
	};

	return this;

};
})(HT);

      
      
      
			//blogText.jss
			/*
			 *  blogText - Drawing with Text.
			 *  - Ported from demo in Generative Design book - http://www.generative-gestaltung.de
			 *  - generative-gestalung.de original licence: http://www.apache.org/licenses/LICENSE-2.0
			 *
			 *  - Modified and maintained by Tim Holman - tholman.com - @twholman
			 */
			function blogText() {
				var _this = this;
				// Application variables
				position = {
					x: 0,
					y: window.innerHeight / 2
				};
				textIndex = 0;
				this.textColor = "#000000";
				this.bgColor = "#ffffff";
				this.minFontSize = 8;
				this.maxFontSize = 300;
				this.angleDistortion = 0.01;
				this.text = window.description;
				// Drawing Variables
				canvas = null;
				context = null;
				mouse = {
					x: 0,
					y: 0,
					down: false
				};
				bgCanvas = null;
				bgContext = null;
				this.initialize = function() {
					canvas = document.getElementById('blog');
					context = canvas.getContext('2d');
					context.globalAlpha = 0.2;
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;
					canvas.addEventListener('mousemove', mouseMove, false);
					canvas.addEventListener('mousedown', mouseDown, false);
					canvas.addEventListener('mouseup', mouseUp, false);
					canvas.addEventListener('mouseout', mouseUp, false);
					bgCanvas = document.createElement('canvas');
					bgContext = bgCanvas.getContext('2d');
					bgCanvas.width = canvas.width;
					bgCanvas.height = canvas.height;
					_this.setBackground(_this.bgColor);
					window.onresize = function(event) {
						canvas.width = window.innerWidth;
						canvas.height = window.innerHeight;
						bgCanvas.width = window.innerWidth;
						bgCanvas.height = window.innerHeight;
						_this.setBackground(_this.bgColor);
						_this.clear();
					}
					update();
				};
				var mouseMove = function(event) {
					mouse.x = event.pageX;
					mouse.y = event.pageY;
					draw();
				};
				var update = function() {
					requestAnimationFrame(update);
					draw();
				}
				var draw = function() {
					if (mouse.down) {
						var newDistance = distance(position, mouse);
						var fontSize = _this.minFontSize + newDistance / 2;
						if (fontSize > _this.maxFontSize) {
							fontSize = _this.maxFontSize;
						}
						var letter = _this.text[textIndex];
						var stepSize = textWidth(letter, fontSize);
						if (newDistance > stepSize) {
							var angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);
							context.font = fontSize + "px Georgia";
							context.save();
							context.translate(position.x, position.y);
							context.rotate(angle + (Math.random() * (_this.angleDistortion * 2) - _this.angleDistortion));
							context.fillText(letter, 0, 0);
							context.restore();
							textIndex++;
							if (textIndex > _this.text.length - 1) {
								textIndex = 0;
							}
							position.x = position.x + Math.cos(angle) * stepSize;
							position.y = position.y + Math.sin(angle) * stepSize;
						}
					}
				};
				var distance = function(pt, pt2) {
					var xs = 0;
					var ys = 0;
					xs = pt2.x - pt.x;
					xs = xs * xs;
					ys = pt2.y - pt.y;
					ys = ys * ys;
					return Math.sqrt(xs + ys);
				};
				var mouseDown = function(event) {
					mouse.down = true;
					position.x = event.pageX;
					position.y = event.pageY;
				}
				var mouseUp = function(event) {
					mouse.down = false;
				}
				var textWidth = function(string, size) {
					context.font = size + "px Georgia";
					if (context.fillText) {
						return context.measureText(string).width;
					} else if (context.mozDrawText) {
						return context.mozMeasureText(string);
					}
				};
				this.clear = function() {
					canvas.width = canvas.width;
					context.fillStyle = _this.textColor;
				}
				this.applyNewColor = function(value) {
					_this.textColor = value;
					context.fillStyle = _this.textColor;
				}
				this.setBackground = function(value) {
					_this.bgColor = value;
					canvas.style.backgroundColor = value;
				};
				this.onTextChange = function() {
					textIndex = 0;
				}
				this.save = function() {
					// Prepare the background canvas's color
					bgContext.rect(0, 0, bgCanvas.width, bgCanvas.height);
					bgContext.fillStyle = _this.bgColor;
					bgContext.fill();
					// Draw the front canvas onto the bg canvas
					bgContext.drawImage(canvas, 0, 0);
					// Open in a new window
					window.open(bgCanvas.toDataURL('image/png'), 'mywindow');
				}
			};
			//tSecret.jss
			/*!
			 * forkit.js 0.2
			 * http://lab.hakim.se/forkit-js
			 * MIT licensed
			 *
			 * Created by Hakim El Hattab, http://hakim.se
			 */
			(function() {
				var STATE_CLOSED = 0,
					STATE_DETACHED = 1,
					STATE_OPENED = 2,
					TAG_HEIGHT = 30,
					TAG_WIDTH = 200,
					MAX_STRAIN = 40,
					// Factor of page height that needs to be dragged for the
					// curtain to fall
					DRAG_THRESHOLD = 0.36;
				VENDORS = ['Webkit', 'Moz', 'O', 'ms'];
				var dom = {
						ribbon: null,
						ribbonString: null,
						ribbonTag: null,
						curtain: null,
						closeButton: null,
						saveButton: null
					},
					// The current state of the ribbon
					state = STATE_CLOSED,
					// Ribbon text, correlates to states
					closedText = '',
					detachedText = '',
					friction = 1.04;
				gravity = 1.5,
					// Resting position of the ribbon when curtain is closed
					closedX = TAG_WIDTH * 0.4,
					closedY = -TAG_HEIGHT * 0.5,
					// Resting position of the ribbon when curtain is opened
					openedX = TAG_WIDTH * 0.4,
					openedY = TAG_HEIGHT,
					velocity = 0,
					rotation = 45,
					curtainTargetY = 0,
					curtainCurrentY = 0,
					dragging = false,
					dragTime = 0,
					dragY = 0,
					anchorA = new Point(closedX, closedY),
					anchorB = new Point(closedX, closedY),
					mouse = new Point();
				window.initTSecret = function() {
					dom.ribbon = document.querySelector('.tSecret');
					dom.curtain = document.querySelector('.tSecret-3D');
					dom.closeButton = document.querySelector('.tSecret-3D .close-button');
					dom.saveButton = document.querySelector('.tSecret-3D .save-button');
					if (dom.ribbon) {
						// Fetch label texts from DOM
						closedText = '\u24C7 | ' + dom.ribbon.getAttribute('data-text') || '';
						detachedText = dom.ribbon.getAttribute('data-text-detached') || closedText;
						// Construct the sub-elements required to represent the
						// tag and string that it hangs from
						dom.ribbon.innerHTML = '<span class="string"></span><span class="tag">' + closedText + '</span>';
						dom.ribbonString = dom.ribbon.querySelector('.string');
						dom.ribbonTag = dom.ribbon.querySelector('.tag');
						// Bind events
						dom.ribbon.addEventListener('click', onRibbonClick, false);
						document.addEventListener('mousemove', onMouseMove, false);
						document.addEventListener('mousedown', onMouseDown, false);
						document.addEventListener('mouseup', onMouseUp, false);
						document.addEventListener('touchstart', onTouchStart, false);
						document.addEventListener('touchmove', onTouchMove, false);
						document.addEventListener('touchend', onTouchEnd, false);
						window.addEventListener('resize', layout, false);
						if (dom.closeButton) {
							dom.closeButton.addEventListener('click', onCloseClick, false);
						}
						if (dom.saveButton) {
							dom.saveButton.addEventListener('click', onSaveClick, false);
						}
						// Start the animation loop
						animateTSecret();
					}
				}

				function onMouseDown(event) {
					if (dom.curtain && state === STATE_DETACHED) {
						event.preventDefault();
						dragY = event.clientY;
						dragTime = Date.now();
						dragging = true;
					}
				}

				function onMouseMove(event) {
					mouse.x = event.clientX;
					mouse.y = event.clientY;
				}

				function onMouseUp(event) {
					if (state !== STATE_OPENED) {
						state = STATE_CLOSED;
						dragging = false;
					}
				}

				function onTouchStart(event) {
					if (dom.curtain && state === STATE_DETACHED) {
						event.preventDefault();
						var touch = event.touches[0];
						dragY = touch.clientY;
						dragTime = Date.now();
						dragging = true;
					}
				}

				function onTouchMove(event) {
					var touch = event.touches[0];
					mouse.x = touch.pageX;
					mouse.y = touch.pageY;
				}

				function onTouchEnd(event) {
					if (state !== STATE_OPENED) {
						state = STATE_CLOSED;
						dragging = false;
					}
				}

				function onRibbonClick(event) {
					if (dom.curtain) {
						event.preventDefault();
						if (state === STATE_OPENED) {
							close();
						} else if (Date.now() - dragTime < 300) {
							open();
						}
					}
				}

				function onCloseClick(event) {
					event.preventDefault();
					close();
				}

				function onSaveClick(event) {
					event.preventDefault();
					//@3T
					//close();
					window.blogT.save();
				}

				function layout() {
					if (state === STATE_OPENED) {
						curtainTargetY = window.innerHeight;
						curtainCurrentY = curtainTargetY;
					}
				}

				function open() {
					dragging = false;
					state = STATE_OPENED;
					//@3T
					$('#article').fadeOut();
					$('#container').fadeIn();
					$('#footer').fadeOut();
					dispatchEvent('tSecret-open');
				}

				function close() {
					dragging = false;
					state = STATE_CLOSED;
					dom.ribbonTag.innerHTML = closedText;
					//@3T
					$('#article').fadeIn('200');
					$('#container').fadeOut();
					$('#footer').fadeIn();
					dispatchEvent('tSecret-close');
				}

				function detach() {
					state = STATE_DETACHED;
					dom.ribbonTag.innerHTML = '© ' + detachedText;
				}

				function animateTSecret() {
					updateTSecret();
					renderTSecret();
					if (state === STATE_DETACHED) {
						hlLogo.opacity = 0;
					} else hlLogo.opacity = 1;
					requestAnimFrame(animateTSecret);
				}

				function updateTSecret() {
					// Distance between mouse and top right corner
					var distance = distanceBetween(mouse.x, mouse.y, window.innerWidth, 0);
					// If we're OPENED the curtainTargetY should ease towards page bottom
					if (state === STATE_OPENED) {
						curtainTargetY = Math.min(curtainTargetY + (window.innerHeight - curtainTargetY) * 0.2, window.innerHeight);
					} else {
						// Detach the tag when hovering close enough
						if (distance < TAG_WIDTH * 1.5) {
							detach();
						}
						// Re-attach the tag if the user moved away
						else if (!dragging && state === STATE_DETACHED && distance > TAG_WIDTH * 2) {
							close();
						}
						if (dragging) {
							// Updat the curtain position while dragging
							curtainTargetY = Math.max(mouse.y - dragY, 0);
							// If the threshold is crossed, open the curtain
							if (curtainTargetY > window.innerHeight * DRAG_THRESHOLD) {
								open();
							}
						} else {
							curtainTargetY *= 0.8;
						}
					}
					// Ease towards the target position of the curtain
					curtainCurrentY += (curtainTargetY - curtainCurrentY) * 0.3;
					// If we're dragging or detached we need to simulate
					// the physical behavior of the ribbon
					if (dragging || state === STATE_DETACHED) {
						// Apply forces
						velocity /= friction;
						velocity += gravity;
						var containerOffsetX = dom.ribbon.offsetLeft;
						var offsetX = Math.max(((mouse.x - containerOffsetX) - closedX) * 0.2, -MAX_STRAIN);
						anchorB.x += ((closedX + offsetX) - anchorB.x) * 0.1;
						anchorB.y += velocity;
						var strain = distanceBetween(anchorA.x, anchorA.y, anchorB.x, anchorB.y);
						if (strain > MAX_STRAIN) {
							velocity -= Math.abs(strain) / (MAX_STRAIN * 1.25);
						}
						var dy = Math.max(mouse.y - anchorB.y, 0),
							dx = mouse.x - (containerOffsetX + anchorB.x);
						// Angle the ribbon towards the mouse but limit it avoid extremes
						var angle = Math.min(130, Math.max(50, Math.atan2(dy, dx) * 180 / Math.PI));
						rotation += (angle - rotation) * 0.1;
					}
					// Ease ribbon towards the OPENED state
					else if (state === STATE_OPENED) {
						anchorB.x += (openedX - anchorB.x) * 0.2;
						anchorB.y += (openedY - anchorB.y) * 0.2;
						rotation += (90 - rotation) * 0.02;
					}
					// Ease ribbon towards the CLOSED state
					else {
						anchorB.x += (anchorA.x - anchorB.x) * 0.2;
						anchorB.y += (anchorA.y - anchorB.y) * 0.2;
						rotation += (45 - rotation) * 0.2;
					}
				}

				function renderTSecret() {
					if (dom.curtain) {
						dom.curtain.style.top = -100 + Math.min((curtainCurrentY / window.innerHeight) * 100, 100) + '%';
					}
					dom.ribbon.style[prefix('transform')] = transform(0, curtainCurrentY, 0);
					dom.ribbonTag.style[prefix('transform')] = transform(anchorB.x, anchorB.y, rotation);
					var dy = anchorB.y - anchorA.y,
						dx = anchorB.x - anchorA.x;
					var angle = Math.atan2(dy, dx) * 180 / Math.PI;
					dom.ribbonString.style.width = anchorB.y + 'px';
					dom.ribbonString.style[prefix('transform')] = transform(anchorA.x, 0, angle);
				}

				function prefix(property, el) {
					var propertyUC = property.slice(0, 1).toUpperCase() + property.slice(1);
					for (var i = 0, len = VENDORS.length; i < len; i++) {
						var vendor = VENDORS[i];
						if (typeof(el || document.body).style[vendor + propertyUC] !== 'undefined') {
							return vendor + propertyUC;
						}
					}
					return property;
				}

				function transform(x, y, r) {
					return 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)';
				}

				function distanceBetween(x1, y1, x2, y2) {
					var dx = x1 - x2;
					var dy = y1 - y2;
					return Math.sqrt(dx * dx + dy * dy);
				}

				function dispatchEvent(type) {
						var event = document.createEvent('HTMLEvents', 1, 2);
						event.initEvent(type, true, true);
						dom.ribbon.dispatchEvent(event);
					}
					/**
					 * Defines a 2D position.
					 */
				function Point(x, y) {
					this.x = x || 0;
					this.y = y || 0;
				}
				Point.prototype.distanceTo = function(x, y) {
					var dx = x - this.x;
					var dy = y - this.y;
					return Math.sqrt(dx * dx + dy * dy);
				};
				Point.prototype.clone = function() {
					return new Point(this.x, this.y);
				};
				Point.prototype.interpolate = function(x, y, amp) {
					this.x += (x - this.x) * amp;
					this.y += (y - this.y) * amp;
				};
				window.requestAnimFrame = (function() {
					return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
						window.setTimeout(callback, 1000 / 60);
					};
				})();
				//initTSecret();
			})();
			//bird.jss
			/*var */
			Bird = function() {
				var scope = this;
				THREE.Geometry.call(this);
				v(5, 0, 0);
				v(-5, -2, 1);
				v(-5, 0, 0);
				v(-5, -2, -1);
				v(0, 2, -6);
				v(0, 2, 6);
				v(2, 0, 0);
				v(-3, 0, 0);
				f3(0, 2, 1);
				// f3( 0, 3, 2 );
				f3(4, 7, 6);
				f3(5, 6, 7);
				this.computeFaceNormals();

				function v(x, y, z) {
					scope.vertices.push(new THREE.Vector3(x, y, z));
				}

				function f3(a, b, c) {
					scope.faces.push(new THREE.Face3(a, b, c));
				}
			}
			Bird.prototype = Object.create(THREE.Geometry.prototype);
			//boid.jss
			/*var */
			Boid = function() {
					var vector = new THREE.Vector3(),
						_acceleration, _width = 500,
						_height = 500,
						_depth = 200,
						_goal, _neighborhoodRadius = 100,
						_maxSpeed = 4,
						_maxSteerForce = 0.1,
						_avoidWalls = false;
					this.position = new THREE.Vector3();
					this.velocity = new THREE.Vector3();
					_acceleration = new THREE.Vector3();
					this.setGoal = function(target) {
						_goal = target;
					}
					this.setAvoidWalls = function(value) {
						_avoidWalls = value;
					}
					this.setWorldSize = function(width, height, depth) {
						_width = width;
						_height = height;
						_depth = depth;
					}
					this.run = function(boids) {
						if (_avoidWalls) {
							vector.set(-_width, this.position.y, this.position.z);
							vector = this.avoid(vector);
							vector.multiplyScalar(5);
							_acceleration.add(vector);
							vector.set(_width, this.position.y, this.position.z);
							vector = this.avoid(vector);
							vector.multiplyScalar(5);
							_acceleration.add(vector);
							vector.set(this.position.x, -_height, this.position.z);
							vector = this.avoid(vector);
							vector.multiplyScalar(5);
							_acceleration.add(vector);
							vector.set(this.position.x, _height, this.position.z);
							vector = this.avoid(vector);
							vector.multiplyScalar(5);
							_acceleration.add(vector);
							vector.set(this.position.x, this.position.y, -_depth);
							vector = this.avoid(vector);
							vector.multiplyScalar(5);
							_acceleration.add(vector);
							vector.set(this.position.x, this.position.y, _depth);
							vector = this.avoid(vector);
							vector.multiplyScalar(5);
							_acceleration.add(vector);
						}
						/* else {

									this.checkBounds();

								}
								*/
						if (Math.random() > 0.5) {
							this.flock(boids);
						}
						this.move();
					}
					this.flock = function(boids) {
						if (_goal) {
							_acceleration.add(this.reach(_goal, 0.005));
						}
						_acceleration.add(this.alignment(boids));
						_acceleration.add(this.cohesion(boids));
						_acceleration.add(this.separation(boids));
					}
					this.move = function() {
						this.velocity.add(_acceleration);
						var l = this.velocity.length();
						if (l > _maxSpeed) {
							this.velocity.divideScalar(l / _maxSpeed);
						}
						this.position.add(this.velocity);
						_acceleration.set(0, 0, 0);
					}
					this.checkBounds = function() {
							if (this.position.x > _width) this.position.x = -_width;
							if (this.position.x < -_width) this.position.x = _width;
							if (this.position.y > _height) this.position.y = -_height;
							if (this.position.y < -_height) this.position.y = _height;
							if (this.position.z > _depth) this.position.z = -_depth;
							if (this.position.z < -_depth) this.position.z = _depth;
						}
						//
					this.avoid = function(target) {
						var steer = new THREE.Vector3();
						steer.copy(this.position);
						steer.sub(target);
						steer.multiplyScalar(1 / this.position.distanceToSquared(target));
						return steer;
					}
					this.repulse = function(target) {
						var distance = this.position.distanceTo(target);
						if (distance < 150) {
							var steer = new THREE.Vector3();
							steer.subVectors(this.position, target);
							steer.multiplyScalar(0.5 / distance);
							_acceleration.add(steer);
						}
					}
					this.reach = function(target, amount) {
						var steer = new THREE.Vector3();
						steer.subVectors(target, this.position);
						steer.multiplyScalar(amount);
						return steer;
					}
					this.alignment = function(boids) {
						var boid, velSum = new THREE.Vector3(),
							count = 0;
						for (var i = 0, il = boids.length; i < il; i++) {
							if (Math.random() > 0.6) continue;
							boid = boids[i];
							distance = boid.position.distanceTo(this.position);
							if (distance > 0 && distance <= _neighborhoodRadius) {
								velSum.add(boid.velocity);
								count++;
							}
						}
						if (count > 0) {
							velSum.divideScalar(count);
							var l = velSum.length();
							if (l > _maxSteerForce) {
								velSum.divideScalar(l / _maxSteerForce);
							}
						}
						return velSum;
					}
					this.cohesion = function(boids) {
						var boid, distance,
							posSum = new THREE.Vector3(),
							steer = new THREE.Vector3(),
							count = 0;
						for (var i = 0, il = boids.length; i < il; i++) {
							if (Math.random() > 0.6) continue;
							boid = boids[i];
							distance = boid.position.distanceTo(this.position);
							if (distance > 0 && distance <= _neighborhoodRadius) {
								posSum.add(boid.position);
								count++;
							}
						}
						if (count > 0) {
							posSum.divideScalar(count);
						}
						steer.subVectors(posSum, this.position);
						var l = steer.length();
						if (l > _maxSteerForce) {
							steer.divideScalar(l / _maxSteerForce);
						}
						return steer;
					}
					this.separation = function(boids) {
						var boid, distance,
							posSum = new THREE.Vector3(),
							repulse = new THREE.Vector3();
						for (var i = 0, il = boids.length; i < il; i++) {
							if (Math.random() > 0.6) continue;
							boid = boids[i];
							distance = boid.position.distanceTo(this.position);
							if (distance > 0 && distance <= _neighborhoodRadius) {
								repulse.subVectors(this.position, boid.position);
								repulse.normalize();
								repulse.divideScalar(distance);
								posSum.add(repulse);
							}
						}
						return posSum;
					}
				}
				//blog.jss
			var SCREEN_WIDTH = window.innerWidth,
				SCREEN_HEIGHT = window.innerHeight,
				SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2,
				SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;
			var camera, scene, renderer,
				birds, bird;
			var boid, boids;

			function initBird() {
				camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
				camera.position.z = 450;
				scene = new THREE.Scene();
				birds = [];
				boids = [];
				for (var i = 0; i < 200; i++) {
					boid = boids[i] = new Boid();
					boid.position.x = Math.random() * 400 - 200;
					boid.position.y = Math.random() * 400 - 200;
					boid.position.z = Math.random() * 400 - 200;
					boid.velocity.x = Math.random() * 2 - 1;
					boid.velocity.y = Math.random() * 2 - 1;
					boid.velocity.z = Math.random() * 2 - 1;
					boid.setAvoidWalls(true);
					boid.setWorldSize(500, 500, 400);
					bird = birds[i] = new THREE.Mesh(new Bird(), new THREE.MeshBasicMaterial({
						color: Math.random() * 0xffffff,
						side: THREE.DoubleSide
					}));
					bird.phase = Math.floor(Math.random() * 62.83);
					scene.add(bird);
				}
				//renderer = new THREE.CanvasRenderer();
				renderer = (Detector.webgl) ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
				renderer.setClearColor(0xffffff);
				renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				document.addEventListener('mousemove', onDocumentMouseMove, false);
				//document.body.appendChild( renderer.domElement );
				$("#footer").append(renderer.domElement);
				//
				window.addEventListener('resize', onWindowResize, false);
				$('.tSecret').css("z-index", "101");
				$(".minImage").remove();
			}

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}

			function onDocumentMouseMove(event) {
					var vector = new THREE.Vector3(event.clientX - SCREEN_WIDTH_HALF, -event.clientY + SCREEN_HEIGHT_HALF, 0);
					for (var i = 0, il = boids.length; i < il; i++) {
						boid = boids[i];
						vector.z = boid.position.z;
						boid.repulse(vector);
					}
				}
				//
			function animateBird() {
				requestAnimationFrame(animateBird);
				renderBird();
			}

			function renderBird() {
				for (var i = 0, il = birds.length; i < il; i++) {
					boid = boids[i];
					boid.run(boids);
					bird = birds[i];
					bird.position.copy(boids[i].position);
					color = bird.material.color;
					color.r = color.g = color.b = (500 - bird.position.z) / 1000;
					bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
					bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());
					bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
					bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
				}
				renderer.render(scene, camera);
			}    
    