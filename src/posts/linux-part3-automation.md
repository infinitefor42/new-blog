---
toc: true
title: Linux 学习笔记（三）：自动化与实战
date: 2026-06-26 22:10:00
categories:
  - 笔记
comments: true
---

> 接上一篇 [[Linux 学习笔记（二）：进阶操作与系统管理]]，本篇涵盖环境变量、Shell 脚本、终端美化和实战场景。

---

## 第六周：环境与进阶

> 深入环境变量、磁盘管理、后台任务。

### 6.1 环境变量

```bash
env                  # 查看所有环境变量
echo $变量名          # 读取
echo ${变量名}ABC     # 拼接输出（用 {} 区分边界）
```

**临时设置：**

```bash
export 变量名=变量值
export MY_VAR=hello
```

**永久设置：**

| 作用范围 | 配置文件 | 说明 |
|----------|----------|------|
| 当前用户 | `~/.bashrc` | 普通用户编辑 |
| 所有用户 | `/etc/profile` | root 编辑 |

```bash
# 修改后立即生效
source ~/.bashrc
```

**自定义 PATH：**

```bash
export PATH=$PATH:/自定义目录
# 写入 ~/.bashrc 永久生效
```

### 6.2 date — 时间计算与格式化

```bash
date                        # 当前时间
date -d "+2 hour" +"%Y-%m-%d %H:%M:%S"  # 2 小时后
date -d "yesterday" +%F     # 昨天
date -d "@1719360000"       # 时间戳转日期
```

| 标记 | 含义 | 示例 |
|------|------|------|
| `%Y` | 4 位年份 | 2026 |
| `%m` | 月份 | 06 |
| `%d` | 日期 | 26 |
| `%H` | 小时 | 22 |
| `%M` | 分钟 | 00 |
| `%S` | 秒 | 00 |
| `%F` | `%Y-%m-%d` 简写 | 2026-06-26 |
| `%s` | Unix 时间戳 | 1719360000 |

### 6.3 ln — 链接

```bash
ln -s 源文件 链接名        # 软链接（快捷方式）
ln 源文件 链接名           # 硬链接
```

- **软链接**：指向文件路径，源文件删除则失效，可跨文件系统
- **硬链接**：指向文件 inode，源文件删除仍有效，不可跨文件系统

### 6.4 mount / umount / lsblk — 磁盘与挂载

```bash
lsblk                 # 以树形显示磁盘和分区
lsblk -f              # 显示文件系统类型和 UUID

mount /dev/sdb1 /mnt          # 挂载分区到 /mnt
mount -o ro /dev/sdb1 /mnt    # 只读挂载
umount /mnt                   # 卸载
umount -l /mnt                # 强制卸载
```

### 6.5 dd — 磁盘复制

```bash
dd if=/dev/sda of=/dev/sdb bs=4M status=progress   # 磁盘克隆
dd if=/dev/zero of=test.img bs=1M count=100         # 创建 100MB 测试文件
```

### 6.6 后台任务

```bash
命令 &                  # 放入后台运行
nohup 命令 &            # 退出终端后继续运行
nohup python script.py > out.log 2>&1 &  # 输出重定向到文件

jobs                    # 查看后台任务列表
jobs -l                 # 显示 PID
fg %1                   # 把后台任务 1 切到前台
bg %1                   # 把暂停的任务 1 放后台继续
Ctrl + Z                # 暂停当前前台任务
```

### 6.7 lsof — 查看打开的文件

```bash
lsof -i :8080        # 谁占用了 8080 端口
lsof -u 用户名        # 某用户打开的文件
lsof -p PID          # 某进程打开的文件
lsof 文件名           # 谁正在使用这个文件
```

### 6.8 watch — 周期性执行命令

```bash
watch -n 1 df -h       # 每秒刷新磁盘占用
watch -d ls -l         # 高亮显示变化
```

### 6.9 iostat / sar — 进阶监控

```bash
# iostat — 磁盘 IO
iostat -x 2 3   # 每 2 秒刷新，输出 3 次

# sar — 网络流量
sar -n DEV 2 3  # 每 2 秒刷新网卡流量，输出 3 次
```

### 6.10 uname — 系统信息

```bash
uname -a   # 内核版本、主机名、架构等全部信息
```

### 6.11 杂项工具

```bash
cal          # 当前月份日历
cal 2026     # 全年

expr 1 + 2          # 整数加法
expr 2 \* 3         # 乘法（* 需转义）

figlet "Hello"           # ASCII 艺术字
figlet -f slant "标题"   # 斜体字体
```

### 练一练 1

1. 在 `~/.bashrc` 中添加一个别名 `ll='ls -lh'`，然后用 `source` 使其生效
2. 用 `date +%Y%m%d -d "-1 day"` 输出昨天的日期（格式如 20260625）
3. 创建一个 10MB 的测试文件（用 `dd`），然后删除
4. 用 `lsof -i :22` 查看谁在使用 SSH 端口
5. 运行 `sleep 60 &`，然后用 `jobs` 查看，再用 `fg` 切到前台

