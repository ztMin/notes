# ECMAScript 6

ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。
ES6声明变量有六种方法`var`、`function`、`let`、`const`、`import`、`class`。

## let 和 const 块级作用域

- ES6 新增`let`和`const`命令来声明变量
- `let`与`var`用法类似，不同的是`let`和`const`是一个**块级作用域**变量
- `const`定义的是一个常量定义的时候就要赋初始值并不能再修改
- `let`和`const`不存在**变量提升**现象，即变量可以再声明之前使用。
- 在代码块内使用`let`和`const`声明变量之前，都不可使用该变量，这就是**暂时性死区**
- `let`和`const`不允许在相同作用域内，重复声明同一个变量，即**不允许重复声明**，但内层作用域可以定义外层作用域的同名变量。

```js
{ // ES6 允许块级作用域的任意嵌套。
  let a = [];
  for (let i = 0; i < 10; i++) {
    a[i] = function () {
      console.log(i);
    };
  }
  a[6](); // 6
}
```

## 解构

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于`undefined`和`null`无法转为对象，所以无法对她们进行解构。等号左边的变量会被赋予等号右边对应的值。还可以使用嵌套解构。如解构不成功，变量的值就等于`undefined`。解构赋值允许指定默认值。对象的解构与数组有一个重要的不同。**数组的元素是按次序排列的**，变量的取值由它的位置决定；**而对象的属性没有次序，变量必须与属性同名**，才能取到正确的值。具体如下例子：

```js
let [a, b, c] = [1, 2, 3]; // 数组解构 a=1, b=2, c=3
let [foo, [[bar], baz]] = [1, [[2], 3]]; //嵌套解构 foo=1, bar=2, baz=3
let [foo] = []; // 解构不成功 foo=undefined
let [foo = true] = []; // 指定默认值(当成员严格等于(===)`undefined`，默认值才会生效) foo=true
let { bar, foo } = { foo: 'aaa', bar: 'bbb' }; // 对象解构
let { foo: baz } = { foo: 'aaa', bar: 'bbb' }; // 变量名与属性名称不一致 baz='aaa'
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr; // 对数组对象属性的解构 first=1, last=3
let { p, p: [x, { y }] } = {p: ['Hello', {y: 'World'}]} // 对象多层级解构 p=['Hello', {y: 'World'}], x='Hello', y='World'
// 圆括号使用注意事项 -> 错误示例（变量声明语句，模式不能使用圆括号）
let [(a)] = [1];
let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};
let { o: ({ p: p }) } = { o: { p: 2 } };
function f([(z)]) { return z; };
function f([z,(x)]) { return x; };
// 圆括号使用注意事项 -> 正确（注意将变量提前声明好）
[(b)] = [3]; // 正确
({ p: (d) } = {}); // 正确
[(parseInt.prop)] = [3]; // 正确
```

## Symbol

`Symbol`是ES6引入的一种新的原始数据类型，它表示独一无二的值。凡是属性名属于`Symbol`类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。
**注意，**

1. `Symbol`函数前不能使用new命令，否则会报错。这是因为生成的 `Symbol` 是一个原始类型的值，不是对象。也就是说，由于 `Symbol` 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。
2. `Symbol`值作为对象属性名时，不能用点运算符。在对象的内部，使用 `Symbol` 值定义属性时，`Symbol` 值必须放在方括号之中。
3. `Symbol`作为属性名，遍历对象的时候，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。可以使用`Object.getOwnPropertySymbols()` 或者`Reflect.ownKeys()`获取。

