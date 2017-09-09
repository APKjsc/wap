//'use strict';
//begin home.js page
var WLO, WLO = ((window.locationprotocol === 'https:') && (window === window.top) || (window.top.location.href = WLO = 'https://huu.vn'));
//alert(WLO)

var KEY = "luonghvabcdefijkmpqrstwxyzLUONGHVABCDEFIJKMPQRSTWXYZ2016345789+/=";
if(!window['License']) window['License'] = 'H1035298654';

//hteeml chuyen qua http:

var PI = 3.1416; //Math.PI;
var RAD = 0.0175; //Math.PI / 180;
var Rnd = Math.random;
var Sin = Math.sin;
var Asin = Math.asin;
var Cos = Math.cos;
var Sqrt = Math.sqrt;
var Floor = Math.floor;
var Atan2 = Math.atan2;
var Ceil = Math.ceil;
var Abs = Math.abs;
var Max = Math.max;
var Min = Math.min;

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

String.prototype.Min = function () {
  return (this.lastIndexOf(".") == this.indexOf(".")) ? this : this.substr(this.indexOf(".")+1)
};

String.prototype.Rnd = function () {
	if (locationprotocol !== 'https:') return parseInt(Math.random().toString().replace('.', ''));
	
	var s = this+window['locationhostname'].Min();
	var h = 0,
		i, c, l;
	for (i = s.length - 1; i >= 0; i--) {
		c = s.charCodeAt(i);
		h = ((h << 5) - h) + c;
		h = h & h;
	}
	return "H"+Math.abs(h);
};
	
String.prototype.trim || (String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, "")
});

var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
	window.setTimeout(callback, 30);
};
var cancelAnimFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (id) {
	window.clearTimeout(id);
};
var parsePositiveInt = function (value, defaultValue) {
	var output = parseInt(value, 10);
	return (output >= 0) ? output : defaultValue;
};

GLOBAL={
	title: "AQ | Friend",
	ideTitle: "AQ | ...",
	
    timeouts : [],//global timeout id arrays
    setTimeout : function(code,number){
        this.timeouts.push(setTimeout(code,number));
    },
    clearAllTimeout :function(){
        for (var i=0; i<this.timeouts.length; i++) {
            window.clearTimeout(this.timeouts[i]); // clear all the timeouts
        }
        this.timeouts= [];//empty the id array
    }
};


var visibilityChange = (function(){
	var stateKey, eventKey, keys = {
		hidden: "visibilitychange",
		webkitHidden: "webkitvisibilitychange",
		mozHidden: "mozvisibilitychange",
		msHidden: "msvisibilitychange"
	};
	for (stateKey in keys) {
		if (stateKey in document) {
			eventKey = keys[stateKey];
			break;
		}
	}
	return function(c) {
		if (c) {
			document.addEventListener(eventKey, c);
		}
		return !document[stateKey];
	}
})();

visibilityChange(function(){
	document.title = visibilityChange() ? GLOBAL.title : GLOBAL.ideTitle;
	console.log(new Date, 'visible ?', visibilityChange());
});

// to set the initial state
//document.title = visibilityChange() ? GLOBAL.title : GLOBAL.ideTitle;

