/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function (a, b) {
    function cy(a) {
        return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1;
    }
    function cv(a) {
        if (!ck[a]) {
            var b = c.body,
                d = f('<' + a + '>').appendTo(b),
                e = d.css('display');
            d.remove();
            if (e === 'none' || e === '') {
                cl || ((cl = c.createElement('iframe')), (cl.frameBorder = cl.width = cl.height = 0)), b.appendChild(cl);
                if (!cm || !cl.createElement)
                    (cm = (cl.contentWindow || cl.contentDocument).document), cm.write((c.compatMode === 'CSS1Compat' ? '<!doctype html>' : '') + '<html><body>'), cm.close();
                (d = cm.createElement(a)), cm.body.appendChild(d), (e = f.css(d, 'display')), b.removeChild(cl);
            }
            ck[a] = e;
        }
        return ck[a];
    }
    function cu(a, b) {
        var c = {};
        f.each(cq.concat.apply([], cq.slice(0, b)), function () {
            c[this] = a;
        });
        return c;
    }
    function ct() {
        cr = b;
    }
    function cs() {
        setTimeout(ct, 0);
        return (cr = f.now());
    }
    function cj() {
        try {
            return new a.ActiveXObject('Microsoft.XMLHTTP');
        } catch (b) {}
    }
    function ci() {
        try {
            return new a.XMLHttpRequest();
        } catch (b) {}
    }
    function cc(a, c) {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var d = a.dataTypes,
            e = {},
            g,
            h,
            i = d.length,
            j,
            k = d[0],
            l,
            m,
            n,
            o,
            p;
        for (g = 1; g < i; g++) {
            if (g === 1) for (h in a.converters) typeof h == 'string' && (e[h.toLowerCase()] = a.converters[h]);
            (l = k), (k = d[g]);
            if (k === '*') k = l;
            else if (l !== '*' && l !== k) {
                (m = l + ' ' + k), (n = e[m] || e['* ' + k]);
                if (!n) {
                    p = b;
                    for (o in e) {
                        j = o.split(' ');
                        if (j[0] === l || j[0] === '*') {
                            p = e[j[1] + ' ' + k];
                            if (p) {
                                (o = e[o]), o === !0 ? (n = p) : p === !0 && (n = o);
                                break;
                            }
                        }
                    }
                }
                !n && !p && f.error('No conversion from ' + m.replace(' ', ' to ')), n !== !0 && (c = n ? n(c) : p(o(c)));
            }
        }
        return c;
    }
    function cb(a, c, d) {
        var e = a.contents,
            f = a.dataTypes,
            g = a.responseFields,
            h,
            i,
            j,
            k;
        for (i in g) i in d && (c[g[i]] = d[i]);
        while (f[0] === '*') f.shift(), h === b && (h = a.mimeType || c.getResponseHeader('content-type'));
        if (h)
            for (i in e)
                if (e[i] && e[i].test(h)) {
                    f.unshift(i);
                    break;
                }
        if (f[0] in d) j = f[0];
        else {
            for (i in d) {
                if (!f[0] || a.converters[i + ' ' + f[0]]) {
                    j = i;
                    break;
                }
                k || (k = i);
            }
            j = j || k;
        }
        if (j) {
            j !== f[0] && f.unshift(j);
            return d[j];
        }
    }
    function ca(a, b, c, d) {
        if (f.isArray(b))
            f.each(b, function (b, e) {
                c || bE.test(a) ? d(a, e) : ca(a + '[' + (typeof e == 'object' || f.isArray(e) ? b : '') + ']', e, c, d);
            });
        else if (!c && b != null && typeof b == 'object') for (var e in b) ca(a + '[' + e + ']', b[e], c, d);
        else d(a, b);
    }
    function b_(a, c) {
        var d,
            e,
            g = f.ajaxSettings.flatOptions || {};
        for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]);
        e && f.extend(!0, a, e);
    }
    function b$(a, c, d, e, f, g) {
        (f = f || c.dataTypes[0]), (g = g || {}), (g[f] = !0);
        var h = a[f],
            i = 0,
            j = h ? h.length : 0,
            k = a === bT,
            l;
        for (; i < j && (k || !l); i++) (l = h[i](c, d, e)), typeof l == 'string' && (!k || g[l] ? (l = b) : (c.dataTypes.unshift(l), (l = b$(a, c, d, e, l, g))));
        (k || !l) && !g['*'] && (l = b$(a, c, d, e, '*', g));
        return l;
    }
    function bZ(a) {
        return function (b, c) {
            typeof b != 'string' && ((c = b), (b = '*'));
            if (f.isFunction(c)) {
                var d = b.toLowerCase().split(bP),
                    e = 0,
                    g = d.length,
                    h,
                    i,
                    j;
                for (; e < g; e++) (h = d[e]), (j = /^\+/.test(h)), j && (h = h.substr(1) || '*'), (i = a[h] = a[h] || []), i[j ? 'unshift' : 'push'](c);
            }
        };
    }
    function bC(a, b, c) {
        var d = b === 'width' ? a.offsetWidth : a.offsetHeight,
            e = b === 'width' ? bx : by,
            g = 0,
            h = e.length;
        if (d > 0) {
            if (c !== 'border')
                for (; g < h; g++)
                    c || (d -= parseFloat(f.css(a, 'padding' + e[g])) || 0),
                        c === 'margin' ? (d += parseFloat(f.css(a, c + e[g])) || 0) : (d -= parseFloat(f.css(a, 'border' + e[g] + 'Width')) || 0);
            return d + 'px';
        }
        d = bz(a, b, b);
        if (d < 0 || d == null) d = a.style[b] || 0;
        d = parseFloat(d) || 0;
        if (c)
            for (; g < h; g++)
                (d += parseFloat(f.css(a, 'padding' + e[g])) || 0),
                    c !== 'padding' && (d += parseFloat(f.css(a, 'border' + e[g] + 'Width')) || 0),
                    c === 'margin' && (d += parseFloat(f.css(a, c + e[g])) || 0);
        return d + 'px';
    }
    function bp(a, b) {
        b.src ? f.ajax({ url: b.src, async: !1, dataType: 'script' }) : f.globalEval((b.text || b.textContent || b.innerHTML || '').replace(bf, '/*$0*/')),
            b.parentNode && b.parentNode.removeChild(b);
    }
    function bo(a) {
        var b = c.createElement('div');
        bh.appendChild(b), (b.innerHTML = a.outerHTML);
        return b.firstChild;
    }
    function bn(a) {
        var b = (a.nodeName || '').toLowerCase();
        b === 'input' ? bm(a) : b !== 'script' && typeof a.getElementsByTagName != 'undefined' && f.grep(a.getElementsByTagName('input'), bm);
    }
    function bm(a) {
        if (a.type === 'checkbox' || a.type === 'radio') a.defaultChecked = a.checked;
    }
    function bl(a) {
        return typeof a.getElementsByTagName != 'undefined' ? a.getElementsByTagName('*') : typeof a.querySelectorAll != 'undefined' ? a.querySelectorAll('*') : [];
    }
    function bk(a, b) {
        var c;
        if (b.nodeType === 1) {
            b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), (c = b.nodeName.toLowerCase());
            if (c === 'object') b.outerHTML = a.outerHTML;
            else if (c !== 'input' || (a.type !== 'checkbox' && a.type !== 'radio')) {
                if (c === 'option') b.selected = a.defaultSelected;
                else if (c === 'input' || c === 'textarea') b.defaultValue = a.defaultValue;
            } else a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value);
            b.removeAttribute(f.expando);
        }
    }
    function bj(a, b) {
        if (b.nodeType === 1 && !!f.hasData(a)) {
            var c,
                d,
                e,
                g = f._data(a),
                h = f._data(b, g),
                i = g.events;
            if (i) {
                delete h.handle, (h.events = {});
                for (c in i) for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c + (i[c][d].namespace ? '.' : '') + i[c][d].namespace, i[c][d], i[c][d].data);
            }
            h.data && (h.data = f.extend({}, h.data));
        }
    }
    function bi(a, b) {
        return f.nodeName(a, 'table') ? a.getElementsByTagName('tbody')[0] || a.appendChild(a.ownerDocument.createElement('tbody')) : a;
    }
    function U(a) {
        var b = V.split('|'),
            c = a.createDocumentFragment();
        if (c.createElement) while (b.length) c.createElement(b.pop());
        return c;
    }
    function T(a, b, c) {
        b = b || 0;
        if (f.isFunction(b))
            return f.grep(a, function (a, d) {
                var e = !!b.call(a, d, a);
                return e === c;
            });
        if (b.nodeType)
            return f.grep(a, function (a, d) {
                return (a === b) === c;
            });
        if (typeof b == 'string') {
            var d = f.grep(a, function (a) {
                return a.nodeType === 1;
            });
            if (O.test(b)) return f.filter(b, d, !c);
            b = f.filter(b, d);
        }
        return f.grep(a, function (a, d) {
            return f.inArray(a, b) >= 0 === c;
        });
    }
    function S(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11;
    }
    function K() {
        return !0;
    }
    function J() {
        return !1;
    }
    function n(a, b, c) {
        var d = b + 'defer',
            e = b + 'queue',
            g = b + 'mark',
            h = f._data(a, d);
        h &&
            (c === 'queue' || !f._data(a, e)) &&
            (c === 'mark' || !f._data(a, g)) &&
            setTimeout(function () {
                !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire());
            }, 0);
    }
    function m(a) {
        for (var b in a) {
            if (b === 'data' && f.isEmptyObject(a[b])) continue;
            if (b !== 'toJSON') return !1;
        }
        return !0;
    }
    function l(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = 'data-' + c.replace(k, '-$1').toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == 'string') {
                try {
                    d = d === 'true' ? !0 : d === 'false' ? !1 : d === 'null' ? null : f.isNumeric(d) ? parseFloat(d) : j.test(d) ? f.parseJSON(d) : d;
                } catch (g) {}
                f.data(a, c, d);
            } else d = b;
        }
        return d;
    }
    function h(a) {
        var b = (g[a] = {}),
            c,
            d;
        a = a.split(/\s+/);
        for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
        return b;
    }
    var c = a.document,
        d = a.navigator,
        e = a.location,
        f = (function () {
            function J() {
                if (!e.isReady) {
                    try {
                        c.documentElement.doScroll('left');
                    } catch (a) {
                        setTimeout(J, 1);
                        return;
                    }
                    e.ready();
                }
            }
            var e = function (a, b) {
                    return new e.fn.init(a, b, h);
                },
                f = a.jQuery,
                g = a.$,
                h,
                i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                j = /\S/,
                k = /^\s+/,
                l = /\s+$/,
                m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                n = /^[\],:{}\s]*$/,
                o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                q = /(?:^|:|,)(?:\s*\[)+/g,
                r = /(webkit)[ \/]([\w.]+)/,
                s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                t = /(msie) ([\w.]+)/,
                t2 = /(trident.*rv:)([\w.]+)/,
                u = /(mozilla)(?:.*? rv:([\w.]+))?/,
                v = /-([a-z]|[0-9])/gi,
                w = /^-ms-/,
                x = function (a, b) {
                    return (b + '').toUpperCase();
                },
                y = d.userAgent,
                z,
                A,
                B,
                C = Object.prototype.toString,
                D = Object.prototype.hasOwnProperty,
                E = Array.prototype.push,
                F = Array.prototype.slice,
                G = String.prototype.trim,
                H = Array.prototype.indexOf,
                I = {};
            (e.fn = e.prototype =
                {
                    constructor: e,
                    init: function (a, d, f) {
                        var g, h, j, k;
                        if (!a) return this;
                        if (a.nodeType) {
                            (this.context = this[0] = a), (this.length = 1);
                            return this;
                        }
                        if (a === 'body' && !d && c.body) {
                            (this.context = c), (this[0] = c.body), (this.selector = a), (this.length = 1);
                            return this;
                        }
                        if (typeof a == 'string') {
                            a.charAt(0) !== '<' || a.charAt(a.length - 1) !== '>' || a.length < 3 ? (g = i.exec(a)) : (g = [null, a, null]);
                            if (g && (g[1] || !d)) {
                                if (g[1]) {
                                    (d = d instanceof e ? d[0] : d),
                                        (k = d ? d.ownerDocument || d : c),
                                        (j = m.exec(a)),
                                        j
                                            ? e.isPlainObject(d)
                                                ? ((a = [c.createElement(j[1])]), e.fn.attr.call(a, d, !0))
                                                : (a = [k.createElement(j[1])])
                                            : ((j = e.buildFragment([g[1]], [k])), (a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes));
                                    return e.merge(this, a);
                                }
                                h = c.getElementById(g[2]);
                                if (h && h.parentNode) {
                                    if (h.id !== g[2]) return f.find(a);
                                    (this.length = 1), (this[0] = h);
                                }
                                (this.context = c), (this.selector = a);
                                return this;
                            }
                            return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a);
                        }
                        if (e.isFunction(a)) return f.ready(a);
                        a.selector !== b && ((this.selector = a.selector), (this.context = a.context));
                        return e.makeArray(a, this);
                    },
                    selector: '',
                    jquery: '1.7.1',
                    length: 0,
                    size: function () {
                        return this.length;
                    },
                    toArray: function () {
                        return F.call(this, 0);
                    },
                    get: function (a) {
                        return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a];
                    },
                    pushStack: function (a, b, c) {
                        var d = this.constructor();
                        e.isArray(a) ? E.apply(d, a) : e.merge(d, a),
                            (d.prevObject = this),
                            (d.context = this.context),
                            b === 'find' ? (d.selector = this.selector + (this.selector ? ' ' : '') + c) : b && (d.selector = this.selector + '.' + b + '(' + c + ')');
                        return d;
                    },
                    each: function (a, b) {
                        return e.each(this, a, b);
                    },
                    ready: function (a) {
                        e.bindReady(), A.add(a);
                        return this;
                    },
                    eq: function (a) {
                        a = +a;
                        return a === -1 ? this.slice(a) : this.slice(a, a + 1);
                    },
                    first: function () {
                        return this.eq(0);
                    },
                    last: function () {
                        return this.eq(-1);
                    },
                    slice: function () {
                        return this.pushStack(F.apply(this, arguments), 'slice', F.call(arguments).join(','));
                    },
                    map: function (a) {
                        return this.pushStack(
                            e.map(this, function (b, c) {
                                return a.call(b, c, b);
                            })
                        );
                    },
                    end: function () {
                        return this.prevObject || this.constructor(null);
                    },
                    push: E,
                    sort: [].sort,
                    splice: [].splice
                }),
                (e.fn.init.prototype = e.fn),
                (e.extend = e.fn.extend =
                    function () {
                        var a,
                            c,
                            d,
                            f,
                            g,
                            h,
                            i = arguments[0] || {},
                            j = 1,
                            k = arguments.length,
                            l = !1;
                        typeof i == 'boolean' && ((l = i), (i = arguments[1] || {}), (j = 2)), typeof i != 'object' && !e.isFunction(i) && (i = {}), k === j && ((i = this), --j);
                        for (; j < k; j++)
                            if ((a = arguments[j]) != null)
                                for (c in a) {
                                    (d = i[c]), (f = a[c]);
                                    if (i === f) continue;
                                    l && f && (e.isPlainObject(f) || (g = e.isArray(f)))
                                        ? (g ? ((g = !1), (h = d && e.isArray(d) ? d : [])) : (h = d && e.isPlainObject(d) ? d : {}), (i[c] = e.extend(l, h, f)))
                                        : f !== b && (i[c] = f);
                                }
                        return i;
                    }),
                e.extend({
                    noConflict: function (b) {
                        a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f);
                        return e;
                    },
                    isReady: !1,
                    readyWait: 1,
                    holdReady: function (a) {
                        a ? e.readyWait++ : e.ready(!0);
                    },
                    ready: function (a) {
                        if ((a === !0 && !--e.readyWait) || (a !== !0 && !e.isReady)) {
                            if (!c.body) return setTimeout(e.ready, 1);
                            e.isReady = !0;
                            if (a !== !0 && --e.readyWait > 0) return;
                            A.fireWith(c, [e]), e.fn.trigger && e(c).trigger('ready').off('ready');
                        }
                    },
                    bindReady: function () {
                        if (!A) {
                            A = e.Callbacks('once memory');
                            if (c.readyState === 'complete') return setTimeout(e.ready, 1);
                            if (c.addEventListener) c.addEventListener('DOMContentLoaded', B, !1), a.addEventListener('load', e.ready, !1);
                            else if (c.attachEvent) {
                                c.attachEvent('onreadystatechange', B), a.attachEvent('onload', e.ready);
                                var b = !1;
                                try {
                                    b = a.frameElement == null;
                                } catch (d) {}
                                c.documentElement.doScroll && b && J();
                            }
                        }
                    },
                    isFunction: function (a) {
                        return e.type(a) === 'function';
                    },
                    isArray:
                        Array.isArray ||
                        function (a) {
                            return e.type(a) === 'array';
                        },
                    isWindow: function (a) {
                        return a && typeof a == 'object' && 'setInterval' in a;
                    },
                    isNumeric: function (a) {
                        return !isNaN(parseFloat(a)) && isFinite(a);
                    },
                    type: function (a) {
                        return a == null ? String(a) : I[C.call(a)] || 'object';
                    },
                    isPlainObject: function (a) {
                        if (!a || e.type(a) !== 'object' || a.nodeType || e.isWindow(a)) return !1;
                        try {
                            if (a.constructor && !D.call(a, 'constructor') && !D.call(a.constructor.prototype, 'isPrototypeOf')) return !1;
                        } catch (c) {
                            return !1;
                        }
                        var d;
                        for (d in a);
                        return d === b || D.call(a, d);
                    },
                    isEmptyObject: function (a) {
                        for (var b in a) return !1;
                        return !0;
                    },
                    error: function (a) {
                        throw new Error(a);
                    },
                    parseJSON: function (b) {
                        if (typeof b != 'string' || !b) return null;
                        b = e.trim(b);
                        if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                        if (n.test(b.replace(o, '@').replace(p, ']').replace(q, ''))) return new Function('return ' + b)();
                        e.error('Invalid JSON: ' + b);
                    },
                    parseXML: function (c) {
                        var d, f;
                        try {
                            a.DOMParser
                                ? ((f = new DOMParser()), (d = f.parseFromString(c, 'text/xml')))
                                : ((d = new ActiveXObject('Microsoft.XMLDOM')), (d.async = 'false'), d.loadXML(c));
                        } catch (g) {
                            d = b;
                        }
                        (!d || !d.documentElement || d.getElementsByTagName('parsererror').length) && e.error('Invalid XML: ' + c);
                        return d;
                    },
                    noop: function () {},
                    globalEval: function (b) {
                        b &&
                            j.test(b) &&
                            (
                                a.execScript ||
                                function (b) {
                                    a.eval.call(a, b);
                                }
                            )(b);
                    },
                    camelCase: function (a) {
                        return a.replace(w, 'ms-').replace(v, x);
                    },
                    nodeName: function (a, b) {
                        return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase();
                    },
                    each: function (a, c, d) {
                        var f,
                            g = 0,
                            h = a.length,
                            i = h === b || e.isFunction(a);
                        if (d) {
                            if (i) {
                                for (f in a) if (c.apply(a[f], d) === !1) break;
                            } else for (; g < h; ) if (c.apply(a[g++], d) === !1) break;
                        } else if (i) {
                            for (f in a) if (c.call(a[f], f, a[f]) === !1) break;
                        } else for (; g < h; ) if (c.call(a[g], g, a[g++]) === !1) break;
                        return a;
                    },
                    trim: G
                        ? function (a) {
                              return a == null ? '' : G.call(a);
                          }
                        : function (a) {
                              return a == null ? '' : (a + '').replace(k, '').replace(l, '');
                          },
                    makeArray: function (a, b) {
                        var c = b || [];
                        if (a != null) {
                            var d = e.type(a);
                            a.length == null || d === 'string' || d === 'function' || d === 'regexp' || e.isWindow(a) ? E.call(c, a) : e.merge(c, a);
                        }
                        return c;
                    },
                    inArray: function (a, b, c) {
                        var d;
                        if (b) {
                            if (H) return H.call(b, a, c);
                            (d = b.length), (c = c ? (c < 0 ? Math.max(0, d + c) : c) : 0);
                            for (; c < d; c++) if (c in b && b[c] === a) return c;
                        }
                        return -1;
                    },
                    merge: function (a, c) {
                        var d = a.length,
                            e = 0;
                        if (typeof c.length == 'number') for (var f = c.length; e < f; e++) a[d++] = c[e];
                        else while (c[e] !== b) a[d++] = c[e++];
                        a.length = d;
                        return a;
                    },
                    grep: function (a, b, c) {
                        var d = [],
                            e;
                        c = !!c;
                        for (var f = 0, g = a.length; f < g; f++) (e = !!b(a[f], f)), c !== e && d.push(a[f]);
                        return d;
                    },
                    map: function (a, c, d) {
                        var f,
                            g,
                            h = [],
                            i = 0,
                            j = a.length,
                            k = a instanceof e || (j !== b && typeof j == 'number' && ((j > 0 && a[0] && a[j - 1]) || j === 0 || e.isArray(a)));
                        if (k) for (; i < j; i++) (f = c(a[i], i, d)), f != null && (h[h.length] = f);
                        else for (g in a) (f = c(a[g], g, d)), f != null && (h[h.length] = f);
                        return h.concat.apply([], h);
                    },
                    guid: 1,
                    proxy: function (a, c) {
                        if (typeof c == 'string') {
                            var d = a[c];
                            (c = a), (a = d);
                        }
                        if (!e.isFunction(a)) return b;
                        var f = F.call(arguments, 2),
                            g = function () {
                                return a.apply(c, f.concat(F.call(arguments)));
                            };
                        g.guid = a.guid = a.guid || g.guid || e.guid++;
                        return g;
                    },
                    access: function (a, c, d, f, g, h) {
                        var i = a.length;
                        if (typeof c == 'object') {
                            for (var j in c) e.access(a, j, c[j], f, g, d);
                            return a;
                        }
                        if (d !== b) {
                            f = !h && f && e.isFunction(d);
                            for (var k = 0; k < i; k++) g(a[k], c, f ? d.call(a[k], k, g(a[k], c)) : d, h);
                            return a;
                        }
                        return i ? g(a[0], c) : b;
                    },
                    now: function () {
                        return new Date().getTime();
                    },
                    uaMatch: function (a) {
                        a = a.toLowerCase();
                        var b = r.exec(a) || s.exec(a) || t.exec(a) || t2.exec(a) || (a.indexOf('compatible') < 0 && u.exec(a)) || [];
                        if (b.length > 0 && b[1].indexOf('trident') > -1) {
                            b[1] = 'msie';
                        }
                        return { browser: b[1] || '', version: b[2] || '0' };
                    },
                    sub: function () {
                        function a(b, c) {
                            return new a.fn.init(b, c);
                        }
                        e.extend(!0, a, this),
                            (a.superclass = this),
                            (a.fn = a.prototype = this()),
                            (a.fn.constructor = a),
                            (a.sub = this.sub),
                            (a.fn.init = function (d, f) {
                                f && f instanceof e && !(f instanceof a) && (f = a(f));
                                return e.fn.init.call(this, d, f, b);
                            }),
                            (a.fn.init.prototype = a.fn);
                        var b = a(c);
                        return a;
                    },
                    browser: {}
                }),
                e.each('Boolean Number String Function Array Date RegExp Object'.split(' '), function (a, b) {
                    I['[object ' + b + ']'] = b.toLowerCase();
                }),
                (z = e.uaMatch(y)),
                z.browser && ((e.browser[z.browser] = !0), (e.browser.version = z.version)),
                e.browser.webkit && (e.browser.safari = !0),
                j.test(' ') && ((k = /^[\s\xA0]+/), (l = /[\s\xA0]+$/)),
                (h = e(c)),
                c.addEventListener
                    ? (B = function () {
                          c.removeEventListener('DOMContentLoaded', B, !1), e.ready();
                      })
                    : c.attachEvent &&
                      (B = function () {
                          c.readyState === 'complete' && (c.detachEvent('onreadystatechange', B), e.ready());
                      });
            return e;
        })(),
        g = {};
    f.Callbacks = function (a) {
        a = a ? g[a] || h(a) : {};
        var c = [],
            d = [],
            e,
            i,
            j,
            k,
            l,
            m = function (b) {
                var d, e, g, h, i;
                for (d = 0, e = b.length; d < e; d++) (g = b[d]), (h = f.type(g)), h === 'array' ? m(g) : h === 'function' && (!a.unique || !o.has(g)) && c.push(g);
            },
            n = function (b, f) {
                (f = f || []), (e = !a.memory || [b, f]), (i = !0), (l = j || 0), (j = 0), (k = c.length);
                for (; c && l < k; l++)
                    if (c[l].apply(b, f) === !1 && a.stopOnFalse) {
                        e = !0;
                        break;
                    }
                (i = !1), c && (a.once ? (e === !0 ? o.disable() : (c = [])) : d && d.length && ((e = d.shift()), o.fireWith(e[0], e[1])));
            },
            o = {
                add: function () {
                    if (c) {
                        var a = c.length;
                        m(arguments), i ? (k = c.length) : e && e !== !0 && ((j = a), n(e[0], e[1]));
                    }
                    return this;
                },
                remove: function () {
                    if (c) {
                        var b = arguments,
                            d = 0,
                            e = b.length;
                        for (; d < e; d++)
                            for (var f = 0; f < c.length; f++)
                                if (b[d] === c[f]) {
                                    i && f <= k && (k--, f <= l && l--), c.splice(f--, 1);
                                    if (a.unique) break;
                                }
                    }
                    return this;
                },
                has: function (a) {
                    if (c) {
                        var b = 0,
                            d = c.length;
                        for (; b < d; b++) if (a === c[b]) return !0;
                    }
                    return !1;
                },
                empty: function () {
                    c = [];
                    return this;
                },
                disable: function () {
                    c = d = e = b;
                    return this;
                },
                disabled: function () {
                    return !c;
                },
                lock: function () {
                    (d = b), (!e || e === !0) && o.disable();
                    return this;
                },
                locked: function () {
                    return !d;
                },
                fireWith: function (b, c) {
                    d && (i ? a.once || d.push([b, c]) : (!a.once || !e) && n(b, c));
                    return this;
                },
                fire: function () {
                    o.fireWith(this, arguments);
                    return this;
                },
                fired: function () {
                    return !!e;
                }
            };
        return o;
    };
    var i = [].slice;
    f.extend({
        Deferred: function (a) {
            var b = f.Callbacks('once memory'),
                c = f.Callbacks('once memory'),
                d = f.Callbacks('memory'),
                e = 'pending',
                g = { resolve: b, reject: c, notify: d },
                h = {
                    done: b.add,
                    fail: c.add,
                    progress: d.add,
                    state: function () {
                        return e;
                    },
                    isResolved: b.fired,
                    isRejected: c.fired,
                    then: function (a, b, c) {
                        i.done(a).fail(b).progress(c);
                        return this;
                    },
                    always: function () {
                        i.done.apply(i, arguments).fail.apply(i, arguments);
                        return this;
                    },
                    pipe: function (a, b, c) {
                        return f
                            .Deferred(function (d) {
                                f.each({ done: [a, 'resolve'], fail: [b, 'reject'], progress: [c, 'notify'] }, function (a, b) {
                                    var c = b[0],
                                        e = b[1],
                                        g;
                                    f.isFunction(c)
                                        ? i[a](function () {
                                              (g = c.apply(this, arguments)),
                                                  g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + 'With'](this === i ? d : this, [g]);
                                          })
                                        : i[a](d[e]);
                                });
                            })
                            .promise();
                    },
                    promise: function (a) {
                        if (a == null) a = h;
                        else for (var b in h) a[b] = h[b];
                        return a;
                    }
                },
                i = h.promise({}),
                j;
            for (j in g) (i[j] = g[j].fire), (i[j + 'With'] = g[j].fireWith);
            i
                .done(
                    function () {
                        e = 'resolved';
                    },
                    c.disable,
                    d.lock
                )
                .fail(
                    function () {
                        e = 'rejected';
                    },
                    b.disable,
                    d.lock
                ),
                a && a.call(i, i);
            return i;
        },
        when: function (a) {
            function m(a) {
                return function (b) {
                    (e[a] = arguments.length > 1 ? i.call(arguments, 0) : b), j.notifyWith(k, e);
                };
            }
            function l(a) {
                return function (c) {
                    (b[a] = arguments.length > 1 ? i.call(arguments, 0) : c), --g || j.resolveWith(j, b);
                };
            }
            var b = i.call(arguments, 0),
                c = 0,
                d = b.length,
                e = Array(d),
                g = d,
                h = d,
                j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(),
                k = j.promise();
            if (d > 1) {
                for (; c < d; c++) b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g;
                g || j.resolveWith(j, b);
            } else j !== a && j.resolveWith(j, d ? [a] : []);
            return k;
        }
    }),
        (f.support = (function () {
            var b,
                d,
                e,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o,
                p,
                q = c.createElement('div'),
                r = c.documentElement;
            q.setAttribute('className', 't'),
                (q.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>"),
                (d = q.getElementsByTagName('*')),
                (e = q.getElementsByTagName('a')[0]);
            if (!d || !d.length || !e) return {};
            (g = c.createElement('select')),
                (h = g.appendChild(c.createElement('option'))),
                (i = q.getElementsByTagName('input')[0]),
                (b = {
                    leadingWhitespace: q.firstChild.nodeType === 3,
                    tbody: !q.getElementsByTagName('tbody').length,
                    htmlSerialize: !!q.getElementsByTagName('link').length,
                    style: /top/.test(e.getAttribute('style')),
                    hrefNormalized: e.getAttribute('href') === '/a',
                    opacity: /^0.55/.test(e.style.opacity),
                    cssFloat: !!e.style.cssFloat,
                    checkOn: i.value === 'on',
                    optSelected: h.selected,
                    getSetAttribute: q.className !== 't',
                    enctype: !!c.createElement('form').enctype,
                    html5Clone: c.createElement('nav').cloneNode(!0).outerHTML !== '<:nav></:nav>',
                    submitBubbles: !0,
                    changeBubbles: !0,
                    focusinBubbles: !1,
                    deleteExpando: !0,
                    noCloneEvent: !0,
                    inlineBlockNeedsLayout: !1,
                    shrinkWrapBlocks: !1,
                    reliableMarginRight: !0
                }),
                (i.checked = !0),
                (b.noCloneChecked = i.cloneNode(!0).checked),
                (g.disabled = !0),
                (b.optDisabled = !h.disabled);
            try {
                delete q.test;
            } catch (s) {
                b.deleteExpando = !1;
            }
            !q.addEventListener &&
                q.attachEvent &&
                q.fireEvent &&
                (q.attachEvent('onclick', function () {
                    b.noCloneEvent = !1;
                }),
                q.cloneNode(!0).fireEvent('onclick')),
                (i = c.createElement('input')),
                (i.value = 't'),
                i.setAttribute('type', 'radio'),
                (b.radioValue = i.value === 't'),
                i.setAttribute('checked', 'checked'),
                q.appendChild(i),
                (k = c.createDocumentFragment()),
                k.appendChild(q.lastChild),
                (b.checkClone = k.cloneNode(!0).cloneNode(!0).lastChild.checked),
                (b.appendChecked = i.checked),
                k.removeChild(i),
                k.appendChild(q),
                (q.innerHTML = ''),
                a.getComputedStyle &&
                    ((j = c.createElement('div')),
                    (j.style.width = '0'),
                    (j.style.marginRight = '0'),
                    (q.style.width = '2px'),
                    q.appendChild(j),
                    (b.reliableMarginRight = (parseInt((a.getComputedStyle(j, null) || { marginRight: 0 }).marginRight, 10) || 0) === 0));
            if (q.attachEvent)
                for (o in { submit: 1, change: 1, focusin: 1 })
                    (n = 'on' + o), (p = n in q), p || (q.setAttribute(n, 'return;'), (p = typeof q[n] == 'function')), (b[o + 'Bubbles'] = p);
            k.removeChild(q),
                (k = g = h = j = q = i = null),
                f(function () {
                    var a,
                        d,
                        e,
                        g,
                        h,
                        i,
                        j,
                        k,
                        m,
                        n,
                        o,
                        r = c.getElementsByTagName('body')[0];
                    !r ||
                        ((j = 1),
                        (k = 'position:absolute;top:0;left:0;width:1px;height:1px;margin:0;'),
                        (m = 'visibility:hidden;border:0;'),
                        (n = "style='" + k + "border:5px solid #000;padding:0;'"),
                        (o = '<div ' + n + '><div></div></div>' + '<table ' + n + " cellpadding='0' cellspacing='0'>" + '<tr><td></td></tr></table>'),
                        (a = c.createElement('div')),
                        (a.style.cssText = m + 'width:0;height:0;position:static;top:0;margin-top:' + j + 'px'),
                        r.insertBefore(a, r.firstChild),
                        (q = c.createElement('div')),
                        a.appendChild(q),
                        (q.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>"),
                        (l = q.getElementsByTagName('td')),
                        (p = l[0].offsetHeight === 0),
                        (l[0].style.display = ''),
                        (l[1].style.display = 'none'),
                        (b.reliableHiddenOffsets = p && l[0].offsetHeight === 0),
                        (q.innerHTML = ''),
                        (q.style.width = q.style.paddingLeft = '1px'),
                        (f.boxModel = b.boxModel = q.offsetWidth === 2),
                        typeof q.style.zoom != 'undefined' &&
                            ((q.style.display = 'inline'),
                            (q.style.zoom = 1),
                            (b.inlineBlockNeedsLayout = q.offsetWidth === 2),
                            (q.style.display = ''),
                            (q.innerHTML = "<div style='width:4px;'></div>"),
                            (b.shrinkWrapBlocks = q.offsetWidth !== 2)),
                        (q.style.cssText = k + m),
                        (q.innerHTML = o),
                        (d = q.firstChild),
                        (e = d.firstChild),
                        (h = d.nextSibling.firstChild.firstChild),
                        (i = { doesNotAddBorder: e.offsetTop !== 5, doesAddBorderForTableAndCells: h.offsetTop === 5 }),
                        (e.style.position = 'fixed'),
                        (e.style.top = '20px'),
                        (i.fixedPosition = e.offsetTop === 20 || e.offsetTop === 15),
                        (e.style.position = e.style.top = ''),
                        (d.style.overflow = 'hidden'),
                        (d.style.position = 'relative'),
                        (i.subtractsBorderForOverflowNotVisible = e.offsetTop === -5),
                        (i.doesNotIncludeMarginInBodyOffset = r.offsetTop !== j),
                        r.removeChild(a),
                        (q = a = null),
                        f.extend(b, i));
                });
            return b;
        })());
    var j = /^(?:\{.*\}|\[.*\])$/,
        k = /([A-Z])/g;
    f.extend({
        cache: {},
        uuid: 0,
        expando: 'jQuery' + (f.fn.jquery + Math.random()).replace(/\D/g, ''),
        noData: { embed: !0, object: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000', applet: !0 },
        hasData: function (a) {
            a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
            return !!a && !m(a);
        },
        data: function (a, c, d, e) {
            if (!!f.acceptData(a)) {
                var g,
                    h,
                    i,
                    j = f.expando,
                    k = typeof c == 'string',
                    l = a.nodeType,
                    m = l ? f.cache : a,
                    n = l ? a[j] : a[j] && j,
                    o = c === 'events';
                if ((!n || !m[n] || (!o && !e && !m[n].data)) && k && d === b) return;
                n || (l ? (a[j] = n = ++f.uuid) : (n = j)), m[n] || ((m[n] = {}), l || (m[n].toJSON = f.noop));
                if (typeof c == 'object' || typeof c == 'function') e ? (m[n] = f.extend(m[n], c)) : (m[n].data = f.extend(m[n].data, c));
                (g = h = m[n]), e || (h.data || (h.data = {}), (h = h.data)), d !== b && (h[f.camelCase(c)] = d);
                if (o && !h[c]) return g.events;
                k ? ((i = h[c]), i == null && (i = h[f.camelCase(c)])) : (i = h);
                return i;
            }
        },
        removeData: function (a, b, c) {
            if (!!f.acceptData(a)) {
                var d,
                    e,
                    g,
                    h = f.expando,
                    i = a.nodeType,
                    j = i ? f.cache : a,
                    k = i ? a[h] : h;
                if (!j[k]) return;
                if (b) {
                    d = c ? j[k] : j[k].data;
                    if (d) {
                        f.isArray(b) || (b in d ? (b = [b]) : ((b = f.camelCase(b)), b in d ? (b = [b]) : (b = b.split(' '))));
                        for (e = 0, g = b.length; e < g; e++) delete d[b[e]];
                        if (!(c ? m : f.isEmptyObject)(d)) return;
                    }
                }
                if (!c) {
                    delete j[k].data;
                    if (!m(j[k])) return;
                }
                f.support.deleteExpando || !j.setInterval ? delete j[k] : (j[k] = null),
                    i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : (a[h] = null));
            }
        },
        _data: function (a, b, c) {
            return f.data(a, b, c, !0);
        },
        acceptData: function (a) {
            if (a.nodeName) {
                var b = f.noData[a.nodeName.toLowerCase()];
                if (b) return b !== !0 && a.getAttribute('classid') === b;
            }
            return !0;
        }
    }),
        f.fn.extend({
            data: function (a, c) {
                var d,
                    e,
                    g,
                    h = null;
                if (typeof a == 'undefined') {
                    if (this.length) {
                        h = f.data(this[0]);
                        if (this[0].nodeType === 1 && !f._data(this[0], 'parsedAttrs')) {
                            e = this[0].attributes;
                            for (var i = 0, j = e.length; i < j; i++) (g = e[i].name), g.indexOf('data-') === 0 && ((g = f.camelCase(g.substring(5))), l(this[0], g, h[g]));
                            f._data(this[0], 'parsedAttrs', !0);
                        }
                    }
                    return h;
                }
                if (typeof a == 'object')
                    return this.each(function () {
                        f.data(this, a);
                    });
                (d = a.split('.')), (d[1] = d[1] ? '.' + d[1] : '');
                if (c === b) {
                    (h = this.triggerHandler('getData' + d[1] + '!', [d[0]])), h === b && this.length && ((h = f.data(this[0], a)), (h = l(this[0], a, h)));
                    return h === b && d[1] ? this.data(d[0]) : h;
                }
                return this.each(function () {
                    var b = f(this),
                        e = [d[0], c];
                    b.triggerHandler('setData' + d[1] + '!', e), f.data(this, a, c), b.triggerHandler('changeData' + d[1] + '!', e);
                });
            },
            removeData: function (a) {
                return this.each(function () {
                    f.removeData(this, a);
                });
            }
        }),
        f.extend({
            _mark: function (a, b) {
                a && ((b = (b || 'fx') + 'mark'), f._data(a, b, (f._data(a, b) || 0) + 1));
            },
            _unmark: function (a, b, c) {
                a !== !0 && ((c = b), (b = a), (a = !1));
                if (b) {
                    c = c || 'fx';
                    var d = c + 'mark',
                        e = a ? 0 : (f._data(b, d) || 1) - 1;
                    e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, 'mark'));
                }
            },
            queue: function (a, b, c) {
                var d;
                if (a) {
                    (b = (b || 'fx') + 'queue'), (d = f._data(a, b)), c && (!d || f.isArray(c) ? (d = f._data(a, b, f.makeArray(c))) : d.push(c));
                    return d || [];
                }
            },
            dequeue: function (a, b) {
                b = b || 'fx';
                var c = f.queue(a, b),
                    d = c.shift(),
                    e = {};
                d === 'inprogress' && (d = c.shift()),
                    d &&
                        (b === 'fx' && c.unshift('inprogress'),
                        f._data(a, b + '.run', e),
                        d.call(
                            a,
                            function () {
                                f.dequeue(a, b);
                            },
                            e
                        )),
                    c.length || (f.removeData(a, b + 'queue ' + b + '.run', !0), n(a, b, 'queue'));
            }
        }),
        f.fn.extend({
            queue: function (a, c) {
                typeof a != 'string' && ((c = a), (a = 'fx'));
                if (c === b) return f.queue(this[0], a);
                return this.each(function () {
                    var b = f.queue(this, a, c);
                    a === 'fx' && b[0] !== 'inprogress' && f.dequeue(this, a);
                });
            },
            dequeue: function (a) {
                return this.each(function () {
                    f.dequeue(this, a);
                });
            },
            delay: function (a, b) {
                (a = f.fx ? f.fx.speeds[a] || a : a), (b = b || 'fx');
                return this.queue(b, function (b, c) {
                    var d = setTimeout(b, a);
                    c.stop = function () {
                        clearTimeout(d);
                    };
                });
            },
            clearQueue: function (a) {
                return this.queue(a || 'fx', []);
            },
            promise: function (a, c) {
                function m() {
                    --h || d.resolveWith(e, [e]);
                }
                typeof a != 'string' && ((c = a), (a = b)), (a = a || 'fx');
                var d = f.Deferred(),
                    e = this,
                    g = e.length,
                    h = 1,
                    i = a + 'defer',
                    j = a + 'queue',
                    k = a + 'mark',
                    l;
                while (g--)
                    if ((l = f.data(e[g], i, b, !0) || ((f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks('once memory'), !0)))) h++, l.add(m);
                m();
                return d.promise();
            }
        });
    var o = /[\n\t\r]/g,
        p = /\s+/,
        q = /\r/g,
        r = /^(?:button|input)$/i,
        s = /^(?:button|input|object|select|textarea)$/i,
        t = /^a(?:rea)?$/i,
        u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        v = f.support.getSetAttribute,
        w,
        x,
        y;
    f.fn.extend({
        attr: function (a, b) {
            return f.access(this, a, b, !0, f.attr);
        },
        removeAttr: function (a) {
            return this.each(function () {
                f.removeAttr(this, a);
            });
        },
        prop: function (a, b) {
            return f.access(this, a, b, !0, f.prop);
        },
        removeProp: function (a) {
            a = f.propFix[a] || a;
            return this.each(function () {
                try {
                    (this[a] = b), delete this[a];
                } catch (c) {}
            });
        },
        addClass: function (a) {
            var b, c, d, e, g, h, i;
            if (f.isFunction(a))
                return this.each(function (b) {
                    f(this).addClass(a.call(this, b, this.className));
                });
            if (a && typeof a == 'string') {
                b = a.split(p);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1)
                        if (!e.className && b.length === 1) e.className = a;
                        else {
                            g = ' ' + e.className + ' ';
                            for (h = 0, i = b.length; h < i; h++) ~g.indexOf(' ' + b[h] + ' ') || (g += b[h] + ' ');
                            e.className = f.trim(g);
                        }
                }
            }
            return this;
        },
        removeClass: function (a) {
            var c, d, e, g, h, i, j;
            if (f.isFunction(a))
                return this.each(function (b) {
                    f(this).removeClass(a.call(this, b, this.className));
                });
            if ((a && typeof a == 'string') || a === b) {
                c = (a || '').split(p);
                for (d = 0, e = this.length; d < e; d++) {
                    g = this[d];
                    if (g.nodeType === 1 && g.className)
                        if (a) {
                            h = (' ' + g.className + ' ').replace(o, ' ');
                            for (i = 0, j = c.length; i < j; i++) h = h.replace(' ' + c[i] + ' ', ' ');
                            g.className = f.trim(h);
                        } else g.className = '';
                }
            }
            return this;
        },
        toggleClass: function (a, b) {
            var c = typeof a,
                d = typeof b == 'boolean';
            if (f.isFunction(a))
                return this.each(function (c) {
                    f(this).toggleClass(a.call(this, c, this.className, b), b);
                });
            return this.each(function () {
                if (c === 'string') {
                    var e,
                        g = 0,
                        h = f(this),
                        i = b,
                        j = a.split(p);
                    while ((e = j[g++])) (i = d ? i : !h.hasClass(e)), h[i ? 'addClass' : 'removeClass'](e);
                } else if (c === 'undefined' || c === 'boolean') this.className && f._data(this, '__className__', this.className), (this.className = this.className || a === !1 ? '' : f._data(this, '__className__') || '');
            });
        },
        hasClass: function (a) {
            var b = ' ' + a + ' ',
                c = 0,
                d = this.length;
            for (; c < d; c++) if (this[c].nodeType === 1 && (' ' + this[c].className + ' ').replace(o, ' ').indexOf(b) > -1) return !0;
            return !1;
        },
        val: function (a) {
            var c,
                d,
                e,
                g = this[0];
            {
                if (!!arguments.length) {
                    e = f.isFunction(a);
                    return this.each(function (d) {
                        var g = f(this),
                            h;
                        if (this.nodeType === 1) {
                            e ? (h = a.call(this, d, g.val())) : (h = a),
                                h == null
                                    ? (h = '')
                                    : typeof h == 'number'
                                    ? (h += '')
                                    : f.isArray(h) &&
                                      (h = f.map(h, function (a) {
                                          return a == null ? '' : a + '';
                                      })),
                                (c = f.valHooks[this.nodeName.toLowerCase()] || f.valHooks[this.type]);
                            if (!c || !('set' in c) || c.set(this, h, 'value') === b) this.value = h;
                        }
                    });
                }
                if (g) {
                    c = f.valHooks[g.nodeName.toLowerCase()] || f.valHooks[g.type];
                    if (c && 'get' in c && (d = c.get(g, 'value')) !== b) return d;
                    d = g.value;
                    return typeof d == 'string' ? d.replace(q, '') : d == null ? '' : d;
                }
            }
        }
    }),
        f.extend({
            valHooks: {
                option: {
                    get: function (a) {
                        var b = a.attributes.value;
                        return !b || b.specified ? a.value : a.text;
                    }
                },
                select: {
                    get: function (a) {
                        var b,
                            c,
                            d,
                            e,
                            g = a.selectedIndex,
                            h = [],
                            i = a.options,
                            j = a.type === 'select-one';
                        if (g < 0) return null;
                        (c = j ? g : 0), (d = j ? g + 1 : i.length);
                        for (; c < d; c++) {
                            e = i[c];
                            if (
                                e.selected &&
                                (f.support.optDisabled ? !e.disabled : e.getAttribute('disabled') === null) &&
                                (!e.parentNode.disabled || !f.nodeName(e.parentNode, 'optgroup'))
                            ) {
                                b = f(e).val();
                                if (j) return b;
                                h.push(b);
                            }
                        }
                        if (j && !h.length && i.length) return f(i[g]).val();
                        return h;
                    },
                    set: function (a, b) {
                        var c = f.makeArray(b);
                        f(a)
                            .find('option')
                            .each(function () {
                                this.selected = f.inArray(f(this).val(), c) >= 0;
                            }),
                            c.length || (a.selectedIndex = -1);
                        return c;
                    }
                }
            },
            attrFn: { val: !0, css: !0, html: !0, text: !0, data: !0, width: !0, height: !0, offset: !0 },
            attr: function (a, c, d, e) {
                var g,
                    h,
                    i,
                    j = a.nodeType;
                if (!!a && j !== 3 && j !== 8 && j !== 2) {
                    if (e && c in f.attrFn) return f(a)[c](d);
                    if (typeof a.getAttribute == 'undefined') return f.prop(a, c, d);
                    (i = j !== 1 || !f.isXMLDoc(a)), i && ((c = c.toLowerCase()), (h = f.attrHooks[c] || (u.test(c) ? x : w)));
                    if (d !== b) {
                        if (d === null) {
                            f.removeAttr(a, c);
                            return;
                        }
                        if (h && 'set' in h && i && (g = h.set(a, d, c)) !== b) return g;
                        a.setAttribute(c, '' + d);
                        return d;
                    }
                    if (h && 'get' in h && i && (g = h.get(a, c)) !== null) return g;
                    g = a.getAttribute(c);
                    return g === null ? b : g;
                }
            },
            removeAttr: function (a, b) {
                var c,
                    d,
                    e,
                    g,
                    h = 0;
                if (b && a.nodeType === 1) {
                    (d = b.toLowerCase().split(p)), (g = d.length);
                    for (; h < g; h++) (e = d[h]), e && ((c = f.propFix[e] || e), f.attr(a, e, ''), a.removeAttribute(v ? e : c), u.test(e) && c in a && (a[c] = !1));
                }
            },
            attrHooks: {
                type: {
                    set: function (a, b) {
                        if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed");
                        else if (!f.support.radioValue && b === 'radio' && f.nodeName(a, 'input')) {
                            var c = a.value;
                            a.setAttribute('type', b), c && (a.value = c);
                            return b;
                        }
                    }
                },
                value: {
                    get: function (a, b) {
                        if (w && f.nodeName(a, 'button')) return w.get(a, b);
                        return b in a ? a.value : null;
                    },
                    set: function (a, b, c) {
                        if (w && f.nodeName(a, 'button')) return w.set(a, b, c);
                        a.value = b;
                    }
                }
            },
            propFix: {
                tabindex: 'tabIndex',
                readonly: 'readOnly',
                for: 'htmlFor',
                class: 'className',
                maxlength: 'maxLength',
                cellspacing: 'cellSpacing',
                cellpadding: 'cellPadding',
                rowspan: 'rowSpan',
                colspan: 'colSpan',
                usemap: 'useMap',
                frameborder: 'frameBorder',
                contenteditable: 'contentEditable'
            },
            prop: function (a, c, d) {
                var e,
                    g,
                    h,
                    i = a.nodeType;
                if (!!a && i !== 3 && i !== 8 && i !== 2) {
                    (h = i !== 1 || !f.isXMLDoc(a)), h && ((c = f.propFix[c] || c), (g = f.propHooks[c]));
                    return d !== b ? (g && 'set' in g && (e = g.set(a, d, c)) !== b ? e : (a[c] = d)) : g && 'get' in g && (e = g.get(a, c)) !== null ? e : a[c];
                }
            },
            propHooks: {
                tabIndex: {
                    get: function (a) {
                        var c = a.getAttributeNode('tabindex');
                        return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || (t.test(a.nodeName) && a.href) ? 0 : b;
                    }
                }
            }
        }),
        (f.attrHooks.tabindex = f.propHooks.tabIndex),
        (x = {
            get: function (a, c) {
                var d,
                    e = f.prop(a, c);
                return e === !0 || (typeof e != 'boolean' && (d = a.getAttributeNode(c)) && d.nodeValue !== !1) ? c.toLowerCase() : b;
            },
            set: function (a, b, c) {
                var d;
                b === !1 ? f.removeAttr(a, c) : ((d = f.propFix[c] || c), d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase()));
                return c;
            }
        }),
        v ||
            ((y = { name: !0, id: !0 }),
            (w = f.valHooks.button =
                {
                    get: function (a, c) {
                        var d;
                        d = a.getAttributeNode(c);
                        return d && (y[c] ? d.nodeValue !== '' : d.specified) ? d.nodeValue : b;
                    },
                    set: function (a, b, d) {
                        var e = a.getAttributeNode(d);
                        e || ((e = c.createAttribute(d)), a.setAttributeNode(e));
                        return (e.nodeValue = b + '');
                    }
                }),
            (f.attrHooks.tabindex.set = w.set),
            f.each(['width', 'height'], function (a, b) {
                f.attrHooks[b] = f.extend(f.attrHooks[b], {
                    set: function (a, c) {
                        if (c === '') {
                            a.setAttribute(b, 'auto');
                            return c;
                        }
                    }
                });
            }),
            (f.attrHooks.contenteditable = {
                get: w.get,
                set: function (a, b, c) {
                    b === '' && (b = 'false'), w.set(a, b, c);
                }
            })),
        f.support.hrefNormalized ||
            f.each(['href', 'src', 'width', 'height'], function (a, c) {
                f.attrHooks[c] = f.extend(f.attrHooks[c], {
                    get: function (a) {
                        var d = a.getAttribute(c, 2);
                        return d === null ? b : d;
                    }
                });
            }),
        f.support.style ||
            (f.attrHooks.style = {
                get: function (a) {
                    return a.style.cssText.toLowerCase() || b;
                },
                set: function (a, b) {
                    return (a.style.cssText = '' + b);
                }
            }),
        f.support.optSelected ||
            (f.propHooks.selected = f.extend(f.propHooks.selected, {
                get: function (a) {
                    var b = a.parentNode;
                    b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
                    return null;
                }
            })),
        f.support.enctype || (f.propFix.enctype = 'encoding'),
        f.support.checkOn ||
            f.each(['radio', 'checkbox'], function () {
                f.valHooks[this] = {
                    get: function (a) {
                        return a.getAttribute('value') === null ? 'on' : a.value;
                    }
                };
            }),
        f.each(['radio', 'checkbox'], function () {
            f.valHooks[this] = f.extend(f.valHooks[this], {
                set: function (a, b) {
                    if (f.isArray(b)) return (a.checked = f.inArray(f(a).val(), b) >= 0);
                }
            });
        });
    var z = /^(?:textarea|input|select)$/i,
        A = /^([^\.]*)?(?:\.(.+))?$/,
        B = /\bhover(\.\S+)?\b/,
        C = /^key/,
        D = /^(?:mouse|contextmenu)|click/,
        E = /^(?:focusinfocus|focusoutblur)$/,
        F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        G = function (a) {
            var b = F.exec(a);
            b && ((b[1] = (b[1] || '').toLowerCase()), (b[3] = b[3] && new RegExp('(?:^|\\s)' + b[3] + '(?:\\s|$)')));
            return b;
        },
        H = function (a, b) {
            var c = a.attributes || {};
            return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c['class'] || {}).value));
        },
        I = function (a) {
            return f.event.special.hover ? a : a.replace(B, 'mouseenter$1 mouseleave$1');
        };
    (f.event = {
        add: function (a, c, d, e, g) {
            var h, i, j, k, l, m, n, o, p, q, r, s;
            if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
                d.handler && ((p = d), (d = p.handler)),
                    d.guid || (d.guid = f.guid++),
                    (j = h.events),
                    j || (h.events = j = {}),
                    (i = h.handle),
                    i ||
                        ((h.handle = i =
                            function (a) {
                                return typeof f != 'undefined' && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b;
                            }),
                        (i.elem = a)),
                    (c = f.trim(I(c)).split(' '));
                for (k = 0; k < c.length; k++) {
                    (l = A.exec(c[k]) || []),
                        (m = l[1]),
                        (n = (l[2] || '').split('.').sort()),
                        (s = f.event.special[m] || {}),
                        (m = (g ? s.delegateType : s.bindType) || m),
                        (s = f.event.special[m] || {}),
                        (o = f.extend({ type: m, origType: l[1], data: e, handler: d, guid: d.guid, selector: g, quick: G(g), namespace: n.join('.') }, p)),
                        (r = j[m]);
                    if (!r) {
                        (r = j[m] = []), (r.delegateCount = 0);
                        if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent('on' + m, i);
                    }
                    s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), (f.event.global[m] = !0);
                }
                a = null;
            }
        },
        global: {},
        remove: function (a, b, c, d, e) {
            var g = f.hasData(a) && f._data(a),
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o,
                p,
                q,
                r,
                s;
            if (!!g && !!(o = g.events)) {
                b = f.trim(I(b || '')).split(' ');
                for (h = 0; h < b.length; h++) {
                    (i = A.exec(b[h]) || []), (j = k = i[1]), (l = i[2]);
                    if (!j) {
                        for (j in o) f.event.remove(a, j + b[h], c, d, !0);
                        continue;
                    }
                    (p = f.event.special[j] || {}),
                        (j = (d ? p.delegateType : p.bindType) || j),
                        (r = o[j] || []),
                        (m = r.length),
                        (l = l ? new RegExp('(^|\\.)' + l.split('.').sort().join('\\.(?:.*\\.)?') + '(\\.|$)') : null);
                    for (n = 0; n < r.length; n++)
                        (s = r[n]),
                            (e || k === s.origType) &&
                                (!c || c.guid === s.guid) &&
                                (!l || l.test(s.namespace)) &&
                                (!d || d === s.selector || (d === '**' && s.selector)) &&
                                (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s));
                    r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j]);
                }
                f.isEmptyObject(o) && ((q = g.handle), q && (q.elem = null), f.removeData(a, ['events', 'handle'], !0));
            }
        },
        customEvent: { getData: !0, setData: !0, changeData: !0 },
        trigger: function (c, d, e, g) {
            if (!e || (e.nodeType !== 3 && e.nodeType !== 8)) {
                var h = c.type || c,
                    i = [],
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p,
                    q,
                    r,
                    s;
                if (E.test(h + f.event.triggered)) return;
                h.indexOf('!') >= 0 && ((h = h.slice(0, -1)), (k = !0)), h.indexOf('.') >= 0 && ((i = h.split('.')), (h = i.shift()), i.sort());
                if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return;
                (c = typeof c == 'object' ? (c[f.expando] ? c : new f.Event(h, c)) : new f.Event(h)),
                    (c.type = h),
                    (c.isTrigger = !0),
                    (c.exclusive = k),
                    (c.namespace = i.join('.')),
                    (c.namespace_re = c.namespace ? new RegExp('(^|\\.)' + i.join('\\.(?:.*\\.)?') + '(\\.|$)') : null),
                    (o = h.indexOf(':') < 0 ? 'on' + h : '');
                if (!e) {
                    j = f.cache;
                    for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0);
                    return;
                }
                (c.result = b), c.target || (c.target = e), (d = d != null ? f.makeArray(d) : []), d.unshift(c), (p = f.event.special[h] || {});
                if (p.trigger && p.trigger.apply(e, d) === !1) return;
                r = [[e, p.bindType || h]];
                if (!g && !p.noBubble && !f.isWindow(e)) {
                    (s = p.delegateType || h), (m = E.test(s + h) ? e : e.parentNode), (n = null);
                    for (; m; m = m.parentNode) r.push([m, s]), (n = m);
                    n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s]);
                }
                for (l = 0; l < r.length && !c.isPropagationStopped(); l++)
                    (m = r[l][0]),
                        (c.type = r[l][1]),
                        (q = (f._data(m, 'events') || {})[c.type] && f._data(m, 'handle')),
                        q && q.apply(m, d),
                        (q = o && m[o]),
                        q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault();
                (c.type = h),
                    !g &&
                        !c.isDefaultPrevented() &&
                        (!p._default || p._default.apply(e.ownerDocument, d) === !1) &&
                        (h !== 'click' || !f.nodeName(e, 'a')) &&
                        f.acceptData(e) &&
                        o &&
                        e[h] &&
                        ((h !== 'focus' && h !== 'blur') || c.target.offsetWidth !== 0) &&
                        !f.isWindow(e) &&
                        ((n = e[o]), n && (e[o] = null), (f.event.triggered = h), e[h](), (f.event.triggered = b), n && (e[o] = n));
                return c.result;
            }
        },
        dispatch: function (c) {
            c = f.event.fix(c || a.event);
            var d = (f._data(this, 'events') || {})[c.type] || [],
                e = d.delegateCount,
                g = [].slice.call(arguments, 0),
                h = !c.exclusive && !c.namespace,
                i = [],
                j,
                k,
                l,
                m,
                n,
                o,
                p,
                q,
                r,
                s,
                t;
            (g[0] = c), (c.delegateTarget = this);
            if (e && !c.target.disabled && (!c.button || c.type !== 'click')) {
                (m = f(this)), (m.context = this.ownerDocument || this);
                for (l = c.target; l != this; l = l.parentNode || this) {
                    (o = {}), (q = []), (m[0] = l);
                    for (j = 0; j < e; j++) (r = d[j]), (s = r.selector), o[s] === b && (o[s] = r.quick ? H(l, r.quick) : m.is(s)), o[s] && q.push(r);
                    q.length && i.push({ elem: l, matches: q });
                }
            }
            d.length > e && i.push({ elem: this, matches: d.slice(e) });
            for (j = 0; j < i.length && !c.isPropagationStopped(); j++) {
                (p = i[j]), (c.currentTarget = p.elem);
                for (k = 0; k < p.matches.length && !c.isImmediatePropagationStopped(); k++) {
                    r = p.matches[k];
                    if (h || (!c.namespace && !r.namespace) || (c.namespace_re && c.namespace_re.test(r.namespace)))
                        (c.data = r.data),
                            (c.handleObj = r),
                            (n = ((f.event.special[r.origType] || {}).handle || r.handler).apply(p.elem, g)),
                            n !== b && ((c.result = n), n === !1 && (c.preventDefault(), c.stopPropagation()));
                }
            }
            return c.result;
        },
        props: 'attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(
            ' '
        ),
        fixHooks: {},
        keyHooks: {
            props: 'char charCode key keyCode'.split(' '),
            filter: function (a, b) {
                a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode);
                return a;
            }
        },
        mouseHooks: {
            props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '),
            filter: function (a, d) {
                var e,
                    f,
                    g,
                    h = d.button,
                    i = d.fromElement;
                a.pageX == null &&
                    d.clientX != null &&
                    ((e = a.target.ownerDocument || c),
                    (f = e.documentElement),
                    (g = e.body),
                    (a.pageX = d.clientX + ((f && f.scrollLeft) || (g && g.scrollLeft) || 0) - ((f && f.clientLeft) || (g && g.clientLeft) || 0)),
                    (a.pageY = d.clientY + ((f && f.scrollTop) || (g && g.scrollTop) || 0) - ((f && f.clientTop) || (g && g.clientTop) || 0))),
                    !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i),
                    !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
                return a;
            }
        },
        fix: function (a) {
            if (a[f.expando]) return a;
            var d,
                e,
                g = a,
                h = f.event.fixHooks[a.type] || {},
                i = h.props ? this.props.concat(h.props) : this.props;
            a = f.Event(g);
            for (d = i.length; d; ) (e = i[--d]), (a[e] = g[e]);
            a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey);
            return h.filter ? h.filter(a, g) : a;
        },
        special: {
            ready: { setup: f.bindReady },
            load: { noBubble: !0 },
            focus: { delegateType: 'focusin' },
            blur: { delegateType: 'focusout' },
            beforeunload: {
                setup: function (a, b, c) {
                    f.isWindow(this) && (this.onbeforeunload = c);
                },
                teardown: function (a, b) {
                    this.onbeforeunload === b && (this.onbeforeunload = null);
                }
            }
        },
        simulate: function (a, b, c, d) {
            var e = f.extend(new f.Event(), c, { type: a, isSimulated: !0, originalEvent: {} });
            d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
        }
    }),
        (f.event.handle = f.event.dispatch),
        (f.removeEvent = c.removeEventListener
            ? function (a, b, c) {
                  a.removeEventListener && a.removeEventListener(b, c, !1);
              }
            : function (a, b, c) {
                  a.detachEvent && a.detachEvent('on' + b, c);
              }),
        (f.Event = function (a, b) {
            if (!(this instanceof f.Event)) return new f.Event(a, b);
            a && a.type
                ? ((this.originalEvent = a),
                  (this.type = a.type),
                  (this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || (a.getPreventDefault && a.getPreventDefault()) ? K : J))
                : (this.type = a),
                b && f.extend(this, b),
                (this.timeStamp = (a && a.timeStamp) || f.now()),
                (this[f.expando] = !0);
        }),
        (f.Event.prototype = {
            preventDefault: function () {
                this.isDefaultPrevented = K;
                var a = this.originalEvent;
                !a || (a.preventDefault ? a.preventDefault() : (a.returnValue = !1));
            },
            stopPropagation: function () {
                this.isPropagationStopped = K;
                var a = this.originalEvent;
                !a || (a.stopPropagation && a.stopPropagation(), (a.cancelBubble = !0));
            },
            stopImmediatePropagation: function () {
                (this.isImmediatePropagationStopped = K), this.stopPropagation();
            },
            isDefaultPrevented: J,
            isPropagationStopped: J,
            isImmediatePropagationStopped: J
        }),
        f.each({ mouseenter: 'mouseover', mouseleave: 'mouseout' }, function (a, b) {
            f.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function (a) {
                    var c = this,
                        d = a.relatedTarget,
                        e = a.handleObj,
                        g = e.selector,
                        h;
                    if (!d || (d !== c && !f.contains(c, d))) (a.type = e.origType), (h = e.handler.apply(this, arguments)), (a.type = b);
                    return h;
                }
            };
        }),
        f.support.submitBubbles ||
            (f.event.special.submit = {
                setup: function () {
                    if (f.nodeName(this, 'form')) return !1;
                    f.event.add(this, 'click._submit keypress._submit', function (a) {
                        var c = a.target,
                            d = f.nodeName(c, 'input') || f.nodeName(c, 'button') ? c.form : b;
                        d &&
                            !d._submit_attached &&
                            (f.event.add(d, 'submit._submit', function (a) {
                                this.parentNode && !a.isTrigger && f.event.simulate('submit', this.parentNode, a, !0);
                            }),
                            (d._submit_attached = !0));
                    });
                },
                teardown: function () {
                    if (f.nodeName(this, 'form')) return !1;
                    f.event.remove(this, '._submit');
                }
            }),
        f.support.changeBubbles ||
            (f.event.special.change = {
                setup: function () {
                    if (z.test(this.nodeName)) {
                        if (this.type === 'checkbox' || this.type === 'radio')
                            f.event.add(this, 'propertychange._change', function (a) {
                                a.originalEvent.propertyName === 'checked' && (this._just_changed = !0);
                            }),
                                f.event.add(this, 'click._change', function (a) {
                                    this._just_changed && !a.isTrigger && ((this._just_changed = !1), f.event.simulate('change', this, a, !0));
                                });
                        return !1;
                    }
                    f.event.add(this, 'beforeactivate._change', function (a) {
                        var b = a.target;
                        z.test(b.nodeName) &&
                            !b._change_attached &&
                            (f.event.add(b, 'change._change', function (a) {
                                this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate('change', this.parentNode, a, !0);
                            }),
                            (b._change_attached = !0));
                    });
                },
                handle: function (a) {
                    var b = a.target;
                    if (this !== b || a.isSimulated || a.isTrigger || (b.type !== 'radio' && b.type !== 'checkbox')) return a.handleObj.handler.apply(this, arguments);
                },
                teardown: function () {
                    f.event.remove(this, '._change');
                    return z.test(this.nodeName);
                }
            }),
        f.support.focusinBubbles ||
            f.each({ focus: 'focusin', blur: 'focusout' }, function (a, b) {
                var d = 0,
                    e = function (a) {
                        f.event.simulate(b, a.target, f.event.fix(a), !0);
                    };
                f.event.special[b] = {
                    setup: function () {
                        d++ === 0 && c.addEventListener(a, e, !0);
                    },
                    teardown: function () {
                        --d === 0 && c.removeEventListener(a, e, !0);
                    }
                };
            }),
        f.fn.extend({
            on: function (a, c, d, e, g) {
                var h, i;
                if (typeof a == 'object') {
                    typeof c != 'string' && ((d = c), (c = b));
                    for (i in a) this.on(i, c, d, a[i], g);
                    return this;
                }
                d == null && e == null ? ((e = c), (d = c = b)) : e == null && (typeof c == 'string' ? ((e = d), (d = b)) : ((e = d), (d = c), (c = b)));
                if (e === !1) e = J;
                else if (!e) return this;
                g === 1 &&
                    ((h = e),
                    (e = function (a) {
                        f().off(a);
                        return h.apply(this, arguments);
                    }),
                    (e.guid = h.guid || (h.guid = f.guid++)));
                return this.each(function () {
                    f.event.add(this, a, e, d, c);
                });
            },
            one: function (a, b, c, d) {
                return this.on.call(this, a, b, c, d, 1);
            },
            off: function (a, c, d) {
                if (a && a.preventDefault && a.handleObj) {
                    var e = a.handleObj;
                    f(a.delegateTarget).off(e.namespace ? e.type + '.' + e.namespace : e.type, e.selector, e.handler);
                    return this;
                }
                if (typeof a == 'object') {
                    for (var g in a) this.off(g, c, a[g]);
                    return this;
                }
                if (c === !1 || typeof c == 'function') (d = c), (c = b);
                d === !1 && (d = J);
                return this.each(function () {
                    f.event.remove(this, a, d, c);
                });
            },
            bind: function (a, b, c) {
                return this.on(a, null, b, c);
            },
            unbind: function (a, b) {
                return this.off(a, null, b);
            },
            live: function (a, b, c) {
                f(this.context).on(a, this.selector, b, c);
                return this;
            },
            die: function (a, b) {
                f(this.context).off(a, this.selector || '**', b);
                return this;
            },
            delegate: function (a, b, c, d) {
                return this.on(b, a, c, d);
            },
            undelegate: function (a, b, c) {
                return arguments.length == 1 ? this.off(a, '**') : this.off(b, a, c);
            },
            trigger: function (a, b) {
                return this.each(function () {
                    f.event.trigger(a, b, this);
                });
            },
            triggerHandler: function (a, b) {
                if (this[0]) return f.event.trigger(a, b, this[0], !0);
            },
            toggle: function (a) {
                var b = arguments,
                    c = a.guid || f.guid++,
                    d = 0,
                    e = function (c) {
                        var e = (f._data(this, 'lastToggle' + a.guid) || 0) % d;
                        f._data(this, 'lastToggle' + a.guid, e + 1), c.preventDefault();
                        return b[e].apply(this, arguments) || !1;
                    };
                e.guid = c;
                while (d < b.length) b[d++].guid = c;
                return this.click(e);
            },
            hover: function (a, b) {
                return this.mouseenter(a).mouseleave(b || a);
            }
        }),
        f.each(
            'blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(
                ' '
            ),
            function (a, b) {
                (f.fn[b] = function (a, c) {
                    c == null && ((c = a), (a = null));
                    return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
                }),
                    f.attrFn && (f.attrFn[b] = !0),
                    C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks),
                    D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks);
            }
        ),
        (function () {
            function x(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break;
                            }
                            if (j.nodeType === 1) {
                                g || ((j[d] = c), (j.sizset = h));
                                if (typeof b != 'string') {
                                    if (j === b) {
                                        k = !0;
                                        break;
                                    }
                                } else if (m.filter(b, [j]).length > 0) {
                                    k = j;
                                    break;
                                }
                            }
                            j = j[a];
                        }
                        e[h] = k;
                    }
                }
            }
            function w(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break;
                            }
                            j.nodeType === 1 && !g && ((j[d] = c), (j.sizset = h));
                            if (j.nodeName.toLowerCase() === b) {
                                k = j;
                                break;
                            }
                            j = j[a];
                        }
                        e[h] = k;
                    }
                }
            }
            var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                d = 'sizcache' + (Math.random() + '').replace('.', ''),
                e = 0,
                g = Object.prototype.toString,
                h = !1,
                i = !0,
                j = /\\/g,
                k = /\r\n/g,
                l = /\W/;
            [0, 0].sort(function () {
                i = !1;
                return 0;
            });
            var m = function (b, d, e, f) {
                (e = e || []), (d = d || c);
                var h = d;
                if (d.nodeType !== 1 && d.nodeType !== 9) return [];
                if (!b || typeof b != 'string') return e;
                var i,
                    j,
                    k,
                    l,
                    n,
                    q,
                    r,
                    t,
                    u = !0,
                    v = m.isXML(d),
                    w = [],
                    x = b;
                do {
                    a.exec(''), (i = a.exec(x));
                    if (i) {
                        (x = i[3]), w.push(i[1]);
                        if (i[2]) {
                            l = i[3];
                            break;
                        }
                    }
                } while (i);
                if (w.length > 1 && p.exec(b))
                    if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f);
                    else {
                        j = o.relative[w[0]] ? [d] : m(w.shift(), d);
                        while (w.length) (b = w.shift()), o.relative[b] && (b += w.shift()), (j = y(b, j, f));
                    }
                else {
                    !f &&
                        w.length > 1 &&
                        d.nodeType === 9 &&
                        !v &&
                        o.match.ID.test(w[0]) &&
                        !o.match.ID.test(w[w.length - 1]) &&
                        ((n = m.find(w.shift(), d, v)), (d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]));
                    if (d) {
                        (n = f ? { expr: w.pop(), set: s(f) } : m.find(w.pop(), w.length === 1 && (w[0] === '~' || w[0] === '+') && d.parentNode ? d.parentNode : d, v)),
                            (j = n.expr ? m.filter(n.expr, n.set) : n.set),
                            w.length > 0 ? (k = s(j)) : (u = !1);
                        while (w.length) (q = w.pop()), (r = q), o.relative[q] ? (r = w.pop()) : (q = ''), r == null && (r = d), o.relative[q](k, r, v);
                    } else k = w = [];
                }
                k || (k = j), k || m.error(q || b);
                if (g.call(k) === '[object Array]')
                    if (!u) e.push.apply(e, k);
                    else if (d && d.nodeType === 1) for (t = 0; k[t] != null; t++) k[t] && (k[t] === !0 || (k[t].nodeType === 1 && m.contains(d, k[t]))) && e.push(j[t]);
                    else for (t = 0; k[t] != null; t++) k[t] && k[t].nodeType === 1 && e.push(j[t]);
                else s(k, e);
                l && (m(l, h, e, f), m.uniqueSort(e));
                return e;
            };
            (m.uniqueSort = function (a) {
                if (u) {
                    (h = i), a.sort(u);
                    if (h) for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1);
                }
                return a;
            }),
                (m.matches = function (a, b) {
                    return m(a, null, null, b);
                }),
                (m.matchesSelector = function (a, b) {
                    return m(b, null, null, [a]).length > 0;
                }),
                (m.find = function (a, b, c) {
                    var d, e, f, g, h, i;
                    if (!a) return [];
                    for (e = 0, f = o.order.length; e < f; e++) {
                        h = o.order[e];
                        if ((g = o.leftMatch[h].exec(a))) {
                            (i = g[1]), g.splice(1, 1);
                            if (i.substr(i.length - 1) !== '\\') {
                                (g[1] = (g[1] || '').replace(j, '')), (d = o.find[h](g, b, c));
                                if (d != null) {
                                    a = a.replace(o.match[h], '');
                                    break;
                                }
                            }
                        }
                    }
                    d || (d = typeof b.getElementsByTagName != 'undefined' ? b.getElementsByTagName('*') : []);
                    return { set: d, expr: a };
                }),
                (m.filter = function (a, c, d, e) {
                    var f,
                        g,
                        h,
                        i,
                        j,
                        k,
                        l,
                        n,
                        p,
                        q = a,
                        r = [],
                        s = c,
                        t = c && c[0] && m.isXML(c[0]);
                    while (a && c.length) {
                        for (h in o.filter)
                            if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                                (k = o.filter[h]), (l = f[1]), (g = !1), f.splice(1, 1);
                                if (l.substr(l.length - 1) === '\\') continue;
                                s === r && (r = []);
                                if (o.preFilter[h]) {
                                    f = o.preFilter[h](f, s, d, r, e, t);
                                    if (!f) g = i = !0;
                                    else if (f === !0) continue;
                                }
                                if (f)
                                    for (n = 0; (j = s[n]) != null; n++)
                                        j && ((i = k(j, f, n, s)), (p = e ^ i), d && i != null ? (p ? (g = !0) : (s[n] = !1)) : p && (r.push(j), (g = !0)));
                                if (i !== b) {
                                    d || (s = r), (a = a.replace(o.match[h], ''));
                                    if (!g) return [];
                                    break;
                                }
                            }
                        if (a === q)
                            if (g == null) m.error(a);
                            else break;
                        q = a;
                    }
                    return s;
                }),
                (m.error = function (a) {
                    throw new Error('Syntax error, unrecognized expression: ' + a);
                });
            var n = (m.getText = function (a) {
                    var b,
                        c,
                        d = a.nodeType,
                        e = '';
                    if (d) {
                        if (d === 1 || d === 9) {
                            if (typeof a.textContent == 'string') return a.textContent;
                            if (typeof a.innerText == 'string') return a.innerText.replace(k, '');
                            for (a = a.firstChild; a; a = a.nextSibling) e += n(a);
                        } else if (d === 3 || d === 4) return a.nodeValue;
                    } else for (b = 0; (c = a[b]); b++) c.nodeType !== 8 && (e += n(c));
                    return e;
                }),
                o = (m.selectors = {
                    order: ['ID', 'NAME', 'TAG'],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                    },
                    leftMatch: {},
                    attrMap: { class: 'className', for: 'htmlFor' },
                    attrHandle: {
                        href: function (a) {
                            return a.getAttribute('href');
                        },
                        type: function (a) {
                            return a.getAttribute('type');
                        }
                    },
                    relative: {
                        '+': function (a, b) {
                            var c = typeof b == 'string',
                                d = c && !l.test(b),
                                e = c && !d;
                            d && (b = b.toLowerCase());
                            for (var f = 0, g = a.length, h; f < g; f++)
                                if ((h = a[f])) {
                                    while ((h = h.previousSibling) && h.nodeType !== 1);
                                    a[f] = e || (h && h.nodeName.toLowerCase() === b) ? h || !1 : h === b;
                                }
                            e && m.filter(b, a, !0);
                        },
                        '>': function (a, b) {
                            var c,
                                d = typeof b == 'string',
                                e = 0,
                                f = a.length;
                            if (d && !l.test(b)) {
                                b = b.toLowerCase();
                                for (; e < f; e++) {
                                    c = a[e];
                                    if (c) {
                                        var g = c.parentNode;
                                        a[e] = g.nodeName.toLowerCase() === b ? g : !1;
                                    }
                                }
                            } else {
                                for (; e < f; e++) (c = a[e]), c && (a[e] = d ? c.parentNode : c.parentNode === b);
                                d && m.filter(b, a, !0);
                            }
                        },
                        '': function (a, b, c) {
                            var d,
                                f = e++,
                                g = x;
                            typeof b == 'string' && !l.test(b) && ((b = b.toLowerCase()), (d = b), (g = w)), g('parentNode', b, f, a, d, c);
                        },
                        '~': function (a, b, c) {
                            var d,
                                f = e++,
                                g = x;
                            typeof b == 'string' && !l.test(b) && ((b = b.toLowerCase()), (d = b), (g = w)), g('previousSibling', b, f, a, d, c);
                        }
                    },
                    find: {
                        ID: function (a, b, c) {
                            if (typeof b.getElementById != 'undefined' && !c) {
                                var d = b.getElementById(a[1]);
                                return d && d.parentNode ? [d] : [];
                            }
                        },
                        NAME: function (a, b) {
                            if (typeof b.getElementsByName != 'undefined') {
                                var c = [],
                                    d = b.getElementsByName(a[1]);
                                for (var e = 0, f = d.length; e < f; e++) d[e].getAttribute('name') === a[1] && c.push(d[e]);
                                return c.length === 0 ? null : c;
                            }
                        },
                        TAG: function (a, b) {
                            if (typeof b.getElementsByTagName != 'undefined') return b.getElementsByTagName(a[1]);
                        }
                    },
                    preFilter: {
                        CLASS: function (a, b, c, d, e, f) {
                            a = ' ' + a[1].replace(j, '') + ' ';
                            if (f) return a;
                            for (var g = 0, h; (h = b[g]) != null; g++)
                                h && (e ^ (h.className && (' ' + h.className + ' ').replace(/[\t\n\r]/g, ' ').indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                            return !1;
                        },
                        ID: function (a) {
                            return a[1].replace(j, '');
                        },
                        TAG: function (a, b) {
                            return a[1].replace(j, '').toLowerCase();
                        },
                        CHILD: function (a) {
                            if (a[1] === 'nth') {
                                a[2] || m.error(a[0]), (a[2] = a[2].replace(/^\+|\s*/g, ''));
                                var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec((a[2] === 'even' && '2n') || (a[2] === 'odd' && '2n+1') || (!/\D/.test(a[2]) && '0n+' + a[2]) || a[2]);
                                (a[2] = b[1] + (b[2] || 1) - 0), (a[3] = b[3] - 0);
                            } else a[2] && m.error(a[0]);
                            a[0] = e++;
                            return a;
                        },
                        ATTR: function (a, b, c, d, e, f) {
                            var g = (a[1] = a[1].replace(j, ''));
                            !f && o.attrMap[g] && (a[1] = o.attrMap[g]), (a[4] = (a[4] || a[5] || '').replace(j, '')), a[2] === '~=' && (a[4] = ' ' + a[4] + ' ');
                            return a;
                        },
                        PSEUDO: function (b, c, d, e, f) {
                            if (b[1] === 'not')
                                if ((a.exec(b[3]) || '').length > 1 || /^\w/.test(b[3])) b[3] = m(b[3], null, null, c);
                                else {
                                    var g = m.filter(b[3], c, d, !0 ^ f);
                                    d || e.push.apply(e, g);
                                    return !1;
                                }
                            else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return !0;
                            return b;
                        },
                        POS: function (a) {
                            a.unshift(!0);
                            return a;
                        }
                    },
                    filters: {
                        enabled: function (a) {
                            return a.disabled === !1 && a.type !== 'hidden';
                        },
                        disabled: function (a) {
                            return a.disabled === !0;
                        },
                        checked: function (a) {
                            return a.checked === !0;
                        },
                        selected: function (a) {
                            a.parentNode && a.parentNode.selectedIndex;
                            return a.selected === !0;
                        },
                        parent: function (a) {
                            return !!a.firstChild;
                        },
                        empty: function (a) {
                            return !a.firstChild;
                        },
                        has: function (a, b, c) {
                            return !!m(c[3], a).length;
                        },
                        header: function (a) {
                            return /h\d/i.test(a.nodeName);
                        },
                        text: function (a) {
                            var b = a.getAttribute('type'),
                                c = a.type;
                            return a.nodeName.toLowerCase() === 'input' && 'text' === c && (b === c || b === null);
                        },
                        radio: function (a) {
                            return a.nodeName.toLowerCase() === 'input' && 'radio' === a.type;
                        },
                        checkbox: function (a) {
                            return a.nodeName.toLowerCase() === 'input' && 'checkbox' === a.type;
                        },
                        file: function (a) {
                            return a.nodeName.toLowerCase() === 'input' && 'file' === a.type;
                        },
                        password: function (a) {
                            return a.nodeName.toLowerCase() === 'input' && 'password' === a.type;
                        },
                        submit: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === 'input' || b === 'button') && 'submit' === a.type;
                        },
                        image: function (a) {
                            return a.nodeName.toLowerCase() === 'input' && 'image' === a.type;
                        },
                        reset: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === 'input' || b === 'button') && 'reset' === a.type;
                        },
                        button: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === 'input' && 'button' === a.type) || b === 'button';
                        },
                        input: function (a) {
                            return /input|select|textarea|button/i.test(a.nodeName);
                        },
                        focus: function (a) {
                            return a === a.ownerDocument.activeElement;
                        }
                    },
                    setFilters: {
                        first: function (a, b) {
                            return b === 0;
                        },
                        last: function (a, b, c, d) {
                            return b === d.length - 1;
                        },
                        even: function (a, b) {
                            return b % 2 === 0;
                        },
                        odd: function (a, b) {
                            return b % 2 === 1;
                        },
                        lt: function (a, b, c) {
                            return b < c[3] - 0;
                        },
                        gt: function (a, b, c) {
                            return b > c[3] - 0;
                        },
                        nth: function (a, b, c) {
                            return c[3] - 0 === b;
                        },
                        eq: function (a, b, c) {
                            return c[3] - 0 === b;
                        }
                    },
                    filter: {
                        PSEUDO: function (a, b, c, d) {
                            var e = b[1],
                                f = o.filters[e];
                            if (f) return f(a, c, b, d);
                            if (e === 'contains') return (a.textContent || a.innerText || n([a]) || '').indexOf(b[3]) >= 0;
                            if (e === 'not') {
                                var g = b[3];
                                for (var h = 0, i = g.length; h < i; h++) if (g[h] === a) return !1;
                                return !0;
                            }
                            m.error(e);
                        },
                        CHILD: function (a, b) {
                            var c,
                                e,
                                f,
                                g,
                                h,
                                i,
                                j,
                                k = b[1],
                                l = a;
                            switch (k) {
                                case 'only':
                                case 'first':
                                    while ((l = l.previousSibling)) if (l.nodeType === 1) return !1;
                                    if (k === 'first') return !0;
                                    l = a;
                                case 'last':
                                    while ((l = l.nextSibling)) if (l.nodeType === 1) return !1;
                                    return !0;
                                case 'nth':
                                    (c = b[2]), (e = b[3]);
                                    if (c === 1 && e === 0) return !0;
                                    (f = b[0]), (g = a.parentNode);
                                    if (g && (g[d] !== f || !a.nodeIndex)) {
                                        i = 0;
                                        for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i);
                                        g[d] = f;
                                    }
                                    j = a.nodeIndex - e;
                                    return c === 0 ? j === 0 : j % c === 0 && j / c >= 0;
                            }
                        },
                        ID: function (a, b) {
                            return a.nodeType === 1 && a.getAttribute('id') === b;
                        },
                        TAG: function (a, b) {
                            return (b === '*' && a.nodeType === 1) || (!!a.nodeName && a.nodeName.toLowerCase() === b);
                        },
                        CLASS: function (a, b) {
                            return (' ' + (a.className || a.getAttribute('class')) + ' ').indexOf(b) > -1;
                        },
                        ATTR: function (a, b) {
                            var c = b[1],
                                d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c),
                                e = d + '',
                                f = b[2],
                                g = b[4];
                            return d == null
                                ? f === '!='
                                : !f && m.attr
                                ? d != null
                                : f === '='
                                ? e === g
                                : f === '*='
                                ? e.indexOf(g) >= 0
                                : f === '~='
                                ? (' ' + e + ' ').indexOf(g) >= 0
                                : g
                                ? f === '!='
                                    ? e !== g
                                    : f === '^='
                                    ? e.indexOf(g) === 0
                                    : f === '$='
                                    ? e.substr(e.length - g.length) === g
                                    : f === '|='
                                    ? e === g || e.substr(0, g.length + 1) === g + '-'
                                    : !1
                                : e && d !== !1;
                        },
                        POS: function (a, b, c, d) {
                            var e = b[2],
                                f = o.setFilters[e];
                            if (f) return f(a, c, b, d);
                        }
                    }
                }),
                p = o.match.POS,
                q = function (a, b) {
                    return '\\' + (b - 0 + 1);
                };
            for (var r in o.match)
                (o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source)),
                    (o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q)));
            var s = function (a, b) {
                a = Array.prototype.slice.call(a, 0);
                if (b) {
                    b.push.apply(b, a);
                    return b;
                }
                return a;
            };
            try {
                Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType;
            } catch (t) {
                s = function (a, b) {
                    var c = 0,
                        d = b || [];
                    if (g.call(a) === '[object Array]') Array.prototype.push.apply(d, a);
                    else if (typeof a.length == 'number') for (var e = a.length; c < e; c++) d.push(a[c]);
                    else for (; a[c]; c++) d.push(a[c]);
                    return d;
                };
            }
            var u, v;
            c.documentElement.compareDocumentPosition
                ? (u = function (a, b) {
                      if (a === b) {
                          h = !0;
                          return 0;
                      }
                      if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1;
                      return a.compareDocumentPosition(b) & 4 ? -1 : 1;
                  })
                : ((u = function (a, b) {
                      if (a === b) {
                          h = !0;
                          return 0;
                      }
                      if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
                      var c,
                          d,
                          e = [],
                          f = [],
                          g = a.parentNode,
                          i = b.parentNode,
                          j = g;
                      if (g === i) return v(a, b);
                      if (!g) return -1;
                      if (!i) return 1;
                      while (j) e.unshift(j), (j = j.parentNode);
                      j = i;
                      while (j) f.unshift(j), (j = j.parentNode);
                      (c = e.length), (d = f.length);
                      for (var k = 0; k < c && k < d; k++) if (e[k] !== f[k]) return v(e[k], f[k]);
                      return k === c ? v(a, f[k], -1) : v(e[k], b, 1);
                  }),
                  (v = function (a, b, c) {
                      if (a === b) return c;
                      var d = a.nextSibling;
                      while (d) {
                          if (d === b) return -1;
                          d = d.nextSibling;
                      }
                      return 1;
                  })),
                (function () {
                    var a = c.createElement('div'),
                        d = 'script' + new Date().getTime(),
                        e = c.documentElement;
                    (a.innerHTML = "<a name='" + d + "'/>"),
                        e.insertBefore(a, e.firstChild),
                        c.getElementById(d) &&
                            ((o.find.ID = function (a, c, d) {
                                if (typeof c.getElementById != 'undefined' && !d) {
                                    var e = c.getElementById(a[1]);
                                    return e ? (e.id === a[1] || (typeof e.getAttributeNode != 'undefined' && e.getAttributeNode('id').nodeValue === a[1]) ? [e] : b) : [];
                                }
                            }),
                            (o.filter.ID = function (a, b) {
                                var c = typeof a.getAttributeNode != 'undefined' && a.getAttributeNode('id');
                                return a.nodeType === 1 && c && c.nodeValue === b;
                            })),
                        e.removeChild(a),
                        (e = a = null);
                })(),
                (function () {
                    var a = c.createElement('div');
                    a.appendChild(c.createComment('')),
                        a.getElementsByTagName('*').length > 0 &&
                            (o.find.TAG = function (a, b) {
                                var c = b.getElementsByTagName(a[1]);
                                if (a[1] === '*') {
                                    var d = [];
                                    for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]);
                                    c = d;
                                }
                                return c;
                            }),
                        (a.innerHTML = "<a href='#'></a>"),
                        a.firstChild &&
                            typeof a.firstChild.getAttribute != 'undefined' &&
                            a.firstChild.getAttribute('href') !== '#' &&
                            (o.attrHandle.href = function (a) {
                                return a.getAttribute('href', 2);
                            }),
                        (a = null);
                })(),
                c.querySelectorAll &&
                    (function () {
                        var a = m,
                            b = c.createElement('div'),
                            d = '__sizzle__';
                        b.innerHTML = "<p class='TEST'></p>";
                        if (!b.querySelectorAll || b.querySelectorAll('.TEST').length !== 0) {
                            m = function (b, e, f, g) {
                                e = e || c;
                                if (!g && !m.isXML(e)) {
                                    var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                                    if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                                        if (h[1]) return s(e.getElementsByTagName(b), f);
                                        if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f);
                                    }
                                    if (e.nodeType === 9) {
                                        if (b === 'body' && e.body) return s([e.body], f);
                                        if (h && h[3]) {
                                            var i = e.getElementById(h[3]);
                                            if (!i || !i.parentNode) return s([], f);
                                            if (i.id === h[3]) return s([i], f);
                                        }
                                        try {
                                            return s(e.querySelectorAll(b), f);
                                        } catch (j) {}
                                    } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== 'object') {
                                        var k = e,
                                            l = e.getAttribute('id'),
                                            n = l || d,
                                            p = e.parentNode,
                                            q = /^\s*[+~]/.test(b);
                                        l ? (n = n.replace(/'/g, '\\$&')) : e.setAttribute('id', n), q && p && (e = e.parentNode);
                                        try {
                                            if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f);
                                        } catch (r) {
                                        } finally {
                                            l || k.removeAttribute('id');
                                        }
                                    }
                                }
                                return a(b, e, f, g);
                            };
                            for (var e in a) m[e] = a[e];
                            b = null;
                        }
                    })(),
                (function () {
                    var a = c.documentElement,
                        b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
                    if (b) {
                        var d = !b.call(c.createElement('div'), 'div'),
                            e = !1;
                        try {
                            b.call(c.documentElement, "[test!='']:sizzle");
                        } catch (f) {
                            e = !0;
                        }
                        m.matchesSelector = function (a, c) {
                            c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                            if (!m.isXML(a))
                                try {
                                    if (e || (!o.match.PSEUDO.test(c) && !/!=/.test(c))) {
                                        var f = b.call(a, c);
                                        if (f || !d || (a.document && a.document.nodeType !== 11)) return f;
                                    }
                                } catch (g) {}
                            return m(c, null, null, [a]).length > 0;
                        };
                    }
                })(),
                (function () {
                    var a = c.createElement('div');
                    a.innerHTML = "<div class='test e'></div><div class='test'></div>";
                    if (!!a.getElementsByClassName && a.getElementsByClassName('e').length !== 0) {
                        a.lastChild.className = 'e';
                        if (a.getElementsByClassName('e').length === 1) return;
                        o.order.splice(1, 0, 'CLASS'),
                            (o.find.CLASS = function (a, b, c) {
                                if (typeof b.getElementsByClassName != 'undefined' && !c) return b.getElementsByClassName(a[1]);
                            }),
                            (a = null);
                    }
                })(),
                c.documentElement.contains
                    ? (m.contains = function (a, b) {
                          return a !== b && (a.contains ? a.contains(b) : !0);
                      })
                    : c.documentElement.compareDocumentPosition
                    ? (m.contains = function (a, b) {
                          return !!(a.compareDocumentPosition(b) & 16);
                      })
                    : (m.contains = function () {
                          return !1;
                      }),
                (m.isXML = function (a) {
                    var b = (a ? a.ownerDocument || a : 0).documentElement;
                    return b ? b.nodeName !== 'HTML' : !1;
                });
            var y = function (a, b, c) {
                var d,
                    e = [],
                    f = '',
                    g = b.nodeType ? [b] : b;
                while ((d = o.match.PSEUDO.exec(a))) (f += d[0]), (a = a.replace(o.match.PSEUDO, ''));
                a = o.relative[a] ? a + '*' : a;
                for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c);
                return m.filter(f, e);
            };
            (m.attr = f.attr),
                (m.selectors.attrMap = {}),
                (f.find = m),
                (f.expr = m.selectors),
                (f.expr[':'] = f.expr.filters),
                (f.unique = m.uniqueSort),
                (f.text = m.getText),
                (f.isXMLDoc = m.isXML),
                (f.contains = m.contains);
        })();
    var L = /Until$/,
        M = /^(?:parents|prevUntil|prevAll)/,
        N = /,/,
        O = /^.[^:#\[\.,]*$/,
        P = Array.prototype.slice,
        Q = f.expr.match.POS,
        R = { children: !0, contents: !0, next: !0, prev: !0 };
    f.fn.extend({
        find: function (a) {
            var b = this,
                c,
                d;
            if (typeof a != 'string')
                return f(a).filter(function () {
                    for (c = 0, d = b.length; c < d; c++) if (f.contains(b[c], this)) return !0;
                });
            var e = this.pushStack('', 'find', a),
                g,
                h,
                i;
            for (c = 0, d = this.length; c < d; c++) {
                (g = e.length), f.find(a, this[c], e);
                if (c > 0)
                    for (h = g; h < e.length; h++)
                        for (i = 0; i < g; i++)
                            if (e[i] === e[h]) {
                                e.splice(h--, 1);
                                break;
                            }
            }
            return e;
        },
        has: function (a) {
            var b = f(a);
            return this.filter(function () {
                for (var a = 0, c = b.length; a < c; a++) if (f.contains(this, b[a])) return !0;
            });
        },
        not: function (a) {
            return this.pushStack(T(this, a, !1), 'not', a);
        },
        filter: function (a) {
            return this.pushStack(T(this, a, !0), 'filter', a);
        },
        is: function (a) {
            return !!a && (typeof a == 'string' ? (Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0) : this.filter(a).length > 0);
        },
        closest: function (a, b) {
            var c = [],
                d,
                e,
                g = this[0];
            if (f.isArray(a)) {
                var h = 1;
                while (g && g.ownerDocument && g !== b) {
                    for (d = 0; d < a.length; d++) f(g).is(a[d]) && c.push({ selector: a[d], elem: g, level: h });
                    (g = g.parentNode), h++;
                }
                return c;
            }
            var i = Q.test(a) || typeof a != 'string' ? f(a, b || this.context) : 0;
            for (d = 0, e = this.length; d < e; d++) {
                g = this[d];
                while (g) {
                    if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
                        c.push(g);
                        break;
                    }
                    g = g.parentNode;
                    if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break;
                }
            }
            c = c.length > 1 ? f.unique(c) : c;
            return this.pushStack(c, 'closest', a);
        },
        index: function (a) {
            if (!a) return this[0] && this[0].parentNode ? this.prevAll().length : -1;
            if (typeof a == 'string') return f.inArray(this[0], f(a));
            return f.inArray(a.jquery ? a[0] : a, this);
        },
        add: function (a, b) {
            var c = typeof a == 'string' ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a),
                d = f.merge(this.get(), c);
            return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d));
        },
        andSelf: function () {
            return this.add(this.prevObject);
        }
    }),
        f.each(
            {
                parent: function (a) {
                    var b = a.parentNode;
                    return b && b.nodeType !== 11 ? b : null;
                },
                parents: function (a) {
                    return f.dir(a, 'parentNode');
                },
                parentsUntil: function (a, b, c) {
                    return f.dir(a, 'parentNode', c);
                },
                next: function (a) {
                    return f.nth(a, 2, 'nextSibling');
                },
                prev: function (a) {
                    return f.nth(a, 2, 'previousSibling');
                },
                nextAll: function (a) {
                    return f.dir(a, 'nextSibling');
                },
                prevAll: function (a) {
                    return f.dir(a, 'previousSibling');
                },
                nextUntil: function (a, b, c) {
                    return f.dir(a, 'nextSibling', c);
                },
                prevUntil: function (a, b, c) {
                    return f.dir(a, 'previousSibling', c);
                },
                siblings: function (a) {
                    return f.sibling(a.parentNode.firstChild, a);
                },
                children: function (a) {
                    return f.sibling(a.firstChild);
                },
                contents: function (a) {
                    return f.nodeName(a, 'iframe') ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes);
                }
            },
            function (a, b) {
                f.fn[a] = function (c, d) {
                    var e = f.map(this, b, c);
                    L.test(a) || (d = c),
                        d && typeof d == 'string' && (e = f.filter(d, e)),
                        (e = this.length > 1 && !R[a] ? f.unique(e) : e),
                        (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
                    return this.pushStack(e, a, P.call(arguments).join(','));
                };
            }
        ),
        f.extend({
            filter: function (a, b, c) {
                c && (a = ':not(' + a + ')');
                return b.length === 1 ? (f.find.matchesSelector(b[0], a) ? [b[0]] : []) : f.find.matches(a, b);
            },
            dir: function (a, c, d) {
                var e = [],
                    g = a[c];
                while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g), (g = g[c]);
                return e;
            },
            nth: function (a, b, c, d) {
                b = b || 1;
                var e = 0;
                for (; a; a = a[c]) if (a.nodeType === 1 && ++e === b) break;
                return a;
            },
            sibling: function (a, b) {
                var c = [];
                for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
                return c;
            }
        });
    var V = 'abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video',
        W = / jQuery\d+="(?:\d+|null)"/g,
        X = /^\s+/,
        Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Z = /<([\w:]+)/,
        $ = /<tbody/i,
        _ = /<|&#?\w+;/,
        ba = /<(?:script|style)/i,
        bb = /<(?:script|object|embed|option|style)/i,
        bc = new RegExp('<(?:' + V + ')', 'i'),
        bd = /checked\s*(?:[^=]|=\s*.checked.)/i,
        be = /\/(java|ecma)script/i,
        bf = /^\s*<!(?:\[CDATA\[|\-\-)/,
        bg = {
            option: [1, "<select multiple='multiple'>", '</select>'],
            legend: [1, '<fieldset>', '</fieldset>'],
            thead: [1, '<table>', '</table>'],
            tr: [2, '<table><tbody>', '</tbody></table>'],
            td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
            area: [1, '<map>', '</map>'],
            _default: [0, '', '']
        },
        bh = U(c);
    (bg.optgroup = bg.option),
        (bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead),
        (bg.th = bg.td),
        f.support.htmlSerialize || (bg._default = [1, 'div<div>', '</div>']),
        f.fn.extend({
            text: function (a) {
                if (f.isFunction(a))
                    return this.each(function (b) {
                        var c = f(this);
                        c.text(a.call(this, b, c.text()));
                    });
                if (typeof a != 'object' && a !== b) return this.empty().append(((this[0] && this[0].ownerDocument) || c).createTextNode(a));
                return f.text(this);
            },
            wrapAll: function (a) {
                if (f.isFunction(a))
                    return this.each(function (b) {
                        f(this).wrapAll(a.call(this, b));
                    });
                if (this[0]) {
                    var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && b.insertBefore(this[0]),
                        b
                            .map(function () {
                                var a = this;
                                while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                                return a;
                            })
                            .append(this);
                }
                return this;
            },
            wrapInner: function (a) {
                if (f.isFunction(a))
                    return this.each(function (b) {
                        f(this).wrapInner(a.call(this, b));
                    });
                return this.each(function () {
                    var b = f(this),
                        c = b.contents();
                    c.length ? c.wrapAll(a) : b.append(a);
                });
            },
            wrap: function (a) {
                var b = f.isFunction(a);
                return this.each(function (c) {
                    f(this).wrapAll(b ? a.call(this, c) : a);
                });
            },
            unwrap: function () {
                return this.parent()
                    .each(function () {
                        f.nodeName(this, 'body') || f(this).replaceWith(this.childNodes);
                    })
                    .end();
            },
            append: function () {
                return this.domManip(arguments, !0, function (a) {
                    this.nodeType === 1 && this.appendChild(a);
                });
            },
            prepend: function () {
                return this.domManip(arguments, !0, function (a) {
                    this.nodeType === 1 && this.insertBefore(a, this.firstChild);
                });
            },
            before: function () {
                if (this[0] && this[0].parentNode)
                    return this.domManip(arguments, !1, function (a) {
                        this.parentNode.insertBefore(a, this);
                    });
                if (arguments.length) {
                    var a = f.clean(arguments);
                    a.push.apply(a, this.toArray());
                    return this.pushStack(a, 'before', arguments);
                }
            },
            after: function () {
                if (this[0] && this[0].parentNode)
                    return this.domManip(arguments, !1, function (a) {
                        this.parentNode.insertBefore(a, this.nextSibling);
                    });
                if (arguments.length) {
                    var a = this.pushStack(this, 'after', arguments);
                    a.push.apply(a, f.clean(arguments));
                    return a;
                }
            },
            remove: function (a, b) {
                for (var c = 0, d; (d = this[c]) != null; c++)
                    if (!a || f.filter(a, [d]).length)
                        !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName('*')), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d);
                return this;
            },
            empty: function () {
                for (var a = 0, b; (b = this[a]) != null; a++) {
                    b.nodeType === 1 && f.cleanData(b.getElementsByTagName('*'));
                    while (b.firstChild) b.removeChild(b.firstChild);
                }
                return this;
            },
            clone: function (a, b) {
                (a = a == null ? !1 : a), (b = b == null ? a : b);
                return this.map(function () {
                    return f.clone(this, a, b);
                });
            },
            html: function (a) {
                if (a === b) return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(W, '') : null;
                if (typeof a == 'string' && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ['', ''])[1].toLowerCase()]) {
                    a = a.replace(Y, '<$1></$2>');
                    try {
                        for (var c = 0, d = this.length; c < d; c++) this[c].nodeType === 1 && (f.cleanData(this[c].getElementsByTagName('*')), (this[c].innerHTML = a));
                    } catch (e) {
                        this.empty().append(a);
                    }
                } else
                    f.isFunction(a)
                        ? this.each(function (b) {
                              var c = f(this);
                              c.html(a.call(this, b, c.html()));
                          })
                        : this.empty().append(a);
                return this;
            },
            replaceWith: function (a) {
                if (this[0] && this[0].parentNode) {
                    if (f.isFunction(a))
                        return this.each(function (b) {
                            var c = f(this),
                                d = c.html();
                            c.replaceWith(a.call(this, b, d));
                        });
                    typeof a != 'string' && (a = f(a).detach());
                    return this.each(function () {
                        var b = this.nextSibling,
                            c = this.parentNode;
                        f(this).remove(), b ? f(b).before(a) : f(c).append(a);
                    });
                }
                return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), 'replaceWith', a) : this;
            },
            detach: function (a) {
                return this.remove(a, !0);
            },
            domManip: function (a, c, d) {
                var e,
                    g,
                    h,
                    i,
                    j = a[0],
                    k = [];
                if (!f.support.checkClone && arguments.length === 3 && typeof j == 'string' && bd.test(j))
                    return this.each(function () {
                        f(this).domManip(a, c, d, !0);
                    });
                if (f.isFunction(j))
                    return this.each(function (e) {
                        var g = f(this);
                        (a[0] = j.call(this, e, c ? g.html() : b)), g.domManip(a, c, d);
                    });
                if (this[0]) {
                    (i = j && j.parentNode),
                        f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? (e = { fragment: i }) : (e = f.buildFragment(a, this, k)),
                        (h = e.fragment),
                        h.childNodes.length === 1 ? (g = h = h.firstChild) : (g = h.firstChild);
                    if (g) {
                        c = c && f.nodeName(g, 'tr');
                        for (var l = 0, m = this.length, n = m - 1; l < m; l++) d.call(c ? bi(this[l], g) : this[l], e.cacheable || (m > 1 && l < n) ? f.clone(h, !0, !0) : h);
                    }
                    k.length && f.each(k, bp);
                }
                return this;
            }
        }),
        (f.buildFragment = function (a, b, d) {
            var e,
                g,
                h,
                i,
                j = a[0];
            b && b[0] && (i = b[0].ownerDocument || b[0]),
                i.createDocumentFragment || (i = c),
                a.length === 1 &&
                    typeof j == 'string' &&
                    j.length < 512 &&
                    i === c &&
                    j.charAt(0) === '<' &&
                    !bb.test(j) &&
                    (f.support.checkClone || !bd.test(j)) &&
                    (f.support.html5Clone || !bc.test(j)) &&
                    ((g = !0), (h = f.fragments[j]), h && h !== 1 && (e = h)),
                e || ((e = i.createDocumentFragment()), f.clean(a, i, e, d)),
                g && (f.fragments[j] = h ? e : 1);
            return { fragment: e, cacheable: g };
        }),
        (f.fragments = {}),
        f.each({ appendTo: 'append', prependTo: 'prepend', insertBefore: 'before', insertAfter: 'after', replaceAll: 'replaceWith' }, function (a, b) {
            f.fn[a] = function (c) {
                var d = [],
                    e = f(c),
                    g = this.length === 1 && this[0].parentNode;
                if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) {
                    e[b](this[0]);
                    return this;
                }
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = (h > 0 ? this.clone(!0) : this).get();
                    f(e[h])[b](j), (d = d.concat(j));
                }
                return this.pushStack(d, a, e.selector);
            };
        }),
        f.extend({
            clone: function (a, b, c) {
                var d,
                    e,
                    g,
                    h = f.support.html5Clone || !bc.test('<' + a.nodeName) ? a.cloneNode(!0) : bo(a);
                if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
                    bk(a, h), (d = bl(a)), (e = bl(h));
                    for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g]);
                }
                if (b) {
                    bj(a, h);
                    if (c) {
                        (d = bl(a)), (e = bl(h));
                        for (g = 0; d[g]; ++g) bj(d[g], e[g]);
                    }
                }
                d = e = null;
                return h;
            },
            clean: function (a, b, d, e) {
                var g;
                (b = b || c), typeof b.createElement == 'undefined' && (b = b.ownerDocument || (b[0] && b[0].ownerDocument) || c);
                var h = [],
                    i;
                for (var j = 0, k; (k = a[j]) != null; j++) {
                    typeof k == 'number' && (k += '');
                    if (!k) continue;
                    if (typeof k == 'string')
                        if (!_.test(k)) k = b.createTextNode(k);
                        else {
                            k = k.replace(Y, '<$1></$2>');
                            var l = (Z.exec(k) || ['', ''])[1].toLowerCase(),
                                m = bg[l] || bg._default,
                                n = m[0],
                                o = b.createElement('div');
                            b === c ? bh.appendChild(o) : U(b).appendChild(o), (o.innerHTML = m[1] + k + m[2]);
                            while (n--) o = o.lastChild;
                            if (!f.support.tbody) {
                                var p = $.test(k),
                                    q = l === 'table' && !p ? o.firstChild && o.firstChild.childNodes : m[1] === '<table>' && !p ? o.childNodes : [];
                                for (i = q.length - 1; i >= 0; --i) f.nodeName(q[i], 'tbody') && !q[i].childNodes.length && q[i].parentNode.removeChild(q[i]);
                            }
                            !f.support.leadingWhitespace && X.test(k) && o.insertBefore(b.createTextNode(X.exec(k)[0]), o.firstChild), (k = o.childNodes);
                        }
                    var r;
                    if (!f.support.appendChecked)
                        if (k[0] && typeof (r = k.length) == 'number') for (i = 0; i < r; i++) bn(k[i]);
                        else bn(k);
                    k.nodeType ? h.push(k) : (h = f.merge(h, k));
                }
                if (d) {
                    g = function (a) {
                        return !a.type || be.test(a.type);
                    };
                    for (j = 0; h[j]; j++)
                        if (e && f.nodeName(h[j], 'script') && (!h[j].type || h[j].type.toLowerCase() === 'text/javascript'))
                            e.push(h[j].parentNode ? h[j].parentNode.removeChild(h[j]) : h[j]);
                        else {
                            if (h[j].nodeType === 1) {
                                var s = f.grep(h[j].getElementsByTagName('script'), g);
                                h.splice.apply(h, [j + 1, 0].concat(s));
                            }
                            d.appendChild(h[j]);
                        }
                }
                return h;
            },
            cleanData: function (a) {
                var b,
                    c,
                    d = f.cache,
                    e = f.event.special,
                    g = f.support.deleteExpando;
                for (var h = 0, i; (i = a[h]) != null; h++) {
                    if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue;
                    c = i[f.expando];
                    if (c) {
                        b = d[c];
                        if (b && b.events) {
                            for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle);
                            b.handle && (b.handle.elem = null);
                        }
                        g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c];
                    }
                }
            }
        });
    var bq = /alpha\([^)]*\)/i,
        br = /opacity=([^)]*)/,
        bs = /([A-Z]|^ms)/g,
        bt = /^-?\d+(?:px)?$/i,
        bu = /^-?\d/,
        bv = /^([\-+])=([\-+.\de]+)/,
        bw = { position: 'absolute', visibility: 'hidden', display: 'block' },
        bx = ['Left', 'Right'],
        by = ['Top', 'Bottom'],
        bz,
        bA,
        bB;
    (f.fn.css = function (a, c) {
        if (arguments.length === 2 && c === b) return this;
        return f.access(this, a, c, !0, function (a, c, d) {
            return d !== b ? f.style(a, c, d) : f.css(a, c);
        });
    }),
        f.extend({
            cssHooks: {
                opacity: {
                    get: function (a, b) {
                        if (b) {
                            var c = bz(a, 'opacity', 'opacity');
                            return c === '' ? '1' : c;
                        }
                        return a.style.opacity;
                    }
                }
            },
            cssNumber: { fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 },
            cssProps: { float: f.support.cssFloat ? 'cssFloat' : 'styleFloat' },
            style: function (a, c, d, e) {
                if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
                    var g,
                        h,
                        i = f.camelCase(c),
                        j = a.style,
                        k = f.cssHooks[i];
                    c = f.cssProps[i] || i;
                    if (d === b) {
                        if (k && 'get' in k && (g = k.get(a, !1, e)) !== b) return g;
                        return j[c];
                    }
                    (h = typeof d), h === 'string' && (g = bv.exec(d)) && ((d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c))), (h = 'number'));
                    if (d == null || (h === 'number' && isNaN(d))) return;
                    h === 'number' && !f.cssNumber[i] && (d += 'px');
                    if (!k || !('set' in k) || (d = k.set(a, d)) !== b)
                        try {
                            j[c] = d;
                        } catch (l) {}
                }
            },
            css: function (a, c, d) {
                var e, g;
                (c = f.camelCase(c)), (g = f.cssHooks[c]), (c = f.cssProps[c] || c), c === 'cssFloat' && (c = 'float');
                if (g && 'get' in g && (e = g.get(a, !0, d)) !== b) return e;
                if (bz) return bz(a, c);
            },
            swap: function (a, b, c) {
                var d = {};
                for (var e in b) (d[e] = a.style[e]), (a.style[e] = b[e]);
                c.call(a);
                for (e in b) a.style[e] = d[e];
            }
        }),
        (f.curCSS = f.css),
        f.each(['height', 'width'], function (a, b) {
            f.cssHooks[b] = {
                get: function (a, c, d) {
                    var e;
                    if (c) {
                        if (a.offsetWidth !== 0) return bC(a, b, d);
                        f.swap(a, bw, function () {
                            e = bC(a, b, d);
                        });
                        return e;
                    }
                },
                set: function (a, b) {
                    if (!bt.test(b)) return b;
                    b = parseFloat(b);
                    if (b >= 0) return b + 'px';
                }
            };
        }),
        f.support.opacity ||
            (f.cssHooks.opacity = {
                get: function (a, b) {
                    return br.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || '') ? parseFloat(RegExp.$1) / 100 + '' : b ? '1' : '';
                },
                set: function (a, b) {
                    var c = a.style,
                        d = a.currentStyle,
                        e = f.isNumeric(b) ? 'alpha(opacity=' + b * 100 + ')' : '',
                        g = (d && d.filter) || c.filter || '';
                    c.zoom = 1;
                    if (b >= 1 && f.trim(g.replace(bq, '')) === '') {
                        c.removeAttribute('filter');
                        if (d && !d.filter) return;
                    }
                    c.filter = bq.test(g) ? g.replace(bq, e) : g + ' ' + e;
                }
            }),
        f(function () {
            f.support.reliableMarginRight ||
                (f.cssHooks.marginRight = {
                    get: function (a, b) {
                        var c;
                        f.swap(a, { display: 'inline-block' }, function () {
                            b ? (c = bz(a, 'margin-right', 'marginRight')) : (c = a.style.marginRight);
                        });
                        return c;
                    }
                });
        }),
        c.defaultView &&
            c.defaultView.getComputedStyle &&
            (bA = function (a, b) {
                var c, d, e;
                (b = b.replace(bs, '-$1').toLowerCase()),
                    (d = a.ownerDocument.defaultView) &&
                        (e = d.getComputedStyle(a, null)) &&
                        ((c = e.getPropertyValue(b)), c === '' && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b)));
                return c;
            }),
        c.documentElement.currentStyle &&
            (bB = function (a, b) {
                var c,
                    d,
                    e,
                    f = a.currentStyle && a.currentStyle[b],
                    g = a.style;
                f === null && g && (e = g[b]) && (f = e),
                    !bt.test(f) &&
                        bu.test(f) &&
                        ((c = g.left),
                        (d = a.runtimeStyle && a.runtimeStyle.left),
                        d && (a.runtimeStyle.left = a.currentStyle.left),
                        (g.left = b === 'fontSize' ? '1em' : f || 0),
                        (f = g.pixelLeft + 'px'),
                        (g.left = c),
                        d && (a.runtimeStyle.left = d));
                return f === '' ? 'auto' : f;
            }),
        (bz = bA || bB),
        f.expr &&
            f.expr.filters &&
            ((f.expr.filters.hidden = function (a) {
                var b = a.offsetWidth,
                    c = a.offsetHeight;
                return (b === 0 && c === 0) || (!f.support.reliableHiddenOffsets && ((a.style && a.style.display) || f.css(a, 'display')) === 'none');
            }),
            (f.expr.filters.visible = function (a) {
                return !f.expr.filters.hidden(a);
            }));
    var bD = /%20/g,
        bE = /\[\]$/,
        bF = /\r?\n/g,
        bG = /#.*$/,
        bH = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        bI = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        bJ = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        bK = /^(?:GET|HEAD)$/,
        bL = /^\/\//,
        bM = /\?/,
        bN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        bO = /^(?:select|textarea)/i,
        bP = /\s+/,
        bQ = /([?&])_=[^&]*/,
        bR = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        bS = f.fn.load,
        bT = {},
        bU = {},
        bV,
        bW,
        bX = ['*/'] + ['*'];
    try {
        bV = e.href;
    } catch (bY) {
        (bV = c.createElement('a')), (bV.href = ''), (bV = bV.href);
    }
    (bW = bR.exec(bV.toLowerCase()) || []),
        f.fn.extend({
            load: function (a, c, d) {
                if (typeof a != 'string' && bS) return bS.apply(this, arguments);
                if (!this.length) return this;
                var e = a.indexOf(' ');
                if (e >= 0) {
                    var g = a.slice(e, a.length);
                    a = a.slice(0, e);
                }
                var h = 'GET';
                c && (f.isFunction(c) ? ((d = c), (c = b)) : typeof c == 'object' && ((c = f.param(c, f.ajaxSettings.traditional)), (h = 'POST')));
                var i = this;
                f.ajax({
                    url: a,
                    type: h,
                    dataType: 'html',
                    data: c,
                    complete: function (a, b, c) {
                        (c = a.responseText),
                            a.isResolved() &&
                                (a.done(function (a) {
                                    c = a;
                                }),
                                i.html(g ? f('<div>').append(c.replace(bN, '')).find(g) : c)),
                            d && i.each(d, [c, b, a]);
                    }
                });
                return this;
            },
            serialize: function () {
                return f.param(this.serializeArray());
            },
            serializeArray: function () {
                return this.map(function () {
                    return this.elements ? f.makeArray(this.elements) : this;
                })
                    .filter(function () {
                        return this.name && !this.disabled && (this.checked || bO.test(this.nodeName) || bI.test(this.type));
                    })
                    .map(function (a, b) {
                        var c = f(this).val();
                        return c == null
                            ? null
                            : f.isArray(c)
                            ? f.map(c, function (a, c) {
                                  return { name: b.name, value: a.replace(bF, '\r\n') };
                              })
                            : { name: b.name, value: c.replace(bF, '\r\n') };
                    })
                    .get();
            }
        }),
        f.each('ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend'.split(' '), function (a, b) {
            f.fn[b] = function (a) {
                return this.on(b, a);
            };
        }),
        f.each(['get', 'post'], function (a, c) {
            f[c] = function (a, d, e, g) {
                f.isFunction(d) && ((g = g || e), (e = d), (d = b));
                return f.ajax({ type: c, url: a, data: d, success: e, dataType: g });
            };
        }),
        f.extend({
            getScript: function (a, c) {
                return f.get(a, b, c, 'script');
            },
            getJSON: function (a, b, c) {
                return f.get(a, b, c, 'json');
            },
            ajaxSetup: function (a, b) {
                b ? b_(a, f.ajaxSettings) : ((b = a), (a = f.ajaxSettings)), b_(a, b);
                return a;
            },
            ajaxSettings: {
                url: bV,
                isLocal: bJ.test(bW[1]),
                global: !0,
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded',
                processData: !0,
                async: !0,
                accepts: { xml: 'application/xml, text/xml', html: 'text/html', text: 'text/plain', json: 'application/json, text/javascript', '*': bX },
                contents: { xml: /xml/, html: /html/, json: /json/ },
                responseFields: { xml: 'responseXML', text: 'responseText' },
                converters: { '* text': a.String, 'text html': !0, 'text json': f.parseJSON, 'text xml': f.parseXML },
                flatOptions: { context: !0, url: !0 }
            },
            ajaxPrefilter: bZ(bT),
            ajaxTransport: bZ(bU),
            ajax: function (a, c) {
                function w(a, c, l, m) {
                    if (s !== 2) {
                        (s = 2), q && clearTimeout(q), (p = b), (n = m || ''), (v.readyState = a > 0 ? 4 : 0);
                        var o,
                            r,
                            u,
                            w = c,
                            x = l ? cb(d, v, l) : b,
                            y,
                            z;
                        if ((a >= 200 && a < 300) || a === 304) {
                            if (d.ifModified) {
                                if ((y = v.getResponseHeader('Last-Modified'))) f.lastModified[k] = y;
                                if ((z = v.getResponseHeader('Etag'))) f.etag[k] = z;
                            }
                            if (a === 304) (w = 'notmodified'), (o = !0);
                            else
                                try {
                                    (r = cc(d, x)), (w = 'success'), (o = !0);
                                } catch (A) {
                                    (w = 'parsererror'), (u = A);
                                }
                        } else {
                            u = w;
                            if (!w || a) (w = 'error'), a < 0 && (a = 0);
                        }
                        (v.status = a),
                            (v.statusText = '' + (c || w)),
                            o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]),
                            v.statusCode(j),
                            (j = b),
                            t && g.trigger('ajax' + (o ? 'Success' : 'Error'), [v, d, o ? r : u]),
                            i.fireWith(e, [v, w]),
                            t && (g.trigger('ajaxComplete', [v, d]), --f.active || f.event.trigger('ajaxStop'));
                    }
                }
                typeof a == 'object' && ((c = a), (a = b)), (c = c || {});
                var d = f.ajaxSetup({}, c),
                    e = d.context || d,
                    g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event,
                    h = f.Deferred(),
                    i = f.Callbacks('once memory'),
                    j = d.statusCode || {},
                    k,
                    l = {},
                    m = {},
                    n,
                    o,
                    p,
                    q,
                    r,
                    s = 0,
                    t,
                    u,
                    v = {
                        readyState: 0,
                        setRequestHeader: function (a, b) {
                            if (!s) {
                                var c = a.toLowerCase();
                                (a = m[c] = m[c] || a), (l[a] = b);
                            }
                            return this;
                        },
                        getAllResponseHeaders: function () {
                            return s === 2 ? n : null;
                        },
                        getResponseHeader: function (a) {
                            var c;
                            if (s === 2) {
                                if (!o) {
                                    o = {};
                                    while ((c = bH.exec(n))) o[c[1].toLowerCase()] = c[2];
                                }
                                c = o[a.toLowerCase()];
                            }
                            return c === b ? null : c;
                        },
                        overrideMimeType: function (a) {
                            s || (d.mimeType = a);
                            return this;
                        },
                        abort: function (a) {
                            (a = a || 'abort'), p && p.abort(a), w(0, a);
                            return this;
                        }
                    };
                h.promise(v),
                    (v.success = v.done),
                    (v.error = v.fail),
                    (v.complete = i.add),
                    (v.statusCode = function (a) {
                        if (a) {
                            var b;
                            if (s < 2) for (b in a) j[b] = [j[b], a[b]];
                            else (b = a[v.status]), v.then(b, b);
                        }
                        return this;
                    }),
                    (d.url = ((a || d.url) + '').replace(bG, '').replace(bL, bW[1] + '//')),
                    (d.dataTypes = f
                        .trim(d.dataType || '*')
                        .toLowerCase()
                        .split(bP)),
                    d.crossDomain == null &&
                        ((r = bR.exec(d.url.toLowerCase())),
                        (d.crossDomain = !(!r || (r[1] == bW[1] && r[2] == bW[2] && (r[3] || (r[1] === 'http:' ? 80 : 443)) == (bW[3] || (bW[1] === 'http:' ? 80 : 443)))))),
                    d.data && d.processData && typeof d.data != 'string' && (d.data = f.param(d.data, d.traditional)),
                    b$(bT, d, c, v);
                if (s === 2) return !1;
                (t = d.global), (d.type = d.type.toUpperCase()), (d.hasContent = !bK.test(d.type)), t && f.active++ === 0 && f.event.trigger('ajaxStart');
                if (!d.hasContent) {
                    d.data && ((d.url += (bM.test(d.url) ? '&' : '?') + d.data), delete d.data), (k = d.url);
                    if (d.cache === !1) {
                        var x = f.now(),
                            y = d.url.replace(bQ, '$1_=' + x);
                        d.url = y + (y === d.url ? (bM.test(d.url) ? '&' : '?') + '_=' + x : '');
                    }
                }
                ((d.data && d.hasContent && d.contentType !== !1) || c.contentType) && v.setRequestHeader('Content-Type', d.contentType),
                    d.ifModified &&
                        ((k = k || d.url),
                        f.lastModified[k] && v.setRequestHeader('If-Modified-Since', f.lastModified[k]),
                        f.etag[k] && v.setRequestHeader('If-None-Match', f.etag[k])),
                    v.setRequestHeader(
                        'Accept',
                        d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== '*' ? ', ' + bX + '; q=0.01' : '') : d.accepts['*']
                    );
                for (u in d.headers) v.setRequestHeader(u, d.headers[u]);
                if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
                    v.abort();
                    return !1;
                }
                for (u in { success: 1, error: 1, complete: 1 }) v[u](d[u]);
                p = b$(bU, d, c, v);
                if (!p) w(-1, 'No Transport');
                else {
                    (v.readyState = 1),
                        t && g.trigger('ajaxSend', [v, d]),
                        d.async &&
                            d.timeout > 0 &&
                            (q = setTimeout(function () {
                                v.abort('timeout');
                            }, d.timeout));
                    try {
                        (s = 1), p.send(l, w);
                    } catch (z) {
                        if (s < 2) w(-1, z);
                        else throw z;
                    }
                }
                return v;
            },
            param: function (a, c) {
                var d = [],
                    e = function (a, b) {
                        (b = f.isFunction(b) ? b() : b), (d[d.length] = encodeURIComponent(a) + '=' + encodeURIComponent(b));
                    };
                c === b && (c = f.ajaxSettings.traditional);
                if (f.isArray(a) || (a.jquery && !f.isPlainObject(a)))
                    f.each(a, function () {
                        e(this.name, this.value);
                    });
                else for (var g in a) ca(g, a[g], c, e);
                return d.join('&').replace(bD, '+');
            }
        }),
        f.extend({ active: 0, lastModified: {}, etag: {} });
    var cd = f.now(),
        ce = /(\=)\?(&|$)|\?\?/i;
    f.ajaxSetup({
        jsonp: 'callback',
        jsonpCallback: function () {
            return f.expando + '_' + cd++;
        }
    }),
        f.ajaxPrefilter('json jsonp', function (b, c, d) {
            var e = b.contentType === 'application/x-www-form-urlencoded' && typeof b.data == 'string';
            if (b.dataTypes[0] === 'jsonp' || (b.jsonp !== !1 && (ce.test(b.url) || (e && ce.test(b.data))))) {
                var g,
                    h = (b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback),
                    i = a[h],
                    j = b.url,
                    k = b.data,
                    l = '$1' + h + '$2';
                b.jsonp !== !1 && ((j = j.replace(ce, l)), b.url === j && (e && (k = k.replace(ce, l)), b.data === k && (j += (/\?/.test(j) ? '&' : '?') + b.jsonp + '=' + h))),
                    (b.url = j),
                    (b.data = k),
                    (a[h] = function (a) {
                        g = [a];
                    }),
                    d.always(function () {
                        (a[h] = i), g && f.isFunction(i) && a[h](g[0]);
                    }),
                    (b.converters['script json'] = function () {
                        g || f.error(h + ' was not called');
                        return g[0];
                    }),
                    (b.dataTypes[0] = 'json');
                return 'script';
            }
        }),
        f.ajaxSetup({
            accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
            contents: { script: /javascript|ecmascript/ },
            converters: {
                'text script': function (a) {
                    f.globalEval(a);
                    return a;
                }
            }
        }),
        f.ajaxPrefilter('script', function (a) {
            a.cache === b && (a.cache = !1), a.crossDomain && ((a.type = 'GET'), (a.global = !1));
        }),
        f.ajaxTransport('script', function (a) {
            if (a.crossDomain) {
                var d,
                    e = c.head || c.getElementsByTagName('head')[0] || c.documentElement;
                return {
                    send: function (f, g) {
                        (d = c.createElement('script')),
                            (d.async = 'async'),
                            a.scriptCharset && (d.charset = a.scriptCharset),
                            (d.src = a.url),
                            (d.onload = d.onreadystatechange =
                                function (a, c) {
                                    if (c || !d.readyState || /loaded|complete/.test(d.readyState))
                                        (d.onload = d.onreadystatechange = null), e && d.parentNode && e.removeChild(d), (d = b), c || g(200, 'success');
                                }),
                            e.insertBefore(d, e.firstChild);
                    },
                    abort: function () {
                        d && d.onload(0, 1);
                    }
                };
            }
        });
    var cf = a.ActiveXObject
            ? function () {
                  for (var a in ch) ch[a](0, 1);
              }
            : !1,
        cg = 0,
        ch;
    (f.ajaxSettings.xhr = a.ActiveXObject
        ? function () {
              return (!this.isLocal && ci()) || cj();
          }
        : ci),
        (function (a) {
            f.extend(f.support, { ajax: !!a, cors: !!a && 'withCredentials' in a });
        })(f.ajaxSettings.xhr()),
        f.support.ajax &&
            f.ajaxTransport(function (c) {
                if (!c.crossDomain || f.support.cors) {
                    var d;
                    return {
                        send: function (e, g) {
                            var h = c.xhr(),
                                i,
                                j;
                            c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
                            if (c.xhrFields) for (j in c.xhrFields) h[j] = c.xhrFields[j];
                            c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType),
                                !c.crossDomain && !e['X-Requested-With'] && (e['X-Requested-With'] = 'XMLHttpRequest');
                            try {
                                for (j in e) h.setRequestHeader(j, e[j]);
                            } catch (k) {}
                            h.send((c.hasContent && c.data) || null),
                                (d = function (a, e) {
                                    var j, k, l, m, n;
                                    try {
                                        if (d && (e || h.readyState === 4)) {
                                            (d = b), i && ((h.onreadystatechange = f.noop), cf && delete ch[i]);
                                            if (e) h.readyState !== 4 && h.abort();
                                            else {
                                                (j = h.status),
                                                    (l = h.getAllResponseHeaders()),
                                                    (m = {}),
                                                    (n = h.responseXML),
                                                    n && n.documentElement && (m.xml = n),
                                                    (m.text = h.responseText);
                                                try {
                                                    k = h.statusText;
                                                } catch (o) {
                                                    k = '';
                                                }
                                                !j && c.isLocal && !c.crossDomain ? (j = m.text ? 200 : 404) : j === 1223 && (j = 204);
                                            }
                                        }
                                    } catch (p) {
                                        e || g(-1, p);
                                    }
                                    m && g(j, k, m, l);
                                }),
                                !c.async || h.readyState === 4 ? d() : ((i = ++cg), cf && (ch || ((ch = {}), f(a).unload(cf)), (ch[i] = d)), (h.onreadystatechange = d));
                        },
                        abort: function () {
                            d && d(0, 1);
                        }
                    };
                }
            });
    var ck = {},
        cl,
        cm,
        cn = /^(?:toggle|show|hide)$/,
        co = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        cp,
        cq = [['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'], ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'], ['opacity']],
        cr;
    f.fn.extend({
        show: function (a, b, c) {
            var d, e;
            if (a || a === 0) return this.animate(cu('show', 3), a, b, c);
            for (var g = 0, h = this.length; g < h; g++)
                (d = this[g]),
                    d.style &&
                        ((e = d.style.display),
                        !f._data(d, 'olddisplay') && e === 'none' && (e = d.style.display = ''),
                        e === '' && f.css(d, 'display') === 'none' && f._data(d, 'olddisplay', cv(d.nodeName)));
            for (g = 0; g < h; g++) {
                d = this[g];
                if (d.style) {
                    e = d.style.display;
                    if (e === '' || e === 'none') d.style.display = f._data(d, 'olddisplay') || '';
                }
            }
            return this;
        },
        hide: function (a, b, c) {
            if (a || a === 0) return this.animate(cu('hide', 3), a, b, c);
            var d,
                e,
                g = 0,
                h = this.length;
            for (; g < h; g++) (d = this[g]), d.style && ((e = f.css(d, 'display')), e !== 'none' && !f._data(d, 'olddisplay') && f._data(d, 'olddisplay', e));
            for (g = 0; g < h; g++) this[g].style && (this[g].style.display = 'none');
            return this;
        },
        _toggle: f.fn.toggle,
        toggle: function (a, b, c) {
            var d = typeof a == 'boolean';
            f.isFunction(a) && f.isFunction(b)
                ? this._toggle.apply(this, arguments)
                : a == null || d
                ? this.each(function () {
                      var b = d ? a : f(this).is(':hidden');
                      f(this)[b ? 'show' : 'hide']();
                  })
                : this.animate(cu('toggle', 3), a, b, c);
            return this;
        },
        fadeTo: function (a, b, c, d) {
            return this.filter(':hidden').css('opacity', 0).show().end().animate({ opacity: b }, a, c, d);
        },
        animate: function (a, b, c, d) {
            function g() {
                e.queue === !1 && f._mark(this);
                var b = f.extend({}, e),
                    c = this.nodeType === 1,
                    d = c && f(this).is(':hidden'),
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o;
                b.animatedProperties = {};
                for (i in a) {
                    (g = f.camelCase(i)),
                        i !== g && ((a[g] = a[i]), delete a[i]),
                        (h = a[g]),
                        f.isArray(h)
                            ? ((b.animatedProperties[g] = h[1]), (h = a[g] = h[0]))
                            : (b.animatedProperties[g] = (b.specialEasing && b.specialEasing[g]) || b.easing || 'swing');
                    if ((h === 'hide' && d) || (h === 'show' && !d)) return b.complete.call(this);
                    c &&
                        (g === 'height' || g === 'width') &&
                        ((b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY]),
                        f.css(this, 'display') === 'inline' &&
                            f.css(this, 'float') === 'none' &&
                            (!f.support.inlineBlockNeedsLayout || cv(this.nodeName) === 'inline' ? (this.style.display = 'inline-block') : (this.style.zoom = 1)));
                }
                b.overflow != null && (this.style.overflow = 'hidden');
                for (i in a)
                    (j = new f.fx(this, b, i)),
                        (h = a[i]),
                        cn.test(h)
                            ? ((o = f._data(this, 'toggle' + i) || (h === 'toggle' ? (d ? 'show' : 'hide') : 0)),
                              o ? (f._data(this, 'toggle' + i, o === 'show' ? 'hide' : 'show'), j[o]()) : j[h]())
                            : ((k = co.exec(h)),
                              (l = j.cur()),
                              k
                                  ? ((m = parseFloat(k[2])),
                                    (n = k[3] || (f.cssNumber[i] ? '' : 'px')),
                                    n !== 'px' && (f.style(this, i, (m || 1) + n), (l = ((m || 1) / j.cur()) * l), f.style(this, i, l + n)),
                                    k[1] && (m = (k[1] === '-=' ? -1 : 1) * m + l),
                                    j.custom(l, m, n))
                                  : j.custom(l, h, ''));
                return !0;
            }
            var e = f.speed(b, c, d);
            if (f.isEmptyObject(a)) return this.each(e.complete, [!1]);
            a = f.extend({}, a);
            return e.queue === !1 ? this.each(g) : this.queue(e.queue, g);
        },
        stop: function (a, c, d) {
            typeof a != 'string' && ((d = c), (c = a), (a = b)), c && a !== !1 && this.queue(a || 'fx', []);
            return this.each(function () {
                function h(a, b, c) {
                    var e = b[c];
                    f.removeData(a, c, !0), e.stop(d);
                }
                var b,
                    c = !1,
                    e = f.timers,
                    g = f._data(this);
                d || f._unmark(!0, this);
                if (a == null) for (b in g) g[b] && g[b].stop && b.indexOf('.run') === b.length - 4 && h(this, g, b);
                else g[(b = a + '.run')] && g[b].stop && h(this, g, b);
                for (b = e.length; b--; ) e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), (c = !0), e.splice(b, 1));
                (!d || !c) && f.dequeue(this, a);
            });
        }
    }),
        f.each(
            {
                slideDown: cu('show', 1),
                slideUp: cu('hide', 1),
                slideToggle: cu('toggle', 1),
                fadeIn: { opacity: 'show' },
                fadeOut: { opacity: 'hide' },
                fadeToggle: { opacity: 'toggle' }
            },
            function (a, b) {
                f.fn[a] = function (a, c, d) {
                    return this.animate(b, a, c, d);
                };
            }
        ),
        f.extend({
            speed: function (a, b, c) {
                var d =
                    a && typeof a == 'object'
                        ? f.extend({}, a)
                        : { complete: c || (!c && b) || (f.isFunction(a) && a), duration: a, easing: (c && b) || (b && !f.isFunction(b) && b) };
                d.duration = f.fx.off ? 0 : typeof d.duration == 'number' ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
                if (d.queue == null || d.queue === !0) d.queue = 'fx';
                (d.old = d.complete),
                    (d.complete = function (a) {
                        f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this);
                    });
                return d;
            },
            easing: {
                linear: function (a, b, c, d) {
                    return c + d * a;
                },
                swing: function (a, b, c, d) {
                    return (-Math.cos(a * Math.PI) / 2 + 0.5) * d + c;
                }
            },
            timers: [],
            fx: function (a, b, c) {
                (this.options = b), (this.elem = a), (this.prop = c), (b.orig = b.orig || {});
            }
        }),
        (f.fx.prototype = {
            update: function () {
                this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this);
            },
            cur: function () {
                if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop];
                var a,
                    b = f.css(this.elem, this.prop);
                return isNaN((a = parseFloat(b))) ? (!b || b === 'auto' ? 0 : b) : a;
            },
            custom: function (a, c, d) {
                function h(a) {
                    return e.step(a);
                }
                var e = this,
                    g = f.fx;
                (this.startTime = cr || cs()),
                    (this.end = c),
                    (this.now = this.start = a),
                    (this.pos = this.state = 0),
                    (this.unit = d || this.unit || (f.cssNumber[this.prop] ? '' : 'px')),
                    (h.queue = this.options.queue),
                    (h.elem = this.elem),
                    (h.saveState = function () {
                        e.options.hide && f._data(e.elem, 'fxshow' + e.prop) === b && f._data(e.elem, 'fxshow' + e.prop, e.start);
                    }),
                    h() && f.timers.push(h) && !cp && (cp = setInterval(g.tick, g.interval));
            },
            show: function () {
                var a = f._data(this.elem, 'fxshow' + this.prop);
                (this.options.orig[this.prop] = a || f.style(this.elem, this.prop)),
                    (this.options.show = !0),
                    a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === 'width' || this.prop === 'height' ? 1 : 0, this.cur()),
                    f(this.elem).show();
            },
            hide: function () {
                (this.options.orig[this.prop] = f._data(this.elem, 'fxshow' + this.prop) || f.style(this.elem, this.prop)), (this.options.hide = !0), this.custom(this.cur(), 0);
            },
            step: function (a) {
                var b,
                    c,
                    d,
                    e = cr || cs(),
                    g = !0,
                    h = this.elem,
                    i = this.options;
                if (a || e >= i.duration + this.startTime) {
                    (this.now = this.end), (this.pos = this.state = 1), this.update(), (i.animatedProperties[this.prop] = !0);
                    for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1);
                    if (g) {
                        i.overflow != null &&
                            !f.support.shrinkWrapBlocks &&
                            f.each(['', 'X', 'Y'], function (a, b) {
                                h.style['overflow' + b] = i.overflow[a];
                            }),
                            i.hide && f(h).hide();
                        if (i.hide || i.show) for (b in i.animatedProperties) f.style(h, b, i.orig[b]), f.removeData(h, 'fxshow' + b, !0), f.removeData(h, 'toggle' + b, !0);
                        (d = i.complete), d && ((i.complete = !1), d.call(h));
                    }
                    return !1;
                }
                i.duration == Infinity
                    ? (this.now = e)
                    : ((c = e - this.startTime),
                      (this.state = c / i.duration),
                      (this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration)),
                      (this.now = this.start + (this.end - this.start) * this.pos)),
                    this.update();
                return !0;
            }
        }),
        f.extend(f.fx, {
            tick: function () {
                var a,
                    b = f.timers,
                    c = 0;
                for (; c < b.length; c++) (a = b[c]), !a() && b[c] === a && b.splice(c--, 1);
                b.length || f.fx.stop();
            },
            interval: 13,
            stop: function () {
                clearInterval(cp), (cp = null);
            },
            speeds: { slow: 600, fast: 200, _default: 400 },
            step: {
                opacity: function (a) {
                    f.style(a.elem, 'opacity', a.now);
                },
                _default: function (a) {
                    a.elem.style && a.elem.style[a.prop] != null ? (a.elem.style[a.prop] = a.now + a.unit) : (a.elem[a.prop] = a.now);
                }
            }
        }),
        f.each(['width', 'height'], function (a, b) {
            f.fx.step[b] = function (a) {
                f.style(a.elem, b, Math.max(0, a.now) + a.unit);
            };
        }),
        f.expr &&
            f.expr.filters &&
            (f.expr.filters.animated = function (a) {
                return f.grep(f.timers, function (b) {
                    return a === b.elem;
                }).length;
            });
    var cw = /^t(?:able|d|h)$/i,
        cx = /^(?:body|html)$/i;
    'getBoundingClientRect' in c.documentElement
        ? (f.fn.offset = function (a) {
              var b = this[0],
                  c;
              if (a)
                  return this.each(function (b) {
                      f.offset.setOffset(this, a, b);
                  });
              if (!b || !b.ownerDocument) return null;
              if (b === b.ownerDocument.body) return f.offset.bodyOffset(b);
              try {
                  c = b.getBoundingClientRect();
              } catch (d) {}
              var e = b.ownerDocument,
                  g = e.documentElement;
              if (!c || !f.contains(g, b)) return c ? { top: c.top, left: c.left } : { top: 0, left: 0 };
              var h = e.body,
                  i = cy(e),
                  j = g.clientTop || h.clientTop || 0,
                  k = g.clientLeft || h.clientLeft || 0,
                  l = i.pageYOffset || (f.support.boxModel && g.scrollTop) || h.scrollTop,
                  m = i.pageXOffset || (f.support.boxModel && g.scrollLeft) || h.scrollLeft,
                  n = c.top + l - j,
                  o = c.left + m - k;
              return { top: n, left: o };
          })
        : (f.fn.offset = function (a) {
              var b = this[0];
              if (a)
                  return this.each(function (b) {
                      f.offset.setOffset(this, a, b);
                  });
              if (!b || !b.ownerDocument) return null;
              if (b === b.ownerDocument.body) return f.offset.bodyOffset(b);
              var c,
                  d = b.offsetParent,
                  e = b,
                  g = b.ownerDocument,
                  h = g.documentElement,
                  i = g.body,
                  j = g.defaultView,
                  k = j ? j.getComputedStyle(b, null) : b.currentStyle,
                  l = b.offsetTop,
                  m = b.offsetLeft;
              while ((b = b.parentNode) && b !== i && b !== h) {
                  if (f.support.fixedPosition && k.position === 'fixed') break;
                  (c = j ? j.getComputedStyle(b, null) : b.currentStyle),
                      (l -= b.scrollTop),
                      (m -= b.scrollLeft),
                      b === d &&
                          ((l += b.offsetTop),
                          (m += b.offsetLeft),
                          f.support.doesNotAddBorder &&
                              (!f.support.doesAddBorderForTableAndCells || !cw.test(b.nodeName)) &&
                              ((l += parseFloat(c.borderTopWidth) || 0), (m += parseFloat(c.borderLeftWidth) || 0)),
                          (e = d),
                          (d = b.offsetParent)),
                      f.support.subtractsBorderForOverflowNotVisible &&
                          c.overflow !== 'visible' &&
                          ((l += parseFloat(c.borderTopWidth) || 0), (m += parseFloat(c.borderLeftWidth) || 0)),
                      (k = c);
              }
              if (k.position === 'relative' || k.position === 'static') (l += i.offsetTop), (m += i.offsetLeft);
              f.support.fixedPosition && k.position === 'fixed' && ((l += Math.max(h.scrollTop, i.scrollTop)), (m += Math.max(h.scrollLeft, i.scrollLeft)));
              return { top: l, left: m };
          }),
        (f.offset = {
            bodyOffset: function (a) {
                var b = a.offsetTop,
                    c = a.offsetLeft;
                f.support.doesNotIncludeMarginInBodyOffset && ((b += parseFloat(f.css(a, 'marginTop')) || 0), (c += parseFloat(f.css(a, 'marginLeft')) || 0));
                return { top: b, left: c };
            },
            setOffset: function (a, b, c) {
                var d = f.css(a, 'position');
                d === 'static' && (a.style.position = 'relative');
                var e = f(a),
                    g = e.offset(),
                    h = f.css(a, 'top'),
                    i = f.css(a, 'left'),
                    j = (d === 'absolute' || d === 'fixed') && f.inArray('auto', [h, i]) > -1,
                    k = {},
                    l = {},
                    m,
                    n;
                j ? ((l = e.position()), (m = l.top), (n = l.left)) : ((m = parseFloat(h) || 0), (n = parseFloat(i) || 0)),
                    f.isFunction(b) && (b = b.call(a, c, g)),
                    b.top != null && (k.top = b.top - g.top + m),
                    b.left != null && (k.left = b.left - g.left + n),
                    'using' in b ? b.using.call(a, k) : e.css(k);
            }
        }),
        f.fn.extend({
            position: function () {
                if (!this[0]) return null;
                var a = this[0],
                    b = this.offsetParent(),
                    c = this.offset(),
                    d = cx.test(b[0].nodeName) ? { top: 0, left: 0 } : b.offset();
                (c.top -= parseFloat(f.css(a, 'marginTop')) || 0),
                    (c.left -= parseFloat(f.css(a, 'marginLeft')) || 0),
                    (d.top += parseFloat(f.css(b[0], 'borderTopWidth')) || 0),
                    (d.left += parseFloat(f.css(b[0], 'borderLeftWidth')) || 0);
                return { top: c.top - d.top, left: c.left - d.left };
            },
            offsetParent: function () {
                return this.map(function () {
                    var a = this.offsetParent || c.body;
                    while (a && !cx.test(a.nodeName) && f.css(a, 'position') === 'static') a = a.offsetParent;
                    return a;
                });
            }
        }),
        f.each(['Left', 'Top'], function (a, c) {
            var d = 'scroll' + c;
            f.fn[d] = function (c) {
                var e, g;
                if (c === b) {
                    e = this[0];
                    if (!e) return null;
                    g = cy(e);
                    return g ? ('pageXOffset' in g ? g[a ? 'pageYOffset' : 'pageXOffset'] : (f.support.boxModel && g.document.documentElement[d]) || g.document.body[d]) : e[d];
                }
                return this.each(function () {
                    (g = cy(this)), g ? g.scrollTo(a ? f(g).scrollLeft() : c, a ? c : f(g).scrollTop()) : (this[d] = c);
                });
            };
        }),
        f.each(['Height', 'Width'], function (a, c) {
            var d = c.toLowerCase();
            (f.fn['inner' + c] = function () {
                var a = this[0];
                return a ? (a.style ? parseFloat(f.css(a, d, 'padding')) : this[d]()) : null;
            }),
                (f.fn['outer' + c] = function (a) {
                    var b = this[0];
                    return b ? (b.style ? parseFloat(f.css(b, d, a ? 'margin' : 'border')) : this[d]()) : null;
                }),
                (f.fn[d] = function (a) {
                    var e = this[0];
                    if (!e) return a == null ? null : this;
                    if (f.isFunction(a))
                        return this.each(function (b) {
                            var c = f(this);
                            c[d](a.call(this, b, c[d]()));
                        });
                    if (f.isWindow(e)) {
                        var g = e.document.documentElement['client' + c],
                            h = e.document.body;
                        return (e.document.compatMode === 'CSS1Compat' && g) || (h && h['client' + c]) || g;
                    }
                    if (e.nodeType === 9)
                        return Math.max(
                            e.documentElement['client' + c],
                            e.body['scroll' + c],
                            e.documentElement['scroll' + c],
                            e.body['offset' + c],
                            e.documentElement['offset' + c]
                        );
                    if (a === b) {
                        var i = f.css(e, d),
                            j = parseFloat(i);
                        return f.isNumeric(j) ? j : i;
                    }
                    return this.css(d, typeof a == 'string' ? a : a + 'px');
                });
        }),
        (a.jQuery = a.$ = f),
        typeof define == 'function' &&
            define.amd &&
            define.amd.jQuery &&
            define('jquery', [], function () {
                return f;
            });
})(window);

