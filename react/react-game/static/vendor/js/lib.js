/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );

!function(a){"function"==typeof window.define?window.define.amd?window.define("wangEditor",["jquery"],a):window.define.cmd?window.define(function(){return a}):a(window.jQuery):"object"==typeof module&&"object"==typeof module.exports?(window.wangEditorCssPath?require(window.wangEditorCssPath):require("../css/wangEditor.css"),module.exports=a(window.wangEditorJQueryPath?require(window.wangEditorJQueryPath):require("jquery"))):a(window.jQuery)}(function(a){if(!a||!a.fn||!a.fn.jquery)return alert("在引用wangEditor.js之前，先引用jQuery，否则无法使用 wangEditor"),void 0;var b=function(b){var c=window.wangEditor;c&&b(c,a)};return function(a,b){if(a.wangEditor)return alert("一个页面不能重复引用 wangEditor.js 或 wangEditor.min.js ！！！"),void 0;var c=function(a){var c,d;"string"==typeof a&&(a="#"+a),c=b(a),1===c.length&&(d=c[0].nodeName,("TEXTAREA"===d||"DIV"===d)&&(this.valueNodeName=d.toLowerCase(),this.$valueContainer=c,this.$prev=c.prev(),this.$parent=c.parent(),this.init()))};c.fn=c.prototype,c.$body=b("body"),c.$document=b(document),c.$window=b(a),c.userAgent=navigator.userAgent,c.getComputedStyle=a.getComputedStyle,c.w3cRange="function"==typeof document.createRange,c.hostname=location.hostname.toLowerCase(),c.websiteHost="wangeditor.github.io|www.wangeditor.com|wangeditor.coding.me",c.isOnWebsite=c.websiteHost.indexOf(c.hostname)>=0,c.docsite="http://www.kancloud.cn/wangfupeng/wangeditor2/113961",a.wangEditor=c,c.plugin=function(a){c._plugins||(c._plugins=[]),"function"==typeof a&&c._plugins.push(a)}}(window,a),b(function(a){a.fn.init=function(){this.initDefaultConfig(),this.addEditorContainer(),this.addTxt(),this.addMenuContainer(),this.menus={},this.commandHooks()}}),b(function(a,b){a.fn.ready=function(a){this.readyFns||(this.readyFns=[]),this.readyFns.push(a)},a.fn.readyHeadler=function(){for(var a=this.readyFns;a.length;)a.shift().call(this)},a.fn.updateValue=function(){var d,a=this,b=a.$valueContainer,c=a.txt.$txt;b!==c&&(d=c.html(),b.val(d))},a.fn.getInitValue=function(){var a=this,b=a.$valueContainer,c="",d=a.valueNodeName;return"div"===d?c=b.html():"textarea"===d&&(c=b.val()),c},a.fn.updateMenuStyle=function(){var a=this.menus;b.each(a,function(a,b){b.updateSelected()})},a.fn.enableMenusExcept=function(a){this._disabled||(a=a||[],"string"==typeof a&&(a=[a]),b.each(this.menus,function(b,c){a.indexOf(b)>=0||c.disabled(!1)}))},a.fn.disableMenusExcept=function(a){this._disabled||(a=a||[],"string"==typeof a&&(a=[a]),b.each(this.menus,function(b,c){a.indexOf(b)>=0||c.disabled(!0)}))},a.fn.hideDropPanelAndModal=function(){var a=this.menus;b.each(a,function(a,b){var c=b.dropPanel||b.dropList||b.modal;c&&c.hide&&c.hide()})}}),b(function(a,b){function d(){}var c=!a.w3cRange;a.fn.currentRange=function(a){return a?(this._rangeData=a,void 0):this._rangeData},a.fn.collapseRange=function(a,b){b=b||"end",b="start"===b?!0:!1,a=a||this.currentRange(),a&&(a.collapse(b),this.currentRange(a))},a.fn.getRangeText=c?d:function(a){return(a=a||this.currentRange())?a.toString():void 0},a.fn.getRangeElem=c?d:function(a){a=a||this.currentRange();var b=a.commonAncestorContainer;return 1===b.nodeType?b:b.parentNode},a.fn.isRangeEmpty=c?d:function(a){return a=a||this.currentRange(),a&&a.startContainer&&a.startContainer===a.endContainer&&a.startOffset===a.endOffset?!0:!1},a.fn.saveSelection=c?d:function(a){var d,e,c=this,f=c.txt.$txt.get(0);a?d=a.commonAncestorContainer:(e=document.getSelection(),e.getRangeAt&&e.rangeCount&&(a=document.getSelection().getRangeAt(0),d=a.commonAncestorContainer)),d&&(b.contains(f,d)||f===d)&&c.currentRange(a)},a.fn.restoreSelection=c?d:function(b){var c;if(b=b||this.currentRange())try{c=document.getSelection(),c.removeAllRanges(),c.addRange(b)}catch(d){a.error("执行 editor.restoreSelection 时，IE可能会有异常，不影响使用")}},a.fn.restoreSelectionByElem=c?d:function(a,b){a&&(b=b||"end",this.setRangeByElem(a),"start"===b&&this.collapseRange(this.currentRange(),"start"),"end"===b&&this.collapseRange(this.currentRange(),"end"),this.restoreSelection())},a.fn.initSelection=c?d:function(){var c,d,a=this;a.currentRange()||(c=a.txt.$txt,d=c.children().first(),d.length&&a.restoreSelectionByElem(d.get(0)))},a.fn.setRangeByElem=c?d:function(a){var e,f,g,c=this,d=c.txt.$txt.get(0);if(a&&b.contains(d,a)){for(e=a.firstChild;e&&3!==e.nodeType;)e=e.firstChild;for(f=a.lastChild;f&&3!==f.nodeType;)f=f.lastChild;g=document.createRange(),e&&f?(g.setStart(e,0),g.setEnd(f,f.textContent.length)):(g.setStart(a,0),g.setEnd(a,0)),c.saveSelection(g)}}}),b(function(a,b){a.w3cRange||(a.fn.getRangeText=function(a){return(a=a||this.currentRange())?a.text:void 0},a.fn.getRangeElem=function(a){if(a=a||this.currentRange()){var b=a.parentElement();return 1===b.nodeType?b:b.parentNode}},a.fn.isRangeEmpty=function(a){return a=a||this.currentRange(),a&&a.text?!1:!0},a.fn.saveSelection=function(a){var d,c=this,f=c.txt.$txt.get(0);a?d=a.parentElement():(a=document.selection.createRange(),d="undefined"==typeof a.parentElement?null:a.parentElement()),d&&(b.contains(f,d)||f===d)&&c.currentRange(a)},a.fn.restoreSelection=function(a){var d,b=this;if(a=a||b.currentRange()){d=document.selection.createRange();try{d.setEndPoint("EndToEnd",a)}catch(e){}if(0===a.text.length)try{d.collapse(!1)}catch(e){}else d.setEndPoint("StartToStart",a);d.select()}})}),b(function(a,b){a.fn.commandHooks=function(){var a=this,c={};c.insertHtml=function(c){var d=b(c),e=a.getRangeElem(),f=a.getLegalTags(e);f&&b(f).after(d)},a.commandHooks=c}}),b(function(a){a.fn.command=function(a,b,c,d){function g(){b&&(e.queryCommandSupported(b)?document.execCommand(b,!1,c):(f=e.commandHooks,b in f&&f[b](c)))}var f,e=this;this.customCommand(a,g,d)},a.fn.commandForElem=function(a,b,c,d,e){var f,g,h;"string"==typeof a?f=a:(f=a.selector,g=a.check),h=this.getRangeElem(),h=this.getSelfOrParentByName(h,f,g),h&&this.setRangeByElem(h),this.command(b,c,d,e)},a.fn.customCommand=function(a,b,c){function f(){d.hideDropPanelAndModal()}var d=this,e=d.currentRange();return e?(d.undoRecord(),this.restoreSelection(e),b.call(d),this.saveSelection(),this.restoreSelection(),c&&"function"==typeof c&&c.call(d),d.txt.insertEmptyP(),d.txt.wrapImgAndText(),d.updateValue(),d.updateMenuStyle(),setTimeout(f,200),a&&a.preventDefault(),void 0):(a&&a.preventDefault(),void 0)},a.fn.queryCommandValue=function(a){var b="";try{b=document.queryCommandValue(a)}catch(c){}return b},a.fn.queryCommandState=function(a){var b=!1;try{b=document.queryCommandState(a)}catch(c){}return b},a.fn.queryCommandSupported=function(a){var b=!1;try{b=document.queryCommandSupported(a)}catch(c){}return b}}),b(function(a,b){function d(a){var c=this,d=b(a),e=!1;return d.each(function(){return this===c?(e=!0,!1):void 0}),e}var c;a.fn.getLegalTags=function(b){var c=this.config.legalTags;return c?this.getSelfOrParentByName(b,c):(a.error("配置项中缺少 legalTags 的配置"),void 0)},a.fn.getSelfOrParentByName=function(a,e,f){if(a&&e){c||(c=a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.matchesSelector),c||(c=d);for(var g=this.txt.$txt.get(0);a&&g!==a&&b.contains(g,a);){if(c.call(a,e)){if(!f)return a;if(f(a))return a}a=a.parentNode}}}}),b(function(a){function d(a){return null==a._redoList&&(a._redoList=[]),a._redoList}function e(a){return null==a._undoList&&(a._undoList=[]),a._undoList}function f(a,b,c){var d=b.val,e=a.txt.$txt.html();if(null!=d){if(d===e)return"redo"===c?(a.redo(),void 0):"undo"===c?(a.undo(),void 0):void 0;a.txt.$txt.html(d),a.updateValue(),a.onchange&&"function"==typeof a.onchange&&a.onchange.call(a)}}var c=20;a.fn.undoRecord=function(){var a=this,b=a.txt.$txt,f=b.html(),g=e(a),h=d(a),i=g.length?g[0]:"";f!==i.val&&(h.length&&(h=[]),g.unshift({range:a.currentRange(),val:f}),g.length>c&&g.pop())},a.fn.undo=function(){var g,a=this,b=e(a),c=d(a);b.length&&(g=b.shift(),c.unshift(g),f(this,g,"undo"))},a.fn.redo=function(){var g,a=this,b=e(a),c=d(a);c.length&&(g=c.shift(),b.unshift(g),f(this,g,"redo"))}}),b(function(a,b){a.fn.create=function(){var d,c=this;a.$body&&0!==a.$body.length||(a.$body=b("body"),a.$document=b(document),a.$window=b(window)),c.addMenus(),c.renderMenus(),c.renderMenuContainer(),c.renderTxt(),c.renderEditorContainer(),c.eventMenus(),c.eventMenuContainer(),c.eventTxt(),c.readyHeadler(),c.initSelection(),c.$txt=c.txt.$txt,d=a._plugins,d&&d.length&&b.each(d,function(a,b){b.call(c)})},a.fn.disable=function(){this.txt.$txt.removeAttr("contenteditable"),this.disableMenusExcept(),this._disabled=!0},a.fn.enable=function(){this._disabled=!1,this.txt.$txt.attr("contenteditable","true"),this.enableMenusExcept()},a.fn.destroy=function(){var a=this,b=a.$valueContainer,c=a.$editorContainer,d=a.valueNodeName;"div"===d?(b.removeAttr("contenteditable"),c.after(b),c.hide()):(b.show(),c.hide())},a.fn.undestroy=function(){var a=this,b=a.$valueContainer,c=a.$editorContainer,d=a.menuContainer.$menuContainer,e=a.valueNodeName;"div"===e?(b.attr("contenteditable","true"),d.after(b),c.show()):(b.hide(),c.show())},a.fn.clear=function(){var a=this,b=a.txt.$txt;b.html("<p><br></p>"),a.restoreSelectionByElem(b.find("p").get(0))}}),b(function(a){var c=function(a){this.editor=a,this.init()};c.fn=c.prototype,a.MenuContainer=c}),b(function(a,b){var c=a.MenuContainer;c.fn.init=function(){var a=this,c=b('<div class="wangEditor-menu-container clearfix"></div>');a.$menuContainer=c,a.changeShadow()},c.fn.changeShadow=function(){var a=this.$menuContainer,b=this.editor,c=b.txt.$txt;c.on("scroll",function(){c.scrollTop()>10?a.addClass("wangEditor-menu-shadow"):a.removeClass("wangEditor-menu-shadow")})}}),b(function(a,b){var c=a.MenuContainer;c.fn.render=function(){var a=this.$menuContainer,b=this.editor.$editorContainer;b.append(a)},c.fn.height=function(){var a=this.$menuContainer;return a.height()},c.fn.appendMenu=function(a,b){return this._addGroup(a),this._addOneMenu(b)},c.fn._addGroup=function(a){var d,c=this.$menuContainer;this.$currentGroup&&this.currentGroupIdx===a||(d=b('<div class="menu-group clearfix"></div>'),c.append(d),this.$currentGroup=d,this.currentGroupIdx=a)},c.fn._addOneMenu=function(a){var c=a.$domNormal,d=a.$domSelected,e=this.$currentGroup,f=b('<div class="menu-item clearfix"></div>');return d.hide(),f.append(c).append(d),e.append(f),f}}),b(function(a){var c=function(a){this.editor=a.editor,this.id=a.id,this.title=a.title,this.$domNormal=a.$domNormal,this.$domSelected=a.$domSelected||a.$domNormal,this.commandName=a.commandName,this.commandValue=a.commandValue,this.commandNameSelected=a.commandNameSelected||a.commandName,this.commandValueSelected=a.commandValueSelected||a.commandValue};c.fn=c.prototype,a.Menu=c}),b(function(a,b){var c=a.Menu;c.fn.initUI=function(){var c=this.editor,d=c.UI.menus,e=this.id,f=d[e];this.$domNormal&&this.$domSelected||(null==f&&(a.warn('editor.UI配置中，没有菜单 "'+e+'" 的UI配置，只能取默认值'),f=d["default"]),this.$domNormal=b(f.normal),this.$domSelected=/^\./.test(f.selected)?this.$domNormal.clone().addClass(f.selected.slice(1)):b(f.selected))}}),b(function(a,b){var c=a.Menu;c.fn.render=function(a){var b,c,d,e;this.initUI(),b=this.editor,c=b.menuContainer,d=c.appendMenu(a,this),e=this.onRender,this._renderTip(d),e&&"function"==typeof e&&e.call(this)},c.fn._renderTip=function(c){function i(){g.show()}function j(){g.hide()}var h,k,d=this,e=d.editor,f=d.title,g=b('<div class="menu-tip"></div>');d.tipWidth||(h=b('<p style="opacity:0; filter:Alpha(opacity=0); position:absolute;top:-10000px;">'+f+"</p>"),a.$body.append(h),e.ready(function(){var b=h.outerWidth()+5,c=g.outerWidth(),e=parseFloat(g.css("margin-left"),10);h.remove(),h=null,g.css({width:b,"margin-left":e+(c-b)/2}),d.tipWidth=b})),g.append(f),c.append(g),c.find("a").on("mouseenter",function(){d.active()||d.disabled()||(k=setTimeout(i,200))}).on("mouseleave",function(){k&&clearTimeout(k),j()}).on("click",j)},c.fn.bindEvent=function(){var f,b=this,c=b.$domNormal,d=b.$domSelected,e=b.clickEvent;e||(e=function(c){var e,f,g,h,d=b.dropPanel||b.dropList||b.modal;return d&&d.show?(d.isShowing?d.hide():d.show(),void 0):(e=b.editor,h=b.selected,h?(f=b.commandNameSelected,g=b.commandValueSelected):(f=b.commandName,g=b.commandValue),f?e.command(c,f,g):(a.warn('菜单 "'+b.id+'" 未定义click事件'),c.preventDefault()),void 0)}),f=b.clickEventSelected||e,c.click(function(a){b.disabled()||(e.call(b,a),b.updateSelected()),a.preventDefault()}),d.click(function(a){b.disabled()||(f.call(b,a),b.updateSelected()),a.preventDefault()})},c.fn.updateSelected=function(){var c,d,a=this;a.editor,c=a.updateSelectedEvent,c||(c=function(){var a=this,b=a.editor,c=a.commandName,d=a.commandValue;if(d){if(b.queryCommandValue(c).toLowerCase()===d.toLowerCase())return!0}else if(b.queryCommandState(c))return!0;return!1}),d=c.call(a),d=!!d,a.changeSelectedState(d)},c.fn.changeSelectedState=function(a){var b=this,c=b.selected;if(null!=a&&"boolean"==typeof a){if(c===a)return;b.selected=a,a?(b.$domNormal.hide(),b.$domSelected.show()):(b.$domNormal.show(),b.$domSelected.hide())}},c.fn.active=function(a){return null==a?this._activeState:(this._activeState=a,void 0)},c.fn.activeStyle=function(a){var c,d;this.selected,c=this.$domNormal,d=this.$domSelected,a?(c.addClass("active"),d.addClass("active")):(c.removeClass("active"),d.removeClass("active")),this.active(a)},c.fn.disabled=function(a){var b,c;return null==a?!!this._disabled:(this._disabled!==a&&(b=this.$domNormal,c=this.$domSelected,a?(b.addClass("disable"),c.addClass("disable")):(b.removeClass("disable"),c.removeClass("disable")),this._disabled=a),void 0)}}),b(function(a){var c=function(a,b,c){this.editor=a,this.menu=b,this.data=c.data,this.tpl=c.tpl,this.selectorForELemCommand=c.selectorForELemCommand,this.beforeEvent=c.beforeEvent,this.afterEvent=c.afterEvent,this.init()};c.fn=c.prototype,a.DropList=c}),b(function(a,b){var c=a.DropList;c.fn.init=function(){var a=this;a.initDOM(),a.bindEvent(),a.initHideEvent()},c.fn.initDOM=function(){var f,g,a=this,c=a.data,d=a.tpl||"<span>{#title}</span>",e=b('<div class="wangEditor-drop-list clearfix"></div>');b.each(c,function(a,c){f=d.replace(/{#commandValue}/gi,a).replace(/{#title}/gi,c),g=b('<a href="#" commandValue="'+a+'"></a>'),g.append(f),e.append(g)}),a.$list=e},c.fn.bindEvent=function(){var a=this,c=a.editor,d=a.menu,e=d.commandName,f=a.selectorForELemCommand,g=a.$list,h=a.beforeEvent,i=a.afterEvent;g.on("click","a[commandValue]",function(a){h&&"function"==typeof h&&h.call(a);var g=b(a.currentTarget).attr("commandValue");d.selected&&c.isRangeEmpty()&&f?c.commandForElem(f,a,e,g):c.command(a,e,g),i&&"function"==typeof i&&i.call(a)})},c.fn.initHideEvent=function(){var c=this,d=c.$list.get(0);a.$body.on("click",function(a){var e,f,g;c.isShowing&&(e=a.target,f=c.menu,g=f.selected?f.$domSelected.get(0):f.$domNormal.get(0),g===e||b.contains(g,e)||d===e||b.contains(d,e)||c.hide())}),a.$window.scroll(function(){c.hide()}),a.$window.on("resize",function(){c.hide()})}}),b(function(a){var c=a.DropList;c.fn._render=function(){var a=this,b=a.editor,c=a.$list;b.$editorContainer.append(c),a.rendered=!0},c.fn._position=function(){var a=this,b=a.$list,c=a.editor,d=a.menu,e=c.menuContainer.$menuContainer,f=d.selected?d.$domSelected:d.$domNormal,g=f.offsetParent().position(),h=g.top,i=g.left,j=f.offsetParent().height(),k=f.offsetParent().width(),l=b.outerWidth(),m=c.txt.$txt.outerWidth(),n=h+j,o=i+k/2,p=0-k/2,q=o+l-m;q>-10&&(p=p-q-10),b.css({top:n,left:o,"margin-left":p}),c._isMenufixed&&(n+=e.offset().top+e.outerHeight()-b.offset().top,b.css({top:n}))},c.fn.show=function(){var c,a=this,b=a.menu;a.rendered||a._render(),a.isShowing||(c=a.$list,c.show(),a._position(),a.isShowing=!0,b.activeStyle(!0))},c.fn.hide=function(){var c,a=this,b=a.menu;a.isShowing&&(c=a.$list,c.hide(),a.isShowing=!1,b.activeStyle(!1))}}),b(function(a){var c=function(a,b,c){this.editor=a,this.menu=b,this.$content=c.$content,this.width=c.width||200,this.height=c.height,this.onRender=c.onRender,this.init()};c.fn=c.prototype,a.DropPanel=c}),b(function(a,b){var c=a.DropPanel;c.fn.init=function(){var a=this;a.initDOM(),a.initHideEvent()},c.fn.initDOM=function(){var a=this,c=a.$content,d=a.width,e=a.height,f=b('<div class="wangEditor-drop-panel clearfix"></div>'),g=b('<div class="tip-triangle"></div>');f.css({width:d,height:e?e:"auto"}),f.append(g),f.append(c),a.$panel=f,a.$triangle=g},c.fn.initHideEvent=function(){var c=this,d=c.$panel.get(0);a.$body.on("click",function(a){var e,f,g;c.isShowing&&(e=a.target,f=c.menu,g=f.selected?f.$domSelected.get(0):f.$domNormal.get(0),g===e||b.contains(g,e)||d===e||b.contains(d,e)||c.hide())}),a.$window.scroll(function(){c.hide()}),a.$window.on("resize",function(){c.hide()})}}),b(function(a,b){var c=a.DropPanel;c.fn._render=function(){var a=this,b=a.onRender,c=a.editor,d=a.$panel;c.$editorContainer.append(d),b&&b.call(a),a.rendered=!0},c.fn._position=function(){var s,a=this,b=a.$panel,c=a.$triangle,d=a.editor,e=d.menuContainer.$menuContainer,f=a.menu,g=f.selected?f.$domSelected:f.$domNormal,h=g.offsetParent().position(),i=h.top,j=h.left,k=g.offsetParent().height(),l=g.offsetParent().width(),m=b.outerWidth(),n=d.txt.$txt.outerWidth(),o=i+k,p=j+l/2,q=0-m/2,r=q;0-q>p-10&&(q=0-(p-10)),s=p+m+q-n,s>-10&&(q=q-s-10),b.css({top:o,left:p,"margin-left":q}),d._isMenufixed&&(o+=e.offset().top+e.outerHeight()-b.offset().top,b.css({top:o})),c.css({"margin-left":r-q-5})},c.fn.focusFirstInput=function(){var a=this,c=a.$panel;c.find("input[type=text],textarea").each(function(){var a=b(this);return null==a.attr("disabled")?(a.focus(),!1):void 0})},c.fn.show=function(){var d,b=this,c=b.menu;b.rendered||b._render(),b.isShowing||(d=b.$panel,d.show(),b._position(),b.isShowing=!0,c.activeStyle(!0),a.w3cRange?b.focusFirstInput():a.placeholderForIE8(d))},c.fn.hide=function(){var c,a=this,b=a.menu;a.isShowing&&(c=a.$panel,c.hide(),a.isShowing=!1,b.activeStyle(!1))}}),b(function(a){var c=function(a,b,c){this.editor=a,this.menu=b,this.$content=c.$content,this.init()};c.fn=c.prototype,a.Modal=c}),b(function(a,b){var c=a.Modal;c.fn.init=function(){var a=this;a.initDom(),a.initHideEvent()},c.fn.initDom=function(){var a=this,c=a.$content,d=b('<div class="wangEditor-modal"></div>'),e=b('<div class="wangEditor-modal-close"><i class="wangeditor-menu-img-cancel-circle"></i></div>');d.append(e),d.append(c),a.$modal=d,a.$close=e},c.fn.initHideEvent=function(){var c=this,d=c.$close,e=c.$modal.get(0);d.click(function(){c.hide()}),a.$body.on("click",function(a){var d,f,g;c.isShowing&&(d=a.target,f=c.menu,f&&(g=f.selected?f.$domSelected.get(0):f.$domNormal.get(0),g===d||b.contains(g,d))||e===d||b.contains(e,d)||c.hide())})}}),b(function(a){var c=a.Modal;c.fn._render=function(){var b=this,c=b.editor,d=b.$modal;d.css("z-index",c.config.zindex+10+""),a.$body.append(d),b.rendered=!0},c.fn._position=function(){var b=this,c=b.$modal,d=c.offset().top,e=c.outerWidth(),f=c.outerHeight(),g=0-e/2,h=0-f/2,i=a.$window.scrollTop();f/2>d&&(h=0-d),c.css({"margin-left":g+"px","margin-top":h+i+"px"})},c.fn.show=function(){var c,a=this,b=a.menu;a.rendered||a._render(),a.isShowing||(a.isShowing=!0,c=a.$modal,c.show(),a._position(),b&&b.activeStyle(!0))},c.fn.hide=function(){var c,a=this,b=a.menu;a.isShowing&&(a.isShowing=!1,c=a.$modal,c.hide(),b&&b.activeStyle(!1))}}),b(function(a){var c=function(a){this.editor=a,this.init()};c.fn=c.prototype,a.Txt=c}),b(function(a,b){var c=a.Txt;c.fn.init=function(){var f,a=this,c=a.editor,d=c.$valueContainer,e=c.getInitValue();"DIV"===d.get(0).nodeName?(f=d,f.addClass("wangEditor-txt"),f.attr("contentEditable","true")):f=b('<div class="wangEditor-txt" contentEditable="true">'+e+"</div>"),c.ready(function(){a.insertEmptyP()}),a.$txt=f,a.contentEmptyHandle(),a.bindEnterForDiv(),a.bindEnterForText(),a.bindTabEvent(),a.bindPasteFilter(),a.bindFormatText(),a.bindHtml()},c.fn.contentEmptyHandle=function(){var e,a=this,c=a.editor,d=a.$txt;d.on("keydown",function(a){if(8===a.keyCode){var c=b.trim(d.html().toLowerCase());return"<p><br></p>"===c?(a.preventDefault(),void 0):void 0}}),d.on("keyup",function(a){if(8===a.keyCode){var f=b.trim(d.html().toLowerCase());f&&"<br>"!==f||(e=b("<p><br/></p>"),d.html(""),d.append(e),c.restoreSelectionByElem(e.get(0)))}})},c.fn.bindEnterForDiv=function(){function h(){if(g){var a=b("<p>"+g.html()+"</p>");g.after(a),g.remove()}}var d,e,f,g;a.config.legalTags,d=this,e=d.editor,f=d.$txt,f.on("keydown keyup",function(a){var c,d,f,i;if(13===a.keyCode&&(c=e.getRangeElem(),d=e.getLegalTags(c),!d)){if(d=e.getSelfOrParentByName(c,"div"),!d)return;f=b(d),"keydown"===a.type&&(g=f,setTimeout(h,0)),"keyup"===a.type&&(i=b("<p>"+f.html()+"</p>"),f.after(i),f.remove(),e.restoreSelectionByElem(i.get(0),"start"))}})},c.fn.bindEnterForText=function(){var c,a=this,b=a.$txt;b.on("keyup",function(b){13===b.keyCode&&(c||(c=function(){a.wrapImgAndText()}),setTimeout(c))})},c.fn.bindTabEvent=function(){var a=this,b=a.editor,c=a.$txt;c.on("keydown",function(a){9===a.keyCode&&b.queryCommandSupported("insertHtml")&&b.command(a,"insertHtml","&nbsp;&nbsp;&nbsp;&nbsp;")})},c.fn.bindPasteFilter=function(){function h(a){var c,e,f,k;if(a&&a.nodeType&&a.nodeName&&(e=a.nodeName.toLowerCase(),f=a.nodeType,3===f||1===f)){if(c=b(a),"div"===e)return k=[],b.each(a.childNodes,function(a,b){k.push(b)}),b.each(k,function(){h(this)}),void 0;if(g.indexOf(e)>=0)d+=i(a);else if(3===f)d+="<p>"+a.textContent+"</p>";else if("br"===e)d+="<br/>";else{if(["meta","style","script","object","form","iframe","hr"].indexOf(e)>=0)return;c=b(j(a)),d+=b("<div>").append(c.clone()).html()}}}function i(a){var d,c=a.nodeName.toLowerCase(),e="",f="";return["blockquote"].indexOf(c)>=0?(d=b(a),"<"+c+">"+d.text()+"</"+c+">"):["p","h1","h2","h3","h4","h5"].indexOf(c)>=0?(a=j(a),d=b(a),e=d.html(),e=e.replace(/<.*?>/gi,function(a){return"</a>"===a||0===a.indexOf("<a ")||0===a.indexOf("<img ")?a:""}),"<"+c+">"+e+"</"+c+">"):["ul","ol"].indexOf(c)>=0?(d=b(a),d.children().each(function(){var a=b(j(this)),c=a.html();c=c.replace(/<.*?>/gi,function(a){return"</a>"===a||0===a.indexOf("<a ")||0===a.indexOf("<img ")?a:""}),f+="<li>"+c+"</li>"}),"<"+c+">"+f+"</"+c+">"):(d=b(j(a)),b("<div>").append(d).html())}function j(a){var f,c=a.attributes||[],d=[],e=["href","target","src","alt","rowspan","colspan"];return b.each(c,function(a,b){b&&2===b.nodeType&&d.push(b.nodeName)}),b.each(d,function(b,c){e.indexOf(c)<0&&a.removeAttribute(c)}),f=a.childNodes,f.length&&b.each(f,function(a,b){j(b)}),a}var a=this,c=a.editor,d="",e=a.$txt,f=c.config.legalTags,g=f.split(",");e.on("paste",function(e){var f,g,i,j,k;if(c.config.pasteFilter&&(f=c.getRangeElem().nodeName,"TD"!==f&&"TH"!==f)){if(d="",j=e.clipboardData||e.originalEvent.clipboardData,k=window.clipboardData,c.config.pasteText){if(j&&j.getData)g=j.getData("text/plain");else{if(!k||!k.getData)return;g=k.getData("text")}g&&(d="<p>"+g+"</p>")}else if(j&&j.getData)g=j.getData("text/html"),g?(i=b("<div>"+g+"</div>"),h(i.get(0))):(g=j.getData("text/plain"),g&&(g=g.replace(/[ ]/g,"&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"</p><p>"),d="<p>"+g+"</p>",d=d.replace(/<p>(https?:\/\/.*?)<\/p>/gi,function(a,b){return'<p><a href="'+b+'" target="_blank">'+b+"</p>"})));else{if(!k||!k.getData)return;if(d=k.getData("text"),!d)return;d="<p>"+d+"</p>",d=d.replace(new RegExp("\n","g"),"</p><p>")}d&&(c.command(e,"insertHtml",d),a.clearEmptyOrNestP())}})},c.fn.bindFormatText=function(){var e,f,g,i,c=this;c.editor,e=c.$txt,f=a.config.legalTags,g=f.split(","),g.length,i=[],b.each(g,function(a,b){var c=">\\s*<("+b+")>";i.push(new RegExp(c,"ig"))}),i.push(new RegExp(">\\s*<(li)>","ig")),i.push(new RegExp(">\\s*<(tr)>","ig")),i.push(new RegExp(">\\s*<(code)>","ig")),e.formatText=function(){var a=b("<div>"),c=e.html();return c=c.replace(/\s*</gi,"<"),b.each(i,function(a,b){b.test(c)&&(c=c.replace(b,function(a,b){return">\n<"+b+">"}))}),a.html(c),a.text()}},c.fn.bindHtml=function(){var a=this,c=a.editor,d=a.$txt,e=c.$valueContainer,f=c.valueNodeName;d.html=function(a){var c;return"div"===f&&(c=b.fn.html.call(d,a)),void 0===a?(c=b.fn.html.call(d),c=c.replace(/(href|src)\=\"(.*)\"/gim,function(a,b,c){return b+'="'+c.replace("&amp;","&")+'"'})):(c=b.fn.html.call(d,a),e.val(a)),void 0===a?c:(d.change(),void 0)}}}),b(function(a,b){var c=a.Txt,d="propertychange change click keyup input paste";c.fn.render=function(){var a=this.$txt,b=this.editor.$editorContainer;b.append(a)},c.fn.initHeight=function(){var a=this.editor,b=this.$txt,c=a.$valueContainer.height(),d=a.menuContainer.height(),e=c-d;e=50>e?50:e,b.height(e),a.valueContainerHeight=c,this.initMaxHeight(e,d)},c.fn.initMaxHeight=function(c,d){var i,e=this.editor,f=e.menuContainer.$menuContainer,g=this.$txt,h=b("<div>");if(window.getComputedStyle&&"max-height"in window.getComputedStyle(g.get(0))){if(i=parseInt(e.$valueContainer.css("max-height")),isNaN(i))return;if(e.menus.fullscreen)return a.warn("max-height和『全屏』菜单一起使用时，会有一些问题尚未解决，请暂时不要两个同时使用"),void 0;e.useMaxHeight=!0,h.css({"max-height":i-d+"px","overflow-y":"auto"}),g.css({height:"auto","overflow-y":"visible","min-height":c+"px"}),h.on("scroll",function(){g.parent().scrollTop()>10?f.addClass("wangEditor-menu-shadow"):f.removeClass("wangEditor-menu-shadow")}),g.wrap(h)}},c.fn.saveSelectionEvent=function(){function f(){b.saveSelection()}function g(){Date.now()-e<100||(e=Date.now(),f())}function h(){c&&clearTimeout(c),c=setTimeout(f,300)}var c,a=this.$txt,b=this.editor,e=Date.now();a.on(d+" focus blur",function(){g(),h()}),a.on("mousedown",function(){a.on("mouseleave.saveSelection",function(){g(),h(),b.updateMenuStyle()})}).on("mouseup",function(){a.off("mouseleave.saveSelection")})},c.fn.updateValueEvent=function(){function f(){var c=a.html();e!==c&&(b.onchange&&"function"==typeof b.onchange&&b.onchange.call(b),b.updateValue(),e=c)}var c,e,a=this.$txt,b=this.editor;a.on(d,function(){null==e&&(e=a.html()),c&&clearTimeout(c),c=setTimeout(f,100)})},c.fn.updateMenuStyleEvent=function(){var a=this.$txt,b=this.editor;a.on(d,function(){b.updateMenuStyle()})},c.fn.insertEmptyP=function(){var a=this.$txt,c=a.children();return 0===c.length?(a.append(b("<p><br></p>")),void 0):("<br>"!==b.trim(c.last().html()).toLowerCase()&&a.append(b("<p><br></p>")),void 0)},c.fn.wrapImgAndText=function(){var g,h,a=this.$txt,c=a.children("img"),d=a[0],e=d.childNodes,f=e.length;for(c.length&&c.each(function(){b(this).wrap("<p>")}),g=0;f>g;g++)h=e[g],3===h.nodeType&&h.textContent&&b.trim(h.textContent)&&b(h).wrap("<p>")},c.fn.clearEmptyOrNestP=function(){var a=this.$txt,c=a.find("p");c.each(function(){var e,a=b(this),c=a.children(),d=c.length,f=b.trim(a.html());return f?(1===d&&(e=c.first(),e.get(0)&&"P"===e.get(0).nodeName&&a.html(e.html())),void 0):(a.remove(),void 0)})},c.fn.scrollTop=function(a){var b=this,c=b.editor,d=b.$txt;return c.useMaxHeight?d.parent().scrollTop(a):d.scrollTop(a)},c.fn.showHeightOnHover=function(){function h(a){var i,j,k,l,m,n;g||(c.append(f),g=!0),e.position().top,e.outerHeight(),i=a.height(),j=a.position().top,k=parseInt(a.css("margin-top"),10),l=parseInt(a.css("padding-top"),10),m=parseInt(a.css("margin-bottom"),10),n=parseInt(a.css("padding-bottom"),10),j+d.height(),f.css({height:i+l+k+n+m,top:j+d.height()})}function i(){g&&(f.remove(),g=!1)}var a=this.editor,c=a.$editorContainer,d=a.menuContainer,e=this.$txt,f=b('<i class="height-tip"><i>'),g=!1;e.on("mouseenter","ul,ol,blockquote,p,h1,h2,h3,h4,h5,table,pre",function(a){h(b(a.currentTarget))}).on("mouseleave",function(){i()})}}),b(function(a,b){var c,d;Array.prototype.indexOf||(Array.prototype.indexOf=function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},Array.prototype.lastIndexOf=function(a){var b=this.length;for(b-=1;b>=0;b--)if(this[b]===a)return b;return-1}),Date.now||(Date.now=function(){return(new Date).valueOf()}),c=window.console,d=function(){},b.each(["info","log","warn","error"],function(b,e){a[e]=null==c?d:function(){a.config&&a.config.printLog}}),a.random=function(){return Math.random().toString().slice(2)},a.placeholder="placeholder"in document.createElement("input"),a.placeholderForIE8=function(c){a.placeholder||c.find("input[placeholder]").each(function(){var a=b(this),c=a.attr("placeholder");""===a.val()&&(a.css("color","#666"),a.val(c),a.on("focus.placeholder click.placeholder",function(){a.val(""),a.css("color","#333"),a.off("focus.placeholder click.placeholder")}))})}}),b(function(a){a.langs={},a.langs["zh-cn"]={bold:"粗体",underline:"下划线",italic:"斜体",forecolor:"文字颜色",bgcolor:"背景色",strikethrough:"删除线",eraser:"清空格式",source:"源码",quote:"引用",fontfamily:"字体",fontsize:"字号",head:"标题",orderlist:"有序列表",unorderlist:"无序列表",alignleft:"左对齐",aligncenter:"居中",alignright:"右对齐",link:"链接",text:"文本",submit:"提交",cancel:"取消",unlink:"取消链接",table:"表格",emotion:"表情",img:"图片",video:"视频",width:"宽",height:"高",location:"位置",loading:"加载中",searchlocation:"搜索位置",dynamicMap:"动态地图",clearLocation:"清除位置",langDynamicOneLocation:"动态地图只能显示一个位置",insertcode:"插入代码",undo:"撤销",redo:"重复",fullscreen:"全屏",openLink:"打开链接"},a.langs.en={bold:"Bold",underline:"Underline",italic:"Italic",forecolor:"Color",bgcolor:"Backcolor",strikethrough:"Strikethrough",eraser:"Eraser",source:"Codeview",quote:"Quote",fontfamily:"Font family",fontsize:"Font size",head:"Head",orderlist:"Ordered list",unorderlist:"Unordered list",alignleft:"Align left",aligncenter:"Align center",alignright:"Align right",link:"Insert link",text:"Text",submit:"Submit",cancel:"Cancel",unlink:"Unlink",table:"Table",emotion:"Emotions",img:"Image",video:"Video",width:"width",height:"height",location:"Location",loading:"Loading",searchlocation:"search",dynamicMap:"Dynamic",clearLocation:"Clear",langDynamicOneLocation:"Only one location in dynamic map",insertcode:"Insert Code",undo:"Undo",redo:"Redo",fullscreen:"Full screnn",openLink:"open link"}}),b(function(a){a.config={},a.config.zindex=1e4,a.config.printLog=!0,a.config.menuFixed=0,a.config.jsFilter=!0,a.config.legalTags="p,h1,h2,h3,h4,h5,h6,blockquote,table,ul,ol,pre",a.config.lang=a.langs["zh-cn"],a.config.menus=["source","|","bold","underline","italic","strikethrough","eraser","forecolor","bgcolor","|","quote","fontfamily","fontsize","head","unorderlist","orderlist","alignleft","aligncenter","alignright","|","link","unlink","table","emotion","|","img","video","location","insertcode","|","undo","redo","fullscreen"],a.config.colors={"#880000":"暗红色","#800080":"紫色","#ff0000":"红色","#ff00ff":"鲜粉色","#000080":"深蓝色","#0000ff":"蓝色","#00ffff":"湖蓝色","#008080":"蓝绿色","#008000":"绿色","#808000":"橄榄色","#00ff00":"浅绿色","#ffcc00":"橙黄色","#808080":"灰色","#c0c0c0":"银色","#000000":"黑色","#ffffff":"白色"},a.config.familys=["宋体","黑体","楷体","微软雅黑","Arial","Verdana","Georgia","Times New Roman","Microsoft JhengHei","Trebuchet MS","Courier New","Impact","Comic Sans MS","Consolas"],a.config.fontsizes={1:"12px",2:"13px",3:"16px",4:"18px",5:"24px",6:"32px",7:"48px"},a.config.emotionsShow="icon",a.config.emotions={weibo:{title:"微博表情",data:[{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif",value:"[草泥马]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif",value:"[神马]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif",value:"[浮云]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif",value:"[给力]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif",value:"[围观]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif",value:"[威武]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif",value:"[熊猫]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif",value:"[兔子]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif",value:"[奥特曼]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif",value:"[囧]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif",value:"[互粉]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif",value:"[礼物]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/smilea_thumb.gif",value:"[呵呵]"},{icon:"http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif",value:"[哈哈]"}]}},a.config.mapAk="TVhjYjq1ICT2qqL5LdS8mwas",a.config.uploadImgUrl="",a.config.uploadTimeout=2e4,a.config.uploadImgFns={},a.config.customUpload=!1,a.config.uploadParams={},a.config.uploadHeaders={},a.config.hideLinkImg=!1,a.config.pasteFilter=!0,a.config.pasteText=!1,a.config.codeDefaultLang="javascript"
}),b(function(a){a.UI={},a.UI.menus={"default":{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-command"></i></a>',selected:".selected"},bold:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-bold"></i></a>',selected:".selected"},underline:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-underline"></i></a>',selected:".selected"},italic:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-italic"></i></a>',selected:".selected"},forecolor:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-pencil"></i></a>',selected:".selected"},bgcolor:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-brush"></i></a>',selected:".selected"},strikethrough:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-strikethrough"></i></a>',selected:".selected"},eraser:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-eraser"></i></a>',selected:".selected"},quote:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-quotes-left"></i></a>',selected:".selected"},source:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-code"></i></a>',selected:".selected"},fontfamily:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-font2"></i></a>',selected:".selected"},fontsize:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-text-height"></i></a>',selected:".selected"},head:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-header"></i></a>',selected:".selected"},orderlist:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-list-numbered"></i></a>',selected:".selected"},unorderlist:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-list-bullet"></i></a>',selected:".selected"},alignleft:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-left"></i></a>',selected:".selected"},aligncenter:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-center"></i></a>',selected:".selected"},alignright:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-right"></i></a>',selected:".selected"},link:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-link"></i></a>',selected:".selected"},unlink:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-unlink"></i></a>',selected:".selected"},table:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-table"></i></a>',selected:".selected"},emotion:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-happy"></i></a>',selected:".selected"},img:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-picture"></i></a>',selected:".selected"},video:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-play"></i></a>',selected:".selected"},location:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-location"></i></a>',selected:".selected"},insertcode:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-terminal"></i></a>',selected:".selected"},undo:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-ccw"></i></a>',selected:".selected"},redo:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-cw"></i></a>',selected:".selected"},fullscreen:{normal:'<a href="#" tabindex="-1"><i class="wangeditor-menu-img-enlarge2"></i></a>',selected:'<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-shrink2"></i></a>'}}}),b(function(a,b){a.fn.initDefaultConfig=function(){var c=this;c.config=b.extend({},a.config),c.UI=b.extend({},a.UI)}}),b(function(a,b){a.fn.addEditorContainer=function(){this.$editorContainer=b('<div class="wangEditor-container"></div>')}}),b(function(a){a.fn.addTxt=function(){var b=this,c=new a.Txt(b);b.txt=c}}),b(function(a){a.fn.addMenuContainer=function(){var b=this;b.menuContainer=new a.MenuContainer(b)}}),b(function(a,b){a.createMenuFns=[],a.createMenu=function(b){a.createMenuFns.push(b)},a.fn.addMenus=function(){function e(a){return d.indexOf(a)>=0?!0:!1}var c=this,d=c.config.menus;b.each(a.createMenuFns,function(a,b){b.call(c,e)})}}),b(function(a){a.createMenu(function(b){var d,e,f,c="bold";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.bold,commandName:"Bold"}),f.clickEventSelected=function(a){var b=d.isRangeEmpty();b?d.commandForElem("b,strong,h1,h2,h3,h4,h5",a,"Bold"):d.command(a,"Bold")},d.menus[c]=f)})}),b(function(a){a.createMenu(function(b){var d,e,f,c="underline";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.underline,commandName:"Underline"}),f.clickEventSelected=function(a){var b=d.isRangeEmpty();b?d.commandForElem("u,a",a,"Underline"):d.command(a,"Underline")},d.menus[c]=f)})}),b(function(a){a.createMenu(function(b){var d,e,f,c="italic";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.italic,commandName:"Italic"}),f.clickEventSelected=function(a){var b=d.isRangeEmpty();b?d.commandForElem("i",a,"Italic"):d.command(a,"Italic")},d.menus[c]=f)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,h,i,d="forecolor";c(d)&&(e=this,f=e.config.lang,g=e.config.colors,h=new a.Menu({editor:e,id:d,title:f.forecolor}),i=b("<div></div>"),b.each(g,function(a,b){i.append(['<a href="#" class="color-item"','    title="'+b+'" commandValue="'+a+'" ','    style="color: '+a+'" ','><i class="wangeditor-menu-img-pencil"></i></a>'].join(""))}),i.on("click","a[commandValue]",function(a){var c=b(this),d=c.attr("commandValue");h.selected&&e.isRangeEmpty()?e.commandForElem("font[color]",a,"forecolor",d):e.command(a,"forecolor",d)}),h.dropPanel=new a.DropPanel(e,h,{$content:i,width:125}),h.updateSelectedEvent=function(){var a=e.getRangeElem();return a=e.getSelfOrParentByName(a,"font[color]"),a?!0:!1},e.menus[d]=h)})}),b(function(a,b){a.createMenu(function(c){function h(a){var b;return a&&a.style&&null!=a.style.cssText&&(b=a.style.cssText,b&&b.indexOf("background-color:")>=0)?!0:!1}var e,f,g,i,j,d="bgcolor";c(d)&&(e=this,f=e.config.lang,g=e.config.colors,i=new a.Menu({editor:e,id:d,title:f.bgcolor}),j=b("<div></div>"),b.each(g,function(a,b){j.append(['<a href="#" class="color-item"','    title="'+b+'" commandValue="'+a+'" ','    style="color: '+a+'" ','><i class="wangeditor-menu-img-brush"></i></a>'].join(""))}),j.on("click","a[commandValue]",function(a){var c=b(this),d=c.attr("commandValue");i.selected&&e.isRangeEmpty()?e.commandForElem({selector:"span,font",check:h},a,"BackColor",d):e.command(a,"BackColor",d)}),i.dropPanel=new a.DropPanel(e,i,{$content:j,width:125}),i.updateSelectedEvent=function(){var a=e.getRangeElem();return a=e.getSelfOrParentByName(a,"span,font",h),a?!0:!1},e.menus[d]=i)})}),b(function(a){a.createMenu(function(b){var d,e,f,c="strikethrough";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.strikethrough,commandName:"StrikeThrough"}),f.clickEventSelected=function(a){var b=d.isRangeEmpty();b?d.commandForElem("strike",a,"StrikeThrough"):d.command(a,"StrikeThrough")},d.menus[c]=f)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,d="eraser";c(d)&&(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.eraser,commandName:"RemoveFormat"}),g.clickEvent=function(a){function f(){var e,f,h,i,j,a=this,c=a.getRangeElem(),g=a.getSelfOrParentByName(c,"blockquote");g&&(h=b(g),d=b("<p>"+h.text()+"</p>"),h.after(d).remove()),e=a.getSelfOrParentByName(c,"p,h1,h2,h3,h4,h5"),e&&(f=b(e),d=b("<p>"+f.text()+"</p>"),f.after(d).remove()),i=a.getSelfOrParentByName(c,"ul,ol"),i&&(j=b(i),d=b("<p>"+j.text()+"</p>"),j.after(d).remove())}function g(){var a=this;d&&a.restoreSelectionByElem(d.get(0))}var d,c=e.isRangeEmpty();return c?(e.customCommand(a,f,g),void 0):(e.command(a,"RemoveFormat"),void 0)},e.menus[d]=g)})}),b(function(a,b){a.createMenu(function(c){function i(){var a=h.$codeTextarea,c=e.txt.$txt,d=b.trim(a.val());d||(d="<p><br></p>"),e.config.jsFilter&&(d=d.replace(/<script[\s\S]*?<\/script>/gi,""));try{c.html(d)}catch(f){}}var e,f,g,h,d="source";c(d)&&(e=this,f=e.config.lang,h=new a.Menu({editor:e,id:d,title:f.source}),h.isShowCode=!1,h.clickEvent=function(){var k,c=this,d=c.editor,e=d.txt.$txt,f=e.outerHeight(),j=e.height();c.$codeTextarea||(c.$codeTextarea=b('<textarea class="code-textarea"></textarea>')),k=c.$codeTextarea,k.css({height:j,"margin-top":f-j}),k.val(e.html()),k.on("change",function(){i()}),e.after(k).hide(),k.show(),h.isShowCode=!0,this.updateSelected(),d.disableMenusExcept("source"),g=e.html()},h.clickEventSelected=function(){var b=this,c=b.editor,d=c.txt.$txt,e=b.$codeTextarea;e&&(i(),e.after(d).hide(),d.show(),h.isShowCode=!1,this.updateSelected(),c.enableMenusExcept("source"),d.html()!==g&&c.onchange&&"function"==typeof c.onchange&&c.onchange.call(c))},h.updateSelectedEvent=function(){return this.isShowCode},e.menus[d]=h)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,d="quote";c(d)&&(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.quote,commandName:"formatBlock",commandValue:"blockquote"}),g.clickEvent=function(a){function h(){g=b("<p>"+d.text()+"</p>"),d.after(g).remove(),g.wrap("<blockquote>")}function i(){var a=this;g&&a.restoreSelectionByElem(g.get(0))}var d,f,g,c=e.getRangeElem();return c?(f=e.getSelfOrParentByName(c,"blockquote"))?(a.preventDefault(),void 0):(c=e.getLegalTags(c),d=b(c),d.text()?c?(e.customCommand(a,h,i),void 0):(e.command(a,"formatBlock","blockquote"),void 0):void 0):(a.preventDefault(),void 0)},g.clickEventSelected=function(a){function g(){var a=b(d),c=a.children();return c.length?(c.each(function(){var d=b(this);"P"===d.get(0).nodeName?a.after(d):a.after("<p>"+d.text()+"</p>"),f=d}),a.remove(),void 0):void 0}function h(){var a=this;f&&a.restoreSelectionByElem(f.get(0))}var f,c=e.getRangeElem(),d=e.getSelfOrParentByName(c,"blockquote");return d?(e.customCommand(a,g,h),void 0):(a.preventDefault(),void 0)},g.updateSelectedEvent=function(){var a=this,b=a.editor,c=b.getRangeElem();return c=b.getSelfOrParentByName(c,"blockquote"),c?!0:!1},e.menus[d]=g,e.ready(function(){var a=this,c=a.txt.$txt,d=!1;c.on("keydown",function(c){var e,f,g;return 13!==c.keyCode?(d=!1,void 0):(e=a.getRangeElem(),(e=a.getSelfOrParentByName(e,"blockquote"))?d?(f=a.getRangeElem(),g=b(f),g.length&&g.parent().after(g),a.restoreSelectionByElem(f,"start"),d=!1,c.preventDefault(),void 0):(d=!0,void 0):(d=!1,void 0))})}),e.ready(function(){function e(){d&&d.remove()}function f(){if(d){var b=d.prev();b.length?a.restoreSelectionByElem(b.get(0)):a.initSelection()}}var d,a=this,c=a.txt.$txt;c.on("keydown",function(c){var g,h;8===c.keyCode&&(g=a.getRangeElem(),g=a.getSelfOrParentByName(g,"blockquote"),g&&(d=b(g),h=d.text(),h||a.customCommand(c,e,f)))})}))})}),b(function(a,b){a.createMenu(function(c){var e,f,g,h,i,j,d="fontfamily";c(d)&&(e=this,f=e.config.lang,g=e.config.familys,h=new a.Menu({editor:e,id:d,title:f.fontfamily,commandName:"fontName"}),i={},b.each(g,function(a,b){i[b]=b}),j='<span style="font-family:{#commandValue};">{#title}</span>',h.dropList=new a.DropList(e,h,{data:i,tpl:j,selectorForELemCommand:"font[face]"}),h.updateSelectedEvent=function(){var a=e.getRangeElem();return a=e.getSelfOrParentByName(a,"font[face]"),a?!0:!1},e.menus[d]=h)})}),b(function(a){a.createMenu(function(b){var d,e,f,g,h,i,c="fontsize";b(c)&&(d=this,e=d.config.lang,f=d.config.fontsizes,g=new a.Menu({editor:d,id:c,title:e.fontsize,commandName:"fontSize"}),h=f,i='<span style="font-size:{#title};">{#title}</span>',g.dropList=new a.DropList(d,g,{data:h,tpl:i,selectorForELemCommand:"font[size]"}),g.updateSelectedEvent=function(){var a=d.getRangeElem();return a=d.getSelfOrParentByName(a,"font[size]"),a?!0:!1},d.menus[c]=g)})}),b(function(a){a.createMenu(function(b){function i(a){d.queryCommandState("InsertOrderedList")?(h=!0,d.command(a,"InsertOrderedList")):h=!1}function j(a){h&&d.command(a,"InsertOrderedList")}var d,e,f,g,h,k,c="head";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.head,commandName:"formatBlock"}),g={"<h1>":"标题1","<h2>":"标题2","<h3>":"标题3","<h4>":"标题4","<h5>":"标题5"},k="{#commandValue}{#title}",f.dropList=new a.DropList(d,f,{data:g,tpl:k,beforeEvent:i,afterEvent:j}),f.updateSelectedEvent=function(){var a=d.getRangeElem();return a=d.getSelfOrParentByName(a,"h1,h2,h3,h4,h5"),a?!0:!1},d.menus[c]=f)})}),b(function(a){a.createMenu(function(b){var d,e,f,c="unorderlist";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.unorderlist,commandName:"InsertUnorderedList"}),d.menus[c]=f)})}),b(function(a){a.createMenu(function(b){var d,e,f,c="orderlist";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.orderlist,commandName:"InsertOrderedList"}),d.menus[c]=f)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,d="alignleft";c(d)&&(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.alignleft,commandName:"JustifyLeft"}),g.updateSelectedEvent=function(){var a=e.getRangeElem();return a=e.getSelfOrParentByName(a,"p,h1,h2,h3,h4,h5,li",function(a){var c;return a&&a.style&&null!=a.style.cssText&&(c=a.style.cssText,c&&/text-align:\s*left;/.test(c))?!0:"left"===b(a).attr("align")?!0:!1}),a?!0:!1},e.menus[d]=g)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,d="aligncenter";c(d)&&(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.aligncenter,commandName:"JustifyCenter"}),g.updateSelectedEvent=function(){var a=e.getRangeElem();return a=e.getSelfOrParentByName(a,"p,h1,h2,h3,h4,h5,li",function(a){var c;return a&&a.style&&null!=a.style.cssText&&(c=a.style.cssText,c&&/text-align:\s*center;/.test(c))?!0:"center"===b(a).attr("align")?!0:!1}),a?!0:!1},e.menus[d]=g)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,d="alignright";c(d)&&(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.alignright,commandName:"JustifyRight"}),g.updateSelectedEvent=function(){var a=e.getRangeElem();return a=e.getSelfOrParentByName(a,"p,h1,h2,h3,h4,h5,li",function(a){var c;return a&&a.style&&null!=a.style.cssText&&(c=a.style.cssText,c&&/text-align:\s*right;/.test(c))?!0:"right"===b(a).attr("align")?!0:!1}),a?!0:!1},e.menus[d]=g)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,h,i,j,k,l,m,n,o,d="link";c(d)&&(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.link}),h=b("<div></div>"),i=b('<div style="margin:20px 10px;" class="clearfix"></div>'),j=i.clone(),k=i.clone().css("margin","0 10px"),l=b('<input type="text" class="block" placeholder="'+f.text+'"/>'),m=b('<input type="text" class="block" placeholder="'+f.link+'"/>'),n=b('<button class="right">'+f.submit+"</button>"),o=b('<button class="right gray">'+f.cancel+"</button>"),i.append(l),j.append(m),k.append(n).append(o),h.append(i).append(j).append(k),g.dropPanel=new a.DropPanel(e,g,{$content:h,width:300}),g.clickEvent=function(){var d,f,g,h,b=this,c=b.dropPanel;return c.isShowing?(c.hide(),void 0):(l.val(""),m.val("http://"),d="",f=e.getRangeElem(),f=e.getSelfOrParentByName(f,"a"),f&&(d=f.href||""),g="",h=e.isRangeEmpty(),h?f&&(g=f.textContent||f.innerHTML):g=e.getRangeText()||"",d&&m.val(d),g&&l.val(g),h?l.removeAttr("disabled"):l.attr("disabled",!0),c.show(),void 0)},g.updateSelectedEvent=function(){var a=e.getRangeElem();return a=e.getSelfOrParentByName(a,"a"),a?!0:!1},o.click(function(a){a.preventDefault(),g.dropPanel.hide()}),n.click(function(c){var d,f,h,i,j,k,n,o,p,q,r,s,t;return c.preventDefault(),d=e.getRangeElem(),f=e.getSelfOrParentByName(d,"a"),h=e.isRangeEmpty(),o=e.txt.$txt,r="link"+a.random(),s=b.trim(m.val()),t=b.trim(l.val()),s?(t||(t=s),h?f?(i=b(f),k=function(){i.attr("href",s),i.text(t)},n=function(){var a=this;a.restoreSelectionByElem(f)},e.customCommand(c,k,n)):(j='<a href="'+s+'" target="_blank">'+t+"</a>",a.userAgent.indexOf("Firefox")>0&&(j+="<span>&nbsp;</span>"),e.command(c,"insertHtml",j)):(p=o.find("a"),p.attr(r,"1"),e.command(c,"createLink",s),q=o.find("a").not("["+r+"]"),q.attr("target","_blank"),p.removeAttr(r)),void 0):(g.dropPanel.focusFirstInput(),void 0)}),e.menus[d]=g)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,d="unlink";c(d)&&(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.unlink,commandName:"unLink"}),g.clickEvent=function(a){function i(){g.after(h).remove()}function j(){e.restoreSelectionByElem(h.get(0))}var d,f,g,h,c=e.isRangeEmpty();return c?(d=e.getRangeElem(),(f=e.getSelfOrParentByName(d,"a"))?(g=b(f),h=b("<span>"+g.text()+"</span>"),e.customCommand(a,i,j),void 0):(a.preventDefault(),void 0)):(e.command(a,"unLink"),void 0)},e.menus[d]=g)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,h,i,j,k,l,m,n,o,p,d="table";if(c(d)){for(e=this,f=e.config.lang,g=new a.Menu({editor:e,id:d,title:f.table}),h=b('<div style="font-size: 14px; color: #666; text-align:right;"></div>'),i=b('<table class="choose-table" style="margin-bottom:10px;margin-top:5px;">'),j=b("<span>0</span>"),k=b("<span> 行 </span>"),l=b("<span>0</span>"),m=b("<span> 列</span>"),o=0;15>o;o++){for(n=b('<tr index="'+(o+1)+'">'),p=0;20>p;p++)n.append(b('<td index="'+(p+1)+'">'));i.append(n)}h.append(i),h.append(j).append(k).append(l).append(m),i.on("mouseenter","td",function(a){var c=b(a.currentTarget),d=c.attr("index"),e=c.parent(),f=e.attr("index");j.text(f),l.text(d),i.find("tr").each(function(){var a=b(this),c=a.attr("index");parseInt(c,10)<=parseInt(f,10)?a.find("td").each(function(){var a=b(this),c=a.attr("index");parseInt(c,10)<=parseInt(d,10)?a.addClass("active"):a.removeClass("active")}):a.find("td").removeClass("active")})}).on("mouseleave",function(){i.find("td").removeClass("active"),j.text(0),l.text(0)}),i.on("click","td",function(a){var j,k,c=b(a.currentTarget),d=c.attr("index"),f=c.parent(),g=f.attr("index"),h=parseInt(g,10),i=parseInt(d,10),l="<table>";for(j=0;h>j;j++){for(l+="<tr>",k=0;i>k;k++)l+="<td><span>&nbsp;</span></td>";l+="</tr>"}l+="</table>",e.command(a,"insertHtml",l)}),g.dropPanel=new a.DropPanel(e,g,{$content:h,width:262}),e.menus[d]=g}})}),b(function(a,b){a.createMenu(function(c){function k(a,c){b.each(a,function(a,d){var f=d.icon||d.url,g=d.value||d.title,h="icon"===i?f:g,j=b('<a href="#" commandValue="'+h+'"></a>'),k=b("<img>");k.attr("_src",f),j.append(k),c.append(j),e.emotionUrls.push(f)})}var e,f,g,h,i,j,l,m,n,d="emotion";c(d)&&(e=this,f=e.config,g=f.lang,h=f.emotions,i=f.emotionsShow,e.emotionUrls=[],j=new a.Menu({editor:e,id:d,title:g.emotion}),l=b('<div class="panel-tab"></div>'),m=b('<div class="tab-container"></div>'),n=b('<div class="content-container emotion-content-container"></div>'),b.each(h,function(c,d){var g,h,e=d.title,f=d.data;if(a.log("正在处理 "+e+" 表情的数据..."),g=b('<a href="#">'+e+" </a>"),m.append(g),h=b('<div class="content"></div>'),n.append(h),g.click(function(a){m.children().removeClass("selected"),n.children().removeClass("selected"),h.addClass("selected"),g.addClass("selected"),a.preventDefault()}),"string"==typeof f)a.log("将通过 "+f+" 地址ajax下载表情包"),b.get(f,function(c){c=b.parseJSON(c),a.log("下载完毕，得到 "+c.length+" 个表情"),k(c,h)});else{if(!(Object.prototype.toString.call(f).toLowerCase().indexOf("array")>0))return a.error("data 数据格式错误，请修改为正确格式，参考文档："+a.docsite),void 0;k(f,h)}}),l.append(m).append(n),m.children().first().addClass("selected"),n.children().first().addClass("selected"),n.on("click","a[commandValue]",function(a){var c=b(a.currentTarget),d=c.attr("commandValue");"icon"===i?e.command(a,"InsertImage",d):e.command(a,"insertHtml","<span>"+d+"</span>"),a.preventDefault()}),j.dropPanel=new a.DropPanel(e,j,{$content:l,width:350}),j.clickEvent=function(){var d=this,e=d.dropPanel;return e.isShowing?(e.hide(),void 0):(e.show(),d.imgLoaded||(n.find("img").each(function(){var c=b(this),d=c.attr("_src");c.on("error",function(){a.error("加载不出表情图片 "+d)}),c.attr("src",d),c.removeAttr("_src")}),d.imgLoaded=!0),void 0)},e.menus[d]=j)})}),b(function(a,b){function c(a,c,d){function j(){g.val("")}var h,i,e=a.config.lang,f=b('<div style="margin:20px 10px 10px 10px;"></div>'),g=b('<input type="text" class="block" placeholder="http://"/>');f.append(g),h=b('<button class="right">'+e.submit+"</button>"),i=b('<button class="right gray">'+e.cancel+"</button>"),d.append(f).append(h).append(i),i.click(function(a){a.preventDefault(),c.dropPanel.hide()}),h.click(function(c){var d,e;return c.preventDefault(),(d=b.trim(g.val()))?(e='<img style="max-width:100%;" src="'+d+'"/>',a.command(c,"insertHtml",e,j),void 0):(g.focus(),void 0)})}a.createMenu(function(d){function p(){l.click(function(a){j.children().removeClass("selected"),k.children().removeClass("selected"),n.addClass("selected"),l.addClass("selected"),a.preventDefault()}),m.click(function(b){j.children().removeClass("selected"),k.children().removeClass("selected"),o.addClass("selected"),m.addClass("selected"),b.preventDefault(),a.placeholder&&o.find("input[type=text]").focus()}),l.click()}function q(){j.remove(),n.remove(),o.addClass("selected")}function r(){j.remove(),o.remove(),n.addClass("selected")}var f,g,h,i,j,k,l,m,n,o,e="img";d(e)&&(f=this,g=f.config.lang,h=new a.Menu({editor:f,id:e,title:g.img}),i=b('<div class="panel-tab"></div>'),j=b('<div class="tab-container"></div>'),k=b('<div class="content-container"></div>'),i.append(j).append(k),l=b('<a href="#">上传图片</a>'),m=b('<a href="#">网络图片</a>'),j.append(l).append(m),n=b('<div class="content"></div>'),k.append(n),o=b('<div class="content"></div>'),k.append(o),c(f,h,o),h.dropPanel=new a.DropPanel(f,h,{$content:i,width:400,onRender:function(){var a=f.config.customUploadInit;a&&a.call(f)}}),f.menus[e]=h,f.ready(function(){function g(){h.dropPanel.hide()}var a=this,b=a.config,c=b.uploadImgUrl,d=b.customUpload,e=b.hideLinkImg;c||d?(a.$uploadContent=n,p(),e&&r()):q(),n.click(function(){setTimeout(g)})}))})}),b(function(a,b){a.createMenu(function(c){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,d="video";c(d)&&(e=this,f=e.config.lang,g=/^<(iframe)|(embed)/i,h=new a.Menu({editor:e,id:d,title:f.video}),i=b("<div></div>"),j=b('<div style="margin:20px 10px;"></div>'),k=b('<input type="text" class="block" placeholder=\'格式如：<iframe src="..." frameborder=0 allowfullscreen></iframe>\'/>'),j.append(k),l=b('<div style="margin:20px 10px;"></div>'),m=b('<input type="text" value="640" style="width:50px;text-align:center;"/>'),n=b('<input type="text" value="498" style="width:50px;text-align:center;"/>'),l.append("<span> "+f.width+" </span>").append(m).append("<span> px &nbsp;&nbsp;&nbsp;</span>").append("<span> "+f.height+" </span>").append(n).append("<span> px </span>"),o=b("<div></div>"),p=b('<a href="http://www.kancloud.cn/wangfupeng/wangeditor2/134973" target="_blank" style="display:inline-block;margin-top:10px;margin-left:10px;color:#999;">如何复制视频链接？</a>'),q=b('<button class="right">'+f.submit+"</button>"),r=b('<button class="right gray">'+f.cancel+"</button>"),o.append(p).append(q).append(r),i.append(j).append(l).append(o),r.click(function(a){a.preventDefault(),k.val(""),h.dropPanel.hide()}),q.click(function(a){var c,d,f,i,j,l;return a.preventDefault(),c=b.trim(k.val()),f=parseInt(m.val()),i=parseInt(n.val()),j=b("<div>"),l="<p>{content}</p>",c?g.test(c)?isNaN(f)||isNaN(i)?(alert("宽度或高度不是数字！"),void 0):(d=b(c),d.attr("width",f).attr("height",i),l=l.replace("{content}",j.append(d).html()),e.command(a,"insertHtml",l),k.val(""),void 0):(alert("视频链接格式错误！"),h.dropPanel.focusFirstInput(),void 0):(h.dropPanel.focusFirstInput(),void 0)}),h.dropPanel=new a.DropPanel(e,h,{$content:i,width:400}),e.menus[d]=h)})}),b(function(a,b){var c=function(a){return"onkeyup"in a}(document.createElement("input"));a.baiduMapAk="TVhjYjq1ICT2qqL5LdS8mwas",a.numberOfLocation=0,a.createMenu(function(d){function y(){p.val("")}var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,e="location";if(d(e)){if(++a.numberOfLocation>1)return a.error("目前不支持在一个页面多个编辑器上同时使用地图，可通过自定义菜单配置去掉地图菜单"),void 0;f=this,g=f.config,h=g.lang,i=g.mapAk,f.mapData={},j=f.mapData,j.markers=[],j.mapContainerId="map"+a.random(),j.clearLocations=function(){var a=j.map;a&&(a.clearOverlays(),j.markers=[])},j.searchMap=function(){var b,c,d,e,f,a=j.map;a&&(b=window.BMap,c=o.val(),d=p.val(),""!==c&&(d&&""!==d||a.centerAndZoom(c,11),d&&""!==d&&(e=new b.Geocoder,e.getPoint(d,function(d){d?(a.centerAndZoom(d,13),f=new b.Marker(d),a.addOverlay(f),f.enableDragging(),j.markers.push(f)):a.centerAndZoom(c,11)},c))))},k=!1,window.baiduMapCallBack=function(){function e(b){var f,g,e=b.name;d.setCenter(e),o.val(e),a.placeholder&&p.focus(),c?(g=function(a){"keyup"===a.type&&13===a.keyCode&&a.preventDefault(),f&&clearTimeout(f),f=setTimeout(j.searchMap,500)},o.on("keyup change paste",g),p.on("keyup change paste",g)):(g=function(){var a,b,c,d;return m.is(":visible")?(a="",b="",c=o.val(),d=p.val(),(c!==a||d!==b)&&(j.searchMap(),a=c,b=d),f&&clearTimeout(f),f=setTimeout(g,1e3),void 0):(clearTimeout(f),void 0)},f=setTimeout(g,1e3))}var b,d,f;k||(k=!0,b=window.BMap,j.map||(j.map=new b.Map(j.mapContainerId)),d=j.map,d.centerAndZoom(new b.Point(116.404,39.915),11),d.addControl(new b.MapTypeControl),d.setCurrentCity("北京"),d.enableScrollWheelZoom(!0),f=new b.LocalCity,f.get(e),d.addEventListener("click",function(a){var c=new b.Marker(new b.Point(a.point.lng,a.point.lat));d.addOverlay(c),c.enableDragging(),j.markers.push(c)},!1))},j.loadMapScript=function(){var b=document.createElement("script");b.type="text/javascript",b.src="https://api.map.baidu.com/api?v=2.0&ak="+i+"&s=1&callback=baiduMapCallBack";try{document.body.appendChild(b)}catch(c){a.error("加载地图过程中发生错误")}},j.initMap=function(){window.BMap?window.baiduMapCallBack():j.loadMapScript()},l=new a.Menu({editor:f,id:e,title:h.location}),f.menus[e]=l,m=b("<div></div>"),n=b('<div style="margin:10px 0;"></div>'),o=b('<input type="text"/>'),o.css({width:"80px","text-align":"center"}),p=b('<input type="text"/>'),p.css({width:"300px","margin-left":"10px"}).attr("placeholder",h.searchlocation),q=b('<button class="right link">'+h.clearLocation+"</button>"),n.append(q).append(o).append(p),m.append(n),q.click(function(a){p.val(""),p.focus(),j.clearLocations(),a.preventDefault()}),r=b('<div id="'+j.mapContainerId+'"></div>'),r.css({height:"260px",width:"100%",position:"relative","margin-top":"10px",border:"1px solid #f1f1f1"}),s=b("<span>"+h.loading+"</span>"),s.css({position:"absolute",width:"100px","text-align":"center",top:"45%",left:"50%","margin-left":"-50px"}),r.append(s),m.append(r),t=b('<div style="margin:10px 0;"></div>'),u=b('<button class="right">'+h.submit+"</button>"),v=b('<button class="right gray">'+h.cancel+"</button>"),w=b('<label style="display:inline-block;margin-top:10px;color:#666;"></label>'),x=b('<input type="checkbox">'),w.append(x).append('<span style="display:inline-block;margin-left:5px;">  '+h.dynamicMap+"</span>"),t.append(w).append(u).append(v),m.append(t),v.click(function(a){a.preventDefault(),y(),l.dropPanel.hide()}),u.click(function(a){a.preventDefault();var p,q,r,c=j.map,d=x.is(":checked"),e=j.markers,g=c.getCenter(),i=g.lng,k=g.lat,l=c.getZoom(),m=c.getSize(),n=m.width,o=m.height;if(q=d?"http://ueditor.baidu.com/ueditor/dialogs/map/show.html#":"http://api.map.baidu.com/staticimage?",q=q+"center="+i+","+k+"&zoom="+l+"&width="+n+"&height="+o,e.length>0&&(q+="&markers=",b.each(e,function(a,b){p=b.getPosition(),a>0&&(q+="|"),q=q+p.lng+","+p.lat})),d){if(e.length>1)return alert(h.langDynamicOneLocation),void 0;q+="&markerStyles=l,A",r='<iframe class="ueditor_baidumap" src="{src}" frameborder="0" width="'+n+'" height="'+o+'"></iframe>',r=r.replace("{src}",q),f.command(a,"insertHtml",r,y)}else f.command(a,"insertHtml",'<img style="max-width:100%;" src="'+q+'"/>',y)}),l.dropPanel=new a.DropPanel(f,l,{$content:m,width:500}),l.onRender=function(){i===a.baiduMapAk&&a.warn("建议在配置中自定义百度地图的mapAk，否则可能影响地图功能，文档："+a.docsite)},l.clickEvent=function(){var b=this,c=b.dropPanel,d=!1;return c.isShowing?(c.hide(),void 0):(j.map||(d=!0),c.show(),j.initMap(),d||p.focus(),void 0)}}})}),b(function(a,b){function c(){if(!(a.userAgent.indexOf("MSIE 8")>0||window.hljs)){var b=document.createElement("script");b.type="text/javascript",b.src="//cdn.bootcss.com/highlight.js/9.2.0/highlight.min.js",document.body.appendChild(b)}}a.createMenu(function(d){function n(a){var d,e,g,k,c=b("<div></div>");c.css({margin:"15px 5px 5px 5px",height:"160px","text-align":"center"}),l.css({width:"100%",height:"100%",padding:"10px"}),l.on("keydown",function(a){9===a.keyCode&&a.preventDefault()}),c.append(l),a.append(c),d=b("<div></div>"),e=b('<button class="right">'+h.submit+"</button>"),g=b('<button class="right gray">'+h.cancel+"</button>"),d.append(e).append(g).append(m),a.append(d),g.click(function(a){a.preventDefault(),j.dropPanel.hide()}),k='<pre style="max-width:100%;overflow-x:auto;"><code{#langClass}>{#content}</code></pre>',e.click(function(a){function q(){var a;e&&(a=p.attr("class"),a!==e+" hljs"&&p.attr("class",e+" hljs")),p.html(c)}function r(){f.restoreSelectionByElem(o),h()}var c,d,e,g,h,n,o,p;return a.preventDefault(),(c=l.val())?(d=f.getRangeElem(),b.trim(b(d).text())&&0!==k.indexOf("<p><br></p>")&&(k="<p><br></p>"+k),e=m?m.val():"",g="",h=function(){i.find("pre code").each(function(a,c){var d=b(c);d.attr("codemark")||window.hljs&&(window.hljs.highlightBlock(c),d.attr("codemark","1"))})},e&&(g=' class="'+e+' hljs"'),c=c.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;"),j.selected?(o=f.getSelfOrParentByName(d,"pre"),o&&(o=f.getSelfOrParentByName(d,"code")),o&&(p=b(o),f.customCommand(a,q,r)),void 0):(n=k.replace("{#langClass}",g).replace("{#content}",c),f.command(a,"insertHtml",n,h),void 0)):(l.focus(),void 0)})}function o(){var a=f.getRangeElem(),b=f.getSelfOrParentByName(a,"code");b?f.disableMenusExcept("insertcode"):f.enableMenusExcept("insertcode")}var f,g,h,i,j,k,l,m,e="insertcode";d(e)&&(setTimeout(c,0),f=this,g=f.config,h=g.lang,i=f.txt.$txt,j=new a.Menu({editor:f,id:e,title:h.insertcode}),j.clickEvent=function(){var e,c=this,d=c.dropPanel;if(d.isShowing)return d.hide(),void 0;if(l.val(""),d.show(),e=window.hljs,e&&e.listLanguages){if(0!==m.children().length)return;m.css({"margin-top":"9px","margin-left":"5px"}),b.each(e.listLanguages(),function(a,b){"xml"===b&&(b="html"),b===g.codeDefaultLang?m.append('<option value="'+b+'" selected="selected">'+b+"</option>"):m.append('<option value="'+b+'">'+b+"</option>")})}else m.hide()},j.clickEventSelected=function(){var e,g,h,i,c=this,d=c.dropPanel;return d.isShowing?(d.hide(),void 0):(d.show(),e=f.getRangeElem(),g=f.getSelfOrParentByName(e,"pre"),g&&(g=f.getSelfOrParentByName(e,"code")),g&&(h=b(g),l.val(h.text()),m&&(i=h.attr("class"),i&&m.val(i.split(" ")[0]))),void 0)},j.updateSelectedEvent=function(){var a=this,b=a.editor,c=b.getRangeElem();return c=b.getSelfOrParentByName(c,"pre"),c?!0:!1},k=b("<div></div>"),l=b("<textarea></textarea>"),m=b("<select></select>"),n(k),j.dropPanel=new a.DropPanel(f,j,{$content:k,width:500}),f.menus[e]=j,i.on("keydown",function(a){var b,c;13===a.keyCode&&(b=f.getRangeElem(),c=f.getSelfOrParentByName(b,"code"),c&&f.command(a,"insertHtml","\n"))}),i.on("keydown click",function(){setTimeout(o)}))})}),b(function(a){a.createMenu(function(b){var d,e,f,c="undo";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.undo}),f.clickEvent=function(){d.undo()},d.menus[c]=f,d.ready(function(){function d(){a.undoRecord()}var c,a=this,b=a.txt.$txt;b.on("keydown",function(b){var e=b.keyCode;return b.ctrlKey&&90===e?(a.undo(),void 0):(13===e?d():(c&&clearTimeout(c),c=setTimeout(d,1e3)),void 0)}),a.undoRecord()}))})}),b(function(a){a.createMenu(function(b){var d,e,f,c="redo";b(c)&&(d=this,e=d.config.lang,f=new a.Menu({editor:d,id:c,title:e.redo}),f.clickEvent=function(){d.redo()},d.menus[c]=f)})}),b(function(a){var c;a.createMenu(function(b){var e,f,g,h,i,j,k,l,m,d="fullscreen";b(d)&&(e=this,f=e.txt.$txt,g=e.config,h=g.zindex||1e4,i=g.lang,j=!1,m=new a.Menu({editor:e,id:d,title:i.fullscreen}),m.clickEvent=function(){var g,i,m,n,d=e.$editorContainer;d.addClass("wangEditor-fullscreen"),k=d.css("z-index"),d.css("z-index",h),i=f.height(),m=f.outerHeight(),e.useMaxHeight&&(l=f.css("max-height"),f.css("max-height","none"),g=f.parent(),g.after(f),g.remove(),f.css("overflow-y","auto")),n=e.menuContainer,f.height(a.$window.height()-n.height()-(m-i)),e.menuContainer.$menuContainer.attr("style",""),j=!0,e.isFullScreen=!0,c=a.$window.scrollTop()
},m.clickEventSelected=function(){var d=e.$editorContainer;d.removeClass("wangEditor-fullscreen"),d.css("z-index",k),e.useMaxHeight?f.css("max-height",l):e.$valueContainer.css("height",e.valueContainerHeight),e.txt.initHeight(),j=!1,e.isFullScreen=!1,null!=c&&a.$window.scrollTop(c)},m.updateSelectedEvent=function(){return j},e.menus[d]=m)})}),b(function(a,b){a.fn.renderMenus=function(){var f,g,a=this,c=a.menus,d=a.config.menus;a.menuContainer,g=0,b.each(d,function(a,b){return"|"===b?(g++,void 0):(f=c[b],f&&f.render(g),void 0)})}}),b(function(a){a.fn.renderMenuContainer=function(){var a=this,b=a.menuContainer;a.$editorContainer,b.render()}}),b(function(a){a.fn.renderTxt=function(){var a=this,b=a.txt;b.render(),a.ready(function(){b.initHeight()})}}),b(function(a){a.fn.renderEditorContainer=function(){var e,f,a=this,b=a.$valueContainer,c=a.$editorContainer,d=a.txt.$txt;b===d?(e=a.$prev,f=a.$parent,e&&e.length?e.after(c):f.prepend(c)):(b.after(c),b.hide())}}),b(function(a,b){a.fn.eventMenus=function(){var a=this.menus;b.each(a,function(a,b){b.bindEvent()})}}),b(function(a){a.fn.eventMenuContainer=function(){}}),b(function(a){a.fn.eventTxt=function(){var a=this.txt;a.saveSelectionEvent(),a.updateValueEvent(),a.updateMenuStyleEvent()}}),b(function(a){a.plugin(function(){var b=this,c=b.config.uploadImgFns;c.onload||(c.onload=function(b){var d,e,f;a.log("上传结束，返回结果为 "+b),d=this,e=d.uploadImgOriginalName||"",0===b.indexOf("error|")?(a.warn("上传失败："+b.split("|")[1]),alert(b.split("|")[1])):(a.log("上传成功，即将插入编辑区域，结果为："+b),f=document.createElement("img"),f.onload=function(){var c='<img src="'+b+'" alt="'+e+'" style="max-width:100%;"/>';d.command(null,"insertHtml",c),a.log("已插入图片，地址 "+b),f=null},f.onerror=function(){a.error("使用返回的结果获取图片，发生错误。请确认以下结果是否正确："+b),f=null},f.src=b)}),c.ontimeout||(c.ontimeout=function(){a.error("上传图片超时"),alert("上传图片超时")}),c.onerror||(c.onerror=function(){a.error("上传上图片发生错误"),alert("上传上图片发生错误")})})}),b(function(a,b){window.FileReader&&window.FormData&&a.plugin(function(){function k(a,b){var f,c=window.atob(a.split(",")[1]),d=new ArrayBuffer(c.length),e=new Uint8Array(d);for(f=0;f<c.length;f++)e[f]=c.charCodeAt(f);return new Blob([d],{type:b})}function l(b,d){var e=document.createElement("img");e.onload=function(){var f='<img src="'+b+'" style="max-width:100%;"/>';c.command(d,"insertHtml",f),a.log("已插入图片，地址 "+b),e=null},e.onerror=function(){a.error("使用返回的结果获取图片，发生错误。请确认以下结果是否正确："+b),e=null},e.src=b}function m(a){if(a.lengthComputable){var b=a.loaded/a.total;c.showUploadProgress(100*b)}}var c=this,d=c.config,e=d.uploadImgUrl,f=d.uploadTimeout,g=d.uploadImgFns,h=g.onload,i=g.ontimeout,j=g.onerror;e&&(c.xhrUploadImg=function(d){function B(){y&&clearTimeout(y),x&&x.abort&&x.abort(),g.preventDefault(),t&&t.call(c,x),c.hideUploadProgress()}var x,y,A,g=d.event,n=d.filename||"",o=d.base64,p=d.fileType||"image/png",q=d.name||"wangEditor_upload_file",r=d.loadfn||h,s=d.errorfn||j,t=d.timeoutfn||i,u=c.config.uploadParams||{},v=c.config.uploadHeaders||{},w="png";return n.indexOf(".")>0?w=n.slice(n.lastIndexOf(".")-n.length+1):p.indexOf("/")>0&&p.split("/")[1]&&(w=p.split("/")[1]),a.isOnWebsite?(a.log("预览模拟上传"),l(o,g),void 0):(x=new XMLHttpRequest,A=new FormData,x.onload=function(){y&&clearTimeout(y),c.uploadImgOriginalName=n,n.indexOf(".")>0&&(c.uploadImgOriginalName=n.split(".")[0]),r&&r.call(c,x.responseText,x),c.hideUploadProgress()},x.onerror=function(){y&&clearTimeout(y),g.preventDefault(),s&&s.call(c,x),c.hideUploadProgress()},x.upload.onprogress=m,A.append(q,k(o,p),a.random()+"."+w),b.each(u,function(a,b){A.append(a,b)}),x.open("POST",e,!0),b.each(v,function(a,b){x.setRequestHeader(a,b)}),x.withCredentials=!0,x.send(A),y=setTimeout(B,f),a.log("开始上传...并开始超时计算"),void 0)})})}),b(function(a,b){a.plugin(function(){function i(){h||(h=!0,g.css({top:d+"px"}),e.append(g))}function k(){g.hide(),j=null}var j,a=this,c=a.menuContainer,d=c.height(),e=a.$editorContainer,f=e.width(),g=b('<div class="wangEditor-upload-progress"></div>'),h=!1;a.showUploadProgress=function(a){j&&clearTimeout(j),i(),g.show(),g.width(a*f/100)},a.hideUploadProgress=function(a){j&&clearTimeout(j),a=a||750,j=setTimeout(k,a)}})}),b(function(a,b){a.plugin(function(){var g,h,i,j,c=this,d=c.config,e=d.uploadImgUrl,f=d.uploadTimeout;e&&(h=c.$uploadContent,h&&(i=b('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>'),h.append(i),j=new a.UploadFile({editor:c,uploadUrl:e,timeout:f,fileAccept:"image/*"}),i.click(function(a){g=a,j.selectFiles()})))})}),b(function(a,b){if(window.FileReader&&window.FormData){var c=function(a){this.editor=a.editor,this.uploadUrl=a.uploadUrl,this.timeout=a.timeout,this.fileAccept=a.fileAccept,this.multiple=!0};c.fn=c.prototype,c.fn.clear=function(){this.$input.val(""),a.log("input value 已清空")},c.fn.render=function(){var d,e,f,g,h,i,c=this;c._hasRender||(a.log("渲染dom"),d=c.fileAccept,e=d?'accept="'+d+'"':"",f=c.multiple,g=f?'multiple="multiple"':"",h=b('<input type="file" '+e+" "+g+"/>"),i=b('<div style="visibility:hidden;"></div>'),i.append(h),a.$body.append(i),h.on("change",function(a){c.selected(a,h.get(0))}),c.$input=h,c._hasRender=!0)},c.fn.selectFiles=function(){var b=this;a.log("使用 html5 方式上传"),b.render(),a.log("选择文件"),b.$input.click()},c.fn.selected=function(c,d){var e=this,f=d.files||[];0!==f.length&&(a.log("选中 "+f.length+" 个文件"),b.each(f,function(a,b){e.upload(b)}))},c.fn.upload=function(b){function m(){c.clear()}var c=this,d=c.editor,e=b.name||"",f=b.type||"",g=d.config.uploadImgFns,h=d.config.uploadImgFileName||"wangEditorH5File",i=g.onload,j=g.ontimeout,k=g.onerror,l=new FileReader;return i&&j&&k?(a.log("开始执行 "+e+" 文件的上传"),l.onload=function(b){a.log("已读取"+e+"文件");var c=b.target.result||this.result;d.xhrUploadImg({event:b,filename:e,base64:c,fileType:f,name:h,loadfn:function(a,b){m();var c=this;i.call(c,a,b)},errorfn:function(b){m(),a.isOnWebsite&&alert("wangEditor官网暂时没有服务端，因此报错。实际项目中不会发生");var c=this;k.call(c,b)},timeoutfn:function(b){m(),a.isOnWebsite&&alert("wangEditor官网暂时没有服务端，因此超时。实际项目中不会发生");var c=this;j(c,b)}})},l.readAsDataURL(b),void 0):(a.error("请为编辑器配置上传图片的 onload ontimeout onerror 回调事件"),void 0)},a.UploadFile=c}}),b(function(a,b){if(!window.FileReader||!window.FormData){var c=function(a){this.editor=a.editor,this.uploadUrl=a.uploadUrl,this.timeout=a.timeout,this.fileAccept=a.fileAccept,this.multiple=!1};c.fn=c.prototype,c.fn.clear=function(){this.$input.val(""),a.log("input value 已清空")},c.fn.hideModal=function(){this.modal.hide()},c.fn.render=function(){var f,g,h,i,j,k,l,m,n,o,p,c=this,d=c.editor,e=d.config.uploadImgFileName||"wangEditorFormFile";c._hasRender||(f=c.uploadUrl,a.log("渲染dom"),g="iframe"+a.random(),h=b('<iframe name="'+g+'" id="'+g+'" frameborder="0" width="0" height="0"></iframe>'),i=c.multiple,j=i?'multiple="multiple"':"",k=b("<p>选择图片并上传</p>"),l=b('<input type="file" '+j+' name="'+e+'"/>'),m=b('<input type="submit" value="上传"/>'),n=b('<form enctype="multipart/form-data" method="post" action="'+f+'" target="'+g+'"></form>'),o=b('<div style="margin:10px 20px;"></div>'),n.append(k).append(l).append(m),b.each(d.config.uploadParams,function(a,c){n.append(b('<input type="hidden" name="'+a+'" value="'+c+'"/>'))}),o.append(n),o.append(h),c.$input=l,c.$iframe=h,p=new a.Modal(d,void 0,{$content:o}),c.modal=p,c._hasRender=!0)},c.fn.bindLoadEvent=function(){function h(){var e,h,d=b.trim(f.document.body.innerHTML);d&&(e=a.$input.val(),h=e,e.lastIndexOf("\\")>=0&&(h=e.slice(e.lastIndexOf("\\")+1),h.indexOf(".")>0&&(h=h.split(".")[0])),c.uploadImgOriginalName=h,g.call(c,d),a.clear(),a.hideModal())}var c,d,e,f,g,a=this;a._hasBindLoad||(c=a.editor,d=a.$iframe,e=d.get(0),f=e.contentWindow,g=c.config.uploadImgFns.onload,e.attachEvent?e.attachEvent("onload",h):e.onload=h,a._hasBindLoad=!0)},c.fn.show=function(){function c(){b.show(),a.bindLoadEvent()}var a=this,b=a.modal;setTimeout(c)},c.fn.selectFiles=function(){var b=this;a.log("使用 form 方式上传"),b.render(),b.clear(),b.show()},a.UploadFile=c}}),b(function(a,b){a.plugin(function(){function k(){var d=/^data:(image\/\w+);base64/,f=e.find("img");a.log("粘贴后，检查到编辑器有"+f.length+"个图片。开始遍历图片，试图找到刚刚粘贴过来的图片"),b.each(f,function(){var g,l,e=this,f=b(e),k=f.attr("src");j.each(function(){return e===this?(g=!0,!1):void 0}),g||(a.log("找到一个粘贴过来的图片"),d.test(k)?(a.log("src 是 base64 格式，可以上传"),l=k.match(d)[1],c.xhrUploadImg({event:i,base64:k,fileType:l,name:h})):a.log("src 为 "+k+" ，不是 base64 格式，暂时不支持上传"),f.remove())}),a.log("遍历结束")}var i,j,c=this,d=c.txt,e=d.$txt,f=c.config,g=f.uploadImgUrl,h=f.uploadImgFileName||"wangEditorPasteFile";g&&e.on("paste",function(d){var f,g,l;i=d,f=i.clipboardData||i.originalEvent.clipboardData,g=null==f?window.clipboardData&&window.clipboardData.getData("text"):f.getData("text/plain")||f.getData("text/html"),g||(l=f&&f.items,l?(a.log("通过 data.items 得到了数据"),b.each(l,function(b,d){var f,g,e=d.type||"";e.indexOf("image")<0||(f=d.getAsFile(),g=new FileReader,a.log("得到一个粘贴图片"),g.onload=function(b){a.log("读取到粘贴的图片");var d=b.target.result||this.result;c.xhrUploadImg({event:i,base64:d,fileType:e,name:h})},g.readAsDataURL(f))})):(a.log("未从 data.items 得到数据，使用检测粘贴图片的方式"),j=e.find("img"),a.log("粘贴前，检查到编辑器有"+j.length+"个图片"),setTimeout(k,0)))})})}),b(function(a,b){a.plugin(function(){var c=this,d=c.txt,e=d.$txt,f=c.config,g=f.uploadImgUrl,h=f.uploadImgFileName||"wangEditorDragFile";g&&(a.$document.on("dragleave drop dragenter dragover",function(a){a.preventDefault()}),e.on("drop",function(d){var e,f;d.preventDefault(),e=d.originalEvent,f=e.dataTransfer&&e.dataTransfer.files,f&&f.length&&b.each(f,function(b,e){var i,f=e.type,g=e.name;f.indexOf("image/")<0||(a.log("得到图片 "+g),i=new FileReader,i.onload=function(b){a.log("读取到图片 "+g);var e=b.target.result||this.result;c.xhrUploadImg({event:d,base64:e,fileType:f,name:h})},i.readAsDataURL(e))})}))})}),b(function(a,b){a.plugin(function(){function o(){i||(p(),j.append(k).append(l).append(m).append(n),c.$editorContainer.append(j),i=!0)}function p(){function b(b,d){f=e.html();var g=function(){d&&d(),f!==e.html()&&e.change()};a&&c.customCommand(b,a,g)}var a;l.click(function(c){a=function(){h.remove()},b(c,function(){setTimeout(r,100)})}),n.click(function(c){a=function(){h.css({width:"100%"})},b(c,function(){setTimeout(q)})}),m.click(function(c){a=function(){h.css({width:"auto"})},b(c,function(){setTimeout(q)})})}function q(){var a,b,d,e,f,i,l,m,n,o,p;c._disabled||null!=h&&(h.addClass("clicked"),a=h.position(),b=a.top,d=a.left,e=h.outerHeight(),f=h.outerWidth(),i=b+e,l=d,m=0,n=g.position().top,o=g.outerHeight(),i>n+o&&(i=n+o),j.show(),p=j.outerWidth(),m=f/2-p/2,j.css({top:i+5,left:l,"margin-left":m}),0>m?(j.css("margin-left","0"),k.hide()):k.show())}function r(){null!=h&&(h.removeClass("clicked"),h=null,j.hide())}var h,c=this,d=c.txt,e=d.$txt,f="",g=c.useMaxHeight?e.parent():e,i=!1,j=b('<div class="txt-toolbar"></div>'),k=b('<div class="tip-triangle"></div>'),l=b('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>'),m=b('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>'),n=b('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>');g.on("click","table",function(a){var c=b(a.currentTarget);return o(),h&&h.get(0)===c.get(0)?(setTimeout(r,100),void 0):(h=c,q(),a.preventDefault(),a.stopPropagation(),void 0)}).on("click keydown scroll",function(){setTimeout(r,100)}),a.$body.on("click keydown scroll",function(){setTimeout(r,100)})})}),b(function(a,b){a.userAgent.indexOf("MSIE 8")>0||a.plugin(function(){function D(a,d){var e,h,i,l,m;if(j){if(h=function(){null!=d&&(k=d),g!==f.html()&&f.change()},l=!1,m=j.parent(),"a"===m.get(0).nodeName.toLowerCase()?(i=m,l=!0):i=b('<a target="_blank"></a>'),null==d)return i.attr("href")||"";if(""===d)l&&(e=function(){j.unwrap()});else{if(d===k)return;e=function(){i.attr("href",d),l||j.wrap(i)}}e&&(g=f.html(),c.customCommand(a,e,h))}}function E(){l||(F(),G(),p.append(q).append(r).append(s).append(t).append(u).append(v).append(w).append(x),y.append(z).append(B).append(A),n.append(o).append(p).append(y),c.$editorContainer.append(n).append(m),l=!0)}function F(){function d(b,d){var e;g=f.html(),e=function(){d&&d(),g!==f.html()&&f.change()},a&&c.customCommand(b,a,e)}var a;q.click(function(b){D(b,""),a=function(){j.remove()},d(b,function(){setTimeout(I,100)})}),s.click(function(b){a=function(){var a=j.get(0),b=a.width,c=a.height;b=1.1*b,c=1.1*c,j.css({width:b+"px",height:c+"px"})},d(b,function(){setTimeout(H)})}),r.click(function(b){a=function(){var a=j.get(0),b=a.width,c=a.height;b=.9*b,c=.9*c,j.css({width:b+"px",height:c+"px"})},d(b,function(){setTimeout(H)})}),t.click(function(b){a=function(){j.parents("p").css({"text-align":"left"}).attr("align","left")},d(b,function(){setTimeout(I,100)})}),v.click(function(b){a=function(){j.parents("p").css({"text-align":"right"}).attr("align","right")},d(b,function(){setTimeout(I,100)})}),u.click(function(b){a=function(){j.parents("p").css({"text-align":"center"}).attr("align","center")},d(b,function(){setTimeout(I,100)})}),w.click(function(a){a.preventDefault(),k=D(a),z.val(k),p.hide(),y.show()}),A.click(function(a){a.preventDefault();var c=b.trim(z.val());c&&D(a,c),setTimeout(I)}),B.click(function(a){a.preventDefault(),z.val(k),p.show(),y.hide()}),x.click(function(a){a.preventDefault(),D(a,""),setTimeout(I)})}function G(){function h(a){var n,o,h=a.pageX-b,i=a.pageY-c,k=d+h,l=e+i;m.css({"margin-left":k,"margin-top":l}),n=f+h,o=g+i,j&&j.css({width:n,height:o})}var b,c,d,e,f,g;m.on("mousedown",function(i){j&&(b=i.pageX,c=i.pageY,d=parseFloat(m.css("margin-left"),10),e=parseFloat(m.css("margin-top"),10),f=j.width(),g=j.height(),n.hide(),a.$document.on("mousemove._dragResizeImg",h),a.$document.on("mouseup._dragResizeImg",function(){a.$document.off("mousemove._dragResizeImg"),a.$document.off("mouseup._dragResizeImg"),I(),m.css({"margin-left":d,"margin-top":e}),C=!1}),C=!0)})}function H(){var a,b,d,e,f,g,i,k,l,p,q;c._disabled||null!=j&&(j.addClass("clicked"),a=j.position(),b=a.top,d=a.left,e=j.outerHeight(),f=j.outerWidth(),m.css({top:b+e,left:d+f}),g=b+e,i=d,k=0,l=h.position().top,p=h.outerHeight(),g>l+p?g=l+p:m.show(),n.show(),q=n.outerWidth(),k=f/2-q/2,n.css({top:g+5,left:i,"margin-left":k}),0>k?(n.css("margin-left","0"),o.hide()):o.show(),c.disableMenusExcept())}function I(){null!=j&&(j.removeClass("clicked"),j=null,n.hide(),m.hide(),c.enableMenusExcept())}function J(a){var d=!1;return c.emotionUrls?(b.each(c.emotionUrls,function(b,c){var e=!1;return a===c&&(d=!0,e=!0),e?!1:void 0}),d):d}var j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,c=this,d=c.config.lang,e=c.txt,f=e.$txt,g="",h=c.useMaxHeight?f.parent():f;c.$editorContainer,k="",l=!1,m=b('<div class="img-drag-point"></div>'),n=b('<div class="txt-toolbar"></div>'),o=b('<div class="tip-triangle"></div>'),p=b("<div></div>"),q=b('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>'),r=b('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>'),s=b('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>'),t=b('<a href="#"><i class="wangeditor-menu-img-align-left"></i></a>'),u=b('<a href="#"><i class="wangeditor-menu-img-align-center"></i></a>'),v=b('<a href="#"><i class="wangeditor-menu-img-align-right"></i></a>'),w=b('<a href="#"><i class="wangeditor-menu-img-link"></i></a>'),x=b('<a href="#"><i class="wangeditor-menu-img-unlink"></i></a>'),y=b('<div style="display:none;"></div>'),z=b('<input type="text" style="height:26px; margin-left:10px; width:200px;"/>'),A=b('<button class="right">'+d.submit+"</button>"),B=b('<button class="right gray">'+d.cancel+"</button>"),C=!1,h.on("mousedown","img",function(a){a.preventDefault()}).on("click","img",function(a){var c=b(a.currentTarget),d=c.attr("src");if(d&&!J(d)){if(E(),j&&j.get(0)===c.get(0))return setTimeout(I,100),void 0;j=c,H(),p.show(),y.hide(),a.preventDefault(),a.stopPropagation()}}).on("click keydown scroll",function(){C||setTimeout(I,100)})})}),b(function(a,b){a.plugin(function(){function o(){i||(f.append(g).append(h),a.$editorContainer.append(f),i=!0)}function p(){var b,c,d,g,h,i,j;e&&(b=e.position(),c=b.left,d=b.top,g=e.height(),h=d+g+5,i=a.menuContainer.height(),j=a.txt.$txt.outerHeight(),h>i+j&&(h=i+j+5),f.css({top:h,left:c}))}function q(){if(!j&&e){o(),f.show();var a=e.attr("href");h.attr("href",a),p(),j=!0}}function r(){j&&e&&(f.hide(),j=!1)}var e,i,k,l,m,a=this,c=a.config.lang,d=a.txt.$txt,f=b('<div class="txt-toolbar"></div>'),g=b('<div class="tip-triangle"></div>'),h=b('<a href="#" target="_blank"><i class="wangeditor-menu-img-link"></i> '+c.openLink+"</a>"),j=!1;d.on("mouseenter","a",function(a){k&&clearTimeout(k),k=setTimeout(function(){var f,c=a.currentTarget,d=b(c);e=d,f=d.children("img"),f.length&&(f.click(function(){r()}),f.hasClass("clicked"))||q()},500)}).on("mouseleave","a",function(){l&&clearTimeout(l),l=setTimeout(r,500)}).on("click keydown scroll",function(){setTimeout(r,100)}),f.on("mouseenter",function(){l&&clearTimeout(l)}).on("mouseleave",function(){m&&clearTimeout(m),m=setTimeout(r,500)})})}),b(function(a){a.plugin(function(){var d,e,f,g,h,i,j,k,l,b=this,c=b.config.menuFixed;c!==!1&&"number"==typeof c&&(d=parseFloat(a.$body.css("margin-top"),10),isNaN(d)&&(d=0),e=b.$editorContainer,f=e.offset().top,g=e.outerHeight(),h=b.menuContainer.$menuContainer,i=h.css("position"),j=h.css("top"),k=h.offset().top,l=h.outerHeight(),b.txt.$txt,a.$window.scroll(function(){var m,n;b.isFullScreen||(m=a.$window.scrollTop(),n=h.width(),0===k&&(k=h.offset().top,f=e.offset().top,g=e.outerHeight(),l=h.outerHeight()),m>=k&&f+g>m+c+l+30?(h.css({position:"fixed",top:c}),h.width(n),a.$body.css({"margin-top":d+l}),b._isMenufixed||(b._isMenufixed=!0)):(h.css({position:i,top:j}),h.css("width","100%"),a.$body.css({"margin-top":d}),b._isMenufixed&&(b._isMenufixed=!1)))}))})}),b(function(a,b){a.createMenu(function(c){var e,f,d="indent";c(d)&&(e=this,f=new a.Menu({editor:e,id:d,title:"缩进",$domNormal:b('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-indent-left"></i></a>'),$domSelected:b('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-indent-left"></i></a>')}),f.clickEvent=function(a){function g(){f.css("text-indent","2em")}var f,c=e.getRangeElem(),d=e.getSelfOrParentByName(c,"p");return d?(f=b(d),e.customCommand(a,g),void 0):a.preventDefault()},f.clickEventSelected=function(a){function g(){f.css("text-indent","0")}var f,c=e.getRangeElem(),d=e.getSelfOrParentByName(c,"p");return d?(f=b(d),e.customCommand(a,g),void 0):a.preventDefault()},f.updateSelectedEvent=function(){var d,f,a=e.getRangeElem(),c=e.getSelfOrParentByName(a,"p");return c?(d=b(c),f=d.css("text-indent"),f&&"0px"!==f?!0:!1):!1},e.menus[d]=f)})}),b(function(a,b){a.createMenu(function(c){var e,f,g,h,d="lineheight";c(d)&&(e=this,e.commandHooks.lineHeight=function(a){var c=e.getRangeElem(),d=e.getSelfOrParentByName(c,"p,h1,h2,h3,h4,h5,pre");d&&b(d).css("line-height",a+"")},f=new a.Menu({editor:e,id:d,title:"行高",commandName:"lineHeight",$domNormal:b('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-arrows-v"></i></a>'),$domSelected:b('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-arrows-v"></i></a>')}),g={"1.0":"1.0倍",1.5:"1.5倍",1.8:"1.8倍","2.0":"2.0倍",2.5:"2.5倍","3.0":"3.0倍"},h='<span style="line-height:{#commandValue}">{#title}</span>',f.dropList=new a.DropList(e,f,{data:g,tpl:h}),e.menus[d]=f)})}),b(function(a,b){a.plugin(function(){var e,f,g,h,c=this,d=c.config.customUpload;if(d){if(c.config.uploadImgUrl)return alert("自定义上传无效，详看浏览器日志console.log"),a.error("已经配置了 uploadImgUrl ，就不能再配置 customUpload ，两者冲突。将导致自定义上传无效。"),void 0;e=c.$uploadContent,e||a.error("自定义上传，无法获取 editor.$uploadContent"),f=b('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>'),e.append(f),g="upload"+a.random(),h="upload"+a.random(),f.attr("id",g),e.attr("id",h),c.customUploadBtnId=g,c.customUploadContainerId=h}})}),window.wangEditor});