---

## 第七周：Shell 脚本基础

> 从敲命令到写脚本，学会自动化。

### 7.1 第一个脚本

```bash
#!/bin/bash
echo "Hello, Linux!"
```

1. 保存为 `hello.sh`
2. 加执行权限：`chmod +x hello.sh`
3. 运行：`./hello.sh`

`#!/bin/bash` 称为 **shebang**，告诉系统用哪个解释器执行。

### 7.2 变量

```bash
# 定义变量（等号两边不能有空格）
name="Linux"
echo $name
echo ${name}_rocks    # 拼接时用 {} 包裹

# 只读变量
readonly version="1.0"

# 位置参数
echo "脚本名: $0"
echo "第一个参数: $1"
echo "第二个参数: $2"
echo "参数个数: $#"
echo "所有参数: $@"
```

### 7.3 字符串

```bash
str="hello"
echo ${#str}                # 长度 → 5
echo ${str:0:2}             # 切片 → "he"
echo ${str/ll/LL}           # 替换 → "heLLo"
echo ${str^^}               # 转大写 → "HELLO"
```

### 7.4 数组

```bash
arr=("apple" "banana" "cherry")
echo ${arr[0]}              # 第一个元素
echo ${arr[@]}              # 所有元素
echo ${#arr[@]}             # 元素个数
arr+=("date")               # 追加
```

### 7.5 条件判断

```bash
if [ "$1" = "start" ]; then
    echo "starting..."
elif [ "$1" = "stop" ]; then
    echo "stopping..."
else
    echo "usage: $0 start|stop"
fi
```

**常用文件判断：**

```bash
[ -f "file" ]    # 是否为文件
[ -d "dir" ]     # 是否为目录
[ -e "path" ]    # 是否存在
[ -z "$var" ]    # 是否为空字符串
[ "$a" = "$b" ]  # 字符串相等
[ $n -gt 10 ]    # 数字大于（-lt 小于，-eq 等于）
```

### 7.6 循环

```bash
# for 循环
for i in {1..5}; do
    echo "Number: $i"
done

# for 遍历文件
for file in *.txt; do
    echo "处理: $file"
done

# while 循环
count=1
while [ $count -le 5 ]; do
    echo "第 $count 次"
    count=$((count + 1))
done
```

### 7.7 函数

```bash
# 定义
log() {
    local msg=$1
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $msg"
}

# 调用
log "系统启动完成"
```

### 7.8 算术运算

```bash
a=10; b=3
echo $((a + b))      # 加法
echo $((a - b))      # 减法
echo $((a * b))      # 乘法
echo $((a / b))      # 除法
echo $((a % b))      # 取模
echo $((a ** 2))     # 平方
```

### 7.9 退出码

```bash
ls /nonexist
echo $?    # 上一条命令的退出码（0=成功，非0=失败）

# 脚本中指定退出码
if [ -f "$1" ]; then
    exit 0
else
    exit 1
fi
```

### 7.10 完整示例：备份脚本

```bash
#!/bin/bash

source_dir=$1
backup_dir="/backup"
date_str=$(date +%Y%m%d_%H%M%S)

if [ -z "$source_dir" ]; then
    echo "用法: $0 <源目录>"
    exit 1
fi

if [ ! -d "$source_dir" ]; then
    echo "错误: $source_dir 不是有效目录"
    exit 1
fi

mkdir -p "$backup_dir"
tar -czf "${backup_dir}/backup_${date_str}.tar.gz" "$source_dir"

if [ $? -eq 0 ]; then
    echo "备份完成: ${backup_dir}/backup_${date_str}.tar.gz"
else
    echo "备份失败!"
    exit 1
fi
```

### 练一练 2

1. 写一个脚本 `hello.sh`，接收一个名字参数，输出 "你好, [名字]！"
2. 写一个脚本 `countdown.sh`，从 10 倒数到 1，每秒输出一个数字（提示：`sleep 1`）
3. 写一个脚本 `batch_rename.sh`，将当前目录所有 `.txt` 改为 `.md`
4. 写一个脚本 `check_port.sh`，接收端口号参数，用 `ss -tlnp` 检查端口是否被监听

---

## 附录：终端美化与 dotfiles

> 配置你的终端，让它更好看、更好用。

### 什么是 dotfiles

以 `.` 开头的配置文件，控制 shell、编辑器、git 等工具的行为。

| 文件 | 作用 |
|------|------|
| `~/.bashrc` | Bash 配置（别名、函数、提示符） |
| `~/.bash_profile` | 登录 shell 配置 |
| `~/.gitconfig` | Git 配置 |
| `~/.vimrc` | Vim 配置 |
| `~/.ssh/config` | SSH 快捷配置 |

