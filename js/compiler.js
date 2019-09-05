// 编译节点最终调用的函数
function Compiler(node, vm) {
    this.$node = this.isElementNode(node) ? node : document.querySelector(node);

    if (this.$node) {
        // 为提高效率，创建文档碎片
        this.$fragment = this.node2Fragment(this.$node);

        // 编译元素节点
        this.init(this.$fragment, vm);

        // 将编译完成的节点传入DOM结构
        this.$node.appendChild(this.$fragment)
    }
}

Compiler.prototype = {
    constructor: Compiler,
    node2Fragment: function (node) {
        let fragment = document.createDocumentFragment();
        
        while (node.firstChild) {
            fragment.appendChild(node.firstChild);
        }
        
        return fragment;
    },
    init: function (nodes, vm) {
        let childNodes = nodes.childNodes;
        // 匹配小胡子语法
        let reg = /\{\{(.*)\}\}/;

        ([]).slice.call(childNodes).forEach(node => {
            // 节点的文本内容
            let text = node.textContent;

            // todo 将这些操作抽离出来
            // todo 无法处理嵌套数据的情况
            // todo 将对应watcher添加到对应的dep中的？？ 闭包
            // 若节点是文本类型且存在小胡子语法，替换其中的变量
            if (this.isTextNode(node) && reg.test(text)) {
                let exp = text.match(reg)[1];

                // 将小胡子语法替换为数据
                this.textUpdateFn(node, exp, vm);

                // 创建订阅者
                new Watcher(node, exp, vm, this.textUpdateFn);
            } else if (this.isElementNode(node)) {
            // 若节点是元素类型，检查是否有内置命令属性
                let attributes = node.attributes;

                for (let attr of attributes) {
                    // 暂时只实现v-model指令
                    if (attr.name === 'v-model') {
                        let exp = attr.value;

                        // 执行更新函数
                        this.inputUpdateFn(node, exp, vm);

                        // 创建订阅者
                        new Watcher(node, exp, vm, this.inputUpdateFn);

                        // 为节点添加input属性
                        node.addEventListener('input', (e) => {
                            vm[exp] = e.target.value
                        })
                        
                        // 移除属性
                        node.removeAttribute('v-model')
                    }
                }
            }

            // 若存在子节点，递归进行编译
            if (node.childNodes.length > 0) {
                this.init(node, vm)
            }
        });
    },
    isElementNode: function (node) {
        return node.nodeType === 1;
    },
    isTextNode: function (node) {
        return node.nodeType === 3;
    },
    textUpdateFn: function (node, exp, vm) {
        node.textContent = vm[exp];
    },
    inputUpdateFn: function (node, exp, vm) {
        node.value = vm[exp];
    }
}