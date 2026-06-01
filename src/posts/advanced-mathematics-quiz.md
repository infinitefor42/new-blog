---
title: 高等数学试题
date: 2026-03-28 11:21:42
comments: true
tags:
  - 高等数学
categories:
  - 数学
mathjax: true
---
1.已知 $\lim\limits_{x \to -\infty} (4x + \sqrt{ax^2 - bx - 1}) = 1$，其中 $a > 0$，求 $a$ 和 $b$ 的值。

2.函数 $f(x)=\frac{\ln|1+x|}{(e^x - 1)(x - 1)}$有 _______个第二类间断点（填阿拉伯数字）。

3.求函数 $z = 1 - \left( \frac{x^2}{a^2} + \frac{y^2}{b^2} \right)$ 在点 $\left( \frac{a}{\sqrt{2}}, \frac{b}{\sqrt{2}} \right)$ 处，沿曲线 $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ 在该点的内法线方向的方向导数。

---

## 参考解答

### 第 1 题

令 $t = -x$（$t \to +\infty$），原式变为：
$$\lim_{t \to +\infty} \left( \sqrt{at^2 + bt - 1} - 4t \right) = 1$$

分子有理化：
$$\frac{(a-16)t^2 + bt - 1}{\sqrt{at^2 + bt - 1} + 4t}$$

为使极限存在且为有限值，分子中 $t^2$ 的系数必须为零，故 $a = 16$。

代入 $a = 16$ 后：
$$\lim_{t \to +\infty} \frac{bt - 1}{\sqrt{16t^2 + bt - 1} + 4t} = \frac{b}{8} = 1$$

因此 $b = 8$。

$$\boxed{a = 16, \quad b = 8}$$

### 第 2 题

函数的间断点为分母为零处：$x = -1,\ 0,\ 1$。

- **$x = -1$**：$\ln|1+x| \to -\infty$，分母趋于非零有限值，故为无穷间断点（第二类）。
- **$x = 0$**：$\ln|1+x| \sim x$，$e^x - 1 \sim x$，极限 $\lim_{x \to 0} \frac{x}{x \cdot (-1)} = -1$ 存在，故为可去间断点（第一类）。
- **$x = 1$**：分母趋于 $0$，分子趋于 $\ln 2 \neq 0$，故为无穷间断点（第二类）。

$$\boxed{1}$$

### 第 3 题

计算偏导数：
$$\frac{\partial z}{\partial x} = -\frac{2x}{a^2}, \quad \frac{\partial z}{\partial y} = -\frac{2y}{b^2}$$

在点 $\left(\frac{a}{\sqrt{2}}, \frac{b}{\sqrt{2}}\right)$ 处：
$$\frac{\partial z}{\partial x} = -\frac{\sqrt{2}}{a}, \quad \frac{\partial z}{\partial y} = -\frac{\sqrt{2}}{b}$$

椭圆在该点的外法线方向（梯度方向）为 $\left(\frac{\sqrt{2}}{a}, \frac{\sqrt{2}}{b}\right)$，内法线方向为其反方向。单位内法线向量为：
$$\vec{n} = -\frac{1}{\sqrt{\frac{1}{a^2}+\frac{1}{b^2}}} \left(\frac{1}{a}, \frac{1}{b}\right)$$

方向导数：
$$\frac{\partial z}{\partial \vec{n}} = \left(-\frac{\sqrt{2}}{a}, -\frac{\sqrt{2}}{b}\right) \cdot \vec{n} = \frac{\sqrt{2}\left(\frac{1}{a^2}+\frac{1}{b^2}\right)}{\sqrt{\frac{1}{a^2}+\frac{1}{b^2}}} = \sqrt{2} \cdot \sqrt{\frac{1}{a^2}+\frac{1}{b^2}}$$

$$\boxed{\frac{\partial z}{\partial \vec{n}} = \frac{\sqrt{2(a^2+b^2)}}{ab}}$$
