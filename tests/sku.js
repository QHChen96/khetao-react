const _ = require('lodash');
const { reduce, each } = _;

function sku1() {
  const arr = arguments;
  return reduce(
    arr,
    (result, value) => {
      const ret = [];
      each(result, res => {
        each(value, val => {
          ret.push([...res, val]);
        });
      });
      return ret;
    },
    [[]],
  );
}

function sku2() {
  const arr = arguments;
  return reduce(
    arr,
    (result, value) => {
      const ret = [];
      each(result, res => {
        each(value, val => {
          ret.push({ ...res, ...val });
        });
      });
      return ret;
    },
    [{}],
  );
}

function sku1Native() {
  const arr = arguments;
  return Array.prototype.reduce.call(
    arr,
    (result, value) => {
      const ret = [];
      result.forEach(res => {
        value.forEach(val => {
          ret.push({ ...res, ...val });
        });
      });
      return ret;
    },
    [{}],
  );
}

const sku1Result = sku1([1, 2], [3, 4]);
console.log('sku1:' + JSON.stringify(sku1Result));
const suk2Result = sku2([{ color: 'red' }, { color: 'green' }], [{ size: '大' }, { size: '小' }]);
console.log('sku2:' + JSON.stringify(suk2Result));

const sku1NativeResult = sku1Native(
  [{ color: 'red' }, { color: 'green' }],
  [{ size: '大' }, { size: '小' }],
);
console.log('sku1NativeResult:' + JSON.stringify(sku1NativeResult));
