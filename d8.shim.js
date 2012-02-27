!function(root) {
    function err(e) {
        throw e;
    }
    function has(o, k) {
        return OP.hasOwnProperty.call(o, k);
    }
    function isFn(fn) {
        return typeof fn == "function";
    }
    function tostr(o) {
        return OP.toString.call(o);
    }
    var A = Array, F = !1, N = null, O = Object, PROTO = "prototype", T = !0, U, AP = A[PROTO], OP = O[PROTO], defProp = "defineProperty", slice = AP.slice;
    !function() {
        function add(p, n, f) {
            typeof p[n] != "undefined" || (p[n] = f);
        }
        function defproptest(o) {
            var k = "wedgES";
            try {
                return k in O[defProp](o, k, {});
            } catch (e) {}
        }
        var _proto_ = "__proto__", access = !has(OP, "__defineGetter__") ? N : {
            dget : OP.__defineGetter__,
            dset : OP.__defineSetter__,
            lget : OP.__lookupGetter__,
            lset : OP.__lookupSetter__
        }, defprop, f, get = "get", n, noenum = {
            constructor : T,
            hasOwnProperty : T,
            isPrototypeOf : T,
            propertyIsEnumerable : T,
            toLocaleString : T,
            toString : T,
            valueOf : T
        }, noenumbug = !{
            toString : N
        }.propertyIsEnumerable("toString"), set = "set", value = "value";
        f = {
            create : function create(o) {
                arguments.length === 1 || err(new Error("Object.create() shim only accepts one parameter."));
                function K() {}
                K[PROTO] = o;
                return new K;
            },
            defineProperty : function defineProperty(o, k, d) {
                var proto;
                if (defprop) {
                    try {
                        return defprop.call(O, o, k, d);
                    } catch (e) {}
                }
                if (has(d, value)) {
                    if (access && (access.lget.call(o, k) || access.lset.call(o, k))) {
                        proto = o[_proto_];
                        o[_proto_] = OP;
                        delete o[k];
                        o[k] = d[value];
                        o[_proto_] = proto;
                    } else o[k] = d[value];
                } else if (!access && (isFn(d[get]) || isFn(d[set]))) err(new TypeError("User Agent does not support getter and setter accesors.")); else {
                    has(d, get) || access.dget.call(o, k, d[get]);
                    has(d, set) || access.dset.call(o, k, d[set]);
                }
                return o;
            },
            defineProperties : function defineProperties(o, d) {
                for (var k in d) !(has(d, k) && k != _proto_) || O.defineProperty(o, k, d[k]);
                return o;
            },
            getOwnPropertyDescriptor : function getOwnPropertyDescriptor(o, k) {
                if (!has(o, k)) return;
                var d = {
                    enumerable : T,
                    configurable : T
                }, g, proto, s;
                if (access) {
                    proto = o[_proto_];
                    o[_proto_] = OP;
                    g = access.lget.call(o, k);
                    s = access.lset.call(o, k);
                    o[_proto_] = proto;
                    if (g || s) {
                        !g || (d[get] = g);
                        !s || (d[set] = s);
                    }
                    return d;
                }
                d[value] = o[k];
                return d;
            },
            getOwnPropertyNames : function getOwnPropertyNames(o) {
                var k, keys = [];
                for (k in o) keys.push(k);
                return keys;
            },
            getPrototypeOf : function getPrototypeOf(o) {
                return o[_proto_] || o.constructor[PROTO] || OP;
            },
            keys : function keys(o) {
                var k, keys = [];
                for (k in o) !has(o, k) || keys.push(k);
                if (noenumbug) for (k in noenum) !has(o, k) || keys.push(k);
                return keys;
            },
            values : function values(o) {
                var k, values = [];
                for (k in o) !has(o, k) || values.push(o[k]);
                return values;
            }
        };
        !O[defProp] || defproptest({}) && defproptest(document.createElement("div")) || (defprop = O[defProp], O[defProp] = f.defineProperty);
        for (n in f) has(f, n) && has(OP, n) || add(O, n, f[n]);
    }();
    !function() {
        var f = {
            every : function every(fn, ctx) {
                var a = O(this), i = -1, l = a.length >>> 0;
                while (++i < l) if (i in a && !fn.call(ctx, a[i], i, a)) return F;
                return T;
            },
            forEach : function forEach(fn, ctx) {
                var a = O(this), i = -1, l = a.length >>> 0;
                while (++i < l) !(i in a) || fn.call(ctx, a[i], i, a);
            },
            filter : function filter(fn, ctx) {
                return AP.reduce.call(this, function(v, o, i, a) {
                    !fn.call(ctx, o, i, a) || v.push(o);
                    return v;
                }, []);
            },
            indexOf : function indexOf(o, i) {
                var a = O(this), l = a.length >>> 0;
                if (l === 0) return -1;
                i = isNaN(i) ? 0 : i < 0 ? l + i - 1 : i ? i - 1 : -1;
                while (++i < l) if (i in a && a[i] === o) return i;
                return -1;
            },
            lastIndexOf : function lastIndexOf(o, i) {
                var a = O(this), l = a.length >>> 0, n;
                if (l === 0) return -1;
                i = isNaN(i) ? l : i < 0 ? l + i : i;
                n = slice.call(a, 0, i).reverse().indexOf(o);
                return n < 0 ? n : i - n - 1;
            },
            map : function map(fn, ctx) {
                return AP.reduce.call(this, function(v, o, i, a) {
                    v.push(fn.call(ctx, o, i, a));
                    return v;
                }, []);
            },
            reduce : function reduce(fn) {
                var a = O(this), i = -1, l = a.length >>> 0, val;
                arguments.length > 1 ? val = arguments[1] : (val = a[0], i = 0);
                while (++i < l) !(i in a) || (val = fn.call(U, val, a[i], i, a));
                return val;
            },
            reduceRight : function reduceRight(fn) {
                var a = O(this), l = a.length >>> 0, val;
                if (arguments.length < 2) {
                    do {
                        if (l in a) {
                            val = a[l--];
                            break;
                        }
                        if (--l < 0) throw new TypeError;
                    } while (T);
                } else val = arguments[1];
                while (--l >= 0) !(i in a) || (val = fn.call(U, val, a[l], l, a));
                return val;
            },
            some : function some(fn, ctx) {
                var a = O(this), i = -1, l = a.length >>> 0;
                while (++i < l) if (i in a && fn.call(ctx, a[i], i, a)) return T;
                return F;
            }
        }, n;
        A.isArray || (A.isArray = function isArray(a) {
            return tostr(a) == "[object Array]";
        });
        f.forEach.call(O.keys(f), function(k) {
            has(AP, k) || O[defProp](AP, k, {
                enumerable : F,
                value : f[k]
            });
        });
    }();
    !function() {
        function now() {
            return new Date / 1;
        }
        function toISOString() {
            return (n - ~this.getUTCMonth() * 10 + this.toUTCString() + n + this / 1).replace(re, format);
        }
        var D = Date, DP = D[PROTO], format = "$3-$1-$2T$4.$5Z", iso = "toISOString", n = 1e3, re = /1(..).*?(\d\d)\D+(\d+).(\S+).*(...)/;
        "now" in D || (D.now = now);
        iso in DP || O[defProp](DP, iso, {
            enumerable : F,
            value : toISOString
        });
    }();
    Function[PROTO].bind || O[defProp](Function[PROTO], "bind", function() {
        return {
            enumerable : F,
            value : function bind(ctx) {
                var args = slice.call(arguments, 1), fn = this;
                function bound() {
                    return fn.apply(this instanceof bound ? this : ctx || root, args.concat(slice.call(arguments)));
                }
                bound[PROTO] = O.create(fn[PROTO]);
                return bound;
            }
        };
    }());
    !function() {
        var SP = String[PROTO], f = {
            trimLeft : function trimLeft() {
                return this.replace(/^\s+/gm, "");
            },
            trimRight : function trimRight() {
                return this.replace(/\s+$/gm, "");
            },
            trim : function trim() {
                return this.trimLeft().trimRight();
            }
        }, n;
        O.keys(f).forEach(function(k) {
            has(SP, k) || O[defProp](SP, k, {
                enumerable : F,
                value : f[k]
            });
        });
    }();
}(this);

