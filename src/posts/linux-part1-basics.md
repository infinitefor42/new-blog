---
toc: true
title: Linux 学习笔记（一）：基础入门
date: 2026-06-26 22:00:00
categories:
  - 笔记
comments: true
---

## Linux 发展简史

### Unix 的诞生（1969）

1969 年，Ken Thompson 和 Dennis Ritchie 在贝尔实验室用汇编语言写出了 Unix 的原型。1973 年，Dennis Ritchie 用 C 语言重写了 Unix，使其具备了可移植性，Unix 开始在学术界和企业广泛传播。

### GNU 计划与自由软件运动（1983）

1983 年，Richard Stallman 发起 GNU 计划（GNU's Not Unix），目标是创建一个完全自由的类 Unix 操作系统。GNU 开发了 GCC（编译器）、Emacs（编辑器）、Bash（Shell）等核心工具，但缺少一个关键部分——**内核**。

### Linux 内核诞生（1991）

1991 年，芬兰大学生 Linus Torvalds 出于学习目的，开发了一个 Unix-like 内核，最初在 Minix 新闻组发布：

> "I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones."

同年 9 月 17 日，Linux 0.01 版公开发布，约 1 万行代码。Linus 采用 GPL 许可证，使其与 GNU 工具链结合，形成了完整的操作系统。

### 命名由来

Linus 最初想将内核命名为 Freax（Free + Unix），但他的同事 Ari Lemmke 在给 FTP 服务器创建目录时，觉得 Freax 不好听，直接用了 Linus 的名字 + Unix，取名为 **Linux**。

### 重要里程碑

| 年份 | 事件 |
|------|------|
| 1991 | Linus Torvalds 发布 Linux 0.01 |
| 1992 | Linux 采用 GPL 许可证 |
| 1993 | Slackware、Debian 发行版诞生 |
| 1994 | Linux 1.0 发布（176,250 行代码） |
| 1996 | Tux 企鹅被选为 Linux 官方吉祥物 |
| 1998 | 开源（Open Source）概念正式提出 |
| 2001 | Linux 2.4 发布，支持 USB、蓝牙 |
| 2003 | Linux 2.6 发布，SMP、NUMA 支持 |
| 2005 | Git 版本控制系统诞生 |
| 2007 | Android 基于 Linux 内核发布 |
| 2024 | Linux 6.x 持续演进 |

![Tux——Linux 官方吉祥物](/images/article-images/Linux-penguin.png)

Tux（Torvalds UniX）是 Linux 的官方吉祥物，由 Larry Ewing 在 1996 年创作。Linus 曾开玩笑说想被企鹅咬一口，于是这只胖企鹅成了开源世界的标志。

### 主流发行版

| 发行版 | 特点 | 包管理 |
|--------|------|--------|
| **Debian** | 稳定、社区驱动，Ubuntu 的基础 | `apt` |
| **Ubuntu** | 用户友好、新手首选 | `apt` |
| **CentOS / Rocky** | RHEL 上游，企业服务器 | `yum` / `dnf` |
| **Fedora** | 新技术先行 | `dnf` |
| **Arch Linux** | 滚动更新，进阶用户 | `pacman` |
| **Alpine** | 极简，Docker 首选 | `apk` |
| **openEuler** | 华为开源，信创生态核心 | `yum` / `dnf` |

---

## 速查卡片

| 想做什么 | 用这个命令 |
|----------|-----------|
| 查看当前目录 | `pwd` |
| 列出文件 | `ls -lh` |
| 切换目录 | `cd /path` |
| 复制文件 | `cp -r src dst` |
| 移动/重命名 | `mv old new` |
| 删除文件 | `rm -rf dir` |
| 创建目录 | `mkdir -p a/b/c` |
| 查看文件 | `cat file` / `less file` |
| 跟踪日志 | `tail -f app.log` |
| 搜索内容 | `grep -r "关键词" .` |
| 查看帮助 | `man 命令` |
| 提权执行 | `sudo 命令` |
| 安装软件 | `apt install 软件名` |
| 修改权限 | `chmod 755 file` |
| 查看进程 | `ps -ef \| grep 关键词` |
| 终止进程 | `kill -9 PID` |
| 启动服务 | `systemctl start 服务名` |
| 查看日志 | `journalctl -xe` |
| 编辑文件 | `vim 文件名` |
| 保存退出 vim | `Esc → :wq` |
| 查看端口 | `ss -tlnp` |
| 远程连接 | `ssh user@host` |
| 编辑定时任务 | `crontab -e` |
| 查看磁盘 | `df -h` |
| 搜索文件 | `find / -name "*.log"` |
| 打包压缩 | `tar -czvf a.tar.gz dir` |
| 关机 | `shutdown -h now` |
| 设置别名 | `alias ll='ls -lh'` |

