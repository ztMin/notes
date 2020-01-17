# TypeScript 快速入门

本文主要讲解TypeScript的各种写法，为大家能够快速掌握**TypeScript**这么语言为目的，与`JavaScript`相同部分不再讲解，所以没有了解`JavaScript`基础的同学建议请先移步到[`MDN学习`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)。如需深度学习建议查看官方文档。

## 安装与编译

```npm
// 全局安装
npm install -g typescript

// 编译，编译成功后会在当前目录下生成对应的js文件
tsc *.ts
```

## TypeScript支持的基本类型

## 基础类型

**TypeScript**的基础类型有：`boolean`、`number`、`string`、`Array`、`enum`、`any`、`void`、`undefined`、`null`、`never`、`object`。具体如下图：

```ts
let isDone: boolean = false; // 指定变量为布尔类型。
let count: number = 6; // 指定变量为数字类型
let name: string = "bob"; // 指定变量为字符串类型

let list: number[] = [1,2,3]; // 指定变量为数字数组
let list: Array<number> = [1, 2, 3]; // 指定变量为数组泛型，Array<元素类型>
let list: [string, number] = ['hello', 10]; // 指定变量为数组并且索引0为String，索引1为Number类型，后面的索引只要是 String 或 Number 即可。

// 枚举
enum Color {Red = 1, Green, Blue}; // 默认从0开始为元素编号。也可以手动的指定成员的数值，如改成从1开始编号
let c: Color = Color.Green;
let colorName: string = Color[2];
console.log(colorName); // 输出 'Green'

let notSure: any = 4; // 不确定类型（即任意类型）
function warnUser(): void {console.log('这里只是打印警告信息，不返回任何值')}; // 与`any`相反， `void`表示没有任何类型。
// 默认情况下null和undefined是所有类型的子类型。 就是说你可以把 null和undefined赋值给number类型的变量。 当指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。
let u: undefined = undefined; // 指定变量为`undefined`类型
let n: null = null; // 指定变量为`null`类型
function err(msg: string): never {throw new Error(msg)}; // `never`类型表示的是那些永不存在的值的类型。
function create(o: object | null): void {}; // object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。

// 类型断言（可以理解为我断定该变量为某个类型）
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length; // `尖括号` 语法
let strLength: number = (someValue as string).length; // `as` 语法
```

## 接口 interface

接口能够描述JavaScript中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

```ts
// 接口定义
interface SquareConfig {
  width: number; // 一般属性
  readonly display: string; // 只读属性（赋值后再也不能被改变）
  color?: string; // 可选属性
  [propName: string]: any; // 表示对象可以有任意数量的属性，只要他们不是前面定义的属性，其他属性满足`any`类型即可
}
// 使用场景
function createSquare(config: SquareConfig): { color: string; area: number } {}
let mySquare = createSquare({ display: "block", width: 100 });

// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 可索引的类型（只支持 字符串和数字） 可以将索引签名设置为只读，防止给索引赋值。
interface StringArray {
  readonly [index: number]: string;
}
let myArray: StringArray = ["Bob", "Fred"];

// 类接口
interface ClockInterface { // 定义一个类接口
  currentTime: Date;
  setTime(d: Date);
}
interface ClockConstructor { // 构造函数类接口
  new (hour: number, minute: number): ClockInterface;
}
class Clock implements ClockInterface { // 引用类接口
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) { }
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute);
}
let digital = createClock(Clock, 12, 17);

// 继承接口
interface Shape {
  color: string;
}
interface PenStroke {
  penWidth: number;
}
interface Square extends Shape, PenStroke { // 一个接口可以继承多个接口，创建出多个接口的合成接口。
  sideLength: number;
}
let square = <Square>{};

// 混合类型
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
function getCounter(): Counter {
  let counter = <Counter>function (start: number) { };
  counter.interval = 123;
  counter.reset = function () { };
  return counter;
}
let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

// 接口继承类 （当接口继承了一个类类型时，它会继承类的成员但不包括其实现。）
class Control {
  private state: any;
}
interface SelectableControl extends Control {
  select(): void;
}
```

## 类

