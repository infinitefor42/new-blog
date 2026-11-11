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

4.设 $z = f(x, y)$ 是区域 $D = \{(x, y) \mid 0 \le x \le 1,\ 0 \le y \le 1\}$ 上的可微函数，$f(0, 0) = 0$，且 $\left. dz \right|_{(0, 0)} = 3\,dx + 2\,dy$，求极限
$$\lim\limits_{x \to 0^+} \frac{\displaystyle\int_0^{x^2} dt \int_x^{\sqrt{t}} f(t, u)\,du}{1 - \sqrt[4]{1 - x^4}}$$

---

## 参考解答

### 第 1 题

令 $t = -x$（$t \to +\infty$），原式变为：
$$\lim\limits_{t \to +\infty} \left( \sqrt{at^2 + bt - 1} - 4t \right) = 1$$

分子有理化：
$$\frac{(a-16)t^2 + bt - 1}{\sqrt{at^2 + bt - 1} + 4t}$$

为使极限存在且为有限值，分子中 $t^2$ 的系数必须为零，故 $a = 16$。

代入 $a = 16$ 后：
$$\lim\limits_{t \to +\infty} \frac{bt - 1}{\sqrt{16t^2 + bt - 1} + 4t} = \frac{b}{8} = 1$$

因此 $b = 8$。

$$\boxed{a = 16, \quad b = 8}$$

### 第 2 题

函数的间断点为分母为零处：$x = -1,\ 0,\ 1$。

- **$x = -1$**：$\ln|1+x| \to -\infty$，分母趋于非零有限值，故为无穷间断点（第二类）。
- **$x = 0$**：$\ln|1+x| \sim x$，$e^x - 1 \sim x$，极限 $\lim\limits_{x \to 0} \frac{x}{x \cdot (-1)} = -1$ 存在，故为可去间断点（第一类）。
- **$x = 1$**：分母趋于 $0$，分子趋于 $\ln 2 \neq 0$，故为无穷间断点（第二类）。

**2** 个

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

### 第 4 题

**第一步：处理分母（等价无穷小）。**

由 $(1 - x^4)^{1/4} - 1 \sim -\dfrac{1}{4}x^4$，得
$$1 - \sqrt[4]{1 - x^4} \sim \frac{x^4}{4} \quad (x \to 0^+)$$

**第二步：交换分子的积分次序。**

注意当 $0 \le t \le x^2$ 时 $\sqrt{t} \le x$，内层积分下限大于上限，先变号：
$$I(x) = \int_0^{x^2} dt \int_x^{\sqrt{t}} f(t, u)\,du = -\int_0^{x^2} dt \int_{\sqrt{t}}^{x} f(t, u)\,du$$

积分区域为 $\{(t, u) \mid 0 \le t \le x^2,\ \sqrt{t} \le u \le x\}$，改写成先 $t$ 后 $u$：
$$I(x) = -\int_0^x du \int_0^{u^2} f(t, u)\,dt$$

**第三步：在原点对 $f$ 做微分展开。**

由 $f$ 在 $(0,0)$ 可微、$f(0,0) = 0$ 及 $\left. dz \right|_{(0,0)} = 3\,dx + 2\,dy$，知 $f_x(0,0) = 3$，$f_y(0,0) = 2$，故
$$f(t, u) = 3t + 2u + o\!\left(\sqrt{t^2 + u^2}\right)$$

**第四步：洛必达求极限。**

分子 $I(x)$ 对 $x$ 求导得 $I'(x) = -\displaystyle\int_0^{x^2} f(t, x)\,dt$，分母导数 $x^3(1-x^4)^{-3/4} \sim x^3$，于是
$$\lim\limits_{x \to 0^+} \frac{I(x)}{x^4/4} = \lim\limits_{x \to 0^+} \frac{-\displaystyle\int_0^{x^2} f(t, x)\,dt}{x^3}$$

代入展开式：
$$\int_0^{x^2} f(t, x)\,dt = \int_0^{x^2} \big(3t + 2x + o(x)\big)\,dt = \frac{3}{2}x^4 + 2x^3 + o(x^3)$$

因此
$$\lim\limits_{x \to 0^+} \frac{-\left(\frac{3}{2}x^4 + 2x^3 + o(x^3)\right)}{x^3} = \lim\limits_{x \to 0^+} \left(-\frac{3}{2}x - 2\right) = -2$$

$$\boxed{-2}$$
