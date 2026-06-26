---
toc: true
title: Linux 学习笔记（二）：进阶操作与系统管理
date: 2026-06-26 22:05:00
categories:
  - 笔记
comments: true
---

> 接上一篇 [[Linux 学习笔记（一）：基础入门]]，本篇涵盖文本处理、系统监控、Vim 编辑器和网络工具。

---

## 第三周：文本进阶

> 掌握文本处理的进阶工具，数据处理效率翻倍。

### 3.1 sort / uniq

#### sort — 排序

```bash
sort file               # 按字母排序
sort -n file            # 按数字排序
sort -r file            # 逆序
sort -k 2 file          # 按第 2 列排序
sort -t',' -k 3 file    # 指定分隔符，按第 3 列排序
sort -u file            # 排序并去重
```

#### uniq — 去重统计

> `uniq` 必须配合 `sort` 使用（只去除连续重复行）。

```bash
sort file | uniq         # 全局去重
sort file | uniq -c      # 统计每行出现次数（最常用）
sort file | uniq -d      # 只显示重复的行
sort file | uniq -u      # 只显示不重复的行
```

### 3.2 cut / tr

#### cut — 按列切割

```bash
cut -d',' -f1 file.csv       # 逗号分隔，取第 1 列
cut -d':' -f1,3 /etc/passwd  # 冒号分隔，取第 1、3 列
cut -c1-5 file               # 取每行前 5 个字符
```

#### tr — 字符替换与删除

```bash
echo "hello" | tr 'a-z' 'A-Z'      # 小写转大写
echo "a,b,c" | tr ',' '\t'         # 逗号变制表符
echo "hello 123" | tr -d '0-9'     # 删除所有数字
echo "a  b   c" | tr -s ' '        # 压缩连续空格
```

### 3.3 diff — 文件对比

```bash
diff file1 file2          # 显示差异
diff -u file1 file2       # 统一格式（更易读，补丁文件格式）
diff -r dir1 dir2         # 递归对比两个目录
```

### 3.4 tee — 同时输出到屏幕和文件

```bash
命令 | tee file         # 显示并写入（覆盖）
命令 | tee -a file      # 显示并追加
```

### 3.5 find — 查找文件

```bash
find 路径 -name "pattern"          # 按文件名
find 路径 -type f                  # 只找普通文件
find 路径 -type d                  # 只找目录
find 路径 -size +100M              # 大于 100MB
find 路径 -size -1K                # 小于 1KB
find 路径 -mtime -7                # 7 天内修改
find 路径 -empty                   # 空文件或目录
find 路径 -name "*.tmp" -delete    # 查找并删除
find 路径 -name "*.log" -exec ls -lh {} \;  # 查找并执行
```

### 3.6 xargs — 参数传递

将 stdin 转为命令行参数，常与 `find` 配合。

```bash
find . -name "*.tmp" | xargs rm -f              # 查找并删除
find . -name "*.txt" | xargs -I {} cp {} /bak/  # 查找并复制
cat urls.txt | xargs -n 1 curl -O               # 逐行读取并下载
```

### 3.7 压缩与解压

#### tar — 归档与压缩

| 参数 | 作用 |
|------|------|
| `-c` | 创建 |
| `-x` | 解压 |
| `-v` | 显示过程 |
| `-f` | 指定文件名（**必须放最后**） |
| `-z` | gzip 压缩 |
| `-j` | bzip2 压缩 |
| `-C` | 解压到指定目录 |

```bash
# 压缩
tar -cvf a.tar files              # 仅打包
tar -czvf a.tar.gz files          # 打包 + gzip 压缩
tar -cjvf a.tar.bz2 files         # 打包 + bzip2 压缩

# 解压
tar -xvf a.tar                    # 解包
tar -xzvf a.tar.gz                # 解压 .tar.gz
tar -xjvf a.tar.bz2               # 解压 .tar.bz2
tar -xzvf a.tar.gz -C /target     # 解压到指定目录
tar -xzvf a.tar.gz --wildcards "*.txt"   # 只解压特定文件
tar -tzvf a.tar.gz                # 查看压缩包内容（不解压）
```

