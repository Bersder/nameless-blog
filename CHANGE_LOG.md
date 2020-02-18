# 重大保存点
作死前的备份
- 2019.9.12 4f9a606 网站开发基本完成，进入生产环境调试前的最后保存
- 2019.9.12 a3d0950 为了方便调试，vue设置了代理，**统一转发/root开头的请求，共51个**(上线前请使用`'/root'\+|/root`在src中正则替换成空字符串)
- 2019.9.22(fix11_) b2bc824 调试修复基本完成，进行css重组前的最后保存
- 2019.9.24 4e19690 css重组完成(确保Space部分没有问题，其他不保证)
- 2019.9.25 b7b470d 项目结构重组1：将global.js和USER_VAR.js解构，并新增config和mixins目录用于容纳
- 2019.9.26 3f8994e 项目结构重组2：将请求接口挂载在Vue原型上，大量减少其import
- 2019.9.26 315bdf5 项目结构重组3：vuex重组，将LuminousBox部分独立成模块;并实现了LuminousBox和markdown图片的对接
- 2019.10.24 6fa48de 数据库重组前的副本
	- 2019.10.25 2fc2b1e 数据库（文章系列相关）重组完成
	- 2019.10.26 ec883c6 数据库（笔记分类相关）重组完成
	- 2019.10.31 fdd8cc3 数据库（标签管理相关）重组完成
- 2019.11.13 6675798 休息，发布第一个版本 `v1.0.0`
- 2019.11.21 0709dfc 改造cookie前的副本(对应后端 bcbff42)
- 2019.11.23 571e956 登录凭证从LS中抽取出来移动至cookie中(对应后端 b9d00f7)

___

# 版本更新记录
## to do list
> 画饼一时爽，一直画饼一直爽

- [ ] 组件独立
- [ ] 个人空间完善
## v1.2.0
### Features
- [ ] SEO

## v1.1.6
`2020-02-18`_``
### Features
- 动态页面黑暗模式适配，微调之前的 DDF 样式 `43eb07c`
- 表情包模块独立，表情参数由上层传入（避免每个子组件都要执行fetchEmo）`5cadaf7,b64ac74`
- 实现懒加载指令 `5d03157,4102784,f1421c0`
- 在表单校验中使用策略模式代替传统 if-else 逻辑 `8208f4c`
### Bug Fixes
- 修复网址正则匹配问题
### Improvement
- 减少编辑页面 template 中的复杂逻辑 `5081755`


## v1.1.5
`2020-02-07`_`8be3763`
### Features
- 去除 store 中的 reachBottom，新增 xAboveBottom 表示离底部的距离，方便使用自定义阈值
- 取消 `Homepage.vue` 中预先获取文章总数的行为，引入 noMore 变量实时表示文章穷尽状态
### Bug Fixes
- 修复 v-highlight 指令在更新阶段重复执行的问题

## v1.1.4
`2020-02-07`_`cb7d3cf`
### Bug Fixes
- 修复 v-highlight 指令生成的行数统计与实际行数不符合的问题
### Improvement
- 从各类富文本评论模块中提取共用部分 Mixin-RichText

## v1.1.3
`2020-02-06`_`f164c14`
- ip来访记录（pv更新优化），限制敏感操作试错次数
- 评论模块优化，实现评论后无刷新重载
- 新增动态页面，动态发布页面重组

## v1.1.2
`2019-12-16`_`15dd2a3`
- 新增番组页面及Anime页面中的追番组件
- TopNav中第二行路由判断优化(meta实现)
- 修复在差网络环境下允许多次loadMore请求的问题

## v1.1.1
`2019-12-07`_`ce5e902`
- 个人空间DDF适配
- 修复评论区代码段行号重新渲染问题

## v1.1.0
`2019-11-24`_`27d6709`
- cookie 支持
- 黑暗模式(DDF)支持 (除个人空间)

## 远古更新记录
正式版之前的更新记录，（时间由旧到新）
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

### Fix09
- [X] 顶部导航栏在顶部与背景大图重叠时透明化（能看到一点），鼠标hover时显示（限PC端）
- [X] 翻页模块上下翻页按钮由v-show改为v-if渲染
- [X] 修复因**Fix05[2]**造成的insertBefore失效（取消回复时因位置偏移出错）
- [X] 为最后一条评论添加底部margin（防止过度贴近Footer）
- [X] 首页内容区域扩宽，首页置顶文章自适应优化

### Fix10
- [X] spaceLaunchAdmin中的操作按钮css优化
- [X] Article中document.title变化逻辑修正
- [X] Article头部去除作者名字与头像，取而代之的是文章类型链接
- [X] Article数据初始化修正及补充
- [X] Article增加系列信息的显示，并因此调整genNavList()逻辑
- [X] Article目录只在PC端渲染

### Fix11
- [X] 为Homepage和Note页面添加公告信息，并连接后端
- [X] 各种css优化

### Fix12
- [X] 对Footer进行了重制，并且填充了逻辑
- [X] panelH样式优化
- [X] 添加404页面
- [X] 为编辑页面路由设置loginStatus，编辑页面进入前会判断登录状态
- [X] 去除Note旧代码和console.log

### GuGu01
- [X] Series页面添加，series添加描述信息，spaceSetting中添加系列描述支持 
- [X] 评论区表情支持，评论区机器人排查
### GuGu02
- [X] settingPanel主题功能实现
顺带修复
- 评论区针对移动端css优化

### Fix13
- [X] 修复了相册中图片数量初始化的逻辑
- [X] 添加移动端返回顶部按钮
- [X] 文章分享实现

### Fix14
- [X] 数据库重组（文章系列部分）前端适应
### Fix15
- [X] 数据库重组（笔记分类部分）前端适应
### Fix16
- [X] 数据库重组（标签管理部分）前端适应
### Fix17
- [X] 不常变更的网站资源整合到static下，方便开发调试
### Fix18
- [X] 评论区头像拉取支持，需要提供qq号
- [X] LuminousBox Esc 退出支持