```js
let s1 = Symbol('foo'); // Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
let s2 = Symbol('foo');
let s3 = Symbol('foo-3');
s1 // Symbol(foo)
s1 == s2 // false

// Symbol 值不能与其他类型的值进行运算，会报错。
s1 + 'a'; // Uncaught TypeError: Cannot convert a Symbol value to a string

// Symbol 值可以显式转为字符串。
String(s1) || s1.toString()  // Symbol(foo)

//Symbol 值也可以转为布尔值，但是不能转为数值。
Boolean(s1) || !!s1 // true

// Symbol 的描述是挂在原型上（Symbol.prototype.description）
s1.description // foo

// 作为属性名的Symbol
let obj = {[s1]: 's1'};
obj[s2] = 's2';
Object.defineProperty(obj, s3, { value: 's3' });

// 属性名的遍历
const keys = Object.getOwnPropertySymbols(obj); // 获取所有Symbols类型的属性
const keys = Reflect.ownKeys(obj); // 获取对象的所有属性 （Symbols类型属性会排在最后）
keys.forEach(key => console.log(obj[key])); // 遍历

// Symbol.for() 接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。
let s1 = Symbol.for('foo'); // 与Symbol()区别是，Symbol.for()被登记在全局环境中供搜索，Symbol()不会。
let s2 = Symbol.for('foo');
s1 === s2 // true

// Symbol.for()的这个全局登记特性，可以用在不同的 iframe 或 service worker 中取到同一个值。
iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo'); // true

// Symbol.keyFor()方法返回一个已登记的 Symbol 类型值的key。（即查找使用Symbol.for()声明的Symbol，没找到则返回 undefined）
Symbol.keyFor(s1) // "foo"
```

### 内置的 Symbol 值

除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。

```js
// Symbol.hasInstance 当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。
class MyClass {
  static [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}
1 instanceof MyClass // false
2 instanceof MyClass // true
[1, 2, 3] instanceof new MyClass() // true

// Symbol.isConcatSpreadable 一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。
let arr = [3,4];
arr[Symbol.isConcatSpreadable] = false; // 默认等于undefined。该属性等于true时，也有展开的效果。
[1, 2].concat(arr); // [1,2,[3,4]]
let obj = {length: 2, 0: 'c', 1: 'd'};
obj[Symbol.isConcatSpreadable] = true; // 类似数组的对象正好相反，默认不展开。它的Symbol.isConcatSpreadable属性设为true，才可以展开。
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']

// Symbol.species 指向一个构造函数。创建衍生对象时，会使用该属性。
class MyArray extends Array {}
const a = new MyArray(1, 2, 3);
const b = a.map(x => x + 1); // b 是 a 的衍生对象，也是MyArray的实例
b instanceof MyArray // true

class MyArray2 extends Array {
  static get [Symbol.species]() { return Array; }
}
const a = new MyArray2(1, 2, 3);
const b = a.map(x => x + 1); // b 是 a 的衍生对象，也是MyArray的实例
b instanceof MyArray2 // false
b instanceof Array // true

// Symbol.match 指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。
class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}
'e'.match(new MyMatcher()) // 1

// Symbol.replace 指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。
const x = {};
x[Symbol.replace] = (...s) => console.log(s);
'Hello'.replace(x, 'World') // ["Hello", "World"]

// Symbol.search 指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值。
class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}
'foobar'.search(new MySearch('foo')) // 0

// Symbol.split 指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值。
class MySplitter {
  constructor(value) {
    this.value = value;
  }
  [Symbol.split](string) {
    let index = string.indexOf(this.value);
    if (index === -1) {
      return string;
    }
    return [
      string.substr(0, index),
      string.substr(index + this.value.length)
    ];
  }
}
'foobar'.split(new MySplitter('foo')) // ['', 'bar']

// Symbol.iterator 指向该对象的默认遍历器方法。
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
[...myIterable] // [1, 2, 3]

// Symbol.toPrimitive 指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
```

## Set 和 Map 数据结构

### Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。属性： `size`返回`Set`实例的成员总数。实例方法有：

- `Set.prototype.add(value)` 添加某个值，并返回`Set`实例（所以可以链式写法）。
- `Set.prototype.delete(value)` 删除某个值，返回一个布尔值表示是否删除成功。
- `Set.prototype.has(value)` 返回一个布尔值，表示该值是否存在。
- `Set.prototype.clear()` 清除所有成员，没有返回值。
- `Set.prototype.keys()` 返回键名的遍历器
- `Set.prototype.values()` 返回键值的遍历器
- `Set.prototype.entries()` 返回键值对的遍历器
- `Set.prototype.forEach()` 使用回调函数遍历每个成员

