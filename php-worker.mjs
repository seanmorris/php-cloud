
var PHP = (() => {
  const importMeta = import.meta;var _scriptDir = importMeta.url;
  
  return (
function(moduleArg = {}) {

var Module = moduleArg;

var readyPromiseResolve, readyPromiseReject;

Module["ready"] = new Promise(((resolve, reject) => {
 readyPromiseResolve = resolve;
 readyPromiseReject = reject;
}));

Module.preRun = Module.preRun || [];

if (typeof Module.preRun == "function") Module.preRun = [ Module.preRun ];

Module.preRun.push((() => Object.assign(ENV, Module.ENV || {})));

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
   }).then((response => {
    if (!response["ok"]) {
     throw "failed to load wasm binary file at '" + binaryFile + "'";
    }
    return response["arrayBuffer"]();
   })).catch((() => getBinarySync(binaryFile)));
  }
 }
 return Promise.resolve().then((() => getBinarySync(binaryFile)));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
 return getBinaryPromise(binaryFile).then((binary => WebAssembly.instantiate(binary, imports))).then((instance => instance)).then(receiver, (reason => {
  err("failed to asynchronously prepare wasm: " + reason);
  abort(reason);
 }));
}

function instantiateAsync(binary, binaryFile, imports, callback) {
 if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && typeof fetch == "function") {
  return fetch(binaryFile, {
   credentials: "same-origin"
  }).then((response => {
   var result = WebAssembly.instantiateStreaming(response, imports);
   return result.then(callback, (function(reason) {
    err("wasm streaming compile failed: " + reason);
    err("falling back to ArrayBuffer instantiation");
    return instantiateArrayBuffer(binaryFile, imports, callback);
   }));
  }));
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
  Module["asm"] = exports;
  wasmMemory = Module["asm"]["memory"];
  updateMemoryViews();
  wasmTable = Module["asm"]["__indirect_function_table"];
  addOnInit(Module["asm"]["__wasm_call_ctors"]);
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
 1162767: () => typeof Module.cfd1 === "object" && Object.keys(Module.cfd1).length,
 1162845: $0 => {
  const results = Module.targets.get($0);
  if (results) {
   return results.length;
  }
  return 0;
 },
 1162938: $0 => {
  const results = Module.targets.get($0);
  if (results.length) {
   return Object.keys(results[0]).length;
  }
  return 0;
 },
 1163054: ($0, $1) => {
  const targetId = $0;
  const target = Module.targets.get(targetId);
  const current = $1;
  if (current >= target.length) {
   return false;
  }
  return true;
 },
 1163204: ($0, $1) => {
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
 1163442: ($0, $1, $2, $3) => {
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
 1163695: ($0, $1) => {
  const statement = Module.targets.get($0);
  const paramVal = Module.zvalToJS($1);
  if (!Module.PdoParams.has(statement)) {
   Module.PdoParams.set(statement, []);
  }
  const paramList = Module.PdoParams.get(statement);
  paramList.push(paramVal);
 },
 1163934: ($0, $1, $2) => {
  console.log("GET ATTR", $0, $1, $2);
 },
 1163975: ($0, $1, $2) => {
  console.log("COL META", $0, $1, $2);
 },
 1164016: ($0, $1, $2) => {
  console.log("CLOSE", $0, $1, $2);
 },
 1164054: $0 => {
  if (typeof Module.cfd1 !== "object") {
   throw new Error("The `cfd1` object must be provided as a constructor arg to PHP to use pdo_cfd1.");
  }
  const dbName = UTF8ToString($0);
  if (typeof Module.cfd1[dbName] !== "object") {
   throw new Error(`The value provided at cfd1[${dbName}] does not exist or is not an object.`);
  }
 },
 1164373: $0 => {
  console.log("CLOSE", $0);
 },
 1164403: ($0, $1, $2) => {
  const dbName = UTF8ToString($0);
  const query = UTF8ToString($1);
  const zv = $2;
  const prepared = Module.cfd1[dbName].prepare(query);
  Module.jsToZval(prepared, zv);
 },
 1164571: () => {
  console.log("BEGIN TXN");
  return true;
 },
 1164614: $0 => {
  console.log("COMMIT TXN", $0);
  return true;
 },
 1164662: $0 => {
  console.log("ROLLBACK TXN", $0);
  return true;
 },
 1164712: ($0, $1, $2) => {
  console.log("SET ATTR", $1, $2);
  return true;
 },
 1164762: $0 => {
  console.log("LAST INSERT ID", UTF8ToString($0));
  return 0;
 },
 1164825: ($0, $1) => {
  console.log("FETCH ERROR FUNC", $0, $1);
 },
 1164870: ($0, $1) => {
  console.log("GET ATTR", $0, $1);
  return 0;
 },
 1164917: () => {
  console.log("SHUTDOWN");
 },
 1164946: $0 => {
  console.log("GET GC", $0);
 },
 1164977: $0 => {
  if (Module.persist) {
   const persist = Array.isArray(Module.persist) ? Module.persist : [ Module.persist ];
   const useNodeRawFS = $0;
   persist.forEach((p => {
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
   }));
  }
 },
 1165601: ($0, $1, $2) => {
  const target = Module.targets.get($0);
  const property = UTF8ToString($1);
  const rv = $2;
  if (!(property in target)) {
   return Module.jsToZval(undefined, rv);
  }
  Module.jsToZval(target[property], rv);
 },
 1165802: ($0, $1, $2, $3, $4) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   const funcPtr = $2;
   target[property] = Module.callableToJs(funcPtr);
  })();
 },
 1166005: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   const zvalPtr = $2;
   if (!Module.targets.has(target[property])) {
    target[property] = Module.marshalObject(zvalPtr);
   }
  })();
 },
 1166212: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   delete target[property];
  })();
 },
 1166328: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = null;
  })();
 },
 1166444: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = false;
  })();
 },
 1166561: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = true;
  })();
 },
 1166677: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = $2;
  })();
 },
 1166791: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   target[property] = $2;
  })();
 },
 1166905: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   const newValue = UTF8ToString($2);
   target[property] = newValue;
  })();
 },
 1167060: ($0, $1, $2) => {
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
 1167417: ($0, $1, $2, $3) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   const funcPtr = $2;
   target[property] = Module.callableToJs(funcPtr);
  })();
 },
 1167584: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   const zvalPtr = $2;
   if (!Module.targets.has(target[property])) {
    target[property] = Module.marshalObject(zvalPtr);
   }
  })();
 },
 1167777: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   delete target[property];
  })();
 },
 1167879: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = null;
  })();
 },
 1167981: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = false;
  })();
 },
 1168084: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = true;
  })();
 },
 1168186: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = $2;
  })();
 },
 1168286: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   target[property] = $2;
  })();
 },
 1168386: ($0, $1, $2) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   const newValue = UTF8ToString($2);
   target[property] = newValue;
  })();
 },
 1168527: ($0, $1, $2) => {
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
 1169031: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = UTF8ToString($1);
   delete target[property];
  })();
 },
 1169147: ($0, $1) => {
  (() => {
   const target = Module.targets.get($0);
   const property = $1;
   delete target[property];
  })();
 },
 1169249: $0 => {
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
 1169586: ($0, $1) => {
  const target = Module.targets.get($0);
  const property = UTF8ToString($1);
  return property in target;
 },
 1169691: ($0, $1, $2) => {
  const target = Module.targets.get($0);
  const property_name = UTF8ToString($1);
  const rv = $2;
  return Module.jsToZval(target[property_name], rv);
 },
 1169840: ($0, $1, $2, $3, $4, $5) => {
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
 1170207: ($0, $1, $2, $3, $4) => {
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
 1170457: ($0, $1, $2, $3) => {
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
 1170770: $0 => {
  const target = Module.targets.get($0);
  Module.tacked.delete(target);
  Module.targets.remove(target);
 },
 1170874: $0 => {
  const target = Module.targets.get($0);
  const str = String(target);
  const len = 1 + lengthBytesUTF8(str);
  const loc = _malloc(len);
  stringToUTF8(str, loc, len);
  return loc;
 },
 1171050: () => {
  const context = {};
  Module.tacked.add(context);
  return Module.targets.add(context);
 },
 1171138: ($0, $1) => {
  const context = Module.targets.get($0);
  const method = UTF8ToString($1);
  context.method = method;
 },
 1171244: ($0, $1) => {
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
 1171574: ($0, $1) => {
  (() => {
   const context = Module.targets.get($0);
   const headerLines = UTF8ToString($1);
   headerLines.split("\n").forEach((headerLine => {
    const context = Module.targets.get($0);
    const colon = headerLine.indexOf(":");
    const key = headerLine.substr(0, colon).trim();
    const val = headerLine.substr(1 + colon).trim();
    context.headers = context.headers ?? {};
    context.headers[key] = val;
    console.log(context.headers);
   }));
  })();
 },
 1171997: ($0, $1, $2) => {
  (() => {
   const context = Module.targets.get($0);
   context.body = Module.HEAPU8.slice($1, $1 + $2);
  })();
 },
 1172104: ($0, $1) => {
  const context = Module.targets.get($0);
  context.ignoreErrors = $1;
 },
 1172179: $0 => {
  const {status: status} = Module.targets.get($0);
  return status;
 },
 1172243: $0 => {
  const str = String(eval(UTF8ToString($0)));
  const len = lengthBytesUTF8(str) + 1;
  const loc = _malloc(len);
  stringToUTF8(str, loc, len);
  return loc;
 },
 1172396: ($0, $1) => {
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
 1172692: ($0, $1) => {
  const timeout = Number(UTF8ToString($0));
  const funcPtr = $1;
  setTimeout((() => {
   Module.ccall("vrzno_exec_callback", "number", [ "number", "number", "number", "number" ], [ funcPtr, null, 0, 0 ]);
   Module.ccall("vrzno_del_callback", "number", [ "number" ], [ funcPtr ]);
  }), timeout);
 },
 1172976: ($0, $1) => {
  const name = UTF8ToString($0);
  const rv = $1;
  Module.jsToZval(Module[name], rv);
 },
 1173061: ($0, $1) => {
  const name = UTF8ToString($0);
  const rv = $1;
  Module.jsToZval(Module.shared[name], rv);
 },
 1173153: ($0, $1) => {
  const name = UTF8ToString($0);
  const rv = $1;
  Module.jsToZval(import(/* webpackIgnore: true */ name), rv);
 },
 1173238: () => {
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
  Module.fRegistry = Module.fRegistry || new FinReg((zvalPtr => {
   Module.ccall("vrzno_expose_dec_refcount", "number", [ "number" ], [ zvalPtr ]);
  }));
  Module.bufferMaps = new WeakMap;
  const getRegistry = weakerMap => {
   const registry = new FinReg((key => {
    if (weakerMap.registry !== registry) {
     return;
    }
    if (weakerMap.map.has(key) && weakerMap.map.get(key).deref()) {
     return;
    }
    weakerMap.delete(key);
   }));
   return registry;
  };
  Module.WeakerMap = Module.WeakerMap || class WeakerMap {
   constructor(entries) {
    this.map = new Map;
    this.registry = getRegistry(this);
    entries && entries.forEach((([key, value]) => this.set(key, value)));
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
    return [ ...this ].map((v => v[0]));
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
    return [ ...this ].map((v => v[1]));
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
 1185177: $0 => {
  const target = Module.targets.get($0);
  return Module.classes.get(target);
 },
 1185255: ($0, $1) => {
  const target = Module.targets.get($0);
  Module.classes.set(target, $1);
  Module._classes.set($1, target);
 },
 1185363: ($0, $1, $2, $3) => {
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
 1185755: $0 => {
  const parsed = Module.targets.get($0);
  Module.tacked.delete(parsed);
 },
 1185828: $0 => {
  const _class = Module._classes.get($0);
  if (_class) {
   return Module.targets.getId(_class);
  }
  return Module.targets.add(globalThis);
 },
 1185963: ($0, $1) => {
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
 1186326: ($0, $1, $2) => {
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
 1186621: $0 => {
  const target = Module.targets.get($0);
  if (target) {
   Module.tacked.delete(target);
   Module.fRegistry.unregister(target);
  }
 }
};

function __asyncjs__pdo_cfd1_real_stmt_execute(targetId, rv) {
 return Asyncify.handleAsync((async () => {
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
 }));
}

function __asyncjs__php_stream_fetch_real_open(path, _context, ptrsize, headersv, headersc) {
 return Asyncify.handleAsync((async () => {
  const pathString = UTF8ToString(path);
  const context = Module.targets.get(_context) || {};
  const response = await fetch(pathString, context);
  const buffer = new Uint8Array(await response.arrayBuffer());
  const status = response.status;
  const headerLines = [ ...response.headers.entries() ].map((([key, val]) => `${key}: ${val}`));
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
 }));
}

function __asyncjs__vrzno_await_internal(targetId, rv) {
 return Asyncify.handleAsync((async () => {
  const target = Module.targets.get(targetId);
  const result = await target;
  Module.jsToZval(result, rv);
 }));
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
  path = PATH.normalizeArray(path.split("/").filter((p => !!p)), !isAbsolute).join("/");
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
  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p => !!p)), !resolvedAbsolute).join("/");
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
 readAsync(url, (arrayBuffer => {
  assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
  onload(new Uint8Array(arrayBuffer));
  if (dep) removeRunDependency(dep);
 }), (event => {
  if (onerror) {
   onerror();
  } else {
   throw `Loading data file "${url}" failed.`;
  }
 }));
 if (dep) addRunDependency(dep);
};

var preloadPlugins = Module["preloadPlugins"] || [];

function FS_handledByPreloadPlugin(byteArray, fullname, finish, onerror) {
 if (typeof Browser != "undefined") Browser.init();
 var handled = false;
 preloadPlugins.forEach((function(plugin) {
  if (handled) return;
  if (plugin["canHandle"](fullname)) {
   plugin["handle"](byteArray, fullname, finish, onerror);
   handled = true;
  }
 }));
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
  if (FS_handledByPreloadPlugin(byteArray, fullname, finish, (() => {
   if (onerror) onerror();
   removeRunDependency(dep);
  }))) {
   return;
  }
  finish(byteArray);
 }
 addRunDependency(dep);
 if (typeof url == "string") {
  asyncLoad(url, (byteArray => processData(byteArray)), onerror);
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
  IDBFS.getLocalSet(mount, ((err, local) => {
   if (err) return callback(err);
   IDBFS.getRemoteSet(mount, ((err, remote) => {
    if (err) return callback(err);
    var src = populate ? remote : local;
    var dst = populate ? local : remote;
    IDBFS.reconcile(src, dst, callback);
   }));
  }));
 },
 quit: () => {
  Object.values(IDBFS.dbs).forEach((value => value.close()));
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
  IDBFS.getDB(mount.mountpoint, ((err, db) => {
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
  }));
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
  Object.keys(src.entries).forEach((function(key) {
   var e = src.entries[key];
   var e2 = dst.entries[key];
   if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
    create.push(key);
    total++;
   }
  }));
  var remove = [];
  Object.keys(dst.entries).forEach((function(key) {
   if (!src.entries[key]) {
    remove.push(key);
    total++;
   }
  }));
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
  create.sort().forEach((path => {
   if (dst.type === "local") {
    IDBFS.loadRemoteEntry(store, path, ((err, entry) => {
     if (err) return done(err);
     IDBFS.storeLocalEntry(path, entry, done);
    }));
   } else {
    IDBFS.loadLocalEntry(path, ((err, entry) => {
     if (err) return done(err);
     IDBFS.storeRemoteEntry(store, path, entry, done);
    }));
   }
  }));
  remove.sort().reverse().forEach((path => {
   if (dst.type === "local") {
    IDBFS.removeLocalEntry(path, done);
   } else {
    IDBFS.removeRemoteEntry(store, path, done);
   }
  }));
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
  var parts = path.split("/").filter((p => !!p));
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
  mounts.forEach((mount => {
   if (!mount.type.syncfs) {
    return done(null);
   }
   mount.type.syncfs(mount, populate, done);
  }));
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
  Object.keys(FS.nameTable).forEach((hash => {
   var current = FS.nameTable[hash];
   while (current) {
    var next = current.name_next;
    if (mounts.includes(current.mount)) {
     FS.destroyNode(current);
    }
    current = next;
   }
  }));
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
  [ 44 ].forEach((code => {
   FS.genericErrors[code] = new FS.ErrnoError(code);
   FS.genericErrors[code].stack = "<generic error, no stack>";
  }));
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
   lazyArray.setDataGetter((chunkNum => {
    var start = chunkNum * chunkSize;
    var end = (chunkNum + 1) * chunkSize - 1;
    end = Math.min(end, datalength - 1);
    if (typeof lazyArray.chunks[chunkNum] == "undefined") {
     lazyArray.chunks[chunkNum] = doXHR(start, end);
    }
    if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
    return lazyArray.chunks[chunkNum];
   }));
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
  keys.forEach((key => {
   var fn = node.stream_ops[key];
   stream_ops[key] = function forceLoadLazyFile() {
    FS.forceLoadFile(node);
    return fn.apply(null, arguments);
   };
  }));
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
    peer.socket.on("message", (function(data, isBinary) {
     if (!isBinary) {
      return;
     }
     handleMessage(new Uint8Array(data).buffer);
    }));
    peer.socket.on("close", (function() {
     Module["websocket"].emit("close", sock.stream.fd);
    }));
    peer.socket.on("error", (function(error) {
     sock.error = 14;
     Module["websocket"].emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
    }));
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
 var id = setTimeout((() => {
  delete timers[which];
  callUserCallback((() => __emscripten_timeout(which, _emscripten_get_now())));
 }), timeout_ms);
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
 getEnvStrings().forEach((function(string, i) {
  var ptr = environ_buf + bufSize;
  HEAPU32[__environ + i * 4 >>> 2] = ptr;
  stringToAscii(string, ptr);
  bufSize += string.length + 1;
 }));
 return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
 penviron_count >>>= 0;
 penviron_buf_size >>>= 0;
 var strings = getEnvStrings();
 HEAPU32[penviron_count >>> 2] = strings.length;
 var bufSize = 0;
 strings.forEach((function(string) {
  bufSize += string.length + 1;
 }));
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
  return Asyncify.handleSleep((function(wakeUp) {
   var mount = stream.node.mount;
   if (!mount.type.syncfs) {
    wakeUp(0);
    return;
   }
   mount.type.syncfs(mount, false, (function(err) {
    if (err) {
     wakeUp((function() {
      return 29;
     }));
     return;
    }
    wakeUp(0);
   }));
  }));
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
     var isAsyncifyImport = original.isAsync || importPatterns.some((pattern => !!x.match(pattern)));
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
  return new Promise(((resolve, reject) => {
   Asyncify.asyncPromiseHandlers = {
    resolve: resolve,
    reject: reject
   };
  }));
 },
 allocateData: function() {
  var ptr = _malloc(12 + Asyncify.StackSize);
  Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
  Asyncify.setDataRewindFunc(ptr);
  return ptr;
 },
 setDataHeader: function(ptr, stack, stackSize) {
  HEAP32[ptr >>> 2] = stack;
  HEAP32[ptr + 4 >>> 2] = stack + stackSize;
 },
 setDataRewindFunc: function(ptr) {
  var bottomOfCallStack = Asyncify.exportCallStack[0];
  var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
  HEAP32[ptr + 8 >>> 2] = rewindId;
 },
 getDataRewindFunc: function(ptr) {
  var id = HEAP32[ptr + 8 >>> 2];
  var name = Asyncify.callStackIdToName[id];
  var func = Module["asm"][name];
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
   startAsync(((handleSleepReturnValue = 0) => {
    if (ABORT) return;
    Asyncify.handleSleepReturnValue = handleSleepReturnValue;
    reachedCallback = true;
    if (!reachedAfterCallback) {
     return;
    }
    Asyncify.state = Asyncify.State.Rewinding;
    runAndAbortIfError((() => _asyncify_start_rewind(Asyncify.currData)));
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
   }));
   reachedAfterCallback = true;
   if (!reachedCallback) {
    Asyncify.state = Asyncify.State.Unwinding;
    Asyncify.currData = Asyncify.allocateData();
    if (typeof Browser != "undefined" && Browser.mainLoop.func) {
     Browser.mainLoop.pause();
    }
    runAndAbortIfError((() => _asyncify_start_unwind(Asyncify.currData)));
   }
  } else if (Asyncify.state === Asyncify.State.Rewinding) {
   Asyncify.state = Asyncify.State.Normal;
   runAndAbortIfError(_asyncify_stop_rewind);
   _free(Asyncify.currData);
   Asyncify.currData = null;
   Asyncify.sleepCallbacks.forEach((func => callUserCallback(func)));
  } else {
   abort(`invalid state: ${Asyncify.state}`);
  }
  return Asyncify.handleSleepReturnValue;
 },
 handleAsync: function(startAsync) {
  return Asyncify.handleSleep((wakeUp => {
   startAsync().then(wakeUp);
  }));
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

var ___wasm_call_ctors = function() {
 return (___wasm_call_ctors = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
};

var _php_time = Module["_php_time"] = function() {
 return (_php_time = Module["_php_time"] = Module["asm"]["php_time"]).apply(null, arguments);
};

var _gettimeofday = Module["_gettimeofday"] = function() {
 return (_gettimeofday = Module["_gettimeofday"] = Module["asm"]["gettimeofday"]).apply(null, arguments);
};

var _time = Module["_time"] = function() {
 return (_time = Module["_time"] = Module["asm"]["time"]).apply(null, arguments);
};

var _php_date_get_date_ce = Module["_php_date_get_date_ce"] = function() {
 return (_php_date_get_date_ce = Module["_php_date_get_date_ce"] = Module["asm"]["php_date_get_date_ce"]).apply(null, arguments);
};

var _php_date_get_immutable_ce = Module["_php_date_get_immutable_ce"] = function() {
 return (_php_date_get_immutable_ce = Module["_php_date_get_immutable_ce"] = Module["asm"]["php_date_get_immutable_ce"]).apply(null, arguments);
};

var _php_date_get_interface_ce = Module["_php_date_get_interface_ce"] = function() {
 return (_php_date_get_interface_ce = Module["_php_date_get_interface_ce"] = Module["asm"]["php_date_get_interface_ce"]).apply(null, arguments);
};

var _php_date_get_timezone_ce = Module["_php_date_get_timezone_ce"] = function() {
 return (_php_date_get_timezone_ce = Module["_php_date_get_timezone_ce"] = Module["asm"]["php_date_get_timezone_ce"]).apply(null, arguments);
};

var _php_date_get_interval_ce = Module["_php_date_get_interval_ce"] = function() {
 return (_php_date_get_interval_ce = Module["_php_date_get_interval_ce"] = Module["asm"]["php_date_get_interval_ce"]).apply(null, arguments);
};

var _php_date_get_period_ce = Module["_php_date_get_period_ce"] = function() {
 return (_php_date_get_period_ce = Module["_php_date_get_period_ce"] = Module["asm"]["php_date_get_period_ce"]).apply(null, arguments);
};

var __efree = Module["__efree"] = function() {
 return (__efree = Module["__efree"] = Module["asm"]["_efree"]).apply(null, arguments);
};

var _zend_hash_destroy = Module["_zend_hash_destroy"] = function() {
 return (_zend_hash_destroy = Module["_zend_hash_destroy"] = Module["asm"]["zend_hash_destroy"]).apply(null, arguments);
};

var __efree_48 = Module["__efree_48"] = function() {
 return (__efree_48 = Module["__efree_48"] = Module["asm"]["_efree_48"]).apply(null, arguments);
};

var _zend_register_ini_entries_ex = Module["_zend_register_ini_entries_ex"] = function() {
 return (_zend_register_ini_entries_ex = Module["_zend_register_ini_entries_ex"] = Module["asm"]["zend_register_ini_entries_ex"]).apply(null, arguments);
};

var _zend_unregister_ini_entries_ex = Module["_zend_unregister_ini_entries_ex"] = function() {
 return (_zend_unregister_ini_entries_ex = Module["_zend_unregister_ini_entries_ex"] = Module["asm"]["zend_unregister_ini_entries_ex"]).apply(null, arguments);
};

var _php_info_print_table_start = Module["_php_info_print_table_start"] = function() {
 return (_php_info_print_table_start = Module["_php_info_print_table_start"] = Module["asm"]["php_info_print_table_start"]).apply(null, arguments);
};

var _php_info_print_table_row = Module["_php_info_print_table_row"] = function() {
 return (_php_info_print_table_row = Module["_php_info_print_table_row"] = Module["asm"]["php_info_print_table_row"]).apply(null, arguments);
};

var _php_info_print_table_end = Module["_php_info_print_table_end"] = function() {
 return (_php_info_print_table_end = Module["_php_info_print_table_end"] = Module["asm"]["php_info_print_table_end"]).apply(null, arguments);
};

var _display_ini_entries = Module["_display_ini_entries"] = function() {
 return (_display_ini_entries = Module["_display_ini_entries"] = Module["asm"]["display_ini_entries"]).apply(null, arguments);
};

var _get_timezone_info = Module["_get_timezone_info"] = function() {
 return (_get_timezone_info = Module["_get_timezone_info"] = Module["asm"]["get_timezone_info"]).apply(null, arguments);
};

var _zend_throw_error = Module["_zend_throw_error"] = function() {
 return (_zend_throw_error = Module["_zend_throw_error"] = Module["asm"]["zend_throw_error"]).apply(null, arguments);
};

var _php_format_date = Module["_php_format_date"] = function() {
 return (_php_format_date = Module["_php_format_date"] = Module["asm"]["php_format_date"]).apply(null, arguments);
};

var _php_idate = Module["_php_idate"] = function() {
 return (_php_idate = Module["_php_idate"] = Module["asm"]["php_idate"]).apply(null, arguments);
};

var __estrdup = Module["__estrdup"] = function() {
 return (__estrdup = Module["__estrdup"] = Module["asm"]["_estrdup"]).apply(null, arguments);
};

var __emalloc_16 = Module["__emalloc_16"] = function() {
 return (__emalloc_16 = Module["__emalloc_16"] = Module["asm"]["_emalloc_16"]).apply(null, arguments);
};

var _ap_php_snprintf = Module["_ap_php_snprintf"] = function() {
 return (_ap_php_snprintf = Module["_ap_php_snprintf"] = Module["asm"]["ap_php_snprintf"]).apply(null, arguments);
};

var _abs = Module["_abs"] = function() {
 return (_abs = Module["_abs"] = Module["asm"]["abs"]).apply(null, arguments);
};

var _zend_wrong_parameters_count_error = Module["_zend_wrong_parameters_count_error"] = function() {
 return (_zend_wrong_parameters_count_error = Module["_zend_wrong_parameters_count_error"] = Module["asm"]["zend_wrong_parameters_count_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_error = Module["_zend_wrong_parameter_error"] = function() {
 return (_zend_wrong_parameter_error = Module["_zend_wrong_parameter_error"] = Module["asm"]["zend_wrong_parameter_error"]).apply(null, arguments);
};

var _php_error_docref = Module["_php_error_docref"] = function() {
 return (_php_error_docref = Module["_php_error_docref"] = Module["asm"]["php_error_docref"]).apply(null, arguments);
};

var _php_date_set_tzdb = Module["_php_date_set_tzdb"] = function() {
 return (_php_date_set_tzdb = Module["_php_date_set_tzdb"] = Module["asm"]["php_date_set_tzdb"]).apply(null, arguments);
};

var _php_version_compare = Module["_php_version_compare"] = function() {
 return (_php_version_compare = Module["_php_version_compare"] = Module["asm"]["php_version_compare"]).apply(null, arguments);
};

var _php_parse_date = Module["_php_parse_date"] = function() {
 return (_php_parse_date = Module["_php_parse_date"] = Module["asm"]["php_parse_date"]).apply(null, arguments);
};

var _strlen = Module["_strlen"] = function() {
 return (_strlen = Module["_strlen"] = Module["asm"]["strlen"]).apply(null, arguments);
};

var _php_mktime = Module["_php_mktime"] = function() {
 return (_php_mktime = Module["_php_mktime"] = Module["asm"]["php_mktime"]).apply(null, arguments);
};

var _php_strftime = Module["_php_strftime"] = function() {
 return (_php_strftime = Module["_php_strftime"] = Module["asm"]["php_strftime"]).apply(null, arguments);
};

var _zend_wrong_parameters_none_error = Module["_zend_wrong_parameters_none_error"] = function() {
 return (_zend_wrong_parameters_none_error = Module["_zend_wrong_parameters_none_error"] = Module["asm"]["zend_wrong_parameters_none_error"]).apply(null, arguments);
};

var __zend_new_array_0 = Module["__zend_new_array_0"] = function() {
 return (__zend_new_array_0 = Module["__zend_new_array_0"] = Module["asm"]["_zend_new_array_0"]).apply(null, arguments);
};

var _add_next_index_long = Module["_add_next_index_long"] = function() {
 return (_add_next_index_long = Module["_add_next_index_long"] = Module["asm"]["add_next_index_long"]).apply(null, arguments);
};

var _add_index_long = Module["_add_index_long"] = function() {
 return (_add_index_long = Module["_add_index_long"] = Module["asm"]["add_index_long"]).apply(null, arguments);
};

var _php_date_instantiate = Module["_php_date_instantiate"] = function() {
 return (_php_date_instantiate = Module["_php_date_instantiate"] = Module["asm"]["php_date_instantiate"]).apply(null, arguments);
};

var _object_init_ex = Module["_object_init_ex"] = function() {
 return (_object_init_ex = Module["_object_init_ex"] = Module["asm"]["object_init_ex"]).apply(null, arguments);
};

var _php_date_initialize = Module["_php_date_initialize"] = function() {
 return (_php_date_initialize = Module["_php_date_initialize"] = Module["asm"]["php_date_initialize"]).apply(null, arguments);
};

var _zend_throw_exception_ex = Module["_zend_throw_exception_ex"] = function() {
 return (_zend_throw_exception_ex = Module["_zend_throw_exception_ex"] = Module["asm"]["zend_throw_exception_ex"]).apply(null, arguments);
};

var _memcmp = Module["_memcmp"] = function() {
 return (_memcmp = Module["_memcmp"] = Module["asm"]["memcmp"]).apply(null, arguments);
};

var _zval_ptr_dtor = Module["_zval_ptr_dtor"] = function() {
 return (_zval_ptr_dtor = Module["_zval_ptr_dtor"] = Module["asm"]["zval_ptr_dtor"]).apply(null, arguments);
};

var _zend_parse_method_parameters = Module["_zend_parse_method_parameters"] = function() {
 return (_zend_parse_method_parameters = Module["_zend_parse_method_parameters"] = Module["asm"]["zend_parse_method_parameters"]).apply(null, arguments);
};

var _zend_parse_parameters = Module["_zend_parse_parameters"] = function() {
 return (_zend_parse_parameters = Module["_zend_parse_parameters"] = Module["asm"]["zend_parse_parameters"]).apply(null, arguments);
};

var _zend_replace_error_handling = Module["_zend_replace_error_handling"] = function() {
 return (_zend_replace_error_handling = Module["_zend_replace_error_handling"] = Module["asm"]["zend_replace_error_handling"]).apply(null, arguments);
};

var _zend_restore_error_handling = Module["_zend_restore_error_handling"] = function() {
 return (_zend_restore_error_handling = Module["_zend_restore_error_handling"] = Module["asm"]["zend_restore_error_handling"]).apply(null, arguments);
};

var _zend_parse_parameters_ex = Module["_zend_parse_parameters_ex"] = function() {
 return (_zend_parse_parameters_ex = Module["_zend_parse_parameters_ex"] = Module["asm"]["zend_parse_parameters_ex"]).apply(null, arguments);
};

var _zend_type_error = Module["_zend_type_error"] = function() {
 return (_zend_type_error = Module["_zend_type_error"] = Module["asm"]["zend_type_error"]).apply(null, arguments);
};

var _zend_create_internal_iterator_zval = Module["_zend_create_internal_iterator_zval"] = function() {
 return (_zend_create_internal_iterator_zval = Module["_zend_create_internal_iterator_zval"] = Module["asm"]["zend_create_internal_iterator_zval"]).apply(null, arguments);
};

var _zend_argument_value_error = Module["_zend_argument_value_error"] = function() {
 return (_zend_argument_value_error = Module["_zend_argument_value_error"] = Module["asm"]["zend_argument_value_error"]).apply(null, arguments);
};

var _add_next_index_string = Module["_add_next_index_string"] = function() {
 return (_add_next_index_string = Module["_add_next_index_string"] = Module["asm"]["add_next_index_string"]).apply(null, arguments);
};

var _add_assoc_bool_ex = Module["_add_assoc_bool_ex"] = function() {
 return (_add_assoc_bool_ex = Module["_add_assoc_bool_ex"] = Module["asm"]["add_assoc_bool_ex"]).apply(null, arguments);
};

var _add_assoc_long_ex = Module["_add_assoc_long_ex"] = function() {
 return (_add_assoc_long_ex = Module["_add_assoc_long_ex"] = Module["asm"]["add_assoc_long_ex"]).apply(null, arguments);
};

var _add_assoc_string_ex = Module["_add_assoc_string_ex"] = function() {
 return (_add_assoc_string_ex = Module["_add_assoc_string_ex"] = Module["asm"]["add_assoc_string_ex"]).apply(null, arguments);
};

var _add_assoc_null_ex = Module["_add_assoc_null_ex"] = function() {
 return (_add_assoc_null_ex = Module["_add_assoc_null_ex"] = Module["asm"]["add_assoc_null_ex"]).apply(null, arguments);
};

var _zend_hash_str_find = Module["_zend_hash_str_find"] = function() {
 return (_zend_hash_str_find = Module["_zend_hash_str_find"] = Module["asm"]["zend_hash_str_find"]).apply(null, arguments);
};

var __estrndup = Module["__estrndup"] = function() {
 return (__estrndup = Module["__estrndup"] = Module["asm"]["_estrndup"]).apply(null, arguments);
};

var _OnUpdateString = Module["_OnUpdateString"] = function() {
 return (_OnUpdateString = Module["_OnUpdateString"] = Module["asm"]["OnUpdateString"]).apply(null, arguments);
};

var _zend_register_string_constant = Module["_zend_register_string_constant"] = function() {
 return (_zend_register_string_constant = Module["_zend_register_string_constant"] = Module["asm"]["zend_register_string_constant"]).apply(null, arguments);
};

var _zend_register_long_constant = Module["_zend_register_long_constant"] = function() {
 return (_zend_register_long_constant = Module["_zend_register_long_constant"] = Module["asm"]["zend_register_long_constant"]).apply(null, arguments);
};

var _cfg_get_entry = Module["_cfg_get_entry"] = function() {
 return (_cfg_get_entry = Module["_cfg_get_entry"] = Module["asm"]["cfg_get_entry"]).apply(null, arguments);
};

var __emalloc_48 = Module["__emalloc_48"] = function() {
 return (__emalloc_48 = Module["__emalloc_48"] = Module["asm"]["_emalloc_48"]).apply(null, arguments);
};

var __zend_hash_init = Module["__zend_hash_init"] = function() {
 return (__zend_hash_init = Module["__zend_hash_init"] = Module["asm"]["_zend_hash_init"]).apply(null, arguments);
};

var _zend_hash_str_add = Module["_zend_hash_str_add"] = function() {
 return (_zend_hash_str_add = Module["_zend_hash_str_add"] = Module["asm"]["zend_hash_str_add"]).apply(null, arguments);
};

var _ap_php_slprintf = Module["_ap_php_slprintf"] = function() {
 return (_ap_php_slprintf = Module["_ap_php_slprintf"] = Module["asm"]["ap_php_slprintf"]).apply(null, arguments);
};

var _strcmp = Module["_strcmp"] = function() {
 return (_strcmp = Module["_strcmp"] = Module["asm"]["strcmp"]).apply(null, arguments);
};

var _smart_str_realloc = Module["_smart_str_realloc"] = function() {
 return (_smart_str_realloc = Module["_smart_str_realloc"] = Module["asm"]["smart_str_realloc"]).apply(null, arguments);
};

var _smart_str_erealloc = Module["_smart_str_erealloc"] = function() {
 return (_smart_str_erealloc = Module["_smart_str_erealloc"] = Module["asm"]["smart_str_erealloc"]).apply(null, arguments);
};

var _zend_parse_arg_str_slow = Module["_zend_parse_arg_str_slow"] = function() {
 return (_zend_parse_arg_str_slow = Module["_zend_parse_arg_str_slow"] = Module["asm"]["zend_parse_arg_str_slow"]).apply(null, arguments);
};

var _zend_parse_arg_long_slow = Module["_zend_parse_arg_long_slow"] = function() {
 return (_zend_parse_arg_long_slow = Module["_zend_parse_arg_long_slow"] = Module["asm"]["zend_parse_arg_long_slow"]).apply(null, arguments);
};

var ___zend_malloc = Module["___zend_malloc"] = function() {
 return (___zend_malloc = Module["___zend_malloc"] = Module["asm"]["__zend_malloc"]).apply(null, arguments);
};

var __emalloc_8 = Module["__emalloc_8"] = function() {
 return (__emalloc_8 = Module["__emalloc_8"] = Module["asm"]["_emalloc_8"]).apply(null, arguments);
};

var __emalloc_24 = Module["__emalloc_24"] = function() {
 return (__emalloc_24 = Module["__emalloc_24"] = Module["asm"]["_emalloc_24"]).apply(null, arguments);
};

var __emalloc_32 = Module["__emalloc_32"] = function() {
 return (__emalloc_32 = Module["__emalloc_32"] = Module["asm"]["_emalloc_32"]).apply(null, arguments);
};

var __emalloc_40 = Module["__emalloc_40"] = function() {
 return (__emalloc_40 = Module["__emalloc_40"] = Module["asm"]["_emalloc_40"]).apply(null, arguments);
};

var __emalloc_56 = Module["__emalloc_56"] = function() {
 return (__emalloc_56 = Module["__emalloc_56"] = Module["asm"]["_emalloc_56"]).apply(null, arguments);
};

var __emalloc_64 = Module["__emalloc_64"] = function() {
 return (__emalloc_64 = Module["__emalloc_64"] = Module["asm"]["_emalloc_64"]).apply(null, arguments);
};

var __emalloc_80 = Module["__emalloc_80"] = function() {
 return (__emalloc_80 = Module["__emalloc_80"] = Module["asm"]["_emalloc_80"]).apply(null, arguments);
};

var __emalloc_96 = Module["__emalloc_96"] = function() {
 return (__emalloc_96 = Module["__emalloc_96"] = Module["asm"]["_emalloc_96"]).apply(null, arguments);
};

var __emalloc_112 = Module["__emalloc_112"] = function() {
 return (__emalloc_112 = Module["__emalloc_112"] = Module["asm"]["_emalloc_112"]).apply(null, arguments);
};

var __emalloc_128 = Module["__emalloc_128"] = function() {
 return (__emalloc_128 = Module["__emalloc_128"] = Module["asm"]["_emalloc_128"]).apply(null, arguments);
};

var __emalloc_160 = Module["__emalloc_160"] = function() {
 return (__emalloc_160 = Module["__emalloc_160"] = Module["asm"]["_emalloc_160"]).apply(null, arguments);
};

var __emalloc_192 = Module["__emalloc_192"] = function() {
 return (__emalloc_192 = Module["__emalloc_192"] = Module["asm"]["_emalloc_192"]).apply(null, arguments);
};

var __emalloc_224 = Module["__emalloc_224"] = function() {
 return (__emalloc_224 = Module["__emalloc_224"] = Module["asm"]["_emalloc_224"]).apply(null, arguments);
};

var __emalloc_256 = Module["__emalloc_256"] = function() {
 return (__emalloc_256 = Module["__emalloc_256"] = Module["asm"]["_emalloc_256"]).apply(null, arguments);
};

var __emalloc_320 = Module["__emalloc_320"] = function() {
 return (__emalloc_320 = Module["__emalloc_320"] = Module["asm"]["_emalloc_320"]).apply(null, arguments);
};

var __emalloc_384 = Module["__emalloc_384"] = function() {
 return (__emalloc_384 = Module["__emalloc_384"] = Module["asm"]["_emalloc_384"]).apply(null, arguments);
};

var __emalloc_448 = Module["__emalloc_448"] = function() {
 return (__emalloc_448 = Module["__emalloc_448"] = Module["asm"]["_emalloc_448"]).apply(null, arguments);
};

var __emalloc_512 = Module["__emalloc_512"] = function() {
 return (__emalloc_512 = Module["__emalloc_512"] = Module["asm"]["_emalloc_512"]).apply(null, arguments);
};

var __emalloc_640 = Module["__emalloc_640"] = function() {
 return (__emalloc_640 = Module["__emalloc_640"] = Module["asm"]["_emalloc_640"]).apply(null, arguments);
};

var __emalloc_768 = Module["__emalloc_768"] = function() {
 return (__emalloc_768 = Module["__emalloc_768"] = Module["asm"]["_emalloc_768"]).apply(null, arguments);
};

var __emalloc_896 = Module["__emalloc_896"] = function() {
 return (__emalloc_896 = Module["__emalloc_896"] = Module["asm"]["_emalloc_896"]).apply(null, arguments);
};

var __emalloc_1024 = Module["__emalloc_1024"] = function() {
 return (__emalloc_1024 = Module["__emalloc_1024"] = Module["asm"]["_emalloc_1024"]).apply(null, arguments);
};

var __emalloc_1280 = Module["__emalloc_1280"] = function() {
 return (__emalloc_1280 = Module["__emalloc_1280"] = Module["asm"]["_emalloc_1280"]).apply(null, arguments);
};

var __emalloc_1536 = Module["__emalloc_1536"] = function() {
 return (__emalloc_1536 = Module["__emalloc_1536"] = Module["asm"]["_emalloc_1536"]).apply(null, arguments);
};

var __emalloc_1792 = Module["__emalloc_1792"] = function() {
 return (__emalloc_1792 = Module["__emalloc_1792"] = Module["asm"]["_emalloc_1792"]).apply(null, arguments);
};

var __emalloc_2048 = Module["__emalloc_2048"] = function() {
 return (__emalloc_2048 = Module["__emalloc_2048"] = Module["asm"]["_emalloc_2048"]).apply(null, arguments);
};

var __emalloc_2560 = Module["__emalloc_2560"] = function() {
 return (__emalloc_2560 = Module["__emalloc_2560"] = Module["asm"]["_emalloc_2560"]).apply(null, arguments);
};

var __emalloc_3072 = Module["__emalloc_3072"] = function() {
 return (__emalloc_3072 = Module["__emalloc_3072"] = Module["asm"]["_emalloc_3072"]).apply(null, arguments);
};

var __emalloc_large = Module["__emalloc_large"] = function() {
 return (__emalloc_large = Module["__emalloc_large"] = Module["asm"]["_emalloc_large"]).apply(null, arguments);
};

var __emalloc_huge = Module["__emalloc_huge"] = function() {
 return (__emalloc_huge = Module["__emalloc_huge"] = Module["asm"]["_emalloc_huge"]).apply(null, arguments);
};

var __emalloc = Module["__emalloc"] = function() {
 return (__emalloc = Module["__emalloc"] = Module["asm"]["_emalloc"]).apply(null, arguments);
};

var ___zend_realloc = Module["___zend_realloc"] = function() {
 return (___zend_realloc = Module["___zend_realloc"] = Module["asm"]["__zend_realloc"]).apply(null, arguments);
};

var __erealloc = Module["__erealloc"] = function() {
 return (__erealloc = Module["__erealloc"] = Module["asm"]["_erealloc"]).apply(null, arguments);
};

var _zend_parse_arg_bool_slow = Module["_zend_parse_arg_bool_slow"] = function() {
 return (_zend_parse_arg_bool_slow = Module["_zend_parse_arg_bool_slow"] = Module["asm"]["zend_parse_arg_bool_slow"]).apply(null, arguments);
};

var _zend_register_internal_interface = Module["_zend_register_internal_interface"] = function() {
 return (_zend_register_internal_interface = Module["_zend_register_internal_interface"] = Module["asm"]["zend_register_internal_interface"]).apply(null, arguments);
};

var _zend_declare_class_constant_ex = Module["_zend_declare_class_constant_ex"] = function() {
 return (_zend_declare_class_constant_ex = Module["_zend_declare_class_constant_ex"] = Module["asm"]["zend_declare_class_constant_ex"]).apply(null, arguments);
};

var _free = function() {
 return (_free = Module["asm"]["free"]).apply(null, arguments);
};

var _zend_error = Module["_zend_error"] = function() {
 return (_zend_error = Module["_zend_error"] = Module["asm"]["zend_error"]).apply(null, arguments);
};

var _instanceof_function_slow = Module["_instanceof_function_slow"] = function() {
 return (_instanceof_function_slow = Module["_instanceof_function_slow"] = Module["asm"]["instanceof_function_slow"]).apply(null, arguments);
};

var _zend_register_internal_class_ex = Module["_zend_register_internal_class_ex"] = function() {
 return (_zend_register_internal_class_ex = Module["_zend_register_internal_class_ex"] = Module["asm"]["zend_register_internal_class_ex"]).apply(null, arguments);
};

var _zend_class_implements = Module["_zend_class_implements"] = function() {
 return (_zend_class_implements = Module["_zend_class_implements"] = Module["asm"]["zend_class_implements"]).apply(null, arguments);
};

var _zend_object_std_init = Module["_zend_object_std_init"] = function() {
 return (_zend_object_std_init = Module["_zend_object_std_init"] = Module["asm"]["zend_object_std_init"]).apply(null, arguments);
};

var _object_properties_init = Module["_object_properties_init"] = function() {
 return (_object_properties_init = Module["_object_properties_init"] = Module["asm"]["object_properties_init"]).apply(null, arguments);
};

var _zend_object_std_dtor = Module["_zend_object_std_dtor"] = function() {
 return (_zend_object_std_dtor = Module["_zend_object_std_dtor"] = Module["asm"]["zend_object_std_dtor"]).apply(null, arguments);
};

var _zend_objects_clone_members = Module["_zend_objects_clone_members"] = function() {
 return (_zend_objects_clone_members = Module["_zend_objects_clone_members"] = Module["asm"]["zend_objects_clone_members"]).apply(null, arguments);
};

var _zend_std_compare_objects = Module["_zend_std_compare_objects"] = function() {
 return (_zend_std_compare_objects = Module["_zend_std_compare_objects"] = Module["asm"]["zend_std_compare_objects"]).apply(null, arguments);
};

var _zend_std_get_properties_for = Module["_zend_std_get_properties_for"] = function() {
 return (_zend_std_get_properties_for = Module["_zend_std_get_properties_for"] = Module["asm"]["zend_std_get_properties_for"]).apply(null, arguments);
};

var _zend_array_dup = Module["_zend_array_dup"] = function() {
 return (_zend_array_dup = Module["_zend_array_dup"] = Module["asm"]["zend_array_dup"]).apply(null, arguments);
};

var _zend_std_get_properties = Module["_zend_std_get_properties"] = function() {
 return (_zend_std_get_properties = Module["_zend_std_get_properties"] = Module["asm"]["zend_std_get_properties"]).apply(null, arguments);
};

var _zend_hash_str_update = Module["_zend_hash_str_update"] = function() {
 return (_zend_hash_str_update = Module["_zend_hash_str_update"] = Module["asm"]["zend_hash_str_update"]).apply(null, arguments);
};

var _zend_std_has_property = Module["_zend_std_has_property"] = function() {
 return (_zend_std_has_property = Module["_zend_std_has_property"] = Module["asm"]["zend_std_has_property"]).apply(null, arguments);
};

var _zend_is_true = Module["_zend_is_true"] = function() {
 return (_zend_is_true = Module["_zend_is_true"] = Module["asm"]["zend_is_true"]).apply(null, arguments);
};

var _zend_std_read_property = Module["_zend_std_read_property"] = function() {
 return (_zend_std_read_property = Module["_zend_std_read_property"] = Module["asm"]["zend_std_read_property"]).apply(null, arguments);
};

var _zend_std_write_property = Module["_zend_std_write_property"] = function() {
 return (_zend_std_write_property = Module["_zend_std_write_property"] = Module["asm"]["zend_std_write_property"]).apply(null, arguments);
};

var _zval_get_long_func = Module["_zval_get_long_func"] = function() {
 return (_zval_get_long_func = Module["_zval_get_long_func"] = Module["asm"]["zval_get_long_func"]).apply(null, arguments);
};

var _zend_dval_to_lval_slow = Module["_zend_dval_to_lval_slow"] = function() {
 return (_zend_dval_to_lval_slow = Module["_zend_dval_to_lval_slow"] = Module["asm"]["zend_dval_to_lval_slow"]).apply(null, arguments);
};

var _zval_get_double_func = Module["_zval_get_double_func"] = function() {
 return (_zval_get_double_func = Module["_zval_get_double_func"] = Module["asm"]["zval_get_double_func"]).apply(null, arguments);
};

var _zend_std_get_property_ptr_ptr = Module["_zend_std_get_property_ptr_ptr"] = function() {
 return (_zend_std_get_property_ptr_ptr = Module["_zend_std_get_property_ptr_ptr"] = Module["asm"]["zend_std_get_property_ptr_ptr"]).apply(null, arguments);
};

var _zend_declare_typed_property = Module["_zend_declare_typed_property"] = function() {
 return (_zend_declare_typed_property = Module["_zend_declare_typed_property"] = Module["asm"]["zend_declare_typed_property"]).apply(null, arguments);
};

var _zend_iterator_init = Module["_zend_iterator_init"] = function() {
 return (_zend_iterator_init = Module["_zend_iterator_init"] = Module["asm"]["zend_iterator_init"]).apply(null, arguments);
};

var _rebuild_object_properties = Module["_rebuild_object_properties"] = function() {
 return (_rebuild_object_properties = Module["_rebuild_object_properties"] = Module["asm"]["rebuild_object_properties"]).apply(null, arguments);
};

var _zend_string_concat3 = Module["_zend_string_concat3"] = function() {
 return (_zend_string_concat3 = Module["_zend_string_concat3"] = Module["asm"]["zend_string_concat3"]).apply(null, arguments);
};

var _zend_hash_add = Module["_zend_hash_add"] = function() {
 return (_zend_hash_add = Module["_zend_hash_add"] = Module["asm"]["zend_hash_add"]).apply(null, arguments);
};

var _zend_unmangle_property_name_ex = Module["_zend_unmangle_property_name_ex"] = function() {
 return (_zend_unmangle_property_name_ex = Module["_zend_unmangle_property_name_ex"] = Module["asm"]["zend_unmangle_property_name_ex"]).apply(null, arguments);
};

var _zend_lookup_class = Module["_zend_lookup_class"] = function() {
 return (_zend_lookup_class = Module["_zend_lookup_class"] = Module["asm"]["zend_lookup_class"]).apply(null, arguments);
};

var _zend_update_property = Module["_zend_update_property"] = function() {
 return (_zend_update_property = Module["_zend_update_property"] = Module["asm"]["zend_update_property"]).apply(null, arguments);
};

var _add_index_string = Module["_add_index_string"] = function() {
 return (_add_index_string = Module["_add_index_string"] = Module["asm"]["add_index_string"]).apply(null, arguments);
};

var __ecalloc = Module["__ecalloc"] = function() {
 return (__ecalloc = Module["__ecalloc"] = Module["asm"]["_ecalloc"]).apply(null, arguments);
};

var _zend_spprintf = Module["_zend_spprintf"] = function() {
 return (_zend_spprintf = Module["_zend_spprintf"] = Module["asm"]["zend_spprintf"]).apply(null, arguments);
};

var _add_assoc_str_ex = Module["_add_assoc_str_ex"] = function() {
 return (_add_assoc_str_ex = Module["_add_assoc_str_ex"] = Module["asm"]["add_assoc_str_ex"]).apply(null, arguments);
};

var _zend_hash_next_index_insert = Module["_zend_hash_next_index_insert"] = function() {
 return (_zend_hash_next_index_insert = Module["_zend_hash_next_index_insert"] = Module["asm"]["zend_hash_next_index_insert"]).apply(null, arguments);
};

var _add_assoc_double_ex = Module["_add_assoc_double_ex"] = function() {
 return (_add_assoc_double_ex = Module["_add_assoc_double_ex"] = Module["asm"]["add_assoc_double_ex"]).apply(null, arguments);
};

var _strtoll = Module["_strtoll"] = function() {
 return (_strtoll = Module["_strtoll"] = Module["asm"]["strtoll"]).apply(null, arguments);
};

var _zval_get_string_func = Module["_zval_get_string_func"] = function() {
 return (_zval_get_string_func = Module["_zval_get_string_func"] = Module["asm"]["zval_get_string_func"]).apply(null, arguments);
};

var _get_active_function_or_method_name = Module["_get_active_function_or_method_name"] = function() {
 return (_get_active_function_or_method_name = Module["_get_active_function_or_method_name"] = Module["asm"]["get_active_function_or_method_name"]).apply(null, arguments);
};

var _strncasecmp = Module["_strncasecmp"] = function() {
 return (_strncasecmp = Module["_strncasecmp"] = Module["asm"]["strncasecmp"]).apply(null, arguments);
};

var _add_assoc_zval_ex = Module["_add_assoc_zval_ex"] = function() {
 return (_add_assoc_zval_ex = Module["_add_assoc_zval_ex"] = Module["asm"]["add_assoc_zval_ex"]).apply(null, arguments);
};

var _zend_ini_double = Module["_zend_ini_double"] = function() {
 return (_zend_ini_double = Module["_zend_ini_double"] = Module["asm"]["zend_ini_double"]).apply(null, arguments);
};

var _zend_strpprintf = Module["_zend_strpprintf"] = function() {
 return (_zend_strpprintf = Module["_zend_strpprintf"] = Module["asm"]["zend_strpprintf"]).apply(null, arguments);
};

var _zend_parse_arg_double_slow = Module["_zend_parse_arg_double_slow"] = function() {
 return (_zend_parse_arg_double_slow = Module["_zend_parse_arg_double_slow"] = Module["asm"]["zend_parse_arg_double_slow"]).apply(null, arguments);
};

var _acos = Module["_acos"] = function() {
 return (_acos = Module["_acos"] = Module["asm"]["acos"]).apply(null, arguments);
};

var _atan2 = Module["_atan2"] = function() {
 return (_atan2 = Module["_atan2"] = Module["asm"]["atan2"]).apply(null, arguments);
};

var _isspace = Module["_isspace"] = function() {
 return (_isspace = Module["_isspace"] = Module["asm"]["isspace"]).apply(null, arguments);
};

var _strchr = Module["_strchr"] = function() {
 return (_strchr = Module["_strchr"] = Module["asm"]["strchr"]).apply(null, arguments);
};

var _isdigit = Module["_isdigit"] = function() {
 return (_isdigit = Module["_isdigit"] = Module["asm"]["isdigit"]).apply(null, arguments);
};

var _strtol = Module["_strtol"] = function() {
 return (_strtol = Module["_strtol"] = Module["asm"]["strtol"]).apply(null, arguments);
};

var _strtod = Module["_strtod"] = function() {
 return (_strtod = Module["_strtod"] = Module["asm"]["strtod"]).apply(null, arguments);
};

var ___errno_location = function() {
 return (___errno_location = Module["asm"]["__errno_location"]).apply(null, arguments);
};

var _printf = Module["_printf"] = function() {
 return (_printf = Module["_printf"] = Module["asm"]["printf"]).apply(null, arguments);
};

var _snprintf = Module["_snprintf"] = function() {
 return (_snprintf = Module["_snprintf"] = Module["asm"]["snprintf"]).apply(null, arguments);
};

var _toupper = Module["_toupper"] = function() {
 return (_toupper = Module["_toupper"] = Module["asm"]["toupper"]).apply(null, arguments);
};

var _llabs = Module["_llabs"] = function() {
 return (_llabs = Module["_llabs"] = Module["asm"]["llabs"]).apply(null, arguments);
};

var _php_pcre2_code_copy = Module["_php_pcre2_code_copy"] = function() {
 return (_php_pcre2_code_copy = Module["_php_pcre2_code_copy"] = Module["asm"]["php_pcre2_code_copy"]).apply(null, arguments);
};

var _php_pcre2_code_copy_with_tables = Module["_php_pcre2_code_copy_with_tables"] = function() {
 return (_php_pcre2_code_copy_with_tables = Module["_php_pcre2_code_copy_with_tables"] = Module["asm"]["php_pcre2_code_copy_with_tables"]).apply(null, arguments);
};

var _php_pcre2_code_free = Module["_php_pcre2_code_free"] = function() {
 return (_php_pcre2_code_free = Module["_php_pcre2_code_free"] = Module["asm"]["php_pcre2_code_free"]).apply(null, arguments);
};

var _php_pcre2_compile = Module["_php_pcre2_compile"] = function() {
 return (_php_pcre2_compile = Module["_php_pcre2_compile"] = Module["asm"]["php_pcre2_compile"]).apply(null, arguments);
};

var _tolower = Module["_tolower"] = function() {
 return (_tolower = Module["_tolower"] = Module["asm"]["tolower"]).apply(null, arguments);
};

var _php_pcre2_config = Module["_php_pcre2_config"] = function() {
 return (_php_pcre2_config = Module["_php_pcre2_config"] = Module["asm"]["php_pcre2_config"]).apply(null, arguments);
};

var _malloc = function() {
 return (_malloc = Module["asm"]["malloc"]).apply(null, arguments);
};

var _php_pcre2_general_context_create = Module["_php_pcre2_general_context_create"] = function() {
 return (_php_pcre2_general_context_create = Module["_php_pcre2_general_context_create"] = Module["asm"]["php_pcre2_general_context_create"]).apply(null, arguments);
};

var _php_pcre2_compile_context_create = Module["_php_pcre2_compile_context_create"] = function() {
 return (_php_pcre2_compile_context_create = Module["_php_pcre2_compile_context_create"] = Module["asm"]["php_pcre2_compile_context_create"]).apply(null, arguments);
};

var _php_pcre2_match_context_create = Module["_php_pcre2_match_context_create"] = function() {
 return (_php_pcre2_match_context_create = Module["_php_pcre2_match_context_create"] = Module["asm"]["php_pcre2_match_context_create"]).apply(null, arguments);
};

var _php_pcre2_convert_context_create = Module["_php_pcre2_convert_context_create"] = function() {
 return (_php_pcre2_convert_context_create = Module["_php_pcre2_convert_context_create"] = Module["asm"]["php_pcre2_convert_context_create"]).apply(null, arguments);
};

var _php_pcre2_general_context_copy = Module["_php_pcre2_general_context_copy"] = function() {
 return (_php_pcre2_general_context_copy = Module["_php_pcre2_general_context_copy"] = Module["asm"]["php_pcre2_general_context_copy"]).apply(null, arguments);
};

var _php_pcre2_compile_context_copy = Module["_php_pcre2_compile_context_copy"] = function() {
 return (_php_pcre2_compile_context_copy = Module["_php_pcre2_compile_context_copy"] = Module["asm"]["php_pcre2_compile_context_copy"]).apply(null, arguments);
};

var _php_pcre2_match_context_copy = Module["_php_pcre2_match_context_copy"] = function() {
 return (_php_pcre2_match_context_copy = Module["_php_pcre2_match_context_copy"] = Module["asm"]["php_pcre2_match_context_copy"]).apply(null, arguments);
};

var _php_pcre2_convert_context_copy = Module["_php_pcre2_convert_context_copy"] = function() {
 return (_php_pcre2_convert_context_copy = Module["_php_pcre2_convert_context_copy"] = Module["asm"]["php_pcre2_convert_context_copy"]).apply(null, arguments);
};

var _php_pcre2_general_context_free = Module["_php_pcre2_general_context_free"] = function() {
 return (_php_pcre2_general_context_free = Module["_php_pcre2_general_context_free"] = Module["asm"]["php_pcre2_general_context_free"]).apply(null, arguments);
};

var _php_pcre2_compile_context_free = Module["_php_pcre2_compile_context_free"] = function() {
 return (_php_pcre2_compile_context_free = Module["_php_pcre2_compile_context_free"] = Module["asm"]["php_pcre2_compile_context_free"]).apply(null, arguments);
};

var _php_pcre2_match_context_free = Module["_php_pcre2_match_context_free"] = function() {
 return (_php_pcre2_match_context_free = Module["_php_pcre2_match_context_free"] = Module["asm"]["php_pcre2_match_context_free"]).apply(null, arguments);
};

var _php_pcre2_convert_context_free = Module["_php_pcre2_convert_context_free"] = function() {
 return (_php_pcre2_convert_context_free = Module["_php_pcre2_convert_context_free"] = Module["asm"]["php_pcre2_convert_context_free"]).apply(null, arguments);
};

var _php_pcre2_set_character_tables = Module["_php_pcre2_set_character_tables"] = function() {
 return (_php_pcre2_set_character_tables = Module["_php_pcre2_set_character_tables"] = Module["asm"]["php_pcre2_set_character_tables"]).apply(null, arguments);
};

var _php_pcre2_set_bsr = Module["_php_pcre2_set_bsr"] = function() {
 return (_php_pcre2_set_bsr = Module["_php_pcre2_set_bsr"] = Module["asm"]["php_pcre2_set_bsr"]).apply(null, arguments);
};

var _php_pcre2_set_max_pattern_length = Module["_php_pcre2_set_max_pattern_length"] = function() {
 return (_php_pcre2_set_max_pattern_length = Module["_php_pcre2_set_max_pattern_length"] = Module["asm"]["php_pcre2_set_max_pattern_length"]).apply(null, arguments);
};

var _php_pcre2_set_newline = Module["_php_pcre2_set_newline"] = function() {
 return (_php_pcre2_set_newline = Module["_php_pcre2_set_newline"] = Module["asm"]["php_pcre2_set_newline"]).apply(null, arguments);
};

var _php_pcre2_set_parens_nest_limit = Module["_php_pcre2_set_parens_nest_limit"] = function() {
 return (_php_pcre2_set_parens_nest_limit = Module["_php_pcre2_set_parens_nest_limit"] = Module["asm"]["php_pcre2_set_parens_nest_limit"]).apply(null, arguments);
};

var _php_pcre2_set_compile_extra_options = Module["_php_pcre2_set_compile_extra_options"] = function() {
 return (_php_pcre2_set_compile_extra_options = Module["_php_pcre2_set_compile_extra_options"] = Module["asm"]["php_pcre2_set_compile_extra_options"]).apply(null, arguments);
};

var _php_pcre2_set_compile_recursion_guard = Module["_php_pcre2_set_compile_recursion_guard"] = function() {
 return (_php_pcre2_set_compile_recursion_guard = Module["_php_pcre2_set_compile_recursion_guard"] = Module["asm"]["php_pcre2_set_compile_recursion_guard"]).apply(null, arguments);
};

var _php_pcre2_set_callout = Module["_php_pcre2_set_callout"] = function() {
 return (_php_pcre2_set_callout = Module["_php_pcre2_set_callout"] = Module["asm"]["php_pcre2_set_callout"]).apply(null, arguments);
};

var _pcre2_set_substitute_callout_8 = Module["_pcre2_set_substitute_callout_8"] = function() {
 return (_pcre2_set_substitute_callout_8 = Module["_pcre2_set_substitute_callout_8"] = Module["asm"]["pcre2_set_substitute_callout_8"]).apply(null, arguments);
};

var _php_pcre2_set_heap_limit = Module["_php_pcre2_set_heap_limit"] = function() {
 return (_php_pcre2_set_heap_limit = Module["_php_pcre2_set_heap_limit"] = Module["asm"]["php_pcre2_set_heap_limit"]).apply(null, arguments);
};

var _php_pcre2_set_match_limit = Module["_php_pcre2_set_match_limit"] = function() {
 return (_php_pcre2_set_match_limit = Module["_php_pcre2_set_match_limit"] = Module["asm"]["php_pcre2_set_match_limit"]).apply(null, arguments);
};

var _php_pcre2_set_depth_limit = Module["_php_pcre2_set_depth_limit"] = function() {
 return (_php_pcre2_set_depth_limit = Module["_php_pcre2_set_depth_limit"] = Module["asm"]["php_pcre2_set_depth_limit"]).apply(null, arguments);
};

var _php_pcre2_set_offset_limit = Module["_php_pcre2_set_offset_limit"] = function() {
 return (_php_pcre2_set_offset_limit = Module["_php_pcre2_set_offset_limit"] = Module["asm"]["php_pcre2_set_offset_limit"]).apply(null, arguments);
};

var _php_pcre2_set_recursion_limit = Module["_php_pcre2_set_recursion_limit"] = function() {
 return (_php_pcre2_set_recursion_limit = Module["_php_pcre2_set_recursion_limit"] = Module["asm"]["php_pcre2_set_recursion_limit"]).apply(null, arguments);
};

var _php_pcre2_set_recursion_memory_management = Module["_php_pcre2_set_recursion_memory_management"] = function() {
 return (_php_pcre2_set_recursion_memory_management = Module["_php_pcre2_set_recursion_memory_management"] = Module["asm"]["php_pcre2_set_recursion_memory_management"]).apply(null, arguments);
};

var _php_pcre2_set_glob_separator = Module["_php_pcre2_set_glob_separator"] = function() {
 return (_php_pcre2_set_glob_separator = Module["_php_pcre2_set_glob_separator"] = Module["asm"]["php_pcre2_set_glob_separator"]).apply(null, arguments);
};

var _php_pcre2_set_glob_escape = Module["_php_pcre2_set_glob_escape"] = function() {
 return (_php_pcre2_set_glob_escape = Module["_php_pcre2_set_glob_escape"] = Module["asm"]["php_pcre2_set_glob_escape"]).apply(null, arguments);
};

var _ispunct = Module["_ispunct"] = function() {
 return (_ispunct = Module["_ispunct"] = Module["asm"]["ispunct"]).apply(null, arguments);
};

var _php_pcre2_dfa_match = Module["_php_pcre2_dfa_match"] = function() {
 return (_php_pcre2_dfa_match = Module["_php_pcre2_dfa_match"] = Module["asm"]["php_pcre2_dfa_match"]).apply(null, arguments);
};

var _memchr = Module["_memchr"] = function() {
 return (_memchr = Module["_memchr"] = Module["asm"]["memchr"]).apply(null, arguments);
};

var _php_pcre2_get_error_message = Module["_php_pcre2_get_error_message"] = function() {
 return (_php_pcre2_get_error_message = Module["_php_pcre2_get_error_message"] = Module["asm"]["php_pcre2_get_error_message"]).apply(null, arguments);
};

var _php_pcre2_jit_compile = Module["_php_pcre2_jit_compile"] = function() {
 return (_php_pcre2_jit_compile = Module["_php_pcre2_jit_compile"] = Module["asm"]["php_pcre2_jit_compile"]).apply(null, arguments);
};

var _php_pcre2_jit_match = Module["_php_pcre2_jit_match"] = function() {
 return (_php_pcre2_jit_match = Module["_php_pcre2_jit_match"] = Module["asm"]["php_pcre2_jit_match"]).apply(null, arguments);
};

var _php_pcre2_jit_free_unused_memory = Module["_php_pcre2_jit_free_unused_memory"] = function() {
 return (_php_pcre2_jit_free_unused_memory = Module["_php_pcre2_jit_free_unused_memory"] = Module["asm"]["php_pcre2_jit_free_unused_memory"]).apply(null, arguments);
};

var _php_pcre2_jit_stack_create = Module["_php_pcre2_jit_stack_create"] = function() {
 return (_php_pcre2_jit_stack_create = Module["_php_pcre2_jit_stack_create"] = Module["asm"]["php_pcre2_jit_stack_create"]).apply(null, arguments);
};

var _php_pcre2_jit_stack_assign = Module["_php_pcre2_jit_stack_assign"] = function() {
 return (_php_pcre2_jit_stack_assign = Module["_php_pcre2_jit_stack_assign"] = Module["asm"]["php_pcre2_jit_stack_assign"]).apply(null, arguments);
};

var _php_pcre2_jit_stack_free = Module["_php_pcre2_jit_stack_free"] = function() {
 return (_php_pcre2_jit_stack_free = Module["_php_pcre2_jit_stack_free"] = Module["asm"]["php_pcre2_jit_stack_free"]).apply(null, arguments);
};

var _php_pcre2_maketables = Module["_php_pcre2_maketables"] = function() {
 return (_php_pcre2_maketables = Module["_php_pcre2_maketables"] = Module["asm"]["php_pcre2_maketables"]).apply(null, arguments);
};

var _islower = Module["_islower"] = function() {
 return (_islower = Module["_islower"] = Module["asm"]["islower"]).apply(null, arguments);
};

var _isupper = Module["_isupper"] = function() {
 return (_isupper = Module["_isupper"] = Module["asm"]["isupper"]).apply(null, arguments);
};

var _isalnum = Module["_isalnum"] = function() {
 return (_isalnum = Module["_isalnum"] = Module["asm"]["isalnum"]).apply(null, arguments);
};

var _isxdigit = Module["_isxdigit"] = function() {
 return (_isxdigit = Module["_isxdigit"] = Module["asm"]["isxdigit"]).apply(null, arguments);
};

var _isgraph = Module["_isgraph"] = function() {
 return (_isgraph = Module["_isgraph"] = Module["asm"]["isgraph"]).apply(null, arguments);
};

var _isprint = Module["_isprint"] = function() {
 return (_isprint = Module["_isprint"] = Module["asm"]["isprint"]).apply(null, arguments);
};

var _iscntrl = Module["_iscntrl"] = function() {
 return (_iscntrl = Module["_iscntrl"] = Module["asm"]["iscntrl"]).apply(null, arguments);
};

var _isalpha = Module["_isalpha"] = function() {
 return (_isalpha = Module["_isalpha"] = Module["asm"]["isalpha"]).apply(null, arguments);
};

var _pcre2_maketables_free_8 = Module["_pcre2_maketables_free_8"] = function() {
 return (_pcre2_maketables_free_8 = Module["_pcre2_maketables_free_8"] = Module["asm"]["pcre2_maketables_free_8"]).apply(null, arguments);
};

var _php_pcre2_match = Module["_php_pcre2_match"] = function() {
 return (_php_pcre2_match = Module["_php_pcre2_match"] = Module["asm"]["php_pcre2_match"]).apply(null, arguments);
};

var _php_pcre2_match_data_create = Module["_php_pcre2_match_data_create"] = function() {
 return (_php_pcre2_match_data_create = Module["_php_pcre2_match_data_create"] = Module["asm"]["php_pcre2_match_data_create"]).apply(null, arguments);
};

var _php_pcre2_match_data_create_from_pattern = Module["_php_pcre2_match_data_create_from_pattern"] = function() {
 return (_php_pcre2_match_data_create_from_pattern = Module["_php_pcre2_match_data_create_from_pattern"] = Module["asm"]["php_pcre2_match_data_create_from_pattern"]).apply(null, arguments);
};

var _php_pcre2_match_data_free = Module["_php_pcre2_match_data_free"] = function() {
 return (_php_pcre2_match_data_free = Module["_php_pcre2_match_data_free"] = Module["asm"]["php_pcre2_match_data_free"]).apply(null, arguments);
};

var _php_pcre2_get_mark = Module["_php_pcre2_get_mark"] = function() {
 return (_php_pcre2_get_mark = Module["_php_pcre2_get_mark"] = Module["asm"]["php_pcre2_get_mark"]).apply(null, arguments);
};

var _php_pcre2_get_ovector_pointer = Module["_php_pcre2_get_ovector_pointer"] = function() {
 return (_php_pcre2_get_ovector_pointer = Module["_php_pcre2_get_ovector_pointer"] = Module["asm"]["php_pcre2_get_ovector_pointer"]).apply(null, arguments);
};

var _php_pcre2_get_ovector_count = Module["_php_pcre2_get_ovector_count"] = function() {
 return (_php_pcre2_get_ovector_count = Module["_php_pcre2_get_ovector_count"] = Module["asm"]["php_pcre2_get_ovector_count"]).apply(null, arguments);
};

var _php_pcre2_get_startchar = Module["_php_pcre2_get_startchar"] = function() {
 return (_php_pcre2_get_startchar = Module["_php_pcre2_get_startchar"] = Module["asm"]["php_pcre2_get_startchar"]).apply(null, arguments);
};

var _pcre2_get_match_data_size_8 = Module["_pcre2_get_match_data_size_8"] = function() {
 return (_pcre2_get_match_data_size_8 = Module["_pcre2_get_match_data_size_8"] = Module["asm"]["pcre2_get_match_data_size_8"]).apply(null, arguments);
};

var _php_pcre2_pattern_info = Module["_php_pcre2_pattern_info"] = function() {
 return (_php_pcre2_pattern_info = Module["_php_pcre2_pattern_info"] = Module["asm"]["php_pcre2_pattern_info"]).apply(null, arguments);
};

var _php_pcre2_callout_enumerate = Module["_php_pcre2_callout_enumerate"] = function() {
 return (_php_pcre2_callout_enumerate = Module["_php_pcre2_callout_enumerate"] = Module["asm"]["php_pcre2_callout_enumerate"]).apply(null, arguments);
};

var _php_pcre2_serialize_encode = Module["_php_pcre2_serialize_encode"] = function() {
 return (_php_pcre2_serialize_encode = Module["_php_pcre2_serialize_encode"] = Module["asm"]["php_pcre2_serialize_encode"]).apply(null, arguments);
};

var _php_pcre2_serialize_decode = Module["_php_pcre2_serialize_decode"] = function() {
 return (_php_pcre2_serialize_decode = Module["_php_pcre2_serialize_decode"] = Module["asm"]["php_pcre2_serialize_decode"]).apply(null, arguments);
};

var _php_pcre2_serialize_get_number_of_codes = Module["_php_pcre2_serialize_get_number_of_codes"] = function() {
 return (_php_pcre2_serialize_get_number_of_codes = Module["_php_pcre2_serialize_get_number_of_codes"] = Module["asm"]["php_pcre2_serialize_get_number_of_codes"]).apply(null, arguments);
};

var _php_pcre2_serialize_free = Module["_php_pcre2_serialize_free"] = function() {
 return (_php_pcre2_serialize_free = Module["_php_pcre2_serialize_free"] = Module["asm"]["php_pcre2_serialize_free"]).apply(null, arguments);
};

var _php_pcre2_substitute = Module["_php_pcre2_substitute"] = function() {
 return (_php_pcre2_substitute = Module["_php_pcre2_substitute"] = Module["asm"]["php_pcre2_substitute"]).apply(null, arguments);
};

var _php_pcre2_substring_nametable_scan = Module["_php_pcre2_substring_nametable_scan"] = function() {
 return (_php_pcre2_substring_nametable_scan = Module["_php_pcre2_substring_nametable_scan"] = Module["asm"]["php_pcre2_substring_nametable_scan"]).apply(null, arguments);
};

var _php_pcre2_substring_length_bynumber = Module["_php_pcre2_substring_length_bynumber"] = function() {
 return (_php_pcre2_substring_length_bynumber = Module["_php_pcre2_substring_length_bynumber"] = Module["asm"]["php_pcre2_substring_length_bynumber"]).apply(null, arguments);
};

var _php_pcre2_substring_copy_byname = Module["_php_pcre2_substring_copy_byname"] = function() {
 return (_php_pcre2_substring_copy_byname = Module["_php_pcre2_substring_copy_byname"] = Module["asm"]["php_pcre2_substring_copy_byname"]).apply(null, arguments);
};

var _php_pcre2_substring_copy_bynumber = Module["_php_pcre2_substring_copy_bynumber"] = function() {
 return (_php_pcre2_substring_copy_bynumber = Module["_php_pcre2_substring_copy_bynumber"] = Module["asm"]["php_pcre2_substring_copy_bynumber"]).apply(null, arguments);
};

var _php_pcre2_substring_get_byname = Module["_php_pcre2_substring_get_byname"] = function() {
 return (_php_pcre2_substring_get_byname = Module["_php_pcre2_substring_get_byname"] = Module["asm"]["php_pcre2_substring_get_byname"]).apply(null, arguments);
};

var _php_pcre2_substring_get_bynumber = Module["_php_pcre2_substring_get_bynumber"] = function() {
 return (_php_pcre2_substring_get_bynumber = Module["_php_pcre2_substring_get_bynumber"] = Module["asm"]["php_pcre2_substring_get_bynumber"]).apply(null, arguments);
};

var _php_pcre2_substring_free = Module["_php_pcre2_substring_free"] = function() {
 return (_php_pcre2_substring_free = Module["_php_pcre2_substring_free"] = Module["asm"]["php_pcre2_substring_free"]).apply(null, arguments);
};

var _php_pcre2_substring_length_byname = Module["_php_pcre2_substring_length_byname"] = function() {
 return (_php_pcre2_substring_length_byname = Module["_php_pcre2_substring_length_byname"] = Module["asm"]["php_pcre2_substring_length_byname"]).apply(null, arguments);
};

var _php_pcre2_substring_list_get = Module["_php_pcre2_substring_list_get"] = function() {
 return (_php_pcre2_substring_list_get = Module["_php_pcre2_substring_list_get"] = Module["asm"]["php_pcre2_substring_list_get"]).apply(null, arguments);
};

var _php_pcre2_substring_list_free = Module["_php_pcre2_substring_list_free"] = function() {
 return (_php_pcre2_substring_list_free = Module["_php_pcre2_substring_list_free"] = Module["asm"]["php_pcre2_substring_list_free"]).apply(null, arguments);
};

var _php_pcre2_substring_number_from_name = Module["_php_pcre2_substring_number_from_name"] = function() {
 return (_php_pcre2_substring_number_from_name = Module["_php_pcre2_substring_number_from_name"] = Module["asm"]["php_pcre2_substring_number_from_name"]).apply(null, arguments);
};

var _pcre2_pattern_convert_8 = Module["_pcre2_pattern_convert_8"] = function() {
 return (_pcre2_pattern_convert_8 = Module["_pcre2_pattern_convert_8"] = Module["asm"]["pcre2_pattern_convert_8"]).apply(null, arguments);
};

var _pcre2_converted_pattern_free_8 = Module["_pcre2_converted_pattern_free_8"] = function() {
 return (_pcre2_converted_pattern_free_8 = Module["_pcre2_converted_pattern_free_8"] = Module["asm"]["pcre2_converted_pattern_free_8"]).apply(null, arguments);
};

var _pcre_get_compiled_regex_cache_ex = Module["_pcre_get_compiled_regex_cache_ex"] = function() {
 return (_pcre_get_compiled_regex_cache_ex = Module["_pcre_get_compiled_regex_cache_ex"] = Module["asm"]["pcre_get_compiled_regex_cache_ex"]).apply(null, arguments);
};

var _zend_string_concat2 = Module["_zend_string_concat2"] = function() {
 return (_zend_string_concat2 = Module["_zend_string_concat2"] = Module["asm"]["zend_string_concat2"]).apply(null, arguments);
};

var _zend_hash_find = Module["_zend_hash_find"] = function() {
 return (_zend_hash_find = Module["_zend_hash_find"] = Module["asm"]["zend_hash_find"]).apply(null, arguments);
};

var _zend_hash_apply_with_argument = Module["_zend_hash_apply_with_argument"] = function() {
 return (_zend_hash_apply_with_argument = Module["_zend_hash_apply_with_argument"] = Module["asm"]["zend_hash_apply_with_argument"]).apply(null, arguments);
};

var _pcre_get_compiled_regex_cache = Module["_pcre_get_compiled_regex_cache"] = function() {
 return (_pcre_get_compiled_regex_cache = Module["_pcre_get_compiled_regex_cache"] = Module["asm"]["pcre_get_compiled_regex_cache"]).apply(null, arguments);
};

var _pcre_get_compiled_regex = Module["_pcre_get_compiled_regex"] = function() {
 return (_pcre_get_compiled_regex = Module["_pcre_get_compiled_regex"] = Module["asm"]["pcre_get_compiled_regex"]).apply(null, arguments);
};

var _php_pcre_create_match_data = Module["_php_pcre_create_match_data"] = function() {
 return (_php_pcre_create_match_data = Module["_php_pcre_create_match_data"] = Module["asm"]["php_pcre_create_match_data"]).apply(null, arguments);
};

var _php_pcre_free_match_data = Module["_php_pcre_free_match_data"] = function() {
 return (_php_pcre_free_match_data = Module["_php_pcre_free_match_data"] = Module["asm"]["php_pcre_free_match_data"]).apply(null, arguments);
};

var _php_pcre_match_impl = Module["_php_pcre_match_impl"] = function() {
 return (_php_pcre_match_impl = Module["_php_pcre_match_impl"] = Module["asm"]["php_pcre_match_impl"]).apply(null, arguments);
};

var __safe_emalloc = Module["__safe_emalloc"] = function() {
 return (__safe_emalloc = Module["__safe_emalloc"] = Module["asm"]["_safe_emalloc"]).apply(null, arguments);
};

var _zend_hash_next_index_insert_new = Module["_zend_hash_next_index_insert_new"] = function() {
 return (_zend_hash_next_index_insert_new = Module["_zend_hash_next_index_insert_new"] = Module["asm"]["zend_hash_next_index_insert_new"]).apply(null, arguments);
};

var _add_next_index_null = Module["_add_next_index_null"] = function() {
 return (_add_next_index_null = Module["_add_next_index_null"] = Module["asm"]["add_next_index_null"]).apply(null, arguments);
};

var _add_next_index_str = Module["_add_next_index_str"] = function() {
 return (_add_next_index_str = Module["_add_next_index_str"] = Module["asm"]["add_next_index_str"]).apply(null, arguments);
};

var __zend_new_array = Module["__zend_new_array"] = function() {
 return (__zend_new_array = Module["__zend_new_array"] = Module["asm"]["_zend_new_array"]).apply(null, arguments);
};

var _zend_hash_update = Module["_zend_hash_update"] = function() {
 return (_zend_hash_update = Module["_zend_hash_update"] = Module["asm"]["zend_hash_update"]).apply(null, arguments);
};

var _php_pcre_replace = Module["_php_pcre_replace"] = function() {
 return (_php_pcre_replace = Module["_php_pcre_replace"] = Module["asm"]["php_pcre_replace"]).apply(null, arguments);
};

var _php_pcre_replace_impl = Module["_php_pcre_replace_impl"] = function() {
 return (_php_pcre_replace_impl = Module["_php_pcre_replace_impl"] = Module["asm"]["php_pcre_replace_impl"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_long = Module["_zend_try_assign_typed_ref_long"] = function() {
 return (_zend_try_assign_typed_ref_long = Module["_zend_try_assign_typed_ref_long"] = Module["asm"]["zend_try_assign_typed_ref_long"]).apply(null, arguments);
};

var _zend_is_callable_ex = Module["_zend_is_callable_ex"] = function() {
 return (_zend_is_callable_ex = Module["_zend_is_callable_ex"] = Module["asm"]["zend_is_callable_ex"]).apply(null, arguments);
};

var _zend_argument_type_error = Module["_zend_argument_type_error"] = function() {
 return (_zend_argument_type_error = Module["_zend_argument_type_error"] = Module["asm"]["zend_argument_type_error"]).apply(null, arguments);
};

var _php_pcre_split_impl = Module["_php_pcre_split_impl"] = function() {
 return (_php_pcre_split_impl = Module["_php_pcre_split_impl"] = Module["asm"]["php_pcre_split_impl"]).apply(null, arguments);
};

var _php_pcre_grep_impl = Module["_php_pcre_grep_impl"] = function() {
 return (_php_pcre_grep_impl = Module["_php_pcre_grep_impl"] = Module["asm"]["php_pcre_grep_impl"]).apply(null, arguments);
};

var _zend_hash_index_update = Module["_zend_hash_index_update"] = function() {
 return (_zend_hash_index_update = Module["_zend_hash_index_update"] = Module["asm"]["zend_hash_index_update"]).apply(null, arguments);
};

var _php_pcre_mctx = Module["_php_pcre_mctx"] = function() {
 return (_php_pcre_mctx = Module["_php_pcre_mctx"] = Module["asm"]["php_pcre_mctx"]).apply(null, arguments);
};

var _php_pcre_gctx = Module["_php_pcre_gctx"] = function() {
 return (_php_pcre_gctx = Module["_php_pcre_gctx"] = Module["asm"]["php_pcre_gctx"]).apply(null, arguments);
};

var _php_pcre_cctx = Module["_php_pcre_cctx"] = function() {
 return (_php_pcre_cctx = Module["_php_pcre_cctx"] = Module["asm"]["php_pcre_cctx"]).apply(null, arguments);
};

var _php_pcre_pce_incref = Module["_php_pcre_pce_incref"] = function() {
 return (_php_pcre_pce_incref = Module["_php_pcre_pce_incref"] = Module["asm"]["php_pcre_pce_incref"]).apply(null, arguments);
};

var _php_pcre_pce_decref = Module["_php_pcre_pce_decref"] = function() {
 return (_php_pcre_pce_decref = Module["_php_pcre_pce_decref"] = Module["asm"]["php_pcre_pce_decref"]).apply(null, arguments);
};

var _php_pcre_pce_re = Module["_php_pcre_pce_re"] = function() {
 return (_php_pcre_pce_re = Module["_php_pcre_pce_re"] = Module["asm"]["php_pcre_pce_re"]).apply(null, arguments);
};

var _zend_hash_add_new = Module["_zend_hash_add_new"] = function() {
 return (_zend_hash_add_new = Module["_zend_hash_add_new"] = Module["asm"]["zend_hash_add_new"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_arr = Module["_zend_try_assign_typed_ref_arr"] = function() {
 return (_zend_try_assign_typed_ref_arr = Module["_zend_try_assign_typed_ref_arr"] = Module["asm"]["zend_try_assign_typed_ref_arr"]).apply(null, arguments);
};

var __is_numeric_string_ex = Module["__is_numeric_string_ex"] = function() {
 return (__is_numeric_string_ex = Module["__is_numeric_string_ex"] = Module["asm"]["_is_numeric_string_ex"]).apply(null, arguments);
};

var _zend_new_pair = Module["_zend_new_pair"] = function() {
 return (_zend_new_pair = Module["_zend_new_pair"] = Module["asm"]["zend_new_pair"]).apply(null, arguments);
};

var _zend_error_noreturn = Module["_zend_error_noreturn"] = function() {
 return (_zend_error_noreturn = Module["_zend_error_noreturn"] = Module["asm"]["zend_error_noreturn"]).apply(null, arguments);
};

var _zend_hash_index_add_new = Module["_zend_hash_index_add_new"] = function() {
 return (_zend_hash_index_add_new = Module["_zend_hash_index_add_new"] = Module["asm"]["zend_hash_index_add_new"]).apply(null, arguments);
};

var _zend_fcall_info_init = Module["_zend_fcall_info_init"] = function() {
 return (_zend_fcall_info_init = Module["_zend_fcall_info_init"] = Module["asm"]["zend_fcall_info_init"]).apply(null, arguments);
};

var _zend_release_fcall_info_cache = Module["_zend_release_fcall_info_cache"] = function() {
 return (_zend_release_fcall_info_cache = Module["_zend_release_fcall_info_cache"] = Module["asm"]["zend_release_fcall_info_cache"]).apply(null, arguments);
};

var _zend_call_function = Module["_zend_call_function"] = function() {
 return (_zend_call_function = Module["_zend_call_function"] = Module["asm"]["zend_call_function"]).apply(null, arguments);
};

var _zend_array_destroy = Module["_zend_array_destroy"] = function() {
 return (_zend_array_destroy = Module["_zend_array_destroy"] = Module["asm"]["zend_array_destroy"]).apply(null, arguments);
};

var __safe_malloc = Module["__safe_malloc"] = function() {
 return (__safe_malloc = Module["__safe_malloc"] = Module["asm"]["_safe_malloc"]).apply(null, arguments);
};

var _OnUpdateLong = Module["_OnUpdateLong"] = function() {
 return (_OnUpdateLong = Module["_OnUpdateLong"] = Module["asm"]["OnUpdateLong"]).apply(null, arguments);
};

var _zend_register_bool_constant = Module["_zend_register_bool_constant"] = function() {
 return (_zend_register_bool_constant = Module["_zend_register_bool_constant"] = Module["asm"]["zend_register_bool_constant"]).apply(null, arguments);
};

var _php_hash_fetch_ops = Module["_php_hash_fetch_ops"] = function() {
 return (_php_hash_fetch_ops = Module["_php_hash_fetch_ops"] = Module["asm"]["php_hash_fetch_ops"]).apply(null, arguments);
};

var _php_hash_register_algo = Module["_php_hash_register_algo"] = function() {
 return (_php_hash_register_algo = Module["_php_hash_register_algo"] = Module["asm"]["php_hash_register_algo"]).apply(null, arguments);
};

var _zend_str_tolower_dup = Module["_zend_str_tolower_dup"] = function() {
 return (_zend_str_tolower_dup = Module["_zend_str_tolower_dup"] = Module["asm"]["zend_str_tolower_dup"]).apply(null, arguments);
};

var _php_hash_copy = Module["_php_hash_copy"] = function() {
 return (_php_hash_copy = Module["_php_hash_copy"] = Module["asm"]["php_hash_copy"]).apply(null, arguments);
};

var _php_hash_serialize_spec = Module["_php_hash_serialize_spec"] = function() {
 return (_php_hash_serialize_spec = Module["_php_hash_serialize_spec"] = Module["asm"]["php_hash_serialize_spec"]).apply(null, arguments);
};

var _php_hash_unserialize_spec = Module["_php_hash_unserialize_spec"] = function() {
 return (_php_hash_unserialize_spec = Module["_php_hash_unserialize_spec"] = Module["asm"]["php_hash_unserialize_spec"]).apply(null, arguments);
};

var _zend_hash_index_find = Module["_zend_hash_index_find"] = function() {
 return (_zend_hash_index_find = Module["_zend_hash_index_find"] = Module["asm"]["zend_hash_index_find"]).apply(null, arguments);
};

var _php_hash_serialize = Module["_php_hash_serialize"] = function() {
 return (_php_hash_serialize = Module["_php_hash_serialize"] = Module["asm"]["php_hash_serialize"]).apply(null, arguments);
};

var _php_hash_unserialize = Module["_php_hash_unserialize"] = function() {
 return (_php_hash_unserialize = Module["_php_hash_unserialize"] = Module["asm"]["php_hash_unserialize"]).apply(null, arguments);
};

var _zend_fetch_resource2_ex = Module["_zend_fetch_resource2_ex"] = function() {
 return (_zend_fetch_resource2_ex = Module["_zend_fetch_resource2_ex"] = Module["asm"]["zend_fetch_resource2_ex"]).apply(null, arguments);
};

var _php_file_le_stream = Module["_php_file_le_stream"] = function() {
 return (_php_file_le_stream = Module["_php_file_le_stream"] = Module["asm"]["php_file_le_stream"]).apply(null, arguments);
};

var _php_file_le_pstream = Module["_php_file_le_pstream"] = function() {
 return (_php_file_le_pstream = Module["_php_file_le_pstream"] = Module["asm"]["php_file_le_pstream"]).apply(null, arguments);
};

var __php_stream_read = Module["__php_stream_read"] = function() {
 return (__php_stream_read = Module["__php_stream_read"] = Module["asm"]["_php_stream_read"]).apply(null, arguments);
};

var _zend_fetch_resource_ex = Module["_zend_fetch_resource_ex"] = function() {
 return (_zend_fetch_resource_ex = Module["_zend_fetch_resource_ex"] = Module["asm"]["zend_fetch_resource_ex"]).apply(null, arguments);
};

var _php_le_stream_context = Module["_php_le_stream_context"] = function() {
 return (_php_le_stream_context = Module["_php_le_stream_context"] = Module["asm"]["php_le_stream_context"]).apply(null, arguments);
};

var _php_stream_context_alloc = Module["_php_stream_context_alloc"] = function() {
 return (_php_stream_context_alloc = Module["_php_stream_context_alloc"] = Module["asm"]["php_stream_context_alloc"]).apply(null, arguments);
};

var __php_stream_open_wrapper_ex = Module["__php_stream_open_wrapper_ex"] = function() {
 return (__php_stream_open_wrapper_ex = Module["__php_stream_open_wrapper_ex"] = Module["asm"]["_php_stream_open_wrapper_ex"]).apply(null, arguments);
};

var __php_stream_free = Module["__php_stream_free"] = function() {
 return (__php_stream_free = Module["__php_stream_free"] = Module["asm"]["_php_stream_free"]).apply(null, arguments);
};

var _explicit_bzero = Module["_explicit_bzero"] = function() {
 return (_explicit_bzero = Module["_explicit_bzero"] = Module["asm"]["explicit_bzero"]).apply(null, arguments);
};

var _zend_zval_value_name = Module["_zend_zval_value_name"] = function() {
 return (_zend_zval_value_name = Module["_zend_zval_value_name"] = Module["asm"]["zend_zval_value_name"]).apply(null, arguments);
};

var _php_safe_bcmp = Module["_php_safe_bcmp"] = function() {
 return (_php_safe_bcmp = Module["_php_safe_bcmp"] = Module["asm"]["php_safe_bcmp"]).apply(null, arguments);
};

var _zend_throw_exception = Module["_zend_throw_exception"] = function() {
 return (_zend_throw_exception = Module["_zend_throw_exception"] = Module["asm"]["zend_throw_exception"]).apply(null, arguments);
};

var _object_properties_load = Module["_object_properties_load"] = function() {
 return (_object_properties_load = Module["_object_properties_load"] = Module["asm"]["object_properties_load"]).apply(null, arguments);
};

var _zend_string_tolower_ex = Module["_zend_string_tolower_ex"] = function() {
 return (_zend_string_tolower_ex = Module["_zend_string_tolower_ex"] = Module["asm"]["zend_string_tolower_ex"]).apply(null, arguments);
};

var _zend_add_attribute = Module["_zend_add_attribute"] = function() {
 return (_zend_add_attribute = Module["_zend_add_attribute"] = Module["asm"]["zend_add_attribute"]).apply(null, arguments);
};

var _PHP_MD5InitArgs = Module["_PHP_MD5InitArgs"] = function() {
 return (_PHP_MD5InitArgs = Module["_PHP_MD5InitArgs"] = Module["asm"]["PHP_MD5InitArgs"]).apply(null, arguments);
};

var _PHP_MD5Update = Module["_PHP_MD5Update"] = function() {
 return (_PHP_MD5Update = Module["_PHP_MD5Update"] = Module["asm"]["PHP_MD5Update"]).apply(null, arguments);
};

var _PHP_MD5Final = Module["_PHP_MD5Final"] = function() {
 return (_PHP_MD5Final = Module["_PHP_MD5Final"] = Module["asm"]["PHP_MD5Final"]).apply(null, arguments);
};

var _PHP_MD4InitArgs = Module["_PHP_MD4InitArgs"] = function() {
 return (_PHP_MD4InitArgs = Module["_PHP_MD4InitArgs"] = Module["asm"]["PHP_MD4InitArgs"]).apply(null, arguments);
};

var _PHP_MD4Update = Module["_PHP_MD4Update"] = function() {
 return (_PHP_MD4Update = Module["_PHP_MD4Update"] = Module["asm"]["PHP_MD4Update"]).apply(null, arguments);
};

var _PHP_MD4Final = Module["_PHP_MD4Final"] = function() {
 return (_PHP_MD4Final = Module["_PHP_MD4Final"] = Module["asm"]["PHP_MD4Final"]).apply(null, arguments);
};

var _PHP_MD2InitArgs = Module["_PHP_MD2InitArgs"] = function() {
 return (_PHP_MD2InitArgs = Module["_PHP_MD2InitArgs"] = Module["asm"]["PHP_MD2InitArgs"]).apply(null, arguments);
};

var _PHP_MD2Update = Module["_PHP_MD2Update"] = function() {
 return (_PHP_MD2Update = Module["_PHP_MD2Update"] = Module["asm"]["PHP_MD2Update"]).apply(null, arguments);
};

var _PHP_MD2Final = Module["_PHP_MD2Final"] = function() {
 return (_PHP_MD2Final = Module["_PHP_MD2Final"] = Module["asm"]["PHP_MD2Final"]).apply(null, arguments);
};

var _PHP_SHA1InitArgs = Module["_PHP_SHA1InitArgs"] = function() {
 return (_PHP_SHA1InitArgs = Module["_PHP_SHA1InitArgs"] = Module["asm"]["PHP_SHA1InitArgs"]).apply(null, arguments);
};

var _PHP_SHA1Update = Module["_PHP_SHA1Update"] = function() {
 return (_PHP_SHA1Update = Module["_PHP_SHA1Update"] = Module["asm"]["PHP_SHA1Update"]).apply(null, arguments);
};

var _PHP_SHA1Final = Module["_PHP_SHA1Final"] = function() {
 return (_PHP_SHA1Final = Module["_PHP_SHA1Final"] = Module["asm"]["PHP_SHA1Final"]).apply(null, arguments);
};

var _PHP_SHA256InitArgs = Module["_PHP_SHA256InitArgs"] = function() {
 return (_PHP_SHA256InitArgs = Module["_PHP_SHA256InitArgs"] = Module["asm"]["PHP_SHA256InitArgs"]).apply(null, arguments);
};

var _PHP_SHA256Update = Module["_PHP_SHA256Update"] = function() {
 return (_PHP_SHA256Update = Module["_PHP_SHA256Update"] = Module["asm"]["PHP_SHA256Update"]).apply(null, arguments);
};

var _PHP_SHA256Final = Module["_PHP_SHA256Final"] = function() {
 return (_PHP_SHA256Final = Module["_PHP_SHA256Final"] = Module["asm"]["PHP_SHA256Final"]).apply(null, arguments);
};

var _PHP_SHA224InitArgs = Module["_PHP_SHA224InitArgs"] = function() {
 return (_PHP_SHA224InitArgs = Module["_PHP_SHA224InitArgs"] = Module["asm"]["PHP_SHA224InitArgs"]).apply(null, arguments);
};

var _PHP_SHA224Update = Module["_PHP_SHA224Update"] = function() {
 return (_PHP_SHA224Update = Module["_PHP_SHA224Update"] = Module["asm"]["PHP_SHA224Update"]).apply(null, arguments);
};

var _PHP_SHA224Final = Module["_PHP_SHA224Final"] = function() {
 return (_PHP_SHA224Final = Module["_PHP_SHA224Final"] = Module["asm"]["PHP_SHA224Final"]).apply(null, arguments);
};

var _PHP_SHA384InitArgs = Module["_PHP_SHA384InitArgs"] = function() {
 return (_PHP_SHA384InitArgs = Module["_PHP_SHA384InitArgs"] = Module["asm"]["PHP_SHA384InitArgs"]).apply(null, arguments);
};

var _PHP_SHA384Update = Module["_PHP_SHA384Update"] = function() {
 return (_PHP_SHA384Update = Module["_PHP_SHA384Update"] = Module["asm"]["PHP_SHA384Update"]).apply(null, arguments);
};

var _PHP_SHA384Final = Module["_PHP_SHA384Final"] = function() {
 return (_PHP_SHA384Final = Module["_PHP_SHA384Final"] = Module["asm"]["PHP_SHA384Final"]).apply(null, arguments);
};

var _PHP_SHA512InitArgs = Module["_PHP_SHA512InitArgs"] = function() {
 return (_PHP_SHA512InitArgs = Module["_PHP_SHA512InitArgs"] = Module["asm"]["PHP_SHA512InitArgs"]).apply(null, arguments);
};

var _PHP_SHA512_256InitArgs = Module["_PHP_SHA512_256InitArgs"] = function() {
 return (_PHP_SHA512_256InitArgs = Module["_PHP_SHA512_256InitArgs"] = Module["asm"]["PHP_SHA512_256InitArgs"]).apply(null, arguments);
};

var _PHP_SHA512_224InitArgs = Module["_PHP_SHA512_224InitArgs"] = function() {
 return (_PHP_SHA512_224InitArgs = Module["_PHP_SHA512_224InitArgs"] = Module["asm"]["PHP_SHA512_224InitArgs"]).apply(null, arguments);
};

var _PHP_SHA512Update = Module["_PHP_SHA512Update"] = function() {
 return (_PHP_SHA512Update = Module["_PHP_SHA512Update"] = Module["asm"]["PHP_SHA512Update"]).apply(null, arguments);
};

var _PHP_SHA512Final = Module["_PHP_SHA512Final"] = function() {
 return (_PHP_SHA512Final = Module["_PHP_SHA512Final"] = Module["asm"]["PHP_SHA512Final"]).apply(null, arguments);
};

var _PHP_SHA512_256Final = Module["_PHP_SHA512_256Final"] = function() {
 return (_PHP_SHA512_256Final = Module["_PHP_SHA512_256Final"] = Module["asm"]["PHP_SHA512_256Final"]).apply(null, arguments);
};

var _PHP_SHA512_224Final = Module["_PHP_SHA512_224Final"] = function() {
 return (_PHP_SHA512_224Final = Module["_PHP_SHA512_224Final"] = Module["asm"]["PHP_SHA512_224Final"]).apply(null, arguments);
};

var _PHP_RIPEMD128Init = Module["_PHP_RIPEMD128Init"] = function() {
 return (_PHP_RIPEMD128Init = Module["_PHP_RIPEMD128Init"] = Module["asm"]["PHP_RIPEMD128Init"]).apply(null, arguments);
};

var _PHP_RIPEMD128Update = Module["_PHP_RIPEMD128Update"] = function() {
 return (_PHP_RIPEMD128Update = Module["_PHP_RIPEMD128Update"] = Module["asm"]["PHP_RIPEMD128Update"]).apply(null, arguments);
};

var _PHP_RIPEMD128Final = Module["_PHP_RIPEMD128Final"] = function() {
 return (_PHP_RIPEMD128Final = Module["_PHP_RIPEMD128Final"] = Module["asm"]["PHP_RIPEMD128Final"]).apply(null, arguments);
};

var _PHP_RIPEMD160Init = Module["_PHP_RIPEMD160Init"] = function() {
 return (_PHP_RIPEMD160Init = Module["_PHP_RIPEMD160Init"] = Module["asm"]["PHP_RIPEMD160Init"]).apply(null, arguments);
};

var _PHP_RIPEMD160Update = Module["_PHP_RIPEMD160Update"] = function() {
 return (_PHP_RIPEMD160Update = Module["_PHP_RIPEMD160Update"] = Module["asm"]["PHP_RIPEMD160Update"]).apply(null, arguments);
};

var _PHP_RIPEMD160Final = Module["_PHP_RIPEMD160Final"] = function() {
 return (_PHP_RIPEMD160Final = Module["_PHP_RIPEMD160Final"] = Module["asm"]["PHP_RIPEMD160Final"]).apply(null, arguments);
};

var _PHP_RIPEMD256Init = Module["_PHP_RIPEMD256Init"] = function() {
 return (_PHP_RIPEMD256Init = Module["_PHP_RIPEMD256Init"] = Module["asm"]["PHP_RIPEMD256Init"]).apply(null, arguments);
};

var _PHP_RIPEMD256Update = Module["_PHP_RIPEMD256Update"] = function() {
 return (_PHP_RIPEMD256Update = Module["_PHP_RIPEMD256Update"] = Module["asm"]["PHP_RIPEMD256Update"]).apply(null, arguments);
};

var _PHP_RIPEMD256Final = Module["_PHP_RIPEMD256Final"] = function() {
 return (_PHP_RIPEMD256Final = Module["_PHP_RIPEMD256Final"] = Module["asm"]["PHP_RIPEMD256Final"]).apply(null, arguments);
};

var _PHP_RIPEMD320Init = Module["_PHP_RIPEMD320Init"] = function() {
 return (_PHP_RIPEMD320Init = Module["_PHP_RIPEMD320Init"] = Module["asm"]["PHP_RIPEMD320Init"]).apply(null, arguments);
};

var _PHP_RIPEMD320Update = Module["_PHP_RIPEMD320Update"] = function() {
 return (_PHP_RIPEMD320Update = Module["_PHP_RIPEMD320Update"] = Module["asm"]["PHP_RIPEMD320Update"]).apply(null, arguments);
};

var _PHP_RIPEMD320Final = Module["_PHP_RIPEMD320Final"] = function() {
 return (_PHP_RIPEMD320Final = Module["_PHP_RIPEMD320Final"] = Module["asm"]["PHP_RIPEMD320Final"]).apply(null, arguments);
};

var _PHP_3HAVAL128Init = Module["_PHP_3HAVAL128Init"] = function() {
 return (_PHP_3HAVAL128Init = Module["_PHP_3HAVAL128Init"] = Module["asm"]["PHP_3HAVAL128Init"]).apply(null, arguments);
};

var _PHP_HAVALUpdate = Module["_PHP_HAVALUpdate"] = function() {
 return (_PHP_HAVALUpdate = Module["_PHP_HAVALUpdate"] = Module["asm"]["PHP_HAVALUpdate"]).apply(null, arguments);
};

var _PHP_HAVAL128Final = Module["_PHP_HAVAL128Final"] = function() {
 return (_PHP_HAVAL128Final = Module["_PHP_HAVAL128Final"] = Module["asm"]["PHP_HAVAL128Final"]).apply(null, arguments);
};

var _PHP_3HAVAL160Init = Module["_PHP_3HAVAL160Init"] = function() {
 return (_PHP_3HAVAL160Init = Module["_PHP_3HAVAL160Init"] = Module["asm"]["PHP_3HAVAL160Init"]).apply(null, arguments);
};

var _PHP_HAVAL160Final = Module["_PHP_HAVAL160Final"] = function() {
 return (_PHP_HAVAL160Final = Module["_PHP_HAVAL160Final"] = Module["asm"]["PHP_HAVAL160Final"]).apply(null, arguments);
};

var _PHP_3HAVAL192Init = Module["_PHP_3HAVAL192Init"] = function() {
 return (_PHP_3HAVAL192Init = Module["_PHP_3HAVAL192Init"] = Module["asm"]["PHP_3HAVAL192Init"]).apply(null, arguments);
};

var _PHP_HAVAL192Final = Module["_PHP_HAVAL192Final"] = function() {
 return (_PHP_HAVAL192Final = Module["_PHP_HAVAL192Final"] = Module["asm"]["PHP_HAVAL192Final"]).apply(null, arguments);
};

var _PHP_3HAVAL224Init = Module["_PHP_3HAVAL224Init"] = function() {
 return (_PHP_3HAVAL224Init = Module["_PHP_3HAVAL224Init"] = Module["asm"]["PHP_3HAVAL224Init"]).apply(null, arguments);
};

var _PHP_HAVAL224Final = Module["_PHP_HAVAL224Final"] = function() {
 return (_PHP_HAVAL224Final = Module["_PHP_HAVAL224Final"] = Module["asm"]["PHP_HAVAL224Final"]).apply(null, arguments);
};

var _PHP_3HAVAL256Init = Module["_PHP_3HAVAL256Init"] = function() {
 return (_PHP_3HAVAL256Init = Module["_PHP_3HAVAL256Init"] = Module["asm"]["PHP_3HAVAL256Init"]).apply(null, arguments);
};

var _PHP_HAVAL256Final = Module["_PHP_HAVAL256Final"] = function() {
 return (_PHP_HAVAL256Final = Module["_PHP_HAVAL256Final"] = Module["asm"]["PHP_HAVAL256Final"]).apply(null, arguments);
};

var _PHP_4HAVAL128Init = Module["_PHP_4HAVAL128Init"] = function() {
 return (_PHP_4HAVAL128Init = Module["_PHP_4HAVAL128Init"] = Module["asm"]["PHP_4HAVAL128Init"]).apply(null, arguments);
};

var _PHP_4HAVAL160Init = Module["_PHP_4HAVAL160Init"] = function() {
 return (_PHP_4HAVAL160Init = Module["_PHP_4HAVAL160Init"] = Module["asm"]["PHP_4HAVAL160Init"]).apply(null, arguments);
};

var _PHP_4HAVAL192Init = Module["_PHP_4HAVAL192Init"] = function() {
 return (_PHP_4HAVAL192Init = Module["_PHP_4HAVAL192Init"] = Module["asm"]["PHP_4HAVAL192Init"]).apply(null, arguments);
};

var _PHP_4HAVAL224Init = Module["_PHP_4HAVAL224Init"] = function() {
 return (_PHP_4HAVAL224Init = Module["_PHP_4HAVAL224Init"] = Module["asm"]["PHP_4HAVAL224Init"]).apply(null, arguments);
};

var _PHP_4HAVAL256Init = Module["_PHP_4HAVAL256Init"] = function() {
 return (_PHP_4HAVAL256Init = Module["_PHP_4HAVAL256Init"] = Module["asm"]["PHP_4HAVAL256Init"]).apply(null, arguments);
};

var _PHP_5HAVAL128Init = Module["_PHP_5HAVAL128Init"] = function() {
 return (_PHP_5HAVAL128Init = Module["_PHP_5HAVAL128Init"] = Module["asm"]["PHP_5HAVAL128Init"]).apply(null, arguments);
};

var _PHP_5HAVAL160Init = Module["_PHP_5HAVAL160Init"] = function() {
 return (_PHP_5HAVAL160Init = Module["_PHP_5HAVAL160Init"] = Module["asm"]["PHP_5HAVAL160Init"]).apply(null, arguments);
};

var _PHP_5HAVAL192Init = Module["_PHP_5HAVAL192Init"] = function() {
 return (_PHP_5HAVAL192Init = Module["_PHP_5HAVAL192Init"] = Module["asm"]["PHP_5HAVAL192Init"]).apply(null, arguments);
};

var _PHP_5HAVAL224Init = Module["_PHP_5HAVAL224Init"] = function() {
 return (_PHP_5HAVAL224Init = Module["_PHP_5HAVAL224Init"] = Module["asm"]["PHP_5HAVAL224Init"]).apply(null, arguments);
};

var _PHP_5HAVAL256Init = Module["_PHP_5HAVAL256Init"] = function() {
 return (_PHP_5HAVAL256Init = Module["_PHP_5HAVAL256Init"] = Module["asm"]["PHP_5HAVAL256Init"]).apply(null, arguments);
};

var _PHP_3TIGERInit = Module["_PHP_3TIGERInit"] = function() {
 return (_PHP_3TIGERInit = Module["_PHP_3TIGERInit"] = Module["asm"]["PHP_3TIGERInit"]).apply(null, arguments);
};

var _PHP_4TIGERInit = Module["_PHP_4TIGERInit"] = function() {
 return (_PHP_4TIGERInit = Module["_PHP_4TIGERInit"] = Module["asm"]["PHP_4TIGERInit"]).apply(null, arguments);
};

var _PHP_TIGERUpdate = Module["_PHP_TIGERUpdate"] = function() {
 return (_PHP_TIGERUpdate = Module["_PHP_TIGERUpdate"] = Module["asm"]["PHP_TIGERUpdate"]).apply(null, arguments);
};

var _PHP_TIGER128Final = Module["_PHP_TIGER128Final"] = function() {
 return (_PHP_TIGER128Final = Module["_PHP_TIGER128Final"] = Module["asm"]["PHP_TIGER128Final"]).apply(null, arguments);
};

var _PHP_TIGER160Final = Module["_PHP_TIGER160Final"] = function() {
 return (_PHP_TIGER160Final = Module["_PHP_TIGER160Final"] = Module["asm"]["PHP_TIGER160Final"]).apply(null, arguments);
};

var _PHP_TIGER192Final = Module["_PHP_TIGER192Final"] = function() {
 return (_PHP_TIGER192Final = Module["_PHP_TIGER192Final"] = Module["asm"]["PHP_TIGER192Final"]).apply(null, arguments);
};

var _PHP_GOSTInit = Module["_PHP_GOSTInit"] = function() {
 return (_PHP_GOSTInit = Module["_PHP_GOSTInit"] = Module["asm"]["PHP_GOSTInit"]).apply(null, arguments);
};

var _PHP_GOSTInitCrypto = Module["_PHP_GOSTInitCrypto"] = function() {
 return (_PHP_GOSTInitCrypto = Module["_PHP_GOSTInitCrypto"] = Module["asm"]["PHP_GOSTInitCrypto"]).apply(null, arguments);
};

var _PHP_GOSTUpdate = Module["_PHP_GOSTUpdate"] = function() {
 return (_PHP_GOSTUpdate = Module["_PHP_GOSTUpdate"] = Module["asm"]["PHP_GOSTUpdate"]).apply(null, arguments);
};

var _PHP_GOSTFinal = Module["_PHP_GOSTFinal"] = function() {
 return (_PHP_GOSTFinal = Module["_PHP_GOSTFinal"] = Module["asm"]["PHP_GOSTFinal"]).apply(null, arguments);
};

var _PHP_SNEFRUInit = Module["_PHP_SNEFRUInit"] = function() {
 return (_PHP_SNEFRUInit = Module["_PHP_SNEFRUInit"] = Module["asm"]["PHP_SNEFRUInit"]).apply(null, arguments);
};

var _PHP_SNEFRUUpdate = Module["_PHP_SNEFRUUpdate"] = function() {
 return (_PHP_SNEFRUUpdate = Module["_PHP_SNEFRUUpdate"] = Module["asm"]["PHP_SNEFRUUpdate"]).apply(null, arguments);
};

var _PHP_SNEFRUFinal = Module["_PHP_SNEFRUFinal"] = function() {
 return (_PHP_SNEFRUFinal = Module["_PHP_SNEFRUFinal"] = Module["asm"]["PHP_SNEFRUFinal"]).apply(null, arguments);
};

var _PHP_WHIRLPOOLInit = Module["_PHP_WHIRLPOOLInit"] = function() {
 return (_PHP_WHIRLPOOLInit = Module["_PHP_WHIRLPOOLInit"] = Module["asm"]["PHP_WHIRLPOOLInit"]).apply(null, arguments);
};

var _PHP_WHIRLPOOLUpdate = Module["_PHP_WHIRLPOOLUpdate"] = function() {
 return (_PHP_WHIRLPOOLUpdate = Module["_PHP_WHIRLPOOLUpdate"] = Module["asm"]["PHP_WHIRLPOOLUpdate"]).apply(null, arguments);
};

var _PHP_WHIRLPOOLFinal = Module["_PHP_WHIRLPOOLFinal"] = function() {
 return (_PHP_WHIRLPOOLFinal = Module["_PHP_WHIRLPOOLFinal"] = Module["asm"]["PHP_WHIRLPOOLFinal"]).apply(null, arguments);
};

var _PHP_ADLER32Init = Module["_PHP_ADLER32Init"] = function() {
 return (_PHP_ADLER32Init = Module["_PHP_ADLER32Init"] = Module["asm"]["PHP_ADLER32Init"]).apply(null, arguments);
};

var _PHP_ADLER32Update = Module["_PHP_ADLER32Update"] = function() {
 return (_PHP_ADLER32Update = Module["_PHP_ADLER32Update"] = Module["asm"]["PHP_ADLER32Update"]).apply(null, arguments);
};

var _PHP_ADLER32Final = Module["_PHP_ADLER32Final"] = function() {
 return (_PHP_ADLER32Final = Module["_PHP_ADLER32Final"] = Module["asm"]["PHP_ADLER32Final"]).apply(null, arguments);
};

var _PHP_ADLER32Copy = Module["_PHP_ADLER32Copy"] = function() {
 return (_PHP_ADLER32Copy = Module["_PHP_ADLER32Copy"] = Module["asm"]["PHP_ADLER32Copy"]).apply(null, arguments);
};

var _PHP_CRC32Init = Module["_PHP_CRC32Init"] = function() {
 return (_PHP_CRC32Init = Module["_PHP_CRC32Init"] = Module["asm"]["PHP_CRC32Init"]).apply(null, arguments);
};

var _PHP_CRC32Update = Module["_PHP_CRC32Update"] = function() {
 return (_PHP_CRC32Update = Module["_PHP_CRC32Update"] = Module["asm"]["PHP_CRC32Update"]).apply(null, arguments);
};

var _PHP_CRC32BUpdate = Module["_PHP_CRC32BUpdate"] = function() {
 return (_PHP_CRC32BUpdate = Module["_PHP_CRC32BUpdate"] = Module["asm"]["PHP_CRC32BUpdate"]).apply(null, arguments);
};

var _PHP_CRC32CUpdate = Module["_PHP_CRC32CUpdate"] = function() {
 return (_PHP_CRC32CUpdate = Module["_PHP_CRC32CUpdate"] = Module["asm"]["PHP_CRC32CUpdate"]).apply(null, arguments);
};

var _PHP_CRC32LEFinal = Module["_PHP_CRC32LEFinal"] = function() {
 return (_PHP_CRC32LEFinal = Module["_PHP_CRC32LEFinal"] = Module["asm"]["PHP_CRC32LEFinal"]).apply(null, arguments);
};

var _PHP_CRC32BEFinal = Module["_PHP_CRC32BEFinal"] = function() {
 return (_PHP_CRC32BEFinal = Module["_PHP_CRC32BEFinal"] = Module["asm"]["PHP_CRC32BEFinal"]).apply(null, arguments);
};

var _PHP_CRC32Copy = Module["_PHP_CRC32Copy"] = function() {
 return (_PHP_CRC32Copy = Module["_PHP_CRC32Copy"] = Module["asm"]["PHP_CRC32Copy"]).apply(null, arguments);
};

var _PHP_FNV132Init = Module["_PHP_FNV132Init"] = function() {
 return (_PHP_FNV132Init = Module["_PHP_FNV132Init"] = Module["asm"]["PHP_FNV132Init"]).apply(null, arguments);
};

var _PHP_FNV132Update = Module["_PHP_FNV132Update"] = function() {
 return (_PHP_FNV132Update = Module["_PHP_FNV132Update"] = Module["asm"]["PHP_FNV132Update"]).apply(null, arguments);
};

var _PHP_FNV132Final = Module["_PHP_FNV132Final"] = function() {
 return (_PHP_FNV132Final = Module["_PHP_FNV132Final"] = Module["asm"]["PHP_FNV132Final"]).apply(null, arguments);
};

var _PHP_FNV1a32Update = Module["_PHP_FNV1a32Update"] = function() {
 return (_PHP_FNV1a32Update = Module["_PHP_FNV1a32Update"] = Module["asm"]["PHP_FNV1a32Update"]).apply(null, arguments);
};

var _PHP_FNV164Init = Module["_PHP_FNV164Init"] = function() {
 return (_PHP_FNV164Init = Module["_PHP_FNV164Init"] = Module["asm"]["PHP_FNV164Init"]).apply(null, arguments);
};

var _PHP_FNV164Update = Module["_PHP_FNV164Update"] = function() {
 return (_PHP_FNV164Update = Module["_PHP_FNV164Update"] = Module["asm"]["PHP_FNV164Update"]).apply(null, arguments);
};

var _PHP_FNV164Final = Module["_PHP_FNV164Final"] = function() {
 return (_PHP_FNV164Final = Module["_PHP_FNV164Final"] = Module["asm"]["PHP_FNV164Final"]).apply(null, arguments);
};

var _PHP_FNV1a64Update = Module["_PHP_FNV1a64Update"] = function() {
 return (_PHP_FNV1a64Update = Module["_PHP_FNV1a64Update"] = Module["asm"]["PHP_FNV1a64Update"]).apply(null, arguments);
};

var _PHP_JOAATInit = Module["_PHP_JOAATInit"] = function() {
 return (_PHP_JOAATInit = Module["_PHP_JOAATInit"] = Module["asm"]["PHP_JOAATInit"]).apply(null, arguments);
};

var _PHP_JOAATUpdate = Module["_PHP_JOAATUpdate"] = function() {
 return (_PHP_JOAATUpdate = Module["_PHP_JOAATUpdate"] = Module["asm"]["PHP_JOAATUpdate"]).apply(null, arguments);
};

var _PHP_JOAATFinal = Module["_PHP_JOAATFinal"] = function() {
 return (_PHP_JOAATFinal = Module["_PHP_JOAATFinal"] = Module["asm"]["PHP_JOAATFinal"]).apply(null, arguments);
};

var _PHP_SHA3224Init = Module["_PHP_SHA3224Init"] = function() {
 return (_PHP_SHA3224Init = Module["_PHP_SHA3224Init"] = Module["asm"]["PHP_SHA3224Init"]).apply(null, arguments);
};

var _PHP_SHA3224Update = Module["_PHP_SHA3224Update"] = function() {
 return (_PHP_SHA3224Update = Module["_PHP_SHA3224Update"] = Module["asm"]["PHP_SHA3224Update"]).apply(null, arguments);
};

var _PHP_SHA3256Init = Module["_PHP_SHA3256Init"] = function() {
 return (_PHP_SHA3256Init = Module["_PHP_SHA3256Init"] = Module["asm"]["PHP_SHA3256Init"]).apply(null, arguments);
};

var _PHP_SHA3256Update = Module["_PHP_SHA3256Update"] = function() {
 return (_PHP_SHA3256Update = Module["_PHP_SHA3256Update"] = Module["asm"]["PHP_SHA3256Update"]).apply(null, arguments);
};

var _PHP_SHA3384Init = Module["_PHP_SHA3384Init"] = function() {
 return (_PHP_SHA3384Init = Module["_PHP_SHA3384Init"] = Module["asm"]["PHP_SHA3384Init"]).apply(null, arguments);
};

var _PHP_SHA3384Update = Module["_PHP_SHA3384Update"] = function() {
 return (_PHP_SHA3384Update = Module["_PHP_SHA3384Update"] = Module["asm"]["PHP_SHA3384Update"]).apply(null, arguments);
};

var _PHP_SHA3512Init = Module["_PHP_SHA3512Init"] = function() {
 return (_PHP_SHA3512Init = Module["_PHP_SHA3512Init"] = Module["asm"]["PHP_SHA3512Init"]).apply(null, arguments);
};

var _PHP_SHA3512Update = Module["_PHP_SHA3512Update"] = function() {
 return (_PHP_SHA3512Update = Module["_PHP_SHA3512Update"] = Module["asm"]["PHP_SHA3512Update"]).apply(null, arguments);
};

var _PHP_MURMUR3AInit = Module["_PHP_MURMUR3AInit"] = function() {
 return (_PHP_MURMUR3AInit = Module["_PHP_MURMUR3AInit"] = Module["asm"]["PHP_MURMUR3AInit"]).apply(null, arguments);
};

var _PHP_MURMUR3AUpdate = Module["_PHP_MURMUR3AUpdate"] = function() {
 return (_PHP_MURMUR3AUpdate = Module["_PHP_MURMUR3AUpdate"] = Module["asm"]["PHP_MURMUR3AUpdate"]).apply(null, arguments);
};

var _PHP_MURMUR3AFinal = Module["_PHP_MURMUR3AFinal"] = function() {
 return (_PHP_MURMUR3AFinal = Module["_PHP_MURMUR3AFinal"] = Module["asm"]["PHP_MURMUR3AFinal"]).apply(null, arguments);
};

var _PHP_MURMUR3ACopy = Module["_PHP_MURMUR3ACopy"] = function() {
 return (_PHP_MURMUR3ACopy = Module["_PHP_MURMUR3ACopy"] = Module["asm"]["PHP_MURMUR3ACopy"]).apply(null, arguments);
};

var _PHP_MURMUR3CInit = Module["_PHP_MURMUR3CInit"] = function() {
 return (_PHP_MURMUR3CInit = Module["_PHP_MURMUR3CInit"] = Module["asm"]["PHP_MURMUR3CInit"]).apply(null, arguments);
};

var _PHP_MURMUR3CUpdate = Module["_PHP_MURMUR3CUpdate"] = function() {
 return (_PHP_MURMUR3CUpdate = Module["_PHP_MURMUR3CUpdate"] = Module["asm"]["PHP_MURMUR3CUpdate"]).apply(null, arguments);
};

var _PHP_MURMUR3CFinal = Module["_PHP_MURMUR3CFinal"] = function() {
 return (_PHP_MURMUR3CFinal = Module["_PHP_MURMUR3CFinal"] = Module["asm"]["PHP_MURMUR3CFinal"]).apply(null, arguments);
};

var _PHP_MURMUR3CCopy = Module["_PHP_MURMUR3CCopy"] = function() {
 return (_PHP_MURMUR3CCopy = Module["_PHP_MURMUR3CCopy"] = Module["asm"]["PHP_MURMUR3CCopy"]).apply(null, arguments);
};

var _PHP_MURMUR3FInit = Module["_PHP_MURMUR3FInit"] = function() {
 return (_PHP_MURMUR3FInit = Module["_PHP_MURMUR3FInit"] = Module["asm"]["PHP_MURMUR3FInit"]).apply(null, arguments);
};

var _PHP_MURMUR3FUpdate = Module["_PHP_MURMUR3FUpdate"] = function() {
 return (_PHP_MURMUR3FUpdate = Module["_PHP_MURMUR3FUpdate"] = Module["asm"]["PHP_MURMUR3FUpdate"]).apply(null, arguments);
};

var _PHP_MURMUR3FFinal = Module["_PHP_MURMUR3FFinal"] = function() {
 return (_PHP_MURMUR3FFinal = Module["_PHP_MURMUR3FFinal"] = Module["asm"]["PHP_MURMUR3FFinal"]).apply(null, arguments);
};

var _PHP_MURMUR3FCopy = Module["_PHP_MURMUR3FCopy"] = function() {
 return (_PHP_MURMUR3FCopy = Module["_PHP_MURMUR3FCopy"] = Module["asm"]["PHP_MURMUR3FCopy"]).apply(null, arguments);
};

var _PHP_XXH32Init = Module["_PHP_XXH32Init"] = function() {
 return (_PHP_XXH32Init = Module["_PHP_XXH32Init"] = Module["asm"]["PHP_XXH32Init"]).apply(null, arguments);
};

var _PHP_XXH32Update = Module["_PHP_XXH32Update"] = function() {
 return (_PHP_XXH32Update = Module["_PHP_XXH32Update"] = Module["asm"]["PHP_XXH32Update"]).apply(null, arguments);
};

var _PHP_XXH32Final = Module["_PHP_XXH32Final"] = function() {
 return (_PHP_XXH32Final = Module["_PHP_XXH32Final"] = Module["asm"]["PHP_XXH32Final"]).apply(null, arguments);
};

var _PHP_XXH32Copy = Module["_PHP_XXH32Copy"] = function() {
 return (_PHP_XXH32Copy = Module["_PHP_XXH32Copy"] = Module["asm"]["PHP_XXH32Copy"]).apply(null, arguments);
};

var _PHP_XXH64Init = Module["_PHP_XXH64Init"] = function() {
 return (_PHP_XXH64Init = Module["_PHP_XXH64Init"] = Module["asm"]["PHP_XXH64Init"]).apply(null, arguments);
};

var _PHP_XXH64Update = Module["_PHP_XXH64Update"] = function() {
 return (_PHP_XXH64Update = Module["_PHP_XXH64Update"] = Module["asm"]["PHP_XXH64Update"]).apply(null, arguments);
};

var _PHP_XXH64Final = Module["_PHP_XXH64Final"] = function() {
 return (_PHP_XXH64Final = Module["_PHP_XXH64Final"] = Module["asm"]["PHP_XXH64Final"]).apply(null, arguments);
};

var _PHP_XXH64Copy = Module["_PHP_XXH64Copy"] = function() {
 return (_PHP_XXH64Copy = Module["_PHP_XXH64Copy"] = Module["asm"]["PHP_XXH64Copy"]).apply(null, arguments);
};

var _PHP_XXH3_64_Init = Module["_PHP_XXH3_64_Init"] = function() {
 return (_PHP_XXH3_64_Init = Module["_PHP_XXH3_64_Init"] = Module["asm"]["PHP_XXH3_64_Init"]).apply(null, arguments);
};

var _PHP_XXH3_64_Update = Module["_PHP_XXH3_64_Update"] = function() {
 return (_PHP_XXH3_64_Update = Module["_PHP_XXH3_64_Update"] = Module["asm"]["PHP_XXH3_64_Update"]).apply(null, arguments);
};

var _PHP_XXH3_64_Final = Module["_PHP_XXH3_64_Final"] = function() {
 return (_PHP_XXH3_64_Final = Module["_PHP_XXH3_64_Final"] = Module["asm"]["PHP_XXH3_64_Final"]).apply(null, arguments);
};

var _PHP_XXH3_64_Copy = Module["_PHP_XXH3_64_Copy"] = function() {
 return (_PHP_XXH3_64_Copy = Module["_PHP_XXH3_64_Copy"] = Module["asm"]["PHP_XXH3_64_Copy"]).apply(null, arguments);
};

var _PHP_XXH3_128_Init = Module["_PHP_XXH3_128_Init"] = function() {
 return (_PHP_XXH3_128_Init = Module["_PHP_XXH3_128_Init"] = Module["asm"]["PHP_XXH3_128_Init"]).apply(null, arguments);
};

var _PHP_XXH3_128_Update = Module["_PHP_XXH3_128_Update"] = function() {
 return (_PHP_XXH3_128_Update = Module["_PHP_XXH3_128_Update"] = Module["asm"]["PHP_XXH3_128_Update"]).apply(null, arguments);
};

var _PHP_XXH3_128_Final = Module["_PHP_XXH3_128_Final"] = function() {
 return (_PHP_XXH3_128_Final = Module["_PHP_XXH3_128_Final"] = Module["asm"]["PHP_XXH3_128_Final"]).apply(null, arguments);
};

var _PHP_XXH3_128_Copy = Module["_PHP_XXH3_128_Copy"] = function() {
 return (_PHP_XXH3_128_Copy = Module["_PHP_XXH3_128_Copy"] = Module["asm"]["PHP_XXH3_128_Copy"]).apply(null, arguments);
};

var __try_convert_to_string = Module["__try_convert_to_string"] = function() {
 return (__try_convert_to_string = Module["__try_convert_to_string"] = Module["asm"]["_try_convert_to_string"]).apply(null, arguments);
};

var _php_json_encode_string = Module["_php_json_encode_string"] = function() {
 return (_php_json_encode_string = Module["_php_json_encode_string"] = Module["asm"]["php_json_encode_string"]).apply(null, arguments);
};

var _php_json_encode_ex = Module["_php_json_encode_ex"] = function() {
 return (_php_json_encode_ex = Module["_php_json_encode_ex"] = Module["asm"]["php_json_encode_ex"]).apply(null, arguments);
};

var _php_json_encode = Module["_php_json_encode"] = function() {
 return (_php_json_encode = Module["_php_json_encode"] = Module["asm"]["php_json_encode"]).apply(null, arguments);
};

var _php_json_decode_ex = Module["_php_json_decode_ex"] = function() {
 return (_php_json_decode_ex = Module["_php_json_decode_ex"] = Module["asm"]["php_json_decode_ex"]).apply(null, arguments);
};

var _php_json_parser_init = Module["_php_json_parser_init"] = function() {
 return (_php_json_parser_init = Module["_php_json_parser_init"] = Module["asm"]["php_json_parser_init"]).apply(null, arguments);
};

var _php_json_parser_error_code = Module["_php_json_parser_error_code"] = function() {
 return (_php_json_parser_error_code = Module["_php_json_parser_error_code"] = Module["asm"]["php_json_parser_error_code"]).apply(null, arguments);
};

var _php_json_validate_ex = Module["_php_json_validate_ex"] = function() {
 return (_php_json_validate_ex = Module["_php_json_validate_ex"] = Module["asm"]["php_json_validate_ex"]).apply(null, arguments);
};

var _php_json_parser_init_ex = Module["_php_json_parser_init_ex"] = function() {
 return (_php_json_parser_init_ex = Module["_php_json_parser_init_ex"] = Module["asm"]["php_json_parser_init_ex"]).apply(null, arguments);
};

var _php_next_utf8_char = Module["_php_next_utf8_char"] = function() {
 return (_php_next_utf8_char = Module["_php_next_utf8_char"] = Module["asm"]["php_next_utf8_char"]).apply(null, arguments);
};

var ___fpclassifyl = Module["___fpclassifyl"] = function() {
 return (___fpclassifyl = Module["___fpclassifyl"] = Module["asm"]["__fpclassifyl"]).apply(null, arguments);
};

var _zend_gcvt = Module["_zend_gcvt"] = function() {
 return (_zend_gcvt = Module["_zend_gcvt"] = Module["asm"]["zend_gcvt"]).apply(null, arguments);
};

var _zend_get_recursion_guard = Module["_zend_get_recursion_guard"] = function() {
 return (_zend_get_recursion_guard = Module["_zend_get_recursion_guard"] = Module["asm"]["zend_get_recursion_guard"]).apply(null, arguments);
};

var __call_user_function_impl = Module["__call_user_function_impl"] = function() {
 return (__call_user_function_impl = Module["__call_user_function_impl"] = Module["asm"]["_call_user_function_impl"]).apply(null, arguments);
};

var _zend_get_properties_for = Module["_zend_get_properties_for"] = function() {
 return (_zend_get_properties_for = Module["_zend_get_properties_for"] = Module["asm"]["zend_get_properties_for"]).apply(null, arguments);
};

var _rc_dtor_func = Module["_rc_dtor_func"] = function() {
 return (_rc_dtor_func = Module["_rc_dtor_func"] = Module["asm"]["rc_dtor_func"]).apply(null, arguments);
};

var _php_json_parse = Module["_php_json_parse"] = function() {
 return (_php_json_parse = Module["_php_json_parse"] = Module["asm"]["php_json_parse"]).apply(null, arguments);
};

var _object_init = Module["_object_init"] = function() {
 return (_object_init = Module["_object_init"] = Module["asm"]["object_init"]).apply(null, arguments);
};

var __zend_handle_numeric_str_ex = Module["__zend_handle_numeric_str_ex"] = function() {
 return (__zend_handle_numeric_str_ex = Module["__zend_handle_numeric_str_ex"] = Module["asm"]["_zend_handle_numeric_str_ex"]).apply(null, arguments);
};

var _strncmp = Module["_strncmp"] = function() {
 return (_strncmp = Module["_strncmp"] = Module["asm"]["strncmp"]).apply(null, arguments);
};

var _zend_strtod = Module["_zend_strtod"] = function() {
 return (_zend_strtod = Module["_zend_strtod"] = Module["asm"]["zend_strtod"]).apply(null, arguments);
};

var _php_pdo_get_dbh_ce = Module["_php_pdo_get_dbh_ce"] = function() {
 return (_php_pdo_get_dbh_ce = Module["_php_pdo_get_dbh_ce"] = Module["asm"]["php_pdo_get_dbh_ce"]).apply(null, arguments);
};

var _php_pdo_get_exception = Module["_php_pdo_get_exception"] = function() {
 return (_php_pdo_get_exception = Module["_php_pdo_get_exception"] = Module["asm"]["php_pdo_get_exception"]).apply(null, arguments);
};

var _add_next_index_stringl = Module["_add_next_index_stringl"] = function() {
 return (_add_next_index_stringl = Module["_add_next_index_stringl"] = Module["asm"]["add_next_index_stringl"]).apply(null, arguments);
};

var _php_pdo_register_driver = Module["_php_pdo_register_driver"] = function() {
 return (_php_pdo_register_driver = Module["_php_pdo_register_driver"] = Module["asm"]["php_pdo_register_driver"]).apply(null, arguments);
};

var _php_pdo_unregister_driver = Module["_php_pdo_unregister_driver"] = function() {
 return (_php_pdo_unregister_driver = Module["_php_pdo_unregister_driver"] = Module["asm"]["php_pdo_unregister_driver"]).apply(null, arguments);
};

var _zend_hash_str_del = Module["_zend_hash_str_del"] = function() {
 return (_zend_hash_str_del = Module["_zend_hash_str_del"] = Module["asm"]["zend_hash_str_del"]).apply(null, arguments);
};

var _php_pdo_parse_data_source = Module["_php_pdo_parse_data_source"] = function() {
 return (_php_pdo_parse_data_source = Module["_php_pdo_parse_data_source"] = Module["asm"]["php_pdo_parse_data_source"]).apply(null, arguments);
};

var _zend_register_list_destructors_ex = Module["_zend_register_list_destructors_ex"] = function() {
 return (_zend_register_list_destructors_ex = Module["_zend_register_list_destructors_ex"] = Module["asm"]["zend_register_list_destructors_ex"]).apply(null, arguments);
};

var _pdo_throw_exception = Module["_pdo_throw_exception"] = function() {
 return (_pdo_throw_exception = Module["_pdo_throw_exception"] = Module["asm"]["pdo_throw_exception"]).apply(null, arguments);
};

var _zend_update_property_long = Module["_zend_update_property_long"] = function() {
 return (_zend_update_property_long = Module["_zend_update_property_long"] = Module["asm"]["zend_update_property_long"]).apply(null, arguments);
};

var _zend_update_property_string = Module["_zend_update_property_string"] = function() {
 return (_zend_update_property_string = Module["_zend_update_property_string"] = Module["asm"]["zend_update_property_string"]).apply(null, arguments);
};

var _zend_throw_exception_object = Module["_zend_throw_exception_object"] = function() {
 return (_zend_throw_exception_object = Module["_zend_throw_exception_object"] = Module["asm"]["zend_throw_exception_object"]).apply(null, arguments);
};

var _pdo_raise_impl_error = Module["_pdo_raise_impl_error"] = function() {
 return (_pdo_raise_impl_error = Module["_pdo_raise_impl_error"] = Module["asm"]["pdo_raise_impl_error"]).apply(null, arguments);
};

var _pdo_handle_error = Module["_pdo_handle_error"] = function() {
 return (_pdo_handle_error = Module["_pdo_handle_error"] = Module["asm"]["pdo_handle_error"]).apply(null, arguments);
};

var _zend_update_property_str = Module["_zend_update_property_str"] = function() {
 return (_zend_update_property_str = Module["_zend_update_property_str"] = Module["asm"]["zend_update_property_str"]).apply(null, arguments);
};

var _cfg_get_string = Module["_cfg_get_string"] = function() {
 return (_cfg_get_string = Module["_cfg_get_string"] = Module["asm"]["cfg_get_string"]).apply(null, arguments);
};

var _zend_argument_error = Module["_zend_argument_error"] = function() {
 return (_zend_argument_error = Module["_zend_argument_error"] = Module["asm"]["zend_argument_error"]).apply(null, arguments);
};

var _zend_list_close = Module["_zend_list_close"] = function() {
 return (_zend_list_close = Module["_zend_list_close"] = Module["asm"]["zend_list_close"]).apply(null, arguments);
};

var ___zend_calloc = Module["___zend_calloc"] = function() {
 return (___zend_calloc = Module["___zend_calloc"] = Module["asm"]["__zend_calloc"]).apply(null, arguments);
};

var ___zend_strdup = Module["___zend_strdup"] = function() {
 return (___zend_strdup = Module["___zend_strdup"] = Module["asm"]["__zend_strdup"]).apply(null, arguments);
};

var _zend_register_persistent_resource = Module["_zend_register_persistent_resource"] = function() {
 return (_zend_register_persistent_resource = Module["_zend_register_persistent_resource"] = Module["asm"]["zend_register_persistent_resource"]).apply(null, arguments);
};

var _strlcpy = Module["_strlcpy"] = function() {
 return (_strlcpy = Module["_strlcpy"] = Module["asm"]["strlcpy"]).apply(null, arguments);
};

var _zend_value_error = Module["_zend_value_error"] = function() {
 return (_zend_value_error = Module["_zend_value_error"] = Module["asm"]["zend_value_error"]).apply(null, arguments);
};

var _pdo_get_long_param = Module["_pdo_get_long_param"] = function() {
 return (_pdo_get_long_param = Module["_pdo_get_long_param"] = Module["asm"]["pdo_get_long_param"]).apply(null, arguments);
};

var _is_numeric_str_function = Module["_is_numeric_str_function"] = function() {
 return (_is_numeric_str_function = Module["_is_numeric_str_function"] = Module["asm"]["is_numeric_str_function"]).apply(null, arguments);
};

var _pdo_get_bool_param = Module["_pdo_get_bool_param"] = function() {
 return (_pdo_get_bool_param = Module["_pdo_get_bool_param"] = Module["asm"]["pdo_get_bool_param"]).apply(null, arguments);
};

var _strcpy = Module["_strcpy"] = function() {
 return (_strcpy = Module["_strcpy"] = Module["asm"]["strcpy"]).apply(null, arguments);
};

var _zend_internal_run_time_cache_reserved_size = Module["_zend_internal_run_time_cache_reserved_size"] = function() {
 return (_zend_internal_run_time_cache_reserved_size = Module["_zend_internal_run_time_cache_reserved_size"] = Module["asm"]["zend_internal_run_time_cache_reserved_size"]).apply(null, arguments);
};

var _zend_set_function_arg_flags = Module["_zend_set_function_arg_flags"] = function() {
 return (_zend_set_function_arg_flags = Module["_zend_set_function_arg_flags"] = Module["asm"]["zend_set_function_arg_flags"]).apply(null, arguments);
};

var _zend_str_tolower_copy = Module["_zend_str_tolower_copy"] = function() {
 return (_zend_str_tolower_copy = Module["_zend_str_tolower_copy"] = Module["asm"]["zend_str_tolower_copy"]).apply(null, arguments);
};

var _zend_objects_not_comparable = Module["_zend_objects_not_comparable"] = function() {
 return (_zend_objects_not_comparable = Module["_zend_objects_not_comparable"] = Module["asm"]["zend_objects_not_comparable"]).apply(null, arguments);
};

var __php_stream_get_line = Module["__php_stream_get_line"] = function() {
 return (__php_stream_get_line = Module["__php_stream_get_line"] = Module["asm"]["_php_stream_get_line"]).apply(null, arguments);
};

var _zend_fcall_info_args = Module["_zend_fcall_info_args"] = function() {
 return (_zend_fcall_info_args = Module["_zend_fcall_info_args"] = Module["asm"]["zend_fcall_info_args"]).apply(null, arguments);
};

var _zend_fcall_info_args_clear = Module["_zend_fcall_info_args_clear"] = function() {
 return (_zend_fcall_info_args_clear = Module["_zend_fcall_info_args_clear"] = Module["asm"]["zend_fcall_info_args_clear"]).apply(null, arguments);
};

var _zend_std_get_method = Module["_zend_std_get_method"] = function() {
 return (_zend_std_get_method = Module["_zend_std_get_method"] = Module["asm"]["zend_std_get_method"]).apply(null, arguments);
};

var _zend_get_gc_buffer_create = Module["_zend_get_gc_buffer_create"] = function() {
 return (_zend_get_gc_buffer_create = Module["_zend_get_gc_buffer_create"] = Module["asm"]["zend_get_gc_buffer_create"]).apply(null, arguments);
};

var _zend_get_gc_buffer_grow = Module["_zend_get_gc_buffer_grow"] = function() {
 return (_zend_get_gc_buffer_grow = Module["_zend_get_gc_buffer_grow"] = Module["asm"]["zend_get_gc_buffer_grow"]).apply(null, arguments);
};

var _php_pdo_stmt_set_column_count = Module["_php_pdo_stmt_set_column_count"] = function() {
 return (_php_pdo_stmt_set_column_count = Module["_php_pdo_stmt_set_column_count"] = Module["asm"]["php_pdo_stmt_set_column_count"]).apply(null, arguments);
};

var _pdo_parse_params = Module["_pdo_parse_params"] = function() {
 return (_pdo_parse_params = Module["_pdo_parse_params"] = Module["asm"]["pdo_parse_params"]).apply(null, arguments);
};

var _zend_parse_arg_class = Module["_zend_parse_arg_class"] = function() {
 return (_zend_parse_arg_class = Module["_zend_parse_arg_class"] = Module["asm"]["zend_parse_arg_class"]).apply(null, arguments);
};

var _zend_fetch_class = Module["_zend_fetch_class"] = function() {
 return (_zend_fetch_class = Module["_zend_fetch_class"] = Module["asm"]["zend_fetch_class"]).apply(null, arguments);
};

var _zend_argument_count_error = Module["_zend_argument_count_error"] = function() {
 return (_zend_argument_count_error = Module["_zend_argument_count_error"] = Module["asm"]["zend_argument_count_error"]).apply(null, arguments);
};

var __php_stream_printf = Module["__php_stream_printf"] = function() {
 return (__php_stream_printf = Module["__php_stream_printf"] = Module["asm"]["_php_stream_printf"]).apply(null, arguments);
};

var __php_stream_write = Module["__php_stream_write"] = function() {
 return (__php_stream_write = Module["__php_stream_write"] = Module["asm"]["_php_stream_write"]).apply(null, arguments);
};

var _php_pdo_free_statement = Module["_php_pdo_free_statement"] = function() {
 return (_php_pdo_free_statement = Module["_php_pdo_free_statement"] = Module["asm"]["php_pdo_free_statement"]).apply(null, arguments);
};

var _convert_to_long = Module["_convert_to_long"] = function() {
 return (_convert_to_long = Module["_convert_to_long"] = Module["asm"]["convert_to_long"]).apply(null, arguments);
};

var _convert_to_boolean = Module["_convert_to_boolean"] = function() {
 return (_convert_to_boolean = Module["_convert_to_boolean"] = Module["asm"]["convert_to_boolean"]).apply(null, arguments);
};

var _zend_hash_index_del = Module["_zend_hash_index_del"] = function() {
 return (_zend_hash_index_del = Module["_zend_hash_index_del"] = Module["asm"]["zend_hash_index_del"]).apply(null, arguments);
};

var _zend_hash_del = Module["_zend_hash_del"] = function() {
 return (_zend_hash_del = Module["_zend_hash_del"] = Module["asm"]["zend_hash_del"]).apply(null, arguments);
};

var __convert_to_string = Module["__convert_to_string"] = function() {
 return (__convert_to_string = Module["__convert_to_string"] = Module["asm"]["_convert_to_string"]).apply(null, arguments);
};

var _zend_hash_index_add = Module["_zend_hash_index_add"] = function() {
 return (_zend_hash_index_add = Module["_zend_hash_index_add"] = Module["asm"]["zend_hash_index_add"]).apply(null, arguments);
};

var _zend_update_property_ex = Module["_zend_update_property_ex"] = function() {
 return (_zend_update_property_ex = Module["_zend_update_property_ex"] = Module["asm"]["zend_update_property_ex"]).apply(null, arguments);
};

var __php_stream_copy_to_mem = Module["__php_stream_copy_to_mem"] = function() {
 return (__php_stream_copy_to_mem = Module["__php_stream_copy_to_mem"] = Module["asm"]["_php_stream_copy_to_mem"]).apply(null, arguments);
};

var _convert_to_null = Module["_convert_to_null"] = function() {
 return (_convert_to_null = Module["_convert_to_null"] = Module["asm"]["convert_to_null"]).apply(null, arguments);
};

var __php_stream_memory_open = Module["__php_stream_memory_open"] = function() {
 return (__php_stream_memory_open = Module["__php_stream_memory_open"] = Module["asm"]["_php_stream_memory_open"]).apply(null, arguments);
};

var _zend_fcall_info_args_ex = Module["_zend_fcall_info_args_ex"] = function() {
 return (_zend_fcall_info_args_ex = Module["_zend_fcall_info_args_ex"] = Module["asm"]["zend_fcall_info_args_ex"]).apply(null, arguments);
};

var _zend_parse_arg_str_or_long_slow = Module["_zend_parse_arg_str_or_long_slow"] = function() {
 return (_zend_parse_arg_str_or_long_slow = Module["_zend_parse_arg_str_or_long_slow"] = Module["asm"]["zend_parse_arg_str_or_long_slow"]).apply(null, arguments);
};

var _zend_objects_store_del = Module["_zend_objects_store_del"] = function() {
 return (_zend_objects_store_del = Module["_zend_objects_store_del"] = Module["asm"]["zend_objects_store_del"]).apply(null, arguments);
};

var _gc_possible_root = Module["_gc_possible_root"] = function() {
 return (_gc_possible_root = Module["_gc_possible_root"] = Module["asm"]["gc_possible_root"]).apply(null, arguments);
};

var _zend_std_unset_property = Module["_zend_std_unset_property"] = function() {
 return (_zend_std_unset_property = Module["_zend_std_unset_property"] = Module["asm"]["zend_std_unset_property"]).apply(null, arguments);
};

var _zend_std_cast_object_tostring = Module["_zend_std_cast_object_tostring"] = function() {
 return (_zend_std_cast_object_tostring = Module["_zend_std_cast_object_tostring"] = Module["asm"]["zend_std_cast_object_tostring"]).apply(null, arguments);
};

var _zend_object_is_true = Module["_zend_object_is_true"] = function() {
 return (_zend_object_is_true = Module["_zend_object_is_true"] = Module["asm"]["zend_object_is_true"]).apply(null, arguments);
};

var _zval_try_get_string_func = Module["_zval_try_get_string_func"] = function() {
 return (_zval_try_get_string_func = Module["_zval_try_get_string_func"] = Module["asm"]["zval_try_get_string_func"]).apply(null, arguments);
};

var _strncpy = Module["_strncpy"] = function() {
 return (_strncpy = Module["_strncpy"] = Module["asm"]["strncpy"]).apply(null, arguments);
};

var _zend_long_to_str = Module["_zend_long_to_str"] = function() {
 return (_zend_long_to_str = Module["_zend_long_to_str"] = Module["asm"]["zend_long_to_str"]).apply(null, arguments);
};

var _zend_ulong_to_str = Module["_zend_ulong_to_str"] = function() {
 return (_zend_ulong_to_str = Module["_zend_ulong_to_str"] = Module["asm"]["zend_ulong_to_str"]).apply(null, arguments);
};

var _main = Module["_main"] = function() {
 return (_main = Module["_main"] = Module["asm"]["main"]).apply(null, arguments);
};

var _pib_init = Module["_pib_init"] = function() {
 return (_pib_init = Module["_pib_init"] = Module["asm"]["pib_init"]).apply(null, arguments);
};

var _putenv = Module["_putenv"] = function() {
 return (_putenv = Module["_putenv"] = Module["asm"]["putenv"]).apply(null, arguments);
};

var _php_embed_init = Module["_php_embed_init"] = function() {
 return (_php_embed_init = Module["_php_embed_init"] = Module["asm"]["php_embed_init"]).apply(null, arguments);
};

var _pib_storage_init = Module["_pib_storage_init"] = function() {
 return (_pib_storage_init = Module["_pib_storage_init"] = Module["asm"]["pib_storage_init"]).apply(null, arguments);
};

var _php_embed_shutdown = Module["_php_embed_shutdown"] = function() {
 return (_php_embed_shutdown = Module["_php_embed_shutdown"] = Module["asm"]["php_embed_shutdown"]).apply(null, arguments);
};

var _pib_refresh = Module["_pib_refresh"] = function() {
 return (_pib_refresh = Module["_pib_refresh"] = Module["asm"]["pib_refresh"]).apply(null, arguments);
};

var _pib_flush = Module["_pib_flush"] = function() {
 return (_pib_flush = Module["_pib_flush"] = Module["asm"]["pib_flush"]).apply(null, arguments);
};

var _php_output_flush_all = Module["_php_output_flush_all"] = function() {
 return (_php_output_flush_all = Module["_php_output_flush_all"] = Module["asm"]["php_output_flush_all"]).apply(null, arguments);
};

var _pib_exec = Module["_pib_exec"] = function() {
 return (_pib_exec = Module["_pib_exec"] = Module["asm"]["pib_exec"]).apply(null, arguments);
};

var _zend_eval_string = Module["_zend_eval_string"] = function() {
 return (_zend_eval_string = Module["_zend_eval_string"] = Module["asm"]["zend_eval_string"]).apply(null, arguments);
};

var _pib_run = Module["_pib_run"] = function() {
 return (_pib_run = Module["_pib_run"] = Module["asm"]["pib_run"]).apply(null, arguments);
};

var _sapi_send_headers = Module["_sapi_send_headers"] = function() {
 return (_sapi_send_headers = Module["_sapi_send_headers"] = Module["asm"]["sapi_send_headers"]).apply(null, arguments);
};

var _zend_exception_error = Module["_zend_exception_error"] = function() {
 return (_zend_exception_error = Module["_zend_exception_error"] = Module["asm"]["zend_exception_error"]).apply(null, arguments);
};

var _pib_php_version = Module["_pib_php_version"] = function() {
 return (_pib_php_version = Module["_pib_php_version"] = Module["asm"]["pib_php_version"]).apply(null, arguments);
};

var _pib_php_ext_api_version = Module["_pib_php_ext_api_version"] = function() {
 return (_pib_php_ext_api_version = Module["_pib_php_ext_api_version"] = Module["asm"]["pib_php_ext_api_version"]).apply(null, arguments);
};

var _pib_tokenize = Module["_pib_tokenize"] = function() {
 return (_pib_tokenize = Module["_pib_tokenize"] = Module["asm"]["pib_tokenize"]).apply(null, arguments);
};

var _php_random_range32 = Module["_php_random_range32"] = function() {
 return (_php_random_range32 = Module["_php_random_range32"] = Module["asm"]["php_random_range32"]).apply(null, arguments);
};

var _php_random_range64 = Module["_php_random_range64"] = function() {
 return (_php_random_range64 = Module["_php_random_range64"] = Module["asm"]["php_random_range64"]).apply(null, arguments);
};

var _php_random_status_alloc = Module["_php_random_status_alloc"] = function() {
 return (_php_random_status_alloc = Module["_php_random_status_alloc"] = Module["asm"]["php_random_status_alloc"]).apply(null, arguments);
};

var _php_random_status_copy = Module["_php_random_status_copy"] = function() {
 return (_php_random_status_copy = Module["_php_random_status_copy"] = Module["asm"]["php_random_status_copy"]).apply(null, arguments);
};

var _php_random_status_free = Module["_php_random_status_free"] = function() {
 return (_php_random_status_free = Module["_php_random_status_free"] = Module["asm"]["php_random_status_free"]).apply(null, arguments);
};

var _php_random_engine_common_init = Module["_php_random_engine_common_init"] = function() {
 return (_php_random_engine_common_init = Module["_php_random_engine_common_init"] = Module["asm"]["php_random_engine_common_init"]).apply(null, arguments);
};

var _php_random_engine_common_free_object = Module["_php_random_engine_common_free_object"] = function() {
 return (_php_random_engine_common_free_object = Module["_php_random_engine_common_free_object"] = Module["asm"]["php_random_engine_common_free_object"]).apply(null, arguments);
};

var _php_random_engine_common_clone_object = Module["_php_random_engine_common_clone_object"] = function() {
 return (_php_random_engine_common_clone_object = Module["_php_random_engine_common_clone_object"] = Module["asm"]["php_random_engine_common_clone_object"]).apply(null, arguments);
};

var _php_random_range = Module["_php_random_range"] = function() {
 return (_php_random_range = Module["_php_random_range"] = Module["asm"]["php_random_range"]).apply(null, arguments);
};

var _php_random_default_algo = Module["_php_random_default_algo"] = function() {
 return (_php_random_default_algo = Module["_php_random_default_algo"] = Module["asm"]["php_random_default_algo"]).apply(null, arguments);
};

var _php_random_default_status = Module["_php_random_default_status"] = function() {
 return (_php_random_default_status = Module["_php_random_default_status"] = Module["asm"]["php_random_default_status"]).apply(null, arguments);
};

var _php_random_mt19937_seed_default = Module["_php_random_mt19937_seed_default"] = function() {
 return (_php_random_mt19937_seed_default = Module["_php_random_mt19937_seed_default"] = Module["asm"]["php_random_mt19937_seed_default"]).apply(null, arguments);
};

var _php_random_bin2hex_le = Module["_php_random_bin2hex_le"] = function() {
 return (_php_random_bin2hex_le = Module["_php_random_bin2hex_le"] = Module["asm"]["php_random_bin2hex_le"]).apply(null, arguments);
};

var _php_random_hex2bin_le = Module["_php_random_hex2bin_le"] = function() {
 return (_php_random_hex2bin_le = Module["_php_random_hex2bin_le"] = Module["asm"]["php_random_hex2bin_le"]).apply(null, arguments);
};

var _php_combined_lcg = Module["_php_combined_lcg"] = function() {
 return (_php_combined_lcg = Module["_php_combined_lcg"] = Module["asm"]["php_combined_lcg"]).apply(null, arguments);
};

var _php_random_combinedlcg_seed_default = Module["_php_random_combinedlcg_seed_default"] = function() {
 return (_php_random_combinedlcg_seed_default = Module["_php_random_combinedlcg_seed_default"] = Module["asm"]["php_random_combinedlcg_seed_default"]).apply(null, arguments);
};

var _php_mt_srand = Module["_php_mt_srand"] = function() {
 return (_php_mt_srand = Module["_php_mt_srand"] = Module["asm"]["php_mt_srand"]).apply(null, arguments);
};

var _php_mt_rand = Module["_php_mt_rand"] = function() {
 return (_php_mt_rand = Module["_php_mt_rand"] = Module["asm"]["php_mt_rand"]).apply(null, arguments);
};

var _php_mt_rand_range = Module["_php_mt_rand_range"] = function() {
 return (_php_mt_rand_range = Module["_php_mt_rand_range"] = Module["asm"]["php_mt_rand_range"]).apply(null, arguments);
};

var _php_mt_rand_common = Module["_php_mt_rand_common"] = function() {
 return (_php_mt_rand_common = Module["_php_mt_rand_common"] = Module["asm"]["php_mt_rand_common"]).apply(null, arguments);
};

var _php_srand = Module["_php_srand"] = function() {
 return (_php_srand = Module["_php_srand"] = Module["asm"]["php_srand"]).apply(null, arguments);
};

var _php_rand = Module["_php_rand"] = function() {
 return (_php_rand = Module["_php_rand"] = Module["asm"]["php_rand"]).apply(null, arguments);
};

var _php_random_bytes = Module["_php_random_bytes"] = function() {
 return (_php_random_bytes = Module["_php_random_bytes"] = Module["asm"]["php_random_bytes"]).apply(null, arguments);
};

var _php_random_int = Module["_php_random_int"] = function() {
 return (_php_random_int = Module["_php_random_int"] = Module["asm"]["php_random_int"]).apply(null, arguments);
};

var _zend_register_internal_enum = Module["_zend_register_internal_enum"] = function() {
 return (_zend_register_internal_enum = Module["_zend_register_internal_enum"] = Module["asm"]["zend_register_internal_enum"]).apply(null, arguments);
};

var _zend_enum_add_case_cstr = Module["_zend_enum_add_case_cstr"] = function() {
 return (_zend_enum_add_case_cstr = Module["_zend_enum_add_case_cstr"] = Module["asm"]["zend_enum_add_case_cstr"]).apply(null, arguments);
};

var _close = Module["_close"] = function() {
 return (_close = Module["_close"] = Module["asm"]["close"]).apply(null, arguments);
};

var _open = Module["_open"] = function() {
 return (_open = Module["_open"] = Module["asm"]["open"]).apply(null, arguments);
};

var _strerror = Module["_strerror"] = function() {
 return (_strerror = Module["_strerror"] = Module["asm"]["strerror"]).apply(null, arguments);
};

var _fstat = Module["_fstat"] = function() {
 return (_fstat = Module["_fstat"] = Module["asm"]["fstat"]).apply(null, arguments);
};

var _read = Module["_read"] = function() {
 return (_read = Module["_read"] = Module["asm"]["read"]).apply(null, arguments);
};

var _getpid = Module["_getpid"] = function() {
 return (_getpid = Module["_getpid"] = Module["asm"]["getpid"]).apply(null, arguments);
};

var _php_random_pcgoneseq128xslrr64_advance = Module["_php_random_pcgoneseq128xslrr64_advance"] = function() {
 return (_php_random_pcgoneseq128xslrr64_advance = Module["_php_random_pcgoneseq128xslrr64_advance"] = Module["asm"]["php_random_pcgoneseq128xslrr64_advance"]).apply(null, arguments);
};

var _php_random_xoshiro256starstar_jump = Module["_php_random_xoshiro256starstar_jump"] = function() {
 return (_php_random_xoshiro256starstar_jump = Module["_php_random_xoshiro256starstar_jump"] = Module["asm"]["php_random_xoshiro256starstar_jump"]).apply(null, arguments);
};

var _php_random_xoshiro256starstar_jump_long = Module["_php_random_xoshiro256starstar_jump_long"] = function() {
 return (_php_random_xoshiro256starstar_jump_long = Module["_php_random_xoshiro256starstar_jump_long"] = Module["asm"]["php_random_xoshiro256starstar_jump_long"]).apply(null, arguments);
};

var _zend_call_known_function = Module["_zend_call_known_function"] = function() {
 return (_zend_call_known_function = Module["_zend_call_known_function"] = Module["asm"]["zend_call_known_function"]).apply(null, arguments);
};

var _php_random_gammasection_closed_open = Module["_php_random_gammasection_closed_open"] = function() {
 return (_php_random_gammasection_closed_open = Module["_php_random_gammasection_closed_open"] = Module["asm"]["php_random_gammasection_closed_open"]).apply(null, arguments);
};

var _php_random_gammasection_closed_closed = Module["_php_random_gammasection_closed_closed"] = function() {
 return (_php_random_gammasection_closed_closed = Module["_php_random_gammasection_closed_closed"] = Module["asm"]["php_random_gammasection_closed_closed"]).apply(null, arguments);
};

var _php_random_gammasection_open_closed = Module["_php_random_gammasection_open_closed"] = function() {
 return (_php_random_gammasection_open_closed = Module["_php_random_gammasection_open_closed"] = Module["asm"]["php_random_gammasection_open_closed"]).apply(null, arguments);
};

var _php_random_gammasection_open_open = Module["_php_random_gammasection_open_open"] = function() {
 return (_php_random_gammasection_open_open = Module["_php_random_gammasection_open_open"] = Module["asm"]["php_random_gammasection_open_open"]).apply(null, arguments);
};

var _nextafter = Module["_nextafter"] = function() {
 return (_nextafter = Module["_nextafter"] = Module["asm"]["nextafter"]).apply(null, arguments);
};

var _php_array_data_shuffle = Module["_php_array_data_shuffle"] = function() {
 return (_php_array_data_shuffle = Module["_php_array_data_shuffle"] = Module["asm"]["php_array_data_shuffle"]).apply(null, arguments);
};

var _php_binary_string_shuffle = Module["_php_binary_string_shuffle"] = function() {
 return (_php_binary_string_shuffle = Module["_php_binary_string_shuffle"] = Module["asm"]["php_binary_string_shuffle"]).apply(null, arguments);
};

var _php_array_pick_keys = Module["_php_array_pick_keys"] = function() {
 return (_php_array_pick_keys = Module["_php_array_pick_keys"] = Module["asm"]["php_array_pick_keys"]).apply(null, arguments);
};

var _zend_read_property = Module["_zend_read_property"] = function() {
 return (_zend_read_property = Module["_zend_read_property"] = Module["asm"]["zend_read_property"]).apply(null, arguments);
};

var _zend_reflection_class_factory = Module["_zend_reflection_class_factory"] = function() {
 return (_zend_reflection_class_factory = Module["_zend_reflection_class_factory"] = Module["asm"]["zend_reflection_class_factory"]).apply(null, arguments);
};

var _zend_get_closure_method_def = Module["_zend_get_closure_method_def"] = function() {
 return (_zend_get_closure_method_def = Module["_zend_get_closure_method_def"] = Module["asm"]["zend_get_closure_method_def"]).apply(null, arguments);
};

var _zend_fetch_function = Module["_zend_fetch_function"] = function() {
 return (_zend_fetch_function = Module["_zend_fetch_function"] = Module["asm"]["zend_fetch_function"]).apply(null, arguments);
};

var _zend_get_closure_this_ptr = Module["_zend_get_closure_this_ptr"] = function() {
 return (_zend_get_closure_this_ptr = Module["_zend_get_closure_this_ptr"] = Module["asm"]["zend_get_closure_this_ptr"]).apply(null, arguments);
};

var _zend_create_fake_closure = Module["_zend_create_fake_closure"] = function() {
 return (_zend_create_fake_closure = Module["_zend_create_fake_closure"] = Module["asm"]["zend_create_fake_closure"]).apply(null, arguments);
};

var _zend_hash_copy = Module["_zend_hash_copy"] = function() {
 return (_zend_hash_copy = Module["_zend_hash_copy"] = Module["asm"]["zend_hash_copy"]).apply(null, arguments);
};

var _zval_add_ref = Module["_zval_add_ref"] = function() {
 return (_zval_add_ref = Module["_zval_add_ref"] = Module["asm"]["zval_add_ref"]).apply(null, arguments);
};

var _zend_fetch_debug_backtrace = Module["_zend_fetch_debug_backtrace"] = function() {
 return (_zend_fetch_debug_backtrace = Module["_zend_fetch_debug_backtrace"] = Module["asm"]["zend_fetch_debug_backtrace"]).apply(null, arguments);
};

var _zend_get_closure_invoke_method = Module["_zend_get_closure_invoke_method"] = function() {
 return (_zend_get_closure_invoke_method = Module["_zend_get_closure_invoke_method"] = Module["asm"]["zend_get_closure_invoke_method"]).apply(null, arguments);
};

var _zend_binary_strcasecmp = Module["_zend_binary_strcasecmp"] = function() {
 return (_zend_binary_strcasecmp = Module["_zend_binary_strcasecmp"] = Module["asm"]["zend_binary_strcasecmp"]).apply(null, arguments);
};

var _zval_update_constant_ex = Module["_zval_update_constant_ex"] = function() {
 return (_zval_update_constant_ex = Module["_zval_update_constant_ex"] = Module["asm"]["zval_update_constant_ex"]).apply(null, arguments);
};

var _zend_update_class_constant = Module["_zend_update_class_constant"] = function() {
 return (_zend_update_class_constant = Module["_zend_update_class_constant"] = Module["asm"]["zend_update_class_constant"]).apply(null, arguments);
};

var _zval_copy_ctor_func = Module["_zval_copy_ctor_func"] = function() {
 return (_zval_copy_ctor_func = Module["_zval_copy_ctor_func"] = Module["asm"]["zval_copy_ctor_func"]).apply(null, arguments);
};

var _zend_update_class_constants = Module["_zend_update_class_constants"] = function() {
 return (_zend_update_class_constants = Module["_zend_update_class_constants"] = Module["asm"]["zend_update_class_constants"]).apply(null, arguments);
};

var _zend_class_init_statics = Module["_zend_class_init_statics"] = function() {
 return (_zend_class_init_statics = Module["_zend_class_init_statics"] = Module["asm"]["zend_class_init_statics"]).apply(null, arguments);
};

var _zend_std_get_static_property = Module["_zend_std_get_static_property"] = function() {
 return (_zend_std_get_static_property = Module["_zend_std_get_static_property"] = Module["asm"]["zend_std_get_static_property"]).apply(null, arguments);
};

var _zend_std_get_static_property_with_info = Module["_zend_std_get_static_property_with_info"] = function() {
 return (_zend_std_get_static_property_with_info = Module["_zend_std_get_static_property_with_info"] = Module["asm"]["zend_std_get_static_property_with_info"]).apply(null, arguments);
};

var _zend_clear_exception = Module["_zend_clear_exception"] = function() {
 return (_zend_clear_exception = Module["_zend_clear_exception"] = Module["asm"]["zend_clear_exception"]).apply(null, arguments);
};

var _zend_verify_ref_assignable_zval = Module["_zend_verify_ref_assignable_zval"] = function() {
 return (_zend_verify_ref_assignable_zval = Module["_zend_verify_ref_assignable_zval"] = Module["asm"]["zend_verify_ref_assignable_zval"]).apply(null, arguments);
};

var _zend_verify_property_type = Module["_zend_verify_property_type"] = function() {
 return (_zend_verify_property_type = Module["_zend_verify_property_type"] = Module["asm"]["zend_verify_property_type"]).apply(null, arguments);
};

var _strstr = Module["_strstr"] = function() {
 return (_strstr = Module["_strstr"] = Module["asm"]["strstr"]).apply(null, arguments);
};

var _zend_fetch_class_by_name = Module["_zend_fetch_class_by_name"] = function() {
 return (_zend_fetch_class_by_name = Module["_zend_fetch_class_by_name"] = Module["asm"]["zend_fetch_class_by_name"]).apply(null, arguments);
};

var _zend_read_static_property_ex = Module["_zend_read_static_property_ex"] = function() {
 return (_zend_read_static_property_ex = Module["_zend_read_static_property_ex"] = Module["asm"]["zend_read_static_property_ex"]).apply(null, arguments);
};

var _zend_read_property_ex = Module["_zend_read_property_ex"] = function() {
 return (_zend_read_property_ex = Module["_zend_read_property_ex"] = Module["asm"]["zend_read_property_ex"]).apply(null, arguments);
};

var _zend_update_static_property_ex = Module["_zend_update_static_property_ex"] = function() {
 return (_zend_update_static_property_ex = Module["_zend_update_static_property_ex"] = Module["asm"]["zend_update_static_property_ex"]).apply(null, arguments);
};

var _php_info_print_module = Module["_php_info_print_module"] = function() {
 return (_php_info_print_module = Module["_php_info_print_module"] = Module["asm"]["php_info_print_module"]).apply(null, arguments);
};

var _zend_get_extension = Module["_zend_get_extension"] = function() {
 return (_zend_get_extension = Module["_zend_get_extension"] = Module["asm"]["zend_get_extension"]).apply(null, arguments);
};

var _smart_str_append_printf = Module["_smart_str_append_printf"] = function() {
 return (_smart_str_append_printf = Module["_smart_str_append_printf"] = Module["asm"]["smart_str_append_printf"]).apply(null, arguments);
};

var _zend_is_attribute_repeated = Module["_zend_is_attribute_repeated"] = function() {
 return (_zend_is_attribute_repeated = Module["_zend_is_attribute_repeated"] = Module["asm"]["zend_is_attribute_repeated"]).apply(null, arguments);
};

var _zend_get_attribute_value = Module["_zend_get_attribute_value"] = function() {
 return (_zend_get_attribute_value = Module["_zend_get_attribute_value"] = Module["asm"]["zend_get_attribute_value"]).apply(null, arguments);
};

var _zend_get_attribute_str = Module["_zend_get_attribute_str"] = function() {
 return (_zend_get_attribute_str = Module["_zend_get_attribute_str"] = Module["asm"]["zend_get_attribute_str"]).apply(null, arguments);
};

var _zend_get_attribute_target_names = Module["_zend_get_attribute_target_names"] = function() {
 return (_zend_get_attribute_target_names = Module["_zend_get_attribute_target_names"] = Module["asm"]["zend_get_attribute_target_names"]).apply(null, arguments);
};

var _zend_type_to_string = Module["_zend_type_to_string"] = function() {
 return (_zend_type_to_string = Module["_zend_type_to_string"] = Module["asm"]["zend_type_to_string"]).apply(null, arguments);
};

var _zend_lookup_class_ex = Module["_zend_lookup_class_ex"] = function() {
 return (_zend_lookup_class_ex = Module["_zend_lookup_class_ex"] = Module["asm"]["zend_lookup_class_ex"]).apply(null, arguments);
};

var __efree_32 = Module["__efree_32"] = function() {
 return (__efree_32 = Module["__efree_32"] = Module["asm"]["_efree_32"]).apply(null, arguments);
};

var _zend_generator_update_root = Module["_zend_generator_update_root"] = function() {
 return (_zend_generator_update_root = Module["_zend_generator_update_root"] = Module["asm"]["zend_generator_update_root"]).apply(null, arguments);
};

var _zend_generator_update_current = Module["_zend_generator_update_current"] = function() {
 return (_zend_generator_update_current = Module["_zend_generator_update_current"] = Module["asm"]["zend_generator_update_current"]).apply(null, arguments);
};

var _zend_get_default_from_internal_arg_info = Module["_zend_get_default_from_internal_arg_info"] = function() {
 return (_zend_get_default_from_internal_arg_info = Module["_zend_get_default_from_internal_arg_info"] = Module["asm"]["zend_get_default_from_internal_arg_info"]).apply(null, arguments);
};

var _memrchr = Module["_memrchr"] = function() {
 return (_memrchr = Module["_memrchr"] = Module["asm"]["memrchr"]).apply(null, arguments);
};

var _zend_separate_class_constants_table = Module["_zend_separate_class_constants_table"] = function() {
 return (_zend_separate_class_constants_table = Module["_zend_separate_class_constants_table"] = Module["asm"]["zend_separate_class_constants_table"]).apply(null, arguments);
};

var _zend_zval_type_name = Module["_zend_zval_type_name"] = function() {
 return (_zend_zval_type_name = Module["_zend_zval_type_name"] = Module["asm"]["zend_zval_type_name"]).apply(null, arguments);
};

var _strcasecmp = Module["_strcasecmp"] = function() {
 return (_strcasecmp = Module["_strcasecmp"] = Module["asm"]["strcasecmp"]).apply(null, arguments);
};

var _smart_str_append_scalar = Module["_smart_str_append_scalar"] = function() {
 return (_smart_str_append_scalar = Module["_smart_str_append_scalar"] = Module["asm"]["smart_str_append_scalar"]).apply(null, arguments);
};

var _smart_str_append_escaped = Module["_smart_str_append_escaped"] = function() {
 return (_smart_str_append_escaped = Module["_smart_str_append_escaped"] = Module["asm"]["smart_str_append_escaped"]).apply(null, arguments);
};

var _zend_ast_export = Module["_zend_ast_export"] = function() {
 return (_zend_ast_export = Module["_zend_ast_export"] = Module["asm"]["zend_ast_export"]).apply(null, arguments);
};

var _zend_vm_stack_extend = Module["_zend_vm_stack_extend"] = function() {
 return (_zend_vm_stack_extend = Module["_zend_vm_stack_extend"] = Module["asm"]["zend_vm_stack_extend"]).apply(null, arguments);
};

var __zend_bailout = Module["__zend_bailout"] = function() {
 return (__zend_bailout = Module["__zend_bailout"] = Module["asm"]["_zend_bailout"]).apply(null, arguments);
};

var _php_session_destroy = Module["_php_session_destroy"] = function() {
 return (_php_session_destroy = Module["_php_session_destroy"] = Module["asm"]["php_session_destroy"]).apply(null, arguments);
};

var _php_add_session_var = Module["_php_add_session_var"] = function() {
 return (_php_add_session_var = Module["_php_add_session_var"] = Module["asm"]["php_add_session_var"]).apply(null, arguments);
};

var _php_set_session_var = Module["_php_set_session_var"] = function() {
 return (_php_set_session_var = Module["_php_set_session_var"] = Module["asm"]["php_set_session_var"]).apply(null, arguments);
};

var _php_get_session_var = Module["_php_get_session_var"] = function() {
 return (_php_get_session_var = Module["_php_get_session_var"] = Module["asm"]["php_get_session_var"]).apply(null, arguments);
};

var _php_session_create_id = Module["_php_session_create_id"] = function() {
 return (_php_session_create_id = Module["_php_session_create_id"] = Module["asm"]["php_session_create_id"]).apply(null, arguments);
};

var _php_session_valid_key = Module["_php_session_valid_key"] = function() {
 return (_php_session_valid_key = Module["_php_session_valid_key"] = Module["asm"]["php_session_valid_key"]).apply(null, arguments);
};

var _php_var_serialize_init = Module["_php_var_serialize_init"] = function() {
 return (_php_var_serialize_init = Module["_php_var_serialize_init"] = Module["asm"]["php_var_serialize_init"]).apply(null, arguments);
};

var _php_var_serialize = Module["_php_var_serialize"] = function() {
 return (_php_var_serialize = Module["_php_var_serialize"] = Module["asm"]["php_var_serialize"]).apply(null, arguments);
};

var _php_var_serialize_destroy = Module["_php_var_serialize_destroy"] = function() {
 return (_php_var_serialize_destroy = Module["_php_var_serialize_destroy"] = Module["asm"]["php_var_serialize_destroy"]).apply(null, arguments);
};

var _php_var_unserialize_init = Module["_php_var_unserialize_init"] = function() {
 return (_php_var_unserialize_init = Module["_php_var_unserialize_init"] = Module["asm"]["php_var_unserialize_init"]).apply(null, arguments);
};

var _php_var_unserialize = Module["_php_var_unserialize"] = function() {
 return (_php_var_unserialize = Module["_php_var_unserialize"] = Module["asm"]["php_var_unserialize"]).apply(null, arguments);
};

var _php_var_unserialize_destroy = Module["_php_var_unserialize_destroy"] = function() {
 return (_php_var_unserialize_destroy = Module["_php_var_unserialize_destroy"] = Module["asm"]["php_var_unserialize_destroy"]).apply(null, arguments);
};

var _zend_hash_update_ind = Module["_zend_hash_update_ind"] = function() {
 return (_zend_hash_update_ind = Module["_zend_hash_update_ind"] = Module["asm"]["zend_hash_update_ind"]).apply(null, arguments);
};

var _var_tmp_var = Module["_var_tmp_var"] = function() {
 return (_var_tmp_var = Module["_var_tmp_var"] = Module["asm"]["var_tmp_var"]).apply(null, arguments);
};

var _php_session_register_serializer = Module["_php_session_register_serializer"] = function() {
 return (_php_session_register_serializer = Module["_php_session_register_serializer"] = Module["asm"]["php_session_register_serializer"]).apply(null, arguments);
};

var _php_session_register_module = Module["_php_session_register_module"] = function() {
 return (_php_session_register_module = Module["_php_session_register_module"] = Module["asm"]["php_session_register_module"]).apply(null, arguments);
};

var _php_session_validate_sid = Module["_php_session_validate_sid"] = function() {
 return (_php_session_validate_sid = Module["_php_session_validate_sid"] = Module["asm"]["php_session_validate_sid"]).apply(null, arguments);
};

var _php_session_update_timestamp = Module["_php_session_update_timestamp"] = function() {
 return (_php_session_update_timestamp = Module["_php_session_update_timestamp"] = Module["asm"]["php_session_update_timestamp"]).apply(null, arguments);
};

var __php_find_ps_module = Module["__php_find_ps_module"] = function() {
 return (__php_find_ps_module = Module["__php_find_ps_module"] = Module["asm"]["_php_find_ps_module"]).apply(null, arguments);
};

var __php_find_ps_serializer = Module["__php_find_ps_serializer"] = function() {
 return (__php_find_ps_serializer = Module["__php_find_ps_serializer"] = Module["asm"]["_php_find_ps_serializer"]).apply(null, arguments);
};

var _php_session_reset_id = Module["_php_session_reset_id"] = function() {
 return (_php_session_reset_id = Module["_php_session_reset_id"] = Module["asm"]["php_session_reset_id"]).apply(null, arguments);
};

var _zend_get_constant_str = Module["_zend_get_constant_str"] = function() {
 return (_zend_get_constant_str = Module["_zend_get_constant_str"] = Module["asm"]["zend_get_constant_str"]).apply(null, arguments);
};

var _zend_register_stringl_constant = Module["_zend_register_stringl_constant"] = function() {
 return (_zend_register_stringl_constant = Module["_zend_register_stringl_constant"] = Module["asm"]["zend_register_stringl_constant"]).apply(null, arguments);
};

var _php_url_scanner_reset_session_var = Module["_php_url_scanner_reset_session_var"] = function() {
 return (_php_url_scanner_reset_session_var = Module["_php_url_scanner_reset_session_var"] = Module["asm"]["php_url_scanner_reset_session_var"]).apply(null, arguments);
};

var _php_url_scanner_add_session_var = Module["_php_url_scanner_add_session_var"] = function() {
 return (_php_url_scanner_add_session_var = Module["_php_url_scanner_add_session_var"] = Module["asm"]["php_url_scanner_add_session_var"]).apply(null, arguments);
};

var _php_session_start = Module["_php_session_start"] = function() {
 return (_php_session_start = Module["_php_session_start"] = Module["asm"]["php_session_start"]).apply(null, arguments);
};

var _zend_ini_string = Module["_zend_ini_string"] = function() {
 return (_zend_ini_string = Module["_zend_ini_string"] = Module["asm"]["zend_ini_string"]).apply(null, arguments);
};

var _strpbrk = Module["_strpbrk"] = function() {
 return (_strpbrk = Module["_strpbrk"] = Module["asm"]["strpbrk"]).apply(null, arguments);
};

var _php_session_flush = Module["_php_session_flush"] = function() {
 return (_php_session_flush = Module["_php_session_flush"] = Module["asm"]["php_session_flush"]).apply(null, arguments);
};

var _session_adapt_url = Module["_session_adapt_url"] = function() {
 return (_session_adapt_url = Module["_session_adapt_url"] = Module["asm"]["session_adapt_url"]).apply(null, arguments);
};

var _php_url_scanner_adapt_single_url = Module["_php_url_scanner_adapt_single_url"] = function() {
 return (_php_url_scanner_adapt_single_url = Module["_php_url_scanner_adapt_single_url"] = Module["asm"]["php_url_scanner_adapt_single_url"]).apply(null, arguments);
};

var _zend_alter_ini_entry = Module["_zend_alter_ini_entry"] = function() {
 return (_zend_alter_ini_entry = Module["_zend_alter_ini_entry"] = Module["asm"]["zend_alter_ini_entry"]).apply(null, arguments);
};

var _zend_alter_ini_entry_chars = Module["_zend_alter_ini_entry_chars"] = function() {
 return (_zend_alter_ini_entry_chars = Module["_zend_alter_ini_entry_chars"] = Module["asm"]["zend_alter_ini_entry_chars"]).apply(null, arguments);
};

var _register_user_shutdown_function = Module["_register_user_shutdown_function"] = function() {
 return (_register_user_shutdown_function = Module["_register_user_shutdown_function"] = Module["asm"]["register_user_shutdown_function"]).apply(null, arguments);
};

var _remove_user_shutdown_function = Module["_remove_user_shutdown_function"] = function() {
 return (_remove_user_shutdown_function = Module["_remove_user_shutdown_function"] = Module["asm"]["remove_user_shutdown_function"]).apply(null, arguments);
};

var _get_active_function_name = Module["_get_active_function_name"] = function() {
 return (_get_active_function_name = Module["_get_active_function_name"] = Module["asm"]["get_active_function_name"]).apply(null, arguments);
};

var _zend_hash_clean = Module["_zend_hash_clean"] = function() {
 return (_zend_hash_clean = Module["_zend_hash_clean"] = Module["asm"]["zend_hash_clean"]).apply(null, arguments);
};

var _append_user_shutdown_function = Module["_append_user_shutdown_function"] = function() {
 return (_append_user_shutdown_function = Module["_append_user_shutdown_function"] = Module["asm"]["append_user_shutdown_function"]).apply(null, arguments);
};

var _php_output_get_start_filename = Module["_php_output_get_start_filename"] = function() {
 return (_php_output_get_start_filename = Module["_php_output_get_start_filename"] = Module["asm"]["php_output_get_start_filename"]).apply(null, arguments);
};

var _php_output_get_start_lineno = Module["_php_output_get_start_lineno"] = function() {
 return (_php_output_get_start_lineno = Module["_php_output_get_start_lineno"] = Module["asm"]["php_output_get_start_lineno"]).apply(null, arguments);
};

var _php_url_encode = Module["_php_url_encode"] = function() {
 return (_php_url_encode = Module["_php_url_encode"] = Module["asm"]["php_url_encode"]).apply(null, arguments);
};

var _sapi_add_header_ex = Module["_sapi_add_header_ex"] = function() {
 return (_sapi_add_header_ex = Module["_sapi_add_header_ex"] = Module["asm"]["sapi_add_header_ex"]).apply(null, arguments);
};

var _sapi_free_header = Module["_sapi_free_header"] = function() {
 return (_sapi_free_header = Module["_sapi_free_header"] = Module["asm"]["sapi_free_header"]).apply(null, arguments);
};

var _zend_get_executed_filename_ex = Module["_zend_get_executed_filename_ex"] = function() {
 return (_zend_get_executed_filename_ex = Module["_zend_get_executed_filename_ex"] = Module["asm"]["zend_get_executed_filename_ex"]).apply(null, arguments);
};

var _zend_get_executed_lineno = Module["_zend_get_executed_lineno"] = function() {
 return (_zend_get_executed_lineno = Module["_zend_get_executed_lineno"] = Module["asm"]["zend_get_executed_lineno"]).apply(null, arguments);
};

var _zend_delete_global_variable = Module["_zend_delete_global_variable"] = function() {
 return (_zend_delete_global_variable = Module["_zend_delete_global_variable"] = Module["asm"]["zend_delete_global_variable"]).apply(null, arguments);
};

var _gmtime_r = Module["_gmtime_r"] = function() {
 return (_gmtime_r = Module["_gmtime_r"] = Module["asm"]["gmtime_r"]).apply(null, arguments);
};

var _stat = Module["_stat"] = function() {
 return (_stat = Module["_stat"] = Module["asm"]["stat"]).apply(null, arguments);
};

var _zend_alter_ini_entry_ex = Module["_zend_alter_ini_entry_ex"] = function() {
 return (_zend_alter_ini_entry_ex = Module["_zend_alter_ini_entry_ex"] = Module["asm"]["zend_alter_ini_entry_ex"]).apply(null, arguments);
};

var _zend_register_auto_global = Module["_zend_register_auto_global"] = function() {
 return (_zend_register_auto_global = Module["_zend_register_auto_global"] = Module["asm"]["zend_register_auto_global"]).apply(null, arguments);
};

var _OnUpdateBool = Module["_OnUpdateBool"] = function() {
 return (_OnUpdateBool = Module["_OnUpdateBool"] = Module["asm"]["OnUpdateBool"]).apply(null, arguments);
};

var _zend_ini_boolean_displayer_cb = Module["_zend_ini_boolean_displayer_cb"] = function() {
 return (_zend_ini_boolean_displayer_cb = Module["_zend_ini_boolean_displayer_cb"] = Module["asm"]["zend_ini_boolean_displayer_cb"]).apply(null, arguments);
};

var _OnUpdateReal = Module["_OnUpdateReal"] = function() {
 return (_OnUpdateReal = Module["_OnUpdateReal"] = Module["asm"]["OnUpdateReal"]).apply(null, arguments);
};

var _php_check_open_basedir = Module["_php_check_open_basedir"] = function() {
 return (_php_check_open_basedir = Module["_php_check_open_basedir"] = Module["asm"]["php_check_open_basedir"]).apply(null, arguments);
};

var _OnUpdateStringUnempty = Module["_OnUpdateStringUnempty"] = function() {
 return (_OnUpdateStringUnempty = Module["_OnUpdateStringUnempty"] = Module["asm"]["OnUpdateStringUnempty"]).apply(null, arguments);
};

var _atol = Module["_atol"] = function() {
 return (_atol = Module["_atol"] = Module["asm"]["atol"]).apply(null, arguments);
};

var _OnUpdateLongGEZero = Module["_OnUpdateLongGEZero"] = function() {
 return (_OnUpdateLongGEZero = Module["_OnUpdateLongGEZero"] = Module["asm"]["OnUpdateLongGEZero"]).apply(null, arguments);
};

var _sapi_get_request_time = Module["_sapi_get_request_time"] = function() {
 return (_sapi_get_request_time = Module["_sapi_get_request_time"] = Module["asm"]["sapi_get_request_time"]).apply(null, arguments);
};

var _php_get_temporary_directory = Module["_php_get_temporary_directory"] = function() {
 return (_php_get_temporary_directory = Module["_php_get_temporary_directory"] = Module["asm"]["php_get_temporary_directory"]).apply(null, arguments);
};

var _lseek = Module["_lseek"] = function() {
 return (_lseek = Module["_lseek"] = Module["asm"]["lseek"]).apply(null, arguments);
};

var _utime = Module["_utime"] = function() {
 return (_utime = Module["_utime"] = Module["asm"]["utime"]).apply(null, arguments);
};

var _unlink = Module["_unlink"] = function() {
 return (_unlink = Module["_unlink"] = Module["asm"]["unlink"]).apply(null, arguments);
};

var _access = Module["_access"] = function() {
 return (_access = Module["_access"] = Module["asm"]["access"]).apply(null, arguments);
};

var _getuid = Module["_getuid"] = function() {
 return (_getuid = Module["_getuid"] = Module["asm"]["getuid"]).apply(null, arguments);
};

var _geteuid = Module["_geteuid"] = function() {
 return (_geteuid = Module["_geteuid"] = Module["asm"]["geteuid"]).apply(null, arguments);
};

var _flock = Module["_flock"] = function() {
 return (_flock = Module["_flock"] = Module["asm"]["flock"]).apply(null, arguments);
};

var _fcntl = Module["_fcntl"] = function() {
 return (_fcntl = Module["_fcntl"] = Module["asm"]["fcntl"]).apply(null, arguments);
};

var _ftruncate = Module["_ftruncate"] = function() {
 return (_ftruncate = Module["_ftruncate"] = Module["asm"]["ftruncate"]).apply(null, arguments);
};

var _write = Module["_write"] = function() {
 return (_write = Module["_write"] = Module["asm"]["write"]).apply(null, arguments);
};

var _opendir = Module["_opendir"] = function() {
 return (_opendir = Module["_opendir"] = Module["asm"]["opendir"]).apply(null, arguments);
};

var _closedir = Module["_closedir"] = function() {
 return (_closedir = Module["_closedir"] = Module["asm"]["closedir"]).apply(null, arguments);
};

var _readdir = Module["_readdir"] = function() {
 return (_readdir = Module["_readdir"] = Module["asm"]["readdir"]).apply(null, arguments);
};

var _zend_hash_real_init_mixed = Module["_zend_hash_real_init_mixed"] = function() {
 return (_zend_hash_real_init_mixed = Module["_zend_hash_real_init_mixed"] = Module["asm"]["zend_hash_real_init_mixed"]).apply(null, arguments);
};

var _zend_hash_rehash = Module["_zend_hash_rehash"] = function() {
 return (_zend_hash_rehash = Module["_zend_hash_rehash"] = Module["asm"]["zend_hash_rehash"]).apply(null, arguments);
};

var _zend_hash_del_bucket = Module["_zend_hash_del_bucket"] = function() {
 return (_zend_hash_del_bucket = Module["_zend_hash_del_bucket"] = Module["asm"]["zend_hash_del_bucket"]).apply(null, arguments);
};

var _add_next_index_object = Module["_add_next_index_object"] = function() {
 return (_add_next_index_object = Module["_add_next_index_object"] = Module["asm"]["add_next_index_object"]).apply(null, arguments);
};

var _php_spl_object_hash = Module["_php_spl_object_hash"] = function() {
 return (_php_spl_object_hash = Module["_php_spl_object_hash"] = Module["asm"]["php_spl_object_hash"]).apply(null, arguments);
};

var _zend_stream_init_filename_ex = Module["_zend_stream_init_filename_ex"] = function() {
 return (_zend_stream_init_filename_ex = Module["_zend_stream_init_filename_ex"] = Module["asm"]["zend_stream_init_filename_ex"]).apply(null, arguments);
};

var _php_stream_open_for_zend_ex = Module["_php_stream_open_for_zend_ex"] = function() {
 return (_php_stream_open_for_zend_ex = Module["_php_stream_open_for_zend_ex"] = Module["asm"]["php_stream_open_for_zend_ex"]).apply(null, arguments);
};

var _zend_execute = Module["_zend_execute"] = function() {
 return (_zend_execute = Module["_zend_execute"] = Module["asm"]["zend_execute"]).apply(null, arguments);
};

var _destroy_op_array = Module["_destroy_op_array"] = function() {
 return (_destroy_op_array = Module["_destroy_op_array"] = Module["asm"]["destroy_op_array"]).apply(null, arguments);
};

var _zend_destroy_file_handle = Module["_zend_destroy_file_handle"] = function() {
 return (_zend_destroy_file_handle = Module["_zend_destroy_file_handle"] = Module["asm"]["zend_destroy_file_handle"]).apply(null, arguments);
};

var _zend_hash_internal_pointer_reset_ex = Module["_zend_hash_internal_pointer_reset_ex"] = function() {
 return (_zend_hash_internal_pointer_reset_ex = Module["_zend_hash_internal_pointer_reset_ex"] = Module["asm"]["zend_hash_internal_pointer_reset_ex"]).apply(null, arguments);
};

var _zend_hash_move_forward_ex = Module["_zend_hash_move_forward_ex"] = function() {
 return (_zend_hash_move_forward_ex = Module["_zend_hash_move_forward_ex"] = Module["asm"]["zend_hash_move_forward_ex"]).apply(null, arguments);
};

var _zend_hash_get_current_data_ex = Module["_zend_hash_get_current_data_ex"] = function() {
 return (_zend_hash_get_current_data_ex = Module["_zend_hash_get_current_data_ex"] = Module["asm"]["zend_hash_get_current_data_ex"]).apply(null, arguments);
};

var _zend_mangle_property_name = Module["_zend_mangle_property_name"] = function() {
 return (_zend_mangle_property_name = Module["_zend_mangle_property_name"] = Module["asm"]["zend_mangle_property_name"]).apply(null, arguments);
};

var _zend_get_callable_zval_from_fcc = Module["_zend_get_callable_zval_from_fcc"] = function() {
 return (_zend_get_callable_zval_from_fcc = Module["_zend_get_callable_zval_from_fcc"] = Module["asm"]["zend_get_callable_zval_from_fcc"]).apply(null, arguments);
};

var _zend_iterator_dtor = Module["_zend_iterator_dtor"] = function() {
 return (_zend_iterator_dtor = Module["_zend_iterator_dtor"] = Module["asm"]["zend_iterator_dtor"]).apply(null, arguments);
};

var _spl_iterator_apply = Module["_spl_iterator_apply"] = function() {
 return (_spl_iterator_apply = Module["_spl_iterator_apply"] = Module["asm"]["spl_iterator_apply"]).apply(null, arguments);
};

var _zend_array_to_list = Module["_zend_array_to_list"] = function() {
 return (_zend_array_to_list = Module["_zend_array_to_list"] = Module["asm"]["zend_array_to_list"]).apply(null, arguments);
};

var _zend_call_method = Module["_zend_call_method"] = function() {
 return (_zend_call_method = Module["_zend_call_method"] = Module["asm"]["zend_call_method"]).apply(null, arguments);
};

var _zend_call_known_instance_method_with_2_params = Module["_zend_call_known_instance_method_with_2_params"] = function() {
 return (_zend_call_known_instance_method_with_2_params = Module["_zend_call_known_instance_method_with_2_params"] = Module["asm"]["zend_call_known_instance_method_with_2_params"]).apply(null, arguments);
};

var _array_set_zval_key = Module["_array_set_zval_key"] = function() {
 return (_array_set_zval_key = Module["_array_set_zval_key"] = Module["asm"]["array_set_zval_key"]).apply(null, arguments);
};

var _zend_is_iterable = Module["_zend_is_iterable"] = function() {
 return (_zend_is_iterable = Module["_zend_is_iterable"] = Module["asm"]["zend_is_iterable"]).apply(null, arguments);
};

var _zend_hash_get_current_key_zval_ex = Module["_zend_hash_get_current_key_zval_ex"] = function() {
 return (_zend_hash_get_current_key_zval_ex = Module["_zend_hash_get_current_key_zval_ex"] = Module["asm"]["zend_hash_get_current_key_zval_ex"]).apply(null, arguments);
};

var _zend_proptable_to_symtable = Module["_zend_proptable_to_symtable"] = function() {
 return (_zend_proptable_to_symtable = Module["_zend_proptable_to_symtable"] = Module["asm"]["zend_proptable_to_symtable"]).apply(null, arguments);
};

var _zend_illegal_container_offset = Module["_zend_illegal_container_offset"] = function() {
 return (_zend_illegal_container_offset = Module["_zend_illegal_container_offset"] = Module["asm"]["zend_illegal_container_offset"]).apply(null, arguments);
};

var _zend_use_resource_as_offset = Module["_zend_use_resource_as_offset"] = function() {
 return (_zend_use_resource_as_offset = Module["_zend_use_resource_as_offset"] = Module["asm"]["zend_use_resource_as_offset"]).apply(null, arguments);
};

var _zend_incompatible_double_to_long_error = Module["_zend_incompatible_double_to_long_error"] = function() {
 return (_zend_incompatible_double_to_long_error = Module["_zend_incompatible_double_to_long_error"] = Module["asm"]["zend_incompatible_double_to_long_error"]).apply(null, arguments);
};

var _zend_hash_get_current_key_ex = Module["_zend_hash_get_current_key_ex"] = function() {
 return (_zend_hash_get_current_key_ex = Module["_zend_hash_get_current_key_ex"] = Module["asm"]["zend_hash_get_current_key_ex"]).apply(null, arguments);
};

var _zend_hash_iterator_del = Module["_zend_hash_iterator_del"] = function() {
 return (_zend_hash_iterator_del = Module["_zend_hash_iterator_del"] = Module["asm"]["zend_hash_iterator_del"]).apply(null, arguments);
};

var _zend_hash_get_current_key_type_ex = Module["_zend_hash_get_current_key_type_ex"] = function() {
 return (_zend_hash_get_current_key_type_ex = Module["_zend_hash_get_current_key_type_ex"] = Module["asm"]["zend_hash_get_current_key_type_ex"]).apply(null, arguments);
};

var _zend_hash_iterator_add = Module["_zend_hash_iterator_add"] = function() {
 return (_zend_hash_iterator_add = Module["_zend_hash_iterator_add"] = Module["asm"]["zend_hash_iterator_add"]).apply(null, arguments);
};

var _zend_hash_get_current_pos = Module["_zend_hash_get_current_pos"] = function() {
 return (_zend_hash_get_current_pos = Module["_zend_hash_get_current_pos"] = Module["asm"]["zend_hash_get_current_pos"]).apply(null, arguments);
};

var _zend_compare_symbol_tables = Module["_zend_compare_symbol_tables"] = function() {
 return (_zend_compare_symbol_tables = Module["_zend_compare_symbol_tables"] = Module["asm"]["zend_compare_symbol_tables"]).apply(null, arguments);
};

var _zend_get_property_info = Module["_zend_get_property_info"] = function() {
 return (_zend_get_property_info = Module["_zend_get_property_info"] = Module["asm"]["zend_get_property_info"]).apply(null, arguments);
};

var _zend_ref_add_type_source = Module["_zend_ref_add_type_source"] = function() {
 return (_zend_ref_add_type_source = Module["_zend_ref_add_type_source"] = Module["asm"]["zend_ref_add_type_source"]).apply(null, arguments);
};

var _spl_filesystem_object_get_path = Module["_spl_filesystem_object_get_path"] = function() {
 return (_spl_filesystem_object_get_path = Module["_spl_filesystem_object_get_path"] = Module["asm"]["spl_filesystem_object_get_path"]).apply(null, arguments);
};

var __php_glob_stream_get_path = Module["__php_glob_stream_get_path"] = function() {
 return (__php_glob_stream_get_path = Module["__php_glob_stream_get_path"] = Module["asm"]["_php_glob_stream_get_path"]).apply(null, arguments);
};

var __php_stream_seek = Module["__php_stream_seek"] = function() {
 return (__php_stream_seek = Module["__php_stream_seek"] = Module["asm"]["_php_stream_seek"]).apply(null, arguments);
};

var _php_basename = Module["_php_basename"] = function() {
 return (_php_basename = Module["_php_basename"] = Module["asm"]["php_basename"]).apply(null, arguments);
};

var _php_stat = Module["_php_stat"] = function() {
 return (_php_stat = Module["_php_stat"] = Module["asm"]["php_stat"]).apply(null, arguments);
};

var _expand_filepath_with_mode = Module["_expand_filepath_with_mode"] = function() {
 return (_expand_filepath_with_mode = Module["_expand_filepath_with_mode"] = Module["asm"]["expand_filepath_with_mode"]).apply(null, arguments);
};

var _readlink = Module["_readlink"] = function() {
 return (_readlink = Module["_readlink"] = Module["asm"]["readlink"]).apply(null, arguments);
};

var _tsrm_realpath = Module["_tsrm_realpath"] = function() {
 return (_tsrm_realpath = Module["_tsrm_realpath"] = Module["asm"]["tsrm_realpath"]).apply(null, arguments);
};

var _php_dirname = Module["_php_dirname"] = function() {
 return (_php_dirname = Module["_php_dirname"] = Module["asm"]["php_dirname"]).apply(null, arguments);
};

var __php_glob_stream_get_count = Module["__php_glob_stream_get_count"] = function() {
 return (__php_glob_stream_get_count = Module["__php_glob_stream_get_count"] = Module["asm"]["_php_glob_stream_get_count"]).apply(null, arguments);
};

var __php_stream_eof = Module["__php_stream_eof"] = function() {
 return (__php_stream_eof = Module["__php_stream_eof"] = Module["asm"]["_php_stream_eof"]).apply(null, arguments);
};

var _php_fputcsv = Module["_php_fputcsv"] = function() {
 return (_php_fputcsv = Module["_php_fputcsv"] = Module["asm"]["php_fputcsv"]).apply(null, arguments);
};

var _php_flock_common = Module["_php_flock_common"] = function() {
 return (_php_flock_common = Module["_php_flock_common"] = Module["asm"]["php_flock_common"]).apply(null, arguments);
};

var __php_stream_flush = Module["__php_stream_flush"] = function() {
 return (__php_stream_flush = Module["__php_stream_flush"] = Module["asm"]["_php_stream_flush"]).apply(null, arguments);
};

var __php_stream_tell = Module["__php_stream_tell"] = function() {
 return (__php_stream_tell = Module["__php_stream_tell"] = Module["asm"]["_php_stream_tell"]).apply(null, arguments);
};

var __php_stream_getc = Module["__php_stream_getc"] = function() {
 return (__php_stream_getc = Module["__php_stream_getc"] = Module["asm"]["_php_stream_getc"]).apply(null, arguments);
};

var __php_stream_passthru = Module["__php_stream_passthru"] = function() {
 return (__php_stream_passthru = Module["__php_stream_passthru"] = Module["asm"]["_php_stream_passthru"]).apply(null, arguments);
};

var _php_sscanf_internal = Module["_php_sscanf_internal"] = function() {
 return (_php_sscanf_internal = Module["_php_sscanf_internal"] = Module["asm"]["php_sscanf_internal"]).apply(null, arguments);
};

var _zend_wrong_param_count = Module["_zend_wrong_param_count"] = function() {
 return (_zend_wrong_param_count = Module["_zend_wrong_param_count"] = Module["asm"]["zend_wrong_param_count"]).apply(null, arguments);
};

var _php_stream_read_to_str = Module["_php_stream_read_to_str"] = function() {
 return (_php_stream_read_to_str = Module["_php_stream_read_to_str"] = Module["asm"]["php_stream_read_to_str"]).apply(null, arguments);
};

var _php_fstat = Module["_php_fstat"] = function() {
 return (_php_fstat = Module["_php_fstat"] = Module["asm"]["php_fstat"]).apply(null, arguments);
};

var __php_stream_set_option = Module["__php_stream_set_option"] = function() {
 return (__php_stream_set_option = Module["__php_stream_set_option"] = Module["asm"]["_php_stream_set_option"]).apply(null, arguments);
};

var __php_stream_truncate_set_size = Module["__php_stream_truncate_set_size"] = function() {
 return (__php_stream_truncate_set_size = Module["__php_stream_truncate_set_size"] = Module["asm"]["_php_stream_truncate_set_size"]).apply(null, arguments);
};

var __php_stream_opendir = Module["__php_stream_opendir"] = function() {
 return (__php_stream_opendir = Module["__php_stream_opendir"] = Module["asm"]["_php_stream_opendir"]).apply(null, arguments);
};

var __php_stream_readdir = Module["__php_stream_readdir"] = function() {
 return (__php_stream_readdir = Module["__php_stream_readdir"] = Module["asm"]["_php_stream_readdir"]).apply(null, arguments);
};

var _php_fgetcsv = Module["_php_fgetcsv"] = function() {
 return (_php_fgetcsv = Module["_php_fgetcsv"] = Module["asm"]["php_fgetcsv"]).apply(null, arguments);
};

var _php_bc_fgetcsv_empty_line = Module["_php_bc_fgetcsv_empty_line"] = function() {
 return (_php_bc_fgetcsv_empty_line = Module["_php_bc_fgetcsv_empty_line"] = Module["asm"]["php_bc_fgetcsv_empty_line"]).apply(null, arguments);
};

var _zend_objects_destroy_object = Module["_zend_objects_destroy_object"] = function() {
 return (_zend_objects_destroy_object = Module["_zend_objects_destroy_object"] = Module["asm"]["zend_objects_destroy_object"]).apply(null, arguments);
};

var _php_count_recursive = Module["_php_count_recursive"] = function() {
 return (_php_count_recursive = Module["_php_count_recursive"] = Module["asm"]["php_count_recursive"]).apply(null, arguments);
};

var _var_push_dtor = Module["_var_push_dtor"] = function() {
 return (_var_push_dtor = Module["_var_push_dtor"] = Module["asm"]["var_push_dtor"]).apply(null, arguments);
};

var _var_replace = Module["_var_replace"] = function() {
 return (_var_replace = Module["_var_replace"] = Module["asm"]["var_replace"]).apply(null, arguments);
};

var _zend_hash_index_lookup = Module["_zend_hash_index_lookup"] = function() {
 return (_zend_hash_index_lookup = Module["_zend_hash_index_lookup"] = Module["asm"]["zend_hash_index_lookup"]).apply(null, arguments);
};

var _zend_is_identical = Module["_zend_is_identical"] = function() {
 return (_zend_is_identical = Module["_zend_is_identical"] = Module["asm"]["zend_is_identical"]).apply(null, arguments);
};

var _zend_hash_compare = Module["_zend_hash_compare"] = function() {
 return (_zend_hash_compare = Module["_zend_hash_compare"] = Module["asm"]["zend_hash_compare"]).apply(null, arguments);
};

var _zend_compare = Module["_zend_compare"] = function() {
 return (_zend_compare = Module["_zend_compare"] = Module["asm"]["zend_compare"]).apply(null, arguments);
};

var _zend_std_read_dimension = Module["_zend_std_read_dimension"] = function() {
 return (_zend_std_read_dimension = Module["_zend_std_read_dimension"] = Module["asm"]["zend_std_read_dimension"]).apply(null, arguments);
};

var _zend_std_write_dimension = Module["_zend_std_write_dimension"] = function() {
 return (_zend_std_write_dimension = Module["_zend_std_write_dimension"] = Module["asm"]["zend_std_write_dimension"]).apply(null, arguments);
};

var _zend_std_has_dimension = Module["_zend_std_has_dimension"] = function() {
 return (_zend_std_has_dimension = Module["_zend_std_has_dimension"] = Module["asm"]["zend_std_has_dimension"]).apply(null, arguments);
};

var _zend_std_unset_dimension = Module["_zend_std_unset_dimension"] = function() {
 return (_zend_std_unset_dimension = Module["_zend_std_unset_dimension"] = Module["asm"]["zend_std_unset_dimension"]).apply(null, arguments);
};

var __safe_erealloc = Module["__safe_erealloc"] = function() {
 return (__safe_erealloc = Module["__safe_erealloc"] = Module["asm"]["_safe_erealloc"]).apply(null, arguments);
};

var _zend_user_it_invalidate_current = Module["_zend_user_it_invalidate_current"] = function() {
 return (_zend_user_it_invalidate_current = Module["_zend_user_it_invalidate_current"] = Module["asm"]["zend_user_it_invalidate_current"]).apply(null, arguments);
};

var _strtoul = Module["_strtoul"] = function() {
 return (_strtoul = Module["_strtoul"] = Module["asm"]["strtoul"]).apply(null, arguments);
};

var _strcspn = Module["_strcspn"] = function() {
 return (_strcspn = Module["_strcspn"] = Module["asm"]["strcspn"]).apply(null, arguments);
};

var _realloc = Module["_realloc"] = function() {
 return (_realloc = Module["_realloc"] = Module["asm"]["realloc"]).apply(null, arguments);
};

var _strcat = Module["_strcat"] = function() {
 return (_strcat = Module["_strcat"] = Module["asm"]["strcat"]).apply(null, arguments);
};

var _zend_hash_minmax = Module["_zend_hash_minmax"] = function() {
 return (_zend_hash_minmax = Module["_zend_hash_minmax"] = Module["asm"]["zend_hash_minmax"]).apply(null, arguments);
};

var _php_prefix_varname = Module["_php_prefix_varname"] = function() {
 return (_php_prefix_varname = Module["_php_prefix_varname"] = Module["asm"]["php_prefix_varname"]).apply(null, arguments);
};

var _zend_rebuild_symbol_table = Module["_zend_rebuild_symbol_table"] = function() {
 return (_zend_rebuild_symbol_table = Module["_zend_rebuild_symbol_table"] = Module["asm"]["zend_rebuild_symbol_table"]).apply(null, arguments);
};

var _zend_hash_real_init_packed = Module["_zend_hash_real_init_packed"] = function() {
 return (_zend_hash_real_init_packed = Module["_zend_hash_real_init_packed"] = Module["asm"]["zend_hash_real_init_packed"]).apply(null, arguments);
};

var __php_math_round = Module["__php_math_round"] = function() {
 return (__php_math_round = Module["__php_math_round"] = Module["asm"]["_php_math_round"]).apply(null, arguments);
};

var _zend_hash_to_packed = Module["_zend_hash_to_packed"] = function() {
 return (_zend_hash_to_packed = Module["_zend_hash_to_packed"] = Module["asm"]["zend_hash_to_packed"]).apply(null, arguments);
};

var _zend_hash_iterators_lower_pos = Module["_zend_hash_iterators_lower_pos"] = function() {
 return (_zend_hash_iterators_lower_pos = Module["_zend_hash_iterators_lower_pos"] = Module["asm"]["zend_hash_iterators_lower_pos"]).apply(null, arguments);
};

var _zend_hash_packed_del_val = Module["_zend_hash_packed_del_val"] = function() {
 return (_zend_hash_packed_del_val = Module["_zend_hash_packed_del_val"] = Module["asm"]["zend_hash_packed_del_val"]).apply(null, arguments);
};

var _zend_hash_iterators_advance = Module["_zend_hash_iterators_advance"] = function() {
 return (_zend_hash_iterators_advance = Module["_zend_hash_iterators_advance"] = Module["asm"]["zend_hash_iterators_advance"]).apply(null, arguments);
};

var _convert_to_array = Module["_convert_to_array"] = function() {
 return (_convert_to_array = Module["_convert_to_array"] = Module["asm"]["convert_to_array"]).apply(null, arguments);
};

var _php_array_merge_recursive = Module["_php_array_merge_recursive"] = function() {
 return (_php_array_merge_recursive = Module["_php_array_merge_recursive"] = Module["asm"]["php_array_merge_recursive"]).apply(null, arguments);
};

var _zend_hash_find_known_hash = Module["_zend_hash_find_known_hash"] = function() {
 return (_zend_hash_find_known_hash = Module["_zend_hash_find_known_hash"] = Module["asm"]["zend_hash_find_known_hash"]).apply(null, arguments);
};

var _zend_cannot_add_element = Module["_zend_cannot_add_element"] = function() {
 return (_zend_cannot_add_element = Module["_zend_cannot_add_element"] = Module["asm"]["zend_cannot_add_element"]).apply(null, arguments);
};

var _php_array_merge = Module["_php_array_merge"] = function() {
 return (_php_array_merge = Module["_php_array_merge"] = Module["asm"]["php_array_merge"]).apply(null, arguments);
};

var _zend_hash_extend = Module["_zend_hash_extend"] = function() {
 return (_zend_hash_extend = Module["_zend_hash_extend"] = Module["asm"]["zend_hash_extend"]).apply(null, arguments);
};

var _php_array_replace_recursive = Module["_php_array_replace_recursive"] = function() {
 return (_php_array_replace_recursive = Module["_php_array_replace_recursive"] = Module["asm"]["php_array_replace_recursive"]).apply(null, arguments);
};

var _zend_hash_internal_pointer_end_ex = Module["_zend_hash_internal_pointer_end_ex"] = function() {
 return (_zend_hash_internal_pointer_end_ex = Module["_zend_hash_internal_pointer_end_ex"] = Module["asm"]["zend_hash_internal_pointer_end_ex"]).apply(null, arguments);
};

var _zend_hash_add_empty_element = Module["_zend_hash_add_empty_element"] = function() {
 return (_zend_hash_add_empty_element = Module["_zend_hash_add_empty_element"] = Module["asm"]["zend_hash_add_empty_element"]).apply(null, arguments);
};

var _zend_sort = Module["_zend_sort"] = function() {
 return (_zend_sort = Module["_zend_sort"] = Module["asm"]["zend_sort"]).apply(null, arguments);
};

var _php_multisort_compare = Module["_php_multisort_compare"] = function() {
 return (_php_multisort_compare = Module["_php_multisort_compare"] = Module["asm"]["php_multisort_compare"]).apply(null, arguments);
};

var _add_function = Module["_add_function"] = function() {
 return (_add_function = Module["_add_function"] = Module["asm"]["add_function"]).apply(null, arguments);
};

var _mul_function = Module["_mul_function"] = function() {
 return (_mul_function = Module["_mul_function"] = Module["asm"]["mul_function"]).apply(null, arguments);
};

var _zend_hash_real_init = Module["_zend_hash_real_init"] = function() {
 return (_zend_hash_real_init = Module["_zend_hash_real_init"] = Module["asm"]["zend_hash_real_init"]).apply(null, arguments);
};

var _zend_binary_strcasecmp_l = Module["_zend_binary_strcasecmp_l"] = function() {
 return (_zend_binary_strcasecmp_l = Module["_zend_binary_strcasecmp_l"] = Module["asm"]["zend_binary_strcasecmp_l"]).apply(null, arguments);
};

var _zend_binary_strcmp = Module["_zend_binary_strcmp"] = function() {
 return (_zend_binary_strcmp = Module["_zend_binary_strcmp"] = Module["asm"]["zend_binary_strcmp"]).apply(null, arguments);
};

var _strnatcmp_ex = Module["_strnatcmp_ex"] = function() {
 return (_strnatcmp_ex = Module["_strnatcmp_ex"] = Module["asm"]["strnatcmp_ex"]).apply(null, arguments);
};

var _strcoll = Module["_strcoll"] = function() {
 return (_strcoll = Module["_strcoll"] = Module["asm"]["strcoll"]).apply(null, arguments);
};

var _zendi_smart_strcmp = Module["_zendi_smart_strcmp"] = function() {
 return (_zendi_smart_strcmp = Module["_zendi_smart_strcmp"] = Module["asm"]["zendi_smart_strcmp"]).apply(null, arguments);
};

var _zend_hash_sort_ex = Module["_zend_hash_sort_ex"] = function() {
 return (_zend_hash_sort_ex = Module["_zend_hash_sort_ex"] = Module["asm"]["zend_hash_sort_ex"]).apply(null, arguments);
};

var _numeric_compare_function = Module["_numeric_compare_function"] = function() {
 return (_numeric_compare_function = Module["_numeric_compare_function"] = Module["asm"]["numeric_compare_function"]).apply(null, arguments);
};

var _string_case_compare_function = Module["_string_case_compare_function"] = function() {
 return (_string_case_compare_function = Module["_string_case_compare_function"] = Module["asm"]["string_case_compare_function"]).apply(null, arguments);
};

var _string_compare_function = Module["_string_compare_function"] = function() {
 return (_string_compare_function = Module["_string_compare_function"] = Module["asm"]["string_compare_function"]).apply(null, arguments);
};

var _string_locale_compare_function = Module["_string_locale_compare_function"] = function() {
 return (_string_locale_compare_function = Module["_string_locale_compare_function"] = Module["asm"]["string_locale_compare_function"]).apply(null, arguments);
};

var _zend_hash_move_backwards_ex = Module["_zend_hash_move_backwards_ex"] = function() {
 return (_zend_hash_move_backwards_ex = Module["_zend_hash_move_backwards_ex"] = Module["asm"]["zend_hash_move_backwards_ex"]).apply(null, arguments);
};

var _zend_hash_iterator_pos_ex = Module["_zend_hash_iterator_pos_ex"] = function() {
 return (_zend_hash_iterator_pos_ex = Module["_zend_hash_iterator_pos_ex"] = Module["asm"]["zend_hash_iterator_pos_ex"]).apply(null, arguments);
};

var _zend_hash_iterator_pos = Module["_zend_hash_iterator_pos"] = function() {
 return (_zend_hash_iterator_pos = Module["_zend_hash_iterator_pos"] = Module["asm"]["zend_hash_iterator_pos"]).apply(null, arguments);
};

var _zendi_smart_streq = Module["_zendi_smart_streq"] = function() {
 return (_zendi_smart_streq = Module["_zendi_smart_streq"] = Module["asm"]["zendi_smart_streq"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_zval_ex = Module["_zend_try_assign_typed_ref_zval_ex"] = function() {
 return (_zend_try_assign_typed_ref_zval_ex = Module["_zend_try_assign_typed_ref_zval_ex"] = Module["asm"]["zend_try_assign_typed_ref_zval_ex"]).apply(null, arguments);
};

var _zend_get_this_object = Module["_zend_get_this_object"] = function() {
 return (_zend_get_this_object = Module["_zend_get_this_object"] = Module["asm"]["zend_get_this_object"]).apply(null, arguments);
};

var _zend_parse_arg_number_or_str_slow = Module["_zend_parse_arg_number_or_str_slow"] = function() {
 return (_zend_parse_arg_number_or_str_slow = Module["_zend_parse_arg_number_or_str_slow"] = Module["asm"]["zend_parse_arg_number_or_str_slow"]).apply(null, arguments);
};

var _zend_parse_arg_number_slow = Module["_zend_parse_arg_number_slow"] = function() {
 return (_zend_parse_arg_number_slow = Module["_zend_parse_arg_number_slow"] = Module["asm"]["zend_parse_arg_number_slow"]).apply(null, arguments);
};

var _get_active_function_arg_name = Module["_get_active_function_arg_name"] = function() {
 return (_get_active_function_arg_name = Module["_get_active_function_arg_name"] = Module["asm"]["get_active_function_arg_name"]).apply(null, arguments);
};

var __zend_hash_iterators_update = Module["__zend_hash_iterators_update"] = function() {
 return (__zend_hash_iterators_update = Module["__zend_hash_iterators_update"] = Module["asm"]["_zend_hash_iterators_update"]).apply(null, arguments);
};

var _zend_hash_merge = Module["_zend_hash_merge"] = function() {
 return (_zend_hash_merge = Module["_zend_hash_merge"] = Module["asm"]["zend_hash_merge"]).apply(null, arguments);
};

var _zend_string_toupper_ex = Module["_zend_string_toupper_ex"] = function() {
 return (_zend_string_toupper_ex = Module["_zend_string_toupper_ex"] = Module["asm"]["zend_string_toupper_ex"]).apply(null, arguments);
};

var _zend_hash_bucket_swap = Module["_zend_hash_bucket_swap"] = function() {
 return (_zend_hash_bucket_swap = Module["_zend_hash_bucket_swap"] = Module["asm"]["zend_hash_bucket_swap"]).apply(null, arguments);
};

var _zend_string_hash_func = Module["_zend_string_hash_func"] = function() {
 return (_zend_string_hash_func = Module["_zend_string_hash_func"] = Module["asm"]["zend_string_hash_func"]).apply(null, arguments);
};

var _php_base64_encode = Module["_php_base64_encode"] = function() {
 return (_php_base64_encode = Module["_php_base64_encode"] = Module["asm"]["php_base64_encode"]).apply(null, arguments);
};

var _php_base64_decode_ex = Module["_php_base64_decode_ex"] = function() {
 return (_php_base64_decode_ex = Module["_php_base64_decode_ex"] = Module["asm"]["php_base64_decode_ex"]).apply(null, arguments);
};

var _php_get_nan = Module["_php_get_nan"] = function() {
 return (_php_get_nan = Module["_php_get_nan"] = Module["asm"]["php_get_nan"]).apply(null, arguments);
};

var _php_get_inf = Module["_php_get_inf"] = function() {
 return (_php_get_inf = Module["_php_get_inf"] = Module["asm"]["php_get_inf"]).apply(null, arguments);
};

var _php_register_incomplete_class_handlers = Module["_php_register_incomplete_class_handlers"] = function() {
 return (_php_register_incomplete_class_handlers = Module["_php_register_incomplete_class_handlers"] = Module["asm"]["php_register_incomplete_class_handlers"]).apply(null, arguments);
};

var _php_register_url_stream_wrapper = Module["_php_register_url_stream_wrapper"] = function() {
 return (_php_register_url_stream_wrapper = Module["_php_register_url_stream_wrapper"] = Module["asm"]["php_register_url_stream_wrapper"]).apply(null, arguments);
};

var _php_unregister_url_stream_wrapper = Module["_php_unregister_url_stream_wrapper"] = function() {
 return (_php_unregister_url_stream_wrapper = Module["_php_unregister_url_stream_wrapper"] = Module["asm"]["php_unregister_url_stream_wrapper"]).apply(null, arguments);
};

var _umask = Module["_umask"] = function() {
 return (_umask = Module["_umask"] = Module["asm"]["umask"]).apply(null, arguments);
};

var _setlocale = Module["_setlocale"] = function() {
 return (_setlocale = Module["_setlocale"] = Module["asm"]["setlocale"]).apply(null, arguments);
};

var _zend_reset_lc_ctype_locale = Module["_zend_reset_lc_ctype_locale"] = function() {
 return (_zend_reset_lc_ctype_locale = Module["_zend_reset_lc_ctype_locale"] = Module["asm"]["zend_reset_lc_ctype_locale"]).apply(null, arguments);
};

var _zend_update_current_locale = Module["_zend_update_current_locale"] = function() {
 return (_zend_update_current_locale = Module["_zend_update_current_locale"] = Module["asm"]["zend_update_current_locale"]).apply(null, arguments);
};

var _zend_llist_destroy = Module["_zend_llist_destroy"] = function() {
 return (_zend_llist_destroy = Module["_zend_llist_destroy"] = Module["asm"]["zend_llist_destroy"]).apply(null, arguments);
};

var _zend_get_executed_scope = Module["_zend_get_executed_scope"] = function() {
 return (_zend_get_executed_scope = Module["_zend_get_executed_scope"] = Module["asm"]["zend_get_executed_scope"]).apply(null, arguments);
};

var _zend_get_constant_ex = Module["_zend_get_constant_ex"] = function() {
 return (_zend_get_constant_ex = Module["_zend_get_constant_ex"] = Module["asm"]["zend_get_constant_ex"]).apply(null, arguments);
};

var _inet_ntop = Module["_inet_ntop"] = function() {
 return (_inet_ntop = Module["_inet_ntop"] = Module["asm"]["inet_ntop"]).apply(null, arguments);
};

var _inet_pton = Module["_inet_pton"] = function() {
 return (_inet_pton = Module["_inet_pton"] = Module["asm"]["inet_pton"]).apply(null, arguments);
};

var _ntohl = Module["_ntohl"] = function() {
 return (_ntohl = Module["_ntohl"] = Module["asm"]["ntohl"]).apply(null, arguments);
};

var _htonl = function() {
 return (_htonl = Module["asm"]["htonl"]).apply(null, arguments);
};

var _php_getenv = Module["_php_getenv"] = function() {
 return (_php_getenv = Module["_php_getenv"] = Module["asm"]["php_getenv"]).apply(null, arguments);
};

var _getenv = Module["_getenv"] = function() {
 return (_getenv = Module["_getenv"] = Module["asm"]["getenv"]).apply(null, arguments);
};

var _sapi_getenv = Module["_sapi_getenv"] = function() {
 return (_sapi_getenv = Module["_sapi_getenv"] = Module["asm"]["sapi_getenv"]).apply(null, arguments);
};

var _zend_strndup = Module["_zend_strndup"] = function() {
 return (_zend_strndup = Module["_zend_strndup"] = Module["asm"]["zend_strndup"]).apply(null, arguments);
};

var _unsetenv = Module["_unsetenv"] = function() {
 return (_unsetenv = Module["_unsetenv"] = Module["asm"]["unsetenv"]).apply(null, arguments);
};

var _tzset = Module["_tzset"] = function() {
 return (_tzset = Module["_tzset"] = Module["asm"]["tzset"]).apply(null, arguments);
};

var _zend_is_auto_global = Module["_zend_is_auto_global"] = function() {
 return (_zend_is_auto_global = Module["_zend_is_auto_global"] = Module["asm"]["zend_is_auto_global"]).apply(null, arguments);
};

var _php_getopt = Module["_php_getopt"] = function() {
 return (_php_getopt = Module["_php_getopt"] = Module["asm"]["php_getopt"]).apply(null, arguments);
};

var _atoi = Module["_atoi"] = function() {
 return (_atoi = Module["_atoi"] = Module["asm"]["atoi"]).apply(null, arguments);
};

var _sapi_flush = Module["_sapi_flush"] = function() {
 return (_sapi_flush = Module["_sapi_flush"] = Module["asm"]["sapi_flush"]).apply(null, arguments);
};

var _sleep = function() {
 return (_sleep = Module["asm"]["sleep"]).apply(null, arguments);
};

var _usleep = Module["_usleep"] = function() {
 return (_usleep = Module["_usleep"] = Module["asm"]["usleep"]).apply(null, arguments);
};

var _nanosleep = Module["_nanosleep"] = function() {
 return (_nanosleep = Module["_nanosleep"] = Module["asm"]["nanosleep"]).apply(null, arguments);
};

var _php_get_current_user = Module["_php_get_current_user"] = function() {
 return (_php_get_current_user = Module["_php_get_current_user"] = Module["asm"]["php_get_current_user"]).apply(null, arguments);
};

var _cfg_get_entry_ex = Module["_cfg_get_entry_ex"] = function() {
 return (_cfg_get_entry_ex = Module["_cfg_get_entry_ex"] = Module["asm"]["cfg_get_entry_ex"]).apply(null, arguments);
};

var __php_error_log_ex = Module["__php_error_log_ex"] = function() {
 return (__php_error_log_ex = Module["__php_error_log_ex"] = Module["asm"]["_php_error_log_ex"]).apply(null, arguments);
};

var __php_error_log = Module["__php_error_log"] = function() {
 return (__php_error_log = Module["__php_error_log"] = Module["asm"]["_php_error_log"]).apply(null, arguments);
};

var _php_mail = Module["_php_mail"] = function() {
 return (_php_mail = Module["_php_mail"] = Module["asm"]["php_mail"]).apply(null, arguments);
};

var _php_log_err_with_severity = Module["_php_log_err_with_severity"] = function() {
 return (_php_log_err_with_severity = Module["_php_log_err_with_severity"] = Module["asm"]["php_log_err_with_severity"]).apply(null, arguments);
};

var _zend_get_called_scope = Module["_zend_get_called_scope"] = function() {
 return (_zend_get_called_scope = Module["_zend_get_called_scope"] = Module["asm"]["zend_get_called_scope"]).apply(null, arguments);
};

var _php_call_shutdown_functions = Module["_php_call_shutdown_functions"] = function() {
 return (_php_call_shutdown_functions = Module["_php_call_shutdown_functions"] = Module["asm"]["php_call_shutdown_functions"]).apply(null, arguments);
};

var _zend_hash_apply = Module["_zend_hash_apply"] = function() {
 return (_zend_hash_apply = Module["_zend_hash_apply"] = Module["asm"]["zend_hash_apply"]).apply(null, arguments);
};

var _php_free_shutdown_functions = Module["_php_free_shutdown_functions"] = function() {
 return (_php_free_shutdown_functions = Module["_php_free_shutdown_functions"] = Module["asm"]["php_free_shutdown_functions"]).apply(null, arguments);
};

var _zend_fcall_info_argp = Module["_zend_fcall_info_argp"] = function() {
 return (_zend_fcall_info_argp = Module["_zend_fcall_info_argp"] = Module["asm"]["zend_fcall_info_argp"]).apply(null, arguments);
};

var _php_get_highlight_struct = Module["_php_get_highlight_struct"] = function() {
 return (_php_get_highlight_struct = Module["_php_get_highlight_struct"] = Module["asm"]["php_get_highlight_struct"]).apply(null, arguments);
};

var _zend_ini_string_ex = Module["_zend_ini_string_ex"] = function() {
 return (_zend_ini_string_ex = Module["_zend_ini_string_ex"] = Module["asm"]["zend_ini_string_ex"]).apply(null, arguments);
};

var _php_output_start_default = Module["_php_output_start_default"] = function() {
 return (_php_output_start_default = Module["_php_output_start_default"] = Module["asm"]["php_output_start_default"]).apply(null, arguments);
};

var _highlight_file = Module["_highlight_file"] = function() {
 return (_highlight_file = Module["_highlight_file"] = Module["asm"]["highlight_file"]).apply(null, arguments);
};

var _php_output_end = Module["_php_output_end"] = function() {
 return (_php_output_end = Module["_php_output_end"] = Module["asm"]["php_output_end"]).apply(null, arguments);
};

var _php_output_get_contents = Module["_php_output_get_contents"] = function() {
 return (_php_output_get_contents = Module["_php_output_get_contents"] = Module["asm"]["php_output_get_contents"]).apply(null, arguments);
};

var _php_output_discard = Module["_php_output_discard"] = function() {
 return (_php_output_discard = Module["_php_output_discard"] = Module["asm"]["php_output_discard"]).apply(null, arguments);
};

var _zend_save_lexical_state = Module["_zend_save_lexical_state"] = function() {
 return (_zend_save_lexical_state = Module["_zend_save_lexical_state"] = Module["asm"]["zend_save_lexical_state"]).apply(null, arguments);
};

var _open_file_for_scanning = Module["_open_file_for_scanning"] = function() {
 return (_open_file_for_scanning = Module["_open_file_for_scanning"] = Module["asm"]["open_file_for_scanning"]).apply(null, arguments);
};

var _zend_restore_lexical_state = Module["_zend_restore_lexical_state"] = function() {
 return (_zend_restore_lexical_state = Module["_zend_restore_lexical_state"] = Module["asm"]["zend_restore_lexical_state"]).apply(null, arguments);
};

var _zend_strip = Module["_zend_strip"] = function() {
 return (_zend_strip = Module["_zend_strip"] = Module["asm"]["zend_strip"]).apply(null, arguments);
};

var _zend_make_compiled_string_description = Module["_zend_make_compiled_string_description"] = function() {
 return (_zend_make_compiled_string_description = Module["_zend_make_compiled_string_description"] = Module["asm"]["zend_make_compiled_string_description"]).apply(null, arguments);
};

var _highlight_string = Module["_highlight_string"] = function() {
 return (_highlight_string = Module["_highlight_string"] = Module["asm"]["highlight_string"]).apply(null, arguments);
};

var _zend_ini_parse_quantity = Module["_zend_ini_parse_quantity"] = function() {
 return (_zend_ini_parse_quantity = Module["_zend_ini_parse_quantity"] = Module["asm"]["zend_ini_parse_quantity"]).apply(null, arguments);
};

var _zend_ini_get_value = Module["_zend_ini_get_value"] = function() {
 return (_zend_ini_get_value = Module["_zend_ini_get_value"] = Module["asm"]["zend_ini_get_value"]).apply(null, arguments);
};

var _zend_ini_sort_entries = Module["_zend_ini_sort_entries"] = function() {
 return (_zend_ini_sort_entries = Module["_zend_ini_sort_entries"] = Module["asm"]["zend_ini_sort_entries"]).apply(null, arguments);
};

var _zend_restore_ini_entry = Module["_zend_restore_ini_entry"] = function() {
 return (_zend_restore_ini_entry = Module["_zend_restore_ini_entry"] = Module["asm"]["zend_restore_ini_entry"]).apply(null, arguments);
};

var _zend_print_zval_r_to_str = Module["_zend_print_zval_r_to_str"] = function() {
 return (_zend_print_zval_r_to_str = Module["_zend_print_zval_r_to_str"] = Module["asm"]["zend_print_zval_r_to_str"]).apply(null, arguments);
};

var _zend_print_zval_r = Module["_zend_print_zval_r"] = function() {
 return (_zend_print_zval_r = Module["_zend_print_zval_r"] = Module["asm"]["zend_print_zval_r"]).apply(null, arguments);
};

var _getservbyname = Module["_getservbyname"] = function() {
 return (_getservbyname = Module["_getservbyname"] = Module["asm"]["getservbyname"]).apply(null, arguments);
};

var _ntohs = function() {
 return (_ntohs = Module["asm"]["ntohs"]).apply(null, arguments);
};

var _getservbyport = Module["_getservbyport"] = function() {
 return (_getservbyport = Module["_getservbyport"] = Module["asm"]["getservbyport"]).apply(null, arguments);
};

var _htons = function() {
 return (_htons = Module["asm"]["htons"]).apply(null, arguments);
};

var _zend_llist_init = Module["_zend_llist_init"] = function() {
 return (_zend_llist_init = Module["_zend_llist_init"] = Module["asm"]["zend_llist_init"]).apply(null, arguments);
};

var _php_add_tick_function = Module["_php_add_tick_function"] = function() {
 return (_php_add_tick_function = Module["_php_add_tick_function"] = Module["asm"]["php_add_tick_function"]).apply(null, arguments);
};

var _zend_llist_add_element = Module["_zend_llist_add_element"] = function() {
 return (_zend_llist_add_element = Module["_zend_llist_add_element"] = Module["asm"]["zend_llist_add_element"]).apply(null, arguments);
};

var _zend_llist_del_element = Module["_zend_llist_del_element"] = function() {
 return (_zend_llist_del_element = Module["_zend_llist_del_element"] = Module["asm"]["zend_llist_del_element"]).apply(null, arguments);
};

var _rename = Module["_rename"] = function() {
 return (_rename = Module["_rename"] = Module["asm"]["rename"]).apply(null, arguments);
};

var _chmod = Module["_chmod"] = function() {
 return (_chmod = Module["_chmod"] = Module["asm"]["chmod"]).apply(null, arguments);
};

var _php_copy_file_ex = Module["_php_copy_file_ex"] = function() {
 return (_php_copy_file_ex = Module["_php_copy_file_ex"] = Module["asm"]["php_copy_file_ex"]).apply(null, arguments);
};

var _zend_parse_ini_file = Module["_zend_parse_ini_file"] = function() {
 return (_zend_parse_ini_file = Module["_zend_parse_ini_file"] = Module["asm"]["zend_parse_ini_file"]).apply(null, arguments);
};

var _zend_parse_ini_string = Module["_zend_parse_ini_string"] = function() {
 return (_zend_parse_ini_string = Module["_zend_parse_ini_string"] = Module["asm"]["zend_parse_ini_string"]).apply(null, arguments);
};

var _add_index_double = Module["_add_index_double"] = function() {
 return (_add_index_double = Module["_add_index_double"] = Module["asm"]["add_index_double"]).apply(null, arguments);
};

var _zif_rewind = Module["_zif_rewind"] = function() {
 return (_zif_rewind = Module["_zif_rewind"] = Module["asm"]["zif_rewind"]).apply(null, arguments);
};

var _zif_fclose = Module["_zif_fclose"] = function() {
 return (_zif_fclose = Module["_zif_fclose"] = Module["asm"]["zif_fclose"]).apply(null, arguments);
};

var _zif_feof = Module["_zif_feof"] = function() {
 return (_zif_feof = Module["_zif_feof"] = Module["asm"]["zif_feof"]).apply(null, arguments);
};

var _zif_fgetc = Module["_zif_fgetc"] = function() {
 return (_zif_fgetc = Module["_zif_fgetc"] = Module["asm"]["zif_fgetc"]).apply(null, arguments);
};

var _zif_fgets = Module["_zif_fgets"] = function() {
 return (_zif_fgets = Module["_zif_fgets"] = Module["asm"]["zif_fgets"]).apply(null, arguments);
};

var _zif_fread = Module["_zif_fread"] = function() {
 return (_zif_fread = Module["_zif_fread"] = Module["asm"]["zif_fread"]).apply(null, arguments);
};

var _zif_fpassthru = Module["_zif_fpassthru"] = function() {
 return (_zif_fpassthru = Module["_zif_fpassthru"] = Module["asm"]["zif_fpassthru"]).apply(null, arguments);
};

var _zif_fseek = Module["_zif_fseek"] = function() {
 return (_zif_fseek = Module["_zif_fseek"] = Module["asm"]["zif_fseek"]).apply(null, arguments);
};

var _zif_ftell = Module["_zif_ftell"] = function() {
 return (_zif_ftell = Module["_zif_ftell"] = Module["asm"]["zif_ftell"]).apply(null, arguments);
};

var _zif_fflush = Module["_zif_fflush"] = function() {
 return (_zif_fflush = Module["_zif_fflush"] = Module["asm"]["zif_fflush"]).apply(null, arguments);
};

var _zif_fwrite = Module["_zif_fwrite"] = function() {
 return (_zif_fwrite = Module["_zif_fwrite"] = Module["asm"]["zif_fwrite"]).apply(null, arguments);
};

var _zend_register_double_constant = Module["_zend_register_double_constant"] = function() {
 return (_zend_register_double_constant = Module["_zend_register_double_constant"] = Module["asm"]["zend_register_double_constant"]).apply(null, arguments);
};

var _zend_llist_apply = Module["_zend_llist_apply"] = function() {
 return (_zend_llist_apply = Module["_zend_llist_apply"] = Module["asm"]["zend_llist_apply"]).apply(null, arguments);
};

var _zend_binary_zval_strcmp = Module["_zend_binary_zval_strcmp"] = function() {
 return (_zend_binary_zval_strcmp = Module["_zend_binary_zval_strcmp"] = Module["asm"]["zend_binary_zval_strcmp"]).apply(null, arguments);
};

var _zend_compare_arrays = Module["_zend_compare_arrays"] = function() {
 return (_zend_compare_arrays = Module["_zend_compare_arrays"] = Module["asm"]["zend_compare_arrays"]).apply(null, arguments);
};

var _zend_compare_objects = Module["_zend_compare_objects"] = function() {
 return (_zend_compare_objects = Module["_zend_compare_objects"] = Module["asm"]["zend_compare_objects"]).apply(null, arguments);
};

var _object_and_properties_init = Module["_object_and_properties_init"] = function() {
 return (_object_and_properties_init = Module["_object_and_properties_init"] = Module["asm"]["object_and_properties_init"]).apply(null, arguments);
};

var _fopen = Module["_fopen"] = function() {
 return (_fopen = Module["_fopen"] = Module["asm"]["fopen"]).apply(null, arguments);
};

var _zend_stream_init_fp = Module["_zend_stream_init_fp"] = function() {
 return (_zend_stream_init_fp = Module["_zend_stream_init_fp"] = Module["asm"]["zend_stream_init_fp"]).apply(null, arguments);
};

var __safe_realloc = Module["__safe_realloc"] = function() {
 return (__safe_realloc = Module["__safe_realloc"] = Module["asm"]["_safe_realloc"]).apply(null, arguments);
};

var _zend_memnstr_ex = Module["_zend_memnstr_ex"] = function() {
 return (_zend_memnstr_ex = Module["_zend_memnstr_ex"] = Module["asm"]["zend_memnstr_ex"]).apply(null, arguments);
};

var _php_crc32_bulk_update = Module["_php_crc32_bulk_update"] = function() {
 return (_php_crc32_bulk_update = Module["_php_crc32_bulk_update"] = Module["asm"]["php_crc32_bulk_update"]).apply(null, arguments);
};

var _php_crc32_stream_bulk_update = Module["_php_crc32_stream_bulk_update"] = function() {
 return (_php_crc32_stream_bulk_update = Module["_php_crc32_stream_bulk_update"] = Module["asm"]["php_crc32_stream_bulk_update"]).apply(null, arguments);
};

var _php_crypt = Module["_php_crypt"] = function() {
 return (_php_crypt = Module["_php_crypt"] = Module["asm"]["php_crypt"]).apply(null, arguments);
};

var _php_std_date = Module["_php_std_date"] = function() {
 return (_php_std_date = Module["_php_std_date"] = Module["asm"]["php_std_date"]).apply(null, arguments);
};

var _zend_fetch_resource = Module["_zend_fetch_resource"] = function() {
 return (_zend_fetch_resource = Module["_zend_fetch_resource"] = Module["asm"]["zend_fetch_resource"]).apply(null, arguments);
};

var _chroot = Module["_chroot"] = function() {
 return (_chroot = Module["_chroot"] = Module["asm"]["chroot"]).apply(null, arguments);
};

var _php_clear_stat_cache = Module["_php_clear_stat_cache"] = function() {
 return (_php_clear_stat_cache = Module["_php_clear_stat_cache"] = Module["asm"]["php_clear_stat_cache"]).apply(null, arguments);
};

var _chdir = Module["_chdir"] = function() {
 return (_chdir = Module["_chdir"] = Module["asm"]["chdir"]).apply(null, arguments);
};

var _getcwd = Module["_getcwd"] = function() {
 return (_getcwd = Module["_getcwd"] = Module["asm"]["getcwd"]).apply(null, arguments);
};

var _glob = Module["_glob"] = function() {
 return (_glob = Module["_glob"] = Module["asm"]["glob"]).apply(null, arguments);
};

var _php_check_open_basedir_ex = Module["_php_check_open_basedir_ex"] = function() {
 return (_php_check_open_basedir_ex = Module["_php_check_open_basedir_ex"] = Module["asm"]["php_check_open_basedir_ex"]).apply(null, arguments);
};

var _globfree = Module["_globfree"] = function() {
 return (_globfree = Module["_globfree"] = Module["asm"]["globfree"]).apply(null, arguments);
};

var __php_stream_scandir = Module["__php_stream_scandir"] = function() {
 return (__php_stream_scandir = Module["__php_stream_scandir"] = Module["asm"]["_php_stream_scandir"]).apply(null, arguments);
};

var _php_stream_dirent_alphasort = Module["_php_stream_dirent_alphasort"] = function() {
 return (_php_stream_dirent_alphasort = Module["_php_stream_dirent_alphasort"] = Module["asm"]["php_stream_dirent_alphasort"]).apply(null, arguments);
};

var _php_stream_dirent_alphasortr = Module["_php_stream_dirent_alphasortr"] = function() {
 return (_php_stream_dirent_alphasortr = Module["_php_stream_dirent_alphasortr"] = Module["asm"]["php_stream_dirent_alphasortr"]).apply(null, arguments);
};

var _zend_list_delete = Module["_zend_list_delete"] = function() {
 return (_zend_list_delete = Module["_zend_list_delete"] = Module["asm"]["zend_list_delete"]).apply(null, arguments);
};

var _zif_dl = Module["_zif_dl"] = function() {
 return (_zif_dl = Module["_zif_dl"] = Module["asm"]["zif_dl"]).apply(null, arguments);
};

var _php_dl = Module["_php_dl"] = function() {
 return (_php_dl = Module["_php_dl"] = Module["asm"]["php_dl"]).apply(null, arguments);
};

var _php_load_shlib = Module["_php_load_shlib"] = function() {
 return (_php_load_shlib = Module["_php_load_shlib"] = Module["asm"]["php_load_shlib"]).apply(null, arguments);
};

var _dlopen = Module["_dlopen"] = function() {
 return (_dlopen = Module["_dlopen"] = Module["asm"]["dlopen"]).apply(null, arguments);
};

var _dlerror = Module["_dlerror"] = function() {
 return (_dlerror = Module["_dlerror"] = Module["asm"]["dlerror"]).apply(null, arguments);
};

var _php_load_extension = Module["_php_load_extension"] = function() {
 return (_php_load_extension = Module["_php_load_extension"] = Module["asm"]["php_load_extension"]).apply(null, arguments);
};

var _dlsym = Module["_dlsym"] = function() {
 return (_dlsym = Module["_dlsym"] = Module["asm"]["dlsym"]).apply(null, arguments);
};

var _dlclose = Module["_dlclose"] = function() {
 return (_dlclose = Module["_dlclose"] = Module["asm"]["dlclose"]).apply(null, arguments);
};

var _zend_next_free_module = Module["_zend_next_free_module"] = function() {
 return (_zend_next_free_module = Module["_zend_next_free_module"] = Module["asm"]["zend_next_free_module"]).apply(null, arguments);
};

var _zend_register_module_ex = Module["_zend_register_module_ex"] = function() {
 return (_zend_register_module_ex = Module["_zend_register_module_ex"] = Module["asm"]["zend_register_module_ex"]).apply(null, arguments);
};

var _zend_startup_module_ex = Module["_zend_startup_module_ex"] = function() {
 return (_zend_startup_module_ex = Module["_zend_startup_module_ex"] = Module["asm"]["zend_startup_module_ex"]).apply(null, arguments);
};

var _gethostname = Module["_gethostname"] = function() {
 return (_gethostname = Module["_gethostname"] = Module["asm"]["gethostname"]).apply(null, arguments);
};

var _php_network_gethostbyname = Module["_php_network_gethostbyname"] = function() {
 return (_php_network_gethostbyname = Module["_php_network_gethostbyname"] = Module["asm"]["php_network_gethostbyname"]).apply(null, arguments);
};

var _sysconf = Module["_sysconf"] = function() {
 return (_sysconf = Module["_sysconf"] = Module["asm"]["sysconf"]).apply(null, arguments);
};

var _php_exec = Module["_php_exec"] = function() {
 return (_php_exec = Module["_php_exec"] = Module["asm"]["php_exec"]).apply(null, arguments);
};

var _popen = Module["_popen"] = function() {
 return (_popen = Module["_popen"] = Module["asm"]["popen"]).apply(null, arguments);
};

var __php_stream_fopen_from_pipe = Module["__php_stream_fopen_from_pipe"] = function() {
 return (__php_stream_fopen_from_pipe = Module["__php_stream_fopen_from_pipe"] = Module["asm"]["_php_stream_fopen_from_pipe"]).apply(null, arguments);
};

var _php_output_write = Module["_php_output_write"] = function() {
 return (_php_output_write = Module["_php_output_write"] = Module["asm"]["php_output_write"]).apply(null, arguments);
};

var _php_escape_shell_cmd = Module["_php_escape_shell_cmd"] = function() {
 return (_php_escape_shell_cmd = Module["_php_escape_shell_cmd"] = Module["asm"]["php_escape_shell_cmd"]).apply(null, arguments);
};

var _mblen = Module["_mblen"] = function() {
 return (_mblen = Module["_mblen"] = Module["asm"]["mblen"]).apply(null, arguments);
};

var _php_escape_shell_arg = Module["_php_escape_shell_arg"] = function() {
 return (_php_escape_shell_arg = Module["_php_escape_shell_arg"] = Module["asm"]["php_escape_shell_arg"]).apply(null, arguments);
};

var _nice = Module["_nice"] = function() {
 return (_nice = Module["_nice"] = Module["asm"]["nice"]).apply(null, arguments);
};

var _php_output_get_level = Module["_php_output_get_level"] = function() {
 return (_php_output_get_level = Module["_php_output_get_level"] = Module["asm"]["php_output_get_level"]).apply(null, arguments);
};

var _zend_fetch_resource2 = Module["_zend_fetch_resource2"] = function() {
 return (_zend_fetch_resource2 = Module["_zend_fetch_resource2"] = Module["asm"]["zend_fetch_resource2"]).apply(null, arguments);
};

var _zend_str_tolower = Module["_zend_str_tolower"] = function() {
 return (_zend_str_tolower = Module["_zend_str_tolower"] = Module["asm"]["zend_str_tolower"]).apply(null, arguments);
};

var __php_stream_copy_to_stream_ex = Module["__php_stream_copy_to_stream_ex"] = function() {
 return (__php_stream_copy_to_stream_ex = Module["__php_stream_copy_to_stream_ex"] = Module["asm"]["_php_stream_copy_to_stream_ex"]).apply(null, arguments);
};

var _php_stream_locate_eol = Module["_php_stream_locate_eol"] = function() {
 return (_php_stream_locate_eol = Module["_php_stream_locate_eol"] = Module["asm"]["php_stream_locate_eol"]).apply(null, arguments);
};

var _add_index_stringl = Module["_add_index_stringl"] = function() {
 return (_add_index_stringl = Module["_add_index_stringl"] = Module["asm"]["add_index_stringl"]).apply(null, arguments);
};

var _php_open_temporary_fd_ex = Module["_php_open_temporary_fd_ex"] = function() {
 return (_php_open_temporary_fd_ex = Module["_php_open_temporary_fd_ex"] = Module["asm"]["php_open_temporary_fd_ex"]).apply(null, arguments);
};

var __php_stream_fopen_tmpfile = Module["__php_stream_fopen_tmpfile"] = function() {
 return (__php_stream_fopen_tmpfile = Module["__php_stream_fopen_tmpfile"] = Module["asm"]["_php_stream_fopen_tmpfile"]).apply(null, arguments);
};

var _php_error_docref2 = Module["_php_error_docref2"] = function() {
 return (_php_error_docref2 = Module["_php_error_docref2"] = Module["asm"]["php_error_docref2"]).apply(null, arguments);
};

var _php_mkdir_ex = Module["_php_mkdir_ex"] = function() {
 return (_php_mkdir_ex = Module["_php_mkdir_ex"] = Module["asm"]["php_mkdir_ex"]).apply(null, arguments);
};

var _mkdir = Module["_mkdir"] = function() {
 return (_mkdir = Module["_mkdir"] = Module["asm"]["mkdir"]).apply(null, arguments);
};

var _php_mkdir = Module["_php_mkdir"] = function() {
 return (_php_mkdir = Module["_php_mkdir"] = Module["asm"]["php_mkdir"]).apply(null, arguments);
};

var __php_stream_mkdir = Module["__php_stream_mkdir"] = function() {
 return (__php_stream_mkdir = Module["__php_stream_mkdir"] = Module["asm"]["_php_stream_mkdir"]).apply(null, arguments);
};

var __php_stream_rmdir = Module["__php_stream_rmdir"] = function() {
 return (__php_stream_rmdir = Module["__php_stream_rmdir"] = Module["asm"]["_php_stream_rmdir"]).apply(null, arguments);
};

var _php_stream_locate_url_wrapper = Module["_php_stream_locate_url_wrapper"] = function() {
 return (_php_stream_locate_url_wrapper = Module["_php_stream_locate_url_wrapper"] = Module["asm"]["php_stream_locate_url_wrapper"]).apply(null, arguments);
};

var __php_stream_sync = Module["__php_stream_sync"] = function() {
 return (__php_stream_sync = Module["__php_stream_sync"] = Module["asm"]["_php_stream_sync"]).apply(null, arguments);
};

var __php_stream_stat = Module["__php_stream_stat"] = function() {
 return (__php_stream_stat = Module["__php_stream_stat"] = Module["asm"]["_php_stream_stat"]).apply(null, arguments);
};

var _zend_hash_str_add_new = Module["_zend_hash_str_add_new"] = function() {
 return (_zend_hash_str_add_new = Module["_zend_hash_str_add_new"] = Module["asm"]["zend_hash_str_add_new"]).apply(null, arguments);
};

var _php_copy_file_ctx = Module["_php_copy_file_ctx"] = function() {
 return (_php_copy_file_ctx = Module["_php_copy_file_ctx"] = Module["asm"]["php_copy_file_ctx"]).apply(null, arguments);
};

var _php_copy_file = Module["_php_copy_file"] = function() {
 return (_php_copy_file = Module["_php_copy_file"] = Module["asm"]["php_copy_file"]).apply(null, arguments);
};

var __php_stream_stat_path = Module["__php_stream_stat_path"] = function() {
 return (__php_stream_stat_path = Module["__php_stream_stat_path"] = Module["asm"]["_php_stream_stat_path"]).apply(null, arguments);
};

var _expand_filepath = Module["_expand_filepath"] = function() {
 return (_expand_filepath = Module["_expand_filepath"] = Module["asm"]["expand_filepath"]).apply(null, arguments);
};

var _fnmatch = Module["_fnmatch"] = function() {
 return (_fnmatch = Module["_fnmatch"] = Module["asm"]["fnmatch"]).apply(null, arguments);
};

var _php_stream_context_free = Module["_php_stream_context_free"] = function() {
 return (_php_stream_context_free = Module["_php_stream_context_free"] = Module["asm"]["php_stream_context_free"]).apply(null, arguments);
};

var _zend_ini_parse_bool = Module["_zend_ini_parse_bool"] = function() {
 return (_zend_ini_parse_bool = Module["_zend_ini_parse_bool"] = Module["asm"]["zend_ini_parse_bool"]).apply(null, arguments);
};

var _php_get_gid_by_name = Module["_php_get_gid_by_name"] = function() {
 return (_php_get_gid_by_name = Module["_php_get_gid_by_name"] = Module["asm"]["php_get_gid_by_name"]).apply(null, arguments);
};

var _getgrnam = Module["_getgrnam"] = function() {
 return (_getgrnam = Module["_getgrnam"] = Module["asm"]["getgrnam"]).apply(null, arguments);
};

var _php_get_uid_by_name = Module["_php_get_uid_by_name"] = function() {
 return (_php_get_uid_by_name = Module["_php_get_uid_by_name"] = Module["asm"]["php_get_uid_by_name"]).apply(null, arguments);
};

var _getpwnam = Module["_getpwnam"] = function() {
 return (_getpwnam = Module["_getpwnam"] = Module["asm"]["getpwnam"]).apply(null, arguments);
};

var _fclose = Module["_fclose"] = function() {
 return (_fclose = Module["_fclose"] = Module["asm"]["fclose"]).apply(null, arguments);
};

var _realpath_cache_del = Module["_realpath_cache_del"] = function() {
 return (_realpath_cache_del = Module["_realpath_cache_del"] = Module["asm"]["realpath_cache_del"]).apply(null, arguments);
};

var _realpath_cache_clean = Module["_realpath_cache_clean"] = function() {
 return (_realpath_cache_clean = Module["_realpath_cache_clean"] = Module["asm"]["realpath_cache_clean"]).apply(null, arguments);
};

var _getgid = Module["_getgid"] = function() {
 return (_getgid = Module["_getgid"] = Module["asm"]["getgid"]).apply(null, arguments);
};

var _getgroups = Module["_getgroups"] = function() {
 return (_getgroups = Module["_getgroups"] = Module["asm"]["getgroups"]).apply(null, arguments);
};

var _realpath_cache_size = Module["_realpath_cache_size"] = function() {
 return (_realpath_cache_size = Module["_realpath_cache_size"] = Module["asm"]["realpath_cache_size"]).apply(null, arguments);
};

var _realpath_cache_get_buckets = Module["_realpath_cache_get_buckets"] = function() {
 return (_realpath_cache_get_buckets = Module["_realpath_cache_get_buckets"] = Module["asm"]["realpath_cache_get_buckets"]).apply(null, arguments);
};

var _realpath_cache_max_buckets = Module["_realpath_cache_max_buckets"] = function() {
 return (_realpath_cache_max_buckets = Module["_realpath_cache_max_buckets"] = Module["asm"]["realpath_cache_max_buckets"]).apply(null, arguments);
};

var _add_assoc_stringl_ex = Module["_add_assoc_stringl_ex"] = function() {
 return (_add_assoc_stringl_ex = Module["_add_assoc_stringl_ex"] = Module["asm"]["add_assoc_stringl_ex"]).apply(null, arguments);
};

var _statvfs = Module["_statvfs"] = function() {
 return (_statvfs = Module["_statvfs"] = Module["asm"]["statvfs"]).apply(null, arguments);
};

var _lchown = Module["_lchown"] = function() {
 return (_lchown = Module["_lchown"] = Module["asm"]["lchown"]).apply(null, arguments);
};

var _chown = Module["_chown"] = function() {
 return (_chown = Module["_chown"] = Module["asm"]["chown"]).apply(null, arguments);
};

var _php_flock = Module["_php_flock"] = function() {
 return (_php_flock = Module["_php_flock"] = Module["asm"]["php_flock"]).apply(null, arguments);
};

var _localeconv = Module["_localeconv"] = function() {
 return (_localeconv = Module["_localeconv"] = Module["asm"]["localeconv"]).apply(null, arguments);
};

var _php_conv_fp = Module["_php_conv_fp"] = function() {
 return (_php_conv_fp = Module["_php_conv_fp"] = Module["asm"]["php_conv_fp"]).apply(null, arguments);
};

var __php_stream_xport_create = Module["__php_stream_xport_create"] = function() {
 return (__php_stream_xport_create = Module["__php_stream_xport_create"] = Module["asm"]["_php_stream_xport_create"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_str = Module["_zend_try_assign_typed_ref_str"] = function() {
 return (_zend_try_assign_typed_ref_str = Module["_zend_try_assign_typed_ref_str"] = Module["asm"]["zend_try_assign_typed_ref_str"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_empty_string = Module["_zend_try_assign_typed_ref_empty_string"] = function() {
 return (_zend_try_assign_typed_ref_empty_string = Module["_zend_try_assign_typed_ref_empty_string"] = Module["asm"]["zend_try_assign_typed_ref_empty_string"]).apply(null, arguments);
};

var _sapi_header_op = Module["_sapi_header_op"] = function() {
 return (_sapi_header_op = Module["_sapi_header_op"] = Module["asm"]["sapi_header_op"]).apply(null, arguments);
};

var _php_header = Module["_php_header"] = function() {
 return (_php_header = Module["_php_header"] = Module["asm"]["php_header"]).apply(null, arguments);
};

var _php_setcookie = Module["_php_setcookie"] = function() {
 return (_php_setcookie = Module["_php_setcookie"] = Module["asm"]["php_setcookie"]).apply(null, arguments);
};

var _php_raw_url_encode = Module["_php_raw_url_encode"] = function() {
 return (_php_raw_url_encode = Module["_php_raw_url_encode"] = Module["asm"]["php_raw_url_encode"]).apply(null, arguments);
};

var _difftime = Module["_difftime"] = function() {
 return (_difftime = Module["_difftime"] = Module["asm"]["difftime"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_string = Module["_zend_try_assign_typed_ref_string"] = function() {
 return (_zend_try_assign_typed_ref_string = Module["_zend_try_assign_typed_ref_string"] = Module["asm"]["zend_try_assign_typed_ref_string"]).apply(null, arguments);
};

var _zend_llist_apply_with_argument = Module["_zend_llist_apply_with_argument"] = function() {
 return (_zend_llist_apply_with_argument = Module["_zend_llist_apply_with_argument"] = Module["asm"]["zend_llist_apply_with_argument"]).apply(null, arguments);
};

var _php_unescape_html_entities = Module["_php_unescape_html_entities"] = function() {
 return (_php_unescape_html_entities = Module["_php_unescape_html_entities"] = Module["asm"]["php_unescape_html_entities"]).apply(null, arguments);
};

var _php_escape_html_entities = Module["_php_escape_html_entities"] = function() {
 return (_php_escape_html_entities = Module["_php_escape_html_entities"] = Module["asm"]["php_escape_html_entities"]).apply(null, arguments);
};

var _php_escape_html_entities_ex = Module["_php_escape_html_entities_ex"] = function() {
 return (_php_escape_html_entities_ex = Module["_php_escape_html_entities_ex"] = Module["asm"]["php_escape_html_entities_ex"]).apply(null, arguments);
};

var _php_is_image_avif = Module["_php_is_image_avif"] = function() {
 return (_php_is_image_avif = Module["_php_is_image_avif"] = Module["asm"]["php_is_image_avif"]).apply(null, arguments);
};

var _php_image_type_to_mime_type = Module["_php_image_type_to_mime_type"] = function() {
 return (_php_image_type_to_mime_type = Module["_php_image_type_to_mime_type"] = Module["asm"]["php_image_type_to_mime_type"]).apply(null, arguments);
};

var _php_getimagetype = Module["_php_getimagetype"] = function() {
 return (_php_getimagetype = Module["_php_getimagetype"] = Module["asm"]["php_getimagetype"]).apply(null, arguments);
};

var _sscanf = Module["_sscanf"] = function() {
 return (_sscanf = Module["_sscanf"] = Module["asm"]["sscanf"]).apply(null, arguments);
};

var _strrchr = Module["_strrchr"] = function() {
 return (_strrchr = Module["_strrchr"] = Module["asm"]["strrchr"]).apply(null, arguments);
};

var _php_info_print_table_header = Module["_php_info_print_table_header"] = function() {
 return (_php_info_print_table_header = Module["_php_info_print_table_header"] = Module["asm"]["php_info_print_table_header"]).apply(null, arguments);
};

var _php_info_print_style = Module["_php_info_print_style"] = function() {
 return (_php_info_print_style = Module["_php_info_print_style"] = Module["asm"]["php_info_print_style"]).apply(null, arguments);
};

var _php_info_print_css = Module["_php_info_print_css"] = function() {
 return (_php_info_print_css = Module["_php_info_print_css"] = Module["asm"]["php_info_print_css"]).apply(null, arguments);
};

var _php_info_html_esc = Module["_php_info_html_esc"] = function() {
 return (_php_info_html_esc = Module["_php_info_html_esc"] = Module["asm"]["php_info_html_esc"]).apply(null, arguments);
};

var _php_get_uname = Module["_php_get_uname"] = function() {
 return (_php_get_uname = Module["_php_get_uname"] = Module["asm"]["php_get_uname"]).apply(null, arguments);
};

var _uname = Module["_uname"] = function() {
 return (_uname = Module["_uname"] = Module["asm"]["uname"]).apply(null, arguments);
};

var _php_print_info_htmlhead = Module["_php_print_info_htmlhead"] = function() {
 return (_php_print_info_htmlhead = Module["_php_print_info_htmlhead"] = Module["asm"]["php_print_info_htmlhead"]).apply(null, arguments);
};

var _php_print_info = Module["_php_print_info"] = function() {
 return (_php_print_info = Module["_php_print_info"] = Module["asm"]["php_print_info"]).apply(null, arguments);
};

var _get_zend_version = Module["_get_zend_version"] = function() {
 return (_get_zend_version = Module["_get_zend_version"] = Module["asm"]["get_zend_version"]).apply(null, arguments);
};

var _php_info_print_box_start = Module["_php_info_print_box_start"] = function() {
 return (_php_info_print_box_start = Module["_php_info_print_box_start"] = Module["asm"]["php_info_print_box_start"]).apply(null, arguments);
};

var _localtime_r = Module["_localtime_r"] = function() {
 return (_localtime_r = Module["_localtime_r"] = Module["asm"]["localtime_r"]).apply(null, arguments);
};

var _php_info_print_box_end = Module["_php_info_print_box_end"] = function() {
 return (_php_info_print_box_end = Module["_php_info_print_box_end"] = Module["asm"]["php_info_print_box_end"]).apply(null, arguments);
};

var _is_zend_mm = Module["_is_zend_mm"] = function() {
 return (_is_zend_mm = Module["_is_zend_mm"] = Module["asm"]["is_zend_mm"]).apply(null, arguments);
};

var _zend_multibyte_get_functions = Module["_zend_multibyte_get_functions"] = function() {
 return (_zend_multibyte_get_functions = Module["_zend_multibyte_get_functions"] = Module["asm"]["zend_multibyte_get_functions"]).apply(null, arguments);
};

var __php_stream_get_url_stream_wrappers_hash = Module["__php_stream_get_url_stream_wrappers_hash"] = function() {
 return (__php_stream_get_url_stream_wrappers_hash = Module["__php_stream_get_url_stream_wrappers_hash"] = Module["asm"]["_php_stream_get_url_stream_wrappers_hash"]).apply(null, arguments);
};

var _php_stream_xport_get_hash = Module["_php_stream_xport_get_hash"] = function() {
 return (_php_stream_xport_get_hash = Module["_php_stream_xport_get_hash"] = Module["asm"]["php_stream_xport_get_hash"]).apply(null, arguments);
};

var __php_get_stream_filters_hash = Module["__php_get_stream_filters_hash"] = function() {
 return (__php_get_stream_filters_hash = Module["__php_get_stream_filters_hash"] = Module["asm"]["_php_get_stream_filters_hash"]).apply(null, arguments);
};

var _zend_html_puts = Module["_zend_html_puts"] = function() {
 return (_zend_html_puts = Module["_zend_html_puts"] = Module["asm"]["zend_html_puts"]).apply(null, arguments);
};

var _php_info_print_hr = Module["_php_info_print_hr"] = function() {
 return (_php_info_print_hr = Module["_php_info_print_hr"] = Module["asm"]["php_info_print_hr"]).apply(null, arguments);
};

var _php_print_credits = Module["_php_print_credits"] = function() {
 return (_php_print_credits = Module["_php_print_credits"] = Module["asm"]["php_print_credits"]).apply(null, arguments);
};

var _php_info_print_table_colspan_header = Module["_php_info_print_table_colspan_header"] = function() {
 return (_php_info_print_table_colspan_header = Module["_php_info_print_table_colspan_header"] = Module["asm"]["php_info_print_table_colspan_header"]).apply(null, arguments);
};

var _php_info_print_table_row_ex = Module["_php_info_print_table_row_ex"] = function() {
 return (_php_info_print_table_row_ex = Module["_php_info_print_table_row_ex"] = Module["asm"]["php_info_print_table_row_ex"]).apply(null, arguments);
};

var _zend_get_module_version = Module["_zend_get_module_version"] = function() {
 return (_zend_get_module_version = Module["_zend_get_module_version"] = Module["asm"]["zend_get_module_version"]).apply(null, arguments);
};

var _zend_vspprintf = Module["_zend_vspprintf"] = function() {
 return (_zend_vspprintf = Module["_zend_vspprintf"] = Module["asm"]["zend_vspprintf"]).apply(null, arguments);
};

var _fileno = function() {
 return (_fileno = Module["asm"]["fileno"]).apply(null, arguments);
};

var _fgetc = Module["_fgetc"] = function() {
 return (_fgetc = Module["_fgetc"] = Module["asm"]["fgetc"]).apply(null, arguments);
};

var _getc = Module["_getc"] = function() {
 return (_getc = Module["_getc"] = Module["asm"]["getc"]).apply(null, arguments);
};

var _lstat = Module["_lstat"] = function() {
 return (_lstat = Module["_lstat"] = Module["asm"]["lstat"]).apply(null, arguments);
};

var _expand_filepath_ex = Module["_expand_filepath_ex"] = function() {
 return (_expand_filepath_ex = Module["_expand_filepath_ex"] = Module["asm"]["expand_filepath_ex"]).apply(null, arguments);
};

var _symlink = Module["_symlink"] = function() {
 return (_symlink = Module["_symlink"] = Module["asm"]["symlink"]).apply(null, arguments);
};

var _link = Module["_link"] = function() {
 return (_link = Module["_link"] = Module["asm"]["link"]).apply(null, arguments);
};

var _php_mail_build_headers = Module["_php_mail_build_headers"] = function() {
 return (_php_mail_build_headers = Module["_php_mail_build_headers"] = Module["asm"]["php_mail_build_headers"]).apply(null, arguments);
};

var _php_trim = Module["_php_trim"] = function() {
 return (_php_trim = Module["_php_trim"] = Module["asm"]["php_trim"]).apply(null, arguments);
};

var _php_syslog = Module["_php_syslog"] = function() {
 return (_php_syslog = Module["_php_syslog"] = Module["asm"]["php_syslog"]).apply(null, arguments);
};

var _zend_get_executed_filename = Module["_zend_get_executed_filename"] = function() {
 return (_zend_get_executed_filename = Module["_zend_get_executed_filename"] = Module["asm"]["zend_get_executed_filename"]).apply(null, arguments);
};

var _pclose = Module["_pclose"] = function() {
 return (_pclose = Module["_pclose"] = Module["asm"]["pclose"]).apply(null, arguments);
};

var _fprintf = Module["_fprintf"] = function() {
 return (_fprintf = Module["_fprintf"] = Module["asm"]["fprintf"]).apply(null, arguments);
};

var _tan = Module["_tan"] = function() {
 return (_tan = Module["_tan"] = Module["asm"]["tan"]).apply(null, arguments);
};

var _asin = Module["_asin"] = function() {
 return (_asin = Module["_asin"] = Module["asm"]["asin"]).apply(null, arguments);
};

var _atan = Module["_atan"] = function() {
 return (_atan = Module["_atan"] = Module["asm"]["atan"]).apply(null, arguments);
};

var _sinh = Module["_sinh"] = function() {
 return (_sinh = Module["_sinh"] = Module["asm"]["sinh"]).apply(null, arguments);
};

var _cosh = Module["_cosh"] = function() {
 return (_cosh = Module["_cosh"] = Module["asm"]["cosh"]).apply(null, arguments);
};

var _tanh = Module["_tanh"] = function() {
 return (_tanh = Module["_tanh"] = Module["asm"]["tanh"]).apply(null, arguments);
};

var _asinh = Module["_asinh"] = function() {
 return (_asinh = Module["_asinh"] = Module["asm"]["asinh"]).apply(null, arguments);
};

var _acosh = Module["_acosh"] = function() {
 return (_acosh = Module["_acosh"] = Module["asm"]["acosh"]).apply(null, arguments);
};

var _atanh = Module["_atanh"] = function() {
 return (_atanh = Module["_atanh"] = Module["asm"]["atanh"]).apply(null, arguments);
};

var _pow_function = Module["_pow_function"] = function() {
 return (_pow_function = Module["_pow_function"] = Module["asm"]["pow_function"]).apply(null, arguments);
};

var _expm1 = Module["_expm1"] = function() {
 return (_expm1 = Module["_expm1"] = Module["asm"]["expm1"]).apply(null, arguments);
};

var _log1p = Module["_log1p"] = function() {
 return (_log1p = Module["_log1p"] = Module["asm"]["log1p"]).apply(null, arguments);
};

var _hypot = Module["_hypot"] = function() {
 return (_hypot = Module["_hypot"] = Module["asm"]["hypot"]).apply(null, arguments);
};

var __php_math_basetolong = Module["__php_math_basetolong"] = function() {
 return (__php_math_basetolong = Module["__php_math_basetolong"] = Module["asm"]["_php_math_basetolong"]).apply(null, arguments);
};

var __php_math_basetozval = Module["__php_math_basetozval"] = function() {
 return (__php_math_basetozval = Module["__php_math_basetozval"] = Module["asm"]["_php_math_basetozval"]).apply(null, arguments);
};

var __php_math_longtobase = Module["__php_math_longtobase"] = function() {
 return (__php_math_longtobase = Module["__php_math_longtobase"] = Module["asm"]["_php_math_longtobase"]).apply(null, arguments);
};

var __php_math_zvaltobase = Module["__php_math_zvaltobase"] = function() {
 return (__php_math_zvaltobase = Module["__php_math_zvaltobase"] = Module["asm"]["_php_math_zvaltobase"]).apply(null, arguments);
};

var __php_math_number_format = Module["__php_math_number_format"] = function() {
 return (__php_math_number_format = Module["__php_math_number_format"] = Module["asm"]["_php_math_number_format"]).apply(null, arguments);
};

var __php_math_number_format_ex = Module["__php_math_number_format_ex"] = function() {
 return (__php_math_number_format_ex = Module["__php_math_number_format_ex"] = Module["asm"]["_php_math_number_format_ex"]).apply(null, arguments);
};

var __php_math_number_format_long = Module["__php_math_number_format_long"] = function() {
 return (__php_math_number_format_long = Module["__php_math_number_format_long"] = Module["asm"]["_php_math_number_format_long"]).apply(null, arguments);
};

var _make_digest = Module["_make_digest"] = function() {
 return (_make_digest = Module["_make_digest"] = Module["asm"]["make_digest"]).apply(null, arguments);
};

var _make_digest_ex = Module["_make_digest_ex"] = function() {
 return (_make_digest_ex = Module["_make_digest_ex"] = Module["asm"]["make_digest_ex"]).apply(null, arguments);
};

var _getrusage = Module["_getrusage"] = function() {
 return (_getrusage = Module["_getrusage"] = Module["asm"]["getrusage"]).apply(null, arguments);
};

var _php_statpage = Module["_php_statpage"] = function() {
 return (_php_statpage = Module["_php_statpage"] = Module["asm"]["php_statpage"]).apply(null, arguments);
};

var _sapi_get_stat = Module["_sapi_get_stat"] = function() {
 return (_sapi_get_stat = Module["_sapi_get_stat"] = Module["asm"]["sapi_get_stat"]).apply(null, arguments);
};

var _php_getlastmod = Module["_php_getlastmod"] = function() {
 return (_php_getlastmod = Module["_php_getlastmod"] = Module["asm"]["php_getlastmod"]).apply(null, arguments);
};

var _php_quot_print_decode = Module["_php_quot_print_decode"] = function() {
 return (_php_quot_print_decode = Module["_php_quot_print_decode"] = Module["asm"]["php_quot_print_decode"]).apply(null, arguments);
};

var _php_quot_print_encode = Module["_php_quot_print_encode"] = function() {
 return (_php_quot_print_encode = Module["_php_quot_print_encode"] = Module["asm"]["php_quot_print_encode"]).apply(null, arguments);
};

var _localeconv_r = Module["_localeconv_r"] = function() {
 return (_localeconv_r = Module["_localeconv_r"] = Module["asm"]["localeconv_r"]).apply(null, arguments);
};

var _nl_langinfo = Module["_nl_langinfo"] = function() {
 return (_nl_langinfo = Module["_nl_langinfo"] = Module["asm"]["nl_langinfo"]).apply(null, arguments);
};

var _php_explode = Module["_php_explode"] = function() {
 return (_php_explode = Module["_php_explode"] = Module["asm"]["php_explode"]).apply(null, arguments);
};

var _zend_hash_packed_grow = Module["_zend_hash_packed_grow"] = function() {
 return (_zend_hash_packed_grow = Module["_zend_hash_packed_grow"] = Module["asm"]["zend_hash_packed_grow"]).apply(null, arguments);
};

var _php_explode_negative_limit = Module["_php_explode_negative_limit"] = function() {
 return (_php_explode_negative_limit = Module["_php_explode_negative_limit"] = Module["asm"]["php_explode_negative_limit"]).apply(null, arguments);
};

var _php_implode = Module["_php_implode"] = function() {
 return (_php_implode = Module["_php_implode"] = Module["asm"]["php_implode"]).apply(null, arguments);
};

var _php_strtoupper = Module["_php_strtoupper"] = function() {
 return (_php_strtoupper = Module["_php_strtoupper"] = Module["asm"]["php_strtoupper"]).apply(null, arguments);
};

var _zend_str_toupper = Module["_zend_str_toupper"] = function() {
 return (_zend_str_toupper = Module["_zend_str_toupper"] = Module["asm"]["zend_str_toupper"]).apply(null, arguments);
};

var _php_string_toupper = Module["_php_string_toupper"] = function() {
 return (_php_string_toupper = Module["_php_string_toupper"] = Module["asm"]["php_string_toupper"]).apply(null, arguments);
};

var _php_strtolower = Module["_php_strtolower"] = function() {
 return (_php_strtolower = Module["_php_strtolower"] = Module["asm"]["php_strtolower"]).apply(null, arguments);
};

var _php_string_tolower = Module["_php_string_tolower"] = function() {
 return (_php_string_tolower = Module["_php_string_tolower"] = Module["asm"]["php_string_tolower"]).apply(null, arguments);
};

var _zend_string_only_has_ascii_alphanumeric = Module["_zend_string_only_has_ascii_alphanumeric"] = function() {
 return (_zend_string_only_has_ascii_alphanumeric = Module["_zend_string_only_has_ascii_alphanumeric"] = Module["asm"]["zend_string_only_has_ascii_alphanumeric"]).apply(null, arguments);
};

var _zend_dirname = Module["_zend_dirname"] = function() {
 return (_zend_dirname = Module["_zend_dirname"] = Module["asm"]["zend_dirname"]).apply(null, arguments);
};

var _php_stristr = Module["_php_stristr"] = function() {
 return (_php_stristr = Module["_php_stristr"] = Module["asm"]["php_stristr"]).apply(null, arguments);
};

var _php_strspn = Module["_php_strspn"] = function() {
 return (_php_strspn = Module["_php_strspn"] = Module["asm"]["php_strspn"]).apply(null, arguments);
};

var _php_strcspn = Module["_php_strcspn"] = function() {
 return (_php_strcspn = Module["_php_strcspn"] = Module["asm"]["php_strcspn"]).apply(null, arguments);
};

var _add_index_str = Module["_add_index_str"] = function() {
 return (_add_index_str = Module["_add_index_str"] = Module["asm"]["add_index_str"]).apply(null, arguments);
};

var _php_strtr = Module["_php_strtr"] = function() {
 return (_php_strtr = Module["_php_strtr"] = Module["asm"]["php_strtr"]).apply(null, arguments);
};

var _php_str_to_str = Module["_php_str_to_str"] = function() {
 return (_php_str_to_str = Module["_php_str_to_str"] = Module["asm"]["php_str_to_str"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_double = Module["_zend_try_assign_typed_ref_double"] = function() {
 return (_zend_try_assign_typed_ref_double = Module["_zend_try_assign_typed_ref_double"] = Module["asm"]["zend_try_assign_typed_ref_double"]).apply(null, arguments);
};

var _php_addcslashes_str = Module["_php_addcslashes_str"] = function() {
 return (_php_addcslashes_str = Module["_php_addcslashes_str"] = Module["asm"]["php_addcslashes_str"]).apply(null, arguments);
};

var _php_addslashes = Module["_php_addslashes"] = function() {
 return (_php_addslashes = Module["_php_addslashes"] = Module["asm"]["php_addslashes"]).apply(null, arguments);
};

var _php_stripcslashes = Module["_php_stripcslashes"] = function() {
 return (_php_stripcslashes = Module["_php_stripcslashes"] = Module["asm"]["php_stripcslashes"]).apply(null, arguments);
};

var _php_stripslashes = Module["_php_stripslashes"] = function() {
 return (_php_stripslashes = Module["_php_stripslashes"] = Module["asm"]["php_stripslashes"]).apply(null, arguments);
};

var _sprintf = Module["_sprintf"] = function() {
 return (_sprintf = Module["_sprintf"] = Module["asm"]["sprintf"]).apply(null, arguments);
};

var _php_addcslashes = Module["_php_addcslashes"] = function() {
 return (_php_addcslashes = Module["_php_addcslashes"] = Module["asm"]["php_addcslashes"]).apply(null, arguments);
};

var _php_strip_tags_ex = Module["_php_strip_tags_ex"] = function() {
 return (_php_strip_tags_ex = Module["_php_strip_tags_ex"] = Module["asm"]["php_strip_tags_ex"]).apply(null, arguments);
};

var _php_strip_tags = Module["_php_strip_tags"] = function() {
 return (_php_strip_tags = Module["_php_strip_tags"] = Module["asm"]["php_strip_tags"]).apply(null, arguments);
};

var _zend_str_tolower_dup_ex = Module["_zend_str_tolower_dup_ex"] = function() {
 return (_zend_str_tolower_dup_ex = Module["_zend_str_tolower_dup_ex"] = Module["asm"]["zend_str_tolower_dup_ex"]).apply(null, arguments);
};

var _zend_binary_strncmp = Module["_zend_binary_strncmp"] = function() {
 return (_zend_binary_strncmp = Module["_zend_binary_strncmp"] = Module["asm"]["zend_binary_strncmp"]).apply(null, arguments);
};

var _zend_binary_strncasecmp_l = Module["_zend_binary_strncasecmp_l"] = function() {
 return (_zend_binary_strncasecmp_l = Module["_zend_binary_strncasecmp_l"] = Module["asm"]["zend_binary_strncasecmp_l"]).apply(null, arguments);
};

var _zend_memnrstr_ex = Module["_zend_memnrstr_ex"] = function() {
 return (_zend_memnrstr_ex = Module["_zend_memnrstr_ex"] = Module["asm"]["zend_memnrstr_ex"]).apply(null, arguments);
};

var _ValidateFormat = Module["_ValidateFormat"] = function() {
 return (_ValidateFormat = Module["_ValidateFormat"] = Module["asm"]["ValidateFormat"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_stringl = Module["_zend_try_assign_typed_ref_stringl"] = function() {
 return (_zend_try_assign_typed_ref_stringl = Module["_zend_try_assign_typed_ref_stringl"] = Module["asm"]["zend_try_assign_typed_ref_stringl"]).apply(null, arguments);
};

var _php_closelog = Module["_php_closelog"] = function() {
 return (_php_closelog = Module["_php_closelog"] = Module["asm"]["php_closelog"]).apply(null, arguments);
};

var _php_openlog = Module["_php_openlog"] = function() {
 return (_php_openlog = Module["_php_openlog"] = Module["asm"]["php_openlog"]).apply(null, arguments);
};

var _php_syslog_str = Module["_php_syslog_str"] = function() {
 return (_php_syslog_str = Module["_php_syslog_str"] = Module["asm"]["php_syslog_str"]).apply(null, arguments);
};

var _zend_zval_get_legacy_type = Module["_zend_zval_get_legacy_type"] = function() {
 return (_zend_zval_get_legacy_type = Module["_zend_zval_get_legacy_type"] = Module["asm"]["zend_zval_get_legacy_type"]).apply(null, arguments);
};

var _zend_rsrc_list_get_rsrc_type = Module["_zend_rsrc_list_get_rsrc_type"] = function() {
 return (_zend_rsrc_list_get_rsrc_type = Module["_zend_rsrc_list_get_rsrc_type"] = Module["asm"]["zend_rsrc_list_get_rsrc_type"]).apply(null, arguments);
};

var _convert_to_double = Module["_convert_to_double"] = function() {
 return (_convert_to_double = Module["_convert_to_double"] = Module["asm"]["convert_to_double"]).apply(null, arguments);
};

var _convert_to_object = Module["_convert_to_object"] = function() {
 return (_convert_to_object = Module["_convert_to_object"] = Module["asm"]["convert_to_object"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref = Module["_zend_try_assign_typed_ref"] = function() {
 return (_zend_try_assign_typed_ref = Module["_zend_try_assign_typed_ref"] = Module["asm"]["zend_try_assign_typed_ref"]).apply(null, arguments);
};

var _zend_is_countable = Module["_zend_is_countable"] = function() {
 return (_zend_is_countable = Module["_zend_is_countable"] = Module["asm"]["zend_is_countable"]).apply(null, arguments);
};

var _php_url_free = Module["_php_url_free"] = function() {
 return (_php_url_free = Module["_php_url_free"] = Module["asm"]["php_url_free"]).apply(null, arguments);
};

var _php_replace_controlchars_ex = Module["_php_replace_controlchars_ex"] = function() {
 return (_php_replace_controlchars_ex = Module["_php_replace_controlchars_ex"] = Module["asm"]["php_replace_controlchars_ex"]).apply(null, arguments);
};

var _php_replace_controlchars = Module["_php_replace_controlchars"] = function() {
 return (_php_replace_controlchars = Module["_php_replace_controlchars"] = Module["asm"]["php_replace_controlchars"]).apply(null, arguments);
};

var _php_url_parse = Module["_php_url_parse"] = function() {
 return (_php_url_parse = Module["_php_url_parse"] = Module["asm"]["php_url_parse"]).apply(null, arguments);
};

var _php_url_parse_ex = Module["_php_url_parse_ex"] = function() {
 return (_php_url_parse_ex = Module["_php_url_parse_ex"] = Module["asm"]["php_url_parse_ex"]).apply(null, arguments);
};

var _php_url_parse_ex2 = Module["_php_url_parse_ex2"] = function() {
 return (_php_url_parse_ex2 = Module["_php_url_parse_ex2"] = Module["asm"]["php_url_parse_ex2"]).apply(null, arguments);
};

var _php_url_decode = Module["_php_url_decode"] = function() {
 return (_php_url_decode = Module["_php_url_decode"] = Module["asm"]["php_url_decode"]).apply(null, arguments);
};

var _php_raw_url_decode = Module["_php_raw_url_decode"] = function() {
 return (_php_raw_url_decode = Module["_php_raw_url_decode"] = Module["asm"]["php_raw_url_decode"]).apply(null, arguments);
};

var _php_var_dump = Module["_php_var_dump"] = function() {
 return (_php_var_dump = Module["_php_var_dump"] = Module["asm"]["php_var_dump"]).apply(null, arguments);
};

var _php_printf = Module["_php_printf"] = function() {
 return (_php_printf = Module["_php_printf"] = Module["asm"]["php_printf"]).apply(null, arguments);
};

var _php_printf_unchecked = Module["_php_printf_unchecked"] = function() {
 return (_php_printf_unchecked = Module["_php_printf_unchecked"] = Module["asm"]["php_printf_unchecked"]).apply(null, arguments);
};

var _zend_array_count = Module["_zend_array_count"] = function() {
 return (_zend_array_count = Module["_zend_array_count"] = Module["asm"]["zend_array_count"]).apply(null, arguments);
};

var _php_debug_zval_dump = Module["_php_debug_zval_dump"] = function() {
 return (_php_debug_zval_dump = Module["_php_debug_zval_dump"] = Module["asm"]["php_debug_zval_dump"]).apply(null, arguments);
};

var _php_var_export_ex = Module["_php_var_export_ex"] = function() {
 return (_php_var_export_ex = Module["_php_var_export_ex"] = Module["asm"]["php_var_export_ex"]).apply(null, arguments);
};

var _smart_str_append_double = Module["_smart_str_append_double"] = function() {
 return (_smart_str_append_double = Module["_smart_str_append_double"] = Module["asm"]["smart_str_append_double"]).apply(null, arguments);
};

var _php_var_export = Module["_php_var_export"] = function() {
 return (_php_var_export = Module["_php_var_export"] = Module["asm"]["php_var_export"]).apply(null, arguments);
};

var _php_unserialize_with_options = Module["_php_unserialize_with_options"] = function() {
 return (_php_unserialize_with_options = Module["_php_unserialize_with_options"] = Module["asm"]["php_unserialize_with_options"]).apply(null, arguments);
};

var _php_var_unserialize_get_allowed_classes = Module["_php_var_unserialize_get_allowed_classes"] = function() {
 return (_php_var_unserialize_get_allowed_classes = Module["_php_var_unserialize_get_allowed_classes"] = Module["asm"]["php_var_unserialize_get_allowed_classes"]).apply(null, arguments);
};

var _php_var_unserialize_get_max_depth = Module["_php_var_unserialize_get_max_depth"] = function() {
 return (_php_var_unserialize_get_max_depth = Module["_php_var_unserialize_get_max_depth"] = Module["asm"]["php_var_unserialize_get_max_depth"]).apply(null, arguments);
};

var _php_var_unserialize_get_cur_depth = Module["_php_var_unserialize_get_cur_depth"] = function() {
 return (_php_var_unserialize_get_cur_depth = Module["_php_var_unserialize_get_cur_depth"] = Module["asm"]["php_var_unserialize_get_cur_depth"]).apply(null, arguments);
};

var _php_var_unserialize_set_allowed_classes = Module["_php_var_unserialize_set_allowed_classes"] = function() {
 return (_php_var_unserialize_set_allowed_classes = Module["_php_var_unserialize_set_allowed_classes"] = Module["asm"]["php_var_unserialize_set_allowed_classes"]).apply(null, arguments);
};

var _php_var_unserialize_set_max_depth = Module["_php_var_unserialize_set_max_depth"] = function() {
 return (_php_var_unserialize_set_max_depth = Module["_php_var_unserialize_set_max_depth"] = Module["asm"]["php_var_unserialize_set_max_depth"]).apply(null, arguments);
};

var _php_var_unserialize_set_cur_depth = Module["_php_var_unserialize_set_cur_depth"] = function() {
 return (_php_var_unserialize_set_cur_depth = Module["_php_var_unserialize_set_cur_depth"] = Module["asm"]["php_var_unserialize_set_cur_depth"]).apply(null, arguments);
};

var _zend_memory_usage = Module["_zend_memory_usage"] = function() {
 return (_zend_memory_usage = Module["_zend_memory_usage"] = Module["asm"]["zend_memory_usage"]).apply(null, arguments);
};

var _zend_memory_peak_usage = Module["_zend_memory_peak_usage"] = function() {
 return (_zend_memory_peak_usage = Module["_zend_memory_peak_usage"] = Module["asm"]["zend_memory_peak_usage"]).apply(null, arguments);
};

var _zend_memory_reset_peak_usage = Module["_zend_memory_reset_peak_usage"] = function() {
 return (_zend_memory_reset_peak_usage = Module["_zend_memory_reset_peak_usage"] = Module["asm"]["zend_memory_reset_peak_usage"]).apply(null, arguments);
};

var _php_lookup_class_name = Module["_php_lookup_class_name"] = function() {
 return (_php_lookup_class_name = Module["_php_lookup_class_name"] = Module["asm"]["php_lookup_class_name"]).apply(null, arguments);
};

var _php_canonicalize_version = Module["_php_canonicalize_version"] = function() {
 return (_php_canonicalize_version = Module["_php_canonicalize_version"] = Module["asm"]["php_canonicalize_version"]).apply(null, arguments);
};

var _zend_throw_exception_internal = Module["_zend_throw_exception_internal"] = function() {
 return (_zend_throw_exception_internal = Module["_zend_throw_exception_internal"] = Module["asm"]["zend_throw_exception_internal"]).apply(null, arguments);
};

var _zend_throw_unwind_exit = Module["_zend_throw_unwind_exit"] = function() {
 return (_zend_throw_unwind_exit = Module["_zend_throw_unwind_exit"] = Module["asm"]["zend_throw_unwind_exit"]).apply(null, arguments);
};

var _php_store_class_name = Module["_php_store_class_name"] = function() {
 return (_php_store_class_name = Module["_php_store_class_name"] = Module["asm"]["php_store_class_name"]).apply(null, arguments);
};

var _zend_objects_new = Module["_zend_objects_new"] = function() {
 return (_zend_objects_new = Module["_zend_objects_new"] = Module["asm"]["zend_objects_new"]).apply(null, arguments);
};

var _php_url_scanner_add_var = Module["_php_url_scanner_add_var"] = function() {
 return (_php_url_scanner_add_var = Module["_php_url_scanner_add_var"] = Module["asm"]["php_url_scanner_add_var"]).apply(null, arguments);
};

var _php_url_scanner_reset_session_vars = Module["_php_url_scanner_reset_session_vars"] = function() {
 return (_php_url_scanner_reset_session_vars = Module["_php_url_scanner_reset_session_vars"] = Module["asm"]["php_url_scanner_reset_session_vars"]).apply(null, arguments);
};

var _php_url_scanner_reset_vars = Module["_php_url_scanner_reset_vars"] = function() {
 return (_php_url_scanner_reset_vars = Module["_php_url_scanner_reset_vars"] = Module["asm"]["php_url_scanner_reset_vars"]).apply(null, arguments);
};

var _php_url_scanner_reset_var = Module["_php_url_scanner_reset_var"] = function() {
 return (_php_url_scanner_reset_var = Module["_php_url_scanner_reset_var"] = Module["asm"]["php_url_scanner_reset_var"]).apply(null, arguments);
};

var _php_output_start_internal = Module["_php_output_start_internal"] = function() {
 return (_php_output_start_internal = Module["_php_output_start_internal"] = Module["asm"]["php_output_start_internal"]).apply(null, arguments);
};

var _strtok_r = Module["_strtok_r"] = function() {
 return (_strtok_r = Module["_strtok_r"] = Module["asm"]["strtok_r"]).apply(null, arguments);
};

var _php_stream_wrapper_log_error = Module["_php_stream_wrapper_log_error"] = function() {
 return (_php_stream_wrapper_log_error = Module["_php_stream_wrapper_log_error"] = Module["asm"]["php_stream_wrapper_log_error"]).apply(null, arguments);
};

var _php_stream_context_get_option = Module["_php_stream_context_get_option"] = function() {
 return (_php_stream_context_get_option = Module["_php_stream_context_get_option"] = Module["asm"]["php_stream_context_get_option"]).apply(null, arguments);
};

var _php_stream_notification_notify = Module["_php_stream_notification_notify"] = function() {
 return (_php_stream_notification_notify = Module["_php_stream_notification_notify"] = Module["asm"]["php_stream_notification_notify"]).apply(null, arguments);
};

var _php_stream_context_set = Module["_php_stream_context_set"] = function() {
 return (_php_stream_context_set = Module["_php_stream_context_set"] = Module["asm"]["php_stream_context_set"]).apply(null, arguments);
};

var _php_stream_xport_crypto_setup = Module["_php_stream_xport_crypto_setup"] = function() {
 return (_php_stream_xport_crypto_setup = Module["_php_stream_xport_crypto_setup"] = Module["asm"]["php_stream_xport_crypto_setup"]).apply(null, arguments);
};

var _php_stream_xport_crypto_enable = Module["_php_stream_xport_crypto_enable"] = function() {
 return (_php_stream_xport_crypto_enable = Module["_php_stream_xport_crypto_enable"] = Module["asm"]["php_stream_xport_crypto_enable"]).apply(null, arguments);
};

var __php_stream_sock_open_host = Module["__php_stream_sock_open_host"] = function() {
 return (__php_stream_sock_open_host = Module["__php_stream_sock_open_host"] = Module["asm"]["_php_stream_sock_open_host"]).apply(null, arguments);
};

var __php_stream_alloc = Module["__php_stream_alloc"] = function() {
 return (__php_stream_alloc = Module["__php_stream_alloc"] = Module["asm"]["_php_stream_alloc"]).apply(null, arguments);
};

var _mktime = Module["_mktime"] = function() {
 return (_mktime = Module["_mktime"] = Module["asm"]["mktime"]).apply(null, arguments);
};

var _zend_set_local_var_str = Module["_zend_set_local_var_str"] = function() {
 return (_zend_set_local_var_str = Module["_zend_set_local_var_str"] = Module["asm"]["zend_set_local_var_str"]).apply(null, arguments);
};

var _php_stream_context_set_option = Module["_php_stream_context_set_option"] = function() {
 return (_php_stream_context_set_option = Module["_php_stream_context_set_option"] = Module["asm"]["php_stream_context_set_option"]).apply(null, arguments);
};

var _php_stream_filter_create = Module["_php_stream_filter_create"] = function() {
 return (_php_stream_filter_create = Module["_php_stream_filter_create"] = Module["asm"]["php_stream_filter_create"]).apply(null, arguments);
};

var _php_stream_filter_free = Module["_php_stream_filter_free"] = function() {
 return (_php_stream_filter_free = Module["_php_stream_filter_free"] = Module["asm"]["php_stream_filter_free"]).apply(null, arguments);
};

var __php_stream_filter_append = Module["__php_stream_filter_append"] = function() {
 return (__php_stream_filter_append = Module["__php_stream_filter_append"] = Module["asm"]["_php_stream_filter_append"]).apply(null, arguments);
};

var _php_stream_mode_from_str = Module["_php_stream_mode_from_str"] = function() {
 return (_php_stream_mode_from_str = Module["_php_stream_mode_from_str"] = Module["asm"]["php_stream_mode_from_str"]).apply(null, arguments);
};

var __php_stream_temp_create = Module["__php_stream_temp_create"] = function() {
 return (__php_stream_temp_create = Module["__php_stream_temp_create"] = Module["asm"]["_php_stream_temp_create"]).apply(null, arguments);
};

var __php_stream_memory_create = Module["__php_stream_memory_create"] = function() {
 return (__php_stream_memory_create = Module["__php_stream_memory_create"] = Module["asm"]["_php_stream_memory_create"]).apply(null, arguments);
};

var __php_stream_temp_create_ex = Module["__php_stream_temp_create_ex"] = function() {
 return (__php_stream_temp_create_ex = Module["__php_stream_temp_create_ex"] = Module["asm"]["_php_stream_temp_create_ex"]).apply(null, arguments);
};

var _dup = Module["_dup"] = function() {
 return (_dup = Module["_dup"] = Module["asm"]["dup"]).apply(null, arguments);
};

var __php_stream_sock_open_from_socket = Module["__php_stream_sock_open_from_socket"] = function() {
 return (__php_stream_sock_open_from_socket = Module["__php_stream_sock_open_from_socket"] = Module["asm"]["_php_stream_sock_open_from_socket"]).apply(null, arguments);
};

var __php_stream_fopen_from_file = Module["__php_stream_fopen_from_file"] = function() {
 return (__php_stream_fopen_from_file = Module["__php_stream_fopen_from_file"] = Module["asm"]["_php_stream_fopen_from_file"]).apply(null, arguments);
};

var __php_stream_fopen_from_fd = Module["__php_stream_fopen_from_fd"] = function() {
 return (__php_stream_fopen_from_fd = Module["__php_stream_fopen_from_fd"] = Module["asm"]["_php_stream_fopen_from_fd"]).apply(null, arguments);
};

var _sapi_read_post_block = Module["_sapi_read_post_block"] = function() {
 return (_sapi_read_post_block = Module["_sapi_read_post_block"] = Module["asm"]["sapi_read_post_block"]).apply(null, arguments);
};

var _var_destroy = Module["_var_destroy"] = function() {
 return (_var_destroy = Module["_var_destroy"] = Module["asm"]["var_destroy"]).apply(null, arguments);
};

var __efree_large = Module["__efree_large"] = function() {
 return (__efree_large = Module["__efree_large"] = Module["asm"]["_efree_large"]).apply(null, arguments);
};

var _zend_is_valid_class_name = Module["_zend_is_valid_class_name"] = function() {
 return (_zend_is_valid_class_name = Module["_zend_is_valid_class_name"] = Module["asm"]["zend_is_valid_class_name"]).apply(null, arguments);
};

var _zend_ref_del_type_source = Module["_zend_ref_del_type_source"] = function() {
 return (_zend_ref_del_type_source = Module["_zend_ref_del_type_source"] = Module["asm"]["zend_ref_del_type_source"]).apply(null, arguments);
};

var _zend_hash_lookup = Module["_zend_hash_lookup"] = function() {
 return (_zend_hash_lookup = Module["_zend_hash_lookup"] = Module["asm"]["zend_hash_lookup"]).apply(null, arguments);
};

var _zend_verify_prop_assignable_by_ref = Module["_zend_verify_prop_assignable_by_ref"] = function() {
 return (_zend_verify_prop_assignable_by_ref = Module["_zend_verify_prop_assignable_by_ref"] = Module["asm"]["zend_verify_prop_assignable_by_ref"]).apply(null, arguments);
};

var _make_sha1_digest = Module["_make_sha1_digest"] = function() {
 return (_make_sha1_digest = Module["_make_sha1_digest"] = Module["asm"]["make_sha1_digest"]).apply(null, arguments);
};

var _zend_register_resource = Module["_zend_register_resource"] = function() {
 return (_zend_register_resource = Module["_zend_register_resource"] = Module["asm"]["zend_register_resource"]).apply(null, arguments);
};

var _php_stream_bucket_make_writeable = Module["_php_stream_bucket_make_writeable"] = function() {
 return (_php_stream_bucket_make_writeable = Module["_php_stream_bucket_make_writeable"] = Module["asm"]["php_stream_bucket_make_writeable"]).apply(null, arguments);
};

var _php_stream_bucket_new = Module["_php_stream_bucket_new"] = function() {
 return (_php_stream_bucket_new = Module["_php_stream_bucket_new"] = Module["asm"]["php_stream_bucket_new"]).apply(null, arguments);
};

var _php_stream_filter_register_factory_volatile = Module["_php_stream_filter_register_factory_volatile"] = function() {
 return (_php_stream_filter_register_factory_volatile = Module["_php_stream_filter_register_factory_volatile"] = Module["asm"]["php_stream_filter_register_factory_volatile"]).apply(null, arguments);
};

var _php_stream_bucket_delref = Module["_php_stream_bucket_delref"] = function() {
 return (_php_stream_bucket_delref = Module["_php_stream_bucket_delref"] = Module["asm"]["php_stream_bucket_delref"]).apply(null, arguments);
};

var _add_property_zval_ex = Module["_add_property_zval_ex"] = function() {
 return (_add_property_zval_ex = Module["_add_property_zval_ex"] = Module["asm"]["add_property_zval_ex"]).apply(null, arguments);
};

var _add_property_stringl_ex = Module["_add_property_stringl_ex"] = function() {
 return (_add_property_stringl_ex = Module["_add_property_stringl_ex"] = Module["asm"]["add_property_stringl_ex"]).apply(null, arguments);
};

var _add_property_long_ex = Module["_add_property_long_ex"] = function() {
 return (_add_property_long_ex = Module["_add_property_long_ex"] = Module["asm"]["add_property_long_ex"]).apply(null, arguments);
};

var _php_stream_bucket_append = Module["_php_stream_bucket_append"] = function() {
 return (_php_stream_bucket_append = Module["_php_stream_bucket_append"] = Module["asm"]["php_stream_bucket_append"]).apply(null, arguments);
};

var _php_stream_bucket_prepend = Module["_php_stream_bucket_prepend"] = function() {
 return (_php_stream_bucket_prepend = Module["_php_stream_bucket_prepend"] = Module["asm"]["php_stream_bucket_prepend"]).apply(null, arguments);
};

var __php_stream_filter_alloc = Module["__php_stream_filter_alloc"] = function() {
 return (__php_stream_filter_alloc = Module["__php_stream_filter_alloc"] = Module["asm"]["_php_stream_filter_alloc"]).apply(null, arguments);
};

var _zend_call_method_if_exists = Module["_zend_call_method_if_exists"] = function() {
 return (_zend_call_method_if_exists = Module["_zend_call_method_if_exists"] = Module["asm"]["zend_call_method_if_exists"]).apply(null, arguments);
};

var _add_property_string_ex = Module["_add_property_string_ex"] = function() {
 return (_add_property_string_ex = Module["_add_property_string_ex"] = Module["asm"]["add_property_string_ex"]).apply(null, arguments);
};

var _add_property_null_ex = Module["_add_property_null_ex"] = function() {
 return (_add_property_null_ex = Module["_add_property_null_ex"] = Module["asm"]["add_property_null_ex"]).apply(null, arguments);
};

var _php_uuencode = Module["_php_uuencode"] = function() {
 return (_php_uuencode = Module["_php_uuencode"] = Module["asm"]["php_uuencode"]).apply(null, arguments);
};

var _php_uudecode = Module["_php_uudecode"] = function() {
 return (_php_uudecode = Module["_php_uudecode"] = Module["asm"]["php_uudecode"]).apply(null, arguments);
};

var _php_stream_filter_register_factory = Module["_php_stream_filter_register_factory"] = function() {
 return (_php_stream_filter_register_factory = Module["_php_stream_filter_register_factory"] = Module["asm"]["php_stream_filter_register_factory"]).apply(null, arguments);
};

var _php_stream_filter_unregister_factory = Module["_php_stream_filter_unregister_factory"] = function() {
 return (_php_stream_filter_unregister_factory = Module["_php_stream_filter_unregister_factory"] = Module["asm"]["php_stream_filter_unregister_factory"]).apply(null, arguments);
};

var _php_stream_bucket_unlink = Module["_php_stream_bucket_unlink"] = function() {
 return (_php_stream_bucket_unlink = Module["_php_stream_bucket_unlink"] = Module["asm"]["php_stream_bucket_unlink"]).apply(null, arguments);
};

var _kill = Module["_kill"] = function() {
 return (_kill = Module["_kill"] = Module["asm"]["kill"]).apply(null, arguments);
};

var _posix_spawn_file_actions_init = Module["_posix_spawn_file_actions_init"] = function() {
 return (_posix_spawn_file_actions_init = Module["_posix_spawn_file_actions_init"] = Module["asm"]["posix_spawn_file_actions_init"]).apply(null, arguments);
};

var _posix_spawn_file_actions_destroy = Module["_posix_spawn_file_actions_destroy"] = function() {
 return (_posix_spawn_file_actions_destroy = Module["_posix_spawn_file_actions_destroy"] = Module["asm"]["posix_spawn_file_actions_destroy"]).apply(null, arguments);
};

var _posix_spawn_file_actions_addchdir_np = Module["_posix_spawn_file_actions_addchdir_np"] = function() {
 return (_posix_spawn_file_actions_addchdir_np = Module["_posix_spawn_file_actions_addchdir_np"] = Module["asm"]["posix_spawn_file_actions_addchdir_np"]).apply(null, arguments);
};

var _posix_spawn = Module["_posix_spawn"] = function() {
 return (_posix_spawn = Module["_posix_spawn"] = Module["asm"]["posix_spawn"]).apply(null, arguments);
};

var _waitpid = Module["_waitpid"] = function() {
 return (_waitpid = Module["_waitpid"] = Module["asm"]["waitpid"]).apply(null, arguments);
};

var __php_stream_cast = Module["__php_stream_cast"] = function() {
 return (__php_stream_cast = Module["__php_stream_cast"] = Module["asm"]["_php_stream_cast"]).apply(null, arguments);
};

var _pipe = Module["_pipe"] = function() {
 return (_pipe = Module["_pipe"] = Module["asm"]["pipe"]).apply(null, arguments);
};

var _socketpair = Module["_socketpair"] = function() {
 return (_socketpair = Module["_socketpair"] = Module["asm"]["socketpair"]).apply(null, arguments);
};

var _php_socket_error_str = Module["_php_socket_error_str"] = function() {
 return (_php_socket_error_str = Module["_php_socket_error_str"] = Module["asm"]["php_socket_error_str"]).apply(null, arguments);
};

var _openpty = Module["_openpty"] = function() {
 return (_openpty = Module["_openpty"] = Module["asm"]["openpty"]).apply(null, arguments);
};

var _posix_spawn_file_actions_addclose = Module["_posix_spawn_file_actions_addclose"] = function() {
 return (_posix_spawn_file_actions_addclose = Module["_posix_spawn_file_actions_addclose"] = Module["asm"]["posix_spawn_file_actions_addclose"]).apply(null, arguments);
};

var _posix_spawn_file_actions_adddup2 = Module["_posix_spawn_file_actions_adddup2"] = function() {
 return (_posix_spawn_file_actions_adddup2 = Module["_posix_spawn_file_actions_adddup2"] = Module["asm"]["posix_spawn_file_actions_adddup2"]).apply(null, arguments);
};

var _php_socket_strerror = Module["_php_socket_strerror"] = function() {
 return (_php_socket_strerror = Module["_php_socket_strerror"] = Module["asm"]["php_socket_strerror"]).apply(null, arguments);
};

var _add_next_index_resource = Module["_add_next_index_resource"] = function() {
 return (_add_next_index_resource = Module["_add_next_index_resource"] = Module["asm"]["add_next_index_resource"]).apply(null, arguments);
};

var _php_stream_xport_accept = Module["_php_stream_xport_accept"] = function() {
 return (_php_stream_xport_accept = Module["_php_stream_xport_accept"] = Module["asm"]["php_stream_xport_accept"]).apply(null, arguments);
};

var _php_stream_xport_get_name = Module["_php_stream_xport_get_name"] = function() {
 return (_php_stream_xport_get_name = Module["_php_stream_xport_get_name"] = Module["asm"]["php_stream_xport_get_name"]).apply(null, arguments);
};

var _php_network_parse_network_address_with_port = Module["_php_network_parse_network_address_with_port"] = function() {
 return (_php_network_parse_network_address_with_port = Module["_php_network_parse_network_address_with_port"] = Module["asm"]["php_network_parse_network_address_with_port"]).apply(null, arguments);
};

var _php_stream_xport_sendto = Module["_php_stream_xport_sendto"] = function() {
 return (_php_stream_xport_sendto = Module["_php_stream_xport_sendto"] = Module["asm"]["php_stream_xport_sendto"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_null = Module["_zend_try_assign_typed_ref_null"] = function() {
 return (_zend_try_assign_typed_ref_null = Module["_zend_try_assign_typed_ref_null"] = Module["asm"]["zend_try_assign_typed_ref_null"]).apply(null, arguments);
};

var _php_stream_xport_recvfrom = Module["_php_stream_xport_recvfrom"] = function() {
 return (_php_stream_xport_recvfrom = Module["_php_stream_xport_recvfrom"] = Module["asm"]["php_stream_xport_recvfrom"]).apply(null, arguments);
};

var _select = Module["_select"] = function() {
 return (_select = Module["_select"] = Module["asm"]["select"]).apply(null, arguments);
};

var _php_file_le_stream_filter = Module["_php_file_le_stream_filter"] = function() {
 return (_php_file_le_stream_filter = Module["_php_file_le_stream_filter"] = Module["asm"]["php_file_le_stream_filter"]).apply(null, arguments);
};

var __php_stream_filter_flush = Module["__php_stream_filter_flush"] = function() {
 return (__php_stream_filter_flush = Module["__php_stream_filter_flush"] = Module["asm"]["_php_stream_filter_flush"]).apply(null, arguments);
};

var _php_stream_filter_remove = Module["_php_stream_filter_remove"] = function() {
 return (_php_stream_filter_remove = Module["_php_stream_filter_remove"] = Module["asm"]["php_stream_filter_remove"]).apply(null, arguments);
};

var _php_stream_get_record = Module["_php_stream_get_record"] = function() {
 return (_php_stream_get_record = Module["_php_stream_get_record"] = Module["asm"]["php_stream_get_record"]).apply(null, arguments);
};

var _isatty = Module["_isatty"] = function() {
 return (_isatty = Module["_isatty"] = Module["asm"]["isatty"]).apply(null, arguments);
};

var _php_stream_xport_shutdown = Module["_php_stream_xport_shutdown"] = function() {
 return (_php_stream_xport_shutdown = Module["_php_stream_xport_shutdown"] = Module["asm"]["php_stream_xport_shutdown"]).apply(null, arguments);
};

var __php_emit_fd_setsize_warning = Module["__php_emit_fd_setsize_warning"] = function() {
 return (__php_emit_fd_setsize_warning = Module["__php_emit_fd_setsize_warning"] = Module["asm"]["_php_emit_fd_setsize_warning"]).apply(null, arguments);
};

var _php_stream_notification_free = Module["_php_stream_notification_free"] = function() {
 return (_php_stream_notification_free = Module["_php_stream_notification_free"] = Module["asm"]["php_stream_notification_free"]).apply(null, arguments);
};

var _php_stream_notification_alloc = Module["_php_stream_notification_alloc"] = function() {
 return (_php_stream_notification_alloc = Module["_php_stream_notification_alloc"] = Module["asm"]["php_stream_notification_alloc"]).apply(null, arguments);
};

var _php_stream_filter_append_ex = Module["_php_stream_filter_append_ex"] = function() {
 return (_php_stream_filter_append_ex = Module["_php_stream_filter_append_ex"] = Module["asm"]["php_stream_filter_append_ex"]).apply(null, arguments);
};

var _php_stream_filter_prepend_ex = Module["_php_stream_filter_prepend_ex"] = function() {
 return (_php_stream_filter_prepend_ex = Module["_php_stream_filter_prepend_ex"] = Module["asm"]["php_stream_filter_prepend_ex"]).apply(null, arguments);
};

var _php_url_encode_hash_ex = Module["_php_url_encode_hash_ex"] = function() {
 return (_php_url_encode_hash_ex = Module["_php_url_encode_hash_ex"] = Module["asm"]["php_url_encode_hash_ex"]).apply(null, arguments);
};

var _zend_ini_str = Module["_zend_ini_str"] = function() {
 return (_zend_ini_str = Module["_zend_ini_str"] = Module["asm"]["zend_ini_str"]).apply(null, arguments);
};

var _zend_check_property_access = Module["_zend_check_property_access"] = function() {
 return (_zend_check_property_access = Module["_zend_check_property_access"] = Module["asm"]["zend_check_property_access"]).apply(null, arguments);
};

var _zend_double_to_str = Module["_zend_double_to_str"] = function() {
 return (_zend_double_to_str = Module["_zend_double_to_str"] = Module["asm"]["zend_double_to_str"]).apply(null, arguments);
};

var _php_password_algo_register = Module["_php_password_algo_register"] = function() {
 return (_php_password_algo_register = Module["_php_password_algo_register"] = Module["asm"]["php_password_algo_register"]).apply(null, arguments);
};

var _php_password_algo_unregister = Module["_php_password_algo_unregister"] = function() {
 return (_php_password_algo_unregister = Module["_php_password_algo_unregister"] = Module["asm"]["php_password_algo_unregister"]).apply(null, arguments);
};

var _php_password_algo_default = Module["_php_password_algo_default"] = function() {
 return (_php_password_algo_default = Module["_php_password_algo_default"] = Module["asm"]["php_password_algo_default"]).apply(null, arguments);
};

var _php_password_algo_find = Module["_php_password_algo_find"] = function() {
 return (_php_password_algo_find = Module["_php_password_algo_find"] = Module["asm"]["php_password_algo_find"]).apply(null, arguments);
};

var _php_password_algo_extract_ident = Module["_php_password_algo_extract_ident"] = function() {
 return (_php_password_algo_extract_ident = Module["_php_password_algo_extract_ident"] = Module["asm"]["php_password_algo_extract_ident"]).apply(null, arguments);
};

var _php_password_algo_identify_ex = Module["_php_password_algo_identify_ex"] = function() {
 return (_php_password_algo_identify_ex = Module["_php_password_algo_identify_ex"] = Module["asm"]["php_password_algo_identify_ex"]).apply(null, arguments);
};

var _php_inet_ntop = Module["_php_inet_ntop"] = function() {
 return (_php_inet_ntop = Module["_php_inet_ntop"] = Module["asm"]["php_inet_ntop"]).apply(null, arguments);
};

var _getifaddrs = Module["_getifaddrs"] = function() {
 return (_getifaddrs = Module["_getifaddrs"] = Module["asm"]["getifaddrs"]).apply(null, arguments);
};

var _freeifaddrs = Module["_freeifaddrs"] = function() {
 return (_freeifaddrs = Module["_freeifaddrs"] = Module["asm"]["freeifaddrs"]).apply(null, arguments);
};

var _clock_gettime = Module["_clock_gettime"] = function() {
 return (_clock_gettime = Module["_clock_gettime"] = Module["asm"]["clock_gettime"]).apply(null, arguments);
};

var _vrzno_expose_inc_refcount = Module["_vrzno_expose_inc_refcount"] = function() {
 return (_vrzno_expose_inc_refcount = Module["_vrzno_expose_inc_refcount"] = Module["asm"]["vrzno_expose_inc_refcount"]).apply(null, arguments);
};

var _vrzno_expose_dec_refcount = Module["_vrzno_expose_dec_refcount"] = function() {
 return (_vrzno_expose_dec_refcount = Module["_vrzno_expose_dec_refcount"] = Module["asm"]["vrzno_expose_dec_refcount"]).apply(null, arguments);
};

var _vrzno_expose_zrefcount = Module["_vrzno_expose_zrefcount"] = function() {
 return (_vrzno_expose_zrefcount = Module["_vrzno_expose_zrefcount"] = Module["asm"]["vrzno_expose_zrefcount"]).apply(null, arguments);
};

var _vrzno_expose_inc_crefcount = Module["_vrzno_expose_inc_crefcount"] = function() {
 return (_vrzno_expose_inc_crefcount = Module["_vrzno_expose_inc_crefcount"] = Module["asm"]["vrzno_expose_inc_crefcount"]).apply(null, arguments);
};

var _vrzno_expose_dec_crefcount = Module["_vrzno_expose_dec_crefcount"] = function() {
 return (_vrzno_expose_dec_crefcount = Module["_vrzno_expose_dec_crefcount"] = Module["asm"]["vrzno_expose_dec_crefcount"]).apply(null, arguments);
};

var _vrzno_expose_efree = Module["_vrzno_expose_efree"] = function() {
 return (_vrzno_expose_efree = Module["_vrzno_expose_efree"] = Module["asm"]["vrzno_expose_efree"]).apply(null, arguments);
};

var _vrzno_expose_create_bool = Module["_vrzno_expose_create_bool"] = function() {
 return (_vrzno_expose_create_bool = Module["_vrzno_expose_create_bool"] = Module["asm"]["vrzno_expose_create_bool"]).apply(null, arguments);
};

var _vrzno_expose_create_null = Module["_vrzno_expose_create_null"] = function() {
 return (_vrzno_expose_create_null = Module["_vrzno_expose_create_null"] = Module["asm"]["vrzno_expose_create_null"]).apply(null, arguments);
};

var _vrzno_expose_create_undef = Module["_vrzno_expose_create_undef"] = function() {
 return (_vrzno_expose_create_undef = Module["_vrzno_expose_create_undef"] = Module["asm"]["vrzno_expose_create_undef"]).apply(null, arguments);
};

var _vrzno_expose_create_long = Module["_vrzno_expose_create_long"] = function() {
 return (_vrzno_expose_create_long = Module["_vrzno_expose_create_long"] = Module["asm"]["vrzno_expose_create_long"]).apply(null, arguments);
};

var _vrzno_expose_create_double = Module["_vrzno_expose_create_double"] = function() {
 return (_vrzno_expose_create_double = Module["_vrzno_expose_create_double"] = Module["asm"]["vrzno_expose_create_double"]).apply(null, arguments);
};

var _vrzno_expose_create_string = Module["_vrzno_expose_create_string"] = function() {
 return (_vrzno_expose_create_string = Module["_vrzno_expose_create_string"] = Module["asm"]["vrzno_expose_create_string"]).apply(null, arguments);
};

var _vrzno_expose_create_object_for_target = Module["_vrzno_expose_create_object_for_target"] = function() {
 return (_vrzno_expose_create_object_for_target = Module["_vrzno_expose_create_object_for_target"] = Module["asm"]["vrzno_expose_create_object_for_target"]).apply(null, arguments);
};

var _vrzno_expose_create_params = Module["_vrzno_expose_create_params"] = function() {
 return (_vrzno_expose_create_params = Module["_vrzno_expose_create_params"] = Module["asm"]["vrzno_expose_create_params"]).apply(null, arguments);
};

var _vrzno_expose_object_keys = Module["_vrzno_expose_object_keys"] = function() {
 return (_vrzno_expose_object_keys = Module["_vrzno_expose_object_keys"] = Module["asm"]["vrzno_expose_object_keys"]).apply(null, arguments);
};

var _vrzno_expose_array_keys = Module["_vrzno_expose_array_keys"] = function() {
 return (_vrzno_expose_array_keys = Module["_vrzno_expose_array_keys"] = Module["asm"]["vrzno_expose_array_keys"]).apply(null, arguments);
};

var _vrzno_expose_zval_deref = Module["_vrzno_expose_zval_deref"] = function() {
 return (_vrzno_expose_zval_deref = Module["_vrzno_expose_zval_deref"] = Module["asm"]["vrzno_expose_zval_deref"]).apply(null, arguments);
};

var _vrzno_expose_zval_dump = Module["_vrzno_expose_zval_dump"] = function() {
 return (_vrzno_expose_zval_dump = Module["_vrzno_expose_zval_dump"] = Module["asm"]["vrzno_expose_zval_dump"]).apply(null, arguments);
};

var _vrzno_expose_type = Module["_vrzno_expose_type"] = function() {
 return (_vrzno_expose_type = Module["_vrzno_expose_type"] = Module["asm"]["vrzno_expose_type"]).apply(null, arguments);
};

var _vrzno_expose_array_length = Module["_vrzno_expose_array_length"] = function() {
 return (_vrzno_expose_array_length = Module["_vrzno_expose_array_length"] = Module["asm"]["vrzno_expose_array_length"]).apply(null, arguments);
};

var _vrzno_expose_target = Module["_vrzno_expose_target"] = function() {
 return (_vrzno_expose_target = Module["_vrzno_expose_target"] = Module["asm"]["vrzno_expose_target"]).apply(null, arguments);
};

var _vrzno_expose_callable = Module["_vrzno_expose_callable"] = function() {
 return (_vrzno_expose_callable = Module["_vrzno_expose_callable"] = Module["asm"]["vrzno_expose_callable"]).apply(null, arguments);
};

var _vrzno_expose_long = Module["_vrzno_expose_long"] = function() {
 return (_vrzno_expose_long = Module["_vrzno_expose_long"] = Module["asm"]["vrzno_expose_long"]).apply(null, arguments);
};

var _vrzno_expose_double = Module["_vrzno_expose_double"] = function() {
 return (_vrzno_expose_double = Module["_vrzno_expose_double"] = Module["asm"]["vrzno_expose_double"]).apply(null, arguments);
};

var _vrzno_expose_string = Module["_vrzno_expose_string"] = function() {
 return (_vrzno_expose_string = Module["_vrzno_expose_string"] = Module["asm"]["vrzno_expose_string"]).apply(null, arguments);
};

var _vrzno_expose_key_pointer = Module["_vrzno_expose_key_pointer"] = function() {
 return (_vrzno_expose_key_pointer = Module["_vrzno_expose_key_pointer"] = Module["asm"]["vrzno_expose_key_pointer"]).apply(null, arguments);
};

var _vrzno_expose_property_pointer = Module["_vrzno_expose_property_pointer"] = function() {
 return (_vrzno_expose_property_pointer = Module["_vrzno_expose_property_pointer"] = Module["asm"]["vrzno_expose_property_pointer"]).apply(null, arguments);
};

var _vrzno_expose_dimension_pointer = Module["_vrzno_expose_dimension_pointer"] = function() {
 return (_vrzno_expose_dimension_pointer = Module["_vrzno_expose_dimension_pointer"] = Module["asm"]["vrzno_expose_dimension_pointer"]).apply(null, arguments);
};

var _vrzno_expose_method_pointer = Module["_vrzno_expose_method_pointer"] = function() {
 return (_vrzno_expose_method_pointer = Module["_vrzno_expose_method_pointer"] = Module["asm"]["vrzno_expose_method_pointer"]).apply(null, arguments);
};

var _zend_register_internal_class = Module["_zend_register_internal_class"] = function() {
 return (_zend_register_internal_class = Module["_zend_register_internal_class"] = Module["asm"]["zend_register_internal_class"]).apply(null, arguments);
};

var _vrzno_exec_callback = Module["_vrzno_exec_callback"] = function() {
 return (_vrzno_exec_callback = Module["_vrzno_exec_callback"] = Module["asm"]["vrzno_exec_callback"]).apply(null, arguments);
};

var _vrzno_del_callback = Module["_vrzno_del_callback"] = function() {
 return (_vrzno_del_callback = Module["_vrzno_del_callback"] = Module["asm"]["vrzno_del_callback"]).apply(null, arguments);
};

var _zip_open = Module["_zip_open"] = function() {
 return (_zip_open = Module["_zip_open"] = Module["asm"]["zip_open"]).apply(null, arguments);
};

var _zip_get_num_entries = Module["_zip_get_num_entries"] = function() {
 return (_zip_get_num_entries = Module["_zip_get_num_entries"] = Module["asm"]["zip_get_num_entries"]).apply(null, arguments);
};

var _zip_stat_index = Module["_zip_stat_index"] = function() {
 return (_zip_stat_index = Module["_zip_stat_index"] = Module["asm"]["zip_stat_index"]).apply(null, arguments);
};

var _zip_fopen_index = Module["_zip_fopen_index"] = function() {
 return (_zip_fopen_index = Module["_zip_fopen_index"] = Module["asm"]["zip_fopen_index"]).apply(null, arguments);
};

var _zip_fread = Module["_zip_fread"] = function() {
 return (_zip_fread = Module["_zip_fread"] = Module["asm"]["zip_fread"]).apply(null, arguments);
};

var _zip_close = Module["_zip_close"] = function() {
 return (_zip_close = Module["_zip_close"] = Module["asm"]["zip_close"]).apply(null, arguments);
};

var _zip_set_default_password = Module["_zip_set_default_password"] = function() {
 return (_zip_set_default_password = Module["_zip_set_default_password"] = Module["asm"]["zip_set_default_password"]).apply(null, arguments);
};

var _zip_strerror = Module["_zip_strerror"] = function() {
 return (_zip_strerror = Module["_zip_strerror"] = Module["asm"]["zip_strerror"]).apply(null, arguments);
};

var _zip_get_error = Module["_zip_get_error"] = function() {
 return (_zip_get_error = Module["_zip_get_error"] = Module["asm"]["zip_get_error"]).apply(null, arguments);
};

var _zip_error_code_zip = Module["_zip_error_code_zip"] = function() {
 return (_zip_error_code_zip = Module["_zip_error_code_zip"] = Module["asm"]["zip_error_code_zip"]).apply(null, arguments);
};

var _zip_error_code_system = Module["_zip_error_code_system"] = function() {
 return (_zip_error_code_system = Module["_zip_error_code_system"] = Module["asm"]["zip_error_code_system"]).apply(null, arguments);
};

var _zip_error_fini = Module["_zip_error_fini"] = function() {
 return (_zip_error_fini = Module["_zip_error_fini"] = Module["asm"]["zip_error_fini"]).apply(null, arguments);
};

var _zip_discard = Module["_zip_discard"] = function() {
 return (_zip_discard = Module["_zip_discard"] = Module["asm"]["zip_discard"]).apply(null, arguments);
};

var _zip_error_clear = Module["_zip_error_clear"] = function() {
 return (_zip_error_clear = Module["_zip_error_clear"] = Module["asm"]["zip_error_clear"]).apply(null, arguments);
};

var _zip_error_strerror = Module["_zip_error_strerror"] = function() {
 return (_zip_error_strerror = Module["_zip_error_strerror"] = Module["asm"]["zip_error_strerror"]).apply(null, arguments);
};

var _zip_error_init = Module["_zip_error_init"] = function() {
 return (_zip_error_init = Module["_zip_error_init"] = Module["asm"]["zip_error_init"]).apply(null, arguments);
};

var _zip_error_set = Module["_zip_error_set"] = function() {
 return (_zip_error_set = Module["_zip_error_set"] = Module["asm"]["zip_error_set"]).apply(null, arguments);
};

var _zip_dir_add = Module["_zip_dir_add"] = function() {
 return (_zip_dir_add = Module["_zip_dir_add"] = Module["asm"]["zip_dir_add"]).apply(null, arguments);
};

var _zip_source_buffer = Module["_zip_source_buffer"] = function() {
 return (_zip_source_buffer = Module["_zip_source_buffer"] = Module["asm"]["zip_source_buffer"]).apply(null, arguments);
};

var _zip_file_add = Module["_zip_file_add"] = function() {
 return (_zip_file_add = Module["_zip_file_add"] = Module["asm"]["zip_file_add"]).apply(null, arguments);
};

var _zip_source_free = Module["_zip_source_free"] = function() {
 return (_zip_source_free = Module["_zip_source_free"] = Module["asm"]["zip_source_free"]).apply(null, arguments);
};

var _zip_stat = Module["_zip_stat"] = function() {
 return (_zip_stat = Module["_zip_stat"] = Module["asm"]["zip_stat"]).apply(null, arguments);
};

var _zip_name_locate = Module["_zip_name_locate"] = function() {
 return (_zip_name_locate = Module["_zip_name_locate"] = Module["asm"]["zip_name_locate"]).apply(null, arguments);
};

var _zip_get_name = Module["_zip_get_name"] = function() {
 return (_zip_get_name = Module["_zip_get_name"] = Module["asm"]["zip_get_name"]).apply(null, arguments);
};

var _zip_set_archive_comment = Module["_zip_set_archive_comment"] = function() {
 return (_zip_set_archive_comment = Module["_zip_set_archive_comment"] = Module["asm"]["zip_set_archive_comment"]).apply(null, arguments);
};

var _zip_get_archive_comment = Module["_zip_get_archive_comment"] = function() {
 return (_zip_get_archive_comment = Module["_zip_get_archive_comment"] = Module["asm"]["zip_get_archive_comment"]).apply(null, arguments);
};

var _zip_set_archive_flag = Module["_zip_set_archive_flag"] = function() {
 return (_zip_set_archive_flag = Module["_zip_set_archive_flag"] = Module["asm"]["zip_set_archive_flag"]).apply(null, arguments);
};

var _zip_get_archive_flag = Module["_zip_get_archive_flag"] = function() {
 return (_zip_get_archive_flag = Module["_zip_get_archive_flag"] = Module["asm"]["zip_get_archive_flag"]).apply(null, arguments);
};

var _zip_file_set_comment = Module["_zip_file_set_comment"] = function() {
 return (_zip_file_set_comment = Module["_zip_file_set_comment"] = Module["asm"]["zip_file_set_comment"]).apply(null, arguments);
};

var _zip_file_set_external_attributes = Module["_zip_file_set_external_attributes"] = function() {
 return (_zip_file_set_external_attributes = Module["_zip_file_set_external_attributes"] = Module["asm"]["zip_file_set_external_attributes"]).apply(null, arguments);
};

var _zip_file_get_external_attributes = Module["_zip_file_get_external_attributes"] = function() {
 return (_zip_file_get_external_attributes = Module["_zip_file_get_external_attributes"] = Module["asm"]["zip_file_get_external_attributes"]).apply(null, arguments);
};

var _zip_file_get_comment = Module["_zip_file_get_comment"] = function() {
 return (_zip_file_get_comment = Module["_zip_file_get_comment"] = Module["asm"]["zip_file_get_comment"]).apply(null, arguments);
};

var _zip_set_file_compression = Module["_zip_set_file_compression"] = function() {
 return (_zip_set_file_compression = Module["_zip_set_file_compression"] = Module["asm"]["zip_set_file_compression"]).apply(null, arguments);
};

var _zip_delete = Module["_zip_delete"] = function() {
 return (_zip_delete = Module["_zip_delete"] = Module["asm"]["zip_delete"]).apply(null, arguments);
};

var _zip_file_rename = Module["_zip_file_rename"] = function() {
 return (_zip_file_rename = Module["_zip_file_rename"] = Module["asm"]["zip_file_rename"]).apply(null, arguments);
};

var _zip_unchange = Module["_zip_unchange"] = function() {
 return (_zip_unchange = Module["_zip_unchange"] = Module["asm"]["zip_unchange"]).apply(null, arguments);
};

var _zip_unchange_all = Module["_zip_unchange_all"] = function() {
 return (_zip_unchange_all = Module["_zip_unchange_all"] = Module["asm"]["zip_unchange_all"]).apply(null, arguments);
};

var _zip_unchange_archive = Module["_zip_unchange_archive"] = function() {
 return (_zip_unchange_archive = Module["_zip_unchange_archive"] = Module["asm"]["zip_unchange_archive"]).apply(null, arguments);
};

var _zip_source_filep = Module["_zip_source_filep"] = function() {
 return (_zip_source_filep = Module["_zip_source_filep"] = Module["asm"]["zip_source_filep"]).apply(null, arguments);
};

var _zip_source_file = Module["_zip_source_file"] = function() {
 return (_zip_source_file = Module["_zip_source_file"] = Module["asm"]["zip_source_file"]).apply(null, arguments);
};

var _zip_file_replace = Module["_zip_file_replace"] = function() {
 return (_zip_file_replace = Module["_zip_file_replace"] = Module["asm"]["zip_file_replace"]).apply(null, arguments);
};

var _virtual_file_ex = Module["_virtual_file_ex"] = function() {
 return (_virtual_file_ex = Module["_virtual_file_ex"] = Module["asm"]["virtual_file_ex"]).apply(null, arguments);
};

var _zip_fclose = Module["_zip_fclose"] = function() {
 return (_zip_fclose = Module["_zip_fclose"] = Module["asm"]["zip_fclose"]).apply(null, arguments);
};

var _zip_fopen = Module["_zip_fopen"] = function() {
 return (_zip_fopen = Module["_zip_fopen"] = Module["asm"]["zip_fopen"]).apply(null, arguments);
};

var _zend_declare_typed_class_constant = Module["_zend_declare_typed_class_constant"] = function() {
 return (_zend_declare_typed_class_constant = Module["_zend_declare_typed_class_constant"] = Module["asm"]["zend_declare_typed_class_constant"]).apply(null, arguments);
};

var _zip_libzip_version = Module["_zip_libzip_version"] = function() {
 return (_zip_libzip_version = Module["_zip_libzip_version"] = Module["asm"]["zip_libzip_version"]).apply(null, arguments);
};

var _zip_file_is_seekable = Module["_zip_file_is_seekable"] = function() {
 return (_zip_file_is_seekable = Module["_zip_file_is_seekable"] = Module["asm"]["zip_file_is_seekable"]).apply(null, arguments);
};

var _zip_file_get_error = Module["_zip_file_get_error"] = function() {
 return (_zip_file_get_error = Module["_zip_file_get_error"] = Module["asm"]["zip_file_get_error"]).apply(null, arguments);
};

var _zip_fseek = Module["_zip_fseek"] = function() {
 return (_zip_fseek = Module["_zip_fseek"] = Module["asm"]["zip_fseek"]).apply(null, arguments);
};

var _zip_ftell = Module["_zip_ftell"] = function() {
 return (_zip_ftell = Module["_zip_ftell"] = Module["asm"]["zip_ftell"]).apply(null, arguments);
};

var _php_register_internal_extensions = Module["_php_register_internal_extensions"] = function() {
 return (_php_register_internal_extensions = Module["_php_register_internal_extensions"] = Module["asm"]["php_register_internal_extensions"]).apply(null, arguments);
};

var _php_version = Module["_php_version"] = function() {
 return (_php_version = Module["_php_version"] = Module["asm"]["php_version"]).apply(null, arguments);
};

var _php_version_id = Module["_php_version_id"] = function() {
 return (_php_version_id = Module["_php_version_id"] = Module["asm"]["php_version_id"]).apply(null, arguments);
};

var _php_get_internal_encoding = Module["_php_get_internal_encoding"] = function() {
 return (_php_get_internal_encoding = Module["_php_get_internal_encoding"] = Module["asm"]["php_get_internal_encoding"]).apply(null, arguments);
};

var _php_get_input_encoding = Module["_php_get_input_encoding"] = function() {
 return (_php_get_input_encoding = Module["_php_get_input_encoding"] = Module["asm"]["php_get_input_encoding"]).apply(null, arguments);
};

var _php_get_output_encoding = Module["_php_get_output_encoding"] = function() {
 return (_php_get_output_encoding = Module["_php_get_output_encoding"] = Module["asm"]["php_get_output_encoding"]).apply(null, arguments);
};

var _php_during_module_startup = Module["_php_during_module_startup"] = function() {
 return (_php_during_module_startup = Module["_php_during_module_startup"] = Module["asm"]["php_during_module_startup"]).apply(null, arguments);
};

var _php_during_module_shutdown = Module["_php_during_module_shutdown"] = function() {
 return (_php_during_module_shutdown = Module["_php_during_module_shutdown"] = Module["asm"]["php_during_module_shutdown"]).apply(null, arguments);
};

var _php_get_module_initialized = Module["_php_get_module_initialized"] = function() {
 return (_php_get_module_initialized = Module["_php_get_module_initialized"] = Module["asm"]["php_get_module_initialized"]).apply(null, arguments);
};

var _php_write = Module["_php_write"] = function() {
 return (_php_write = Module["_php_write"] = Module["asm"]["php_write"]).apply(null, arguments);
};

var _php_verror = Module["_php_verror"] = function() {
 return (_php_verror = Module["_php_verror"] = Module["asm"]["php_verror"]).apply(null, arguments);
};

var _get_active_class_name = Module["_get_active_class_name"] = function() {
 return (_get_active_class_name = Module["_get_active_class_name"] = Module["asm"]["get_active_class_name"]).apply(null, arguments);
};

var _zend_error_zstr = Module["_zend_error_zstr"] = function() {
 return (_zend_error_zstr = Module["_zend_error_zstr"] = Module["asm"]["zend_error_zstr"]).apply(null, arguments);
};

var _php_error_docref1 = Module["_php_error_docref1"] = function() {
 return (_php_error_docref1 = Module["_php_error_docref1"] = Module["asm"]["php_error_docref1"]).apply(null, arguments);
};

var _php_html_puts = Module["_php_html_puts"] = function() {
 return (_php_html_puts = Module["_php_html_puts"] = Module["asm"]["php_html_puts"]).apply(null, arguments);
};

var _getpwuid = Module["_getpwuid"] = function() {
 return (_getpwuid = Module["_getpwuid"] = Module["asm"]["getpwuid"]).apply(null, arguments);
};

var _zend_alter_ini_entry_chars_ex = Module["_zend_alter_ini_entry_chars_ex"] = function() {
 return (_zend_alter_ini_entry_chars_ex = Module["_zend_alter_ini_entry_chars_ex"] = Module["asm"]["zend_alter_ini_entry_chars_ex"]).apply(null, arguments);
};

var _php_request_startup = Module["_php_request_startup"] = function() {
 return (_php_request_startup = Module["_php_request_startup"] = Module["asm"]["php_request_startup"]).apply(null, arguments);
};

var _zend_interned_strings_activate = Module["_zend_interned_strings_activate"] = function() {
 return (_zend_interned_strings_activate = Module["_zend_interned_strings_activate"] = Module["asm"]["zend_interned_strings_activate"]).apply(null, arguments);
};

var _php_output_activate = Module["_php_output_activate"] = function() {
 return (_php_output_activate = Module["_php_output_activate"] = Module["asm"]["php_output_activate"]).apply(null, arguments);
};

var _zend_activate = Module["_zend_activate"] = function() {
 return (_zend_activate = Module["_zend_activate"] = Module["asm"]["zend_activate"]).apply(null, arguments);
};

var _sapi_activate = Module["_sapi_activate"] = function() {
 return (_sapi_activate = Module["_sapi_activate"] = Module["asm"]["sapi_activate"]).apply(null, arguments);
};

var _zend_set_timeout = Module["_zend_set_timeout"] = function() {
 return (_zend_set_timeout = Module["_zend_set_timeout"] = Module["asm"]["zend_set_timeout"]).apply(null, arguments);
};

var _php_output_start_user = Module["_php_output_start_user"] = function() {
 return (_php_output_start_user = Module["_php_output_start_user"] = Module["asm"]["php_output_start_user"]).apply(null, arguments);
};

var _php_output_set_implicit_flush = Module["_php_output_set_implicit_flush"] = function() {
 return (_php_output_set_implicit_flush = Module["_php_output_set_implicit_flush"] = Module["asm"]["php_output_set_implicit_flush"]).apply(null, arguments);
};

var _php_hash_environment = Module["_php_hash_environment"] = function() {
 return (_php_hash_environment = Module["_php_hash_environment"] = Module["asm"]["php_hash_environment"]).apply(null, arguments);
};

var _zend_activate_modules = Module["_zend_activate_modules"] = function() {
 return (_zend_activate_modules = Module["_zend_activate_modules"] = Module["asm"]["zend_activate_modules"]).apply(null, arguments);
};

var _php_request_shutdown = Module["_php_request_shutdown"] = function() {
 return (_php_request_shutdown = Module["_php_request_shutdown"] = Module["asm"]["php_request_shutdown"]).apply(null, arguments);
};

var _zend_observer_fcall_end_all = Module["_zend_observer_fcall_end_all"] = function() {
 return (_zend_observer_fcall_end_all = Module["_zend_observer_fcall_end_all"] = Module["asm"]["zend_observer_fcall_end_all"]).apply(null, arguments);
};

var _zend_call_destructors = Module["_zend_call_destructors"] = function() {
 return (_zend_call_destructors = Module["_zend_call_destructors"] = Module["asm"]["zend_call_destructors"]).apply(null, arguments);
};

var _php_output_end_all = Module["_php_output_end_all"] = function() {
 return (_php_output_end_all = Module["_php_output_end_all"] = Module["asm"]["php_output_end_all"]).apply(null, arguments);
};

var _zend_unset_timeout = Module["_zend_unset_timeout"] = function() {
 return (_zend_unset_timeout = Module["_zend_unset_timeout"] = Module["asm"]["zend_unset_timeout"]).apply(null, arguments);
};

var _zend_deactivate_modules = Module["_zend_deactivate_modules"] = function() {
 return (_zend_deactivate_modules = Module["_zend_deactivate_modules"] = Module["asm"]["zend_deactivate_modules"]).apply(null, arguments);
};

var _php_output_deactivate = Module["_php_output_deactivate"] = function() {
 return (_php_output_deactivate = Module["_php_output_deactivate"] = Module["asm"]["php_output_deactivate"]).apply(null, arguments);
};

var _zend_deactivate = Module["_zend_deactivate"] = function() {
 return (_zend_deactivate = Module["_zend_deactivate"] = Module["asm"]["zend_deactivate"]).apply(null, arguments);
};

var _zend_post_deactivate_modules = Module["_zend_post_deactivate_modules"] = function() {
 return (_zend_post_deactivate_modules = Module["_zend_post_deactivate_modules"] = Module["asm"]["zend_post_deactivate_modules"]).apply(null, arguments);
};

var _sapi_deactivate_module = Module["_sapi_deactivate_module"] = function() {
 return (_sapi_deactivate_module = Module["_sapi_deactivate_module"] = Module["asm"]["sapi_deactivate_module"]).apply(null, arguments);
};

var _sapi_deactivate_destroy = Module["_sapi_deactivate_destroy"] = function() {
 return (_sapi_deactivate_destroy = Module["_sapi_deactivate_destroy"] = Module["asm"]["sapi_deactivate_destroy"]).apply(null, arguments);
};

var _virtual_cwd_deactivate = Module["_virtual_cwd_deactivate"] = function() {
 return (_virtual_cwd_deactivate = Module["_virtual_cwd_deactivate"] = Module["asm"]["virtual_cwd_deactivate"]).apply(null, arguments);
};

var _zend_interned_strings_deactivate = Module["_zend_interned_strings_deactivate"] = function() {
 return (_zend_interned_strings_deactivate = Module["_zend_interned_strings_deactivate"] = Module["asm"]["zend_interned_strings_deactivate"]).apply(null, arguments);
};

var _shutdown_memory_manager = Module["_shutdown_memory_manager"] = function() {
 return (_shutdown_memory_manager = Module["_shutdown_memory_manager"] = Module["asm"]["shutdown_memory_manager"]).apply(null, arguments);
};

var _zend_set_memory_limit = Module["_zend_set_memory_limit"] = function() {
 return (_zend_set_memory_limit = Module["_zend_set_memory_limit"] = Module["asm"]["zend_set_memory_limit"]).apply(null, arguments);
};

var _php_com_initialize = Module["_php_com_initialize"] = function() {
 return (_php_com_initialize = Module["_php_com_initialize"] = Module["asm"]["php_com_initialize"]).apply(null, arguments);
};

var _php_register_extensions = Module["_php_register_extensions"] = function() {
 return (_php_register_extensions = Module["_php_register_extensions"] = Module["asm"]["php_register_extensions"]).apply(null, arguments);
};

var _zend_register_internal_module = Module["_zend_register_internal_module"] = function() {
 return (_zend_register_internal_module = Module["_zend_register_internal_module"] = Module["asm"]["zend_register_internal_module"]).apply(null, arguments);
};

var _php_module_startup = Module["_php_module_startup"] = function() {
 return (_php_module_startup = Module["_php_module_startup"] = Module["asm"]["php_module_startup"]).apply(null, arguments);
};

var _sapi_initialize_empty_request = Module["_sapi_initialize_empty_request"] = function() {
 return (_sapi_initialize_empty_request = Module["_sapi_initialize_empty_request"] = Module["asm"]["sapi_initialize_empty_request"]).apply(null, arguments);
};

var _php_output_startup = Module["_php_output_startup"] = function() {
 return (_php_output_startup = Module["_php_output_startup"] = Module["asm"]["php_output_startup"]).apply(null, arguments);
};

var _php_printf_to_smart_string = Module["_php_printf_to_smart_string"] = function() {
 return (_php_printf_to_smart_string = Module["_php_printf_to_smart_string"] = Module["asm"]["php_printf_to_smart_string"]).apply(null, arguments);
};

var _php_printf_to_smart_str = Module["_php_printf_to_smart_str"] = function() {
 return (_php_printf_to_smart_str = Module["_php_printf_to_smart_str"] = Module["asm"]["php_printf_to_smart_str"]).apply(null, arguments);
};

var _zend_observer_startup = Module["_zend_observer_startup"] = function() {
 return (_zend_observer_startup = Module["_zend_observer_startup"] = Module["asm"]["zend_observer_startup"]).apply(null, arguments);
};

var _zend_startup_modules = Module["_zend_startup_modules"] = function() {
 return (_zend_startup_modules = Module["_zend_startup_modules"] = Module["asm"]["zend_startup_modules"]).apply(null, arguments);
};

var _zend_collect_module_handlers = Module["_zend_collect_module_handlers"] = function() {
 return (_zend_collect_module_handlers = Module["_zend_collect_module_handlers"] = Module["asm"]["zend_collect_module_handlers"]).apply(null, arguments);
};

var _zend_register_functions = Module["_zend_register_functions"] = function() {
 return (_zend_register_functions = Module["_zend_register_functions"] = Module["asm"]["zend_register_functions"]).apply(null, arguments);
};

var _zend_disable_functions = Module["_zend_disable_functions"] = function() {
 return (_zend_disable_functions = Module["_zend_disable_functions"] = Module["asm"]["zend_disable_functions"]).apply(null, arguments);
};

var _zend_observer_post_startup = Module["_zend_observer_post_startup"] = function() {
 return (_zend_observer_post_startup = Module["_zend_observer_post_startup"] = Module["asm"]["zend_observer_post_startup"]).apply(null, arguments);
};

var _cfg_get_long = Module["_cfg_get_long"] = function() {
 return (_cfg_get_long = Module["_cfg_get_long"] = Module["asm"]["cfg_get_long"]).apply(null, arguments);
};

var _sapi_deactivate = Module["_sapi_deactivate"] = function() {
 return (_sapi_deactivate = Module["_sapi_deactivate"] = Module["asm"]["sapi_deactivate"]).apply(null, arguments);
};

var _virtual_cwd_activate = Module["_virtual_cwd_activate"] = function() {
 return (_virtual_cwd_activate = Module["_virtual_cwd_activate"] = Module["asm"]["virtual_cwd_activate"]).apply(null, arguments);
};

var _zend_interned_strings_switch_storage = Module["_zend_interned_strings_switch_storage"] = function() {
 return (_zend_interned_strings_switch_storage = Module["_zend_interned_strings_switch_storage"] = Module["asm"]["zend_interned_strings_switch_storage"]).apply(null, arguments);
};

var _php_module_shutdown_wrapper = Module["_php_module_shutdown_wrapper"] = function() {
 return (_php_module_shutdown_wrapper = Module["_php_module_shutdown_wrapper"] = Module["asm"]["php_module_shutdown_wrapper"]).apply(null, arguments);
};

var _php_module_shutdown = Module["_php_module_shutdown"] = function() {
 return (_php_module_shutdown = Module["_php_module_shutdown"] = Module["asm"]["php_module_shutdown"]).apply(null, arguments);
};

var _zend_ini_shutdown = Module["_zend_ini_shutdown"] = function() {
 return (_zend_ini_shutdown = Module["_zend_ini_shutdown"] = Module["asm"]["zend_ini_shutdown"]).apply(null, arguments);
};

var _php_output_shutdown = Module["_php_output_shutdown"] = function() {
 return (_php_output_shutdown = Module["_php_output_shutdown"] = Module["asm"]["php_output_shutdown"]).apply(null, arguments);
};

var _zend_interned_strings_dtor = Module["_zend_interned_strings_dtor"] = function() {
 return (_zend_interned_strings_dtor = Module["_zend_interned_strings_dtor"] = Module["asm"]["zend_interned_strings_dtor"]).apply(null, arguments);
};

var _zend_observer_shutdown = Module["_zend_observer_shutdown"] = function() {
 return (_zend_observer_shutdown = Module["_zend_observer_shutdown"] = Module["asm"]["zend_observer_shutdown"]).apply(null, arguments);
};

var _php_execute_script = Module["_php_execute_script"] = function() {
 return (_php_execute_script = Module["_php_execute_script"] = Module["asm"]["php_execute_script"]).apply(null, arguments);
};

var _virtual_chdir_file = Module["_virtual_chdir_file"] = function() {
 return (_virtual_chdir_file = Module["_virtual_chdir_file"] = Module["asm"]["virtual_chdir_file"]).apply(null, arguments);
};

var _zend_stream_init_filename = Module["_zend_stream_init_filename"] = function() {
 return (_zend_stream_init_filename = Module["_zend_stream_init_filename"] = Module["asm"]["zend_stream_init_filename"]).apply(null, arguments);
};

var _zend_ini_long = Module["_zend_ini_long"] = function() {
 return (_zend_ini_long = Module["_zend_ini_long"] = Module["asm"]["zend_ini_long"]).apply(null, arguments);
};

var _zend_execute_scripts = Module["_zend_execute_scripts"] = function() {
 return (_zend_execute_scripts = Module["_zend_execute_scripts"] = Module["asm"]["zend_execute_scripts"]).apply(null, arguments);
};

var _php_execute_simple_script = Module["_php_execute_simple_script"] = function() {
 return (_php_execute_simple_script = Module["_php_execute_simple_script"] = Module["asm"]["php_execute_simple_script"]).apply(null, arguments);
};

var _php_handle_aborted_connection = Module["_php_handle_aborted_connection"] = function() {
 return (_php_handle_aborted_connection = Module["_php_handle_aborted_connection"] = Module["asm"]["php_handle_aborted_connection"]).apply(null, arguments);
};

var _php_output_set_status = Module["_php_output_set_status"] = function() {
 return (_php_output_set_status = Module["_php_output_set_status"] = Module["asm"]["php_output_set_status"]).apply(null, arguments);
};

var _php_handle_auth_data = Module["_php_handle_auth_data"] = function() {
 return (_php_handle_auth_data = Module["_php_handle_auth_data"] = Module["asm"]["php_handle_auth_data"]).apply(null, arguments);
};

var _zend_binary_strncasecmp = Module["_zend_binary_strncasecmp"] = function() {
 return (_zend_binary_strncasecmp = Module["_zend_binary_strncasecmp"] = Module["asm"]["zend_binary_strncasecmp"]).apply(null, arguments);
};

var _php_lint_script = Module["_php_lint_script"] = function() {
 return (_php_lint_script = Module["_php_lint_script"] = Module["asm"]["php_lint_script"]).apply(null, arguments);
};

var _zend_throw_error_exception = Module["_zend_throw_error_exception"] = function() {
 return (_zend_throw_error_exception = Module["_zend_throw_error_exception"] = Module["asm"]["zend_throw_error_exception"]).apply(null, arguments);
};

var _zend_alloc_in_memory_limit_error_reporting = Module["_zend_alloc_in_memory_limit_error_reporting"] = function() {
 return (_zend_alloc_in_memory_limit_error_reporting = Module["_zend_alloc_in_memory_limit_error_reporting"] = Module["asm"]["zend_alloc_in_memory_limit_error_reporting"]).apply(null, arguments);
};

var _php_output_discard_all = Module["_php_output_discard_all"] = function() {
 return (_php_output_discard_all = Module["_php_output_discard_all"] = Module["asm"]["php_output_discard_all"]).apply(null, arguments);
};

var _fwrite = Module["_fwrite"] = function() {
 return (_fwrite = Module["_fwrite"] = Module["asm"]["fwrite"]).apply(null, arguments);
};

var _zend_objects_store_mark_destructed = Module["_zend_objects_store_mark_destructed"] = function() {
 return (_zend_objects_store_mark_destructed = Module["_zend_objects_store_mark_destructed"] = Module["asm"]["zend_objects_store_mark_destructed"]).apply(null, arguments);
};

var __php_stream_open_wrapper_as_file = Module["__php_stream_open_wrapper_as_file"] = function() {
 return (__php_stream_open_wrapper_as_file = Module["__php_stream_open_wrapper_as_file"] = Module["asm"]["_php_stream_open_wrapper_as_file"]).apply(null, arguments);
};

var _php_strip_url_passwd = Module["_php_strip_url_passwd"] = function() {
 return (_php_strip_url_passwd = Module["_php_strip_url_passwd"] = Module["asm"]["php_strip_url_passwd"]).apply(null, arguments);
};

var _asctime_r = Module["_asctime_r"] = function() {
 return (_asctime_r = Module["_asctime_r"] = Module["asm"]["asctime_r"]).apply(null, arguments);
};

var _php_resolve_path = Module["_php_resolve_path"] = function() {
 return (_php_resolve_path = Module["_php_resolve_path"] = Module["asm"]["php_resolve_path"]).apply(null, arguments);
};

var _zend_ini_color_displayer_cb = Module["_zend_ini_color_displayer_cb"] = function() {
 return (_zend_ini_color_displayer_cb = Module["_zend_ini_color_displayer_cb"] = Module["asm"]["zend_ini_color_displayer_cb"]).apply(null, arguments);
};

var _OnUpdateBaseDir = Module["_OnUpdateBaseDir"] = function() {
 return (_OnUpdateBaseDir = Module["_OnUpdateBaseDir"] = Module["asm"]["OnUpdateBaseDir"]).apply(null, arguments);
};

var _zend_ini_parse_uquantity_warn = Module["_zend_ini_parse_uquantity_warn"] = function() {
 return (_zend_ini_parse_uquantity_warn = Module["_zend_ini_parse_uquantity_warn"] = Module["asm"]["zend_ini_parse_uquantity_warn"]).apply(null, arguments);
};

var _strdup = Module["_strdup"] = function() {
 return (_strdup = Module["_strdup"] = Module["asm"]["strdup"]).apply(null, arguments);
};

var _zend_disable_class = Module["_zend_disable_class"] = function() {
 return (_zend_disable_class = Module["_zend_disable_class"] = Module["asm"]["zend_disable_class"]).apply(null, arguments);
};

var _ap_php_conv_10 = Module["_ap_php_conv_10"] = function() {
 return (_ap_php_conv_10 = Module["_ap_php_conv_10"] = Module["asm"]["ap_php_conv_10"]).apply(null, arguments);
};

var _ap_php_conv_p2 = Module["_ap_php_conv_p2"] = function() {
 return (_ap_php_conv_p2 = Module["_ap_php_conv_p2"] = Module["asm"]["ap_php_conv_p2"]).apply(null, arguments);
};

var _ap_php_vslprintf = Module["_ap_php_vslprintf"] = function() {
 return (_ap_php_vslprintf = Module["_ap_php_vslprintf"] = Module["asm"]["ap_php_vslprintf"]).apply(null, arguments);
};

var _ap_php_vsnprintf = Module["_ap_php_vsnprintf"] = function() {
 return (_ap_php_vsnprintf = Module["_ap_php_vsnprintf"] = Module["asm"]["ap_php_vsnprintf"]).apply(null, arguments);
};

var _ap_php_vasprintf = Module["_ap_php_vasprintf"] = function() {
 return (_ap_php_vasprintf = Module["_ap_php_vasprintf"] = Module["asm"]["ap_php_vasprintf"]).apply(null, arguments);
};

var _ap_php_asprintf = Module["_ap_php_asprintf"] = function() {
 return (_ap_php_asprintf = Module["_ap_php_asprintf"] = Module["asm"]["ap_php_asprintf"]).apply(null, arguments);
};

var _vasprintf = Module["_vasprintf"] = function() {
 return (_vasprintf = Module["_vasprintf"] = Module["asm"]["vasprintf"]).apply(null, arguments);
};

var _zend_dtoa = Module["_zend_dtoa"] = function() {
 return (_zend_dtoa = Module["_zend_dtoa"] = Module["asm"]["zend_dtoa"]).apply(null, arguments);
};

var _zend_freedtoa = Module["_zend_freedtoa"] = function() {
 return (_zend_freedtoa = Module["_zend_freedtoa"] = Module["asm"]["zend_freedtoa"]).apply(null, arguments);
};

var _isascii = Module["_isascii"] = function() {
 return (_isascii = Module["_isascii"] = Module["asm"]["isascii"]).apply(null, arguments);
};

var _strnlen = Module["_strnlen"] = function() {
 return (_strnlen = Module["_strnlen"] = Module["asm"]["strnlen"]).apply(null, arguments);
};

var __smart_string_alloc_persistent = Module["__smart_string_alloc_persistent"] = function() {
 return (__smart_string_alloc_persistent = Module["__smart_string_alloc_persistent"] = Module["asm"]["_smart_string_alloc_persistent"]).apply(null, arguments);
};

var __smart_string_alloc = Module["__smart_string_alloc"] = function() {
 return (__smart_string_alloc = Module["__smart_string_alloc"] = Module["asm"]["_smart_string_alloc"]).apply(null, arguments);
};

var _php_check_specific_open_basedir = Module["_php_check_specific_open_basedir"] = function() {
 return (_php_check_specific_open_basedir = Module["_php_check_specific_open_basedir"] = Module["asm"]["php_check_specific_open_basedir"]).apply(null, arguments);
};

var _php_fopen_primary_script = Module["_php_fopen_primary_script"] = function() {
 return (_php_fopen_primary_script = Module["_php_fopen_primary_script"] = Module["asm"]["php_fopen_primary_script"]).apply(null, arguments);
};

var _zend_stream_open = Module["_zend_stream_open"] = function() {
 return (_zend_stream_open = Module["_zend_stream_open"] = Module["asm"]["zend_stream_open"]).apply(null, arguments);
};

var _zend_is_executing = Module["_zend_is_executing"] = function() {
 return (_zend_is_executing = Module["_zend_is_executing"] = Module["asm"]["zend_is_executing"]).apply(null, arguments);
};

var _php_fopen_with_path = Module["_php_fopen_with_path"] = function() {
 return (_php_fopen_with_path = Module["_php_fopen_with_path"] = Module["asm"]["php_fopen_with_path"]).apply(null, arguments);
};

var _php_ini_builder_prepend = Module["_php_ini_builder_prepend"] = function() {
 return (_php_ini_builder_prepend = Module["_php_ini_builder_prepend"] = Module["asm"]["php_ini_builder_prepend"]).apply(null, arguments);
};

var _php_ini_builder_unquoted = Module["_php_ini_builder_unquoted"] = function() {
 return (_php_ini_builder_unquoted = Module["_php_ini_builder_unquoted"] = Module["asm"]["php_ini_builder_unquoted"]).apply(null, arguments);
};

var _php_ini_builder_quoted = Module["_php_ini_builder_quoted"] = function() {
 return (_php_ini_builder_quoted = Module["_php_ini_builder_quoted"] = Module["asm"]["php_ini_builder_quoted"]).apply(null, arguments);
};

var _php_ini_builder_define = Module["_php_ini_builder_define"] = function() {
 return (_php_ini_builder_define = Module["_php_ini_builder_define"] = Module["asm"]["php_ini_builder_define"]).apply(null, arguments);
};

var _config_zval_dtor = Module["_config_zval_dtor"] = function() {
 return (_config_zval_dtor = Module["_config_zval_dtor"] = Module["asm"]["config_zval_dtor"]).apply(null, arguments);
};

var _free_estring = Module["_free_estring"] = function() {
 return (_free_estring = Module["_free_estring"] = Module["asm"]["free_estring"]).apply(null, arguments);
};

var _scandir = Module["_scandir"] = function() {
 return (_scandir = Module["_scandir"] = Module["asm"]["scandir"]).apply(null, arguments);
};

var _alphasort = Module["_alphasort"] = function() {
 return (_alphasort = Module["_alphasort"] = Module["asm"]["alphasort"]).apply(null, arguments);
};

var _strlcat = Module["_strlcat"] = function() {
 return (_strlcat = Module["_strlcat"] = Module["asm"]["strlcat"]).apply(null, arguments);
};

var _php_parse_user_ini_file = Module["_php_parse_user_ini_file"] = function() {
 return (_php_parse_user_ini_file = Module["_php_parse_user_ini_file"] = Module["asm"]["php_parse_user_ini_file"]).apply(null, arguments);
};

var _php_ini_activate_config = Module["_php_ini_activate_config"] = function() {
 return (_php_ini_activate_config = Module["_php_ini_activate_config"] = Module["asm"]["php_ini_activate_config"]).apply(null, arguments);
};

var _php_ini_has_per_dir_config = Module["_php_ini_has_per_dir_config"] = function() {
 return (_php_ini_has_per_dir_config = Module["_php_ini_has_per_dir_config"] = Module["asm"]["php_ini_has_per_dir_config"]).apply(null, arguments);
};

var _php_ini_activate_per_dir_config = Module["_php_ini_activate_per_dir_config"] = function() {
 return (_php_ini_activate_per_dir_config = Module["_php_ini_activate_per_dir_config"] = Module["asm"]["php_ini_activate_per_dir_config"]).apply(null, arguments);
};

var _php_ini_has_per_host_config = Module["_php_ini_has_per_host_config"] = function() {
 return (_php_ini_has_per_host_config = Module["_php_ini_has_per_host_config"] = Module["asm"]["php_ini_has_per_host_config"]).apply(null, arguments);
};

var _php_ini_activate_per_host_config = Module["_php_ini_activate_per_host_config"] = function() {
 return (_php_ini_activate_per_host_config = Module["_php_ini_activate_per_host_config"] = Module["asm"]["php_ini_activate_per_host_config"]).apply(null, arguments);
};

var _cfg_get_double = Module["_cfg_get_double"] = function() {
 return (_cfg_get_double = Module["_cfg_get_double"] = Module["asm"]["cfg_get_double"]).apply(null, arguments);
};

var _php_ini_get_configuration_hash = Module["_php_ini_get_configuration_hash"] = function() {
 return (_php_ini_get_configuration_hash = Module["_php_ini_get_configuration_hash"] = Module["asm"]["php_ini_get_configuration_hash"]).apply(null, arguments);
};

var _zend_load_extension = Module["_zend_load_extension"] = function() {
 return (_zend_load_extension = Module["_zend_load_extension"] = Module["asm"]["zend_load_extension"]).apply(null, arguments);
};

var _zend_load_extension_handle = Module["_zend_load_extension_handle"] = function() {
 return (_zend_load_extension_handle = Module["_zend_load_extension_handle"] = Module["asm"]["zend_load_extension_handle"]).apply(null, arguments);
};

var _sapi_startup = Module["_sapi_startup"] = function() {
 return (_sapi_startup = Module["_sapi_startup"] = Module["asm"]["sapi_startup"]).apply(null, arguments);
};

var _sapi_shutdown = Module["_sapi_shutdown"] = function() {
 return (_sapi_shutdown = Module["_sapi_shutdown"] = Module["asm"]["sapi_shutdown"]).apply(null, arguments);
};

var _sapi_handle_post = Module["_sapi_handle_post"] = function() {
 return (_sapi_handle_post = Module["_sapi_handle_post"] = Module["asm"]["sapi_handle_post"]).apply(null, arguments);
};

var _sapi_read_standard_form_data = Module["_sapi_read_standard_form_data"] = function() {
 return (_sapi_read_standard_form_data = Module["_sapi_read_standard_form_data"] = Module["asm"]["sapi_read_standard_form_data"]).apply(null, arguments);
};

var _sapi_get_default_content_type = Module["_sapi_get_default_content_type"] = function() {
 return (_sapi_get_default_content_type = Module["_sapi_get_default_content_type"] = Module["asm"]["sapi_get_default_content_type"]).apply(null, arguments);
};

var _sapi_get_default_content_type_header = Module["_sapi_get_default_content_type_header"] = function() {
 return (_sapi_get_default_content_type_header = Module["_sapi_get_default_content_type_header"] = Module["asm"]["sapi_get_default_content_type_header"]).apply(null, arguments);
};

var _sapi_apply_default_charset = Module["_sapi_apply_default_charset"] = function() {
 return (_sapi_apply_default_charset = Module["_sapi_apply_default_charset"] = Module["asm"]["sapi_apply_default_charset"]).apply(null, arguments);
};

var _sapi_activate_headers_only = Module["_sapi_activate_headers_only"] = function() {
 return (_sapi_activate_headers_only = Module["_sapi_activate_headers_only"] = Module["asm"]["sapi_activate_headers_only"]).apply(null, arguments);
};

var _destroy_uploaded_files_hash = Module["_destroy_uploaded_files_hash"] = function() {
 return (_destroy_uploaded_files_hash = Module["_destroy_uploaded_files_hash"] = Module["asm"]["destroy_uploaded_files_hash"]).apply(null, arguments);
};

var _zend_llist_clean = Module["_zend_llist_clean"] = function() {
 return (_zend_llist_clean = Module["_zend_llist_clean"] = Module["asm"]["zend_llist_clean"]).apply(null, arguments);
};

var _sapi_register_post_entries = Module["_sapi_register_post_entries"] = function() {
 return (_sapi_register_post_entries = Module["_sapi_register_post_entries"] = Module["asm"]["sapi_register_post_entries"]).apply(null, arguments);
};

var _sapi_register_post_entry = Module["_sapi_register_post_entry"] = function() {
 return (_sapi_register_post_entry = Module["_sapi_register_post_entry"] = Module["asm"]["sapi_register_post_entry"]).apply(null, arguments);
};

var _sapi_unregister_post_entry = Module["_sapi_unregister_post_entry"] = function() {
 return (_sapi_unregister_post_entry = Module["_sapi_unregister_post_entry"] = Module["asm"]["sapi_unregister_post_entry"]).apply(null, arguments);
};

var _sapi_register_default_post_reader = Module["_sapi_register_default_post_reader"] = function() {
 return (_sapi_register_default_post_reader = Module["_sapi_register_default_post_reader"] = Module["asm"]["sapi_register_default_post_reader"]).apply(null, arguments);
};

var _sapi_register_treat_data = Module["_sapi_register_treat_data"] = function() {
 return (_sapi_register_treat_data = Module["_sapi_register_treat_data"] = Module["asm"]["sapi_register_treat_data"]).apply(null, arguments);
};

var _sapi_register_input_filter = Module["_sapi_register_input_filter"] = function() {
 return (_sapi_register_input_filter = Module["_sapi_register_input_filter"] = Module["asm"]["sapi_register_input_filter"]).apply(null, arguments);
};

var _sapi_get_fd = Module["_sapi_get_fd"] = function() {
 return (_sapi_get_fd = Module["_sapi_get_fd"] = Module["asm"]["sapi_get_fd"]).apply(null, arguments);
};

var _sapi_force_http_10 = Module["_sapi_force_http_10"] = function() {
 return (_sapi_force_http_10 = Module["_sapi_force_http_10"] = Module["asm"]["sapi_force_http_10"]).apply(null, arguments);
};

var _sapi_get_target_uid = Module["_sapi_get_target_uid"] = function() {
 return (_sapi_get_target_uid = Module["_sapi_get_target_uid"] = Module["asm"]["sapi_get_target_uid"]).apply(null, arguments);
};

var _sapi_get_target_gid = Module["_sapi_get_target_gid"] = function() {
 return (_sapi_get_target_gid = Module["_sapi_get_target_gid"] = Module["asm"]["sapi_get_target_gid"]).apply(null, arguments);
};

var _sapi_terminate_process = Module["_sapi_terminate_process"] = function() {
 return (_sapi_terminate_process = Module["_sapi_terminate_process"] = Module["asm"]["sapi_terminate_process"]).apply(null, arguments);
};

var _sapi_add_request_header = Module["_sapi_add_request_header"] = function() {
 return (_sapi_add_request_header = Module["_sapi_add_request_header"] = Module["asm"]["sapi_add_request_header"]).apply(null, arguments);
};

var _rfc1867_post_handler = Module["_rfc1867_post_handler"] = function() {
 return (_rfc1867_post_handler = Module["_rfc1867_post_handler"] = Module["asm"]["rfc1867_post_handler"]).apply(null, arguments);
};

var _zend_multibyte_get_internal_encoding = Module["_zend_multibyte_get_internal_encoding"] = function() {
 return (_zend_multibyte_get_internal_encoding = Module["_zend_multibyte_get_internal_encoding"] = Module["asm"]["zend_multibyte_get_internal_encoding"]).apply(null, arguments);
};

var _zend_multibyte_encoding_converter = Module["_zend_multibyte_encoding_converter"] = function() {
 return (_zend_multibyte_encoding_converter = Module["_zend_multibyte_encoding_converter"] = Module["asm"]["zend_multibyte_encoding_converter"]).apply(null, arguments);
};

var _php_rfc1867_set_multibyte_callbacks = Module["_php_rfc1867_set_multibyte_callbacks"] = function() {
 return (_php_rfc1867_set_multibyte_callbacks = Module["_php_rfc1867_set_multibyte_callbacks"] = Module["asm"]["php_rfc1867_set_multibyte_callbacks"]).apply(null, arguments);
};

var _zend_multibyte_encoding_detector = Module["_zend_multibyte_encoding_detector"] = function() {
 return (_zend_multibyte_encoding_detector = Module["_zend_multibyte_encoding_detector"] = Module["asm"]["zend_multibyte_encoding_detector"]).apply(null, arguments);
};

var _zend_llist_get_first_ex = Module["_zend_llist_get_first_ex"] = function() {
 return (_zend_llist_get_first_ex = Module["_zend_llist_get_first_ex"] = Module["asm"]["zend_llist_get_first_ex"]).apply(null, arguments);
};

var _zend_llist_get_next_ex = Module["_zend_llist_get_next_ex"] = function() {
 return (_zend_llist_get_next_ex = Module["_zend_llist_get_next_ex"] = Module["asm"]["zend_llist_get_next_ex"]).apply(null, arguments);
};

var _php_register_variable_safe = Module["_php_register_variable_safe"] = function() {
 return (_php_register_variable_safe = Module["_php_register_variable_safe"] = Module["asm"]["php_register_variable_safe"]).apply(null, arguments);
};

var _zend_hash_str_add_empty_element = Module["_zend_hash_str_add_empty_element"] = function() {
 return (_zend_hash_str_add_empty_element = Module["_zend_hash_str_add_empty_element"] = Module["asm"]["zend_hash_str_add_empty_element"]).apply(null, arguments);
};

var _php_register_variable_ex = Module["_php_register_variable_ex"] = function() {
 return (_php_register_variable_ex = Module["_php_register_variable_ex"] = Module["asm"]["php_register_variable_ex"]).apply(null, arguments);
};

var _php_default_post_reader = Module["_php_default_post_reader"] = function() {
 return (_php_default_post_reader = Module["_php_default_post_reader"] = Module["asm"]["php_default_post_reader"]).apply(null, arguments);
};

var _php_default_treat_data = Module["_php_default_treat_data"] = function() {
 return (_php_default_treat_data = Module["_php_default_treat_data"] = Module["asm"]["php_default_treat_data"]).apply(null, arguments);
};

var _php_default_input_filter = Module["_php_default_input_filter"] = function() {
 return (_php_default_input_filter = Module["_php_default_input_filter"] = Module["asm"]["php_default_input_filter"]).apply(null, arguments);
};

var _php_std_post_handler = Module["_php_std_post_handler"] = function() {
 return (_php_std_post_handler = Module["_php_std_post_handler"] = Module["asm"]["php_std_post_handler"]).apply(null, arguments);
};

var _php_register_variable = Module["_php_register_variable"] = function() {
 return (_php_register_variable = Module["_php_register_variable"] = Module["asm"]["php_register_variable"]).apply(null, arguments);
};

var _php_register_known_variable = Module["_php_register_known_variable"] = function() {
 return (_php_register_known_variable = Module["_php_register_known_variable"] = Module["asm"]["php_register_known_variable"]).apply(null, arguments);
};

var _php_build_argv = Module["_php_build_argv"] = function() {
 return (_php_build_argv = Module["_php_build_argv"] = Module["asm"]["php_build_argv"]).apply(null, arguments);
};

var _zend_activate_auto_globals = Module["_zend_activate_auto_globals"] = function() {
 return (_zend_activate_auto_globals = Module["_zend_activate_auto_globals"] = Module["asm"]["zend_activate_auto_globals"]).apply(null, arguments);
};

var _zend_hash_str_update_ind = Module["_zend_hash_str_update_ind"] = function() {
 return (_zend_hash_str_update_ind = Module["_zend_hash_str_update_ind"] = Module["asm"]["zend_hash_str_update_ind"]).apply(null, arguments);
};

var _php_remove_tick_function = Module["_php_remove_tick_function"] = function() {
 return (_php_remove_tick_function = Module["_php_remove_tick_function"] = Module["asm"]["php_remove_tick_function"]).apply(null, arguments);
};

var _php_network_freeaddresses = Module["_php_network_freeaddresses"] = function() {
 return (_php_network_freeaddresses = Module["_php_network_freeaddresses"] = Module["asm"]["php_network_freeaddresses"]).apply(null, arguments);
};

var _php_network_getaddresses = Module["_php_network_getaddresses"] = function() {
 return (_php_network_getaddresses = Module["_php_network_getaddresses"] = Module["asm"]["php_network_getaddresses"]).apply(null, arguments);
};

var _socket = Module["_socket"] = function() {
 return (_socket = Module["_socket"] = Module["asm"]["socket"]).apply(null, arguments);
};

var _gai_strerror = Module["_gai_strerror"] = function() {
 return (_gai_strerror = Module["_gai_strerror"] = Module["asm"]["gai_strerror"]).apply(null, arguments);
};

var _freeaddrinfo = Module["_freeaddrinfo"] = function() {
 return (_freeaddrinfo = Module["_freeaddrinfo"] = Module["asm"]["freeaddrinfo"]).apply(null, arguments);
};

var _php_network_connect_socket = Module["_php_network_connect_socket"] = function() {
 return (_php_network_connect_socket = Module["_php_network_connect_socket"] = Module["asm"]["php_network_connect_socket"]).apply(null, arguments);
};

var _connect = Module["_connect"] = function() {
 return (_connect = Module["_connect"] = Module["asm"]["connect"]).apply(null, arguments);
};

var _getsockopt = Module["_getsockopt"] = function() {
 return (_getsockopt = Module["_getsockopt"] = Module["asm"]["getsockopt"]).apply(null, arguments);
};

var _php_network_bind_socket_to_local_addr = Module["_php_network_bind_socket_to_local_addr"] = function() {
 return (_php_network_bind_socket_to_local_addr = Module["_php_network_bind_socket_to_local_addr"] = Module["asm"]["php_network_bind_socket_to_local_addr"]).apply(null, arguments);
};

var _setsockopt = Module["_setsockopt"] = function() {
 return (_setsockopt = Module["_setsockopt"] = Module["asm"]["setsockopt"]).apply(null, arguments);
};

var _bind = Module["_bind"] = function() {
 return (_bind = Module["_bind"] = Module["asm"]["bind"]).apply(null, arguments);
};

var _php_network_populate_name_from_sockaddr = Module["_php_network_populate_name_from_sockaddr"] = function() {
 return (_php_network_populate_name_from_sockaddr = Module["_php_network_populate_name_from_sockaddr"] = Module["asm"]["php_network_populate_name_from_sockaddr"]).apply(null, arguments);
};

var _php_network_get_peer_name = Module["_php_network_get_peer_name"] = function() {
 return (_php_network_get_peer_name = Module["_php_network_get_peer_name"] = Module["asm"]["php_network_get_peer_name"]).apply(null, arguments);
};

var _getpeername = Module["_getpeername"] = function() {
 return (_getpeername = Module["_getpeername"] = Module["asm"]["getpeername"]).apply(null, arguments);
};

var _php_network_get_sock_name = Module["_php_network_get_sock_name"] = function() {
 return (_php_network_get_sock_name = Module["_php_network_get_sock_name"] = Module["asm"]["php_network_get_sock_name"]).apply(null, arguments);
};

var _getsockname = Module["_getsockname"] = function() {
 return (_getsockname = Module["_getsockname"] = Module["asm"]["getsockname"]).apply(null, arguments);
};

var _php_network_accept_incoming = Module["_php_network_accept_incoming"] = function() {
 return (_php_network_accept_incoming = Module["_php_network_accept_incoming"] = Module["asm"]["php_network_accept_incoming"]).apply(null, arguments);
};

var _accept = Module["_accept"] = function() {
 return (_accept = Module["_accept"] = Module["asm"]["accept"]).apply(null, arguments);
};

var _php_network_connect_socket_to_host = Module["_php_network_connect_socket_to_host"] = function() {
 return (_php_network_connect_socket_to_host = Module["_php_network_connect_socket_to_host"] = Module["asm"]["php_network_connect_socket_to_host"]).apply(null, arguments);
};

var _php_any_addr = Module["_php_any_addr"] = function() {
 return (_php_any_addr = Module["_php_any_addr"] = Module["asm"]["php_any_addr"]).apply(null, arguments);
};

var _php_sockaddr_size = Module["_php_sockaddr_size"] = function() {
 return (_php_sockaddr_size = Module["_php_sockaddr_size"] = Module["asm"]["php_sockaddr_size"]).apply(null, arguments);
};

var _php_set_sock_blocking = Module["_php_set_sock_blocking"] = function() {
 return (_php_set_sock_blocking = Module["_php_set_sock_blocking"] = Module["asm"]["php_set_sock_blocking"]).apply(null, arguments);
};

var _poll = Module["_poll"] = function() {
 return (_poll = Module["_poll"] = Module["asm"]["poll"]).apply(null, arguments);
};

var _php_open_temporary_fd = Module["_php_open_temporary_fd"] = function() {
 return (_php_open_temporary_fd = Module["_php_open_temporary_fd"] = Module["asm"]["php_open_temporary_fd"]).apply(null, arguments);
};

var _php_open_temporary_file = Module["_php_open_temporary_file"] = function() {
 return (_php_open_temporary_file = Module["_php_open_temporary_file"] = Module["asm"]["php_open_temporary_file"]).apply(null, arguments);
};

var _fdopen = Module["_fdopen"] = function() {
 return (_fdopen = Module["_fdopen"] = Module["asm"]["fdopen"]).apply(null, arguments);
};

var _mkstemp = Module["_mkstemp"] = function() {
 return (_mkstemp = Module["_mkstemp"] = Module["asm"]["mkstemp"]).apply(null, arguments);
};

var _php_odbc_connstr_is_quoted = Module["_php_odbc_connstr_is_quoted"] = function() {
 return (_php_odbc_connstr_is_quoted = Module["_php_odbc_connstr_is_quoted"] = Module["asm"]["php_odbc_connstr_is_quoted"]).apply(null, arguments);
};

var _php_odbc_connstr_should_quote = Module["_php_odbc_connstr_should_quote"] = function() {
 return (_php_odbc_connstr_should_quote = Module["_php_odbc_connstr_should_quote"] = Module["asm"]["php_odbc_connstr_should_quote"]).apply(null, arguments);
};

var _php_odbc_connstr_estimate_quote_length = Module["_php_odbc_connstr_estimate_quote_length"] = function() {
 return (_php_odbc_connstr_estimate_quote_length = Module["_php_odbc_connstr_estimate_quote_length"] = Module["asm"]["php_odbc_connstr_estimate_quote_length"]).apply(null, arguments);
};

var _php_odbc_connstr_quote = Module["_php_odbc_connstr_quote"] = function() {
 return (_php_odbc_connstr_quote = Module["_php_odbc_connstr_quote"] = Module["asm"]["php_odbc_connstr_quote"]).apply(null, arguments);
};

var _zend_stack_init = Module["_zend_stack_init"] = function() {
 return (_zend_stack_init = Module["_zend_stack_init"] = Module["asm"]["zend_stack_init"]).apply(null, arguments);
};

var _zend_stack_top = Module["_zend_stack_top"] = function() {
 return (_zend_stack_top = Module["_zend_stack_top"] = Module["asm"]["zend_stack_top"]).apply(null, arguments);
};

var _php_output_handler_free = Module["_php_output_handler_free"] = function() {
 return (_php_output_handler_free = Module["_php_output_handler_free"] = Module["asm"]["php_output_handler_free"]).apply(null, arguments);
};

var _zend_stack_del_top = Module["_zend_stack_del_top"] = function() {
 return (_zend_stack_del_top = Module["_zend_stack_del_top"] = Module["asm"]["zend_stack_del_top"]).apply(null, arguments);
};

var _zend_stack_destroy = Module["_zend_stack_destroy"] = function() {
 return (_zend_stack_destroy = Module["_zend_stack_destroy"] = Module["asm"]["zend_stack_destroy"]).apply(null, arguments);
};

var _php_output_get_status = Module["_php_output_get_status"] = function() {
 return (_php_output_get_status = Module["_php_output_get_status"] = Module["asm"]["php_output_get_status"]).apply(null, arguments);
};

var _php_output_write_unbuffered = Module["_php_output_write_unbuffered"] = function() {
 return (_php_output_write_unbuffered = Module["_php_output_write_unbuffered"] = Module["asm"]["php_output_write_unbuffered"]).apply(null, arguments);
};

var _php_output_flush = Module["_php_output_flush"] = function() {
 return (_php_output_flush = Module["_php_output_flush"] = Module["asm"]["php_output_flush"]).apply(null, arguments);
};

var _zend_stack_push = Module["_zend_stack_push"] = function() {
 return (_zend_stack_push = Module["_zend_stack_push"] = Module["asm"]["zend_stack_push"]).apply(null, arguments);
};

var _php_output_clean = Module["_php_output_clean"] = function() {
 return (_php_output_clean = Module["_php_output_clean"] = Module["asm"]["php_output_clean"]).apply(null, arguments);
};

var _php_output_clean_all = Module["_php_output_clean_all"] = function() {
 return (_php_output_clean_all = Module["_php_output_clean_all"] = Module["asm"]["php_output_clean_all"]).apply(null, arguments);
};

var _zend_stack_apply_with_argument = Module["_zend_stack_apply_with_argument"] = function() {
 return (_zend_stack_apply_with_argument = Module["_zend_stack_apply_with_argument"] = Module["asm"]["zend_stack_apply_with_argument"]).apply(null, arguments);
};

var _zend_stack_count = Module["_zend_stack_count"] = function() {
 return (_zend_stack_count = Module["_zend_stack_count"] = Module["asm"]["zend_stack_count"]).apply(null, arguments);
};

var _php_output_get_length = Module["_php_output_get_length"] = function() {
 return (_php_output_get_length = Module["_php_output_get_length"] = Module["asm"]["php_output_get_length"]).apply(null, arguments);
};

var _php_output_get_active_handler = Module["_php_output_get_active_handler"] = function() {
 return (_php_output_get_active_handler = Module["_php_output_get_active_handler"] = Module["asm"]["php_output_get_active_handler"]).apply(null, arguments);
};

var _php_output_handler_create_internal = Module["_php_output_handler_create_internal"] = function() {
 return (_php_output_handler_create_internal = Module["_php_output_handler_create_internal"] = Module["asm"]["php_output_handler_create_internal"]).apply(null, arguments);
};

var _php_output_handler_start = Module["_php_output_handler_start"] = function() {
 return (_php_output_handler_start = Module["_php_output_handler_start"] = Module["asm"]["php_output_handler_start"]).apply(null, arguments);
};

var _php_output_start_devnull = Module["_php_output_start_devnull"] = function() {
 return (_php_output_start_devnull = Module["_php_output_start_devnull"] = Module["asm"]["php_output_start_devnull"]).apply(null, arguments);
};

var _php_output_handler_create_user = Module["_php_output_handler_create_user"] = function() {
 return (_php_output_handler_create_user = Module["_php_output_handler_create_user"] = Module["asm"]["php_output_handler_create_user"]).apply(null, arguments);
};

var _php_output_handler_set_context = Module["_php_output_handler_set_context"] = function() {
 return (_php_output_handler_set_context = Module["_php_output_handler_set_context"] = Module["asm"]["php_output_handler_set_context"]).apply(null, arguments);
};

var _php_output_handler_alias = Module["_php_output_handler_alias"] = function() {
 return (_php_output_handler_alias = Module["_php_output_handler_alias"] = Module["asm"]["php_output_handler_alias"]).apply(null, arguments);
};

var _php_output_handler_started = Module["_php_output_handler_started"] = function() {
 return (_php_output_handler_started = Module["_php_output_handler_started"] = Module["asm"]["php_output_handler_started"]).apply(null, arguments);
};

var _zend_stack_base = Module["_zend_stack_base"] = function() {
 return (_zend_stack_base = Module["_zend_stack_base"] = Module["asm"]["zend_stack_base"]).apply(null, arguments);
};

var _php_output_handler_conflict = Module["_php_output_handler_conflict"] = function() {
 return (_php_output_handler_conflict = Module["_php_output_handler_conflict"] = Module["asm"]["php_output_handler_conflict"]).apply(null, arguments);
};

var _php_output_handler_conflict_register = Module["_php_output_handler_conflict_register"] = function() {
 return (_php_output_handler_conflict_register = Module["_php_output_handler_conflict_register"] = Module["asm"]["php_output_handler_conflict_register"]).apply(null, arguments);
};

var _php_output_handler_reverse_conflict_register = Module["_php_output_handler_reverse_conflict_register"] = function() {
 return (_php_output_handler_reverse_conflict_register = Module["_php_output_handler_reverse_conflict_register"] = Module["asm"]["php_output_handler_reverse_conflict_register"]).apply(null, arguments);
};

var _php_output_handler_alias_register = Module["_php_output_handler_alias_register"] = function() {
 return (_php_output_handler_alias_register = Module["_php_output_handler_alias_register"] = Module["asm"]["php_output_handler_alias_register"]).apply(null, arguments);
};

var _php_output_handler_hook = Module["_php_output_handler_hook"] = function() {
 return (_php_output_handler_hook = Module["_php_output_handler_hook"] = Module["asm"]["php_output_handler_hook"]).apply(null, arguments);
};

var _php_output_handler_dtor = Module["_php_output_handler_dtor"] = function() {
 return (_php_output_handler_dtor = Module["_php_output_handler_dtor"] = Module["asm"]["php_output_handler_dtor"]).apply(null, arguments);
};

var _zend_is_compiling = Module["_zend_is_compiling"] = function() {
 return (_zend_is_compiling = Module["_zend_is_compiling"] = Module["asm"]["zend_is_compiling"]).apply(null, arguments);
};

var _zend_get_compiled_filename = Module["_zend_get_compiled_filename"] = function() {
 return (_zend_get_compiled_filename = Module["_zend_get_compiled_filename"] = Module["asm"]["zend_get_compiled_filename"]).apply(null, arguments);
};

var _zend_get_compiled_lineno = Module["_zend_get_compiled_lineno"] = function() {
 return (_zend_get_compiled_lineno = Module["_zend_get_compiled_lineno"] = Module["asm"]["zend_get_compiled_lineno"]).apply(null, arguments);
};

var _syslog = Module["_syslog"] = function() {
 return (_syslog = Module["_syslog"] = Module["asm"]["syslog"]).apply(null, arguments);
};

var _openlog = Module["_openlog"] = function() {
 return (_openlog = Module["_openlog"] = Module["asm"]["openlog"]).apply(null, arguments);
};

var _closelog = Module["_closelog"] = function() {
 return (_closelog = Module["_closelog"] = Module["asm"]["closelog"]).apply(null, arguments);
};

var _zend_vstrpprintf = Module["_zend_vstrpprintf"] = function() {
 return (_zend_vstrpprintf = Module["_zend_vstrpprintf"] = Module["asm"]["zend_vstrpprintf"]).apply(null, arguments);
};

var _php_stream_get_url_stream_wrappers_hash_global = Module["_php_stream_get_url_stream_wrappers_hash_global"] = function() {
 return (_php_stream_get_url_stream_wrappers_hash_global = Module["_php_stream_get_url_stream_wrappers_hash_global"] = Module["asm"]["php_stream_get_url_stream_wrappers_hash_global"]).apply(null, arguments);
};

var _php_stream_encloses = Module["_php_stream_encloses"] = function() {
 return (_php_stream_encloses = Module["_php_stream_encloses"] = Module["asm"]["php_stream_encloses"]).apply(null, arguments);
};

var _php_stream_from_persistent_id = Module["_php_stream_from_persistent_id"] = function() {
 return (_php_stream_from_persistent_id = Module["_php_stream_from_persistent_id"] = Module["asm"]["php_stream_from_persistent_id"]).apply(null, arguments);
};

var __php_stream_free_enclosed = Module["__php_stream_free_enclosed"] = function() {
 return (__php_stream_free_enclosed = Module["__php_stream_free_enclosed"] = Module["asm"]["_php_stream_free_enclosed"]).apply(null, arguments);
};

var __php_stream_fill_read_buffer = Module["__php_stream_fill_read_buffer"] = function() {
 return (__php_stream_fill_read_buffer = Module["__php_stream_fill_read_buffer"] = Module["asm"]["_php_stream_fill_read_buffer"]).apply(null, arguments);
};

var __php_stream_putc = Module["__php_stream_putc"] = function() {
 return (__php_stream_putc = Module["__php_stream_putc"] = Module["asm"]["_php_stream_putc"]).apply(null, arguments);
};

var __php_stream_puts = Module["__php_stream_puts"] = function() {
 return (__php_stream_puts = Module["__php_stream_puts"] = Module["asm"]["_php_stream_puts"]).apply(null, arguments);
};

var _fflush = Module["_fflush"] = function() {
 return (_fflush = Module["_fflush"] = Module["asm"]["fflush"]).apply(null, arguments);
};

var __php_stream_mmap_range = Module["__php_stream_mmap_range"] = function() {
 return (__php_stream_mmap_range = Module["__php_stream_mmap_range"] = Module["asm"]["_php_stream_mmap_range"]).apply(null, arguments);
};

var __php_stream_mmap_unmap_ex = Module["__php_stream_mmap_unmap_ex"] = function() {
 return (__php_stream_mmap_unmap_ex = Module["__php_stream_mmap_unmap_ex"] = Module["asm"]["_php_stream_mmap_unmap_ex"]).apply(null, arguments);
};

var __php_stream_mmap_unmap = Module["__php_stream_mmap_unmap"] = function() {
 return (__php_stream_mmap_unmap = Module["__php_stream_mmap_unmap"] = Module["asm"]["_php_stream_mmap_unmap"]).apply(null, arguments);
};

var __php_stream_copy_to_stream = Module["__php_stream_copy_to_stream"] = function() {
 return (__php_stream_copy_to_stream = Module["__php_stream_copy_to_stream"] = Module["asm"]["_php_stream_copy_to_stream"]).apply(null, arguments);
};

var _php_get_stream_filters_hash_global = Module["_php_get_stream_filters_hash_global"] = function() {
 return (_php_get_stream_filters_hash_global = Module["_php_get_stream_filters_hash_global"] = Module["asm"]["php_get_stream_filters_hash_global"]).apply(null, arguments);
};

var _php_stream_xport_register = Module["_php_stream_xport_register"] = function() {
 return (_php_stream_xport_register = Module["_php_stream_xport_register"] = Module["asm"]["php_stream_xport_register"]).apply(null, arguments);
};

var _php_stream_generic_socket_factory = Module["_php_stream_generic_socket_factory"] = function() {
 return (_php_stream_generic_socket_factory = Module["_php_stream_generic_socket_factory"] = Module["asm"]["php_stream_generic_socket_factory"]).apply(null, arguments);
};

var _php_register_url_stream_wrapper_volatile = Module["_php_register_url_stream_wrapper_volatile"] = function() {
 return (_php_register_url_stream_wrapper_volatile = Module["_php_register_url_stream_wrapper_volatile"] = Module["asm"]["php_register_url_stream_wrapper_volatile"]).apply(null, arguments);
};

var _php_unregister_url_stream_wrapper_volatile = Module["_php_unregister_url_stream_wrapper_volatile"] = function() {
 return (_php_unregister_url_stream_wrapper_volatile = Module["_php_unregister_url_stream_wrapper_volatile"] = Module["asm"]["php_unregister_url_stream_wrapper_volatile"]).apply(null, arguments);
};

var __php_stream_make_seekable = Module["__php_stream_make_seekable"] = function() {
 return (__php_stream_make_seekable = Module["__php_stream_make_seekable"] = Module["asm"]["_php_stream_make_seekable"]).apply(null, arguments);
};

var _qsort = Module["_qsort"] = function() {
 return (_qsort = Module["_qsort"] = Module["asm"]["qsort"]).apply(null, arguments);
};

var _zend_llist_count = Module["_zend_llist_count"] = function() {
 return (_zend_llist_count = Module["_zend_llist_count"] = Module["asm"]["zend_llist_count"]).apply(null, arguments);
};

var _fopencookie = Module["_fopencookie"] = function() {
 return (_fopencookie = Module["_fopencookie"] = Module["asm"]["fopencookie"]).apply(null, arguments);
};

var _fseek = Module["_fseek"] = function() {
 return (_fseek = Module["_fseek"] = Module["asm"]["fseek"]).apply(null, arguments);
};

var __php_stream_mode_to_str = Module["__php_stream_mode_to_str"] = function() {
 return (__php_stream_mode_to_str = Module["__php_stream_mode_to_str"] = Module["asm"]["_php_stream_mode_to_str"]).apply(null, arguments);
};

var __php_stream_memory_get_buffer = Module["__php_stream_memory_get_buffer"] = function() {
 return (__php_stream_memory_get_buffer = Module["__php_stream_memory_get_buffer"] = Module["asm"]["_php_stream_memory_get_buffer"]).apply(null, arguments);
};

var __php_stream_temp_open = Module["__php_stream_temp_open"] = function() {
 return (__php_stream_temp_open = Module["__php_stream_temp_open"] = Module["asm"]["_php_stream_temp_open"]).apply(null, arguments);
};

var __php_stream_fopen_temporary_file = Module["__php_stream_fopen_temporary_file"] = function() {
 return (__php_stream_fopen_temporary_file = Module["__php_stream_fopen_temporary_file"] = Module["asm"]["_php_stream_fopen_temporary_file"]).apply(null, arguments);
};

var _php_stream_bucket_split = Module["_php_stream_bucket_split"] = function() {
 return (_php_stream_bucket_split = Module["_php_stream_bucket_split"] = Module["asm"]["php_stream_bucket_split"]).apply(null, arguments);
};

var __php_stream_filter_prepend = Module["__php_stream_filter_prepend"] = function() {
 return (__php_stream_filter_prepend = Module["__php_stream_filter_prepend"] = Module["asm"]["_php_stream_filter_prepend"]).apply(null, arguments);
};

var _php_stream_parse_fopen_modes = Module["_php_stream_parse_fopen_modes"] = function() {
 return (_php_stream_parse_fopen_modes = Module["_php_stream_parse_fopen_modes"] = Module["asm"]["php_stream_parse_fopen_modes"]).apply(null, arguments);
};

var _ftell = Module["_ftell"] = function() {
 return (_ftell = Module["_ftell"] = Module["asm"]["ftell"]).apply(null, arguments);
};

var __php_stream_fopen = Module["__php_stream_fopen"] = function() {
 return (__php_stream_fopen = Module["__php_stream_fopen"] = Module["asm"]["_php_stream_fopen"]).apply(null, arguments);
};

var __php_stream_fopen_with_path = Module["__php_stream_fopen_with_path"] = function() {
 return (__php_stream_fopen_with_path = Module["__php_stream_fopen_with_path"] = Module["asm"]["_php_stream_fopen_with_path"]).apply(null, arguments);
};

var _fread = Module["_fread"] = function() {
 return (_fread = Module["_fread"] = Module["asm"]["fread"]).apply(null, arguments);
};

var _feof = Module["_feof"] = function() {
 return (_feof = Module["_feof"] = Module["asm"]["feof"]).apply(null, arguments);
};

var _munmap = Module["_munmap"] = function() {
 return (_munmap = Module["_munmap"] = Module["asm"]["munmap"]).apply(null, arguments);
};

var _setvbuf = Module["_setvbuf"] = function() {
 return (_setvbuf = Module["_setvbuf"] = Module["asm"]["setvbuf"]).apply(null, arguments);
};

var _mmap = Module["_mmap"] = function() {
 return (_mmap = Module["_mmap"] = Module["asm"]["mmap"]).apply(null, arguments);
};

var _fdatasync = Module["_fdatasync"] = function() {
 return (_fdatasync = Module["_fdatasync"] = Module["asm"]["fdatasync"]).apply(null, arguments);
};

var _fsync = Module["_fsync"] = function() {
 return (_fsync = Module["_fsync"] = Module["asm"]["fsync"]).apply(null, arguments);
};

var _rewinddir = Module["_rewinddir"] = function() {
 return (_rewinddir = Module["_rewinddir"] = Module["asm"]["rewinddir"]).apply(null, arguments);
};

var _rmdir = Module["_rmdir"] = function() {
 return (_rmdir = Module["_rmdir"] = Module["asm"]["rmdir"]).apply(null, arguments);
};

var _add_property_resource_ex = Module["_add_property_resource_ex"] = function() {
 return (_add_property_resource_ex = Module["_add_property_resource_ex"] = Module["asm"]["add_property_resource_ex"]).apply(null, arguments);
};

var _php_stream_xport_unregister = Module["_php_stream_xport_unregister"] = function() {
 return (_php_stream_xport_unregister = Module["_php_stream_xport_unregister"] = Module["asm"]["php_stream_xport_unregister"]).apply(null, arguments);
};

var _php_stream_xport_connect = Module["_php_stream_xport_connect"] = function() {
 return (_php_stream_xport_connect = Module["_php_stream_xport_connect"] = Module["asm"]["php_stream_xport_connect"]).apply(null, arguments);
};

var _php_stream_xport_bind = Module["_php_stream_xport_bind"] = function() {
 return (_php_stream_xport_bind = Module["_php_stream_xport_bind"] = Module["asm"]["php_stream_xport_bind"]).apply(null, arguments);
};

var _php_stream_xport_listen = Module["_php_stream_xport_listen"] = function() {
 return (_php_stream_xport_listen = Module["_php_stream_xport_listen"] = Module["asm"]["php_stream_xport_listen"]).apply(null, arguments);
};

var _send = Module["_send"] = function() {
 return (_send = Module["_send"] = Module["asm"]["send"]).apply(null, arguments);
};

var _recv = Module["_recv"] = function() {
 return (_recv = Module["_recv"] = Module["asm"]["recv"]).apply(null, arguments);
};

var _listen = Module["_listen"] = function() {
 return (_listen = Module["_listen"] = Module["asm"]["listen"]).apply(null, arguments);
};

var _shutdown = Module["_shutdown"] = function() {
 return (_shutdown = Module["_shutdown"] = Module["asm"]["shutdown"]).apply(null, arguments);
};

var _sendto = Module["_sendto"] = function() {
 return (_sendto = Module["_sendto"] = Module["asm"]["sendto"]).apply(null, arguments);
};

var _recvfrom = Module["_recvfrom"] = function() {
 return (_recvfrom = Module["_recvfrom"] = Module["asm"]["recvfrom"]).apply(null, arguments);
};

var __php_glob_stream_get_pattern = Module["__php_glob_stream_get_pattern"] = function() {
 return (__php_glob_stream_get_pattern = Module["__php_glob_stream_get_pattern"] = Module["asm"]["_php_glob_stream_get_pattern"]).apply(null, arguments);
};

var _zendparse = Module["_zendparse"] = function() {
 return (_zendparse = Module["_zendparse"] = Module["asm"]["zendparse"]).apply(null, arguments);
};

var _zend_lex_tstring = Module["_zend_lex_tstring"] = function() {
 return (_zend_lex_tstring = Module["_zend_lex_tstring"] = Module["asm"]["zend_lex_tstring"]).apply(null, arguments);
};

var _zend_ast_create_zval = Module["_zend_ast_create_zval"] = function() {
 return (_zend_ast_create_zval = Module["_zend_ast_create_zval"] = Module["asm"]["zend_ast_create_zval"]).apply(null, arguments);
};

var _zend_ast_list_add = Module["_zend_ast_list_add"] = function() {
 return (_zend_ast_list_add = Module["_zend_ast_list_add"] = Module["asm"]["zend_ast_list_add"]).apply(null, arguments);
};

var _zend_ast_create_list_0 = Module["_zend_ast_create_list_0"] = function() {
 return (_zend_ast_create_list_0 = Module["_zend_ast_create_list_0"] = Module["asm"]["zend_ast_create_list_0"]).apply(null, arguments);
};

var _zend_ast_create_2 = Module["_zend_ast_create_2"] = function() {
 return (_zend_ast_create_2 = Module["_zend_ast_create_2"] = Module["asm"]["zend_ast_create_2"]).apply(null, arguments);
};

var _zend_ast_create_list_1 = Module["_zend_ast_create_list_1"] = function() {
 return (_zend_ast_create_list_1 = Module["_zend_ast_create_list_1"] = Module["asm"]["zend_ast_create_list_1"]).apply(null, arguments);
};

var _zend_ast_create_1 = Module["_zend_ast_create_1"] = function() {
 return (_zend_ast_create_1 = Module["_zend_ast_create_1"] = Module["asm"]["zend_ast_create_1"]).apply(null, arguments);
};

var _zend_ast_create_zval_from_long = Module["_zend_ast_create_zval_from_long"] = function() {
 return (_zend_ast_create_zval_from_long = Module["_zend_ast_create_zval_from_long"] = Module["asm"]["zend_ast_create_zval_from_long"]).apply(null, arguments);
};

var _zend_get_scanned_file_offset = Module["_zend_get_scanned_file_offset"] = function() {
 return (_zend_get_scanned_file_offset = Module["_zend_get_scanned_file_offset"] = Module["asm"]["zend_get_scanned_file_offset"]).apply(null, arguments);
};

var _zend_ast_create_4 = Module["_zend_ast_create_4"] = function() {
 return (_zend_ast_create_4 = Module["_zend_ast_create_4"] = Module["asm"]["zend_ast_create_4"]).apply(null, arguments);
};

var _zend_ast_create_3 = Module["_zend_ast_create_3"] = function() {
 return (_zend_ast_create_3 = Module["_zend_ast_create_3"] = Module["asm"]["zend_ast_create_3"]).apply(null, arguments);
};

var _zend_ast_create_decl = Module["_zend_ast_create_decl"] = function() {
 return (_zend_ast_create_decl = Module["_zend_ast_create_decl"] = Module["asm"]["zend_ast_create_decl"]).apply(null, arguments);
};

var _zend_ast_create_zval_from_str = Module["_zend_ast_create_zval_from_str"] = function() {
 return (_zend_ast_create_zval_from_str = Module["_zend_ast_create_zval_from_str"] = Module["asm"]["zend_ast_create_zval_from_str"]).apply(null, arguments);
};

var _zend_ast_create_list_2 = Module["_zend_ast_create_list_2"] = function() {
 return (_zend_ast_create_list_2 = Module["_zend_ast_create_list_2"] = Module["asm"]["zend_ast_create_list_2"]).apply(null, arguments);
};

var _zend_ast_create_0 = Module["_zend_ast_create_0"] = function() {
 return (_zend_ast_create_0 = Module["_zend_ast_create_0"] = Module["asm"]["zend_ast_create_0"]).apply(null, arguments);
};

var _zend_ast_destroy = Module["_zend_ast_destroy"] = function() {
 return (_zend_ast_destroy = Module["_zend_ast_destroy"] = Module["asm"]["zend_ast_destroy"]).apply(null, arguments);
};

var _zend_ast_create_zval_ex = Module["_zend_ast_create_zval_ex"] = function() {
 return (_zend_ast_create_zval_ex = Module["_zend_ast_create_zval_ex"] = Module["asm"]["zend_ast_create_zval_ex"]).apply(null, arguments);
};

var _zend_ast_create_class_const_or_name = Module["_zend_ast_create_class_const_or_name"] = function() {
 return (_zend_ast_create_class_const_or_name = Module["_zend_ast_create_class_const_or_name"] = Module["asm"]["zend_ast_create_class_const_or_name"]).apply(null, arguments);
};

var _zend_ast_create_5 = Module["_zend_ast_create_5"] = function() {
 return (_zend_ast_create_5 = Module["_zend_ast_create_5"] = Module["asm"]["zend_ast_create_5"]).apply(null, arguments);
};

var _zend_ptr_stack_init = Module["_zend_ptr_stack_init"] = function() {
 return (_zend_ptr_stack_init = Module["_zend_ptr_stack_init"] = Module["asm"]["zend_ptr_stack_init"]).apply(null, arguments);
};

var _zend_ptr_stack_clean = Module["_zend_ptr_stack_clean"] = function() {
 return (_zend_ptr_stack_clean = Module["_zend_ptr_stack_clean"] = Module["asm"]["zend_ptr_stack_clean"]).apply(null, arguments);
};

var _zend_ptr_stack_destroy = Module["_zend_ptr_stack_destroy"] = function() {
 return (_zend_ptr_stack_destroy = Module["_zend_ptr_stack_destroy"] = Module["asm"]["zend_ptr_stack_destroy"]).apply(null, arguments);
};

var _zend_restore_compiled_filename = Module["_zend_restore_compiled_filename"] = function() {
 return (_zend_restore_compiled_filename = Module["_zend_restore_compiled_filename"] = Module["asm"]["zend_restore_compiled_filename"]).apply(null, arguments);
};

var _zend_multibyte_set_filter = Module["_zend_multibyte_set_filter"] = function() {
 return (_zend_multibyte_set_filter = Module["_zend_multibyte_set_filter"] = Module["asm"]["zend_multibyte_set_filter"]).apply(null, arguments);
};

var _zend_multibyte_check_lexer_compatibility = Module["_zend_multibyte_check_lexer_compatibility"] = function() {
 return (_zend_multibyte_check_lexer_compatibility = Module["_zend_multibyte_check_lexer_compatibility"] = Module["asm"]["zend_multibyte_check_lexer_compatibility"]).apply(null, arguments);
};

var _zend_stream_fixup = Module["_zend_stream_fixup"] = function() {
 return (_zend_stream_fixup = Module["_zend_stream_fixup"] = Module["asm"]["zend_stream_fixup"]).apply(null, arguments);
};

var _zend_multibyte_get_encoding_name = Module["_zend_multibyte_get_encoding_name"] = function() {
 return (_zend_multibyte_get_encoding_name = Module["_zend_multibyte_get_encoding_name"] = Module["asm"]["zend_multibyte_get_encoding_name"]).apply(null, arguments);
};

var _zend_set_compiled_filename = Module["_zend_set_compiled_filename"] = function() {
 return (_zend_set_compiled_filename = Module["_zend_set_compiled_filename"] = Module["asm"]["zend_set_compiled_filename"]).apply(null, arguments);
};

var _compile_file = Module["_compile_file"] = function() {
 return (_compile_file = Module["_compile_file"] = Module["asm"]["compile_file"]).apply(null, arguments);
};

var _zend_message_dispatcher = Module["_zend_message_dispatcher"] = function() {
 return (_zend_message_dispatcher = Module["_zend_message_dispatcher"] = Module["asm"]["zend_message_dispatcher"]).apply(null, arguments);
};

var _zend_compile_string_to_ast = Module["_zend_compile_string_to_ast"] = function() {
 return (_zend_compile_string_to_ast = Module["_zend_compile_string_to_ast"] = Module["asm"]["zend_compile_string_to_ast"]).apply(null, arguments);
};

var _zend_prepare_string_for_scanning = Module["_zend_prepare_string_for_scanning"] = function() {
 return (_zend_prepare_string_for_scanning = Module["_zend_prepare_string_for_scanning"] = Module["asm"]["zend_prepare_string_for_scanning"]).apply(null, arguments);
};

var _compile_filename = Module["_compile_filename"] = function() {
 return (_compile_filename = Module["_compile_filename"] = Module["asm"]["compile_filename"]).apply(null, arguments);
};

var _compile_string = Module["_compile_string"] = function() {
 return (_compile_string = Module["_compile_string"] = Module["asm"]["compile_string"]).apply(null, arguments);
};

var _zend_highlight = Module["_zend_highlight"] = function() {
 return (_zend_highlight = Module["_zend_highlight"] = Module["asm"]["zend_highlight"]).apply(null, arguments);
};

var _zend_multibyte_yyinput_again = Module["_zend_multibyte_yyinput_again"] = function() {
 return (_zend_multibyte_yyinput_again = Module["_zend_multibyte_yyinput_again"] = Module["asm"]["zend_multibyte_yyinput_again"]).apply(null, arguments);
};

var _lex_scan = Module["_lex_scan"] = function() {
 return (_lex_scan = Module["_lex_scan"] = Module["asm"]["lex_scan"]).apply(null, arguments);
};

var _zend_oct_strtod = Module["_zend_oct_strtod"] = function() {
 return (_zend_oct_strtod = Module["_zend_oct_strtod"] = Module["asm"]["zend_oct_strtod"]).apply(null, arguments);
};

var _zend_stack_is_empty = Module["_zend_stack_is_empty"] = function() {
 return (_zend_stack_is_empty = Module["_zend_stack_is_empty"] = Module["asm"]["zend_stack_is_empty"]).apply(null, arguments);
};

var _zend_bin_strtod = Module["_zend_bin_strtod"] = function() {
 return (_zend_bin_strtod = Module["_zend_bin_strtod"] = Module["asm"]["zend_bin_strtod"]).apply(null, arguments);
};

var _zend_hex_strtod = Module["_zend_hex_strtod"] = function() {
 return (_zend_hex_strtod = Module["_zend_hex_strtod"] = Module["asm"]["zend_hex_strtod"]).apply(null, arguments);
};

var _zend_ptr_stack_reverse_apply = Module["_zend_ptr_stack_reverse_apply"] = function() {
 return (_zend_ptr_stack_reverse_apply = Module["_zend_ptr_stack_reverse_apply"] = Module["asm"]["zend_ptr_stack_reverse_apply"]).apply(null, arguments);
};

var _zend_exception_save = Module["_zend_exception_save"] = function() {
 return (_zend_exception_save = Module["_zend_exception_save"] = Module["asm"]["zend_exception_save"]).apply(null, arguments);
};

var _zend_exception_restore = Module["_zend_exception_restore"] = function() {
 return (_zend_exception_restore = Module["_zend_exception_restore"] = Module["asm"]["zend_exception_restore"]).apply(null, arguments);
};

var _zend_ast_create_zval_with_lineno = Module["_zend_ast_create_zval_with_lineno"] = function() {
 return (_zend_ast_create_zval_with_lineno = Module["_zend_ast_create_zval_with_lineno"] = Module["asm"]["zend_ast_create_zval_with_lineno"]).apply(null, arguments);
};

var _init_op_array = Module["_init_op_array"] = function() {
 return (_init_op_array = Module["_init_op_array"] = Module["asm"]["init_op_array"]).apply(null, arguments);
};

var _pass_two = Module["_pass_two"] = function() {
 return (_pass_two = Module["_pass_two"] = Module["asm"]["pass_two"]).apply(null, arguments);
};

var _zend_get_configuration_directive = Module["_zend_get_configuration_directive"] = function() {
 return (_zend_get_configuration_directive = Module["_zend_get_configuration_directive"] = Module["asm"]["zend_get_configuration_directive"]).apply(null, arguments);
};

var _zend_get_constant = Module["_zend_get_constant"] = function() {
 return (_zend_get_constant = Module["_zend_get_constant"] = Module["asm"]["zend_get_constant"]).apply(null, arguments);
};

var _zend_mm_gc = Module["_zend_mm_gc"] = function() {
 return (_zend_mm_gc = Module["_zend_mm_gc"] = Module["asm"]["zend_mm_gc"]).apply(null, arguments);
};

var _zend_mm_shutdown = Module["_zend_mm_shutdown"] = function() {
 return (_zend_mm_shutdown = Module["_zend_mm_shutdown"] = Module["asm"]["zend_mm_shutdown"]).apply(null, arguments);
};

var __zend_mm_alloc = Module["__zend_mm_alloc"] = function() {
 return (__zend_mm_alloc = Module["__zend_mm_alloc"] = Module["asm"]["_zend_mm_alloc"]).apply(null, arguments);
};

var __zend_mm_free = Module["__zend_mm_free"] = function() {
 return (__zend_mm_free = Module["__zend_mm_free"] = Module["asm"]["_zend_mm_free"]).apply(null, arguments);
};

var __zend_mm_realloc = Module["__zend_mm_realloc"] = function() {
 return (__zend_mm_realloc = Module["__zend_mm_realloc"] = Module["asm"]["_zend_mm_realloc"]).apply(null, arguments);
};

var __zend_mm_realloc2 = Module["__zend_mm_realloc2"] = function() {
 return (__zend_mm_realloc2 = Module["__zend_mm_realloc2"] = Module["asm"]["_zend_mm_realloc2"]).apply(null, arguments);
};

var __zend_mm_block_size = Module["__zend_mm_block_size"] = function() {
 return (__zend_mm_block_size = Module["__zend_mm_block_size"] = Module["asm"]["_zend_mm_block_size"]).apply(null, arguments);
};

var _is_zend_ptr = Module["_is_zend_ptr"] = function() {
 return (_is_zend_ptr = Module["_is_zend_ptr"] = Module["asm"]["is_zend_ptr"]).apply(null, arguments);
};

var __efree_8 = Module["__efree_8"] = function() {
 return (__efree_8 = Module["__efree_8"] = Module["asm"]["_efree_8"]).apply(null, arguments);
};

var __efree_16 = Module["__efree_16"] = function() {
 return (__efree_16 = Module["__efree_16"] = Module["asm"]["_efree_16"]).apply(null, arguments);
};

var __efree_24 = Module["__efree_24"] = function() {
 return (__efree_24 = Module["__efree_24"] = Module["asm"]["_efree_24"]).apply(null, arguments);
};

var __efree_40 = Module["__efree_40"] = function() {
 return (__efree_40 = Module["__efree_40"] = Module["asm"]["_efree_40"]).apply(null, arguments);
};

var __efree_56 = Module["__efree_56"] = function() {
 return (__efree_56 = Module["__efree_56"] = Module["asm"]["_efree_56"]).apply(null, arguments);
};

var __efree_64 = Module["__efree_64"] = function() {
 return (__efree_64 = Module["__efree_64"] = Module["asm"]["_efree_64"]).apply(null, arguments);
};

var __efree_80 = Module["__efree_80"] = function() {
 return (__efree_80 = Module["__efree_80"] = Module["asm"]["_efree_80"]).apply(null, arguments);
};

var __efree_96 = Module["__efree_96"] = function() {
 return (__efree_96 = Module["__efree_96"] = Module["asm"]["_efree_96"]).apply(null, arguments);
};

var __efree_112 = Module["__efree_112"] = function() {
 return (__efree_112 = Module["__efree_112"] = Module["asm"]["_efree_112"]).apply(null, arguments);
};

var __efree_128 = Module["__efree_128"] = function() {
 return (__efree_128 = Module["__efree_128"] = Module["asm"]["_efree_128"]).apply(null, arguments);
};

var __efree_160 = Module["__efree_160"] = function() {
 return (__efree_160 = Module["__efree_160"] = Module["asm"]["_efree_160"]).apply(null, arguments);
};

var __efree_192 = Module["__efree_192"] = function() {
 return (__efree_192 = Module["__efree_192"] = Module["asm"]["_efree_192"]).apply(null, arguments);
};

var __efree_224 = Module["__efree_224"] = function() {
 return (__efree_224 = Module["__efree_224"] = Module["asm"]["_efree_224"]).apply(null, arguments);
};

var __efree_256 = Module["__efree_256"] = function() {
 return (__efree_256 = Module["__efree_256"] = Module["asm"]["_efree_256"]).apply(null, arguments);
};

var __efree_320 = Module["__efree_320"] = function() {
 return (__efree_320 = Module["__efree_320"] = Module["asm"]["_efree_320"]).apply(null, arguments);
};

var __efree_384 = Module["__efree_384"] = function() {
 return (__efree_384 = Module["__efree_384"] = Module["asm"]["_efree_384"]).apply(null, arguments);
};

var __efree_448 = Module["__efree_448"] = function() {
 return (__efree_448 = Module["__efree_448"] = Module["asm"]["_efree_448"]).apply(null, arguments);
};

var __efree_512 = Module["__efree_512"] = function() {
 return (__efree_512 = Module["__efree_512"] = Module["asm"]["_efree_512"]).apply(null, arguments);
};

var __efree_640 = Module["__efree_640"] = function() {
 return (__efree_640 = Module["__efree_640"] = Module["asm"]["_efree_640"]).apply(null, arguments);
};

var __efree_768 = Module["__efree_768"] = function() {
 return (__efree_768 = Module["__efree_768"] = Module["asm"]["_efree_768"]).apply(null, arguments);
};

var __efree_896 = Module["__efree_896"] = function() {
 return (__efree_896 = Module["__efree_896"] = Module["asm"]["_efree_896"]).apply(null, arguments);
};

var __efree_1024 = Module["__efree_1024"] = function() {
 return (__efree_1024 = Module["__efree_1024"] = Module["asm"]["_efree_1024"]).apply(null, arguments);
};

var __efree_1280 = Module["__efree_1280"] = function() {
 return (__efree_1280 = Module["__efree_1280"] = Module["asm"]["_efree_1280"]).apply(null, arguments);
};

var __efree_1536 = Module["__efree_1536"] = function() {
 return (__efree_1536 = Module["__efree_1536"] = Module["asm"]["_efree_1536"]).apply(null, arguments);
};

var __efree_1792 = Module["__efree_1792"] = function() {
 return (__efree_1792 = Module["__efree_1792"] = Module["asm"]["_efree_1792"]).apply(null, arguments);
};

var __efree_2048 = Module["__efree_2048"] = function() {
 return (__efree_2048 = Module["__efree_2048"] = Module["asm"]["_efree_2048"]).apply(null, arguments);
};

var __efree_2560 = Module["__efree_2560"] = function() {
 return (__efree_2560 = Module["__efree_2560"] = Module["asm"]["_efree_2560"]).apply(null, arguments);
};

var __efree_3072 = Module["__efree_3072"] = function() {
 return (__efree_3072 = Module["__efree_3072"] = Module["asm"]["_efree_3072"]).apply(null, arguments);
};

var __efree_huge = Module["__efree_huge"] = function() {
 return (__efree_huge = Module["__efree_huge"] = Module["asm"]["_efree_huge"]).apply(null, arguments);
};

var __erealloc2 = Module["__erealloc2"] = function() {
 return (__erealloc2 = Module["__erealloc2"] = Module["asm"]["_erealloc2"]).apply(null, arguments);
};

var __zend_mem_block_size = Module["__zend_mem_block_size"] = function() {
 return (__zend_mem_block_size = Module["__zend_mem_block_size"] = Module["asm"]["_zend_mem_block_size"]).apply(null, arguments);
};

var _start_memory_manager = Module["_start_memory_manager"] = function() {
 return (_start_memory_manager = Module["_start_memory_manager"] = Module["asm"]["start_memory_manager"]).apply(null, arguments);
};

var _zend_mm_set_heap = Module["_zend_mm_set_heap"] = function() {
 return (_zend_mm_set_heap = Module["_zend_mm_set_heap"] = Module["asm"]["zend_mm_set_heap"]).apply(null, arguments);
};

var _zend_mm_get_heap = Module["_zend_mm_get_heap"] = function() {
 return (_zend_mm_get_heap = Module["_zend_mm_get_heap"] = Module["asm"]["zend_mm_get_heap"]).apply(null, arguments);
};

var _zend_mm_is_custom_heap = Module["_zend_mm_is_custom_heap"] = function() {
 return (_zend_mm_is_custom_heap = Module["_zend_mm_is_custom_heap"] = Module["asm"]["zend_mm_is_custom_heap"]).apply(null, arguments);
};

var _zend_mm_set_custom_handlers = Module["_zend_mm_set_custom_handlers"] = function() {
 return (_zend_mm_set_custom_handlers = Module["_zend_mm_set_custom_handlers"] = Module["asm"]["zend_mm_set_custom_handlers"]).apply(null, arguments);
};

var _zend_mm_get_custom_handlers = Module["_zend_mm_get_custom_handlers"] = function() {
 return (_zend_mm_get_custom_handlers = Module["_zend_mm_get_custom_handlers"] = Module["asm"]["zend_mm_get_custom_handlers"]).apply(null, arguments);
};

var _zend_mm_get_storage = Module["_zend_mm_get_storage"] = function() {
 return (_zend_mm_get_storage = Module["_zend_mm_get_storage"] = Module["asm"]["zend_mm_get_storage"]).apply(null, arguments);
};

var _zend_mm_startup = Module["_zend_mm_startup"] = function() {
 return (_zend_mm_startup = Module["_zend_mm_startup"] = Module["asm"]["zend_mm_startup"]).apply(null, arguments);
};

var _zend_mm_startup_ex = Module["_zend_mm_startup_ex"] = function() {
 return (_zend_mm_startup_ex = Module["_zend_mm_startup_ex"] = Module["asm"]["zend_mm_startup_ex"]).apply(null, arguments);
};

var _madvise = Module["_madvise"] = function() {
 return (_madvise = Module["_madvise"] = Module["asm"]["madvise"]).apply(null, arguments);
};

var _zend_call_stack_init = Module["_zend_call_stack_init"] = function() {
 return (_zend_call_stack_init = Module["_zend_call_stack_init"] = Module["asm"]["zend_call_stack_init"]).apply(null, arguments);
};

var _zend_call_stack_get = Module["_zend_call_stack_get"] = function() {
 return (_zend_call_stack_get = Module["_zend_call_stack_get"] = Module["asm"]["zend_call_stack_get"]).apply(null, arguments);
};

var _zend_init_rsrc_list = Module["_zend_init_rsrc_list"] = function() {
 return (_zend_init_rsrc_list = Module["_zend_init_rsrc_list"] = Module["asm"]["zend_init_rsrc_list"]).apply(null, arguments);
};

var _zend_create_member_string = Module["_zend_create_member_string"] = function() {
 return (_zend_create_member_string = Module["_zend_create_member_string"] = Module["asm"]["zend_create_member_string"]).apply(null, arguments);
};

var _function_add_ref = Module["_function_add_ref"] = function() {
 return (_function_add_ref = Module["_function_add_ref"] = Module["asm"]["function_add_ref"]).apply(null, arguments);
};

var _do_bind_function = Module["_do_bind_function"] = function() {
 return (_do_bind_function = Module["_do_bind_function"] = Module["asm"]["do_bind_function"]).apply(null, arguments);
};

var _zend_bind_class_in_slot = Module["_zend_bind_class_in_slot"] = function() {
 return (_zend_bind_class_in_slot = Module["_zend_bind_class_in_slot"] = Module["asm"]["zend_bind_class_in_slot"]).apply(null, arguments);
};

var _zend_hash_set_bucket_key = Module["_zend_hash_set_bucket_key"] = function() {
 return (_zend_hash_set_bucket_key = Module["_zend_hash_set_bucket_key"] = Module["asm"]["zend_hash_set_bucket_key"]).apply(null, arguments);
};

var _zend_do_link_class = Module["_zend_do_link_class"] = function() {
 return (_zend_do_link_class = Module["_zend_do_link_class"] = Module["asm"]["zend_do_link_class"]).apply(null, arguments);
};

var _do_bind_class = Module["_do_bind_class"] = function() {
 return (_do_bind_class = Module["_do_bind_class"] = Module["asm"]["do_bind_class"]).apply(null, arguments);
};

var _zend_is_auto_global_str = Module["_zend_is_auto_global_str"] = function() {
 return (_zend_is_auto_global_str = Module["_zend_is_auto_global_str"] = Module["asm"]["zend_is_auto_global_str"]).apply(null, arguments);
};

var _zend_initialize_class_data = Module["_zend_initialize_class_data"] = function() {
 return (_zend_initialize_class_data = Module["_zend_initialize_class_data"] = Module["asm"]["zend_initialize_class_data"]).apply(null, arguments);
};

var _zend_function_dtor = Module["_zend_function_dtor"] = function() {
 return (_zend_function_dtor = Module["_zend_function_dtor"] = Module["asm"]["zend_function_dtor"]).apply(null, arguments);
};

var _zend_get_compiled_variable_name = Module["_zend_get_compiled_variable_name"] = function() {
 return (_zend_get_compiled_variable_name = Module["_zend_get_compiled_variable_name"] = Module["asm"]["zend_get_compiled_variable_name"]).apply(null, arguments);
};

var _zend_is_smart_branch = Module["_zend_is_smart_branch"] = function() {
 return (_zend_is_smart_branch = Module["_zend_is_smart_branch"] = Module["asm"]["zend_is_smart_branch"]).apply(null, arguments);
};

var _zend_get_call_op = Module["_zend_get_call_op"] = function() {
 return (_zend_get_call_op = Module["_zend_get_call_op"] = Module["asm"]["zend_get_call_op"]).apply(null, arguments);
};

var _execute_ex = Module["_execute_ex"] = function() {
 return (_execute_ex = Module["_execute_ex"] = Module["asm"]["execute_ex"]).apply(null, arguments);
};

var _zend_vm_set_opcode_handler = Module["_zend_vm_set_opcode_handler"] = function() {
 return (_zend_vm_set_opcode_handler = Module["_zend_vm_set_opcode_handler"] = Module["asm"]["zend_vm_set_opcode_handler"]).apply(null, arguments);
};

var _zend_multibyte_fetch_encoding = Module["_zend_multibyte_fetch_encoding"] = function() {
 return (_zend_multibyte_fetch_encoding = Module["_zend_multibyte_fetch_encoding"] = Module["asm"]["zend_multibyte_fetch_encoding"]).apply(null, arguments);
};

var _zend_is_op_long_compatible = Module["_zend_is_op_long_compatible"] = function() {
 return (_zend_is_op_long_compatible = Module["_zend_is_op_long_compatible"] = Module["asm"]["zend_is_op_long_compatible"]).apply(null, arguments);
};

var _zend_binary_op_produces_error = Module["_zend_binary_op_produces_error"] = function() {
 return (_zend_binary_op_produces_error = Module["_zend_binary_op_produces_error"] = Module["asm"]["zend_binary_op_produces_error"]).apply(null, arguments);
};

var _zend_unary_op_produces_error = Module["_zend_unary_op_produces_error"] = function() {
 return (_zend_unary_op_produces_error = Module["_zend_unary_op_produces_error"] = Module["asm"]["zend_unary_op_produces_error"]).apply(null, arguments);
};

var _zend_ast_copy = Module["_zend_ast_copy"] = function() {
 return (_zend_ast_copy = Module["_zend_ast_copy"] = Module["asm"]["zend_ast_copy"]).apply(null, arguments);
};

var _zend_hash_str_find_ptr_lc = Module["_zend_hash_str_find_ptr_lc"] = function() {
 return (_zend_hash_str_find_ptr_lc = Module["_zend_hash_str_find_ptr_lc"] = Module["asm"]["zend_hash_str_find_ptr_lc"]).apply(null, arguments);
};

var _zend_hash_find_ptr_lc = Module["_zend_hash_find_ptr_lc"] = function() {
 return (_zend_hash_find_ptr_lc = Module["_zend_hash_find_ptr_lc"] = Module["asm"]["zend_hash_find_ptr_lc"]).apply(null, arguments);
};

var __zend_observer_function_declared_notify = Module["__zend_observer_function_declared_notify"] = function() {
 return (__zend_observer_function_declared_notify = Module["__zend_observer_function_declared_notify"] = Module["asm"]["_zend_observer_function_declared_notify"]).apply(null, arguments);
};

var _zend_get_object_type_case = Module["_zend_get_object_type_case"] = function() {
 return (_zend_get_object_type_case = Module["_zend_get_object_type_case"] = Module["asm"]["zend_get_object_type_case"]).apply(null, arguments);
};

var __zend_observer_class_linked_notify = Module["__zend_observer_class_linked_notify"] = function() {
 return (__zend_observer_class_linked_notify = Module["__zend_observer_class_linked_notify"] = Module["asm"]["_zend_observer_class_linked_notify"]).apply(null, arguments);
};

var _zend_ast_apply = Module["_zend_ast_apply"] = function() {
 return (_zend_ast_apply = Module["_zend_ast_apply"] = Module["asm"]["zend_ast_apply"]).apply(null, arguments);
};

var _zend_ast_create_constant = Module["_zend_ast_create_constant"] = function() {
 return (_zend_ast_create_constant = Module["_zend_ast_create_constant"] = Module["asm"]["zend_ast_create_constant"]).apply(null, arguments);
};

var __zend_get_special_const = Module["__zend_get_special_const"] = function() {
 return (__zend_get_special_const = Module["__zend_get_special_const"] = Module["asm"]["_zend_get_special_const"]).apply(null, arguments);
};

var _zend_check_magic_method_implementation = Module["_zend_check_magic_method_implementation"] = function() {
 return (_zend_check_magic_method_implementation = Module["_zend_check_magic_method_implementation"] = Module["asm"]["zend_check_magic_method_implementation"]).apply(null, arguments);
};

var _zend_add_magic_method = Module["_zend_add_magic_method"] = function() {
 return (_zend_add_magic_method = Module["_zend_add_magic_method"] = Module["asm"]["zend_add_magic_method"]).apply(null, arguments);
};

var _zend_internal_attribute_get = Module["_zend_internal_attribute_get"] = function() {
 return (_zend_internal_attribute_get = Module["_zend_internal_attribute_get"] = Module["asm"]["zend_internal_attribute_get"]).apply(null, arguments);
};

var _zend_get_type_by_const = Module["_zend_get_type_by_const"] = function() {
 return (_zend_get_type_by_const = Module["_zend_get_type_by_const"] = Module["asm"]["zend_get_type_by_const"]).apply(null, arguments);
};

var _zend_alloc_ce_cache = Module["_zend_alloc_ce_cache"] = function() {
 return (_zend_alloc_ce_cache = Module["_zend_alloc_ce_cache"] = Module["asm"]["zend_alloc_ce_cache"]).apply(null, arguments);
};

var _zend_map_ptr_new = Module["_zend_map_ptr_new"] = function() {
 return (_zend_map_ptr_new = Module["_zend_map_ptr_new"] = Module["asm"]["zend_map_ptr_new"]).apply(null, arguments);
};

var _zend_try_early_bind = Module["_zend_try_early_bind"] = function() {
 return (_zend_try_early_bind = Module["_zend_try_early_bind"] = Module["asm"]["zend_try_early_bind"]).apply(null, arguments);
};

var _zend_type_release = Module["_zend_type_release"] = function() {
 return (_zend_type_release = Module["_zend_type_release"] = Module["asm"]["zend_type_release"]).apply(null, arguments);
};

var _zend_ast_create_znode = Module["_zend_ast_create_znode"] = function() {
 return (_zend_ast_create_znode = Module["_zend_ast_create_znode"] = Module["asm"]["zend_ast_create_znode"]).apply(null, arguments);
};

var _zend_check_protected = Module["_zend_check_protected"] = function() {
 return (_zend_check_protected = Module["_zend_check_protected"] = Module["asm"]["zend_check_protected"]).apply(null, arguments);
};

var _get_binary_op = Module["_get_binary_op"] = function() {
 return (_get_binary_op = Module["_get_binary_op"] = Module["asm"]["get_binary_op"]).apply(null, arguments);
};

var _is_smaller_function = Module["_is_smaller_function"] = function() {
 return (_is_smaller_function = Module["_is_smaller_function"] = Module["asm"]["is_smaller_function"]).apply(null, arguments);
};

var _is_smaller_or_equal_function = Module["_is_smaller_or_equal_function"] = function() {
 return (_is_smaller_or_equal_function = Module["_is_smaller_or_equal_function"] = Module["asm"]["is_smaller_or_equal_function"]).apply(null, arguments);
};

var _get_unary_op = Module["_get_unary_op"] = function() {
 return (_get_unary_op = Module["_get_unary_op"] = Module["asm"]["get_unary_op"]).apply(null, arguments);
};

var _concat_function = Module["_concat_function"] = function() {
 return (_concat_function = Module["_concat_function"] = Module["asm"]["concat_function"]).apply(null, arguments);
};

var _zval_internal_ptr_dtor = Module["_zval_internal_ptr_dtor"] = function() {
 return (_zval_internal_ptr_dtor = Module["_zval_internal_ptr_dtor"] = Module["asm"]["zval_internal_ptr_dtor"]).apply(null, arguments);
};

var _zend_register_null_constant = Module["_zend_register_null_constant"] = function() {
 return (_zend_register_null_constant = Module["_zend_register_null_constant"] = Module["asm"]["zend_register_null_constant"]).apply(null, arguments);
};

var _zend_register_constant = Module["_zend_register_constant"] = function() {
 return (_zend_register_constant = Module["_zend_register_constant"] = Module["asm"]["zend_register_constant"]).apply(null, arguments);
};

var _zend_verify_const_access = Module["_zend_verify_const_access"] = function() {
 return (_zend_verify_const_access = Module["_zend_verify_const_access"] = Module["asm"]["zend_verify_const_access"]).apply(null, arguments);
};

var _zend_get_class_constant_ex = Module["_zend_get_class_constant_ex"] = function() {
 return (_zend_get_class_constant_ex = Module["_zend_get_class_constant_ex"] = Module["asm"]["zend_get_class_constant_ex"]).apply(null, arguments);
};

var _zend_init_fpu = Module["_zend_init_fpu"] = function() {
 return (_zend_init_fpu = Module["_zend_init_fpu"] = Module["asm"]["zend_init_fpu"]).apply(null, arguments);
};

var _zend_vm_stack_init = Module["_zend_vm_stack_init"] = function() {
 return (_zend_vm_stack_init = Module["_zend_vm_stack_init"] = Module["asm"]["zend_vm_stack_init"]).apply(null, arguments);
};

var _zend_objects_store_init = Module["_zend_objects_store_init"] = function() {
 return (_zend_objects_store_init = Module["_zend_objects_store_init"] = Module["asm"]["zend_objects_store_init"]).apply(null, arguments);
};

var _zend_hash_reverse_apply = Module["_zend_hash_reverse_apply"] = function() {
 return (_zend_hash_reverse_apply = Module["_zend_hash_reverse_apply"] = Module["asm"]["zend_hash_reverse_apply"]).apply(null, arguments);
};

var _zend_objects_store_call_destructors = Module["_zend_objects_store_call_destructors"] = function() {
 return (_zend_objects_store_call_destructors = Module["_zend_objects_store_call_destructors"] = Module["asm"]["zend_objects_store_call_destructors"]).apply(null, arguments);
};

var _zend_shutdown_executor_values = Module["_zend_shutdown_executor_values"] = function() {
 return (_zend_shutdown_executor_values = Module["_zend_shutdown_executor_values"] = Module["asm"]["zend_shutdown_executor_values"]).apply(null, arguments);
};

var _zend_hash_graceful_reverse_destroy = Module["_zend_hash_graceful_reverse_destroy"] = function() {
 return (_zend_hash_graceful_reverse_destroy = Module["_zend_hash_graceful_reverse_destroy"] = Module["asm"]["zend_hash_graceful_reverse_destroy"]).apply(null, arguments);
};

var _zend_cleanup_internal_class_data = Module["_zend_cleanup_internal_class_data"] = function() {
 return (_zend_cleanup_internal_class_data = Module["_zend_cleanup_internal_class_data"] = Module["asm"]["zend_cleanup_internal_class_data"]).apply(null, arguments);
};

var _zend_cleanup_mutable_class_data = Module["_zend_cleanup_mutable_class_data"] = function() {
 return (_zend_cleanup_mutable_class_data = Module["_zend_cleanup_mutable_class_data"] = Module["asm"]["zend_cleanup_mutable_class_data"]).apply(null, arguments);
};

var _zend_stack_clean = Module["_zend_stack_clean"] = function() {
 return (_zend_stack_clean = Module["_zend_stack_clean"] = Module["asm"]["zend_stack_clean"]).apply(null, arguments);
};

var _zend_hash_discard = Module["_zend_hash_discard"] = function() {
 return (_zend_hash_discard = Module["_zend_hash_discard"] = Module["asm"]["zend_hash_discard"]).apply(null, arguments);
};

var _zend_objects_store_free_object_storage = Module["_zend_objects_store_free_object_storage"] = function() {
 return (_zend_objects_store_free_object_storage = Module["_zend_objects_store_free_object_storage"] = Module["asm"]["zend_objects_store_free_object_storage"]).apply(null, arguments);
};

var _zend_vm_stack_destroy = Module["_zend_vm_stack_destroy"] = function() {
 return (_zend_vm_stack_destroy = Module["_zend_vm_stack_destroy"] = Module["asm"]["zend_vm_stack_destroy"]).apply(null, arguments);
};

var _destroy_zend_class = Module["_destroy_zend_class"] = function() {
 return (_destroy_zend_class = Module["_destroy_zend_class"] = Module["asm"]["destroy_zend_class"]).apply(null, arguments);
};

var _zend_objects_store_destroy = Module["_zend_objects_store_destroy"] = function() {
 return (_zend_objects_store_destroy = Module["_zend_objects_store_destroy"] = Module["asm"]["zend_objects_store_destroy"]).apply(null, arguments);
};

var _zend_shutdown_fpu = Module["_zend_shutdown_fpu"] = function() {
 return (_zend_shutdown_fpu = Module["_zend_shutdown_fpu"] = Module["asm"]["zend_shutdown_fpu"]).apply(null, arguments);
};

var _get_function_or_method_name = Module["_get_function_or_method_name"] = function() {
 return (_get_function_or_method_name = Module["_get_function_or_method_name"] = Module["asm"]["get_function_or_method_name"]).apply(null, arguments);
};

var _get_function_arg_name = Module["_get_function_arg_name"] = function() {
 return (_get_function_arg_name = Module["_get_function_arg_name"] = Module["asm"]["get_function_arg_name"]).apply(null, arguments);
};

var _zval_update_constant_with_ctx = Module["_zval_update_constant_with_ctx"] = function() {
 return (_zval_update_constant_with_ctx = Module["_zval_update_constant_with_ctx"] = Module["asm"]["zval_update_constant_with_ctx"]).apply(null, arguments);
};

var _zend_ast_evaluate_ex = Module["_zend_ast_evaluate_ex"] = function() {
 return (_zend_ast_evaluate_ex = Module["_zend_ast_evaluate_ex"] = Module["asm"]["zend_ast_evaluate_ex"]).apply(null, arguments);
};

var _zval_update_constant = Module["_zval_update_constant"] = function() {
 return (_zval_update_constant = Module["_zval_update_constant"] = Module["asm"]["zval_update_constant"]).apply(null, arguments);
};

var _zend_get_callable_name_ex = Module["_zend_get_callable_name_ex"] = function() {
 return (_zend_get_callable_name_ex = Module["_zend_get_callable_name_ex"] = Module["asm"]["zend_get_callable_name_ex"]).apply(null, arguments);
};

var _zend_deprecated_function = Module["_zend_deprecated_function"] = function() {
 return (_zend_deprecated_function = Module["_zend_deprecated_function"] = Module["asm"]["zend_deprecated_function"]).apply(null, arguments);
};

var _zend_handle_undef_args = Module["_zend_handle_undef_args"] = function() {
 return (_zend_handle_undef_args = Module["_zend_handle_undef_args"] = Module["asm"]["zend_handle_undef_args"]).apply(null, arguments);
};

var _zend_init_func_execute_data = Module["_zend_init_func_execute_data"] = function() {
 return (_zend_init_func_execute_data = Module["_zend_init_func_execute_data"] = Module["asm"]["zend_init_func_execute_data"]).apply(null, arguments);
};

var _zend_observer_fcall_begin = Module["_zend_observer_fcall_begin"] = function() {
 return (_zend_observer_fcall_begin = Module["_zend_observer_fcall_begin"] = Module["asm"]["zend_observer_fcall_begin"]).apply(null, arguments);
};

var _zend_observer_fcall_end = Module["_zend_observer_fcall_end"] = function() {
 return (_zend_observer_fcall_end = Module["_zend_observer_fcall_end"] = Module["asm"]["zend_observer_fcall_end"]).apply(null, arguments);
};

var _zend_timeout = Module["_zend_timeout"] = function() {
 return (_zend_timeout = Module["_zend_timeout"] = Module["asm"]["zend_timeout"]).apply(null, arguments);
};

var _zend_hash_index_add_empty_element = Module["_zend_hash_index_add_empty_element"] = function() {
 return (_zend_hash_index_add_empty_element = Module["_zend_hash_index_add_empty_element"] = Module["asm"]["zend_hash_index_add_empty_element"]).apply(null, arguments);
};

var _zend_eval_stringl = Module["_zend_eval_stringl"] = function() {
 return (_zend_eval_stringl = Module["_zend_eval_stringl"] = Module["asm"]["zend_eval_stringl"]).apply(null, arguments);
};

var _zend_destroy_static_vars = Module["_zend_destroy_static_vars"] = function() {
 return (_zend_destroy_static_vars = Module["_zend_destroy_static_vars"] = Module["asm"]["zend_destroy_static_vars"]).apply(null, arguments);
};

var _zend_eval_stringl_ex = Module["_zend_eval_stringl_ex"] = function() {
 return (_zend_eval_stringl_ex = Module["_zend_eval_stringl_ex"] = Module["asm"]["zend_eval_stringl_ex"]).apply(null, arguments);
};

var _zend_eval_string_ex = Module["_zend_eval_string_ex"] = function() {
 return (_zend_eval_string_ex = Module["_zend_eval_string_ex"] = Module["asm"]["zend_eval_string_ex"]).apply(null, arguments);
};

var _setitimer = Module["_setitimer"] = function() {
 return (_setitimer = Module["_setitimer"] = Module["asm"]["setitimer"]).apply(null, arguments);
};

var _zend_fetch_class_with_scope = Module["_zend_fetch_class_with_scope"] = function() {
 return (_zend_fetch_class_with_scope = Module["_zend_fetch_class_with_scope"] = Module["asm"]["zend_fetch_class_with_scope"]).apply(null, arguments);
};

var _zend_hash_del_ind = Module["_zend_hash_del_ind"] = function() {
 return (_zend_hash_del_ind = Module["_zend_hash_del_ind"] = Module["asm"]["zend_hash_del_ind"]).apply(null, arguments);
};

var _zend_attach_symbol_table = Module["_zend_attach_symbol_table"] = function() {
 return (_zend_attach_symbol_table = Module["_zend_attach_symbol_table"] = Module["asm"]["zend_attach_symbol_table"]).apply(null, arguments);
};

var _zend_detach_symbol_table = Module["_zend_detach_symbol_table"] = function() {
 return (_zend_detach_symbol_table = Module["_zend_detach_symbol_table"] = Module["asm"]["zend_detach_symbol_table"]).apply(null, arguments);
};

var _zend_set_local_var = Module["_zend_set_local_var"] = function() {
 return (_zend_set_local_var = Module["_zend_set_local_var"] = Module["asm"]["zend_set_local_var"]).apply(null, arguments);
};

var _zend_hash_func = Module["_zend_hash_func"] = function() {
 return (_zend_hash_func = Module["_zend_hash_func"] = Module["asm"]["zend_hash_func"]).apply(null, arguments);
};

var _zend_signal = Module["_zend_signal"] = function() {
 return (_zend_signal = Module["_zend_signal"] = Module["asm"]["zend_signal"]).apply(null, arguments);
};

var __exit = Module["__exit"] = function() {
 return (__exit = Module["__exit"] = Module["asm"]["_exit"]).apply(null, arguments);
};

var _zend_html_putc = Module["_zend_html_putc"] = function() {
 return (_zend_html_putc = Module["_zend_html_putc"] = Module["asm"]["zend_html_putc"]).apply(null, arguments);
};

var _zend_llist_prepend_element = Module["_zend_llist_prepend_element"] = function() {
 return (_zend_llist_prepend_element = Module["_zend_llist_prepend_element"] = Module["asm"]["zend_llist_prepend_element"]).apply(null, arguments);
};

var _zend_llist_remove_tail = Module["_zend_llist_remove_tail"] = function() {
 return (_zend_llist_remove_tail = Module["_zend_llist_remove_tail"] = Module["asm"]["zend_llist_remove_tail"]).apply(null, arguments);
};

var _zend_llist_copy = Module["_zend_llist_copy"] = function() {
 return (_zend_llist_copy = Module["_zend_llist_copy"] = Module["asm"]["zend_llist_copy"]).apply(null, arguments);
};

var _zend_llist_apply_with_del = Module["_zend_llist_apply_with_del"] = function() {
 return (_zend_llist_apply_with_del = Module["_zend_llist_apply_with_del"] = Module["asm"]["zend_llist_apply_with_del"]).apply(null, arguments);
};

var _zend_llist_sort = Module["_zend_llist_sort"] = function() {
 return (_zend_llist_sort = Module["_zend_llist_sort"] = Module["asm"]["zend_llist_sort"]).apply(null, arguments);
};

var _zend_llist_apply_with_arguments = Module["_zend_llist_apply_with_arguments"] = function() {
 return (_zend_llist_apply_with_arguments = Module["_zend_llist_apply_with_arguments"] = Module["asm"]["zend_llist_apply_with_arguments"]).apply(null, arguments);
};

var _zend_llist_get_last_ex = Module["_zend_llist_get_last_ex"] = function() {
 return (_zend_llist_get_last_ex = Module["_zend_llist_get_last_ex"] = Module["asm"]["zend_llist_get_last_ex"]).apply(null, arguments);
};

var _zend_llist_get_prev_ex = Module["_zend_llist_get_prev_ex"] = function() {
 return (_zend_llist_get_prev_ex = Module["_zend_llist_get_prev_ex"] = Module["asm"]["zend_llist_get_prev_ex"]).apply(null, arguments);
};

var _zend_get_opcode_name = Module["_zend_get_opcode_name"] = function() {
 return (_zend_get_opcode_name = Module["_zend_get_opcode_name"] = Module["asm"]["zend_get_opcode_name"]).apply(null, arguments);
};

var _zend_get_opcode_flags = Module["_zend_get_opcode_flags"] = function() {
 return (_zend_get_opcode_flags = Module["_zend_get_opcode_flags"] = Module["asm"]["zend_get_opcode_flags"]).apply(null, arguments);
};

var _zend_get_opcode_id = Module["_zend_get_opcode_id"] = function() {
 return (_zend_get_opcode_id = Module["_zend_get_opcode_id"] = Module["asm"]["zend_get_opcode_id"]).apply(null, arguments);
};

var _destroy_zend_function = Module["_destroy_zend_function"] = function() {
 return (_destroy_zend_function = Module["_destroy_zend_function"] = Module["asm"]["destroy_zend_function"]).apply(null, arguments);
};

var _zend_recalc_live_ranges = Module["_zend_recalc_live_ranges"] = function() {
 return (_zend_recalc_live_ranges = Module["_zend_recalc_live_ranges"] = Module["asm"]["zend_recalc_live_ranges"]).apply(null, arguments);
};

var _bitwise_not_function = Module["_bitwise_not_function"] = function() {
 return (_bitwise_not_function = Module["_bitwise_not_function"] = Module["asm"]["bitwise_not_function"]).apply(null, arguments);
};

var _boolean_not_function = Module["_boolean_not_function"] = function() {
 return (_boolean_not_function = Module["_boolean_not_function"] = Module["asm"]["boolean_not_function"]).apply(null, arguments);
};

var _sub_function = Module["_sub_function"] = function() {
 return (_sub_function = Module["_sub_function"] = Module["asm"]["sub_function"]).apply(null, arguments);
};

var _div_function = Module["_div_function"] = function() {
 return (_div_function = Module["_div_function"] = Module["asm"]["div_function"]).apply(null, arguments);
};

var _mod_function = Module["_mod_function"] = function() {
 return (_mod_function = Module["_mod_function"] = Module["asm"]["mod_function"]).apply(null, arguments);
};

var _shift_left_function = Module["_shift_left_function"] = function() {
 return (_shift_left_function = Module["_shift_left_function"] = Module["asm"]["shift_left_function"]).apply(null, arguments);
};

var _shift_right_function = Module["_shift_right_function"] = function() {
 return (_shift_right_function = Module["_shift_right_function"] = Module["asm"]["shift_right_function"]).apply(null, arguments);
};

var _is_identical_function = Module["_is_identical_function"] = function() {
 return (_is_identical_function = Module["_is_identical_function"] = Module["asm"]["is_identical_function"]).apply(null, arguments);
};

var _is_not_identical_function = Module["_is_not_identical_function"] = function() {
 return (_is_not_identical_function = Module["_is_not_identical_function"] = Module["asm"]["is_not_identical_function"]).apply(null, arguments);
};

var _is_equal_function = Module["_is_equal_function"] = function() {
 return (_is_equal_function = Module["_is_equal_function"] = Module["asm"]["is_equal_function"]).apply(null, arguments);
};

var _is_not_equal_function = Module["_is_not_equal_function"] = function() {
 return (_is_not_equal_function = Module["_is_not_equal_function"] = Module["asm"]["is_not_equal_function"]).apply(null, arguments);
};

var _compare_function = Module["_compare_function"] = function() {
 return (_compare_function = Module["_compare_function"] = Module["asm"]["compare_function"]).apply(null, arguments);
};

var _bitwise_or_function = Module["_bitwise_or_function"] = function() {
 return (_bitwise_or_function = Module["_bitwise_or_function"] = Module["asm"]["bitwise_or_function"]).apply(null, arguments);
};

var _bitwise_and_function = Module["_bitwise_and_function"] = function() {
 return (_bitwise_and_function = Module["_bitwise_and_function"] = Module["asm"]["bitwise_and_function"]).apply(null, arguments);
};

var _bitwise_xor_function = Module["_bitwise_xor_function"] = function() {
 return (_bitwise_xor_function = Module["_bitwise_xor_function"] = Module["asm"]["bitwise_xor_function"]).apply(null, arguments);
};

var _boolean_xor_function = Module["_boolean_xor_function"] = function() {
 return (_boolean_xor_function = Module["_boolean_xor_function"] = Module["asm"]["boolean_xor_function"]).apply(null, arguments);
};

var _zend_atol = Module["_zend_atol"] = function() {
 return (_zend_atol = Module["_zend_atol"] = Module["asm"]["zend_atol"]).apply(null, arguments);
};

var _zend_atoi = Module["_zend_atoi"] = function() {
 return (_zend_atoi = Module["_zend_atoi"] = Module["asm"]["zend_atoi"]).apply(null, arguments);
};

var _convert_scalar_to_number = Module["_convert_scalar_to_number"] = function() {
 return (_convert_scalar_to_number = Module["_convert_scalar_to_number"] = Module["asm"]["convert_scalar_to_number"]).apply(null, arguments);
};

var _zval_try_get_long = Module["_zval_try_get_long"] = function() {
 return (_zval_try_get_long = Module["_zval_try_get_long"] = Module["asm"]["zval_try_get_long"]).apply(null, arguments);
};

var _zend_std_build_object_properties_array = Module["_zend_std_build_object_properties_array"] = function() {
 return (_zend_std_build_object_properties_array = Module["_zend_std_build_object_properties_array"] = Module["asm"]["zend_std_build_object_properties_array"]).apply(null, arguments);
};

var _zend_symtable_to_proptable = Module["_zend_symtable_to_proptable"] = function() {
 return (_zend_symtable_to_proptable = Module["_zend_symtable_to_proptable"] = Module["asm"]["zend_symtable_to_proptable"]).apply(null, arguments);
};

var _zend_error_unchecked = Module["_zend_error_unchecked"] = function() {
 return (_zend_error_unchecked = Module["_zend_error_unchecked"] = Module["asm"]["zend_error_unchecked"]).apply(null, arguments);
};

var _zend_incompatible_string_to_long_error = Module["_zend_incompatible_string_to_long_error"] = function() {
 return (_zend_incompatible_string_to_long_error = Module["_zend_incompatible_string_to_long_error"] = Module["asm"]["zend_incompatible_string_to_long_error"]).apply(null, arguments);
};

var _string_compare_function_ex = Module["_string_compare_function_ex"] = function() {
 return (_string_compare_function_ex = Module["_string_compare_function_ex"] = Module["asm"]["string_compare_function_ex"]).apply(null, arguments);
};

var _zend_class_implements_interface = Module["_zend_class_implements_interface"] = function() {
 return (_zend_class_implements_interface = Module["_zend_class_implements_interface"] = Module["asm"]["zend_class_implements_interface"]).apply(null, arguments);
};

var _increment_function = Module["_increment_function"] = function() {
 return (_increment_function = Module["_increment_function"] = Module["asm"]["increment_function"]).apply(null, arguments);
};

var _decrement_function = Module["_decrement_function"] = function() {
 return (_decrement_function = Module["_decrement_function"] = Module["asm"]["decrement_function"]).apply(null, arguments);
};

var ___ctype_get_mb_cur_max = Module["___ctype_get_mb_cur_max"] = function() {
 return (___ctype_get_mb_cur_max = Module["___ctype_get_mb_cur_max"] = Module["asm"]["__ctype_get_mb_cur_max"]).apply(null, arguments);
};

var _zend_str_toupper_copy = Module["_zend_str_toupper_copy"] = function() {
 return (_zend_str_toupper_copy = Module["_zend_str_toupper_copy"] = Module["asm"]["zend_str_toupper_copy"]).apply(null, arguments);
};

var _zend_str_toupper_dup = Module["_zend_str_toupper_dup"] = function() {
 return (_zend_str_toupper_dup = Module["_zend_str_toupper_dup"] = Module["asm"]["zend_str_toupper_dup"]).apply(null, arguments);
};

var _zend_str_toupper_dup_ex = Module["_zend_str_toupper_dup_ex"] = function() {
 return (_zend_str_toupper_dup_ex = Module["_zend_str_toupper_dup_ex"] = Module["asm"]["zend_str_toupper_dup_ex"]).apply(null, arguments);
};

var _zend_binary_zval_strncmp = Module["_zend_binary_zval_strncmp"] = function() {
 return (_zend_binary_zval_strncmp = Module["_zend_binary_zval_strncmp"] = Module["asm"]["zend_binary_zval_strncmp"]).apply(null, arguments);
};

var _zend_u64_to_str = Module["_zend_u64_to_str"] = function() {
 return (_zend_u64_to_str = Module["_zend_u64_to_str"] = Module["asm"]["zend_u64_to_str"]).apply(null, arguments);
};

var _zend_i64_to_str = Module["_zend_i64_to_str"] = function() {
 return (_zend_i64_to_str = Module["_zend_i64_to_str"] = Module["asm"]["zend_i64_to_str"]).apply(null, arguments);
};

var _zend_ptr_stack_init_ex = Module["_zend_ptr_stack_init_ex"] = function() {
 return (_zend_ptr_stack_init_ex = Module["_zend_ptr_stack_init_ex"] = Module["asm"]["zend_ptr_stack_init_ex"]).apply(null, arguments);
};

var _zend_ptr_stack_n_push = Module["_zend_ptr_stack_n_push"] = function() {
 return (_zend_ptr_stack_n_push = Module["_zend_ptr_stack_n_push"] = Module["asm"]["zend_ptr_stack_n_push"]).apply(null, arguments);
};

var _zend_ptr_stack_n_pop = Module["_zend_ptr_stack_n_pop"] = function() {
 return (_zend_ptr_stack_n_pop = Module["_zend_ptr_stack_n_pop"] = Module["asm"]["zend_ptr_stack_n_pop"]).apply(null, arguments);
};

var _zend_ptr_stack_apply = Module["_zend_ptr_stack_apply"] = function() {
 return (_zend_ptr_stack_apply = Module["_zend_ptr_stack_apply"] = Module["asm"]["zend_ptr_stack_apply"]).apply(null, arguments);
};

var _zend_ptr_stack_num_elements = Module["_zend_ptr_stack_num_elements"] = function() {
 return (_zend_ptr_stack_num_elements = Module["_zend_ptr_stack_num_elements"] = Module["asm"]["zend_ptr_stack_num_elements"]).apply(null, arguments);
};

var _zend_stack_int_top = Module["_zend_stack_int_top"] = function() {
 return (_zend_stack_int_top = Module["_zend_stack_int_top"] = Module["asm"]["zend_stack_int_top"]).apply(null, arguments);
};

var _zend_stack_apply = Module["_zend_stack_apply"] = function() {
 return (_zend_stack_apply = Module["_zend_stack_apply"] = Module["asm"]["zend_stack_apply"]).apply(null, arguments);
};

var _zend_list_free = Module["_zend_list_free"] = function() {
 return (_zend_list_free = Module["_zend_list_free"] = Module["asm"]["zend_list_free"]).apply(null, arguments);
};

var _zend_ast_ref_destroy = Module["_zend_ast_ref_destroy"] = function() {
 return (_zend_ast_ref_destroy = Module["_zend_ast_ref_destroy"] = Module["asm"]["zend_ast_ref_destroy"]).apply(null, arguments);
};

var _zend_spprintf_unchecked = Module["_zend_spprintf_unchecked"] = function() {
 return (_zend_spprintf_unchecked = Module["_zend_spprintf_unchecked"] = Module["asm"]["zend_spprintf_unchecked"]).apply(null, arguments);
};

var _zend_strpprintf_unchecked = Module["_zend_strpprintf_unchecked"] = function() {
 return (_zend_strpprintf_unchecked = Module["_zend_strpprintf_unchecked"] = Module["asm"]["zend_strpprintf_unchecked"]).apply(null, arguments);
};

var _zend_make_printable_zval = Module["_zend_make_printable_zval"] = function() {
 return (_zend_make_printable_zval = Module["_zend_make_printable_zval"] = Module["asm"]["zend_make_printable_zval"]).apply(null, arguments);
};

var _zend_print_zval = Module["_zend_print_zval"] = function() {
 return (_zend_print_zval = Module["_zend_print_zval"] = Module["asm"]["zend_print_zval"]).apply(null, arguments);
};

var _zend_print_flat_zval_r = Module["_zend_print_flat_zval_r"] = function() {
 return (_zend_print_flat_zval_r = Module["_zend_print_flat_zval_r"] = Module["asm"]["zend_print_flat_zval_r"]).apply(null, arguments);
};

var _virtual_cwd_startup = Module["_virtual_cwd_startup"] = function() {
 return (_virtual_cwd_startup = Module["_virtual_cwd_startup"] = Module["asm"]["virtual_cwd_startup"]).apply(null, arguments);
};

var _zend_startup_strtod = Module["_zend_startup_strtod"] = function() {
 return (_zend_startup_strtod = Module["_zend_startup_strtod"] = Module["asm"]["zend_startup_strtod"]).apply(null, arguments);
};

var _zend_gc_collect_cycles = Module["_zend_gc_collect_cycles"] = function() {
 return (_zend_gc_collect_cycles = Module["_zend_gc_collect_cycles"] = Module["asm"]["zend_gc_collect_cycles"]).apply(null, arguments);
};

var _zend_interned_strings_init = Module["_zend_interned_strings_init"] = function() {
 return (_zend_interned_strings_init = Module["_zend_interned_strings_init"] = Module["asm"]["zend_interned_strings_init"]).apply(null, arguments);
};

var _zend_ini_startup = Module["_zend_ini_startup"] = function() {
 return (_zend_ini_startup = Module["_zend_ini_startup"] = Module["asm"]["zend_ini_startup"]).apply(null, arguments);
};

var _zend_destroy_modules = Module["_zend_destroy_modules"] = function() {
 return (_zend_destroy_modules = Module["_zend_destroy_modules"] = Module["asm"]["zend_destroy_modules"]).apply(null, arguments);
};

var _virtual_cwd_shutdown = Module["_virtual_cwd_shutdown"] = function() {
 return (_virtual_cwd_shutdown = Module["_virtual_cwd_shutdown"] = Module["asm"]["virtual_cwd_shutdown"]).apply(null, arguments);
};

var _zend_shutdown_strtod = Module["_zend_shutdown_strtod"] = function() {
 return (_zend_shutdown_strtod = Module["_zend_shutdown_strtod"] = Module["asm"]["zend_shutdown_strtod"]).apply(null, arguments);
};

var _zend_output_debug_string = Module["_zend_output_debug_string"] = function() {
 return (_zend_output_debug_string = Module["_zend_output_debug_string"] = Module["asm"]["zend_output_debug_string"]).apply(null, arguments);
};

var _gc_protect = Module["_gc_protect"] = function() {
 return (_gc_protect = Module["_gc_protect"] = Module["asm"]["gc_protect"]).apply(null, arguments);
};

var _zend_get_page_size = Module["_zend_get_page_size"] = function() {
 return (_zend_get_page_size = Module["_zend_get_page_size"] = Module["asm"]["zend_get_page_size"]).apply(null, arguments);
};

var _zend_append_version_info = Module["_zend_append_version_info"] = function() {
 return (_zend_append_version_info = Module["_zend_append_version_info"] = Module["asm"]["zend_append_version_info"]).apply(null, arguments);
};

var _strncat = Module["_strncat"] = function() {
 return (_strncat = Module["_strncat"] = Module["asm"]["strncat"]).apply(null, arguments);
};

var _zend_init_internal_run_time_cache = Module["_zend_init_internal_run_time_cache"] = function() {
 return (_zend_init_internal_run_time_cache = Module["_zend_init_internal_run_time_cache"] = Module["asm"]["zend_init_internal_run_time_cache"]).apply(null, arguments);
};

var _zend_observer_activate = Module["_zend_observer_activate"] = function() {
 return (_zend_observer_activate = Module["_zend_observer_activate"] = Module["asm"]["zend_observer_activate"]).apply(null, arguments);
};

var _zend_ini_deactivate = Module["_zend_ini_deactivate"] = function() {
 return (_zend_ini_deactivate = Module["_zend_ini_deactivate"] = Module["asm"]["zend_ini_deactivate"]).apply(null, arguments);
};

var _zend_map_ptr_reset = Module["_zend_map_ptr_reset"] = function() {
 return (_zend_map_ptr_reset = Module["_zend_map_ptr_reset"] = Module["asm"]["zend_map_ptr_reset"]).apply(null, arguments);
};

var _zend_error_zstr_at = Module["_zend_error_zstr_at"] = function() {
 return (_zend_error_zstr_at = Module["_zend_error_zstr_at"] = Module["asm"]["zend_error_zstr_at"]).apply(null, arguments);
};

var _zend_error_at = Module["_zend_error_at"] = function() {
 return (_zend_error_at = Module["_zend_error_at"] = Module["asm"]["zend_error_at"]).apply(null, arguments);
};

var _zend_error_at_noreturn = Module["_zend_error_at_noreturn"] = function() {
 return (_zend_error_at_noreturn = Module["_zend_error_at_noreturn"] = Module["asm"]["zend_error_at_noreturn"]).apply(null, arguments);
};

var _zend_strerror_noreturn = Module["_zend_strerror_noreturn"] = function() {
 return (_zend_strerror_noreturn = Module["_zend_strerror_noreturn"] = Module["asm"]["zend_strerror_noreturn"]).apply(null, arguments);
};

var _strerror_r = Module["_strerror_r"] = function() {
 return (_strerror_r = Module["_strerror_r"] = Module["asm"]["strerror_r"]).apply(null, arguments);
};

var _zend_begin_record_errors = Module["_zend_begin_record_errors"] = function() {
 return (_zend_begin_record_errors = Module["_zend_begin_record_errors"] = Module["asm"]["zend_begin_record_errors"]).apply(null, arguments);
};

var _zend_emit_recorded_errors = Module["_zend_emit_recorded_errors"] = function() {
 return (_zend_emit_recorded_errors = Module["_zend_emit_recorded_errors"] = Module["asm"]["zend_emit_recorded_errors"]).apply(null, arguments);
};

var _zend_free_recorded_errors = Module["_zend_free_recorded_errors"] = function() {
 return (_zend_free_recorded_errors = Module["_zend_free_recorded_errors"] = Module["asm"]["zend_free_recorded_errors"]).apply(null, arguments);
};

var _zend_user_exception_handler = Module["_zend_user_exception_handler"] = function() {
 return (_zend_user_exception_handler = Module["_zend_user_exception_handler"] = Module["asm"]["zend_user_exception_handler"]).apply(null, arguments);
};

var _zend_is_unwind_exit = Module["_zend_is_unwind_exit"] = function() {
 return (_zend_is_unwind_exit = Module["_zend_is_unwind_exit"] = Module["asm"]["zend_is_unwind_exit"]).apply(null, arguments);
};

var _zend_map_ptr_extend = Module["_zend_map_ptr_extend"] = function() {
 return (_zend_map_ptr_extend = Module["_zend_map_ptr_extend"] = Module["asm"]["zend_map_ptr_extend"]).apply(null, arguments);
};

var _zend_ini_parse_quantity_warn = Module["_zend_ini_parse_quantity_warn"] = function() {
 return (_zend_ini_parse_quantity_warn = Module["_zend_ini_parse_quantity_warn"] = Module["asm"]["zend_ini_parse_quantity_warn"]).apply(null, arguments);
};

var _gc_enable = Module["_gc_enable"] = function() {
 return (_gc_enable = Module["_gc_enable"] = Module["asm"]["gc_enable"]).apply(null, arguments);
};

var _gc_enabled = Module["_gc_enabled"] = function() {
 return (_gc_enabled = Module["_gc_enabled"] = Module["asm"]["gc_enabled"]).apply(null, arguments);
};

var _zend_multibyte_set_script_encoding_by_string = Module["_zend_multibyte_set_script_encoding_by_string"] = function() {
 return (_zend_multibyte_set_script_encoding_by_string = Module["_zend_multibyte_set_script_encoding_by_string"] = Module["asm"]["zend_multibyte_set_script_encoding_by_string"]).apply(null, arguments);
};

var __zend_observer_error_notify = Module["__zend_observer_error_notify"] = function() {
 return (__zend_observer_error_notify = Module["__zend_observer_error_notify"] = Module["asm"]["_zend_observer_error_notify"]).apply(null, arguments);
};

var _zend_get_parameters_array_ex = Module["_zend_get_parameters_array_ex"] = function() {
 return (_zend_get_parameters_array_ex = Module["_zend_get_parameters_array_ex"] = Module["asm"]["zend_get_parameters_array_ex"]).apply(null, arguments);
};

var _zend_copy_parameters_array = Module["_zend_copy_parameters_array"] = function() {
 return (_zend_copy_parameters_array = Module["_zend_copy_parameters_array"] = Module["asm"]["zend_copy_parameters_array"]).apply(null, arguments);
};

var _zend_wrong_property_read = Module["_zend_wrong_property_read"] = function() {
 return (_zend_wrong_property_read = Module["_zend_wrong_property_read"] = Module["asm"]["zend_wrong_property_read"]).apply(null, arguments);
};

var _zend_wrong_callback_error = Module["_zend_wrong_callback_error"] = function() {
 return (_zend_wrong_callback_error = Module["_zend_wrong_callback_error"] = Module["asm"]["zend_wrong_callback_error"]).apply(null, arguments);
};

var _zend_wrong_callback_or_null_error = Module["_zend_wrong_callback_or_null_error"] = function() {
 return (_zend_wrong_callback_or_null_error = Module["_zend_wrong_callback_or_null_error"] = Module["asm"]["zend_wrong_callback_or_null_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_class_error = Module["_zend_wrong_parameter_class_error"] = function() {
 return (_zend_wrong_parameter_class_error = Module["_zend_wrong_parameter_class_error"] = Module["asm"]["zend_wrong_parameter_class_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_class_or_null_error = Module["_zend_wrong_parameter_class_or_null_error"] = function() {
 return (_zend_wrong_parameter_class_or_null_error = Module["_zend_wrong_parameter_class_or_null_error"] = Module["asm"]["zend_wrong_parameter_class_or_null_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_class_or_string_error = Module["_zend_wrong_parameter_class_or_string_error"] = function() {
 return (_zend_wrong_parameter_class_or_string_error = Module["_zend_wrong_parameter_class_or_string_error"] = Module["asm"]["zend_wrong_parameter_class_or_string_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_class_or_string_or_null_error = Module["_zend_wrong_parameter_class_or_string_or_null_error"] = function() {
 return (_zend_wrong_parameter_class_or_string_or_null_error = Module["_zend_wrong_parameter_class_or_string_or_null_error"] = Module["asm"]["zend_wrong_parameter_class_or_string_or_null_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_class_or_long_error = Module["_zend_wrong_parameter_class_or_long_error"] = function() {
 return (_zend_wrong_parameter_class_or_long_error = Module["_zend_wrong_parameter_class_or_long_error"] = Module["asm"]["zend_wrong_parameter_class_or_long_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_class_or_long_or_null_error = Module["_zend_wrong_parameter_class_or_long_or_null_error"] = function() {
 return (_zend_wrong_parameter_class_or_long_or_null_error = Module["_zend_wrong_parameter_class_or_long_or_null_error"] = Module["asm"]["zend_wrong_parameter_class_or_long_or_null_error"]).apply(null, arguments);
};

var _zend_wrong_parameter_type_error = Module["_zend_wrong_parameter_type_error"] = function() {
 return (_zend_wrong_parameter_type_error = Module["_zend_wrong_parameter_type_error"] = Module["asm"]["zend_wrong_parameter_type_error"]).apply(null, arguments);
};

var _zend_unexpected_extra_named_error = Module["_zend_unexpected_extra_named_error"] = function() {
 return (_zend_unexpected_extra_named_error = Module["_zend_unexpected_extra_named_error"] = Module["asm"]["zend_unexpected_extra_named_error"]).apply(null, arguments);
};

var _zend_argument_error_variadic = Module["_zend_argument_error_variadic"] = function() {
 return (_zend_argument_error_variadic = Module["_zend_argument_error_variadic"] = Module["asm"]["zend_argument_error_variadic"]).apply(null, arguments);
};

var _zend_parse_arg_bool_weak = Module["_zend_parse_arg_bool_weak"] = function() {
 return (_zend_parse_arg_bool_weak = Module["_zend_parse_arg_bool_weak"] = Module["asm"]["zend_parse_arg_bool_weak"]).apply(null, arguments);
};

var _zend_parse_arg_long_weak = Module["_zend_parse_arg_long_weak"] = function() {
 return (_zend_parse_arg_long_weak = Module["_zend_parse_arg_long_weak"] = Module["asm"]["zend_parse_arg_long_weak"]).apply(null, arguments);
};

var _zend_parse_arg_double_weak = Module["_zend_parse_arg_double_weak"] = function() {
 return (_zend_parse_arg_double_weak = Module["_zend_parse_arg_double_weak"] = Module["asm"]["zend_parse_arg_double_weak"]).apply(null, arguments);
};

var _zend_parse_arg_str_weak = Module["_zend_parse_arg_str_weak"] = function() {
 return (_zend_parse_arg_str_weak = Module["_zend_parse_arg_str_weak"] = Module["asm"]["zend_parse_arg_str_weak"]).apply(null, arguments);
};

var _zend_parse_parameter = Module["_zend_parse_parameter"] = function() {
 return (_zend_parse_parameter = Module["_zend_parse_parameter"] = Module["asm"]["zend_parse_parameter"]).apply(null, arguments);
};

var _zend_parse_method_parameters_ex = Module["_zend_parse_method_parameters_ex"] = function() {
 return (_zend_parse_method_parameters_ex = Module["_zend_parse_method_parameters_ex"] = Module["asm"]["zend_parse_method_parameters_ex"]).apply(null, arguments);
};

var _zend_merge_properties = Module["_zend_merge_properties"] = function() {
 return (_zend_merge_properties = Module["_zend_merge_properties"] = Module["asm"]["zend_merge_properties"]).apply(null, arguments);
};

var _zend_verify_class_constant_type = Module["_zend_verify_class_constant_type"] = function() {
 return (_zend_verify_class_constant_type = Module["_zend_verify_class_constant_type"] = Module["asm"]["zend_verify_class_constant_type"]).apply(null, arguments);
};

var _object_properties_init_ex = Module["_object_properties_init_ex"] = function() {
 return (_object_properties_init_ex = Module["_object_properties_init_ex"] = Module["asm"]["object_properties_init_ex"]).apply(null, arguments);
};

var _add_assoc_resource_ex = Module["_add_assoc_resource_ex"] = function() {
 return (_add_assoc_resource_ex = Module["_add_assoc_resource_ex"] = Module["asm"]["add_assoc_resource_ex"]).apply(null, arguments);
};

var _add_assoc_array_ex = Module["_add_assoc_array_ex"] = function() {
 return (_add_assoc_array_ex = Module["_add_assoc_array_ex"] = Module["asm"]["add_assoc_array_ex"]).apply(null, arguments);
};

var _add_assoc_object_ex = Module["_add_assoc_object_ex"] = function() {
 return (_add_assoc_object_ex = Module["_add_assoc_object_ex"] = Module["asm"]["add_assoc_object_ex"]).apply(null, arguments);
};

var _add_assoc_reference_ex = Module["_add_assoc_reference_ex"] = function() {
 return (_add_assoc_reference_ex = Module["_add_assoc_reference_ex"] = Module["asm"]["add_assoc_reference_ex"]).apply(null, arguments);
};

var _add_index_null = Module["_add_index_null"] = function() {
 return (_add_index_null = Module["_add_index_null"] = Module["asm"]["add_index_null"]).apply(null, arguments);
};

var _add_index_bool = Module["_add_index_bool"] = function() {
 return (_add_index_bool = Module["_add_index_bool"] = Module["asm"]["add_index_bool"]).apply(null, arguments);
};

var _add_index_resource = Module["_add_index_resource"] = function() {
 return (_add_index_resource = Module["_add_index_resource"] = Module["asm"]["add_index_resource"]).apply(null, arguments);
};

var _add_index_array = Module["_add_index_array"] = function() {
 return (_add_index_array = Module["_add_index_array"] = Module["asm"]["add_index_array"]).apply(null, arguments);
};

var _add_index_object = Module["_add_index_object"] = function() {
 return (_add_index_object = Module["_add_index_object"] = Module["asm"]["add_index_object"]).apply(null, arguments);
};

var _add_index_reference = Module["_add_index_reference"] = function() {
 return (_add_index_reference = Module["_add_index_reference"] = Module["asm"]["add_index_reference"]).apply(null, arguments);
};

var _add_next_index_bool = Module["_add_next_index_bool"] = function() {
 return (_add_next_index_bool = Module["_add_next_index_bool"] = Module["asm"]["add_next_index_bool"]).apply(null, arguments);
};

var _add_next_index_double = Module["_add_next_index_double"] = function() {
 return (_add_next_index_double = Module["_add_next_index_double"] = Module["asm"]["add_next_index_double"]).apply(null, arguments);
};

var _add_next_index_array = Module["_add_next_index_array"] = function() {
 return (_add_next_index_array = Module["_add_next_index_array"] = Module["asm"]["add_next_index_array"]).apply(null, arguments);
};

var _add_next_index_reference = Module["_add_next_index_reference"] = function() {
 return (_add_next_index_reference = Module["_add_next_index_reference"] = Module["asm"]["add_next_index_reference"]).apply(null, arguments);
};

var _add_property_bool_ex = Module["_add_property_bool_ex"] = function() {
 return (_add_property_bool_ex = Module["_add_property_bool_ex"] = Module["asm"]["add_property_bool_ex"]).apply(null, arguments);
};

var _add_property_double_ex = Module["_add_property_double_ex"] = function() {
 return (_add_property_double_ex = Module["_add_property_double_ex"] = Module["asm"]["add_property_double_ex"]).apply(null, arguments);
};

var _add_property_str_ex = Module["_add_property_str_ex"] = function() {
 return (_add_property_str_ex = Module["_add_property_str_ex"] = Module["asm"]["add_property_str_ex"]).apply(null, arguments);
};

var _add_property_array_ex = Module["_add_property_array_ex"] = function() {
 return (_add_property_array_ex = Module["_add_property_array_ex"] = Module["asm"]["add_property_array_ex"]).apply(null, arguments);
};

var _add_property_object_ex = Module["_add_property_object_ex"] = function() {
 return (_add_property_object_ex = Module["_add_property_object_ex"] = Module["asm"]["add_property_object_ex"]).apply(null, arguments);
};

var _add_property_reference_ex = Module["_add_property_reference_ex"] = function() {
 return (_add_property_reference_ex = Module["_add_property_reference_ex"] = Module["asm"]["add_property_reference_ex"]).apply(null, arguments);
};

var _zend_unregister_functions = Module["_zend_unregister_functions"] = function() {
 return (_zend_unregister_functions = Module["_zend_unregister_functions"] = Module["asm"]["zend_unregister_functions"]).apply(null, arguments);
};

var _zend_startup_module = Module["_zend_startup_module"] = function() {
 return (_zend_startup_module = Module["_zend_startup_module"] = Module["asm"]["zend_startup_module"]).apply(null, arguments);
};

var _zend_get_module_started = Module["_zend_get_module_started"] = function() {
 return (_zend_get_module_started = Module["_zend_get_module_started"] = Module["asm"]["zend_get_module_started"]).apply(null, arguments);
};

var _zend_do_implement_interface = Module["_zend_do_implement_interface"] = function() {
 return (_zend_do_implement_interface = Module["_zend_do_implement_interface"] = Module["asm"]["zend_do_implement_interface"]).apply(null, arguments);
};

var _zend_register_class_alias_ex = Module["_zend_register_class_alias_ex"] = function() {
 return (_zend_register_class_alias_ex = Module["_zend_register_class_alias_ex"] = Module["asm"]["zend_register_class_alias_ex"]).apply(null, arguments);
};

var _zend_set_hash_symbol = Module["_zend_set_hash_symbol"] = function() {
 return (_zend_set_hash_symbol = Module["_zend_set_hash_symbol"] = Module["asm"]["zend_set_hash_symbol"]).apply(null, arguments);
};

var _zend_get_callable_name = Module["_zend_get_callable_name"] = function() {
 return (_zend_get_callable_name = Module["_zend_get_callable_name"] = Module["asm"]["zend_get_callable_name"]).apply(null, arguments);
};

var _zend_is_callable_at_frame = Module["_zend_is_callable_at_frame"] = function() {
 return (_zend_is_callable_at_frame = Module["_zend_is_callable_at_frame"] = Module["asm"]["zend_is_callable_at_frame"]).apply(null, arguments);
};

var _zend_is_callable = Module["_zend_is_callable"] = function() {
 return (_zend_is_callable = Module["_zend_is_callable"] = Module["asm"]["zend_is_callable"]).apply(null, arguments);
};

var _zend_make_callable = Module["_zend_make_callable"] = function() {
 return (_zend_make_callable = Module["_zend_make_callable"] = Module["asm"]["zend_make_callable"]).apply(null, arguments);
};

var _zend_fcall_info_args_save = Module["_zend_fcall_info_args_save"] = function() {
 return (_zend_fcall_info_args_save = Module["_zend_fcall_info_args_save"] = Module["asm"]["zend_fcall_info_args_save"]).apply(null, arguments);
};

var _zend_fcall_info_args_restore = Module["_zend_fcall_info_args_restore"] = function() {
 return (_zend_fcall_info_args_restore = Module["_zend_fcall_info_args_restore"] = Module["asm"]["zend_fcall_info_args_restore"]).apply(null, arguments);
};

var _zend_fcall_info_argv = Module["_zend_fcall_info_argv"] = function() {
 return (_zend_fcall_info_argv = Module["_zend_fcall_info_argv"] = Module["asm"]["zend_fcall_info_argv"]).apply(null, arguments);
};

var _zend_fcall_info_argn = Module["_zend_fcall_info_argn"] = function() {
 return (_zend_fcall_info_argn = Module["_zend_fcall_info_argn"] = Module["asm"]["zend_fcall_info_argn"]).apply(null, arguments);
};

var _zend_fcall_info_call = Module["_zend_fcall_info_call"] = function() {
 return (_zend_fcall_info_call = Module["_zend_fcall_info_call"] = Module["asm"]["zend_fcall_info_call"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_ex = Module["_zend_try_assign_typed_ref_ex"] = function() {
 return (_zend_try_assign_typed_ref_ex = Module["_zend_try_assign_typed_ref_ex"] = Module["asm"]["zend_try_assign_typed_ref_ex"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_bool = Module["_zend_try_assign_typed_ref_bool"] = function() {
 return (_zend_try_assign_typed_ref_bool = Module["_zend_try_assign_typed_ref_bool"] = Module["asm"]["zend_try_assign_typed_ref_bool"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_res = Module["_zend_try_assign_typed_ref_res"] = function() {
 return (_zend_try_assign_typed_ref_res = Module["_zend_try_assign_typed_ref_res"] = Module["asm"]["zend_try_assign_typed_ref_res"]).apply(null, arguments);
};

var _zend_try_assign_typed_ref_zval = Module["_zend_try_assign_typed_ref_zval"] = function() {
 return (_zend_try_assign_typed_ref_zval = Module["_zend_try_assign_typed_ref_zval"] = Module["asm"]["zend_try_assign_typed_ref_zval"]).apply(null, arguments);
};

var _zend_declare_property_ex = Module["_zend_declare_property_ex"] = function() {
 return (_zend_declare_property_ex = Module["_zend_declare_property_ex"] = Module["asm"]["zend_declare_property_ex"]).apply(null, arguments);
};

var _zend_declare_property = Module["_zend_declare_property"] = function() {
 return (_zend_declare_property = Module["_zend_declare_property"] = Module["asm"]["zend_declare_property"]).apply(null, arguments);
};

var _zend_declare_property_null = Module["_zend_declare_property_null"] = function() {
 return (_zend_declare_property_null = Module["_zend_declare_property_null"] = Module["asm"]["zend_declare_property_null"]).apply(null, arguments);
};

var _zend_declare_property_bool = Module["_zend_declare_property_bool"] = function() {
 return (_zend_declare_property_bool = Module["_zend_declare_property_bool"] = Module["asm"]["zend_declare_property_bool"]).apply(null, arguments);
};

var _zend_declare_property_long = Module["_zend_declare_property_long"] = function() {
 return (_zend_declare_property_long = Module["_zend_declare_property_long"] = Module["asm"]["zend_declare_property_long"]).apply(null, arguments);
};

var _zend_declare_property_double = Module["_zend_declare_property_double"] = function() {
 return (_zend_declare_property_double = Module["_zend_declare_property_double"] = Module["asm"]["zend_declare_property_double"]).apply(null, arguments);
};

var _zend_declare_property_string = Module["_zend_declare_property_string"] = function() {
 return (_zend_declare_property_string = Module["_zend_declare_property_string"] = Module["asm"]["zend_declare_property_string"]).apply(null, arguments);
};

var _zend_declare_property_stringl = Module["_zend_declare_property_stringl"] = function() {
 return (_zend_declare_property_stringl = Module["_zend_declare_property_stringl"] = Module["asm"]["zend_declare_property_stringl"]).apply(null, arguments);
};

var _zend_declare_class_constant = Module["_zend_declare_class_constant"] = function() {
 return (_zend_declare_class_constant = Module["_zend_declare_class_constant"] = Module["asm"]["zend_declare_class_constant"]).apply(null, arguments);
};

var _zend_declare_class_constant_null = Module["_zend_declare_class_constant_null"] = function() {
 return (_zend_declare_class_constant_null = Module["_zend_declare_class_constant_null"] = Module["asm"]["zend_declare_class_constant_null"]).apply(null, arguments);
};

var _zend_declare_class_constant_long = Module["_zend_declare_class_constant_long"] = function() {
 return (_zend_declare_class_constant_long = Module["_zend_declare_class_constant_long"] = Module["asm"]["zend_declare_class_constant_long"]).apply(null, arguments);
};

var _zend_declare_class_constant_bool = Module["_zend_declare_class_constant_bool"] = function() {
 return (_zend_declare_class_constant_bool = Module["_zend_declare_class_constant_bool"] = Module["asm"]["zend_declare_class_constant_bool"]).apply(null, arguments);
};

var _zend_declare_class_constant_double = Module["_zend_declare_class_constant_double"] = function() {
 return (_zend_declare_class_constant_double = Module["_zend_declare_class_constant_double"] = Module["asm"]["zend_declare_class_constant_double"]).apply(null, arguments);
};

var _zend_declare_class_constant_stringl = Module["_zend_declare_class_constant_stringl"] = function() {
 return (_zend_declare_class_constant_stringl = Module["_zend_declare_class_constant_stringl"] = Module["asm"]["zend_declare_class_constant_stringl"]).apply(null, arguments);
};

var _zend_declare_class_constant_string = Module["_zend_declare_class_constant_string"] = function() {
 return (_zend_declare_class_constant_string = Module["_zend_declare_class_constant_string"] = Module["asm"]["zend_declare_class_constant_string"]).apply(null, arguments);
};

var _zend_update_property_null = Module["_zend_update_property_null"] = function() {
 return (_zend_update_property_null = Module["_zend_update_property_null"] = Module["asm"]["zend_update_property_null"]).apply(null, arguments);
};

var _zend_unset_property = Module["_zend_unset_property"] = function() {
 return (_zend_unset_property = Module["_zend_unset_property"] = Module["asm"]["zend_unset_property"]).apply(null, arguments);
};

var _zend_update_property_bool = Module["_zend_update_property_bool"] = function() {
 return (_zend_update_property_bool = Module["_zend_update_property_bool"] = Module["asm"]["zend_update_property_bool"]).apply(null, arguments);
};

var _zend_update_property_double = Module["_zend_update_property_double"] = function() {
 return (_zend_update_property_double = Module["_zend_update_property_double"] = Module["asm"]["zend_update_property_double"]).apply(null, arguments);
};

var _zend_update_property_stringl = Module["_zend_update_property_stringl"] = function() {
 return (_zend_update_property_stringl = Module["_zend_update_property_stringl"] = Module["asm"]["zend_update_property_stringl"]).apply(null, arguments);
};

var _zend_update_static_property = Module["_zend_update_static_property"] = function() {
 return (_zend_update_static_property = Module["_zend_update_static_property"] = Module["asm"]["zend_update_static_property"]).apply(null, arguments);
};

var _zend_update_static_property_null = Module["_zend_update_static_property_null"] = function() {
 return (_zend_update_static_property_null = Module["_zend_update_static_property_null"] = Module["asm"]["zend_update_static_property_null"]).apply(null, arguments);
};

var _zend_update_static_property_bool = Module["_zend_update_static_property_bool"] = function() {
 return (_zend_update_static_property_bool = Module["_zend_update_static_property_bool"] = Module["asm"]["zend_update_static_property_bool"]).apply(null, arguments);
};

var _zend_update_static_property_long = Module["_zend_update_static_property_long"] = function() {
 return (_zend_update_static_property_long = Module["_zend_update_static_property_long"] = Module["asm"]["zend_update_static_property_long"]).apply(null, arguments);
};

var _zend_update_static_property_double = Module["_zend_update_static_property_double"] = function() {
 return (_zend_update_static_property_double = Module["_zend_update_static_property_double"] = Module["asm"]["zend_update_static_property_double"]).apply(null, arguments);
};

var _zend_update_static_property_string = Module["_zend_update_static_property_string"] = function() {
 return (_zend_update_static_property_string = Module["_zend_update_static_property_string"] = Module["asm"]["zend_update_static_property_string"]).apply(null, arguments);
};

var _zend_update_static_property_stringl = Module["_zend_update_static_property_stringl"] = function() {
 return (_zend_update_static_property_stringl = Module["_zend_update_static_property_stringl"] = Module["asm"]["zend_update_static_property_stringl"]).apply(null, arguments);
};

var _zend_read_static_property = Module["_zend_read_static_property"] = function() {
 return (_zend_read_static_property = Module["_zend_read_static_property"] = Module["asm"]["zend_read_static_property"]).apply(null, arguments);
};

var _zend_save_error_handling = Module["_zend_save_error_handling"] = function() {
 return (_zend_save_error_handling = Module["_zend_save_error_handling"] = Module["asm"]["zend_save_error_handling"]).apply(null, arguments);
};

var _zend_do_inheritance_ex = Module["_zend_do_inheritance_ex"] = function() {
 return (_zend_do_inheritance_ex = Module["_zend_do_inheritance_ex"] = Module["asm"]["zend_do_inheritance_ex"]).apply(null, arguments);
};

var _zend_get_call_trampoline_func = Module["_zend_get_call_trampoline_func"] = function() {
 return (_zend_get_call_trampoline_func = Module["_zend_get_call_trampoline_func"] = Module["asm"]["zend_get_call_trampoline_func"]).apply(null, arguments);
};

var _zend_std_get_static_method = Module["_zend_std_get_static_method"] = function() {
 return (_zend_std_get_static_method = Module["_zend_std_get_static_method"] = Module["asm"]["zend_std_get_static_method"]).apply(null, arguments);
};

var _zend_assign_to_typed_ref = Module["_zend_assign_to_typed_ref"] = function() {
 return (_zend_assign_to_typed_ref = Module["_zend_assign_to_typed_ref"] = Module["asm"]["zend_assign_to_typed_ref"]).apply(null, arguments);
};

var _zend_register_extension = Module["_zend_register_extension"] = function() {
 return (_zend_register_extension = Module["_zend_register_extension"] = Module["asm"]["zend_register_extension"]).apply(null, arguments);
};

var _zend_extension_dispatch_message = Module["_zend_extension_dispatch_message"] = function() {
 return (_zend_extension_dispatch_message = Module["_zend_extension_dispatch_message"] = Module["asm"]["zend_extension_dispatch_message"]).apply(null, arguments);
};

var _zend_get_resource_handle = Module["_zend_get_resource_handle"] = function() {
 return (_zend_get_resource_handle = Module["_zend_get_resource_handle"] = Module["asm"]["zend_get_resource_handle"]).apply(null, arguments);
};

var _zend_add_system_entropy = Module["_zend_add_system_entropy"] = function() {
 return (_zend_add_system_entropy = Module["_zend_add_system_entropy"] = Module["asm"]["zend_add_system_entropy"]).apply(null, arguments);
};

var _zend_get_op_array_extension_handle = Module["_zend_get_op_array_extension_handle"] = function() {
 return (_zend_get_op_array_extension_handle = Module["_zend_get_op_array_extension_handle"] = Module["asm"]["zend_get_op_array_extension_handle"]).apply(null, arguments);
};

var _zend_get_op_array_extension_handles = Module["_zend_get_op_array_extension_handles"] = function() {
 return (_zend_get_op_array_extension_handles = Module["_zend_get_op_array_extension_handles"] = Module["asm"]["zend_get_op_array_extension_handles"]).apply(null, arguments);
};

var _zend_extensions_op_array_persist_calc = Module["_zend_extensions_op_array_persist_calc"] = function() {
 return (_zend_extensions_op_array_persist_calc = Module["_zend_extensions_op_array_persist_calc"] = Module["asm"]["zend_extensions_op_array_persist_calc"]).apply(null, arguments);
};

var _zend_extensions_op_array_persist = Module["_zend_extensions_op_array_persist"] = function() {
 return (_zend_extensions_op_array_persist = Module["_zend_extensions_op_array_persist"] = Module["asm"]["zend_extensions_op_array_persist"]).apply(null, arguments);
};

var _zend_hash_packed_to_hash = Module["_zend_hash_packed_to_hash"] = function() {
 return (_zend_hash_packed_to_hash = Module["_zend_hash_packed_to_hash"] = Module["asm"]["zend_hash_packed_to_hash"]).apply(null, arguments);
};

var _zend_hash_add_or_update = Module["_zend_hash_add_or_update"] = function() {
 return (_zend_hash_add_or_update = Module["_zend_hash_add_or_update"] = Module["asm"]["zend_hash_add_or_update"]).apply(null, arguments);
};

var _zend_hash_str_add_or_update = Module["_zend_hash_str_add_or_update"] = function() {
 return (_zend_hash_str_add_or_update = Module["_zend_hash_str_add_or_update"] = Module["asm"]["zend_hash_str_add_or_update"]).apply(null, arguments);
};

var _zend_hash_index_add_or_update = Module["_zend_hash_index_add_or_update"] = function() {
 return (_zend_hash_index_add_or_update = Module["_zend_hash_index_add_or_update"] = Module["asm"]["zend_hash_index_add_or_update"]).apply(null, arguments);
};

var _zend_hash_str_del_ind = Module["_zend_hash_str_del_ind"] = function() {
 return (_zend_hash_str_del_ind = Module["_zend_hash_str_del_ind"] = Module["asm"]["zend_hash_str_del_ind"]).apply(null, arguments);
};

var _gc_remove_from_buffer = Module["_gc_remove_from_buffer"] = function() {
 return (_gc_remove_from_buffer = Module["_gc_remove_from_buffer"] = Module["asm"]["gc_remove_from_buffer"]).apply(null, arguments);
};

var _zend_symtable_clean = Module["_zend_symtable_clean"] = function() {
 return (_zend_symtable_clean = Module["_zend_symtable_clean"] = Module["asm"]["zend_symtable_clean"]).apply(null, arguments);
};

var _zend_hash_graceful_destroy = Module["_zend_hash_graceful_destroy"] = function() {
 return (_zend_hash_graceful_destroy = Module["_zend_hash_graceful_destroy"] = Module["asm"]["zend_hash_graceful_destroy"]).apply(null, arguments);
};

var _zend_hash_apply_with_arguments = Module["_zend_hash_apply_with_arguments"] = function() {
 return (_zend_hash_apply_with_arguments = Module["_zend_hash_apply_with_arguments"] = Module["asm"]["zend_hash_apply_with_arguments"]).apply(null, arguments);
};

var _zend_hash_merge_ex = Module["_zend_hash_merge_ex"] = function() {
 return (_zend_hash_merge_ex = Module["_zend_hash_merge_ex"] = Module["asm"]["zend_hash_merge_ex"]).apply(null, arguments);
};

var __zend_hash_index_find = Module["__zend_hash_index_find"] = function() {
 return (__zend_hash_index_find = Module["__zend_hash_index_find"] = Module["asm"]["_zend_hash_index_find"]).apply(null, arguments);
};

var _zend_hash_bucket_renum_swap = Module["_zend_hash_bucket_renum_swap"] = function() {
 return (_zend_hash_bucket_renum_swap = Module["_zend_hash_bucket_renum_swap"] = Module["asm"]["zend_hash_bucket_renum_swap"]).apply(null, arguments);
};

var _zend_hash_bucket_packed_swap = Module["_zend_hash_bucket_packed_swap"] = function() {
 return (_zend_hash_bucket_packed_swap = Module["_zend_hash_bucket_packed_swap"] = Module["asm"]["zend_hash_bucket_packed_swap"]).apply(null, arguments);
};

var _zend_list_insert = Module["_zend_list_insert"] = function() {
 return (_zend_list_insert = Module["_zend_list_insert"] = Module["asm"]["zend_list_insert"]).apply(null, arguments);
};

var _zend_fetch_list_dtor_id = Module["_zend_fetch_list_dtor_id"] = function() {
 return (_zend_fetch_list_dtor_id = Module["_zend_fetch_list_dtor_id"] = Module["asm"]["zend_fetch_list_dtor_id"]).apply(null, arguments);
};

var _zend_register_persistent_resource_ex = Module["_zend_register_persistent_resource_ex"] = function() {
 return (_zend_register_persistent_resource_ex = Module["_zend_register_persistent_resource_ex"] = Module["asm"]["zend_register_persistent_resource_ex"]).apply(null, arguments);
};

var _zend_register_default_classes = Module["_zend_register_default_classes"] = function() {
 return (_zend_register_default_classes = Module["_zend_register_default_classes"] = Module["asm"]["zend_register_default_classes"]).apply(null, arguments);
};

var _zend_gc_get_status = Module["_zend_gc_get_status"] = function() {
 return (_zend_gc_get_status = Module["_zend_gc_get_status"] = Module["asm"]["zend_gc_get_status"]).apply(null, arguments);
};

var _zend_trace_to_string = Module["_zend_trace_to_string"] = function() {
 return (_zend_trace_to_string = Module["_zend_trace_to_string"] = Module["asm"]["zend_trace_to_string"]).apply(null, arguments);
};

var _zend_generator_check_placeholder_frame = Module["_zend_generator_check_placeholder_frame"] = function() {
 return (_zend_generator_check_placeholder_frame = Module["_zend_generator_check_placeholder_frame"] = Module["asm"]["zend_generator_check_placeholder_frame"]).apply(null, arguments);
};

var _zend_std_get_class_name = Module["_zend_std_get_class_name"] = function() {
 return (_zend_std_get_class_name = Module["_zend_std_get_class_name"] = Module["asm"]["zend_std_get_class_name"]).apply(null, arguments);
};

var _zend_get_parameter_attribute_str = Module["_zend_get_parameter_attribute_str"] = function() {
 return (_zend_get_parameter_attribute_str = Module["_zend_get_parameter_attribute_str"] = Module["asm"]["zend_get_parameter_attribute_str"]).apply(null, arguments);
};

var _zend_get_attribute = Module["_zend_get_attribute"] = function() {
 return (_zend_get_attribute = Module["_zend_get_attribute"] = Module["asm"]["zend_get_attribute"]).apply(null, arguments);
};

var _zend_get_parameter_attribute = Module["_zend_get_parameter_attribute"] = function() {
 return (_zend_get_parameter_attribute = Module["_zend_get_parameter_attribute"] = Module["asm"]["zend_get_parameter_attribute"]).apply(null, arguments);
};

var _zend_mark_internal_attribute = Module["_zend_mark_internal_attribute"] = function() {
 return (_zend_mark_internal_attribute = Module["_zend_mark_internal_attribute"] = Module["asm"]["zend_mark_internal_attribute"]).apply(null, arguments);
};

var _zend_internal_attribute_register = Module["_zend_internal_attribute_register"] = function() {
 return (_zend_internal_attribute_register = Module["_zend_internal_attribute_register"] = Module["asm"]["zend_internal_attribute_register"]).apply(null, arguments);
};

var _zend_vm_stack_init_ex = Module["_zend_vm_stack_init_ex"] = function() {
 return (_zend_vm_stack_init_ex = Module["_zend_vm_stack_init_ex"] = Module["asm"]["zend_vm_stack_init_ex"]).apply(null, arguments);
};

var _zend_get_compiled_variable_value = Module["_zend_get_compiled_variable_value"] = function() {
 return (_zend_get_compiled_variable_value = Module["_zend_get_compiled_variable_value"] = Module["asm"]["zend_get_compiled_variable_value"]).apply(null, arguments);
};

var _zend_gcc_global_regs = Module["_zend_gcc_global_regs"] = function() {
 return (_zend_gcc_global_regs = Module["_zend_gcc_global_regs"] = Module["asm"]["zend_gcc_global_regs"]).apply(null, arguments);
};

var _zend_cannot_pass_by_reference = Module["_zend_cannot_pass_by_reference"] = function() {
 return (_zend_cannot_pass_by_reference = Module["_zend_cannot_pass_by_reference"] = Module["asm"]["zend_cannot_pass_by_reference"]).apply(null, arguments);
};

var _zend_verify_arg_error = Module["_zend_verify_arg_error"] = function() {
 return (_zend_verify_arg_error = Module["_zend_verify_arg_error"] = Module["asm"]["zend_verify_arg_error"]).apply(null, arguments);
};

var _zend_verify_scalar_type_hint = Module["_zend_verify_scalar_type_hint"] = function() {
 return (_zend_verify_scalar_type_hint = Module["_zend_verify_scalar_type_hint"] = Module["asm"]["zend_verify_scalar_type_hint"]).apply(null, arguments);
};

var _zend_readonly_property_modification_error = Module["_zend_readonly_property_modification_error"] = function() {
 return (_zend_readonly_property_modification_error = Module["_zend_readonly_property_modification_error"] = Module["asm"]["zend_readonly_property_modification_error"]).apply(null, arguments);
};

var _zend_readonly_property_indirect_modification_error = Module["_zend_readonly_property_indirect_modification_error"] = function() {
 return (_zend_readonly_property_indirect_modification_error = Module["_zend_readonly_property_indirect_modification_error"] = Module["asm"]["zend_readonly_property_indirect_modification_error"]).apply(null, arguments);
};

var _zend_invalid_class_constant_type_error = Module["_zend_invalid_class_constant_type_error"] = function() {
 return (_zend_invalid_class_constant_type_error = Module["_zend_invalid_class_constant_type_error"] = Module["asm"]["zend_invalid_class_constant_type_error"]).apply(null, arguments);
};

var _zend_object_released_while_assigning_to_property_error = Module["_zend_object_released_while_assigning_to_property_error"] = function() {
 return (_zend_object_released_while_assigning_to_property_error = Module["_zend_object_released_while_assigning_to_property_error"] = Module["asm"]["zend_object_released_while_assigning_to_property_error"]).apply(null, arguments);
};

var _zend_check_user_type_slow = Module["_zend_check_user_type_slow"] = function() {
 return (_zend_check_user_type_slow = Module["_zend_check_user_type_slow"] = Module["asm"]["zend_check_user_type_slow"]).apply(null, arguments);
};

var _zend_missing_arg_error = Module["_zend_missing_arg_error"] = function() {
 return (_zend_missing_arg_error = Module["_zend_missing_arg_error"] = Module["asm"]["zend_missing_arg_error"]).apply(null, arguments);
};

var _zend_verify_return_error = Module["_zend_verify_return_error"] = function() {
 return (_zend_verify_return_error = Module["_zend_verify_return_error"] = Module["asm"]["zend_verify_return_error"]).apply(null, arguments);
};

var _zend_verify_never_error = Module["_zend_verify_never_error"] = function() {
 return (_zend_verify_never_error = Module["_zend_verify_never_error"] = Module["asm"]["zend_verify_never_error"]).apply(null, arguments);
};

var _zend_wrong_string_offset_error = Module["_zend_wrong_string_offset_error"] = function() {
 return (_zend_wrong_string_offset_error = Module["_zend_wrong_string_offset_error"] = Module["asm"]["zend_wrong_string_offset_error"]).apply(null, arguments);
};

var _zend_false_to_array_deprecated = Module["_zend_false_to_array_deprecated"] = function() {
 return (_zend_false_to_array_deprecated = Module["_zend_false_to_array_deprecated"] = Module["asm"]["zend_false_to_array_deprecated"]).apply(null, arguments);
};

var _zend_undefined_offset_write = Module["_zend_undefined_offset_write"] = function() {
 return (_zend_undefined_offset_write = Module["_zend_undefined_offset_write"] = Module["asm"]["zend_undefined_offset_write"]).apply(null, arguments);
};

var _zend_undefined_index_write = Module["_zend_undefined_index_write"] = function() {
 return (_zend_undefined_index_write = Module["_zend_undefined_index_write"] = Module["asm"]["zend_undefined_index_write"]).apply(null, arguments);
};

var _zend_fetch_dimension_const = Module["_zend_fetch_dimension_const"] = function() {
 return (_zend_fetch_dimension_const = Module["_zend_fetch_dimension_const"] = Module["asm"]["zend_fetch_dimension_const"]).apply(null, arguments);
};

var _zend_verify_ref_array_assignable = Module["_zend_verify_ref_array_assignable"] = function() {
 return (_zend_verify_ref_array_assignable = Module["_zend_verify_ref_array_assignable"] = Module["asm"]["zend_verify_ref_array_assignable"]).apply(null, arguments);
};

var _zend_throw_ref_type_error_type = Module["_zend_throw_ref_type_error_type"] = function() {
 return (_zend_throw_ref_type_error_type = Module["_zend_throw_ref_type_error_type"] = Module["asm"]["zend_throw_ref_type_error_type"]).apply(null, arguments);
};

var _zend_throw_ref_type_error_zval = Module["_zend_throw_ref_type_error_zval"] = function() {
 return (_zend_throw_ref_type_error_zval = Module["_zend_throw_ref_type_error_zval"] = Module["asm"]["zend_throw_ref_type_error_zval"]).apply(null, arguments);
};

var _zend_throw_conflicting_coercion_error = Module["_zend_throw_conflicting_coercion_error"] = function() {
 return (_zend_throw_conflicting_coercion_error = Module["_zend_throw_conflicting_coercion_error"] = Module["asm"]["zend_throw_conflicting_coercion_error"]).apply(null, arguments);
};

var _zend_assign_to_typed_ref_ex = Module["_zend_assign_to_typed_ref_ex"] = function() {
 return (_zend_assign_to_typed_ref_ex = Module["_zend_assign_to_typed_ref_ex"] = Module["asm"]["zend_assign_to_typed_ref_ex"]).apply(null, arguments);
};

var _zend_verify_prop_assignable_by_ref_ex = Module["_zend_verify_prop_assignable_by_ref_ex"] = function() {
 return (_zend_verify_prop_assignable_by_ref_ex = Module["_zend_verify_prop_assignable_by_ref_ex"] = Module["asm"]["zend_verify_prop_assignable_by_ref_ex"]).apply(null, arguments);
};

var _execute_internal = Module["_execute_internal"] = function() {
 return (_execute_internal = Module["_execute_internal"] = Module["asm"]["execute_internal"]).apply(null, arguments);
};

var _zend_clean_and_cache_symbol_table = Module["_zend_clean_and_cache_symbol_table"] = function() {
 return (_zend_clean_and_cache_symbol_table = Module["_zend_clean_and_cache_symbol_table"] = Module["asm"]["zend_clean_and_cache_symbol_table"]).apply(null, arguments);
};

var _zend_free_compiled_variables = Module["_zend_free_compiled_variables"] = function() {
 return (_zend_free_compiled_variables = Module["_zend_free_compiled_variables"] = Module["asm"]["zend_free_compiled_variables"]).apply(null, arguments);
};

var _zend_fetch_function_str = Module["_zend_fetch_function_str"] = function() {
 return (_zend_fetch_function_str = Module["_zend_fetch_function_str"] = Module["asm"]["zend_fetch_function_str"]).apply(null, arguments);
};

var _zend_init_func_run_time_cache = Module["_zend_init_func_run_time_cache"] = function() {
 return (_zend_init_func_run_time_cache = Module["_zend_init_func_run_time_cache"] = Module["asm"]["zend_init_func_run_time_cache"]).apply(null, arguments);
};

var _zend_init_code_execute_data = Module["_zend_init_code_execute_data"] = function() {
 return (_zend_init_code_execute_data = Module["_zend_init_code_execute_data"] = Module["asm"]["zend_init_code_execute_data"]).apply(null, arguments);
};

var _zend_init_execute_data = Module["_zend_init_execute_data"] = function() {
 return (_zend_init_execute_data = Module["_zend_init_execute_data"] = Module["asm"]["zend_init_execute_data"]).apply(null, arguments);
};

var _zend_unfinished_calls_gc = Module["_zend_unfinished_calls_gc"] = function() {
 return (_zend_unfinished_calls_gc = Module["_zend_unfinished_calls_gc"] = Module["asm"]["zend_unfinished_calls_gc"]).apply(null, arguments);
};

var _zend_cleanup_unfinished_execution = Module["_zend_cleanup_unfinished_execution"] = function() {
 return (_zend_cleanup_unfinished_execution = Module["_zend_cleanup_unfinished_execution"] = Module["asm"]["zend_cleanup_unfinished_execution"]).apply(null, arguments);
};

var _zend_unfinished_execution_gc = Module["_zend_unfinished_execution_gc"] = function() {
 return (_zend_unfinished_execution_gc = Module["_zend_unfinished_execution_gc"] = Module["asm"]["zend_unfinished_execution_gc"]).apply(null, arguments);
};

var _zend_unfinished_execution_gc_ex = Module["_zend_unfinished_execution_gc_ex"] = function() {
 return (_zend_unfinished_execution_gc_ex = Module["_zend_unfinished_execution_gc_ex"] = Module["asm"]["zend_unfinished_execution_gc_ex"]).apply(null, arguments);
};

var _zend_free_extra_named_params = Module["_zend_free_extra_named_params"] = function() {
 return (_zend_free_extra_named_params = Module["_zend_free_extra_named_params"] = Module["asm"]["zend_free_extra_named_params"]).apply(null, arguments);
};

var _zend_serialize_opcode_handler = Module["_zend_serialize_opcode_handler"] = function() {
 return (_zend_serialize_opcode_handler = Module["_zend_serialize_opcode_handler"] = Module["asm"]["zend_serialize_opcode_handler"]).apply(null, arguments);
};

var _zend_deserialize_opcode_handler = Module["_zend_deserialize_opcode_handler"] = function() {
 return (_zend_deserialize_opcode_handler = Module["_zend_deserialize_opcode_handler"] = Module["asm"]["zend_deserialize_opcode_handler"]).apply(null, arguments);
};

var _zend_get_opcode_handler_func = Module["_zend_get_opcode_handler_func"] = function() {
 return (_zend_get_opcode_handler_func = Module["_zend_get_opcode_handler_func"] = Module["asm"]["zend_get_opcode_handler_func"]).apply(null, arguments);
};

var _zend_get_halt_op = Module["_zend_get_halt_op"] = function() {
 return (_zend_get_halt_op = Module["_zend_get_halt_op"] = Module["asm"]["zend_get_halt_op"]).apply(null, arguments);
};

var _zend_vm_kind = Module["_zend_vm_kind"] = function() {
 return (_zend_vm_kind = Module["_zend_vm_kind"] = Module["asm"]["zend_vm_kind"]).apply(null, arguments);
};

var _zend_vm_set_opcode_handler_ex = Module["_zend_vm_set_opcode_handler_ex"] = function() {
 return (_zend_vm_set_opcode_handler_ex = Module["_zend_vm_set_opcode_handler_ex"] = Module["asm"]["zend_vm_set_opcode_handler_ex"]).apply(null, arguments);
};

var _zend_vm_call_opcode_handler = Module["_zend_vm_call_opcode_handler"] = function() {
 return (_zend_vm_call_opcode_handler = Module["_zend_vm_call_opcode_handler"] = Module["asm"]["zend_vm_call_opcode_handler"]).apply(null, arguments);
};

var _zend_set_user_opcode_handler = Module["_zend_set_user_opcode_handler"] = function() {
 return (_zend_set_user_opcode_handler = Module["_zend_set_user_opcode_handler"] = Module["asm"]["zend_set_user_opcode_handler"]).apply(null, arguments);
};

var _zend_get_user_opcode_handler = Module["_zend_get_user_opcode_handler"] = function() {
 return (_zend_get_user_opcode_handler = Module["_zend_get_user_opcode_handler"] = Module["asm"]["zend_get_user_opcode_handler"]).apply(null, arguments);
};

var _zend_get_zval_ptr = Module["_zend_get_zval_ptr"] = function() {
 return (_zend_get_zval_ptr = Module["_zend_get_zval_ptr"] = Module["asm"]["zend_get_zval_ptr"]).apply(null, arguments);
};

var _zend_iterator_unwrap = Module["_zend_iterator_unwrap"] = function() {
 return (_zend_iterator_unwrap = Module["_zend_iterator_unwrap"] = Module["asm"]["zend_iterator_unwrap"]).apply(null, arguments);
};

var _zend_fiber_switch_block = Module["_zend_fiber_switch_block"] = function() {
 return (_zend_fiber_switch_block = Module["_zend_fiber_switch_block"] = Module["asm"]["zend_fiber_switch_block"]).apply(null, arguments);
};

var _zend_fiber_switch_unblock = Module["_zend_fiber_switch_unblock"] = function() {
 return (_zend_fiber_switch_unblock = Module["_zend_fiber_switch_unblock"] = Module["asm"]["zend_fiber_switch_unblock"]).apply(null, arguments);
};

var _zend_create_closure = Module["_zend_create_closure"] = function() {
 return (_zend_create_closure = Module["_zend_create_closure"] = Module["asm"]["zend_create_closure"]).apply(null, arguments);
};

var _zend_is_graceful_exit = Module["_zend_is_graceful_exit"] = function() {
 return (_zend_is_graceful_exit = Module["_zend_is_graceful_exit"] = Module["asm"]["zend_is_graceful_exit"]).apply(null, arguments);
};

var _zend_exception_set_previous = Module["_zend_exception_set_previous"] = function() {
 return (_zend_exception_set_previous = Module["_zend_exception_set_previous"] = Module["asm"]["zend_exception_set_previous"]).apply(null, arguments);
};

var _zend_generator_close = Module["_zend_generator_close"] = function() {
 return (_zend_generator_close = Module["_zend_generator_close"] = Module["asm"]["zend_generator_close"]).apply(null, arguments);
};

var _zend_std_unset_static_property = Module["_zend_std_unset_static_property"] = function() {
 return (_zend_std_unset_static_property = Module["_zend_std_unset_static_property"] = Module["asm"]["zend_std_unset_static_property"]).apply(null, arguments);
};

var _zend_ini_dtor = Module["_zend_ini_dtor"] = function() {
 return (_zend_ini_dtor = Module["_zend_ini_dtor"] = Module["asm"]["zend_ini_dtor"]).apply(null, arguments);
};

var _zend_ini_global_shutdown = Module["_zend_ini_global_shutdown"] = function() {
 return (_zend_ini_global_shutdown = Module["_zend_ini_global_shutdown"] = Module["asm"]["zend_ini_global_shutdown"]).apply(null, arguments);
};

var _zend_register_ini_entries = Module["_zend_register_ini_entries"] = function() {
 return (_zend_register_ini_entries = Module["_zend_register_ini_entries"] = Module["asm"]["zend_register_ini_entries"]).apply(null, arguments);
};

var _zend_unregister_ini_entries = Module["_zend_unregister_ini_entries"] = function() {
 return (_zend_unregister_ini_entries = Module["_zend_unregister_ini_entries"] = Module["asm"]["zend_unregister_ini_entries"]).apply(null, arguments);
};

var _zend_ini_register_displayer = Module["_zend_ini_register_displayer"] = function() {
 return (_zend_ini_register_displayer = Module["_zend_ini_register_displayer"] = Module["asm"]["zend_ini_register_displayer"]).apply(null, arguments);
};

var _zend_ini_str_ex = Module["_zend_ini_str_ex"] = function() {
 return (_zend_ini_str_ex = Module["_zend_ini_str_ex"] = Module["asm"]["zend_ini_str_ex"]).apply(null, arguments);
};

var _zend_ini_parse_uquantity = Module["_zend_ini_parse_uquantity"] = function() {
 return (_zend_ini_parse_uquantity = Module["_zend_ini_parse_uquantity"] = Module["asm"]["zend_ini_parse_uquantity"]).apply(null, arguments);
};

var _display_link_numbers = Module["_display_link_numbers"] = function() {
 return (_display_link_numbers = Module["_display_link_numbers"] = Module["asm"]["display_link_numbers"]).apply(null, arguments);
};

var _OnUpdateStr = Module["_OnUpdateStr"] = function() {
 return (_OnUpdateStr = Module["_OnUpdateStr"] = Module["asm"]["OnUpdateStr"]).apply(null, arguments);
};

var _OnUpdateStrNotEmpty = Module["_OnUpdateStrNotEmpty"] = function() {
 return (_OnUpdateStrNotEmpty = Module["_OnUpdateStrNotEmpty"] = Module["asm"]["OnUpdateStrNotEmpty"]).apply(null, arguments);
};

var _zend_insert_sort = Module["_zend_insert_sort"] = function() {
 return (_zend_insert_sort = Module["_zend_insert_sort"] = Module["asm"]["zend_insert_sort"]).apply(null, arguments);
};

var _zend_multibyte_set_functions = Module["_zend_multibyte_set_functions"] = function() {
 return (_zend_multibyte_set_functions = Module["_zend_multibyte_set_functions"] = Module["asm"]["zend_multibyte_set_functions"]).apply(null, arguments);
};

var _zend_multibyte_restore_functions = Module["_zend_multibyte_restore_functions"] = function() {
 return (_zend_multibyte_restore_functions = Module["_zend_multibyte_restore_functions"] = Module["asm"]["zend_multibyte_restore_functions"]).apply(null, arguments);
};

var _zend_multibyte_parse_encoding_list = Module["_zend_multibyte_parse_encoding_list"] = function() {
 return (_zend_multibyte_parse_encoding_list = Module["_zend_multibyte_parse_encoding_list"] = Module["asm"]["zend_multibyte_parse_encoding_list"]).apply(null, arguments);
};

var _zend_multibyte_get_script_encoding = Module["_zend_multibyte_get_script_encoding"] = function() {
 return (_zend_multibyte_get_script_encoding = Module["_zend_multibyte_get_script_encoding"] = Module["asm"]["zend_multibyte_get_script_encoding"]).apply(null, arguments);
};

var _zend_multibyte_set_script_encoding = Module["_zend_multibyte_set_script_encoding"] = function() {
 return (_zend_multibyte_set_script_encoding = Module["_zend_multibyte_set_script_encoding"] = Module["asm"]["zend_multibyte_set_script_encoding"]).apply(null, arguments);
};

var _zend_multibyte_set_internal_encoding = Module["_zend_multibyte_set_internal_encoding"] = function() {
 return (_zend_multibyte_set_internal_encoding = Module["_zend_multibyte_set_internal_encoding"] = Module["asm"]["zend_multibyte_set_internal_encoding"]).apply(null, arguments);
};

var _zend_register_iterator_wrapper = Module["_zend_register_iterator_wrapper"] = function() {
 return (_zend_register_iterator_wrapper = Module["_zend_register_iterator_wrapper"] = Module["asm"]["zend_register_iterator_wrapper"]).apply(null, arguments);
};

var _zend_user_it_new_iterator = Module["_zend_user_it_new_iterator"] = function() {
 return (_zend_user_it_new_iterator = Module["_zend_user_it_new_iterator"] = Module["asm"]["zend_user_it_new_iterator"]).apply(null, arguments);
};

var _zend_user_it_valid = Module["_zend_user_it_valid"] = function() {
 return (_zend_user_it_valid = Module["_zend_user_it_valid"] = Module["asm"]["zend_user_it_valid"]).apply(null, arguments);
};

var _zend_user_it_get_current_data = Module["_zend_user_it_get_current_data"] = function() {
 return (_zend_user_it_get_current_data = Module["_zend_user_it_get_current_data"] = Module["asm"]["zend_user_it_get_current_data"]).apply(null, arguments);
};

var _zend_user_it_get_current_key = Module["_zend_user_it_get_current_key"] = function() {
 return (_zend_user_it_get_current_key = Module["_zend_user_it_get_current_key"] = Module["asm"]["zend_user_it_get_current_key"]).apply(null, arguments);
};

var _zend_user_it_move_forward = Module["_zend_user_it_move_forward"] = function() {
 return (_zend_user_it_move_forward = Module["_zend_user_it_move_forward"] = Module["asm"]["zend_user_it_move_forward"]).apply(null, arguments);
};

var _zend_user_it_rewind = Module["_zend_user_it_rewind"] = function() {
 return (_zend_user_it_rewind = Module["_zend_user_it_rewind"] = Module["asm"]["zend_user_it_rewind"]).apply(null, arguments);
};

var _zend_user_it_get_gc = Module["_zend_user_it_get_gc"] = function() {
 return (_zend_user_it_get_gc = Module["_zend_user_it_get_gc"] = Module["asm"]["zend_user_it_get_gc"]).apply(null, arguments);
};

var _zend_user_it_get_new_iterator = Module["_zend_user_it_get_new_iterator"] = function() {
 return (_zend_user_it_get_new_iterator = Module["_zend_user_it_get_new_iterator"] = Module["asm"]["zend_user_it_get_new_iterator"]).apply(null, arguments);
};

var _zend_user_serialize = Module["_zend_user_serialize"] = function() {
 return (_zend_user_serialize = Module["_zend_user_serialize"] = Module["asm"]["zend_user_serialize"]).apply(null, arguments);
};

var _zend_user_unserialize = Module["_zend_user_unserialize"] = function() {
 return (_zend_user_unserialize = Module["_zend_user_unserialize"] = Module["asm"]["zend_user_unserialize"]).apply(null, arguments);
};

var _zend_register_interfaces = Module["_zend_register_interfaces"] = function() {
 return (_zend_register_interfaces = Module["_zend_register_interfaces"] = Module["asm"]["zend_register_interfaces"]).apply(null, arguments);
};

var _zend_get_exception_base = Module["_zend_get_exception_base"] = function() {
 return (_zend_get_exception_base = Module["_zend_get_exception_base"] = Module["asm"]["zend_get_exception_base"]).apply(null, arguments);
};

var _zend_exception_get_default = Module["_zend_exception_get_default"] = function() {
 return (_zend_exception_get_default = Module["_zend_exception_get_default"] = Module["asm"]["zend_exception_get_default"]).apply(null, arguments);
};

var _zend_get_error_exception = Module["_zend_get_error_exception"] = function() {
 return (_zend_get_error_exception = Module["_zend_get_error_exception"] = Module["asm"]["zend_get_error_exception"]).apply(null, arguments);
};

var _zend_create_unwind_exit = Module["_zend_create_unwind_exit"] = function() {
 return (_zend_create_unwind_exit = Module["_zend_create_unwind_exit"] = Module["asm"]["zend_create_unwind_exit"]).apply(null, arguments);
};

var _zend_create_graceful_exit = Module["_zend_create_graceful_exit"] = function() {
 return (_zend_create_graceful_exit = Module["_zend_create_graceful_exit"] = Module["asm"]["zend_create_graceful_exit"]).apply(null, arguments);
};

var _zend_throw_graceful_exit = Module["_zend_throw_graceful_exit"] = function() {
 return (_zend_throw_graceful_exit = Module["_zend_throw_graceful_exit"] = Module["asm"]["zend_throw_graceful_exit"]).apply(null, arguments);
};

var _gc_protected = Module["_gc_protected"] = function() {
 return (_gc_protected = Module["_gc_protected"] = Module["asm"]["gc_protected"]).apply(null, arguments);
};

var _zend_weakrefs_hash_add = Module["_zend_weakrefs_hash_add"] = function() {
 return (_zend_weakrefs_hash_add = Module["_zend_weakrefs_hash_add"] = Module["asm"]["zend_weakrefs_hash_add"]).apply(null, arguments);
};

var _zend_weakrefs_hash_del = Module["_zend_weakrefs_hash_del"] = function() {
 return (_zend_weakrefs_hash_del = Module["_zend_weakrefs_hash_del"] = Module["asm"]["zend_weakrefs_hash_del"]).apply(null, arguments);
};

var _zend_weakrefs_notify = Module["_zend_weakrefs_notify"] = function() {
 return (_zend_weakrefs_notify = Module["_zend_weakrefs_notify"] = Module["asm"]["zend_weakrefs_notify"]).apply(null, arguments);
};

var _zend_ensure_fpu_mode = Module["_zend_ensure_fpu_mode"] = function() {
 return (_zend_ensure_fpu_mode = Module["_zend_ensure_fpu_mode"] = Module["asm"]["zend_ensure_fpu_mode"]).apply(null, arguments);
};

var _zend_interned_string_find_permanent = Module["_zend_interned_string_find_permanent"] = function() {
 return (_zend_interned_string_find_permanent = Module["_zend_interned_string_find_permanent"] = Module["asm"]["zend_interned_string_find_permanent"]).apply(null, arguments);
};

var _zend_interned_strings_set_request_storage_handlers = Module["_zend_interned_strings_set_request_storage_handlers"] = function() {
 return (_zend_interned_strings_set_request_storage_handlers = Module["_zend_interned_strings_set_request_storage_handlers"] = Module["asm"]["zend_interned_strings_set_request_storage_handlers"]).apply(null, arguments);
};

var _zend_signal_handler_unblock = Module["_zend_signal_handler_unblock"] = function() {
 return (_zend_signal_handler_unblock = Module["_zend_signal_handler_unblock"] = Module["asm"]["zend_signal_handler_unblock"]).apply(null, arguments);
};

var _sigprocmask = Module["_sigprocmask"] = function() {
 return (_sigprocmask = Module["_sigprocmask"] = Module["asm"]["sigprocmask"]).apply(null, arguments);
};

var _zend_sigaction = Module["_zend_sigaction"] = function() {
 return (_zend_sigaction = Module["_zend_sigaction"] = Module["asm"]["zend_sigaction"]).apply(null, arguments);
};

var _sigaction = Module["_sigaction"] = function() {
 return (_sigaction = Module["_sigaction"] = Module["asm"]["sigaction"]).apply(null, arguments);
};

var _sigemptyset = Module["_sigemptyset"] = function() {
 return (_sigemptyset = Module["_sigemptyset"] = Module["asm"]["sigemptyset"]).apply(null, arguments);
};

var _sigaddset = Module["_sigaddset"] = function() {
 return (_sigaddset = Module["_sigaddset"] = Module["asm"]["sigaddset"]).apply(null, arguments);
};

var _zend_signal_startup = Module["_zend_signal_startup"] = function() {
 return (_zend_signal_startup = Module["_zend_signal_startup"] = Module["asm"]["zend_signal_startup"]).apply(null, arguments);
};

var _sigfillset = Module["_sigfillset"] = function() {
 return (_sigfillset = Module["_sigfillset"] = Module["asm"]["sigfillset"]).apply(null, arguments);
};

var _sigdelset = Module["_sigdelset"] = function() {
 return (_sigdelset = Module["_sigdelset"] = Module["asm"]["sigdelset"]).apply(null, arguments);
};

var _zend_generator_restore_call_stack = Module["_zend_generator_restore_call_stack"] = function() {
 return (_zend_generator_restore_call_stack = Module["_zend_generator_restore_call_stack"] = Module["asm"]["zend_generator_restore_call_stack"]).apply(null, arguments);
};

var _zend_generator_freeze_call_stack = Module["_zend_generator_freeze_call_stack"] = function() {
 return (_zend_generator_freeze_call_stack = Module["_zend_generator_freeze_call_stack"] = Module["asm"]["zend_generator_freeze_call_stack"]).apply(null, arguments);
};

var _zend_generator_resume = Module["_zend_generator_resume"] = function() {
 return (_zend_generator_resume = Module["_zend_generator_resume"] = Module["asm"]["zend_generator_resume"]).apply(null, arguments);
};

var _zend_observer_generator_resume = Module["_zend_observer_generator_resume"] = function() {
 return (_zend_observer_generator_resume = Module["_zend_observer_generator_resume"] = Module["asm"]["zend_observer_generator_resume"]).apply(null, arguments);
};

var _virtual_getcwd_ex = Module["_virtual_getcwd_ex"] = function() {
 return (_virtual_getcwd_ex = Module["_virtual_getcwd_ex"] = Module["asm"]["virtual_getcwd_ex"]).apply(null, arguments);
};

var _virtual_getcwd = Module["_virtual_getcwd"] = function() {
 return (_virtual_getcwd = Module["_virtual_getcwd"] = Module["asm"]["virtual_getcwd"]).apply(null, arguments);
};

var _realpath_cache_lookup = Module["_realpath_cache_lookup"] = function() {
 return (_realpath_cache_lookup = Module["_realpath_cache_lookup"] = Module["asm"]["realpath_cache_lookup"]).apply(null, arguments);
};

var _virtual_chdir = Module["_virtual_chdir"] = function() {
 return (_virtual_chdir = Module["_virtual_chdir"] = Module["asm"]["virtual_chdir"]).apply(null, arguments);
};

var _virtual_realpath = Module["_virtual_realpath"] = function() {
 return (_virtual_realpath = Module["_virtual_realpath"] = Module["asm"]["virtual_realpath"]).apply(null, arguments);
};

var _virtual_filepath_ex = Module["_virtual_filepath_ex"] = function() {
 return (_virtual_filepath_ex = Module["_virtual_filepath_ex"] = Module["asm"]["virtual_filepath_ex"]).apply(null, arguments);
};

var _virtual_filepath = Module["_virtual_filepath"] = function() {
 return (_virtual_filepath = Module["_virtual_filepath"] = Module["asm"]["virtual_filepath"]).apply(null, arguments);
};

var _virtual_fopen = Module["_virtual_fopen"] = function() {
 return (_virtual_fopen = Module["_virtual_fopen"] = Module["asm"]["virtual_fopen"]).apply(null, arguments);
};

var _virtual_access = Module["_virtual_access"] = function() {
 return (_virtual_access = Module["_virtual_access"] = Module["asm"]["virtual_access"]).apply(null, arguments);
};

var _virtual_utime = Module["_virtual_utime"] = function() {
 return (_virtual_utime = Module["_virtual_utime"] = Module["asm"]["virtual_utime"]).apply(null, arguments);
};

var _virtual_chmod = Module["_virtual_chmod"] = function() {
 return (_virtual_chmod = Module["_virtual_chmod"] = Module["asm"]["virtual_chmod"]).apply(null, arguments);
};

var _virtual_chown = Module["_virtual_chown"] = function() {
 return (_virtual_chown = Module["_virtual_chown"] = Module["asm"]["virtual_chown"]).apply(null, arguments);
};

var _virtual_open = Module["_virtual_open"] = function() {
 return (_virtual_open = Module["_virtual_open"] = Module["asm"]["virtual_open"]).apply(null, arguments);
};

var _virtual_creat = Module["_virtual_creat"] = function() {
 return (_virtual_creat = Module["_virtual_creat"] = Module["asm"]["virtual_creat"]).apply(null, arguments);
};

var _creat = Module["_creat"] = function() {
 return (_creat = Module["_creat"] = Module["asm"]["creat"]).apply(null, arguments);
};

var _virtual_rename = Module["_virtual_rename"] = function() {
 return (_virtual_rename = Module["_virtual_rename"] = Module["asm"]["virtual_rename"]).apply(null, arguments);
};

var _virtual_stat = Module["_virtual_stat"] = function() {
 return (_virtual_stat = Module["_virtual_stat"] = Module["asm"]["virtual_stat"]).apply(null, arguments);
};

var _virtual_lstat = Module["_virtual_lstat"] = function() {
 return (_virtual_lstat = Module["_virtual_lstat"] = Module["asm"]["virtual_lstat"]).apply(null, arguments);
};

var _virtual_unlink = Module["_virtual_unlink"] = function() {
 return (_virtual_unlink = Module["_virtual_unlink"] = Module["asm"]["virtual_unlink"]).apply(null, arguments);
};

var _virtual_mkdir = Module["_virtual_mkdir"] = function() {
 return (_virtual_mkdir = Module["_virtual_mkdir"] = Module["asm"]["virtual_mkdir"]).apply(null, arguments);
};

var _virtual_rmdir = Module["_virtual_rmdir"] = function() {
 return (_virtual_rmdir = Module["_virtual_rmdir"] = Module["asm"]["virtual_rmdir"]).apply(null, arguments);
};

var _virtual_opendir = Module["_virtual_opendir"] = function() {
 return (_virtual_opendir = Module["_virtual_opendir"] = Module["asm"]["virtual_opendir"]).apply(null, arguments);
};

var _virtual_popen = Module["_virtual_popen"] = function() {
 return (_virtual_popen = Module["_virtual_popen"] = Module["asm"]["virtual_popen"]).apply(null, arguments);
};

var _zend_ast_evaluate_inner = Module["_zend_ast_evaluate_inner"] = function() {
 return (_zend_ast_evaluate_inner = Module["_zend_ast_evaluate_inner"] = Module["asm"]["zend_ast_evaluate_inner"]).apply(null, arguments);
};

var _zend_ast_evaluate = Module["_zend_ast_evaluate"] = function() {
 return (_zend_ast_evaluate = Module["_zend_ast_evaluate"] = Module["asm"]["zend_ast_evaluate"]).apply(null, arguments);
};

var _zend_objects_clone_obj = Module["_zend_objects_clone_obj"] = function() {
 return (_zend_objects_clone_obj = Module["_zend_objects_clone_obj"] = Module["asm"]["zend_objects_clone_obj"]).apply(null, arguments);
};

var _zend_objects_store_put = Module["_zend_objects_store_put"] = function() {
 return (_zend_objects_store_put = Module["_zend_objects_store_put"] = Module["asm"]["zend_objects_store_put"]).apply(null, arguments);
};

var _zend_std_get_gc = Module["_zend_std_get_gc"] = function() {
 return (_zend_std_get_gc = Module["_zend_std_get_gc"] = Module["asm"]["zend_std_get_gc"]).apply(null, arguments);
};

var _zend_std_get_debug_info = Module["_zend_std_get_debug_info"] = function() {
 return (_zend_std_get_debug_info = Module["_zend_std_get_debug_info"] = Module["asm"]["zend_std_get_debug_info"]).apply(null, arguments);
};

var _zend_get_property_guard = Module["_zend_get_property_guard"] = function() {
 return (_zend_get_property_guard = Module["_zend_get_property_guard"] = Module["asm"]["zend_get_property_guard"]).apply(null, arguments);
};

var _zend_std_get_constructor = Module["_zend_std_get_constructor"] = function() {
 return (_zend_std_get_constructor = Module["_zend_std_get_constructor"] = Module["asm"]["zend_std_get_constructor"]).apply(null, arguments);
};

var _zend_std_get_closure = Module["_zend_std_get_closure"] = function() {
 return (_zend_std_get_closure = Module["_zend_std_get_closure"] = Module["asm"]["zend_std_get_closure"]).apply(null, arguments);
};

var _smart_str_append_escaped_truncated = Module["_smart_str_append_escaped_truncated"] = function() {
 return (_smart_str_append_escaped_truncated = Module["_smart_str_append_escaped_truncated"] = Module["asm"]["smart_str_append_escaped_truncated"]).apply(null, arguments);
};

var _zend_cpu_supports = Module["_zend_cpu_supports"] = function() {
 return (_zend_cpu_supports = Module["_zend_cpu_supports"] = Module["asm"]["zend_cpu_supports"]).apply(null, arguments);
};

var ___jit_debug_register_code = Module["___jit_debug_register_code"] = function() {
 return (___jit_debug_register_code = Module["___jit_debug_register_code"] = Module["asm"]["__jit_debug_register_code"]).apply(null, arguments);
};

var _zend_gdb_register_code = Module["_zend_gdb_register_code"] = function() {
 return (_zend_gdb_register_code = Module["_zend_gdb_register_code"] = Module["asm"]["zend_gdb_register_code"]).apply(null, arguments);
};

var _zend_gdb_unregister_all = Module["_zend_gdb_unregister_all"] = function() {
 return (_zend_gdb_unregister_all = Module["_zend_gdb_unregister_all"] = Module["asm"]["zend_gdb_unregister_all"]).apply(null, arguments);
};

var _zend_gdb_present = Module["_zend_gdb_present"] = function() {
 return (_zend_gdb_present = Module["_zend_gdb_present"] = Module["asm"]["zend_gdb_present"]).apply(null, arguments);
};

var _zend_observer_fcall_register = Module["_zend_observer_fcall_register"] = function() {
 return (_zend_observer_fcall_register = Module["_zend_observer_fcall_register"] = Module["asm"]["zend_observer_fcall_register"]).apply(null, arguments);
};

var _zend_observer_add_begin_handler = Module["_zend_observer_add_begin_handler"] = function() {
 return (_zend_observer_add_begin_handler = Module["_zend_observer_add_begin_handler"] = Module["asm"]["zend_observer_add_begin_handler"]).apply(null, arguments);
};

var _zend_observer_remove_begin_handler = Module["_zend_observer_remove_begin_handler"] = function() {
 return (_zend_observer_remove_begin_handler = Module["_zend_observer_remove_begin_handler"] = Module["asm"]["zend_observer_remove_begin_handler"]).apply(null, arguments);
};

var _zend_observer_add_end_handler = Module["_zend_observer_add_end_handler"] = function() {
 return (_zend_observer_add_end_handler = Module["_zend_observer_add_end_handler"] = Module["asm"]["zend_observer_add_end_handler"]).apply(null, arguments);
};

var _zend_observer_remove_end_handler = Module["_zend_observer_remove_end_handler"] = function() {
 return (_zend_observer_remove_end_handler = Module["_zend_observer_remove_end_handler"] = Module["asm"]["zend_observer_remove_end_handler"]).apply(null, arguments);
};

var _zend_observer_function_declared_register = Module["_zend_observer_function_declared_register"] = function() {
 return (_zend_observer_function_declared_register = Module["_zend_observer_function_declared_register"] = Module["asm"]["zend_observer_function_declared_register"]).apply(null, arguments);
};

var _zend_observer_class_linked_register = Module["_zend_observer_class_linked_register"] = function() {
 return (_zend_observer_class_linked_register = Module["_zend_observer_class_linked_register"] = Module["asm"]["zend_observer_class_linked_register"]).apply(null, arguments);
};

var _zend_observer_error_register = Module["_zend_observer_error_register"] = function() {
 return (_zend_observer_error_register = Module["_zend_observer_error_register"] = Module["asm"]["zend_observer_error_register"]).apply(null, arguments);
};

var _zend_observer_fiber_init_register = Module["_zend_observer_fiber_init_register"] = function() {
 return (_zend_observer_fiber_init_register = Module["_zend_observer_fiber_init_register"] = Module["asm"]["zend_observer_fiber_init_register"]).apply(null, arguments);
};

var _zend_observer_fiber_switch_register = Module["_zend_observer_fiber_switch_register"] = function() {
 return (_zend_observer_fiber_switch_register = Module["_zend_observer_fiber_switch_register"] = Module["asm"]["zend_observer_fiber_switch_register"]).apply(null, arguments);
};

var _zend_observer_fiber_destroy_register = Module["_zend_observer_fiber_destroy_register"] = function() {
 return (_zend_observer_fiber_destroy_register = Module["_zend_observer_fiber_destroy_register"] = Module["asm"]["zend_observer_fiber_destroy_register"]).apply(null, arguments);
};

var _zend_observer_fiber_init_notify = Module["_zend_observer_fiber_init_notify"] = function() {
 return (_zend_observer_fiber_init_notify = Module["_zend_observer_fiber_init_notify"] = Module["asm"]["zend_observer_fiber_init_notify"]).apply(null, arguments);
};

var _zend_observer_fiber_switch_notify = Module["_zend_observer_fiber_switch_notify"] = function() {
 return (_zend_observer_fiber_switch_notify = Module["_zend_observer_fiber_switch_notify"] = Module["asm"]["zend_observer_fiber_switch_notify"]).apply(null, arguments);
};

var _zend_observer_fiber_destroy_notify = Module["_zend_observer_fiber_destroy_notify"] = function() {
 return (_zend_observer_fiber_destroy_notify = Module["_zend_observer_fiber_destroy_notify"] = Module["asm"]["zend_observer_fiber_destroy_notify"]).apply(null, arguments);
};

var _zend_enum_get_case_by_value = Module["_zend_enum_get_case_by_value"] = function() {
 return (_zend_enum_get_case_by_value = Module["_zend_enum_get_case_by_value"] = Module["asm"]["zend_enum_get_case_by_value"]).apply(null, arguments);
};

var _zend_enum_add_case = Module["_zend_enum_add_case"] = function() {
 return (_zend_enum_add_case = Module["_zend_enum_add_case"] = Module["asm"]["zend_enum_add_case"]).apply(null, arguments);
};

var _zend_enum_get_case = Module["_zend_enum_get_case"] = function() {
 return (_zend_enum_get_case = Module["_zend_enum_get_case"] = Module["asm"]["zend_enum_get_case"]).apply(null, arguments);
};

var _zend_enum_get_case_cstr = Module["_zend_enum_get_case_cstr"] = function() {
 return (_zend_enum_get_case_cstr = Module["_zend_enum_get_case_cstr"] = Module["asm"]["zend_enum_get_case_cstr"]).apply(null, arguments);
};

var _zend_fiber_stack_limit = Module["_zend_fiber_stack_limit"] = function() {
 return (_zend_fiber_stack_limit = Module["_zend_fiber_stack_limit"] = Module["asm"]["zend_fiber_stack_limit"]).apply(null, arguments);
};

var _zend_fiber_stack_base = Module["_zend_fiber_stack_base"] = function() {
 return (_zend_fiber_stack_base = Module["_zend_fiber_stack_base"] = Module["asm"]["zend_fiber_stack_base"]).apply(null, arguments);
};

var _zend_fiber_switch_blocked = Module["_zend_fiber_switch_blocked"] = function() {
 return (_zend_fiber_switch_blocked = Module["_zend_fiber_switch_blocked"] = Module["asm"]["zend_fiber_switch_blocked"]).apply(null, arguments);
};

var _zend_fiber_init_context = Module["_zend_fiber_init_context"] = function() {
 return (_zend_fiber_init_context = Module["_zend_fiber_init_context"] = Module["asm"]["zend_fiber_init_context"]).apply(null, arguments);
};

var _zend_fiber_destroy_context = Module["_zend_fiber_destroy_context"] = function() {
 return (_zend_fiber_destroy_context = Module["_zend_fiber_destroy_context"] = Module["asm"]["zend_fiber_destroy_context"]).apply(null, arguments);
};

var _zend_fiber_switch_context = Module["_zend_fiber_switch_context"] = function() {
 return (_zend_fiber_switch_context = Module["_zend_fiber_switch_context"] = Module["asm"]["zend_fiber_switch_context"]).apply(null, arguments);
};

var _mprotect = Module["_mprotect"] = function() {
 return (_mprotect = Module["_mprotect"] = Module["asm"]["mprotect"]).apply(null, arguments);
};

var _zend_atomic_bool_init = Module["_zend_atomic_bool_init"] = function() {
 return (_zend_atomic_bool_init = Module["_zend_atomic_bool_init"] = Module["asm"]["zend_atomic_bool_init"]).apply(null, arguments);
};

var _zend_atomic_bool_exchange = Module["_zend_atomic_bool_exchange"] = function() {
 return (_zend_atomic_bool_exchange = Module["_zend_atomic_bool_exchange"] = Module["asm"]["zend_atomic_bool_exchange"]).apply(null, arguments);
};

var _zend_atomic_bool_store = Module["_zend_atomic_bool_store"] = function() {
 return (_zend_atomic_bool_store = Module["_zend_atomic_bool_store"] = Module["asm"]["zend_atomic_bool_store"]).apply(null, arguments);
};

var _zend_atomic_bool_load = Module["_zend_atomic_bool_load"] = function() {
 return (_zend_atomic_bool_load = Module["_zend_atomic_bool_load"] = Module["asm"]["zend_atomic_bool_load"]).apply(null, arguments);
};

var _zend_optimize_script = Module["_zend_optimize_script"] = function() {
 return (_zend_optimize_script = Module["_zend_optimize_script"] = Module["asm"]["zend_optimize_script"]).apply(null, arguments);
};

var _zend_build_call_graph = Module["_zend_build_call_graph"] = function() {
 return (_zend_build_call_graph = Module["_zend_build_call_graph"] = Module["asm"]["zend_build_call_graph"]).apply(null, arguments);
};

var _zend_analyze_call_graph = Module["_zend_analyze_call_graph"] = function() {
 return (_zend_analyze_call_graph = Module["_zend_analyze_call_graph"] = Module["asm"]["zend_analyze_call_graph"]).apply(null, arguments);
};

var _zend_build_call_map = Module["_zend_build_call_map"] = function() {
 return (_zend_build_call_map = Module["_zend_build_call_map"] = Module["asm"]["zend_build_call_map"]).apply(null, arguments);
};

var _zend_init_func_return_info = Module["_zend_init_func_return_info"] = function() {
 return (_zend_init_func_return_info = Module["_zend_init_func_return_info"] = Module["asm"]["zend_init_func_return_info"]).apply(null, arguments);
};

var _zend_dump_op_array = Module["_zend_dump_op_array"] = function() {
 return (_zend_dump_op_array = Module["_zend_dump_op_array"] = Module["asm"]["zend_dump_op_array"]).apply(null, arguments);
};

var _zend_optimizer_register_pass = Module["_zend_optimizer_register_pass"] = function() {
 return (_zend_optimizer_register_pass = Module["_zend_optimizer_register_pass"] = Module["asm"]["zend_optimizer_register_pass"]).apply(null, arguments);
};

var _zend_optimizer_unregister_pass = Module["_zend_optimizer_unregister_pass"] = function() {
 return (_zend_optimizer_unregister_pass = Module["_zend_optimizer_unregister_pass"] = Module["asm"]["zend_optimizer_unregister_pass"]).apply(null, arguments);
};

var _zend_array_type_info = Module["_zend_array_type_info"] = function() {
 return (_zend_array_type_info = Module["_zend_array_type_info"] = Module["asm"]["zend_array_type_info"]).apply(null, arguments);
};

var _zend_build_cfg = Module["_zend_build_cfg"] = function() {
 return (_zend_build_cfg = Module["_zend_build_cfg"] = Module["asm"]["zend_build_cfg"]).apply(null, arguments);
};

var _zend_cfg_build_predecessors = Module["_zend_cfg_build_predecessors"] = function() {
 return (_zend_cfg_build_predecessors = Module["_zend_cfg_build_predecessors"] = Module["asm"]["zend_cfg_build_predecessors"]).apply(null, arguments);
};

var _zend_cfg_compute_dominators_tree = Module["_zend_cfg_compute_dominators_tree"] = function() {
 return (_zend_cfg_compute_dominators_tree = Module["_zend_cfg_compute_dominators_tree"] = Module["asm"]["zend_cfg_compute_dominators_tree"]).apply(null, arguments);
};

var _zend_cfg_identify_loops = Module["_zend_cfg_identify_loops"] = function() {
 return (_zend_cfg_identify_loops = Module["_zend_cfg_identify_loops"] = Module["asm"]["zend_cfg_identify_loops"]).apply(null, arguments);
};

var _zend_dfg_add_use_def_op = Module["_zend_dfg_add_use_def_op"] = function() {
 return (_zend_dfg_add_use_def_op = Module["_zend_dfg_add_use_def_op"] = Module["asm"]["zend_dfg_add_use_def_op"]).apply(null, arguments);
};

var _zend_build_ssa = Module["_zend_build_ssa"] = function() {
 return (_zend_build_ssa = Module["_zend_build_ssa"] = Module["asm"]["zend_build_ssa"]).apply(null, arguments);
};

var _zend_ssa_compute_use_def_chains = Module["_zend_ssa_compute_use_def_chains"] = function() {
 return (_zend_ssa_compute_use_def_chains = Module["_zend_ssa_compute_use_def_chains"] = Module["asm"]["zend_ssa_compute_use_def_chains"]).apply(null, arguments);
};

var _zend_ssa_find_false_dependencies = Module["_zend_ssa_find_false_dependencies"] = function() {
 return (_zend_ssa_find_false_dependencies = Module["_zend_ssa_find_false_dependencies"] = Module["asm"]["zend_ssa_find_false_dependencies"]).apply(null, arguments);
};

var _zend_ssa_find_sccs = Module["_zend_ssa_find_sccs"] = function() {
 return (_zend_ssa_find_sccs = Module["_zend_ssa_find_sccs"] = Module["asm"]["zend_ssa_find_sccs"]).apply(null, arguments);
};

var _zend_ssa_inference = Module["_zend_ssa_inference"] = function() {
 return (_zend_ssa_inference = Module["_zend_ssa_inference"] = Module["asm"]["zend_ssa_inference"]).apply(null, arguments);
};

var _zend_may_throw = Module["_zend_may_throw"] = function() {
 return (_zend_may_throw = Module["_zend_may_throw"] = Module["asm"]["zend_may_throw"]).apply(null, arguments);
};

var _zend_ssa_rename_op = Module["_zend_ssa_rename_op"] = function() {
 return (_zend_ssa_rename_op = Module["_zend_ssa_rename_op"] = Module["asm"]["zend_ssa_rename_op"]).apply(null, arguments);
};

var _zend_inference_propagate_range = Module["_zend_inference_propagate_range"] = function() {
 return (_zend_inference_propagate_range = Module["_zend_inference_propagate_range"] = Module["asm"]["zend_inference_propagate_range"]).apply(null, arguments);
};

var _zend_array_element_type = Module["_zend_array_element_type"] = function() {
 return (_zend_array_element_type = Module["_zend_array_element_type"] = Module["asm"]["zend_array_element_type"]).apply(null, arguments);
};

var _zend_fetch_arg_info_type = Module["_zend_fetch_arg_info_type"] = function() {
 return (_zend_fetch_arg_info_type = Module["_zend_fetch_arg_info_type"] = Module["asm"]["zend_fetch_arg_info_type"]).apply(null, arguments);
};

var _zend_update_type_info = Module["_zend_update_type_info"] = function() {
 return (_zend_update_type_info = Module["_zend_update_type_info"] = Module["asm"]["zend_update_type_info"]).apply(null, arguments);
};

var _zend_may_throw_ex = Module["_zend_may_throw_ex"] = function() {
 return (_zend_may_throw_ex = Module["_zend_may_throw_ex"] = Module["asm"]["zend_may_throw_ex"]).apply(null, arguments);
};

var _zend_get_func_info = Module["_zend_get_func_info"] = function() {
 return (_zend_get_func_info = Module["_zend_get_func_info"] = Module["asm"]["zend_get_func_info"]).apply(null, arguments);
};

var _zend_analyze_calls = Module["_zend_analyze_calls"] = function() {
 return (_zend_analyze_calls = Module["_zend_analyze_calls"] = Module["asm"]["zend_analyze_calls"]).apply(null, arguments);
};

var _zend_dump_var = Module["_zend_dump_var"] = function() {
 return (_zend_dump_var = Module["_zend_dump_var"] = Module["asm"]["zend_dump_var"]).apply(null, arguments);
};

var _zend_dump_ssa_var = Module["_zend_dump_ssa_var"] = function() {
 return (_zend_dump_ssa_var = Module["_zend_dump_ssa_var"] = Module["asm"]["zend_dump_ssa_var"]).apply(null, arguments);
};

var _zend_dump_op = Module["_zend_dump_op"] = function() {
 return (_zend_dump_op = Module["_zend_dump_op"] = Module["asm"]["zend_dump_op"]).apply(null, arguments);
};

var _zend_dump_op_line = Module["_zend_dump_op_line"] = function() {
 return (_zend_dump_op_line = Module["_zend_dump_op_line"] = Module["asm"]["zend_dump_op_line"]).apply(null, arguments);
};

var _signal = Module["_signal"] = function() {
 return (_signal = Module["_signal"] = Module["asm"]["signal"]).apply(null, arguments);
};

var __zip_add_entry = Module["__zip_add_entry"] = function() {
 return (__zip_add_entry = Module["__zip_add_entry"] = Module["asm"]["_zip_add_entry"]).apply(null, arguments);
};

var __zip_buffer_data = Module["__zip_buffer_data"] = function() {
 return (__zip_buffer_data = Module["__zip_buffer_data"] = Module["asm"]["_zip_buffer_data"]).apply(null, arguments);
};

var __zip_buffer_free = Module["__zip_buffer_free"] = function() {
 return (__zip_buffer_free = Module["__zip_buffer_free"] = Module["asm"]["_zip_buffer_free"]).apply(null, arguments);
};

var __zip_buffer_eof = Module["__zip_buffer_eof"] = function() {
 return (__zip_buffer_eof = Module["__zip_buffer_eof"] = Module["asm"]["_zip_buffer_eof"]).apply(null, arguments);
};

var __zip_buffer_get = Module["__zip_buffer_get"] = function() {
 return (__zip_buffer_get = Module["__zip_buffer_get"] = Module["asm"]["_zip_buffer_get"]).apply(null, arguments);
};

var __zip_buffer_peek = Module["__zip_buffer_peek"] = function() {
 return (__zip_buffer_peek = Module["__zip_buffer_peek"] = Module["asm"]["_zip_buffer_peek"]).apply(null, arguments);
};

var __zip_buffer_get_16 = Module["__zip_buffer_get_16"] = function() {
 return (__zip_buffer_get_16 = Module["__zip_buffer_get_16"] = Module["asm"]["_zip_buffer_get_16"]).apply(null, arguments);
};

var __zip_buffer_get_32 = Module["__zip_buffer_get_32"] = function() {
 return (__zip_buffer_get_32 = Module["__zip_buffer_get_32"] = Module["asm"]["_zip_buffer_get_32"]).apply(null, arguments);
};

var __zip_buffer_get_64 = Module["__zip_buffer_get_64"] = function() {
 return (__zip_buffer_get_64 = Module["__zip_buffer_get_64"] = Module["asm"]["_zip_buffer_get_64"]).apply(null, arguments);
};

var __zip_buffer_get_8 = Module["__zip_buffer_get_8"] = function() {
 return (__zip_buffer_get_8 = Module["__zip_buffer_get_8"] = Module["asm"]["_zip_buffer_get_8"]).apply(null, arguments);
};

var __zip_buffer_left = Module["__zip_buffer_left"] = function() {
 return (__zip_buffer_left = Module["__zip_buffer_left"] = Module["asm"]["_zip_buffer_left"]).apply(null, arguments);
};

var __zip_buffer_read = Module["__zip_buffer_read"] = function() {
 return (__zip_buffer_read = Module["__zip_buffer_read"] = Module["asm"]["_zip_buffer_read"]).apply(null, arguments);
};

var __zip_buffer_new = Module["__zip_buffer_new"] = function() {
 return (__zip_buffer_new = Module["__zip_buffer_new"] = Module["asm"]["_zip_buffer_new"]).apply(null, arguments);
};

var __zip_buffer_new_from_source = Module["__zip_buffer_new_from_source"] = function() {
 return (__zip_buffer_new_from_source = Module["__zip_buffer_new_from_source"] = Module["asm"]["_zip_buffer_new_from_source"]).apply(null, arguments);
};

var __zip_buffer_offset = Module["__zip_buffer_offset"] = function() {
 return (__zip_buffer_offset = Module["__zip_buffer_offset"] = Module["asm"]["_zip_buffer_offset"]).apply(null, arguments);
};

var __zip_buffer_ok = Module["__zip_buffer_ok"] = function() {
 return (__zip_buffer_ok = Module["__zip_buffer_ok"] = Module["asm"]["_zip_buffer_ok"]).apply(null, arguments);
};

var __zip_buffer_put = Module["__zip_buffer_put"] = function() {
 return (__zip_buffer_put = Module["__zip_buffer_put"] = Module["asm"]["_zip_buffer_put"]).apply(null, arguments);
};

var __zip_buffer_put_16 = Module["__zip_buffer_put_16"] = function() {
 return (__zip_buffer_put_16 = Module["__zip_buffer_put_16"] = Module["asm"]["_zip_buffer_put_16"]).apply(null, arguments);
};

var __zip_buffer_put_32 = Module["__zip_buffer_put_32"] = function() {
 return (__zip_buffer_put_32 = Module["__zip_buffer_put_32"] = Module["asm"]["_zip_buffer_put_32"]).apply(null, arguments);
};

var __zip_buffer_put_64 = Module["__zip_buffer_put_64"] = function() {
 return (__zip_buffer_put_64 = Module["__zip_buffer_put_64"] = Module["asm"]["_zip_buffer_put_64"]).apply(null, arguments);
};

var __zip_buffer_put_8 = Module["__zip_buffer_put_8"] = function() {
 return (__zip_buffer_put_8 = Module["__zip_buffer_put_8"] = Module["asm"]["_zip_buffer_put_8"]).apply(null, arguments);
};

var __zip_buffer_set_offset = Module["__zip_buffer_set_offset"] = function() {
 return (__zip_buffer_set_offset = Module["__zip_buffer_set_offset"] = Module["asm"]["_zip_buffer_set_offset"]).apply(null, arguments);
};

var __zip_buffer_skip = Module["__zip_buffer_skip"] = function() {
 return (__zip_buffer_skip = Module["__zip_buffer_skip"] = Module["asm"]["_zip_buffer_skip"]).apply(null, arguments);
};

var __zip_buffer_size = Module["__zip_buffer_size"] = function() {
 return (__zip_buffer_size = Module["__zip_buffer_size"] = Module["asm"]["_zip_buffer_size"]).apply(null, arguments);
};

var __zip_changed = Module["__zip_changed"] = function() {
 return (__zip_changed = Module["__zip_changed"] = Module["asm"]["_zip_changed"]).apply(null, arguments);
};

var _zip_source_remove = Module["_zip_source_remove"] = function() {
 return (_zip_source_remove = Module["_zip_source_remove"] = Module["asm"]["zip_source_remove"]).apply(null, arguments);
};

var _zip_source_error = Module["_zip_source_error"] = function() {
 return (_zip_source_error = Module["_zip_source_error"] = Module["asm"]["zip_source_error"]).apply(null, arguments);
};

var _zip_error_set_from_source = Module["_zip_error_set_from_source"] = function() {
 return (_zip_error_set_from_source = Module["_zip_error_set_from_source"] = Module["asm"]["zip_error_set_from_source"]).apply(null, arguments);
};

var _zip_source_supports = Module["_zip_source_supports"] = function() {
 return (_zip_source_supports = Module["_zip_source_supports"] = Module["asm"]["zip_source_supports"]).apply(null, arguments);
};

var __zip_file_get_end = Module["__zip_file_get_end"] = function() {
 return (__zip_file_get_end = Module["__zip_file_get_end"] = Module["asm"]["_zip_file_get_end"]).apply(null, arguments);
};

var _zip_source_begin_write_cloning = Module["_zip_source_begin_write_cloning"] = function() {
 return (_zip_source_begin_write_cloning = Module["_zip_source_begin_write_cloning"] = Module["asm"]["zip_source_begin_write_cloning"]).apply(null, arguments);
};

var _zip_source_begin_write = Module["_zip_source_begin_write"] = function() {
 return (_zip_source_begin_write = Module["_zip_source_begin_write"] = Module["asm"]["zip_source_begin_write"]).apply(null, arguments);
};

var __zip_progress_start = Module["__zip_progress_start"] = function() {
 return (__zip_progress_start = Module["__zip_progress_start"] = Module["asm"]["_zip_progress_start"]).apply(null, arguments);
};

var _zip_source_rollback_write = Module["_zip_source_rollback_write"] = function() {
 return (_zip_source_rollback_write = Module["_zip_source_rollback_write"] = Module["asm"]["zip_source_rollback_write"]).apply(null, arguments);
};

var __zip_progress_subrange = Module["__zip_progress_subrange"] = function() {
 return (__zip_progress_subrange = Module["__zip_progress_subrange"] = Module["asm"]["_zip_progress_subrange"]).apply(null, arguments);
};

var __zip_dirent_clone = Module["__zip_dirent_clone"] = function() {
 return (__zip_dirent_clone = Module["__zip_dirent_clone"] = Module["asm"]["_zip_dirent_clone"]).apply(null, arguments);
};

var __zip_read_local_ef = Module["__zip_read_local_ef"] = function() {
 return (__zip_read_local_ef = Module["__zip_read_local_ef"] = Module["asm"]["_zip_read_local_ef"]).apply(null, arguments);
};

var _zip_dirent_torrentzip_normalize = Module["_zip_dirent_torrentzip_normalize"] = function() {
 return (_zip_dirent_torrentzip_normalize = Module["_zip_dirent_torrentzip_normalize"] = Module["asm"]["zip_dirent_torrentzip_normalize"]).apply(null, arguments);
};

var _zip_source_tell_write = Module["_zip_source_tell_write"] = function() {
 return (_zip_source_tell_write = Module["_zip_source_tell_write"] = Module["asm"]["zip_source_tell_write"]).apply(null, arguments);
};

var _zip_source_zip_file_create = Module["_zip_source_zip_file_create"] = function() {
 return (_zip_source_zip_file_create = Module["_zip_source_zip_file_create"] = Module["asm"]["zip_source_zip_file_create"]).apply(null, arguments);
};

var __zip_dirent_write = Module["__zip_dirent_write"] = function() {
 return (__zip_dirent_write = Module["__zip_dirent_write"] = Module["asm"]["_zip_dirent_write"]).apply(null, arguments);
};

var __zip_file_get_offset = Module["__zip_file_get_offset"] = function() {
 return (__zip_file_get_offset = Module["__zip_file_get_offset"] = Module["asm"]["_zip_file_get_offset"]).apply(null, arguments);
};

var _zip_source_seek = Module["_zip_source_seek"] = function() {
 return (_zip_source_seek = Module["_zip_source_seek"] = Module["asm"]["zip_source_seek"]).apply(null, arguments);
};

var __zip_dirent_needs_zip64 = Module["__zip_dirent_needs_zip64"] = function() {
 return (__zip_dirent_needs_zip64 = Module["__zip_dirent_needs_zip64"] = Module["asm"]["_zip_dirent_needs_zip64"]).apply(null, arguments);
};

var _zip_source_commit_write = Module["_zip_source_commit_write"] = function() {
 return (_zip_source_commit_write = Module["_zip_source_commit_write"] = Module["asm"]["zip_source_commit_write"]).apply(null, arguments);
};

var __zip_progress_end = Module["__zip_progress_end"] = function() {
 return (__zip_progress_end = Module["__zip_progress_end"] = Module["asm"]["_zip_progress_end"]).apply(null, arguments);
};

var _zip_source_stat = Module["_zip_source_stat"] = function() {
 return (_zip_source_stat = Module["_zip_source_stat"] = Module["asm"]["zip_source_stat"]).apply(null, arguments);
};

var __zip_get_compression_algorithm = Module["__zip_get_compression_algorithm"] = function() {
 return (__zip_get_compression_algorithm = Module["__zip_get_compression_algorithm"] = Module["asm"]["_zip_get_compression_algorithm"]).apply(null, arguments);
};

var _zip_source_keep = Module["_zip_source_keep"] = function() {
 return (_zip_source_keep = Module["_zip_source_keep"] = Module["asm"]["zip_source_keep"]).apply(null, arguments);
};

var __zip_get_encryption_implementation = Module["__zip_get_encryption_implementation"] = function() {
 return (__zip_get_encryption_implementation = Module["__zip_get_encryption_implementation"] = Module["asm"]["_zip_get_encryption_implementation"]).apply(null, arguments);
};

var _zip_source_decompress = Module["_zip_source_decompress"] = function() {
 return (_zip_source_decompress = Module["_zip_source_decompress"] = Module["asm"]["zip_source_decompress"]).apply(null, arguments);
};

var _zip_source_crc_create = Module["_zip_source_crc_create"] = function() {
 return (_zip_source_crc_create = Module["_zip_source_crc_create"] = Module["asm"]["zip_source_crc_create"]).apply(null, arguments);
};

var _zip_source_compress = Module["_zip_source_compress"] = function() {
 return (_zip_source_compress = Module["_zip_source_compress"] = Module["asm"]["zip_source_compress"]).apply(null, arguments);
};

var _zip_stat_init = Module["_zip_stat_init"] = function() {
 return (_zip_stat_init = Module["_zip_stat_init"] = Module["asm"]["zip_stat_init"]).apply(null, arguments);
};

var __zip_source_window_new = Module["__zip_source_window_new"] = function() {
 return (__zip_source_window_new = Module["__zip_source_window_new"] = Module["asm"]["_zip_source_window_new"]).apply(null, arguments);
};

var _zip_source_get_file_attributes = Module["_zip_source_get_file_attributes"] = function() {
 return (_zip_source_get_file_attributes = Module["_zip_source_get_file_attributes"] = Module["asm"]["zip_source_get_file_attributes"]).apply(null, arguments);
};

var _zip_source_seek_write = Module["_zip_source_seek_write"] = function() {
 return (_zip_source_seek_write = Module["_zip_source_seek_write"] = Module["asm"]["zip_source_seek_write"]).apply(null, arguments);
};

var __zip_dirent_apply_attributes = Module["__zip_dirent_apply_attributes"] = function() {
 return (__zip_dirent_apply_attributes = Module["__zip_dirent_apply_attributes"] = Module["asm"]["_zip_dirent_apply_attributes"]).apply(null, arguments);
};

var _zip_source_open = Module["_zip_source_open"] = function() {
 return (_zip_source_open = Module["_zip_source_open"] = Module["asm"]["zip_source_open"]).apply(null, arguments);
};

var _zip_source_read = Module["_zip_source_read"] = function() {
 return (_zip_source_read = Module["_zip_source_read"] = Module["asm"]["zip_source_read"]).apply(null, arguments);
};

var __zip_write = Module["__zip_write"] = function() {
 return (__zip_write = Module["__zip_write"] = Module["asm"]["_zip_write"]).apply(null, arguments);
};

var __zip_progress_update = Module["__zip_progress_update"] = function() {
 return (__zip_progress_update = Module["__zip_progress_update"] = Module["asm"]["_zip_progress_update"]).apply(null, arguments);
};

var _zip_source_close = Module["_zip_source_close"] = function() {
 return (_zip_source_close = Module["_zip_source_close"] = Module["asm"]["zip_source_close"]).apply(null, arguments);
};

var __zip_read = Module["__zip_read"] = function() {
 return (__zip_read = Module["__zip_read"] = Module["asm"]["_zip_read"]).apply(null, arguments);
};

var __zip_cdir_write = Module["__zip_cdir_write"] = function() {
 return (__zip_cdir_write = Module["__zip_cdir_write"] = Module["asm"]["_zip_cdir_write"]).apply(null, arguments);
};

var __zip_get_name = Module["__zip_get_name"] = function() {
 return (__zip_get_name = Module["__zip_get_name"] = Module["asm"]["_zip_get_name"]).apply(null, arguments);
};

var __zip_hash_delete = Module["__zip_hash_delete"] = function() {
 return (__zip_hash_delete = Module["__zip_hash_delete"] = Module["asm"]["_zip_hash_delete"]).apply(null, arguments);
};

var __zip_unchange = Module["__zip_unchange"] = function() {
 return (__zip_unchange = Module["__zip_unchange"] = Module["asm"]["_zip_unchange"]).apply(null, arguments);
};

var __zip_file_replace = Module["__zip_file_replace"] = function() {
 return (__zip_file_replace = Module["__zip_file_replace"] = Module["asm"]["_zip_file_replace"]).apply(null, arguments);
};

var __zip_cdir_free = Module["__zip_cdir_free"] = function() {
 return (__zip_cdir_free = Module["__zip_cdir_free"] = Module["asm"]["_zip_cdir_free"]).apply(null, arguments);
};

var __zip_cdir_new = Module["__zip_cdir_new"] = function() {
 return (__zip_cdir_new = Module["__zip_cdir_new"] = Module["asm"]["_zip_cdir_new"]).apply(null, arguments);
};

var __zip_cdir_grow = Module["__zip_cdir_grow"] = function() {
 return (__zip_cdir_grow = Module["__zip_cdir_grow"] = Module["asm"]["_zip_cdir_grow"]).apply(null, arguments);
};

var __zip_entry_finalize = Module["__zip_entry_finalize"] = function() {
 return (__zip_entry_finalize = Module["__zip_entry_finalize"] = Module["asm"]["_zip_entry_finalize"]).apply(null, arguments);
};

var __zip_string_free = Module["__zip_string_free"] = function() {
 return (__zip_string_free = Module["__zip_string_free"] = Module["asm"]["_zip_string_free"]).apply(null, arguments);
};

var __zip_entry_init = Module["__zip_entry_init"] = function() {
 return (__zip_entry_init = Module["__zip_entry_init"] = Module["asm"]["_zip_entry_init"]).apply(null, arguments);
};

var __zip_dirent_init = Module["__zip_dirent_init"] = function() {
 return (__zip_dirent_init = Module["__zip_dirent_init"] = Module["asm"]["_zip_dirent_init"]).apply(null, arguments);
};

var __zip_dirent_finalize = Module["__zip_dirent_finalize"] = function() {
 return (__zip_dirent_finalize = Module["__zip_dirent_finalize"] = Module["asm"]["_zip_dirent_finalize"]).apply(null, arguments);
};

var __zip_ef_free = Module["__zip_ef_free"] = function() {
 return (__zip_ef_free = Module["__zip_ef_free"] = Module["asm"]["_zip_ef_free"]).apply(null, arguments);
};

var __zip_dirent_free = Module["__zip_dirent_free"] = function() {
 return (__zip_dirent_free = Module["__zip_dirent_free"] = Module["asm"]["_zip_dirent_free"]).apply(null, arguments);
};

var __zip_dirent_new = Module["__zip_dirent_new"] = function() {
 return (__zip_dirent_new = Module["__zip_dirent_new"] = Module["asm"]["_zip_dirent_new"]).apply(null, arguments);
};

var __zip_dirent_read = Module["__zip_dirent_read"] = function() {
 return (__zip_dirent_read = Module["__zip_dirent_read"] = Module["asm"]["_zip_dirent_read"]).apply(null, arguments);
};

var __zip_d2u_time = Module["__zip_d2u_time"] = function() {
 return (__zip_d2u_time = Module["__zip_d2u_time"] = Module["asm"]["_zip_d2u_time"]).apply(null, arguments);
};

var __zip_read_string = Module["__zip_read_string"] = function() {
 return (__zip_read_string = Module["__zip_read_string"] = Module["asm"]["_zip_read_string"]).apply(null, arguments);
};

var __zip_guess_encoding = Module["__zip_guess_encoding"] = function() {
 return (__zip_guess_encoding = Module["__zip_guess_encoding"] = Module["asm"]["_zip_guess_encoding"]).apply(null, arguments);
};

var __zip_read_data = Module["__zip_read_data"] = function() {
 return (__zip_read_data = Module["__zip_read_data"] = Module["asm"]["_zip_read_data"]).apply(null, arguments);
};

var __zip_ef_parse = Module["__zip_ef_parse"] = function() {
 return (__zip_ef_parse = Module["__zip_ef_parse"] = Module["asm"]["_zip_ef_parse"]).apply(null, arguments);
};

var __zip_ef_get_by_id = Module["__zip_ef_get_by_id"] = function() {
 return (__zip_ef_get_by_id = Module["__zip_ef_get_by_id"] = Module["asm"]["_zip_ef_get_by_id"]).apply(null, arguments);
};

var _zip_dirent_process_ef_zip64 = Module["_zip_dirent_process_ef_zip64"] = function() {
 return (_zip_dirent_process_ef_zip64 = Module["_zip_dirent_process_ef_zip64"] = Module["asm"]["zip_dirent_process_ef_zip64"]).apply(null, arguments);
};

var __zip_ef_remove_internal = Module["__zip_ef_remove_internal"] = function() {
 return (__zip_ef_remove_internal = Module["__zip_ef_remove_internal"] = Module["asm"]["_zip_ef_remove_internal"]).apply(null, arguments);
};

var __zip_dirent_size = Module["__zip_dirent_size"] = function() {
 return (__zip_dirent_size = Module["__zip_dirent_size"] = Module["asm"]["_zip_dirent_size"]).apply(null, arguments);
};

var __zip_ef_new = Module["__zip_ef_new"] = function() {
 return (__zip_ef_new = Module["__zip_ef_new"] = Module["asm"]["_zip_ef_new"]).apply(null, arguments);
};

var __zip_u2d_time = Module["__zip_u2d_time"] = function() {
 return (__zip_u2d_time = Module["__zip_u2d_time"] = Module["asm"]["_zip_u2d_time"]).apply(null, arguments);
};

var __zip_string_length = Module["__zip_string_length"] = function() {
 return (__zip_string_length = Module["__zip_string_length"] = Module["asm"]["_zip_string_length"]).apply(null, arguments);
};

var __zip_ef_size = Module["__zip_ef_size"] = function() {
 return (__zip_ef_size = Module["__zip_ef_size"] = Module["asm"]["_zip_ef_size"]).apply(null, arguments);
};

var __zip_string_write = Module["__zip_string_write"] = function() {
 return (__zip_string_write = Module["__zip_string_write"] = Module["asm"]["_zip_string_write"]).apply(null, arguments);
};

var __zip_ef_write = Module["__zip_ef_write"] = function() {
 return (__zip_ef_write = Module["__zip_ef_write"] = Module["asm"]["_zip_ef_write"]).apply(null, arguments);
};

var __zip_get_dirent = Module["__zip_get_dirent"] = function() {
 return (__zip_get_dirent = Module["__zip_get_dirent"] = Module["asm"]["_zip_get_dirent"]).apply(null, arguments);
};

var __zip_string_crc32 = Module["__zip_string_crc32"] = function() {
 return (__zip_string_crc32 = Module["__zip_string_crc32"] = Module["asm"]["_zip_string_crc32"]).apply(null, arguments);
};

var __zip_string_new = Module["__zip_string_new"] = function() {
 return (__zip_string_new = Module["__zip_string_new"] = Module["asm"]["_zip_string_new"]).apply(null, arguments);
};

var __zip_string_get = Module["__zip_string_get"] = function() {
 return (__zip_string_get = Module["__zip_string_get"] = Module["asm"]["_zip_string_get"]).apply(null, arguments);
};

var __zip_hash_free = Module["__zip_hash_free"] = function() {
 return (__zip_hash_free = Module["__zip_hash_free"] = Module["asm"]["_zip_hash_free"]).apply(null, arguments);
};

var __zip_source_invalidate = Module["__zip_source_invalidate"] = function() {
 return (__zip_source_invalidate = Module["__zip_source_invalidate"] = Module["asm"]["_zip_source_invalidate"]).apply(null, arguments);
};

var __zip_progress_free = Module["__zip_progress_free"] = function() {
 return (__zip_progress_free = Module["__zip_progress_free"] = Module["asm"]["_zip_progress_free"]).apply(null, arguments);
};

var __zip_unchange_data = Module["__zip_unchange_data"] = function() {
 return (__zip_unchange_data = Module["__zip_unchange_data"] = Module["asm"]["_zip_unchange_data"]).apply(null, arguments);
};

var _zip_error_init_with_code = Module["_zip_error_init_with_code"] = function() {
 return (_zip_error_init_with_code = Module["_zip_error_init_with_code"] = Module["asm"]["zip_error_init_with_code"]).apply(null, arguments);
};

var _zip_error_system_type = Module["_zip_error_system_type"] = function() {
 return (_zip_error_system_type = Module["_zip_error_system_type"] = Module["asm"]["zip_error_system_type"]).apply(null, arguments);
};

var __zip_error_clear = Module["__zip_error_clear"] = function() {
 return (__zip_error_clear = Module["__zip_error_clear"] = Module["asm"]["_zip_error_clear"]).apply(null, arguments);
};

var __zip_error_copy = Module["__zip_error_copy"] = function() {
 return (__zip_error_copy = Module["__zip_error_copy"] = Module["asm"]["_zip_error_copy"]).apply(null, arguments);
};

var __zip_error_get = Module["__zip_error_get"] = function() {
 return (__zip_error_get = Module["__zip_error_get"] = Module["asm"]["_zip_error_get"]).apply(null, arguments);
};

var _zip_error_to_data = Module["_zip_error_to_data"] = function() {
 return (_zip_error_to_data = Module["_zip_error_to_data"] = Module["asm"]["zip_error_to_data"]).apply(null, arguments);
};

var _zip_error_get = Module["_zip_error_get"] = function() {
 return (_zip_error_get = Module["_zip_error_get"] = Module["asm"]["zip_error_get"]).apply(null, arguments);
};

var __zip_ef_clone = Module["__zip_ef_clone"] = function() {
 return (__zip_ef_clone = Module["__zip_ef_clone"] = Module["asm"]["_zip_ef_clone"]).apply(null, arguments);
};

var __zip_ef_delete_by_id = Module["__zip_ef_delete_by_id"] = function() {
 return (__zip_ef_delete_by_id = Module["__zip_ef_delete_by_id"] = Module["asm"]["_zip_ef_delete_by_id"]).apply(null, arguments);
};

var __zip_ef_merge = Module["__zip_ef_merge"] = function() {
 return (__zip_ef_merge = Module["__zip_ef_merge"] = Module["asm"]["_zip_ef_merge"]).apply(null, arguments);
};

var __zip_memdup = Module["__zip_memdup"] = function() {
 return (__zip_memdup = Module["__zip_memdup"] = Module["asm"]["_zip_memdup"]).apply(null, arguments);
};

var __zip_set_name = Module["__zip_set_name"] = function() {
 return (__zip_set_name = Module["__zip_set_name"] = Module["asm"]["_zip_set_name"]).apply(null, arguments);
};

var __zip_name_locate = Module["__zip_name_locate"] = function() {
 return (__zip_name_locate = Module["__zip_name_locate"] = Module["asm"]["_zip_name_locate"]).apply(null, arguments);
};

var __zip_string_equal = Module["__zip_string_equal"] = function() {
 return (__zip_string_equal = Module["__zip_string_equal"] = Module["asm"]["_zip_string_equal"]).apply(null, arguments);
};

var _zip_fopen_index_encrypted = Module["_zip_fopen_index_encrypted"] = function() {
 return (_zip_fopen_index_encrypted = Module["_zip_fopen_index_encrypted"] = Module["asm"]["zip_fopen_index_encrypted"]).apply(null, arguments);
};

var _zip_source_is_seekable = Module["_zip_source_is_seekable"] = function() {
 return (_zip_source_is_seekable = Module["_zip_source_is_seekable"] = Module["asm"]["zip_source_is_seekable"]).apply(null, arguments);
};

var _zip_source_tell = Module["_zip_source_tell"] = function() {
 return (_zip_source_tell = Module["_zip_source_tell"] = Module["asm"]["zip_source_tell"]).apply(null, arguments);
};

var _zip_source_pkware_decode = Module["_zip_source_pkware_decode"] = function() {
 return (_zip_source_pkware_decode = Module["_zip_source_pkware_decode"] = Module["asm"]["zip_source_pkware_decode"]).apply(null, arguments);
};

var _zip_source_pkware_encode = Module["_zip_source_pkware_encode"] = function() {
 return (_zip_source_pkware_encode = Module["_zip_source_pkware_encode"] = Module["asm"]["zip_source_pkware_encode"]).apply(null, arguments);
};

var _zip_encryption_method_supported = Module["_zip_encryption_method_supported"] = function() {
 return (_zip_encryption_method_supported = Module["_zip_encryption_method_supported"] = Module["asm"]["zip_encryption_method_supported"]).apply(null, arguments);
};

var __zip_hash_new = Module["__zip_hash_new"] = function() {
 return (__zip_hash_new = Module["__zip_hash_new"] = Module["asm"]["_zip_hash_new"]).apply(null, arguments);
};

var __zip_hash_add = Module["__zip_hash_add"] = function() {
 return (__zip_hash_add = Module["__zip_hash_add"] = Module["asm"]["_zip_hash_add"]).apply(null, arguments);
};

var __zip_hash_lookup = Module["__zip_hash_lookup"] = function() {
 return (__zip_hash_lookup = Module["__zip_hash_lookup"] = Module["asm"]["_zip_hash_lookup"]).apply(null, arguments);
};

var __zip_hash_reserve_capacity = Module["__zip_hash_reserve_capacity"] = function() {
 return (__zip_hash_reserve_capacity = Module["__zip_hash_reserve_capacity"] = Module["asm"]["_zip_hash_reserve_capacity"]).apply(null, arguments);
};

var __zip_hash_revert = Module["__zip_hash_revert"] = function() {
 return (__zip_hash_revert = Module["__zip_hash_revert"] = Module["asm"]["_zip_hash_revert"]).apply(null, arguments);
};

var _calloc = Module["_calloc"] = function() {
 return (_calloc = Module["_calloc"] = Module["asm"]["calloc"]).apply(null, arguments);
};

var _zip_source_write = Module["_zip_source_write"] = function() {
 return (_zip_source_write = Module["_zip_source_write"] = Module["asm"]["zip_source_write"]).apply(null, arguments);
};

var __zip_new = Module["__zip_new"] = function() {
 return (__zip_new = Module["__zip_new"] = Module["asm"]["_zip_new"]).apply(null, arguments);
};

var _zip_source_file_create = Module["_zip_source_file_create"] = function() {
 return (_zip_source_file_create = Module["_zip_source_file_create"] = Module["asm"]["zip_source_file_create"]).apply(null, arguments);
};

var __zip_set_open_error = Module["__zip_set_open_error"] = function() {
 return (__zip_set_open_error = Module["__zip_set_open_error"] = Module["asm"]["_zip_set_open_error"]).apply(null, arguments);
};

var _zip_open_from_source = Module["_zip_open_from_source"] = function() {
 return (_zip_open_from_source = Module["_zip_open_from_source"] = Module["asm"]["zip_open_from_source"]).apply(null, arguments);
};

var __zip_open = Module["__zip_open"] = function() {
 return (__zip_open = Module["__zip_open"] = Module["asm"]["_zip_open"]).apply(null, arguments);
};

var _zip_source_accept_empty = Module["_zip_source_accept_empty"] = function() {
 return (_zip_source_accept_empty = Module["_zip_source_accept_empty"] = Module["asm"]["zip_source_accept_empty"]).apply(null, arguments);
};

var __zip_pkware_keys_reset = Module["__zip_pkware_keys_reset"] = function() {
 return (__zip_pkware_keys_reset = Module["__zip_pkware_keys_reset"] = Module["asm"]["_zip_pkware_keys_reset"]).apply(null, arguments);
};

var __zip_pkware_encrypt = Module["__zip_pkware_encrypt"] = function() {
 return (__zip_pkware_encrypt = Module["__zip_pkware_encrypt"] = Module["asm"]["_zip_pkware_encrypt"]).apply(null, arguments);
};

var __zip_pkware_decrypt = Module["__zip_pkware_decrypt"] = function() {
 return (__zip_pkware_decrypt = Module["__zip_pkware_decrypt"] = Module["asm"]["_zip_pkware_decrypt"]).apply(null, arguments);
};

var _zip_register_progress_callback_with_state = Module["_zip_register_progress_callback_with_state"] = function() {
 return (_zip_register_progress_callback_with_state = Module["_zip_register_progress_callback_with_state"] = Module["asm"]["zip_register_progress_callback_with_state"]).apply(null, arguments);
};

var _zip_register_cancel_callback_with_state = Module["_zip_register_cancel_callback_with_state"] = function() {
 return (_zip_register_cancel_callback_with_state = Module["_zip_register_cancel_callback_with_state"] = Module["asm"]["zip_register_cancel_callback_with_state"]).apply(null, arguments);
};

var _zip_register_progress_callback = Module["_zip_register_progress_callback"] = function() {
 return (_zip_register_progress_callback = Module["_zip_register_progress_callback"] = Module["asm"]["zip_register_progress_callback"]).apply(null, arguments);
};

var _zip_compression_method_supported = Module["_zip_compression_method_supported"] = function() {
 return (_zip_compression_method_supported = Module["_zip_compression_method_supported"] = Module["asm"]["zip_compression_method_supported"]).apply(null, arguments);
};

var __zip_source_call = Module["__zip_source_call"] = function() {
 return (__zip_source_call = Module["__zip_source_call"] = Module["asm"]["_zip_source_call"]).apply(null, arguments);
};

var _zip_source_buffer_with_attributes_create = Module["_zip_source_buffer_with_attributes_create"] = function() {
 return (_zip_source_buffer_with_attributes_create = Module["_zip_source_buffer_with_attributes_create"] = Module["asm"]["zip_source_buffer_with_attributes_create"]).apply(null, arguments);
};

var _zip_source_buffer_create = Module["_zip_source_buffer_create"] = function() {
 return (_zip_source_buffer_create = Module["_zip_source_buffer_create"] = Module["asm"]["zip_source_buffer_create"]).apply(null, arguments);
};

var _zip_source_buffer_fragment_with_attributes_create = Module["_zip_source_buffer_fragment_with_attributes_create"] = function() {
 return (_zip_source_buffer_fragment_with_attributes_create = Module["_zip_source_buffer_fragment_with_attributes_create"] = Module["asm"]["zip_source_buffer_fragment_with_attributes_create"]).apply(null, arguments);
};

var _zip_source_buffer_fragment = Module["_zip_source_buffer_fragment"] = function() {
 return (_zip_source_buffer_fragment = Module["_zip_source_buffer_fragment"] = Module["asm"]["zip_source_buffer_fragment"]).apply(null, arguments);
};

var _zip_source_buffer_fragment_create = Module["_zip_source_buffer_fragment_create"] = function() {
 return (_zip_source_buffer_fragment_create = Module["_zip_source_buffer_fragment_create"] = Module["asm"]["zip_source_buffer_fragment_create"]).apply(null, arguments);
};

var _zip_file_attributes_init = Module["_zip_file_attributes_init"] = function() {
 return (_zip_file_attributes_init = Module["_zip_file_attributes_init"] = Module["asm"]["zip_file_attributes_init"]).apply(null, arguments);
};

var _zip_source_function_create = Module["_zip_source_function_create"] = function() {
 return (_zip_source_function_create = Module["_zip_source_function_create"] = Module["asm"]["zip_source_function_create"]).apply(null, arguments);
};

var _zip_source_buffer_with_attributes = Module["_zip_source_buffer_with_attributes"] = function() {
 return (_zip_source_buffer_with_attributes = Module["_zip_source_buffer_with_attributes"] = Module["asm"]["zip_source_buffer_with_attributes"]).apply(null, arguments);
};

var _zip_source_make_command_bitmap = Module["_zip_source_make_command_bitmap"] = function() {
 return (_zip_source_make_command_bitmap = Module["_zip_source_make_command_bitmap"] = Module["asm"]["zip_source_make_command_bitmap"]).apply(null, arguments);
};

var _zip_source_seek_compute_offset = Module["_zip_source_seek_compute_offset"] = function() {
 return (_zip_source_seek_compute_offset = Module["_zip_source_seek_compute_offset"] = Module["asm"]["zip_source_seek_compute_offset"]).apply(null, arguments);
};

var _zip_source_layered = Module["_zip_source_layered"] = function() {
 return (_zip_source_layered = Module["_zip_source_layered"] = Module["asm"]["zip_source_layered"]).apply(null, arguments);
};

var _zip_source_pass_to_lower_layer = Module["_zip_source_pass_to_lower_layer"] = function() {
 return (_zip_source_pass_to_lower_layer = Module["_zip_source_pass_to_lower_layer"] = Module["asm"]["zip_source_pass_to_lower_layer"]).apply(null, arguments);
};

var _zip_source_layered_create = Module["_zip_source_layered_create"] = function() {
 return (_zip_source_layered_create = Module["_zip_source_layered_create"] = Module["asm"]["zip_source_layered_create"]).apply(null, arguments);
};

var __zip_source_had_error = Module["__zip_source_had_error"] = function() {
 return (__zip_source_had_error = Module["__zip_source_had_error"] = Module["asm"]["_zip_source_had_error"]).apply(null, arguments);
};

var _zip_source_file_common_new = Module["_zip_source_file_common_new"] = function() {
 return (_zip_source_file_common_new = Module["_zip_source_file_common_new"] = Module["asm"]["zip_source_file_common_new"]).apply(null, arguments);
};

var _zip_source_filep_create = Module["_zip_source_filep_create"] = function() {
 return (_zip_source_filep_create = Module["_zip_source_filep_create"] = Module["asm"]["zip_source_filep_create"]).apply(null, arguments);
};

var __zip_stdio_op_close = Module["__zip_stdio_op_close"] = function() {
 return (__zip_stdio_op_close = Module["__zip_stdio_op_close"] = Module["asm"]["_zip_stdio_op_close"]).apply(null, arguments);
};

var __zip_stdio_op_read = Module["__zip_stdio_op_read"] = function() {
 return (__zip_stdio_op_read = Module["__zip_stdio_op_read"] = Module["asm"]["_zip_stdio_op_read"]).apply(null, arguments);
};

var _ferror = Module["_ferror"] = function() {
 return (_ferror = Module["_ferror"] = Module["asm"]["ferror"]).apply(null, arguments);
};

var __zip_stdio_op_seek = Module["__zip_stdio_op_seek"] = function() {
 return (__zip_stdio_op_seek = Module["__zip_stdio_op_seek"] = Module["asm"]["_zip_stdio_op_seek"]).apply(null, arguments);
};

var _fseeko = Module["_fseeko"] = function() {
 return (_fseeko = Module["_fseeko"] = Module["asm"]["fseeko"]).apply(null, arguments);
};

var __zip_stdio_op_stat = Module["__zip_stdio_op_stat"] = function() {
 return (__zip_stdio_op_stat = Module["__zip_stdio_op_stat"] = Module["asm"]["_zip_stdio_op_stat"]).apply(null, arguments);
};

var __zip_stdio_op_tell = Module["__zip_stdio_op_tell"] = function() {
 return (__zip_stdio_op_tell = Module["__zip_stdio_op_tell"] = Module["asm"]["_zip_stdio_op_tell"]).apply(null, arguments);
};

var _ftello = Module["_ftello"] = function() {
 return (_ftello = Module["_ftello"] = Module["asm"]["ftello"]).apply(null, arguments);
};

var __zip_deregister_source = Module["__zip_deregister_source"] = function() {
 return (__zip_deregister_source = Module["__zip_deregister_source"] = Module["asm"]["_zip_deregister_source"]).apply(null, arguments);
};

var _zip_source_function = Module["_zip_source_function"] = function() {
 return (_zip_source_function = Module["_zip_source_function"] = Module["asm"]["zip_source_function"]).apply(null, arguments);
};

var __zip_source_new = Module["__zip_source_new"] = function() {
 return (__zip_source_new = Module["__zip_source_new"] = Module["asm"]["_zip_source_new"]).apply(null, arguments);
};

var _zip_secure_random = Module["_zip_secure_random"] = function() {
 return (_zip_secure_random = Module["_zip_secure_random"] = Module["asm"]["zip_secure_random"]).apply(null, arguments);
};

var __zip_source_eof = Module["__zip_source_eof"] = function() {
 return (__zip_source_eof = Module["__zip_source_eof"] = Module["asm"]["_zip_source_eof"]).apply(null, arguments);
};

var _zip_source_supports_reopen = Module["_zip_source_supports_reopen"] = function() {
 return (_zip_source_supports_reopen = Module["_zip_source_supports_reopen"] = Module["asm"]["zip_source_supports_reopen"]).apply(null, arguments);
};

var _zip_source_window_create = Module["_zip_source_window_create"] = function() {
 return (_zip_source_window_create = Module["_zip_source_window_create"] = Module["asm"]["zip_source_window_create"]).apply(null, arguments);
};

var __zip_stat_merge = Module["__zip_stat_merge"] = function() {
 return (__zip_stat_merge = Module["__zip_stat_merge"] = Module["asm"]["_zip_stat_merge"]).apply(null, arguments);
};

var __zip_source_set_source_archive = Module["__zip_source_set_source_archive"] = function() {
 return (__zip_source_set_source_archive = Module["__zip_source_set_source_archive"] = Module["asm"]["_zip_source_set_source_archive"]).apply(null, arguments);
};

var __zip_register_source = Module["__zip_register_source"] = function() {
 return (__zip_register_source = Module["__zip_register_source"] = Module["asm"]["_zip_register_source"]).apply(null, arguments);
};

var _zip_source_zip_file = Module["_zip_source_zip_file"] = function() {
 return (_zip_source_zip_file = Module["_zip_source_zip_file"] = Module["asm"]["zip_source_zip_file"]).apply(null, arguments);
};

var __zip_cp437_to_utf8 = Module["__zip_cp437_to_utf8"] = function() {
 return (__zip_cp437_to_utf8 = Module["__zip_cp437_to_utf8"] = Module["asm"]["_zip_cp437_to_utf8"]).apply(null, arguments);
};

var _remove = Module["_remove"] = function() {
 return (_remove = Module["_remove"] = Module["asm"]["remove"]).apply(null, arguments);
};

var _zip_random_uint32 = Module["_zip_random_uint32"] = function() {
 return (_zip_random_uint32 = Module["_zip_random_uint32"] = Module["asm"]["zip_random_uint32"]).apply(null, arguments);
};

var _fchmod = Module["_fchmod"] = function() {
 return (_fchmod = Module["_fchmod"] = Module["asm"]["fchmod"]).apply(null, arguments);
};

var _clearerr = Module["_clearerr"] = function() {
 return (_clearerr = Module["_clearerr"] = Module["asm"]["clearerr"]).apply(null, arguments);
};

var _srand = Module["_srand"] = function() {
 return (_srand = Module["_srand"] = Module["asm"]["srand"]).apply(null, arguments);
};

var _rand = Module["_rand"] = function() {
 return (_rand = Module["_rand"] = Module["asm"]["rand"]).apply(null, arguments);
};

var _waitid = Module["_waitid"] = function() {
 return (_waitid = Module["_waitid"] = Module["asm"]["waitid"]).apply(null, arguments);
};

var _times = Module["_times"] = function() {
 return (_times = Module["_times"] = Module["asm"]["times"]).apply(null, arguments);
};

var _getdate = Module["_getdate"] = function() {
 return (_getdate = Module["_getdate"] = Module["asm"]["getdate"]).apply(null, arguments);
};

var _stime = Module["_stime"] = function() {
 return (_stime = Module["_stime"] = Module["asm"]["stime"]).apply(null, arguments);
};

var _clock_getcpuclockid = Module["_clock_getcpuclockid"] = function() {
 return (_clock_getcpuclockid = Module["_clock_getcpuclockid"] = Module["asm"]["clock_getcpuclockid"]).apply(null, arguments);
};

var _getpwnam_r = Module["_getpwnam_r"] = function() {
 return (_getpwnam_r = Module["_getpwnam_r"] = Module["asm"]["getpwnam_r"]).apply(null, arguments);
};

var _getpwuid_r = Module["_getpwuid_r"] = function() {
 return (_getpwuid_r = Module["_getpwuid_r"] = Module["asm"]["getpwuid_r"]).apply(null, arguments);
};

var _setpwent = Module["_setpwent"] = function() {
 return (_setpwent = Module["_setpwent"] = Module["asm"]["setpwent"]).apply(null, arguments);
};

var _endpwent = Module["_endpwent"] = function() {
 return (_endpwent = Module["_endpwent"] = Module["asm"]["endpwent"]).apply(null, arguments);
};

var _getpwent = Module["_getpwent"] = function() {
 return (_getpwent = Module["_getpwent"] = Module["asm"]["getpwent"]).apply(null, arguments);
};

var _getgrgid = Module["_getgrgid"] = function() {
 return (_getgrgid = Module["_getgrgid"] = Module["asm"]["getgrgid"]).apply(null, arguments);
};

var _getgrnam_r = Module["_getgrnam_r"] = function() {
 return (_getgrnam_r = Module["_getgrnam_r"] = Module["asm"]["getgrnam_r"]).apply(null, arguments);
};

var _getgrgid_r = Module["_getgrgid_r"] = function() {
 return (_getgrgid_r = Module["_getgrgid_r"] = Module["asm"]["getgrgid_r"]).apply(null, arguments);
};

var _getgrent = Module["_getgrent"] = function() {
 return (_getgrent = Module["_getgrent"] = Module["asm"]["getgrent"]).apply(null, arguments);
};

var _endgrent = Module["_endgrent"] = function() {
 return (_endgrent = Module["_endgrent"] = Module["asm"]["endgrent"]).apply(null, arguments);
};

var _setgrent = Module["_setgrent"] = function() {
 return (_setgrent = Module["_setgrent"] = Module["asm"]["setgrent"]).apply(null, arguments);
};

var _execve = Module["_execve"] = function() {
 return (_execve = Module["_execve"] = Module["asm"]["execve"]).apply(null, arguments);
};

var _fork = Module["_fork"] = function() {
 return (_fork = Module["_fork"] = Module["asm"]["fork"]).apply(null, arguments);
};

var _vfork = Module["_vfork"] = function() {
 return (_vfork = Module["_vfork"] = Module["asm"]["vfork"]).apply(null, arguments);
};

var _setgroups = Module["_setgroups"] = function() {
 return (_setgroups = Module["_setgroups"] = Module["asm"]["setgroups"]).apply(null, arguments);
};

var _sigaltstack = Module["_sigaltstack"] = function() {
 return (_sigaltstack = Module["_sigaltstack"] = Module["asm"]["sigaltstack"]).apply(null, arguments);
};

var ___dlsym = Module["___dlsym"] = function() {
 return (___dlsym = Module["___dlsym"] = Module["asm"]["__dlsym"]).apply(null, arguments);
};

var ___syscall_uname = Module["___syscall_uname"] = function() {
 return (___syscall_uname = Module["___syscall_uname"] = Module["asm"]["__syscall_uname"]).apply(null, arguments);
};

var ___syscall_setpgid = Module["___syscall_setpgid"] = function() {
 return (___syscall_setpgid = Module["___syscall_setpgid"] = Module["asm"]["__syscall_setpgid"]).apply(null, arguments);
};

var ___syscall_sync = Module["___syscall_sync"] = function() {
 return (___syscall_sync = Module["___syscall_sync"] = Module["asm"]["__syscall_sync"]).apply(null, arguments);
};

var ___syscall_getsid = Module["___syscall_getsid"] = function() {
 return (___syscall_getsid = Module["___syscall_getsid"] = Module["asm"]["__syscall_getsid"]).apply(null, arguments);
};

var ___syscall_getpgid = Module["___syscall_getpgid"] = function() {
 return (___syscall_getpgid = Module["___syscall_getpgid"] = Module["asm"]["__syscall_getpgid"]).apply(null, arguments);
};

var ___syscall_getpid = Module["___syscall_getpid"] = function() {
 return (___syscall_getpid = Module["___syscall_getpid"] = Module["asm"]["__syscall_getpid"]).apply(null, arguments);
};

var ___syscall_getppid = Module["___syscall_getppid"] = function() {
 return (___syscall_getppid = Module["___syscall_getppid"] = Module["asm"]["__syscall_getppid"]).apply(null, arguments);
};

var ___syscall_linkat = Module["___syscall_linkat"] = function() {
 return (___syscall_linkat = Module["___syscall_linkat"] = Module["asm"]["__syscall_linkat"]).apply(null, arguments);
};

var ___syscall_getgroups32 = Module["___syscall_getgroups32"] = function() {
 return (___syscall_getgroups32 = Module["___syscall_getgroups32"] = Module["asm"]["__syscall_getgroups32"]).apply(null, arguments);
};

var ___syscall_setsid = Module["___syscall_setsid"] = function() {
 return (___syscall_setsid = Module["___syscall_setsid"] = Module["asm"]["__syscall_setsid"]).apply(null, arguments);
};

var ___syscall_umask = Module["___syscall_umask"] = function() {
 return (___syscall_umask = Module["___syscall_umask"] = Module["asm"]["__syscall_umask"]).apply(null, arguments);
};

var ___syscall_setrlimit = Module["___syscall_setrlimit"] = function() {
 return (___syscall_setrlimit = Module["___syscall_setrlimit"] = Module["asm"]["__syscall_setrlimit"]).apply(null, arguments);
};

var ___syscall_getrusage = Module["___syscall_getrusage"] = function() {
 return (___syscall_getrusage = Module["___syscall_getrusage"] = Module["asm"]["__syscall_getrusage"]).apply(null, arguments);
};

var ___syscall_getpriority = Module["___syscall_getpriority"] = function() {
 return (___syscall_getpriority = Module["___syscall_getpriority"] = Module["asm"]["__syscall_getpriority"]).apply(null, arguments);
};

var ___syscall_setpriority = Module["___syscall_setpriority"] = function() {
 return (___syscall_setpriority = Module["___syscall_setpriority"] = Module["asm"]["__syscall_setpriority"]).apply(null, arguments);
};

var ___syscall_setdomainname = Module["___syscall_setdomainname"] = function() {
 return (___syscall_setdomainname = Module["___syscall_setdomainname"] = Module["asm"]["__syscall_setdomainname"]).apply(null, arguments);
};

var ___syscall_getuid32 = Module["___syscall_getuid32"] = function() {
 return (___syscall_getuid32 = Module["___syscall_getuid32"] = Module["asm"]["__syscall_getuid32"]).apply(null, arguments);
};

var ___syscall_getgid32 = Module["___syscall_getgid32"] = function() {
 return (___syscall_getgid32 = Module["___syscall_getgid32"] = Module["asm"]["__syscall_getgid32"]).apply(null, arguments);
};

var ___syscall_geteuid32 = Module["___syscall_geteuid32"] = function() {
 return (___syscall_geteuid32 = Module["___syscall_geteuid32"] = Module["asm"]["__syscall_geteuid32"]).apply(null, arguments);
};

var ___syscall_getegid32 = Module["___syscall_getegid32"] = function() {
 return (___syscall_getegid32 = Module["___syscall_getegid32"] = Module["asm"]["__syscall_getegid32"]).apply(null, arguments);
};

var ___syscall_getresuid32 = Module["___syscall_getresuid32"] = function() {
 return (___syscall_getresuid32 = Module["___syscall_getresuid32"] = Module["asm"]["__syscall_getresuid32"]).apply(null, arguments);
};

var ___syscall_getresgid32 = Module["___syscall_getresgid32"] = function() {
 return (___syscall_getresgid32 = Module["___syscall_getresgid32"] = Module["asm"]["__syscall_getresgid32"]).apply(null, arguments);
};

var ___syscall_pause = Module["___syscall_pause"] = function() {
 return (___syscall_pause = Module["___syscall_pause"] = Module["asm"]["__syscall_pause"]).apply(null, arguments);
};

var ___syscall_madvise = Module["___syscall_madvise"] = function() {
 return (___syscall_madvise = Module["___syscall_madvise"] = Module["asm"]["__syscall_madvise"]).apply(null, arguments);
};

var ___syscall_mlock = Module["___syscall_mlock"] = function() {
 return (___syscall_mlock = Module["___syscall_mlock"] = Module["asm"]["__syscall_mlock"]).apply(null, arguments);
};

var ___syscall_munlock = Module["___syscall_munlock"] = function() {
 return (___syscall_munlock = Module["___syscall_munlock"] = Module["asm"]["__syscall_munlock"]).apply(null, arguments);
};

var ___syscall_mprotect = Module["___syscall_mprotect"] = function() {
 return (___syscall_mprotect = Module["___syscall_mprotect"] = Module["asm"]["__syscall_mprotect"]).apply(null, arguments);
};

var ___syscall_mremap = Module["___syscall_mremap"] = function() {
 return (___syscall_mremap = Module["___syscall_mremap"] = Module["asm"]["__syscall_mremap"]).apply(null, arguments);
};

var ___syscall_mlockall = Module["___syscall_mlockall"] = function() {
 return (___syscall_mlockall = Module["___syscall_mlockall"] = Module["asm"]["__syscall_mlockall"]).apply(null, arguments);
};

var ___syscall_munlockall = Module["___syscall_munlockall"] = function() {
 return (___syscall_munlockall = Module["___syscall_munlockall"] = Module["asm"]["__syscall_munlockall"]).apply(null, arguments);
};

var ___syscall_prlimit64 = Module["___syscall_prlimit64"] = function() {
 return (___syscall_prlimit64 = Module["___syscall_prlimit64"] = Module["asm"]["__syscall_prlimit64"]).apply(null, arguments);
};

var ___syscall_ugetrlimit = Module["___syscall_ugetrlimit"] = function() {
 return (___syscall_ugetrlimit = Module["___syscall_ugetrlimit"] = Module["asm"]["__syscall_ugetrlimit"]).apply(null, arguments);
};

var ___syscall_setsockopt = Module["___syscall_setsockopt"] = function() {
 return (___syscall_setsockopt = Module["___syscall_setsockopt"] = Module["asm"]["__syscall_setsockopt"]).apply(null, arguments);
};

var ___syscall_acct = Module["___syscall_acct"] = function() {
 return (___syscall_acct = Module["___syscall_acct"] = Module["asm"]["__syscall_acct"]).apply(null, arguments);
};

var ___syscall_mincore = Module["___syscall_mincore"] = function() {
 return (___syscall_mincore = Module["___syscall_mincore"] = Module["asm"]["__syscall_mincore"]).apply(null, arguments);
};

var ___syscall_pipe2 = Module["___syscall_pipe2"] = function() {
 return (___syscall_pipe2 = Module["___syscall_pipe2"] = Module["asm"]["__syscall_pipe2"]).apply(null, arguments);
};

var ___syscall_pselect6 = Module["___syscall_pselect6"] = function() {
 return (___syscall_pselect6 = Module["___syscall_pselect6"] = Module["asm"]["__syscall_pselect6"]).apply(null, arguments);
};

var ___syscall_recvmmsg = Module["___syscall_recvmmsg"] = function() {
 return (___syscall_recvmmsg = Module["___syscall_recvmmsg"] = Module["asm"]["__syscall_recvmmsg"]).apply(null, arguments);
};

var ___syscall_sendmmsg = Module["___syscall_sendmmsg"] = function() {
 return (___syscall_sendmmsg = Module["___syscall_sendmmsg"] = Module["asm"]["__syscall_sendmmsg"]).apply(null, arguments);
};

var ___syscall_shutdown = Module["___syscall_shutdown"] = function() {
 return (___syscall_shutdown = Module["___syscall_shutdown"] = Module["asm"]["__syscall_shutdown"]).apply(null, arguments);
};

var ___syscall_socketpair = Module["___syscall_socketpair"] = function() {
 return (___syscall_socketpair = Module["___syscall_socketpair"] = Module["asm"]["__syscall_socketpair"]).apply(null, arguments);
};

var ___syscall_wait4 = Module["___syscall_wait4"] = function() {
 return (___syscall_wait4 = Module["___syscall_wait4"] = Module["asm"]["__syscall_wait4"]).apply(null, arguments);
};

var __Exit = Module["__Exit"] = function() {
 return (__Exit = Module["__Exit"] = Module["asm"]["_Exit"]).apply(null, arguments);
};

var ___get_tp = Module["___get_tp"] = function() {
 return (___get_tp = Module["___get_tp"] = Module["asm"]["__get_tp"]).apply(null, arguments);
};

var ___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = function() {
 return (___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = Module["asm"]["__emscripten_environ_constructor"]).apply(null, arguments);
};

var _emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = function() {
 return (_emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = Module["asm"]["emscripten_builtin_malloc"]).apply(null, arguments);
};

var _memset = Module["_memset"] = function() {
 return (_memset = Module["_memset"] = Module["asm"]["memset"]).apply(null, arguments);
};

var ___fmodeflags = Module["___fmodeflags"] = function() {
 return (___fmodeflags = Module["___fmodeflags"] = Module["asm"]["__fmodeflags"]).apply(null, arguments);
};

var ___mo_lookup = Module["___mo_lookup"] = function() {
 return (___mo_lookup = Module["___mo_lookup"] = Module["asm"]["__mo_lookup"]).apply(null, arguments);
};

var ___randname = Module["___randname"] = function() {
 return (___randname = Module["___randname"] = Module["asm"]["__randname"]).apply(null, arguments);
};

var ___wasi_syscall_ret = Module["___wasi_syscall_ret"] = function() {
 return (___wasi_syscall_ret = Module["___wasi_syscall_ret"] = Module["asm"]["__wasi_syscall_ret"]).apply(null, arguments);
};

var ___uflow = Module["___uflow"] = function() {
 return (___uflow = Module["___uflow"] = Module["asm"]["__uflow"]).apply(null, arguments);
};

var _sqrt = Module["_sqrt"] = function() {
 return (_sqrt = Module["_sqrt"] = Module["asm"]["sqrt"]).apply(null, arguments);
};

var _log = Module["_log"] = function() {
 return (_log = Module["_log"] = Module["asm"]["log"]).apply(null, arguments);
};

var _alphasort64 = Module["_alphasort64"] = function() {
 return (_alphasort64 = Module["_alphasort64"] = Module["asm"]["alphasort64"]).apply(null, arguments);
};

var ___nl_langinfo_l = Module["___nl_langinfo_l"] = function() {
 return (___nl_langinfo_l = Module["___nl_langinfo_l"] = Module["asm"]["__nl_langinfo_l"]).apply(null, arguments);
};

var _fabs = Module["_fabs"] = function() {
 return (_fabs = Module["_fabs"] = Module["asm"]["fabs"]).apply(null, arguments);
};

var ___funcs_on_exit = function() {
 return (___funcs_on_exit = Module["asm"]["__funcs_on_exit"]).apply(null, arguments);
};

var ____cxa_finalize = Module["____cxa_finalize"] = function() {
 return (____cxa_finalize = Module["____cxa_finalize"] = Module["asm"]["___cxa_finalize"]).apply(null, arguments);
};

var ____cxa_atexit = Module["____cxa_atexit"] = function() {
 return (____cxa_atexit = Module["____cxa_atexit"] = Module["asm"]["___cxa_atexit"]).apply(null, arguments);
};

var ___atexit = Module["___atexit"] = function() {
 return (___atexit = Module["___atexit"] = Module["asm"]["__atexit"]).apply(null, arguments);
};

var _atexit = Module["_atexit"] = function() {
 return (_atexit = Module["_atexit"] = Module["asm"]["atexit"]).apply(null, arguments);
};

var ___cxa_atexit = Module["___cxa_atexit"] = function() {
 return (___cxa_atexit = Module["___cxa_atexit"] = Module["asm"]["__cxa_atexit"]).apply(null, arguments);
};

var ___cxa_finalize = Module["___cxa_finalize"] = function() {
 return (___cxa_finalize = Module["___cxa_finalize"] = Module["asm"]["__cxa_finalize"]).apply(null, arguments);
};

var _cbrt = Module["_cbrt"] = function() {
 return (_cbrt = Module["_cbrt"] = Module["asm"]["cbrt"]).apply(null, arguments);
};

var _cbrtf = Module["_cbrtf"] = function() {
 return (_cbrtf = Module["_cbrtf"] = Module["asm"]["cbrtf"]).apply(null, arguments);
};

var _cbrtl = Module["_cbrtl"] = function() {
 return (_cbrtl = Module["_cbrtl"] = Module["asm"]["cbrtl"]).apply(null, arguments);
};

var _ceil = Module["_ceil"] = function() {
 return (_ceil = Module["_ceil"] = Module["asm"]["ceil"]).apply(null, arguments);
};

var _ceilf = Module["_ceilf"] = function() {
 return (_ceilf = Module["_ceilf"] = Module["asm"]["ceilf"]).apply(null, arguments);
};

var _ceill = Module["_ceill"] = function() {
 return (_ceill = Module["_ceill"] = Module["asm"]["ceill"]).apply(null, arguments);
};

var _clearerr_unlocked = Module["_clearerr_unlocked"] = function() {
 return (_clearerr_unlocked = Module["_clearerr_unlocked"] = Module["asm"]["clearerr_unlocked"]).apply(null, arguments);
};

var _clock_nanosleep = Module["_clock_nanosleep"] = function() {
 return (_clock_nanosleep = Module["_clock_nanosleep"] = Module["asm"]["clock_nanosleep"]).apply(null, arguments);
};

var _copysign = Module["_copysign"] = function() {
 return (_copysign = Module["_copysign"] = Module["asm"]["copysign"]).apply(null, arguments);
};

var _copysignf = Module["_copysignf"] = function() {
 return (_copysignf = Module["_copysignf"] = Module["asm"]["copysignf"]).apply(null, arguments);
};

var _copysignl = Module["_copysignl"] = function() {
 return (_copysignl = Module["_copysignl"] = Module["asm"]["copysignl"]).apply(null, arguments);
};

var _cos = Module["_cos"] = function() {
 return (_cos = Module["_cos"] = Module["asm"]["cos"]).apply(null, arguments);
};

var _cosf = Module["_cosf"] = function() {
 return (_cosf = Module["_cosf"] = Module["asm"]["cosf"]).apply(null, arguments);
};

var _exp = Module["_exp"] = function() {
 return (_exp = Module["_exp"] = Module["asm"]["exp"]).apply(null, arguments);
};

var _cosl = Module["_cosl"] = function() {
 return (_cosl = Module["_cosl"] = Module["asm"]["cosl"]).apply(null, arguments);
};

var _creat64 = Module["_creat64"] = function() {
 return (_creat64 = Module["_creat64"] = Module["asm"]["creat64"]).apply(null, arguments);
};

var ___lock = Module["___lock"] = function() {
 return (___lock = Module["___lock"] = Module["asm"]["__lock"]).apply(null, arguments);
};

var ___unlock = Module["___unlock"] = function() {
 return (___unlock = Module["___unlock"] = Module["asm"]["__unlock"]).apply(null, arguments);
};

var ___libc_free = Module["___libc_free"] = function() {
 return (___libc_free = Module["___libc_free"] = Module["asm"]["__libc_free"]).apply(null, arguments);
};

var _vsnprintf = Module["_vsnprintf"] = function() {
 return (_vsnprintf = Module["_vsnprintf"] = Module["asm"]["vsnprintf"]).apply(null, arguments);
};

var ___libc_malloc = Module["___libc_malloc"] = function() {
 return (___libc_malloc = Module["___libc_malloc"] = Module["asm"]["__libc_malloc"]).apply(null, arguments);
};

var _dprintf = Module["_dprintf"] = function() {
 return (_dprintf = Module["_dprintf"] = Module["asm"]["dprintf"]).apply(null, arguments);
};

var _emscripten_get_heap_size = Module["_emscripten_get_heap_size"] = function() {
 return (_emscripten_get_heap_size = Module["_emscripten_get_heap_size"] = Module["asm"]["emscripten_get_heap_size"]).apply(null, arguments);
};

var _emscripten_builtin_memcpy = Module["_emscripten_builtin_memcpy"] = function() {
 return (_emscripten_builtin_memcpy = Module["_emscripten_builtin_memcpy"] = Module["asm"]["emscripten_builtin_memcpy"]).apply(null, arguments);
};

var _memcpy = function() {
 return (_memcpy = Module["asm"]["memcpy"]).apply(null, arguments);
};

var _memmove = Module["_memmove"] = function() {
 return (_memmove = Module["_memmove"] = Module["asm"]["memmove"]).apply(null, arguments);
};

var ___memset = Module["___memset"] = function() {
 return (___memset = Module["___memset"] = Module["asm"]["__memset"]).apply(null, arguments);
};

var _emscripten_builtin_memset = Module["_emscripten_builtin_memset"] = function() {
 return (_emscripten_builtin_memset = Module["_emscripten_builtin_memset"] = Module["asm"]["emscripten_builtin_memset"]).apply(null, arguments);
};

var ___syscall_munmap = Module["___syscall_munmap"] = function() {
 return (___syscall_munmap = Module["___syscall_munmap"] = Module["asm"]["__syscall_munmap"]).apply(null, arguments);
};

var ___syscall_msync = Module["___syscall_msync"] = function() {
 return (___syscall_msync = Module["___syscall_msync"] = Module["asm"]["__syscall_msync"]).apply(null, arguments);
};

var ___syscall_mmap2 = Module["___syscall_mmap2"] = function() {
 return (___syscall_mmap2 = Module["___syscall_mmap2"] = Module["asm"]["__syscall_mmap2"]).apply(null, arguments);
};

var ___clock = Module["___clock"] = function() {
 return (___clock = Module["___clock"] = Module["asm"]["__clock"]).apply(null, arguments);
};

var ___time = Module["___time"] = function() {
 return (___time = Module["___time"] = Module["asm"]["__time"]).apply(null, arguments);
};

var ___clock_getres = Module["___clock_getres"] = function() {
 return (___clock_getres = Module["___clock_getres"] = Module["asm"]["__clock_getres"]).apply(null, arguments);
};

var ___gettimeofday = Module["___gettimeofday"] = function() {
 return (___gettimeofday = Module["___gettimeofday"] = Module["asm"]["__gettimeofday"]).apply(null, arguments);
};

var _dysize = Module["_dysize"] = function() {
 return (_dysize = Module["_dysize"] = Module["asm"]["dysize"]).apply(null, arguments);
};

var _clock = Module["_clock"] = function() {
 return (_clock = Module["_clock"] = Module["asm"]["clock"]).apply(null, arguments);
};

var _clock_getres = Module["_clock_getres"] = function() {
 return (_clock_getres = Module["_clock_getres"] = Module["asm"]["clock_getres"]).apply(null, arguments);
};

var _exp2l = Module["_exp2l"] = function() {
 return (_exp2l = Module["_exp2l"] = Module["asm"]["exp2l"]).apply(null, arguments);
};

var _expf = Module["_expf"] = function() {
 return (_expf = Module["_expf"] = Module["asm"]["expf"]).apply(null, arguments);
};

var _expl = Module["_expl"] = function() {
 return (_expl = Module["_expl"] = Module["asm"]["expl"]).apply(null, arguments);
};

var _fabsl = Module["_fabsl"] = function() {
 return (_fabsl = Module["_fabsl"] = Module["asm"]["fabsl"]).apply(null, arguments);
};

var ___wasi_fd_is_valid = Module["___wasi_fd_is_valid"] = function() {
 return (___wasi_fd_is_valid = Module["___wasi_fd_is_valid"] = Module["asm"]["__wasi_fd_is_valid"]).apply(null, arguments);
};

var _feclearexcept = Module["_feclearexcept"] = function() {
 return (_feclearexcept = Module["_feclearexcept"] = Module["asm"]["feclearexcept"]).apply(null, arguments);
};

var _feraiseexcept = Module["_feraiseexcept"] = function() {
 return (_feraiseexcept = Module["_feraiseexcept"] = Module["asm"]["feraiseexcept"]).apply(null, arguments);
};

var _fetestexcept = Module["_fetestexcept"] = function() {
 return (_fetestexcept = Module["_fetestexcept"] = Module["asm"]["fetestexcept"]).apply(null, arguments);
};

var _fegetround = Module["_fegetround"] = function() {
 return (_fegetround = Module["_fegetround"] = Module["asm"]["fegetround"]).apply(null, arguments);
};

var ___fesetround = Module["___fesetround"] = function() {
 return (___fesetround = Module["___fesetround"] = Module["asm"]["__fesetround"]).apply(null, arguments);
};

var _fegetenv = Module["_fegetenv"] = function() {
 return (_fegetenv = Module["_fegetenv"] = Module["asm"]["fegetenv"]).apply(null, arguments);
};

var _fesetenv = Module["_fesetenv"] = function() {
 return (_fesetenv = Module["_fesetenv"] = Module["asm"]["fesetenv"]).apply(null, arguments);
};

var _feof_unlocked = Module["_feof_unlocked"] = function() {
 return (_feof_unlocked = Module["_feof_unlocked"] = Module["asm"]["feof_unlocked"]).apply(null, arguments);
};

var __IO_feof_unlocked = Module["__IO_feof_unlocked"] = function() {
 return (__IO_feof_unlocked = Module["__IO_feof_unlocked"] = Module["asm"]["_IO_feof_unlocked"]).apply(null, arguments);
};

var _ferror_unlocked = Module["_ferror_unlocked"] = function() {
 return (_ferror_unlocked = Module["_ferror_unlocked"] = Module["asm"]["ferror_unlocked"]).apply(null, arguments);
};

var __IO_ferror_unlocked = Module["__IO_ferror_unlocked"] = function() {
 return (__IO_ferror_unlocked = Module["__IO_ferror_unlocked"] = Module["asm"]["_IO_ferror_unlocked"]).apply(null, arguments);
};

var _fesetround = Module["_fesetround"] = function() {
 return (_fesetround = Module["_fesetround"] = Module["asm"]["fesetround"]).apply(null, arguments);
};

var _fflush_unlocked = Module["_fflush_unlocked"] = function() {
 return (_fflush_unlocked = Module["_fflush_unlocked"] = Module["asm"]["fflush_unlocked"]).apply(null, arguments);
};

var _emscripten_futex_wake = Module["_emscripten_futex_wake"] = function() {
 return (_emscripten_futex_wake = Module["_emscripten_futex_wake"] = Module["asm"]["emscripten_futex_wake"]).apply(null, arguments);
};

var _fgets = Module["_fgets"] = function() {
 return (_fgets = Module["_fgets"] = Module["asm"]["fgets"]).apply(null, arguments);
};

var _fgets_unlocked = Module["_fgets_unlocked"] = function() {
 return (_fgets_unlocked = Module["_fgets_unlocked"] = Module["asm"]["fgets_unlocked"]).apply(null, arguments);
};

var _fileno_unlocked = Module["_fileno_unlocked"] = function() {
 return (_fileno_unlocked = Module["_fileno_unlocked"] = Module["asm"]["fileno_unlocked"]).apply(null, arguments);
};

var _floor = Module["_floor"] = function() {
 return (_floor = Module["_floor"] = Module["asm"]["floor"]).apply(null, arguments);
};

var _floorf = Module["_floorf"] = function() {
 return (_floorf = Module["_floorf"] = Module["asm"]["floorf"]).apply(null, arguments);
};

var _floorl = Module["_floorl"] = function() {
 return (_floorl = Module["_floorl"] = Module["asm"]["floorl"]).apply(null, arguments);
};

var _fma = Module["_fma"] = function() {
 return (_fma = Module["_fma"] = Module["asm"]["fma"]).apply(null, arguments);
};

var _fmaf = Module["_fmaf"] = function() {
 return (_fmaf = Module["_fmaf"] = Module["asm"]["fmaf"]).apply(null, arguments);
};

var _fmal = Module["_fmal"] = function() {
 return (_fmal = Module["_fmal"] = Module["asm"]["fmal"]).apply(null, arguments);
};

var _fmod = Module["_fmod"] = function() {
 return (_fmod = Module["_fmod"] = Module["asm"]["fmod"]).apply(null, arguments);
};

var _fmodl = Module["_fmodl"] = function() {
 return (_fmodl = Module["_fmodl"] = Module["asm"]["fmodl"]).apply(null, arguments);
};

var _mbtowc = Module["_mbtowc"] = function() {
 return (_mbtowc = Module["_mbtowc"] = Module["asm"]["mbtowc"]).apply(null, arguments);
};

var _towupper = Module["_towupper"] = function() {
 return (_towupper = Module["_towupper"] = Module["asm"]["towupper"]).apply(null, arguments);
};

var _towlower = Module["_towlower"] = function() {
 return (_towlower = Module["_towlower"] = Module["asm"]["towlower"]).apply(null, arguments);
};

var _iswctype = Module["_iswctype"] = function() {
 return (_iswctype = Module["_iswctype"] = Module["asm"]["iswctype"]).apply(null, arguments);
};

var _wctype = Module["_wctype"] = function() {
 return (_wctype = Module["_wctype"] = Module["asm"]["wctype"]).apply(null, arguments);
};

var _fopen64 = Module["_fopen64"] = function() {
 return (_fopen64 = Module["_fopen64"] = Module["asm"]["fopen64"]).apply(null, arguments);
};

var _vfprintf = Module["_vfprintf"] = function() {
 return (_vfprintf = Module["_vfprintf"] = Module["asm"]["vfprintf"]).apply(null, arguments);
};

var _fiprintf = Module["_fiprintf"] = function() {
 return (_fiprintf = Module["_fiprintf"] = Module["asm"]["fiprintf"]).apply(null, arguments);
};

var _vfiprintf = Module["_vfiprintf"] = function() {
 return (_vfiprintf = Module["_vfiprintf"] = Module["asm"]["vfiprintf"]).apply(null, arguments);
};

var ___small_fprintf = Module["___small_fprintf"] = function() {
 return (___small_fprintf = Module["___small_fprintf"] = Module["asm"]["__small_fprintf"]).apply(null, arguments);
};

var ___small_vfprintf = Module["___small_vfprintf"] = function() {
 return (___small_vfprintf = Module["___small_vfprintf"] = Module["asm"]["__small_vfprintf"]).apply(null, arguments);
};

var _fread_unlocked = Module["_fread_unlocked"] = function() {
 return (_fread_unlocked = Module["_fread_unlocked"] = Module["asm"]["fread_unlocked"]).apply(null, arguments);
};

var _frexp = Module["_frexp"] = function() {
 return (_frexp = Module["_frexp"] = Module["asm"]["frexp"]).apply(null, arguments);
};

var _frexpf = Module["_frexpf"] = function() {
 return (_frexpf = Module["_frexpf"] = Module["asm"]["frexpf"]).apply(null, arguments);
};

var _frexpl = Module["_frexpl"] = function() {
 return (_frexpl = Module["_frexpl"] = Module["asm"]["frexpl"]).apply(null, arguments);
};

var _fseeko64 = Module["_fseeko64"] = function() {
 return (_fseeko64 = Module["_fseeko64"] = Module["asm"]["fseeko64"]).apply(null, arguments);
};

var _fstatat = Module["_fstatat"] = function() {
 return (_fstatat = Module["_fstatat"] = Module["asm"]["fstatat"]).apply(null, arguments);
};

var _fstat64 = Module["_fstat64"] = function() {
 return (_fstat64 = Module["_fstat64"] = Module["asm"]["fstat64"]).apply(null, arguments);
};

var _fstatat64 = Module["_fstatat64"] = function() {
 return (_fstatat64 = Module["_fstatat64"] = Module["asm"]["fstatat64"]).apply(null, arguments);
};

var _ftello64 = Module["_ftello64"] = function() {
 return (_ftello64 = Module["_ftello64"] = Module["asm"]["ftello64"]).apply(null, arguments);
};

var _ftruncate64 = Module["_ftruncate64"] = function() {
 return (_ftruncate64 = Module["_ftruncate64"] = Module["asm"]["ftruncate64"]).apply(null, arguments);
};

var _fwrite_unlocked = Module["_fwrite_unlocked"] = function() {
 return (_fwrite_unlocked = Module["_fwrite_unlocked"] = Module["asm"]["fwrite_unlocked"]).apply(null, arguments);
};

var __IO_getc = Module["__IO_getc"] = function() {
 return (__IO_getc = Module["__IO_getc"] = Module["asm"]["_IO_getc"]).apply(null, arguments);
};

var _getpriority = Module["_getpriority"] = function() {
 return (_getpriority = Module["_getpriority"] = Module["asm"]["getpriority"]).apply(null, arguments);
};

var _getservbyname_r = Module["_getservbyname_r"] = function() {
 return (_getservbyname_r = Module["_getservbyname_r"] = Module["asm"]["getservbyname_r"]).apply(null, arguments);
};

var _getservbyport_r = Module["_getservbyport_r"] = function() {
 return (_getservbyport_r = Module["_getservbyport_r"] = Module["asm"]["getservbyport_r"]).apply(null, arguments);
};

var _glob64 = Module["_glob64"] = function() {
 return (_glob64 = Module["_glob64"] = Module["asm"]["glob64"]).apply(null, arguments);
};

var _globfree64 = Module["_globfree64"] = function() {
 return (_globfree64 = Module["_globfree64"] = Module["asm"]["globfree64"]).apply(null, arguments);
};

var _ilogbl = Module["_ilogbl"] = function() {
 return (_ilogbl = Module["_ilogbl"] = Module["asm"]["ilogbl"]).apply(null, arguments);
};

var _strspn = Module["_strspn"] = function() {
 return (_strspn = Module["_strspn"] = Module["asm"]["strspn"]).apply(null, arguments);
};

var ___intscan = Module["___intscan"] = function() {
 return (___intscan = Module["___intscan"] = Module["asm"]["__intscan"]).apply(null, arguments);
};

var _ioctl = Module["_ioctl"] = function() {
 return (_ioctl = Module["_ioctl"] = Module["asm"]["ioctl"]).apply(null, arguments);
};

var ___isalnum_l = Module["___isalnum_l"] = function() {
 return (___isalnum_l = Module["___isalnum_l"] = Module["asm"]["__isalnum_l"]).apply(null, arguments);
};

var _isalnum_l = Module["_isalnum_l"] = function() {
 return (_isalnum_l = Module["_isalnum_l"] = Module["asm"]["isalnum_l"]).apply(null, arguments);
};

var ___isalpha_l = Module["___isalpha_l"] = function() {
 return (___isalpha_l = Module["___isalpha_l"] = Module["asm"]["__isalpha_l"]).apply(null, arguments);
};

var _isalpha_l = Module["_isalpha_l"] = function() {
 return (_isalpha_l = Module["_isalpha_l"] = Module["asm"]["isalpha_l"]).apply(null, arguments);
};

var _isblank = Module["_isblank"] = function() {
 return (_isblank = Module["_isblank"] = Module["asm"]["isblank"]).apply(null, arguments);
};

var ___isblank_l = Module["___isblank_l"] = function() {
 return (___isblank_l = Module["___isblank_l"] = Module["asm"]["__isblank_l"]).apply(null, arguments);
};

var _isblank_l = Module["_isblank_l"] = function() {
 return (_isblank_l = Module["_isblank_l"] = Module["asm"]["isblank_l"]).apply(null, arguments);
};

var ___iscntrl_l = Module["___iscntrl_l"] = function() {
 return (___iscntrl_l = Module["___iscntrl_l"] = Module["asm"]["__iscntrl_l"]).apply(null, arguments);
};

var _iscntrl_l = Module["_iscntrl_l"] = function() {
 return (_iscntrl_l = Module["_iscntrl_l"] = Module["asm"]["iscntrl_l"]).apply(null, arguments);
};

var ___isdigit_l = Module["___isdigit_l"] = function() {
 return (___isdigit_l = Module["___isdigit_l"] = Module["asm"]["__isdigit_l"]).apply(null, arguments);
};

var _isdigit_l = Module["_isdigit_l"] = function() {
 return (_isdigit_l = Module["_isdigit_l"] = Module["asm"]["isdigit_l"]).apply(null, arguments);
};

var ___isgraph_l = Module["___isgraph_l"] = function() {
 return (___isgraph_l = Module["___isgraph_l"] = Module["asm"]["__isgraph_l"]).apply(null, arguments);
};

var _isgraph_l = Module["_isgraph_l"] = function() {
 return (_isgraph_l = Module["_isgraph_l"] = Module["asm"]["isgraph_l"]).apply(null, arguments);
};

var ___islower_l = Module["___islower_l"] = function() {
 return (___islower_l = Module["___islower_l"] = Module["asm"]["__islower_l"]).apply(null, arguments);
};

var _islower_l = Module["_islower_l"] = function() {
 return (_islower_l = Module["_islower_l"] = Module["asm"]["islower_l"]).apply(null, arguments);
};

var ___isprint_l = Module["___isprint_l"] = function() {
 return (___isprint_l = Module["___isprint_l"] = Module["asm"]["__isprint_l"]).apply(null, arguments);
};

var _isprint_l = Module["_isprint_l"] = function() {
 return (_isprint_l = Module["_isprint_l"] = Module["asm"]["isprint_l"]).apply(null, arguments);
};

var ___ispunct_l = Module["___ispunct_l"] = function() {
 return (___ispunct_l = Module["___ispunct_l"] = Module["asm"]["__ispunct_l"]).apply(null, arguments);
};

var _ispunct_l = Module["_ispunct_l"] = function() {
 return (_ispunct_l = Module["_ispunct_l"] = Module["asm"]["ispunct_l"]).apply(null, arguments);
};

var ___isspace_l = Module["___isspace_l"] = function() {
 return (___isspace_l = Module["___isspace_l"] = Module["asm"]["__isspace_l"]).apply(null, arguments);
};

var _isspace_l = Module["_isspace_l"] = function() {
 return (_isspace_l = Module["_isspace_l"] = Module["asm"]["isspace_l"]).apply(null, arguments);
};

var ___isupper_l = Module["___isupper_l"] = function() {
 return (___isupper_l = Module["___isupper_l"] = Module["asm"]["__isupper_l"]).apply(null, arguments);
};

var _isupper_l = Module["_isupper_l"] = function() {
 return (_isupper_l = Module["_isupper_l"] = Module["asm"]["isupper_l"]).apply(null, arguments);
};

var _iswalnum = Module["_iswalnum"] = function() {
 return (_iswalnum = Module["_iswalnum"] = Module["asm"]["iswalnum"]).apply(null, arguments);
};

var ___iswalnum_l = Module["___iswalnum_l"] = function() {
 return (___iswalnum_l = Module["___iswalnum_l"] = Module["asm"]["__iswalnum_l"]).apply(null, arguments);
};

var _iswalnum_l = Module["_iswalnum_l"] = function() {
 return (_iswalnum_l = Module["_iswalnum_l"] = Module["asm"]["iswalnum_l"]).apply(null, arguments);
};

var _iswalpha = Module["_iswalpha"] = function() {
 return (_iswalpha = Module["_iswalpha"] = Module["asm"]["iswalpha"]).apply(null, arguments);
};

var ___iswalpha_l = Module["___iswalpha_l"] = function() {
 return (___iswalpha_l = Module["___iswalpha_l"] = Module["asm"]["__iswalpha_l"]).apply(null, arguments);
};

var _iswalpha_l = Module["_iswalpha_l"] = function() {
 return (_iswalpha_l = Module["_iswalpha_l"] = Module["asm"]["iswalpha_l"]).apply(null, arguments);
};

var _iswblank = Module["_iswblank"] = function() {
 return (_iswblank = Module["_iswblank"] = Module["asm"]["iswblank"]).apply(null, arguments);
};

var ___iswblank_l = Module["___iswblank_l"] = function() {
 return (___iswblank_l = Module["___iswblank_l"] = Module["asm"]["__iswblank_l"]).apply(null, arguments);
};

var _iswblank_l = Module["_iswblank_l"] = function() {
 return (_iswblank_l = Module["_iswblank_l"] = Module["asm"]["iswblank_l"]).apply(null, arguments);
};

var _iswcntrl = Module["_iswcntrl"] = function() {
 return (_iswcntrl = Module["_iswcntrl"] = Module["asm"]["iswcntrl"]).apply(null, arguments);
};

var ___iswcntrl_l = Module["___iswcntrl_l"] = function() {
 return (___iswcntrl_l = Module["___iswcntrl_l"] = Module["asm"]["__iswcntrl_l"]).apply(null, arguments);
};

var _iswcntrl_l = Module["_iswcntrl_l"] = function() {
 return (_iswcntrl_l = Module["_iswcntrl_l"] = Module["asm"]["iswcntrl_l"]).apply(null, arguments);
};

var _iswdigit = Module["_iswdigit"] = function() {
 return (_iswdigit = Module["_iswdigit"] = Module["asm"]["iswdigit"]).apply(null, arguments);
};

var _iswgraph = Module["_iswgraph"] = function() {
 return (_iswgraph = Module["_iswgraph"] = Module["asm"]["iswgraph"]).apply(null, arguments);
};

var _iswlower = Module["_iswlower"] = function() {
 return (_iswlower = Module["_iswlower"] = Module["asm"]["iswlower"]).apply(null, arguments);
};

var _iswprint = Module["_iswprint"] = function() {
 return (_iswprint = Module["_iswprint"] = Module["asm"]["iswprint"]).apply(null, arguments);
};

var _iswpunct = Module["_iswpunct"] = function() {
 return (_iswpunct = Module["_iswpunct"] = Module["asm"]["iswpunct"]).apply(null, arguments);
};

var _iswspace = Module["_iswspace"] = function() {
 return (_iswspace = Module["_iswspace"] = Module["asm"]["iswspace"]).apply(null, arguments);
};

var _iswupper = Module["_iswupper"] = function() {
 return (_iswupper = Module["_iswupper"] = Module["asm"]["iswupper"]).apply(null, arguments);
};

var _iswxdigit = Module["_iswxdigit"] = function() {
 return (_iswxdigit = Module["_iswxdigit"] = Module["asm"]["iswxdigit"]).apply(null, arguments);
};

var ___iswctype_l = Module["___iswctype_l"] = function() {
 return (___iswctype_l = Module["___iswctype_l"] = Module["asm"]["__iswctype_l"]).apply(null, arguments);
};

var ___wctype_l = Module["___wctype_l"] = function() {
 return (___wctype_l = Module["___wctype_l"] = Module["asm"]["__wctype_l"]).apply(null, arguments);
};

var _iswctype_l = Module["_iswctype_l"] = function() {
 return (_iswctype_l = Module["_iswctype_l"] = Module["asm"]["iswctype_l"]).apply(null, arguments);
};

var _wctype_l = Module["_wctype_l"] = function() {
 return (_wctype_l = Module["_wctype_l"] = Module["asm"]["wctype_l"]).apply(null, arguments);
};

var ___iswdigit_l = Module["___iswdigit_l"] = function() {
 return (___iswdigit_l = Module["___iswdigit_l"] = Module["asm"]["__iswdigit_l"]).apply(null, arguments);
};

var _iswdigit_l = Module["_iswdigit_l"] = function() {
 return (_iswdigit_l = Module["_iswdigit_l"] = Module["asm"]["iswdigit_l"]).apply(null, arguments);
};

var ___iswgraph_l = Module["___iswgraph_l"] = function() {
 return (___iswgraph_l = Module["___iswgraph_l"] = Module["asm"]["__iswgraph_l"]).apply(null, arguments);
};

var _iswgraph_l = Module["_iswgraph_l"] = function() {
 return (_iswgraph_l = Module["_iswgraph_l"] = Module["asm"]["iswgraph_l"]).apply(null, arguments);
};

var ___iswlower_l = Module["___iswlower_l"] = function() {
 return (___iswlower_l = Module["___iswlower_l"] = Module["asm"]["__iswlower_l"]).apply(null, arguments);
};

var _iswlower_l = Module["_iswlower_l"] = function() {
 return (_iswlower_l = Module["_iswlower_l"] = Module["asm"]["iswlower_l"]).apply(null, arguments);
};

var ___iswprint_l = Module["___iswprint_l"] = function() {
 return (___iswprint_l = Module["___iswprint_l"] = Module["asm"]["__iswprint_l"]).apply(null, arguments);
};

var _iswprint_l = Module["_iswprint_l"] = function() {
 return (_iswprint_l = Module["_iswprint_l"] = Module["asm"]["iswprint_l"]).apply(null, arguments);
};

var ___iswpunct_l = Module["___iswpunct_l"] = function() {
 return (___iswpunct_l = Module["___iswpunct_l"] = Module["asm"]["__iswpunct_l"]).apply(null, arguments);
};

var _iswpunct_l = Module["_iswpunct_l"] = function() {
 return (_iswpunct_l = Module["_iswpunct_l"] = Module["asm"]["iswpunct_l"]).apply(null, arguments);
};

var _wcschr = Module["_wcschr"] = function() {
 return (_wcschr = Module["_wcschr"] = Module["asm"]["wcschr"]).apply(null, arguments);
};

var ___iswspace_l = Module["___iswspace_l"] = function() {
 return (___iswspace_l = Module["___iswspace_l"] = Module["asm"]["__iswspace_l"]).apply(null, arguments);
};

var _iswspace_l = Module["_iswspace_l"] = function() {
 return (_iswspace_l = Module["_iswspace_l"] = Module["asm"]["iswspace_l"]).apply(null, arguments);
};

var ___iswupper_l = Module["___iswupper_l"] = function() {
 return (___iswupper_l = Module["___iswupper_l"] = Module["asm"]["__iswupper_l"]).apply(null, arguments);
};

var _iswupper_l = Module["_iswupper_l"] = function() {
 return (_iswupper_l = Module["_iswupper_l"] = Module["asm"]["iswupper_l"]).apply(null, arguments);
};

var ___iswxdigit_l = Module["___iswxdigit_l"] = function() {
 return (___iswxdigit_l = Module["___iswxdigit_l"] = Module["asm"]["__iswxdigit_l"]).apply(null, arguments);
};

var _iswxdigit_l = Module["_iswxdigit_l"] = function() {
 return (_iswxdigit_l = Module["_iswxdigit_l"] = Module["asm"]["iswxdigit_l"]).apply(null, arguments);
};

var ___isxdigit_l = Module["___isxdigit_l"] = function() {
 return (___isxdigit_l = Module["___isxdigit_l"] = Module["asm"]["__isxdigit_l"]).apply(null, arguments);
};

var _isxdigit_l = Module["_isxdigit_l"] = function() {
 return (_isxdigit_l = Module["_isxdigit_l"] = Module["asm"]["isxdigit_l"]).apply(null, arguments);
};

var _raise = Module["_raise"] = function() {
 return (_raise = Module["_raise"] = Module["asm"]["raise"]).apply(null, arguments);
};

var ___nl_langinfo = Module["___nl_langinfo"] = function() {
 return (___nl_langinfo = Module["___nl_langinfo"] = Module["asm"]["__nl_langinfo"]).apply(null, arguments);
};

var _nl_langinfo_l = Module["_nl_langinfo_l"] = function() {
 return (_nl_langinfo_l = Module["_nl_langinfo_l"] = Module["asm"]["nl_langinfo_l"]).apply(null, arguments);
};

var _emscripten_has_threading_support = Module["_emscripten_has_threading_support"] = function() {
 return (_emscripten_has_threading_support = Module["_emscripten_has_threading_support"] = Module["asm"]["emscripten_has_threading_support"]).apply(null, arguments);
};

var _emscripten_num_logical_cores = Module["_emscripten_num_logical_cores"] = function() {
 return (_emscripten_num_logical_cores = Module["_emscripten_num_logical_cores"] = Module["asm"]["emscripten_num_logical_cores"]).apply(null, arguments);
};

var _emscripten_force_num_logical_cores = Module["_emscripten_force_num_logical_cores"] = function() {
 return (_emscripten_force_num_logical_cores = Module["_emscripten_force_num_logical_cores"] = Module["asm"]["emscripten_force_num_logical_cores"]).apply(null, arguments);
};

var _emscripten_futex_wait = Module["_emscripten_futex_wait"] = function() {
 return (_emscripten_futex_wait = Module["_emscripten_futex_wait"] = Module["asm"]["emscripten_futex_wait"]).apply(null, arguments);
};

var _emscripten_is_main_runtime_thread = Module["_emscripten_is_main_runtime_thread"] = function() {
 return (_emscripten_is_main_runtime_thread = Module["_emscripten_is_main_runtime_thread"] = Module["asm"]["emscripten_is_main_runtime_thread"]).apply(null, arguments);
};

var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = function() {
 return (_emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = Module["asm"]["emscripten_main_thread_process_queued_calls"]).apply(null, arguments);
};

var _emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = function() {
 return (_emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = Module["asm"]["emscripten_current_thread_process_queued_calls"]).apply(null, arguments);
};

var __emscripten_yield = Module["__emscripten_yield"] = function() {
 return (__emscripten_yield = Module["__emscripten_yield"] = Module["asm"]["_emscripten_yield"]).apply(null, arguments);
};

var _pthread_mutex_init = Module["_pthread_mutex_init"] = function() {
 return (_pthread_mutex_init = Module["_pthread_mutex_init"] = Module["asm"]["pthread_mutex_init"]).apply(null, arguments);
};

var _pthread_mutex_destroy = Module["_pthread_mutex_destroy"] = function() {
 return (_pthread_mutex_destroy = Module["_pthread_mutex_destroy"] = Module["asm"]["pthread_mutex_destroy"]).apply(null, arguments);
};

var _pthread_mutex_consistent = Module["_pthread_mutex_consistent"] = function() {
 return (_pthread_mutex_consistent = Module["_pthread_mutex_consistent"] = Module["asm"]["pthread_mutex_consistent"]).apply(null, arguments);
};

var _pthread_barrier_init = Module["_pthread_barrier_init"] = function() {
 return (_pthread_barrier_init = Module["_pthread_barrier_init"] = Module["asm"]["pthread_barrier_init"]).apply(null, arguments);
};

var _pthread_barrier_destroy = Module["_pthread_barrier_destroy"] = function() {
 return (_pthread_barrier_destroy = Module["_pthread_barrier_destroy"] = Module["asm"]["pthread_barrier_destroy"]).apply(null, arguments);
};

var _pthread_barrier_wait = Module["_pthread_barrier_wait"] = function() {
 return (_pthread_barrier_wait = Module["_pthread_barrier_wait"] = Module["asm"]["pthread_barrier_wait"]).apply(null, arguments);
};

var _pthread_getspecific = Module["_pthread_getspecific"] = function() {
 return (_pthread_getspecific = Module["_pthread_getspecific"] = Module["asm"]["pthread_getspecific"]).apply(null, arguments);
};

var _pthread_setspecific = Module["_pthread_setspecific"] = function() {
 return (_pthread_setspecific = Module["_pthread_setspecific"] = Module["asm"]["pthread_setspecific"]).apply(null, arguments);
};

var _pthread_cond_wait = Module["_pthread_cond_wait"] = function() {
 return (_pthread_cond_wait = Module["_pthread_cond_wait"] = Module["asm"]["pthread_cond_wait"]).apply(null, arguments);
};

var _pthread_cond_signal = Module["_pthread_cond_signal"] = function() {
 return (_pthread_cond_signal = Module["_pthread_cond_signal"] = Module["asm"]["pthread_cond_signal"]).apply(null, arguments);
};

var _pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = function() {
 return (_pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = Module["asm"]["pthread_cond_broadcast"]).apply(null, arguments);
};

var _pthread_cond_init = Module["_pthread_cond_init"] = function() {
 return (_pthread_cond_init = Module["_pthread_cond_init"] = Module["asm"]["pthread_cond_init"]).apply(null, arguments);
};

var _pthread_cond_destroy = Module["_pthread_cond_destroy"] = function() {
 return (_pthread_cond_destroy = Module["_pthread_cond_destroy"] = Module["asm"]["pthread_cond_destroy"]).apply(null, arguments);
};

var _pthread_atfork = Module["_pthread_atfork"] = function() {
 return (_pthread_atfork = Module["_pthread_atfork"] = Module["asm"]["pthread_atfork"]).apply(null, arguments);
};

var _pthread_cancel = Module["_pthread_cancel"] = function() {
 return (_pthread_cancel = Module["_pthread_cancel"] = Module["asm"]["pthread_cancel"]).apply(null, arguments);
};

var _pthread_testcancel = Module["_pthread_testcancel"] = function() {
 return (_pthread_testcancel = Module["_pthread_testcancel"] = Module["asm"]["pthread_testcancel"]).apply(null, arguments);
};

var ___pthread_detach = Module["___pthread_detach"] = function() {
 return (___pthread_detach = Module["___pthread_detach"] = Module["asm"]["__pthread_detach"]).apply(null, arguments);
};

var _pthread_equal = Module["_pthread_equal"] = function() {
 return (_pthread_equal = Module["_pthread_equal"] = Module["asm"]["pthread_equal"]).apply(null, arguments);
};

var _pthread_mutexattr_init = Module["_pthread_mutexattr_init"] = function() {
 return (_pthread_mutexattr_init = Module["_pthread_mutexattr_init"] = Module["asm"]["pthread_mutexattr_init"]).apply(null, arguments);
};

var _pthread_mutexattr_setprotocol = Module["_pthread_mutexattr_setprotocol"] = function() {
 return (_pthread_mutexattr_setprotocol = Module["_pthread_mutexattr_setprotocol"] = Module["asm"]["pthread_mutexattr_setprotocol"]).apply(null, arguments);
};

var _pthread_mutexattr_settype = Module["_pthread_mutexattr_settype"] = function() {
 return (_pthread_mutexattr_settype = Module["_pthread_mutexattr_settype"] = Module["asm"]["pthread_mutexattr_settype"]).apply(null, arguments);
};

var _pthread_mutexattr_destroy = Module["_pthread_mutexattr_destroy"] = function() {
 return (_pthread_mutexattr_destroy = Module["_pthread_mutexattr_destroy"] = Module["asm"]["pthread_mutexattr_destroy"]).apply(null, arguments);
};

var _pthread_mutexattr_setpshared = Module["_pthread_mutexattr_setpshared"] = function() {
 return (_pthread_mutexattr_setpshared = Module["_pthread_mutexattr_setpshared"] = Module["asm"]["pthread_mutexattr_setpshared"]).apply(null, arguments);
};

var _pthread_condattr_init = Module["_pthread_condattr_init"] = function() {
 return (_pthread_condattr_init = Module["_pthread_condattr_init"] = Module["asm"]["pthread_condattr_init"]).apply(null, arguments);
};

var _pthread_condattr_destroy = Module["_pthread_condattr_destroy"] = function() {
 return (_pthread_condattr_destroy = Module["_pthread_condattr_destroy"] = Module["asm"]["pthread_condattr_destroy"]).apply(null, arguments);
};

var _pthread_condattr_setclock = Module["_pthread_condattr_setclock"] = function() {
 return (_pthread_condattr_setclock = Module["_pthread_condattr_setclock"] = Module["asm"]["pthread_condattr_setclock"]).apply(null, arguments);
};

var _pthread_condattr_setpshared = Module["_pthread_condattr_setpshared"] = function() {
 return (_pthread_condattr_setpshared = Module["_pthread_condattr_setpshared"] = Module["asm"]["pthread_condattr_setpshared"]).apply(null, arguments);
};

var _pthread_getattr_np = Module["_pthread_getattr_np"] = function() {
 return (_pthread_getattr_np = Module["_pthread_getattr_np"] = Module["asm"]["pthread_getattr_np"]).apply(null, arguments);
};

var _pthread_setcancelstate = Module["_pthread_setcancelstate"] = function() {
 return (_pthread_setcancelstate = Module["_pthread_setcancelstate"] = Module["asm"]["pthread_setcancelstate"]).apply(null, arguments);
};

var _pthread_setcanceltype = Module["_pthread_setcanceltype"] = function() {
 return (_pthread_setcanceltype = Module["_pthread_setcanceltype"] = Module["asm"]["pthread_setcanceltype"]).apply(null, arguments);
};

var _pthread_rwlock_init = Module["_pthread_rwlock_init"] = function() {
 return (_pthread_rwlock_init = Module["_pthread_rwlock_init"] = Module["asm"]["pthread_rwlock_init"]).apply(null, arguments);
};

var _pthread_rwlock_destroy = Module["_pthread_rwlock_destroy"] = function() {
 return (_pthread_rwlock_destroy = Module["_pthread_rwlock_destroy"] = Module["asm"]["pthread_rwlock_destroy"]).apply(null, arguments);
};

var _pthread_rwlock_rdlock = Module["_pthread_rwlock_rdlock"] = function() {
 return (_pthread_rwlock_rdlock = Module["_pthread_rwlock_rdlock"] = Module["asm"]["pthread_rwlock_rdlock"]).apply(null, arguments);
};

var _pthread_rwlock_tryrdlock = Module["_pthread_rwlock_tryrdlock"] = function() {
 return (_pthread_rwlock_tryrdlock = Module["_pthread_rwlock_tryrdlock"] = Module["asm"]["pthread_rwlock_tryrdlock"]).apply(null, arguments);
};

var _pthread_rwlock_timedrdlock = Module["_pthread_rwlock_timedrdlock"] = function() {
 return (_pthread_rwlock_timedrdlock = Module["_pthread_rwlock_timedrdlock"] = Module["asm"]["pthread_rwlock_timedrdlock"]).apply(null, arguments);
};

var _pthread_rwlock_wrlock = Module["_pthread_rwlock_wrlock"] = function() {
 return (_pthread_rwlock_wrlock = Module["_pthread_rwlock_wrlock"] = Module["asm"]["pthread_rwlock_wrlock"]).apply(null, arguments);
};

var _pthread_rwlock_trywrlock = Module["_pthread_rwlock_trywrlock"] = function() {
 return (_pthread_rwlock_trywrlock = Module["_pthread_rwlock_trywrlock"] = Module["asm"]["pthread_rwlock_trywrlock"]).apply(null, arguments);
};

var _pthread_rwlock_timedwrlock = Module["_pthread_rwlock_timedwrlock"] = function() {
 return (_pthread_rwlock_timedwrlock = Module["_pthread_rwlock_timedwrlock"] = Module["asm"]["pthread_rwlock_timedwrlock"]).apply(null, arguments);
};

var _pthread_rwlock_unlock = Module["_pthread_rwlock_unlock"] = function() {
 return (_pthread_rwlock_unlock = Module["_pthread_rwlock_unlock"] = Module["asm"]["pthread_rwlock_unlock"]).apply(null, arguments);
};

var _pthread_rwlockattr_init = Module["_pthread_rwlockattr_init"] = function() {
 return (_pthread_rwlockattr_init = Module["_pthread_rwlockattr_init"] = Module["asm"]["pthread_rwlockattr_init"]).apply(null, arguments);
};

var _pthread_rwlockattr_destroy = Module["_pthread_rwlockattr_destroy"] = function() {
 return (_pthread_rwlockattr_destroy = Module["_pthread_rwlockattr_destroy"] = Module["asm"]["pthread_rwlockattr_destroy"]).apply(null, arguments);
};

var _pthread_rwlockattr_setpshared = Module["_pthread_rwlockattr_setpshared"] = function() {
 return (_pthread_rwlockattr_setpshared = Module["_pthread_rwlockattr_setpshared"] = Module["asm"]["pthread_rwlockattr_setpshared"]).apply(null, arguments);
};

var _pthread_spin_init = Module["_pthread_spin_init"] = function() {
 return (_pthread_spin_init = Module["_pthread_spin_init"] = Module["asm"]["pthread_spin_init"]).apply(null, arguments);
};

var _pthread_spin_destroy = Module["_pthread_spin_destroy"] = function() {
 return (_pthread_spin_destroy = Module["_pthread_spin_destroy"] = Module["asm"]["pthread_spin_destroy"]).apply(null, arguments);
};

var _pthread_spin_lock = Module["_pthread_spin_lock"] = function() {
 return (_pthread_spin_lock = Module["_pthread_spin_lock"] = Module["asm"]["pthread_spin_lock"]).apply(null, arguments);
};

var _pthread_spin_trylock = Module["_pthread_spin_trylock"] = function() {
 return (_pthread_spin_trylock = Module["_pthread_spin_trylock"] = Module["asm"]["pthread_spin_trylock"]).apply(null, arguments);
};

var _pthread_spin_unlock = Module["_pthread_spin_unlock"] = function() {
 return (_pthread_spin_unlock = Module["_pthread_spin_unlock"] = Module["asm"]["pthread_spin_unlock"]).apply(null, arguments);
};

var _sem_init = Module["_sem_init"] = function() {
 return (_sem_init = Module["_sem_init"] = Module["asm"]["sem_init"]).apply(null, arguments);
};

var _sem_post = Module["_sem_post"] = function() {
 return (_sem_post = Module["_sem_post"] = Module["asm"]["sem_post"]).apply(null, arguments);
};

var _sem_wait = Module["_sem_wait"] = function() {
 return (_sem_wait = Module["_sem_wait"] = Module["asm"]["sem_wait"]).apply(null, arguments);
};

var _sem_trywait = Module["_sem_trywait"] = function() {
 return (_sem_trywait = Module["_sem_trywait"] = Module["asm"]["sem_trywait"]).apply(null, arguments);
};

var _sem_destroy = Module["_sem_destroy"] = function() {
 return (_sem_destroy = Module["_sem_destroy"] = Module["asm"]["sem_destroy"]).apply(null, arguments);
};

var _emscripten_thread_sleep = Module["_emscripten_thread_sleep"] = function() {
 return (_emscripten_thread_sleep = Module["_emscripten_thread_sleep"] = Module["asm"]["emscripten_thread_sleep"]).apply(null, arguments);
};

var __emscripten_check_timers = Module["__emscripten_check_timers"] = function() {
 return (__emscripten_check_timers = Module["__emscripten_check_timers"] = Module["asm"]["_emscripten_check_timers"]).apply(null, arguments);
};

var _pthread_mutex_lock = Module["_pthread_mutex_lock"] = function() {
 return (_pthread_mutex_lock = Module["_pthread_mutex_lock"] = Module["asm"]["pthread_mutex_lock"]).apply(null, arguments);
};

var _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = function() {
 return (_pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = Module["asm"]["pthread_mutex_unlock"]).apply(null, arguments);
};

var _pthread_mutex_trylock = Module["_pthread_mutex_trylock"] = function() {
 return (_pthread_mutex_trylock = Module["_pthread_mutex_trylock"] = Module["asm"]["pthread_mutex_trylock"]).apply(null, arguments);
};

var _pthread_mutex_timedlock = Module["_pthread_mutex_timedlock"] = function() {
 return (_pthread_mutex_timedlock = Module["_pthread_mutex_timedlock"] = Module["asm"]["pthread_mutex_timedlock"]).apply(null, arguments);
};

var _emscripten_builtin_pthread_create = Module["_emscripten_builtin_pthread_create"] = function() {
 return (_emscripten_builtin_pthread_create = Module["_emscripten_builtin_pthread_create"] = Module["asm"]["emscripten_builtin_pthread_create"]).apply(null, arguments);
};

var _pthread_create = Module["_pthread_create"] = function() {
 return (_pthread_create = Module["_pthread_create"] = Module["asm"]["pthread_create"]).apply(null, arguments);
};

var _emscripten_builtin_pthread_join = Module["_emscripten_builtin_pthread_join"] = function() {
 return (_emscripten_builtin_pthread_join = Module["_emscripten_builtin_pthread_join"] = Module["asm"]["emscripten_builtin_pthread_join"]).apply(null, arguments);
};

var _pthread_join = Module["_pthread_join"] = function() {
 return (_pthread_join = Module["_pthread_join"] = Module["asm"]["pthread_join"]).apply(null, arguments);
};

var _pthread_key_delete = Module["_pthread_key_delete"] = function() {
 return (_pthread_key_delete = Module["_pthread_key_delete"] = Module["asm"]["pthread_key_delete"]).apply(null, arguments);
};

var _pthread_key_create = Module["_pthread_key_create"] = function() {
 return (_pthread_key_create = Module["_pthread_key_create"] = Module["asm"]["pthread_key_create"]).apply(null, arguments);
};

var _pthread_once = Module["_pthread_once"] = function() {
 return (_pthread_once = Module["_pthread_once"] = Module["asm"]["pthread_once"]).apply(null, arguments);
};

var _pthread_cond_timedwait = Module["_pthread_cond_timedwait"] = function() {
 return (_pthread_cond_timedwait = Module["_pthread_cond_timedwait"] = Module["asm"]["pthread_cond_timedwait"]).apply(null, arguments);
};

var _pthread_exit = Module["_pthread_exit"] = function() {
 return (_pthread_exit = Module["_pthread_exit"] = Module["asm"]["pthread_exit"]).apply(null, arguments);
};

var _emscripten_builtin_pthread_detach = Module["_emscripten_builtin_pthread_detach"] = function() {
 return (_emscripten_builtin_pthread_detach = Module["_emscripten_builtin_pthread_detach"] = Module["asm"]["emscripten_builtin_pthread_detach"]).apply(null, arguments);
};

var _pthread_detach = Module["_pthread_detach"] = function() {
 return (_pthread_detach = Module["_pthread_detach"] = Module["asm"]["pthread_detach"]).apply(null, arguments);
};

var _thrd_detach = Module["_thrd_detach"] = function() {
 return (_thrd_detach = Module["_thrd_detach"] = Module["asm"]["thrd_detach"]).apply(null, arguments);
};

var _llrint = Module["_llrint"] = function() {
 return (_llrint = Module["_llrint"] = Module["asm"]["llrint"]).apply(null, arguments);
};

var _llrintf = Module["_llrintf"] = function() {
 return (_llrintf = Module["_llrintf"] = Module["asm"]["llrintf"]).apply(null, arguments);
};

var _llrintl = Module["_llrintl"] = function() {
 return (_llrintl = Module["_llrintl"] = Module["asm"]["llrintl"]).apply(null, arguments);
};

var _llround = Module["_llround"] = function() {
 return (_llround = Module["_llround"] = Module["asm"]["llround"]).apply(null, arguments);
};

var _llroundf = Module["_llroundf"] = function() {
 return (_llroundf = Module["_llroundf"] = Module["asm"]["llroundf"]).apply(null, arguments);
};

var _llroundl = Module["_llroundl"] = function() {
 return (_llroundl = Module["_llroundl"] = Module["asm"]["llroundl"]).apply(null, arguments);
};

var _log10 = Module["_log10"] = function() {
 return (_log10 = Module["_log10"] = Module["asm"]["log10"]).apply(null, arguments);
};

var _log10l = Module["_log10l"] = function() {
 return (_log10l = Module["_log10l"] = Module["asm"]["log10l"]).apply(null, arguments);
};

var _log2 = Module["_log2"] = function() {
 return (_log2 = Module["_log2"] = Module["asm"]["log2"]).apply(null, arguments);
};

var _log2l = Module["_log2l"] = function() {
 return (_log2l = Module["_log2l"] = Module["asm"]["log2l"]).apply(null, arguments);
};

var _logl = Module["_logl"] = function() {
 return (_logl = Module["_logl"] = Module["asm"]["logl"]).apply(null, arguments);
};

var _lrint = Module["_lrint"] = function() {
 return (_lrint = Module["_lrint"] = Module["asm"]["lrint"]).apply(null, arguments);
};

var _lrintf = Module["_lrintf"] = function() {
 return (_lrintf = Module["_lrintf"] = Module["asm"]["lrintf"]).apply(null, arguments);
};

var _lrintl = Module["_lrintl"] = function() {
 return (_lrintl = Module["_lrintl"] = Module["asm"]["lrintl"]).apply(null, arguments);
};

var _lround = Module["_lround"] = function() {
 return (_lround = Module["_lround"] = Module["asm"]["lround"]).apply(null, arguments);
};

var _lroundf = Module["_lroundf"] = function() {
 return (_lroundf = Module["_lroundf"] = Module["asm"]["lroundf"]).apply(null, arguments);
};

var _lroundl = Module["_lroundl"] = function() {
 return (_lroundl = Module["_lroundl"] = Module["asm"]["lroundl"]).apply(null, arguments);
};

var _lseek64 = Module["_lseek64"] = function() {
 return (_lseek64 = Module["_lseek64"] = Module["asm"]["lseek64"]).apply(null, arguments);
};

var _lstat64 = Module["_lstat64"] = function() {
 return (_lstat64 = Module["_lstat64"] = Module["asm"]["lstat64"]).apply(null, arguments);
};

var _mbrtowc = Module["_mbrtowc"] = function() {
 return (_mbrtowc = Module["_mbrtowc"] = Module["asm"]["mbrtowc"]).apply(null, arguments);
};

var _mbsinit = Module["_mbsinit"] = function() {
 return (_mbsinit = Module["_mbsinit"] = Module["asm"]["mbsinit"]).apply(null, arguments);
};

var _mkostemps = Module["_mkostemps"] = function() {
 return (_mkostemps = Module["_mkostemps"] = Module["asm"]["mkostemps"]).apply(null, arguments);
};

var _mkostemps64 = Module["_mkostemps64"] = function() {
 return (_mkostemps64 = Module["_mkostemps64"] = Module["asm"]["mkostemps64"]).apply(null, arguments);
};

var _mkstemp64 = Module["_mkstemp64"] = function() {
 return (_mkstemp64 = Module["_mkstemp64"] = Module["asm"]["mkstemp64"]).apply(null, arguments);
};

var _timegm = Module["_timegm"] = function() {
 return (_timegm = Module["_timegm"] = Module["asm"]["timegm"]).apply(null, arguments);
};

var _emscripten_builtin_free = Module["_emscripten_builtin_free"] = function() {
 return (_emscripten_builtin_free = Module["_emscripten_builtin_free"] = Module["asm"]["emscripten_builtin_free"]).apply(null, arguments);
};

var _emscripten_builtin_memalign = function() {
 return (_emscripten_builtin_memalign = Module["asm"]["emscripten_builtin_memalign"]).apply(null, arguments);
};

var _emscripten_builtin_mmap = Module["_emscripten_builtin_mmap"] = function() {
 return (_emscripten_builtin_mmap = Module["_emscripten_builtin_mmap"] = Module["asm"]["emscripten_builtin_mmap"]).apply(null, arguments);
};

var _mmap64 = Module["_mmap64"] = function() {
 return (_mmap64 = Module["_mmap64"] = Module["asm"]["mmap64"]).apply(null, arguments);
};

var _emscripten_builtin_munmap = Module["_emscripten_builtin_munmap"] = function() {
 return (_emscripten_builtin_munmap = Module["_emscripten_builtin_munmap"] = Module["asm"]["emscripten_builtin_munmap"]).apply(null, arguments);
};

var _nearbyint = Module["_nearbyint"] = function() {
 return (_nearbyint = Module["_nearbyint"] = Module["asm"]["nearbyint"]).apply(null, arguments);
};

var _nearbyintf = Module["_nearbyintf"] = function() {
 return (_nearbyintf = Module["_nearbyintf"] = Module["asm"]["nearbyintf"]).apply(null, arguments);
};

var _nearbyintl = Module["_nearbyintl"] = function() {
 return (_nearbyintl = Module["_nearbyintl"] = Module["asm"]["nearbyintl"]).apply(null, arguments);
};

var _nextafterl = Module["_nextafterl"] = function() {
 return (_nextafterl = Module["_nextafterl"] = Module["asm"]["nextafterl"]).apply(null, arguments);
};

var _setpriority = Module["_setpriority"] = function() {
 return (_setpriority = Module["_setpriority"] = Module["asm"]["setpriority"]).apply(null, arguments);
};

var _open64 = Module["_open64"] = function() {
 return (_open64 = Module["_open64"] = Module["asm"]["open64"]).apply(null, arguments);
};

var _tcsetattr = Module["_tcsetattr"] = function() {
 return (_tcsetattr = Module["_tcsetattr"] = Module["asm"]["tcsetattr"]).apply(null, arguments);
};

var _pow = Module["_pow"] = function() {
 return (_pow = Module["_pow"] = Module["asm"]["pow"]).apply(null, arguments);
};

var _powf = Module["_powf"] = function() {
 return (_powf = Module["_powf"] = Module["asm"]["powf"]).apply(null, arguments);
};

var _powl = Module["_powl"] = function() {
 return (_powl = Module["_powl"] = Module["asm"]["powl"]).apply(null, arguments);
};

var _iprintf = Module["_iprintf"] = function() {
 return (_iprintf = Module["_iprintf"] = Module["asm"]["iprintf"]).apply(null, arguments);
};

var ___small_printf = Module["___small_printf"] = function() {
 return (___small_printf = Module["___small_printf"] = Module["asm"]["__small_printf"]).apply(null, arguments);
};

var _emscripten_main_runtime_thread_id = Module["_emscripten_main_runtime_thread_id"] = function() {
 return (_emscripten_main_runtime_thread_id = Module["_emscripten_main_runtime_thread_id"] = Module["asm"]["emscripten_main_runtime_thread_id"]).apply(null, arguments);
};

var ___sig_is_blocked = Module["___sig_is_blocked"] = function() {
 return (___sig_is_blocked = Module["___sig_is_blocked"] = Module["asm"]["__sig_is_blocked"]).apply(null, arguments);
};

var _pthread_sigmask = Module["_pthread_sigmask"] = function() {
 return (_pthread_sigmask = Module["_pthread_sigmask"] = Module["asm"]["pthread_sigmask"]).apply(null, arguments);
};

var _sigpending = Module["_sigpending"] = function() {
 return (_sigpending = Module["_sigpending"] = Module["asm"]["sigpending"]).apply(null, arguments);
};

var _qsort_r = Module["_qsort_r"] = function() {
 return (_qsort_r = Module["_qsort_r"] = Module["asm"]["qsort_r"]).apply(null, arguments);
};

var _sigismember = Module["_sigismember"] = function() {
 return (_sigismember = Module["_sigismember"] = Module["asm"]["sigismember"]).apply(null, arguments);
};

var _sigorset = Module["_sigorset"] = function() {
 return (_sigorset = Module["_sigorset"] = Module["asm"]["sigorset"]).apply(null, arguments);
};

var _sigandset = Module["_sigandset"] = function() {
 return (_sigandset = Module["_sigandset"] = Module["asm"]["sigandset"]).apply(null, arguments);
};

var _readdir64 = Module["_readdir64"] = function() {
 return (_readdir64 = Module["_readdir64"] = Module["asm"]["readdir64"]).apply(null, arguments);
};

var _rint = Module["_rint"] = function() {
 return (_rint = Module["_rint"] = Module["asm"]["rint"]).apply(null, arguments);
};

var _rintf = Module["_rintf"] = function() {
 return (_rintf = Module["_rintf"] = Module["asm"]["rintf"]).apply(null, arguments);
};

var _rintl = Module["_rintl"] = function() {
 return (_rintl = Module["_rintl"] = Module["asm"]["rintl"]).apply(null, arguments);
};

var _round = Module["_round"] = function() {
 return (_round = Module["_round"] = Module["asm"]["round"]).apply(null, arguments);
};

var _roundf = Module["_roundf"] = function() {
 return (_roundf = Module["_roundf"] = Module["asm"]["roundf"]).apply(null, arguments);
};

var _roundl = Module["_roundl"] = function() {
 return (_roundl = Module["_roundl"] = Module["asm"]["roundl"]).apply(null, arguments);
};

var _emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = function() {
 return (_emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = Module["asm"]["emscripten_get_sbrk_ptr"]).apply(null, arguments);
};

var _sbrk = Module["_sbrk"] = function() {
 return (_sbrk = Module["_sbrk"] = Module["asm"]["sbrk"]).apply(null, arguments);
};

var _brk = Module["_brk"] = function() {
 return (_brk = Module["_brk"] = Module["asm"]["brk"]).apply(null, arguments);
};

var _scalbn = Module["_scalbn"] = function() {
 return (_scalbn = Module["_scalbn"] = Module["asm"]["scalbn"]).apply(null, arguments);
};

var _scalbnl = Module["_scalbnl"] = function() {
 return (_scalbnl = Module["_scalbnl"] = Module["asm"]["scalbnl"]).apply(null, arguments);
};

var _scandir64 = Module["_scandir64"] = function() {
 return (_scandir64 = Module["_scandir64"] = Module["asm"]["scandir64"]).apply(null, arguments);
};

var ___getitimer = Module["___getitimer"] = function() {
 return (___getitimer = Module["___getitimer"] = Module["asm"]["__getitimer"]).apply(null, arguments);
};

var __emscripten_timeout = function() {
 return (__emscripten_timeout = Module["asm"]["_emscripten_timeout"]).apply(null, arguments);
};

var _bsd_signal = Module["_bsd_signal"] = function() {
 return (_bsd_signal = Module["_bsd_signal"] = Module["asm"]["bsd_signal"]).apply(null, arguments);
};

var ___sysv_signal = Module["___sysv_signal"] = function() {
 return (___sysv_signal = Module["___sysv_signal"] = Module["asm"]["__sysv_signal"]).apply(null, arguments);
};

var _sin = Module["_sin"] = function() {
 return (_sin = Module["_sin"] = Module["asm"]["sin"]).apply(null, arguments);
};

var _sinf = Module["_sinf"] = function() {
 return (_sinf = Module["_sinf"] = Module["asm"]["sinf"]).apply(null, arguments);
};

var _sinl = Module["_sinl"] = function() {
 return (_sinl = Module["_sinl"] = Module["asm"]["sinl"]).apply(null, arguments);
};

var _vsprintf = Module["_vsprintf"] = function() {
 return (_vsprintf = Module["_vsprintf"] = Module["asm"]["vsprintf"]).apply(null, arguments);
};

var _siprintf = Module["_siprintf"] = function() {
 return (_siprintf = Module["_siprintf"] = Module["asm"]["siprintf"]).apply(null, arguments);
};

var _vsiprintf = Module["_vsiprintf"] = function() {
 return (_vsiprintf = Module["_vsiprintf"] = Module["asm"]["vsiprintf"]).apply(null, arguments);
};

var ___small_sprintf = Module["___small_sprintf"] = function() {
 return (___small_sprintf = Module["___small_sprintf"] = Module["asm"]["__small_sprintf"]).apply(null, arguments);
};

var ___small_vsprintf = Module["___small_vsprintf"] = function() {
 return (___small_vsprintf = Module["___small_vsprintf"] = Module["asm"]["__small_vsprintf"]).apply(null, arguments);
};

var _sqrtf = Module["_sqrtf"] = function() {
 return (_sqrtf = Module["_sqrtf"] = Module["asm"]["sqrtf"]).apply(null, arguments);
};

var _sqrtl = Module["_sqrtl"] = function() {
 return (_sqrtl = Module["_sqrtl"] = Module["asm"]["sqrtl"]).apply(null, arguments);
};

var _vsscanf = Module["_vsscanf"] = function() {
 return (_vsscanf = Module["_vsscanf"] = Module["asm"]["vsscanf"]).apply(null, arguments);
};

var ___isoc99_sscanf = Module["___isoc99_sscanf"] = function() {
 return (___isoc99_sscanf = Module["___isoc99_sscanf"] = Module["asm"]["__isoc99_sscanf"]).apply(null, arguments);
};

var _stat64 = Module["_stat64"] = function() {
 return (_stat64 = Module["_stat64"] = Module["asm"]["stat64"]).apply(null, arguments);
};

var _fstatvfs = Module["_fstatvfs"] = function() {
 return (_fstatvfs = Module["_fstatvfs"] = Module["asm"]["fstatvfs"]).apply(null, arguments);
};

var _statfs = Module["_statfs"] = function() {
 return (_statfs = Module["_statfs"] = Module["asm"]["statfs"]).apply(null, arguments);
};

var _fstatfs = Module["_fstatfs"] = function() {
 return (_fstatfs = Module["_fstatfs"] = Module["asm"]["fstatfs"]).apply(null, arguments);
};

var _statvfs64 = Module["_statvfs64"] = function() {
 return (_statvfs64 = Module["_statvfs64"] = Module["asm"]["statvfs64"]).apply(null, arguments);
};

var _statfs64 = Module["_statfs64"] = function() {
 return (_statfs64 = Module["_statfs64"] = Module["asm"]["statfs64"]).apply(null, arguments);
};

var _fstatvfs64 = Module["_fstatvfs64"] = function() {
 return (_fstatvfs64 = Module["_fstatvfs64"] = Module["asm"]["fstatvfs64"]).apply(null, arguments);
};

var _fstatfs64 = Module["_fstatfs64"] = function() {
 return (_fstatfs64 = Module["_fstatfs64"] = Module["asm"]["fstatfs64"]).apply(null, arguments);
};

var _stpcpy = Module["_stpcpy"] = function() {
 return (_stpcpy = Module["_stpcpy"] = Module["asm"]["stpcpy"]).apply(null, arguments);
};

var _stpncpy = Module["_stpncpy"] = function() {
 return (_stpncpy = Module["_stpncpy"] = Module["asm"]["stpncpy"]).apply(null, arguments);
};

var ___strcasecmp_l = Module["___strcasecmp_l"] = function() {
 return (___strcasecmp_l = Module["___strcasecmp_l"] = Module["asm"]["__strcasecmp_l"]).apply(null, arguments);
};

var _strcasecmp_l = Module["_strcasecmp_l"] = function() {
 return (_strcasecmp_l = Module["_strcasecmp_l"] = Module["asm"]["strcasecmp_l"]).apply(null, arguments);
};

var _strchrnul = Module["_strchrnul"] = function() {
 return (_strchrnul = Module["_strchrnul"] = Module["asm"]["strchrnul"]).apply(null, arguments);
};

var ___strcoll_l = Module["___strcoll_l"] = function() {
 return (___strcoll_l = Module["___strcoll_l"] = Module["asm"]["__strcoll_l"]).apply(null, arguments);
};

var _strcoll_l = Module["_strcoll_l"] = function() {
 return (_strcoll_l = Module["_strcoll_l"] = Module["asm"]["strcoll_l"]).apply(null, arguments);
};

var ___strerror_l = Module["___strerror_l"] = function() {
 return (___strerror_l = Module["___strerror_l"] = Module["asm"]["__strerror_l"]).apply(null, arguments);
};

var _strerror_l = Module["_strerror_l"] = function() {
 return (_strerror_l = Module["_strerror_l"] = Module["asm"]["strerror_l"]).apply(null, arguments);
};

var ___xpg_strerror_r = Module["___xpg_strerror_r"] = function() {
 return (___xpg_strerror_r = Module["___xpg_strerror_r"] = Module["asm"]["__xpg_strerror_r"]).apply(null, arguments);
};

var ___strncasecmp_l = Module["___strncasecmp_l"] = function() {
 return (___strncasecmp_l = Module["___strncasecmp_l"] = Module["asm"]["__strncasecmp_l"]).apply(null, arguments);
};

var _strncasecmp_l = Module["_strncasecmp_l"] = function() {
 return (_strncasecmp_l = Module["_strncasecmp_l"] = Module["asm"]["strncasecmp_l"]).apply(null, arguments);
};

var _strtof = Module["_strtof"] = function() {
 return (_strtof = Module["_strtof"] = Module["asm"]["strtof"]).apply(null, arguments);
};

var _strtold = Module["_strtold"] = function() {
 return (_strtold = Module["_strtold"] = Module["asm"]["strtold"]).apply(null, arguments);
};

var ___eqtf2 = Module["___eqtf2"] = function() {
 return (___eqtf2 = Module["___eqtf2"] = Module["asm"]["__eqtf2"]).apply(null, arguments);
};

var ___multf3 = Module["___multf3"] = function() {
 return (___multf3 = Module["___multf3"] = Module["asm"]["__multf3"]).apply(null, arguments);
};

var ___divtf3 = Module["___divtf3"] = function() {
 return (___divtf3 = Module["___divtf3"] = Module["asm"]["__divtf3"]).apply(null, arguments);
};

var ___letf2 = Module["___letf2"] = function() {
 return (___letf2 = Module["___letf2"] = Module["asm"]["__letf2"]).apply(null, arguments);
};

var ___netf2 = Module["___netf2"] = function() {
 return (___netf2 = Module["___netf2"] = Module["asm"]["__netf2"]).apply(null, arguments);
};

var _strtoull = Module["_strtoull"] = function() {
 return (_strtoull = Module["_strtoull"] = Module["asm"]["strtoull"]).apply(null, arguments);
};

var _strtoimax = Module["_strtoimax"] = function() {
 return (_strtoimax = Module["_strtoimax"] = Module["asm"]["strtoimax"]).apply(null, arguments);
};

var _strtoumax = Module["_strtoumax"] = function() {
 return (_strtoumax = Module["_strtoumax"] = Module["asm"]["strtoumax"]).apply(null, arguments);
};

var ___strtol_internal = Module["___strtol_internal"] = function() {
 return (___strtol_internal = Module["___strtol_internal"] = Module["asm"]["__strtol_internal"]).apply(null, arguments);
};

var ___strtoul_internal = Module["___strtoul_internal"] = function() {
 return (___strtoul_internal = Module["___strtoul_internal"] = Module["asm"]["__strtoul_internal"]).apply(null, arguments);
};

var ___strtoll_internal = Module["___strtoll_internal"] = function() {
 return (___strtoll_internal = Module["___strtoll_internal"] = Module["asm"]["__strtoll_internal"]).apply(null, arguments);
};

var ___strtoull_internal = Module["___strtoull_internal"] = function() {
 return (___strtoull_internal = Module["___strtoull_internal"] = Module["asm"]["__strtoull_internal"]).apply(null, arguments);
};

var ___strtoimax_internal = Module["___strtoimax_internal"] = function() {
 return (___strtoimax_internal = Module["___strtoimax_internal"] = Module["asm"]["__strtoimax_internal"]).apply(null, arguments);
};

var ___strtoumax_internal = Module["___strtoumax_internal"] = function() {
 return (___strtoumax_internal = Module["___strtoumax_internal"] = Module["asm"]["__strtoumax_internal"]).apply(null, arguments);
};

var _setlogmask = Module["_setlogmask"] = function() {
 return (_setlogmask = Module["_setlogmask"] = Module["asm"]["setlogmask"]).apply(null, arguments);
};

var _vdprintf = Module["_vdprintf"] = function() {
 return (_vdprintf = Module["_vdprintf"] = Module["asm"]["vdprintf"]).apply(null, arguments);
};

var _vsyslog = Module["_vsyslog"] = function() {
 return (_vsyslog = Module["_vsyslog"] = Module["asm"]["vsyslog"]).apply(null, arguments);
};

var ___tolower_l = Module["___tolower_l"] = function() {
 return (___tolower_l = Module["___tolower_l"] = Module["asm"]["__tolower_l"]).apply(null, arguments);
};

var _tolower_l = Module["_tolower_l"] = function() {
 return (_tolower_l = Module["_tolower_l"] = Module["asm"]["tolower_l"]).apply(null, arguments);
};

var ___toupper_l = Module["___toupper_l"] = function() {
 return (___toupper_l = Module["___toupper_l"] = Module["asm"]["__toupper_l"]).apply(null, arguments);
};

var _toupper_l = Module["_toupper_l"] = function() {
 return (_toupper_l = Module["_toupper_l"] = Module["asm"]["toupper_l"]).apply(null, arguments);
};

var ___towupper_l = Module["___towupper_l"] = function() {
 return (___towupper_l = Module["___towupper_l"] = Module["asm"]["__towupper_l"]).apply(null, arguments);
};

var ___towlower_l = Module["___towlower_l"] = function() {
 return (___towlower_l = Module["___towlower_l"] = Module["asm"]["__towlower_l"]).apply(null, arguments);
};

var _towupper_l = Module["_towupper_l"] = function() {
 return (_towupper_l = Module["_towupper_l"] = Module["asm"]["towupper_l"]).apply(null, arguments);
};

var _towlower_l = Module["_towlower_l"] = function() {
 return (_towlower_l = Module["_towlower_l"] = Module["asm"]["towlower_l"]).apply(null, arguments);
};

var _trunc = Module["_trunc"] = function() {
 return (_trunc = Module["_trunc"] = Module["asm"]["trunc"]).apply(null, arguments);
};

var _truncf = Module["_truncf"] = function() {
 return (_truncf = Module["_truncf"] = Module["asm"]["truncf"]).apply(null, arguments);
};

var _truncl = Module["_truncl"] = function() {
 return (_truncl = Module["_truncl"] = Module["asm"]["truncl"]).apply(null, arguments);
};

var _utimensat = Module["_utimensat"] = function() {
 return (_utimensat = Module["_utimensat"] = Module["asm"]["utimensat"]).apply(null, arguments);
};

var ___vfprintf_internal = Module["___vfprintf_internal"] = function() {
 return (___vfprintf_internal = Module["___vfprintf_internal"] = Module["asm"]["__vfprintf_internal"]).apply(null, arguments);
};

var _wctomb = Module["_wctomb"] = function() {
 return (_wctomb = Module["_wctomb"] = Module["asm"]["wctomb"]).apply(null, arguments);
};

var _vfscanf = Module["_vfscanf"] = function() {
 return (_vfscanf = Module["_vfscanf"] = Module["asm"]["vfscanf"]).apply(null, arguments);
};

var ___isoc99_vfscanf = Module["___isoc99_vfscanf"] = function() {
 return (___isoc99_vfscanf = Module["___isoc99_vfscanf"] = Module["asm"]["__isoc99_vfscanf"]).apply(null, arguments);
};

var _vsniprintf = Module["_vsniprintf"] = function() {
 return (_vsniprintf = Module["_vsniprintf"] = Module["asm"]["vsniprintf"]).apply(null, arguments);
};

var ___small_vsnprintf = Module["___small_vsnprintf"] = function() {
 return (___small_vsnprintf = Module["___small_vsnprintf"] = Module["asm"]["__small_vsnprintf"]).apply(null, arguments);
};

var ___isoc99_vsscanf = Module["___isoc99_vsscanf"] = function() {
 return (___isoc99_vsscanf = Module["___isoc99_vsscanf"] = Module["asm"]["__isoc99_vsscanf"]).apply(null, arguments);
};

var _wcrtomb = Module["_wcrtomb"] = function() {
 return (_wcrtomb = Module["_wcrtomb"] = Module["asm"]["wcrtomb"]).apply(null, arguments);
};

var _wcslen = Module["_wcslen"] = function() {
 return (_wcslen = Module["_wcslen"] = Module["asm"]["wcslen"]).apply(null, arguments);
};

var ___libc_calloc = Module["___libc_calloc"] = function() {
 return (___libc_calloc = Module["___libc_calloc"] = Module["asm"]["__libc_calloc"]).apply(null, arguments);
};

var ___libc_realloc = Module["___libc_realloc"] = function() {
 return (___libc_realloc = Module["___libc_realloc"] = Module["asm"]["__libc_realloc"]).apply(null, arguments);
};

var _realloc_in_place = Module["_realloc_in_place"] = function() {
 return (_realloc_in_place = Module["_realloc_in_place"] = Module["asm"]["realloc_in_place"]).apply(null, arguments);
};

var _memalign = Module["_memalign"] = function() {
 return (_memalign = Module["_memalign"] = Module["asm"]["memalign"]).apply(null, arguments);
};

var _posix_memalign = Module["_posix_memalign"] = function() {
 return (_posix_memalign = Module["_posix_memalign"] = Module["asm"]["posix_memalign"]).apply(null, arguments);
};

var _valloc = Module["_valloc"] = function() {
 return (_valloc = Module["_valloc"] = Module["asm"]["valloc"]).apply(null, arguments);
};

var _pvalloc = Module["_pvalloc"] = function() {
 return (_pvalloc = Module["_pvalloc"] = Module["asm"]["pvalloc"]).apply(null, arguments);
};

var _mallinfo = Module["_mallinfo"] = function() {
 return (_mallinfo = Module["_mallinfo"] = Module["asm"]["mallinfo"]).apply(null, arguments);
};

var _mallopt = Module["_mallopt"] = function() {
 return (_mallopt = Module["_mallopt"] = Module["asm"]["mallopt"]).apply(null, arguments);
};

var _malloc_trim = Module["_malloc_trim"] = function() {
 return (_malloc_trim = Module["_malloc_trim"] = Module["asm"]["malloc_trim"]).apply(null, arguments);
};

var _malloc_usable_size = Module["_malloc_usable_size"] = function() {
 return (_malloc_usable_size = Module["_malloc_usable_size"] = Module["asm"]["malloc_usable_size"]).apply(null, arguments);
};

var _malloc_footprint = Module["_malloc_footprint"] = function() {
 return (_malloc_footprint = Module["_malloc_footprint"] = Module["asm"]["malloc_footprint"]).apply(null, arguments);
};

var _malloc_max_footprint = Module["_malloc_max_footprint"] = function() {
 return (_malloc_max_footprint = Module["_malloc_max_footprint"] = Module["asm"]["malloc_max_footprint"]).apply(null, arguments);
};

var _malloc_footprint_limit = Module["_malloc_footprint_limit"] = function() {
 return (_malloc_footprint_limit = Module["_malloc_footprint_limit"] = Module["asm"]["malloc_footprint_limit"]).apply(null, arguments);
};

var _malloc_set_footprint_limit = Module["_malloc_set_footprint_limit"] = function() {
 return (_malloc_set_footprint_limit = Module["_malloc_set_footprint_limit"] = Module["asm"]["malloc_set_footprint_limit"]).apply(null, arguments);
};

var _independent_calloc = Module["_independent_calloc"] = function() {
 return (_independent_calloc = Module["_independent_calloc"] = Module["asm"]["independent_calloc"]).apply(null, arguments);
};

var _independent_comalloc = Module["_independent_comalloc"] = function() {
 return (_independent_comalloc = Module["_independent_comalloc"] = Module["asm"]["independent_comalloc"]).apply(null, arguments);
};

var _bulk_free = Module["_bulk_free"] = function() {
 return (_bulk_free = Module["_bulk_free"] = Module["asm"]["bulk_free"]).apply(null, arguments);
};

var ___addtf3 = Module["___addtf3"] = function() {
 return (___addtf3 = Module["___addtf3"] = Module["asm"]["__addtf3"]).apply(null, arguments);
};

var ___ashlti3 = Module["___ashlti3"] = function() {
 return (___ashlti3 = Module["___ashlti3"] = Module["asm"]["__ashlti3"]).apply(null, arguments);
};

var ___getf2 = Module["___getf2"] = function() {
 return (___getf2 = Module["___getf2"] = Module["asm"]["__getf2"]).apply(null, arguments);
};

var ___unordtf2 = Module["___unordtf2"] = function() {
 return (___unordtf2 = Module["___unordtf2"] = Module["asm"]["__unordtf2"]).apply(null, arguments);
};

var ___lttf2 = Module["___lttf2"] = function() {
 return (___lttf2 = Module["___lttf2"] = Module["asm"]["__lttf2"]).apply(null, arguments);
};

var ___gttf2 = Module["___gttf2"] = function() {
 return (___gttf2 = Module["___gttf2"] = Module["asm"]["__gttf2"]).apply(null, arguments);
};

var ___multi3 = Module["___multi3"] = function() {
 return (___multi3 = Module["___multi3"] = Module["asm"]["__multi3"]).apply(null, arguments);
};

var ___lshrti3 = Module["___lshrti3"] = function() {
 return (___lshrti3 = Module["___lshrti3"] = Module["asm"]["__lshrti3"]).apply(null, arguments);
};

var _setThrew = function() {
 return (_setThrew = Module["asm"]["setThrew"]).apply(null, arguments);
};

var _saveSetjmp = Module["_saveSetjmp"] = function() {
 return (_saveSetjmp = Module["_saveSetjmp"] = Module["asm"]["saveSetjmp"]).apply(null, arguments);
};

var _testSetjmp = Module["_testSetjmp"] = function() {
 return (_testSetjmp = Module["_testSetjmp"] = Module["asm"]["testSetjmp"]).apply(null, arguments);
};

var _emscripten_longjmp = Module["_emscripten_longjmp"] = function() {
 return (_emscripten_longjmp = Module["_emscripten_longjmp"] = Module["asm"]["emscripten_longjmp"]).apply(null, arguments);
};

var setTempRet0 = function() {
 return (setTempRet0 = Module["asm"]["setTempRet0"]).apply(null, arguments);
};

var getTempRet0 = function() {
 return (getTempRet0 = Module["asm"]["getTempRet0"]).apply(null, arguments);
};

var ___extenddftf2 = Module["___extenddftf2"] = function() {
 return (___extenddftf2 = Module["___extenddftf2"] = Module["asm"]["__extenddftf2"]).apply(null, arguments);
};

var ___extendsftf2 = Module["___extendsftf2"] = function() {
 return (___extendsftf2 = Module["___extendsftf2"] = Module["asm"]["__extendsftf2"]).apply(null, arguments);
};

var ___fixtfdi = Module["___fixtfdi"] = function() {
 return (___fixtfdi = Module["___fixtfdi"] = Module["asm"]["__fixtfdi"]).apply(null, arguments);
};

var ___fixtfsi = Module["___fixtfsi"] = function() {
 return (___fixtfsi = Module["___fixtfsi"] = Module["asm"]["__fixtfsi"]).apply(null, arguments);
};

var ___floatsitf = Module["___floatsitf"] = function() {
 return (___floatsitf = Module["___floatsitf"] = Module["asm"]["__floatsitf"]).apply(null, arguments);
};

var ___floatunsitf = Module["___floatunsitf"] = function() {
 return (___floatunsitf = Module["___floatunsitf"] = Module["asm"]["__floatunsitf"]).apply(null, arguments);
};

var ___fe_getround = Module["___fe_getround"] = function() {
 return (___fe_getround = Module["___fe_getround"] = Module["asm"]["__fe_getround"]).apply(null, arguments);
};

var ___fe_raise_inexact = Module["___fe_raise_inexact"] = function() {
 return (___fe_raise_inexact = Module["___fe_raise_inexact"] = Module["asm"]["__fe_raise_inexact"]).apply(null, arguments);
};

var _emscripten_stack_init = Module["_emscripten_stack_init"] = function() {
 return (_emscripten_stack_init = Module["_emscripten_stack_init"] = Module["asm"]["emscripten_stack_init"]).apply(null, arguments);
};

var _emscripten_stack_set_limits = function() {
 return (_emscripten_stack_set_limits = Module["asm"]["emscripten_stack_set_limits"]).apply(null, arguments);
};

var _emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = function() {
 return (_emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
};

var _emscripten_stack_get_base = function() {
 return (_emscripten_stack_get_base = Module["asm"]["emscripten_stack_get_base"]).apply(null, arguments);
};

var _emscripten_stack_get_end = function() {
 return (_emscripten_stack_get_end = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
};

var stackSave = function() {
 return (stackSave = Module["asm"]["stackSave"]).apply(null, arguments);
};

var stackRestore = function() {
 return (stackRestore = Module["asm"]["stackRestore"]).apply(null, arguments);
};

var stackAlloc = function() {
 return (stackAlloc = Module["asm"]["stackAlloc"]).apply(null, arguments);
};

var _emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = function() {
 return (_emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = Module["asm"]["emscripten_stack_get_current"]).apply(null, arguments);
};

var ___subtf3 = Module["___subtf3"] = function() {
 return (___subtf3 = Module["___subtf3"] = Module["asm"]["__subtf3"]).apply(null, arguments);
};

var ___trunctfdf2 = Module["___trunctfdf2"] = function() {
 return (___trunctfdf2 = Module["___trunctfdf2"] = Module["asm"]["__trunctfdf2"]).apply(null, arguments);
};

var ___trunctfsf2 = Module["___trunctfsf2"] = function() {
 return (___trunctfsf2 = Module["___trunctfsf2"] = Module["asm"]["__trunctfsf2"]).apply(null, arguments);
};

var dynCall_vi = Module["dynCall_vi"] = function() {
 return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["dynCall_vi"]).apply(null, arguments);
};

var dynCall_iii = Module["dynCall_iii"] = function() {
 return (dynCall_iii = Module["dynCall_iii"] = Module["asm"]["dynCall_iii"]).apply(null, arguments);
};

var dynCall_ji = Module["dynCall_ji"] = function() {
 return (dynCall_ji = Module["dynCall_ji"] = Module["asm"]["dynCall_ji"]).apply(null, arguments);
};

var dynCall_ii = Module["dynCall_ii"] = function() {
 return (dynCall_ii = Module["dynCall_ii"] = Module["asm"]["dynCall_ii"]).apply(null, arguments);
};

var dynCall_iiii = Module["dynCall_iiii"] = function() {
 return (dynCall_iiii = Module["dynCall_iiii"] = Module["asm"]["dynCall_iiii"]).apply(null, arguments);
};

var dynCall_iiiii = Module["dynCall_iiiii"] = function() {
 return (dynCall_iiiii = Module["dynCall_iiiii"] = Module["asm"]["dynCall_iiiii"]).apply(null, arguments);
};

var dynCall_iiiiii = Module["dynCall_iiiiii"] = function() {
 return (dynCall_iiiiii = Module["dynCall_iiiiii"] = Module["asm"]["dynCall_iiiiii"]).apply(null, arguments);
};

var dynCall_vii = Module["dynCall_vii"] = function() {
 return (dynCall_vii = Module["dynCall_vii"] = Module["asm"]["dynCall_vii"]).apply(null, arguments);
};

var dynCall_iij = Module["dynCall_iij"] = function() {
 return (dynCall_iij = Module["dynCall_iij"] = Module["asm"]["dynCall_iij"]).apply(null, arguments);
};

var dynCall_viii = Module["dynCall_viii"] = function() {
 return (dynCall_viii = Module["dynCall_viii"] = Module["asm"]["dynCall_viii"]).apply(null, arguments);
};

var dynCall_jiijii = Module["dynCall_jiijii"] = function() {
 return (dynCall_jiijii = Module["dynCall_jiijii"] = Module["asm"]["dynCall_jiijii"]).apply(null, arguments);
};

var dynCall_vij = Module["dynCall_vij"] = function() {
 return (dynCall_vij = Module["dynCall_vij"] = Module["asm"]["dynCall_vij"]).apply(null, arguments);
};

var dynCall_viiijii = Module["dynCall_viiijii"] = function() {
 return (dynCall_viiijii = Module["dynCall_viiijii"] = Module["asm"]["dynCall_viiijii"]).apply(null, arguments);
};

var dynCall_v = Module["dynCall_v"] = function() {
 return (dynCall_v = Module["dynCall_v"] = Module["asm"]["dynCall_v"]).apply(null, arguments);
};

var dynCall_i = Module["dynCall_i"] = function() {
 return (dynCall_i = Module["dynCall_i"] = Module["asm"]["dynCall_i"]).apply(null, arguments);
};

var dynCall_viiii = Module["dynCall_viiii"] = function() {
 return (dynCall_viiii = Module["dynCall_viiii"] = Module["asm"]["dynCall_viiii"]).apply(null, arguments);
};

var dynCall_jiji = Module["dynCall_jiji"] = function() {
 return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["dynCall_jiji"]).apply(null, arguments);
};

var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
 return (dynCall_viiiii = Module["dynCall_viiiii"] = Module["asm"]["dynCall_viiiii"]).apply(null, arguments);
};

var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = function() {
 return (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = Module["asm"]["dynCall_iiiiiiii"]).apply(null, arguments);
};

var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function() {
 return (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = Module["asm"]["dynCall_viiiiiiii"]).apply(null, arguments);
};

var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
 return (dynCall_viiiiii = Module["dynCall_viiiiii"] = Module["asm"]["dynCall_viiiiii"]).apply(null, arguments);
};

var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = function() {
 return (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = Module["asm"]["dynCall_iiiiiiiiii"]).apply(null, arguments);
};

var dynCall_iiiiiij = Module["dynCall_iiiiiij"] = function() {
 return (dynCall_iiiiiij = Module["dynCall_iiiiiij"] = Module["asm"]["dynCall_iiiiiij"]).apply(null, arguments);
};

var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() {
 return (dynCall_iiiiiii = Module["dynCall_iiiiiii"] = Module["asm"]["dynCall_iiiiiii"]).apply(null, arguments);
};

var dynCall_jiiiji = Module["dynCall_jiiiji"] = function() {
 return (dynCall_jiiiji = Module["dynCall_jiiiji"] = Module["asm"]["dynCall_jiiiji"]).apply(null, arguments);
};

var dynCall_jiiji = Module["dynCall_jiiji"] = function() {
 return (dynCall_jiiji = Module["dynCall_jiiji"] = Module["asm"]["dynCall_jiiji"]).apply(null, arguments);
};

var dynCall_vidi = Module["dynCall_vidi"] = function() {
 return (dynCall_vidi = Module["dynCall_vidi"] = Module["asm"]["dynCall_vidi"]).apply(null, arguments);
};

var dynCall_iidiiii = Module["dynCall_iidiiii"] = function() {
 return (dynCall_iidiiii = Module["dynCall_iidiiii"] = Module["asm"]["dynCall_iidiiii"]).apply(null, arguments);
};

var dynCall_jj = Module["dynCall_jj"] = function() {
 return (dynCall_jj = Module["dynCall_jj"] = Module["asm"]["dynCall_jj"]).apply(null, arguments);
};

var dynCall_iiij = Module["dynCall_iiij"] = function() {
 return (dynCall_iiij = Module["dynCall_iiij"] = Module["asm"]["dynCall_iiij"]).apply(null, arguments);
};

var dynCall_jiij = Module["dynCall_jiij"] = function() {
 return (dynCall_jiij = Module["dynCall_jiij"] = Module["asm"]["dynCall_jiij"]).apply(null, arguments);
};

var dynCall_iiiji = Module["dynCall_iiiji"] = function() {
 return (dynCall_iiiji = Module["dynCall_iiiji"] = Module["asm"]["dynCall_iiiji"]).apply(null, arguments);
};

var dynCall_jii = Module["dynCall_jii"] = function() {
 return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["dynCall_jii"]).apply(null, arguments);
};

var _asyncify_start_unwind = function() {
 return (_asyncify_start_unwind = Module["asm"]["asyncify_start_unwind"]).apply(null, arguments);
};

var _asyncify_stop_unwind = function() {
 return (_asyncify_stop_unwind = Module["asm"]["asyncify_stop_unwind"]).apply(null, arguments);
};

var _asyncify_start_rewind = function() {
 return (_asyncify_start_rewind = Module["asm"]["asyncify_start_rewind"]).apply(null, arguments);
};

var _asyncify_stop_rewind = function() {
 return (_asyncify_stop_rewind = Module["asm"]["asyncify_stop_rewind"]).apply(null, arguments);
};

var _executor_globals = Module["_executor_globals"] = 1283712;

var _zend_empty_string = Module["_zend_empty_string"] = 1284912;

var _std_object_handlers = Module["_std_object_handlers"] = 1122860;

var _zend_ce_aggregate = Module["_zend_ce_aggregate"] = 1274712;

var _zend_ce_error = Module["_zend_ce_error"] = 1283052;

var _zend_ce_exception = Module["_zend_ce_exception"] = 1278244;

var _zend_string_init_interned = Module["_zend_string_init_interned"] = 1283704;

var _basic_globals = Module["_basic_globals"] = 1269536;

var _pcre_globals = Module["_pcre_globals"] = 1188024;

var _zend_one_char_string = Module["_zend_one_char_string"] = 1274880;

var _sapi_module = Module["_sapi_module"] = 1271116;

var _php_hashcontext_ce = Module["_php_hashcontext_ce"] = 1188240;

var _file_globals = Module["_file_globals"] = 1271408;

var _compiler_globals = Module["_compiler_globals"] = 1284916;

var _zend_known_strings = Module["_zend_known_strings"] = 1282924;

var _zend_ce_value_error = Module["_zend_ce_value_error"] = 1273716;

var _json_globals = Module["_json_globals"] = 1188344;

var _php_json_exception_ce = Module["_php_json_exception_ce"] = 1188356;

var _php_json_serializable_ce = Module["_php_json_serializable_ce"] = 1191120;

var _core_globals = Module["_core_globals"] = 1283240;

var _zend_empty_array = Module["_zend_empty_array"] = 1122420;

var _module_registry = Module["_module_registry"] = 1283192;

var _spl_ce_RuntimeException = Module["_spl_ce_RuntimeException"] = 1191224;

var _zend_observer_fcall_op_array_extension = Module["_zend_observer_fcall_op_array_extension"] = 1283640;

var _zend_standard_class_def = Module["_zend_standard_class_def"] = 1272916;

var _sapi_globals = Module["_sapi_globals"] = 1285264;

var _ps_globals = Module["_ps_globals"] = 1189576;

var _random_ce_Random_BrokenRandomEngineError = Module["_random_ce_Random_BrokenRandomEngineError"] = 1261012;

var _php_random_algo_mt19937 = Module["_php_random_algo_mt19937"] = 808412;

var _random_globals = Module["_random_globals"] = 1189292;

var _php_random_algo_combinedlcg = Module["_php_random_algo_combinedlcg"] = 808224;

var _random_ce_Random_Engine = Module["_random_ce_Random_Engine"] = 1189312;

var _random_ce_Random_CryptoSafeEngine = Module["_random_ce_Random_CryptoSafeEngine"] = 1188772;

var _random_ce_Random_RandomError = Module["_random_ce_Random_RandomError"] = 1188776;

var _random_ce_Random_RandomException = Module["_random_ce_Random_RandomException"] = 1189328;

var _random_ce_Random_Engine_Mt19937 = Module["_random_ce_Random_Engine_Mt19937"] = 1188780;

var _random_ce_Random_Engine_PcgOneseq128XslRr64 = Module["_random_ce_Random_Engine_PcgOneseq128XslRr64"] = 1188884;

var _random_ce_Random_Engine_Xoshiro256StarStar = Module["_random_ce_Random_Engine_Xoshiro256StarStar"] = 1188988;

var _random_ce_Random_Engine_Secure = Module["_random_ce_Random_Engine_Secure"] = 1189316;

var _random_ce_Random_Randomizer = Module["_random_ce_Random_Randomizer"] = 1189320;

var _random_ce_Random_IntervalBoundary = Module["_random_ce_Random_IntervalBoundary"] = 1189324;

var _php_random_algo_pcgoneseq128xslrr64 = Module["_php_random_algo_pcgoneseq128xslrr64"] = 808252;

var _php_random_algo_xoshiro256starstar = Module["_php_random_algo_xoshiro256starstar"] = 808280;

var _php_random_algo_secure = Module["_php_random_algo_secure"] = 808384;

var _php_random_algo_user = Module["_php_random_algo_user"] = 808440;

var _reflection_enum_ptr = Module["_reflection_enum_ptr"] = 1189332;

var _reflection_class_ptr = Module["_reflection_class_ptr"] = 1189336;

var _reflection_exception_ptr = Module["_reflection_exception_ptr"] = 1189340;

var _zend_ce_closure = Module["_zend_ce_closure"] = 1283652;

var _zend_ce_generator = Module["_zend_ce_generator"] = 1283656;

var _zend_ce_traversable = Module["_zend_ce_traversable"] = 1273488;

var _reflection_reference_ptr = Module["_reflection_reference_ptr"] = 1189344;

var _zend_ce_fiber = Module["_zend_ce_fiber"] = 1282944;

var _reflection_ptr = Module["_reflection_ptr"] = 1189468;

var _zend_ce_stringable = Module["_zend_ce_stringable"] = 1282380;

var _reflector_ptr = Module["_reflector_ptr"] = 1189472;

var _reflection_function_abstract_ptr = Module["_reflection_function_abstract_ptr"] = 1189476;

var _reflection_function_ptr = Module["_reflection_function_ptr"] = 1189480;

var _reflection_generator_ptr = Module["_reflection_generator_ptr"] = 1189484;

var _reflection_parameter_ptr = Module["_reflection_parameter_ptr"] = 1189488;

var _reflection_type_ptr = Module["_reflection_type_ptr"] = 1189492;

var _reflection_named_type_ptr = Module["_reflection_named_type_ptr"] = 1189496;

var _reflection_union_type_ptr = Module["_reflection_union_type_ptr"] = 1189500;

var _reflection_intersection_type_ptr = Module["_reflection_intersection_type_ptr"] = 1189504;

var _reflection_method_ptr = Module["_reflection_method_ptr"] = 1189508;

var _reflection_object_ptr = Module["_reflection_object_ptr"] = 1189512;

var _reflection_property_ptr = Module["_reflection_property_ptr"] = 1189516;

var _reflection_class_constant_ptr = Module["_reflection_class_constant_ptr"] = 1189520;

var _reflection_extension_ptr = Module["_reflection_extension_ptr"] = 1189524;

var _reflection_zend_extension_ptr = Module["_reflection_zend_extension_ptr"] = 1189528;

var _reflection_attribute_ptr = Module["_reflection_attribute_ptr"] = 1189532;

var _reflection_enum_unit_case_ptr = Module["_reflection_enum_unit_case_ptr"] = 1189536;

var _reflection_enum_backed_case_ptr = Module["_reflection_enum_backed_case_ptr"] = 1189540;

var _reflection_fiber_ptr = Module["_reflection_fiber_ptr"] = 1189544;

var _php_session_iface_entry = Module["_php_session_iface_entry"] = 1189548;

var _php_session_id_iface_entry = Module["_php_session_id_iface_entry"] = 1189552;

var _php_session_update_timestamp_iface_entry = Module["_php_session_update_timestamp_iface_entry"] = 1189556;

var _php_session_class_entry = Module["_php_session_class_entry"] = 1189560;

var _php_rfc1867_callback = Module["_php_rfc1867_callback"] = 1270932;

var _spl_ce_AppendIterator = Module["_spl_ce_AppendIterator"] = 1189964;

var _spl_ce_ArrayIterator = Module["_spl_ce_ArrayIterator"] = 1190176;

var _spl_ce_ArrayObject = Module["_spl_ce_ArrayObject"] = 1190180;

var _spl_ce_BadFunctionCallException = Module["_spl_ce_BadFunctionCallException"] = 1190628;

var _spl_ce_BadMethodCallException = Module["_spl_ce_BadMethodCallException"] = 1190632;

var _spl_ce_CachingIterator = Module["_spl_ce_CachingIterator"] = 1189944;

var _spl_ce_CallbackFilterIterator = Module["_spl_ce_CallbackFilterIterator"] = 1189916;

var _spl_ce_DirectoryIterator = Module["_spl_ce_DirectoryIterator"] = 1190500;

var _spl_ce_DomainException = Module["_spl_ce_DomainException"] = 1190636;

var _spl_ce_EmptyIterator = Module["_spl_ce_EmptyIterator"] = 1190172;

var _spl_ce_FilesystemIterator = Module["_spl_ce_FilesystemIterator"] = 1190504;

var _spl_ce_FilterIterator = Module["_spl_ce_FilterIterator"] = 1189912;

var _spl_ce_GlobIterator = Module["_spl_ce_GlobIterator"] = 1190616;

var _spl_ce_InfiniteIterator = Module["_spl_ce_InfiniteIterator"] = 1189960;

var _spl_ce_InvalidArgumentException = Module["_spl_ce_InvalidArgumentException"] = 1191112;

var _spl_ce_IteratorIterator = Module["_spl_ce_IteratorIterator"] = 1189952;

var _spl_ce_LengthException = Module["_spl_ce_LengthException"] = 1190640;

var _spl_ce_LimitIterator = Module["_spl_ce_LimitIterator"] = 1189940;

var _spl_ce_LogicException = Module["_spl_ce_LogicException"] = 1190624;

var _spl_ce_MultipleIterator = Module["_spl_ce_MultipleIterator"] = 1190772;

var _spl_ce_NoRewindIterator = Module["_spl_ce_NoRewindIterator"] = 1189956;

var _spl_ce_OuterIterator = Module["_spl_ce_OuterIterator"] = 1189968;

var _spl_ce_OutOfBoundsException = Module["_spl_ce_OutOfBoundsException"] = 1190644;

var _spl_ce_OutOfRangeException = Module["_spl_ce_OutOfRangeException"] = 1190776;

var _spl_ce_OverflowException = Module["_spl_ce_OverflowException"] = 1190648;

var _spl_ce_ParentIterator = Module["_spl_ce_ParentIterator"] = 1189928;

var _spl_ce_RangeException = Module["_spl_ce_RangeException"] = 1190652;

var _spl_ce_RecursiveArrayIterator = Module["_spl_ce_RecursiveArrayIterator"] = 1190384;

var _spl_ce_RecursiveCachingIterator = Module["_spl_ce_RecursiveCachingIterator"] = 1189948;

var _spl_ce_RecursiveCallbackFilterIterator = Module["_spl_ce_RecursiveCallbackFilterIterator"] = 1189920;

var _spl_ce_RecursiveDirectoryIterator = Module["_spl_ce_RecursiveDirectoryIterator"] = 1190512;

var _spl_ce_RecursiveFilterIterator = Module["_spl_ce_RecursiveFilterIterator"] = 1189924;

var _spl_ce_RecursiveIterator = Module["_spl_ce_RecursiveIterator"] = 1190508;

var _spl_ce_RecursiveIteratorIterator = Module["_spl_ce_RecursiveIteratorIterator"] = 1189904;

var _spl_ce_RecursiveRegexIterator = Module["_spl_ce_RecursiveRegexIterator"] = 1189936;

var _spl_ce_RecursiveTreeIterator = Module["_spl_ce_RecursiveTreeIterator"] = 1189908;

var _spl_ce_RegexIterator = Module["_spl_ce_RegexIterator"] = 1189932;

var _spl_ce_SeekableIterator = Module["_spl_ce_SeekableIterator"] = 1190496;

var _spl_ce_SplDoublyLinkedList = Module["_spl_ce_SplDoublyLinkedList"] = 1190784;

var _spl_ce_SplFileInfo = Module["_spl_ce_SplFileInfo"] = 1190392;

var _spl_ce_SplFileObject = Module["_spl_ce_SplFileObject"] = 1190388;

var _spl_ce_SplFixedArray = Module["_spl_ce_SplFixedArray"] = 1191116;

var _spl_ce_SplHeap = Module["_spl_ce_SplHeap"] = 1190896;

var _spl_ce_SplMinHeap = Module["_spl_ce_SplMinHeap"] = 1191004;

var _spl_ce_SplMaxHeap = Module["_spl_ce_SplMaxHeap"] = 1191008;

var _spl_ce_SplObjectStorage = Module["_spl_ce_SplObjectStorage"] = 1190660;

var _spl_ce_SplObserver = Module["_spl_ce_SplObserver"] = 1190664;

var _spl_ce_SplPriorityQueue = Module["_spl_ce_SplPriorityQueue"] = 1190900;

var _spl_ce_SplQueue = Module["_spl_ce_SplQueue"] = 1190888;

var _spl_ce_SplStack = Module["_spl_ce_SplStack"] = 1190892;

var _spl_ce_SplSubject = Module["_spl_ce_SplSubject"] = 1190668;

var _spl_ce_SplTempFileObject = Module["_spl_ce_SplTempFileObject"] = 1190620;

var _spl_ce_UnderflowException = Module["_spl_ce_UnderflowException"] = 1190656;

var _spl_ce_UnexpectedValueException = Module["_spl_ce_UnexpectedValueException"] = 1190780;

var _zend_autoload = Module["_zend_autoload"] = 1271504;

var _zend_compile_file = Module["_zend_compile_file"] = 1282804;

var _zend_ce_iterator = Module["_zend_ce_iterator"] = 1278140;

var _zend_ce_arrayaccess = Module["_zend_ce_arrayaccess"] = 1274704;

var _zend_ce_countable = Module["_zend_ce_countable"] = 1274708;

var _empty_fcall_info_cache = Module["_empty_fcall_info_cache"] = 1096960;

var _zend_ce_serializable = Module["_zend_ce_serializable"] = 1282928;

var _php_glob_stream_ops = Module["_php_glob_stream_ops"] = 1041164;

var _spl_handler_SplObjectStorage = Module["_spl_handler_SplObjectStorage"] = 1190672;

var _empty_fcall_info = Module["_empty_fcall_info"] = 1096912;

var _php_ce_incomplete_class = Module["_php_ce_incomplete_class"] = 1269516;

var _assertion_error_ce = Module["_assertion_error_ce"] = 1269400;

var _php_stream_php_wrapper = Module["_php_stream_php_wrapper"] = 1030520;

var _php_plain_files_wrapper = Module["_php_plain_files_wrapper"] = 1158316;

var _php_glob_stream_wrapper = Module["_php_glob_stream_wrapper"] = 1041244;

var _php_stream_rfc2397_wrapper = Module["_php_stream_rfc2397_wrapper"] = 1040776;

var _php_load_environment_variables = Module["_php_load_environment_variables"] = 1158272;

var _environ = Module["_environ"] = 1298336;

var _php_optidx = Module["_php_optidx"] = 1158284;

var _zend_new_interned_string = Module["_zend_new_interned_string"] = 1283644;

var _php_stream_stdio_ops = Module["_php_stream_stdio_ops"] = 1158328;

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

var _php_ini_opened_path = Module["_php_ini_opened_path"] = 1270804;

var _php_ini_scanned_path = Module["_php_ini_scanned_path"] = 1270808;

var _php_ini_scanned_files = Module["_php_ini_scanned_files"] = 1270812;

var _zend_ce_division_by_zero_error = Module["_zend_ce_division_by_zero_error"] = 1273724;

var _zend_ce_arithmetic_error = Module["_zend_ce_arithmetic_error"] = 1273720;

var _zend_tolower_map = Module["_zend_tolower_map"] = 1098656;

var _zend_toupper_map = Module["_zend_toupper_map"] = 1098912;

var _zend_write = Module["_zend_write"] = 1272968;

var _zend_ce_throwable = Module["_zend_ce_throwable"] = 1282948;

var _php_stream_ftp_wrapper = Module["_php_stream_ftp_wrapper"] = 1030336;

var _php_stream_http_wrapper = Module["_php_stream_http_wrapper"] = 1030392;

var _stdin = Module["_stdin"] = 1142668;

var _stdout = Module["_stdout"] = 1142672;

var _stderr = Module["_stderr"] = 1142664;

var _php_stream_socket_ops = Module["_php_stream_socket_ops"] = 1041020;

var _zend_string_init_existing_interned = Module["_zend_string_init_existing_interned"] = 1274864;

var _zend_resolve_path = Module["_zend_resolve_path"] = 1272920;

var _php_register_internal_extensions_func = Module["_php_register_internal_extensions_func"] = 1158256;

var _php_internal_encoding_changed = Module["_php_internal_encoding_changed"] = 1270796;

var _le_index_ptr = Module["_le_index_ptr"] = 1271692;

var _zend_post_shutdown_cb = Module["_zend_post_shutdown_cb"] = 1271512;

var _php_import_environment_variables = Module["_php_import_environment_variables"] = 1160428;

var _zend_printf = Module["_zend_printf"] = 1272976;

var _in6addr_any = Module["_in6addr_any"] = 1154012;

var _output_globals = Module["_output_globals"] = 1270948;

var _php_stream_memory_ops = Module["_php_stream_memory_ops"] = 1040624;

var _php_stream_temp_ops = Module["_php_stream_temp_ops"] = 1040660;

var _php_stream_userspace_ops = Module["_php_stream_userspace_ops"] = 1040912;

var _php_stream_rfc2397_ops = Module["_php_stream_rfc2397_ops"] = 1040696;

var _php_stream_rfc2397_wops = Module["_php_stream_rfc2397_wops"] = 1040732;

var _php_stream_userspace_dir_ops = Module["_php_stream_userspace_dir_ops"] = 1040948;

var _zend_ce_compile_error = Module["_zend_ce_compile_error"] = 1273596;

var _language_scanner_globals = Module["_language_scanner_globals"] = 1273016;

var _zend_ce_parse_error = Module["_zend_ce_parse_error"] = 1273592;

var _zend_multibyte_encoding_utf32be = Module["_zend_multibyte_encoding_utf32be"] = 1158736;

var _zend_multibyte_encoding_utf32le = Module["_zend_multibyte_encoding_utf32le"] = 1158740;

var _zend_multibyte_encoding_utf16be = Module["_zend_multibyte_encoding_utf16be"] = 1158744;

var _zend_multibyte_encoding_utf16le = Module["_zend_multibyte_encoding_utf16le"] = 1158748;

var _zend_multibyte_encoding_utf8 = Module["_zend_multibyte_encoding_utf8"] = 1158752;

var _zend_ast_process = Module["_zend_ast_process"] = 1282800;

var _ini_scanner_globals = Module["_ini_scanner_globals"] = 1271544;

var _zend_getenv = Module["_zend_getenv"] = 1271532;

var _zend_execute_internal = Module["_zend_execute_internal"] = 1282812;

var _zend_execute_ex = Module["_zend_execute_ex"] = 1282808;

var _zend_compile_string = Module["_zend_compile_string"] = 1272924;

var _zend_observer_function_declared_observed = Module["_zend_observer_function_declared_observed"] = 1282608;

var _zend_observer_class_linked_observed = Module["_zend_observer_class_linked_observed"] = 1282609;

var _zend_extensions = Module["_zend_extensions"] = 1272928;

var _zend_interrupt_function = Module["_zend_interrupt_function"] = 1272912;

var _zend_on_timeout = Module["_zend_on_timeout"] = 1271528;

var _zend_op_array_extension_handles = Module["_zend_op_array_extension_handles"] = 1283648;

var _zend_extension_flags = Module["_zend_extension_flags"] = 1271640;

var _zend_post_startup_cb = Module["_zend_post_startup_cb"] = 1271508;

var _zend_error_cb = Module["_zend_error_cb"] = 1274372;

var _zend_fopen = Module["_zend_fopen"] = 1273160;

var _zend_stream_open_function = Module["_zend_stream_open_function"] = 1273156;

var _zend_ticks_function = Module["_zend_ticks_function"] = 1272956;

var _zend_throw_exception_hook = Module["_zend_throw_exception_hook"] = 1273600;

var _gc_collect_cycles = Module["_gc_collect_cycles"] = 1274496;

var _zend_uv = Module["_zend_uv"] = 1272972;

var _zend_ce_type_error = Module["_zend_ce_type_error"] = 1273604;

var _zend_ce_argument_count_error = Module["_zend_ce_argument_count_error"] = 1273608;

var _zend_dtrace_enabled = Module["_zend_dtrace_enabled"] = 1271616;

var _zend_signal_globals = Module["_zend_signal_globals"] = 1275904;

var _zend_observer_errors_observed = Module["_zend_observer_errors_observed"] = 1282610;

var _zend_ce_sensitive_parameter_value = Module["_zend_ce_sensitive_parameter_value"] = 1271696;

var _zend_ce_attribute = Module["_zend_ce_attribute"] = 1271700;

var _zend_ce_return_type_will_change_attribute = Module["_zend_ce_return_type_will_change_attribute"] = 1271748;

var _zend_ce_allow_dynamic_properties = Module["_zend_ce_allow_dynamic_properties"] = 1271752;

var _zend_ce_sensitive_parameter = Module["_zend_ce_sensitive_parameter"] = 1271756;

var _zend_ce_override = Module["_zend_ce_override"] = 1271860;

var _zend_pass_function = Module["_zend_pass_function"] = 1103136;

var _zend_ce_unhandled_match_error = Module["_zend_ce_unhandled_match_error"] = 1273728;

var _zend_touch_vm_stack_data = Module["_zend_touch_vm_stack_data"] = 1271864;

var _zend_ce_internal_iterator = Module["_zend_ce_internal_iterator"] = 1273484;

var _zend_ce_error_exception = Module["_zend_ce_error_exception"] = 1273712;

var _zend_ce_weakref = Module["_zend_ce_weakref"] = 1274600;

var _zend_ce_ClosedGeneratorException = Module["_zend_ce_ClosedGeneratorException"] = 1278136;

var _zend_inheritance_cache_get = Module["_zend_inheritance_cache_get"] = 1282372;

var _zend_inheritance_cache_add = Module["_zend_inheritance_cache_add"] = 1282376;

var ___jit_debug_descriptor = Module["___jit_debug_descriptor"] = 1158828;

var _zend_system_id = Module["_zend_system_id"] = 1282768;

var _zend_ce_unit_enum = Module["_zend_ce_unit_enum"] = 1282816;

var _zend_ce_backed_enum = Module["_zend_ce_backed_enum"] = 1282820;

var _zend_enum_object_handlers = Module["_zend_enum_object_handlers"] = 1282824;

var _zend_func_info_rid = Module["_zend_func_info_rid"] = 1158992;

var _php_embed_module = Module["_php_embed_module"] = 1160284;

var _zip_algorithm_deflate_compress = Module["_zip_algorithm_deflate_compress"] = 1160432;

var _zip_algorithm_deflate_decompress = Module["_zip_algorithm_deflate_decompress"] = 1160472;

var __zip_err_str_count = Module["__zip_err_str_count"] = 1133432;

var __zip_err_str = Module["__zip_err_str"] = 1133152;

var __zip_err_details_count = Module["__zip_err_details_count"] = 1133600;

var __zip_err_details = Module["__zip_err_details"] = 1133440;

var ___environ = Module["___environ"] = 1298336;

var ____environ = Module["____environ"] = 1298336;

var __environ = Module["__environ"] = 1298336;

var _timezone = Module["_timezone"] = 1298320;

var _daylight = Module["_daylight"] = 1298324;

var _tzname = Module["_tzname"] = 1298328;

var ___sig_pending = Module["___sig_pending"] = 1286644;

var ___sig_actions = Module["___sig_actions"] = 1287056;

var ___THREW__ = Module["___THREW__"] = 1187524;

var ___threwValue = Module["___threwValue"] = 1187528;

var ___start_em_js = Module["___start_em_js"] = 1161080;

var ___stop_em_js = Module["___stop_em_js"] = 1162767;

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
 exports["emscripten_stack_get_base"] = makeWrapper_p(exports["emscripten_stack_get_base"]);
 exports["emscripten_stack_get_end"] = makeWrapper_p(exports["emscripten_stack_get_end"]);
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
  setTimeout((function() {
   setTimeout((function() {
    Module["setStatus"]("");
   }), 1);
   doRun();
  }), 1);
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