---

## 第一周：上手

> 目标是能在终端中自由移动、查看文件、做基本操作。

### 1.1 命令行快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + L` | 清屏（等效 `clear`） |
| `Ctrl + D` | 退出当前登录 |
| `Tab` | 自动补全命令/路径 |
| `Ctrl + A` | 跳到行首 |
| `Ctrl + E` | 跳到行尾 |
| `Ctrl + U` | 删除到行首 |
| `Ctrl + K` | 删除到行尾 |
| `Ctrl + W` | 删除前一个单词 |
| `Ctrl + R` | 搜索历史命令 |
| `Ctrl + C` | 终止当前命令 |
| `Ctrl + Z` | 暂停当前命令 |
| `↑` / `↓` | 上/下一条历史命令 |

### 1.2 路径概念

- **绝对路径**：以根目录 `/` 为起点，如 `/home/user/file.txt`
- **相对路径**：以当前目录为起点，如 `docs/file.txt`、`../other/`
- **家目录**：`~` 表示当前用户主目录，通常是 `/home/用户名`
- **当前目录**：`.` 表示当前目录，`..` 表示上级目录

### 1.3 man — 查看帮助

```bash
man 命令名        # 显示命令的详细手册
man -k 关键词      # 搜索相关命令（按关键词）
```

进入 `man` 页面后按 `q` 退出，按空格翻页。

### 1.4 目录操作

#### pwd — 显示当前目录

```bash
pwd
```

#### cd — 切换工作目录

```bash
cd        # 进入用户主目录
cd /      # 进入根目录
cd ~      # 进入用户主目录
cd -      # 返回进入此目录之前所在的目录
cd ..     # 返回上级目录
cd ../..  # 返回上两级目录
```

#### ls — 列出目录内容

```bash
ls        # 列出当前目录（隐藏文件除外）
ls -a     # 显示所有文件，包括隐藏文件（. 开头）
ls -l     # 以长格式显示详细信息（权限、大小、时间）
ls -lh    # 人类可读文件大小（K、M、G）
ls -la    # 以列形式显示所有文件
ls -d     # 仅显示目录本身
ls -R     # 递归显示子目录内容
ls -S     # 按文件大小排序
ls -t     # 按修改时间排序（最新在前）
```

`ls -l` 输出解释：

```
-rwxr-xr--  1 user group  4096 Jun 26 10:00 file.txt
^^^^^^^^^  权限（类型+所有者+组+其他）
           ^ 硬链接数
              ^^^^ 所有者
                   ^^^^ 所属组
                        ^^^^ 大小
                             ^^^^^^^^^^^ 修改时间
                                           ^^^^^^^^ 文件名
```

### 1.5 文件操作

#### touch — 创建空文件或更新时间戳

```bash
touch filename
touch {a,b,c}.txt            # 创建 a.txt b.txt c.txt
touch note_{1..5}.txt        # 创建 note_1.txt ~ note_5.txt
```

#### mkdir — 创建目录

```bash
mkdir dirname           # 创建单级目录
mkdir -p parent/child   # 递归创建多层级目录
```

#### rmdir — 删除空目录

```bash
rmdir dirname   # 只能删除空目录
```

#### rm — 删除文件或目录

> **高危命令**，没有回收站，删除后无法恢复。

```bash
rm file            # 删除文件
rm -f file         # 强制删除（不提示）
rm -i file         # 交互式删除（逐个确认）
rm -r dir          # 递归删除目录及子目录
rm -rf dir         # 强制递归删除（⚠️ 小心使用）
rm -v file         # 显示删除过程
```

**支持通配符 `*`：**
- `*.txt` — 匹配所有 `.txt` 结尾的文件
- `data*` — 匹配以 `data` 开头的文件
- `*2024*` — 匹配文件名含 `2024` 的文件