#### zip / unzip

```bash
# 压缩
zip test.zip a.txt b.txt          # 压缩文件
zip -r test.zip dir a.txt         # 递归压缩
zip -r test.zip dir -x "*.log"    # 排除 .log 文件

# 解压
unzip test.zip                    # 解压到当前目录
unzip test.zip -d /target         # 解压到指定目录
unzip -l test.zip                 # 查看内容（不解压）
```

### 练一练

1. 用 `find` 查找 `/etc` 目录下所有名称以 `.conf` 结尾的文件
2. 将 `/tmp` 下所有 `.log` 文件通过一条命令查找并删除
3. 统计 `/var/log/syslog`（或 `/var/log/messages`）中每行出现次数最多的前 5 行
4. 用 `cut -d':' -f1 /etc/passwd` 提取所有用户名
5. 将当前目录所有 `.txt` 文件打包为 `backup.tar.gz`

---

## 第四周：系统入门

> 学会查看系统状态、管理进程和服务。

### 4.1 df / du — 磁盘空间

```bash
df -h          # 各分区占用情况（人类可读）
df -i          # 查看 inode 使用情况
df -T          # 显示文件系统类型

du -sh dir     # 目录总大小
du -h --max-depth=1    # 各子目录大小
du -sh * | sort -rh    # 按大小排序
```

### 4.2 ps — 查看进程

```bash
ps -ef                # 所有进程（标准格式）
ps aux                # 所有进程（BSD 格式）
ps -ef | grep 关键词   # 过滤指定进程
ps aux --sort=-%mem   # 按内存使用排序
ps aux --sort=-%cpu   # 按 CPU 使用排序
```

| 字段 | 含义 |
|------|------|
| UID | 所属用户 |
| PID | 进程 ID |
| PPID | 父进程 ID |
| C | CPU 占用百分比 |
| STIME | 启动时间 |
| TTY | 终端序号（`?` 后台进程） |
| TIME | 累计 CPU 时长 |
| CMD | 程序路径或命令 |

### 4.3 kill / killall — 终止进程

```bash
kill PID           # 温和终止（SIGTERM）
kill -9 PID        # 强制杀死（SIGKILL）
kill -l            # 列出所有信号
killall 进程名      # 按名称终止所有匹配进程
```

### 4.4 top — 系统监控

```bash
top   # 实时进程监控，按 q 退出
```

**交互快捷键：**

| 按键 | 功能 |
|------|------|
| `M` | 按内存排序 |
| `P` | 按 CPU 排序 |
| `T` | 按时间排序 |
| `i` | 隐藏闲置进程 |
| `c` | 显示完整命令 |
| `1` | 展开 CPU 核心 |
| `h` | 帮助 |

**启动参数：**

```bash
top -p PID          # 只看指定进程
top -d 2            # 每 2 秒刷新
top -u 用户名       # 只看某用户进程
top -b -n 3 > out   # 批次模式输出 3 次
```

### 4.5 systemctl — 服务管理

```bash
systemctl start 服务名           # 启动
systemctl stop 服务名            # 关闭
systemctl restart 服务名         # 重启
systemctl reload 服务名          # 热加载配置
systemctl status 服务名          # 查看状态
systemctl enable 服务名          # 开机自启
systemctl disable 服务名         # 关闭自启
systemctl is-enabled 服务名      # 检查自启状态
systemctl list-units --type=service   # 列出所有服务
systemctl list-unit-files             # 列出所有单元
systemctl daemon-reload               # 重载 systemd
```

**常见内置服务：** `sshd`（SSH）、`NetworkManager`（网络）、`ufw`（防火墙）

### 4.6 journalctl — 系统日志

```bash
journalctl -xe                    # 最近日志（-x 详情，-e 跳末尾）
journalctl -u nginx               # 只看某服务
journalctl -u sshd --since "1 hour ago"  # 按时间过滤
journalctl -f                     # 实时跟踪
journalctl --disk-usage           # 日志占用磁盘
journalctl --vacuum-size=200M     # 清理日志保留 200M
journalctl -p err -b              # 本次启动的错误日志
```

