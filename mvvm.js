function MVVM($options) {
    this.$options = $options;
    let data = this._data = $options.data || {};
    
    // 属性代理，实现vm.data.xxx -> vm.data
    Object.keys(data).forEach((key) => {
        this._proxyData(key);
    })
}

MVVM.prototype = {
    constructor: MVVM,
}