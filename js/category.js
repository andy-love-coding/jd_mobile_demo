// 入口函数
document.addEventListener('DOMContentLoaded', function (e) {
  // 左侧栏区域滚动
  // 1.使用 iscroll 插件，实现区域滚动的效果。
  // 2.下载 https://github.com/cubiq/iscroll ，引入
  // 3.注意：只能是一个父容器套一个子容器
  // 4.实现滚动效果的条件：子容器尺寸要大于父容器尺寸
  // 4.初始化：传入选择器 或dom对象
  new IScroll('.jd_left');

  // 右侧栏区域滚动
  new IScroll('.jd_right', {
    scrollX:false,
    scrollY:true
  });
});