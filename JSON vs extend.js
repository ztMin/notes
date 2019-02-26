function text(index) {
  function extendStr(obj1) {
    return JSON.parse(JSON.stringify(obj1))
  }
  function extend (obj) {
    var newObj = {};
    for (var key in obj) {
      if (typeof obj[key] == 'object' && obj[key] != null) {
        newObj[key] = extend(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }
  function testStr (n, o) {
    console.time('testStr' + n);
    for (var i = 0; i < 1000; i++) {
      extendStr(o);
    }
    console.timeEnd('testStr' + n);
    n++
  }
  function testExt (n, o) {
    console.time('testExt' + n);
    for (var i = 0; i < 1000; i++) {
      extend(o)
    }
    console.timeEnd('testExt' + n)
  }
  testStr(index, {a: 1, b: {c: 2, d: {e: 3}}});
  testExt(index, {a: 1, b: {c: 2, d: {e: 3}}});
}