### 修改 PS1 提示符

```bash
# 当前样式
echo $PS1

# 永久生效：将下面 export 加入 ~/.bashrc
export PS1='\[\e[32m\]\u@\h\[\e[00m\]:\[\e[34m\]\w\[\e[00m\]\$ '
```

**常用转义：** `\u`用户名 `\h`主机名 `\w`路径 `\$` #/$（root/普通）
**颜色：** 30黑 31红 32绿 33黄 34蓝 35紫 36青 37白

### 推荐的 ~/.bashrc 配置

```bash
# 别名
alias ll='ls -lh'
alias la='ls -la'
alias ..='cd ..'
alias rm='rm -i'
alias grep='grep --color=auto'

# 补全不区分大小写
bind 'set completion-ignore-case on'

# 彩色提示符
export PS1='\[\e[32m\]\u@\h\[\e[00m\]:\[\e[34m\]\w\[\e[00m\]\$ '

# 自定义函数：快速创建并进入目录
mkcd() { mkdir -p "$1" && cd "$1"; }
```

### 推荐终端工具

| 工具 | 安装 | 说明 |
|------|------|------|
| **htop** | `apt install htop` | top 的升级版，彩色+鼠标 |
| **tmux** | `apt install tmux` | 终端复用器 |
| **bat** | `apt install bat` | cat 替代，语法高亮 |
| **ripgrep** | `apt install ripgrep` | grep 替代，快数倍 |
| **fd** | `apt install fd-find` | find 替代，更快 |
| **tldr** | `apt install tldr` | 简化版 man |

```bash
sudo apt install htop tmux ripgrep fd-find bat tldr
```

### tmux 快速上手

```bash
tmux new -s work      # 创建会话
tmux detach           # 断开（Ctrl+B d）
tmux attach -t work   # 重连
tmux ls               # 列出会话
```

**Ctrl+B 后：** `%`垂直分屏 `"`水平分屏 `方向键`切换 `d`断开 `c`新建窗口 `[`滚动模式

### 终端美化配置片段

```bash
# 加入 ~/.bashrc

# 用 bat 代替 cat
if command -v batcat &> /dev/null; then
    alias cat='batcat'
fi

# 快速编辑配置
alias eb='vim ~/.bashrc'
alias reload='source ~/.bashrc'
```

---

## 实战场景（命令组合）

> 将前面学过的命令组合起来，解决真实问题。

### 场景 1：查找并清理大文件

```bash
find / -type f -size +100M -exec ls -lh {} \; | sort -k5 -rh
find /tmp -type f -size +100M -delete
du -h --max-depth=1 / | sort -rh | head -10
```

### 场景 2：实时监控日志并过滤关键词

```bash
tail -f /var/log/syslog | grep --line-buffered "ERROR"
grep "ERROR" /var/log/syslog | wc -l
```

### 场景 3：统计 IP 访问次数

```bash
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20
```

### 场景 4：批量重命名

```bash
for f in *.txt; do mv "$f" "${f%.txt}.md"; done
for f in *.jpg; do mv "$f" "photo_$f"; done
```

### 场景 5：查找并杀死端口进程

```bash
ss -tlnp | grep :8080
kill -9 PID
# 或一行搞定
fuser -k 8080/tcp
```

### 场景 6：定时备份

```bash
crontab -e
0 2 * * * tar -czf /bak/www_$(date +\%Y\%m\%d).tar.gz /var/www
```

### 场景 7：快速定位系统瓶颈

```bash
ps -aux --sort=-%cpu | head -10     # CPU 前 10
ps -aux --sort=-%mem | head -10     # 内存前 10
iostat -x 2 5                       # 磁盘 IO
sar -n DEV 2 5                      # 网络流量
```

---

## 常见错误及解决方法

| 错误 | 原因 | 解决 |
|------|------|------|
| `Permission denied` | 权限不足 | `sudo` 或 `chmod` |
| `command not found` | 命令不存在或不在 PATH | `apt install` 或检查 PATH |
| `No such file or directory` | 路径错误 | `ls` 确认路径 |
| `Is a directory` | 对目录用了文件操作 | 加 `-r` |
| `port already in use` | 端口被占 | `ss -tlnp \| grep :端口` 找进程 |
| `Disk quota exceeded` | 磁盘满 | `df -h` 查看并清理 |
| `Connection refused` | 服务未启动 | `systemctl status 服务名` |
| `Connection timed out` | 网络不通 | 先 `ping`，再查防火墙 |

**快速排查流程：**

```
Permission denied  →  sudo 或 chmod
command not found  →  which 命令 or apt install
端口问题           →  ss -tlnp | grep :端口
磁盘满             →  df -h && du -sh /*
服务挂了           →  systemctl status 服务名
不知道问题在哪     →  journalctl -xe
```