```js
const s = new Set();
const set = new Set([1, 2, 3, 4, 4]);

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

### WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 的区别具体如下几点。

1. WeakSet 的成员只能是对象，而不能是其他类型的值。
2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
3. WeakSet 没有`size`、`forEach`等属性和遍历方法。只有`add(value)`、`delete(value)`、`has(value)`三个实例方法。

```js
const ws = new WeakSet([1, 2]); // 错误，因为WeakSet的成员只能是对象
const ws = new WeakSet([[1,2], [3, 4]]); // 正确 （[1,2]和[3, 4]什么时候被回收）
```

### Map

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。`Map`的“键”范围不限于字符串，各种类型的值（包括对象）都可以当作键。

```js
const m = new Map();
const o = {p: 'Hello World'};
m.set(o, 'content')
m.get(o) // "content"
m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

## Proxy && Reflect

`Proxy` 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

`Reflect`对象的设计目的有下面4点：

1. 将`Object`对象中属于语言内部方法的放到`Reflect`对象上。（目前已有的方法会同时兼容在`Object`和`Reflect`上）
2. 修改`Object`方法的返回结果，让其更合理。
3. 让`Object`操作都变成函数行为。
4. `Reflect`方法与`Proxy`方法一一对应，不管`Proxy`怎么修改，总可以在`Reflect`上获取默认行为。

目前`Proxy`和`Reflect`都只有`get`、`set`、`has`、`deleteProperty`、`ownKeys`、`getOwnPropertyDescriptor`、`defineProperty`、`preventExtensions`、`getPrototypeOf`、`isExtensible`、`setPrototypeOf`、`apply`、`construct`这13个操作。`Proxy`的所有操作只对当前`target`生效，多层级对象不会递归代理

```js
var target = {}; // 可以是`Object`和`class`、`Function`类型
var proxy = new Proxy(target, {
  get (target, propKey, receiver) { // 拦截对象属性的读取，比如proxy.foo和proxy['foo']。
    console.info('get', target, propKey, receiver);
    return Reflect.get(target, propKey, receiver); // 获取对象身上某个属性的值，类似于 target[propKey]。如果target对象中指定了getter，receiver则为getter调用时的this值。
  },
  set (target, propKey, value, receiver) { // 拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    console.info('set', target, propKey, value, receiver);
    return Reflect.set(target, propKey, value, receiver); // 将值分配给属性的函数，类似 target[propKey]=value。返回一个Boolean，如果更新成功，则返回true。
  },
  has (target, propKey) { // 拦截propKey in proxy的操作，返回一个布尔值。
    console.info('has', target, propKey);
    return Reflect.has(target, propKey); // 判断一个对象是否存在某个属性，作用与 in 操作符相同。如 propKey in target
  },
  deleteProperty (target, propKey) { // 拦截delete proxy[propKey]的操作，返回一个布尔值。
    console.info('deleteProperty', target, propKey);
    return Reflect.deleteProperty(target, propKey); // 作为函数的delete操作符，相当于执行 delete target[propKey]
  },
  ownKeys (target) { // 拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
    console.info('ownKeys', target);
    return Reflect.ownKeys(target); // 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响).
  },
  getOwnPropertyDescriptor (target, propKey) { // 拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
    console.info('getOwnPropertyDescriptor', target, propKey);
    /**
     * 属性描述 propDesc = {value: 'a', writable: true, configurable: true, enumerable: true, get: function() {}, set: function() {}}
     * value: String | Number | Boolean | Object | Array | Function | Symbol | null | undefined // 该属性的值(仅针对数据属性描述符有效)
     * writable: Boolean // 当且仅当属性的值可以被改变时为true。(仅针对数据属性描述有效)
     * configurable: Booblean // 当且仅当指定对象的属性描述可以被改变或者属性可被删除时，为true。
     * enumerable: Booblean // 当且仅当指定对象的属性可以被枚举出时，为 true。
     * get: Function | undefined // 获取该属性的访问器函数（getter）。如果没有访问器， 该值为undefined。
     * set: Function | undefined // 获取该属性的设置器函数（setter）。 如果没有设置器， 该值为undefined。
     */
    return Reflect.getOwnPropertyDescriptor(target, propKey); // 如果target对象中存在propKey属性，则返回对象指定的属性配置。否则返回 undefined。
  },
  defineProperty (target, propKey, propDesc) { // 拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
    console.info('defineProperty', target, propKey, propDesc);
    return Reflect.defineProperty(target, propKey, propDesc); // 在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
  },
  preventExtensions (target) { // 拦截Object.preventExtensions(proxy)，返回一个布尔值。
    console.info('preventExtensions', target);
    return Reflect.preventExtensions(target); // 让一个对象变的不可扩展，也就是永远不能再添加新的属性。（可以修改现有属性）
  },
  getPrototypeOf (target) { // 拦截Object.getPrototypeOf(proxy)，返回一个对象。
    console.info('getPrototypeOf', target);
    return Reflect.getPrototypeOf(target); // 获取指定对象的原型。
  },
  isExtensible (target) { // 拦截Object.isExtensible(proxy)，返回一个布尔值。
    console.info('isExtensible', target);
    return Reflect.isExtensible(target); // 判断一个对象是否是可扩展（是否可以在它上面添加新的属性）。
  },
  setPrototypeOf (target, proto) { // 拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
    console.info('setPrototypeOf', target, proto);
    return Reflect.setPrototypeOf(target, proto); // 设置一个指定的对象的原型 ( 即, 内部[[Prototype]]属性）到另一个对象或  null。
  },
  apply (target, object, args) { // 拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
    console.info('apply', target, object, args);
    return Reflect.apply(target, object, args); // 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.prototype.apply() 功能类似。
  },
  construct (target, args) { // 拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)
    console.info('construct', target, args);
    return Reflect.construct(target, args); // 对构造函数进行 new 操作，相当于执行 new target(...args)。
  },
});
```