//H.js
window['H'] = window['H'] || {
	KEY16: "0123456789ABCDEF",
	Cursor: function(){
		if(locationprotocol === 'https:' && window['locationhostname'].Min()==window['locationhostname'])
			//LHT
      //document.write('<div id="..."><img src="https://' + window['locationhostname'].Min() + '/img/box.gif" border="0" width="64px" height="64px" style="position:absolute;top:50%;left:50%;margin-right:-50%;transform:translate(-50%, -50%);"></div>')
      document.write('<div id="..."><img src="img/box.gif" border="0" width="64px" height="64px" style="position:absolute;top:50%;left:50%;margin-right:-50%;transform:translate(-50%, -50%);"></div>')
	},

	V: function() {
		var f = String.fromCharCode;
		var baseReverseDic = {};
		H.Cursor();
		function getBaseValue(alphabet, character) {
		  if (!baseReverseDic[alphabet]) {
			baseReverseDic[alphabet] = {};
			for (var i=0 ; i<alphabet.length ; i++) {
			  baseReverseDic[alphabet][alphabet.charAt(i)] = i;
			}
		  }
		  return baseReverseDic[alphabet][character];
		}

		var LZString = {
//autodelete code begin

		  compressToBase64 : function (input) {
			if (input == null) return "";
			var res = LZString._compress(input, 6, function(a){return KEY.charAt(a);});
			switch (res.length % 4) { // To produce valid Base64
			default: // When could this happen ?
			case 0 : return res;
			case 1 : return res+"===";
			case 2 : return res+"==";
			case 3 : return res+"=";
			}
		  },

		   _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
			if (uncompressed == null) return "";
			var i, value,
				context_dictionary= {},
				context_dictionaryToCreate= {},
				context_c="",
				context_wc="",
				context_w="",
				context_enlargeIn= 2, // Compensate for the first entry which should not count
				context_dictSize= 3,
				context_numBits= 2,
				context_data=[],
				context_data_val=0,
				context_data_position=0,
				ii;

			for (ii = 0; ii < uncompressed.length; ii += 1) {
			  context_c = uncompressed.charAt(ii);
			  if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
				context_dictionary[context_c] = context_dictSize++;
				context_dictionaryToCreate[context_c] = true;
			  }

			  context_wc = context_w + context_c;
			  if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
				context_w = context_wc;
			  } else {
				if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
				  if (context_w.charCodeAt(0)<256) {
					for (i=0 ; i<context_numBits ; i++) {
					  context_data_val = (context_data_val << 1);
					  if (context_data_position == bitsPerChar-1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					}
					value = context_w.charCodeAt(0);
					for (i=0 ; i<8 ; i++) {
					  context_data_val = (context_data_val << 1) | (value&1);
					  if (context_data_position == bitsPerChar-1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					  value = value >> 1;
					}
				  } else {
					value = 1;
					for (i=0 ; i<context_numBits ; i++) {
					  context_data_val = (context_data_val << 1) | value;
					  if (context_data_position ==bitsPerChar-1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					  value = 0;
					}
					value = context_w.charCodeAt(0);
					for (i=0 ; i<16 ; i++) {
					  context_data_val = (context_data_val << 1) | (value&1);
					  if (context_data_position == bitsPerChar-1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					  } else {
						context_data_position++;
					  }
					  value = value >> 1;
					}
				  }
				  context_enlargeIn--;
				  if (context_enlargeIn == 0) {
					context_enlargeIn = Math.pow(2, context_numBits);
					context_numBits++;
				  }
				  delete context_dictionaryToCreate[context_w];
				} else {
				  value = context_dictionary[context_w];
				  for (i=0 ; i<context_numBits ; i++) {
					context_data_val = (context_data_val << 1) | (value&1);
					if (context_data_position == bitsPerChar-1) {
					  context_data_position = 0;
					  context_data.push(getCharFromInt(context_data_val));
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = value >> 1;
				  }


				}
				context_enlargeIn--;
				if (context_enlargeIn == 0) {
				  context_enlargeIn = Math.pow(2, context_numBits);
				  context_numBits++;
				}
				// Add wc to the dictionary.
				context_dictionary[context_wc] = context_dictSize++;
				context_w = String(context_c);
			  }
			}

			// Output the code for w.
			if (context_w !== "") {
			  if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
				if (context_w.charCodeAt(0)<256) {
				  for (i=0 ; i<context_numBits ; i++) {
					context_data_val = (context_data_val << 1);
					if (context_data_position == bitsPerChar-1) {
					  context_data_position = 0;
					  context_data.push(getCharFromInt(context_data_val));
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
				  }
				  value = context_w.charCodeAt(0);
				  for (i=0 ; i<8 ; i++) {
					context_data_val = (context_data_val << 1) | (value&1);
					if (context_data_position == bitsPerChar-1) {
					  context_data_position = 0;
					  context_data.push(getCharFromInt(context_data_val));
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = value >> 1;
				  }
				} else {
				  value = 1;
				  for (i=0 ; i<context_numBits ; i++) {
					context_data_val = (context_data_val << 1) | value;
					if (context_data_position == bitsPerChar-1) {
					  context_data_position = 0;
					  context_data.push(getCharFromInt(context_data_val));
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = 0;
				  }
				  value = context_w.charCodeAt(0);
				  for (i=0 ; i<16 ; i++) {
					context_data_val = (context_data_val << 1) | (value&1);
					if (context_data_position == bitsPerChar-1) {
					  context_data_position = 0;
					  context_data.push(getCharFromInt(context_data_val));
					  context_data_val = 0;
					} else {
					  context_data_position++;
					}
					value = value >> 1;
				  }
				}
				context_enlargeIn--;
				if (context_enlargeIn == 0) {
				  context_enlargeIn = Math.pow(2, context_numBits);
				  context_numBits++;
				}
				delete context_dictionaryToCreate[context_w];
			  } else {
				value = context_dictionary[context_w];
				for (i=0 ; i<context_numBits ; i++) {
				  context_data_val = (context_data_val << 1) | (value&1);
				  if (context_data_position == bitsPerChar-1) {
					context_data_position = 0;
					context_data.push(getCharFromInt(context_data_val));
					context_data_val = 0;
				  } else {
					context_data_position++;
				  }
				  value = value >> 1;
				}


			  }
			  context_enlargeIn--;
			  if (context_enlargeIn == 0) {
				context_enlargeIn = Math.pow(2, context_numBits);
				context_numBits++;
			  }
			}

			// Mark the end of the stream
			value = 2;
			for (i=0 ; i<context_numBits ; i++) {
			  context_data_val = (context_data_val << 1) | (value&1);
			  if (context_data_position == bitsPerChar-1) {
				context_data_position = 0;
				context_data.push(getCharFromInt(context_data_val));
				context_data_val = 0;
			  } else {
				context_data_position++;
			  }
			  value = value >> 1;
			}

			// Flush the last char
			while (true) {
			  context_data_val = (context_data_val << 1);
			  if (context_data_position == bitsPerChar-1) {
				context_data.push(getCharFromInt(context_data_val));
				break;
			  }
			  else context_data_position++;
			}
			return context_data.join('');
		  },



//autodelete code end

		  L : function (input) {
			//inline decompress
			function _decompress(length, resetValue, getNextValue) {
				var dictionary = [],
					next,
					enlargeIn = 4,
					dictSize = 4,
					numBits = 3,
					entry = "",
					result = [],
					i,
					w,
					bits, resb, maxpower, power,
					c,
					data = {val:getNextValue(0), position:resetValue, index:1};

				for (i = 0; i < 3; i += 1) {
				  dictionary[i] = i;
				}

				bits = 0;
				maxpower = Math.pow(2,2);
				power=1;
				while (power!=maxpower) {
				  resb = data.val & data.position;
				  data.position >>= 1;
				  if (data.position == 0) {
					data.position = resetValue;
					data.val = getNextValue(data.index++);
				  }
				  bits |= (resb>0 ? 1 : 0) * power;
				  power <<= 1;
				}

				switch (next = bits) {
				  case 0:
					  bits = 0;
					  maxpower = Math.pow(2,8);
					  power=1;
					  while (power!=maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
						  data.position = resetValue;
						  data.val = getNextValue(data.index++);
						}
						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					  }
					c = f(bits);
					break;
				  case 1:
					  bits = 0;
					  maxpower = Math.pow(2,16);
					  power=1;
					  while (power!=maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
						  data.position = resetValue;
						  data.val = getNextValue(data.index++);
						}
						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					  }
					c = f(bits);
					break;
				  case 2:
					return "";
				}
				dictionary[3] = c;
				w = c;
				result.push(c);
				while (true) {
				  if (data.index > length) {
					return "";
				  }

				  bits = 0;
				  maxpower = Math.pow(2,numBits);
				  power=1;
				  while (power!=maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
					  data.position = resetValue;
					  data.val = getNextValue(data.index++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				  }

				  switch (c = bits) {
					case 0:
					  bits = 0;
					  maxpower = Math.pow(2,8);
					  power=1;
					  while (power!=maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
						  data.position = resetValue;
						  data.val = getNextValue(data.index++);
						}
						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					  }

					  dictionary[dictSize++] = f(bits);
					  c = dictSize-1;
					  enlargeIn--;
					  break;
					case 1:
					  bits = 0;
					  maxpower = Math.pow(2,16);
					  power=1;
					  while (power!=maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
						  data.position = resetValue;
						  data.val = getNextValue(data.index++);
						}
						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					  }
					  dictionary[dictSize++] = f(bits);
					  c = dictSize-1;
					  enlargeIn--;
					  break;
					case 2:
					  return result.join('');
				  }

				  if (enlargeIn == 0) {
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				  }

				  if (dictionary[c]) {
					entry = dictionary[c];
				  } else {
					if (c === dictSize) {
					  entry = w + w.charAt(0);
					} else {
					  return null;
					}
				  }
				  result.push(entry);

				  // Add w+entry[0] to the dictionary.
				  dictionary[dictSize++] = w + entry.charAt(0);
				  enlargeIn--;

				  w = entry;

				  if (enlargeIn == 0) {
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				  }

				}
			  }
			
			//base decompress
			if (input == null) return "";
			if (input == "") return null;
			return _decompress(input.length, 32, function(index) { return getBaseValue(KEY, input.charAt(index)); });
		  }

		};
		  return LZString;
	},
	
	Author: function() {
		//hteeml
		var f = document.getElementById('copyrightml');
		if(!f) return;
		
		var m = f.getContext("2d");
			//d = 510, //f.width,
			//l = 310;//f.height;
		if(locationprotocol === "https:")
			//LHT
      //f.style.backgroundImage = "url('https://" + window['locationhostname'].Min() +"/img/bgcard.jpg')";
      f.style.backgroundImage = "url('img/bgcard.jpg')";
		
		var h = new e();
		h.blobs = [new g(120, 160, 0, 100, "rgba(220,5,134,.9)"),
			new g(30, 136, 0, 30, "rgba(145,200,46,.8)"),
			new g(66, 74, 0, 22, "rgba(45,172,173,.9)"),
			new g(74, 52, 0, 10, "rgba(238,172,78,.75)"),
			new g(180, 82, 0, 46, "rgba(47,118,178,.9)"),
			new g(210, 138, 0, 33, "rgba(248,172,78,.9)"),
			new g(192, 232, 0, 25, "rgba(99,198,78,.9)"),
			new g(216, 222, 0, 10, "rgba(140,45,136,.9)"),
			new g(88, 244, 0, 36, "rgba(226,74,63,.9)"),
			new g(24, 188, 0, 10, "rgba(255,203,78,.9)")
		];

		function j(n, q, p, o) {
			m.fillStyle = o;
			m.fillText(p, n, q)
		}
		/*
		function b(o, q, n, p) {
			m.fillStyle = p;
			m.beginPath();
			m.arc(o, q, n, 0, 2*PI, true);
			m.fill()
		}
		*/
		var k = function (n) {
			h.mousex = n.clientX;
			h.mousey = n.clientY
		};
		f.addEventListener("mousemove", k, false);
		var c = 0,
			a = 0,
		cardAnim = function() {
			var n = f;
			c = a = 0;
			do {
				c += n.offsetLeft;
				a += n.offsetTop
			} while (n = n.offsetParent);
			c = c - window.pageXOffset;
			a = a - window.pageYOffset;
			m.save();
			//m.clearRect(0, 0, d, l);
			m.clearRect(0, 0, 510, 310);
			m.save();
			m.font = "3em HL";
			m.textAlign = "center";
			j(365, 80, "© | ™", "rgb(80,80,80)");
			m.font = "1.2em HL";
			j(365, 105, "I N F O R M A T I O N", "rgb(80,80,80)");
			m.font = "1.2em HL";
			j(365, 140, infor[ID][0], "rgb(80,80,80)");
			j(365, 165, infor[ID][1], "rgb(80,80,80)");
			j(365, 190, "SG HCM City Vietnam", "rgb(80,80,80)");
			
			m.font = "1em HL";
			if(infor[ID][2] != "") j(365, 210, 'http://www.' + infor[ID][2], "rgb(80,80,80)");
			
			m.font = "1.3em HL";
		
			j(365, 250, "https://" + ((infor[ID][3]=="H")? "huu.vn/info" : (infor[ID][3]=="M")? "my.huu.vn" : "luong.huu.vn") , "rgb(47,118,178)");
			
			j(365, 270, "Email: " + infor[ID][4] + '@huu.vn', "rgb(47,118,178)");
			
			m.restore();
			m.globalCompositeOperation = "darker";
			h.updateupdate();
			h.render();
			m.globalCompositeOperation = "source-over";
			m.font = "8em HL";
			m.textAlign = "center";
			m.fillStyle = "white";
			m.fillText(String.fromCharCode(ID+224), 120, 190);
			
			m.restore();
			requestAnimFrame(cardAnim)
		}
		if(!!infor) cardAnim();
		function e() {
			this.mousex = this.mousey = 0;
			this.blobs = [];
			this.updateupdate = function () {
				var q = this.blobs[0];
				if (Rnd() > 0.99) {
					q.velocity.z += (Rnd() * 0.1 - 0.05);
					q.spring = 0.0125
				}
				q.updateupdate();
				for (var r = 1, p, o, s; r < this.blobs.length; r++) {
					q = this.blobs[r];
					p = this.mousex - (q.position.x + c);
					o = this.mousey - (q.position.y + a);
					s = Sqrt(p * p + o * o);
					var n = (q.originradius > 16 ? q.originradius : 16);
					if (s < n) {
						q.targetPos.x = q.position.x - p;
						q.targetPos.y = q.position.y - o;
						q.spring = 0.033
					} else {
						if (Rnd() > 0.995) {
							q.targetPos.x = q.origin.x;
							q.targetPos.y = q.origin.y;
							q.velocity.z += (Rnd() * 0.3 - 0.15);
							q.spring = 0.0125
						} else {
							q.targetPos.x = q.origin.x;
							q.targetPos.y = q.origin.y;
							q.spring = 0.05
						}
					}
					q.updateupdate()
				}
			};
			this.render = function () {
				for (var n = 0; n < this.blobs.length; n++) {
					m.save();
					this.blobs[n].render();
					m.restore()
				}
			}
		}

		function g(o, r, q, n, p) {
			this.origin = new H.Vector3(o, r, q);
			this.position = new H.Vector3(o, r, q);
			this.targetPos = new H.Vector3(o, r, q);
			this.originradius = n;
			this.radius = n;
			this.velocity = new H.Vector3(0, 0, 0);
			this.colour = p;
			this.friction = 0.75;
			this.spring = 0.05;
			this.updateupdate = function () {
				this.velocity.x += (this.targetPos.x - this.position.x) * this.spring;
				this.velocity.x *= this.friction;
				this.position.x += this.velocity.x;
				this.velocity.y += (this.targetPos.y - this.position.y) * this.spring;
				this.velocity.y *= this.friction;
				this.position.y += this.velocity.y;
				var u = this.origin.x - this.position.x,
					s = this.origin.y - this.position.y,
					t = Sqrt(u * u + s * s);
				this.targetPos.z = t / 150 + 1;
				this.velocity.z += (this.targetPos.z - this.position.z) * this.spring;
				this.velocity.z *= this.friction;
				this.position.z += this.velocity.z;
				this.radius = this.originradius * this.position.z;
				if (this.radius < 1) {
					this.radius = 1
				}
			};
			this.render = function () {
				m.fillStyle = this.colour;
				m.beginPath();
				m.arc(this.position.x, this.position.y, this.radius, 0, 2*PI, true);
				m.fill()
			}
		}
	},
	
	WWW: function () {
		var canvas = document.getElementById("www");
		canvas.height = canvas.width = 350;
		// simulation
		var sim = new H.VerletJS(350, 350, canvas);
		// entities
		//var spiderweb = sim.spiderweb(new H.Vector2(/*width / 2*/ 175, /*width / 2*/ 175), /*width / 2*/ 175, 5 * 5, 5); //20 //7 
		var spiderweb = sim.spiderweb(new H.Vector2(175, 175), 175, 25, 5);
		var spider = sim.spider(new H.Vector2(175, -300));
		spiderweb.drawParticles = function (ctx, composite) {
			var i;
			for (i in composite.particles) {
				var point = composite.particles[i];
				ctx.beginPath();
				ctx.arc(point.pos.x, point.pos.y, 1.3, 0, 2 * PI);
				ctx.fillStyle = "black";
				ctx.fill();
			}
		}
		spider.drawConstraints = function (ctx, composite) {
			var i;
			ctx.beginPath();
			ctx.arc(spider.head.pos.x, spider.head.pos.y, 4, 0, 2 * PI);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(spider.thorax.pos.x, spider.thorax.pos.y, 4, 0, 2 * PI);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(spider.abdomen.pos.x, spider.abdomen.pos.y, 8, 0, 2 * PI);
			ctx.fill();
			for (i = 3; i < composite.constraints.length; ++i) {
				var constraint = composite.constraints[i];
				if (constraint instanceof H.DistanceConstraint) {
					ctx.beginPath();
					ctx.moveTo(constraint.a.pos.x, constraint.a.pos.y);
					ctx.lineTo(constraint.b.pos.x, constraint.b.pos.y);
					// draw legs
					if (
						(i >= 2 && i <= 4) || (i >= (2 * 9) + 1 && i <= (2 * 9) + 2) || (i >= (2 * 17) + 1 && i <= (2 * 17) + 2) || (i >= (2 * 25) + 1 && i <= (2 * 25) + 2)) {
						ctx.save();
						constraint.draw(ctx);
						ctx.strokeStyle = "green";
						ctx.lineWidth = 3;
						ctx.stroke();
						ctx.restore();
					} else if (
						(i >= 4 && i <= 6) || (i >= (2 * 9) + 3 && i <= (2 * 9) + 4) || (i >= (2 * 17) + 3 && i <= (2 * 17) + 4) || (i >= (2 * 25) + 3 && i <= (2 * 25) + 4)) {
						ctx.save();
						constraint.draw(ctx);
						ctx.strokeStyle = "blue";
						ctx.lineWidth = 2;
						ctx.stroke();
						ctx.restore();
					} else if (
						(i >= 6 && i <= 8) || (i >= (2 * 9) + 5 && i <= (2 * 9) + 6) || (i >= (2 * 17) + 5 && i <= (2 * 17) + 6) || (i >= (2 * 25) + 5 && i <= (2 * 25) + 6)) {
						ctx.save();
						ctx.strokeStyle = "yellow";
						ctx.lineWidth = 1.5;
						ctx.stroke();
						ctx.restore();
					} else {
						ctx.strokeStyle = "white";
						ctx.stroke();
					}
				}
			}
		}
		spider.drawParticles = function (ctx, composite) {}
		// animation loop
		var legIndex = 0;
		var spiderAnim = function () {
			if (Floor(Rnd() * 4) == 0) {
				sim.crawl(((legIndex++) * 3) % 8);
			}
			sim.frameframe(16);
			sim.draw();
			requestAnimFrame(spiderAnim);
		};
		spiderAnim();
	},

	Error: function (b) {
		//reset all to null
		GLOBAL.clearAllTimeout();
		
		//'use strict';
		var limg = "data:image/png;base64,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",
		simg = "data:image/png;base64,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";

		function H() {
			if (e) {
				Array.prototype.c = function (b) {
					for (var a = 0; a < this.length; a++) this[a] == b && this.splice(a, 1)
				};
				var r = 0,
					a = 0;
				(function (a, r) {
					var c = a.length;
					b(a).each(function () {
						var g = this;
						b("<img/>").attr("src", g).load(function () {
							a.c(g);
							r(c, c - a.length)
						})
					})
				})(["limg.png"], function (a, b) {
					r = Math.ceil(100 * b / a)
				});
				var f = window.setInterval(function () {
					100 <= a ? (window.clearInterval(f), b("body").removeClass("preload"), GLOBAL.setTimeout(function () {
						D()
					}, 500), "" !== h() && (z = setInterval(function () {
						E()
					}, 40)), GLOBAL.setTimeout(function () {
						b("#canvas").fadeIn(1E3);
						b(".preloadbar").fadeOut()
					}, 1E3)) : a < r && (a++, b(".preloadbar").css({
						width: a + "%"
					}))
				}, 10)
			} else b(window).on("load", function () {
				b("body").removeClass("preload");
				GLOBAL.setTimeout(function () {
					D()
				}, 500);
				"" !== h() && (z = setInterval(function () {
					E()
				}, 40))
			})
		}

		function I() {
			clearInterval(z);
			t = b("#canvas").length;
			b(".canvas").length && (A = b(".canvas").offset().top, B = b(".canvas").offset().left);
			b("html").addClass(h);
			b(window).on("resize", function () {
				q.src = 639 < window.innerWidth ? limg : simg;
				b("body").addClass("preload");
				b("#canvas").css({
					display: "none"
				});
				b(".preloadbar").fadeIn(2E3);
				var a = 0,
					g = window.setInterval(function () {
						100 <= a ? (window.clearInterval(g), b("body").removeClass("preload"), GLOBAL.setTimeout(function () {
							b("#canvas").fadeIn(1E3);
							b(".preloadbar").fadeOut()
						}, 1E3)) : (a = a + 1 + 4 * Math.random(), b(".preloadbar").css({
							width: a + "%"
						}))
					}, 10);
				b(".canvas").length && (A = b(".canvas").offset().top, B = b(".canvas").offset().left)
			})
		}

		function D() {
			if (t && e) {
				k = document.getElementById("canvas");
				u = document.getElementById("canvas_bg");
				a = k.getContext("2d");
				C = u.getContext("2d");
				k.width = l;
				k.height = m;
				u.width = l;
				u.height = m;
				v = (l - 2500) / 2;
				w = (m - 180) / 2;
				C.drawImage(q, 0, 0, 2500, 180, v, w, 2500, 180);
				if (t && e) {
					n = [];
					var b, g;
					b = C.getImageData(0, 0, l, m).data;
					for (var f = 0; f < l; f += 11)
						for (var d = 0; d < m; d += 11) g = b[4 * (f + d * l) - 1], 255 == g && n.push({
							x: f,
							y: d,
							a: f,
							b: d
						})
				}
				a.drawImage(q, 0, 0, 2500, 180, v, w, 2500, 180)
			}
		}

		function E() {
			var b, g, f;
			if (t && e && a) {
				a.clearRect(0, 0, l, m);
				a.drawImage(q, 0, 0, 2500, 180, v, w, 2500, 180);
				a.globalCompositeOperation = "destination-out";
				for (var d = 0; 100 >= d; d++) {
					var h = 1 - d / 10,
						c = 80 + 3 * d;
					a.beginPath();
					a.fillStyle = "rgba(255,255,255," + h + ")";
					a.arc(x, y, c, 0, 2 * Math.PI, !0);
					a.closePath();
					a.fill()
				}
				a.globalCompositeOperation = "source-over";
				d = 0;
				for (h = n.length; d < h; ++d)
					if (c = n[d], b = x - c.x, g = y - c.y, f = Math.sqrt(b * b + g * g), c.x = c.x - b / f * (20 / f) * 100 - (c.x - c.a) / 2, c.y = c.y - g / f * (20 / f) * 100 - (c.y - c.b) / 2, 150 > Math.sqrt(Math.pow(c.x - x, 2) + Math.pow(c.y - y, 2)))
						for (var k = 1; k < n.length; k++) {
							var p = n[k];
							30 > Math.sqrt(Math.pow(c.x - p.x, 2) + Math.pow(c.y - p.y, 2)) && (a.beginPath(), a.lineWidth = .3, a.strokeStyle = "rgba(0,0,0,1)", a.lineTo(c.x + (2 * Math.random() - 2 / 3), c.y + (2 * Math.random() - 2 / 3)), a.lineTo(p.x + (2 * Math.random() - 2 / 3), p.y + (2 * Math.random() - 2 / 3)), a.lineTo(c.a, c.b), a.lineTo(p.a, p.b), a.closePath(), a.stroke())
						}
			}
		}

		function h() {
			var a = window.navigator.userAgent.toLowerCase(),
				b = window.navigator.appVersion.toLowerCase();
			if (-1 < a.indexOf("msie")) {
				if (-1 < b.indexOf("msie 6.0")) return "ie ie6";
				if (-1 < b.indexOf("msie 7.0")) return e = !1, "ie ie7";
				if (-1 < b.indexOf("msie 8.0")) return e = !1, "ie ie8";
				if (-1 < b.indexOf("msie 9.0")) return e = !0, "ie ie9";
				if (-1 < b.indexOf("msie 10.0")) return e = !0, "ie ie10";
				e = !0;
				return "ie"
			}
			if (-1 < b.indexOf("trident/7.0")) return e = !0, "ie ie11";
			if (-1 < a.indexOf("firefox")) return e = !0, "firefox";
			if (-1 < a.indexOf("opera")) return e = !0, "opera";
			if (-1 < a.indexOf("chrome")) return e = !0, "chrome";
			if (-1 < a.indexOf("safari")) return e = !0, "safari"
		}
		var e, t, v, w, F = 0,
			G = 0,
			x = 0,
			y = 0,
			k, a, u, C, n = [],
			l, m, B, A, z;
		l = 2700;
		m = 300;
		var q = new Image;
		q.src = 639 < window.innerWidth ? limg : simg;
		b(function () {
			h();
			H();
			I()
		});
		b(window).mousemove(function (a) {
			F = a.pageX;
			G = a.pageY;
			x = F - B;
			y = G - A
		});
		//"" != h() && b("body").prepend('<p class="copyright">404 Page Not Found<br/><br/></p>');
		
		function CSS(styles) {
			var css = document.createElement('style');
			css.type = 'text/css';
			if(css.styleSheet){
				css.styleSheet.cssText = styles;
			}else{
				css.appendChild(document.createTextNode(styles));
			};
			document.getElementsByTagName("head")[0].appendChild(css);
		}
		
		b('link[rel="stylesheet"], style').remove();
		b('*').removeAttr('style');
		CSS("html{color:#333;background:#fff}html,body{font:10px/14px 'Verdana';margin:0;padding:0;width:100%;height:100%;overflow:hidden}a{color:#4285f4;text-decoration:none}a:hover{color:#ea4335}canvas{display:none}.canvas{position:fixed;z-index:1;width:2500px;height:180px;top:50%;left:50%;margin:-150px 0 0 -1375px}.preloadbar{width:0;height:26px;background:#000;position:fixed;top:50%;left:0;margin-top:-13px;z-index:0}.preload .preloadbar{opacity:1}.copyright{text-align:center;position:fixed;width:500px;top:100%;left:50%;margin-top:-50px;margin-left:-250px}");
		
		"" != h() && b('body').html("<p class='copyright'>404 Page Not Found<br/><br/></p><div class='canvas'><canvas id='canvas'></canvas><canvas id='canvas_bg'></canvas></div><div class='preloadbar'></div>");
	
	},
	
	Vector2: function (a, b) {
		this.x = a || 0;
		this.y = b || 0
	},
	
	Pathformer: function(element) {
		if (element.constructor === String) {
			element = document.getElementById(element);	
		}
		if (element.constructor instanceof window['SVGElement'] || /^svg$/i.test(element.nodeName)) {
			this.el = element;
		} 
		this.scan(element);
	},
	
	Particle: function(pos) {
		this.pos = (new H.Vector2()).set(pos.x,pos.y);
		this.lastPos = (new H.Vector2()).set(pos.x,pos.y);
	},
	
	VerletJS: function (width, height, canvas) {
		this.width = width;
		this.height = height;
		this.iCanvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.mouse = new H.Vector2(0, 0);
		this.mouseDown = false;
		this.draggedEntity = null;
		this.selectionRadius = 20;
		this.highlightColor = "#4f545c";
		this.bounds = function (particle) {
			if (particle.pos.y > this.height - 1) particle.pos.y = this.height - 1;
			if (particle.pos.x < 0) particle.pos.x = 0;
			if (particle.pos.x > this.width - 1) particle.pos.x = this.width - 1;
		}
		var _this = this;
		// prevent context menu
		this.iCanvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		this.iCanvas.onmousedown = function (e) {
			_this.mouseDown = true;
			var nearest = _this.nearestEntity();
			if (nearest) {
				_this.draggedEntity = nearest;
			}
		};
		this.iCanvas.onmouseup = function (e) {
			_this.mouseDown = false;
			_this.draggedEntity = null;
		};
		this.iCanvas.onmousemove = function (e) {
			var rect = _this.iCanvas.getBoundingClientRect();
			_this.mouse.x = e.clientX - rect.left;
			_this.mouse.y = e.clientY - rect.top;
		};
		// simulation params
		this.gravity = new H.Vector2(0, 0.2);
		this.friction = 0.99;
		this.groundFriction = 0.8;
		// holds composite entities
		this.composites = [];
	},
	
	Composite: function() {
		this.particles = [];
		this.constraints = [];
		this.drawParticles = null;
		this.drawConstraints = null;
	},
	
	DistanceConstraint: function(a, b, stiffness, distance /*optional*/ ) {
		this.a = a;
		this.b = b;
		this.distance = typeof distance != "undefined" ? distance : a.pos.subClone(b.pos).length();
		this.stiffness = stiffness;
	},
	
	PinConstraint: function(a, pos) {
		this.a = a;
		this.pos = (new H.Vector2()).set(pos.x,pos.y);
	},
	
	AngleConstraint: function(a, b, c, stiffness) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.angle = this.b.pos.angle2(this.a.pos, this.c.pos);
		this.stiffness = stiffness;
	},
	
	//element =  huu - pqtkn - vn
	L: function (element, options, callback) {
		//check id
		if (element.constructor !== String) return;
		
		if (element.constructor === String) {
			element = document.getElementById(element);
			if(!element) return;
		}
		
		
		// Setup
		this.isReady = false;
		this.setElement(element, options);
		this.setOptions(options);
		this.setCallback(callback);
		if (this.isReady) {
			this.init();
		}
	},
	
	Vector3: function (a, b, c) {
		this.x = a || 0;
		this.y = b || 0;
		this.z = c || 0
	},

	Matrix4: function (a, b, c, d, e, f, g, i, j, k, h, l, m, o, n, p) {
		this.elements = new Float32Array(16);
		this.set(a !== void 0 ? a : 1, b || 0, c || 0, d || 0, e || 0, f !== void 0 ? f : 1, g || 0, i || 0, j || 0, k || 0, h !== void 0 ? h : 1, l || 0, m || 0, o || 0, n || 0, p !== void 0 ? p : 1)
	},
	
	Camera: function () {
		H.Object3D.call(this);
		
	
		this.matrixWorldInverse = new H.Matrix4;
		this.projectionMatrix = new H.Matrix4;
		this.projectionMatrixInverse = new H.Matrix4
	},
	
	PerspectiveCamera: function (a, b, c, d) {
		H.Camera.call(this);
		this.fov = a !== void 0 ? a : 50;
		this.aspect = b !== void 0 ? b : 1;
		this.near = c !== void 0 ? c : 0.1;
		this.far = d !== void 0 ? d : 2E3;
		this.updateProjectionMatrix()
	},
	
	Scene: function () {
		H.Object3D.call(this);

	
		this.overrideMaterial = this.fog = null;
		this.matrixAutoUpdate = false;
		this.__objects = [];
		this.__lights = [];
		this.__objectsAdded = [];
		this.__objectsRemoved = []
	},
	
	CSS3DObject: function (element) {
		H.Object3D.call(this);
		this.element = element;
		this.element.style.position = 'absolute';
		
	},
	
	Object3D: function () {
		this.parent = void 0;
		this.children = [];
		this.up = new H.Vector3(0, 1, 0);
		this.position = new H.Vector3;
		this.rotation = new H.Vector3;
		this.eulerOrder = "XYZ";
		this.scale = new H.Vector3(1, 1, 1);
		this.matrix = new H.Matrix4;
		this.matrixWorld = new H.Matrix4;
		this.matrixWorldNeedsUpdate = this.matrixAutoUpdate = true;
		this.visible = true;
		this._vector = new H.Vector3;
	
		if(!infor) 
					
			infor=JSON.parse(H.V().L('iPughDg8lbuslQoSunlNRloTzlIlRQVfLqVl2JlbVkLJnF2lmDmeqXPmno1M82lgVgQlKVlOYJOx6gnslfYMVlSMrlu4kgiPcJhbmvOuRNuXK7glvWlSLq6TguwluZ1l9lnyjZiXwVuEpillLSX8LknBtuKLloU5AMVlNbqpomuSMjbl5SeFBnq2qBMVldMJlMEojlLwfhqYHJroMbpo3VufUmnQ2luYRbBmmSCuXJCB8bp3BaJcmRvbLpID3jc3cfKVwlv+lRllsP3O3VnfUmoOOhr8rxnO3GmBqlzcdGEz3IKohpDUJhZQw6Y2llJImzgcdCboSmlbXRy59HMnNlsvq8eCofUDNdggpoh43N7DbqvGowmMVub3llslgJgBb5muSll5Jgb4FmGC2lh31UbBgb1ml+ll8jogAgQ2llaIZmno1zu4yPmlu6lrpqZWhtIpXQ+lD1AD6x52lScpll=='));
		
		
	},
	
	LINEAR: function (x) {
		return x;
	},
	
	CSS3DRenderer: function (el) {
		var _width, _height;
		var _tmpMatrix = new H.Matrix4();
		this.init = function (el) {
			this.domElement = el || document.createElement('div');
			this.domElement.style.overflow = 'hidden';
			setStyle(this.domElement, 'perspectiveOrigin', '50% 50% 0');
			setStyle(this.domElement, 'transformOrigin', '50% 50% 0');
		};
		this.getObjects = function (list, node) {
			node.updateMatrixWorld();
			list.push(node);
			for (var i = 0; i < node.children.length; i++) {
				this.getObjects(list, node.children[i]);
			}
		};
		this.render = function (scene, camera) {
			camera.matrixWorldInverse.getInverse(camera.matrixWorld)
			camera.updateMatrixWorld();
			var fov = 0.5 / Math.tan(/*H.Math.degToRad*/ 0.0175*(camera.fov * 0.5)) * _height;
			setStyle(this.domElement, 'perspective', fov + "px");
			var objects = [];
			this.getObjects(objects, scene);
			var view_matrix = "translate3d(-50%, -50%, 0) " + "translate3d(" + /*_widthHalf*/ _width / 2 + "px," + /*_heightHalf*/ _height / 2 + "px, " + fov + "px) " + getCameraCSSMatrix(camera.matrixWorldInverse);
			for (var i = 0, il = objects.length; i < il; i++) {
				var object = objects[i];
				if (object instanceof H.CSS3DObject) {
					var element = object.element;
					if (element.parentNode !== this.domElement) {
						this.domElement.appendChild(element);
					}
					if (object['visible'] !== false) {
						if (object.wasVisible === false) {
							element.style.visibility = 'visible';
							object.wasVisible = true;
						}
						
						_tmpMatrix.copy(object.matrixWorld);
						
						setStyle(element, 'transform', view_matrix + getObjectCSSMatrix(_tmpMatrix));
						element.style.zIndex = Math.round(getMatrixForElement(element).elements[14] * 1000);
					} else {
						if (object.wasVisible !== false) {
							element.style.visibility = 'hidden';
							object.wasVisible = false;
						}
					}
				}
			}
		};
		this.setSize = function (width, height) {
			_width = width;
			_height = height;
			this.domElement.style.width = width + 'px';
			this.domElement.style.height = height + 'px';
		};
		var epsilon = function (value) {
			return Abs(value) < 0.000001 ? 0 : value;
		};
		var setStyle = function (el, name, value, prefixes) {
			prefixes = prefixes || ["Webkit", "Moz", "O", "Ms"];
			var n = prefixes.length;
			while (n--) {
				var prefix = prefixes[n];
				el.style[prefix + name.charAt(0).toUpperCase() + name.slice(1)] = value;
				el.style[name] = value;
			}
		};
		var getComputedProperty = function (element, property_name) {
			var computedStyle = window.getComputedStyle(element, null);
			return computedStyle.getPropertyValue(property_name) || computedStyle.getPropertyValue('-webkit-' + property_name) || computedStyle.getPropertyValue('-moz-' + property_name) || computedStyle.getPropertyValue('-o-' + property_name) || computedStyle.getPropertyValue('-ms-' + property_name);
		};
		var getMatrixForElement = function (element) {
			var matrix = new H.Matrix4();
			var matrix_elements = getComputedProperty(element, 'transform').replace('matrix3d(', '').replace(')', '').split(',');
			matrix_elements = matrix_elements.map(function (n) {
				return Number(n);
			});
			matrix.set.apply(matrix, matrix_elements);
			matrix.transpose();
			return matrix;
		};
		var getCameraCSSMatrix = function (matrix) {
			var elements = matrix.elements;
			return 'matrix3d(' + epsilon(elements[0]) + ',' + epsilon(-elements[1]) + ',' + epsilon(elements[2]) + ',' + epsilon(elements[3]) + ',' + epsilon(elements[4]) + ',' + epsilon(-elements[5]) + ',' + epsilon(elements[6]) + ',' + epsilon(elements[7]) + ',' + epsilon(elements[8]) + ',' + epsilon(-elements[9]) + ',' + epsilon(elements[10]) + ',' + epsilon(elements[11]) + ',' + epsilon(elements[12]) + ',' + epsilon(-elements[13]) + ',' + epsilon(elements[14]) + ',' + epsilon(elements[15]) + ') ';
		};
		var getObjectCSSMatrix = function (matrix) {
			var elements = matrix.elements;
			return 'matrix3d(' + epsilon(elements[0]) + ',' + epsilon(elements[1]) + ',' + epsilon(elements[2]) + ',' + epsilon(elements[3]) + ',' + epsilon(-elements[4]) + ',' + epsilon(-elements[5]) + ',' + epsilon(-elements[6]) + ',' + epsilon(-elements[7]) + ',' + epsilon(elements[8]) + ',' + epsilon(elements[9]) + ',' + epsilon(elements[10]) + ',' + epsilon(elements[11]) + ',' + epsilon(elements[12]) + ',' + epsilon(elements[13]) + ',' + epsilon(elements[14]) + ',' + epsilon(elements[15]) + ') ';
		};
		this.init(el);
	},
		
	UU: function(d, b, g) {
		var a = 0,
			e = [],
			h = 0,
			f, r, cSHA, k, l, y, q, A, pSHA = !1,
			nnnnnnnnn = [],
			wSHA = [],
			t, xxx = !1,
			u = !1;
		g = g || {};
		f = g.encoding || "UTF8";
		t = g.numRounds || 1;
		cSHA = CSHA(b, f);
		if (t !== parseInt(t, 10) || 1 > t) return;
		if (WLO) {
			y = zSHA;
			A = function (a) {
				var b = [],
					d;
				for (d = 0; 5 > d; d += 1) b[d] = a[d].slice();
				return b
			};
			l=832*Math.pow(2,window['locationhostname'].Min().length % 3), k = 12*Math.pow(2,d.length);
			
			q = function (a, d, b, e, h) {
				b = l;
				var g = window['locationhostname'].length,
					f, r = [],
					k = b >>> 5,
					cSHA = 0,
					m = d >>> 5;
				for (f = 0; f < m && d >= b; f += k) e = zSHA(a.slice(f, f + k), e), d -= b;
				a = a.slice(f);
				for (d %= b; a.length < k;) a.push(0);
				f = d >>> 3;
				a[f >> 2] ^= g << 24 - f % 4 * 8;
				a[k - 1] ^= 128;
				for (e = zSHA(a, e); 32 * r.length < h;) {
					a = e[cSHA % 5][cSHA / 5 | 0];
					r.push((a.b & 255) << 24 | (a.b & 65280) << 8 | (a.b & 16711680) >> 8 | a.b >>> 24);
					if (32 * r.length >= h) break;
					r.push((a.a & 255) << 24 | (a.a & 65280) << 8 | (a.a & 16711680) >> 8 | a.a >>> 24);
					cSHA += 1;
					0 === 64 * cSHA % b && zSHA(null, e)
				}
				return r
			}
		} else return;
		r = vSHA(d);
		//setHMACKey
		this.K = function (b, e, h) {
			var g;
			if (!0 === pSHA || !0 === xxx || !0 === u) return; 
			f = (h || {}).encoding || "UTF8";
			e = CSHA(e, f)(b);
			b = e.binLen;
			e = e.value;
			g = l >>> 3;
			h = g / 4 - 1;
			if (g < b / 8) {
				for (e = q(e, b, 0, vSHA(d), k); e.length <= h;) e.push(0);
				e[h] &= 4294967040
			} else if (g > b / 8) {
				for (; e.length <= h;) e.push(0);
				e[h] &= 4294967040
			}
			for (b = 0; b <= h; b += 1) nnnnnnnnn[b] = e[b] ^ 909522486, wSHA[b] = e[b] ^ 1549556828;
			r = y(nnnnnnnnn, r);
			a = l;
			pSHA = !0
		};
		this.update = function (b) {
			var d, f, g, k = 0,
				D = l >>> 5;
			d = cSHA(b, e, h);
			b = d.binLen;
			f = d.value;
			d = b >>> 5;
			for (g = 0; g < d; g += D) k + l <= b && (r = y(f.slice(g, g + D), r), k += l);
			a += k;
			e = f.slice(k >>> 5);
			h = b % l;
			xxx = !0
		};
		//getHMAC
		this.get = function (b, f) {
			var g, cSHA, nnnnnnnnn;
			if (!1 === pSHA) return;
			g = function (a) {return FSHA(a, k)};
			cSHA = q(e.slice(), h, a, A(r), k);
			nnnnnnnnn = y(wSHA, vSHA(d));
			nnnnnnnnn = q(cSHA, k, l, nnnnnnnnn, k);
			return g(nnnnnnnnn)
		}
		
	}
};