#### cp — 复制文件或目录

```bash
cp source target              # 复制文件
cp -r source_dir target_dir   # 递归复制目录
cp -a source_dir target_dir   # 保留属性递归复制
cp -i source target           # 覆盖前询问
```

#### mv — 移动或重命名

> 同一目录内移动 = 重命名。

```bash
mv source target     # 移动或重命名
mv -i source target  # 覆盖前询问
mv -b source target  # 覆盖前备份
```

### 1.6 查看文件

#### cat — 输出文件内容

```bash
cat file          # 显示内容
cat -n file       # 显示行号
cat f1 f2 > f3    # 合并多个文件
```

#### more / less — 分页查看

```bash
more file     # 按空格翻页，按 q 退出（只能向下）
less file     # 更强大，支持上下键、搜索（/ 搜索）
```

#### head / tail — 首尾部分

```bash
head -n 10 file    # 前 10 行
tail -n 10 file    # 后 10 行
tail -f file       # 实时跟踪新增内容（查看日志最常用）
```

### 1.7 grep — 搜索文本

```bash
grep "pattern" file         # 在文件中搜索
grep -r "pattern" dir       # 递归搜索目录
grep -i "pattern" file      # 忽略大小写
grep -n "pattern" file      # 显示行号
grep -c "pattern" file      # 统计匹配行数
grep -v "pattern" file      # 反向匹配（不含 pattern）
grep -E "pat1|pat2" file    # 匹配多个模式
```

### 1.8 重定向

```bash
命令 > file       # 覆盖写入（将命令的输出写入文件）
命令 >> file      # 追加写入
命令 2> file      # 错误输出重定向
命令 &> file      # 所有输出（含错误）重定向
命令 < file       # 从文件读取输入作为命令的输入
```

### 1.9 管道 `|`

将左侧命令的输出作为右侧命令的输入。

```bash
命令A | 命令B

cat file | grep keyword      # 过滤文件内容
ls | wc -l                   # 统计文件数
ps -ef | grep nginx          # 在进程列表中查找 nginx
```

### 1.10 echo — 输出内容

```bash
echo "hello world"    # 输出字符串
echo $HOME            # 输出变量值
echo `pwd`            # 反引号内作为命令执行
echo $(pwd)           # 更现代的写法
echo -e "a\nb\nc"     # 解析转义字符（换行）
```

### 1.11 文件类型与命令定位

#### file — 查看文件真实类型

```bash
file 文件名    # 不依赖扩展名，显示真实类型（如 JPEG、ASCII text）
```

#### which — 查找命令所在路径

```bash
which 命令名    # 如 which ls → /usr/bin/ls
```

#### type — 查看命令类型

```bash
type 命令名    # 显示是内置命令、别名还是外部程序
```

### 1.12 alias — 命令别名

```bash
alias                     # 列出所有已设别名
alias ll='ls -lh'         # 设置别名
alias rm='rm -i'          # 给 rm 加保护（删除前确认）
unalias ll                # 取消别名

# 永久生效：将 alias 命令写进 ~/.bashrc
```

### 练一练 1

1. 用一条命令列出当前目录下所有文件，按修改时间排序（最新的在前）
2. 创建一个嵌套目录 `project/src/utils`，然后在里面创建一个空文件 `helper.py`
3. 查看 `/etc/passwd` 的前 5 行
4. 用 `grep` 从 `/etc/passwd` 中搜索包含你的用户名的行
5. 把 `ls -l` 的**错误输出**重定向到 `error.log`（故意加一个不存在的路径）

---

## 第二周：提权与安装

> 学会切换用户、安装软件、管理用户和权限。

### 2.1 su / sudo — 用户切换与提权

#### su — 切换用户

```bash
su - [用户名]    # 切换到目标用户（- 加载环境变量）
su -            # 切换到 root（需输入 root 密码）
```

- 普通用户 → 其他用户：**需要输入目标用户密码**
- root → 普通用户：**无需密码**
- 退出当前用户：`exit` 或 `Ctrl + D`

#### sudo — 提权执行

普通用户通过 `sudo` 以 root 身份执行命令（需配置）。

```bash
sudo 命令                 # 以 root 执行
sudo -i                   # 切换到 root shell
```

**配置 sudo 免密：**