### 4.7 history — 命令历史

```bash
history           # 显示所有已执行命令
!n                # 重复执行第 n 条
!!                # 重复上一条
!命令前缀          # 自动匹配执行
```

### 4.8 电源管理

```bash
shutdown -h now    # 立即关机
shutdown -r now    # 立即重启
shutdown -h +5     # 5 分钟后关机
shutdown -c        # 取消已计划的关机
reboot             # 重启
halt               # 关闭系统（不断电）
poweroff           # 关机并断电
```

### 4.9 timedatectl — 时间时区

```bash
timedatectl                          # 查看时间与时区
timedatectl list-timezones           # 所有时区
timedatectl set-timezone Asia/Shanghai  # 设置时区
```

### 练一练

1. 用 `ps -ef` 找到当前终端对应的 shell 进程（提示：找 `bash` 关键词）
2. 启动一个 `sleep 120` 命令放到后台，然后用 `kill` 终止它
3. 查看 `sshd` 服务是否正在运行，并查看其日志
4. 用 `df -h` 查看根分区 `/` 还剩多少空间
5. 用 `journalctl -u cron --since "1 hour ago"` 查看最近一小时的定时任务日志

---

## 第五周：Vim 与网络

> 掌握编辑器 + 网络操作，这是日常最频繁的操作。

### 5.1 Vim 编辑器

#### 三种模式

```
命令模式 ──→ 输入模式      (按 i, a, o 等)
输入模式 ──→ 命令模式      (按 Esc)
命令模式 ──→ 底线命令模式   (按 :)
底线命令模式 ──→ 命令模式   (Esc 或执行完命令)
```

#### 快速上手

```bash
vim hello.txt     # 打开文件（不存在则新建）
i                 # 进入输入模式，开始编辑
Esc               # 返回命令模式
:wq               # 保存并退出
```

#### 命令模式 → 输入模式

| 命令 | 描述 |
|------|------|
| `i` | 光标前插入 |
| `a` | 光标后插入 |
| `I` | 行首插入 |
| `A` | 行尾插入 |
| `o` | 下一行插入 |
| `O` | 上一行插入 |

#### 光标移动

| 命令 | 描述 |
|------|------|
| `h` `j` `k` `l` | 左 下 上 右 |
| `0` / `$` | 行首 / 行尾 |
| `gg` / `G` | 首行 / 尾行 |
| `:n` | 跳到第 n 行 |
| `Ctrl + F` / `B` | 向下 / 向上翻页 |

#### 搜索

| 命令 | 描述 |
|------|------|
| `/关键词` | 向下搜索 |
| `?关键词` | 向上搜索 |
| `n` / `N` | 继续下 / 上搜索 |

#### 删除 / 复制 / 粘贴

| 命令 | 描述 |
|------|------|
| `dd` / `3dd` | 删除 1 / 3 行 |
| `dG` / `dgg` | 删到文件尾 / 头 |
| `x` | 删除光标字符 |
| `yy` / `3yy` | 复制 1 / 3 行 |
| `p` / `P` | 光标后 / 前粘贴 |

#### 撤销与重做

| 命令 | 描述 |
|------|------|
| `u` | 撤销 |
| `Ctrl + R` | 重做 |

#### 底线命令

| 命令 | 描述 |
|------|------|
| `:wq` | 保存退出 |
| `:q` | 退出（未修改） |
| `:q!` | 强制退出不保存 |
| `:w` | 保存 |
| `:set nu` / `:set nonu` | 显示/隐藏行号 |
| `:set paste` | 粘贴模式（避免缩进乱掉） |
| `:%s/旧/新/g` | 全文替换 |
| `:%s/旧/新/gc` | 全文替换（逐个确认） |
| `:e 文件名` | 打开另一个文件 |
| `:!命令` | 执行 shell 命令 |

> **小技巧**：忘记用 `sudo` 打开文件时，用 `:w !sudo tee %` 强行保存。

### 5.2 ping — 网络连通性

