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

### Fix05
- [X] Tag页面结果列表margin调整
- [X] CommentModule 等待过渡动画位置摆正
- [X] Search页面搜索栏常驻，并允许点击搜索图标;设置搜索冲突（上次搜索结果未来之前不允许下次搜索）
- [X] 修复移动端下info-box内容会换行导致缺失的问题（white-space不允许换行）
- [X] ACGT页面及Note页面增加等待过渡动画

### Fix06
- [X] 移动端下进入个人空间进行提示
- [X] 在个人空间注销时返回主页
- [X] 调整Note页面在不同宽度下的最低高度（随页头图片高度而变动）
- [X] 修复侧边导航栏头像下面有小部分空白的情况，压缩侧边导航栏的高度

### Fix07
- [X] 移动端下文章标题大小调整
- [X] 移除snow颜色背景，修改snow颜色字体/阴影
- [X] 控制面板在z-index调整，网站设置面板字体切换实现

### Fix08
- [X] 字体切换区域详细指定，对两种字体进行细微的兼容工作
- [X] 文章标题导航栏扩宽，增加title显示，不允许换行（超出隐藏）
- [X] 翻页/加载到底部时显示到底信息
