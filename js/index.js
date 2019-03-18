// 入口函数
document.addEventListener('DOMContentLoaded', function(e){
  // 实现轮播图，使用面向对象的方式编程
  // 1.自动轮播图（注意：自动时无缝连接、手工滑动时无缝连接
  // 2.点做对应的改变
  // 3.实现滑动功能
  // 4.当滑动的距离不够时，吸附回去
  // 5.当滑动的距离足够时，切换图片 上一张或下一张
  // 6.当滑动的速度足够时，切换图片 上一张或下一张
  new Banner();
});

// 定义一个 Banner 类
var Banner = function (selector) {
  // 丰富属性  
  this.$el = document.querySelector(selector || '.jd_banner');  // 主体容器
  this.width = this.$el.offsetWidth; // 每次切换的宽度，offsetWidth属性获取dom元素盒模型(width+border + padding)的宽度
  this.$imageBox = this.$el.querySelector('ul:first-child'); // 图片容器
  this.$pointBox = this.$el.querySelector('ul:last-child');  // 点容器
  this.timer = null; // 定时器
  this.interval = 2000; // 定时器切换的时间
  this.index = 1; // banner图片的索引
  this.swipeWidth = this.width/3; // 滑动多远后，可以做切换的距离

  this.init();
};

// 丰富方法
// 初始化方法
Banner.prototype.init = function () { 
  this.autoPlay(); // 自动播放
  this.animated(); // 监听动画(过渡)结束
  this.initSwipe(); // 滑动功能
};

// 自动轮播的方法
Banner.prototype.autoPlay = function () {
  var _this = this;
  this.timer = setInterval(function () {
    // 动画的切换到下一张    
    _this.index++;
    var translateX = - _this.index * _this.width;
    // 加过渡
    _this.addTransition();
    // 改变位移
    _this.setTranslateX(translateX);
  },_this.interval);
};

// 等切换到最后一张（索引为9）且动画执行完毕时，瞬间定位到第一章图（索引为1）的位置。（共8张banner图，但首位各重复了1张，即8123456781）
// 监听动画（过渡）结束
Banner.prototype.animated = function () {
  var _this = this;
  this.$imageBox.addEventListener('transitionend',function () {
    // 切换到最后一张，且动画执行完毕时，瞬间切换到第1张（索引为1）
    // 为什么是 >=9 呢？index 为何会超过9呢？ 因为 定时器会一直往前走，index一会一直++，
    // 而动画（过渡）却不一定执行（页面切换到后台时，动画不执行），动画不执行，index 到 9 时，就不能回到 1，反而继续增加到 10、11 ....
    if (_this.index >= 9 ) {
      _this.index = 1;
      // 去掉过渡
      _this.removeTransition();
      // 改变位移
      var translateX = - _this.index * _this.width;
      _this.setTranslateX(translateX);
    } else if (_this.index <= 0) { // 切换到第0张，且动画执行完毕时，瞬间切换到第8张(索引为8)
      _this.index = 8;
      // 去掉过渡
      _this.removeTransition();
      // 改变位移
      var translateX = - _this.index * _this.width;
      _this.setTranslateX(translateX);      
    }
    // 设置点的变化
    _this.setPoint();
  });
};

// 设置点的变化
Banner.prototype.setPoint = function () {
  this.$pointBox.querySelector('li.now').classList.remove('now');
  this.$pointBox.querySelectorAll('li')[this.index-1].classList.add('now');
};

// 滑动功能
Banner.prototype.initSwipe = function () {
  var _this = this;

  // 1.滑动（图片容器随着手指的滑动进行位移）
  var startX = 0; // 起始点坐标
  var startTime = 0; // 起始的时间
  var distance = 0; // 滑动的距离

  _this.$imageBox.addEventListener('touchstart', function (e) {
    startX = e.changedTouches[0].clientX;
    startTime = Date.now();
    clearInterval(_this.timer); // 滑动时，清除定时器，停止自动轮播。
  });

  _this.$imageBox.addEventListener('touchmove', function (e) {
    var moveX = e.changedTouches[0].clientX; // 滑动中的点坐标
    distance = moveX - startX;
    // 将要定位的位置 = 容器的现在的位置 + 滑动的距离（不分正负）
    var translateX = - _this.index * _this.width + distance;
    _this.removeTransition(); // 去掉过渡
    _this.setTranslateX(translateX); // 改变位移
  });

  _this.$imageBox.addEventListener('touchend', function (e) {
    // 根据滑动速度判断是否切换：如果速度足够快，就切换；否则继续判断滑动距离
    var s = Math.abs(distance); // 路程
    var t = Date.now() - startTime; // 时间
    var v = s / t; // 速度 px/ms  手速在 0.25 以上算快
    // console.log(v);
    // 手速超过 0.25 ，则切换
    if (v > 0.25) {
      if (distance > 0) {
        // 右滑 上一张
        _this.index --;
      } else {
        // 左滑 下一张
        _this.index ++;
      }
      var translateX = - _this.index * _this.width;
      _this.addTransition();
      _this.setTranslateX(translateX);
    } else {
      // 根据滑动距离判断是否切换：滑动距离的绝对值，与swipeWidth比较，判断是否做切换
      if (Math.abs(distance) > _this.swipeWidth) {
        // 切换效果      
        if (distance > 0) {
          // 右滑 上一张
          _this.index --;
        } else {
          // 左滑 下一张
          _this.index ++;
        }
        var translateX = - _this.index * _this.width;
        _this.addTransition();
        _this.setTranslateX(translateX);
      } else {
        // 吸附效果
        var translateX = - _this.index * _this.width;
        _this.addTransition()
        _this.setTranslateX(translateX);
      }
    }
    // 滑动（切换或吸附）结束后，开启自动轮播
    _this.autoPlay();
  });
};

// 加过渡
Banner.prototype.addTransition = function () {
  this.$imageBox.style.transition = 'all 0.3s';
  this.$imageBox.style.webkitTrasition = 'all 0.3s';
};
// 去过渡
Banner.prototype.removeTransition = function () {
  this.$imageBox.style.transition = 'none';
  this.$imageBox.style.webkitTrasition = 'none';
};
// 改变位移
Banner.prototype.setTranslateX = function (translateX) {
  this.$imageBox.style.transform = 'translateX('+ translateX +'px)';
  this.$imageBox.style.webkitTransform = 'translateX('+ translateX +'px)';
};