# dragView
Jquery可视化拖拽，网页布局拖拽插件

Demo:[https://itanhang.github.io/dragView](https://itanhang.github.io/dragView)

### HTML代码
> **说明：** dragView_panel 是内容可视化区域（可视化必须），drag_module 是板块内容层，网站实际代码房在div尾部
``` html
<div class="dragView_panel">
    <div class="drag_module">
        <div class="drag_module_mask"></div>
        <div class="drag_module_head"></div>
        <div class="drag_module_btn">
            <a class="btn-delete">删除</a><a class="btn-edit">编辑</a>
        </div>
        <!-- 板块代码 -->
    </div>
</div>
```