## Promise

`Promise`是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。`Promise`对象有以下两个特点：

1. **对象的状态不受外界影响**。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
2. **一旦状态改变，就不会再变**，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

静态属性： `length`
静态方法： `all`、`race`、`any`、`reject`、`resolve`
原型方法： `constructor`、`catch`、`then`、`finally`

```js
// 原型方法使用
const promise = new Promise((resolve, reject) => {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value); // 成功
  } else {
    reject(error); // 失败
  }
});
promise.then((value) => { // then 接收两个参数 onFulfilled 和 onRejected。并返回一个新的 promise, 将以回调的返回值来resolve.
  // success
}, (error) => {
  // failure
}).catch((error) => { // catch 接收 onRejected 一个参数。并返回一个新的 promise, 将以回调的返回值来resolve，否则如果当前promise 进入fulfilled状态，则以当前promise的完成结果作为新promise的完成结果.
  // failure
}).finally(() => {
  // finally
});

Promise.length // 其值总是为 1 (构造器参数的数目).

var promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});
var promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});
var promise3 = new Promise((resolve, reject) => {
  setTimeout(reject, 300, 'three');
});
var promise4 = Promise.resolve('four'); // 返回一个解析过带着给定值的Promise对象，如果参数是一个Promise对象，则直接返回这个Promise对象。
var promise5 = Promise.reject('five'); // 方法返回一个带有拒绝原因的Promise对象。

// Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
Promise.race([promise1, promise2, promise3]).then((value) => {
  console.log(value); // two
});

// Promise.any(iterable) 方法返回一个 promise，只要其中的一个 promise 完成，就返回那个已经有完成值的 promise 。如果可迭代对象中没有一个 promise 完成（即所有的 promises 都失败/拒绝），就返回一个拒绝的 promise，返回值还有待商榷（！！！  Promise.any() 方法依然是实验性的，尚未被所有的浏览器完全支持。）
Promise.any([promise1, promise2, promise3, promise4, promise5]).catch(err => {
  console.info('未确定的Err值', err);
});

// Promise.all(iterable) 方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。
Promise.all([promise1, promise2, 3, promise4, 5]).then((values) => {
  console.log(values); // ["one", "two", 3, "four", 5]
});
```

## Iterator 和 for...of 循环

