// 调用该函数创建观察者实例
function observer(data) {
    // 若data对象是简单类型值，则不创建新的观察者
    if (!data || typeof data !== 'object') return;

    return new Observer(data);
}

function Observer(data) {
    this.data = data;

    // 为data对象每个属性设置特性
    Object.keys(data).forEach(key => {
        this._defineReactive(data, key, data[key])
    })
}

Observer.prototype = {
    constructor: Observer,
    _defineReactive: (obj, key, value) => {
        // 为值创建观察者
        observer(value);

        // 创建当前值对应的订阅者列表实例
        let dep = new Dep();

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: false,
            get: function () {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }

                return value;
            },
            // set仅仅用于执行额外操作，其返回值并不重要
            set: function (newVal) {
                let oldVal = value;

                if (oldVal === newVal) {
                    return;
                }
                
                observer(value);

                // 这里不能设置data[key] = newVal，因为对data[key]的访问会造成栈溢出
                // 只能利用value保存新的值
                value = newVal;
                // 通知订阅器，变化已发生
                dep.notify();
            }
        })
    }
}

let uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.target = null;

Dep.prototype = {
    constructor: Dep,
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        for (let watcher of this.subs) {
            // 执行订阅者绑定的更新函数
            watcher.update();
        }
    }
}