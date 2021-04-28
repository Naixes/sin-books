// 编写自己的库

// 闭包，函数作用域隔离
(function() {
    // 判断执行环境
    // globalThis统一环境
    var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this || {};
  
    // 核心 
    // 构造安全的构造函数
    var _ = function(obj) {
        // 是_实例
        if (obj instanceof _) return obj;
        // this不是_实例，创建实例
        if (!(this instanceof _)) return new _(obj);
        // 不满足前两个条件，记录到wrapped上
        this._wrapped = obj;
    };

    var ArrayProto = Array.prototype, ObjProto = Object.prototype;  var push = ArrayProto.push

    // 使用:
    // _.each([1,2,3], item => console.log(item))
    // _([1,2,3]).each(item => console.log(item))
    _.each = function(arr, fn) {
        for (let i = 0; i < arr.length; i++) {
            fn(arr[i], i)
        }
        return arr
    }
    // 第二种调用方式
    _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
    _.mixin = function(obj) {
        // 遍历所有方法，name方法名
        _.each(_.functions(obj), function(name) {
            // 扩展自定义方法
            var func = _[name] = obj[name];
            // 在原型链上，第二种调用方式实现的核心
            _.prototype[name] = function() {
                // 参数合并
                var args = [this._wrapped];
                // push.apply(args, arguments);
                // es6写法
                args.push(...arguments);
                // 链式调用
                // return chainResult(this, func.apply(_, args));
                return func.apply(_, args);
            };
        });
      return _;
    };
    _.mixin(_);

    _.getTime = function() {
        return + new Date()
    }

    // 节流函数，三个点：
    // 在一定时间内函数执行一次
    // 间隔时间内触发，在间隔时间末尾触发
    _.throttle = function(cb, t) {
        let first = true
        let execDate = _.getTime()
        let timeoutId = ''
        return function() {
            if(first) {
                // 第一次触发立即执行
                cb()
                execDate = _.getTime()
                first = false
            }else {
                const current = _.getTime()
                if(current - execDate >= t) {
                    cb()
                    execDate = _.getTime()
                }else {
                    timeoutId && clearTimeout(timeoutId)
                    const waitTime = t - (current - execDate)
                    timeoutId = setTimeout(() => {
                        cb()
                        execDate = _.getTime()
                    }, waitTime)
                }
            }
        }
    }

    // 全局挂载
    root._ = _
})()