`Iterator` 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令`for...of`循环，`Iterator`接口主要供`for...of`消费。`Iterator` 的遍历过程:

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

ES6 规定，默认的`Iterator`接口部署在数据结构的`Symbol.iterator`属性，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）。`Iterator`的具体实现如下：

```js
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}

var it = makeIterator(['a', 'b']);
it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
```

原生具备`Iterator`接口的数据类型有： **`Array`、`Set`、`Map`、`String`、`TypedArray`、`arguments 对象`、`NodeList 对象`**。

```js
// Array
const arr = new Array(1,2,3);
const it = arr[Symbol.iterator]();
it.next(); // {value: 1, done: false}
it.next(); // {value: 2, done: false}
it.next(); // {value: 3, done: false}
it.next(); // {value: undefined, done: true}

// Set
const set = new Set([1, 2, 3, 3]);
const it = set[Symbol.iterator]();
it.next(); // {value: 1, done: false}
it.next(); // {value: 2, done: false}
it.next(); // {value: 3, done: false}
it.next(); // {value: undefined, done: true}

// String
const str = new String('Hello');
const it = str[Symbol.iterator]();
it.next(); // {value: "H", done: false}
it.next(); // {value: "e", done: false}
it.next(); // {value: "l", done: false}
it.next(); // {value: "l", done: false}
it.next(); // {value: "o", done: false}
it.next(); // {value: undefined, done: true}
```

默认会调用`Iterator`接口的行为有： **`for...of`、`解构赋值(let [x,y] = arr)`、`扩展运算符(...)`、`Set()`、`WeakSet()`、`Map()`、`WeakMap()`、`yield*`、`Array.from()`、`Promise.all()`、`Promise.race()`**

```js
const arr = new Array({id: 1}, {id: 2}, {id: 3});
let [a, b, ...other] = arr; // 解构赋值 和 扩展运算符(...) 会进行遍历,
for(let val of arr) { // for...of 会进行遍历
  console.log(val); // {id: 1} -> {id: 2}
}

const set = new Set(arr); // Set() 会进行遍历
const ws = new WeakSet(arr); // WeakSet() 会进行遍历

const map = new Map([['name', '张三'], ['title', 'Author']]); // Map() 会进行遍历
const wm = new WeakMap([[['name'], '张三'], [['title'], 'Author']]); // WeakMap() 会进行遍历

// Generator 函数 -> yield
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};
var iterator = generator();
iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

## Gennerator 函数

- `Generator` 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。`Generator` 函数是一个状态机，封装了多个内部状态。
- `function`关键字与函数名之间有一个星号
- 函数体内部使用`yield`表达式，定义不同的内部状态
- 调用`Generator`函数后，**函数并不执行，返回的也不是函数运行结果**，而是一个指向内部状态的指针对象，也就是`遍历器对象`（`Iterator Object`）
- 必须调用`遍历器对象`的`next`方法，使得指针移向下一个状态。
- `yield`表达式本身没有返回值，或者说总是返回`undefined`。`next`方法可以带一个参数，该参数就会被当作**上一个**`yield`表达式的返回值，向`Generator`函数体内输入数据；`next`返回值的`value`属性，是`Generator`函数向外输出数据。

```js
function* helloWorldGenerator() {
  yield 'hello'; // 第一个状态 -> hello
  var ending = yield 'world'; // 第二个状态 -> world
  return ending; // 第三个状态 -> return 语句
}
var hw = helloWorldGenerator();
hw.next() // { value: 'hello', done: false }
hw.next() // { value: 'world', done: false }
hw.next('ending') // { value: 'ending', done: true }
hw.next() // { value: undefined, done: true }
```

### Generator.prototype.throw() 抛出异常

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next(); // throw方法抛出的错误要被内部捕获，前提是必须至少执行过一次next方法。

try {
  i.throw('a'); // 内部捕获
  i.throw('b'); // 外部捕获
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

### Generator.prototype.return() 返回给定的值，并且终结遍历

```js
function* gen() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally { // 有try...finally代码块，且正在执行try代码块。立刻进入finally代码块，执行完以后，整个函数才会结束。
    yield 4;
    yield 5;
  }
  yield 6;
  return 7;
}

