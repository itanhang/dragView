/*
* dragView.JS
* Copyright 2017, tanhang
* Date: June 20 2017
*/
(function ($) {
    var config = {
        item: 'view-box',
        panel: 'dragView_panel',
        module: 'drag_module'
    },

        item, panel,
        tempClass, dashClass, maskClass, headClass, btnClass,
        //鼠标距离元素上边距离
        mouseY = 0,
        //拖拽对象偏移量 top:对象距离可视化区域上边距离
        range = { top: 0, y1: 0, y2: 0, y: 0 },
        lastPos = { y: 0 }, //拖拽对象的坐标
        tarPos = { y: 0 }, //目标元素对象的坐标初始化
        theDiv = null, move = false, //拖拽对象 拖拽状态
        theDivId = 0, theDivHeight = 0, theDivHalf = 0, tarFirstY = 0, //拖拽对象的索引、高度、的初始化。
        tarDiv = null, tarFirst = null, tempDiv = null; //要插入的目标元素的对象, 临时的虚线对象

    function loopModule() {
        $('.' + config.module).each(function () {
            var then = $(this);
            then.find('.btn-delete').unbind('click');
            then.find('.btn-delete').bind('click', function () {
                if (window.confirm('确定要删除此版块？')) {
                    $(this).parents('.' + config.module).remove()
                }
            });

            then.unbind('mouseover mouseout');
            then.bind('mouseover', function () {
                $(this).addClass('active');
            }).bind('mouseout', function () {
                $(this).removeClass('active');
            });

            then.find('.' + headClass).unbind('mousedown');
            then.find('.' + headClass).bind('mousedown', function (e) {
                if (move) return;
                e.preventDefault();

                //拖拽对象
                theDiv = $(this).parent();

                //鼠标元素相对偏移量
                mouseY = e.pageY - theDiv.offset().top;

                range.top = theDiv.offset().top - $(panel).offset().top;
                range.y1 = e.pageY;
                theDivId = theDiv.index();
                theDivHeight = theDiv.height();
                move = true;

                theDiv.attr('class', dashClass);
                theDiv.css({ top: range.top + 'px' });
                // 创建新元素 插入拖拽元素之前的位置(虚线框)
                $('<div class="' + tempClass + '"></div>').insertBefore(theDiv);
                tempDiv = $('.' + tempClass); //获得临时 虚线框的对象

                moduleSort();
            });
        });
    }

    function moduleAdd() {
        var dragActive = false,
            dragPanel = false,
            thisBox, viewHtml,
            viewPos = { x: 0, y: 0 },
            mousePos = { x: 0, y: 0, moveX: 0, moveY: 0 },
            dragViewPos = { x: 0, y: 0 },
            //临时拖拽层
            dragMask = $('<div id="drag-mask"></div>').appendTo('body'),
            dragView = $('<div id="drag-view"></div>').appendTo(dragMask);

        // >>> 添加板块
        $(item).mousedown(function (e) {
            e.preventDefault();
            dragActive = true;
            thisBox = $(this);

            viewPos.x = parseInt($(thisBox).offset().left) - parseInt($(document).scrollLeft());
            viewPos.y = parseInt($(thisBox).offset().top) - parseInt($(document).scrollTop());

            // ajax获取模板的 html
            viewHtml = `
          <div class="home-images">
          <div class="w clearfix">
              <div class="item first">
                  <a href="#"><img src="images/1.jpg" alt=""></a>
              </div>
              <div class="item">
                  <a href="#"><img src="images/2.jpg" alt=""></a>
              </div>
              <div class="item">
                  <a href="#"><img src="images/3.jpg" alt=""></a>
              </div>
              <div class="item">
                  <a href="#"><img src="images/4.jpg" alt=""></a>
              </div>
          </div>
          </div>`;

            $(thisBox).parent().addClass('active');

            $(dragView).show();
            $(dragMask).show();
            $(dragView).css({ 'top': viewPos.y, 'left': viewPos.x });
            $(dragView).html(viewHtml);

            //鼠标初始位置
            mousePos.x = e.pageX - parseInt($(document).scrollLeft());
            mousePos.y = e.pageY - parseInt($(document).scrollTop());

            //是否放入可视化区域
            dragPanel = false;

            $(document).mousemove(function (e) {
                if (!dragActive) return;
                e.preventDefault();

                //鼠标移动后的位置，和 mousePos.x mousePos.y 同时减去滚动条的距离 等于 相对窗口的距离
                mousePos.moveX = e.pageX - parseInt($(document).scrollLeft());
                mousePos.moveY = e.pageY - parseInt($(document).scrollTop());

                dragViewPos.x = viewPos.x + (mousePos.moveX - mousePos.x);
                dragViewPos.y = viewPos.y + (mousePos.moveY - mousePos.y);
                $(dragView).css({ 'top': dragViewPos.y, 'left': dragViewPos.x });

                mousePos.moveX = e.pageX;
                mousePos.moveY = e.pageY;

                //可视化区域位置
                var area = { x: panel.offset().left, y: panel.offset().top, w: panel.width(), h: panel.height() };

                //判断鼠标是否在可视化区域
                if (mousePos.moveX >= area.x && mousePos.moveX <= area.x + area.w && mousePos.moveY >= area.y && mousePos.moveY <= area.y + area.h) {
                    dragPanel = true;

                    //参考排序 查找插入目标元素
                    var $main = $('.' + config.module);

                    if ($main.length > 0) {
                        $main.each(function () {
                            tarDiv = $(this);
                            tarPos.y = tarDiv.offset().top;
                            theDivHalf = tarDiv.height() / 2;
                            //   tarPos.y1 = tarPos.y + theDivHalf;
                            tarFirst = $main.eq(0);
                            tarFirstHalf = tarFirst.height() / 2;
                            tarFirstY = tarFirst.offset().top + tarFirstHalf;

                            if (dragViewPos.y + parseInt($(document).scrollTop()) <= tarFirstY) {
                                if (tempDiv == null) {
                                    $('<div class="' + tempClass + '"></div>').insertBefore(tarFirst);
                                    tempDiv = $('.' + tempClass);
                                } else {
                                    tempDiv.insertBefore(tarFirst);
                                }
                                return false;
                            }

                            if (dragViewPos.y + parseInt($(document).scrollTop()) >= tarPos.y + theDivHalf) {
                                if (tempDiv == null) {
                                    $('<div class="' + tempClass + '"></div>').insertBefore(tarFirst);
                                    tempDiv = $('.' + tempClass);
                                } else {
                                    tempDiv.insertAfter(tarDiv);
                                }
                            }
                        })
                    } else {
                        if (tempDiv == null) {
                            $('<div class="' + tempClass + '"></div>').appendTo(panel);
                            tempDiv = $('.' + tempClass);
                        }
                    }

                } else {
                    dragPanel = false;
                    if (tempDiv != null) {
                        tempDiv.remove();
                        tempDiv = null;
                    }
                }

            }).mouseup(function (e) {
                if (!dragActive) return;
                e.preventDefault();
                dragActive = false;

                if (dragPanel) {
                    $('<div class="' + config.module + '"><div class="' + maskClass + '"></div><div class="' + headClass + '"></div><div class="' + btnClass + '"><a class="btn-delete" title="删除板块">删除</a><a class="btn-edit" title="编辑板块">编辑</a></div>' + viewHtml + '</div>').insertBefore(tempDiv);

                    dragPanel = false;
                    loopModule();
                }

                if (tempDiv != null) {
                    tempDiv.remove();
                    tempDiv == null;
                }

                //拖拽结束，还原
                $(dragView).hide();
                $(dragView).html('');
                $(dragMask).hide();
                $(thisBox).parent().removeClass('active');

                $(document).unbind('mousemove mouseup');
            })
        })
    }

    function moduleSort() {
        $(panel).mousemove(function (e) {
            if (!move) return;
            e.preventDefault();

            range.y2 = e.pageY;
            range.y = range.top + (range.y2 - range.y1);
            // 拖拽元素随鼠标移动
            theDiv.css({ top: range.y + 'px' });

            lastPos.y = e.pageY - mouseY;
            //  lastPos.y1 = lastPos.y + theDivHeight;
            // 拖拽元素随鼠标移动 查找插入目标元素
            var $main = $('.' + config.module); // 局部变量：按照重新排列过的顺序 再次获取 各个元素的坐标

            $main.each(function () {
                tarDiv = $(this);
                tarPos.y = tarDiv.offset().top;
                theDivHalf = tarDiv.height() / 2;
                //   tarPos.y1 = tarPos.y + theDivHalf;
                tarFirst = $main.eq(0); // 获得第一个元素
                tarFirstHalf = tarFirst.height() / 2;
                tarFirstY = tarFirst.offset().top + tarFirstHalf; // 第一个元素对象的中心纵坐标
                //拖拽对象 移动到第一个位置
                if (lastPos.y <= tarFirstY) {
                    tempDiv.insertBefore(tarFirst);
                    return false;
                }
                //判断要插入目标元素的 坐标后，直接插入
                if (lastPos.y >= tarPos.y + theDivHalf) {
                    tempDiv.insertAfter(tarDiv);
                }
            });
        }).mouseup(function () {
            if (theDiv == null) return;
            if (tempDiv != null) {
                theDiv.insertBefore(tempDiv); // 拖拽元素插入到 临时div的位置上
                tempDiv.remove();             // 删除新建的临时div
            }
            //初始化，恢复默认样式
            theDiv.attr("class", config.module);
            theDiv.css({ top: '0px' });
            theDiv = tempDiv = null;
            move = false;
        });
    }

    this.dragView = {
        init: function (options) {
            if (options) {
                for (var key in options) {
                    config[key] = options[key];
                }
            }

            item = $('.' + config.item);
            panel = $('.' + config.panel);

            tempClass = config.module + '_temp';
            dashClass = config.module + '_dash';
            maskClass = config.module + '_mask';
            headClass = config.module + '_head';
            btnClass = config.module + '_btn';

            loopModule();
            moduleAdd();

            return this;
        },
        opts: function () {
            return config;
        }
    }

})(jQuery)
