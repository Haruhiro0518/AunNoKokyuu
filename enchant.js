/**
 * enchant.js v0.8.3
 * http://enchantjs.com
 *
 * Copyright UEI Corporation
 * Released under the MIT license.
 */

(function(window, undefined) {

    // ECMA-262 5th edition Functions
    if (typeof Object.defineProperty !== 'function') {
        Object.defineProperty = function(obj, prop, desc) {
            if ('value' in desc) {
                obj[prop] = desc.value;
            }
            if ('get' in desc) {
                obj.__defineGetter__(prop, desc.get);
            }
            if ('set' in desc) {
                obj.__defineSetter__(prop, desc.set);
            }
            return obj;
        };
    }
    if (typeof Object.defineProperties !== 'function') {
        Object.defineProperties = function(obj, descs) {
            for (var prop in descs) {
                if (descs.hasOwnProperty(prop)) {
                    Object.defineProperty(obj, prop, descs[prop]);
                }
            }
            return obj;
        };
    }
    if (typeof Object.create !== 'function') {
        Object.create = function(prototype, descs) {
            function F() {
            }
    
            F.prototype = prototype;
            var obj = new F();
            if (descs != null) {
                Object.defineProperties(obj, descs);
            }
            return obj;
        };
    }
    if (typeof Object.getPrototypeOf !== 'function') {
        Object.getPrototypeOf = function(obj) {
            return obj.__proto__;
        };
    }
    
    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = function(thisObject) {
            var func = this;
            var args = Array.prototype.slice.call(arguments, 1);
            var Nop = function() {
            };
            var bound = function() {
                var a = args.concat(Array.prototype.slice.call(arguments));
                return func.apply(
                    this instanceof Nop ? this : thisObject || window, a);
            };
            Nop.prototype = func.prototype;
            bound.prototype = new Nop();
            return bound;
        };
    }
    
    window.getTime = (function() {
        var origin;
        if (window.performance && window.performance.now) {
            origin = Date.now();
            return function() {
                return origin + window.performance.now();
            };
        } else if (window.performance && window.performance.webkitNow) {
            origin = Date.now();
            return function() {
                return origin + window.performance.webkitNow();
            };
        } else {
            return Date.now;
        }
    }());
    
    // define requestAnimationFrame
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (function() {
            var lastTime = window.getTime();
            var frame = 1000 / 60;
            return function(func) {
                var _id = setTimeout(function() {
                    lastTime = window.getTime();
                    func(lastTime);
                }, Math.max(0, lastTime + frame - window.getTime()));
                return _id;
            };
        }());
    
    /**
     [lang:ja]
     * グローバルにライブラリのクラスをエクスポートする.
     *
     * 引数に何も渡さない場合enchant.jsで定義されたクラス及びプラグインで定義されたクラス
     * 全てがエクスポートされる. 引数が一つ以上の場合はenchant.jsで定義されたクラスのみ
     * がデフォルトでエクスポートされ, プラグインのクラスをエクスポートしたい場合は明示的に
     * プラグインの識別子を引数として渡す必要がある.
     *
     * @example
     * enchant();     // 全てのクラスがエクスポートされる
     * enchant('');   // enchant.js本体のクラスのみがエクスポートされる
     * enchant('ui'); // enchant.js本体のクラスとui.enchant.jsのクラスがエクスポートされる
     *
     * @param {...String} [modules] エクスポートするモジュール. 複数指定できる.
     [/lang]
     [lang:en]
     * Export the library classes globally.
     *
     * When no arguments are given, all classes defined in enchant.js as well as all classes defined in
     * plugins will be exported. When more than one argument is given, by default only classes defined
     * in enchant.js will be exported. When you wish to export plugin classes you must explicitly deliver
     * the plugin identifiers as arguments.
     *
     * @example
     * enchant();     // All classes will be exported.
     * enchant('');   // Only classes in enchant.js will be exported.
     * enchant('ui'); // enchant.js classes and ui.enchant.js classes will be exported.
     *
     * @param {...String} [modules] Export module. Multiple designations possible.
     [/lang]
     [lang:de]
     * Globaler Export der Programmbibliotheken.
     *
     * Wenn keine Argument übergeben werden, werden alle Klassen die in enchant.js und in den Plugins
     * definiert sind exportiert. Falls mehr als ein Argument übergeben wurde, werden standardmäßig nur Klassen
     * die in enchant.js selbst definiert sind exporitert. Wenn auch Plugin Klassen exportiert werden sollen,
     * müssen die Plugin Bezeichner explizit als Argumente übergeben werden.
     *
     * @example
     * enchant();     // alle Klassen werden exportiert.
     * enchant('');   // nur Klassen die in enchant.js definiert sind werden exportiert.
     * enchant('ui'); // enchant.js Klassen und ui.enchant.js Klassen werden exportiert.
     *
     * @param {...String} [modules] Module die exportiert werden sollen.
     [/lang]
     * @function
     * @global
     * @name enchant
     */
    var enchant = function(modules) {
        if (modules != null) {
            if (!(modules instanceof Array)) {
                modules = Array.prototype.slice.call(arguments);
            }
            modules = modules.filter(function(module) {
                return [module].join();
            });
        }
        (function include(module, prefix) {
            var submodules = [],
                i, len;
            for (var prop in module) {
                if (module.hasOwnProperty(prop)) {
                    if (typeof module[prop] === 'function') {
                        window[prop] = module[prop];
                    } else if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                        if (modules == null) {
                            submodules.push(prop);
                        } else {
                            i = modules.indexOf(prefix + prop);
                            if (i !== -1) {
                                submodules.push(prop);
                                modules.splice(i, 1);
                            }
                        }
                    }
                }
            }
    
            for (i = 0, len = submodules.length; i < len; i++) {
                include(module[submodules[i]], prefix + submodules[i] + '.');
            }
        }(enchant, ''));
    
        // issue 185
        if (enchant.Class.getInheritanceTree(window.Game).length <= enchant.Class.getInheritanceTree(window.Core).length) {
            window.Game = window.Core;
        }
    
        if (modules != null && modules.length) {
            throw new Error('Cannot load module: ' + modules.join(', '));
        }
    };
    
    // export enchant
    window.enchant = enchant;
    
    window.addEventListener("message", function(msg, origin) {
        try {
            var data = JSON.parse(msg.data);
            if (data.type === "event") {
                enchant.Core.instance.dispatchEvent(new enchant.Event(data.value));
            } else if (data.type === "debug") {
                switch (data.value) {
                    case "start":
                        enchant.Core.instance.start();
                        break;
                    case "pause":
                        enchant.Core.instance.pause();
                        break;
                    case "resume":
                        enchant.Core.instance.resume();
                        break;
                    case "tick":
                        enchant.Core.instance._tick();
                        break;
                    default:
                        break;
                }
            }
        } catch (e) {
            // ignore
        }
    }, false);
    
    /**
     * @name enchant.Class
     * @class
     [lang:ja]
     * クラスのクラス.
     * @param {Function} [superclass] 継承するクラス.
     * @param {*} [definition] クラス定義.
     [/lang]
     [lang:en]
     * A Class representing a class which supports inheritance.
     * @param {Function} [superclass] The class from which the
     * new class will inherit the class definition.
     * @param {*} [definition] Class definition.
     [/lang]
     [lang:de]
     * Eine Klasse für Klassen, die Vererbung unterstützen.
     * @param {Function} [superclass] Die Klasse, deren Klassendefinition
     * die neue Klasse erben wird.
     * @param {*} [definition] Klassendefinition.
     [/lang]
     * @constructor
     */
    enchant.Class = function(superclass, definition) {
        return enchant.Class.create(superclass, definition);
    };
    
    /**
     [lang:ja]
     * クラスを作成する.
     *
     * ほかのクラスを継承したクラスを作成する場合, コンストラクタはデフォルトで
     * 継承元のクラスのものが使われる. コンストラクタをオーバーライドする場合継承元の
     * コンストラクタを適用するには明示的に呼び出す必要がある.
     *
     * @example
     * var Ball = Class.create({ // 何も継承しないクラスを作成する
     *     initialize: function(radius) { ... }, // メソッド定義
     *     fall: function() { ... }
     * });
     *
     * var Ball = Class.create(Sprite);  // Spriteを継承したクラスを作成する
     * var Ball = Class.create(Sprite, { // Spriteを継承したクラスを作成する
     *     initialize: function(radius) { // コンストラクタを上書きする
     *         Sprite.call(this, radius * 2, radius * 2); // 継承元のコンストラクタを適用する
     *         this.image = core.assets['ball.gif'];
     *     }
     * });
     *
     * @param {Function} [superclass] 継承するクラス.
     * @param {*} [definition] クラス定義.
     [/lang]
     [lang:en]
     * Creates a class.
     *
     * When defining a class that extends from another class, 
     * the constructor of the other class will be used by default.
     * Even if you override this constructor, you must still call it
     * to ensure that the class is initialized correctly.
     *
     * @example
     * // Creates a Ball class.
     * var Ball = Class.create({ 
     *
     *     // Ball's constructor
     *     initialize: function(radius) {
     *       // ... code ...
     *     }, 
     *
     *     // Defines a fall method that doesn't take any arguments.
     *     fall: function() { 
     *       // ... code ...
     *     }
     * });
     *
     * // Creates a Ball class that extends from "Sprite"
     * var Ball = Class.create(Sprite);  
     *
     * // Creates a Ball class that extends from "Sprite"
     * var Ball = Class.create(Sprite, { 
     *
     *     // Overwrite Sprite's constructor
     *     initialize: function(radius) { 
     *
     *         // Call Sprite's constructor.
     *         Sprite.call(this, radius * 2, radius * 2);
     *
     *         this.image = core.assets['ball.gif'];
     *     }
     * });
     *
     * @param {Function} [superclass] The class from which the
     * new class will inherit the class definition.
     * @param {*} [definition] Class definition.
     [/lang]
     [lang:de]
     * Erstellt eine neue Klasse
     *
     * Wenn eine Klasse definiert wird, die von einer anderen Klasse erbt, wird der Konstruktor der
     * Basisklasse als Standard definiert. Sollte dieser Konstruktor in der neuen Klasse überschrieben
     * werden, sollte der vorherige Konstruktor explizit aufgerufen werden, um eine korrekte
     * Klasseninitialisierung sicherzustellen.
     *
     * @example
     * var Ball = Class.create({ // definiert eine unabhängige Klasse.
     *     initialize: function(radius) { ... }, // Methodendefinitionen
     *     fall: function() { ... }
     * });
     *
     *   var Ball = Class.create(Sprite);  // definiert eine Klasse die von "Sprite" erbt.
     *   var Ball = Class.create(Sprite, { // definiert eine Klasse die von "Sprite" erbt.
     *       initialize: function(radius) { // überschreibt den Standardkonstruktor.
     *           Sprite.call(this, radius * 2, radius * 2); // Aufruf des Konstruktors der Basisklasse.
     *           this.image = core.assets['ball.gif'];
     *       }
     *   });
     *
     * @param {Function} [superclass] The class from which the
     * new class will inherit the class definition.
     * @param {*} [definition] Class definition.
     [/lang]
     * @static
     */
    enchant.Class.create = function(superclass, definition) {
        if (superclass == null && definition) {
            throw new Error("superclass is undefined (enchant.Class.create)");
        } else if (superclass == null) {
            throw new Error("definition is undefined (enchant.Class.create)");
        }
    
        if (arguments.length === 0) {
            return enchant.Class.create(Object, definition);
        } else if (arguments.length === 1 && typeof arguments[0] !== 'function') {
            return enchant.Class.create(Object, arguments[0]);
        }
    
        for (var prop in definition) {
            if (definition.hasOwnProperty(prop)) {
                if (typeof definition[prop] === 'object' && definition[prop] !== null && Object.getPrototypeOf(definition[prop]) === Object.prototype) {
                    if (!('enumerable' in definition[prop])) {
                        definition[prop].enumerable = true;
                    }
                } else {
                    definition[prop] = { value: definition[prop], enumerable: true, writable: true };
                }
            }
        }
        var Constructor = function() {
            if (this instanceof Constructor) {
                Constructor.prototype.initialize.apply(this, arguments);
            } else {
                return new Constructor();
            }
        };
        Constructor.prototype = Object.create(superclass.prototype, definition);
        Constructor.prototype.constructor = Constructor;
        if (Constructor.prototype.initialize == null) {
            Constructor.prototype.initialize = function() {
                superclass.apply(this, arguments);
            };
        }
    
        var tree = this.getInheritanceTree(superclass);
        for (var i = 0, l = tree.length; i < l; i++) {
            if (typeof tree[i]._inherited === 'function') {
                tree[i]._inherited(Constructor);
                break;
            }
        }
    
        return Constructor;
    };
    
    /**
     [lang:ja]
     * クラスの継承関係を取得する.
     * @param {Function} コンストラクタ.
     * @return {Function[]} 親のコンストラクタ.
     [/lang]
     [lang:en]
     * Get the inheritance tree of this class.
     * @param {Function} Constructor
     * @return {Function[]} Parent's constructor
     [/lang]
     [lang:de]
     * @param {Function}
     * @return {Function[]}
     [/lang]
     */
    enchant.Class.getInheritanceTree = function(Constructor) {
        var ret = [];
        var C = Constructor;
        var proto = C.prototype;
        while (C !== Object) {
            ret.push(C);
            proto = Object.getPrototypeOf(proto);
            C = proto.constructor;
        }
        return ret;
    };
    
    /**
     * @namespace
     [lang:ja]
     * enchant.js の環境変数.
     * new Core() を呼ぶ前に変更することで変更することで, 動作設定を変えることができる.
     [/lang]
     [lang:en]
     * enchant.js environment variables.
     * Execution settings can be changed by modifying these before calling new Core().
     [/lang]
     [lang:de]
     * Umgebungsvariable.
     [/lang]
     */
    enchant.ENV = {
        /**
         [lang:ja]
         * enchant.jsのバージョン.
         [/lang]
         [lang:en]
         * Version of enchant.js
         [/lang]
         * @type String
         */
        VERSION: '0.8.3',
        /**
         [lang:ja]
         * 実行中のブラウザの種類.
         [/lang]
         [lang:en]
         * Identifier of the current browser.
         [/lang]
         * @type String
         */
        BROWSER: (function(ua) {
            if (/Eagle/.test(ua)) {
                return 'eagle';
            } else if (/Opera/.test(ua)) {
                return 'opera';
            } else if (/MSIE|Trident/.test(ua)) {
                return 'ie';
            } else if (/Chrome/.test(ua)) {
                return 'chrome';
            } else if (/(?:Macintosh|Windows).*AppleWebKit/.test(ua)) {
                return 'safari';
            } else if (/(?:iPhone|iPad|iPod).*AppleWebKit/.test(ua)) {
                return 'mobilesafari';
            } else if (/Firefox/.test(ua)) {
                return 'firefox';
            } else if (/Android/.test(ua)) {
                return 'android';
            } else {
                return '';
            }
        }(navigator.userAgent)),
        /**
         [lang:ja]
         * 実行中のブラウザに対応するCSSのベンダープレフィックス.
         [/lang]
         [lang:en]
         * The CSS vendor prefix of the current browser.
         [/lang]
         * @type String
         */
        VENDOR_PREFIX: (function() {
            var ua = navigator.userAgent;
            if (ua.indexOf('Opera') !== -1) {
                return 'O';
            } else if (/MSIE|Trident/.test(ua)) {
                return 'ms';
            } else if (ua.indexOf('WebKit') !== -1) {
                return 'webkit';
            } else if (navigator.product === 'Gecko') {
                return 'Moz';
            } else {
                return '';
            }
        }()),
        /**
         [lang:ja]
         * ブラウザがタッチ入力をサポートしているかどうか.
         [/lang]
         [lang:en]
         * Determines if the current browser supports touch.
         * True, if touch is enabled.
         [/lang]
         * @type Boolean
         */
        TOUCH_ENABLED: (function() {
            var div = document.createElement('div');
            div.setAttribute('ontouchstart', 'return');
            return typeof div.ontouchstart === 'function';
        }()),
        /**
         [lang:ja]
         * 実行中の環境がRetina DisplayのiPhoneかどうか.
         [/lang]
         [lang:en]
         * Determines if the current browser is an iPhone with a retina display.
         * True, if this display is a retina display.
         [/lang]
         * @type Boolean
         */
        RETINA_DISPLAY: (function() {
            if (navigator.userAgent.indexOf('iPhone') !== -1 && window.devicePixelRatio === 2) {
                var viewport = document.querySelector('meta[name="viewport"]');
                if (viewport == null) {
                    viewport = document.createElement('meta');
                    document.head.appendChild(viewport);
                }
                viewport.setAttribute('content', 'width=640');
                return true;
            } else {
                return false;
            }
        }()),
        /**
         [lang:ja]
         * サウンドの再生にHTMLAudioElement/WebAudioの代わりにflashのプレーヤーを使うかどうか.
         [/lang]
         [lang:en]
         * Determines if for current browser Flash should be used to play 
         * sound instead of the native audio class.
         * True, if flash should be used.
         [/lang]
         * @type Boolean
         */
        USE_FLASH_SOUND: (function() {
            var ua = navigator.userAgent;
            var vendor = navigator.vendor || "";
            // non-local access, not on mobile mobile device, not on safari
            return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
        }()),
        /**
         [lang:ja]
         * クリック/タッチ時の規定の動作を許可するhtmlタグ名.
         * ここに追加したhtmlタグへのイベントはpreventDefaultされない.
         [/lang]
         [lang:en]
         * If click/touch event occure for these tags the setPreventDefault() method will not be called.
         [/lang]
         * @type String[]
         */
        USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
        /**
         [lang:ja]
         * SurfaceのメソッドとしてアクセスできるようにするCanvasRenderingContext2Dのメソッド.
         [/lang]
         [lang:en]
         * Method names of CanvasRenderingContext2D that will be defined as Surface method.
         [/lang]
         * @type String[]
         */
        CANVAS_DRAWING_METHODS: [
            'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
            'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
        ],
        /**
         [lang:ja]
         * キーバインドのテーブル.
         * デフォルトで 'left, 'up', 'right', 'down' のイベントが使用可能.
         * @example
         * enchant.ENV.KEY_BIND_TABLE = {
         *     37: 'left',
         *     38: 'up',
         *     39: 'right',
         *     40: 'down',
         *     32: 'a', //-> スペースキーをaボタンとして使う.
         * };
         [/lang]
         [lang:en]
         * Keybind Table.
         * You can use 'left', 'up', 'right', 'down' for preset event.
         * @example
         * enchant.ENV.KEY_BIND_TABLE = {
         *     37: 'left',
         *     38: 'up',
         *     39: 'right',
         *     40: 'down',
         *     32: 'a', //-> use 'space' key as 'a button'
         * };
         [/lang]
         * @type Object
         */
        KEY_BIND_TABLE: {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        },
        /**
         [lang:ja]
         * キー押下時の規定の動作を抑止するキーコード.
         * ここに追加したキーによるイベントはpreventDefaultされる.
         [/lang]
         [lang:en]
         * If keydown event occure for these keycodes the setPreventDefault() method will be called.
         [/lang]
         * @type Number[]
         */
        PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40],
        /**
         [lang:ja]
         * Mobile Safariでサウンドの再生を有効にするかどうか.
         [/lang]
         [lang:en]
         * Determines if Sound is enabled on Mobile Safari.
         [/lang]
         * @type Boolean
         */
        SOUND_ENABLED_ON_MOBILE_SAFARI: true,
        /**
         [lang:ja]
         * "touch to start" のシーンを使用するかどうか.
         * Mobile SafariでWebAudioのサウンドを再生するためには,
         * 一度タッチイベントハンドラ内で音声を流す必要があるため,
         * Mobile Safariでの実行時にはこのシーンが追加される.
         * falseにすることで, このシーンを表示しないようにできるが,
         * その場合は, 自身の責任でサウンドを有効化する必要がある.
         [/lang]
         [lang:en]
         * Determines if "touch to start" scene is enabled.
         * It is necessary on Mobile Safari because WebAudio Sound is
         * muted by browser until play any sound in touch event handler.
         * If set it to false, you should control this behavior manually.
         [/lang]
         * @type Boolean
         */
        USE_TOUCH_TO_START_SCENE: true,
        /**
         [lang:ja]
         * WebAudioを有効にするどうか.
         * trueならサウンドの再生の際HTMLAudioElementの代わりにWebAudioAPIを使用する.
         [/lang]
         [lang:en]
         * Determines if WebAudioAPI is enabled. (true: use WebAudioAPI instead of Audio element if possible)
         [/lang]
         * @type Boolean
         */
        USE_WEBAUDIO: (function() {
            return location.protocol !== 'file:';
        }()),
        /**
         [lang:ja]
         * アニメーション機能を有効にするかどうか.
         * trueだと, Node#tlにTimelineオブジェクトが作成される.
         [/lang]
         [lang:en]
         * Determines if animation feature is enabled. (true: Timeline instance will be generated in new Node)
         [/lang]
         * @type Boolean
         */
        USE_ANIMATION: true,
        /**
         [lang:ja]
         * タッチ位置の判定範囲.
         * 判定範囲はCOLOR_DETECTION_LEVEL * 2 + 1の正方形になる.
         [/lang]
         [lang:en]
         * Specifies range of the touch detection.
         * The detection area will be (COLOR_DETECTION_LEVEL * 2 + 1)px square.
         [/lang]
         * @type Boolean
         */
        COLOR_DETECTION_LEVEL: 2
    };
    
    /**
     * @scope enchant.Event.prototype
     */
    enchant.Event = enchant.Class.create({
        /**
         * @name enchant.Event
         * @class
         [lang:ja]
         * DOM Event風味の独自イベント実装を行ったクラス.
         * ただしフェーズの概念はなし.
         * @param {String} type Eventのタイプ
         [/lang]
         [lang:en]
         * A class for an independent implementation of events similar to DOM Events.
         * Does not include phase concepts.
         * @param {String} type Event type.
         [/lang]
         [lang:de]
         * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
         * (Events), ähnlich wie DOM Events.
         * Jedoch wird das Phasenkonzept nicht unterstützt.
         * @param {String} type Event Typ.
         [/lang]
         * @constructs
         */
        initialize: function(type) {
            /**
             [lang:ja]
             * イベントのタイプ.
             [/lang]
             [lang:en]
             * The type of the event.
             [/lang]
             [lang:de]
             * Typ des Ereignis.
             [/lang]
             * @type String
             */
            this.type = type;
            /**
             [lang:ja]
             * イベントのターゲット.
             [/lang]
             [lang:en]
             * The target of the event.
             [/lang]
             [lang:de]
             * Ziel des Ereignis.
             [/lang]
             * @type *
             */
            this.target = null;
            /**
             [lang:ja]
             * イベント発生位置のx座標.
             [/lang]
             [lang:en]
             * The x-coordinate of the event's occurrence.
             [/lang]
             [lang:de]
             * X Koordinate des Auftretens des Ereignis.
             [/lang]
             * @type Number
             */
            this.x = 0;
            /**
             [lang:ja]
             * イベント発生位置のy座標.
             [/lang]
             [lang:en]
             * The y-coordinate of the event's occurrence.
             [/lang]
             [lang:de]
             * Y Koordinate des Auftretens des Ereignis.
             [/lang]
             * @type Number
             */
            this.y = 0;
            /**
             [lang:ja]
             * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
             [/lang]
             [lang:en]
             * The x-coordinate of the event's occurrence relative to the object
             * which issued the event.
             [/lang]
             [lang:de]
             * X Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
             [/lang]
             * @type Number
             */
            this.localX = 0;
            /**
             [lang:ja]
             * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
             [/lang]
             [lang:en]
             * The y-coordinate of the event's occurrence relative to the object
             * which issued the event.
             [/lang]
             [lang:de]
             * Y Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
             [/lang]
             * @type Number
             */
            this.localY = 0;
        },
        _initPosition: function(pageX, pageY) {
            var core = enchant.Core.instance;
            this.x = this.localX = (pageX - core._pageX) / core.scale;
            this.y = this.localY = (pageY - core._pageY) / core.scale;
        }
    });
    
    /**
     [lang:ja]
     * Coreのロード完了時に発生するイベント.
     *
     * 画像のプリロードを行う場合ロードが完了するのを待ってゲーム開始時の処理を行う必要がある.
     * 発行するオブジェクト: {@link enchant.Core}
     *
     * @example
     * var core = new Core(320, 320);
     * core.preload('player.gif');
     * core.onload = function() {
     *     ... // ゲーム開始時の処理を記述
     * };
     * core.start();
     *
     [/lang]
     [lang:en]
     * An event dispatched once the core has finished loading.
     *
     * When preloading images, it is necessary to wait until preloading is complete
     * before starting the game.
     * Issued by: {@link enchant.Core}
     *
     * @example
     * var core = new Core(320, 320);
     * core.preload('player.gif');
     * core.onload = function() {
     *     ... // Describes initial core processing
     * };
     * core.start();
     *
     [/lang]
     [lang:de]
     * Ereignis, dass auftritt wenn das Laden des Spieles abgeschlossen wurde.
     *
     * Wenn Grafiken im voraus geladen werden ist es notwendig, auf dieses Ereignis zu warten bis mit
     * diesen gearbeitet werden kann. 
     * Objekt des Auftretens: {@link enchant.Core}
     *
     * @example
     * var core = new Core(320, 320);
     * core.preload('player.gif');
     * core.onload = function() {
     *     ... // initialisierung des Spieles 
     * };
     * core.start();
     *
     [/lang]
     * @type String
     */
    enchant.Event.LOAD = 'load';
    
    /**
     [lang:ja]
     * エラーの発生をCoreに伝える際に発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
     [/lang]
     [lang:en]
     * An event dispatched when an error occurs.
     * Issued by: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
     [/lang]
     [lang:de]
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
     [/lang]
     */
    enchant.Event.ERROR = 'error';
    
    /**
     [lang:ja]
     * 表示サイズが変わったときに発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the display size is changed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     @type String
     */
    enchant.Event.CORE_RESIZE = 'coreresize';
    
    /**
     [lang:ja]
     * Coreのロード進行中に発生するイベント.
     * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: {@link enchant.LoadingScene}
     [/lang]
     [lang:en]
     * An event dispatched while the core is loading.
     * Dispatched each time an image is preloaded.
     * Issued by: {@link enchant.LoadingScene}
     [/lang]
     [lang:de]
     * Ereignis, welches während des Ladens des Spieles auftritt.
     * Das Ereignis tritt jedesmal auf, wenn eine im voraus geladene Grafik geladen wurde.
     * Objekt des Auftretens: {@link enchant.LoadingScene}
     [/lang]
     * @type String
     */
    enchant.Event.PROGRESS = 'progress';
    
    /**
     [lang:ja]
     * フレーム開始時に発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event which is occurring when a new frame is beeing processed.
     * Issued object: {@link enchant.Core}, {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welches auftritt wenn ein neuer Frame bearbeitet wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.ENTER_FRAME = 'enterframe';
    
    /**
     [lang:ja]
     * フレーム終了時に発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}
     [/lang]
     [lang:en]
     * An event dispatched at the end of processing a new frame.
     * Issued by: {@link enchant.Core}, {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welches auftritt wenn ein Frame beendet wird.
     * Objekt des Auftretens: {@link enchant.Core}
     [/lang]
     * @type String
     */
    enchant.Event.EXIT_FRAME = 'exitframe';
    
    /**
     [lang:ja]
     * Sceneが開始したとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when a Scene begins.
     * Issued by: {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, dass auftritt wenn eine neue Szene
     * ({@link enchant.Scene}) beginnt.
     * Objekt des Auftretens: {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.ENTER = 'enter';
    
    /**
     [lang:ja]
     * Sceneが終了したとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when a Scene ends.
     * Issued by: {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, dass auftritt wenn eine Szene
     * ({@link enchant.Scene}) endet.
     * Objekt des Auftretens: {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.EXIT = 'exit';
    
    /**
     [lang:ja]
     * Nodeに子が追加されたとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when a Child is added to a Node.
     * Issued by: {@link enchant.Group}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn ein Kindelement zu einem Node
     * hinzugefügt wird.
     * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.CHILD_ADDED = 'childadded';
    
    /**
     [lang:ja]
     * NodeがGroupに追加されたとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event dispatched when a Node is added to a Group.
     * Issued by: {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der Node zu einer Gruppe
     * hinzugefügt wird.
     * Objekt des Auftretens: {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.ADDED = 'added';
    
    /**
     [lang:ja]
     * NodeがSceneに追加されたとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event dispatched when a Node is added to a Scene.
     * Issued by: {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der Node zu einer Szene
     * hinzugefügt wird.
     * Objekt des Auftretens: {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.ADDED_TO_SCENE = 'addedtoscene';
    
    /**
     [lang:ja]
     * Nodeから子が削除されたとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
     * @type String
     [/lang]
     [lang:en]
     * An event dispatched when a Child is removed from a Node.
     * Issued by: {@link enchant.Group}, {@link enchant.Scene}
     * @type String
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn ein Kindelement von einem Node
     * entfernt wird.
     * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.CHILD_REMOVED = 'childremoved';
    
    /**
     [lang:ja]
     * NodeがGroupから削除されたとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event dispatched when a Node is deleted from a Group.
     * Issued by: {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der Node aus einer Gruppe
     * entfernt wird.
     * Objekt des Auftretens: {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.REMOVED = 'removed';
    
    /**
     [lang:ja]
     * NodeがSceneから削除されたとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event dispatched when a Node is deleted from a Scene.
     * Issued by: {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der Node aus einer Szene
     * entfernt wird.
     * Objekt des Auftretens: {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';
    
    /**
     [lang:ja]
     * Nodeに対するタッチが始まったとき発生するイベント.
     * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event dispatched when a touch event intersecting a Node begins.
     * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn ein Touch auf einen Node
     * beginnt. Klicks werden als Touch behandelt.
     * Objekt des Auftretens: {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.TOUCH_START = 'touchstart';
    
    /**
     [lang:ja]
     * Nodeに対するタッチが移動したとき発生するイベント.
     * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event dispatched when a touch event intersecting the Node has been moved.
     * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn ein Touch auf einen Node
     * bewegt wurde. Klicks werden als Touch behandelt.
     * Objekt des Auftretens: {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.TOUCH_MOVE = 'touchmove';
    
    /**
     [lang:ja]
     * Nodeに対するタッチが終了したとき発生するイベント.
     * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
     [/lang]
     [lang:en]
     * An event dispatched when a touch event intersecting the Node ends.
     * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn ein Touch auf einen Node
     * endet. Klicks werden als Touch behandelt.
     * Objekt des Auftretens: {@link enchant.Node}
     [/lang]
     * @type String
     */
    enchant.Event.TOUCH_END = 'touchend';
    
    /**
     [lang:ja]
     * Entityがレンダリングされるときに発生するイベント.
     * 発行するオブジェクト: {@link enchant.Entity}
     [/lang]
     [lang:en]
     * An event dispatched when an Entity is rendered.
     * Issued by: {@link enchant.Entity}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn eine Entity
     * gerendert wird.
     * Objekt des Auftretens: {@link enchant.Entity}
     [/lang]
     * @type String
     */
    enchant.Event.RENDER = 'render';
    
    /**
     [lang:ja]
     * ボタン入力が始まったとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when a button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn ein Knopf gedückt wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.INPUT_START = 'inputstart';
    
    /**
     [lang:ja]
     * ボタン入力が変化したとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when button inputs change.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn eine Knopfeingabe verändert wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.INPUT_CHANGE = 'inputchange';
    
    /**
     [lang:ja]
     * ボタン入力が終了したとき発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when button input ends.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn eine Knopf losgelassen wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.INPUT_END = 'inputend';
    
    /**
     [lang:ja]
     * 入力が変化したとき発生するイベント.
     * ボタン入力が変化したとき発生する内部的なイベント.
     * 発行するオブジェクト: {@link enchant.InputSource}
     [/lang]
     [lang:en]
     * An internal event which is occurring when a input changes.
     * Issued object: {@link enchant.InputSource}
     [/lang]
     * @type String
     */
    enchant.Event.INPUT_STATE_CHANGED = 'inputstatechanged';
    
    /**
     [lang:ja]
     * leftボタンが押された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'left' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf gedrückt wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';
    
    /**
     [lang:ja]
     * leftボタンが離された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'left' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf losgelassen wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';
    
    /**
     [lang:ja]
     * rightボタンが押された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'right' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf gedrückt wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';
    
    /**
     [lang:ja]
     * rightボタンが離された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'right' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf losgelassen wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';
    
    /**
     [lang:ja]
     * upボタンが押された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'up' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf gedrückt wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';
    
    /**
     [lang:ja]
     * upボタンが離された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'up' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf losgelassen wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.UP_BUTTON_UP = 'upbuttonup';
    
    /**
     [lang:ja]
     * downボタンが離された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'down' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf gedrückt wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';
    
    /**
     [lang:ja]
     * downボタンが離された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'down' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf losgelassen wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';
    
    /**
     [lang:ja]
     * aボタンが押された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'a' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "A"-Knopf gedrückt wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.A_BUTTON_DOWN = 'abuttondown';
    
    /**
     [lang:ja]
     * aボタンが離された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'a' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "A"-Knopf losgelassen wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.A_BUTTON_UP = 'abuttonup';
    
    /**
     [lang:ja]
     * bボタンが押された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'b' button is pressed.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "B"-Knopf gedrückt wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.B_BUTTON_DOWN = 'bbuttondown';
    
    /**
     [lang:ja]
     * bボタンが離された発生するイベント.
     * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:en]
     * An event dispatched when the 'b' button is released.
     * Issued by: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     [lang:de]
     * Ereignis, welchses auftritt wenn der "B"-Knopf losgelassen wird.
     * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
     [/lang]
     * @type String
     */
    enchant.Event.B_BUTTON_UP = 'bbuttonup';
    
    /**
     [lang:ja]
     * アクションがタイムラインに追加された時に発行されるイベント.
     * looped が設定されている時も, アクションは一度タイムラインから削除されもう一度追加される.
     [/lang]
     [lang:en]
     * An event dispatched when an Action is added to a Timeline.
     * When looped, an Action is removed from the Timeline and added back into it.
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";
    
    /**
     [lang:ja]
     * アクションがタイムラインから削除された時に発行されるイベント.
     * looped が設定されている時も, アクションは一度タイムラインから削除されもう一度追加される.
     [/lang]
     [lang:en]
     * An event dispatched when an Action is removed from a Timeline.
     * When looped, an Action is removed from the timeline and added back into it.
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";
    
    /**
     [lang:ja]
     * アクションが開始された時に発行されるイベント.
     [/lang]
     [lang:en]
     * An event dispatched when an Action begins.
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.ACTION_START = "actionstart";
    
    /**
     [lang:ja]
     * アクションが終了するときに発行されるイベント.
     [/lang]
     [lang:en]
     * An event dispatched when an Action finishes.
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.ACTION_END = "actionend";
    
    /**
     [lang:ja]
     * アクションが1フレーム経過するときに発行されるイベント.
     [/lang]
     [lang:en]
     * An event dispatched when an Action has gone through one frame.
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.ACTION_TICK = "actiontick";
    
    /**
     [lang:ja]
     * アクションが追加された時に, タイムラインに対して発行されるイベント.
     [/lang]
     [lang:en]
     * An event dispatched to the Timeline when an Action is added.
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.ACTION_ADDED = "actionadded";
    
    /**
     [lang:ja]
     * アクションが削除された時に, タイムラインに対して発行されるイベント.
     [/lang]
     [lang:en]
     * An event dispatched to the Timeline when an Action is removed.
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.ACTION_REMOVED = "actionremoved";
    
    /**
     [lang:ja]
     * フレームアニメーションが終了したときに発生するイベント. フレームの再生がnullに到達したことを意味する.
     [/lang]
     [lang:en]
     * An event dispatched when an animation finishes, meaning null element was encountered
     * Issued by: {@link enchant.Sprite}
     [/lang]
     [lang:de]
     [/lang]
     * @type String
     */
    enchant.Event.ANIMATION_END = "animationend";
    
    /**
     * @scope enchant.EventTarget.prototype
     */
    enchant.EventTarget = enchant.Class.create({
        /**
         * @name enchant.EventTarget
         * @class
         [lang:ja]
         * DOM Event風味の独自イベント実装を行ったクラス.
         * ただしフェーズの概念はなし.
         [/lang]
         [lang:en]
         * A class for implementation of events similar to DOM Events.
         * However, it does not include the concept of phases.
         [/lang]
         [lang:de]
         * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
         * (Events), ähnlich wie DOM Events.
         * Jedoch wird das Phasenkonzept nicht unterstützt.
         [/lang]
         * @constructs
         */
        initialize: function() {
            this._listeners = {};
        },
        /**
         [lang:ja]
         * イベントリスナを追加する.
         * @param {String} type イベントのタイプ.
         * @param {Function(e:enchant.Event)} listener 追加するイベントリスナ.
         [/lang]
         [lang:en]
         * Add a new event listener which will be executed when the event
         * is dispatched.
         * @param {String} type Type of the events.
         * @param {Function(e:enchant.Event)} listener Event listener to be added.
         [/lang]
         [lang:de]
         * Fügt einen neuen Ereignisbeobachter hinzu, welcher beim Auftreten des
         * Events ausgeführt wird.
         * @param {String} type Ereignis Typ.
         * @param {Function(e:enchant.Event)} listener Der Ereignisbeobachter 
         * der hinzugefügt wird.
         [/lang]
         */
        addEventListener: function(type, listener) {
            var listeners = this._listeners[type];
            if (listeners == null) {
                this._listeners[type] = [listener];
            } else if (listeners.indexOf(listener) === -1) {
                listeners.unshift(listener);
    
            }
        },
        /**
         [lang:ja]
         * addEventListener と同じ.
         * @param {String} type イベントのタイプ.
         * @param {Function(e:enchant.Event)} listener 追加するイベントリスナ.
         [/lang]
         [lang:en]
         * Synonym for addEventListener.
         * @param {String} type Type of the events.
         * @param {Function(e:enchant.Event)} listener Event listener to be added.
         [/lang]
         [lang:de]
         * Synonym für addEventListener.
         * @param {String} type Ereignis Typ.
         * @param {Function(e:enchant.Event)} listener Der Ereignisbeobachter 
         * der hinzugefügt wird.
         [/lang]
         * @see enchant.EventTarget#addEventListener
         */
        on: function() {
            this.addEventListener.apply(this, arguments);
        },
        /**
         [lang:ja]
         * イベントリスナを削除する.
         * @param {String} type イベントのタイプ.
         * @param {Function(e:enchant.Event)} listener 削除するイベントリスナ.
         [/lang]
         [lang:en]
         * Delete an event listener.
         * @param {String} [type] Type of the events.
         * @param {Function(e:enchant.Event)} listener Event listener to be deleted.
         [/lang]
         [lang:de]
         * Entfernt einen Ereignisbeobachter.
         * @param {String} [type] Ereignis Typ.
         * @param {Function(e:enchant.Event)} listener Der Ereignisbeobachter 
         * der entfernt wird.
         [/lang]
         */
        removeEventListener: function(type, listener) {
            var listeners = this._listeners[type];
            if (listeners != null) {
                var i = listeners.indexOf(listener);
                if (i !== -1) {
                    listeners.splice(i, 1);
                }
            }
        },
        /**
         [lang:ja]
         * すべてのイベントリスナを削除する.
         * @param {String} type イベントのタイプ.
         [/lang]
         [lang:en]
         * Clear all defined event listeners of a given type.
         * If no type is given, all listeners will be removed.
         * @param {String} type Type of the events.
         [/lang]
         [lang:de]
         * Entfernt alle Ereignisbeobachter für einen Typ.
         * Wenn kein Typ gegeben ist, werden alle 
         * Ereignisbeobachter entfernt.
         * @param {String} type Ereignis Typ.
         [/lang]
         */
        clearEventListener: function(type) {
            if (type != null) {
                delete this._listeners[type];
            } else {
                this._listeners = {};
            }
        },
        /**
         [lang:ja]
         * イベントを発行する.
         * @param {enchant.Event} e 発行するイベント.
         [/lang]
         [lang:en]
         * Issue an event.
         * @param {enchant.Event} e Event to be issued.
         [/lang]
         [lang:de]
         * Löst ein Ereignis aus.
         * @param {enchant.Event} e Ereignis das ausgelöst werden soll.
         [/lang]
         */
        dispatchEvent: function(e) {
            e.target = this;
            e.localX = e.x - this._offsetX;
            e.localY = e.y - this._offsetY;
            if (this['on' + e.type] != null){
                this['on' + e.type](e);
            }
            var listeners = this._listeners[e.type];
            if (listeners != null) {
                listeners = listeners.slice();
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(this, e);
                }
            }
        }
    });
    
    (function() {
        var core;
        /**
         * @scope enchant.Core.prototype
         */
        enchant.Core = enchant.Class.create(enchant.EventTarget, {
            /**
             * @name enchant.Core
             * @class
             [lang:ja]
             * アプリケーションのメインループ, シーンを管理するクラス.
             *
             * インスタンスは一つしか存在することができず, すでにインスタンスが存在する状態で
             * コンストラクタを実行した場合既存のものが上書きされる. 存在するインスタンスには
             * {@link enchant.Core.instance} からアクセスできる.
             *
             * @param {Number} [width=320] 画面の横幅.
             * @param {Number} [height=320] 画面の高さ.
             [/lang]
             [lang:en]
             * A class for controlling the core’s main loop and scenes.
             *
             * There can be only one instance at a time. When the
             * constructor is executed while an instance exists, the
             * existing instance will be overwritten. The existing instance
             * can be accessed from {@link enchant.Core.instance}.
             *
             * @param {Number} [width=320] The width of the core viewport.
             * @param {Number} [height=320] The height of the core viewport.
             [/lang]
             [lang:de]
             * Klasse, welche die Spielschleife und Szenen kontrolliert.
             *
             * Es kann immer nur eine Instanz geben und sollte der Konstruktor ausgeführt werden,
             * obwohl bereits eine Instanz existiert, wird die vorherige Instanz überschrieben.
             * Auf die aktuell existierende Instanz kann über die {@link enchant.Core.instance}
             * Variable zugegriffen werden.
             *
             * @param {Number} [width=320] Die Breite des Spieles.
             * @param {Number} [height=320] Die Höhe des Spieles.
             [/lang]
             * @constructs
             * @extends enchant.EventTarget
             */
            initialize: function(width, height) {
                if (window.document.body === null) {
                    // @TODO postpone initialization after window.onload
                    throw new Error("document.body is null. Please excute 'new Core()' in window.onload.");
                }
    
                enchant.EventTarget.call(this);
                var initial = true;
                if (core) {
                    initial = false;
                    core.stop();
                }
                core = enchant.Core.instance = this;
    
                this._calledTime = 0;
                this._mousedownID = 0;
                this._surfaceID = 0;
                this._soundID = 0;
    
                this._scenes = [];
    
                width = width || 320;
                height = height || 320;
    
                var stage = document.getElementById('enchant-stage');
                var scale, sWidth, sHeight;
                if (!stage) {
                    stage = document.createElement('div');
                    stage.id = 'enchant-stage';
                    stage.style.position = 'absolute';
    
                    if (document.body.firstChild) {
                        document.body.insertBefore(stage, document.body.firstChild);
                    } else {
                        document.body.appendChild(stage);
                    }
                    scale = Math.min(
                        window.innerWidth / width,
                        window.innerHeight / height
                    );
                    this._pageX = stage.getBoundingClientRect().left;
                    this._pageY = stage.getBoundingClientRect().top;
                } else {
                    var style = window.getComputedStyle(stage);
                    sWidth = parseInt(style.width, 10);
                    sHeight = parseInt(style.height, 10);
                    if (sWidth && sHeight) {
                        scale = Math.min(
                            sWidth / width,
                            sHeight / height
                        );
                    } else {
                        scale = 1;
                    }
                    while (stage.firstChild) {
                        stage.removeChild(stage.firstChild);
                    }
                    stage.style.position = 'relative';
    
                    var bounding = stage.getBoundingClientRect();
                    this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
                    this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);
                }
                stage.style.fontSize = '12px';
                stage.style.webkitTextSizeAdjust = 'none';
                stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
                this._element = stage;
    
                this.addEventListener('coreresize', this._oncoreresize);
    
                this._width = width;
                this._height = height;
                this.scale = scale;
    
                /**
                 [lang:ja]
                 * フレームレート.
                 [/lang]
                 [lang:en]
                 * The frame rate of the core.
                 [/lang]
                 [lang:de]
                 * Frame Rate des Spieles.
                 [/lang]
                 * @type Number
                 */
                this.fps = 30;
                /**
                 [lang:ja]
                 * アプリの開始からのフレーム数.
                 [/lang]
                 [lang:en]
                 * The number of frames processed since the core was started.
                 [/lang]
                 [lang:de]
                 * Anzahl der Frames seit dem Spielestart.
                 [/lang]
                 * @type Number
                 */
                this.frame = 0;
                /**
                 [lang:ja]
                 * アプリが実行可能な状態かどうか.
                 [/lang]
                 [lang:en]
                 * Indicates whether or not the core can be executed.
                 [/lang]
                 [lang:de]
                 * Zeigt an ob das Spiel ausgeführt werden kann.
                 [/lang]
                 * @type Boolean
                 */
                this.ready = false;
                /**
                 [lang:ja]
                 * アプリが実行状態かどうか.
                 [/lang]
                 [lang:en]
                 * Indicates whether or not the core is currently running.
                 [/lang]
                 [lang:de]
                 * Zeigt an ob das Spiel derzeit ausgeführt wird.
                 [/lang]
                 * @type Boolean
                 */
                this.running = false;
                /**
                 [lang:ja]
                 * ロードされた画像をパスをキーとして保存するオブジェクト.
                 [/lang]
                 [lang:en]
                 * Object which stores loaded assets using their paths as keys.
                 [/lang]
                 [lang:de]
                 * Geladene Objekte werden unter dem Pfad als Schlüssel in diesem Objekt abgelegt.
                 [/lang]
                 * @type Object
                 */
                this.assets = {};
                var assets = this._assets = [];
                (function detectAssets(module) {
                    if (module.assets) {
                        enchant.Core.instance.preload(module.assets);
                    }
                    for (var prop in module) {
                        if (module.hasOwnProperty(prop)) {
                            if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                                detectAssets(module[prop]);
                            }
                        }
                    }
                }(enchant));
    
                /**
                 [lang:ja]
                 * 現在のScene. Sceneスタック中の一番上のScene.
                 [/lang]
                 [lang:en]
                 * The Scene which is currently displayed. This Scene is on top of the Scene stack.
                 [/lang]
                 [lang:de]
                 * Die aktuell dargestellte Szene.
                 * Diese Szene befindet sich oben auf dem Stapelspeicher.
                 [/lang]
                 * @type enchant.Scene
                 */
                this.currentScene = null;
                /**
                 [lang:ja]
                 * ルートScene. Sceneスタック中の一番下のScene.
                 [/lang]
                 [lang:en]
                 * The root Scene. The Scene at the bottom of the Scene stack.
                 [/lang]
                 [lang:de]
                 * Die Ursprungsszene.
                 * Diese Szene befindet sich unten auf dem Stapelspeicher.
                 [/lang]
                 * @type enchant.Scene
                 */
                this.rootScene = new enchant.Scene();
                this.pushScene(this.rootScene);
                /**
                 [lang:ja]
                 * ローディング時に表示されるScene.
                 [/lang]
                 [lang:en]
                 * The Scene to be displayed during loading.
                 [/lang]
                 [lang:de]
                 * Die Szene, welche während des Ladevorgangs dargestellt wird.
                 [/lang]
                 * @type enchant.Scene
                 */
                this.loadingScene = new enchant.LoadingScene();
    
                /**
                 [lang:ja]
                 * 一度でも {@link enchant.Core#start} が呼ばれたことがあるかどうか.
                 [/lang]
                 [/lang:ja]
                 * Indicates whether or not {@link enchant.Core#start} has been called.
                 [/lang]
                 [lang:de]
                 [/lang]
                 * @type Boolean
                 * @private
                 */
                this._activated = false;
    
                this._offsetX = 0;
                this._offsetY = 0;
    
                /**
                 [lang:ja]
                 * アプリに対する入力状態を保存するオブジェクト.
                 [/lang]
                 [lang:en]
                 * Object that saves the current input state for the core.
                 [/lang]
                 [lang:de]
                 * Objekt, welches den aktuellen Eingabestatus des Spieles speichert.
                 [/lang]
                 * @type Object
                 */
                this.input = {};
    
                this.keyboardInputManager = new enchant.KeyboardInputManager(window.document, this.input);
                this.keyboardInputManager.addBroadcastTarget(this);
                this._keybind = this.keyboardInputManager._binds;
    
                if (!enchant.ENV.KEY_BIND_TABLE) {
                    enchant.ENV.KEY_BIND_TABLE = {};
                }
    
                for (var prop in enchant.ENV.KEY_BIND_TABLE) {
                    this.keybind(prop, enchant.ENV.KEY_BIND_TABLE[prop]);
                }
    
                if (initial) {
                    stage = enchant.Core.instance._element;
                    var evt;
                    document.addEventListener('keydown', function(e) {
                        core.dispatchEvent(new enchant.Event('keydown'));
                        if (enchant.ENV.PREVENT_DEFAULT_KEY_CODES.indexOf(e.keyCode) !== -1) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }, true);
    
                    if (enchant.ENV.TOUCH_ENABLED) {
                        stage.addEventListener('touchstart', function(e) {
                            var tagName = (e.target.tagName).toLowerCase();
                            if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                                e.preventDefault();
                                if (!core.running) {
                                    e.stopPropagation();
                                }
                            }
                        }, true);
                        stage.addEventListener('touchmove', function(e) {
                            var tagName = (e.target.tagName).toLowerCase();
                            if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                                e.preventDefault();
                                if (!core.running) {
                                    e.stopPropagation();
                                }
                            }
                        }, true);
                        stage.addEventListener('touchend', function(e) {
                            var tagName = (e.target.tagName).toLowerCase();
                            if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                                e.preventDefault();
                                if (!core.running) {
                                    e.stopPropagation();
                                }
                            }
                        }, true);
                    }
                    stage.addEventListener('mousedown', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            core._mousedownID++;
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('mousemove', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('mouseup', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    core._touchEventTarget = {};
                    if (enchant.ENV.TOUCH_ENABLED) {
                        stage.addEventListener('touchstart', function(e) {
                            var core = enchant.Core.instance;
                            var evt = new enchant.Event(enchant.Event.TOUCH_START);
                            var touches = e.changedTouches;
                            var touch, target;
                            for (var i = 0, l = touches.length; i < l; i++) {
                                touch = touches[i];
                                evt._initPosition(touch.pageX, touch.pageY);
                                target = core.currentScene._determineEventTarget(evt);
                                core._touchEventTarget[touch.identifier] = target;
                                target.dispatchEvent(evt);
                            }
                        }, false);
                        stage.addEventListener('touchmove', function(e) {
                            var core = enchant.Core.instance;
                            var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                            var touches = e.changedTouches;
                            var touch, target;
                            for (var i = 0, l = touches.length; i < l; i++) {
                                touch = touches[i];
                                target = core._touchEventTarget[touch.identifier];
                                if (target) {
                                    evt._initPosition(touch.pageX, touch.pageY);
                                    target.dispatchEvent(evt);
                                }
                            }
                        }, false);
                        stage.addEventListener('touchend', function(e) {
                            var core = enchant.Core.instance;
                            var evt = new enchant.Event(enchant.Event.TOUCH_END);
                            var touches = e.changedTouches;
                            var touch, target;
                            for (var i = 0, l = touches.length; i < l; i++) {
                                touch = touches[i];
                                target = core._touchEventTarget[touch.identifier];
                                if (target) {
                                    evt._initPosition(touch.pageX, touch.pageY);
                                    target.dispatchEvent(evt);
                                    delete core._touchEventTarget[touch.identifier];
                                }
                            }
                        }, false);
                    }
                    stage.addEventListener('mousedown', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_START);
                        evt._initPosition(e.pageX, e.pageY);
                        var target = core.currentScene._determineEventTarget(evt);
                        core._touchEventTarget[core._mousedownID] = target;
                        target.dispatchEvent(evt);
                    }, false);
                    stage.addEventListener('mousemove', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                        evt._initPosition(e.pageX, e.pageY);
                        var target = core._touchEventTarget[core._mousedownID];
                        if (target) {
                            target.dispatchEvent(evt);
                        }
                    }, false);
                    stage.addEventListener('mouseup', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_END);
                        evt._initPosition(e.pageX, e.pageY);
                        var target = core._touchEventTarget[core._mousedownID];
                        if (target) {
                            target.dispatchEvent(evt);
                        }
                        delete core._touchEventTarget[core._mousedownID];
                    }, false);
                }
            },
            /**
             [lang:ja]
             * 画面の横幅.
             [/lang]
             [lang:en]
             * The width of the core screen.
             [/lang]
             [lang:de]
             * Breite des Spieles.
             [/lang]
             * @type Number
             */
            width: {
                get: function() {
                    return this._width;
                },
                set: function(w) {
                    this._width = w;
                    this._dispatchCoreResizeEvent();
                }
            },
            /**
             [lang:ja]
             * 画面の高さ.
             [/lang]
             [lang:en]
             * The height of the core screen.
             [/lang]
             [lang:de]
             * Höhe des Spieles.
             [/lang]
             * @type Number
             */
            height: {
                get: function() {
                    return this._height;
                },
                set: function(h) {
                    this._height = h;
                    this._dispatchCoreResizeEvent();
                }
            },
            /**
             [lang:ja]
             * 画面の表示倍率.
             [/lang]
             [lang:en]
             * The scaling of the core rendering.
             [/lang]
             [lang:de]
             * Skalierung der Spieldarstellung.
             [/lang]
             * @type Number
             */
            scale: {
                get: function() {
                    return this._scale;
                },
                set: function(s) {
                    this._scale = s;
                    this._dispatchCoreResizeEvent();
                }
            },
            _dispatchCoreResizeEvent: function() {
                var e = new enchant.Event('coreresize');
                e.width = this._width;
                e.height = this._height;
                e.scale = this._scale;
                this.dispatchEvent(e);
            },
            _oncoreresize: function(e) {
                this._element.style.width = Math.floor(this._width * this._scale) + 'px';
                this._element.style.height = Math.floor(this._height * this._scale) + 'px';
                var scene;
                for (var i = 0, l = this._scenes.length; i < l; i++) {
                    scene = this._scenes[i];
                    scene.dispatchEvent(e);
                }
            },
            /**
             [lang:ja]
             * ファイルのプリロードを行う.
             *
             * プリロードを行うよう設定されたファイルは {@link enchant.Core#start} が実行されるとき
             * ロードが行われる. 全てのファイルのロードが完了したときはCoreオブジェクトからload
             * イベントが発行され, Coreオブジェクトのassetsプロパティから画像ファイルの場合は
             * Surfaceオブジェクトとして, 音声ファイルの場合はSoundオブジェクトとして,
             * その他の場合は文字列としてアクセスできるようになる.
             *
             * なおこのSurfaceオブジェクトは {@link enchant.Surface.load} を使って作成されたものである
             * ため直接画像操作を行うことはできない. enchant.Surface.loadの項を参照.
             *
             * @example
             * core.preload('player.gif');
             * core.onload = function() {
             *     var sprite = new Sprite(32, 32);
             *     sprite.image = core.assets['player.gif']; // パス名でアクセス
             *     ...
             * };
             * core.start();
             *
             * @param {...String|String[]} assets プリロードするファイルのパス. 複数指定できる.
             [/lang]
             [lang:en]
             * File preloader.
             *
             * Loads the files specified in the parameters when
             * {@link enchant.Core#start} is called.
             * When all files are loaded, a {@link enchant.Event.LOAD}
             * event is dispatched from the Core object. Depending on the
             * type of each file, different objects will be created and
             * stored in {@link enchant.Core#assets} Variable.
             *
             * When an image file is loaded, a {@link enchant.Surface} is
             * created. If a sound file is loaded, an {@link enchant.Sound}
             * object is created. Any other file type will be accessible
             * as a string.
             *
             * In addition, because this Surface object is created with
             * {@link enchant.Surface.load}, it is not possible to
             * manipulate the image directly.
             * Refer to the {@link enchant.Surface.load} documentation.
             *
             * @example
             * core.preload('player.gif');
             * core.onload = function() {
             *     var sprite = new Sprite(32, 32);
             *     sprite.image = core.assets['player.gif']; // Access via path
             *     ...
             * };
             * core.start();
             *
             * @param {...String|String[]} assets Path of images to be preloaded.
             * Multiple settings possible.
             [/lang]
             [lang:de]
             * Lässt Dateien im voraus laden.
             *
             * Diese Methode setzt die Dateien die im voraus geladen werden sollen. Wenn {@link enchant.Core#start}
             * aufgerufen wird, findet das tatsächliche laden der Resource statt. Sollten alle Dateien vollständig
             * geladen sein, wird ein {@link enchant.Event.LOAD} Ereignis auf dem Core Objekt ausgelöst.
             * Abhängig von den Dateien die geladen werden sollen, werden unterschiedliche Objekte erstellt und in
             * dem {@link enchant.Core#assets} Feld gespeichert.
             * Falls ein Bild geladen wird, wird ein {@link enchant.Surface} Objekt erstellt. Wenn es eine Ton Datei ist,
             * wird ein {@link enchant.Sound} Objekt erstellt. Ansonsten kann auf die Datei über einen String zugegriffen werden.
             *
             * Da die Surface Objekte mittels {@link enchant.Surface.load} erstellt werden ist zusätlich ist zu beachten, dass
             * eine direkte Objektmanipulation nicht möglich ist.
             * Für diesen Fall ist auf die {@link enchant.Surface.load} Dokumentation zu verweisen.
             *
             * @example
             * core.preload('player.gif');
             * core.onload = function() {
             *     var sprite = new Sprite(32, 32);
             *     sprite.image = core.assets['player.gif']; // zugriff mittels Dateipfades
             *     ...
             * };
             * core.start();
             *
             * @param {...String|String[]} assets Pfade zu den Dateien die im voraus geladen werden sollen.
             * Mehrfachangaben möglich.
             [/lang]
             * @return {enchant.Core} this
             */
            preload: function(assets) {
                var a;
                if (!(assets instanceof Array)) {
                    if (typeof assets === 'object') {
                        a = [];
                        for (var name in assets) {
                            if (assets.hasOwnProperty(name)) {
                                a.push([ assets[name], name ]);
                            }
                        }
                        assets = a;
                    } else {
                        assets = Array.prototype.slice.call(arguments);
                    }
                }
                Array.prototype.push.apply(this._assets, assets);
                return this;
            },
            /**
             [lang:ja]
             * ファイルのロードを行う.
             *
             * @param {String} src ロードするファイルのパス.
             * @param {String} [alias] ロードするファイルに設定したい名前.
             * @param {Function} [callback] ファイルのロードが完了したときに呼び出される関数.
             * @param {Function} [onerror] ファイルのロードに失敗したときに呼び出される関数.
             * @return {enchant.Deferred} ファイル読み込み後に起動するDeferredオブジェクト.
             [/lang]
             [lang:en]
             * Loads a file.
             *
             * @param {String} src File path of the resource to be loaded.
             * @param {String} [alias] Name you want to designate for the resource to be loaded.
             * @param {Function} [callback] Function to be called if the file loads successfully.
             * @param {Function} [onerror] Function to be called if the file fails to load.
             * @return {enchant.Deferred}
             [/lang]
             [lang:de]
             * Laden von Dateien.
             *
             * @param {String} src Pfad zu der Datei die geladen werden soll.
             * @param {String} [alias]
             * @param {Function} [callback] Funktion die ausgeführt wird wenn das laden abgeschlossen wurde.
             * @param {Function} [onerror]
             * @return {enchant.Deferred}
             [/lang]
             */
            load: function(src, alias, callback, onerror) {
                var assetName;
                if (typeof arguments[1] === 'string') {
                    assetName = alias;
                    callback = callback || function() {};
                    onerror = onerror || function() {};
                } else {
                    assetName = src;
                    var tempCallback = callback;
                    callback = arguments[1] || function() {};
                    onerror = tempCallback || function() {};
                }
    
                var ext = enchant.Core.findExt(src);
    
                return enchant.Deferred.next(function() {
                    var d = new enchant.Deferred();
                    var _callback = function(e) {
                        d.call(e);
                        callback.call(this, e);
                    };
                    var _onerror = function(e) {
                        d.fail(e);
                        onerror.call(this, e);
                    };
                    if (enchant.Core._loadFuncs[ext]) {
                        enchant.Core.instance.assets[assetName] = enchant.Core._loadFuncs[ext](src, ext, _callback, _onerror);
                    } else {
                        var req = new XMLHttpRequest();
                        req.open('GET', src, true);
                        req.onreadystatechange = function() {
                            if (req.readyState === 4) {
                                if (req.status !== 200 && req.status !== 0) {
                                    // throw new Error(req.status + ': ' + 'Cannot load an asset: ' + src);
                                    var e = new enchant.Event('error');
                                    e.message = req.status + ': ' + 'Cannot load an asset: ' + src;
                                    _onerror.call(enchant.Core.instance, e);
                                }
    
                                var type = req.getResponseHeader('Content-Type') || '';
                                if (type.match(/^image/)) {
                                    core.assets[assetName] = enchant.Surface.load(src, _callback, _onerror);
                                } else if (type.match(/^audio/)) {
                                    core.assets[assetName] = enchant.Sound.load(src, type, _callback, _onerror);
                                } else {
                                    core.assets[assetName] = req.responseText;
                                    _callback.call(enchant.Core.instance, new enchant.Event('load'));
                                }
                            }
                        };
                        req.send(null);
                    }
                    return d;
                });
            },
            /**
             [lang:ja]
             * アプリを起動する.
             *
             * enchant.Core#fpsで設定されたフレームレートに従って {@link enchant.Core#currentScene} の
             * フレームの更新が行われるようになる. プリロードする画像が存在する場合はロードが
             * 始まりローディング画面が表示される.
             * @return {enchant.Deferred} ローディング画面終了後に起動するDeferredオブジェクト.
             [/lang]
             [lang:en]
             * Start the core.
             *
             * Sets the framerate of the {@link enchant.Core#currentScene}
             * according to the value stored in {@link enchant.core#fps}. If
             * there are images to preload, loading will begin and the
             * loading screen will be displayed.
             * @return {enchant.Deferred}
             [/lang]
             [lang:de]
             * Starte das Spiel
             *
             * Je nach der Frame Rate definiert in {@link enchant.Core#fps}, wird der Frame in der
             * {@link enchant.Core#currentScene} aktualisiert. Sollten Dateien die im voraus geladen werden
             * sollen vorhanden sein, beginnt das laden dieser Dateien und der Ladebildschirm wird dargestellt.
             * @return {enchant.Deferred}
             [/lang]
             */
            start: function(deferred) {
                var onloadTimeSetter = function() {
                    this.frame = 0;
                    this.removeEventListener('load', onloadTimeSetter);
                };
                this.addEventListener('load', onloadTimeSetter);
    
                this.currentTime = window.getTime();
                this.running = true;
                this.ready = true;
    
                if (!this._activated) {
                    this._activated = true;
                    if (enchant.ENV.BROWSER === 'mobilesafari' &&
                        enchant.ENV.USE_WEBAUDIO &&
                        enchant.ENV.USE_TOUCH_TO_START_SCENE) {
                        var d = new enchant.Deferred();
                        var scene = this._createTouchToStartScene();
                        scene.addEventListener(enchant.Event.TOUCH_START, function waitTouch() {
                            this.removeEventListener(enchant.Event.TOUCH_START, waitTouch);
                            var a = new enchant.WebAudioSound();
                            a.buffer = enchant.WebAudioSound.audioContext.createBuffer(1, 1, 48000);
                            a.play();
                            core.removeScene(scene);
                            core.start(d);
                        }, false);
                        core.pushScene(scene);
                        return d;
                    }
                }
    
                this._requestNextFrame(0);
    
                var ret = this._requestPreload()
                    .next(function() {
                        enchant.Core.instance.loadingScene.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
                    });
    
                if (deferred) {
                    ret.next(function(arg) {
                        deferred.call(arg);
                    })
                    .error(function(arg) {
                        deferred.fail(arg);
                    });
                }
    
                return ret;
            },
            _requestPreload: function() {
                var o = {};
                var loaded = 0,
                    len = 0,
                    loadFunc = function() {
                        var e = new enchant.Event('progress');
                        e.loaded = ++loaded;
                        e.total = len;
                        core.loadingScene.dispatchEvent(e);
                    };
                this._assets
                    .reverse()
                    .forEach(function(asset) {
                        var src, name;
                        if (asset instanceof Array) {
                            src = asset[0];
                            name = asset[1];
                        } else {
                            src = name = asset;
                        }
                        if (!o[name]) {
                            o[name] = this.load(src, name, loadFunc);
                            len++;
                        }
                    }, this);
    
                this.pushScene(this.loadingScene);
                return enchant.Deferred.parallel(o);
            },
            _createTouchToStartScene: function() {
                var label = new enchant.Label('Touch to Start'),
                    size = Math.round(core.width / 10),
                    scene = new enchant.Scene();
    
                label.color = '#fff';
                label.font = (size - 1) + 'px bold Helvetica,Arial,sans-serif';
                label.textAlign = 'center';
                label.width = core.width;
                label.height = label._boundHeight;
                label.y = (core.height - label.height) / 2;
    
                scene.backgroundColor = '#000';
                scene.addChild(label);
    
                return scene;
            },
            /**
             [lang:ja]
             * アプリをデバッグモードで開始する.
             *
             * {@link enchant.Core#_debug} フラグを true にすることでもデバッグモードをオンにすることができる
             * @return {enchant.Deferred} ローディング画面終了後に起動するDeferredオブジェクト.
             [/lang]
             [lang:en]
             * Start application in debug mode.
             *
             * Core debug mode can be turned on even if the
             * {@link enchant.Core#_debug} flag is already set to true.
             * @return {enchant.Deferred}
             [/lang]
             [lang:de]
             * Startet den Debug-Modus des Spieles.
             *
             * Auch wenn die {@link enchant.Core#_debug} Variable gesetzt ist,
             * kann der Debug-Modus gestartet werden.
             * @return {enchant.Deferred}
             [/lang]
             */
            debug: function() {
                this._debug = true;
                return this.start();
            },
            actualFps: {
                get: function() {
                    return this._actualFps || this.fps;
                }
            },
            /**
             [lang:ja]
             * 次のフレームの実行を要求する.
             * @param {Number} delay requestAnimationFrameを呼び出すまでの遅延時間.
             [/lang]
             [lang:en]
             * Requests the next frame.
             * @param {Number} delay Amount of time to delay before calling requestAnimationFrame.
             [/lang]
             [lang:de]
             [/lang]
             * @private
             */
            _requestNextFrame: function(delay) {
                if (!this.ready) {
                    return;
                }
                if (this.fps >= 60 || delay <= 16) {
                    this._calledTime = window.getTime();
                    window.requestAnimationFrame(this._callTick);
                } else {
                    setTimeout(function() {
                        var core = enchant.Core.instance;
                        core._calledTime = window.getTime();
                        window.requestAnimationFrame(core._callTick);
                    }, Math.max(0, delay));
                }
            },
            /**
             [lang:ja]
             * Core#_tickを呼び出す.
             * @param {Number} time 呼び出し時の時間.
             [/lang]
             [lang:en]
             * Calls {@link enchant.Core#_tick}.
             * @param {Number} time
             [/lang]
             [lang:de]
             * @param {Number} time
             [/lang]
             * @private
             */
            _callTick: function(time) {
                enchant.Core.instance._tick(time);
            },
            _tick: function(time) {
                var e = new enchant.Event('enterframe');
                var now = window.getTime();
                var elapsed = e.elapsed = now - this.currentTime;
                this.currentTime = now;
    
                this._actualFps = elapsed > 0 ? (1000 / elapsed) : 0;
    
                var nodes = this.currentScene.childNodes.slice();
                var push = Array.prototype.push;
                while (nodes.length) {
                    var node = nodes.pop();
                    node.age++;
                    node.dispatchEvent(e);
                    if (node.childNodes) {
                        push.apply(nodes, node.childNodes);
                    }
                }
    
                this.currentScene.age++;
                this.currentScene.dispatchEvent(e);
                this.dispatchEvent(e);
    
                this.dispatchEvent(new enchant.Event('exitframe'));
                this.frame++;
                now = window.getTime();
                
                this._requestNextFrame(1000 / this.fps - (now - this._calledTime));
            },
            getTime: function() {
                return window.getTime();
            },
            /**
             [lang:ja]
             * アプリを停止する.
             *
             * フレームは更新されず, ユーザの入力も受け付けなくなる.
             * {@link enchant.Core#resume} で再開できる.
             [/lang]
             [lang:en]
             * Stops the core.
             *
             * The frame will not be updated, and player input will not be accepted anymore.
             * Core can be restarted using {@link enchant.Core#resume}.
             [/lang]
             [lang:de]
             * Stoppt das Spiel.
             *
             * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
             * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#resume} Methode
             * erneut gestartet werden.
             [/lang]
             */
            stop: function() {
                this.ready = false;
                this.running = false;
            },
            /**
             [lang:ja]
             * アプリを一時停止する.
             *
             * フレームは更新されず, ユーザの入力は受け付ける.
             * {@link enchant.Core#resume} で再開できる.
             [/lang]
             [lang:en]
             * Stops the core.
             *
             * The frame will not be updated, and player input will not be accepted anymore.
             * Core can be started again using {@link enchant.Core#resume}.
             [/lang]
             [lang:de]
             * Stoppt das Spiel.
             *
             * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
             * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#resume} Methode
             * erneut gestartet werden.
             [/lang]
             */
            pause: function() {
                this.ready = false;
            },
            /**
             [lang:ja]
             * アプリを再開する.
             [/lang]
             [lang:en]
             * Resumes core operations.
             [/lang]
             [lang:de]
             * Setzt die Ausführung des Spieles fort.
             [/lang]
             */
            resume: function() {
                if (this.ready) {
                    return;
                }
                this.currentTime = window.getTime();
                this.ready = true;
                this.running = true;
                this._requestNextFrame(0);
            },
    
            /**
             [lang:ja]
             * 新しいSceneに移行する.
             *
             * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
             * enchant.Core#pushSceneを行うとSceneをスタックの一番上に積むことができる. スタックの
             * 一番上のSceneに対してはフレームの更新が行われる.
             *
             * @param {enchant.Scene} scene 移行する新しいScene.
             * @return {enchant.Scene} 新しいScene.
             [/lang]
             [lang:en]
             * Switches to a new Scene.
             *
             * Scenes are controlled using a stack, with the top scene on
             * the stack being the one displayed.
             * When {@link enchant.Core#pushScene} is executed, the Scene is
             * placed top of the stack. Frames will be only updated for the
             * Scene which is on the top of the stack.
             *
             * @param {enchant.Scene} scene The new scene to display.
             * @return {enchant.Scene} The new Scene.
             [/lang]
             [lang:de]
             * Wechselt zu einer neuen Szene.
             *
             * Szenen werden durch einen Stapelspeicher kontrolliert und die Darstellungsreihenfolge
             * folgt ebenfalls der Ordnung des Stapelspeichers.
             * Wenn die {@link enchant.Core#pushScene} Methode ausgeführt wird, wird die Szene auf dem
             * Stapelspeicher oben abgelegt. Der Frame wird immer in der Szene ganz oben auf dem Stapelspeicher
             * aktualisiert.
             *
             * @param {enchant.Scene} scene Die neue Szene zu der gewechselt werden soll.
             * @return {enchant.Scene} Die neue Szene.
             [/lang]
             */
            pushScene: function(scene) {
                this._element.appendChild(scene._element);
                if (this.currentScene) {
                    this.currentScene.dispatchEvent(new enchant.Event('exit'));
                }
                this.currentScene = scene;
                this.currentScene.dispatchEvent(new enchant.Event('enter'));
                return this._scenes.push(scene);
            },
            /**
             [lang:ja]
             * 現在のSceneを終了させ前のSceneに戻る.
             *
             * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
             * enchant.Core#popSceneを行うとスタックの一番上のSceneを取り出すことができる.
             *
             * @return {enchant.Scene} 終了させたScene.
             [/lang]
             [lang:en]
             * Ends the current Scene and returns to the previous Scene.
             *
             * Scenes are controlled using a stack, with the top scene on
             * the stack being the one displayed.
             * When {@link enchant.Core#popScene} is executed, the Scene at
             * the top of the stack is removed and returned.
             *
             * @return {enchant.Scene} Removed Scene.
             [/lang]
             [lang:de]
             * Beendet die aktuelle Szene und wechselt zu der vorherigen Szene.
             *
             * Szenen werden durch einen Stapelspeicher kontrolliert und die Darstellungsreihenfolge
             * folgt ebenfalls der Ordnung des Stapelspeichers.
             * Wenn die {@link enchant.Core#popScene} Methode ausgeführt wird, wird die Szene oben auf dem
             * Stapelspeicher entfernt und liefert diese als Rückgabewert.
             *
             * @return {enchant.Scene} Die Szene, die beendet wurde.
             [/lang]
             */
            popScene: function() {
                if (this.currentScene === this.rootScene) {
                    return this.currentScene;
                }
                this._element.removeChild(this.currentScene._element);
                this.currentScene.dispatchEvent(new enchant.Event('exit'));
                this.currentScene = this._scenes[this._scenes.length - 2];
                this.currentScene.dispatchEvent(new enchant.Event('enter'));
                return this._scenes.pop();
            },
            /**
             [lang:ja]
             * 現在のSceneを別のSceneにおきかえる.
             *
             * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene}を同時に行う.
             *
             * @param {enchant.Scene} scene おきかえるScene.
             * @return {enchant.Scene} 新しいScene.
             [/lang]
             [lang:en]
             * Overwrites the current Scene with a new Scene.
             *
             * Executes {@link enchant.Core#popScene} and {@link enchant.Core#pushScene}
             * one after another to replace the current scene with the new scene.
             *
             * @param {enchant.Scene} scene The new scene with which to replace the current scene.
             * @return {enchant.Scene} The new Scene.
             [/lang]
             [lang:de]
             * Ersetzt die aktuelle Szene durch eine neue Szene.
             *
             * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene} werden nacheinander
             * ausgeführt um die aktuelle Szene durch die neue zu ersetzen.
             *
             * @param {enchant.Scene} scene Die neue Szene, welche die aktuelle Szene ersetzen wird.
             * @return {enchant.Scene} Die neue Szene.
             [/lang]
             */
            replaceScene: function(scene) {
                this.popScene();
                return this.pushScene(scene);
            },
            /**
             [lang:ja]
             * Sceneを削除する.
             *
             * Sceneスタック中からSceneを削除する.
             *
             * @param {enchant.Scene} scene 削除するScene.
             * @return {enchant.Scene} 削除したScene.
             [/lang]
             [lang:en]
             * Removes a Scene from the Scene stack.
             *
             * If the scene passed in as a parameter is not the current
             * scene, the stack will be searched for the given scene.
             * If the given scene does not exist anywhere in the stack,
             * this method returns null.
             *
             * @param {enchant.Scene} scene Scene to be removed.
             * @return {enchant.Scene} The deleted Scene.
             [/lang]
             [lang:de]
             * Entfernt eine Szene.
             *
             * Entfernt eine Szene aus dem Szenen-Stapelspeicher.
             *
             * @param {enchant.Scene} scene Die Szene die entfernt werden soll.
             * @return {enchant.Scene} Die entfernte Szene.
             [/lang]
             */
            removeScene: function(scene) {
                if (this.currentScene === scene) {
                    return this.popScene();
                } else {
                    var i = this._scenes.indexOf(scene);
                    if (i !== -1) {
                        this._scenes.splice(i, 1);
                        this._element.removeChild(scene._element);
                        return scene;
                    } else {
                        return null;
                    }
                }
            },
            _buttonListener: function(e) {
                this.currentScene.dispatchEvent(e);
            },
            /**
             [lang:ja]
             * キーバインドを設定する.
             *
             * @param {Number} key キーバインドを設定するキーコード.
             * @param {String} button 割り当てるボタン.
             [/lang]
             [lang:en]
             * Bind a key code to an enchant.js button.
             *
             * Binds the given key code to the given enchant.js button
             * ('left', 'right', 'up', 'down', 'a', 'b').
             *
             * @param {Number} key Key code for the button to be bound.
             * @param {String} button An enchant.js button.
             [/lang]
             [lang:de]
             * Bindet eine Taste.
             *
             * @param {Number} key Der Tastencode der Taste die gebunden werden soll.
             * @param {String} button Der enchant.js Knopf (left, right, up, down, a, b).
             [/lang]
             * @return {enchant.Core} this
             */
            keybind: function(key, button) {
                this.keyboardInputManager.keybind(key, button);
                this.addEventListener(button + 'buttondown', this._buttonListener);
                this.addEventListener(button + 'buttonup', this._buttonListener);
                return this;
            },
            /**
             [lang:ja]
             * キーバインドを削除する.
             * @param {Number} key 削除するキーコード.
             [/lang]
             [lang:en]
             * Delete the key binding for the given key.
             *
             * @param {Number} key Key code whose binding is to be deleted.
             [/lang]
             [lang:de]
             * Entbindet eine Taste.
             *
             * @param {Number} key Der Tastencode der entfernt werden soll.
             [/lang]
             * @return {enchant.Core} this
             */
            keyunbind: function(key) {
                var button = this._keybind[key];
                this.keyboardInputManager.keyunbind(key);
                this.removeEventListener(button + 'buttondown', this._buttonListener);
                this.removeEventListener(button + 'buttonup', this._buttonListener);
                return this;
            },
            changeButtonState: function(button, bool) {
                this.keyboardInputManager.changeState(button, bool);
            },
            /**
             [lang:ja]
             * Core#startが呼ばれてから経過した時間を取得する.
             * @return {Number} 経過した時間 (秒)
             [/lang]
             [lang:en]
             * Get the core time (not actual) elapsed since {@link enchant.Core#start} was called.
             * @return {Number} Time elapsed (in seconds).
             [/lang]
             [lang:de]
             * Liefert die vergange Spielzeit (keine reale) die seit dem Aufruf von {@link enchant.Core#start}
             * vergangen ist.
             * @return {Number} Die vergangene Zeit (Sekunden)
             [/lang]
             */
            getElapsedTime: function() {
                return this.frame / this.fps;
            }
        });
    
        /**
         [lang:ja]
         * 拡張子に対応したアセットのロード関数.
         * ロード関数はファイルのパス, 拡張子, コールバックを引数に取り,
         * 対応したクラスのインスタンスを返す必要がある.
         * コールバックはEvent.LOADとEvent.ERRORでハンドルする.
         [/lang]
         [lang:en]
         * Functions for loading assets of the corresponding file type.
         * The loading functions must take the file path, extension and
         * callback function as arguments, then return the appropriate
         * class instance.
         [/lang]
         [lang:de]
         [/lang]
         * @static
         * @private
         * @type Object
         */
        enchant.Core._loadFuncs = {};
        enchant.Core._loadFuncs['jpg'] =
            enchant.Core._loadFuncs['jpeg'] =
                enchant.Core._loadFuncs['gif'] =
                    enchant.Core._loadFuncs['png'] =
                        enchant.Core._loadFuncs['bmp'] = function(src, ext, callback, onerror) {
                            return enchant.Surface.load(src, callback, onerror);
                        };
        enchant.Core._loadFuncs['mp3'] =
            enchant.Core._loadFuncs['aac'] =
                enchant.Core._loadFuncs['m4a'] =
                    enchant.Core._loadFuncs['wav'] =
                        enchant.Core._loadFuncs['ogg'] = function(src, ext, callback, onerror) {
                            return enchant.Sound.load(src, 'audio/' + ext, callback, onerror);
                        };
    
        /**
         [lang:ja]
         * ファイルパスを取り, 拡張子を返す.
         * @param {String} path ファイルパス.
         [/lang]
         [lang:en]
         * Get the file extension from a path.
         * @param {String} path file path.
         [/lang]
         [lang:de]
         * @param {String} path
         [/lang]
         * @return {*}
         */
        enchant.Core.findExt = function(path) {
            var matched = path.match(/\.\w+$/);
            if (matched && matched.length > 0) {
                return matched[0].slice(1).toLowerCase();
            }
    
            // for data URI
            if (path.indexOf('data:') === 0) {
                return path.split(/[\/;]/)[1].toLowerCase();
            }
            return null;
        };
    
        /**
         [lang:ja]
         * 現在のCoreインスタンス.
         [/lang]
         [lang:en]
         * The current Core instance.
         [/lang]
         [lang:de]
         * Die aktuelle Instanz des Spieles.
         [/lang]
         * @type enchant.Core
         * @static
         */
        enchant.Core.instance = null;
    }());
    
    /**
     * @name enchant.Game
     * @class
     * enchant.Game is moved to {@link enchant.Core} from v0.6
     * @deprecated
     */
    enchant.Game = enchant.Core;
    
    /**
     * @scope enchant.InputManager.prototype
     */
    enchant.InputManager = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.InputManager
         * @class
         [lang:ja]
         * 入力を管理するためのクラス.
         * @param {*} valueStore 入力の状態を保持させるオブジェクト.
         * @param {*} [source=this] イベントに付加される入力のソース.
         [/lang]
         [lang:en]
         * Class for managing input.
         * @param {*} valueStore object that store input state.
         * @param {*} [source=this] source that will be added to event object.
         [/lang]
         [lang:de]
         * @param {*} valueStore
         * @param {*} [source=this]
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(valueStore, source) {
            enchant.EventTarget.call(this);
    
            /**
             [lang:ja]
             * 入力の変化を通知する対象を保持する配列.
             [/lang]
             [lang:en]
             * Array that store event target.
             [/lang]
             * @type enchant.EventTarget[]
             */
            this.broadcastTarget = [];
            /**
             [lang:ja]
             * 入力の状態を保持する連想配列.
             [/lang]
             [lang:en]
             * Object that store input state.
             [/lang]
             * @type Object
             */
            this.valueStore = valueStore;
            /**
             [lang:ja]
             * イベントに付加される入力のソース.
             [/lang]
             [lang:en]
             * source that will be added to event object.
             [/lang]
             * @type Object
             */
            this.source = source || this;
    
            this._binds = {};
    
            this._stateHandler = function(e) {
                var id = e.source.identifier;
                var name = this._binds[id];
                this.changeState(name, e.data);
            }.bind(this);
        },
        /**
         [lang:ja]
         * 特定の入力に名前をつける.
         * 入力はフラグとイベントで監視できるようになる.
         * @param {enchant.InputSource} inputSource {@link enchant.InputSource} のインスタンス.
         * @param {String} name 入力につける名前.
         [/lang]
         [lang:en]
         * Name specified input.
         * Input can be watched by flag or event.
         * @param {enchant.InputSource} inputSource input source.
         * @param {String} name input name.
         [/lang]
         [lang:de]
         * @param {enchant.InputSource} inputSource
         * @param {String} name
         [/lang]
         */
        bind: function(inputSource, name) {
            inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
            this._binds[inputSource.identifier] = name;
        },
        /**
         [lang:ja]
         * 入力のバインドを解除する.
         * @param {enchant.InputSource} inputSource {@link enchant.InputSource} のインスタンス.
         [/lang]
         [lang:en]
         * Remove binded name.
         * @param {enchant.InputSource} inputSource input source.
         [/lang]
         [lang:de]
         * @param {enchant.InputSource} inputSource
         [/lang]
         */
        unbind: function(inputSource) {
            inputSource.removeEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
            delete this._binds[inputSource.identifier];
        },
        /**
         [lang:ja]
         * 入力の変化を通知する対象を追加する.
         * @param {enchant.EventTarget} eventTarget イベントの通知を設定したい対象.
         [/lang]
         [lang:en]
         * Add event target.
         * @param {enchant.EventTarget} eventTarget broadcast target.
         [/lang]
         [lang:de]
         * @param {enchant.EventTarget} eventTarget
         [/lang]
         */
        addBroadcastTarget: function(eventTarget) {
            var i = this.broadcastTarget.indexOf(eventTarget);
            if (i === -1) {
                this.broadcastTarget.push(eventTarget);
            }
        },
        /**
         [lang:ja]
         * 入力の変化を通知する対象を削除する.
         * @param {enchant.EventTarget} eventTarget イベントの通知を削除したい対象.
         [/lang]
         [lang:en]
         * Remove event target.
         * @param {enchant.EventTarget} eventTarget broadcast target.
         [/lang]
         [lang:de]
         * @param {enchant.EventTarget} eventTarget
         [/lang]
         */
        removeBroadcastTarget: function(eventTarget) {
            var i = this.broadcastTarget.indexOf(eventTarget);
            if (i !== -1) {
                this.broadcastTarget.splice(i, 1);
            }
        },
        /**
         [lang:ja]
         * イベントを {@link enchant.InputManager#broadcastTarget} に発行する.
         * @param {enchant.Event} e イベント.
         [/lang]
         [lang:en]
         * Dispatch event to {@link enchant.InputManager#broadcastTarget}.
         * @param {enchant.Event} e event.
         [/lang]
         [lang:de]
         * @param {enchant.Event} e
         [/lang]
         */
        broadcastEvent: function(e) {
            var target = this.broadcastTarget;
            for (var i = 0, l = target.length; i < l; i++) {
                target[i].dispatchEvent(e);
            }
        },
        /**
         [lang:ja]
         * 入力の状態を変更する.
         * @param {String} name 入力の名前.
         * @param {*} data 入力の状態.
         [/lang]
         [lang:en]
         * Change state of input.
         * @param {String} name input name.
         * @param {*} data input state.
         [/lang]
         [lang:de]
         * @param {String} name
         * @param {*} data
         [/lang]
         */
        changeState: function(name, data) {
        }
    });
    
    /**
     * @scope enchant.InputSource.prototype
     */
    enchant.InputSource = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.InputSource
         * @class
         [lang:ja]
         * 任意の入力をラップするクラス.
         * @param {String} identifier 入力のid.
         [/lang]
         [lang:en]
         * Class that wrap input.
         * @param {String} identifier identifier of InputSource.
         [/lang]
         [lang:de]
         * @param {String} identifier
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(identifier) {
            enchant.EventTarget.call(this);
            /**
             [lang:ja]
             * 入力のid.
             [/lang]
             [lang:en]
             * identifier of InputSource.
             [/lang]
             [lang:de]
             [/lang]
             * @type String
             */
            this.identifier = identifier;
        },
        /**
         [lang:ja]
         * 入力の状態変更をイベントで通知する.
         * @param {*} data 新しい状態.
         [/lang]
         [lang:en]
         * Notify state change by event.
         * @param {*} data state.
         [/lang]
         [lang:de]
         * @param {*} data
         [/lang]
         */
        notifyStateChange: function(data) {
            var e = new enchant.Event(enchant.Event.INPUT_STATE_CHANGED);
            e.data = data;
            e.source = this;
            this.dispatchEvent(e);
        }
    });
    
    /**
     * @scope enchant.BinaryInputManager.prototype
     */
    enchant.BinaryInputManager = enchant.Class.create(enchant.InputManager, {
        /**
         * @name enchant.BinaryInputManager
         * @class
         [lang:ja]
         * 入力を管理するためのクラス.
         * @param {*} flagStore 入力のフラグを保持させるオブジェクト.
         * @param {String} activeEventNameSuffix イベント名の接尾辞.
         * @param {String} inactiveEventNameSuffix イベント名の接尾辞.
         * @param {*} [source=this] イベントに付加される入力のソース.
         [/lang]
         [lang:en]
         * Class for managing input.
         * @param {*} flagStore object that store input flag.
         * @param {String} activeEventNameSuffix event name suffix.
         * @param {String} inactiveEventNameSuffix event name suffix.
         * @param {*} [source=this] source that will be added to event object.
         [/lang]
         [lang:de]
         * @param {*} flagStore
         * @param {String} activeEventNameSuffix
         * @param {String} inactiveEventNameSuffix
         * @param {*} [source=this] source
         [/lang]
         * @constructs
         * @extends enchant.InputManager
         */
        initialize: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
            enchant.InputManager.call(this, flagStore, source);
            /**
             [lang:ja]
             * アクティブな入力の数.
             [/lang]
             [lang:en]
             * The number of active inputs.
             [/lang]
             [lang:de]
             [/lang]
             * @type Number
             */
            this.activeInputsNum = 0;
            /**
             [lang:ja]
             * BinaryInputManagerが発行するイベント名の接尾辞.
             [/lang]
             [lang:en]
             * event name suffix that dispatched by BinaryInputManager.
             [/lang]
             [lang:de]
             [/lang]
             * @type String
             */
            this.activeEventNameSuffix = activeEventNameSuffix;
            /**
             [lang:ja]
             * BinaryInputManagerが発行するイベント名の接尾辞.
             [/lang]
             [lang:en]
             * event name suffix that dispatched by BinaryInputManager.
             [/lang]
             [lang:de]
             [/lang]
             * @type String
             */
            this.inactiveEventNameSuffix = inactiveEventNameSuffix;
        },
        /**
         [lang:ja]
         * 特定の入力に名前をつける.
         * @param {enchant.BinaryInputSource} inputSource {@link enchant.InputSource}のインスタンス.
         * @param {String} name 入力につける名前.
         [/lang]
         [lang:en]
         * Name specified input.
         * @param {enchant.BinaryInputSource} inputSource input source.
         * @param {String} name input name.
         [/lang]
         [lang:de]
         * @param {enchant.BinaryInputSource} inputSource
         * @param {String} name
         [/lang]
         * @see enchant.InputManager#bind
         */
        bind: function(binaryInputSource, name) {
            enchant.InputManager.prototype.bind.call(this, binaryInputSource, name);
            this.valueStore[name] = false;
        },
        /**
         [lang:ja]
         * 入力のバインドを解除する.
         * @param {enchant.BinaryInputSource} inputSource {@link enchant.InputSource}のインスタンス.
         [/lang]
         [lang:en]
         * Remove binded name.
         * @param {enchant.BinaryInputSource} inputSource input source.
         [/lang]
         [lang:de]
         * @param {enchant.BinaryInputSource} inputSource
         [/lang]
         * @see enchant.InputManager#unbind
         */
        unbind: function(binaryInputSource) {
            var name = this._binds[binaryInputSource.identifier];
            enchant.InputManager.prototype.unbind.call(this, binaryInputSource);
            delete this.valueStore[name];
        },
        /**
         [lang:ja]
         * 入力の状態を変更する.
         * @param {String} name 入力の名前.
         * @param {Boolean} bool 入力の状態.
         [/lang]
         [lang:en]
         * Change state of input.
         * @param {String} name input name.
         * @param {Boolean} bool input state.
         [/lang]
         [lang:de]
         * @param {String} name
         * @param {Boolean} bool
         [/lang]
         */
        changeState: function(name, bool) {
            if (bool) {
                this._down(name);
            } else {
                this._up(name);
            }
        },
        _down: function(name) {
            var inputEvent;
            if (!this.valueStore[name]) {
                this.valueStore[name] = true;
                inputEvent = new enchant.Event((this.activeInputsNum++) ? 'inputchange' : 'inputstart');
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }
            var downEvent = new enchant.Event(name + this.activeEventNameSuffix);
            downEvent.source = this.source;
            this.broadcastEvent(downEvent);
        },
        _up: function(name) {
            var inputEvent;
            if (this.valueStore[name]) {
                this.valueStore[name] = false;
                inputEvent = new enchant.Event((--this.activeInputsNum) ? 'inputchange' : 'inputend');
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }
            var upEvent = new enchant.Event(name + this.inactiveEventNameSuffix);
            upEvent.source = this.source;
            this.broadcastEvent(upEvent);
        }
    });
    
    /**
     * @scope enchant.BinaryInputSource.prototype
     */
    enchant.BinaryInputSource = enchant.Class.create(enchant.InputSource, {
        /**
         * @name enchant.BinaryInputSource
         * @class
         [lang:ja]
         * 任意の2値入力をラップするクラス.
         * @param {String} identifier 入力のid.
         [/lang]
         [lang:en]
         * Class that wrap binary input.
         * @param {String} identifier identifier of BinaryInputSource.
         [/lang]
         [lang:de]
         * @param {String} identifier
         [/lang]
         * @constructs
         * @extends enchant.InputSource
         */
        initialize: function(identifier) {
            enchant.InputSource.call(this, identifier);
        }
    });
    
    /**
     * @scope enchant.KeyboardInputManager.prototype
     */
    enchant.KeyboardInputManager = enchant.Class.create(enchant.BinaryInputManager, {
        /**
         * @name enchant.KeyboardInputManager
         * @class
         [lang:ja]
         * キーボード入力を管理するためのクラス.
         * @param {HTMLElement} dom element that will be watched.
         * @param {*} flagStore object that store input flag.
         [/lang]
         [lang:en]
         * Class that manage keyboard input.
         * @param {HTMLElement} dom element that will be watched.
         * @param {*} flagStore object that store input flag.
         [/lang]
         [lang:de]
         * @param {HTMLElement} dom
         * @param {*} flagStore
         [/lang]
         * @constructs
         * @extends enchant.BinaryInputManager
         */
        initialize: function(domElement, flagStore) {
            enchant.BinaryInputManager.call(this, flagStore, 'buttondown', 'buttonup');
            this._attachDOMEvent(domElement, 'keydown', true);
            this._attachDOMEvent(domElement, 'keyup', false);
        },
        /**
         [lang:ja]
         * キーコードに対応したBinaryInputSourceを使って{@link enchant.BinaryInputManager#bind} を呼び出す.
         * @param {Number} keyCode キーコード.
         * @param {String} name 入力の名前.
         [/lang]
         [lang:en]
         * Call {@link enchant.BinaryInputManager#bind} with BinaryInputSource equivalent of key code.
         * @param {Number} keyCode key code.
         * @param {String} name input name.
         [/lang]
         [lang:de]
         * @param {Number} keyCode
         * @param {String} name
         [/lang]
         */
        keybind: function(keyCode, name) {
            this.bind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode), name);
        },
        /**
         [lang:ja]
         * キーコードに対応したBinaryInputSourceを使って{@link enchant.BinaryInputManager#unbind} を呼び出す.
         * @param {Number} keyCode キーコード.
         [/lang]
         [lang:en]
         * Call {@link enchant.BinaryInputManager#unbind} with BinaryInputSource equivalent of key code.
         * @param {Number} keyCode key code.
         [/lang]
         [lang:de]
         * @param {Number} keyCode
         [/lang]
         */
        keyunbind: function(keyCode) {
            this.unbind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode));
        },
        _attachDOMEvent: function(domElement, eventType, state) {
            domElement.addEventListener(eventType, function(e) {
                var core = enchant.Core.instance;
                if (!core || !core.running) {
                    return;
                }
                var code = e.keyCode;
                var source = enchant.KeyboardInputSource._instances[code];
                if (source) {
                    source.notifyStateChange(state);
                }
            }, true);
        }
    });
    
    /**
     * @scope enchant.KeyboardInputSource.prototype
     */
    enchant.KeyboardInputSource = enchant.Class.create(enchant.BinaryInputSource, {
        /**
         * @name enchant.KeyboardInputSource
         * @class
         [lang:ja]
         * キーボード入力をラップするBinaryInputSource.
         * キーコードをidとして持つ.
         * @param {String} keyCode キーコード.
         [/lang]
         [lang:en]
         * @param {String} keyCode key code of BinaryInputSource.
         [/lang]
         [lang:de]
         * @param {String} keyCode
         [/lang]
         * @constructs
         * @extends enchant.BinaryInputSource
         */
        initialize: function(keyCode) {
            enchant.BinaryInputSource.call(this, keyCode);
        }
    });
    /**
     * @private
     */
    enchant.KeyboardInputSource._instances = {};
    /**
     * @static
     [lang:ja]
     * キーコードに対応したインスタンスを取得する.
     * @param {Number} keyCode キーコード.
     [/lang]
     [lang:en]
     * Get the instance by key code.
     * @param {Number} keyCode key code.
     [/lang]
     [lang:de]
     * @param {Number} keyCode
     [/lang]
     * @return {enchant.KeyboardInputSource} instance.
     */
    enchant.KeyboardInputSource.getByKeyCode = function(keyCode) {
        if (!this._instances[keyCode]) {
            this._instances[keyCode] = new enchant.KeyboardInputSource(keyCode);
        }
        return this._instances[keyCode];
    };
    
    /**
     * @scope enchant.Node.prototype
     */
    enchant.Node = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Node
         * @class
         [lang:ja]
         * Sceneをルートとした表示オブジェクトツリーに属するオブジェクトの基底クラス.
         * 直接使用することはない.
         [/lang]
         [lang:en]
         * Base class for objects in the display tree which is rooted at a Scene.
         * Not to be used directly.
         [/lang]
         [lang:de]
         * Basisklasse für Objekte die im Darstellungsbaum, 
         * dessen Wurzel eine Szene ist, enthalten sind.
         * Sollte nicht direkt verwendet werden.
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function() {
            enchant.EventTarget.call(this);
    
            this._dirty = false;
    
            this._matrix = [ 1, 0, 0, 1, 0, 0 ];
    
            this._x = 0;
            this._y = 0;
            this._offsetX = 0;
            this._offsetY = 0;
    
            /**
             [lang:ja]
             * Nodeが画面に表示されてから経過したフレーム数.
             * {@link enchant.Event.ENTER_FRAME} イベントを受け取る前にインクリメントされる.
             * (ENTER_FRAME イベントのリスナが初めて実行される時に 1 となる.)
             [/lang]
             [lang:en]
             * The age (frames) of this node which will be increased before this node receives {@link enchant.Event.ENTER_FRAME} event.
             [/lang]
             [lang:de]
             * Das Alter (Frames) dieses Nodes welches vor dem {@link enchant.Event.ENTER_FRAME} Ereignis erhöht wird.
             [/lang]
             * @type Number
             */
            this.age = 0;
    
            /**
             [lang:ja]
             * Nodeの親Node.
             [/lang]
             [lang:en]
             * Parent Node of this Node.
             [/lang]
             [lang:de]
             * Der Eltern-Node dieses Node.
             [/lang]
             * @type enchant.Group
             */
            this.parentNode = null;
            /**
             [lang:ja]
             * Nodeが属しているScene.
             [/lang]
             [lang:en]
             * Scene to which Node belongs.
             [/lang]
             [lang:de]
             * Die Szene, zu welcher dieser Node gehört.
             [/lang]
             * @type enchant.Scene
             */
            this.scene = null;
    
            this.addEventListener('touchstart', function(e) {
                if (this.parentNode) {
                    this.parentNode.dispatchEvent(e);
                }
            });
            this.addEventListener('touchmove', function(e) {
                if (this.parentNode) {
                    this.parentNode.dispatchEvent(e);
                }
            });
            this.addEventListener('touchend', function(e) {
                if (this.parentNode) {
                    this.parentNode.dispatchEvent(e);
                }
            });
    
            // Nodeが生成される際に, tl プロパティに Timeline オブジェクトを追加している.
            if (enchant.ENV.USE_ANIMATION) {
                this.tl = new enchant.Timeline(this);
            }
        },
        /**
         [lang:ja]
         * Nodeを移動する.
         * @param {Number} x 移動先のx座標.
         * @param {Number} y 移動先のy座標.
         [/lang]
         [lang:en]
         * Move the Node to the given target location.
         * @param {Number} x Target x coordinates.
         * @param {Number} y Target y coordinates.
         [/lang]
         [lang:de]
         * Bewegt diesen Node zu den gegebenen Ziel Koordinaten.
         * @param {Number} x Ziel x Koordinaten.
         * @param {Number} y Ziel y Koordinaten.
         [/lang]
         */
        moveTo: function(x, y) {
            this.x = x;
            this.y = y;
        },
        /**
         [lang:ja]
         * Nodeを移動する.
         * @param {Number} x 移動するx軸方向の距離.
         * @param {Number} y 移動するy軸方向の距離.
         [/lang]
         [lang:en]
         * Move the Node relative to its current position.
         * @param {Number} x x axis movement distance.
         * @param {Number} y y axis movement distance.
         [/lang]
         [lang:de]
         * Bewegt diesen Node relativ zur aktuellen Position.
         * @param {Number} x Distanz auf der x Achse.
         * @param {Number} y Distanz auf der y Achse.
         [/lang]
         */
        moveBy: function(x, y) {
            this.x += x;
            this.y += y;
        },
        /**
         [lang:ja]
         * Nodeのx座標.
         [/lang]
         [lang:en]
         * x coordinates of the Node.
         [/lang]
         [lang:de]
         * Die x Koordinaten des Nodes.
         [/lang]
         * @type Number
         */
        x: {
            get: function() {
                return this._x;
            },
            set: function(x) {
                if(this._x !== x) {
                    this._x = x;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * Nodeのy座標.
         [/lang]
         [lang:en]
         * y coordinates of the Node.
         [/lang]
         [lang:de]
         * Die y Koordinaten des Nodes.
         [/lang]
         * @type Number
         */
        y: {
            get: function() {
                return this._y;
            },
            set: function(y) {
                if(this._y !== y) {
                    this._y = y;
                    this._dirty = true;
                }
            }
        },
        _updateCoordinate: function() {
            var node = this;
            var tree = [ node ];
            var parent = node.parentNode;
            var scene = this.scene;
            while (parent && node._dirty) {
                tree.unshift(parent);
                node = node.parentNode;
                parent = node.parentNode;
            }
            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;
            var mat = [];
            var newmat, ox, oy;
            stack.push(tree[0]._matrix);
            for (var i = 1, l = tree.length; i < l; i++) {
                node = tree[i];
                newmat = [];
                matrix.makeTransformMatrix(node, mat);
                matrix.multiply(stack[stack.length - 1], mat, newmat);
                node._matrix = newmat;
                stack.push(newmat);
                ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
                oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
                var vec = [ ox, oy ];
                matrix.multiplyVec(newmat, vec, vec);
                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;
                node._dirty = false;
            }
            matrix.reset();
        },
        remove: function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
            if (this.childNodes) {
                var childNodes = this.childNodes.slice();
                for(var i = childNodes.length-1; i >= 0; i--) {
                    childNodes[i].remove();
                }
            }
            
            this.clearEventListener();
        }
    });
    
    var _intersectBetweenClassAndInstance = function(Class, instance) {
        var ret = [];
        var c;
        for (var i = 0, l = Class.collection.length; i < l; i++) {
            c = Class.collection[i];
            if (instance._intersectOne(c)) {
                ret.push(c);
            }
        }
        return ret;
    };
    
    var _intersectBetweenClassAndClass = function(Class1, Class2) {
        var ret = [];
        var c1, c2;
        for (var i = 0, l = Class1.collection.length; i < l; i++) {
            c1 = Class1.collection[i];
            for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
                c2 = Class2.collection[j];
                if (c1._intersectOne(c2)) {
                    ret.push([ c1, c2 ]);
                }
            }
        }
        return ret;
    };
    
    var _intersectStrictBetweenClassAndInstance = function(Class, instance) {
        var ret = [];
        var c;
        for (var i = 0, l = Class.collection.length; i < l; i++) {
            c = Class.collection[i];
            if (instance._intersectStrictOne(c)) {
                ret.push(c);
            }
        }
        return ret;
    };
    
    var _intersectStrictBetweenClassAndClass = function(Class1, Class2) {
        var ret = [];
        var c1, c2;
        for (var i = 0, l = Class1.collection.length; i < l; i++) {
            c1 = Class1.collection[i];
            for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
                c2 = Class2.collection[j];
                if (c1._intersectStrictOne(c2)) {
                    ret.push([ c1, c2 ]);
                }
            }
        }
        return ret;
    };
    
    var _staticIntersect = function(other) {
        if (other instanceof enchant.Entity) {
            return _intersectBetweenClassAndInstance(this, other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectBetweenClassAndClass(this, other);
        }
        return false;
    };
    
    var _staticIntersectStrict = function(other) {
        if (other instanceof enchant.Entity) {
            return _intersectStrictBetweenClassAndInstance(this, other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectStrictBetweenClassAndClass(this, other);
        }
        return false;
    };
    
    var _nodePrototypeClearEventListener = enchant.Node.prototype.clearEventListener;
    
    /**
     * @scope enchant.Entity.prototype
     */
    enchant.Entity = enchant.Class.create(enchant.Node, {
        /**
         * @name enchant.Entity
         * @class
         [lang:ja]
         * DOM上で表示する実体を持ったクラス. 直接使用することはない.
         [/lang]
         [lang:en]
         * A class with objects displayed as DOM elements. Not to be used directly.
         [/lang]
         [lang:de]
         * Eine Klasse die Objekte mit Hilfe von DOM Elementen darstellt.
         * Sollte nicht direkt verwendet werden.
         [/lang]
         * @constructs
         * @extends enchant.Node
         */
        initialize: function() {
            var core = enchant.Core.instance;
            enchant.Node.call(this);
    
            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;
    
            this._touchEnabled = true;
            this._clipping = false;
    
            this._originX = null;
            this._originY = null;
    
            this._width = 0;
            this._height = 0;
            this._backgroundColor = null;
            this._debugColor = '#0000ff';
            this._opacity = 1;
            this._visible = true;
            this._buttonMode = null;
    
            this._style = {};
            this.__styleStatus = {};
    
            this._isContainedInCollection = false;
    
            /**
             [lang:ja]
             * Entityを描画する際の合成処理を設定する.
             * Canvas上に描画する際のみ有効.
             * CanvasのコンテキストのglobalCompositeOperationにセットされる.
             [/lang]
             [lang:en]
             [/lang]
             [lang:de]
             [/lang]
             * @type String
             */
            this.compositeOperation = null;
    
            /**
             [lang:ja]
             * Entityにボタンの機能を設定する.
             * Entityに対するタッチ, クリックをleft, right, up, down, a, bいずれかの
             * ボタン入力として割り当てる.
             [/lang]
             [lang:en]
             * Defines this Entity as a button.
             * When touched or clicked the corresponding button event is dispatched.
             * Valid buttonModes are: left, right, up, down, a, b. 
             [/lang]
             [lang:de]
             * Definiert diese Entity als Schaltfläche (Button).
             * Bei einem Klick oder Touch wird das entsprechende
             * Button Ereignis (Event) ausgelöst.
             * Mögliche buttonModes sind: left, right, up, down, a, b. 
             [/lang]
             * @type String
             */
            this.buttonMode = null;
            /**
             [lang:ja]
             * Entityが押されているかどうか.
             * {@link enchant.Entity.buttonMode} が設定されているときだけ機能する.
             [/lang]
             [lang:en]
             * Indicates if this Entity is being clicked.
             * Only works when {@link enchant.Entity.buttonMode} is set.
             [/lang]
             [lang:de]
             * Zeigt an, ob auf die Entity geklickt wurde.
             * Funktioniert nur wenn {@link enchant.Entity.buttonMode} gesetzt ist.
             [/lang]
             * @type Boolean
             */
            this.buttonPressed = false;
            this.addEventListener('touchstart', function() {
                if (!this.buttonMode) {
                    return;
                }
                this.buttonPressed = true;
                this.dispatchEvent(new enchant.Event(this.buttonMode + 'buttondown'));
                core.changeButtonState(this.buttonMode, true);
            });
            this.addEventListener('touchend', function() {
                if (!this.buttonMode) {
                    return;
                }
                this.buttonPressed = false;
                this.dispatchEvent(new enchant.Event(this.buttonMode + 'buttonup'));
                core.changeButtonState(this.buttonMode, false);
            });
    
            this.enableCollection();
        },
        /**
         [lang:ja]
         * Entityの横幅.
         [/lang]
         [lang:en]
         * The width of the Entity.
         [/lang]
         [lang:de]
         * Die Breite der Entity.
         [/lang]
         * @type Number
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                if(this._width !== width) {
                    this._width = width;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * Entityの高さ.
         [/lang]
         [lang:en]
         * The height of the Entity.
         [/lang]
         [lang:de]
         * Die Höhe der Entity.
         [/lang]
         * @type Number
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                if(this._height !== height) {
                    this._height = height;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * Entityの背景色.
         * CSSの'color'プロパティと同様の形式で指定できる.
         [/lang]
         [lang:en]
         * The Entity background color.
         * Must be provided in the same format as the CSS 'color' property.
         [/lang]
         [lang:de]
         * Die Hintergrundfarbe der Entity.
         * Muss im gleichen Format definiert werden wie das CSS 'color' Attribut.
         [/lang]
         * @type String
         */
        backgroundColor: {
            get: function() {
                return this._backgroundColor;
            },
            set: function(color) {
                this._backgroundColor = color;
            }
        },
        /**
         [lang:ja]
         * Entityのデバッグの枠色.
         * CSSの'color'プロパティと同様の形式で指定できる.
         [/lang]
         [lang:en]
         * The Entity debug color.
         * Must be provided in the same format as the CSS 'color' property.
         [/lang]
         [lang:de]
         * Die debug-farbe der Entity.
         * Muss im gleichen Format definiert werden wie das CSS 'color' Attribut.
         [/lang]
         * @type String
         */
        debugColor: {
            get: function() {
                return this._debugColor;
            },
            set: function(color) {
                this._debugColor = color;
            }
        },
        /**
         [lang:ja]
         * Entityの透明度.
         * 0から1までの値を設定する(0が完全な透明, 1が完全な不透明).
         [/lang]
         [lang:en]
         * The transparency of this entity.
         * Defines the transparency level from 0 to 1
         * (0 is completely transparent, 1 is completely opaque).
         [/lang]
         [lang:de]
         * Transparenz der Entity.
         * Definiert den Level der Transparenz von 0 bis 1
         * (0 ist komplett transparent, 1 ist vollständig deckend).
         [/lang]
         * @type Number
         */
        opacity: {
            get: function() {
                return this._opacity;
            },
            set: function(opacity) {
                this._opacity = parseFloat(opacity);
            }
        },
        /**
         [lang:ja]
         * Entityを表示するかどうかを指定する.
         [/lang]
         [lang:en]
         * Indicates whether or not to display this Entity.
         [/lang]
         [lang:de]
         * Zeigt an, ob die Entity dargestellt werden soll oder nicht.
         [/lang]
         * @type Boolean
         */
        visible: {
            get: function() {
                return this._visible;
            },
            set: function(visible) {
                this._visible = visible;
            }
        },
        /**
         [lang:ja]
         * Entityのタッチを有効にするかどうかを指定する.
         [/lang]
         [lang:en]
         * Indicates whether or not this Entity can be touched.
         [/lang]
         [lang:de]
         * Definiert ob auf die Entity geklickt werden kann.
         [/lang]
         * @type Boolean
         */
        touchEnabled: {
            get: function() {
                return this._touchEnabled;
            },
            set: function(enabled) {
                this._touchEnabled = enabled;
                if (enabled) {
                    this._style.pointerEvents = 'all';
                } else {
                    this._style.pointerEvents = 'none';
                }
            }
        },
        /**
         [lang:ja]
         * Entityの矩形が交差しているかどうかにより衝突判定を行う.
         * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
         * @return {Boolean} 衝突判定の結果.
         [/lang]
         [lang:en]
         * Performs a collision detection based on whether or not the bounding rectangles are intersecting.
         * @param {*} other An object like Entity, with the properties x, y, width, height, which are used for the 
         * collision detection.
         * @return {Boolean} True, if a collision was detected.
         [/lang]
         [lang:de]
         * Führt eine Kollisionsdetektion durch, die überprüft ob eine Überschneidung zwischen den
         * begrenzenden Rechtecken existiert. 
         * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
         * mit dem die Kollisionsdetektion durchgeführt wird.
         * @return {Boolean} True, falls eine Kollision festgestellt wurde.
         [/lang]
         */
        intersect: function(other) {
            if (other instanceof enchant.Entity) {
                return this._intersectOne(other);
            } else if (typeof other === 'function' && other.collection) {
                return _intersectBetweenClassAndInstance(other, this);
            }
            return false;
        },
        _intersectOne: function(other) {
            if (this._dirty) {
                this._updateCoordinate();
            } if (other._dirty) {
                other._updateCoordinate();
            }
            return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
                this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
        },
        intersectStrict: function(other) {
            if (other instanceof enchant.Entity) {
                return this._intersectStrictOne(other);
            } else if (typeof other === 'function' && other.collection) {
                return _intersectStrictBetweenClassAndInstance(other, this);
            }
            return false;
        },
        _intersectStrictOne: function(other) {
            if (this._dirty) {
                this._updateCoordinate();
            } if (other._dirty) {
                other._updateCoordinate();
            }
            var rect1 = this.getOrientedBoundingRect(),
                rect2 = other.getOrientedBoundingRect(),
                lt1 = rect1.leftTop, rt1 = rect1.rightTop,
                lb1 = rect1.leftBottom, rb1 = rect1.rightBottom,
                lt2 = rect2.leftTop, rt2 = rect2.rightTop,
                lb2 = rect2.leftBottom, rb2 = rect2.rightBottom,
                ltx1 = lt1[0], lty1 = lt1[1], rtx1 = rt1[0], rty1 = rt1[1],
                lbx1 = lb1[0], lby1 = lb1[1], rbx1 = rb1[0], rby1 = rb1[1],
                ltx2 = lt2[0], lty2 = lt2[1], rtx2 = rt2[0], rty2 = rt2[1],
                lbx2 = lb2[0], lby2 = lb2[1], rbx2 = rb2[0], rby2 = rb2[1],
                t1 = [ rtx1 - ltx1, rty1 - lty1 ],
                r1 = [ rbx1 - rtx1, rby1 - rty1 ],
                b1 = [ lbx1 - rbx1, lby1 - rby1 ],
                l1 = [ ltx1 - lbx1, lty1 - lby1 ],
                t2 = [ rtx2 - ltx2, rty2 - lty2 ],
                r2 = [ rbx2 - rtx2, rby2 - rty2 ],
                b2 = [ lbx2 - rbx2, lby2 - rby2 ],
                l2 = [ ltx2 - lbx2, lty2 - lby2 ],
                cx1 = (ltx1 + rtx1 + lbx1 + rbx1) >> 2,
                cy1 = (lty1 + rty1 + lby1 + rby1) >> 2,
                cx2 = (ltx2 + rtx2 + lbx2 + rbx2) >> 2,
                cy2 = (lty2 + rty2 + lby2 + rby2) >> 2,
                i, j, poss1, poss2, dirs1, dirs2, pos1, pos2, dir1, dir2,
                px1, py1, px2, py2, dx1, dy1, dx2, dy2, vx, vy, c, c1, c2;
            if (t1[0] * (cy2 - lty1) - t1[1] * (cx2 - ltx1) > 0 &&
                r1[0] * (cy2 - rty1) - r1[1] * (cx2 - rtx1) > 0 &&
                b1[0] * (cy2 - rby1) - b1[1] * (cx2 - rbx1) > 0 &&
                l1[0] * (cy2 - lby1) - l1[1] * (cx2 - lbx1) > 0) {
                return true;
            } else if (t2[0] * (cy1 - lty2) - t2[1] * (cx1 - ltx2) > 0 &&
                r2[0] * (cy1 - rty2) - r2[1] * (cx1 - rtx2) > 0 &&
                b2[0] * (cy1 - rby2) - b2[1] * (cx1 - rbx2) > 0 &&
                l2[0] * (cy1 - lby2) - l2[1] * (cx1 - lbx2) > 0) {
                return true;
            } else {
                poss1 = [ lt1, rt1, rb1, lb1 ];
                poss2 = [ lt2, rt2, rb2, lb2 ];
                dirs1 = [ t1, r1, b1, l1 ];
                dirs2 = [ t2, r2, b2, l2 ];
                for (i = 0; i < 4; i++) {
                    pos1 = poss1[i];
                    px1 = pos1[0]; py1 = pos1[1];
                    dir1 = dirs1[i];
                    dx1 = dir1[0]; dy1 = dir1[1];
                    for (j = 0; j < 4; j++) {
                        pos2 = poss2[j];
                        px2 = pos2[0]; py2 = pos2[1];
                        dir2 = dirs2[j];
                        dx2 = dir2[0]; dy2 = dir2[1];
                        c = dx1 * dy2 - dy1 * dx2;
                        if (c !== 0) {
                            vx = px2 - px1;
                            vy = py2 - py1;
                            c1 = (vx * dy1 - vy * dx1) / c;
                            c2 = (vx * dy2 - vy * dx2) / c;
                            if (0 < c1 && c1 < 1 && 0 < c2 && c2 < 1) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        },
        /**
         [lang:ja]
         * Entityの中心点どうしの距離により衝突判定を行う.
         * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
         * @param {Number} [distance] 衝突したと見なす最大の距離. デフォルト値は二つのEntityの横幅と高さの平均.
         * @return {Boolean} 衝突判定の結果.
         [/lang]
         [lang:en]
         * Performs a collision detection based on distance from the Entity's central point.
         * @param {*} other An object like Entity, with properties x, y, width, height, which are used for the 
         * collision detection.
         * @param {Number} [distance] The greatest distance to be considered for a collision.
         * The default distance is the average of both objects width and height.
         * @return {Boolean} True, if a collision was detected.
         [/lang]
         [lang:de]
         * Führt eine Kollisionsdetektion durch, die anhand der Distanz zwischen den Objekten feststellt,
         * ob eine Kollision aufgetreten ist.
         * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
         * mit dem die Kollisionsdetektion durchgeführt wird.
         * @param {Number} [distance] Die größte Distanz die für die Kollision in betracht gezogen wird.
         * Der Standardwert ist der Durchschnitt der Breite und Höhe beider Objekte.
         * @return {Boolean} True, falls eine Kollision festgestellt wurde.
         [/lang]
         */
        within: function(other, distance) {
            if (this._dirty) {
                this._updateCoordinate();
            } if (other._dirty) {
                other._updateCoordinate();
            }
            if (distance == null) {
                distance = (this.width + this.height + other.width + other.height) / 4;
            }
            var _;
            return (_ = this._offsetX - other._offsetX + (this.width - other.width) / 2) * _ +
                (_ = this._offsetY - other._offsetY + (this.height - other.height) / 2) * _ < distance * distance;
        },
        /**
         [lang:ja]
         * Entityを拡大縮小する.
         * @param {Number} x 拡大するx軸方向の倍率.
         * @param {Number} [y] 拡大するy軸方向の倍率.
         [/lang]
         [lang:en]
         * Enlarges or shrinks this Entity.
         * @param {Number} x Scaling factor on the x axis.
         * @param {Number} [y] Scaling factor on the y axis.
         [/lang]
         [lang:de]
         * Vergrößert oder verkleinert dieses Entity.
         * @param {Number} x Skalierungsfaktor auf der x-Achse.
         * @param {Number} [y] Skalierungsfaktor auf der y-Achse.
         [/lang]
         */
        scale: function(x, y) {
            this._scaleX *= x;
            this._scaleY *= (y != null) ? y : x;
            this._dirty = true;
        },
        /**
         [lang:ja]
         * Entityを回転する.
         * @param {Number} deg 回転する角度 (度数法).
         [/lang]
         [lang:en]
         * Rotate this Entity.
         * @param {Number} deg Rotation angle (degree).
         [/lang]
         [lang:de]
         * Rotiert dieses Entity.
         * @param {Number} deg Rotationswinkel (Grad).
         [/lang]
         */
        rotate: function(deg) {
            this.rotation += deg;
        },
        /**
         [lang:ja]
         * Entityのx軸方向の倍率.
         [/lang]
         [lang:en]
         * Scaling factor on the x axis of this Entity.
         [/lang]
         [lang:de]
         * Skalierungsfaktor auf der x-Achse dieses Entity.
         [/lang]
         * @type Number
         */
        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(scaleX) {
                if(this._scaleX !== scaleX) {
                    this._scaleX = scaleX;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * Entityのy軸方向の倍率.
         [/lang]
         [lang:en]
         * Scaling factor on the y axis of this Entity.
         [/lang]
         [lang:de]
         * Skalierungsfaktor auf der y-Achse dieses Entity.
         [/lang]
         * @type Number
         */
        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(scaleY) {
                if(this._scaleY !== scaleY) {
                    this._scaleY = scaleY;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * Entityの回転角 (度数法).
         [/lang]
         [lang:en]
         * Entity rotation angle (degree).
         [/lang]
         [lang:de]
         * Rotationswinkel des Entity (Grad).
         [/lang]
         * @type Number
         */
        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rotation) {
                if(this._rotation !== rotation) {
                    this._rotation = rotation;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * 回転・拡大縮小の基準点のX座標
         [/lang]
         [lang:en]
         * The point of origin used for rotation and scaling.
         [/lang]
         [lang:de]
         * Ausgangspunkt für Rotation und Skalierung.
         [/lang]
         * @type Number
         */
        originX: {
            get: function() {
                return this._originX;
            },
            set: function(originX) {
                if(this._originX !== originX) {
                    this._originX = originX;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * 回転・拡大縮小の基準点のY座標
         [/lang]
         [lang:en]
         * The point of origin used for rotation and scaling.
         [/lang]
         [lang:de]
         * Ausgangspunkt für Rotation und Skalierung.
         [/lang]
         * @type Number
         */
        originY: {
            get: function() {
                return this._originY;
            },
            set: function(originY) {
                if(this._originY !== originY) {
                    this._originY = originY;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * インスタンスをコレクションの対象にする.
         * デフォルトで呼び出される.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         */
        enableCollection: function() {
            this.addEventListener('addedtoscene', this._addSelfToCollection);
            this.addEventListener('removedfromscene', this._removeSelfFromCollection);
            if (this.scene) {
                this._addSelfToCollection();
            }
        },
        /**
         [lang:ja]
         * インスタンスをコレクションの対象から除外する.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         */
        disableCollection: function() {
            this.removeEventListener('addedtoscene', this._addSelfToCollection);
            this.removeEventListener('removedfromscene', this._removeSelfFromCollection);
            if (this.scene) {
                this._removeSelfFromCollection();
            }
        },
        /**#nocode+*/
        clearEventListener: function() {
            _nodePrototypeClearEventListener.apply(this,arguments);
            if (this.scene) {
                this._removeSelfFromCollection();
            }
        },
        /**#nocode-*/
        _addSelfToCollection: function() {
            if (this._isContainedInCollection) {
                return;
            }
    
            var Constructor = this.getConstructor();
            Constructor._collectionTarget.forEach(function(C) {
                C.collection.push(this);
            }, this);
    
            this._isContainedInCollection = true;
        },
        _removeSelfFromCollection: function() {
            if (!this._isContainedInCollection) {
                return;
            }
    
            var Constructor = this.getConstructor();
            Constructor._collectionTarget.forEach(function(C) {
                var i = C.collection.indexOf(this);
                if (i !== -1) {
                    C.collection.splice(i, 1);
                }
            }, this);
    
            this._isContainedInCollection = false;
        },
        getBoundingRect: function() {
            var w = this.width || 0;
            var h = this.height || 0;
            var mat = this._matrix;
            var m11w = mat[0] * w, m12w = mat[1] * w,
                m21h = mat[2] * h, m22h = mat[3] * h,
                mdx = mat[4], mdy = mat[5];
            var xw = [ mdx, m11w + mdx, m21h + mdx, m11w + m21h + mdx ].sort(function(a, b) { return a - b; });
            var yh = [ mdy, m12w + mdy, m22h + mdy, m12w + m22h + mdy ].sort(function(a, b) { return a - b; });
    
            return {
                left: xw[0],
                top: yh[0],
                width: xw[3] - xw[0],
                height: yh[3] - yh[0]
            };
        },
        getOrientedBoundingRect: function() {
            var w = this.width || 0;
            var h = this.height || 0;
            var mat = this._matrix;
            var m11w = mat[0] * w, m12w = mat[1] * w,
                m21h = mat[2] * h, m22h = mat[3] * h,
                mdx = mat[4], mdy = mat[5];
    
            return {
                leftTop: [ mdx, mdy ],
                rightTop: [ m11w + mdx, m12w + mdy ],
                leftBottom: [ m21h + mdx, m22h + mdy ],
                rightBottom: [ m11w + m21h + mdx, m12w + m22h + mdy ]
            };
        },
        getConstructor: function() {
            return Object.getPrototypeOf(this).constructor;
        }
    });
    
    var _collectizeConstructor = function(Constructor) {
        if (Constructor._collective) {
            return;
        }
        var rel = enchant.Class.getInheritanceTree(Constructor);
        var i = rel.indexOf(enchant.Entity);
        if (i !== -1) {
            Constructor._collectionTarget = rel.splice(0, i + 1);
        } else {
            Constructor._collectionTarget = [];
        }
        Constructor.intersect = _staticIntersect;
        Constructor.intersectStrict = _staticIntersectStrict;
        Constructor.collection = [];
        Constructor._collective = true;
    };
    
    _collectizeConstructor(enchant.Entity);
    
    enchant.Entity._inherited = function(subclass) {
        _collectizeConstructor(subclass);
    };
    
    /**
     * @scope enchant.Sprite.prototype
     */
    enchant.Sprite = enchant.Class.create(enchant.Entity, {
        /**
         * @name enchant.Sprite
         * @class
         [lang:ja]
         * 画像表示機能を持ったクラス. Entity を継承している.
         * @param {Number} width Spriteの横幅.
         * @param {Number} height Spriteの高さ.
         [/lang]
         [lang:en]
         * Class which can display images.
         * @param {Number} width Sprite width.
         * @param {Number} height Sprite height.
         [/lang]
         [lang:de]
         * Eine Klasse die Grafiken darstellen kann.
         * @param {Number} width Die Breite des Sprites.
         * @param {Number} height Die Höhe des Sprites.
         [/lang]
         *
         * @example
         * var bear = new Sprite(32, 32);
         * bear.image = core.assets['chara1.gif'];
         *
         * @constructs
         * @extends enchant.Entity
         */
        initialize: function(width, height) {
            enchant.Entity.call(this);
    
            this.width = width;
            this.height = height;
            this._image = null;
            this._debugColor = '#ff0000';
            this._frameLeft = 0;
            this._frameTop = 0;
            this._frame = 0;
            this._frameSequence = null;
        },
        /**
         [lang:ja]
         * Spriteで表示する画像.
         [/lang]
         [lang:en]
         * Image displayed in the Sprite.
         [/lang]
         [lang:de]
         * Die Grafik die im Sprite dargestellt wird.
         [/lang]
         * @type enchant.Surface
         */
        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                if (image === undefined) {
                    throw new Error('Assigned value on Sprite.image is undefined. Please double-check image path, and check if the image you want to use is preload before use.');
                }
                if (image === this._image) {
                    return;
                }
                this._image = image;
                this._computeFramePosition();
            }
        },
        /**
         [lang:ja]
         * 表示するフレームのインデックス.
         * Spriteと同じ横幅と高さを持ったフレームが{@link enchant.Sprite#image}プロパティの画像に左上から順に
         * 配列されていると見て, 0から始まるインデックスを指定することでフレームを切り替える.
         *
         * 数値の配列が指定された場合, それらを毎フレーム順に切り替える.
         * ループするが, null値が含まれているとそこでループをストップする.
         [/lang]
         [lang:en]
         * Index of the frame to be displayed.
         * Frames with the same width and height as Sprite will be arrayed from upper left corner of the 
         * {@link enchant.Sprite#image} image. When a sequence of numbers is provided, the displayed frame 
         * will switch automatically. At the end of the array the sequence will restart. By setting 
         * a value within the sequence to null, the frame switching is stopped.
         [/lang]
         [lang:de]
         * Die Indizes der darzustellenden Frames.
         * Die Frames mit der selben Größe wie das Sprite werden aus der {@link enchant.Sprite#image} image Variable,
         * beginnend an der oberen linken Ecke, angeordnet. Wenn eine Nummbersequenz übergeben wird, wird
         * der dargestellte Frame automatisch gewechselt. Am ende des Arrays der Sequenz wird diese neugestartet.
         * Wenn ein Wert in der Sequenz auf null gesetzt wird, wird das automatische Framewechseln gestoppt.
         [/lang]
         *
         * @example
         * var sprite = new Sprite(32, 32);
         * sprite.frame = [0, 1, 0, 2]
         * //-> 0, 1, 0, 2, 0, 1, 0, 2,..
         * sprite.frame = [0, 1, 0, 2, null]
         * //-> 0, 1, 0, 2, (2, 2,.. :stop)
         *
         * @type Number|Array
         */
        frame: {
            get: function() {
                return this._frame;
            },
            set: function(frame) {
                if (((this._frameSequence == null) && (this._frame === frame)) || (this._deepCompareToPreviousFrame(frame))) {
                    return;
                }
                if (frame instanceof Array) {
                    this._frameSequence = frame;
                } else {
                    this._frameSequence = null;
                    this._frame = frame;
                    this._computeFramePosition();
                }
            }
        },
        _frameSequence: {
            get: function() {
                return this.__frameSequence;
            },
            set: function(frameSequence) {
                if(frameSequence && !this.__frameSequence) {
                    this.addEventListener(enchant.Event.ENTER_FRAME, this._rotateFrameSequence);
                } else if(!frameSequence && this.__frameSequence) {
                    this.removeEventListener(enchant.Event.ENTER_FRAME, this._rotateFrameSequence);
                }
                if(frameSequence) {
                    this.__frameSequence = frameSequence.slice();
                    this._originalFrameSequence = frameSequence.slice();
                    this._rotateFrameSequence();
                } else {
                    this.__frameSequence = null;
                    this._originalFrameSequence = null;
                }
            }
        },
        /**
         *
         [lang:ja]
         [/lang]
         [lang:en]
         * If we are setting the same frame Array as animation,
         * just continue animating.
         [/lang]
         [lang:de]
         [/lang]
         * @private
         */
        _deepCompareToPreviousFrame: function(frameArray) {
            if (frameArray === this._originalFrameSequence) {
                return true;
            }
            if (frameArray == null || this._originalFrameSequence == null) {
                return false;
            }
            if (!(frameArray instanceof Array)) {
                return false;
            }
            if (frameArray.length !== this._originalFrameSequence.length) {
                return false;
            }
            for (var i = 0; i < frameArray.length; ++i) {
                if (frameArray[i] !== this._originalFrameSequence[i]){
                    return false;
                }
            }
            return true;
        },
        /**
         * 0 <= frame
         [lang:ja]
         * 0以下の動作は未定義.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         * @private
         */
        _computeFramePosition: function() {
            var image = this._image;
            var row;
            if (image != null) {
                row = image.width / this._width | 0;
                this._frameLeft = (this._frame % row | 0) * this._width;
                this._frameTop = (this._frame / row | 0) * this._height % image.height;
            }
        },
        _rotateFrameSequence: function() {
            var frameSequence = this._frameSequence;
            if (frameSequence && frameSequence.length !== 0) {
                var nextFrame = frameSequence.shift();
                if (nextFrame === null) {
                    this._frameSequence = null;
                    this.dispatchEvent(new enchant.Event(enchant.Event.ANIMATION_END));
                } else {
                    this._frame = nextFrame;
                    this._computeFramePosition();
                    frameSequence.push(nextFrame);
                }
            }
        },
        /**#nocode+*/
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._computeFramePosition();
                this._dirty = true;
            }
        },
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._computeFramePosition();
                this._dirty = true;
            }
        },
        /**#nocode-*/
        cvsRender: function(ctx) {
            var image = this._image,
                w = this._width, h = this._height,
                iw, ih, elem, sx, sy, sw, sh;
            if (image && w !== 0 && h !== 0) {
                iw = image.width;
                ih = image.height;
                if (iw < w || ih < h) {
                    ctx.fillStyle = enchant.Surface._getPattern(image);
                    ctx.fillRect(0, 0, w, h);
                } else {
                    elem = image._element;
                    sx = this._frameLeft;
                    sy = Math.min(this._frameTop, ih - h);
                    // IE9 doesn't allow for negative or 0 widths/heights when drawing on the CANVAS element
                    sw = Math.max(0.01, Math.min(iw - sx, w));
                    sh = Math.max(0.01, Math.min(ih - sy, h));
                    ctx.drawImage(elem, sx, sy, sw, sh, 0, 0, w, h);
                }
            }
        },
        domRender: (function() {
            if (enchant.ENV.VENDOR_PREFIX === 'ms') {
                return function(element) {
                    if (this._image) {
                        if (this._image._css) {
                            this._style['background-image'] = this._image._css;
                            this._style['background-position'] =
                                -this._frameLeft + 'px ' +
                                -this._frameTop + 'px';
                        } else if (this._image._element) {
                        }
                    }
                };
            } else {
                return function(element) {
                    if (this._image) {
                        if (this._image._css) {
                            this._style['background-image'] = this._image._css;
                            this._style['background-position'] =
                                -this._frameLeft + 'px ' +
                                -this._frameTop + 'px';
                        } else if (this._image._element) {
                        }
                    }
                };
            }
        }())
    });
    
    /**
     * @scope enchant.Label.prototype
     */
    enchant.Label = enchant.Class.create(enchant.Entity, {
        /**
         * @name enchant.Label
         * @class
         [lang:ja]
         * Label クラス.
         [/lang]
         [lang:en]
         * A class for Label object.
         [/lang]
         [lang:de]
         * Erstellt ein Label Objekt.
         [/lang]
         * @constructs
         * @extends enchant.Entity
         */
        initialize: function(text) {
            enchant.Entity.call(this);
    
            this.text = text || '';
            this.width = 300;
            this.font = '14px serif';
            this.textAlign = 'left';
    
            this._debugColor = '#ff0000';
        },
        /**#nocode+*/
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._dirty = true;
                // issue #164
                this.updateBoundArea();
            }
        },
        /**#nocode-*/
        /**
         [lang:ja]
         * 表示するテキスト.
         * DOM レンダラを利用している場合 (DOMScene 以下にある場合) 改行タグ (br) も利用できますが,
         * ユーザから入力したり, サーバから取得した文字列を表示する場合, XSS 脆弱性などに注意してください.
         * Canvas レンダラを利用できる場合でも, 改行タグ (br, BR) は改行に変換されます.
         [/lang]
         [lang:en]
         * Text to be displayed.
         [/lang]
         [lang:de]
         * Darzustellender Text.
         [/lang]
         * @type String
         */
        text: {
            get: function() {
                return this._text;
            },
            set: function(text) {
                text = '' + text;
                if(this._text === text) {
                    return;
                }
                this._text = text;
                text = text.replace(/<br ?\/?>/gi, '<br/>');
                this._splitText = text.split('<br/>');
                this.updateBoundArea();
                for (var i = 0, l = this._splitText.length; i < l; i++) {
                    text = this._splitText[i];
                    var metrics = this.getMetrics(text);
                    this._splitText[i] = {};
                    this._splitText[i].text = text;
                    this._splitText[i].height = metrics.height;
                    this._splitText[i].width = metrics.width;
                }
            }
        },
        /**
         [lang:ja]
         * テキストの水平位置の指定.
         * CSSの'text-align'プロパティと同様の形式で指定できる.
         [/lang]
         [lang:en]
         * Specifies horizontal alignment of text.
         * Can be set according to the format of the CSS 'text-align' property.
         [/lang]
         [lang:de]
         * Spezifiziert die horizontale Ausrichtung des Textes.
         * Kann im gleichen Format wie die CSS 'text-align' Eigenschaft angegeben werden.
         [/lang]
         * @type String
         */
        textAlign: {
            get: function() {
                return this._style['text-align'];
            },
            set: function(textAlign) {
                this._style['text-align'] = textAlign;
                this.updateBoundArea();
            }
        },
        /**
         [lang:ja]
         * フォントの指定.
         * CSSの'font'プロパティと同様の形式で指定できる.
         [/lang]
         [lang:en]
         * Font settings.
         * Can be set according to the format of the CSS 'font' property.
         [/lang]
         [lang:de]
         * Text Eigenschaften.
         * Kann im gleichen Format wie die CSS 'font' Eigenschaft angegeben werden.
         [/lang]
         * @type String
         */
        font: {
            get: function() {
                return this._style.font;
            },
            set: function(font) {
                this._style.font = font;
                this.updateBoundArea();
            }
        },
        /**
         [lang:ja]
         * 文字色の指定.
         * CSSの'color'プロパティと同様の形式で指定できる.
         [/lang]
         [lang:en]
         * Text color settings.
         * Can be set according to the format of the CSS 'color' property.
         [/lang]
         [lang:de]
         * Text Farbe.
         * Kann im gleichen Format wie die CSS 'color' Eigenschaft angegeben werden.
         [/lang]
         * @type String
         */
        color: {
            get: function() {
                return this._style.color;
            },
            set: function(color) {
                this._style.color = color;
            }
        },
        cvsRender: function(ctx) {
            var x, y = 0;
            var labelWidth = this.width;
            var charWidth, amount, line, text, c, buf, increase, length;
            var bufWidth;
            if (this._splitText) {
                ctx.textBaseline = 'top';
                ctx.font = this.font;
                ctx.fillStyle = this.color || '#000000';
                charWidth = ctx.measureText(' ').width;
                amount = labelWidth / charWidth;
                for (var i = 0, l = this._splitText.length; i < l; i++) {
                    line = this._splitText[i];
                    text = line.text;
                    c = 0;
                    while (text.length > c + amount || ctx.measureText(text.slice(c, c + amount)).width > labelWidth) {
                        buf = '';
                        increase = amount;
                        length = 0;
                        while (increase > 0) {
                            if (ctx.measureText(buf).width < labelWidth) {
                                length += increase;
                                buf = text.slice(c, c + length);
                            } else {
                                length -= increase;
                                buf = text.slice(c, c + length);
                            }
                            increase = increase / 2 | 0;
                        }
                        ctx.fillText(buf, 0, y);
                        y += line.height - 1;
                        c += length;
                    }
                    buf = text.slice(c, c + text.length);
                    if (this.textAlign === 'right') {
                        x = labelWidth - ctx.measureText(buf).width;
                    } else if (this.textAlign === 'center') {
                        x = (labelWidth - ctx.measureText(buf).width) / 2;
                    } else {
                        x = 0;
                    }
                    ctx.fillText(buf, x, y);
                    y += line.height - 1;
                }
            }
        },
        domRender: function(element) {
            if (element.innerHTML !== this._text) {
                element.innerHTML = this._text;
            }
        },
        detectRender: function(ctx) {
            ctx.fillRect(this._boundOffset, 0, this._boundWidth, this._boundHeight);
        },
        updateBoundArea: function() {
            var metrics = this.getMetrics();
            this._boundWidth = metrics.width;
            this._boundHeight = metrics.height;
            if (this.textAlign === 'right') {
                this._boundOffset = this.width - this._boundWidth;
            } else if (this.textAlign === 'center') {
                this._boundOffset = (this.width - this._boundWidth) / 2;
            } else {
                this._boundOffset = 0;
            }
        },
        getMetrics: function(text) {
            var ret = {};
            var div, width, height;
            if (document.body) {
                div = document.createElement('div');
                for (var prop in this._style) {
                    if(prop !== 'width' && prop !== 'height') {
                        div.style[prop] = this._style[prop];
                    }
                }
                text = text || this._text;
                div.innerHTML = text.replace(/ /g, '&nbsp;');
                div.style.whiteSpace = 'noWrap';
                div.style.lineHeight = 1;
                document.body.appendChild(div);
                var computedStyle = getComputedStyle(div);
                ret.height = parseInt(computedStyle.height, 10) + 1;
                div.style.position = 'absolute';
                ret.width = parseInt(computedStyle.width, 10) + 1;
                document.body.removeChild(div);
            } else {
                ret.width = this.width;
                ret.height = this.height;
            }
            return ret;
        }
    });
    
    /**
     * @scope enchant.Map.prototype
     */
    enchant.Map = enchant.Class.create(enchant.Entity, {
        /**
         * @name enchant.Map
         * @class
         [lang:ja]
         * タイルセットからマップを生成して表示するクラス.
         * @param {Number} tileWidth タイルの横幅.
         * @param {Number} tileHeight タイルの高さ.
         [/lang]
         [lang:en]
         * A class to create and display maps from a tile set.
         * @param {Number} tileWidth Tile width.
         * @param {Number} tileHeight Tile height.
         [/lang]
         [lang:de]
         * Eine Klasse mit der Karten aus Kacheln (Tiles)
         * erstellt und angezeigt werden können.
         * @param {Number} tileWidth Kachelbreite.
         * @param {Number} tileHeight Kachelhöhe.
         [/lang]
         * @constructs
         * @extends enchant.Entity
         */
        initialize: function(tileWidth, tileHeight) {
            var core = enchant.Core.instance;
    
            enchant.Entity.call(this);
    
            var surface = new enchant.Surface(core.width, core.height);
            this._surface = surface;
            var canvas = surface._element;
            canvas.style.position = 'absolute';
            if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                canvas.width = core.width * 2;
                canvas.height = core.height * 2;
                this._style.webkitTransformOrigin = '0 0';
                this._style.webkitTransform = 'scale(0.5)';
            } else {
                canvas.width = core.width;
                canvas.height = core.height;
            }
            this._context = canvas.getContext('2d');
    
            this._tileWidth = tileWidth || 0;
            this._tileHeight = tileHeight || 0;
            this._image = null;
            this._data = [
                [
                    []
                ]
            ];
            this._dirty = false;
            this._tight = false;
    
            this.touchEnabled = false;
    
            /**
             [lang:ja]
             * タイルが衝突判定を持つかを表す値の二元配列.
             [/lang]
             [lang:en]
             * Two dimensional array to store if collision detection should be performed for a tile.
             [/lang]
             [lang:de]
             * Ein 2-Dimensionales Array um zu speichern, ob für eine Kachel
             * Kollesionsdetektion durchgeführt werden soll.
             [/lang]
             * @type Number[][]
             */
            this.collisionData = null;
    
            this._listeners['render'] = null;
            this.addEventListener('render', function() {
                if(this._dirty) {
                    this._previousOffsetX = this._previousOffsetY = null;
                }
            });
        },
        /**
         [lang:ja]
         * データを設定する.
         * タイルががimageプロパティの画像に左上から順に配列されていると見て, 0から始まる
         * インデックスの二元配列を設定する.複数指定された場合は後のものから順に表示される.
         * @param {...Number[][]} data タイルのインデックスの二元配列. 複数指定できる.
         [/lang]
         [lang:en]
         * Set map data.
         * Sets the tile data, whereas the data (two-dimensional array with indizes starting from 0) 
         * is mapped on the image starting from the upper left corner.
         * When more than one map data array is set, they are displayed in reverse order.
         * @param {...Number[][]} data Two-dimensional array of tile indizes. Multiple designations possible.
         [/lang]
         [lang:de]
         * Setzt die Kartendaten.
         * Setzt die Kartendaten, wobei die Daten (ein 2-Dimensionales Array bei dem die Indizes bei 0 beginnen) 
         * auf das Bild, beginned bei der linken oberen Ecke) projeziert werden.
         * Sollte mehr als ein Array übergeben worden sein, werden die Karten in invertierter Reihenfolge dargestellt. 
         * @param {...Number[][]} data 2-Dimensionales Array mit Kachel Indizes. Mehrfachangaben möglich.
         [/lang]
         */
        loadData: function(data) {
            this._data = Array.prototype.slice.apply(arguments);
            this._dirty = true;
    
            this._tight = false;
            for (var i = 0, len = this._data.length; i < len; i++) {
                var c = 0;
                data = this._data[i];
                for (var y = 0, l = data.length; y < l; y++) {
                    for (var x = 0, ll = data[y].length; x < ll; x++) {
                        if (data[y][x] >= 0) {
                            c++;
                        }
                    }
                }
                if (c / (data.length * data[0].length) > 0.2) {
                    this._tight = true;
                    break;
                }
            }
        },
        /**
         [lang:ja]
         * ある座標のタイルが何か調べる.
         * @param {Number} x マップ上の点のx座標.
         * @param {Number} y マップ上の点のy座標.
         * @return {*} ある座標のタイルのデータ.
         [/lang]
         [lang:en]
         * Checks what tile is present at the given position.
         * @param {Number} x x coordinates of the point on the map.
         * @param {Number} y y coordinates of the point on the map.
         * @return {*} The tile data for the given position.
         [/lang]
         [lang:de]
         * Überprüft welche Kachel an der gegeben Position vorhanden ist.
         * @param {Number} x Die x Koordinataten des Punktes auf der Karte.
         * @param {Number} y Die y Koordinataten des Punktes auf der Karte.
         * @return {*} Die Kachel für die angegebene Position.
         [/lang]
         */
        checkTile: function(x, y) {
            if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
                return false;
            }
            var width = this._image.width;
            var height = this._image.height;
            var tileWidth = this._tileWidth || width;
            var tileHeight = this._tileHeight || height;
            x = x / tileWidth | 0;
            y = y / tileHeight | 0;
            //		return this._data[y][x];
            var data = this._data[0];
            return data[y][x];
        },
        /**
         [lang:ja]
         * Map上に障害物があるかどうかを判定する.
         * @param {Number} x 判定を行うマップ上の点のx座標.
         * @param {Number} y 判定を行うマップ上の点のy座標.
         * @return {Boolean} 障害物があるかどうか.
         [/lang]
         [lang:en]
         * Judges whether or not obstacles are on top of Map.
         * @param {Number} x x coordinates of detection spot on map.
         * @param {Number} y y coordinates of detection spot on map.
         * @return {Boolean} True, if there are obstacles.
         [/lang]
         [lang:de]
         * Überprüft ob auf der Karte Hindernisse vorhanden sind.
         * @param {Number} x Die x Koordinataten des Punktes auf der Karte, der überprüft werden soll.
         * @param {Number} y Die y Koordinataten des Punktes auf der Karte, der überprüft werden soll.
         * @return {Boolean} True, falls Hindernisse vorhanden sind.
         [/lang]
         */
        hitTest: function(x, y) {
            if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
                return false;
            }
            var width = this._image.width;
            var height = this._image.height;
            var tileWidth = this._tileWidth || width;
            var tileHeight = this._tileHeight || height;
            x = x / tileWidth | 0;
            y = y / tileHeight | 0;
            if (this.collisionData != null) {
                return this.collisionData[y] && !!this.collisionData[y][x];
            } else {
                for (var i = 0, len = this._data.length; i < len; i++) {
                    var data = this._data[i];
                    var n;
                    if (data[y] != null && (n = data[y][x]) != null &&
                        0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0)) {
                        return true;
                    }
                }
                return false;
            }
        },
        /**
         [lang:ja]
         * Mapで表示するタイルセット画像.
         [/lang]
         [lang:en]
         * Image with which the tile set is displayed on the map.
         [/lang]
         [lang:de]
         * Das Bild mit dem die Kacheln auf der Karte dargestellt werden.
         [/lang]
         * @type enchant.Surface
         */
        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                var core = enchant.Core.instance;
    
                this._image = image;
                if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                    var img = new enchant.Surface(image.width * 2, image.height * 2);
                    var tileWidth = this._tileWidth || image.width;
                    var tileHeight = this._tileHeight || image.height;
                    var row = image.width / tileWidth | 0;
                    var col = image.height / tileHeight | 0;
                    for (var y = 0; y < col; y++) {
                        for (var x = 0; x < row; x++) {
                            img.draw(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
                                x * tileWidth * 2, y * tileHeight * 2, tileWidth * 2, tileHeight * 2);
                        }
                    }
                    this._doubledImage = img;
                }
                this._dirty = true;
            }
        },
        /**
         [lang:ja]
         * Mapのタイルの横幅.
         [/lang]
         [lang:en]
         * Map tile width.
         [/lang]
         [lang:de]
         * Kachelbreite
         [/lang]
         * @type Number
         */
        tileWidth: {
            get: function() {
                return this._tileWidth;
            },
            set: function(tileWidth) {
                if(this._tileWidth !== tileWidth) {
                    this._tileWidth = tileWidth;
                    this._dirty = true;
                }
            }
        },
        /**
         [lang:ja]
         * Mapのタイルの高さ.
         [/lang]
         [lang:en]
         * Map tile height.
         [/lang]
         [lang:de]
         * Kachelhöhe.
         [/lang]
         * @type Number
         */
        tileHeight: {
            get: function() {
                return this._tileHeight;
            },
            set: function(tileHeight) {
                if(this._tileHeight !== tileHeight) {
                    this._tileHeight = tileHeight;
                    this._dirty = true;
                }
            }
        },
        /**
         * @private
         */
        width: {
            get: function() {
                return this._tileWidth * this._data[0][0].length;
            }
        },
        /**
         * @private
         */
        height: {
            get: function() {
                return this._tileHeight * this._data[0].length;
            }
        },
        /**
         * @private
         */
        redraw: function(x, y, width, height) {
            if (this._image == null) {
                return;
            }
    
            var image, tileWidth, tileHeight, dx, dy;
            if (this._doubledImage) {
                image = this._doubledImage;
                tileWidth = this._tileWidth * 2;
                tileHeight = this._tileHeight * 2;
                dx = -this._offsetX * 2;
                dy = -this._offsetY * 2;
                x *= 2;
                y *= 2;
                width *= 2;
                height *= 2;
            } else {
                image = this._image;
                tileWidth = this._tileWidth;
                tileHeight = this._tileHeight;
                dx = -this._offsetX;
                dy = -this._offsetY;
            }
            var row = image.width / tileWidth | 0;
            var col = image.height / tileHeight | 0;
            var left = Math.max((x + dx) / tileWidth | 0, 0);
            var top = Math.max((y + dy) / tileHeight | 0, 0);
            var right = Math.ceil((x + dx + width) / tileWidth);
            var bottom = Math.ceil((y + dy + height) / tileHeight);
    
            var source = image._element;
            var context = this._context;
            var canvas = context.canvas;
            context.clearRect(x, y, width, height);
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var r = Math.min(right, data[0].length);
                var b = Math.min(bottom, data.length);
                for (y = top; y < b; y++) {
                    for (x = left; x < r; x++) {
                        var n = data[y][x];
                        if (0 <= n && n < row * col) {
                            var sx = (n % row) * tileWidth;
                            var sy = (n / row | 0) * tileHeight;
                            context.drawImage(source, sx, sy, tileWidth, tileHeight,
                                x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight);
                        }
                    }
                }
            }
        },
        /**
         * @private
         */
        updateBuffer: function() {
            if (this._visible === undefined || this._visible) {
                var core = enchant.Core.instance;
                if (this._dirty || this._previousOffsetX == null) {
                    this.redraw(0, 0, core.width, core.height);
                } else if (this._offsetX !== this._previousOffsetX ||
                        this._offsetY !== this._previousOffsetY) {
                    if (this._tight) {
                        var x = -this._offsetX;
                        var y = -this._offsetY;
                        var px = -this._previousOffsetX;
                        var py = -this._previousOffsetY;
                        var w1 = x - px + core.width;
                        var w2 = px - x + core.width;
                        var h1 = y - py + core.height;
                        var h2 = py - y + core.height;
                        if (w1 > this._tileWidth && w2 > this._tileWidth &&
                                h1 > this._tileHeight && h2 > this._tileHeight) {
                            var sx, sy, dx, dy, sw, sh;
                            if (w1 < w2) {
                                sx = 0;
                                dx = px - x;
                                sw = w1;
                            } else {
                                sx = x - px;
                                dx = 0;
                                sw = w2;
                            }
                            if (h1 < h2) {
                                sy = 0;
                                dy = py - y;
                                sh = h1;
                            } else {
                                sy = y - py;
                                dy = 0;
                                sh = h2;
                            }
    
                            if (core._buffer == null) {
                                core._buffer = document.createElement('canvas');
                                core._buffer.width = this._context.canvas.width;
                                core._buffer.height = this._context.canvas.height;
                            }
                            var context = core._buffer.getContext('2d');
                            if (this._doubledImage) {
                                context.clearRect(0, 0, sw * 2, sh * 2);
                                context.drawImage(this._context.canvas,
                                        sx * 2, sy * 2, sw * 2, sh * 2, 0, 0, sw * 2, sh * 2);
                                context = this._context;
                                context.clearRect(dx * 2, dy * 2, sw * 2, sh * 2);
                                context.drawImage(core._buffer,
                                        0, 0, sw * 2, sh * 2, dx * 2, dy * 2, sw * 2, sh * 2);
                            } else {
                                context.clearRect(0, 0, sw, sh);
                                context.drawImage(this._context.canvas,
                                        sx, sy, sw, sh, 0, 0, sw, sh);
                                context = this._context;
                                context.clearRect(dx, dy, sw, sh);
                                context.drawImage(core._buffer,
                                        0, 0, sw, sh, dx, dy, sw, sh);
                            }
    
                            if (dx === 0) {
                                this.redraw(sw, 0, core.width - sw, core.height);
                            } else {
                                this.redraw(0, 0, core.width - sw, core.height);
                            }
                            if (dy === 0) {
                                this.redraw(0, sh, core.width, core.height - sh);
                            } else {
                                this.redraw(0, 0, core.width, core.height - sh);
                            }
                        } else {
                            this.redraw(0, 0, core.width, core.height);
                        }
                    } else {
                        this.redraw(0, 0, core.width, core.height);
                    }
                }
                this._previousOffsetX = this._offsetX;
                this._previousOffsetY = this._offsetY;
            }
        },
        cvsRender: function(ctx) {
            if (this.width !== 0 && this.height !== 0) {
                var core = enchant.Core.instance;
                this.updateBuffer();
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                var cvs = this._context.canvas;
                    ctx.drawImage(cvs, 0, 0, core.width, core.height);
                ctx.restore();
            }
        },
        domRender: function(element) {
            if (this._image) {
                this.updateBuffer();
                this._style['background-image'] = this._surface._css;
                // bad performance
                this._style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(1, 0, 0, 1, 0, 0)';
            }
        }
    });
    
    
    /**
     * @scope enchant.Group.prototype
     */
    enchant.Group = enchant.Class.create(enchant.Node, {
        /**
         * @name enchant.Group
         * @class
         [lang:ja]
         * 複数の {@link enchant.Node} を子に持つことができるクラス.
         *
         * @example
         * var stage = new Group();
         * stage.addChild(player);
         * stage.addChild(enemy);
         * stage.addChild(map);
         * stage.addEventListener('enterframe', function() {
         *     // playerの座標に従って全体をスクロールする
         *     if (this.x > 64 - player.x) {
         *         this.x = 64 - player.x;
         *     }
         * });
         *
         [/lang]
         [lang:en]
         * A class that can hold multiple {@link enchant.Node}.
         *
         * @example
         * var stage = new Group();
         * stage.addChild(player);
         * stage.addChild(enemy);
         * stage.addChild(map);
         * stage.addEventListener('enterframe', function() {
         *     // Moves the entire frame in according to the player's coordinates.
         *     if (this.x > 64 - player.x) {
         *         this.x = 64 - player.x;
         *     }
         * });
         *
         [/lang]
         [lang:de]
         * Eine Klasse die mehrere {@link enchant.Node} beinhalten kann.
         *
         * @example
         * var stage = new Group();
         * stage.addChild(player);
         * stage.addChild(enemy);
         * stage.addChild(map);
         * stage.addEventListener('enterframe', function() {
         *     // Bewegt den gesamten Frame je nach der aktuelle Spielerposition.
         *     if (this.x > 64 - player.x) {
         *         this.x = 64 - player.x;
         *     }
         * });
         *
         [/lang]
         * @constructs
         * @extends enchant.Node
         */
        initialize: function() {
            /**
             [lang:ja]
             * 子のNode.
             [/lang]
             [lang:en]
             * Child Nodes.
             [/lang]
             [lang:de]
             * Kind-Nodes.
             [/lang]
             * @type enchant.Node[]
             */
            this.childNodes = [];
    
            enchant.Node.call(this);
    
            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;
    
            this._originX = null;
            this._originY = null;
    
            this.__dirty = false;
    
            [enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE]
                .forEach(function(event) {
                    this.addEventListener(event, function(e) {
                        this.childNodes.forEach(function(child) {
                            child.scene = this.scene;
                            child.dispatchEvent(e);
                        }, this);
                    });
                }, this);
        },
        /**
         [lang:ja]
         * GroupにNodeを追加する.
         * @param {enchant.Node} node 追加するNode.
         [/lang]
         [lang:en]
         * Adds a Node to the Group.
         * @param {enchant.Node} node Node to be added.
         [/lang]
         [lang:de]
         * Fügt einen Node zu der Gruppe hinzu.
         * @param {enchant.Node} node Node der hinzugeügt werden soll.
         [/lang]
         */
        addChild: function(node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            this.childNodes.push(node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = null;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        },
        /**
         [lang:ja]
         * GroupにNodeを挿入する.
         * @param {enchant.Node} node 挿入するNode.
         * @param {enchant.Node} reference 挿入位置の前にあるNode.
         [/lang]
         [lang:en]
         * Incorporates Node into Group.
         * @param {enchant.Node} node Node to be incorporated.
         * @param {enchant.Node} reference Node in position before insertion.
         [/lang]
         [lang:de]
         * Fügt einen Node vor einen anderen Node zu dieser Gruppe hinzu.
         * @param {enchant.Node} node Der Node der hinzugefügt werden soll.
         * @param {enchant.Node} reference Der Node der sich vor dem einzufügendem Node befindet.
         [/lang]
         */
        insertBefore: function(node, reference) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            var i = this.childNodes.indexOf(reference);
            if (i !== -1) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;
                var childAdded = new enchant.Event('childadded');
                childAdded.node = node;
                childAdded.next = reference;
                this.dispatchEvent(childAdded);
                node.dispatchEvent(new enchant.Event('added'));
                if (this.scene) {
                    node.scene = this.scene;
                    var addedToScene = new enchant.Event('addedtoscene');
                    node.dispatchEvent(addedToScene);
                }
            } else {
                this.addChild(node);
            }
        },
        /**
         [lang:ja]
         * GroupからNodeを削除する.
         * @param {enchant.Node} node 削除するNode.
         [/lang]
         [lang:en]
         * Remove a Node from the Group.
         * @param {enchant.Node} node Node to be deleted.
         [/lang]
         [lang:de]
         * Entfernt einen Node aus der Gruppe.
         * @param {enchant.Node} node Der Node der entfernt werden soll.
         [/lang]
         */
        removeChild: function(node) {
            var i;
            if ((i = this.childNodes.indexOf(node)) !== -1) {
                this.childNodes.splice(i, 1);
                node.parentNode = null;
                var childRemoved = new enchant.Event('childremoved');
                childRemoved.node = node;
                this.dispatchEvent(childRemoved);
                node.dispatchEvent(new enchant.Event('removed'));
                if (this.scene) {
                    node.scene = null;
                    var removedFromScene = new enchant.Event('removedfromscene');
                    node.dispatchEvent(removedFromScene);
                }
            }
        },
        /**
         [lang:ja]
         * 最初の子Node.
         [/lang]
         [lang:en]
         * The Node which is the first child.
         [/lang]
         [lang:de]
         * Der Node, welcher das erste Kind der Gruppe darstellt.
         [/lang]
         * @type enchant.Node
         */
        firstChild: {
            get: function() {
                return this.childNodes[0];
            }
        },
        /**
         [lang:ja]
         * 最後の子Node.
         [/lang]
         [lang:en]
         * The Node which is the last child.
         [/lang]
         [lang:de]
         * Der Node, welcher das letzte Kind der Gruppe darstellt.
         [/lang]
         * @type enchant.Node
         */
        lastChild: {
            get: function() {
                return this.childNodes[this.childNodes.length - 1];
            }
        },
        /**
        [lang:ja]
        * Groupの回転角 (度数法).
        [/lang]
        [lang:en]
        * Group rotation angle (degree).
        [/lang]
        [lang:de]
        * Rotationswinkel der Gruppe (Grad).
        [/lang]
        * @type Number
        */
        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rotation) {
                if(this._rotation !== rotation) {
                    this._rotation = rotation;
                    this._dirty = true;
                }
            }
        },
        /**
        [lang:ja]
        * Groupのx軸方向の倍率.
        [/lang]
        [lang:en]
        * Scaling factor on the x axis of the Group.
        [/lang]
        [lang:de]
        * Skalierungsfaktor auf der x-Achse der Gruppe.
        [/lang]
        * @type Number
        * @see enchant.Group#originX
        * @see enchant.Group#originY
        */
        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(scale) {
                if(this._scaleX !== scale) {
                    this._scaleX = scale;
                    this._dirty = true;
                }
            }
        },
        /**
        [lang:ja]
        * Groupのy軸方向の倍率.
        [/lang]
        [lang:en]
        * Scaling factor on the y axis of the Group.
        [/lang]
        [lang:de]
        * Skalierungsfaktor auf der y-Achse der Gruppe.
        [/lang]
        * @type Number
        * @see enchant.Group#originX
        * @see enchant.Group#originY
        */
        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(scale) {
                if(this._scaleY !== scale) {
                    this._scaleY = scale;
                    this._dirty = true;
                }
            }
        },
        /**
        [lang:ja]
        * 回転・拡大縮小の基準点のX座標
        [/lang]
        [lang:en]
        * origin point of rotation, scaling
        [/lang]
        [lang:de]
        * Ausgangspunkt für Rotation und Skalierung.
        [/lang]
        * @type Number
        */
        originX: {
            get: function() {
                return this._originX;
            },
            set: function(originX) {
                if(this._originX !== originX) {
                    this._originX = originX;
                    this._dirty = true;
                }
            }
        },
        /**
        [lang:ja]
        * 回転・拡大縮小の基準点のX座標
        [/lang]
        [lang:en]
        * origin point of rotation, scaling
        [/lang]
        [lang:de]
        * Ausgangspunkt für Rotation und Skalierung.
        [/lang]
        * @type Number
        */
        originY: {
            get: function() {
                return this._originY;
            },
            set: function(originY) {
                if(this._originY !== originY) {
                    this._originY = originY;
                    this._dirty = true;
                }
            }
        },
        /**#nocode+*/
        _dirty: {
            get: function() {
                return this.__dirty;
            },
            set: function(dirty) {
                dirty = !!dirty;
                this.__dirty = dirty;
                if (dirty) {
                    for (var i = 0, l = this.childNodes.length; i < l; i++) {
                        this.childNodes[i]._dirty = true;
                    }
                }
            }
        }
        /**#nocode-*/
    });
    
    enchant.Matrix = enchant.Class.create({
        initialize: function() {
            this.reset();
        },
        reset: function() {
            this.stack = [];
            this.stack.push([ 1, 0, 0, 1, 0, 0 ]);
        },
        makeTransformMatrix: function(node, dest) {
            var x = node._x;
            var y = node._y;
            var width = node.width || 0;
            var height = node.height || 0;
            var rotation = node._rotation || 0;
            var scaleX = (typeof node._scaleX === 'number') ? node._scaleX : 1;
            var scaleY = (typeof node._scaleY === 'number') ? node._scaleY : 1;
            var theta = rotation * Math.PI / 180;
            var tmpcos = Math.cos(theta);
            var tmpsin = Math.sin(theta);
            var w = (typeof node._originX === 'number') ? node._originX : width / 2;
            var h = (typeof node._originY === 'number') ? node._originY : height / 2;
            var a = scaleX * tmpcos;
            var b = scaleX * tmpsin;
            var c = scaleY * tmpsin;
            var d = scaleY * tmpcos;
            dest[0] = a;
            dest[1] = b;
            dest[2] = -c;
            dest[3] = d;
            dest[4] = (-a * w + c * h + x + w);
            dest[5] = (-b * w - d * h + y + h);
        },
        multiply: function(m1, m2, dest) {
            var a11 = m1[0], a21 = m1[2], adx = m1[4],
                a12 = m1[1], a22 = m1[3], ady = m1[5];
            var b11 = m2[0], b21 = m2[2], bdx = m2[4],
                b12 = m2[1], b22 = m2[3], bdy = m2[5];
    
            dest[0] = a11 * b11 + a21 * b12;
            dest[1] = a12 * b11 + a22 * b12;
            dest[2] = a11 * b21 + a21 * b22;
            dest[3] = a12 * b21 + a22 * b22;
            dest[4] = a11 * bdx + a21 * bdy + adx;
            dest[5] = a12 * bdx + a22 * bdy + ady;
        },
        multiplyVec: function(mat, vec, dest) {
            var x = vec[0], y = vec[1];
            var m11 = mat[0], m21 = mat[2], mdx = mat[4],
                m12 = mat[1], m22 = mat[3], mdy = mat[5];
            dest[0] = m11 * x + m21 * y + mdx;
            dest[1] = m12 * x + m22 * y + mdy;
        }
    });
    enchant.Matrix.instance = new enchant.Matrix();
    
    enchant.DetectColorManager = enchant.Class.create({
        initialize: function(reso, max) {
            this.reference = [];
            this.colorResolution = reso || 16;
            this.max = max || 1;
            this.capacity = Math.pow(this.colorResolution, 3);
            for (var i = 1, l = this.capacity; i < l; i++) {
                this.reference[i] = null;
            }
        },
        attachDetectColor: function(sprite) {
            var i = this.reference.indexOf(null);
            if (i === -1) {
                i = 1;
            }
            this.reference[i] = sprite;
            return this._getColor(i);
        },
        detachDetectColor: function(sprite) {
            var i = this.reference.indexOf(sprite);
            if (i !== -1) {
                this.reference[i] = null;
            }
        },
        _getColor: function(n) {
            var C = this.colorResolution;
            var d = C / this.max;
            return [
                parseInt((n / C / C) % C, 10) / d,
                parseInt((n / C) % C, 10) / d,
                parseInt(n % C, 10) / d,
                1.0
            ];
        },
        _decodeDetectColor: function(color, i) {
            i = i || 0;
            var C = this.colorResolution;
            return ~~(color[i] * C * C * C / 256) +
                ~~(color[i + 1] * C * C / 256) +
                ~~(color[i + 2] * C / 256);
        },
        getSpriteByColor: function(color) {
            return this.reference[this._decodeDetectColor(color)];
        },
        getSpriteByColors: function(rgba) {
            var i, l, id, result,
                score = 0,
                found = {};
    
            for (i = 0, l = rgba.length; i < l; i+= 4) {
                id = this._decodeDetectColor(rgba, i);
                found[id] = (found[id] || 0) + 1;
            }
            for (id in found) {
                if (found[id] > score) {
                    score = found[id];
                    result = id;
                }
            }
    
            return this.reference[result];
        }
    });
    
    enchant.DomManager = enchant.Class.create({
        initialize: function(node, elementDefinition) {
            var core = enchant.Core.instance;
            this.layer = null;
            this.targetNode = node;
            if (typeof elementDefinition === 'string') {
                this.element = document.createElement(elementDefinition);
            } else if (elementDefinition instanceof HTMLElement) {
                this.element = elementDefinition;
            }
            this.style = this.element.style;
            this.style.position = 'absolute';
            this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0px 0px';
            if (core._debug) {
                this.style.border = '1px solid blue';
                this.style.margin = '-1px';
            }
    
            var manager = this;
            this._setDomTarget = function() {
                manager.layer._touchEventTarget = manager.targetNode;
            };
            this._attachEvent();
        },
        getDomElement: function() {
            return this.element;
        },
        getDomElementAsNext: function() {
            return this.element;
        },
        getNextManager: function(manager) {
            var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
            if (i !== this.targetNode.parentNode.childNodes.length - 1) {
                return this.targetNode.parentNode.childNodes[i + 1]._domManager;
            } else {
                return null;
            }
        },
        addManager: function(childManager, nextManager) {
            var nextElement;
            if (nextManager) {
                nextElement = nextManager.getDomElementAsNext();
            }
            var element = childManager.getDomElement();
            if (element instanceof Array) {
                element.forEach(function(child) {
                    if (nextElement) {
                        this.element.insertBefore(child, nextElement);
                    } else {
                        this.element.appendChild(child);
                    }
                }, this);
            } else {
                if (nextElement) {
                    this.element.insertBefore(element, nextElement);
                } else {
                    this.element.appendChild(element);
                }
            }
            this.setLayer(this.layer);
        },
        removeManager: function(childManager) {
            if (childManager instanceof enchant.DomlessManager) {
                childManager._domRef.forEach(function(element) {
                    this.element.removeChild(element);
                }, this);
            } else {
                this.element.removeChild(childManager.element);
            }
            this.setLayer(this.layer);
        },
        setLayer: function(layer) {
            this.layer = layer;
            var node = this.targetNode;
            var manager;
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    manager = node.childNodes[i]._domManager;
                    if (manager) {
                        manager.setLayer(layer);
                    }
                }
            }
        },
        render: function(inheritMat) {
            var node = this.targetNode;
            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;
            var dest = [];
            matrix.makeTransformMatrix(node, dest);
            matrix.multiply(stack[stack.length - 1], dest, dest);
            matrix.multiply(inheritMat, dest, inheritMat);
            node._matrix = inheritMat;
            var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
            var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(dest, vec, vec);
    
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            if(node.parentNode && !(node.parentNode instanceof enchant.Group)) {
                node._offsetX += node.parentNode._offsetX;
                node._offsetY += node.parentNode._offsetY;
            }
            if (node._dirty) {
                this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(' +
                    dest[0].toFixed(10) + ',' +
                    dest[1].toFixed(10) + ',' +
                    dest[2].toFixed(10) + ',' +
                    dest[3].toFixed(10) + ',' +
                    dest[4].toFixed(10) + ',' +
                    dest[5].toFixed(10) +
                ')';
            }
            this.domRender();
        },
        domRender: function() {
            var node = this.targetNode;
            if(!node._style) {
                node._style = {};
            }
            if(!node.__styleStatus) {
                node.__styleStatus = {};
            }
            if (node.width !== null) {
                node._style.width = node.width + 'px';
            }
            if (node.height !== null) {
                node._style.height = node.height + 'px';
            }
            node._style.opacity = node._opacity;
            node._style['background-color'] = node._backgroundColor;
            if (typeof node._visible !== 'undefined') {
                node._style.display = node._visible ? 'block' : 'none';
            }
            if (typeof node.domRender === 'function') {
                node.domRender(this.element);
            }
            var value;
            for (var prop in node._style) {
                value = node._style[prop];
                if(node.__styleStatus[prop] !== value && value != null) {
                    this.style.setProperty(prop, '' + value);
                    node.__styleStatus[prop] = value;
                }
            }
        },
        _attachEvent: function() {
            if (enchant.ENV.TOUCH_ENABLED) {
                this.element.addEventListener('touchstart', this._setDomTarget, true);
            }
            this.element.addEventListener('mousedown', this._setDomTarget, true);
        },
        _detachEvent: function() {
            if (enchant.ENV.TOUCH_ENABLED) {
                this.element.removeEventListener('touchstart', this._setDomTarget, true);
            }
            this.element.removeEventListener('mousedown', this._setDomTarget, true);
        },
        remove: function() {
            this._detachEvent();
            this.element = this.style = this.targetNode = null;
        }
    });
    
    enchant.DomlessManager = enchant.Class.create({
        initialize: function(node) {
            this._domRef = [];
            this.targetNode = node;
        },
        _register: function(element, nextElement) {
            var i = this._domRef.indexOf(nextElement);
            if (element instanceof Array) {
                if (i === -1) {
                    Array.prototype.push.apply(this._domRef, element);
                } else {
                    Array.prototype.splice.apply(this._domRef, [i, 0].concat(element));
                }
            } else {
                if (i === -1) {
                    this._domRef.push(element);
                } else {
                    this._domRef.splice(i, 0, element);
                }
            }
        },
        getNextManager: function(manager) {
            var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
            if (i !== this.targetNode.parentNode.childNodes.length - 1) {
                return this.targetNode.parentNode.childNodes[i + 1]._domManager;
            } else {
                return null;
            }
        },
        getDomElement: function() {
            var ret = [];
            this.targetNode.childNodes.forEach(function(child) {
                ret = ret.concat(child._domManager.getDomElement());
            });
            return ret;
        },
        getDomElementAsNext: function() {
            if (this._domRef.length) {
                return this._domRef[0];
            } else {
                var nextManager = this.getNextManager(this);
                if (nextManager) {
                    return nextManager.element;
                } else {
                    return null;
                }
            }
        },
        addManager: function(childManager, nextManager) {
            var parentNode = this.targetNode.parentNode;
            if (parentNode) {
                if (nextManager === null) {
                    nextManager = this.getNextManager(this);
                }
                if (parentNode instanceof enchant.Scene) {
                    parentNode._layers.Dom._domManager.addManager(childManager, nextManager);
                } else {
                    parentNode._domManager.addManager(childManager, nextManager);
                }
            }
            var nextElement = nextManager ? nextManager.getDomElementAsNext() : null;
            this._register(childManager.getDomElement(), nextElement);
            this.setLayer(this.layer);
        },
        removeManager: function(childManager) {
            var dom;
            var i = this._domRef.indexOf(childManager.element);
            if (i !== -1) {
                dom = this._domRef[i];
                dom.parentNode.removeChild(dom);
                this._domRef.splice(i, 1);
            }
            this.setLayer(this.layer);
        },
        setLayer: function(layer) {
            this.layer = layer;
            var node = this.targetNode;
            var manager;
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    manager = node.childNodes[i]._domManager;
                    if (manager) {
                        manager.setLayer(layer);
                    }
                }
            }
        },
        render: function(inheritMat) {
            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;
            var node = this.targetNode;
            var dest = [];
            matrix.makeTransformMatrix(node, dest);
            matrix.multiply(stack[stack.length - 1], dest, dest);
            matrix.multiply(inheritMat, dest, inheritMat);
            node._matrix = inheritMat;
            var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
            var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(dest, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            stack.push(dest);
        },
        remove: function() {
            this._domRef = [];
            this.targetNode = null;
        }
    });
    
    enchant.DomLayer = enchant.Class.create(enchant.Group, {
        initialize: function() {
            var core = enchant.Core.instance;
            enchant.Group.call(this);
    
            this._touchEventTarget = null;
    
            this._element = document.createElement('div');
            this._element.style.position = 'absolute';
    
            this._domManager = new enchant.DomManager(this, this._element);
            this._domManager.layer = this;
    
            this.width = core.width;
            this.height = core.height;
    
            var touch = [
                enchant.Event.TOUCH_START,
                enchant.Event.TOUCH_MOVE,
                enchant.Event.TOUCH_END
            ];
    
            touch.forEach(function(type) {
                this.addEventListener(type, function(e) {
                    if (this._scene) {
                        this._scene.dispatchEvent(e);
                    }
                });
            }, this);
    
            var __onchildadded = function(e) {
                var child = e.node;
                var next = e.next;
                var self = e.target;
                var nextManager = next ? next._domManager : null;
                enchant.DomLayer._attachDomManager(child, __onchildadded, __onchildremoved);
                self._domManager.addManager(child._domManager, nextManager);
                var render = new enchant.Event(enchant.Event.RENDER);
                child._dirty = true;
                self._domManager.layer._rendering(child, render);
            };
    
            var __onchildremoved = function(e) {
                var child = e.node;
                var self = e.target;
                self._domManager.removeManager(child._domManager);
                enchant.DomLayer._detachDomManager(child, __onchildadded, __onchildremoved);
            };
    
            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);
    
        },
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._element.style.width = width + 'px';
            }
        },
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._element.style.height = height + 'px';
            }
        },
        addChild: function(node) {
            this.childNodes.push(node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = null;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        },
        insertBefore: function(node, reference) {
            var i = this.childNodes.indexOf(reference);
            if (i !== -1) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;
                var childAdded = new enchant.Event('childadded');
                childAdded.node = node;
                childAdded.next = reference;
                this.dispatchEvent(childAdded);
                node.dispatchEvent(new enchant.Event('added'));
                if (this.scene) {
                    node.scene = this.scene;
                    var addedToScene = new enchant.Event('addedtoscene');
                    node.dispatchEvent(addedToScene);
                }
            } else {
                this.addChild(node);
            }
        },
        _startRendering: function() {
            this.addEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        _stopRendering: function() {
            this.removeEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        _onexitframe: function() {
            this._rendering(this, new enchant.Event(enchant.Event.RENDER));
        },
        _rendering: function(node, e, inheritMat) {
            var child;
            if (!inheritMat) {
                inheritMat = [ 1, 0, 0, 1, 0, 0 ];
            }
            node.dispatchEvent(e);
            node._domManager.render(inheritMat);
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this._rendering(child, e, inheritMat.slice());
                }
            }
            if (node._domManager instanceof enchant.DomlessManager) {
                enchant.Matrix.instance.stack.pop();
            }
            node._dirty = false;
        },
        _determineEventTarget: function() {
            var target = this._touchEventTarget;
            this._touchEventTarget = null;
            return (target === this) ? null : target;
        }
    });
    
    enchant.DomLayer._attachDomManager = function(node, onchildadded, onchildremoved) {
        var child;
        if (!node._domManager) {
            node.addEventListener('childadded', onchildadded);
            node.addEventListener('childremoved', onchildremoved);
            if (node instanceof enchant.Group) {
                node._domManager = new enchant.DomlessManager(node);
            } else {
                if (node._element) {
                    node._domManager = new enchant.DomManager(node, node._element);
                } else {
                    node._domManager = new enchant.DomManager(node, 'div');
                }
            }
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                enchant.DomLayer._attachDomManager(child, onchildadded, onchildremoved);
                node._domManager.addManager(child._domManager, null);
            }
        }
    };
    
    enchant.DomLayer._detachDomManager = function(node, onchildadded, onchildremoved) {
        var child;
        node.removeEventListener('childadded', onchildadded);
        node.removeEventListener('childremoved', onchildremoved);
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                node._domManager.removeManager(child._domManager, null);
                enchant.DomLayer._detachDomManager(child, onchildadded, onchildremoved);
            }
        }
        node._domManager.remove();
        delete node._domManager;
    };
    
    /**
     * @scope enchant.CanvasLayer.prototype
     */
    enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
        /**
         * @name enchant.CanvasLayer
         * @class
         [lang:ja]
         * Canvas を用いた描画を行うクラス.
         * 子を Canvas を用いた描画に切り替えるクラス.
         [/lang]
         [lang:en]
         * Class that uses the HTML Canvas for rendering.
         * The rendering of children will be replaced by the Canvas rendering.
         [/lang]
         [lang:de]
         * Eine Klasse die HTML Canvas für das Rendern nutzt.
         * Das Rendern der Kinder wird durch das Canvas Rendering ersetzt.
         [/lang]
         * @constructs
         * @extends enchant.Group
         */
        initialize: function() {
            var core = enchant.Core.instance;
    
            enchant.Group.call(this);
    
            this._cvsCache = {
                matrix: [1, 0, 0, 1, 0, 0],
                detectColor: '#000000'
            };
            this._cvsCache.layer = this;
    
            this._element = document.createElement('canvas');
            this._element.style.position = 'absolute';
            // issue 179
            this._element.style.left = this._element.style.top = '0px';
    
            this._detect = document.createElement('canvas');
            this._detect.style.position = 'absolute';
            this._lastDetected = 0;
    
            this.context = this._element.getContext('2d');
            this._dctx = this._detect.getContext('2d');
            this._setImageSmoothingEnable();
    
            this._colorManager = new enchant.DetectColorManager(16, 256);
    
            this.width = core.width;
            this.height = core.height;
    
            var touch = [
                enchant.Event.TOUCH_START,
                enchant.Event.TOUCH_MOVE,
                enchant.Event.TOUCH_END
            ];
    
            touch.forEach(function(type) {
                this.addEventListener(type, function(e) {
                    if (this._scene) {
                        this._scene.dispatchEvent(e);
                    }
                });
            }, this);
    
            var __onchildadded = function(e) {
                var child = e.node;
                var self = e.target;
                var layer;
                if (self instanceof enchant.CanvasLayer) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }
                enchant.CanvasLayer._attachCache(child, layer, __onchildadded, __onchildremoved);
                var render = new enchant.Event(enchant.Event.RENDER);
                if (self._dirty) {
                    self._updateCoordinate();
                }
                child._dirty = true;
                enchant.Matrix.instance.stack.push(self._matrix);
                enchant.CanvasRenderer.instance.render(layer.context, child, render);
                enchant.Matrix.instance.stack.pop(self._matrix);
            };
    
            var __onchildremoved = function(e) {
                var child = e.node;
                var self = e.target;
                var layer;
                if (self instanceof enchant.CanvasLayer) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }
                enchant.CanvasLayer._detachCache(child, layer, __onchildadded, __onchildremoved);
            };
    
            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);
    
        },
        /**
         [lang:ja]
         * CanvasLayerの横幅.
         [/lang]
         [lang:en]
         * The width of the CanvasLayer.
         [/lang]
         [lang:de]
         * Die Breite der CanvasLayer.
         [/lang]
         * @type Number
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._element.width = this._detect.width = width;
                this._setImageSmoothingEnable();
            }
        },
        /**
         [lang:ja]
         * CanvasLayerの高さ.
         [/lang]
         [lang:en]
         * The height of the CanvasLayer.
         [/lang]
         [lang:de]
         * Die Höhe der CanvasLayer.
         [/lang]
         * @type Number
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._element.height = this._detect.height = height;
                this._setImageSmoothingEnable();
            }
        },
        addChild: function(node) {
            this.childNodes.push(node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = null;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
        },
        insertBefore: function(node, reference) {
            var i = this.childNodes.indexOf(reference);
            if (i !== -1) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;
                var childAdded = new enchant.Event('childadded');
                childAdded.node = node;
                childAdded.next = reference;
                this.dispatchEvent(childAdded);
                node.dispatchEvent(new enchant.Event('added'));
            } else {
                this.addChild(node);
            }
        },
        /**
         [lang:ja]
         * レンダリングを開始する.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         * @private
         */
        _startRendering: function() {
            this.addEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        /**
         [lang:ja]
         * レンダリングを停止する.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         * @private
         */
        _stopRendering: function() {
            this.removeEventListener('exitframe', this._onexitframe);
            this._onexitframe();
        },
        _onexitframe: function() {
            var core = enchant.Core.instance;
            var ctx = this.context;
            ctx.clearRect(0, 0, core.width, core.height);
            var render = new enchant.Event(enchant.Event.RENDER);
            enchant.CanvasRenderer.instance.render(ctx, this, render);
        },
        _determineEventTarget: function(e) {
            return this._getEntityByPosition(e.x, e.y);
        },
        _getEntityByPosition: function(x, y) {
            var core = enchant.Core.instance;
            var ctx = this._dctx;
            if (this._lastDetected < core.frame) {
                ctx.clearRect(0, 0, this.width, this.height);
                enchant.CanvasRenderer.instance.detectRender(ctx, this);
                this._lastDetected = core.frame;
            }
            var extra = enchant.ENV.COLOR_DETECTION_LEVEL - 1;
            var rgba = ctx.getImageData(x - extra, y - extra, 1 + extra * 2, 1 + extra * 2).data;
            return this._colorManager.getSpriteByColors(rgba);
        },
        _setImageSmoothingEnable: function() {
            this._dctx.imageSmoothingEnabled =
                    this._dctx.msImageSmoothingEnabled =
                    this._dctx.mozImageSmoothingEnabled =
                    this._dctx.webkitImageSmoothingEnabled = false;
        }
    });
    
    enchant.CanvasLayer._attachCache = function(node, layer, onchildadded, onchildremoved) {
        var child;
        if (!node._cvsCache) {
            node._cvsCache = {};
            node._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
            node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
            node.addEventListener('childadded', onchildadded);
            node.addEventListener('childremoved', onchildremoved);
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                enchant.CanvasLayer._attachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };
    
    enchant.CanvasLayer._detachCache = function(node, layer, onchildadded, onchildremoved) {
        var child;
        if (node._cvsCache) {
            layer._colorManager.detachDetectColor(node);
            node.removeEventListener('childadded', onchildadded);
            node.removeEventListener('childremoved', onchildremoved);
            delete node._cvsCache;
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                enchant.CanvasLayer._detachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };
    
    enchant.CanvasRenderer = enchant.Class.create({
        render: function(ctx, node, e) {
            var width, height, child;
            ctx.save();
            node.dispatchEvent(e);
            // transform
            this.transform(ctx, node);
            if (typeof node._visible === 'undefined' || node._visible) {
                width = node.width;
                height = node.height;
                // composite
                if (node.compositeOperation) {
                    ctx.globalCompositeOperation = node.compositeOperation;
                }
                ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
                // render
                if (node._backgroundColor) {
                    ctx.fillStyle = node._backgroundColor;
                    ctx.fillRect(0, 0, width, height);
                }
    
                if (node.cvsRender) {
                    node.cvsRender(ctx);
                }
    
                if (enchant.Core.instance._debug && node._debugColor) {
                    ctx.strokeStyle = node._debugColor;
                    ctx.strokeRect(0, 0, width, height);
                }
                if (node._clipping) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }
                if (node.childNodes) {
                    for (var i = 0, l = node.childNodes.length; i < l; i++) {
                        child = node.childNodes[i];
                        this.render(ctx, child, e);
                    }
                }
            }
            ctx.restore();
            enchant.Matrix.instance.stack.pop();
        },
        detectRender: function(ctx, node) {
            var width, height, child;
            if (typeof node._visible === 'undefined' || node._visible) {
                width = node.width;
                height = node.height;
                ctx.save();
                this.transform(ctx, node);
                ctx.fillStyle = node._cvsCache.detectColor;
                if (node._touchEnabled) {
                    if (node.detectRender) {
                        node.detectRender(ctx);
                    } else {
                        ctx.fillRect(0, 0, width, height);
                    }
                }
                if (node._clipping) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }
                if (node.childNodes) {
                    for (var i = 0, l = node.childNodes.length; i < l; i++) {
                        child = node.childNodes[i];
                        this.detectRender(ctx, child);
                    }
                }
                ctx.restore();
                enchant.Matrix.instance.stack.pop();
            }
        },
        transform: function(ctx, node) {
            var matrix = enchant.Matrix.instance;
            var stack = matrix.stack;
            var newmat, ox, oy, vec;
            if (node._dirty) {
                matrix.makeTransformMatrix(node, node._cvsCache.matrix);
                newmat = [];
                matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
                node._matrix = newmat;
                ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
                oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
                vec = [ ox, oy ];
                matrix.multiplyVec(newmat, vec, vec);
                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;
                node._dirty = false;
            } else {
                newmat = node._matrix;
            }
            stack.push(newmat);
            ctx.setTransform.apply(ctx, newmat);
        }
    });
    enchant.CanvasRenderer.instance = new enchant.CanvasRenderer();
    
    /**
     * @scope enchant.Scene.prototype
     */
    enchant.Scene = enchant.Class.create(enchant.Group, {
        /**
         * @name enchant.Scene
         * @class
         [lang:ja]
         * 表示オブジェクトツリーのルートになるクラス.
         * シーンはレイヤーを持っていて, 子として追加されたオブジェクト ({@link Entity}) は描画方法に応じてレイヤーに振り分けられる.
         * Scene クラスは最も汎用的なシーンの実装で, ({@link enchant.DOMLayer} と {@link enchant.CanvasLayer}) を持っており,
         * それぞれ DOM, Canvas を用いて描画される. 描画順は DOM が手前, Canvas が奥で,
         * 各レイヤーの間では新しく追加されたオブジェクトほど手前に表示される.
         * Scene クラスを継承することで, 新しい種類の Layer を持つシーンクラスを作ることができる.
         [/lang]
         [lang:en]
         * Class that becomes the root of the display object tree.
         * Child {@link Entity} objects are distributed to the Scene layer according to the drawing method.
         * The DOM of each Scene layer has a ({@link enchant.DOMLayer} and  {@link enchant.CanvasLayer}) and is drawn using the Canvas.
         * Scenes are drawn in the order that they are added.
         [/lang]
         [lang:de]
         * Eine Klasse die zur Wurzel im Darstellungsobjektbaum wird.
         [/lang]
         *
         * @example
         * var scene = new Scene();
         * scene.addChild(player);
         * scene.addChild(enemy);
         * core.pushScene(scene);
         *
         * @constructs
         * @extends enchant.Group
         */
        initialize: function() {
            var core = enchant.Core.instance;
    
            // Call initialize method of enchant.Group
            enchant.Group.call(this);
    
            // All nodes (entities, groups, scenes) have reference to the scene that it belongs to.
            this.scene = this;
    
            this._backgroundColor = null;
    
            // Create div tag which possesses its layers
            this._element = document.createElement('div');
            this._element.style.position = 'absolute';
            this._element.style.overflow = 'hidden';
            this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
    
            this._layers = {};
            this._layerPriority = [];
    
            this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
            this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
            this.addEventListener(enchant.Event.ENTER, this._onenter);
            this.addEventListener(enchant.Event.EXIT, this._onexit);
    
            var that = this;
            this._dispatchExitframe = function() {
                var layer;
                for (var prop in that._layers) {
                    layer = that._layers[prop];
                    layer.dispatchEvent(new enchant.Event(enchant.Event.EXIT_FRAME));
                }
            };
    
            this.addEventListener(enchant.Event.CORE_RESIZE, this._oncoreresize);
    
            this._oncoreresize(core);
        },
        /**#nocode+*/
        x: {
            get: function() {
                return this._x;
            },
            set: function(x) {
                this._x = x;
                for (var type in this._layers) {
                    this._layers[type].x = x;
                }
            }
        },
        y: {
            get: function() {
                return this._y;
            },
            set: function(y) {
                this._y = y;
                for (var type in this._layers) {
                    this._layers[type].y = y;
                }
            }
        },
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                for (var type in this._layers) {
                    this._layers[type].width = width;
                }
            }
        },
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                for (var type in this._layers) {
                    this._layers[type].height = height;
                }
            }
        },
        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rotation) {
                this._rotation = rotation;
                for (var type in this._layers) {
                    this._layers[type].rotation = rotation;
                }
            }
        },
        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(scaleX) {
                this._scaleX = scaleX;
                for (var type in this._layers) {
                    this._layers[type].scaleX = scaleX;
                }
            }
        },
        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(scaleY) {
                this._scaleY = scaleY;
                for (var type in this._layers) {
                    this._layers[type].scaleY = scaleY;
                }
            }
        },
        backgroundColor: {
            get: function() {
                return this._backgroundColor;
            },
            set: function(color) {
                this._backgroundColor = this._element.style.backgroundColor = color;
            }
        },
        remove: function() {
            this.clearEventListener();
    
            while (this.childNodes.length > 0) {
                this.childNodes[0].remove();
            }
    
            return enchant.Core.instance.removeScene(this);
        },
        /**#nocode-*/
        _oncoreresize: function(e) {
            this._element.style.width = e.width + 'px';
            this.width = e.width;
            this._element.style.height = e.height + 'px';
            this.height = e.height;
            this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';
    
            for (var type in this._layers) {
                this._layers[type].dispatchEvent(e);
            }
        },
        addLayer: function(type, i) {
            var core = enchant.Core.instance;
            if (this._layers[type]) {
                return;
            }
            var layer = new enchant[type + 'Layer']();
            if (core.currentScene === this) {
                layer._startRendering();
            }
            this._layers[type] = layer;
            var element = layer._element;
            if (typeof i === 'number') {
                var nextSibling = this._element.childNodes[i];
                if (nextSibling) {
                    this._element.insertBefore(element, nextSibling);
                } else {
                    this._element.appendChild(element);
                }
                this._layerPriority.splice(i, 0, type);
            } else {
                this._element.appendChild(element);
                this._layerPriority.push(type);
            }
            layer._scene = this;
        },
        _determineEventTarget: function(e) {
            var layer, target;
            for (var i = this._layerPriority.length - 1; i >= 0; i--) {
                layer = this._layers[this._layerPriority[i]];
                target = layer._determineEventTarget(e);
                if (target) {
                    break;
                }
            }
            if (!target) {
                target = this;
            }
            return target;
        },
        _onchildadded: function(e) {
            var child = e.node;
            var next = e.next;
            var target, i;
            if (child._element) {
                target = 'Dom';
                i = 1;
            } else {
                target = 'Canvas';
                i = 0;
            }
            if (!this._layers[target]) {
                this.addLayer(target, i);
            }
            child._layer = this._layers[target];
            this._layers[target].insertBefore(child, next);
            child.parentNode = this;
        },
        _onchildremoved: function(e) {
            var child = e.node;
            child._layer.removeChild(child);
            child._layer = null;
        },
        _onenter: function() {
            for (var type in this._layers) {
                this._layers[type]._startRendering();
            }
            enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
        },
        _onexit: function() {
            for (var type in this._layers) {
                this._layers[type]._stopRendering();
            }
            enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
        }
    });
    
    /**
     * @scope enchant.LoadingScene.prototype
     */
    enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
        /**
         * @name enchant.LoadingScene
         * @class
         [lang:ja]
         * デフォルトのローディングシーン. ローディングアニメーションを書き換えたい場合は,
         * enchant.LoadingSceneを上書きする.
         [/lang]
         [lang:en]
         * Default loading scene. If you want to use your own loading animation, overwrite (don't inherit) this class.
         * Referred from enchant.Core in default, as `new enchant.LoadingScene` etc.
         [/lang]
         [lang:de]
         [/lang]
         *
         * @example
         * enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
         *     initialize: function() {
         *         enchant.Scene.call(this);
         *         this.backgroundColor = 'red';
         *         // ...
         *         this.addEventListener('progress', function(e) {
         *             progress = e.loaded / e.total;
         *         });
         *         this.addEventListener('enterframe', function() {
         *             // animation
         *         });
         *     }
         * });
         * @constructs
         * @extends enchant.Scene
         */
        initialize: function() {
            enchant.Scene.call(this);
            this.backgroundColor = '#000';
            var barWidth = this.width * 0.4 | 0;
            var barHeight = this.width * 0.05 | 0;
            var border = barWidth * 0.03 | 0;
            var bar = new enchant.Sprite(barWidth, barHeight);
            bar.disableCollection();
            bar.x = (this.width - barWidth) / 2;
            bar.y = (this.height - barHeight) / 2;
            var image = new enchant.Surface(barWidth, barHeight);
            image.context.fillStyle = '#fff';
            image.context.fillRect(0, 0, barWidth, barHeight);
            image.context.fillStyle = '#000';
            image.context.fillRect(border, border, barWidth - border * 2, barHeight - border * 2);
            bar.image = image;
            var progress = 0, _progress = 0;
            this.addEventListener('progress', function(e) {
                // avoid #167 https://github.com/wise9/enchant.js/issues/177
                progress = e.loaded / e.total * 1.0;
            });
            bar.addEventListener('enterframe', function() {
                _progress *= 0.9;
                _progress += progress * 0.1;
                image.context.fillStyle = '#fff';
                image.context.fillRect(border, 0, (barWidth - border * 2) * _progress, barHeight);
            });
            this.addChild(bar);
            this.addEventListener('load', function(e) {
                var core = enchant.Core.instance;
                core.removeScene(core.loadingScene);
                core.dispatchEvent(e);
            });
        }
    });
    
    /**
     * @scope enchant.CanvasScene.prototype
     */
    enchant.CanvasScene = enchant.Class.create(enchant.Scene, {
        /**
         * @name enchant.CanvasScene
         * @class
         [lang:ja]
         * すべての子をCanvasに描画するScene.
         [/lang]
         [lang:en]
         * Scene to draw by the Canvas all of the children.
         [/lang]
         [lang:de]
         [/lang]
         * @constructs
         * @extends enchant.Scene
         */
        initialize: function() {
            enchant.Scene.call(this);
            this.addLayer('Canvas');
        },
        _determineEventTarget: function(e) {
            var target = this._layers.Canvas._determineEventTarget(e);
            if (!target) {
                target = this;
            }
            return target;
        },
        _onchildadded: function(e) {
            var child = e.node;
            var next = e.next;
            child._layer = this._layers.Canvas;
            this._layers.Canvas.insertBefore(child, next);
        },
        _onenter: function() {
            this._layers.Canvas._startRendering();
            enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
        },
        _onexit: function() {
            this._layers.Canvas._stopRendering();
            enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
        }
    });
    
    /**
     * @scope enchant.DOMScene.prototype
     */
    enchant.DOMScene = enchant.Class.create(enchant.Scene, {
        /**
         * @name enchant.DOMScene
         * @class
         [lang:ja]
         * すべての子をDOMで描画するScene.
         [/lang]
         [lang:en]
         * Scene to draw by the DOM all of the children.
         [/lang]
         [lang:de]
         [/lang]
         * @constructs
         * @extends enchant.Scene
         */
        initialize: function() {
            enchant.Scene.call(this);
            this.addLayer('Dom');
        },
        _determineEventTarget: function(e) {
            var target = this._layers.Dom._determineEventTarget(e);
            if (!target) {
                target = this;
            }
            return target;
        },
        _onchildadded: function(e) {
            var child = e.node;
            var next = e.next;
            child._layer = this._layers.Dom;
            this._layers.Dom.insertBefore(child, next);
        },
        _onenter: function() {
            this._layers.Dom._startRendering();
            enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
        },
        _onexit: function() {
            this._layers.Dom._stopRendering();
            enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
        }
    });
    
    /**
     * @scope enchant.Surface.prototype
     */
    enchant.Surface = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Surface
         * @class
         [lang:ja]
         * canvas要素をラップしたクラス.
         *
         * {@link enchant.Sprite} や {@link enchant.Map} のimageプロパティに設定して表示させることができる.
         * Canvas APIにアクセスしたいときは {@link enchant.Surface#context} プロパティを用いる.
         *
         * @example
         * // 円を表示するSpriteを作成する
         * var ball = new Sprite(50, 50);
         * var surface = new Surface(50, 50);
         * surface.context.beginPath();
         * surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
         * surface.context.fill();
         * ball.image = surface;
         *
         * @param {Number} width Surfaceの横幅.
         * @param {Number} height Surfaceの高さ.
         [/lang]
         [lang:en]
         * Class that wraps canvas elements.
         *
         * Can be used to set the {@link enchant.Sprite} and {@link enchant.Map}'s image properties to be displayed.
         * If you wish to access Canvas API use the {@link enchant.Surface#context} property.
         *
         * @example
         * // Creates Sprite that displays a circle.
         * var ball = new Sprite(50, 50);
         * var surface = new Surface(50, 50);
         * surface.context.beginPath();
         * surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
         * surface.context.fill();
         * ball.image = surface;
         *
         * @param {Number} width Surface width.
         * @param {Number} height Surface height.
         [/lang]
         [lang:de]
         * Diese Klasse dient als Hüllenklasse (Wrapper) für Canvas Elemente.
         *
         * Mit dieser Klasse können die image Felder der {@link enchant.Sprite} und {@link enchant.Map}'s
         * Klassen gesetzt werden und dadurch dargestellt werden.
         * Falls die Canvas API genutzt werden möchte kann dies über die
         * {@link enchant.Surface#context} Variable erfolgen.
         *
         * @example
         * // Erstellt einen Sprite und stellt einen Kreis dar.
         * var ball = new Sprite(50, 50);
         * var surface = new Surface(50, 50);
         * surface.context.beginPath();
         * surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
         * surface.context.fill();
         * ball.image = surface;
         *
         * @param {Number} width Die Breite der Surface.
         * @param {Number} height Die Höhe der Surface.
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(width, height) {
            enchant.EventTarget.call(this);
    
            var core = enchant.Core.instance;
    
            /**
             [lang:ja]
             * Surfaceの横幅.
             [/lang]
             [lang:en]
             * Surface width.
             [/lang]
             [lang:de]
             * Die Breite der Surface.
             [/lang]
             * @type Number
             */
            this.width = Math.ceil(width);
            /**
             [lang:ja]
             * Surfaceの高さ.
             [/lang]
             [lang:en]
             * Surface height.
             [/lang]
             [lang:de]
             * Die Höhe der Surface.
             [/lang]
             * @type Number
             */
            this.height = Math.ceil(height);
            /**
             [lang:ja]
             * Surfaceの描画コンテクスト.
             [/lang]
             [lang:en]
             * Surface drawing context.
             [/lang]
             [lang:de]
             * Der Surface Zeichenkontext.
             [/lang]
             * @type CanvasRenderingContext2D
             */
            this.context = null;
    
            var id = 'enchant-surface' + core._surfaceID++;
            if (document.getCSSCanvasContext) {
                this.context = document.getCSSCanvasContext('2d', id, width, height);
                this._element = this.context.canvas;
                this._css = '-webkit-canvas(' + id + ')';
                var context = this.context;
            } else if (document.mozSetImageElement) {
                this._element = document.createElement('canvas');
                this._element.width = width;
                this._element.height = height;
                this._css = '-moz-element(#' + id + ')';
                this.context = this._element.getContext('2d');
                document.mozSetImageElement(id, this._element);
            } else {
                this._element = document.createElement('canvas');
                this._element.width = width;
                this._element.height = height;
                this._element.style.position = 'absolute';
                this.context = this._element.getContext('2d');
    
                enchant.ENV.CANVAS_DRAWING_METHODS.forEach(function(name) {
                    var method = this.context[name];
                    this.context[name] = function() {
                        method.apply(this, arguments);
                        this._dirty = true;
                    };
                }, this);
            }
        },
        /**
         [lang:ja]
         * Surfaceから1ピクセル取得する.
         * @param {Number} x 取得するピクセルのx座標.
         * @param {Number} y 取得するピクセルのy座標.
         * @return {Number[]} ピクセルの情報を[r, g, b, a]の形式で持つ配列.
         [/lang]
         [lang:en]
         * Returns 1 pixel from the Surface.
         * @param {Number} x The pixel's x coordinates.
         * @param {Number} y The pixel's y coordinates.
         * @return {Number[]} An array that holds pixel information in [r, g, b, a] format.
         [/lang]
         [lang:de]
         * Liefert einen Pixel der Surface.
         * @param {Number} x Die x Koordinaten des Pixel.
         * @param {Number} y Die y Koordinaten des Pixel.
         * @return {Number[]} Ein Array das die Pixelinformationen im [r, g, b, a] Format enthält.
         [/lang]
         */
        getPixel: function(x, y) {
            return this.context.getImageData(x, y, 1, 1).data;
        },
        /**
         [lang:ja]
         * Surfaceに1ピクセル設定する.
         * @param {Number} x 設定するピクセルのx座標.
         * @param {Number} y 設定するピクセルのy座標.
         * @param {Number} r 設定するピクセルのrの値.
         * @param {Number} g 設定するピクセルのgの値.
         * @param {Number} b 設定するピクセルのbの値.
         * @param {Number} a 設定するピクセルの透明度.
         [/lang]
         [lang:en]
         * Sets one pixel within the surface.
         * @param {Number} x The pixel's x coordinates.
         * @param {Number} y The pixel's y coordinates.
         * @param {Number} r The pixel's red level.
         * @param {Number} g The pixel's green level.
         * @param {Number} b The pixel's blue level.
         * @param {Number} a The pixel's transparency.
         [/lang]
         [lang:de]
         * Setzt einen Pixel in der Surface.
         * @param {Number} x Die x Koordinaten des Pixel.
         * @param {Number} y Die y Koordinaten des Pixel.
         * @param {Number} r Der Rotwert des Pixel.
         * @param {Number} g Der Grünwert des Pixel.
         * @param {Number} b Der Blauwert des Pixels.
         * @param {Number} a Die Transparenz des Pixels
         [/lang]
         */
        setPixel: function(x, y, r, g, b, a) {
            var pixel = this.context.createImageData(1, 1);
            pixel.data[0] = r;
            pixel.data[1] = g;
            pixel.data[2] = b;
            pixel.data[3] = a;
            this.context.putImageData(pixel, x, y);
        },
        /**
         [lang:ja]
         * Surfaceの全ピクセルをクリアし透明度0の黒に設定する.
         [/lang]
         [lang:en]
         * Clears all Surface pixels and makes the pixels transparent.
         [/lang]
         [lang:de]
         * Löscht alle Pixel und setzt macht die Pixel transparent.
         [/lang]
         */
        clear: function() {
            this.context.clearRect(0, 0, this.width, this.height);
        },
        /**
         [lang:ja]
         * Surfaceに対して引数で指定されたSurfaceを描画する.
         *
         * Canvas APIのdrawImageをラップしており, 描画する矩形を同様の形式で指定できる.
         *
         * @example
         * var src = core.assets['src.gif'];
         * var dst = new Surface(100, 100);
         * dst.draw(src);         // ソースを(0, 0)に描画
         * dst.draw(src, 50, 50); // ソースを(50, 50)に描画
         * // ソースを(50, 50)に縦横30ピクセル分だけ描画
         * dst.draw(src, 50, 50, 30, 30);
         * // ソースの(10, 10)から縦横40ピクセルの領域を(50, 50)に縦横30ピクセルに縮小して描画
         * dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
         *
         * @param {enchant.Surface} image 描画に用いるSurface.
         [/lang]
         [lang:en]
         * Draws the content of the given Surface onto this surface.
         *
         * Wraps Canvas API drawImage and if multiple arguments are given,
         * these are getting applied to the Canvas drawImage method.
         *
         * @example
         * var src = core.assets['src.gif'];
         * var dst = new Surface(100, 100);
         * dst.draw(src);         // Draws source at (0, 0)
         * dst.draw(src, 50, 50); // Draws source at (50, 50)
         * // Draws just 30 horizontal and vertical pixels of source at (50, 50)
         * dst.draw(src, 50, 50, 30, 30);
         * // Takes the image content in src starting at (10,10) with a (Width, Height) of (40,40),
         * // scales it and draws it in this surface at (50, 50) with a (Width, Height) of (30,30).
         * dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
         *
         * @param {enchant.Surface} image Surface used in drawing.
         [/lang]
         [lang:de]
         * Zeichnet den Inhalt der gegebenen Surface auf diese Surface.
         *
         * Umhüllt (wraps) die Canvas drawImage Methode und sollten mehrere Argumente
         * übergeben werden, werden diese auf die Canvas drawImage Methode angewendet.
         *
         * @example
         * var src = core.assets['src.gif'];
         * var dst = new Surface(100, 100);
         * dst.draw(src);         // Zeichnet src bei (0, 0)
         * dst.draw(src, 50, 50); // Zeichnet src bei (50, 50)
         * // Zeichnet src an der Position (50,50), jedoch nur 30x30 Pixel
         * dst.draw(src, 50, 50, 30, 30);
         * // Skaliert und zeichnet den Bereich mit der (Breite, Höhe) von (40, 40)
         * // in src ab (10,10) in diese Surface bei (50,50) mit einer (Breite, Höhe) von (30, 30).
         * dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
         *
         * @param {enchant.Surface} image Surface used in drawing.
         [/lang]
         */
        draw: function(image) {
            image = image._element;
            if (arguments.length === 1) {
                this.context.drawImage(image, 0, 0);
            } else {
                var args = arguments;
                args[0] = image;
                this.context.drawImage.apply(this.context, args);
            }
        },
        /**
         [lang:ja]
         * Surfaceを複製する.
         * @return {enchant.Surface} 複製されたSurface.
         [/lang]
         [lang:en]
         * Copies Surface.
         * @return {enchant.Surface} The copied Surface.
         [/lang]
         [lang:de]
         * Kopiert diese Surface.
         * @return {enchant.Surface} Die kopierte Surface.
         [/lang]
         */
        clone: function() {
            var clone = new enchant.Surface(this.width, this.height);
            clone.draw(this);
            return clone;
        },
        /**
         [lang:ja]
         * SurfaceからdataスキームのURLを生成する.
         * @return {String} Surfaceを表すdataスキームのURL.
         [/lang]
         [lang:en]
         * Creates a data URI scheme from this Surface.
         * @return {String} The data URI scheme that identifies this Surface and
         * can be used to include this Surface into a dom tree.
         [/lang]
         [lang:de]
         * Erstellt eine Data-URL (URI Schema) für diese Surface.
         * @return {String} Die Data-URL, welche diese Surface identifiziert und
         * welche genutzt werden kann um diese in einen DOM Baum einzubinden.
         [/lang]
         */
        toDataURL: function() {
            var src = this._element.src;
            if (src) {
                if (src.slice(0, 5) === 'data:') {
                    return src;
                } else {
                    return this.clone().toDataURL();
                }
            } else {
                return this._element.toDataURL();
            }
        }
    });
    
    /**
     [lang:ja]
     * 画像ファイルを読み込んでSurfaceオブジェクトを作成する.
     *
     * このメソッドによって作成されたSurfaceはimg要素をラップしており {@link enchant.Surface#context} プロパティに
     * アクセスしたり {@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel},
     * {@link enchant.Surface#setPixel} メソッドなどの呼び出しでCanvas APIを使った画像操作を行うことはできない.
     * ただし{@link enchant.Surface#draw} メソッドの引数とすることはでき,
     * ほかのSurfaceに描画した上で画像操作を行うことはできる(クロスドメインでロードした
     * 場合はピクセルを取得するなど画像操作の一部が制限される).
     *
     * @param {String} src ロードする画像ファイルのパス.
     * @param {Function} callback ロード完了時のコールバック.
     * @param {Function} [onerror] ロード失敗時のコールバック.
     [/lang]
     [lang:en]
     * Loads an image and creates a Surface object out of it.
     *
     * It is not possible to access properties or methods of the {@link enchant.Surface#context}, or to call methods using the Canvas API -
     * like {@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.. -
     * of the wrapped image created with this method.
     * However, it is possible to use this surface to draw it to another surface using the {@link enchant.Surface#draw} method.
     * The resulting surface can then be manipulated. (when loading images in a cross-origin resource sharing environment,
     * pixel acquisition and other image manipulation might be limited).
     *
     * @param {String} src The file path of the image to be loaded.
     * @param {Function} callback on load callback.
     * @param {Function} [onerror] on error callback.
     [/lang]
     [lang:de]
     * Läd eine Grafik und erstellt daraus ein Surface Objekt.
     *
     * Bei Grafiken die mit dieser Methode erstellt wurden ist es nicht möglich auf Variablen oder Methoden des {@link enchant.Surface#context}
     * zuzugreifen, oder Methoden die die Canvas API nutzen, wie {@link enchant.Surface#draw}, {@link enchant.Surface#clear},
     * {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.., aufzurufen.
     * Jedoch ist es möglich diese Surface zu nutzen um sie in eine andere Surface mittels der {@link enchant.Surface#draw} zu zeichen.
     * Die daraus resultierende Surface kann dann manipuliert werden. (Wenn Bilder in einer Cross-Origin Resource Sharing Umgebung
     * geladen werden, kann es sein, dass die Pixelabfrage und andere Bildmanipulationen limitiert sind)
     *
     * @param {String} src Der Dateipfad der Grafik die geladen werden soll.
     [/lang]
     * @static
     * @return {enchant.Surface} Surface
     */
    enchant.Surface.load = function(src, callback, onerror) {
        var image = new Image();
        var surface = Object.create(enchant.Surface.prototype, {
            context: { value: null },
            _css: { value: 'url(' + src + ')' },
            _element: { value: image }
        });
        enchant.EventTarget.call(surface);
        onerror = onerror || function() {};
        surface.addEventListener('load', callback);
        surface.addEventListener('error', onerror);
        image.onerror = function() {
            var e = new enchant.Event(enchant.Event.ERROR);
            e.message = 'Cannot load an asset: ' + image.src;
            enchant.Core.instance.dispatchEvent(e);
            surface.dispatchEvent(e);
        };
        image.onload = function() {
            surface.width = image.width;
            surface.height = image.height;
            surface.dispatchEvent(new enchant.Event('load'));
        };
        image.src = src;
        return surface;
    };
    enchant.Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');
    
    enchant.Surface._getPattern = function(surface, force) {
        if (!surface._pattern || force) {
            surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
        }
        return surface._pattern;
    };
    
    if (window.Deferred) {
        enchant.Deferred = window.Deferred;
    } else {
        /**
         * @scope enchant.Deferred.prototype
         */
        enchant.Deferred = enchant.Class.create({
            /**
             * @name enchant.Deferred
             * @class
             [lang:ja]
             * 非同期処理を扱うためのクラス.
             * jsdeferredのAPIを模倣している.
             * jQuery.Deferredとの互換性はない.
             [/lang]
             [lang:en]
             [/lang]
             [lang:de]
             [/lang]
             * <br/>
             * See: <a href="http://cho45.stfuawsc.com/jsdeferred/">
             * http://cho45.stfuawsc.com/jsdeferred/</a>
             *
             * @example
             * enchant.Deferred
             *     .next(function() {
             *         return 42;
             *     })
             *     .next(function(n) {
             *         console.log(n); // 42
             *     })
             *     .next(function() {
             *         return core.load('img.png'); // wait loading
             *     })
             *     .next(function() {
             *         var img = core.assets['img.png'];
             *         console.log(img instanceof enchant.Surface); // true
             *         throw new Error('!!!');
             *     })
             *     .next(function() {
             *         // skip
             *     })
             *     .error(function(err) {
             *          console.log(err.message); // !!!
             *     });
             *
             * @constructs
             */
            initialize: function() {
                this._succ = this._fail = this._next = this._id = null;
                this._tail = this;
            },
            /**
             [lang:ja]
             * 後続の処理を追加する.
             * @param {Function} func 追加する処理.
             [/lang]
             [lang:en]
             * @param {Function} func
             [/lang]
             [lang:de]
             * @param {Function} func
             [/lang]
             */
            next: function(func) {
                var q = new enchant.Deferred();
                q._succ = func;
                return this._add(q);
            },
            /**
             [lang:ja]
             * エラー処理を追加する.
             * @param {Function} func 追加するエラー処理.
             [/lang]
             [lang:en]
             * @param {Function} func
             [/lang]
             [lang:de]
             * @param {Function} func
             [/lang]
             */
            error: function(func) {
                var q = new enchant.Deferred();
                q._fail = func;
                return this._add(q);
            },
            _add: function(queue) {
                this._tail._next = queue;
                this._tail = queue;
                return this;
            },
            /**
             [lang:ja]
             * 値を伝播させる.
             * @param {*} arg 次の処理に渡す値.
             [/lang]
             [lang:en]
             * @param {*} arg
             [/lang]
             [lang:de]
             * @param {*} arg
             [/lang]
             */
            call: function(arg) {
                var received;
                var queue = this;
                while (queue && !queue._succ) {
                    queue = queue._next;
                }
                if (!(queue instanceof enchant.Deferred)) {
                    return;
                }
                try {
                    received = queue._succ(arg);
                } catch (e) {
                    return queue.fail(e);
                }
                if (received instanceof enchant.Deferred) {
                    enchant.Deferred._insert(queue, received);
                } else if (queue._next instanceof enchant.Deferred) {
                    queue._next.call(received);
                }
            },
            /**
             [lang:ja]
             * エラーを伝播させる.
             * @param {*} arg エラーとして伝播させる値.
             [/lang]
             [lang:en]
             * @param {*} arg
             [/lang]
             [lang:de]
             * @param {*} arg
             [/lang]
             */
            fail: function(arg) {
                var result, err,
                    queue = this;
                while (queue && !queue._fail) {
                    queue = queue._next;
                }
                if (queue instanceof enchant.Deferred) {
                    result = queue._fail(arg);
                    queue.call(result);
                } else if (arg instanceof Error) {
                    throw arg;
                } else {
                    err = new Error('failed in Deferred');
                    err.arg = arg;
                    throw err;
                }
            }
        });
        enchant.Deferred._insert = function(queue, ins) {
            if (queue._next instanceof enchant.Deferred) {
                ins._tail._next = queue._next;
            }
            queue._next = ins;
        };
        /**
         [lang:ja]
         * タイマーで起動するDeferredオブジェクトを生成する.
         * @param {Function} func
         * @return {enchant.Deferred} 生成されたDeferredオブジェクト.
         [/lang]
         [lang:en]
         * @param {Function} func
         * @return {enchant.Deferred}
         [/lang]
         [lang:de]
         * @param {Function} func
         * @return {enchant.Deferred}
         [/lang]
         * @static
         */
        enchant.Deferred.next = function(func) {
            var q = new enchant.Deferred().next(func);
            q._id = setTimeout(function() { q.call(); }, 0);
            return q;
        };
        /**
         [lang:ja]
         * 複数のDeferredオブジェクトを待つDeferredオブジェクトを生成する.
         * @param {Object|enchant.Deferred[]} arg
         * @return {enchant.Deferred} 生成されたDeferredオブジェクト.
         [/lang]
         [lang:en]
         * @param {Object|enchant.Deferred[]} arg
         * @return {enchant.Deferred}
         [/lang]
         [lang:de]
         * @param {Object|enchant.Deferred[]} arg
         * @return {enchant.Deferred}
         [/lang]
         *
         * @example
         * // array
         * enchant.Deferred
         *     .parallel([
         *         enchant.Deferred.next(function() {
         *             return 24;
         *         }),
         *         enchant.Deferred.next(function() {
         *             return 42;
         *         })
         *     ])
         *     .next(function(arg) {
         *         console.log(arg); // [ 24, 42 ]
         *     });
         * // object
         * enchant.Deferred
         *     .parallel({
         *         foo: enchant.Deferred.next(function() {
         *             return 24;
         *         }),
         *         bar: enchant.Deferred.next(function() {
         *             return 42;
         *         })
         *     })
         *     .next(function(arg) {
         *         console.log(arg.foo); // 24
         *         console.log(arg.bar); // 42
         *     });
         *
         * @static
         */
        enchant.Deferred.parallel = function(arg) {
            var q = new enchant.Deferred();
            q._id = setTimeout(function() { q.call(); }, 0);
            var progress = 0;
            var ret = (arg instanceof Array) ? [] : {};
            var p = new enchant.Deferred();
            for (var prop in arg) {
                if (arg.hasOwnProperty(prop)) {
                    progress++;
                    /*jshint loopfunc:true */
                    (function(queue, name) {
                        queue.next(function(arg) {
                            progress--;
                            ret[name] = arg;
                            if (progress <= 0) {
                                p.call(ret);
                            }
                        })
                        .error(function(err) { p.fail(err); });
                        if (typeof queue._id === 'number') {
                            clearTimeout(queue._id);
                        }
                        queue._id = setTimeout(function() { queue.call(); }, 0);
                    }(arg[prop], prop));
                }
            }
            if (!progress) {
                p._id = setTimeout(function() { p.call(ret); }, 0);
            }
            return q.next(function() { return p; });
        };
    }
    
    /**
     * @scope enchant.DOMSound.prototype
     */
    enchant.DOMSound = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.DOMSound
         * @class
         [lang:ja]
         * audio要素をラップしたクラス.
         *
         * MP3ファイルの再生はSafari, Chrome, Firefox, Opera, IEが対応
         * (Firefox, OperaではFlashを経由して再生). WAVEファイルの再生は
         * Safari, Chrome, Firefox, Operaが対応している. ブラウザが音声ファイル
         * のコーデックに対応していない場合は再生されない.
         *
         * コンストラクタではなく {@link enchant.DOMSound.load} を通じてインスタンスを作成する.
         [/lang]
         [lang:en]
         * Class to wrap audio elements.
         *
         * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
         * (Firefox and Opera play via Flash). WAVE files can be played on
         * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
         * the used codec the file will not play.
         *
         * Instances are created not via constructor but via {@link enchant.DOMSound.load}.
         [/lang]
         [lang:de]
         * Klasse die eine Hüllenklasse (Wrapper) für Audio Elemente darstellt.
         *
         * Safari, Chrome, Firefox, Opera, und IE können alle MP3 Dateien abspielen
         * (Firefox und Opera spielen diese mit Hilfe von Flash ab). WAVE Dateien können
         * Safari, Chrome, Firefox, and Opera abspielen. Sollte der Browser nicht mit
         * dem genutzten Codec kompatibel sein, wird die Datei nicht abgespielt.
         *
         * Instanzen dieser Klasse werden nicht mit Hilfe des Konstruktors, sondern mit
         * {@link enchant.DOMSound.load} erstellt.
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function() {
            enchant.EventTarget.call(this);
            /**
             [lang:ja]
             * Soundの再生時間 (秒).
             [/lang]
             [lang:en]
             * Sound file duration (seconds).
             [/lang]
             [lang:de]
             * Die länge der Sounddatei in Sekunden.
             [/lang]
             * @type Number
             */
            this.duration = 0;
            throw new Error("Illegal Constructor");
        },
        /**
         [lang:ja]
         * 再生を開始する.
         [/lang]
         [lang:en]
         * Begin playing.
         [/lang]
         [lang:de]
         * Startet die Wiedergabe.
         [/lang]
         */
        play: function() {
            if (this._element) {
                this._element.play();
            }
        },
        /**
         [lang:ja]
         * 再生を中断する.
         [/lang]
         [lang:en]
         * Pause playback.
         [/lang]
         [lang:de]
         * Pausiert die Wiedergabe.
         [/lang]
         */
        pause: function() {
            if (this._element) {
                this._element.pause();
            }
        },
        /**
         [lang:ja]
         * 再生を停止する.
         [/lang]
         [lang:en]
         * Stop playing.
         [/lang]
         [lang:de]
         * Stoppt die Wiedergabe.
         [/lang]
         */
        stop: function() {
            this.pause();
            this.currentTime = 0;
        },
        /**
         [lang:ja]
         * Soundを複製する.
         * @return {enchant.DOMSound} 複製されたSound.
         [/lang]
         [lang:en]
         * Create a copy of this Sound object.
         * @return {enchant.DOMSound} Copied Sound.
         [/lang]
         [lang:de]
         * Erstellt eine Kopie dieses Soundobjektes.
         * @return {enchant.DOMSound} Kopiertes Sound Objekt.
         [/lang]
         */
        clone: function() {
            var clone;
            if (this._element instanceof Audio) {
                clone = Object.create(enchant.DOMSound.prototype, {
                    _element: { value: this._element.cloneNode(false) },
                    duration: { value: this.duration }
                });
            } else if (enchant.ENV.USE_FLASH_SOUND) {
                return this;
            } else {
                clone = Object.create(enchant.DOMSound.prototype);
            }
            enchant.EventTarget.call(clone);
            return clone;
        },
        /**
         [lang:ja]
         * 現在の再生位置 (秒).
         [/lang]
         [lang:en]
         * Current playback position (seconds).
         [/lang]
         [lang:de]
         * Aktuelle Wiedergabeposition (seconds).
         [/lang]
         * @type Number
         */
        currentTime: {
            get: function() {
                return this._element ? this._element.currentTime : 0;
            },
            set: function(time) {
                if (this._element) {
                    this._element.currentTime = time;
                }
            }
        },
        /**
         [lang:ja]
         * ボリューム. 0 (無音) ～ 1 (フルボリューム).
         [/lang]
         [lang:en]
         * Volume. 0 (muted) ～ 1 (full volume).
         [/lang]
         [lang:de]
         * Lautstärke. 0 (stumm) ～ 1 (volle Lautstärke).
         [/lang]
         * @type Number
         */
        volume: {
            get: function() {
                return this._element ? this._element.volume : 1;
            },
            set: function(volume) {
                if (this._element) {
                    this._element.volume = volume;
                }
            }
        }
    });
    
    /**
     [lang:ja]
     * 音声ファイルを読み込んでDOMSoundオブジェクトを作成する.
     * @param {String} src ロードする音声ファイルのパス.
     * @param {String} [type] 音声ファイルのMIME Type.
     * @param {Function} [callback] ロード完了時のコールバック.
     * @param {Function} [onerror] ロード失敗時のコールバック.
     [/lang]
     [lang:en]
     * Loads an audio file and creates DOMSound object.
     * @param {String} src Path of the audio file to be loaded.
     * @param {String} [type] MIME Type of the audio file.
     * @param {Function} [callback] on load callback.
     * @param {Function} [onerror] on error callback.
     [/lang]
     [lang:de]
     * Läd eine Audio Datei und erstellt ein DOMSound objekt.
     * @param {String} src Pfad zu der zu ladenden Audiodatei.
     * @param {String} [type] MIME Type der Audtiodatei.
     * @param {Function} [callback]
     * @param {Function} [onerror]
     [/lang]
     * @return {enchant.DOMSound} DOMSound
     * @static
     */
    enchant.DOMSound.load = function(src, type, callback, onerror) {
        if (type == null) {
            var ext = enchant.Core.findExt(src);
            if (ext) {
                type = 'audio/' + ext;
            } else {
                type = '';
            }
        }
        type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');
        callback = callback || function() {};
        onerror = onerror || function() {};
    
        var sound = Object.create(enchant.DOMSound.prototype);
        enchant.EventTarget.call(sound);
        sound.addEventListener('load', callback);
        sound.addEventListener('error', onerror);
        var audio = new Audio();
        if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
            enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        } else {
            if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
                audio.addEventListener('canplaythrough', function canplay() {
                    sound.duration = audio.duration;
                    sound.dispatchEvent(new enchant.Event('load'));
                    audio.removeEventListener('canplaythrough', canplay);
                }, false);
                audio.src = src;
                audio.load();
                audio.autoplay = false;
                audio.onerror = function() {
                    var e = new enchant.Event(enchant.Event.ERROR);
                    e.message = 'Cannot load an asset: ' + audio.src;
                    enchant.Core.instance.dispatchEvent(e);
                    sound.dispatchEvent(e);
                };
                sound._element = audio;
            } else if (type === 'audio/mpeg') {
                var embed = document.createElement('embed');
                var id = 'enchant-audio' + enchant.Core.instance._soundID++;
                embed.width = embed.height = 1;
                embed.name = id;
                embed.src = 'sound.swf?id=' + id + '&src=' + src;
                embed.allowscriptaccess = 'always';
                embed.style.position = 'absolute';
                embed.style.left = '-1px';
                sound.addEventListener('load', function() {
                    Object.defineProperties(embed, {
                        currentTime: {
                            get: function() {
                                return embed.getCurrentTime();
                            },
                            set: function(time) {
                                embed.setCurrentTime(time);
                            }
                        },
                        volume: {
                            get: function() {
                                return embed.getVolume();
                            },
                            set: function(volume) {
                                embed.setVolume(volume);
                            }
                        }
                    });
                    sound._element = embed;
                    sound.duration = embed.getDuration();
                });
                enchant.Core.instance._element.appendChild(embed);
                enchant.DOMSound[id] = sound;
            } else {
                window.setTimeout(function() {
                    sound.dispatchEvent(new enchant.Event('load'));
                }, 0);
            }
        }
        return sound;
    };
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;
    
    /**
     * @scope enchant.WebAudioSound.prototype
     */
    enchant.WebAudioSound = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.WebAudioSound
         * @class
         [lang:ja]
         * WebAudioをラップしたクラス.
         [/lang]
         [lang:en]
         * Sound wrapper class for Web Audio API (supported on some webkit-based browsers)
         [/lang]
         [lang:de]
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function() {
            if (!window.AudioContext) {
                throw new Error("This browser does not support WebAudio API.");
            }
            enchant.EventTarget.call(this);
            if (!enchant.WebAudioSound.audioContext) {
              enchant.WebAudioSound.audioContext = new window.AudioContext();
              enchant.WebAudioSound.destination = enchant.WebAudioSound.audioContext.destination;
            }
            this.context = enchant.WebAudioSound.audioContext;
            this.src = this.context.createBufferSource();
            this.buffer = null;
            this._volume = 1;
            this._currentTime = 0;
            this._state = 0;
            this.connectTarget = enchant.WebAudioSound.destination;
        },
        /**
         [lang:ja]
         * 再生を開始する.
         * @param {Boolean} [dup=false] trueならオブジェクトの現在の再生を残したまま新しく音声を再生する.
         [/lang]
         [lang:en]
         * Begin playing.
         * @param {Boolean} [dup=false] If true, Object plays new sound while keeps last sound.
         [/lang]
         [lang:de]
         * Startet die Wiedergabe.
         * @param {Boolean} [dup=false] Wenn true, Objekt spielt neuen Sound während im letzten Ton hält.
         [/lang]
         */
        play: function(dup) {
            if (this._state === 1 && !dup) {
                this.src.disconnect();
            }
            if (this._state !== 2) {
                this._currentTime = 0;
            }
            var offset = this._currentTime;
            var actx = this.context;
            this.src = actx.createBufferSource();
            if (actx.createGain != null) {
                this._gain = actx.createGain();
            } else {
                this._gain = actx.createGainNode();
            }
            this.src.buffer = this.buffer;
            this._gain.gain.value = this._volume;
    
            this.src.connect(this._gain);
            this._gain.connect(this.connectTarget);
            if (this.src.start != null) {
                this.src.start(0, offset, this.buffer.duration - offset - 1.192e-7);
            } else {
                this.src.noteGrainOn(0, offset, this.buffer.duration - offset - 1.192e-7);
            }
            this._startTime = actx.currentTime - this._currentTime;
            this._state = 1;
        },
        /**
         [lang:ja]
         * 再生を中断する.
         [/lang]
         [lang:en]
         * Pause playback.
         [/lang]
         [lang:de]
         * Pausiert die Wiedergabe.
         [/lang]
         */
        pause: function() {
            var currentTime = this.currentTime;
            if (currentTime === this.duration) {
                return;
            }
            if (this.src.stop != null) {
                this.src.stop(0);
            } else {
                this.src.noteOff(0);
            }
            this._currentTime = currentTime;
            this._state = 2;
        },
        /**
         [lang:ja]
         * 再生を停止する.
         [/lang]
         [lang:en]
         * Stop playing.
         [/lang]
         [lang:de]
         * Stoppt die Wiedergabe.
         [/lang]
         */
        stop: function() {
            if (this.src.stop != null) {
                this.src.stop(0);
            } else {
                this.src.noteOff(0);
            }
            this._state = 0;
        },
        /**
         [lang:ja]
         * Soundを複製する.
         * @return {enchant.WebAudioSound} 複製されたSound.
         [/lang]
         [lang:en]
         * Create a copy of this Sound object.
         * @return {enchant.WebAudioSound} Copied Sound.
         [/lang]
         [lang:de]
         * Erstellt eine Kopie dieses Soundobjektes.
         * @return {enchant.WebAudioSound} Kopiertes Sound Objekt.
         [/lang]
         */
        clone: function() {
            var sound = new enchant.WebAudioSound();
            sound.buffer = this.buffer;
            return sound;
        },
        /**
         [lang:ja]
         * Soundの再生時間 (秒).
         [/lang]
         [lang:en]
         * Sound file duration (seconds).
         [/lang]
         [lang:de]
         * Die länge der Sounddatei in Sekunden.
         [/lang]
         * @type Number
         */
        duration: {
            get: function() {
                if (this.buffer) {
                    return this.buffer.duration;
                } else {
                    return 0;
                }
            }
        },
        /**
         [lang:ja]
         * ボリューム. 0 (無音) ～ 1 (フルボリューム).
         [/lang]
         [lang:en]
         * Volume. 0 (muted) ～ 1 (full volume).
         [/lang]
         [lang:de]
         * Lautstärke. 0 (stumm) ～ 1 (volle Lautstärke).
         [/lang]
         * @type Number
         */
        volume: {
            get: function() {
                return this._volume;
            },
            set: function(volume) {
                volume = Math.max(0, Math.min(1, volume));
                this._volume = volume;
                if (this.src) {
                    this._gain.gain.value = volume;
                }
            }
        },
        /**
         [lang:ja]
         * 現在の再生位置 (秒).
         [/lang]
         [lang:en]
         * Current playback position (seconds).
         [/lang]
         [lang:de]
         * Aktuelle Wiedergabeposition (seconds).
         [/lang]
         * @type Number
         */
        currentTime: {
            get: function() {
                return Math.max(0, Math.min(this.duration, this.src.context.currentTime - this._startTime));
            },
            set: function(time) {
                this._currentTime = time;
                if (this._state !== 2) {
                    this.play(false);
                }
            }
        }
    });
    
    /**
     [lang:ja]
     * 音声ファイルを読み込んでWebAudioSoundオブジェクトを作成する.
     * @param {String} src ロードする音声ファイルのパス.
     * @param {String} [type] 音声ファイルのMIME Type.
     * @param {Function} [callback] ロード完了時のコールバック.
     * @param {Function} [onerror] ロード失敗時のコールバック.
     [/lang]
     [lang:en]
     * Loads an audio file and creates WebAudioSound object.
     * @param {String} src Path of the audio file to be loaded.
     * @param {String} [type] MIME Type of the audio file.
     * @param {Function} [callback] on load callback.
     * @param {Function} [onerror] on error callback.
     [/lang]
     [lang:de]
     * Läd eine Audio Datei und erstellt ein WebAudioSound objekt.
     * @param {String} src Pfad zu der zu ladenden Audiodatei.
     * @param {String} [type] MIME Type der Audtiodatei.
     * @param {Function} [callback]
     * @param {Function} [onerror]
     [/lang]
     * @return {enchant.WebAudioSound} WebAudioSound
     * @static
     */
    enchant.WebAudioSound.load = function(src, type, callback, onerror) {
        var canPlay = (new Audio()).canPlayType(type);
        var sound = new enchant.WebAudioSound();
        callback = callback || function() {};
        onerror = onerror || function() {};
        sound.addEventListener(enchant.Event.LOAD, callback);
        sound.addEventListener(enchant.Event.ERROR, onerror);
        function dispatchErrorEvent() {
            var e = new enchant.Event(enchant.Event.ERROR);
            e.message = 'Cannot load an asset: ' + src;
            enchant.Core.instance.dispatchEvent(e);
            sound.dispatchEvent(e);
        }
        var actx, xhr;
        if (canPlay === 'maybe' || canPlay === 'probably') {
            actx = enchant.WebAudioSound.audioContext;
            xhr = new XMLHttpRequest();
            xhr.open('GET', src, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function() {
                actx.decodeAudioData(xhr.response, function(buffer) {
                    sound.buffer = buffer;
                    sound.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
                }, dispatchErrorEvent);
            };
            xhr.onerror = dispatchErrorEvent;
            xhr.send(null);
        } else {
            setTimeout(dispatchErrorEvent,  50);
        }
        return sound;
    };
    
    enchant.Sound = window.AudioContext && enchant.ENV.USE_WEBAUDIO ? enchant.WebAudioSound : enchant.DOMSound;
    
    /*
     * ============================================================================================
     * Easing Equations v2.0
     * September 1, 2003
     * (c) 2003 Robert Penner, all rights reserved.
     * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
     * ============================================================================================
     */
    
    /**
     * @namespace
     [lang:ja]
     * イージング関数ライブラリ.
     * {@link enchant.Easing} 以下にある関数は全て t(現在の時刻), b(初期値), c(変化後の値), d(値の変化にかける時間) の引数を取り, 指定した時刻に取る値を返す.
     * ActionScript で広く使われている Robert Penner による Easing Equations を JavaScript に移植した.
     [/lang]
     [lang:en]
     * JavaScript translation of Robert Penner's "Easing Equations" library which is widely used in ActionScript.
     * 
     * @param [t] the current time
     * @param [b] the property's initial value
     * @param [c] how much the value should change
     * @param [d] how much time should elapse before value is changed
     * 
     * @return {Number}
     [/lang]
     [lang:de]
     [/lang]
     * <br/>
     * See: <a href="http://www.robertpenner.com/easing/">
     * http://www.robertpenner.com/easing/</a>
     * <br/>
     * See: <a href="http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf">
     * http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf</a>
     */
    enchant.Easing = {
        LINEAR: function(t, b, c, d) {
            return c * t / d + b;
        },
    
        SWING: function(t, b, c, d) {
            return c * (0.5 - Math.cos(((t / d) * Math.PI)) / 2) + b;
        },
    
        // *** quad
        QUAD_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
    
        QUAD_EASEOUT: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
    
        QUAD_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
    
        // *** cubic
        CUBIC_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
    
        CUBIC_EASEOUT: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
    
        CUBIC_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
    
        // *** quart
        QUART_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
    
        QUART_EASEOUT: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
    
        QUART_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t + b;
            }
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
    
        // *** quint
        QUINT_EASEIN: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
    
        QUINT_EASEOUT: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
    
        QUINT_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
    
        // *** sin
        SIN_EASEIN: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
    
        SIN_EASEOUT: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
    
        SIN_EASEINOUT: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
    
        // *** circ
        CIRC_EASEIN: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
    
        CIRC_EASEOUT: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
    
        CIRC_EASEINOUT: function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
    
        // *** elastic
        ELASTIC_EASEIN: function(t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ((t /= d) === 1) {
                return b + c;
            }
    
            if (!p) {
                p = d * 0.3;
            }
    
            var s;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
    
        ELASTIC_EASEOUT: function(t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ((t /= d) === 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            var s;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
    
        ELASTIC_EASEINOUT: function(t, b, c, d, a, p) {
            if (t === 0) {
                return b;
            }
            if ((t /= d / 2) === 2) {
                return b + c;
            }
            if (!p) {
                p = d * (0.3 * 1.5);
            }
            var s;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
    
        // *** bounce
        BOUNCE_EASEOUT: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
    
        BOUNCE_EASEIN: function(t, b, c, d) {
            return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
        },
    
        BOUNCE_EASEINOUT: function(t, b, c, d) {
            if (t < d / 2) {
                return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * 0.5 + b;
            } else {
                return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
    
        },
    
        // *** back
        BACK_EASEIN: function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
    
        BACK_EASEOUT: function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
    
        BACK_EASEINOUT: function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
    
        // *** expo
        EXPO_EASEIN: function(t, b, c, d) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
    
        EXPO_EASEOUT: function(t, b, c, d) {
            return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
    
        EXPO_EASEINOUT: function(t, b, c, d) {
            if (t === 0) {
                return b;
            }
            if (t === d) {
                return b + c;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };
    
    /**
     * @scope enchant.ActionEventTarget.prototype
     */
    enchant.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.ActionEventTarget
         * @class
         [lang:ja]
         * timelineの {@link enchant.Action} クラス向けに拡張された {@link enchant.EventTarget} クラス.
         [/lang]
         [lang:en]
         * EventTarget which can change the context of event listeners.
         [/lang]
         [lang:de]
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function() {
            enchant.EventTarget.apply(this, arguments);
        },
        dispatchEvent: function(e) {
            var target = this.node ? this.node : this;
    
            e.target = target;
            e.localX = e.x - target._offsetX;
            e.localY = e.y - target._offsetY;
    
            if (this['on' + e.type] != null) {
                this['on' + e.type].call(target, e);
            }
            var listeners = this._listeners[e.type];
            if (listeners != null) {
                listeners = listeners.slice();
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(target, e);
                }
            }
        }
    });
    
    /**
     * @scope enchant.Timeline.prototype
     */
    enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Timeline
         * @class
         [lang:ja]
         * アニメーションを管理するためのクラス.
         *
         * 操作するノードひとつに対して, 必ずひとつのタイムラインが対応する.
         * タイムラインクラスは, 自身に様々なアクションを追加するメソッドを持っており,
         * これらを使うことで簡潔にアニメーションや様々な操作をすることができる.
         * タイムラインクラスはフレームとタイムのアニメーションができる.
         * @param {enchant.Node} node 操作の対象となるノード.
         [/lang]
         [lang:en]
         * Time-line class.
         * Class for managing the action.
         *
         * For one node to manipulate the timeline of one must correspond.
         * Time-line class has a method to add a variety of actions to himself,
         * entities can be animated and various operations by using these briefly.
         * You can choose time based and frame based(default) animation.
         * @param {enchant.Node} node target node.
         [/lang]
         [lang:de]
         * @param {enchant.Node} node
         [/lang]
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(node) {
            enchant.EventTarget.call(this);
            this.node = node;
            this.queue = [];
            this.paused = false;
            this.looped = false;
            this.isFrameBased = true;
            this._parallel = null;
            this._activated = false;
            this.addEventListener(enchant.Event.ENTER_FRAME, this._onenterframe);
    
            var tl = this;
            this._nodeEventListener = function(e) {
                tl.dispatchEvent(e);
            };
        },
        /**
         * @private
         */
        _deactivateTimeline: function() {
            if (this._activated) {
                this._activated = false;
                this.node.removeEventListener('enterframe', this._nodeEventListener);
            }
        },
        /**
         * @private
         */
        _activateTimeline: function() {
            if (!this._activated && !this.paused) {
                this.node.addEventListener("enterframe", this._nodeEventListener);
                this._activated = true;
            }
        },
        /**
         * @private
         */
        _onenterframe: function(evt) {
            if (this.paused) {
                return;
            }
    
            this.tick(this.isFrameBased ? 1 : evt.elapsed);
        },
        /**
         [lang:ja]
         * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに一つの時間単位になる. （デフォルト）
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         */
        setFrameBased: function() {
            this.isFrameBased = true;
        },
        /**
         [lang:ja]
         * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに前のフレームから経過した時間になる.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         */
        setTimeBased: function() {
            this.isFrameBased = false;
        },
        /**
         [lang:ja]
         * キューの先頭にあるアクションを終了し, 次のアクションへ移行する.
         * アクションの中から呼び出されるが, 外から呼び出すこともできる.
         *
         * アクション実行中に, アクションが終了した場合,
         * もう一度 tick() 関数が呼ばれるため, 1フレームに複数のアクションが処理される場合もある.
         *
         * @example
         * sprite.tl.then(function A(){ .. }).then(function B(){ .. });
         * // 最初のフレームで A・B の関数どちらも実行される.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         */
        next: function(remainingTime) {
            var e, action = this.queue.shift();
    
            if (action) {
                e = new enchant.Event("actionend");
                e.timeline = this;
                action.dispatchEvent(e);
    
                e = new enchant.Event("removedfromtimeline");
                e.timeline = this;
                action.dispatchEvent(e);
    
                if (this.looped) {
                    this.add(action);
                }
            }
    
            if (this.queue.length === 0) {
                this._deactivateTimeline();
                return;
            }
    
            if (remainingTime > 0 || (this.queue[0] && this.queue[0].time === 0)) {
                var event = new enchant.Event("actiontick");
                event.elapsed = remainingTime;
                event.timeline = this;
                this.queue[0].dispatchEvent(event);
            }
        },
        /**
         [lang:ja]
         * Timelineの時間を進める.
         * (キューの先頭にあるアクションに対して, actionstart/actiontickイベントを発行する)
         * @param {Number} elapsed 経過させる時間.
         [/lang]
         [lang:en]
         * @param {Number} elapsed
         [/lang]
         [lang:de]
         * @param {Number} elapsed
         [/lang]
         */
        tick: function(elapsed) {
            if (this.queue.length > 0) {
                var action = this.queue[0];
                if (action.frame === 0) {
                    var f;
                    f = new enchant.Event("actionstart");
                    f.timeline = this;
                    action.dispatchEvent(f);
                }
    
                var e = new enchant.Event("actiontick");
                e.timeline = this;
                e.elapsed = elapsed;
                action.dispatchEvent(e);
            }
        },
        /**
         [lang:ja]
         * タイムラインにアクションを追加する.
         * @param {enchant.Action} action 追加するアクション.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {enchant.Action} action
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {enchant.Action} action
         * @return {enchant.Timeline}
         [/lang]
         */
        add: function(action) {
            this._activateTimeline();
            if (this._parallel) {
                this._parallel.actions.push(action);
                this._parallel = null;
            } else {
                this.queue.push(action);
            }
            action.frame = 0;
    
            var e = new enchant.Event("addedtotimeline");
            e.timeline = this;
            action.dispatchEvent(e);
    
            e = new enchant.Event("actionadded");
            e.action = action;
            this.dispatchEvent(e);
    
            return this;
        },
        /**
         [lang:ja]
         * アクションを簡単に追加するためのメソッド.
         * 実体は {@link enchant.Timeline#add} のラッパ.
         * @param {Object} params アクションの設定オブジェクト.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Object} params
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Object} params
         * @return {enchant.Timeline}
         [/lang]
         */
        action: function(params) {
            return this.add(new enchant.Action(params));
        },
        /**
         [lang:ja]
         * トゥイーンを簡単に追加するためのメソッド.
         * 実体は {@link enchant.Timeline#add} のラッパ.
         * @param {Object} params トゥイーンの設定オブジェクト.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Object} params
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Object} params
         * @return {enchant.Timeline}
         [/lang]
         */
        tween: function(params) {
            return this.add(new enchant.Tween(params));
        },
        /**
         [lang:ja]
         * タイムラインのキューをすべて破棄する. 終了イベントは発行されない.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        clear: function() {
            var e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
    
            for (var i = 0, len = this.queue.length; i < len; i++) {
                this.queue[i].dispatchEvent(e);
            }
            this.queue = [];
            this._deactivateTimeline();
            return this;
        },
        /**
         [lang:ja]
         * タイムラインを早送りする.
         * 指定したフレーム数が経過したのと同様の処理を, 瞬時に実行する.
         * 巻き戻しはできない.
         * @param {Number} frames スキップするフレーム数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} frames
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} frames
         * @return {enchant.Timeline}
         [/lang]
         */
        skip: function(frames) {
            var event = new enchant.Event("enterframe");
            if (this.isFrameBased) {
                event.elapsed = 1;
            } else {
                event.elapsed = frames;
                frames = 1;
            }
            while (frames--) {
                this.dispatchEvent(event);
            }
            return this;
        },
        /**
         [lang:ja]
         * タイムラインの実行を一時停止する.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        pause: function() {
            if (!this.paused) {
                this.paused = true;
                this._deactivateTimeline();
            }
            return this;
        },
        /**
         [lang:ja]
         * タイムラインの実行を再開する.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        resume: function() {
            if (this.paused) {
                this.paused = false;
                this._activateTimeline();
            }
            return this;
        },
        /**
         [lang:ja]
         * タイムラインをループさせる.
         * ループしているときに終了したアクションは, タイムラインから取り除かれた後,
         * 再度タイムラインに追加される. このアクションは, ループが解除されても残る.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        loop: function() {
            this.looped = true;
            return this;
        },
        /**
         [lang:ja]
         * タイムラインのループを解除する.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        unloop: function() {
            this.looped = false;
            return this;
        },
        /**
         [lang:ja]
         * 指定したフレーム数だけ待ち, 何もしないアクションを追加する.
         * @param {Number} time 待機するフレーム数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} time
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} time
         * @return {enchant.Timeline}
         [/lang]
         */
        delay: function(time) {
            return this.action({
                time: time
            });
        },
        /**
         * @ignore
         * @param {Number} time
         */
        wait: function(time) {
            // reserved
            return this;
        },
        /**
         [lang:ja]
         * 関数を実行し, 即時に次のアクションに移るアクションを追加する.
         * @param {Function} func 実行する関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Function} func
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Function} func
         * @return {enchant.Timeline}
         [/lang]
         */
        then: function(func) {
            return this.action({
                onactiontick: function(evt) {
                    func.call(this);
                },
                // if time is 0, next action will be immediately executed
                time: 0
            });
        },
        /**
         [lang:ja]
         * 関数を実行し, 即時に次のアクションに移るアクションを追加する.
         * {@link enchant.Timeline#then} のシノニム.
         * @param {Function} func 実行する関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Function} func
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Function} func
         * @return {enchant.Timeline}
         [/lang]
         */
        exec: function(func) {
            return this.then(func);
        },
        /**
         [lang:ja]
         * 実行したい関数を, フレーム数をキーとした連想配列(オブジェクト)で複数指定し追加する.
         * 内部的には {@link enchant.Timeline#delay}, {@link enchant.Timeline#then} を用いている.
         *
         * @example
         * sprite.tl.cue({
         *     10: function() {}, // 10フレーム経過した後に実行される関数
         *     20: function() {}, // 20フレーム経過した後に実行される関数
         *     30: function() {}  // 30フレーム経過した後に実行される関数
         * });
         *
         * @param {Object} cue キューオブジェクト.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Object} cue
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Object} cue
         * @return {enchant.Timeline}
         [/lang]
         */
        cue: function(cue) {
            var ptr = 0;
            for (var frame in cue) {
                if (cue.hasOwnProperty(frame)) {
                    this.delay(frame - ptr);
                    this.then(cue[frame]);
                    ptr = frame;
                }
            }
            return this;
        },
        /**
         [lang:ja]
         * ある関数を指定したフレーム数繰り返し実行するアクションを追加する.
         * @param {Function} func 実行したい関数.
         * @param {Number} time 持続フレーム数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Function} func
         * @param {Number} time
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Function} func
         * @param {Number} time
         * @return {enchant.Timeline}
         [/lang]
         */
        repeat: function(func, time) {
            return this.action({
                onactiontick: function(evt) {
                    func.call(this);
                },
                time: time
            });
        },
        /**
         [lang:ja]
         * 複数のアクションを並列で実行したいときに指定する.
         * and で結ばれたすべてのアクションが終了するまで次のアクションには移行しない.
         *
         * @example
         * sprite.tl.fadeIn(30).and().rotateBy(360, 30);
         *
         * // 30フレームでフェードインしながら360度回転する.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        and: function() {
            var last = this.queue.pop();
            if (last instanceof enchant.ParallelAction) {
                this._parallel = last;
                this.queue.push(last);
            } else {
                var parallel = new enchant.ParallelAction();
                parallel.actions.push(last);
                this.queue.push(parallel);
                this._parallel = parallel;
            }
            return this;
        },
        /**
         * @ignore
         */
        or: function() {
            return this;
        },
        /**
         * @ignore
         */
        doAll: function(children) {
            return this;
        },
        /**
         * @ignore
         */
        waitAll: function() {
            return this;
        },
        /**
         [lang:ja]
         * trueが返るまで, 関数を毎フレーム実行するアクションを追加する.
         *
         * @example
         * sprite.tl.waitUntil(function() {
         *     return --this.x < 0;
         * }).then(function(){ .. });
         * // x座標が負になるまで毎フレームx座標を減算し続ける.
         *
         * @param {Function} func 条件とする関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Function} func
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Function} func
         * @return {enchant.Timeline}
         [/lang]
         */
        waitUntil: function(func) {
            return this.action({
                onactiontick: function(evt) {
                    if (func.call(this)) {
                        evt.timeline.next();
                    }
                }
            });
        },
        /**
         [lang:ja]
         * Entityの不透明度をなめらかに変えるアクションを追加する.
         * @param {Number} opacity 目標の不透明度.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} opacity
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} opacity
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        fadeTo: function(opacity, time, easing) {
            return this.tween({
                opacity: opacity,
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityをフェードインするアクションを追加する.
         * fadeTo(1, time, easing) のエイリアス.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        fadeIn: function(time, easing) {
            return this.fadeTo(1, time, easing);
        },
        /**
         [lang:ja]
         * Entityをフェードアウトするアクションを追加する.
         * fadeTo(1, time, easing) のエイリアス.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        fadeOut: function(time, easing) {
            return this.fadeTo(0, time, easing);
        },
        /**
         [lang:ja]
         * Entityの位置をなめらかに移動させるアクションを追加する.
         * @param {Number} x 目標のx座標.
         * @param {Number} y 目標のy座標.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} x
         * @param {Number} y
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} x
         * @param {Number} y
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        moveTo: function(x, y, time, easing) {
            return this.tween({
                x: x,
                y: y,
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityのx座標をなめらかに移動させるアクションを追加する.
         * @param {Number} x 目標のx座標.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} x
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} x
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        moveX: function(x, time, easing) {
            return this.tween({
                x: x,
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityのy座標をなめらかに移動させるアクションを追加する.
         * @param {Number} y 目標のy座標.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} y
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} y
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        moveY: function(y, time, easing) {
            return this.tween({
                y: y,
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityの位置をなめらかに変化させるアクションを追加する.
         * 座標は, アクション開始時からの相対座標で指定する.
         * @param {Number} x x軸方向の移動量.
         * @param {Number} y y軸方向の移動量.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} x
         * @param {Number} y
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} x
         * @param {Number} y
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        moveBy: function(x, y, time, easing) {
            return this.tween({
                x: function() {
                    return this.x + x;
                },
                y: function() {
                    return this.y + y;
                },
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityの不透明度を0にする. (即時)
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        hide: function() {
            return this.then(function() {
                this.opacity = 0;
            });
        },
        /**
         [lang:ja]
         * Entityの不透明度を1にする. (即時)
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        show: function() {
            return this.then(function() {
                this.opacity = 1;
            });
        },
        /**
         [lang:ja]
         * Entityをシーンから削除する.
         * シーンから削除された場合,  enterframe イベントは呼ばれなくなるので,
         * タイムラインも止まることに注意.
         * これ以降のアクションは, 再度シーンに追加されるまで実行されない.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @return {enchant.Timeline}
         [/lang]
         */
        removeFromScene: function() {
            return this.then(function() {
                this.parentNode.removeChild(this);
            });
        },
        /**
         [lang:ja]
         * Entityをなめらかに拡大・縮小するアクションを追加する.
         * @param {Number} scaleX x軸方向の縮尺.
         * @param {Number} [scaleY] y軸方向の縮尺. 省略した場合 scaleX と同じ.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} scaleX
         * @param {Number} [scaleY]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} scaleX
         * @param {Number} [scaleY]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        scaleTo: function(scale, time, easing) {
            var scaleX, scaleY;
    
            if (typeof easing === "number") {
                scaleX = arguments[0];
                scaleY = arguments[1];
                time = arguments[2];
                easing = arguments[3];
            } else {
                scaleX = scaleY = scale;
            }
    
            return this.tween({
                scaleX: scaleX,
                scaleY: scaleY,
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityをなめらかに拡大・縮小させるアクションを追加する.
         * 相対縮尺 (アクション開始時の縮尺のn倍) で指定する.
         * @param {Number} scaleX x軸方向の相対縮尺.
         * @param {Number} [scaleY] y軸方向の相対縮尺. 省略した場合 scaleX と同じ.
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} scaleX
         * @param {Number} [scaleY]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} scaleX
         * @param {Number} [scaleY]
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        scaleBy: function(scale, time, easing) {
            var scaleX, scaleY;
    
            if (typeof easing === "number") {
                scaleX = arguments[0];
                scaleY = arguments[1];
                time = arguments[2];
                easing = arguments[3];
            } else {
                scaleX = scaleY = scale;
            }
    
            return this.tween({
                scaleX: function() {
                    return this.scaleX * scaleX;
                },
                scaleY: function() {
                    return this.scaleY * scaleY;
                },
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityをなめらかに回転させるアクションを追加する.
         * @param {Number} deg 目標の回転角度. (度数法)
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} deg
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} deg
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        rotateTo: function(deg, time, easing) {
            return this.tween({
                rotation: deg,
                time: time,
                easing: easing
            });
        },
        /**
         [lang:ja]
         * Entityをなめらかに回転させるアクションを追加する.
         * 角度は相対角度 (アクション開始時の角度から更にn度) で指定する.
         * @param {Number} deg 目標の相対角度. (度数法)
         * @param {Number} time フレーム数.
         * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
         * @return {enchant.Timeline} 自身.
         [/lang]
         [lang:en]
         * @param {Number} deg
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         [lang:de]
         * @param {Number} deg
         * @param {Number} time
         * @param {Function} [easing=enchant.Easing.LINEAR]
         * @return {enchant.Timeline}
         [/lang]
         */
        rotateBy: function(deg, time, easing) {
            return this.tween({
                rotation: function() {
                    return this.rotation + deg;
                },
                time: time,
                easing: easing
            });
        }
    });
    
    /**
     * @scope enchant.Action.prototype
     */
    enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
        /**
         * @name enchant.Action
         * @class
         [lang:ja]
         * アニメーションタイムラインを構成する, 実行したい処理を指定するためのクラス.
         *
         * タイムラインに追加されたアクションは順に実行される.
         * アクションが開始・終了された時に actionstart, actionend イベントが発行され,
         * また1フレーム経過した時には actiontick イベントが発行される.
         * これらのイベントのリスナとして実行したい処理を指定する.
         *
         * time で指定されたフレーム数が経過すると自動的に次のアクションに移行するが,
         * null が指定されると, タイムラインの next メソッドが呼ばれるまで移行しない.
         * @param {Object} param
         * @param {Number} [param.time] アクションが持続するフレーム数. null が指定されると無限長.
         * @param {Function} [param.onactionstart] アクションが開始される時のイベントリスナ.
         * @param {Function} [param.onactiontick] アクションが1フレーム経過するときのイベントリスナ.
         * @param {Function} [param.onactionend] アクションがが終了する時のイベントリスナ.
         [/lang]
         [lang:en]
         * Actions are units that make up the timeline.
         * It is a unit used to specify the action you want to perform.
         * 
         * Actions that have been added to the timeline are performed in sequential order.
         * The transition from one action to the next occurs automatically 
         * after the number of frames specified by the time parameter have elapsed.
         *
         * An actionstart event is fired when the action has started.
         * An actionend event is fired when the action has stopped.
         * For each frame that elapses, an actiontick event is fired.
         * 
         * You can specify a listener for these events to perform specific events when they occur.
         *
         * @param {Object} param
         * @param {Number} [param.time] The number of frames that the action will persist. For an infinite number set this to null.
         * @param {Function} [param.onactionstart] Event listener for when the action is initiated.
         * @param {Function} [param.onactiontick] Event listener for when the action has passed one frame.
         * @param {Function} [param.onactionend] Event listener for when the action is finished.
         [/lang]
         [lang:de]
         * @param {Object} param
         * @param {Number} [param.time]
         * @param {Function} [param.onactionstart]
         * @param {Function} [param.onactiontick]
         * @param {Function} [param.onactionend]
         [/lang]
         * @constructs
         * @extends enchant.ActionEventTarget
         */
        initialize: function(param) {
            enchant.ActionEventTarget.call(this);
            this.time = null;
            this.frame = 0;
            for (var key in param) {
                if (param.hasOwnProperty(key)) {
                    if (param[key] != null) {
                        this[key] = param[key];
                    }
                }
            }
            var action = this;
    
            this.timeline = null;
            this.node = null;
    
            this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
                action.timeline = evt.timeline;
                action.node = evt.timeline.node;
                action.frame = 0;
            });
    
            this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
                action.timeline = null;
                action.node = null;
                action.frame = 0;
            });
    
            this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
                var remaining = action.time - (action.frame + evt.elapsed);
                if (action.time != null && remaining <= 0) {
                    action.frame = action.time;
                    evt.timeline.next(-remaining);
                } else {
                    action.frame += evt.elapsed;
                }
            });
    
        }
    });
    
    /**
     * @scope enchant.ParallelAction.prototype
     */
    enchant.ParallelAction = enchant.Class.create(enchant.Action, {
        /**
         * @name enchant.ParallelAction
         * @class
         [lang:ja]
         * アクションを並列で実行するためのアクション.
         * 子アクションを複数持つことができる.
         [/lang]
         [lang:en]
         * Actions to be executed in parallel.
         * It's possible to have more than one child action.
         [/lang]
         [lang:de]
         [/lang]
         * @constructs
         * @extends enchant.Action
         */
        initialize: function(param) {
            enchant.Action.call(this, param);
            /**
             [lang:ja]
             * 子アクション.
             [/lang]
             [lang:en]
             * Children Actions.
             [/lang]
             [lang:de]
             [/lang]
             * @type enchant.Action[]
             */
            this.actions = [];
            /**
             [lang:ja]
             * 実行が終了したアクション.
             [/lang]
             [lang:en]
             * Removed actions.
             [/lang]
             [lang:de]
             [/lang]
             * @type enchant.Action[]
             */
            this.endedActions = [];
            var that = this;
    
            this.addEventListener(enchant.Event.ACTION_START, function(evt) {
                for (var i = 0, len = that.actions.length; i < len; i++) {
                    that.actions[i].dispatchEvent(evt);
                }
            });
    
            this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
                var i, len, timeline = {
                    next: function(remaining) {
                        var action = that.actions[i];
                        that.actions.splice(i--, 1);
                        len = that.actions.length;
                        that.endedActions.push(action);
    
                        var e = new enchant.Event("actionend");
                        e.timeline = this;
                        action.dispatchEvent(e);
    
                        e = new enchant.Event("removedfromtimeline");
                        e.timeline = this;
                        action.dispatchEvent(e);
                    }
                };
    
                var e = new enchant.Event("actiontick");
                e.timeline = timeline;
                e.elapsed = evt.elapsed;
                for (i = 0, len = that.actions.length; i < len; i++) {
                    that.actions[i].dispatchEvent(e);
                }
    
                if (that.actions.length === 0) {
                    evt.timeline.next();
                }
            });
    
            this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
                for (var i = 0, len = that.actions.length; i < len; i++) {
                    that.actions[i].dispatchEvent(evt);
                }
            });
    
            this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
                that.actions = that.endedActions;
                that.endedActions = [];
            });
    
        }
    });
    
    /**
     * @scope enchant.Tween.prototype
     */
    enchant.Tween = enchant.Class.create(enchant.Action, {
        /**
         * @name enchant.Tween
         * @class
         [lang:ja]
         * オブジェクトの特定のプロパティを, なめらかに変更したい時に用いるためのアクションクラス.
         * アクションを扱いやすく拡張したクラス.
         *
         * コンストラクタに渡す設定オブジェクトに, プロパティの目標値を指定すると,
         * アクションが実行された時に, 目標値までなめらかに値を変更するようなアクションを生成する.
         *
         * トゥイーンのイージングも, easing プロパティで指定できる.
         *
         * @param {Object} params
         * @param {Number} params.time アニメーションにかける時間.
         * @param {Function} [params.easing=enchant.Easing.LINEAR] イージング関数.
         [/lang]
         [lang:en]
         * @param {Object} params
         * @param {Number} params.time
         * @param {Function} [params.easing=enchant.Easing.LINEAR]
         [/lang]
         [lang:de]
         * @param {Object} params
         * @param {Number} params.time
         * @param {Function} [params.easing=enchant.Easing.LINEAR]
         [/lang]
         * @constructs
         * @extends enchant.Action
         */
        initialize: function(params) {
            var origin = {};
            var target = {};
            enchant.Action.call(this, params);
    
            if (this.easing == null) {
                this.easing = enchant.Easing.LINEAR;
            }
    
            var tween = this;
            this.addEventListener(enchant.Event.ACTION_START, function() {
                // excepted property
                var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
                for (var prop in params) {
                    if (params.hasOwnProperty(prop)) {
                        // if function is used instead of numerical value, evaluate it
                        var target_val;
                        if (typeof params[prop] === "function") {
                            target_val = params[prop].call(tween.node);
                        } else {
                            target_val = params[prop];
                        }
    
                        if (excepted.indexOf(prop) === -1) {
                            origin[prop] = tween.node[prop];
                            target[prop] = target_val;
                        }
                    }
                }
            });
    
            this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
                // if time is 0, set property to target value immediately
                var ratio = tween.time === 0 ? 1 : tween.easing(Math.min(tween.time,tween.frame + evt.elapsed), 0, 1, tween.time) - tween.easing(tween.frame, 0, 1, tween.time);
    
                for (var prop in target){
                    if (target.hasOwnProperty(prop)) {
                        if (typeof this[prop] === "undefined"){
                            continue;
                        }
                        tween.node[prop] += (target[prop] - origin[prop]) * ratio;
                        if (Math.abs(tween.node[prop]) < 10e-8){
                            tween.node[prop] = 0;
                        }
                    }
                }
            });
        }
    });
    
    }(window));
    