!function() {
    function _indexOf(o, k) {
        var i = o.indexOf(k);
        return i == -1 ? N : i;
    }
    function _lc(o) {
        return o.toLowerCase();
    }
    function _substr(s) {
        return s.substring(0, 3);
    }
    function _uc(o) {
        return o.toUpperCase();
    }
    function associate(o, k) {
        return o.reduce(function(res, v, i) {
            res[k[i]] = v;
            return res;
        }, {});
    }
    function between_equalto(v, l, h) {
        return l <= v && v <= h;
    }
    function copy(d, s, r) {
        for (var k in s) !has(s, k) || has(d, k) && r !== T || (d[k] = s[k]);
        return d;
    }
    function forEach(o, fn, ctx) {
        ctx || (ctx = o);
        Object.keys(o).forEach(function(k, i) {
            fn.call(ctx, o[k], k, i, o);
        });
        return o;
    }
    function nomember(o, k) {
        return !(k in o);
    }
    function has(o, k) {
        return OP.hasOwnProperty.call(o, k);
    }
    function pad(o, len, radix) {
        var i = -1, s = o.toString(radix || 10);
        len -= s.length;
        while (++i < len) s = "0" + s;
        return s;
    }
    function pluck(a, k) {
        return a.reduce(function(v, o) {
            !(k in o) || v.push(o[k]);
            return v;
        }, []);
    }
    function retVal(x) {
        return x;
    }
    function sum(v, i) {
        return v + i;
    }
    function todesc(v, k, i, o) {
        o[k] = {
            configurable : F,
            enumerable : F,
            value : v,
            writeable : F
        };
    }
    function _24hrTime(o, res) {
        return (o = Number(o)) < 12 && _lc(res.ampm) == _lc(LOCALE.PM) ? o += 12 : o;
    }
    function _adjust(v, k) {
        this.adjust(k, v);
    }
    function _dayOffset(d) {
        return Math.floor((d - getISOFirstMondayOfYear.call(d)) / MS_DAY);
    }
    function _timezoneOffset(o) {
        var t = o.indexOf("-") == 0 ? F : T, m = o.match(/[\+-]?([0-9]{2}):?([0-9]{2})/), v = (Number(m[1]) + m[2] / 60) * 3600;
        return t ? v : -v;
    }
    function _weekOffset(d) {
        return Math.floor(Math.abs(_dayOffset(d) / 7));
    }
    function _zeroIndexedInt(o, k) {
        return !isNaN(k) ? k == o ? 0 : Number(k) : Number(o) - 1;
    }
    function adjust(o, v) {
        if (OP.toString.call(o) == "[object Object]") {
            forEach(o, _adjust, this);
            return this;
        }
        var day, fn = math_fn[o.toLowerCase()], weekday;
        if (!fn || v === 0) return this;
        LOCALE.setLeapYear(this);
        if (fn == math_fn.month) {
            day = this.getDate();
            day < 28 || this.setDate(Math.min(day, getLastOfTheMonth.call(getFirstOfTheMonth.call(this).adjust(Date.MONTH, v))).getDate());
        }
        if (fn == math_fn.week) {
            weekday = this.getDay();
        }
        this[fn[1]](this[fn[0]]() + v);
        !weekday || this.setDate(this.getDate() + weekday);
        return this;
    }
    function between(l, h) {
        return this >= l && this <= h;
    }
    function clearTime() {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this;
    }
    function clone() {
        return new Date(this.getTime());
    }
    function getDayOfYear() {
        LOCALE.setLeapYear(this);
        return LOCALE.day_count.slice(0, this.getMonth()).reduce(sum, 0) + this.getDate() - 1;
    }
    function getFirstOfTheMonth() {
        return new Date(this.getFullYear(), this.getMonth(), 1);
    }
    function getGMTOffset(colon) {
        var tz = this.getTimezoneOffset();
        return [ tz > 0 ? "-" : "+", pad(Math.floor(Math.abs(tz) / 60), 2), colon ? ":" : "", pad(Math.abs(tz % 60), 2) ].join("");
    }
    function getISODay() {
        return this.getDay() || 7;
    }
    function getISODaysInYear() {
        return Math.ceil((getISOFirstMondayOfYear.call(new Date(this.getFullYear() + 1, 0, 1)) - getISOFirstMondayOfYear.call(this)) / MS_DAY);
    }
    function getISOFirstMondayOfYear() {
        var y = this.getFullYear();
        return new Date(y, 0, DAY_OFFSETS[(new Date(y, 0, 1)).getDay()]);
    }
    function getISOWeek() {
        var w, y = this.getFullYear();
        if (this >= getISOFirstMondayOfYear.call(new Date(y + 1, 0, 1))) return 1;
        w = Math.floor((getDayOfYear.call(this) - getISODay.call(this) + 10) / 7);
        return w == 0 ? getISOWeeksInYear.call(new Date(y - 1, 0, 1)) - _weekOffset(this) : w;
    }
    function getISOWeeksInYear() {
        return Math.round((getISOFirstMondayOfYear.call(new Date(this.getFullYear() + 1, 0, 1)) - getISOFirstMondayOfYear.call(this)) / MS_WEEK);
    }
    function getLastOfTheMonth() {
        var m = this.getMonth();
        LOCALE.setLeapYear(this);
        return new Date(this.getFullYear(), m, LOCALE.day_count[m]);
    }
    function getWeek() {
        return Math.floor(getDayOfYear.call(this) / 7);
    }
    function isDST() {
        return (new Date(this.getFullYear(), 0, 1)).getTimezoneOffset() != this.getTimezoneOffset();
    }
    function isLeapYear() {
        return LOCALE.isLeapYear(this.getFullYear());
    }
    function setWeek(v) {
        this.setMonth(0);
        this.setDate(1);
        return this.adjust(Date.DAY, v * 7).getTime();
    }
    function timezone() {
        var s = this.toString().split(" ");
        return s.splice(4, s.length).join(" ").replace(re_tz, "$1").replace(re_tz_abbr, "");
    }
    function buildTemplate(o) {
        if (cache_format[o]) return cache_format[o];
        var fn = [ "var out=[];" ], i = -1, p, parts = o.replace(re_add_nr, NOREPLACE_RB).replace(re_add_enr, NOREPLACE_RE).split(re_split), re_invalid = /^[^A-Za-z]*$/g, l = parts.length;
        while (++i < l) {
            p = parts[i];
            p == NOREPLACE ? (fn.push(tplOut(parts[++i])), ++i) : re_invalid.test(p) ? fn.push(tplOut(p)) : fn.push(compileTplStr(p));
        }
        fn.push('return out.join( "" );');
        return cache_format[o] = new Function("filter", "date", fn.join("\n"));
    }
    function format(f) {
        return buildTemplate(f)(filter, this);
    }
    function compileTplStr(o) {
        return o.replace(re_compile, function(m, p0, p1, p2) {
            return tplOut(p0 + "', filter." + p1 + "( date ), '" + p2);
        });
    }
    function tplOut(s) {
        return "out.push( '" + s + "' );";
    }
    function buildParser(o) {
        if (cache_parse[o]) return cache_parse[o];
        var fn = {}, keys = [], i = -1, parts = o.replace(re_add_nr, NOREPLACE_RB).replace(re_add_enr, NOREPLACE_RE).split(re_split), l = parts.length, p, re = [];
        while (++i < l) {
            p = parts[i];
            if (p == NOREPLACE) {
                re.push(parts[++i]);
                ++i;
                continue;
            }
            p.replace(re_compile, function(m, p1, p2, p3) {
                var _fn, _k, _p;
                if (!(_p = parser[p2])) return;
                if (_p.k) {
                    keys.push(_p.k);
                    if (_p.fn) fn[_p.k] = _p.fn;
                }
                if (_p.combo) {
                    _k = pluck(_p.combo, "k");
                    _fn = associate(pluck(_p.combo, "fn"), _k);
                    keys.push.apply(keys, _k);
                    copy(fn, _fn, T);
                }
                if (_p.re) re.push(p1, _p.re, p3);
            });
        }
        return cache_parse[o] = parse.bind(N, new RegExp(re.join("")), keys, fn);
    }
    function parse(re, keys, fn, s) {
        var d = new Date, m = s.match(re), o = associate(m.slice(1), keys);
        forEach(o, function(v, k) {
            if (fn[k]) o[k] = fn[k](v, o);
        });
        if (!isNaN(o[UNIX])) d.setTime(o[UNIX]); else {
            parse_setTime(d, o[HOUR], o[MINUTE], o[SECOND], o[MILLISECOND]);
            parse_setDate(d, o);
            parse_setTimezoneOffset(d, o[TIMEZONE]);
        }
        return d;
    }
    function parse_setDate(d, o) {
        var dw, ly, odc, i = -1;
        if (date_members.every(nomember.bind(N, o))) return;
        if (isNaN(o[YEAR])) o[YEAR] = d.getFullYear();
        if (isNaN(o[MONTH])) {
            ly = LOCALE.isLeapYear(o[YEAR]) ? 1 : 0;
            odc = LOCALE.ordinal_day_count[ly];
            l = odc.length;
            o[MONTH] = 0;
            if (o[WEEK] && !o[DAYYEAR]) {
                dw = o[DAYWEEK];
                dw = isNaN(dw) ? 0 : !dw ? 7 : dw;
                o[DAYYEAR] = o[WEEK] * 7 - (4 - dw);
            }
            if (!isNaN(o[DAYYEAR])) {
                if (o[DAYYEAR] > odc[odc.length - 1]) {
                    o[DAYYEAR] -= odc[odc.length - 1];
                    ++o[YEAR];
                }
                while (++i < l) {
                    if (between_equalto(o[DAYYEAR], odc[i], odc[i + 1])) {
                        o[MONTH] = i;
                        o[DAY] = odc[i] == 0 ? o[DAYYEAR] : o[DAYYEAR] - odc[i];
                        break;
                    }
                }
            }
        }
        if (isNaN(o[DAY])) o[DAY] = 1;
        d.setYear(o[YEAR]);
        d.setMonth(o[MONTH]);
        d.setDate(o[DAY]);
    }
    function parse_setTime(d, h, m, s, ms) {
        d.setHours(h || 0);
        d.setMinutes(m || 0);
        d.setSeconds(s || 0);
        d.setMilliseconds(ms || 0);
    }
    function parse_setTimezoneOffset(d, tzo) {
        !between_equalto(tzo, -43200, 50400) || d.adjust(Date.SECOND, -d.getTimezoneOffset() * 60 - tzo);
    }
    function toDate(s, f) {
        return buildParser(f)(s);
    }
    var F = !1, LOCALE = Date.locale, N = null, OP = Object.prototype, T = !0, U, DAY_OFFSETS = [ 9, 1, 0, -1, -2, 4, 3 ], MS_DAY = 864e5, MS_WEEK = 6048e5, SHORT_DAYS = LOCALE.days.map(_substr), SHORT_MONTHS = LOCALE.months.map(_substr), AMPM = "ampm", DAY = "day", DAYWEEK = "dayweek", DAYYEAR = "dayyear", HOUR = "hour", MILLISECOND = "ms", MINUTE = "minute", MONTH = "month", SECOND = "second", TIMEZONE = "timezone", UNIX = "unix", WEEK = "week", YEAR = "year", NOREPLACE = "NOREPLACE", NOREPLACE_RB = "<" + NOREPLACE + "<", NOREPLACE_RE = ">END" + NOREPLACE + ">", cache_format = {}, cache_parse = {}, date_chars, date_members = [ DAY, DAYWEEK, DAYYEAR, MONTH, WEEK, YEAR ], filter, formats = copy({
        ISO_8601 : "Y-m-d<T>H:i:s.u<Z>",
        ISO_8601_SHORT : "Y-m-d",
        RFC_850 : "l, d-M-y H:i:s T",
        RFC_2822 : "D, d M Y H:i:s O",
        sortable : "Y-m-d H:i:sO"
    }, LOCALE.formats), m, math_fn = {
        day : [ "getDate", "setDate" ],
        hr : [ "getHours", "setHours" ],
        min : [ "getMinutes", "setMinutes" ],
        month : [ "getMonth", "setMonth" ],
        ms : [ "getMilliseconds", "setMilliseconds" ],
        sec : [ "getSeconds", "setSeconds" ],
        week : [ "getWeek", "setWeek" ],
        year : [ "getFullYear", "setFullYear" ]
    }, parser, re_ampm = "(am|pm)", re_add_enr = />/g, re_add_nr = /</g, re_compile, re_d1_2 = "([0-9]{1,2})", re_d2 = "([0-9]{2})", re_d4 = "([0-9]{4})", re_split = /[<>]/, re_tz = /[^\(]*\(([^\)]+)\)/g, re_tz_abbr = /[^A-Z]+/g;
    formats.atom = formats.ISO_8601;
    formats.cookie = formats.RFC_850;
    formats.rss = formats.RFC_2822;
    filter = {
        d : function(d) {
            return pad(d.getDate(), 2);
        },
        D : function(d) {
            return LOCALE.days[d.getDay()].substring(0, 3);
        },
        j : function(d) {
            return d.getDate();
        },
        l : function(d) {
            return LOCALE.days[d.getDay()];
        },
        N : function(d) {
            return getISODay.call(d);
        },
        S : function(d) {
            return LOCALE.getOrdinal(d.getDate());
        },
        w : function(d) {
            return d.getDay();
        },
        z : function(d) {
            return d.getDayOfYear();
        },
        W : function(d) {
            return getISOWeek.call(d);
        },
        F : function(d) {
            return LOCALE.months[d.getMonth()];
        },
        m : function(d) {
            return pad(d.getMonth() + 1, 2);
        },
        M : function(d) {
            return LOCALE.months[d.getMonth()].substring(0, 3);
        },
        n : function(d) {
            return d.getMonth() + 1;
        },
        t : function(d) {
            LOCALE.setLeapYear(d);
            return LOCALE.day_count[d.getMonth()];
        },
        L : function(d) {
            return d.isLeapYear() ? 1 : 0;
        },
        o : function(d) {
            var m = d.getMonth(), w = getISOWeek.call(d);
            return d.getFullYear() + (w == 1 && m > 0 ? 1 : w >= 52 && m < 11 ? -1 : 0);
        },
        Y : function(d) {
            return d.getFullYear();
        },
        y : function(d) {
            return String(d.getFullYear()).substring(2, 4);
        },
        a : function(d) {
            return _lc(d.getHours() < 12 ? LOCALE.AM : LOCALE.PM);
        },
        A : function(d) {
            return _uc(d.getHours() < 12 ? LOCALE.AM : LOCALE.PM);
        },
        g : function(d) {
            return d.getHours() % 12 || 12;
        },
        G : function(d) {
            return d.getHours();
        },
        h : function(d) {
            return pad(filter.g(d), 2);
        },
        H : function(d) {
            return pad(filter.G(d), 2);
        },
        i : function(d) {
            return pad(d.getMinutes(), 2);
        },
        s : function(d) {
            return pad(d.getSeconds(), 2);
        },
        u : function(d) {
            return pad(d.getMilliseconds(), 3);
        },
        O : function(d) {
            return getGMTOffset.call(d);
        },
        P : function(d) {
            return getGMTOffset.call(d, T);
        },
        T : function(d) {
            return timezone.call(d);
        },
        Z : function(d) {
            return d.getTimezoneOffset() * -60;
        },
        c : function(d) {
            return format.call(d, formats.ISO_8601);
        },
        r : function(d) {
            return format.call(d, formats.RFC_2822);
        },
        U : function(d) {
            return d.getTime();
        }
    };
    date_chars = Object.keys(filter).sort().join("");
    re_compile = new RegExp("([^" + date_chars + "]*)([" + date_chars + "])([^" + date_chars + "]*)", "g");
    parser = {
        d : {
            k : DAY,
            fn : Number,
            re : re_d2
        },
        D : {
            k : DAYWEEK,
            fn : _indexOf.bind(N, SHORT_DAYS),
            re : "(" + SHORT_DAYS.join("|") + ")"
        },
        j : {
            k : DAY,
            fn : Number,
            re : re_d1_2
        },
        l : {
            k : DAYWEEK,
            fn : _indexOf.bind(N, LOCALE.days),
            re : "(" + LOCALE.days.join("|") + ")"
        },
        N : {
            k : DAYWEEK,
            fn : _zeroIndexedInt.bind(N, 7),
            re : "([1-7])"
        },
        S : {
            re : "(?:" + LOCALE.ordinal.join("|") + ")"
        },
        w : {
            k : DAYWEEK,
            fn : Number,
            re : "([0-6])"
        },
        z : {
            k : DAYYEAR,
            fn : Number,
            re : "([0-9]{1,3})"
        },
        W : {
            k : WEEK,
            fn : Number,
            re : re_d2
        },
        F : {
            k : MONTH,
            fn : _indexOf.bind(N, LOCALE.months),
            re : "(" + LOCALE.months.join("|") + ")"
        },
        m : {
            k : MONTH,
            fn : _zeroIndexedInt,
            re : re_d2
        },
        M : {
            k : MONTH,
            fn : _indexOf.bind(N, SHORT_MONTHS),
            re : "(" + SHORT_MONTHS.join("|") + ")"
        },
        n : {
            k : MONTH,
            fn : _zeroIndexedInt,
            re : re_d1_2
        },
        t : {
            re : "[0-9]{2}"
        },
        L : {
            re : "(?:0|1)"
        },
        o : {
            k : YEAR,
            fn : Number,
            re : re_d4
        },
        Y : {
            k : YEAR,
            fn : Number,
            re : re_d4
        },
        y : {
            k : YEAR,
            fn : function(o) {
                o = Number(o);
                return o += o < 30 ? 2e3 : 1900;
            },
            re : re_d2
        },
        a : {
            k : AMPM,
            fn : retVal,
            re : re_ampm
        },
        A : {
            k : AMPM,
            fn : _lc,
            re : _uc(re_ampm)
        },
        g : {
            k : HOUR,
            fn : _24hrTime,
            re : re_d1_2
        },
        G : {
            k : HOUR,
            fn : Number,
            re : re_d1_2
        },
        h : {
            k : HOUR,
            fn : _24hrTime,
            re : re_d2
        },
        H : {
            k : HOUR,
            fn : Number,
            re : re_d2
        },
        i : {
            k : MINUTE,
            fn : Number,
            re : re_d2
        },
        s : {
            k : SECOND,
            fn : Number,
            re : re_d2
        },
        u : {
            k : MILLISECOND,
            fn : Number,
            re : "([0-9]{1,})"
        },
        O : {
            k : TIMEZONE,
            fn : _timezoneOffset,
            re : "([\\+-][0-9]{4})"
        },
        P : {
            k : TIMEZONE,
            fn : _timezoneOffset,
            re : "([\\+-][0-9]{2}:[0-9]{2})"
        },
        T : {
            re : "[A-Z]{1,4}"
        },
        Z : {
            k : TIMEZONE,
            fn : Number,
            re : "([\\+-]?[0-9]{5})"
        },
        U : {
            k : UNIX,
            fn : Number,
            re : "(-?[0-9]{1,})"
        }
    };
    parser.c = {
        combo : [ parser.Y, parser.m, parser.d, parser.H, parser.i, parser.s, parser.P ],
        re : [ parser.Y.re, "-", parser.m.re, "-", parser.d.re, "T", parser.H.re, ":", parser.i.re, ":", parser.s.re, parser.P.re ].join("")
    };
    parser.r = {
        combo : [ parser.D, parser.d, parser.M, parser.Y, parser.H, parser.i, parser.s, parser.O ],
        re : [ parser.D.re, ", ", parser.d.re, " ", parser.M.re, " ", parser.Y.re, " ", parser.H.re, ":", parser.i.re, ":", parser.s.re, " ", parser.O.re ].join("")
    };
    Object.defineProperties(Date.prototype, forEach({
        adjust : adjust,
        between : between,
        clearTime : clearTime,
        clone : clone,
        format : format,
        getDayOfYear : getDayOfYear,
        getFirstOfTheMonth : getFirstOfTheMonth,
        getGMTOffset : getGMTOffset,
        getISODay : getISODay,
        getISODaysInYear : getISODaysInYear,
        getISOFirstMondayOfYear : getISOFirstMondayOfYear,
        getISOWeek : getISOWeek,
        getISOWeeksInYear : getISOWeeksInYear,
        getLastOfTheMonth : getLastOfTheMonth,
        getWeek : getWeek,
        isDST : isDST,
        isLeapYear : isLeapYear,
        setWeek : setWeek,
        timezone : timezone
    }, todesc));
    Object.defineProperties(Date, forEach({
        DAY : DAY,
        HOUR : "hr",
        MINUTE : MINUTE.substring(0, 3),
        MILLISECOND : MILLISECOND,
        MONTH : MONTH,
        SECOND : SECOND.substring(0, 3),
        WEEK : WEEK,
        YEAR : YEAR,
        MS_DAY : MS_DAY,
        MS_WEEK : MS_WEEK,
        MS_MONTH : 2592e6,
        MS_YEAR : 31536e6,
        filters : filter,
        formats : formats,
        parsers : parser,
        getOrdinal : LOCALE.getOrdinal,
        isLeapYear : LOCALE.isLeapYear,
        setLeapYear : LOCALE.setLeapYear,
        toDate : toDate
    }, todesc));
}();