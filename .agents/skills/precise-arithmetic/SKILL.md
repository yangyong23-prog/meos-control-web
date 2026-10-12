---
name: precise-arithmetic
description: '为 meos-control-web 根应用处理数值加减乘除、复合运算与 JavaScript 浮点数精度问题的技能。业务运算必须使用 `preciseAdd`、`preciseSubtract`、`preciseMultiply`、`preciseDivide`；复合运算通过第三个参数控制中间结果保留 Decimal，仅在最终一步转换为 number。禁止在业务文件中重复引入 Decimal 实现四则运算。触发词：加法、减法、乘法、除法、四则运算、复合运算、浮点数、精度问题、decimal.js、Decimal、金额、比例、效率、数值计算。'
argument-hint: '说明目标文件、计算公式，以及输入输出的数值类型和除零处理要求'
---

# meos-control-web 精确四则运算技能

## 技能目标

在根应用 `src/` 中实现、修改或审查数值计算时，统一复用 `src/utils/tools.ts` 已有的高精度四则运算方法，避免 JavaScript 原生浮点数运算产生 `8.099999...`、`0.30000000000000004` 等误差。

项目公共方法如下：

- `preciseAdd(augend, addend, shouldToNumber?)`：精确加法
- `preciseSubtract(minuend, subtrahend, shouldToNumber?)`：精确减法
- `preciseMultiply(multiplicand, multiplier, shouldToNumber?)`：精确乘法
- `preciseDivide(dividend, divisor, shouldToNumber?)`：精确除法

第三个参数默认为 `true`：

- `true` 或省略：返回 `number`
- `false`：返回 `Decimal`，用于继续参与下一步精确运算

这些方法统一从 `@/utils/tools` 导入，底层由 `decimal.js` 实现，业务代码不再重复封装。

## 何时使用

以下场景必须使用本技能：

- 新增或修改业务数值的加、减、乘、除计算
- 实现 `a / b * c / d`、`(a + b) * c`、百分比等复合计算
- 修复浮点数精度问题
- 计算金额、费率、百分比、效率、温差、能耗或累计值
- 看到业务代码直接使用 `Decimal(...).plus/minus/times/dividedBy(...)`
- 看到业务文件自行定义 `formatDisplayValue`、`accurateAdd`、`floatMultiply` 等同类方法
- 审查代码时发现原生四则运算可能影响业务结果或界面展示

只处理根应用 `src/` 时，可直接复用 `@/utils/tools`。若目标位于 `operation-duty-homepage`、`meoi-aim-rcrm-web` 或其它独立子应用，先确认其依赖边界，不能跨应用强行引用根应用工具文件。

## 强制规则

### 1. 业务四则运算必须使用公共方法

根据运算符进行一一映射：

| 运算 | 必须使用 |
| --- | --- |
| `a + b` | `preciseAdd(a, b)` |
| `a - b` | `preciseSubtract(a, b)` |
| `a * b` | `preciseMultiply(a, b)` |
| `a / b` | `preciseDivide(a, b)` |
| 包含多个运算步骤的公式 | 中间步骤第三个参数传 `false`，最终步骤省略或传 `true` |

这里的“业务四则运算”指可能包含小数或需要保证结果准确性的数值计算。

以下情况不要求替换：

- 字符串拼接
- 数组索引、循环计数器等确定为整数的控制逻辑
- 日期时间库内部的时间加减
- 位运算
- ECharts、CSS 等只表达布局坐标且不参与业务结果的简单整数计算

如果不能明确确认是纯整数控制逻辑，应优先使用公共精确运算方法。

### 2. 复合运算必须保留中间结果为 `Decimal`

当一个公式包含两个或更多四则运算步骤时，中间步骤必须将第三个参数设置为 `false`，避免提前转换成 JavaScript `number`。

不要使用：

- `preciseMultiply(preciseDivide(a, b), c)`
- `preciseDivide(preciseMultiply(preciseDivide(a, b), c), d)`

因为默认返回 `number`，中间结果重新进入 JavaScript 浮点运算后仍可能损失精度。

应让中间步骤返回 `Decimal`，最终步骤再返回 `number`：