```bash
ping -c 4 hostname/ip    # 发 4 个包测连通
ping -c 4 8.8.8.8        # 测外网
```

### 5.3 ip / ifconfig — 网络接口

```bash
# ip（推荐）
ip addr       # 查看 IP 地址
ip link       # 查看网络接口状态
ip route      # 查看路由表

# ifconfig（需安装 net-tools）
ifconfig      # 查看网络接口
```

### 5.4 ss / netstat / nmap — 端口

```bash
# ss（推荐，速度更快）
ss -tlnp      # TCP 监听端口及进程
ss -ulnp      # UDP 监听端口
ss -tunap     # 所有 TCP/UDP 连接

# netstat
netstat -tlnp | grep :端口

# nmap（需安装）— 扫描远程主机
sudo apt install nmap
nmap IP地址                     # 扫描开放端口
nmap -p 22,80 192.168.1.1      # 扫描指定端口
nmap -sV IP                     # 探测服务版本
```

### 5.5 ssh / scp — 远程连接与传输

```bash
ssh user@hostname          # 默认端口连接
ssh -p 2222 user@host      # 指定端口
ssh -i key.pem user@host   # 密钥认证

ssh-keygen                 # 生成密钥对
ssh-copy-id user@host      # 复制公钥到远程（免密登录）

# 远程复制文件
scp file user@host:/path          # 本地 → 远程
scp user@host:/path/file ./       # 远程 → 本地
scp -r dir user@host:/path        # 递归复制目录
```

### 5.6 rsync — 文件同步（推荐替代 scp）

```bash
rsync -av src/ dst/                  # 本地同步
rsync -av dir/ user@host:/path/      # 推送到远程
rsync -av user@host:/path/ dir/      # 从远程拉取
rsync -avz --progress bigfile user@host:/path/  # 压缩 + 进度
rsync -av --delete src/ dst/         # 镜像（删除目标多余文件）
```

| 选项 | 说明 |
|------|------|
| `-a` | 归档（保留权限、时间） |
| `-v` | 显示详情 |
| `-z` | 传输时压缩 |
| `--progress` | 显示进度 |
| `--delete` | 删除目标多余文件 |

### 5.7 wget / curl — 文件下载与 HTTP

```bash
# wget — 下载
wget url                    # 下载到当前目录
wget -O name.zip url        # 指定文件名
wget -b url                 # 后台下载
wget -c url                 # 断点续传
tail -f wget-log            # 监控后台下载

# curl — HTTP 请求
curl -O url                 # 下载并保存
curl -I https://example.com # 查看响应头
curl -L url                 # 跟随重定向
curl -X POST -d "k=v" url   # POST 请求
curl -H "Authorization: Bearer TOKEN" url  # 带请求头
```

### 5.8 主机名管理

```bash
hostname                          # 查看当前主机名
hostnamectl set-hostname 新名称    # 永久修改（需 root）
```

### 5.9 crontab — 定时任务

```bash
crontab -e     # 编辑当前用户定时任务
crontab -l     # 列出
crontab -r     # 删除所有
```

**格式：** `分 时 日 月 周 命令`

```bash
# 每天凌晨 2 点
0 2 * * * /path/to/script.sh

# 每 5 分钟
*/5 * * * * /path/to/script.sh

# 工作日早 9 点
0 9 * * 1-5 /path/to/script.sh

# 每月 1 号和 15 号
0 0 1,15 * * /path/to/script.sh
```

### 练一练

1. 用 Vim 新建一个文件 `hello.txt`，输入三行文字，保存退出，然后用 `cat` 验证
2. 用 `ping -c 3` 测试能否连通 `baidu.com`
3. 用 `ss -tlnp` 查看本机有哪些端口在监听
4. 用 `ssh-keygen` 生成一对密钥，用 `ls -la ~/.ssh` 查看生成的文件
5. 写一条 crontab 规则：每天下午 6 点执行 `/home/backup.sh`

---

> **继续阅读：[Linux 学习笔记（三）：自动化与实战 →](/blog/linux-part3-automation)**