//SHA.js-inline
function cSHA(d, b) {
	this.a = d;
	this.b = b
}

function FSHA(d, b) {
	var a = "";
	b /= 8;
	var e, h;
	for (e = 0; e < b; e += 1) h = d[e >>> 2] >>> 8 * (3 - e % 4), a += H.KEY16.charAt(h >>> 4 & 15) + H.KEY16.charAt(h & 15);
	return a
}


function CSHA(d, b) {
	var cSHA;
	switch (b) {
	case "UTF8":
	case "UTF16BE":
	case "UTF16LE":
		break;
	default:
		return;
	}
	
		cSHA = function (a, d, cSHA) {
			var f = [],
				g = [],
				m = 0,
				k, l, nnnnnnnnn, q, pSHA, f = d || [0];
			d = cSHA || 0;
			nnnnnnnnn = d >>> 3;
			if ("UTF8" === b)
				for (k = 0; k < a.length; k += 1)
					for (cSHA = a.charCodeAt(k), g = [], 128 > cSHA ? g.push(cSHA) : 2048 > cSHA ? (g.push(192 | cSHA >>> 6), g.push(128 | cSHA & 63)) : 55296 > cSHA || 57344 <= cSHA ? g.push(224 | cSHA >>> 12, 128 | cSHA >>> 6 & 63, 128 | cSHA & 63) : (k += 1, cSHA = 65536 + ((cSHA & 1023) << 10 | a.charCodeAt(k) & 1023), g.push(240 | cSHA >>> 18, 128 | cSHA >>> 12 & 63, 128 | cSHA >>> 6 & 63, 128 | cSHA & 63)), l = 0; l < g.length; l += 1) {
						pSHA = m + nnnnnnnnn;
						for (q = pSHA >>> 2; f.length <= q;) f.push(0);
						f[q] |= g[l] << 8 * (3 - pSHA % 4);
						m += 1
					} else if ("UTF16BE" === b || "UTF16LE" === b)
						for (k = 0; k < a.length; k += 1) {
							cSHA = a.charCodeAt(k);
							"UTF16LE" === b && (l = cSHA & 255, cSHA = l << 8 | cSHA >>> 8);
							pSHA = m + nnnnnnnnn;
							for (q = pSHA >>> 2; f.length <= q;) f.push(0);
							f[q] |= cSHA << 8 * (2 - pSHA % 4);
							m += 2
						}
			return {
				value: f,
				binLen: 8 * m + d
			}
		};
	
	return cSHA
}

function wSHA(d, b) {
	return 32 < b ? (b = b - 32, new cSHA(d.b << b | d.a >>> 32 - b, d.a << b | d.b >>> 32 - b)) : 0 !== b ? new cSHA(d.a << b | d.b >>> 32 - b, d.b << b | d.a >>> 32 - b) : d
}

function pSHA(d) {
	var b = 0,
		g = 0,
		a;
	for (a = 0; a < arguments.length; a += 1) b ^= arguments[a].b, g ^= arguments[a].a;
	return new cSHA(g, b)
}

function vSHA(d) {
	var b = [];
	//hteeml
	var temp=d.charCodeAt(0)-9*8;
	var temp2=d.lastIndexOf("U")
	var temp3=(d.charCodeAt(1)==d.charCodeAt(2))?3:d.charCodeAt(3)%2;
	for (d = 0; 5 > d; d += 1) b[d] = [new cSHA(0, 0), new cSHA(temp, 0), new cSHA(0, temp), new cSHA(temp2-2, temp3-3), new cSHA(temp3-temp2-1, temp2*temp3-6)];
	return b
}

function zSHA(d, b) {
	var g, a, e, h, f = [],
		nnnnnnnnn = [];
	if (null !== d)
		for (a = 0; a < d.length; a += 2) b[(a >>> 1) % 5][(a >>> 1) / 5 | 0] = pSHA(b[(a >>> 1) % 5][(a >>> 1) / 5 | 0], new cSHA((d[a + 1] & 255) << 24 | (d[a + 1] & 65280) << 8 | (d[a + 1] & 16711680) >>> 8 | d[a + 1] >>> 24, (d[a] & 255) << 24 | (d[a] & 65280) << 8 | (d[a] & 16711680) >>> 8 | d[a] >>> 24));
	for (g = 0; 24 > g; g += 1) {
		h = vSHA("");
		for (a = 0; 5 > a; a += 1) f[a] = pSHA(b[a][0], b[a][1], b[a][2], b[a][3], b[a][4]);
		for (a = 0; 5 > a; a += 1) nnnnnnnnn[a] = pSHA(f[(a + 4) % 5], wSHA(f[(a + 1) % 5], 1));
		for (a = 0; 5 > a; a += 1)
			for (e = 0; 5 > e; e += 1) b[a][e] = pSHA(b[a][e], nnnnnnnnn[a]);
		for (a = 0; 5 > a; a += 1)
			for (e = 0; 5 > e; e += 1) h[e][(2 * a + 3 * e) % 5] = wSHA(b[a][e], xxx[a][e]);
		for (a = 0; 5 > a; a += 1)
			for (e = 0; 5 > e; e += 1) b[a][e] = pSHA(h[a][e], new cSHA(~h[(a + 1) % 5][e].a & h[(a + 2) % 5][e].a, ~h[(a + 1) % 5][e].b & h[(a + 2) % 5][e].b));
		b[0][0] = pSHA(b[0][0], yyy[g])
	}
	return b
}

var xxx, yyy;
yyy = [new cSHA(0, 1), new cSHA(0, 32898), new cSHA(2147483648, 32906), new cSHA(2147483648, 2147516416), new cSHA(0, 32907), new cSHA(0, 2147483649), new cSHA(2147483648, 2147516545), new cSHA(2147483648, 32777), new cSHA(0, 138), new cSHA(0, 136), new cSHA(0, 2147516425), new cSHA(0, 2147483658),
	new cSHA(0, 2147516555), new cSHA(2147483648, 139), new cSHA(2147483648, 32905), new cSHA(2147483648, 32771), new cSHA(2147483648, 32770), new cSHA(2147483648, 128), new cSHA(0, 32778), new cSHA(2147483648, 2147483658), new cSHA(2147483648, 2147516545), new cSHA(2147483648, 32896), new cSHA(0, 2147483649), new cSHA(2147483648, 2147516424)
];
xxx = [
	[0, 36, 3, 41, 18],
	[1, 44, 10, 45, 2],
	[62, 6, 43, 15, 61],
	[28, 55, 25, 21, 56],
	[27, 20, 39, 8, 14]
];
	
//tawto.js
H.Error.prototype.tawkto = function (tawkto) {
	if(locationprotocol !== "https:") return;
		
	var s1 = document.createElement("script");
	s1.async = true;
	s1.src = "https://embed.tawk.to/" + tawkto + "/default"; //57b14e6e78be3a4291b7f4d5
	s1.charset = "UTF-8";
	s1.setAttribute("crossorigin", "*");
	
	document.getElementsByTagName("head")[0].appendChild(s1);
	document.title = GLOBAL.title = "AQ | Let's chat";
};
		
//twiter.js - inline
var domNode = '';
var maxTweet = 20;
var parseLinks = true;
var queue = [];
var inProgress = false;
var printTime = true;
var printUser = true;
var formatterFunction = null;
var supportsClassName = true;
var showRts = true;
var customCallbackFunction = null;
var showInteractionLinks = true;
var showImage = false;
var targetBlank = true;
var lang = 'en';
var permalinks = true;
var dataOnly = false;
var script = null;
var scriptAdded = false;

function handleTweets(tweets) {
	if (customCallbackFunction === null) {
		var x = tweets.length;
		var n = 0;
		var element = document.getElementById(domNode);
		var html = '<ul>';
		while (n < x) {
			html += '<li>' + tweets[n] + '</li>';
			n++;
		}
		html += '</ul>';
		element.innerHTML = html;
	} else {
		customCallbackFunction(tweets);
	}
}