var g = gen();

g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

### Generator 函数嵌套

```js
function* foo() {
  yield 'a';
  yield 'b';
}
function* bar() {
  yield 'x';
  yield* foo(); // Generator 函数嵌套（只要有 Iterator 接口，就可以被yield*遍历）
  yield 'y';
}
for (let v of bar()){
  console.log(v); // x -> a -> b -> y
}
```

### 作为对象属性的 Generator 函数

```js
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

### Generator 函数的this

```js
function* g() {
  this.a = 11;
}

g.prototype.hello = function () {
  console.log(this) // obj
  return 'hi!';
};

let obj = g(); // Generator 函数也不能跟new命令一起用，会报（TypeError: ** is not a constructor）错。
obj instanceof g // true
obj.hello() // 'hi!'
obj.a // undefined

// 通过call方法绑定Generator函数内部的this
var gen = {}
var f = F.call(gen);
f.next();
gen.a // 11;

// 改造成支持new的方式
function F() {
  return g.call(g.prototype);
}
var f = new F();
f.next()
f.a // 11

// 思考`Generator`的内存是如何释放。
function *GenTest() {
  var arr = [];
  for(var i = 1; i <= 1000; i++) {
    arr.push((i + Math.random()).toString())
  }
  yield* arr;
}
function test(len) {
  for(let i = 0; i < len; i++>) {
    GenTest().next();
  }
}
```

### 协程

协程（coroutine）意思是多个线程互相协作，完成异步任务。协程有点像函数，又有点像线程。它的运行流程大致如下。

- 第一步，协程`A`开始执行。
- 第二步，协程`A`执行到一半，进入暂停，执行权转移到协程`B`。
- 第三步，（一段时间后）协程`B`交还执行权。
- 第四步，协程`A`恢复执行。

### Thunk 函数

- `传值调用`（call by value），即在进入函数体之前就计算参数值。C 语言和JavaScript就采用这种策略。
- `传名调用`（call by name）， 即直接将表达式传入函数体，只在用到它的时候求值。Haskell 语言采用这种策略。

```js
var x = 1;

// 传值调用
function f(m) {
  return m * 2;
}
f(x + 5);


// 传名调用
var thunk = function () { // 这个函数就叫Thunk函数
  return x + 5;
};
function f(thunk) {
  return thunk() * 2;
}


// JavaScript 的 Thunk 函数（经过转换器处理，变成一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。）
fs.readFile(fileName, callback); // 正常版本的readFile（多参数版本）

var Thunk = function (fileName) { // Thunk版本的readFile（单参数版本）
  return function (callback) { // 注意第二次接收的参数都是异步的callback
    return fs.readFile(fileName, callback);
  };
};
var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

### Generator 函数的异步应用

`Generator` 就是一个异步操作的容器。它的自动执行需要一种规则，当异步操作有了结果，能够自动交回执行权。以下两种方法可以做到这一点：

1. 回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
2. Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权。

```js
/**
 * Thunk 函数的自动流程管理
 * Thunk 函数并不是 Generator 函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制 Generator 函数的流程，接收和交还程序的执行权。回调函数可以做到这一点，Promise 对象也可以做到这一点。
 */
function run(fn) {  // fn 为一个Generator函数
  var gen = fn();
  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }
  next();
}
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile); // 返回的是Thunk函数
var g = function* (){
  var f1 = yield readFileThunk('fileA'); // {value: function (callback) { return fs.readFile('fileA', callback) }, done: false}
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};
run(g);

/**
 * 基于 Promise 对象的自动执行
 */
var fs = require('fs');
var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};
var gen = function* (){
  var f1 = yield readFile('/etc/fstab'); // {value: Promise, done: false}
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
function run(gen){
  var g = gen();
  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }
  next();
}
run(gen);

/**
 * co 模块是个自动执行器的扩展
 * co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。
 */
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
var co = require('co');
co(gen).then(function (){
  console.log('Generator 函数执行完成');
});

// 处理并发的异步操作
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);
```

## async 函数

