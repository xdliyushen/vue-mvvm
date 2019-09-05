function MVVM(options) {
    this.$options = options;
    let data = this._data = options.data || {};
    let el = options.el || '';
    
    // 属性代理，实现vm.data.xxx -> vm.data
    this._proxyData(data);

    // 创建观察者
    observer(data);
    
    // 编译模板
    this.$compiler = new Compiler(el, this);
}

MVVM.prototype = {
    constructor: MVVM,
    _proxyData: function (data) {
        Object.keys(data).forEach(key => {
            // 这里的this指向要创建的实例，因为_proxyData函数是在构造函数中被调用的
            let vm = this;

            Object.defineProperty(vm, key, {
                enumerable: true, // 可枚举
                configurable: false, // 不可重复设置
                get: () => {
                    return vm._data[key]
                },
                set: (newVal) => {
                    let oldVal = vm._data[key];

                    if (oldVal === newVal) {
                        return;
                    }
                    
                    vm._data[key] = newVal;
                }
            })
        })
    }
}