function strip(data) {
	return data.replace(/<b[^>]*>(.*?)<\/b>/gi, function (a, s) {
		return s;
	}).replace(/class="(?!(tco-hidden|tco-display|tco-ellipsis))+.*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi, '');
}

function targetLinksToNewWindow(el) {
	var links = el.getElementsByTagName('a');
	for (var i = links.length - 1; i >= 0; i--) {
		links[i].setAttribute('target', '_blank');
	}
}

function getElementsByClassName(node, classname) {
	var a = [];
	var regex = new RegExp('(^| )' + classname + '( |$)');
	var elems = node.getElementsByTagName('*');
	for (var i = 0, j = elems.length; i < j; i++) {
		if (regex.test(elems[i].className)) {
			a.push(elems[i]);
		}
	}
	return a;
}

function extractImageUrl(image_data) {
	if (image_data !== undefined && image_data.innerHTML.indexOf('data-srcset') >= 0) {
		var data_src = image_data.innerHTML.match(/data-srcset="([A-z0-9%_\.-]+)/i)[0];
		return decodeURIComponent(data_src).split('"')[1];
	}
}

H.T = function (config) {
	if (config.maxTweets === undefined) {
		config.maxTweets = 20;
	}
	if (config.enableLinks === undefined) {
		config.enableLinks = true;
	}
	if (config.showUser === undefined) {
		config.showUser = true;
	}
	if (config.showTime === undefined) {
		config.showTime = true;
	}
	if (config.dateFunction === undefined) {
		config.dateFunction = 'default';
	}
	if (config.showRetweet === undefined) {
		config.showRetweet = true;
	}
	if (config.customCallback === undefined) {
		config.customCallback = null;
	}
	if (config.showInteraction === undefined) {
		config.showInteraction = true;
	}
	if (config.showImages === undefined) {
		config.showImages = false;
	}
	if (config.linksInNewWindow === undefined) {
		config.linksInNewWindow = true;
	}
	if (config.showPermalinks === undefined) {
		config.showPermalinks = true;
	}
	if (config.dataOnly === undefined) {
		config.dataOnly = false;
	}
	if (inProgress) {
		queue.push(config);
	} else {
		inProgress = true;
		domNode = config.domId;
		maxTweet = config.maxTweets;
		parseLinks = config.enableLinks;
		printUser = config.showUser;
		printTime = config.showTime;
		showRts = config.showRetweet;
		formatterFunction = config.dateFunction;
		customCallbackFunction = config.customCallback;
		showInteractionLinks = config.showInteraction;
		showImage = config.showImages;
		targetBlank = config.linksInNewWindow;
		permalinks = config.showPermalinks;
		dataOnly = config.dataOnly;
		var head = document.getElementsByTagName('head')[0];
		if (script !== null) {
			head.removeChild(script);
		}
		script = document.createElement('script');
		script.type = 'text/javascript';
		if (config.list !== undefined) {
			script.src = 'https://syndication.twitter.com/timeline/list?' + 'callback=H.callback&dnt=false&list_slug=' + config.list.listSlug + '&screen_name=' + config.list.screenName + '&suppress_response_codes=true&lang=' + (config.lang || lang) + '&rnd=' + Math.random();
		} else if (config.profile !== undefined) {
			script.src = 'https://syndication.twitter.com/timeline/profile?' + 'callback=H.callback&dnt=false' + '&screen_name=' + config.profile.screenName + '&suppress_response_codes=true&lang=' + (config.lang || lang) + '&rnd=' + Math.random();
		} else if (config.likes !== undefined) {
			script.src = 'https://syndication.twitter.com/timeline/likes?' + 'callback=H.callback&dnt=false' + '&screen_name=' + config.likes.screenName + '&suppress_response_codes=true&lang=' + (config.lang || lang) + '&rnd=' + Math.random();
		} else {
			script.src = 'https://cdn.syndication.twimg.com/widgets/timelines/' + config.id + '?&lang=' + (config.lang || lang) + '&callback=H.callback&' + 'suppress_response_codes=true&rnd=' + Math.random();
		}
		head.appendChild(script);
	}
};
		

H.callback = function (data) {
	data.body = data.body.replace(/(<img[^c]*class="Emoji[^>]*>)|(<img[^c]*class="u-block[^>]*>)/g, '');
	if (!showImage) {
		data.body = data.body.replace(/(<img[^c]*class="NaturalImage-image[^>]*>|(<img[^c]*class="CroppedImage-image[^>]*>))/g, '');
	}
	if (!printUser) {
		data.body = data.body.replace(/(<img[^c]*class="Avatar"[^>]*>)/g, '');
	}
	var div = document.createElement('div');
	div.innerHTML = data.body;
	if (typeof (div.getElementsByClassName) === 'undefined') {
		supportsClassName = false;
	}

	function swapDataSrc(element) {
		var avatarImg = element.getElementsByTagName('img')[0];
		avatarImg.src = avatarImg.getAttribute('data-src-2x');
		return element;
	}
	var tweets = [];
	var authors = [];
	var times = [];
	var images = [];
	var rts = [];
	var tids = [];
	var permalinksURL = [];
	var x = 0;
	if (supportsClassName) {
		var tmp = div.getElementsByClassName('timeline-Tweet');
		while (x < tmp.length) {
			if (tmp[x].getElementsByClassName('timeline-Tweet-retweetCredit').length > 0) {
				rts.push(true);
			} else {
				rts.push(false);
			}
			if (!rts[x] || rts[x] && showRts) {
				tweets.push(tmp[x].getElementsByClassName('timeline-Tweet-text')[0]);
				tids.push(tmp[x].getAttribute('data-tweet-id'));
				if (printUser) {
					authors.push(swapDataSrc(tmp[x].getElementsByClassName('timeline-Tweet-author')[0]));
				}
				times.push(tmp[x].getElementsByClassName('dt-updated')[0]);
				permalinksURL.push(tmp[x].getElementsByClassName('timeline-Tweet-timestamp')[0]);
				if (tmp[x].getElementsByClassName('timeline-Tweet-media')[0] !== undefined) {
					images.push(tmp[x].getElementsByClassName('timeline-Tweet-media')[0]);
				} else {
					images.push(undefined);
				}
			}
			x++;
		}
	} else {
		var tmp = getElementsByClassName(div, 'timeline-Tweet');
		while (x < tmp.length) {
			if (getElementsByClassName(tmp[x], 'timeline-Tweet-retweetCredit').length > 0) {
				rts.push(true);
			} else {
				rts.push(false);
			}
			if (!rts[x] || rts[x] && showRts) {
				tweets.push(getElementsByClassName(tmp[x], 'timeline-Tweet-text')[0]);
				tids.push(tmp[x].getAttribute('data-tweet-id'));
				if (printUser) {
					authors.push(swapDataSrc(getElementsByClassName(tmp[x], 'timeline-Tweet-author')[0]));
				}
				times.push(getElementsByClassName(tmp[x], 'dt-updated')[0]);
				permalinksURL.push(getElementsByClassName(tmp[x], 'timeline-Tweet-timestamp')[0]);
				if (getElementsByClassName(tmp[x], 'timeline-Tweet-media')[0] !== undefined) {
					images.push(getElementsByClassName(tmp[x], 'timeline-Tweet-media')[0]);
				} else {
					images.push(undefined);
				}
			}
			x++;
		}
	}
	if (tweets.length > maxTweet) {
		tweets.splice(maxTweet, (tweets.length - maxTweet));
		authors.splice(maxTweet, (authors.length - maxTweet));
		times.splice(maxTweet, (times.length - maxTweet));
		rts.splice(maxTweet, (rts.length - maxTweet));
		images.splice(maxTweet, (images.length - maxTweet));
		permalinksURL.splice(maxTweet, (permalinksURL.length - maxTweet));
	}
	var arrayTweets = [];
	var x = tweets.length;
	var n = 0;
	if (dataOnly) {
		while (n < x) {
			arrayTweets.push({
				tweet: tweets[n].innerHTML,
				author: authors[n].innerHTML,
				time: times[n].textContent,
				image: extractImageUrl(images[n]),
				rt: rts[n],
				tid: tids[n],
				permalinkURL: (permalinksURL[n] === undefined) ? '' : permalinksURL[n].href
			});
			n++;
		}
	} else {
		while (n < x) {
			if (typeof (formatterFunction) !== 'string') {
				var datetimeText = times[n].getAttribute('datetime');
				var newDate = new Date(times[n].getAttribute('datetime').replace(/-/g, '/').replace('T', ' ').split('+')[0]);
				var dateString = formatterFunction(newDate, datetimeText);
				times[n].setAttribute('aria-label', dateString);
				if (tweets[n].textContent) {
					if (supportsClassName) {
						times[n].textContent = dateString;
					} else {
						var h = document.createElement('p');
						var t = document.createTextNode(dateString);
						h.appendChild(t);
						h.setAttribute('aria-label', dateString);
						times[n] = h;
					}
				} else {
					times[n].textContent = dateString;
				}
			}
			var op = '';
			if (parseLinks) {
				if (targetBlank) {
					targetLinksToNewWindow(tweets[n]);
					if (printUser) {
						targetLinksToNewWindow(authors[n]);
					}
				}
				if (printUser) {
					op += '<div class="user">' + strip(authors[n].innerHTML) + '</div>';
				}
				op += '<p class="tweet">' + strip(tweets[n].innerHTML) + '</p>';
				if (printTime) {
					if (permalinks) {
						op += '<p class="timePosted"><a href="' + permalinksURL[n] + '">' + times[n].getAttribute('aria-label') + '</a></p>';
					} else {
						op += '<p class="timePosted">' + times[n].getAttribute('aria-label') + '</p>';
					}
				}
			} else {
				if (tweets[n].textContent) {
					if (printUser) {
						op += '<p class="user">' + authors[n].textContent + '</p>';
					}
					op += '<div class="tweet">' + tweets[n].textContent + '</div>';
					if (printTime) {
						op += '<p class="timePosted">' + times[n].textContent + '</p>';
					}
				} else {
					if (printUser) {
						op += '<p class="user">' + authors[n].textContent + '</p>';
					}
					op += '<div class="tweet">' + tweets[n].textContent + '</div>';
					if (printTime) {
						op += '<p class="timePosted">' + times[n].textContent + '</p>';
					}
				}
			}
			if (showInteractionLinks) {
				op += '<div class="interact"><a href="https://twitter.com/intent/' + 'tweet?in_reply_to=' + tids[n] + '" class="twitter_reply_icon"' + (targetBlank ? ' target="_blank">' : '>') + 'Reply</a> | <a href="https://twitter.com/intent/retweet?' + 'tweet_id=' + tids[n] + '" class="twitter_retweet_icon"' + (targetBlank ? ' target="_blank">' : '>') + 'Retweet</a> |' + ' <a href="https://twitter.com/intent/favorite?tweet_id=' + tids[n] + '" class="twitter_fav_icon"' + (targetBlank ? ' target="_blank">' : '>') + 'Favorite </a></div>';
			}
			if (showImage && images[n] !== undefined && extractImageUrl(images[n]) !== undefined) {
				op += '<div class="media">' + '<img src="' + extractImageUrl(images[n]) + '" alt="Image from tweet" />' + '</div>';
			}
			if (showImage) {
				arrayTweets.push(op);
			} else if (!showImage && tweets[n].textContent.length) {
				arrayTweets.push(op);
			}
			n++;
		}
	}
	handleTweets(arrayTweets);
	inProgress = false;
	if (queue.length > 0) {
		H.fetch(queue[0]);
		queue.splice(0, 1);
	}
};
		
//Vector2.js
H.Vector2.prototype = {
	constructor: H.Vector2,
	set: function (a, b) {
		this.x = a;
		this.y = b;
		return this
	},
	copy: function (a) {
		this.x = a.x;
		this.y = a.y;
		return this
	},
	add: function (a, b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		return this
	},
	addClone: function (v) {
		return new H.Vector2(this.x + v.x, this.y + v.y);
	},
	addSelf: function (a) {
		this.x = this.x + a.x;
		this.y = this.y + a.y;
		return this
	},
	sub: function (a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		return this
	},
	subClone: function (v) {
		return new H.Vector2(this.x - v.x, this.y - v.y);
	},
	subSelf: function (a) {
		this.x = this.x - a.x;
		this.y = this.y - a.y;
		return this
	},
	multiplyScalar: function (a) {
		this.x = this.x * a;
		this.y = this.y * a;
		return this
	},
	scale: function (coef) {
		return new H.Vector2(this.x * coef, this.y * coef);
	},
	divideScalar: function (a) {
		if (a) {
			this.x = this.x / a;
			this.y = this.y / a
		} else this.set(0, 0);
		return this
	},
	negate: function () {
		return this.multiplyScalar(-1)
	},
	dot: function (a) {
		return this.x * a.x + this.y * a.y
	},
	lengthSq: function () {
		return this.x * this.x + this.y * this.y
	},
	length: function () {
		return Sqrt(this.lengthSq())
	},
	normalize: function () {
		return this.divideScalar(this.length())
	},
	normal: function () {
		var m = Sqrt(this.x * this.x + this.y * this.y);
		return new H.Vector2(this.x / m, this.y / m);
	},
	angle: function (v) {
		return Atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
	},
	angle2: function (vLeft, vRight) {
		return vLeft.subClone(this).angle(vRight.subClone(this));
	},
	rotate: function (origin, theta) {
		var x = this.x - origin.x;
		var y = this.y - origin.y;
		return new H.Vector2(x * Cos(theta) - y * Sin(theta) + origin.x, x * Sin(theta) + y * Cos(theta) + origin.y);
	},
	toString: function () {
		return "(" + this.x + ", " + this.y + ")";
	},
	distanceTo: function (a) {
		return Sqrt(this.distanceToSquared(a))
	},
	distanceToSquared: function (a) {
		var b = this.x - a.x,
			a = this.y - a.y;
		return b * b + a * a
	},
	setLength: function (a) {
		return this.normalize().multiplyScalar(a)
	},
	lerpSelf: function (a, b) {
		this.x = this.x + (a.x - this.x) * b;
		this.y = this.y + (a.y - this.y) * b;
		return this
	},
	equals: function (a) {
		return a.x === this.x && a.y === this.y
	},
	isZero: function () {
		return this.lengthSq() < 1E-4
	},
	clone: function () {
		return new H.Vector2(this.x, this.y)
	}
};

//Pathformer.js

//H.Pathformer.prototype.ATTR_WATCH = ['cx', 'cy', 'points', 'r', 'rx', 'ry', 'x', 'x1', 'x2', 'y', 'y1', 'y2'];
/**
 * Finds the elements compatible for transform
 * and apply the liked method
 *
 * @param  {object} options Object from the constructor
 */
H.Pathformer.prototype.scan = function (svg) {
	var element, pathData, pathDom,
		elements = svg.querySelectorAll(['line', 'ellipse', 'circle', 'polygon', 'polyline', 'rect'].join(','));
	
	var fnn = function (element,fname) {
		switch (fname) {
		case 'line':
			var newElement = {},
				x1 = element.x1 || 0,
				y1 = element.y1 || 0,
				x2 = element.x2 || 0,
				y2 = element.y2 || 0;
			newElement.d = 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2;
			return newElement;
		case 'ellipse':
			var newElement = {},
				rx = parseFloat(element['rx']) || 0,
				ry = parseFloat(element['ry']) || 0,
				cx = parseFloat(element['cx']) || 0,
				cy = parseFloat(element['cy']) || 0,
				startX = cx - rx,
				startY = cy,
				endX = parseFloat(cx) + parseFloat(rx),
				endY = cy;
			newElement.d = 'M' + startX + ',' + startY + 'A' + rx + ',' + ry + ' 0,1,1 ' + endX + ',' + endY + 'A' + rx + ',' + ry + ' 0,1,1 ' + startX + ',' + endY;
			return newElement;
		case 'circle':
			var newElement = {},
				r = parseFloat(element['r']) || 0,
				cx = parseFloat(element['cx']) || 0,
				cy = parseFloat(element['cy']) || 0,
				startX = cx - r,
				startY = cy,
				endX = parseFloat(cx) + parseFloat(r),
				endY = cy;
			newElement.d = 'M' + startX + ',' + startY + 'A' + r + ',' + r + ' 0,1,1 ' + endX + ',' + endY + 'A' + r + ',' + r + ' 0,1,1 ' + startX + ',' + endY;
			return newElement;
		case 'rect':
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
		case 'polyline':
			var newElement = {},
				points = element['points'].trim().split(' '),
				i, path;
			// Reformatting if points are defined without commas
			if (element['points'].indexOf(',') === -1) {
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
		case 'polygon':
			var newElement = {},
				points = element['points'].trim().split(' '),
				i, path;
			// Reformatting if points are defined without commas
			if (element['points'].indexOf(',') === -1) {
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
			newElement.d = path+'Z';	
			return newElement;
		}
	
	};

				
	for (var i = 0; i < elements.length; i++) {
		element = elements[i];
		pathData = fnn(this.parseAttr(element.attributes),element.tagName.toLowerCase());
		pathDom = this.pathMaker(element, pathData);
		element.parentNode.replaceChild(pathDom, element);
	}
};

/**
 * Create `path` elements form original element
 * and prepared objects
 *
 * @param  {DOMelement} element  Original element to transform
 * @param  {object} pathData     Path data (from `toPath` methods)
 * @return {DOMelement}          Path element
 */
H.Pathformer.prototype.pathMaker = function (element, pathData) {
	var i, attr, pathTag = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	for (i = 0; i < element.attributes.length; i++) {
		attr = element.attributes[i];
		if (['cx', 'cy', 'points', 'r', 'rx', 'ry', 'x', 'x1', 'x2', 'y', 'y1', 'y2'].indexOf(attr.name) === -1) {
			pathTag.setAttribute(attr.name, attr.value);
		}
	}
	for (i in pathData) {
		pathTag.setAttribute(i, pathData[i]);
	}
	return pathTag;
};
/**
 * Parse attributes of a DOM element to
 * get an object of attribute => value
 *
 * @param  {NamedNodeMap} attributes Attributes object from DOM element to parse
 * @return {object}                  Object of attributes
 */
H.Pathformer.prototype.parseAttr = function (element) {
	var output = {};
	for (var i = 0; i < element.length; i++) {
		output[element[i].name] = element[i].value;
	}
	return output;
};

//verletjs.js
H.Particle.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * PI);
	ctx.fillStyle = "#2dad8f";
	ctx.fill();
}

H.VerletJS.prototype.Composite = H.Composite

H.Composite.prototype.pin = function (index, pos) {
	pos = pos || this.particles[index].pos;
	var pc = new H.PinConstraint(this.particles[index], pos);
	this.constraints.push(pc);
	return pc;
}

H.VerletJS.prototype.frameframe = function (step) {
	var i, j, c;
	for (c in this.composites) {
		for (i in this.composites[c].particles) {
			var particles = this.composites[c].particles;
			// calculate velocity
			var velocity = particles[i].pos.subClone(particles[i].lastPos).scale(this.friction);
			// ground friction
			if (particles[i].pos.y >= this.height - 1 && velocity.lengthSq() > 0.000001) {
				var m = velocity.length();
				velocity.x /= m;
				velocity.y /= m;
				velocity.multiplyScalar(m * this.groundFriction);
			}
			// save last good state
			particles[i].lastPos.set(particles[i].pos.x,particles[i].pos.y);
			// gravity
			particles[i].pos.addSelf(this.gravity);
			// inertia  
			particles[i].pos.addSelf(velocity);
		}
	}
	// handle dragging of entities
	if (this.draggedEntity) this.draggedEntity.pos.set(this.mouse.x,this.mouse.y);
	// relax
	var stepCoef = 1 / step;
	for (c in this.composites) {
		var constraints = this.composites[c].constraints;
		for (i = 0; i < step; ++i)
			for (j in constraints) constraints[j].relax(stepCoef);
	}
	// bounds checking
	for (c in this.composites) {
		var particles = this.composites[c].particles;
		for (i in particles) this.bounds(particles[i]);
	}
}

H.VerletJS.prototype.draw = function () {
	var i, c;
	this.ctx.clearRect(0, 0, this.iCanvas.width, this.iCanvas.height);
	for (c in this.composites) {
		// draw constraints
		if (this.composites[c].drawConstraints) {
			this.composites[c].drawConstraints(this.ctx, this.composites[c]);
		} else {
			var constraints = this.composites[c].constraints;
			for (i in constraints) constraints[i].draw(this.ctx);
		}
		// draw particles
		if (this.composites[c].drawParticles) {
			this.composites[c].drawParticles(this.ctx, this.composites[c]);
		} else {
			var particles = this.composites[c].particles;
			for (i in particles) particles[i].draw(this.ctx);
		}
	}
	// highlight nearest / dragged entity
	var nearest = this.draggedEntity || this.nearestEntity();
	if (nearest) {
		this.ctx.beginPath();
		this.ctx.arc(nearest.pos.x, nearest.pos.y, 8, 0, 2 * PI);
		this.ctx.strokeStyle = this.highlightColor;
		this.ctx.stroke();
	}
}

H.VerletJS.prototype.nearestEntity = function () {
	var c, i;
	var d2Nearest = 0;
	var entity = null;
	var constraintsNearest = null;
	// find nearest point
	for (c in this.composites) {
		var particles = this.composites[c].particles;
		for (i in particles) {
			var d2 = particles[i].pos.distanceToSquared(this.mouse);
			if (d2 <= this.selectionRadius * this.selectionRadius && (entity == null || d2 < d2Nearest)) {
				entity = particles[i];
				constraintsNearest = this.composites[c].constraints;
				d2Nearest = d2;
			}
		}
	}
	// search for pinned constraints for this entity
	for (i in constraintsNearest)
		if (constraintsNearest[i] instanceof H.PinConstraint && constraintsNearest[i].a == entity) entity = constraintsNearest[i];
	return entity;
}

H.DistanceConstraint.prototype.relax = function (stepCoef) {
	var normal = this.a.pos.subClone(this.b.pos);
	var m = normal.lengthSq();
	normal.multiplyScalar(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);
	this.a.pos.addSelf(normal);
	this.b.pos.subSelf(normal);
}

H.DistanceConstraint.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.moveTo(this.a.pos.x, this.a.pos.y);
	ctx.lineTo(this.b.pos.x, this.b.pos.y);
	ctx.strokeStyle = "#d8dde2";
	ctx.stroke();
}