- `const divided = preciseDivide(a, b, false)`
- `const multiplied = preciseMultiply(divided, c, false)`
- `const result = preciseDivide(multiplied, d)`

公式 `(a + b) * c` 应先调用 `preciseAdd(a, b, false)`，再将返回的 `Decimal` 传给 `preciseMultiply`。不要在中间步骤调用 `.toNumber()` 或 `.toFixed()`。

### 3. 禁止在业务文件重复引入 `decimal.js`

不要在组件、页面、hook 或普通业务工具中为了四则运算再次编写：

- `new Decimal(a).plus(b)`
- `new Decimal(a).minus(b)`
- `new Decimal(a).times(b)`
- `new Decimal(a).dividedBy(b)`

应改为从 `@/utils/tools` 导入对应方法。

仅当需求超出四则运算能力，例如需要 Decimal 特有的高精度幂、对数、复杂舍入链路或必须保持 Decimal 实例时，才允许直接使用 `decimal.js`，并说明公共方法不适用的原因。

### 4. 不要用 `toFixed` 掩盖运算误差

`toFixed` 用于展示格式，不是精确运算方案。正确顺序是：

1. 使用 `preciseAdd` / `preciseSubtract` / `preciseMultiply` / `preciseDivide` 完成计算
2. 仅在产品明确要求固定小数位时，对最终结果进行展示格式化

不要把中间结果反复 `toFixed` 后再参与计算，避免字符串转换和提前舍入导致新的误差。

### 5. 明确空值和非法值语义

公共方法接受 `Decimal.Value` 支持的有效数字值，但调用方仍负责业务判空。

- `null`、`undefined`、空字符串代表“无数据”时，应在调用前处理
- 不要擅自把所有空值都转换成 `0`
- 只有业务语义明确为缺省零时，才使用 `value ?? 0`
- 不要用 `value || 0`，因为它会混淆 `0` 与其它假值

### 6. 除法必须考虑除数为零

`preciseDivide` 在除数为 `0` 时抛出 `RangeError`。复合运算中的每一次除法都会执行该检查，但调用方仍应根据业务语义提前判断除数。根据业务需求选择：

- 无数据展示：先判断除数，返回 `--` 或空值
- 比例无法计算：先判断除数，返回约定值
- 除零属于程序错误：允许异常暴露或在上层统一处理

不要静默返回 `Infinity`，也不要未经需求确认擅自返回 `0`。

### 7. 新增或修改公共方法时必须补齐标准 JSDoc

在 `src/utils/tools.ts` 中新增或修改精确运算公共方法时，注释至少包含：

- 方法用途说明
- 每个参数对应的 `@param {类型} 参数名 - 说明`
- 返回值对应的 `@returns {类型} 说明`
- 至少一个 `@example` 调用示例

如果方法存在不同返回分支，应在示例中同时展示典型分支。例如带 `shouldToNumber` 的方法至少展示：

- 默认返回 `number` 的调用
- 第三个参数传 `false` 返回 `Decimal` 的调用

注释格式统一使用完整 JSDoc，不要只写一行描述，也不要省略参数、返回值或示例。

## 标准工作流

### 第 1 步：识别计算语义

确认：

1. 运算是加、减、乘还是除
2. 输入是否可能包含小数或数字字符串
3. 空值是否代表无数据还是默认零
4. 最终结果需要数字还是格式化字符串
5. 是单次运算还是包含多个步骤的复合运算
6. 除法是否可能出现除数为零

### 第 2 步：搜索现有局部实现

在目标文件及相关调用链中检查：

- 是否直接导入了 `decimal.js`
- 是否存在自行封装的精度方法
- 是否直接使用原生运算符完成业务计算
- 是否通过 `toFixed`、`Math.round` 或 `Number.EPSILON` 临时规避精度问题

只修改与当前任务直接相关的计算，不批量重构无关代码。

### 第 3 步：导入公共方法

从 `@/utils/tools` 按需导入，不要一次导入全部四个方法：

- 加法只导入 `preciseAdd`
- 减法只导入 `preciseSubtract`
- 乘法只导入 `preciseMultiply`
- 除法只导入 `preciseDivide`
- 复合公式按实际运算符导入需要的四则运算方法

