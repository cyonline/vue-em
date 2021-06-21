/**
 * es module loader
 * 方法比较简陋，模块代码书写请尽量规范
 * @author hyk
 * @createDate 2018-12-14
 * @description
 * 记得引入babel-polyfill，因为使用了es6 api。
 * 模块化js中请不要声明双下划线变量，例如__import__,__default__,__export__。
 * 注意：很重要。非web标准的标签一定要闭合
 */
(function (root) {
  'use strict';
  // 资源基地址，请不要动态修改此值
  root.__BASE_SRC__ = '/pages/em/';
  // 缓存已加载过的资源，以资源路径作为key
  root.__SRC_MAP__ = {
    // key{src}: {
    //   raw: String,
    //   uuid: String,
    //   type: String, {js|vue}
    //   template: String, // vue
    //   styles: Array<{ scoped: Boolean, value: String }>, // vue
    //   module: Function
    // },
  };
  /**
   * 生成唯一id（极少概率重复）
   * @param len {Number} 长度
   * @param radix {Number} 基数
   */
  function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];
    var i = 0;
    var radix = radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i += 1) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      var r = void 0;
      uuid[8] = '-';
      uuid[13] = '-';
      uuid[18] = '-';
      uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i += 1) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }
    /**
   * 模块文件加载器 异步加载文件
   * 异步加载文件目前使用的是jquery可用其它方法替代
   * @returns Promise
   */
  function fileLoader (src) {
    return new Promise(function (resolve, reject) {
      //  window.fetch(src).then( function (res) {
      //    if (res.ok) {
      //      return res.text().then();
      //    }
      //    reject (new Error('请求文件失败: ' + res.url));
      //  });
      if (root.__SRC_MAP__[src]) {
        resolve(root.__SRC_MAP__[src]);
      } else {
        $.get(src, function (text, status) {
          if (status === 'success' || status ==='notmodified') {
            var uid = uuid(8, 16).toLocaleLowerCase();
            root.__SRC_MAP__[src] = {
              // template: String, // vue
              // styles: Array<{ scoped: Boolean, value: String }>, // vue
              // module: Function,
              raw: text,
              uuid: uid,
              cached: true,
            };
            resolve({
              raw: text,
              uuid: uid,
              cached: false,
            });
          } else {
            reject(new Error('fileLoader: load file ' + src + ' failed'));
          }
        }, 'text');
      }
    });
  }
  /**
   * 将dom字符串转为dom元素
   * 非标准的标签请一定要闭合
   * 如果参数html不是有效的dom结构则会生成文本节点，这时会返回一个div包裹的dom元素
   * @returns DOMElement
   */
  function transformToDom(html) {
    var wrap = document.createElement('div');
    var fragment = document.createDocumentFragment();

    wrap.innerHTML = html;
    fragment.appendChild(wrap);
    var $first = fragment.firstChild;
    return $first.firstChild.nodeType !== 1 ? $first : $first.firstChild;
  }
  /**
   * 简单的es6语法探测器
   * 有点消耗性能
   * 不考虑代码书写是否合法
   */
  function es6SyntaxDetector(raw) {
    // 首先找到所有模板字符串
    var templates = findStrings(raw, ['`']);
    if (templates.length) {
      throw new Error('[模板符号]:do not use es6 syntax in module.\n');
    }
    var input = raw;
    var stringsArr = findStrings(raw);
    var replaceStringsRes = replaceStrings(stringsArr, raw);
    raw = replaceStringsRes.output;
    var stringsArr2 = raw.match(/\b\d{8}-\d+-\d{8}\b/g) || [];
    stringsArr2.forEach(function (item, idx) {
      raw = raw.replace(transferMetaCharacters(item), '@-'+ idx +'-@');
    });
    function tip(label, msg) {
      msg = Array.isArray(msg) ? msg.join('\n') : msg;
      stringsArr2.forEach(function (item, idx) {
        item = item.replace(/(\$+)/g, '$1$1');
        msg = msg.replace(transferMetaCharacters('@-'+ idx +'-@'), item);
      });
      msg = restoreStrings(stringsArr, msg, replaceStringsRes.stamp).output;
      return '['+ label +']:do not use es6 syntax in module.\n====>|\t' + msg;
    }
    var regs = [
      {
        reg: /=>/g,
        label: '箭头函数',
      },
      {
        reg: /\.\.\./g,
        label: '扩展运算符',
      },
      {
        reg: /\bconst\b|\blet\b/g,
        label: 'const or let 声明变量',
      },
      {
        reg: /\basync\b\s*\bfunction\b/g,
        label: 'async函数',
      },
      {
        reg: /\bfunction\s*\*\s*\w*\s*\(/g,
        label: 'generator',
      },
      {
        reg: /(\}\s*=)/g,
        label: '对象解构赋值',
      },
    ];
    var regRes;
    regs.forEach(function (item) {
      regRes = raw.match(new RegExp(item.reg));
      if (regRes) {
        throw new Error(tip(item.label, regRes));
      }
    });
    var arr = [];
    var t, m, r, f = [];
    var pairFlagArr = [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ];
    // 是否有函数参数默认值
    var fns = findFunctions(raw);
    fns.forEach(function (item) {
      var lBracketIdx = findCharIndex(item, '(');
      var rBracketIdx = findRightMateIndex(item, ['(', ')'], lBracketIdx);
      t = item.slice(lBracketIdx + 1, rBracketIdx);
      pairFlagArr.forEach(function (pairFlag) {
        var res = findPairs(t, pairFlag).reverse();
        r = replaceStrings(res, t);
        t = r.output;
        f.push({
          stamp: r.stamp,
          data: res,
        });
      });
      m = t.match(/[\s\S]*=[\s\S]*/g);
      if (m) {
        m = m.join('\n');
        f.reverse().forEach(function (o) {
          m = restoreStrings(o.data, m, o.stamp).output;
        });
        throw new Error(tip('函数参数默认值', m));
      }
    });
    // 检查对象属性
    var likeObjects = findObjects(raw);
    arr = [];
    t = null;
    m = null;
    r = null;
    f = [];
    likeObjects.forEach(function (item) {
      t = item.replace(/^\{|\}$/g, '');
      pairFlagArr.forEach(function (pairFlag) {
        var res = findPairs(t, pairFlag).reverse();
        r = replaceStrings(res, t);
        t = r.output;
        f.push({
          stamp: r.stamp,
          data: res,
        });
      });
      t = (t + ',').replace(/,,/, ',');
      arr.push(t);
    });
    arr.forEach(function (scheme) {
      var tRes1 = scheme.match(/(?:,|^)\s*\d{8}-\d+-\d+\s*/g); // 属性名使用了计算属性
      var tRes2 = scheme.match(/(?:,|^)\s*\w+\s*,\s*/g); // 属性名简写
      var tRes3 = scheme.match(/(?:,|^)\s*\w+\s*\d{8}-\d+-\d{8}\s*\d{8}-\d+-\d{8}\s*,\s*/g); // 属性方法简写
      if (tRes1) {
        tRes1 = tRes1.join('\n');
        f.reverse().forEach(function (o) {
          tRes1 = restoreStrings(o.data, tRes1, o.stamp).output;
        });
        throw new Error(tip('对象属性名使用了计算属性', tRes1));
      } else if (tRes2) {
        tRes2 = tRes2.join('\n');
        f.reverse().forEach(function (o) {
          tRes2 = restoreStrings(o.data, tRes2, o.stamp).output;
        });
        throw new Error(tip('对象属性简写', tRes2));
      } else if (tRes3) {
        tRes3 = tRes3.join('\n');
        f.reverse().forEach(function (o) {
          tRes3 = restoreStrings(o.data, tRes3, o.stamp).output;
        });
        throw new Error(tip('对象属性方法简写', tRes3));
      }
    });
    // 是否有数组解构
    t = null;
    m = null;
    r = null;
    f = [];
    var likeArrays = findPairs(raw, ['[', ']']);
    // 进行替换
    r = replaceStrings(likeArrays, input);
    m = r.output.match(/\d{8}-\d+-\d{8}\s*=\s*\d{8}-\d+-\d{8}|\d{8}-\d+-\d{8}\s*=\s*\[|\]\s*=\s*\d{8}-\d+-\d{8}|\]\s*=\s*\[/g);
    if (m) {
      m = m.join('\n');
      m = restoreStrings(likeArrays, m, r.stamp).output;
      throw new Error(tip('数组解构', m));
    }
    return true;
  }
  /**
   * 查找某个字符的位置
   * @param {String} raw
   * @param {String} flag 需要查找的字符
   */
  function findCharIndex(raw, flag) {
    var idx = raw.indexOf(flag);
    if (idx === -1) {
      return -1;
    }
    // 排除转义
    if (idx > -1 && raw[idx - 1] !== '\\') {
      return idx;
    };
    return idx + findCharIndex(raw.slice(idx + 1), flag) + 1;
  }
  /**
   * 获取所有字符串结果。我想不到其它更好的方法
   * @param {String} raw
   * @param {Array} flags. ['\'', '"', '`']
   * @returns {Array}
   */
  function findStrings(raw, flags) {
    if (!raw || typeof raw !== 'string') {
      return [];
    }
    var defs = flags || ['\'', '"', '`'];
    var idxArr = [];
    defs.forEach(function (item) {
      idxArr.push(findCharIndex(raw, item));
    });
    var startIdx = Math.min.apply(null, idxArr.filter(function (item) {
      return item > -1;
    }));
    var flagIdx;
    idxArr.some(function (item, idx) {
      if (item === startIdx) {
        flagIdx = idx;
        return true;
      }
      return false;
    });
    var results = [];
    if (startIdx > -1 && startIdx !== Infinity) {
      var endIdx = startIdx + findCharIndex(raw.slice(startIdx + 1), defs[flagIdx]) + 1;
      results.push(raw.slice(startIdx, endIdx + 1).replace(/\\/g, '\\\\'));
      results = results.concat(findStrings(raw.slice(endIdx + 1)));
    }
    return results;
  }
  
  /**
   * 匹配右边匹配的字符的位置，例如查找{的成对的}
   * @param {Array} pairFlag // 必需。匹配标识
   * @param {Number} lbIdx // 必需。左匹配的起始位置
   * @returns {Number}
   */
  function findRightMateIndex(raw, pairFlag, lbIdx, startSearchIdx) {
    if (!pairFlag) {
      throw new Error('findRightMateIndex: 缺少匹配标识');
    }
    if (startSearchIdx === undefined) {
      startSearchIdx = lbIdx;
    }
    if (lbIdx === -1 || startSearchIdx === -1) {
      return -1;
    }
    var rbIdx = startSearchIdx + findCharIndex(raw.slice(startSearchIdx + 1), pairFlag[1]) + 1;
    if (rbIdx === -1) {
      return -1;
    }
    var snippets = raw.slice(lbIdx, rbIdx + 1);
    // 比较左匹配的数量是否等于右匹配的数量
    var lcm = snippets.match(new RegExp(transferMetaCharacters(pairFlag[0]), 'g'));
    var rcm = snippets.match(new RegExp(transferMetaCharacters(pairFlag[1]), 'g'));
    var lbc = lcm ? lcm.length : 0;
    var rbc = rcm ? rcm.length : 0;
    if (lbc === 0 || rbc === 0) {
      return -1;
    }
    // 如果相等，则认为找到了，否则继续寻找下一个}
    if (lbc === rbc) {
      return rbIdx;
    }
    // 继续寻找下一个右匹配的位置的位置
    return findRightMateIndex(raw, pairFlag, lbIdx, rbIdx);
  }
  /**
   * 获取成对的结果，例如{xxxx} (xxxxx) [xxxxx]
   * @param {Array} pairFlag // 例如['{', '}']
   * @param {Boolean} returnTree // 返回树形结构
   * @returns {Array}
   */
  function findPairs(raw, pairFlag, returnTree) {
    if (!pairFlag) {
      throw new Error('findRightMateIndex: 缺少匹配标识');
    }
    if (!raw || typeof raw !== 'string') {
      return [];
    }
    // 先替换字符串
    var stringsArr = findStrings(raw);
    var replaceStringsRes = replaceStrings(stringsArr, raw);
    raw = replaceStringsRes.output;
    var lbIdx = findCharIndex(raw, pairFlag[0]);
    var rbIdx = findRightMateIndex(raw, pairFlag, lbIdx, lbIdx);
    var results = [];
    if (lbIdx > -1 && rbIdx > -1) {
      var snippets = raw.slice(lbIdx, rbIdx + 1);
      var insideSnippets = snippets.replace(new RegExp(('^' +transferMetaCharacters(pairFlag[0]) + '|' + transferMetaCharacters(pairFlag[1]) + '$'), 'g'), '');
      // 获取内部符合pairFlag的数据
      if (returnTree) {
        var children = [];
        children = children.concat(findPairs(insideSnippets, pairFlag, returnTree));
        results.push({
          value: restoreStrings(stringsArr, snippets, replaceStringsRes.stamp).output,
          children: children,
        });
      } else {
        results = results.concat(findPairs(insideSnippets, pairFlag, returnTree));
        results.push(restoreStrings(stringsArr, snippets, replaceStringsRes.stamp).output);
      }
      results = results.concat(findPairs(raw.slice(rbIdx + 1), pairFlag, returnTree));
    }
    // results = results.map(function (item) {
    //   return restoreStrings(stringsArr, item, replaceStringsRes.stamp).output;
    // });
    return results;
  }
  /**
   * 找出所有成对的结果
   * @returns {Array<Array>}
   */
  function findAllPairs(raw, pairFlagArr) {
    pairFlagArr = pairFlagArr || [
      ['{', '}'],
      ['(', ')'],
      ['[', ']'],
    ];
    var results = [];
    pairFlagArr.forEach(function (pairFlag) {
      results.push(findPairs(raw, pairFlag));
    });
    return results;
  }
  /**
   * 查找数组重复项
   */
  function findArratRepeatedItem(arr) {
    var results = [];
    var idx, lastIdx;
    arr.forEach(function (item) {
      idx = arr.indexOf(item);
      lastIdx = arr.lastIndexOf(item);
      if((idx !== lastIdx && results.indexOf(item) === -1)){
        results.push(item);
      }
    })
    return results;
  }
  /**
   * 找出对象语句，无法排除单独的局部作用域，如 var foo = 'foo'; { var a = 1; var b = 2; }
   */
  function findObjects(raw) {
    var likeObjects = findPairs(raw, ['{', '}']);
    var results = [];
    // var repeatItemsTemp = findArratRepeatedItem(likeObjects);
    // var repeatItems = repeatItemsTemp.map(function (item) {
    //   return {
    //     value: item,
    //     start: raw.indexOf(item),
    //   };
    // });
    // var idx, checkIdx;
    likeObjects.forEach(function (item) {
      var idx = raw.indexOf(item);
      // checkIdx = repeatItemsTemp.indexOf(item);
      // if (checkIdx > -1) {
      //   // 这是一个有重复项的数据
      //   var startIdx = repeatItems[checkIdx].start;
      //   idx = startIdx + raw.slice(startIdx).indexOf(item);
      //   repeatItems[checkIdx].start += 1;
      // } else {
      //   idx = raw.indexOf(item);
      // }
      if (idx > 1 && /(\)\s*$)|(\belse\b\s*$)|(\bdo\b\s*$)/g.test(raw.slice(0, idx))) {
        // do nothing
      } else {
        results.push(item);
      }
    });
    return results;
  }
  /**
   * 找出例如 (xxxx){xxxx}或(xxxx) => {xxxxx}形式的表达式
   * 当然这样会包括if和switch语句
   */
  function findLikeFunctions(raw) {
    // 先替换字符串
    var stringsArr = findStrings(raw);
    var replaceStringsRes = replaceStrings(stringsArr, raw);
    raw = replaceStringsRes.output;
    var results = [];
    var lBracketIdx = findCharIndex(raw, '(');
    var rBracketIdx = lBracketIdx > -1 ? findRightMateIndex(raw, ['(', ')'], lBracketIdx) : -1;
    if (lBracketIdx > -1 && rBracketIdx > -1) {
      // 获取内部数据
      results = results.concat(findLikeFunctions(raw.slice(lBracketIdx + 1, rBracketIdx)));
    }
    var lBraceIdx = rBracketIdx > -1 ? rBracketIdx + findCharIndex(raw.slice(rBracketIdx + 1), '{') : -1;
    var rBraceIdx =  lBraceIdx > -1 ? findRightMateIndex(raw, ['{', '}'], lBraceIdx) : -1;
    if (lBraceIdx > -1 && rBraceIdx > -1) {
      results = results.concat(findLikeFunctions(raw.slice(lBraceIdx + 1, rBraceIdx)));
    }
    var snippets;
    if (lBracketIdx > -1 && rBracketIdx > -1 && lBraceIdx > -1 && rBraceIdx > -1) {
      var ope = raw.slice(rBracketIdx + 1, lBraceIdx).replace(/\s/g, '');
      if (ope === '' || ope === '=>') {
        snippets = raw.slice(lBracketIdx, rBraceIdx + 1);
        results.push(restoreStrings(stringsArr, snippets, replaceStringsRes.stamp).output);
        results = results.concat(findLikeFunctions(raw.slice(rBraceIdx + 1)));
      }
    }
    return results;
  }
  /**
   * 查找函数语句
   */
  function findFunctions(raw) {
    var likeFns = findLikeFunctions(raw);
    var results = [];
    likeFns.forEach(function (item) {
      // 作者注：item可能会重复，这里为不严谨的判断
      if (!/(\bif\b\s*$)|(\bswitch\b\s*$)|(\bwhile\b\s*$)|(\bfor\b\s*$)|(\bwith\b\s*$)/g.test(raw.slice(0, raw.indexOf(item)))) {
        results.push(item);
      }
    });
    return results;
  }
  /**
   * 移除js注释
   * https://blog.csdn.net/sodino/article/details/51386113
   * @param {String} raw 
   */
  function removeJsAnnotate(raw) {
    // 将'://'全部替换为特殊字符来排除http://等，删除注释代码后再将其恢复回来
    var tmp1 = ':\/\/';
    var regTmp1 = /:\/\//g;
    var tmp2 = '@:@/@/@';
    var regTmp2 = /@:@\/@\/@/g;
    raw = raw.replace(regTmp1, tmp2);
    var reg = /(\/\/.*)|(\/\*[\s\S]*?\*\/)/g;
    raw = raw.replace(reg, '');
    raw = raw.replace(regTmp2, tmp1);

    return raw; 
  }
  function annoymouseFnStr(body) {
    return 'function () {' + body + '}';
  }
  /**
   * 转义正则表达式元字符
   */
  function transferMetaCharacters (raw) {
    return raw.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$&");
  }
  /**
   * 替换字符串中的某些字符
   * @param {Array} arr
   * @param {String} raw
   * @returns {Object} { output, stamp }
   */
  function replaceStrings(arr, raw) {
    var stamp = uuid(8, 8);
    arr.forEach(function (item, idx) {
      raw = raw.replace(new RegExp(transferMetaCharacters(item)), stamp + '-' + idx + '-' + stamp);
    });
    return {
      output: raw,
      stamp: stamp,
    };
  }
  /**
   * 还原 replaceStrings的逆操作。必需传从replaceStrings获得的stamp
   * @returns {Object} { raw }
   */
  function restoreStrings(arr, raw, stamp) {
    arr.forEach(function (item, idx) {
      // 注意：$在replace方法有特殊含义
      // 替换为下面的字符都会导致问题
      // $1、$2、...、$99　　与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。 
      // $&　与 regexp 相匹配的子串。 
      // $`　位于匹配子串左侧的文本。 
      // $'　位于匹配子串右侧的文本。 
      // %　直接量符号。
      item = item.replace(/(\$+)/g, '$1$1');
      raw = raw.replace(new RegExp(transferMetaCharacters(stamp + '-' + idx + '-' + stamp)), item);
    });
    return {
      output: raw,
    };
  };
  /**
   * 对import进来模块处理
   * @param {String} raw
   * @returns {Promise} { raw: String, output: String, processed: String }
   */
  function importResolver(raw) {
    var reg = /\bimport\b\s*([\s\S]+?)\s*\bfrom\b\s*(['`"])(.+)(['`"]);?\s*/g;
    var results = [
      // {
      //   path: String, // module src
      //   keys: Array<Array>, // Array<Array[0]> input key  Array<Array[0]> output key
      // },
    ];
    var res = reg.exec(raw);
    var paramReg = /^\w+$/; // import a from 'xxxx';
    var objectReg = /{[\s\S]+?}/; // import { a, b, c as C } from 'xxxx';
    var aliasReg = /([\w\*]+)\s+as\s+(\w+)/gi; // import a as A from 'xxxx';
    while(res) {
      // console.log(res);
      // 排除字符串中的数据
      var medRes = new RegExp(reg).exec(res[0]);
      if (medRes[2] !== medRes[4]) {
        res = reg.exec(raw);
        continue;
      }
      var keys = [];
      var m;
      if (paramReg.test(res[1])) {
        // import as default
        keys.push([res[1], 'default']);
      } else if (objectReg.test(res[1])) {
        // 对象结构
      res[1].replace(/^{|}$/g, '').split(/\s*,/).forEach(function (item) {
          if (aliasReg.test(res[1])) {
            m = new RegExp(aliasReg).exec(res[1]);
            keys.push([m[2], m[1]]); 
          } else {
            m = /(\w+)/g.exec(res[1]);
            keys.push([m[1], m[1]]);
          }
        });
      } else if (aliasReg.test(res[1])) {
        // import * as xxxx
        m = new RegExp(aliasReg).exec(res[1]);
        keys.push([m[2], m[1]]);
      }
      results.push({
        keys: keys,
        path: res[3],
      });
      res = reg.exec(raw);
    }
    var paths = [];
    var processed = results.map(function (item) {
      var str = item.keys.map(function (k) {
        paths.push(item.path);
        return 'var ' + k[0] + ' = __SRC_MAP__["'+ item.path.replace(/@/, root.__BASE_SRC__ ) +'"]["module"]()' + (k[1] === '*' ? '' : '["' + k[1] +'"]');
      }).join(';\n');
      return str + ';';
    }).join('\n');
    return Promise.all(paths.map(function (path) { return __import__(path); })).then(function () {
      return {
        raw: raw,
        // 去掉import代码传递给下一个处理方法
        output: raw.replace(new RegExp(reg), function ($0, $1, $2, $3, $4) {
          // console.log('$0', $0, '$1', $1, '$2', $2, '$3', $3, '$4', $4);
          // 排除字符串中的代码
          return $2 === $4 ? '' : $0;
        }),
        // 处理过后的将要eval的字符串
        processed: processed,
      };
    });
  }
  /**
   * 对export语句处理
   * @param {String} input
   * @returns {Object} { raw: String, output: String, processed: String }
   */
  function exportResolver(input) {
    var raw = input;
    // 检测是否包含了es6代码
    es6SyntaxDetector(raw);
    var exportsStr = 'var __exports__ = {[toReplace]};';
    // 首先找出所有字符串。避免正则匹配到字符串中的数据
    var stringsArr = findStrings(raw);
    var replaceStringsRes = replaceStrings(stringsArr, raw);
    raw = replaceStringsRes.output;
    // 找出所有诸如{xxxx},(xxxx)[xxxxx]的语句
    var pairFlagArr = [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ];
    var findedPairs = [];
    pairFlagArr.forEach(function (pairFlag) {
      var res = findPairs(raw, pairFlag).reverse();
      var r = replaceStrings(res, raw);
      raw = r.output;
      findedPairs.push({
        stamp: r.stamp,
        data: res,
      });
    });
    // 找出所有export代码
    var toReplaceArr = [];
    var inKey, outKey;
    var defaultCount = 0;
    var extractReg = /^(\w+)$|^\w+\s*(\w+)\s*/g;
    var extractRegRes;
    var rawTemp = raw;
    // var reg = /\bexport\b\s+\b(\w+)\b\s+\b(\w+)\b\s+\b(\w+)\b.*[;\n]|\bexport\b\s+\b(\w+)\b\s+\b(\w+)\b.*[;\n]|\bexport\b\s+\b(\w+)\b.*[;\n]|\bexport\b\s+\b(.+)\b.*[;\n]/g;
    var reg = /\bexport\b\s+(.+);|\bexport\b\s+(.+)\n?/g;
    var exportsRes = reg.exec(rawTemp);
    while(exportsRes) {
      inKey = '';
      outKey = '';
      var t = exportsRes[1] || exportsRes[2];
      if (/^\bdefault\b|\bdefault\d{8}-\d+-\d{8}$/.test(t)) {
        defaultCount += 1;
        outKey = 'default';
        t = t.replace(/^\bdefault\s*/, '');
      }
      extractRegRes = new RegExp(extractReg).exec(t);
      // console.log('extractRegRes:', extractRegRes, t);
      if (!extractRegRes || /^\w*\d{8}-\d+-\d{8}$/.test(t)) {
        inKey = '__default__';
        // 去掉export和default
        raw = raw.replace(new RegExp(transferMetaCharacters(exportsRes[0])), 'var __default__ = ' + t + ';\n');
      } else {
        // 去掉export和default
        raw = raw.replace(new RegExp(transferMetaCharacters(exportsRes[0])), t + '\n');
        inKey = (extractRegRes[1] || extractRegRes[2]).replace(/\d+/, '');
      }
      outKey = outKey || inKey;
      toReplaceArr.push( outKey + ' : ' + inKey);
      exportsRes = reg.exec(rawTemp);
    }
    var errTip;
    if (defaultCount === 0) {
      errTip = 'no default export';
    } else if (defaultCount > 1) {
      errTip = 'more than one default export';
    }
    if (errTip) {
      // console.error(errTip);
      throw new Error(errTip);
    }
    // 去掉export和default关键字
    // raw = raw.replace(new RegExp(reg), function ($0) {
    //   return $0.replace(/\bexport\b\s+\bdefault\b|\bexport\b\s+\b\w+\b[;\n]|\bexport\b/g, '');
    // });
    // 还原成对的字符串
    findedPairs.reverse().forEach(function (m) {
      raw = restoreStrings(m.data, raw, m.stamp).output;
    });
    // 将所有import方法替换成__import__
    raw = raw.replace(/(?:(^|\s+|;\s*))(import)((\([\s\S]*\)))(?!\s*{)/g, '$1__$2__$3');
    // 还原字符串
    raw = restoreStrings(stringsArr, raw, replaceStringsRes.stamp).output;
    raw += '\n' + exportsStr.replace(/\[toReplace\]/, toReplaceArr.join(',\n'));
    return {
      raw: input,
      output: raw,
      processed: raw,
    };
  }
  /**
   * js module解析器
   * @param {String} raw
   * @returns {Promise}
   */
  function jsParser(raw) {
    // return new Promise();
    raw = removeJsAnnotate(raw);
    return importResolver(raw).then(function (res) {
      var exportsStr = exportResolver(res.output).output;
      var anoyFnStr = annoymouseFnStr(res.processed + '\n' + exportsStr + 'return __exports__;');
      // console.log('anoyFnStr:', anoyFnStr);
      return eval('(' + anoyFnStr + ')');
    }).catch(function (err) {
      // console.error(err);
      throw err;
    });

  }
  /**
   * 
   * @param {String} src
   * @returns {Promise} 
   */
  function jsLoader(src) {
    // console.log('jsLoader执行了');
    return fileLoader(src).then(function (res) {
      if (!root.__SRC_MAP__[src].type) {
        root.__SRC_MAP__[src].type = 'js';
      }
      if (root.__SRC_MAP__[src].module) {
        return root.__SRC_MAP__[src].module();
      } else {
        return jsParser(res.raw).then(function (anoyfn) {
          root.__SRC_MAP__[src].module = anoyfn;
          return anoyfn();
        }).catch(function (err) {
          // console.error(err);
          throw err;
        });
      }
    });
  }

  function setUuidToNode(ele, uid) {
    if (ele.nodeType === 1) {
      ele.setAttributeNode(document.createAttribute('data-v-' + uid));
      if (ele.children && ele.children.length) {
        [].slice.call(ele.children).forEach(function (child) {
          setUuidToNode(child, uid);
        });
      }
    }
  }
  function prefixScopedCss(css, uid) {
    // 添加data-v-xxxx
    var prefix = '[data-v-' + uid + ']';
    return css.replace(/([^{}]+)\s*{/g, function ($0, $1) {
      var res = $1;
      if (/([^:]+)(:+)/.test(res)) {
        res = res.replace(/([^:]+)(:+)/, '$1' + prefix + '$2');
        
      } else {
        res = res.replace(/\s*$/, '') + prefix;
      }
      return res + '{';
    });
  }
  /**
   * vue资源解析器
   * @param raw {String}
   * @param payload {Object} fileLoader返回的数据
   */
  function vueFileParser(raw, payload) {
    return new Promise(function (resolve, reject) {
      try {
        var isCached = payload.cached;
        var uid = payload.uuid;
        var hasScopedStyle = false;
        var styles = [];
        var styleMatched = raw.match(/<style\s*[^<]*>\s[^<]*<\/style>/gi);
        if (styleMatched && !isCached) {
          styleMatched.forEach(function (style) {
            var res = /<style\s*([^<]*)>(\s[^<]*)<\/style>/i.exec(style);
            var scoped = !!res[1];
            var css = res[2];
            var styleEl = document.createElement('style');
            styleEl.type = 'text/css';
            styleEl.setAttributeNode(document.createAttribute('module-' + uid));
            styleEl.setAttributeNode(document.createAttribute('vue-loader'));
            if (scoped) {
              hasScopedStyle = true;
              // 添加data-v-xxxx
              css = prefixScopedCss(css, uid);
              styleEl.setAttributeNode(document.createAttribute('is-scoped'));
            }
            styleEl.appendChild(document.createTextNode(css));
            styles.push({
              scoped: scoped,
              value: css,
            });
            document.head.appendChild(styleEl);
          });
        }
        var template = /<template>([\s\S]*)<\/template>/i.exec(raw)[1].replace(/^\s*|\s*$/g, '');
        if (hasScopedStyle) {
          // 正则匹配太麻烦了，所以这里做了一个性能比较差的操作
          // 先转为HtmlElement处理完后再转为字符串
          // 注意：很重要。非web标准的标签一定要闭合
          var elem = transformToDom(template);
          setUuidToNode(elem, uid);
          var t = document.createElement('div');
          t.appendChild(elem.cloneNode(true));
          template = t.innerHTML;
        }
        var scriptMatch = /<script.*>([\s\S]*)<\/script>/i.exec(raw);
        if (!scriptMatch) {
          throw new Error('no script tag detected');
        }
        jsParser(scriptMatch[1]).then(function (res) {
          resolve(
            {
              template: template,
              styles: styles,
              module: function () { var returns = res();returns.default.template = this.template; return returns; },
            }
          );
        }).catch(reject);
      } catch (error) {
        // console.error(error);
        reject(error);
      }
    });
  }
  /**
   * vue文件加载器
   * @returns Promise
   */
  function vueLoader(src) {
    // console.log('vueLoader执行了');
    return fileLoader(src).then(function (res) {
      if (!root.__SRC_MAP__[src].type) {
        root.__SRC_MAP__[src].type = 'vue';
      }
      if (root.__SRC_MAP__[src].module) {
        var vueComponent = root.__SRC_MAP__[src].module().default;
        // vueComponent.template = root.__SRC_MAP__[src].template;
        return vueComponent;
      } else {
        return vueFileParser(res.raw, res).then(function (res) {
          root.__SRC_MAP__[src].template = res.template;
          root.__SRC_MAP__[src].styles = res.styles;
          root.__SRC_MAP__[src].module = res.module;
          var vueComponent = res.module().default;
          // vueComponent.template = res.template;
          return vueComponent;
        }).catch(function (err) {
          // console.error(err);
          throw err;
        });
      }
    });
  }
  /**
   * import入口
   * @param {String} src // 资源路径。因为无法计算相对路径，所以约定统一绝对地址 @/xxx/xxx或以/开头的绝对路径
   * @param {?:String} rootPath // 即src中'@'的值
   * @return Promise
   */
  // 额~~ import是关键字
  root.__import__ = function __import__(src, rootPath) {
    if (!src) {
      throw new Error('Expected src');
    }
    if (!(/^@|^\//g.test(src))) {
      throw new Error('illegal src path; src should startwith @ or /: ' + src);
    }
    src = src.replace(/@/, rootPath === undefined ? root.__BASE_SRC__ : rootPath);
    var acceptLoaders = [
      {
        loader: 'vueLoader',
        test: '*.vue',
      },
      {
        loader: 'jsLoader',
        test: '*.js',
      },
    ];
    var loader;
    acceptLoaders.some(function (item) {
      var reg = item.test.replace(/\*/, '') + '$';
      if (new RegExp(reg).test(src)) {
        loader = eval('(' + item.loader + ')');
        return true;
      }
      return false;
    });
    if (!loader) {
      throw new Error('loader not found: ' + src);
    }
    return loader(src).catch(function (err) {
      console.error(src + '\n' + err);
    });
  };
  /**
   * 设置资源基路径
   * 不推荐更改路径值
   */
  root.__import__.setPath = function setPath(src) {
    root.__BASE_SRC__ = src;
  }
})(new Function('return this')());