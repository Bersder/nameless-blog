# nameless_blog
基于Vue，php开发的花哨个人博客

## 重大保存点
- 2019.9.12 4f9a606 网站开发基本完成，进入生产环境调试前的最后保存
- 2019.9.12 a3d0950 为了方便调试，vue设置了代理，统一转发/root开头的请求，共65个，剩下3个localhost(上线前请使用`'/root'\+|/root`正则替换成空字符串)
- 占领先


## 修复记录

### Fix01(Mainly for TheTopNav.vue)
- [X] 修复LaunchDraft nodata.png在waiting前显示
- [X] 取消ctrlPanel和back2top在编辑页面的出现
- [X] 修复编辑页面选择框不对齐的问题 vertical-align 统一middle
- [X] topNav侧边导航css大优化，导航跳转后自动收回侧边导航

### Fix02
- [X] homepage修服无内容时没占满宽度的问题
- [X] 在移动端下ACGT等页头图片高度调小，ACGT页面空时，显示空信息
- [X] back2top图片随机化

### Fix03
- [X] Note页面移动端css优化，取消贴边
- [X] .pager 配色、margin更改
- [X] 在移动端下Note、Tag、Link页头图片高度调小，移动端Tag页面头部字体大小调小
- [X] About,Link部分样式和CommentModule合并
- [X] Note、Tag页面的列表css优化

### Fix04
- [X] search页面随机推荐字体颜色更改
- [X] Tag-cloud的title和随机推荐的title字体大小减小
- [X] topNav 配色更改
- [X] Link、About页面margin调整
- [X] 全局字体颜色更改为#1e1e1e