/* WebUploader 0.1.5 */
!function (a, b) {
    var c, d = {}, e = function (a, b) {
        var c, d, e;
        if ("string" == typeof a)return h(a);
        for (c = [], d = a.length, e = 0; d > e; e++)c.push(h(a[e]));
        return b.apply(null, c)
    }, f = function (a, b, c) {
        2 === arguments.length && (c = b, b = null), e(b || [], function () {
            g(a, c, arguments)
        })
    }, g = function (a, b, c) {
        var f, g = {exports: b};
        "function" == typeof b && (c.length || (c = [e, g.exports, g]), f = b.apply(null, c), void 0 !== f && (g.exports = f)), d[a] = g.exports
    }, h = function (b) {
        var c = d[b] || a[b];
        if (!c)throw new Error("`" + b + "` is undefined");
        return c
    }, i = function (a) {
        var b, c, e, f, g, h;
        h = function (a) {
            return a && a.charAt(0).toUpperCase() + a.substr(1)
        };
        for (b in d)if (c = a, d.hasOwnProperty(b)) {
            for (e = b.split("/"), g = h(e.pop()); f = h(e.shift());)c[f] = c[f] || {}, c = c[f];
            c[g] = d[b]
        }
        return a
    }, j = function (c) {
        return a.__dollar = c, i(b(a, f, e))
    };
    "object" == typeof module && "object" == typeof module.exports ? module.exports = j() : "function" == typeof define && define.amd ? define(["jquery"], j) : (c = a.WebUploader, a.WebUploader = j(), a.WebUploader.noConflict = function () {
        a.WebUploader = c
    })
}(window, function (a, b, c) {
    return b("dollar-third", [], function () {
        var b = a.__dollar || a.jQuery || a.Zepto;
        if (!b)throw new Error("jQuery or Zepto not found!");
        return b
    }), b("dollar", ["dollar-third"], function (a) {
        return a
    }), b("promise-third", ["dollar"], function (a) {
        return {
            Deferred: a.Deferred, when: a.when, isPromise: function (a) {
                return a && "function" == typeof a.then
            }
        }
    }), b("promise", ["promise-third"], function (a) {
        return a
    }), b("base", ["dollar", "promise"], function (b, c) {
        function d(a) {
            return function () {
                return h.apply(a, arguments)
            }
        }

        function e(a, b) {
            return function () {
                return a.apply(b, arguments)
            }
        }

        function f(a) {
            var b;
            return Object.create ? Object.create(a) : (b = function () {
            }, b.prototype = a, new b)
        }

        var g = function () {
        }, h = Function.call;
        return {
            version: "0.1.5",
            $: b,
            Deferred: c.Deferred,
            isPromise: c.isPromise,
            when: c.when,
            browser: function (a) {
                var b = {}, c = a.match(/WebKit\/([\d.]+)/), d = a.match(/Chrome\/([\d.]+)/) || a.match(/CriOS\/([\d.]+)/), e = a.match(/MSIE\s([\d\.]+)/) || a.match(/(?:trident)(?:.*rv:([\w.]+))?/i), f = a.match(/Firefox\/([\d.]+)/), g = a.match(/Safari\/([\d.]+)/), h = a.match(/OPR\/([\d.]+)/);
                return c && (b.webkit = parseFloat(c[1])), d && (b.chrome = parseFloat(d[1])), e && (b.ie = parseFloat(e[1])), f && (b.firefox = parseFloat(f[1])), g && (b.safari = parseFloat(g[1])), h && (b.opera = parseFloat(h[1])), b
            }(navigator.userAgent),
            os: function (a) {
                var b = {}, c = a.match(/(?:Android);?[\s\/]+([\d.]+)?/), d = a.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);
                return c && (b.android = parseFloat(c[1])), d && (b.ios = parseFloat(d[1].replace(/_/g, "."))), b
            }(navigator.userAgent),
            inherits: function (a, c, d) {
                var e;
                return "function" == typeof c ? (e = c, c = null) : e = c && c.hasOwnProperty("constructor") ? c.constructor : function () {
                    return a.apply(this, arguments)
                }, b.extend(!0, e, a, d || {}), e.__super__ = a.prototype, e.prototype = f(a.prototype), c && b.extend(!0, e.prototype, c), e
            },
            noop: g,
            bindFn: e,
            log: function () {
                return a.console ? e(console.log, console) : g
            }(),
            nextTick: function () {
                return function (a) {
                    setTimeout(a, 1)
                }
            }(),
            slice: d([].slice),
            guid: function () {
                var a = 0;
                return function (b) {
                    for (var c = (+new Date).toString(32), d = 0; 5 > d; d++)c += Math.floor(65535 * Math.random()).toString(32);
                    return (b || "wu_") + c + (a++).toString(32)
                }
            }(),
            formatSize: function (a, b, c) {
                var d;
                for (c = c || ["B", "K", "M", "G", "TB"]; (d = c.shift()) && a > 1024;)a /= 1024;
                return ("B" === d ? a : a.toFixed(b || 2)) + d
            }
        }
    }), b("mediator", ["base"], function (a) {
        function b(a, b, c, d) {
            return f.grep(a, function (a) {
                return !(!a || b && a.e !== b || c && a.cb !== c && a.cb._cb !== c || d && a.ctx !== d)
            })
        }

        function c(a, b, c) {
            f.each((a || "").split(h), function (a, d) {
                c(d, b)
            })
        }

        function d(a, b) {
            for (var c, d = !1, e = -1, f = a.length; ++e < f;)if (c = a[e], c.cb.apply(c.ctx2, b) === !1) {
                d = !0;
                break
            }
            return !d
        }

        var e, f = a.$, g = [].slice, h = /\s+/;
        return e = {
            on: function (a, b, d) {
                var e, f = this;
                return b ? (e = this._events || (this._events = []), c(a, b, function (a, b) {
                    var c = {e: a};
                    c.cb = b, c.ctx = d, c.ctx2 = d || f, c.id = e.length, e.push(c)
                }), this) : this
            }, once: function (a, b, d) {
                var e = this;
                return b ? (c(a, b, function (a, b) {
                    var c = function () {
                        return e.off(a, c), b.apply(d || e, arguments)
                    };
                    c._cb = b, e.on(a, c, d)
                }), e) : e
            }, off: function (a, d, e) {
                var g = this._events;
                return g ? a || d || e ? (c(a, d, function (a, c) {
                    f.each(b(g, a, c, e), function () {
                        delete g[this.id]
                    })
                }), this) : (this._events = [], this) : this
            }, trigger: function (a) {
                var c, e, f;
                return this._events && a ? (c = g.call(arguments, 1), e = b(this._events, a), f = b(this._events, "all"), d(e, c) && d(f, arguments)) : this
            }
        }, f.extend({
            installTo: function (a) {
                return f.extend(a, e)
            }
        }, e)
    }), b("uploader", ["base", "mediator"], function (a, b) {
        function c(a) {
            this.options = d.extend(!0, {}, c.options, a), this._init(this.options)
        }

        var d = a.$;
        return c.options = {}, b.installTo(c.prototype), d.each({
            upload: "start-upload",
            stop: "stop-upload",
            getFile: "get-file",
            getFiles: "get-files",
            addFile: "add-file",
            addFiles: "add-file",
            sort: "sort-files",
            removeFile: "remove-file",
            cancelFile: "cancel-file",
            skipFile: "skip-file",
            retry: "retry",
            isInProgress: "is-in-progress",
            makeThumb: "make-thumb",
            md5File: "md5-file",
            getDimension: "get-dimension",
            addButton: "add-btn",
            predictRuntimeType: "predict-runtime-type",
            refresh: "refresh",
            disable: "disable",
            enable: "enable",
            reset: "reset"
        }, function (a, b) {
            c.prototype[a] = function () {
                return this.request(b, arguments)
            }
        }), d.extend(c.prototype, {
            state: "pending", _init: function (a) {
                var b = this;
                b.request("init", a, function () {
                    b.state = "ready", b.trigger("ready")
                })
            }, option: function (a, b) {
                var c = this.options;
                return arguments.length > 1 ? void(d.isPlainObject(b) && d.isPlainObject(c[a]) ? d.extend(c[a], b) : c[a] = b) : a ? c[a] : c
            }, getStats: function () {
                var a = this.request("get-stats");
                return a ? {
                    successNum: a.numOfSuccess,
                    progressNum: a.numOfProgress,
                    cancelNum: a.numOfCancel,
                    invalidNum: a.numOfInvalid,
                    uploadFailNum: a.numOfUploadFailed,
                    queueNum: a.numOfQueue,
                    interruptNum: a.numofInterrupt
                } : {}
            }, trigger: function (a) {
                var c = [].slice.call(arguments, 1), e = this.options, f = "on" + a.substring(0, 1).toUpperCase() + a.substring(1);
                return b.trigger.apply(this, arguments) === !1 || d.isFunction(e[f]) && e[f].apply(this, c) === !1 || d.isFunction(this[f]) && this[f].apply(this, c) === !1 || b.trigger.apply(b, [this, a].concat(c)) === !1 ? !1 : !0
            }, destroy: function () {
                this.request("destroy", arguments), this.off()
            }, request: a.noop
        }), a.create = c.create = function (a) {
            return new c(a)
        }, a.Uploader = c, c
    }), b("runtime/runtime", ["base", "mediator"], function (a, b) {
        function c(b) {
            this.options = d.extend({container: document.body}, b), this.uid = a.guid("rt_")
        }

        var d = a.$, e = {}, f = function (a) {
            for (var b in a)if (a.hasOwnProperty(b))return b;
            return null
        };
        return d.extend(c.prototype, {
            getContainer: function () {
                var a, b, c = this.options;
                return this._container ? this._container : (a = d(c.container || document.body), b = d(document.createElement("div")), b.attr("id", "rt_" + this.uid), b.css({
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden"
                }), a.append(b), a.addClass("webuploader-container"), this._container = b, this._parent = a, b)
            }, init: a.noop, exec: a.noop, destroy: function () {
                this._container && this._container.remove(), this._parent && this._parent.removeClass("webuploader-container"), this.off()
            }
        }), c.orders = "html5,flash", c.addRuntime = function (a, b) {
            e[a] = b
        }, c.hasRuntime = function (a) {
            return !!(a ? e[a] : f(e))
        }, c.create = function (a, b) {
            var g, h;
            if (b = b || c.orders, d.each(b.split(/\s*,\s*/g), function () {
                    return e[this] ? (g = this, !1) : void 0
                }), g = g || f(e), !g)throw new Error("Runtime Error");
            return h = new e[g](a)
        }, b.installTo(c.prototype), c
    }), b("runtime/client", ["base", "mediator", "runtime/runtime"], function (a, b, c) {
        function d(b, d) {
            var f, g = a.Deferred();
            this.uid = a.guid("client_"), this.runtimeReady = function (a) {
                return g.done(a)
            }, this.connectRuntime = function (b, h) {
                if (f)throw new Error("already connected!");
                return g.done(h), "string" == typeof b && e.get(b) && (f = e.get(b)), f = f || e.get(null, d), f ? (a.$.extend(f.options, b), f.__promise.then(g.resolve), f.__client++) : (f = c.create(b, b.runtimeOrder), f.__promise = g.promise(), f.once("ready", g.resolve), f.init(), e.add(f), f.__client = 1), d && (f.__standalone = d), f
            }, this.getRuntime = function () {
                return f
            }, this.disconnectRuntime = function () {
                f && (f.__client--, f.__client <= 0 && (e.remove(f), delete f.__promise, f.destroy()), f = null)
            }, this.exec = function () {
                if (f) {
                    var c = a.slice(arguments);
                    return b && c.unshift(b), f.exec.apply(this, c)
                }
            }, this.getRuid = function () {
                return f && f.uid
            }, this.destroy = function (a) {
                return function () {
                    a && a.apply(this, arguments), this.trigger("destroy"), this.off(), this.exec("destroy"), this.disconnectRuntime()
                }
            }(this.destroy)
        }

        var e;
        return e = function () {
            var a = {};
            return {
                add: function (b) {
                    a[b.uid] = b
                }, get: function (b, c) {
                    var d;
                    if (b)return a[b];
                    for (d in a)if (!c || !a[d].__standalone)return a[d];
                    return null
                }, remove: function (b) {
                    delete a[b.uid]
                }
            }
        }(), b.installTo(d.prototype), d
    }), b("lib/dnd", ["base", "mediator", "runtime/client"], function (a, b, c) {
        function d(a) {
            a = this.options = e.extend({}, d.options, a), a.container = e(a.container), a.container.length && c.call(this, "DragAndDrop")
        }

        var e = a.$;
        return d.options = {accept: null, disableGlobalDnd: !1}, a.inherits(c, {
            constructor: d, init: function () {
                var a = this;
                a.connectRuntime(a.options, function () {
                    a.exec("init"), a.trigger("ready")
                })
            }
        }), b.installTo(d.prototype), d
    }), b("widgets/widget", ["base", "uploader"], function (a, b) {
        function c(a) {
            if (!a)return !1;
            var b = a.length, c = e.type(a);
            return 1 === a.nodeType && b ? !0 : "array" === c || "function" !== c && "string" !== c && (0 === b || "number" == typeof b && b > 0 && b - 1 in a)
        }

        function d(a) {
            this.owner = a, this.options = a.options
        }

        var e = a.$, f = b.prototype._init, g = b.prototype.destroy, h = {}, i = [];
        return e.extend(d.prototype, {
            init: a.noop, invoke: function (a, b) {
                var c = this.responseMap;
                return c && a in c && c[a]in this && e.isFunction(this[c[a]]) ? this[c[a]].apply(this, b) : h
            }, request: function () {
                return this.owner.request.apply(this.owner, arguments)
            }
        }), e.extend(b.prototype, {
            _init: function () {
                var a = this, b = a._widgets = [], c = a.options.disableWidgets || "";
                return e.each(i, function (d, e) {
                    (!c || !~c.indexOf(e._name)) && b.push(new e(a))
                }), f.apply(a, arguments)
            }, request: function (b, d, e) {
                var f, g, i, j, k = 0, l = this._widgets, m = l && l.length, n = [], o = [];
                for (d = c(d) ? d : [d]; m > k; k++)f = l[k], g = f.invoke(b, d), g !== h && (a.isPromise(g) ? o.push(g) : n.push(g));
                return e || o.length ? (i = a.when.apply(a, o), j = i.pipe ? "pipe" : "then", i[j](function () {
                    var b = a.Deferred(), c = arguments;
                    return 1 === c.length && (c = c[0]), setTimeout(function () {
                        b.resolve(c)
                    }, 1), b.promise()
                })[e ? j : "done"](e || a.noop)) : n[0]
            }, destroy: function () {
                g.apply(this, arguments), this._widgets = null
            }
        }), b.register = d.register = function (b, c) {
            var f, g = {init: "init", destroy: "destroy", name: "anonymous"};
            return 1 === arguments.length ? (c = b, e.each(c, function (a) {
                return "_" === a[0] || "name" === a ? void("name" === a && (g.name = c.name)) : void(g[a.replace(/[A-Z]/g, "-$&").toLowerCase()] = a)
            })) : g = e.extend(g, b), c.responseMap = g, f = a.inherits(d, c), f._name = g.name, i.push(f), f
        }, b.unRegister = d.unRegister = function (a) {
            if (a && "anonymous" !== a)for (var b = i.length; b--;)i[b]._name === a && i.splice(b, 1)
        }, d
    }), b("widgets/filednd", ["base", "uploader", "lib/dnd", "widgets/widget"], function (a, b, c) {
        var d = a.$;
        return b.options.dnd = "", b.register({
            name: "dnd", init: function (b) {
                if (b.dnd && "html5" === this.request("predict-runtime-type")) {
                    var e, f = this, g = a.Deferred(), h = d.extend({}, {
                        disableGlobalDnd: b.disableGlobalDnd,
                        container: b.dnd,
                        accept: b.accept
                    });
                    return this.dnd = e = new c(h), e.once("ready", g.resolve), e.on("drop", function (a) {
                        f.request("add-file", [a])
                    }), e.on("accept", function (a) {
                        return f.owner.trigger("dndAccept", a)
                    }), e.init(), g.promise()
                }
            }, destroy: function () {
                this.dnd && this.dnd.destroy()
            }
        })
    }), b("lib/filepaste", ["base", "mediator", "runtime/client"], function (a, b, c) {
        function d(a) {
            a = this.options = e.extend({}, a), a.container = e(a.container || document.body), c.call(this, "FilePaste")
        }

        var e = a.$;
        return a.inherits(c, {
            constructor: d, init: function () {
                var a = this;
                a.connectRuntime(a.options, function () {
                    a.exec("init"), a.trigger("ready")
                })
            }
        }), b.installTo(d.prototype), d
    }), b("widgets/filepaste", ["base", "uploader", "lib/filepaste", "widgets/widget"], function (a, b, c) {
        var d = a.$;
        return b.register({
            name: "paste", init: function (b) {
                if (b.paste && "html5" === this.request("predict-runtime-type")) {
                    var e, f = this, g = a.Deferred(), h = d.extend({}, {container: b.paste, accept: b.accept});
                    return this.paste = e = new c(h), e.once("ready", g.resolve), e.on("paste", function (a) {
                        f.owner.request("add-file", [a])
                    }), e.init(), g.promise()
                }
            }, destroy: function () {
                this.paste && this.paste.destroy()
            }
        })
    }), b("lib/blob", ["base", "runtime/client"], function (a, b) {
        function c(a, c) {
            var d = this;
            d.source = c, d.ruid = a, this.size = c.size || 0, this.type = !c.type && this.ext && ~"jpg,jpeg,png,gif,bmp".indexOf(this.ext) ? "image/" + ("jpg" === this.ext ? "jpeg" : this.ext) : c.type || "application/octet-stream", b.call(d, "Blob"), this.uid = c.uid || this.uid, a && d.connectRuntime(a)
        }

        return a.inherits(b, {
            constructor: c, slice: function (a, b) {
                return this.exec("slice", a, b)
            }, getSource: function () {
                return this.source
            }
        }), c
    }), b("lib/file", ["base", "lib/blob"], function (a, b) {
        function c(a, c) {
            var f;
            this.name = c.name || "untitled" + d++, f = e.exec(c.name) ? RegExp.$1.toLowerCase() : "", !f && c.type && (f = /\/(jpg|jpeg|png|gif|bmp)$/i.exec(c.type) ? RegExp.$1.toLowerCase() : "", this.name += "." + f), this.ext = f, this.lastModifiedDate = c.lastModifiedDate || (new Date).toLocaleString(), b.apply(this, arguments)
        }

        var d = 1, e = /\.([^.]+)$/;
        return a.inherits(b, c)
    }), b("lib/filepicker", ["base", "runtime/client", "lib/file"], function (b, c, d) {
        function e(a) {
            if (a = this.options = f.extend({}, e.options, a), a.container = f(a.id), !a.container.length)throw new Error("按钮指定错误");
            a.innerHTML = a.innerHTML || a.label || a.container.html() || "", a.button = f(a.button || document.createElement("div")), a.button.html(a.innerHTML), a.container.html(a.button), c.call(this, "FilePicker", !0)
        }

        var f = b.$;
        return e.options = {
            button: null,
            container: null,
            label: null,
            innerHTML: null,
            multiple: !0,
            accept: null,
            name: "file"
        }, b.inherits(c, {
            constructor: e, init: function () {
                var c = this, e = c.options, g = e.button;
                g.addClass("webuploader-pick"), c.on("all", function (a) {
                    var b;
                    switch (a) {
                        case"mouseenter":
                            g.addClass("webuploader-pick-hover");
                            break;
                        case"mouseleave":
                            g.removeClass("webuploader-pick-hover");
                            break;
                        case"change":
                            b = c.exec("getFiles"), c.trigger("select", f.map(b, function (a) {
                                return a = new d(c.getRuid(), a), a._refer = e.container, a
                            }), e.container)
                    }
                }), c.connectRuntime(e, function () {
                    c.refresh(), c.exec("init", e), c.trigger("ready")
                }), this._resizeHandler = b.bindFn(this.refresh, this), f(a).on("resize", this._resizeHandler)
            }, refresh: function () {
                var a = this.getRuntime().getContainer(), b = this.options.button, c = b.outerWidth ? b.outerWidth() : b.width(), d = b.outerHeight ? b.outerHeight() : b.height(), e = b.offset();
                c && d && a.css({bottom: "auto", right: "auto", width: c + "px", height: d + "px"}).offset(e)
            }, enable: function () {
                var a = this.options.button;
                a.removeClass("webuploader-pick-disable"), this.refresh()
            }, disable: function () {
                var a = this.options.button;
                this.getRuntime().getContainer().css({top: "-99999px"}), a.addClass("webuploader-pick-disable")
            }, destroy: function () {
                var b = this.options.button;
                f(a).off("resize", this._resizeHandler), b.removeClass("webuploader-pick-disable webuploader-pick-hover webuploader-pick")
            }
        }), e
    }), b("widgets/filepicker", ["base", "uploader", "lib/filepicker", "widgets/widget"], function (a, b, c) {
        var d = a.$;
        return d.extend(b.options, {pick: null, accept: null}), b.register({
            name: "picker", init: function (a) {
                return this.pickers = [], a.pick && this.addBtn(a.pick)
            }, refresh: function () {
                d.each(this.pickers, function () {
                    this.refresh()
                })
            }, addBtn: function (b) {
                var e = this, f = e.options, g = f.accept, h = [];
                if (b)return d.isPlainObject(b) || (b = {id: b}), d(b.id).each(function () {
                    var i, j, k;
                    k = a.Deferred(), i = d.extend({}, b, {
                        accept: d.isPlainObject(g) ? [g] : g,
                        swf: f.swf,
                        runtimeOrder: f.runtimeOrder,
                        id: this
                    }), j = new c(i), j.once("ready", k.resolve), j.on("select", function (a) {
                        e.owner.request("add-file", [a])
                    }), j.init(), e.pickers.push(j), h.push(k.promise())
                }), a.when.apply(a, h)
            }, disable: function () {
                d.each(this.pickers, function () {
                    this.disable()
                })
            }, enable: function () {
                d.each(this.pickers, function () {
                    this.enable()
                })
            }, destroy: function () {
                d.each(this.pickers, function () {
                    this.destroy()
                }), this.pickers = null
            }
        })
    }), b("lib/image", ["base", "runtime/client", "lib/blob"], function (a, b, c) {
        function d(a) {
            this.options = e.extend({}, d.options, a), b.call(this, "Image"), this.on("load", function () {
                this._info = this.exec("info"), this._meta = this.exec("meta")
            })
        }

        var e = a.$;
        return d.options = {
            quality: 90,
            crop: !1,
            preserveHeaders: !1,
            allowMagnify: !1
        }, a.inherits(b, {
            constructor: d, info: function (a) {
                return a ? (this._info = a, this) : this._info
            }, meta: function (a) {
                return a ? (this._meta = a, this) : this._meta
            }, loadFromBlob: function (a) {
                var b = this, c = a.getRuid();
                this.connectRuntime(c, function () {
                    b.exec("init", b.options), b.exec("loadFromBlob", a)
                })
            }, resize: function () {
                var b = a.slice(arguments);
                return this.exec.apply(this, ["resize"].concat(b))
            }, crop: function () {
                var b = a.slice(arguments);
                return this.exec.apply(this, ["crop"].concat(b))
            }, getAsDataUrl: function (a) {
                return this.exec("getAsDataUrl", a)
            }, getAsBlob: function (a) {
                var b = this.exec("getAsBlob", a);
                return new c(this.getRuid(), b)
            }
        }), d
    }), b("widgets/image", ["base", "uploader", "lib/image", "widgets/widget"], function (a, b, c) {
        var d, e = a.$;
        return d = function (a) {
            var b = 0, c = [], d = function () {
                for (var d; c.length && a > b;)d = c.shift(), b += d[0], d[1]()
            };
            return function (a, e, f) {
                c.push([e, f]), a.once("destroy", function () {
                    b -= e, setTimeout(d, 1)
                }), setTimeout(d, 1)
            }
        }(5242880), e.extend(b.options, {
            thumb: {
                width: 110,
                height: 110,
                quality: 70,
                allowMagnify: !0,
                crop: !0,
                preserveHeaders: !1,
                type: "image/jpeg"
            }, compress: {width: 1600, height: 1600, quality: 90, allowMagnify: !1, crop: !1, preserveHeaders: !0}
        }), b.register({
            name: "image", makeThumb: function (a, b, f, g) {
                var h, i;
                return a = this.request("get-file", a), a.type.match(/^image/) ? (h = e.extend({}, this.options.thumb), e.isPlainObject(f) && (h = e.extend(h, f), f = null), f = f || h.width, g = g || h.height, i = new c(h), i.once("load", function () {
                    a._info = a._info || i.info(), a._meta = a._meta || i.meta(), 1 >= f && f > 0 && (f = a._info.width * f), 1 >= g && g > 0 && (g = a._info.height * g), i.resize(f, g)
                }), i.once("complete", function () {
                    b(!1, i.getAsDataUrl(h.type)), i.destroy()
                }), i.once("error", function (a) {
                    b(a || !0), i.destroy()
                }), void d(i, a.source.size, function () {
                    a._info && i.info(a._info), a._meta && i.meta(a._meta), i.loadFromBlob(a.source)
                })) : void b(!0)
            }, beforeSendFile: function (b) {
                var d, f, g = this.options.compress || this.options.resize, h = g && g.compressSize || 0, i = g && g.noCompressIfLarger || !1;
                return b = this.request("get-file", b), !g || !~"image/jpeg,image/jpg".indexOf(b.type) || b.size < h || b._compressed ? void 0 : (g = e.extend({}, g), f = a.Deferred(), d = new c(g), f.always(function () {
                    d.destroy(), d = null
                }), d.once("error", f.reject), d.once("load", function () {
                    var a = g.width, c = g.height;
                    b._info = b._info || d.info(), b._meta = b._meta || d.meta(), 1 >= a && a > 0 && (a = b._info.width * a), 1 >= c && c > 0 && (c = b._info.height * c), d.resize(a, c)
                }), d.once("complete", function () {
                    var a, c;
                    try {
                        a = d.getAsBlob(g.type), c = b.size, (!i || a.size < c) && (b.source = a, b.size = a.size, b.trigger("resize", a.size, c)), b._compressed = !0, f.resolve()
                    } catch (e) {
                        f.resolve()
                    }
                }), b._info && d.info(b._info), b._meta && d.meta(b._meta), d.loadFromBlob(b.source), f.promise())
            }
        })
    }), b("file", ["base", "mediator"], function (a, b) {
        function c() {
            return f + g++
        }

        function d(a) {
            this.name = a.name || "Untitled", this.size = a.size || 0, this.type = a.type || "application/octet-stream", this.lastModifiedDate = a.lastModifiedDate || 1 * new Date, this.id = c(), this.ext = h.exec(this.name) ? RegExp.$1 : "", this.statusText = "", i[this.id] = d.Status.INITED, this.source = a, this.loaded = 0, this.on("error", function (a) {
                this.setStatus(d.Status.ERROR, a)
            })
        }

        var e = a.$, f = "WU_FILE_", g = 0, h = /\.([^.]+)$/, i = {};
        return e.extend(d.prototype, {
            setStatus: function (a, b) {
                var c = i[this.id];
                "undefined" != typeof b && (this.statusText = b), a !== c && (i[this.id] = a, this.trigger("statuschange", a, c))
            }, getStatus: function () {
                return i[this.id]
            }, getSource: function () {
                return this.source
            }, destroy: function () {
                this.off(), delete i[this.id]
            }
        }), b.installTo(d.prototype), d.Status = {
            INITED: "inited",
            QUEUED: "queued",
            PROGRESS: "progress",
            ERROR: "error",
            COMPLETE: "complete",
            CANCELLED: "cancelled",
            INTERRUPT: "interrupt",
            INVALID: "invalid"
        }, d
    }), b("queue", ["base", "mediator", "file"], function (a, b, c) {
        function d() {
            this.stats = {
                numOfQueue: 0,
                numOfSuccess: 0,
                numOfCancel: 0,
                numOfProgress: 0,
                numOfUploadFailed: 0,
                numOfInvalid: 0,
                numofDeleted: 0,
                numofInterrupt: 0
            }, this._queue = [], this._map = {}
        }

        var e = a.$, f = c.Status;
        return e.extend(d.prototype, {
            append: function (a) {
                return this._queue.push(a), this._fileAdded(a), this
            }, prepend: function (a) {
                return this._queue.unshift(a), this._fileAdded(a), this
            }, getFile: function (a) {
                return "string" != typeof a ? a : this._map[a]
            }, fetch: function (a) {
                var b, c, d = this._queue.length;
                for (a = a || f.QUEUED, b = 0; d > b; b++)if (c = this._queue[b], a === c.getStatus())return c;
                return null
            }, sort: function (a) {
                "function" == typeof a && this._queue.sort(a)
            }, getFiles: function () {
                for (var a, b = [].slice.call(arguments, 0), c = [], d = 0, f = this._queue.length; f > d; d++)a = this._queue[d], (!b.length || ~e.inArray(a.getStatus(), b)) && c.push(a);
                return c
            }, removeFile: function (a) {
                var b = this._map[a.id];
                b && (delete this._map[a.id], a.destroy(), this.stats.numofDeleted++)
            }, _fileAdded: function (a) {
                var b = this, c = this._map[a.id];
                c || (this._map[a.id] = a, a.on("statuschange", function (a, c) {
                    b._onFileStatusChange(a, c)
                }))
            }, _onFileStatusChange: function (a, b) {
                var c = this.stats;
                switch (b) {
                    case f.PROGRESS:
                        c.numOfProgress--;
                        break;
                    case f.QUEUED:
                        c.numOfQueue--;
                        break;
                    case f.ERROR:
                        c.numOfUploadFailed--;
                        break;
                    case f.INVALID:
                        c.numOfInvalid--;
                        break;
                    case f.INTERRUPT:
                        c.numofInterrupt--
                }
                switch (a) {
                    case f.QUEUED:
                        c.numOfQueue++;
                        break;
                    case f.PROGRESS:
                        c.numOfProgress++;
                        break;
                    case f.ERROR:
                        c.numOfUploadFailed++;
                        break;
                    case f.COMPLETE:
                        c.numOfSuccess++;
                        break;
                    case f.CANCELLED:
                        c.numOfCancel++;
                        break;
                    case f.INVALID:
                        c.numOfInvalid++;
                        break;
                    case f.INTERRUPT:
                        c.numofInterrupt++
                }
            }
        }), b.installTo(d.prototype), d
    }), b("widgets/queue", ["base", "uploader", "queue", "file", "lib/file", "runtime/client", "widgets/widget"], function (a, b, c, d, e, f) {
        var g = a.$, h = /\.\w+$/, i = d.Status;
        return b.register({
            name: "queue", init: function (b) {
                var d, e, h, i, j, k, l, m = this;
                if (g.isPlainObject(b.accept) && (b.accept = [b.accept]), b.accept) {
                    for (j = [], h = 0, e = b.accept.length; e > h; h++)i = b.accept[h].extensions, i && j.push(i);
                    j.length && (k = "\\." + j.join(",").replace(/,/g, "$|\\.").replace(/\*/g, ".*") + "$"), m.accept = new RegExp(k, "i")
                }
                return m.queue = new c, m.stats = m.queue.stats, "html5" === this.request("predict-runtime-type") ? (d = a.Deferred(), this.placeholder = l = new f("Placeholder"), l.connectRuntime({runtimeOrder: "html5"}, function () {
                    m._ruid = l.getRuid(), d.resolve()
                }), d.promise()) : void 0
            }, _wrapFile: function (a) {
                if (!(a instanceof d)) {
                    if (!(a instanceof e)) {
                        if (!this._ruid)throw new Error("Can't add external files.");
                        a = new e(this._ruid, a)
                    }
                    a = new d(a)
                }
                return a
            }, acceptFile: function (a) {
                var b = !a || !a.size || this.accept && h.exec(a.name) && !this.accept.test(a.name);
                return !b
            }, _addFile: function (a) {
                var b = this;
                return a = b._wrapFile(a), b.owner.trigger("beforeFileQueued", a) ? b.acceptFile(a) ? (b.queue.append(a), b.owner.trigger("fileQueued", a), a) : void b.owner.trigger("error", "Q_TYPE_DENIED", a) : void 0
            }, getFile: function (a) {
                return this.queue.getFile(a)
            }, addFile: function (a) {
                var b = this;
                a.length || (a = [a]), a = g.map(a, function (a) {
                    return b._addFile(a)
                }), b.owner.trigger("filesQueued", a), b.options.auto && setTimeout(function () {
                    b.request("start-upload")
                }, 20)
            }, getStats: function () {
                return this.stats
            }, removeFile: function (a, b) {
                var c = this;
                a = a.id ? a : c.queue.getFile(a), this.request("cancel-file", a), b && this.queue.removeFile(a)
            }, getFiles: function () {
                return this.queue.getFiles.apply(this.queue, arguments)
            }, fetchFile: function () {
                return this.queue.fetch.apply(this.queue, arguments)
            }, retry: function (a, b) {
                var c, d, e, f = this;
                if (a)return a = a.id ? a : f.queue.getFile(a), a.setStatus(i.QUEUED), void(b || f.request("start-upload"));
                for (c = f.queue.getFiles(i.ERROR), d = 0, e = c.length; e > d; d++)a = c[d], a.setStatus(i.QUEUED);
                f.request("start-upload")
            }, sortFiles: function () {
                return this.queue.sort.apply(this.queue, arguments)
            }, reset: function () {
                this.owner.trigger("reset"), this.queue = new c, this.stats = this.queue.stats
            }, destroy: function () {
                this.reset(), this.placeholder && this.placeholder.destroy()
            }
        })
    }), b("widgets/runtime", ["uploader", "runtime/runtime", "widgets/widget"], function (a, b) {
        return a.support = function () {
            return b.hasRuntime.apply(b, arguments)
        }, a.register({
            name: "runtime", init: function () {
                if (!this.predictRuntimeType())throw Error("Runtime Error")
            }, predictRuntimeType: function () {
                var a, c, d = this.options.runtimeOrder || b.orders, e = this.type;
                if (!e)for (d = d.split(/\s*,\s*/g), a = 0, c = d.length; c > a; a++)if (b.hasRuntime(d[a])) {
                    this.type = e = d[a];
                    break
                }
                return e
            }
        })
    }), b("lib/transport", ["base", "runtime/client", "mediator"], function (a, b, c) {
        function d(a) {
            var c = this;
            a = c.options = e.extend(!0, {}, d.options, a || {}), b.call(this, "Transport"), this._blob = null, this._formData = a.formData || {}, this._headers = a.headers || {}, this.on("progress", this._timeout), this.on("load error", function () {
                c.trigger("progress", 1), clearTimeout(c._timer)
            })
        }

        var e = a.$;
        return d.options = {
            server: "",
            method: "POST",
            withCredentials: !1,
            fileVal: "file",
            timeout: 12e4,
            formData: {},
            headers: {},
            sendAsBinary: !1
        }, e.extend(d.prototype, {
            appendBlob: function (a, b, c) {
                var d = this, e = d.options;
                d.getRuid() && d.disconnectRuntime(), d.connectRuntime(b.ruid, function () {
                    d.exec("init")
                }), d._blob = b, e.fileVal = a || e.fileVal, e.filename = c || e.filename
            }, append: function (a, b) {
                "object" == typeof a ? e.extend(this._formData, a) : this._formData[a] = b
            }, setRequestHeader: function (a, b) {
                "object" == typeof a ? e.extend(this._headers, a) : this._headers[a] = b
            }, send: function (a) {
                this.exec("send", a), this._timeout()
            }, abort: function () {
                return clearTimeout(this._timer), this.exec("abort")
            }, destroy: function () {
                this.trigger("destroy"), this.off(), this.exec("destroy"), this.disconnectRuntime()
            }, getResponse: function () {
                return this.exec("getResponse")
            }, getResponseAsJson: function () {
                return this.exec("getResponseAsJson")
            }, getStatus: function () {
                return this.exec("getStatus")
            }, _timeout: function () {
                var a = this, b = a.options.timeout;
                b && (clearTimeout(a._timer), a._timer = setTimeout(function () {
                    a.abort(), a.trigger("error", "timeout")
                }, b))
            }
        }), c.installTo(d.prototype), d
    }), b("widgets/upload", ["base", "uploader", "file", "lib/transport", "widgets/widget"], function (a, b, c, d) {
        function e(a, b) {
            var c, d, e = [], f = a.source, g = f.size, h = b ? Math.ceil(g / b) : 1, i = 0, j = 0;
            for (d = {
                file: a, has: function () {
                    return !!e.length
                }, shift: function () {
                    return e.shift()
                }, unshift: function (a) {
                    e.unshift(a)
                }
            }; h > j;)c = Math.min(b, g - i), e.push({
                file: a,
                start: i,
                end: b ? i + c : g,
                total: g,
                chunks: h,
                chunk: j++,
                cuted: d
            }), i += c;
            return a.blocks = e.concat(), a.remaning = e.length, d
        }

        var f = a.$, g = a.isPromise, h = c.Status;
        f.extend(b.options, {
            prepareNextFile: !1,
            chunked: !1,
            chunkSize: 5242880,
            chunkRetry: 2,
            threads: 3,
            formData: {}
        }), b.register({
            name: "upload", init: function () {
                var b = this.owner, c = this;
                this.runing = !1, this.progress = !1, b.on("startUpload", function () {
                    c.progress = !0
                }).on("uploadFinished", function () {
                    c.progress = !1
                }), this.pool = [], this.stack = [], this.pending = [], this.remaning = 0, this.__tick = a.bindFn(this._tick, this), b.on("uploadComplete", function (a) {
                    a.blocks && f.each(a.blocks, function (a, b) {
                        b.transport && (b.transport.abort(), b.transport.destroy()), delete b.transport
                    }), delete a.blocks, delete a.remaning
                })
            }, reset: function () {
                this.request("stop-upload", !0), this.runing = !1, this.pool = [], this.stack = [], this.pending = [], this.remaning = 0, this._trigged = !1, this._promise = null
            }, startUpload: function (b) {
                var c = this;
                if (f.each(c.request("get-files", h.INVALID), function () {
                        c.request("remove-file", this)
                    }), b)if (b = b.id ? b : c.request("get-file", b), b.getStatus() === h.INTERRUPT)f.each(c.pool, function (a, c) {
                    c.file === b && c.transport && c.transport.send()
                }), b.setStatus(h.QUEUED); else {
                    if (b.getStatus() === h.PROGRESS)return;
                    b.setStatus(h.QUEUED)
                } else f.each(c.request("get-files", [h.INITED]), function () {
                    this.setStatus(h.QUEUED)
                });
                if (!c.runing) {
                    c.runing = !0;
                    var d = [];
                    f.each(c.pool, function (a, b) {
                        var e = b.file;
                        e.getStatus() === h.INTERRUPT && (d.push(e), c._trigged = !1, b.transport && b.transport.send())
                    });
                    for (var b; b = d.shift();)b.setStatus(h.PROGRESS);
                    b || f.each(c.request("get-files", h.INTERRUPT), function () {
                        this.setStatus(h.PROGRESS)
                    }), c._trigged = !1, a.nextTick(c.__tick), c.owner.trigger("startUpload")
                }
            }, stopUpload: function (b, c) {
                var d = this;
                if (b === !0 && (c = b, b = null), d.runing !== !1) {
                    if (b) {
                        if (b = b.id ? b : d.request("get-file", b), b.getStatus() !== h.PROGRESS && b.getStatus() !== h.QUEUED)return;
                        return b.setStatus(h.INTERRUPT), f.each(d.pool, function (a, c) {
                            c.file === b && (c.transport && c.transport.abort(), d._putback(c), d._popBlock(c))
                        }), a.nextTick(d.__tick)
                    }
                    d.runing = !1, this._promise && this._promise.file && this._promise.file.setStatus(h.INTERRUPT), c && f.each(d.pool, function (a, b) {
                        b.transport && b.transport.abort(), b.file.setStatus(h.INTERRUPT)
                    }), d.owner.trigger("stopUpload")
                }
            }, cancelFile: function (a) {
                a = a.id ? a : this.request("get-file", a), a.blocks && f.each(a.blocks, function (a, b) {
                    var c = b.transport;
                    c && (c.abort(), c.destroy(), delete b.transport)
                }), a.setStatus(h.CANCELLED), this.owner.trigger("fileDequeued", a)
            }, isInProgress: function () {
                return !!this.progress
            }, _getStats: function () {
                return this.request("get-stats")
            }, skipFile: function (a, b) {
                a = a.id ? a : this.request("get-file", a), a.setStatus(b || h.COMPLETE), a.skipped = !0, a.blocks && f.each(a.blocks, function (a, b) {
                    var c = b.transport;
                    c && (c.abort(), c.destroy(), delete b.transport)
                }), this.owner.trigger("uploadSkip", a)
            }, _tick: function () {
                var b, c, d = this, e = d.options;
                return d._promise ? d._promise.always(d.__tick) : void(d.pool.length < e.threads && (c = d._nextBlock()) ? (d._trigged = !1, b = function (b) {
                    d._promise = null, b && b.file && d._startSend(b), a.nextTick(d.__tick)
                }, d._promise = g(c) ? c.always(b) : b(c)) : d.remaning || d._getStats().numOfQueue || d._getStats().numofInterrupt || (d.runing = !1, d._trigged || a.nextTick(function () {
                    d.owner.trigger("uploadFinished")
                }), d._trigged = !0))
            }, _putback: function (a) {
                var b;
                a.cuted.unshift(a), b = this.stack.indexOf(a.cuted), ~b || this.stack.unshift(a.cuted)
            }, _getStack: function () {
                for (var a, b = 0; a = this.stack[b++];) {
                    if (a.has() && a.file.getStatus() === h.PROGRESS)return a;
                    (!a.has() || a.file.getStatus() !== h.PROGRESS && a.file.getStatus() !== h.INTERRUPT) && this.stack.splice(--b, 1)
                }
                return null
            }, _nextBlock: function () {
                var a, b, c, d, f = this, h = f.options;
                return (a = this._getStack()) ? (h.prepareNextFile && !f.pending.length && f._prepareNextFile(), a.shift()) : f.runing ? (!f.pending.length && f._getStats().numOfQueue && f._prepareNextFile(), b = f.pending.shift(), c = function (b) {
                    return b ? (a = e(b, h.chunked ? h.chunkSize : 0), f.stack.push(a), a.shift()) : null
                }, g(b) ? (d = b.file, b = b[b.pipe ? "pipe" : "then"](c), b.file = d, b) : c(b)) : void 0
            }, _prepareNextFile: function () {
                var a, b = this, c = b.request("fetch-file"), d = b.pending;
                c && (a = b.request("before-send-file", c, function () {
                    return c.getStatus() === h.PROGRESS || c.getStatus() === h.INTERRUPT ? c : b._finishFile(c)
                }), b.owner.trigger("uploadStart", c), c.setStatus(h.PROGRESS), a.file = c, a.done(function () {
                    var b = f.inArray(a, d);
                    ~b && d.splice(b, 1, c)
                }), a.fail(function (a) {
                    c.setStatus(h.ERROR, a), b.owner.trigger("uploadError", c, a), b.owner.trigger("uploadComplete", c)
                }), d.push(a))
            }, _popBlock: function (a) {
                var b = f.inArray(a, this.pool);
                this.pool.splice(b, 1), a.file.remaning--, this.remaning--
            }, _startSend: function (b) {
                var c, d = this, e = b.file;
                return e.getStatus() !== h.PROGRESS ? void(e.getStatus() === h.INTERRUPT && d._putback(b)) : (d.pool.push(b), d.remaning++, b.blob = 1 === b.chunks ? e.source : e.source.slice(b.start, b.end), c = d.request("before-send", b, function () {
                    e.getStatus() === h.PROGRESS ? d._doSend(b) : (d._popBlock(b), a.nextTick(d.__tick))
                }), void c.fail(function () {
                    1 === e.remaning ? d._finishFile(e).always(function () {
                        b.percentage = 1, d._popBlock(b), d.owner.trigger("uploadComplete", e), a.nextTick(d.__tick)
                    }) : (b.percentage = 1, d.updateFileProgress(e), d._popBlock(b), a.nextTick(d.__tick))
                }))
            }, _doSend: function (b) {
                var c, e, g = this, i = g.owner, j = g.options, k = b.file, l = new d(j), m = f.extend({}, j.formData), n = f.extend({}, j.headers);
                b.transport = l, l.on("destroy", function () {
                    delete b.transport, g._popBlock(b), a.nextTick(g.__tick)
                }), l.on("progress", function (a) {
                    b.percentage = a, g.updateFileProgress(k)
                }), c = function (a) {
                    var c;
                    return e = l.getResponseAsJson() || {}, e._raw = l.getResponse(), c = function (b) {
                        a = b
                    }, i.trigger("uploadAccept", b, e, c) || (a = a || "server"), a
                }, l.on("error", function (a, d) {
                    b.retried = b.retried || 0, b.chunks > 1 && ~"http,abort".indexOf(a) && b.retried < j.chunkRetry ? (b.retried++, l.send()) : (d || "server" !== a || (a = c(a)), k.setStatus(h.ERROR, a), i.trigger("uploadError", k, a), i.trigger("uploadComplete", k))
                }), l.on("load", function () {
                    var a;
                    return (a = c()) ? void l.trigger("error", a, !0) : void(1 === k.remaning ? g._finishFile(k, e) : l.destroy())
                }), m = f.extend(m, {
                    id: k.id,
                    name: k.name,
                    type: k.type,
                    lastModifiedDate: k.lastModifiedDate,
                    size: k.size
                }), b.chunks > 1 && f.extend(m, {
                    chunks: b.chunks,
                    chunk: b.chunk
                }), i.trigger("uploadBeforeSend", b, m, n), l.appendBlob(j.fileVal, b.blob, k.name), l.append(m), l.setRequestHeader(n), l.send()
            }, _finishFile: function (a, b, c) {
                var d = this.owner;
                return d.request("after-send-file", arguments, function () {
                    a.setStatus(h.COMPLETE), d.trigger("uploadSuccess", a, b, c)
                }).fail(function (b) {
                    a.getStatus() === h.PROGRESS && a.setStatus(h.ERROR, b), d.trigger("uploadError", a, b)
                }).always(function () {
                    d.trigger("uploadComplete", a)
                })
            }, updateFileProgress: function (a) {
                var b = 0, c = 0;
                a.blocks && (f.each(a.blocks, function (a, b) {
                    c += (b.percentage || 0) * (b.end - b.start)
                }), b = c / a.size, this.owner.trigger("uploadProgress", a, b || 0))
            }
        })
    }), b("widgets/validator", ["base", "uploader", "file", "widgets/widget"], function (a, b, c) {
        var d, e = a.$, f = {};
        return d = {
            addValidator: function (a, b) {
                f[a] = b
            }, removeValidator: function (a) {
                delete f[a]
            }
        }, b.register({
            name: "validator", init: function () {
                var b = this;
                a.nextTick(function () {
                    e.each(f, function () {
                        this.call(b.owner)
                    })
                })
            }
        }), d.addValidator("fileNumLimit", function () {
            var a = this, b = a.options, c = 0, d = parseInt(b.fileNumLimit, 10), e = !0;
            d && (a.on("beforeFileQueued", function (a) {
                return c >= d && e && (e = !1, this.trigger("error", "Q_EXCEED_NUM_LIMIT", d, a), setTimeout(function () {
                    e = !0
                }, 1)), c >= d ? !1 : !0
            }), a.on("fileQueued", function () {
                c++
            }), a.on("fileDequeued", function () {
                c--
            }), a.on("reset", function () {
                c = 0
            }))
        }), d.addValidator("fileSizeLimit", function () {
            var a = this, b = a.options, c = 0, d = parseInt(b.fileSizeLimit, 10), e = !0;
            d && (a.on("beforeFileQueued", function (a) {
                var b = c + a.size > d;
                return b && e && (e = !1, this.trigger("error", "Q_EXCEED_SIZE_LIMIT", d, a), setTimeout(function () {
                    e = !0
                }, 1)), b ? !1 : !0
            }), a.on("fileQueued", function (a) {
                c += a.size
            }), a.on("fileDequeued", function (a) {
                c -= a.size
            }), a.on("reset", function () {
                c = 0
            }))
        }), d.addValidator("fileSingleSizeLimit", function () {
            var a = this, b = a.options, d = b.fileSingleSizeLimit;
            d && a.on("beforeFileQueued", function (a) {
                return a.size > d ? (a.setStatus(c.Status.INVALID, "exceed_size"), this.trigger("error", "F_EXCEED_SIZE", d, a), !1) : void 0
            })
        }), d.addValidator("duplicate", function () {
            function a(a) {
                for (var b, c = 0, d = 0, e = a.length; e > d; d++)b = a.charCodeAt(d), c = b + (c << 6) + (c << 16) - c;
                return c
            }

            var b = this, c = b.options, d = {};
            c.duplicate || (b.on("beforeFileQueued", function (b) {
                var c = b.__hash || (b.__hash = a(b.name + b.size + b.lastModifiedDate));
                return d[c] ? (this.trigger("error", "F_DUPLICATE", b), !1) : void 0
            }), b.on("fileQueued", function (a) {
                var b = a.__hash;
                b && (d[b] = !0)
            }), b.on("fileDequeued", function (a) {
                var b = a.__hash;
                b && delete d[b]
            }), b.on("reset", function () {
                d = {}
            }))
        }), d
    }), b("lib/md5", ["runtime/client", "mediator"], function (a, b) {
        function c() {
            a.call(this, "Md5")
        }

        return b.installTo(c.prototype), c.prototype.loadFromBlob = function (a) {
            var b = this;
            b.getRuid() && b.disconnectRuntime(), b.connectRuntime(a.ruid, function () {
                b.exec("init"), b.exec("loadFromBlob", a)
            })
        }, c.prototype.getResult = function () {
            return this.exec("getResult")
        }, c
    }), b("widgets/md5", ["base", "uploader", "lib/md5", "lib/blob", "widgets/widget"], function (a, b, c, d) {
        return b.register({
            name: "md5", md5File: function (b, e, f) {
                var g = new c, h = a.Deferred(), i = b instanceof d ? b : this.request("get-file", b).source;
                return g.on("progress load", function (a) {
                    a = a || {}, h.notify(a.total ? a.loaded / a.total : 1)
                }), g.on("complete", function () {
                    h.resolve(g.getResult())
                }), g.on("error", function (a) {
                    h.reject(a)
                }), arguments.length > 1 && (e = e || 0, f = f || 0, 0 > e && (e = i.size + e), 0 > f && (f = i.size + f), f = Math.min(f, i.size), i = i.slice(e, f)), g.loadFromBlob(i), h.promise()
            }
        })
    }), b("runtime/compbase", [], function () {
        function a(a, b) {
            this.owner = a, this.options = a.options, this.getRuntime = function () {
                return b
            }, this.getRuid = function () {
                return b.uid
            }, this.trigger = function () {
                return a.trigger.apply(a, arguments)
            }
        }

        return a
    }), b("runtime/html5/runtime", ["base", "runtime/runtime", "runtime/compbase"], function (b, c, d) {
        function e() {
            var a = {}, d = this, e = this.destroy;
            c.apply(d, arguments), d.type = f, d.exec = function (c, e) {
                var f, h = this, i = h.uid, j = b.slice(arguments, 2);
                return g[c] && (f = a[i] = a[i] || new g[c](h, d), f[e]) ? f[e].apply(f, j) : void 0
            }, d.destroy = function () {
                return e && e.apply(this, arguments)
            }
        }

        var f = "html5", g = {};
        return b.inherits(c, {
            constructor: e, init: function () {
                var a = this;
                setTimeout(function () {
                    a.trigger("ready")
                }, 1)
            }
        }), e.register = function (a, c) {
            var e = g[a] = b.inherits(d, c);
            return e
        }, a.Blob && a.FileReader && a.DataView && c.addRuntime(f, e), e
    }), b("runtime/html5/blob", ["runtime/html5/runtime", "lib/blob"], function (a, b) {
        return a.register("Blob", {
            slice: function (a, c) {
                var d = this.owner.source, e = d.slice || d.webkitSlice || d.mozSlice;
                return d = e.call(d, a, c), new b(this.getRuid(), d)
            }
        })
    }), b("runtime/html5/dnd", ["base", "runtime/html5/runtime", "lib/file"], function (a, b, c) {
        var d = a.$, e = "webuploader-dnd-";
        return b.register("DragAndDrop", {
            init: function () {
                var b = this.elem = this.options.container;
                this.dragEnterHandler = a.bindFn(this._dragEnterHandler, this), this.dragOverHandler = a.bindFn(this._dragOverHandler, this), this.dragLeaveHandler = a.bindFn(this._dragLeaveHandler, this), this.dropHandler = a.bindFn(this._dropHandler, this), this.dndOver = !1, b.on("dragenter", this.dragEnterHandler), b.on("dragover", this.dragOverHandler), b.on("dragleave", this.dragLeaveHandler), b.on("drop", this.dropHandler), this.options.disableGlobalDnd && (d(document).on("dragover", this.dragOverHandler), d(document).on("drop", this.dropHandler))
            }, _dragEnterHandler: function (a) {
                var b, c = this, d = c._denied || !1;
                return a = a.originalEvent || a, c.dndOver || (c.dndOver = !0, b = a.dataTransfer.items, b && b.length && (c._denied = d = !c.trigger("accept", b)), c.elem.addClass(e + "over"), c.elem[d ? "addClass" : "removeClass"](e + "denied")), a.dataTransfer.dropEffect = d ? "none" : "copy", !1
            }, _dragOverHandler: function (a) {
                var b = this.elem.parent().get(0);
                return b && !d.contains(b, a.currentTarget) ? !1 : (clearTimeout(this._leaveTimer), this._dragEnterHandler.call(this, a), !1)
            }, _dragLeaveHandler: function () {
                var a, b = this;
                return a = function () {
                    b.dndOver = !1, b.elem.removeClass(e + "over " + e + "denied")
                }, clearTimeout(b._leaveTimer), b._leaveTimer = setTimeout(a, 100), !1
            }, _dropHandler: function (a) {
                var b, f, g = this, h = g.getRuid(), i = g.elem.parent().get(0);
                if (i && !d.contains(i, a.currentTarget))return !1;
                a = a.originalEvent || a, b = a.dataTransfer;
                try {
                    f = b.getData("text/html")
                } catch (j) {
                }
                return f ? void 0 : (g._getTansferFiles(b, function (a) {
                    g.trigger("drop", d.map(a, function (a) {
                        return new c(h, a)
                    }))
                }), g.dndOver = !1, g.elem.removeClass(e + "over"), !1)
            }, _getTansferFiles: function (b, c) {
                var d, e, f, g, h, i, j, k = [], l = [];
                for (d = b.items, e = b.files, j = !(!d || !d[0].webkitGetAsEntry), h = 0, i = e.length; i > h; h++)f = e[h], g = d && d[h], j && g.webkitGetAsEntry().isDirectory ? l.push(this._traverseDirectoryTree(g.webkitGetAsEntry(), k)) : k.push(f);
                a.when.apply(a, l).done(function () {
                    k.length && c(k)
                })
            }, _traverseDirectoryTree: function (b, c) {
                var d = a.Deferred(), e = this;
                return b.isFile ? b.file(function (a) {
                    c.push(a), d.resolve()
                }) : b.isDirectory && b.createReader().readEntries(function (b) {
                    var f, g = b.length, h = [], i = [];
                    for (f = 0; g > f; f++)h.push(e._traverseDirectoryTree(b[f], i));
                    a.when.apply(a, h).then(function () {
                        c.push.apply(c, i), d.resolve()
                    }, d.reject)
                }), d.promise()
            }, destroy: function () {
                var a = this.elem;
                a && (a.off("dragenter", this.dragEnterHandler), a.off("dragover", this.dragOverHandler), a.off("dragleave", this.dragLeaveHandler), a.off("drop", this.dropHandler), this.options.disableGlobalDnd && (d(document).off("dragover", this.dragOverHandler), d(document).off("drop", this.dropHandler)))
            }
        })
    }), b("runtime/html5/filepaste", ["base", "runtime/html5/runtime", "lib/file"], function (a, b, c) {
        return b.register("FilePaste", {
            init: function () {
                var b, c, d, e, f = this.options, g = this.elem = f.container, h = ".*";
                if (f.accept) {
                    for (b = [], c = 0, d = f.accept.length; d > c; c++)e = f.accept[c].mimeTypes, e && b.push(e);
                    b.length && (h = b.join(","), h = h.replace(/,/g, "|").replace(/\*/g, ".*"))
                }
                this.accept = h = new RegExp(h, "i"), this.hander = a.bindFn(this._pasteHander, this), g.on("paste", this.hander)
            }, _pasteHander: function (a) {
                var b, d, e, f, g, h = [], i = this.getRuid();
                for (a = a.originalEvent || a, b = a.clipboardData.items, f = 0, g = b.length; g > f; f++)d = b[f], "file" === d.kind && (e = d.getAsFile()) && h.push(new c(i, e));
                h.length && (a.preventDefault(), a.stopPropagation(), this.trigger("paste", h))
            }, destroy: function () {
                this.elem.off("paste", this.hander)
            }
        })
    }), b("runtime/html5/filepicker", ["base", "runtime/html5/runtime"], function (a, b) {
        var c = a.$;
        return b.register("FilePicker", {
            init: function () {
                var a, b, d, e, f = this.getRuntime().getContainer(), g = this, h = g.owner, i = g.options, j = this.label = c(document.createElement("label")), k = this.input = c(document.createElement("input"));
                if (k.attr("type", "file"), k.attr("name", i.name), k.addClass("webuploader-element-invisible"), j.on("click", function () {
                        k.trigger("click")
                    }), j.css({
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        display: "block",
                        cursor: "pointer",
                        background: "#ffffff"
                    }), i.multiple && k.attr("multiple", "multiple"), i.accept && i.accept.length > 0) {
                    for (a = [], b = 0, d = i.accept.length; d > b; b++)a.push(i.accept[b].mimeTypes);
                    k.attr("accept", a.join(","))
                }
                f.append(k), f.append(j), e = function (a) {
                    h.trigger(a.type)
                }, k.on("change", function (a) {
                    var b, d = arguments.callee;
                    g.files = a.target.files, b = this.cloneNode(!0), b.value = null, this.parentNode.replaceChild(b, this), k.off(), k = c(b).on("change", d).on("mouseenter mouseleave", e), h.trigger("change")
                }), j.on("mouseenter mouseleave", e)
            }, getFiles: function () {
                return this.files
            }, destroy: function () {
                this.input.off(), this.label.off()
            }
        })
    }), b("runtime/html5/util", ["base"], function (b) {
        var c = a.createObjectURL && a || a.URL && URL.revokeObjectURL && URL || a.webkitURL, d = b.noop, e = d;
        return c && (d = function () {
            return c.createObjectURL.apply(c, arguments)
        }, e = function () {
            return c.revokeObjectURL.apply(c, arguments)
        }), {
            createObjectURL: d, revokeObjectURL: e, dataURL2Blob: function (a) {
                var b, c, d, e, f, g;
                for (g = a.split(","), b = ~g[0].indexOf("base64") ? atob(g[1]) : decodeURIComponent(g[1]), d = new ArrayBuffer(b.length), c = new Uint8Array(d), e = 0; e < b.length; e++)c[e] = b.charCodeAt(e);
                return f = g[0].split(":")[1].split(";")[0], this.arrayBufferToBlob(d, f)
            }, dataURL2ArrayBuffer: function (a) {
                var b, c, d, e;
                for (e = a.split(","), b = ~e[0].indexOf("base64") ? atob(e[1]) : decodeURIComponent(e[1]), c = new Uint8Array(b.length), d = 0; d < b.length; d++)c[d] = b.charCodeAt(d);
                return c.buffer
            }, arrayBufferToBlob: function (b, c) {
                var d, e = a.BlobBuilder || a.WebKitBlobBuilder;
                return e ? (d = new e, d.append(b), d.getBlob(c)) : new Blob([b], c ? {type: c} : {})
            }, canvasToDataUrl: function (a, b, c) {
                return a.toDataURL(b, c / 100)
            }, parseMeta: function (a, b) {
                b(!1, {})
            }, updateImageHead: function (a) {
                return a
            }
        }
    }), b("runtime/html5/imagemeta", ["runtime/html5/util"], function (a) {
        var b;
        return b = {
            parsers: {65505: []}, maxMetaDataSize: 262144, parse: function (a, b) {
                var c = this, d = new FileReader;
                d.onload = function () {
                    b(!1, c._parse(this.result)), d = d.onload = d.onerror = null
                }, d.onerror = function (a) {
                    b(a.message), d = d.onload = d.onerror = null
                }, a = a.slice(0, c.maxMetaDataSize), d.readAsArrayBuffer(a.getSource())
            }, _parse: function (a, c) {
                if (!(a.byteLength < 6)) {
                    var d, e, f, g, h = new DataView(a), i = 2, j = h.byteLength - 4, k = i, l = {};
                    if (65496 === h.getUint16(0)) {
                        for (; j > i && (d = h.getUint16(i), d >= 65504 && 65519 >= d || 65534 === d) && (e = h.getUint16(i + 2) + 2, !(i + e > h.byteLength));) {
                            if (f = b.parsers[d], !c && f)for (g = 0; g < f.length; g += 1)f[g].call(b, h, i, e, l);
                            i += e, k = i
                        }
                        k > 6 && (l.imageHead = a.slice ? a.slice(2, k) : new Uint8Array(a).subarray(2, k))
                    }
                    return l
                }
            }, updateImageHead: function (a, b) {
                var c, d, e, f = this._parse(a, !0);
                return e = 2, f.imageHead && (e = 2 + f.imageHead.byteLength), d = a.slice ? a.slice(e) : new Uint8Array(a).subarray(e), c = new Uint8Array(b.byteLength + 2 + d.byteLength), c[0] = 255, c[1] = 216, c.set(new Uint8Array(b), 2), c.set(new Uint8Array(d), b.byteLength + 2), c.buffer
            }
        }, a.parseMeta = function () {
            return b.parse.apply(b, arguments)
        }, a.updateImageHead = function () {
            return b.updateImageHead.apply(b, arguments)
        }, b
    }), b("runtime/html5/imagemeta/exif", ["base", "runtime/html5/imagemeta"], function (a, b) {
        var c = {};
        return c.ExifMap = function () {
            return this
        }, c.ExifMap.prototype.map = {Orientation: 274}, c.ExifMap.prototype.get = function (a) {
            return this[a] || this[this.map[a]]
        }, c.exifTagTypes = {
            1: {
                getValue: function (a, b) {
                    return a.getUint8(b)
                }, size: 1
            }, 2: {
                getValue: function (a, b) {
                    return String.fromCharCode(a.getUint8(b))
                }, size: 1, ascii: !0
            }, 3: {
                getValue: function (a, b, c) {
                    return a.getUint16(b, c)
                }, size: 2
            }, 4: {
                getValue: function (a, b, c) {
                    return a.getUint32(b, c)
                }, size: 4
            }, 5: {
                getValue: function (a, b, c) {
                    return a.getUint32(b, c) / a.getUint32(b + 4, c)
                }, size: 8
            }, 9: {
                getValue: function (a, b, c) {
                    return a.getInt32(b, c)
                }, size: 4
            }, 10: {
                getValue: function (a, b, c) {
                    return a.getInt32(b, c) / a.getInt32(b + 4, c)
                }, size: 8
            }
        }, c.exifTagTypes[7] = c.exifTagTypes[1], c.getExifValue = function (b, d, e, f, g, h) {
            var i, j, k, l, m, n, o = c.exifTagTypes[f];
            if (!o)return void a.log("Invalid Exif data: Invalid tag type.");
            if (i = o.size * g, j = i > 4 ? d + b.getUint32(e + 8, h) : e + 8, j + i > b.byteLength)return void a.log("Invalid Exif data: Invalid data offset.");
            if (1 === g)return o.getValue(b, j, h);
            for (k = [], l = 0; g > l; l += 1)k[l] = o.getValue(b, j + l * o.size, h);
            if (o.ascii) {
                for (m = "", l = 0; l < k.length && (n = k[l], "\x00" !== n); l += 1)m += n;
                return m
            }
            return k
        }, c.parseExifTag = function (a, b, d, e, f) {
            var g = a.getUint16(d, e);
            f.exif[g] = c.getExifValue(a, b, d, a.getUint16(d + 2, e), a.getUint32(d + 4, e), e)
        }, c.parseExifTags = function (b, c, d, e, f) {
            var g, h, i;
            if (d + 6 > b.byteLength)return void a.log("Invalid Exif data: Invalid directory offset.");
            if (g = b.getUint16(d, e), h = d + 2 + 12 * g, h + 4 > b.byteLength)return void a.log("Invalid Exif data: Invalid directory size.");
            for (i = 0; g > i; i += 1)this.parseExifTag(b, c, d + 2 + 12 * i, e, f);
            return b.getUint32(h, e)
        }, c.parseExifData = function (b, d, e, f) {
            var g, h, i = d + 10;
            if (1165519206 === b.getUint32(d + 4)) {
                if (i + 8 > b.byteLength)return void a.log("Invalid Exif data: Invalid segment size.");
                if (0 !== b.getUint16(d + 8))return void a.log("Invalid Exif data: Missing byte alignment offset.");
                switch (b.getUint16(i)) {
                    case 18761:
                        g = !0;
                        break;
                    case 19789:
                        g = !1;
                        break;
                    default:
                        return void a.log("Invalid Exif data: Invalid byte alignment marker.")
                }
                if (42 !== b.getUint16(i + 2, g))return void a.log("Invalid Exif data: Missing TIFF marker.");
                h = b.getUint32(i + 4, g), f.exif = new c.ExifMap, h = c.parseExifTags(b, i, i + h, g, f)
            }
        }, b.parsers[65505].push(c.parseExifData), c
    }), b("runtime/html5/jpegencoder", [], function () {
        function a(a) {
            function b(a) {
                for (var b = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99], c = 0; 64 > c; c++) {
                    var d = y((b[c] * a + 50) / 100);
                    1 > d ? d = 1 : d > 255 && (d = 255), z[P[c]] = d
                }
                for (var e = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99], f = 0; 64 > f; f++) {
                    var g = y((e[f] * a + 50) / 100);
                    1 > g ? g = 1 : g > 255 && (g = 255), A[P[f]] = g
                }
                for (var h = [1, 1.387039845, 1.306562965, 1.175875602, 1, .785694958, .5411961, .275899379], i = 0, j = 0; 8 > j; j++)for (var k = 0; 8 > k; k++)B[i] = 1 / (z[P[i]] * h[j] * h[k] * 8), C[i] = 1 / (A[P[i]] * h[j] * h[k] * 8), i++
            }

            function c(a, b) {
                for (var c = 0, d = 0, e = new Array, f = 1; 16 >= f; f++) {
                    for (var g = 1; g <= a[f]; g++)e[b[d]] = [], e[b[d]][0] = c, e[b[d]][1] = f, d++, c++;
                    c *= 2
                }
                return e
            }

            function d() {
                t = c(Q, R), u = c(U, V), v = c(S, T), w = c(W, X)
            }

            function e() {
                for (var a = 1, b = 2, c = 1; 15 >= c; c++) {
                    for (var d = a; b > d; d++)E[32767 + d] = c, D[32767 + d] = [], D[32767 + d][1] = c, D[32767 + d][0] = d;
                    for (var e = -(b - 1); -a >= e; e++)E[32767 + e] = c, D[32767 + e] = [], D[32767 + e][1] = c, D[32767 + e][0] = b - 1 + e;
                    a <<= 1, b <<= 1
                }
            }

            function f() {
                for (var a = 0; 256 > a; a++)O[a] = 19595 * a, O[a + 256 >> 0] = 38470 * a, O[a + 512 >> 0] = 7471 * a + 32768, O[a + 768 >> 0] = -11059 * a, O[a + 1024 >> 0] = -21709 * a, O[a + 1280 >> 0] = 32768 * a + 8421375, O[a + 1536 >> 0] = -27439 * a, O[a + 1792 >> 0] = -5329 * a
            }

            function g(a) {
                for (var b = a[0], c = a[1] - 1; c >= 0;)b & 1 << c && (I |= 1 << J), c--, J--, 0 > J && (255 == I ? (h(255), h(0)) : h(I), J = 7, I = 0)
            }

            function h(a) {
                H.push(N[a])
            }

            function i(a) {
                h(a >> 8 & 255), h(255 & a)
            }

            function j(a, b) {
                var c, d, e, f, g, h, i, j, k, l = 0, m = 8, n = 64;
                for (k = 0; m > k; ++k) {
                    c = a[l], d = a[l + 1], e = a[l + 2], f = a[l + 3], g = a[l + 4], h = a[l + 5], i = a[l + 6], j = a[l + 7];
                    var o = c + j, p = c - j, q = d + i, r = d - i, s = e + h, t = e - h, u = f + g, v = f - g, w = o + u, x = o - u, y = q + s, z = q - s;
                    a[l] = w + y, a[l + 4] = w - y;
                    var A = .707106781 * (z + x);
                    a[l + 2] = x + A, a[l + 6] = x - A, w = v + t, y = t + r, z = r + p;
                    var B = .382683433 * (w - z), C = .5411961 * w + B, D = 1.306562965 * z + B, E = .707106781 * y, G = p + E, H = p - E;
                    a[l + 5] = H + C, a[l + 3] = H - C, a[l + 1] = G + D, a[l + 7] = G - D, l += 8
                }
                for (l = 0, k = 0; m > k; ++k) {
                    c = a[l], d = a[l + 8], e = a[l + 16], f = a[l + 24], g = a[l + 32], h = a[l + 40], i = a[l + 48], j = a[l + 56];
                    var I = c + j, J = c - j, K = d + i, L = d - i, M = e + h, N = e - h, O = f + g, P = f - g, Q = I + O, R = I - O, S = K + M, T = K - M;
                    a[l] = Q + S, a[l + 32] = Q - S;
                    var U = .707106781 * (T + R);
                    a[l + 16] = R + U, a[l + 48] = R - U, Q = P + N, S = N + L, T = L + J;
                    var V = .382683433 * (Q - T), W = .5411961 * Q + V, X = 1.306562965 * T + V, Y = .707106781 * S, Z = J + Y, $ = J - Y;
                    a[l + 40] = $ + W, a[l + 24] = $ - W, a[l + 8] = Z + X, a[l + 56] = Z - X, l++
                }
                var _;
                for (k = 0; n > k; ++k)_ = a[k] * b[k], F[k] = _ > 0 ? _ + .5 | 0 : _ - .5 | 0;
                return F
            }

            function k() {
                i(65504), i(16), h(74), h(70), h(73), h(70), h(0), h(1), h(1), h(0), i(1), i(1), h(0), h(0)
            }

            function l(a, b) {
                i(65472), i(17), h(8), i(b), i(a), h(3), h(1), h(17), h(0), h(2), h(17), h(1), h(3), h(17), h(1)
            }

            function m() {
                i(65499), i(132), h(0);
                for (var a = 0; 64 > a; a++)h(z[a]);
                h(1);
                for (var b = 0; 64 > b; b++)h(A[b])
            }

            function n() {
                i(65476), i(418), h(0);
                for (var a = 0; 16 > a; a++)h(Q[a + 1]);
                for (var b = 0; 11 >= b; b++)h(R[b]);
                h(16);
                for (var c = 0; 16 > c; c++)h(S[c + 1]);
                for (var d = 0; 161 >= d; d++)h(T[d]);
                h(1);
                for (var e = 0; 16 > e; e++)h(U[e + 1]);
                for (var f = 0; 11 >= f; f++)h(V[f]);
                h(17);
                for (var g = 0; 16 > g; g++)h(W[g + 1]);
                for (var j = 0; 161 >= j; j++)h(X[j])
            }

            function o() {
                i(65498), i(12), h(3), h(1), h(0), h(2), h(17), h(3), h(17), h(0), h(63), h(0)
            }

            function p(a, b, c, d, e) {
                for (var f, h = e[0], i = e[240], k = 16, l = 63, m = 64, n = j(a, b), o = 0; m > o; ++o)G[P[o]] = n[o];
                var p = G[0] - c;
                c = G[0], 0 == p ? g(d[0]) : (f = 32767 + p, g(d[E[f]]), g(D[f]));
                for (var q = 63; q > 0 && 0 == G[q]; q--);
                if (0 == q)return g(h), c;
                for (var r, s = 1; q >= s;) {
                    for (var t = s; 0 == G[s] && q >= s; ++s);
                    var u = s - t;
                    if (u >= k) {
                        r = u >> 4;
                        for (var v = 1; r >= v; ++v)g(i);
                        u = 15 & u
                    }
                    f = 32767 + G[s], g(e[(u << 4) + E[f]]), g(D[f]), s++
                }
                return q != l && g(h), c
            }

            function q() {
                for (var a = String.fromCharCode, b = 0; 256 > b; b++)N[b] = a(b)
            }

            function r(a) {
                if (0 >= a && (a = 1), a > 100 && (a = 100), x != a) {
                    var c = 0;
                    c = Math.floor(50 > a ? 5e3 / a : 200 - 2 * a), b(c), x = a
                }
            }

            function s() {
                a || (a = 50), q(), d(), e(), f(), r(a)
            }

            var t, u, v, w, x, y = (Math.round, Math.floor), z = new Array(64), A = new Array(64), B = new Array(64), C = new Array(64), D = new Array(65535), E = new Array(65535), F = new Array(64), G = new Array(64), H = [], I = 0, J = 7, K = new Array(64), L = new Array(64), M = new Array(64), N = new Array(256), O = new Array(2048), P = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63], Q = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], R = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], S = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125], T = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250], U = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], V = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], W = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119], X = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
            this.encode = function (a, b) {
                b && r(b), H = new Array, I = 0, J = 7, i(65496), k(), m(), l(a.width, a.height), n(), o();
                var c = 0, d = 0, e = 0;
                I = 0, J = 7, this.encode.displayName = "_encode_";
                for (var f, h, j, q, s, x, y, z, A, D = a.data, E = a.width, F = a.height, G = 4 * E, N = 0; F > N;) {
                    for (f = 0; G > f;) {
                        for (s = G * N + f, x = s, y = -1, z = 0, A = 0; 64 > A; A++)z = A >> 3, y = 4 * (7 & A), x = s + z * G + y, N + z >= F && (x -= G * (N + 1 + z - F)), f + y >= G && (x -= f + y - G + 4), h = D[x++], j = D[x++], q = D[x++], K[A] = (O[h] + O[j + 256 >> 0] + O[q + 512 >> 0] >> 16) - 128, L[A] = (O[h + 768 >> 0] + O[j + 1024 >> 0] + O[q + 1280 >> 0] >> 16) - 128, M[A] = (O[h + 1280 >> 0] + O[j + 1536 >> 0] + O[q + 1792 >> 0] >> 16) - 128;
                        c = p(K, B, c, t, v), d = p(L, C, d, u, w), e = p(M, C, e, u, w), f += 32
                    }
                    N += 8
                }
                if (J >= 0) {
                    var P = [];
                    P[1] = J + 1, P[0] = (1 << J + 1) - 1, g(P)
                }
                i(65497);
                var Q = "data:image/jpeg;base64," + btoa(H.join(""));
                return H = [], Q
            }, s()
        }

        return a.encode = function (b, c) {
            var d = new a(c);
            return d.encode(b)
        }, a
    }), b("runtime/html5/androidpatch", ["runtime/html5/util", "runtime/html5/jpegencoder", "base"], function (a, b, c) {
        var d, e = a.canvasToDataUrl;
        a.canvasToDataUrl = function (a, f, g) {
            var h, i, j, k, l;
            return c.os.android ? ("image/jpeg" === f && "undefined" == typeof d && (k = e.apply(null, arguments), l = k.split(","), k = ~l[0].indexOf("base64") ? atob(l[1]) : decodeURIComponent(l[1]), k = k.substring(0, 2), d = 255 === k.charCodeAt(0) && 216 === k.charCodeAt(1)), "image/jpeg" !== f || d ? e.apply(null, arguments) : (i = a.width, j = a.height, h = a.getContext("2d"), b.encode(h.getImageData(0, 0, i, j), g))) : e.apply(null, arguments)
        }
    }), b("runtime/html5/image", ["base", "runtime/html5/runtime", "runtime/html5/util"], function (a, b, c) {
        var d = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
        return b.register("Image", {
            modified: !1, init: function () {
                var a = this, b = new Image;
                b.onload = function () {
                    a._info = {
                        type: a.type,
                        width: this.width,
                        height: this.height
                    }, a._metas || "image/jpeg" !== a.type ? a.owner.trigger("load") : c.parseMeta(a._blob, function (b, c) {
                        a._metas = c, a.owner.trigger("load")
                    })
                }, b.onerror = function () {
                    a.owner.trigger("error")
                }, a._img = b
            }, loadFromBlob: function (a) {
                var b = this, d = b._img;
                b._blob = a, b.type = a.type, d.src = c.createObjectURL(a.getSource()), b.owner.once("load", function () {
                    c.revokeObjectURL(d.src)
                })
            }, resize: function (a, b) {
                var c = this._canvas || (this._canvas = document.createElement("canvas"));
                this._resize(this._img, c, a, b), this._blob = null, this.modified = !0, this.owner.trigger("complete", "resize")
            }, crop: function (a, b, c, d, e) {
                var f = this._canvas || (this._canvas = document.createElement("canvas")), g = this.options, h = this._img, i = h.naturalWidth, j = h.naturalHeight, k = this.getOrientation();
                e = e || 1, f.width = c, f.height = d, g.preserveHeaders || this._rotate2Orientaion(f, k), this._renderImageToCanvas(f, h, -a, -b, i * e, j * e), this._blob = null, this.modified = !0, this.owner.trigger("complete", "crop")
            }, getAsBlob: function (a) {
                var b, d = this._blob, e = this.options;
                if (a = a || this.type, this.modified || this.type !== a) {
                    if (b = this._canvas, "image/jpeg" === a) {
                        if (d = c.canvasToDataUrl(b, a, e.quality), e.preserveHeaders && this._metas && this._metas.imageHead)return d = c.dataURL2ArrayBuffer(d), d = c.updateImageHead(d, this._metas.imageHead), d = c.arrayBufferToBlob(d, a)
                    } else d = c.canvasToDataUrl(b, a);
                    d = c.dataURL2Blob(d)
                }
                return d
            }, getAsDataUrl: function (a) {
                var b = this.options;
                return a = a || this.type, "image/jpeg" === a ? c.canvasToDataUrl(this._canvas, a, b.quality) : this._canvas.toDataURL(a)
            }, getOrientation: function () {
                return this._metas && this._metas.exif && this._metas.exif.get("Orientation") || 1
            }, info: function (a) {
                return a ? (this._info = a, this) : this._info
            }, meta: function (a) {
                return a ? (this._meta = a, this) : this._meta
            }, destroy: function () {
                var a = this._canvas;
                this._img.onload = null, a && (a.getContext("2d").clearRect(0, 0, a.width, a.height), a.width = a.height = 0, this._canvas = null), this._img.src = d, this._img = this._blob = null
            }, _resize: function (a, b, c, d) {
                var e, f, g, h, i, j = this.options, k = a.width, l = a.height, m = this.getOrientation();
                ~[5, 6, 7, 8].indexOf(m) && (c ^= d, d ^= c, c ^= d), e = Math[j.crop ? "max" : "min"](c / k, d / l), j.allowMagnify || (e = Math.min(1, e)), f = k * e, g = l * e, j.crop ? (b.width = c, b.height = d) : (b.width = f, b.height = g), h = (b.width - f) / 2, i = (b.height - g) / 2, j.preserveHeaders || this._rotate2Orientaion(b, m), this._renderImageToCanvas(b, a, h, i, f, g)
            }, _rotate2Orientaion: function (a, b) {
                var c = a.width, d = a.height, e = a.getContext("2d");
                switch (b) {
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        a.width = d, a.height = c
                }
                switch (b) {
                    case 2:
                        e.translate(c, 0), e.scale(-1, 1);
                        break;
                    case 3:
                        e.translate(c, d), e.rotate(Math.PI);
                        break;
                    case 4:
                        e.translate(0, d), e.scale(1, -1);
                        break;
                    case 5:
                        e.rotate(.5 * Math.PI), e.scale(1, -1);
                        break;
                    case 6:
                        e.rotate(.5 * Math.PI), e.translate(0, -d);
                        break;
                    case 7:
                        e.rotate(.5 * Math.PI), e.translate(c, -d), e.scale(-1, 1);
                        break;
                    case 8:
                        e.rotate(-.5 * Math.PI), e.translate(-c, 0)
                }
            }, _renderImageToCanvas: function () {
                function b(a, b, c) {
                    var d, e, f, g = document.createElement("canvas"), h = g.getContext("2d"), i = 0, j = c, k = c;
                    for (g.width = 1, g.height = c, h.drawImage(a, 0, 0), d = h.getImageData(0, 0, 1, c).data; k > i;)e = d[4 * (k - 1) + 3], 0 === e ? j = k : i = k, k = j + i >> 1;
                    return f = k / c, 0 === f ? 1 : f
                }

                function c(a) {
                    var b, c, d = a.naturalWidth, e = a.naturalHeight;
                    return d * e > 1048576 ? (b = document.createElement("canvas"), b.width = b.height = 1, c = b.getContext("2d"), c.drawImage(a, -d + 1, 0), 0 === c.getImageData(0, 0, 1, 1).data[3]) : !1
                }

                return a.os.ios ? a.os.ios >= 7 ? function (a, c, d, e, f, g) {
                    var h = c.naturalWidth, i = c.naturalHeight, j = b(c, h, i);
                    return a.getContext("2d").drawImage(c, 0, 0, h * j, i * j, d, e, f, g)
                } : function (a, d, e, f, g, h) {
                    var i, j, k, l, m, n, o, p = d.naturalWidth, q = d.naturalHeight, r = a.getContext("2d"), s = c(d), t = "image/jpeg" === this.type, u = 1024, v = 0, w = 0;
                    for (s && (p /= 2, q /= 2), r.save(), i = document.createElement("canvas"), i.width = i.height = u, j = i.getContext("2d"), k = t ? b(d, p, q) : 1, l = Math.ceil(u * g / p), m = Math.ceil(u * h / q / k); q > v;) {
                        for (n = 0, o = 0; p > n;)j.clearRect(0, 0, u, u), j.drawImage(d, -n, -v), r.drawImage(i, 0, 0, u, u, e + o, f + w, l, m), n += u, o += l;
                        v += u, w += m
                    }
                    r.restore(), i = j = null
                } : function (b) {
                    var c = a.slice(arguments, 1), d = b.getContext("2d");
                    d.drawImage.apply(d, c)
                }
            }()
        })
    }), b("runtime/html5/transport", ["base", "runtime/html5/runtime"], function (a, b) {
        var c = a.noop, d = a.$;
        return b.register("Transport", {
            init: function () {
                this._status = 0, this._response = null
            }, send: function () {
                var b, c, e, f = this.owner, g = this.options, h = this._initAjax(), i = f._blob, j = g.server;
                g.sendAsBinary ? (j += (/\?/.test(j) ? "&" : "?") + d.param(f._formData), c = i.getSource()) : (b = new FormData, d.each(f._formData, function (a, c) {
                    b.append(a, c)
                }), b.append(g.fileVal, i.getSource(), g.filename || f._formData.name || "")), g.withCredentials && "withCredentials"in h ? (h.open(g.method, j, !0), h.withCredentials = !0) : h.open(g.method, j), this._setRequestHeader(h, g.headers), c ? (h.overrideMimeType && h.overrideMimeType("application/octet-stream"), a.os.android ? (e = new FileReader, e.onload = function () {
                    h.send(this.result), e = e.onload = null
                }, e.readAsArrayBuffer(c)) : h.send(c)) : h.send(b)
            }, getResponse: function () {
                return this._response
            }, getResponseAsJson: function () {
                return this._parseJson(this._response)
            }, getStatus: function () {
                return this._status
            }, abort: function () {
                var a = this._xhr;
                a && (a.upload.onprogress = c, a.onreadystatechange = c, a.abort(), this._xhr = a = null)
            }, destroy: function () {
                this.abort()
            }, _initAjax: function () {
                var a = this, b = new XMLHttpRequest, d = this.options;
                return !d.withCredentials || "withCredentials"in b || "undefined" == typeof XDomainRequest || (b = new XDomainRequest), b.upload.onprogress = function (b) {
                    var c = 0;
                    return b.lengthComputable && (c = b.loaded / b.total), a.trigger("progress", c)
                }, b.onreadystatechange = function () {
                    return 4 === b.readyState ? (b.upload.onprogress = c, b.onreadystatechange = c, a._xhr = null, a._status = b.status, b.status >= 200 && b.status < 300 ? (a._response = b.responseText, a.trigger("load")) : b.status >= 500 && b.status < 600 ? (a._response = b.responseText, a.trigger("error", "server")) : a.trigger("error", a._status ? "http" : "abort")) : void 0
                }, a._xhr = b, b
            }, _setRequestHeader: function (a, b) {
                d.each(b, function (b, c) {
                    a.setRequestHeader(b, c)
                })
            }, _parseJson: function (a) {
                var b;
                try {
                    b = JSON.parse(a)
                } catch (c) {
                    b = {}
                }
                return b
            }
        })
    }), b("runtime/html5/md5", ["runtime/html5/runtime"], function (a) {
        var b = function (a, b) {
            return a + b & 4294967295
        }, c = function (a, c, d, e, f, g) {
            return c = b(b(c, a), b(e, g)), b(c << f | c >>> 32 - f, d)
        }, d = function (a, b, d, e, f, g, h) {
            return c(b & d | ~b & e, a, b, f, g, h)
        }, e = function (a, b, d, e, f, g, h) {
            return c(b & e | d & ~e, a, b, f, g, h)
        }, f = function (a, b, d, e, f, g, h) {
            return c(b ^ d ^ e, a, b, f, g, h)
        }, g = function (a, b, d, e, f, g, h) {
            return c(d ^ (b | ~e), a, b, f, g, h)
        }, h = function (a, c) {
            var h = a[0], i = a[1], j = a[2], k = a[3];
            h = d(h, i, j, k, c[0], 7, -680876936), k = d(k, h, i, j, c[1], 12, -389564586), j = d(j, k, h, i, c[2], 17, 606105819), i = d(i, j, k, h, c[3], 22, -1044525330), h = d(h, i, j, k, c[4], 7, -176418897), k = d(k, h, i, j, c[5], 12, 1200080426), j = d(j, k, h, i, c[6], 17, -1473231341), i = d(i, j, k, h, c[7], 22, -45705983), h = d(h, i, j, k, c[8], 7, 1770035416), k = d(k, h, i, j, c[9], 12, -1958414417), j = d(j, k, h, i, c[10], 17, -42063), i = d(i, j, k, h, c[11], 22, -1990404162), h = d(h, i, j, k, c[12], 7, 1804603682), k = d(k, h, i, j, c[13], 12, -40341101), j = d(j, k, h, i, c[14], 17, -1502002290), i = d(i, j, k, h, c[15], 22, 1236535329), h = e(h, i, j, k, c[1], 5, -165796510), k = e(k, h, i, j, c[6], 9, -1069501632), j = e(j, k, h, i, c[11], 14, 643717713), i = e(i, j, k, h, c[0], 20, -373897302), h = e(h, i, j, k, c[5], 5, -701558691), k = e(k, h, i, j, c[10], 9, 38016083), j = e(j, k, h, i, c[15], 14, -660478335), i = e(i, j, k, h, c[4], 20, -405537848), h = e(h, i, j, k, c[9], 5, 568446438), k = e(k, h, i, j, c[14], 9, -1019803690), j = e(j, k, h, i, c[3], 14, -187363961), i = e(i, j, k, h, c[8], 20, 1163531501), h = e(h, i, j, k, c[13], 5, -1444681467), k = e(k, h, i, j, c[2], 9, -51403784), j = e(j, k, h, i, c[7], 14, 1735328473), i = e(i, j, k, h, c[12], 20, -1926607734), h = f(h, i, j, k, c[5], 4, -378558), k = f(k, h, i, j, c[8], 11, -2022574463), j = f(j, k, h, i, c[11], 16, 1839030562), i = f(i, j, k, h, c[14], 23, -35309556), h = f(h, i, j, k, c[1], 4, -1530992060), k = f(k, h, i, j, c[4], 11, 1272893353), j = f(j, k, h, i, c[7], 16, -155497632), i = f(i, j, k, h, c[10], 23, -1094730640), h = f(h, i, j, k, c[13], 4, 681279174), k = f(k, h, i, j, c[0], 11, -358537222), j = f(j, k, h, i, c[3], 16, -722521979), i = f(i, j, k, h, c[6], 23, 76029189), h = f(h, i, j, k, c[9], 4, -640364487), k = f(k, h, i, j, c[12], 11, -421815835), j = f(j, k, h, i, c[15], 16, 530742520), i = f(i, j, k, h, c[2], 23, -995338651), h = g(h, i, j, k, c[0], 6, -198630844), k = g(k, h, i, j, c[7], 10, 1126891415), j = g(j, k, h, i, c[14], 15, -1416354905), i = g(i, j, k, h, c[5], 21, -57434055), h = g(h, i, j, k, c[12], 6, 1700485571), k = g(k, h, i, j, c[3], 10, -1894986606), j = g(j, k, h, i, c[10], 15, -1051523), i = g(i, j, k, h, c[1], 21, -2054922799), h = g(h, i, j, k, c[8], 6, 1873313359), k = g(k, h, i, j, c[15], 10, -30611744), j = g(j, k, h, i, c[6], 15, -1560198380), i = g(i, j, k, h, c[13], 21, 1309151649), h = g(h, i, j, k, c[4], 6, -145523070), k = g(k, h, i, j, c[11], 10, -1120210379), j = g(j, k, h, i, c[2], 15, 718787259), i = g(i, j, k, h, c[9], 21, -343485551), a[0] = b(h, a[0]), a[1] = b(i, a[1]), a[2] = b(j, a[2]), a[3] = b(k, a[3])
        }, i = function (a) {
            var b, c = [];
            for (b = 0; 64 > b; b += 4)c[b >> 2] = a.charCodeAt(b) + (a.charCodeAt(b + 1) << 8) + (a.charCodeAt(b + 2) << 16) + (a.charCodeAt(b + 3) << 24);
            return c
        }, j = function (a) {
            var b, c = [];
            for (b = 0; 64 > b; b += 4)c[b >> 2] = a[b] + (a[b + 1] << 8) + (a[b + 2] << 16) + (a[b + 3] << 24);
            return c
        }, k = function (a) {
            var b, c, d, e, f, g, j = a.length, k = [1732584193, -271733879, -1732584194, 271733878];
            for (b = 64; j >= b; b += 64)h(k, i(a.substring(b - 64, b)));
            for (a = a.substring(b - 64), c = a.length, d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], b = 0; c > b; b += 1)d[b >> 2] |= a.charCodeAt(b) << (b % 4 << 3);
            if (d[b >> 2] |= 128 << (b % 4 << 3), b > 55)for (h(k, d), b = 0; 16 > b; b += 1)d[b] = 0;
            return e = 8 * j, e = e.toString(16).match(/(.*?)(.{0,8})$/), f = parseInt(e[2], 16), g = parseInt(e[1], 16) || 0, d[14] = f, d[15] = g, h(k, d), k
        }, l = function (a) {
            var b, c, d, e, f, g, i = a.length, k = [1732584193, -271733879, -1732584194, 271733878];
            for (b = 64; i >= b; b += 64)h(k, j(a.subarray(b - 64, b)));
            for (a = i > b - 64 ? a.subarray(b - 64) : new Uint8Array(0), c = a.length, d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], b = 0; c > b; b += 1)d[b >> 2] |= a[b] << (b % 4 << 3);
            if (d[b >> 2] |= 128 << (b % 4 << 3), b > 55)for (h(k, d), b = 0; 16 > b; b += 1)d[b] = 0;
            return e = 8 * i, e = e.toString(16).match(/(.*?)(.{0,8})$/), f = parseInt(e[2], 16), g = parseInt(e[1], 16) || 0, d[14] = f, d[15] = g, h(k, d), k
        }, m = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"], n = function (a) {
            var b, c = "";
            for (b = 0; 4 > b; b += 1)c += m[a >> 8 * b + 4 & 15] + m[a >> 8 * b & 15];
            return c
        }, o = function (a) {
            var b;
            for (b = 0; b < a.length; b += 1)a[b] = n(a[b]);
            return a.join("")
        }, p = function (a) {
            return o(k(a))
        }, q = function () {
            this.reset()
        };
        return "5d41402abc4b2a76b9719d911017c592" !== p("hello") && (b = function (a, b) {
            var c = (65535 & a) + (65535 & b), d = (a >> 16) + (b >> 16) + (c >> 16);
            return d << 16 | 65535 & c
        }), q.prototype.append = function (a) {
            return /[\u0080-\uFFFF]/.test(a) && (a = unescape(encodeURIComponent(a))), this.appendBinary(a), this
        }, q.prototype.appendBinary = function (a) {
            this._buff += a, this._length += a.length;
            var b, c = this._buff.length;
            for (b = 64; c >= b; b += 64)h(this._state, i(this._buff.substring(b - 64, b)));
            return this._buff = this._buff.substr(b - 64), this
        }, q.prototype.end = function (a) {
            var b, c, d = this._buff, e = d.length, f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (b = 0; e > b; b += 1)f[b >> 2] |= d.charCodeAt(b) << (b % 4 << 3);
            return this._finish(f, e), c = a ? this._state : o(this._state), this.reset(), c
        }, q.prototype._finish = function (a, b) {
            var c, d, e, f = b;
            if (a[f >> 2] |= 128 << (f % 4 << 3), f > 55)for (h(this._state, a), f = 0; 16 > f; f += 1)a[f] = 0;
            c = 8 * this._length, c = c.toString(16).match(/(.*?)(.{0,8})$/), d = parseInt(c[2], 16), e = parseInt(c[1], 16) || 0, a[14] = d, a[15] = e, h(this._state, a)
        }, q.prototype.reset = function () {
            return this._buff = "", this._length = 0, this._state = [1732584193, -271733879, -1732584194, 271733878], this
        }, q.prototype.destroy = function () {
            delete this._state, delete this._buff, delete this._length
        }, q.hash = function (a, b) {
            /[\u0080-\uFFFF]/.test(a) && (a = unescape(encodeURIComponent(a)));
            var c = k(a);
            return b ? c : o(c)
        }, q.hashBinary = function (a, b) {
            var c = k(a);
            return b ? c : o(c)
        }, q.ArrayBuffer = function () {
            this.reset()
        }, q.ArrayBuffer.prototype.append = function (a) {
            var b, c = this._concatArrayBuffer(this._buff, a), d = c.length;
            for (this._length += a.byteLength, b = 64; d >= b; b += 64)h(this._state, j(c.subarray(b - 64, b)));
            return this._buff = d > b - 64 ? c.subarray(b - 64) : new Uint8Array(0), this
        }, q.ArrayBuffer.prototype.end = function (a) {
            var b, c, d = this._buff, e = d.length, f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (b = 0; e > b; b += 1)f[b >> 2] |= d[b] << (b % 4 << 3);
            return this._finish(f, e), c = a ? this._state : o(this._state), this.reset(), c
        }, q.ArrayBuffer.prototype._finish = q.prototype._finish, q.ArrayBuffer.prototype.reset = function () {
            return this._buff = new Uint8Array(0), this._length = 0, this._state = [1732584193, -271733879, -1732584194, 271733878], this
        }, q.ArrayBuffer.prototype.destroy = q.prototype.destroy, q.ArrayBuffer.prototype._concatArrayBuffer = function (a, b) {
            var c = a.length, d = new Uint8Array(c + b.byteLength);
            return d.set(a), d.set(new Uint8Array(b), c), d
        }, q.ArrayBuffer.hash = function (a, b) {
            var c = l(new Uint8Array(a));
            return b ? c : o(c)
        }, a.register("Md5", {
            init: function () {
            }, loadFromBlob: function (a) {
                var b, c, d = a.getSource(), e = 2097152, f = Math.ceil(d.size / e), g = 0, h = this.owner, i = new q.ArrayBuffer, j = this, k = d.mozSlice || d.webkitSlice || d.slice;
                c = new FileReader, (b = function () {
                    var l, m;
                    l = g * e, m = Math.min(l + e, d.size), c.onload = function (b) {
                        i.append(b.target.result), h.trigger("progress", {total: a.size, loaded: m})
                    }, c.onloadend = function () {
                        c.onloadend = c.onload = null, ++g < f ? setTimeout(b, 1) : setTimeout(function () {
                            h.trigger("load"), j.result = i.end(), b = a = d = i = null, h.trigger("complete")
                        }, 50)
                    }, c.readAsArrayBuffer(k.call(d, l, m))
                })()
            }, getResult: function () {
                return this.result
            }
        })
    }), b("runtime/flash/runtime", ["base", "runtime/runtime", "runtime/compbase"], function (b, c, d) {
        function e() {
            var a;
            try {
                a = navigator.plugins["Shockwave Flash"], a = a.description
            } catch (b) {
                try {
                    a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")
                } catch (c) {
                    a = "0.0"
                }
            }
            return a = a.match(/\d+/g), parseFloat(a[0] + "." + a[1], 10)
        }

        function f() {
            function d(a, b) {
                var c, d, e = a.type || a;
                c = e.split("::"), d = c[0], e = c[1], "Ready" === e && d === j.uid ? j.trigger("ready") : f[d] && f[d].trigger(e.toLowerCase(), a, b)
            }

            var e = {}, f = {}, g = this.destroy, j = this, k = b.guid("webuploader_");
            c.apply(j, arguments), j.type = h, j.exec = function (a, c) {
                var d, g = this, h = g.uid, k = b.slice(arguments, 2);
                return f[h] = g, i[a] && (e[h] || (e[h] = new i[a](g, j)), d = e[h], d[c]) ? d[c].apply(d, k) : j.flashExec.apply(g, arguments)
            }, a[k] = function () {
                var a = arguments;
                setTimeout(function () {
                    d.apply(null, a)
                }, 1)
            }, this.jsreciver = k, this.destroy = function () {
                return g && g.apply(this, arguments)
            }, this.flashExec = function (a, c) {
                var d = j.getFlash(), e = b.slice(arguments, 2);
                return d.exec(this.uid, a, c, e)
            }
        }

        var g = b.$, h = "flash", i = {};
        return b.inherits(c, {
            constructor: f, init: function () {
                var a, c = this.getContainer(), d = this.options;
                c.css({
                    position: "absolute",
                    top: "-8px",
                    left: "-8px",
                    width: "9px",
                    height: "9px",
                    overflow: "hidden"
                }), a = '<object id="' + this.uid + '" type="application/x-shockwave-flash" data="' + d.swf + '" ', b.browser.ie && (a += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '), a += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + d.swf + '" /><param name="flashvars" value="uid=' + this.uid + "&jsreciver=" + this.jsreciver + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>', c.html(a)
            }, getFlash: function () {
                return this._flash ? this._flash : (this._flash = g("#" + this.uid).get(0), this._flash)
            }
        }), f.register = function (a, c) {
            return c = i[a] = b.inherits(d, g.extend({
                flashExec: function () {
                    var a = this.owner, b = this.getRuntime();
                    return b.flashExec.apply(a, arguments)
                }
            }, c))
        }, e() >= 11.4 && c.addRuntime(h, f), f
    }), b("runtime/flash/filepicker", ["base", "runtime/flash/runtime"], function (a, b) {
        var c = a.$;
        return b.register("FilePicker", {
            init: function (a) {
                var b, d, e = c.extend({}, a);
                for (b = e.accept && e.accept.length, d = 0; b > d; d++)e.accept[d].title || (e.accept[d].title = "Files");
                delete e.button, delete e.id, delete e.container, this.flashExec("FilePicker", "init", e)
            }, destroy: function () {
                this.flashExec("FilePicker", "destroy")
            }
        })
    }), b("runtime/flash/image", ["runtime/flash/runtime"], function (a) {
        return a.register("Image", {
            loadFromBlob: function (a) {
                var b = this.owner;
                b.info() && this.flashExec("Image", "info", b.info()), b.meta() && this.flashExec("Image", "meta", b.meta()), this.flashExec("Image", "loadFromBlob", a.uid)
            }
        })
    }), b("runtime/flash/transport", ["base", "runtime/flash/runtime", "runtime/client"], function (b, c, d) {
        var e = b.$;
        return c.register("Transport", {
            init: function () {
                this._status = 0, this._response = null, this._responseJson = null
            }, send: function () {
                var a, b = this.owner, c = this.options, d = this._initAjax(), f = b._blob, g = c.server;
                d.connectRuntime(f.ruid), c.sendAsBinary ? (g += (/\?/.test(g) ? "&" : "?") + e.param(b._formData), a = f.uid) : (e.each(b._formData, function (a, b) {
                    d.exec("append", a, b)
                }), d.exec("appendBlob", c.fileVal, f.uid, c.filename || b._formData.name || "")), this._setRequestHeader(d, c.headers), d.exec("send", {
                    method: c.method,
                    url: g,
                    forceURLStream: c.forceURLStream,
                    mimeType: "application/octet-stream"
                }, a)
            }, getStatus: function () {
                return this._status
            }, getResponse: function () {
                return this._response || ""
            }, getResponseAsJson: function () {
                return this._responseJson
            }, abort: function () {
                var a = this._xhr;
                a && (a.exec("abort"), a.destroy(), this._xhr = a = null)
            }, destroy: function () {
                this.abort()
            }, _initAjax: function () {
                var b = this, c = new d("XMLHttpRequest");
                return c.on("uploadprogress progress", function (a) {
                    var c = a.loaded / a.total;
                    return c = Math.min(1, Math.max(0, c)), b.trigger("progress", c)
                }), c.on("load", function () {
                    var d, e = c.exec("getStatus"), f = !1, g = "";
                    return c.off(), b._xhr = null, e >= 200 && 300 > e ? f = !0 : e >= 500 && 600 > e ? (f = !0, g = "server") : g = "http", f && (b._response = c.exec("getResponse"), b._response = decodeURIComponent(b._response), d = a.JSON && a.JSON.parse || function (a) {
                        try {
                            return new Function("return " + a).call()
                        } catch (b) {
                            return {}
                        }
                    }, b._responseJson = b._response ? d(b._response) : {}), c.destroy(), c = null, g ? b.trigger("error", g) : b.trigger("load")
                }), c.on("error", function () {
                    c.off(), b._xhr = null, b.trigger("error", "http")
                }), b._xhr = c, c
            }, _setRequestHeader: function (a, b) {
                e.each(b, function (b, c) {
                    a.exec("setRequestHeader", b, c)
                })
            }
        })
    }), b("runtime/flash/blob", ["runtime/flash/runtime", "lib/blob"], function (a, b) {
        return a.register("Blob", {
            slice: function (a, c) {
                var d = this.flashExec("Blob", "slice", a, c);
                return new b(d.uid, d)
            }
        })
    }), b("runtime/flash/md5", ["runtime/flash/runtime"], function (a) {
        return a.register("Md5", {
            init: function () {
            }, loadFromBlob: function (a) {
                return this.flashExec("Md5", "loadFromBlob", a.uid)
            }
        })
    }), b("preset/all", ["base", "widgets/filednd", "widgets/filepaste", "widgets/filepicker", "widgets/image", "widgets/queue", "widgets/runtime", "widgets/upload", "widgets/validator", "widgets/md5", "runtime/html5/blob", "runtime/html5/dnd", "runtime/html5/filepaste", "runtime/html5/filepicker", "runtime/html5/imagemeta/exif", "runtime/html5/androidpatch", "runtime/html5/image", "runtime/html5/transport", "runtime/html5/md5", "runtime/flash/filepicker", "runtime/flash/image", "runtime/flash/transport", "runtime/flash/blob", "runtime/flash/md5"], function (a) {
        return a
    }), b("widgets/log", ["base", "uploader", "widgets/widget"], function (a, b) {
        function c(a) {
            var b = e.extend({}, d, a), c = f.replace(/^(.*)\?/, "$1" + e.param(b)), g = new Image;
            g.src = c
        }

        var d, e = a.$, f = " http://static.tieba.baidu.com/tb/pms/img/st.gif??", g = (location.hostname || location.host || "protected").toLowerCase(), h = g && /baidu/i.exec(g);
        if (h)return d = {
            dv: 3,
            master: "webuploader",
            online: /test/.exec(g) ? 0 : 1,
            module: "",
            product: g,
            type: 0
        }, b.register({
            name: "log", init: function () {
                var a = this.owner, b = 0, d = 0;
                a.on("error", function (a) {
                    c({type: 2, c_error_code: a})
                }).on("uploadError", function (a, b) {
                    c({type: 2, c_error_code: "UPLOAD_ERROR", c_reason: "" + b})
                }).on("uploadComplete", function (a) {
                    b++, d += a.size
                }).on("uploadFinished", function () {
                    c({c_count: b, c_size: d}), b = d = 0
                }), c({c_usage: 1})
            }
        })
    }), b("webuploader", ["preset/all", "widgets/log"], function (a) {
        return a
    }), c("webuploader")
});