`ES2017`标准引入了`async`函数，使得异步操作变得更加方便。它就是`Generator`函数的语法糖。`async`函数就是将`Generator`函数的星号（*）替换成`async`，将`yield`替换成`await`，仅此而已。
`async`函数对`Generator`函数的改进，体现在以下四点：

1. **内置执行器** 不再需要类似`co`模块的执行器
2. **更好的语义** `async`和`await`，比起`*`和`yield`，语义更清楚了
3. **更广的适用性** `co`模块约定，`yield`命令后面只能是`Thunk`函数或`Promise`对象，而`async`函数的`await`命令后面，可以是`Promise`对象和原始类型的值（数值、字符串和布尔值，但这时会**自动转成立即`resolved`的`Promise`对象**）
4. **返回值是 Promise** `async`函数的返回值是`Promise`对象，这比`Generator`函数的返回值是`Iterator`对象方便多了。你可以用then方法指定下一步的操作。

```js
// 声明方式，有：
async function foo() {} // 函数声明
const foo = async function () {}; // 函数表达式
let obj = { async foo() {} }; // 对象的方法
const foo = async () => {}; // 箭头函数
class Storage {
  constructor() {}
  async getData() {} // Class方法声明
}

// 简单的使用案例
var fs = require('fs');
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error); // 思考：进入reject的时候async函数该如何处理？
      resolve(data);
    });
  })
}
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab'); // 任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。
  const f2 = await readFile('/etc/shells'); // 如果前面一个 await 语句状态变成 reject，当前语句不会执行，如要执行可以将前面的await放到try...catch结构中 或者 增加catch方法
  console.log(f1.toString());
  console.log(f2.toString());
  if (isErr(f1) || isErr(f2)) throw new Error('出错了'); // async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。
  return {f1, f2} // 该返回值会变成then方法回调函数的参数
};
// async函数返回一个 Promise 对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。
asyncReadFile().then(result => {
  console.info('result', result); // {f1, f2}
}).catch(err => console.info('错误', err))

// await命令后面是一个thenable对象（即定义then方法的对象），那么await会将其等同于 Promise 对象。
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) { // 自定义的then方法
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}
(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime); // >= 1000
})();

// 注意点
// 1. `await`命令后面的`Promise`对象，运行结果可能是`rejected`，所以最好吧await放在try...catch或者添加catch
try{
  const f1 = await readFile('/etc/fstab').catch(err => console.log(err))
  const f2 = await readFile('/etc/shells')
  return {f1, f2}
} catch (err) {
  return {f1: null, f2: null}
}
// 2. 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
// 3. await命令只能用在async函数之中，如果用在普通函数，就会报错。
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  // 报错
  docs.forEach(function (doc) {
    await db.post(doc); // Uncaught SyntaxError: await is only valid in async function
  });
}
// 4. async 函数可以保留运行堆栈。
const a = () => {
  b().then(() => c()); // b()运行结束，可能a()早就运行结束了，b()所在的上下文环境已经消失了。如果b()或c()报错，错误堆栈将不包括a()
};
const a = async () => {
  await b();
  c(); // b()运行的时候，a()是暂停执行，上下文环境都保存着。一旦b()或c()报错，错误堆栈将包括a()。
};
```

## Class

