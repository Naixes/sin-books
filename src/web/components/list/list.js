const list = {
    init() {
        // 由于是动态创建的dom，需要代理到document，否则跳转之后不能触发，vue/react也都是这样的，都将事件绑定到了document，最新的react改为绑定到root上了
        $(document).on('click', '#js-btn', function() {
            alert('测试')
        })
    }
}

export default list