```bash
# root 用户执行 visudo
visudo

# 文件末尾添加一行：
用户名 ALL=(ALL) NOPASSWD: ALL

# :wq 保存退出
```

**设置 root 密码：**

```bash
sudo passwd root
```

### 2.2 apt — 软件包管理

> Ubuntu/Debian 系使用，需要 root 权限（加 `sudo`）。

```bash
sudo apt update               # 更新软件源
sudo apt upgrade              # 升级全部软件
sudo apt install 软件名        # 安装
sudo apt remove 软件名         # 卸载（保留配置）
sudo apt purge 软件名          # 卸载（删除配置）
sudo apt search 关键词         # 搜索
sudo apt info 软件名           # 查看软件包信息
sudo apt autoremove            # 清理无用依赖
sudo apt full-upgrade          # 完整系统更新
```

### 2.3 用户与组管理

> 以下命令需要 root 权限。

```bash
# 组操作
groupadd 组名         # 创建组
groupdel 组名         # 删除组

# 用户操作
useradd -m 用户名               # 创建用户并创建家目录
useradd -m -g 组名 用户名        # 指定所属组
userdel -r 用户名               # 删除用户及家目录
passwd 用户名                   # 设置或修改密码
usermod -aG 组名 用户名         # 将用户追加到附属组
chsh -s /bin/bash 用户名        # 更改登录 shell

# 查看
id [用户名]          # 用户 ID、组 ID、附属组
getent passwd        # 查看所有用户
getent group         # 查看所有用户组
```

`getent passwd` 输出格式（7 段）：

```
用户名:密码(x):用户ID:组ID:描述信息:HOME目录:默认Shell
```

### 2.4 rwx 权限详解

| 权限 | 数值 | 文件 | 文件夹 |
|------|------|------|--------|
| `r`（读） | 4 | 查看内容（cat） | 列出内容（ls） |
| `w`（写） | 2 | 修改内容 | 新建/删除/重命名内部文件 |
| `x`（执行） | 1 | 作为程序执行 | 进入目录（cd） |

### 2.5 chmod / chown / umask

#### chmod — 修改权限

> 只有文件所有者或 root 可以修改。

```bash
chmod [-R] 权限 文件或目录
```

**符号表示法：**

```bash
chmod u+x file             # 给所有者加执行
chmod g-w file             # 移除组写权限
chmod o+r file             # 给其他用户加读
chmod u=rwx,g=rx,o=x file  # 精确设置 rwxr-x--x
chmod -R u=rwx,g=rx,o=x dir   # 递归设置目录
```

**数字表示法：**

| 数字 | 权限 | 数字 | 权限 |
|------|------|------|------|
| 7 | `rwx` | 3 | `-wx` |
| 6 | `rw-` | 2 | `-w-` |
| 5 | `r-x` | 1 | `--x` |
| 4 | `r--` | 0 | `---` |

```bash
chmod 755 file    # rwxr-xr-x（常用）
chmod 644 file    # rw-r--r--（常用）
chmod 700 file    # rwx------
```

#### chown — 修改所有者

```bash
chown [-R] [用户][:][组] 文件或目录

chown root file              # 仅改用户
chown :root file             # 仅改组
chown root:root file         # 同时修改
chown -R user:group dir      # 递归修改
```

#### umask — 默认权限掩码

```bash
umask          # 查看当前掩码（默认 0022）
umask 0027     # 设置掩码
```

- 文件创建默认权限 = `666 - umask`
- 目录创建默认权限 = `777 - umask`

### 2.6 wc — 数量统计

```bash
wc file       # 行数、单词数、字节数
wc -l file    # 只统计行数
wc -w file    # 只统计单词数
wc -c file    # 只统计字节数
```

### 练一练 2

1. 创建一个新用户 `study` 并设置密码，然后用 `su` 切换到该用户
2. 用 `sudo apt install` 安装一个软件（如 `htop`），然后卸载它
3. 创建一个文件，用 `chmod 600` 改成仅自己可读写，再用 `ls -l` 验证
4. 查看当前用户有哪些附属组：`id` 命令
5. 统计 `/etc/passwd` 文件有多少行

---

> **继续阅读：[Linux 学习笔记（二）：进阶操作与系统管理 →](/blog/linux-part2-advanced)**