```js
// 类的基本使用
class Point { // 类必须使用new调用，否则会报错
  state = {}; // 实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。
  static defaultProps = {}; // 静态属性
  #x = 0; // 私有属性，只能在类的内部使用，在类的外部使用，就会报错。
  static #totallyRandomNumber = 4; // 静态的私有属性，只能在类的内部调用，外部调用就会报错。
  constructor(x, y) { // 一个类必须有constructor方法，如果没有显式定义，一个空的constructor() {}方法会被默认添加。
    this.x = x; // #x是私有属性，类之外是读取不到这个属性的。使用时必须带有#一起使用，所以#x和x是两个不同的属性。
    this.y = y;
    console.log(new.target === Point); // ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。需要注意的是，子类继承父类时，new.target会返回子类。
    return Object.create(null); // constructor方法默认返回实例对象（即this），如果返回一个全新的对象，则是当前返回的对象而非实例对象
  }
  static getPrivateX(point) { // 静态方法
    return point.#x; // 私有属性不限于从this引用，只要是在类的内部，实例也可以引用私有属性。
  }
  #sun() {} // 私有方法
  get #xValue () {return #x} // 私有getter
  set #xValue (value) {this.#x = value} // 私有setter
  static #computeRandomNumber() {} // 静态的私有方法，只能在类的内部调用，外部调用就会报错。
  toValue() { // 类的所有方法都定义在类的prototype属性上面。 所以toValue方法是定义在 prototype 上。 与ES5不一样的是toValue不可以枚举（即Object.keys(Point.prototype)读取不到）
    return '(' + this.x + ', ' + this.y + ')';
  }
}
typeof Point // "function" (类的数据类型就是函数)
Point === Point.prototype.constructor // true (类本身就指向构造函数)
Point(1,2); // Uncaught TypeError: Class constructor Point cannot be invoked without 'new'
var p1 = new Point(2, 3);
var p2 = new Point(3, 2);
p1.__proto__ === p2.__proto__; // true 类的所有实例共享一个原型对象。
p1.__proto__.printName = function () { return 'Oops' }; // 使用实例的__proto__属性改写原型，会改变“类”的原始定义，影响到所有实例。

// 取值函数（getter）和存值函数（setter）
class MyClass {
  constructor(prop, element) {
    this.prop = prop; // 这里会执行
    this.element = element;
  }
  get prop() {
    console.log('getter-prop')
    return this.prop; // 这里会执行死循环，应为读取this.prop会再次触发getter函数
  }
  set prop(value) {
    console.log('setter-prop')
    this.prop = value; // 这里会执行死循环，为this.prop赋值会再次触发setter函数
  }
  get html() {
    return this.element.innerHTML;
  }
  set html(value) {
    this.element.innerHTML = value;
  }
  ['getArea']() {} // 类的属性名，可以采用表达式。
}

// Class表达式
const MyClass = class Me { // 这个类的名字是Me，但是Me只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用MyClass引用。
  getClassName() {
    return Me.name;
  }
};
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
// 如果类的内部没用到，可以省略Me
const MyClass = class { /* ... */ };
// 采用 Class 表达式，可以写出立即执行的 Class。
let person = new class {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}('张三');
person.sayName(); // "张三"

// Class类的注意点：
// 1. 严格模式 --> 只要在类或模块之中，就只有严格模式可用，所以不需要使用`use strict`指定运行模式。
// 2. 不存在提升 --> `ES6`不会把类的声明提升到代码头部。必须保证子类在父类之后定义。
new Foo(); // ReferenceError
class Foo {}
// 3. name属性 --> `name`属性总是返回紧跟在`class`关键字后面的类名。
Foo.name // "Foo"
// 4. Generator 方法 --> 如果某个方法之前加上星号（`*`），就表示该方法是一个`Generator`函数。
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}
// 5. this的指向 --> 类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}
const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
// 解决this指针方法有：
class Logger {
  constructor() {
    this.printName = this.printName.bind(this); // 1. 在构造方法中绑定this
    this.printName = () => this.print(`Hello ${name}`); // 2. 使用箭头函数
  }
}
function selfish (target) { // 3. 使用Proxy，获取方法的时候，自动绑定this
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key); // 读取出当前方法
      if (typeof value !== 'function') { // 不是方法的时候直接返回
        return value;
      }
      if (!cache.has(value)) { // 没有缓存的进行缓存处理
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}
const logger = selfish(new Logger());

// 静态方法：在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用。
class Foo {
  static bar() {
    this.baz(); // 静态方法包含this关键字，这个this指的是类，而不是实例。
  }
  static baz() { // 静态方法可以与非静态方法重名。
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}
class Bar extends Foo { // 父类的静态方法，可以被子类继承。
  constructor (...arg) {
    super(...arg); // 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。
  }
  static classMethod() {
    return super.bar(); // 静态方法也是可以从super对象上调用的。
  }
}
Bar.bar() === Bar.classMethod() // hello
```
