function Watcher(node, exp, vm, update) {
    // 触发get，将当前Watcher添加到Dep中
    Dep.target = this;
    this.value = vm[exp];
    Dep.target = null;

    this.update = () => {
        update(node, exp, vm)
    };
}

Watcher.prototype = {
    constructor: Watcher,
}