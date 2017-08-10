# dragView
Jquery可视化拖拽，网页布局拖拽插件

Demo : [https://itanhang.github.io/dragView](https://itanhang.github.io/dragView)

#### HTML实例
``` html
<div class="dragView_panel">
    <div class="drag_module">
        <div class="drag_module_mask"></div>
        <div class="drag_module_head"></div>
        <div class="drag_module_btn">
            <a class="btn-delete">删除</a><a class="btn-edit">编辑</a>
        </div>
        <!-- 网页板块代码 -->
    </div>
</div>
```

#### JS初始化
``` javascript
dragView.init({
    item: 'view-box',           //拖拽模板Class
    panel: 'dragView_panel',
    module: 'drag_module'
});
```