/*! webVideoCtrl */
!(function () {
    var e, K;
    window.WebVideoCtrl ||
        ((e = (function () {
            var o = '100%',
                r = '100%',
                a = {
                    szversion: 'V3.3.8 build20241012',
                    szContainerID: '',
                    szColorProperty: '',
                    szBasePath: '',
                    iWndowType: 1,
                    bWndFull: !0,
                    iPackageType: 2,
                    bDebugMode: !0,
                    cbSelWnd: null,
                    cbDoubleClickWnd: null,
                    cbEvent: null,
                    cbInitPluginComplete: null,
                    iTopHeight: 0
                },
                u = null,
                c = 0,
                t = !1,
                g = [],
                l = [],
                y = null,
                S = null,
                p = this,
                h = null,
                d = 1,
                s = 1e3,
                I = 3e3,
                f = 3002,
                P = 3003,
                m = 3004,
                x = 5e3,
                e = 0,
                C = 'IPCamera',
                v = 'IPDome',
                T = 'IPZoom',
                q = function (e) {
                    (c = e),
                        a.cbSelWnd && ((e = []).push('<RealPlayInfo>'), e.push('<SelectWnd>' + c + '</SelectWnd>'), e.push('</RealPlayInfo>'), a.cbSelWnd(S.loadXML(e.join(''))));
                },
                B = function (e) {
                    a.cbDoubleClickWnd && 2 === e.eventType && (a.bWndFull && -1 != p.findWndIndexByIndex(e.wndIndex) && (t = !t), a.cbDoubleClickWnd(e.wndIndex, t));
                },
                k = function (e, t, n) {
                    var i = s;
                    0 === t ? (i = f) : 2 === t ? (i = P) : 3 === t ? (i = x) : 21 === t && (i = m),
                        f == i || P == i ? p.I_Stop(e) : m == i ? p.I_StopRecord(e) : x == i && p.I_StopVoiceTalk(),
                        a.cbEvent && a.cbEvent(i, e, n);
                },
                Z = function (e) {
                    100 === parseInt(e, 10) && ((t = !1), a.cbDoubleClickWnd) && a.cbDoubleClickWnd(c, t);
                };
            let X = (function (e, t) {
                    let n = -1;
                    return function () {
                        clearTimeout(n), (n = setTimeout(e, t));
                    };
                })(async () => {
                    H();
                }, 80),
                H =
                    (window.addEventListener('scroll', function () {
                        var e;
                        null !== u && ((e = $('#' + a.szContainerID)), u.JS_Resize(e.width(), e.height())), X();
                    }),
                    () => {
                        var e = $('#' + a.szContainerID),
                            t = $(window).width(),
                            n = $(window).height();
                        let i = '';
                        if (!e.get(0)) return !1;
                        i = e.get(0).getBoundingClientRect();
                        var o = a.iTopHeight || 0,
                            r = i.left < 0 ? Math.abs(i.left) : 0,
                            o = i.top < o ? Math.abs(i.top - o) : 0,
                            t = 0 < i.right - t ? Math.round(i.right - t) : 0,
                            n = 0 < i.bottom - n ? Math.round(i.bottom - n) : 0,
                            s = e.width(),
                            e = e.height(),
                            r = s < r ? s : r,
                            t = s < t ? s : t,
                            n = e < n ? e : n;
                        e <= (o = e < o ? e : o) || s <= r || s <= t || e <= n ? this.I_HidPlugin() : this.I_ShowPlugin(), D('left', r), D('top', o), D('right', t), D('bottom', n);
                    }),
                D = async (e, t) => (console.log(e, t), u.JS_SetWndCover(e, t));
            var w = { errorCode: 2e3, errorMsg: 'The device is not login.' },
                _ = { errorCode: s, errorMsg: 'Unknown error.' },
                z = { errorCode: 1002, errorMsg: 'Params error.' },
                U = function () {
                    return new Promise(function (t, e) {
                        u.JS_GetLocalConfig().then(
                            e => {
                                (h = e), t();
                            },
                            () => {
                                e();
                            }
                        );
                    });
                },
                J = function (a) {
                    return new Promise(function (e, t) {
                        var n = a.oProtocolInc.getDeviceInfo(a, {}),
                            i = a.oProtocolInc.getAnalogChannelInfo(a, {}),
                            o = a.oProtocolInc.getAudioInfo(a, {}),
                            r = M(a),
                            s = a.oProtocolInc.getDeviceMinusLocalTime(a);
                        Promise.all([n, i, o, r, s]).then(
                            () => {
                                e();
                            },
                            () => {
                                e();
                            }
                        );
                    });
                },
                E = function () {
                    u.JS_SetWindowControlCallback({
                        onGetSelectWndInfo: e => {
                            q(e);
                        },
                        onPluginEventHandler: (e, t, n) => {
                            k(e, t, n);
                        },
                        KeyBoardEvent: e => {
                            Z(e);
                        },
                        onMouseEvent: function (e) {
                            B(e);
                        }
                    });
                },
                M = function (s) {
                    return new Promise(async (e, t) => {
                        var n = null;
                        if (await O(s)) n = await b(s);
                        else {
                            for (var i = await F(s), o = !1, r = 0; r < i.length; r++)
                                if (i[r].ipv4 == s.szIP || i[r].ipv6 == s.szIP) {
                                    o = !0;
                                    break;
                                }
                            (o || (-1 == (n = await N(s)).iRtspPort && -1 == n.iDevicePort)) && (n = await b(s));
                        }
                        (s.iRtspPort = n.iRtspPort), (s.iHttpPort = n.iHttpPort), e(n);
                    });
                },
                b = function (t) {
                    return new Promise((o, e) => {
                        var r = -1,
                            s = -1,
                            a = -1;
                        t.oProtocolInc.getPortInfo(t, {
                            async: !1,
                            success: function (e) {
                                var t = K.$XML(e).find('AdminAccessProtocol', !0);
                                r = 554;
                                for (var n = 0, i = t.length; n < i; n++)
                                    'rtsp' === K.$XML(t).eq(n).find('protocol').eq(0).text().toLowerCase() && (r = parseInt(K.$XML(t).eq(n).find('portNo').eq(0).text(), 10)),
                                        'http' === K.$XML(t).eq(n).find('protocol').eq(0).text().toLowerCase() && (s = parseInt(K.$XML(t).eq(n).find('portNo').eq(0).text(), 10)),
                                        'dev_manage' === K.$XML(t).eq(n).find('protocol').eq(0).text().toLowerCase() &&
                                            (a = parseInt(K.$XML(t).eq(n).find('portNo').eq(0).text(), 10));
                                o({ iRtspPort: r, iHttpPort: s, iDevicePort: a });
                            },
                            error: function () {
                                o({ iRtspPort: -1, iHttpPort: -1, iDevicePort: -1 });
                            }
                        });
                    });
                },
                N = function (t) {
                    return new Promise((o, e) => {
                        var r = -1,
                            s = -1,
                            a = -1;
                        t.oProtocolInc.getUPnPPortStatus(t, {
                            async: !1,
                            success: function (e) {
                                for (var t = K.$XML(e).find('portStatus', !0), n = 0, i = t.length; n < i; n++)
                                    'rtsp' == K.$XML(t).eq(n).find('internalPort').eq(0).text().toLowerCase() &&
                                        (r = parseInt(K.$XML(t).eq(n).find('externalPort').eq(0).text(), 10)),
                                        'http' == K.$XML(t).eq(n).find('internalPort').eq(0).text().toLowerCase() &&
                                            (s = parseInt(K.$XML(t).eq(n).find('externalPort').eq(0).text(), 10)),
                                        'admin' == K.$XML(t).eq(n).find('internalPort').eq(0).text().toLowerCase() &&
                                            (a = parseInt(K.$XML(t).eq(n).find('externalPort').eq(0).text(), 10));
                                o({ iRtspPort: r, iHttpPort: s, iDevicePort: a });
                            },
                            error: function () {
                                o({ iRtspPort: -1, iHttpPort: -1, iDevicePort: -1 });
                            }
                        });
                    });
                },
                F = function (t) {
                    return new Promise(function (i) {
                        var o = [];
                        t.oProtocolInc.getNetworkBond(t, {
                            async: !1,
                            success: function (e) {
                                'true' == K.$XML(e).find('enabled').eq(0).text()
                                    ? (o.push({
                                          ipv4: K.$XML(e).find('ipAddress').eq(0).text(),
                                          ipv6: K.$XML(e).find('ipv6Address').eq(0).text()
                                      }),
                                      i(o))
                                    : t.oProtocolInc.getNetworkInterface(t, {
                                          async: !1,
                                          success: function (e) {
                                              for (var t = 0, n = K.$XML(e).find('NetworkInterface', !0).length; t < n; t++) {
                                                  o.push({
                                                      ipv4: K.$XML(e).find('ipAddress').eq(0).text(),
                                                      ipv6: K.$XML(e).find('ipv6Address').eq(0).text()
                                                  });
                                                  break;
                                              }
                                              i(o);
                                          },
                                          error: function () {
                                              i(o);
                                          }
                                      });
                            },
                            error: function () {
                                t.oProtocolInc.getNetworkInterface(t, {
                                    async: !1,
                                    success: function (e) {
                                        for (var t = 0, n = K.$XML(e).find('NetworkInterface', !0).length; t < n; t++) {
                                            o.push({
                                                ipv4: K.$XML(e).find('ipAddress').eq(0).text(),
                                                ipv6: K.$XML(e).find('ipv6Address').eq(0).text()
                                            });
                                            break;
                                        }
                                        i(o);
                                    },
                                    error: function () {
                                        i(o);
                                    }
                                });
                            }
                        });
                    });
                },
                O = function (e) {
                    return new Promise(function (t) {
                        var n = !1;
                        e.oProtocolInc.getPPPoEStatus(e, {
                            success: function (e) {
                                (n = 0 < K.$XML(e).find('ipAddress', !0).length || 0 < K.$XML(e).find('ipv6Address', !0).length), t(n);
                            },
                            error: function () {
                                t((n = !1));
                            }
                        });
                    });
                },
                V = function (e, t, n, i, o, r, s) {
                    (t.szIP = n),
                        2 == i ? ((t.szHttpProtocol = 'https://'), (t.iHttpsPort = o)) : ((t.szHttpProtocol = 'http://'), (t.iHttpPort = o)),
                        (t.iCGIPort = o),
                        (t.szDeviceIdentify = n + '_' + o),
                        (t.iDeviceProtocol = d),
                        (t.oProtocolInc = e),
                        (t.szAuth = S.Base64.encode(':' + r + ':' + s));
                };
            function j() {
                (this.szIP = ''),
                    (this.szHostName = ''),
                    (this.szAuth = ''),
                    (this.szHttpProtocol = 'http://'),
                    (this.iCGIPort = 80),
                    (this.szDeviceIdentify = ''),
                    (this.iDevicePort = -1),
                    (this.iHttpPort = -1),
                    (this.iHttpsPort = -1),
                    (this.iRtspPort = -1),
                    (this.iAudioType = 1),
                    (this.m_iAudioBitRate = -1),
                    (this.m_iAudioSamplingRate = -1),
                    (this.iDeviceProtocol = d),
                    (this.oProtocolInc = null),
                    (this.iAnalogChannelNum = 0),
                    (this.szDeviceType = ''),
                    (this.bVoiceTalk = !1),
                    (this.iDeviceMinusLocalTime = 0);
            }
            (this.I_SupportNoPlugin = function () {
                return !1;
            }),
                (this.I_Resize = function (e, t) {
                    return u.JS_Resize(e, t);
                }),
                (this.I_InitPlugin = function (t) {
                    S.extend(a, t), (a.aIframe = t.aIframe);
                    var e = S.getDirName();
                    !e ||
                        ('object' == typeof exports && 'undefined' != typeof module) ||
                        ('function' == typeof define && define.amd
                            ? require([e + '/jsVideoPlugin-1.0.0.min.js'], function (e) {
                                  (window.JSVideoPlugin = e.JSVideoPlugin), t.cbInitPluginComplete && t.cbInitPluginComplete();
                              })
                            : S.loadScript(e + '/jsVideoPlugin-1.0.0.min.js', function () {
                                  t.cbInitPluginComplete && t.cbInitPluginComplete();
                              })),
                        window.addEventListener('resize', function () {
                            var e;
                            null !== u && ((e = $('#' + a.szContainerID)), u.JS_Resize(e.width(), e.height()));
                        }),
                        window.addEventListener('unload', function () {});
                }),
                (this.I_InsertOBJECTPlugin = function (e) {
                    return (
                        (i = e),
                        new Promise(function (t, n) {
                            var e;
                            S.isUndefined(i) || (a.szContainerID = i),
                                null == document.getElementById(a.szContainerID)
                                    ? n(z)
                                    : ((e = {
                                          szId: i,
                                          aIframe: a.aIframe,
                                          bEmbed: !!a.aIframe,
                                          iType: 1,
                                          iWidth: o,
                                          iHeight: r,
                                          iMaxSplit: 4,
                                          iCurrentSplit: a.iWndowType,
                                          iServicePortStart: 34686,
                                          iServicePortEnd: 34690,
                                          oSessionInfo: {
                                              sessionID: '11c12b3257f037bb50052db3ac5e342572c3d963622baca122755c482ce8823a',
                                              user: 'admin',
                                              challenge: '275816f02ec2dca22b6a6ae87c7cb7e3',
                                              iterations: 100,
                                              random: '34765058'
                                          },
                                          iPluginType: 2,
                                          onConnectSuccess: () => {
                                              var e = $('#' + i);
                                              u.JS_Resize(e.width(), e.height()),
                                                  2 !== u.iPluginMode
                                                      ? n({
                                                            errorCode: I,
                                                            errorMsg: 'Plugin init failed.'
                                                        })
                                                      : ((e = a.bWndFull ? 1 : 0),
                                                        u.JS_SetFullScreenCapability(e),
                                                        u.JS_SetPackageType(a.iPackageType),
                                                        E(),
                                                        U().then(() => {
                                                            t();
                                                        }));
                                          },
                                          onConnectError: () => {
                                              n({ errorCode: I, errorMsg: 'Plugin init failed.' });
                                          },
                                          szBasePath: S.getDirName()
                                      }),
                                      (u = new JSVideoPlugin(e)));
                        })
                    );
                    var i;
                }),
                (this.I_WriteOBJECT_XHTML = function () {
                    return 0;
                }),
                (this.I_ShowPlugin = function () {
                    return new Promise(function (e, t) {
                        u.JS_ShowWnd().then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_HidPlugin = function () {
                    return new Promise(function (e, t) {
                        u.JS_HideWnd().then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_DestroyPlugin = function () {
                    return new Promise(function (e) {
                        u.JS_DestroyPlugin().then(
                            () => {
                                e();
                            },
                            () => {
                                reject(_);
                            }
                        );
                    });
                }),
                (this.I_OpenFileDlg = async function (n) {
                    return new Promise(function (t, e) {
                        u.JS_OpenFileBrowser(n, '').then(
                            e => {
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_GetLocalCfg = function () {
                    return new Promise(function (t, e) {
                        u.JS_GetLocalConfig().then(
                            e => {
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_SetLocalCfg = function (n) {
                    return new Promise(function (e, t) {
                        u.JS_SetLocalConfig(n).then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_Login = function (p, h, I, f, P, m) {
                    return new Promise(function (e, t) {
                        var n, i, o, r, s, a, d, c, u, l;
                        -1 != this.findDeviceIndexByIP(p + '_' + I)
                            ? (m.error &&
                                  m.error({
                                      errorCode: 2001,
                                      errorMsg: 'The device is already login.'
                                  }),
                              t({
                                  errorCode: 2001,
                                  errorMsg: 'The device is already login.'
                              }))
                            : ((l = y),
                              (n = new j()),
                              (i = l),
                              (o = n),
                              (r = p),
                              (s = h),
                              (a = I),
                              (d = f),
                              (c = P),
                              (u = m),
                              (l = { success: null, error: null }),
                              S.extend(l, u),
                              S.extend(l, {
                                  success: function (e) {
                                      V(i, o, r, s, a, d, c),
                                          g.push(o),
                                          J(o).then(() => {
                                              u.success && u.success(e);
                                          });
                                  },
                                  error: function (e) {
                                      u.error && u.error(e);
                                  }
                              }),
                              i.digestLogin(r, s, a, d, c, l).then(
                                  () => {
                                      e();
                                  },
                                  e => {
                                      t(e);
                                  }
                              ));
                    });
                }),
                (this.I_Logout = function (i) {
                    return new Promise(function (e, t) {
                        var n = this.findDeviceIndexByIP(i);
                        -1 != n && (g.splice(n, 1), e());
                    });
                }),
                (this.I_GetAudioInfo = function (i, o) {
                    return new Promise(function (t, n) {
                        var e = this.findDeviceIndexByIP(i);
                        -1 != e
                            ? (e = g[e]).oProtocolInc.getAudioInfo(e, o).then(
                                  e => {
                                      t(e);
                                  },
                                  e => {
                                      n(e);
                                  }
                              )
                            : n(w);
                    });
                }),
                (this.I_GetDeviceInfo = function (i, o) {
                    return new Promise(function (t, n) {
                        var e = this.findDeviceIndexByIP(i);
                        -1 != e
                            ? (e = g[e]).oProtocolInc.getDeviceInfo(e, o).then(
                                  e => {
                                      t(e);
                                  },
                                  e => {
                                      n(e);
                                  }
                              )
                            : n(w);
                    });
                }),
                (this.I_GetAnalogChannelInfo = function (i, o) {
                    return new Promise(function (t, n) {
                        var e = this.findDeviceIndexByIP(i);
                        -1 != e
                            ? (e = g[e]).oProtocolInc.getAnalogChannelInfo(e, o).then(
                                  e => {
                                      t(e);
                                  },
                                  e => {
                                      n(e);
                                  }
                              )
                            : n(w);
                    });
                }),
                (this.I_GetDigitalChannelInfo = function (i, o) {
                    return new Promise(function (t, n) {
                        var e = this.findDeviceIndexByIP(i);
                        -1 != e
                            ? (e = g[e]).oProtocolInc.getDigitalChannelInfo(e, o).then(
                                  e => {
                                      t(e);
                                  },
                                  e => {
                                      n(e);
                                  }
                              )
                            : n(w);
                    });
                }),
                (this.I_GetZeroChannelInfo = function (i, o) {
                    return new Promise(function (t, n) {
                        var e = this.findDeviceIndexByIP(i);
                        -1 != e
                            ? (e = g[e]).oProtocolInc.getZeroChannelInfo(e, o).then(
                                  e => {
                                      t(e);
                                  },
                                  e => {
                                      n(e);
                                  }
                              )
                            : n(w);
                    });
                }),
                (this.I_StartRealPlay = function (o, r) {
                    return new Promise(function (e, t) {
                        var n = this.findDeviceIndexByIP(o),
                            i = {
                                iWndIndex: c,
                                iStreamType: 1,
                                iChannelID: 1,
                                bZeroChannel: !1
                            };
                        S.extend(i, r),
                            -1 != n
                                ? ((n = g[n]),
                                  -1 == this.findWndIndexByIndex(i.iWndIndex)
                                      ? n.oProtocolInc.startRealPlay(n, i).then(
                                            function () {
                                                r.success && r.success(), e();
                                            },
                                            function () {
                                                r.error && r.error(_), t(_);
                                            }
                                        )
                                      : t({
                                            errorCode: 3001,
                                            errorMsg: 'The window is already playing.'
                                        }))
                                : (r.error && r.error(w), t(w));
                    });
                }),
                (this.I_StartPlay = function (o, r) {
                    return new Promise(async function (e, t) {
                        var n = this.findDeviceIndexByIP(o),
                            i = { iWndIndex: c },
                            n = (S.extend(i, r), g[n]);
                        -1 == this.findWndIndexByIndex(i.iWndIndex)
                            ? n.oProtocolInc.startPlay(n, i).then(
                                  function () {
                                      r.success && r.success(), e();
                                  },
                                  function () {
                                      r.error && r.error(_), t(_);
                                  }
                              )
                            : t({
                                  errorCode: 3001,
                                  errorMsg: 'The window is already playing.'
                              });
                    });
                }),
                (this.I_SetSecretKey = function (n) {
                    return new Promise((e, t) => {
                        u.JS_SetSecretKey(0, n, 1).then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_GetEncryptString = function (n) {
                    return new Promise((t, e) => {
                        u.JS_GetEncryptString(3, n).then(
                            e => {
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_Stop = function (r) {
                    return new Promise(async function (e, t) {
                        var n,
                            i = { iWndIndex: c },
                            o = (S.isObject(r) ? S.extend(i, r) : S.isUndefined(r) || (i.iWndIndex = r), this.findWndIndexByIndex(i.iWndIndex));
                        -1 != o
                            ? ((n = l[o]).bRecord && u.JS_StopSave(n.iIndex),
                              n.bSound && u.JS_CloseSound(),
                              n.bEZoom && u.JS_DisableZoom(n.iIndex),
                              u.JS_Stop(i.iWndIndex).then(
                                  () => {
                                      l.splice(o, 1), i.success && i.success(), e();
                                  },
                                  () => {
                                      i.error && i.error(_), t(_);
                                  }
                              ))
                            : e();
                    });
                }),
                (this.I_StopAllPlay = function () {
                    return new Promise(async function (e, t) {
                        u.JS_StopRealPlayAll().then(
                            () => {
                                (l.length = 0), e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_OpenSound = function (o) {
                    return (
                        (o = S.isUndefined(o) ? c : o),
                        new Promise((e, t) => {
                            var n,
                                i = this.findWndIndexByIndex(o);
                            -1 == i || (n = l[i]).bSound
                                ? t(_)
                                : u.JS_OpenSound(o).then(
                                      () => {
                                          (n.bSound = !0), e();
                                      },
                                      () => {
                                          t(_);
                                      }
                                  );
                        })
                    );
                }),
                (this.I_CloseSound = function (o) {
                    return (
                        (o = S.isUndefined(o) ? c : o),
                        new Promise((e, t) => {
                            var n,
                                i = this.findWndIndexByIndex(o);
                            -1 != i && (n = l[i]).bSound
                                ? u.JS_CloseSound().then(
                                      () => {
                                          (n.bSound = !1), e();
                                      },
                                      () => {
                                          t(_);
                                      }
                                  )
                                : t(_);
                        })
                    );
                }),
                (this.I_SetVolume = function (n, i) {
                    return new Promise((e, t) => {
                        (n = parseInt(n, 10)),
                            isNaN(n) || n < 0 || 100 < n
                                ? t(z)
                                : ((i = S.isUndefined(i) ? c : i),
                                  -1 != this.findWndIndexByIndex(i)
                                      ? u.JS_SetVolume(i, n).then(
                                            () => {
                                                e();
                                            },
                                            () => {
                                                t(_);
                                            }
                                        )
                                      : t(_));
                    });
                }),
                (this.I_CapturePic = function (i, o) {
                    return new Promise((e, t) => {
                        var n = { iWndIndex: c, bDateDir: !0 };
                        S.isObject(o) ? S.extend(n, o) : S.isUndefined(o) || (n.iWndIndex = o),
                            -1 != this.findWndIndexByIndex(n.iWndIndex)
                                ? ('.jpg' === i.slice(-4).toLowerCase() ? (i = i.slice(0, -4)) : '.jpeg' === i.slice(-5).toLowerCase() && (i = i.slice(0, -5)),
                                  u.JS_CapturePicture(n.iWndIndex, i, n.bDateDir).then(
                                      () => {
                                          e();
                                      },
                                      () => {
                                          t(_);
                                      }
                                  ))
                                : t(_);
                    });
                }),
                (this.I_CapturePicData = function (i) {
                    return new Promise((t, n) => {
                        var e = { iWndIndex: c, bDateDir: !0 };
                        S.isObject(i) ? S.extend(e, i) : S.isUndefined(i) || (e.iWndIndex = i),
                            -1 != this.findWndIndexByIndex(e.iWndIndex)
                                ? u.JS_GetCaptureData(e.iWndIndex).then(
                                      function (e) {
                                          t(e);
                                      },
                                      function (e) {
                                          n(_);
                                      }
                                  )
                                : n(_);
                    });
                }),
                (this.I_StartRecord = function (r, s) {
                    return new Promise((e, t) => {
                        var n,
                            i = { iWndIndex: c, bDateDir: !0 },
                            o = (S.isObject(s) ? S.extend(i, s) : S.isUndefined(s) || (i.iWndIndex = s), this.findWndIndexByIndex(i.iWndIndex));
                        -1 == o || (n = l[o]).bRecord
                            ? (i.error && i.error(_), t(_))
                            : u.JS_StartSave(i.iWndIndex, r).then(
                                  function () {
                                      (n.bRecord = !0), i.success && i.success(), e();
                                  },
                                  function () {
                                      i.error && i.error(_), t(_);
                                  }
                              );
                    });
                }),
                (this.I_StopRecord = function (r) {
                    return new Promise((e, t) => {
                        var n,
                            i = { iWndIndex: c },
                            o = (S.isObject(r) ? S.extend(i, r) : S.isUndefined(r) || (i.iWndIndex = r), this.findWndIndexByIndex(i.iWndIndex));
                        -1 != o && (n = l[o]).bRecord
                            ? u.JS_StopSave(i.iWndIndex).then(
                                  function () {
                                      (n.bRecord = !1), i.success && i.success(), e();
                                  },
                                  function () {
                                      i.error && i.error(_), t(_);
                                  }
                              )
                            : (i.error && i.error(_), t(_));
                    });
                }),
                (this.I_StartVoiceTalk = function (o, r) {
                    return new Promise((e, t) => {
                        var n, i;
                        isNaN(parseInt(r, 10))
                            ? t(z)
                            : -1 == (n = this.findDeviceIndexByIP(o)) || (i = g[n]).bVoiceTalk
                            ? t(_)
                            : i.oProtocolInc.startVoiceTalk(i, r).then(
                                  () => {
                                      (g[n].bVoiceTalk = !0), e();
                                  },
                                  () => {
                                      t(_);
                                  }
                              );
                    });
                }),
                (this.I_StopVoiceTalk = function () {
                    return new Promise((n, e) => {
                        u.JS_StopTalk().then(
                            () => {
                                for (var e = 0, t = g.length; e < t; e++)
                                    if (g[e].bVoiceTalk) {
                                        g[e].bVoiceTalk = !1;
                                        break;
                                    }
                                n();
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_StartAudioPlay = function (o, r) {
                    return new Promise((e, t) => {
                        var n,
                            i = this.findDeviceIndexByIP(o);
                        -1 == i || ((n = g[i]), (r.szAuth = n.szAuth), n.bVoiceTalk)
                            ? t(_)
                            : n.oProtocolInc.audioPlay(r).then(
                                  () => {
                                      (g[i].bVoiceTalk = !0), e();
                                  },
                                  () => {
                                      t(_);
                                  }
                              );
                    });
                }),
                (this.I_StopAudioPlay = function () {
                    return new Promise((n, e) => {
                        u.JS_StopAudioPlay().then(
                            () => {
                                for (var e = 0, t = g.length; e < t; e++)
                                    if (g[e].bVoiceTalk) {
                                        g[e].bVoiceTalk = !1;
                                        break;
                                    }
                                n();
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_PTZControl = function (r, s, a) {
                    return new Promise((e, t) => {
                        var n,
                            i = { iWndIndex: c, iPTZIndex: r, iPTZSpeed: 4 },
                            o = (S.extend(i, a), this.findWndIndexByIndex(i.iWndIndex));
                        -1 != o &&
                            ((n = l[o]), -1 != (o = this.findDeviceIndexByIP(n.szIP))) &&
                            ((o = g[o]),
                            9 == r
                                ? o.oProtocolInc.ptzAutoControl(o, s, n, i).then(
                                      () => {
                                          e();
                                      },
                                      e => {
                                          t(e);
                                      }
                                  )
                                : o.oProtocolInc.ptzControl(o, s, n, i).then(
                                      () => {
                                          e();
                                      },
                                      e => {
                                          t(e);
                                      }
                                  ));
                    });
                }),
                (this.I_EnableEZoom = function (o) {
                    return new Promise((e, t) => {
                        o = S.isUndefined(o) ? c : o;
                        var n,
                            i = this.findWndIndexByIndex(o);
                        -1 != i
                            ? (n = l[i]).bEZoom ||
                              u.JS_EnableZoom(o).then(
                                  () => {
                                      (n.bEZoom = !0), e();
                                  },
                                  () => {
                                      t(_);
                                  }
                              )
                            : t(_);
                    });
                }),
                (this.I_DisableEZoom = function (o) {
                    return new Promise((e, t) => {
                        o = S.isUndefined(o) ? c : o;
                        var n,
                            i = this.findWndIndexByIndex(o);
                        -1 != i
                            ? (n = l[i]).bEZoom
                                ? u.JS_DisableZoom(o).then(
                                      () => {
                                          (n.bEZoom = !1), e();
                                      },
                                      () => {
                                          t(_);
                                      }
                                  )
                                : e()
                            : t(_);
                    });
                }),
                (this.I_Enable3DZoom = function (i) {
                    return new Promise((e, t) => {
                        i = S.isUndefined(i) ? c : i;
                        var n = this.findWndIndexByIndex(i);
                        -1 != n
                            ? ((n = l[n]).b3DZoom ||
                                  (u.JS_SetDrawCallback(i, !0, 'Rect', !1, function (e) {
                                      var t, n;
                                      (e = e.points),
                                          -1 != (n = p.findWndIndexByIndex(c)) &&
                                              ((t = l[n]), -1 != (n = p.findDeviceIndexByIP(t.szDeviceIdentify))) &&
                                              (n = g[n]).oProtocolInc.set3DZoom(n, t, e, {});
                                  }),
                                  (n.b3DZoom = !0)),
                              e())
                            : t(_);
                    });
                }),
                (this.I_Disable3DZoom = function (i) {
                    return new Promise((e, t) => {
                        i = S.isUndefined(i) ? c : i;
                        var n = this.findWndIndexByIndex(i);
                        -1 != n ? ((n = l[n]).b3DZoom && (u.JS_SetDrawCallback(i, !1, 'Rect', !1, function () {}), (n.b3DZoom = !1)), e()) : t(_);
                    });
                }),
                (this.I_FullScreen = function (n) {
                    return new Promise(function (e, t) {
                        u.JS_FullScreenDisplay(n).then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_SetPreset = function (r, s) {
                    return new Promise(function (e, t) {
                        var n,
                            i = { iWndIndex: c, iPresetID: r },
                            o = (S.extend(i, s), this.findWndIndexByIndex(i.iWndIndex));
                        -1 != o && ((n = l[o]), -1 != (o = this.findDeviceIndexByIP(n.szIP)))
                            ? (o = g[o]).oProtocolInc.setPreset(o, n, i).then(
                                  () => {
                                      e();
                                  },
                                  e => {
                                      t(e);
                                  }
                              )
                            : t(_);
                    });
                }),
                (this.I_GoPreset = function (r, s) {
                    return new Promise(async function (e, t) {
                        var n,
                            i = { iWndIndex: c, iPresetID: r },
                            o = (S.extend(i, s), this.findWndIndexByIndex(i.iWndIndex));
                        -1 != o && ((n = l[o]), -1 != (o = this.findDeviceIndexByIP(n.szIP)))
                            ? (o = g[o]).oProtocolInc.goPreset(o, n, i).then(
                                  () => {
                                      e();
                                  },
                                  e => {
                                      t(e);
                                  }
                              )
                            : t(_);
                    });
                }),
                (this.I_RecordSearch = function (n, i, o, a, d) {
                    return new Promise(async function (r, t) {
                        var s,
                            e = this.findDeviceIndexByIP(n);
                        -1 != e
                            ? (((s = g[e]).szDeviceType !== C && s.szDeviceType !== v && s.szDeviceType !== T) || ((o = S.convertToUTCTime(o)), (a = S.convertToUTCTime(a))),
                              (e = {
                                  iChannelID: i,
                                  szStartTime: o,
                                  szEndTime: a,
                                  iSearchPos: 0,
                                  iStreamType: 1
                              }),
                              S.extend(e, d),
                              (e.success = null),
                              s.oProtocolInc.recordSearch(s, e).then(
                                  e => {
                                      if (s.szDeviceType === C || s.szDeviceType === v || s.szDeviceType === T)
                                          for (var t, n, i = 0, o = $(e).find('searchMatchItem').length; i < o; i++)
                                              (t = $(e).find('startTime').eq(i).text()),
                                                  (n = $(e).find('endTime').eq(i).text()),
                                                  (t = S.convertToLocalTime(t, s.iDeviceMinusLocalTime)),
                                                  (n = S.convertToLocalTime(n, s.iDeviceMinusLocalTime)),
                                                  $(e).find('startTime').eq(i).text(t),
                                                  $(e).find('endTime').eq(i).text(n);
                                      d.success && d.success(e), r(e);
                                  },
                                  e => {
                                      t(e);
                                  }
                              ))
                            : t(w);
                    });
                }),
                (this.I_StartPlayback = function (a, d) {
                    return new Promise(function (e, t) {
                        var n = this.findDeviceIndexByIP(a),
                            i = '',
                            o = 1,
                            r = 0,
                            s = S.dateFormat(new Date(), 'yyyy-MM-dd'),
                            s = {
                                iWndIndex: c,
                                iStreamType: 1,
                                iChannelID: 1,
                                szStartTime: s + ' 00:00:00',
                                szEndTime: s + ' 23:59:59'
                            };
                        S.extend(s, d),
                            -1 != n
                                ? ((i = (n = g[n]).oProtocolInc.CGI.startPlayback),
                                  (r = s.iStreamType),
                                  (o = 100 * s.iChannelID + r),
                                  S.extend(s, {
                                      urlProtocol: 'rtsp://',
                                      cgi: i,
                                      iChannelID: o
                                  }),
                                  -1 == this.findWndIndexByIndex(s.iWndIndex) &&
                                      ((n.szDeviceType !== C && n.szDeviceType !== v && n.szDeviceType !== T) ||
                                          ((s.szStartTime = S.convertToUTCTime(s.szStartTime)), (s.szEndTime = S.convertToUTCTime(s.szEndTime))),
                                      (s.szStartTime = s.szStartTime.replace(/[-:]/g, '').replace(' ', 'T') + 'Z'),
                                      (s.szEndTime = s.szEndTime.replace(/[-:]/g, '').replace(' ', 'T') + 'Z'),
                                      n.oProtocolInc.startPlayback(n, s).then(
                                          function () {
                                              d.success && d.success(), e();
                                          },
                                          function () {
                                              d.error && d.error(_), t(_);
                                          }
                                      )))
                                : (d.error && d.error(w), t(w));
                    });
                }),
                (this.I_ReversePlayback = function (a, d) {
                    return new Promise(function (e, t) {
                        var n = this.findDeviceIndexByIP(a),
                            i = '',
                            o = -1,
                            r = 0,
                            s = S.dateFormat(new Date(), 'yyyy-MM-dd'),
                            s = {
                                iWndIndex: c,
                                iStreamType: 1,
                                iChannelID: 1,
                                szStartTime: s + ' 00:00:00',
                                szEndTime: s + ' 23:59:59'
                            };
                        S.extend(s, d),
                            -1 != n &&
                                ((n = g[n]),
                                parseInt(h.protocolType, 10),
                                (i = n.oProtocolInc.CGI.startPlayback),
                                (r = s.iStreamType),
                                (o = 100 * s.iChannelID + r),
                                S.extend(s, { urlProtocol: 'rtsp://', cgi: i, iChannelID: o }),
                                -1 == this.findWndIndexByIndex(s.iWndIndex)) &&
                                ((s.szStartTime = s.szStartTime.replace(/[-:]/g, '').replace(' ', 'T') + 'Z'),
                                (s.szEndTime = s.szEndTime.replace(/[-:]/g, '').replace(' ', 'T') + 'Z'),
                                n.oProtocolInc.reversePlayback(n, s).then(
                                    function () {
                                        d.success && d.success(), e();
                                    },
                                    function () {
                                        d.error && d.error(_), t(_);
                                    }
                                ));
                    });
                }),
                (this.I_Frame = function (r) {
                    return new Promise(async function (e, t) {
                        var n,
                            i = { iWndIndex: c },
                            o = (S.isObject(r) ? S.extend(i, r) : S.isUndefined(r) || (i.iWndIndex = r), this.findWndIndexByIndex(i.iWndIndex));
                        -1 != o && (2 == (o = (n = l[o]).iPlayStatus) || 4 == o)
                            ? u.JS_FrameForward(i.iWndIndex).then(
                                  function () {
                                      (n.iPlayStatus = 4), i.success && i.success(), e();
                                  },
                                  function () {
                                      i.error && i.error(_), t(_);
                                  }
                              )
                            : (i.error && i.error(_), t(_));
                    });
                }),
                (this.I_Pause = function (s) {
                    return new Promise(async function (e, t) {
                        var n = { iWndIndex: c },
                            i = (S.isObject(s) ? S.extend(n, s) : S.isUndefined(s) || (n.iWndIndex = s), this.findWndIndexByIndex(n.iWndIndex));
                        if (-1 != i) {
                            var o = l[i],
                                i = o.iPlayStatus,
                                r = -1;
                            if (2 == i) r = 3;
                            else {
                                if (5 != i) return n.error && n.error(_), void t(_);
                                r = 6;
                            }
                            u.JS_Pause(n.iWndIndex).then(
                                function () {
                                    (o.iPlayStatus = r), n.success && n.success(), e();
                                },
                                function () {
                                    n.error && n.error(_), t(_);
                                }
                            );
                        } else n.error && n.error(_), t(_);
                    });
                }),
                (this.I_Resume = function (s) {
                    return new Promise(async function (e, t) {
                        var n = { iWndIndex: c },
                            i = (S.isObject(s) ? S.extend(n, s) : S.isUndefined(s) || (n.iWndIndex = s), this.findWndIndexByIndex(n.iWndIndex));
                        if (-1 != i) {
                            var o = l[i],
                                i = o.iPlayStatus,
                                r = -1;
                            if (3 == i || 4 == i) r = 2;
                            else {
                                if (6 != i) return n.error && n.error(_), void t(_);
                                r = 5;
                            }
                            u.JS_Resume(n.iWndIndex).then(
                                function () {
                                    (o.iPlayStatus = r), n.success && n.success(), e();
                                },
                                function () {
                                    n.error && n.error(_), t(_);
                                }
                            );
                        } else n.error && n.error(_), t(_);
                    });
                }),
                (this.I_PlaySlow = function (o) {
                    return new Promise(async function (e, t) {
                        var n = { iWndIndex: c },
                            i = (S.isObject(o) ? S.extend(n, o) : S.isUndefined(o) || (n.iWndIndex = o), this.findWndIndexByIndex(n.iWndIndex));
                        -1 != i && 2 == l[i].iPlayStatus
                            ? u.JS_Slow(n.iWndIndex).then(
                                  function () {
                                      n.success && n.success(), e();
                                  },
                                  function () {
                                      n.error && n.error(_), t(_);
                                  }
                              )
                            : (n.error && n.error(_), t(_));
                    });
                }),
                (this.I_PlayFast = function (o) {
                    return new Promise(async function (e, t) {
                        var n = { iWndIndex: c },
                            i = (S.isObject(o) ? S.extend(n, o) : S.isUndefined(o) || (n.iWndIndex = o), this.findWndIndexByIndex(n.iWndIndex));
                        -1 != i && 2 == l[i].iPlayStatus
                            ? u.JS_Fast(n.iWndIndex).then(
                                  function () {
                                      n.success && n.success(), e();
                                  },
                                  function () {
                                      n.error && n.error(_), t(_);
                                  }
                              )
                            : (n.error && n.error(_), t(_));
                    });
                }),
                (this.I_GetOSDTime = function (t) {
                    return new Promise(async function (n, e) {
                        var i = { iWndIndex: c };
                        S.isObject(t) ? S.extend(i, t) : S.isUndefined(t) || (i.iWndIndex = t),
                            -1 != this.findWndIndexByIndex(i.iWndIndex)
                                ? u.JS_GetOSDTime(i.iWndIndex).then(
                                      function (e) {
                                          var t;
                                          i.success && ((t = S.dateFormat(new Date(1e3 * e), 'yyyy-MM-dd hh:mm:ss')), i.success(t)), n(t);
                                      },
                                      function () {
                                          i.error && i.error(_), e(_);
                                      }
                                  )
                                : (i.error && i.error(_), e(_));
                    });
                }),
                (this.I_StartDownloadRecord = function (o, r, s, a) {
                    return new Promise((t, n) => {
                        var e,
                            i = this.findDeviceIndexByIP(o);
                        -1 != i
                            ? ((i = g[i]),
                              (e = {
                                  szPlaybackURI: r,
                                  szFileName: s + '.mp4',
                                  bDateDir: !0
                              }),
                              S.isUndefined(a) || S.extend(e, a),
                              i.oProtocolInc.startDownloadRecord(i, e).then(
                                  e => {
                                      t(e);
                                  },
                                  e => {
                                      n(e);
                                  }
                              ))
                            : n(w);
                    });
                }),
                (this.I_StartDownloadRecordByTime = function (o, r, s, a, d, c) {
                    return new Promise((t, n) => {
                        var e,
                            i = this.findDeviceIndexByIP(o);
                        -1 != i &&
                            ((i = g[i]),
                            (e = {
                                szPlaybackURI: (r = r.split('?')[0] + '?starttime=' + a.replace(' ', 'T') + 'Z&endtime=' + d.replace(' ', 'T') + 'Z'),
                                szFileName: s + '.mp4',
                                bDateDir: !0
                            }),
                            S.isUndefined(c) || S.extend(e, c),
                            i.oProtocolInc.startDownloadRecord(i, e).then(
                                e => {
                                    t(e);
                                },
                                e => {
                                    n(e);
                                }
                            ));
                    });
                }),
                (this.I_GetDownloadStatus = function (n) {
                    return new Promise((t, e) => {
                        u.JS_GetDownloadStatus(n).then(
                            e => {
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_GetDownloadProgress = function (n) {
                    return new Promise((t, e) => {
                        u.JS_GetDownloadProgress(n).then(
                            e => {
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_StopDownloadRecord = function (n) {
                    return new Promise((e, t) => {
                        u.JS_StopAsyncDownload(n).then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_ExportDeviceConfig = function (i) {
                    return new Promise((e, t) => {
                        var n = this.findDeviceIndexByIP(i);
                        -1 != n
                            ? (n = g[n]).oProtocolInc.exportDeviceConfig(n).then(
                                  () => {
                                      e();
                                  },
                                  () => {
                                      t(_);
                                  }
                              )
                            : t(w);
                    });
                }),
                (this.I_ImportDeviceConfig = function (i, o) {
                    return new Promise((e, t) => {
                        var n = this.findDeviceIndexByIP(i);
                        -1 != n
                            ? (n = g[n]).oProtocolInc.importDeviceConfig(n, { szFileName: o }).then(
                                  () => {
                                      e();
                                  },
                                  () => {
                                      t(_);
                                  }
                              )
                            : t(w);
                    });
                }),
                (this.I_RestoreDefault = function (o, r, s) {
                    return new Promise((e, t) => {
                        var n = { success: null, error: null },
                            i = (S.extend(n, s), this.findDeviceIndexByIP(o));
                        -1 != i
                            ? (i = g[i]).oProtocolInc.restore(i, r, n).then(
                                  () => {
                                      e();
                                  },
                                  e => {
                                      t(e);
                                  }
                              )
                            : t(w);
                    });
                }),
                (this.I_Restart = function (o, r) {
                    return new Promise((e, t) => {
                        var n = { success: null, error: null },
                            i = (S.extend(n, r), this.findDeviceIndexByIP(o));
                        -1 != i
                            ? (i = g[i]).oProtocolInc.restart(i, n).then(
                                  () => {
                                      e();
                                  },
                                  e => {
                                      t(e);
                                  }
                              )
                            : t(w);
                    });
                }),
                (this.I_Reconnect = function (o, r) {
                    return new Promise((e, t) => {
                        var n = { success: null, error: null },
                            i = (S.extend(n, r), this.findDeviceIndexByIP(o));
                        -1 != i
                            ? (i = g[i]).oProtocolInc.login(i.szIP, i.iCGIPort, i.szAuth, n).then(
                                  () => {
                                      e();
                                  },
                                  e => {
                                      t(e);
                                  }
                              )
                            : t(w);
                    });
                }),
                (this.I_StartUpgrade = function (i, o) {
                    return new Promise((e, t) => {
                        var n = this.findDeviceIndexByIP(i);
                        -1 != n
                            ? (n = g[n]).oProtocolInc.startUpgrade(n, o).then(
                                  () => {
                                      e();
                                  },
                                  () => {
                                      t(_);
                                  }
                              )
                            : t(w);
                    });
                }),
                (this.I_UpgradeStatus = function (n) {
                    return new Promise((t, e) => {
                        this.I_SendHTTPRequest(n, y.CGI.startUpgrade.status, {}).then(
                            e => {
                                e = 'true' === $(e).find('upgrading').eq(0).text();
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_UpgradeProgress = function (n) {
                    return new Promise((t, e) => {
                        this.I_SendHTTPRequest(n, y.CGI.startUpgrade.status, {}).then(
                            e => {
                                e = parseInt($(e).find('percent').eq(0).text(), 10);
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_StopUpgrade = function () {
                    return new Promise((e, t) => {
                        u.JS_StopUpgrade().then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_CheckPluginInstall = function () {
                    return !0;
                }),
                (this.I_CheckPluginVersion = function () {
                    return new Promise((t, e) => {
                        u.JS_CheckUpdate("<?xml version='1.0' encoding='utf-8'?><FileVersion><Platform name='win32'><localServiceControl>1.0.0.42</localServiceControl>").then(
                            e => {
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_SendHTTPRequest = function (s, a, d) {
                    return new Promise(async function (n, i) {
                        var e = new R(),
                            t = '',
                            o = '',
                            r = this.findDeviceIndexByIP(s),
                            r =
                                (0 <= r && ('%' === a.substr(0, 1) && (a = a.substr(8)), (t = (r = g[r]).szHttpProtocol + r.szIP + ':' + r.iCGIPort + '/' + a), (o = r.szAuth)),
                                { type: 'GET', url: t, auth: o, success: null, error: null });
                        S.extend(r, d),
                            e.submitRequest(r).then(
                                function (t) {
                                    if (200 === t.httpStatusCode) {
                                        let e;
                                        (e =
                                            0 === t.httpResponse.indexOf('<?xml') || -1 !== t.httpResponse.indexOf('<!DOCTYPE html>')
                                                ? S.loadXML(t.httpResponse)
                                                : JSON.parse(t.httpResponse)),
                                            d.success && d.success(e),
                                            n(e);
                                    } else if (200 !== t.httpStatusCode) {
                                        let e = S.loadXML(t.httpResponse);
                                        (e = e || JSON.parse(t.httpResponse)),
                                            d.error && d.error({ errorCode: t.httpStatusCode, errorMsg: e }),
                                            i({ errorCode: t.httpStatusCode, errorMsg: e });
                                    }
                                },
                                function (e) {
                                    d.error && d.error({ errorCode: e, errorMsg: '' }), i({ errorCode: e, errorMsg: '' });
                                }
                            );
                    });
                }),
                (this.I_ChangeWndNum = function (n) {
                    return new Promise((e, t) => {
                        u.JS_ArrangeWindow(n).then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_ArrangeWindow = function (i) {
                    return new Promise((e, t) => {
                        let n;
                        '1*2' === i
                            ? (n = [
                                  { width: 0.5, height: 0.9996, top: 2e-4, left: 0 },
                                  { width: 0.5, height: 0.9996, top: 2e-4, left: 0.5 }
                              ])
                            : '2*1' === i &&
                              (n = [
                                  { width: 0.9996, height: 0.5, top: 2e-4, left: 0 },
                                  { width: 0.9996, height: 0.5, top: 0.5, left: 0 }
                              ]),
                            u.JS_ArrangeWindow(1, n).then(
                                () => {
                                    e();
                                },
                                () => {
                                    t(_);
                                }
                            );
                    });
                }),
                (this.I_GetLastError = function () {
                    return new Promise((t, e) => {
                        u.JS_GetLastError().then(
                            e => {
                                t(e);
                            },
                            () => {
                                e(_);
                            }
                        );
                    });
                }),
                (this.I_GetWindowStatus = function (e) {
                    var t;
                    return S.isUndefined(e) ? (S.extend((t = []), l), t) : -1 != (e = this.findWndIndexByIndex(e)) ? (S.extend((t = {}), l[e]), t) : null;
                }),
                (this.I_GetIPInfoByMode = function (e, t, n, i) {}),
                (this.I_SetPlayModeType = function (n) {
                    return new Promise((e, t) => {
                        u.JS_SetPlayMode(n).then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_SetSnapDrawMode = function (e, n) {
                    let i = !1;
                    return (
                        -1 !== n && (i = !0),
                        new Promise((e, t) => {
                            u.JS_SetDrawStatus(i, n).then(
                                () => {
                                    e();
                                },
                                () => {
                                    t(_);
                                }
                            );
                        })
                    );
                }),
                (this.I_SetSnapPolygonInfo = function (e, o) {
                    return (
                        void 0 !== e && u.JS_SetWindowSelected(e),
                        new Promise((e, t) => {
                            var n = [],
                                i = S.formatPolygonXmlToJson(o);
                            0 < i.aAddRect.length && n.push(u.JS_SetDrawShapeInfo('Rect', i.aAddRect[0])),
                                0 < i.aAddPolygon.length && n.push(u.JS_SetDrawShapeInfo('Polygon', i.aAddPolygon[0])),
                                0 < i.aRect.length && n.push(u.JS_SetRectInfo(i.aRect)),
                                0 < i.aPolygon.length && n.push(u.JS_SetPolygonInfo(i.aPolygon)),
                                Promise.all(n).then(
                                    () => {
                                        e();
                                    },
                                    () => {
                                        t(_);
                                    }
                                );
                        })
                    );
                }),
                (this.I_GetSnapPolygonInfo = function (e) {
                    return (
                        void 0 !== e && u.JS_SetWindowSelected(e),
                        new Promise((t, e) => {
                            var n = [];
                            n.push(u.JS_GetPolygonInfo()),
                                n.push(u.JS_GetRectInfo()),
                                Promise.all(n).then(
                                    e => {
                                        e = S.formatPolygonJsonToXml(e);
                                        t(e);
                                    },
                                    () => {
                                        e(_);
                                    }
                                );
                        })
                    );
                }),
                (this.I_ClearSnapInfo = function (e, r) {
                    return (
                        void 0 !== e && u.JS_SetWindowSelected(e),
                        new Promise((t, n) => {
                            var i, o;
                            r
                                ? ((i = []),
                                  (o = []),
                                  r.forEach(e => {
                                      (1 === e.polygonType ? i : o).push(e.id);
                                      e = [];
                                      i.length && e.push(u.JS_ClearShapeByType('Polygon', i)),
                                          o.length && e.push(u.JS_ClearShapeByType('Rect', o)),
                                          Promise.all(e).then(
                                              () => {
                                                  t();
                                              },
                                              () => {
                                                  n(_);
                                              }
                                          );
                                  }))
                                : u.JS_ClearShapeByType('AllWindows').then(
                                      () => {
                                          t();
                                      },
                                      () => {
                                          n(_);
                                      }
                                  );
                        })
                    );
                }),
                (this.I_DeviceCapturePic = function (e, t, n, i) {
                    return !1;
                }),
                (this.I_SetPackageType = function (n) {
                    return new Promise((e, t) => {
                        u.JS_SetPackageType(n).then(
                            () => {
                                e();
                            },
                            () => {
                                t(_);
                            }
                        );
                    });
                }),
                (this.I_GetDevicePort = function (i) {
                    return new Promise(async (e, t) => {
                        var n = this.findDeviceIndexByIP(i);
                        if (-1 != n) {
                            n = g[n];
                            try {
                                e(await M(n));
                            } catch (e) {
                                t({ errorCode: 1001, errorMsg: '' });
                            }
                        } else t(w);
                    });
                }),
                (this.I_GetTextOverlay = function (o, r, s) {
                    return new Promise((t, n) => {
                        var e,
                            i = this.findDeviceIndexByIP(r);
                        -1 != i
                            ? ((e = g[i]),
                              l[i],
                              (i = { type: 'GET', success: s.success, error: s.error }),
                              this.I_SendHTTPRequest(e.szIP + '_' + e.iCGIPort, o, i).then(
                                  e => {
                                      t(e);
                                  },
                                  e => {
                                      n(e);
                                  }
                              ))
                            : n(w);
                    });
                }),
                (this.findDeviceIndexByIP = function (e) {
                    if (-1 < e.indexOf('_')) {
                        for (var t = 0, n = g.length; t < n; t++) if (g[t].szDeviceIdentify == e) return t;
                    } else for (t = 0, n = g.length; t < n; t++) if (g[t].szIP == e) return t;
                    return -1;
                }),
                (this.findWndIndexByIndex = function (e) {
                    for (var t = 0, n = l.length; t < n; t++) if (l[t].iIndex == e) return t;
                    return -1;
                });
            function A() {
                (this.iIndex = 0),
                    (this.szIP = ''),
                    (this.iCGIPort = 80),
                    (this.szDeviceIdentify = ''),
                    (this.iChannelID = ''),
                    (this.iPlayStatus = e),
                    (this.bSound = !1),
                    (this.bRecord = !1),
                    (this.bPTZAuto = !1),
                    (this.bEZoom = !1),
                    (this.b3DZoom = !1);
            }
            function n() {}
            var i,
                R = function () {
                    (this.options = {
                        type: 'GET',
                        url: '',
                        auth: '',
                        timeout: 3e4,
                        data: '',
                        async: !0,
                        success: null,
                        error: null
                    }),
                        (this.m_szHttpHead = ''),
                        (this.m_szHttpContent = ''),
                        (this.m_szHttpData = '');
                };
            (R.prototype.submitRequest = function (e) {
                return (e.method = this.getHttpMethod(e.type)), (e.content = e.data), delete e.type, delete e.data, u.JS_SubmitHttpRequest(e);
            }),
                (R.prototype.getHttpMethod = function (e) {
                    e = { GET: 1, POST: 2, PUT: 5, DELETE: 6 }[e];
                    return e || -1;
                });
            function L(e) {
                (this.elems = []), (this.length = 0), (this.length = this.elems.push(e));
            }
            (n.prototype.CGI = {
                login: '%s%s:%s/ISAPI/Security/userCheck?format=json',
                getAudioInfo: '%s%s:%s/ISAPI/System/TwoWayAudio/channels',
                getDeviceInfo: '%s%s:%s/ISAPI/System/deviceInfo',
                getAnalogChannelInfo: '%s%s:%s/ISAPI/System/Video/inputs/channels',
                getDigitalChannel: '%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels',
                getDigitalChannelInfo: '%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels/status',
                getZeroChannelInfo: '%s%s:%s/ISAPI/ContentMgmt/ZeroVideo/channels',
                getStreamChannels: {
                    analog: '%s%s:%s/ISAPI/Streaming/channels',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/StreamingProxy/channels'
                },
                startRealPlay: {
                    channels: 'video://%s:%s/%s',
                    zeroChannels: '%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/ZeroStreaming/channels/%s'
                },
                startVoiceTalk: {
                    open: '%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/open',
                    close: '%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/close',
                    audioData: '%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/audioData'
                },
                ptzControl: {
                    analog: '%s%s:%s/ISAPI/PTZCtrl/channels/%s/continuous',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/continuous'
                },
                ptzAutoControl: {
                    analog: '%s%s:%s/ISAPI/PTZCtrl/channels/%s/autoPan',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/autoPan'
                },
                setPreset: {
                    analog: '%s%s:%s/ISAPI/PTZCtrl/channels/%s/presets/%s',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/presets/%s'
                },
                goPreset: {
                    analog: '%s%s:%s/ISAPI/PTZCtrl/channels/%s/presets/%s/goto',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/presets/%s/goto'
                },
                ptzFocus: {
                    analog: '%s%s:%s/ISAPI/System/Video/inputs/channels/%s/focus',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/ImageProxy/channels/%s/focus'
                },
                ptzIris: {
                    analog: '%s%s:%s/ISAPI/System/Video/inputs/channels/%s/iris',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/ImageProxy/channels/%s/iris'
                },
                getNetworkBond: '%s%s:%s/ISAPI/System/Network/Bond',
                getNetworkInterface: '%s%s:%s/ISAPI/System/Network/interfaces',
                getUPnPPortStatus: '%s%s:%s/ISAPI/System/Network/UPnP/ports/status',
                getPPPoEStatus: '%s%s:%s/ISAPI/System/Network/PPPoE/1/status',
                getPortInfo: '%s%s:%s/ISAPI/Security/adminAccesses',
                recordSearch: '%s%s:%s/ISAPI/ContentMgmt/search',
                startPlayback: 'video://%s:%s/%s',
                startWsPlayback: '%s%s:%s/%s',
                startShttpPlayback: '%s%s:%s/SDK/playback/%s',
                startShttpReversePlayback: '%s%s:%s/SDK/playback/%s/reversePlay',
                startTransCodePlayback: '%s%s:%s/SDK/playback/%s/transcoding',
                startDownloadRecord: '%s%s:%s/ISAPI/ContentMgmt/download',
                downloaddeviceConfig: '%s%s:%s/ISAPI/System/configurationData',
                uploaddeviceConfig: '%s%s:%s/ISAPI/System/configurationData',
                restart: '%s%s:%s/ISAPI/System/reboot',
                restore: '%s%s:%s/ISAPI/System/factoryReset?mode=%s',
                startUpgrade: {
                    upgrade: '%s%s:%s/ISAPI/System/updateFirmware',
                    status: '%s%s:%s/ISAPI/System/upgradeStatus'
                },
                set3DZoom: {
                    analog: '%s%s:%s/ISAPI/PTZCtrl/channels/%s/position3D',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/position3D'
                },
                getSecurityVersion: '%s%s:%s/ISAPI/Security/capabilities?username=admin',
                SDKCapabilities: '%s%s:%s/SDK/capabilities',
                deviceCapture: {
                    channels: '%s%s:%s/ISAPI/Streaming/channels/%s/picture'
                },
                overlayInfo: {
                    analog: '%s%s:%s/ISAPI/System/Video/inputs/channels/%s/overlays/',
                    digital: '%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels/%s/video/overlays'
                },
                sessionCap: '%s%s:%s/ISAPI/Security/sessionLogin/capabilities?username=%s',
                sessionLogin: '%s%s:%s/ISAPI/Security/sessionLogin',
                sessionHeartbeat: '%s%s:%s/ISAPI/Security/sessionHeartbeat',
                sessionLogout: '%s%s:%s/ISAPI/Security/sessionLogout',
                systemCapabilities: '%s%s:%s/ISAPI/System/capabilities',
                time: 'ISAPI/System/time'
            }),
                (n.prototype.login = function (e, t, n, i) {
                    return p.I_SendHTTPRequest(oDeviceInfo.szDeviceIdentify, this.CGI.login, i);
                }),
                (n.prototype.getAudioInfo = function (o, r) {
                    return new Promise(function (i, t) {
                        var e = {};
                        S.extend(e, r),
                            S.extend(e, {
                                success: function (e) {
                                    var t,
                                        n = K.$XML(e).find('audioCompressionType', !0);
                                    0 < n.length &&
                                        ((t = 0),
                                        'G.711ulaw' == (n = K.$XML(n).eq(0).text())
                                            ? (t = 1)
                                            : 'G.711alaw' == n
                                            ? (t = 2)
                                            : 'G.726' == n
                                            ? (t = 3)
                                            : 'MP2L2' == n || 'MPEL2' == n
                                            ? (t = 4)
                                            : 'G.722.1' == n
                                            ? (t = 0)
                                            : 'AAC' == n
                                            ? (t = 5)
                                            : 'PCM' == n
                                            ? (t = 6)
                                            : 'MP3' == n && (t = 7),
                                        (o.iAudioType = t)),
                                        '' !== K.$XML(e).find('audioBitRate').eq(0).text()
                                            ? (o.m_iAudioBitRate = 1e3 * parseInt(K.$XML(e).find('audioBitRate').eq(0).text(), 10))
                                            : (o.m_iAudioBitRate = 0),
                                        '' !== K.$XML(e).find('audioSamplingRate').eq(0).text()
                                            ? (o.m_iAudioSamplingRate = 1e3 * parseInt(K.$XML(e).find('audioSamplingRate').eq(0).text(), 10))
                                            : (o.m_iAudioSamplingRate = 0),
                                        '' !== K.$XML(e).find('channelNum').eq(0).text()
                                            ? (o.m_iSoundChan = parseInt(K.$XML(e).find('channelNum').eq(0).text(), 10))
                                            : (o.m_iSoundChan = 1),
                                        '' !== K.$XML(e).find('deviceCastChannelNum').eq(0).text()
                                            ? (o.m_iDeviceAudioSoundChan = parseInt(K.$XML(e).find('deviceCastChannelNum').eq(0).text(), 10))
                                            : (o.m_iDeviceAudioSoundChan = 1),
                                        r.success && r.success(e),
                                        i(e);
                                },
                                error: function (e) {
                                    r.error && r.error(e), t(e);
                                }
                            }),
                            p.I_SendHTTPRequest(o.szDeviceIdentify, y.CGI.getAudioInfo, e);
                    });
                }),
                (n.prototype.getDeviceInfo = function (i, o) {
                    return new Promise(function (n, t) {
                        var e = {};
                        S.extend(e, o),
                            S.extend(e, {
                                success: function (e) {
                                    i.szDeviceType = K.$XML(e).find('deviceType').eq(0).text();
                                    var t = [];
                                    t.push('<DeviceInfo>'),
                                        t.push('<deviceName>' + S.escape(K.$XML(e).find('deviceName').eq(0).text()) + '</deviceName>'),
                                        t.push('<deviceID>' + K.$XML(e).find('deviceID').eq(0).text() + '</deviceID>'),
                                        t.push('<deviceType>' + K.$XML(e).find('deviceType').eq(0).text() + '</deviceType>'),
                                        t.push('<model>' + K.$XML(e).find('model').eq(0).text() + '</model>'),
                                        t.push('<serialNumber>' + K.$XML(e).find('serialNumber').eq(0).text() + '</serialNumber>'),
                                        t.push('<macAddress>' + K.$XML(e).find('macAddress').eq(0).text() + '</macAddress>'),
                                        t.push('<firmwareVersion>' + K.$XML(e).find('firmwareVersion').eq(0).text() + '</firmwareVersion>'),
                                        t.push('<firmwareReleasedDate>' + K.$XML(e).find('firmwareReleasedDate').eq(0).text() + '</firmwareReleasedDate>'),
                                        t.push('<encoderVersion>' + K.$XML(e).find('encoderVersion').eq(0).text() + '</encoderVersion>'),
                                        t.push('<encoderReleasedDate>' + K.$XML(e).find('encoderReleasedDate').eq(0).text() + '</encoderReleasedDate>'),
                                        t.push('</DeviceInfo>'),
                                        (e = S.loadXML(t.join(''))),
                                        o.success && o.success(e),
                                        n(e);
                                },
                                error: function (e) {
                                    o.error && o.error(e), t(e);
                                }
                            }),
                            p.I_SendHTTPRequest(i.szDeviceIdentify, y.CGI.getDeviceInfo, e);
                    });
                }),
                (n.prototype.getDeviceMinusLocalTime = function (S) {
                    return new Promise(function (g, e) {
                        p.I_SendHTTPRequest(S.szDeviceIdentify, y.CGI.time, {
                            success: e => {
                                var t = $(e)
                                    .find('localTime')
                                    .eq(0)
                                    .text()
                                    .substring(0, 19)
                                    .match(/(\d+)-(\d+)-(\d+)(\D+)(\d+):(\d+):(\d+)/);
                                if (8 === t.length) {
                                    var t = new Date(t[1], t[2] - 1, t[3], t[5], t[6], t[7]),
                                        e = $(e).find('timeZone').eq(0).text(),
                                        n = 0,
                                        i = e.indexOf('DST');
                                    if (-1 != i) {
                                        for (
                                            var o = new Date(t.getTime()),
                                                r = (o.setMinutes(0), o.setSeconds(0), new Date(t.getTime())),
                                                s = (r.setMinutes(0), r.setSeconds(0), e.split(',')[1]),
                                                a = e.split(',')[2],
                                                d = parseInt(s.split('.')[0].replace('M', ''), 10),
                                                c = (o.setMonth(d - 1), parseInt(s.split('.')[1], 10)),
                                                u = parseInt(s.split('.')[2].split('/')[0]),
                                                s = parseInt(s.split('.')[2].split('/')[1].split(':')[0], 10),
                                                l = (o.setHours(s), 0),
                                                p = 0,
                                                h = 1;
                                            h <= 31 && (o.setDate(h), o.getMonth() === d - 1) && (o.getDay() != u || ((p = h), ++l != c));
                                            h++
                                        );
                                        o.setDate(p), o.setMonth(d - 1);
                                        var I = parseInt(a.split('.')[0].replace('M', ''), 10),
                                            f = (r.setMonth(I - 1), parseInt(a.split('.')[1], 10)),
                                            P = parseInt(a.split('.')[2].split('/')[0]),
                                            s = parseInt(a.split('.')[2].split('/')[1].split(':')[0], 10);
                                        r.setHours(s);
                                        for (var m, l = 0, p = 0, h = 1; h <= 31 && (r.setDate(h), r.getMonth() === I - 1) && (r.getDay() != P || ((p = h), ++l != f)); h++);
                                        r.setDate(p),
                                            r.setMonth(I - 1),
                                            o.getTime() < r.getTime()
                                                ? t.getTime() >= o.getTime() &&
                                                  t.getTime() <= r.getTime() &&
                                                  ((m = e.substring(i + 3, i + 11)), (n = 60 * parseInt(m.split(':')[0], 10) + parseInt(m.split(':')[1], 10)))
                                                : (t.getTime() >= o.getTime() || t.getTime() <= r.getTime()) &&
                                                  ((m = e.substring(i + 3, i + 11)), (n = 60 * parseInt(m.split(':')[0], 10) + parseInt(m.split(':')[1], 10)));
                                    }
                                    a = e.match(/\D+([+-])(\d+):(\d+):(\d+)/);
                                    5 == a.length &&
                                        ((s = new Date().getTimezoneOffset()),
                                        (t = 60 * parseInt(a[2]) + parseInt(a[3])),
                                        (t = '+' === a[1] ? t : -t),
                                        (iDeviceMinusLocalTime = 60 * (s - t + n) * 1e3)),
                                        (S.iDeviceMinusLocalTime = iDeviceMinusLocalTime),
                                        g(iDeviceMinusLocalTime);
                                }
                            },
                            error: () => {
                                e();
                            }
                        });
                    });
                }),
                (n.prototype.getAnalogChannelInfo = function (a, d) {
                    return new Promise(function (s, t) {
                        var e = {};
                        S.extend(e, d),
                            S.extend(e, {
                                success: function (e) {
                                    var t = [],
                                        n = (t.push('<VideoInputChannelList>'), K.$XML(e).find('VideoInputChannel', !0));
                                    a.iAnalogChannelNum = n.length;
                                    for (var i = 0, o = n.length; i < o; i++) {
                                        var r = n[i];
                                        t.push('<VideoInputChannel>'),
                                            t.push('<id>' + K.$XML(r).find('id').eq(0).text() + '</id>'),
                                            t.push('<inputPort>' + K.$XML(r).find('inputPort').eq(0).text() + '</inputPort>'),
                                            t.push('<name>' + S.escape(K.$XML(r).find('name').eq(0).text()) + '</name>'),
                                            t.push('<videoFormat>' + K.$XML(r).find('videoFormat').eq(0).text() + '</videoFormat>'),
                                            t.push('</VideoInputChannel>');
                                    }
                                    t.push('</VideoInputChannelList>');
                                    e = S.loadXML(t.join(''));
                                    d.success && d.success(e), s(e);
                                },
                                error: function (e) {
                                    d.error && d.error(e), t(e);
                                }
                            }),
                            p.I_SendHTTPRequest(a.szDeviceIdentify, y.CGI.getAnalogChannelInfo, e);
                    });
                }),
                (n.prototype.getDigitalChannel = function (n, a) {
                    return new Promise(function (s, t) {
                        var e = {};
                        S.extend(e, a),
                            S.extend(e, {
                                success: function (e) {
                                    for (var t = [], n = (t.push('<InputProxyChannelList>'), K.$XML(e).find('InputProxyChannel', !0)), i = 0, o = n.length; i < o; i++) {
                                        var r = n[i];
                                        t.push('<InputProxyChannel>'),
                                            t.push('<id>' + K.$XML(r).find('id').eq(0).text() + '</id>'),
                                            t.push('<name>' + S.escape(K.$XML(r).find('name').eq(0).text()) + '</name>'),
                                            t.push('</InputProxyChannel>');
                                    }
                                    t.push('</InputProxyChannelList>');
                                    e = S.loadXML(t.join(''));
                                    a.success && a.success(e), s(e);
                                },
                                error: function (e) {
                                    a.error && a.error(e), t(e);
                                }
                            }),
                            p.I_SendHTTPRequest(n.szDeviceIdentify, y.CGI.getDigitalChannel, e);
                    });
                }),
                (n.prototype.getDigitalChannelInfo = function (c, u) {
                    return new Promise(async (a, t) => {
                        var e = null,
                            d = {};
                        try {
                            e = await y.getDigitalChannel(c, {});
                        } catch (e) {
                            t(e);
                        }
                        for (var n = K.$XML(e).find('InputProxyChannel', !0), i = 0, o = n.length; i < o; i++) {
                            var r = n[i],
                                s = K.$XML(r).find('id').eq(0).text(),
                                r = K.$XML(r).find('name').eq(0).text();
                            d[s] = r;
                        }
                        e = {};
                        S.extend(e, u),
                            S.extend(e, {
                                success: function (e) {
                                    for (
                                        var t = [], n = (t.push('<InputProxyChannelStatusList>'), K.$XML(e).find('InputProxyChannelStatus', !0)), i = 0, o = n.length;
                                        i < o;
                                        i++
                                    ) {
                                        var r = n[i],
                                            s = K.$XML(r).find('id').eq(0).text();
                                        t.push('<InputProxyChannelStatus>'),
                                            t.push('<id>' + s + '</id>'),
                                            t.push('<sourceInputPortDescriptor>'),
                                            t.push('<proxyProtocol>' + K.$XML(r).find('proxyProtocol').eq(0).text() + '</proxyProtocol>'),
                                            t.push('<addressingFormatType>' + K.$XML(r).find('addressingFormatType').eq(0).text() + '</addressingFormatType>'),
                                            t.push('<ipAddress>' + K.$XML(r).find('ipAddress').eq(0).text() + '</ipAddress>'),
                                            t.push('<managePortNo>' + K.$XML(r).find('managePortNo').eq(0).text() + '</managePortNo>'),
                                            t.push('<srcInputPort>' + K.$XML(r).find('srcInputPort').eq(0).text() + '</srcInputPort>'),
                                            t.push('<userName>' + S.escape(K.$XML(r).find('userName').eq(0).text()) + '</userName>'),
                                            t.push('<streamType>' + K.$XML(r).find('streamType').eq(0).text() + '</streamType>'),
                                            t.push('<online>' + K.$XML(r).find('online').eq(0).text() + '</online>'),
                                            t.push('<name>' + S.escape(d[s]) + '</name>'),
                                            t.push('</sourceInputPortDescriptor>'),
                                            t.push('</InputProxyChannelStatus>');
                                    }
                                    t.push('</InputProxyChannelStatusList>');
                                    e = S.loadXML(t.join(''));
                                    u.success && u.success(e), a(e);
                                },
                                error: function (e) {
                                    u.error && u.error(e), t(e);
                                }
                            }),
                            p.I_SendHTTPRequest(c.szDeviceIdentify, y.CGI.getDigitalChannelInfo, e);
                    });
                }),
                (n.prototype.getZeroChannelInfo = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getZeroChannelInfo, t);
                }),
                (n.prototype.getStreamChannels = function (e, t) {
                    0 != e.iAnalogChannelNum
                        ? S.formatString(this.CGI.getStreamChannels.analog, e.szHttpProtocol, e.szIP, e.iCGIPort)
                        : S.formatString(this.CGI.getStreamChannels.digital, e.szHttpProtocol, e.szIP, e.iCGIPort);
                    let n;
                    return (n = 0 != e.iAnalogChannelNum ? this.CGI.getStreamChannels.analog : this.CGI.getStreamChannels.digital), p.I_SendHTTPRequest(e.szDeviceIdentify, n, t);
                }),
                (n.prototype.getPPPoEStatus = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getPPPoEStatus, t);
                }),
                (n.prototype.getUPnPPortStatus = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getUPnPPortStatus, t);
                }),
                (n.prototype.getNetworkBond = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getNetworkBond, t);
                }),
                (n.prototype.getNetworkInterface = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getNetworkInterface, t);
                }),
                (n.prototype.getPortInfo = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getPortInfo, t);
                }),
                (n.prototype.startRealPlay = function (s, a) {
                    return new Promise(async function (t, e) {
                        var n = 100 * a.iChannelID + a.iStreamType,
                            i = '',
                            o = S.delPort(s.szIP),
                            r = s.iRtspPort;
                        a.iPort && (r = a.iPort),
                            (i = a.bZeroChannel
                                ? S.formatString(s.oProtocolInc.CGI.startRealPlay.zeroChannels, o, r, n)
                                : S.formatString(s.oProtocolInc.CGI.startRealPlay.channels, o, r, n));
                        await u.JS_SetSecretKey(0, h.secretKey, 1),
                            u.JS_Play(i, { auth: s.szAuth, userInfo: s.szAuth }, a.iWndIndex, '', '', a.bFlag).then(
                                () => {
                                    var e;
                                    ((e = new A()).iIndex = a.iWndIndex),
                                        (e.szIP = s.szIP),
                                        (e.iCGIPort = s.iCGIPort),
                                        (e.szDeviceIdentify = s.szDeviceIdentify),
                                        (e.iChannelID = a.iChannelID),
                                        (e.iPlayStatus = 1),
                                        l.push(e),
                                        t();
                                },
                                () => {
                                    e();
                                }
                            );
                    });
                }),
                (n.prototype.startPlay = function (n, i) {
                    return new Promise(async function (t, e) {
                        u.JS_Play(i.szUrl, { auth: n.szAuth, userInfo: n.szAuth }, i.iWndIndex, i.startTime, i.endTime, !0).then(
                            () => {
                                var e;
                                ((e = new A()).iIndex = i.iWndIndex), (e.szIP = n.szIP), (e.szDeviceIdentify = n.szDeviceIdentify), (e.iPlayStatus = 2), l.push(e), t();
                            },
                            () => {
                                e();
                            }
                        );
                    });
                }),
                (n.prototype.startVoiceTalk = function (e, t) {
                    var n = S.formatString(this.CGI.startVoiceTalk.open, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
                        i = S.formatString(this.CGI.startVoiceTalk.close, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
                        t = S.formatString(this.CGI.startVoiceTalk.audioData, e.szHttpProtocol, e.szIP, e.iCGIPort, t);
                    return u.JS_StartTalk(n, i, t, e.szAuth, e.iAudioType, e.m_iAudioBitRate, e.m_iAudioSamplingRate, e.m_iSoundChan, e.m_iDeviceAudioSoundChan);
                }),
                (n.prototype.audioPlay = function (e) {
                    return u.JS_AudioPlay(e.szUrl, e.szAuth, -1, -1, !0, e.iAudioType);
                }),
                (n.prototype.ptzAutoControl = function (i, o, r, s) {
                    return new Promise((e, t) => {
                        var n = r.iChannelID,
                            n =
                                ((s.iPTZSpeed = s.iPTZSpeed < 7 ? 15 * s.iPTZSpeed : 100),
                                o && (s.iPTZSpeed = 0),
                                {
                                    type: 'PUT',
                                    url:
                                        n <= i.iAnalogChannelNum
                                            ? S.formatString(y.CGI.ptzAutoControl.analog, i.szHttpProtocol, i.szIP, i.iCGIPort, r.iChannelID)
                                            : S.formatString(y.CGI.ptzAutoControl.digital, i.szHttpProtocol, i.szIP, i.iCGIPort, r.iChannelID),
                                    data: "<?xml version='1.0' encoding='UTF-8'?><autoPanData><autoPan>" + s.iPTZSpeed + '</autoPan></autoPanData>',
                                    success: null,
                                    error: null
                                });
                        S.extend(n, s),
                            S.extend(n, {
                                success: function () {
                                    (r.bPTZAuto = !r.bPTZAuto), s.success && s.success(), e();
                                },
                                error: function (e) {
                                    s.error && s.error(e), t(e);
                                }
                            }),
                            p.I_SendHTTPRequest(i.szDeviceIdentify, '', n);
                    });
                }),
                (n.prototype.ptzControl = function (e, t, n, i) {
                    var o = n.iChannelID,
                        r =
                            (n.bPTZAuto && this.ptzAutoControl(e, !0, n, { iPTZSpeed: 0 }),
                            (i.iPTZSpeed = t ? 0 : i.iPTZSpeed < 7 ? 15 * i.iPTZSpeed : 100),
                            [
                                {},
                                { pan: 0, tilt: i.iPTZSpeed },
                                { pan: 0, tilt: -i.iPTZSpeed },
                                { pan: -i.iPTZSpeed, tilt: 0 },
                                { pan: i.iPTZSpeed, tilt: 0 },
                                { pan: -i.iPTZSpeed, tilt: i.iPTZSpeed },
                                { pan: -i.iPTZSpeed, tilt: -i.iPTZSpeed },
                                { pan: i.iPTZSpeed, tilt: i.iPTZSpeed },
                                { pan: i.iPTZSpeed, tilt: -i.iPTZSpeed },
                                {},
                                { speed: i.iPTZSpeed },
                                { speed: -i.iPTZSpeed },
                                { speed: i.iPTZSpeed },
                                { speed: -i.iPTZSpeed },
                                { speed: i.iPTZSpeed },
                                { speed: -i.iPTZSpeed }
                            ]),
                        s = '',
                        a = {};
                    switch (i.iPTZIndex) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                            (a = this.CGI.ptzControl),
                                (s = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + r[i.iPTZIndex].pan + '</pan><tilt>' + r[i.iPTZIndex].tilt + '</tilt></PTZData>');
                            break;
                        case 10:
                        case 11:
                            (a = this.CGI.ptzControl), (s = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + r[i.iPTZIndex].speed + '</zoom></PTZData>');
                            break;
                        case 12:
                        case 13:
                            (a = this.CGI.ptzFocus), (s = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + r[i.iPTZIndex].speed + '</focus></FocusData>');
                            break;
                        case 14:
                        case 15:
                            (a = this.CGI.ptzIris), (s = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + r[i.iPTZIndex].speed + '</iris></IrisData>');
                            break;
                        default:
                            return;
                    }
                    t = {
                        type: 'PUT',
                        url:
                            o <= e.iAnalogChannelNum
                                ? S.formatString(a.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID)
                                : S.formatString(a.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID),
                        data: s,
                        success: null,
                        error: null
                    };
                    return S.extend(t, i), p.I_SendHTTPRequest(e.szDeviceIdentify, '', t);
                }),
                (n.prototype.setPreset = function (e, t, n) {
                    var i = '',
                        o = '',
                        i =
                            t.iChannelID <= e.iAnalogChannelNum
                                ? S.formatString(this.CGI.setPreset.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID)
                                : S.formatString(this.CGI.setPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID),
                        t =
                            ((o = (o = "<?xml version='1.0' encoding='UTF-8'?>") + '<PTZPreset>' + ('<id>' + n.iPresetID + '</id>')),
                            e.szDeviceType != v && (o += '<presetName>Preset' + n.iPresetID + '</presetName>'),
                            {
                                type: 'PUT',
                                url: i,
                                data: (o += '</PTZPreset>'),
                                success: null,
                                error: null
                            });
                    return S.extend(t, n), p.I_SendHTTPRequest(e.szDeviceIdentify, '', t);
                }),
                (n.prototype.goPreset = function (e, t, n) {
                    t = {
                        type: 'PUT',
                        url:
                            t.iChannelID <= e.iAnalogChannelNum
                                ? S.formatString(this.CGI.goPreset.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID)
                                : S.formatString(this.CGI.goPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID),
                        success: null,
                        error: null
                    };
                    return S.extend(t, n), p.I_SendHTTPRequest(e.szDeviceIdentify, '', t);
                }),
                (n.prototype.recordSearch = function (a, d) {
                    return new Promise((s, t) => {
                        var e = d.iChannelID,
                            n = d.iStreamType,
                            i = d.szStartTime.replace(' ', 'T') + 'Z',
                            o = d.szEndTime.replace(' ', 'T') + 'Z',
                            r = S.formatString(y.CGI.recordSearch, a.szHttpProtocol, a.szIP, a.iCGIPort),
                            e =
                                "<?xml version='1.0' encoding='UTF-8'?><CMSearchDescription><searchID>" +
                                new G() +
                                '</searchID><trackList><trackID>' +
                                (100 * e + n) +
                                '</trackID></trackList><timeSpanList><timeSpan><startTime>' +
                                i +
                                '</startTime><endTime>' +
                                o +
                                '</endTime></timeSpan></timeSpanList><maxResults>50</maxResults><searchResultPostion>' +
                                d.iSearchPos +
                                '</searchResultPostion><metadataList><metadataDescriptor>//metadata.ISAPI.org/VideoMotion</metadataDescriptor></metadataList></CMSearchDescription>',
                            n = (new R(), { type: 'POST', url: r, data: e, success: null, error: null });
                        S.extend(n, d),
                            S.extend(n, {
                                success: function (e) {
                                    for (
                                        var t = [],
                                            n =
                                                (t.push('<CMSearchResult>'),
                                                t.push('<responseStatus>' + K.$XML(e).find('responseStatus').eq(0).text() + '</responseStatus>'),
                                                t.push('<responseStatusStrg>' + K.$XML(e).find('responseStatusStrg').eq(0).text() + '</responseStatusStrg>'),
                                                t.push('<numOfMatches>' + K.$XML(e).find('numOfMatches').eq(0).text() + '</numOfMatches>'),
                                                t.push('<matchList>'),
                                                K.$XML(e).find('searchMatchItem', !0)),
                                            i = 0,
                                            o = n.length;
                                        i < o;
                                        i++
                                    ) {
                                        var r = n[i];
                                        t.push('<searchMatchItem>'),
                                            t.push('<trackID>' + K.$XML(r).find('trackID').eq(0).text() + '</trackID>'),
                                            t.push('<startTime>' + K.$XML(r).find('startTime').eq(0).text() + '</startTime>'),
                                            t.push('<endTime>' + K.$XML(r).find('endTime').eq(0).text() + '</endTime>'),
                                            t.push('<playbackURI>' + S.escape(K.$XML(r).find('playbackURI').eq(0).text()) + '</playbackURI>'),
                                            t.push('<metadataDescriptor>' + K.$XML(r).find('metadataDescriptor').eq(0).text().split('/')[1] + '</metadataDescriptor>'),
                                            t.push('</searchMatchItem>');
                                    }
                                    t.push('</matchList>'), t.push('</CMSearchResult>'), (e = S.loadXML(t.join(''))), d.success && d.success(e), s(e);
                                },
                                error: function (e) {
                                    d.error && d.error(e), t(e);
                                }
                            }),
                            p.I_SendHTTPRequest(a.szDeviceIdentify, '', n);
                    });
                }),
                (n.prototype.startPlayback = function (d, c) {
                    return new Promise(async function (t, e) {
                        var n = c.iWndIndex,
                            i = c.szStartTime,
                            o = c.szEndTime,
                            r = S.delPort(d.szIP),
                            s = d.iRtspPort;
                        if ((c.iPort && (s = c.iPort), (r = S.formatString(c.cgi, r, s, c.iChannelID)), !S.isUndefined(c.oTransCodeParam))) {
                            (s = c.oTransCodeParam),
                                (a = {
                                    TransFrameRate: '',
                                    TransResolution: '',
                                    TransBitrate: ''
                                }),
                                S.extend(a, s);
                            var a =
                                '' == a.TransFrameRate || '' == a.TransResolution || '' == a.TransBitrate
                                    ? ''
                                    : ((s = []).push("<?xml version='1.0' encoding='UTF-8'?>"),
                                      s.push('<CompressionInfo>'),
                                      s.push('<TransFrameRate>' + a.TransFrameRate + '</TransFrameRate>'),
                                      s.push('<TransResolution>' + a.TransResolution + '</TransResolution>'),
                                      s.push('<TransBitrate>' + a.TransBitrate + '</TransBitrate>'),
                                      s.push('</CompressionInfo>'),
                                      s.join(''));
                            if ('' == a) return -1;
                            u.JS_SetTrsPlayBackParam(n, a);
                        }
                        u.JS_Play(r, { auth: d.szAuth, userInfo: d.szAuth }, n, i, o, c.bFlag).then(
                            () => {
                                var e;
                                ((e = new A()).iIndex = n),
                                    (e.szIP = d.szIP),
                                    (e.iCGIPort = d.iCGIPort),
                                    (e.szDeviceIdentify = d.szDeviceIdentify),
                                    (e.iChannelID = c.iChannelID),
                                    (e.iPlayStatus = 2),
                                    l.push(e),
                                    t();
                            },
                            () => {
                                e();
                            }
                        );
                    });
                }),
                (n.prototype.reversePlayback = function (a, d) {
                    return new Promise(function (t, e) {
                        var n = d.iWndIndex,
                            i = d.szStartTime,
                            o = d.szEndTime,
                            r = S.delPort(a.szIP),
                            s = a.iRtspPort,
                            r = (d.iPort && (s = d.iPort), S.formatString(d.cgi, r, s, d.iChannelID));
                        u.JS_ReversePlay(r, { auth: a.szAuth, userInfo: a.szAuth }, n, i, o).then(
                            () => {
                                var e = new A();
                                (e.iIndex = n),
                                    (e.szIP = a.szIP),
                                    (e.iCGIPort = a.iCGIPort),
                                    (e.szDeviceIdentify = a.szDeviceIdentify),
                                    (e.iChannelID = d.iChannelID),
                                    (e.iPlayStatus = 5),
                                    l.push(e),
                                    t();
                            },
                            () => {
                                e();
                            }
                        );
                    });
                }),
                (n.prototype.startDownloadRecord = function (e, t) {
                    var n = S.formatString(this.CGI.startDownloadRecord, e.szHttpProtocol, e.szIP, e.iCGIPort),
                        i = "<?xml version='1.0' encoding='UTF-8'?><downloadRequest><playbackURI>" + S.escape(t.szPlaybackURI) + '</playbackURI></downloadRequest>';
                    return u.JS_StartAsyncDownload(n, e.szAuth, t.szFileName, i, t.bDateDir);
                }),
                (n.prototype.exportDeviceConfig = function (e) {
                    var t = S.formatString(this.CGI.downloaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
                    return u.JS_DownloadFile(t, e.szAuth, '', 0);
                }),
                (n.prototype.importDeviceConfig = function (e, t) {
                    var n = S.formatString(this.CGI.uploaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
                    return u.JS_StartAsynUpload(n, '', e.szAuth, t.szFileName, 0);
                }),
                (n.prototype.restart = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.restart, {
                        type: 'PUT',
                        success: null,
                        error: null
                    });
                }),
                (n.prototype.restore = function (e, t, n) {
                    t = S.formatString(this.CGI.restore, e.szHttpProtocol, e.szIP, e.iCGIPort, t);
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, '', {
                        type: 'PUT',
                        url: t,
                        success: null,
                        error: null
                    });
                }),
                (n.prototype.startUpgrade = function (e, t) {
                    var n = S.formatString(this.CGI.startUpgrade.upgrade, e.szHttpProtocol, e.szIP, e.iCGIPort);
                    S.formatString(this.CGI.startUpgrade.status, e.szHttpProtocol, e.szIP, e.iCGIPort);
                    return u.JS_StartUpgrade(n, '', e.szAuth, t);
                }),
                (n.prototype.set3DZoom = function (e, t, n, i) {
                    var o = '',
                        o =
                            t.iChannelID <= e.iAnalogChannelNum
                                ? S.formatString(this.CGI.set3DZoom.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID)
                                : S.formatString(this.CGI.set3DZoom.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID),
                        t =
                            (0 !== n[0][0] || 0 !== n[0][1] || (0 === n[2][0] && 0 === n[2][1]) || ((n[0][0] = n[2][0]), (n[0][1] = n[2][1])),
                            "<?xml version='1.0' encoding='UTF-8'?><Position3D><StartPoint><positionX>" +
                                parseInt(255 * n[0][0], 10) +
                                '</positionX><positionY>' +
                                (255 - parseInt(255 * n[0][1], 10)) +
                                '</positionY></StartPoint><EndPoint><positionX>' +
                                parseInt(255 * n[2][0], 10) +
                                '</positionX><positionY>' +
                                (255 - parseInt(255 * n[2][1], 10)) +
                                '</positionY></EndPoint></Position3D>'),
                        n = (new R(), { type: 'PUT', url: o, data: t, success: null, error: null });
                    return S.extend(n, i), p.I_SendHTTPRequest(e.szDeviceIdentify, '', n);
                }),
                (n.prototype.getSDKCapa = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.SDKCapabilities, t);
                }),
                (n.prototype.deviceCapturePic = function (e, t, n, i) {
                    var t = 100 * t + 1,
                        e = S.formatString(this.CGI.deviceCapture.channels, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
                        t = [];
                    S.isInt(i.iResolutionWidth) && t.push('videoResolutionWidth=' + i.iResolutionWidth),
                        S.isInt(i.iResolutionHeight) && t.push('videoResolutionHeight=' + i.iResolutionHeight),
                        0 < t.length && (e += '?' + t.join('&'));
                    return (
                        (i = e),
                        (t = n),
                        $('body').append('<a id="jsplugin_download_a" href="' + i + '" download=' + t + '.jpg><li id="jsplugin_download_li"></li></a>'),
                        $('#jsplugin_download_li').trigger('click'),
                        $('#jsplugin_download_a').remove(),
                        0
                    );
                }),
                (n.prototype.digestLogin = function (e, t, n, i, o, r) {
                    var s = '',
                        s = 2 == t ? 'https://' : 'http://',
                        t = {
                            type: 'GET',
                            url: S.formatString(this.CGI.login, s, e, n),
                            auth: S.Base64.encode(':' + i + ':' + o),
                            success: null,
                            error: null
                        },
                        s = e + '_' + n;
                    return S.extend(t, r), p.I_SendHTTPRequest(s, '', t);
                }),
                (n.prototype.getSystemCapa = function (e, t) {
                    return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.systemCapabilities, t);
                }),
                (i = this),
                (L.prototype.find = function (e, t) {
                    e = this.elems[this.length - 1] ? this.elems[this.length - 1].getElementsByTagName(e) : [];
                    return (this.length = this.elems.push(e)), t ? e : this;
                }),
                (L.prototype.eq = function (e, t) {
                    var n = this.elems[this.length - 1].length,
                        i = null;
                    return 0 < n && e < n && (i = this.elems[this.length - 1][e]), (this.length = this.elems.push(i)), t ? i : this;
                }),
                (L.prototype.text = function (e) {
                    return this.elems[this.length - 1]
                        ? e
                            ? void (window.DOMParser ? (this.elems[this.length - 1].textContent = e) : (this.elems[this.length - 1].text = e))
                            : window.DOMParser
                            ? this.elems[this.length - 1].textContent
                            : this.elems[this.length - 1].text
                        : '';
                }),
                (L.prototype.attr = function (e) {
                    if (this.elems[this.length - 1]) return (e = this.elems[this.length - 1].attributes.getNamedItem(e)) ? e.value : '';
                }),
                (i.$XML = function (e) {
                    return new L(e);
                });
            function W() {}
            function G() {
                this.id = this.createUUID();
            }
            return (
                (W.prototype.extend = function () {
                    for (var e, t = arguments[0] || {}, n = 1, i = arguments.length; n < i; n++)
                        if (null != (e = arguments[n]))
                            for (var o in e) {
                                t[o];
                                var r = e[o];
                                t !== r && ('object' == typeof r ? (t[o] = this.extend({}, r)) : void 0 !== r && (t[o] = r));
                            }
                    return t;
                }),
                (W.prototype.browser = function () {
                    var e = navigator.userAgent.toLowerCase(),
                        e = /(chrome)[ \/]([\w.]+)/.exec(e) ||
                            /(safari)[ \/]([\w.]+)/.exec(e) ||
                            /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(e) ||
                            /(msie) ([\w.]+)/.exec(e) ||
                            /(trident.*rv:)([\w.]+)/.exec(e) ||
                            (e.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(e)) || ['unknow', '0'],
                        t = (0 < e.length && -1 < e[1].indexOf('trident') && (e[1] = 'msie'), {});
                    return (t[e[1]] = !0), (t.version = e[2]), t;
                }),
                (W.prototype.loadXML = function (e) {
                    var t;
                    return null == e || '' == e
                        ? null
                        : ((t = null),
                          window.DOMParser ? (t = new DOMParser().parseFromString(e, 'text/xml')) : (((t = new ActiveXObject('Microsoft.XMLDOM')).async = !1), t.loadXML(e)),
                          t);
                }),
                (W.prototype.toXMLStr = function (t) {
                    var n = '';
                    try {
                        n = new XMLSerializer().serializeToString(t);
                    } catch (e) {
                        try {
                            n = t.xml;
                        } catch (e) {
                            return '';
                        }
                    }
                    return (n = -1 == n.indexOf('<?xml') ? "<?xml version='1.0' encoding='utf-8'?>" + n : n);
                }),
                (W.prototype.escape = function (e) {
                    return e && e.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }),
                (W.prototype.dateFormat = function (e, t) {
                    var n,
                        i = {
                            'M+': e.getMonth() + 1,
                            'd+': e.getDate(),
                            'h+': e.getHours(),
                            'm+': e.getMinutes(),
                            's+': e.getSeconds(),
                            'q+': Math.floor((e.getMonth() + 3) / 3),
                            S: e.getMilliseconds()
                        };
                    for (n in (/(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + '').substr(4 - RegExp.$1.length))), i))
                        new RegExp('(' + n + ')').test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[n] : ('00' + i[n]).substr(('' + i[n]).length)));
                    return t;
                }),
                (W.prototype.Base64 = {
                    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
                    encode: function (e) {
                        var t,
                            n,
                            i,
                            o,
                            r,
                            s,
                            a = '',
                            d = 0;
                        for (e = W.prototype.Base64._utf8_encode(e); d < e.length; )
                            (i = (t = e.charCodeAt(d++)) >> 2),
                                (o = ((3 & t) << 4) | ((t = e.charCodeAt(d++)) >> 4)),
                                (r = ((15 & t) << 2) | ((n = e.charCodeAt(d++)) >> 6)),
                                (s = 63 & n),
                                isNaN(t) ? (r = s = 64) : isNaN(n) && (s = 64),
                                (a = a + this._keyStr.charAt(i) + this._keyStr.charAt(o) + this._keyStr.charAt(r) + this._keyStr.charAt(s));
                        return a;
                    },
                    decode: function (e) {
                        var t,
                            n,
                            i,
                            o,
                            r,
                            s,
                            a = '',
                            d = 0;
                        for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ''); d < e.length; )
                            (i = this._keyStr.indexOf(e.charAt(d++))),
                                (t = ((15 & (o = this._keyStr.indexOf(e.charAt(d++)))) << 4) | ((r = this._keyStr.indexOf(e.charAt(d++))) >> 2)),
                                (n = ((3 & r) << 6) | (s = this._keyStr.indexOf(e.charAt(d++)))),
                                (a += String.fromCharCode((i << 2) | (o >> 4))),
                                64 != r && (a += String.fromCharCode(t)),
                                64 != s && (a += String.fromCharCode(n));
                        return (a = W.prototype.Base64._utf8_decode(a));
                    },
                    _utf8_encode: function (e) {
                        e = e.replace(/\r\n/g, '\n');
                        for (var t = '', n = 0; n < e.length; n++) {
                            var i = e.charCodeAt(n);
                            i < 128
                                ? (t += String.fromCharCode(i))
                                : (t =
                                      127 < i && i < 2048
                                          ? (t += String.fromCharCode((i >> 6) | 192)) + String.fromCharCode((63 & i) | 128)
                                          : (t = (t += String.fromCharCode((i >> 12) | 224)) + String.fromCharCode(((i >> 6) & 63) | 128)) + String.fromCharCode((63 & i) | 128));
                        }
                        return t;
                    },
                    _utf8_decode: function (e) {
                        var t,
                            n = '',
                            i = 0;
                        for (c1 = c2 = 0; i < e.length; )
                            (t = e.charCodeAt(i)) < 128
                                ? ((n += String.fromCharCode(t)), i++)
                                : 191 < t && t < 224
                                ? ((c2 = e.charCodeAt(i + 1)), (n += String.fromCharCode(((31 & t) << 6) | (63 & c2))), (i += 2))
                                : ((c2 = e.charCodeAt(i + 1)), (c3 = e.charCodeAt(i + 2)), (n += String.fromCharCode(((15 & t) << 12) | ((63 & c2) << 6) | (63 & c3))), (i += 3));
                        return n;
                    }
                }),
                (W.prototype.createEventScript = function (e, t, n) {
                    var i = document.createElement('script');
                    (i.htmlFor = e), (i.event = t), (i.innerHTML = n), document.body.parentNode.appendChild(i);
                }),
                (W.prototype.isInt = function (e) {
                    return /^\d+$/.test(e);
                }),
                (W.prototype.getDirName = function () {
                    var e = '';
                    if ('' !== a.szBasePath) e = a.szBasePath;
                    else {
                        var t = /[^?#]*\//,
                            n = document.getElementById('videonode');
                        if (n) e = n.src.match(t)[0];
                        else {
                            for (var i = document.scripts, o = 0, r = i.length; o < r; o++)
                                if (-1 < i[o].src.indexOf('webVideoCtrl.js')) {
                                    n = i[o];
                                    break;
                                }
                            n && (e = n.src.match(t)[0]);
                        }
                    }
                    return e;
                }),
                (W.prototype.loadScript = function (e, t) {
                    var n = document.createElement('script');
                    (n.type = 'text/javascript'),
                        (n.onload = function () {
                            t();
                        }),
                        (n.src = e),
                        document.getElementsByTagName('head')[0].appendChild(n);
                }),
                (W.prototype.cookie = function (e, t, n) {
                    var i, o;
                    return 1 < arguments.length && (null === t || 'object' != typeof t)
                        ? ((n = this.extend({}, n)),
                          null === t && (n.expires = -1),
                          'number' == typeof n.expires && ((i = n.expires), (o = n.expires = new Date()).setDate(o.getDate() + i)),
                          (document.cookie = [
                              encodeURIComponent(e),
                              '=',
                              n.raw ? String(t) : encodeURIComponent(String(t)),
                              n.expires ? '; expires=' + n.expires.toUTCString() : '',
                              n.path ? '; path=' + n.path : '; path=/',
                              n.domain ? '; domain=' + n.domain : '',
                              n.secure ? '; secure' : ''
                          ].join('')))
                        : ((o = (n = t || {}).raw
                              ? function (e) {
                                    return e;
                                }
                              : decodeURIComponent),
                          (i = new RegExp('(?:^|; )' + encodeURIComponent(e) + '=([^;]*)').exec(document.cookie)) ? o(i[1]) : null);
                }),
                (W.prototype.isUndefined = function (e) {
                    return void 0 === e;
                }),
                (W.prototype.isObject = function (e) {
                    return '[object Object]' === Object.prototype.toString.call(e);
                }),
                (W.prototype.delPort = function (e) {
                    var t = e.indexOf(':');
                    return -1 < t ? e.substring(0, t) : e;
                }),
                (W.prototype.formatString = function () {
                    for (var e = arguments[0], t = 1; t < arguments.length; t++) e = e.replace('%s', arguments[t]);
                    return e;
                }),
                (W.prototype.encodeString = function (e) {
                    return e ? e.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
                }),
                (W.prototype.formatPolygonXmlToJson = function (e) {
                    var p,
                        e = this.loadXML(e),
                        h = [],
                        I = [],
                        f = [],
                        P = [],
                        m = [];
                    function g(e) {
                        e = parseInt(e, 10).toString(16);
                        return (e = '0' + e).substring(e.length - 2);
                    }
                    return (
                        $(e)
                            .find('SnapPolygon')
                            .each(function () {
                                var e = parseInt($(this).find('EditType, editType').text(), 10) || 0,
                                    t = 'true' === $(this).find('isClosed').text(),
                                    n = parseInt($(this).find('polygonType').text(), 10),
                                    i = parseFloat($(this).find('showSquare').text()) || 0,
                                    o = $(this).find('tips').text() || $(this).find('Tips').text(),
                                    r = parseInt($(this).find('tipsPos').text(), 10) || 0,
                                    s = 'true' === $(this).find('showWH').text(),
                                    a = '#' + g($(this).find('r').text()) + g($(this).find('g').text()) + g($(this).find('b').text()),
                                    d = parseInt($(this).find('PointNumMax').text(), 10) - 1,
                                    c = parseInt($(this).find('MinClosed').text(), 10) - 1,
                                    u = parseInt($(this).find('id').text(), 10),
                                    l = parseInt($(this).find('RedrawMode').text(), 10) || 0;
                                0 === $(this).find('pointList').find('point').length
                                    ? 1 === n
                                        ? P.push({
                                              id: u,
                                              tips: o,
                                              drawColor: a,
                                              translucent: 0.1,
                                              maxShapeSupport: 1,
                                              maxPointSupport: d,
                                              minPointSupport: c,
                                              showWH: s,
                                              redrawMode: l
                                          })
                                        : 0 === n &&
                                          m.push({
                                              id: u,
                                              tips: o,
                                              drawColor: a,
                                              translucent: 0.1,
                                              widthHeightRate: i,
                                              maxShapeSupport: 1,
                                              type: 1,
                                              redrawMode: l,
                                              tipsPos: r
                                          })
                                    : ((I = []),
                                      $(this)
                                          .find('pointList')
                                          .find('point')
                                          .each(function () {
                                              I.push([parseFloat($(this).find('x').text()), parseFloat($(this).find('y').text())]);
                                          }),
                                      (p = {
                                          id: u,
                                          editType: e,
                                          points: I,
                                          closed: t,
                                          tips: o,
                                          drawColor: a,
                                          maxPointSupport: d,
                                          minPointSupport: c,
                                          translucent: 0.1,
                                          redrawMode: l
                                      }),
                                      1 === n ? ((p.showWH = s), h.push(p)) : 0 === n && ((p.widthHeightRate = i), (p.type = 1), (p.tipsPos = r), f.push(p)));
                            }),
                        { aRect: f, aPolygon: h, aAddRect: m, aAddPolygon: P }
                    );
                }),
                (W.prototype.formatPolygonJsonToXml = function (e) {
                    function a(e) {
                        var t = e.toLowerCase();
                        if (t && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(t)) {
                            if (4 === t.length) {
                                for (var n = '#', i = 1; i < 4; i += 1) n += t.slice(i, i + 1).concat(t.slice(i, i + 1));
                                t = n;
                            }
                            var o = [];
                            for (i = 1; i < 7; i += 2) o.push(parseInt('0x' + t.slice(i, i + 2), 16));
                            return o;
                        }
                        return [0, 0, 0];
                    }
                    var t = e[0],
                        e = e[1],
                        d = "<?xml version='1.0' encoding='utf-8'?><SnapPolygonList>",
                        c = this;
                    return (
                        $.each(t, function (e, t) {
                            var n = [0, 0, 0],
                                n = t.drawColor ? a(t.drawColor) : a('#FF0000');
                            (d = (d += '<SnapPolygon>') + '<id>' + t.id + '</id>'),
                                (t.tips = c.encodeString(t.tips)),
                                t.tips ? (d += '<tips>' + t.tips + '</tips>') : (d += '<tips></tips>'),
                                (d =
                                    (d =
                                        (d =
                                            (d += '<isClosed>' + t.closed.toString() + '</isClosed>') +
                                            '<color><r>' +
                                            n[0] +
                                            '</r><g>' +
                                            n[1] +
                                            '</g><b>' +
                                            n[2] +
                                            '</b></color><polygonType>1</polygonType>') +
                                        '<PointNumMax>' +
                                        (t.pointNumMax || 10) +
                                        '</PointNumMax>') +
                                    '<MinClosed>' +
                                    (t.minClosed || 4) +
                                    '</MinClosed><pointList>'),
                                $.each(t.points, function (e, t) {
                                    d += '<point><x>' + t[0] + '</x><y>' + t[1] + '</y></point>';
                                }),
                                (d += '</pointList></SnapPolygon>');
                        }),
                        $.each(e, function (e, t) {
                            var n,
                                i,
                                o,
                                r,
                                s = [0, 0, 0],
                                s = t.drawColor ? a(t.drawColor) : a('#FF0000'),
                                s =
                                    ((d =
                                        (d = (d += '<SnapPolygon>') + ('<id>' + t.id + '</id>')) +
                                        ('<color><r>' + s[0] + '</r><g>' + s[1] + '</g><b>' + s[2] + '</b></color>') +
                                        '<polygonType>0</polygonType>'),
                                    (t.tips = c.encodeString(t.tips)),
                                    t.tips ? (d += '<tips>' + t.tips + '</tips>') : (d += '<tips></tips>'),
                                    void 0 !== t.closed && null !== t.closed ? (d += '<isClosed>' + t.closed.toString() + '</isClosed>') : (d += '<isClosed>true</isClosed>'),
                                    (d += '<pointList>'),
                                    []);
                            t.points.length &&
                                ((o = n = 2),
                                (r = i = -1),
                                $.each(t.points, function () {
                                    n > this[0] && (n = this[0]), o > this[1] && (o = this[1]), i < this[0] && (i = this[0]), r < this[1] && (r = this[1]);
                                }),
                                s.push([n, o]),
                                s.push([i, o]),
                                s.push([i, r]),
                                s.push([n, r])),
                                $.each(s, function (e, t) {
                                    d += '<point><x>' + t[0] + '</x><y>' + t[1] + '</y></point>';
                                }),
                                (d += '</pointList></SnapPolygon>');
                        }),
                        (d += '</SnapPolygonList>')
                    );
                }),
                (W.prototype.convertToUTCTime = function (e, t) {
                    void 0 === t && (t = 'yyyy-MM-dd hh:mm:ss'), (e = e.replace('T', ' ').replace('Z', ''));
                    e = new Date(Date.parse(e.replace(/-/g, '/')));
                    return (e = (e = this.utcDateFormat(e, t)).replace(' ', 'T'));
                }),
                (W.prototype.utcDateFormat = function (e, t) {
                    var n,
                        i = {
                            'M+': e.getUTCMonth() + 1,
                            'd+': e.getUTCDate(),
                            'h+': e.getUTCHours(),
                            'm+': e.getUTCMinutes(),
                            's+': e.getUTCSeconds(),
                            'q+': Math.floor((e.getUTCMonth() + 3) / 3),
                            S: e.getUTCMilliseconds()
                        };
                    for (n in (/(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getUTCFullYear() + '').substr(4 - RegExp.$1.length))), i))
                        new RegExp('(' + n + ')').test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[n] : ('00' + i[n]).substr(('' + i[n]).length)));
                    return t;
                }),
                (W.prototype.convertToLocalTime = function (e, t) {
                    void 0 === t && (t = 0);
                    var n = (e = e.replace('T', ' ').replace('Z', '')).split(' ')[0].split('-'),
                        i = parseInt(n[0], 10),
                        o = parseInt(n[1], 10) - 1,
                        n = parseInt(n[2], 10),
                        e = e.split(' ')[1].split(':'),
                        r = parseInt(e[0], 10),
                        s = parseInt(e[1], 10),
                        e = parseInt(e[2], 10),
                        i = new Date(Date.UTC(i, o, n, r, s, e));
                    return i.setTime(i.getTime() + t), this.dateFormat(i, 'yyyy-MM-dd hh:mm:ss').replace(' ', 'T') + 'Z';
                }),
                (G.prototype.valueOf = function () {
                    return this.id;
                }),
                (G.prototype.toString = function () {
                    return this.id;
                }),
                (G.prototype.createUUID = function () {
                    var e = new Date(1582, 10, 15, 0, 0, 0, 0),
                        e = new Date().getTime() - e.getTime();
                    return (
                        G.getIntegerBits(e, 0, 31) +
                        '-' +
                        G.getIntegerBits(e, 32, 47) +
                        '-' +
                        (G.getIntegerBits(e, 48, 59) + '1') +
                        '-' +
                        G.getIntegerBits(G.rand(4095), 0, 7) +
                        G.getIntegerBits(G.rand(4095), 0, 7) +
                        '-' +
                        (G.getIntegerBits(G.rand(8191), 0, 7) +
                            G.getIntegerBits(G.rand(8191), 8, 15) +
                            G.getIntegerBits(G.rand(8191), 0, 7) +
                            G.getIntegerBits(G.rand(8191), 8, 15) +
                            G.getIntegerBits(G.rand(8191), 0, 15))
                    );
                }),
                (G.getIntegerBits = function (e, t, n) {
                    for (var i = G.returnBase(e, 16), o = new Array(), r = '', s = 0, s = 0; s < i.length; s++) o.push(i.substring(s, s + 1));
                    for (s = Math.floor(t / 4); s <= Math.floor(n / 4); s++) o[s] && '' != o[s] ? (r += o[s]) : (r += '0');
                    return r;
                }),
                (G.returnBase = function (e, t) {
                    var n,
                        i = [
                            '0',
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9',
                            'A',
                            'B',
                            'C',
                            'D',
                            'E',
                            'F',
                            'G',
                            'H',
                            'I',
                            'J',
                            'K',
                            'L',
                            'M',
                            'N',
                            'O',
                            'P',
                            'Q',
                            'R',
                            'S',
                            'T',
                            'U',
                            'V',
                            'W',
                            'X',
                            'Y',
                            'Z'
                        ];
                    return e < t ? i[e] : ((n = e - (e = '' + Math.floor(e / t)) * t), t <= e ? this.returnBase(e, t) + i[n] : i[e] + i[n]);
                }),
                (G.rand = function (e) {
                    return Math.floor(Math.random() * e);
                }),
                (y = new n()),
                (S = new W()),
                this
            );
        })()),
        ((K = window.WebVideoCtrl = e).version = '3.3.0'));
})(),
    ('object' == typeof exports && 'undefined' != typeof module) ||
        ('function' == typeof define && define.amd
            ? define(function () {
                  return WebVideoCtrl;
              })
            : 'function' == typeof define &&
              define.cmd &&
              define(function (e, t, n) {
                  n.exports = WebVideoCtrl;
              }));