/*!
 * Viewer v0.5.1
 * https://github.com/fengyuanchen/viewer
 *
 * Copyright (c) 2015-2016 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2016-03-11T07:57:59.486Z
 */
!function(i){"function"==typeof define&&define.amd?define("viewer",["jquery"],i):i("object"==typeof exports?require("jquery"):jQuery)}(function(i){"use strict";function t(i){return"string"==typeof i}function e(i){return"number"==typeof i&&!isNaN(i)}function s(i){return"undefined"==typeof i}function n(i,t){var s=[];return e(t)&&s.push(t),s.slice.apply(i,s)}function o(i,t){var e=n(arguments,2);return function(){return i.apply(t,e.concat(n(arguments)))}}function a(i){var t=[],s=i.rotate,n=i.scaleX,o=i.scaleY;return e(s)&&t.push("rotate("+s+"deg)"),e(n)&&e(o)&&t.push("scale("+n+","+o+")"),t.length?t.join(" "):"none"}function h(i){return i.offsetWidth}function r(i){return t(i)?i.replace(/^.*\//,"").replace(/[\?&#].*$/,""):""}function l(i,t){var e;return i.naturalWidth?t(i.naturalWidth,i.naturalHeight):(e=document.createElement("img"),e.onload=function(){t(this.width,this.height)},void(e.src=i.src))}function d(t){var e=t.length,s=0,n=0;return e&&(i.each(t,function(i,t){s+=t.pageX,n+=t.pageY}),s/=e,n/=e),{pageX:s,pageY:n}}function c(i){switch(i){case 2:return x;case 3:return $;case 4:return C}}function u(t,e){this.$element=i(t),this.options=i.extend({},u.DEFAULTS,i.isPlainObject(e)&&e),this.isImg=!1,this.isBuilt=!1,this.isShown=!1,this.isViewed=!1,this.isFulled=!1,this.isPlayed=!1,this.wheeling=!1,this.playing=!1,this.fading=!1,this.tooltiping=!1,this.transitioning=!1,this.action=!1,this.target=!1,this.timeout=!1,this.index=0,this.length=0,this.init()}var m=i(window),v=i(document),f="viewer",g=document.createElement(f),w="viewer-fixed",p="viewer-open",b="viewer-show",y="viewer-hide",x="viewer-hide-xs-down",$="viewer-hide-sm-down",C="viewer-hide-md-down",F="viewer-fade",z="viewer-in",Y="viewer-move",k="viewer-active",I="viewer-invisible",X="viewer-transition",T="viewer-fullscreen",P="viewer-fullscreen-exit",V="viewer-close",E="img",S="mousedown touchstart pointerdown MSPointerDown",D="mousemove touchmove pointermove MSPointerMove",L="mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel",q="wheel mousewheel DOMMouseScroll",R="transitionend",M="load."+f,W="keydown."+f,A="click."+f,_="resize."+f,j="build."+f,B="built."+f,H="show."+f,U="shown."+f,N="hide."+f,O="hidden."+f,Z="view."+f,K="viewed."+f,Q="undefined"!=typeof g.style.transition,G=Math.round,J=Math.sqrt,ii=Math.abs,ti=Math.min,ei=Math.max,si=Number;u.prototype={constructor:u,init:function(){var t=this.options,e=this.$element,s=e.is(E),n=s?e:e.find(E),o=n.length,a=i.proxy(this.ready,this);o&&(i.isFunction(t.build)&&e.one(j,t.build),this.trigger(j).isDefaultPrevented()||(Q||(t.transition=!1),this.isImg=s,this.length=o,this.count=0,this.$images=n,this.$body=i("body"),t.inline?(e.one(B,i.proxy(function(){this.view()},this)),n.each(function(){this.complete?a():i(this).one(M,a)})):e.on(A,i.proxy(this.start,this))))},ready:function(){this.count++,this.count===this.length&&this.build()},build:function(){var t,e,s,n,o,a,h=this.options,r=this.$element;this.isBuilt||(this.$parent=t=r.parent(),this.$viewer=e=i(u.TEMPLATE),this.$canvas=e.find(".viewer-canvas"),this.$footer=e.find(".viewer-footer"),this.$title=s=e.find(".viewer-title"),this.$toolbar=n=e.find(".viewer-toolbar"),this.$navbar=o=e.find(".viewer-navbar"),this.$button=a=e.find(".viewer-button"),this.$tooltip=e.find(".viewer-tooltip"),this.$player=e.find(".viewer-player"),this.$list=e.find(".viewer-list"),s.addClass(h.title?c(h.title):y),n.addClass(h.toolbar?c(h.toolbar):y),n.find("li[class*=zoom]").toggleClass(I,!h.zoomable),n.find("li[class*=flip]").toggleClass(I,!h.scalable),h.rotatable||n.find("li[class*=rotate]").addClass(I).appendTo(n),o.addClass(h.navbar?c(h.navbar):y),a.toggleClass(y,!h.button),h.inline?(a.addClass(T),e.css("z-index",h.zIndexInline),"static"===t.css("position")&&t.css("position","relative")):(a.addClass(V),e.css("z-index",h.zIndex).addClass([w,F,y].join(" "))),r.after(e),h.inline&&(this.render(),this.bind(),this.isShown=!0),this.isBuilt=!0,i.isFunction(h.built)&&r.one(B,h.built),this.trigger(B))},unbuild:function(){this.isBuilt&&(this.isBuilt=!1,this.$viewer.remove())},bind:function(){var t=this.options,e=this.$element;i.isFunction(t.view)&&e.on(Z,t.view),i.isFunction(t.viewed)&&e.on(K,t.viewed),this.$viewer.on(A,i.proxy(this.click,this)).on(q,i.proxy(this.wheel,this)),this.$canvas.on(S,i.proxy(this.mousedown,this)),v.on(D,this._mousemove=o(this.mousemove,this)).on(L,this._mouseup=o(this.mouseup,this)).on(W,this._keydown=o(this.keydown,this)),m.on(_,this._resize=o(this.resize,this))},unbind:function(){var t=this.options,e=this.$element;i.isFunction(t.view)&&e.off(Z,t.view),i.isFunction(t.viewed)&&e.off(K,t.viewed),this.$viewer.off(A,this.click).off(q,this.wheel),this.$canvas.off(S,this.mousedown),v.off(D,this._mousemove).off(L,this._mouseup).off(W,this._keydown),m.off(_,this._resize)},render:function(){this.initContainer(),this.initViewer(),this.initList(),this.renderViewer()},initContainer:function(){this.container={width:m.innerWidth(),height:m.innerHeight()}},initViewer:function(){var t,e=this.options,s=this.$parent;e.inline&&(this.parent=t={width:ei(s.width(),e.minWidth),height:ei(s.height(),e.minHeight)}),!this.isFulled&&t||(t=this.container),this.viewer=i.extend({},t)},renderViewer:function(){this.options.inline&&!this.isFulled&&this.$viewer.css(this.viewer)},initList:function(){var e=this.options,s=this.$element,n=this.$list,o=[];this.$images.each(function(s){var n=this.src,a=this.alt||r(n),h=e.url;n&&(t(h)?h=this.getAttribute(h):i.isFunction(h)&&(h=h.call(this,this)),o.push('<li><img src="'+n+'" data-action="view" data-index="'+s+'" data-original-url="'+(h||n)+'" alt="'+a+'"></li>'))}),n.html(o.join("")).find(E).one(M,{filled:!0},i.proxy(this.loadImage,this)),this.$items=n.children(),e.transition&&s.one(K,function(){n.addClass(X)})},renderList:function(i){var t=i||this.index,e=this.$items.eq(t).width(),s=e+1;this.$list.css({width:s*this.length,marginLeft:(this.viewer.width-e)/2-s*t})},resetList:function(){this.$list.empty().removeClass(X).css("margin-left",0)},initImage:function(t){var e=this.options,s=this.$image,n=this.viewer,o=this.$footer.height(),a=n.width,h=ei(n.height-o,o),r=this.image||{};l(s[0],i.proxy(function(s,n){var o,l,d=s/n,c=a,u=h;h*d>a?u=a/d:c=h*d,c=ti(.9*c,s),u=ti(.9*u,n),l={naturalWidth:s,naturalHeight:n,aspectRatio:d,ratio:c/s,width:c,height:u,left:(a-c)/2,top:(h-u)/2},o=i.extend({},l),e.rotatable&&(l.rotate=r.rotate||0,o.rotate=0),e.scalable&&(l.scaleX=r.scaleX||1,l.scaleY=r.scaleY||1,o.scaleX=1,o.scaleY=1),this.image=l,this.initialImage=o,i.isFunction(t)&&t()},this))},renderImage:function(t){var e=this.image,s=this.$image;s.css({width:e.width,height:e.height,marginLeft:e.left,marginTop:e.top,transform:a(e)}),i.isFunction(t)&&(this.transitioning?s.one(R,t):t())},resetImage:function(){this.$image&&(this.$image.remove(),this.$image=null)},start:function(t){var e=t.target;i(e).is("img")&&(this.target=e,this.show())},click:function(t){var e=i(t.target),s=e.data("action"),n=this.image;switch(s){case"mix":this.isPlayed?this.stop():this.options.inline?this.isFulled?this.exit():this.full():this.hide();break;case"view":this.view(e.data("index"));break;case"zoom-in":this.zoom(.1,!0);break;case"zoom-out":this.zoom(-.1,!0);break;case"one-to-one":this.toggle();break;case"reset":this.reset();break;case"prev":this.prev();break;case"play":this.play();break;case"next":this.next();break;case"rotate-left":this.rotate(-90);break;case"rotate-right":this.rotate(90);break;case"flip-horizontal":this.scaleX(-n.scaleX||-1);break;case"flip-vertical":this.scaleY(-n.scaleY||-1);break;default:this.isPlayed&&this.stop()}},load:function(){var t=this.options,e=this.viewer,s=this.$image;this.timeout&&(clearTimeout(this.timeout),this.timeout=!1),s.removeClass(I).css("cssText","width:0;height:0;margin-left:"+e.width/2+"px;margin-top:"+e.height/2+"px;max-width:none!important;visibility:visible;"),this.initImage(i.proxy(function(){s.toggleClass(X,t.transition).toggleClass(Y,t.movable),this.renderImage(i.proxy(function(){this.isViewed=!0,this.trigger(K)},this))},this))},loadImage:function(t){var e=t.target,s=i(e),n=s.parent(),o=n.width(),a=n.height(),h=t.data&&t.data.filled;l(e,function(i,t){var e=i/t,n=o,r=a;a*e>o?h?n=a*e:r=o/e:h?r=o/e:n=a*e,s.css({width:n,height:r,marginLeft:(o-n)/2,marginTop:(a-r)/2})})},resize:function(){this.initContainer(),this.initViewer(),this.renderViewer(),this.renderList(),this.isViewed&&this.initImage(i.proxy(function(){this.renderImage()},this)),this.isPlayed&&this.$player.find(E).one(M,i.proxy(this.loadImage,this)).trigger(M)},wheel:function(t){var e=t.originalEvent||t,s=si(this.options.zoomRatio)||.1,n=1;this.isViewed&&(t.preventDefault(),this.wheeling||(this.wheeling=!0,setTimeout(i.proxy(function(){this.wheeling=!1},this),50),e.deltaY?n=e.deltaY>0?1:-1:e.wheelDelta?n=-e.wheelDelta/120:e.detail&&(n=e.detail>0?1:-1),this.zoom(-n*s,!0,t)))},keydown:function(i){var t=this.options,e=i.which;if(this.isFulled&&t.keyboard)switch(e){case 27:this.isPlayed?this.stop():t.inline?this.isFulled&&this.exit():this.hide();break;case 32:this.isPlayed&&this.stop();break;case 37:this.prev();break;case 38:i.preventDefault(),this.zoom(t.zoomRatio,!0);break;case 39:this.next();break;case 40:i.preventDefault(),this.zoom(-t.zoomRatio,!0);break;case 48:case 49:(i.ctrlKey||i.shiftKey)&&(i.preventDefault(),this.toggle())}},mousedown:function(i){var t,e=this.options,s=i.originalEvent,n=s&&s.touches,o=i,a=e.movable?"move":!1;if(this.isViewed){if(n){if(t=n.length,t>1){if(!e.zoomable||2!==t)return;o=n[1],this.startX2=o.pageX,this.startY2=o.pageY,a="zoom"}else this.isSwitchable()&&(a="switch");o=n[0]}a&&(i.preventDefault(),this.action=a,this.startX=o.pageX||s&&s.pageX,this.startY=o.pageY||s&&s.pageY)}},mousemove:function(i){var t,e=this.options,s=this.action,n=this.$image,o=i.originalEvent,a=o&&o.touches,h=i;if(this.isViewed){if(a){if(t=a.length,t>1){if(!e.zoomable||2!==t)return;h=a[1],this.endX2=h.pageX,this.endY2=h.pageY}h=a[0]}s&&(i.preventDefault(),"move"===s&&e.transition&&n.hasClass(X)&&n.removeClass(X),this.endX=h.pageX||o&&o.pageX,this.endY=h.pageY||o&&o.pageY,this.change(i))}},mouseup:function(i){var t=this.action;t&&(i.preventDefault(),"move"===t&&this.options.transition&&this.$image.addClass(X),this.action=!1)},show:function(){var t,e=this.options;e.inline||this.transitioning||(this.isBuilt||this.build(),i.isFunction(e.show)&&this.$element.one(H,e.show),this.trigger(H).isDefaultPrevented()||(this.$body.addClass(p),t=this.$viewer.removeClass(y),this.$element.one(U,i.proxy(function(){this.view(this.target?this.$images.index(this.target):this.index),this.target=!1},this)),e.transition?(this.transitioning=!0,t.addClass(X),h(t[0]),t.one(R,i.proxy(this.shown,this)).addClass(z)):(t.addClass(z),this.shown())))},hide:function(){var t=this.options,e=this.$viewer;t.inline||this.transitioning||!this.isShown||(i.isFunction(t.hide)&&this.$element.one(N,t.hide),this.trigger(N).isDefaultPrevented()||(this.isViewed&&t.transition?(this.transitioning=!0,this.$image.one(R,i.proxy(function(){e.one(R,i.proxy(this.hidden,this)).removeClass(z)},this)),this.zoomTo(0,!1,!1,!0)):(e.removeClass(z),this.hidden())))},view:function(t){var e,s,n,o,a,h=this.$title;t=Number(t)||0,!this.isShown||this.isPlayed||0>t||t>=this.length||this.isViewed&&t===this.index||this.trigger(Z).isDefaultPrevented()||(s=this.$items.eq(t),n=s.find(E),o=n.data("originalUrl"),a=n.attr("alt"),this.$image=e=i('<img src="'+o+'" alt="'+a+'">'),this.isViewed&&this.$items.eq(this.index).removeClass(k),s.addClass(k),this.isViewed=!1,this.index=t,this.image=null,this.$canvas.html(e.addClass(I)),this.renderList(),h.empty(),this.$element.one(K,i.proxy(function(){var i=this.image,t=i.naturalWidth,e=i.naturalHeight;h.html(a+" ("+t+" &times; "+e+")")},this)),e[0].complete?this.load():(e.one(M,i.proxy(this.load,this)),this.timeout&&clearTimeout(this.timeout),this.timeout=setTimeout(i.proxy(function(){e.removeClass(I),this.timeout=!1},this),1e3)))},prev:function(){this.view(ei(this.index-1,0))},next:function(){this.view(ti(this.index+1,this.length-1))},move:function(i,t){var e=this.image;this.moveTo(s(i)?i:e.left+si(i),s(t)?t:e.top+si(t))},moveTo:function(i,t){var n=this.image,o=!1;s(t)&&(t=i),i=si(i),t=si(t),this.isViewed&&!this.isPlayed&&this.options.movable&&(e(i)&&(n.left=i,o=!0),e(t)&&(n.top=t,o=!0),o&&this.renderImage())},zoom:function(i,t,e){var s=this.image;i=si(i),i=0>i?1/(1-i):1+i,this.zoomTo(s.width*i/s.naturalWidth,t,e)},zoomTo:function(i,t,s,n){var o,a,h,r,l,c=this.options,u=.01,m=100,v=this.image,f=v.width,g=v.height;i=ei(0,i),e(i)&&this.isViewed&&!this.isPlayed&&(n||c.zoomable)&&(n||(u=ei(u,c.minZoomRatio),m=ti(m,c.maxZoomRatio),i=ti(ei(i,u),m)),i>.95&&1.05>i&&(i=1),a=v.naturalWidth*i,h=v.naturalHeight*i,s&&(o=s.originalEvent)?(r=this.$viewer.offset(),l=o.touches?d(o.touches):{pageX:s.pageX||o.pageX||0,pageY:s.pageY||o.pageY||0},v.left-=(a-f)*((l.pageX-r.left-v.left)/f),v.top-=(h-g)*((l.pageY-r.top-v.top)/g)):(v.left-=(a-f)/2,v.top-=(h-g)/2),v.width=a,v.height=h,v.ratio=i,this.renderImage(),t&&this.tooltip())},rotate:function(i){this.rotateTo((this.image.rotate||0)+si(i))},rotateTo:function(i){var t=this.image;i=si(i),e(i)&&this.isViewed&&!this.isPlayed&&this.options.rotatable&&(t.rotate=i,this.renderImage())},scale:function(i,t){var n=this.image,o=!1;s(t)&&(t=i),i=si(i),t=si(t),this.isViewed&&!this.isPlayed&&this.options.scalable&&(e(i)&&(n.scaleX=i,o=!0),e(t)&&(n.scaleY=t,o=!0),o&&this.renderImage())},scaleX:function(i){this.scale(i,this.image.scaleY)},scaleY:function(i){this.scale(this.image.scaleX,i)},play:function(){var t,s=this.options,n=this.$player,o=i.proxy(this.loadImage,this),a=[],h=0,r=0;this.isShown&&!this.isPlayed&&(s.fullscreen&&this.requestFullscreen(),this.isPlayed=!0,n.addClass(b),this.$items.each(function(t){var e=i(this),l=e.find(E),d=i('<img src="'+l.data("originalUrl")+'" alt="'+l.attr("alt")+'">');h++,d.addClass(F).toggleClass(X,s.transition),e.hasClass(k)&&(d.addClass(z),r=t),a.push(d),d.one(M,{filled:!1},o),n.append(d)}),e(s.interval)&&s.interval>0&&(t=i.proxy(function(){this.playing=setTimeout(function(){a[r].removeClass(z),r++,r=h>r?r:0,a[r].addClass(z),t()},s.interval)},this),h>1&&t()))},stop:function(){this.isPlayed&&(this.options.fullscreen&&this.exitFullscreen(),this.isPlayed=!1,clearTimeout(this.playing),this.$player.removeClass(b).empty())},full:function(){var t=this.options,e=this.$image,s=this.$list;this.isShown&&!this.isPlayed&&!this.isFulled&&t.inline&&(this.isFulled=!0,this.$body.addClass(p),this.$button.addClass(P),t.transition&&(e.removeClass(X),s.removeClass(X)),this.$viewer.addClass(w).removeAttr("style").css("z-index",t.zIndex),this.initContainer(),this.viewer=i.extend({},this.container),this.renderList(),this.initImage(i.proxy(function(){this.renderImage(function(){t.transition&&setTimeout(function(){e.addClass(X),s.addClass(X)},0)})},this)))},exit:function(){var t=this.options,e=this.$image,s=this.$list;this.isFulled&&(this.isFulled=!1,this.$body.removeClass(p),this.$button.removeClass(P),t.transition&&(e.removeClass(X),s.removeClass(X)),this.$viewer.removeClass(w).css("z-index",t.zIndexInline),this.viewer=i.extend({},this.parent),this.renderViewer(),this.renderList(),this.initImage(i.proxy(function(){this.renderImage(function(){t.transition&&setTimeout(function(){e.addClass(X),s.addClass(X)},0)})},this)))},tooltip:function(){var t=this.options,e=this.$tooltip,s=this.image,n=[b,F,X].join(" ");this.isViewed&&!this.isPlayed&&t.tooltip&&(e.text(G(100*s.ratio)+"%"),this.tooltiping?clearTimeout(this.tooltiping):t.transition?(this.fading&&e.trigger(R),e.addClass(n),h(e[0]),e.addClass(z)):e.addClass(b),this.tooltiping=setTimeout(i.proxy(function(){t.transition?(e.one(R,i.proxy(function(){e.removeClass(n),this.fading=!1},this)).removeClass(z),this.fading=!0):e.removeClass(b),this.tooltiping=!1},this),1e3))},toggle:function(){1===this.image.ratio?this.zoomTo(this.initialImage.ratio,!0):this.zoomTo(1,!0)},reset:function(){this.isViewed&&!this.isPlayed&&(this.image=i.extend({},this.initialImage),this.renderImage())},update:function(){var t,e=this.$element,s=this.$images,n=[];if(this.isImg){if(!e.parent().length)return this.destroy()}else this.$images=s=e.find(E),this.length=s.length;this.isBuilt&&(i.each(this.$items,function(t){var e=i(this).find("img")[0],o=s[t];o?o.src!==e.src&&n.push(t):n.push(t)}),this.$list.width("auto"),this.initList(),this.isShown&&(this.length?this.isViewed&&(t=i.inArray(this.index,n),t>=0?(this.isViewed=!1,this.view(ei(this.index-(t+1),0))):this.$items.eq(this.index).addClass(k)):(this.$image=null,this.isViewed=!1,this.index=0,this.image=null,this.$canvas.empty(),this.$title.empty())))},destroy:function(){var i=this.$element;this.options.inline?this.unbind():(this.isShown&&this.unbind(),i.off(A,this.start)),this.unbuild(),i.removeData(f)},trigger:function(t,e){var s=i.Event(t,e);return this.$element.trigger(s),s},shown:function(){var t=this.options;this.transitioning=!1,this.isFulled=!0,this.isShown=!0,this.isVisible=!0,this.render(),this.bind(),i.isFunction(t.shown)&&this.$element.one(U,t.shown),this.trigger(U)},hidden:function(){var t=this.options;this.transitioning=!1,this.isViewed=!1,this.isFulled=!1,this.isShown=!1,this.isVisible=!1,this.unbind(),this.$body.removeClass(p),this.$viewer.addClass(y),this.resetList(),this.resetImage(),i.isFunction(t.hidden)&&this.$element.one(O,t.hidden),this.trigger(O)},requestFullscreen:function(){var i=document.documentElement;!this.isFulled||document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement||(i.requestFullscreen?i.requestFullscreen():i.msRequestFullscreen?i.msRequestFullscreen():i.mozRequestFullScreen?i.mozRequestFullScreen():i.webkitRequestFullscreen&&i.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT))},exitFullscreen:function(){this.isFulled&&(document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen())},change:function(i){var t=this.endX-this.startX,e=this.endY-this.startY;switch(this.action){case"move":this.move(t,e);break;case"zoom":this.zoom(function(i,t,e,s){var n=J(i*i+t*t),o=J(e*e+s*s);return(o-n)/n}(ii(this.startX-this.startX2),ii(this.startY-this.startY2),ii(this.endX-this.endX2),ii(this.endY-this.endY2)),!1,i),this.startX2=this.endX2,this.startY2=this.endY2;break;case"switch":this.action="switched",ii(t)>ii(e)&&(t>1?this.prev():-1>t&&this.next())}this.startX=this.endX,this.startY=this.endY},isSwitchable:function(){var i=this.image,t=this.viewer;return i.left>=0&&i.top>=0&&i.width<=t.width&&i.height<=t.height}},u.DEFAULTS={inline:!1,button:!0,navbar:!0,title:!0,toolbar:!0,tooltip:!0,movable:!0,zoomable:!0,rotatable:!0,scalable:!0,transition:!0,fullscreen:!0,keyboard:!0,interval:5e3,minWidth:200,minHeight:100,zoomRatio:.1,minZoomRatio:.01,maxZoomRatio:100,zIndex:2015,zIndexInline:0,url:"src",build:null,built:null,show:null,shown:null,hide:null,hidden:null,view:null,viewed:null},u.setDefaults=function(t){i.extend(u.DEFAULTS,t)},u.TEMPLATE='<div class="viewer-container"><div class="viewer-canvas"></div><div class="viewer-footer"><div class="viewer-title"></div><ul class="viewer-toolbar"><li class="viewer-zoom-in" data-action="zoom-in"></li><li class="viewer-zoom-out" data-action="zoom-out"></li><li class="viewer-one-to-one" data-action="one-to-one"></li><li class="viewer-reset" data-action="reset"></li><li class="viewer-prev" data-action="prev"></li><li class="viewer-play" data-action="play"></li><li class="viewer-next" data-action="next"></li><li class="viewer-rotate-left" data-action="rotate-left"></li><li class="viewer-rotate-right" data-action="rotate-right"></li><li class="viewer-flip-horizontal" data-action="flip-horizontal"></li><li class="viewer-flip-vertical" data-action="flip-vertical"></li></ul><div class="viewer-navbar"><ul class="viewer-list"></ul></div></div><div class="viewer-tooltip"></div><div class="viewer-button" data-action="mix"></div><div class="viewer-player"></div></div>',u.other=i.fn.viewer,i.fn.viewer=function(e){var o,a=n(arguments,1);return this.each(function(){var s,n=i(this),h=n.data(f);if(!h){if(/destroy|hide|exit|stop|reset/.test(e))return;n.data(f,h=new u(this,e))}t(e)&&i.isFunction(s=h[e])&&(o=s.apply(h,a))}),s(o)?this:o},i.fn.viewer.Constructor=u,i.fn.viewer.setDefaults=u.setDefaults,i.fn.viewer.noConflict=function(){return i.fn.viewer=u.other,this}});
var QRCode;!function(){function a(a){this.mode=c.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=[],d=0,e=this.data.length;e>d;d++){var f=this.data.charCodeAt(d);f>65536?(b[0]=240|(1835008&f)>>>18,b[1]=128|(258048&f)>>>12,b[2]=128|(4032&f)>>>6,b[3]=128|63&f):f>2048?(b[0]=224|(61440&f)>>>12,b[1]=128|(4032&f)>>>6,b[2]=128|63&f):f>128?(b[0]=192|(1984&f)>>>6,b[1]=128|63&f):b[0]=f,this.parsedData=this.parsedData.concat(b)}this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function j(a,b){this.totalCount=a,this.dataCount=b}function k(){this.buffer=[],this.length=0}function m(){return"undefined"!=typeof CanvasRenderingContext2D}function n(){var a=!1,b=navigator.userAgent;return/android/i.test(b)&&(a=!0,aMat=b.toString().match(/android ([0-9]\.[0-9])/i),aMat&&aMat[1]&&(a=parseFloat(aMat[1]))),a}function r(a,b){for(var c=1,e=s(a),f=0,g=l.length;g>=f;f++){var h=0;switch(b){case d.L:h=l[f][0];break;case d.M:h=l[f][1];break;case d.Q:h=l[f][2];break;case d.H:h=l[f][3]}if(h>=e)break;c++}if(c>l.length)throw new Error("Too long data");return c}function s(a){var b=encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}a.prototype={getLength:function(){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b){var c=new a(b);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(this.modules[a+c][b+d]=c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?!0:!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=f.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=0==b%2)},setupPositionAdjustPattern:function(){for(var a=f.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var g=-2;2>=g;g++)for(var h=-2;2>=h;h++)this.modules[d+g][e+h]=-2==g||2==g||-2==h||2==h||0==g&&0==h?!0:!1}},setupTypeNumber:function(a){for(var b=f.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=f.getBCHTypeInfo(c),e=0;15>e;e++){var g=!a&&1==(1&d>>e);6>e?this.modules[e][8]=g:8>e?this.modules[e+1][8]=g:this.modules[this.moduleCount-15+e][8]=g}for(var e=0;15>e;e++){var g=!a&&1==(1&d>>e);8>e?this.modules[8][this.moduleCount-e-1]=g:9>e?this.modules[8][15-e-1+1]=g:this.modules[8][15-e-1]=g}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,g=0,h=this.moduleCount-1;h>0;h-=2)for(6==h&&h--;;){for(var i=0;2>i;i++)if(null==this.modules[d][h-i]){var j=!1;g<a.length&&(j=1==(1&a[g]>>>e));var k=f.getMask(b,d,h-i);k&&(j=!j),this.modules[d][h-i]=j,e--,-1==e&&(g++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,d){for(var e=j.getRSBlocks(a,c),g=new k,h=0;h<d.length;h++){var i=d[h];g.put(i.mode,4),g.put(i.getLength(),f.getLengthInBits(i.mode,a)),i.write(g)}for(var l=0,h=0;h<e.length;h++)l+=e[h].dataCount;if(g.getLengthInBits()>8*l)throw new Error("code length overflow. ("+g.getLengthInBits()+">"+8*l+")");for(g.getLengthInBits()+4<=8*l&&g.put(0,4);0!=g.getLengthInBits()%8;)g.putBit(!1);for(;;){if(g.getLengthInBits()>=8*l)break;if(g.put(b.PAD0,8),g.getLengthInBits()>=8*l)break;g.put(b.PAD1,8)}return b.createBytes(g,e)},b.createBytes=function(a,b){for(var c=0,d=0,e=0,g=new Array(b.length),h=new Array(b.length),j=0;j<b.length;j++){var k=b[j].dataCount,l=b[j].totalCount-k;d=Math.max(d,k),e=Math.max(e,l),g[j]=new Array(k);for(var m=0;m<g[j].length;m++)g[j][m]=255&a.buffer[m+c];c+=k;var n=f.getErrorCorrectPolynomial(l),o=new i(g[j],n.getLength()-1),p=o.mod(n);h[j]=new Array(n.getLength()-1);for(var m=0;m<h[j].length;m++){var q=m+p.getLength()-h[j].length;h[j][m]=q>=0?p.get(q):0}}for(var r=0,m=0;m<b.length;m++)r+=b[m].totalCount;for(var s=new Array(r),t=0,m=0;d>m;m++)for(var j=0;j<b.length;j++)m<g[j].length&&(s[t++]=g[j][m]);for(var m=0;e>m;m++)for(var j=0;j<b.length;j++)m<h[j].length&&(s[t++]=h[j][m]);return s};for(var c={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},d={L:1,M:0,Q:3,H:2},e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;f.getBCHDigit(b)-f.getBCHDigit(f.G15)>=0;)b^=f.G15<<f.getBCHDigit(b)-f.getBCHDigit(f.G15);return(a<<10|b)^f.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;f.getBCHDigit(b)-f.getBCHDigit(f.G18)>=0;)b^=f.G18<<f.getBCHDigit(b)-f.getBCHDigit(f.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return f.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case e.PATTERN000:return 0==(b+c)%2;case e.PATTERN001:return 0==b%2;case e.PATTERN010:return 0==c%3;case e.PATTERN011:return 0==(b+c)%3;case e.PATTERN100:return 0==(Math.floor(b/2)+Math.floor(c/3))%2;case e.PATTERN101:return 0==b*c%2+b*c%3;case e.PATTERN110:return 0==(b*c%2+b*c%3)%2;case e.PATTERN111:return 0==(b*c%3+(b+c)%2)%2;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new i([1],0),c=0;a>c;c++)b=b.multiply(new i([1,g.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case c.MODE_NUMBER:return 10;case c.MODE_ALPHA_NUM:return 9;case c.MODE_8BIT_BYTE:return 8;case c.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case c.MODE_NUMBER:return 12;case c.MODE_ALPHA_NUM:return 11;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case c.MODE_NUMBER:return 14;case c.MODE_ALPHA_NUM:return 13;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||(0!=h||0!=i)&&g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,(0==j||4==j)&&(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},g={glog:function(a){if(1>a)throw new Error("glog("+a+")");return g.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return g.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},h=0;8>h;h++)g.EXP_TABLE[h]=1<<h;for(var h=8;256>h;h++)g.EXP_TABLE[h]=g.EXP_TABLE[h-4]^g.EXP_TABLE[h-5]^g.EXP_TABLE[h-6]^g.EXP_TABLE[h-8];for(var h=0;255>h;h++)g.LOG_TABLE[g.EXP_TABLE[h]]=h;i.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=g.gexp(g.glog(this.get(c))+g.glog(a.get(d)));return new i(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=g.glog(this.get(0))-g.glog(a.get(0)),c=new Array(this.getLength()),d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=g.gexp(g.glog(a.get(d))+b);return new i(c,0).mod(a)}},j.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],j.getRSBlocks=function(a,b){var c=j.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,e=[],f=0;d>f;f++)for(var g=c[3*f+0],h=c[3*f+1],i=c[3*f+2],k=0;g>k;k++)e.push(new j(h,i));return e},j.getRsBlockTable=function(a,b){switch(b){case d.L:return j.RS_BLOCK_TABLE[4*(a-1)+0];case d.M:return j.RS_BLOCK_TABLE[4*(a-1)+1];case d.Q:return j.RS_BLOCK_TABLE[4*(a-1)+2];case d.H:return j.RS_BLOCK_TABLE[4*(a-1)+3];default:return void 0}},k.prototype={get:function(a){var b=Math.floor(a/8);return 1==(1&this.buffer[b]>>>7-a%8)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(1&a>>>b-c-1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var l=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],o=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function g(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var b=this._htOption,c=this._el,d=a.getModuleCount();Math.floor(b.width/d),Math.floor(b.height/d),this.clear();var h=g("svg",{viewBox:"0 0 "+String(d)+" "+String(d),width:"100%",height:"100%",fill:b.colorLight});h.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),c.appendChild(h),h.appendChild(g("rect",{fill:b.colorDark,width:"1",height:"1",id:"template"}));for(var i=0;d>i;i++)for(var j=0;d>j;j++)if(a.isDark(i,j)){var k=g("use",{x:String(i),y:String(j)});k.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),h.appendChild(k)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),p="svg"===document.documentElement.tagName.toLowerCase(),q=p?o:m()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function d(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&_fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",void 0}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var b=1/window.devicePixelRatio,c=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,d,e,f,g,h,i,j){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*b;else"undefined"==typeof j&&(arguments[1]*=b,arguments[2]*=b,arguments[3]*=b,arguments[4]*=b);c.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=n(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&d.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();QRCode=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:d.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._android=n(),this._el=a,this._oQRCode=null,this._oDrawing=new q(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},QRCode.prototype.makeCode=function(a){this._oQRCode=new b(r(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=d}();
/**
 * jquery.Jcrop.min.js v0.9.12 (build:20140524)
 * jQuery Image Cropping Plugin - released under MIT License
 * Copyright (c) 2008-2013 Tapmodo Interactive LLC
 * https://github.com/tapmodo/Jcrop
 */
!function($){$.Jcrop=function(obj,opt){function px(n){return Math.round(n)+"px"}function cssClass(cl){return options.baseClass+"-"+cl}function supportsColorFade(){return $.fx.step.hasOwnProperty("backgroundColor")}function getPos(obj){var pos=$(obj).offset();return[pos.left,pos.top]}function mouseAbs(e){return[e.pageX-docOffset[0],e.pageY-docOffset[1]]}function setOptions(opt){"object"!=typeof opt&&(opt={}),options=$.extend(options,opt),$.each(["onChange","onSelect","onRelease","onDblClick"],function(i,e){"function"!=typeof options[e]&&(options[e]=function(){})})}function startDragMode(mode,pos,touch){if(docOffset=getPos($img),Tracker.setCursor("move"===mode?mode:mode+"-resize"),"move"===mode)return Tracker.activateHandlers(createMover(pos),doneSelect,touch);var fc=Coords.getFixed(),opp=oppLockCorner(mode),opc=Coords.getCorner(oppLockCorner(opp));Coords.setPressed(Coords.getCorner(opp)),Coords.setCurrent(opc),Tracker.activateHandlers(dragmodeHandler(mode,fc),doneSelect,touch)}function dragmodeHandler(mode,f){return function(pos){if(options.aspectRatio)switch(mode){case"e":pos[1]=f.y+1;break;case"w":pos[1]=f.y+1;break;case"n":pos[0]=f.x+1;break;case"s":pos[0]=f.x+1}else switch(mode){case"e":pos[1]=f.y2;break;case"w":pos[1]=f.y2;break;case"n":pos[0]=f.x2;break;case"s":pos[0]=f.x2}Coords.setCurrent(pos),Selection.update()}}function createMover(pos){var lloc=pos;return KeyManager.watchKeys(),function(pos){Coords.moveOffset([pos[0]-lloc[0],pos[1]-lloc[1]]),lloc=pos,Selection.update()}}function oppLockCorner(ord){switch(ord){case"n":return"sw";case"s":return"nw";case"e":return"nw";case"w":return"ne";case"ne":return"sw";case"nw":return"se";case"se":return"nw";case"sw":return"ne"}}function createDragger(ord){return function(e){return options.disabled?!1:"move"!==ord||options.allowMove?(docOffset=getPos($img),btndown=!0,startDragMode(ord,mouseAbs(e)),e.stopPropagation(),e.preventDefault(),!1):!1}}function presize($obj,w,h){var nw=$obj.width(),nh=$obj.height();nw>w&&w>0&&(nw=w,nh=w/$obj.width()*$obj.height()),nh>h&&h>0&&(nh=h,nw=h/$obj.height()*$obj.width()),xscale=$obj.width()/nw,yscale=$obj.height()/nh,$obj.width(nw).height(nh)}function unscale(c){return{x:c.x*xscale,y:c.y*yscale,x2:c.x2*xscale,y2:c.y2*yscale,w:c.w*xscale,h:c.h*yscale}}function doneSelect(){var c=Coords.getFixed();c.w>options.minSelect[0]&&c.h>options.minSelect[1]?(Selection.enableHandles(),Selection.done()):Selection.release(),Tracker.setCursor(options.allowSelect?"crosshair":"default")}function newSelection(e){if(!options.disabled&&options.allowSelect){btndown=!0,docOffset=getPos($img),Selection.disableHandles(),Tracker.setCursor("crosshair");var pos=mouseAbs(e);return Coords.setPressed(pos),Selection.update(),Tracker.activateHandlers(selectDrag,doneSelect,"touch"===e.type.substring(0,5)),KeyManager.watchKeys(),e.stopPropagation(),e.preventDefault(),!1}}function selectDrag(pos){Coords.setCurrent(pos),Selection.update()}function newTracker(){var trk=$("<div></div>").addClass(cssClass("tracker"));return is_msie&&trk.css({opacity:0,backgroundColor:"white"}),trk}function setClass(cname){$div.removeClass().addClass(cssClass("holder")).addClass(cname)}function animateTo(a,callback){function queueAnimator(){window.setTimeout(animator,interv)}var x1=a[0]/xscale,y1=a[1]/yscale,x2=a[2]/xscale,y2=a[3]/yscale;if(!animating){var animto=Coords.flipCoords(x1,y1,x2,y2),c=Coords.getFixed(),initcr=[c.x,c.y,c.x2,c.y2],animat=initcr,interv=options.animationDelay,ix1=animto[0]-initcr[0],iy1=animto[1]-initcr[1],ix2=animto[2]-initcr[2],iy2=animto[3]-initcr[3],pcent=0,velocity=options.swingSpeed;x1=animat[0],y1=animat[1],x2=animat[2],y2=animat[3],Selection.animMode(!0);var animator=function(){return function(){pcent+=(100-pcent)/velocity,animat[0]=Math.round(x1+pcent/100*ix1),animat[1]=Math.round(y1+pcent/100*iy1),animat[2]=Math.round(x2+pcent/100*ix2),animat[3]=Math.round(y2+pcent/100*iy2),pcent>=99.8&&(pcent=100),100>pcent?(setSelectRaw(animat),queueAnimator()):(Selection.done(),Selection.animMode(!1),"function"==typeof callback&&callback.call(api))}}();queueAnimator()}}function setSelect(rect){setSelectRaw([rect[0]/xscale,rect[1]/yscale,rect[2]/xscale,rect[3]/yscale]),options.onSelect.call(api,unscale(Coords.getFixed())),Selection.enableHandles()}function setSelectRaw(l){Coords.setPressed([l[0],l[1]]),Coords.setCurrent([l[2],l[3]]),Selection.update()}function tellSelect(){return unscale(Coords.getFixed())}function tellScaled(){return Coords.getFixed()}function setOptionsNew(opt){setOptions(opt),interfaceUpdate()}function disableCrop(){options.disabled=!0,Selection.disableHandles(),Selection.setCursor("default"),Tracker.setCursor("default")}function enableCrop(){options.disabled=!1,interfaceUpdate()}function cancelCrop(){Selection.done(),Tracker.activateHandlers(null,null)}function destroy(){$div.remove(),$origimg.show(),$origimg.css("visibility","visible"),$(obj).removeData("Jcrop")}function setImage(src,callback){Selection.release(),disableCrop();var img=new Image;img.onload=function(){var iw=img.width,ih=img.height,bw=options.boxWidth,bh=options.boxHeight;$img.width(iw).height(ih),$img.attr("src",src),$img2.attr("src",src),presize($img,bw,bh),boundx=$img.width(),boundy=$img.height(),$img2.width(boundx).height(boundy),$trk.width(boundx+2*bound).height(boundy+2*bound),$div.width(boundx).height(boundy),Shade.resize(boundx,boundy),enableCrop(),"function"==typeof callback&&callback.call(api)},img.src=src}function colorChangeMacro($obj,color,now){var mycolor=color||options.bgColor;options.bgFade&&supportsColorFade()&&options.fadeTime&&!now?$obj.animate({backgroundColor:mycolor},{queue:!1,duration:options.fadeTime}):$obj.css("backgroundColor",mycolor)}function interfaceUpdate(alt){options.allowResize?alt?Selection.enableOnly():Selection.enableHandles():Selection.disableHandles(),Tracker.setCursor(options.allowSelect?"crosshair":"default"),Selection.setCursor(options.allowMove?"move":"default"),options.hasOwnProperty("trueSize")&&(xscale=options.trueSize[0]/boundx,yscale=options.trueSize[1]/boundy),options.hasOwnProperty("setSelect")&&(setSelect(options.setSelect),Selection.done(),delete options.setSelect),Shade.refresh(),options.bgColor!=bgcolor&&(colorChangeMacro(options.shade?Shade.getShades():$div,options.shade?options.shadeColor||options.bgColor:options.bgColor),bgcolor=options.bgColor),bgopacity!=options.bgOpacity&&(bgopacity=options.bgOpacity,options.shade?Shade.refresh():Selection.setBgOpacity(bgopacity)),xlimit=options.maxSize[0]||0,ylimit=options.maxSize[1]||0,xmin=options.minSize[0]||0,ymin=options.minSize[1]||0,options.hasOwnProperty("outerImage")&&($img.attr("src",options.outerImage),delete options.outerImage),Selection.refresh()}var docOffset,options=$.extend({},$.Jcrop.defaults),_ua=navigator.userAgent.toLowerCase(),is_msie=/msie/.test(_ua),ie6mode=/msie [1-6]\./.test(_ua);"object"!=typeof obj&&(obj=$(obj)[0]),"object"!=typeof opt&&(opt={}),setOptions(opt);var img_css={border:"none",visibility:"visible",margin:0,padding:0,position:"absolute",top:0,left:0},$origimg=$(obj),img_mode=!0;if("IMG"==obj.tagName){if(0!=$origimg[0].width&&0!=$origimg[0].height)$origimg.width($origimg[0].width),$origimg.height($origimg[0].height);else{var tempImage=new Image;tempImage.src=$origimg[0].src,$origimg.width(tempImage.width),$origimg.height(tempImage.height)}var $img=$origimg.clone().removeAttr("id").css(img_css).show();$img.width($origimg.width()),$img.height($origimg.height()),$origimg.after($img).hide()}else $img=$origimg.css(img_css).show(),img_mode=!1,null===options.shade&&(options.shade=!0);presize($img,options.boxWidth,options.boxHeight);var boundx=$img.width(),boundy=$img.height(),$div=$("<div />").width(boundx).height(boundy).addClass(cssClass("holder")).css({position:"relative",backgroundColor:options.bgColor}).insertAfter($origimg).append($img);options.addClass&&$div.addClass(options.addClass);var $img2=$("<div />"),$img_holder=$("<div />").width("100%").height("100%").css({zIndex:310,position:"absolute",overflow:"hidden"}),$hdl_holder=$("<div />").width("100%").height("100%").css("zIndex",320),$sel=$("<div />").css({position:"absolute",zIndex:600}).dblclick(function(){var c=Coords.getFixed();options.onDblClick.call(api,c)}).insertBefore($img).append($img_holder,$hdl_holder);img_mode&&($img2=$("<img />").attr("src",$img.attr("src")).css(img_css).width(boundx).height(boundy),$img_holder.append($img2)),ie6mode&&$sel.css({overflowY:"hidden"});var xlimit,ylimit,xmin,ymin,xscale,yscale,btndown,animating,shift_down,bound=options.boundary,$trk=newTracker().width(boundx+2*bound).height(boundy+2*bound).css({position:"absolute",top:px(-bound),left:px(-bound),zIndex:290}).mousedown(newSelection),bgcolor=options.bgColor,bgopacity=options.bgOpacity;docOffset=getPos($img);var Touch=function(){function hasTouchSupport(){var i,support={},events=["touchstart","touchmove","touchend"],el=document.createElement("div");try{for(i=0;i<events.length;i++){var eventName=events[i];eventName="on"+eventName;var isSupported=eventName in el;isSupported||(el.setAttribute(eventName,"return;"),isSupported="function"==typeof el[eventName]),support[events[i]]=isSupported}return support.touchstart&&support.touchend&&support.touchmove}catch(err){return!1}}function detectSupport(){return options.touchSupport===!0||options.touchSupport===!1?options.touchSupport:hasTouchSupport()}return{createDragger:function(ord){return function(e){return options.disabled?!1:"move"!==ord||options.allowMove?(docOffset=getPos($img),btndown=!0,startDragMode(ord,mouseAbs(Touch.cfilter(e)),!0),e.stopPropagation(),e.preventDefault(),!1):!1}},newSelection:function(e){return newSelection(Touch.cfilter(e))},cfilter:function(e){return e.pageX=e.originalEvent.changedTouches[0].pageX,e.pageY=e.originalEvent.changedTouches[0].pageY,e},isSupported:hasTouchSupport,support:detectSupport()}}(),Coords=function(){function setPressed(pos){pos=rebound(pos),x2=x1=pos[0],y2=y1=pos[1]}function setCurrent(pos){pos=rebound(pos),ox=pos[0]-x2,oy=pos[1]-y2,x2=pos[0],y2=pos[1]}function getOffset(){return[ox,oy]}function moveOffset(offset){var ox=offset[0],oy=offset[1];0>x1+ox&&(ox-=ox+x1),0>y1+oy&&(oy-=oy+y1),y2+oy>boundy&&(oy+=boundy-(y2+oy)),x2+ox>boundx&&(ox+=boundx-(x2+ox)),x1+=ox,x2+=ox,y1+=oy,y2+=oy}function getCorner(ord){var c=getFixed();switch(ord){case"ne":return[c.x2,c.y];case"nw":return[c.x,c.y];case"se":return[c.x2,c.y2];case"sw":return[c.x,c.y2]}}function getFixed(){if(!options.aspectRatio)return getRect();var xx,yy,w,h,aspect=options.aspectRatio,min_x=options.minSize[0]/xscale,max_x=options.maxSize[0]/xscale,max_y=options.maxSize[1]/yscale,rw=x2-x1,rh=y2-y1,rwa=Math.abs(rw),rha=Math.abs(rh),real_ratio=rwa/rha;return 0===max_x&&(max_x=10*boundx),0===max_y&&(max_y=10*boundy),aspect>real_ratio?(yy=y2,w=rha*aspect,xx=0>rw?x1-w:w+x1,0>xx?(xx=0,h=Math.abs((xx-x1)/aspect),yy=0>rh?y1-h:h+y1):xx>boundx&&(xx=boundx,h=Math.abs((xx-x1)/aspect),yy=0>rh?y1-h:h+y1)):(xx=x2,h=rwa/aspect,yy=0>rh?y1-h:y1+h,0>yy?(yy=0,w=Math.abs((yy-y1)*aspect),xx=0>rw?x1-w:w+x1):yy>boundy&&(yy=boundy,w=Math.abs(yy-y1)*aspect,xx=0>rw?x1-w:w+x1)),xx>x1?(min_x>xx-x1?xx=x1+min_x:xx-x1>max_x&&(xx=x1+max_x),yy=yy>y1?y1+(xx-x1)/aspect:y1-(xx-x1)/aspect):x1>xx&&(min_x>x1-xx?xx=x1-min_x:x1-xx>max_x&&(xx=x1-max_x),yy=yy>y1?y1+(x1-xx)/aspect:y1-(x1-xx)/aspect),0>xx?(x1-=xx,xx=0):xx>boundx&&(x1-=xx-boundx,xx=boundx),0>yy?(y1-=yy,yy=0):yy>boundy&&(y1-=yy-boundy,yy=boundy),makeObj(flipCoords(x1,y1,xx,yy))}function rebound(p){return p[0]<0&&(p[0]=0),p[1]<0&&(p[1]=0),p[0]>boundx&&(p[0]=boundx),p[1]>boundy&&(p[1]=boundy),[Math.round(p[0]),Math.round(p[1])]}function flipCoords(x1,y1,x2,y2){var xa=x1,xb=x2,ya=y1,yb=y2;return x1>x2&&(xa=x2,xb=x1),y1>y2&&(ya=y2,yb=y1),[xa,ya,xb,yb]}function getRect(){var delta,xsize=x2-x1,ysize=y2-y1;return xlimit&&Math.abs(xsize)>xlimit&&(x2=xsize>0?x1+xlimit:x1-xlimit),ylimit&&Math.abs(ysize)>ylimit&&(y2=ysize>0?y1+ylimit:y1-ylimit),ymin/yscale&&Math.abs(ysize)<ymin/yscale&&(y2=ysize>0?y1+ymin/yscale:y1-ymin/yscale),xmin/xscale&&Math.abs(xsize)<xmin/xscale&&(x2=xsize>0?x1+xmin/xscale:x1-xmin/xscale),0>x1&&(x2-=x1,x1-=x1),0>y1&&(y2-=y1,y1-=y1),0>x2&&(x1-=x2,x2-=x2),0>y2&&(y1-=y2,y2-=y2),x2>boundx&&(delta=x2-boundx,x1-=delta,x2-=delta),y2>boundy&&(delta=y2-boundy,y1-=delta,y2-=delta),x1>boundx&&(delta=x1-boundy,y2-=delta,y1-=delta),y1>boundy&&(delta=y1-boundy,y2-=delta,y1-=delta),makeObj(flipCoords(x1,y1,x2,y2))}function makeObj(a){return{x:a[0],y:a[1],x2:a[2],y2:a[3],w:a[2]-a[0],h:a[3]-a[1]}}var ox,oy,x1=0,y1=0,x2=0,y2=0;return{flipCoords:flipCoords,setPressed:setPressed,setCurrent:setCurrent,getOffset:getOffset,moveOffset:moveOffset,getCorner:getCorner,getFixed:getFixed}}(),Shade=function(){function resizeShades(w,h){shades.left.css({height:px(h)}),shades.right.css({height:px(h)})}function updateAuto(){return updateShade(Coords.getFixed())}function updateShade(c){shades.top.css({left:px(c.x),width:px(c.w),height:px(c.y)}),shades.bottom.css({top:px(c.y2),left:px(c.x),width:px(c.w),height:px(boundy-c.y2)}),shades.right.css({left:px(c.x2),width:px(boundx-c.x2)}),shades.left.css({width:px(c.x)})}function createShade(){return $("<div />").css({position:"absolute",backgroundColor:options.shadeColor||options.bgColor}).appendTo(holder)}function enableShade(){enabled||(enabled=!0,holder.insertBefore($img),updateAuto(),Selection.setBgOpacity(1,0,1),$img2.hide(),setBgColor(options.shadeColor||options.bgColor,1),Selection.isAwake()?setOpacity(options.bgOpacity,1):setOpacity(1,1))}function setBgColor(color,now){colorChangeMacro(getShades(),color,now)}function disableShade(){enabled&&(holder.remove(),$img2.show(),enabled=!1,Selection.isAwake()?Selection.setBgOpacity(options.bgOpacity,1,1):(Selection.setBgOpacity(1,1,1),Selection.disableHandles()),colorChangeMacro($div,0,1))}function setOpacity(opacity,now){enabled&&(options.bgFade&&!now?holder.animate({opacity:1-opacity},{queue:!1,duration:options.fadeTime}):holder.css({opacity:1-opacity}))}function refreshAll(){options.shade?enableShade():disableShade(),Selection.isAwake()&&setOpacity(options.bgOpacity)}function getShades(){return holder.children()}var enabled=!1,holder=$("<div />").css({position:"absolute",zIndex:240,opacity:0}),shades={top:createShade(),left:createShade().height(boundy),right:createShade().height(boundy),bottom:createShade()};return{update:updateAuto,updateRaw:updateShade,getShades:getShades,setBgColor:setBgColor,enable:enableShade,disable:disableShade,resize:resizeShades,refresh:refreshAll,opacity:setOpacity}}(),Selection=function(){function insertBorder(type){var jq=$("<div />").css({position:"absolute",opacity:options.borderOpacity}).addClass(cssClass(type));return $img_holder.append(jq),jq}function dragDiv(ord,zi){var jq=$("<div />").mousedown(createDragger(ord)).css({cursor:ord+"-resize",position:"absolute",zIndex:zi}).addClass("ord-"+ord);return Touch.support&&jq.bind("touchstart.jcrop",Touch.createDragger(ord)),$hdl_holder.append(jq),jq}function insertHandle(ord){var hs=options.handleSize,div=dragDiv(ord,hdep++).css({opacity:options.handleOpacity}).addClass(cssClass("handle"));return hs&&div.width(hs).height(hs),div}function insertDragbar(ord){return dragDiv(ord,hdep++).addClass("jcrop-dragbar")}function createDragbars(li){var i;for(i=0;i<li.length;i++)dragbar[li[i]]=insertDragbar(li[i])}function createBorders(li){var cl,i;for(i=0;i<li.length;i++){switch(li[i]){case"n":cl="hline";break;case"s":cl="hline bottom";break;case"e":cl="vline right";break;case"w":cl="vline"}borders[li[i]]=insertBorder(cl)}}function createHandles(li){var i;for(i=0;i<li.length;i++)handle[li[i]]=insertHandle(li[i])}function moveto(x,y){options.shade||$img2.css({top:px(-y),left:px(-x)}),$sel.css({top:px(y),left:px(x)})}function resize(w,h){$sel.width(Math.round(w)).height(Math.round(h))}function refresh(){var c=Coords.getFixed();Coords.setPressed([c.x,c.y]),Coords.setCurrent([c.x2,c.y2]),updateVisible()}function updateVisible(select){return awake?update(select):void 0}function update(select){var c=Coords.getFixed();resize(c.w,c.h),moveto(c.x,c.y),options.shade&&Shade.updateRaw(c),awake||show(),select?options.onSelect.call(api,unscale(c)):options.onChange.call(api,unscale(c))}function setBgOpacity(opacity,force,now){(awake||force)&&(options.bgFade&&!now?$img.animate({opacity:opacity},{queue:!1,duration:options.fadeTime}):$img.css("opacity",opacity))}function show(){$sel.show(),options.shade?Shade.opacity(bgopacity):setBgOpacity(bgopacity,!0),awake=!0}function release(){disableHandles(),$sel.hide(),options.shade?Shade.opacity(1):setBgOpacity(1),awake=!1,options.onRelease.call(api)}function showHandles(){seehandles&&$hdl_holder.show()}function enableHandles(){return seehandles=!0,options.allowResize?($hdl_holder.show(),!0):void 0}function disableHandles(){seehandles=!1,$hdl_holder.hide()}function animMode(v){v?(animating=!0,disableHandles()):(animating=!1,enableHandles())}function done(){animMode(!1),refresh()}var awake,hdep=370,borders={},handle={},dragbar={},seehandles=!1;options.dragEdges&&$.isArray(options.createDragbars)&&createDragbars(options.createDragbars),$.isArray(options.createHandles)&&createHandles(options.createHandles),options.drawBorders&&$.isArray(options.createBorders)&&createBorders(options.createBorders),$(document).bind("touchstart.jcrop-ios",function(e){$(e.currentTarget).hasClass("jcrop-tracker")&&e.stopPropagation()});var $track=newTracker().mousedown(createDragger("move")).css({cursor:"move",position:"absolute",zIndex:360});return Touch.support&&$track.bind("touchstart.jcrop",Touch.createDragger("move")),$img_holder.append($track),disableHandles(),{updateVisible:updateVisible,update:update,release:release,refresh:refresh,isAwake:function(){return awake},setCursor:function(cursor){$track.css("cursor",cursor)},enableHandles:enableHandles,enableOnly:function(){seehandles=!0},showHandles:showHandles,disableHandles:disableHandles,animMode:animMode,setBgOpacity:setBgOpacity,done:done}}(),Tracker=function(){function toFront(touch){$trk.css({zIndex:450}),touch?$(document).bind("touchmove.jcrop",trackTouchMove).bind("touchend.jcrop",trackTouchEnd):trackDoc&&$(document).bind("mousemove.jcrop",trackMove).bind("mouseup.jcrop",trackUp)}function toBack(){$trk.css({zIndex:290}),$(document).unbind(".jcrop")}function trackMove(e){return onMove(mouseAbs(e)),!1}function trackUp(e){return e.preventDefault(),e.stopPropagation(),btndown&&(btndown=!1,onDone(mouseAbs(e)),Selection.isAwake()&&options.onSelect.call(api,unscale(Coords.getFixed())),toBack(),onMove=function(){},onDone=function(){}),!1}function activateHandlers(move,done,touch){return btndown=!0,onMove=move,onDone=done,toFront(touch),!1}function trackTouchMove(e){return onMove(mouseAbs(Touch.cfilter(e))),!1}function trackTouchEnd(e){return trackUp(Touch.cfilter(e))}function setCursor(t){$trk.css("cursor",t)}var onMove=function(){},onDone=function(){},trackDoc=options.trackDocument;return trackDoc||$trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp),$img.before($trk),{activateHandlers:activateHandlers,setCursor:setCursor}}(),KeyManager=function(){function watchKeys(){options.keySupport&&($keymgr.show(),$keymgr.focus())}function onBlur(){$keymgr.hide()}function doNudge(e,x,y){options.allowMove&&(Coords.moveOffset([x,y]),Selection.updateVisible(!0)),e.preventDefault(),e.stopPropagation()}function parseKey(e){if(e.ctrlKey||e.metaKey)return!0;shift_down=e.shiftKey?!0:!1;var nudge=shift_down?10:1;switch(e.keyCode){case 37:doNudge(e,-nudge,0);break;case 39:doNudge(e,nudge,0);break;case 38:doNudge(e,0,-nudge);break;case 40:doNudge(e,0,nudge);break;case 27:options.allowSelect&&Selection.release();break;case 9:return!0}return!1}var $keymgr=$('<input type="radio" />').css({position:"fixed",left:"-120px",width:"12px"}).addClass("jcrop-keymgr"),$keywrap=$("<div />").css({position:"absolute",overflow:"hidden"}).append($keymgr);return options.keySupport&&($keymgr.keydown(parseKey).blur(onBlur),ie6mode||!options.fixedSupport?($keymgr.css({position:"absolute",left:"-20px"}),$keywrap.append($keymgr).insertBefore($img)):$keymgr.insertBefore($img)),{watchKeys:watchKeys}}();Touch.support&&$trk.bind("touchstart.jcrop",Touch.newSelection),$hdl_holder.hide(),interfaceUpdate(!0);var api={setImage:setImage,animateTo:animateTo,setSelect:setSelect,setOptions:setOptionsNew,tellSelect:tellSelect,tellScaled:tellScaled,setClass:setClass,disable:disableCrop,enable:enableCrop,cancel:cancelCrop,release:Selection.release,destroy:destroy,focus:KeyManager.watchKeys,getBounds:function(){return[boundx*xscale,boundy*yscale]},getWidgetSize:function(){return[boundx,boundy]},getScaleFactor:function(){return[xscale,yscale]},getOptions:function(){return options},ui:{holder:$div,selection:$sel}};return is_msie&&$div.bind("selectstart",function(){return!1}),$origimg.data("Jcrop",api),api},$.fn.Jcrop=function(options,callback){var api;return this.each(function(){if($(this).data("Jcrop")){if("api"===options)return $(this).data("Jcrop");$(this).data("Jcrop").setOptions(options)}else"IMG"==this.tagName?$.Jcrop.Loader(this,function(){$(this).css({display:"block",visibility:"hidden"}),api=$.Jcrop(this,options),$.isFunction(callback)&&callback.call(api)}):($(this).css({display:"block",visibility:"hidden"}),api=$.Jcrop(this,options),$.isFunction(callback)&&callback.call(api))}),this},$.Jcrop.Loader=function(imgobj,success,error){function completeCheck(){img.complete?($img.unbind(".jcloader"),$.isFunction(success)&&success.call(img)):window.setTimeout(completeCheck,50)}var $img=$(imgobj),img=$img[0];$img.bind("load.jcloader",completeCheck).bind("error.jcloader",function(){$img.unbind(".jcloader"),$.isFunction(error)&&error.call(img)}),img.complete&&$.isFunction(success)&&($img.unbind(".jcloader"),success.call(img))},$.Jcrop.defaults={allowSelect:!0,allowMove:!0,allowResize:!0,trackDocument:!0,baseClass:"jcrop",addClass:null,bgColor:"black",bgOpacity:.6,bgFade:!1,borderOpacity:.4,handleOpacity:.5,handleSize:null,aspectRatio:0,keySupport:!0,createHandles:["n","s","e","w","nw","ne","se","sw"],createDragbars:["n","s","e","w"],createBorders:["n","s","e","w"],drawBorders:!0,dragEdges:!0,fixedSupport:!0,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}}}(jQuery);