若文件已经从 `@/utils/tools` 导入其它方法，应合并到现有 import。

### 第 4 步：替换计算并保持业务语义

替换时遵守：

- 保持原操作数顺序
- 保持原判空逻辑
- 保持原返回类型和展示格式要求
- 不顺手重构周边无关代码
- 删除因替换而变得未使用的局部函数或 `Decimal` 导入

连续运算按原公式分步表达。中间步骤第三个参数传 `false`，最终步骤省略第三个参数或传 `true`。优先使用语义清晰的中间变量，不要重新发明一个可变运算符执行器。

### 第 5 步：验证典型精度案例

根据实际运算至少验证对应案例：

- 加法：`0.1 + 0.2` 应得到 `0.3`
- 减法：`0.3 - 0.1` 应得到 `0.2`
- 乘法：`0.1 * 0.2` 应得到 `0.02`
- 除法：`0.3 / 0.1` 应得到 `3`
- 复合运算：`preciseMultiply(preciseDivide(1, 3, false), 3)` 应得到 `1`
- 当前缺陷案例：例如 `8 + 0.1` 不应出现 `8.099999...`
- 除法：验证除数为 `0` 时符合调用方业务处理

### 第 6 步：完成静态检查

至少检查：

1. 目标文件没有新增 TypeScript、ESLint 或 Vue 错误
2. 没有残留未使用的 `Decimal` 或局部精度函数
3. 公共方法导入路径为 `@/utils/tools`
4. 空值、返回类型和展示格式没有被意外改变
5. 代码中没有继续使用原生运算符实现同一处业务四则运算
6. 新增或修改的公共运算方法注释包含完整的 `@param`、`@returns` 和 `@example`

## 示例决策

### 展示值加偏移量

输入值为空时展示 `--`，偏移量缺失时业务约定为 `0`：

- 先使用 `isNil(value)` 判空
- 有值时调用 `preciseAdd(value, offset ?? 0)`
- 不在组件内再定义 Decimal 包装函数

### 百分比计算

公式为 `current / total * 100`：

1. 先判断 `total` 是否为 `0` 或无数据
2. 使用 `preciseDivide(current, total, false)` 保留中间结果
3. 使用 `preciseMultiply(divided, 100)` 得到最终 `number`
4. 最后按展示要求决定是否 `toFixed`

### 多次乘除计算

公式为 `a / b * c / d`：

1. 先判断 `b`、`d` 是否为 `0` 或无数据
2. `preciseDivide(a, b, false)` 得到第一个 `Decimal` 中间结果
3. `preciseMultiply(divided, c, false)` 得到第二个 `Decimal` 中间结果
4. `preciseDivide(multiplied, d)` 在最终一步返回 `number`

### 差值计算

温差、能耗差或前后值差统一使用 `preciseSubtract(later, earlier)`，不要通过加负数绕过减法方法。

## 完成标准

满足以下条件才算完成：

- 当前业务四则运算已复用正确的公共方法
- 包含多个步骤的公式已在中间步骤传入 `false`，仅最终一步转换为 `number`
- 没有为四则运算新增局部 `Decimal` 依赖或重复封装
- 操作数顺序、空值语义和返回类型保持正确
- 除法已明确处理除数为零的行为
- 精度缺陷案例已消除
- 相关文件静态检查无新增错误
- 公共方法的 JSDoc 已包含参数、返回值和调用示例

## 本技能沉淀出的项目经验

1. 根应用已在 `src/utils/tools.ts` 统一提供四个精确运算方法，并通过第三个参数支持复合运算，业务文件不得重复实现。
2. 精确计算与展示格式化是两个步骤：先保证运算正确，再按需求格式化。
3. `value ?? 0` 只能用于业务明确允许缺省零的场景，不能把所有无数据静默变成零。
4. 除零必须显式决策，不能依赖 JavaScript 的 `Infinity`。
5. 修改应保持外科手术式范围，只替换与任务相关的计算并清理本次产生的冗余代码。
6. 四个方法默认返回 `number`；复合公式的中间步骤必须传 `false` 返回 `Decimal`，最终步骤再返回 `number`。
7. 公共方法注释必须使用完整 JSDoc，至少包含 `@param`、`@returns` 与 `@example`。