### 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。不同于接口，抽象类可以包含成员的实现细节。抽象类中未声明的方法在派生类中直接实现调用报错

```ts
abstract class Department { // 声明抽象类
  constructor(public name: string) {}
  printName(): void {
    console.log('Department name: ' + this.name);
  }
  abstract printMeeting(): void; // 必须在派生类中实现
}
class AccountingDepartment extends Department { // 派生类继承抽象类
  constructor() {
    super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
  }
  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.');
  }
  generateReports(): void {
    console.log('Generating accounting reports...');
  }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

## 函数

函数类型包含两部分：**参数类型**和**返回值类型**。 当写出完整函数类型的时候，这两部分都是需要的。每个参数指定一个名字和类型， 这个名字只是为了增加可读性，具体定义函数的时候参数名称可以不用与函数类型的名称一致。

```ts
function add(x: number, y: number): number { // 为函数定义类型，参数x、y和返回值都必须是number类型
    return x + y;
}
// 完整写法
let myAdd: (x: number, y: number) => number = function(x: number, b: number): number { return x + b; };

// TypeScript里的每个函数参数都是必须的，传递给一个函数的参数个数必须与函数期望的参数个数一致。如需实现可选参数具体如下（注意： 可选参数必须跟在必须参数后面）
function buildName(firstName: string, lastName?: string): void {}; // lastName为可选参数
function buildName(firstName: string, lastName = "Adams"): void {}; // 给定默认值时类型也限制在默认值的类型

// 剩余参数收集
function buildName(firstName: string, ...restOfName: string[]): void {};

// this参数（this参数是个假参数，它出现在参数列表的最前面）
interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

// 重载
function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {if(typeof x == "object") {return number} else if (typeof x == "number") {return {suit: string; card: number; }}}
pickCard([{suit: 'diamonds', card: 2}])
pickCard(2)
pickCard('diamonds'); // 错误，没有定义支持接收一个字符串参数
```

## 泛型

一个函数接收一个任意类型的参数，返回的数据类型必须要和传入的数据类型一致。

```ts
function identity(x: any): any; // 这样会导致传入number返回string也能通过
function identity<T>(x: T): T; // <T> 定义了一个 类型变量 为 T，这个identity函数叫做泛型
function loggingIdentity<T>(arg: Array<T>): Array<T>; // 泛型变量T可以当做类型的一部分使用，而不是整个类型，增加了灵活性。
// 泛型接口（除了泛型接口，我们还可以创建泛型类。 注意，无法创建泛型枚举和泛型命名空间。）
interface GenericIdentityFn<T> {
  <T>(arg: T): T;
}
// 泛型类（泛型类指的是实例部分的类型，类的静态属性不能使用这个泛型类型。）
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
// 泛型约束
interface Lengthwise {
  length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T; // 表示T类型一定会有一个lenth属性，并且为number类型
// 调用泛型
let output = identity<string>("myString"); // 这里将T指定为string类型，并传入'myString'字符串
let output = identity("myString"); // 自动识别传入的参数类型来确定T的类型
let myIdentity: GenericIdentityFn<number> = identity; // 泛型接口引用
let stringNumeric = new GenericNumber<string>(); // 实例化泛型类
loggingIdentity({length: 10, value: 3}); // 约束泛型 需要传入符合约束类型的值
```

## 枚举

使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例。 TypeScript支持数字的和基于字符串的枚举。

### 数字枚举

```ts
enum Direction {
  Up = 1, // 1 (定义了一个数字枚举, 其余的从开始值自动增长。如果初始化未定义则从 0 开始)
  Down, // 2
  Left, // 3
  Right // 4
}
```

### 字符串枚举

字符串枚举有细微的`运行时的差别`，每个成员都必须用字符串字面量

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

### 异构枚举

```ts
enum BooleanLikeHeterogeneousEnum { // 枚举可以混合字符串和数字成员，但不建议这样做
  No = 0,
  Yes = "YES",
}
```

### 计算的和常量成员

```ts
enum FileAccess {
  // constant members
  None,
  Read    = 1 << 1,
  Write   = 1 << 2,
  ReadWrite  = Read | Write,
  // computed member
  G = "123".length
}
```