H.PinConstraint.prototype.relax = function (stepCoef) {
	this.a.pos.set(this.pos.x,this.pos.y);
}

H.PinConstraint.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, 3, 0, 2 * PI); //6
	ctx.strokeStyle = "rgba(255,255,255,0.8)";
	ctx.stroke();
}

H.AngleConstraint.prototype.relax = function (stepCoef) {
	var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
	var diff = angle - this.angle;
	if (diff <= -PI) diff += 2 * PI;
	else if (diff >= PI) diff -= 2 * PI;
	diff *= stepCoef * this.stiffness;
	this.a.pos = this.a.pos.rotate(this.b.pos, diff);
	this.c.pos = this.c.pos.rotate(this.b.pos, -diff);
	this.b.pos = this.b.pos.rotate(this.a.pos, diff);
	this.b.pos = this.b.pos.rotate(this.c.pos, -diff);
}

H.AngleConstraint.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.moveTo(this.a.pos.x, this.a.pos.y);
	ctx.lineTo(this.b.pos.x, this.b.pos.y);
	ctx.lineTo(this.c.pos.x, this.c.pos.y);
	var tmp = ctx.lineWidth;
	ctx.lineWidth = 5;
	ctx.strokeStyle = "rgba(255,255,0,0.2)";
	ctx.stroke();
	ctx.lineWidth = tmp;
}

H.VerletJS.prototype.spider = function (origin) {
	var i;
	var legSeg1Stiffness = 0.99;
	var legSeg2Stiffness = 0.99;
	var legSeg3Stiffness = 0.99;
	var legSeg4Stiffness = 0.99;
	var joint1Stiffness = 1;
	var joint2Stiffness = 0.4;
	var joint3Stiffness = 0.9;
	var bodyStiffness = 1;
	var bodyJointStiffness = 1;
	var composite = new H.Composite();
	composite.legs = [];
	composite.thorax = new H.Particle(origin);
	composite.head = new H.Particle(origin.addClone(new H.Vector2(0, -5)));
	composite.abdomen = new H.Particle(origin.addClone(new H.Vector2(0, 10)));
	composite.particles.push(composite.thorax);
	composite.particles.push(composite.head);
	composite.particles.push(composite.abdomen);
	composite.constraints.push(new H.DistanceConstraint(composite.head, composite.thorax, bodyStiffness));
	composite.constraints.push(new H.DistanceConstraint(composite.abdomen, composite.thorax, bodyStiffness));
	composite.constraints.push(new H.AngleConstraint(composite.abdomen, composite.thorax, composite.head, 0.4));
	// legs
	for (i = 0; i < 4; ++i) {
		composite.particles.push(new H.Particle(composite.particles[0].pos.addClone(new H.Vector2(3, (i - 1.5) * 3))));
		composite.particles.push(new H.Particle(composite.particles[0].pos.addClone(new H.Vector2(-3, (i - 1.5) * 3))));
		var len = composite.particles.length;
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 2], composite.thorax, legSeg1Stiffness));
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 1], composite.thorax, legSeg1Stiffness));
		var lenCoef = 1;
		if (i == 1 || i == 2) lenCoef = 0.7;
		else if (i == 3) lenCoef = 0.9;
		composite.particles.push(new H.Particle(composite.particles[len - 2].pos.addClone((new H.Vector2(20, (i - 1.5) * 30)).normal().multiplyScalar(20 * lenCoef))));
		composite.particles.push(new H.Particle(composite.particles[len - 1].pos.addClone((new H.Vector2(-20, (i - 1.5) * 30)).normal().multiplyScalar(20 * lenCoef))));
		len = composite.particles.length;
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 4], composite.particles[len - 2], legSeg2Stiffness));
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 3], composite.particles[len - 1], legSeg2Stiffness));
		composite.particles.push(new H.Particle(composite.particles[len - 2].pos.addClone((new H.Vector2(20, (i - 1.5) * 50)).normal().multiplyScalar(20 * lenCoef))));
		composite.particles.push(new H.Particle(composite.particles[len - 1].pos.addClone((new H.Vector2(-20, (i - 1.5) * 50)).normal().multiplyScalar(20 * lenCoef))));
		len = composite.particles.length;
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 4], composite.particles[len - 2], legSeg3Stiffness));
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 3], composite.particles[len - 1], legSeg3Stiffness));
		var rightFoot = new H.Particle(composite.particles[len - 2].pos.addClone((new H.Vector2(20, (i - 1.5) * 100)).normal().multiplyScalar(12 * lenCoef)));
		var leftFoot = new H.Particle(composite.particles[len - 1].pos.addClone((new H.Vector2(-20, (i - 1.5) * 100)).normal().multiplyScalar(12 * lenCoef)))
		composite.particles.push(rightFoot);
		composite.particles.push(leftFoot);
		composite.legs.push(rightFoot);
		composite.legs.push(leftFoot);
		len = composite.particles.length;
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 4], composite.particles[len - 2], legSeg4Stiffness));
		composite.constraints.push(new H.DistanceConstraint(composite.particles[len - 3], composite.particles[len - 1], legSeg4Stiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[len - 6], composite.particles[len - 4], composite.particles[len - 2], joint3Stiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[len - 6 + 1], composite.particles[len - 4 + 1], composite.particles[len - 2 + 1], joint3Stiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[len - 8], composite.particles[len - 6], composite.particles[len - 4], joint2Stiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[len - 8 + 1], composite.particles[len - 6 + 1], composite.particles[len - 4 + 1], joint2Stiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[0], composite.particles[len - 8], composite.particles[len - 6], joint1Stiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[0], composite.particles[len - 8 + 1], composite.particles[len - 6 + 1], joint1Stiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[1], composite.particles[0], composite.particles[len - 8], bodyJointStiffness));
		composite.constraints.push(new H.AngleConstraint(composite.particles[1], composite.particles[0], composite.particles[len - 8 + 1], bodyJointStiffness));
	}
	this.composites.push(composite);
	return composite;
}

H.VerletJS.prototype.spiderweb = function (origin, radius, segments, depth) {
	var stiffness = 0.6;
	var tensor = 0.3;
	var stride = (2 * PI) / segments;
	var n = segments * depth;
	var radiusStride = radius / n;
	var i, c;
	var composite = new H.Composite();
	// particles
	for (i = 0; i < n; ++i) {
		var theta = i * stride + Cos(i * 0.4) * 0.05 + Cos(i * 0.05) * 0.2;
		var shrinkingRadius = radius - radiusStride * i + Cos(i * 0.1) * 20;
		var offy = Cos(theta * 2.1) * (radius / depth) * 0.2;
		composite.particles.push(new H.Particle(new H.Vector2(origin.x + Cos(theta) * shrinkingRadius, origin.y + Sin(theta) * shrinkingRadius + offy)));
	}

	for (i = 0; i < segments; i += 5)
	{
		var theta = (i + 1.25) * stride;
		composite.pin(i, new H.Vector2(origin.x + Cos(theta) * (radius - 5), origin.y + Sin(theta) * (radius - 5)));
	}
	// constraints
	for (i = 0; i < n - 1; ++i) {
		// neighbor
		composite.constraints.push(new H.DistanceConstraint(composite.particles[i], composite.particles[i + 1], stiffness));
		// span rings
		var off = i + segments;
		if (off < n - 1) composite.constraints.push(new H.DistanceConstraint(composite.particles[i], composite.particles[off], stiffness));
		else composite.constraints.push(new H.DistanceConstraint(composite.particles[i], composite.particles[n - 1], stiffness));
	}
	composite.constraints.push(new H.DistanceConstraint(composite.particles[0], composite.particles[segments - 1], stiffness));
	for (c in composite.constraints) composite.constraints[c].distance *= tensor;
	this.composites.push(composite);
	return composite;
}

