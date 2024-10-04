
var PHP = (() => {
  const importMeta = import.meta;var _scriptDir = importMeta.url;
  
  return (
function(moduleArg = {}) {

var Module = moduleArg;

var readyPromiseResolve, readyPromiseReject;

Module["ready"] = new Promise((resolve, reject) => {
 readyPromiseResolve = resolve;
 readyPromiseReject = reject;
});

Module.preRun = Module.preRun || [];

if (typeof Module.preRun == "function") Module.preRun = [ Module.preRun ];

Module.preRun.push(() => Object.assign(ENV, Module.ENV || {}));

var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
 throw toThrow;
};

var ENVIRONMENT_IS_WEB = false;

var ENVIRONMENT_IS_WORKER = true;

var ENVIRONMENT_IS_NODE = false;

var scriptDirectory = "";

function locateFile(path) {
 if (Module["locateFile"]) {
  return Module["locateFile"](path, scriptDirectory);
 }
 return scriptDirectory + path;
}

var read_, readAsync, readBinary, setWindowTitle;

if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = "/";
 } else if (typeof document != "undefined" && document.currentScript) {
  scriptDirectory = document.currentScript.src;
 }
 if (_scriptDir) {
  scriptDirectory = _scriptDir;
 }
 if (scriptDirectory.indexOf("blob:") !== 0) {
  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
 } else {
  scriptDirectory = "";
 }
 {
  read_ = url => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, false);
   xhr.send(null);
   return xhr.responseText;
  };
  if (ENVIRONMENT_IS_WORKER) {
   readBinary = url => {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    return new Uint8Array(xhr.response);
   };
  }
  readAsync = (url, onload, onerror) => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, true);
   xhr.responseType = "arraybuffer";
   xhr.onload = () => {
    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
     onload(xhr.response);
     return;
    }
    onerror();
   };
   xhr.onerror = onerror;
   xhr.send(null);
  };
 }
 setWindowTitle = title => document.title = title;
} else {}

var out = Module["print"] || console.log.bind(console);

var err = Module["printErr"] || console.error.bind(console);

Object.assign(Module, moduleOverrides);

moduleOverrides = null;

if (Module["arguments"]) arguments_ = Module["arguments"];

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

if (Module["quit"]) quit_ = Module["quit"];

var wasmBinary;

if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];

var noExitRuntime = Module["noExitRuntime"] || false;

if (typeof WebAssembly != "object") {
 abort("no native wasm support detected");
}

var wasmMemory;

var wasmExports;

var ABORT = false;

var EXITSTATUS;

function assert(condition, text) {
 if (!condition) {
  abort(text);
 }
}

var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateMemoryViews() {
 var b = wasmMemory.buffer;
 Module["HEAP8"] = HEAP8 = new Int8Array(b);
 Module["HEAP16"] = HEAP16 = new Int16Array(b);
 Module["HEAP32"] = HEAP32 = new Int32Array(b);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
}

var wasmTable;

var __ATPRERUN__ = [];

var __ATINIT__ = [];

var __ATMAIN__ = [];

var __ATEXIT__ = [];

var __ATPOSTRUN__ = [];

var runtimeInitialized = false;

var runtimeExited = false;

var runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
 return noExitRuntime || runtimeKeepaliveCounter > 0;
}

function preRun() {
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
 runtimeInitialized = true;
 if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
 FS.ignorePermissions = false;
 TTY.init();
 SOCKFS.root = FS.mount(SOCKFS, {}, null);
 PIPEFS.root = FS.mount(PIPEFS, {}, null);
 callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
 callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
 ___funcs_on_exit();
 callRuntimeCallbacks(__ATEXIT__);
 FS.quit();
 TTY.shutdown();
 IDBFS.quit();
 runtimeExited = true;
}

function postRun() {
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
 __ATINIT__.unshift(cb);
}

function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}

var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

function getUniqueRunDependency(id) {
 return id;
}

function addRunDependency(id) {
 runDependencies++;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
}

function removeRunDependency(id) {
 runDependencies--;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}

function abort(what) {
 if (Module["onAbort"]) {
  Module["onAbort"](what);
 }
 what = "Aborted(" + what + ")";
 err(what);
 ABORT = true;
 EXITSTATUS = 1;
 what += ". Build with -sASSERTIONS for more info.";
 var e = new WebAssembly.RuntimeError(what);
 readyPromiseReject(e);
 throw e;
}

var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(filename) {
 return filename.startsWith(dataURIPrefix);
}

var wasmBinaryFile;

if (Module["locateFile"]) {
 wasmBinaryFile = "php-worker.mjs.wasm";
 if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
 }
} else {
 wasmBinaryFile = new URL("php-worker.mjs.wasm", import.meta.url).href;
}

function getBinarySync(file) {
 if (file == wasmBinaryFile && wasmBinary) {
  return new Uint8Array(wasmBinary);
 }
 if (readBinary) {
  return readBinary(file);
 }
 throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(binaryFile) {
 if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
  if (typeof fetch == "function") {
   return fetch(binaryFile, {
    credentials: "same-origin"
   }).then(response => {
    if (!response["ok"]) {
     throw "failed to load wasm binary file at '" + binaryFile + "'";
    }
    return response["arrayBuffer"]();
   }).catch(() => getBinarySync(binaryFile));
  }
 }
 return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
 return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(instance => instance).then(receiver, reason => {
  err("failed to asynchronously prepare wasm: " + reason);
  abort(reason);
 });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
 if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && typeof fetch == "function") {
  return fetch(binaryFile, {
   credentials: "same-origin"
  }).then(response => {
   var result = WebAssembly.instantiateStreaming(response, imports);
   return result.then(callback, function(reason) {
    err("wasm streaming compile failed: " + reason);
    err("falling back to ArrayBuffer instantiation");
    return instantiateArrayBuffer(binaryFile, imports, callback);
   });
  });
 }
 return instantiateArrayBuffer(binaryFile, imports, callback);
}

function createWasm() {
 var info = {
  "env": wasmImports,
  "wasi_snapshot_preview1": wasmImports
 };
 function receiveInstance(instance, module) {
  var exports = instance.exports;
  exports = Asyncify.instrumentWasmExports(exports);
  exports = applySignatureConversions(exports);
  wasmExports = exports;
  wasmMemory = wasmExports["memory"];
  updateMemoryViews();
  wasmTable = wasmExports["__indirect_function_table"];
  addOnInit(wasmExports["__wasm_call_ctors"]);
  removeRunDependency("wasm-instantiate");
  return exports;
 }
 addRunDependency("wasm-instantiate");
 function receiveInstantiationResult(result) {
  receiveInstance(result["instance"]);
 }
 if (Module["instantiateWasm"]) {
  try {
   return Module["instantiateWasm"](info, receiveInstance);
  } catch (e) {
   err("Module.instantiateWasm callback failed with error: " + e);
   readyPromiseReject(e);
  }
 }
 instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
 return {};
}

var tempDouble;

var tempI64;

var ASM_CONSTS = {
 1162799: () => typeof Module.cfd1 === "object" && Object.keys(Module.cfd1).length,
 1162877: $0 => {
  const results = Module.targets.get($0);
  if (results) {
   return results.length;
  }
  return 0;
 },
 1162970: $0 => {
  const results = Module.targets.get($0);
  if (results.length) {
   return Object.keys(results[0]).length;
  }
  return 0;
 },
 1163086: ($0, $1) => {
  const targetId = $0;
  const target = Module.targets.get(targetId);
  const current = $1;
  if (current >= target.length) {
   return false;
  }
  return true;
 },
 1163236: ($0, $1) => {
  const results = Module.targets.get($0);
  if (results.length) {
   const jsRet = Object.keys(results[0])[$1];
   const len = lengthBytesUTF8(jsRet) + 1;
   const strLoc = _malloc(len);
   stringToUTF8(jsRet, strLoc, len);
   return strLoc;
  }
  return 0;
 },
 1163474: ($0, $1, $2, $3) => {
  const results = Module.targets.get($0);
  const current = -1 + $1;
  const rv = $3;
  if (current >= results.length) {
   return null;
  }
  const result = results[current];
  const key = Object.keys(result)[$2];
  Module.jsToZval(result[key], rv);
 },
 1163727: ($0, $1) => {
  const statement = Module.targets.get($0);
  const paramVal = Module.zvalToJS($1);
  if (!Module.PdoParams.has(statement)) {
   Module.PdoParams.set(statement, []);
  }
  const paramList = Module.PdoParams.get(statement);
  paramList.push(paramVal);
 },
 1163966: ($0, $1, $2) => {
  console.log("GET ATTR", $0, $1, $2);
 },
 1164007: ($0, $1, $2) => {
  console.log("COL META", $0, $1, $2);
 },
 1164048: ($0, $1, $2) => {
  console.log("CLOSE", $0, $1, $2);
 },
 1164086: $0 => {
  if (typeof Module.cfd1 !== "object") {
   throw new Error("The `cfd1` object must be provided as a constructor arg to PHP to use pdo_cfd1.");
  }
  const dbName = UTF8ToString($0);
  if (typeof Module.cfd1[dbName] !== "object") {
   throw new Error(`The value provided at cfd1[${dbName}] does not exist or is not an object.`);
  }
 },
 1164405: $0 => {
  console.log("CLOSE", $0);
 },
 1164435: ($0, $1, $2) => {
  const dbName = UTF8ToString($0);
  const query = UTF8ToString($1);
  const zv = $2;
  const prepared = Module.cfd1[dbName].prepare(query);
  Module.jsToZval(prepared, zv);
 },
 1164603: () => {
  console.log("BEGIN TXN");
  return true;
 },
 1164646: $0 => {
  console.log("COMMIT TXN", $0);
  return true;
 },
 1164694: $0 => {
  console.log("ROLLBACK TXN", $0);
  return true;
 },
 1164744: ($0, $1, $2) => {
  console.log("SET ATTR", $1, $2);
  return true;
 },
 1164794: $0 => {
  console.log("LAST INSERT ID", UTF8ToString($0));
  return 0;
 },
 1164857: ($0, $1) => {
  console.log("FETCH ERROR FUNC", $0, $1);
 },
 1164902: ($0, $1) => {
  console.log("GET ATTR", $0, $1);
  return 0;
 },
 1164949: () => {
  console.log("SHUTDOWN");
 },
 1164978: $0 => {
  console.log("GET GC", $0);
 },
 1165009: $0 => {
  if (Module.persist) {
   const persist = Array.isArray(Module.persist) ? Module.persist : [ Module.persist ];
   const useNodeRawFS = $0;
   persist.forEach(p => {
    const mountPath = p.mountPath || "/persist";
    const localPath = p.localPath || "./persist";
    FS.mkdir(mountPath);
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
     FS.mount(IDBFS, {
      autoPersist: false
     }, mountPath);
    } else if (ENVIRONMENT_IS_NODE) {
     if (!useNodeRawFS) {
      const fs = (globalThis.__non_webpack_require__ || require)("fs");
      if (!fs.existsSync(localPath)) {
       fs.mkdirSync(localPath, {
        recursive: true
       });
      }
      FS.mount(NODEFS, {
       root: localPath
      }, mountPath);
     }
    }
   });
  }
 },
 1165633: ($0, $1, $2) => {
  const target = Module.targets.get($0);
  const property = UTF8ToString($1);
  const rv = $2;
  if (!(property in target)) {
   return Module.jsToZval(undefined, rv);
  }
  Module.jsToZval(target[property], rv);
 },
 1165834: ($0, $1, $2, $3, $4) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   const funcPtr = $2;
   target[property] = Module.callableToJs(funcPtr);
  })();
 },
 1166037: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   const zvalPtr = $2;
   if (!Module.targets.has(target[property])) {
    target[property] = Module.marshalObject(zvalPtr);
   }
  })();
 },
 1166244: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   delete target[property];
  })();
 },
 1166360: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = null;
  })();
 },
 1166476: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = false;
  })();
 },
 1166593: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = true;
  })();
 },
 1166709: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = $2;
  })();
 },
 1166823: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = $2;
  })();
 },
 1166937: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   const newValue = UTF8ToString($2);
   target[property] = newValue;
  })();
 },
 1167092: ($0, $1, $2) => {
  let target = Module.targets.get($0);
  const property = $1;
  const rv = $2;
  if (target instanceof ArrayBuffer) {
   if (!Module.bufferMaps.has(target)) {
    Module.bufferMaps.set(target, new Uint8Array(target));
   }
   target = Module.bufferMaps.get(target);
  }
  if (!(property in target)) {
   return Module.jsToZval(undefined, rv);
  }
  Module.jsToZval(target[property], rv);
 },
 1167449: ($0, $1, $2, $3) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   const funcPtr = $2;
   target[property] = Module.callableToJs(funcPtr);
  })();
 },
 1167616: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   const zvalPtr = $2;
   if (!Module.targets.has(target[property])) {
    target[property] = Module.marshalObject(zvalPtr);
   }
  })();
 },
 1167809: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   delete target[property];
  })();
 },
 1167911: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = null;
  })();
 },
 1168013: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = false;
  })();
 },
 1168116: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = true;
  })();
 },
 1168218: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = $2;
  })();
 },
 1168318: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = $2;
  })();
 },
 1168418: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   const newValue = UTF8ToString($2);
   target[property] = newValue;
  })();
 },
 1168559: ($0, $1, $2) => {
  console.log("HASD", $0);
  const target = Module.targets.get($0);
  const property = $1;
  const check_empty = $2;
  if (Array.isArray(target)) {
   return typeof target[property] !== "undefined";
  }
  if (target instanceof ArrayBuffer) {
   if (!Module.bufferMaps.has(target)) {
    Module.bufferMaps.set(target, new Uint8Array(target));
   }
   const targetBytes = Module.bufferMaps.get(target);
   return targetBytes[property] !== "undefined";
  }
  if (!check_empty) {
   return property in target;
  } else {
   return !!target[property];
  }
 },
 1169063: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   delete target[property];
  })();
 },
 1169179: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   delete target[property];
  })();
 },
 1169281: $0 => {
  const target = Module.targets.get($0);
  let json;
  if (typeof target === "function") {
   json = JSON.stringify({});
  } else {
   try {
    json = JSON.stringify({
     ...target
    });
   } catch {
    json = JSON.stringify({});
   }
  }
  const str = String(json);
  const len = 1 + lengthBytesUTF8(str);
  const loc = _malloc(len);
  stringToUTF8(str, loc, len);
  return loc;
 },
 1169618: ($0, $1) => {
  const target = Module.targets.get($0);
  const property = UTF8ToString($1);
  return property in target;
 },
 1169723: ($0, $1, $2) => {
  const target = Module.targets.get($0);
  const property_name = UTF8ToString($1);
  const rv = $2;
  return Module.jsToZval(target[property_name], rv);
 },
 1169872: ($0, $1, $2, $3, $4, $5) => {
  const target = Module.targets.get($0);
  const method_name = UTF8ToString($1);
  const argp = $2;
  const argc = $3;
  const size = $4;
  const rv = $5;
  const args = [];
  for (let i = 0; i < argc; i++) {
   const loc = argp + i * size;
   const ptr = Module.getValue(loc, "*");
   const arg = Module.zvalToJS(ptr);
   args.push(arg);
  }
  Module.jsToZval(target[method_name](...args), rv);
 },
 1170239: ($0, $1, $2, $3, $4) => {
  const target = Module.targets.get($0);
  const argv = $1;
  const argc = $2;
  const size = $3;
  const rv = $4;
  const args = [];
  for (let i = 0; i < argc; i++) {
   args.push(Module.zvalToJS(argv + i * size));
  }
  return Module.jsToZval(target(...args), rv);
 },
 1170489: ($0, $1, $2, $3) => {
  const _class = Module._classes.get($0);
  const argv = $1;
  const argc = $2;
  const size = $3;
  const args = [];
  for (let i = 0; i < argc; i++) {
   args.push(Module.zvalToJS(argv + i * size));
  }
  const _object = new _class(...args);
  const index = Module.targets.add(_object);
  Module.tacked.add(_object);
  return index;
 },
 1170802: $0 => {
  const target = Module.targets.get($0);
  Module.tacked.delete(target);
  Module.targets.remove(target);
 },
 1170906: $0 => {
  const target = Module.targets.get($0);
  const str = String(target);
  const len = 1 + lengthBytesUTF8(str);
  const loc = _malloc(len);
  stringToUTF8(str, loc, len);
  return loc;
 },
 1171082: () => {
  const context = {};
  Module.tacked.add(context);
  return Module.targets.add(context);
 },
 1171170: ($0, $1) => {
  const context = Module.targets.get($0);
  const method = UTF8ToString($1);
  context.method = method;
 },
 1171276: ($0, $1) => {
  (() => {
   const context = Module.targets.get($0);
   const headerLine = UTF8ToString($1);
   const colon = headerLine.indexOf(":");
   const key = headerLine.substr(0, colon).trim();
   const val = headerLine.substr(1 + colon).trim();
   context.headers = context.headers ?? {};
   context.headers[key] = val;
   console.log(context.headers);
  })();
 },
 1171606: ($0, $1) => {
  (() => {
   const context = Module.targets.get($0);
   const headerLines = UTF8ToString($1);
   headerLines.split("\n").forEach(headerLine => {
    const context = Module.targets.get($0);
    const colon = headerLine.indexOf(":");
    const key = headerLine.substr(0, colon).trim();
    const val = headerLine.substr(1 + colon).trim();
    context.headers = context.headers ?? {};
    context.headers[key] = val;
    console.log(context.headers);
   });
  })();
 },
 1172029: ($0, $1, $2) => {
  (() => {
   const context = Module.targets.get($0);
   context.body = Module.HEAPU8.slice($1, $1 + $2);
  })();
 },
 1172136: ($0, $1) => {
  const context = Module.targets.get($0);
  context.ignoreErrors = $1;
 },
 1172211: $0 => {
  const {status: status} = Module.targets.get($0);
  return status;
 },
 1172275: $0 => {
  const str = String(eval(UTF8ToString($0)));
  const len = lengthBytesUTF8(str) + 1;
  const loc = _malloc(len);
  stringToUTF8(str, loc, len);
  return loc;
 },
 1172428: ($0, $1) => {
  const funcName = UTF8ToString($0);
  const argJson = UTF8ToString($1);
  const func = globalThis[funcName];
  const args = JSON.parse(argJson || "[]") || [];
  const str = String(func(...args));
  const len = lengthBytesUTF8(str) + 1;
  const loc = _malloc(len);
  stringToUTF8(str, loc, len);
  return loc;
 },
 1172724: ($0, $1) => {
  const timeout = Number(UTF8ToString($0));
  const funcPtr = $1;
  setTimeout(() => {
   Module.ccall("vrzno_exec_callback", "number", [ "number", "number", "number", "number" ], [ funcPtr, null, 0, 0 ]);
   Module.ccall("vrzno_del_callback", "number", [ "number" ], [ funcPtr ]);
  }, timeout);
 },
 1173008: ($0, $1) => {
  const name = UTF8ToString($0);
  const rv = $1;
  Module.jsToZval(Module[name], rv);
 },
 1173093: ($0, $1) => {
  const name = UTF8ToString($0);
  const rv = $1;
  Module.jsToZval(Module.shared[name], rv);
 },
 1173185: ($0, $1) => {
  const name = UTF8ToString($0);
  const rv = $1;
  Module.jsToZval(import(/* webpackIgnore: true */ name), rv);
 },
 1173270: () => {
  const IS_UNDEF = 0;
  const IS_NULL = 1;
  const IS_FALSE = 2;
  const IS_TRUE = 3;
  const IS_LONG = 4;
  const IS_DOUBLE = 5;
  const IS_STRING = 6;
  const IS_ARRAY = 7;
  const IS_OBJECT = 8;
  Module.hasVrzno = true;
  Module.tacked = new Set;
  const FinReg = globalThis.FinalizationRegistry || class {
   register() {}
   unregister() {}
  };
  const wRef = globalThis.WeakRef || class {
   constructor(val) {
    this.val = val;
   }
   deref() {
    return this.val;
   }
  };
  Module.fRegistry = Module.fRegistry || new FinReg(zvalPtr => {
   Module.ccall("vrzno_expose_dec_refcount", "number", [ "number" ], [ zvalPtr ]);
  });
  Module.bufferMaps = new WeakMap;
  const getRegistry = weakerMap => {
   const registry = new FinReg(key => {
    if (weakerMap.registry !== registry) {
     return;
    }
    if (weakerMap.map.has(key) && weakerMap.map.get(key).deref()) {
     return;
    }
    weakerMap.delete(key);
   });
   return registry;
  };
  Module.WeakerMap = Module.WeakerMap || class WeakerMap {
   constructor(entries) {
    this.map = new Map;
    this.registry = getRegistry(this);
    entries && entries.forEach(([key, value]) => this.set(key, value));
   }
   get size() {
    return this.map.size;
   }
   clear() {
    this.registry = getRegistry(this);
    this.map.clear();
   }
   delete(key) {
    if (!this.has(key)) {
     return;
    }
    this.registry.unregister(this.get(key));
    this.map.delete(key);
   }
   [Symbol.iterator]() {
    const mapIterator = this.map[Symbol.iterator]();
    return {
     next: () => {
      do {
       const entry = mapIterator.next();
       if (entry.done) {
        return {
         done: true
        };
       }
       const [key, ref] = entry.value;
       const value = ref.deref();
       if (!value) {
        this.map.delete(key);
        continue;
       }
       return {
        done: false,
        value: [ key, value ]
       };
      } while (true);
     }
    };
   }
   entries() {
    return {
     [Symbol.iterator]: () => this[Symbol.iterator]()
    };
   }
   forEach(callback) {
    for (const [k, v] of this) {
     callback(v, k, this);
    }
   }
   get(key) {
    if (!this.has(key)) {
     return;
    }
    const value = this.map.get(key).deref();
    if (!value) {
     this.map.delete(key);
    }
    return value;
   }
   has(key) {
    if (!this.map.has(key)) {
     return false;
    }
    const result = this.map.get(key).deref();
    if (!result) {
     this.map.delete(key);
    }
    return Boolean(result);
   }
   keys() {
    return [ ...this ].map(v => v[0]);
   }
   set(key, value) {
    if (typeof value !== "function" && typeof value !== "object") {
     throw new Error("WeakerMap values must be objects.");
    }
    if (this.map.has(key)) {
     this.registry.unregister(this.get(key));
    }
    this.registry.register(value, key, value);
    return this.map.set(key, new wRef(value));
   }
   values() {
    return [ ...this ].map(v => v[1]);
   }
  };
  Module.marshalObject = (zv, type) => {
   const nativeTarget = Module.ccall("vrzno_expose_target", "number", [ "number" ], [ zv ]);
   if (nativeTarget && Module.targets.hasId(nativeTarget)) {
    return Module.targets.get(nativeTarget);
   }
   const proxy = new Proxy({}, {
    ownKeys: target => {
     let keysLoc;
     if (type === IS_ARRAY) {
      keysLoc = Module.ccall("vrzno_expose_array_keys", "number", [ "number" ], [ zv ]);
     } else if (type === IS_OBJECT) {
      keysLoc = Module.ccall("vrzno_expose_object_keys", "number", [ "number" ], [ zv ]);
     }
     if (keysLoc) {
      const keyJson = UTF8ToString(keysLoc);
      const keys = JSON.parse(keyJson);
      _free(keysLoc);
      keys.push(...Reflect.ownKeys(target));
      return keys;
     }
     return [];
    },
    has: (target, prop) => {
     switch (typeof prop) {
     case "number":
      return !!Module.ccall("vrzno_expose_dimension_pointer", "number", [ "number", "number" ], [ zv, prop ]);

     case "string":
      const len = lengthBytesUTF8(prop) + 1;
      const namePtr = _malloc(len);
      stringToUTF8(prop, namePtr, len);
      const propPtr = Module.ccall("vrzno_expose_property_pointer", "number", [ "number", "number" ], [ zv, namePtr ]);
      _free(namePtr);
      return propPtr;

     default:
      return false;
     }
    },
    get: (target, prop) => {
     let retPtr;
     if (prop === Symbol.iterator) {
      const max = Module.ccall("vrzno_expose_array_length", "number", [ "number" ], [ zv ]);
      const iterator = () => {
       let current = -1;
       return {
        next() {
         const done = ++current >= max;
         return {
          done: done,
          value: Module.zvalToJS(Module.ccall("vrzno_expose_dimension_pointer", "number", [ "number", "number" ], [ zv, current ]))
         };
        }
       };
      };
      Module.ccall("vrzno_expose_inc_refcount", "number", [ "number" ], [ zv ]);
      Module.fRegistry.register(iterator, zv, iterator);
      return iterator;
     }
     if (prop === Symbol.toPrimitive) {
      const method = "__toString";
      const len = lengthBytesUTF8(method) + 1;
      const loc = _malloc(len);
      stringToUTF8(method, loc, len);
      const methodPtr = Module.ccall("vrzno_expose_method_pointer", "number", [ "number", "number" ], [ zv, loc ]);
      _free(loc);
      return () => Module.callableToJs(methodPtr, zv)();
     }
     switch (typeof prop) {
     case "number":
      retPtr = Module.ccall("vrzno_expose_dimension_pointer", "number", [ "number", "number" ], [ zv, prop ]);
      break;

     case "string":
      prop = String(prop);
      const len = lengthBytesUTF8(prop) + 1;
      const loc = _malloc(len);
      stringToUTF8(prop, loc, len);
      if (type === IS_OBJECT) {
       const methodPtr = Module.ccall("vrzno_expose_method_pointer", "number", [ "number", "number" ], [ zv, loc ]);
       if (methodPtr) {
        return Module.callableToJs(methodPtr, zv);
       }
       retPtr = Module.ccall("vrzno_expose_property_pointer", "number", [ "number", "number" ], [ zv, loc ]);
      } else if (type === IS_ARRAY) {
       retPtr = Module.ccall("vrzno_expose_key_pointer", "number", [ "number", "number" ], [ zv, loc ]);
      }
      _free(loc);
      break;

     default:
      return false;
     }
     if (!retPtr) {
      return;
     }
     const proxy = Module.zvalToJS(retPtr);
     return proxy ?? Reflect.get(target, prop);
    },
    getOwnPropertyDescriptor: (target, prop) => {
     let retPtr;
     switch (typeof prop) {
     case "number":
      retPtr = Module.ccall("vrzno_expose_dimension_pointer", "number", [ "number", "number" ], [ zv, prop ]);
      break;

     case "string":
      const len = lengthBytesUTF8(prop) + 1;
      const namePtr = _malloc(len);
      stringToUTF8(prop, namePtr, len);
      if (type === IS_OBJECT) {
       retPtr = Module.ccall("vrzno_expose_property_pointer", "number", [ "number", "number" ], [ zv, namePtr ]);
      } else if (type === IS_ARRAY) {
       retPtr = Module.ccall("vrzno_expose_key_pointer", "number", [ "number", "number" ], [ zv, namePtr ]);
      }
      _free(namePtr);
      break;

     default:
      return false;
     }
     const proxy = Module.zvalToJS(retPtr);
     return {
      configurable: true,
      enumerable: true,
      value: target[prop]
     };
    }
   });
   Module.ccall("vrzno_expose_inc_refcount", "number", [ "number" ], [ zv ]);
   return proxy;
  };
  Module.callableToJs = Module.callableToJs || ((funcPtr, objPtr = null) => {
   if (Module.callables.has(funcPtr)) {
    return Module.callables.get(funcPtr);
   }
   const wrapped = (...args) => {
    let paramsPtr = null;
    if (args.length) {
     paramsPtr = Module.ccall("vrzno_expose_create_params", "number", [ "number" ], [ args.length ]);
     for (let i = 0; i < args.length; i++) {
      Module.jsToZval(args[i], getValue(i * 4 + paramsPtr, "*"));
     }
    }
    const zv = Module.ccall("vrzno_exec_callback", "number", [ "number", "number", "number", "number" ], [ funcPtr, paramsPtr, args.length, objPtr ]);
    if (args.length) {
     Module.ccall("vrzno_expose_efree", "number", [ "number" ], [ paramsPtr ]);
    }
    if (zv) {
     const result = Module.zvalToJS(zv);
     if (result && [ "function", "object" ].includes(typeof result)) {
      Module.ccall("vrzno_expose_inc_refcount", "number", [ "number" ], [ zv ]);
      Module.fRegistry.register(result, zv, result);
     }
     return result;
    }
   };
   Object.defineProperty(wrapped, "name", {
    value: `PHP_@{0x${funcPtr.toString(16)}}`
   });
   Module.ccall("vrzno_expose_inc_crefcount", "number", [ "number" ], [ funcPtr ]);
   Module.callables.set(funcPtr, wrapped);
   return wrapped;
  });
  Module.zvalToJS = Module.zvalToJS || (zv => {
   if (!zv) {
    return;
   }
   zv = Module.ccall("vrzno_expose_zval_deref", "number", [ "number" ], [ zv ]);
   const isNative = Module.ccall("vrzno_expose_target", "number", [ "number" ], [ zv ]);
   if (isNative) {
    return Module.targets.get(isNative);
   }
   const callable = Module.ccall("vrzno_expose_callable", "number", [ "number" ], [ zv ]);
   let valPtr;
   if (callable) {
    const wrapped = Module.callableToJs(callable);
    if (!Module.targets.has(wrapped)) {
     Module.targets.add(wrapped);
     Module.ccall("vrzno_expose_inc_refcount", "number", [ "number" ], [ zv ]);
     Module.fRegistry.register(wrapped, zv, wrapped);
    }
    return wrapped;
   }
   const type = Module.ccall("vrzno_expose_type", "number", [ "number" ], [ zv ]);
   switch (type) {
   case IS_UNDEF:
    return undefined;
    break;

   case IS_NULL:
    return null;
    break;

   case IS_TRUE:
    return true;
    break;

   case IS_FALSE:
    return false;
    break;

   case IS_LONG:
    return Module.ccall("vrzno_expose_long", "number", [ "number" ], [ zv ]);
    break;

   case IS_DOUBLE:
    valPtr = Module.ccall("vrzno_expose_double", "number", [ "number" ], [ zv ]);
    if (!valPtr) {
     return null;
    }
    return getValue(valPtr, "double");
    break;

   case IS_STRING:
    valPtr = Module.ccall("vrzno_expose_string", "number", [ "number" ], [ zv ]);
    if (!valPtr) {
     return null;
    }
    return UTF8ToString(valPtr);
    break;

   case IS_ARRAY:
   case IS_OBJECT:
    return Module.marshalObject(zv, type);

   default:
    return null;
    break;
   }
  });
  Module.jsToZval = Module.jsToZval || ((value, rv) => {
   if (typeof value === "undefined") {
    Module.ccall("vrzno_expose_create_undef", "number", [ "number" ], [ rv ]);
   } else if (value === null) {
    Module.ccall("vrzno_expose_create_null", "number", [ "number" ], [ rv ]);
   } else if ([ true, false ].includes(value)) {
    Module.ccall("vrzno_expose_create_bool", "number", [ "number", "number" ], [ value, rv ]);
   } else if (value && [ "function", "object" ].includes(typeof value)) {
    const index = Module.targets.add(value);
    const isFunction = typeof value === "function" ? index : 0;
    const isConstructor = isFunction && !!(value.prototype && value.prototype.constructor);
    Module.ccall("vrzno_expose_create_object_for_target", "number", [ "number", "number", "number", "number" ], [ index, isFunction, isConstructor, rv ]);
    Module.tacked.add(value);
    Module.ccall("vrzno_expose_inc_refcount", "number", [ "number" ], [ rv ]);
    Module.fRegistry.register(value, rv, value);
   } else if (typeof value === "number") {
    if (Number.isInteger(value)) {
     Module.ccall("vrzno_expose_create_long", "number", [ "number", "number" ], [ value, rv ]);
    } else if (Number.isFinite(value)) {
     Module.ccall("vrzno_expose_create_double", "number", [ "number", "number" ], [ value, rv ]);
    }
   } else if (typeof value === "string") {
    const len = lengthBytesUTF8(value) + 1;
    const loc = _malloc(len);
    stringToUTF8(value, loc, len);
    Module.ccall("vrzno_expose_create_string", "number", [ "number", "number" ], [ loc, rv ]);
    _free(loc);
   }
  });
  Module.UniqueIndex = Module.UniqueIndex || class UniqueIndex {
   constructor() {
    this.byObject = new WeakMap;
    this.byInteger = new Module.WeakerMap;
    this.id = 0;
    Object.defineProperty(this, "add", {
     configurable: false,
     writable: false,
     value: callback => {
      if (this.byObject.has(callback)) {
       const id = this.byObject.get(callback);
       return id;
      }
      const newid = ++this.id;
      this.byObject.set(callback, newid);
      this.byInteger.set(newid, callback);
      return newid;
     }
    });
    Object.defineProperty(this, "has", {
     configurable: false,
     writable: false,
     value: obj => {
      if (this.byObject.has(obj)) {
       return this.byObject.get(obj);
      }
     }
    });
    Object.defineProperty(this, "hasId", {
     configurable: false,
     writable: false,
     value: address => {
      if (this.byInteger.has(address)) {
       return this.byInteger.get(address);
      }
     }
    });
    Object.defineProperty(this, "get", {
     configurable: false,
     writable: false,
     value: address => {
      if (this.byInteger.has(address)) {
       return this.byInteger.get(address);
      }
     }
    });
    Object.defineProperty(this, "getId", {
     configurable: false,
     writable: false,
     value: obj => {
      if (this.byObject.has(obj)) {
       return this.byObject.get(obj);
      }
     }
    });
    Object.defineProperty(this, "remove", {
     configurable: false,
     writable: false,
     value: address => {
      const obj = this.byInteger.get(address);
      if (obj) {
       this.byObject.delete(obj);
       this.byInteger.delete(address);
      }
     }
    });
   }
  };
  Module.classes = Module.classes || new WeakMap;
  Module._classes = Module._classes || new Module.WeakerMap;
  Module.callables = Module.callables || new Module.WeakerMap;
  Module.targets = Module.targets || new Module.UniqueIndex;
  Module.targets.add(globalThis);
  Module.PdoParams = new WeakMap;
 },
 1185209: $0 => {
  const target = Module.targets.get($0);
  return Module.classes.get(target);
 },
 1185287: ($0, $1) => {
  const target = Module.targets.get($0);
  Module.classes.set(target, $1);
  Module._classes.set($1, target);
 },
 1185395: ($0, $1, $2, $3) => {
  const target = Module.targets.get($0);
  const dest = $1;
  const fpos = $2;
  let count = $3;
  if (target.status >= 400 && !target.context.ignoreErrors) {
   return 0;
  }
  if (fpos >= target.buffer.length) {
   count = 0;
  } else if (fpos + count > target.buffer.length) {
   count = target.buffer.length - fpos;
  }
  if (count) {
   Module.HEAPU8.set(target.buffer.slice(fpos, fpos + count), dest);
  }
  return count;
 },
 1185787: $0 => {
  const parsed = Module.targets.get($0);
  Module.tacked.delete(parsed);
 },
 1185860: $0 => {
  const _class = Module._classes.get($0);
  if (_class) {
   return Module.targets.getId(_class);
  }
  return Module.targets.add(globalThis);
 },
 1185995: ($0, $1) => {
  let target = Module.targets.get($0);
  const property = $1;
  if (target instanceof ArrayBuffer) {
   if (!Module.bufferMaps.has(target)) {
    Module.bufferMaps.set(target, new Uint8Array(target));
   }
   target = Module.bufferMaps.get(target);
  }
  if (Array.isArray(target) || ArrayBuffer.isView(target)) {
   if (property >= 0 && property < target.length) {
    return 1;
   }
  }
  return 0;
 },
 1186358: ($0, $1, $2) => {
  let target = Module.targets.get($0);
  const property = $1;
  const rv = $2;
  if (target instanceof ArrayBuffer) {
   if (!Module.bufferMaps.has(target)) {
    Module.bufferMaps.set(target, new Uint8Array(target));
   }
   target = Module.bufferMaps.get(target);
  }
  return Module.jsToZval(target[property], rv);
 },
 1186653: $0 => {
  const target = Module.targets.get($0);
  if (target) {
   Module.tacked.delete(target);
   Module.fRegistry.unregister(target);
  }
 }
};

function __asyncjs__pdo_cfd1_real_stmt_execute(targetId, rv) {
 return Asyncify.handleAsync(async () => {
  const statement = Module.targets.get(targetId);
  if (!Module.PdoParams.has(statement)) {
   Module.PdoParams.set(statement, []);
  }
  const paramList = Module.PdoParams.get(statement);
  const bound = paramList.length ? statement.bind(...paramList) : statement;
  const result = await bound.run();
  Module.PdoParams.delete(statement);
  if (!result.success) {
   return false;
  }
  Module.jsToZval(result.results, rv);
 });
}

function __asyncjs__php_stream_fetch_real_open(path, _context, ptrsize, headersv, headersc) {
 return Asyncify.handleAsync(async () => {
  const pathString = UTF8ToString(path);
  const context = Module.targets.get(_context) || {};
  const response = await fetch(pathString, context);
  const buffer = new Uint8Array(await response.arrayBuffer());
  const status = response.status;
  const headerLines = [ ...response.headers.entries() ].map(([key, val]) => `${key}: ${val}`);
  headerLines.unshift(`HTTP/1.1 ${response.status} ${response.statusText}`);
  const headersloc = _malloc(ptrsize * headerLines.length);
  setValue(headersv, headersloc, "*");
  setValue(headersc, headerLines.length, "i32");
  let i = 0;
  for (const line of headerLines) {
   const len = lengthBytesUTF8(line);
   const loc = _malloc(len);
   stringToUTF8(line, loc, len);
   setValue(headersloc + i * ptrsize, loc, "i" + 8 * ptrsize);
   i++;
  }
  const parsed = {
   status: status,
   buffer: buffer,
   context: context
  };
  Module.tacked.add(parsed);
  Module.tacked.delete(context);
  return Module.targets.add(parsed);
 });
}

function __asyncjs__vrzno_await_internal(targetId, rv) {
 return Asyncify.handleAsync(async () => {
  const target = Module.targets.get(targetId);
  const result = await target;
  Module.jsToZval(result, rv);
 });
}

function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = `Program terminated with exit(${status})`;
 this.status = status;
}

var callRuntimeCallbacks = callbacks => {
 while (callbacks.length > 0) {
  callbacks.shift()(Module);
 }
};

function getValue(ptr, type = "i8") {
 if (type.endsWith("*")) type = "*";
 switch (type) {
 case "i1":
  return HEAP8[ptr >>> 0];

 case "i8":
  return HEAP8[ptr >>> 0];

 case "i16":
  return HEAP16[ptr >>> 1];

 case "i32":
  return HEAP32[ptr >>> 2];

 case "i64":
  abort("to do getValue(i64) use WASM_BIGINT");

 case "float":
  return HEAPF32[ptr >>> 2];

 case "double":
  return HEAPF64[ptr >>> 3];

 case "*":
  return HEAPU32[ptr >>> 2];

 default:
  abort(`invalid type for getValue: ${type}`);
 }
}

function setValue(ptr, value, type = "i8") {
 if (type.endsWith("*")) type = "*";
 switch (type) {
 case "i1":
  HEAP8[ptr >>> 0] = value;
  break;

 case "i8":
  HEAP8[ptr >>> 0] = value;
  break;

 case "i16":
  HEAP16[ptr >>> 1] = value;
  break;

 case "i32":
  HEAP32[ptr >>> 2] = value;
  break;

 case "i64":
  abort("to do setValue(i64) use WASM_BIGINT");

 case "float":
  HEAPF32[ptr >>> 2] = value;
  break;

 case "double":
  HEAPF64[ptr >>> 3] = value;
  break;

 case "*":
  HEAPU32[ptr >>> 2] = value;
  break;

 default:
  abort(`invalid type for setValue: ${type}`);
 }
}

function convertI32PairToI53Checked(lo, hi) {
 return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
}

var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;

var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
 idx >>>= 0;
 var endIdx = idx + maxBytesToRead;
 var endPtr = idx;
 while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
 if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
  return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
 }
 var str = "";
 while (idx < endPtr) {
  var u0 = heapOrArray[idx++];
  if (!(u0 & 128)) {
   str += String.fromCharCode(u0);
   continue;
  }
  var u1 = heapOrArray[idx++] & 63;
  if ((u0 & 224) == 192) {
   str += String.fromCharCode((u0 & 31) << 6 | u1);
   continue;
  }
  var u2 = heapOrArray[idx++] & 63;
  if ((u0 & 240) == 224) {
   u0 = (u0 & 15) << 12 | u1 << 6 | u2;
  } else {
   u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
  }
  if (u0 < 65536) {
   str += String.fromCharCode(u0);
  } else {
   var ch = u0 - 65536;
   str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
  }
 }
 return str;
};

var UTF8ToString = (ptr, maxBytesToRead) => {
 ptr >>>= 0;
 return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
};

function ___assert_fail(condition, filename, line, func) {
 condition >>>= 0;
 filename >>>= 0;
 func >>>= 0;
 abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);
}

var ___call_sighandler = function(fp, sig) {
 fp >>>= 0;
 return (a1 => dynCall_vi.apply(null, [ fp, a1 ]))(sig);
};

var PATH = {
 isAbs: path => path.charAt(0) === "/",
 splitPath: filename => {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  return splitPathRe.exec(filename).slice(1);
 },
 normalizeArray: (parts, allowAboveRoot) => {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
   var last = parts[i];
   if (last === ".") {
    parts.splice(i, 1);
   } else if (last === "..") {
    parts.splice(i, 1);
    up++;
   } else if (up) {
    parts.splice(i, 1);
    up--;
   }
  }
  if (allowAboveRoot) {
   for (;up; up--) {
    parts.unshift("..");
   }
  }
  return parts;
 },
 normalize: path => {
  var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
  path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
  if (!path && !isAbsolute) {
   path = ".";
  }
  if (path && trailingSlash) {
   path += "/";
  }
  return (isAbsolute ? "/" : "") + path;
 },
 dirname: path => {
  var result = PATH.splitPath(path), root = result[0], dir = result[1];
  if (!root && !dir) {
   return ".";
  }
  if (dir) {
   dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
 },
 basename: path => {
  if (path === "/") return "/";
  path = PATH.normalize(path);
  path = path.replace(/\/$/, "");
  var lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) return path;
  return path.substr(lastSlash + 1);
 },
 join: function() {
  var paths = Array.prototype.slice.call(arguments);
  return PATH.normalize(paths.join("/"));
 },
 join2: (l, r) => PATH.normalize(l + "/" + r)
};

var initRandomFill = () => {
 if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
  return view => crypto.getRandomValues(view);
 } else abort("initRandomDevice");
};

var randomFill = view => (randomFill = initRandomFill())(view);

var PATH_FS = {
 resolve: function() {
  var resolvedPath = "", resolvedAbsolute = false;
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
   var path = i >= 0 ? arguments[i] : FS.cwd();
   if (typeof path != "string") {
    throw new TypeError("Arguments to path.resolve must be strings");
   } else if (!path) {
    return "";
   }
   resolvedPath = path + "/" + resolvedPath;
   resolvedAbsolute = PATH.isAbs(path);
  }
  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
 },
 relative: (from, to) => {
  from = PATH_FS.resolve(from).substr(1);
  to = PATH_FS.resolve(to).substr(1);
  function trim(arr) {
   var start = 0;
   for (;start < arr.length; start++) {
    if (arr[start] !== "") break;
   }
   var end = arr.length - 1;
   for (;end >= 0; end--) {
    if (arr[end] !== "") break;
   }
   if (start > end) return [];
   return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split("/"));
  var toParts = trim(to.split("/"));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
   if (fromParts[i] !== toParts[i]) {
    samePartsLength = i;
    break;
   }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
   outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
 }
};

var FS_stdin_getChar_buffer = [];

var lengthBytesUTF8 = str => {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var c = str.charCodeAt(i);
  if (c <= 127) {
   len++;
  } else if (c <= 2047) {
   len += 2;
  } else if (c >= 55296 && c <= 57343) {
   len += 4;
   ++i;
  } else {
   len += 3;
  }
 }
 return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
 outIdx >>>= 0;
 if (!(maxBytesToWrite > 0)) return 0;
 var startIdx = outIdx;
 var endIdx = outIdx + maxBytesToWrite - 1;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) {
   var u1 = str.charCodeAt(++i);
   u = 65536 + ((u & 1023) << 10) | u1 & 1023;
  }
  if (u <= 127) {
   if (outIdx >= endIdx) break;
   heap[outIdx++ >>> 0] = u;
  } else if (u <= 2047) {
   if (outIdx + 1 >= endIdx) break;
   heap[outIdx++ >>> 0] = 192 | u >> 6;
   heap[outIdx++ >>> 0] = 128 | u & 63;
  } else if (u <= 65535) {
   if (outIdx + 2 >= endIdx) break;
   heap[outIdx++ >>> 0] = 224 | u >> 12;
   heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
   heap[outIdx++ >>> 0] = 128 | u & 63;
  } else {
   if (outIdx + 3 >= endIdx) break;
   heap[outIdx++ >>> 0] = 240 | u >> 18;
   heap[outIdx++ >>> 0] = 128 | u >> 12 & 63;
   heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
   heap[outIdx++ >>> 0] = 128 | u & 63;
  }
 }
 heap[outIdx >>> 0] = 0;
 return outIdx - startIdx;
};

function intArrayFromString(stringy, dontAddNull, length) {
 var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
 var u8array = new Array(len);
 var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
 if (dontAddNull) u8array.length = numBytesWritten;
 return u8array;
}

var FS_stdin_getChar = () => {
 if (!FS_stdin_getChar_buffer.length) {
  var result = null;
  if (typeof window != "undefined" && typeof window.prompt == "function") {
   result = window.prompt("Input: ");
   if (result !== null) {
    result += "\n";
   }
  } else if (typeof readline == "function") {
   result = readline();
   if (result !== null) {
    result += "\n";
   }
  }
  if (!result) {
   return null;
  }
  FS_stdin_getChar_buffer = intArrayFromString(result, true);
 }
 return FS_stdin_getChar_buffer.shift();
};

var TTY = {
 ttys: [],
 init: function() {},
 shutdown: function() {},
 register: function(dev, ops) {
  TTY.ttys[dev] = {
   input: [],
   output: [],
   ops: ops
  };
  FS.registerDevice(dev, TTY.stream_ops);
 },
 stream_ops: {
  open: function(stream) {
   var tty = TTY.ttys[stream.node.rdev];
   if (!tty) {
    throw new FS.ErrnoError(43);
   }
   stream.tty = tty;
   stream.seekable = false;
  },
  close: function(stream) {
   stream.tty.ops.fsync(stream.tty);
  },
  fsync: function(stream) {
   stream.tty.ops.fsync(stream.tty);
  },
  read: function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.get_char) {
    throw new FS.ErrnoError(60);
   }
   var bytesRead = 0;
   for (var i = 0; i < length; i++) {
    var result;
    try {
     result = stream.tty.ops.get_char(stream.tty);
    } catch (e) {
     throw new FS.ErrnoError(29);
    }
    if (result === undefined && bytesRead === 0) {
     throw new FS.ErrnoError(6);
    }
    if (result === null || result === undefined) break;
    bytesRead++;
    buffer[offset + i] = result;
   }
   if (bytesRead) {
    stream.node.timestamp = Date.now();
   }
   return bytesRead;
  },
  write: function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.put_char) {
    throw new FS.ErrnoError(60);
   }
   try {
    for (var i = 0; i < length; i++) {
     stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
    }
   } catch (e) {
    throw new FS.ErrnoError(29);
   }
   if (length) {
    stream.node.timestamp = Date.now();
   }
   return i;
  }
 },
 default_tty_ops: {
  get_char: function(tty) {
   return FS_stdin_getChar();
  },
  put_char: function(tty, val) {
   if (val === null || val === 10) {
    out(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  },
  fsync: function(tty) {
   if (tty.output && tty.output.length > 0) {
    out(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  },
  ioctl_tcgets: function(tty) {
   return {
    c_iflag: 25856,
    c_oflag: 5,
    c_cflag: 191,
    c_lflag: 35387,
    c_cc: [ 3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
   };
  },
  ioctl_tcsets: function(tty, optional_actions, data) {
   return 0;
  },
  ioctl_tiocgwinsz: function(tty) {
   return [ 24, 80 ];
  }
 },
 default_tty1_ops: {
  put_char: function(tty, val) {
   if (val === null || val === 10) {
    err(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  },
  fsync: function(tty) {
   if (tty.output && tty.output.length > 0) {
    err(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  }
 }
};

var zeroMemory = (address, size) => {
 HEAPU8.fill(0, address, address + size);
 return address;
};

var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;

var mmapAlloc = size => {
 size = alignMemory(size, 65536);
 var ptr = _emscripten_builtin_memalign(65536, size);
 if (!ptr) return 0;
 return zeroMemory(ptr, size);
};

var MEMFS = {
 ops_table: null,
 mount(mount) {
  return MEMFS.createNode(null, "/", 16384 | 511, 0);
 },
 createNode(parent, name, mode, dev) {
  if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
   throw new FS.ErrnoError(63);
  }
  if (!MEMFS.ops_table) {
   MEMFS.ops_table = {
    dir: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      lookup: MEMFS.node_ops.lookup,
      mknod: MEMFS.node_ops.mknod,
      rename: MEMFS.node_ops.rename,
      unlink: MEMFS.node_ops.unlink,
      rmdir: MEMFS.node_ops.rmdir,
      readdir: MEMFS.node_ops.readdir,
      symlink: MEMFS.node_ops.symlink
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek
     }
    },
    file: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek,
      read: MEMFS.stream_ops.read,
      write: MEMFS.stream_ops.write,
      allocate: MEMFS.stream_ops.allocate,
      mmap: MEMFS.stream_ops.mmap,
      msync: MEMFS.stream_ops.msync
     }
    },
    link: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      readlink: MEMFS.node_ops.readlink
     },
     stream: {}
    },
    chrdev: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: FS.chrdev_stream_ops
    }
   };
  }
  var node = FS.createNode(parent, name, mode, dev);
  if (FS.isDir(node.mode)) {
   node.node_ops = MEMFS.ops_table.dir.node;
   node.stream_ops = MEMFS.ops_table.dir.stream;
   node.contents = {};
  } else if (FS.isFile(node.mode)) {
   node.node_ops = MEMFS.ops_table.file.node;
   node.stream_ops = MEMFS.ops_table.file.stream;
   node.usedBytes = 0;
   node.contents = null;
  } else if (FS.isLink(node.mode)) {
   node.node_ops = MEMFS.ops_table.link.node;
   node.stream_ops = MEMFS.ops_table.link.stream;
  } else if (FS.isChrdev(node.mode)) {
   node.node_ops = MEMFS.ops_table.chrdev.node;
   node.stream_ops = MEMFS.ops_table.chrdev.stream;
  }
  node.timestamp = Date.now();
  if (parent) {
   parent.contents[name] = node;
   parent.timestamp = node.timestamp;
  }
  return node;
 },
 getFileDataAsTypedArray(node) {
  if (!node.contents) return new Uint8Array(0);
  if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
  return new Uint8Array(node.contents);
 },
 expandFileStorage(node, newCapacity) {
  var prevCapacity = node.contents ? node.contents.length : 0;
  if (prevCapacity >= newCapacity) return;
  var CAPACITY_DOUBLING_MAX = 1024 * 1024;
  newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
  if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
  var oldContents = node.contents;
  node.contents = new Uint8Array(newCapacity);
  if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
 },
 resizeFileStorage(node, newSize) {
  if (node.usedBytes == newSize) return;
  if (newSize == 0) {
   node.contents = null;
   node.usedBytes = 0;
  } else {
   var oldContents = node.contents;
   node.contents = new Uint8Array(newSize);
   if (oldContents) {
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
   }
   node.usedBytes = newSize;
  }
 },
 node_ops: {
  getattr(node) {
   var attr = {};
   attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
   attr.ino = node.id;
   attr.mode = node.mode;
   attr.nlink = 1;
   attr.uid = 0;
   attr.gid = 0;
   attr.rdev = node.rdev;
   if (FS.isDir(node.mode)) {
    attr.size = 4096;
   } else if (FS.isFile(node.mode)) {
    attr.size = node.usedBytes;
   } else if (FS.isLink(node.mode)) {
    attr.size = node.link.length;
   } else {
    attr.size = 0;
   }
   attr.atime = new Date(node.timestamp);
   attr.mtime = new Date(node.timestamp);
   attr.ctime = new Date(node.timestamp);
   attr.blksize = 4096;
   attr.blocks = Math.ceil(attr.size / attr.blksize);
   return attr;
  },
  setattr(node, attr) {
   if (attr.mode !== undefined) {
    node.mode = attr.mode;
   }
   if (attr.timestamp !== undefined) {
    node.timestamp = attr.timestamp;
   }
   if (attr.size !== undefined) {
    MEMFS.resizeFileStorage(node, attr.size);
   }
  },
  lookup(parent, name) {
   throw FS.genericErrors[44];
  },
  mknod(parent, name, mode, dev) {
   return MEMFS.createNode(parent, name, mode, dev);
  },
  rename(old_node, new_dir, new_name) {
   if (FS.isDir(old_node.mode)) {
    var new_node;
    try {
     new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (new_node) {
     for (var i in new_node.contents) {
      throw new FS.ErrnoError(55);
     }
    }
   }
   delete old_node.parent.contents[old_node.name];
   old_node.parent.timestamp = Date.now();
   old_node.name = new_name;
   new_dir.contents[new_name] = old_node;
   new_dir.timestamp = old_node.parent.timestamp;
   old_node.parent = new_dir;
  },
  unlink(parent, name) {
   delete parent.contents[name];
   parent.timestamp = Date.now();
  },
  rmdir(parent, name) {
   var node = FS.lookupNode(parent, name);
   for (var i in node.contents) {
    throw new FS.ErrnoError(55);
   }
   delete parent.contents[name];
   parent.timestamp = Date.now();
  },
  readdir(node) {
   var entries = [ ".", ".." ];
   for (var key in node.contents) {
    if (!node.contents.hasOwnProperty(key)) {
     continue;
    }
    entries.push(key);
   }
   return entries;
  },
  symlink(parent, newname, oldpath) {
   var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
   node.link = oldpath;
   return node;
  },
  readlink(node) {
   if (!FS.isLink(node.mode)) {
    throw new FS.ErrnoError(28);
   }
   return node.link;
  }
 },
 stream_ops: {
  read(stream, buffer, offset, length, position) {
   var contents = stream.node.contents;
   if (position >= stream.node.usedBytes) return 0;
   var size = Math.min(stream.node.usedBytes - position, length);
   if (size > 8 && contents.subarray) {
    buffer.set(contents.subarray(position, position + size), offset);
   } else {
    for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
   }
   return size;
  },
  write(stream, buffer, offset, length, position, canOwn) {
   if (buffer.buffer === HEAP8.buffer) {
    canOwn = false;
   }
   if (!length) return 0;
   var node = stream.node;
   node.timestamp = Date.now();
   if (buffer.subarray && (!node.contents || node.contents.subarray)) {
    if (canOwn) {
     node.contents = buffer.subarray(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (node.usedBytes === 0 && position === 0) {
     node.contents = buffer.slice(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (position + length <= node.usedBytes) {
     node.contents.set(buffer.subarray(offset, offset + length), position);
     return length;
    }
   }
   MEMFS.expandFileStorage(node, position + length);
   if (node.contents.subarray && buffer.subarray) {
    node.contents.set(buffer.subarray(offset, offset + length), position);
   } else {
    for (var i = 0; i < length; i++) {
     node.contents[position + i] = buffer[offset + i];
    }
   }
   node.usedBytes = Math.max(node.usedBytes, position + length);
   return length;
  },
  llseek(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     position += stream.node.usedBytes;
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(28);
   }
   return position;
  },
  allocate(stream, offset, length) {
   MEMFS.expandFileStorage(stream.node, offset + length);
   stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
  },
  mmap(stream, length, position, prot, flags) {
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(43);
   }
   var ptr;
   var allocated;
   var contents = stream.node.contents;
   if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
    allocated = false;
    ptr = contents.byteOffset;
   } else {
    if (position > 0 || position + length < contents.length) {
     if (contents.subarray) {
      contents = contents.subarray(position, position + length);
     } else {
      contents = Array.prototype.slice.call(contents, position, position + length);
     }
    }
    allocated = true;
    ptr = mmapAlloc(length);
    if (!ptr) {
     throw new FS.ErrnoError(48);
    }
    HEAP8.set(contents, ptr >>> 0);
   }
   return {
    ptr: ptr,
    allocated: allocated
   };
  },
  msync(stream, buffer, offset, length, mmapFlags) {
   MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
   return 0;
  }
 }
};

var asyncLoad = (url, onload, onerror, noRunDep) => {
 var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
 readAsync(url, arrayBuffer => {
  assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
  onload(new Uint8Array(arrayBuffer));
  if (dep) removeRunDependency(dep);
 }, event => {
  if (onerror) {
   onerror();
  } else {
   throw `Loading data file "${url}" failed.`;
  }
 });
 if (dep) addRunDependency(dep);
};

var preloadPlugins = Module["preloadPlugins"] || [];

function FS_handledByPreloadPlugin(byteArray, fullname, finish, onerror) {
 if (typeof Browser != "undefined") Browser.init();
 var handled = false;
 preloadPlugins.forEach(function(plugin) {
  if (handled) return;
  if (plugin["canHandle"](fullname)) {
   plugin["handle"](byteArray, fullname, finish, onerror);
   handled = true;
  }
 });
 return handled;
}

function FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
 var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
 var dep = getUniqueRunDependency(`cp ${fullname}`);
 function processData(byteArray) {
  function finish(byteArray) {
   if (preFinish) preFinish();
   if (!dontCreateFile) {
    FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
   }
   if (onload) onload();
   removeRunDependency(dep);
  }
  if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
   if (onerror) onerror();
   removeRunDependency(dep);
  })) {
   return;
  }
  finish(byteArray);
 }
 addRunDependency(dep);
 if (typeof url == "string") {
  asyncLoad(url, byteArray => processData(byteArray), onerror);
 } else {
  processData(url);
 }
}

function FS_modeStringToFlags(str) {
 var flagModes = {
  "r": 0,
  "r+": 2,
  "w": 512 | 64 | 1,
  "w+": 512 | 64 | 2,
  "a": 1024 | 64 | 1,
  "a+": 1024 | 64 | 2
 };
 var flags = flagModes[str];
 if (typeof flags == "undefined") {
  throw new Error(`Unknown file open mode: ${str}`);
 }
 return flags;
}

function FS_getMode(canRead, canWrite) {
 var mode = 0;
 if (canRead) mode |= 292 | 73;
 if (canWrite) mode |= 146;
 return mode;
}

var IDBFS = {
 dbs: {},
 indexedDB: () => {
  if (typeof indexedDB != "undefined") return indexedDB;
  var ret = null;
  if (typeof window == "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  assert(ret, "IDBFS used, but indexedDB not supported");
  return ret;
 },
 DB_VERSION: 21,
 DB_STORE_NAME: "FILE_DATA",
 mount: function(mount) {
  return MEMFS.mount.apply(null, arguments);
 },
 syncfs: (mount, populate, callback) => {
  IDBFS.getLocalSet(mount, (err, local) => {
   if (err) return callback(err);
   IDBFS.getRemoteSet(mount, (err, remote) => {
    if (err) return callback(err);
    var src = populate ? remote : local;
    var dst = populate ? local : remote;
    IDBFS.reconcile(src, dst, callback);
   });
  });
 },
 quit: () => {
  Object.values(IDBFS.dbs).forEach(value => value.close());
  IDBFS.dbs = {};
 },
 getDB: (name, callback) => {
  var db = IDBFS.dbs[name];
  if (db) {
   return callback(null, db);
  }
  var req;
  try {
   req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
  } catch (e) {
   return callback(e);
  }
  if (!req) {
   return callback("Unable to connect to IndexedDB");
  }
  req.onupgradeneeded = e => {
   var db = e.target.result;
   var transaction = e.target.transaction;
   var fileStore;
   if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
    fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
   } else {
    fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
   }
   if (!fileStore.indexNames.contains("timestamp")) {
    fileStore.createIndex("timestamp", "timestamp", {
     unique: false
    });
   }
  };
  req.onsuccess = () => {
   db = req.result;
   IDBFS.dbs[name] = db;
   callback(null, db);
  };
  req.onerror = e => {
   callback(e.target.error);
   e.preventDefault();
  };
 },
 getLocalSet: (mount, callback) => {
  var entries = {};
  function isRealDir(p) {
   return p !== "." && p !== "..";
  }
  function toAbsolute(root) {
   return p => PATH.join2(root, p);
  }
  var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  while (check.length) {
   var path = check.pop();
   var stat;
   try {
    stat = FS.stat(path);
   } catch (e) {
    return callback(e);
   }
   if (FS.isDir(stat.mode)) {
    check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
   }
   entries[path] = {
    "timestamp": stat.mtime
   };
  }
  return callback(null, {
   type: "local",
   entries: entries
  });
 },
 getRemoteSet: (mount, callback) => {
  var entries = {};
  IDBFS.getDB(mount.mountpoint, (err, db) => {
   if (err) return callback(err);
   try {
    var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readonly");
    transaction.onerror = e => {
     callback(e.target.error);
     e.preventDefault();
    };
    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
    var index = store.index("timestamp");
    index.openKeyCursor().onsuccess = event => {
     var cursor = event.target.result;
     if (!cursor) {
      return callback(null, {
       type: "remote",
       db: db,
       entries: entries
      });
     }
     entries[cursor.primaryKey] = {
      "timestamp": cursor.key
     };
     cursor.continue();
    };
   } catch (e) {
    return callback(e);
   }
  });
 },
 loadLocalEntry: (path, callback) => {
  var stat, node;
  try {
   var lookup = FS.lookupPath(path);
   node = lookup.node;
   stat = FS.stat(path);
  } catch (e) {
   return callback(e);
  }
  if (FS.isDir(stat.mode)) {
   return callback(null, {
    "timestamp": stat.mtime,
    "mode": stat.mode
   });
  } else if (FS.isFile(stat.mode)) {
   node.contents = MEMFS.getFileDataAsTypedArray(node);
   return callback(null, {
    "timestamp": stat.mtime,
    "mode": stat.mode,
    "contents": node.contents
   });
  } else {
   return callback(new Error("node type not supported"));
  }
 },
 storeLocalEntry: (path, entry, callback) => {
  try {
   if (FS.isDir(entry["mode"])) {
    FS.mkdirTree(path, entry["mode"]);
   } else if (FS.isFile(entry["mode"])) {
    FS.writeFile(path, entry["contents"], {
     canOwn: true
    });
   } else {
    return callback(new Error("node type not supported"));
   }
   FS.chmod(path, entry["mode"]);
   FS.utime(path, entry["timestamp"], entry["timestamp"]);
  } catch (e) {
   return callback(e);
  }
  callback(null);
 },
 removeLocalEntry: (path, callback) => {
  try {
   var stat = FS.stat(path);
   if (FS.isDir(stat.mode)) {
    FS.rmdir(path);
   } else if (FS.isFile(stat.mode)) {
    FS.unlink(path);
   }
  } catch (e) {
   return callback(e);
  }
  callback(null);
 },
 loadRemoteEntry: (store, path, callback) => {
  var req = store.get(path);
  req.onsuccess = event => {
   callback(null, event.target.result);
  };
  req.onerror = e => {
   callback(e.target.error);
   e.preventDefault();
  };
 },
 storeRemoteEntry: (store, path, entry, callback) => {
  try {
   var req = store.put(entry, path);
  } catch (e) {
   callback(e);
   return;
  }
  req.onsuccess = () => {
   callback(null);
  };
  req.onerror = e => {
   callback(e.target.error);
   e.preventDefault();
  };
 },
 removeRemoteEntry: (store, path, callback) => {
  var req = store.delete(path);
  req.onsuccess = () => {
   callback(null);
  };
  req.onerror = e => {
   callback(e.target.error);
   e.preventDefault();
  };
 },
 reconcile: (src, dst, callback) => {
  var total = 0;
  var create = [];
  Object.keys(src.entries).forEach(function(key) {
   var e = src.entries[key];
   var e2 = dst.entries[key];
   if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
    create.push(key);
    total++;
   }
  });
  var remove = [];
  Object.keys(dst.entries).forEach(function(key) {
   if (!src.entries[key]) {
    remove.push(key);
    total++;
   }
  });
  if (!total) {
   return callback(null);
  }
  var errored = false;
  var db = src.type === "remote" ? src.db : dst.db;
  var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readwrite");
  var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  function done(err) {
   if (err && !errored) {
    errored = true;
    return callback(err);
   }
  }
  transaction.onerror = e => {
   done(this.error);
   e.preventDefault();
  };
  transaction.oncomplete = e => {
   if (!errored) {
    callback(null);
   }
  };
  create.sort().forEach(path => {
   if (dst.type === "local") {
    IDBFS.loadRemoteEntry(store, path, (err, entry) => {
     if (err) return done(err);
     IDBFS.storeLocalEntry(path, entry, done);
    });
   } else {
    IDBFS.loadLocalEntry(path, (err, entry) => {
     if (err) return done(err);
     IDBFS.storeRemoteEntry(store, path, entry, done);
    });
   }
  });
  remove.sort().reverse().forEach(path => {
   if (dst.type === "local") {
    IDBFS.removeLocalEntry(path, done);
   } else {
    IDBFS.removeRemoteEntry(store, path, done);
   }
  });
 }
};

var FS = {
 root: null,
 mounts: [],
 devices: {},
 streams: [],
 nextInode: 1,
 nameTable: null,
 currentPath: "/",
 initialized: false,
 ignorePermissions: true,
 ErrnoError: null,
 genericErrors: {},
 filesystems: null,
 syncFSRequests: 0,
 lookupPath: (path, opts = {}) => {
  path = PATH_FS.resolve(path);
  if (!path) return {
   path: "",
   node: null
  };
  var defaults = {
   follow_mount: true,
   recurse_count: 0
  };
  opts = Object.assign(defaults, opts);
  if (opts.recurse_count > 8) {
   throw new FS.ErrnoError(32);
  }
  var parts = path.split("/").filter(p => !!p);
  var current = FS.root;
  var current_path = "/";
  for (var i = 0; i < parts.length; i++) {
   var islast = i === parts.length - 1;
   if (islast && opts.parent) {
    break;
   }
   current = FS.lookupNode(current, parts[i]);
   current_path = PATH.join2(current_path, parts[i]);
   if (FS.isMountpoint(current)) {
    if (!islast || islast && opts.follow_mount) {
     current = current.mounted.root;
    }
   }
   if (!islast || opts.follow) {
    var count = 0;
    while (FS.isLink(current.mode)) {
     var link = FS.readlink(current_path);
     current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
     var lookup = FS.lookupPath(current_path, {
      recurse_count: opts.recurse_count + 1
     });
     current = lookup.node;
     if (count++ > 40) {
      throw new FS.ErrnoError(32);
     }
    }
   }
  }
  return {
   path: current_path,
   node: current
  };
 },
 getPath: node => {
  var path;
  while (true) {
   if (FS.isRoot(node)) {
    var mount = node.mount.mountpoint;
    if (!path) return mount;
    return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
   }
   path = path ? `${node.name}/${path}` : node.name;
   node = node.parent;
  }
 },
 hashName: (parentid, name) => {
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
   hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
  }
  return (parentid + hash >>> 0) % FS.nameTable.length;
 },
 hashAddNode: node => {
  var hash = FS.hashName(node.parent.id, node.name);
  node.name_next = FS.nameTable[hash];
  FS.nameTable[hash] = node;
 },
 hashRemoveNode: node => {
  var hash = FS.hashName(node.parent.id, node.name);
  if (FS.nameTable[hash] === node) {
   FS.nameTable[hash] = node.name_next;
  } else {
   var current = FS.nameTable[hash];
   while (current) {
    if (current.name_next === node) {
     current.name_next = node.name_next;
     break;
    }
    current = current.name_next;
   }
  }
 },
 lookupNode: (parent, name) => {
  var errCode = FS.mayLookup(parent);
  if (errCode) {
   throw new FS.ErrnoError(errCode, parent);
  }
  var hash = FS.hashName(parent.id, name);
  for (var node = FS.nameTable[hash]; node; node = node.name_next) {
   var nodeName = node.name;
   if (node.parent.id === parent.id && nodeName === name) {
    return node;
   }
  }
  return FS.lookup(parent, name);
 },
 createNode: (parent, name, mode, rdev) => {
  var node = new FS.FSNode(parent, name, mode, rdev);
  FS.hashAddNode(node);
  return node;
 },
 destroyNode: node => {
  FS.hashRemoveNode(node);
 },
 isRoot: node => node === node.parent,
 isMountpoint: node => !!node.mounted,
 isFile: mode => (mode & 61440) === 32768,
 isDir: mode => (mode & 61440) === 16384,
 isLink: mode => (mode & 61440) === 40960,
 isChrdev: mode => (mode & 61440) === 8192,
 isBlkdev: mode => (mode & 61440) === 24576,
 isFIFO: mode => (mode & 61440) === 4096,
 isSocket: mode => (mode & 49152) === 49152,
 flagsToPermissionString: flag => {
  var perms = [ "r", "w", "rw" ][flag & 3];
  if (flag & 512) {
   perms += "w";
  }
  return perms;
 },
 nodePermissions: (node, perms) => {
  if (FS.ignorePermissions) {
   return 0;
  }
  if (perms.includes("r") && !(node.mode & 292)) {
   return 2;
  } else if (perms.includes("w") && !(node.mode & 146)) {
   return 2;
  } else if (perms.includes("x") && !(node.mode & 73)) {
   return 2;
  }
  return 0;
 },
 mayLookup: dir => {
  var errCode = FS.nodePermissions(dir, "x");
  if (errCode) return errCode;
  if (!dir.node_ops.lookup) return 2;
  return 0;
 },
 mayCreate: (dir, name) => {
  try {
   var node = FS.lookupNode(dir, name);
   return 20;
  } catch (e) {}
  return FS.nodePermissions(dir, "wx");
 },
 mayDelete: (dir, name, isdir) => {
  var node;
  try {
   node = FS.lookupNode(dir, name);
  } catch (e) {
   return e.errno;
  }
  var errCode = FS.nodePermissions(dir, "wx");
  if (errCode) {
   return errCode;
  }
  if (isdir) {
   if (!FS.isDir(node.mode)) {
    return 54;
   }
   if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
    return 10;
   }
  } else {
   if (FS.isDir(node.mode)) {
    return 31;
   }
  }
  return 0;
 },
 mayOpen: (node, flags) => {
  if (!node) {
   return 44;
  }
  if (FS.isLink(node.mode)) {
   return 32;
  } else if (FS.isDir(node.mode)) {
   if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
    return 31;
   }
  }
  return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
 },
 MAX_OPEN_FDS: 4096,
 nextfd: () => {
  for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
   if (!FS.streams[fd]) {
    return fd;
   }
  }
  throw new FS.ErrnoError(33);
 },
 getStreamChecked: fd => {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(8);
  }
  return stream;
 },
 getStream: fd => FS.streams[fd],
 createStream: (stream, fd = -1) => {
  if (!FS.FSStream) {
   FS.FSStream = function() {
    this.shared = {};
   };
   FS.FSStream.prototype = {};
   Object.defineProperties(FS.FSStream.prototype, {
    object: {
     get() {
      return this.node;
     },
     set(val) {
      this.node = val;
     }
    },
    isRead: {
     get() {
      return (this.flags & 2097155) !== 1;
     }
    },
    isWrite: {
     get() {
      return (this.flags & 2097155) !== 0;
     }
    },
    isAppend: {
     get() {
      return this.flags & 1024;
     }
    },
    flags: {
     get() {
      return this.shared.flags;
     },
     set(val) {
      this.shared.flags = val;
     }
    },
    position: {
     get() {
      return this.shared.position;
     },
     set(val) {
      this.shared.position = val;
     }
    }
   });
  }
  stream = Object.assign(new FS.FSStream, stream);
  if (fd == -1) {
   fd = FS.nextfd();
  }
  stream.fd = fd;
  FS.streams[fd] = stream;
  return stream;
 },
 closeStream: fd => {
  FS.streams[fd] = null;
 },
 chrdev_stream_ops: {
  open: stream => {
   var device = FS.getDevice(stream.node.rdev);
   stream.stream_ops = device.stream_ops;
   if (stream.stream_ops.open) {
    stream.stream_ops.open(stream);
   }
  },
  llseek: () => {
   throw new FS.ErrnoError(70);
  }
 },
 major: dev => dev >> 8,
 minor: dev => dev & 255,
 makedev: (ma, mi) => ma << 8 | mi,
 registerDevice: (dev, ops) => {
  FS.devices[dev] = {
   stream_ops: ops
  };
 },
 getDevice: dev => FS.devices[dev],
 getMounts: mount => {
  var mounts = [];
  var check = [ mount ];
  while (check.length) {
   var m = check.pop();
   mounts.push(m);
   check.push.apply(check, m.mounts);
  }
  return mounts;
 },
 syncfs: (populate, callback) => {
  if (typeof populate == "function") {
   callback = populate;
   populate = false;
  }
  FS.syncFSRequests++;
  if (FS.syncFSRequests > 1) {
   err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
  }
  var mounts = FS.getMounts(FS.root.mount);
  var completed = 0;
  function doCallback(errCode) {
   FS.syncFSRequests--;
   return callback(errCode);
  }
  function done(errCode) {
   if (errCode) {
    if (!done.errored) {
     done.errored = true;
     return doCallback(errCode);
    }
    return;
   }
   if (++completed >= mounts.length) {
    doCallback(null);
   }
  }
  mounts.forEach(mount => {
   if (!mount.type.syncfs) {
    return done(null);
   }
   mount.type.syncfs(mount, populate, done);
  });
 },
 mount: (type, opts, mountpoint) => {
  var root = mountpoint === "/";
  var pseudo = !mountpoint;
  var node;
  if (root && FS.root) {
   throw new FS.ErrnoError(10);
  } else if (!root && !pseudo) {
   var lookup = FS.lookupPath(mountpoint, {
    follow_mount: false
   });
   mountpoint = lookup.path;
   node = lookup.node;
   if (FS.isMountpoint(node)) {
    throw new FS.ErrnoError(10);
   }
   if (!FS.isDir(node.mode)) {
    throw new FS.ErrnoError(54);
   }
  }
  var mount = {
   type: type,
   opts: opts,
   mountpoint: mountpoint,
   mounts: []
  };
  var mountRoot = type.mount(mount);
  mountRoot.mount = mount;
  mount.root = mountRoot;
  if (root) {
   FS.root = mountRoot;
  } else if (node) {
   node.mounted = mount;
   if (node.mount) {
    node.mount.mounts.push(mount);
   }
  }
  return mountRoot;
 },
 unmount: mountpoint => {
  var lookup = FS.lookupPath(mountpoint, {
   follow_mount: false
  });
  if (!FS.isMountpoint(lookup.node)) {
   throw new FS.ErrnoError(28);
  }
  var node = lookup.node;
  var mount = node.mounted;
  var mounts = FS.getMounts(mount);
  Object.keys(FS.nameTable).forEach(hash => {
   var current = FS.nameTable[hash];
   while (current) {
    var next = current.name_next;
    if (mounts.includes(current.mount)) {
     FS.destroyNode(current);
    }
    current = next;
   }
  });
  node.mounted = null;
  var idx = node.mount.mounts.indexOf(mount);
  node.mount.mounts.splice(idx, 1);
 },
 lookup: (parent, name) => parent.node_ops.lookup(parent, name),
 mknod: (path, mode, dev) => {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  if (!name || name === "." || name === "..") {
   throw new FS.ErrnoError(28);
  }
  var errCode = FS.mayCreate(parent, name);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.mknod) {
   throw new FS.ErrnoError(63);
  }
  return parent.node_ops.mknod(parent, name, mode, dev);
 },
 create: (path, mode) => {
  mode = mode !== undefined ? mode : 438;
  mode &= 4095;
  mode |= 32768;
  return FS.mknod(path, mode, 0);
 },
 mkdir: (path, mode) => {
  mode = mode !== undefined ? mode : 511;
  mode &= 511 | 512;
  mode |= 16384;
  return FS.mknod(path, mode, 0);
 },
 mkdirTree: (path, mode) => {
  var dirs = path.split("/");
  var d = "";
  for (var i = 0; i < dirs.length; ++i) {
   if (!dirs[i]) continue;
   d += "/" + dirs[i];
   try {
    FS.mkdir(d, mode);
   } catch (e) {
    if (e.errno != 20) throw e;
   }
  }
 },
 mkdev: (path, mode, dev) => {
  if (typeof dev == "undefined") {
   dev = mode;
   mode = 438;
  }
  mode |= 8192;
  return FS.mknod(path, mode, dev);
 },
 symlink: (oldpath, newpath) => {
  if (!PATH_FS.resolve(oldpath)) {
   throw new FS.ErrnoError(44);
  }
  var lookup = FS.lookupPath(newpath, {
   parent: true
  });
  var parent = lookup.node;
  if (!parent) {
   throw new FS.ErrnoError(44);
  }
  var newname = PATH.basename(newpath);
  var errCode = FS.mayCreate(parent, newname);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.symlink) {
   throw new FS.ErrnoError(63);
  }
  return parent.node_ops.symlink(parent, newname, oldpath);
 },
 rename: (old_path, new_path) => {
  var old_dirname = PATH.dirname(old_path);
  var new_dirname = PATH.dirname(new_path);
  var old_name = PATH.basename(old_path);
  var new_name = PATH.basename(new_path);
  var lookup, old_dir, new_dir;
  lookup = FS.lookupPath(old_path, {
   parent: true
  });
  old_dir = lookup.node;
  lookup = FS.lookupPath(new_path, {
   parent: true
  });
  new_dir = lookup.node;
  if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
  if (old_dir.mount !== new_dir.mount) {
   throw new FS.ErrnoError(75);
  }
  var old_node = FS.lookupNode(old_dir, old_name);
  var relative = PATH_FS.relative(old_path, new_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(28);
  }
  relative = PATH_FS.relative(new_path, old_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(55);
  }
  var new_node;
  try {
   new_node = FS.lookupNode(new_dir, new_name);
  } catch (e) {}
  if (old_node === new_node) {
   return;
  }
  var isdir = FS.isDir(old_node.mode);
  var errCode = FS.mayDelete(old_dir, old_name, isdir);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!old_dir.node_ops.rename) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
   throw new FS.ErrnoError(10);
  }
  if (new_dir !== old_dir) {
   errCode = FS.nodePermissions(old_dir, "w");
   if (errCode) {
    throw new FS.ErrnoError(errCode);
   }
  }
  FS.hashRemoveNode(old_node);
  try {
   old_dir.node_ops.rename(old_node, new_dir, new_name);
  } catch (e) {
   throw e;
  } finally {
   FS.hashAddNode(old_node);
  }
 },
 rmdir: path => {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var errCode = FS.mayDelete(parent, name, true);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.rmdir) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(10);
  }
  parent.node_ops.rmdir(parent, name);
  FS.destroyNode(node);
 },
 readdir: path => {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  if (!node.node_ops.readdir) {
   throw new FS.ErrnoError(54);
  }
  return node.node_ops.readdir(node);
 },
 unlink: path => {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  if (!parent) {
   throw new FS.ErrnoError(44);
  }
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var errCode = FS.mayDelete(parent, name, false);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.unlink) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(10);
  }
  parent.node_ops.unlink(parent, name);
  FS.destroyNode(node);
 },
 readlink: path => {
  var lookup = FS.lookupPath(path);
  var link = lookup.node;
  if (!link) {
   throw new FS.ErrnoError(44);
  }
  if (!link.node_ops.readlink) {
   throw new FS.ErrnoError(28);
  }
  return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
 },
 stat: (path, dontFollow) => {
  var lookup = FS.lookupPath(path, {
   follow: !dontFollow
  });
  var node = lookup.node;
  if (!node) {
   throw new FS.ErrnoError(44);
  }
  if (!node.node_ops.getattr) {
   throw new FS.ErrnoError(63);
  }
  return node.node_ops.getattr(node);
 },
 lstat: path => FS.stat(path, true),
 chmod: (path, mode, dontFollow) => {
  var node;
  if (typeof path == "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  node.node_ops.setattr(node, {
   mode: mode & 4095 | node.mode & ~4095,
   timestamp: Date.now()
  });
 },
 lchmod: (path, mode) => {
  FS.chmod(path, mode, true);
 },
 fchmod: (fd, mode) => {
  var stream = FS.getStreamChecked(fd);
  FS.chmod(stream.node, mode);
 },
 chown: (path, uid, gid, dontFollow) => {
  var node;
  if (typeof path == "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  node.node_ops.setattr(node, {
   timestamp: Date.now()
  });
 },
 lchown: (path, uid, gid) => {
  FS.chown(path, uid, gid, true);
 },
 fchown: (fd, uid, gid) => {
  var stream = FS.getStreamChecked(fd);
  FS.chown(stream.node, uid, gid);
 },
 truncate: (path, len) => {
  if (len < 0) {
   throw new FS.ErrnoError(28);
  }
  var node;
  if (typeof path == "string") {
   var lookup = FS.lookupPath(path, {
    follow: true
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isDir(node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!FS.isFile(node.mode)) {
   throw new FS.ErrnoError(28);
  }
  var errCode = FS.nodePermissions(node, "w");
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  node.node_ops.setattr(node, {
   size: len,
   timestamp: Date.now()
  });
 },
 ftruncate: (fd, len) => {
  var stream = FS.getStreamChecked(fd);
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(28);
  }
  FS.truncate(stream.node, len);
 },
 utime: (path, atime, mtime) => {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  node.node_ops.setattr(node, {
   timestamp: Math.max(atime, mtime)
  });
 },
 open: (path, flags, mode) => {
  if (path === "") {
   throw new FS.ErrnoError(44);
  }
  flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
  mode = typeof mode == "undefined" ? 438 : mode;
  if (flags & 64) {
   mode = mode & 4095 | 32768;
  } else {
   mode = 0;
  }
  var node;
  if (typeof path == "object") {
   node = path;
  } else {
   path = PATH.normalize(path);
   try {
    var lookup = FS.lookupPath(path, {
     follow: !(flags & 131072)
    });
    node = lookup.node;
   } catch (e) {}
  }
  var created = false;
  if (flags & 64) {
   if (node) {
    if (flags & 128) {
     throw new FS.ErrnoError(20);
    }
   } else {
    node = FS.mknod(path, mode, 0);
    created = true;
   }
  }
  if (!node) {
   throw new FS.ErrnoError(44);
  }
  if (FS.isChrdev(node.mode)) {
   flags &= ~512;
  }
  if (flags & 65536 && !FS.isDir(node.mode)) {
   throw new FS.ErrnoError(54);
  }
  if (!created) {
   var errCode = FS.mayOpen(node, flags);
   if (errCode) {
    throw new FS.ErrnoError(errCode);
   }
  }
  if (flags & 512 && !created) {
   FS.truncate(node, 0);
  }
  flags &= ~(128 | 512 | 131072);
  var stream = FS.createStream({
   node: node,
   path: FS.getPath(node),
   flags: flags,
   seekable: true,
   position: 0,
   stream_ops: node.stream_ops,
   ungotten: [],
   error: false
  });
  if (stream.stream_ops.open) {
   stream.stream_ops.open(stream);
  }
  if (Module["logReadFiles"] && !(flags & 1)) {
   if (!FS.readFiles) FS.readFiles = {};
   if (!(path in FS.readFiles)) {
    FS.readFiles[path] = 1;
   }
  }
  return stream;
 },
 close: stream => {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (stream.getdents) stream.getdents = null;
  try {
   if (stream.stream_ops.close) {
    stream.stream_ops.close(stream);
   }
  } catch (e) {
   throw e;
  } finally {
   FS.closeStream(stream.fd);
  }
  stream.fd = null;
 },
 isClosed: stream => stream.fd === null,
 llseek: (stream, offset, whence) => {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (!stream.seekable || !stream.stream_ops.llseek) {
   throw new FS.ErrnoError(70);
  }
  if (whence != 0 && whence != 1 && whence != 2) {
   throw new FS.ErrnoError(28);
  }
  stream.position = stream.stream_ops.llseek(stream, offset, whence);
  stream.ungotten = [];
  return stream.position;
 },
 read: (stream, buffer, offset, length, position) => {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(8);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!stream.stream_ops.read) {
   throw new FS.ErrnoError(28);
  }
  var seeking = typeof position != "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(70);
  }
  var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
  if (!seeking) stream.position += bytesRead;
  return bytesRead;
 },
 write: (stream, buffer, offset, length, position, canOwn) => {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(8);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!stream.stream_ops.write) {
   throw new FS.ErrnoError(28);
  }
  if (stream.seekable && stream.flags & 1024) {
   FS.llseek(stream, 0, 2);
  }
  var seeking = typeof position != "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(70);
  }
  var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
  if (!seeking) stream.position += bytesWritten;
  return bytesWritten;
 },
 allocate: (stream, offset, length) => {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (offset < 0 || length <= 0) {
   throw new FS.ErrnoError(28);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(8);
  }
  if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(43);
  }
  if (!stream.stream_ops.allocate) {
   throw new FS.ErrnoError(138);
  }
  stream.stream_ops.allocate(stream, offset, length);
 },
 mmap: (stream, length, position, prot, flags) => {
  if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
   throw new FS.ErrnoError(2);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(2);
  }
  if (!stream.stream_ops.mmap) {
   throw new FS.ErrnoError(43);
  }
  return stream.stream_ops.mmap(stream, length, position, prot, flags);
 },
 msync: (stream, buffer, offset, length, mmapFlags) => {
  if (!stream.stream_ops.msync) {
   return 0;
  }
  return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
 },
 munmap: stream => 0,
 ioctl: (stream, cmd, arg) => {
  if (!stream.stream_ops.ioctl) {
   throw new FS.ErrnoError(59);
  }
  return stream.stream_ops.ioctl(stream, cmd, arg);
 },
 readFile: (path, opts = {}) => {
  opts.flags = opts.flags || 0;
  opts.encoding = opts.encoding || "binary";
  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
   throw new Error(`Invalid encoding type "${opts.encoding}"`);
  }
  var ret;
  var stream = FS.open(path, opts.flags);
  var stat = FS.stat(path);
  var length = stat.size;
  var buf = new Uint8Array(length);
  FS.read(stream, buf, 0, length, 0);
  if (opts.encoding === "utf8") {
   ret = UTF8ArrayToString(buf, 0);
  } else if (opts.encoding === "binary") {
   ret = buf;
  }
  FS.close(stream);
  return ret;
 },
 writeFile: (path, data, opts = {}) => {
  opts.flags = opts.flags || 577;
  var stream = FS.open(path, opts.flags, opts.mode);
  if (typeof data == "string") {
   var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
   var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
   FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
  } else if (ArrayBuffer.isView(data)) {
   FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
  } else {
   throw new Error("Unsupported data type");
  }
  FS.close(stream);
 },
 cwd: () => FS.currentPath,
 chdir: path => {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  if (lookup.node === null) {
   throw new FS.ErrnoError(44);
  }
  if (!FS.isDir(lookup.node.mode)) {
   throw new FS.ErrnoError(54);
  }
  var errCode = FS.nodePermissions(lookup.node, "x");
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  FS.currentPath = lookup.path;
 },
 createDefaultDirectories: () => {
  FS.mkdir("/tmp");
  FS.mkdir("/home");
  FS.mkdir("/home/web_user");
 },
 createDefaultDevices: () => {
  FS.mkdir("/dev");
  FS.registerDevice(FS.makedev(1, 3), {
   read: () => 0,
   write: (stream, buffer, offset, length, pos) => length
  });
  FS.mkdev("/dev/null", FS.makedev(1, 3));
  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
  FS.mkdev("/dev/tty", FS.makedev(5, 0));
  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
  var randomBuffer = new Uint8Array(1024), randomLeft = 0;
  var randomByte = () => {
   if (randomLeft === 0) {
    randomLeft = randomFill(randomBuffer).byteLength;
   }
   return randomBuffer[--randomLeft];
  };
  FS.createDevice("/dev", "random", randomByte);
  FS.createDevice("/dev", "urandom", randomByte);
  FS.mkdir("/dev/shm");
  FS.mkdir("/dev/shm/tmp");
 },
 createSpecialDirectories: () => {
  FS.mkdir("/proc");
  var proc_self = FS.mkdir("/proc/self");
  FS.mkdir("/proc/self/fd");
  FS.mount({
   mount: () => {
    var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
    node.node_ops = {
     lookup: (parent, name) => {
      var fd = +name;
      var stream = FS.getStreamChecked(fd);
      var ret = {
       parent: null,
       mount: {
        mountpoint: "fake"
       },
       node_ops: {
        readlink: () => stream.path
       }
      };
      ret.parent = ret;
      return ret;
     }
    };
    return node;
   }
  }, {}, "/proc/self/fd");
 },
 createStandardStreams: () => {
  if (Module["stdin"]) {
   FS.createDevice("/dev", "stdin", Module["stdin"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdin");
  }
  if (Module["stdout"]) {
   FS.createDevice("/dev", "stdout", null, Module["stdout"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdout");
  }
  if (Module["stderr"]) {
   FS.createDevice("/dev", "stderr", null, Module["stderr"]);
  } else {
   FS.symlink("/dev/tty1", "/dev/stderr");
  }
  var stdin = FS.open("/dev/stdin", 0);
  var stdout = FS.open("/dev/stdout", 1);
  var stderr = FS.open("/dev/stderr", 1);
 },
 ensureErrnoError: () => {
  if (FS.ErrnoError) return;
  FS.ErrnoError = function ErrnoError(errno, node) {
   this.name = "ErrnoError";
   this.node = node;
   this.setErrno = function(errno) {
    this.errno = errno;
   };
   this.setErrno(errno);
   this.message = "FS error";
  };
  FS.ErrnoError.prototype = new Error;
  FS.ErrnoError.prototype.constructor = FS.ErrnoError;
  [ 44 ].forEach(code => {
   FS.genericErrors[code] = new FS.ErrnoError(code);
   FS.genericErrors[code].stack = "<generic error, no stack>";
  });
 },
 staticInit: () => {
  FS.ensureErrnoError();
  FS.nameTable = new Array(4096);
  FS.mount(MEMFS, {}, "/");
  FS.createDefaultDirectories();
  FS.createDefaultDevices();
  FS.createSpecialDirectories();
  FS.filesystems = {
   "MEMFS": MEMFS,
   "IDBFS": IDBFS
  };
 },
 init: (input, output, error) => {
  FS.init.initialized = true;
  FS.ensureErrnoError();
  Module["stdin"] = input || Module["stdin"];
  Module["stdout"] = output || Module["stdout"];
  Module["stderr"] = error || Module["stderr"];
  FS.createStandardStreams();
 },
 quit: () => {
  FS.init.initialized = false;
  _fflush(0);
  for (var i = 0; i < FS.streams.length; i++) {
   var stream = FS.streams[i];
   if (!stream) {
    continue;
   }
   FS.close(stream);
  }
 },
 findObject: (path, dontResolveLastLink) => {
  var ret = FS.analyzePath(path, dontResolveLastLink);
  if (!ret.exists) {
   return null;
  }
  return ret.object;
 },
 analyzePath: (path, dontResolveLastLink) => {
  try {
   var lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   path = lookup.path;
  } catch (e) {}
  var ret = {
   isRoot: false,
   exists: false,
   error: 0,
   name: null,
   path: null,
   object: null,
   parentExists: false,
   parentPath: null,
   parentObject: null
  };
  try {
   var lookup = FS.lookupPath(path, {
    parent: true
   });
   ret.parentExists = true;
   ret.parentPath = lookup.path;
   ret.parentObject = lookup.node;
   ret.name = PATH.basename(path);
   lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   ret.exists = true;
   ret.path = lookup.path;
   ret.object = lookup.node;
   ret.name = lookup.node.name;
   ret.isRoot = lookup.path === "/";
  } catch (e) {
   ret.error = e.errno;
  }
  return ret;
 },
 createPath: (parent, path, canRead, canWrite) => {
  parent = typeof parent == "string" ? parent : FS.getPath(parent);
  var parts = path.split("/").reverse();
  while (parts.length) {
   var part = parts.pop();
   if (!part) continue;
   var current = PATH.join2(parent, part);
   try {
    FS.mkdir(current);
   } catch (e) {}
   parent = current;
  }
  return current;
 },
 createFile: (parent, name, properties, canRead, canWrite) => {
  var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
  var mode = FS_getMode(canRead, canWrite);
  return FS.create(path, mode);
 },
 createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
  var path = name;
  if (parent) {
   parent = typeof parent == "string" ? parent : FS.getPath(parent);
   path = name ? PATH.join2(parent, name) : parent;
  }
  var mode = FS_getMode(canRead, canWrite);
  var node = FS.create(path, mode);
  if (data) {
   if (typeof data == "string") {
    var arr = new Array(data.length);
    for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
    data = arr;
   }
   FS.chmod(node, mode | 146);
   var stream = FS.open(node, 577);
   FS.write(stream, data, 0, data.length, 0, canOwn);
   FS.close(stream);
   FS.chmod(node, mode);
  }
  return node;
 },
 createDevice: (parent, name, input, output) => {
  var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
  var mode = FS_getMode(!!input, !!output);
  if (!FS.createDevice.major) FS.createDevice.major = 64;
  var dev = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(dev, {
   open: stream => {
    stream.seekable = false;
   },
   close: stream => {
    if (output && output.buffer && output.buffer.length) {
     output(10);
    }
   },
   read: (stream, buffer, offset, length, pos) => {
    var bytesRead = 0;
    for (var i = 0; i < length; i++) {
     var result;
     try {
      result = input();
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
     if (result === undefined && bytesRead === 0) {
      throw new FS.ErrnoError(6);
     }
     if (result === null || result === undefined) break;
     bytesRead++;
     buffer[offset + i] = result;
    }
    if (bytesRead) {
     stream.node.timestamp = Date.now();
    }
    return bytesRead;
   },
   write: (stream, buffer, offset, length, pos) => {
    for (var i = 0; i < length; i++) {
     try {
      output(buffer[offset + i]);
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
    }
    if (length) {
     stream.node.timestamp = Date.now();
    }
    return i;
   }
  });
  return FS.mkdev(path, mode, dev);
 },
 forceLoadFile: obj => {
  if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
  if (typeof XMLHttpRequest != "undefined") {
   throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  } else if (read_) {
   try {
    obj.contents = intArrayFromString(read_(obj.url), true);
    obj.usedBytes = obj.contents.length;
   } catch (e) {
    throw new FS.ErrnoError(29);
   }
  } else {
   throw new Error("Cannot load without read() or XMLHttpRequest.");
  }
 },
 createLazyFile: (parent, name, url, canRead, canWrite) => {
  function LazyUint8Array() {
   this.lengthKnown = false;
   this.chunks = [];
  }
  LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
   if (idx > this.length - 1 || idx < 0) {
    return undefined;
   }
   var chunkOffset = idx % this.chunkSize;
   var chunkNum = idx / this.chunkSize | 0;
   return this.getter(chunkNum)[chunkOffset];
  };
  LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
   this.getter = getter;
  };
  LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
   var xhr = new XMLHttpRequest;
   xhr.open("HEAD", url, false);
   xhr.send(null);
   if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
   var datalength = Number(xhr.getResponseHeader("Content-length"));
   var header;
   var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
   var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
   var chunkSize = 1024 * 1024;
   if (!hasByteServing) chunkSize = datalength;
   var doXHR = (from, to) => {
    if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
    if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
    xhr.responseType = "arraybuffer";
    if (xhr.overrideMimeType) {
     xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
    xhr.send(null);
    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
    if (xhr.response !== undefined) {
     return new Uint8Array(xhr.response || []);
    }
    return intArrayFromString(xhr.responseText || "", true);
   };
   var lazyArray = this;
   lazyArray.setDataGetter(chunkNum => {
    var start = chunkNum * chunkSize;
    var end = (chunkNum + 1) * chunkSize - 1;
    end = Math.min(end, datalength - 1);
    if (typeof lazyArray.chunks[chunkNum] == "undefined") {
     lazyArray.chunks[chunkNum] = doXHR(start, end);
    }
    if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
    return lazyArray.chunks[chunkNum];
   });
   if (usesGzip || !datalength) {
    chunkSize = datalength = 1;
    datalength = this.getter(0).length;
    chunkSize = datalength;
    out("LazyFiles on gzip forces download of the whole file when length is accessed");
   }
   this._length = datalength;
   this._chunkSize = chunkSize;
   this.lengthKnown = true;
  };
  if (typeof XMLHttpRequest != "undefined") {
   if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
   var lazyArray = new LazyUint8Array;
   Object.defineProperties(lazyArray, {
    length: {
     get: function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._length;
     }
    },
    chunkSize: {
     get: function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._chunkSize;
     }
    }
   });
   var properties = {
    isDevice: false,
    contents: lazyArray
   };
  } else {
   var properties = {
    isDevice: false,
    url: url
   };
  }
  var node = FS.createFile(parent, name, properties, canRead, canWrite);
  if (properties.contents) {
   node.contents = properties.contents;
  } else if (properties.url) {
   node.contents = null;
   node.url = properties.url;
  }
  Object.defineProperties(node, {
   usedBytes: {
    get: function() {
     return this.contents.length;
    }
   }
  });
  var stream_ops = {};
  var keys = Object.keys(node.stream_ops);
  keys.forEach(key => {
   var fn = node.stream_ops[key];
   stream_ops[key] = function forceLoadLazyFile() {
    FS.forceLoadFile(node);
    return fn.apply(null, arguments);
   };
  });
  function writeChunks(stream, buffer, offset, length, position) {
   var contents = stream.node.contents;
   if (position >= contents.length) return 0;
   var size = Math.min(contents.length - position, length);
   if (contents.slice) {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents[position + i];
    }
   } else {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents.get(position + i);
    }
   }
   return size;
  }
  stream_ops.read = (stream, buffer, offset, length, position) => {
   FS.forceLoadFile(node);
   return writeChunks(stream, buffer, offset, length, position);
  };
  stream_ops.mmap = (stream, length, position, prot, flags) => {
   FS.forceLoadFile(node);
   var ptr = mmapAlloc(length);
   if (!ptr) {
    throw new FS.ErrnoError(48);
   }
   writeChunks(stream, HEAP8, ptr, length, position);
   return {
    ptr: ptr,
    allocated: true
   };
  };
  node.stream_ops = stream_ops;
  return node;
 }
};

var SYSCALLS = {
 DEFAULT_POLLMASK: 5,
 calculateAt: function(dirfd, path, allowEmpty) {
  if (PATH.isAbs(path)) {
   return path;
  }
  var dir;
  if (dirfd === -100) {
   dir = FS.cwd();
  } else {
   var dirstream = SYSCALLS.getStreamFromFD(dirfd);
   dir = dirstream.path;
  }
  if (path.length == 0) {
   if (!allowEmpty) {
    throw new FS.ErrnoError(44);
   }
   return dir;
  }
  return PATH.join2(dir, path);
 },
 doStat: function(func, path, buf) {
  try {
   var stat = func(path);
  } catch (e) {
   if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
    return -54;
   }
   throw e;
  }
  HEAP32[buf >>> 2] = stat.dev;
  HEAP32[buf + 4 >>> 2] = stat.mode;
  HEAPU32[buf + 8 >>> 2] = stat.nlink;
  HEAP32[buf + 12 >>> 2] = stat.uid;
  HEAP32[buf + 16 >>> 2] = stat.gid;
  HEAP32[buf + 20 >>> 2] = stat.rdev;
  tempI64 = [ stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[buf + 24 >>> 2] = tempI64[0], HEAP32[buf + 28 >>> 2] = tempI64[1];
  HEAP32[buf + 32 >>> 2] = 4096;
  HEAP32[buf + 36 >>> 2] = stat.blocks;
  var atime = stat.atime.getTime();
  var mtime = stat.mtime.getTime();
  var ctime = stat.ctime.getTime();
  tempI64 = [ Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), 
  +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[buf + 40 >>> 2] = tempI64[0], HEAP32[buf + 44 >>> 2] = tempI64[1];
  HEAPU32[buf + 48 >>> 2] = atime % 1e3 * 1e3;
  tempI64 = [ Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), 
  +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[buf + 56 >>> 2] = tempI64[0], HEAP32[buf + 60 >>> 2] = tempI64[1];
  HEAPU32[buf + 64 >>> 2] = mtime % 1e3 * 1e3;
  tempI64 = [ Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), 
  +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[buf + 72 >>> 2] = tempI64[0], HEAP32[buf + 76 >>> 2] = tempI64[1];
  HEAPU32[buf + 80 >>> 2] = ctime % 1e3 * 1e3;
  tempI64 = [ stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[buf + 88 >>> 2] = tempI64[0], HEAP32[buf + 92 >>> 2] = tempI64[1];
  return 0;
 },
 doMsync: function(addr, stream, len, flags, offset) {
  if (!FS.isFile(stream.node.mode)) {
   throw new FS.ErrnoError(43);
  }
  if (flags & 2) {
   return 0;
  }
  var buffer = HEAPU8.slice(addr, addr + len);
  FS.msync(stream, buffer, offset, len, flags);
 },
 varargs: undefined,
 get() {
  SYSCALLS.varargs += 4;
  var ret = HEAP32[SYSCALLS.varargs - 4 >>> 2];
  return ret;
 },
 getStr(ptr) {
  var ret = UTF8ToString(ptr);
  return ret;
 },
 getStreamFromFD: function(fd) {
  var stream = FS.getStreamChecked(fd);
  return stream;
 }
};

function ___syscall__newselect(nfds, readfds, writefds, exceptfds, timeout) {
 readfds >>>= 0;
 writefds >>>= 0;
 exceptfds >>>= 0;
 timeout >>>= 0;
 try {
  var total = 0;
  var srcReadLow = readfds ? HEAP32[readfds >>> 2] : 0, srcReadHigh = readfds ? HEAP32[readfds + 4 >>> 2] : 0;
  var srcWriteLow = writefds ? HEAP32[writefds >>> 2] : 0, srcWriteHigh = writefds ? HEAP32[writefds + 4 >>> 2] : 0;
  var srcExceptLow = exceptfds ? HEAP32[exceptfds >>> 2] : 0, srcExceptHigh = exceptfds ? HEAP32[exceptfds + 4 >>> 2] : 0;
  var dstReadLow = 0, dstReadHigh = 0;
  var dstWriteLow = 0, dstWriteHigh = 0;
  var dstExceptLow = 0, dstExceptHigh = 0;
  var allLow = (readfds ? HEAP32[readfds >>> 2] : 0) | (writefds ? HEAP32[writefds >>> 2] : 0) | (exceptfds ? HEAP32[exceptfds >>> 2] : 0);
  var allHigh = (readfds ? HEAP32[readfds + 4 >>> 2] : 0) | (writefds ? HEAP32[writefds + 4 >>> 2] : 0) | (exceptfds ? HEAP32[exceptfds + 4 >>> 2] : 0);
  var check = function(fd, low, high, val) {
   return fd < 32 ? low & val : high & val;
  };
  for (var fd = 0; fd < nfds; fd++) {
   var mask = 1 << fd % 32;
   if (!check(fd, allLow, allHigh, mask)) {
    continue;
   }
   var stream = SYSCALLS.getStreamFromFD(fd);
   var flags = SYSCALLS.DEFAULT_POLLMASK;
   if (stream.stream_ops.poll) {
    var timeoutInMillis = -1;
    if (timeout) {
     var tv_sec = readfds ? HEAP32[timeout >>> 2] : 0, tv_usec = readfds ? HEAP32[timeout + 8 >>> 2] : 0;
     timeoutInMillis = (tv_sec + tv_usec / 1e6) * 1e3;
    }
    flags = stream.stream_ops.poll(stream, timeoutInMillis);
   }
   if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
    fd < 32 ? dstReadLow = dstReadLow | mask : dstReadHigh = dstReadHigh | mask;
    total++;
   }
   if (flags & 4 && check(fd, srcWriteLow, srcWriteHigh, mask)) {
    fd < 32 ? dstWriteLow = dstWriteLow | mask : dstWriteHigh = dstWriteHigh | mask;
    total++;
   }
   if (flags & 2 && check(fd, srcExceptLow, srcExceptHigh, mask)) {
    fd < 32 ? dstExceptLow = dstExceptLow | mask : dstExceptHigh = dstExceptHigh | mask;
    total++;
   }
  }
  if (readfds) {
   HEAP32[readfds >>> 2] = dstReadLow;
   HEAP32[readfds + 4 >>> 2] = dstReadHigh;
  }
  if (writefds) {
   HEAP32[writefds >>> 2] = dstWriteLow;
   HEAP32[writefds + 4 >>> 2] = dstWriteHigh;
  }
  if (exceptfds) {
   HEAP32[exceptfds >>> 2] = dstExceptLow;
   HEAP32[exceptfds + 4 >>> 2] = dstExceptHigh;
  }
  return total;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

var SOCKFS = {
 mount(mount) {
  Module["websocket"] = Module["websocket"] && "object" === typeof Module["websocket"] ? Module["websocket"] : {};
  Module["websocket"]._callbacks = {};
  Module["websocket"]["on"] = function(event, callback) {
   if ("function" === typeof callback) {
    this._callbacks[event] = callback;
   }
   return this;
  };
  Module["websocket"].emit = function(event, param) {
   if ("function" === typeof this._callbacks[event]) {
    this._callbacks[event].call(this, param);
   }
  };
  return FS.createNode(null, "/", 16384 | 511, 0);
 },
 createSocket(family, type, protocol) {
  type &= ~526336;
  var streaming = type == 1;
  if (streaming && protocol && protocol != 6) {
   throw new FS.ErrnoError(66);
  }
  var sock = {
   family: family,
   type: type,
   protocol: protocol,
   server: null,
   error: null,
   peers: {},
   pending: [],
   recv_queue: [],
   sock_ops: SOCKFS.websocket_sock_ops
  };
  var name = SOCKFS.nextname();
  var node = FS.createNode(SOCKFS.root, name, 49152, 0);
  node.sock = sock;
  var stream = FS.createStream({
   path: name,
   node: node,
   flags: 2,
   seekable: false,
   stream_ops: SOCKFS.stream_ops
  });
  sock.stream = stream;
  return sock;
 },
 getSocket(fd) {
  var stream = FS.getStream(fd);
  if (!stream || !FS.isSocket(stream.node.mode)) {
   return null;
  }
  return stream.node.sock;
 },
 stream_ops: {
  poll(stream) {
   var sock = stream.node.sock;
   return sock.sock_ops.poll(sock);
  },
  ioctl(stream, request, varargs) {
   var sock = stream.node.sock;
   return sock.sock_ops.ioctl(sock, request, varargs);
  },
  read(stream, buffer, offset, length, position) {
   var sock = stream.node.sock;
   var msg = sock.sock_ops.recvmsg(sock, length);
   if (!msg) {
    return 0;
   }
   buffer.set(msg.buffer, offset);
   return msg.buffer.length;
  },
  write(stream, buffer, offset, length, position) {
   var sock = stream.node.sock;
   return sock.sock_ops.sendmsg(sock, buffer, offset, length);
  },
  close(stream) {
   var sock = stream.node.sock;
   sock.sock_ops.close(sock);
  }
 },
 nextname() {
  if (!SOCKFS.nextname.current) {
   SOCKFS.nextname.current = 0;
  }
  return "socket[" + SOCKFS.nextname.current++ + "]";
 },
 websocket_sock_ops: {
  createPeer(sock, addr, port) {
   var ws;
   if (typeof addr == "object") {
    ws = addr;
    addr = null;
    port = null;
   }
   if (ws) {
    if (ws._socket) {
     addr = ws._socket.remoteAddress;
     port = ws._socket.remotePort;
    } else {
     var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
     if (!result) {
      throw new Error("WebSocket URL must be in the format ws(s)://address:port");
     }
     addr = result[1];
     port = parseInt(result[2], 10);
    }
   } else {
    try {
     var runtimeConfig = Module["websocket"] && "object" === typeof Module["websocket"];
     var url = "ws:#".replace("#", "//");
     if (runtimeConfig) {
      if ("string" === typeof Module["websocket"]["url"]) {
       url = Module["websocket"]["url"];
      }
     }
     if (url === "ws://" || url === "wss://") {
      var parts = addr.split("/");
      url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
     }
     var subProtocols = "binary";
     if (runtimeConfig) {
      if ("string" === typeof Module["websocket"]["subprotocol"]) {
       subProtocols = Module["websocket"]["subprotocol"];
      }
     }
     var opts = undefined;
     if (subProtocols !== "null") {
      subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
      opts = subProtocols;
     }
     if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
      subProtocols = "null";
      opts = undefined;
     }
     var WebSocketConstructor;
     {
      WebSocketConstructor = WebSocket;
     }
     ws = new WebSocketConstructor(url, opts);
     ws.binaryType = "arraybuffer";
    } catch (e) {
     throw new FS.ErrnoError(23);
    }
   }
   var peer = {
    addr: addr,
    port: port,
    socket: ws,
    dgram_send_queue: []
   };
   SOCKFS.websocket_sock_ops.addPeer(sock, peer);
   SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
   if (sock.type === 2 && typeof sock.sport != "undefined") {
    peer.dgram_send_queue.push(new Uint8Array([ 255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8, sock.sport & 255 ]));
   }
   return peer;
  },
  getPeer(sock, addr, port) {
   return sock.peers[addr + ":" + port];
  },
  addPeer(sock, peer) {
   sock.peers[peer.addr + ":" + peer.port] = peer;
  },
  removePeer(sock, peer) {
   delete sock.peers[peer.addr + ":" + peer.port];
  },
  handlePeerEvents(sock, peer) {
   var first = true;
   var handleOpen = function() {
    Module["websocket"].emit("open", sock.stream.fd);
    try {
     var queued = peer.dgram_send_queue.shift();
     while (queued) {
      peer.socket.send(queued);
      queued = peer.dgram_send_queue.shift();
     }
    } catch (e) {
     peer.socket.close();
    }
   };
   function handleMessage(data) {
    if (typeof data == "string") {
     var encoder = new TextEncoder;
     data = encoder.encode(data);
    } else {
     assert(data.byteLength !== undefined);
     if (data.byteLength == 0) {
      return;
     }
     data = new Uint8Array(data);
    }
    var wasfirst = first;
    first = false;
    if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
     var newport = data[8] << 8 | data[9];
     SOCKFS.websocket_sock_ops.removePeer(sock, peer);
     peer.port = newport;
     SOCKFS.websocket_sock_ops.addPeer(sock, peer);
     return;
    }
    sock.recv_queue.push({
     addr: peer.addr,
     port: peer.port,
     data: data
    });
    Module["websocket"].emit("message", sock.stream.fd);
   }
   if (ENVIRONMENT_IS_NODE) {
    peer.socket.on("open", handleOpen);
    peer.socket.on("message", function(data, isBinary) {
     if (!isBinary) {
      return;
     }
     handleMessage(new Uint8Array(data).buffer);
    });
    peer.socket.on("close", function() {
     Module["websocket"].emit("close", sock.stream.fd);
    });
    peer.socket.on("error", function(error) {
     sock.error = 14;
     Module["websocket"].emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
    });
   } else {
    peer.socket.onopen = handleOpen;
    peer.socket.onclose = function() {
     Module["websocket"].emit("close", sock.stream.fd);
    };
    peer.socket.onmessage = function peer_socket_onmessage(event) {
     handleMessage(event.data);
    };
    peer.socket.onerror = function(error) {
     sock.error = 14;
     Module["websocket"].emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
    };
   }
  },
  poll(sock) {
   if (sock.type === 1 && sock.server) {
    return sock.pending.length ? 64 | 1 : 0;
   }
   var mask = 0;
   var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
   if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
    mask |= 64 | 1;
   }
   if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
    mask |= 4;
   }
   if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
    mask |= 16;
   }
   return mask;
  },
  ioctl(sock, request, arg) {
   switch (request) {
   case 21531:
    var bytes = 0;
    if (sock.recv_queue.length) {
     bytes = sock.recv_queue[0].data.length;
    }
    HEAP32[arg >>> 2] = bytes;
    return 0;

   default:
    return 28;
   }
  },
  close(sock) {
   if (sock.server) {
    try {
     sock.server.close();
    } catch (e) {}
    sock.server = null;
   }
   var peers = Object.keys(sock.peers);
   for (var i = 0; i < peers.length; i++) {
    var peer = sock.peers[peers[i]];
    try {
     peer.socket.close();
    } catch (e) {}
    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
   }
   return 0;
  },
  bind(sock, addr, port) {
   if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") {
    throw new FS.ErrnoError(28);
   }
   sock.saddr = addr;
   sock.sport = port;
   if (sock.type === 2) {
    if (sock.server) {
     sock.server.close();
     sock.server = null;
    }
    try {
     sock.sock_ops.listen(sock, 0);
    } catch (e) {
     if (!(e.name === "ErrnoError")) throw e;
     if (e.errno !== 138) throw e;
    }
   }
  },
  connect(sock, addr, port) {
   if (sock.server) {
    throw new FS.ErrnoError(138);
   }
   if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
    if (dest) {
     if (dest.socket.readyState === dest.socket.CONNECTING) {
      throw new FS.ErrnoError(7);
     } else {
      throw new FS.ErrnoError(30);
     }
    }
   }
   var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
   sock.daddr = peer.addr;
   sock.dport = peer.port;
   throw new FS.ErrnoError(26);
  },
  listen(sock, backlog) {
   if (!ENVIRONMENT_IS_NODE) {
    throw new FS.ErrnoError(138);
   }
  },
  accept(listensock) {
   if (!listensock.server || !listensock.pending.length) {
    throw new FS.ErrnoError(28);
   }
   var newsock = listensock.pending.shift();
   newsock.stream.flags = listensock.stream.flags;
   return newsock;
  },
  getname(sock, peer) {
   var addr, port;
   if (peer) {
    if (sock.daddr === undefined || sock.dport === undefined) {
     throw new FS.ErrnoError(53);
    }
    addr = sock.daddr;
    port = sock.dport;
   } else {
    addr = sock.saddr || 0;
    port = sock.sport || 0;
   }
   return {
    addr: addr,
    port: port
   };
  },
  sendmsg(sock, buffer, offset, length, addr, port) {
   if (sock.type === 2) {
    if (addr === undefined || port === undefined) {
     addr = sock.daddr;
     port = sock.dport;
    }
    if (addr === undefined || port === undefined) {
     throw new FS.ErrnoError(17);
    }
   } else {
    addr = sock.daddr;
    port = sock.dport;
   }
   var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
   if (sock.type === 1) {
    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
     throw new FS.ErrnoError(53);
    } else if (dest.socket.readyState === dest.socket.CONNECTING) {
     throw new FS.ErrnoError(6);
    }
   }
   if (ArrayBuffer.isView(buffer)) {
    offset += buffer.byteOffset;
    buffer = buffer.buffer;
   }
   var data;
   data = buffer.slice(offset, offset + length);
   if (sock.type === 2) {
    if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
     if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
      dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
     }
     dest.dgram_send_queue.push(data);
     return length;
    }
   }
   try {
    dest.socket.send(data);
    return length;
   } catch (e) {
    throw new FS.ErrnoError(28);
   }
  },
  recvmsg(sock, length) {
   if (sock.type === 1 && sock.server) {
    throw new FS.ErrnoError(53);
   }
   var queued = sock.recv_queue.shift();
   if (!queued) {
    if (sock.type === 1) {
     var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
     if (!dest) {
      throw new FS.ErrnoError(53);
     }
     if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
      return null;
     }
     throw new FS.ErrnoError(6);
    }
    throw new FS.ErrnoError(6);
   }
   var queuedLength = queued.data.byteLength || queued.data.length;
   var queuedOffset = queued.data.byteOffset || 0;
   var queuedBuffer = queued.data.buffer || queued.data;
   var bytesRead = Math.min(length, queuedLength);
   var res = {
    buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
    addr: queued.addr,
    port: queued.port
   };
   if (sock.type === 1 && bytesRead < queuedLength) {
    var bytesRemaining = queuedLength - bytesRead;
    queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
    sock.recv_queue.unshift(queued);
   }
   return res;
  }
 }
};

function getSocketFromFD(fd) {
 var socket = SOCKFS.getSocket(fd);
 if (!socket) throw new FS.ErrnoError(8);
 return socket;
}

var setErrNo = value => {
 HEAP32[___errno_location() >>> 2] = value;
 return value;
};

var inetPton4 = str => {
 var b = str.split(".");
 for (var i = 0; i < 4; i++) {
  var tmp = Number(b[i]);
  if (isNaN(tmp)) return null;
  b[i] = tmp;
 }
 return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0;
};

var jstoi_q = str => parseInt(str);

var inetPton6 = str => {
 var words;
 var w, offset, z;
 var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
 var parts = [];
 if (!valid6regx.test(str)) {
  return null;
 }
 if (str === "::") {
  return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
 }
 if (str.startsWith("::")) {
  str = str.replace("::", "Z:");
 } else {
  str = str.replace("::", ":Z:");
 }
 if (str.indexOf(".") > 0) {
  str = str.replace(new RegExp("[.]", "g"), ":");
  words = str.split(":");
  words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
  words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
  words = words.slice(0, words.length - 2);
 } else {
  words = str.split(":");
 }
 offset = 0;
 z = 0;
 for (w = 0; w < words.length; w++) {
  if (typeof words[w] == "string") {
   if (words[w] === "Z") {
    for (z = 0; z < 8 - words.length + 1; z++) {
     parts[w + z] = 0;
    }
    offset = z - 1;
   } else {
    parts[w + offset] = _htons(parseInt(words[w], 16));
   }
  } else {
   parts[w + offset] = words[w];
  }
 }
 return [ parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6] ];
};

var writeSockaddr = (sa, family, addr, port, addrlen) => {
 switch (family) {
 case 2:
  addr = inetPton4(addr);
  zeroMemory(sa, 16);
  if (addrlen) {
   HEAP32[addrlen >>> 2] = 16;
  }
  HEAP16[sa >>> 1] = family;
  HEAP32[sa + 4 >>> 2] = addr;
  HEAP16[sa + 2 >>> 1] = _htons(port);
  break;

 case 10:
  addr = inetPton6(addr);
  zeroMemory(sa, 28);
  if (addrlen) {
   HEAP32[addrlen >>> 2] = 28;
  }
  HEAP32[sa >>> 2] = family;
  HEAP32[sa + 8 >>> 2] = addr[0];
  HEAP32[sa + 12 >>> 2] = addr[1];
  HEAP32[sa + 16 >>> 2] = addr[2];
  HEAP32[sa + 20 >>> 2] = addr[3];
  HEAP16[sa + 2 >>> 1] = _htons(port);
  break;

 default:
  return 5;
 }
 return 0;
};

var DNS = {
 address_map: {
  id: 1,
  addrs: {},
  names: {}
 },
 lookup_name: name => {
  var res = inetPton4(name);
  if (res !== null) {
   return name;
  }
  res = inetPton6(name);
  if (res !== null) {
   return name;
  }
  var addr;
  if (DNS.address_map.addrs[name]) {
   addr = DNS.address_map.addrs[name];
  } else {
   var id = DNS.address_map.id++;
   assert(id < 65535, "exceeded max address mappings of 65535");
   addr = "172.29." + (id & 255) + "." + (id & 65280);
   DNS.address_map.names[addr] = name;
   DNS.address_map.addrs[name] = addr;
  }
  return addr;
 },
 lookup_addr: addr => {
  if (DNS.address_map.names[addr]) {
   return DNS.address_map.names[addr];
  }
  return null;
 }
};

function ___syscall_accept4(fd, addr, addrlen, flags, d1, d2) {
 addr >>>= 0;
 addrlen >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  var newsock = sock.sock_ops.accept(sock);
  if (addr) {
   var errno = writeSockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport, addrlen);
  }
  return newsock.stream.fd;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

var inetNtop4 = addr => (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255);

var inetNtop6 = ints => {
 var str = "";
 var word = 0;
 var longest = 0;
 var lastzero = 0;
 var zstart = 0;
 var len = 0;
 var i = 0;
 var parts = [ ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[3] & 65535, ints[3] >> 16 ];
 var hasipv4 = true;
 var v4part = "";
 for (i = 0; i < 5; i++) {
  if (parts[i] !== 0) {
   hasipv4 = false;
   break;
  }
 }
 if (hasipv4) {
  v4part = inetNtop4(parts[6] | parts[7] << 16);
  if (parts[5] === -1) {
   str = "::ffff:";
   str += v4part;
   return str;
  }
  if (parts[5] === 0) {
   str = "::";
   if (v4part === "0.0.0.0") v4part = "";
   if (v4part === "0.0.0.1") v4part = "1";
   str += v4part;
   return str;
  }
 }
 for (word = 0; word < 8; word++) {
  if (parts[word] === 0) {
   if (word - lastzero > 1) {
    len = 0;
   }
   lastzero = word;
   len++;
  }
  if (len > longest) {
   longest = len;
   zstart = word - longest + 1;
  }
 }
 for (word = 0; word < 8; word++) {
  if (longest > 1) {
   if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
    if (word === zstart) {
     str += ":";
     if (zstart === 0) str += ":";
    }
    continue;
   }
  }
  str += Number(_ntohs(parts[word] & 65535)).toString(16);
  str += word < 7 ? ":" : "";
 }
 return str;
};

var readSockaddr = (sa, salen) => {
 var family = HEAP16[sa >>> 1];
 var port = _ntohs(HEAPU16[sa + 2 >>> 1]);
 var addr;
 switch (family) {
 case 2:
  if (salen !== 16) {
   return {
    errno: 28
   };
  }
  addr = HEAP32[sa + 4 >>> 2];
  addr = inetNtop4(addr);
  break;

 case 10:
  if (salen !== 28) {
   return {
    errno: 28
   };
  }
  addr = [ HEAP32[sa + 8 >>> 2], HEAP32[sa + 12 >>> 2], HEAP32[sa + 16 >>> 2], HEAP32[sa + 20 >>> 2] ];
  addr = inetNtop6(addr);
  break;

 default:
  return {
   errno: 5
  };
 }
 return {
  family: family,
  addr: addr,
  port: port
 };
};

function getSocketAddress(addrp, addrlen, allowNull) {
 if (allowNull && addrp === 0) return null;
 var info = readSockaddr(addrp, addrlen);
 if (info.errno) throw new FS.ErrnoError(info.errno);
 info.addr = DNS.lookup_addr(info.addr) || info.addr;
 return info;
}

function ___syscall_bind(fd, addr, addrlen, d1, d2, d3) {
 addr >>>= 0;
 addrlen >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  var info = getSocketAddress(addr, addrlen);
  sock.sock_ops.bind(sock, info.addr, info.port);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_chdir(path) {
 path >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  FS.chdir(path);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_chmod(path, mode) {
 path >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  FS.chmod(path, mode);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_connect(fd, addr, addrlen, d1, d2, d3) {
 addr >>>= 0;
 addrlen >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  var info = getSocketAddress(addr, addrlen);
  sock.sock_ops.connect(sock, info.addr, info.port);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_dup(fd) {
 try {
  var old = SYSCALLS.getStreamFromFD(fd);
  return FS.createStream(old).fd;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_faccessat(dirfd, path, amode, flags) {
 path >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  path = SYSCALLS.calculateAt(dirfd, path);
  if (amode & ~7) {
   return -28;
  }
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  if (!node) {
   return -44;
  }
  var perms = "";
  if (amode & 4) perms += "r";
  if (amode & 2) perms += "w";
  if (amode & 1) perms += "x";
  if (perms && FS.nodePermissions(node, perms)) {
   return -2;
  }
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_fchmod(fd, mode) {
 try {
  FS.fchmod(fd, mode);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_fchownat(dirfd, path, owner, group, flags) {
 path >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  var nofollow = flags & 256;
  flags = flags & ~256;
  path = SYSCALLS.calculateAt(dirfd, path);
  (nofollow ? FS.lchown : FS.chown)(path, owner, group);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_fcntl64(fd, cmd, varargs) {
 varargs >>>= 0;
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  switch (cmd) {
  case 0:
   {
    var arg = SYSCALLS.get();
    if (arg < 0) {
     return -28;
    }
    var newStream;
    newStream = FS.createStream(stream, arg);
    return newStream.fd;
   }

  case 1:
  case 2:
   return 0;

  case 3:
   return stream.flags;

  case 4:
   {
    var arg = SYSCALLS.get();
    stream.flags |= arg;
    return 0;
   }

  case 5:
   {
    var arg = SYSCALLS.get();
    var offset = 0;
    HEAP16[arg + offset >>> 1] = 2;
    return 0;
   }

  case 6:
  case 7:
   return 0;

  case 16:
  case 8:
   return -28;

  case 9:
   setErrNo(28);
   return -1;

  default:
   {
    return -28;
   }
  }
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_fdatasync(fd) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_fstat64(fd, buf) {
 buf >>>= 0;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  return SYSCALLS.doStat(FS.stat, stream.path, buf);
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_statfs64(path, size, buf) {
 path >>>= 0;
 size >>>= 0;
 buf >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  HEAP32[buf + 4 >>> 2] = 4096;
  HEAP32[buf + 40 >>> 2] = 4096;
  HEAP32[buf + 8 >>> 2] = 1e6;
  HEAP32[buf + 12 >>> 2] = 5e5;
  HEAP32[buf + 16 >>> 2] = 5e5;
  HEAP32[buf + 20 >>> 2] = FS.nextInode;
  HEAP32[buf + 24 >>> 2] = 1e6;
  HEAP32[buf + 28 >>> 2] = 42;
  HEAP32[buf + 44 >>> 2] = 2;
  HEAP32[buf + 36 >>> 2] = 255;
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_fstatfs64(fd, size, buf) {
 size >>>= 0;
 buf >>>= 0;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  return ___syscall_statfs64(0, size, buf);
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_ftruncate64(fd, length_low, length_high) {
 var length = convertI32PairToI53Checked(length_low, length_high);
 try {
  if (isNaN(length)) return 61;
  FS.ftruncate(fd, length);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);

function ___syscall_getcwd(buf, size) {
 buf >>>= 0;
 size >>>= 0;
 try {
  if (size === 0) return -28;
  var cwd = FS.cwd();
  var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
  if (size < cwdLengthInBytes) return -68;
  stringToUTF8(cwd, buf, size);
  return cwdLengthInBytes;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_getdents64(fd, dirp, count) {
 dirp >>>= 0;
 count >>>= 0;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  if (!stream.getdents) {
   stream.getdents = FS.readdir(stream.path);
  }
  var struct_size = 280;
  var pos = 0;
  var off = FS.llseek(stream, 0, 1);
  var idx = Math.floor(off / struct_size);
  while (idx < stream.getdents.length && pos + struct_size <= count) {
   var id;
   var type;
   var name = stream.getdents[idx];
   if (name === ".") {
    id = stream.node.id;
    type = 4;
   } else if (name === "..") {
    var lookup = FS.lookupPath(stream.path, {
     parent: true
    });
    id = lookup.node.id;
    type = 4;
   } else {
    var child = FS.lookupNode(stream.node, name);
    id = child.id;
    type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
   }
   tempI64 = [ id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
   HEAP32[dirp + pos >>> 2] = tempI64[0], HEAP32[dirp + pos + 4 >>> 2] = tempI64[1];
   tempI64 = [ (idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, 
   +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
   HEAP32[dirp + pos + 8 >>> 2] = tempI64[0], HEAP32[dirp + pos + 12 >>> 2] = tempI64[1];
   HEAP16[dirp + pos + 16 >>> 1] = 280;
   HEAP8[dirp + pos + 18 >>> 0] = type;
   stringToUTF8(name, dirp + pos + 19, 256);
   pos += struct_size;
   idx += 1;
  }
  FS.llseek(stream, idx * struct_size, 0);
  return pos;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_getpeername(fd, addr, addrlen, d1, d2, d3) {
 addr >>>= 0;
 addrlen >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  if (!sock.daddr) {
   return -53;
  }
  var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport, addrlen);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_getsockname(fd, addr, addrlen, d1, d2, d3) {
 addr >>>= 0;
 addrlen >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || "0.0.0.0"), sock.sport, addrlen);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_getsockopt(fd, level, optname, optval, optlen, d1) {
 optval >>>= 0;
 optlen >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  if (level === 1) {
   if (optname === 4) {
    HEAP32[optval >>> 2] = sock.error;
    HEAP32[optlen >>> 2] = 4;
    sock.error = null;
    return 0;
   }
  }
  return -50;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_ioctl(fd, op, varargs) {
 varargs >>>= 0;
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  switch (op) {
  case 21509:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  case 21505:
   {
    if (!stream.tty) return -59;
    if (stream.tty.ops.ioctl_tcgets) {
     var termios = stream.tty.ops.ioctl_tcgets(stream);
     var argp = SYSCALLS.get();
     HEAP32[argp >>> 2] = termios.c_iflag || 0;
     HEAP32[argp + 4 >>> 2] = termios.c_oflag || 0;
     HEAP32[argp + 8 >>> 2] = termios.c_cflag || 0;
     HEAP32[argp + 12 >>> 2] = termios.c_lflag || 0;
     for (var i = 0; i < 32; i++) {
      HEAP8[argp + i + 17 >>> 0] = termios.c_cc[i] || 0;
     }
     return 0;
    }
    return 0;
   }

  case 21510:
  case 21511:
  case 21512:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  case 21506:
  case 21507:
  case 21508:
   {
    if (!stream.tty) return -59;
    if (stream.tty.ops.ioctl_tcsets) {
     var argp = SYSCALLS.get();
     var c_iflag = HEAP32[argp >>> 2];
     var c_oflag = HEAP32[argp + 4 >>> 2];
     var c_cflag = HEAP32[argp + 8 >>> 2];
     var c_lflag = HEAP32[argp + 12 >>> 2];
     var c_cc = [];
     for (var i = 0; i < 32; i++) {
      c_cc.push(HEAP8[argp + i + 17 >>> 0]);
     }
     return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
      c_iflag: c_iflag,
      c_oflag: c_oflag,
      c_cflag: c_cflag,
      c_lflag: c_lflag,
      c_cc: c_cc
     });
    }
    return 0;
   }

  case 21519:
   {
    if (!stream.tty) return -59;
    var argp = SYSCALLS.get();
    HEAP32[argp >>> 2] = 0;
    return 0;
   }

  case 21520:
   {
    if (!stream.tty) return -59;
    return -28;
   }

  case 21531:
   {
    var argp = SYSCALLS.get();
    return FS.ioctl(stream, op, argp);
   }

  case 21523:
   {
    if (!stream.tty) return -59;
    if (stream.tty.ops.ioctl_tiocgwinsz) {
     var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
     var argp = SYSCALLS.get();
     HEAP16[argp >>> 1] = winsize[0];
     HEAP16[argp + 2 >>> 1] = winsize[1];
    }
    return 0;
   }

  case 21524:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  case 21515:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  default:
   return -28;
  }
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_listen(fd, backlog) {
 try {
  var sock = getSocketFromFD(fd);
  sock.sock_ops.listen(sock, backlog);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_lstat64(path, buf) {
 path >>>= 0;
 buf >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  return SYSCALLS.doStat(FS.lstat, path, buf);
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_mkdirat(dirfd, path, mode) {
 path >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  path = SYSCALLS.calculateAt(dirfd, path);
  path = PATH.normalize(path);
  if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
  FS.mkdir(path, mode, 0);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
 path >>>= 0;
 buf >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  var nofollow = flags & 256;
  var allowEmpty = flags & 4096;
  flags = flags & ~6400;
  path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
  return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
 path >>>= 0;
 varargs >>>= 0;
 SYSCALLS.varargs = varargs;
 try {
  path = SYSCALLS.getStr(path);
  path = SYSCALLS.calculateAt(dirfd, path);
  var mode = varargs ? SYSCALLS.get() : 0;
  return FS.open(path, flags, mode).fd;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

var PIPEFS = {
 BUCKET_BUFFER_SIZE: 8192,
 mount(mount) {
  return FS.createNode(null, "/", 16384 | 511, 0);
 },
 createPipe() {
  var pipe = {
   buckets: [],
   refcnt: 2
  };
  pipe.buckets.push({
   buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
   offset: 0,
   roffset: 0
  });
  var rName = PIPEFS.nextname();
  var wName = PIPEFS.nextname();
  var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
  var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
  rNode.pipe = pipe;
  wNode.pipe = pipe;
  var readableStream = FS.createStream({
   path: rName,
   node: rNode,
   flags: 0,
   seekable: false,
   stream_ops: PIPEFS.stream_ops
  });
  rNode.stream = readableStream;
  var writableStream = FS.createStream({
   path: wName,
   node: wNode,
   flags: 1,
   seekable: false,
   stream_ops: PIPEFS.stream_ops
  });
  wNode.stream = writableStream;
  return {
   readable_fd: readableStream.fd,
   writable_fd: writableStream.fd
  };
 },
 stream_ops: {
  poll(stream) {
   var pipe = stream.node.pipe;
   if ((stream.flags & 2097155) === 1) {
    return 256 | 4;
   }
   if (pipe.buckets.length > 0) {
    for (var i = 0; i < pipe.buckets.length; i++) {
     var bucket = pipe.buckets[i];
     if (bucket.offset - bucket.roffset > 0) {
      return 64 | 1;
     }
    }
   }
   return 0;
  },
  ioctl(stream, request, varargs) {
   return 28;
  },
  fsync(stream) {
   return 28;
  },
  read(stream, buffer, offset, length, position) {
   var pipe = stream.node.pipe;
   var currentLength = 0;
   for (var i = 0; i < pipe.buckets.length; i++) {
    var bucket = pipe.buckets[i];
    currentLength += bucket.offset - bucket.roffset;
   }
   assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
   var data = buffer.subarray(offset, offset + length);
   if (length <= 0) {
    return 0;
   }
   if (currentLength == 0) {
    throw new FS.ErrnoError(6);
   }
   var toRead = Math.min(currentLength, length);
   var totalRead = toRead;
   var toRemove = 0;
   for (var i = 0; i < pipe.buckets.length; i++) {
    var currBucket = pipe.buckets[i];
    var bucketSize = currBucket.offset - currBucket.roffset;
    if (toRead <= bucketSize) {
     var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
     if (toRead < bucketSize) {
      tmpSlice = tmpSlice.subarray(0, toRead);
      currBucket.roffset += toRead;
     } else {
      toRemove++;
     }
     data.set(tmpSlice);
     break;
    } else {
     var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
     data.set(tmpSlice);
     data = data.subarray(tmpSlice.byteLength);
     toRead -= tmpSlice.byteLength;
     toRemove++;
    }
   }
   if (toRemove && toRemove == pipe.buckets.length) {
    toRemove--;
    pipe.buckets[toRemove].offset = 0;
    pipe.buckets[toRemove].roffset = 0;
   }
   pipe.buckets.splice(0, toRemove);
   return totalRead;
  },
  write(stream, buffer, offset, length, position) {
   var pipe = stream.node.pipe;
   assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
   var data = buffer.subarray(offset, offset + length);
   var dataLen = data.byteLength;
   if (dataLen <= 0) {
    return 0;
   }
   var currBucket = null;
   if (pipe.buckets.length == 0) {
    currBucket = {
     buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
     offset: 0,
     roffset: 0
    };
    pipe.buckets.push(currBucket);
   } else {
    currBucket = pipe.buckets[pipe.buckets.length - 1];
   }
   assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
   var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
   if (freeBytesInCurrBuffer >= dataLen) {
    currBucket.buffer.set(data, currBucket.offset);
    currBucket.offset += dataLen;
    return dataLen;
   } else if (freeBytesInCurrBuffer > 0) {
    currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
    currBucket.offset += freeBytesInCurrBuffer;
    data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
   }
   var numBuckets = data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE | 0;
   var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
   for (var i = 0; i < numBuckets; i++) {
    var newBucket = {
     buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
     offset: PIPEFS.BUCKET_BUFFER_SIZE,
     roffset: 0
    };
    pipe.buckets.push(newBucket);
    newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
    data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
   }
   if (remElements > 0) {
    var newBucket = {
     buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
     offset: data.byteLength,
     roffset: 0
    };
    pipe.buckets.push(newBucket);
    newBucket.buffer.set(data);
   }
   return dataLen;
  },
  close(stream) {
   var pipe = stream.node.pipe;
   pipe.refcnt--;
   if (pipe.refcnt === 0) {
    pipe.buckets = null;
   }
  }
 },
 nextname() {
  if (!PIPEFS.nextname.current) {
   PIPEFS.nextname.current = 0;
  }
  return "pipe[" + PIPEFS.nextname.current++ + "]";
 }
};

function ___syscall_pipe(fdPtr) {
 fdPtr >>>= 0;
 try {
  if (fdPtr == 0) {
   throw new FS.ErrnoError(21);
  }
  var res = PIPEFS.createPipe();
  HEAP32[fdPtr >>> 2] = res.readable_fd;
  HEAP32[fdPtr + 4 >>> 2] = res.writable_fd;
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_poll(fds, nfds, timeout) {
 fds >>>= 0;
 try {
  var nonzero = 0;
  for (var i = 0; i < nfds; i++) {
   var pollfd = fds + 8 * i;
   var fd = HEAP32[pollfd >>> 2];
   var events = HEAP16[pollfd + 4 >>> 1];
   var mask = 32;
   var stream = FS.getStream(fd);
   if (stream) {
    mask = SYSCALLS.DEFAULT_POLLMASK;
    if (stream.stream_ops.poll) {
     mask = stream.stream_ops.poll(stream, -1);
    }
   }
   mask &= events | 8 | 16;
   if (mask) nonzero++;
   HEAP16[pollfd + 6 >>> 1] = mask;
  }
  return nonzero;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
 path >>>= 0;
 buf >>>= 0;
 bufsize >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  path = SYSCALLS.calculateAt(dirfd, path);
  if (bufsize <= 0) return -28;
  var ret = FS.readlink(path);
  var len = Math.min(bufsize, lengthBytesUTF8(ret));
  var endChar = HEAP8[buf + len >>> 0];
  stringToUTF8(ret, buf, bufsize + 1);
  HEAP8[buf + len >>> 0] = endChar;
  return len;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) {
 buf >>>= 0;
 len >>>= 0;
 addr >>>= 0;
 addrlen >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  var msg = sock.sock_ops.recvmsg(sock, len);
  if (!msg) return 0;
  if (addr) {
   var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen);
  }
  HEAPU8.set(msg.buffer, buf >>> 0);
  return msg.buffer.byteLength;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
 oldpath >>>= 0;
 newpath >>>= 0;
 try {
  oldpath = SYSCALLS.getStr(oldpath);
  newpath = SYSCALLS.getStr(newpath);
  oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
  newpath = SYSCALLS.calculateAt(newdirfd, newpath);
  FS.rename(oldpath, newpath);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_rmdir(path) {
 path >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  FS.rmdir(path);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_sendto(fd, message, length, flags, addr, addr_len) {
 message >>>= 0;
 length >>>= 0;
 addr >>>= 0;
 addr_len >>>= 0;
 try {
  var sock = getSocketFromFD(fd);
  var dest = getSocketAddress(addr, addr_len, true);
  if (!dest) {
   return FS.write(sock.stream, HEAP8, message, length);
  }
  return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port);
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_socket(domain, type, protocol) {
 try {
  var sock = SOCKFS.createSocket(domain, type, protocol);
  return sock.stream.fd;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_stat64(path, buf) {
 path >>>= 0;
 buf >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  return SYSCALLS.doStat(FS.stat, path, buf);
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_symlink(target, linkpath) {
 target >>>= 0;
 linkpath >>>= 0;
 try {
  target = SYSCALLS.getStr(target);
  linkpath = SYSCALLS.getStr(linkpath);
  FS.symlink(target, linkpath);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function ___syscall_unlinkat(dirfd, path, flags) {
 path >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  path = SYSCALLS.calculateAt(dirfd, path);
  if (flags === 0) {
   FS.unlink(path);
  } else if (flags === 512) {
   FS.rmdir(path);
  } else {
   abort("Invalid flags passed to unlinkat");
  }
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function readI53FromI64(ptr) {
 return HEAPU32[ptr >>> 2] + HEAP32[ptr + 4 >>> 2] * 4294967296;
}

function ___syscall_utimensat(dirfd, path, times, flags) {
 path >>>= 0;
 times >>>= 0;
 try {
  path = SYSCALLS.getStr(path);
  path = SYSCALLS.calculateAt(dirfd, path, true);
  if (!times) {
   var atime = Date.now();
   var mtime = atime;
  } else {
   var seconds = readI53FromI64(times);
   var nanoseconds = HEAP32[times + 8 >>> 2];
   atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
   times += 16;
   seconds = readI53FromI64(times);
   nanoseconds = HEAP32[times + 8 >>> 2];
   mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
  }
  FS.utime(path, atime, mtime);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

var nowIsMonotonic = true;

var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;

var __emscripten_throw_longjmp = () => {
 throw Infinity;
};

function __gmtime_js(time_low, time_high, tmPtr) {
 var time = convertI32PairToI53Checked(time_low, time_high);
 tmPtr >>>= 0;
 var date = new Date(time * 1e3);
 HEAP32[tmPtr >>> 2] = date.getUTCSeconds();
 HEAP32[tmPtr + 4 >>> 2] = date.getUTCMinutes();
 HEAP32[tmPtr + 8 >>> 2] = date.getUTCHours();
 HEAP32[tmPtr + 12 >>> 2] = date.getUTCDate();
 HEAP32[tmPtr + 16 >>> 2] = date.getUTCMonth();
 HEAP32[tmPtr + 20 >>> 2] = date.getUTCFullYear() - 1900;
 HEAP32[tmPtr + 24 >>> 2] = date.getUTCDay();
 var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
 var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
 HEAP32[tmPtr + 28 >>> 2] = yday;
}

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
 var leap = isLeapYear(date.getFullYear());
 var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
 var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
 return yday;
};

function __localtime_js(time_low, time_high, tmPtr) {
 var time = convertI32PairToI53Checked(time_low, time_high);
 tmPtr >>>= 0;
 var date = new Date(time * 1e3);
 HEAP32[tmPtr >>> 2] = date.getSeconds();
 HEAP32[tmPtr + 4 >>> 2] = date.getMinutes();
 HEAP32[tmPtr + 8 >>> 2] = date.getHours();
 HEAP32[tmPtr + 12 >>> 2] = date.getDate();
 HEAP32[tmPtr + 16 >>> 2] = date.getMonth();
 HEAP32[tmPtr + 20 >>> 2] = date.getFullYear() - 1900;
 HEAP32[tmPtr + 24 >>> 2] = date.getDay();
 var yday = ydayFromDate(date) | 0;
 HEAP32[tmPtr + 28 >>> 2] = yday;
 HEAP32[tmPtr + 36 >>> 2] = -(date.getTimezoneOffset() * 60);
 var start = new Date(date.getFullYear(), 0, 1);
 var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
 var winterOffset = start.getTimezoneOffset();
 var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
 HEAP32[tmPtr + 32 >>> 2] = dst;
}

var __mktime_js = function(tmPtr) {
 tmPtr >>>= 0;
 var ret = (() => {
  var date = new Date(HEAP32[tmPtr + 20 >>> 2] + 1900, HEAP32[tmPtr + 16 >>> 2], HEAP32[tmPtr + 12 >>> 2], HEAP32[tmPtr + 8 >>> 2], HEAP32[tmPtr + 4 >>> 2], HEAP32[tmPtr >>> 2], 0);
  var dst = HEAP32[tmPtr + 32 >>> 2];
  var guessedOffset = date.getTimezoneOffset();
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dstOffset = Math.min(winterOffset, summerOffset);
  if (dst < 0) {
   HEAP32[tmPtr + 32 >>> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
  } else if (dst > 0 != (dstOffset == guessedOffset)) {
   var nonDstOffset = Math.max(winterOffset, summerOffset);
   var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
   date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
  }
  HEAP32[tmPtr + 24 >>> 2] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  HEAP32[tmPtr + 28 >>> 2] = yday;
  HEAP32[tmPtr >>> 2] = date.getSeconds();
  HEAP32[tmPtr + 4 >>> 2] = date.getMinutes();
  HEAP32[tmPtr + 8 >>> 2] = date.getHours();
  HEAP32[tmPtr + 12 >>> 2] = date.getDate();
  HEAP32[tmPtr + 16 >>> 2] = date.getMonth();
  HEAP32[tmPtr + 20 >>> 2] = date.getYear();
  return date.getTime() / 1e3;
 })();
 return setTempRet0((tempDouble = ret, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)), 
 ret >>> 0;
};

function __mmap_js(len, prot, flags, fd, offset_low, offset_high, allocated, addr) {
 len >>>= 0;
 var offset = convertI32PairToI53Checked(offset_low, offset_high);
 allocated >>>= 0;
 addr >>>= 0;
 try {
  if (isNaN(offset)) return 61;
  var stream = SYSCALLS.getStreamFromFD(fd);
  var res = FS.mmap(stream, len, offset, prot, flags);
  var ptr = res.ptr;
  HEAP32[allocated >>> 2] = res.allocated;
  HEAPU32[addr >>> 2] = ptr;
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function __msync_js(addr, len, prot, flags, fd, offset_low, offset_high) {
 addr >>>= 0;
 len >>>= 0;
 var offset = convertI32PairToI53Checked(offset_low, offset_high);
 try {
  if (isNaN(offset)) return 61;
  SYSCALLS.doMsync(addr, SYSCALLS.getStreamFromFD(fd), len, flags, offset);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

function __munmap_js(addr, len, prot, flags, fd, offset_low, offset_high) {
 addr >>>= 0;
 len >>>= 0;
 var offset = convertI32PairToI53Checked(offset_low, offset_high);
 try {
  if (isNaN(offset)) return 61;
  var stream = SYSCALLS.getStreamFromFD(fd);
  if (prot & 2) {
   SYSCALLS.doMsync(addr, stream, len, flags, offset);
  }
  FS.munmap(stream);
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return -e.errno;
 }
}

var timers = {};

var handleException = e => {
 if (e instanceof ExitStatus || e == "unwind") {
  return EXITSTATUS;
 }
 quit_(1, e);
};

var _proc_exit = code => {
 EXITSTATUS = code;
 if (!keepRuntimeAlive()) {
  if (Module["onExit"]) Module["onExit"](code);
  ABORT = true;
 }
 quit_(code, new ExitStatus(code));
};

var exitJS = (status, implicit) => {
 EXITSTATUS = status;
 if (!keepRuntimeAlive()) {
  exitRuntime();
 }
 _proc_exit(status);
};

var _exit = exitJS;

var maybeExit = () => {
 if (runtimeExited) {
  return;
 }
 if (!keepRuntimeAlive()) {
  try {
   _exit(EXITSTATUS);
  } catch (e) {
   handleException(e);
  }
 }
};

var callUserCallback = func => {
 if (runtimeExited || ABORT) {
  return;
 }
 try {
  func();
  maybeExit();
 } catch (e) {
  handleException(e);
 }
};

var _emscripten_get_now;

_emscripten_get_now = () => performance.now();

var __setitimer_js = (which, timeout_ms) => {
 if (timers[which]) {
  clearTimeout(timers[which].id);
  delete timers[which];
 }
 if (!timeout_ms) return 0;
 var id = setTimeout(() => {
  delete timers[which];
  callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
 }, timeout_ms);
 timers[which] = {
  id: id,
  timeout_ms: timeout_ms
 };
 return 0;
};

var __timegm_js = function(tmPtr) {
 tmPtr >>>= 0;
 var ret = (() => {
  var time = Date.UTC(HEAP32[tmPtr + 20 >>> 2] + 1900, HEAP32[tmPtr + 16 >>> 2], HEAP32[tmPtr + 12 >>> 2], HEAP32[tmPtr + 8 >>> 2], HEAP32[tmPtr + 4 >>> 2], HEAP32[tmPtr >>> 2], 0);
  var date = new Date(time);
  HEAP32[tmPtr + 24 >>> 2] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
  HEAP32[tmPtr + 28 >>> 2] = yday;
  return date.getTime() / 1e3;
 })();
 return setTempRet0((tempDouble = ret, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)), 
 ret >>> 0;
};

var stringToNewUTF8 = str => {
 var size = lengthBytesUTF8(str) + 1;
 var ret = _malloc(size);
 if (ret) stringToUTF8(str, ret, size);
 return ret;
};

function __tzset_js(timezone, daylight, tzname) {
 timezone >>>= 0;
 daylight >>>= 0;
 tzname >>>= 0;
 var currentYear = (new Date).getFullYear();
 var winter = new Date(currentYear, 0, 1);
 var summer = new Date(currentYear, 6, 1);
 var winterOffset = winter.getTimezoneOffset();
 var summerOffset = summer.getTimezoneOffset();
 var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
 HEAPU32[timezone >>> 2] = stdTimezoneOffset * 60;
 HEAP32[daylight >>> 2] = Number(winterOffset != summerOffset);
 function extractZone(date) {
  var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
  return match ? match[1] : "GMT";
 }
 var winterName = extractZone(winter);
 var summerName = extractZone(summer);
 var winterNamePtr = stringToNewUTF8(winterName);
 var summerNamePtr = stringToNewUTF8(summerName);
 if (summerOffset < winterOffset) {
  HEAPU32[tzname >>> 2] = winterNamePtr;
  HEAPU32[tzname + 4 >>> 2] = summerNamePtr;
 } else {
  HEAPU32[tzname >>> 2] = summerNamePtr;
  HEAPU32[tzname + 4 >>> 2] = winterNamePtr;
 }
}

var _abort = () => {
 abort("");
};

function _crc32() {
 err("missing function: crc32");
 abort(-1);
}

function _deflate() {
 err("missing function: deflate");
 abort(-1);
}

function _deflateEnd() {
 err("missing function: deflateEnd");
 abort(-1);
}

function _deflateInit2_() {
 err("missing function: deflateInit2_");
 abort(-1);
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
 readEmAsmArgsArray.length = 0;
 var ch;
 buf >>= 2;
 while (ch = HEAPU8[sigPtr++ >>> 0]) {
  buf += ch != 105 & buf;
  readEmAsmArgsArray.push(ch == 105 ? HEAP32[buf >>> 0] : HEAPF64[buf++ >>> 1]);
  ++buf;
 }
 return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
 var args = readEmAsmArgs(sigPtr, argbuf);
 return ASM_CONSTS[code].apply(null, args);
};

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
 code >>>= 0;
 sigPtr >>>= 0;
 argbuf >>>= 0;
 return runEmAsmFunction(code, sigPtr, argbuf);
}

function _emscripten_asm_const_ptr(code, sigPtr, argbuf) {
 code >>>= 0;
 sigPtr >>>= 0;
 argbuf >>>= 0;
 return runEmAsmFunction(code, sigPtr, argbuf);
}

function _emscripten_date_now() {
 return Date.now();
}

var getHeapMax = () => 4294901760;

function _emscripten_get_heap_max() {
 return getHeapMax();
}

var _emscripten_get_now_res = () => 1e3;

function _emscripten_memcpy_big(dest, src, num) {
 dest >>>= 0;
 src >>>= 0;
 num >>>= 0;
 return HEAPU8.copyWithin(dest >>> 0, src >>> 0, src + num >>> 0);
}

var growMemory = size => {
 var b = wasmMemory.buffer;
 var pages = size - b.byteLength + 65535 >>> 16;
 try {
  wasmMemory.grow(pages);
  updateMemoryViews();
  return 1;
 } catch (e) {}
};

function _emscripten_resize_heap(requestedSize) {
 requestedSize >>>= 0;
 var oldSize = HEAPU8.length;
 var maxHeapSize = getHeapMax();
 if (requestedSize > maxHeapSize) {
  return false;
 }
 var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
 for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
  var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
  overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
  var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
  var replacement = growMemory(newSize);
  if (replacement) {
   return true;
  }
 }
 return false;
}

var ENV = {};

var getExecutableName = () => thisProgram || "./this.program";

var getEnvStrings = () => {
 if (!getEnvStrings.strings) {
  var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
  var env = {
   "USER": "web_user",
   "LOGNAME": "web_user",
   "PATH": "/",
   "PWD": "/",
   "HOME": "/home/web_user",
   "LANG": lang,
   "_": getExecutableName()
  };
  for (var x in ENV) {
   if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
  }
  var strings = [];
  for (var x in env) {
   strings.push(`${x}=${env[x]}`);
  }
  getEnvStrings.strings = strings;
 }
 return getEnvStrings.strings;
};

var stringToAscii = (str, buffer) => {
 for (var i = 0; i < str.length; ++i) {
  HEAP8[buffer++ >>> 0] = str.charCodeAt(i);
 }
 HEAP8[buffer >>> 0] = 0;
};

function _environ_get(__environ, environ_buf) {
 __environ >>>= 0;
 environ_buf >>>= 0;
 var bufSize = 0;
 getEnvStrings().forEach(function(string, i) {
  var ptr = environ_buf + bufSize;
  HEAPU32[__environ + i * 4 >>> 2] = ptr;
  stringToAscii(string, ptr);
  bufSize += string.length + 1;
 });
 return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
 penviron_count >>>= 0;
 penviron_buf_size >>>= 0;
 var strings = getEnvStrings();
 HEAPU32[penviron_count >>> 2] = strings.length;
 var bufSize = 0;
 strings.forEach(function(string) {
  bufSize += string.length + 1;
 });
 HEAPU32[penviron_buf_size >>> 2] = bufSize;
 return 0;
}

function _fd_close(fd) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  FS.close(stream);
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return e.errno;
 }
}

function _fd_fdstat_get(fd, pbuf) {
 pbuf >>>= 0;
 try {
  var rightsBase = 0;
  var rightsInheriting = 0;
  var flags = 0;
  {
   var stream = SYSCALLS.getStreamFromFD(fd);
   var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
  }
  HEAP8[pbuf >>> 0] = type;
  HEAP16[pbuf + 2 >>> 1] = flags;
  tempI64 = [ rightsBase >>> 0, (tempDouble = rightsBase, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[pbuf + 8 >>> 2] = tempI64[0], HEAP32[pbuf + 12 >>> 2] = tempI64[1];
  tempI64 = [ rightsInheriting >>> 0, (tempDouble = rightsInheriting, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[pbuf + 16 >>> 2] = tempI64[0], HEAP32[pbuf + 20 >>> 2] = tempI64[1];
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return e.errno;
 }
}

var doReadv = (stream, iov, iovcnt, offset) => {
 var ret = 0;
 for (var i = 0; i < iovcnt; i++) {
  var ptr = HEAPU32[iov >>> 2];
  var len = HEAPU32[iov + 4 >>> 2];
  iov += 8;
  var curr = FS.read(stream, HEAP8, ptr, len, offset);
  if (curr < 0) return -1;
  ret += curr;
  if (curr < len) break;
  if (typeof offset !== "undefined") {
   offset += curr;
  }
 }
 return ret;
};

function _fd_read(fd, iov, iovcnt, pnum) {
 iov >>>= 0;
 iovcnt >>>= 0;
 pnum >>>= 0;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var num = doReadv(stream, iov, iovcnt);
  HEAPU32[pnum >>> 2] = num;
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return e.errno;
 }
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
 var offset = convertI32PairToI53Checked(offset_low, offset_high);
 newOffset >>>= 0;
 try {
  if (isNaN(offset)) return 61;
  var stream = SYSCALLS.getStreamFromFD(fd);
  FS.llseek(stream, offset, whence);
  tempI64 = [ stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  HEAP32[newOffset >>> 2] = tempI64[0], HEAP32[newOffset + 4 >>> 2] = tempI64[1];
  if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return e.errno;
 }
}

function _fd_sync(fd) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  return Asyncify.handleSleep(function(wakeUp) {
   var mount = stream.node.mount;
   if (!mount.type.syncfs) {
    wakeUp(0);
    return;
   }
   mount.type.syncfs(mount, false, function(err) {
    if (err) {
     wakeUp(function() {
      return 29;
     });
     return;
    }
    wakeUp(0);
   });
  });
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return e.errno;
 }
}

var doWritev = (stream, iov, iovcnt, offset) => {
 var ret = 0;
 for (var i = 0; i < iovcnt; i++) {
  var ptr = HEAPU32[iov >>> 2];
  var len = HEAPU32[iov + 4 >>> 2];
  iov += 8;
  var curr = FS.write(stream, HEAP8, ptr, len, offset);
  if (curr < 0) return -1;
  ret += curr;
  if (typeof offset !== "undefined") {
   offset += curr;
  }
 }
 return ret;
};

function _fd_write(fd, iov, iovcnt, pnum) {
 iov >>>= 0;
 iovcnt >>>= 0;
 pnum >>>= 0;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var num = doWritev(stream, iov, iovcnt);
  HEAPU32[pnum >>> 2] = num;
  return 0;
 } catch (e) {
  if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
  return e.errno;
 }
}

function _getaddrinfo(node, service, hint, out) {
 node >>>= 0;
 service >>>= 0;
 hint >>>= 0;
 out >>>= 0;
 var addr = 0;
 var port = 0;
 var flags = 0;
 var family = 0;
 var type = 0;
 var proto = 0;
 var ai;
 function allocaddrinfo(family, type, proto, canon, addr, port) {
  var sa, salen, ai;
  var errno;
  salen = family === 10 ? 28 : 16;
  addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
  sa = _malloc(salen);
  errno = writeSockaddr(sa, family, addr, port);
  assert(!errno);
  ai = _malloc(32);
  HEAP32[ai + 4 >>> 2] = family;
  HEAP32[ai + 8 >>> 2] = type;
  HEAP32[ai + 12 >>> 2] = proto;
  HEAPU32[ai + 24 >>> 2] = canon;
  HEAPU32[ai + 20 >>> 2] = sa;
  if (family === 10) {
   HEAP32[ai + 16 >>> 2] = 28;
  } else {
   HEAP32[ai + 16 >>> 2] = 16;
  }
  HEAP32[ai + 28 >>> 2] = 0;
  return ai;
 }
 if (hint) {
  flags = HEAP32[hint >>> 2];
  family = HEAP32[hint + 4 >>> 2];
  type = HEAP32[hint + 8 >>> 2];
  proto = HEAP32[hint + 12 >>> 2];
 }
 if (type && !proto) {
  proto = type === 2 ? 17 : 6;
 }
 if (!type && proto) {
  type = proto === 17 ? 2 : 1;
 }
 if (proto === 0) {
  proto = 6;
 }
 if (type === 0) {
  type = 1;
 }
 if (!node && !service) {
  return -2;
 }
 if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
  return -1;
 }
 if (hint !== 0 && HEAP32[hint >>> 2] & 2 && !node) {
  return -1;
 }
 if (flags & 32) {
  return -2;
 }
 if (type !== 0 && type !== 1 && type !== 2) {
  return -7;
 }
 if (family !== 0 && family !== 2 && family !== 10) {
  return -6;
 }
 if (service) {
  service = UTF8ToString(service);
  port = parseInt(service, 10);
  if (isNaN(port)) {
   if (flags & 1024) {
    return -2;
   }
   return -8;
  }
 }
 if (!node) {
  if (family === 0) {
   family = 2;
  }
  if ((flags & 1) === 0) {
   if (family === 2) {
    addr = _htonl(2130706433);
   } else {
    addr = [ 0, 0, 0, 1 ];
   }
  }
  ai = allocaddrinfo(family, type, proto, null, addr, port);
  HEAPU32[out >>> 2] = ai;
  return 0;
 }
 node = UTF8ToString(node);
 addr = inetPton4(node);
 if (addr !== null) {
  if (family === 0 || family === 2) {
   family = 2;
  } else if (family === 10 && flags & 8) {
   addr = [ 0, 0, _htonl(65535), addr ];
   family = 10;
  } else {
   return -2;
  }
 } else {
  addr = inetPton6(node);
  if (addr !== null) {
   if (family === 0 || family === 10) {
    family = 10;
   } else {
    return -2;
   }
  }
 }
 if (addr != null) {
  ai = allocaddrinfo(family, type, proto, node, addr, port);
  HEAPU32[out >>> 2] = ai;
  return 0;
 }
 if (flags & 4) {
  return -2;
 }
 node = DNS.lookup_name(node);
 addr = inetPton4(node);
 if (family === 0) {
  family = 2;
 } else if (family === 10) {
  addr = [ 0, 0, _htonl(65535), addr ];
 }
 ai = allocaddrinfo(family, type, proto, null, addr, port);
 HEAPU32[out >>> 2] = ai;
 return 0;
}

function _getcontext() {
 err("missing function: getcontext");
 abort(-1);
}

function _getdtablesize() {
 err("missing function: getdtablesize");
 abort(-1);
}

var getHostByName = name => {
 var ret = _malloc(20);
 var nameBuf = stringToNewUTF8(name);
 HEAPU32[ret >>> 2] = nameBuf;
 var aliasesBuf = _malloc(4);
 HEAPU32[aliasesBuf >>> 2] = 0;
 HEAPU32[ret + 4 >>> 2] = aliasesBuf;
 var afinet = 2;
 HEAP32[ret + 8 >>> 2] = afinet;
 HEAP32[ret + 12 >>> 2] = 4;
 var addrListBuf = _malloc(12);
 HEAPU32[addrListBuf >>> 2] = addrListBuf + 8;
 HEAPU32[addrListBuf + 4 >>> 2] = 0;
 HEAP32[addrListBuf + 8 >>> 2] = inetPton4(DNS.lookup_name(name));
 HEAPU32[ret + 16 >>> 2] = addrListBuf;
 return ret;
};

function _gethostbyname(name) {
 name >>>= 0;
 return getHostByName(UTF8ToString(name));
}

function _gethostbyname_r(name, ret, buf, buflen, out, err) {
 name >>>= 0;
 ret >>>= 0;
 buf >>>= 0;
 buflen >>>= 0;
 out >>>= 0;
 err >>>= 0;
 var data = _gethostbyname(name);
 _memcpy(ret, data, 20);
 _free(data);
 HEAP32[err >>> 2] = 0;
 HEAPU32[out >>> 2] = ret;
 return 0;
}

function _getloadavg(loadavg, nelem) {
 loadavg >>>= 0;
 var limit = Math.min(nelem, 3);
 var doubleSize = 8;
 for (var i = 0; i < limit; i++) {
  HEAPF64[loadavg + i * doubleSize >>> 3] = .1;
 }
 return limit;
}

function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
 sa >>>= 0;
 node >>>= 0;
 serv >>>= 0;
 var info = readSockaddr(sa, salen);
 if (info.errno) {
  return -6;
 }
 var port = info.port;
 var addr = info.addr;
 var overflowed = false;
 if (node && nodelen) {
  var lookup;
  if (flags & 1 || !(lookup = DNS.lookup_addr(addr))) {
   if (flags & 8) {
    return -2;
   }
  } else {
   addr = lookup;
  }
  var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
  if (numBytesWrittenExclNull + 1 >= nodelen) {
   overflowed = true;
  }
 }
 if (serv && servlen) {
  port = "" + port;
  var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
  if (numBytesWrittenExclNull + 1 >= servlen) {
   overflowed = true;
  }
 }
 if (overflowed) {
  return -12;
 }
 return 0;
}

var Protocols = {
 list: [],
 map: {}
};

var _setprotoent = stayopen => {
 function allocprotoent(name, proto, aliases) {
  var nameBuf = _malloc(name.length + 1);
  stringToAscii(name, nameBuf);
  var j = 0;
  var length = aliases.length;
  var aliasListBuf = _malloc((length + 1) * 4);
  for (var i = 0; i < length; i++, j += 4) {
   var alias = aliases[i];
   var aliasBuf = _malloc(alias.length + 1);
   stringToAscii(alias, aliasBuf);
   HEAPU32[aliasListBuf + j >>> 2] = aliasBuf;
  }
  HEAPU32[aliasListBuf + j >>> 2] = 0;
  var pe = _malloc(12);
  HEAPU32[pe >>> 2] = nameBuf;
  HEAPU32[pe + 4 >>> 2] = aliasListBuf;
  HEAP32[pe + 8 >>> 2] = proto;
  return pe;
 }
 var list = Protocols.list;
 var map = Protocols.map;
 if (list.length === 0) {
  var entry = allocprotoent("tcp", 6, [ "TCP" ]);
  list.push(entry);
  map["tcp"] = map["6"] = entry;
  entry = allocprotoent("udp", 17, [ "UDP" ]);
  list.push(entry);
  map["udp"] = map["17"] = entry;
 }
 _setprotoent.index = 0;
};

function _getprotobyname(name) {
 name >>>= 0;
 name = UTF8ToString(name);
 _setprotoent(true);
 var result = Protocols.map[name];
 return result;
}

function _getprotobynumber(number) {
 _setprotoent(true);
 var result = Protocols.map[number];
 return result;
}

function _inflate() {
 err("missing function: inflate");
 abort(-1);
}

function _inflateEnd() {
 err("missing function: inflateEnd");
 abort(-1);
}

function _inflateInit2_() {
 err("missing function: inflateInit2_");
 abort(-1);
}

function _makecontext() {
 err("missing function: makecontext");
 abort(-1);
}

function _posix_spawnp() {
 err("missing function: posix_spawnp");
 abort(-1);
}

var arraySum = (array, index) => {
 var sum = 0;
 for (var i = 0; i <= index; sum += array[i++]) {}
 return sum;
};

var MONTH_DAYS_LEAP = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var MONTH_DAYS_REGULAR = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var addDays = (date, days) => {
 var newDate = new Date(date.getTime());
 while (days > 0) {
  var leap = isLeapYear(newDate.getFullYear());
  var currentMonth = newDate.getMonth();
  var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
  if (days > daysInCurrentMonth - newDate.getDate()) {
   days -= daysInCurrentMonth - newDate.getDate() + 1;
   newDate.setDate(1);
   if (currentMonth < 11) {
    newDate.setMonth(currentMonth + 1);
   } else {
    newDate.setMonth(0);
    newDate.setFullYear(newDate.getFullYear() + 1);
   }
  } else {
   newDate.setDate(newDate.getDate() + days);
   return newDate;
  }
 }
 return newDate;
};

var writeArrayToMemory = (array, buffer) => {
 HEAP8.set(array, buffer >>> 0);
};

function _strftime(s, maxsize, format, tm) {
 s >>>= 0;
 maxsize >>>= 0;
 format >>>= 0;
 tm >>>= 0;
 var tm_zone = HEAP32[tm + 40 >>> 2];
 var date = {
  tm_sec: HEAP32[tm >>> 2],
  tm_min: HEAP32[tm + 4 >>> 2],
  tm_hour: HEAP32[tm + 8 >>> 2],
  tm_mday: HEAP32[tm + 12 >>> 2],
  tm_mon: HEAP32[tm + 16 >>> 2],
  tm_year: HEAP32[tm + 20 >>> 2],
  tm_wday: HEAP32[tm + 24 >>> 2],
  tm_yday: HEAP32[tm + 28 >>> 2],
  tm_isdst: HEAP32[tm + 32 >>> 2],
  tm_gmtoff: HEAP32[tm + 36 >>> 2],
  tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
 };
 var pattern = UTF8ToString(format);
 var EXPANSION_RULES_1 = {
  "%c": "%a %b %d %H:%M:%S %Y",
  "%D": "%m/%d/%y",
  "%F": "%Y-%m-%d",
  "%h": "%b",
  "%r": "%I:%M:%S %p",
  "%R": "%H:%M",
  "%T": "%H:%M:%S",
  "%x": "%m/%d/%y",
  "%X": "%H:%M:%S",
  "%Ec": "%c",
  "%EC": "%C",
  "%Ex": "%m/%d/%y",
  "%EX": "%H:%M:%S",
  "%Ey": "%y",
  "%EY": "%Y",
  "%Od": "%d",
  "%Oe": "%e",
  "%OH": "%H",
  "%OI": "%I",
  "%Om": "%m",
  "%OM": "%M",
  "%OS": "%S",
  "%Ou": "%u",
  "%OU": "%U",
  "%OV": "%V",
  "%Ow": "%w",
  "%OW": "%W",
  "%Oy": "%y"
 };
 for (var rule in EXPANSION_RULES_1) {
  pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
 }
 var WEEKDAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
 var MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
 function leadingSomething(value, digits, character) {
  var str = typeof value == "number" ? value.toString() : value || "";
  while (str.length < digits) {
   str = character[0] + str;
  }
  return str;
 }
 function leadingNulls(value, digits) {
  return leadingSomething(value, digits, "0");
 }
 function compareByDay(date1, date2) {
  function sgn(value) {
   return value < 0 ? -1 : value > 0 ? 1 : 0;
  }
  var compare;
  if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
   if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
    compare = sgn(date1.getDate() - date2.getDate());
   }
  }
  return compare;
 }
 function getFirstWeekStartDate(janFourth) {
  switch (janFourth.getDay()) {
  case 0:
   return new Date(janFourth.getFullYear() - 1, 11, 29);

  case 1:
   return janFourth;

  case 2:
   return new Date(janFourth.getFullYear(), 0, 3);

  case 3:
   return new Date(janFourth.getFullYear(), 0, 2);

  case 4:
   return new Date(janFourth.getFullYear(), 0, 1);

  case 5:
   return new Date(janFourth.getFullYear() - 1, 11, 31);

  case 6:
   return new Date(janFourth.getFullYear() - 1, 11, 30);
  }
 }
 function getWeekBasedYear(date) {
  var thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
  var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
  var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
  var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
  var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
   if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
    return thisDate.getFullYear() + 1;
   }
   return thisDate.getFullYear();
  }
  return thisDate.getFullYear() - 1;
 }
 var EXPANSION_RULES_2 = {
  "%a": date => WEEKDAYS[date.tm_wday].substring(0, 3),
  "%A": date => WEEKDAYS[date.tm_wday],
  "%b": date => MONTHS[date.tm_mon].substring(0, 3),
  "%B": date => MONTHS[date.tm_mon],
  "%C": date => {
   var year = date.tm_year + 1900;
   return leadingNulls(year / 100 | 0, 2);
  },
  "%d": date => leadingNulls(date.tm_mday, 2),
  "%e": date => leadingSomething(date.tm_mday, 2, " "),
  "%g": date => getWeekBasedYear(date).toString().substring(2),
  "%G": date => getWeekBasedYear(date),
  "%H": date => leadingNulls(date.tm_hour, 2),
  "%I": date => {
   var twelveHour = date.tm_hour;
   if (twelveHour == 0) twelveHour = 12; else if (twelveHour > 12) twelveHour -= 12;
   return leadingNulls(twelveHour, 2);
  },
  "%j": date => leadingNulls(date.tm_mday + arraySum(isLeapYear(date.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon - 1), 3),
  "%m": date => leadingNulls(date.tm_mon + 1, 2),
  "%M": date => leadingNulls(date.tm_min, 2),
  "%n": () => "\n",
  "%p": date => {
   if (date.tm_hour >= 0 && date.tm_hour < 12) {
    return "AM";
   }
   return "PM";
  },
  "%S": date => leadingNulls(date.tm_sec, 2),
  "%t": () => "\t",
  "%u": date => date.tm_wday || 7,
  "%U": date => {
   var days = date.tm_yday + 7 - date.tm_wday;
   return leadingNulls(Math.floor(days / 7), 2);
  },
  "%V": date => {
   var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7) / 7);
   if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
    val++;
   }
   if (!val) {
    val = 52;
    var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
    if (dec31 == 4 || dec31 == 5 && isLeapYear(date.tm_year % 400 - 1)) {
     val++;
    }
   } else if (val == 53) {
    var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
    if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1;
   }
   return leadingNulls(val, 2);
  },
  "%w": date => date.tm_wday,
  "%W": date => {
   var days = date.tm_yday + 7 - (date.tm_wday + 6) % 7;
   return leadingNulls(Math.floor(days / 7), 2);
  },
  "%y": date => (date.tm_year + 1900).toString().substring(2),
  "%Y": date => date.tm_year + 1900,
  "%z": date => {
   var off = date.tm_gmtoff;
   var ahead = off >= 0;
   off = Math.abs(off) / 60;
   off = off / 60 * 100 + off % 60;
   return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
  },
  "%Z": date => date.tm_zone,
  "%%": () => "%"
 };
 pattern = pattern.replace(/%%/g, "\0\0");
 for (var rule in EXPANSION_RULES_2) {
  if (pattern.includes(rule)) {
   pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
  }
 }
 pattern = pattern.replace(/\0\0/g, "%");
 var bytes = intArrayFromString(pattern, false);
 if (bytes.length > maxsize) {
  return 0;
 }
 writeArrayToMemory(bytes, s);
 return bytes.length - 1;
}

function _strptime(buf, format, tm) {
 buf >>>= 0;
 format >>>= 0;
 tm >>>= 0;
 var pattern = UTF8ToString(format);
 var SPECIAL_CHARS = "\\!@#$^&*()+=-[]/{}|:<>?,.";
 for (var i = 0, ii = SPECIAL_CHARS.length; i < ii; ++i) {
  pattern = pattern.replace(new RegExp("\\" + SPECIAL_CHARS[i], "g"), "\\" + SPECIAL_CHARS[i]);
 }
 var EQUIVALENT_MATCHERS = {
  "%A": "%a",
  "%B": "%b",
  "%c": "%a %b %d %H:%M:%S %Y",
  "%D": "%m\\/%d\\/%y",
  "%e": "%d",
  "%F": "%Y-%m-%d",
  "%h": "%b",
  "%R": "%H\\:%M",
  "%r": "%I\\:%M\\:%S\\s%p",
  "%T": "%H\\:%M\\:%S",
  "%x": "%m\\/%d\\/(?:%y|%Y)",
  "%X": "%H\\:%M\\:%S"
 };
 for (var matcher in EQUIVALENT_MATCHERS) {
  pattern = pattern.replace(matcher, EQUIVALENT_MATCHERS[matcher]);
 }
 var DATE_PATTERNS = {
  "%a": "(?:Sun(?:day)?)|(?:Mon(?:day)?)|(?:Tue(?:sday)?)|(?:Wed(?:nesday)?)|(?:Thu(?:rsday)?)|(?:Fri(?:day)?)|(?:Sat(?:urday)?)",
  "%b": "(?:Jan(?:uary)?)|(?:Feb(?:ruary)?)|(?:Mar(?:ch)?)|(?:Apr(?:il)?)|May|(?:Jun(?:e)?)|(?:Jul(?:y)?)|(?:Aug(?:ust)?)|(?:Sep(?:tember)?)|(?:Oct(?:ober)?)|(?:Nov(?:ember)?)|(?:Dec(?:ember)?)",
  "%C": "\\d\\d",
  "%d": "0[1-9]|[1-9](?!\\d)|1\\d|2\\d|30|31",
  "%H": "\\d(?!\\d)|[0,1]\\d|20|21|22|23",
  "%I": "\\d(?!\\d)|0\\d|10|11|12",
  "%j": "00[1-9]|0?[1-9](?!\\d)|0?[1-9]\\d(?!\\d)|[1,2]\\d\\d|3[0-6]\\d",
  "%m": "0[1-9]|[1-9](?!\\d)|10|11|12",
  "%M": "0\\d|\\d(?!\\d)|[1-5]\\d",
  "%n": "\\s",
  "%p": "AM|am|PM|pm|A\\.M\\.|a\\.m\\.|P\\.M\\.|p\\.m\\.",
  "%S": "0\\d|\\d(?!\\d)|[1-5]\\d|60",
  "%U": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
  "%W": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
  "%w": "[0-6]",
  "%y": "\\d\\d",
  "%Y": "\\d\\d\\d\\d",
  "%%": "%",
  "%t": "\\s"
 };
 var MONTH_NUMBERS = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11
 };
 var DAY_NUMBERS_SUN_FIRST = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
 };
 var DAY_NUMBERS_MON_FIRST = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6
 };
 for (var datePattern in DATE_PATTERNS) {
  pattern = pattern.replace(datePattern, "(" + datePattern + DATE_PATTERNS[datePattern] + ")");
 }
 var capture = [];
 for (var i = pattern.indexOf("%"); i >= 0; i = pattern.indexOf("%")) {
  capture.push(pattern[i + 1]);
  pattern = pattern.replace(new RegExp("\\%" + pattern[i + 1], "g"), "");
 }
 var matches = new RegExp("^" + pattern, "i").exec(UTF8ToString(buf));
 function initDate() {
  function fixup(value, min, max) {
   return typeof value != "number" || isNaN(value) ? min : value >= min ? value <= max ? value : max : min;
  }
  return {
   year: fixup(HEAP32[tm + 20 >>> 2] + 1900, 1970, 9999),
   month: fixup(HEAP32[tm + 16 >>> 2], 0, 11),
   day: fixup(HEAP32[tm + 12 >>> 2], 1, 31),
   hour: fixup(HEAP32[tm + 8 >>> 2], 0, 23),
   min: fixup(HEAP32[tm + 4 >>> 2], 0, 59),
   sec: fixup(HEAP32[tm >>> 2], 0, 59)
  };
 }
 if (matches) {
  var date = initDate();
  var value;
  var getMatch = symbol => {
   var pos = capture.indexOf(symbol);
   if (pos >= 0) {
    return matches[pos + 1];
   }
   return;
  };
  if (value = getMatch("S")) {
   date.sec = jstoi_q(value);
  }
  if (value = getMatch("M")) {
   date.min = jstoi_q(value);
  }
  if (value = getMatch("H")) {
   date.hour = jstoi_q(value);
  } else if (value = getMatch("I")) {
   var hour = jstoi_q(value);
   if (value = getMatch("p")) {
    hour += value.toUpperCase()[0] === "P" ? 12 : 0;
   }
   date.hour = hour;
  }
  if (value = getMatch("Y")) {
   date.year = jstoi_q(value);
  } else if (value = getMatch("y")) {
   var year = jstoi_q(value);
   if (value = getMatch("C")) {
    year += jstoi_q(value) * 100;
   } else {
    year += year < 69 ? 2e3 : 1900;
   }
   date.year = year;
  }
  if (value = getMatch("m")) {
   date.month = jstoi_q(value) - 1;
  } else if (value = getMatch("b")) {
   date.month = MONTH_NUMBERS[value.substring(0, 3).toUpperCase()] || 0;
  }
  if (value = getMatch("d")) {
   date.day = jstoi_q(value);
  } else if (value = getMatch("j")) {
   var day = jstoi_q(value);
   var leapYear = isLeapYear(date.year);
   for (var month = 0; month < 12; ++month) {
    var daysUntilMonth = arraySum(leapYear ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, month - 1);
    if (day <= daysUntilMonth + (leapYear ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[month]) {
     date.day = day - daysUntilMonth;
    }
   }
  } else if (value = getMatch("a")) {
   var weekDay = value.substring(0, 3).toUpperCase();
   if (value = getMatch("U")) {
    var weekDayNumber = DAY_NUMBERS_SUN_FIRST[weekDay];
    var weekNumber = jstoi_q(value);
    var janFirst = new Date(date.year, 0, 1);
    var endDate;
    if (janFirst.getDay() === 0) {
     endDate = addDays(janFirst, weekDayNumber + 7 * (weekNumber - 1));
    } else {
     endDate = addDays(janFirst, 7 - janFirst.getDay() + weekDayNumber + 7 * (weekNumber - 1));
    }
    date.day = endDate.getDate();
    date.month = endDate.getMonth();
   } else if (value = getMatch("W")) {
    var weekDayNumber = DAY_NUMBERS_MON_FIRST[weekDay];
    var weekNumber = jstoi_q(value);
    var janFirst = new Date(date.year, 0, 1);
    var endDate;
    if (janFirst.getDay() === 1) {
     endDate = addDays(janFirst, weekDayNumber + 7 * (weekNumber - 1));
    } else {
     endDate = addDays(janFirst, 7 - janFirst.getDay() + 1 + weekDayNumber + 7 * (weekNumber - 1));
    }
    date.day = endDate.getDate();
    date.month = endDate.getMonth();
   }
  }
  var fullDate = new Date(date.year, date.month, date.day, date.hour, date.min, date.sec, 0);
  HEAP32[tm >>> 2] = fullDate.getSeconds();
  HEAP32[tm + 4 >>> 2] = fullDate.getMinutes();
  HEAP32[tm + 8 >>> 2] = fullDate.getHours();
  HEAP32[tm + 12 >>> 2] = fullDate.getDate();
  HEAP32[tm + 16 >>> 2] = fullDate.getMonth();
  HEAP32[tm + 20 >>> 2] = fullDate.getFullYear() - 1900;
  HEAP32[tm + 24 >>> 2] = fullDate.getDay();
  HEAP32[tm + 28 >>> 2] = arraySum(isLeapYear(fullDate.getFullYear()) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, fullDate.getMonth() - 1) + fullDate.getDate() - 1;
  HEAP32[tm + 32 >>> 2] = 0;
  return buf + intArrayFromString(matches[0]).length - 1;
 }
 return 0;
}

function _swapcontext() {
 err("missing function: swapcontext");
 abort(-1);
}

function _tokenize() {
 err("missing function: tokenize");
 abort(-1);
}

function _zError() {
 err("missing function: zError");
 abort(-1);
}

var wasmTableMirror = [];

function runAndAbortIfError(func) {
 try {
  return func();
 } catch (e) {
  abort(e);
 }
}

var runtimeKeepalivePush = () => {
 runtimeKeepaliveCounter += 1;
};

var runtimeKeepalivePop = () => {
 runtimeKeepaliveCounter -= 1;
};

var Asyncify = {
 instrumentWasmImports: function(imports) {
  var importPatterns = [ /^invoke_.*$/, /^fd_sync$/, /^__wasi_fd_sync$/, /^__asyncjs__.*$/, /^emscripten_promise_await$/, /^emscripten_sleep$/, /^emscripten_wget_data$/, /^emscripten_scan_registers$/, /^emscripten_lazy_load_code$/, /^_load_secondary_module$/, /^emscripten_fiber_swap$/ ];
  for (var x in imports) {
   (function(x) {
    var original = imports[x];
    var sig = original.sig;
    if (typeof original == "function") {
     var isAsyncifyImport = original.isAsync || importPatterns.some(pattern => !!x.match(pattern));
    }
   })(x);
  }
 },
 instrumentWasmExports: function(exports) {
  var ret = {};
  for (var x in exports) {
   (function(x) {
    var original = exports[x];
    if (typeof original == "function") {
     ret[x] = function() {
      Asyncify.exportCallStack.push(x);
      try {
       return original.apply(null, arguments);
      } finally {
       if (!ABORT) {
        var y = Asyncify.exportCallStack.pop();
        assert(y === x);
        Asyncify.maybeStopUnwind();
       }
      }
     };
    } else {
     ret[x] = original;
    }
   })(x);
  }
  return ret;
 },
 State: {
  Normal: 0,
  Unwinding: 1,
  Rewinding: 2,
  Disabled: 3
 },
 state: 0,
 StackSize: 4096,
 currData: null,
 handleSleepReturnValue: 0,
 exportCallStack: [],
 callStackNameToId: {},
 callStackIdToName: {},
 callStackId: 0,
 asyncPromiseHandlers: null,
 sleepCallbacks: [],
 getCallStackId: function(funcName) {
  var id = Asyncify.callStackNameToId[funcName];
  if (id === undefined) {
   id = Asyncify.callStackId++;
   Asyncify.callStackNameToId[funcName] = id;
   Asyncify.callStackIdToName[id] = funcName;
  }
  return id;
 },
 maybeStopUnwind: function() {
  if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
   Asyncify.state = Asyncify.State.Normal;
   runtimeKeepalivePush();
   runAndAbortIfError(_asyncify_stop_unwind);
   if (typeof Fibers != "undefined") {
    Fibers.trampoline();
   }
  }
 },
 whenDone: function() {
  return new Promise((resolve, reject) => {
   Asyncify.asyncPromiseHandlers = {
    resolve: resolve,
    reject: reject
   };
  });
 },
 allocateData: function() {
  var ptr = _malloc(12 + Asyncify.StackSize);
  Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
  Asyncify.setDataRewindFunc(ptr);
  return ptr;
 },
 setDataHeader: function(ptr, stack, stackSize) {
  HEAPU32[ptr >>> 2] = stack;
  HEAPU32[ptr + 4 >>> 2] = stack + stackSize;
 },
 setDataRewindFunc: function(ptr) {
  var bottomOfCallStack = Asyncify.exportCallStack[0];
  var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
  HEAP32[ptr + 8 >>> 2] = rewindId;
 },
 getDataRewindFunc: function(ptr) {
  var id = HEAP32[ptr + 8 >>> 2];
  var name = Asyncify.callStackIdToName[id];
  var func = wasmExports[name];
  return func;
 },
 doRewind: function(ptr) {
  var start = Asyncify.getDataRewindFunc(ptr);
  runtimeKeepalivePop();
  return start();
 },
 handleSleep: function(startAsync) {
  if (ABORT) return;
  if (Asyncify.state === Asyncify.State.Normal) {
   var reachedCallback = false;
   var reachedAfterCallback = false;
   startAsync((handleSleepReturnValue = 0) => {
    if (ABORT) return;
    Asyncify.handleSleepReturnValue = handleSleepReturnValue;
    reachedCallback = true;
    if (!reachedAfterCallback) {
     return;
    }
    Asyncify.state = Asyncify.State.Rewinding;
    runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
    if (typeof Browser != "undefined" && Browser.mainLoop.func) {
     Browser.mainLoop.resume();
    }
    var asyncWasmReturnValue, isError = false;
    try {
     asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
    } catch (err) {
     asyncWasmReturnValue = err;
     isError = true;
    }
    var handled = false;
    if (!Asyncify.currData) {
     var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
     if (asyncPromiseHandlers) {
      Asyncify.asyncPromiseHandlers = null;
      (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
      handled = true;
     }
    }
    if (isError && !handled) {
     throw asyncWasmReturnValue;
    }
   });
   reachedAfterCallback = true;
   if (!reachedCallback) {
    Asyncify.state = Asyncify.State.Unwinding;
    Asyncify.currData = Asyncify.allocateData();
    if (typeof Browser != "undefined" && Browser.mainLoop.func) {
     Browser.mainLoop.pause();
    }
    runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
   }
  } else if (Asyncify.state === Asyncify.State.Rewinding) {
   Asyncify.state = Asyncify.State.Normal;
   runAndAbortIfError(_asyncify_stop_rewind);
   _free(Asyncify.currData);
   Asyncify.currData = null;
   Asyncify.sleepCallbacks.forEach(func => callUserCallback(func));
  } else {
   abort(`invalid state: ${Asyncify.state}`);
  }
  return Asyncify.handleSleepReturnValue;
 },
 handleAsync: function(startAsync) {
  return Asyncify.handleSleep(wakeUp => {
   startAsync().then(wakeUp);
  });
 }
};

function getCFunc(ident) {
 var func = Module["_" + ident];
 return func;
}

var stringToUTF8OnStack = str => {
 var size = lengthBytesUTF8(str) + 1;
 var ret = stackAlloc(size);
 stringToUTF8(str, ret, size);
 return ret;
};

var ccall = function(ident, returnType, argTypes, args, opts) {
 var toC = {
  "string": str => {
   var ret = 0;
   if (str !== null && str !== undefined && str !== 0) {
    ret = stringToUTF8OnStack(str);
   }
   return ret;
  },
  "array": arr => {
   var ret = stackAlloc(arr.length);
   writeArrayToMemory(arr, ret);
   return ret;
  }
 };
 function convertReturnValue(ret) {
  if (returnType === "string") {
   return UTF8ToString(ret);
  }
  if (returnType === "boolean") return Boolean(ret);
  return ret;
 }
 var func = getCFunc(ident);
 var cArgs = [];
 var stack = 0;
 if (args) {
  for (var i = 0; i < args.length; i++) {
   var converter = toC[argTypes[i]];
   if (converter) {
    if (stack === 0) stack = stackSave();
    cArgs[i] = converter(args[i]);
   } else {
    cArgs[i] = args[i];
   }
  }
 }
 var previousAsync = Asyncify.currData;
 var ret = func.apply(null, cArgs);
 function onDone(ret) {
  runtimeKeepalivePop();
  if (stack !== 0) stackRestore(stack);
  return convertReturnValue(ret);
 }
 var asyncMode = opts && opts.async;
 runtimeKeepalivePush();
 if (Asyncify.currData != previousAsync) {
  return Asyncify.whenDone().then(onDone);
 }
 ret = onDone(ret);
 if (asyncMode) return Promise.resolve(ret);
 return ret;
};

var FSNode = function(parent, name, mode, rdev) {
 if (!parent) {
  parent = this;
 }
 this.parent = parent;
 this.mount = parent.mount;
 this.mounted = null;
 this.id = FS.nextInode++;
 this.name = name;
 this.mode = mode;
 this.node_ops = {};
 this.stream_ops = {};
 this.rdev = rdev;
};

var readMode = 292 | 73;

var writeMode = 146;

Object.defineProperties(FSNode.prototype, {
 read: {
  get: function() {
   return (this.mode & readMode) === readMode;
  },
  set: function(val) {
   val ? this.mode |= readMode : this.mode &= ~readMode;
  }
 },
 write: {
  get: function() {
   return (this.mode & writeMode) === writeMode;
  },
  set: function(val) {
   val ? this.mode |= writeMode : this.mode &= ~writeMode;
  }
 },
 isFolder: {
  get: function() {
   return FS.isDir(this.mode);
  }
 },
 isDevice: {
  get: function() {
   return FS.isChrdev(this.mode);
  }
 }
});

FS.FSNode = FSNode;

FS.createPreloadedFile = FS_createPreloadedFile;

FS.staticInit();

Module["FS_createPath"] = FS.createPath;

Module["FS_createDataFile"] = FS.createDataFile;

Module["FS_createPreloadedFile"] = FS.createPreloadedFile;

Module["FS_unlink"] = FS.unlink;

Module["FS_createLazyFile"] = FS.createLazyFile;

Module["FS_createDevice"] = FS.createDevice;

var wasmImports = {
 __assert_fail: ___assert_fail,
 __asyncjs__pdo_cfd1_real_stmt_execute: __asyncjs__pdo_cfd1_real_stmt_execute,
 __asyncjs__php_stream_fetch_real_open: __asyncjs__php_stream_fetch_real_open,
 __asyncjs__vrzno_await_internal: __asyncjs__vrzno_await_internal,
 __call_sighandler: ___call_sighandler,
 __syscall__newselect: ___syscall__newselect,
 __syscall_accept4: ___syscall_accept4,
 __syscall_bind: ___syscall_bind,
 __syscall_chdir: ___syscall_chdir,
 __syscall_chmod: ___syscall_chmod,
 __syscall_connect: ___syscall_connect,
 __syscall_dup: ___syscall_dup,
 __syscall_faccessat: ___syscall_faccessat,
 __syscall_fchmod: ___syscall_fchmod,
 __syscall_fchownat: ___syscall_fchownat,
 __syscall_fcntl64: ___syscall_fcntl64,
 __syscall_fdatasync: ___syscall_fdatasync,
 __syscall_fstat64: ___syscall_fstat64,
 __syscall_fstatfs64: ___syscall_fstatfs64,
 __syscall_ftruncate64: ___syscall_ftruncate64,
 __syscall_getcwd: ___syscall_getcwd,
 __syscall_getdents64: ___syscall_getdents64,
 __syscall_getpeername: ___syscall_getpeername,
 __syscall_getsockname: ___syscall_getsockname,
 __syscall_getsockopt: ___syscall_getsockopt,
 __syscall_ioctl: ___syscall_ioctl,
 __syscall_listen: ___syscall_listen,
 __syscall_lstat64: ___syscall_lstat64,
 __syscall_mkdirat: ___syscall_mkdirat,
 __syscall_newfstatat: ___syscall_newfstatat,
 __syscall_openat: ___syscall_openat,
 __syscall_pipe: ___syscall_pipe,
 __syscall_poll: ___syscall_poll,
 __syscall_readlinkat: ___syscall_readlinkat,
 __syscall_recvfrom: ___syscall_recvfrom,
 __syscall_renameat: ___syscall_renameat,
 __syscall_rmdir: ___syscall_rmdir,
 __syscall_sendto: ___syscall_sendto,
 __syscall_socket: ___syscall_socket,
 __syscall_stat64: ___syscall_stat64,
 __syscall_statfs64: ___syscall_statfs64,
 __syscall_symlink: ___syscall_symlink,
 __syscall_unlinkat: ___syscall_unlinkat,
 __syscall_utimensat: ___syscall_utimensat,
 _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
 _emscripten_throw_longjmp: __emscripten_throw_longjmp,
 _gmtime_js: __gmtime_js,
 _localtime_js: __localtime_js,
 _mktime_js: __mktime_js,
 _mmap_js: __mmap_js,
 _msync_js: __msync_js,
 _munmap_js: __munmap_js,
 _setitimer_js: __setitimer_js,
 _timegm_js: __timegm_js,
 _tzset_js: __tzset_js,
 abort: _abort,
 crc32: _crc32,
 deflate: _deflate,
 deflateEnd: _deflateEnd,
 deflateInit2_: _deflateInit2_,
 emscripten_asm_const_int: _emscripten_asm_const_int,
 emscripten_asm_const_ptr: _emscripten_asm_const_ptr,
 emscripten_date_now: _emscripten_date_now,
 emscripten_get_heap_max: _emscripten_get_heap_max,
 emscripten_get_now: _emscripten_get_now,
 emscripten_get_now_res: _emscripten_get_now_res,
 emscripten_memcpy_big: _emscripten_memcpy_big,
 emscripten_resize_heap: _emscripten_resize_heap,
 environ_get: _environ_get,
 environ_sizes_get: _environ_sizes_get,
 exit: _exit,
 fd_close: _fd_close,
 fd_fdstat_get: _fd_fdstat_get,
 fd_read: _fd_read,
 fd_seek: _fd_seek,
 fd_sync: _fd_sync,
 fd_write: _fd_write,
 getaddrinfo: _getaddrinfo,
 getcontext: _getcontext,
 getdtablesize: _getdtablesize,
 gethostbyname_r: _gethostbyname_r,
 getloadavg: _getloadavg,
 getnameinfo: _getnameinfo,
 getprotobyname: _getprotobyname,
 getprotobynumber: _getprotobynumber,
 inflate: _inflate,
 inflateEnd: _inflateEnd,
 inflateInit2_: _inflateInit2_,
 invoke_i: invoke_i,
 invoke_ii: invoke_ii,
 invoke_iii: invoke_iii,
 invoke_iiii: invoke_iiii,
 invoke_iiiii: invoke_iiiii,
 invoke_iiiiii: invoke_iiiiii,
 invoke_iiiiiii: invoke_iiiiiii,
 invoke_iiiiiiii: invoke_iiiiiiii,
 invoke_iiiiiiiiii: invoke_iiiiiiiiii,
 invoke_v: invoke_v,
 invoke_vi: invoke_vi,
 invoke_vii: invoke_vii,
 invoke_viii: invoke_viii,
 invoke_viiii: invoke_viiii,
 invoke_viiiiii: invoke_viiiiii,
 makecontext: _makecontext,
 posix_spawnp: _posix_spawnp,
 proc_exit: _proc_exit,
 strftime: _strftime,
 strptime: _strptime,
 swapcontext: _swapcontext,
 tokenize: _tokenize,
 zError: _zError
};

var asm = createWasm();

var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["__wasm_call_ctors"])();

var _php_time = Module["_php_time"] = () => (_php_time = Module["_php_time"] = wasmExports["php_time"])();

var _gettimeofday = Module["_gettimeofday"] = (a0, a1) => (_gettimeofday = Module["_gettimeofday"] = wasmExports["gettimeofday"])(a0, a1);

var _time = Module["_time"] = a0 => (_time = Module["_time"] = wasmExports["time"])(a0);

var _php_date_get_date_ce = Module["_php_date_get_date_ce"] = () => (_php_date_get_date_ce = Module["_php_date_get_date_ce"] = wasmExports["php_date_get_date_ce"])();

var _php_date_get_immutable_ce = Module["_php_date_get_immutable_ce"] = () => (_php_date_get_immutable_ce = Module["_php_date_get_immutable_ce"] = wasmExports["php_date_get_immutable_ce"])();

var _php_date_get_interface_ce = Module["_php_date_get_interface_ce"] = () => (_php_date_get_interface_ce = Module["_php_date_get_interface_ce"] = wasmExports["php_date_get_interface_ce"])();

var _php_date_get_timezone_ce = Module["_php_date_get_timezone_ce"] = () => (_php_date_get_timezone_ce = Module["_php_date_get_timezone_ce"] = wasmExports["php_date_get_timezone_ce"])();

var _php_date_get_interval_ce = Module["_php_date_get_interval_ce"] = () => (_php_date_get_interval_ce = Module["_php_date_get_interval_ce"] = wasmExports["php_date_get_interval_ce"])();

var _php_date_get_period_ce = Module["_php_date_get_period_ce"] = () => (_php_date_get_period_ce = Module["_php_date_get_period_ce"] = wasmExports["php_date_get_period_ce"])();

var __efree = Module["__efree"] = a0 => (__efree = Module["__efree"] = wasmExports["_efree"])(a0);

var _zend_hash_destroy = Module["_zend_hash_destroy"] = a0 => (_zend_hash_destroy = Module["_zend_hash_destroy"] = wasmExports["zend_hash_destroy"])(a0);

var __efree_48 = Module["__efree_48"] = a0 => (__efree_48 = Module["__efree_48"] = wasmExports["_efree_48"])(a0);

var _zend_register_ini_entries_ex = Module["_zend_register_ini_entries_ex"] = (a0, a1, a2) => (_zend_register_ini_entries_ex = Module["_zend_register_ini_entries_ex"] = wasmExports["zend_register_ini_entries_ex"])(a0, a1, a2);

var _zend_unregister_ini_entries_ex = Module["_zend_unregister_ini_entries_ex"] = (a0, a1) => (_zend_unregister_ini_entries_ex = Module["_zend_unregister_ini_entries_ex"] = wasmExports["zend_unregister_ini_entries_ex"])(a0, a1);

var _php_info_print_table_start = Module["_php_info_print_table_start"] = () => (_php_info_print_table_start = Module["_php_info_print_table_start"] = wasmExports["php_info_print_table_start"])();

var _php_info_print_table_row = Module["_php_info_print_table_row"] = (a0, a1) => (_php_info_print_table_row = Module["_php_info_print_table_row"] = wasmExports["php_info_print_table_row"])(a0, a1);

var _php_info_print_table_end = Module["_php_info_print_table_end"] = () => (_php_info_print_table_end = Module["_php_info_print_table_end"] = wasmExports["php_info_print_table_end"])();

var _display_ini_entries = Module["_display_ini_entries"] = a0 => (_display_ini_entries = Module["_display_ini_entries"] = wasmExports["display_ini_entries"])(a0);

var _get_timezone_info = Module["_get_timezone_info"] = () => (_get_timezone_info = Module["_get_timezone_info"] = wasmExports["get_timezone_info"])();

var _zend_throw_error = Module["_zend_throw_error"] = (a0, a1, a2) => (_zend_throw_error = Module["_zend_throw_error"] = wasmExports["zend_throw_error"])(a0, a1, a2);

var _php_format_date = Module["_php_format_date"] = (a0, a1, a2, a3, a4) => (_php_format_date = Module["_php_format_date"] = wasmExports["php_format_date"])(a0, a1, a2, a3, a4);

var _php_idate = Module["_php_idate"] = (a0, a1, a2, a3) => (_php_idate = Module["_php_idate"] = wasmExports["php_idate"])(a0, a1, a2, a3);

var __estrdup = Module["__estrdup"] = a0 => (__estrdup = Module["__estrdup"] = wasmExports["_estrdup"])(a0);

var __emalloc_16 = Module["__emalloc_16"] = () => (__emalloc_16 = Module["__emalloc_16"] = wasmExports["_emalloc_16"])();

var _ap_php_snprintf = Module["_ap_php_snprintf"] = (a0, a1, a2, a3) => (_ap_php_snprintf = Module["_ap_php_snprintf"] = wasmExports["ap_php_snprintf"])(a0, a1, a2, a3);

var _abs = Module["_abs"] = a0 => (_abs = Module["_abs"] = wasmExports["abs"])(a0);

var _zend_wrong_parameters_count_error = Module["_zend_wrong_parameters_count_error"] = (a0, a1) => (_zend_wrong_parameters_count_error = Module["_zend_wrong_parameters_count_error"] = wasmExports["zend_wrong_parameters_count_error"])(a0, a1);

var _zend_wrong_parameter_error = Module["_zend_wrong_parameter_error"] = (a0, a1, a2, a3, a4) => (_zend_wrong_parameter_error = Module["_zend_wrong_parameter_error"] = wasmExports["zend_wrong_parameter_error"])(a0, a1, a2, a3, a4);

var _php_error_docref = Module["_php_error_docref"] = (a0, a1, a2, a3) => (_php_error_docref = Module["_php_error_docref"] = wasmExports["php_error_docref"])(a0, a1, a2, a3);

var _php_date_set_tzdb = Module["_php_date_set_tzdb"] = a0 => (_php_date_set_tzdb = Module["_php_date_set_tzdb"] = wasmExports["php_date_set_tzdb"])(a0);

var _php_version_compare = Module["_php_version_compare"] = (a0, a1) => (_php_version_compare = Module["_php_version_compare"] = wasmExports["php_version_compare"])(a0, a1);

var _php_parse_date = Module["_php_parse_date"] = (a0, a1) => (_php_parse_date = Module["_php_parse_date"] = wasmExports["php_parse_date"])(a0, a1);

var _strlen = Module["_strlen"] = a0 => (_strlen = Module["_strlen"] = wasmExports["strlen"])(a0);

var _php_mktime = Module["_php_mktime"] = (a0, a1, a2) => (_php_mktime = Module["_php_mktime"] = wasmExports["php_mktime"])(a0, a1, a2);

var _php_strftime = Module["_php_strftime"] = (a0, a1, a2) => (_php_strftime = Module["_php_strftime"] = wasmExports["php_strftime"])(a0, a1, a2);

var _zend_wrong_parameters_none_error = Module["_zend_wrong_parameters_none_error"] = () => (_zend_wrong_parameters_none_error = Module["_zend_wrong_parameters_none_error"] = wasmExports["zend_wrong_parameters_none_error"])();

var __zend_new_array_0 = Module["__zend_new_array_0"] = () => (__zend_new_array_0 = Module["__zend_new_array_0"] = wasmExports["_zend_new_array_0"])();

var _add_next_index_long = Module["_add_next_index_long"] = (a0, a1) => (_add_next_index_long = Module["_add_next_index_long"] = wasmExports["add_next_index_long"])(a0, a1);

var _add_index_long = Module["_add_index_long"] = (a0, a1, a2) => (_add_index_long = Module["_add_index_long"] = wasmExports["add_index_long"])(a0, a1, a2);

var _php_date_instantiate = Module["_php_date_instantiate"] = (a0, a1) => (_php_date_instantiate = Module["_php_date_instantiate"] = wasmExports["php_date_instantiate"])(a0, a1);

var _object_init_ex = Module["_object_init_ex"] = (a0, a1) => (_object_init_ex = Module["_object_init_ex"] = wasmExports["object_init_ex"])(a0, a1);

var _php_date_initialize = Module["_php_date_initialize"] = (a0, a1, a2, a3, a4, a5) => (_php_date_initialize = Module["_php_date_initialize"] = wasmExports["php_date_initialize"])(a0, a1, a2, a3, a4, a5);

var _zend_throw_exception_ex = Module["_zend_throw_exception_ex"] = (a0, a1, a2, a3) => (_zend_throw_exception_ex = Module["_zend_throw_exception_ex"] = wasmExports["zend_throw_exception_ex"])(a0, a1, a2, a3);

var _memcmp = Module["_memcmp"] = (a0, a1, a2) => (_memcmp = Module["_memcmp"] = wasmExports["memcmp"])(a0, a1, a2);

var _zval_ptr_dtor = Module["_zval_ptr_dtor"] = a0 => (_zval_ptr_dtor = Module["_zval_ptr_dtor"] = wasmExports["zval_ptr_dtor"])(a0);

var _zend_parse_method_parameters = Module["_zend_parse_method_parameters"] = (a0, a1, a2, a3) => (_zend_parse_method_parameters = Module["_zend_parse_method_parameters"] = wasmExports["zend_parse_method_parameters"])(a0, a1, a2, a3);

var _zend_parse_parameters = Module["_zend_parse_parameters"] = (a0, a1, a2) => (_zend_parse_parameters = Module["_zend_parse_parameters"] = wasmExports["zend_parse_parameters"])(a0, a1, a2);

var _zend_replace_error_handling = Module["_zend_replace_error_handling"] = (a0, a1, a2) => (_zend_replace_error_handling = Module["_zend_replace_error_handling"] = wasmExports["zend_replace_error_handling"])(a0, a1, a2);

var _zend_restore_error_handling = Module["_zend_restore_error_handling"] = a0 => (_zend_restore_error_handling = Module["_zend_restore_error_handling"] = wasmExports["zend_restore_error_handling"])(a0);

var _zend_parse_parameters_ex = Module["_zend_parse_parameters_ex"] = (a0, a1, a2, a3) => (_zend_parse_parameters_ex = Module["_zend_parse_parameters_ex"] = wasmExports["zend_parse_parameters_ex"])(a0, a1, a2, a3);

var _zend_type_error = Module["_zend_type_error"] = (a0, a1) => (_zend_type_error = Module["_zend_type_error"] = wasmExports["zend_type_error"])(a0, a1);

var _zend_create_internal_iterator_zval = Module["_zend_create_internal_iterator_zval"] = (a0, a1) => (_zend_create_internal_iterator_zval = Module["_zend_create_internal_iterator_zval"] = wasmExports["zend_create_internal_iterator_zval"])(a0, a1);

var _zend_argument_value_error = Module["_zend_argument_value_error"] = (a0, a1, a2) => (_zend_argument_value_error = Module["_zend_argument_value_error"] = wasmExports["zend_argument_value_error"])(a0, a1, a2);

var _add_next_index_string = Module["_add_next_index_string"] = (a0, a1) => (_add_next_index_string = Module["_add_next_index_string"] = wasmExports["add_next_index_string"])(a0, a1);

var _add_assoc_bool_ex = Module["_add_assoc_bool_ex"] = (a0, a1, a2, a3) => (_add_assoc_bool_ex = Module["_add_assoc_bool_ex"] = wasmExports["add_assoc_bool_ex"])(a0, a1, a2, a3);

var _add_assoc_long_ex = Module["_add_assoc_long_ex"] = (a0, a1, a2, a3) => (_add_assoc_long_ex = Module["_add_assoc_long_ex"] = wasmExports["add_assoc_long_ex"])(a0, a1, a2, a3);

var _add_assoc_string_ex = Module["_add_assoc_string_ex"] = (a0, a1, a2, a3) => (_add_assoc_string_ex = Module["_add_assoc_string_ex"] = wasmExports["add_assoc_string_ex"])(a0, a1, a2, a3);

var _add_assoc_null_ex = Module["_add_assoc_null_ex"] = (a0, a1, a2) => (_add_assoc_null_ex = Module["_add_assoc_null_ex"] = wasmExports["add_assoc_null_ex"])(a0, a1, a2);

var _zend_hash_str_find = Module["_zend_hash_str_find"] = (a0, a1, a2) => (_zend_hash_str_find = Module["_zend_hash_str_find"] = wasmExports["zend_hash_str_find"])(a0, a1, a2);

var __estrndup = Module["__estrndup"] = (a0, a1) => (__estrndup = Module["__estrndup"] = wasmExports["_estrndup"])(a0, a1);

var _OnUpdateString = Module["_OnUpdateString"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateString = Module["_OnUpdateString"] = wasmExports["OnUpdateString"])(a0, a1, a2, a3, a4, a5);

var _zend_register_string_constant = Module["_zend_register_string_constant"] = (a0, a1, a2, a3, a4) => (_zend_register_string_constant = Module["_zend_register_string_constant"] = wasmExports["zend_register_string_constant"])(a0, a1, a2, a3, a4);

var _zend_register_long_constant = Module["_zend_register_long_constant"] = (a0, a1, a2, a3, a4) => (_zend_register_long_constant = Module["_zend_register_long_constant"] = wasmExports["zend_register_long_constant"])(a0, a1, a2, a3, a4);

var _cfg_get_entry = Module["_cfg_get_entry"] = (a0, a1) => (_cfg_get_entry = Module["_cfg_get_entry"] = wasmExports["cfg_get_entry"])(a0, a1);

var __emalloc_48 = Module["__emalloc_48"] = () => (__emalloc_48 = Module["__emalloc_48"] = wasmExports["_emalloc_48"])();

var __zend_hash_init = Module["__zend_hash_init"] = (a0, a1, a2, a3) => (__zend_hash_init = Module["__zend_hash_init"] = wasmExports["_zend_hash_init"])(a0, a1, a2, a3);

var _zend_hash_str_add = Module["_zend_hash_str_add"] = (a0, a1, a2, a3) => (_zend_hash_str_add = Module["_zend_hash_str_add"] = wasmExports["zend_hash_str_add"])(a0, a1, a2, a3);

var _ap_php_slprintf = Module["_ap_php_slprintf"] = (a0, a1, a2, a3) => (_ap_php_slprintf = Module["_ap_php_slprintf"] = wasmExports["ap_php_slprintf"])(a0, a1, a2, a3);

var _strcmp = Module["_strcmp"] = (a0, a1) => (_strcmp = Module["_strcmp"] = wasmExports["strcmp"])(a0, a1);

var _smart_str_realloc = Module["_smart_str_realloc"] = (a0, a1) => (_smart_str_realloc = Module["_smart_str_realloc"] = wasmExports["smart_str_realloc"])(a0, a1);

var _smart_str_erealloc = Module["_smart_str_erealloc"] = (a0, a1) => (_smart_str_erealloc = Module["_smart_str_erealloc"] = wasmExports["smart_str_erealloc"])(a0, a1);

var _zend_parse_arg_str_slow = Module["_zend_parse_arg_str_slow"] = (a0, a1, a2) => (_zend_parse_arg_str_slow = Module["_zend_parse_arg_str_slow"] = wasmExports["zend_parse_arg_str_slow"])(a0, a1, a2);

var _zend_parse_arg_long_slow = Module["_zend_parse_arg_long_slow"] = (a0, a1, a2) => (_zend_parse_arg_long_slow = Module["_zend_parse_arg_long_slow"] = wasmExports["zend_parse_arg_long_slow"])(a0, a1, a2);

var ___zend_malloc = Module["___zend_malloc"] = a0 => (___zend_malloc = Module["___zend_malloc"] = wasmExports["__zend_malloc"])(a0);

var __emalloc_8 = Module["__emalloc_8"] = () => (__emalloc_8 = Module["__emalloc_8"] = wasmExports["_emalloc_8"])();

var __emalloc_24 = Module["__emalloc_24"] = () => (__emalloc_24 = Module["__emalloc_24"] = wasmExports["_emalloc_24"])();

var __emalloc_32 = Module["__emalloc_32"] = () => (__emalloc_32 = Module["__emalloc_32"] = wasmExports["_emalloc_32"])();

var __emalloc_40 = Module["__emalloc_40"] = () => (__emalloc_40 = Module["__emalloc_40"] = wasmExports["_emalloc_40"])();

var __emalloc_56 = Module["__emalloc_56"] = () => (__emalloc_56 = Module["__emalloc_56"] = wasmExports["_emalloc_56"])();

var __emalloc_64 = Module["__emalloc_64"] = () => (__emalloc_64 = Module["__emalloc_64"] = wasmExports["_emalloc_64"])();

var __emalloc_80 = Module["__emalloc_80"] = () => (__emalloc_80 = Module["__emalloc_80"] = wasmExports["_emalloc_80"])();

var __emalloc_96 = Module["__emalloc_96"] = () => (__emalloc_96 = Module["__emalloc_96"] = wasmExports["_emalloc_96"])();

var __emalloc_112 = Module["__emalloc_112"] = () => (__emalloc_112 = Module["__emalloc_112"] = wasmExports["_emalloc_112"])();

var __emalloc_128 = Module["__emalloc_128"] = () => (__emalloc_128 = Module["__emalloc_128"] = wasmExports["_emalloc_128"])();

var __emalloc_160 = Module["__emalloc_160"] = () => (__emalloc_160 = Module["__emalloc_160"] = wasmExports["_emalloc_160"])();

var __emalloc_192 = Module["__emalloc_192"] = () => (__emalloc_192 = Module["__emalloc_192"] = wasmExports["_emalloc_192"])();

var __emalloc_224 = Module["__emalloc_224"] = () => (__emalloc_224 = Module["__emalloc_224"] = wasmExports["_emalloc_224"])();

var __emalloc_256 = Module["__emalloc_256"] = () => (__emalloc_256 = Module["__emalloc_256"] = wasmExports["_emalloc_256"])();

var __emalloc_320 = Module["__emalloc_320"] = () => (__emalloc_320 = Module["__emalloc_320"] = wasmExports["_emalloc_320"])();

var __emalloc_384 = Module["__emalloc_384"] = () => (__emalloc_384 = Module["__emalloc_384"] = wasmExports["_emalloc_384"])();

var __emalloc_448 = Module["__emalloc_448"] = () => (__emalloc_448 = Module["__emalloc_448"] = wasmExports["_emalloc_448"])();

var __emalloc_512 = Module["__emalloc_512"] = () => (__emalloc_512 = Module["__emalloc_512"] = wasmExports["_emalloc_512"])();

var __emalloc_640 = Module["__emalloc_640"] = () => (__emalloc_640 = Module["__emalloc_640"] = wasmExports["_emalloc_640"])();

var __emalloc_768 = Module["__emalloc_768"] = () => (__emalloc_768 = Module["__emalloc_768"] = wasmExports["_emalloc_768"])();

var __emalloc_896 = Module["__emalloc_896"] = () => (__emalloc_896 = Module["__emalloc_896"] = wasmExports["_emalloc_896"])();

var __emalloc_1024 = Module["__emalloc_1024"] = () => (__emalloc_1024 = Module["__emalloc_1024"] = wasmExports["_emalloc_1024"])();

var __emalloc_1280 = Module["__emalloc_1280"] = () => (__emalloc_1280 = Module["__emalloc_1280"] = wasmExports["_emalloc_1280"])();

var __emalloc_1536 = Module["__emalloc_1536"] = () => (__emalloc_1536 = Module["__emalloc_1536"] = wasmExports["_emalloc_1536"])();

var __emalloc_1792 = Module["__emalloc_1792"] = () => (__emalloc_1792 = Module["__emalloc_1792"] = wasmExports["_emalloc_1792"])();

var __emalloc_2048 = Module["__emalloc_2048"] = () => (__emalloc_2048 = Module["__emalloc_2048"] = wasmExports["_emalloc_2048"])();

var __emalloc_2560 = Module["__emalloc_2560"] = () => (__emalloc_2560 = Module["__emalloc_2560"] = wasmExports["_emalloc_2560"])();

var __emalloc_3072 = Module["__emalloc_3072"] = () => (__emalloc_3072 = Module["__emalloc_3072"] = wasmExports["_emalloc_3072"])();

var __emalloc_large = Module["__emalloc_large"] = a0 => (__emalloc_large = Module["__emalloc_large"] = wasmExports["_emalloc_large"])(a0);

var __emalloc_huge = Module["__emalloc_huge"] = a0 => (__emalloc_huge = Module["__emalloc_huge"] = wasmExports["_emalloc_huge"])(a0);

var __emalloc = Module["__emalloc"] = a0 => (__emalloc = Module["__emalloc"] = wasmExports["_emalloc"])(a0);

var ___zend_realloc = Module["___zend_realloc"] = (a0, a1) => (___zend_realloc = Module["___zend_realloc"] = wasmExports["__zend_realloc"])(a0, a1);

var __erealloc = Module["__erealloc"] = (a0, a1) => (__erealloc = Module["__erealloc"] = wasmExports["_erealloc"])(a0, a1);

var _zend_parse_arg_bool_slow = Module["_zend_parse_arg_bool_slow"] = (a0, a1, a2) => (_zend_parse_arg_bool_slow = Module["_zend_parse_arg_bool_slow"] = wasmExports["zend_parse_arg_bool_slow"])(a0, a1, a2);

var _zend_register_internal_interface = Module["_zend_register_internal_interface"] = a0 => (_zend_register_internal_interface = Module["_zend_register_internal_interface"] = wasmExports["zend_register_internal_interface"])(a0);

var _zend_declare_class_constant_ex = Module["_zend_declare_class_constant_ex"] = (a0, a1, a2, a3, a4) => (_zend_declare_class_constant_ex = Module["_zend_declare_class_constant_ex"] = wasmExports["zend_declare_class_constant_ex"])(a0, a1, a2, a3, a4);

var _free = a0 => (_free = wasmExports["free"])(a0);

var _zend_error = Module["_zend_error"] = (a0, a1, a2) => (_zend_error = Module["_zend_error"] = wasmExports["zend_error"])(a0, a1, a2);

var _instanceof_function_slow = Module["_instanceof_function_slow"] = (a0, a1) => (_instanceof_function_slow = Module["_instanceof_function_slow"] = wasmExports["instanceof_function_slow"])(a0, a1);

var _zend_register_internal_class_ex = Module["_zend_register_internal_class_ex"] = (a0, a1) => (_zend_register_internal_class_ex = Module["_zend_register_internal_class_ex"] = wasmExports["zend_register_internal_class_ex"])(a0, a1);

var _zend_class_implements = Module["_zend_class_implements"] = (a0, a1, a2) => (_zend_class_implements = Module["_zend_class_implements"] = wasmExports["zend_class_implements"])(a0, a1, a2);

var _zend_object_std_init = Module["_zend_object_std_init"] = (a0, a1) => (_zend_object_std_init = Module["_zend_object_std_init"] = wasmExports["zend_object_std_init"])(a0, a1);

var _object_properties_init = Module["_object_properties_init"] = (a0, a1) => (_object_properties_init = Module["_object_properties_init"] = wasmExports["object_properties_init"])(a0, a1);

var _zend_object_std_dtor = Module["_zend_object_std_dtor"] = a0 => (_zend_object_std_dtor = Module["_zend_object_std_dtor"] = wasmExports["zend_object_std_dtor"])(a0);

var _zend_objects_clone_members = Module["_zend_objects_clone_members"] = (a0, a1) => (_zend_objects_clone_members = Module["_zend_objects_clone_members"] = wasmExports["zend_objects_clone_members"])(a0, a1);

var _zend_std_compare_objects = Module["_zend_std_compare_objects"] = (a0, a1) => (_zend_std_compare_objects = Module["_zend_std_compare_objects"] = wasmExports["zend_std_compare_objects"])(a0, a1);

var _zend_std_get_properties_for = Module["_zend_std_get_properties_for"] = (a0, a1) => (_zend_std_get_properties_for = Module["_zend_std_get_properties_for"] = wasmExports["zend_std_get_properties_for"])(a0, a1);

var _zend_array_dup = Module["_zend_array_dup"] = a0 => (_zend_array_dup = Module["_zend_array_dup"] = wasmExports["zend_array_dup"])(a0);

var _zend_std_get_properties = Module["_zend_std_get_properties"] = a0 => (_zend_std_get_properties = Module["_zend_std_get_properties"] = wasmExports["zend_std_get_properties"])(a0);

var _zend_hash_str_update = Module["_zend_hash_str_update"] = (a0, a1, a2, a3) => (_zend_hash_str_update = Module["_zend_hash_str_update"] = wasmExports["zend_hash_str_update"])(a0, a1, a2, a3);

var _zend_std_has_property = Module["_zend_std_has_property"] = (a0, a1, a2, a3) => (_zend_std_has_property = Module["_zend_std_has_property"] = wasmExports["zend_std_has_property"])(a0, a1, a2, a3);

var _zend_is_true = Module["_zend_is_true"] = a0 => (_zend_is_true = Module["_zend_is_true"] = wasmExports["zend_is_true"])(a0);

var _zend_std_read_property = Module["_zend_std_read_property"] = (a0, a1, a2, a3, a4) => (_zend_std_read_property = Module["_zend_std_read_property"] = wasmExports["zend_std_read_property"])(a0, a1, a2, a3, a4);

var _zend_std_write_property = Module["_zend_std_write_property"] = (a0, a1, a2, a3) => (_zend_std_write_property = Module["_zend_std_write_property"] = wasmExports["zend_std_write_property"])(a0, a1, a2, a3);

var _zval_get_long_func = Module["_zval_get_long_func"] = (a0, a1) => (_zval_get_long_func = Module["_zval_get_long_func"] = wasmExports["zval_get_long_func"])(a0, a1);

var _zend_dval_to_lval_slow = Module["_zend_dval_to_lval_slow"] = a0 => (_zend_dval_to_lval_slow = Module["_zend_dval_to_lval_slow"] = wasmExports["zend_dval_to_lval_slow"])(a0);

var _zval_get_double_func = Module["_zval_get_double_func"] = a0 => (_zval_get_double_func = Module["_zval_get_double_func"] = wasmExports["zval_get_double_func"])(a0);

var _zend_std_get_property_ptr_ptr = Module["_zend_std_get_property_ptr_ptr"] = (a0, a1, a2, a3) => (_zend_std_get_property_ptr_ptr = Module["_zend_std_get_property_ptr_ptr"] = wasmExports["zend_std_get_property_ptr_ptr"])(a0, a1, a2, a3);

var _zend_declare_typed_property = Module["_zend_declare_typed_property"] = (a0, a1, a2, a3, a4, a5) => (_zend_declare_typed_property = Module["_zend_declare_typed_property"] = wasmExports["zend_declare_typed_property"])(a0, a1, a2, a3, a4, a5);

var _zend_iterator_init = Module["_zend_iterator_init"] = a0 => (_zend_iterator_init = Module["_zend_iterator_init"] = wasmExports["zend_iterator_init"])(a0);

var _rebuild_object_properties = Module["_rebuild_object_properties"] = a0 => (_rebuild_object_properties = Module["_rebuild_object_properties"] = wasmExports["rebuild_object_properties"])(a0);

var _zend_string_concat3 = Module["_zend_string_concat3"] = (a0, a1, a2, a3, a4, a5) => (_zend_string_concat3 = Module["_zend_string_concat3"] = wasmExports["zend_string_concat3"])(a0, a1, a2, a3, a4, a5);

var _zend_hash_add = Module["_zend_hash_add"] = (a0, a1, a2) => (_zend_hash_add = Module["_zend_hash_add"] = wasmExports["zend_hash_add"])(a0, a1, a2);

var _zend_unmangle_property_name_ex = Module["_zend_unmangle_property_name_ex"] = (a0, a1, a2, a3) => (_zend_unmangle_property_name_ex = Module["_zend_unmangle_property_name_ex"] = wasmExports["zend_unmangle_property_name_ex"])(a0, a1, a2, a3);

var _zend_lookup_class = Module["_zend_lookup_class"] = a0 => (_zend_lookup_class = Module["_zend_lookup_class"] = wasmExports["zend_lookup_class"])(a0);

var _zend_update_property = Module["_zend_update_property"] = (a0, a1, a2, a3, a4) => (_zend_update_property = Module["_zend_update_property"] = wasmExports["zend_update_property"])(a0, a1, a2, a3, a4);

var _add_index_string = Module["_add_index_string"] = (a0, a1, a2) => (_add_index_string = Module["_add_index_string"] = wasmExports["add_index_string"])(a0, a1, a2);

var __ecalloc = Module["__ecalloc"] = (a0, a1) => (__ecalloc = Module["__ecalloc"] = wasmExports["_ecalloc"])(a0, a1);

var _zend_spprintf = Module["_zend_spprintf"] = (a0, a1, a2, a3) => (_zend_spprintf = Module["_zend_spprintf"] = wasmExports["zend_spprintf"])(a0, a1, a2, a3);

var _add_assoc_str_ex = Module["_add_assoc_str_ex"] = (a0, a1, a2, a3) => (_add_assoc_str_ex = Module["_add_assoc_str_ex"] = wasmExports["add_assoc_str_ex"])(a0, a1, a2, a3);

var _zend_hash_next_index_insert = Module["_zend_hash_next_index_insert"] = (a0, a1) => (_zend_hash_next_index_insert = Module["_zend_hash_next_index_insert"] = wasmExports["zend_hash_next_index_insert"])(a0, a1);

var _add_assoc_double_ex = Module["_add_assoc_double_ex"] = (a0, a1, a2, a3) => (_add_assoc_double_ex = Module["_add_assoc_double_ex"] = wasmExports["add_assoc_double_ex"])(a0, a1, a2, a3);

var _strtoll = Module["_strtoll"] = (a0, a1, a2) => (_strtoll = Module["_strtoll"] = wasmExports["strtoll"])(a0, a1, a2);

var _zval_get_string_func = Module["_zval_get_string_func"] = a0 => (_zval_get_string_func = Module["_zval_get_string_func"] = wasmExports["zval_get_string_func"])(a0);

var _get_active_function_or_method_name = Module["_get_active_function_or_method_name"] = () => (_get_active_function_or_method_name = Module["_get_active_function_or_method_name"] = wasmExports["get_active_function_or_method_name"])();

var _strncasecmp = Module["_strncasecmp"] = (a0, a1, a2) => (_strncasecmp = Module["_strncasecmp"] = wasmExports["strncasecmp"])(a0, a1, a2);

var _add_assoc_zval_ex = Module["_add_assoc_zval_ex"] = (a0, a1, a2, a3) => (_add_assoc_zval_ex = Module["_add_assoc_zval_ex"] = wasmExports["add_assoc_zval_ex"])(a0, a1, a2, a3);

var _zend_ini_double = Module["_zend_ini_double"] = (a0, a1, a2) => (_zend_ini_double = Module["_zend_ini_double"] = wasmExports["zend_ini_double"])(a0, a1, a2);

var _zend_strpprintf = Module["_zend_strpprintf"] = (a0, a1, a2) => (_zend_strpprintf = Module["_zend_strpprintf"] = wasmExports["zend_strpprintf"])(a0, a1, a2);

var _zend_parse_arg_double_slow = Module["_zend_parse_arg_double_slow"] = (a0, a1, a2) => (_zend_parse_arg_double_slow = Module["_zend_parse_arg_double_slow"] = wasmExports["zend_parse_arg_double_slow"])(a0, a1, a2);

var _acos = Module["_acos"] = a0 => (_acos = Module["_acos"] = wasmExports["acos"])(a0);

var _atan2 = Module["_atan2"] = (a0, a1) => (_atan2 = Module["_atan2"] = wasmExports["atan2"])(a0, a1);

var _isspace = Module["_isspace"] = a0 => (_isspace = Module["_isspace"] = wasmExports["isspace"])(a0);

var _strchr = Module["_strchr"] = (a0, a1) => (_strchr = Module["_strchr"] = wasmExports["strchr"])(a0, a1);

var _isdigit = Module["_isdigit"] = a0 => (_isdigit = Module["_isdigit"] = wasmExports["isdigit"])(a0);

var _strtol = Module["_strtol"] = (a0, a1, a2) => (_strtol = Module["_strtol"] = wasmExports["strtol"])(a0, a1, a2);

var _strtod = Module["_strtod"] = (a0, a1) => (_strtod = Module["_strtod"] = wasmExports["strtod"])(a0, a1);

var ___errno_location = () => (___errno_location = wasmExports["__errno_location"])();

var _printf = Module["_printf"] = (a0, a1) => (_printf = Module["_printf"] = wasmExports["printf"])(a0, a1);

var _snprintf = Module["_snprintf"] = (a0, a1, a2, a3) => (_snprintf = Module["_snprintf"] = wasmExports["snprintf"])(a0, a1, a2, a3);

var _toupper = Module["_toupper"] = a0 => (_toupper = Module["_toupper"] = wasmExports["toupper"])(a0);

var _llabs = Module["_llabs"] = (a0, a1) => (_llabs = Module["_llabs"] = wasmExports["llabs"])(a0, a1);

var _php_pcre2_code_copy = Module["_php_pcre2_code_copy"] = a0 => (_php_pcre2_code_copy = Module["_php_pcre2_code_copy"] = wasmExports["php_pcre2_code_copy"])(a0);

var _php_pcre2_code_copy_with_tables = Module["_php_pcre2_code_copy_with_tables"] = a0 => (_php_pcre2_code_copy_with_tables = Module["_php_pcre2_code_copy_with_tables"] = wasmExports["php_pcre2_code_copy_with_tables"])(a0);

var _php_pcre2_code_free = Module["_php_pcre2_code_free"] = a0 => (_php_pcre2_code_free = Module["_php_pcre2_code_free"] = wasmExports["php_pcre2_code_free"])(a0);

var _php_pcre2_compile = Module["_php_pcre2_compile"] = (a0, a1, a2, a3, a4, a5) => (_php_pcre2_compile = Module["_php_pcre2_compile"] = wasmExports["php_pcre2_compile"])(a0, a1, a2, a3, a4, a5);

var _tolower = Module["_tolower"] = a0 => (_tolower = Module["_tolower"] = wasmExports["tolower"])(a0);

var _php_pcre2_config = Module["_php_pcre2_config"] = (a0, a1) => (_php_pcre2_config = Module["_php_pcre2_config"] = wasmExports["php_pcre2_config"])(a0, a1);

var _malloc = a0 => (_malloc = wasmExports["malloc"])(a0);

var _php_pcre2_general_context_create = Module["_php_pcre2_general_context_create"] = (a0, a1, a2) => (_php_pcre2_general_context_create = Module["_php_pcre2_general_context_create"] = wasmExports["php_pcre2_general_context_create"])(a0, a1, a2);

var _php_pcre2_compile_context_create = Module["_php_pcre2_compile_context_create"] = a0 => (_php_pcre2_compile_context_create = Module["_php_pcre2_compile_context_create"] = wasmExports["php_pcre2_compile_context_create"])(a0);

var _php_pcre2_match_context_create = Module["_php_pcre2_match_context_create"] = a0 => (_php_pcre2_match_context_create = Module["_php_pcre2_match_context_create"] = wasmExports["php_pcre2_match_context_create"])(a0);

var _php_pcre2_convert_context_create = Module["_php_pcre2_convert_context_create"] = a0 => (_php_pcre2_convert_context_create = Module["_php_pcre2_convert_context_create"] = wasmExports["php_pcre2_convert_context_create"])(a0);

var _php_pcre2_general_context_copy = Module["_php_pcre2_general_context_copy"] = a0 => (_php_pcre2_general_context_copy = Module["_php_pcre2_general_context_copy"] = wasmExports["php_pcre2_general_context_copy"])(a0);

var _php_pcre2_compile_context_copy = Module["_php_pcre2_compile_context_copy"] = a0 => (_php_pcre2_compile_context_copy = Module["_php_pcre2_compile_context_copy"] = wasmExports["php_pcre2_compile_context_copy"])(a0);

var _php_pcre2_match_context_copy = Module["_php_pcre2_match_context_copy"] = a0 => (_php_pcre2_match_context_copy = Module["_php_pcre2_match_context_copy"] = wasmExports["php_pcre2_match_context_copy"])(a0);

var _php_pcre2_convert_context_copy = Module["_php_pcre2_convert_context_copy"] = a0 => (_php_pcre2_convert_context_copy = Module["_php_pcre2_convert_context_copy"] = wasmExports["php_pcre2_convert_context_copy"])(a0);

var _php_pcre2_general_context_free = Module["_php_pcre2_general_context_free"] = a0 => (_php_pcre2_general_context_free = Module["_php_pcre2_general_context_free"] = wasmExports["php_pcre2_general_context_free"])(a0);

var _php_pcre2_compile_context_free = Module["_php_pcre2_compile_context_free"] = a0 => (_php_pcre2_compile_context_free = Module["_php_pcre2_compile_context_free"] = wasmExports["php_pcre2_compile_context_free"])(a0);

var _php_pcre2_match_context_free = Module["_php_pcre2_match_context_free"] = a0 => (_php_pcre2_match_context_free = Module["_php_pcre2_match_context_free"] = wasmExports["php_pcre2_match_context_free"])(a0);

var _php_pcre2_convert_context_free = Module["_php_pcre2_convert_context_free"] = a0 => (_php_pcre2_convert_context_free = Module["_php_pcre2_convert_context_free"] = wasmExports["php_pcre2_convert_context_free"])(a0);

var _php_pcre2_set_character_tables = Module["_php_pcre2_set_character_tables"] = (a0, a1) => (_php_pcre2_set_character_tables = Module["_php_pcre2_set_character_tables"] = wasmExports["php_pcre2_set_character_tables"])(a0, a1);

var _php_pcre2_set_bsr = Module["_php_pcre2_set_bsr"] = (a0, a1) => (_php_pcre2_set_bsr = Module["_php_pcre2_set_bsr"] = wasmExports["php_pcre2_set_bsr"])(a0, a1);

var _php_pcre2_set_max_pattern_length = Module["_php_pcre2_set_max_pattern_length"] = (a0, a1) => (_php_pcre2_set_max_pattern_length = Module["_php_pcre2_set_max_pattern_length"] = wasmExports["php_pcre2_set_max_pattern_length"])(a0, a1);

var _php_pcre2_set_newline = Module["_php_pcre2_set_newline"] = (a0, a1) => (_php_pcre2_set_newline = Module["_php_pcre2_set_newline"] = wasmExports["php_pcre2_set_newline"])(a0, a1);

var _php_pcre2_set_parens_nest_limit = Module["_php_pcre2_set_parens_nest_limit"] = (a0, a1) => (_php_pcre2_set_parens_nest_limit = Module["_php_pcre2_set_parens_nest_limit"] = wasmExports["php_pcre2_set_parens_nest_limit"])(a0, a1);

var _php_pcre2_set_compile_extra_options = Module["_php_pcre2_set_compile_extra_options"] = (a0, a1) => (_php_pcre2_set_compile_extra_options = Module["_php_pcre2_set_compile_extra_options"] = wasmExports["php_pcre2_set_compile_extra_options"])(a0, a1);

var _php_pcre2_set_compile_recursion_guard = Module["_php_pcre2_set_compile_recursion_guard"] = (a0, a1, a2) => (_php_pcre2_set_compile_recursion_guard = Module["_php_pcre2_set_compile_recursion_guard"] = wasmExports["php_pcre2_set_compile_recursion_guard"])(a0, a1, a2);

var _php_pcre2_set_callout = Module["_php_pcre2_set_callout"] = (a0, a1, a2) => (_php_pcre2_set_callout = Module["_php_pcre2_set_callout"] = wasmExports["php_pcre2_set_callout"])(a0, a1, a2);

var _pcre2_set_substitute_callout_8 = Module["_pcre2_set_substitute_callout_8"] = (a0, a1, a2) => (_pcre2_set_substitute_callout_8 = Module["_pcre2_set_substitute_callout_8"] = wasmExports["pcre2_set_substitute_callout_8"])(a0, a1, a2);

var _php_pcre2_set_heap_limit = Module["_php_pcre2_set_heap_limit"] = (a0, a1) => (_php_pcre2_set_heap_limit = Module["_php_pcre2_set_heap_limit"] = wasmExports["php_pcre2_set_heap_limit"])(a0, a1);

var _php_pcre2_set_match_limit = Module["_php_pcre2_set_match_limit"] = (a0, a1) => (_php_pcre2_set_match_limit = Module["_php_pcre2_set_match_limit"] = wasmExports["php_pcre2_set_match_limit"])(a0, a1);

var _php_pcre2_set_depth_limit = Module["_php_pcre2_set_depth_limit"] = (a0, a1) => (_php_pcre2_set_depth_limit = Module["_php_pcre2_set_depth_limit"] = wasmExports["php_pcre2_set_depth_limit"])(a0, a1);

var _php_pcre2_set_offset_limit = Module["_php_pcre2_set_offset_limit"] = (a0, a1) => (_php_pcre2_set_offset_limit = Module["_php_pcre2_set_offset_limit"] = wasmExports["php_pcre2_set_offset_limit"])(a0, a1);

var _php_pcre2_set_recursion_limit = Module["_php_pcre2_set_recursion_limit"] = (a0, a1) => (_php_pcre2_set_recursion_limit = Module["_php_pcre2_set_recursion_limit"] = wasmExports["php_pcre2_set_recursion_limit"])(a0, a1);

var _php_pcre2_set_recursion_memory_management = Module["_php_pcre2_set_recursion_memory_management"] = (a0, a1, a2, a3) => (_php_pcre2_set_recursion_memory_management = Module["_php_pcre2_set_recursion_memory_management"] = wasmExports["php_pcre2_set_recursion_memory_management"])(a0, a1, a2, a3);

var _php_pcre2_set_glob_separator = Module["_php_pcre2_set_glob_separator"] = (a0, a1) => (_php_pcre2_set_glob_separator = Module["_php_pcre2_set_glob_separator"] = wasmExports["php_pcre2_set_glob_separator"])(a0, a1);

var _php_pcre2_set_glob_escape = Module["_php_pcre2_set_glob_escape"] = (a0, a1) => (_php_pcre2_set_glob_escape = Module["_php_pcre2_set_glob_escape"] = wasmExports["php_pcre2_set_glob_escape"])(a0, a1);

var _ispunct = Module["_ispunct"] = a0 => (_ispunct = Module["_ispunct"] = wasmExports["ispunct"])(a0);

var _php_pcre2_dfa_match = Module["_php_pcre2_dfa_match"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_php_pcre2_dfa_match = Module["_php_pcre2_dfa_match"] = wasmExports["php_pcre2_dfa_match"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _memchr = Module["_memchr"] = (a0, a1, a2) => (_memchr = Module["_memchr"] = wasmExports["memchr"])(a0, a1, a2);

var _php_pcre2_get_error_message = Module["_php_pcre2_get_error_message"] = (a0, a1, a2) => (_php_pcre2_get_error_message = Module["_php_pcre2_get_error_message"] = wasmExports["php_pcre2_get_error_message"])(a0, a1, a2);

var _php_pcre2_jit_compile = Module["_php_pcre2_jit_compile"] = (a0, a1) => (_php_pcre2_jit_compile = Module["_php_pcre2_jit_compile"] = wasmExports["php_pcre2_jit_compile"])(a0, a1);

var _php_pcre2_jit_match = Module["_php_pcre2_jit_match"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_pcre2_jit_match = Module["_php_pcre2_jit_match"] = wasmExports["php_pcre2_jit_match"])(a0, a1, a2, a3, a4, a5, a6);

var _php_pcre2_jit_free_unused_memory = Module["_php_pcre2_jit_free_unused_memory"] = a0 => (_php_pcre2_jit_free_unused_memory = Module["_php_pcre2_jit_free_unused_memory"] = wasmExports["php_pcre2_jit_free_unused_memory"])(a0);

var _php_pcre2_jit_stack_create = Module["_php_pcre2_jit_stack_create"] = (a0, a1, a2) => (_php_pcre2_jit_stack_create = Module["_php_pcre2_jit_stack_create"] = wasmExports["php_pcre2_jit_stack_create"])(a0, a1, a2);

var _php_pcre2_jit_stack_assign = Module["_php_pcre2_jit_stack_assign"] = (a0, a1, a2) => (_php_pcre2_jit_stack_assign = Module["_php_pcre2_jit_stack_assign"] = wasmExports["php_pcre2_jit_stack_assign"])(a0, a1, a2);

var _php_pcre2_jit_stack_free = Module["_php_pcre2_jit_stack_free"] = a0 => (_php_pcre2_jit_stack_free = Module["_php_pcre2_jit_stack_free"] = wasmExports["php_pcre2_jit_stack_free"])(a0);

var _php_pcre2_maketables = Module["_php_pcre2_maketables"] = a0 => (_php_pcre2_maketables = Module["_php_pcre2_maketables"] = wasmExports["php_pcre2_maketables"])(a0);

var _islower = Module["_islower"] = a0 => (_islower = Module["_islower"] = wasmExports["islower"])(a0);

var _isupper = Module["_isupper"] = a0 => (_isupper = Module["_isupper"] = wasmExports["isupper"])(a0);

var _isalnum = Module["_isalnum"] = a0 => (_isalnum = Module["_isalnum"] = wasmExports["isalnum"])(a0);

var _isxdigit = Module["_isxdigit"] = a0 => (_isxdigit = Module["_isxdigit"] = wasmExports["isxdigit"])(a0);

var _isgraph = Module["_isgraph"] = a0 => (_isgraph = Module["_isgraph"] = wasmExports["isgraph"])(a0);

var _isprint = Module["_isprint"] = a0 => (_isprint = Module["_isprint"] = wasmExports["isprint"])(a0);

var _iscntrl = Module["_iscntrl"] = a0 => (_iscntrl = Module["_iscntrl"] = wasmExports["iscntrl"])(a0);

var _isalpha = Module["_isalpha"] = a0 => (_isalpha = Module["_isalpha"] = wasmExports["isalpha"])(a0);

var _pcre2_maketables_free_8 = Module["_pcre2_maketables_free_8"] = (a0, a1) => (_pcre2_maketables_free_8 = Module["_pcre2_maketables_free_8"] = wasmExports["pcre2_maketables_free_8"])(a0, a1);

var _php_pcre2_match = Module["_php_pcre2_match"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_pcre2_match = Module["_php_pcre2_match"] = wasmExports["php_pcre2_match"])(a0, a1, a2, a3, a4, a5, a6);

var _php_pcre2_match_data_create = Module["_php_pcre2_match_data_create"] = (a0, a1) => (_php_pcre2_match_data_create = Module["_php_pcre2_match_data_create"] = wasmExports["php_pcre2_match_data_create"])(a0, a1);

var _php_pcre2_match_data_create_from_pattern = Module["_php_pcre2_match_data_create_from_pattern"] = (a0, a1) => (_php_pcre2_match_data_create_from_pattern = Module["_php_pcre2_match_data_create_from_pattern"] = wasmExports["php_pcre2_match_data_create_from_pattern"])(a0, a1);

var _php_pcre2_match_data_free = Module["_php_pcre2_match_data_free"] = a0 => (_php_pcre2_match_data_free = Module["_php_pcre2_match_data_free"] = wasmExports["php_pcre2_match_data_free"])(a0);

var _php_pcre2_get_mark = Module["_php_pcre2_get_mark"] = a0 => (_php_pcre2_get_mark = Module["_php_pcre2_get_mark"] = wasmExports["php_pcre2_get_mark"])(a0);

var _php_pcre2_get_ovector_pointer = Module["_php_pcre2_get_ovector_pointer"] = a0 => (_php_pcre2_get_ovector_pointer = Module["_php_pcre2_get_ovector_pointer"] = wasmExports["php_pcre2_get_ovector_pointer"])(a0);

var _php_pcre2_get_ovector_count = Module["_php_pcre2_get_ovector_count"] = a0 => (_php_pcre2_get_ovector_count = Module["_php_pcre2_get_ovector_count"] = wasmExports["php_pcre2_get_ovector_count"])(a0);

var _php_pcre2_get_startchar = Module["_php_pcre2_get_startchar"] = a0 => (_php_pcre2_get_startchar = Module["_php_pcre2_get_startchar"] = wasmExports["php_pcre2_get_startchar"])(a0);

var _pcre2_get_match_data_size_8 = Module["_pcre2_get_match_data_size_8"] = a0 => (_pcre2_get_match_data_size_8 = Module["_pcre2_get_match_data_size_8"] = wasmExports["pcre2_get_match_data_size_8"])(a0);

var _php_pcre2_pattern_info = Module["_php_pcre2_pattern_info"] = (a0, a1, a2) => (_php_pcre2_pattern_info = Module["_php_pcre2_pattern_info"] = wasmExports["php_pcre2_pattern_info"])(a0, a1, a2);

var _php_pcre2_callout_enumerate = Module["_php_pcre2_callout_enumerate"] = (a0, a1, a2) => (_php_pcre2_callout_enumerate = Module["_php_pcre2_callout_enumerate"] = wasmExports["php_pcre2_callout_enumerate"])(a0, a1, a2);

var _php_pcre2_serialize_encode = Module["_php_pcre2_serialize_encode"] = (a0, a1, a2, a3, a4) => (_php_pcre2_serialize_encode = Module["_php_pcre2_serialize_encode"] = wasmExports["php_pcre2_serialize_encode"])(a0, a1, a2, a3, a4);

var _php_pcre2_serialize_decode = Module["_php_pcre2_serialize_decode"] = (a0, a1, a2, a3) => (_php_pcre2_serialize_decode = Module["_php_pcre2_serialize_decode"] = wasmExports["php_pcre2_serialize_decode"])(a0, a1, a2, a3);

var _php_pcre2_serialize_get_number_of_codes = Module["_php_pcre2_serialize_get_number_of_codes"] = a0 => (_php_pcre2_serialize_get_number_of_codes = Module["_php_pcre2_serialize_get_number_of_codes"] = wasmExports["php_pcre2_serialize_get_number_of_codes"])(a0);

var _php_pcre2_serialize_free = Module["_php_pcre2_serialize_free"] = a0 => (_php_pcre2_serialize_free = Module["_php_pcre2_serialize_free"] = wasmExports["php_pcre2_serialize_free"])(a0);

var _php_pcre2_substitute = Module["_php_pcre2_substitute"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) => (_php_pcre2_substitute = Module["_php_pcre2_substitute"] = wasmExports["php_pcre2_substitute"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);

var _php_pcre2_substring_nametable_scan = Module["_php_pcre2_substring_nametable_scan"] = (a0, a1, a2, a3) => (_php_pcre2_substring_nametable_scan = Module["_php_pcre2_substring_nametable_scan"] = wasmExports["php_pcre2_substring_nametable_scan"])(a0, a1, a2, a3);

var _php_pcre2_substring_length_bynumber = Module["_php_pcre2_substring_length_bynumber"] = (a0, a1, a2) => (_php_pcre2_substring_length_bynumber = Module["_php_pcre2_substring_length_bynumber"] = wasmExports["php_pcre2_substring_length_bynumber"])(a0, a1, a2);

var _php_pcre2_substring_copy_byname = Module["_php_pcre2_substring_copy_byname"] = (a0, a1, a2, a3) => (_php_pcre2_substring_copy_byname = Module["_php_pcre2_substring_copy_byname"] = wasmExports["php_pcre2_substring_copy_byname"])(a0, a1, a2, a3);

var _php_pcre2_substring_copy_bynumber = Module["_php_pcre2_substring_copy_bynumber"] = (a0, a1, a2, a3) => (_php_pcre2_substring_copy_bynumber = Module["_php_pcre2_substring_copy_bynumber"] = wasmExports["php_pcre2_substring_copy_bynumber"])(a0, a1, a2, a3);

var _php_pcre2_substring_get_byname = Module["_php_pcre2_substring_get_byname"] = (a0, a1, a2, a3) => (_php_pcre2_substring_get_byname = Module["_php_pcre2_substring_get_byname"] = wasmExports["php_pcre2_substring_get_byname"])(a0, a1, a2, a3);

var _php_pcre2_substring_get_bynumber = Module["_php_pcre2_substring_get_bynumber"] = (a0, a1, a2, a3) => (_php_pcre2_substring_get_bynumber = Module["_php_pcre2_substring_get_bynumber"] = wasmExports["php_pcre2_substring_get_bynumber"])(a0, a1, a2, a3);

var _php_pcre2_substring_free = Module["_php_pcre2_substring_free"] = a0 => (_php_pcre2_substring_free = Module["_php_pcre2_substring_free"] = wasmExports["php_pcre2_substring_free"])(a0);

var _php_pcre2_substring_length_byname = Module["_php_pcre2_substring_length_byname"] = (a0, a1, a2) => (_php_pcre2_substring_length_byname = Module["_php_pcre2_substring_length_byname"] = wasmExports["php_pcre2_substring_length_byname"])(a0, a1, a2);

var _php_pcre2_substring_list_get = Module["_php_pcre2_substring_list_get"] = (a0, a1, a2) => (_php_pcre2_substring_list_get = Module["_php_pcre2_substring_list_get"] = wasmExports["php_pcre2_substring_list_get"])(a0, a1, a2);

var _php_pcre2_substring_list_free = Module["_php_pcre2_substring_list_free"] = a0 => (_php_pcre2_substring_list_free = Module["_php_pcre2_substring_list_free"] = wasmExports["php_pcre2_substring_list_free"])(a0);

var _php_pcre2_substring_number_from_name = Module["_php_pcre2_substring_number_from_name"] = (a0, a1) => (_php_pcre2_substring_number_from_name = Module["_php_pcre2_substring_number_from_name"] = wasmExports["php_pcre2_substring_number_from_name"])(a0, a1);

var _pcre2_pattern_convert_8 = Module["_pcre2_pattern_convert_8"] = (a0, a1, a2, a3, a4, a5) => (_pcre2_pattern_convert_8 = Module["_pcre2_pattern_convert_8"] = wasmExports["pcre2_pattern_convert_8"])(a0, a1, a2, a3, a4, a5);

var _pcre2_converted_pattern_free_8 = Module["_pcre2_converted_pattern_free_8"] = a0 => (_pcre2_converted_pattern_free_8 = Module["_pcre2_converted_pattern_free_8"] = wasmExports["pcre2_converted_pattern_free_8"])(a0);

var _pcre_get_compiled_regex_cache_ex = Module["_pcre_get_compiled_regex_cache_ex"] = (a0, a1) => (_pcre_get_compiled_regex_cache_ex = Module["_pcre_get_compiled_regex_cache_ex"] = wasmExports["pcre_get_compiled_regex_cache_ex"])(a0, a1);

var _zend_string_concat2 = Module["_zend_string_concat2"] = (a0, a1, a2, a3) => (_zend_string_concat2 = Module["_zend_string_concat2"] = wasmExports["zend_string_concat2"])(a0, a1, a2, a3);

var _zend_hash_find = Module["_zend_hash_find"] = (a0, a1) => (_zend_hash_find = Module["_zend_hash_find"] = wasmExports["zend_hash_find"])(a0, a1);

var _zend_hash_apply_with_argument = Module["_zend_hash_apply_with_argument"] = (a0, a1, a2) => (_zend_hash_apply_with_argument = Module["_zend_hash_apply_with_argument"] = wasmExports["zend_hash_apply_with_argument"])(a0, a1, a2);

var _pcre_get_compiled_regex_cache = Module["_pcre_get_compiled_regex_cache"] = a0 => (_pcre_get_compiled_regex_cache = Module["_pcre_get_compiled_regex_cache"] = wasmExports["pcre_get_compiled_regex_cache"])(a0);

var _pcre_get_compiled_regex = Module["_pcre_get_compiled_regex"] = (a0, a1) => (_pcre_get_compiled_regex = Module["_pcre_get_compiled_regex"] = wasmExports["pcre_get_compiled_regex"])(a0, a1);

var _php_pcre_create_match_data = Module["_php_pcre_create_match_data"] = (a0, a1) => (_php_pcre_create_match_data = Module["_php_pcre_create_match_data"] = wasmExports["php_pcre_create_match_data"])(a0, a1);

var _php_pcre_free_match_data = Module["_php_pcre_free_match_data"] = a0 => (_php_pcre_free_match_data = Module["_php_pcre_free_match_data"] = wasmExports["php_pcre_free_match_data"])(a0);

var _php_pcre_match_impl = Module["_php_pcre_match_impl"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_pcre_match_impl = Module["_php_pcre_match_impl"] = wasmExports["php_pcre_match_impl"])(a0, a1, a2, a3, a4, a5, a6, a7);

var __safe_emalloc = Module["__safe_emalloc"] = (a0, a1, a2) => (__safe_emalloc = Module["__safe_emalloc"] = wasmExports["_safe_emalloc"])(a0, a1, a2);

var _zend_hash_next_index_insert_new = Module["_zend_hash_next_index_insert_new"] = (a0, a1) => (_zend_hash_next_index_insert_new = Module["_zend_hash_next_index_insert_new"] = wasmExports["zend_hash_next_index_insert_new"])(a0, a1);

var _add_next_index_null = Module["_add_next_index_null"] = a0 => (_add_next_index_null = Module["_add_next_index_null"] = wasmExports["add_next_index_null"])(a0);

var _add_next_index_str = Module["_add_next_index_str"] = (a0, a1) => (_add_next_index_str = Module["_add_next_index_str"] = wasmExports["add_next_index_str"])(a0, a1);

var __zend_new_array = Module["__zend_new_array"] = a0 => (__zend_new_array = Module["__zend_new_array"] = wasmExports["_zend_new_array"])(a0);

var _zend_hash_update = Module["_zend_hash_update"] = (a0, a1, a2) => (_zend_hash_update = Module["_zend_hash_update"] = wasmExports["zend_hash_update"])(a0, a1, a2);

var _php_pcre_replace = Module["_php_pcre_replace"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_pcre_replace = Module["_php_pcre_replace"] = wasmExports["php_pcre_replace"])(a0, a1, a2, a3, a4, a5, a6);

var _php_pcre_replace_impl = Module["_php_pcre_replace_impl"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_pcre_replace_impl = Module["_php_pcre_replace_impl"] = wasmExports["php_pcre_replace_impl"])(a0, a1, a2, a3, a4, a5, a6);

var _zend_try_assign_typed_ref_long = Module["_zend_try_assign_typed_ref_long"] = (a0, a1) => (_zend_try_assign_typed_ref_long = Module["_zend_try_assign_typed_ref_long"] = wasmExports["zend_try_assign_typed_ref_long"])(a0, a1);

var _zend_is_callable_ex = Module["_zend_is_callable_ex"] = (a0, a1, a2, a3, a4, a5) => (_zend_is_callable_ex = Module["_zend_is_callable_ex"] = wasmExports["zend_is_callable_ex"])(a0, a1, a2, a3, a4, a5);

var _zend_argument_type_error = Module["_zend_argument_type_error"] = (a0, a1, a2) => (_zend_argument_type_error = Module["_zend_argument_type_error"] = wasmExports["zend_argument_type_error"])(a0, a1, a2);

var _php_pcre_split_impl = Module["_php_pcre_split_impl"] = (a0, a1, a2, a3, a4) => (_php_pcre_split_impl = Module["_php_pcre_split_impl"] = wasmExports["php_pcre_split_impl"])(a0, a1, a2, a3, a4);

var _php_pcre_grep_impl = Module["_php_pcre_grep_impl"] = (a0, a1, a2, a3) => (_php_pcre_grep_impl = Module["_php_pcre_grep_impl"] = wasmExports["php_pcre_grep_impl"])(a0, a1, a2, a3);

var _zend_hash_index_update = Module["_zend_hash_index_update"] = (a0, a1, a2) => (_zend_hash_index_update = Module["_zend_hash_index_update"] = wasmExports["zend_hash_index_update"])(a0, a1, a2);

var _php_pcre_mctx = Module["_php_pcre_mctx"] = () => (_php_pcre_mctx = Module["_php_pcre_mctx"] = wasmExports["php_pcre_mctx"])();

var _php_pcre_gctx = Module["_php_pcre_gctx"] = () => (_php_pcre_gctx = Module["_php_pcre_gctx"] = wasmExports["php_pcre_gctx"])();

var _php_pcre_cctx = Module["_php_pcre_cctx"] = () => (_php_pcre_cctx = Module["_php_pcre_cctx"] = wasmExports["php_pcre_cctx"])();

var _php_pcre_pce_incref = Module["_php_pcre_pce_incref"] = a0 => (_php_pcre_pce_incref = Module["_php_pcre_pce_incref"] = wasmExports["php_pcre_pce_incref"])(a0);

var _php_pcre_pce_decref = Module["_php_pcre_pce_decref"] = a0 => (_php_pcre_pce_decref = Module["_php_pcre_pce_decref"] = wasmExports["php_pcre_pce_decref"])(a0);

var _php_pcre_pce_re = Module["_php_pcre_pce_re"] = a0 => (_php_pcre_pce_re = Module["_php_pcre_pce_re"] = wasmExports["php_pcre_pce_re"])(a0);

var _zend_hash_add_new = Module["_zend_hash_add_new"] = (a0, a1, a2) => (_zend_hash_add_new = Module["_zend_hash_add_new"] = wasmExports["zend_hash_add_new"])(a0, a1, a2);

var _zend_try_assign_typed_ref_arr = Module["_zend_try_assign_typed_ref_arr"] = (a0, a1) => (_zend_try_assign_typed_ref_arr = Module["_zend_try_assign_typed_ref_arr"] = wasmExports["zend_try_assign_typed_ref_arr"])(a0, a1);

var __is_numeric_string_ex = Module["__is_numeric_string_ex"] = (a0, a1, a2, a3, a4, a5, a6) => (__is_numeric_string_ex = Module["__is_numeric_string_ex"] = wasmExports["_is_numeric_string_ex"])(a0, a1, a2, a3, a4, a5, a6);

var _zend_new_pair = Module["_zend_new_pair"] = (a0, a1) => (_zend_new_pair = Module["_zend_new_pair"] = wasmExports["zend_new_pair"])(a0, a1);

var _zend_error_noreturn = Module["_zend_error_noreturn"] = (a0, a1, a2) => (_zend_error_noreturn = Module["_zend_error_noreturn"] = wasmExports["zend_error_noreturn"])(a0, a1, a2);

var _zend_hash_index_add_new = Module["_zend_hash_index_add_new"] = (a0, a1, a2) => (_zend_hash_index_add_new = Module["_zend_hash_index_add_new"] = wasmExports["zend_hash_index_add_new"])(a0, a1, a2);

var _zend_fcall_info_init = Module["_zend_fcall_info_init"] = (a0, a1, a2, a3, a4, a5) => (_zend_fcall_info_init = Module["_zend_fcall_info_init"] = wasmExports["zend_fcall_info_init"])(a0, a1, a2, a3, a4, a5);

var _zend_release_fcall_info_cache = Module["_zend_release_fcall_info_cache"] = a0 => (_zend_release_fcall_info_cache = Module["_zend_release_fcall_info_cache"] = wasmExports["zend_release_fcall_info_cache"])(a0);

var _zend_call_function = Module["_zend_call_function"] = (a0, a1) => (_zend_call_function = Module["_zend_call_function"] = wasmExports["zend_call_function"])(a0, a1);

var _zend_array_destroy = Module["_zend_array_destroy"] = a0 => (_zend_array_destroy = Module["_zend_array_destroy"] = wasmExports["zend_array_destroy"])(a0);

var __safe_malloc = Module["__safe_malloc"] = (a0, a1, a2) => (__safe_malloc = Module["__safe_malloc"] = wasmExports["_safe_malloc"])(a0, a1, a2);

var _OnUpdateLong = Module["_OnUpdateLong"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateLong = Module["_OnUpdateLong"] = wasmExports["OnUpdateLong"])(a0, a1, a2, a3, a4, a5);

var _zend_register_bool_constant = Module["_zend_register_bool_constant"] = (a0, a1, a2, a3, a4) => (_zend_register_bool_constant = Module["_zend_register_bool_constant"] = wasmExports["zend_register_bool_constant"])(a0, a1, a2, a3, a4);

var _php_hash_fetch_ops = Module["_php_hash_fetch_ops"] = a0 => (_php_hash_fetch_ops = Module["_php_hash_fetch_ops"] = wasmExports["php_hash_fetch_ops"])(a0);

var _php_hash_register_algo = Module["_php_hash_register_algo"] = (a0, a1) => (_php_hash_register_algo = Module["_php_hash_register_algo"] = wasmExports["php_hash_register_algo"])(a0, a1);

var _zend_str_tolower_dup = Module["_zend_str_tolower_dup"] = (a0, a1) => (_zend_str_tolower_dup = Module["_zend_str_tolower_dup"] = wasmExports["zend_str_tolower_dup"])(a0, a1);

var _php_hash_copy = Module["_php_hash_copy"] = (a0, a1, a2) => (_php_hash_copy = Module["_php_hash_copy"] = wasmExports["php_hash_copy"])(a0, a1, a2);

var _php_hash_serialize_spec = Module["_php_hash_serialize_spec"] = (a0, a1, a2) => (_php_hash_serialize_spec = Module["_php_hash_serialize_spec"] = wasmExports["php_hash_serialize_spec"])(a0, a1, a2);

var _php_hash_unserialize_spec = Module["_php_hash_unserialize_spec"] = (a0, a1, a2) => (_php_hash_unserialize_spec = Module["_php_hash_unserialize_spec"] = wasmExports["php_hash_unserialize_spec"])(a0, a1, a2);

var _zend_hash_index_find = Module["_zend_hash_index_find"] = (a0, a1) => (_zend_hash_index_find = Module["_zend_hash_index_find"] = wasmExports["zend_hash_index_find"])(a0, a1);

var _php_hash_serialize = Module["_php_hash_serialize"] = (a0, a1, a2) => (_php_hash_serialize = Module["_php_hash_serialize"] = wasmExports["php_hash_serialize"])(a0, a1, a2);

var _php_hash_unserialize = Module["_php_hash_unserialize"] = (a0, a1, a2) => (_php_hash_unserialize = Module["_php_hash_unserialize"] = wasmExports["php_hash_unserialize"])(a0, a1, a2);

var _zend_fetch_resource2_ex = Module["_zend_fetch_resource2_ex"] = (a0, a1, a2, a3) => (_zend_fetch_resource2_ex = Module["_zend_fetch_resource2_ex"] = wasmExports["zend_fetch_resource2_ex"])(a0, a1, a2, a3);

var _php_file_le_stream = Module["_php_file_le_stream"] = () => (_php_file_le_stream = Module["_php_file_le_stream"] = wasmExports["php_file_le_stream"])();

var _php_file_le_pstream = Module["_php_file_le_pstream"] = () => (_php_file_le_pstream = Module["_php_file_le_pstream"] = wasmExports["php_file_le_pstream"])();

var __php_stream_read = Module["__php_stream_read"] = (a0, a1, a2) => (__php_stream_read = Module["__php_stream_read"] = wasmExports["_php_stream_read"])(a0, a1, a2);

var _zend_fetch_resource_ex = Module["_zend_fetch_resource_ex"] = (a0, a1, a2) => (_zend_fetch_resource_ex = Module["_zend_fetch_resource_ex"] = wasmExports["zend_fetch_resource_ex"])(a0, a1, a2);

var _php_le_stream_context = Module["_php_le_stream_context"] = () => (_php_le_stream_context = Module["_php_le_stream_context"] = wasmExports["php_le_stream_context"])();

var _php_stream_context_alloc = Module["_php_stream_context_alloc"] = () => (_php_stream_context_alloc = Module["_php_stream_context_alloc"] = wasmExports["php_stream_context_alloc"])();

var __php_stream_open_wrapper_ex = Module["__php_stream_open_wrapper_ex"] = (a0, a1, a2, a3, a4) => (__php_stream_open_wrapper_ex = Module["__php_stream_open_wrapper_ex"] = wasmExports["_php_stream_open_wrapper_ex"])(a0, a1, a2, a3, a4);

var __php_stream_free = Module["__php_stream_free"] = (a0, a1) => (__php_stream_free = Module["__php_stream_free"] = wasmExports["_php_stream_free"])(a0, a1);

var _explicit_bzero = Module["_explicit_bzero"] = (a0, a1) => (_explicit_bzero = Module["_explicit_bzero"] = wasmExports["explicit_bzero"])(a0, a1);

var _zend_zval_value_name = Module["_zend_zval_value_name"] = a0 => (_zend_zval_value_name = Module["_zend_zval_value_name"] = wasmExports["zend_zval_value_name"])(a0);

var _php_safe_bcmp = Module["_php_safe_bcmp"] = (a0, a1) => (_php_safe_bcmp = Module["_php_safe_bcmp"] = wasmExports["php_safe_bcmp"])(a0, a1);

var _zend_throw_exception = Module["_zend_throw_exception"] = (a0, a1, a2) => (_zend_throw_exception = Module["_zend_throw_exception"] = wasmExports["zend_throw_exception"])(a0, a1, a2);

var _object_properties_load = Module["_object_properties_load"] = (a0, a1) => (_object_properties_load = Module["_object_properties_load"] = wasmExports["object_properties_load"])(a0, a1);

var _zend_string_tolower_ex = Module["_zend_string_tolower_ex"] = (a0, a1) => (_zend_string_tolower_ex = Module["_zend_string_tolower_ex"] = wasmExports["zend_string_tolower_ex"])(a0, a1);

var _zend_add_attribute = Module["_zend_add_attribute"] = (a0, a1, a2, a3, a4, a5) => (_zend_add_attribute = Module["_zend_add_attribute"] = wasmExports["zend_add_attribute"])(a0, a1, a2, a3, a4, a5);

var _PHP_MD5InitArgs = Module["_PHP_MD5InitArgs"] = (a0, a1) => (_PHP_MD5InitArgs = Module["_PHP_MD5InitArgs"] = wasmExports["PHP_MD5InitArgs"])(a0, a1);

var _PHP_MD5Update = Module["_PHP_MD5Update"] = (a0, a1, a2) => (_PHP_MD5Update = Module["_PHP_MD5Update"] = wasmExports["PHP_MD5Update"])(a0, a1, a2);

var _PHP_MD5Final = Module["_PHP_MD5Final"] = (a0, a1) => (_PHP_MD5Final = Module["_PHP_MD5Final"] = wasmExports["PHP_MD5Final"])(a0, a1);

var _PHP_MD4InitArgs = Module["_PHP_MD4InitArgs"] = (a0, a1) => (_PHP_MD4InitArgs = Module["_PHP_MD4InitArgs"] = wasmExports["PHP_MD4InitArgs"])(a0, a1);

var _PHP_MD4Update = Module["_PHP_MD4Update"] = (a0, a1, a2) => (_PHP_MD4Update = Module["_PHP_MD4Update"] = wasmExports["PHP_MD4Update"])(a0, a1, a2);

var _PHP_MD4Final = Module["_PHP_MD4Final"] = (a0, a1) => (_PHP_MD4Final = Module["_PHP_MD4Final"] = wasmExports["PHP_MD4Final"])(a0, a1);

var _PHP_MD2InitArgs = Module["_PHP_MD2InitArgs"] = (a0, a1) => (_PHP_MD2InitArgs = Module["_PHP_MD2InitArgs"] = wasmExports["PHP_MD2InitArgs"])(a0, a1);

var _PHP_MD2Update = Module["_PHP_MD2Update"] = (a0, a1, a2) => (_PHP_MD2Update = Module["_PHP_MD2Update"] = wasmExports["PHP_MD2Update"])(a0, a1, a2);

var _PHP_MD2Final = Module["_PHP_MD2Final"] = (a0, a1) => (_PHP_MD2Final = Module["_PHP_MD2Final"] = wasmExports["PHP_MD2Final"])(a0, a1);

var _PHP_SHA1InitArgs = Module["_PHP_SHA1InitArgs"] = (a0, a1) => (_PHP_SHA1InitArgs = Module["_PHP_SHA1InitArgs"] = wasmExports["PHP_SHA1InitArgs"])(a0, a1);

var _PHP_SHA1Update = Module["_PHP_SHA1Update"] = (a0, a1, a2) => (_PHP_SHA1Update = Module["_PHP_SHA1Update"] = wasmExports["PHP_SHA1Update"])(a0, a1, a2);

var _PHP_SHA1Final = Module["_PHP_SHA1Final"] = (a0, a1) => (_PHP_SHA1Final = Module["_PHP_SHA1Final"] = wasmExports["PHP_SHA1Final"])(a0, a1);

var _PHP_SHA256InitArgs = Module["_PHP_SHA256InitArgs"] = (a0, a1) => (_PHP_SHA256InitArgs = Module["_PHP_SHA256InitArgs"] = wasmExports["PHP_SHA256InitArgs"])(a0, a1);

var _PHP_SHA256Update = Module["_PHP_SHA256Update"] = (a0, a1, a2) => (_PHP_SHA256Update = Module["_PHP_SHA256Update"] = wasmExports["PHP_SHA256Update"])(a0, a1, a2);

var _PHP_SHA256Final = Module["_PHP_SHA256Final"] = (a0, a1) => (_PHP_SHA256Final = Module["_PHP_SHA256Final"] = wasmExports["PHP_SHA256Final"])(a0, a1);

var _PHP_SHA224InitArgs = Module["_PHP_SHA224InitArgs"] = (a0, a1) => (_PHP_SHA224InitArgs = Module["_PHP_SHA224InitArgs"] = wasmExports["PHP_SHA224InitArgs"])(a0, a1);

var _PHP_SHA224Update = Module["_PHP_SHA224Update"] = (a0, a1, a2) => (_PHP_SHA224Update = Module["_PHP_SHA224Update"] = wasmExports["PHP_SHA224Update"])(a0, a1, a2);

var _PHP_SHA224Final = Module["_PHP_SHA224Final"] = (a0, a1) => (_PHP_SHA224Final = Module["_PHP_SHA224Final"] = wasmExports["PHP_SHA224Final"])(a0, a1);

var _PHP_SHA384InitArgs = Module["_PHP_SHA384InitArgs"] = (a0, a1) => (_PHP_SHA384InitArgs = Module["_PHP_SHA384InitArgs"] = wasmExports["PHP_SHA384InitArgs"])(a0, a1);

var _PHP_SHA384Update = Module["_PHP_SHA384Update"] = (a0, a1, a2) => (_PHP_SHA384Update = Module["_PHP_SHA384Update"] = wasmExports["PHP_SHA384Update"])(a0, a1, a2);

var _PHP_SHA384Final = Module["_PHP_SHA384Final"] = (a0, a1) => (_PHP_SHA384Final = Module["_PHP_SHA384Final"] = wasmExports["PHP_SHA384Final"])(a0, a1);

var _PHP_SHA512InitArgs = Module["_PHP_SHA512InitArgs"] = (a0, a1) => (_PHP_SHA512InitArgs = Module["_PHP_SHA512InitArgs"] = wasmExports["PHP_SHA512InitArgs"])(a0, a1);

var _PHP_SHA512_256InitArgs = Module["_PHP_SHA512_256InitArgs"] = (a0, a1) => (_PHP_SHA512_256InitArgs = Module["_PHP_SHA512_256InitArgs"] = wasmExports["PHP_SHA512_256InitArgs"])(a0, a1);

var _PHP_SHA512_224InitArgs = Module["_PHP_SHA512_224InitArgs"] = (a0, a1) => (_PHP_SHA512_224InitArgs = Module["_PHP_SHA512_224InitArgs"] = wasmExports["PHP_SHA512_224InitArgs"])(a0, a1);

var _PHP_SHA512Update = Module["_PHP_SHA512Update"] = (a0, a1, a2) => (_PHP_SHA512Update = Module["_PHP_SHA512Update"] = wasmExports["PHP_SHA512Update"])(a0, a1, a2);

var _PHP_SHA512Final = Module["_PHP_SHA512Final"] = (a0, a1) => (_PHP_SHA512Final = Module["_PHP_SHA512Final"] = wasmExports["PHP_SHA512Final"])(a0, a1);

var _PHP_SHA512_256Final = Module["_PHP_SHA512_256Final"] = (a0, a1) => (_PHP_SHA512_256Final = Module["_PHP_SHA512_256Final"] = wasmExports["PHP_SHA512_256Final"])(a0, a1);

var _PHP_SHA512_224Final = Module["_PHP_SHA512_224Final"] = (a0, a1) => (_PHP_SHA512_224Final = Module["_PHP_SHA512_224Final"] = wasmExports["PHP_SHA512_224Final"])(a0, a1);

var _PHP_RIPEMD128Init = Module["_PHP_RIPEMD128Init"] = (a0, a1) => (_PHP_RIPEMD128Init = Module["_PHP_RIPEMD128Init"] = wasmExports["PHP_RIPEMD128Init"])(a0, a1);

var _PHP_RIPEMD128Update = Module["_PHP_RIPEMD128Update"] = (a0, a1, a2) => (_PHP_RIPEMD128Update = Module["_PHP_RIPEMD128Update"] = wasmExports["PHP_RIPEMD128Update"])(a0, a1, a2);

var _PHP_RIPEMD128Final = Module["_PHP_RIPEMD128Final"] = (a0, a1) => (_PHP_RIPEMD128Final = Module["_PHP_RIPEMD128Final"] = wasmExports["PHP_RIPEMD128Final"])(a0, a1);

var _PHP_RIPEMD160Init = Module["_PHP_RIPEMD160Init"] = (a0, a1) => (_PHP_RIPEMD160Init = Module["_PHP_RIPEMD160Init"] = wasmExports["PHP_RIPEMD160Init"])(a0, a1);

var _PHP_RIPEMD160Update = Module["_PHP_RIPEMD160Update"] = (a0, a1, a2) => (_PHP_RIPEMD160Update = Module["_PHP_RIPEMD160Update"] = wasmExports["PHP_RIPEMD160Update"])(a0, a1, a2);

var _PHP_RIPEMD160Final = Module["_PHP_RIPEMD160Final"] = (a0, a1) => (_PHP_RIPEMD160Final = Module["_PHP_RIPEMD160Final"] = wasmExports["PHP_RIPEMD160Final"])(a0, a1);

var _PHP_RIPEMD256Init = Module["_PHP_RIPEMD256Init"] = (a0, a1) => (_PHP_RIPEMD256Init = Module["_PHP_RIPEMD256Init"] = wasmExports["PHP_RIPEMD256Init"])(a0, a1);

var _PHP_RIPEMD256Update = Module["_PHP_RIPEMD256Update"] = (a0, a1, a2) => (_PHP_RIPEMD256Update = Module["_PHP_RIPEMD256Update"] = wasmExports["PHP_RIPEMD256Update"])(a0, a1, a2);

var _PHP_RIPEMD256Final = Module["_PHP_RIPEMD256Final"] = (a0, a1) => (_PHP_RIPEMD256Final = Module["_PHP_RIPEMD256Final"] = wasmExports["PHP_RIPEMD256Final"])(a0, a1);

var _PHP_RIPEMD320Init = Module["_PHP_RIPEMD320Init"] = (a0, a1) => (_PHP_RIPEMD320Init = Module["_PHP_RIPEMD320Init"] = wasmExports["PHP_RIPEMD320Init"])(a0, a1);

var _PHP_RIPEMD320Update = Module["_PHP_RIPEMD320Update"] = (a0, a1, a2) => (_PHP_RIPEMD320Update = Module["_PHP_RIPEMD320Update"] = wasmExports["PHP_RIPEMD320Update"])(a0, a1, a2);

var _PHP_RIPEMD320Final = Module["_PHP_RIPEMD320Final"] = (a0, a1) => (_PHP_RIPEMD320Final = Module["_PHP_RIPEMD320Final"] = wasmExports["PHP_RIPEMD320Final"])(a0, a1);

var _PHP_3HAVAL128Init = Module["_PHP_3HAVAL128Init"] = (a0, a1) => (_PHP_3HAVAL128Init = Module["_PHP_3HAVAL128Init"] = wasmExports["PHP_3HAVAL128Init"])(a0, a1);

var _PHP_HAVALUpdate = Module["_PHP_HAVALUpdate"] = (a0, a1, a2) => (_PHP_HAVALUpdate = Module["_PHP_HAVALUpdate"] = wasmExports["PHP_HAVALUpdate"])(a0, a1, a2);

var _PHP_HAVAL128Final = Module["_PHP_HAVAL128Final"] = (a0, a1) => (_PHP_HAVAL128Final = Module["_PHP_HAVAL128Final"] = wasmExports["PHP_HAVAL128Final"])(a0, a1);

var _PHP_3HAVAL160Init = Module["_PHP_3HAVAL160Init"] = (a0, a1) => (_PHP_3HAVAL160Init = Module["_PHP_3HAVAL160Init"] = wasmExports["PHP_3HAVAL160Init"])(a0, a1);

var _PHP_HAVAL160Final = Module["_PHP_HAVAL160Final"] = (a0, a1) => (_PHP_HAVAL160Final = Module["_PHP_HAVAL160Final"] = wasmExports["PHP_HAVAL160Final"])(a0, a1);

var _PHP_3HAVAL192Init = Module["_PHP_3HAVAL192Init"] = (a0, a1) => (_PHP_3HAVAL192Init = Module["_PHP_3HAVAL192Init"] = wasmExports["PHP_3HAVAL192Init"])(a0, a1);

var _PHP_HAVAL192Final = Module["_PHP_HAVAL192Final"] = (a0, a1) => (_PHP_HAVAL192Final = Module["_PHP_HAVAL192Final"] = wasmExports["PHP_HAVAL192Final"])(a0, a1);

var _PHP_3HAVAL224Init = Module["_PHP_3HAVAL224Init"] = (a0, a1) => (_PHP_3HAVAL224Init = Module["_PHP_3HAVAL224Init"] = wasmExports["PHP_3HAVAL224Init"])(a0, a1);

var _PHP_HAVAL224Final = Module["_PHP_HAVAL224Final"] = (a0, a1) => (_PHP_HAVAL224Final = Module["_PHP_HAVAL224Final"] = wasmExports["PHP_HAVAL224Final"])(a0, a1);

var _PHP_3HAVAL256Init = Module["_PHP_3HAVAL256Init"] = (a0, a1) => (_PHP_3HAVAL256Init = Module["_PHP_3HAVAL256Init"] = wasmExports["PHP_3HAVAL256Init"])(a0, a1);

var _PHP_HAVAL256Final = Module["_PHP_HAVAL256Final"] = (a0, a1) => (_PHP_HAVAL256Final = Module["_PHP_HAVAL256Final"] = wasmExports["PHP_HAVAL256Final"])(a0, a1);

var _PHP_4HAVAL128Init = Module["_PHP_4HAVAL128Init"] = (a0, a1) => (_PHP_4HAVAL128Init = Module["_PHP_4HAVAL128Init"] = wasmExports["PHP_4HAVAL128Init"])(a0, a1);

var _PHP_4HAVAL160Init = Module["_PHP_4HAVAL160Init"] = (a0, a1) => (_PHP_4HAVAL160Init = Module["_PHP_4HAVAL160Init"] = wasmExports["PHP_4HAVAL160Init"])(a0, a1);

var _PHP_4HAVAL192Init = Module["_PHP_4HAVAL192Init"] = (a0, a1) => (_PHP_4HAVAL192Init = Module["_PHP_4HAVAL192Init"] = wasmExports["PHP_4HAVAL192Init"])(a0, a1);

var _PHP_4HAVAL224Init = Module["_PHP_4HAVAL224Init"] = (a0, a1) => (_PHP_4HAVAL224Init = Module["_PHP_4HAVAL224Init"] = wasmExports["PHP_4HAVAL224Init"])(a0, a1);

var _PHP_4HAVAL256Init = Module["_PHP_4HAVAL256Init"] = (a0, a1) => (_PHP_4HAVAL256Init = Module["_PHP_4HAVAL256Init"] = wasmExports["PHP_4HAVAL256Init"])(a0, a1);

var _PHP_5HAVAL128Init = Module["_PHP_5HAVAL128Init"] = (a0, a1) => (_PHP_5HAVAL128Init = Module["_PHP_5HAVAL128Init"] = wasmExports["PHP_5HAVAL128Init"])(a0, a1);

var _PHP_5HAVAL160Init = Module["_PHP_5HAVAL160Init"] = (a0, a1) => (_PHP_5HAVAL160Init = Module["_PHP_5HAVAL160Init"] = wasmExports["PHP_5HAVAL160Init"])(a0, a1);

var _PHP_5HAVAL192Init = Module["_PHP_5HAVAL192Init"] = (a0, a1) => (_PHP_5HAVAL192Init = Module["_PHP_5HAVAL192Init"] = wasmExports["PHP_5HAVAL192Init"])(a0, a1);

var _PHP_5HAVAL224Init = Module["_PHP_5HAVAL224Init"] = (a0, a1) => (_PHP_5HAVAL224Init = Module["_PHP_5HAVAL224Init"] = wasmExports["PHP_5HAVAL224Init"])(a0, a1);

var _PHP_5HAVAL256Init = Module["_PHP_5HAVAL256Init"] = (a0, a1) => (_PHP_5HAVAL256Init = Module["_PHP_5HAVAL256Init"] = wasmExports["PHP_5HAVAL256Init"])(a0, a1);

var _PHP_3TIGERInit = Module["_PHP_3TIGERInit"] = (a0, a1) => (_PHP_3TIGERInit = Module["_PHP_3TIGERInit"] = wasmExports["PHP_3TIGERInit"])(a0, a1);

var _PHP_4TIGERInit = Module["_PHP_4TIGERInit"] = (a0, a1) => (_PHP_4TIGERInit = Module["_PHP_4TIGERInit"] = wasmExports["PHP_4TIGERInit"])(a0, a1);

var _PHP_TIGERUpdate = Module["_PHP_TIGERUpdate"] = (a0, a1, a2) => (_PHP_TIGERUpdate = Module["_PHP_TIGERUpdate"] = wasmExports["PHP_TIGERUpdate"])(a0, a1, a2);

var _PHP_TIGER128Final = Module["_PHP_TIGER128Final"] = (a0, a1) => (_PHP_TIGER128Final = Module["_PHP_TIGER128Final"] = wasmExports["PHP_TIGER128Final"])(a0, a1);

var _PHP_TIGER160Final = Module["_PHP_TIGER160Final"] = (a0, a1) => (_PHP_TIGER160Final = Module["_PHP_TIGER160Final"] = wasmExports["PHP_TIGER160Final"])(a0, a1);

var _PHP_TIGER192Final = Module["_PHP_TIGER192Final"] = (a0, a1) => (_PHP_TIGER192Final = Module["_PHP_TIGER192Final"] = wasmExports["PHP_TIGER192Final"])(a0, a1);

var _PHP_GOSTInit = Module["_PHP_GOSTInit"] = (a0, a1) => (_PHP_GOSTInit = Module["_PHP_GOSTInit"] = wasmExports["PHP_GOSTInit"])(a0, a1);

var _PHP_GOSTInitCrypto = Module["_PHP_GOSTInitCrypto"] = (a0, a1) => (_PHP_GOSTInitCrypto = Module["_PHP_GOSTInitCrypto"] = wasmExports["PHP_GOSTInitCrypto"])(a0, a1);

var _PHP_GOSTUpdate = Module["_PHP_GOSTUpdate"] = (a0, a1, a2) => (_PHP_GOSTUpdate = Module["_PHP_GOSTUpdate"] = wasmExports["PHP_GOSTUpdate"])(a0, a1, a2);

var _PHP_GOSTFinal = Module["_PHP_GOSTFinal"] = (a0, a1) => (_PHP_GOSTFinal = Module["_PHP_GOSTFinal"] = wasmExports["PHP_GOSTFinal"])(a0, a1);

var _PHP_SNEFRUInit = Module["_PHP_SNEFRUInit"] = (a0, a1) => (_PHP_SNEFRUInit = Module["_PHP_SNEFRUInit"] = wasmExports["PHP_SNEFRUInit"])(a0, a1);

var _PHP_SNEFRUUpdate = Module["_PHP_SNEFRUUpdate"] = (a0, a1, a2) => (_PHP_SNEFRUUpdate = Module["_PHP_SNEFRUUpdate"] = wasmExports["PHP_SNEFRUUpdate"])(a0, a1, a2);

var _PHP_SNEFRUFinal = Module["_PHP_SNEFRUFinal"] = (a0, a1) => (_PHP_SNEFRUFinal = Module["_PHP_SNEFRUFinal"] = wasmExports["PHP_SNEFRUFinal"])(a0, a1);

var _PHP_WHIRLPOOLInit = Module["_PHP_WHIRLPOOLInit"] = (a0, a1) => (_PHP_WHIRLPOOLInit = Module["_PHP_WHIRLPOOLInit"] = wasmExports["PHP_WHIRLPOOLInit"])(a0, a1);

var _PHP_WHIRLPOOLUpdate = Module["_PHP_WHIRLPOOLUpdate"] = (a0, a1, a2) => (_PHP_WHIRLPOOLUpdate = Module["_PHP_WHIRLPOOLUpdate"] = wasmExports["PHP_WHIRLPOOLUpdate"])(a0, a1, a2);

var _PHP_WHIRLPOOLFinal = Module["_PHP_WHIRLPOOLFinal"] = (a0, a1) => (_PHP_WHIRLPOOLFinal = Module["_PHP_WHIRLPOOLFinal"] = wasmExports["PHP_WHIRLPOOLFinal"])(a0, a1);

var _PHP_ADLER32Init = Module["_PHP_ADLER32Init"] = (a0, a1) => (_PHP_ADLER32Init = Module["_PHP_ADLER32Init"] = wasmExports["PHP_ADLER32Init"])(a0, a1);

var _PHP_ADLER32Update = Module["_PHP_ADLER32Update"] = (a0, a1, a2) => (_PHP_ADLER32Update = Module["_PHP_ADLER32Update"] = wasmExports["PHP_ADLER32Update"])(a0, a1, a2);

var _PHP_ADLER32Final = Module["_PHP_ADLER32Final"] = (a0, a1) => (_PHP_ADLER32Final = Module["_PHP_ADLER32Final"] = wasmExports["PHP_ADLER32Final"])(a0, a1);

var _PHP_ADLER32Copy = Module["_PHP_ADLER32Copy"] = (a0, a1, a2) => (_PHP_ADLER32Copy = Module["_PHP_ADLER32Copy"] = wasmExports["PHP_ADLER32Copy"])(a0, a1, a2);

var _PHP_CRC32Init = Module["_PHP_CRC32Init"] = (a0, a1) => (_PHP_CRC32Init = Module["_PHP_CRC32Init"] = wasmExports["PHP_CRC32Init"])(a0, a1);

var _PHP_CRC32Update = Module["_PHP_CRC32Update"] = (a0, a1, a2) => (_PHP_CRC32Update = Module["_PHP_CRC32Update"] = wasmExports["PHP_CRC32Update"])(a0, a1, a2);

var _PHP_CRC32BUpdate = Module["_PHP_CRC32BUpdate"] = (a0, a1, a2) => (_PHP_CRC32BUpdate = Module["_PHP_CRC32BUpdate"] = wasmExports["PHP_CRC32BUpdate"])(a0, a1, a2);

var _PHP_CRC32CUpdate = Module["_PHP_CRC32CUpdate"] = (a0, a1, a2) => (_PHP_CRC32CUpdate = Module["_PHP_CRC32CUpdate"] = wasmExports["PHP_CRC32CUpdate"])(a0, a1, a2);

var _PHP_CRC32LEFinal = Module["_PHP_CRC32LEFinal"] = (a0, a1) => (_PHP_CRC32LEFinal = Module["_PHP_CRC32LEFinal"] = wasmExports["PHP_CRC32LEFinal"])(a0, a1);

var _PHP_CRC32BEFinal = Module["_PHP_CRC32BEFinal"] = (a0, a1) => (_PHP_CRC32BEFinal = Module["_PHP_CRC32BEFinal"] = wasmExports["PHP_CRC32BEFinal"])(a0, a1);

var _PHP_CRC32Copy = Module["_PHP_CRC32Copy"] = (a0, a1, a2) => (_PHP_CRC32Copy = Module["_PHP_CRC32Copy"] = wasmExports["PHP_CRC32Copy"])(a0, a1, a2);

var _PHP_FNV132Init = Module["_PHP_FNV132Init"] = (a0, a1) => (_PHP_FNV132Init = Module["_PHP_FNV132Init"] = wasmExports["PHP_FNV132Init"])(a0, a1);

var _PHP_FNV132Update = Module["_PHP_FNV132Update"] = (a0, a1, a2) => (_PHP_FNV132Update = Module["_PHP_FNV132Update"] = wasmExports["PHP_FNV132Update"])(a0, a1, a2);

var _PHP_FNV132Final = Module["_PHP_FNV132Final"] = (a0, a1) => (_PHP_FNV132Final = Module["_PHP_FNV132Final"] = wasmExports["PHP_FNV132Final"])(a0, a1);

var _PHP_FNV1a32Update = Module["_PHP_FNV1a32Update"] = (a0, a1, a2) => (_PHP_FNV1a32Update = Module["_PHP_FNV1a32Update"] = wasmExports["PHP_FNV1a32Update"])(a0, a1, a2);

var _PHP_FNV164Init = Module["_PHP_FNV164Init"] = (a0, a1) => (_PHP_FNV164Init = Module["_PHP_FNV164Init"] = wasmExports["PHP_FNV164Init"])(a0, a1);

var _PHP_FNV164Update = Module["_PHP_FNV164Update"] = (a0, a1, a2) => (_PHP_FNV164Update = Module["_PHP_FNV164Update"] = wasmExports["PHP_FNV164Update"])(a0, a1, a2);

var _PHP_FNV164Final = Module["_PHP_FNV164Final"] = (a0, a1) => (_PHP_FNV164Final = Module["_PHP_FNV164Final"] = wasmExports["PHP_FNV164Final"])(a0, a1);

var _PHP_FNV1a64Update = Module["_PHP_FNV1a64Update"] = (a0, a1, a2) => (_PHP_FNV1a64Update = Module["_PHP_FNV1a64Update"] = wasmExports["PHP_FNV1a64Update"])(a0, a1, a2);

var _PHP_JOAATInit = Module["_PHP_JOAATInit"] = (a0, a1) => (_PHP_JOAATInit = Module["_PHP_JOAATInit"] = wasmExports["PHP_JOAATInit"])(a0, a1);

var _PHP_JOAATUpdate = Module["_PHP_JOAATUpdate"] = (a0, a1, a2) => (_PHP_JOAATUpdate = Module["_PHP_JOAATUpdate"] = wasmExports["PHP_JOAATUpdate"])(a0, a1, a2);

var _PHP_JOAATFinal = Module["_PHP_JOAATFinal"] = (a0, a1) => (_PHP_JOAATFinal = Module["_PHP_JOAATFinal"] = wasmExports["PHP_JOAATFinal"])(a0, a1);

var _PHP_SHA3224Init = Module["_PHP_SHA3224Init"] = (a0, a1) => (_PHP_SHA3224Init = Module["_PHP_SHA3224Init"] = wasmExports["PHP_SHA3224Init"])(a0, a1);

var _PHP_SHA3224Update = Module["_PHP_SHA3224Update"] = (a0, a1, a2) => (_PHP_SHA3224Update = Module["_PHP_SHA3224Update"] = wasmExports["PHP_SHA3224Update"])(a0, a1, a2);

var _PHP_SHA3256Init = Module["_PHP_SHA3256Init"] = (a0, a1) => (_PHP_SHA3256Init = Module["_PHP_SHA3256Init"] = wasmExports["PHP_SHA3256Init"])(a0, a1);

var _PHP_SHA3256Update = Module["_PHP_SHA3256Update"] = (a0, a1, a2) => (_PHP_SHA3256Update = Module["_PHP_SHA3256Update"] = wasmExports["PHP_SHA3256Update"])(a0, a1, a2);

var _PHP_SHA3384Init = Module["_PHP_SHA3384Init"] = (a0, a1) => (_PHP_SHA3384Init = Module["_PHP_SHA3384Init"] = wasmExports["PHP_SHA3384Init"])(a0, a1);

var _PHP_SHA3384Update = Module["_PHP_SHA3384Update"] = (a0, a1, a2) => (_PHP_SHA3384Update = Module["_PHP_SHA3384Update"] = wasmExports["PHP_SHA3384Update"])(a0, a1, a2);

var _PHP_SHA3512Init = Module["_PHP_SHA3512Init"] = (a0, a1) => (_PHP_SHA3512Init = Module["_PHP_SHA3512Init"] = wasmExports["PHP_SHA3512Init"])(a0, a1);

var _PHP_SHA3512Update = Module["_PHP_SHA3512Update"] = (a0, a1, a2) => (_PHP_SHA3512Update = Module["_PHP_SHA3512Update"] = wasmExports["PHP_SHA3512Update"])(a0, a1, a2);

var _PHP_MURMUR3AInit = Module["_PHP_MURMUR3AInit"] = (a0, a1) => (_PHP_MURMUR3AInit = Module["_PHP_MURMUR3AInit"] = wasmExports["PHP_MURMUR3AInit"])(a0, a1);

var _PHP_MURMUR3AUpdate = Module["_PHP_MURMUR3AUpdate"] = (a0, a1, a2) => (_PHP_MURMUR3AUpdate = Module["_PHP_MURMUR3AUpdate"] = wasmExports["PHP_MURMUR3AUpdate"])(a0, a1, a2);

var _PHP_MURMUR3AFinal = Module["_PHP_MURMUR3AFinal"] = (a0, a1) => (_PHP_MURMUR3AFinal = Module["_PHP_MURMUR3AFinal"] = wasmExports["PHP_MURMUR3AFinal"])(a0, a1);

var _PHP_MURMUR3ACopy = Module["_PHP_MURMUR3ACopy"] = (a0, a1, a2) => (_PHP_MURMUR3ACopy = Module["_PHP_MURMUR3ACopy"] = wasmExports["PHP_MURMUR3ACopy"])(a0, a1, a2);

var _PHP_MURMUR3CInit = Module["_PHP_MURMUR3CInit"] = (a0, a1) => (_PHP_MURMUR3CInit = Module["_PHP_MURMUR3CInit"] = wasmExports["PHP_MURMUR3CInit"])(a0, a1);

var _PHP_MURMUR3CUpdate = Module["_PHP_MURMUR3CUpdate"] = (a0, a1, a2) => (_PHP_MURMUR3CUpdate = Module["_PHP_MURMUR3CUpdate"] = wasmExports["PHP_MURMUR3CUpdate"])(a0, a1, a2);

var _PHP_MURMUR3CFinal = Module["_PHP_MURMUR3CFinal"] = (a0, a1) => (_PHP_MURMUR3CFinal = Module["_PHP_MURMUR3CFinal"] = wasmExports["PHP_MURMUR3CFinal"])(a0, a1);

var _PHP_MURMUR3CCopy = Module["_PHP_MURMUR3CCopy"] = (a0, a1, a2) => (_PHP_MURMUR3CCopy = Module["_PHP_MURMUR3CCopy"] = wasmExports["PHP_MURMUR3CCopy"])(a0, a1, a2);

var _PHP_MURMUR3FInit = Module["_PHP_MURMUR3FInit"] = (a0, a1) => (_PHP_MURMUR3FInit = Module["_PHP_MURMUR3FInit"] = wasmExports["PHP_MURMUR3FInit"])(a0, a1);

var _PHP_MURMUR3FUpdate = Module["_PHP_MURMUR3FUpdate"] = (a0, a1, a2) => (_PHP_MURMUR3FUpdate = Module["_PHP_MURMUR3FUpdate"] = wasmExports["PHP_MURMUR3FUpdate"])(a0, a1, a2);

var _PHP_MURMUR3FFinal = Module["_PHP_MURMUR3FFinal"] = (a0, a1) => (_PHP_MURMUR3FFinal = Module["_PHP_MURMUR3FFinal"] = wasmExports["PHP_MURMUR3FFinal"])(a0, a1);

var _PHP_MURMUR3FCopy = Module["_PHP_MURMUR3FCopy"] = (a0, a1, a2) => (_PHP_MURMUR3FCopy = Module["_PHP_MURMUR3FCopy"] = wasmExports["PHP_MURMUR3FCopy"])(a0, a1, a2);

var _PHP_XXH32Init = Module["_PHP_XXH32Init"] = (a0, a1) => (_PHP_XXH32Init = Module["_PHP_XXH32Init"] = wasmExports["PHP_XXH32Init"])(a0, a1);

var _PHP_XXH32Update = Module["_PHP_XXH32Update"] = (a0, a1, a2) => (_PHP_XXH32Update = Module["_PHP_XXH32Update"] = wasmExports["PHP_XXH32Update"])(a0, a1, a2);

var _PHP_XXH32Final = Module["_PHP_XXH32Final"] = (a0, a1) => (_PHP_XXH32Final = Module["_PHP_XXH32Final"] = wasmExports["PHP_XXH32Final"])(a0, a1);

var _PHP_XXH32Copy = Module["_PHP_XXH32Copy"] = (a0, a1, a2) => (_PHP_XXH32Copy = Module["_PHP_XXH32Copy"] = wasmExports["PHP_XXH32Copy"])(a0, a1, a2);

var _PHP_XXH64Init = Module["_PHP_XXH64Init"] = (a0, a1) => (_PHP_XXH64Init = Module["_PHP_XXH64Init"] = wasmExports["PHP_XXH64Init"])(a0, a1);

var _PHP_XXH64Update = Module["_PHP_XXH64Update"] = (a0, a1, a2) => (_PHP_XXH64Update = Module["_PHP_XXH64Update"] = wasmExports["PHP_XXH64Update"])(a0, a1, a2);

var _PHP_XXH64Final = Module["_PHP_XXH64Final"] = (a0, a1) => (_PHP_XXH64Final = Module["_PHP_XXH64Final"] = wasmExports["PHP_XXH64Final"])(a0, a1);

var _PHP_XXH64Copy = Module["_PHP_XXH64Copy"] = (a0, a1, a2) => (_PHP_XXH64Copy = Module["_PHP_XXH64Copy"] = wasmExports["PHP_XXH64Copy"])(a0, a1, a2);

var _PHP_XXH3_64_Init = Module["_PHP_XXH3_64_Init"] = (a0, a1) => (_PHP_XXH3_64_Init = Module["_PHP_XXH3_64_Init"] = wasmExports["PHP_XXH3_64_Init"])(a0, a1);

var _PHP_XXH3_64_Update = Module["_PHP_XXH3_64_Update"] = (a0, a1, a2) => (_PHP_XXH3_64_Update = Module["_PHP_XXH3_64_Update"] = wasmExports["PHP_XXH3_64_Update"])(a0, a1, a2);

var _PHP_XXH3_64_Final = Module["_PHP_XXH3_64_Final"] = (a0, a1) => (_PHP_XXH3_64_Final = Module["_PHP_XXH3_64_Final"] = wasmExports["PHP_XXH3_64_Final"])(a0, a1);

var _PHP_XXH3_64_Copy = Module["_PHP_XXH3_64_Copy"] = (a0, a1, a2) => (_PHP_XXH3_64_Copy = Module["_PHP_XXH3_64_Copy"] = wasmExports["PHP_XXH3_64_Copy"])(a0, a1, a2);

var _PHP_XXH3_128_Init = Module["_PHP_XXH3_128_Init"] = (a0, a1) => (_PHP_XXH3_128_Init = Module["_PHP_XXH3_128_Init"] = wasmExports["PHP_XXH3_128_Init"])(a0, a1);

var _PHP_XXH3_128_Update = Module["_PHP_XXH3_128_Update"] = (a0, a1, a2) => (_PHP_XXH3_128_Update = Module["_PHP_XXH3_128_Update"] = wasmExports["PHP_XXH3_128_Update"])(a0, a1, a2);

var _PHP_XXH3_128_Final = Module["_PHP_XXH3_128_Final"] = (a0, a1) => (_PHP_XXH3_128_Final = Module["_PHP_XXH3_128_Final"] = wasmExports["PHP_XXH3_128_Final"])(a0, a1);

var _PHP_XXH3_128_Copy = Module["_PHP_XXH3_128_Copy"] = (a0, a1, a2) => (_PHP_XXH3_128_Copy = Module["_PHP_XXH3_128_Copy"] = wasmExports["PHP_XXH3_128_Copy"])(a0, a1, a2);

var __try_convert_to_string = Module["__try_convert_to_string"] = a0 => (__try_convert_to_string = Module["__try_convert_to_string"] = wasmExports["_try_convert_to_string"])(a0);

var _php_json_encode_string = Module["_php_json_encode_string"] = (a0, a1, a2) => (_php_json_encode_string = Module["_php_json_encode_string"] = wasmExports["php_json_encode_string"])(a0, a1, a2);

var _php_json_encode_ex = Module["_php_json_encode_ex"] = (a0, a1, a2, a3) => (_php_json_encode_ex = Module["_php_json_encode_ex"] = wasmExports["php_json_encode_ex"])(a0, a1, a2, a3);

var _php_json_encode = Module["_php_json_encode"] = (a0, a1, a2) => (_php_json_encode = Module["_php_json_encode"] = wasmExports["php_json_encode"])(a0, a1, a2);

var _php_json_decode_ex = Module["_php_json_decode_ex"] = (a0, a1, a2, a3, a4) => (_php_json_decode_ex = Module["_php_json_decode_ex"] = wasmExports["php_json_decode_ex"])(a0, a1, a2, a3, a4);

var _php_json_parser_init = Module["_php_json_parser_init"] = (a0, a1, a2, a3, a4, a5) => (_php_json_parser_init = Module["_php_json_parser_init"] = wasmExports["php_json_parser_init"])(a0, a1, a2, a3, a4, a5);

var _php_json_parser_error_code = Module["_php_json_parser_error_code"] = a0 => (_php_json_parser_error_code = Module["_php_json_parser_error_code"] = wasmExports["php_json_parser_error_code"])(a0);

var _php_json_validate_ex = Module["_php_json_validate_ex"] = (a0, a1, a2, a3) => (_php_json_validate_ex = Module["_php_json_validate_ex"] = wasmExports["php_json_validate_ex"])(a0, a1, a2, a3);

var _php_json_parser_init_ex = Module["_php_json_parser_init_ex"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_json_parser_init_ex = Module["_php_json_parser_init_ex"] = wasmExports["php_json_parser_init_ex"])(a0, a1, a2, a3, a4, a5, a6);

var _php_next_utf8_char = Module["_php_next_utf8_char"] = (a0, a1, a2, a3) => (_php_next_utf8_char = Module["_php_next_utf8_char"] = wasmExports["php_next_utf8_char"])(a0, a1, a2, a3);

var ___fpclassifyl = Module["___fpclassifyl"] = (a0, a1, a2, a3) => (___fpclassifyl = Module["___fpclassifyl"] = wasmExports["__fpclassifyl"])(a0, a1, a2, a3);

var _zend_gcvt = Module["_zend_gcvt"] = (a0, a1, a2, a3, a4) => (_zend_gcvt = Module["_zend_gcvt"] = wasmExports["zend_gcvt"])(a0, a1, a2, a3, a4);

var _zend_get_recursion_guard = Module["_zend_get_recursion_guard"] = a0 => (_zend_get_recursion_guard = Module["_zend_get_recursion_guard"] = wasmExports["zend_get_recursion_guard"])(a0);

var __call_user_function_impl = Module["__call_user_function_impl"] = (a0, a1, a2, a3, a4, a5) => (__call_user_function_impl = Module["__call_user_function_impl"] = wasmExports["_call_user_function_impl"])(a0, a1, a2, a3, a4, a5);

var _zend_get_properties_for = Module["_zend_get_properties_for"] = (a0, a1) => (_zend_get_properties_for = Module["_zend_get_properties_for"] = wasmExports["zend_get_properties_for"])(a0, a1);

var _rc_dtor_func = Module["_rc_dtor_func"] = a0 => (_rc_dtor_func = Module["_rc_dtor_func"] = wasmExports["rc_dtor_func"])(a0);

var _php_json_parse = Module["_php_json_parse"] = a0 => (_php_json_parse = Module["_php_json_parse"] = wasmExports["php_json_parse"])(a0);

var _object_init = Module["_object_init"] = a0 => (_object_init = Module["_object_init"] = wasmExports["object_init"])(a0);

var __zend_handle_numeric_str_ex = Module["__zend_handle_numeric_str_ex"] = (a0, a1, a2) => (__zend_handle_numeric_str_ex = Module["__zend_handle_numeric_str_ex"] = wasmExports["_zend_handle_numeric_str_ex"])(a0, a1, a2);

var _strncmp = Module["_strncmp"] = (a0, a1, a2) => (_strncmp = Module["_strncmp"] = wasmExports["strncmp"])(a0, a1, a2);

var _zend_strtod = Module["_zend_strtod"] = (a0, a1) => (_zend_strtod = Module["_zend_strtod"] = wasmExports["zend_strtod"])(a0, a1);

var _php_pdo_get_dbh_ce = Module["_php_pdo_get_dbh_ce"] = () => (_php_pdo_get_dbh_ce = Module["_php_pdo_get_dbh_ce"] = wasmExports["php_pdo_get_dbh_ce"])();

var _php_pdo_get_exception = Module["_php_pdo_get_exception"] = () => (_php_pdo_get_exception = Module["_php_pdo_get_exception"] = wasmExports["php_pdo_get_exception"])();

var _add_next_index_stringl = Module["_add_next_index_stringl"] = (a0, a1, a2) => (_add_next_index_stringl = Module["_add_next_index_stringl"] = wasmExports["add_next_index_stringl"])(a0, a1, a2);

var _php_pdo_register_driver = Module["_php_pdo_register_driver"] = a0 => (_php_pdo_register_driver = Module["_php_pdo_register_driver"] = wasmExports["php_pdo_register_driver"])(a0);

var _php_pdo_unregister_driver = Module["_php_pdo_unregister_driver"] = a0 => (_php_pdo_unregister_driver = Module["_php_pdo_unregister_driver"] = wasmExports["php_pdo_unregister_driver"])(a0);

var _zend_hash_str_del = Module["_zend_hash_str_del"] = (a0, a1, a2) => (_zend_hash_str_del = Module["_zend_hash_str_del"] = wasmExports["zend_hash_str_del"])(a0, a1, a2);

var _php_pdo_parse_data_source = Module["_php_pdo_parse_data_source"] = (a0, a1, a2, a3) => (_php_pdo_parse_data_source = Module["_php_pdo_parse_data_source"] = wasmExports["php_pdo_parse_data_source"])(a0, a1, a2, a3);

var _zend_register_list_destructors_ex = Module["_zend_register_list_destructors_ex"] = (a0, a1, a2, a3) => (_zend_register_list_destructors_ex = Module["_zend_register_list_destructors_ex"] = wasmExports["zend_register_list_destructors_ex"])(a0, a1, a2, a3);

var _pdo_throw_exception = Module["_pdo_throw_exception"] = (a0, a1, a2) => (_pdo_throw_exception = Module["_pdo_throw_exception"] = wasmExports["pdo_throw_exception"])(a0, a1, a2);

var _zend_update_property_long = Module["_zend_update_property_long"] = (a0, a1, a2, a3, a4) => (_zend_update_property_long = Module["_zend_update_property_long"] = wasmExports["zend_update_property_long"])(a0, a1, a2, a3, a4);

var _zend_update_property_string = Module["_zend_update_property_string"] = (a0, a1, a2, a3, a4) => (_zend_update_property_string = Module["_zend_update_property_string"] = wasmExports["zend_update_property_string"])(a0, a1, a2, a3, a4);

var _zend_throw_exception_object = Module["_zend_throw_exception_object"] = a0 => (_zend_throw_exception_object = Module["_zend_throw_exception_object"] = wasmExports["zend_throw_exception_object"])(a0);

var _pdo_raise_impl_error = Module["_pdo_raise_impl_error"] = (a0, a1, a2, a3) => (_pdo_raise_impl_error = Module["_pdo_raise_impl_error"] = wasmExports["pdo_raise_impl_error"])(a0, a1, a2, a3);

var _pdo_handle_error = Module["_pdo_handle_error"] = (a0, a1) => (_pdo_handle_error = Module["_pdo_handle_error"] = wasmExports["pdo_handle_error"])(a0, a1);

var _zend_update_property_str = Module["_zend_update_property_str"] = (a0, a1, a2, a3, a4) => (_zend_update_property_str = Module["_zend_update_property_str"] = wasmExports["zend_update_property_str"])(a0, a1, a2, a3, a4);

var _cfg_get_string = Module["_cfg_get_string"] = (a0, a1) => (_cfg_get_string = Module["_cfg_get_string"] = wasmExports["cfg_get_string"])(a0, a1);

var _zend_argument_error = Module["_zend_argument_error"] = (a0, a1, a2, a3) => (_zend_argument_error = Module["_zend_argument_error"] = wasmExports["zend_argument_error"])(a0, a1, a2, a3);

var _zend_list_close = Module["_zend_list_close"] = a0 => (_zend_list_close = Module["_zend_list_close"] = wasmExports["zend_list_close"])(a0);

var ___zend_calloc = Module["___zend_calloc"] = (a0, a1) => (___zend_calloc = Module["___zend_calloc"] = wasmExports["__zend_calloc"])(a0, a1);

var ___zend_strdup = Module["___zend_strdup"] = a0 => (___zend_strdup = Module["___zend_strdup"] = wasmExports["__zend_strdup"])(a0);

var _zend_register_persistent_resource = Module["_zend_register_persistent_resource"] = (a0, a1, a2, a3) => (_zend_register_persistent_resource = Module["_zend_register_persistent_resource"] = wasmExports["zend_register_persistent_resource"])(a0, a1, a2, a3);

var _strlcpy = Module["_strlcpy"] = (a0, a1, a2) => (_strlcpy = Module["_strlcpy"] = wasmExports["strlcpy"])(a0, a1, a2);

var _zend_value_error = Module["_zend_value_error"] = (a0, a1) => (_zend_value_error = Module["_zend_value_error"] = wasmExports["zend_value_error"])(a0, a1);

var _pdo_get_long_param = Module["_pdo_get_long_param"] = (a0, a1) => (_pdo_get_long_param = Module["_pdo_get_long_param"] = wasmExports["pdo_get_long_param"])(a0, a1);

var _is_numeric_str_function = Module["_is_numeric_str_function"] = (a0, a1, a2) => (_is_numeric_str_function = Module["_is_numeric_str_function"] = wasmExports["is_numeric_str_function"])(a0, a1, a2);

var _pdo_get_bool_param = Module["_pdo_get_bool_param"] = (a0, a1) => (_pdo_get_bool_param = Module["_pdo_get_bool_param"] = wasmExports["pdo_get_bool_param"])(a0, a1);

var _strcpy = Module["_strcpy"] = (a0, a1) => (_strcpy = Module["_strcpy"] = wasmExports["strcpy"])(a0, a1);

var _zend_internal_run_time_cache_reserved_size = Module["_zend_internal_run_time_cache_reserved_size"] = () => (_zend_internal_run_time_cache_reserved_size = Module["_zend_internal_run_time_cache_reserved_size"] = wasmExports["zend_internal_run_time_cache_reserved_size"])();

var _zend_set_function_arg_flags = Module["_zend_set_function_arg_flags"] = a0 => (_zend_set_function_arg_flags = Module["_zend_set_function_arg_flags"] = wasmExports["zend_set_function_arg_flags"])(a0);

var _zend_str_tolower_copy = Module["_zend_str_tolower_copy"] = (a0, a1, a2) => (_zend_str_tolower_copy = Module["_zend_str_tolower_copy"] = wasmExports["zend_str_tolower_copy"])(a0, a1, a2);

var _zend_objects_not_comparable = Module["_zend_objects_not_comparable"] = (a0, a1) => (_zend_objects_not_comparable = Module["_zend_objects_not_comparable"] = wasmExports["zend_objects_not_comparable"])(a0, a1);

var __php_stream_get_line = Module["__php_stream_get_line"] = (a0, a1, a2, a3) => (__php_stream_get_line = Module["__php_stream_get_line"] = wasmExports["_php_stream_get_line"])(a0, a1, a2, a3);

var _zend_fcall_info_args = Module["_zend_fcall_info_args"] = (a0, a1) => (_zend_fcall_info_args = Module["_zend_fcall_info_args"] = wasmExports["zend_fcall_info_args"])(a0, a1);

var _zend_fcall_info_args_clear = Module["_zend_fcall_info_args_clear"] = (a0, a1) => (_zend_fcall_info_args_clear = Module["_zend_fcall_info_args_clear"] = wasmExports["zend_fcall_info_args_clear"])(a0, a1);

var _zend_std_get_method = Module["_zend_std_get_method"] = (a0, a1, a2) => (_zend_std_get_method = Module["_zend_std_get_method"] = wasmExports["zend_std_get_method"])(a0, a1, a2);

var _zend_get_gc_buffer_create = Module["_zend_get_gc_buffer_create"] = () => (_zend_get_gc_buffer_create = Module["_zend_get_gc_buffer_create"] = wasmExports["zend_get_gc_buffer_create"])();

var _zend_get_gc_buffer_grow = Module["_zend_get_gc_buffer_grow"] = a0 => (_zend_get_gc_buffer_grow = Module["_zend_get_gc_buffer_grow"] = wasmExports["zend_get_gc_buffer_grow"])(a0);

var _php_pdo_stmt_set_column_count = Module["_php_pdo_stmt_set_column_count"] = (a0, a1) => (_php_pdo_stmt_set_column_count = Module["_php_pdo_stmt_set_column_count"] = wasmExports["php_pdo_stmt_set_column_count"])(a0, a1);

var _pdo_parse_params = Module["_pdo_parse_params"] = (a0, a1, a2) => (_pdo_parse_params = Module["_pdo_parse_params"] = wasmExports["pdo_parse_params"])(a0, a1, a2);

var _zend_parse_arg_class = Module["_zend_parse_arg_class"] = (a0, a1, a2, a3) => (_zend_parse_arg_class = Module["_zend_parse_arg_class"] = wasmExports["zend_parse_arg_class"])(a0, a1, a2, a3);

var _zend_fetch_class = Module["_zend_fetch_class"] = (a0, a1) => (_zend_fetch_class = Module["_zend_fetch_class"] = wasmExports["zend_fetch_class"])(a0, a1);

var _zend_argument_count_error = Module["_zend_argument_count_error"] = (a0, a1) => (_zend_argument_count_error = Module["_zend_argument_count_error"] = wasmExports["zend_argument_count_error"])(a0, a1);

var __php_stream_printf = Module["__php_stream_printf"] = (a0, a1, a2) => (__php_stream_printf = Module["__php_stream_printf"] = wasmExports["_php_stream_printf"])(a0, a1, a2);

var __php_stream_write = Module["__php_stream_write"] = (a0, a1, a2) => (__php_stream_write = Module["__php_stream_write"] = wasmExports["_php_stream_write"])(a0, a1, a2);

var _php_pdo_free_statement = Module["_php_pdo_free_statement"] = a0 => (_php_pdo_free_statement = Module["_php_pdo_free_statement"] = wasmExports["php_pdo_free_statement"])(a0);

var _convert_to_long = Module["_convert_to_long"] = a0 => (_convert_to_long = Module["_convert_to_long"] = wasmExports["convert_to_long"])(a0);

var _convert_to_boolean = Module["_convert_to_boolean"] = a0 => (_convert_to_boolean = Module["_convert_to_boolean"] = wasmExports["convert_to_boolean"])(a0);

var _zend_hash_index_del = Module["_zend_hash_index_del"] = (a0, a1) => (_zend_hash_index_del = Module["_zend_hash_index_del"] = wasmExports["zend_hash_index_del"])(a0, a1);

var _zend_hash_del = Module["_zend_hash_del"] = (a0, a1) => (_zend_hash_del = Module["_zend_hash_del"] = wasmExports["zend_hash_del"])(a0, a1);

var __convert_to_string = Module["__convert_to_string"] = a0 => (__convert_to_string = Module["__convert_to_string"] = wasmExports["_convert_to_string"])(a0);

var _zend_hash_index_add = Module["_zend_hash_index_add"] = (a0, a1, a2) => (_zend_hash_index_add = Module["_zend_hash_index_add"] = wasmExports["zend_hash_index_add"])(a0, a1, a2);

var _zend_update_property_ex = Module["_zend_update_property_ex"] = (a0, a1, a2, a3) => (_zend_update_property_ex = Module["_zend_update_property_ex"] = wasmExports["zend_update_property_ex"])(a0, a1, a2, a3);

var __php_stream_copy_to_mem = Module["__php_stream_copy_to_mem"] = (a0, a1, a2) => (__php_stream_copy_to_mem = Module["__php_stream_copy_to_mem"] = wasmExports["_php_stream_copy_to_mem"])(a0, a1, a2);

var _convert_to_null = Module["_convert_to_null"] = a0 => (_convert_to_null = Module["_convert_to_null"] = wasmExports["convert_to_null"])(a0);

var __php_stream_memory_open = Module["__php_stream_memory_open"] = (a0, a1) => (__php_stream_memory_open = Module["__php_stream_memory_open"] = wasmExports["_php_stream_memory_open"])(a0, a1);

var _zend_fcall_info_args_ex = Module["_zend_fcall_info_args_ex"] = (a0, a1, a2) => (_zend_fcall_info_args_ex = Module["_zend_fcall_info_args_ex"] = wasmExports["zend_fcall_info_args_ex"])(a0, a1, a2);

var _zend_parse_arg_str_or_long_slow = Module["_zend_parse_arg_str_or_long_slow"] = (a0, a1, a2, a3) => (_zend_parse_arg_str_or_long_slow = Module["_zend_parse_arg_str_or_long_slow"] = wasmExports["zend_parse_arg_str_or_long_slow"])(a0, a1, a2, a3);

var _zend_objects_store_del = Module["_zend_objects_store_del"] = a0 => (_zend_objects_store_del = Module["_zend_objects_store_del"] = wasmExports["zend_objects_store_del"])(a0);

var _gc_possible_root = Module["_gc_possible_root"] = a0 => (_gc_possible_root = Module["_gc_possible_root"] = wasmExports["gc_possible_root"])(a0);

var _zend_std_unset_property = Module["_zend_std_unset_property"] = (a0, a1, a2) => (_zend_std_unset_property = Module["_zend_std_unset_property"] = wasmExports["zend_std_unset_property"])(a0, a1, a2);

var _zend_std_cast_object_tostring = Module["_zend_std_cast_object_tostring"] = (a0, a1, a2) => (_zend_std_cast_object_tostring = Module["_zend_std_cast_object_tostring"] = wasmExports["zend_std_cast_object_tostring"])(a0, a1, a2);

var _zend_object_is_true = Module["_zend_object_is_true"] = a0 => (_zend_object_is_true = Module["_zend_object_is_true"] = wasmExports["zend_object_is_true"])(a0);

var _zval_try_get_string_func = Module["_zval_try_get_string_func"] = a0 => (_zval_try_get_string_func = Module["_zval_try_get_string_func"] = wasmExports["zval_try_get_string_func"])(a0);

var _strncpy = Module["_strncpy"] = (a0, a1, a2) => (_strncpy = Module["_strncpy"] = wasmExports["strncpy"])(a0, a1, a2);

var _zend_long_to_str = Module["_zend_long_to_str"] = a0 => (_zend_long_to_str = Module["_zend_long_to_str"] = wasmExports["zend_long_to_str"])(a0);

var _zend_ulong_to_str = Module["_zend_ulong_to_str"] = a0 => (_zend_ulong_to_str = Module["_zend_ulong_to_str"] = wasmExports["zend_ulong_to_str"])(a0);

var _main = Module["_main"] = (a0, a1) => (_main = Module["_main"] = wasmExports["main"])(a0, a1);

var _pib_init = Module["_pib_init"] = () => (_pib_init = Module["_pib_init"] = wasmExports["pib_init"])();

var _putenv = Module["_putenv"] = a0 => (_putenv = Module["_putenv"] = wasmExports["putenv"])(a0);

var _php_embed_init = Module["_php_embed_init"] = (a0, a1) => (_php_embed_init = Module["_php_embed_init"] = wasmExports["php_embed_init"])(a0, a1);

var _pib_storage_init = Module["_pib_storage_init"] = () => (_pib_storage_init = Module["_pib_storage_init"] = wasmExports["pib_storage_init"])();

var _php_embed_shutdown = Module["_php_embed_shutdown"] = () => (_php_embed_shutdown = Module["_php_embed_shutdown"] = wasmExports["php_embed_shutdown"])();

var _pib_refresh = Module["_pib_refresh"] = () => (_pib_refresh = Module["_pib_refresh"] = wasmExports["pib_refresh"])();

var _pib_flush = Module["_pib_flush"] = () => (_pib_flush = Module["_pib_flush"] = wasmExports["pib_flush"])();

var _php_output_flush_all = Module["_php_output_flush_all"] = () => (_php_output_flush_all = Module["_php_output_flush_all"] = wasmExports["php_output_flush_all"])();

var _pib_exec = Module["_pib_exec"] = a0 => (_pib_exec = Module["_pib_exec"] = wasmExports["pib_exec"])(a0);

var _zend_eval_string = Module["_zend_eval_string"] = (a0, a1, a2) => (_zend_eval_string = Module["_zend_eval_string"] = wasmExports["zend_eval_string"])(a0, a1, a2);

var _pib_run = Module["_pib_run"] = a0 => (_pib_run = Module["_pib_run"] = wasmExports["pib_run"])(a0);

var _sapi_send_headers = Module["_sapi_send_headers"] = () => (_sapi_send_headers = Module["_sapi_send_headers"] = wasmExports["sapi_send_headers"])();

var _zend_exception_error = Module["_zend_exception_error"] = (a0, a1) => (_zend_exception_error = Module["_zend_exception_error"] = wasmExports["zend_exception_error"])(a0, a1);

var _pib_php_version = Module["_pib_php_version"] = () => (_pib_php_version = Module["_pib_php_version"] = wasmExports["pib_php_version"])();

var _pib_php_ext_api_version = Module["_pib_php_ext_api_version"] = () => (_pib_php_ext_api_version = Module["_pib_php_ext_api_version"] = wasmExports["pib_php_ext_api_version"])();

var _pib_tokenize = Module["_pib_tokenize"] = a0 => (_pib_tokenize = Module["_pib_tokenize"] = wasmExports["pib_tokenize"])(a0);

var _php_random_range32 = Module["_php_random_range32"] = (a0, a1, a2) => (_php_random_range32 = Module["_php_random_range32"] = wasmExports["php_random_range32"])(a0, a1, a2);

var _php_random_range64 = Module["_php_random_range64"] = (a0, a1, a2, a3) => (_php_random_range64 = Module["_php_random_range64"] = wasmExports["php_random_range64"])(a0, a1, a2, a3);

var _php_random_status_alloc = Module["_php_random_status_alloc"] = (a0, a1) => (_php_random_status_alloc = Module["_php_random_status_alloc"] = wasmExports["php_random_status_alloc"])(a0, a1);

var _php_random_status_copy = Module["_php_random_status_copy"] = (a0, a1, a2) => (_php_random_status_copy = Module["_php_random_status_copy"] = wasmExports["php_random_status_copy"])(a0, a1, a2);

var _php_random_status_free = Module["_php_random_status_free"] = (a0, a1) => (_php_random_status_free = Module["_php_random_status_free"] = wasmExports["php_random_status_free"])(a0, a1);

var _php_random_engine_common_init = Module["_php_random_engine_common_init"] = (a0, a1, a2) => (_php_random_engine_common_init = Module["_php_random_engine_common_init"] = wasmExports["php_random_engine_common_init"])(a0, a1, a2);

var _php_random_engine_common_free_object = Module["_php_random_engine_common_free_object"] = a0 => (_php_random_engine_common_free_object = Module["_php_random_engine_common_free_object"] = wasmExports["php_random_engine_common_free_object"])(a0);

var _php_random_engine_common_clone_object = Module["_php_random_engine_common_clone_object"] = a0 => (_php_random_engine_common_clone_object = Module["_php_random_engine_common_clone_object"] = wasmExports["php_random_engine_common_clone_object"])(a0);

var _php_random_range = Module["_php_random_range"] = (a0, a1, a2, a3) => (_php_random_range = Module["_php_random_range"] = wasmExports["php_random_range"])(a0, a1, a2, a3);

var _php_random_default_algo = Module["_php_random_default_algo"] = () => (_php_random_default_algo = Module["_php_random_default_algo"] = wasmExports["php_random_default_algo"])();

var _php_random_default_status = Module["_php_random_default_status"] = () => (_php_random_default_status = Module["_php_random_default_status"] = wasmExports["php_random_default_status"])();

var _php_random_mt19937_seed_default = Module["_php_random_mt19937_seed_default"] = a0 => (_php_random_mt19937_seed_default = Module["_php_random_mt19937_seed_default"] = wasmExports["php_random_mt19937_seed_default"])(a0);

var _php_random_bin2hex_le = Module["_php_random_bin2hex_le"] = (a0, a1) => (_php_random_bin2hex_le = Module["_php_random_bin2hex_le"] = wasmExports["php_random_bin2hex_le"])(a0, a1);

var _php_random_hex2bin_le = Module["_php_random_hex2bin_le"] = (a0, a1) => (_php_random_hex2bin_le = Module["_php_random_hex2bin_le"] = wasmExports["php_random_hex2bin_le"])(a0, a1);

var _php_combined_lcg = Module["_php_combined_lcg"] = () => (_php_combined_lcg = Module["_php_combined_lcg"] = wasmExports["php_combined_lcg"])();

var _php_random_combinedlcg_seed_default = Module["_php_random_combinedlcg_seed_default"] = a0 => (_php_random_combinedlcg_seed_default = Module["_php_random_combinedlcg_seed_default"] = wasmExports["php_random_combinedlcg_seed_default"])(a0);

var _php_mt_srand = Module["_php_mt_srand"] = a0 => (_php_mt_srand = Module["_php_mt_srand"] = wasmExports["php_mt_srand"])(a0);

var _php_mt_rand = Module["_php_mt_rand"] = () => (_php_mt_rand = Module["_php_mt_rand"] = wasmExports["php_mt_rand"])();

var _php_mt_rand_range = Module["_php_mt_rand_range"] = (a0, a1) => (_php_mt_rand_range = Module["_php_mt_rand_range"] = wasmExports["php_mt_rand_range"])(a0, a1);

var _php_mt_rand_common = Module["_php_mt_rand_common"] = (a0, a1) => (_php_mt_rand_common = Module["_php_mt_rand_common"] = wasmExports["php_mt_rand_common"])(a0, a1);

var _php_srand = Module["_php_srand"] = a0 => (_php_srand = Module["_php_srand"] = wasmExports["php_srand"])(a0);

var _php_rand = Module["_php_rand"] = () => (_php_rand = Module["_php_rand"] = wasmExports["php_rand"])();

var _php_random_bytes = Module["_php_random_bytes"] = (a0, a1, a2) => (_php_random_bytes = Module["_php_random_bytes"] = wasmExports["php_random_bytes"])(a0, a1, a2);

var _php_random_int = Module["_php_random_int"] = (a0, a1, a2, a3) => (_php_random_int = Module["_php_random_int"] = wasmExports["php_random_int"])(a0, a1, a2, a3);

var _zend_register_internal_enum = Module["_zend_register_internal_enum"] = (a0, a1, a2) => (_zend_register_internal_enum = Module["_zend_register_internal_enum"] = wasmExports["zend_register_internal_enum"])(a0, a1, a2);

var _zend_enum_add_case_cstr = Module["_zend_enum_add_case_cstr"] = (a0, a1, a2) => (_zend_enum_add_case_cstr = Module["_zend_enum_add_case_cstr"] = wasmExports["zend_enum_add_case_cstr"])(a0, a1, a2);

var _close = Module["_close"] = a0 => (_close = Module["_close"] = wasmExports["close"])(a0);

var _open = Module["_open"] = (a0, a1, a2) => (_open = Module["_open"] = wasmExports["open"])(a0, a1, a2);

var _strerror = Module["_strerror"] = a0 => (_strerror = Module["_strerror"] = wasmExports["strerror"])(a0);

var _fstat = Module["_fstat"] = (a0, a1) => (_fstat = Module["_fstat"] = wasmExports["fstat"])(a0, a1);

var _read = Module["_read"] = (a0, a1, a2) => (_read = Module["_read"] = wasmExports["read"])(a0, a1, a2);

var _getpid = Module["_getpid"] = () => (_getpid = Module["_getpid"] = wasmExports["getpid"])();

var _php_random_pcgoneseq128xslrr64_advance = Module["_php_random_pcgoneseq128xslrr64_advance"] = (a0, a1, a2) => (_php_random_pcgoneseq128xslrr64_advance = Module["_php_random_pcgoneseq128xslrr64_advance"] = wasmExports["php_random_pcgoneseq128xslrr64_advance"])(a0, a1, a2);

var _php_random_xoshiro256starstar_jump = Module["_php_random_xoshiro256starstar_jump"] = a0 => (_php_random_xoshiro256starstar_jump = Module["_php_random_xoshiro256starstar_jump"] = wasmExports["php_random_xoshiro256starstar_jump"])(a0);

var _php_random_xoshiro256starstar_jump_long = Module["_php_random_xoshiro256starstar_jump_long"] = a0 => (_php_random_xoshiro256starstar_jump_long = Module["_php_random_xoshiro256starstar_jump_long"] = wasmExports["php_random_xoshiro256starstar_jump_long"])(a0);

var _zend_call_known_function = Module["_zend_call_known_function"] = (a0, a1, a2, a3, a4, a5, a6) => (_zend_call_known_function = Module["_zend_call_known_function"] = wasmExports["zend_call_known_function"])(a0, a1, a2, a3, a4, a5, a6);

var _php_random_gammasection_closed_open = Module["_php_random_gammasection_closed_open"] = (a0, a1, a2, a3) => (_php_random_gammasection_closed_open = Module["_php_random_gammasection_closed_open"] = wasmExports["php_random_gammasection_closed_open"])(a0, a1, a2, a3);

var _php_random_gammasection_closed_closed = Module["_php_random_gammasection_closed_closed"] = (a0, a1, a2, a3) => (_php_random_gammasection_closed_closed = Module["_php_random_gammasection_closed_closed"] = wasmExports["php_random_gammasection_closed_closed"])(a0, a1, a2, a3);

var _php_random_gammasection_open_closed = Module["_php_random_gammasection_open_closed"] = (a0, a1, a2, a3) => (_php_random_gammasection_open_closed = Module["_php_random_gammasection_open_closed"] = wasmExports["php_random_gammasection_open_closed"])(a0, a1, a2, a3);

var _php_random_gammasection_open_open = Module["_php_random_gammasection_open_open"] = (a0, a1, a2, a3) => (_php_random_gammasection_open_open = Module["_php_random_gammasection_open_open"] = wasmExports["php_random_gammasection_open_open"])(a0, a1, a2, a3);

var _nextafter = Module["_nextafter"] = (a0, a1) => (_nextafter = Module["_nextafter"] = wasmExports["nextafter"])(a0, a1);

var _php_array_data_shuffle = Module["_php_array_data_shuffle"] = (a0, a1, a2) => (_php_array_data_shuffle = Module["_php_array_data_shuffle"] = wasmExports["php_array_data_shuffle"])(a0, a1, a2);

var _php_binary_string_shuffle = Module["_php_binary_string_shuffle"] = (a0, a1, a2, a3) => (_php_binary_string_shuffle = Module["_php_binary_string_shuffle"] = wasmExports["php_binary_string_shuffle"])(a0, a1, a2, a3);

var _php_array_pick_keys = Module["_php_array_pick_keys"] = (a0, a1, a2, a3, a4, a5) => (_php_array_pick_keys = Module["_php_array_pick_keys"] = wasmExports["php_array_pick_keys"])(a0, a1, a2, a3, a4, a5);

var _zend_read_property = Module["_zend_read_property"] = (a0, a1, a2, a3, a4, a5) => (_zend_read_property = Module["_zend_read_property"] = wasmExports["zend_read_property"])(a0, a1, a2, a3, a4, a5);

var _zend_reflection_class_factory = Module["_zend_reflection_class_factory"] = (a0, a1) => (_zend_reflection_class_factory = Module["_zend_reflection_class_factory"] = wasmExports["zend_reflection_class_factory"])(a0, a1);

var _zend_get_closure_method_def = Module["_zend_get_closure_method_def"] = a0 => (_zend_get_closure_method_def = Module["_zend_get_closure_method_def"] = wasmExports["zend_get_closure_method_def"])(a0);

var _zend_fetch_function = Module["_zend_fetch_function"] = a0 => (_zend_fetch_function = Module["_zend_fetch_function"] = wasmExports["zend_fetch_function"])(a0);

var _zend_get_closure_this_ptr = Module["_zend_get_closure_this_ptr"] = a0 => (_zend_get_closure_this_ptr = Module["_zend_get_closure_this_ptr"] = wasmExports["zend_get_closure_this_ptr"])(a0);

var _zend_create_fake_closure = Module["_zend_create_fake_closure"] = (a0, a1, a2, a3, a4) => (_zend_create_fake_closure = Module["_zend_create_fake_closure"] = wasmExports["zend_create_fake_closure"])(a0, a1, a2, a3, a4);

var _zend_hash_copy = Module["_zend_hash_copy"] = (a0, a1, a2) => (_zend_hash_copy = Module["_zend_hash_copy"] = wasmExports["zend_hash_copy"])(a0, a1, a2);

var _zval_add_ref = Module["_zval_add_ref"] = a0 => (_zval_add_ref = Module["_zval_add_ref"] = wasmExports["zval_add_ref"])(a0);

var _zend_fetch_debug_backtrace = Module["_zend_fetch_debug_backtrace"] = (a0, a1, a2, a3) => (_zend_fetch_debug_backtrace = Module["_zend_fetch_debug_backtrace"] = wasmExports["zend_fetch_debug_backtrace"])(a0, a1, a2, a3);

var _zend_get_closure_invoke_method = Module["_zend_get_closure_invoke_method"] = a0 => (_zend_get_closure_invoke_method = Module["_zend_get_closure_invoke_method"] = wasmExports["zend_get_closure_invoke_method"])(a0);

var _zend_binary_strcasecmp = Module["_zend_binary_strcasecmp"] = (a0, a1, a2, a3) => (_zend_binary_strcasecmp = Module["_zend_binary_strcasecmp"] = wasmExports["zend_binary_strcasecmp"])(a0, a1, a2, a3);

var _zval_update_constant_ex = Module["_zval_update_constant_ex"] = (a0, a1) => (_zval_update_constant_ex = Module["_zval_update_constant_ex"] = wasmExports["zval_update_constant_ex"])(a0, a1);

var _zend_update_class_constant = Module["_zend_update_class_constant"] = (a0, a1, a2) => (_zend_update_class_constant = Module["_zend_update_class_constant"] = wasmExports["zend_update_class_constant"])(a0, a1, a2);

var _zval_copy_ctor_func = Module["_zval_copy_ctor_func"] = a0 => (_zval_copy_ctor_func = Module["_zval_copy_ctor_func"] = wasmExports["zval_copy_ctor_func"])(a0);

var _zend_update_class_constants = Module["_zend_update_class_constants"] = a0 => (_zend_update_class_constants = Module["_zend_update_class_constants"] = wasmExports["zend_update_class_constants"])(a0);

var _zend_class_init_statics = Module["_zend_class_init_statics"] = a0 => (_zend_class_init_statics = Module["_zend_class_init_statics"] = wasmExports["zend_class_init_statics"])(a0);

var _zend_std_get_static_property = Module["_zend_std_get_static_property"] = (a0, a1, a2) => (_zend_std_get_static_property = Module["_zend_std_get_static_property"] = wasmExports["zend_std_get_static_property"])(a0, a1, a2);

var _zend_std_get_static_property_with_info = Module["_zend_std_get_static_property_with_info"] = (a0, a1, a2, a3) => (_zend_std_get_static_property_with_info = Module["_zend_std_get_static_property_with_info"] = wasmExports["zend_std_get_static_property_with_info"])(a0, a1, a2, a3);

var _zend_clear_exception = Module["_zend_clear_exception"] = () => (_zend_clear_exception = Module["_zend_clear_exception"] = wasmExports["zend_clear_exception"])();

var _zend_verify_ref_assignable_zval = Module["_zend_verify_ref_assignable_zval"] = (a0, a1, a2) => (_zend_verify_ref_assignable_zval = Module["_zend_verify_ref_assignable_zval"] = wasmExports["zend_verify_ref_assignable_zval"])(a0, a1, a2);

var _zend_verify_property_type = Module["_zend_verify_property_type"] = (a0, a1, a2) => (_zend_verify_property_type = Module["_zend_verify_property_type"] = wasmExports["zend_verify_property_type"])(a0, a1, a2);

var _strstr = Module["_strstr"] = (a0, a1) => (_strstr = Module["_strstr"] = wasmExports["strstr"])(a0, a1);

var _zend_fetch_class_by_name = Module["_zend_fetch_class_by_name"] = (a0, a1, a2) => (_zend_fetch_class_by_name = Module["_zend_fetch_class_by_name"] = wasmExports["zend_fetch_class_by_name"])(a0, a1, a2);

var _zend_read_static_property_ex = Module["_zend_read_static_property_ex"] = (a0, a1, a2) => (_zend_read_static_property_ex = Module["_zend_read_static_property_ex"] = wasmExports["zend_read_static_property_ex"])(a0, a1, a2);

var _zend_read_property_ex = Module["_zend_read_property_ex"] = (a0, a1, a2, a3, a4) => (_zend_read_property_ex = Module["_zend_read_property_ex"] = wasmExports["zend_read_property_ex"])(a0, a1, a2, a3, a4);

var _zend_update_static_property_ex = Module["_zend_update_static_property_ex"] = (a0, a1, a2) => (_zend_update_static_property_ex = Module["_zend_update_static_property_ex"] = wasmExports["zend_update_static_property_ex"])(a0, a1, a2);

var _php_info_print_module = Module["_php_info_print_module"] = a0 => (_php_info_print_module = Module["_php_info_print_module"] = wasmExports["php_info_print_module"])(a0);

var _zend_get_extension = Module["_zend_get_extension"] = a0 => (_zend_get_extension = Module["_zend_get_extension"] = wasmExports["zend_get_extension"])(a0);

var _smart_str_append_printf = Module["_smart_str_append_printf"] = (a0, a1, a2) => (_smart_str_append_printf = Module["_smart_str_append_printf"] = wasmExports["smart_str_append_printf"])(a0, a1, a2);

var _zend_is_attribute_repeated = Module["_zend_is_attribute_repeated"] = (a0, a1) => (_zend_is_attribute_repeated = Module["_zend_is_attribute_repeated"] = wasmExports["zend_is_attribute_repeated"])(a0, a1);

var _zend_get_attribute_value = Module["_zend_get_attribute_value"] = (a0, a1, a2, a3) => (_zend_get_attribute_value = Module["_zend_get_attribute_value"] = wasmExports["zend_get_attribute_value"])(a0, a1, a2, a3);

var _zend_get_attribute_str = Module["_zend_get_attribute_str"] = (a0, a1, a2) => (_zend_get_attribute_str = Module["_zend_get_attribute_str"] = wasmExports["zend_get_attribute_str"])(a0, a1, a2);

var _zend_get_attribute_target_names = Module["_zend_get_attribute_target_names"] = a0 => (_zend_get_attribute_target_names = Module["_zend_get_attribute_target_names"] = wasmExports["zend_get_attribute_target_names"])(a0);

var _zend_type_to_string = Module["_zend_type_to_string"] = a0 => (_zend_type_to_string = Module["_zend_type_to_string"] = wasmExports["zend_type_to_string"])(a0);

var _zend_lookup_class_ex = Module["_zend_lookup_class_ex"] = (a0, a1, a2) => (_zend_lookup_class_ex = Module["_zend_lookup_class_ex"] = wasmExports["zend_lookup_class_ex"])(a0, a1, a2);

var __efree_32 = Module["__efree_32"] = a0 => (__efree_32 = Module["__efree_32"] = wasmExports["_efree_32"])(a0);

var _zend_generator_update_root = Module["_zend_generator_update_root"] = a0 => (_zend_generator_update_root = Module["_zend_generator_update_root"] = wasmExports["zend_generator_update_root"])(a0);

var _zend_generator_update_current = Module["_zend_generator_update_current"] = a0 => (_zend_generator_update_current = Module["_zend_generator_update_current"] = wasmExports["zend_generator_update_current"])(a0);

var _zend_get_default_from_internal_arg_info = Module["_zend_get_default_from_internal_arg_info"] = (a0, a1) => (_zend_get_default_from_internal_arg_info = Module["_zend_get_default_from_internal_arg_info"] = wasmExports["zend_get_default_from_internal_arg_info"])(a0, a1);

var _memrchr = Module["_memrchr"] = (a0, a1, a2) => (_memrchr = Module["_memrchr"] = wasmExports["memrchr"])(a0, a1, a2);

var _zend_separate_class_constants_table = Module["_zend_separate_class_constants_table"] = a0 => (_zend_separate_class_constants_table = Module["_zend_separate_class_constants_table"] = wasmExports["zend_separate_class_constants_table"])(a0);

var _zend_zval_type_name = Module["_zend_zval_type_name"] = a0 => (_zend_zval_type_name = Module["_zend_zval_type_name"] = wasmExports["zend_zval_type_name"])(a0);

var _strcasecmp = Module["_strcasecmp"] = (a0, a1) => (_strcasecmp = Module["_strcasecmp"] = wasmExports["strcasecmp"])(a0, a1);

var _smart_str_append_scalar = Module["_smart_str_append_scalar"] = (a0, a1, a2) => (_smart_str_append_scalar = Module["_smart_str_append_scalar"] = wasmExports["smart_str_append_scalar"])(a0, a1, a2);

var _smart_str_append_escaped = Module["_smart_str_append_escaped"] = (a0, a1, a2) => (_smart_str_append_escaped = Module["_smart_str_append_escaped"] = wasmExports["smart_str_append_escaped"])(a0, a1, a2);

var _zend_ast_export = Module["_zend_ast_export"] = (a0, a1, a2) => (_zend_ast_export = Module["_zend_ast_export"] = wasmExports["zend_ast_export"])(a0, a1, a2);

var _zend_vm_stack_extend = Module["_zend_vm_stack_extend"] = a0 => (_zend_vm_stack_extend = Module["_zend_vm_stack_extend"] = wasmExports["zend_vm_stack_extend"])(a0);

var __zend_bailout = Module["__zend_bailout"] = (a0, a1) => (__zend_bailout = Module["__zend_bailout"] = wasmExports["_zend_bailout"])(a0, a1);

var _php_session_destroy = Module["_php_session_destroy"] = () => (_php_session_destroy = Module["_php_session_destroy"] = wasmExports["php_session_destroy"])();

var _php_add_session_var = Module["_php_add_session_var"] = a0 => (_php_add_session_var = Module["_php_add_session_var"] = wasmExports["php_add_session_var"])(a0);

var _php_set_session_var = Module["_php_set_session_var"] = (a0, a1, a2) => (_php_set_session_var = Module["_php_set_session_var"] = wasmExports["php_set_session_var"])(a0, a1, a2);

var _php_get_session_var = Module["_php_get_session_var"] = a0 => (_php_get_session_var = Module["_php_get_session_var"] = wasmExports["php_get_session_var"])(a0);

var _php_session_create_id = Module["_php_session_create_id"] = a0 => (_php_session_create_id = Module["_php_session_create_id"] = wasmExports["php_session_create_id"])(a0);

var _php_session_valid_key = Module["_php_session_valid_key"] = a0 => (_php_session_valid_key = Module["_php_session_valid_key"] = wasmExports["php_session_valid_key"])(a0);

var _php_var_serialize_init = Module["_php_var_serialize_init"] = () => (_php_var_serialize_init = Module["_php_var_serialize_init"] = wasmExports["php_var_serialize_init"])();

var _php_var_serialize = Module["_php_var_serialize"] = (a0, a1, a2) => (_php_var_serialize = Module["_php_var_serialize"] = wasmExports["php_var_serialize"])(a0, a1, a2);

var _php_var_serialize_destroy = Module["_php_var_serialize_destroy"] = a0 => (_php_var_serialize_destroy = Module["_php_var_serialize_destroy"] = wasmExports["php_var_serialize_destroy"])(a0);

var _php_var_unserialize_init = Module["_php_var_unserialize_init"] = () => (_php_var_unserialize_init = Module["_php_var_unserialize_init"] = wasmExports["php_var_unserialize_init"])();

var _php_var_unserialize = Module["_php_var_unserialize"] = (a0, a1, a2, a3) => (_php_var_unserialize = Module["_php_var_unserialize"] = wasmExports["php_var_unserialize"])(a0, a1, a2, a3);

var _php_var_unserialize_destroy = Module["_php_var_unserialize_destroy"] = a0 => (_php_var_unserialize_destroy = Module["_php_var_unserialize_destroy"] = wasmExports["php_var_unserialize_destroy"])(a0);

var _zend_hash_update_ind = Module["_zend_hash_update_ind"] = (a0, a1, a2) => (_zend_hash_update_ind = Module["_zend_hash_update_ind"] = wasmExports["zend_hash_update_ind"])(a0, a1, a2);

var _var_tmp_var = Module["_var_tmp_var"] = a0 => (_var_tmp_var = Module["_var_tmp_var"] = wasmExports["var_tmp_var"])(a0);

var _php_session_register_serializer = Module["_php_session_register_serializer"] = (a0, a1, a2) => (_php_session_register_serializer = Module["_php_session_register_serializer"] = wasmExports["php_session_register_serializer"])(a0, a1, a2);

var _php_session_register_module = Module["_php_session_register_module"] = a0 => (_php_session_register_module = Module["_php_session_register_module"] = wasmExports["php_session_register_module"])(a0);

var _php_session_validate_sid = Module["_php_session_validate_sid"] = (a0, a1) => (_php_session_validate_sid = Module["_php_session_validate_sid"] = wasmExports["php_session_validate_sid"])(a0, a1);

var _php_session_update_timestamp = Module["_php_session_update_timestamp"] = (a0, a1, a2, a3) => (_php_session_update_timestamp = Module["_php_session_update_timestamp"] = wasmExports["php_session_update_timestamp"])(a0, a1, a2, a3);

var __php_find_ps_module = Module["__php_find_ps_module"] = a0 => (__php_find_ps_module = Module["__php_find_ps_module"] = wasmExports["_php_find_ps_module"])(a0);

var __php_find_ps_serializer = Module["__php_find_ps_serializer"] = a0 => (__php_find_ps_serializer = Module["__php_find_ps_serializer"] = wasmExports["_php_find_ps_serializer"])(a0);

var _php_session_reset_id = Module["_php_session_reset_id"] = () => (_php_session_reset_id = Module["_php_session_reset_id"] = wasmExports["php_session_reset_id"])();

var _zend_get_constant_str = Module["_zend_get_constant_str"] = (a0, a1) => (_zend_get_constant_str = Module["_zend_get_constant_str"] = wasmExports["zend_get_constant_str"])(a0, a1);

var _zend_register_stringl_constant = Module["_zend_register_stringl_constant"] = (a0, a1, a2, a3, a4, a5) => (_zend_register_stringl_constant = Module["_zend_register_stringl_constant"] = wasmExports["zend_register_stringl_constant"])(a0, a1, a2, a3, a4, a5);

var _php_url_scanner_reset_session_var = Module["_php_url_scanner_reset_session_var"] = (a0, a1) => (_php_url_scanner_reset_session_var = Module["_php_url_scanner_reset_session_var"] = wasmExports["php_url_scanner_reset_session_var"])(a0, a1);

var _php_url_scanner_add_session_var = Module["_php_url_scanner_add_session_var"] = (a0, a1, a2, a3, a4) => (_php_url_scanner_add_session_var = Module["_php_url_scanner_add_session_var"] = wasmExports["php_url_scanner_add_session_var"])(a0, a1, a2, a3, a4);

var _php_session_start = Module["_php_session_start"] = () => (_php_session_start = Module["_php_session_start"] = wasmExports["php_session_start"])();

var _zend_ini_string = Module["_zend_ini_string"] = (a0, a1, a2) => (_zend_ini_string = Module["_zend_ini_string"] = wasmExports["zend_ini_string"])(a0, a1, a2);

var _strpbrk = Module["_strpbrk"] = (a0, a1) => (_strpbrk = Module["_strpbrk"] = wasmExports["strpbrk"])(a0, a1);

var _php_session_flush = Module["_php_session_flush"] = a0 => (_php_session_flush = Module["_php_session_flush"] = wasmExports["php_session_flush"])(a0);

var _session_adapt_url = Module["_session_adapt_url"] = (a0, a1, a2, a3) => (_session_adapt_url = Module["_session_adapt_url"] = wasmExports["session_adapt_url"])(a0, a1, a2, a3);

var _php_url_scanner_adapt_single_url = Module["_php_url_scanner_adapt_single_url"] = (a0, a1, a2, a3, a4, a5) => (_php_url_scanner_adapt_single_url = Module["_php_url_scanner_adapt_single_url"] = wasmExports["php_url_scanner_adapt_single_url"])(a0, a1, a2, a3, a4, a5);

var _zend_alter_ini_entry = Module["_zend_alter_ini_entry"] = (a0, a1, a2, a3) => (_zend_alter_ini_entry = Module["_zend_alter_ini_entry"] = wasmExports["zend_alter_ini_entry"])(a0, a1, a2, a3);

var _zend_alter_ini_entry_chars = Module["_zend_alter_ini_entry_chars"] = (a0, a1, a2, a3, a4) => (_zend_alter_ini_entry_chars = Module["_zend_alter_ini_entry_chars"] = wasmExports["zend_alter_ini_entry_chars"])(a0, a1, a2, a3, a4);

var _register_user_shutdown_function = Module["_register_user_shutdown_function"] = (a0, a1, a2) => (_register_user_shutdown_function = Module["_register_user_shutdown_function"] = wasmExports["register_user_shutdown_function"])(a0, a1, a2);

var _remove_user_shutdown_function = Module["_remove_user_shutdown_function"] = (a0, a1) => (_remove_user_shutdown_function = Module["_remove_user_shutdown_function"] = wasmExports["remove_user_shutdown_function"])(a0, a1);

var _get_active_function_name = Module["_get_active_function_name"] = () => (_get_active_function_name = Module["_get_active_function_name"] = wasmExports["get_active_function_name"])();

var _zend_hash_clean = Module["_zend_hash_clean"] = a0 => (_zend_hash_clean = Module["_zend_hash_clean"] = wasmExports["zend_hash_clean"])(a0);

var _append_user_shutdown_function = Module["_append_user_shutdown_function"] = a0 => (_append_user_shutdown_function = Module["_append_user_shutdown_function"] = wasmExports["append_user_shutdown_function"])(a0);

var _php_output_get_start_filename = Module["_php_output_get_start_filename"] = () => (_php_output_get_start_filename = Module["_php_output_get_start_filename"] = wasmExports["php_output_get_start_filename"])();

var _php_output_get_start_lineno = Module["_php_output_get_start_lineno"] = () => (_php_output_get_start_lineno = Module["_php_output_get_start_lineno"] = wasmExports["php_output_get_start_lineno"])();

var _php_url_encode = Module["_php_url_encode"] = (a0, a1) => (_php_url_encode = Module["_php_url_encode"] = wasmExports["php_url_encode"])(a0, a1);

var _sapi_add_header_ex = Module["_sapi_add_header_ex"] = (a0, a1, a2, a3) => (_sapi_add_header_ex = Module["_sapi_add_header_ex"] = wasmExports["sapi_add_header_ex"])(a0, a1, a2, a3);

var _sapi_free_header = Module["_sapi_free_header"] = a0 => (_sapi_free_header = Module["_sapi_free_header"] = wasmExports["sapi_free_header"])(a0);

var _zend_get_executed_filename_ex = Module["_zend_get_executed_filename_ex"] = () => (_zend_get_executed_filename_ex = Module["_zend_get_executed_filename_ex"] = wasmExports["zend_get_executed_filename_ex"])();

var _zend_get_executed_lineno = Module["_zend_get_executed_lineno"] = () => (_zend_get_executed_lineno = Module["_zend_get_executed_lineno"] = wasmExports["zend_get_executed_lineno"])();

var _zend_delete_global_variable = Module["_zend_delete_global_variable"] = a0 => (_zend_delete_global_variable = Module["_zend_delete_global_variable"] = wasmExports["zend_delete_global_variable"])(a0);

var _gmtime_r = Module["_gmtime_r"] = (a0, a1) => (_gmtime_r = Module["_gmtime_r"] = wasmExports["gmtime_r"])(a0, a1);

var _stat = Module["_stat"] = (a0, a1) => (_stat = Module["_stat"] = wasmExports["stat"])(a0, a1);

var _zend_alter_ini_entry_ex = Module["_zend_alter_ini_entry_ex"] = (a0, a1, a2, a3, a4) => (_zend_alter_ini_entry_ex = Module["_zend_alter_ini_entry_ex"] = wasmExports["zend_alter_ini_entry_ex"])(a0, a1, a2, a3, a4);

var _zend_register_auto_global = Module["_zend_register_auto_global"] = (a0, a1, a2) => (_zend_register_auto_global = Module["_zend_register_auto_global"] = wasmExports["zend_register_auto_global"])(a0, a1, a2);

var _OnUpdateBool = Module["_OnUpdateBool"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateBool = Module["_OnUpdateBool"] = wasmExports["OnUpdateBool"])(a0, a1, a2, a3, a4, a5);

var _zend_ini_boolean_displayer_cb = Module["_zend_ini_boolean_displayer_cb"] = (a0, a1) => (_zend_ini_boolean_displayer_cb = Module["_zend_ini_boolean_displayer_cb"] = wasmExports["zend_ini_boolean_displayer_cb"])(a0, a1);

var _OnUpdateReal = Module["_OnUpdateReal"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateReal = Module["_OnUpdateReal"] = wasmExports["OnUpdateReal"])(a0, a1, a2, a3, a4, a5);

var _php_check_open_basedir = Module["_php_check_open_basedir"] = a0 => (_php_check_open_basedir = Module["_php_check_open_basedir"] = wasmExports["php_check_open_basedir"])(a0);

var _OnUpdateStringUnempty = Module["_OnUpdateStringUnempty"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateStringUnempty = Module["_OnUpdateStringUnempty"] = wasmExports["OnUpdateStringUnempty"])(a0, a1, a2, a3, a4, a5);

var _atol = Module["_atol"] = a0 => (_atol = Module["_atol"] = wasmExports["atol"])(a0);

var _OnUpdateLongGEZero = Module["_OnUpdateLongGEZero"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateLongGEZero = Module["_OnUpdateLongGEZero"] = wasmExports["OnUpdateLongGEZero"])(a0, a1, a2, a3, a4, a5);

var _sapi_get_request_time = Module["_sapi_get_request_time"] = () => (_sapi_get_request_time = Module["_sapi_get_request_time"] = wasmExports["sapi_get_request_time"])();

var _php_get_temporary_directory = Module["_php_get_temporary_directory"] = () => (_php_get_temporary_directory = Module["_php_get_temporary_directory"] = wasmExports["php_get_temporary_directory"])();

var _lseek = Module["_lseek"] = (a0, a1, a2, a3) => (_lseek = Module["_lseek"] = wasmExports["lseek"])(a0, a1, a2, a3);

var _utime = Module["_utime"] = (a0, a1) => (_utime = Module["_utime"] = wasmExports["utime"])(a0, a1);

var _unlink = Module["_unlink"] = a0 => (_unlink = Module["_unlink"] = wasmExports["unlink"])(a0);

var _access = Module["_access"] = (a0, a1) => (_access = Module["_access"] = wasmExports["access"])(a0, a1);

var _getuid = Module["_getuid"] = () => (_getuid = Module["_getuid"] = wasmExports["getuid"])();

var _geteuid = Module["_geteuid"] = () => (_geteuid = Module["_geteuid"] = wasmExports["geteuid"])();

var _flock = Module["_flock"] = (a0, a1) => (_flock = Module["_flock"] = wasmExports["flock"])(a0, a1);

var _fcntl = Module["_fcntl"] = (a0, a1, a2) => (_fcntl = Module["_fcntl"] = wasmExports["fcntl"])(a0, a1, a2);

var _ftruncate = Module["_ftruncate"] = (a0, a1, a2) => (_ftruncate = Module["_ftruncate"] = wasmExports["ftruncate"])(a0, a1, a2);

var _write = Module["_write"] = (a0, a1, a2) => (_write = Module["_write"] = wasmExports["write"])(a0, a1, a2);

var _opendir = Module["_opendir"] = a0 => (_opendir = Module["_opendir"] = wasmExports["opendir"])(a0);

var _closedir = Module["_closedir"] = a0 => (_closedir = Module["_closedir"] = wasmExports["closedir"])(a0);

var _readdir = Module["_readdir"] = a0 => (_readdir = Module["_readdir"] = wasmExports["readdir"])(a0);

var _zend_hash_real_init_mixed = Module["_zend_hash_real_init_mixed"] = a0 => (_zend_hash_real_init_mixed = Module["_zend_hash_real_init_mixed"] = wasmExports["zend_hash_real_init_mixed"])(a0);

var _zend_hash_rehash = Module["_zend_hash_rehash"] = a0 => (_zend_hash_rehash = Module["_zend_hash_rehash"] = wasmExports["zend_hash_rehash"])(a0);

var _zend_hash_del_bucket = Module["_zend_hash_del_bucket"] = (a0, a1) => (_zend_hash_del_bucket = Module["_zend_hash_del_bucket"] = wasmExports["zend_hash_del_bucket"])(a0, a1);

var _add_next_index_object = Module["_add_next_index_object"] = (a0, a1) => (_add_next_index_object = Module["_add_next_index_object"] = wasmExports["add_next_index_object"])(a0, a1);

var _php_spl_object_hash = Module["_php_spl_object_hash"] = a0 => (_php_spl_object_hash = Module["_php_spl_object_hash"] = wasmExports["php_spl_object_hash"])(a0);

var _zend_stream_init_filename_ex = Module["_zend_stream_init_filename_ex"] = (a0, a1) => (_zend_stream_init_filename_ex = Module["_zend_stream_init_filename_ex"] = wasmExports["zend_stream_init_filename_ex"])(a0, a1);

var _php_stream_open_for_zend_ex = Module["_php_stream_open_for_zend_ex"] = (a0, a1) => (_php_stream_open_for_zend_ex = Module["_php_stream_open_for_zend_ex"] = wasmExports["php_stream_open_for_zend_ex"])(a0, a1);

var _zend_execute = Module["_zend_execute"] = (a0, a1) => (_zend_execute = Module["_zend_execute"] = wasmExports["zend_execute"])(a0, a1);

var _destroy_op_array = Module["_destroy_op_array"] = a0 => (_destroy_op_array = Module["_destroy_op_array"] = wasmExports["destroy_op_array"])(a0);

var _zend_destroy_file_handle = Module["_zend_destroy_file_handle"] = a0 => (_zend_destroy_file_handle = Module["_zend_destroy_file_handle"] = wasmExports["zend_destroy_file_handle"])(a0);

var _zend_hash_internal_pointer_reset_ex = Module["_zend_hash_internal_pointer_reset_ex"] = (a0, a1) => (_zend_hash_internal_pointer_reset_ex = Module["_zend_hash_internal_pointer_reset_ex"] = wasmExports["zend_hash_internal_pointer_reset_ex"])(a0, a1);

var _zend_hash_move_forward_ex = Module["_zend_hash_move_forward_ex"] = (a0, a1) => (_zend_hash_move_forward_ex = Module["_zend_hash_move_forward_ex"] = wasmExports["zend_hash_move_forward_ex"])(a0, a1);

var _zend_hash_get_current_data_ex = Module["_zend_hash_get_current_data_ex"] = (a0, a1) => (_zend_hash_get_current_data_ex = Module["_zend_hash_get_current_data_ex"] = wasmExports["zend_hash_get_current_data_ex"])(a0, a1);

var _zend_mangle_property_name = Module["_zend_mangle_property_name"] = (a0, a1, a2, a3, a4) => (_zend_mangle_property_name = Module["_zend_mangle_property_name"] = wasmExports["zend_mangle_property_name"])(a0, a1, a2, a3, a4);

var _zend_get_callable_zval_from_fcc = Module["_zend_get_callable_zval_from_fcc"] = (a0, a1) => (_zend_get_callable_zval_from_fcc = Module["_zend_get_callable_zval_from_fcc"] = wasmExports["zend_get_callable_zval_from_fcc"])(a0, a1);

var _zend_iterator_dtor = Module["_zend_iterator_dtor"] = a0 => (_zend_iterator_dtor = Module["_zend_iterator_dtor"] = wasmExports["zend_iterator_dtor"])(a0);

var _spl_iterator_apply = Module["_spl_iterator_apply"] = (a0, a1, a2) => (_spl_iterator_apply = Module["_spl_iterator_apply"] = wasmExports["spl_iterator_apply"])(a0, a1, a2);

var _zend_array_to_list = Module["_zend_array_to_list"] = a0 => (_zend_array_to_list = Module["_zend_array_to_list"] = wasmExports["zend_array_to_list"])(a0);

var _zend_call_method = Module["_zend_call_method"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_zend_call_method = Module["_zend_call_method"] = wasmExports["zend_call_method"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _zend_call_known_instance_method_with_2_params = Module["_zend_call_known_instance_method_with_2_params"] = (a0, a1, a2, a3, a4) => (_zend_call_known_instance_method_with_2_params = Module["_zend_call_known_instance_method_with_2_params"] = wasmExports["zend_call_known_instance_method_with_2_params"])(a0, a1, a2, a3, a4);

var _array_set_zval_key = Module["_array_set_zval_key"] = (a0, a1, a2) => (_array_set_zval_key = Module["_array_set_zval_key"] = wasmExports["array_set_zval_key"])(a0, a1, a2);

var _zend_is_iterable = Module["_zend_is_iterable"] = a0 => (_zend_is_iterable = Module["_zend_is_iterable"] = wasmExports["zend_is_iterable"])(a0);

var _zend_hash_get_current_key_zval_ex = Module["_zend_hash_get_current_key_zval_ex"] = (a0, a1, a2) => (_zend_hash_get_current_key_zval_ex = Module["_zend_hash_get_current_key_zval_ex"] = wasmExports["zend_hash_get_current_key_zval_ex"])(a0, a1, a2);

var _zend_proptable_to_symtable = Module["_zend_proptable_to_symtable"] = (a0, a1) => (_zend_proptable_to_symtable = Module["_zend_proptable_to_symtable"] = wasmExports["zend_proptable_to_symtable"])(a0, a1);

var _zend_illegal_container_offset = Module["_zend_illegal_container_offset"] = (a0, a1, a2) => (_zend_illegal_container_offset = Module["_zend_illegal_container_offset"] = wasmExports["zend_illegal_container_offset"])(a0, a1, a2);

var _zend_use_resource_as_offset = Module["_zend_use_resource_as_offset"] = a0 => (_zend_use_resource_as_offset = Module["_zend_use_resource_as_offset"] = wasmExports["zend_use_resource_as_offset"])(a0);

var _zend_incompatible_double_to_long_error = Module["_zend_incompatible_double_to_long_error"] = a0 => (_zend_incompatible_double_to_long_error = Module["_zend_incompatible_double_to_long_error"] = wasmExports["zend_incompatible_double_to_long_error"])(a0);

var _zend_hash_get_current_key_ex = Module["_zend_hash_get_current_key_ex"] = (a0, a1, a2, a3) => (_zend_hash_get_current_key_ex = Module["_zend_hash_get_current_key_ex"] = wasmExports["zend_hash_get_current_key_ex"])(a0, a1, a2, a3);

var _zend_hash_iterator_del = Module["_zend_hash_iterator_del"] = a0 => (_zend_hash_iterator_del = Module["_zend_hash_iterator_del"] = wasmExports["zend_hash_iterator_del"])(a0);

var _zend_hash_get_current_key_type_ex = Module["_zend_hash_get_current_key_type_ex"] = (a0, a1) => (_zend_hash_get_current_key_type_ex = Module["_zend_hash_get_current_key_type_ex"] = wasmExports["zend_hash_get_current_key_type_ex"])(a0, a1);

var _zend_hash_iterator_add = Module["_zend_hash_iterator_add"] = (a0, a1) => (_zend_hash_iterator_add = Module["_zend_hash_iterator_add"] = wasmExports["zend_hash_iterator_add"])(a0, a1);

var _zend_hash_get_current_pos = Module["_zend_hash_get_current_pos"] = a0 => (_zend_hash_get_current_pos = Module["_zend_hash_get_current_pos"] = wasmExports["zend_hash_get_current_pos"])(a0);

var _zend_compare_symbol_tables = Module["_zend_compare_symbol_tables"] = (a0, a1) => (_zend_compare_symbol_tables = Module["_zend_compare_symbol_tables"] = wasmExports["zend_compare_symbol_tables"])(a0, a1);

var _zend_get_property_info = Module["_zend_get_property_info"] = (a0, a1, a2) => (_zend_get_property_info = Module["_zend_get_property_info"] = wasmExports["zend_get_property_info"])(a0, a1, a2);

var _zend_ref_add_type_source = Module["_zend_ref_add_type_source"] = (a0, a1) => (_zend_ref_add_type_source = Module["_zend_ref_add_type_source"] = wasmExports["zend_ref_add_type_source"])(a0, a1);

var _spl_filesystem_object_get_path = Module["_spl_filesystem_object_get_path"] = a0 => (_spl_filesystem_object_get_path = Module["_spl_filesystem_object_get_path"] = wasmExports["spl_filesystem_object_get_path"])(a0);

var __php_glob_stream_get_path = Module["__php_glob_stream_get_path"] = (a0, a1) => (__php_glob_stream_get_path = Module["__php_glob_stream_get_path"] = wasmExports["_php_glob_stream_get_path"])(a0, a1);

var __php_stream_seek = Module["__php_stream_seek"] = (a0, a1, a2) => (__php_stream_seek = Module["__php_stream_seek"] = wasmExports["_php_stream_seek"])(a0, a1, a2);

var _php_basename = Module["_php_basename"] = (a0, a1, a2, a3) => (_php_basename = Module["_php_basename"] = wasmExports["php_basename"])(a0, a1, a2, a3);

var _php_stat = Module["_php_stat"] = (a0, a1, a2) => (_php_stat = Module["_php_stat"] = wasmExports["php_stat"])(a0, a1, a2);

var _expand_filepath_with_mode = Module["_expand_filepath_with_mode"] = (a0, a1, a2, a3, a4) => (_expand_filepath_with_mode = Module["_expand_filepath_with_mode"] = wasmExports["expand_filepath_with_mode"])(a0, a1, a2, a3, a4);

var _readlink = Module["_readlink"] = (a0, a1, a2) => (_readlink = Module["_readlink"] = wasmExports["readlink"])(a0, a1, a2);

var _tsrm_realpath = Module["_tsrm_realpath"] = (a0, a1) => (_tsrm_realpath = Module["_tsrm_realpath"] = wasmExports["tsrm_realpath"])(a0, a1);

var _php_dirname = Module["_php_dirname"] = (a0, a1) => (_php_dirname = Module["_php_dirname"] = wasmExports["php_dirname"])(a0, a1);

var __php_glob_stream_get_count = Module["__php_glob_stream_get_count"] = (a0, a1) => (__php_glob_stream_get_count = Module["__php_glob_stream_get_count"] = wasmExports["_php_glob_stream_get_count"])(a0, a1);

var __php_stream_eof = Module["__php_stream_eof"] = a0 => (__php_stream_eof = Module["__php_stream_eof"] = wasmExports["_php_stream_eof"])(a0);

var _php_fputcsv = Module["_php_fputcsv"] = (a0, a1, a2, a3, a4, a5) => (_php_fputcsv = Module["_php_fputcsv"] = wasmExports["php_fputcsv"])(a0, a1, a2, a3, a4, a5);

var _php_flock_common = Module["_php_flock_common"] = (a0, a1, a2, a3, a4) => (_php_flock_common = Module["_php_flock_common"] = wasmExports["php_flock_common"])(a0, a1, a2, a3, a4);

var __php_stream_flush = Module["__php_stream_flush"] = (a0, a1) => (__php_stream_flush = Module["__php_stream_flush"] = wasmExports["_php_stream_flush"])(a0, a1);

var __php_stream_tell = Module["__php_stream_tell"] = a0 => (__php_stream_tell = Module["__php_stream_tell"] = wasmExports["_php_stream_tell"])(a0);

var __php_stream_getc = Module["__php_stream_getc"] = a0 => (__php_stream_getc = Module["__php_stream_getc"] = wasmExports["_php_stream_getc"])(a0);

var __php_stream_passthru = Module["__php_stream_passthru"] = a0 => (__php_stream_passthru = Module["__php_stream_passthru"] = wasmExports["_php_stream_passthru"])(a0);

var _php_sscanf_internal = Module["_php_sscanf_internal"] = (a0, a1, a2, a3, a4, a5) => (_php_sscanf_internal = Module["_php_sscanf_internal"] = wasmExports["php_sscanf_internal"])(a0, a1, a2, a3, a4, a5);

var _zend_wrong_param_count = Module["_zend_wrong_param_count"] = () => (_zend_wrong_param_count = Module["_zend_wrong_param_count"] = wasmExports["zend_wrong_param_count"])();

var _php_stream_read_to_str = Module["_php_stream_read_to_str"] = (a0, a1) => (_php_stream_read_to_str = Module["_php_stream_read_to_str"] = wasmExports["php_stream_read_to_str"])(a0, a1);

var _php_fstat = Module["_php_fstat"] = (a0, a1) => (_php_fstat = Module["_php_fstat"] = wasmExports["php_fstat"])(a0, a1);

var __php_stream_set_option = Module["__php_stream_set_option"] = (a0, a1, a2, a3) => (__php_stream_set_option = Module["__php_stream_set_option"] = wasmExports["_php_stream_set_option"])(a0, a1, a2, a3);

var __php_stream_truncate_set_size = Module["__php_stream_truncate_set_size"] = (a0, a1) => (__php_stream_truncate_set_size = Module["__php_stream_truncate_set_size"] = wasmExports["_php_stream_truncate_set_size"])(a0, a1);

var __php_stream_opendir = Module["__php_stream_opendir"] = (a0, a1, a2) => (__php_stream_opendir = Module["__php_stream_opendir"] = wasmExports["_php_stream_opendir"])(a0, a1, a2);

var __php_stream_readdir = Module["__php_stream_readdir"] = (a0, a1) => (__php_stream_readdir = Module["__php_stream_readdir"] = wasmExports["_php_stream_readdir"])(a0, a1);

var _php_fgetcsv = Module["_php_fgetcsv"] = (a0, a1, a2, a3, a4, a5) => (_php_fgetcsv = Module["_php_fgetcsv"] = wasmExports["php_fgetcsv"])(a0, a1, a2, a3, a4, a5);

var _php_bc_fgetcsv_empty_line = Module["_php_bc_fgetcsv_empty_line"] = () => (_php_bc_fgetcsv_empty_line = Module["_php_bc_fgetcsv_empty_line"] = wasmExports["php_bc_fgetcsv_empty_line"])();

var _zend_objects_destroy_object = Module["_zend_objects_destroy_object"] = a0 => (_zend_objects_destroy_object = Module["_zend_objects_destroy_object"] = wasmExports["zend_objects_destroy_object"])(a0);

var _php_count_recursive = Module["_php_count_recursive"] = a0 => (_php_count_recursive = Module["_php_count_recursive"] = wasmExports["php_count_recursive"])(a0);

var _var_push_dtor = Module["_var_push_dtor"] = (a0, a1) => (_var_push_dtor = Module["_var_push_dtor"] = wasmExports["var_push_dtor"])(a0, a1);

var _var_replace = Module["_var_replace"] = (a0, a1, a2) => (_var_replace = Module["_var_replace"] = wasmExports["var_replace"])(a0, a1, a2);

var _zend_hash_index_lookup = Module["_zend_hash_index_lookup"] = (a0, a1) => (_zend_hash_index_lookup = Module["_zend_hash_index_lookup"] = wasmExports["zend_hash_index_lookup"])(a0, a1);

var _zend_is_identical = Module["_zend_is_identical"] = (a0, a1) => (_zend_is_identical = Module["_zend_is_identical"] = wasmExports["zend_is_identical"])(a0, a1);

var _zend_hash_compare = Module["_zend_hash_compare"] = (a0, a1, a2, a3) => (_zend_hash_compare = Module["_zend_hash_compare"] = wasmExports["zend_hash_compare"])(a0, a1, a2, a3);

var _zend_compare = Module["_zend_compare"] = (a0, a1) => (_zend_compare = Module["_zend_compare"] = wasmExports["zend_compare"])(a0, a1);

var _zend_std_read_dimension = Module["_zend_std_read_dimension"] = (a0, a1, a2, a3) => (_zend_std_read_dimension = Module["_zend_std_read_dimension"] = wasmExports["zend_std_read_dimension"])(a0, a1, a2, a3);

var _zend_std_write_dimension = Module["_zend_std_write_dimension"] = (a0, a1, a2) => (_zend_std_write_dimension = Module["_zend_std_write_dimension"] = wasmExports["zend_std_write_dimension"])(a0, a1, a2);

var _zend_std_has_dimension = Module["_zend_std_has_dimension"] = (a0, a1, a2) => (_zend_std_has_dimension = Module["_zend_std_has_dimension"] = wasmExports["zend_std_has_dimension"])(a0, a1, a2);

var _zend_std_unset_dimension = Module["_zend_std_unset_dimension"] = (a0, a1) => (_zend_std_unset_dimension = Module["_zend_std_unset_dimension"] = wasmExports["zend_std_unset_dimension"])(a0, a1);

var __safe_erealloc = Module["__safe_erealloc"] = (a0, a1, a2, a3) => (__safe_erealloc = Module["__safe_erealloc"] = wasmExports["_safe_erealloc"])(a0, a1, a2, a3);

var _zend_user_it_invalidate_current = Module["_zend_user_it_invalidate_current"] = a0 => (_zend_user_it_invalidate_current = Module["_zend_user_it_invalidate_current"] = wasmExports["zend_user_it_invalidate_current"])(a0);

var _strtoul = Module["_strtoul"] = (a0, a1, a2) => (_strtoul = Module["_strtoul"] = wasmExports["strtoul"])(a0, a1, a2);

var _strcspn = Module["_strcspn"] = (a0, a1) => (_strcspn = Module["_strcspn"] = wasmExports["strcspn"])(a0, a1);

var _realloc = Module["_realloc"] = (a0, a1) => (_realloc = Module["_realloc"] = wasmExports["realloc"])(a0, a1);

var _strcat = Module["_strcat"] = (a0, a1) => (_strcat = Module["_strcat"] = wasmExports["strcat"])(a0, a1);

var _zend_hash_minmax = Module["_zend_hash_minmax"] = (a0, a1, a2) => (_zend_hash_minmax = Module["_zend_hash_minmax"] = wasmExports["zend_hash_minmax"])(a0, a1, a2);

var _php_prefix_varname = Module["_php_prefix_varname"] = (a0, a1, a2, a3, a4) => (_php_prefix_varname = Module["_php_prefix_varname"] = wasmExports["php_prefix_varname"])(a0, a1, a2, a3, a4);

var _zend_rebuild_symbol_table = Module["_zend_rebuild_symbol_table"] = () => (_zend_rebuild_symbol_table = Module["_zend_rebuild_symbol_table"] = wasmExports["zend_rebuild_symbol_table"])();

var _zend_hash_real_init_packed = Module["_zend_hash_real_init_packed"] = a0 => (_zend_hash_real_init_packed = Module["_zend_hash_real_init_packed"] = wasmExports["zend_hash_real_init_packed"])(a0);

var __php_math_round = Module["__php_math_round"] = (a0, a1, a2) => (__php_math_round = Module["__php_math_round"] = wasmExports["_php_math_round"])(a0, a1, a2);

var _zend_hash_to_packed = Module["_zend_hash_to_packed"] = a0 => (_zend_hash_to_packed = Module["_zend_hash_to_packed"] = wasmExports["zend_hash_to_packed"])(a0);

var _zend_hash_iterators_lower_pos = Module["_zend_hash_iterators_lower_pos"] = (a0, a1) => (_zend_hash_iterators_lower_pos = Module["_zend_hash_iterators_lower_pos"] = wasmExports["zend_hash_iterators_lower_pos"])(a0, a1);

var _zend_hash_packed_del_val = Module["_zend_hash_packed_del_val"] = (a0, a1) => (_zend_hash_packed_del_val = Module["_zend_hash_packed_del_val"] = wasmExports["zend_hash_packed_del_val"])(a0, a1);

var _zend_hash_iterators_advance = Module["_zend_hash_iterators_advance"] = (a0, a1) => (_zend_hash_iterators_advance = Module["_zend_hash_iterators_advance"] = wasmExports["zend_hash_iterators_advance"])(a0, a1);

var _convert_to_array = Module["_convert_to_array"] = a0 => (_convert_to_array = Module["_convert_to_array"] = wasmExports["convert_to_array"])(a0);

var _php_array_merge_recursive = Module["_php_array_merge_recursive"] = (a0, a1) => (_php_array_merge_recursive = Module["_php_array_merge_recursive"] = wasmExports["php_array_merge_recursive"])(a0, a1);

var _zend_hash_find_known_hash = Module["_zend_hash_find_known_hash"] = (a0, a1) => (_zend_hash_find_known_hash = Module["_zend_hash_find_known_hash"] = wasmExports["zend_hash_find_known_hash"])(a0, a1);

var _zend_cannot_add_element = Module["_zend_cannot_add_element"] = () => (_zend_cannot_add_element = Module["_zend_cannot_add_element"] = wasmExports["zend_cannot_add_element"])();

var _php_array_merge = Module["_php_array_merge"] = (a0, a1) => (_php_array_merge = Module["_php_array_merge"] = wasmExports["php_array_merge"])(a0, a1);

var _zend_hash_extend = Module["_zend_hash_extend"] = (a0, a1, a2) => (_zend_hash_extend = Module["_zend_hash_extend"] = wasmExports["zend_hash_extend"])(a0, a1, a2);

var _php_array_replace_recursive = Module["_php_array_replace_recursive"] = (a0, a1) => (_php_array_replace_recursive = Module["_php_array_replace_recursive"] = wasmExports["php_array_replace_recursive"])(a0, a1);

var _zend_hash_internal_pointer_end_ex = Module["_zend_hash_internal_pointer_end_ex"] = (a0, a1) => (_zend_hash_internal_pointer_end_ex = Module["_zend_hash_internal_pointer_end_ex"] = wasmExports["zend_hash_internal_pointer_end_ex"])(a0, a1);

var _zend_hash_add_empty_element = Module["_zend_hash_add_empty_element"] = (a0, a1) => (_zend_hash_add_empty_element = Module["_zend_hash_add_empty_element"] = wasmExports["zend_hash_add_empty_element"])(a0, a1);

var _zend_sort = Module["_zend_sort"] = (a0, a1, a2, a3, a4) => (_zend_sort = Module["_zend_sort"] = wasmExports["zend_sort"])(a0, a1, a2, a3, a4);

var _php_multisort_compare = Module["_php_multisort_compare"] = (a0, a1) => (_php_multisort_compare = Module["_php_multisort_compare"] = wasmExports["php_multisort_compare"])(a0, a1);

var _add_function = Module["_add_function"] = (a0, a1, a2) => (_add_function = Module["_add_function"] = wasmExports["add_function"])(a0, a1, a2);

var _mul_function = Module["_mul_function"] = (a0, a1, a2) => (_mul_function = Module["_mul_function"] = wasmExports["mul_function"])(a0, a1, a2);

var _zend_hash_real_init = Module["_zend_hash_real_init"] = (a0, a1) => (_zend_hash_real_init = Module["_zend_hash_real_init"] = wasmExports["zend_hash_real_init"])(a0, a1);

var _zend_binary_strcasecmp_l = Module["_zend_binary_strcasecmp_l"] = (a0, a1, a2, a3) => (_zend_binary_strcasecmp_l = Module["_zend_binary_strcasecmp_l"] = wasmExports["zend_binary_strcasecmp_l"])(a0, a1, a2, a3);

var _zend_binary_strcmp = Module["_zend_binary_strcmp"] = (a0, a1, a2, a3) => (_zend_binary_strcmp = Module["_zend_binary_strcmp"] = wasmExports["zend_binary_strcmp"])(a0, a1, a2, a3);

var _strnatcmp_ex = Module["_strnatcmp_ex"] = (a0, a1, a2, a3, a4) => (_strnatcmp_ex = Module["_strnatcmp_ex"] = wasmExports["strnatcmp_ex"])(a0, a1, a2, a3, a4);

var _strcoll = Module["_strcoll"] = (a0, a1) => (_strcoll = Module["_strcoll"] = wasmExports["strcoll"])(a0, a1);

var _zendi_smart_strcmp = Module["_zendi_smart_strcmp"] = (a0, a1) => (_zendi_smart_strcmp = Module["_zendi_smart_strcmp"] = wasmExports["zendi_smart_strcmp"])(a0, a1);

var _zend_hash_sort_ex = Module["_zend_hash_sort_ex"] = (a0, a1, a2, a3) => (_zend_hash_sort_ex = Module["_zend_hash_sort_ex"] = wasmExports["zend_hash_sort_ex"])(a0, a1, a2, a3);

var _numeric_compare_function = Module["_numeric_compare_function"] = (a0, a1) => (_numeric_compare_function = Module["_numeric_compare_function"] = wasmExports["numeric_compare_function"])(a0, a1);

var _string_case_compare_function = Module["_string_case_compare_function"] = (a0, a1) => (_string_case_compare_function = Module["_string_case_compare_function"] = wasmExports["string_case_compare_function"])(a0, a1);

var _string_compare_function = Module["_string_compare_function"] = (a0, a1) => (_string_compare_function = Module["_string_compare_function"] = wasmExports["string_compare_function"])(a0, a1);

var _string_locale_compare_function = Module["_string_locale_compare_function"] = (a0, a1) => (_string_locale_compare_function = Module["_string_locale_compare_function"] = wasmExports["string_locale_compare_function"])(a0, a1);

var _zend_hash_move_backwards_ex = Module["_zend_hash_move_backwards_ex"] = (a0, a1) => (_zend_hash_move_backwards_ex = Module["_zend_hash_move_backwards_ex"] = wasmExports["zend_hash_move_backwards_ex"])(a0, a1);

var _zend_hash_iterator_pos_ex = Module["_zend_hash_iterator_pos_ex"] = (a0, a1) => (_zend_hash_iterator_pos_ex = Module["_zend_hash_iterator_pos_ex"] = wasmExports["zend_hash_iterator_pos_ex"])(a0, a1);

var _zend_hash_iterator_pos = Module["_zend_hash_iterator_pos"] = (a0, a1) => (_zend_hash_iterator_pos = Module["_zend_hash_iterator_pos"] = wasmExports["zend_hash_iterator_pos"])(a0, a1);

var _zendi_smart_streq = Module["_zendi_smart_streq"] = (a0, a1) => (_zendi_smart_streq = Module["_zendi_smart_streq"] = wasmExports["zendi_smart_streq"])(a0, a1);

var _zend_try_assign_typed_ref_zval_ex = Module["_zend_try_assign_typed_ref_zval_ex"] = (a0, a1, a2) => (_zend_try_assign_typed_ref_zval_ex = Module["_zend_try_assign_typed_ref_zval_ex"] = wasmExports["zend_try_assign_typed_ref_zval_ex"])(a0, a1, a2);

var _zend_get_this_object = Module["_zend_get_this_object"] = a0 => (_zend_get_this_object = Module["_zend_get_this_object"] = wasmExports["zend_get_this_object"])(a0);

var _zend_parse_arg_number_or_str_slow = Module["_zend_parse_arg_number_or_str_slow"] = (a0, a1, a2) => (_zend_parse_arg_number_or_str_slow = Module["_zend_parse_arg_number_or_str_slow"] = wasmExports["zend_parse_arg_number_or_str_slow"])(a0, a1, a2);

var _zend_parse_arg_number_slow = Module["_zend_parse_arg_number_slow"] = (a0, a1, a2) => (_zend_parse_arg_number_slow = Module["_zend_parse_arg_number_slow"] = wasmExports["zend_parse_arg_number_slow"])(a0, a1, a2);

var _get_active_function_arg_name = Module["_get_active_function_arg_name"] = a0 => (_get_active_function_arg_name = Module["_get_active_function_arg_name"] = wasmExports["get_active_function_arg_name"])(a0);

var __zend_hash_iterators_update = Module["__zend_hash_iterators_update"] = (a0, a1, a2) => (__zend_hash_iterators_update = Module["__zend_hash_iterators_update"] = wasmExports["_zend_hash_iterators_update"])(a0, a1, a2);

var _zend_hash_merge = Module["_zend_hash_merge"] = (a0, a1, a2, a3) => (_zend_hash_merge = Module["_zend_hash_merge"] = wasmExports["zend_hash_merge"])(a0, a1, a2, a3);

var _zend_string_toupper_ex = Module["_zend_string_toupper_ex"] = (a0, a1) => (_zend_string_toupper_ex = Module["_zend_string_toupper_ex"] = wasmExports["zend_string_toupper_ex"])(a0, a1);

var _zend_hash_bucket_swap = Module["_zend_hash_bucket_swap"] = (a0, a1) => (_zend_hash_bucket_swap = Module["_zend_hash_bucket_swap"] = wasmExports["zend_hash_bucket_swap"])(a0, a1);

var _zend_string_hash_func = Module["_zend_string_hash_func"] = a0 => (_zend_string_hash_func = Module["_zend_string_hash_func"] = wasmExports["zend_string_hash_func"])(a0);

var _php_base64_encode = Module["_php_base64_encode"] = (a0, a1) => (_php_base64_encode = Module["_php_base64_encode"] = wasmExports["php_base64_encode"])(a0, a1);

var _php_base64_decode_ex = Module["_php_base64_decode_ex"] = (a0, a1, a2) => (_php_base64_decode_ex = Module["_php_base64_decode_ex"] = wasmExports["php_base64_decode_ex"])(a0, a1, a2);

var _php_get_nan = Module["_php_get_nan"] = () => (_php_get_nan = Module["_php_get_nan"] = wasmExports["php_get_nan"])();

var _php_get_inf = Module["_php_get_inf"] = () => (_php_get_inf = Module["_php_get_inf"] = wasmExports["php_get_inf"])();

var _php_register_incomplete_class_handlers = Module["_php_register_incomplete_class_handlers"] = () => (_php_register_incomplete_class_handlers = Module["_php_register_incomplete_class_handlers"] = wasmExports["php_register_incomplete_class_handlers"])();

var _php_register_url_stream_wrapper = Module["_php_register_url_stream_wrapper"] = (a0, a1) => (_php_register_url_stream_wrapper = Module["_php_register_url_stream_wrapper"] = wasmExports["php_register_url_stream_wrapper"])(a0, a1);

var _php_unregister_url_stream_wrapper = Module["_php_unregister_url_stream_wrapper"] = a0 => (_php_unregister_url_stream_wrapper = Module["_php_unregister_url_stream_wrapper"] = wasmExports["php_unregister_url_stream_wrapper"])(a0);

var _umask = Module["_umask"] = a0 => (_umask = Module["_umask"] = wasmExports["umask"])(a0);

var _setlocale = Module["_setlocale"] = (a0, a1) => (_setlocale = Module["_setlocale"] = wasmExports["setlocale"])(a0, a1);

var _zend_reset_lc_ctype_locale = Module["_zend_reset_lc_ctype_locale"] = () => (_zend_reset_lc_ctype_locale = Module["_zend_reset_lc_ctype_locale"] = wasmExports["zend_reset_lc_ctype_locale"])();

var _zend_update_current_locale = Module["_zend_update_current_locale"] = () => (_zend_update_current_locale = Module["_zend_update_current_locale"] = wasmExports["zend_update_current_locale"])();

var _zend_llist_destroy = Module["_zend_llist_destroy"] = a0 => (_zend_llist_destroy = Module["_zend_llist_destroy"] = wasmExports["zend_llist_destroy"])(a0);

var _zend_get_executed_scope = Module["_zend_get_executed_scope"] = () => (_zend_get_executed_scope = Module["_zend_get_executed_scope"] = wasmExports["zend_get_executed_scope"])();

var _zend_get_constant_ex = Module["_zend_get_constant_ex"] = (a0, a1, a2) => (_zend_get_constant_ex = Module["_zend_get_constant_ex"] = wasmExports["zend_get_constant_ex"])(a0, a1, a2);

var _inet_ntop = Module["_inet_ntop"] = (a0, a1, a2, a3) => (_inet_ntop = Module["_inet_ntop"] = wasmExports["inet_ntop"])(a0, a1, a2, a3);

var _inet_pton = Module["_inet_pton"] = (a0, a1, a2) => (_inet_pton = Module["_inet_pton"] = wasmExports["inet_pton"])(a0, a1, a2);

var _ntohl = Module["_ntohl"] = a0 => (_ntohl = Module["_ntohl"] = wasmExports["ntohl"])(a0);

var _htonl = a0 => (_htonl = wasmExports["htonl"])(a0);

var _php_getenv = Module["_php_getenv"] = (a0, a1) => (_php_getenv = Module["_php_getenv"] = wasmExports["php_getenv"])(a0, a1);

var _getenv = Module["_getenv"] = a0 => (_getenv = Module["_getenv"] = wasmExports["getenv"])(a0);

var _sapi_getenv = Module["_sapi_getenv"] = (a0, a1) => (_sapi_getenv = Module["_sapi_getenv"] = wasmExports["sapi_getenv"])(a0, a1);

var _zend_strndup = Module["_zend_strndup"] = (a0, a1) => (_zend_strndup = Module["_zend_strndup"] = wasmExports["zend_strndup"])(a0, a1);

var _unsetenv = Module["_unsetenv"] = a0 => (_unsetenv = Module["_unsetenv"] = wasmExports["unsetenv"])(a0);

var _tzset = Module["_tzset"] = () => (_tzset = Module["_tzset"] = wasmExports["tzset"])();

var _zend_is_auto_global = Module["_zend_is_auto_global"] = a0 => (_zend_is_auto_global = Module["_zend_is_auto_global"] = wasmExports["zend_is_auto_global"])(a0);

var _php_getopt = Module["_php_getopt"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_getopt = Module["_php_getopt"] = wasmExports["php_getopt"])(a0, a1, a2, a3, a4, a5, a6);

var _atoi = Module["_atoi"] = a0 => (_atoi = Module["_atoi"] = wasmExports["atoi"])(a0);

var _sapi_flush = Module["_sapi_flush"] = () => (_sapi_flush = Module["_sapi_flush"] = wasmExports["sapi_flush"])();

var _sleep = a0 => (_sleep = wasmExports["sleep"])(a0);

var _usleep = Module["_usleep"] = a0 => (_usleep = Module["_usleep"] = wasmExports["usleep"])(a0);

var _nanosleep = Module["_nanosleep"] = (a0, a1) => (_nanosleep = Module["_nanosleep"] = wasmExports["nanosleep"])(a0, a1);

var _php_get_current_user = Module["_php_get_current_user"] = () => (_php_get_current_user = Module["_php_get_current_user"] = wasmExports["php_get_current_user"])();

var _cfg_get_entry_ex = Module["_cfg_get_entry_ex"] = a0 => (_cfg_get_entry_ex = Module["_cfg_get_entry_ex"] = wasmExports["cfg_get_entry_ex"])(a0);

var __php_error_log_ex = Module["__php_error_log_ex"] = (a0, a1, a2, a3, a4) => (__php_error_log_ex = Module["__php_error_log_ex"] = wasmExports["_php_error_log_ex"])(a0, a1, a2, a3, a4);

var __php_error_log = Module["__php_error_log"] = (a0, a1, a2, a3) => (__php_error_log = Module["__php_error_log"] = wasmExports["_php_error_log"])(a0, a1, a2, a3);

var _php_mail = Module["_php_mail"] = (a0, a1, a2, a3, a4) => (_php_mail = Module["_php_mail"] = wasmExports["php_mail"])(a0, a1, a2, a3, a4);

var _php_log_err_with_severity = Module["_php_log_err_with_severity"] = (a0, a1) => (_php_log_err_with_severity = Module["_php_log_err_with_severity"] = wasmExports["php_log_err_with_severity"])(a0, a1);

var _zend_get_called_scope = Module["_zend_get_called_scope"] = a0 => (_zend_get_called_scope = Module["_zend_get_called_scope"] = wasmExports["zend_get_called_scope"])(a0);

var _php_call_shutdown_functions = Module["_php_call_shutdown_functions"] = () => (_php_call_shutdown_functions = Module["_php_call_shutdown_functions"] = wasmExports["php_call_shutdown_functions"])();

var _zend_hash_apply = Module["_zend_hash_apply"] = (a0, a1) => (_zend_hash_apply = Module["_zend_hash_apply"] = wasmExports["zend_hash_apply"])(a0, a1);

var _php_free_shutdown_functions = Module["_php_free_shutdown_functions"] = () => (_php_free_shutdown_functions = Module["_php_free_shutdown_functions"] = wasmExports["php_free_shutdown_functions"])();

var _zend_fcall_info_argp = Module["_zend_fcall_info_argp"] = (a0, a1, a2) => (_zend_fcall_info_argp = Module["_zend_fcall_info_argp"] = wasmExports["zend_fcall_info_argp"])(a0, a1, a2);

var _php_get_highlight_struct = Module["_php_get_highlight_struct"] = a0 => (_php_get_highlight_struct = Module["_php_get_highlight_struct"] = wasmExports["php_get_highlight_struct"])(a0);

var _zend_ini_string_ex = Module["_zend_ini_string_ex"] = (a0, a1, a2, a3) => (_zend_ini_string_ex = Module["_zend_ini_string_ex"] = wasmExports["zend_ini_string_ex"])(a0, a1, a2, a3);

var _php_output_start_default = Module["_php_output_start_default"] = () => (_php_output_start_default = Module["_php_output_start_default"] = wasmExports["php_output_start_default"])();

var _highlight_file = Module["_highlight_file"] = (a0, a1) => (_highlight_file = Module["_highlight_file"] = wasmExports["highlight_file"])(a0, a1);

var _php_output_end = Module["_php_output_end"] = () => (_php_output_end = Module["_php_output_end"] = wasmExports["php_output_end"])();

var _php_output_get_contents = Module["_php_output_get_contents"] = a0 => (_php_output_get_contents = Module["_php_output_get_contents"] = wasmExports["php_output_get_contents"])(a0);

var _php_output_discard = Module["_php_output_discard"] = () => (_php_output_discard = Module["_php_output_discard"] = wasmExports["php_output_discard"])();

var _zend_save_lexical_state = Module["_zend_save_lexical_state"] = a0 => (_zend_save_lexical_state = Module["_zend_save_lexical_state"] = wasmExports["zend_save_lexical_state"])(a0);

var _open_file_for_scanning = Module["_open_file_for_scanning"] = a0 => (_open_file_for_scanning = Module["_open_file_for_scanning"] = wasmExports["open_file_for_scanning"])(a0);

var _zend_restore_lexical_state = Module["_zend_restore_lexical_state"] = a0 => (_zend_restore_lexical_state = Module["_zend_restore_lexical_state"] = wasmExports["zend_restore_lexical_state"])(a0);

var _zend_strip = Module["_zend_strip"] = () => (_zend_strip = Module["_zend_strip"] = wasmExports["zend_strip"])();

var _zend_make_compiled_string_description = Module["_zend_make_compiled_string_description"] = a0 => (_zend_make_compiled_string_description = Module["_zend_make_compiled_string_description"] = wasmExports["zend_make_compiled_string_description"])(a0);

var _highlight_string = Module["_highlight_string"] = (a0, a1, a2) => (_highlight_string = Module["_highlight_string"] = wasmExports["highlight_string"])(a0, a1, a2);

var _zend_ini_parse_quantity = Module["_zend_ini_parse_quantity"] = (a0, a1) => (_zend_ini_parse_quantity = Module["_zend_ini_parse_quantity"] = wasmExports["zend_ini_parse_quantity"])(a0, a1);

var _zend_ini_get_value = Module["_zend_ini_get_value"] = a0 => (_zend_ini_get_value = Module["_zend_ini_get_value"] = wasmExports["zend_ini_get_value"])(a0);

var _zend_ini_sort_entries = Module["_zend_ini_sort_entries"] = () => (_zend_ini_sort_entries = Module["_zend_ini_sort_entries"] = wasmExports["zend_ini_sort_entries"])();

var _zend_restore_ini_entry = Module["_zend_restore_ini_entry"] = (a0, a1) => (_zend_restore_ini_entry = Module["_zend_restore_ini_entry"] = wasmExports["zend_restore_ini_entry"])(a0, a1);

var _zend_print_zval_r_to_str = Module["_zend_print_zval_r_to_str"] = (a0, a1) => (_zend_print_zval_r_to_str = Module["_zend_print_zval_r_to_str"] = wasmExports["zend_print_zval_r_to_str"])(a0, a1);

var _zend_print_zval_r = Module["_zend_print_zval_r"] = (a0, a1) => (_zend_print_zval_r = Module["_zend_print_zval_r"] = wasmExports["zend_print_zval_r"])(a0, a1);

var _getservbyname = Module["_getservbyname"] = (a0, a1) => (_getservbyname = Module["_getservbyname"] = wasmExports["getservbyname"])(a0, a1);

var _ntohs = a0 => (_ntohs = wasmExports["ntohs"])(a0);

var _getservbyport = Module["_getservbyport"] = (a0, a1) => (_getservbyport = Module["_getservbyport"] = wasmExports["getservbyport"])(a0, a1);

var _htons = a0 => (_htons = wasmExports["htons"])(a0);

var _zend_llist_init = Module["_zend_llist_init"] = (a0, a1, a2, a3) => (_zend_llist_init = Module["_zend_llist_init"] = wasmExports["zend_llist_init"])(a0, a1, a2, a3);

var _php_add_tick_function = Module["_php_add_tick_function"] = (a0, a1) => (_php_add_tick_function = Module["_php_add_tick_function"] = wasmExports["php_add_tick_function"])(a0, a1);

var _zend_llist_add_element = Module["_zend_llist_add_element"] = (a0, a1) => (_zend_llist_add_element = Module["_zend_llist_add_element"] = wasmExports["zend_llist_add_element"])(a0, a1);

var _zend_llist_del_element = Module["_zend_llist_del_element"] = (a0, a1, a2) => (_zend_llist_del_element = Module["_zend_llist_del_element"] = wasmExports["zend_llist_del_element"])(a0, a1, a2);

var _rename = Module["_rename"] = (a0, a1) => (_rename = Module["_rename"] = wasmExports["rename"])(a0, a1);

var _chmod = Module["_chmod"] = (a0, a1) => (_chmod = Module["_chmod"] = wasmExports["chmod"])(a0, a1);

var _php_copy_file_ex = Module["_php_copy_file_ex"] = (a0, a1, a2) => (_php_copy_file_ex = Module["_php_copy_file_ex"] = wasmExports["php_copy_file_ex"])(a0, a1, a2);

var _zend_parse_ini_file = Module["_zend_parse_ini_file"] = (a0, a1, a2, a3, a4) => (_zend_parse_ini_file = Module["_zend_parse_ini_file"] = wasmExports["zend_parse_ini_file"])(a0, a1, a2, a3, a4);

var _zend_parse_ini_string = Module["_zend_parse_ini_string"] = (a0, a1, a2, a3, a4) => (_zend_parse_ini_string = Module["_zend_parse_ini_string"] = wasmExports["zend_parse_ini_string"])(a0, a1, a2, a3, a4);

var _add_index_double = Module["_add_index_double"] = (a0, a1, a2) => (_add_index_double = Module["_add_index_double"] = wasmExports["add_index_double"])(a0, a1, a2);

var _zif_rewind = Module["_zif_rewind"] = (a0, a1) => (_zif_rewind = Module["_zif_rewind"] = wasmExports["zif_rewind"])(a0, a1);

var _zif_fclose = Module["_zif_fclose"] = (a0, a1) => (_zif_fclose = Module["_zif_fclose"] = wasmExports["zif_fclose"])(a0, a1);

var _zif_feof = Module["_zif_feof"] = (a0, a1) => (_zif_feof = Module["_zif_feof"] = wasmExports["zif_feof"])(a0, a1);

var _zif_fgetc = Module["_zif_fgetc"] = (a0, a1) => (_zif_fgetc = Module["_zif_fgetc"] = wasmExports["zif_fgetc"])(a0, a1);

var _zif_fgets = Module["_zif_fgets"] = (a0, a1) => (_zif_fgets = Module["_zif_fgets"] = wasmExports["zif_fgets"])(a0, a1);

var _zif_fread = Module["_zif_fread"] = (a0, a1) => (_zif_fread = Module["_zif_fread"] = wasmExports["zif_fread"])(a0, a1);

var _zif_fpassthru = Module["_zif_fpassthru"] = (a0, a1) => (_zif_fpassthru = Module["_zif_fpassthru"] = wasmExports["zif_fpassthru"])(a0, a1);

var _zif_fseek = Module["_zif_fseek"] = (a0, a1) => (_zif_fseek = Module["_zif_fseek"] = wasmExports["zif_fseek"])(a0, a1);

var _zif_ftell = Module["_zif_ftell"] = (a0, a1) => (_zif_ftell = Module["_zif_ftell"] = wasmExports["zif_ftell"])(a0, a1);

var _zif_fflush = Module["_zif_fflush"] = (a0, a1) => (_zif_fflush = Module["_zif_fflush"] = wasmExports["zif_fflush"])(a0, a1);

var _zif_fwrite = Module["_zif_fwrite"] = (a0, a1) => (_zif_fwrite = Module["_zif_fwrite"] = wasmExports["zif_fwrite"])(a0, a1);

var _zend_register_double_constant = Module["_zend_register_double_constant"] = (a0, a1, a2, a3, a4) => (_zend_register_double_constant = Module["_zend_register_double_constant"] = wasmExports["zend_register_double_constant"])(a0, a1, a2, a3, a4);

var _zend_llist_apply = Module["_zend_llist_apply"] = (a0, a1) => (_zend_llist_apply = Module["_zend_llist_apply"] = wasmExports["zend_llist_apply"])(a0, a1);

var _zend_binary_zval_strcmp = Module["_zend_binary_zval_strcmp"] = (a0, a1) => (_zend_binary_zval_strcmp = Module["_zend_binary_zval_strcmp"] = wasmExports["zend_binary_zval_strcmp"])(a0, a1);

var _zend_compare_arrays = Module["_zend_compare_arrays"] = (a0, a1) => (_zend_compare_arrays = Module["_zend_compare_arrays"] = wasmExports["zend_compare_arrays"])(a0, a1);

var _zend_compare_objects = Module["_zend_compare_objects"] = (a0, a1) => (_zend_compare_objects = Module["_zend_compare_objects"] = wasmExports["zend_compare_objects"])(a0, a1);

var _object_and_properties_init = Module["_object_and_properties_init"] = (a0, a1, a2) => (_object_and_properties_init = Module["_object_and_properties_init"] = wasmExports["object_and_properties_init"])(a0, a1, a2);

var _fopen = Module["_fopen"] = (a0, a1) => (_fopen = Module["_fopen"] = wasmExports["fopen"])(a0, a1);

var _zend_stream_init_fp = Module["_zend_stream_init_fp"] = (a0, a1, a2) => (_zend_stream_init_fp = Module["_zend_stream_init_fp"] = wasmExports["zend_stream_init_fp"])(a0, a1, a2);

var __safe_realloc = Module["__safe_realloc"] = (a0, a1, a2, a3) => (__safe_realloc = Module["__safe_realloc"] = wasmExports["_safe_realloc"])(a0, a1, a2, a3);

var _zend_memnstr_ex = Module["_zend_memnstr_ex"] = (a0, a1, a2, a3) => (_zend_memnstr_ex = Module["_zend_memnstr_ex"] = wasmExports["zend_memnstr_ex"])(a0, a1, a2, a3);

var _php_crc32_bulk_update = Module["_php_crc32_bulk_update"] = (a0, a1, a2) => (_php_crc32_bulk_update = Module["_php_crc32_bulk_update"] = wasmExports["php_crc32_bulk_update"])(a0, a1, a2);

var _php_crc32_stream_bulk_update = Module["_php_crc32_stream_bulk_update"] = (a0, a1, a2) => (_php_crc32_stream_bulk_update = Module["_php_crc32_stream_bulk_update"] = wasmExports["php_crc32_stream_bulk_update"])(a0, a1, a2);

var _php_crypt = Module["_php_crypt"] = (a0, a1, a2, a3, a4) => (_php_crypt = Module["_php_crypt"] = wasmExports["php_crypt"])(a0, a1, a2, a3, a4);

var _php_std_date = Module["_php_std_date"] = (a0, a1) => (_php_std_date = Module["_php_std_date"] = wasmExports["php_std_date"])(a0, a1);

var _zend_fetch_resource = Module["_zend_fetch_resource"] = (a0, a1, a2) => (_zend_fetch_resource = Module["_zend_fetch_resource"] = wasmExports["zend_fetch_resource"])(a0, a1, a2);

var _chroot = Module["_chroot"] = a0 => (_chroot = Module["_chroot"] = wasmExports["chroot"])(a0);

var _php_clear_stat_cache = Module["_php_clear_stat_cache"] = (a0, a1, a2) => (_php_clear_stat_cache = Module["_php_clear_stat_cache"] = wasmExports["php_clear_stat_cache"])(a0, a1, a2);

var _chdir = Module["_chdir"] = a0 => (_chdir = Module["_chdir"] = wasmExports["chdir"])(a0);

var _getcwd = Module["_getcwd"] = (a0, a1) => (_getcwd = Module["_getcwd"] = wasmExports["getcwd"])(a0, a1);

var _glob = Module["_glob"] = (a0, a1, a2, a3) => (_glob = Module["_glob"] = wasmExports["glob"])(a0, a1, a2, a3);

var _php_check_open_basedir_ex = Module["_php_check_open_basedir_ex"] = (a0, a1) => (_php_check_open_basedir_ex = Module["_php_check_open_basedir_ex"] = wasmExports["php_check_open_basedir_ex"])(a0, a1);

var _globfree = Module["_globfree"] = a0 => (_globfree = Module["_globfree"] = wasmExports["globfree"])(a0);

var __php_stream_scandir = Module["__php_stream_scandir"] = (a0, a1, a2, a3, a4) => (__php_stream_scandir = Module["__php_stream_scandir"] = wasmExports["_php_stream_scandir"])(a0, a1, a2, a3, a4);

var _php_stream_dirent_alphasort = Module["_php_stream_dirent_alphasort"] = (a0, a1) => (_php_stream_dirent_alphasort = Module["_php_stream_dirent_alphasort"] = wasmExports["php_stream_dirent_alphasort"])(a0, a1);

var _php_stream_dirent_alphasortr = Module["_php_stream_dirent_alphasortr"] = (a0, a1) => (_php_stream_dirent_alphasortr = Module["_php_stream_dirent_alphasortr"] = wasmExports["php_stream_dirent_alphasortr"])(a0, a1);

var _zend_list_delete = Module["_zend_list_delete"] = a0 => (_zend_list_delete = Module["_zend_list_delete"] = wasmExports["zend_list_delete"])(a0);

var _zif_dl = Module["_zif_dl"] = (a0, a1) => (_zif_dl = Module["_zif_dl"] = wasmExports["zif_dl"])(a0, a1);

var _php_dl = Module["_php_dl"] = (a0, a1, a2, a3) => (_php_dl = Module["_php_dl"] = wasmExports["php_dl"])(a0, a1, a2, a3);

var _php_load_shlib = Module["_php_load_shlib"] = (a0, a1) => (_php_load_shlib = Module["_php_load_shlib"] = wasmExports["php_load_shlib"])(a0, a1);

var _dlopen = Module["_dlopen"] = (a0, a1) => (_dlopen = Module["_dlopen"] = wasmExports["dlopen"])(a0, a1);

var _dlerror = Module["_dlerror"] = () => (_dlerror = Module["_dlerror"] = wasmExports["dlerror"])();

var _php_load_extension = Module["_php_load_extension"] = (a0, a1, a2) => (_php_load_extension = Module["_php_load_extension"] = wasmExports["php_load_extension"])(a0, a1, a2);

var _dlsym = Module["_dlsym"] = (a0, a1) => (_dlsym = Module["_dlsym"] = wasmExports["dlsym"])(a0, a1);

var _dlclose = Module["_dlclose"] = a0 => (_dlclose = Module["_dlclose"] = wasmExports["dlclose"])(a0);

var _zend_next_free_module = Module["_zend_next_free_module"] = () => (_zend_next_free_module = Module["_zend_next_free_module"] = wasmExports["zend_next_free_module"])();

var _zend_register_module_ex = Module["_zend_register_module_ex"] = a0 => (_zend_register_module_ex = Module["_zend_register_module_ex"] = wasmExports["zend_register_module_ex"])(a0);

var _zend_startup_module_ex = Module["_zend_startup_module_ex"] = a0 => (_zend_startup_module_ex = Module["_zend_startup_module_ex"] = wasmExports["zend_startup_module_ex"])(a0);

var _gethostname = Module["_gethostname"] = (a0, a1) => (_gethostname = Module["_gethostname"] = wasmExports["gethostname"])(a0, a1);

var _php_network_gethostbyname = Module["_php_network_gethostbyname"] = a0 => (_php_network_gethostbyname = Module["_php_network_gethostbyname"] = wasmExports["php_network_gethostbyname"])(a0);

var _sysconf = Module["_sysconf"] = a0 => (_sysconf = Module["_sysconf"] = wasmExports["sysconf"])(a0);

var _php_exec = Module["_php_exec"] = (a0, a1, a2, a3) => (_php_exec = Module["_php_exec"] = wasmExports["php_exec"])(a0, a1, a2, a3);

var _popen = Module["_popen"] = (a0, a1) => (_popen = Module["_popen"] = wasmExports["popen"])(a0, a1);

var __php_stream_fopen_from_pipe = Module["__php_stream_fopen_from_pipe"] = (a0, a1) => (__php_stream_fopen_from_pipe = Module["__php_stream_fopen_from_pipe"] = wasmExports["_php_stream_fopen_from_pipe"])(a0, a1);

var _php_output_write = Module["_php_output_write"] = (a0, a1) => (_php_output_write = Module["_php_output_write"] = wasmExports["php_output_write"])(a0, a1);

var _php_escape_shell_cmd = Module["_php_escape_shell_cmd"] = a0 => (_php_escape_shell_cmd = Module["_php_escape_shell_cmd"] = wasmExports["php_escape_shell_cmd"])(a0);

var _mblen = Module["_mblen"] = (a0, a1) => (_mblen = Module["_mblen"] = wasmExports["mblen"])(a0, a1);

var _php_escape_shell_arg = Module["_php_escape_shell_arg"] = a0 => (_php_escape_shell_arg = Module["_php_escape_shell_arg"] = wasmExports["php_escape_shell_arg"])(a0);

var _nice = Module["_nice"] = a0 => (_nice = Module["_nice"] = wasmExports["nice"])(a0);

var _php_output_get_level = Module["_php_output_get_level"] = () => (_php_output_get_level = Module["_php_output_get_level"] = wasmExports["php_output_get_level"])();

var _zend_fetch_resource2 = Module["_zend_fetch_resource2"] = (a0, a1, a2, a3) => (_zend_fetch_resource2 = Module["_zend_fetch_resource2"] = wasmExports["zend_fetch_resource2"])(a0, a1, a2, a3);

var _zend_str_tolower = Module["_zend_str_tolower"] = (a0, a1) => (_zend_str_tolower = Module["_zend_str_tolower"] = wasmExports["zend_str_tolower"])(a0, a1);

var __php_stream_copy_to_stream_ex = Module["__php_stream_copy_to_stream_ex"] = (a0, a1, a2, a3) => (__php_stream_copy_to_stream_ex = Module["__php_stream_copy_to_stream_ex"] = wasmExports["_php_stream_copy_to_stream_ex"])(a0, a1, a2, a3);

var _php_stream_locate_eol = Module["_php_stream_locate_eol"] = (a0, a1) => (_php_stream_locate_eol = Module["_php_stream_locate_eol"] = wasmExports["php_stream_locate_eol"])(a0, a1);

var _add_index_stringl = Module["_add_index_stringl"] = (a0, a1, a2, a3) => (_add_index_stringl = Module["_add_index_stringl"] = wasmExports["add_index_stringl"])(a0, a1, a2, a3);

var _php_open_temporary_fd_ex = Module["_php_open_temporary_fd_ex"] = (a0, a1, a2, a3) => (_php_open_temporary_fd_ex = Module["_php_open_temporary_fd_ex"] = wasmExports["php_open_temporary_fd_ex"])(a0, a1, a2, a3);

var __php_stream_fopen_tmpfile = Module["__php_stream_fopen_tmpfile"] = a0 => (__php_stream_fopen_tmpfile = Module["__php_stream_fopen_tmpfile"] = wasmExports["_php_stream_fopen_tmpfile"])(a0);

var _php_error_docref2 = Module["_php_error_docref2"] = (a0, a1, a2, a3, a4, a5) => (_php_error_docref2 = Module["_php_error_docref2"] = wasmExports["php_error_docref2"])(a0, a1, a2, a3, a4, a5);

var _php_mkdir_ex = Module["_php_mkdir_ex"] = (a0, a1, a2) => (_php_mkdir_ex = Module["_php_mkdir_ex"] = wasmExports["php_mkdir_ex"])(a0, a1, a2);

var _mkdir = Module["_mkdir"] = (a0, a1) => (_mkdir = Module["_mkdir"] = wasmExports["mkdir"])(a0, a1);

var _php_mkdir = Module["_php_mkdir"] = (a0, a1) => (_php_mkdir = Module["_php_mkdir"] = wasmExports["php_mkdir"])(a0, a1);

var __php_stream_mkdir = Module["__php_stream_mkdir"] = (a0, a1, a2, a3) => (__php_stream_mkdir = Module["__php_stream_mkdir"] = wasmExports["_php_stream_mkdir"])(a0, a1, a2, a3);

var __php_stream_rmdir = Module["__php_stream_rmdir"] = (a0, a1, a2) => (__php_stream_rmdir = Module["__php_stream_rmdir"] = wasmExports["_php_stream_rmdir"])(a0, a1, a2);

var _php_stream_locate_url_wrapper = Module["_php_stream_locate_url_wrapper"] = (a0, a1, a2) => (_php_stream_locate_url_wrapper = Module["_php_stream_locate_url_wrapper"] = wasmExports["php_stream_locate_url_wrapper"])(a0, a1, a2);

var __php_stream_sync = Module["__php_stream_sync"] = (a0, a1) => (__php_stream_sync = Module["__php_stream_sync"] = wasmExports["_php_stream_sync"])(a0, a1);

var __php_stream_stat = Module["__php_stream_stat"] = (a0, a1) => (__php_stream_stat = Module["__php_stream_stat"] = wasmExports["_php_stream_stat"])(a0, a1);

var _zend_hash_str_add_new = Module["_zend_hash_str_add_new"] = (a0, a1, a2, a3) => (_zend_hash_str_add_new = Module["_zend_hash_str_add_new"] = wasmExports["zend_hash_str_add_new"])(a0, a1, a2, a3);

var _php_copy_file_ctx = Module["_php_copy_file_ctx"] = (a0, a1, a2, a3) => (_php_copy_file_ctx = Module["_php_copy_file_ctx"] = wasmExports["php_copy_file_ctx"])(a0, a1, a2, a3);

var _php_copy_file = Module["_php_copy_file"] = (a0, a1) => (_php_copy_file = Module["_php_copy_file"] = wasmExports["php_copy_file"])(a0, a1);

var __php_stream_stat_path = Module["__php_stream_stat_path"] = (a0, a1, a2, a3) => (__php_stream_stat_path = Module["__php_stream_stat_path"] = wasmExports["_php_stream_stat_path"])(a0, a1, a2, a3);

var _expand_filepath = Module["_expand_filepath"] = (a0, a1) => (_expand_filepath = Module["_expand_filepath"] = wasmExports["expand_filepath"])(a0, a1);

var _fnmatch = Module["_fnmatch"] = (a0, a1, a2) => (_fnmatch = Module["_fnmatch"] = wasmExports["fnmatch"])(a0, a1, a2);

var _php_stream_context_free = Module["_php_stream_context_free"] = a0 => (_php_stream_context_free = Module["_php_stream_context_free"] = wasmExports["php_stream_context_free"])(a0);

var _zend_ini_parse_bool = Module["_zend_ini_parse_bool"] = a0 => (_zend_ini_parse_bool = Module["_zend_ini_parse_bool"] = wasmExports["zend_ini_parse_bool"])(a0);

var _php_get_gid_by_name = Module["_php_get_gid_by_name"] = (a0, a1) => (_php_get_gid_by_name = Module["_php_get_gid_by_name"] = wasmExports["php_get_gid_by_name"])(a0, a1);

var _getgrnam = Module["_getgrnam"] = a0 => (_getgrnam = Module["_getgrnam"] = wasmExports["getgrnam"])(a0);

var _php_get_uid_by_name = Module["_php_get_uid_by_name"] = (a0, a1) => (_php_get_uid_by_name = Module["_php_get_uid_by_name"] = wasmExports["php_get_uid_by_name"])(a0, a1);

var _getpwnam = Module["_getpwnam"] = a0 => (_getpwnam = Module["_getpwnam"] = wasmExports["getpwnam"])(a0);

var _fclose = Module["_fclose"] = a0 => (_fclose = Module["_fclose"] = wasmExports["fclose"])(a0);

var _realpath_cache_del = Module["_realpath_cache_del"] = (a0, a1) => (_realpath_cache_del = Module["_realpath_cache_del"] = wasmExports["realpath_cache_del"])(a0, a1);

var _realpath_cache_clean = Module["_realpath_cache_clean"] = () => (_realpath_cache_clean = Module["_realpath_cache_clean"] = wasmExports["realpath_cache_clean"])();

var _getgid = Module["_getgid"] = () => (_getgid = Module["_getgid"] = wasmExports["getgid"])();

var _getgroups = Module["_getgroups"] = (a0, a1) => (_getgroups = Module["_getgroups"] = wasmExports["getgroups"])(a0, a1);

var _realpath_cache_size = Module["_realpath_cache_size"] = () => (_realpath_cache_size = Module["_realpath_cache_size"] = wasmExports["realpath_cache_size"])();

var _realpath_cache_get_buckets = Module["_realpath_cache_get_buckets"] = () => (_realpath_cache_get_buckets = Module["_realpath_cache_get_buckets"] = wasmExports["realpath_cache_get_buckets"])();

var _realpath_cache_max_buckets = Module["_realpath_cache_max_buckets"] = () => (_realpath_cache_max_buckets = Module["_realpath_cache_max_buckets"] = wasmExports["realpath_cache_max_buckets"])();

var _add_assoc_stringl_ex = Module["_add_assoc_stringl_ex"] = (a0, a1, a2, a3, a4) => (_add_assoc_stringl_ex = Module["_add_assoc_stringl_ex"] = wasmExports["add_assoc_stringl_ex"])(a0, a1, a2, a3, a4);

var _statvfs = Module["_statvfs"] = (a0, a1) => (_statvfs = Module["_statvfs"] = wasmExports["statvfs"])(a0, a1);

var _lchown = Module["_lchown"] = (a0, a1, a2) => (_lchown = Module["_lchown"] = wasmExports["lchown"])(a0, a1, a2);

var _chown = Module["_chown"] = (a0, a1, a2) => (_chown = Module["_chown"] = wasmExports["chown"])(a0, a1, a2);

var _php_flock = Module["_php_flock"] = (a0, a1) => (_php_flock = Module["_php_flock"] = wasmExports["php_flock"])(a0, a1);

var _localeconv = Module["_localeconv"] = () => (_localeconv = Module["_localeconv"] = wasmExports["localeconv"])();

var _php_conv_fp = Module["_php_conv_fp"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_conv_fp = Module["_php_conv_fp"] = wasmExports["php_conv_fp"])(a0, a1, a2, a3, a4, a5, a6, a7);

var __php_stream_xport_create = Module["__php_stream_xport_create"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (__php_stream_xport_create = Module["__php_stream_xport_create"] = wasmExports["_php_stream_xport_create"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _zend_try_assign_typed_ref_str = Module["_zend_try_assign_typed_ref_str"] = (a0, a1) => (_zend_try_assign_typed_ref_str = Module["_zend_try_assign_typed_ref_str"] = wasmExports["zend_try_assign_typed_ref_str"])(a0, a1);

var _zend_try_assign_typed_ref_empty_string = Module["_zend_try_assign_typed_ref_empty_string"] = a0 => (_zend_try_assign_typed_ref_empty_string = Module["_zend_try_assign_typed_ref_empty_string"] = wasmExports["zend_try_assign_typed_ref_empty_string"])(a0);

var _sapi_header_op = Module["_sapi_header_op"] = (a0, a1) => (_sapi_header_op = Module["_sapi_header_op"] = wasmExports["sapi_header_op"])(a0, a1);

var _php_header = Module["_php_header"] = () => (_php_header = Module["_php_header"] = wasmExports["php_header"])();

var _php_setcookie = Module["_php_setcookie"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_php_setcookie = Module["_php_setcookie"] = wasmExports["php_setcookie"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var _php_raw_url_encode = Module["_php_raw_url_encode"] = (a0, a1) => (_php_raw_url_encode = Module["_php_raw_url_encode"] = wasmExports["php_raw_url_encode"])(a0, a1);

var _difftime = Module["_difftime"] = (a0, a1, a2, a3) => (_difftime = Module["_difftime"] = wasmExports["difftime"])(a0, a1, a2, a3);

var _zend_try_assign_typed_ref_string = Module["_zend_try_assign_typed_ref_string"] = (a0, a1) => (_zend_try_assign_typed_ref_string = Module["_zend_try_assign_typed_ref_string"] = wasmExports["zend_try_assign_typed_ref_string"])(a0, a1);

var _zend_llist_apply_with_argument = Module["_zend_llist_apply_with_argument"] = (a0, a1, a2) => (_zend_llist_apply_with_argument = Module["_zend_llist_apply_with_argument"] = wasmExports["zend_llist_apply_with_argument"])(a0, a1, a2);

var _php_unescape_html_entities = Module["_php_unescape_html_entities"] = (a0, a1, a2, a3) => (_php_unescape_html_entities = Module["_php_unescape_html_entities"] = wasmExports["php_unescape_html_entities"])(a0, a1, a2, a3);

var _php_escape_html_entities = Module["_php_escape_html_entities"] = (a0, a1, a2, a3, a4) => (_php_escape_html_entities = Module["_php_escape_html_entities"] = wasmExports["php_escape_html_entities"])(a0, a1, a2, a3, a4);

var _php_escape_html_entities_ex = Module["_php_escape_html_entities_ex"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_escape_html_entities_ex = Module["_php_escape_html_entities_ex"] = wasmExports["php_escape_html_entities_ex"])(a0, a1, a2, a3, a4, a5, a6);

var _php_is_image_avif = Module["_php_is_image_avif"] = a0 => (_php_is_image_avif = Module["_php_is_image_avif"] = wasmExports["php_is_image_avif"])(a0);

var _php_image_type_to_mime_type = Module["_php_image_type_to_mime_type"] = a0 => (_php_image_type_to_mime_type = Module["_php_image_type_to_mime_type"] = wasmExports["php_image_type_to_mime_type"])(a0);

var _php_getimagetype = Module["_php_getimagetype"] = (a0, a1, a2) => (_php_getimagetype = Module["_php_getimagetype"] = wasmExports["php_getimagetype"])(a0, a1, a2);

var _sscanf = Module["_sscanf"] = (a0, a1, a2) => (_sscanf = Module["_sscanf"] = wasmExports["sscanf"])(a0, a1, a2);

var _strrchr = Module["_strrchr"] = (a0, a1) => (_strrchr = Module["_strrchr"] = wasmExports["strrchr"])(a0, a1);

var _php_info_print_table_header = Module["_php_info_print_table_header"] = (a0, a1) => (_php_info_print_table_header = Module["_php_info_print_table_header"] = wasmExports["php_info_print_table_header"])(a0, a1);

var _php_info_print_style = Module["_php_info_print_style"] = () => (_php_info_print_style = Module["_php_info_print_style"] = wasmExports["php_info_print_style"])();

var _php_info_print_css = Module["_php_info_print_css"] = () => (_php_info_print_css = Module["_php_info_print_css"] = wasmExports["php_info_print_css"])();

var _php_info_html_esc = Module["_php_info_html_esc"] = a0 => (_php_info_html_esc = Module["_php_info_html_esc"] = wasmExports["php_info_html_esc"])(a0);

var _php_get_uname = Module["_php_get_uname"] = a0 => (_php_get_uname = Module["_php_get_uname"] = wasmExports["php_get_uname"])(a0);

var _uname = Module["_uname"] = a0 => (_uname = Module["_uname"] = wasmExports["uname"])(a0);

var _php_print_info_htmlhead = Module["_php_print_info_htmlhead"] = () => (_php_print_info_htmlhead = Module["_php_print_info_htmlhead"] = wasmExports["php_print_info_htmlhead"])();

var _php_print_info = Module["_php_print_info"] = a0 => (_php_print_info = Module["_php_print_info"] = wasmExports["php_print_info"])(a0);

var _get_zend_version = Module["_get_zend_version"] = () => (_get_zend_version = Module["_get_zend_version"] = wasmExports["get_zend_version"])();

var _php_info_print_box_start = Module["_php_info_print_box_start"] = a0 => (_php_info_print_box_start = Module["_php_info_print_box_start"] = wasmExports["php_info_print_box_start"])(a0);

var _localtime_r = Module["_localtime_r"] = (a0, a1) => (_localtime_r = Module["_localtime_r"] = wasmExports["localtime_r"])(a0, a1);

var _php_info_print_box_end = Module["_php_info_print_box_end"] = () => (_php_info_print_box_end = Module["_php_info_print_box_end"] = wasmExports["php_info_print_box_end"])();

var _is_zend_mm = Module["_is_zend_mm"] = () => (_is_zend_mm = Module["_is_zend_mm"] = wasmExports["is_zend_mm"])();

var _zend_multibyte_get_functions = Module["_zend_multibyte_get_functions"] = () => (_zend_multibyte_get_functions = Module["_zend_multibyte_get_functions"] = wasmExports["zend_multibyte_get_functions"])();

var __php_stream_get_url_stream_wrappers_hash = Module["__php_stream_get_url_stream_wrappers_hash"] = () => (__php_stream_get_url_stream_wrappers_hash = Module["__php_stream_get_url_stream_wrappers_hash"] = wasmExports["_php_stream_get_url_stream_wrappers_hash"])();

var _php_stream_xport_get_hash = Module["_php_stream_xport_get_hash"] = () => (_php_stream_xport_get_hash = Module["_php_stream_xport_get_hash"] = wasmExports["php_stream_xport_get_hash"])();

var __php_get_stream_filters_hash = Module["__php_get_stream_filters_hash"] = () => (__php_get_stream_filters_hash = Module["__php_get_stream_filters_hash"] = wasmExports["_php_get_stream_filters_hash"])();

var _zend_html_puts = Module["_zend_html_puts"] = (a0, a1) => (_zend_html_puts = Module["_zend_html_puts"] = wasmExports["zend_html_puts"])(a0, a1);

var _php_info_print_hr = Module["_php_info_print_hr"] = () => (_php_info_print_hr = Module["_php_info_print_hr"] = wasmExports["php_info_print_hr"])();

var _php_print_credits = Module["_php_print_credits"] = a0 => (_php_print_credits = Module["_php_print_credits"] = wasmExports["php_print_credits"])(a0);

var _php_info_print_table_colspan_header = Module["_php_info_print_table_colspan_header"] = (a0, a1) => (_php_info_print_table_colspan_header = Module["_php_info_print_table_colspan_header"] = wasmExports["php_info_print_table_colspan_header"])(a0, a1);

var _php_info_print_table_row_ex = Module["_php_info_print_table_row_ex"] = (a0, a1, a2) => (_php_info_print_table_row_ex = Module["_php_info_print_table_row_ex"] = wasmExports["php_info_print_table_row_ex"])(a0, a1, a2);

var _zend_get_module_version = Module["_zend_get_module_version"] = a0 => (_zend_get_module_version = Module["_zend_get_module_version"] = wasmExports["zend_get_module_version"])(a0);

var _zend_vspprintf = Module["_zend_vspprintf"] = (a0, a1, a2, a3) => (_zend_vspprintf = Module["_zend_vspprintf"] = wasmExports["zend_vspprintf"])(a0, a1, a2, a3);

var _fileno = a0 => (_fileno = wasmExports["fileno"])(a0);

var _fgetc = Module["_fgetc"] = a0 => (_fgetc = Module["_fgetc"] = wasmExports["fgetc"])(a0);

var _getc = Module["_getc"] = a0 => (_getc = Module["_getc"] = wasmExports["getc"])(a0);

var _lstat = Module["_lstat"] = (a0, a1) => (_lstat = Module["_lstat"] = wasmExports["lstat"])(a0, a1);

var _expand_filepath_ex = Module["_expand_filepath_ex"] = (a0, a1, a2, a3) => (_expand_filepath_ex = Module["_expand_filepath_ex"] = wasmExports["expand_filepath_ex"])(a0, a1, a2, a3);

var _symlink = Module["_symlink"] = (a0, a1) => (_symlink = Module["_symlink"] = wasmExports["symlink"])(a0, a1);

var _link = Module["_link"] = (a0, a1) => (_link = Module["_link"] = wasmExports["link"])(a0, a1);

var _php_mail_build_headers = Module["_php_mail_build_headers"] = a0 => (_php_mail_build_headers = Module["_php_mail_build_headers"] = wasmExports["php_mail_build_headers"])(a0);

var _php_trim = Module["_php_trim"] = (a0, a1, a2, a3) => (_php_trim = Module["_php_trim"] = wasmExports["php_trim"])(a0, a1, a2, a3);

var _php_syslog = Module["_php_syslog"] = (a0, a1, a2) => (_php_syslog = Module["_php_syslog"] = wasmExports["php_syslog"])(a0, a1, a2);

var _zend_get_executed_filename = Module["_zend_get_executed_filename"] = () => (_zend_get_executed_filename = Module["_zend_get_executed_filename"] = wasmExports["zend_get_executed_filename"])();

var _pclose = Module["_pclose"] = a0 => (_pclose = Module["_pclose"] = wasmExports["pclose"])(a0);

var _fprintf = Module["_fprintf"] = (a0, a1, a2) => (_fprintf = Module["_fprintf"] = wasmExports["fprintf"])(a0, a1, a2);

var _tan = Module["_tan"] = a0 => (_tan = Module["_tan"] = wasmExports["tan"])(a0);

var _asin = Module["_asin"] = a0 => (_asin = Module["_asin"] = wasmExports["asin"])(a0);

var _atan = Module["_atan"] = a0 => (_atan = Module["_atan"] = wasmExports["atan"])(a0);

var _sinh = Module["_sinh"] = a0 => (_sinh = Module["_sinh"] = wasmExports["sinh"])(a0);

var _cosh = Module["_cosh"] = a0 => (_cosh = Module["_cosh"] = wasmExports["cosh"])(a0);

var _tanh = Module["_tanh"] = a0 => (_tanh = Module["_tanh"] = wasmExports["tanh"])(a0);

var _asinh = Module["_asinh"] = a0 => (_asinh = Module["_asinh"] = wasmExports["asinh"])(a0);

var _acosh = Module["_acosh"] = a0 => (_acosh = Module["_acosh"] = wasmExports["acosh"])(a0);

var _atanh = Module["_atanh"] = a0 => (_atanh = Module["_atanh"] = wasmExports["atanh"])(a0);

var _pow_function = Module["_pow_function"] = (a0, a1, a2) => (_pow_function = Module["_pow_function"] = wasmExports["pow_function"])(a0, a1, a2);

var _expm1 = Module["_expm1"] = a0 => (_expm1 = Module["_expm1"] = wasmExports["expm1"])(a0);

var _log1p = Module["_log1p"] = a0 => (_log1p = Module["_log1p"] = wasmExports["log1p"])(a0);

var _hypot = Module["_hypot"] = (a0, a1) => (_hypot = Module["_hypot"] = wasmExports["hypot"])(a0, a1);

var __php_math_basetolong = Module["__php_math_basetolong"] = (a0, a1) => (__php_math_basetolong = Module["__php_math_basetolong"] = wasmExports["_php_math_basetolong"])(a0, a1);

var __php_math_basetozval = Module["__php_math_basetozval"] = (a0, a1, a2) => (__php_math_basetozval = Module["__php_math_basetozval"] = wasmExports["_php_math_basetozval"])(a0, a1, a2);

var __php_math_longtobase = Module["__php_math_longtobase"] = (a0, a1) => (__php_math_longtobase = Module["__php_math_longtobase"] = wasmExports["_php_math_longtobase"])(a0, a1);

var __php_math_zvaltobase = Module["__php_math_zvaltobase"] = (a0, a1) => (__php_math_zvaltobase = Module["__php_math_zvaltobase"] = wasmExports["_php_math_zvaltobase"])(a0, a1);

var __php_math_number_format = Module["__php_math_number_format"] = (a0, a1, a2, a3) => (__php_math_number_format = Module["__php_math_number_format"] = wasmExports["_php_math_number_format"])(a0, a1, a2, a3);

var __php_math_number_format_ex = Module["__php_math_number_format_ex"] = (a0, a1, a2, a3, a4, a5) => (__php_math_number_format_ex = Module["__php_math_number_format_ex"] = wasmExports["_php_math_number_format_ex"])(a0, a1, a2, a3, a4, a5);

var __php_math_number_format_long = Module["__php_math_number_format_long"] = (a0, a1, a2, a3, a4, a5) => (__php_math_number_format_long = Module["__php_math_number_format_long"] = wasmExports["_php_math_number_format_long"])(a0, a1, a2, a3, a4, a5);

var _make_digest = Module["_make_digest"] = (a0, a1) => (_make_digest = Module["_make_digest"] = wasmExports["make_digest"])(a0, a1);

var _make_digest_ex = Module["_make_digest_ex"] = (a0, a1, a2) => (_make_digest_ex = Module["_make_digest_ex"] = wasmExports["make_digest_ex"])(a0, a1, a2);

var _getrusage = Module["_getrusage"] = (a0, a1) => (_getrusage = Module["_getrusage"] = wasmExports["getrusage"])(a0, a1);

var _php_statpage = Module["_php_statpage"] = () => (_php_statpage = Module["_php_statpage"] = wasmExports["php_statpage"])();

var _sapi_get_stat = Module["_sapi_get_stat"] = () => (_sapi_get_stat = Module["_sapi_get_stat"] = wasmExports["sapi_get_stat"])();

var _php_getlastmod = Module["_php_getlastmod"] = () => (_php_getlastmod = Module["_php_getlastmod"] = wasmExports["php_getlastmod"])();

var _php_quot_print_decode = Module["_php_quot_print_decode"] = (a0, a1, a2) => (_php_quot_print_decode = Module["_php_quot_print_decode"] = wasmExports["php_quot_print_decode"])(a0, a1, a2);

var _php_quot_print_encode = Module["_php_quot_print_encode"] = (a0, a1) => (_php_quot_print_encode = Module["_php_quot_print_encode"] = wasmExports["php_quot_print_encode"])(a0, a1);

var _localeconv_r = Module["_localeconv_r"] = a0 => (_localeconv_r = Module["_localeconv_r"] = wasmExports["localeconv_r"])(a0);

var _nl_langinfo = Module["_nl_langinfo"] = a0 => (_nl_langinfo = Module["_nl_langinfo"] = wasmExports["nl_langinfo"])(a0);

var _php_explode = Module["_php_explode"] = (a0, a1, a2, a3) => (_php_explode = Module["_php_explode"] = wasmExports["php_explode"])(a0, a1, a2, a3);

var _zend_hash_packed_grow = Module["_zend_hash_packed_grow"] = a0 => (_zend_hash_packed_grow = Module["_zend_hash_packed_grow"] = wasmExports["zend_hash_packed_grow"])(a0);

var _php_explode_negative_limit = Module["_php_explode_negative_limit"] = (a0, a1, a2, a3) => (_php_explode_negative_limit = Module["_php_explode_negative_limit"] = wasmExports["php_explode_negative_limit"])(a0, a1, a2, a3);

var _php_implode = Module["_php_implode"] = (a0, a1, a2) => (_php_implode = Module["_php_implode"] = wasmExports["php_implode"])(a0, a1, a2);

var _php_strtoupper = Module["_php_strtoupper"] = (a0, a1) => (_php_strtoupper = Module["_php_strtoupper"] = wasmExports["php_strtoupper"])(a0, a1);

var _zend_str_toupper = Module["_zend_str_toupper"] = (a0, a1) => (_zend_str_toupper = Module["_zend_str_toupper"] = wasmExports["zend_str_toupper"])(a0, a1);

var _php_string_toupper = Module["_php_string_toupper"] = a0 => (_php_string_toupper = Module["_php_string_toupper"] = wasmExports["php_string_toupper"])(a0);

var _php_strtolower = Module["_php_strtolower"] = (a0, a1) => (_php_strtolower = Module["_php_strtolower"] = wasmExports["php_strtolower"])(a0, a1);

var _php_string_tolower = Module["_php_string_tolower"] = a0 => (_php_string_tolower = Module["_php_string_tolower"] = wasmExports["php_string_tolower"])(a0);

var _zend_string_only_has_ascii_alphanumeric = Module["_zend_string_only_has_ascii_alphanumeric"] = a0 => (_zend_string_only_has_ascii_alphanumeric = Module["_zend_string_only_has_ascii_alphanumeric"] = wasmExports["zend_string_only_has_ascii_alphanumeric"])(a0);

var _zend_dirname = Module["_zend_dirname"] = (a0, a1) => (_zend_dirname = Module["_zend_dirname"] = wasmExports["zend_dirname"])(a0, a1);

var _php_stristr = Module["_php_stristr"] = (a0, a1, a2, a3) => (_php_stristr = Module["_php_stristr"] = wasmExports["php_stristr"])(a0, a1, a2, a3);

var _php_strspn = Module["_php_strspn"] = (a0, a1, a2, a3) => (_php_strspn = Module["_php_strspn"] = wasmExports["php_strspn"])(a0, a1, a2, a3);

var _php_strcspn = Module["_php_strcspn"] = (a0, a1, a2, a3) => (_php_strcspn = Module["_php_strcspn"] = wasmExports["php_strcspn"])(a0, a1, a2, a3);

var _add_index_str = Module["_add_index_str"] = (a0, a1, a2) => (_add_index_str = Module["_add_index_str"] = wasmExports["add_index_str"])(a0, a1, a2);

var _php_strtr = Module["_php_strtr"] = (a0, a1, a2, a3, a4) => (_php_strtr = Module["_php_strtr"] = wasmExports["php_strtr"])(a0, a1, a2, a3, a4);

var _php_str_to_str = Module["_php_str_to_str"] = (a0, a1, a2, a3, a4, a5) => (_php_str_to_str = Module["_php_str_to_str"] = wasmExports["php_str_to_str"])(a0, a1, a2, a3, a4, a5);

var _zend_try_assign_typed_ref_double = Module["_zend_try_assign_typed_ref_double"] = (a0, a1) => (_zend_try_assign_typed_ref_double = Module["_zend_try_assign_typed_ref_double"] = wasmExports["zend_try_assign_typed_ref_double"])(a0, a1);

var _php_addcslashes_str = Module["_php_addcslashes_str"] = (a0, a1, a2, a3) => (_php_addcslashes_str = Module["_php_addcslashes_str"] = wasmExports["php_addcslashes_str"])(a0, a1, a2, a3);

var _php_addslashes = Module["_php_addslashes"] = a0 => (_php_addslashes = Module["_php_addslashes"] = wasmExports["php_addslashes"])(a0);

var _php_stripcslashes = Module["_php_stripcslashes"] = a0 => (_php_stripcslashes = Module["_php_stripcslashes"] = wasmExports["php_stripcslashes"])(a0);

var _php_stripslashes = Module["_php_stripslashes"] = a0 => (_php_stripslashes = Module["_php_stripslashes"] = wasmExports["php_stripslashes"])(a0);

var _sprintf = Module["_sprintf"] = (a0, a1, a2) => (_sprintf = Module["_sprintf"] = wasmExports["sprintf"])(a0, a1, a2);

var _php_addcslashes = Module["_php_addcslashes"] = (a0, a1, a2) => (_php_addcslashes = Module["_php_addcslashes"] = wasmExports["php_addcslashes"])(a0, a1, a2);

var _php_strip_tags_ex = Module["_php_strip_tags_ex"] = (a0, a1, a2, a3, a4) => (_php_strip_tags_ex = Module["_php_strip_tags_ex"] = wasmExports["php_strip_tags_ex"])(a0, a1, a2, a3, a4);

var _php_strip_tags = Module["_php_strip_tags"] = (a0, a1, a2, a3) => (_php_strip_tags = Module["_php_strip_tags"] = wasmExports["php_strip_tags"])(a0, a1, a2, a3);

var _zend_str_tolower_dup_ex = Module["_zend_str_tolower_dup_ex"] = (a0, a1) => (_zend_str_tolower_dup_ex = Module["_zend_str_tolower_dup_ex"] = wasmExports["zend_str_tolower_dup_ex"])(a0, a1);

var _zend_binary_strncmp = Module["_zend_binary_strncmp"] = (a0, a1, a2, a3, a4) => (_zend_binary_strncmp = Module["_zend_binary_strncmp"] = wasmExports["zend_binary_strncmp"])(a0, a1, a2, a3, a4);

var _zend_binary_strncasecmp_l = Module["_zend_binary_strncasecmp_l"] = (a0, a1, a2, a3, a4) => (_zend_binary_strncasecmp_l = Module["_zend_binary_strncasecmp_l"] = wasmExports["zend_binary_strncasecmp_l"])(a0, a1, a2, a3, a4);

var _zend_memnrstr_ex = Module["_zend_memnrstr_ex"] = (a0, a1, a2, a3) => (_zend_memnrstr_ex = Module["_zend_memnrstr_ex"] = wasmExports["zend_memnrstr_ex"])(a0, a1, a2, a3);

var _ValidateFormat = Module["_ValidateFormat"] = (a0, a1, a2) => (_ValidateFormat = Module["_ValidateFormat"] = wasmExports["ValidateFormat"])(a0, a1, a2);

var _zend_try_assign_typed_ref_stringl = Module["_zend_try_assign_typed_ref_stringl"] = (a0, a1, a2) => (_zend_try_assign_typed_ref_stringl = Module["_zend_try_assign_typed_ref_stringl"] = wasmExports["zend_try_assign_typed_ref_stringl"])(a0, a1, a2);

var _php_closelog = Module["_php_closelog"] = () => (_php_closelog = Module["_php_closelog"] = wasmExports["php_closelog"])();

var _php_openlog = Module["_php_openlog"] = (a0, a1, a2) => (_php_openlog = Module["_php_openlog"] = wasmExports["php_openlog"])(a0, a1, a2);

var _php_syslog_str = Module["_php_syslog_str"] = (a0, a1) => (_php_syslog_str = Module["_php_syslog_str"] = wasmExports["php_syslog_str"])(a0, a1);

var _zend_zval_get_legacy_type = Module["_zend_zval_get_legacy_type"] = a0 => (_zend_zval_get_legacy_type = Module["_zend_zval_get_legacy_type"] = wasmExports["zend_zval_get_legacy_type"])(a0);

var _zend_rsrc_list_get_rsrc_type = Module["_zend_rsrc_list_get_rsrc_type"] = a0 => (_zend_rsrc_list_get_rsrc_type = Module["_zend_rsrc_list_get_rsrc_type"] = wasmExports["zend_rsrc_list_get_rsrc_type"])(a0);

var _convert_to_double = Module["_convert_to_double"] = a0 => (_convert_to_double = Module["_convert_to_double"] = wasmExports["convert_to_double"])(a0);

var _convert_to_object = Module["_convert_to_object"] = a0 => (_convert_to_object = Module["_convert_to_object"] = wasmExports["convert_to_object"])(a0);

var _zend_try_assign_typed_ref = Module["_zend_try_assign_typed_ref"] = (a0, a1) => (_zend_try_assign_typed_ref = Module["_zend_try_assign_typed_ref"] = wasmExports["zend_try_assign_typed_ref"])(a0, a1);

var _zend_is_countable = Module["_zend_is_countable"] = a0 => (_zend_is_countable = Module["_zend_is_countable"] = wasmExports["zend_is_countable"])(a0);

var _php_url_free = Module["_php_url_free"] = a0 => (_php_url_free = Module["_php_url_free"] = wasmExports["php_url_free"])(a0);

var _php_replace_controlchars_ex = Module["_php_replace_controlchars_ex"] = (a0, a1) => (_php_replace_controlchars_ex = Module["_php_replace_controlchars_ex"] = wasmExports["php_replace_controlchars_ex"])(a0, a1);

var _php_replace_controlchars = Module["_php_replace_controlchars"] = a0 => (_php_replace_controlchars = Module["_php_replace_controlchars"] = wasmExports["php_replace_controlchars"])(a0);

var _php_url_parse = Module["_php_url_parse"] = a0 => (_php_url_parse = Module["_php_url_parse"] = wasmExports["php_url_parse"])(a0);

var _php_url_parse_ex = Module["_php_url_parse_ex"] = (a0, a1) => (_php_url_parse_ex = Module["_php_url_parse_ex"] = wasmExports["php_url_parse_ex"])(a0, a1);

var _php_url_parse_ex2 = Module["_php_url_parse_ex2"] = (a0, a1, a2) => (_php_url_parse_ex2 = Module["_php_url_parse_ex2"] = wasmExports["php_url_parse_ex2"])(a0, a1, a2);

var _php_url_decode = Module["_php_url_decode"] = (a0, a1) => (_php_url_decode = Module["_php_url_decode"] = wasmExports["php_url_decode"])(a0, a1);

var _php_raw_url_decode = Module["_php_raw_url_decode"] = (a0, a1) => (_php_raw_url_decode = Module["_php_raw_url_decode"] = wasmExports["php_raw_url_decode"])(a0, a1);

var _php_var_dump = Module["_php_var_dump"] = (a0, a1) => (_php_var_dump = Module["_php_var_dump"] = wasmExports["php_var_dump"])(a0, a1);

var _php_printf = Module["_php_printf"] = (a0, a1) => (_php_printf = Module["_php_printf"] = wasmExports["php_printf"])(a0, a1);

var _php_printf_unchecked = Module["_php_printf_unchecked"] = (a0, a1) => (_php_printf_unchecked = Module["_php_printf_unchecked"] = wasmExports["php_printf_unchecked"])(a0, a1);

var _zend_array_count = Module["_zend_array_count"] = a0 => (_zend_array_count = Module["_zend_array_count"] = wasmExports["zend_array_count"])(a0);

var _php_debug_zval_dump = Module["_php_debug_zval_dump"] = (a0, a1) => (_php_debug_zval_dump = Module["_php_debug_zval_dump"] = wasmExports["php_debug_zval_dump"])(a0, a1);

var _php_var_export_ex = Module["_php_var_export_ex"] = (a0, a1, a2) => (_php_var_export_ex = Module["_php_var_export_ex"] = wasmExports["php_var_export_ex"])(a0, a1, a2);

var _smart_str_append_double = Module["_smart_str_append_double"] = (a0, a1, a2, a3) => (_smart_str_append_double = Module["_smart_str_append_double"] = wasmExports["smart_str_append_double"])(a0, a1, a2, a3);

var _php_var_export = Module["_php_var_export"] = (a0, a1) => (_php_var_export = Module["_php_var_export"] = wasmExports["php_var_export"])(a0, a1);

var _php_unserialize_with_options = Module["_php_unserialize_with_options"] = (a0, a1, a2, a3, a4) => (_php_unserialize_with_options = Module["_php_unserialize_with_options"] = wasmExports["php_unserialize_with_options"])(a0, a1, a2, a3, a4);

var _php_var_unserialize_get_allowed_classes = Module["_php_var_unserialize_get_allowed_classes"] = a0 => (_php_var_unserialize_get_allowed_classes = Module["_php_var_unserialize_get_allowed_classes"] = wasmExports["php_var_unserialize_get_allowed_classes"])(a0);

var _php_var_unserialize_get_max_depth = Module["_php_var_unserialize_get_max_depth"] = a0 => (_php_var_unserialize_get_max_depth = Module["_php_var_unserialize_get_max_depth"] = wasmExports["php_var_unserialize_get_max_depth"])(a0);

var _php_var_unserialize_get_cur_depth = Module["_php_var_unserialize_get_cur_depth"] = a0 => (_php_var_unserialize_get_cur_depth = Module["_php_var_unserialize_get_cur_depth"] = wasmExports["php_var_unserialize_get_cur_depth"])(a0);

var _php_var_unserialize_set_allowed_classes = Module["_php_var_unserialize_set_allowed_classes"] = (a0, a1) => (_php_var_unserialize_set_allowed_classes = Module["_php_var_unserialize_set_allowed_classes"] = wasmExports["php_var_unserialize_set_allowed_classes"])(a0, a1);

var _php_var_unserialize_set_max_depth = Module["_php_var_unserialize_set_max_depth"] = (a0, a1) => (_php_var_unserialize_set_max_depth = Module["_php_var_unserialize_set_max_depth"] = wasmExports["php_var_unserialize_set_max_depth"])(a0, a1);

var _php_var_unserialize_set_cur_depth = Module["_php_var_unserialize_set_cur_depth"] = (a0, a1) => (_php_var_unserialize_set_cur_depth = Module["_php_var_unserialize_set_cur_depth"] = wasmExports["php_var_unserialize_set_cur_depth"])(a0, a1);

var _zend_memory_usage = Module["_zend_memory_usage"] = a0 => (_zend_memory_usage = Module["_zend_memory_usage"] = wasmExports["zend_memory_usage"])(a0);

var _zend_memory_peak_usage = Module["_zend_memory_peak_usage"] = a0 => (_zend_memory_peak_usage = Module["_zend_memory_peak_usage"] = wasmExports["zend_memory_peak_usage"])(a0);

var _zend_memory_reset_peak_usage = Module["_zend_memory_reset_peak_usage"] = () => (_zend_memory_reset_peak_usage = Module["_zend_memory_reset_peak_usage"] = wasmExports["zend_memory_reset_peak_usage"])();

var _php_lookup_class_name = Module["_php_lookup_class_name"] = a0 => (_php_lookup_class_name = Module["_php_lookup_class_name"] = wasmExports["php_lookup_class_name"])(a0);

var _php_canonicalize_version = Module["_php_canonicalize_version"] = a0 => (_php_canonicalize_version = Module["_php_canonicalize_version"] = wasmExports["php_canonicalize_version"])(a0);

var _zend_throw_exception_internal = Module["_zend_throw_exception_internal"] = a0 => (_zend_throw_exception_internal = Module["_zend_throw_exception_internal"] = wasmExports["zend_throw_exception_internal"])(a0);

var _zend_throw_unwind_exit = Module["_zend_throw_unwind_exit"] = () => (_zend_throw_unwind_exit = Module["_zend_throw_unwind_exit"] = wasmExports["zend_throw_unwind_exit"])();

var _php_store_class_name = Module["_php_store_class_name"] = (a0, a1) => (_php_store_class_name = Module["_php_store_class_name"] = wasmExports["php_store_class_name"])(a0, a1);

var _zend_objects_new = Module["_zend_objects_new"] = a0 => (_zend_objects_new = Module["_zend_objects_new"] = wasmExports["zend_objects_new"])(a0);

var _php_url_scanner_add_var = Module["_php_url_scanner_add_var"] = (a0, a1, a2, a3, a4) => (_php_url_scanner_add_var = Module["_php_url_scanner_add_var"] = wasmExports["php_url_scanner_add_var"])(a0, a1, a2, a3, a4);

var _php_url_scanner_reset_session_vars = Module["_php_url_scanner_reset_session_vars"] = () => (_php_url_scanner_reset_session_vars = Module["_php_url_scanner_reset_session_vars"] = wasmExports["php_url_scanner_reset_session_vars"])();

var _php_url_scanner_reset_vars = Module["_php_url_scanner_reset_vars"] = () => (_php_url_scanner_reset_vars = Module["_php_url_scanner_reset_vars"] = wasmExports["php_url_scanner_reset_vars"])();

var _php_url_scanner_reset_var = Module["_php_url_scanner_reset_var"] = (a0, a1) => (_php_url_scanner_reset_var = Module["_php_url_scanner_reset_var"] = wasmExports["php_url_scanner_reset_var"])(a0, a1);

var _php_output_start_internal = Module["_php_output_start_internal"] = (a0, a1, a2, a3, a4) => (_php_output_start_internal = Module["_php_output_start_internal"] = wasmExports["php_output_start_internal"])(a0, a1, a2, a3, a4);

var _strtok_r = Module["_strtok_r"] = (a0, a1, a2) => (_strtok_r = Module["_strtok_r"] = wasmExports["strtok_r"])(a0, a1, a2);

var _php_stream_wrapper_log_error = Module["_php_stream_wrapper_log_error"] = (a0, a1, a2, a3) => (_php_stream_wrapper_log_error = Module["_php_stream_wrapper_log_error"] = wasmExports["php_stream_wrapper_log_error"])(a0, a1, a2, a3);

var _php_stream_context_get_option = Module["_php_stream_context_get_option"] = (a0, a1, a2) => (_php_stream_context_get_option = Module["_php_stream_context_get_option"] = wasmExports["php_stream_context_get_option"])(a0, a1, a2);

var _php_stream_notification_notify = Module["_php_stream_notification_notify"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_stream_notification_notify = Module["_php_stream_notification_notify"] = wasmExports["php_stream_notification_notify"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _php_stream_context_set = Module["_php_stream_context_set"] = (a0, a1) => (_php_stream_context_set = Module["_php_stream_context_set"] = wasmExports["php_stream_context_set"])(a0, a1);

var _php_stream_xport_crypto_setup = Module["_php_stream_xport_crypto_setup"] = (a0, a1, a2) => (_php_stream_xport_crypto_setup = Module["_php_stream_xport_crypto_setup"] = wasmExports["php_stream_xport_crypto_setup"])(a0, a1, a2);

var _php_stream_xport_crypto_enable = Module["_php_stream_xport_crypto_enable"] = (a0, a1) => (_php_stream_xport_crypto_enable = Module["_php_stream_xport_crypto_enable"] = wasmExports["php_stream_xport_crypto_enable"])(a0, a1);

var __php_stream_sock_open_host = Module["__php_stream_sock_open_host"] = (a0, a1, a2, a3, a4) => (__php_stream_sock_open_host = Module["__php_stream_sock_open_host"] = wasmExports["_php_stream_sock_open_host"])(a0, a1, a2, a3, a4);

var __php_stream_alloc = Module["__php_stream_alloc"] = (a0, a1, a2, a3) => (__php_stream_alloc = Module["__php_stream_alloc"] = wasmExports["_php_stream_alloc"])(a0, a1, a2, a3);

var _mktime = Module["_mktime"] = a0 => (_mktime = Module["_mktime"] = wasmExports["mktime"])(a0);

var _zend_set_local_var_str = Module["_zend_set_local_var_str"] = (a0, a1, a2, a3) => (_zend_set_local_var_str = Module["_zend_set_local_var_str"] = wasmExports["zend_set_local_var_str"])(a0, a1, a2, a3);

var _php_stream_context_set_option = Module["_php_stream_context_set_option"] = (a0, a1, a2, a3) => (_php_stream_context_set_option = Module["_php_stream_context_set_option"] = wasmExports["php_stream_context_set_option"])(a0, a1, a2, a3);

var _php_stream_filter_create = Module["_php_stream_filter_create"] = (a0, a1, a2) => (_php_stream_filter_create = Module["_php_stream_filter_create"] = wasmExports["php_stream_filter_create"])(a0, a1, a2);

var _php_stream_filter_free = Module["_php_stream_filter_free"] = a0 => (_php_stream_filter_free = Module["_php_stream_filter_free"] = wasmExports["php_stream_filter_free"])(a0);

var __php_stream_filter_append = Module["__php_stream_filter_append"] = (a0, a1) => (__php_stream_filter_append = Module["__php_stream_filter_append"] = wasmExports["_php_stream_filter_append"])(a0, a1);

var _php_stream_mode_from_str = Module["_php_stream_mode_from_str"] = a0 => (_php_stream_mode_from_str = Module["_php_stream_mode_from_str"] = wasmExports["php_stream_mode_from_str"])(a0);

var __php_stream_temp_create = Module["__php_stream_temp_create"] = (a0, a1) => (__php_stream_temp_create = Module["__php_stream_temp_create"] = wasmExports["_php_stream_temp_create"])(a0, a1);

var __php_stream_memory_create = Module["__php_stream_memory_create"] = a0 => (__php_stream_memory_create = Module["__php_stream_memory_create"] = wasmExports["_php_stream_memory_create"])(a0);

var __php_stream_temp_create_ex = Module["__php_stream_temp_create_ex"] = (a0, a1, a2) => (__php_stream_temp_create_ex = Module["__php_stream_temp_create_ex"] = wasmExports["_php_stream_temp_create_ex"])(a0, a1, a2);

var _dup = Module["_dup"] = a0 => (_dup = Module["_dup"] = wasmExports["dup"])(a0);

var __php_stream_sock_open_from_socket = Module["__php_stream_sock_open_from_socket"] = (a0, a1) => (__php_stream_sock_open_from_socket = Module["__php_stream_sock_open_from_socket"] = wasmExports["_php_stream_sock_open_from_socket"])(a0, a1);

var __php_stream_fopen_from_file = Module["__php_stream_fopen_from_file"] = (a0, a1) => (__php_stream_fopen_from_file = Module["__php_stream_fopen_from_file"] = wasmExports["_php_stream_fopen_from_file"])(a0, a1);

var __php_stream_fopen_from_fd = Module["__php_stream_fopen_from_fd"] = (a0, a1, a2, a3) => (__php_stream_fopen_from_fd = Module["__php_stream_fopen_from_fd"] = wasmExports["_php_stream_fopen_from_fd"])(a0, a1, a2, a3);

var _sapi_read_post_block = Module["_sapi_read_post_block"] = (a0, a1) => (_sapi_read_post_block = Module["_sapi_read_post_block"] = wasmExports["sapi_read_post_block"])(a0, a1);

var _var_destroy = Module["_var_destroy"] = a0 => (_var_destroy = Module["_var_destroy"] = wasmExports["var_destroy"])(a0);

var __efree_large = Module["__efree_large"] = (a0, a1) => (__efree_large = Module["__efree_large"] = wasmExports["_efree_large"])(a0, a1);

var _zend_is_valid_class_name = Module["_zend_is_valid_class_name"] = a0 => (_zend_is_valid_class_name = Module["_zend_is_valid_class_name"] = wasmExports["zend_is_valid_class_name"])(a0);

var _zend_ref_del_type_source = Module["_zend_ref_del_type_source"] = (a0, a1) => (_zend_ref_del_type_source = Module["_zend_ref_del_type_source"] = wasmExports["zend_ref_del_type_source"])(a0, a1);

var _zend_hash_lookup = Module["_zend_hash_lookup"] = (a0, a1) => (_zend_hash_lookup = Module["_zend_hash_lookup"] = wasmExports["zend_hash_lookup"])(a0, a1);

var _zend_verify_prop_assignable_by_ref = Module["_zend_verify_prop_assignable_by_ref"] = (a0, a1, a2) => (_zend_verify_prop_assignable_by_ref = Module["_zend_verify_prop_assignable_by_ref"] = wasmExports["zend_verify_prop_assignable_by_ref"])(a0, a1, a2);

var _make_sha1_digest = Module["_make_sha1_digest"] = (a0, a1) => (_make_sha1_digest = Module["_make_sha1_digest"] = wasmExports["make_sha1_digest"])(a0, a1);

var _zend_register_resource = Module["_zend_register_resource"] = (a0, a1) => (_zend_register_resource = Module["_zend_register_resource"] = wasmExports["zend_register_resource"])(a0, a1);

var _php_stream_bucket_make_writeable = Module["_php_stream_bucket_make_writeable"] = a0 => (_php_stream_bucket_make_writeable = Module["_php_stream_bucket_make_writeable"] = wasmExports["php_stream_bucket_make_writeable"])(a0);

var _php_stream_bucket_new = Module["_php_stream_bucket_new"] = (a0, a1, a2, a3, a4) => (_php_stream_bucket_new = Module["_php_stream_bucket_new"] = wasmExports["php_stream_bucket_new"])(a0, a1, a2, a3, a4);

var _php_stream_filter_register_factory_volatile = Module["_php_stream_filter_register_factory_volatile"] = (a0, a1) => (_php_stream_filter_register_factory_volatile = Module["_php_stream_filter_register_factory_volatile"] = wasmExports["php_stream_filter_register_factory_volatile"])(a0, a1);

var _php_stream_bucket_delref = Module["_php_stream_bucket_delref"] = a0 => (_php_stream_bucket_delref = Module["_php_stream_bucket_delref"] = wasmExports["php_stream_bucket_delref"])(a0);

var _add_property_zval_ex = Module["_add_property_zval_ex"] = (a0, a1, a2, a3) => (_add_property_zval_ex = Module["_add_property_zval_ex"] = wasmExports["add_property_zval_ex"])(a0, a1, a2, a3);

var _add_property_stringl_ex = Module["_add_property_stringl_ex"] = (a0, a1, a2, a3, a4) => (_add_property_stringl_ex = Module["_add_property_stringl_ex"] = wasmExports["add_property_stringl_ex"])(a0, a1, a2, a3, a4);

var _add_property_long_ex = Module["_add_property_long_ex"] = (a0, a1, a2, a3) => (_add_property_long_ex = Module["_add_property_long_ex"] = wasmExports["add_property_long_ex"])(a0, a1, a2, a3);

var _php_stream_bucket_append = Module["_php_stream_bucket_append"] = (a0, a1) => (_php_stream_bucket_append = Module["_php_stream_bucket_append"] = wasmExports["php_stream_bucket_append"])(a0, a1);

var _php_stream_bucket_prepend = Module["_php_stream_bucket_prepend"] = (a0, a1) => (_php_stream_bucket_prepend = Module["_php_stream_bucket_prepend"] = wasmExports["php_stream_bucket_prepend"])(a0, a1);

var __php_stream_filter_alloc = Module["__php_stream_filter_alloc"] = (a0, a1, a2) => (__php_stream_filter_alloc = Module["__php_stream_filter_alloc"] = wasmExports["_php_stream_filter_alloc"])(a0, a1, a2);

var _zend_call_method_if_exists = Module["_zend_call_method_if_exists"] = (a0, a1, a2, a3, a4) => (_zend_call_method_if_exists = Module["_zend_call_method_if_exists"] = wasmExports["zend_call_method_if_exists"])(a0, a1, a2, a3, a4);

var _add_property_string_ex = Module["_add_property_string_ex"] = (a0, a1, a2, a3) => (_add_property_string_ex = Module["_add_property_string_ex"] = wasmExports["add_property_string_ex"])(a0, a1, a2, a3);

var _add_property_null_ex = Module["_add_property_null_ex"] = (a0, a1, a2) => (_add_property_null_ex = Module["_add_property_null_ex"] = wasmExports["add_property_null_ex"])(a0, a1, a2);

var _php_uuencode = Module["_php_uuencode"] = (a0, a1) => (_php_uuencode = Module["_php_uuencode"] = wasmExports["php_uuencode"])(a0, a1);

var _php_uudecode = Module["_php_uudecode"] = (a0, a1) => (_php_uudecode = Module["_php_uudecode"] = wasmExports["php_uudecode"])(a0, a1);

var _php_stream_filter_register_factory = Module["_php_stream_filter_register_factory"] = (a0, a1) => (_php_stream_filter_register_factory = Module["_php_stream_filter_register_factory"] = wasmExports["php_stream_filter_register_factory"])(a0, a1);

var _php_stream_filter_unregister_factory = Module["_php_stream_filter_unregister_factory"] = a0 => (_php_stream_filter_unregister_factory = Module["_php_stream_filter_unregister_factory"] = wasmExports["php_stream_filter_unregister_factory"])(a0);

var _php_stream_bucket_unlink = Module["_php_stream_bucket_unlink"] = a0 => (_php_stream_bucket_unlink = Module["_php_stream_bucket_unlink"] = wasmExports["php_stream_bucket_unlink"])(a0);

var _kill = Module["_kill"] = (a0, a1) => (_kill = Module["_kill"] = wasmExports["kill"])(a0, a1);

var _posix_spawn_file_actions_init = Module["_posix_spawn_file_actions_init"] = a0 => (_posix_spawn_file_actions_init = Module["_posix_spawn_file_actions_init"] = wasmExports["posix_spawn_file_actions_init"])(a0);

var _posix_spawn_file_actions_destroy = Module["_posix_spawn_file_actions_destroy"] = a0 => (_posix_spawn_file_actions_destroy = Module["_posix_spawn_file_actions_destroy"] = wasmExports["posix_spawn_file_actions_destroy"])(a0);

var _posix_spawn_file_actions_addchdir_np = Module["_posix_spawn_file_actions_addchdir_np"] = (a0, a1) => (_posix_spawn_file_actions_addchdir_np = Module["_posix_spawn_file_actions_addchdir_np"] = wasmExports["posix_spawn_file_actions_addchdir_np"])(a0, a1);

var _posix_spawn = Module["_posix_spawn"] = (a0, a1, a2, a3, a4, a5) => (_posix_spawn = Module["_posix_spawn"] = wasmExports["posix_spawn"])(a0, a1, a2, a3, a4, a5);

var _waitpid = Module["_waitpid"] = (a0, a1, a2) => (_waitpid = Module["_waitpid"] = wasmExports["waitpid"])(a0, a1, a2);

var __php_stream_cast = Module["__php_stream_cast"] = (a0, a1, a2, a3) => (__php_stream_cast = Module["__php_stream_cast"] = wasmExports["_php_stream_cast"])(a0, a1, a2, a3);

var _pipe = Module["_pipe"] = a0 => (_pipe = Module["_pipe"] = wasmExports["pipe"])(a0);

var _socketpair = Module["_socketpair"] = (a0, a1, a2, a3) => (_socketpair = Module["_socketpair"] = wasmExports["socketpair"])(a0, a1, a2, a3);

var _php_socket_error_str = Module["_php_socket_error_str"] = a0 => (_php_socket_error_str = Module["_php_socket_error_str"] = wasmExports["php_socket_error_str"])(a0);

var _openpty = Module["_openpty"] = (a0, a1, a2, a3, a4) => (_openpty = Module["_openpty"] = wasmExports["openpty"])(a0, a1, a2, a3, a4);

var _posix_spawn_file_actions_addclose = Module["_posix_spawn_file_actions_addclose"] = (a0, a1) => (_posix_spawn_file_actions_addclose = Module["_posix_spawn_file_actions_addclose"] = wasmExports["posix_spawn_file_actions_addclose"])(a0, a1);

var _posix_spawn_file_actions_adddup2 = Module["_posix_spawn_file_actions_adddup2"] = (a0, a1, a2) => (_posix_spawn_file_actions_adddup2 = Module["_posix_spawn_file_actions_adddup2"] = wasmExports["posix_spawn_file_actions_adddup2"])(a0, a1, a2);

var _php_socket_strerror = Module["_php_socket_strerror"] = (a0, a1, a2) => (_php_socket_strerror = Module["_php_socket_strerror"] = wasmExports["php_socket_strerror"])(a0, a1, a2);

var _add_next_index_resource = Module["_add_next_index_resource"] = (a0, a1) => (_add_next_index_resource = Module["_add_next_index_resource"] = wasmExports["add_next_index_resource"])(a0, a1);

var _php_stream_xport_accept = Module["_php_stream_xport_accept"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_stream_xport_accept = Module["_php_stream_xport_accept"] = wasmExports["php_stream_xport_accept"])(a0, a1, a2, a3, a4, a5, a6);

var _php_stream_xport_get_name = Module["_php_stream_xport_get_name"] = (a0, a1, a2, a3, a4) => (_php_stream_xport_get_name = Module["_php_stream_xport_get_name"] = wasmExports["php_stream_xport_get_name"])(a0, a1, a2, a3, a4);

var _php_network_parse_network_address_with_port = Module["_php_network_parse_network_address_with_port"] = (a0, a1, a2, a3) => (_php_network_parse_network_address_with_port = Module["_php_network_parse_network_address_with_port"] = wasmExports["php_network_parse_network_address_with_port"])(a0, a1, a2, a3);

var _php_stream_xport_sendto = Module["_php_stream_xport_sendto"] = (a0, a1, a2, a3, a4, a5) => (_php_stream_xport_sendto = Module["_php_stream_xport_sendto"] = wasmExports["php_stream_xport_sendto"])(a0, a1, a2, a3, a4, a5);

var _zend_try_assign_typed_ref_null = Module["_zend_try_assign_typed_ref_null"] = a0 => (_zend_try_assign_typed_ref_null = Module["_zend_try_assign_typed_ref_null"] = wasmExports["zend_try_assign_typed_ref_null"])(a0);

var _php_stream_xport_recvfrom = Module["_php_stream_xport_recvfrom"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_stream_xport_recvfrom = Module["_php_stream_xport_recvfrom"] = wasmExports["php_stream_xport_recvfrom"])(a0, a1, a2, a3, a4, a5, a6);

var _select = Module["_select"] = (a0, a1, a2, a3, a4) => (_select = Module["_select"] = wasmExports["select"])(a0, a1, a2, a3, a4);

var _php_file_le_stream_filter = Module["_php_file_le_stream_filter"] = () => (_php_file_le_stream_filter = Module["_php_file_le_stream_filter"] = wasmExports["php_file_le_stream_filter"])();

var __php_stream_filter_flush = Module["__php_stream_filter_flush"] = (a0, a1) => (__php_stream_filter_flush = Module["__php_stream_filter_flush"] = wasmExports["_php_stream_filter_flush"])(a0, a1);

var _php_stream_filter_remove = Module["_php_stream_filter_remove"] = (a0, a1) => (_php_stream_filter_remove = Module["_php_stream_filter_remove"] = wasmExports["php_stream_filter_remove"])(a0, a1);

var _php_stream_get_record = Module["_php_stream_get_record"] = (a0, a1, a2, a3) => (_php_stream_get_record = Module["_php_stream_get_record"] = wasmExports["php_stream_get_record"])(a0, a1, a2, a3);

var _isatty = Module["_isatty"] = a0 => (_isatty = Module["_isatty"] = wasmExports["isatty"])(a0);

var _php_stream_xport_shutdown = Module["_php_stream_xport_shutdown"] = (a0, a1) => (_php_stream_xport_shutdown = Module["_php_stream_xport_shutdown"] = wasmExports["php_stream_xport_shutdown"])(a0, a1);

var __php_emit_fd_setsize_warning = Module["__php_emit_fd_setsize_warning"] = a0 => (__php_emit_fd_setsize_warning = Module["__php_emit_fd_setsize_warning"] = wasmExports["_php_emit_fd_setsize_warning"])(a0);

var _php_stream_notification_free = Module["_php_stream_notification_free"] = a0 => (_php_stream_notification_free = Module["_php_stream_notification_free"] = wasmExports["php_stream_notification_free"])(a0);

var _php_stream_notification_alloc = Module["_php_stream_notification_alloc"] = () => (_php_stream_notification_alloc = Module["_php_stream_notification_alloc"] = wasmExports["php_stream_notification_alloc"])();

var _php_stream_filter_append_ex = Module["_php_stream_filter_append_ex"] = (a0, a1) => (_php_stream_filter_append_ex = Module["_php_stream_filter_append_ex"] = wasmExports["php_stream_filter_append_ex"])(a0, a1);

var _php_stream_filter_prepend_ex = Module["_php_stream_filter_prepend_ex"] = (a0, a1) => (_php_stream_filter_prepend_ex = Module["_php_stream_filter_prepend_ex"] = wasmExports["php_stream_filter_prepend_ex"])(a0, a1);

var _php_url_encode_hash_ex = Module["_php_url_encode_hash_ex"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_url_encode_hash_ex = Module["_php_url_encode_hash_ex"] = wasmExports["php_url_encode_hash_ex"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _zend_ini_str = Module["_zend_ini_str"] = (a0, a1, a2) => (_zend_ini_str = Module["_zend_ini_str"] = wasmExports["zend_ini_str"])(a0, a1, a2);

var _zend_check_property_access = Module["_zend_check_property_access"] = (a0, a1, a2) => (_zend_check_property_access = Module["_zend_check_property_access"] = wasmExports["zend_check_property_access"])(a0, a1, a2);

var _zend_double_to_str = Module["_zend_double_to_str"] = a0 => (_zend_double_to_str = Module["_zend_double_to_str"] = wasmExports["zend_double_to_str"])(a0);

var _php_password_algo_register = Module["_php_password_algo_register"] = (a0, a1) => (_php_password_algo_register = Module["_php_password_algo_register"] = wasmExports["php_password_algo_register"])(a0, a1);

var _php_password_algo_unregister = Module["_php_password_algo_unregister"] = a0 => (_php_password_algo_unregister = Module["_php_password_algo_unregister"] = wasmExports["php_password_algo_unregister"])(a0);

var _php_password_algo_default = Module["_php_password_algo_default"] = () => (_php_password_algo_default = Module["_php_password_algo_default"] = wasmExports["php_password_algo_default"])();

var _php_password_algo_find = Module["_php_password_algo_find"] = a0 => (_php_password_algo_find = Module["_php_password_algo_find"] = wasmExports["php_password_algo_find"])(a0);

var _php_password_algo_extract_ident = Module["_php_password_algo_extract_ident"] = a0 => (_php_password_algo_extract_ident = Module["_php_password_algo_extract_ident"] = wasmExports["php_password_algo_extract_ident"])(a0);

var _php_password_algo_identify_ex = Module["_php_password_algo_identify_ex"] = (a0, a1) => (_php_password_algo_identify_ex = Module["_php_password_algo_identify_ex"] = wasmExports["php_password_algo_identify_ex"])(a0, a1);

var _php_inet_ntop = Module["_php_inet_ntop"] = a0 => (_php_inet_ntop = Module["_php_inet_ntop"] = wasmExports["php_inet_ntop"])(a0);

var _getifaddrs = Module["_getifaddrs"] = a0 => (_getifaddrs = Module["_getifaddrs"] = wasmExports["getifaddrs"])(a0);

var _freeifaddrs = Module["_freeifaddrs"] = a0 => (_freeifaddrs = Module["_freeifaddrs"] = wasmExports["freeifaddrs"])(a0);

var _clock_gettime = Module["_clock_gettime"] = (a0, a1) => (_clock_gettime = Module["_clock_gettime"] = wasmExports["clock_gettime"])(a0, a1);

var _vrzno_expose_inc_refcount = Module["_vrzno_expose_inc_refcount"] = a0 => (_vrzno_expose_inc_refcount = Module["_vrzno_expose_inc_refcount"] = wasmExports["vrzno_expose_inc_refcount"])(a0);

var _vrzno_expose_dec_refcount = Module["_vrzno_expose_dec_refcount"] = a0 => (_vrzno_expose_dec_refcount = Module["_vrzno_expose_dec_refcount"] = wasmExports["vrzno_expose_dec_refcount"])(a0);

var _vrzno_expose_zrefcount = Module["_vrzno_expose_zrefcount"] = a0 => (_vrzno_expose_zrefcount = Module["_vrzno_expose_zrefcount"] = wasmExports["vrzno_expose_zrefcount"])(a0);

var _vrzno_expose_inc_crefcount = Module["_vrzno_expose_inc_crefcount"] = a0 => (_vrzno_expose_inc_crefcount = Module["_vrzno_expose_inc_crefcount"] = wasmExports["vrzno_expose_inc_crefcount"])(a0);

var _vrzno_expose_dec_crefcount = Module["_vrzno_expose_dec_crefcount"] = a0 => (_vrzno_expose_dec_crefcount = Module["_vrzno_expose_dec_crefcount"] = wasmExports["vrzno_expose_dec_crefcount"])(a0);

var _vrzno_expose_efree = Module["_vrzno_expose_efree"] = a0 => (_vrzno_expose_efree = Module["_vrzno_expose_efree"] = wasmExports["vrzno_expose_efree"])(a0);

var _vrzno_expose_create_bool = Module["_vrzno_expose_create_bool"] = (a0, a1) => (_vrzno_expose_create_bool = Module["_vrzno_expose_create_bool"] = wasmExports["vrzno_expose_create_bool"])(a0, a1);

var _vrzno_expose_create_null = Module["_vrzno_expose_create_null"] = a0 => (_vrzno_expose_create_null = Module["_vrzno_expose_create_null"] = wasmExports["vrzno_expose_create_null"])(a0);

var _vrzno_expose_create_undef = Module["_vrzno_expose_create_undef"] = a0 => (_vrzno_expose_create_undef = Module["_vrzno_expose_create_undef"] = wasmExports["vrzno_expose_create_undef"])(a0);

var _vrzno_expose_create_long = Module["_vrzno_expose_create_long"] = (a0, a1) => (_vrzno_expose_create_long = Module["_vrzno_expose_create_long"] = wasmExports["vrzno_expose_create_long"])(a0, a1);

var _vrzno_expose_create_double = Module["_vrzno_expose_create_double"] = (a0, a1) => (_vrzno_expose_create_double = Module["_vrzno_expose_create_double"] = wasmExports["vrzno_expose_create_double"])(a0, a1);

var _vrzno_expose_create_string = Module["_vrzno_expose_create_string"] = (a0, a1) => (_vrzno_expose_create_string = Module["_vrzno_expose_create_string"] = wasmExports["vrzno_expose_create_string"])(a0, a1);

var _vrzno_expose_create_object_for_target = Module["_vrzno_expose_create_object_for_target"] = (a0, a1, a2, a3) => (_vrzno_expose_create_object_for_target = Module["_vrzno_expose_create_object_for_target"] = wasmExports["vrzno_expose_create_object_for_target"])(a0, a1, a2, a3);

var _vrzno_expose_create_params = Module["_vrzno_expose_create_params"] = a0 => (_vrzno_expose_create_params = Module["_vrzno_expose_create_params"] = wasmExports["vrzno_expose_create_params"])(a0);

var _vrzno_expose_object_keys = Module["_vrzno_expose_object_keys"] = a0 => (_vrzno_expose_object_keys = Module["_vrzno_expose_object_keys"] = wasmExports["vrzno_expose_object_keys"])(a0);

var _vrzno_expose_array_keys = Module["_vrzno_expose_array_keys"] = a0 => (_vrzno_expose_array_keys = Module["_vrzno_expose_array_keys"] = wasmExports["vrzno_expose_array_keys"])(a0);

var _vrzno_expose_zval_deref = Module["_vrzno_expose_zval_deref"] = a0 => (_vrzno_expose_zval_deref = Module["_vrzno_expose_zval_deref"] = wasmExports["vrzno_expose_zval_deref"])(a0);

var _vrzno_expose_zval_dump = Module["_vrzno_expose_zval_dump"] = (a0, a1) => (_vrzno_expose_zval_dump = Module["_vrzno_expose_zval_dump"] = wasmExports["vrzno_expose_zval_dump"])(a0, a1);

var _vrzno_expose_type = Module["_vrzno_expose_type"] = a0 => (_vrzno_expose_type = Module["_vrzno_expose_type"] = wasmExports["vrzno_expose_type"])(a0);

var _vrzno_expose_array_length = Module["_vrzno_expose_array_length"] = a0 => (_vrzno_expose_array_length = Module["_vrzno_expose_array_length"] = wasmExports["vrzno_expose_array_length"])(a0);

var _vrzno_expose_target = Module["_vrzno_expose_target"] = a0 => (_vrzno_expose_target = Module["_vrzno_expose_target"] = wasmExports["vrzno_expose_target"])(a0);

var _vrzno_expose_callable = Module["_vrzno_expose_callable"] = a0 => (_vrzno_expose_callable = Module["_vrzno_expose_callable"] = wasmExports["vrzno_expose_callable"])(a0);

var _vrzno_expose_long = Module["_vrzno_expose_long"] = a0 => (_vrzno_expose_long = Module["_vrzno_expose_long"] = wasmExports["vrzno_expose_long"])(a0);

var _vrzno_expose_double = Module["_vrzno_expose_double"] = a0 => (_vrzno_expose_double = Module["_vrzno_expose_double"] = wasmExports["vrzno_expose_double"])(a0);

var _vrzno_expose_string = Module["_vrzno_expose_string"] = a0 => (_vrzno_expose_string = Module["_vrzno_expose_string"] = wasmExports["vrzno_expose_string"])(a0);

var _vrzno_expose_key_pointer = Module["_vrzno_expose_key_pointer"] = (a0, a1) => (_vrzno_expose_key_pointer = Module["_vrzno_expose_key_pointer"] = wasmExports["vrzno_expose_key_pointer"])(a0, a1);

var _vrzno_expose_property_pointer = Module["_vrzno_expose_property_pointer"] = (a0, a1) => (_vrzno_expose_property_pointer = Module["_vrzno_expose_property_pointer"] = wasmExports["vrzno_expose_property_pointer"])(a0, a1);

var _vrzno_expose_dimension_pointer = Module["_vrzno_expose_dimension_pointer"] = (a0, a1) => (_vrzno_expose_dimension_pointer = Module["_vrzno_expose_dimension_pointer"] = wasmExports["vrzno_expose_dimension_pointer"])(a0, a1);

var _vrzno_expose_method_pointer = Module["_vrzno_expose_method_pointer"] = (a0, a1) => (_vrzno_expose_method_pointer = Module["_vrzno_expose_method_pointer"] = wasmExports["vrzno_expose_method_pointer"])(a0, a1);

var _zend_register_internal_class = Module["_zend_register_internal_class"] = a0 => (_zend_register_internal_class = Module["_zend_register_internal_class"] = wasmExports["zend_register_internal_class"])(a0);

var _vrzno_exec_callback = Module["_vrzno_exec_callback"] = (a0, a1, a2, a3) => (_vrzno_exec_callback = Module["_vrzno_exec_callback"] = wasmExports["vrzno_exec_callback"])(a0, a1, a2, a3);

var _vrzno_del_callback = Module["_vrzno_del_callback"] = a0 => (_vrzno_del_callback = Module["_vrzno_del_callback"] = wasmExports["vrzno_del_callback"])(a0);

var _zip_open = Module["_zip_open"] = (a0, a1, a2) => (_zip_open = Module["_zip_open"] = wasmExports["zip_open"])(a0, a1, a2);

var _zip_get_num_entries = Module["_zip_get_num_entries"] = (a0, a1) => (_zip_get_num_entries = Module["_zip_get_num_entries"] = wasmExports["zip_get_num_entries"])(a0, a1);

var _zip_stat_index = Module["_zip_stat_index"] = (a0, a1, a2, a3, a4) => (_zip_stat_index = Module["_zip_stat_index"] = wasmExports["zip_stat_index"])(a0, a1, a2, a3, a4);

var _zip_fopen_index = Module["_zip_fopen_index"] = (a0, a1, a2, a3) => (_zip_fopen_index = Module["_zip_fopen_index"] = wasmExports["zip_fopen_index"])(a0, a1, a2, a3);

var _zip_fread = Module["_zip_fread"] = (a0, a1, a2, a3) => (_zip_fread = Module["_zip_fread"] = wasmExports["zip_fread"])(a0, a1, a2, a3);

var _zip_close = Module["_zip_close"] = a0 => (_zip_close = Module["_zip_close"] = wasmExports["zip_close"])(a0);

var _zip_set_default_password = Module["_zip_set_default_password"] = (a0, a1) => (_zip_set_default_password = Module["_zip_set_default_password"] = wasmExports["zip_set_default_password"])(a0, a1);

var _zip_strerror = Module["_zip_strerror"] = a0 => (_zip_strerror = Module["_zip_strerror"] = wasmExports["zip_strerror"])(a0);

var _zip_get_error = Module["_zip_get_error"] = a0 => (_zip_get_error = Module["_zip_get_error"] = wasmExports["zip_get_error"])(a0);

var _zip_error_code_zip = Module["_zip_error_code_zip"] = a0 => (_zip_error_code_zip = Module["_zip_error_code_zip"] = wasmExports["zip_error_code_zip"])(a0);

var _zip_error_code_system = Module["_zip_error_code_system"] = a0 => (_zip_error_code_system = Module["_zip_error_code_system"] = wasmExports["zip_error_code_system"])(a0);

var _zip_error_fini = Module["_zip_error_fini"] = a0 => (_zip_error_fini = Module["_zip_error_fini"] = wasmExports["zip_error_fini"])(a0);

var _zip_discard = Module["_zip_discard"] = a0 => (_zip_discard = Module["_zip_discard"] = wasmExports["zip_discard"])(a0);

var _zip_error_clear = Module["_zip_error_clear"] = a0 => (_zip_error_clear = Module["_zip_error_clear"] = wasmExports["zip_error_clear"])(a0);

var _zip_error_strerror = Module["_zip_error_strerror"] = a0 => (_zip_error_strerror = Module["_zip_error_strerror"] = wasmExports["zip_error_strerror"])(a0);

var _zip_error_init = Module["_zip_error_init"] = a0 => (_zip_error_init = Module["_zip_error_init"] = wasmExports["zip_error_init"])(a0);

var _zip_error_set = Module["_zip_error_set"] = (a0, a1, a2) => (_zip_error_set = Module["_zip_error_set"] = wasmExports["zip_error_set"])(a0, a1, a2);

var _zip_dir_add = Module["_zip_dir_add"] = (a0, a1, a2) => (_zip_dir_add = Module["_zip_dir_add"] = wasmExports["zip_dir_add"])(a0, a1, a2);

var _zip_source_buffer = Module["_zip_source_buffer"] = (a0, a1, a2, a3, a4) => (_zip_source_buffer = Module["_zip_source_buffer"] = wasmExports["zip_source_buffer"])(a0, a1, a2, a3, a4);

var _zip_file_add = Module["_zip_file_add"] = (a0, a1, a2, a3) => (_zip_file_add = Module["_zip_file_add"] = wasmExports["zip_file_add"])(a0, a1, a2, a3);

var _zip_source_free = Module["_zip_source_free"] = a0 => (_zip_source_free = Module["_zip_source_free"] = wasmExports["zip_source_free"])(a0);

var _zip_stat = Module["_zip_stat"] = (a0, a1, a2, a3) => (_zip_stat = Module["_zip_stat"] = wasmExports["zip_stat"])(a0, a1, a2, a3);

var _zip_name_locate = Module["_zip_name_locate"] = (a0, a1, a2) => (_zip_name_locate = Module["_zip_name_locate"] = wasmExports["zip_name_locate"])(a0, a1, a2);

var _zip_get_name = Module["_zip_get_name"] = (a0, a1, a2, a3) => (_zip_get_name = Module["_zip_get_name"] = wasmExports["zip_get_name"])(a0, a1, a2, a3);

var _zip_set_archive_comment = Module["_zip_set_archive_comment"] = (a0, a1, a2) => (_zip_set_archive_comment = Module["_zip_set_archive_comment"] = wasmExports["zip_set_archive_comment"])(a0, a1, a2);

var _zip_get_archive_comment = Module["_zip_get_archive_comment"] = (a0, a1, a2) => (_zip_get_archive_comment = Module["_zip_get_archive_comment"] = wasmExports["zip_get_archive_comment"])(a0, a1, a2);

var _zip_set_archive_flag = Module["_zip_set_archive_flag"] = (a0, a1, a2) => (_zip_set_archive_flag = Module["_zip_set_archive_flag"] = wasmExports["zip_set_archive_flag"])(a0, a1, a2);

var _zip_get_archive_flag = Module["_zip_get_archive_flag"] = (a0, a1, a2) => (_zip_get_archive_flag = Module["_zip_get_archive_flag"] = wasmExports["zip_get_archive_flag"])(a0, a1, a2);

var _zip_file_set_comment = Module["_zip_file_set_comment"] = (a0, a1, a2, a3, a4, a5) => (_zip_file_set_comment = Module["_zip_file_set_comment"] = wasmExports["zip_file_set_comment"])(a0, a1, a2, a3, a4, a5);

var _zip_file_set_external_attributes = Module["_zip_file_set_external_attributes"] = (a0, a1, a2, a3, a4, a5) => (_zip_file_set_external_attributes = Module["_zip_file_set_external_attributes"] = wasmExports["zip_file_set_external_attributes"])(a0, a1, a2, a3, a4, a5);

var _zip_file_get_external_attributes = Module["_zip_file_get_external_attributes"] = (a0, a1, a2, a3, a4, a5) => (_zip_file_get_external_attributes = Module["_zip_file_get_external_attributes"] = wasmExports["zip_file_get_external_attributes"])(a0, a1, a2, a3, a4, a5);

var _zip_file_get_comment = Module["_zip_file_get_comment"] = (a0, a1, a2, a3, a4) => (_zip_file_get_comment = Module["_zip_file_get_comment"] = wasmExports["zip_file_get_comment"])(a0, a1, a2, a3, a4);

var _zip_set_file_compression = Module["_zip_set_file_compression"] = (a0, a1, a2, a3, a4) => (_zip_set_file_compression = Module["_zip_set_file_compression"] = wasmExports["zip_set_file_compression"])(a0, a1, a2, a3, a4);

var _zip_delete = Module["_zip_delete"] = (a0, a1, a2) => (_zip_delete = Module["_zip_delete"] = wasmExports["zip_delete"])(a0, a1, a2);

var _zip_file_rename = Module["_zip_file_rename"] = (a0, a1, a2, a3, a4) => (_zip_file_rename = Module["_zip_file_rename"] = wasmExports["zip_file_rename"])(a0, a1, a2, a3, a4);

var _zip_unchange = Module["_zip_unchange"] = (a0, a1, a2) => (_zip_unchange = Module["_zip_unchange"] = wasmExports["zip_unchange"])(a0, a1, a2);

var _zip_unchange_all = Module["_zip_unchange_all"] = a0 => (_zip_unchange_all = Module["_zip_unchange_all"] = wasmExports["zip_unchange_all"])(a0);

var _zip_unchange_archive = Module["_zip_unchange_archive"] = a0 => (_zip_unchange_archive = Module["_zip_unchange_archive"] = wasmExports["zip_unchange_archive"])(a0);

var _zip_source_filep = Module["_zip_source_filep"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_filep = Module["_zip_source_filep"] = wasmExports["zip_source_filep"])(a0, a1, a2, a3, a4, a5);

var _zip_source_file = Module["_zip_source_file"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_file = Module["_zip_source_file"] = wasmExports["zip_source_file"])(a0, a1, a2, a3, a4, a5);

var _zip_file_replace = Module["_zip_file_replace"] = (a0, a1, a2, a3, a4) => (_zip_file_replace = Module["_zip_file_replace"] = wasmExports["zip_file_replace"])(a0, a1, a2, a3, a4);

var _virtual_file_ex = Module["_virtual_file_ex"] = (a0, a1, a2, a3) => (_virtual_file_ex = Module["_virtual_file_ex"] = wasmExports["virtual_file_ex"])(a0, a1, a2, a3);

var _zip_fclose = Module["_zip_fclose"] = a0 => (_zip_fclose = Module["_zip_fclose"] = wasmExports["zip_fclose"])(a0);

var _zip_fopen = Module["_zip_fopen"] = (a0, a1, a2) => (_zip_fopen = Module["_zip_fopen"] = wasmExports["zip_fopen"])(a0, a1, a2);

var _zend_declare_typed_class_constant = Module["_zend_declare_typed_class_constant"] = (a0, a1, a2, a3, a4, a5) => (_zend_declare_typed_class_constant = Module["_zend_declare_typed_class_constant"] = wasmExports["zend_declare_typed_class_constant"])(a0, a1, a2, a3, a4, a5);

var _zip_libzip_version = Module["_zip_libzip_version"] = () => (_zip_libzip_version = Module["_zip_libzip_version"] = wasmExports["zip_libzip_version"])();

var _zip_file_is_seekable = Module["_zip_file_is_seekable"] = a0 => (_zip_file_is_seekable = Module["_zip_file_is_seekable"] = wasmExports["zip_file_is_seekable"])(a0);

var _zip_file_get_error = Module["_zip_file_get_error"] = a0 => (_zip_file_get_error = Module["_zip_file_get_error"] = wasmExports["zip_file_get_error"])(a0);

var _zip_fseek = Module["_zip_fseek"] = (a0, a1, a2, a3) => (_zip_fseek = Module["_zip_fseek"] = wasmExports["zip_fseek"])(a0, a1, a2, a3);

var _zip_ftell = Module["_zip_ftell"] = a0 => (_zip_ftell = Module["_zip_ftell"] = wasmExports["zip_ftell"])(a0);

var _php_register_internal_extensions = Module["_php_register_internal_extensions"] = () => (_php_register_internal_extensions = Module["_php_register_internal_extensions"] = wasmExports["php_register_internal_extensions"])();

var _php_version = Module["_php_version"] = () => (_php_version = Module["_php_version"] = wasmExports["php_version"])();

var _php_version_id = Module["_php_version_id"] = () => (_php_version_id = Module["_php_version_id"] = wasmExports["php_version_id"])();

var _php_get_internal_encoding = Module["_php_get_internal_encoding"] = () => (_php_get_internal_encoding = Module["_php_get_internal_encoding"] = wasmExports["php_get_internal_encoding"])();

var _php_get_input_encoding = Module["_php_get_input_encoding"] = () => (_php_get_input_encoding = Module["_php_get_input_encoding"] = wasmExports["php_get_input_encoding"])();

var _php_get_output_encoding = Module["_php_get_output_encoding"] = () => (_php_get_output_encoding = Module["_php_get_output_encoding"] = wasmExports["php_get_output_encoding"])();

var _php_during_module_startup = Module["_php_during_module_startup"] = () => (_php_during_module_startup = Module["_php_during_module_startup"] = wasmExports["php_during_module_startup"])();

var _php_during_module_shutdown = Module["_php_during_module_shutdown"] = () => (_php_during_module_shutdown = Module["_php_during_module_shutdown"] = wasmExports["php_during_module_shutdown"])();

var _php_get_module_initialized = Module["_php_get_module_initialized"] = () => (_php_get_module_initialized = Module["_php_get_module_initialized"] = wasmExports["php_get_module_initialized"])();

var _php_write = Module["_php_write"] = (a0, a1) => (_php_write = Module["_php_write"] = wasmExports["php_write"])(a0, a1);

var _php_verror = Module["_php_verror"] = (a0, a1, a2, a3, a4) => (_php_verror = Module["_php_verror"] = wasmExports["php_verror"])(a0, a1, a2, a3, a4);

var _get_active_class_name = Module["_get_active_class_name"] = a0 => (_get_active_class_name = Module["_get_active_class_name"] = wasmExports["get_active_class_name"])(a0);

var _zend_error_zstr = Module["_zend_error_zstr"] = (a0, a1) => (_zend_error_zstr = Module["_zend_error_zstr"] = wasmExports["zend_error_zstr"])(a0, a1);

var _php_error_docref1 = Module["_php_error_docref1"] = (a0, a1, a2, a3, a4) => (_php_error_docref1 = Module["_php_error_docref1"] = wasmExports["php_error_docref1"])(a0, a1, a2, a3, a4);

var _php_html_puts = Module["_php_html_puts"] = (a0, a1) => (_php_html_puts = Module["_php_html_puts"] = wasmExports["php_html_puts"])(a0, a1);

var _getpwuid = Module["_getpwuid"] = a0 => (_getpwuid = Module["_getpwuid"] = wasmExports["getpwuid"])(a0);

var _zend_alter_ini_entry_chars_ex = Module["_zend_alter_ini_entry_chars_ex"] = (a0, a1, a2, a3, a4, a5) => (_zend_alter_ini_entry_chars_ex = Module["_zend_alter_ini_entry_chars_ex"] = wasmExports["zend_alter_ini_entry_chars_ex"])(a0, a1, a2, a3, a4, a5);

var _php_request_startup = Module["_php_request_startup"] = () => (_php_request_startup = Module["_php_request_startup"] = wasmExports["php_request_startup"])();

var _zend_interned_strings_activate = Module["_zend_interned_strings_activate"] = () => (_zend_interned_strings_activate = Module["_zend_interned_strings_activate"] = wasmExports["zend_interned_strings_activate"])();

var _php_output_activate = Module["_php_output_activate"] = () => (_php_output_activate = Module["_php_output_activate"] = wasmExports["php_output_activate"])();

var _zend_activate = Module["_zend_activate"] = () => (_zend_activate = Module["_zend_activate"] = wasmExports["zend_activate"])();

var _sapi_activate = Module["_sapi_activate"] = () => (_sapi_activate = Module["_sapi_activate"] = wasmExports["sapi_activate"])();

var _zend_set_timeout = Module["_zend_set_timeout"] = (a0, a1) => (_zend_set_timeout = Module["_zend_set_timeout"] = wasmExports["zend_set_timeout"])(a0, a1);

var _php_output_start_user = Module["_php_output_start_user"] = (a0, a1, a2) => (_php_output_start_user = Module["_php_output_start_user"] = wasmExports["php_output_start_user"])(a0, a1, a2);

var _php_output_set_implicit_flush = Module["_php_output_set_implicit_flush"] = a0 => (_php_output_set_implicit_flush = Module["_php_output_set_implicit_flush"] = wasmExports["php_output_set_implicit_flush"])(a0);

var _php_hash_environment = Module["_php_hash_environment"] = () => (_php_hash_environment = Module["_php_hash_environment"] = wasmExports["php_hash_environment"])();

var _zend_activate_modules = Module["_zend_activate_modules"] = () => (_zend_activate_modules = Module["_zend_activate_modules"] = wasmExports["zend_activate_modules"])();

var _php_request_shutdown = Module["_php_request_shutdown"] = a0 => (_php_request_shutdown = Module["_php_request_shutdown"] = wasmExports["php_request_shutdown"])(a0);

var _zend_observer_fcall_end_all = Module["_zend_observer_fcall_end_all"] = () => (_zend_observer_fcall_end_all = Module["_zend_observer_fcall_end_all"] = wasmExports["zend_observer_fcall_end_all"])();

var _zend_call_destructors = Module["_zend_call_destructors"] = () => (_zend_call_destructors = Module["_zend_call_destructors"] = wasmExports["zend_call_destructors"])();

var _php_output_end_all = Module["_php_output_end_all"] = () => (_php_output_end_all = Module["_php_output_end_all"] = wasmExports["php_output_end_all"])();

var _zend_unset_timeout = Module["_zend_unset_timeout"] = () => (_zend_unset_timeout = Module["_zend_unset_timeout"] = wasmExports["zend_unset_timeout"])();

var _zend_deactivate_modules = Module["_zend_deactivate_modules"] = () => (_zend_deactivate_modules = Module["_zend_deactivate_modules"] = wasmExports["zend_deactivate_modules"])();

var _php_output_deactivate = Module["_php_output_deactivate"] = () => (_php_output_deactivate = Module["_php_output_deactivate"] = wasmExports["php_output_deactivate"])();

var _zend_deactivate = Module["_zend_deactivate"] = () => (_zend_deactivate = Module["_zend_deactivate"] = wasmExports["zend_deactivate"])();

var _zend_post_deactivate_modules = Module["_zend_post_deactivate_modules"] = () => (_zend_post_deactivate_modules = Module["_zend_post_deactivate_modules"] = wasmExports["zend_post_deactivate_modules"])();

var _sapi_deactivate_module = Module["_sapi_deactivate_module"] = () => (_sapi_deactivate_module = Module["_sapi_deactivate_module"] = wasmExports["sapi_deactivate_module"])();

var _sapi_deactivate_destroy = Module["_sapi_deactivate_destroy"] = () => (_sapi_deactivate_destroy = Module["_sapi_deactivate_destroy"] = wasmExports["sapi_deactivate_destroy"])();

var _virtual_cwd_deactivate = Module["_virtual_cwd_deactivate"] = () => (_virtual_cwd_deactivate = Module["_virtual_cwd_deactivate"] = wasmExports["virtual_cwd_deactivate"])();

var _zend_interned_strings_deactivate = Module["_zend_interned_strings_deactivate"] = () => (_zend_interned_strings_deactivate = Module["_zend_interned_strings_deactivate"] = wasmExports["zend_interned_strings_deactivate"])();

var _shutdown_memory_manager = Module["_shutdown_memory_manager"] = (a0, a1) => (_shutdown_memory_manager = Module["_shutdown_memory_manager"] = wasmExports["shutdown_memory_manager"])(a0, a1);

var _zend_set_memory_limit = Module["_zend_set_memory_limit"] = a0 => (_zend_set_memory_limit = Module["_zend_set_memory_limit"] = wasmExports["zend_set_memory_limit"])(a0);

var _php_com_initialize = Module["_php_com_initialize"] = () => (_php_com_initialize = Module["_php_com_initialize"] = wasmExports["php_com_initialize"])();

var _php_register_extensions = Module["_php_register_extensions"] = (a0, a1) => (_php_register_extensions = Module["_php_register_extensions"] = wasmExports["php_register_extensions"])(a0, a1);

var _zend_register_internal_module = Module["_zend_register_internal_module"] = a0 => (_zend_register_internal_module = Module["_zend_register_internal_module"] = wasmExports["zend_register_internal_module"])(a0);

var _php_module_startup = Module["_php_module_startup"] = (a0, a1) => (_php_module_startup = Module["_php_module_startup"] = wasmExports["php_module_startup"])(a0, a1);

var _sapi_initialize_empty_request = Module["_sapi_initialize_empty_request"] = () => (_sapi_initialize_empty_request = Module["_sapi_initialize_empty_request"] = wasmExports["sapi_initialize_empty_request"])();

var _php_output_startup = Module["_php_output_startup"] = () => (_php_output_startup = Module["_php_output_startup"] = wasmExports["php_output_startup"])();

var _php_printf_to_smart_string = Module["_php_printf_to_smart_string"] = (a0, a1, a2) => (_php_printf_to_smart_string = Module["_php_printf_to_smart_string"] = wasmExports["php_printf_to_smart_string"])(a0, a1, a2);

var _php_printf_to_smart_str = Module["_php_printf_to_smart_str"] = (a0, a1, a2) => (_php_printf_to_smart_str = Module["_php_printf_to_smart_str"] = wasmExports["php_printf_to_smart_str"])(a0, a1, a2);

var _zend_observer_startup = Module["_zend_observer_startup"] = () => (_zend_observer_startup = Module["_zend_observer_startup"] = wasmExports["zend_observer_startup"])();

var _zend_startup_modules = Module["_zend_startup_modules"] = () => (_zend_startup_modules = Module["_zend_startup_modules"] = wasmExports["zend_startup_modules"])();

var _zend_collect_module_handlers = Module["_zend_collect_module_handlers"] = () => (_zend_collect_module_handlers = Module["_zend_collect_module_handlers"] = wasmExports["zend_collect_module_handlers"])();

var _zend_register_functions = Module["_zend_register_functions"] = (a0, a1, a2, a3) => (_zend_register_functions = Module["_zend_register_functions"] = wasmExports["zend_register_functions"])(a0, a1, a2, a3);

var _zend_disable_functions = Module["_zend_disable_functions"] = a0 => (_zend_disable_functions = Module["_zend_disable_functions"] = wasmExports["zend_disable_functions"])(a0);

var _zend_observer_post_startup = Module["_zend_observer_post_startup"] = () => (_zend_observer_post_startup = Module["_zend_observer_post_startup"] = wasmExports["zend_observer_post_startup"])();

var _cfg_get_long = Module["_cfg_get_long"] = (a0, a1) => (_cfg_get_long = Module["_cfg_get_long"] = wasmExports["cfg_get_long"])(a0, a1);

var _sapi_deactivate = Module["_sapi_deactivate"] = () => (_sapi_deactivate = Module["_sapi_deactivate"] = wasmExports["sapi_deactivate"])();

var _virtual_cwd_activate = Module["_virtual_cwd_activate"] = () => (_virtual_cwd_activate = Module["_virtual_cwd_activate"] = wasmExports["virtual_cwd_activate"])();

var _zend_interned_strings_switch_storage = Module["_zend_interned_strings_switch_storage"] = a0 => (_zend_interned_strings_switch_storage = Module["_zend_interned_strings_switch_storage"] = wasmExports["zend_interned_strings_switch_storage"])(a0);

var _php_module_shutdown_wrapper = Module["_php_module_shutdown_wrapper"] = a0 => (_php_module_shutdown_wrapper = Module["_php_module_shutdown_wrapper"] = wasmExports["php_module_shutdown_wrapper"])(a0);

var _php_module_shutdown = Module["_php_module_shutdown"] = () => (_php_module_shutdown = Module["_php_module_shutdown"] = wasmExports["php_module_shutdown"])();

var _zend_ini_shutdown = Module["_zend_ini_shutdown"] = () => (_zend_ini_shutdown = Module["_zend_ini_shutdown"] = wasmExports["zend_ini_shutdown"])();

var _php_output_shutdown = Module["_php_output_shutdown"] = () => (_php_output_shutdown = Module["_php_output_shutdown"] = wasmExports["php_output_shutdown"])();

var _zend_interned_strings_dtor = Module["_zend_interned_strings_dtor"] = () => (_zend_interned_strings_dtor = Module["_zend_interned_strings_dtor"] = wasmExports["zend_interned_strings_dtor"])();

var _zend_observer_shutdown = Module["_zend_observer_shutdown"] = () => (_zend_observer_shutdown = Module["_zend_observer_shutdown"] = wasmExports["zend_observer_shutdown"])();

var _php_execute_script = Module["_php_execute_script"] = a0 => (_php_execute_script = Module["_php_execute_script"] = wasmExports["php_execute_script"])(a0);

var _virtual_chdir_file = Module["_virtual_chdir_file"] = (a0, a1) => (_virtual_chdir_file = Module["_virtual_chdir_file"] = wasmExports["virtual_chdir_file"])(a0, a1);

var _zend_stream_init_filename = Module["_zend_stream_init_filename"] = (a0, a1) => (_zend_stream_init_filename = Module["_zend_stream_init_filename"] = wasmExports["zend_stream_init_filename"])(a0, a1);

var _zend_ini_long = Module["_zend_ini_long"] = (a0, a1, a2) => (_zend_ini_long = Module["_zend_ini_long"] = wasmExports["zend_ini_long"])(a0, a1, a2);

var _zend_execute_scripts = Module["_zend_execute_scripts"] = (a0, a1, a2, a3) => (_zend_execute_scripts = Module["_zend_execute_scripts"] = wasmExports["zend_execute_scripts"])(a0, a1, a2, a3);

var _php_execute_simple_script = Module["_php_execute_simple_script"] = (a0, a1) => (_php_execute_simple_script = Module["_php_execute_simple_script"] = wasmExports["php_execute_simple_script"])(a0, a1);

var _php_handle_aborted_connection = Module["_php_handle_aborted_connection"] = () => (_php_handle_aborted_connection = Module["_php_handle_aborted_connection"] = wasmExports["php_handle_aborted_connection"])();

var _php_output_set_status = Module["_php_output_set_status"] = a0 => (_php_output_set_status = Module["_php_output_set_status"] = wasmExports["php_output_set_status"])(a0);

var _php_handle_auth_data = Module["_php_handle_auth_data"] = a0 => (_php_handle_auth_data = Module["_php_handle_auth_data"] = wasmExports["php_handle_auth_data"])(a0);

var _zend_binary_strncasecmp = Module["_zend_binary_strncasecmp"] = (a0, a1, a2, a3, a4) => (_zend_binary_strncasecmp = Module["_zend_binary_strncasecmp"] = wasmExports["zend_binary_strncasecmp"])(a0, a1, a2, a3, a4);

var _php_lint_script = Module["_php_lint_script"] = a0 => (_php_lint_script = Module["_php_lint_script"] = wasmExports["php_lint_script"])(a0);

var _zend_throw_error_exception = Module["_zend_throw_error_exception"] = (a0, a1, a2, a3) => (_zend_throw_error_exception = Module["_zend_throw_error_exception"] = wasmExports["zend_throw_error_exception"])(a0, a1, a2, a3);

var _zend_alloc_in_memory_limit_error_reporting = Module["_zend_alloc_in_memory_limit_error_reporting"] = () => (_zend_alloc_in_memory_limit_error_reporting = Module["_zend_alloc_in_memory_limit_error_reporting"] = wasmExports["zend_alloc_in_memory_limit_error_reporting"])();

var _php_output_discard_all = Module["_php_output_discard_all"] = () => (_php_output_discard_all = Module["_php_output_discard_all"] = wasmExports["php_output_discard_all"])();

var _fwrite = Module["_fwrite"] = (a0, a1, a2, a3) => (_fwrite = Module["_fwrite"] = wasmExports["fwrite"])(a0, a1, a2, a3);

var _zend_objects_store_mark_destructed = Module["_zend_objects_store_mark_destructed"] = a0 => (_zend_objects_store_mark_destructed = Module["_zend_objects_store_mark_destructed"] = wasmExports["zend_objects_store_mark_destructed"])(a0);

var __php_stream_open_wrapper_as_file = Module["__php_stream_open_wrapper_as_file"] = (a0, a1, a2, a3) => (__php_stream_open_wrapper_as_file = Module["__php_stream_open_wrapper_as_file"] = wasmExports["_php_stream_open_wrapper_as_file"])(a0, a1, a2, a3);

var _php_strip_url_passwd = Module["_php_strip_url_passwd"] = a0 => (_php_strip_url_passwd = Module["_php_strip_url_passwd"] = wasmExports["php_strip_url_passwd"])(a0);

var _asctime_r = Module["_asctime_r"] = (a0, a1) => (_asctime_r = Module["_asctime_r"] = wasmExports["asctime_r"])(a0, a1);

var _php_resolve_path = Module["_php_resolve_path"] = (a0, a1, a2) => (_php_resolve_path = Module["_php_resolve_path"] = wasmExports["php_resolve_path"])(a0, a1, a2);

var _zend_ini_color_displayer_cb = Module["_zend_ini_color_displayer_cb"] = (a0, a1) => (_zend_ini_color_displayer_cb = Module["_zend_ini_color_displayer_cb"] = wasmExports["zend_ini_color_displayer_cb"])(a0, a1);

var _OnUpdateBaseDir = Module["_OnUpdateBaseDir"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateBaseDir = Module["_OnUpdateBaseDir"] = wasmExports["OnUpdateBaseDir"])(a0, a1, a2, a3, a4, a5);

var _zend_ini_parse_uquantity_warn = Module["_zend_ini_parse_uquantity_warn"] = (a0, a1) => (_zend_ini_parse_uquantity_warn = Module["_zend_ini_parse_uquantity_warn"] = wasmExports["zend_ini_parse_uquantity_warn"])(a0, a1);

var _strdup = Module["_strdup"] = a0 => (_strdup = Module["_strdup"] = wasmExports["strdup"])(a0);

var _zend_disable_class = Module["_zend_disable_class"] = (a0, a1) => (_zend_disable_class = Module["_zend_disable_class"] = wasmExports["zend_disable_class"])(a0, a1);

var _ap_php_conv_10 = Module["_ap_php_conv_10"] = (a0, a1, a2, a3, a4, a5) => (_ap_php_conv_10 = Module["_ap_php_conv_10"] = wasmExports["ap_php_conv_10"])(a0, a1, a2, a3, a4, a5);

var _ap_php_conv_p2 = Module["_ap_php_conv_p2"] = (a0, a1, a2, a3, a4, a5) => (_ap_php_conv_p2 = Module["_ap_php_conv_p2"] = wasmExports["ap_php_conv_p2"])(a0, a1, a2, a3, a4, a5);

var _ap_php_vslprintf = Module["_ap_php_vslprintf"] = (a0, a1, a2, a3) => (_ap_php_vslprintf = Module["_ap_php_vslprintf"] = wasmExports["ap_php_vslprintf"])(a0, a1, a2, a3);

var _ap_php_vsnprintf = Module["_ap_php_vsnprintf"] = (a0, a1, a2, a3) => (_ap_php_vsnprintf = Module["_ap_php_vsnprintf"] = wasmExports["ap_php_vsnprintf"])(a0, a1, a2, a3);

var _ap_php_vasprintf = Module["_ap_php_vasprintf"] = (a0, a1, a2) => (_ap_php_vasprintf = Module["_ap_php_vasprintf"] = wasmExports["ap_php_vasprintf"])(a0, a1, a2);

var _ap_php_asprintf = Module["_ap_php_asprintf"] = (a0, a1, a2) => (_ap_php_asprintf = Module["_ap_php_asprintf"] = wasmExports["ap_php_asprintf"])(a0, a1, a2);

var _vasprintf = Module["_vasprintf"] = (a0, a1, a2) => (_vasprintf = Module["_vasprintf"] = wasmExports["vasprintf"])(a0, a1, a2);

var _zend_dtoa = Module["_zend_dtoa"] = (a0, a1, a2, a3, a4, a5) => (_zend_dtoa = Module["_zend_dtoa"] = wasmExports["zend_dtoa"])(a0, a1, a2, a3, a4, a5);

var _zend_freedtoa = Module["_zend_freedtoa"] = a0 => (_zend_freedtoa = Module["_zend_freedtoa"] = wasmExports["zend_freedtoa"])(a0);

var _isascii = Module["_isascii"] = a0 => (_isascii = Module["_isascii"] = wasmExports["isascii"])(a0);

var _strnlen = Module["_strnlen"] = (a0, a1) => (_strnlen = Module["_strnlen"] = wasmExports["strnlen"])(a0, a1);

var __smart_string_alloc_persistent = Module["__smart_string_alloc_persistent"] = (a0, a1) => (__smart_string_alloc_persistent = Module["__smart_string_alloc_persistent"] = wasmExports["_smart_string_alloc_persistent"])(a0, a1);

var __smart_string_alloc = Module["__smart_string_alloc"] = (a0, a1) => (__smart_string_alloc = Module["__smart_string_alloc"] = wasmExports["_smart_string_alloc"])(a0, a1);

var _php_check_specific_open_basedir = Module["_php_check_specific_open_basedir"] = (a0, a1) => (_php_check_specific_open_basedir = Module["_php_check_specific_open_basedir"] = wasmExports["php_check_specific_open_basedir"])(a0, a1);

var _php_fopen_primary_script = Module["_php_fopen_primary_script"] = a0 => (_php_fopen_primary_script = Module["_php_fopen_primary_script"] = wasmExports["php_fopen_primary_script"])(a0);

var _zend_stream_open = Module["_zend_stream_open"] = a0 => (_zend_stream_open = Module["_zend_stream_open"] = wasmExports["zend_stream_open"])(a0);

var _zend_is_executing = Module["_zend_is_executing"] = () => (_zend_is_executing = Module["_zend_is_executing"] = wasmExports["zend_is_executing"])();

var _php_fopen_with_path = Module["_php_fopen_with_path"] = (a0, a1, a2, a3) => (_php_fopen_with_path = Module["_php_fopen_with_path"] = wasmExports["php_fopen_with_path"])(a0, a1, a2, a3);

var _php_ini_builder_prepend = Module["_php_ini_builder_prepend"] = (a0, a1, a2) => (_php_ini_builder_prepend = Module["_php_ini_builder_prepend"] = wasmExports["php_ini_builder_prepend"])(a0, a1, a2);

var _php_ini_builder_unquoted = Module["_php_ini_builder_unquoted"] = (a0, a1, a2, a3, a4) => (_php_ini_builder_unquoted = Module["_php_ini_builder_unquoted"] = wasmExports["php_ini_builder_unquoted"])(a0, a1, a2, a3, a4);

var _php_ini_builder_quoted = Module["_php_ini_builder_quoted"] = (a0, a1, a2, a3, a4) => (_php_ini_builder_quoted = Module["_php_ini_builder_quoted"] = wasmExports["php_ini_builder_quoted"])(a0, a1, a2, a3, a4);

var _php_ini_builder_define = Module["_php_ini_builder_define"] = (a0, a1) => (_php_ini_builder_define = Module["_php_ini_builder_define"] = wasmExports["php_ini_builder_define"])(a0, a1);

var _config_zval_dtor = Module["_config_zval_dtor"] = a0 => (_config_zval_dtor = Module["_config_zval_dtor"] = wasmExports["config_zval_dtor"])(a0);

var _free_estring = Module["_free_estring"] = a0 => (_free_estring = Module["_free_estring"] = wasmExports["free_estring"])(a0);

var _scandir = Module["_scandir"] = (a0, a1, a2, a3) => (_scandir = Module["_scandir"] = wasmExports["scandir"])(a0, a1, a2, a3);

var _alphasort = Module["_alphasort"] = (a0, a1) => (_alphasort = Module["_alphasort"] = wasmExports["alphasort"])(a0, a1);

var _strlcat = Module["_strlcat"] = (a0, a1, a2) => (_strlcat = Module["_strlcat"] = wasmExports["strlcat"])(a0, a1, a2);

var _php_parse_user_ini_file = Module["_php_parse_user_ini_file"] = (a0, a1, a2) => (_php_parse_user_ini_file = Module["_php_parse_user_ini_file"] = wasmExports["php_parse_user_ini_file"])(a0, a1, a2);

var _php_ini_activate_config = Module["_php_ini_activate_config"] = (a0, a1, a2) => (_php_ini_activate_config = Module["_php_ini_activate_config"] = wasmExports["php_ini_activate_config"])(a0, a1, a2);

var _php_ini_has_per_dir_config = Module["_php_ini_has_per_dir_config"] = () => (_php_ini_has_per_dir_config = Module["_php_ini_has_per_dir_config"] = wasmExports["php_ini_has_per_dir_config"])();

var _php_ini_activate_per_dir_config = Module["_php_ini_activate_per_dir_config"] = (a0, a1) => (_php_ini_activate_per_dir_config = Module["_php_ini_activate_per_dir_config"] = wasmExports["php_ini_activate_per_dir_config"])(a0, a1);

var _php_ini_has_per_host_config = Module["_php_ini_has_per_host_config"] = () => (_php_ini_has_per_host_config = Module["_php_ini_has_per_host_config"] = wasmExports["php_ini_has_per_host_config"])();

var _php_ini_activate_per_host_config = Module["_php_ini_activate_per_host_config"] = (a0, a1) => (_php_ini_activate_per_host_config = Module["_php_ini_activate_per_host_config"] = wasmExports["php_ini_activate_per_host_config"])(a0, a1);

var _cfg_get_double = Module["_cfg_get_double"] = (a0, a1) => (_cfg_get_double = Module["_cfg_get_double"] = wasmExports["cfg_get_double"])(a0, a1);

var _php_ini_get_configuration_hash = Module["_php_ini_get_configuration_hash"] = () => (_php_ini_get_configuration_hash = Module["_php_ini_get_configuration_hash"] = wasmExports["php_ini_get_configuration_hash"])();

var _zend_load_extension = Module["_zend_load_extension"] = a0 => (_zend_load_extension = Module["_zend_load_extension"] = wasmExports["zend_load_extension"])(a0);

var _zend_load_extension_handle = Module["_zend_load_extension_handle"] = (a0, a1) => (_zend_load_extension_handle = Module["_zend_load_extension_handle"] = wasmExports["zend_load_extension_handle"])(a0, a1);

var _sapi_startup = Module["_sapi_startup"] = a0 => (_sapi_startup = Module["_sapi_startup"] = wasmExports["sapi_startup"])(a0);

var _sapi_shutdown = Module["_sapi_shutdown"] = () => (_sapi_shutdown = Module["_sapi_shutdown"] = wasmExports["sapi_shutdown"])();

var _sapi_handle_post = Module["_sapi_handle_post"] = a0 => (_sapi_handle_post = Module["_sapi_handle_post"] = wasmExports["sapi_handle_post"])(a0);

var _sapi_read_standard_form_data = Module["_sapi_read_standard_form_data"] = () => (_sapi_read_standard_form_data = Module["_sapi_read_standard_form_data"] = wasmExports["sapi_read_standard_form_data"])();

var _sapi_get_default_content_type = Module["_sapi_get_default_content_type"] = () => (_sapi_get_default_content_type = Module["_sapi_get_default_content_type"] = wasmExports["sapi_get_default_content_type"])();

var _sapi_get_default_content_type_header = Module["_sapi_get_default_content_type_header"] = a0 => (_sapi_get_default_content_type_header = Module["_sapi_get_default_content_type_header"] = wasmExports["sapi_get_default_content_type_header"])(a0);

var _sapi_apply_default_charset = Module["_sapi_apply_default_charset"] = (a0, a1) => (_sapi_apply_default_charset = Module["_sapi_apply_default_charset"] = wasmExports["sapi_apply_default_charset"])(a0, a1);

var _sapi_activate_headers_only = Module["_sapi_activate_headers_only"] = () => (_sapi_activate_headers_only = Module["_sapi_activate_headers_only"] = wasmExports["sapi_activate_headers_only"])();

var _destroy_uploaded_files_hash = Module["_destroy_uploaded_files_hash"] = () => (_destroy_uploaded_files_hash = Module["_destroy_uploaded_files_hash"] = wasmExports["destroy_uploaded_files_hash"])();

var _zend_llist_clean = Module["_zend_llist_clean"] = a0 => (_zend_llist_clean = Module["_zend_llist_clean"] = wasmExports["zend_llist_clean"])(a0);

var _sapi_register_post_entries = Module["_sapi_register_post_entries"] = a0 => (_sapi_register_post_entries = Module["_sapi_register_post_entries"] = wasmExports["sapi_register_post_entries"])(a0);

var _sapi_register_post_entry = Module["_sapi_register_post_entry"] = a0 => (_sapi_register_post_entry = Module["_sapi_register_post_entry"] = wasmExports["sapi_register_post_entry"])(a0);

var _sapi_unregister_post_entry = Module["_sapi_unregister_post_entry"] = a0 => (_sapi_unregister_post_entry = Module["_sapi_unregister_post_entry"] = wasmExports["sapi_unregister_post_entry"])(a0);

var _sapi_register_default_post_reader = Module["_sapi_register_default_post_reader"] = a0 => (_sapi_register_default_post_reader = Module["_sapi_register_default_post_reader"] = wasmExports["sapi_register_default_post_reader"])(a0);

var _sapi_register_treat_data = Module["_sapi_register_treat_data"] = a0 => (_sapi_register_treat_data = Module["_sapi_register_treat_data"] = wasmExports["sapi_register_treat_data"])(a0);

var _sapi_register_input_filter = Module["_sapi_register_input_filter"] = (a0, a1) => (_sapi_register_input_filter = Module["_sapi_register_input_filter"] = wasmExports["sapi_register_input_filter"])(a0, a1);

var _sapi_get_fd = Module["_sapi_get_fd"] = a0 => (_sapi_get_fd = Module["_sapi_get_fd"] = wasmExports["sapi_get_fd"])(a0);

var _sapi_force_http_10 = Module["_sapi_force_http_10"] = () => (_sapi_force_http_10 = Module["_sapi_force_http_10"] = wasmExports["sapi_force_http_10"])();

var _sapi_get_target_uid = Module["_sapi_get_target_uid"] = a0 => (_sapi_get_target_uid = Module["_sapi_get_target_uid"] = wasmExports["sapi_get_target_uid"])(a0);

var _sapi_get_target_gid = Module["_sapi_get_target_gid"] = a0 => (_sapi_get_target_gid = Module["_sapi_get_target_gid"] = wasmExports["sapi_get_target_gid"])(a0);

var _sapi_terminate_process = Module["_sapi_terminate_process"] = () => (_sapi_terminate_process = Module["_sapi_terminate_process"] = wasmExports["sapi_terminate_process"])();

var _sapi_add_request_header = Module["_sapi_add_request_header"] = (a0, a1, a2, a3, a4) => (_sapi_add_request_header = Module["_sapi_add_request_header"] = wasmExports["sapi_add_request_header"])(a0, a1, a2, a3, a4);

var _rfc1867_post_handler = Module["_rfc1867_post_handler"] = (a0, a1) => (_rfc1867_post_handler = Module["_rfc1867_post_handler"] = wasmExports["rfc1867_post_handler"])(a0, a1);

var _zend_multibyte_get_internal_encoding = Module["_zend_multibyte_get_internal_encoding"] = () => (_zend_multibyte_get_internal_encoding = Module["_zend_multibyte_get_internal_encoding"] = wasmExports["zend_multibyte_get_internal_encoding"])();

var _zend_multibyte_encoding_converter = Module["_zend_multibyte_encoding_converter"] = (a0, a1, a2, a3, a4, a5) => (_zend_multibyte_encoding_converter = Module["_zend_multibyte_encoding_converter"] = wasmExports["zend_multibyte_encoding_converter"])(a0, a1, a2, a3, a4, a5);

var _php_rfc1867_set_multibyte_callbacks = Module["_php_rfc1867_set_multibyte_callbacks"] = (a0, a1, a2, a3, a4, a5) => (_php_rfc1867_set_multibyte_callbacks = Module["_php_rfc1867_set_multibyte_callbacks"] = wasmExports["php_rfc1867_set_multibyte_callbacks"])(a0, a1, a2, a3, a4, a5);

var _zend_multibyte_encoding_detector = Module["_zend_multibyte_encoding_detector"] = (a0, a1, a2, a3) => (_zend_multibyte_encoding_detector = Module["_zend_multibyte_encoding_detector"] = wasmExports["zend_multibyte_encoding_detector"])(a0, a1, a2, a3);

var _zend_llist_get_first_ex = Module["_zend_llist_get_first_ex"] = (a0, a1) => (_zend_llist_get_first_ex = Module["_zend_llist_get_first_ex"] = wasmExports["zend_llist_get_first_ex"])(a0, a1);

var _zend_llist_get_next_ex = Module["_zend_llist_get_next_ex"] = (a0, a1) => (_zend_llist_get_next_ex = Module["_zend_llist_get_next_ex"] = wasmExports["zend_llist_get_next_ex"])(a0, a1);

var _php_register_variable_safe = Module["_php_register_variable_safe"] = (a0, a1, a2, a3) => (_php_register_variable_safe = Module["_php_register_variable_safe"] = wasmExports["php_register_variable_safe"])(a0, a1, a2, a3);

var _zend_hash_str_add_empty_element = Module["_zend_hash_str_add_empty_element"] = (a0, a1, a2) => (_zend_hash_str_add_empty_element = Module["_zend_hash_str_add_empty_element"] = wasmExports["zend_hash_str_add_empty_element"])(a0, a1, a2);

var _php_register_variable_ex = Module["_php_register_variable_ex"] = (a0, a1, a2) => (_php_register_variable_ex = Module["_php_register_variable_ex"] = wasmExports["php_register_variable_ex"])(a0, a1, a2);

var _php_default_post_reader = Module["_php_default_post_reader"] = () => (_php_default_post_reader = Module["_php_default_post_reader"] = wasmExports["php_default_post_reader"])();

var _php_default_treat_data = Module["_php_default_treat_data"] = (a0, a1, a2) => (_php_default_treat_data = Module["_php_default_treat_data"] = wasmExports["php_default_treat_data"])(a0, a1, a2);

var _php_default_input_filter = Module["_php_default_input_filter"] = (a0, a1, a2, a3, a4) => (_php_default_input_filter = Module["_php_default_input_filter"] = wasmExports["php_default_input_filter"])(a0, a1, a2, a3, a4);

var _php_std_post_handler = Module["_php_std_post_handler"] = (a0, a1) => (_php_std_post_handler = Module["_php_std_post_handler"] = wasmExports["php_std_post_handler"])(a0, a1);

var _php_register_variable = Module["_php_register_variable"] = (a0, a1, a2) => (_php_register_variable = Module["_php_register_variable"] = wasmExports["php_register_variable"])(a0, a1, a2);

var _php_register_known_variable = Module["_php_register_known_variable"] = (a0, a1, a2, a3) => (_php_register_known_variable = Module["_php_register_known_variable"] = wasmExports["php_register_known_variable"])(a0, a1, a2, a3);

var _php_build_argv = Module["_php_build_argv"] = (a0, a1) => (_php_build_argv = Module["_php_build_argv"] = wasmExports["php_build_argv"])(a0, a1);

var _zend_activate_auto_globals = Module["_zend_activate_auto_globals"] = () => (_zend_activate_auto_globals = Module["_zend_activate_auto_globals"] = wasmExports["zend_activate_auto_globals"])();

var _zend_hash_str_update_ind = Module["_zend_hash_str_update_ind"] = (a0, a1, a2, a3) => (_zend_hash_str_update_ind = Module["_zend_hash_str_update_ind"] = wasmExports["zend_hash_str_update_ind"])(a0, a1, a2, a3);

var _php_remove_tick_function = Module["_php_remove_tick_function"] = (a0, a1) => (_php_remove_tick_function = Module["_php_remove_tick_function"] = wasmExports["php_remove_tick_function"])(a0, a1);

var _php_network_freeaddresses = Module["_php_network_freeaddresses"] = a0 => (_php_network_freeaddresses = Module["_php_network_freeaddresses"] = wasmExports["php_network_freeaddresses"])(a0);

var _php_network_getaddresses = Module["_php_network_getaddresses"] = (a0, a1, a2, a3) => (_php_network_getaddresses = Module["_php_network_getaddresses"] = wasmExports["php_network_getaddresses"])(a0, a1, a2, a3);

var _socket = Module["_socket"] = (a0, a1, a2) => (_socket = Module["_socket"] = wasmExports["socket"])(a0, a1, a2);

var _gai_strerror = Module["_gai_strerror"] = a0 => (_gai_strerror = Module["_gai_strerror"] = wasmExports["gai_strerror"])(a0);

var _freeaddrinfo = Module["_freeaddrinfo"] = a0 => (_freeaddrinfo = Module["_freeaddrinfo"] = wasmExports["freeaddrinfo"])(a0);

var _php_network_connect_socket = Module["_php_network_connect_socket"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_network_connect_socket = Module["_php_network_connect_socket"] = wasmExports["php_network_connect_socket"])(a0, a1, a2, a3, a4, a5, a6);

var _connect = Module["_connect"] = (a0, a1, a2) => (_connect = Module["_connect"] = wasmExports["connect"])(a0, a1, a2);

var _getsockopt = Module["_getsockopt"] = (a0, a1, a2, a3, a4) => (_getsockopt = Module["_getsockopt"] = wasmExports["getsockopt"])(a0, a1, a2, a3, a4);

var _php_network_bind_socket_to_local_addr = Module["_php_network_bind_socket_to_local_addr"] = (a0, a1, a2, a3, a4, a5) => (_php_network_bind_socket_to_local_addr = Module["_php_network_bind_socket_to_local_addr"] = wasmExports["php_network_bind_socket_to_local_addr"])(a0, a1, a2, a3, a4, a5);

var _setsockopt = Module["_setsockopt"] = (a0, a1, a2, a3, a4) => (_setsockopt = Module["_setsockopt"] = wasmExports["setsockopt"])(a0, a1, a2, a3, a4);

var _bind = Module["_bind"] = (a0, a1, a2) => (_bind = Module["_bind"] = wasmExports["bind"])(a0, a1, a2);

var _php_network_populate_name_from_sockaddr = Module["_php_network_populate_name_from_sockaddr"] = (a0, a1, a2, a3, a4) => (_php_network_populate_name_from_sockaddr = Module["_php_network_populate_name_from_sockaddr"] = wasmExports["php_network_populate_name_from_sockaddr"])(a0, a1, a2, a3, a4);

var _php_network_get_peer_name = Module["_php_network_get_peer_name"] = (a0, a1, a2, a3) => (_php_network_get_peer_name = Module["_php_network_get_peer_name"] = wasmExports["php_network_get_peer_name"])(a0, a1, a2, a3);

var _getpeername = Module["_getpeername"] = (a0, a1, a2) => (_getpeername = Module["_getpeername"] = wasmExports["getpeername"])(a0, a1, a2);

var _php_network_get_sock_name = Module["_php_network_get_sock_name"] = (a0, a1, a2, a3) => (_php_network_get_sock_name = Module["_php_network_get_sock_name"] = wasmExports["php_network_get_sock_name"])(a0, a1, a2, a3);

var _getsockname = Module["_getsockname"] = (a0, a1, a2) => (_getsockname = Module["_getsockname"] = wasmExports["getsockname"])(a0, a1, a2);

var _php_network_accept_incoming = Module["_php_network_accept_incoming"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_network_accept_incoming = Module["_php_network_accept_incoming"] = wasmExports["php_network_accept_incoming"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _accept = Module["_accept"] = (a0, a1, a2) => (_accept = Module["_accept"] = wasmExports["accept"])(a0, a1, a2);

var _php_network_connect_socket_to_host = Module["_php_network_connect_socket_to_host"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_php_network_connect_socket_to_host = Module["_php_network_connect_socket_to_host"] = wasmExports["php_network_connect_socket_to_host"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var _php_any_addr = Module["_php_any_addr"] = (a0, a1, a2) => (_php_any_addr = Module["_php_any_addr"] = wasmExports["php_any_addr"])(a0, a1, a2);

var _php_sockaddr_size = Module["_php_sockaddr_size"] = a0 => (_php_sockaddr_size = Module["_php_sockaddr_size"] = wasmExports["php_sockaddr_size"])(a0);

var _php_set_sock_blocking = Module["_php_set_sock_blocking"] = (a0, a1) => (_php_set_sock_blocking = Module["_php_set_sock_blocking"] = wasmExports["php_set_sock_blocking"])(a0, a1);

var _poll = Module["_poll"] = (a0, a1, a2) => (_poll = Module["_poll"] = wasmExports["poll"])(a0, a1, a2);

var _php_open_temporary_fd = Module["_php_open_temporary_fd"] = (a0, a1, a2) => (_php_open_temporary_fd = Module["_php_open_temporary_fd"] = wasmExports["php_open_temporary_fd"])(a0, a1, a2);

var _php_open_temporary_file = Module["_php_open_temporary_file"] = (a0, a1, a2) => (_php_open_temporary_file = Module["_php_open_temporary_file"] = wasmExports["php_open_temporary_file"])(a0, a1, a2);

var _fdopen = Module["_fdopen"] = (a0, a1) => (_fdopen = Module["_fdopen"] = wasmExports["fdopen"])(a0, a1);

var _mkstemp = Module["_mkstemp"] = a0 => (_mkstemp = Module["_mkstemp"] = wasmExports["mkstemp"])(a0);

var _php_odbc_connstr_is_quoted = Module["_php_odbc_connstr_is_quoted"] = a0 => (_php_odbc_connstr_is_quoted = Module["_php_odbc_connstr_is_quoted"] = wasmExports["php_odbc_connstr_is_quoted"])(a0);

var _php_odbc_connstr_should_quote = Module["_php_odbc_connstr_should_quote"] = a0 => (_php_odbc_connstr_should_quote = Module["_php_odbc_connstr_should_quote"] = wasmExports["php_odbc_connstr_should_quote"])(a0);

var _php_odbc_connstr_estimate_quote_length = Module["_php_odbc_connstr_estimate_quote_length"] = a0 => (_php_odbc_connstr_estimate_quote_length = Module["_php_odbc_connstr_estimate_quote_length"] = wasmExports["php_odbc_connstr_estimate_quote_length"])(a0);

var _php_odbc_connstr_quote = Module["_php_odbc_connstr_quote"] = (a0, a1, a2) => (_php_odbc_connstr_quote = Module["_php_odbc_connstr_quote"] = wasmExports["php_odbc_connstr_quote"])(a0, a1, a2);

var _zend_stack_init = Module["_zend_stack_init"] = (a0, a1) => (_zend_stack_init = Module["_zend_stack_init"] = wasmExports["zend_stack_init"])(a0, a1);

var _zend_stack_top = Module["_zend_stack_top"] = a0 => (_zend_stack_top = Module["_zend_stack_top"] = wasmExports["zend_stack_top"])(a0);

var _php_output_handler_free = Module["_php_output_handler_free"] = a0 => (_php_output_handler_free = Module["_php_output_handler_free"] = wasmExports["php_output_handler_free"])(a0);

var _zend_stack_del_top = Module["_zend_stack_del_top"] = a0 => (_zend_stack_del_top = Module["_zend_stack_del_top"] = wasmExports["zend_stack_del_top"])(a0);

var _zend_stack_destroy = Module["_zend_stack_destroy"] = a0 => (_zend_stack_destroy = Module["_zend_stack_destroy"] = wasmExports["zend_stack_destroy"])(a0);

var _php_output_get_status = Module["_php_output_get_status"] = () => (_php_output_get_status = Module["_php_output_get_status"] = wasmExports["php_output_get_status"])();

var _php_output_write_unbuffered = Module["_php_output_write_unbuffered"] = (a0, a1) => (_php_output_write_unbuffered = Module["_php_output_write_unbuffered"] = wasmExports["php_output_write_unbuffered"])(a0, a1);

var _php_output_flush = Module["_php_output_flush"] = () => (_php_output_flush = Module["_php_output_flush"] = wasmExports["php_output_flush"])();

var _zend_stack_push = Module["_zend_stack_push"] = (a0, a1) => (_zend_stack_push = Module["_zend_stack_push"] = wasmExports["zend_stack_push"])(a0, a1);

var _php_output_clean = Module["_php_output_clean"] = () => (_php_output_clean = Module["_php_output_clean"] = wasmExports["php_output_clean"])();

var _php_output_clean_all = Module["_php_output_clean_all"] = () => (_php_output_clean_all = Module["_php_output_clean_all"] = wasmExports["php_output_clean_all"])();

var _zend_stack_apply_with_argument = Module["_zend_stack_apply_with_argument"] = (a0, a1, a2, a3) => (_zend_stack_apply_with_argument = Module["_zend_stack_apply_with_argument"] = wasmExports["zend_stack_apply_with_argument"])(a0, a1, a2, a3);

var _zend_stack_count = Module["_zend_stack_count"] = a0 => (_zend_stack_count = Module["_zend_stack_count"] = wasmExports["zend_stack_count"])(a0);

var _php_output_get_length = Module["_php_output_get_length"] = a0 => (_php_output_get_length = Module["_php_output_get_length"] = wasmExports["php_output_get_length"])(a0);

var _php_output_get_active_handler = Module["_php_output_get_active_handler"] = () => (_php_output_get_active_handler = Module["_php_output_get_active_handler"] = wasmExports["php_output_get_active_handler"])();

var _php_output_handler_create_internal = Module["_php_output_handler_create_internal"] = (a0, a1, a2, a3, a4) => (_php_output_handler_create_internal = Module["_php_output_handler_create_internal"] = wasmExports["php_output_handler_create_internal"])(a0, a1, a2, a3, a4);

var _php_output_handler_start = Module["_php_output_handler_start"] = a0 => (_php_output_handler_start = Module["_php_output_handler_start"] = wasmExports["php_output_handler_start"])(a0);

var _php_output_start_devnull = Module["_php_output_start_devnull"] = () => (_php_output_start_devnull = Module["_php_output_start_devnull"] = wasmExports["php_output_start_devnull"])();

var _php_output_handler_create_user = Module["_php_output_handler_create_user"] = (a0, a1, a2) => (_php_output_handler_create_user = Module["_php_output_handler_create_user"] = wasmExports["php_output_handler_create_user"])(a0, a1, a2);

var _php_output_handler_set_context = Module["_php_output_handler_set_context"] = (a0, a1, a2) => (_php_output_handler_set_context = Module["_php_output_handler_set_context"] = wasmExports["php_output_handler_set_context"])(a0, a1, a2);

var _php_output_handler_alias = Module["_php_output_handler_alias"] = (a0, a1) => (_php_output_handler_alias = Module["_php_output_handler_alias"] = wasmExports["php_output_handler_alias"])(a0, a1);

var _php_output_handler_started = Module["_php_output_handler_started"] = (a0, a1) => (_php_output_handler_started = Module["_php_output_handler_started"] = wasmExports["php_output_handler_started"])(a0, a1);

var _zend_stack_base = Module["_zend_stack_base"] = a0 => (_zend_stack_base = Module["_zend_stack_base"] = wasmExports["zend_stack_base"])(a0);

var _php_output_handler_conflict = Module["_php_output_handler_conflict"] = (a0, a1, a2, a3) => (_php_output_handler_conflict = Module["_php_output_handler_conflict"] = wasmExports["php_output_handler_conflict"])(a0, a1, a2, a3);

var _php_output_handler_conflict_register = Module["_php_output_handler_conflict_register"] = (a0, a1, a2) => (_php_output_handler_conflict_register = Module["_php_output_handler_conflict_register"] = wasmExports["php_output_handler_conflict_register"])(a0, a1, a2);

var _php_output_handler_reverse_conflict_register = Module["_php_output_handler_reverse_conflict_register"] = (a0, a1, a2) => (_php_output_handler_reverse_conflict_register = Module["_php_output_handler_reverse_conflict_register"] = wasmExports["php_output_handler_reverse_conflict_register"])(a0, a1, a2);

var _php_output_handler_alias_register = Module["_php_output_handler_alias_register"] = (a0, a1, a2) => (_php_output_handler_alias_register = Module["_php_output_handler_alias_register"] = wasmExports["php_output_handler_alias_register"])(a0, a1, a2);

var _php_output_handler_hook = Module["_php_output_handler_hook"] = (a0, a1) => (_php_output_handler_hook = Module["_php_output_handler_hook"] = wasmExports["php_output_handler_hook"])(a0, a1);

var _php_output_handler_dtor = Module["_php_output_handler_dtor"] = a0 => (_php_output_handler_dtor = Module["_php_output_handler_dtor"] = wasmExports["php_output_handler_dtor"])(a0);

var _zend_is_compiling = Module["_zend_is_compiling"] = () => (_zend_is_compiling = Module["_zend_is_compiling"] = wasmExports["zend_is_compiling"])();

var _zend_get_compiled_filename = Module["_zend_get_compiled_filename"] = () => (_zend_get_compiled_filename = Module["_zend_get_compiled_filename"] = wasmExports["zend_get_compiled_filename"])();

var _zend_get_compiled_lineno = Module["_zend_get_compiled_lineno"] = () => (_zend_get_compiled_lineno = Module["_zend_get_compiled_lineno"] = wasmExports["zend_get_compiled_lineno"])();

var _syslog = Module["_syslog"] = (a0, a1, a2) => (_syslog = Module["_syslog"] = wasmExports["syslog"])(a0, a1, a2);

var _openlog = Module["_openlog"] = (a0, a1, a2) => (_openlog = Module["_openlog"] = wasmExports["openlog"])(a0, a1, a2);

var _closelog = Module["_closelog"] = () => (_closelog = Module["_closelog"] = wasmExports["closelog"])();

var _zend_vstrpprintf = Module["_zend_vstrpprintf"] = (a0, a1, a2) => (_zend_vstrpprintf = Module["_zend_vstrpprintf"] = wasmExports["zend_vstrpprintf"])(a0, a1, a2);

var _php_stream_get_url_stream_wrappers_hash_global = Module["_php_stream_get_url_stream_wrappers_hash_global"] = () => (_php_stream_get_url_stream_wrappers_hash_global = Module["_php_stream_get_url_stream_wrappers_hash_global"] = wasmExports["php_stream_get_url_stream_wrappers_hash_global"])();

var _php_stream_encloses = Module["_php_stream_encloses"] = (a0, a1) => (_php_stream_encloses = Module["_php_stream_encloses"] = wasmExports["php_stream_encloses"])(a0, a1);

var _php_stream_from_persistent_id = Module["_php_stream_from_persistent_id"] = (a0, a1) => (_php_stream_from_persistent_id = Module["_php_stream_from_persistent_id"] = wasmExports["php_stream_from_persistent_id"])(a0, a1);

var __php_stream_free_enclosed = Module["__php_stream_free_enclosed"] = (a0, a1) => (__php_stream_free_enclosed = Module["__php_stream_free_enclosed"] = wasmExports["_php_stream_free_enclosed"])(a0, a1);

var __php_stream_fill_read_buffer = Module["__php_stream_fill_read_buffer"] = (a0, a1) => (__php_stream_fill_read_buffer = Module["__php_stream_fill_read_buffer"] = wasmExports["_php_stream_fill_read_buffer"])(a0, a1);

var __php_stream_putc = Module["__php_stream_putc"] = (a0, a1) => (__php_stream_putc = Module["__php_stream_putc"] = wasmExports["_php_stream_putc"])(a0, a1);

var __php_stream_puts = Module["__php_stream_puts"] = (a0, a1) => (__php_stream_puts = Module["__php_stream_puts"] = wasmExports["_php_stream_puts"])(a0, a1);

var _fflush = Module["_fflush"] = a0 => (_fflush = Module["_fflush"] = wasmExports["fflush"])(a0);

var __php_stream_mmap_range = Module["__php_stream_mmap_range"] = (a0, a1, a2, a3, a4) => (__php_stream_mmap_range = Module["__php_stream_mmap_range"] = wasmExports["_php_stream_mmap_range"])(a0, a1, a2, a3, a4);

var __php_stream_mmap_unmap_ex = Module["__php_stream_mmap_unmap_ex"] = (a0, a1) => (__php_stream_mmap_unmap_ex = Module["__php_stream_mmap_unmap_ex"] = wasmExports["_php_stream_mmap_unmap_ex"])(a0, a1);

var __php_stream_mmap_unmap = Module["__php_stream_mmap_unmap"] = a0 => (__php_stream_mmap_unmap = Module["__php_stream_mmap_unmap"] = wasmExports["_php_stream_mmap_unmap"])(a0);

var __php_stream_copy_to_stream = Module["__php_stream_copy_to_stream"] = (a0, a1, a2) => (__php_stream_copy_to_stream = Module["__php_stream_copy_to_stream"] = wasmExports["_php_stream_copy_to_stream"])(a0, a1, a2);

var _php_get_stream_filters_hash_global = Module["_php_get_stream_filters_hash_global"] = () => (_php_get_stream_filters_hash_global = Module["_php_get_stream_filters_hash_global"] = wasmExports["php_get_stream_filters_hash_global"])();

var _php_stream_xport_register = Module["_php_stream_xport_register"] = (a0, a1) => (_php_stream_xport_register = Module["_php_stream_xport_register"] = wasmExports["php_stream_xport_register"])(a0, a1);

var _php_stream_generic_socket_factory = Module["_php_stream_generic_socket_factory"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_php_stream_generic_socket_factory = Module["_php_stream_generic_socket_factory"] = wasmExports["php_stream_generic_socket_factory"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _php_register_url_stream_wrapper_volatile = Module["_php_register_url_stream_wrapper_volatile"] = (a0, a1) => (_php_register_url_stream_wrapper_volatile = Module["_php_register_url_stream_wrapper_volatile"] = wasmExports["php_register_url_stream_wrapper_volatile"])(a0, a1);

var _php_unregister_url_stream_wrapper_volatile = Module["_php_unregister_url_stream_wrapper_volatile"] = a0 => (_php_unregister_url_stream_wrapper_volatile = Module["_php_unregister_url_stream_wrapper_volatile"] = wasmExports["php_unregister_url_stream_wrapper_volatile"])(a0);

var __php_stream_make_seekable = Module["__php_stream_make_seekable"] = (a0, a1, a2) => (__php_stream_make_seekable = Module["__php_stream_make_seekable"] = wasmExports["_php_stream_make_seekable"])(a0, a1, a2);

var _qsort = Module["_qsort"] = (a0, a1, a2, a3) => (_qsort = Module["_qsort"] = wasmExports["qsort"])(a0, a1, a2, a3);

var _zend_llist_count = Module["_zend_llist_count"] = a0 => (_zend_llist_count = Module["_zend_llist_count"] = wasmExports["zend_llist_count"])(a0);

var _fopencookie = Module["_fopencookie"] = (a0, a1, a2) => (_fopencookie = Module["_fopencookie"] = wasmExports["fopencookie"])(a0, a1, a2);

var _fseek = Module["_fseek"] = (a0, a1, a2) => (_fseek = Module["_fseek"] = wasmExports["fseek"])(a0, a1, a2);

var __php_stream_mode_to_str = Module["__php_stream_mode_to_str"] = a0 => (__php_stream_mode_to_str = Module["__php_stream_mode_to_str"] = wasmExports["_php_stream_mode_to_str"])(a0);

var __php_stream_memory_get_buffer = Module["__php_stream_memory_get_buffer"] = a0 => (__php_stream_memory_get_buffer = Module["__php_stream_memory_get_buffer"] = wasmExports["_php_stream_memory_get_buffer"])(a0);

var __php_stream_temp_open = Module["__php_stream_temp_open"] = (a0, a1, a2, a3) => (__php_stream_temp_open = Module["__php_stream_temp_open"] = wasmExports["_php_stream_temp_open"])(a0, a1, a2, a3);

var __php_stream_fopen_temporary_file = Module["__php_stream_fopen_temporary_file"] = (a0, a1, a2) => (__php_stream_fopen_temporary_file = Module["__php_stream_fopen_temporary_file"] = wasmExports["_php_stream_fopen_temporary_file"])(a0, a1, a2);

var _php_stream_bucket_split = Module["_php_stream_bucket_split"] = (a0, a1, a2, a3) => (_php_stream_bucket_split = Module["_php_stream_bucket_split"] = wasmExports["php_stream_bucket_split"])(a0, a1, a2, a3);

var __php_stream_filter_prepend = Module["__php_stream_filter_prepend"] = (a0, a1) => (__php_stream_filter_prepend = Module["__php_stream_filter_prepend"] = wasmExports["_php_stream_filter_prepend"])(a0, a1);

var _php_stream_parse_fopen_modes = Module["_php_stream_parse_fopen_modes"] = (a0, a1) => (_php_stream_parse_fopen_modes = Module["_php_stream_parse_fopen_modes"] = wasmExports["php_stream_parse_fopen_modes"])(a0, a1);

var _ftell = Module["_ftell"] = a0 => (_ftell = Module["_ftell"] = wasmExports["ftell"])(a0);

var __php_stream_fopen = Module["__php_stream_fopen"] = (a0, a1, a2, a3) => (__php_stream_fopen = Module["__php_stream_fopen"] = wasmExports["_php_stream_fopen"])(a0, a1, a2, a3);

var __php_stream_fopen_with_path = Module["__php_stream_fopen_with_path"] = (a0, a1, a2, a3, a4) => (__php_stream_fopen_with_path = Module["__php_stream_fopen_with_path"] = wasmExports["_php_stream_fopen_with_path"])(a0, a1, a2, a3, a4);

var _fread = Module["_fread"] = (a0, a1, a2, a3) => (_fread = Module["_fread"] = wasmExports["fread"])(a0, a1, a2, a3);

var _feof = Module["_feof"] = a0 => (_feof = Module["_feof"] = wasmExports["feof"])(a0);

var _munmap = Module["_munmap"] = (a0, a1) => (_munmap = Module["_munmap"] = wasmExports["munmap"])(a0, a1);

var _setvbuf = Module["_setvbuf"] = (a0, a1, a2, a3) => (_setvbuf = Module["_setvbuf"] = wasmExports["setvbuf"])(a0, a1, a2, a3);

var _mmap = Module["_mmap"] = (a0, a1, a2, a3, a4, a5, a6) => (_mmap = Module["_mmap"] = wasmExports["mmap"])(a0, a1, a2, a3, a4, a5, a6);

var _fdatasync = Module["_fdatasync"] = a0 => (_fdatasync = Module["_fdatasync"] = wasmExports["fdatasync"])(a0);

var _fsync = Module["_fsync"] = a0 => (_fsync = Module["_fsync"] = wasmExports["fsync"])(a0);

var _rewinddir = Module["_rewinddir"] = a0 => (_rewinddir = Module["_rewinddir"] = wasmExports["rewinddir"])(a0);

var _rmdir = Module["_rmdir"] = a0 => (_rmdir = Module["_rmdir"] = wasmExports["rmdir"])(a0);

var _add_property_resource_ex = Module["_add_property_resource_ex"] = (a0, a1, a2, a3) => (_add_property_resource_ex = Module["_add_property_resource_ex"] = wasmExports["add_property_resource_ex"])(a0, a1, a2, a3);

var _php_stream_xport_unregister = Module["_php_stream_xport_unregister"] = a0 => (_php_stream_xport_unregister = Module["_php_stream_xport_unregister"] = wasmExports["php_stream_xport_unregister"])(a0);

var _php_stream_xport_connect = Module["_php_stream_xport_connect"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_stream_xport_connect = Module["_php_stream_xport_connect"] = wasmExports["php_stream_xport_connect"])(a0, a1, a2, a3, a4, a5, a6);

var _php_stream_xport_bind = Module["_php_stream_xport_bind"] = (a0, a1, a2, a3) => (_php_stream_xport_bind = Module["_php_stream_xport_bind"] = wasmExports["php_stream_xport_bind"])(a0, a1, a2, a3);

var _php_stream_xport_listen = Module["_php_stream_xport_listen"] = (a0, a1, a2) => (_php_stream_xport_listen = Module["_php_stream_xport_listen"] = wasmExports["php_stream_xport_listen"])(a0, a1, a2);

var _send = Module["_send"] = (a0, a1, a2, a3) => (_send = Module["_send"] = wasmExports["send"])(a0, a1, a2, a3);

var _recv = Module["_recv"] = (a0, a1, a2, a3) => (_recv = Module["_recv"] = wasmExports["recv"])(a0, a1, a2, a3);

var _listen = Module["_listen"] = (a0, a1) => (_listen = Module["_listen"] = wasmExports["listen"])(a0, a1);

var _shutdown = Module["_shutdown"] = (a0, a1) => (_shutdown = Module["_shutdown"] = wasmExports["shutdown"])(a0, a1);

var _sendto = Module["_sendto"] = (a0, a1, a2, a3, a4, a5) => (_sendto = Module["_sendto"] = wasmExports["sendto"])(a0, a1, a2, a3, a4, a5);

var _recvfrom = Module["_recvfrom"] = (a0, a1, a2, a3, a4, a5) => (_recvfrom = Module["_recvfrom"] = wasmExports["recvfrom"])(a0, a1, a2, a3, a4, a5);

var __php_glob_stream_get_pattern = Module["__php_glob_stream_get_pattern"] = (a0, a1) => (__php_glob_stream_get_pattern = Module["__php_glob_stream_get_pattern"] = wasmExports["_php_glob_stream_get_pattern"])(a0, a1);

var _zendparse = Module["_zendparse"] = () => (_zendparse = Module["_zendparse"] = wasmExports["zendparse"])();

var _zend_lex_tstring = Module["_zend_lex_tstring"] = (a0, a1) => (_zend_lex_tstring = Module["_zend_lex_tstring"] = wasmExports["zend_lex_tstring"])(a0, a1);

var _zend_ast_create_zval = Module["_zend_ast_create_zval"] = a0 => (_zend_ast_create_zval = Module["_zend_ast_create_zval"] = wasmExports["zend_ast_create_zval"])(a0);

var _zend_ast_list_add = Module["_zend_ast_list_add"] = (a0, a1) => (_zend_ast_list_add = Module["_zend_ast_list_add"] = wasmExports["zend_ast_list_add"])(a0, a1);

var _zend_ast_create_list_0 = Module["_zend_ast_create_list_0"] = a0 => (_zend_ast_create_list_0 = Module["_zend_ast_create_list_0"] = wasmExports["zend_ast_create_list_0"])(a0);

var _zend_ast_create_2 = Module["_zend_ast_create_2"] = (a0, a1, a2) => (_zend_ast_create_2 = Module["_zend_ast_create_2"] = wasmExports["zend_ast_create_2"])(a0, a1, a2);

var _zend_ast_create_list_1 = Module["_zend_ast_create_list_1"] = (a0, a1) => (_zend_ast_create_list_1 = Module["_zend_ast_create_list_1"] = wasmExports["zend_ast_create_list_1"])(a0, a1);

var _zend_ast_create_1 = Module["_zend_ast_create_1"] = (a0, a1) => (_zend_ast_create_1 = Module["_zend_ast_create_1"] = wasmExports["zend_ast_create_1"])(a0, a1);

var _zend_ast_create_zval_from_long = Module["_zend_ast_create_zval_from_long"] = a0 => (_zend_ast_create_zval_from_long = Module["_zend_ast_create_zval_from_long"] = wasmExports["zend_ast_create_zval_from_long"])(a0);

var _zend_get_scanned_file_offset = Module["_zend_get_scanned_file_offset"] = () => (_zend_get_scanned_file_offset = Module["_zend_get_scanned_file_offset"] = wasmExports["zend_get_scanned_file_offset"])();

var _zend_ast_create_4 = Module["_zend_ast_create_4"] = (a0, a1, a2, a3, a4) => (_zend_ast_create_4 = Module["_zend_ast_create_4"] = wasmExports["zend_ast_create_4"])(a0, a1, a2, a3, a4);

var _zend_ast_create_3 = Module["_zend_ast_create_3"] = (a0, a1, a2, a3) => (_zend_ast_create_3 = Module["_zend_ast_create_3"] = wasmExports["zend_ast_create_3"])(a0, a1, a2, a3);

var _zend_ast_create_decl = Module["_zend_ast_create_decl"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_zend_ast_create_decl = Module["_zend_ast_create_decl"] = wasmExports["zend_ast_create_decl"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var _zend_ast_create_zval_from_str = Module["_zend_ast_create_zval_from_str"] = a0 => (_zend_ast_create_zval_from_str = Module["_zend_ast_create_zval_from_str"] = wasmExports["zend_ast_create_zval_from_str"])(a0);

var _zend_ast_create_list_2 = Module["_zend_ast_create_list_2"] = (a0, a1, a2) => (_zend_ast_create_list_2 = Module["_zend_ast_create_list_2"] = wasmExports["zend_ast_create_list_2"])(a0, a1, a2);

var _zend_ast_create_0 = Module["_zend_ast_create_0"] = a0 => (_zend_ast_create_0 = Module["_zend_ast_create_0"] = wasmExports["zend_ast_create_0"])(a0);

var _zend_ast_destroy = Module["_zend_ast_destroy"] = a0 => (_zend_ast_destroy = Module["_zend_ast_destroy"] = wasmExports["zend_ast_destroy"])(a0);

var _zend_ast_create_zval_ex = Module["_zend_ast_create_zval_ex"] = (a0, a1) => (_zend_ast_create_zval_ex = Module["_zend_ast_create_zval_ex"] = wasmExports["zend_ast_create_zval_ex"])(a0, a1);

var _zend_ast_create_class_const_or_name = Module["_zend_ast_create_class_const_or_name"] = (a0, a1) => (_zend_ast_create_class_const_or_name = Module["_zend_ast_create_class_const_or_name"] = wasmExports["zend_ast_create_class_const_or_name"])(a0, a1);

var _zend_ast_create_5 = Module["_zend_ast_create_5"] = (a0, a1, a2, a3, a4, a5) => (_zend_ast_create_5 = Module["_zend_ast_create_5"] = wasmExports["zend_ast_create_5"])(a0, a1, a2, a3, a4, a5);

var _zend_ptr_stack_init = Module["_zend_ptr_stack_init"] = a0 => (_zend_ptr_stack_init = Module["_zend_ptr_stack_init"] = wasmExports["zend_ptr_stack_init"])(a0);

var _zend_ptr_stack_clean = Module["_zend_ptr_stack_clean"] = (a0, a1, a2) => (_zend_ptr_stack_clean = Module["_zend_ptr_stack_clean"] = wasmExports["zend_ptr_stack_clean"])(a0, a1, a2);

var _zend_ptr_stack_destroy = Module["_zend_ptr_stack_destroy"] = a0 => (_zend_ptr_stack_destroy = Module["_zend_ptr_stack_destroy"] = wasmExports["zend_ptr_stack_destroy"])(a0);

var _zend_restore_compiled_filename = Module["_zend_restore_compiled_filename"] = a0 => (_zend_restore_compiled_filename = Module["_zend_restore_compiled_filename"] = wasmExports["zend_restore_compiled_filename"])(a0);

var _zend_multibyte_set_filter = Module["_zend_multibyte_set_filter"] = a0 => (_zend_multibyte_set_filter = Module["_zend_multibyte_set_filter"] = wasmExports["zend_multibyte_set_filter"])(a0);

var _zend_multibyte_check_lexer_compatibility = Module["_zend_multibyte_check_lexer_compatibility"] = a0 => (_zend_multibyte_check_lexer_compatibility = Module["_zend_multibyte_check_lexer_compatibility"] = wasmExports["zend_multibyte_check_lexer_compatibility"])(a0);

var _zend_stream_fixup = Module["_zend_stream_fixup"] = (a0, a1, a2) => (_zend_stream_fixup = Module["_zend_stream_fixup"] = wasmExports["zend_stream_fixup"])(a0, a1, a2);

var _zend_multibyte_get_encoding_name = Module["_zend_multibyte_get_encoding_name"] = a0 => (_zend_multibyte_get_encoding_name = Module["_zend_multibyte_get_encoding_name"] = wasmExports["zend_multibyte_get_encoding_name"])(a0);

var _zend_set_compiled_filename = Module["_zend_set_compiled_filename"] = a0 => (_zend_set_compiled_filename = Module["_zend_set_compiled_filename"] = wasmExports["zend_set_compiled_filename"])(a0);

var _compile_file = Module["_compile_file"] = (a0, a1) => (_compile_file = Module["_compile_file"] = wasmExports["compile_file"])(a0, a1);

var _zend_message_dispatcher = Module["_zend_message_dispatcher"] = (a0, a1) => (_zend_message_dispatcher = Module["_zend_message_dispatcher"] = wasmExports["zend_message_dispatcher"])(a0, a1);

var _zend_compile_string_to_ast = Module["_zend_compile_string_to_ast"] = (a0, a1, a2) => (_zend_compile_string_to_ast = Module["_zend_compile_string_to_ast"] = wasmExports["zend_compile_string_to_ast"])(a0, a1, a2);

var _zend_prepare_string_for_scanning = Module["_zend_prepare_string_for_scanning"] = (a0, a1) => (_zend_prepare_string_for_scanning = Module["_zend_prepare_string_for_scanning"] = wasmExports["zend_prepare_string_for_scanning"])(a0, a1);

var _compile_filename = Module["_compile_filename"] = (a0, a1) => (_compile_filename = Module["_compile_filename"] = wasmExports["compile_filename"])(a0, a1);

var _compile_string = Module["_compile_string"] = (a0, a1, a2) => (_compile_string = Module["_compile_string"] = wasmExports["compile_string"])(a0, a1, a2);

var _zend_highlight = Module["_zend_highlight"] = a0 => (_zend_highlight = Module["_zend_highlight"] = wasmExports["zend_highlight"])(a0);

var _zend_multibyte_yyinput_again = Module["_zend_multibyte_yyinput_again"] = (a0, a1) => (_zend_multibyte_yyinput_again = Module["_zend_multibyte_yyinput_again"] = wasmExports["zend_multibyte_yyinput_again"])(a0, a1);

var _lex_scan = Module["_lex_scan"] = (a0, a1) => (_lex_scan = Module["_lex_scan"] = wasmExports["lex_scan"])(a0, a1);

var _zend_oct_strtod = Module["_zend_oct_strtod"] = (a0, a1) => (_zend_oct_strtod = Module["_zend_oct_strtod"] = wasmExports["zend_oct_strtod"])(a0, a1);

var _zend_stack_is_empty = Module["_zend_stack_is_empty"] = a0 => (_zend_stack_is_empty = Module["_zend_stack_is_empty"] = wasmExports["zend_stack_is_empty"])(a0);

var _zend_bin_strtod = Module["_zend_bin_strtod"] = (a0, a1) => (_zend_bin_strtod = Module["_zend_bin_strtod"] = wasmExports["zend_bin_strtod"])(a0, a1);

var _zend_hex_strtod = Module["_zend_hex_strtod"] = (a0, a1) => (_zend_hex_strtod = Module["_zend_hex_strtod"] = wasmExports["zend_hex_strtod"])(a0, a1);

var _zend_ptr_stack_reverse_apply = Module["_zend_ptr_stack_reverse_apply"] = (a0, a1) => (_zend_ptr_stack_reverse_apply = Module["_zend_ptr_stack_reverse_apply"] = wasmExports["zend_ptr_stack_reverse_apply"])(a0, a1);

var _zend_exception_save = Module["_zend_exception_save"] = () => (_zend_exception_save = Module["_zend_exception_save"] = wasmExports["zend_exception_save"])();

var _zend_exception_restore = Module["_zend_exception_restore"] = () => (_zend_exception_restore = Module["_zend_exception_restore"] = wasmExports["zend_exception_restore"])();

var _zend_ast_create_zval_with_lineno = Module["_zend_ast_create_zval_with_lineno"] = (a0, a1) => (_zend_ast_create_zval_with_lineno = Module["_zend_ast_create_zval_with_lineno"] = wasmExports["zend_ast_create_zval_with_lineno"])(a0, a1);

var _init_op_array = Module["_init_op_array"] = (a0, a1, a2) => (_init_op_array = Module["_init_op_array"] = wasmExports["init_op_array"])(a0, a1, a2);

var _pass_two = Module["_pass_two"] = a0 => (_pass_two = Module["_pass_two"] = wasmExports["pass_two"])(a0);

var _zend_get_configuration_directive = Module["_zend_get_configuration_directive"] = a0 => (_zend_get_configuration_directive = Module["_zend_get_configuration_directive"] = wasmExports["zend_get_configuration_directive"])(a0);

var _zend_get_constant = Module["_zend_get_constant"] = a0 => (_zend_get_constant = Module["_zend_get_constant"] = wasmExports["zend_get_constant"])(a0);

var _zend_mm_gc = Module["_zend_mm_gc"] = a0 => (_zend_mm_gc = Module["_zend_mm_gc"] = wasmExports["zend_mm_gc"])(a0);

var _zend_mm_shutdown = Module["_zend_mm_shutdown"] = (a0, a1, a2) => (_zend_mm_shutdown = Module["_zend_mm_shutdown"] = wasmExports["zend_mm_shutdown"])(a0, a1, a2);

var __zend_mm_alloc = Module["__zend_mm_alloc"] = (a0, a1) => (__zend_mm_alloc = Module["__zend_mm_alloc"] = wasmExports["_zend_mm_alloc"])(a0, a1);

var __zend_mm_free = Module["__zend_mm_free"] = (a0, a1) => (__zend_mm_free = Module["__zend_mm_free"] = wasmExports["_zend_mm_free"])(a0, a1);

var __zend_mm_realloc = Module["__zend_mm_realloc"] = (a0, a1, a2) => (__zend_mm_realloc = Module["__zend_mm_realloc"] = wasmExports["_zend_mm_realloc"])(a0, a1, a2);

var __zend_mm_realloc2 = Module["__zend_mm_realloc2"] = (a0, a1, a2, a3) => (__zend_mm_realloc2 = Module["__zend_mm_realloc2"] = wasmExports["_zend_mm_realloc2"])(a0, a1, a2, a3);

var __zend_mm_block_size = Module["__zend_mm_block_size"] = (a0, a1) => (__zend_mm_block_size = Module["__zend_mm_block_size"] = wasmExports["_zend_mm_block_size"])(a0, a1);

var _is_zend_ptr = Module["_is_zend_ptr"] = a0 => (_is_zend_ptr = Module["_is_zend_ptr"] = wasmExports["is_zend_ptr"])(a0);

var __efree_8 = Module["__efree_8"] = a0 => (__efree_8 = Module["__efree_8"] = wasmExports["_efree_8"])(a0);

var __efree_16 = Module["__efree_16"] = a0 => (__efree_16 = Module["__efree_16"] = wasmExports["_efree_16"])(a0);

var __efree_24 = Module["__efree_24"] = a0 => (__efree_24 = Module["__efree_24"] = wasmExports["_efree_24"])(a0);

var __efree_40 = Module["__efree_40"] = a0 => (__efree_40 = Module["__efree_40"] = wasmExports["_efree_40"])(a0);

var __efree_56 = Module["__efree_56"] = a0 => (__efree_56 = Module["__efree_56"] = wasmExports["_efree_56"])(a0);

var __efree_64 = Module["__efree_64"] = a0 => (__efree_64 = Module["__efree_64"] = wasmExports["_efree_64"])(a0);

var __efree_80 = Module["__efree_80"] = a0 => (__efree_80 = Module["__efree_80"] = wasmExports["_efree_80"])(a0);

var __efree_96 = Module["__efree_96"] = a0 => (__efree_96 = Module["__efree_96"] = wasmExports["_efree_96"])(a0);

var __efree_112 = Module["__efree_112"] = a0 => (__efree_112 = Module["__efree_112"] = wasmExports["_efree_112"])(a0);

var __efree_128 = Module["__efree_128"] = a0 => (__efree_128 = Module["__efree_128"] = wasmExports["_efree_128"])(a0);

var __efree_160 = Module["__efree_160"] = a0 => (__efree_160 = Module["__efree_160"] = wasmExports["_efree_160"])(a0);

var __efree_192 = Module["__efree_192"] = a0 => (__efree_192 = Module["__efree_192"] = wasmExports["_efree_192"])(a0);

var __efree_224 = Module["__efree_224"] = a0 => (__efree_224 = Module["__efree_224"] = wasmExports["_efree_224"])(a0);

var __efree_256 = Module["__efree_256"] = a0 => (__efree_256 = Module["__efree_256"] = wasmExports["_efree_256"])(a0);

var __efree_320 = Module["__efree_320"] = a0 => (__efree_320 = Module["__efree_320"] = wasmExports["_efree_320"])(a0);

var __efree_384 = Module["__efree_384"] = a0 => (__efree_384 = Module["__efree_384"] = wasmExports["_efree_384"])(a0);

var __efree_448 = Module["__efree_448"] = a0 => (__efree_448 = Module["__efree_448"] = wasmExports["_efree_448"])(a0);

var __efree_512 = Module["__efree_512"] = a0 => (__efree_512 = Module["__efree_512"] = wasmExports["_efree_512"])(a0);

var __efree_640 = Module["__efree_640"] = a0 => (__efree_640 = Module["__efree_640"] = wasmExports["_efree_640"])(a0);

var __efree_768 = Module["__efree_768"] = a0 => (__efree_768 = Module["__efree_768"] = wasmExports["_efree_768"])(a0);

var __efree_896 = Module["__efree_896"] = a0 => (__efree_896 = Module["__efree_896"] = wasmExports["_efree_896"])(a0);

var __efree_1024 = Module["__efree_1024"] = a0 => (__efree_1024 = Module["__efree_1024"] = wasmExports["_efree_1024"])(a0);

var __efree_1280 = Module["__efree_1280"] = a0 => (__efree_1280 = Module["__efree_1280"] = wasmExports["_efree_1280"])(a0);

var __efree_1536 = Module["__efree_1536"] = a0 => (__efree_1536 = Module["__efree_1536"] = wasmExports["_efree_1536"])(a0);

var __efree_1792 = Module["__efree_1792"] = a0 => (__efree_1792 = Module["__efree_1792"] = wasmExports["_efree_1792"])(a0);

var __efree_2048 = Module["__efree_2048"] = a0 => (__efree_2048 = Module["__efree_2048"] = wasmExports["_efree_2048"])(a0);

var __efree_2560 = Module["__efree_2560"] = a0 => (__efree_2560 = Module["__efree_2560"] = wasmExports["_efree_2560"])(a0);

var __efree_3072 = Module["__efree_3072"] = a0 => (__efree_3072 = Module["__efree_3072"] = wasmExports["_efree_3072"])(a0);

var __efree_huge = Module["__efree_huge"] = (a0, a1) => (__efree_huge = Module["__efree_huge"] = wasmExports["_efree_huge"])(a0, a1);

var __erealloc2 = Module["__erealloc2"] = (a0, a1, a2) => (__erealloc2 = Module["__erealloc2"] = wasmExports["_erealloc2"])(a0, a1, a2);

var __zend_mem_block_size = Module["__zend_mem_block_size"] = a0 => (__zend_mem_block_size = Module["__zend_mem_block_size"] = wasmExports["_zend_mem_block_size"])(a0);

var _start_memory_manager = Module["_start_memory_manager"] = () => (_start_memory_manager = Module["_start_memory_manager"] = wasmExports["start_memory_manager"])();

var _zend_mm_set_heap = Module["_zend_mm_set_heap"] = a0 => (_zend_mm_set_heap = Module["_zend_mm_set_heap"] = wasmExports["zend_mm_set_heap"])(a0);

var _zend_mm_get_heap = Module["_zend_mm_get_heap"] = () => (_zend_mm_get_heap = Module["_zend_mm_get_heap"] = wasmExports["zend_mm_get_heap"])();

var _zend_mm_is_custom_heap = Module["_zend_mm_is_custom_heap"] = a0 => (_zend_mm_is_custom_heap = Module["_zend_mm_is_custom_heap"] = wasmExports["zend_mm_is_custom_heap"])(a0);

var _zend_mm_set_custom_handlers = Module["_zend_mm_set_custom_handlers"] = (a0, a1, a2, a3) => (_zend_mm_set_custom_handlers = Module["_zend_mm_set_custom_handlers"] = wasmExports["zend_mm_set_custom_handlers"])(a0, a1, a2, a3);

var _zend_mm_get_custom_handlers = Module["_zend_mm_get_custom_handlers"] = (a0, a1, a2, a3) => (_zend_mm_get_custom_handlers = Module["_zend_mm_get_custom_handlers"] = wasmExports["zend_mm_get_custom_handlers"])(a0, a1, a2, a3);

var _zend_mm_get_storage = Module["_zend_mm_get_storage"] = a0 => (_zend_mm_get_storage = Module["_zend_mm_get_storage"] = wasmExports["zend_mm_get_storage"])(a0);

var _zend_mm_startup = Module["_zend_mm_startup"] = () => (_zend_mm_startup = Module["_zend_mm_startup"] = wasmExports["zend_mm_startup"])();

var _zend_mm_startup_ex = Module["_zend_mm_startup_ex"] = (a0, a1, a2) => (_zend_mm_startup_ex = Module["_zend_mm_startup_ex"] = wasmExports["zend_mm_startup_ex"])(a0, a1, a2);

var _madvise = Module["_madvise"] = (a0, a1, a2) => (_madvise = Module["_madvise"] = wasmExports["madvise"])(a0, a1, a2);

var _zend_call_stack_init = Module["_zend_call_stack_init"] = () => (_zend_call_stack_init = Module["_zend_call_stack_init"] = wasmExports["zend_call_stack_init"])();

var _zend_call_stack_get = Module["_zend_call_stack_get"] = a0 => (_zend_call_stack_get = Module["_zend_call_stack_get"] = wasmExports["zend_call_stack_get"])(a0);

var _zend_init_rsrc_list = Module["_zend_init_rsrc_list"] = () => (_zend_init_rsrc_list = Module["_zend_init_rsrc_list"] = wasmExports["zend_init_rsrc_list"])();

var _zend_create_member_string = Module["_zend_create_member_string"] = (a0, a1) => (_zend_create_member_string = Module["_zend_create_member_string"] = wasmExports["zend_create_member_string"])(a0, a1);

var _function_add_ref = Module["_function_add_ref"] = a0 => (_function_add_ref = Module["_function_add_ref"] = wasmExports["function_add_ref"])(a0);

var _do_bind_function = Module["_do_bind_function"] = (a0, a1) => (_do_bind_function = Module["_do_bind_function"] = wasmExports["do_bind_function"])(a0, a1);

var _zend_bind_class_in_slot = Module["_zend_bind_class_in_slot"] = (a0, a1, a2) => (_zend_bind_class_in_slot = Module["_zend_bind_class_in_slot"] = wasmExports["zend_bind_class_in_slot"])(a0, a1, a2);

var _zend_hash_set_bucket_key = Module["_zend_hash_set_bucket_key"] = (a0, a1, a2) => (_zend_hash_set_bucket_key = Module["_zend_hash_set_bucket_key"] = wasmExports["zend_hash_set_bucket_key"])(a0, a1, a2);

var _zend_do_link_class = Module["_zend_do_link_class"] = (a0, a1, a2) => (_zend_do_link_class = Module["_zend_do_link_class"] = wasmExports["zend_do_link_class"])(a0, a1, a2);

var _do_bind_class = Module["_do_bind_class"] = (a0, a1) => (_do_bind_class = Module["_do_bind_class"] = wasmExports["do_bind_class"])(a0, a1);

var _zend_is_auto_global_str = Module["_zend_is_auto_global_str"] = (a0, a1) => (_zend_is_auto_global_str = Module["_zend_is_auto_global_str"] = wasmExports["zend_is_auto_global_str"])(a0, a1);

var _zend_initialize_class_data = Module["_zend_initialize_class_data"] = (a0, a1) => (_zend_initialize_class_data = Module["_zend_initialize_class_data"] = wasmExports["zend_initialize_class_data"])(a0, a1);

var _zend_function_dtor = Module["_zend_function_dtor"] = a0 => (_zend_function_dtor = Module["_zend_function_dtor"] = wasmExports["zend_function_dtor"])(a0);

var _zend_get_compiled_variable_name = Module["_zend_get_compiled_variable_name"] = (a0, a1) => (_zend_get_compiled_variable_name = Module["_zend_get_compiled_variable_name"] = wasmExports["zend_get_compiled_variable_name"])(a0, a1);

var _zend_is_smart_branch = Module["_zend_is_smart_branch"] = a0 => (_zend_is_smart_branch = Module["_zend_is_smart_branch"] = wasmExports["zend_is_smart_branch"])(a0);

var _zend_get_call_op = Module["_zend_get_call_op"] = (a0, a1) => (_zend_get_call_op = Module["_zend_get_call_op"] = wasmExports["zend_get_call_op"])(a0, a1);

var _execute_ex = Module["_execute_ex"] = a0 => (_execute_ex = Module["_execute_ex"] = wasmExports["execute_ex"])(a0);

var _zend_vm_set_opcode_handler = Module["_zend_vm_set_opcode_handler"] = a0 => (_zend_vm_set_opcode_handler = Module["_zend_vm_set_opcode_handler"] = wasmExports["zend_vm_set_opcode_handler"])(a0);

var _zend_multibyte_fetch_encoding = Module["_zend_multibyte_fetch_encoding"] = a0 => (_zend_multibyte_fetch_encoding = Module["_zend_multibyte_fetch_encoding"] = wasmExports["zend_multibyte_fetch_encoding"])(a0);

var _zend_is_op_long_compatible = Module["_zend_is_op_long_compatible"] = a0 => (_zend_is_op_long_compatible = Module["_zend_is_op_long_compatible"] = wasmExports["zend_is_op_long_compatible"])(a0);

var _zend_binary_op_produces_error = Module["_zend_binary_op_produces_error"] = (a0, a1, a2) => (_zend_binary_op_produces_error = Module["_zend_binary_op_produces_error"] = wasmExports["zend_binary_op_produces_error"])(a0, a1, a2);

var _zend_unary_op_produces_error = Module["_zend_unary_op_produces_error"] = (a0, a1) => (_zend_unary_op_produces_error = Module["_zend_unary_op_produces_error"] = wasmExports["zend_unary_op_produces_error"])(a0, a1);

var _zend_ast_copy = Module["_zend_ast_copy"] = a0 => (_zend_ast_copy = Module["_zend_ast_copy"] = wasmExports["zend_ast_copy"])(a0);

var _zend_hash_str_find_ptr_lc = Module["_zend_hash_str_find_ptr_lc"] = (a0, a1, a2) => (_zend_hash_str_find_ptr_lc = Module["_zend_hash_str_find_ptr_lc"] = wasmExports["zend_hash_str_find_ptr_lc"])(a0, a1, a2);

var _zend_hash_find_ptr_lc = Module["_zend_hash_find_ptr_lc"] = (a0, a1) => (_zend_hash_find_ptr_lc = Module["_zend_hash_find_ptr_lc"] = wasmExports["zend_hash_find_ptr_lc"])(a0, a1);

var __zend_observer_function_declared_notify = Module["__zend_observer_function_declared_notify"] = (a0, a1) => (__zend_observer_function_declared_notify = Module["__zend_observer_function_declared_notify"] = wasmExports["_zend_observer_function_declared_notify"])(a0, a1);

var _zend_get_object_type_case = Module["_zend_get_object_type_case"] = (a0, a1) => (_zend_get_object_type_case = Module["_zend_get_object_type_case"] = wasmExports["zend_get_object_type_case"])(a0, a1);

var __zend_observer_class_linked_notify = Module["__zend_observer_class_linked_notify"] = (a0, a1) => (__zend_observer_class_linked_notify = Module["__zend_observer_class_linked_notify"] = wasmExports["_zend_observer_class_linked_notify"])(a0, a1);

var _zend_ast_apply = Module["_zend_ast_apply"] = (a0, a1, a2) => (_zend_ast_apply = Module["_zend_ast_apply"] = wasmExports["zend_ast_apply"])(a0, a1, a2);

var _zend_ast_create_constant = Module["_zend_ast_create_constant"] = (a0, a1) => (_zend_ast_create_constant = Module["_zend_ast_create_constant"] = wasmExports["zend_ast_create_constant"])(a0, a1);

var __zend_get_special_const = Module["__zend_get_special_const"] = (a0, a1) => (__zend_get_special_const = Module["__zend_get_special_const"] = wasmExports["_zend_get_special_const"])(a0, a1);

var _zend_check_magic_method_implementation = Module["_zend_check_magic_method_implementation"] = (a0, a1, a2, a3) => (_zend_check_magic_method_implementation = Module["_zend_check_magic_method_implementation"] = wasmExports["zend_check_magic_method_implementation"])(a0, a1, a2, a3);

var _zend_add_magic_method = Module["_zend_add_magic_method"] = (a0, a1, a2) => (_zend_add_magic_method = Module["_zend_add_magic_method"] = wasmExports["zend_add_magic_method"])(a0, a1, a2);

var _zend_internal_attribute_get = Module["_zend_internal_attribute_get"] = a0 => (_zend_internal_attribute_get = Module["_zend_internal_attribute_get"] = wasmExports["zend_internal_attribute_get"])(a0);

var _zend_get_type_by_const = Module["_zend_get_type_by_const"] = a0 => (_zend_get_type_by_const = Module["_zend_get_type_by_const"] = wasmExports["zend_get_type_by_const"])(a0);

var _zend_alloc_ce_cache = Module["_zend_alloc_ce_cache"] = a0 => (_zend_alloc_ce_cache = Module["_zend_alloc_ce_cache"] = wasmExports["zend_alloc_ce_cache"])(a0);

var _zend_map_ptr_new = Module["_zend_map_ptr_new"] = () => (_zend_map_ptr_new = Module["_zend_map_ptr_new"] = wasmExports["zend_map_ptr_new"])();

var _zend_try_early_bind = Module["_zend_try_early_bind"] = (a0, a1, a2, a3) => (_zend_try_early_bind = Module["_zend_try_early_bind"] = wasmExports["zend_try_early_bind"])(a0, a1, a2, a3);

var _zend_type_release = Module["_zend_type_release"] = (a0, a1) => (_zend_type_release = Module["_zend_type_release"] = wasmExports["zend_type_release"])(a0, a1);

var _zend_ast_create_znode = Module["_zend_ast_create_znode"] = a0 => (_zend_ast_create_znode = Module["_zend_ast_create_znode"] = wasmExports["zend_ast_create_znode"])(a0);

var _zend_check_protected = Module["_zend_check_protected"] = (a0, a1) => (_zend_check_protected = Module["_zend_check_protected"] = wasmExports["zend_check_protected"])(a0, a1);

var _get_binary_op = Module["_get_binary_op"] = a0 => (_get_binary_op = Module["_get_binary_op"] = wasmExports["get_binary_op"])(a0);

var _is_smaller_function = Module["_is_smaller_function"] = (a0, a1, a2) => (_is_smaller_function = Module["_is_smaller_function"] = wasmExports["is_smaller_function"])(a0, a1, a2);

var _is_smaller_or_equal_function = Module["_is_smaller_or_equal_function"] = (a0, a1, a2) => (_is_smaller_or_equal_function = Module["_is_smaller_or_equal_function"] = wasmExports["is_smaller_or_equal_function"])(a0, a1, a2);

var _get_unary_op = Module["_get_unary_op"] = a0 => (_get_unary_op = Module["_get_unary_op"] = wasmExports["get_unary_op"])(a0);

var _concat_function = Module["_concat_function"] = (a0, a1, a2) => (_concat_function = Module["_concat_function"] = wasmExports["concat_function"])(a0, a1, a2);

var _zval_internal_ptr_dtor = Module["_zval_internal_ptr_dtor"] = a0 => (_zval_internal_ptr_dtor = Module["_zval_internal_ptr_dtor"] = wasmExports["zval_internal_ptr_dtor"])(a0);

var _zend_register_null_constant = Module["_zend_register_null_constant"] = (a0, a1, a2, a3) => (_zend_register_null_constant = Module["_zend_register_null_constant"] = wasmExports["zend_register_null_constant"])(a0, a1, a2, a3);

var _zend_register_constant = Module["_zend_register_constant"] = a0 => (_zend_register_constant = Module["_zend_register_constant"] = wasmExports["zend_register_constant"])(a0);

var _zend_verify_const_access = Module["_zend_verify_const_access"] = (a0, a1) => (_zend_verify_const_access = Module["_zend_verify_const_access"] = wasmExports["zend_verify_const_access"])(a0, a1);

var _zend_get_class_constant_ex = Module["_zend_get_class_constant_ex"] = (a0, a1, a2, a3) => (_zend_get_class_constant_ex = Module["_zend_get_class_constant_ex"] = wasmExports["zend_get_class_constant_ex"])(a0, a1, a2, a3);

var _zend_init_fpu = Module["_zend_init_fpu"] = () => (_zend_init_fpu = Module["_zend_init_fpu"] = wasmExports["zend_init_fpu"])();

var _zend_vm_stack_init = Module["_zend_vm_stack_init"] = () => (_zend_vm_stack_init = Module["_zend_vm_stack_init"] = wasmExports["zend_vm_stack_init"])();

var _zend_objects_store_init = Module["_zend_objects_store_init"] = (a0, a1) => (_zend_objects_store_init = Module["_zend_objects_store_init"] = wasmExports["zend_objects_store_init"])(a0, a1);

var _zend_hash_reverse_apply = Module["_zend_hash_reverse_apply"] = (a0, a1) => (_zend_hash_reverse_apply = Module["_zend_hash_reverse_apply"] = wasmExports["zend_hash_reverse_apply"])(a0, a1);

var _zend_objects_store_call_destructors = Module["_zend_objects_store_call_destructors"] = a0 => (_zend_objects_store_call_destructors = Module["_zend_objects_store_call_destructors"] = wasmExports["zend_objects_store_call_destructors"])(a0);

var _zend_shutdown_executor_values = Module["_zend_shutdown_executor_values"] = a0 => (_zend_shutdown_executor_values = Module["_zend_shutdown_executor_values"] = wasmExports["zend_shutdown_executor_values"])(a0);

var _zend_hash_graceful_reverse_destroy = Module["_zend_hash_graceful_reverse_destroy"] = a0 => (_zend_hash_graceful_reverse_destroy = Module["_zend_hash_graceful_reverse_destroy"] = wasmExports["zend_hash_graceful_reverse_destroy"])(a0);

var _zend_cleanup_internal_class_data = Module["_zend_cleanup_internal_class_data"] = a0 => (_zend_cleanup_internal_class_data = Module["_zend_cleanup_internal_class_data"] = wasmExports["zend_cleanup_internal_class_data"])(a0);

var _zend_cleanup_mutable_class_data = Module["_zend_cleanup_mutable_class_data"] = a0 => (_zend_cleanup_mutable_class_data = Module["_zend_cleanup_mutable_class_data"] = wasmExports["zend_cleanup_mutable_class_data"])(a0);

var _zend_stack_clean = Module["_zend_stack_clean"] = (a0, a1, a2) => (_zend_stack_clean = Module["_zend_stack_clean"] = wasmExports["zend_stack_clean"])(a0, a1, a2);

var _zend_hash_discard = Module["_zend_hash_discard"] = (a0, a1) => (_zend_hash_discard = Module["_zend_hash_discard"] = wasmExports["zend_hash_discard"])(a0, a1);

var _zend_objects_store_free_object_storage = Module["_zend_objects_store_free_object_storage"] = (a0, a1) => (_zend_objects_store_free_object_storage = Module["_zend_objects_store_free_object_storage"] = wasmExports["zend_objects_store_free_object_storage"])(a0, a1);

var _zend_vm_stack_destroy = Module["_zend_vm_stack_destroy"] = () => (_zend_vm_stack_destroy = Module["_zend_vm_stack_destroy"] = wasmExports["zend_vm_stack_destroy"])();

var _destroy_zend_class = Module["_destroy_zend_class"] = a0 => (_destroy_zend_class = Module["_destroy_zend_class"] = wasmExports["destroy_zend_class"])(a0);

var _zend_objects_store_destroy = Module["_zend_objects_store_destroy"] = a0 => (_zend_objects_store_destroy = Module["_zend_objects_store_destroy"] = wasmExports["zend_objects_store_destroy"])(a0);

var _zend_shutdown_fpu = Module["_zend_shutdown_fpu"] = () => (_zend_shutdown_fpu = Module["_zend_shutdown_fpu"] = wasmExports["zend_shutdown_fpu"])();

var _get_function_or_method_name = Module["_get_function_or_method_name"] = a0 => (_get_function_or_method_name = Module["_get_function_or_method_name"] = wasmExports["get_function_or_method_name"])(a0);

var _get_function_arg_name = Module["_get_function_arg_name"] = (a0, a1) => (_get_function_arg_name = Module["_get_function_arg_name"] = wasmExports["get_function_arg_name"])(a0, a1);

var _zval_update_constant_with_ctx = Module["_zval_update_constant_with_ctx"] = (a0, a1, a2) => (_zval_update_constant_with_ctx = Module["_zval_update_constant_with_ctx"] = wasmExports["zval_update_constant_with_ctx"])(a0, a1, a2);

var _zend_ast_evaluate_ex = Module["_zend_ast_evaluate_ex"] = (a0, a1, a2, a3, a4) => (_zend_ast_evaluate_ex = Module["_zend_ast_evaluate_ex"] = wasmExports["zend_ast_evaluate_ex"])(a0, a1, a2, a3, a4);

var _zval_update_constant = Module["_zval_update_constant"] = a0 => (_zval_update_constant = Module["_zval_update_constant"] = wasmExports["zval_update_constant"])(a0);

var _zend_get_callable_name_ex = Module["_zend_get_callable_name_ex"] = (a0, a1) => (_zend_get_callable_name_ex = Module["_zend_get_callable_name_ex"] = wasmExports["zend_get_callable_name_ex"])(a0, a1);

var _zend_deprecated_function = Module["_zend_deprecated_function"] = a0 => (_zend_deprecated_function = Module["_zend_deprecated_function"] = wasmExports["zend_deprecated_function"])(a0);

var _zend_handle_undef_args = Module["_zend_handle_undef_args"] = a0 => (_zend_handle_undef_args = Module["_zend_handle_undef_args"] = wasmExports["zend_handle_undef_args"])(a0);

var _zend_init_func_execute_data = Module["_zend_init_func_execute_data"] = (a0, a1, a2) => (_zend_init_func_execute_data = Module["_zend_init_func_execute_data"] = wasmExports["zend_init_func_execute_data"])(a0, a1, a2);

var _zend_observer_fcall_begin = Module["_zend_observer_fcall_begin"] = a0 => (_zend_observer_fcall_begin = Module["_zend_observer_fcall_begin"] = wasmExports["zend_observer_fcall_begin"])(a0);

var _zend_observer_fcall_end = Module["_zend_observer_fcall_end"] = (a0, a1) => (_zend_observer_fcall_end = Module["_zend_observer_fcall_end"] = wasmExports["zend_observer_fcall_end"])(a0, a1);

var _zend_timeout = Module["_zend_timeout"] = () => (_zend_timeout = Module["_zend_timeout"] = wasmExports["zend_timeout"])();

var _zend_hash_index_add_empty_element = Module["_zend_hash_index_add_empty_element"] = (a0, a1) => (_zend_hash_index_add_empty_element = Module["_zend_hash_index_add_empty_element"] = wasmExports["zend_hash_index_add_empty_element"])(a0, a1);

var _zend_eval_stringl = Module["_zend_eval_stringl"] = (a0, a1, a2, a3) => (_zend_eval_stringl = Module["_zend_eval_stringl"] = wasmExports["zend_eval_stringl"])(a0, a1, a2, a3);

var _zend_destroy_static_vars = Module["_zend_destroy_static_vars"] = a0 => (_zend_destroy_static_vars = Module["_zend_destroy_static_vars"] = wasmExports["zend_destroy_static_vars"])(a0);

var _zend_eval_stringl_ex = Module["_zend_eval_stringl_ex"] = (a0, a1, a2, a3, a4) => (_zend_eval_stringl_ex = Module["_zend_eval_stringl_ex"] = wasmExports["zend_eval_stringl_ex"])(a0, a1, a2, a3, a4);

var _zend_eval_string_ex = Module["_zend_eval_string_ex"] = (a0, a1, a2, a3) => (_zend_eval_string_ex = Module["_zend_eval_string_ex"] = wasmExports["zend_eval_string_ex"])(a0, a1, a2, a3);

var _setitimer = Module["_setitimer"] = (a0, a1, a2) => (_setitimer = Module["_setitimer"] = wasmExports["setitimer"])(a0, a1, a2);

var _zend_fetch_class_with_scope = Module["_zend_fetch_class_with_scope"] = (a0, a1, a2) => (_zend_fetch_class_with_scope = Module["_zend_fetch_class_with_scope"] = wasmExports["zend_fetch_class_with_scope"])(a0, a1, a2);

var _zend_hash_del_ind = Module["_zend_hash_del_ind"] = (a0, a1) => (_zend_hash_del_ind = Module["_zend_hash_del_ind"] = wasmExports["zend_hash_del_ind"])(a0, a1);

var _zend_attach_symbol_table = Module["_zend_attach_symbol_table"] = a0 => (_zend_attach_symbol_table = Module["_zend_attach_symbol_table"] = wasmExports["zend_attach_symbol_table"])(a0);

var _zend_detach_symbol_table = Module["_zend_detach_symbol_table"] = a0 => (_zend_detach_symbol_table = Module["_zend_detach_symbol_table"] = wasmExports["zend_detach_symbol_table"])(a0);

var _zend_set_local_var = Module["_zend_set_local_var"] = (a0, a1, a2) => (_zend_set_local_var = Module["_zend_set_local_var"] = wasmExports["zend_set_local_var"])(a0, a1, a2);

var _zend_hash_func = Module["_zend_hash_func"] = (a0, a1) => (_zend_hash_func = Module["_zend_hash_func"] = wasmExports["zend_hash_func"])(a0, a1);

var _zend_signal = Module["_zend_signal"] = (a0, a1) => (_zend_signal = Module["_zend_signal"] = wasmExports["zend_signal"])(a0, a1);

var __exit = Module["__exit"] = a0 => (__exit = Module["__exit"] = wasmExports["_exit"])(a0);

var _zend_html_putc = Module["_zend_html_putc"] = a0 => (_zend_html_putc = Module["_zend_html_putc"] = wasmExports["zend_html_putc"])(a0);

var _zend_llist_prepend_element = Module["_zend_llist_prepend_element"] = (a0, a1) => (_zend_llist_prepend_element = Module["_zend_llist_prepend_element"] = wasmExports["zend_llist_prepend_element"])(a0, a1);

var _zend_llist_remove_tail = Module["_zend_llist_remove_tail"] = a0 => (_zend_llist_remove_tail = Module["_zend_llist_remove_tail"] = wasmExports["zend_llist_remove_tail"])(a0);

var _zend_llist_copy = Module["_zend_llist_copy"] = (a0, a1) => (_zend_llist_copy = Module["_zend_llist_copy"] = wasmExports["zend_llist_copy"])(a0, a1);

var _zend_llist_apply_with_del = Module["_zend_llist_apply_with_del"] = (a0, a1) => (_zend_llist_apply_with_del = Module["_zend_llist_apply_with_del"] = wasmExports["zend_llist_apply_with_del"])(a0, a1);

var _zend_llist_sort = Module["_zend_llist_sort"] = (a0, a1) => (_zend_llist_sort = Module["_zend_llist_sort"] = wasmExports["zend_llist_sort"])(a0, a1);

var _zend_llist_apply_with_arguments = Module["_zend_llist_apply_with_arguments"] = (a0, a1, a2, a3) => (_zend_llist_apply_with_arguments = Module["_zend_llist_apply_with_arguments"] = wasmExports["zend_llist_apply_with_arguments"])(a0, a1, a2, a3);

var _zend_llist_get_last_ex = Module["_zend_llist_get_last_ex"] = (a0, a1) => (_zend_llist_get_last_ex = Module["_zend_llist_get_last_ex"] = wasmExports["zend_llist_get_last_ex"])(a0, a1);

var _zend_llist_get_prev_ex = Module["_zend_llist_get_prev_ex"] = (a0, a1) => (_zend_llist_get_prev_ex = Module["_zend_llist_get_prev_ex"] = wasmExports["zend_llist_get_prev_ex"])(a0, a1);

var _zend_get_opcode_name = Module["_zend_get_opcode_name"] = a0 => (_zend_get_opcode_name = Module["_zend_get_opcode_name"] = wasmExports["zend_get_opcode_name"])(a0);

var _zend_get_opcode_flags = Module["_zend_get_opcode_flags"] = a0 => (_zend_get_opcode_flags = Module["_zend_get_opcode_flags"] = wasmExports["zend_get_opcode_flags"])(a0);

var _zend_get_opcode_id = Module["_zend_get_opcode_id"] = (a0, a1) => (_zend_get_opcode_id = Module["_zend_get_opcode_id"] = wasmExports["zend_get_opcode_id"])(a0, a1);

var _destroy_zend_function = Module["_destroy_zend_function"] = a0 => (_destroy_zend_function = Module["_destroy_zend_function"] = wasmExports["destroy_zend_function"])(a0);

var _zend_recalc_live_ranges = Module["_zend_recalc_live_ranges"] = (a0, a1) => (_zend_recalc_live_ranges = Module["_zend_recalc_live_ranges"] = wasmExports["zend_recalc_live_ranges"])(a0, a1);

var _bitwise_not_function = Module["_bitwise_not_function"] = (a0, a1) => (_bitwise_not_function = Module["_bitwise_not_function"] = wasmExports["bitwise_not_function"])(a0, a1);

var _boolean_not_function = Module["_boolean_not_function"] = (a0, a1) => (_boolean_not_function = Module["_boolean_not_function"] = wasmExports["boolean_not_function"])(a0, a1);

var _sub_function = Module["_sub_function"] = (a0, a1, a2) => (_sub_function = Module["_sub_function"] = wasmExports["sub_function"])(a0, a1, a2);

var _div_function = Module["_div_function"] = (a0, a1, a2) => (_div_function = Module["_div_function"] = wasmExports["div_function"])(a0, a1, a2);

var _mod_function = Module["_mod_function"] = (a0, a1, a2) => (_mod_function = Module["_mod_function"] = wasmExports["mod_function"])(a0, a1, a2);

var _shift_left_function = Module["_shift_left_function"] = (a0, a1, a2) => (_shift_left_function = Module["_shift_left_function"] = wasmExports["shift_left_function"])(a0, a1, a2);

var _shift_right_function = Module["_shift_right_function"] = (a0, a1, a2) => (_shift_right_function = Module["_shift_right_function"] = wasmExports["shift_right_function"])(a0, a1, a2);

var _is_identical_function = Module["_is_identical_function"] = (a0, a1, a2) => (_is_identical_function = Module["_is_identical_function"] = wasmExports["is_identical_function"])(a0, a1, a2);

var _is_not_identical_function = Module["_is_not_identical_function"] = (a0, a1, a2) => (_is_not_identical_function = Module["_is_not_identical_function"] = wasmExports["is_not_identical_function"])(a0, a1, a2);

var _is_equal_function = Module["_is_equal_function"] = (a0, a1, a2) => (_is_equal_function = Module["_is_equal_function"] = wasmExports["is_equal_function"])(a0, a1, a2);

var _is_not_equal_function = Module["_is_not_equal_function"] = (a0, a1, a2) => (_is_not_equal_function = Module["_is_not_equal_function"] = wasmExports["is_not_equal_function"])(a0, a1, a2);

var _compare_function = Module["_compare_function"] = (a0, a1, a2) => (_compare_function = Module["_compare_function"] = wasmExports["compare_function"])(a0, a1, a2);

var _bitwise_or_function = Module["_bitwise_or_function"] = (a0, a1, a2) => (_bitwise_or_function = Module["_bitwise_or_function"] = wasmExports["bitwise_or_function"])(a0, a1, a2);

var _bitwise_and_function = Module["_bitwise_and_function"] = (a0, a1, a2) => (_bitwise_and_function = Module["_bitwise_and_function"] = wasmExports["bitwise_and_function"])(a0, a1, a2);

var _bitwise_xor_function = Module["_bitwise_xor_function"] = (a0, a1, a2) => (_bitwise_xor_function = Module["_bitwise_xor_function"] = wasmExports["bitwise_xor_function"])(a0, a1, a2);

var _boolean_xor_function = Module["_boolean_xor_function"] = (a0, a1, a2) => (_boolean_xor_function = Module["_boolean_xor_function"] = wasmExports["boolean_xor_function"])(a0, a1, a2);

var _zend_atol = Module["_zend_atol"] = (a0, a1) => (_zend_atol = Module["_zend_atol"] = wasmExports["zend_atol"])(a0, a1);

var _zend_atoi = Module["_zend_atoi"] = (a0, a1) => (_zend_atoi = Module["_zend_atoi"] = wasmExports["zend_atoi"])(a0, a1);

var _convert_scalar_to_number = Module["_convert_scalar_to_number"] = a0 => (_convert_scalar_to_number = Module["_convert_scalar_to_number"] = wasmExports["convert_scalar_to_number"])(a0);

var _zval_try_get_long = Module["_zval_try_get_long"] = (a0, a1) => (_zval_try_get_long = Module["_zval_try_get_long"] = wasmExports["zval_try_get_long"])(a0, a1);

var _zend_std_build_object_properties_array = Module["_zend_std_build_object_properties_array"] = a0 => (_zend_std_build_object_properties_array = Module["_zend_std_build_object_properties_array"] = wasmExports["zend_std_build_object_properties_array"])(a0);

var _zend_symtable_to_proptable = Module["_zend_symtable_to_proptable"] = a0 => (_zend_symtable_to_proptable = Module["_zend_symtable_to_proptable"] = wasmExports["zend_symtable_to_proptable"])(a0);

var _zend_error_unchecked = Module["_zend_error_unchecked"] = (a0, a1, a2) => (_zend_error_unchecked = Module["_zend_error_unchecked"] = wasmExports["zend_error_unchecked"])(a0, a1, a2);

var _zend_incompatible_string_to_long_error = Module["_zend_incompatible_string_to_long_error"] = a0 => (_zend_incompatible_string_to_long_error = Module["_zend_incompatible_string_to_long_error"] = wasmExports["zend_incompatible_string_to_long_error"])(a0);

var _string_compare_function_ex = Module["_string_compare_function_ex"] = (a0, a1, a2) => (_string_compare_function_ex = Module["_string_compare_function_ex"] = wasmExports["string_compare_function_ex"])(a0, a1, a2);

var _zend_class_implements_interface = Module["_zend_class_implements_interface"] = (a0, a1) => (_zend_class_implements_interface = Module["_zend_class_implements_interface"] = wasmExports["zend_class_implements_interface"])(a0, a1);

var _increment_function = Module["_increment_function"] = a0 => (_increment_function = Module["_increment_function"] = wasmExports["increment_function"])(a0);

var _decrement_function = Module["_decrement_function"] = a0 => (_decrement_function = Module["_decrement_function"] = wasmExports["decrement_function"])(a0);

var ___ctype_get_mb_cur_max = Module["___ctype_get_mb_cur_max"] = () => (___ctype_get_mb_cur_max = Module["___ctype_get_mb_cur_max"] = wasmExports["__ctype_get_mb_cur_max"])();

var _zend_str_toupper_copy = Module["_zend_str_toupper_copy"] = (a0, a1, a2) => (_zend_str_toupper_copy = Module["_zend_str_toupper_copy"] = wasmExports["zend_str_toupper_copy"])(a0, a1, a2);

var _zend_str_toupper_dup = Module["_zend_str_toupper_dup"] = (a0, a1) => (_zend_str_toupper_dup = Module["_zend_str_toupper_dup"] = wasmExports["zend_str_toupper_dup"])(a0, a1);

var _zend_str_toupper_dup_ex = Module["_zend_str_toupper_dup_ex"] = (a0, a1) => (_zend_str_toupper_dup_ex = Module["_zend_str_toupper_dup_ex"] = wasmExports["zend_str_toupper_dup_ex"])(a0, a1);

var _zend_binary_zval_strncmp = Module["_zend_binary_zval_strncmp"] = (a0, a1, a2) => (_zend_binary_zval_strncmp = Module["_zend_binary_zval_strncmp"] = wasmExports["zend_binary_zval_strncmp"])(a0, a1, a2);

var _zend_u64_to_str = Module["_zend_u64_to_str"] = (a0, a1) => (_zend_u64_to_str = Module["_zend_u64_to_str"] = wasmExports["zend_u64_to_str"])(a0, a1);

var _zend_i64_to_str = Module["_zend_i64_to_str"] = (a0, a1) => (_zend_i64_to_str = Module["_zend_i64_to_str"] = wasmExports["zend_i64_to_str"])(a0, a1);

var _zend_ptr_stack_init_ex = Module["_zend_ptr_stack_init_ex"] = (a0, a1) => (_zend_ptr_stack_init_ex = Module["_zend_ptr_stack_init_ex"] = wasmExports["zend_ptr_stack_init_ex"])(a0, a1);

var _zend_ptr_stack_n_push = Module["_zend_ptr_stack_n_push"] = (a0, a1, a2) => (_zend_ptr_stack_n_push = Module["_zend_ptr_stack_n_push"] = wasmExports["zend_ptr_stack_n_push"])(a0, a1, a2);

var _zend_ptr_stack_n_pop = Module["_zend_ptr_stack_n_pop"] = (a0, a1, a2) => (_zend_ptr_stack_n_pop = Module["_zend_ptr_stack_n_pop"] = wasmExports["zend_ptr_stack_n_pop"])(a0, a1, a2);

var _zend_ptr_stack_apply = Module["_zend_ptr_stack_apply"] = (a0, a1) => (_zend_ptr_stack_apply = Module["_zend_ptr_stack_apply"] = wasmExports["zend_ptr_stack_apply"])(a0, a1);

var _zend_ptr_stack_num_elements = Module["_zend_ptr_stack_num_elements"] = a0 => (_zend_ptr_stack_num_elements = Module["_zend_ptr_stack_num_elements"] = wasmExports["zend_ptr_stack_num_elements"])(a0);

var _zend_stack_int_top = Module["_zend_stack_int_top"] = a0 => (_zend_stack_int_top = Module["_zend_stack_int_top"] = wasmExports["zend_stack_int_top"])(a0);

var _zend_stack_apply = Module["_zend_stack_apply"] = (a0, a1, a2) => (_zend_stack_apply = Module["_zend_stack_apply"] = wasmExports["zend_stack_apply"])(a0, a1, a2);

var _zend_list_free = Module["_zend_list_free"] = a0 => (_zend_list_free = Module["_zend_list_free"] = wasmExports["zend_list_free"])(a0);

var _zend_ast_ref_destroy = Module["_zend_ast_ref_destroy"] = a0 => (_zend_ast_ref_destroy = Module["_zend_ast_ref_destroy"] = wasmExports["zend_ast_ref_destroy"])(a0);

var _zend_spprintf_unchecked = Module["_zend_spprintf_unchecked"] = (a0, a1, a2, a3) => (_zend_spprintf_unchecked = Module["_zend_spprintf_unchecked"] = wasmExports["zend_spprintf_unchecked"])(a0, a1, a2, a3);

var _zend_strpprintf_unchecked = Module["_zend_strpprintf_unchecked"] = (a0, a1, a2) => (_zend_strpprintf_unchecked = Module["_zend_strpprintf_unchecked"] = wasmExports["zend_strpprintf_unchecked"])(a0, a1, a2);

var _zend_make_printable_zval = Module["_zend_make_printable_zval"] = (a0, a1) => (_zend_make_printable_zval = Module["_zend_make_printable_zval"] = wasmExports["zend_make_printable_zval"])(a0, a1);

var _zend_print_zval = Module["_zend_print_zval"] = (a0, a1) => (_zend_print_zval = Module["_zend_print_zval"] = wasmExports["zend_print_zval"])(a0, a1);

var _zend_print_flat_zval_r = Module["_zend_print_flat_zval_r"] = a0 => (_zend_print_flat_zval_r = Module["_zend_print_flat_zval_r"] = wasmExports["zend_print_flat_zval_r"])(a0);

var _virtual_cwd_startup = Module["_virtual_cwd_startup"] = () => (_virtual_cwd_startup = Module["_virtual_cwd_startup"] = wasmExports["virtual_cwd_startup"])();

var _zend_startup_strtod = Module["_zend_startup_strtod"] = () => (_zend_startup_strtod = Module["_zend_startup_strtod"] = wasmExports["zend_startup_strtod"])();

var _zend_gc_collect_cycles = Module["_zend_gc_collect_cycles"] = () => (_zend_gc_collect_cycles = Module["_zend_gc_collect_cycles"] = wasmExports["zend_gc_collect_cycles"])();

var _zend_interned_strings_init = Module["_zend_interned_strings_init"] = () => (_zend_interned_strings_init = Module["_zend_interned_strings_init"] = wasmExports["zend_interned_strings_init"])();

var _zend_ini_startup = Module["_zend_ini_startup"] = () => (_zend_ini_startup = Module["_zend_ini_startup"] = wasmExports["zend_ini_startup"])();

var _zend_destroy_modules = Module["_zend_destroy_modules"] = () => (_zend_destroy_modules = Module["_zend_destroy_modules"] = wasmExports["zend_destroy_modules"])();

var _virtual_cwd_shutdown = Module["_virtual_cwd_shutdown"] = () => (_virtual_cwd_shutdown = Module["_virtual_cwd_shutdown"] = wasmExports["virtual_cwd_shutdown"])();

var _zend_shutdown_strtod = Module["_zend_shutdown_strtod"] = () => (_zend_shutdown_strtod = Module["_zend_shutdown_strtod"] = wasmExports["zend_shutdown_strtod"])();

var _zend_output_debug_string = Module["_zend_output_debug_string"] = (a0, a1, a2) => (_zend_output_debug_string = Module["_zend_output_debug_string"] = wasmExports["zend_output_debug_string"])(a0, a1, a2);

var _gc_protect = Module["_gc_protect"] = a0 => (_gc_protect = Module["_gc_protect"] = wasmExports["gc_protect"])(a0);

var _zend_get_page_size = Module["_zend_get_page_size"] = () => (_zend_get_page_size = Module["_zend_get_page_size"] = wasmExports["zend_get_page_size"])();

var _zend_append_version_info = Module["_zend_append_version_info"] = a0 => (_zend_append_version_info = Module["_zend_append_version_info"] = wasmExports["zend_append_version_info"])(a0);

var _strncat = Module["_strncat"] = (a0, a1, a2) => (_strncat = Module["_strncat"] = wasmExports["strncat"])(a0, a1, a2);

var _zend_init_internal_run_time_cache = Module["_zend_init_internal_run_time_cache"] = () => (_zend_init_internal_run_time_cache = Module["_zend_init_internal_run_time_cache"] = wasmExports["zend_init_internal_run_time_cache"])();

var _zend_observer_activate = Module["_zend_observer_activate"] = () => (_zend_observer_activate = Module["_zend_observer_activate"] = wasmExports["zend_observer_activate"])();

var _zend_ini_deactivate = Module["_zend_ini_deactivate"] = () => (_zend_ini_deactivate = Module["_zend_ini_deactivate"] = wasmExports["zend_ini_deactivate"])();

var _zend_map_ptr_reset = Module["_zend_map_ptr_reset"] = () => (_zend_map_ptr_reset = Module["_zend_map_ptr_reset"] = wasmExports["zend_map_ptr_reset"])();

var _zend_error_zstr_at = Module["_zend_error_zstr_at"] = (a0, a1, a2, a3) => (_zend_error_zstr_at = Module["_zend_error_zstr_at"] = wasmExports["zend_error_zstr_at"])(a0, a1, a2, a3);

var _zend_error_at = Module["_zend_error_at"] = (a0, a1, a2, a3, a4) => (_zend_error_at = Module["_zend_error_at"] = wasmExports["zend_error_at"])(a0, a1, a2, a3, a4);

var _zend_error_at_noreturn = Module["_zend_error_at_noreturn"] = (a0, a1, a2, a3, a4) => (_zend_error_at_noreturn = Module["_zend_error_at_noreturn"] = wasmExports["zend_error_at_noreturn"])(a0, a1, a2, a3, a4);

var _zend_strerror_noreturn = Module["_zend_strerror_noreturn"] = (a0, a1, a2) => (_zend_strerror_noreturn = Module["_zend_strerror_noreturn"] = wasmExports["zend_strerror_noreturn"])(a0, a1, a2);

var _strerror_r = Module["_strerror_r"] = (a0, a1, a2) => (_strerror_r = Module["_strerror_r"] = wasmExports["strerror_r"])(a0, a1, a2);

var _zend_begin_record_errors = Module["_zend_begin_record_errors"] = () => (_zend_begin_record_errors = Module["_zend_begin_record_errors"] = wasmExports["zend_begin_record_errors"])();

var _zend_emit_recorded_errors = Module["_zend_emit_recorded_errors"] = () => (_zend_emit_recorded_errors = Module["_zend_emit_recorded_errors"] = wasmExports["zend_emit_recorded_errors"])();

var _zend_free_recorded_errors = Module["_zend_free_recorded_errors"] = () => (_zend_free_recorded_errors = Module["_zend_free_recorded_errors"] = wasmExports["zend_free_recorded_errors"])();

var _zend_user_exception_handler = Module["_zend_user_exception_handler"] = () => (_zend_user_exception_handler = Module["_zend_user_exception_handler"] = wasmExports["zend_user_exception_handler"])();

var _zend_is_unwind_exit = Module["_zend_is_unwind_exit"] = a0 => (_zend_is_unwind_exit = Module["_zend_is_unwind_exit"] = wasmExports["zend_is_unwind_exit"])(a0);

var _zend_map_ptr_extend = Module["_zend_map_ptr_extend"] = a0 => (_zend_map_ptr_extend = Module["_zend_map_ptr_extend"] = wasmExports["zend_map_ptr_extend"])(a0);

var _zend_ini_parse_quantity_warn = Module["_zend_ini_parse_quantity_warn"] = (a0, a1) => (_zend_ini_parse_quantity_warn = Module["_zend_ini_parse_quantity_warn"] = wasmExports["zend_ini_parse_quantity_warn"])(a0, a1);

var _gc_enable = Module["_gc_enable"] = a0 => (_gc_enable = Module["_gc_enable"] = wasmExports["gc_enable"])(a0);

var _gc_enabled = Module["_gc_enabled"] = () => (_gc_enabled = Module["_gc_enabled"] = wasmExports["gc_enabled"])();

var _zend_multibyte_set_script_encoding_by_string = Module["_zend_multibyte_set_script_encoding_by_string"] = (a0, a1) => (_zend_multibyte_set_script_encoding_by_string = Module["_zend_multibyte_set_script_encoding_by_string"] = wasmExports["zend_multibyte_set_script_encoding_by_string"])(a0, a1);

var __zend_observer_error_notify = Module["__zend_observer_error_notify"] = (a0, a1, a2, a3) => (__zend_observer_error_notify = Module["__zend_observer_error_notify"] = wasmExports["_zend_observer_error_notify"])(a0, a1, a2, a3);

var _zend_get_parameters_array_ex = Module["_zend_get_parameters_array_ex"] = (a0, a1) => (_zend_get_parameters_array_ex = Module["_zend_get_parameters_array_ex"] = wasmExports["zend_get_parameters_array_ex"])(a0, a1);

var _zend_copy_parameters_array = Module["_zend_copy_parameters_array"] = (a0, a1) => (_zend_copy_parameters_array = Module["_zend_copy_parameters_array"] = wasmExports["zend_copy_parameters_array"])(a0, a1);

var _zend_wrong_property_read = Module["_zend_wrong_property_read"] = (a0, a1) => (_zend_wrong_property_read = Module["_zend_wrong_property_read"] = wasmExports["zend_wrong_property_read"])(a0, a1);

var _zend_wrong_callback_error = Module["_zend_wrong_callback_error"] = (a0, a1) => (_zend_wrong_callback_error = Module["_zend_wrong_callback_error"] = wasmExports["zend_wrong_callback_error"])(a0, a1);

var _zend_wrong_callback_or_null_error = Module["_zend_wrong_callback_or_null_error"] = (a0, a1) => (_zend_wrong_callback_or_null_error = Module["_zend_wrong_callback_or_null_error"] = wasmExports["zend_wrong_callback_or_null_error"])(a0, a1);

var _zend_wrong_parameter_class_error = Module["_zend_wrong_parameter_class_error"] = (a0, a1, a2) => (_zend_wrong_parameter_class_error = Module["_zend_wrong_parameter_class_error"] = wasmExports["zend_wrong_parameter_class_error"])(a0, a1, a2);

var _zend_wrong_parameter_class_or_null_error = Module["_zend_wrong_parameter_class_or_null_error"] = (a0, a1, a2) => (_zend_wrong_parameter_class_or_null_error = Module["_zend_wrong_parameter_class_or_null_error"] = wasmExports["zend_wrong_parameter_class_or_null_error"])(a0, a1, a2);

var _zend_wrong_parameter_class_or_string_error = Module["_zend_wrong_parameter_class_or_string_error"] = (a0, a1, a2) => (_zend_wrong_parameter_class_or_string_error = Module["_zend_wrong_parameter_class_or_string_error"] = wasmExports["zend_wrong_parameter_class_or_string_error"])(a0, a1, a2);

var _zend_wrong_parameter_class_or_string_or_null_error = Module["_zend_wrong_parameter_class_or_string_or_null_error"] = (a0, a1, a2) => (_zend_wrong_parameter_class_or_string_or_null_error = Module["_zend_wrong_parameter_class_or_string_or_null_error"] = wasmExports["zend_wrong_parameter_class_or_string_or_null_error"])(a0, a1, a2);

var _zend_wrong_parameter_class_or_long_error = Module["_zend_wrong_parameter_class_or_long_error"] = (a0, a1, a2) => (_zend_wrong_parameter_class_or_long_error = Module["_zend_wrong_parameter_class_or_long_error"] = wasmExports["zend_wrong_parameter_class_or_long_error"])(a0, a1, a2);

var _zend_wrong_parameter_class_or_long_or_null_error = Module["_zend_wrong_parameter_class_or_long_or_null_error"] = (a0, a1, a2) => (_zend_wrong_parameter_class_or_long_or_null_error = Module["_zend_wrong_parameter_class_or_long_or_null_error"] = wasmExports["zend_wrong_parameter_class_or_long_or_null_error"])(a0, a1, a2);

var _zend_wrong_parameter_type_error = Module["_zend_wrong_parameter_type_error"] = (a0, a1, a2) => (_zend_wrong_parameter_type_error = Module["_zend_wrong_parameter_type_error"] = wasmExports["zend_wrong_parameter_type_error"])(a0, a1, a2);

var _zend_unexpected_extra_named_error = Module["_zend_unexpected_extra_named_error"] = () => (_zend_unexpected_extra_named_error = Module["_zend_unexpected_extra_named_error"] = wasmExports["zend_unexpected_extra_named_error"])();

var _zend_argument_error_variadic = Module["_zend_argument_error_variadic"] = (a0, a1, a2, a3) => (_zend_argument_error_variadic = Module["_zend_argument_error_variadic"] = wasmExports["zend_argument_error_variadic"])(a0, a1, a2, a3);

var _zend_parse_arg_bool_weak = Module["_zend_parse_arg_bool_weak"] = (a0, a1, a2) => (_zend_parse_arg_bool_weak = Module["_zend_parse_arg_bool_weak"] = wasmExports["zend_parse_arg_bool_weak"])(a0, a1, a2);

var _zend_parse_arg_long_weak = Module["_zend_parse_arg_long_weak"] = (a0, a1, a2) => (_zend_parse_arg_long_weak = Module["_zend_parse_arg_long_weak"] = wasmExports["zend_parse_arg_long_weak"])(a0, a1, a2);

var _zend_parse_arg_double_weak = Module["_zend_parse_arg_double_weak"] = (a0, a1, a2) => (_zend_parse_arg_double_weak = Module["_zend_parse_arg_double_weak"] = wasmExports["zend_parse_arg_double_weak"])(a0, a1, a2);

var _zend_parse_arg_str_weak = Module["_zend_parse_arg_str_weak"] = (a0, a1, a2) => (_zend_parse_arg_str_weak = Module["_zend_parse_arg_str_weak"] = wasmExports["zend_parse_arg_str_weak"])(a0, a1, a2);

var _zend_parse_parameter = Module["_zend_parse_parameter"] = (a0, a1, a2, a3, a4) => (_zend_parse_parameter = Module["_zend_parse_parameter"] = wasmExports["zend_parse_parameter"])(a0, a1, a2, a3, a4);

var _zend_parse_method_parameters_ex = Module["_zend_parse_method_parameters_ex"] = (a0, a1, a2, a3, a4) => (_zend_parse_method_parameters_ex = Module["_zend_parse_method_parameters_ex"] = wasmExports["zend_parse_method_parameters_ex"])(a0, a1, a2, a3, a4);

var _zend_merge_properties = Module["_zend_merge_properties"] = (a0, a1) => (_zend_merge_properties = Module["_zend_merge_properties"] = wasmExports["zend_merge_properties"])(a0, a1);

var _zend_verify_class_constant_type = Module["_zend_verify_class_constant_type"] = (a0, a1, a2) => (_zend_verify_class_constant_type = Module["_zend_verify_class_constant_type"] = wasmExports["zend_verify_class_constant_type"])(a0, a1, a2);

var _object_properties_init_ex = Module["_object_properties_init_ex"] = (a0, a1) => (_object_properties_init_ex = Module["_object_properties_init_ex"] = wasmExports["object_properties_init_ex"])(a0, a1);

var _add_assoc_resource_ex = Module["_add_assoc_resource_ex"] = (a0, a1, a2, a3) => (_add_assoc_resource_ex = Module["_add_assoc_resource_ex"] = wasmExports["add_assoc_resource_ex"])(a0, a1, a2, a3);

var _add_assoc_array_ex = Module["_add_assoc_array_ex"] = (a0, a1, a2, a3) => (_add_assoc_array_ex = Module["_add_assoc_array_ex"] = wasmExports["add_assoc_array_ex"])(a0, a1, a2, a3);

var _add_assoc_object_ex = Module["_add_assoc_object_ex"] = (a0, a1, a2, a3) => (_add_assoc_object_ex = Module["_add_assoc_object_ex"] = wasmExports["add_assoc_object_ex"])(a0, a1, a2, a3);

var _add_assoc_reference_ex = Module["_add_assoc_reference_ex"] = (a0, a1, a2, a3) => (_add_assoc_reference_ex = Module["_add_assoc_reference_ex"] = wasmExports["add_assoc_reference_ex"])(a0, a1, a2, a3);

var _add_index_null = Module["_add_index_null"] = (a0, a1) => (_add_index_null = Module["_add_index_null"] = wasmExports["add_index_null"])(a0, a1);

var _add_index_bool = Module["_add_index_bool"] = (a0, a1, a2) => (_add_index_bool = Module["_add_index_bool"] = wasmExports["add_index_bool"])(a0, a1, a2);

var _add_index_resource = Module["_add_index_resource"] = (a0, a1, a2) => (_add_index_resource = Module["_add_index_resource"] = wasmExports["add_index_resource"])(a0, a1, a2);

var _add_index_array = Module["_add_index_array"] = (a0, a1, a2) => (_add_index_array = Module["_add_index_array"] = wasmExports["add_index_array"])(a0, a1, a2);

var _add_index_object = Module["_add_index_object"] = (a0, a1, a2) => (_add_index_object = Module["_add_index_object"] = wasmExports["add_index_object"])(a0, a1, a2);

var _add_index_reference = Module["_add_index_reference"] = (a0, a1, a2) => (_add_index_reference = Module["_add_index_reference"] = wasmExports["add_index_reference"])(a0, a1, a2);

var _add_next_index_bool = Module["_add_next_index_bool"] = (a0, a1) => (_add_next_index_bool = Module["_add_next_index_bool"] = wasmExports["add_next_index_bool"])(a0, a1);

var _add_next_index_double = Module["_add_next_index_double"] = (a0, a1) => (_add_next_index_double = Module["_add_next_index_double"] = wasmExports["add_next_index_double"])(a0, a1);

var _add_next_index_array = Module["_add_next_index_array"] = (a0, a1) => (_add_next_index_array = Module["_add_next_index_array"] = wasmExports["add_next_index_array"])(a0, a1);

var _add_next_index_reference = Module["_add_next_index_reference"] = (a0, a1) => (_add_next_index_reference = Module["_add_next_index_reference"] = wasmExports["add_next_index_reference"])(a0, a1);

var _add_property_bool_ex = Module["_add_property_bool_ex"] = (a0, a1, a2, a3) => (_add_property_bool_ex = Module["_add_property_bool_ex"] = wasmExports["add_property_bool_ex"])(a0, a1, a2, a3);

var _add_property_double_ex = Module["_add_property_double_ex"] = (a0, a1, a2, a3) => (_add_property_double_ex = Module["_add_property_double_ex"] = wasmExports["add_property_double_ex"])(a0, a1, a2, a3);

var _add_property_str_ex = Module["_add_property_str_ex"] = (a0, a1, a2, a3) => (_add_property_str_ex = Module["_add_property_str_ex"] = wasmExports["add_property_str_ex"])(a0, a1, a2, a3);

var _add_property_array_ex = Module["_add_property_array_ex"] = (a0, a1, a2, a3) => (_add_property_array_ex = Module["_add_property_array_ex"] = wasmExports["add_property_array_ex"])(a0, a1, a2, a3);

var _add_property_object_ex = Module["_add_property_object_ex"] = (a0, a1, a2, a3) => (_add_property_object_ex = Module["_add_property_object_ex"] = wasmExports["add_property_object_ex"])(a0, a1, a2, a3);

var _add_property_reference_ex = Module["_add_property_reference_ex"] = (a0, a1, a2, a3) => (_add_property_reference_ex = Module["_add_property_reference_ex"] = wasmExports["add_property_reference_ex"])(a0, a1, a2, a3);

var _zend_unregister_functions = Module["_zend_unregister_functions"] = (a0, a1, a2) => (_zend_unregister_functions = Module["_zend_unregister_functions"] = wasmExports["zend_unregister_functions"])(a0, a1, a2);

var _zend_startup_module = Module["_zend_startup_module"] = a0 => (_zend_startup_module = Module["_zend_startup_module"] = wasmExports["zend_startup_module"])(a0);

var _zend_get_module_started = Module["_zend_get_module_started"] = a0 => (_zend_get_module_started = Module["_zend_get_module_started"] = wasmExports["zend_get_module_started"])(a0);

var _zend_do_implement_interface = Module["_zend_do_implement_interface"] = (a0, a1) => (_zend_do_implement_interface = Module["_zend_do_implement_interface"] = wasmExports["zend_do_implement_interface"])(a0, a1);

var _zend_register_class_alias_ex = Module["_zend_register_class_alias_ex"] = (a0, a1, a2, a3) => (_zend_register_class_alias_ex = Module["_zend_register_class_alias_ex"] = wasmExports["zend_register_class_alias_ex"])(a0, a1, a2, a3);

var _zend_set_hash_symbol = Module["_zend_set_hash_symbol"] = (a0, a1, a2, a3, a4, a5) => (_zend_set_hash_symbol = Module["_zend_set_hash_symbol"] = wasmExports["zend_set_hash_symbol"])(a0, a1, a2, a3, a4, a5);

var _zend_get_callable_name = Module["_zend_get_callable_name"] = a0 => (_zend_get_callable_name = Module["_zend_get_callable_name"] = wasmExports["zend_get_callable_name"])(a0);

var _zend_is_callable_at_frame = Module["_zend_is_callable_at_frame"] = (a0, a1, a2, a3, a4, a5) => (_zend_is_callable_at_frame = Module["_zend_is_callable_at_frame"] = wasmExports["zend_is_callable_at_frame"])(a0, a1, a2, a3, a4, a5);

var _zend_is_callable = Module["_zend_is_callable"] = (a0, a1, a2) => (_zend_is_callable = Module["_zend_is_callable"] = wasmExports["zend_is_callable"])(a0, a1, a2);

var _zend_make_callable = Module["_zend_make_callable"] = (a0, a1) => (_zend_make_callable = Module["_zend_make_callable"] = wasmExports["zend_make_callable"])(a0, a1);

var _zend_fcall_info_args_save = Module["_zend_fcall_info_args_save"] = (a0, a1, a2) => (_zend_fcall_info_args_save = Module["_zend_fcall_info_args_save"] = wasmExports["zend_fcall_info_args_save"])(a0, a1, a2);

var _zend_fcall_info_args_restore = Module["_zend_fcall_info_args_restore"] = (a0, a1, a2) => (_zend_fcall_info_args_restore = Module["_zend_fcall_info_args_restore"] = wasmExports["zend_fcall_info_args_restore"])(a0, a1, a2);

var _zend_fcall_info_argv = Module["_zend_fcall_info_argv"] = (a0, a1, a2) => (_zend_fcall_info_argv = Module["_zend_fcall_info_argv"] = wasmExports["zend_fcall_info_argv"])(a0, a1, a2);

var _zend_fcall_info_argn = Module["_zend_fcall_info_argn"] = (a0, a1, a2) => (_zend_fcall_info_argn = Module["_zend_fcall_info_argn"] = wasmExports["zend_fcall_info_argn"])(a0, a1, a2);

var _zend_fcall_info_call = Module["_zend_fcall_info_call"] = (a0, a1, a2, a3) => (_zend_fcall_info_call = Module["_zend_fcall_info_call"] = wasmExports["zend_fcall_info_call"])(a0, a1, a2, a3);

var _zend_try_assign_typed_ref_ex = Module["_zend_try_assign_typed_ref_ex"] = (a0, a1, a2) => (_zend_try_assign_typed_ref_ex = Module["_zend_try_assign_typed_ref_ex"] = wasmExports["zend_try_assign_typed_ref_ex"])(a0, a1, a2);

var _zend_try_assign_typed_ref_bool = Module["_zend_try_assign_typed_ref_bool"] = (a0, a1) => (_zend_try_assign_typed_ref_bool = Module["_zend_try_assign_typed_ref_bool"] = wasmExports["zend_try_assign_typed_ref_bool"])(a0, a1);

var _zend_try_assign_typed_ref_res = Module["_zend_try_assign_typed_ref_res"] = (a0, a1) => (_zend_try_assign_typed_ref_res = Module["_zend_try_assign_typed_ref_res"] = wasmExports["zend_try_assign_typed_ref_res"])(a0, a1);

var _zend_try_assign_typed_ref_zval = Module["_zend_try_assign_typed_ref_zval"] = (a0, a1) => (_zend_try_assign_typed_ref_zval = Module["_zend_try_assign_typed_ref_zval"] = wasmExports["zend_try_assign_typed_ref_zval"])(a0, a1);

var _zend_declare_property_ex = Module["_zend_declare_property_ex"] = (a0, a1, a2, a3, a4) => (_zend_declare_property_ex = Module["_zend_declare_property_ex"] = wasmExports["zend_declare_property_ex"])(a0, a1, a2, a3, a4);

var _zend_declare_property = Module["_zend_declare_property"] = (a0, a1, a2, a3, a4) => (_zend_declare_property = Module["_zend_declare_property"] = wasmExports["zend_declare_property"])(a0, a1, a2, a3, a4);

var _zend_declare_property_null = Module["_zend_declare_property_null"] = (a0, a1, a2, a3) => (_zend_declare_property_null = Module["_zend_declare_property_null"] = wasmExports["zend_declare_property_null"])(a0, a1, a2, a3);

var _zend_declare_property_bool = Module["_zend_declare_property_bool"] = (a0, a1, a2, a3, a4) => (_zend_declare_property_bool = Module["_zend_declare_property_bool"] = wasmExports["zend_declare_property_bool"])(a0, a1, a2, a3, a4);

var _zend_declare_property_long = Module["_zend_declare_property_long"] = (a0, a1, a2, a3, a4) => (_zend_declare_property_long = Module["_zend_declare_property_long"] = wasmExports["zend_declare_property_long"])(a0, a1, a2, a3, a4);

var _zend_declare_property_double = Module["_zend_declare_property_double"] = (a0, a1, a2, a3, a4) => (_zend_declare_property_double = Module["_zend_declare_property_double"] = wasmExports["zend_declare_property_double"])(a0, a1, a2, a3, a4);

var _zend_declare_property_string = Module["_zend_declare_property_string"] = (a0, a1, a2, a3, a4) => (_zend_declare_property_string = Module["_zend_declare_property_string"] = wasmExports["zend_declare_property_string"])(a0, a1, a2, a3, a4);

var _zend_declare_property_stringl = Module["_zend_declare_property_stringl"] = (a0, a1, a2, a3, a4, a5) => (_zend_declare_property_stringl = Module["_zend_declare_property_stringl"] = wasmExports["zend_declare_property_stringl"])(a0, a1, a2, a3, a4, a5);

var _zend_declare_class_constant = Module["_zend_declare_class_constant"] = (a0, a1, a2, a3) => (_zend_declare_class_constant = Module["_zend_declare_class_constant"] = wasmExports["zend_declare_class_constant"])(a0, a1, a2, a3);

var _zend_declare_class_constant_null = Module["_zend_declare_class_constant_null"] = (a0, a1, a2) => (_zend_declare_class_constant_null = Module["_zend_declare_class_constant_null"] = wasmExports["zend_declare_class_constant_null"])(a0, a1, a2);

var _zend_declare_class_constant_long = Module["_zend_declare_class_constant_long"] = (a0, a1, a2, a3) => (_zend_declare_class_constant_long = Module["_zend_declare_class_constant_long"] = wasmExports["zend_declare_class_constant_long"])(a0, a1, a2, a3);

var _zend_declare_class_constant_bool = Module["_zend_declare_class_constant_bool"] = (a0, a1, a2, a3) => (_zend_declare_class_constant_bool = Module["_zend_declare_class_constant_bool"] = wasmExports["zend_declare_class_constant_bool"])(a0, a1, a2, a3);

var _zend_declare_class_constant_double = Module["_zend_declare_class_constant_double"] = (a0, a1, a2, a3) => (_zend_declare_class_constant_double = Module["_zend_declare_class_constant_double"] = wasmExports["zend_declare_class_constant_double"])(a0, a1, a2, a3);

var _zend_declare_class_constant_stringl = Module["_zend_declare_class_constant_stringl"] = (a0, a1, a2, a3, a4) => (_zend_declare_class_constant_stringl = Module["_zend_declare_class_constant_stringl"] = wasmExports["zend_declare_class_constant_stringl"])(a0, a1, a2, a3, a4);

var _zend_declare_class_constant_string = Module["_zend_declare_class_constant_string"] = (a0, a1, a2, a3) => (_zend_declare_class_constant_string = Module["_zend_declare_class_constant_string"] = wasmExports["zend_declare_class_constant_string"])(a0, a1, a2, a3);

var _zend_update_property_null = Module["_zend_update_property_null"] = (a0, a1, a2, a3) => (_zend_update_property_null = Module["_zend_update_property_null"] = wasmExports["zend_update_property_null"])(a0, a1, a2, a3);

var _zend_unset_property = Module["_zend_unset_property"] = (a0, a1, a2, a3) => (_zend_unset_property = Module["_zend_unset_property"] = wasmExports["zend_unset_property"])(a0, a1, a2, a3);

var _zend_update_property_bool = Module["_zend_update_property_bool"] = (a0, a1, a2, a3, a4) => (_zend_update_property_bool = Module["_zend_update_property_bool"] = wasmExports["zend_update_property_bool"])(a0, a1, a2, a3, a4);

var _zend_update_property_double = Module["_zend_update_property_double"] = (a0, a1, a2, a3, a4) => (_zend_update_property_double = Module["_zend_update_property_double"] = wasmExports["zend_update_property_double"])(a0, a1, a2, a3, a4);

var _zend_update_property_stringl = Module["_zend_update_property_stringl"] = (a0, a1, a2, a3, a4, a5) => (_zend_update_property_stringl = Module["_zend_update_property_stringl"] = wasmExports["zend_update_property_stringl"])(a0, a1, a2, a3, a4, a5);

var _zend_update_static_property = Module["_zend_update_static_property"] = (a0, a1, a2, a3) => (_zend_update_static_property = Module["_zend_update_static_property"] = wasmExports["zend_update_static_property"])(a0, a1, a2, a3);

var _zend_update_static_property_null = Module["_zend_update_static_property_null"] = (a0, a1, a2) => (_zend_update_static_property_null = Module["_zend_update_static_property_null"] = wasmExports["zend_update_static_property_null"])(a0, a1, a2);

var _zend_update_static_property_bool = Module["_zend_update_static_property_bool"] = (a0, a1, a2, a3) => (_zend_update_static_property_bool = Module["_zend_update_static_property_bool"] = wasmExports["zend_update_static_property_bool"])(a0, a1, a2, a3);

var _zend_update_static_property_long = Module["_zend_update_static_property_long"] = (a0, a1, a2, a3) => (_zend_update_static_property_long = Module["_zend_update_static_property_long"] = wasmExports["zend_update_static_property_long"])(a0, a1, a2, a3);

var _zend_update_static_property_double = Module["_zend_update_static_property_double"] = (a0, a1, a2, a3) => (_zend_update_static_property_double = Module["_zend_update_static_property_double"] = wasmExports["zend_update_static_property_double"])(a0, a1, a2, a3);

var _zend_update_static_property_string = Module["_zend_update_static_property_string"] = (a0, a1, a2, a3) => (_zend_update_static_property_string = Module["_zend_update_static_property_string"] = wasmExports["zend_update_static_property_string"])(a0, a1, a2, a3);

var _zend_update_static_property_stringl = Module["_zend_update_static_property_stringl"] = (a0, a1, a2, a3, a4) => (_zend_update_static_property_stringl = Module["_zend_update_static_property_stringl"] = wasmExports["zend_update_static_property_stringl"])(a0, a1, a2, a3, a4);

var _zend_read_static_property = Module["_zend_read_static_property"] = (a0, a1, a2, a3) => (_zend_read_static_property = Module["_zend_read_static_property"] = wasmExports["zend_read_static_property"])(a0, a1, a2, a3);

var _zend_save_error_handling = Module["_zend_save_error_handling"] = a0 => (_zend_save_error_handling = Module["_zend_save_error_handling"] = wasmExports["zend_save_error_handling"])(a0);

var _zend_do_inheritance_ex = Module["_zend_do_inheritance_ex"] = (a0, a1, a2) => (_zend_do_inheritance_ex = Module["_zend_do_inheritance_ex"] = wasmExports["zend_do_inheritance_ex"])(a0, a1, a2);

var _zend_get_call_trampoline_func = Module["_zend_get_call_trampoline_func"] = (a0, a1, a2) => (_zend_get_call_trampoline_func = Module["_zend_get_call_trampoline_func"] = wasmExports["zend_get_call_trampoline_func"])(a0, a1, a2);

var _zend_std_get_static_method = Module["_zend_std_get_static_method"] = (a0, a1, a2) => (_zend_std_get_static_method = Module["_zend_std_get_static_method"] = wasmExports["zend_std_get_static_method"])(a0, a1, a2);

var _zend_assign_to_typed_ref = Module["_zend_assign_to_typed_ref"] = (a0, a1, a2, a3) => (_zend_assign_to_typed_ref = Module["_zend_assign_to_typed_ref"] = wasmExports["zend_assign_to_typed_ref"])(a0, a1, a2, a3);

var _zend_register_extension = Module["_zend_register_extension"] = (a0, a1) => (_zend_register_extension = Module["_zend_register_extension"] = wasmExports["zend_register_extension"])(a0, a1);

var _zend_extension_dispatch_message = Module["_zend_extension_dispatch_message"] = (a0, a1) => (_zend_extension_dispatch_message = Module["_zend_extension_dispatch_message"] = wasmExports["zend_extension_dispatch_message"])(a0, a1);

var _zend_get_resource_handle = Module["_zend_get_resource_handle"] = a0 => (_zend_get_resource_handle = Module["_zend_get_resource_handle"] = wasmExports["zend_get_resource_handle"])(a0);

var _zend_add_system_entropy = Module["_zend_add_system_entropy"] = (a0, a1, a2, a3) => (_zend_add_system_entropy = Module["_zend_add_system_entropy"] = wasmExports["zend_add_system_entropy"])(a0, a1, a2, a3);

var _zend_get_op_array_extension_handle = Module["_zend_get_op_array_extension_handle"] = a0 => (_zend_get_op_array_extension_handle = Module["_zend_get_op_array_extension_handle"] = wasmExports["zend_get_op_array_extension_handle"])(a0);

var _zend_get_op_array_extension_handles = Module["_zend_get_op_array_extension_handles"] = (a0, a1) => (_zend_get_op_array_extension_handles = Module["_zend_get_op_array_extension_handles"] = wasmExports["zend_get_op_array_extension_handles"])(a0, a1);

var _zend_extensions_op_array_persist_calc = Module["_zend_extensions_op_array_persist_calc"] = a0 => (_zend_extensions_op_array_persist_calc = Module["_zend_extensions_op_array_persist_calc"] = wasmExports["zend_extensions_op_array_persist_calc"])(a0);

var _zend_extensions_op_array_persist = Module["_zend_extensions_op_array_persist"] = (a0, a1) => (_zend_extensions_op_array_persist = Module["_zend_extensions_op_array_persist"] = wasmExports["zend_extensions_op_array_persist"])(a0, a1);

var _zend_hash_packed_to_hash = Module["_zend_hash_packed_to_hash"] = a0 => (_zend_hash_packed_to_hash = Module["_zend_hash_packed_to_hash"] = wasmExports["zend_hash_packed_to_hash"])(a0);

var _zend_hash_add_or_update = Module["_zend_hash_add_or_update"] = (a0, a1, a2, a3) => (_zend_hash_add_or_update = Module["_zend_hash_add_or_update"] = wasmExports["zend_hash_add_or_update"])(a0, a1, a2, a3);

var _zend_hash_str_add_or_update = Module["_zend_hash_str_add_or_update"] = (a0, a1, a2, a3, a4) => (_zend_hash_str_add_or_update = Module["_zend_hash_str_add_or_update"] = wasmExports["zend_hash_str_add_or_update"])(a0, a1, a2, a3, a4);

var _zend_hash_index_add_or_update = Module["_zend_hash_index_add_or_update"] = (a0, a1, a2, a3) => (_zend_hash_index_add_or_update = Module["_zend_hash_index_add_or_update"] = wasmExports["zend_hash_index_add_or_update"])(a0, a1, a2, a3);

var _zend_hash_str_del_ind = Module["_zend_hash_str_del_ind"] = (a0, a1, a2) => (_zend_hash_str_del_ind = Module["_zend_hash_str_del_ind"] = wasmExports["zend_hash_str_del_ind"])(a0, a1, a2);

var _gc_remove_from_buffer = Module["_gc_remove_from_buffer"] = a0 => (_gc_remove_from_buffer = Module["_gc_remove_from_buffer"] = wasmExports["gc_remove_from_buffer"])(a0);

var _zend_symtable_clean = Module["_zend_symtable_clean"] = a0 => (_zend_symtable_clean = Module["_zend_symtable_clean"] = wasmExports["zend_symtable_clean"])(a0);

var _zend_hash_graceful_destroy = Module["_zend_hash_graceful_destroy"] = a0 => (_zend_hash_graceful_destroy = Module["_zend_hash_graceful_destroy"] = wasmExports["zend_hash_graceful_destroy"])(a0);

var _zend_hash_apply_with_arguments = Module["_zend_hash_apply_with_arguments"] = (a0, a1, a2, a3) => (_zend_hash_apply_with_arguments = Module["_zend_hash_apply_with_arguments"] = wasmExports["zend_hash_apply_with_arguments"])(a0, a1, a2, a3);

var _zend_hash_merge_ex = Module["_zend_hash_merge_ex"] = (a0, a1, a2, a3, a4) => (_zend_hash_merge_ex = Module["_zend_hash_merge_ex"] = wasmExports["zend_hash_merge_ex"])(a0, a1, a2, a3, a4);

var __zend_hash_index_find = Module["__zend_hash_index_find"] = (a0, a1) => (__zend_hash_index_find = Module["__zend_hash_index_find"] = wasmExports["_zend_hash_index_find"])(a0, a1);

var _zend_hash_bucket_renum_swap = Module["_zend_hash_bucket_renum_swap"] = (a0, a1) => (_zend_hash_bucket_renum_swap = Module["_zend_hash_bucket_renum_swap"] = wasmExports["zend_hash_bucket_renum_swap"])(a0, a1);

var _zend_hash_bucket_packed_swap = Module["_zend_hash_bucket_packed_swap"] = (a0, a1) => (_zend_hash_bucket_packed_swap = Module["_zend_hash_bucket_packed_swap"] = wasmExports["zend_hash_bucket_packed_swap"])(a0, a1);

var _zend_list_insert = Module["_zend_list_insert"] = (a0, a1) => (_zend_list_insert = Module["_zend_list_insert"] = wasmExports["zend_list_insert"])(a0, a1);

var _zend_fetch_list_dtor_id = Module["_zend_fetch_list_dtor_id"] = a0 => (_zend_fetch_list_dtor_id = Module["_zend_fetch_list_dtor_id"] = wasmExports["zend_fetch_list_dtor_id"])(a0);

var _zend_register_persistent_resource_ex = Module["_zend_register_persistent_resource_ex"] = (a0, a1, a2) => (_zend_register_persistent_resource_ex = Module["_zend_register_persistent_resource_ex"] = wasmExports["zend_register_persistent_resource_ex"])(a0, a1, a2);

var _zend_register_default_classes = Module["_zend_register_default_classes"] = () => (_zend_register_default_classes = Module["_zend_register_default_classes"] = wasmExports["zend_register_default_classes"])();

var _zend_gc_get_status = Module["_zend_gc_get_status"] = a0 => (_zend_gc_get_status = Module["_zend_gc_get_status"] = wasmExports["zend_gc_get_status"])(a0);

var _zend_trace_to_string = Module["_zend_trace_to_string"] = (a0, a1) => (_zend_trace_to_string = Module["_zend_trace_to_string"] = wasmExports["zend_trace_to_string"])(a0, a1);

var _zend_generator_check_placeholder_frame = Module["_zend_generator_check_placeholder_frame"] = a0 => (_zend_generator_check_placeholder_frame = Module["_zend_generator_check_placeholder_frame"] = wasmExports["zend_generator_check_placeholder_frame"])(a0);

var _zend_std_get_class_name = Module["_zend_std_get_class_name"] = a0 => (_zend_std_get_class_name = Module["_zend_std_get_class_name"] = wasmExports["zend_std_get_class_name"])(a0);

var _zend_get_parameter_attribute_str = Module["_zend_get_parameter_attribute_str"] = (a0, a1, a2, a3) => (_zend_get_parameter_attribute_str = Module["_zend_get_parameter_attribute_str"] = wasmExports["zend_get_parameter_attribute_str"])(a0, a1, a2, a3);

var _zend_get_attribute = Module["_zend_get_attribute"] = (a0, a1) => (_zend_get_attribute = Module["_zend_get_attribute"] = wasmExports["zend_get_attribute"])(a0, a1);

var _zend_get_parameter_attribute = Module["_zend_get_parameter_attribute"] = (a0, a1, a2) => (_zend_get_parameter_attribute = Module["_zend_get_parameter_attribute"] = wasmExports["zend_get_parameter_attribute"])(a0, a1, a2);

var _zend_mark_internal_attribute = Module["_zend_mark_internal_attribute"] = a0 => (_zend_mark_internal_attribute = Module["_zend_mark_internal_attribute"] = wasmExports["zend_mark_internal_attribute"])(a0);

var _zend_internal_attribute_register = Module["_zend_internal_attribute_register"] = (a0, a1) => (_zend_internal_attribute_register = Module["_zend_internal_attribute_register"] = wasmExports["zend_internal_attribute_register"])(a0, a1);

var _zend_vm_stack_init_ex = Module["_zend_vm_stack_init_ex"] = a0 => (_zend_vm_stack_init_ex = Module["_zend_vm_stack_init_ex"] = wasmExports["zend_vm_stack_init_ex"])(a0);

var _zend_get_compiled_variable_value = Module["_zend_get_compiled_variable_value"] = (a0, a1) => (_zend_get_compiled_variable_value = Module["_zend_get_compiled_variable_value"] = wasmExports["zend_get_compiled_variable_value"])(a0, a1);

var _zend_gcc_global_regs = Module["_zend_gcc_global_regs"] = () => (_zend_gcc_global_regs = Module["_zend_gcc_global_regs"] = wasmExports["zend_gcc_global_regs"])();

var _zend_cannot_pass_by_reference = Module["_zend_cannot_pass_by_reference"] = a0 => (_zend_cannot_pass_by_reference = Module["_zend_cannot_pass_by_reference"] = wasmExports["zend_cannot_pass_by_reference"])(a0);

var _zend_verify_arg_error = Module["_zend_verify_arg_error"] = (a0, a1, a2, a3) => (_zend_verify_arg_error = Module["_zend_verify_arg_error"] = wasmExports["zend_verify_arg_error"])(a0, a1, a2, a3);

var _zend_verify_scalar_type_hint = Module["_zend_verify_scalar_type_hint"] = (a0, a1, a2, a3) => (_zend_verify_scalar_type_hint = Module["_zend_verify_scalar_type_hint"] = wasmExports["zend_verify_scalar_type_hint"])(a0, a1, a2, a3);

var _zend_readonly_property_modification_error = Module["_zend_readonly_property_modification_error"] = a0 => (_zend_readonly_property_modification_error = Module["_zend_readonly_property_modification_error"] = wasmExports["zend_readonly_property_modification_error"])(a0);

var _zend_readonly_property_indirect_modification_error = Module["_zend_readonly_property_indirect_modification_error"] = a0 => (_zend_readonly_property_indirect_modification_error = Module["_zend_readonly_property_indirect_modification_error"] = wasmExports["zend_readonly_property_indirect_modification_error"])(a0);

var _zend_invalid_class_constant_type_error = Module["_zend_invalid_class_constant_type_error"] = a0 => (_zend_invalid_class_constant_type_error = Module["_zend_invalid_class_constant_type_error"] = wasmExports["zend_invalid_class_constant_type_error"])(a0);

var _zend_object_released_while_assigning_to_property_error = Module["_zend_object_released_while_assigning_to_property_error"] = a0 => (_zend_object_released_while_assigning_to_property_error = Module["_zend_object_released_while_assigning_to_property_error"] = wasmExports["zend_object_released_while_assigning_to_property_error"])(a0);

var _zend_check_user_type_slow = Module["_zend_check_user_type_slow"] = (a0, a1, a2, a3, a4) => (_zend_check_user_type_slow = Module["_zend_check_user_type_slow"] = wasmExports["zend_check_user_type_slow"])(a0, a1, a2, a3, a4);

var _zend_missing_arg_error = Module["_zend_missing_arg_error"] = a0 => (_zend_missing_arg_error = Module["_zend_missing_arg_error"] = wasmExports["zend_missing_arg_error"])(a0);

var _zend_verify_return_error = Module["_zend_verify_return_error"] = (a0, a1) => (_zend_verify_return_error = Module["_zend_verify_return_error"] = wasmExports["zend_verify_return_error"])(a0, a1);

var _zend_verify_never_error = Module["_zend_verify_never_error"] = a0 => (_zend_verify_never_error = Module["_zend_verify_never_error"] = wasmExports["zend_verify_never_error"])(a0);

var _zend_wrong_string_offset_error = Module["_zend_wrong_string_offset_error"] = () => (_zend_wrong_string_offset_error = Module["_zend_wrong_string_offset_error"] = wasmExports["zend_wrong_string_offset_error"])();

var _zend_false_to_array_deprecated = Module["_zend_false_to_array_deprecated"] = () => (_zend_false_to_array_deprecated = Module["_zend_false_to_array_deprecated"] = wasmExports["zend_false_to_array_deprecated"])();

var _zend_undefined_offset_write = Module["_zend_undefined_offset_write"] = (a0, a1) => (_zend_undefined_offset_write = Module["_zend_undefined_offset_write"] = wasmExports["zend_undefined_offset_write"])(a0, a1);

var _zend_undefined_index_write = Module["_zend_undefined_index_write"] = (a0, a1) => (_zend_undefined_index_write = Module["_zend_undefined_index_write"] = wasmExports["zend_undefined_index_write"])(a0, a1);

var _zend_fetch_dimension_const = Module["_zend_fetch_dimension_const"] = (a0, a1, a2, a3) => (_zend_fetch_dimension_const = Module["_zend_fetch_dimension_const"] = wasmExports["zend_fetch_dimension_const"])(a0, a1, a2, a3);

var _zend_verify_ref_array_assignable = Module["_zend_verify_ref_array_assignable"] = a0 => (_zend_verify_ref_array_assignable = Module["_zend_verify_ref_array_assignable"] = wasmExports["zend_verify_ref_array_assignable"])(a0);

var _zend_throw_ref_type_error_type = Module["_zend_throw_ref_type_error_type"] = (a0, a1, a2) => (_zend_throw_ref_type_error_type = Module["_zend_throw_ref_type_error_type"] = wasmExports["zend_throw_ref_type_error_type"])(a0, a1, a2);

var _zend_throw_ref_type_error_zval = Module["_zend_throw_ref_type_error_zval"] = (a0, a1) => (_zend_throw_ref_type_error_zval = Module["_zend_throw_ref_type_error_zval"] = wasmExports["zend_throw_ref_type_error_zval"])(a0, a1);

var _zend_throw_conflicting_coercion_error = Module["_zend_throw_conflicting_coercion_error"] = (a0, a1, a2) => (_zend_throw_conflicting_coercion_error = Module["_zend_throw_conflicting_coercion_error"] = wasmExports["zend_throw_conflicting_coercion_error"])(a0, a1, a2);

var _zend_assign_to_typed_ref_ex = Module["_zend_assign_to_typed_ref_ex"] = (a0, a1, a2, a3, a4) => (_zend_assign_to_typed_ref_ex = Module["_zend_assign_to_typed_ref_ex"] = wasmExports["zend_assign_to_typed_ref_ex"])(a0, a1, a2, a3, a4);

var _zend_verify_prop_assignable_by_ref_ex = Module["_zend_verify_prop_assignable_by_ref_ex"] = (a0, a1, a2, a3) => (_zend_verify_prop_assignable_by_ref_ex = Module["_zend_verify_prop_assignable_by_ref_ex"] = wasmExports["zend_verify_prop_assignable_by_ref_ex"])(a0, a1, a2, a3);

var _execute_internal = Module["_execute_internal"] = (a0, a1) => (_execute_internal = Module["_execute_internal"] = wasmExports["execute_internal"])(a0, a1);

var _zend_clean_and_cache_symbol_table = Module["_zend_clean_and_cache_symbol_table"] = a0 => (_zend_clean_and_cache_symbol_table = Module["_zend_clean_and_cache_symbol_table"] = wasmExports["zend_clean_and_cache_symbol_table"])(a0);

var _zend_free_compiled_variables = Module["_zend_free_compiled_variables"] = a0 => (_zend_free_compiled_variables = Module["_zend_free_compiled_variables"] = wasmExports["zend_free_compiled_variables"])(a0);

var _zend_fetch_function_str = Module["_zend_fetch_function_str"] = (a0, a1) => (_zend_fetch_function_str = Module["_zend_fetch_function_str"] = wasmExports["zend_fetch_function_str"])(a0, a1);

var _zend_init_func_run_time_cache = Module["_zend_init_func_run_time_cache"] = a0 => (_zend_init_func_run_time_cache = Module["_zend_init_func_run_time_cache"] = wasmExports["zend_init_func_run_time_cache"])(a0);

var _zend_init_code_execute_data = Module["_zend_init_code_execute_data"] = (a0, a1, a2) => (_zend_init_code_execute_data = Module["_zend_init_code_execute_data"] = wasmExports["zend_init_code_execute_data"])(a0, a1, a2);

var _zend_init_execute_data = Module["_zend_init_execute_data"] = (a0, a1, a2) => (_zend_init_execute_data = Module["_zend_init_execute_data"] = wasmExports["zend_init_execute_data"])(a0, a1, a2);

var _zend_unfinished_calls_gc = Module["_zend_unfinished_calls_gc"] = (a0, a1, a2, a3) => (_zend_unfinished_calls_gc = Module["_zend_unfinished_calls_gc"] = wasmExports["zend_unfinished_calls_gc"])(a0, a1, a2, a3);

var _zend_cleanup_unfinished_execution = Module["_zend_cleanup_unfinished_execution"] = (a0, a1, a2) => (_zend_cleanup_unfinished_execution = Module["_zend_cleanup_unfinished_execution"] = wasmExports["zend_cleanup_unfinished_execution"])(a0, a1, a2);

var _zend_unfinished_execution_gc = Module["_zend_unfinished_execution_gc"] = (a0, a1, a2) => (_zend_unfinished_execution_gc = Module["_zend_unfinished_execution_gc"] = wasmExports["zend_unfinished_execution_gc"])(a0, a1, a2);

var _zend_unfinished_execution_gc_ex = Module["_zend_unfinished_execution_gc_ex"] = (a0, a1, a2, a3) => (_zend_unfinished_execution_gc_ex = Module["_zend_unfinished_execution_gc_ex"] = wasmExports["zend_unfinished_execution_gc_ex"])(a0, a1, a2, a3);

var _zend_free_extra_named_params = Module["_zend_free_extra_named_params"] = a0 => (_zend_free_extra_named_params = Module["_zend_free_extra_named_params"] = wasmExports["zend_free_extra_named_params"])(a0);

var _zend_serialize_opcode_handler = Module["_zend_serialize_opcode_handler"] = a0 => (_zend_serialize_opcode_handler = Module["_zend_serialize_opcode_handler"] = wasmExports["zend_serialize_opcode_handler"])(a0);

var _zend_deserialize_opcode_handler = Module["_zend_deserialize_opcode_handler"] = a0 => (_zend_deserialize_opcode_handler = Module["_zend_deserialize_opcode_handler"] = wasmExports["zend_deserialize_opcode_handler"])(a0);

var _zend_get_opcode_handler_func = Module["_zend_get_opcode_handler_func"] = a0 => (_zend_get_opcode_handler_func = Module["_zend_get_opcode_handler_func"] = wasmExports["zend_get_opcode_handler_func"])(a0);

var _zend_get_halt_op = Module["_zend_get_halt_op"] = () => (_zend_get_halt_op = Module["_zend_get_halt_op"] = wasmExports["zend_get_halt_op"])();

var _zend_vm_kind = Module["_zend_vm_kind"] = () => (_zend_vm_kind = Module["_zend_vm_kind"] = wasmExports["zend_vm_kind"])();

var _zend_vm_set_opcode_handler_ex = Module["_zend_vm_set_opcode_handler_ex"] = (a0, a1, a2, a3) => (_zend_vm_set_opcode_handler_ex = Module["_zend_vm_set_opcode_handler_ex"] = wasmExports["zend_vm_set_opcode_handler_ex"])(a0, a1, a2, a3);

var _zend_vm_call_opcode_handler = Module["_zend_vm_call_opcode_handler"] = a0 => (_zend_vm_call_opcode_handler = Module["_zend_vm_call_opcode_handler"] = wasmExports["zend_vm_call_opcode_handler"])(a0);

var _zend_set_user_opcode_handler = Module["_zend_set_user_opcode_handler"] = (a0, a1) => (_zend_set_user_opcode_handler = Module["_zend_set_user_opcode_handler"] = wasmExports["zend_set_user_opcode_handler"])(a0, a1);

var _zend_get_user_opcode_handler = Module["_zend_get_user_opcode_handler"] = a0 => (_zend_get_user_opcode_handler = Module["_zend_get_user_opcode_handler"] = wasmExports["zend_get_user_opcode_handler"])(a0);

var _zend_get_zval_ptr = Module["_zend_get_zval_ptr"] = (a0, a1, a2, a3) => (_zend_get_zval_ptr = Module["_zend_get_zval_ptr"] = wasmExports["zend_get_zval_ptr"])(a0, a1, a2, a3);

var _zend_iterator_unwrap = Module["_zend_iterator_unwrap"] = a0 => (_zend_iterator_unwrap = Module["_zend_iterator_unwrap"] = wasmExports["zend_iterator_unwrap"])(a0);

var _zend_fiber_switch_block = Module["_zend_fiber_switch_block"] = () => (_zend_fiber_switch_block = Module["_zend_fiber_switch_block"] = wasmExports["zend_fiber_switch_block"])();

var _zend_fiber_switch_unblock = Module["_zend_fiber_switch_unblock"] = () => (_zend_fiber_switch_unblock = Module["_zend_fiber_switch_unblock"] = wasmExports["zend_fiber_switch_unblock"])();

var _zend_create_closure = Module["_zend_create_closure"] = (a0, a1, a2, a3, a4) => (_zend_create_closure = Module["_zend_create_closure"] = wasmExports["zend_create_closure"])(a0, a1, a2, a3, a4);

var _zend_is_graceful_exit = Module["_zend_is_graceful_exit"] = a0 => (_zend_is_graceful_exit = Module["_zend_is_graceful_exit"] = wasmExports["zend_is_graceful_exit"])(a0);

var _zend_exception_set_previous = Module["_zend_exception_set_previous"] = (a0, a1) => (_zend_exception_set_previous = Module["_zend_exception_set_previous"] = wasmExports["zend_exception_set_previous"])(a0, a1);

var _zend_generator_close = Module["_zend_generator_close"] = (a0, a1) => (_zend_generator_close = Module["_zend_generator_close"] = wasmExports["zend_generator_close"])(a0, a1);

var _zend_std_unset_static_property = Module["_zend_std_unset_static_property"] = (a0, a1) => (_zend_std_unset_static_property = Module["_zend_std_unset_static_property"] = wasmExports["zend_std_unset_static_property"])(a0, a1);

var _zend_ini_dtor = Module["_zend_ini_dtor"] = a0 => (_zend_ini_dtor = Module["_zend_ini_dtor"] = wasmExports["zend_ini_dtor"])(a0);

var _zend_ini_global_shutdown = Module["_zend_ini_global_shutdown"] = () => (_zend_ini_global_shutdown = Module["_zend_ini_global_shutdown"] = wasmExports["zend_ini_global_shutdown"])();

var _zend_register_ini_entries = Module["_zend_register_ini_entries"] = (a0, a1) => (_zend_register_ini_entries = Module["_zend_register_ini_entries"] = wasmExports["zend_register_ini_entries"])(a0, a1);

var _zend_unregister_ini_entries = Module["_zend_unregister_ini_entries"] = a0 => (_zend_unregister_ini_entries = Module["_zend_unregister_ini_entries"] = wasmExports["zend_unregister_ini_entries"])(a0);

var _zend_ini_register_displayer = Module["_zend_ini_register_displayer"] = (a0, a1, a2) => (_zend_ini_register_displayer = Module["_zend_ini_register_displayer"] = wasmExports["zend_ini_register_displayer"])(a0, a1, a2);

var _zend_ini_str_ex = Module["_zend_ini_str_ex"] = (a0, a1, a2, a3) => (_zend_ini_str_ex = Module["_zend_ini_str_ex"] = wasmExports["zend_ini_str_ex"])(a0, a1, a2, a3);

var _zend_ini_parse_uquantity = Module["_zend_ini_parse_uquantity"] = (a0, a1) => (_zend_ini_parse_uquantity = Module["_zend_ini_parse_uquantity"] = wasmExports["zend_ini_parse_uquantity"])(a0, a1);

var _display_link_numbers = Module["_display_link_numbers"] = (a0, a1) => (_display_link_numbers = Module["_display_link_numbers"] = wasmExports["display_link_numbers"])(a0, a1);

var _OnUpdateStr = Module["_OnUpdateStr"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateStr = Module["_OnUpdateStr"] = wasmExports["OnUpdateStr"])(a0, a1, a2, a3, a4, a5);

var _OnUpdateStrNotEmpty = Module["_OnUpdateStrNotEmpty"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateStrNotEmpty = Module["_OnUpdateStrNotEmpty"] = wasmExports["OnUpdateStrNotEmpty"])(a0, a1, a2, a3, a4, a5);

var _zend_insert_sort = Module["_zend_insert_sort"] = (a0, a1, a2, a3, a4) => (_zend_insert_sort = Module["_zend_insert_sort"] = wasmExports["zend_insert_sort"])(a0, a1, a2, a3, a4);

var _zend_multibyte_set_functions = Module["_zend_multibyte_set_functions"] = a0 => (_zend_multibyte_set_functions = Module["_zend_multibyte_set_functions"] = wasmExports["zend_multibyte_set_functions"])(a0);

var _zend_multibyte_restore_functions = Module["_zend_multibyte_restore_functions"] = () => (_zend_multibyte_restore_functions = Module["_zend_multibyte_restore_functions"] = wasmExports["zend_multibyte_restore_functions"])();

var _zend_multibyte_parse_encoding_list = Module["_zend_multibyte_parse_encoding_list"] = (a0, a1, a2, a3, a4) => (_zend_multibyte_parse_encoding_list = Module["_zend_multibyte_parse_encoding_list"] = wasmExports["zend_multibyte_parse_encoding_list"])(a0, a1, a2, a3, a4);

var _zend_multibyte_get_script_encoding = Module["_zend_multibyte_get_script_encoding"] = () => (_zend_multibyte_get_script_encoding = Module["_zend_multibyte_get_script_encoding"] = wasmExports["zend_multibyte_get_script_encoding"])();

var _zend_multibyte_set_script_encoding = Module["_zend_multibyte_set_script_encoding"] = (a0, a1) => (_zend_multibyte_set_script_encoding = Module["_zend_multibyte_set_script_encoding"] = wasmExports["zend_multibyte_set_script_encoding"])(a0, a1);

var _zend_multibyte_set_internal_encoding = Module["_zend_multibyte_set_internal_encoding"] = a0 => (_zend_multibyte_set_internal_encoding = Module["_zend_multibyte_set_internal_encoding"] = wasmExports["zend_multibyte_set_internal_encoding"])(a0);

var _zend_register_iterator_wrapper = Module["_zend_register_iterator_wrapper"] = () => (_zend_register_iterator_wrapper = Module["_zend_register_iterator_wrapper"] = wasmExports["zend_register_iterator_wrapper"])();

var _zend_user_it_new_iterator = Module["_zend_user_it_new_iterator"] = (a0, a1, a2) => (_zend_user_it_new_iterator = Module["_zend_user_it_new_iterator"] = wasmExports["zend_user_it_new_iterator"])(a0, a1, a2);

var _zend_user_it_valid = Module["_zend_user_it_valid"] = a0 => (_zend_user_it_valid = Module["_zend_user_it_valid"] = wasmExports["zend_user_it_valid"])(a0);

var _zend_user_it_get_current_data = Module["_zend_user_it_get_current_data"] = a0 => (_zend_user_it_get_current_data = Module["_zend_user_it_get_current_data"] = wasmExports["zend_user_it_get_current_data"])(a0);

var _zend_user_it_get_current_key = Module["_zend_user_it_get_current_key"] = (a0, a1) => (_zend_user_it_get_current_key = Module["_zend_user_it_get_current_key"] = wasmExports["zend_user_it_get_current_key"])(a0, a1);

var _zend_user_it_move_forward = Module["_zend_user_it_move_forward"] = a0 => (_zend_user_it_move_forward = Module["_zend_user_it_move_forward"] = wasmExports["zend_user_it_move_forward"])(a0);

var _zend_user_it_rewind = Module["_zend_user_it_rewind"] = a0 => (_zend_user_it_rewind = Module["_zend_user_it_rewind"] = wasmExports["zend_user_it_rewind"])(a0);

var _zend_user_it_get_gc = Module["_zend_user_it_get_gc"] = (a0, a1, a2) => (_zend_user_it_get_gc = Module["_zend_user_it_get_gc"] = wasmExports["zend_user_it_get_gc"])(a0, a1, a2);

var _zend_user_it_get_new_iterator = Module["_zend_user_it_get_new_iterator"] = (a0, a1, a2) => (_zend_user_it_get_new_iterator = Module["_zend_user_it_get_new_iterator"] = wasmExports["zend_user_it_get_new_iterator"])(a0, a1, a2);

var _zend_user_serialize = Module["_zend_user_serialize"] = (a0, a1, a2, a3) => (_zend_user_serialize = Module["_zend_user_serialize"] = wasmExports["zend_user_serialize"])(a0, a1, a2, a3);

var _zend_user_unserialize = Module["_zend_user_unserialize"] = (a0, a1, a2, a3, a4) => (_zend_user_unserialize = Module["_zend_user_unserialize"] = wasmExports["zend_user_unserialize"])(a0, a1, a2, a3, a4);

var _zend_register_interfaces = Module["_zend_register_interfaces"] = () => (_zend_register_interfaces = Module["_zend_register_interfaces"] = wasmExports["zend_register_interfaces"])();

var _zend_get_exception_base = Module["_zend_get_exception_base"] = a0 => (_zend_get_exception_base = Module["_zend_get_exception_base"] = wasmExports["zend_get_exception_base"])(a0);

var _zend_exception_get_default = Module["_zend_exception_get_default"] = () => (_zend_exception_get_default = Module["_zend_exception_get_default"] = wasmExports["zend_exception_get_default"])();

var _zend_get_error_exception = Module["_zend_get_error_exception"] = () => (_zend_get_error_exception = Module["_zend_get_error_exception"] = wasmExports["zend_get_error_exception"])();

var _zend_create_unwind_exit = Module["_zend_create_unwind_exit"] = () => (_zend_create_unwind_exit = Module["_zend_create_unwind_exit"] = wasmExports["zend_create_unwind_exit"])();

var _zend_create_graceful_exit = Module["_zend_create_graceful_exit"] = () => (_zend_create_graceful_exit = Module["_zend_create_graceful_exit"] = wasmExports["zend_create_graceful_exit"])();

var _zend_throw_graceful_exit = Module["_zend_throw_graceful_exit"] = () => (_zend_throw_graceful_exit = Module["_zend_throw_graceful_exit"] = wasmExports["zend_throw_graceful_exit"])();

var _gc_protected = Module["_gc_protected"] = () => (_gc_protected = Module["_gc_protected"] = wasmExports["gc_protected"])();

var _zend_weakrefs_hash_add = Module["_zend_weakrefs_hash_add"] = (a0, a1, a2) => (_zend_weakrefs_hash_add = Module["_zend_weakrefs_hash_add"] = wasmExports["zend_weakrefs_hash_add"])(a0, a1, a2);

var _zend_weakrefs_hash_del = Module["_zend_weakrefs_hash_del"] = (a0, a1) => (_zend_weakrefs_hash_del = Module["_zend_weakrefs_hash_del"] = wasmExports["zend_weakrefs_hash_del"])(a0, a1);

var _zend_weakrefs_notify = Module["_zend_weakrefs_notify"] = a0 => (_zend_weakrefs_notify = Module["_zend_weakrefs_notify"] = wasmExports["zend_weakrefs_notify"])(a0);

var _zend_ensure_fpu_mode = Module["_zend_ensure_fpu_mode"] = () => (_zend_ensure_fpu_mode = Module["_zend_ensure_fpu_mode"] = wasmExports["zend_ensure_fpu_mode"])();

var _zend_interned_string_find_permanent = Module["_zend_interned_string_find_permanent"] = a0 => (_zend_interned_string_find_permanent = Module["_zend_interned_string_find_permanent"] = wasmExports["zend_interned_string_find_permanent"])(a0);

var _zend_interned_strings_set_request_storage_handlers = Module["_zend_interned_strings_set_request_storage_handlers"] = (a0, a1, a2) => (_zend_interned_strings_set_request_storage_handlers = Module["_zend_interned_strings_set_request_storage_handlers"] = wasmExports["zend_interned_strings_set_request_storage_handlers"])(a0, a1, a2);

var _zend_signal_handler_unblock = Module["_zend_signal_handler_unblock"] = () => (_zend_signal_handler_unblock = Module["_zend_signal_handler_unblock"] = wasmExports["zend_signal_handler_unblock"])();

var _sigprocmask = Module["_sigprocmask"] = (a0, a1, a2) => (_sigprocmask = Module["_sigprocmask"] = wasmExports["sigprocmask"])(a0, a1, a2);

var _zend_sigaction = Module["_zend_sigaction"] = (a0, a1, a2) => (_zend_sigaction = Module["_zend_sigaction"] = wasmExports["zend_sigaction"])(a0, a1, a2);

var _sigaction = Module["_sigaction"] = (a0, a1, a2) => (_sigaction = Module["_sigaction"] = wasmExports["sigaction"])(a0, a1, a2);

var _sigemptyset = Module["_sigemptyset"] = a0 => (_sigemptyset = Module["_sigemptyset"] = wasmExports["sigemptyset"])(a0);

var _sigaddset = Module["_sigaddset"] = (a0, a1) => (_sigaddset = Module["_sigaddset"] = wasmExports["sigaddset"])(a0, a1);

var _zend_signal_startup = Module["_zend_signal_startup"] = () => (_zend_signal_startup = Module["_zend_signal_startup"] = wasmExports["zend_signal_startup"])();

var _sigfillset = Module["_sigfillset"] = a0 => (_sigfillset = Module["_sigfillset"] = wasmExports["sigfillset"])(a0);

var _sigdelset = Module["_sigdelset"] = (a0, a1) => (_sigdelset = Module["_sigdelset"] = wasmExports["sigdelset"])(a0, a1);

var _zend_generator_restore_call_stack = Module["_zend_generator_restore_call_stack"] = a0 => (_zend_generator_restore_call_stack = Module["_zend_generator_restore_call_stack"] = wasmExports["zend_generator_restore_call_stack"])(a0);

var _zend_generator_freeze_call_stack = Module["_zend_generator_freeze_call_stack"] = a0 => (_zend_generator_freeze_call_stack = Module["_zend_generator_freeze_call_stack"] = wasmExports["zend_generator_freeze_call_stack"])(a0);

var _zend_generator_resume = Module["_zend_generator_resume"] = a0 => (_zend_generator_resume = Module["_zend_generator_resume"] = wasmExports["zend_generator_resume"])(a0);

var _zend_observer_generator_resume = Module["_zend_observer_generator_resume"] = a0 => (_zend_observer_generator_resume = Module["_zend_observer_generator_resume"] = wasmExports["zend_observer_generator_resume"])(a0);

var _virtual_getcwd_ex = Module["_virtual_getcwd_ex"] = a0 => (_virtual_getcwd_ex = Module["_virtual_getcwd_ex"] = wasmExports["virtual_getcwd_ex"])(a0);

var _virtual_getcwd = Module["_virtual_getcwd"] = (a0, a1) => (_virtual_getcwd = Module["_virtual_getcwd"] = wasmExports["virtual_getcwd"])(a0, a1);

var _realpath_cache_lookup = Module["_realpath_cache_lookup"] = (a0, a1, a2, a3) => (_realpath_cache_lookup = Module["_realpath_cache_lookup"] = wasmExports["realpath_cache_lookup"])(a0, a1, a2, a3);

var _virtual_chdir = Module["_virtual_chdir"] = a0 => (_virtual_chdir = Module["_virtual_chdir"] = wasmExports["virtual_chdir"])(a0);

var _virtual_realpath = Module["_virtual_realpath"] = (a0, a1) => (_virtual_realpath = Module["_virtual_realpath"] = wasmExports["virtual_realpath"])(a0, a1);

var _virtual_filepath_ex = Module["_virtual_filepath_ex"] = (a0, a1, a2) => (_virtual_filepath_ex = Module["_virtual_filepath_ex"] = wasmExports["virtual_filepath_ex"])(a0, a1, a2);

var _virtual_filepath = Module["_virtual_filepath"] = (a0, a1) => (_virtual_filepath = Module["_virtual_filepath"] = wasmExports["virtual_filepath"])(a0, a1);

var _virtual_fopen = Module["_virtual_fopen"] = (a0, a1) => (_virtual_fopen = Module["_virtual_fopen"] = wasmExports["virtual_fopen"])(a0, a1);

var _virtual_access = Module["_virtual_access"] = (a0, a1) => (_virtual_access = Module["_virtual_access"] = wasmExports["virtual_access"])(a0, a1);

var _virtual_utime = Module["_virtual_utime"] = (a0, a1) => (_virtual_utime = Module["_virtual_utime"] = wasmExports["virtual_utime"])(a0, a1);

var _virtual_chmod = Module["_virtual_chmod"] = (a0, a1) => (_virtual_chmod = Module["_virtual_chmod"] = wasmExports["virtual_chmod"])(a0, a1);

var _virtual_chown = Module["_virtual_chown"] = (a0, a1, a2, a3) => (_virtual_chown = Module["_virtual_chown"] = wasmExports["virtual_chown"])(a0, a1, a2, a3);

var _virtual_open = Module["_virtual_open"] = (a0, a1, a2) => (_virtual_open = Module["_virtual_open"] = wasmExports["virtual_open"])(a0, a1, a2);

var _virtual_creat = Module["_virtual_creat"] = (a0, a1) => (_virtual_creat = Module["_virtual_creat"] = wasmExports["virtual_creat"])(a0, a1);

var _creat = Module["_creat"] = (a0, a1) => (_creat = Module["_creat"] = wasmExports["creat"])(a0, a1);

var _virtual_rename = Module["_virtual_rename"] = (a0, a1) => (_virtual_rename = Module["_virtual_rename"] = wasmExports["virtual_rename"])(a0, a1);

var _virtual_stat = Module["_virtual_stat"] = (a0, a1) => (_virtual_stat = Module["_virtual_stat"] = wasmExports["virtual_stat"])(a0, a1);

var _virtual_lstat = Module["_virtual_lstat"] = (a0, a1) => (_virtual_lstat = Module["_virtual_lstat"] = wasmExports["virtual_lstat"])(a0, a1);

var _virtual_unlink = Module["_virtual_unlink"] = a0 => (_virtual_unlink = Module["_virtual_unlink"] = wasmExports["virtual_unlink"])(a0);

var _virtual_mkdir = Module["_virtual_mkdir"] = (a0, a1) => (_virtual_mkdir = Module["_virtual_mkdir"] = wasmExports["virtual_mkdir"])(a0, a1);

var _virtual_rmdir = Module["_virtual_rmdir"] = a0 => (_virtual_rmdir = Module["_virtual_rmdir"] = wasmExports["virtual_rmdir"])(a0);

var _virtual_opendir = Module["_virtual_opendir"] = a0 => (_virtual_opendir = Module["_virtual_opendir"] = wasmExports["virtual_opendir"])(a0);

var _virtual_popen = Module["_virtual_popen"] = (a0, a1) => (_virtual_popen = Module["_virtual_popen"] = wasmExports["virtual_popen"])(a0, a1);

var _zend_ast_evaluate_inner = Module["_zend_ast_evaluate_inner"] = (a0, a1, a2, a3, a4) => (_zend_ast_evaluate_inner = Module["_zend_ast_evaluate_inner"] = wasmExports["zend_ast_evaluate_inner"])(a0, a1, a2, a3, a4);

var _zend_ast_evaluate = Module["_zend_ast_evaluate"] = (a0, a1, a2) => (_zend_ast_evaluate = Module["_zend_ast_evaluate"] = wasmExports["zend_ast_evaluate"])(a0, a1, a2);

var _zend_objects_clone_obj = Module["_zend_objects_clone_obj"] = a0 => (_zend_objects_clone_obj = Module["_zend_objects_clone_obj"] = wasmExports["zend_objects_clone_obj"])(a0);

var _zend_objects_store_put = Module["_zend_objects_store_put"] = a0 => (_zend_objects_store_put = Module["_zend_objects_store_put"] = wasmExports["zend_objects_store_put"])(a0);

var _zend_std_get_gc = Module["_zend_std_get_gc"] = (a0, a1, a2) => (_zend_std_get_gc = Module["_zend_std_get_gc"] = wasmExports["zend_std_get_gc"])(a0, a1, a2);

var _zend_std_get_debug_info = Module["_zend_std_get_debug_info"] = (a0, a1) => (_zend_std_get_debug_info = Module["_zend_std_get_debug_info"] = wasmExports["zend_std_get_debug_info"])(a0, a1);

var _zend_get_property_guard = Module["_zend_get_property_guard"] = (a0, a1) => (_zend_get_property_guard = Module["_zend_get_property_guard"] = wasmExports["zend_get_property_guard"])(a0, a1);

var _zend_std_get_constructor = Module["_zend_std_get_constructor"] = a0 => (_zend_std_get_constructor = Module["_zend_std_get_constructor"] = wasmExports["zend_std_get_constructor"])(a0);

var _zend_std_get_closure = Module["_zend_std_get_closure"] = (a0, a1, a2, a3, a4) => (_zend_std_get_closure = Module["_zend_std_get_closure"] = wasmExports["zend_std_get_closure"])(a0, a1, a2, a3, a4);

var _smart_str_append_escaped_truncated = Module["_smart_str_append_escaped_truncated"] = (a0, a1, a2) => (_smart_str_append_escaped_truncated = Module["_smart_str_append_escaped_truncated"] = wasmExports["smart_str_append_escaped_truncated"])(a0, a1, a2);

var _zend_cpu_supports = Module["_zend_cpu_supports"] = a0 => (_zend_cpu_supports = Module["_zend_cpu_supports"] = wasmExports["zend_cpu_supports"])(a0);

var ___jit_debug_register_code = Module["___jit_debug_register_code"] = () => (___jit_debug_register_code = Module["___jit_debug_register_code"] = wasmExports["__jit_debug_register_code"])();

var _zend_gdb_register_code = Module["_zend_gdb_register_code"] = (a0, a1) => (_zend_gdb_register_code = Module["_zend_gdb_register_code"] = wasmExports["zend_gdb_register_code"])(a0, a1);

var _zend_gdb_unregister_all = Module["_zend_gdb_unregister_all"] = () => (_zend_gdb_unregister_all = Module["_zend_gdb_unregister_all"] = wasmExports["zend_gdb_unregister_all"])();

var _zend_gdb_present = Module["_zend_gdb_present"] = () => (_zend_gdb_present = Module["_zend_gdb_present"] = wasmExports["zend_gdb_present"])();

var _zend_observer_fcall_register = Module["_zend_observer_fcall_register"] = a0 => (_zend_observer_fcall_register = Module["_zend_observer_fcall_register"] = wasmExports["zend_observer_fcall_register"])(a0);

var _zend_observer_add_begin_handler = Module["_zend_observer_add_begin_handler"] = (a0, a1) => (_zend_observer_add_begin_handler = Module["_zend_observer_add_begin_handler"] = wasmExports["zend_observer_add_begin_handler"])(a0, a1);

var _zend_observer_remove_begin_handler = Module["_zend_observer_remove_begin_handler"] = (a0, a1) => (_zend_observer_remove_begin_handler = Module["_zend_observer_remove_begin_handler"] = wasmExports["zend_observer_remove_begin_handler"])(a0, a1);

var _zend_observer_add_end_handler = Module["_zend_observer_add_end_handler"] = (a0, a1) => (_zend_observer_add_end_handler = Module["_zend_observer_add_end_handler"] = wasmExports["zend_observer_add_end_handler"])(a0, a1);

var _zend_observer_remove_end_handler = Module["_zend_observer_remove_end_handler"] = (a0, a1) => (_zend_observer_remove_end_handler = Module["_zend_observer_remove_end_handler"] = wasmExports["zend_observer_remove_end_handler"])(a0, a1);

var _zend_observer_function_declared_register = Module["_zend_observer_function_declared_register"] = a0 => (_zend_observer_function_declared_register = Module["_zend_observer_function_declared_register"] = wasmExports["zend_observer_function_declared_register"])(a0);

var _zend_observer_class_linked_register = Module["_zend_observer_class_linked_register"] = a0 => (_zend_observer_class_linked_register = Module["_zend_observer_class_linked_register"] = wasmExports["zend_observer_class_linked_register"])(a0);

var _zend_observer_error_register = Module["_zend_observer_error_register"] = a0 => (_zend_observer_error_register = Module["_zend_observer_error_register"] = wasmExports["zend_observer_error_register"])(a0);

var _zend_observer_fiber_init_register = Module["_zend_observer_fiber_init_register"] = a0 => (_zend_observer_fiber_init_register = Module["_zend_observer_fiber_init_register"] = wasmExports["zend_observer_fiber_init_register"])(a0);

var _zend_observer_fiber_switch_register = Module["_zend_observer_fiber_switch_register"] = a0 => (_zend_observer_fiber_switch_register = Module["_zend_observer_fiber_switch_register"] = wasmExports["zend_observer_fiber_switch_register"])(a0);

var _zend_observer_fiber_destroy_register = Module["_zend_observer_fiber_destroy_register"] = a0 => (_zend_observer_fiber_destroy_register = Module["_zend_observer_fiber_destroy_register"] = wasmExports["zend_observer_fiber_destroy_register"])(a0);

var _zend_observer_fiber_init_notify = Module["_zend_observer_fiber_init_notify"] = a0 => (_zend_observer_fiber_init_notify = Module["_zend_observer_fiber_init_notify"] = wasmExports["zend_observer_fiber_init_notify"])(a0);

var _zend_observer_fiber_switch_notify = Module["_zend_observer_fiber_switch_notify"] = (a0, a1) => (_zend_observer_fiber_switch_notify = Module["_zend_observer_fiber_switch_notify"] = wasmExports["zend_observer_fiber_switch_notify"])(a0, a1);

var _zend_observer_fiber_destroy_notify = Module["_zend_observer_fiber_destroy_notify"] = a0 => (_zend_observer_fiber_destroy_notify = Module["_zend_observer_fiber_destroy_notify"] = wasmExports["zend_observer_fiber_destroy_notify"])(a0);

var _zend_enum_get_case_by_value = Module["_zend_enum_get_case_by_value"] = (a0, a1, a2, a3, a4) => (_zend_enum_get_case_by_value = Module["_zend_enum_get_case_by_value"] = wasmExports["zend_enum_get_case_by_value"])(a0, a1, a2, a3, a4);

var _zend_enum_add_case = Module["_zend_enum_add_case"] = (a0, a1, a2) => (_zend_enum_add_case = Module["_zend_enum_add_case"] = wasmExports["zend_enum_add_case"])(a0, a1, a2);

var _zend_enum_get_case = Module["_zend_enum_get_case"] = (a0, a1) => (_zend_enum_get_case = Module["_zend_enum_get_case"] = wasmExports["zend_enum_get_case"])(a0, a1);

var _zend_enum_get_case_cstr = Module["_zend_enum_get_case_cstr"] = (a0, a1) => (_zend_enum_get_case_cstr = Module["_zend_enum_get_case_cstr"] = wasmExports["zend_enum_get_case_cstr"])(a0, a1);

var _zend_fiber_stack_limit = Module["_zend_fiber_stack_limit"] = a0 => (_zend_fiber_stack_limit = Module["_zend_fiber_stack_limit"] = wasmExports["zend_fiber_stack_limit"])(a0);

var _zend_fiber_stack_base = Module["_zend_fiber_stack_base"] = a0 => (_zend_fiber_stack_base = Module["_zend_fiber_stack_base"] = wasmExports["zend_fiber_stack_base"])(a0);

var _zend_fiber_switch_blocked = Module["_zend_fiber_switch_blocked"] = () => (_zend_fiber_switch_blocked = Module["_zend_fiber_switch_blocked"] = wasmExports["zend_fiber_switch_blocked"])();

var _zend_fiber_init_context = Module["_zend_fiber_init_context"] = (a0, a1, a2, a3) => (_zend_fiber_init_context = Module["_zend_fiber_init_context"] = wasmExports["zend_fiber_init_context"])(a0, a1, a2, a3);

var _zend_fiber_destroy_context = Module["_zend_fiber_destroy_context"] = a0 => (_zend_fiber_destroy_context = Module["_zend_fiber_destroy_context"] = wasmExports["zend_fiber_destroy_context"])(a0);

var _zend_fiber_switch_context = Module["_zend_fiber_switch_context"] = a0 => (_zend_fiber_switch_context = Module["_zend_fiber_switch_context"] = wasmExports["zend_fiber_switch_context"])(a0);

var _mprotect = Module["_mprotect"] = (a0, a1, a2) => (_mprotect = Module["_mprotect"] = wasmExports["mprotect"])(a0, a1, a2);

var _zend_atomic_bool_init = Module["_zend_atomic_bool_init"] = (a0, a1) => (_zend_atomic_bool_init = Module["_zend_atomic_bool_init"] = wasmExports["zend_atomic_bool_init"])(a0, a1);

var _zend_atomic_bool_exchange = Module["_zend_atomic_bool_exchange"] = (a0, a1) => (_zend_atomic_bool_exchange = Module["_zend_atomic_bool_exchange"] = wasmExports["zend_atomic_bool_exchange"])(a0, a1);

var _zend_atomic_bool_store = Module["_zend_atomic_bool_store"] = (a0, a1) => (_zend_atomic_bool_store = Module["_zend_atomic_bool_store"] = wasmExports["zend_atomic_bool_store"])(a0, a1);

var _zend_atomic_bool_load = Module["_zend_atomic_bool_load"] = a0 => (_zend_atomic_bool_load = Module["_zend_atomic_bool_load"] = wasmExports["zend_atomic_bool_load"])(a0);

var _zend_optimize_script = Module["_zend_optimize_script"] = (a0, a1, a2) => (_zend_optimize_script = Module["_zend_optimize_script"] = wasmExports["zend_optimize_script"])(a0, a1, a2);

var _zend_build_call_graph = Module["_zend_build_call_graph"] = (a0, a1, a2) => (_zend_build_call_graph = Module["_zend_build_call_graph"] = wasmExports["zend_build_call_graph"])(a0, a1, a2);

var _zend_analyze_call_graph = Module["_zend_analyze_call_graph"] = (a0, a1, a2) => (_zend_analyze_call_graph = Module["_zend_analyze_call_graph"] = wasmExports["zend_analyze_call_graph"])(a0, a1, a2);

var _zend_build_call_map = Module["_zend_build_call_map"] = (a0, a1, a2) => (_zend_build_call_map = Module["_zend_build_call_map"] = wasmExports["zend_build_call_map"])(a0, a1, a2);

var _zend_init_func_return_info = Module["_zend_init_func_return_info"] = (a0, a1, a2) => (_zend_init_func_return_info = Module["_zend_init_func_return_info"] = wasmExports["zend_init_func_return_info"])(a0, a1, a2);

var _zend_dump_op_array = Module["_zend_dump_op_array"] = (a0, a1, a2, a3) => (_zend_dump_op_array = Module["_zend_dump_op_array"] = wasmExports["zend_dump_op_array"])(a0, a1, a2, a3);

var _zend_optimizer_register_pass = Module["_zend_optimizer_register_pass"] = a0 => (_zend_optimizer_register_pass = Module["_zend_optimizer_register_pass"] = wasmExports["zend_optimizer_register_pass"])(a0);

var _zend_optimizer_unregister_pass = Module["_zend_optimizer_unregister_pass"] = a0 => (_zend_optimizer_unregister_pass = Module["_zend_optimizer_unregister_pass"] = wasmExports["zend_optimizer_unregister_pass"])(a0);

var _zend_array_type_info = Module["_zend_array_type_info"] = a0 => (_zend_array_type_info = Module["_zend_array_type_info"] = wasmExports["zend_array_type_info"])(a0);

var _zend_build_cfg = Module["_zend_build_cfg"] = (a0, a1, a2, a3) => (_zend_build_cfg = Module["_zend_build_cfg"] = wasmExports["zend_build_cfg"])(a0, a1, a2, a3);

var _zend_cfg_build_predecessors = Module["_zend_cfg_build_predecessors"] = (a0, a1) => (_zend_cfg_build_predecessors = Module["_zend_cfg_build_predecessors"] = wasmExports["zend_cfg_build_predecessors"])(a0, a1);

var _zend_cfg_compute_dominators_tree = Module["_zend_cfg_compute_dominators_tree"] = (a0, a1) => (_zend_cfg_compute_dominators_tree = Module["_zend_cfg_compute_dominators_tree"] = wasmExports["zend_cfg_compute_dominators_tree"])(a0, a1);

var _zend_cfg_identify_loops = Module["_zend_cfg_identify_loops"] = (a0, a1) => (_zend_cfg_identify_loops = Module["_zend_cfg_identify_loops"] = wasmExports["zend_cfg_identify_loops"])(a0, a1);

var _zend_dfg_add_use_def_op = Module["_zend_dfg_add_use_def_op"] = (a0, a1, a2, a3, a4) => (_zend_dfg_add_use_def_op = Module["_zend_dfg_add_use_def_op"] = wasmExports["zend_dfg_add_use_def_op"])(a0, a1, a2, a3, a4);

var _zend_build_ssa = Module["_zend_build_ssa"] = (a0, a1, a2, a3, a4) => (_zend_build_ssa = Module["_zend_build_ssa"] = wasmExports["zend_build_ssa"])(a0, a1, a2, a3, a4);

var _zend_ssa_compute_use_def_chains = Module["_zend_ssa_compute_use_def_chains"] = (a0, a1, a2) => (_zend_ssa_compute_use_def_chains = Module["_zend_ssa_compute_use_def_chains"] = wasmExports["zend_ssa_compute_use_def_chains"])(a0, a1, a2);

var _zend_ssa_find_false_dependencies = Module["_zend_ssa_find_false_dependencies"] = (a0, a1) => (_zend_ssa_find_false_dependencies = Module["_zend_ssa_find_false_dependencies"] = wasmExports["zend_ssa_find_false_dependencies"])(a0, a1);

var _zend_ssa_find_sccs = Module["_zend_ssa_find_sccs"] = (a0, a1) => (_zend_ssa_find_sccs = Module["_zend_ssa_find_sccs"] = wasmExports["zend_ssa_find_sccs"])(a0, a1);

var _zend_ssa_inference = Module["_zend_ssa_inference"] = (a0, a1, a2, a3, a4) => (_zend_ssa_inference = Module["_zend_ssa_inference"] = wasmExports["zend_ssa_inference"])(a0, a1, a2, a3, a4);

var _zend_may_throw = Module["_zend_may_throw"] = (a0, a1, a2, a3) => (_zend_may_throw = Module["_zend_may_throw"] = wasmExports["zend_may_throw"])(a0, a1, a2, a3);

var _zend_ssa_rename_op = Module["_zend_ssa_rename_op"] = (a0, a1, a2, a3, a4, a5, a6) => (_zend_ssa_rename_op = Module["_zend_ssa_rename_op"] = wasmExports["zend_ssa_rename_op"])(a0, a1, a2, a3, a4, a5, a6);

var _zend_inference_propagate_range = Module["_zend_inference_propagate_range"] = (a0, a1, a2, a3, a4, a5) => (_zend_inference_propagate_range = Module["_zend_inference_propagate_range"] = wasmExports["zend_inference_propagate_range"])(a0, a1, a2, a3, a4, a5);

var _zend_array_element_type = Module["_zend_array_element_type"] = (a0, a1, a2, a3) => (_zend_array_element_type = Module["_zend_array_element_type"] = wasmExports["zend_array_element_type"])(a0, a1, a2, a3);

var _zend_fetch_arg_info_type = Module["_zend_fetch_arg_info_type"] = (a0, a1, a2) => (_zend_fetch_arg_info_type = Module["_zend_fetch_arg_info_type"] = wasmExports["zend_fetch_arg_info_type"])(a0, a1, a2);

var _zend_update_type_info = Module["_zend_update_type_info"] = (a0, a1, a2, a3, a4, a5, a6) => (_zend_update_type_info = Module["_zend_update_type_info"] = wasmExports["zend_update_type_info"])(a0, a1, a2, a3, a4, a5, a6);

var _zend_may_throw_ex = Module["_zend_may_throw_ex"] = (a0, a1, a2, a3, a4, a5) => (_zend_may_throw_ex = Module["_zend_may_throw_ex"] = wasmExports["zend_may_throw_ex"])(a0, a1, a2, a3, a4, a5);

var _zend_get_func_info = Module["_zend_get_func_info"] = (a0, a1, a2, a3) => (_zend_get_func_info = Module["_zend_get_func_info"] = wasmExports["zend_get_func_info"])(a0, a1, a2, a3);

var _zend_analyze_calls = Module["_zend_analyze_calls"] = (a0, a1, a2, a3, a4) => (_zend_analyze_calls = Module["_zend_analyze_calls"] = wasmExports["zend_analyze_calls"])(a0, a1, a2, a3, a4);

var _zend_dump_var = Module["_zend_dump_var"] = (a0, a1, a2) => (_zend_dump_var = Module["_zend_dump_var"] = wasmExports["zend_dump_var"])(a0, a1, a2);

var _zend_dump_ssa_var = Module["_zend_dump_ssa_var"] = (a0, a1, a2, a3, a4, a5) => (_zend_dump_ssa_var = Module["_zend_dump_ssa_var"] = wasmExports["zend_dump_ssa_var"])(a0, a1, a2, a3, a4, a5);

var _zend_dump_op = Module["_zend_dump_op"] = (a0, a1, a2, a3, a4, a5) => (_zend_dump_op = Module["_zend_dump_op"] = wasmExports["zend_dump_op"])(a0, a1, a2, a3, a4, a5);

var _zend_dump_op_line = Module["_zend_dump_op_line"] = (a0, a1, a2, a3, a4) => (_zend_dump_op_line = Module["_zend_dump_op_line"] = wasmExports["zend_dump_op_line"])(a0, a1, a2, a3, a4);

var _signal = Module["_signal"] = (a0, a1) => (_signal = Module["_signal"] = wasmExports["signal"])(a0, a1);

var __zip_add_entry = Module["__zip_add_entry"] = a0 => (__zip_add_entry = Module["__zip_add_entry"] = wasmExports["_zip_add_entry"])(a0);

var __zip_buffer_data = Module["__zip_buffer_data"] = a0 => (__zip_buffer_data = Module["__zip_buffer_data"] = wasmExports["_zip_buffer_data"])(a0);

var __zip_buffer_free = Module["__zip_buffer_free"] = a0 => (__zip_buffer_free = Module["__zip_buffer_free"] = wasmExports["_zip_buffer_free"])(a0);

var __zip_buffer_eof = Module["__zip_buffer_eof"] = a0 => (__zip_buffer_eof = Module["__zip_buffer_eof"] = wasmExports["_zip_buffer_eof"])(a0);

var __zip_buffer_get = Module["__zip_buffer_get"] = (a0, a1, a2) => (__zip_buffer_get = Module["__zip_buffer_get"] = wasmExports["_zip_buffer_get"])(a0, a1, a2);

var __zip_buffer_peek = Module["__zip_buffer_peek"] = (a0, a1, a2) => (__zip_buffer_peek = Module["__zip_buffer_peek"] = wasmExports["_zip_buffer_peek"])(a0, a1, a2);

var __zip_buffer_get_16 = Module["__zip_buffer_get_16"] = a0 => (__zip_buffer_get_16 = Module["__zip_buffer_get_16"] = wasmExports["_zip_buffer_get_16"])(a0);

var __zip_buffer_get_32 = Module["__zip_buffer_get_32"] = a0 => (__zip_buffer_get_32 = Module["__zip_buffer_get_32"] = wasmExports["_zip_buffer_get_32"])(a0);

var __zip_buffer_get_64 = Module["__zip_buffer_get_64"] = a0 => (__zip_buffer_get_64 = Module["__zip_buffer_get_64"] = wasmExports["_zip_buffer_get_64"])(a0);

var __zip_buffer_get_8 = Module["__zip_buffer_get_8"] = a0 => (__zip_buffer_get_8 = Module["__zip_buffer_get_8"] = wasmExports["_zip_buffer_get_8"])(a0);

var __zip_buffer_left = Module["__zip_buffer_left"] = a0 => (__zip_buffer_left = Module["__zip_buffer_left"] = wasmExports["_zip_buffer_left"])(a0);

var __zip_buffer_read = Module["__zip_buffer_read"] = (a0, a1, a2, a3) => (__zip_buffer_read = Module["__zip_buffer_read"] = wasmExports["_zip_buffer_read"])(a0, a1, a2, a3);

var __zip_buffer_new = Module["__zip_buffer_new"] = (a0, a1, a2) => (__zip_buffer_new = Module["__zip_buffer_new"] = wasmExports["_zip_buffer_new"])(a0, a1, a2);

var __zip_buffer_new_from_source = Module["__zip_buffer_new_from_source"] = (a0, a1, a2, a3, a4) => (__zip_buffer_new_from_source = Module["__zip_buffer_new_from_source"] = wasmExports["_zip_buffer_new_from_source"])(a0, a1, a2, a3, a4);

var __zip_buffer_offset = Module["__zip_buffer_offset"] = a0 => (__zip_buffer_offset = Module["__zip_buffer_offset"] = wasmExports["_zip_buffer_offset"])(a0);

var __zip_buffer_ok = Module["__zip_buffer_ok"] = a0 => (__zip_buffer_ok = Module["__zip_buffer_ok"] = wasmExports["_zip_buffer_ok"])(a0);

var __zip_buffer_put = Module["__zip_buffer_put"] = (a0, a1, a2) => (__zip_buffer_put = Module["__zip_buffer_put"] = wasmExports["_zip_buffer_put"])(a0, a1, a2);

var __zip_buffer_put_16 = Module["__zip_buffer_put_16"] = (a0, a1) => (__zip_buffer_put_16 = Module["__zip_buffer_put_16"] = wasmExports["_zip_buffer_put_16"])(a0, a1);

var __zip_buffer_put_32 = Module["__zip_buffer_put_32"] = (a0, a1) => (__zip_buffer_put_32 = Module["__zip_buffer_put_32"] = wasmExports["_zip_buffer_put_32"])(a0, a1);

var __zip_buffer_put_64 = Module["__zip_buffer_put_64"] = (a0, a1, a2) => (__zip_buffer_put_64 = Module["__zip_buffer_put_64"] = wasmExports["_zip_buffer_put_64"])(a0, a1, a2);

var __zip_buffer_put_8 = Module["__zip_buffer_put_8"] = (a0, a1) => (__zip_buffer_put_8 = Module["__zip_buffer_put_8"] = wasmExports["_zip_buffer_put_8"])(a0, a1);

var __zip_buffer_set_offset = Module["__zip_buffer_set_offset"] = (a0, a1, a2) => (__zip_buffer_set_offset = Module["__zip_buffer_set_offset"] = wasmExports["_zip_buffer_set_offset"])(a0, a1, a2);

var __zip_buffer_skip = Module["__zip_buffer_skip"] = (a0, a1, a2) => (__zip_buffer_skip = Module["__zip_buffer_skip"] = wasmExports["_zip_buffer_skip"])(a0, a1, a2);

var __zip_buffer_size = Module["__zip_buffer_size"] = a0 => (__zip_buffer_size = Module["__zip_buffer_size"] = wasmExports["_zip_buffer_size"])(a0);

var __zip_changed = Module["__zip_changed"] = (a0, a1) => (__zip_changed = Module["__zip_changed"] = wasmExports["_zip_changed"])(a0, a1);

var _zip_source_remove = Module["_zip_source_remove"] = a0 => (_zip_source_remove = Module["_zip_source_remove"] = wasmExports["zip_source_remove"])(a0);

var _zip_source_error = Module["_zip_source_error"] = a0 => (_zip_source_error = Module["_zip_source_error"] = wasmExports["zip_source_error"])(a0);

var _zip_error_set_from_source = Module["_zip_error_set_from_source"] = (a0, a1) => (_zip_error_set_from_source = Module["_zip_error_set_from_source"] = wasmExports["zip_error_set_from_source"])(a0, a1);

var _zip_source_supports = Module["_zip_source_supports"] = a0 => (_zip_source_supports = Module["_zip_source_supports"] = wasmExports["zip_source_supports"])(a0);

var __zip_file_get_end = Module["__zip_file_get_end"] = (a0, a1, a2, a3) => (__zip_file_get_end = Module["__zip_file_get_end"] = wasmExports["_zip_file_get_end"])(a0, a1, a2, a3);

var _zip_source_begin_write_cloning = Module["_zip_source_begin_write_cloning"] = (a0, a1, a2) => (_zip_source_begin_write_cloning = Module["_zip_source_begin_write_cloning"] = wasmExports["zip_source_begin_write_cloning"])(a0, a1, a2);

var _zip_source_begin_write = Module["_zip_source_begin_write"] = a0 => (_zip_source_begin_write = Module["_zip_source_begin_write"] = wasmExports["zip_source_begin_write"])(a0);

var __zip_progress_start = Module["__zip_progress_start"] = a0 => (__zip_progress_start = Module["__zip_progress_start"] = wasmExports["_zip_progress_start"])(a0);

var _zip_source_rollback_write = Module["_zip_source_rollback_write"] = a0 => (_zip_source_rollback_write = Module["_zip_source_rollback_write"] = wasmExports["zip_source_rollback_write"])(a0);

var __zip_progress_subrange = Module["__zip_progress_subrange"] = (a0, a1, a2) => (__zip_progress_subrange = Module["__zip_progress_subrange"] = wasmExports["_zip_progress_subrange"])(a0, a1, a2);

var __zip_dirent_clone = Module["__zip_dirent_clone"] = a0 => (__zip_dirent_clone = Module["__zip_dirent_clone"] = wasmExports["_zip_dirent_clone"])(a0);

var __zip_read_local_ef = Module["__zip_read_local_ef"] = (a0, a1, a2) => (__zip_read_local_ef = Module["__zip_read_local_ef"] = wasmExports["_zip_read_local_ef"])(a0, a1, a2);

var _zip_dirent_torrentzip_normalize = Module["_zip_dirent_torrentzip_normalize"] = a0 => (_zip_dirent_torrentzip_normalize = Module["_zip_dirent_torrentzip_normalize"] = wasmExports["zip_dirent_torrentzip_normalize"])(a0);

var _zip_source_tell_write = Module["_zip_source_tell_write"] = a0 => (_zip_source_tell_write = Module["_zip_source_tell_write"] = wasmExports["zip_source_tell_write"])(a0);

var _zip_source_zip_file_create = Module["_zip_source_zip_file_create"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_zip_source_zip_file_create = Module["_zip_source_zip_file_create"] = wasmExports["zip_source_zip_file_create"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var __zip_dirent_write = Module["__zip_dirent_write"] = (a0, a1, a2) => (__zip_dirent_write = Module["__zip_dirent_write"] = wasmExports["_zip_dirent_write"])(a0, a1, a2);

var __zip_file_get_offset = Module["__zip_file_get_offset"] = (a0, a1, a2, a3) => (__zip_file_get_offset = Module["__zip_file_get_offset"] = wasmExports["_zip_file_get_offset"])(a0, a1, a2, a3);

var _zip_source_seek = Module["_zip_source_seek"] = (a0, a1, a2, a3) => (_zip_source_seek = Module["_zip_source_seek"] = wasmExports["zip_source_seek"])(a0, a1, a2, a3);

var __zip_dirent_needs_zip64 = Module["__zip_dirent_needs_zip64"] = (a0, a1) => (__zip_dirent_needs_zip64 = Module["__zip_dirent_needs_zip64"] = wasmExports["_zip_dirent_needs_zip64"])(a0, a1);

var _zip_source_commit_write = Module["_zip_source_commit_write"] = a0 => (_zip_source_commit_write = Module["_zip_source_commit_write"] = wasmExports["zip_source_commit_write"])(a0);

var __zip_progress_end = Module["__zip_progress_end"] = a0 => (__zip_progress_end = Module["__zip_progress_end"] = wasmExports["_zip_progress_end"])(a0);

var _zip_source_stat = Module["_zip_source_stat"] = (a0, a1) => (_zip_source_stat = Module["_zip_source_stat"] = wasmExports["zip_source_stat"])(a0, a1);

var __zip_get_compression_algorithm = Module["__zip_get_compression_algorithm"] = (a0, a1) => (__zip_get_compression_algorithm = Module["__zip_get_compression_algorithm"] = wasmExports["_zip_get_compression_algorithm"])(a0, a1);

var _zip_source_keep = Module["_zip_source_keep"] = a0 => (_zip_source_keep = Module["_zip_source_keep"] = wasmExports["zip_source_keep"])(a0);

var __zip_get_encryption_implementation = Module["__zip_get_encryption_implementation"] = (a0, a1) => (__zip_get_encryption_implementation = Module["__zip_get_encryption_implementation"] = wasmExports["_zip_get_encryption_implementation"])(a0, a1);

var _zip_source_decompress = Module["_zip_source_decompress"] = (a0, a1, a2) => (_zip_source_decompress = Module["_zip_source_decompress"] = wasmExports["zip_source_decompress"])(a0, a1, a2);

var _zip_source_crc_create = Module["_zip_source_crc_create"] = (a0, a1, a2) => (_zip_source_crc_create = Module["_zip_source_crc_create"] = wasmExports["zip_source_crc_create"])(a0, a1, a2);

var _zip_source_compress = Module["_zip_source_compress"] = (a0, a1, a2, a3) => (_zip_source_compress = Module["_zip_source_compress"] = wasmExports["zip_source_compress"])(a0, a1, a2, a3);

var _zip_stat_init = Module["_zip_stat_init"] = a0 => (_zip_stat_init = Module["_zip_stat_init"] = wasmExports["zip_stat_init"])(a0);

var __zip_source_window_new = Module["__zip_source_window_new"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) => (__zip_source_window_new = Module["__zip_source_window_new"] = wasmExports["_zip_source_window_new"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);

var _zip_source_get_file_attributes = Module["_zip_source_get_file_attributes"] = (a0, a1) => (_zip_source_get_file_attributes = Module["_zip_source_get_file_attributes"] = wasmExports["zip_source_get_file_attributes"])(a0, a1);

var _zip_source_seek_write = Module["_zip_source_seek_write"] = (a0, a1, a2, a3) => (_zip_source_seek_write = Module["_zip_source_seek_write"] = wasmExports["zip_source_seek_write"])(a0, a1, a2, a3);

var __zip_dirent_apply_attributes = Module["__zip_dirent_apply_attributes"] = (a0, a1, a2, a3) => (__zip_dirent_apply_attributes = Module["__zip_dirent_apply_attributes"] = wasmExports["_zip_dirent_apply_attributes"])(a0, a1, a2, a3);

var _zip_source_open = Module["_zip_source_open"] = a0 => (_zip_source_open = Module["_zip_source_open"] = wasmExports["zip_source_open"])(a0);

var _zip_source_read = Module["_zip_source_read"] = (a0, a1, a2, a3) => (_zip_source_read = Module["_zip_source_read"] = wasmExports["zip_source_read"])(a0, a1, a2, a3);

var __zip_write = Module["__zip_write"] = (a0, a1, a2, a3) => (__zip_write = Module["__zip_write"] = wasmExports["_zip_write"])(a0, a1, a2, a3);

var __zip_progress_update = Module["__zip_progress_update"] = (a0, a1) => (__zip_progress_update = Module["__zip_progress_update"] = wasmExports["_zip_progress_update"])(a0, a1);

var _zip_source_close = Module["_zip_source_close"] = a0 => (_zip_source_close = Module["_zip_source_close"] = wasmExports["zip_source_close"])(a0);

var __zip_read = Module["__zip_read"] = (a0, a1, a2, a3, a4) => (__zip_read = Module["__zip_read"] = wasmExports["_zip_read"])(a0, a1, a2, a3, a4);

var __zip_cdir_write = Module["__zip_cdir_write"] = (a0, a1, a2, a3) => (__zip_cdir_write = Module["__zip_cdir_write"] = wasmExports["_zip_cdir_write"])(a0, a1, a2, a3);

var __zip_get_name = Module["__zip_get_name"] = (a0, a1, a2, a3, a4) => (__zip_get_name = Module["__zip_get_name"] = wasmExports["_zip_get_name"])(a0, a1, a2, a3, a4);

var __zip_hash_delete = Module["__zip_hash_delete"] = (a0, a1, a2) => (__zip_hash_delete = Module["__zip_hash_delete"] = wasmExports["_zip_hash_delete"])(a0, a1, a2);

var __zip_unchange = Module["__zip_unchange"] = (a0, a1, a2, a3) => (__zip_unchange = Module["__zip_unchange"] = wasmExports["_zip_unchange"])(a0, a1, a2, a3);

var __zip_file_replace = Module["__zip_file_replace"] = (a0, a1, a2, a3, a4, a5) => (__zip_file_replace = Module["__zip_file_replace"] = wasmExports["_zip_file_replace"])(a0, a1, a2, a3, a4, a5);

var __zip_cdir_free = Module["__zip_cdir_free"] = a0 => (__zip_cdir_free = Module["__zip_cdir_free"] = wasmExports["_zip_cdir_free"])(a0);

var __zip_cdir_new = Module["__zip_cdir_new"] = (a0, a1, a2) => (__zip_cdir_new = Module["__zip_cdir_new"] = wasmExports["_zip_cdir_new"])(a0, a1, a2);

var __zip_cdir_grow = Module["__zip_cdir_grow"] = (a0, a1, a2, a3) => (__zip_cdir_grow = Module["__zip_cdir_grow"] = wasmExports["_zip_cdir_grow"])(a0, a1, a2, a3);

var __zip_entry_finalize = Module["__zip_entry_finalize"] = a0 => (__zip_entry_finalize = Module["__zip_entry_finalize"] = wasmExports["_zip_entry_finalize"])(a0);

var __zip_string_free = Module["__zip_string_free"] = a0 => (__zip_string_free = Module["__zip_string_free"] = wasmExports["_zip_string_free"])(a0);

var __zip_entry_init = Module["__zip_entry_init"] = a0 => (__zip_entry_init = Module["__zip_entry_init"] = wasmExports["_zip_entry_init"])(a0);

var __zip_dirent_init = Module["__zip_dirent_init"] = a0 => (__zip_dirent_init = Module["__zip_dirent_init"] = wasmExports["_zip_dirent_init"])(a0);

var __zip_dirent_finalize = Module["__zip_dirent_finalize"] = a0 => (__zip_dirent_finalize = Module["__zip_dirent_finalize"] = wasmExports["_zip_dirent_finalize"])(a0);

var __zip_ef_free = Module["__zip_ef_free"] = a0 => (__zip_ef_free = Module["__zip_ef_free"] = wasmExports["_zip_ef_free"])(a0);

var __zip_dirent_free = Module["__zip_dirent_free"] = a0 => (__zip_dirent_free = Module["__zip_dirent_free"] = wasmExports["_zip_dirent_free"])(a0);

var __zip_dirent_new = Module["__zip_dirent_new"] = () => (__zip_dirent_new = Module["__zip_dirent_new"] = wasmExports["_zip_dirent_new"])();

var __zip_dirent_read = Module["__zip_dirent_read"] = (a0, a1, a2, a3, a4) => (__zip_dirent_read = Module["__zip_dirent_read"] = wasmExports["_zip_dirent_read"])(a0, a1, a2, a3, a4);

var __zip_d2u_time = Module["__zip_d2u_time"] = (a0, a1) => (__zip_d2u_time = Module["__zip_d2u_time"] = wasmExports["_zip_d2u_time"])(a0, a1);

var __zip_read_string = Module["__zip_read_string"] = (a0, a1, a2, a3, a4) => (__zip_read_string = Module["__zip_read_string"] = wasmExports["_zip_read_string"])(a0, a1, a2, a3, a4);

var __zip_guess_encoding = Module["__zip_guess_encoding"] = (a0, a1) => (__zip_guess_encoding = Module["__zip_guess_encoding"] = wasmExports["_zip_guess_encoding"])(a0, a1);

var __zip_read_data = Module["__zip_read_data"] = (a0, a1, a2, a3, a4) => (__zip_read_data = Module["__zip_read_data"] = wasmExports["_zip_read_data"])(a0, a1, a2, a3, a4);

var __zip_ef_parse = Module["__zip_ef_parse"] = (a0, a1, a2, a3, a4) => (__zip_ef_parse = Module["__zip_ef_parse"] = wasmExports["_zip_ef_parse"])(a0, a1, a2, a3, a4);

var __zip_ef_get_by_id = Module["__zip_ef_get_by_id"] = (a0, a1, a2, a3, a4, a5) => (__zip_ef_get_by_id = Module["__zip_ef_get_by_id"] = wasmExports["_zip_ef_get_by_id"])(a0, a1, a2, a3, a4, a5);

var _zip_dirent_process_ef_zip64 = Module["_zip_dirent_process_ef_zip64"] = (a0, a1, a2, a3, a4, a5) => (_zip_dirent_process_ef_zip64 = Module["_zip_dirent_process_ef_zip64"] = wasmExports["zip_dirent_process_ef_zip64"])(a0, a1, a2, a3, a4, a5);

var __zip_ef_remove_internal = Module["__zip_ef_remove_internal"] = a0 => (__zip_ef_remove_internal = Module["__zip_ef_remove_internal"] = wasmExports["_zip_ef_remove_internal"])(a0);

var __zip_dirent_size = Module["__zip_dirent_size"] = (a0, a1, a2) => (__zip_dirent_size = Module["__zip_dirent_size"] = wasmExports["_zip_dirent_size"])(a0, a1, a2);

var __zip_ef_new = Module["__zip_ef_new"] = (a0, a1, a2, a3) => (__zip_ef_new = Module["__zip_ef_new"] = wasmExports["_zip_ef_new"])(a0, a1, a2, a3);

var __zip_u2d_time = Module["__zip_u2d_time"] = (a0, a1, a2, a3) => (__zip_u2d_time = Module["__zip_u2d_time"] = wasmExports["_zip_u2d_time"])(a0, a1, a2, a3);

var __zip_string_length = Module["__zip_string_length"] = a0 => (__zip_string_length = Module["__zip_string_length"] = wasmExports["_zip_string_length"])(a0);

var __zip_ef_size = Module["__zip_ef_size"] = (a0, a1) => (__zip_ef_size = Module["__zip_ef_size"] = wasmExports["_zip_ef_size"])(a0, a1);

var __zip_string_write = Module["__zip_string_write"] = (a0, a1) => (__zip_string_write = Module["__zip_string_write"] = wasmExports["_zip_string_write"])(a0, a1);

var __zip_ef_write = Module["__zip_ef_write"] = (a0, a1, a2) => (__zip_ef_write = Module["__zip_ef_write"] = wasmExports["_zip_ef_write"])(a0, a1, a2);

var __zip_get_dirent = Module["__zip_get_dirent"] = (a0, a1, a2, a3, a4) => (__zip_get_dirent = Module["__zip_get_dirent"] = wasmExports["_zip_get_dirent"])(a0, a1, a2, a3, a4);

var __zip_string_crc32 = Module["__zip_string_crc32"] = a0 => (__zip_string_crc32 = Module["__zip_string_crc32"] = wasmExports["_zip_string_crc32"])(a0);

var __zip_string_new = Module["__zip_string_new"] = (a0, a1, a2, a3) => (__zip_string_new = Module["__zip_string_new"] = wasmExports["_zip_string_new"])(a0, a1, a2, a3);

var __zip_string_get = Module["__zip_string_get"] = (a0, a1, a2, a3) => (__zip_string_get = Module["__zip_string_get"] = wasmExports["_zip_string_get"])(a0, a1, a2, a3);

var __zip_hash_free = Module["__zip_hash_free"] = a0 => (__zip_hash_free = Module["__zip_hash_free"] = wasmExports["_zip_hash_free"])(a0);

var __zip_source_invalidate = Module["__zip_source_invalidate"] = a0 => (__zip_source_invalidate = Module["__zip_source_invalidate"] = wasmExports["_zip_source_invalidate"])(a0);

var __zip_progress_free = Module["__zip_progress_free"] = a0 => (__zip_progress_free = Module["__zip_progress_free"] = wasmExports["_zip_progress_free"])(a0);

var __zip_unchange_data = Module["__zip_unchange_data"] = a0 => (__zip_unchange_data = Module["__zip_unchange_data"] = wasmExports["_zip_unchange_data"])(a0);

var _zip_error_init_with_code = Module["_zip_error_init_with_code"] = (a0, a1) => (_zip_error_init_with_code = Module["_zip_error_init_with_code"] = wasmExports["zip_error_init_with_code"])(a0, a1);

var _zip_error_system_type = Module["_zip_error_system_type"] = a0 => (_zip_error_system_type = Module["_zip_error_system_type"] = wasmExports["zip_error_system_type"])(a0);

var __zip_error_clear = Module["__zip_error_clear"] = a0 => (__zip_error_clear = Module["__zip_error_clear"] = wasmExports["_zip_error_clear"])(a0);

var __zip_error_copy = Module["__zip_error_copy"] = (a0, a1) => (__zip_error_copy = Module["__zip_error_copy"] = wasmExports["_zip_error_copy"])(a0, a1);

var __zip_error_get = Module["__zip_error_get"] = (a0, a1, a2) => (__zip_error_get = Module["__zip_error_get"] = wasmExports["_zip_error_get"])(a0, a1, a2);

var _zip_error_to_data = Module["_zip_error_to_data"] = (a0, a1, a2, a3) => (_zip_error_to_data = Module["_zip_error_to_data"] = wasmExports["zip_error_to_data"])(a0, a1, a2, a3);

var _zip_error_get = Module["_zip_error_get"] = (a0, a1, a2) => (_zip_error_get = Module["_zip_error_get"] = wasmExports["zip_error_get"])(a0, a1, a2);

var __zip_ef_clone = Module["__zip_ef_clone"] = (a0, a1) => (__zip_ef_clone = Module["__zip_ef_clone"] = wasmExports["_zip_ef_clone"])(a0, a1);

var __zip_ef_delete_by_id = Module["__zip_ef_delete_by_id"] = (a0, a1, a2, a3) => (__zip_ef_delete_by_id = Module["__zip_ef_delete_by_id"] = wasmExports["_zip_ef_delete_by_id"])(a0, a1, a2, a3);

var __zip_ef_merge = Module["__zip_ef_merge"] = (a0, a1) => (__zip_ef_merge = Module["__zip_ef_merge"] = wasmExports["_zip_ef_merge"])(a0, a1);

var __zip_memdup = Module["__zip_memdup"] = (a0, a1, a2) => (__zip_memdup = Module["__zip_memdup"] = wasmExports["_zip_memdup"])(a0, a1, a2);

var __zip_set_name = Module["__zip_set_name"] = (a0, a1, a2, a3, a4) => (__zip_set_name = Module["__zip_set_name"] = wasmExports["_zip_set_name"])(a0, a1, a2, a3, a4);

var __zip_name_locate = Module["__zip_name_locate"] = (a0, a1, a2, a3) => (__zip_name_locate = Module["__zip_name_locate"] = wasmExports["_zip_name_locate"])(a0, a1, a2, a3);

var __zip_string_equal = Module["__zip_string_equal"] = (a0, a1) => (__zip_string_equal = Module["__zip_string_equal"] = wasmExports["_zip_string_equal"])(a0, a1);

var _zip_fopen_index_encrypted = Module["_zip_fopen_index_encrypted"] = (a0, a1, a2, a3, a4) => (_zip_fopen_index_encrypted = Module["_zip_fopen_index_encrypted"] = wasmExports["zip_fopen_index_encrypted"])(a0, a1, a2, a3, a4);

var _zip_source_is_seekable = Module["_zip_source_is_seekable"] = a0 => (_zip_source_is_seekable = Module["_zip_source_is_seekable"] = wasmExports["zip_source_is_seekable"])(a0);

var _zip_source_tell = Module["_zip_source_tell"] = a0 => (_zip_source_tell = Module["_zip_source_tell"] = wasmExports["zip_source_tell"])(a0);

var _zip_source_pkware_decode = Module["_zip_source_pkware_decode"] = (a0, a1, a2, a3, a4) => (_zip_source_pkware_decode = Module["_zip_source_pkware_decode"] = wasmExports["zip_source_pkware_decode"])(a0, a1, a2, a3, a4);

var _zip_source_pkware_encode = Module["_zip_source_pkware_encode"] = (a0, a1, a2, a3, a4) => (_zip_source_pkware_encode = Module["_zip_source_pkware_encode"] = wasmExports["zip_source_pkware_encode"])(a0, a1, a2, a3, a4);

var _zip_encryption_method_supported = Module["_zip_encryption_method_supported"] = (a0, a1) => (_zip_encryption_method_supported = Module["_zip_encryption_method_supported"] = wasmExports["zip_encryption_method_supported"])(a0, a1);

var __zip_hash_new = Module["__zip_hash_new"] = a0 => (__zip_hash_new = Module["__zip_hash_new"] = wasmExports["_zip_hash_new"])(a0);

var __zip_hash_add = Module["__zip_hash_add"] = (a0, a1, a2, a3, a4, a5) => (__zip_hash_add = Module["__zip_hash_add"] = wasmExports["_zip_hash_add"])(a0, a1, a2, a3, a4, a5);

var __zip_hash_lookup = Module["__zip_hash_lookup"] = (a0, a1, a2, a3) => (__zip_hash_lookup = Module["__zip_hash_lookup"] = wasmExports["_zip_hash_lookup"])(a0, a1, a2, a3);

var __zip_hash_reserve_capacity = Module["__zip_hash_reserve_capacity"] = (a0, a1, a2, a3) => (__zip_hash_reserve_capacity = Module["__zip_hash_reserve_capacity"] = wasmExports["_zip_hash_reserve_capacity"])(a0, a1, a2, a3);

var __zip_hash_revert = Module["__zip_hash_revert"] = (a0, a1) => (__zip_hash_revert = Module["__zip_hash_revert"] = wasmExports["_zip_hash_revert"])(a0, a1);

var _calloc = Module["_calloc"] = (a0, a1) => (_calloc = Module["_calloc"] = wasmExports["calloc"])(a0, a1);

var _zip_source_write = Module["_zip_source_write"] = (a0, a1, a2, a3) => (_zip_source_write = Module["_zip_source_write"] = wasmExports["zip_source_write"])(a0, a1, a2, a3);

var __zip_new = Module["__zip_new"] = a0 => (__zip_new = Module["__zip_new"] = wasmExports["_zip_new"])(a0);

var _zip_source_file_create = Module["_zip_source_file_create"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_file_create = Module["_zip_source_file_create"] = wasmExports["zip_source_file_create"])(a0, a1, a2, a3, a4, a5);

var __zip_set_open_error = Module["__zip_set_open_error"] = (a0, a1, a2) => (__zip_set_open_error = Module["__zip_set_open_error"] = wasmExports["_zip_set_open_error"])(a0, a1, a2);

var _zip_open_from_source = Module["_zip_open_from_source"] = (a0, a1, a2) => (_zip_open_from_source = Module["_zip_open_from_source"] = wasmExports["zip_open_from_source"])(a0, a1, a2);

var __zip_open = Module["__zip_open"] = (a0, a1, a2) => (__zip_open = Module["__zip_open"] = wasmExports["_zip_open"])(a0, a1, a2);

var _zip_source_accept_empty = Module["_zip_source_accept_empty"] = a0 => (_zip_source_accept_empty = Module["_zip_source_accept_empty"] = wasmExports["zip_source_accept_empty"])(a0);

var __zip_pkware_keys_reset = Module["__zip_pkware_keys_reset"] = a0 => (__zip_pkware_keys_reset = Module["__zip_pkware_keys_reset"] = wasmExports["_zip_pkware_keys_reset"])(a0);

var __zip_pkware_encrypt = Module["__zip_pkware_encrypt"] = (a0, a1, a2, a3, a4) => (__zip_pkware_encrypt = Module["__zip_pkware_encrypt"] = wasmExports["_zip_pkware_encrypt"])(a0, a1, a2, a3, a4);

var __zip_pkware_decrypt = Module["__zip_pkware_decrypt"] = (a0, a1, a2, a3, a4) => (__zip_pkware_decrypt = Module["__zip_pkware_decrypt"] = wasmExports["_zip_pkware_decrypt"])(a0, a1, a2, a3, a4);

var _zip_register_progress_callback_with_state = Module["_zip_register_progress_callback_with_state"] = (a0, a1, a2, a3, a4) => (_zip_register_progress_callback_with_state = Module["_zip_register_progress_callback_with_state"] = wasmExports["zip_register_progress_callback_with_state"])(a0, a1, a2, a3, a4);

var _zip_register_cancel_callback_with_state = Module["_zip_register_cancel_callback_with_state"] = (a0, a1, a2, a3) => (_zip_register_cancel_callback_with_state = Module["_zip_register_cancel_callback_with_state"] = wasmExports["zip_register_cancel_callback_with_state"])(a0, a1, a2, a3);

var _zip_register_progress_callback = Module["_zip_register_progress_callback"] = (a0, a1) => (_zip_register_progress_callback = Module["_zip_register_progress_callback"] = wasmExports["zip_register_progress_callback"])(a0, a1);

var _zip_compression_method_supported = Module["_zip_compression_method_supported"] = (a0, a1) => (_zip_compression_method_supported = Module["_zip_compression_method_supported"] = wasmExports["zip_compression_method_supported"])(a0, a1);

var __zip_source_call = Module["__zip_source_call"] = (a0, a1, a2, a3, a4) => (__zip_source_call = Module["__zip_source_call"] = wasmExports["_zip_source_call"])(a0, a1, a2, a3, a4);

var _zip_source_buffer_with_attributes_create = Module["_zip_source_buffer_with_attributes_create"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_buffer_with_attributes_create = Module["_zip_source_buffer_with_attributes_create"] = wasmExports["zip_source_buffer_with_attributes_create"])(a0, a1, a2, a3, a4, a5);

var _zip_source_buffer_create = Module["_zip_source_buffer_create"] = (a0, a1, a2, a3, a4) => (_zip_source_buffer_create = Module["_zip_source_buffer_create"] = wasmExports["zip_source_buffer_create"])(a0, a1, a2, a3, a4);

var _zip_source_buffer_fragment_with_attributes_create = Module["_zip_source_buffer_fragment_with_attributes_create"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_buffer_fragment_with_attributes_create = Module["_zip_source_buffer_fragment_with_attributes_create"] = wasmExports["zip_source_buffer_fragment_with_attributes_create"])(a0, a1, a2, a3, a4, a5);

var _zip_source_buffer_fragment = Module["_zip_source_buffer_fragment"] = (a0, a1, a2, a3, a4) => (_zip_source_buffer_fragment = Module["_zip_source_buffer_fragment"] = wasmExports["zip_source_buffer_fragment"])(a0, a1, a2, a3, a4);

var _zip_source_buffer_fragment_create = Module["_zip_source_buffer_fragment_create"] = (a0, a1, a2, a3, a4) => (_zip_source_buffer_fragment_create = Module["_zip_source_buffer_fragment_create"] = wasmExports["zip_source_buffer_fragment_create"])(a0, a1, a2, a3, a4);

var _zip_file_attributes_init = Module["_zip_file_attributes_init"] = a0 => (_zip_file_attributes_init = Module["_zip_file_attributes_init"] = wasmExports["zip_file_attributes_init"])(a0);

var _zip_source_function_create = Module["_zip_source_function_create"] = (a0, a1, a2) => (_zip_source_function_create = Module["_zip_source_function_create"] = wasmExports["zip_source_function_create"])(a0, a1, a2);

var _zip_source_buffer_with_attributes = Module["_zip_source_buffer_with_attributes"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_buffer_with_attributes = Module["_zip_source_buffer_with_attributes"] = wasmExports["zip_source_buffer_with_attributes"])(a0, a1, a2, a3, a4, a5);

var _zip_source_make_command_bitmap = Module["_zip_source_make_command_bitmap"] = (a0, a1) => (_zip_source_make_command_bitmap = Module["_zip_source_make_command_bitmap"] = wasmExports["zip_source_make_command_bitmap"])(a0, a1);

var _zip_source_seek_compute_offset = Module["_zip_source_seek_compute_offset"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_zip_source_seek_compute_offset = Module["_zip_source_seek_compute_offset"] = wasmExports["zip_source_seek_compute_offset"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _zip_source_layered = Module["_zip_source_layered"] = (a0, a1, a2, a3) => (_zip_source_layered = Module["_zip_source_layered"] = wasmExports["zip_source_layered"])(a0, a1, a2, a3);

var _zip_source_pass_to_lower_layer = Module["_zip_source_pass_to_lower_layer"] = (a0, a1, a2, a3, a4) => (_zip_source_pass_to_lower_layer = Module["_zip_source_pass_to_lower_layer"] = wasmExports["zip_source_pass_to_lower_layer"])(a0, a1, a2, a3, a4);

var _zip_source_layered_create = Module["_zip_source_layered_create"] = (a0, a1, a2, a3) => (_zip_source_layered_create = Module["_zip_source_layered_create"] = wasmExports["zip_source_layered_create"])(a0, a1, a2, a3);

var __zip_source_had_error = Module["__zip_source_had_error"] = a0 => (__zip_source_had_error = Module["__zip_source_had_error"] = wasmExports["_zip_source_had_error"])(a0);

var _zip_source_file_common_new = Module["_zip_source_file_common_new"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_zip_source_file_common_new = Module["_zip_source_file_common_new"] = wasmExports["zip_source_file_common_new"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var _zip_source_filep_create = Module["_zip_source_filep_create"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_filep_create = Module["_zip_source_filep_create"] = wasmExports["zip_source_filep_create"])(a0, a1, a2, a3, a4, a5);

var __zip_stdio_op_close = Module["__zip_stdio_op_close"] = a0 => (__zip_stdio_op_close = Module["__zip_stdio_op_close"] = wasmExports["_zip_stdio_op_close"])(a0);

var __zip_stdio_op_read = Module["__zip_stdio_op_read"] = (a0, a1, a2, a3) => (__zip_stdio_op_read = Module["__zip_stdio_op_read"] = wasmExports["_zip_stdio_op_read"])(a0, a1, a2, a3);

var _ferror = Module["_ferror"] = a0 => (_ferror = Module["_ferror"] = wasmExports["ferror"])(a0);

var __zip_stdio_op_seek = Module["__zip_stdio_op_seek"] = (a0, a1, a2, a3, a4) => (__zip_stdio_op_seek = Module["__zip_stdio_op_seek"] = wasmExports["_zip_stdio_op_seek"])(a0, a1, a2, a3, a4);

var _fseeko = Module["_fseeko"] = (a0, a1, a2, a3) => (_fseeko = Module["_fseeko"] = wasmExports["fseeko"])(a0, a1, a2, a3);

var __zip_stdio_op_stat = Module["__zip_stdio_op_stat"] = (a0, a1) => (__zip_stdio_op_stat = Module["__zip_stdio_op_stat"] = wasmExports["_zip_stdio_op_stat"])(a0, a1);

var __zip_stdio_op_tell = Module["__zip_stdio_op_tell"] = (a0, a1) => (__zip_stdio_op_tell = Module["__zip_stdio_op_tell"] = wasmExports["_zip_stdio_op_tell"])(a0, a1);

var _ftello = Module["_ftello"] = a0 => (_ftello = Module["_ftello"] = wasmExports["ftello"])(a0);

var __zip_deregister_source = Module["__zip_deregister_source"] = (a0, a1) => (__zip_deregister_source = Module["__zip_deregister_source"] = wasmExports["_zip_deregister_source"])(a0, a1);

var _zip_source_function = Module["_zip_source_function"] = (a0, a1, a2) => (_zip_source_function = Module["_zip_source_function"] = wasmExports["zip_source_function"])(a0, a1, a2);

var __zip_source_new = Module["__zip_source_new"] = a0 => (__zip_source_new = Module["__zip_source_new"] = wasmExports["_zip_source_new"])(a0);

var _zip_secure_random = Module["_zip_secure_random"] = (a0, a1) => (_zip_secure_random = Module["_zip_secure_random"] = wasmExports["zip_secure_random"])(a0, a1);

var __zip_source_eof = Module["__zip_source_eof"] = a0 => (__zip_source_eof = Module["__zip_source_eof"] = wasmExports["_zip_source_eof"])(a0);

var _zip_source_supports_reopen = Module["_zip_source_supports_reopen"] = a0 => (_zip_source_supports_reopen = Module["_zip_source_supports_reopen"] = wasmExports["zip_source_supports_reopen"])(a0);

var _zip_source_window_create = Module["_zip_source_window_create"] = (a0, a1, a2, a3, a4, a5) => (_zip_source_window_create = Module["_zip_source_window_create"] = wasmExports["zip_source_window_create"])(a0, a1, a2, a3, a4, a5);

var __zip_stat_merge = Module["__zip_stat_merge"] = (a0, a1, a2) => (__zip_stat_merge = Module["__zip_stat_merge"] = wasmExports["_zip_stat_merge"])(a0, a1, a2);

var __zip_source_set_source_archive = Module["__zip_source_set_source_archive"] = (a0, a1) => (__zip_source_set_source_archive = Module["__zip_source_set_source_archive"] = wasmExports["_zip_source_set_source_archive"])(a0, a1);

var __zip_register_source = Module["__zip_register_source"] = (a0, a1) => (__zip_register_source = Module["__zip_register_source"] = wasmExports["_zip_register_source"])(a0, a1);

var _zip_source_zip_file = Module["_zip_source_zip_file"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_zip_source_zip_file = Module["_zip_source_zip_file"] = wasmExports["zip_source_zip_file"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var __zip_cp437_to_utf8 = Module["__zip_cp437_to_utf8"] = (a0, a1, a2, a3) => (__zip_cp437_to_utf8 = Module["__zip_cp437_to_utf8"] = wasmExports["_zip_cp437_to_utf8"])(a0, a1, a2, a3);

var _remove = Module["_remove"] = a0 => (_remove = Module["_remove"] = wasmExports["remove"])(a0);

var _zip_random_uint32 = Module["_zip_random_uint32"] = () => (_zip_random_uint32 = Module["_zip_random_uint32"] = wasmExports["zip_random_uint32"])();

var _fchmod = Module["_fchmod"] = (a0, a1) => (_fchmod = Module["_fchmod"] = wasmExports["fchmod"])(a0, a1);

var _clearerr = Module["_clearerr"] = a0 => (_clearerr = Module["_clearerr"] = wasmExports["clearerr"])(a0);

var _srand = Module["_srand"] = a0 => (_srand = Module["_srand"] = wasmExports["srand"])(a0);

var _rand = Module["_rand"] = () => (_rand = Module["_rand"] = wasmExports["rand"])();

var _waitid = Module["_waitid"] = (a0, a1, a2, a3) => (_waitid = Module["_waitid"] = wasmExports["waitid"])(a0, a1, a2, a3);

var _times = Module["_times"] = a0 => (_times = Module["_times"] = wasmExports["times"])(a0);

var _getdate = Module["_getdate"] = a0 => (_getdate = Module["_getdate"] = wasmExports["getdate"])(a0);

var _stime = Module["_stime"] = a0 => (_stime = Module["_stime"] = wasmExports["stime"])(a0);

var _clock_getcpuclockid = Module["_clock_getcpuclockid"] = (a0, a1) => (_clock_getcpuclockid = Module["_clock_getcpuclockid"] = wasmExports["clock_getcpuclockid"])(a0, a1);

var _getpwnam_r = Module["_getpwnam_r"] = (a0, a1, a2, a3, a4) => (_getpwnam_r = Module["_getpwnam_r"] = wasmExports["getpwnam_r"])(a0, a1, a2, a3, a4);

var _getpwuid_r = Module["_getpwuid_r"] = (a0, a1, a2, a3, a4) => (_getpwuid_r = Module["_getpwuid_r"] = wasmExports["getpwuid_r"])(a0, a1, a2, a3, a4);

var _setpwent = Module["_setpwent"] = () => (_setpwent = Module["_setpwent"] = wasmExports["setpwent"])();

var _endpwent = Module["_endpwent"] = () => (_endpwent = Module["_endpwent"] = wasmExports["endpwent"])();

var _getpwent = Module["_getpwent"] = () => (_getpwent = Module["_getpwent"] = wasmExports["getpwent"])();

var _getgrgid = Module["_getgrgid"] = a0 => (_getgrgid = Module["_getgrgid"] = wasmExports["getgrgid"])(a0);

var _getgrnam_r = Module["_getgrnam_r"] = (a0, a1, a2, a3, a4) => (_getgrnam_r = Module["_getgrnam_r"] = wasmExports["getgrnam_r"])(a0, a1, a2, a3, a4);

var _getgrgid_r = Module["_getgrgid_r"] = (a0, a1, a2, a3, a4) => (_getgrgid_r = Module["_getgrgid_r"] = wasmExports["getgrgid_r"])(a0, a1, a2, a3, a4);

var _getgrent = Module["_getgrent"] = () => (_getgrent = Module["_getgrent"] = wasmExports["getgrent"])();

var _endgrent = Module["_endgrent"] = () => (_endgrent = Module["_endgrent"] = wasmExports["endgrent"])();

var _setgrent = Module["_setgrent"] = () => (_setgrent = Module["_setgrent"] = wasmExports["setgrent"])();

var _execve = Module["_execve"] = (a0, a1, a2) => (_execve = Module["_execve"] = wasmExports["execve"])(a0, a1, a2);

var _fork = Module["_fork"] = () => (_fork = Module["_fork"] = wasmExports["fork"])();

var _vfork = Module["_vfork"] = () => (_vfork = Module["_vfork"] = wasmExports["vfork"])();

var _setgroups = Module["_setgroups"] = (a0, a1) => (_setgroups = Module["_setgroups"] = wasmExports["setgroups"])(a0, a1);

var _sigaltstack = Module["_sigaltstack"] = (a0, a1) => (_sigaltstack = Module["_sigaltstack"] = wasmExports["sigaltstack"])(a0, a1);

var ___dlsym = Module["___dlsym"] = (a0, a1, a2) => (___dlsym = Module["___dlsym"] = wasmExports["__dlsym"])(a0, a1, a2);

var ___syscall_uname = Module["___syscall_uname"] = a0 => (___syscall_uname = Module["___syscall_uname"] = wasmExports["__syscall_uname"])(a0);

var ___syscall_setpgid = Module["___syscall_setpgid"] = (a0, a1) => (___syscall_setpgid = Module["___syscall_setpgid"] = wasmExports["__syscall_setpgid"])(a0, a1);

var ___syscall_sync = Module["___syscall_sync"] = () => (___syscall_sync = Module["___syscall_sync"] = wasmExports["__syscall_sync"])();

var ___syscall_getsid = Module["___syscall_getsid"] = a0 => (___syscall_getsid = Module["___syscall_getsid"] = wasmExports["__syscall_getsid"])(a0);

var ___syscall_getpgid = Module["___syscall_getpgid"] = a0 => (___syscall_getpgid = Module["___syscall_getpgid"] = wasmExports["__syscall_getpgid"])(a0);

var ___syscall_getpid = Module["___syscall_getpid"] = () => (___syscall_getpid = Module["___syscall_getpid"] = wasmExports["__syscall_getpid"])();

var ___syscall_getppid = Module["___syscall_getppid"] = () => (___syscall_getppid = Module["___syscall_getppid"] = wasmExports["__syscall_getppid"])();

var ___syscall_linkat = Module["___syscall_linkat"] = (a0, a1, a2, a3, a4) => (___syscall_linkat = Module["___syscall_linkat"] = wasmExports["__syscall_linkat"])(a0, a1, a2, a3, a4);

var ___syscall_getgroups32 = Module["___syscall_getgroups32"] = (a0, a1) => (___syscall_getgroups32 = Module["___syscall_getgroups32"] = wasmExports["__syscall_getgroups32"])(a0, a1);

var ___syscall_setsid = Module["___syscall_setsid"] = () => (___syscall_setsid = Module["___syscall_setsid"] = wasmExports["__syscall_setsid"])();

var ___syscall_umask = Module["___syscall_umask"] = a0 => (___syscall_umask = Module["___syscall_umask"] = wasmExports["__syscall_umask"])(a0);

var ___syscall_setrlimit = Module["___syscall_setrlimit"] = (a0, a1) => (___syscall_setrlimit = Module["___syscall_setrlimit"] = wasmExports["__syscall_setrlimit"])(a0, a1);

var ___syscall_getrusage = Module["___syscall_getrusage"] = (a0, a1) => (___syscall_getrusage = Module["___syscall_getrusage"] = wasmExports["__syscall_getrusage"])(a0, a1);

var ___syscall_getpriority = Module["___syscall_getpriority"] = (a0, a1) => (___syscall_getpriority = Module["___syscall_getpriority"] = wasmExports["__syscall_getpriority"])(a0, a1);

var ___syscall_setpriority = Module["___syscall_setpriority"] = (a0, a1, a2) => (___syscall_setpriority = Module["___syscall_setpriority"] = wasmExports["__syscall_setpriority"])(a0, a1, a2);

var ___syscall_setdomainname = Module["___syscall_setdomainname"] = (a0, a1) => (___syscall_setdomainname = Module["___syscall_setdomainname"] = wasmExports["__syscall_setdomainname"])(a0, a1);

var ___syscall_getuid32 = Module["___syscall_getuid32"] = () => (___syscall_getuid32 = Module["___syscall_getuid32"] = wasmExports["__syscall_getuid32"])();

var ___syscall_getgid32 = Module["___syscall_getgid32"] = () => (___syscall_getgid32 = Module["___syscall_getgid32"] = wasmExports["__syscall_getgid32"])();

var ___syscall_geteuid32 = Module["___syscall_geteuid32"] = () => (___syscall_geteuid32 = Module["___syscall_geteuid32"] = wasmExports["__syscall_geteuid32"])();

var ___syscall_getegid32 = Module["___syscall_getegid32"] = () => (___syscall_getegid32 = Module["___syscall_getegid32"] = wasmExports["__syscall_getegid32"])();

var ___syscall_getresuid32 = Module["___syscall_getresuid32"] = (a0, a1, a2) => (___syscall_getresuid32 = Module["___syscall_getresuid32"] = wasmExports["__syscall_getresuid32"])(a0, a1, a2);

var ___syscall_getresgid32 = Module["___syscall_getresgid32"] = (a0, a1, a2) => (___syscall_getresgid32 = Module["___syscall_getresgid32"] = wasmExports["__syscall_getresgid32"])(a0, a1, a2);

var ___syscall_pause = Module["___syscall_pause"] = () => (___syscall_pause = Module["___syscall_pause"] = wasmExports["__syscall_pause"])();

var ___syscall_madvise = Module["___syscall_madvise"] = (a0, a1, a2) => (___syscall_madvise = Module["___syscall_madvise"] = wasmExports["__syscall_madvise"])(a0, a1, a2);

var ___syscall_mlock = Module["___syscall_mlock"] = (a0, a1) => (___syscall_mlock = Module["___syscall_mlock"] = wasmExports["__syscall_mlock"])(a0, a1);

var ___syscall_munlock = Module["___syscall_munlock"] = (a0, a1) => (___syscall_munlock = Module["___syscall_munlock"] = wasmExports["__syscall_munlock"])(a0, a1);

var ___syscall_mprotect = Module["___syscall_mprotect"] = (a0, a1, a2) => (___syscall_mprotect = Module["___syscall_mprotect"] = wasmExports["__syscall_mprotect"])(a0, a1, a2);

var ___syscall_mremap = Module["___syscall_mremap"] = (a0, a1, a2, a3, a4) => (___syscall_mremap = Module["___syscall_mremap"] = wasmExports["__syscall_mremap"])(a0, a1, a2, a3, a4);

var ___syscall_mlockall = Module["___syscall_mlockall"] = a0 => (___syscall_mlockall = Module["___syscall_mlockall"] = wasmExports["__syscall_mlockall"])(a0);

var ___syscall_munlockall = Module["___syscall_munlockall"] = () => (___syscall_munlockall = Module["___syscall_munlockall"] = wasmExports["__syscall_munlockall"])();

var ___syscall_prlimit64 = Module["___syscall_prlimit64"] = (a0, a1, a2, a3) => (___syscall_prlimit64 = Module["___syscall_prlimit64"] = wasmExports["__syscall_prlimit64"])(a0, a1, a2, a3);

var ___syscall_ugetrlimit = Module["___syscall_ugetrlimit"] = (a0, a1) => (___syscall_ugetrlimit = Module["___syscall_ugetrlimit"] = wasmExports["__syscall_ugetrlimit"])(a0, a1);

var ___syscall_setsockopt = Module["___syscall_setsockopt"] = (a0, a1, a2, a3, a4, a5) => (___syscall_setsockopt = Module["___syscall_setsockopt"] = wasmExports["__syscall_setsockopt"])(a0, a1, a2, a3, a4, a5);

var ___syscall_acct = Module["___syscall_acct"] = a0 => (___syscall_acct = Module["___syscall_acct"] = wasmExports["__syscall_acct"])(a0);

var ___syscall_mincore = Module["___syscall_mincore"] = (a0, a1, a2) => (___syscall_mincore = Module["___syscall_mincore"] = wasmExports["__syscall_mincore"])(a0, a1, a2);

var ___syscall_pipe2 = Module["___syscall_pipe2"] = (a0, a1) => (___syscall_pipe2 = Module["___syscall_pipe2"] = wasmExports["__syscall_pipe2"])(a0, a1);

var ___syscall_pselect6 = Module["___syscall_pselect6"] = (a0, a1, a2, a3, a4, a5) => (___syscall_pselect6 = Module["___syscall_pselect6"] = wasmExports["__syscall_pselect6"])(a0, a1, a2, a3, a4, a5);

var ___syscall_recvmmsg = Module["___syscall_recvmmsg"] = (a0, a1, a2, a3, a4) => (___syscall_recvmmsg = Module["___syscall_recvmmsg"] = wasmExports["__syscall_recvmmsg"])(a0, a1, a2, a3, a4);

var ___syscall_sendmmsg = Module["___syscall_sendmmsg"] = (a0, a1, a2, a3, a4) => (___syscall_sendmmsg = Module["___syscall_sendmmsg"] = wasmExports["__syscall_sendmmsg"])(a0, a1, a2, a3, a4);

var ___syscall_shutdown = Module["___syscall_shutdown"] = (a0, a1, a2, a3, a4, a5) => (___syscall_shutdown = Module["___syscall_shutdown"] = wasmExports["__syscall_shutdown"])(a0, a1, a2, a3, a4, a5);

var ___syscall_socketpair = Module["___syscall_socketpair"] = (a0, a1, a2, a3, a4, a5) => (___syscall_socketpair = Module["___syscall_socketpair"] = wasmExports["__syscall_socketpair"])(a0, a1, a2, a3, a4, a5);

var ___syscall_wait4 = Module["___syscall_wait4"] = (a0, a1, a2, a3) => (___syscall_wait4 = Module["___syscall_wait4"] = wasmExports["__syscall_wait4"])(a0, a1, a2, a3);

var __Exit = Module["__Exit"] = a0 => (__Exit = Module["__Exit"] = wasmExports["_Exit"])(a0);

var ___get_tp = Module["___get_tp"] = () => (___get_tp = Module["___get_tp"] = wasmExports["__get_tp"])();

var ___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = () => (___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = wasmExports["__emscripten_environ_constructor"])();

var _emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = a0 => (_emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = wasmExports["emscripten_builtin_malloc"])(a0);

var _memset = Module["_memset"] = (a0, a1, a2) => (_memset = Module["_memset"] = wasmExports["memset"])(a0, a1, a2);

var ___fmodeflags = Module["___fmodeflags"] = a0 => (___fmodeflags = Module["___fmodeflags"] = wasmExports["__fmodeflags"])(a0);

var ___mo_lookup = Module["___mo_lookup"] = (a0, a1, a2) => (___mo_lookup = Module["___mo_lookup"] = wasmExports["__mo_lookup"])(a0, a1, a2);

var ___wasi_syscall_ret = Module["___wasi_syscall_ret"] = a0 => (___wasi_syscall_ret = Module["___wasi_syscall_ret"] = wasmExports["__wasi_syscall_ret"])(a0);

var ___uflow = Module["___uflow"] = a0 => (___uflow = Module["___uflow"] = wasmExports["__uflow"])(a0);

var _sqrt = Module["_sqrt"] = a0 => (_sqrt = Module["_sqrt"] = wasmExports["sqrt"])(a0);

var _log = Module["_log"] = a0 => (_log = Module["_log"] = wasmExports["log"])(a0);

var ___nl_langinfo_l = Module["___nl_langinfo_l"] = (a0, a1) => (___nl_langinfo_l = Module["___nl_langinfo_l"] = wasmExports["__nl_langinfo_l"])(a0, a1);

var _fabs = Module["_fabs"] = a0 => (_fabs = Module["_fabs"] = wasmExports["fabs"])(a0);

var ___funcs_on_exit = () => (___funcs_on_exit = wasmExports["__funcs_on_exit"])();

var ____cxa_finalize = Module["____cxa_finalize"] = a0 => (____cxa_finalize = Module["____cxa_finalize"] = wasmExports["___cxa_finalize"])(a0);

var ____cxa_atexit = Module["____cxa_atexit"] = (a0, a1, a2) => (____cxa_atexit = Module["____cxa_atexit"] = wasmExports["___cxa_atexit"])(a0, a1, a2);

var ___atexit = Module["___atexit"] = a0 => (___atexit = Module["___atexit"] = wasmExports["__atexit"])(a0);

var _atexit = Module["_atexit"] = a0 => (_atexit = Module["_atexit"] = wasmExports["atexit"])(a0);

var ___cxa_atexit = Module["___cxa_atexit"] = (a0, a1, a2) => (___cxa_atexit = Module["___cxa_atexit"] = wasmExports["__cxa_atexit"])(a0, a1, a2);

var ___cxa_finalize = Module["___cxa_finalize"] = a0 => (___cxa_finalize = Module["___cxa_finalize"] = wasmExports["__cxa_finalize"])(a0);

var _cbrt = Module["_cbrt"] = a0 => (_cbrt = Module["_cbrt"] = wasmExports["cbrt"])(a0);

var _cbrtf = Module["_cbrtf"] = a0 => (_cbrtf = Module["_cbrtf"] = wasmExports["cbrtf"])(a0);

var _cbrtl = Module["_cbrtl"] = (a0, a1, a2, a3, a4) => (_cbrtl = Module["_cbrtl"] = wasmExports["cbrtl"])(a0, a1, a2, a3, a4);

var _ceil = Module["_ceil"] = a0 => (_ceil = Module["_ceil"] = wasmExports["ceil"])(a0);

var _ceilf = Module["_ceilf"] = a0 => (_ceilf = Module["_ceilf"] = wasmExports["ceilf"])(a0);

var _ceill = Module["_ceill"] = (a0, a1, a2, a3, a4) => (_ceill = Module["_ceill"] = wasmExports["ceill"])(a0, a1, a2, a3, a4);

var _clearerr_unlocked = Module["_clearerr_unlocked"] = a0 => (_clearerr_unlocked = Module["_clearerr_unlocked"] = wasmExports["clearerr_unlocked"])(a0);

var _clock_nanosleep = Module["_clock_nanosleep"] = (a0, a1, a2, a3) => (_clock_nanosleep = Module["_clock_nanosleep"] = wasmExports["clock_nanosleep"])(a0, a1, a2, a3);

var _copysign = Module["_copysign"] = (a0, a1) => (_copysign = Module["_copysign"] = wasmExports["copysign"])(a0, a1);

var _copysignf = Module["_copysignf"] = (a0, a1) => (_copysignf = Module["_copysignf"] = wasmExports["copysignf"])(a0, a1);

var _copysignl = Module["_copysignl"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_copysignl = Module["_copysignl"] = wasmExports["copysignl"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _cos = Module["_cos"] = a0 => (_cos = Module["_cos"] = wasmExports["cos"])(a0);

var _cosf = Module["_cosf"] = a0 => (_cosf = Module["_cosf"] = wasmExports["cosf"])(a0);

var _exp = Module["_exp"] = a0 => (_exp = Module["_exp"] = wasmExports["exp"])(a0);

var _cosl = Module["_cosl"] = (a0, a1, a2, a3, a4) => (_cosl = Module["_cosl"] = wasmExports["cosl"])(a0, a1, a2, a3, a4);

var ___libc_free = Module["___libc_free"] = a0 => (___libc_free = Module["___libc_free"] = wasmExports["__libc_free"])(a0);

var _vsnprintf = Module["_vsnprintf"] = (a0, a1, a2, a3) => (_vsnprintf = Module["_vsnprintf"] = wasmExports["vsnprintf"])(a0, a1, a2, a3);

var ___libc_malloc = Module["___libc_malloc"] = a0 => (___libc_malloc = Module["___libc_malloc"] = wasmExports["__libc_malloc"])(a0);

var _dprintf = Module["_dprintf"] = (a0, a1, a2) => (_dprintf = Module["_dprintf"] = wasmExports["dprintf"])(a0, a1, a2);

var _emscripten_get_heap_size = Module["_emscripten_get_heap_size"] = () => (_emscripten_get_heap_size = Module["_emscripten_get_heap_size"] = wasmExports["emscripten_get_heap_size"])();

var _emscripten_builtin_memcpy = Module["_emscripten_builtin_memcpy"] = (a0, a1, a2) => (_emscripten_builtin_memcpy = Module["_emscripten_builtin_memcpy"] = wasmExports["emscripten_builtin_memcpy"])(a0, a1, a2);

var _memcpy = (a0, a1, a2) => (_memcpy = wasmExports["memcpy"])(a0, a1, a2);

var _memmove = Module["_memmove"] = (a0, a1, a2) => (_memmove = Module["_memmove"] = wasmExports["memmove"])(a0, a1, a2);

var ___memset = Module["___memset"] = (a0, a1, a2) => (___memset = Module["___memset"] = wasmExports["__memset"])(a0, a1, a2);

var _emscripten_builtin_memset = Module["_emscripten_builtin_memset"] = (a0, a1, a2) => (_emscripten_builtin_memset = Module["_emscripten_builtin_memset"] = wasmExports["emscripten_builtin_memset"])(a0, a1, a2);

var ___syscall_munmap = Module["___syscall_munmap"] = (a0, a1) => (___syscall_munmap = Module["___syscall_munmap"] = wasmExports["__syscall_munmap"])(a0, a1);

var ___syscall_msync = Module["___syscall_msync"] = (a0, a1, a2) => (___syscall_msync = Module["___syscall_msync"] = wasmExports["__syscall_msync"])(a0, a1, a2);

var ___syscall_mmap2 = Module["___syscall_mmap2"] = (a0, a1, a2, a3, a4, a5, a6) => (___syscall_mmap2 = Module["___syscall_mmap2"] = wasmExports["__syscall_mmap2"])(a0, a1, a2, a3, a4, a5, a6);

var ___clock = Module["___clock"] = () => (___clock = Module["___clock"] = wasmExports["__clock"])();

var ___time = Module["___time"] = a0 => (___time = Module["___time"] = wasmExports["__time"])(a0);

var ___clock_getres = Module["___clock_getres"] = (a0, a1) => (___clock_getres = Module["___clock_getres"] = wasmExports["__clock_getres"])(a0, a1);

var ___gettimeofday = Module["___gettimeofday"] = (a0, a1) => (___gettimeofday = Module["___gettimeofday"] = wasmExports["__gettimeofday"])(a0, a1);

var _dysize = Module["_dysize"] = a0 => (_dysize = Module["_dysize"] = wasmExports["dysize"])(a0);

var _clock = Module["_clock"] = () => (_clock = Module["_clock"] = wasmExports["clock"])();

var _clock_getres = Module["_clock_getres"] = (a0, a1) => (_clock_getres = Module["_clock_getres"] = wasmExports["clock_getres"])(a0, a1);

var _exp2l = Module["_exp2l"] = (a0, a1, a2, a3, a4) => (_exp2l = Module["_exp2l"] = wasmExports["exp2l"])(a0, a1, a2, a3, a4);

var _expf = Module["_expf"] = a0 => (_expf = Module["_expf"] = wasmExports["expf"])(a0);

var _expl = Module["_expl"] = (a0, a1, a2, a3, a4) => (_expl = Module["_expl"] = wasmExports["expl"])(a0, a1, a2, a3, a4);

var _fabsl = Module["_fabsl"] = (a0, a1, a2, a3, a4) => (_fabsl = Module["_fabsl"] = wasmExports["fabsl"])(a0, a1, a2, a3, a4);

var ___wasi_fd_is_valid = Module["___wasi_fd_is_valid"] = a0 => (___wasi_fd_is_valid = Module["___wasi_fd_is_valid"] = wasmExports["__wasi_fd_is_valid"])(a0);

var _feclearexcept = Module["_feclearexcept"] = a0 => (_feclearexcept = Module["_feclearexcept"] = wasmExports["feclearexcept"])(a0);

var _feraiseexcept = Module["_feraiseexcept"] = a0 => (_feraiseexcept = Module["_feraiseexcept"] = wasmExports["feraiseexcept"])(a0);

var _fetestexcept = Module["_fetestexcept"] = a0 => (_fetestexcept = Module["_fetestexcept"] = wasmExports["fetestexcept"])(a0);

var _fegetround = Module["_fegetround"] = () => (_fegetround = Module["_fegetround"] = wasmExports["fegetround"])();

var ___fesetround = Module["___fesetround"] = a0 => (___fesetround = Module["___fesetround"] = wasmExports["__fesetround"])(a0);

var _fegetenv = Module["_fegetenv"] = a0 => (_fegetenv = Module["_fegetenv"] = wasmExports["fegetenv"])(a0);

var _fesetenv = Module["_fesetenv"] = a0 => (_fesetenv = Module["_fesetenv"] = wasmExports["fesetenv"])(a0);

var _feof_unlocked = Module["_feof_unlocked"] = a0 => (_feof_unlocked = Module["_feof_unlocked"] = wasmExports["feof_unlocked"])(a0);

var __IO_feof_unlocked = Module["__IO_feof_unlocked"] = a0 => (__IO_feof_unlocked = Module["__IO_feof_unlocked"] = wasmExports["_IO_feof_unlocked"])(a0);

var _ferror_unlocked = Module["_ferror_unlocked"] = a0 => (_ferror_unlocked = Module["_ferror_unlocked"] = wasmExports["ferror_unlocked"])(a0);

var __IO_ferror_unlocked = Module["__IO_ferror_unlocked"] = a0 => (__IO_ferror_unlocked = Module["__IO_ferror_unlocked"] = wasmExports["_IO_ferror_unlocked"])(a0);

var _fesetround = Module["_fesetround"] = a0 => (_fesetround = Module["_fesetround"] = wasmExports["fesetround"])(a0);

var _fflush_unlocked = Module["_fflush_unlocked"] = a0 => (_fflush_unlocked = Module["_fflush_unlocked"] = wasmExports["fflush_unlocked"])(a0);

var _emscripten_futex_wake = Module["_emscripten_futex_wake"] = (a0, a1) => (_emscripten_futex_wake = Module["_emscripten_futex_wake"] = wasmExports["emscripten_futex_wake"])(a0, a1);

var _fgets = Module["_fgets"] = (a0, a1, a2) => (_fgets = Module["_fgets"] = wasmExports["fgets"])(a0, a1, a2);

var _fgets_unlocked = Module["_fgets_unlocked"] = (a0, a1, a2) => (_fgets_unlocked = Module["_fgets_unlocked"] = wasmExports["fgets_unlocked"])(a0, a1, a2);

var _fileno_unlocked = Module["_fileno_unlocked"] = a0 => (_fileno_unlocked = Module["_fileno_unlocked"] = wasmExports["fileno_unlocked"])(a0);

var _floor = Module["_floor"] = a0 => (_floor = Module["_floor"] = wasmExports["floor"])(a0);

var _floorf = Module["_floorf"] = a0 => (_floorf = Module["_floorf"] = wasmExports["floorf"])(a0);

var _floorl = Module["_floorl"] = (a0, a1, a2, a3, a4) => (_floorl = Module["_floorl"] = wasmExports["floorl"])(a0, a1, a2, a3, a4);

var _fma = Module["_fma"] = (a0, a1, a2) => (_fma = Module["_fma"] = wasmExports["fma"])(a0, a1, a2);

var _fmaf = Module["_fmaf"] = (a0, a1, a2) => (_fmaf = Module["_fmaf"] = wasmExports["fmaf"])(a0, a1, a2);

var _fmal = Module["_fmal"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) => (_fmal = Module["_fmal"] = wasmExports["fmal"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);

var _fmod = Module["_fmod"] = (a0, a1) => (_fmod = Module["_fmod"] = wasmExports["fmod"])(a0, a1);

var _fmodl = Module["_fmodl"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_fmodl = Module["_fmodl"] = wasmExports["fmodl"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _mbtowc = Module["_mbtowc"] = (a0, a1, a2) => (_mbtowc = Module["_mbtowc"] = wasmExports["mbtowc"])(a0, a1, a2);

var _towupper = Module["_towupper"] = a0 => (_towupper = Module["_towupper"] = wasmExports["towupper"])(a0);

var _towlower = Module["_towlower"] = a0 => (_towlower = Module["_towlower"] = wasmExports["towlower"])(a0);

var _iswctype = Module["_iswctype"] = (a0, a1) => (_iswctype = Module["_iswctype"] = wasmExports["iswctype"])(a0, a1);

var _wctype = Module["_wctype"] = a0 => (_wctype = Module["_wctype"] = wasmExports["wctype"])(a0);

var _vfprintf = Module["_vfprintf"] = (a0, a1, a2) => (_vfprintf = Module["_vfprintf"] = wasmExports["vfprintf"])(a0, a1, a2);

var _fiprintf = Module["_fiprintf"] = (a0, a1, a2) => (_fiprintf = Module["_fiprintf"] = wasmExports["fiprintf"])(a0, a1, a2);

var _vfiprintf = Module["_vfiprintf"] = (a0, a1, a2) => (_vfiprintf = Module["_vfiprintf"] = wasmExports["vfiprintf"])(a0, a1, a2);

var ___small_fprintf = Module["___small_fprintf"] = (a0, a1, a2) => (___small_fprintf = Module["___small_fprintf"] = wasmExports["__small_fprintf"])(a0, a1, a2);

var ___small_vfprintf = Module["___small_vfprintf"] = (a0, a1, a2) => (___small_vfprintf = Module["___small_vfprintf"] = wasmExports["__small_vfprintf"])(a0, a1, a2);

var _fread_unlocked = Module["_fread_unlocked"] = (a0, a1, a2, a3) => (_fread_unlocked = Module["_fread_unlocked"] = wasmExports["fread_unlocked"])(a0, a1, a2, a3);

var _frexp = Module["_frexp"] = (a0, a1) => (_frexp = Module["_frexp"] = wasmExports["frexp"])(a0, a1);

var _frexpf = Module["_frexpf"] = (a0, a1) => (_frexpf = Module["_frexpf"] = wasmExports["frexpf"])(a0, a1);

var _frexpl = Module["_frexpl"] = (a0, a1, a2, a3, a4, a5) => (_frexpl = Module["_frexpl"] = wasmExports["frexpl"])(a0, a1, a2, a3, a4, a5);

var _fstatat = Module["_fstatat"] = (a0, a1, a2, a3) => (_fstatat = Module["_fstatat"] = wasmExports["fstatat"])(a0, a1, a2, a3);

var _fwrite_unlocked = Module["_fwrite_unlocked"] = (a0, a1, a2, a3) => (_fwrite_unlocked = Module["_fwrite_unlocked"] = wasmExports["fwrite_unlocked"])(a0, a1, a2, a3);

var __IO_getc = Module["__IO_getc"] = a0 => (__IO_getc = Module["__IO_getc"] = wasmExports["_IO_getc"])(a0);

var _getpriority = Module["_getpriority"] = (a0, a1) => (_getpriority = Module["_getpriority"] = wasmExports["getpriority"])(a0, a1);

var _getservbyname_r = Module["_getservbyname_r"] = (a0, a1, a2, a3, a4, a5) => (_getservbyname_r = Module["_getservbyname_r"] = wasmExports["getservbyname_r"])(a0, a1, a2, a3, a4, a5);

var _getservbyport_r = Module["_getservbyport_r"] = (a0, a1, a2, a3, a4, a5) => (_getservbyport_r = Module["_getservbyport_r"] = wasmExports["getservbyport_r"])(a0, a1, a2, a3, a4, a5);

var _ilogbl = Module["_ilogbl"] = (a0, a1, a2, a3) => (_ilogbl = Module["_ilogbl"] = wasmExports["ilogbl"])(a0, a1, a2, a3);

var _strspn = Module["_strspn"] = (a0, a1) => (_strspn = Module["_strspn"] = wasmExports["strspn"])(a0, a1);

var ___intscan = Module["___intscan"] = (a0, a1, a2, a3, a4) => (___intscan = Module["___intscan"] = wasmExports["__intscan"])(a0, a1, a2, a3, a4);

var _ioctl = Module["_ioctl"] = (a0, a1, a2) => (_ioctl = Module["_ioctl"] = wasmExports["ioctl"])(a0, a1, a2);

var ___isalnum_l = Module["___isalnum_l"] = (a0, a1) => (___isalnum_l = Module["___isalnum_l"] = wasmExports["__isalnum_l"])(a0, a1);

var _isalnum_l = Module["_isalnum_l"] = (a0, a1) => (_isalnum_l = Module["_isalnum_l"] = wasmExports["isalnum_l"])(a0, a1);

var ___isalpha_l = Module["___isalpha_l"] = (a0, a1) => (___isalpha_l = Module["___isalpha_l"] = wasmExports["__isalpha_l"])(a0, a1);

var _isalpha_l = Module["_isalpha_l"] = (a0, a1) => (_isalpha_l = Module["_isalpha_l"] = wasmExports["isalpha_l"])(a0, a1);

var _isblank = Module["_isblank"] = a0 => (_isblank = Module["_isblank"] = wasmExports["isblank"])(a0);

var ___isblank_l = Module["___isblank_l"] = (a0, a1) => (___isblank_l = Module["___isblank_l"] = wasmExports["__isblank_l"])(a0, a1);

var _isblank_l = Module["_isblank_l"] = (a0, a1) => (_isblank_l = Module["_isblank_l"] = wasmExports["isblank_l"])(a0, a1);

var ___iscntrl_l = Module["___iscntrl_l"] = (a0, a1) => (___iscntrl_l = Module["___iscntrl_l"] = wasmExports["__iscntrl_l"])(a0, a1);

var _iscntrl_l = Module["_iscntrl_l"] = (a0, a1) => (_iscntrl_l = Module["_iscntrl_l"] = wasmExports["iscntrl_l"])(a0, a1);

var ___isdigit_l = Module["___isdigit_l"] = (a0, a1) => (___isdigit_l = Module["___isdigit_l"] = wasmExports["__isdigit_l"])(a0, a1);

var _isdigit_l = Module["_isdigit_l"] = (a0, a1) => (_isdigit_l = Module["_isdigit_l"] = wasmExports["isdigit_l"])(a0, a1);

var ___isgraph_l = Module["___isgraph_l"] = (a0, a1) => (___isgraph_l = Module["___isgraph_l"] = wasmExports["__isgraph_l"])(a0, a1);

var _isgraph_l = Module["_isgraph_l"] = (a0, a1) => (_isgraph_l = Module["_isgraph_l"] = wasmExports["isgraph_l"])(a0, a1);

var ___islower_l = Module["___islower_l"] = (a0, a1) => (___islower_l = Module["___islower_l"] = wasmExports["__islower_l"])(a0, a1);

var _islower_l = Module["_islower_l"] = (a0, a1) => (_islower_l = Module["_islower_l"] = wasmExports["islower_l"])(a0, a1);

var ___isprint_l = Module["___isprint_l"] = (a0, a1) => (___isprint_l = Module["___isprint_l"] = wasmExports["__isprint_l"])(a0, a1);

var _isprint_l = Module["_isprint_l"] = (a0, a1) => (_isprint_l = Module["_isprint_l"] = wasmExports["isprint_l"])(a0, a1);

var ___ispunct_l = Module["___ispunct_l"] = (a0, a1) => (___ispunct_l = Module["___ispunct_l"] = wasmExports["__ispunct_l"])(a0, a1);

var _ispunct_l = Module["_ispunct_l"] = (a0, a1) => (_ispunct_l = Module["_ispunct_l"] = wasmExports["ispunct_l"])(a0, a1);

var ___isspace_l = Module["___isspace_l"] = (a0, a1) => (___isspace_l = Module["___isspace_l"] = wasmExports["__isspace_l"])(a0, a1);

var _isspace_l = Module["_isspace_l"] = (a0, a1) => (_isspace_l = Module["_isspace_l"] = wasmExports["isspace_l"])(a0, a1);

var ___isupper_l = Module["___isupper_l"] = (a0, a1) => (___isupper_l = Module["___isupper_l"] = wasmExports["__isupper_l"])(a0, a1);

var _isupper_l = Module["_isupper_l"] = (a0, a1) => (_isupper_l = Module["_isupper_l"] = wasmExports["isupper_l"])(a0, a1);

var _iswalnum = Module["_iswalnum"] = a0 => (_iswalnum = Module["_iswalnum"] = wasmExports["iswalnum"])(a0);

var ___iswalnum_l = Module["___iswalnum_l"] = (a0, a1) => (___iswalnum_l = Module["___iswalnum_l"] = wasmExports["__iswalnum_l"])(a0, a1);

var _iswalnum_l = Module["_iswalnum_l"] = (a0, a1) => (_iswalnum_l = Module["_iswalnum_l"] = wasmExports["iswalnum_l"])(a0, a1);

var _iswalpha = Module["_iswalpha"] = a0 => (_iswalpha = Module["_iswalpha"] = wasmExports["iswalpha"])(a0);

var ___iswalpha_l = Module["___iswalpha_l"] = (a0, a1) => (___iswalpha_l = Module["___iswalpha_l"] = wasmExports["__iswalpha_l"])(a0, a1);

var _iswalpha_l = Module["_iswalpha_l"] = (a0, a1) => (_iswalpha_l = Module["_iswalpha_l"] = wasmExports["iswalpha_l"])(a0, a1);

var _iswblank = Module["_iswblank"] = a0 => (_iswblank = Module["_iswblank"] = wasmExports["iswblank"])(a0);

var ___iswblank_l = Module["___iswblank_l"] = (a0, a1) => (___iswblank_l = Module["___iswblank_l"] = wasmExports["__iswblank_l"])(a0, a1);

var _iswblank_l = Module["_iswblank_l"] = (a0, a1) => (_iswblank_l = Module["_iswblank_l"] = wasmExports["iswblank_l"])(a0, a1);

var _iswcntrl = Module["_iswcntrl"] = a0 => (_iswcntrl = Module["_iswcntrl"] = wasmExports["iswcntrl"])(a0);

var ___iswcntrl_l = Module["___iswcntrl_l"] = (a0, a1) => (___iswcntrl_l = Module["___iswcntrl_l"] = wasmExports["__iswcntrl_l"])(a0, a1);

var _iswcntrl_l = Module["_iswcntrl_l"] = (a0, a1) => (_iswcntrl_l = Module["_iswcntrl_l"] = wasmExports["iswcntrl_l"])(a0, a1);

var _iswdigit = Module["_iswdigit"] = a0 => (_iswdigit = Module["_iswdigit"] = wasmExports["iswdigit"])(a0);

var _iswgraph = Module["_iswgraph"] = a0 => (_iswgraph = Module["_iswgraph"] = wasmExports["iswgraph"])(a0);

var _iswlower = Module["_iswlower"] = a0 => (_iswlower = Module["_iswlower"] = wasmExports["iswlower"])(a0);

var _iswprint = Module["_iswprint"] = a0 => (_iswprint = Module["_iswprint"] = wasmExports["iswprint"])(a0);

var _iswpunct = Module["_iswpunct"] = a0 => (_iswpunct = Module["_iswpunct"] = wasmExports["iswpunct"])(a0);

var _iswspace = Module["_iswspace"] = a0 => (_iswspace = Module["_iswspace"] = wasmExports["iswspace"])(a0);

var _iswupper = Module["_iswupper"] = a0 => (_iswupper = Module["_iswupper"] = wasmExports["iswupper"])(a0);

var _iswxdigit = Module["_iswxdigit"] = a0 => (_iswxdigit = Module["_iswxdigit"] = wasmExports["iswxdigit"])(a0);

var ___iswctype_l = Module["___iswctype_l"] = (a0, a1, a2) => (___iswctype_l = Module["___iswctype_l"] = wasmExports["__iswctype_l"])(a0, a1, a2);

var ___wctype_l = Module["___wctype_l"] = (a0, a1) => (___wctype_l = Module["___wctype_l"] = wasmExports["__wctype_l"])(a0, a1);

var _iswctype_l = Module["_iswctype_l"] = (a0, a1, a2) => (_iswctype_l = Module["_iswctype_l"] = wasmExports["iswctype_l"])(a0, a1, a2);

var _wctype_l = Module["_wctype_l"] = (a0, a1) => (_wctype_l = Module["_wctype_l"] = wasmExports["wctype_l"])(a0, a1);

var ___iswdigit_l = Module["___iswdigit_l"] = (a0, a1) => (___iswdigit_l = Module["___iswdigit_l"] = wasmExports["__iswdigit_l"])(a0, a1);

var _iswdigit_l = Module["_iswdigit_l"] = (a0, a1) => (_iswdigit_l = Module["_iswdigit_l"] = wasmExports["iswdigit_l"])(a0, a1);

var ___iswgraph_l = Module["___iswgraph_l"] = (a0, a1) => (___iswgraph_l = Module["___iswgraph_l"] = wasmExports["__iswgraph_l"])(a0, a1);

var _iswgraph_l = Module["_iswgraph_l"] = (a0, a1) => (_iswgraph_l = Module["_iswgraph_l"] = wasmExports["iswgraph_l"])(a0, a1);

var ___iswlower_l = Module["___iswlower_l"] = (a0, a1) => (___iswlower_l = Module["___iswlower_l"] = wasmExports["__iswlower_l"])(a0, a1);

var _iswlower_l = Module["_iswlower_l"] = (a0, a1) => (_iswlower_l = Module["_iswlower_l"] = wasmExports["iswlower_l"])(a0, a1);

var ___iswprint_l = Module["___iswprint_l"] = (a0, a1) => (___iswprint_l = Module["___iswprint_l"] = wasmExports["__iswprint_l"])(a0, a1);

var _iswprint_l = Module["_iswprint_l"] = (a0, a1) => (_iswprint_l = Module["_iswprint_l"] = wasmExports["iswprint_l"])(a0, a1);

var ___iswpunct_l = Module["___iswpunct_l"] = (a0, a1) => (___iswpunct_l = Module["___iswpunct_l"] = wasmExports["__iswpunct_l"])(a0, a1);

var _iswpunct_l = Module["_iswpunct_l"] = (a0, a1) => (_iswpunct_l = Module["_iswpunct_l"] = wasmExports["iswpunct_l"])(a0, a1);

var _wcschr = Module["_wcschr"] = (a0, a1) => (_wcschr = Module["_wcschr"] = wasmExports["wcschr"])(a0, a1);

var ___iswspace_l = Module["___iswspace_l"] = (a0, a1) => (___iswspace_l = Module["___iswspace_l"] = wasmExports["__iswspace_l"])(a0, a1);

var _iswspace_l = Module["_iswspace_l"] = (a0, a1) => (_iswspace_l = Module["_iswspace_l"] = wasmExports["iswspace_l"])(a0, a1);

var ___iswupper_l = Module["___iswupper_l"] = (a0, a1) => (___iswupper_l = Module["___iswupper_l"] = wasmExports["__iswupper_l"])(a0, a1);

var _iswupper_l = Module["_iswupper_l"] = (a0, a1) => (_iswupper_l = Module["_iswupper_l"] = wasmExports["iswupper_l"])(a0, a1);

var ___iswxdigit_l = Module["___iswxdigit_l"] = (a0, a1) => (___iswxdigit_l = Module["___iswxdigit_l"] = wasmExports["__iswxdigit_l"])(a0, a1);

var _iswxdigit_l = Module["_iswxdigit_l"] = (a0, a1) => (_iswxdigit_l = Module["_iswxdigit_l"] = wasmExports["iswxdigit_l"])(a0, a1);

var ___isxdigit_l = Module["___isxdigit_l"] = (a0, a1) => (___isxdigit_l = Module["___isxdigit_l"] = wasmExports["__isxdigit_l"])(a0, a1);

var _isxdigit_l = Module["_isxdigit_l"] = (a0, a1) => (_isxdigit_l = Module["_isxdigit_l"] = wasmExports["isxdigit_l"])(a0, a1);

var _raise = Module["_raise"] = a0 => (_raise = Module["_raise"] = wasmExports["raise"])(a0);

var ___nl_langinfo = Module["___nl_langinfo"] = a0 => (___nl_langinfo = Module["___nl_langinfo"] = wasmExports["__nl_langinfo"])(a0);

var _nl_langinfo_l = Module["_nl_langinfo_l"] = (a0, a1) => (_nl_langinfo_l = Module["_nl_langinfo_l"] = wasmExports["nl_langinfo_l"])(a0, a1);

var _emscripten_has_threading_support = Module["_emscripten_has_threading_support"] = () => (_emscripten_has_threading_support = Module["_emscripten_has_threading_support"] = wasmExports["emscripten_has_threading_support"])();

var _emscripten_num_logical_cores = Module["_emscripten_num_logical_cores"] = () => (_emscripten_num_logical_cores = Module["_emscripten_num_logical_cores"] = wasmExports["emscripten_num_logical_cores"])();

var _emscripten_force_num_logical_cores = Module["_emscripten_force_num_logical_cores"] = a0 => (_emscripten_force_num_logical_cores = Module["_emscripten_force_num_logical_cores"] = wasmExports["emscripten_force_num_logical_cores"])(a0);

var _emscripten_futex_wait = Module["_emscripten_futex_wait"] = (a0, a1, a2) => (_emscripten_futex_wait = Module["_emscripten_futex_wait"] = wasmExports["emscripten_futex_wait"])(a0, a1, a2);

var _emscripten_is_main_runtime_thread = Module["_emscripten_is_main_runtime_thread"] = () => (_emscripten_is_main_runtime_thread = Module["_emscripten_is_main_runtime_thread"] = wasmExports["emscripten_is_main_runtime_thread"])();

var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = () => (_emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = wasmExports["emscripten_main_thread_process_queued_calls"])();

var _emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = () => (_emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = wasmExports["emscripten_current_thread_process_queued_calls"])();

var __emscripten_yield = Module["__emscripten_yield"] = a0 => (__emscripten_yield = Module["__emscripten_yield"] = wasmExports["_emscripten_yield"])(a0);

var _pthread_mutex_init = Module["_pthread_mutex_init"] = (a0, a1) => (_pthread_mutex_init = Module["_pthread_mutex_init"] = wasmExports["pthread_mutex_init"])(a0, a1);

var _pthread_mutex_destroy = Module["_pthread_mutex_destroy"] = a0 => (_pthread_mutex_destroy = Module["_pthread_mutex_destroy"] = wasmExports["pthread_mutex_destroy"])(a0);

var _pthread_mutex_consistent = Module["_pthread_mutex_consistent"] = a0 => (_pthread_mutex_consistent = Module["_pthread_mutex_consistent"] = wasmExports["pthread_mutex_consistent"])(a0);

var _pthread_barrier_init = Module["_pthread_barrier_init"] = (a0, a1, a2) => (_pthread_barrier_init = Module["_pthread_barrier_init"] = wasmExports["pthread_barrier_init"])(a0, a1, a2);

var _pthread_barrier_destroy = Module["_pthread_barrier_destroy"] = a0 => (_pthread_barrier_destroy = Module["_pthread_barrier_destroy"] = wasmExports["pthread_barrier_destroy"])(a0);

var _pthread_barrier_wait = Module["_pthread_barrier_wait"] = a0 => (_pthread_barrier_wait = Module["_pthread_barrier_wait"] = wasmExports["pthread_barrier_wait"])(a0);

var _pthread_getspecific = Module["_pthread_getspecific"] = a0 => (_pthread_getspecific = Module["_pthread_getspecific"] = wasmExports["pthread_getspecific"])(a0);

var _pthread_setspecific = Module["_pthread_setspecific"] = (a0, a1) => (_pthread_setspecific = Module["_pthread_setspecific"] = wasmExports["pthread_setspecific"])(a0, a1);

var _pthread_cond_wait = Module["_pthread_cond_wait"] = (a0, a1) => (_pthread_cond_wait = Module["_pthread_cond_wait"] = wasmExports["pthread_cond_wait"])(a0, a1);

var _pthread_cond_signal = Module["_pthread_cond_signal"] = a0 => (_pthread_cond_signal = Module["_pthread_cond_signal"] = wasmExports["pthread_cond_signal"])(a0);

var _pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = a0 => (_pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = wasmExports["pthread_cond_broadcast"])(a0);

var _pthread_cond_init = Module["_pthread_cond_init"] = (a0, a1) => (_pthread_cond_init = Module["_pthread_cond_init"] = wasmExports["pthread_cond_init"])(a0, a1);

var _pthread_cond_destroy = Module["_pthread_cond_destroy"] = a0 => (_pthread_cond_destroy = Module["_pthread_cond_destroy"] = wasmExports["pthread_cond_destroy"])(a0);

var _pthread_atfork = Module["_pthread_atfork"] = (a0, a1, a2) => (_pthread_atfork = Module["_pthread_atfork"] = wasmExports["pthread_atfork"])(a0, a1, a2);

var _pthread_cancel = Module["_pthread_cancel"] = a0 => (_pthread_cancel = Module["_pthread_cancel"] = wasmExports["pthread_cancel"])(a0);

var _pthread_testcancel = Module["_pthread_testcancel"] = () => (_pthread_testcancel = Module["_pthread_testcancel"] = wasmExports["pthread_testcancel"])();

var ___pthread_detach = Module["___pthread_detach"] = a0 => (___pthread_detach = Module["___pthread_detach"] = wasmExports["__pthread_detach"])(a0);

var _pthread_equal = Module["_pthread_equal"] = (a0, a1) => (_pthread_equal = Module["_pthread_equal"] = wasmExports["pthread_equal"])(a0, a1);

var _pthread_mutexattr_init = Module["_pthread_mutexattr_init"] = a0 => (_pthread_mutexattr_init = Module["_pthread_mutexattr_init"] = wasmExports["pthread_mutexattr_init"])(a0);

var _pthread_mutexattr_setprotocol = Module["_pthread_mutexattr_setprotocol"] = (a0, a1) => (_pthread_mutexattr_setprotocol = Module["_pthread_mutexattr_setprotocol"] = wasmExports["pthread_mutexattr_setprotocol"])(a0, a1);

var _pthread_mutexattr_settype = Module["_pthread_mutexattr_settype"] = (a0, a1) => (_pthread_mutexattr_settype = Module["_pthread_mutexattr_settype"] = wasmExports["pthread_mutexattr_settype"])(a0, a1);

var _pthread_mutexattr_destroy = Module["_pthread_mutexattr_destroy"] = a0 => (_pthread_mutexattr_destroy = Module["_pthread_mutexattr_destroy"] = wasmExports["pthread_mutexattr_destroy"])(a0);

var _pthread_mutexattr_setpshared = Module["_pthread_mutexattr_setpshared"] = (a0, a1) => (_pthread_mutexattr_setpshared = Module["_pthread_mutexattr_setpshared"] = wasmExports["pthread_mutexattr_setpshared"])(a0, a1);

var _pthread_condattr_init = Module["_pthread_condattr_init"] = a0 => (_pthread_condattr_init = Module["_pthread_condattr_init"] = wasmExports["pthread_condattr_init"])(a0);

var _pthread_condattr_destroy = Module["_pthread_condattr_destroy"] = a0 => (_pthread_condattr_destroy = Module["_pthread_condattr_destroy"] = wasmExports["pthread_condattr_destroy"])(a0);

var _pthread_condattr_setclock = Module["_pthread_condattr_setclock"] = (a0, a1) => (_pthread_condattr_setclock = Module["_pthread_condattr_setclock"] = wasmExports["pthread_condattr_setclock"])(a0, a1);

var _pthread_condattr_setpshared = Module["_pthread_condattr_setpshared"] = (a0, a1) => (_pthread_condattr_setpshared = Module["_pthread_condattr_setpshared"] = wasmExports["pthread_condattr_setpshared"])(a0, a1);

var _pthread_getattr_np = Module["_pthread_getattr_np"] = (a0, a1) => (_pthread_getattr_np = Module["_pthread_getattr_np"] = wasmExports["pthread_getattr_np"])(a0, a1);

var _pthread_setcancelstate = Module["_pthread_setcancelstate"] = (a0, a1) => (_pthread_setcancelstate = Module["_pthread_setcancelstate"] = wasmExports["pthread_setcancelstate"])(a0, a1);

var _pthread_setcanceltype = Module["_pthread_setcanceltype"] = (a0, a1) => (_pthread_setcanceltype = Module["_pthread_setcanceltype"] = wasmExports["pthread_setcanceltype"])(a0, a1);

var _pthread_rwlock_init = Module["_pthread_rwlock_init"] = (a0, a1) => (_pthread_rwlock_init = Module["_pthread_rwlock_init"] = wasmExports["pthread_rwlock_init"])(a0, a1);

var _pthread_rwlock_destroy = Module["_pthread_rwlock_destroy"] = a0 => (_pthread_rwlock_destroy = Module["_pthread_rwlock_destroy"] = wasmExports["pthread_rwlock_destroy"])(a0);

var _pthread_rwlock_rdlock = Module["_pthread_rwlock_rdlock"] = a0 => (_pthread_rwlock_rdlock = Module["_pthread_rwlock_rdlock"] = wasmExports["pthread_rwlock_rdlock"])(a0);

var _pthread_rwlock_tryrdlock = Module["_pthread_rwlock_tryrdlock"] = a0 => (_pthread_rwlock_tryrdlock = Module["_pthread_rwlock_tryrdlock"] = wasmExports["pthread_rwlock_tryrdlock"])(a0);

var _pthread_rwlock_timedrdlock = Module["_pthread_rwlock_timedrdlock"] = (a0, a1) => (_pthread_rwlock_timedrdlock = Module["_pthread_rwlock_timedrdlock"] = wasmExports["pthread_rwlock_timedrdlock"])(a0, a1);

var _pthread_rwlock_wrlock = Module["_pthread_rwlock_wrlock"] = a0 => (_pthread_rwlock_wrlock = Module["_pthread_rwlock_wrlock"] = wasmExports["pthread_rwlock_wrlock"])(a0);

var _pthread_rwlock_trywrlock = Module["_pthread_rwlock_trywrlock"] = a0 => (_pthread_rwlock_trywrlock = Module["_pthread_rwlock_trywrlock"] = wasmExports["pthread_rwlock_trywrlock"])(a0);

var _pthread_rwlock_timedwrlock = Module["_pthread_rwlock_timedwrlock"] = (a0, a1) => (_pthread_rwlock_timedwrlock = Module["_pthread_rwlock_timedwrlock"] = wasmExports["pthread_rwlock_timedwrlock"])(a0, a1);

var _pthread_rwlock_unlock = Module["_pthread_rwlock_unlock"] = a0 => (_pthread_rwlock_unlock = Module["_pthread_rwlock_unlock"] = wasmExports["pthread_rwlock_unlock"])(a0);

var _pthread_rwlockattr_init = Module["_pthread_rwlockattr_init"] = a0 => (_pthread_rwlockattr_init = Module["_pthread_rwlockattr_init"] = wasmExports["pthread_rwlockattr_init"])(a0);

var _pthread_rwlockattr_destroy = Module["_pthread_rwlockattr_destroy"] = a0 => (_pthread_rwlockattr_destroy = Module["_pthread_rwlockattr_destroy"] = wasmExports["pthread_rwlockattr_destroy"])(a0);

var _pthread_rwlockattr_setpshared = Module["_pthread_rwlockattr_setpshared"] = (a0, a1) => (_pthread_rwlockattr_setpshared = Module["_pthread_rwlockattr_setpshared"] = wasmExports["pthread_rwlockattr_setpshared"])(a0, a1);

var _pthread_spin_init = Module["_pthread_spin_init"] = (a0, a1) => (_pthread_spin_init = Module["_pthread_spin_init"] = wasmExports["pthread_spin_init"])(a0, a1);

var _pthread_spin_destroy = Module["_pthread_spin_destroy"] = a0 => (_pthread_spin_destroy = Module["_pthread_spin_destroy"] = wasmExports["pthread_spin_destroy"])(a0);

var _pthread_spin_lock = Module["_pthread_spin_lock"] = a0 => (_pthread_spin_lock = Module["_pthread_spin_lock"] = wasmExports["pthread_spin_lock"])(a0);

var _pthread_spin_trylock = Module["_pthread_spin_trylock"] = a0 => (_pthread_spin_trylock = Module["_pthread_spin_trylock"] = wasmExports["pthread_spin_trylock"])(a0);

var _pthread_spin_unlock = Module["_pthread_spin_unlock"] = a0 => (_pthread_spin_unlock = Module["_pthread_spin_unlock"] = wasmExports["pthread_spin_unlock"])(a0);

var _sem_init = Module["_sem_init"] = (a0, a1, a2) => (_sem_init = Module["_sem_init"] = wasmExports["sem_init"])(a0, a1, a2);

var _sem_post = Module["_sem_post"] = a0 => (_sem_post = Module["_sem_post"] = wasmExports["sem_post"])(a0);

var _sem_wait = Module["_sem_wait"] = a0 => (_sem_wait = Module["_sem_wait"] = wasmExports["sem_wait"])(a0);

var _sem_trywait = Module["_sem_trywait"] = a0 => (_sem_trywait = Module["_sem_trywait"] = wasmExports["sem_trywait"])(a0);

var _sem_destroy = Module["_sem_destroy"] = a0 => (_sem_destroy = Module["_sem_destroy"] = wasmExports["sem_destroy"])(a0);

var ___lock = Module["___lock"] = a0 => (___lock = Module["___lock"] = wasmExports["__lock"])(a0);

var ___unlock = Module["___unlock"] = a0 => (___unlock = Module["___unlock"] = wasmExports["__unlock"])(a0);

var _emscripten_thread_sleep = Module["_emscripten_thread_sleep"] = a0 => (_emscripten_thread_sleep = Module["_emscripten_thread_sleep"] = wasmExports["emscripten_thread_sleep"])(a0);

var __emscripten_check_timers = Module["__emscripten_check_timers"] = a0 => (__emscripten_check_timers = Module["__emscripten_check_timers"] = wasmExports["_emscripten_check_timers"])(a0);

var _pthread_mutex_lock = Module["_pthread_mutex_lock"] = a0 => (_pthread_mutex_lock = Module["_pthread_mutex_lock"] = wasmExports["pthread_mutex_lock"])(a0);

var _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = a0 => (_pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = wasmExports["pthread_mutex_unlock"])(a0);

var _pthread_mutex_trylock = Module["_pthread_mutex_trylock"] = a0 => (_pthread_mutex_trylock = Module["_pthread_mutex_trylock"] = wasmExports["pthread_mutex_trylock"])(a0);

var _pthread_mutex_timedlock = Module["_pthread_mutex_timedlock"] = (a0, a1) => (_pthread_mutex_timedlock = Module["_pthread_mutex_timedlock"] = wasmExports["pthread_mutex_timedlock"])(a0, a1);

var _emscripten_builtin_pthread_create = Module["_emscripten_builtin_pthread_create"] = (a0, a1, a2, a3) => (_emscripten_builtin_pthread_create = Module["_emscripten_builtin_pthread_create"] = wasmExports["emscripten_builtin_pthread_create"])(a0, a1, a2, a3);

var _pthread_create = Module["_pthread_create"] = (a0, a1, a2, a3) => (_pthread_create = Module["_pthread_create"] = wasmExports["pthread_create"])(a0, a1, a2, a3);

var _emscripten_builtin_pthread_join = Module["_emscripten_builtin_pthread_join"] = (a0, a1) => (_emscripten_builtin_pthread_join = Module["_emscripten_builtin_pthread_join"] = wasmExports["emscripten_builtin_pthread_join"])(a0, a1);

var _pthread_join = Module["_pthread_join"] = (a0, a1) => (_pthread_join = Module["_pthread_join"] = wasmExports["pthread_join"])(a0, a1);

var _pthread_key_delete = Module["_pthread_key_delete"] = a0 => (_pthread_key_delete = Module["_pthread_key_delete"] = wasmExports["pthread_key_delete"])(a0);

var _pthread_key_create = Module["_pthread_key_create"] = (a0, a1) => (_pthread_key_create = Module["_pthread_key_create"] = wasmExports["pthread_key_create"])(a0, a1);

var _pthread_once = Module["_pthread_once"] = (a0, a1) => (_pthread_once = Module["_pthread_once"] = wasmExports["pthread_once"])(a0, a1);

var _pthread_cond_timedwait = Module["_pthread_cond_timedwait"] = (a0, a1, a2) => (_pthread_cond_timedwait = Module["_pthread_cond_timedwait"] = wasmExports["pthread_cond_timedwait"])(a0, a1, a2);

var _pthread_exit = Module["_pthread_exit"] = a0 => (_pthread_exit = Module["_pthread_exit"] = wasmExports["pthread_exit"])(a0);

var _emscripten_builtin_pthread_detach = Module["_emscripten_builtin_pthread_detach"] = a0 => (_emscripten_builtin_pthread_detach = Module["_emscripten_builtin_pthread_detach"] = wasmExports["emscripten_builtin_pthread_detach"])(a0);

var _pthread_detach = Module["_pthread_detach"] = a0 => (_pthread_detach = Module["_pthread_detach"] = wasmExports["pthread_detach"])(a0);

var _thrd_detach = Module["_thrd_detach"] = a0 => (_thrd_detach = Module["_thrd_detach"] = wasmExports["thrd_detach"])(a0);

var _llrint = Module["_llrint"] = a0 => (_llrint = Module["_llrint"] = wasmExports["llrint"])(a0);

var _llrintf = Module["_llrintf"] = a0 => (_llrintf = Module["_llrintf"] = wasmExports["llrintf"])(a0);

var _llrintl = Module["_llrintl"] = (a0, a1, a2, a3) => (_llrintl = Module["_llrintl"] = wasmExports["llrintl"])(a0, a1, a2, a3);

var _llround = Module["_llround"] = a0 => (_llround = Module["_llround"] = wasmExports["llround"])(a0);

var _llroundf = Module["_llroundf"] = a0 => (_llroundf = Module["_llroundf"] = wasmExports["llroundf"])(a0);

var _llroundl = Module["_llroundl"] = (a0, a1, a2, a3) => (_llroundl = Module["_llroundl"] = wasmExports["llroundl"])(a0, a1, a2, a3);

var _log10 = Module["_log10"] = a0 => (_log10 = Module["_log10"] = wasmExports["log10"])(a0);

var _log10l = Module["_log10l"] = (a0, a1, a2, a3, a4) => (_log10l = Module["_log10l"] = wasmExports["log10l"])(a0, a1, a2, a3, a4);

var _log2 = Module["_log2"] = a0 => (_log2 = Module["_log2"] = wasmExports["log2"])(a0);

var _log2l = Module["_log2l"] = (a0, a1, a2, a3, a4) => (_log2l = Module["_log2l"] = wasmExports["log2l"])(a0, a1, a2, a3, a4);

var _logl = Module["_logl"] = (a0, a1, a2, a3, a4) => (_logl = Module["_logl"] = wasmExports["logl"])(a0, a1, a2, a3, a4);

var _lrint = Module["_lrint"] = a0 => (_lrint = Module["_lrint"] = wasmExports["lrint"])(a0);

var _lrintf = Module["_lrintf"] = a0 => (_lrintf = Module["_lrintf"] = wasmExports["lrintf"])(a0);

var _lrintl = Module["_lrintl"] = (a0, a1, a2, a3) => (_lrintl = Module["_lrintl"] = wasmExports["lrintl"])(a0, a1, a2, a3);

var _lround = Module["_lround"] = a0 => (_lround = Module["_lround"] = wasmExports["lround"])(a0);

var _lroundf = Module["_lroundf"] = a0 => (_lroundf = Module["_lroundf"] = wasmExports["lroundf"])(a0);

var _lroundl = Module["_lroundl"] = (a0, a1, a2, a3) => (_lroundl = Module["_lroundl"] = wasmExports["lroundl"])(a0, a1, a2, a3);

var _mbrtowc = Module["_mbrtowc"] = (a0, a1, a2, a3) => (_mbrtowc = Module["_mbrtowc"] = wasmExports["mbrtowc"])(a0, a1, a2, a3);

var _mbsinit = Module["_mbsinit"] = a0 => (_mbsinit = Module["_mbsinit"] = wasmExports["mbsinit"])(a0);

var _mkostemps = Module["_mkostemps"] = (a0, a1, a2) => (_mkostemps = Module["_mkostemps"] = wasmExports["mkostemps"])(a0, a1, a2);

var _timegm = Module["_timegm"] = a0 => (_timegm = Module["_timegm"] = wasmExports["timegm"])(a0);

var _emscripten_builtin_free = Module["_emscripten_builtin_free"] = a0 => (_emscripten_builtin_free = Module["_emscripten_builtin_free"] = wasmExports["emscripten_builtin_free"])(a0);

var _emscripten_builtin_memalign = (a0, a1) => (_emscripten_builtin_memalign = wasmExports["emscripten_builtin_memalign"])(a0, a1);

var _emscripten_builtin_mmap = Module["_emscripten_builtin_mmap"] = (a0, a1, a2, a3, a4, a5, a6) => (_emscripten_builtin_mmap = Module["_emscripten_builtin_mmap"] = wasmExports["emscripten_builtin_mmap"])(a0, a1, a2, a3, a4, a5, a6);

var _emscripten_builtin_munmap = Module["_emscripten_builtin_munmap"] = (a0, a1) => (_emscripten_builtin_munmap = Module["_emscripten_builtin_munmap"] = wasmExports["emscripten_builtin_munmap"])(a0, a1);

var _nearbyint = Module["_nearbyint"] = a0 => (_nearbyint = Module["_nearbyint"] = wasmExports["nearbyint"])(a0);

var _nearbyintf = Module["_nearbyintf"] = a0 => (_nearbyintf = Module["_nearbyintf"] = wasmExports["nearbyintf"])(a0);

var _nearbyintl = Module["_nearbyintl"] = (a0, a1, a2, a3, a4) => (_nearbyintl = Module["_nearbyintl"] = wasmExports["nearbyintl"])(a0, a1, a2, a3, a4);

var _nextafterl = Module["_nextafterl"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_nextafterl = Module["_nextafterl"] = wasmExports["nextafterl"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _setpriority = Module["_setpriority"] = (a0, a1, a2) => (_setpriority = Module["_setpriority"] = wasmExports["setpriority"])(a0, a1, a2);

var _tcsetattr = Module["_tcsetattr"] = (a0, a1, a2) => (_tcsetattr = Module["_tcsetattr"] = wasmExports["tcsetattr"])(a0, a1, a2);

var _pow = Module["_pow"] = (a0, a1) => (_pow = Module["_pow"] = wasmExports["pow"])(a0, a1);

var _powf = Module["_powf"] = (a0, a1) => (_powf = Module["_powf"] = wasmExports["powf"])(a0, a1);

var _powl = Module["_powl"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_powl = Module["_powl"] = wasmExports["powl"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _iprintf = Module["_iprintf"] = (a0, a1) => (_iprintf = Module["_iprintf"] = wasmExports["iprintf"])(a0, a1);

var ___small_printf = Module["___small_printf"] = (a0, a1) => (___small_printf = Module["___small_printf"] = wasmExports["__small_printf"])(a0, a1);

var _emscripten_main_runtime_thread_id = Module["_emscripten_main_runtime_thread_id"] = () => (_emscripten_main_runtime_thread_id = Module["_emscripten_main_runtime_thread_id"] = wasmExports["emscripten_main_runtime_thread_id"])();

var ___sig_is_blocked = Module["___sig_is_blocked"] = a0 => (___sig_is_blocked = Module["___sig_is_blocked"] = wasmExports["__sig_is_blocked"])(a0);

var _pthread_sigmask = Module["_pthread_sigmask"] = (a0, a1, a2) => (_pthread_sigmask = Module["_pthread_sigmask"] = wasmExports["pthread_sigmask"])(a0, a1, a2);

var _sigpending = Module["_sigpending"] = a0 => (_sigpending = Module["_sigpending"] = wasmExports["sigpending"])(a0);

var _qsort_r = Module["_qsort_r"] = (a0, a1, a2, a3, a4) => (_qsort_r = Module["_qsort_r"] = wasmExports["qsort_r"])(a0, a1, a2, a3, a4);

var _sigismember = Module["_sigismember"] = (a0, a1) => (_sigismember = Module["_sigismember"] = wasmExports["sigismember"])(a0, a1);

var _sigorset = Module["_sigorset"] = (a0, a1, a2) => (_sigorset = Module["_sigorset"] = wasmExports["sigorset"])(a0, a1, a2);

var _sigandset = Module["_sigandset"] = (a0, a1, a2) => (_sigandset = Module["_sigandset"] = wasmExports["sigandset"])(a0, a1, a2);

var _rint = Module["_rint"] = a0 => (_rint = Module["_rint"] = wasmExports["rint"])(a0);

var _rintf = Module["_rintf"] = a0 => (_rintf = Module["_rintf"] = wasmExports["rintf"])(a0);

var _rintl = Module["_rintl"] = (a0, a1, a2, a3, a4) => (_rintl = Module["_rintl"] = wasmExports["rintl"])(a0, a1, a2, a3, a4);

var _round = Module["_round"] = a0 => (_round = Module["_round"] = wasmExports["round"])(a0);

var _roundf = Module["_roundf"] = a0 => (_roundf = Module["_roundf"] = wasmExports["roundf"])(a0);

var _roundl = Module["_roundl"] = (a0, a1, a2, a3, a4) => (_roundl = Module["_roundl"] = wasmExports["roundl"])(a0, a1, a2, a3, a4);

var _emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = () => (_emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = wasmExports["emscripten_get_sbrk_ptr"])();

var _sbrk = Module["_sbrk"] = a0 => (_sbrk = Module["_sbrk"] = wasmExports["sbrk"])(a0);

var _brk = Module["_brk"] = a0 => (_brk = Module["_brk"] = wasmExports["brk"])(a0);

var _scalbn = Module["_scalbn"] = (a0, a1) => (_scalbn = Module["_scalbn"] = wasmExports["scalbn"])(a0, a1);

var _scalbnl = Module["_scalbnl"] = (a0, a1, a2, a3, a4, a5) => (_scalbnl = Module["_scalbnl"] = wasmExports["scalbnl"])(a0, a1, a2, a3, a4, a5);

var ___getitimer = Module["___getitimer"] = (a0, a1, a2) => (___getitimer = Module["___getitimer"] = wasmExports["__getitimer"])(a0, a1, a2);

var __emscripten_timeout = (a0, a1) => (__emscripten_timeout = wasmExports["_emscripten_timeout"])(a0, a1);

var _bsd_signal = Module["_bsd_signal"] = (a0, a1) => (_bsd_signal = Module["_bsd_signal"] = wasmExports["bsd_signal"])(a0, a1);

var ___sysv_signal = Module["___sysv_signal"] = (a0, a1) => (___sysv_signal = Module["___sysv_signal"] = wasmExports["__sysv_signal"])(a0, a1);

var _sin = Module["_sin"] = a0 => (_sin = Module["_sin"] = wasmExports["sin"])(a0);

var _sinf = Module["_sinf"] = a0 => (_sinf = Module["_sinf"] = wasmExports["sinf"])(a0);

var _sinl = Module["_sinl"] = (a0, a1, a2, a3, a4) => (_sinl = Module["_sinl"] = wasmExports["sinl"])(a0, a1, a2, a3, a4);

var _vsprintf = Module["_vsprintf"] = (a0, a1, a2) => (_vsprintf = Module["_vsprintf"] = wasmExports["vsprintf"])(a0, a1, a2);

var _siprintf = Module["_siprintf"] = (a0, a1, a2) => (_siprintf = Module["_siprintf"] = wasmExports["siprintf"])(a0, a1, a2);

var _vsiprintf = Module["_vsiprintf"] = (a0, a1, a2) => (_vsiprintf = Module["_vsiprintf"] = wasmExports["vsiprintf"])(a0, a1, a2);

var ___small_sprintf = Module["___small_sprintf"] = (a0, a1, a2) => (___small_sprintf = Module["___small_sprintf"] = wasmExports["__small_sprintf"])(a0, a1, a2);

var ___small_vsprintf = Module["___small_vsprintf"] = (a0, a1, a2) => (___small_vsprintf = Module["___small_vsprintf"] = wasmExports["__small_vsprintf"])(a0, a1, a2);

var _sqrtf = Module["_sqrtf"] = a0 => (_sqrtf = Module["_sqrtf"] = wasmExports["sqrtf"])(a0);

var _sqrtl = Module["_sqrtl"] = (a0, a1, a2, a3, a4) => (_sqrtl = Module["_sqrtl"] = wasmExports["sqrtl"])(a0, a1, a2, a3, a4);

var _vsscanf = Module["_vsscanf"] = (a0, a1, a2) => (_vsscanf = Module["_vsscanf"] = wasmExports["vsscanf"])(a0, a1, a2);

var ___isoc99_sscanf = Module["___isoc99_sscanf"] = (a0, a1, a2) => (___isoc99_sscanf = Module["___isoc99_sscanf"] = wasmExports["__isoc99_sscanf"])(a0, a1, a2);

var _fstatvfs = Module["_fstatvfs"] = (a0, a1) => (_fstatvfs = Module["_fstatvfs"] = wasmExports["fstatvfs"])(a0, a1);

var _statfs = Module["_statfs"] = (a0, a1) => (_statfs = Module["_statfs"] = wasmExports["statfs"])(a0, a1);

var _fstatfs = Module["_fstatfs"] = (a0, a1) => (_fstatfs = Module["_fstatfs"] = wasmExports["fstatfs"])(a0, a1);

var _stpcpy = Module["_stpcpy"] = (a0, a1) => (_stpcpy = Module["_stpcpy"] = wasmExports["stpcpy"])(a0, a1);

var _stpncpy = Module["_stpncpy"] = (a0, a1, a2) => (_stpncpy = Module["_stpncpy"] = wasmExports["stpncpy"])(a0, a1, a2);

var ___strcasecmp_l = Module["___strcasecmp_l"] = (a0, a1, a2) => (___strcasecmp_l = Module["___strcasecmp_l"] = wasmExports["__strcasecmp_l"])(a0, a1, a2);

var _strcasecmp_l = Module["_strcasecmp_l"] = (a0, a1, a2) => (_strcasecmp_l = Module["_strcasecmp_l"] = wasmExports["strcasecmp_l"])(a0, a1, a2);

var _strchrnul = Module["_strchrnul"] = (a0, a1) => (_strchrnul = Module["_strchrnul"] = wasmExports["strchrnul"])(a0, a1);

var ___strcoll_l = Module["___strcoll_l"] = (a0, a1, a2) => (___strcoll_l = Module["___strcoll_l"] = wasmExports["__strcoll_l"])(a0, a1, a2);

var _strcoll_l = Module["_strcoll_l"] = (a0, a1, a2) => (_strcoll_l = Module["_strcoll_l"] = wasmExports["strcoll_l"])(a0, a1, a2);

var ___strerror_l = Module["___strerror_l"] = (a0, a1) => (___strerror_l = Module["___strerror_l"] = wasmExports["__strerror_l"])(a0, a1);

var _strerror_l = Module["_strerror_l"] = (a0, a1) => (_strerror_l = Module["_strerror_l"] = wasmExports["strerror_l"])(a0, a1);

var ___xpg_strerror_r = Module["___xpg_strerror_r"] = (a0, a1, a2) => (___xpg_strerror_r = Module["___xpg_strerror_r"] = wasmExports["__xpg_strerror_r"])(a0, a1, a2);

var ___strncasecmp_l = Module["___strncasecmp_l"] = (a0, a1, a2, a3) => (___strncasecmp_l = Module["___strncasecmp_l"] = wasmExports["__strncasecmp_l"])(a0, a1, a2, a3);

var _strncasecmp_l = Module["_strncasecmp_l"] = (a0, a1, a2, a3) => (_strncasecmp_l = Module["_strncasecmp_l"] = wasmExports["strncasecmp_l"])(a0, a1, a2, a3);

var _strtof = Module["_strtof"] = (a0, a1) => (_strtof = Module["_strtof"] = wasmExports["strtof"])(a0, a1);

var _strtold = Module["_strtold"] = (a0, a1, a2) => (_strtold = Module["_strtold"] = wasmExports["strtold"])(a0, a1, a2);

var ___eqtf2 = Module["___eqtf2"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (___eqtf2 = Module["___eqtf2"] = wasmExports["__eqtf2"])(a0, a1, a2, a3, a4, a5, a6, a7);

var ___multf3 = Module["___multf3"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (___multf3 = Module["___multf3"] = wasmExports["__multf3"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var ___divtf3 = Module["___divtf3"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (___divtf3 = Module["___divtf3"] = wasmExports["__divtf3"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var ___letf2 = Module["___letf2"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (___letf2 = Module["___letf2"] = wasmExports["__letf2"])(a0, a1, a2, a3, a4, a5, a6, a7);

var ___netf2 = Module["___netf2"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (___netf2 = Module["___netf2"] = wasmExports["__netf2"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _strtoull = Module["_strtoull"] = (a0, a1, a2) => (_strtoull = Module["_strtoull"] = wasmExports["strtoull"])(a0, a1, a2);

var _strtoimax = Module["_strtoimax"] = (a0, a1, a2) => (_strtoimax = Module["_strtoimax"] = wasmExports["strtoimax"])(a0, a1, a2);

var _strtoumax = Module["_strtoumax"] = (a0, a1, a2) => (_strtoumax = Module["_strtoumax"] = wasmExports["strtoumax"])(a0, a1, a2);

var ___strtol_internal = Module["___strtol_internal"] = (a0, a1, a2) => (___strtol_internal = Module["___strtol_internal"] = wasmExports["__strtol_internal"])(a0, a1, a2);

var ___strtoul_internal = Module["___strtoul_internal"] = (a0, a1, a2) => (___strtoul_internal = Module["___strtoul_internal"] = wasmExports["__strtoul_internal"])(a0, a1, a2);

var ___strtoll_internal = Module["___strtoll_internal"] = (a0, a1, a2) => (___strtoll_internal = Module["___strtoll_internal"] = wasmExports["__strtoll_internal"])(a0, a1, a2);

var ___strtoull_internal = Module["___strtoull_internal"] = (a0, a1, a2) => (___strtoull_internal = Module["___strtoull_internal"] = wasmExports["__strtoull_internal"])(a0, a1, a2);

var ___strtoimax_internal = Module["___strtoimax_internal"] = (a0, a1, a2) => (___strtoimax_internal = Module["___strtoimax_internal"] = wasmExports["__strtoimax_internal"])(a0, a1, a2);

var ___strtoumax_internal = Module["___strtoumax_internal"] = (a0, a1, a2) => (___strtoumax_internal = Module["___strtoumax_internal"] = wasmExports["__strtoumax_internal"])(a0, a1, a2);

var _setlogmask = Module["_setlogmask"] = a0 => (_setlogmask = Module["_setlogmask"] = wasmExports["setlogmask"])(a0);

var _vdprintf = Module["_vdprintf"] = (a0, a1, a2) => (_vdprintf = Module["_vdprintf"] = wasmExports["vdprintf"])(a0, a1, a2);

var _vsyslog = Module["_vsyslog"] = (a0, a1, a2) => (_vsyslog = Module["_vsyslog"] = wasmExports["vsyslog"])(a0, a1, a2);

var ___tolower_l = Module["___tolower_l"] = (a0, a1) => (___tolower_l = Module["___tolower_l"] = wasmExports["__tolower_l"])(a0, a1);

var _tolower_l = Module["_tolower_l"] = (a0, a1) => (_tolower_l = Module["_tolower_l"] = wasmExports["tolower_l"])(a0, a1);

var ___toupper_l = Module["___toupper_l"] = (a0, a1) => (___toupper_l = Module["___toupper_l"] = wasmExports["__toupper_l"])(a0, a1);

var _toupper_l = Module["_toupper_l"] = (a0, a1) => (_toupper_l = Module["_toupper_l"] = wasmExports["toupper_l"])(a0, a1);

var ___towupper_l = Module["___towupper_l"] = (a0, a1) => (___towupper_l = Module["___towupper_l"] = wasmExports["__towupper_l"])(a0, a1);

var ___towlower_l = Module["___towlower_l"] = (a0, a1) => (___towlower_l = Module["___towlower_l"] = wasmExports["__towlower_l"])(a0, a1);

var _towupper_l = Module["_towupper_l"] = (a0, a1) => (_towupper_l = Module["_towupper_l"] = wasmExports["towupper_l"])(a0, a1);

var _towlower_l = Module["_towlower_l"] = (a0, a1) => (_towlower_l = Module["_towlower_l"] = wasmExports["towlower_l"])(a0, a1);

var _trunc = Module["_trunc"] = a0 => (_trunc = Module["_trunc"] = wasmExports["trunc"])(a0);

var _truncf = Module["_truncf"] = a0 => (_truncf = Module["_truncf"] = wasmExports["truncf"])(a0);

var _truncl = Module["_truncl"] = (a0, a1, a2, a3, a4) => (_truncl = Module["_truncl"] = wasmExports["truncl"])(a0, a1, a2, a3, a4);

var _utimensat = Module["_utimensat"] = (a0, a1, a2, a3) => (_utimensat = Module["_utimensat"] = wasmExports["utimensat"])(a0, a1, a2, a3);

var ___vfprintf_internal = Module["___vfprintf_internal"] = (a0, a1, a2, a3, a4) => (___vfprintf_internal = Module["___vfprintf_internal"] = wasmExports["__vfprintf_internal"])(a0, a1, a2, a3, a4);

var _wctomb = Module["_wctomb"] = (a0, a1) => (_wctomb = Module["_wctomb"] = wasmExports["wctomb"])(a0, a1);

var _vfscanf = Module["_vfscanf"] = (a0, a1, a2) => (_vfscanf = Module["_vfscanf"] = wasmExports["vfscanf"])(a0, a1, a2);

var ___isoc99_vfscanf = Module["___isoc99_vfscanf"] = (a0, a1, a2) => (___isoc99_vfscanf = Module["___isoc99_vfscanf"] = wasmExports["__isoc99_vfscanf"])(a0, a1, a2);

var _vsniprintf = Module["_vsniprintf"] = (a0, a1, a2, a3) => (_vsniprintf = Module["_vsniprintf"] = wasmExports["vsniprintf"])(a0, a1, a2, a3);

var ___small_vsnprintf = Module["___small_vsnprintf"] = (a0, a1, a2, a3) => (___small_vsnprintf = Module["___small_vsnprintf"] = wasmExports["__small_vsnprintf"])(a0, a1, a2, a3);

var ___isoc99_vsscanf = Module["___isoc99_vsscanf"] = (a0, a1, a2) => (___isoc99_vsscanf = Module["___isoc99_vsscanf"] = wasmExports["__isoc99_vsscanf"])(a0, a1, a2);

var _wcrtomb = Module["_wcrtomb"] = (a0, a1, a2) => (_wcrtomb = Module["_wcrtomb"] = wasmExports["wcrtomb"])(a0, a1, a2);

var _wcslen = Module["_wcslen"] = a0 => (_wcslen = Module["_wcslen"] = wasmExports["wcslen"])(a0);

var ___libc_calloc = Module["___libc_calloc"] = (a0, a1) => (___libc_calloc = Module["___libc_calloc"] = wasmExports["__libc_calloc"])(a0, a1);

var ___libc_realloc = Module["___libc_realloc"] = (a0, a1) => (___libc_realloc = Module["___libc_realloc"] = wasmExports["__libc_realloc"])(a0, a1);

var _realloc_in_place = Module["_realloc_in_place"] = (a0, a1) => (_realloc_in_place = Module["_realloc_in_place"] = wasmExports["realloc_in_place"])(a0, a1);

var _memalign = Module["_memalign"] = (a0, a1) => (_memalign = Module["_memalign"] = wasmExports["memalign"])(a0, a1);

var _posix_memalign = Module["_posix_memalign"] = (a0, a1, a2) => (_posix_memalign = Module["_posix_memalign"] = wasmExports["posix_memalign"])(a0, a1, a2);

var _valloc = Module["_valloc"] = a0 => (_valloc = Module["_valloc"] = wasmExports["valloc"])(a0);

var _pvalloc = Module["_pvalloc"] = a0 => (_pvalloc = Module["_pvalloc"] = wasmExports["pvalloc"])(a0);

var _mallinfo = Module["_mallinfo"] = a0 => (_mallinfo = Module["_mallinfo"] = wasmExports["mallinfo"])(a0);

var _mallopt = Module["_mallopt"] = (a0, a1) => (_mallopt = Module["_mallopt"] = wasmExports["mallopt"])(a0, a1);

var _malloc_trim = Module["_malloc_trim"] = a0 => (_malloc_trim = Module["_malloc_trim"] = wasmExports["malloc_trim"])(a0);

var _malloc_usable_size = Module["_malloc_usable_size"] = a0 => (_malloc_usable_size = Module["_malloc_usable_size"] = wasmExports["malloc_usable_size"])(a0);

var _malloc_footprint = Module["_malloc_footprint"] = () => (_malloc_footprint = Module["_malloc_footprint"] = wasmExports["malloc_footprint"])();

var _malloc_max_footprint = Module["_malloc_max_footprint"] = () => (_malloc_max_footprint = Module["_malloc_max_footprint"] = wasmExports["malloc_max_footprint"])();

var _malloc_footprint_limit = Module["_malloc_footprint_limit"] = () => (_malloc_footprint_limit = Module["_malloc_footprint_limit"] = wasmExports["malloc_footprint_limit"])();

var _malloc_set_footprint_limit = Module["_malloc_set_footprint_limit"] = a0 => (_malloc_set_footprint_limit = Module["_malloc_set_footprint_limit"] = wasmExports["malloc_set_footprint_limit"])(a0);

var _independent_calloc = Module["_independent_calloc"] = (a0, a1, a2) => (_independent_calloc = Module["_independent_calloc"] = wasmExports["independent_calloc"])(a0, a1, a2);

var _independent_comalloc = Module["_independent_comalloc"] = (a0, a1, a2) => (_independent_comalloc = Module["_independent_comalloc"] = wasmExports["independent_comalloc"])(a0, a1, a2);

var _bulk_free = Module["_bulk_free"] = (a0, a1) => (_bulk_free = Module["_bulk_free"] = wasmExports["bulk_free"])(a0, a1);

var ___addtf3 = Module["___addtf3"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (___addtf3 = Module["___addtf3"] = wasmExports["__addtf3"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var ___ashlti3 = Module["___ashlti3"] = (a0, a1, a2, a3, a4, a5) => (___ashlti3 = Module["___ashlti3"] = wasmExports["__ashlti3"])(a0, a1, a2, a3, a4, a5);

var ___getf2 = Module["___getf2"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (___getf2 = Module["___getf2"] = wasmExports["__getf2"])(a0, a1, a2, a3, a4, a5, a6, a7);

var ___unordtf2 = Module["___unordtf2"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (___unordtf2 = Module["___unordtf2"] = wasmExports["__unordtf2"])(a0, a1, a2, a3, a4, a5, a6, a7);

var ___lttf2 = Module["___lttf2"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (___lttf2 = Module["___lttf2"] = wasmExports["__lttf2"])(a0, a1, a2, a3, a4, a5, a6, a7);

var ___gttf2 = Module["___gttf2"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (___gttf2 = Module["___gttf2"] = wasmExports["__gttf2"])(a0, a1, a2, a3, a4, a5, a6, a7);

var ___multi3 = Module["___multi3"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (___multi3 = Module["___multi3"] = wasmExports["__multi3"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var ___lshrti3 = Module["___lshrti3"] = (a0, a1, a2, a3, a4, a5) => (___lshrti3 = Module["___lshrti3"] = wasmExports["__lshrti3"])(a0, a1, a2, a3, a4, a5);

var _setThrew = (a0, a1) => (_setThrew = wasmExports["setThrew"])(a0, a1);

var _saveSetjmp = Module["_saveSetjmp"] = (a0, a1, a2, a3) => (_saveSetjmp = Module["_saveSetjmp"] = wasmExports["saveSetjmp"])(a0, a1, a2, a3);

var _testSetjmp = Module["_testSetjmp"] = (a0, a1, a2) => (_testSetjmp = Module["_testSetjmp"] = wasmExports["testSetjmp"])(a0, a1, a2);

var _emscripten_longjmp = Module["_emscripten_longjmp"] = (a0, a1) => (_emscripten_longjmp = Module["_emscripten_longjmp"] = wasmExports["emscripten_longjmp"])(a0, a1);

var setTempRet0 = a0 => (setTempRet0 = wasmExports["setTempRet0"])(a0);

var getTempRet0 = () => (getTempRet0 = wasmExports["getTempRet0"])();

var ___extenddftf2 = Module["___extenddftf2"] = (a0, a1) => (___extenddftf2 = Module["___extenddftf2"] = wasmExports["__extenddftf2"])(a0, a1);

var ___extendsftf2 = Module["___extendsftf2"] = (a0, a1) => (___extendsftf2 = Module["___extendsftf2"] = wasmExports["__extendsftf2"])(a0, a1);

var ___fixtfdi = Module["___fixtfdi"] = (a0, a1, a2, a3) => (___fixtfdi = Module["___fixtfdi"] = wasmExports["__fixtfdi"])(a0, a1, a2, a3);

var ___fixtfsi = Module["___fixtfsi"] = (a0, a1, a2, a3) => (___fixtfsi = Module["___fixtfsi"] = wasmExports["__fixtfsi"])(a0, a1, a2, a3);

var ___floatsitf = Module["___floatsitf"] = (a0, a1) => (___floatsitf = Module["___floatsitf"] = wasmExports["__floatsitf"])(a0, a1);

var ___floatunsitf = Module["___floatunsitf"] = (a0, a1) => (___floatunsitf = Module["___floatunsitf"] = wasmExports["__floatunsitf"])(a0, a1);

var ___fe_getround = Module["___fe_getround"] = () => (___fe_getround = Module["___fe_getround"] = wasmExports["__fe_getround"])();

var ___fe_raise_inexact = Module["___fe_raise_inexact"] = () => (___fe_raise_inexact = Module["___fe_raise_inexact"] = wasmExports["__fe_raise_inexact"])();

var stackSave = () => (stackSave = wasmExports["stackSave"])();

var stackRestore = a0 => (stackRestore = wasmExports["stackRestore"])(a0);

var stackAlloc = a0 => (stackAlloc = wasmExports["stackAlloc"])(a0);

var _emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = () => (_emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = wasmExports["emscripten_stack_get_current"])();

var ___subtf3 = Module["___subtf3"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (___subtf3 = Module["___subtf3"] = wasmExports["__subtf3"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var ___trunctfdf2 = Module["___trunctfdf2"] = (a0, a1, a2, a3) => (___trunctfdf2 = Module["___trunctfdf2"] = wasmExports["__trunctfdf2"])(a0, a1, a2, a3);

var ___trunctfsf2 = Module["___trunctfsf2"] = (a0, a1, a2, a3) => (___trunctfsf2 = Module["___trunctfsf2"] = wasmExports["__trunctfsf2"])(a0, a1, a2, a3);

var dynCall_vi = Module["dynCall_vi"] = (a0, a1) => (dynCall_vi = Module["dynCall_vi"] = wasmExports["dynCall_vi"])(a0, a1);

var dynCall_iii = Module["dynCall_iii"] = (a0, a1, a2) => (dynCall_iii = Module["dynCall_iii"] = wasmExports["dynCall_iii"])(a0, a1, a2);

var dynCall_ji = Module["dynCall_ji"] = (a0, a1) => (dynCall_ji = Module["dynCall_ji"] = wasmExports["dynCall_ji"])(a0, a1);

var dynCall_ii = Module["dynCall_ii"] = (a0, a1) => (dynCall_ii = Module["dynCall_ii"] = wasmExports["dynCall_ii"])(a0, a1);

var dynCall_iiii = Module["dynCall_iiii"] = (a0, a1, a2, a3) => (dynCall_iiii = Module["dynCall_iiii"] = wasmExports["dynCall_iiii"])(a0, a1, a2, a3);

var dynCall_iiiii = Module["dynCall_iiiii"] = (a0, a1, a2, a3, a4) => (dynCall_iiiii = Module["dynCall_iiiii"] = wasmExports["dynCall_iiiii"])(a0, a1, a2, a3, a4);

var dynCall_iiiiii = Module["dynCall_iiiiii"] = (a0, a1, a2, a3, a4, a5) => (dynCall_iiiiii = Module["dynCall_iiiiii"] = wasmExports["dynCall_iiiiii"])(a0, a1, a2, a3, a4, a5);

var dynCall_vii = Module["dynCall_vii"] = (a0, a1, a2) => (dynCall_vii = Module["dynCall_vii"] = wasmExports["dynCall_vii"])(a0, a1, a2);

var dynCall_iij = Module["dynCall_iij"] = (a0, a1, a2, a3) => (dynCall_iij = Module["dynCall_iij"] = wasmExports["dynCall_iij"])(a0, a1, a2, a3);

var dynCall_viii = Module["dynCall_viii"] = (a0, a1, a2, a3) => (dynCall_viii = Module["dynCall_viii"] = wasmExports["dynCall_viii"])(a0, a1, a2, a3);

var dynCall_jiijii = Module["dynCall_jiijii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_jiijii = Module["dynCall_jiijii"] = wasmExports["dynCall_jiijii"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_vij = Module["dynCall_vij"] = (a0, a1, a2, a3) => (dynCall_vij = Module["dynCall_vij"] = wasmExports["dynCall_vij"])(a0, a1, a2, a3);

var dynCall_viiijii = Module["dynCall_viiijii"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (dynCall_viiijii = Module["dynCall_viiijii"] = wasmExports["dynCall_viiijii"])(a0, a1, a2, a3, a4, a5, a6, a7);

var dynCall_v = Module["dynCall_v"] = a0 => (dynCall_v = Module["dynCall_v"] = wasmExports["dynCall_v"])(a0);

var dynCall_i = Module["dynCall_i"] = a0 => (dynCall_i = Module["dynCall_i"] = wasmExports["dynCall_i"])(a0);

var dynCall_viiii = Module["dynCall_viiii"] = (a0, a1, a2, a3, a4) => (dynCall_viiii = Module["dynCall_viiii"] = wasmExports["dynCall_viiii"])(a0, a1, a2, a3, a4);

var dynCall_jiji = Module["dynCall_jiji"] = (a0, a1, a2, a3, a4) => (dynCall_jiji = Module["dynCall_jiji"] = wasmExports["dynCall_jiji"])(a0, a1, a2, a3, a4);

var dynCall_viiiii = Module["dynCall_viiiii"] = (a0, a1, a2, a3, a4, a5) => (dynCall_viiiii = Module["dynCall_viiiii"] = wasmExports["dynCall_viiiii"])(a0, a1, a2, a3, a4, a5);

var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = wasmExports["dynCall_iiiiiiii"])(a0, a1, a2, a3, a4, a5, a6, a7);

var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = wasmExports["dynCall_viiiiiiii"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var dynCall_viiiiii = Module["dynCall_viiiiii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_viiiiii = Module["dynCall_viiiiii"] = wasmExports["dynCall_viiiiii"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = wasmExports["dynCall_iiiiiiiiii"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var dynCall_iiiiiij = Module["dynCall_iiiiiij"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (dynCall_iiiiiij = Module["dynCall_iiiiiij"] = wasmExports["dynCall_iiiiiij"])(a0, a1, a2, a3, a4, a5, a6, a7);

var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iiiiiii = Module["dynCall_iiiiiii"] = wasmExports["dynCall_iiiiiii"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_jiiiji = Module["dynCall_jiiiji"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_jiiiji = Module["dynCall_jiiiji"] = wasmExports["dynCall_jiiiji"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_jiiji = Module["dynCall_jiiji"] = (a0, a1, a2, a3, a4, a5) => (dynCall_jiiji = Module["dynCall_jiiji"] = wasmExports["dynCall_jiiji"])(a0, a1, a2, a3, a4, a5);

var dynCall_vidi = Module["dynCall_vidi"] = (a0, a1, a2, a3) => (dynCall_vidi = Module["dynCall_vidi"] = wasmExports["dynCall_vidi"])(a0, a1, a2, a3);

var dynCall_iidiiii = Module["dynCall_iidiiii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iidiiii = Module["dynCall_iidiiii"] = wasmExports["dynCall_iidiiii"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_jj = Module["dynCall_jj"] = (a0, a1, a2) => (dynCall_jj = Module["dynCall_jj"] = wasmExports["dynCall_jj"])(a0, a1, a2);

var dynCall_iiij = Module["dynCall_iiij"] = (a0, a1, a2, a3, a4) => (dynCall_iiij = Module["dynCall_iiij"] = wasmExports["dynCall_iiij"])(a0, a1, a2, a3, a4);

var dynCall_jiij = Module["dynCall_jiij"] = (a0, a1, a2, a3, a4) => (dynCall_jiij = Module["dynCall_jiij"] = wasmExports["dynCall_jiij"])(a0, a1, a2, a3, a4);

var dynCall_iiiji = Module["dynCall_iiiji"] = (a0, a1, a2, a3, a4, a5) => (dynCall_iiiji = Module["dynCall_iiiji"] = wasmExports["dynCall_iiiji"])(a0, a1, a2, a3, a4, a5);

var dynCall_jii = Module["dynCall_jii"] = (a0, a1, a2) => (dynCall_jii = Module["dynCall_jii"] = wasmExports["dynCall_jii"])(a0, a1, a2);

var _asyncify_start_unwind = a0 => (_asyncify_start_unwind = wasmExports["asyncify_start_unwind"])(a0);

var _asyncify_stop_unwind = () => (_asyncify_stop_unwind = wasmExports["asyncify_stop_unwind"])();

var _asyncify_start_rewind = a0 => (_asyncify_start_rewind = wasmExports["asyncify_start_rewind"])(a0);

var _asyncify_stop_rewind = () => (_asyncify_stop_rewind = wasmExports["asyncify_stop_rewind"])();

var _executor_globals = Module["_executor_globals"] = 1283744;

var _zend_empty_string = Module["_zend_empty_string"] = 1284944;

var _std_object_handlers = Module["_std_object_handlers"] = 1122860;

var _zend_ce_aggregate = Module["_zend_ce_aggregate"] = 1274744;

var _zend_ce_error = Module["_zend_ce_error"] = 1283084;

var _zend_ce_exception = Module["_zend_ce_exception"] = 1278276;

var _zend_string_init_interned = Module["_zend_string_init_interned"] = 1283736;

var _basic_globals = Module["_basic_globals"] = 1269568;

var _pcre_globals = Module["_pcre_globals"] = 1188056;

var _zend_one_char_string = Module["_zend_one_char_string"] = 1274912;

var _sapi_module = Module["_sapi_module"] = 1271148;

var _php_hashcontext_ce = Module["_php_hashcontext_ce"] = 1188272;

var _file_globals = Module["_file_globals"] = 1271440;

var _compiler_globals = Module["_compiler_globals"] = 1284948;

var _zend_known_strings = Module["_zend_known_strings"] = 1282956;

var _zend_ce_value_error = Module["_zend_ce_value_error"] = 1273748;

var _json_globals = Module["_json_globals"] = 1188376;

var _php_json_exception_ce = Module["_php_json_exception_ce"] = 1188388;

var _php_json_serializable_ce = Module["_php_json_serializable_ce"] = 1191152;

var _core_globals = Module["_core_globals"] = 1283272;

var _zend_empty_array = Module["_zend_empty_array"] = 1122420;

var _module_registry = Module["_module_registry"] = 1283224;

var _spl_ce_RuntimeException = Module["_spl_ce_RuntimeException"] = 1191256;

var _zend_observer_fcall_op_array_extension = Module["_zend_observer_fcall_op_array_extension"] = 1283672;

var _zend_standard_class_def = Module["_zend_standard_class_def"] = 1272948;

var _sapi_globals = Module["_sapi_globals"] = 1285296;

var _ps_globals = Module["_ps_globals"] = 1189608;

var _random_ce_Random_BrokenRandomEngineError = Module["_random_ce_Random_BrokenRandomEngineError"] = 1261044;

var _php_random_algo_mt19937 = Module["_php_random_algo_mt19937"] = 808412;

var _random_globals = Module["_random_globals"] = 1189324;

var _php_random_algo_combinedlcg = Module["_php_random_algo_combinedlcg"] = 808224;

var _random_ce_Random_Engine = Module["_random_ce_Random_Engine"] = 1189344;

var _random_ce_Random_CryptoSafeEngine = Module["_random_ce_Random_CryptoSafeEngine"] = 1188804;

var _random_ce_Random_RandomError = Module["_random_ce_Random_RandomError"] = 1188808;

var _random_ce_Random_RandomException = Module["_random_ce_Random_RandomException"] = 1189360;

var _random_ce_Random_Engine_Mt19937 = Module["_random_ce_Random_Engine_Mt19937"] = 1188812;

var _random_ce_Random_Engine_PcgOneseq128XslRr64 = Module["_random_ce_Random_Engine_PcgOneseq128XslRr64"] = 1188916;

var _random_ce_Random_Engine_Xoshiro256StarStar = Module["_random_ce_Random_Engine_Xoshiro256StarStar"] = 1189020;

var _random_ce_Random_Engine_Secure = Module["_random_ce_Random_Engine_Secure"] = 1189348;

var _random_ce_Random_Randomizer = Module["_random_ce_Random_Randomizer"] = 1189352;

var _random_ce_Random_IntervalBoundary = Module["_random_ce_Random_IntervalBoundary"] = 1189356;

var _php_random_algo_pcgoneseq128xslrr64 = Module["_php_random_algo_pcgoneseq128xslrr64"] = 808252;

var _php_random_algo_xoshiro256starstar = Module["_php_random_algo_xoshiro256starstar"] = 808280;

var _php_random_algo_secure = Module["_php_random_algo_secure"] = 808384;

var _php_random_algo_user = Module["_php_random_algo_user"] = 808440;

var _reflection_enum_ptr = Module["_reflection_enum_ptr"] = 1189364;

var _reflection_class_ptr = Module["_reflection_class_ptr"] = 1189368;

var _reflection_exception_ptr = Module["_reflection_exception_ptr"] = 1189372;

var _zend_ce_closure = Module["_zend_ce_closure"] = 1283684;

var _zend_ce_generator = Module["_zend_ce_generator"] = 1283688;

var _zend_ce_traversable = Module["_zend_ce_traversable"] = 1273520;

var _reflection_reference_ptr = Module["_reflection_reference_ptr"] = 1189376;

var _zend_ce_fiber = Module["_zend_ce_fiber"] = 1282976;

var _reflection_ptr = Module["_reflection_ptr"] = 1189500;

var _zend_ce_stringable = Module["_zend_ce_stringable"] = 1282412;

var _reflector_ptr = Module["_reflector_ptr"] = 1189504;

var _reflection_function_abstract_ptr = Module["_reflection_function_abstract_ptr"] = 1189508;

var _reflection_function_ptr = Module["_reflection_function_ptr"] = 1189512;

var _reflection_generator_ptr = Module["_reflection_generator_ptr"] = 1189516;

var _reflection_parameter_ptr = Module["_reflection_parameter_ptr"] = 1189520;

var _reflection_type_ptr = Module["_reflection_type_ptr"] = 1189524;

var _reflection_named_type_ptr = Module["_reflection_named_type_ptr"] = 1189528;

var _reflection_union_type_ptr = Module["_reflection_union_type_ptr"] = 1189532;

var _reflection_intersection_type_ptr = Module["_reflection_intersection_type_ptr"] = 1189536;

var _reflection_method_ptr = Module["_reflection_method_ptr"] = 1189540;

var _reflection_object_ptr = Module["_reflection_object_ptr"] = 1189544;

var _reflection_property_ptr = Module["_reflection_property_ptr"] = 1189548;

var _reflection_class_constant_ptr = Module["_reflection_class_constant_ptr"] = 1189552;

var _reflection_extension_ptr = Module["_reflection_extension_ptr"] = 1189556;

var _reflection_zend_extension_ptr = Module["_reflection_zend_extension_ptr"] = 1189560;

var _reflection_attribute_ptr = Module["_reflection_attribute_ptr"] = 1189564;

var _reflection_enum_unit_case_ptr = Module["_reflection_enum_unit_case_ptr"] = 1189568;

var _reflection_enum_backed_case_ptr = Module["_reflection_enum_backed_case_ptr"] = 1189572;

var _reflection_fiber_ptr = Module["_reflection_fiber_ptr"] = 1189576;

var _php_session_iface_entry = Module["_php_session_iface_entry"] = 1189580;

var _php_session_id_iface_entry = Module["_php_session_id_iface_entry"] = 1189584;

var _php_session_update_timestamp_iface_entry = Module["_php_session_update_timestamp_iface_entry"] = 1189588;

var _php_session_class_entry = Module["_php_session_class_entry"] = 1189592;

var _php_rfc1867_callback = Module["_php_rfc1867_callback"] = 1270964;

var _spl_ce_AppendIterator = Module["_spl_ce_AppendIterator"] = 1189996;

var _spl_ce_ArrayIterator = Module["_spl_ce_ArrayIterator"] = 1190208;

var _spl_ce_ArrayObject = Module["_spl_ce_ArrayObject"] = 1190212;

var _spl_ce_BadFunctionCallException = Module["_spl_ce_BadFunctionCallException"] = 1190660;

var _spl_ce_BadMethodCallException = Module["_spl_ce_BadMethodCallException"] = 1190664;

var _spl_ce_CachingIterator = Module["_spl_ce_CachingIterator"] = 1189976;

var _spl_ce_CallbackFilterIterator = Module["_spl_ce_CallbackFilterIterator"] = 1189948;

var _spl_ce_DirectoryIterator = Module["_spl_ce_DirectoryIterator"] = 1190532;

var _spl_ce_DomainException = Module["_spl_ce_DomainException"] = 1190668;

var _spl_ce_EmptyIterator = Module["_spl_ce_EmptyIterator"] = 1190204;

var _spl_ce_FilesystemIterator = Module["_spl_ce_FilesystemIterator"] = 1190536;

var _spl_ce_FilterIterator = Module["_spl_ce_FilterIterator"] = 1189944;

var _spl_ce_GlobIterator = Module["_spl_ce_GlobIterator"] = 1190648;

var _spl_ce_InfiniteIterator = Module["_spl_ce_InfiniteIterator"] = 1189992;

var _spl_ce_InvalidArgumentException = Module["_spl_ce_InvalidArgumentException"] = 1191144;

var _spl_ce_IteratorIterator = Module["_spl_ce_IteratorIterator"] = 1189984;

var _spl_ce_LengthException = Module["_spl_ce_LengthException"] = 1190672;

var _spl_ce_LimitIterator = Module["_spl_ce_LimitIterator"] = 1189972;

var _spl_ce_LogicException = Module["_spl_ce_LogicException"] = 1190656;

var _spl_ce_MultipleIterator = Module["_spl_ce_MultipleIterator"] = 1190804;

var _spl_ce_NoRewindIterator = Module["_spl_ce_NoRewindIterator"] = 1189988;

var _spl_ce_OuterIterator = Module["_spl_ce_OuterIterator"] = 119e4;

var _spl_ce_OutOfBoundsException = Module["_spl_ce_OutOfBoundsException"] = 1190676;

var _spl_ce_OutOfRangeException = Module["_spl_ce_OutOfRangeException"] = 1190808;

var _spl_ce_OverflowException = Module["_spl_ce_OverflowException"] = 1190680;

var _spl_ce_ParentIterator = Module["_spl_ce_ParentIterator"] = 1189960;

var _spl_ce_RangeException = Module["_spl_ce_RangeException"] = 1190684;

var _spl_ce_RecursiveArrayIterator = Module["_spl_ce_RecursiveArrayIterator"] = 1190416;

var _spl_ce_RecursiveCachingIterator = Module["_spl_ce_RecursiveCachingIterator"] = 1189980;

var _spl_ce_RecursiveCallbackFilterIterator = Module["_spl_ce_RecursiveCallbackFilterIterator"] = 1189952;

var _spl_ce_RecursiveDirectoryIterator = Module["_spl_ce_RecursiveDirectoryIterator"] = 1190544;

var _spl_ce_RecursiveFilterIterator = Module["_spl_ce_RecursiveFilterIterator"] = 1189956;

var _spl_ce_RecursiveIterator = Module["_spl_ce_RecursiveIterator"] = 1190540;

var _spl_ce_RecursiveIteratorIterator = Module["_spl_ce_RecursiveIteratorIterator"] = 1189936;

var _spl_ce_RecursiveRegexIterator = Module["_spl_ce_RecursiveRegexIterator"] = 1189968;

var _spl_ce_RecursiveTreeIterator = Module["_spl_ce_RecursiveTreeIterator"] = 1189940;

var _spl_ce_RegexIterator = Module["_spl_ce_RegexIterator"] = 1189964;

var _spl_ce_SeekableIterator = Module["_spl_ce_SeekableIterator"] = 1190528;

var _spl_ce_SplDoublyLinkedList = Module["_spl_ce_SplDoublyLinkedList"] = 1190816;

var _spl_ce_SplFileInfo = Module["_spl_ce_SplFileInfo"] = 1190424;

var _spl_ce_SplFileObject = Module["_spl_ce_SplFileObject"] = 1190420;

var _spl_ce_SplFixedArray = Module["_spl_ce_SplFixedArray"] = 1191148;

var _spl_ce_SplHeap = Module["_spl_ce_SplHeap"] = 1190928;

var _spl_ce_SplMinHeap = Module["_spl_ce_SplMinHeap"] = 1191036;

var _spl_ce_SplMaxHeap = Module["_spl_ce_SplMaxHeap"] = 1191040;

var _spl_ce_SplObjectStorage = Module["_spl_ce_SplObjectStorage"] = 1190692;

var _spl_ce_SplObserver = Module["_spl_ce_SplObserver"] = 1190696;

var _spl_ce_SplPriorityQueue = Module["_spl_ce_SplPriorityQueue"] = 1190932;

var _spl_ce_SplQueue = Module["_spl_ce_SplQueue"] = 1190920;

var _spl_ce_SplStack = Module["_spl_ce_SplStack"] = 1190924;

var _spl_ce_SplSubject = Module["_spl_ce_SplSubject"] = 1190700;

var _spl_ce_SplTempFileObject = Module["_spl_ce_SplTempFileObject"] = 1190652;

var _spl_ce_UnderflowException = Module["_spl_ce_UnderflowException"] = 1190688;

var _spl_ce_UnexpectedValueException = Module["_spl_ce_UnexpectedValueException"] = 1190812;

var _zend_autoload = Module["_zend_autoload"] = 1271536;

var _zend_compile_file = Module["_zend_compile_file"] = 1282836;

var _zend_ce_iterator = Module["_zend_ce_iterator"] = 1278172;

var _zend_ce_arrayaccess = Module["_zend_ce_arrayaccess"] = 1274736;

var _zend_ce_countable = Module["_zend_ce_countable"] = 1274740;

var _empty_fcall_info_cache = Module["_empty_fcall_info_cache"] = 1096960;

var _zend_ce_serializable = Module["_zend_ce_serializable"] = 1282960;

var _php_glob_stream_ops = Module["_php_glob_stream_ops"] = 1041164;

var _spl_handler_SplObjectStorage = Module["_spl_handler_SplObjectStorage"] = 1190704;

var _empty_fcall_info = Module["_empty_fcall_info"] = 1096912;

var _php_ce_incomplete_class = Module["_php_ce_incomplete_class"] = 1269548;

var _assertion_error_ce = Module["_assertion_error_ce"] = 1269432;

var _php_stream_php_wrapper = Module["_php_stream_php_wrapper"] = 1030520;

var _php_plain_files_wrapper = Module["_php_plain_files_wrapper"] = 1158348;

var _php_glob_stream_wrapper = Module["_php_glob_stream_wrapper"] = 1041244;

var _php_stream_rfc2397_wrapper = Module["_php_stream_rfc2397_wrapper"] = 1040776;

var _php_load_environment_variables = Module["_php_load_environment_variables"] = 1158304;

var _environ = Module["_environ"] = 1298368;

var _php_optidx = Module["_php_optidx"] = 1158316;

var _zend_new_interned_string = Module["_zend_new_interned_string"] = 1283676;

var _php_stream_stdio_ops = Module["_php_stream_stdio_ops"] = 1158360;

var _php_sig_gif = Module["_php_sig_gif"] = 1026544;

var _php_sig_psd = Module["_php_sig_psd"] = 1026547;

var _php_sig_bmp = Module["_php_sig_bmp"] = 1026551;

var _php_sig_swf = Module["_php_sig_swf"] = 1026553;

var _php_sig_swc = Module["_php_sig_swc"] = 1026556;

var _php_sig_jpg = Module["_php_sig_jpg"] = 1026559;

var _php_sig_png = Module["_php_sig_png"] = 1026562;

var _php_sig_tif_ii = Module["_php_sig_tif_ii"] = 1026570;

var _php_sig_tif_mm = Module["_php_sig_tif_mm"] = 1026574;

var _php_sig_jpc = Module["_php_sig_jpc"] = 1026578;

var _php_sig_jp2 = Module["_php_sig_jp2"] = 1026581;

var _php_sig_iff = Module["_php_sig_iff"] = 1026593;

var _php_sig_ico = Module["_php_sig_ico"] = 1026597;

var _php_sig_riff = Module["_php_sig_riff"] = 1026601;

var _php_sig_webp = Module["_php_sig_webp"] = 1026605;

var _php_tiff_bytes_per_format = Module["_php_tiff_bytes_per_format"] = 1026624;

var _php_ini_opened_path = Module["_php_ini_opened_path"] = 1270836;

var _php_ini_scanned_path = Module["_php_ini_scanned_path"] = 1270840;

var _php_ini_scanned_files = Module["_php_ini_scanned_files"] = 1270844;

var _zend_ce_division_by_zero_error = Module["_zend_ce_division_by_zero_error"] = 1273756;

var _zend_ce_arithmetic_error = Module["_zend_ce_arithmetic_error"] = 1273752;

var _zend_tolower_map = Module["_zend_tolower_map"] = 1098656;

var _zend_toupper_map = Module["_zend_toupper_map"] = 1098912;

var _zend_write = Module["_zend_write"] = 1273e3;

var _zend_ce_throwable = Module["_zend_ce_throwable"] = 1282980;

var _php_stream_ftp_wrapper = Module["_php_stream_ftp_wrapper"] = 1030336;

var _php_stream_http_wrapper = Module["_php_stream_http_wrapper"] = 1030392;

var _stdin = Module["_stdin"] = 1142684;

var _stdout = Module["_stdout"] = 1142688;

var _stderr = Module["_stderr"] = 1142680;

var _php_stream_socket_ops = Module["_php_stream_socket_ops"] = 1041020;

var _zend_string_init_existing_interned = Module["_zend_string_init_existing_interned"] = 1274896;

var _zend_resolve_path = Module["_zend_resolve_path"] = 1272952;

var _php_register_internal_extensions_func = Module["_php_register_internal_extensions_func"] = 1158288;

var _php_internal_encoding_changed = Module["_php_internal_encoding_changed"] = 1270828;

var _le_index_ptr = Module["_le_index_ptr"] = 1271724;

var _zend_post_shutdown_cb = Module["_zend_post_shutdown_cb"] = 1271544;

var _php_import_environment_variables = Module["_php_import_environment_variables"] = 1160460;

var _zend_printf = Module["_zend_printf"] = 1273008;

var _in6addr_any = Module["_in6addr_any"] = 1154044;

var _output_globals = Module["_output_globals"] = 1270980;

var _php_stream_memory_ops = Module["_php_stream_memory_ops"] = 1040624;

var _php_stream_temp_ops = Module["_php_stream_temp_ops"] = 1040660;

var _php_stream_userspace_ops = Module["_php_stream_userspace_ops"] = 1040912;

var _php_stream_rfc2397_ops = Module["_php_stream_rfc2397_ops"] = 1040696;

var _php_stream_rfc2397_wops = Module["_php_stream_rfc2397_wops"] = 1040732;

var _php_stream_userspace_dir_ops = Module["_php_stream_userspace_dir_ops"] = 1040948;

var _zend_ce_compile_error = Module["_zend_ce_compile_error"] = 1273628;

var _language_scanner_globals = Module["_language_scanner_globals"] = 1273048;

var _zend_ce_parse_error = Module["_zend_ce_parse_error"] = 1273624;

var _zend_multibyte_encoding_utf32be = Module["_zend_multibyte_encoding_utf32be"] = 1158768;

var _zend_multibyte_encoding_utf32le = Module["_zend_multibyte_encoding_utf32le"] = 1158772;

var _zend_multibyte_encoding_utf16be = Module["_zend_multibyte_encoding_utf16be"] = 1158776;

var _zend_multibyte_encoding_utf16le = Module["_zend_multibyte_encoding_utf16le"] = 1158780;

var _zend_multibyte_encoding_utf8 = Module["_zend_multibyte_encoding_utf8"] = 1158784;

var _zend_ast_process = Module["_zend_ast_process"] = 1282832;

var _ini_scanner_globals = Module["_ini_scanner_globals"] = 1271576;

var _zend_getenv = Module["_zend_getenv"] = 1271564;

var _zend_execute_internal = Module["_zend_execute_internal"] = 1282844;

var _zend_execute_ex = Module["_zend_execute_ex"] = 1282840;

var _zend_compile_string = Module["_zend_compile_string"] = 1272956;

var _zend_observer_function_declared_observed = Module["_zend_observer_function_declared_observed"] = 1282640;

var _zend_observer_class_linked_observed = Module["_zend_observer_class_linked_observed"] = 1282641;

var _zend_extensions = Module["_zend_extensions"] = 1272960;

var _zend_interrupt_function = Module["_zend_interrupt_function"] = 1272944;

var _zend_on_timeout = Module["_zend_on_timeout"] = 1271560;

var _zend_op_array_extension_handles = Module["_zend_op_array_extension_handles"] = 1283680;

var _zend_extension_flags = Module["_zend_extension_flags"] = 1271672;

var _zend_post_startup_cb = Module["_zend_post_startup_cb"] = 1271540;

var _zend_error_cb = Module["_zend_error_cb"] = 1274404;

var _zend_fopen = Module["_zend_fopen"] = 1273192;

var _zend_stream_open_function = Module["_zend_stream_open_function"] = 1273188;

var _zend_ticks_function = Module["_zend_ticks_function"] = 1272988;

var _zend_throw_exception_hook = Module["_zend_throw_exception_hook"] = 1273632;

var _gc_collect_cycles = Module["_gc_collect_cycles"] = 1274528;

var _zend_uv = Module["_zend_uv"] = 1273004;

var _zend_ce_type_error = Module["_zend_ce_type_error"] = 1273636;

var _zend_ce_argument_count_error = Module["_zend_ce_argument_count_error"] = 1273640;

var _zend_dtrace_enabled = Module["_zend_dtrace_enabled"] = 1271648;

var _zend_signal_globals = Module["_zend_signal_globals"] = 1275936;

var _zend_observer_errors_observed = Module["_zend_observer_errors_observed"] = 1282642;

var _zend_ce_sensitive_parameter_value = Module["_zend_ce_sensitive_parameter_value"] = 1271728;

var _zend_ce_attribute = Module["_zend_ce_attribute"] = 1271732;

var _zend_ce_return_type_will_change_attribute = Module["_zend_ce_return_type_will_change_attribute"] = 1271780;

var _zend_ce_allow_dynamic_properties = Module["_zend_ce_allow_dynamic_properties"] = 1271784;

var _zend_ce_sensitive_parameter = Module["_zend_ce_sensitive_parameter"] = 1271788;

var _zend_ce_override = Module["_zend_ce_override"] = 1271892;

var _zend_pass_function = Module["_zend_pass_function"] = 1103136;

var _zend_ce_unhandled_match_error = Module["_zend_ce_unhandled_match_error"] = 1273760;

var _zend_touch_vm_stack_data = Module["_zend_touch_vm_stack_data"] = 1271896;

var _zend_ce_internal_iterator = Module["_zend_ce_internal_iterator"] = 1273516;

var _zend_ce_error_exception = Module["_zend_ce_error_exception"] = 1273744;

var _zend_ce_weakref = Module["_zend_ce_weakref"] = 1274632;

var _zend_ce_ClosedGeneratorException = Module["_zend_ce_ClosedGeneratorException"] = 1278168;

var _zend_inheritance_cache_get = Module["_zend_inheritance_cache_get"] = 1282404;

var _zend_inheritance_cache_add = Module["_zend_inheritance_cache_add"] = 1282408;

var ___jit_debug_descriptor = Module["___jit_debug_descriptor"] = 1158860;

var _zend_system_id = Module["_zend_system_id"] = 1282800;

var _zend_ce_unit_enum = Module["_zend_ce_unit_enum"] = 1282848;

var _zend_ce_backed_enum = Module["_zend_ce_backed_enum"] = 1282852;

var _zend_enum_object_handlers = Module["_zend_enum_object_handlers"] = 1282856;

var _zend_func_info_rid = Module["_zend_func_info_rid"] = 1159024;

var _php_embed_module = Module["_php_embed_module"] = 1160316;

var _zip_algorithm_deflate_compress = Module["_zip_algorithm_deflate_compress"] = 1160464;

var _zip_algorithm_deflate_decompress = Module["_zip_algorithm_deflate_decompress"] = 1160504;

var __zip_err_str_count = Module["__zip_err_str_count"] = 1133432;

var __zip_err_str = Module["__zip_err_str"] = 1133152;

var __zip_err_details_count = Module["__zip_err_details_count"] = 1133600;

var __zip_err_details = Module["__zip_err_details"] = 1133440;

var ___environ = Module["___environ"] = 1298368;

var ____environ = Module["____environ"] = 1298368;

var __environ = Module["__environ"] = 1298368;

var _timezone = Module["_timezone"] = 1298352;

var _daylight = Module["_daylight"] = 1298356;

var _tzname = Module["_tzname"] = 1298360;

var ___sig_pending = Module["___sig_pending"] = 1286676;

var ___sig_actions = Module["___sig_actions"] = 1287088;

var ___THREW__ = Module["___THREW__"] = 1187556;

var ___threwValue = Module["___threwValue"] = 1187560;

var ___start_em_js = Module["___start_em_js"] = 1161112;

var ___stop_em_js = Module["___stop_em_js"] = 1162799;

function invoke_iiii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return dynCall_iiii(index, a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_vi(index, a1) {
 var sp = stackSave();
 try {
  dynCall_vi(index, a1);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_v(index) {
 var sp = stackSave();
 try {
  dynCall_v(index);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_i(index) {
 var sp = stackSave();
 try {
  return dynCall_i(index);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iii(index, a1, a2) {
 var sp = stackSave();
 try {
  return dynCall_iii(index, a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_viii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  dynCall_viii(index, a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_vii(index, a1, a2) {
 var sp = stackSave();
 try {
  dynCall_vii(index, a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiii(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  dynCall_viiii(index, a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_ii(index, a1) {
 var sp = stackSave();
 try {
  return dynCall_ii(index, a1);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return dynCall_iiiii(index, a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  dynCall_viiiiii(index, a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return dynCall_iiiiii(index, a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
 var sp = stackSave();
 try {
  return dynCall_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  return dynCall_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  return dynCall_iiiiiii(index, a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0) throw e;
  _setThrew(1, 0);
 }
}

function applySignatureConversions(exports) {
 exports = Object.assign({}, exports);
 var makeWrapper_p = f => () => f() >>> 0;
 var makeWrapper_pp = f => a0 => f(a0) >>> 0;
 var makeWrapper_ppp = f => (a0, a1) => f(a0, a1) >>> 0;
 var makeWrapper_pP = f => a0 => f(a0) >>> 0;
 exports["__errno_location"] = makeWrapper_p(exports["__errno_location"]);
 exports["malloc"] = makeWrapper_pp(exports["malloc"]);
 exports["emscripten_builtin_malloc"] = makeWrapper_pp(exports["emscripten_builtin_malloc"]);
 exports["emscripten_builtin_memalign"] = makeWrapper_ppp(exports["emscripten_builtin_memalign"]);
 exports["sbrk"] = makeWrapper_pP(exports["sbrk"]);
 exports["stackSave"] = makeWrapper_p(exports["stackSave"]);
 exports["stackAlloc"] = makeWrapper_pp(exports["stackAlloc"]);
 exports["emscripten_stack_get_current"] = makeWrapper_p(exports["emscripten_stack_get_current"]);
 return exports;
}

function intArrayFromBase64(s) {
 try {
  var decoded = atob(s);
  var bytes = new Uint8Array(decoded.length);
  for (var i = 0; i < decoded.length; ++i) {
   bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
 } catch (_) {
  throw new Error("Converting base64 string to bytes failed.");
 }
}

Module["addRunDependency"] = addRunDependency;

Module["removeRunDependency"] = removeRunDependency;

Module["FS_createPath"] = FS.createPath;

Module["FS_createDataFile"] = FS.createDataFile;

Module["FS_createLazyFile"] = FS.createLazyFile;

Module["FS_createDevice"] = FS.createDevice;

Module["FS_unlink"] = FS.unlink;

Module["ENV"] = ENV;

Module["ccall"] = ccall;

Module["getValue"] = getValue;

Module["UTF8ToString"] = UTF8ToString;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

Module["FS_createPreloadedFile"] = FS.createPreloadedFile;

Module["FS"] = FS;

var calledRun;

dependenciesFulfilled = function runCaller() {
 if (!calledRun) run();
 if (!calledRun) dependenciesFulfilled = runCaller;
};

function callMain() {
 var entryFunction = _main;
 var argc = 0;
 var argv = 0;
 try {
  var ret = entryFunction(argc, argv);
  exitJS(ret, true);
  return ret;
 } catch (e) {
  return handleException(e);
 }
}

function run() {
 if (runDependencies > 0) {
  return;
 }
 preRun();
 if (runDependencies > 0) {
  return;
 }
 function doRun() {
  if (calledRun) return;
  calledRun = true;
  Module["calledRun"] = true;
  if (ABORT) return;
  initRuntime();
  preMain();
  readyPromiseResolve(Module);
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  if (shouldRunNow) callMain();
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout(function() {
   setTimeout(function() {
    Module["setStatus"]("");
   }, 1);
   doRun();
  }, 1);
 } else {
  doRun();
 }
}

if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}

var shouldRunNow = false;

if (Module["noInitialRun"]) shouldRunNow = false;

run();


  return moduleArg.ready
}

);
})();
export default PHP;