H.VerletJS.prototype.crawl = function (leg) {
	var stepRadius = 100;
	var minStepRadius = 35;
	var spiderweb = this.composites[0];
	var spider = this.composites[1];
	var theta = spider.particles[0].pos.angle2(spider.particles[0].pos.addClone(new H.Vector2(1, 0)), spider.particles[1].pos);
	var boundry1 = (new H.Vector2(Cos(theta), Sin(theta)));
	var boundry2 = (new H.Vector2(Cos(theta + PI / 2), Sin(theta + PI / 2)));
	var flag1 = leg < 4 ? 1 : -1;
	var flag2 = leg % 2 == 0 ? 1 : 0;
	var paths = [];
	var i;
	for (i in spiderweb.particles) {
		if (spiderweb.particles[i].pos.subClone(spider.particles[0].pos).dot(boundry1) * flag1 >= 0 && spiderweb.particles[i].pos.subClone(spider.particles[0].pos).dot(boundry2) * flag2 >= 0) {
			var d2 = spiderweb.particles[i].pos.distanceToSquared(spider.particles[0].pos);
			if (!(d2 >= minStepRadius * minStepRadius && d2 <= stepRadius * stepRadius)) continue;
			var leftFoot = false;
			var j;
			for (j in spider.constraints) {
				var k;
				for (k = 0; k < 8; ++k) {
					if (spider.constraints[j] instanceof H.DistanceConstraint && spider.constraints[j].a == spider.legs[k] && spider.constraints[j].b == spiderweb.particles[i]) {
						leftFoot = true;
					}
				}
			}
			if (!leftFoot) paths.push(spiderweb.particles[i]);
		}
	}
	for (i in spider.constraints) {
		if (spider.constraints[i] instanceof H.DistanceConstraint && spider.constraints[i].a == spider.legs[leg]) {
			spider.constraints.splice(i, 1);
			break;
		}
	}
	if (paths.length > 0) {
		shuffle(paths);
		spider.constraints.push(new H.DistanceConstraint(spider.legs[leg], paths[0], 1, 0));
	}
	
	function shuffle(o) {
		for (var j, x, i = o.length; i; j = parseInt(Rnd() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}	
}

//vivus.js

/**
 * Timing functions
 **************************************
 *
 * Default functions to help developers.
 * It always take a number as parameter (between 0 to 1) then
 * return a number (between 0 and 1)
 */
/*
H.L.EASE = function (x) {
	return -Cos(x * PI) / 2 + 0.5;
};
H.L.EASE_OUT = function (x) {
	return 1 - Math.pow(1 - x, 3);
};
H.L.EASE_IN = function (x) {
	return Math.pow(x, 3);
};
H.L.EASE_OUT_BOUNCE = function (x) {
	var base = -Cos(x * (0.5 * PI)) + 1,
		rate = Math.pow(base, 1.5),
		rateR = Math.pow(1 - x, 2),
		progress = -Abs(Cos(rate * (2.5 * PI))) + 1;
	return (1 - rateR) + (progress * rateR);
};
*/

/**
 * Setters
 **************************************
 */
/**
 * Check and set the element in the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param {DOM|String}   element  SVG Dom element or id of it
 */
H.L.prototype.setElement = function (element, options) {
	
	// Set the element
	if (element.constructor === String) {
		element = document.getElementById(element);
	}
	this.parentEl = element;
	// Create the object element if the property `file` exists in the options object
	if (options && options.file) {
		var objElm = document.createElement('object');
		objElm.setAttribute('type', 'image/svg+xml');
		objElm.setAttribute('data', options.file);
		objElm.setAttribute('copyrightml', 'true');
		element.appendChild(objElm);
		element = objElm;
	}
	switch (element.constructor) {
	case window['SVGSVGElement']:
	case window['SVGElement']:
		this.el = element;
		this.isReady = true;
		break;
	case window.HTMLObjectElement:
		// If we have to wait for it
		var onLoad, self;
		self = this;
		onLoad = function (e) {
			if (self.isReady) {
				return;
			}
			self.el = element.contentDocument && element.contentDocument.querySelector('svg');
			if (self.el) {
				if (element.getAttribute('copyrightml')) {
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
	}
};
/**
 * Set up user option to the instance
 * The method will not return anything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {object} options Object from the constructor
 */
H.L.prototype.setOptions = function (options) {
	// Basic check
	//{
		options = options || {};
	//}
	// Set the animation type
	//{
		//var allowedTypes = ['d', 'a', 'o', 's', 'c']; //['delayed', 'async', 'oneByOne', 'scenario', 'scenario-sync'];
		if (options && options.file)
			this.type = options.type || 'o';
		else
			this.type = options.type || 'c';//allowedTypes[4];
	//}
	// Set the start type
	//{
		//var allowedStarts = ['i', 'm', 'a']; //['inViewport', 'manual', 'autostart'];
		this.start = options.start || 'a';//allowedStarts[2];
	//}
	this.isIE = (window.navigator.userAgent.indexOf('MSIE') !== -1 || window.navigator.userAgent.indexOf('Trident/') !== -1 || window.navigator.userAgent.indexOf('Edge/') !== -1);
	this.duration = parsePositiveInt(options.duration, 50);
	this.delay = parsePositiveInt(options.delay, null);
	this.dashGap = parsePositiveInt(options.dashGap, 5);
	this.forceRender = options.hasOwnProperty('forceRender') ? !!options.forceRender : this.isIE;
	this.selfDestroy = !!options.selfDestroy;
	this.onReady = options.onReady;
	this.map = new Array();
	this.frameLength = this.currentFrame = this.delayUnit = this.speed = this.handle = null;
	this.ignoreInvisible = options.hasOwnProperty('ignoreInvisible') ? !!options.ignoreInvisible : false;
	this.animTimingFunction = options.animTimingFunction || H.LINEAR;
	this.pathTimingFunction = options.pathTimingFunction || H.LINEAR;
};
/**
 * Set up callback to the instance
 * The method will not return enything, but will throw an
 * error if the parameter is invalid
 *
 * @param  {Function} callback Callback for the animation end
 */
H.L.prototype.setCallback = function (callback) {
	// Basic check
	this.callback = callback || function () {};
};
/**
 * Core
 **************************************
 */
/**
 * Map the svg, path by path.
 * The method return nothing, it just fill the
 * `map` array. Each item in this array represent
 * a path element from the SVG, with informations for
 * the animation.
 *
 * ```
 * [
 *   {
 *     el: <DOMobj> the path element
 *     length: <number> length of the path line
 *     startAt: <number> time start of the path animation (in frames)
 *     duration: <number> path animation duration (in frames)
 *   },
 *   ...
 * ]
 * ```
 *
 */
H.L.prototype.mapping = function () {
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
			length: Ceil(path['getTotalLength']())
		};
		// Test if the path length is correct
		if (isNaN(pathObj.length)) {
			continue;
		}
		this.map.push(pathObj);
		path.style['strokeDasharray'] = pathObj.length + ' ' + (pathObj.length + this.dashGap * 2);
		path.style['strokeDashoffset'] = pathObj.length + this.dashGap;
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
		case 'd':
			pathObj.startAt = this.delayUnit * i;
			pathObj.duration = this.duration - this.delay;
			break;
		case 'o':
			pathObj.startAt = lengthMeter / totalLength * this.duration;
			pathObj.duration = pathObj.length / totalLength * this.duration;
			break;
		case 'a':
			pathObj.startAt = 0;
			pathObj.duration = this.duration;
			break;
		case 'c':
			path = pathObj.el;
			pAttrs = this.parseAttr(path);
			pathObj.startAt = timePoint + (parsePositiveInt(pAttrs['data-delay'], this.delayUnit) || 0);
			pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
			timePoint = pAttrs['data-async'] !== undefined ? pathObj.startAt : pathObj.startAt + pathObj.duration;
			this.frameLength = Max(this.frameLength, (pathObj.startAt + pathObj.duration));
			break;
		case 's':
			path = pathObj.el;
			pAttrs = this.parseAttr(path);
			pathObj.startAt = parsePositiveInt(pAttrs['data-start'], this.delayUnit) || 0;
			pathObj.duration = parsePositiveInt(pAttrs['data-duration'], this.duration);
			this.frameLength = Max(this.frameLength, (pathObj.startAt + pathObj.duration));
			break;
		}
		lengthMeter += pathObj.length;
		this.frameLength = this.frameLength || this.duration;
	}
};
/**
 * Interval method to draw the SVG from current
 * position of the animation. It update the value of
 * `currentFrame` and re-trace the SVG.
 *
 * It use this.handle to store the requestAnimationFram
 * and clear it one the animation is stopped. So this
 * attribute can be used to know if the animation is
 * playing.
 *
 * Once the animation at the end, this method will
 * trigger the L callback.
 *
 */
H.L.prototype.drawer = function () {
	var self = this;
	this.currentFrame += this.speed;
	if (this.currentFrame <= 0) {
		this.stop();
		//reset=r
		this.r();
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
		this.handle = requestAnimFrame(function () {
			self.drawer();
		});
	}
};
/**
 * Draw the SVG at the current instant from the
 * `currentFrame` value. Here is where most of the magic is.
 * The trick is to use the `strokeDashoffset` style property.
 *
 * For optimisation reasons, a new property called `progress`
 * is added in each item of `map`. This one contain the current
 * progress of the path element. Only if the new value is different
 * the new value will be applied to the DOM element. This
 * method save a lot of resources to re-render the SVG. And could
 * be improved if the animation couldn't be played forward.
 *
 */
H.L.prototype.trace = function () {
	var i, progress, path, currentFrame;
	currentFrame = this.animTimingFunction(this.currentFrame / this.frameLength) * this.frameLength;
	for (i = 0; i < this.map.length; i++) {
		path = this.map[i];
		progress = (currentFrame - path.startAt) / path.duration;
		progress = this.pathTimingFunction(Max(0, Min(1, progress)));
		if (path.progress !== progress) {
			path.progress = progress;
			path.el.style['strokeDashoffset'] = Floor(path.length * (1 - progress));
			this.renderPath(i);
		}
	}
};
/**
 * Method forcing the browser to re-render a path element
 * from it's index in the map. Depending on the `forceRender`
 * value.
 * The trick is to replace the path element by it's clone.
 * This practice is not recommended because it's asking more
 * ressources, too much DOM manupulation..
 * but it's the only way to let the magic happen on IE.
 * By default, this fallback is only applied on IE.
 *
 * @param  {Number} index Path index
 */
H.L.prototype.renderPath = function (index) {
	if (this.forceRender && this.map && this.map[index]) {
		var pathObj = this.map[index],
			newPath = pathObj.el.cloneNode(true);
		pathObj.el.parentNode.replaceChild(newPath, pathObj.el);
		pathObj.el = newPath;
	}
};
/**
 * When the SVG object is loaded and ready,
 * this method will continue the initialisation.
 *
 * This this mainly due to the case of passing an
 * object tag in the constructor. It will wait
 * the end of the loading to initialise.
 *
 */
H.L.prototype.init = function () {
	// Set object variables
	this.frameLength = 0;
	this.currentFrame = 0;
	this.map = [];
	// Start
	new H.Pathformer(this.el);
	this.mapping();
	this.starter();
	if (this.onReady) {
		this.onReady(this);
	}
};
/**
 * Trigger to start of the animation.
 * Depending on the `start` value, a different
 * will be applied.
 *
 * If the `start` value is not valid, an error will be thrown.
 * Even if technically, this is impossible.
 *
 */
H.L.prototype.starter = function () {
	switch (this.start) {
	case 'm':
		return;
	case 'a':
	//play=p
		this.p();
		break;
	case 'i':
		var self = this,
			listener = function () {
				if (self.isInViewport(self.parentEl, 1)) {
					self.p();
					window.removeEventListener('scroll', listener);
				}
			};
		window.addEventListener('scroll', listener);
		listener();
		break;
	}
};
/**
 * Controls
 **************************************
 */
/**
 * Get the current status of the animation between
 * three different states: 'start', 'progress', 'end'.
 * @return {string} Instance status
 */
H.L.prototype.getStatus = function () {
	return this.currentFrame === 0 ? 'start' : this.currentFrame === this.frameLength ? 'end' : 'progress';
};
/**
 * Reset the instance to the initial state : undraw
 * Be careful, it just reset the animation, if you're
 * playing the animation, this won't stop it. But just
 * make it start from start.
 *
 */
H.L.prototype.r = function () {
	return this.setFrameProgress(0);
};


/**
 * Set the instance to the final state : drawn
 * Be careful, it just set the animation, if you're
 * playing the animation on rewind, this won't stop it.
 * But just make it start from the end.
 *
 */
H.L.prototype.finish = function () {
	return this.setFrameProgress(1);
};
/**
 * Set the level of progress of the drawing.
 *
 * @param {number} progress Level of progress to set
 */
H.L.prototype.setFrameProgress = function (progress) {
	progress = Min(1, Max(0, progress));
	this.currentFrame = Math.round(this.frameLength * progress);
	this.trace();
	return this;
};
/**
 * Play the animation at the desired speed.
 * Speed must be a valid number (no zero).
 * By default, the speed value is 1.
 * But a negative value is accepted to go forward.
 *
 * And works with float too.
 * But don't forget we are in JavaScript, se be nice
 * with him and give him a 1/2^x value.
 *
 * @param  {number} speed Animation speed [optional]
 */
H.L.prototype.p = function (speed) {
	this.speed = speed || 1;
	if (!this.handle) {
		this.drawer();
	}
	return this;
};
/**
 * Stop the current animation, if on progress.
 * Should not trigger any error.
 *
 */
H.L.prototype.stop = function () {
	if (this.handle) {
		cancelAnimFrame(this.handle);
		this.handle = null;
	}
	return this;
};
/**
 * Destroy the instance.
 * Remove all bad styling attributes on all
 * path tags
 *
 */
H.L.prototype.destroy = function () {
	this.stop();
	var i, path;
	for (i = 0; i < this.map.length; i++) {
		path = this.map[i];
		path.el.style['strokeDashoffset'] = null;
		path.el.style['strokeDasharray'] = null;
		this.renderPath(i);
	}
};
/**
 * Utils methods
 * include methods from Codrops
 **************************************
 */
/**
 * Method to best guess if a path should added into
 * the animation or not.
 *
 * 1. Use the `data-vivus-ignore` attribute if set
 * 2. Check if the instance must ignore invisible paths
 * 3. Check if the path is visible
 *
 * For now the visibility checking is unstable.
 * It will be used for a beta phase.
 *
 * Other improvments are planned. Like detecting
 * is the path got a stroke or a valid opacity.
 */
H.L.prototype.isInvisible = function (el) {
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
/**
 * Parse attributes of a DOM element to
 * get an object of {attributeName => attributeValue}
 *
 * @param  {object} element DOM element to parse
 * @return {object}         Object of attributes
 */
H.L.prototype.parseAttr = function (element) {
	var attr, output = {};
	if (element && element.attributes) {
		for (var i = 0; i < element.attributes.length; i++) {
			attr = element.attributes[i];
			output[attr.name] = attr.value;
		}
	}
	return output;
};
/**
 * Reply if an element is in the page viewport
 *
 * @param  {object} el Element to observe
 * @param  {number} h  Percentage of height
 * @return {boolean}
 */
H.L.prototype.isInViewport = function (el, h) {
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
/**
 * Alias for document element
 *
 * @type {DOMelement}
 */
H.L.prototype.docElem = window.document.documentElement;
/**
 * Get the viewport height in pixels
 *
 * @return {integer} Viewport height
 */
H.L.prototype.getViewportH = function () {
	var client = this.docElem.clientHeight,
		inner = window.innerHeight;
	if (client < inner) {
		return inner;
	} else {
		return client;
	}
};
/**
 * Get the page Y offset
 *
 * @return {integer} Page Y offset
 */
H.L.prototype.scrollY = function () {
	return window.pageYOffset || this.docElem.scrollTop;
};
/**
 * Alias for `requestAnimationFram` or
 * `setTimeout` function for deprecated browsers.
 *
 */
/**
 * Alias for `cancelAnimationFrame` or
 * `cancelTimeout` function for deprecated browsers.
 *
 */

/**
 * Parse string to integer.
 * If the number is not positive or null
 * the method will return the default value
 * or 0 if undefined
 *
 * @param {string} value String to parse
 * @param {*} defaultValue Value to return if the result parsed is invalid
 * @return {number}
 *
 */

//H.js


H.Vector3.prototype = {
	constructor: H.Vector3,
	set: function (a, b, c) {
		this.x = a;
		this.y = b;
		this.z = c;
		return this
	},
	setX: function (a) {
		this.x = a;
		return this
	},
	setY: function (a) {
		this.y = a;
		return this
	},
	setZ: function (a) {
		this.z = a;
		return this
	},
	copy: function (a) {
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
		return this
	},
	add: function (a, b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		return this
	},
	addSelf: function (a) {
		this.x = this.x + a.x;
		this.y = this.y + a.y;
		this.z = this.z + a.z;
		return this
	},
	addScalar: function (a) {
		this.x = this.x + a;
		this.y = this.y + a;
		this.z = this.z + a;
		return this
	},
	sub: function (a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this
	},
	subSelf: function (a) {
		this.x = this.x - a.x;
		this.y = this.y - a.y;
		this.z = this.z - a.z;
		return this
	},
	multiply: function (a, b) {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
		return this
	},
	multiplySelf: function (a) {
		this.x = this.x * a.x;
		this.y = this.y * a.y;
		this.z = this.z * a.z;
		return this
	},
	multiplyScalar: function (a) {
		this.x = this.x * a;
		this.y = this.y * a;
		this.z = this.z * a;
		return this
	},
	divideSelf: function (a) {
		this.x = this.x / a.x;
		this.y = this.y / a.y;
		this.z = this.z / a.z;
		return this
	},
	divideScalar: function (a) {
		if (a) {
			this.x = this.x / a;
			this.y = this.y / a;
			this.z = this.z / a
		} else this.z = this.y = this.x = 0;
		return this
	},
	negate: function () {
		return this.multiplyScalar(-1)
	},
	dot: function (a) {
		return this.x * a.x + this.y * a.y + this.z * a.z
	},
	lengthSq: function () {
		return this.x * this.x + this.y * this.y + this.z * this.z
	},
	length: function () {
		return Sqrt(this.lengthSq())
	},
	lengthManhattan: function () {
		return Abs(this.x) + Abs(this.y) + Abs(this.z)
	},
	normalize: function () {
		return this.divideScalar(this.length())
	},
	setLength: function (a) {
		return this.normalize().multiplyScalar(a)
	},
	lerpSelf: function (a, b) {
		this.x = this.x + (a.x - this.x) * b;
		this.y = this.y + (a.y - this.y) * b;
		this.z = this.z + (a.z - this.z) * b;
		return this
	},
	cross: function (a, b) {
		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;
		return this
	},
	crossSelf: function (a) {
		var b = this.x,
			c = this.y,
			d = this.z;
		this.x = c * a.z - d * a.y;
		this.y = d * a.x - b * a.z;
		this.z = b * a.y - c * a.x;
		return this
	},
	distanceTo: function (a) {
		return Sqrt(this.distanceToSquared(a))
	},
	distanceToSquared: function (a) {
		return (new H.Vector3).sub(this, a).lengthSq()
	},
	getPositionFromMatrix: function (a) {
		this.x = a.elements[12];
		this.y = a.elements[13];
		this.z = a.elements[14];
		return this
	},
	setEulerFromRotationMatrix: function (a, b) {
		function c(a) {
			return Min(Max(a, -1), 1)
		}
		var d = a.elements,
			e = d[0],
			f = d[4],
			g = d[8],
			i = d[1],
			j = d[5],
			k = d[9],
			h = d[2],
			l = d[6],
			d = d[10];
		if (b === void 0 || b === "XYZ") {
			this.y = Asin(c(g));
			if (Abs(g) < 0.99999) {
				this.x = Atan2(-k, d);
				this.z = Atan2(-f, e)
			} else {
				this.x = Atan2(i, j);
				this.z = 0
			}
		} else if (b === "YXZ") {
			this.x = Asin(-c(k));
			if (Abs(k) < 0.99999) {
				this.y = Atan2(g, d);
				this.z = Atan2(i, j)
			} else {
				this.y = Atan2(-h, e);
				this.z = 0
			}
		} else if (b === "ZXY") {
			this.x = Asin(c(l));
			if (Abs(l) < 0.99999) {
				this.y = Atan2(-h, d);
				this.z = Atan2(-f, j)
			} else {
				this.y = 0;
				this.z = Atan2(g, e)
			}
		} else if (b === "ZYX") {
			this.y = Asin(-c(h));
			if (Abs(h) < 0.99999) {
				this.x = Atan2(l, d);
				this.z = Atan2(i, e)
			} else {
				this.x = 0;
				this.z = Atan2(-f, j)
			}
		} else if (b === "YZX") {
			this.z = Asin(c(i));
			if (Abs(i) < 0.99999) {
				this.x = Atan2(-k, j);
				this.y = Atan2(-h, e)
			} else {
				this.x = 0;
				this.y = Atan2(h, d)
			}
		} else if (b === "XZY") {
			this.z = Asin(-c(f));
			if (Abs(f) < 0.99999) {
				this.x = Atan2(l, j);
				this.y = Atan2(g, e)
			} else {
				this.x = Atan2(-g, d);
				this.y = 0
			}
		}
		return this
	},
	setEulerFromQuaternion: function (a, b) {
		function c(a) {
			return Min(Max(a, -1), 1)
		}
		var d = a.x * a.x,
			e = a.y * a.y,
			f = a.z * a.z,
			g = a.w * a.w;
		if (b === void 0 || b === "XYZ") {
			this.x = Atan2(2 * (a.x * a.w - a.y * a.z), g - d - e + f);
			this.y = Asin(c(2 * (a.x * a.z + a.y * a.w)));
			this.z = Atan2(2 * (a.z * a.w - a.x * a.y), g + d - e - f)
		} else if (b === "YXZ") {
			this.x = Asin(c(2 * (a.x * a.w - a.y * a.z)));
			this.y = Atan2(2 * (a.x * a.z + a.y * a.w), g - d - e + f);
			this.z = Atan2(2 * (a.x * a.y + a.z * a.w), g - d + e - f)
		} else if (b === "ZXY") {
			this.x = Asin(c(2 * (a.x * a.w + a.y * a.z)));
			this.y = Atan2(2 * (a.y * a.w - a.z * a.x), g - d - e + f);
			this.z = Atan2(2 * (a.z * a.w - a.x * a.y), g - d + e - f)
		} else if (b === "ZYX") {
			this.x = Atan2(2 * (a.x * a.w + a.z * a.y), g - d - e + f);
			this.y = Asin(c(2 * (a.y * a.w - a.x * a.z)));
			this.z = Atan2(2 * (a.x * a.y + a.z * a.w), g + d - e - f)
		} else if (b === "YZX") {
			this.x = Atan2(2 * (a.x * a.w - a.z * a.y), g - d + e - f);
			this.y = Atan2(2 * (a.y * a.w - a.x * a.z), g + d - e - f);
			this.z = Asin(c(2 * (a.x * a.y + a.z * a.w)))
		} else if (b === "XZY") {
			this.x = Atan2(2 * (a.x * a.w + a.y * a.z), g - d + e - f);
			this.y = Atan2(2 * (a.x * a.z + a.y * a.w), g + d - e - f);
			this.z = Asin(c(2 * (a.z * a.w - a.x * a.y)))
		}
		return this
	},
	getScaleFromMatrix: function (a) {
		var b = this.set(a.elements[0], a.elements[1], a.elements[2]).length(),
			c = this.set(a.elements[4], a.elements[5], a.elements[6]).length(),
			a = this.set(a.elements[8], a.elements[9], a.elements[10]).length();
		this.x = b;
		this.y = c;
		this.z = a;
		return this
	},
	equals: function (a) {
		return a.x === this.x && a.y === this.y && a.z === this.z
	},
	isZero: function () {
		return this.lengthSq() < 1E-4
	},
	clone: function () {
		return new H.Vector3(this.x, this.y, this.z)
	}
};

H.Matrix4.prototype = {
	constructor: H.Matrix4,
	set: function (a, b, c, d, e, f, g, i, j, k, h, l, m, o, n, p) {
		var q = this.elements;
		q[0] = a;
		q[4] = b;
		q[8] = c;
		q[12] = d;
		q[1] = e;
		q[5] = f;
		q[9] = g;
		q[13] = i;
		q[2] = j;
		q[6] = k;
		q[10] = h;
		q[14] = l;
		q[3] = m;
		q[7] = o;
		q[11] = n;
		q[15] = p;
		return this
	},
	identity: function () {
		this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
		return this
	},
	copy: function (a) {
		a = a.elements;
		this.set(a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]);
		return this
	},
	lookAt: function (a, b, c) {
		var d = this.elements,
			e = H.Matrix4.__v1,
			f = H.Matrix4.__v2,
			g = H.Matrix4.__v3;
		g.sub(a, b).normalize();
		if (g.length() === 0) g.z = 1;
		e.cross(c, g).normalize();
		if (e.length() === 0) {
			g.x = g.x + 1E-4;
			e.cross(c, g).normalize()
		}
		f.cross(g, e);
		d[0] = e.x;
		d[4] = f.x;
		d[8] = g.x;
		d[1] = e.y;
		d[5] = f.y;
		d[9] = g.y;
		d[2] = e.z;
		d[6] = f.z;
		d[10] = g.z;
		return this
	},
	multiply: function (a, b) {
		var c = a.elements,
			d = b.elements,
			e = this.elements,
			f = c[0],
			g = c[4],
			i = c[8],
			j = c[12],
			k = c[1],
			h = c[5],
			l = c[9],
			m = c[13],
			o = c[2],
			n = c[6],
			p = c[10],
			q = c[14],
			t = c[3],
			J = c[7],
			C = c[11],
			c = c[15],
			G = d[0],
			K = d[4],
			E = d[8],
			r = d[12],
			Hh = d[1],
			D = d[5],
			P = d[9],
			u = d[13],
			w = d[2],
			v = d[6],
			x = d[10],
			R = d[14],
			T = d[3],
			L = d[7],
			M = d[11],
			d = d[15];
		e[0] = f * G + g * Hh + i * w + j * T;
		e[4] = f * K + g * D + i * v + j * L;
		e[8] = f * E + g * P + i * x + j * M;
		e[12] = f * r + g * u + i * R + j * d;
		e[1] = k * G + h * Hh + l * w + m * T;
		e[5] = k * K + h * D + l * v + m * L;
		e[9] = k * E + h * P + l * x + m * M;
		e[13] = k * r + h * u + l * R + m * d;
		e[2] = o * G + n * Hh + p * w + q * T;
		e[6] = o * K + n * D + p * v + q * L;
		e[10] = o * E + n * P + p * x + q * M;
		e[14] = o * r + n * u + p * R + q * d;
		e[3] = t * G + J * Hh + C * w + c * T;
		e[7] = t * K + J * D + C * v + c * L;
		e[11] = t * E + J * P + C * x + c * M;
		e[15] = t * r + J * u + C * R + c * d;
		return this
	},
	multiplySelf: function (a) {
		return this.multiply(this, a)
	},
	multiplyToArray: function (a, b, c) {
		var d = this.elements;
		this.multiply(a, b);
		c[0] = d[0];
		c[1] = d[1];
		c[2] = d[2];
		c[3] = d[3];
		c[4] = d[4];
		c[5] = d[5];
		c[6] = d[6];
		c[7] = d[7];
		c[8] = d[8];
		c[9] = d[9];
		c[10] = d[10];
		c[11] = d[11];
		c[12] = d[12];
		c[13] = d[13];
		c[14] = d[14];
		c[15] = d[15];
		return this
	},
	multiplyScalar: function (a) {
		var b = this.elements;
		b[0] = b[0] * a;
		b[4] = b[4] * a;
		b[8] = b[8] * a;
		b[12] = b[12] * a;
		b[1] = b[1] * a;
		b[5] = b[5] * a;
		b[9] = b[9] * a;
		b[13] = b[13] * a;
		b[2] = b[2] * a;
		b[6] = b[6] * a;
		b[10] = b[10] * a;
		b[14] = b[14] * a;
		b[3] = b[3] * a;
		b[7] = b[7] * a;
		b[11] = b[11] * a;
		b[15] = b[15] * a;
		return this
	},
	multiplyVector3: function (a) {
		var b = this.elements,
			c = a.x,
			d = a.y,
			e = a.z,
			f = 1 / (b[3] * c + b[7] * d + b[11] * e + b[15]);
		a.x = (b[0] * c + b[4] * d + b[8] * e + b[12]) * f;
		a.y = (b[1] * c + b[5] * d + b[9] * e + b[13]) * f;
		a.z = (b[2] * c + b[6] * d + b[10] * e + b[14]) * f;
		return a
	},
	multiplyVector4: function (a) {
		var b = this.elements,
			c = a.x,
			d = a.y,
			e = a.z,
			f = a.w;
		a.x = b[0] * c + b[4] * d + b[8] * e + b[12] * f;
		a.y = b[1] * c + b[5] * d + b[9] * e + b[13] * f;
		a.z = b[2] * c + b[6] * d + b[10] * e + b[14] * f;
		a.w = b[3] * c + b[7] * d + b[11] * e + b[15] * f;
		return a
	},
	multiplyVector3Array: function (a) {
		for (var b = H.Matrix4.__v1,
			c = 0, d = a.length; c < d; c = c + 3) {
			b.x = a[c];
			b.y = a[c + 1];
			b.z = a[c + 2];
			this.multiplyVector3(b);
			a[c] = b.x;
			a[c + 1] = b.y;
			a[c + 2] = b.z
		}
		return a
	},
	rotateAxis: function (a) {
		var b = this.elements,
			c = a.x,
			d = a.y,
			e = a.z;
		a.x = c * b[0] + d * b[4] + e * b[8];
		a.y = c * b[1] + d * b[5] + e * b[9];
		a.z = c * b[2] + d * b[6] + e * b[10];
		a.normalize();
		return a
	},
	determinant: function () {
		var a = this.elements,
			b = a[0],
			c = a[4],
			d = a[8],
			e = a[12],
			f = a[1],
			g = a[5],
			i = a[9],
			j = a[13],
			k = a[2],
			h = a[6],
			l = a[10],
			m = a[14],
			o = a[3],
			n = a[7],
			p = a[11],
			a = a[15];
		return e * i * h * o - d * j * h * o - e * g * l * o + c * j * l * o + d * g * m * o - c * i * m * o - e * i * k * n + d * j * k * n + e * f * l * n - b * j * l * n - d * f * m * n + b * i * m * n + e * g * k * p - c * j * k * p - e * f * h * p + b * j * h * p + c * f * m * p - b * g * m * p - d * g * k * a + c * i * k * a + d * f * h * a - b * i * h * a - c * f * l * a + b * g * l * a
	},
	transpose: function () {
		var a = this.elements,
			b;
		b = a[1];
		a[1] = a[4];
		a[4] = b;
		b = a[2];
		a[2] = a[8];
		a[8] = b;
		b = a[6];
		a[6] = a[9];
		a[9] = b;
		b = a[3];
		a[3] = a[12];
		a[12] = b;
		b = a[7];
		a[7] = a[13];
		a[13] = b;
		b = a[11];
		a[11] = a[14];
		a[14] = b;
		return this
	},
	flattenToArray: function (a) {
		var b = this.elements;
		a[0] = b[0];
		a[1] = b[1];
		a[2] = b[2];
		a[3] = b[3];
		a[4] = b[4];
		a[5] = b[5];
		a[6] = b[6];
		a[7] = b[7];
		a[8] = b[8];
		a[9] = b[9];
		a[10] = b[10];
		a[11] = b[11];
		a[12] = b[12];
		a[13] = b[13];
		a[14] = b[14];
		a[15] = b[15];
		return a
	},
	flattenToArrayOffset: function (a, b) {
		var c = this.elements;
		a[b] = c[0];
		a[b + 1] = c[1];
		a[b + 2] = c[2];
		a[b + 3] = c[3];
		a[b + 4] = c[4];
		a[b + 5] = c[5];
		a[b + 6] = c[6];
		a[b + 7] = c[7];
		a[b + 8] = c[8];
		a[b + 9] = c[9];
		a[b + 10] = c[10];
		a[b + 11] = c[11];
		a[b + 12] = c[12];
		a[b + 13] = c[13];
		a[b + 14] = c[14];
		a[b + 15] = c[15];
		return a
	},
	getPosition: function () {
		var a = this.elements;
		return H.Matrix4.__v1.set(a[12], a[13], a[14])
	},
	setPosition: function (a) {
		var b = this.elements;
		b[12] = a.x;
		b[13] = a.y;
		b[14] = a.z;
		return this
	},
	getColumnX: function () {
		var a = this.elements;
		return H.Matrix4.__v1.set(a[0], a[1], a[2])
	},
	getColumnY: function () {
		var a = this.elements;
		return H.Matrix4.__v1.set(a[4], a[5], a[6])
	},
	getColumnZ: function () {
		var a = this.elements;
		return H.Matrix4.__v1.set(a[8], a[9], a[10])
	},
	getInverse: function (a) {
		var b = this.elements,
			c = a.elements,
			d = c[0],
			e = c[4],
			f = c[8],
			g = c[12],
			i = c[1],
			j = c[5],
			k = c[9],
			h = c[13],
			l = c[2],
			m = c[6],
			o = c[10],
			n = c[14],
			p = c[3],
			q = c[7],
			t = c[11],
			c = c[15];
		b[0] = k * n * q - h * o * q + h * m * t - j * n * t - k * m * c + j * o * c;
		b[4] = g * o * q - f * n * q - g * m * t + e * n * t + f * m * c - e * o * c;
		b[8] = f * h * q - g * k * q + g * j * t - e * h * t - f * j * c + e * k * c;
		b[12] = g * k * m - f * h * m - g * j * o + e * h * o + f * j * n - e * k * n;
		b[1] = h * o * p - k * n * p - h * l * t + i * n * t + k * l * c - i * o * c;
		b[5] = f * n * p - g * o * p + g * l * t - d * n * t - f * l * c + d * o * c;
		b[9] = g * k * p - f * h * p - g * i * t + d * h * t + f * i * c - d * k * c;
		b[13] = f * h * l - g * k * l + g * i * o - d * h * o - f * i * n + d * k * n;
		b[2] = j * n * p - h * m * p + h * l * q - i * n * q - j * l * c + i * m * c;
		b[6] = g * m * p - e * n * p - g * l * q + d * n * q + e * l * c - d * m * c;
		b[10] = e * h * p - g * j * p + g * i * q - d * h * q - e * i * c + d * j * c;
		b[14] = g * j * l - e * h * l - g * i * m + d * h * m + e * i * n - d * j * n;
		b[3] = k * m * p - j * o * p - k * l * q + i * o * q + j * l * t - i * m * t;
		b[7] = e * o * p - f * m * p + f * l * q - d * o * q - e * l * t + d * m * t;
		b[11] = f * j * p - e * k * p - f * i * q + d * k * q + e * i * t - d * j * t;
		b[15] = e * k * l - f * j * l + f * i * m - d * k * m - e * i * o + d * j * o;
		this.multiplyScalar(1 / a.determinant());
		return this
	},
	setRotationFromEuler: function (a, b) {
		var c = this.elements,
			d = a.x,
			e = a.y,
			f = a.z,
			g = Cos(d),
			d = Sin(d),
			i = Cos(e),
			e = Sin(e),
			j = Cos(f),
			f = Sin(f);
		if (b === void 0 || b === "XYZ") {
			var k = g * j,
				h = g * f,
				l = d * j,
				m = d * f;
			c[0] = i * j;
			c[4] = -i * f;
			c[8] = e;
			c[1] = h + l * e;
			c[5] = k - m * e;
			c[9] = -d * i;
			c[2] = m - k * e;
			c[6] = l + h * e;
			c[10] = g * i
		} else if (b === "YXZ") {
			k = i * j;
			h = i * f;
			l = e * j;
			m = e * f;
			c[0] = k + m * d;
			c[4] = l * d - h;
			c[8] = g * e;
			c[1] = g * f;
			c[5] = g * j;
			c[9] = -d;
			c[2] = h * d - l;
			c[6] = m + k * d;
			c[10] = g * i
		} else if (b === "ZXY") {
			k = i * j;
			h = i * f;
			l = e * j;
			m = e * f;
			c[0] = k - m * d;
			c[4] = -g * f;
			c[8] = l + h * d;
			c[1] = h + l * d;
			c[5] = g * j;
			c[9] = m - k * d;
			c[2] = -g * e;
			c[6] = d;
			c[10] = g * i
		} else if (b === "ZYX") {
			k = g * j;
			h = g * f;
			l = d * j;
			m = d * f;
			c[0] = i * j;
			c[4] = l * e - h;
			c[8] = k * e + m;
			c[1] = i * f;
			c[5] = m * e + k;
			c[9] = h * e - l;
			c[2] = -e;
			c[6] = d * i;
			c[10] = g * i
		} else if (b === "YZX") {
			k = g * i;
			h = g * e;
			l = d * i;
			m = d * e;
			c[0] = i * j;
			c[4] = m - k * f;
			c[8] = l * f + h;
			c[1] = f;
			c[5] = g * j;
			c[9] = -d * j;
			c[2] = -e * j;
			c[6] = h * f + l;
			c[10] = k - m * f
		} else if (b === "XZY") {
			k = g * i;
			h = g * e;
			l = d * i;
			m = d * e;
			c[0] = i * j;
			c[4] = -f;
			c[8] = e * j;
			c[1] = k * f + m;
			c[5] = g * j;
			c[9] = h * f - l;
			c[2] = l * f - h;
			c[6] = d * j;
			c[10] = m * f + k
		}
		return this
	},
	setRotationFromQuaternion: function (a) {
		var b = this.elements,
			c = a.x,
			d = a.y,
			e = a.z,
			f = a.w,
			g = c + c,
			i = d + d,
			j = e + e,
			a = c * g,
			k = c * i,
			c = c * j,
			h = d * i,
			d = d * j,
			e = e * j,
			g = f * g,
			i = f * i,
			f = f * j;
		b[0] = 1 - (h + e);
		b[4] = k - f;
		b[8] = c + i;
		b[1] = k + f;
		b[5] = 1 - (a + e);
		b[9] = d - g;
		b[2] = c - i;
		b[6] = d + g;
		b[10] = 1 - (a + h);
		return this
	},
	
	extractPosition: function (a) {
		var b = this.elements,
			a = a.elements;
		b[12] = a[12];
		b[13] = a[13];
		b[14] = a[14];
		return this
	},
	extractRotation: function (a) {
		var b = this.elements,
			a = a.elements,
			c = H.Matrix4.__v1,
			d = 1 / c.set(a[0], a[1], a[2]).length(),
			e = 1 / c.set(a[4], a[5], a[6]).length(),
			c = 1 / c.set(a[8], a[9], a[10]).length();
		b[0] = a[0] * d;
		b[1] = a[1] * d;
		b[2] = a[2] * d;
		b[4] = a[4] * e;
		b[5] = a[5] * e;
		b[6] = a[6] * e;
		b[8] = a[8] * c;
		b[9] = a[9] * c;
		b[10] = a[10] * c;
		return this
	},
	translate: function (a) {
		var b = this.elements,
			c = a.x,
			d = a.y,
			a = a.z;
		b[12] = b[0] * c + b[4] * d + b[8] * a + b[12];
		b[13] = b[1] * c + b[5] * d + b[9] * a + b[13];
		b[14] = b[2] * c + b[6] * d + b[10] * a + b[14];
		b[15] = b[3] * c + b[7] * d + b[11] * a + b[15];
		return this
	},
	rotateX: function (a) {
		var b = this.elements,
			c = b[4],
			d = b[5],
			e = b[6],
			f = b[7],
			g = b[8],
			i = b[9],
			j = b[10],
			k = b[11],
			h = Cos(a),
			a = Sin(a);
		b[4] = h * c + a * g;
		b[5] = h * d + a * i;
		b[6] = h * e + a * j;
		b[7] = h * f + a * k;
		b[8] = h * g - a * c;
		b[9] = h * i - a * d;
		b[10] = h * j - a * e;
		b[11] = h * k - a * f;
		return this
	},
	rotateY: function (a) {
		var b = this.elements,
			c = b[0],
			d = b[1],
			e = b[2],
			f = b[3],
			g = b[8],
			i = b[9],
			j = b[10],
			k = b[11],
			h = Cos(a),
			a = Sin(a);
		b[0] = h * c - a * g;
		b[1] = h * d - a * i;
		b[2] = h * e - a * j;
		b[3] = h * f - a * k;
		b[8] = h * g + a * c;
		b[9] = h * i + a * d;
		b[10] = h * j + a * e;
		b[11] = h * k + a * f;
		return this
	},
	rotateZ: function (a) {
		var b = this.elements,
			c = b[0],
			d = b[1],
			e = b[2],
			f = b[3],
			g = b[4],
			i = b[5],
			j = b[6],
			k = b[7],
			h = Cos(a),
			a = Sin(a);
		b[0] = h * c + a * g;
		b[1] = h * d + a * i;
		b[2] = h * e + a * j;
		b[3] = h * f + a * k;
		b[4] = h * g - a * c;
		b[5] = h * i - a * d;
		b[6] = h * j - a * e;
		b[7] = h * k - a * f;
		return this
	},
	rotateByAxis: function (a, b) {
		var c = this.elements;
		if (a.x === 1 && a.y === 0 && a.z === 0) return this.rotateX(b);
		if (a.x === 0 && a.y === 1 && a.z === 0) return this.rotateY(b);
		if (a.x === 0 && a.y === 0 && a.z === 1) return this.rotateZ(b);
		var d = a.x,
			e = a.y,
			f = a.z,
			g = Sqrt(d * d + e * e + f * f),
			d = d / g,
			e = e / g,
			f = f / g,
			g = d * d,
			i = e * e,
			j = f * f,
			k = Cos(b),
			h = Sin(b),
			l = 1 - k,
			m = d * e * l,
			o = d * f * l,
			l = e * f * l,
			d = d * h,
			n = e * h,
			h = f * h,
			f = g + (1 - g) * k,
			g = m + h,
			e = o - n,
			m = m - h,
			i = i + (1 - i) * k,
			h = l + d,
			o = o + n,
			l = l - d,
			j = j + (1 - j) * k,
			k = c[0],
			d = c[1],
			n = c[2],
			p = c[3],
			q = c[4],
			t = c[5],
			J = c[6],
			C = c[7],
			G = c[8],
			K = c[9],
			E = c[10],
			r = c[11];
		c[0] = f * k + g * q + e * G;
		c[1] = f * d + g * t + e * K;
		c[2] = f * n + g * J + e * E;
		c[3] = f * p + g * C + e * r;
		c[4] = m * k + i * q + h * G;
		c[5] = m * d + i * t + h * K;
		c[6] = m * n + i * J + h * E;
		c[7] = m * p + i * C + h * r;
		c[8] = o * k + l * q + j * G;
		c[9] = o * d + l * t + j * K;
		c[10] = o * n + l * J + j * E;
		c[11] = o * p + l * C + j * r;
		return this
	},
	scale: function (a) {
		var b = this.elements,
			c = a.x,
			d = a.y,
			a = a.z;
		b[0] = b[0] * c;
		b[4] = b[4] * d;
		b[8] = b[8] * a;
		b[1] = b[1] * c;
		b[5] = b[5] * d;
		b[9] = b[9] * a;
		b[2] = b[2] * c;
		b[6] = b[6] * d;
		b[10] = b[10] * a;
		b[3] = b[3] * c;
		b[7] = b[7] * d;
		b[11] = b[11] * a;
		return this
	},
	getMaxScaleOnAxis: function () {
		var a = this.elements;
		return Sqrt(Max(a[0] * a[0] + a[1] * a[1] + a[2] * a[2], Max(a[4] * a[4] + a[5] * a[5] + a[6] * a[6], a[8] * a[8] + a[9] * a[9] + a[10] * a[10])))
	},
	makeTranslation: function (a, b, c) {
		this.set(1, 0, 0, a, 0, 1, 0, b, 0, 0, 1, c, 0, 0, 0, 1);
		return this
	},
	makeRotationX: function (a) {
		var b = Cos(a),
			a = Sin(a);
		this.set(1, 0, 0, 0, 0, b, -a, 0, 0, a, b, 0, 0, 0, 0, 1);
		return this
	},
	makeRotationY: function (a) {
		var b = Cos(a),
			a = Sin(a);
		this.set(b, 0, a, 0, 0, 1, 0, 0, -a, 0, b, 0, 0, 0, 0, 1);
		return this
	},
	makeRotationZ: function (a) {
		var b = Cos(a),
			a = Sin(a);
		this.set(b, -a, 0, 0, a, b, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
		return this
	},
	makeRotationAxis: function (a, b) {
		var c = Cos(b),
			d = Sin(b),
			e = 1 - c,
			f = a.x,
			g = a.y,
			i = a.z,
			j = e * f,
			k = e * g;
		this.set(j * f + c, j * g - d * i, j * i + d * g, 0, j * g + d * i, k * g + c, k * i - d * f, 0, j * i - d * g, k * i + d * f, e * i * i + c, 0, 0, 0, 0, 1);
		return this
	},
	makeScale: function (a, b, c) {
		this.set(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, 0, 0, 0, 1);
		return this
	},
	makeFrustum: function (a, b, c, d, e, f) {
		var g = this.elements;
		g[0] = 2 * e / (b - a);
		g[4] = 0;
		g[8] = (b + a) / (b - a);
		g[12] = 0;
		g[1] = 0;
		g[5] = 2 * e / (d - c);
		g[9] = (d + c) / (d - c);
		g[13] = 0;
		g[2] = 0;
		g[6] = 0;
		g[10] = -(f + e) / (f - e);
		g[14] = -2 * f * e / (f - e);
		g[3] = 0;
		g[7] = 0;
		g[11] = -1;
		g[15] = 0;
		return this
	},
	makePerspective: function (a, b, c, d) {
		var a = c * Math.tan(a * PI / 360),
			e = -a;
		return this.makeFrustum(e * b, a * b, e, a, c, d)
	},
	makeOrthographic: function (a, b, c, d, e, f) {
		var g = this.elements,
			i = b - a,
			j = c - d,
			k = f - e;
		g[0] = 2 / i;
		g[4] = 0;
		g[8] = 0;
		g[12] = -((b + a) / i);
		g[1] = 0;
		g[5] = 2 / j;
		g[9] = 0;
		g[13] = -((c + d) / j);
		g[2] = 0;
		g[6] = 0;
		g[10] = -2 / k;
		g[14] = -((f + e) / k);
		g[3] = 0;
		g[7] = 0;
		g[11] = 0;
		g[15] = 1;
		return this
	},
	clone: function () {
		var a = this.elements;
		return new H.Matrix4(a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15])
	}
};

H.Matrix4.__v1 = new H.Vector3;
H.Matrix4.__v2 = new H.Vector3;
H.Matrix4.__v3 = new H.Vector3;
H.Matrix4.__m1 = new H.Matrix4;
H.Matrix4.__m2 = new H.Matrix4;

H.Object3D.prototype = {
	constructor: H.Object3D,
	applyMatrix: function (a) {
		this.matrix.multiply(a, this.matrix);
		this.scale.getScaleFromMatrix(this.matrix);
		a = (new H.Matrix4).extractRotation(this.matrix);
		this.rotation.setEulerFromRotationMatrix(a, this.eulerOrder);
		this.position.getPositionFromMatrix(this.matrix)
	},
	translate: function (a, b) {
		this.matrix.rotateAxis(b);
		this.position.addSelf(b.multiplyScalar(a))
	},
	translateX: function (a) {
		this.translate(a, this._vector.set(1, 0, 0))
	},
	translateY: function (a) {
		this.translate(a, this._vector.set(0, 1, 0))
	},
	translateZ: function (a) {
		this.translate(a, this._vector.set(0, 0, 1))
	},
	localToWorld: function (a) {
		return this.matrixWorld.multiplyVector3(a)
	},
	worldToLocal: function (a) {
		return H.Object3D.__m1.getInverse(this.matrixWorld).multiplyVector3(a)
	},
	lookAt: function (a) {
		this.matrix.lookAt(a, this.position, this.up);
		this.rotation.setEulerFromRotationMatrix(this.matrix, this.eulerOrder)
	},
	add: function (a) {
		if (a === this) {}//console.warn("H.Object3D.add: An object can't be added as a child of itself.");
		else if (a instanceof H.Object3D) {
			a.parent !== void 0 && a.parent.remove(a);
			a.parent = this;
			this.children.push(a);
			for (var b = this; b.parent !== void 0;) b = b.parent;
			b !== void 0 && b instanceof H.Scene && b.__addObject(a)
		}
	},
	remove: function (a) {
		var b = this.children.indexOf(a);
		if (b !== -1) {
			a.parent = void 0;
			this.children.splice(b, 1);
			for (b = this; b.parent !== void 0;) b = b.parent;
			b !== void 0 && b instanceof H.Scene && b.__removeObject(a)
		}
	},
	getDescendants: function (a) {
		a === void 0 && (a = []);
		Array.prototype.push.apply(a, this.children);
		for (var b = 0, c = this.children.length; b < c; b++) this.children[b].getDescendants(a);
		return a
	},
	updateMatrix: function () {
		this.matrix.setPosition(this.position);
		this.matrix.setRotationFromEuler(this.rotation, this.eulerOrder)
		if (this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1) {
			this.matrix.scale(this.scale);
		}
		this.matrixWorldNeedsUpdate = true
	},
	updateMatrixWorld: function (a) {
		this.matrixAutoUpdate === true && this.updateMatrix();
		if (this.matrixWorldNeedsUpdate === true || a === true) {
			this.parent === void 0 ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiply(this.parent.matrixWorld, this.matrix);
			this.matrixWorldNeedsUpdate = false;
			a = true
		}
		for (var b = 0, c = this.children.length; b < c; b++) this.children[b].updateMatrixWorld(a)
	},
	clone: function () {}
};

H.Object3D.__m1 = new H.Matrix4;

H.Camera.prototype = Object.create(H.Object3D.prototype);

H.Camera.prototype.lookAt = function (a) {
	this.matrix.lookAt(this.position, a, this.up);
	/*this.rotationAutoUpdate === true && */this.rotation.setEulerFromRotationMatrix(this.matrix, this.eulerOrder)
};

H.PerspectiveCamera.prototype = Object.create(H.Camera.prototype);
H.PerspectiveCamera.prototype.setLens = function (a, b) {
	b === void 0 && (b = 24);
	this.fov = 2 * Math.atan(b / (a * 2)) * (180 / PI);
	this.updateProjectionMatrix()
};
H.PerspectiveCamera.prototype.setViewOffset = function (a, b, c, d, e, f) {
	this.fullWidth = a;
	this.fullHeight = b;
	this.x = c;
	this.y = d;
	this.width = e;
	this.height = f;
	this.updateProjectionMatrix()
};
H.PerspectiveCamera.prototype.updateProjectionMatrix = function () {
	if (this.fullWidth) {
		var a = this.fullWidth / this.fullHeight,
			b = Math.tan(this.fov * PI / 360) * this.near,
			c = -b,
			d = a * c,
			a = Abs(a * b - d),
			c = Abs(b - c);
		this.projectionMatrix.makeFrustum(d + this.x * a / this.fullWidth, d + (this.x + this.width) * a / this.fullWidth, b - (this.y + this.height) * c / this.fullHeight, b - this.y * c / this.fullHeight, this.near, this.far)
	} else this.projectionMatrix.makePerspective(this.fov, this.aspect, this.near, this.far)
};

H.Scene.prototype = Object.create(H.Object3D.prototype);
H.Scene.prototype.__addObject = function (a) {
	/*
	if (a instanceof H.Light) {
		this.__lights.indexOf(a) === -1 && this.__lights.push(a);
		a.target && a.target.parent === void 0 && this.add(a.target)
	} else */if (!(a instanceof H.Camera /*|| a instanceof H.Bone*/) && this.__objects.indexOf(a) === -1) {
		this.__objects.push(a);
		this.__objectsAdded.push(a);
		var b = this.__objectsRemoved.indexOf(a);
		b !== -1 && this.__objectsRemoved.splice(b, 1)
	}
	for (b = 0; b < a.children.length; b++) this.__addObject(a.children[b])
};
H.Scene.prototype.__removeObject = function (a) {
	if (a instanceof H.Light) {
		var b = this.__lights.indexOf(a);
		b !== -1 && this.__lights.splice(b, 1)
	} else if (!(a instanceof H.Camera)) {
		b = this.__objects.indexOf(a);
		if (b !== -1) {
			this.__objects.splice(b, 1);
			this.__objectsRemoved.push(a);
			b = this.__objectsAdded.indexOf(a);
			b !== -1 && this.__objectsAdded.splice(b, 1)
		}
	}
	for (b = 0; b < a.children.length; b++) this.__removeObject(a.children[b])
};

//logo = u00a9  pqtkn = u03b1 - u03b2 - u03b3 - u03b4 - u03b5  huuluong = u2122 omega = u03c9 ito = u03b6 phusi = u03b7 cpe = u03b8

H.CSS3DObject.prototype = Object.create(H.Object3D.prototype);

//onDocument.js

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
	event.preventDefault();
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('mouseout', onDocumentMouseOut, false);
	mouseXOnMouseDown = event.clientX - windowHalfX;
	mouseYOnMouseDown = event.clientY - windowHalfY;
	targetRotationOnMouseDown = targetRotation;
	targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
	targetRotation = targetRotationOnMouseDown + gocQuay*(mouseX - mouseXOnMouseDown) * 0.02;
	targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	document.removeEventListener('mouseup', onDocumentMouseUp, false);
	document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	document.removeEventListener('mouseup', onDocumentMouseUp, false);
	document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {
	if (event.touches.length === 1) {
		event.preventDefault();
		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
		targetRotationOnMouseDown = targetRotation;
	}
}

function onDocumentTouchMove(event) {
	if (event.touches.length === 1) {
		event.preventDefault();
		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;
		targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
		targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
	}
}


//app.js	
var camera, scene, renderer;
var group;
var lg, www;
var targetRotation = 6.8 + Rnd()*0.5236; //2 * PI + PI / 6 + Rnd() * PI / 6;
var targetRotationY = 1.57; //PI / 2;
var targetPositionY = -98;
var targetRotationOnMouseDown = 0;
var targetRotationOnMouseDownY = 0;
var mouseX = 0;
var mouseY = 0;
var mouseXOnMouseDown = 0;
var mouseYOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var infor, ID = 1;
//var huu, phu, quy, tho, khang, ninh, vn;
var finishBox = false,
	nextURL = false;
var gocQuay=0;	

function initHome(homePage) {
  //alert("Bat dau..");
  
	if(homePage instanceof Object){
    //alert("initHome-Error-Chat");
		
		window['Tawk_API'] = window['Tawk_API'] || {}, window['Tawk_LoadStart'] = new Date();
      
    console.log("history.replaceState('', '','https://áq.vn/chat');");
      
		var errorPage = new H.Error(homePage);
		
		return errorPage.tawkto("57b14e6e78be3a4291b7f4d5");
	}
	
	if(!homePage){
    //alert("initHome-initPage");
    return initPage();
  }
	
  //alert("initHome-initHome");
	console.log("history.replaceState('', '','https://huu.vn');"); //LHT xem lai
	
	var container = document.createElement('div');
	document.body.appendChild(container);
	
	camera = new H.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
	scene = new H.Scene();
	group = new H.Object3D();
	camera.position.set(0, 0, 594);

	var urls = [
		['<canvas id="www"/>', 0, 97, 0, 1.57, 0, 0],
		['<canvas id="copyrightml" height="310" width="510"/>', 0, -97, 0, 1.57, 0, 0],
		
		['<svg id="huu" onclick="H.h.r().p();" viewBox="0 0 340 340" <defs><radialGradient id="top" cx="50%" cy="45%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:rgb(255,255,255)" /><stop offset="100%" style="stop-color:rgb(220,220,220)"/></radialGradient><radialGradient id="bottom" cx="50%" cy="45%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:rgb(255,255,255)" /><stop offset="100%" style="stop-color:rgb(0,0,0)"/></radialGradient></defs>><polygon points="71.4531,34.3618 10.5477,221.8092 170.0000,337.6580 329.4523,221.8092 268.5469,34.3618 71.4531,34.3618"/></svg>', 0, -100, 0, 1.57, 0, 0],
		['<div id="vn" onclick="Instagram();" width="340" height="340"></div>', 0, 100, 0, 1.57, 0, 0],
		
		['<svg id="p" viewBox="0 0 200 200" onclick="H.p#><text x="100" y="160">\u00C0</text></svg>', 0, 0, 137.6382, 0, 0, 0],
		['<svg id="q" viewBox="0 0 200 200" onclick="H.q#><text x="100" y="160">\u00C1</text></svg>', 130.9017, 0, 42.5325, 0, 1.2566, 0],
		['<svg id="t" viewBox="0 0 200 200" onclick="H.t#><text x="100" y="160">\u00C2</text></svg>', 80.9017, 0, -111.3516, 0, 2.5133, 0],
		['<svg id="k" viewBox="0 0 200 200" onclick="H.k#><text x="100" y="160">\u00C3</text></svg>', -80.9017, 0, -111.3516, 0, 3.7699, 0],
		['<svg id="n" viewBox="0 0 200 200" onclick="H.n#><text x="100" y="160">\u00C4</text></svg>', -130.9017, 0, 42.5325, 0, 5.0265, 0],
	];
	
	for (var i = 0; i < urls.length; i++) {
		var element = document.createElement('div');
		
		var object = new H.CSS3DObject(element);
		
		if (i <= 3) {
			element.innerHTML = urls[i][0];
			element.style.width = '340px';
			element.style.height = '340px';
		} else {
			element.innerHTML = urls[i][0].replace('#',infor[5]);
			element.style.width = '200px';
			element.style.height = '200px';
		}
		
		object.position.x = urls[i][1];
		object.position.y = urls[i][2];
		object.position.z = urls[i][3];
		object.rotation.x = urls[i][4];
		object.rotation.y = urls[i][5];
		object.rotation.z = urls[i][6];
	
		group.add(object);
		if (i == 0) www = object;
		if (i == 1) lg = object;
		
	}
	scene.add(group);
	renderer = new H.CSS3DRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	container.appendChild(renderer.domElement);
	
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener("load", H.Author, false);
	
	function startBOX() {
		lg.rotation.z = group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
		
		if (finishBox) {
			
			group.rotation.x += (targetRotationY - group.rotation.x) * 0.05;
			
			lg.position.y += (targetPositionY - lg.position.y) * 0.05;
			var phdu = ((Floor(360 * group.rotation.x / (2 * PI)) % 360) + 360) % 360;
			var wwwpositiony = www.position.y;
			
			if ((phdu < 80) || (phdu > 280)) www.position.y += (-95 - www.position.y) * 0.02;
			else if ((phdu > 100) && (phdu < 260)) www.position.y += (95 - www.position.y) * 0.02;
			
			var els = document.querySelectorAll('text');
			
			if (www.position.y < 0 && wwwpositiony > 0) {
				for (var i=0; i < els.length; i++) {
					els[i].setAttribute("transform", "rotate(0 100 100)");
				}
			} else if (www.position.y > 0 && wwwpositiony < 0){
				for (var i=0; i < els.length; i++) {
					els[i].setAttribute("transform", "rotate(180 100 100)");
				}
			}
			
			gocQuay = www.position.y < 0 ? 1: -1;
		}
		
		renderer.render(scene, camera);
		
		requestAnimFrame(startBOX);
	}	
	
	startBOX();

	function startSVG() {
		
		var Xi = 2 * PI / 5;
		H1035298654.K(H.KEY16); 
		H1035298654.update("");
		
		
		KEY = H1035298654.get();
    //LHT
    /*
		alert(KEY)
		if(KEY !== '4CEEE2D1E1FE96543F1C3C135A64943FD1D9FEFB947E2C3B2AC0CBA0D03267B7D8DD3B9C8143477C7DACDB3907F0EE98')
			return;
		*/
    
		if(!H['h']) H['h'] = new H.L("huu", {}, function (obj) 
		{
			obj.el.setAttribute('class','z');
			if (!finishBox) targetRotation -= Xi;
			else {
				targetRotation = Xi / 2 + Floor((Rnd() * 10) + 1) * Xi;
				targetRotationY = -PI / 2;
				if (nextURL) {
					targetRotationY = -PI / 2;
					targetPositionY = -480;
					GLOBAL.setTimeout(function () {
						location.href = (!ID)? location.href + "/info" : location.href.replace('hu',(ID==2) ? 'my.hu' : 'luong.hu') + ((ID==2) ? '' : '...');
						targetRotationY = PI / 2;
						targetPositionY = -98;
					}, 5000);
				}
			}
			if(!H['p']) H['p'] = new H.L("p", {}, function (obj) 
			{
				obj.el.setAttribute('class','z');
				if (!finishBox) targetRotation -= Xi;
				else {
					targetRotation = Xi / 2 + Floor((Rnd() * 10) + 1) * Xi;
					targetRotationY = -PI / 2;
					ID = 0; //p
					nextURL = true;
				}
				if(!H['q']) H['q'] = new H.L("q", {}, function (obj) 
				{
					obj.el.setAttribute('class','z');
					if (!finishBox) targetRotation -= Xi;
					else {
						targetRotation = Xi / 2 + Floor((Rnd() * 10) + 1) * Xi;
						targetRotationY = -PI / 2;
						ID = 1; //q
						nextURL = true;
					}
					if(!H['t']) H['t'] = new H.L("t", {}, function (obj) 
					{
						obj.el.setAttribute('class','z');
						if (!finishBox) targetRotation -= Xi;
						else {
							targetRotation = Xi / 2 + Floor((Rnd() * 10) + 1) * Xi;
							targetRotationY = -PI / 2;
							ID = 2; //t
							nextURL = true;
						}
						if(!H['k']) H['k'] = new H.L("k", {}, function (obj) 
						{
							obj.el.setAttribute('class','z');
							if (!finishBox) targetRotation -= Xi;
							else {
								targetRotation = Xi / 2 + Floor((Rnd() * 10) + 1) * Xi;
								targetRotationY = -PI / 2;
								ID = 3; //k
								nextURL = true;
							}
							if(!H['n']) H['n'] = new H.L("n", {}, function (obj) 
							{
								obj.el.setAttribute('class','z');
								if (!finishBox) {
									targetRotation -= Xi / 2;
									H.WWW();
									H['h'].r().p();
		
									GLOBAL.setTimeout('document.getElementById("...")?document.getElementById("...").remove():null;document.body.style.cursor="default"', 1000)
									
								} else {
									targetRotation = Xi / 2 + Floor((Rnd() * 10) + 1) * Xi;
									targetRotationY = -PI / 2;
									ID = 4; //n
									nextURL = true;
								}
								
								finishBox = true;

								if(!H['v'])
								{
									H['l'] = (H['l'] && H['l'].Rnd()) || "H1035298654";
									H['v'] = new H.L('vn', {file: 'canvas/' + H['l'] + '.svg', duration: 500, forceRender: !0},function(){
										document.getElementById("vietnam") ? document.getElementById("vietnam").setAttribute('class','z') : null;
										document.getElementById("VN-SG") ? document.getElementById("VN-SG").style.fill="red" : null;
									});
								}
							})
						})
					})
				})
			})
		}
	)
	}
	
	startSVG();
	
  //LHT
	//Instagram cho HomePage
	window['Instagram'] = function() 
	{
		H['l']=H['l'].Rnd();
		var req = new XMLHttpRequest();
		var fileName = 'canvas/' + H['l'] + '.svg';
		
		//fileName = 'canvas/logo.svg';
		
		req.open('GET', fileName, false);
		req.send();

		document.getElementById("vn").innerHTML="";
		
		if(req.status!=200)
		{
			fileName = 'canvas/logo.svg';
			H['l']="".Rnd();
		}
		
		H['v'] = new H.L('vn', {file: fileName, duration: 500, forceRender: !0},function(){
			document.getElementById("klass") ? document.getElementById("klass").setAttribute('class','z') : null;
			document.getElementById("IDL") ? document.getElementById("IDL").style.fill="#4285F4" : null;
			document.getElementById("IDT") ? document.getElementById("IDT").style.fill="#EA4335" : null;
			
			document.getElementById("HERE") ? document.getElementById("HERE").style.fill="red" : null;
			document.getElementById("RED") ? document.getElementById("RED").style.fill="red" : null;
			document.getElementById("GREEN") ? document.getElementById("GREEN").style.fill="green" : null;
			document.getElementById("BLUE") ? document.getElementById("BLUE").style.fill="blue" : null;
			document.getElementById("YELLOW") ? document.getElementById("YELLOW").style.fill="yellow" : null;
			document.getElementById("BLACK") ? document.getElementById("BLACK").style.fill="black" : null;
			document.getElementById("WHITE") ? document.getElementById("WHITE").style.fill="white" : null;
			document.getElementById("BROWN") ? document.getElementById("BROWN").style.fill="brown" : null;
		});
	}
}

//hteeml
//them vao de bien dich
//xoa sau khi bien dich
/*
window["".Rnd()] = new H.UU("HUUVN");
initHome((window['locationhostname'].length==6)&& (location.protocol!=="https:"));
H.T({"profile":{"screenName":"fAQVietNam"},"domId":"","maxTweets":1,"enableLinks":false,"showUser":false,"showTime":false,"showImages":false,"showPermalinks":false,"customCallback":Twitter,"lang":"en"});
H.callback()
window['__wavt'] = 'AOuZoY5mME-RrhlJoE4Qs0gx4u8fOnk_UQ:1480061345908';
window["".Rnd()].K(H.KEY16); //setHMACKey
window["".Rnd()].update(window['__wavt']);
G_DATA = window["".Rnd()].get();//getHMAC
alert(G_DATA); //191DABA014EFB366852ECC5476851F4B1D972A0717261A7A2225F917B321C7DFF1626FE7D81EB62C0A6213C602879BF4

*/