
var PHP = (() => {
  const importMeta = import.meta;var _scriptName = importMeta.url;

  return (
function(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;

var readyPromise = new Promise((resolve, reject) => {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
var ENVIRONMENT_IS_WEB = false;

var ENVIRONMENT_IS_WORKER = true;

var ENVIRONMENT_IS_NODE = false;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: /src/.cache/pre.js
Module.preRun = Module.preRun || [];

if (typeof Module.preRun == "function") Module.preRun = [ Module.preRun ];

Module.preRun.push(() => Object.assign(ENV, Module.ENV || {}));

// end include: /src/.cache/pre.js
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";

function locateFile(path, defaultPath = null) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory) ?? defaultPath ?? scriptDirectory + path;
  }
  return defaultPath ?? scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) {
    // Check worker, not web, since window could be polyfilled
    scriptDirectory = "/";
  } else if (typeof document != "undefined" && document.currentScript) {
    // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptName) {
    scriptDirectory = _scriptName;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.startsWith("blob:")) {
    scriptDirectory = "";
  } else {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
  }
  {
    // include: web_or_worker_shell_read.js
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
      };
    }
    readAsync = url => fetch(url, {
      credentials: "same-origin"
    }).then(response => {
      if (response.ok) {
        return response.arrayBuffer();
      }
      return Promise.reject(new Error(response.status + " : " + response.url));
    });
  }
} else // end include: web_or_worker_shell_read.js
{}

var out = Module["print"] || console.log.bind(console);

var err = Module["printErr"] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);

// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.
if (Module["arguments"]) arguments_ = Module["arguments"];

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary = Module["wasmBinary"];

// include: base64Utils.js
// Converts a string of base64 into a byte array (Uint8Array).
function intArrayFromBase64(s) {
  var decoded = atob(s);
  var bytes = new Uint8Array(decoded.length);
  for (var i = 0; i < decoded.length; ++i) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

// end include: base64Utils.js
// Wasm globals
var wasmMemory, wasmExports = {};

//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */ function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implementation here for now.
    abort(text);
  }
}

// Memory management
var /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /** @type {!Float64Array} */ HEAPF64;

// include: runtime_shared.js
function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module["HEAP8"] = HEAP8 = new Int8Array(b);
  Module["HEAP16"] = HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
}

// end include: runtime_shared.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
var __ATPRERUN__ = [];

// functions called before the runtime is initialized
var __ATINIT__ = [];

// functions called during startup
var __ATMAIN__ = [];

// functions called when main() is to be run
var __ATEXIT__ = [];

// functions called during shutdown
var __ATPOSTRUN__ = [];

// functions called after the main() is called
var runtimeInitialized = false;

var runtimeExited = false;

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
  if (!Module["noFSInit"] && !FS.initialized) FS.init();
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
  // Native atexit() functions
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

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

// overridden to take different actions when all run dependencies are fulfilled
function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
}

function removeRunDependency(id) {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
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

/** @param {string|number=} what */ function abort(what) {
  Module["onAbort"]?.(what);
  what = "Aborted(" + what + ")";
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = "data:application/octet-stream;base64,";

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */ var isDataURI = filename => filename.startsWith(dataURIPrefix);

// end include: URIUtils.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
function findWasmBinary() {
  if (Module["locateFile"]) {
    var f = "php-worker.mjs.wasm";
    if (!isDataURI(f)) {
      return locateFile(f, new URL("php-worker.mjs.wasm", import.meta.url).href);
    }
    return f;
  }
  // Use bundler-friendly `new URL(..., import.meta.url)` pattern; works in browsers too.
  return new URL("php-worker.mjs.wasm", import.meta.url).href;
}

var wasmBinaryFile;

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
  // If we don't have the binary yet, try to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == "function") {
      return fetch(binaryFile, {
        credentials: "same-origin"
      }).then(response => {
        if (!response["ok"]) {
          throw `failed to load wasm binary file at '${binaryFile}'`;
        }
        return response["arrayBuffer"]();
      }).catch(() => getBinarySync(binaryFile));
    }
    // Fetch the binary using readAsync
    return readAsync(binaryFile).then(response => new Uint8Array(/** @type{!ArrayBuffer} */ (response)), // Fall back to getBinarySync if readAsync fails
    () => getBinarySync(binaryFile));
  }
  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(receiver, reason => {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    abort(reason);
  });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && typeof fetch == "function") {
    return fetch(binaryFile, {
      credentials: "same-origin"
    }).then(response => {
      // Suppress closure warning here since the upstream definition for
      // instantiateStreaming only allows Promise<Repsponse> rather than
      // an actual Response.
      // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
      /** @suppress {checkTypes} */ var result = WebAssembly.instantiateStreaming(response, imports);
      return result.then(callback, function(reason) {
        // We expect the most common failure cause to be a bad MIME type for the binary,
        // in which case falling back to ArrayBuffer instantiation should work.
        err(`wasm streaming compile failed: ${reason}`);
        err("falling back to ArrayBuffer instantiation");
        return instantiateArrayBuffer(binaryFile, imports, callback);
      });
    });
  }
  return instantiateArrayBuffer(binaryFile, imports, callback);
}

function getWasmImports() {
  // prepare imports
  return {
    "env": wasmImports,
    "wasi_snapshot_preview1": wasmImports
  };
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  var info = getWasmImports();
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    wasmExports = Asyncify.instrumentWasmExports(wasmExports);
    wasmExports = applySignatureConversions(wasmExports);
    wasmMemory = wasmExports["memory"];
    updateMemoryViews();
    wasmTable = wasmExports["__indirect_function_table"];
    addOnInit(wasmExports["__wasm_call_ctors"]);
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency("wasm-instantiate");
  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    receiveInstance(result["instance"]);
  }
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module["instantiateWasm"]) {
    try {
      return Module["instantiateWasm"](info, receiveInstance);
    } catch (e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
      // If instantiation fails, reject the module ready promise.
      readyPromiseReject(e);
    }
  }
  wasmBinaryFile ??= findWasmBinary();
  // If instantiation fails, reject the module ready promise.
  instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
  return {};
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;

var tempI64;

// include: runtime_debug.js
// end include: runtime_debug.js
// === Body ===
var ASM_CONSTS = {
  1165330: () => typeof Module.cfd1 === "object" && Object.keys(Module.cfd1).length,
  1165408: $0 => {
    const results = Module.targets.get($0);
    if (results) {
      return results.length;
    }
    return 0;
  },
  1165501: $0 => {
    const results = Module.targets.get($0);
    if (results.length) {
      return Object.keys(results[0]).length;
    }
    return 0;
  },
  1165617: ($0, $1) => {
    const targetId = $0;
    const target = Module.targets.get(targetId);
    const current = $1;
    if (current >= target.length) {
      return false;
    }
    return true;
  },
  1165767: ($0, $1) => {
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
  1166005: ($0, $1, $2, $3) => {
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
  1166258: ($0, $1) => {
    const statement = Module.targets.get($0);
    const paramVal = Module.zvalToJS($1);
    if (!Module.PdoParams.has(statement)) {
      Module.PdoParams.set(statement, []);
    }
    const paramList = Module.PdoParams.get(statement);
    paramList.push(paramVal);
  },
  1166497: ($0, $1, $2) => {
    console.log("GET ATTR", $0, $1, $2);
  },
  1166538: ($0, $1, $2) => {
    console.log("COL META", $0, $1, $2);
  },
  1166579: ($0, $1, $2) => {
    console.log("CLOSE", $0, $1, $2);
  },
  1166617: $0 => {
    if (typeof Module.cfd1 !== "object") {
      throw new Error("The `cfd1` object must be provided as a constructor arg to PHP to use pdo_cfd1.");
    }
    const dbName = UTF8ToString($0);
    if (typeof Module.cfd1[dbName] !== "object") {
      throw new Error(`The value provided at cfd1[${dbName}] does not exist or is not an object.`);
    }
  },
  1166936: $0 => {
    console.log("CLOSE", $0);
  },
  1166966: ($0, $1, $2) => {
    const dbName = UTF8ToString($0);
    const query = UTF8ToString($1);
    const zv = $2;
    const prepared = Module.cfd1[dbName].prepare(query);
    Module.jsToZval(prepared, zv);
  },
  1167134: () => {
    console.log("BEGIN TXN");
    return true;
  },
  1167177: $0 => {
    console.log("COMMIT TXN", $0);
    return true;
  },
  1167225: $0 => {
    console.log("ROLLBACK TXN", $0);
    return true;
  },
  1167275: ($0, $1, $2) => {
    console.log("SET ATTR", $1, $2);
    return true;
  },
  1167325: $0 => {
    console.log("LAST INSERT ID", UTF8ToString($0));
    return 0;
  },
  1167388: ($0, $1) => {
    console.log("FETCH ERROR FUNC", $0, $1);
  },
  1167433: ($0, $1) => {
    console.log("GET ATTR", $0, $1);
    return 0;
  },
  1167480: () => {
    console.log("SHUTDOWN");
  },
  1167509: $0 => {
    console.log("GET GC", $0);
  },
  1167540: () => !!Module.PGlite,
  1167567: $0 => {
    const statement = Module.targets.get($0);
    Module.PdoParams.delete(statement);
  },
  1167649: $0 => {
    const results = Module.targets.get($0);
    if (results) return results.length;
    return 0;
  },
  1167738: $0 => {
    const results = Module.targets.get($0);
    if (results.length) return Object.keys(results[0]).length;
    return 0;
  },
  1167850: ($0, $1) => {
    const targetId = $0;
    const target = Module.targets.get(targetId);
    const current = $1;
    if (current >= target.length) {
      return false;
    }
    return true;
  },
  1168e3: ($0, $1) => {
    const results = Module.targets.get($0);
    if (results.length) {
      const str = Object.keys(results[0])[$1];
      const len = lengthBytesUTF8(str) + 1;
      const loc = _malloc(len);
      stringToUTF8(str, loc, len);
      return loc;
    }
    return 0;
  },
  1168223: ($0, $1, $2, $3) => {
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
  1168476: ($0, $1, $2) => {
    const stmtTgtId = $0;
    const paramPtr = $1;
    const paramPos = $2;
    const statement = Module.targets.get(stmtTgtId);
    const paramVal = Module.zvalToJS(paramPtr);
    if (!Module.PdoParams.has(statement)) {
      Module.PdoParams.set(statement, []);
    }
    const paramList = Module.PdoParams.get(statement);
    paramList[paramPos] = paramVal;
  },
  1168798: ($0, $1, $2) => {
    console.log("GET ATTR", $0, $1, $2);
  },
  1168839: ($0, $1, $2) => {
    console.log("COL META", $0, $1, $2);
  },
  1168880: ($0, $1, $2) => {
    console.log("CLOSE", $0, $1, $2);
  },
  1168918: ($0, $1, $2, $3) => {
    const db = Module.zvalToJS($0);
    const query = UTF8ToString($1);
    const zv = $3;
    const prepared = (...params) => db.query(query, params);
    prepared.query = query;
    Module.jsToZval(prepared, zv);
  },
  1169147: () => 1,
  1169161: ($0, $1, $2) => {
    console.log("SET ATTR", $0, $1, $2);
    return true;
  },
  1169215: ($0, $1, $2) => {
    console.log("GET ATTR", $0, $1, $2);
    return 1;
  },
  1169266: $0 => {
    console.log("SHUTDOWN", $0);
  },
  1169299: ($0, $1) => {
    console.log("GET GC", $0, $1);
  },
  1169334: $0 => {
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
  1169958: ($0, $1, $2) => {
    const target = Module.targets.get($0);
    const property = UTF8ToString($1);
    const rv = $2;
    if (!(property in target)) {
      return Module.jsToZval(undefined, rv);
    }
    Module.jsToZval(target[property], rv);
  },
  1170159: ($0, $1, $2, $3, $4) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      const funcPtr = $2;
      target[property] = Module.callableToJs(funcPtr);
    })();
  },
  1170362: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      const zvalPtr = $2;
      if (!Module.targets.has(target[property])) {
        target[property] = Module.marshalObject(zvalPtr);
      }
    })();
  },
  1170569: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      delete target[property];
    })();
  },
  1170685: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      target[property] = null;
    })();
  },
  1170801: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      target[property] = false;
    })();
  },
  1170918: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      target[property] = true;
    })();
  },
  1171034: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      target[property] = $2;
    })();
  },
  1171148: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      target[property] = $2;
    })();
  },
  1171262: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      const newValue = UTF8ToString($2);
      target[property] = newValue;
    })();
  },
  1171417: ($0, $1, $2) => {
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
  1171774: ($0, $1, $2, $3) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      const funcPtr = $2;
      target[property] = Module.callableToJs(funcPtr);
    })();
  },
  1171941: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      const zvalPtr = $2;
      if (!Module.targets.has(target[property])) {
        target[property] = Module.marshalObject(zvalPtr);
      }
    })();
  },
  1172134: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      delete target[property];
    })();
  },
  1172236: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      target[property] = null;
    })();
  },
  1172338: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      target[property] = false;
    })();
  },
  1172441: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      target[property] = true;
    })();
  },
  1172543: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      target[property] = $2;
    })();
  },
  1172643: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      target[property] = $2;
    })();
  },
  1172743: ($0, $1, $2) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      const newValue = UTF8ToString($2);
      target[property] = newValue;
    })();
  },
  1172884: ($0, $1, $2) => {
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
  1173388: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = UTF8ToString($1);
      delete target[property];
    })();
  },
  1173504: ($0, $1) => {
    (() => {
      const target = Module.targets.get($0);
      const property = $1;
      delete target[property];
    })();
  },
  1173606: $0 => {
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
  1173943: ($0, $1) => {
    const target = Module.targets.get($0);
    const property = UTF8ToString($1);
    return property in target;
  },
  1174048: ($0, $1, $2) => {
    const target = Module.targets.get($0);
    const property_name = UTF8ToString($1);
    const rv = $2;
    return Module.jsToZval(target[property_name], rv);
  },
  1174197: ($0, $1, $2, $3, $4, $5) => {
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
  1174564: ($0, $1, $2, $3, $4) => {
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
  1174814: ($0, $1, $2, $3) => {
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
  1175127: $0 => {
    const target = Module.targets.get($0);
    Module.tacked.delete(target);
    Module.targets.remove(target);
  },
  1175231: $0 => {
    const target = Module.targets.get($0);
    const str = String(target);
    const len = 1 + lengthBytesUTF8(str);
    const loc = _malloc(len);
    stringToUTF8(str, loc, len);
    return loc;
  },
  1175407: () => {
    const context = {};
    Module.tacked.add(context);
    return Module.targets.add(context);
  },
  1175495: ($0, $1) => {
    const context = Module.targets.get($0);
    const method = UTF8ToString($1);
    context.method = method;
  },
  1175601: ($0, $1) => {
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
  1175931: ($0, $1) => {
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
  1176354: ($0, $1, $2) => {
    (() => {
      const context = Module.targets.get($0);
      context.body = Module.HEAPU8.slice($1, $1 + $2);
    })();
  },
  1176461: ($0, $1) => {
    const context = Module.targets.get($0);
    context.ignoreErrors = $1;
  },
  1176536: $0 => {
    const {status} = Module.targets.get($0);
    return status;
  },
  1176600: $0 => {
    const str = String(eval(UTF8ToString($0)));
    const len = lengthBytesUTF8(str) + 1;
    const loc = _malloc(len);
    stringToUTF8(str, loc, len);
    return loc;
  },
  1176753: ($0, $1) => {
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
  1177049: ($0, $1) => {
    const timeout = Number(UTF8ToString($0));
    const funcPtr = $1;
    setTimeout(() => {
      Module.ccall("vrzno_exec_callback", "number", [ "number", "number", "number", "number" ], [ funcPtr, null, 0, 0 ]);
      Module.ccall("vrzno_del_callback", "number", [ "number" ], [ funcPtr ]);
    }, timeout);
  },
  1177333: ($0, $1) => {
    const name = UTF8ToString($0);
    const rv = $1;
    Module.jsToZval(Module[name], rv);
  },
  1177418: ($0, $1) => {
    const name = UTF8ToString($0);
    const rv = $1;
    Module.jsToZval(Module.shared[name], rv);
  },
  1177510: ($0, $1) => {
    const name = UTF8ToString($0);
    const rv = $1;
    Module.jsToZval(import(/* webpackIgnore: true */ name), rv);
  },
  1177595: () => {
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
    Module.pending = new Set;
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
    Module.WeakerMap = Module.WeakerMap || (((class WeakerMap {
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
    })));
    Module.marshalObject = ((zv, type) => {
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
                    done,
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
    });
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
    Module.UniqueIndex = Module.UniqueIndex || (((class UniqueIndex {
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
    })));
    Module.classes = Module.classes || new WeakMap;
    Module._classes = Module._classes || new Module.WeakerMap;
    Module.callables = Module.callables || new Module.WeakerMap;
    Module.targets = Module.targets || new Module.UniqueIndex;
    Module.targets.add(globalThis);
    Module.PdoParams = new WeakMap;
  },
  1189560: $0 => {
    const target = Module.targets.get($0);
    return Module.classes.get(target);
  },
  1189638: ($0, $1) => {
    const target = Module.targets.get($0);
    Module.classes.set(target, $1);
    Module._classes.set($1, target);
  },
  1189746: ($0, $1, $2, $3) => {
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
  1190138: $0 => {
    const parsed = Module.targets.get($0);
    Module.tacked.delete(parsed);
  },
  1190211: $0 => {
    const _class = Module._classes.get($0);
    if (_class) {
      return Module.targets.getId(_class);
    }
    return Module.targets.add(globalThis);
  },
  1190346: ($0, $1) => {
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
  1190709: ($0, $1, $2) => {
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
  1191004: $0 => {
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

function __asyncjs__pdo_pglite_real_stmt_execute(targetId, error, rv) {
  return Asyncify.handleAsync(async () => {
    const statement = Module.targets.get(targetId);
    if (!Module.PdoParams.has(statement)) {
      Module.PdoParams.set(statement, []);
    }
    const params = Module.PdoParams.get(statement);
    try {
      const result = await statement(...params);
      const rows = result.rows ?? [];
      const _fields = result.fields ?? [];
      const fields = new Map;
      _fields.forEach(field => {
        fields.set(field.name, field);
      });
      const utf8decoder = new TextDecoder;
      const mapped = rows.map(row => {
        const _row = {};
        for (const [key, val] of Object.entries(row)) {
          if (fields.has(key) && fields.get(key).dataTypeID === 17) {
            _row[key] = utf8decoder.decode(val);
            continue;
          }
          _row[key] = val;
        }
        return _row;
      });
      Module.jsToZval(mapped, rv);
      return 1;
    } catch (exception) {
      const message = String(exception.message);
      const len = lengthBytesUTF8(message) + 1;
      const loc = _malloc(len);
      console.error(message, statement.query, exception);
      stringToUTF8(message, loc, len);
      setValue(error, loc, "*");
      return 0;
    }
  });
}

function __asyncjs__pdo_pglite_real_handle_begin(handle) {
  return Asyncify.handleAsync(async () => {
    const db = Module.targets.get(handle);
    await db.query("BEGIN");
  });
}

function __asyncjs__pdo_pglite_real_handle_commit(handle) {
  return Asyncify.handleAsync(async () => {
    const db = Module.targets.get(handle);
    await db.query("COMMIT");
  });
}

function __asyncjs__pdo_pglite_real_handle_rollback(handle) {
  return Asyncify.handleAsync(async () => {
    const db = Module.targets.get(handle);
    await db.query("ROLLBACK");
  });
}

function __asyncjs__pdo_pglite_real_last_insert_id(handle, namePtr) {
  return Asyncify.handleAsync(async () => {
    const db = Module.targets.get(handle);
    if (namePtr) {
      const name = UTF8ToString(namePtr);
      console.log("LAST INSERT ID", $0, name);
      const result = await db.query("SELECT CURRVAL($1)", name);
      console.log(result);
    } else {
      console.log("LAST INSERT ID", $0);
      const result = await db.query("SELECT CURRVAL($1)", name);
      console.log(result);
    }
    return 0;
  });
}

function __asyncjs__pdo_pglite_real_db_handle_factory(connectionStringPrt, dbZv) {
  return Asyncify.handleAsync(async () => {
    if (!Module.PGlite) {
      throw new Error("The PGlite class must be provided as a constructor arg to PHP to use PGlite.");
    }
    const connectionString = UTF8ToString(connectionStringPrt);
    const pglite = new Module.PGlite(connectionString ? ("idb://" + connectionString) : undefined);
    return Module.jsToZval(pglite, dbZv);
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
      setValue(headersloc + (i * ptrsize), loc, "i" + (8 * ptrsize));
      i++;
    }
    const parsed = {
      status,
      buffer,
      context
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

// end include: preamble.js
/** @constructor */ function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = `Program terminated with exit(${status})`;
  this.status = status;
}

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

/**
     * @param {number} ptr
     * @param {string} type
     */ function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return HEAP8[ptr >>> 0];

   case "i8":
    return HEAP8[ptr >>> 0];

   case "i16":
    return HEAP16[((ptr) >>> 1) >>> 0];

   case "i32":
    return HEAP32[((ptr) >>> 2) >>> 0];

   case "i64":
    abort("to do getValue(i64) use WASM_BIGINT");

   case "float":
    return HEAPF32[((ptr) >>> 2) >>> 0];

   case "double":
    return HEAPF64[((ptr) >>> 3) >>> 0];

   case "*":
    return HEAPU32[((ptr) >>> 2) >>> 0];

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var noExitRuntime = Module["noExitRuntime"] || false;

/**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */ function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    HEAP8[ptr >>> 0] = value;
    break;

   case "i8":
    HEAP8[ptr >>> 0] = value;
    break;

   case "i16":
    HEAP16[((ptr) >>> 1) >>> 0] = value;
    break;

   case "i32":
    HEAP32[((ptr) >>> 2) >>> 0] = value;
    break;

   case "i64":
    abort("to do setValue(i64) use WASM_BIGINT");

   case "float":
    HEAPF32[((ptr) >>> 2) >>> 0] = value;
    break;

   case "double":
    HEAPF64[((ptr) >>> 3) >>> 0] = value;
    break;

   case "*":
    HEAPU32[((ptr) >>> 2) >>> 0] = value;
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

var stackRestore = val => __emscripten_stack_restore(val);

var stackSave = () => _emscripten_stack_get_current();

var convertI32PairToI53Checked = (lo, hi) => ((hi + 2097152) >>> 0 < 4194305 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;

var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;

/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */ var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
  idx >>>= 0;
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.  Also, use the length info to avoid running tiny
  // strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation,
  // so that undefined means Infinity)
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = "";
  // If building with TextDecoder, we have already computed the string length
  // above, so test loop end condition against that
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

/**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */ var UTF8ToString = (ptr, maxBytesToRead) => {
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
  return (a1 => dynCall_vi(fp, a1))(sig);
};

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
    // if the path tries to go above the root, `up` ends up > 0
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
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (;up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
    // Normalize the path
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
      // No dirname whatsoever
      return ".";
    }
    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
  },
  basename: path => {
    // EMSCRIPTEN return '/'' for '/', not an empty string
    if (path === "/") return "/";
    path = PATH.normalize(path);
    path = path.replace(/\/$/, "");
    var lastSlash = path.lastIndexOf("/");
    if (lastSlash === -1) return path;
    return path.substr(lastSlash + 1);
  },
  join: (...paths) => PATH.normalize(paths.join("/")),
  join2: (l, r) => PATH.normalize(l + "/" + r)
};

var initRandomFill = () => {
  if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
    // for modern web browsers
    return view => crypto.getRandomValues(view);
  } else // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
  abort("initRandomDevice");
};

var randomFill = view => (randomFill = initRandomFill())(view);

var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? args[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      // an invalid portion invalidates the whole thing
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
    return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
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
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i);
    // possibly a lead surrogate
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
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i);
    // possibly a lead surrogate
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = 65536 + ((u & 1023) << 10) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++ >>> 0] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++ >>> 0] = 192 | (u >> 6);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++ >>> 0] = 224 | (u >> 12);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++ >>> 0] = 240 | (u >> 18);
      heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx >>> 0] = 0;
  return outIdx - startIdx;
};

/** @type {function(string, boolean=, number=)} */ function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    {}
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};

var TTY = {
  ttys: [],
  init() {},
  // https://github.com/emscripten-core/emscripten/pull/1555
  // if (ENVIRONMENT_IS_NODE) {
  //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
  //   // device, it always assumes it's a TTY device. because of this, we're forcing
  //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
  //   // with text files until FS.init can be refactored.
  //   process.stdin.setEncoding('utf8');
  // }
  shutdown() {},
  // https://github.com/emscripten-core/emscripten/pull/1555
  // if (ENVIRONMENT_IS_NODE) {
  //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
  //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
  //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
  //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
  //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
  //   process.stdin.pause();
  // }
  register(dev, ops) {
    TTY.ttys[dev] = {
      input: [],
      output: [],
      ops
    };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close(stream) {
      // flush any pending line data
      stream.tty.ops.fsync(stream.tty);
    },
    fsync(stream) {
      stream.tty.ops.fsync(stream.tty);
    },
    read(stream, buffer, offset, length, pos) {
      /* ignored */ if (!stream.tty || !stream.tty.ops.get_char) {
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
    write(stream, buffer, offset, length, pos) {
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
    get_char(tty) {
      return FS_stdin_getChar();
    },
    put_char(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    // val == 0 would cut text output off in the middle.
    fsync(tty) {
      if (tty.output && tty.output.length > 0) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    },
    ioctl_tcgets(tty) {
      // typical setting
      return {
        c_iflag: 25856,
        c_oflag: 5,
        c_cflag: 191,
        c_lflag: 35387,
        c_cc: [ 3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      };
    },
    ioctl_tcsets(tty, optional_actions, data) {
      // currently just ignore
      return 0;
    },
    ioctl_tiocgwinsz(tty) {
      return [ 24, 80 ];
    }
  },
  default_tty1_ops: {
    put_char(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
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
    return MEMFS.createNode(null, "/", 16384 | 511, /* 0777 */ 0);
  },
  createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      // no supported
      throw new FS.ErrnoError(63);
    }
    MEMFS.ops_table ||= {
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
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
      // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
      // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
      // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
      // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.timestamp = Date.now();
    // add the new node to the parent
    if (parent) {
      parent.contents[name] = node;
      parent.timestamp = node.timestamp;
    }
    return node;
  },
  getFileDataAsTypedArray(node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
    // Make sure to not return excess unused bytes.
    return new Uint8Array(node.contents);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
    // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
    // avoid overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
    // At minimum allocate 256b for each file when expanding.
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
    // Allocate new storage.
    if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
  },
  // Copy old data over to the new storage.
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
      // Fully decommit when requesting a resize to zero.
      node.usedBytes = 0;
    } else {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
      // Allocate new storage.
      if (oldContents) {
        node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
      }
      // Copy old data over to the new storage.
      node.usedBytes = newSize;
    }
  },
  node_ops: {
    getattr(node) {
      var attr = {};
      // device numbers reuse inode numbers.
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
      // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
      //       but this is not required by the standard.
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
      // if we're overwriting a directory at new_name, make sure it's empty.
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
      // do the internal rewiring
      delete old_node.parent.contents[old_node.name];
      old_node.parent.timestamp = Date.now();
      old_node.name = new_name;
      new_dir.contents[new_name] = old_node;
      new_dir.timestamp = old_node.parent.timestamp;
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
      for (var key of Object.keys(node.contents)) {
        entries.push(key);
      }
      return entries;
    },
    symlink(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | /* 0777 */ 40960, 0);
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
        // non-trivial, and typed array
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      // If the buffer is located in main memory (HEAP), and if
      // memory can grow, we can't hold on to references of the
      // memory buffer, as they may get invalidated. That means we
      // need to do copy its contents.
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.timestamp = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        // This write is from a typed array to a typed array?
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          // Writing to an already allocated and used subrange of the file?
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
      // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray) {
        // Use typed array write which is available.
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
      // Only make a new copy when MAP_PRIVATE is specified.
      if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
        // We can't emulate MAP_SHARED when the file is not backed by the
        // buffer we're mapping to (e.g. the HEAP buffer).
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        if (contents) {
          // Try to avoid unnecessary slices.
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(contents, position, position + length);
            }
          }
          HEAP8.set(contents, ptr >>> 0);
        }
      }
      return {
        ptr,
        allocated
      };
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
      // should we check if bytesWritten and length are the same?
      return 0;
    }
  }
};

/** @param {boolean=} noRunDep */ var asyncLoad = (url, onload, onerror, noRunDep) => {
  var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
  readAsync(url).then(arrayBuffer => {
    onload(new Uint8Array(arrayBuffer));
    if (dep) removeRunDependency(dep);
  }, err => {
    if (onerror) {
      onerror();
    } else {
      throw `Loading data file "${url}" failed.`;
    }
  });
  if (dep) addRunDependency(dep);
};

var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
  FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
};

var preloadPlugins = Module["preloadPlugins"] || [];

var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
  // Ensure plugins are ready.
  if (typeof Browser != "undefined") Browser.init();
  var handled = false;
  preloadPlugins.forEach(plugin => {
    if (handled) return;
    if (plugin["canHandle"](fullname)) {
      plugin["handle"](byteArray, fullname, finish, onerror);
      handled = true;
    }
  });
  return handled;
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
  // TODO we should allow people to just pass in a complete filename instead
  // of parent and name being that we just join them anyways
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`);
  // might have several active requests for the same fullname
  function processData(byteArray) {
    function finish(byteArray) {
      preFinish?.();
      if (!dontCreateFile) {
        FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
      }
      onload?.();
      removeRunDependency(dep);
    }
    if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
      onerror?.();
      removeRunDependency(dep);
    })) {
      return;
    }
    finish(byteArray);
  }
  addRunDependency(dep);
  if (typeof url == "string") {
    asyncLoad(url, processData, onerror);
  } else {
    processData(url);
  }
};

var FS_modeStringToFlags = str => {
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
};

var FS_getMode = (canRead, canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
};

var IDBFS = {
  dbs: {},
  indexedDB: () => {
    if (typeof indexedDB != "undefined") return indexedDB;
    var ret = null;
    if (typeof window == "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    return ret;
  },
  DB_VERSION: 21,
  DB_STORE_NAME: "FILE_DATA",
  queuePersist: mount => {
    function onPersistComplete() {
      if (mount.idbPersistState === "again") startPersist(); else // If a new sync request has appeared in between, kick off a new sync
      mount.idbPersistState = 0;
    }
    // Otherwise reset sync state back to idle to wait for a new sync later
    function startPersist() {
      mount.idbPersistState = "idb";
      // Mark that we are currently running a sync operation
      IDBFS.syncfs(mount, /*populate:*/ false, onPersistComplete);
    }
    if (!mount.idbPersistState) {
      // Programs typically write/copy/move multiple files in the in-memory
      // filesystem within a single app frame, so when a filesystem sync
      // command is triggered, do not start it immediately, but only after
      // the current frame is finished. This way all the modified files
      // inside the main loop tick will be batched up to the same sync.
      mount.idbPersistState = setTimeout(startPersist, 0);
    } else if (mount.idbPersistState === "idb") {
      // There is an active IndexedDB sync operation in-flight, but we now
      // have accumulated more files to sync. We should therefore queue up
      // a new sync after the current one finishes so that all writes
      // will be properly persisted.
      mount.idbPersistState = "again";
    }
  },
  mount: mount => {
    // reuse core MEMFS functionality
    var mnt = MEMFS.mount(mount);
    // If the automatic IDBFS persistence option has been selected, then automatically persist
    // all modifications to the filesystem as they occur.
    if (mount?.opts?.autoPersist) {
      mnt.idbPersistState = 0;
      // IndexedDB sync starts in idle state
      var memfs_node_ops = mnt.node_ops;
      mnt.node_ops = Object.assign({}, mnt.node_ops);
      // Clone node_ops to inject write tracking
      mnt.node_ops.mknod = (parent, name, mode, dev) => {
        var node = memfs_node_ops.mknod(parent, name, mode, dev);
        // Propagate injected node_ops to the newly created child node
        node.node_ops = mnt.node_ops;
        // Remember for each IDBFS node which IDBFS mount point they came from so we know which mount to persist on modification.
        node.idbfs_mount = mnt.mount;
        // Remember original MEMFS stream_ops for this node
        node.memfs_stream_ops = node.stream_ops;
        // Clone stream_ops to inject write tracking
        node.stream_ops = Object.assign({}, node.stream_ops);
        // Track all file writes
        node.stream_ops.write = (stream, buffer, offset, length, position, canOwn) => {
          // This file has been modified, we must persist IndexedDB when this file closes
          stream.node.isModified = true;
          return node.memfs_stream_ops.write(stream, buffer, offset, length, position, canOwn);
        };
        // Persist IndexedDB on file close
        node.stream_ops.close = stream => {
          var n = stream.node;
          if (n.isModified) {
            IDBFS.queuePersist(n.idbfs_mount);
            n.isModified = false;
          }
          if (n.memfs_stream_ops.close) return n.memfs_stream_ops.close(stream);
        };
        return node;
      };
      // Also kick off persisting the filesystem on other operations that modify the filesystem.
      mnt.node_ops.mkdir = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.mkdir(...args));
      mnt.node_ops.rmdir = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.rmdir(...args));
      mnt.node_ops.symlink = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.symlink(...args));
      mnt.node_ops.unlink = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.unlink(...args));
      mnt.node_ops.rename = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.rename(...args));
    }
    return mnt;
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
    // check the cache first
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
      var db = /** @type {IDBDatabase} */ (e.target.result);
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
      db = /** @type {IDBDatabase} */ (req.result);
      // add to the cache
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
        check.push(...FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
      }
      entries[path] = {
        "timestamp": stat.mtime
      };
    }
    return callback(null, {
      type: "local",
      entries
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
              db,
              entries
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
      // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
      // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
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
    req.onsuccess = event => callback(null, event.target.result);
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
    req.onsuccess = event => callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  removeRemoteEntry: (store, path, callback) => {
    var req = store.delete(path);
    req.onsuccess = event => callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  reconcile: (src, dst, callback) => {
    var total = 0;
    var create = [];
    Object.keys(src.entries).forEach(key => {
      var e = src.entries[key];
      var e2 = dst.entries[key];
      if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
        create.push(key);
        total++;
      }
    });
    var remove = [];
    Object.keys(dst.entries).forEach(key => {
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
    // transaction may abort if (for example) there is a QuotaExceededError
    transaction.onerror = transaction.onabort = e => {
      done(e.target.error);
      e.preventDefault();
    };
    transaction.oncomplete = e => {
      if (!errored) {
        callback(null);
      }
    };
    // sort paths in ascending order so directory entries are created
    // before the files inside them
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
    // sort paths in descending order so files are deleted before their
    // parent directories
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
  ErrnoError: class {
    // We set the `name` property to be able to identify `FS.ErrnoError`
    // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
    // - when using PROXYFS, an error can come from an underlying FS
    // as different FS objects have their own FS.ErrnoError each,
    // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
    // we'll use the reliable test `err.name == "ErrnoError"` instead
    constructor(errno) {
      // TODO(sbc): Use the inline member declaration syntax once we
      // support it in acorn and closure.
      this.name = "ErrnoError";
      this.errno = errno;
    }
  },
  genericErrors: {},
  filesystems: null,
  syncFSRequests: 0,
  readFiles: {},
  FSStream: class {
    constructor() {
      // TODO(https://github.com/emscripten-core/emscripten/issues/21414):
      // Use inline field declarations.
      this.shared = {};
    }
    get object() {
      return this.node;
    }
    set object(val) {
      this.node = val;
    }
    get isRead() {
      return (this.flags & 2097155) !== 1;
    }
    get isWrite() {
      return (this.flags & 2097155) !== 0;
    }
    get isAppend() {
      return (this.flags & 1024);
    }
    get flags() {
      return this.shared.flags;
    }
    set flags(val) {
      this.shared.flags = val;
    }
    get position() {
      return this.shared.position;
    }
    set position(val) {
      this.shared.position = val;
    }
  },
  FSNode: class {
    constructor(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      // root node sets parent to itself
      this.parent = parent;
      this.mount = parent.mount;
      this.mounted = null;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.node_ops = {};
      this.stream_ops = {};
      this.rdev = rdev;
      this.readMode = 292 | 73;
      this.writeMode = 146;
    }
    get read() {
      return (this.mode & this.readMode) === this.readMode;
    }
    set read(val) {
      val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
    }
    get write() {
      return (this.mode & this.writeMode) === this.writeMode;
    }
    set write(val) {
      val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
    }
    get isFolder() {
      return FS.isDir(this.mode);
    }
    get isDevice() {
      return FS.isChrdev(this.mode);
    }
  },
  lookupPath(path, opts = {}) {
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
      // max recursive lookup of 8
      throw new FS.ErrnoError(32);
    }
    // split the absolute path
    var parts = path.split("/").filter(p => !!p);
    // start at the root
    var current = FS.root;
    var current_path = "/";
    for (var i = 0; i < parts.length; i++) {
      var islast = (i === parts.length - 1);
      if (islast && opts.parent) {
        // stop resolving
        break;
      }
      current = FS.lookupNode(current, parts[i]);
      current_path = PATH.join2(current_path, parts[i]);
      // jump to the mount's root node if this is a mountpoint
      if (FS.isMountpoint(current)) {
        if (!islast || (islast && opts.follow_mount)) {
          current = current.mounted.root;
        }
      }
      // by default, lookupPath will not follow a symlink if it is the final path component.
      // setting opts.follow = true will override this behavior.
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
            // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
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
  getPath(node) {
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
  hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode(node) {
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
  lookupNode(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    // if we failed to find it in the cache, call into the VFS
    return FS.lookup(parent, name);
  },
  createNode(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode(node) {
    FS.hashRemoveNode(node);
  },
  isRoot(node) {
    return node === node.parent;
  },
  isMountpoint(node) {
    return !!node.mounted;
  },
  isFile(mode) {
    return (mode & 61440) === 32768;
  },
  isDir(mode) {
    return (mode & 61440) === 16384;
  },
  isLink(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket(mode) {
    return (mode & 49152) === 49152;
  },
  flagsToPermissionString(flag) {
    var perms = [ "r", "w", "rw" ][flag & 3];
    if ((flag & 512)) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    // return 0 if any user, group or owner bits are set.
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    } else if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    } else if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup(dir) {
    if (!FS.isDir(dir.mode)) return 54;
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate(dir, name) {
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete(dir, name, isdir) {
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
  mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || // opening for write
      (flags & 512)) {
        // TODO: check for O_SEARCH? (== search for dir only)
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  MAX_OPEN_FDS: 4096,
  nextfd() {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  },
  getStream: fd => FS.streams[fd],
  createStream(stream, fd = -1) {
    // clone it, so we can return an instance of FSStream
    stream = Object.assign(new FS.FSStream, stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream(fd) {
    FS.streams[fd] = null;
  },
  dupStream(origStream, fd = -1) {
    var stream = FS.createStream(origStream, fd);
    stream.stream_ops?.dup?.(stream);
    return stream;
  },
  chrdev_stream_ops: {
    open(stream) {
      var device = FS.getDevice(stream.node.rdev);
      // override node's stream ops with the device's
      stream.stream_ops = device.stream_ops;
      // forward the open call
      stream.stream_ops.open?.(stream);
    },
    llseek() {
      throw new FS.ErrnoError(70);
    }
  },
  major: dev => ((dev) >> 8),
  minor: dev => ((dev) & 255),
  makedev: (ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
    FS.devices[dev] = {
      stream_ops: ops
    };
  },
  getDevice: dev => FS.devices[dev],
  getMounts(mount) {
    var mounts = [];
    var check = [ mount ];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts);
    }
    return mounts;
  },
  syncfs(populate, callback) {
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
    // sync all mounts
    mounts.forEach(mount => {
      if (!mount.type.syncfs) {
        return done(null);
      }
      mount.type.syncfs(mount, populate, done);
    });
  },
  mount(type, opts, mountpoint) {
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
      // use the absolute path
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = {
      type,
      opts,
      mountpoint,
      mounts: []
    };
    // create a root node for the fs
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      // set as a mountpoint
      node.mounted = mount;
      // add the new mount to the current mount's children
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, {
      follow_mount: false
    });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    // destroy the nodes for this mount, and all its child mounts
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
    // no longer a mountpoint
    node.mounted = null;
    // remove this mount from the child mounts
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod(path, mode, dev) {
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
  create(path, mode) {
    mode = mode !== undefined ? mode : 438;
    /* 0666 */ mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir(path, mode) {
    mode = mode !== undefined ? mode : 511;
    /* 0777 */ mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree(path, mode) {
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
  mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438;
    }
    /* 0666 */ mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink(oldpath, newpath) {
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
  rename(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    // parents must exist
    var lookup, old_dir, new_dir;
    // let the errors from non existent directories percolate up
    lookup = FS.lookupPath(old_path, {
      parent: true
    });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, {
      parent: true
    });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    // need to be part of the same mount
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    // source must exist
    var old_node = FS.lookupNode(old_dir, old_name);
    // old path should not be an ancestor of the new path
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    // new path should not be an ancestor of the old path
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    // see if the new path already exists
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    // early out if nothing needs to change
    if (old_node === new_node) {
      return;
    }
    // we'll need to delete the old entry
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    // need delete permissions if we'll be overwriting.
    // need create permissions if new doesn't already exist.
    errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    // if we are going to change the parent, check write permissions
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // remove the node from the lookup hash
    FS.hashRemoveNode(old_node);
    // do the underlying fs rename
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
      // update old node (we do this here to avoid each backend
      // needing to)
      old_node.parent = new_dir;
    } catch (e) {
      throw e;
    } finally {
      // add the node back to the hash (in case node_ops.rename
      // changed its name)
      FS.hashAddNode(old_node);
    }
  },
  rmdir(path) {
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
  readdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    if (!node.node_ops.readdir) {
      throw new FS.ErrnoError(54);
    }
    return node.node_ops.readdir(node);
  },
  unlink(path) {
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
      // According to POSIX, we should map EISDIR to EPERM, but
      // we instead do what Linux does (and we must, as we use
      // the musl linux libc).
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
  readlink(path) {
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
  stat(path, dontFollow) {
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
  lstat(path) {
    return FS.stat(path, true);
  },
  chmod(path, mode, dontFollow) {
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
      mode: (mode & 4095) | (node.mode & ~4095),
      timestamp: Date.now()
    });
  },
  lchmod(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod(fd, mode) {
    var stream = FS.getStreamChecked(fd);
    FS.chmod(stream.node, mode);
  },
  chown(path, uid, gid, dontFollow) {
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
  // we ignore the uid / gid for now
  lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(fd);
    FS.chown(stream.node, uid, gid);
  },
  truncate(path, len) {
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
  ftruncate(fd, len) {
    var stream = FS.getStreamChecked(fd);
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.truncate(stream.node, len);
  },
  utime(path, atime, mtime) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    node.node_ops.setattr(node, {
      timestamp: Math.max(atime, mtime)
    });
  },
  open(path, flags, mode) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
    if ((flags & 64)) {
      mode = typeof mode == "undefined" ? 438 : /* 0666 */ mode;
      mode = (mode & 4095) | 32768;
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
    // perhaps we need to create the node
    var created = false;
    if ((flags & 64)) {
      if (node) {
        // if O_CREAT and O_EXCL are set, error out if the node already exists
        if ((flags & 128)) {
          throw new FS.ErrnoError(20);
        }
      } else {
        // node doesn't exist, try to create it
        node = FS.mknod(path, mode, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    // can't truncate a device
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    // if asked only for a directory, then this must be one
    if ((flags & 65536) && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    // check permissions, if this is not a file we just created now (it is ok to
    // create and write to a file with read-only permissions; it is read-only
    // for later use)
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // do truncation if necessary
    if ((flags & 512) && !created) {
      FS.truncate(node, 0);
    }
    // we've already handled these, don't pass down to the underlying vfs
    flags &= ~(128 | 512 | 131072);
    // register the stream with the filesystem
    var stream = FS.createStream({
      node,
      path: FS.getPath(node),
      // we want the absolute path to the node
      flags,
      seekable: true,
      position: 0,
      stream_ops: node.stream_ops,
      // used by the file family libc calls (fopen, fwrite, ferror, etc.)
      ungotten: [],
      error: false
    });
    // call the new stream's open function
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
      }
    }
    return stream;
  },
  close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    // free readdir state
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
  isClosed(stream) {
    return stream.fd === null;
  },
  llseek(stream, offset, whence) {
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
  read(stream, buffer, offset, length, position) {
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
  write(stream, buffer, offset, length, position, canOwn) {
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
      // seek to the end before writing in append mode
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
  allocate(stream, offset, length) {
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
  mmap(stream, length, position, prot, flags) {
    // User requests writing to file (prot & PROT_WRITE != 0).
    // Checking if we have permissions to write to the file unless
    // MAP_PRIVATE flag is set. According to POSIX spec it is possible
    // to write to file opened in read-only mode with MAP_PRIVATE flag,
    // as all modifications will be visible only in the memory of
    // the current process.
    if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    if (!length) {
      throw new FS.ErrnoError(28);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  },
  msync(stream, buffer, offset, length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile(path, opts = {}) {
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
  writeFile(path, data, opts = {}) {
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
  chdir(path) {
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
  createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices() {
    // create /dev
    FS.mkdir("/dev");
    // setup /dev/null
    FS.registerDevice(FS.makedev(1, 3), {
      read: () => 0,
      write: (stream, buffer, offset, length, pos) => length
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    // setup /dev/tty and /dev/tty1
    // stderr needs to print output using err() rather than out()
    // so we register a second tty just for it.
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    // setup /dev/[u]random
    // use a buffer to avoid overhead of individual crypto calls per byte
    var randomBuffer = new Uint8Array(1024), randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomLeft = randomFill(randomBuffer).byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
    // we're not going to emulate the actual shm device,
    // just create the tmp dirs that reside in it commonly
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories() {
    // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
    // name of the stream for fd 6 (see test_unistd_ttyname)
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({
      mount() {
        var node = FS.createNode(proc_self, "fd", 16384 | 511, /* 0777 */ 73);
        node.node_ops = {
          lookup(parent, name) {
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
            // make it look like a simple root node
            return ret;
          }
        };
        return node;
      }
    }, {}, "/proc/self/fd");
  },
  createStandardStreams(input, output, error) {
    // TODO deprecate the old functionality of a single
    // input / output callback and that utilizes FS.createDevice
    // and instead require a unique set of stream ops
    // by default, we symlink the standard streams to the
    // default tty devices. however, if the standard streams
    // have been overwritten we create a unique device for
    // them instead.
    if (input) {
      FS.createDevice("/dev", "stdin", input);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (output) {
      FS.createDevice("/dev", "stdout", null, output);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (error) {
      FS.createDevice("/dev", "stderr", null, error);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    // open default streams for the stdin, stdout and stderr devices
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  staticInit() {
    // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
    [ 44 ].forEach(code => {
      FS.genericErrors[code] = new FS.ErrnoError(code);
      FS.genericErrors[code].stack = "<generic error, no stack>";
    });
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
  init(input, output, error) {
    FS.initialized = true;
    // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
    input ??= Module["stdin"];
    output ??= Module["stdout"];
    error ??= Module["stderr"];
    FS.createStandardStreams(input, output, error);
  },
  quit() {
    FS.initialized = false;
    // force-flush all streams, so we get musl std streams printed out
    _fflush(0);
    // close all of our streams
    for (var i = 0; i < FS.streams.length; i++) {
      var stream = FS.streams[i];
      if (!stream) {
        continue;
      }
      FS.close(stream);
    }
  },
  findObject(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  },
  analyzePath(path, dontResolveLastLink) {
    // operate from within the context of the symlink's target
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
  createPath(parent, path, canRead, canWrite) {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {}
      // ignore EEXIST
      parent = current;
    }
    return current;
  },
  createFile(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
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
      // make sure we can write to the file
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
  },
  createDevice(parent, name, input, output) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    // Create a fake device that a set of stream ops to emulate
    // the old behavior.
    FS.registerDevice(dev, {
      open(stream) {
        stream.seekable = false;
      },
      close(stream) {
        // flush any pending line data
        if (output?.buffer?.length) {
          output(10);
        }
      },
      read(stream, buffer, offset, length, pos) {
        /* ignored */ var bytesRead = 0;
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
      write(stream, buffer, offset, length, pos) {
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
  forceLoadFile(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (typeof XMLHttpRequest != "undefined") {
      throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
    } else {
      // Command-line.
      try {
        obj.contents = readBinary(obj.url);
        obj.usedBytes = obj.contents.length;
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    }
  },
  createLazyFile(parent, name, url, canRead, canWrite) {
    // Lazy chunked Uint8Array (implements get and length from Uint8Array).
    // Actual getting is abstracted away for eventual reuse.
    class LazyUint8Array {
      constructor() {
        this.lengthKnown = false;
        this.chunks = [];
      }
      // Loaded chunks. Index is the chunk number
      get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      }
      setDataGetter(getter) {
        this.getter = getter;
      }
      cacheLength() {
        // Find length
        var xhr = new XMLHttpRequest;
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
        var chunkSize = 1024 * 1024;
        // Chunk size in bytes
        if (!hasByteServing) chunkSize = datalength;
        // Function to get a range from the remote URL.
        var doXHR = (from, to) => {
          if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
          if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
          // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, false);
          if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
          // Some hints to the browser that we want binary data.
          xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(/** @type{Array<number>} */ (xhr.response || []));
          }
          return intArrayFromString(xhr.responseText || "", true);
        };
        var lazyArray = this;
        lazyArray.setDataGetter(chunkNum => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          // including this byte
          end = Math.min(end, datalength - 1);
          // if datalength-1 is selected, this is the last block
          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
          chunkSize = datalength = 1;
          // this will force getter(0)/doXHR do download the whole file
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out("LazyFiles on gzip forces download of the whole file when length is accessed");
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      }
      get length() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._length;
      }
      get chunkSize() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._chunkSize;
      }
    }
    if (typeof XMLHttpRequest != "undefined") {
      if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var lazyArray = new LazyUint8Array;
      var properties = {
        isDevice: false,
        contents: lazyArray
      };
    } else {
      var properties = {
        isDevice: false,
        url
      };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    // This is a total hack, but I want to get this lazy file code out of the
    // core of MEMFS. If we want to keep this lazy file concept I feel it should
    // be its own thin LAZYFS proxying calls to MEMFS.
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    // Add a function that defers querying the file size until it is asked the first time.
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    // override each stream op with one that tries to force load the lazy file first
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(key => {
      var fn = node.stream_ops[key];
      stream_ops[key] = (...args) => {
        FS.forceLoadFile(node);
        return fn(...args);
      };
    });
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        // normal array
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          // LazyUint8Array from sync binary XHR
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
    // use a custom read function
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
    // use a custom mmap function
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, HEAP8, ptr, length, position);
      return {
        ptr,
        allocated: true
      };
    };
    node.stream_ops = stream_ops;
    return node;
  }
};

var SYSCALLS = {
  DEFAULT_POLLMASK: 5,
  calculateAt(dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
    // relative path
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
  doStat(func, path, buf) {
    var stat = func(path);
    HEAP32[((buf) >>> 2) >>> 0] = stat.dev;
    HEAP32[(((buf) + (4)) >>> 2) >>> 0] = stat.mode;
    HEAPU32[(((buf) + (8)) >>> 2) >>> 0] = stat.nlink;
    HEAP32[(((buf) + (12)) >>> 2) >>> 0] = stat.uid;
    HEAP32[(((buf) + (16)) >>> 2) >>> 0] = stat.gid;
    HEAP32[(((buf) + (20)) >>> 2) >>> 0] = stat.rdev;
    (tempI64 = [ stat.size >>> 0, (tempDouble = stat.size, (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[(((buf) + (24)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((buf) + (28)) >>> 2) >>> 0] = tempI64[1]);
    HEAP32[(((buf) + (32)) >>> 2) >>> 0] = 4096;
    HEAP32[(((buf) + (36)) >>> 2) >>> 0] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    (tempI64 = [ Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3),
    (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[(((buf) + (40)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((buf) + (44)) >>> 2) >>> 0] = tempI64[1]);
    HEAPU32[(((buf) + (48)) >>> 2) >>> 0] = (atime % 1e3) * 1e3 * 1e3;
    (tempI64 = [ Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3),
    (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[(((buf) + (56)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((buf) + (60)) >>> 2) >>> 0] = tempI64[1]);
    HEAPU32[(((buf) + (64)) >>> 2) >>> 0] = (mtime % 1e3) * 1e3 * 1e3;
    (tempI64 = [ Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3),
    (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[(((buf) + (72)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((buf) + (76)) >>> 2) >>> 0] = tempI64[1]);
    HEAPU32[(((buf) + (80)) >>> 2) >>> 0] = (ctime % 1e3) * 1e3 * 1e3;
    (tempI64 = [ stat.ino >>> 0, (tempDouble = stat.ino, (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[(((buf) + (88)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((buf) + (92)) >>> 2) >>> 0] = tempI64[1]);
    return 0;
  },
  doMsync(addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
      // MAP_PRIVATE calls need not to be synced back to underlying fs
      return 0;
    }
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  },
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

function ___syscall__newselect(nfds, readfds, writefds, exceptfds, timeout) {
  readfds >>>= 0;
  writefds >>>= 0;
  exceptfds >>>= 0;
  timeout >>>= 0;
  try {
    // readfds are supported,
    // writefds checks socket open status
    // exceptfds are supported, although on web, such exceptional conditions never arise in web sockets
    //                          and so the exceptfds list will always return empty.
    // timeout is supported, although on SOCKFS and PIPEFS these are ignored and always treated as 0 - fully async
    var total = 0;
    var srcReadLow = (readfds ? HEAP32[((readfds) >>> 2) >>> 0] : 0), srcReadHigh = (readfds ? HEAP32[(((readfds) + (4)) >>> 2) >>> 0] : 0);
    var srcWriteLow = (writefds ? HEAP32[((writefds) >>> 2) >>> 0] : 0), srcWriteHigh = (writefds ? HEAP32[(((writefds) + (4)) >>> 2) >>> 0] : 0);
    var srcExceptLow = (exceptfds ? HEAP32[((exceptfds) >>> 2) >>> 0] : 0), srcExceptHigh = (exceptfds ? HEAP32[(((exceptfds) + (4)) >>> 2) >>> 0] : 0);
    var dstReadLow = 0, dstReadHigh = 0;
    var dstWriteLow = 0, dstWriteHigh = 0;
    var dstExceptLow = 0, dstExceptHigh = 0;
    var allLow = (readfds ? HEAP32[((readfds) >>> 2) >>> 0] : 0) | (writefds ? HEAP32[((writefds) >>> 2) >>> 0] : 0) | (exceptfds ? HEAP32[((exceptfds) >>> 2) >>> 0] : 0);
    var allHigh = (readfds ? HEAP32[(((readfds) + (4)) >>> 2) >>> 0] : 0) | (writefds ? HEAP32[(((writefds) + (4)) >>> 2) >>> 0] : 0) | (exceptfds ? HEAP32[(((exceptfds) + (4)) >>> 2) >>> 0] : 0);
    var check = function(fd, low, high, val) {
      return (fd < 32 ? (low & val) : (high & val));
    };
    for (var fd = 0; fd < nfds; fd++) {
      var mask = 1 << (fd % 32);
      if (!(check(fd, allLow, allHigh, mask))) {
        continue;
      }
      // index isn't in the set
      var stream = SYSCALLS.getStreamFromFD(fd);
      var flags = SYSCALLS.DEFAULT_POLLMASK;
      if (stream.stream_ops.poll) {
        var timeoutInMillis = -1;
        if (timeout) {
          // select(2) is declared to accept "struct timeval { time_t tv_sec; suseconds_t tv_usec; }".
          // However, musl passes the two values to the syscall as an array of long values.
          // Note that sizeof(time_t) != sizeof(long) in wasm32. The former is 8, while the latter is 4.
          // This means using "C_STRUCTS.timeval.tv_usec" leads to a wrong offset.
          // So, instead, we use POINTER_SIZE.
          var tv_sec = (readfds ? HEAP32[((timeout) >>> 2) >>> 0] : 0), tv_usec = (readfds ? HEAP32[(((timeout) + (4)) >>> 2) >>> 0] : 0);
          timeoutInMillis = (tv_sec + tv_usec / 1e6) * 1e3;
        }
        flags = stream.stream_ops.poll(stream, timeoutInMillis);
      }
      if ((flags & 1) && check(fd, srcReadLow, srcReadHigh, mask)) {
        fd < 32 ? (dstReadLow = dstReadLow | mask) : (dstReadHigh = dstReadHigh | mask);
        total++;
      }
      if ((flags & 4) && check(fd, srcWriteLow, srcWriteHigh, mask)) {
        fd < 32 ? (dstWriteLow = dstWriteLow | mask) : (dstWriteHigh = dstWriteHigh | mask);
        total++;
      }
      if ((flags & 2) && check(fd, srcExceptLow, srcExceptHigh, mask)) {
        fd < 32 ? (dstExceptLow = dstExceptLow | mask) : (dstExceptHigh = dstExceptHigh | mask);
        total++;
      }
    }
    if (readfds) {
      HEAP32[((readfds) >>> 2) >>> 0] = dstReadLow;
      HEAP32[(((readfds) + (4)) >>> 2) >>> 0] = dstReadHigh;
    }
    if (writefds) {
      HEAP32[((writefds) >>> 2) >>> 0] = dstWriteLow;
      HEAP32[(((writefds) + (4)) >>> 2) >>> 0] = dstWriteHigh;
    }
    if (exceptfds) {
      HEAP32[((exceptfds) >>> 2) >>> 0] = dstExceptLow;
      HEAP32[(((exceptfds) + (4)) >>> 2) >>> 0] = dstExceptHigh;
    }
    return total;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var SOCKFS = {
  mount(mount) {
    // If Module['websocket'] has already been defined (e.g. for configuring
    // the subprotocol/url) use that, if not initialise it to a new object.
    Module["websocket"] = (Module["websocket"] && ("object" === typeof Module["websocket"])) ? Module["websocket"] : {};
    // Add the Event registration mechanism to the exported websocket configuration
    // object so we can register network callbacks from native JavaScript too.
    // For more documentation see system/include/emscripten/emscripten.h
    Module["websocket"]._callbacks = {};
    Module["websocket"]["on"] = /** @this{Object} */ function(event, callback) {
      if ("function" === typeof callback) {
        this._callbacks[event] = callback;
      }
      return this;
    };
    Module["websocket"].emit = /** @this{Object} */ function(event, param) {
      if ("function" === typeof this._callbacks[event]) {
        this._callbacks[event].call(this, param);
      }
    };
    // If debug is enabled register simple default logging callbacks for each Event.
    return FS.createNode(null, "/", 16384 | 511, /* 0777 */ 0);
  },
  createSocket(family, type, protocol) {
    type &= ~526336;
    // Some applications may pass it; it makes no sense for a single process.
    var streaming = type == 1;
    if (streaming && protocol && protocol != 6) {
      throw new FS.ErrnoError(66);
    }
    // create our internal socket structure
    var sock = {
      family,
      type,
      protocol,
      server: null,
      error: null,
      // Used in getsockopt for SOL_SOCKET/SO_ERROR test
      peers: {},
      pending: [],
      recv_queue: [],
      sock_ops: SOCKFS.websocket_sock_ops
    };
    // create the filesystem node to store the socket structure
    var name = SOCKFS.nextname();
    var node = FS.createNode(SOCKFS.root, name, 49152, 0);
    node.sock = sock;
    // and the wrapping stream that enables library functions such
    // as read and write to indirectly interact with the socket
    var stream = FS.createStream({
      path: name,
      node,
      flags: 2,
      seekable: false,
      stream_ops: SOCKFS.stream_ops
    });
    // map the new stream to the socket structure (sockets have a 1:1
    // relationship with a stream)
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
      /* ignored */ var sock = stream.node.sock;
      var msg = sock.sock_ops.recvmsg(sock, length);
      if (!msg) {
        // socket is closed
        return 0;
      }
      buffer.set(msg.buffer, offset);
      return msg.buffer.length;
    },
    write(stream, buffer, offset, length, position) {
      /* ignored */ var sock = stream.node.sock;
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
    return "socket[" + (SOCKFS.nextname.current++) + "]";
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
        // for sockets that've already connected (e.g. we're the server)
        // we can inspect the _socket property for the address
        if (ws._socket) {
          addr = ws._socket.remoteAddress;
          port = ws._socket.remotePort;
        } else // if we're just now initializing a connection to the remote,
        // inspect the url property
        {
          var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
          if (!result) {
            throw new Error("WebSocket URL must be in the format ws(s)://address:port");
          }
          addr = result[1];
          port = parseInt(result[2], 10);
        }
      } else {
        // create the actual websocket object and connect
        try {
          // runtimeConfig gets set to true if WebSocket runtime configuration is available.
          var runtimeConfig = (Module["websocket"] && ("object" === typeof Module["websocket"]));
          // The default value is 'ws://' the replace is needed because the compiler replaces '//' comments with '#'
          // comments without checking context, so we'd end up with ws:#, the replace swaps the '#' for '//' again.
          var url = "ws:#".replace("#", "//");
          if (runtimeConfig) {
            if ("string" === typeof Module["websocket"]["url"]) {
              url = Module["websocket"]["url"];
            }
          }
          if (url === "ws://" || url === "wss://") {
            // Is the supplied URL config just a prefix, if so complete it.
            var parts = addr.split("/");
            url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
          }
          // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
          var subProtocols = "binary";
          // The default value is 'binary'
          if (runtimeConfig) {
            if ("string" === typeof Module["websocket"]["subprotocol"]) {
              subProtocols = Module["websocket"]["subprotocol"];
            }
          }
          // The default WebSocket options
          var opts = undefined;
          if (subProtocols !== "null") {
            // The regex trims the string (removes spaces at the beginning and end, then splits the string by
            // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
            subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
            opts = subProtocols;
          }
          // some webservers (azure) does not support subprotocol header
          if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
            subProtocols = "null";
            opts = undefined;
          }
          // If node we use the ws library.
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
        addr,
        port,
        socket: ws,
        dgram_send_queue: []
      };
      SOCKFS.websocket_sock_ops.addPeer(sock, peer);
      SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
      // if this is a bound dgram socket, send the port number first to allow
      // us to override the ephemeral port reported to us by remotePort on the
      // remote end.
      if (sock.type === 2 && typeof sock.sport != "undefined") {
        peer.dgram_send_queue.push(new Uint8Array([ 255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), ((sock.sport & 65280) >> 8), (sock.sport & 255) ]));
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
          // not much we can do here in the way of proper error handling as we've already
          // lied and said this data was sent. shut it down.
          peer.socket.close();
        }
      };
      function handleMessage(data) {
        if (typeof data == "string") {
          var encoder = new TextEncoder;
          // should be utf-8
          data = encoder.encode(data);
        } else // make a typed array from the string
        {
          assert(data.byteLength !== undefined);
          // must receive an ArrayBuffer
          if (data.byteLength == 0) {
            // An empty ArrayBuffer will emit a pseudo disconnect event
            // as recv/recvmsg will return zero which indicates that a socket
            // has performed a shutdown although the connection has not been disconnected yet.
            return;
          }
          data = new Uint8Array(data);
        }
        // if this is the port message, override the peer's port with it
        var wasfirst = first;
        first = false;
        if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
          // update the peer's port and it's key in the peer map
          var newport = ((data[8] << 8) | data[9]);
          SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          peer.port = newport;
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          return;
        }
        sock.recv_queue.push({
          addr: peer.addr,
          port: peer.port,
          data
        });
        Module["websocket"].emit("message", sock.stream.fd);
      }
      if (ENVIRONMENT_IS_NODE) {
        peer.socket.on("open", handleOpen);
        peer.socket.on("message", function(data, isBinary) {
          if (!isBinary) {
            return;
          }
          handleMessage((new Uint8Array(data)).buffer);
        });
        // copy from node Buffer -> ArrayBuffer
        peer.socket.on("close", function() {
          Module["websocket"].emit("close", sock.stream.fd);
        });
        peer.socket.on("error", function(error) {
          // Although the ws library may pass errors that may be more descriptive than
          // ECONNREFUSED they are not necessarily the expected error code e.g.
          // ENOTFOUND on getaddrinfo seems to be node.js specific, so using ECONNREFUSED
          // is still probably the most useful thing to do.
          sock.error = 14;
          // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
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
          // The WebSocket spec only allows a 'simple event' to be thrown on error,
          // so we only really know as much as ECONNREFUSED.
          sock.error = 14;
          // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
          Module["websocket"].emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
        };
      }
    },
    poll(sock) {
      if (sock.type === 1 && sock.server) {
        // listen sockets should only say they're available for reading
        // if there are pending clients.
        return sock.pending.length ? (64 | 1) : 0;
      }
      var mask = 0;
      var dest = sock.type === 1 ? // we only care about the socket state for connection-based sockets
      SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
      if (sock.recv_queue.length || !dest || // connection-less sockets are always ready to read
      (dest && dest.socket.readyState === dest.socket.CLOSING) || (dest && dest.socket.readyState === dest.socket.CLOSED)) {
        // let recv return 0 once closed
        mask |= (64 | 1);
      }
      if (!dest || // connection-less sockets are always ready to write
      (dest && dest.socket.readyState === dest.socket.OPEN)) {
        mask |= 4;
      }
      if ((dest && dest.socket.readyState === dest.socket.CLOSING) || (dest && dest.socket.readyState === dest.socket.CLOSED)) {
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
        HEAP32[((arg) >>> 2) >>> 0] = bytes;
        return 0;

       default:
        return 28;
      }
    },
    close(sock) {
      // if we've spawned a listen server, close it
      if (sock.server) {
        try {
          sock.server.close();
        } catch (e) {}
        sock.server = null;
      }
      // close any peer connections
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
      // already bound
      sock.saddr = addr;
      sock.sport = port;
      // in order to emulate dgram sockets, we need to launch a listen server when
      // binding on a connection-less socket
      // note: this is only required on the server side
      if (sock.type === 2) {
        // close the existing server if it exists
        if (sock.server) {
          sock.server.close();
          sock.server = null;
        }
        // swallow error operation not supported error that occurs when binding in the
        // browser where this isn't supported
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
      // TODO autobind
      // if (!sock.addr && sock.type == 2) {
      // }
      // early out if we're already connected / in the middle of connecting
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
      // add the socket to our peer list and set our
      // destination address / port to match
      var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
      sock.daddr = peer.addr;
      sock.dport = peer.port;
      // always "fail" in non-blocking mode
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
        // TODO saddr and sport will be set for bind()'d UDP sockets, but what
        // should we be returning for TCP sockets that've been connect()'d?
        addr = sock.saddr || 0;
        port = sock.sport || 0;
      }
      return {
        addr,
        port
      };
    },
    sendmsg(sock, buffer, offset, length, addr, port) {
      if (sock.type === 2) {
        // connection-less sockets will honor the message address,
        // and otherwise fall back to the bound destination address
        if (addr === undefined || port === undefined) {
          addr = sock.daddr;
          port = sock.dport;
        }
        // if there was no address to fall back to, error out
        if (addr === undefined || port === undefined) {
          throw new FS.ErrnoError(17);
        }
      } else {
        // connection-based sockets will only use the bound
        addr = sock.daddr;
        port = sock.dport;
      }
      // find the peer for the destination address
      var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
      // early out if not connected with a connection-based socket
      if (sock.type === 1) {
        if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
          throw new FS.ErrnoError(53);
        } else if (dest.socket.readyState === dest.socket.CONNECTING) {
          throw new FS.ErrnoError(6);
        }
      }
      // create a copy of the incoming data to send, as the WebSocket API
      // doesn't work entirely with an ArrayBufferView, it'll just send
      // the entire underlying buffer
      if (ArrayBuffer.isView(buffer)) {
        offset += buffer.byteOffset;
        buffer = buffer.buffer;
      }
      var data;
      data = buffer.slice(offset, offset + length);
      // if we're emulating a connection-less dgram socket and don't have
      // a cached connection, queue the buffer to send upon connect and
      // lie, saying the data was sent now.
      if (sock.type === 2) {
        if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
          // if we're not connected, open a new connection
          if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
            dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          }
          dest.dgram_send_queue.push(data);
          return length;
        }
      }
      try {
        // send the actual data
        dest.socket.send(data);
        return length;
      } catch (e) {
        throw new FS.ErrnoError(28);
      }
    },
    recvmsg(sock, length) {
      // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
      if (sock.type === 1 && sock.server) {
        // tcp servers should not be recv()'ing on the listen socket
        throw new FS.ErrnoError(53);
      }
      var queued = sock.recv_queue.shift();
      if (!queued) {
        if (sock.type === 1) {
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
          if (!dest) {
            // if we have a destination address but are not connected, error out
            throw new FS.ErrnoError(53);
          }
          if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
            // return null if the socket has closed
            return null;
          }
          // else, our socket is in a valid state but truly has nothing available
          throw new FS.ErrnoError(6);
        }
        throw new FS.ErrnoError(6);
      }
      // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
      // requeued TCP data it'll be an ArrayBufferView
      var queuedLength = queued.data.byteLength || queued.data.length;
      var queuedOffset = queued.data.byteOffset || 0;
      var queuedBuffer = queued.data.buffer || queued.data;
      var bytesRead = Math.min(length, queuedLength);
      var res = {
        buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
        addr: queued.addr,
        port: queued.port
      };
      // push back any unread data for TCP connections
      if (sock.type === 1 && bytesRead < queuedLength) {
        var bytesRemaining = queuedLength - bytesRead;
        queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
        sock.recv_queue.unshift(queued);
      }
      return res;
    }
  }
};

var getSocketFromFD = fd => {
  var socket = SOCKFS.getSocket(fd);
  if (!socket) throw new FS.ErrnoError(8);
  return socket;
};

var inetPton4 = str => {
  var b = str.split(".");
  for (var i = 0; i < 4; i++) {
    var tmp = Number(b[i]);
    if (isNaN(tmp)) return null;
    b[i] = tmp;
  }
  return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
};

/** @suppress {checkTypes} */ var jstoi_q = str => parseInt(str);

var inetPton6 = str => {
  var words;
  var w, offset, z;
  /* http://home.deds.nl/~aeron/regex/ */ var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
  var parts = [];
  if (!valid6regx.test(str)) {
    return null;
  }
  if (str === "::") {
    return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
  }
  // Z placeholder to keep track of zeros when splitting the string on ":"
  if (str.startsWith("::")) {
    str = str.replace("::", "Z:");
  } else // leading zeros case
  {
    str = str.replace("::", ":Z:");
  }
  if (str.indexOf(".") > 0) {
    // parse IPv4 embedded stress
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
        // compressed zeros - write appropriate number of zero words
        for (z = 0; z < (8 - words.length + 1); z++) {
          parts[w + z] = 0;
        }
        offset = z - 1;
      } else {
        // parse hex to field to 16-bit value and write it in network byte-order
        parts[w + offset] = _htons(parseInt(words[w], 16));
      }
    } else {
      // parsed IPv4 words
      parts[w + offset] = words[w];
    }
  }
  return [ (parts[1] << 16) | parts[0], (parts[3] << 16) | parts[2], (parts[5] << 16) | parts[4], (parts[7] << 16) | parts[6] ];
};

/** @param {number=} addrlen */ var writeSockaddr = (sa, family, addr, port, addrlen) => {
  switch (family) {
   case 2:
    addr = inetPton4(addr);
    zeroMemory(sa, 16);
    if (addrlen) {
      HEAP32[((addrlen) >>> 2) >>> 0] = 16;
    }
    HEAP16[((sa) >>> 1) >>> 0] = family;
    HEAP32[(((sa) + (4)) >>> 2) >>> 0] = addr;
    HEAP16[(((sa) + (2)) >>> 1) >>> 0] = _htons(port);
    break;

   case 10:
    addr = inetPton6(addr);
    zeroMemory(sa, 28);
    if (addrlen) {
      HEAP32[((addrlen) >>> 2) >>> 0] = 28;
    }
    HEAP32[((sa) >>> 2) >>> 0] = family;
    HEAP32[(((sa) + (8)) >>> 2) >>> 0] = addr[0];
    HEAP32[(((sa) + (12)) >>> 2) >>> 0] = addr[1];
    HEAP32[(((sa) + (16)) >>> 2) >>> 0] = addr[2];
    HEAP32[(((sa) + (20)) >>> 2) >>> 0] = addr[3];
    HEAP16[(((sa) + (2)) >>> 1) >>> 0] = _htons(port);
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
  lookup_name(name) {
    // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
    var res = inetPton4(name);
    if (res !== null) {
      return name;
    }
    res = inetPton6(name);
    if (res !== null) {
      return name;
    }
    // See if this name is already mapped.
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
  lookup_addr(addr) {
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

var inetNtop4 = addr => (addr & 255) + "." + ((addr >> 8) & 255) + "." + ((addr >> 16) & 255) + "." + ((addr >> 24) & 255);

var inetNtop6 = ints => {
  //  ref:  http://www.ietf.org/rfc/rfc2373.txt - section 2.5.4
  //  Format for IPv4 compatible and mapped  128-bit IPv6 Addresses
  //  128-bits are split into eight 16-bit words
  //  stored in network byte order (big-endian)
  //  |                80 bits               | 16 |      32 bits        |
  //  +-----------------------------------------------------------------+
  //  |               10 bytes               |  2 |      4 bytes        |
  //  +--------------------------------------+--------------------------+
  //  +               5 words                |  1 |      2 words        |
  //  +--------------------------------------+--------------------------+
  //  |0000..............................0000|0000|    IPv4 ADDRESS     | (compatible)
  //  +--------------------------------------+----+---------------------+
  //  |0000..............................0000|FFFF|    IPv4 ADDRESS     | (mapped)
  //  +--------------------------------------+----+---------------------+
  var str = "";
  var word = 0;
  var longest = 0;
  var lastzero = 0;
  var zstart = 0;
  var len = 0;
  var i = 0;
  var parts = [ ints[0] & 65535, (ints[0] >> 16), ints[1] & 65535, (ints[1] >> 16), ints[2] & 65535, (ints[2] >> 16), ints[3] & 65535, (ints[3] >> 16) ];
  // Handle IPv4-compatible, IPv4-mapped, loopback and any/unspecified addresses
  var hasipv4 = true;
  var v4part = "";
  // check if the 10 high-order bytes are all zeros (first 5 words)
  for (i = 0; i < 5; i++) {
    if (parts[i] !== 0) {
      hasipv4 = false;
      break;
    }
  }
  if (hasipv4) {
    // low-order 32-bits store an IPv4 address (bytes 13 to 16) (last 2 words)
    v4part = inetNtop4(parts[6] | (parts[7] << 16));
    // IPv4-mapped IPv6 address if 16-bit value (bytes 11 and 12) == 0xFFFF (6th word)
    if (parts[5] === -1) {
      str = "::ffff:";
      str += v4part;
      return str;
    }
    // IPv4-compatible IPv6 address if 16-bit value (bytes 11 and 12) == 0x0000 (6th word)
    if (parts[5] === 0) {
      str = "::";
      //special case IPv6 addresses
      if (v4part === "0.0.0.0") v4part = "";
      // any/unspecified address
      if (v4part === "0.0.0.1") v4part = "1";
      // loopback address
      str += v4part;
      return str;
    }
  }
  // Handle all other IPv6 addresses
  // first run to find the longest contiguous zero words
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
      // compress contiguous zeros - to produce "::"
      if (parts[word] === 0 && word >= zstart && word < (zstart + longest)) {
        if (word === zstart) {
          str += ":";
          if (zstart === 0) str += ":";
        }
        //leading zeros case
        continue;
      }
    }
    // converts 16-bit words from big-endian to little-endian before converting to hex string
    str += Number(_ntohs(parts[word] & 65535)).toString(16);
    str += word < 7 ? ":" : "";
  }
  return str;
};

var readSockaddr = (sa, salen) => {
  // family / port offsets are common to both sockaddr_in and sockaddr_in6
  var family = HEAP16[((sa) >>> 1) >>> 0];
  var port = _ntohs(HEAPU16[(((sa) + (2)) >>> 1) >>> 0]);
  var addr;
  switch (family) {
   case 2:
    if (salen !== 16) {
      return {
        errno: 28
      };
    }
    addr = HEAP32[(((sa) + (4)) >>> 2) >>> 0];
    addr = inetNtop4(addr);
    break;

   case 10:
    if (salen !== 28) {
      return {
        errno: 28
      };
    }
    addr = [ HEAP32[(((sa) + (8)) >>> 2) >>> 0], HEAP32[(((sa) + (12)) >>> 2) >>> 0], HEAP32[(((sa) + (16)) >>> 2) >>> 0], HEAP32[(((sa) + (20)) >>> 2) >>> 0] ];
    addr = inetNtop6(addr);
    break;

   default:
    return {
      errno: 5
    };
  }
  return {
    family,
    addr,
    port
  };
};

/** @param {boolean=} allowNull */ var getSocketAddress = (addrp, addrlen, allowNull) => {
  if (allowNull && addrp === 0) return null;
  var info = readSockaddr(addrp, addrlen);
  if (info.errno) throw new FS.ErrnoError(info.errno);
  info.addr = DNS.lookup_addr(info.addr) || info.addr;
  return info;
};

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
    return FS.dupStream(old).fd;
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
      // need a valid mode
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
    if (perms && /* otherwise, they've just passed F_OK */ FS.nodePermissions(node, perms)) {
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
    flags = flags & (~256);
    path = SYSCALLS.calculateAt(dirfd, path);
    (nofollow ? FS.lchown : FS.chown)(path, owner, group);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

/** @suppress {duplicate } */ function syscallGetVarargI() {
  // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
  var ret = HEAP32[((+SYSCALLS.varargs) >>> 2) >>> 0];
  SYSCALLS.varargs += 4;
  return ret;
}

var syscallGetVarargP = syscallGetVarargI;

function ___syscall_fcntl64(fd, cmd, varargs) {
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
     case 0:
      {
        var arg = syscallGetVarargI();
        if (arg < 0) {
          return -28;
        }
        while (FS.streams[arg]) {
          arg++;
        }
        var newStream;
        newStream = FS.dupStream(stream, arg);
        return newStream.fd;
      }

     case 1:
     case 2:
      return 0;

     // FD_CLOEXEC makes no sense for a single process.
      case 3:
      return stream.flags;

     case 4:
      {
        var arg = syscallGetVarargI();
        stream.flags |= arg;
        return 0;
      }

     case 12:
      {
        var arg = syscallGetVarargP();
        var offset = 0;
        // We're always unlocked.
        HEAP16[(((arg) + (offset)) >>> 1) >>> 0] = 2;
        return 0;
      }

     case 13:
     case 14:
      return 0;
    }
    // Pretend that the locking is successful.
    return -28;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fdatasync(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return 0;
  } // we can't do anything synchronously; the in-memory FS is already synced to
  catch (e) {
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
    stream.getdents ||= FS.readdir(stream.path);
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
      } else // DT_DIR
      if (name === "..") {
        var lookup = FS.lookupPath(stream.path, {
          parent: true
        });
        id = lookup.node.id;
        type = 4;
      } else // DT_DIR
      {
        var child = FS.lookupNode(stream.node, name);
        id = child.id;
        type = FS.isChrdev(child.mode) ? 2 : // DT_CHR, character device.
        FS.isDir(child.mode) ? 4 : // DT_DIR, directory.
        FS.isLink(child.mode) ? 10 : // DT_LNK, symbolic link.
        8;
      }
      // DT_REG, regular file.
      (tempI64 = [ id >>> 0, (tempDouble = id, (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
      HEAP32[((dirp + pos) >>> 2) >>> 0] = tempI64[0], HEAP32[(((dirp + pos) + (4)) >>> 2) >>> 0] = tempI64[1]);
      (tempI64 = [ (idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size,
      (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
      HEAP32[(((dirp + pos) + (8)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((dirp + pos) + (12)) >>> 2) >>> 0] = tempI64[1]);
      HEAP16[(((dirp + pos) + (16)) >>> 1) >>> 0] = 280;
      HEAP8[(dirp + pos) + (18) >>> 0] = type;
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
    // The socket is not connected.
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
    // TODO: sock.saddr should never be undefined, see TODO in websocket_sock_ops.getname
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
    // Minimal getsockopt aimed at resolving https://github.com/emscripten-core/emscripten/issues/2211
    // so only supports SOL_SOCKET with SO_ERROR.
    if (level === 1) {
      if (optname === 4) {
        HEAP32[((optval) >>> 2) >>> 0] = sock.error;
        HEAP32[((optlen) >>> 2) >>> 0] = 4;
        sock.error = null;
        // Clear the error (The SO_ERROR option obtains and then clears this field).
        return 0;
      }
    }
    return -50;
  } // The option is unknown at the level indicated.
  catch (e) {
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
          var argp = syscallGetVarargP();
          HEAP32[((argp) >>> 2) >>> 0] = termios.c_iflag || 0;
          HEAP32[(((argp) + (4)) >>> 2) >>> 0] = termios.c_oflag || 0;
          HEAP32[(((argp) + (8)) >>> 2) >>> 0] = termios.c_cflag || 0;
          HEAP32[(((argp) + (12)) >>> 2) >>> 0] = termios.c_lflag || 0;
          for (var i = 0; i < 32; i++) {
            HEAP8[(argp + i) + (17) >>> 0] = termios.c_cc[i] || 0;
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

     // no-op, not actually adjusting terminal settings
      case 21506:
     case 21507:
     case 21508:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcsets) {
          var argp = syscallGetVarargP();
          var c_iflag = HEAP32[((argp) >>> 2) >>> 0];
          var c_oflag = HEAP32[(((argp) + (4)) >>> 2) >>> 0];
          var c_cflag = HEAP32[(((argp) + (8)) >>> 2) >>> 0];
          var c_lflag = HEAP32[(((argp) + (12)) >>> 2) >>> 0];
          var c_cc = [];
          for (var i = 0; i < 32; i++) {
            c_cc.push(HEAP8[(argp + i) + (17) >>> 0]);
          }
          return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
            c_iflag,
            c_oflag,
            c_cflag,
            c_lflag,
            c_cc
          });
        }
        return 0;
      }

     // no-op, not actually adjusting terminal settings
      case 21519:
      {
        if (!stream.tty) return -59;
        var argp = syscallGetVarargP();
        HEAP32[((argp) >>> 2) >>> 0] = 0;
        return 0;
      }

     case 21520:
      {
        if (!stream.tty) return -59;
        return -28;
      }

     // not supported
      case 21531:
      {
        var argp = syscallGetVarargP();
        return FS.ioctl(stream, op, argp);
      }

     case 21523:
      {
        // TODO: in theory we should write to the winsize struct that gets
        // passed in, but for now musl doesn't read anything on it
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tiocgwinsz) {
          var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
          var argp = syscallGetVarargP();
          HEAP16[((argp) >>> 1) >>> 0] = winsize[0];
          HEAP16[(((argp) + (2)) >>> 1) >>> 0] = winsize[1];
        }
        return 0;
      }

     case 21524:
      {
        // TODO: technically, this ioctl call should change the window size.
        // but, since emscripten doesn't have any concept of a terminal window
        // yet, we'll just silently throw it away as we do TIOCGWINSZ
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
  } // not supported
  catch (e) {
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
    // remove a trailing slash, if one - /a/b/ has basename of '', but
    // we want to create b in the context of this function
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
    flags = flags & (~6400);
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
    var mode = varargs ? syscallGetVarargI() : 0;
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var PIPEFS = {
  BUCKET_BUFFER_SIZE: 8192,
  mount(mount) {
    // Do not pollute the real root directory or its child nodes with pipes
    // Looks like it is OK to create another pseudo-root node not linked to the FS.root hierarchy this way
    return FS.createNode(null, "/", 16384 | 511, /* 0777 */ 0);
  },
  createPipe() {
    var pipe = {
      buckets: [],
      // refcnt 2 because pipe has a read end and a write end. We need to be
      // able to read from the read end after write end is closed.
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
        return (256 | 4);
      }
      if (pipe.buckets.length > 0) {
        for (var i = 0; i < pipe.buckets.length; i++) {
          var bucket = pipe.buckets[i];
          if (bucket.offset - bucket.roffset > 0) {
            return (64 | 1);
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
      /* ignored */ var pipe = stream.node.pipe;
      var currentLength = 0;
      for (var i = 0; i < pipe.buckets.length; i++) {
        var bucket = pipe.buckets[i];
        currentLength += bucket.offset - bucket.roffset;
      }
      var data = buffer.subarray(offset, offset + length);
      if (length <= 0) {
        return 0;
      }
      if (currentLength == 0) {
        // Behave as if the read end is always non-blocking
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
        // Do not generate excessive garbage in use cases such as
        // write several bytes, read everything, write several bytes, read everything...
        toRemove--;
        pipe.buckets[toRemove].offset = 0;
        pipe.buckets[toRemove].roffset = 0;
      }
      pipe.buckets.splice(0, toRemove);
      return totalRead;
    },
    write(stream, buffer, offset, length, position) {
      /* ignored */ var pipe = stream.node.pipe;
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
      var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
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
    return "pipe[" + (PIPEFS.nextname.current++) + "]";
  }
};

function ___syscall_pipe(fdPtr) {
  fdPtr >>>= 0;
  try {
    if (fdPtr == 0) {
      throw new FS.ErrnoError(21);
    }
    var res = PIPEFS.createPipe();
    HEAP32[((fdPtr) >>> 2) >>> 0] = res.readable_fd;
    HEAP32[(((fdPtr) + (4)) >>> 2) >>> 0] = res.writable_fd;
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
      var fd = HEAP32[((pollfd) >>> 2) >>> 0];
      var events = HEAP16[(((pollfd) + (4)) >>> 1) >>> 0];
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
      HEAP16[(((pollfd) + (6)) >>> 1) >>> 0] = mask;
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
    // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
    // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
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
    // socket is closed
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
      // send, no address provided
      return FS.write(sock.stream, HEAP8, message, length);
    }
    // sendto an address
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

function ___syscall_statfs64(path, size, buf) {
  path >>>= 0;
  size >>>= 0;
  buf >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    // NOTE: None of the constants here are true. We're just returning safe and
    //       sane values.
    HEAP32[(((buf) + (4)) >>> 2) >>> 0] = 4096;
    HEAP32[(((buf) + (40)) >>> 2) >>> 0] = 4096;
    HEAP32[(((buf) + (8)) >>> 2) >>> 0] = 1e6;
    HEAP32[(((buf) + (12)) >>> 2) >>> 0] = 5e5;
    HEAP32[(((buf) + (16)) >>> 2) >>> 0] = 5e5;
    HEAP32[(((buf) + (20)) >>> 2) >>> 0] = FS.nextInode;
    HEAP32[(((buf) + (24)) >>> 2) >>> 0] = 1e6;
    HEAP32[(((buf) + (28)) >>> 2) >>> 0] = 42;
    HEAP32[(((buf) + (44)) >>> 2) >>> 0] = 2;
    // ST_NOSUID
    HEAP32[(((buf) + (36)) >>> 2) >>> 0] = 255;
    return 0;
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

var readI53FromI64 = ptr => HEAPU32[((ptr) >>> 2) >>> 0] + HEAP32[(((ptr) + (4)) >>> 2) >>> 0] * 4294967296;

function ___syscall_utimensat(dirfd, path, times, flags) {
  path >>>= 0;
  times >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path, true);
    var now = Date.now(), atime, mtime;
    if (!times) {
      atime = now;
      mtime = now;
    } else {
      var seconds = readI53FromI64(times);
      var nanoseconds = HEAP32[(((times) + (8)) >>> 2) >>> 0];
      if (nanoseconds == 1073741823) {
        atime = now;
      } else if (nanoseconds == 1073741822) {
        atime = -1;
      } else {
        atime = (seconds * 1e3) + (nanoseconds / (1e3 * 1e3));
      }
      times += 16;
      seconds = readI53FromI64(times);
      nanoseconds = HEAP32[(((times) + (8)) >>> 2) >>> 0];
      if (nanoseconds == 1073741823) {
        mtime = now;
      } else if (nanoseconds == 1073741822) {
        mtime = -1;
      } else {
        mtime = (seconds * 1e3) + (nanoseconds / (1e3 * 1e3));
      }
    }
    // -1 here means UTIME_OMIT was passed.  FS.utime tables the max of these
    // two values and sets the timestamp to that single value.  If both were
    // set to UTIME_OMIT then we can skip the call completely.
    if (mtime != -1 || atime != -1) {
      FS.utime(path, atime, mtime);
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var __abort_js = () => {
  abort("");
};

var nowIsMonotonic = 1;

var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;

function __emscripten_lookup_name(name) {
  name >>>= 0;
  // uint32_t _emscripten_lookup_name(const char *name);
  var nameString = UTF8ToString(name);
  return inetPton4(DNS.lookup_name(nameString));
}

function __emscripten_memcpy_js(dest, src, num) {
  dest >>>= 0;
  src >>>= 0;
  num >>>= 0;
  return HEAPU8.copyWithin(dest >>> 0, src >>> 0, src + num >>> 0);
}

var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};

var __emscripten_throw_longjmp = () => {
  throw Infinity;
};

function __gmtime_js(time_low, time_high, tmPtr) {
  var time = convertI32PairToI53Checked(time_low, time_high);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  HEAP32[((tmPtr) >>> 2) >>> 0] = date.getUTCSeconds();
  HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getUTCMinutes();
  HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getUTCHours();
  HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getUTCDate();
  HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getUTCMonth();
  HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getUTCFullYear() - 1900;
  HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
}

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
  // -1 since it's days since Jan 1
  return yday;
};

function __localtime_js(time_low, time_high, tmPtr) {
  var time = convertI32PairToI53Checked(time_low, time_high);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  HEAP32[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
  HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
  HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
  HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
  HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
  HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getFullYear() - 1900;
  HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
  HEAP32[(((tmPtr) + (36)) >>> 2) >>> 0] = -(date.getTimezoneOffset() * 60);
  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  HEAP32[(((tmPtr) + (32)) >>> 2) >>> 0] = dst;
}

var __mktime_js = function(tmPtr) {
  tmPtr >>>= 0;
  var ret = (() => {
    var date = new Date(HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] + 1900, HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0], HEAP32[((tmPtr) >>> 2) >>> 0], 0);
    // There's an ambiguous hour when the time goes back; the tm_isdst field is
    // used to disambiguate it.  Date() basically guesses, so we fix it up if it
    // guessed wrong, or fill in tm_isdst with the guess if it's -1.
    var dst = HEAP32[(((tmPtr) + (32)) >>> 2) >>> 0];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    // DST is in December in South
    if (dst < 0) {
      // Attention: some regions don't have DST at all.
      HEAP32[(((tmPtr) + (32)) >>> 2) >>> 0] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
    } else if ((dst > 0) != (dstOffset == guessedOffset)) {
      var nonDstOffset = Math.max(winterOffset, summerOffset);
      var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
      // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
      date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
    }
    HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
    var yday = ydayFromDate(date) | 0;
    HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
    // To match expected behavior, update fields from date
    HEAP32[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
    HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
    HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
    HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
    HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
    HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getYear();
    var timeMs = date.getTime();
    if (isNaN(timeMs)) {
      return -1;
    }
    // Return time in microseconds
    return timeMs / 1e3;
  })();
  return (setTempRet0((tempDouble = ret, (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0)),
  ret >>> 0);
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
    HEAP32[((allocated) >>> 2) >>> 0] = res.allocated;
    HEAPU32[((addr) >>> 2) >>> 0] = ptr;
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
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (prot & 2) {
      SYSCALLS.doMsync(addr, stream, len, flags, offset);
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var timers = {};

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var _proc_exit = code => {
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    Module["onExit"]?.(code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
};

/** @suppress {duplicate } */ /** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
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

var _emscripten_get_now = () => performance.now();

var __setitimer_js = (which, timeout_ms) => {
  // First, clear any existing timer.
  if (timers[which]) {
    clearTimeout(timers[which].id);
    delete timers[which];
  }
  // A timeout of zero simply cancels the current timeout so we have nothing
  // more to do.
  if (!timeout_ms) return 0;
  var id = setTimeout(() => {
    delete timers[which];
    callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
  }, timeout_ms);
  timers[which] = {
    id,
    timeout_ms
  };
  return 0;
};

var __tzset_js = function(timezone, daylight, std_name, dst_name) {
  timezone >>>= 0;
  daylight >>>= 0;
  std_name >>>= 0;
  dst_name >>>= 0;
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  // Local standard timezone offset. Local standard time is not adjusted for
  // daylight savings.  This code uses the fact that getTimezoneOffset returns
  // a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it
  // compares whether the output of the given date the same (Standard) or less
  // (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  HEAPU32[((timezone) >>> 2) >>> 0] = stdTimezoneOffset * 60;
  HEAP32[((daylight) >>> 2) >>> 0] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
    // Why inverse sign?
    // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

/** @type {function(...*):?} */ function _crc32() {
  abort("missing function: crc32");
}

_crc32.stub = true;

/** @type {function(...*):?} */ function _deflate() {
  abort("missing function: deflate");
}

_deflate.stub = true;

/** @type {function(...*):?} */ function _deflateEnd() {
  abort("missing function: deflateEnd");
}

_deflateEnd.stub = true;

/** @type {function(...*):?} */ function _deflateInit2_() {
  abort("missing function: deflateInit2_");
}

_deflateInit2_.stub = true;

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
  // Most arguments are i32s, so shift the buffer pointer so it is a plain
  // index into HEAP32.
  while (ch = HEAPU8[sigPtr++ >>> 0]) {
    // Floats are always passed as doubles, so all types except for 'i'
    // are 8 bytes and require alignment.
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(// Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
    ch == 112 ? HEAPU32[((buf) >>> 2) >>> 0] : ch == 105 ? HEAP32[((buf) >>> 2) >>> 0] : HEAPF64[((buf) >>> 3) >>> 0]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[code](...args);
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

var _emscripten_date_now = () => Date.now();

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
4294901760;

function _emscripten_get_heap_max() {
  return getHeapMax();
}

var growMemory = size => {
  var b = wasmMemory.buffer;
  var pages = (size - b.byteLength + 65535) / 65536;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } /*success*/ catch (e) {}
};

// implicit 0 return to save code size (caller will cast "undefined" into 0
// anyhow)
function _emscripten_resize_heap(requestedSize) {
  requestedSize >>>= 0;
  var oldSize = HEAPU8.length;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.
  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
    // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
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
    // Default values.
    // Browser language detection #8751
    var lang = ((typeof navigator == "object" && navigator.languages && navigator.languages[0]) || "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
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
  // Null-terminate the string
  HEAP8[buffer >>> 0] = 0;
};

var _environ_get = function(__environ, environ_buf) {
  __environ >>>= 0;
  environ_buf >>>= 0;
  var bufSize = 0;
  getEnvStrings().forEach((string, i) => {
    var ptr = environ_buf + bufSize;
    HEAPU32[(((__environ) + (i * 4)) >>> 2) >>> 0] = ptr;
    stringToAscii(string, ptr);
    bufSize += string.length + 1;
  });
  return 0;
};

var _environ_sizes_get = function(penviron_count, penviron_buf_size) {
  penviron_count >>>= 0;
  penviron_buf_size >>>= 0;
  var strings = getEnvStrings();
  HEAPU32[((penviron_count) >>> 2) >>> 0] = strings.length;
  var bufSize = 0;
  strings.forEach(string => bufSize += string.length + 1);
  HEAPU32[((penviron_buf_size) >>> 2) >>> 0] = bufSize;
  return 0;
};

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
      // All character devices are terminals (other things a Linux system would
      // assume is a character device, like the mouse, we have special APIs for).
      var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
    }
    HEAP8[pbuf >>> 0] = type;
    HEAP16[(((pbuf) + (2)) >>> 1) >>> 0] = flags;
    (tempI64 = [ rightsBase >>> 0, (tempDouble = rightsBase, (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[(((pbuf) + (8)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((pbuf) + (12)) >>> 2) >>> 0] = tempI64[1]);
    (tempI64 = [ rightsInheriting >>> 0, (tempDouble = rightsInheriting, (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[(((pbuf) + (16)) >>> 2) >>> 0] = tempI64[0], HEAP32[(((pbuf) + (20)) >>> 2) >>> 0] = tempI64[1]);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doReadv = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[((iov) >>> 2) >>> 0];
    var len = HEAPU32[(((iov) + (4)) >>> 2) >>> 0];
    iov += 8;
    var curr = FS.read(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break;
    // nothing more to read
    if (typeof offset != "undefined") {
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
    HEAPU32[((pnum) >>> 2) >>> 0] = num;
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
    (tempI64 = [ stream.position >>> 0, (tempDouble = stream.position, (+(Math.abs(tempDouble))) >= 1 ? (tempDouble > 0 ? (+(Math.floor((tempDouble) / 4294967296))) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296))))) >>> 0) : 0) ],
    HEAP32[((newOffset) >>> 2) >>> 0] = tempI64[0], HEAP32[(((newOffset) + (4)) >>> 2) >>> 0] = tempI64[1]);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    // reset readdir state
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

var _fd_sync = function(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return Asyncify.handleSleep(wakeUp => {
      var mount = stream.node.mount;
      if (!mount.type.syncfs) {
        // We write directly to the file system, so there's nothing to do here.
        wakeUp(0);
        return;
      }
      mount.type.syncfs(mount, false, err => {
        if (err) {
          wakeUp(29);
          return;
        }
        wakeUp(0);
      });
    });
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
};

_fd_sync.isAsync = true;

/** @param {number=} offset */ var doWritev = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[((iov) >>> 2) >>> 0];
    var len = HEAPU32[(((iov) + (4)) >>> 2) >>> 0];
    iov += 8;
    var curr = FS.write(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) {
      // No more space to write.
      break;
    }
    if (typeof offset != "undefined") {
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
    HEAPU32[((pnum) >>> 2) >>> 0] = num;
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
    HEAP32[(((ai) + (4)) >>> 2) >>> 0] = family;
    HEAP32[(((ai) + (8)) >>> 2) >>> 0] = type;
    HEAP32[(((ai) + (12)) >>> 2) >>> 0] = proto;
    HEAPU32[(((ai) + (24)) >>> 2) >>> 0] = canon;
    HEAPU32[(((ai) + (20)) >>> 2) >>> 0] = sa;
    if (family === 10) {
      HEAP32[(((ai) + (16)) >>> 2) >>> 0] = 28;
    } else {
      HEAP32[(((ai) + (16)) >>> 2) >>> 0] = 16;
    }
    HEAP32[(((ai) + (28)) >>> 2) >>> 0] = 0;
    return ai;
  }
  if (hint) {
    flags = HEAP32[((hint) >>> 2) >>> 0];
    family = HEAP32[(((hint) + (4)) >>> 2) >>> 0];
    type = HEAP32[(((hint) + (8)) >>> 2) >>> 0];
    proto = HEAP32[(((hint) + (12)) >>> 2) >>> 0];
  }
  if (type && !proto) {
    proto = type === 2 ? 17 : 6;
  }
  if (!type && proto) {
    type = proto === 17 ? 2 : 1;
  }
  // If type or proto are set to zero in hints we should really be returning multiple addrinfo values, but for
  // now default to a TCP STREAM socket so we can at least return a sensible addrinfo given NULL hints.
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
  if (hint !== 0 && (HEAP32[((hint) >>> 2) >>> 0] & 2) && !node) {
    return -1;
  }
  if (flags & 32) {
    // TODO
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
      // TODO support resolving well-known service names from:
      // http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt
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
    HEAPU32[((out) >>> 2) >>> 0] = ai;
    return 0;
  }
  // try as a numeric address
  node = UTF8ToString(node);
  addr = inetPton4(node);
  if (addr !== null) {
    // incoming node is a valid ipv4 address
    if (family === 0 || family === 2) {
      family = 2;
    } else if (family === 10 && (flags & 8)) {
      addr = [ 0, 0, _htonl(65535), addr ];
      family = 10;
    } else {
      return -2;
    }
  } else {
    addr = inetPton6(node);
    if (addr !== null) {
      // incoming node is a valid ipv6 address
      if (family === 0 || family === 10) {
        family = 10;
      } else {
        return -2;
      }
    }
  }
  if (addr != null) {
    ai = allocaddrinfo(family, type, proto, node, addr, port);
    HEAPU32[((out) >>> 2) >>> 0] = ai;
    return 0;
  }
  if (flags & 4) {
    return -2;
  }
  // try as a hostname
  // resolve the hostname to a temporary fake address
  node = DNS.lookup_name(node);
  addr = inetPton4(node);
  if (family === 0) {
    family = 2;
  } else if (family === 10) {
    addr = [ 0, 0, _htonl(65535), addr ];
  }
  ai = allocaddrinfo(family, type, proto, null, addr, port);
  HEAPU32[((out) >>> 2) >>> 0] = ai;
  return 0;
}

/** @type {function(...*):?} */ function _getcontext() {
  abort("missing function: getcontext");
}

_getcontext.stub = true;

/** @type {function(...*):?} */ function _getdtablesize() {
  abort("missing function: getdtablesize");
}

_getdtablesize.stub = true;

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
    if ((flags & 1) || !(lookup = DNS.lookup_addr(addr))) {
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
    // Note: even when we overflow, getnameinfo() is specced to write out the truncated results.
    return -12;
  }
  return 0;
}

var Protocols = {
  list: [],
  map: {}
};

var _setprotoent = stayopen => {
  // void setprotoent(int stayopen);
  // Allocate and populate a protoent structure given a name, protocol number and array of aliases
  function allocprotoent(name, proto, aliases) {
    // write name into buffer
    var nameBuf = _malloc(name.length + 1);
    stringToAscii(name, nameBuf);
    // write aliases into buffer
    var j = 0;
    var length = aliases.length;
    var aliasListBuf = _malloc((length + 1) * 4);
    // Use length + 1 so we have space for the terminating NULL ptr.
    for (var i = 0; i < length; i++, j += 4) {
      var alias = aliases[i];
      var aliasBuf = _malloc(alias.length + 1);
      stringToAscii(alias, aliasBuf);
      HEAPU32[(((aliasListBuf) + (j)) >>> 2) >>> 0] = aliasBuf;
    }
    HEAPU32[(((aliasListBuf) + (j)) >>> 2) >>> 0] = 0;
    // Terminating NULL pointer.
    // generate protoent
    var pe = _malloc(12);
    HEAPU32[((pe) >>> 2) >>> 0] = nameBuf;
    HEAPU32[(((pe) + (4)) >>> 2) >>> 0] = aliasListBuf;
    HEAP32[(((pe) + (8)) >>> 2) >>> 0] = proto;
    return pe;
  }
  // Populate the protocol 'database'. The entries are limited to tcp and udp, though it is fairly trivial
  // to add extra entries from /etc/protocols if desired - though not sure if that'd actually be useful.
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
  // struct protoent *getprotobyname(const char *);
  name = UTF8ToString(name);
  _setprotoent(true);
  var result = Protocols.map[name];
  return result;
}

function _getprotobynumber(number) {
  // struct protoent *getprotobynumber(int proto);
  _setprotoent(true);
  var result = Protocols.map[number];
  return result;
}

/** @type {function(...*):?} */ function _inflate() {
  abort("missing function: inflate");
}

_inflate.stub = true;

/** @type {function(...*):?} */ function _inflateEnd() {
  abort("missing function: inflateEnd");
}

_inflateEnd.stub = true;

/** @type {function(...*):?} */ function _inflateInit2_() {
  abort("missing function: inflateInit2_");
}

_inflateInit2_.stub = true;

/** @type {function(...*):?} */ function _makecontext() {
  abort("missing function: makecontext");
}

_makecontext.stub = true;

/** @type {function(...*):?} */ function _posix_spawnp() {
  abort("missing function: posix_spawnp");
}

_posix_spawnp.stub = true;

var arraySum = (array, index) => {
  var sum = 0;
  for (var i = 0; i <= index; sum += array[i++]) {}
  // no-op
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
      // we spill over to next month
      days -= (daysInCurrentMonth - newDate.getDate() + 1);
      newDate.setDate(1);
      if (currentMonth < 11) {
        newDate.setMonth(currentMonth + 1);
      } else {
        newDate.setMonth(0);
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
    } else {
      // we stay in current month
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }
  }
  return newDate;
};

function _strptime(buf, format, tm) {
  buf >>>= 0;
  format >>>= 0;
  tm >>>= 0;
  // char *strptime(const char *restrict buf, const char *restrict format, struct tm *restrict tm);
  // http://pubs.opengroup.org/onlinepubs/009695399/functions/strptime.html
  var pattern = UTF8ToString(format);
  // escape special characters
  // TODO: not sure we really need to escape all of these in JS regexps
  var SPECIAL_CHARS = "\\!@#$^&*()+=-[]/{}|:<>?,.";
  for (var i = 0, ii = SPECIAL_CHARS.length; i < ii; ++i) {
    pattern = pattern.replace(new RegExp("\\" + SPECIAL_CHARS[i], "g"), "\\" + SPECIAL_CHARS[i]);
  }
  // reduce number of matchers
  var EQUIVALENT_MATCHERS = {
    "A": "%a",
    "B": "%b",
    "c": "%a %b %d %H:%M:%S %Y",
    "D": "%m\\/%d\\/%y",
    "e": "%d",
    "F": "%Y-%m-%d",
    "h": "%b",
    "R": "%H\\:%M",
    "r": "%I\\:%M\\:%S\\s%p",
    "T": "%H\\:%M\\:%S",
    "x": "%m\\/%d\\/(?:%y|%Y)",
    "X": "%H\\:%M\\:%S"
  };
  // TODO: take care of locale
  var DATE_PATTERNS = {
    /* weekday name */ "a": "(?:Sun(?:day)?)|(?:Mon(?:day)?)|(?:Tue(?:sday)?)|(?:Wed(?:nesday)?)|(?:Thu(?:rsday)?)|(?:Fri(?:day)?)|(?:Sat(?:urday)?)",
    /* month name */ "b": "(?:Jan(?:uary)?)|(?:Feb(?:ruary)?)|(?:Mar(?:ch)?)|(?:Apr(?:il)?)|May|(?:Jun(?:e)?)|(?:Jul(?:y)?)|(?:Aug(?:ust)?)|(?:Sep(?:tember)?)|(?:Oct(?:ober)?)|(?:Nov(?:ember)?)|(?:Dec(?:ember)?)",
    /* century */ "C": "\\d\\d",
    /* day of month */ "d": "0[1-9]|[1-9](?!\\d)|1\\d|2\\d|30|31",
    /* hour (24hr) */ "H": "\\d(?!\\d)|[0,1]\\d|20|21|22|23",
    /* hour (12hr) */ "I": "\\d(?!\\d)|0\\d|10|11|12",
    /* day of year */ "j": "00[1-9]|0?[1-9](?!\\d)|0?[1-9]\\d(?!\\d)|[1,2]\\d\\d|3[0-6]\\d",
    /* month */ "m": "0[1-9]|[1-9](?!\\d)|10|11|12",
    /* minutes */ "M": "0\\d|\\d(?!\\d)|[1-5]\\d",
    /* whitespace */ "n": " ",
    /* AM/PM */ "p": "AM|am|PM|pm|A\\.M\\.|a\\.m\\.|P\\.M\\.|p\\.m\\.",
    /* seconds */ "S": "0\\d|\\d(?!\\d)|[1-5]\\d|60",
    /* week number */ "U": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
    /* week number */ "W": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
    /* weekday number */ "w": "[0-6]",
    /* 2-digit year */ "y": "\\d\\d",
    /* 4-digit year */ "Y": "\\d\\d\\d\\d",
    /* whitespace */ "t": " ",
    /* time zone */ "z": "Z|(?:[\\+\\-]\\d\\d:?(?:\\d\\d)?)"
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
  var capture = [];
  var pattern_out = pattern.replace(/%(.)/g, (m, c) => EQUIVALENT_MATCHERS[c] || m).replace(/%(.)/g, (_, c) => {
    let pat = DATE_PATTERNS[c];
    if (pat) {
      capture.push(c);
      return `(${pat})`;
    } else {
      return c;
    }
  }).replace(// any number of space or tab characters match zero or more spaces
  /\s+/g, "\\s*");
  var matches = new RegExp("^" + pattern_out, "i").exec(UTF8ToString(buf));
  function initDate() {
    function fixup(value, min, max) {
      return (typeof value != "number" || isNaN(value)) ? min : (value >= min ? (value <= max ? value : max) : min);
    }
    return {
      year: fixup(HEAP32[(((tm) + (20)) >>> 2) >>> 0] + 1900, 1970, 9999),
      month: fixup(HEAP32[(((tm) + (16)) >>> 2) >>> 0], 0, 11),
      day: fixup(HEAP32[(((tm) + (12)) >>> 2) >>> 0], 1, 31),
      hour: fixup(HEAP32[(((tm) + (8)) >>> 2) >>> 0], 0, 23),
      min: fixup(HEAP32[(((tm) + (4)) >>> 2) >>> 0], 0, 59),
      sec: fixup(HEAP32[((tm) >>> 2) >>> 0], 0, 59),
      gmtoff: 0
    };
  }
  if (matches) {
    var date = initDate();
    var value;
    var getMatch = symbol => {
      var pos = capture.indexOf(symbol);
      // check if symbol appears in regexp
      if (pos >= 0) {
        // return matched value or null (falsy!) for non-matches
        return matches[pos + 1];
      }
      return;
    };
    // seconds
    if ((value = getMatch("S"))) {
      date.sec = jstoi_q(value);
    }
    // minutes
    if ((value = getMatch("M"))) {
      date.min = jstoi_q(value);
    }
    // hours
    if ((value = getMatch("H"))) {
      // 24h clock
      date.hour = jstoi_q(value);
    } else if ((value = getMatch("I"))) {
      // AM/PM clock
      var hour = jstoi_q(value);
      if ((value = getMatch("p"))) {
        hour += value.toUpperCase()[0] === "P" ? 12 : 0;
      }
      date.hour = hour;
    }
    // year
    if ((value = getMatch("Y"))) {
      // parse from four-digit year
      date.year = jstoi_q(value);
    } else if ((value = getMatch("y"))) {
      // parse from two-digit year...
      var year = jstoi_q(value);
      if ((value = getMatch("C"))) {
        // ...and century
        year += jstoi_q(value) * 100;
      } else {
        // ...and rule-of-thumb
        year += year < 69 ? 2e3 : 1900;
      }
      date.year = year;
    }
    // month
    if ((value = getMatch("m"))) {
      // parse from month number
      date.month = jstoi_q(value) - 1;
    } else if ((value = getMatch("b"))) {
      // parse from month name
      date.month = MONTH_NUMBERS[value.substring(0, 3).toUpperCase()] || 0;
    }
    // day
    if ((value = getMatch("d"))) {
      // get day of month directly
      date.day = jstoi_q(value);
    } else if ((value = getMatch("j"))) {
      // get day of month from day of year ...
      var day = jstoi_q(value);
      var leapYear = isLeapYear(date.year);
      for (var month = 0; month < 12; ++month) {
        var daysUntilMonth = arraySum(leapYear ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, month - 1);
        if (day <= daysUntilMonth + (leapYear ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[month]) {
          date.day = day - daysUntilMonth;
        }
      }
    } else if ((value = getMatch("a"))) {
      // get day of month from weekday ...
      var weekDay = value.substring(0, 3).toUpperCase();
      if ((value = getMatch("U"))) {
        // ... and week number (Sunday being first day of week)
        // Week number of the year (Sunday as the first day of the week) as a decimal number [00,53].
        // All days in a new year preceding the first Sunday are considered to be in week 0.
        var weekDayNumber = DAY_NUMBERS_SUN_FIRST[weekDay];
        var weekNumber = jstoi_q(value);
        // January 1st
        var janFirst = new Date(date.year, 0, 1);
        var endDate;
        if (janFirst.getDay() === 0) {
          // Jan 1st is a Sunday, and, hence in the 1st CW
          endDate = addDays(janFirst, weekDayNumber + 7 * (weekNumber - 1));
        } else {
          // Jan 1st is not a Sunday, and, hence still in the 0th CW
          endDate = addDays(janFirst, 7 - janFirst.getDay() + weekDayNumber + 7 * (weekNumber - 1));
        }
        date.day = endDate.getDate();
        date.month = endDate.getMonth();
      } else if ((value = getMatch("W"))) {
        // ... and week number (Monday being first day of week)
        // Week number of the year (Monday as the first day of the week) as a decimal number [00,53].
        // All days in a new year preceding the first Monday are considered to be in week 0.
        var weekDayNumber = DAY_NUMBERS_MON_FIRST[weekDay];
        var weekNumber = jstoi_q(value);
        // January 1st
        var janFirst = new Date(date.year, 0, 1);
        var endDate;
        if (janFirst.getDay() === 1) {
          // Jan 1st is a Monday, and, hence in the 1st CW
          endDate = addDays(janFirst, weekDayNumber + 7 * (weekNumber - 1));
        } else {
          // Jan 1st is not a Monday, and, hence still in the 0th CW
          endDate = addDays(janFirst, 7 - janFirst.getDay() + 1 + weekDayNumber + 7 * (weekNumber - 1));
        }
        date.day = endDate.getDate();
        date.month = endDate.getMonth();
      }
    }
    // time zone
    if ((value = getMatch("z"))) {
      // GMT offset as either 'Z' or +-HH:MM or +-HH or +-HHMM
      if (value.toLowerCase() === "z") {
        date.gmtoff = 0;
      } else {
        var match = value.match(/^((?:\-|\+)\d\d):?(\d\d)?/);
        date.gmtoff = match[1] * 3600;
        if (match[2]) {
          date.gmtoff += date.gmtoff > 0 ? match[2] * 60 : -match[2] * 60;
        }
      }
    }
    /*
        tm_sec  int seconds after the minute  0-61*
        tm_min  int minutes after the hour  0-59
        tm_hour int hours since midnight  0-23
        tm_mday int day of the month  1-31
        tm_mon  int months since January  0-11
        tm_year int years since 1900
        tm_wday int days since Sunday 0-6
        tm_yday int days since January 1  0-365
        tm_isdst  int Daylight Saving Time flag
        tm_gmtoff long offset from GMT (seconds)
        */ var fullDate = new Date(date.year, date.month, date.day, date.hour, date.min, date.sec, 0);
    HEAP32[((tm) >>> 2) >>> 0] = fullDate.getSeconds();
    HEAP32[(((tm) + (4)) >>> 2) >>> 0] = fullDate.getMinutes();
    HEAP32[(((tm) + (8)) >>> 2) >>> 0] = fullDate.getHours();
    HEAP32[(((tm) + (12)) >>> 2) >>> 0] = fullDate.getDate();
    HEAP32[(((tm) + (16)) >>> 2) >>> 0] = fullDate.getMonth();
    HEAP32[(((tm) + (20)) >>> 2) >>> 0] = fullDate.getFullYear() - 1900;
    HEAP32[(((tm) + (24)) >>> 2) >>> 0] = fullDate.getDay();
    HEAP32[(((tm) + (28)) >>> 2) >>> 0] = arraySum(isLeapYear(fullDate.getFullYear()) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, fullDate.getMonth() - 1) + fullDate.getDate() - 1;
    HEAP32[(((tm) + (32)) >>> 2) >>> 0] = 0;
    HEAP32[(((tm) + (36)) >>> 2) >>> 0] = date.gmtoff;
    // we need to convert the matched sequence into an integer array to take care of UTF-8 characters > 0x7F
    // TODO: not sure that intArrayFromString handles all unicode characters correctly
    return buf + intArrayFromString(matches[0]).length - 1;
  }
  return 0;
}

/** @type {function(...*):?} */ function _swapcontext() {
  abort("missing function: swapcontext");
}

_swapcontext.stub = true;

/** @type {function(...*):?} */ function _tokenize() {
  abort("missing function: tokenize");
}

_tokenize.stub = true;

/** @type {function(...*):?} */ function _zError() {
  abort("missing function: zError");
}

_zError.stub = true;

var wasmTableMirror = [];

/** @type {WebAssembly.Table} */ var wasmTable;

var runAndAbortIfError = func => {
  try {
    return func();
  } catch (e) {
    abort(e);
  }
};

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};

var Asyncify = {
  instrumentWasmImports(imports) {
    var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
    for (let [x, original] of Object.entries(imports)) {
      if (typeof original == "function") {
        let isAsyncifyImport = original.isAsync || importPattern.test(x);
      }
    }
  },
  instrumentWasmExports(exports) {
    var ret = {};
    for (let [x, original] of Object.entries(exports)) {
      if (typeof original == "function") {
        ret[x] = (...args) => {
          Asyncify.exportCallStack.push(x);
          try {
            return original(...args);
          } finally {
            if (!ABORT) {
              var y = Asyncify.exportCallStack.pop();
              Asyncify.maybeStopUnwind();
            }
          }
        };
      } else {
        ret[x] = original;
      }
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
  getCallStackId(funcName) {
    var id = Asyncify.callStackNameToId[funcName];
    if (id === undefined) {
      id = Asyncify.callStackId++;
      Asyncify.callStackNameToId[funcName] = id;
      Asyncify.callStackIdToName[id] = funcName;
    }
    return id;
  },
  maybeStopUnwind() {
    if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
      // We just finished unwinding.
      // Be sure to set the state before calling any other functions to avoid
      // possible infinite recursion here (For example in debug pthread builds
      // the dbg() function itself can call back into WebAssembly to get the
      // current pthread_self() pointer).
      Asyncify.state = Asyncify.State.Normal;
      runtimeKeepalivePush();
      // Keep the runtime alive so that a re-wind can be done later.
      runAndAbortIfError(_asyncify_stop_unwind);
      if (typeof Fibers != "undefined") {
        Fibers.trampoline();
      }
    }
  },
  whenDone() {
    return new Promise((resolve, reject) => {
      Asyncify.asyncPromiseHandlers = {
        resolve,
        reject
      };
    });
  },
  allocateData() {
    // An asyncify data structure has three fields:
    //  0  current stack pos
    //  4  max stack pos
    //  8  id of function at bottom of the call stack (callStackIdToName[id] == name of js function)
    // The Asyncify ABI only interprets the first two fields, the rest is for the runtime.
    // We also embed a stack in the same memory region here, right next to the structure.
    // This struct is also defined as asyncify_data_t in emscripten/fiber.h
    var ptr = _malloc(12 + Asyncify.StackSize);
    Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
    Asyncify.setDataRewindFunc(ptr);
    return ptr;
  },
  setDataHeader(ptr, stack, stackSize) {
    HEAPU32[((ptr) >>> 2) >>> 0] = stack;
    HEAPU32[(((ptr) + (4)) >>> 2) >>> 0] = stack + stackSize;
  },
  setDataRewindFunc(ptr) {
    var bottomOfCallStack = Asyncify.exportCallStack[0];
    var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
    HEAP32[(((ptr) + (8)) >>> 2) >>> 0] = rewindId;
  },
  getDataRewindFuncName(ptr) {
    var id = HEAP32[(((ptr) + (8)) >>> 2) >>> 0];
    var name = Asyncify.callStackIdToName[id];
    return name;
  },
  getDataRewindFunc(name) {
    var func = wasmExports[name];
    return func;
  },
  doRewind(ptr) {
    var name = Asyncify.getDataRewindFuncName(ptr);
    var func = Asyncify.getDataRewindFunc(name);
    // Once we have rewound and the stack we no longer need to artificially
    // keep the runtime alive.
    runtimeKeepalivePop();
    return func();
  },
  handleSleep(startAsync) {
    if (ABORT) return;
    if (Asyncify.state === Asyncify.State.Normal) {
      // Prepare to sleep. Call startAsync, and see what happens:
      // if the code decided to call our callback synchronously,
      // then no async operation was in fact begun, and we don't
      // need to do anything.
      var reachedCallback = false;
      var reachedAfterCallback = false;
      startAsync((handleSleepReturnValue = 0) => {
        if (ABORT) return;
        Asyncify.handleSleepReturnValue = handleSleepReturnValue;
        reachedCallback = true;
        if (!reachedAfterCallback) {
          // We are happening synchronously, so no need for async.
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
        // Track whether the return value was handled by any promise handlers.
        var handled = false;
        if (!Asyncify.currData) {
          // All asynchronous execution has finished.
          // `asyncWasmReturnValue` now contains the final
          // return value of the exported async WASM function.
          // Note: `asyncWasmReturnValue` is distinct from
          // `Asyncify.handleSleepReturnValue`.
          // `Asyncify.handleSleepReturnValue` contains the return
          // value of the last C function to have executed
          // `Asyncify.handleSleep()`, where as `asyncWasmReturnValue`
          // contains the return value of the exported WASM function
          // that may have called C functions that
          // call `Asyncify.handleSleep()`.
          var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
          if (asyncPromiseHandlers) {
            Asyncify.asyncPromiseHandlers = null;
            (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
            handled = true;
          }
        }
        if (isError && !handled) {
          // If there was an error and it was not handled by now, we have no choice but to
          // rethrow that error into the global scope where it can be caught only by
          // `onerror` or `onunhandledpromiserejection`.
          throw asyncWasmReturnValue;
        }
      });
      reachedAfterCallback = true;
      if (!reachedCallback) {
        // A true async operation was begun; start a sleep.
        Asyncify.state = Asyncify.State.Unwinding;
        // TODO: reuse, don't alloc/free every sleep
        Asyncify.currData = Asyncify.allocateData();
        if (typeof Browser != "undefined" && Browser.mainLoop.func) {
          Browser.mainLoop.pause();
        }
        runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
      }
    } else if (Asyncify.state === Asyncify.State.Rewinding) {
      // Stop a resume.
      Asyncify.state = Asyncify.State.Normal;
      runAndAbortIfError(_asyncify_stop_rewind);
      _free(Asyncify.currData);
      Asyncify.currData = null;
      // Call all sleep callbacks now that the sleep-resume is all done.
      Asyncify.sleepCallbacks.forEach(callUserCallback);
    } else {
      abort(`invalid state: ${Asyncify.state}`);
    }
    return Asyncify.handleSleepReturnValue;
  },
  handleAsync(startAsync) {
    return Asyncify.handleSleep(wakeUp => {
      // TODO: add error handling as a second param when handleSleep implements it.
      startAsync().then(wakeUp);
    });
  }
};

var getCFunc = ident => {
  var func = Module["_" + ident];
  // closure exported function
  return func;
};

var writeArrayToMemory = (array, buffer) => {
  HEAP8.set(array, buffer >>> 0);
};

var stackAlloc = sz => __emscripten_stack_alloc(sz);

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

/**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */ var ccall = (ident, returnType, argTypes, args, opts) => {
  // For fast lookup of conversion functions
  var toC = {
    "string": str => {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        // null string
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
  // Data for a previous async operation that was in flight before us.
  var previousAsync = Asyncify.currData;
  var ret = func(...cArgs);
  function onDone(ret) {
    runtimeKeepalivePop();
    if (stack !== 0) stackRestore(stack);
    return convertReturnValue(ret);
  }
  var asyncMode = opts?.async;
  // Keep the runtime alive through all calls. Note that this call might not be
  // async, but for simplicity we push and pop in all calls.
  runtimeKeepalivePush();
  if (Asyncify.currData != previousAsync) {
    // This is a new async operation. The wasm is paused and has unwound its stack.
    // We need to return a Promise that resolves the return value
    // once the stack is rewound and execution finishes.
    return Asyncify.whenDone().then(onDone);
  }
  ret = onDone(ret);
  // If this is an async ccall, ensure we return a promise
  if (asyncMode) return Promise.resolve(ret);
  return ret;
};

var FS_createPath = FS.createPath;

var FS_unlink = path => FS.unlink(path);

var FS_createLazyFile = FS.createLazyFile;

var FS_createDevice = FS.createDevice;

FS.createPreloadedFile = FS_createPreloadedFile;

FS.staticInit();

// Set module methods based on EXPORTED_RUNTIME_METHODS
Module["FS_createPath"] = FS.createPath;

Module["FS_createDataFile"] = FS.createDataFile;

Module["FS_createPreloadedFile"] = FS.createPreloadedFile;

Module["FS_unlink"] = FS.unlink;

Module["FS_createLazyFile"] = FS.createLazyFile;

Module["FS_createDevice"] = FS.createDevice;

var wasmImports = {
  /** @export */ __assert_fail: ___assert_fail,
  /** @export */ __asyncjs__pdo_cfd1_real_stmt_execute,
  /** @export */ __asyncjs__pdo_pglite_real_db_handle_factory,
  /** @export */ __asyncjs__pdo_pglite_real_handle_begin,
  /** @export */ __asyncjs__pdo_pglite_real_handle_commit,
  /** @export */ __asyncjs__pdo_pglite_real_handle_rollback,
  /** @export */ __asyncjs__pdo_pglite_real_last_insert_id,
  /** @export */ __asyncjs__pdo_pglite_real_stmt_execute,
  /** @export */ __asyncjs__php_stream_fetch_real_open,
  /** @export */ __asyncjs__vrzno_await_internal,
  /** @export */ __call_sighandler: ___call_sighandler,
  /** @export */ __syscall__newselect: ___syscall__newselect,
  /** @export */ __syscall_accept4: ___syscall_accept4,
  /** @export */ __syscall_bind: ___syscall_bind,
  /** @export */ __syscall_chdir: ___syscall_chdir,
  /** @export */ __syscall_chmod: ___syscall_chmod,
  /** @export */ __syscall_connect: ___syscall_connect,
  /** @export */ __syscall_dup: ___syscall_dup,
  /** @export */ __syscall_faccessat: ___syscall_faccessat,
  /** @export */ __syscall_fchmod: ___syscall_fchmod,
  /** @export */ __syscall_fchownat: ___syscall_fchownat,
  /** @export */ __syscall_fcntl64: ___syscall_fcntl64,
  /** @export */ __syscall_fdatasync: ___syscall_fdatasync,
  /** @export */ __syscall_fstat64: ___syscall_fstat64,
  /** @export */ __syscall_ftruncate64: ___syscall_ftruncate64,
  /** @export */ __syscall_getcwd: ___syscall_getcwd,
  /** @export */ __syscall_getdents64: ___syscall_getdents64,
  /** @export */ __syscall_getpeername: ___syscall_getpeername,
  /** @export */ __syscall_getsockname: ___syscall_getsockname,
  /** @export */ __syscall_getsockopt: ___syscall_getsockopt,
  /** @export */ __syscall_ioctl: ___syscall_ioctl,
  /** @export */ __syscall_listen: ___syscall_listen,
  /** @export */ __syscall_lstat64: ___syscall_lstat64,
  /** @export */ __syscall_mkdirat: ___syscall_mkdirat,
  /** @export */ __syscall_newfstatat: ___syscall_newfstatat,
  /** @export */ __syscall_openat: ___syscall_openat,
  /** @export */ __syscall_pipe: ___syscall_pipe,
  /** @export */ __syscall_poll: ___syscall_poll,
  /** @export */ __syscall_readlinkat: ___syscall_readlinkat,
  /** @export */ __syscall_recvfrom: ___syscall_recvfrom,
  /** @export */ __syscall_renameat: ___syscall_renameat,
  /** @export */ __syscall_rmdir: ___syscall_rmdir,
  /** @export */ __syscall_sendto: ___syscall_sendto,
  /** @export */ __syscall_socket: ___syscall_socket,
  /** @export */ __syscall_stat64: ___syscall_stat64,
  /** @export */ __syscall_statfs64: ___syscall_statfs64,
  /** @export */ __syscall_symlink: ___syscall_symlink,
  /** @export */ __syscall_unlinkat: ___syscall_unlinkat,
  /** @export */ __syscall_utimensat: ___syscall_utimensat,
  /** @export */ _abort_js: __abort_js,
  /** @export */ _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
  /** @export */ _emscripten_lookup_name: __emscripten_lookup_name,
  /** @export */ _emscripten_memcpy_js: __emscripten_memcpy_js,
  /** @export */ _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
  /** @export */ _emscripten_throw_longjmp: __emscripten_throw_longjmp,
  /** @export */ _gmtime_js: __gmtime_js,
  /** @export */ _localtime_js: __localtime_js,
  /** @export */ _mktime_js: __mktime_js,
  /** @export */ _mmap_js: __mmap_js,
  /** @export */ _munmap_js: __munmap_js,
  /** @export */ _setitimer_js: __setitimer_js,
  /** @export */ _tzset_js: __tzset_js,
  /** @export */ crc32: _crc32,
  /** @export */ deflate: _deflate,
  /** @export */ deflateEnd: _deflateEnd,
  /** @export */ deflateInit2_: _deflateInit2_,
  /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
  /** @export */ emscripten_asm_const_ptr: _emscripten_asm_const_ptr,
  /** @export */ emscripten_date_now: _emscripten_date_now,
  /** @export */ emscripten_get_heap_max: _emscripten_get_heap_max,
  /** @export */ emscripten_get_now: _emscripten_get_now,
  /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */ environ_get: _environ_get,
  /** @export */ environ_sizes_get: _environ_sizes_get,
  /** @export */ exit: _exit,
  /** @export */ fd_close: _fd_close,
  /** @export */ fd_fdstat_get: _fd_fdstat_get,
  /** @export */ fd_read: _fd_read,
  /** @export */ fd_seek: _fd_seek,
  /** @export */ fd_sync: _fd_sync,
  /** @export */ fd_write: _fd_write,
  /** @export */ getaddrinfo: _getaddrinfo,
  /** @export */ getcontext: _getcontext,
  /** @export */ getdtablesize: _getdtablesize,
  /** @export */ getnameinfo: _getnameinfo,
  /** @export */ getprotobyname: _getprotobyname,
  /** @export */ getprotobynumber: _getprotobynumber,
  /** @export */ inflate: _inflate,
  /** @export */ inflateEnd: _inflateEnd,
  /** @export */ inflateInit2_: _inflateInit2_,
  /** @export */ invoke_i,
  /** @export */ invoke_ii,
  /** @export */ invoke_iii,
  /** @export */ invoke_iiii,
  /** @export */ invoke_iiiii,
  /** @export */ invoke_iiiiii,
  /** @export */ invoke_iiiiiii,
  /** @export */ invoke_iiiiiiii,
  /** @export */ invoke_iiiiiiiiii,
  /** @export */ invoke_v,
  /** @export */ invoke_vi,
  /** @export */ invoke_vii,
  /** @export */ invoke_viii,
  /** @export */ invoke_viiii,
  /** @export */ invoke_viiiiii,
  /** @export */ makecontext: _makecontext,
  /** @export */ posix_spawnp: _posix_spawnp,
  /** @export */ proc_exit: _proc_exit,
  /** @export */ strptime: _strptime,
  /** @export */ swapcontext: _swapcontext,
  /** @export */ tokenize: _tokenize,
  /** @export */ zError: _zError
};

Object.assign(wasmExports, createWasm());

var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["__wasm_call_ctors"])();

var _php_time = Module["_php_time"] = () => (_php_time = Module["_php_time"] = wasmExports["php_time"])();

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

var _zend_wrong_parameters_count_error = Module["_zend_wrong_parameters_count_error"] = (a0, a1) => (_zend_wrong_parameters_count_error = Module["_zend_wrong_parameters_count_error"] = wasmExports["zend_wrong_parameters_count_error"])(a0, a1);

var _zend_wrong_parameter_error = Module["_zend_wrong_parameter_error"] = (a0, a1, a2, a3, a4) => (_zend_wrong_parameter_error = Module["_zend_wrong_parameter_error"] = wasmExports["zend_wrong_parameter_error"])(a0, a1, a2, a3, a4);

var _php_error_docref = Module["_php_error_docref"] = (a0, a1, a2, a3) => (_php_error_docref = Module["_php_error_docref"] = wasmExports["php_error_docref"])(a0, a1, a2, a3);

var _php_date_set_tzdb = Module["_php_date_set_tzdb"] = a0 => (_php_date_set_tzdb = Module["_php_date_set_tzdb"] = wasmExports["php_date_set_tzdb"])(a0);

var _php_version_compare = Module["_php_version_compare"] = (a0, a1) => (_php_version_compare = Module["_php_version_compare"] = wasmExports["php_version_compare"])(a0, a1);

var _php_parse_date = Module["_php_parse_date"] = (a0, a1) => (_php_parse_date = Module["_php_parse_date"] = wasmExports["php_parse_date"])(a0, a1);

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

var _zval_get_string_func = Module["_zval_get_string_func"] = a0 => (_zval_get_string_func = Module["_zval_get_string_func"] = wasmExports["zval_get_string_func"])(a0);

var _get_active_function_or_method_name = Module["_get_active_function_or_method_name"] = () => (_get_active_function_or_method_name = Module["_get_active_function_or_method_name"] = wasmExports["get_active_function_or_method_name"])();

var _add_assoc_zval_ex = Module["_add_assoc_zval_ex"] = (a0, a1, a2, a3) => (_add_assoc_zval_ex = Module["_add_assoc_zval_ex"] = wasmExports["add_assoc_zval_ex"])(a0, a1, a2, a3);

var _zend_ini_double = Module["_zend_ini_double"] = (a0, a1, a2) => (_zend_ini_double = Module["_zend_ini_double"] = wasmExports["zend_ini_double"])(a0, a1, a2);

var _zend_strpprintf = Module["_zend_strpprintf"] = (a0, a1, a2) => (_zend_strpprintf = Module["_zend_strpprintf"] = wasmExports["zend_strpprintf"])(a0, a1, a2);

var _zend_parse_arg_double_slow = Module["_zend_parse_arg_double_slow"] = (a0, a1, a2) => (_zend_parse_arg_double_slow = Module["_zend_parse_arg_double_slow"] = wasmExports["zend_parse_arg_double_slow"])(a0, a1, a2);

var _php_pcre2_code_copy = Module["_php_pcre2_code_copy"] = a0 => (_php_pcre2_code_copy = Module["_php_pcre2_code_copy"] = wasmExports["php_pcre2_code_copy"])(a0);

var _php_pcre2_code_copy_with_tables = Module["_php_pcre2_code_copy_with_tables"] = a0 => (_php_pcre2_code_copy_with_tables = Module["_php_pcre2_code_copy_with_tables"] = wasmExports["php_pcre2_code_copy_with_tables"])(a0);

var _php_pcre2_code_free = Module["_php_pcre2_code_free"] = a0 => (_php_pcre2_code_free = Module["_php_pcre2_code_free"] = wasmExports["php_pcre2_code_free"])(a0);

var _php_pcre2_compile = Module["_php_pcre2_compile"] = (a0, a1, a2, a3, a4, a5) => (_php_pcre2_compile = Module["_php_pcre2_compile"] = wasmExports["php_pcre2_compile"])(a0, a1, a2, a3, a4, a5);

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

var _php_pcre2_dfa_match = Module["_php_pcre2_dfa_match"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (_php_pcre2_dfa_match = Module["_php_pcre2_dfa_match"] = wasmExports["php_pcre2_dfa_match"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _php_pcre2_get_error_message = Module["_php_pcre2_get_error_message"] = (a0, a1, a2) => (_php_pcre2_get_error_message = Module["_php_pcre2_get_error_message"] = wasmExports["php_pcre2_get_error_message"])(a0, a1, a2);

var _php_pcre2_jit_compile = Module["_php_pcre2_jit_compile"] = (a0, a1) => (_php_pcre2_jit_compile = Module["_php_pcre2_jit_compile"] = wasmExports["php_pcre2_jit_compile"])(a0, a1);

var _php_pcre2_jit_match = Module["_php_pcre2_jit_match"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_pcre2_jit_match = Module["_php_pcre2_jit_match"] = wasmExports["php_pcre2_jit_match"])(a0, a1, a2, a3, a4, a5, a6);

var _php_pcre2_jit_free_unused_memory = Module["_php_pcre2_jit_free_unused_memory"] = a0 => (_php_pcre2_jit_free_unused_memory = Module["_php_pcre2_jit_free_unused_memory"] = wasmExports["php_pcre2_jit_free_unused_memory"])(a0);

var _php_pcre2_jit_stack_create = Module["_php_pcre2_jit_stack_create"] = (a0, a1, a2) => (_php_pcre2_jit_stack_create = Module["_php_pcre2_jit_stack_create"] = wasmExports["php_pcre2_jit_stack_create"])(a0, a1, a2);

var _php_pcre2_jit_stack_assign = Module["_php_pcre2_jit_stack_assign"] = (a0, a1, a2) => (_php_pcre2_jit_stack_assign = Module["_php_pcre2_jit_stack_assign"] = wasmExports["php_pcre2_jit_stack_assign"])(a0, a1, a2);

var _php_pcre2_jit_stack_free = Module["_php_pcre2_jit_stack_free"] = a0 => (_php_pcre2_jit_stack_free = Module["_php_pcre2_jit_stack_free"] = wasmExports["php_pcre2_jit_stack_free"])(a0);

var _php_pcre2_maketables = Module["_php_pcre2_maketables"] = a0 => (_php_pcre2_maketables = Module["_php_pcre2_maketables"] = wasmExports["php_pcre2_maketables"])(a0);

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

var _zend_gcvt = Module["_zend_gcvt"] = (a0, a1, a2, a3, a4) => (_zend_gcvt = Module["_zend_gcvt"] = wasmExports["zend_gcvt"])(a0, a1, a2, a3, a4);

var _zend_get_recursion_guard = Module["_zend_get_recursion_guard"] = a0 => (_zend_get_recursion_guard = Module["_zend_get_recursion_guard"] = wasmExports["zend_get_recursion_guard"])(a0);

var __call_user_function_impl = Module["__call_user_function_impl"] = (a0, a1, a2, a3, a4, a5) => (__call_user_function_impl = Module["__call_user_function_impl"] = wasmExports["_call_user_function_impl"])(a0, a1, a2, a3, a4, a5);

var _zend_get_properties_for = Module["_zend_get_properties_for"] = (a0, a1) => (_zend_get_properties_for = Module["_zend_get_properties_for"] = wasmExports["zend_get_properties_for"])(a0, a1);

var _rc_dtor_func = Module["_rc_dtor_func"] = a0 => (_rc_dtor_func = Module["_rc_dtor_func"] = wasmExports["rc_dtor_func"])(a0);

var _php_json_parse = Module["_php_json_parse"] = a0 => (_php_json_parse = Module["_php_json_parse"] = wasmExports["php_json_parse"])(a0);

var _object_init = Module["_object_init"] = a0 => (_object_init = Module["_object_init"] = wasmExports["object_init"])(a0);

var __zend_handle_numeric_str_ex = Module["__zend_handle_numeric_str_ex"] = (a0, a1, a2) => (__zend_handle_numeric_str_ex = Module["__zend_handle_numeric_str_ex"] = wasmExports["_zend_handle_numeric_str_ex"])(a0, a1, a2);

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

var _zend_value_error = Module["_zend_value_error"] = (a0, a1) => (_zend_value_error = Module["_zend_value_error"] = wasmExports["zend_value_error"])(a0, a1);

var _pdo_get_long_param = Module["_pdo_get_long_param"] = (a0, a1) => (_pdo_get_long_param = Module["_pdo_get_long_param"] = wasmExports["pdo_get_long_param"])(a0, a1);

var _is_numeric_str_function = Module["_is_numeric_str_function"] = (a0, a1, a2) => (_is_numeric_str_function = Module["_is_numeric_str_function"] = wasmExports["is_numeric_str_function"])(a0, a1, a2);

var _pdo_get_bool_param = Module["_pdo_get_bool_param"] = (a0, a1) => (_pdo_get_bool_param = Module["_pdo_get_bool_param"] = wasmExports["pdo_get_bool_param"])(a0, a1);

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

var _zend_long_to_str = Module["_zend_long_to_str"] = a0 => (_zend_long_to_str = Module["_zend_long_to_str"] = wasmExports["zend_long_to_str"])(a0);

var _zend_ulong_to_str = Module["_zend_ulong_to_str"] = a0 => (_zend_ulong_to_str = Module["_zend_ulong_to_str"] = wasmExports["zend_ulong_to_str"])(a0);

var _main = Module["_main"] = (a0, a1) => (_main = Module["_main"] = wasmExports["main"])(a0, a1);

var _pib_init = Module["_pib_init"] = () => (_pib_init = Module["_pib_init"] = wasmExports["pib_init"])();

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

var _php_random_pcgoneseq128xslrr64_advance = Module["_php_random_pcgoneseq128xslrr64_advance"] = (a0, a1, a2) => (_php_random_pcgoneseq128xslrr64_advance = Module["_php_random_pcgoneseq128xslrr64_advance"] = wasmExports["php_random_pcgoneseq128xslrr64_advance"])(a0, a1, a2);

var _php_random_xoshiro256starstar_jump = Module["_php_random_xoshiro256starstar_jump"] = a0 => (_php_random_xoshiro256starstar_jump = Module["_php_random_xoshiro256starstar_jump"] = wasmExports["php_random_xoshiro256starstar_jump"])(a0);

var _php_random_xoshiro256starstar_jump_long = Module["_php_random_xoshiro256starstar_jump_long"] = a0 => (_php_random_xoshiro256starstar_jump_long = Module["_php_random_xoshiro256starstar_jump_long"] = wasmExports["php_random_xoshiro256starstar_jump_long"])(a0);

var _zend_call_known_function = Module["_zend_call_known_function"] = (a0, a1, a2, a3, a4, a5, a6) => (_zend_call_known_function = Module["_zend_call_known_function"] = wasmExports["zend_call_known_function"])(a0, a1, a2, a3, a4, a5, a6);

var _php_random_gammasection_closed_open = Module["_php_random_gammasection_closed_open"] = (a0, a1, a2, a3) => (_php_random_gammasection_closed_open = Module["_php_random_gammasection_closed_open"] = wasmExports["php_random_gammasection_closed_open"])(a0, a1, a2, a3);

var _php_random_gammasection_closed_closed = Module["_php_random_gammasection_closed_closed"] = (a0, a1, a2, a3) => (_php_random_gammasection_closed_closed = Module["_php_random_gammasection_closed_closed"] = wasmExports["php_random_gammasection_closed_closed"])(a0, a1, a2, a3);

var _php_random_gammasection_open_closed = Module["_php_random_gammasection_open_closed"] = (a0, a1, a2, a3) => (_php_random_gammasection_open_closed = Module["_php_random_gammasection_open_closed"] = wasmExports["php_random_gammasection_open_closed"])(a0, a1, a2, a3);

var _php_random_gammasection_open_open = Module["_php_random_gammasection_open_open"] = (a0, a1, a2, a3) => (_php_random_gammasection_open_open = Module["_php_random_gammasection_open_open"] = wasmExports["php_random_gammasection_open_open"])(a0, a1, a2, a3);

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

var _zend_separate_class_constants_table = Module["_zend_separate_class_constants_table"] = a0 => (_zend_separate_class_constants_table = Module["_zend_separate_class_constants_table"] = wasmExports["zend_separate_class_constants_table"])(a0);

var _zend_zval_type_name = Module["_zend_zval_type_name"] = a0 => (_zend_zval_type_name = Module["_zend_zval_type_name"] = wasmExports["zend_zval_type_name"])(a0);

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

var _zend_alter_ini_entry_ex = Module["_zend_alter_ini_entry_ex"] = (a0, a1, a2, a3, a4) => (_zend_alter_ini_entry_ex = Module["_zend_alter_ini_entry_ex"] = wasmExports["zend_alter_ini_entry_ex"])(a0, a1, a2, a3, a4);

var _zend_register_auto_global = Module["_zend_register_auto_global"] = (a0, a1, a2) => (_zend_register_auto_global = Module["_zend_register_auto_global"] = wasmExports["zend_register_auto_global"])(a0, a1, a2);

var _OnUpdateBool = Module["_OnUpdateBool"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateBool = Module["_OnUpdateBool"] = wasmExports["OnUpdateBool"])(a0, a1, a2, a3, a4, a5);

var _zend_ini_boolean_displayer_cb = Module["_zend_ini_boolean_displayer_cb"] = (a0, a1) => (_zend_ini_boolean_displayer_cb = Module["_zend_ini_boolean_displayer_cb"] = wasmExports["zend_ini_boolean_displayer_cb"])(a0, a1);

var _OnUpdateReal = Module["_OnUpdateReal"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateReal = Module["_OnUpdateReal"] = wasmExports["OnUpdateReal"])(a0, a1, a2, a3, a4, a5);

var _php_check_open_basedir = Module["_php_check_open_basedir"] = a0 => (_php_check_open_basedir = Module["_php_check_open_basedir"] = wasmExports["php_check_open_basedir"])(a0);

var _OnUpdateStringUnempty = Module["_OnUpdateStringUnempty"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateStringUnempty = Module["_OnUpdateStringUnempty"] = wasmExports["OnUpdateStringUnempty"])(a0, a1, a2, a3, a4, a5);

var _OnUpdateLongGEZero = Module["_OnUpdateLongGEZero"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateLongGEZero = Module["_OnUpdateLongGEZero"] = wasmExports["OnUpdateLongGEZero"])(a0, a1, a2, a3, a4, a5);

var _sapi_get_request_time = Module["_sapi_get_request_time"] = () => (_sapi_get_request_time = Module["_sapi_get_request_time"] = wasmExports["sapi_get_request_time"])();

var _php_get_temporary_directory = Module["_php_get_temporary_directory"] = () => (_php_get_temporary_directory = Module["_php_get_temporary_directory"] = wasmExports["php_get_temporary_directory"])();

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

var _zend_reset_lc_ctype_locale = Module["_zend_reset_lc_ctype_locale"] = () => (_zend_reset_lc_ctype_locale = Module["_zend_reset_lc_ctype_locale"] = wasmExports["zend_reset_lc_ctype_locale"])();

var _zend_update_current_locale = Module["_zend_update_current_locale"] = () => (_zend_update_current_locale = Module["_zend_update_current_locale"] = wasmExports["zend_update_current_locale"])();

var _zend_llist_destroy = Module["_zend_llist_destroy"] = a0 => (_zend_llist_destroy = Module["_zend_llist_destroy"] = wasmExports["zend_llist_destroy"])(a0);

var _zend_get_executed_scope = Module["_zend_get_executed_scope"] = () => (_zend_get_executed_scope = Module["_zend_get_executed_scope"] = wasmExports["zend_get_executed_scope"])();

var _zend_get_constant_ex = Module["_zend_get_constant_ex"] = (a0, a1, a2) => (_zend_get_constant_ex = Module["_zend_get_constant_ex"] = wasmExports["zend_get_constant_ex"])(a0, a1, a2);

var _htonl = a0 => (_htonl = wasmExports["htonl"])(a0);

var _php_getenv = Module["_php_getenv"] = (a0, a1) => (_php_getenv = Module["_php_getenv"] = wasmExports["php_getenv"])(a0, a1);

var _sapi_getenv = Module["_sapi_getenv"] = (a0, a1) => (_sapi_getenv = Module["_sapi_getenv"] = wasmExports["sapi_getenv"])(a0, a1);

var _zend_strndup = Module["_zend_strndup"] = (a0, a1) => (_zend_strndup = Module["_zend_strndup"] = wasmExports["zend_strndup"])(a0, a1);

var _zend_is_auto_global = Module["_zend_is_auto_global"] = a0 => (_zend_is_auto_global = Module["_zend_is_auto_global"] = wasmExports["zend_is_auto_global"])(a0);

var _php_getopt = Module["_php_getopt"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_getopt = Module["_php_getopt"] = wasmExports["php_getopt"])(a0, a1, a2, a3, a4, a5, a6);

var _sapi_flush = Module["_sapi_flush"] = () => (_sapi_flush = Module["_sapi_flush"] = wasmExports["sapi_flush"])();

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

var _ntohs = a0 => (_ntohs = wasmExports["ntohs"])(a0);

var _htons = a0 => (_htons = wasmExports["htons"])(a0);

var _zend_llist_init = Module["_zend_llist_init"] = (a0, a1, a2, a3) => (_zend_llist_init = Module["_zend_llist_init"] = wasmExports["zend_llist_init"])(a0, a1, a2, a3);

var _php_add_tick_function = Module["_php_add_tick_function"] = (a0, a1) => (_php_add_tick_function = Module["_php_add_tick_function"] = wasmExports["php_add_tick_function"])(a0, a1);

var _zend_llist_add_element = Module["_zend_llist_add_element"] = (a0, a1) => (_zend_llist_add_element = Module["_zend_llist_add_element"] = wasmExports["zend_llist_add_element"])(a0, a1);

var _zend_llist_del_element = Module["_zend_llist_del_element"] = (a0, a1, a2) => (_zend_llist_del_element = Module["_zend_llist_del_element"] = wasmExports["zend_llist_del_element"])(a0, a1, a2);

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

var _zend_stream_init_fp = Module["_zend_stream_init_fp"] = (a0, a1, a2) => (_zend_stream_init_fp = Module["_zend_stream_init_fp"] = wasmExports["zend_stream_init_fp"])(a0, a1, a2);

var __safe_realloc = Module["__safe_realloc"] = (a0, a1, a2, a3) => (__safe_realloc = Module["__safe_realloc"] = wasmExports["_safe_realloc"])(a0, a1, a2, a3);

var _zend_memnstr_ex = Module["_zend_memnstr_ex"] = (a0, a1, a2, a3) => (_zend_memnstr_ex = Module["_zend_memnstr_ex"] = wasmExports["zend_memnstr_ex"])(a0, a1, a2, a3);

var _php_crc32_bulk_update = Module["_php_crc32_bulk_update"] = (a0, a1, a2) => (_php_crc32_bulk_update = Module["_php_crc32_bulk_update"] = wasmExports["php_crc32_bulk_update"])(a0, a1, a2);

var _php_crc32_stream_bulk_update = Module["_php_crc32_stream_bulk_update"] = (a0, a1, a2) => (_php_crc32_stream_bulk_update = Module["_php_crc32_stream_bulk_update"] = wasmExports["php_crc32_stream_bulk_update"])(a0, a1, a2);

var _php_crypt = Module["_php_crypt"] = (a0, a1, a2, a3, a4) => (_php_crypt = Module["_php_crypt"] = wasmExports["php_crypt"])(a0, a1, a2, a3, a4);

var _php_std_date = Module["_php_std_date"] = (a0, a1) => (_php_std_date = Module["_php_std_date"] = wasmExports["php_std_date"])(a0, a1);

var _zend_fetch_resource = Module["_zend_fetch_resource"] = (a0, a1, a2) => (_zend_fetch_resource = Module["_zend_fetch_resource"] = wasmExports["zend_fetch_resource"])(a0, a1, a2);

var _php_clear_stat_cache = Module["_php_clear_stat_cache"] = (a0, a1, a2) => (_php_clear_stat_cache = Module["_php_clear_stat_cache"] = wasmExports["php_clear_stat_cache"])(a0, a1, a2);

var _php_check_open_basedir_ex = Module["_php_check_open_basedir_ex"] = (a0, a1) => (_php_check_open_basedir_ex = Module["_php_check_open_basedir_ex"] = wasmExports["php_check_open_basedir_ex"])(a0, a1);

var __php_stream_scandir = Module["__php_stream_scandir"] = (a0, a1, a2, a3, a4) => (__php_stream_scandir = Module["__php_stream_scandir"] = wasmExports["_php_stream_scandir"])(a0, a1, a2, a3, a4);

var _php_stream_dirent_alphasort = Module["_php_stream_dirent_alphasort"] = (a0, a1) => (_php_stream_dirent_alphasort = Module["_php_stream_dirent_alphasort"] = wasmExports["php_stream_dirent_alphasort"])(a0, a1);

var _php_stream_dirent_alphasortr = Module["_php_stream_dirent_alphasortr"] = (a0, a1) => (_php_stream_dirent_alphasortr = Module["_php_stream_dirent_alphasortr"] = wasmExports["php_stream_dirent_alphasortr"])(a0, a1);

var _zend_list_delete = Module["_zend_list_delete"] = a0 => (_zend_list_delete = Module["_zend_list_delete"] = wasmExports["zend_list_delete"])(a0);

var _zif_dl = Module["_zif_dl"] = (a0, a1) => (_zif_dl = Module["_zif_dl"] = wasmExports["zif_dl"])(a0, a1);

var _php_dl = Module["_php_dl"] = (a0, a1, a2, a3) => (_php_dl = Module["_php_dl"] = wasmExports["php_dl"])(a0, a1, a2, a3);

var _php_load_shlib = Module["_php_load_shlib"] = (a0, a1) => (_php_load_shlib = Module["_php_load_shlib"] = wasmExports["php_load_shlib"])(a0, a1);

var _php_load_extension = Module["_php_load_extension"] = (a0, a1, a2) => (_php_load_extension = Module["_php_load_extension"] = wasmExports["php_load_extension"])(a0, a1, a2);

var _zend_next_free_module = Module["_zend_next_free_module"] = () => (_zend_next_free_module = Module["_zend_next_free_module"] = wasmExports["zend_next_free_module"])();

var _zend_register_module_ex = Module["_zend_register_module_ex"] = a0 => (_zend_register_module_ex = Module["_zend_register_module_ex"] = wasmExports["zend_register_module_ex"])(a0);

var _zend_startup_module_ex = Module["_zend_startup_module_ex"] = a0 => (_zend_startup_module_ex = Module["_zend_startup_module_ex"] = wasmExports["zend_startup_module_ex"])(a0);

var _php_network_gethostbyname = Module["_php_network_gethostbyname"] = a0 => (_php_network_gethostbyname = Module["_php_network_gethostbyname"] = wasmExports["php_network_gethostbyname"])(a0);

var _php_exec = Module["_php_exec"] = (a0, a1, a2, a3) => (_php_exec = Module["_php_exec"] = wasmExports["php_exec"])(a0, a1, a2, a3);

var __php_stream_fopen_from_pipe = Module["__php_stream_fopen_from_pipe"] = (a0, a1) => (__php_stream_fopen_from_pipe = Module["__php_stream_fopen_from_pipe"] = wasmExports["_php_stream_fopen_from_pipe"])(a0, a1);

var _php_output_write = Module["_php_output_write"] = (a0, a1) => (_php_output_write = Module["_php_output_write"] = wasmExports["php_output_write"])(a0, a1);

var _php_escape_shell_cmd = Module["_php_escape_shell_cmd"] = a0 => (_php_escape_shell_cmd = Module["_php_escape_shell_cmd"] = wasmExports["php_escape_shell_cmd"])(a0);

var _php_escape_shell_arg = Module["_php_escape_shell_arg"] = a0 => (_php_escape_shell_arg = Module["_php_escape_shell_arg"] = wasmExports["php_escape_shell_arg"])(a0);

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

var _php_stream_context_free = Module["_php_stream_context_free"] = a0 => (_php_stream_context_free = Module["_php_stream_context_free"] = wasmExports["php_stream_context_free"])(a0);

var _zend_ini_parse_bool = Module["_zend_ini_parse_bool"] = a0 => (_zend_ini_parse_bool = Module["_zend_ini_parse_bool"] = wasmExports["zend_ini_parse_bool"])(a0);

var _php_get_gid_by_name = Module["_php_get_gid_by_name"] = (a0, a1) => (_php_get_gid_by_name = Module["_php_get_gid_by_name"] = wasmExports["php_get_gid_by_name"])(a0, a1);

var _php_get_uid_by_name = Module["_php_get_uid_by_name"] = (a0, a1) => (_php_get_uid_by_name = Module["_php_get_uid_by_name"] = wasmExports["php_get_uid_by_name"])(a0, a1);

var _realpath_cache_del = Module["_realpath_cache_del"] = (a0, a1) => (_realpath_cache_del = Module["_realpath_cache_del"] = wasmExports["realpath_cache_del"])(a0, a1);

var _realpath_cache_clean = Module["_realpath_cache_clean"] = () => (_realpath_cache_clean = Module["_realpath_cache_clean"] = wasmExports["realpath_cache_clean"])();

var _realpath_cache_size = Module["_realpath_cache_size"] = () => (_realpath_cache_size = Module["_realpath_cache_size"] = wasmExports["realpath_cache_size"])();

var _realpath_cache_get_buckets = Module["_realpath_cache_get_buckets"] = () => (_realpath_cache_get_buckets = Module["_realpath_cache_get_buckets"] = wasmExports["realpath_cache_get_buckets"])();

var _realpath_cache_max_buckets = Module["_realpath_cache_max_buckets"] = () => (_realpath_cache_max_buckets = Module["_realpath_cache_max_buckets"] = wasmExports["realpath_cache_max_buckets"])();

var _add_assoc_stringl_ex = Module["_add_assoc_stringl_ex"] = (a0, a1, a2, a3, a4) => (_add_assoc_stringl_ex = Module["_add_assoc_stringl_ex"] = wasmExports["add_assoc_stringl_ex"])(a0, a1, a2, a3, a4);

var _php_flock = Module["_php_flock"] = (a0, a1) => (_php_flock = Module["_php_flock"] = wasmExports["php_flock"])(a0, a1);

var _php_conv_fp = Module["_php_conv_fp"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_conv_fp = Module["_php_conv_fp"] = wasmExports["php_conv_fp"])(a0, a1, a2, a3, a4, a5, a6, a7);

var __php_stream_xport_create = Module["__php_stream_xport_create"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (__php_stream_xport_create = Module["__php_stream_xport_create"] = wasmExports["_php_stream_xport_create"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var _zend_try_assign_typed_ref_str = Module["_zend_try_assign_typed_ref_str"] = (a0, a1) => (_zend_try_assign_typed_ref_str = Module["_zend_try_assign_typed_ref_str"] = wasmExports["zend_try_assign_typed_ref_str"])(a0, a1);

var _zend_try_assign_typed_ref_empty_string = Module["_zend_try_assign_typed_ref_empty_string"] = a0 => (_zend_try_assign_typed_ref_empty_string = Module["_zend_try_assign_typed_ref_empty_string"] = wasmExports["zend_try_assign_typed_ref_empty_string"])(a0);

var _sapi_header_op = Module["_sapi_header_op"] = (a0, a1) => (_sapi_header_op = Module["_sapi_header_op"] = wasmExports["sapi_header_op"])(a0, a1);

var _php_header = Module["_php_header"] = () => (_php_header = Module["_php_header"] = wasmExports["php_header"])();

var _php_setcookie = Module["_php_setcookie"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_php_setcookie = Module["_php_setcookie"] = wasmExports["php_setcookie"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var _php_raw_url_encode = Module["_php_raw_url_encode"] = (a0, a1) => (_php_raw_url_encode = Module["_php_raw_url_encode"] = wasmExports["php_raw_url_encode"])(a0, a1);

var _zend_try_assign_typed_ref_string = Module["_zend_try_assign_typed_ref_string"] = (a0, a1) => (_zend_try_assign_typed_ref_string = Module["_zend_try_assign_typed_ref_string"] = wasmExports["zend_try_assign_typed_ref_string"])(a0, a1);

var _zend_llist_apply_with_argument = Module["_zend_llist_apply_with_argument"] = (a0, a1, a2) => (_zend_llist_apply_with_argument = Module["_zend_llist_apply_with_argument"] = wasmExports["zend_llist_apply_with_argument"])(a0, a1, a2);

var _php_unescape_html_entities = Module["_php_unescape_html_entities"] = (a0, a1, a2, a3) => (_php_unescape_html_entities = Module["_php_unescape_html_entities"] = wasmExports["php_unescape_html_entities"])(a0, a1, a2, a3);

var _php_escape_html_entities = Module["_php_escape_html_entities"] = (a0, a1, a2, a3, a4) => (_php_escape_html_entities = Module["_php_escape_html_entities"] = wasmExports["php_escape_html_entities"])(a0, a1, a2, a3, a4);

var _php_escape_html_entities_ex = Module["_php_escape_html_entities_ex"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_escape_html_entities_ex = Module["_php_escape_html_entities_ex"] = wasmExports["php_escape_html_entities_ex"])(a0, a1, a2, a3, a4, a5, a6);

var _php_is_image_avif = Module["_php_is_image_avif"] = a0 => (_php_is_image_avif = Module["_php_is_image_avif"] = wasmExports["php_is_image_avif"])(a0);

var _php_image_type_to_mime_type = Module["_php_image_type_to_mime_type"] = a0 => (_php_image_type_to_mime_type = Module["_php_image_type_to_mime_type"] = wasmExports["php_image_type_to_mime_type"])(a0);

var _php_getimagetype = Module["_php_getimagetype"] = (a0, a1, a2) => (_php_getimagetype = Module["_php_getimagetype"] = wasmExports["php_getimagetype"])(a0, a1, a2);

var _php_info_print_table_header = Module["_php_info_print_table_header"] = (a0, a1) => (_php_info_print_table_header = Module["_php_info_print_table_header"] = wasmExports["php_info_print_table_header"])(a0, a1);

var _php_info_print_style = Module["_php_info_print_style"] = () => (_php_info_print_style = Module["_php_info_print_style"] = wasmExports["php_info_print_style"])();

var _php_info_print_css = Module["_php_info_print_css"] = () => (_php_info_print_css = Module["_php_info_print_css"] = wasmExports["php_info_print_css"])();

var _php_info_html_esc = Module["_php_info_html_esc"] = a0 => (_php_info_html_esc = Module["_php_info_html_esc"] = wasmExports["php_info_html_esc"])(a0);

var _php_get_uname = Module["_php_get_uname"] = a0 => (_php_get_uname = Module["_php_get_uname"] = wasmExports["php_get_uname"])(a0);

var _php_print_info_htmlhead = Module["_php_print_info_htmlhead"] = () => (_php_print_info_htmlhead = Module["_php_print_info_htmlhead"] = wasmExports["php_print_info_htmlhead"])();

var _php_print_info = Module["_php_print_info"] = a0 => (_php_print_info = Module["_php_print_info"] = wasmExports["php_print_info"])(a0);

var _get_zend_version = Module["_get_zend_version"] = () => (_get_zend_version = Module["_get_zend_version"] = wasmExports["get_zend_version"])();

var _php_info_print_box_start = Module["_php_info_print_box_start"] = a0 => (_php_info_print_box_start = Module["_php_info_print_box_start"] = wasmExports["php_info_print_box_start"])(a0);

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

var _expand_filepath_ex = Module["_expand_filepath_ex"] = (a0, a1, a2, a3) => (_expand_filepath_ex = Module["_expand_filepath_ex"] = wasmExports["expand_filepath_ex"])(a0, a1, a2, a3);

var _php_mail_build_headers = Module["_php_mail_build_headers"] = a0 => (_php_mail_build_headers = Module["_php_mail_build_headers"] = wasmExports["php_mail_build_headers"])(a0);

var _php_trim = Module["_php_trim"] = (a0, a1, a2, a3) => (_php_trim = Module["_php_trim"] = wasmExports["php_trim"])(a0, a1, a2, a3);

var _php_syslog = Module["_php_syslog"] = (a0, a1, a2) => (_php_syslog = Module["_php_syslog"] = wasmExports["php_syslog"])(a0, a1, a2);

var _zend_get_executed_filename = Module["_zend_get_executed_filename"] = () => (_zend_get_executed_filename = Module["_zend_get_executed_filename"] = wasmExports["zend_get_executed_filename"])();

var _pow_function = Module["_pow_function"] = (a0, a1, a2) => (_pow_function = Module["_pow_function"] = wasmExports["pow_function"])(a0, a1, a2);

var __php_math_basetolong = Module["__php_math_basetolong"] = (a0, a1) => (__php_math_basetolong = Module["__php_math_basetolong"] = wasmExports["_php_math_basetolong"])(a0, a1);

var __php_math_basetozval = Module["__php_math_basetozval"] = (a0, a1, a2) => (__php_math_basetozval = Module["__php_math_basetozval"] = wasmExports["_php_math_basetozval"])(a0, a1, a2);

var __php_math_longtobase = Module["__php_math_longtobase"] = (a0, a1) => (__php_math_longtobase = Module["__php_math_longtobase"] = wasmExports["_php_math_longtobase"])(a0, a1);

var __php_math_zvaltobase = Module["__php_math_zvaltobase"] = (a0, a1) => (__php_math_zvaltobase = Module["__php_math_zvaltobase"] = wasmExports["_php_math_zvaltobase"])(a0, a1);

var __php_math_number_format = Module["__php_math_number_format"] = (a0, a1, a2, a3) => (__php_math_number_format = Module["__php_math_number_format"] = wasmExports["_php_math_number_format"])(a0, a1, a2, a3);

var __php_math_number_format_ex = Module["__php_math_number_format_ex"] = (a0, a1, a2, a3, a4, a5) => (__php_math_number_format_ex = Module["__php_math_number_format_ex"] = wasmExports["_php_math_number_format_ex"])(a0, a1, a2, a3, a4, a5);

var __php_math_number_format_long = Module["__php_math_number_format_long"] = (a0, a1, a2, a3, a4, a5) => (__php_math_number_format_long = Module["__php_math_number_format_long"] = wasmExports["_php_math_number_format_long"])(a0, a1, a2, a3, a4, a5);

var _make_digest = Module["_make_digest"] = (a0, a1) => (_make_digest = Module["_make_digest"] = wasmExports["make_digest"])(a0, a1);

var _make_digest_ex = Module["_make_digest_ex"] = (a0, a1, a2) => (_make_digest_ex = Module["_make_digest_ex"] = wasmExports["make_digest_ex"])(a0, a1, a2);

var _php_statpage = Module["_php_statpage"] = () => (_php_statpage = Module["_php_statpage"] = wasmExports["php_statpage"])();

var _sapi_get_stat = Module["_sapi_get_stat"] = () => (_sapi_get_stat = Module["_sapi_get_stat"] = wasmExports["sapi_get_stat"])();

var _php_getlastmod = Module["_php_getlastmod"] = () => (_php_getlastmod = Module["_php_getlastmod"] = wasmExports["php_getlastmod"])();

var _php_quot_print_decode = Module["_php_quot_print_decode"] = (a0, a1, a2) => (_php_quot_print_decode = Module["_php_quot_print_decode"] = wasmExports["php_quot_print_decode"])(a0, a1, a2);

var _php_quot_print_encode = Module["_php_quot_print_encode"] = (a0, a1) => (_php_quot_print_encode = Module["_php_quot_print_encode"] = wasmExports["php_quot_print_encode"])(a0, a1);

var _localeconv_r = Module["_localeconv_r"] = a0 => (_localeconv_r = Module["_localeconv_r"] = wasmExports["localeconv_r"])(a0);

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

var _php_stream_wrapper_log_error = Module["_php_stream_wrapper_log_error"] = (a0, a1, a2, a3) => (_php_stream_wrapper_log_error = Module["_php_stream_wrapper_log_error"] = wasmExports["php_stream_wrapper_log_error"])(a0, a1, a2, a3);

var _php_stream_context_get_option = Module["_php_stream_context_get_option"] = (a0, a1, a2) => (_php_stream_context_get_option = Module["_php_stream_context_get_option"] = wasmExports["php_stream_context_get_option"])(a0, a1, a2);

var _php_stream_notification_notify = Module["_php_stream_notification_notify"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_stream_notification_notify = Module["_php_stream_notification_notify"] = wasmExports["php_stream_notification_notify"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _php_stream_context_set = Module["_php_stream_context_set"] = (a0, a1) => (_php_stream_context_set = Module["_php_stream_context_set"] = wasmExports["php_stream_context_set"])(a0, a1);

var _php_stream_xport_crypto_setup = Module["_php_stream_xport_crypto_setup"] = (a0, a1, a2) => (_php_stream_xport_crypto_setup = Module["_php_stream_xport_crypto_setup"] = wasmExports["php_stream_xport_crypto_setup"])(a0, a1, a2);

var _php_stream_xport_crypto_enable = Module["_php_stream_xport_crypto_enable"] = (a0, a1) => (_php_stream_xport_crypto_enable = Module["_php_stream_xport_crypto_enable"] = wasmExports["php_stream_xport_crypto_enable"])(a0, a1);

var __php_stream_sock_open_host = Module["__php_stream_sock_open_host"] = (a0, a1, a2, a3, a4) => (__php_stream_sock_open_host = Module["__php_stream_sock_open_host"] = wasmExports["_php_stream_sock_open_host"])(a0, a1, a2, a3, a4);

var __php_stream_alloc = Module["__php_stream_alloc"] = (a0, a1, a2, a3) => (__php_stream_alloc = Module["__php_stream_alloc"] = wasmExports["_php_stream_alloc"])(a0, a1, a2, a3);

var _zend_set_local_var_str = Module["_zend_set_local_var_str"] = (a0, a1, a2, a3) => (_zend_set_local_var_str = Module["_zend_set_local_var_str"] = wasmExports["zend_set_local_var_str"])(a0, a1, a2, a3);

var _php_stream_context_set_option = Module["_php_stream_context_set_option"] = (a0, a1, a2, a3) => (_php_stream_context_set_option = Module["_php_stream_context_set_option"] = wasmExports["php_stream_context_set_option"])(a0, a1, a2, a3);

var _php_stream_filter_create = Module["_php_stream_filter_create"] = (a0, a1, a2) => (_php_stream_filter_create = Module["_php_stream_filter_create"] = wasmExports["php_stream_filter_create"])(a0, a1, a2);

var _php_stream_filter_free = Module["_php_stream_filter_free"] = a0 => (_php_stream_filter_free = Module["_php_stream_filter_free"] = wasmExports["php_stream_filter_free"])(a0);

var __php_stream_filter_append = Module["__php_stream_filter_append"] = (a0, a1) => (__php_stream_filter_append = Module["__php_stream_filter_append"] = wasmExports["_php_stream_filter_append"])(a0, a1);

var _php_stream_mode_from_str = Module["_php_stream_mode_from_str"] = a0 => (_php_stream_mode_from_str = Module["_php_stream_mode_from_str"] = wasmExports["php_stream_mode_from_str"])(a0);

var __php_stream_temp_create = Module["__php_stream_temp_create"] = (a0, a1) => (__php_stream_temp_create = Module["__php_stream_temp_create"] = wasmExports["_php_stream_temp_create"])(a0, a1);

var __php_stream_memory_create = Module["__php_stream_memory_create"] = a0 => (__php_stream_memory_create = Module["__php_stream_memory_create"] = wasmExports["_php_stream_memory_create"])(a0);

var __php_stream_temp_create_ex = Module["__php_stream_temp_create_ex"] = (a0, a1, a2) => (__php_stream_temp_create_ex = Module["__php_stream_temp_create_ex"] = wasmExports["_php_stream_temp_create_ex"])(a0, a1, a2);

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

var __php_stream_cast = Module["__php_stream_cast"] = (a0, a1, a2, a3) => (__php_stream_cast = Module["__php_stream_cast"] = wasmExports["_php_stream_cast"])(a0, a1, a2, a3);

var _php_socket_error_str = Module["_php_socket_error_str"] = a0 => (_php_socket_error_str = Module["_php_socket_error_str"] = wasmExports["php_socket_error_str"])(a0);

var _php_socket_strerror = Module["_php_socket_strerror"] = (a0, a1, a2) => (_php_socket_strerror = Module["_php_socket_strerror"] = wasmExports["php_socket_strerror"])(a0, a1, a2);

var _add_next_index_resource = Module["_add_next_index_resource"] = (a0, a1) => (_add_next_index_resource = Module["_add_next_index_resource"] = wasmExports["add_next_index_resource"])(a0, a1);

var _php_stream_xport_accept = Module["_php_stream_xport_accept"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_stream_xport_accept = Module["_php_stream_xport_accept"] = wasmExports["php_stream_xport_accept"])(a0, a1, a2, a3, a4, a5, a6);

var _php_stream_xport_get_name = Module["_php_stream_xport_get_name"] = (a0, a1, a2, a3, a4) => (_php_stream_xport_get_name = Module["_php_stream_xport_get_name"] = wasmExports["php_stream_xport_get_name"])(a0, a1, a2, a3, a4);

var _php_network_parse_network_address_with_port = Module["_php_network_parse_network_address_with_port"] = (a0, a1, a2, a3) => (_php_network_parse_network_address_with_port = Module["_php_network_parse_network_address_with_port"] = wasmExports["php_network_parse_network_address_with_port"])(a0, a1, a2, a3);

var _php_stream_xport_sendto = Module["_php_stream_xport_sendto"] = (a0, a1, a2, a3, a4, a5) => (_php_stream_xport_sendto = Module["_php_stream_xport_sendto"] = wasmExports["php_stream_xport_sendto"])(a0, a1, a2, a3, a4, a5);

var _zend_try_assign_typed_ref_null = Module["_zend_try_assign_typed_ref_null"] = a0 => (_zend_try_assign_typed_ref_null = Module["_zend_try_assign_typed_ref_null"] = wasmExports["zend_try_assign_typed_ref_null"])(a0);

var _php_stream_xport_recvfrom = Module["_php_stream_xport_recvfrom"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_stream_xport_recvfrom = Module["_php_stream_xport_recvfrom"] = wasmExports["php_stream_xport_recvfrom"])(a0, a1, a2, a3, a4, a5, a6);

var _php_file_le_stream_filter = Module["_php_file_le_stream_filter"] = () => (_php_file_le_stream_filter = Module["_php_file_le_stream_filter"] = wasmExports["php_file_le_stream_filter"])();

var __php_stream_filter_flush = Module["__php_stream_filter_flush"] = (a0, a1) => (__php_stream_filter_flush = Module["__php_stream_filter_flush"] = wasmExports["_php_stream_filter_flush"])(a0, a1);

var _php_stream_filter_remove = Module["_php_stream_filter_remove"] = (a0, a1) => (_php_stream_filter_remove = Module["_php_stream_filter_remove"] = wasmExports["php_stream_filter_remove"])(a0, a1);

var _php_stream_get_record = Module["_php_stream_get_record"] = (a0, a1, a2, a3) => (_php_stream_get_record = Module["_php_stream_get_record"] = wasmExports["php_stream_get_record"])(a0, a1, a2, a3);

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

var _zend_objects_store_mark_destructed = Module["_zend_objects_store_mark_destructed"] = a0 => (_zend_objects_store_mark_destructed = Module["_zend_objects_store_mark_destructed"] = wasmExports["zend_objects_store_mark_destructed"])(a0);

var __php_stream_open_wrapper_as_file = Module["__php_stream_open_wrapper_as_file"] = (a0, a1, a2, a3) => (__php_stream_open_wrapper_as_file = Module["__php_stream_open_wrapper_as_file"] = wasmExports["_php_stream_open_wrapper_as_file"])(a0, a1, a2, a3);

var _php_strip_url_passwd = Module["_php_strip_url_passwd"] = a0 => (_php_strip_url_passwd = Module["_php_strip_url_passwd"] = wasmExports["php_strip_url_passwd"])(a0);

var _php_resolve_path = Module["_php_resolve_path"] = (a0, a1, a2) => (_php_resolve_path = Module["_php_resolve_path"] = wasmExports["php_resolve_path"])(a0, a1, a2);

var _zend_ini_color_displayer_cb = Module["_zend_ini_color_displayer_cb"] = (a0, a1) => (_zend_ini_color_displayer_cb = Module["_zend_ini_color_displayer_cb"] = wasmExports["zend_ini_color_displayer_cb"])(a0, a1);

var _OnUpdateBaseDir = Module["_OnUpdateBaseDir"] = (a0, a1, a2, a3, a4, a5) => (_OnUpdateBaseDir = Module["_OnUpdateBaseDir"] = wasmExports["OnUpdateBaseDir"])(a0, a1, a2, a3, a4, a5);

var _zend_ini_parse_uquantity_warn = Module["_zend_ini_parse_uquantity_warn"] = (a0, a1) => (_zend_ini_parse_uquantity_warn = Module["_zend_ini_parse_uquantity_warn"] = wasmExports["zend_ini_parse_uquantity_warn"])(a0, a1);

var _zend_disable_class = Module["_zend_disable_class"] = (a0, a1) => (_zend_disable_class = Module["_zend_disable_class"] = wasmExports["zend_disable_class"])(a0, a1);

var _ap_php_conv_10 = Module["_ap_php_conv_10"] = (a0, a1, a2, a3, a4, a5) => (_ap_php_conv_10 = Module["_ap_php_conv_10"] = wasmExports["ap_php_conv_10"])(a0, a1, a2, a3, a4, a5);

var _ap_php_conv_p2 = Module["_ap_php_conv_p2"] = (a0, a1, a2, a3, a4, a5) => (_ap_php_conv_p2 = Module["_ap_php_conv_p2"] = wasmExports["ap_php_conv_p2"])(a0, a1, a2, a3, a4, a5);

var _ap_php_vslprintf = Module["_ap_php_vslprintf"] = (a0, a1, a2, a3) => (_ap_php_vslprintf = Module["_ap_php_vslprintf"] = wasmExports["ap_php_vslprintf"])(a0, a1, a2, a3);

var _ap_php_vsnprintf = Module["_ap_php_vsnprintf"] = (a0, a1, a2, a3) => (_ap_php_vsnprintf = Module["_ap_php_vsnprintf"] = wasmExports["ap_php_vsnprintf"])(a0, a1, a2, a3);

var _ap_php_vasprintf = Module["_ap_php_vasprintf"] = (a0, a1, a2) => (_ap_php_vasprintf = Module["_ap_php_vasprintf"] = wasmExports["ap_php_vasprintf"])(a0, a1, a2);

var _ap_php_asprintf = Module["_ap_php_asprintf"] = (a0, a1, a2) => (_ap_php_asprintf = Module["_ap_php_asprintf"] = wasmExports["ap_php_asprintf"])(a0, a1, a2);

var _zend_dtoa = Module["_zend_dtoa"] = (a0, a1, a2, a3, a4, a5) => (_zend_dtoa = Module["_zend_dtoa"] = wasmExports["zend_dtoa"])(a0, a1, a2, a3, a4, a5);

var _zend_freedtoa = Module["_zend_freedtoa"] = a0 => (_zend_freedtoa = Module["_zend_freedtoa"] = wasmExports["zend_freedtoa"])(a0);

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

var _php_network_connect_socket = Module["_php_network_connect_socket"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_network_connect_socket = Module["_php_network_connect_socket"] = wasmExports["php_network_connect_socket"])(a0, a1, a2, a3, a4, a5, a6);

var _php_network_bind_socket_to_local_addr = Module["_php_network_bind_socket_to_local_addr"] = (a0, a1, a2, a3, a4, a5) => (_php_network_bind_socket_to_local_addr = Module["_php_network_bind_socket_to_local_addr"] = wasmExports["php_network_bind_socket_to_local_addr"])(a0, a1, a2, a3, a4, a5);

var _php_network_populate_name_from_sockaddr = Module["_php_network_populate_name_from_sockaddr"] = (a0, a1, a2, a3, a4) => (_php_network_populate_name_from_sockaddr = Module["_php_network_populate_name_from_sockaddr"] = wasmExports["php_network_populate_name_from_sockaddr"])(a0, a1, a2, a3, a4);

var _php_network_get_peer_name = Module["_php_network_get_peer_name"] = (a0, a1, a2, a3) => (_php_network_get_peer_name = Module["_php_network_get_peer_name"] = wasmExports["php_network_get_peer_name"])(a0, a1, a2, a3);

var _php_network_get_sock_name = Module["_php_network_get_sock_name"] = (a0, a1, a2, a3) => (_php_network_get_sock_name = Module["_php_network_get_sock_name"] = wasmExports["php_network_get_sock_name"])(a0, a1, a2, a3);

var _php_network_accept_incoming = Module["_php_network_accept_incoming"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (_php_network_accept_incoming = Module["_php_network_accept_incoming"] = wasmExports["php_network_accept_incoming"])(a0, a1, a2, a3, a4, a5, a6, a7);

var _php_network_connect_socket_to_host = Module["_php_network_connect_socket_to_host"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (_php_network_connect_socket_to_host = Module["_php_network_connect_socket_to_host"] = wasmExports["php_network_connect_socket_to_host"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var _php_any_addr = Module["_php_any_addr"] = (a0, a1, a2) => (_php_any_addr = Module["_php_any_addr"] = wasmExports["php_any_addr"])(a0, a1, a2);

var _php_sockaddr_size = Module["_php_sockaddr_size"] = a0 => (_php_sockaddr_size = Module["_php_sockaddr_size"] = wasmExports["php_sockaddr_size"])(a0);

var _php_set_sock_blocking = Module["_php_set_sock_blocking"] = (a0, a1) => (_php_set_sock_blocking = Module["_php_set_sock_blocking"] = wasmExports["php_set_sock_blocking"])(a0, a1);

var _php_open_temporary_fd = Module["_php_open_temporary_fd"] = (a0, a1, a2) => (_php_open_temporary_fd = Module["_php_open_temporary_fd"] = wasmExports["php_open_temporary_fd"])(a0, a1, a2);

var _php_open_temporary_file = Module["_php_open_temporary_file"] = (a0, a1, a2) => (_php_open_temporary_file = Module["_php_open_temporary_file"] = wasmExports["php_open_temporary_file"])(a0, a1, a2);

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

var _zend_vstrpprintf = Module["_zend_vstrpprintf"] = (a0, a1, a2) => (_zend_vstrpprintf = Module["_zend_vstrpprintf"] = wasmExports["zend_vstrpprintf"])(a0, a1, a2);

var _php_stream_get_url_stream_wrappers_hash_global = Module["_php_stream_get_url_stream_wrappers_hash_global"] = () => (_php_stream_get_url_stream_wrappers_hash_global = Module["_php_stream_get_url_stream_wrappers_hash_global"] = wasmExports["php_stream_get_url_stream_wrappers_hash_global"])();

var _php_stream_encloses = Module["_php_stream_encloses"] = (a0, a1) => (_php_stream_encloses = Module["_php_stream_encloses"] = wasmExports["php_stream_encloses"])(a0, a1);

var _php_stream_from_persistent_id = Module["_php_stream_from_persistent_id"] = (a0, a1) => (_php_stream_from_persistent_id = Module["_php_stream_from_persistent_id"] = wasmExports["php_stream_from_persistent_id"])(a0, a1);

var __php_stream_free_enclosed = Module["__php_stream_free_enclosed"] = (a0, a1) => (__php_stream_free_enclosed = Module["__php_stream_free_enclosed"] = wasmExports["_php_stream_free_enclosed"])(a0, a1);

var __php_stream_fill_read_buffer = Module["__php_stream_fill_read_buffer"] = (a0, a1) => (__php_stream_fill_read_buffer = Module["__php_stream_fill_read_buffer"] = wasmExports["_php_stream_fill_read_buffer"])(a0, a1);

var __php_stream_putc = Module["__php_stream_putc"] = (a0, a1) => (__php_stream_putc = Module["__php_stream_putc"] = wasmExports["_php_stream_putc"])(a0, a1);

var __php_stream_puts = Module["__php_stream_puts"] = (a0, a1) => (__php_stream_puts = Module["__php_stream_puts"] = wasmExports["_php_stream_puts"])(a0, a1);

var _fflush = a0 => (_fflush = wasmExports["fflush"])(a0);

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

var _zend_llist_count = Module["_zend_llist_count"] = a0 => (_zend_llist_count = Module["_zend_llist_count"] = wasmExports["zend_llist_count"])(a0);

var __php_stream_mode_to_str = Module["__php_stream_mode_to_str"] = a0 => (__php_stream_mode_to_str = Module["__php_stream_mode_to_str"] = wasmExports["_php_stream_mode_to_str"])(a0);

var __php_stream_memory_get_buffer = Module["__php_stream_memory_get_buffer"] = a0 => (__php_stream_memory_get_buffer = Module["__php_stream_memory_get_buffer"] = wasmExports["_php_stream_memory_get_buffer"])(a0);

var __php_stream_temp_open = Module["__php_stream_temp_open"] = (a0, a1, a2, a3) => (__php_stream_temp_open = Module["__php_stream_temp_open"] = wasmExports["_php_stream_temp_open"])(a0, a1, a2, a3);

var __php_stream_fopen_temporary_file = Module["__php_stream_fopen_temporary_file"] = (a0, a1, a2) => (__php_stream_fopen_temporary_file = Module["__php_stream_fopen_temporary_file"] = wasmExports["_php_stream_fopen_temporary_file"])(a0, a1, a2);

var _php_stream_bucket_split = Module["_php_stream_bucket_split"] = (a0, a1, a2, a3) => (_php_stream_bucket_split = Module["_php_stream_bucket_split"] = wasmExports["php_stream_bucket_split"])(a0, a1, a2, a3);

var __php_stream_filter_prepend = Module["__php_stream_filter_prepend"] = (a0, a1) => (__php_stream_filter_prepend = Module["__php_stream_filter_prepend"] = wasmExports["_php_stream_filter_prepend"])(a0, a1);

var _php_stream_parse_fopen_modes = Module["_php_stream_parse_fopen_modes"] = (a0, a1) => (_php_stream_parse_fopen_modes = Module["_php_stream_parse_fopen_modes"] = wasmExports["php_stream_parse_fopen_modes"])(a0, a1);

var __php_stream_fopen = Module["__php_stream_fopen"] = (a0, a1, a2, a3) => (__php_stream_fopen = Module["__php_stream_fopen"] = wasmExports["_php_stream_fopen"])(a0, a1, a2, a3);

var __php_stream_fopen_with_path = Module["__php_stream_fopen_with_path"] = (a0, a1, a2, a3, a4) => (__php_stream_fopen_with_path = Module["__php_stream_fopen_with_path"] = wasmExports["_php_stream_fopen_with_path"])(a0, a1, a2, a3, a4);

var _add_property_resource_ex = Module["_add_property_resource_ex"] = (a0, a1, a2, a3) => (_add_property_resource_ex = Module["_add_property_resource_ex"] = wasmExports["add_property_resource_ex"])(a0, a1, a2, a3);

var _php_stream_xport_unregister = Module["_php_stream_xport_unregister"] = a0 => (_php_stream_xport_unregister = Module["_php_stream_xport_unregister"] = wasmExports["php_stream_xport_unregister"])(a0);

var _php_stream_xport_connect = Module["_php_stream_xport_connect"] = (a0, a1, a2, a3, a4, a5, a6) => (_php_stream_xport_connect = Module["_php_stream_xport_connect"] = wasmExports["php_stream_xport_connect"])(a0, a1, a2, a3, a4, a5, a6);

var _php_stream_xport_bind = Module["_php_stream_xport_bind"] = (a0, a1, a2, a3) => (_php_stream_xport_bind = Module["_php_stream_xport_bind"] = wasmExports["php_stream_xport_bind"])(a0, a1, a2, a3);

var _php_stream_xport_listen = Module["_php_stream_xport_listen"] = (a0, a1, a2) => (_php_stream_xport_listen = Module["_php_stream_xport_listen"] = wasmExports["php_stream_xport_listen"])(a0, a1, a2);

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

var _zend_fetch_class_with_scope = Module["_zend_fetch_class_with_scope"] = (a0, a1, a2) => (_zend_fetch_class_with_scope = Module["_zend_fetch_class_with_scope"] = wasmExports["zend_fetch_class_with_scope"])(a0, a1, a2);

var _zend_hash_del_ind = Module["_zend_hash_del_ind"] = (a0, a1) => (_zend_hash_del_ind = Module["_zend_hash_del_ind"] = wasmExports["zend_hash_del_ind"])(a0, a1);

var _zend_attach_symbol_table = Module["_zend_attach_symbol_table"] = a0 => (_zend_attach_symbol_table = Module["_zend_attach_symbol_table"] = wasmExports["zend_attach_symbol_table"])(a0);

var _zend_detach_symbol_table = Module["_zend_detach_symbol_table"] = a0 => (_zend_detach_symbol_table = Module["_zend_detach_symbol_table"] = wasmExports["zend_detach_symbol_table"])(a0);

var _zend_set_local_var = Module["_zend_set_local_var"] = (a0, a1, a2) => (_zend_set_local_var = Module["_zend_set_local_var"] = wasmExports["zend_set_local_var"])(a0, a1, a2);

var _zend_hash_func = Module["_zend_hash_func"] = (a0, a1) => (_zend_hash_func = Module["_zend_hash_func"] = wasmExports["zend_hash_func"])(a0, a1);

var _zend_signal = Module["_zend_signal"] = (a0, a1) => (_zend_signal = Module["_zend_signal"] = wasmExports["zend_signal"])(a0, a1);

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

var _zend_init_internal_run_time_cache = Module["_zend_init_internal_run_time_cache"] = () => (_zend_init_internal_run_time_cache = Module["_zend_init_internal_run_time_cache"] = wasmExports["zend_init_internal_run_time_cache"])();

var _zend_observer_activate = Module["_zend_observer_activate"] = () => (_zend_observer_activate = Module["_zend_observer_activate"] = wasmExports["zend_observer_activate"])();

var _zend_ini_deactivate = Module["_zend_ini_deactivate"] = () => (_zend_ini_deactivate = Module["_zend_ini_deactivate"] = wasmExports["zend_ini_deactivate"])();

var _zend_map_ptr_reset = Module["_zend_map_ptr_reset"] = () => (_zend_map_ptr_reset = Module["_zend_map_ptr_reset"] = wasmExports["zend_map_ptr_reset"])();

var _zend_error_zstr_at = Module["_zend_error_zstr_at"] = (a0, a1, a2, a3) => (_zend_error_zstr_at = Module["_zend_error_zstr_at"] = wasmExports["zend_error_zstr_at"])(a0, a1, a2, a3);

var _zend_error_at = Module["_zend_error_at"] = (a0, a1, a2, a3, a4) => (_zend_error_at = Module["_zend_error_at"] = wasmExports["zend_error_at"])(a0, a1, a2, a3, a4);

var _zend_error_at_noreturn = Module["_zend_error_at_noreturn"] = (a0, a1, a2, a3, a4) => (_zend_error_at_noreturn = Module["_zend_error_at_noreturn"] = wasmExports["zend_error_at_noreturn"])(a0, a1, a2, a3, a4);

var _zend_strerror_noreturn = Module["_zend_strerror_noreturn"] = (a0, a1, a2) => (_zend_strerror_noreturn = Module["_zend_strerror_noreturn"] = wasmExports["zend_strerror_noreturn"])(a0, a1, a2);

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

var _zend_sigaction = Module["_zend_sigaction"] = (a0, a1, a2) => (_zend_sigaction = Module["_zend_sigaction"] = wasmExports["zend_sigaction"])(a0, a1, a2);

var _zend_signal_startup = Module["_zend_signal_startup"] = () => (_zend_signal_startup = Module["_zend_signal_startup"] = wasmExports["zend_signal_startup"])();

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

var __zip_stdio_op_seek = Module["__zip_stdio_op_seek"] = (a0, a1, a2, a3, a4) => (__zip_stdio_op_seek = Module["__zip_stdio_op_seek"] = wasmExports["_zip_stdio_op_seek"])(a0, a1, a2, a3, a4);

var __zip_stdio_op_stat = Module["__zip_stdio_op_stat"] = (a0, a1) => (__zip_stdio_op_stat = Module["__zip_stdio_op_stat"] = wasmExports["_zip_stdio_op_stat"])(a0, a1);

var __zip_stdio_op_tell = Module["__zip_stdio_op_tell"] = (a0, a1) => (__zip_stdio_op_tell = Module["__zip_stdio_op_tell"] = wasmExports["_zip_stdio_op_tell"])(a0, a1);

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

var _zip_random_uint32 = Module["_zip_random_uint32"] = () => (_zip_random_uint32 = Module["_zip_random_uint32"] = wasmExports["zip_random_uint32"])();

var ___funcs_on_exit = () => (___funcs_on_exit = wasmExports["__funcs_on_exit"])();

var _emscripten_builtin_memalign = (a0, a1) => (_emscripten_builtin_memalign = wasmExports["emscripten_builtin_memalign"])(a0, a1);

var __emscripten_timeout = (a0, a1) => (__emscripten_timeout = wasmExports["_emscripten_timeout"])(a0, a1);

var _setThrew = (a0, a1) => (_setThrew = wasmExports["setThrew"])(a0, a1);

var __emscripten_tempret_set = a0 => (__emscripten_tempret_set = wasmExports["_emscripten_tempret_set"])(a0);

var __emscripten_tempret_get = () => (__emscripten_tempret_get = wasmExports["_emscripten_tempret_get"])();

var _getTempRet0 = Module["_getTempRet0"] = () => (_getTempRet0 = Module["_getTempRet0"] = wasmExports["getTempRet0"])();

var _setTempRet0 = Module["_setTempRet0"] = a0 => (_setTempRet0 = Module["_setTempRet0"] = wasmExports["setTempRet0"])(a0);

var __emscripten_stack_restore = a0 => (__emscripten_stack_restore = wasmExports["_emscripten_stack_restore"])(a0);

var __emscripten_stack_alloc = a0 => (__emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"])(a0);

var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();

var __Znwm = Module["__Znwm"] = a0 => (__Znwm = Module["__Znwm"] = wasmExports["_Znwm"])(a0);

var __Znam = Module["__Znam"] = a0 => (__Znam = Module["__Znam"] = wasmExports["_Znam"])(a0);

var __ZdlPv = Module["__ZdlPv"] = a0 => (__ZdlPv = Module["__ZdlPv"] = wasmExports["_ZdlPv"])(a0);

var __ZdlPvm = Module["__ZdlPvm"] = (a0, a1) => (__ZdlPvm = Module["__ZdlPvm"] = wasmExports["_ZdlPvm"])(a0, a1);

var __ZdaPv = Module["__ZdaPv"] = a0 => (__ZdaPv = Module["__ZdaPv"] = wasmExports["_ZdaPv"])(a0);

var __ZdaPvm = Module["__ZdaPvm"] = (a0, a1) => (__ZdaPvm = Module["__ZdaPvm"] = wasmExports["_ZdaPvm"])(a0, a1);

var __ZnwmSt11align_val_t = Module["__ZnwmSt11align_val_t"] = (a0, a1) => (__ZnwmSt11align_val_t = Module["__ZnwmSt11align_val_t"] = wasmExports["_ZnwmSt11align_val_t"])(a0, a1);

var __ZnamSt11align_val_t = Module["__ZnamSt11align_val_t"] = (a0, a1) => (__ZnamSt11align_val_t = Module["__ZnamSt11align_val_t"] = wasmExports["_ZnamSt11align_val_t"])(a0, a1);

var __ZdlPvSt11align_val_t = Module["__ZdlPvSt11align_val_t"] = (a0, a1) => (__ZdlPvSt11align_val_t = Module["__ZdlPvSt11align_val_t"] = wasmExports["_ZdlPvSt11align_val_t"])(a0, a1);

var __ZdlPvmSt11align_val_t = Module["__ZdlPvmSt11align_val_t"] = (a0, a1, a2) => (__ZdlPvmSt11align_val_t = Module["__ZdlPvmSt11align_val_t"] = wasmExports["_ZdlPvmSt11align_val_t"])(a0, a1, a2);

var __ZdaPvSt11align_val_t = Module["__ZdaPvSt11align_val_t"] = (a0, a1) => (__ZdaPvSt11align_val_t = Module["__ZdaPvSt11align_val_t"] = wasmExports["_ZdaPvSt11align_val_t"])(a0, a1);

var __ZdaPvmSt11align_val_t = Module["__ZdaPvmSt11align_val_t"] = (a0, a1, a2) => (__ZdaPvmSt11align_val_t = Module["__ZdaPvmSt11align_val_t"] = wasmExports["_ZdaPvmSt11align_val_t"])(a0, a1, a2);

var __ZSt14set_unexpectedPFvvE = Module["__ZSt14set_unexpectedPFvvE"] = a0 => (__ZSt14set_unexpectedPFvvE = Module["__ZSt14set_unexpectedPFvvE"] = wasmExports["_ZSt14set_unexpectedPFvvE"])(a0);

var __ZSt13set_terminatePFvvE = Module["__ZSt13set_terminatePFvvE"] = a0 => (__ZSt13set_terminatePFvvE = Module["__ZSt13set_terminatePFvvE"] = wasmExports["_ZSt13set_terminatePFvvE"])(a0);

var __ZSt15set_new_handlerPFvvE = Module["__ZSt15set_new_handlerPFvvE"] = a0 => (__ZSt15set_new_handlerPFvvE = Module["__ZSt15set_new_handlerPFvvE"] = wasmExports["_ZSt15set_new_handlerPFvvE"])(a0);

var __ZSt14get_unexpectedv = Module["__ZSt14get_unexpectedv"] = () => (__ZSt14get_unexpectedv = Module["__ZSt14get_unexpectedv"] = wasmExports["_ZSt14get_unexpectedv"])();

var __ZSt10unexpectedv = Module["__ZSt10unexpectedv"] = () => (__ZSt10unexpectedv = Module["__ZSt10unexpectedv"] = wasmExports["_ZSt10unexpectedv"])();

var __ZSt13get_terminatev = Module["__ZSt13get_terminatev"] = () => (__ZSt13get_terminatev = Module["__ZSt13get_terminatev"] = wasmExports["_ZSt13get_terminatev"])();

var __ZSt9terminatev = Module["__ZSt9terminatev"] = () => (__ZSt9terminatev = Module["__ZSt9terminatev"] = wasmExports["_ZSt9terminatev"])();

var __ZSt15get_new_handlerv = Module["__ZSt15get_new_handlerv"] = () => (__ZSt15get_new_handlerv = Module["__ZSt15get_new_handlerv"] = wasmExports["_ZSt15get_new_handlerv"])();

var ___cxa_increment_exception_refcount = a0 => (___cxa_increment_exception_refcount = wasmExports["__cxa_increment_exception_refcount"])(a0);

var ___cxa_decrement_exception_refcount = a0 => (___cxa_decrement_exception_refcount = wasmExports["__cxa_decrement_exception_refcount"])(a0);

var ___cxa_current_primary_exception = Module["___cxa_current_primary_exception"] = () => (___cxa_current_primary_exception = Module["___cxa_current_primary_exception"] = wasmExports["__cxa_current_primary_exception"])();

var ___cxa_rethrow_primary_exception = Module["___cxa_rethrow_primary_exception"] = a0 => (___cxa_rethrow_primary_exception = Module["___cxa_rethrow_primary_exception"] = wasmExports["__cxa_rethrow_primary_exception"])(a0);

var ___cxa_uncaught_exception = Module["___cxa_uncaught_exception"] = () => (___cxa_uncaught_exception = Module["___cxa_uncaught_exception"] = wasmExports["__cxa_uncaught_exception"])();

var ___cxa_uncaught_exceptions = Module["___cxa_uncaught_exceptions"] = () => (___cxa_uncaught_exceptions = Module["___cxa_uncaught_exceptions"] = wasmExports["__cxa_uncaught_exceptions"])();

var ___cxa_allocate_exception = Module["___cxa_allocate_exception"] = a0 => (___cxa_allocate_exception = Module["___cxa_allocate_exception"] = wasmExports["__cxa_allocate_exception"])(a0);

var ___cxa_free_exception = Module["___cxa_free_exception"] = a0 => (___cxa_free_exception = Module["___cxa_free_exception"] = wasmExports["__cxa_free_exception"])(a0);

var ___cxa_init_primary_exception = Module["___cxa_init_primary_exception"] = (a0, a1, a2) => (___cxa_init_primary_exception = Module["___cxa_init_primary_exception"] = wasmExports["__cxa_init_primary_exception"])(a0, a1, a2);

var ___cxa_pure_virtual = Module["___cxa_pure_virtual"] = () => (___cxa_pure_virtual = Module["___cxa_pure_virtual"] = wasmExports["__cxa_pure_virtual"])();

var ___cxa_deleted_virtual = Module["___cxa_deleted_virtual"] = () => (___cxa_deleted_virtual = Module["___cxa_deleted_virtual"] = wasmExports["__cxa_deleted_virtual"])();

var ___dynamic_cast = Module["___dynamic_cast"] = (a0, a1, a2, a3) => (___dynamic_cast = Module["___dynamic_cast"] = wasmExports["__dynamic_cast"])(a0, a1, a2, a3);

var ___cxa_get_exception_ptr = a0 => (___cxa_get_exception_ptr = wasmExports["__cxa_get_exception_ptr"])(a0);

var __ZNSt9exceptionD2Ev = Module["__ZNSt9exceptionD2Ev"] = a0 => (__ZNSt9exceptionD2Ev = Module["__ZNSt9exceptionD2Ev"] = wasmExports["_ZNSt9exceptionD2Ev"])(a0);

var __ZNSt9exceptionD0Ev = Module["__ZNSt9exceptionD0Ev"] = a0 => (__ZNSt9exceptionD0Ev = Module["__ZNSt9exceptionD0Ev"] = wasmExports["_ZNSt9exceptionD0Ev"])(a0);

var __ZNKSt9exception4whatEv = Module["__ZNKSt9exception4whatEv"] = a0 => (__ZNKSt9exception4whatEv = Module["__ZNKSt9exception4whatEv"] = wasmExports["_ZNKSt9exception4whatEv"])(a0);

var __ZNSt13bad_exceptionD0Ev = Module["__ZNSt13bad_exceptionD0Ev"] = a0 => (__ZNSt13bad_exceptionD0Ev = Module["__ZNSt13bad_exceptionD0Ev"] = wasmExports["_ZNSt13bad_exceptionD0Ev"])(a0);

var __ZNKSt13bad_exception4whatEv = Module["__ZNKSt13bad_exception4whatEv"] = a0 => (__ZNKSt13bad_exception4whatEv = Module["__ZNKSt13bad_exception4whatEv"] = wasmExports["_ZNKSt13bad_exception4whatEv"])(a0);

var __ZNSt9bad_allocC2Ev = Module["__ZNSt9bad_allocC2Ev"] = a0 => (__ZNSt9bad_allocC2Ev = Module["__ZNSt9bad_allocC2Ev"] = wasmExports["_ZNSt9bad_allocC2Ev"])(a0);

var __ZNSt9bad_allocD0Ev = Module["__ZNSt9bad_allocD0Ev"] = a0 => (__ZNSt9bad_allocD0Ev = Module["__ZNSt9bad_allocD0Ev"] = wasmExports["_ZNSt9bad_allocD0Ev"])(a0);

var __ZNKSt9bad_alloc4whatEv = Module["__ZNKSt9bad_alloc4whatEv"] = a0 => (__ZNKSt9bad_alloc4whatEv = Module["__ZNKSt9bad_alloc4whatEv"] = wasmExports["_ZNKSt9bad_alloc4whatEv"])(a0);

var __ZNSt20bad_array_new_lengthC2Ev = Module["__ZNSt20bad_array_new_lengthC2Ev"] = a0 => (__ZNSt20bad_array_new_lengthC2Ev = Module["__ZNSt20bad_array_new_lengthC2Ev"] = wasmExports["_ZNSt20bad_array_new_lengthC2Ev"])(a0);

var __ZNSt20bad_array_new_lengthD0Ev = Module["__ZNSt20bad_array_new_lengthD0Ev"] = a0 => (__ZNSt20bad_array_new_lengthD0Ev = Module["__ZNSt20bad_array_new_lengthD0Ev"] = wasmExports["_ZNSt20bad_array_new_lengthD0Ev"])(a0);

var __ZNKSt20bad_array_new_length4whatEv = Module["__ZNKSt20bad_array_new_length4whatEv"] = a0 => (__ZNKSt20bad_array_new_length4whatEv = Module["__ZNKSt20bad_array_new_length4whatEv"] = wasmExports["_ZNKSt20bad_array_new_length4whatEv"])(a0);

var __ZNSt9exceptionD1Ev = Module["__ZNSt9exceptionD1Ev"] = a0 => (__ZNSt9exceptionD1Ev = Module["__ZNSt9exceptionD1Ev"] = wasmExports["_ZNSt9exceptionD1Ev"])(a0);

var __ZNSt13bad_exceptionD2Ev = Module["__ZNSt13bad_exceptionD2Ev"] = a0 => (__ZNSt13bad_exceptionD2Ev = Module["__ZNSt13bad_exceptionD2Ev"] = wasmExports["_ZNSt13bad_exceptionD2Ev"])(a0);

var __ZNSt13bad_exceptionD1Ev = Module["__ZNSt13bad_exceptionD1Ev"] = a0 => (__ZNSt13bad_exceptionD1Ev = Module["__ZNSt13bad_exceptionD1Ev"] = wasmExports["_ZNSt13bad_exceptionD1Ev"])(a0);

var __ZNSt9bad_allocC1Ev = Module["__ZNSt9bad_allocC1Ev"] = a0 => (__ZNSt9bad_allocC1Ev = Module["__ZNSt9bad_allocC1Ev"] = wasmExports["_ZNSt9bad_allocC1Ev"])(a0);

var __ZNSt9bad_allocD2Ev = Module["__ZNSt9bad_allocD2Ev"] = a0 => (__ZNSt9bad_allocD2Ev = Module["__ZNSt9bad_allocD2Ev"] = wasmExports["_ZNSt9bad_allocD2Ev"])(a0);

var __ZNSt9bad_allocD1Ev = Module["__ZNSt9bad_allocD1Ev"] = a0 => (__ZNSt9bad_allocD1Ev = Module["__ZNSt9bad_allocD1Ev"] = wasmExports["_ZNSt9bad_allocD1Ev"])(a0);

var __ZNSt20bad_array_new_lengthC1Ev = Module["__ZNSt20bad_array_new_lengthC1Ev"] = a0 => (__ZNSt20bad_array_new_lengthC1Ev = Module["__ZNSt20bad_array_new_lengthC1Ev"] = wasmExports["_ZNSt20bad_array_new_lengthC1Ev"])(a0);

var __ZNSt20bad_array_new_lengthD2Ev = Module["__ZNSt20bad_array_new_lengthD2Ev"] = a0 => (__ZNSt20bad_array_new_lengthD2Ev = Module["__ZNSt20bad_array_new_lengthD2Ev"] = wasmExports["_ZNSt20bad_array_new_lengthD2Ev"])(a0);

var __ZNSt20bad_array_new_lengthD1Ev = Module["__ZNSt20bad_array_new_lengthD1Ev"] = a0 => (__ZNSt20bad_array_new_lengthD1Ev = Module["__ZNSt20bad_array_new_lengthD1Ev"] = wasmExports["_ZNSt20bad_array_new_lengthD1Ev"])(a0);

var __ZNSt9type_infoD2Ev = Module["__ZNSt9type_infoD2Ev"] = a0 => (__ZNSt9type_infoD2Ev = Module["__ZNSt9type_infoD2Ev"] = wasmExports["_ZNSt9type_infoD2Ev"])(a0);

var __ZNSt9type_infoD0Ev = Module["__ZNSt9type_infoD0Ev"] = a0 => (__ZNSt9type_infoD0Ev = Module["__ZNSt9type_infoD0Ev"] = wasmExports["_ZNSt9type_infoD0Ev"])(a0);

var __ZNSt8bad_castC2Ev = Module["__ZNSt8bad_castC2Ev"] = a0 => (__ZNSt8bad_castC2Ev = Module["__ZNSt8bad_castC2Ev"] = wasmExports["_ZNSt8bad_castC2Ev"])(a0);

var __ZNSt8bad_castD2Ev = Module["__ZNSt8bad_castD2Ev"] = a0 => (__ZNSt8bad_castD2Ev = Module["__ZNSt8bad_castD2Ev"] = wasmExports["_ZNSt8bad_castD2Ev"])(a0);

var __ZNSt8bad_castD0Ev = Module["__ZNSt8bad_castD0Ev"] = a0 => (__ZNSt8bad_castD0Ev = Module["__ZNSt8bad_castD0Ev"] = wasmExports["_ZNSt8bad_castD0Ev"])(a0);

var __ZNKSt8bad_cast4whatEv = Module["__ZNKSt8bad_cast4whatEv"] = a0 => (__ZNKSt8bad_cast4whatEv = Module["__ZNKSt8bad_cast4whatEv"] = wasmExports["_ZNKSt8bad_cast4whatEv"])(a0);

var __ZNSt10bad_typeidC2Ev = Module["__ZNSt10bad_typeidC2Ev"] = a0 => (__ZNSt10bad_typeidC2Ev = Module["__ZNSt10bad_typeidC2Ev"] = wasmExports["_ZNSt10bad_typeidC2Ev"])(a0);

var __ZNSt10bad_typeidD2Ev = Module["__ZNSt10bad_typeidD2Ev"] = a0 => (__ZNSt10bad_typeidD2Ev = Module["__ZNSt10bad_typeidD2Ev"] = wasmExports["_ZNSt10bad_typeidD2Ev"])(a0);

var __ZNSt10bad_typeidD0Ev = Module["__ZNSt10bad_typeidD0Ev"] = a0 => (__ZNSt10bad_typeidD0Ev = Module["__ZNSt10bad_typeidD0Ev"] = wasmExports["_ZNSt10bad_typeidD0Ev"])(a0);

var __ZNKSt10bad_typeid4whatEv = Module["__ZNKSt10bad_typeid4whatEv"] = a0 => (__ZNKSt10bad_typeid4whatEv = Module["__ZNKSt10bad_typeid4whatEv"] = wasmExports["_ZNKSt10bad_typeid4whatEv"])(a0);

var __ZNSt9type_infoD1Ev = Module["__ZNSt9type_infoD1Ev"] = a0 => (__ZNSt9type_infoD1Ev = Module["__ZNSt9type_infoD1Ev"] = wasmExports["_ZNSt9type_infoD1Ev"])(a0);

var __ZNSt8bad_castC1Ev = Module["__ZNSt8bad_castC1Ev"] = a0 => (__ZNSt8bad_castC1Ev = Module["__ZNSt8bad_castC1Ev"] = wasmExports["_ZNSt8bad_castC1Ev"])(a0);

var __ZNSt8bad_castD1Ev = Module["__ZNSt8bad_castD1Ev"] = a0 => (__ZNSt8bad_castD1Ev = Module["__ZNSt8bad_castD1Ev"] = wasmExports["_ZNSt8bad_castD1Ev"])(a0);

var __ZNSt10bad_typeidC1Ev = Module["__ZNSt10bad_typeidC1Ev"] = a0 => (__ZNSt10bad_typeidC1Ev = Module["__ZNSt10bad_typeidC1Ev"] = wasmExports["_ZNSt10bad_typeidC1Ev"])(a0);

var __ZNSt10bad_typeidD1Ev = Module["__ZNSt10bad_typeidD1Ev"] = a0 => (__ZNSt10bad_typeidD1Ev = Module["__ZNSt10bad_typeidD1Ev"] = wasmExports["_ZNSt10bad_typeidD1Ev"])(a0);

var dynCall_iii = Module["dynCall_iii"] = (a0, a1, a2) => (dynCall_iii = Module["dynCall_iii"] = wasmExports["dynCall_iii"])(a0, a1, a2);

var dynCall_ii = Module["dynCall_ii"] = (a0, a1) => (dynCall_ii = Module["dynCall_ii"] = wasmExports["dynCall_ii"])(a0, a1);

var dynCall_vi = Module["dynCall_vi"] = (a0, a1) => (dynCall_vi = Module["dynCall_vi"] = wasmExports["dynCall_vi"])(a0, a1);

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

var dynCall_viiiii = Module["dynCall_viiiii"] = (a0, a1, a2, a3, a4, a5) => (dynCall_viiiii = Module["dynCall_viiiii"] = wasmExports["dynCall_viiiii"])(a0, a1, a2, a3, a4, a5);

var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = wasmExports["dynCall_iiiiiiii"])(a0, a1, a2, a3, a4, a5, a6, a7);

var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = wasmExports["dynCall_viiiiiiii"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);

var dynCall_viiiiii = Module["dynCall_viiiiii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_viiiiii = Module["dynCall_viiiiii"] = wasmExports["dynCall_viiiiii"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = wasmExports["dynCall_iiiiiiiiii"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

var dynCall_jiji = Module["dynCall_jiji"] = (a0, a1, a2, a3, a4) => (dynCall_jiji = Module["dynCall_jiji"] = wasmExports["dynCall_jiji"])(a0, a1, a2, a3, a4);

var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iiiiiii = Module["dynCall_iiiiiii"] = wasmExports["dynCall_iiiiiii"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_jiiiji = Module["dynCall_jiiiji"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_jiiiji = Module["dynCall_jiiiji"] = wasmExports["dynCall_jiiiji"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_jiiji = Module["dynCall_jiiji"] = (a0, a1, a2, a3, a4, a5) => (dynCall_jiiji = Module["dynCall_jiiji"] = wasmExports["dynCall_jiiji"])(a0, a1, a2, a3, a4, a5);

var dynCall_vidi = Module["dynCall_vidi"] = (a0, a1, a2, a3) => (dynCall_vidi = Module["dynCall_vidi"] = wasmExports["dynCall_vidi"])(a0, a1, a2, a3);

var dynCall_iidiiii = Module["dynCall_iidiiii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iidiiii = Module["dynCall_iidiiii"] = wasmExports["dynCall_iidiiii"])(a0, a1, a2, a3, a4, a5, a6);

var dynCall_ji = Module["dynCall_ji"] = (a0, a1) => (dynCall_ji = Module["dynCall_ji"] = wasmExports["dynCall_ji"])(a0, a1);

var dynCall_jj = Module["dynCall_jj"] = (a0, a1, a2) => (dynCall_jj = Module["dynCall_jj"] = wasmExports["dynCall_jj"])(a0, a1, a2);

var dynCall_iiij = Module["dynCall_iiij"] = (a0, a1, a2, a3, a4) => (dynCall_iiij = Module["dynCall_iiij"] = wasmExports["dynCall_iiij"])(a0, a1, a2, a3, a4);

var dynCall_jiij = Module["dynCall_jiij"] = (a0, a1, a2, a3, a4) => (dynCall_jiij = Module["dynCall_jiij"] = wasmExports["dynCall_jiij"])(a0, a1, a2, a3, a4);

var dynCall_iiiji = Module["dynCall_iiiji"] = (a0, a1, a2, a3, a4, a5) => (dynCall_iiiji = Module["dynCall_iiiji"] = wasmExports["dynCall_iiiji"])(a0, a1, a2, a3, a4, a5);

var dynCall_jii = Module["dynCall_jii"] = (a0, a1, a2) => (dynCall_jii = Module["dynCall_jii"] = wasmExports["dynCall_jii"])(a0, a1, a2);

var _asyncify_start_unwind = a0 => (_asyncify_start_unwind = wasmExports["asyncify_start_unwind"])(a0);

var _asyncify_stop_unwind = () => (_asyncify_stop_unwind = wasmExports["asyncify_stop_unwind"])();

var _asyncify_start_rewind = a0 => (_asyncify_start_rewind = wasmExports["asyncify_start_rewind"])(a0);

var _asyncify_stop_rewind = () => (_asyncify_stop_rewind = wasmExports["asyncify_stop_rewind"])();

var _executor_globals = Module["_executor_globals"] = 1287840;

var _zend_empty_string = Module["_zend_empty_string"] = 1289040;

var _std_object_handlers = Module["_std_object_handlers"] = 1125164;

var _zend_ce_aggregate = Module["_zend_ce_aggregate"] = 1278840;

var _zend_ce_error = Module["_zend_ce_error"] = 1287180;

var _zend_ce_exception = Module["_zend_ce_exception"] = 1282372;

var _zend_string_init_interned = Module["_zend_string_init_interned"] = 1287832;

var _basic_globals = Module["_basic_globals"] = 1273664;

var _pcre_globals = Module["_pcre_globals"] = 1192144;

var _zend_one_char_string = Module["_zend_one_char_string"] = 1279008;

var _sapi_module = Module["_sapi_module"] = 1275244;

var _php_hashcontext_ce = Module["_php_hashcontext_ce"] = 1192360;

var _file_globals = Module["_file_globals"] = 1275536;

var _compiler_globals = Module["_compiler_globals"] = 1289044;

var _zend_known_strings = Module["_zend_known_strings"] = 1287052;

var _zend_ce_value_error = Module["_zend_ce_value_error"] = 1277844;

var _json_globals = Module["_json_globals"] = 1192464;

var _php_json_exception_ce = Module["_php_json_exception_ce"] = 1192476;

var _php_json_serializable_ce = Module["_php_json_serializable_ce"] = 1195240;

var _core_globals = Module["_core_globals"] = 1287368;

var _zend_empty_array = Module["_zend_empty_array"] = 1124724;

var _module_registry = Module["_module_registry"] = 1287320;

var _spl_ce_RuntimeException = Module["_spl_ce_RuntimeException"] = 1195344;

var _zend_observer_fcall_op_array_extension = Module["_zend_observer_fcall_op_array_extension"] = 1287768;

var _zend_standard_class_def = Module["_zend_standard_class_def"] = 1277044;

var _sapi_globals = Module["_sapi_globals"] = 1289392;

var _ps_globals = Module["_ps_globals"] = 1193696;

var _random_ce_Random_BrokenRandomEngineError = Module["_random_ce_Random_BrokenRandomEngineError"] = 1265140;

var _php_random_algo_mt19937 = Module["_php_random_algo_mt19937"] = 810700;

var _random_globals = Module["_random_globals"] = 1193412;

var _php_random_algo_combinedlcg = Module["_php_random_algo_combinedlcg"] = 810512;

var _random_ce_Random_Engine = Module["_random_ce_Random_Engine"] = 1193432;

var _random_ce_Random_CryptoSafeEngine = Module["_random_ce_Random_CryptoSafeEngine"] = 1192892;

var _random_ce_Random_RandomError = Module["_random_ce_Random_RandomError"] = 1192896;

var _random_ce_Random_RandomException = Module["_random_ce_Random_RandomException"] = 1193448;

var _random_ce_Random_Engine_Mt19937 = Module["_random_ce_Random_Engine_Mt19937"] = 1192900;

var _random_ce_Random_Engine_PcgOneseq128XslRr64 = Module["_random_ce_Random_Engine_PcgOneseq128XslRr64"] = 1193004;

var _random_ce_Random_Engine_Xoshiro256StarStar = Module["_random_ce_Random_Engine_Xoshiro256StarStar"] = 1193108;

var _random_ce_Random_Engine_Secure = Module["_random_ce_Random_Engine_Secure"] = 1193436;

var _random_ce_Random_Randomizer = Module["_random_ce_Random_Randomizer"] = 1193440;

var _random_ce_Random_IntervalBoundary = Module["_random_ce_Random_IntervalBoundary"] = 1193444;

var _php_random_algo_pcgoneseq128xslrr64 = Module["_php_random_algo_pcgoneseq128xslrr64"] = 810540;

var _php_random_algo_xoshiro256starstar = Module["_php_random_algo_xoshiro256starstar"] = 810568;

var _php_random_algo_secure = Module["_php_random_algo_secure"] = 810672;

var _php_random_algo_user = Module["_php_random_algo_user"] = 810728;

var _reflection_enum_ptr = Module["_reflection_enum_ptr"] = 1193452;

var _reflection_class_ptr = Module["_reflection_class_ptr"] = 1193456;

var _reflection_exception_ptr = Module["_reflection_exception_ptr"] = 1193460;

var _zend_ce_closure = Module["_zend_ce_closure"] = 1287780;

var _zend_ce_generator = Module["_zend_ce_generator"] = 1287784;

var _zend_ce_traversable = Module["_zend_ce_traversable"] = 1277616;

var _reflection_reference_ptr = Module["_reflection_reference_ptr"] = 1193464;

var _zend_ce_fiber = Module["_zend_ce_fiber"] = 1287072;

var _reflection_ptr = Module["_reflection_ptr"] = 1193588;

var _zend_ce_stringable = Module["_zend_ce_stringable"] = 1286508;

var _reflector_ptr = Module["_reflector_ptr"] = 1193592;

var _reflection_function_abstract_ptr = Module["_reflection_function_abstract_ptr"] = 1193596;

var _reflection_function_ptr = Module["_reflection_function_ptr"] = 1193600;

var _reflection_generator_ptr = Module["_reflection_generator_ptr"] = 1193604;

var _reflection_parameter_ptr = Module["_reflection_parameter_ptr"] = 1193608;

var _reflection_type_ptr = Module["_reflection_type_ptr"] = 1193612;

var _reflection_named_type_ptr = Module["_reflection_named_type_ptr"] = 1193616;

var _reflection_union_type_ptr = Module["_reflection_union_type_ptr"] = 1193620;

var _reflection_intersection_type_ptr = Module["_reflection_intersection_type_ptr"] = 1193624;

var _reflection_method_ptr = Module["_reflection_method_ptr"] = 1193628;

var _reflection_object_ptr = Module["_reflection_object_ptr"] = 1193632;

var _reflection_property_ptr = Module["_reflection_property_ptr"] = 1193636;

var _reflection_class_constant_ptr = Module["_reflection_class_constant_ptr"] = 1193640;

var _reflection_extension_ptr = Module["_reflection_extension_ptr"] = 1193644;

var _reflection_zend_extension_ptr = Module["_reflection_zend_extension_ptr"] = 1193648;

var _reflection_attribute_ptr = Module["_reflection_attribute_ptr"] = 1193652;

var _reflection_enum_unit_case_ptr = Module["_reflection_enum_unit_case_ptr"] = 1193656;

var _reflection_enum_backed_case_ptr = Module["_reflection_enum_backed_case_ptr"] = 1193660;

var _reflection_fiber_ptr = Module["_reflection_fiber_ptr"] = 1193664;

var _php_session_iface_entry = Module["_php_session_iface_entry"] = 1193668;

var _php_session_id_iface_entry = Module["_php_session_id_iface_entry"] = 1193672;

var _php_session_update_timestamp_iface_entry = Module["_php_session_update_timestamp_iface_entry"] = 1193676;

var _php_session_class_entry = Module["_php_session_class_entry"] = 1193680;

var _php_rfc1867_callback = Module["_php_rfc1867_callback"] = 1275060;

var _spl_ce_AppendIterator = Module["_spl_ce_AppendIterator"] = 1194084;

var _spl_ce_ArrayIterator = Module["_spl_ce_ArrayIterator"] = 1194296;

var _spl_ce_ArrayObject = Module["_spl_ce_ArrayObject"] = 1194300;

var _spl_ce_BadFunctionCallException = Module["_spl_ce_BadFunctionCallException"] = 1194748;

var _spl_ce_BadMethodCallException = Module["_spl_ce_BadMethodCallException"] = 1194752;

var _spl_ce_CachingIterator = Module["_spl_ce_CachingIterator"] = 1194064;

var _spl_ce_CallbackFilterIterator = Module["_spl_ce_CallbackFilterIterator"] = 1194036;

var _spl_ce_DirectoryIterator = Module["_spl_ce_DirectoryIterator"] = 1194620;

var _spl_ce_DomainException = Module["_spl_ce_DomainException"] = 1194756;

var _spl_ce_EmptyIterator = Module["_spl_ce_EmptyIterator"] = 1194292;

var _spl_ce_FilesystemIterator = Module["_spl_ce_FilesystemIterator"] = 1194624;

var _spl_ce_FilterIterator = Module["_spl_ce_FilterIterator"] = 1194032;

var _spl_ce_GlobIterator = Module["_spl_ce_GlobIterator"] = 1194736;

var _spl_ce_InfiniteIterator = Module["_spl_ce_InfiniteIterator"] = 1194080;

var _spl_ce_InvalidArgumentException = Module["_spl_ce_InvalidArgumentException"] = 1195232;

var _spl_ce_IteratorIterator = Module["_spl_ce_IteratorIterator"] = 1194072;

var _spl_ce_LengthException = Module["_spl_ce_LengthException"] = 1194760;

var _spl_ce_LimitIterator = Module["_spl_ce_LimitIterator"] = 1194060;

var _spl_ce_LogicException = Module["_spl_ce_LogicException"] = 1194744;

var _spl_ce_MultipleIterator = Module["_spl_ce_MultipleIterator"] = 1194892;

var _spl_ce_NoRewindIterator = Module["_spl_ce_NoRewindIterator"] = 1194076;

var _spl_ce_OuterIterator = Module["_spl_ce_OuterIterator"] = 1194088;

var _spl_ce_OutOfBoundsException = Module["_spl_ce_OutOfBoundsException"] = 1194764;

var _spl_ce_OutOfRangeException = Module["_spl_ce_OutOfRangeException"] = 1194896;

var _spl_ce_OverflowException = Module["_spl_ce_OverflowException"] = 1194768;

var _spl_ce_ParentIterator = Module["_spl_ce_ParentIterator"] = 1194048;

var _spl_ce_RangeException = Module["_spl_ce_RangeException"] = 1194772;

var _spl_ce_RecursiveArrayIterator = Module["_spl_ce_RecursiveArrayIterator"] = 1194504;

var _spl_ce_RecursiveCachingIterator = Module["_spl_ce_RecursiveCachingIterator"] = 1194068;

var _spl_ce_RecursiveCallbackFilterIterator = Module["_spl_ce_RecursiveCallbackFilterIterator"] = 1194040;

var _spl_ce_RecursiveDirectoryIterator = Module["_spl_ce_RecursiveDirectoryIterator"] = 1194632;

var _spl_ce_RecursiveFilterIterator = Module["_spl_ce_RecursiveFilterIterator"] = 1194044;

var _spl_ce_RecursiveIterator = Module["_spl_ce_RecursiveIterator"] = 1194628;

var _spl_ce_RecursiveIteratorIterator = Module["_spl_ce_RecursiveIteratorIterator"] = 1194024;

var _spl_ce_RecursiveRegexIterator = Module["_spl_ce_RecursiveRegexIterator"] = 1194056;

var _spl_ce_RecursiveTreeIterator = Module["_spl_ce_RecursiveTreeIterator"] = 1194028;

var _spl_ce_RegexIterator = Module["_spl_ce_RegexIterator"] = 1194052;

var _spl_ce_SeekableIterator = Module["_spl_ce_SeekableIterator"] = 1194616;

var _spl_ce_SplDoublyLinkedList = Module["_spl_ce_SplDoublyLinkedList"] = 1194904;

var _spl_ce_SplFileInfo = Module["_spl_ce_SplFileInfo"] = 1194512;

var _spl_ce_SplFileObject = Module["_spl_ce_SplFileObject"] = 1194508;

var _spl_ce_SplFixedArray = Module["_spl_ce_SplFixedArray"] = 1195236;

var _spl_ce_SplHeap = Module["_spl_ce_SplHeap"] = 1195016;

var _spl_ce_SplMinHeap = Module["_spl_ce_SplMinHeap"] = 1195124;

var _spl_ce_SplMaxHeap = Module["_spl_ce_SplMaxHeap"] = 1195128;

var _spl_ce_SplObjectStorage = Module["_spl_ce_SplObjectStorage"] = 1194780;

var _spl_ce_SplObserver = Module["_spl_ce_SplObserver"] = 1194784;

var _spl_ce_SplPriorityQueue = Module["_spl_ce_SplPriorityQueue"] = 1195020;

var _spl_ce_SplQueue = Module["_spl_ce_SplQueue"] = 1195008;

var _spl_ce_SplStack = Module["_spl_ce_SplStack"] = 1195012;

var _spl_ce_SplSubject = Module["_spl_ce_SplSubject"] = 1194788;

var _spl_ce_SplTempFileObject = Module["_spl_ce_SplTempFileObject"] = 1194740;

var _spl_ce_UnderflowException = Module["_spl_ce_UnderflowException"] = 1194776;

var _spl_ce_UnexpectedValueException = Module["_spl_ce_UnexpectedValueException"] = 1194900;

var _zend_autoload = Module["_zend_autoload"] = 1275632;

var _zend_compile_file = Module["_zend_compile_file"] = 1286932;

var _zend_ce_iterator = Module["_zend_ce_iterator"] = 1282268;

var _zend_ce_arrayaccess = Module["_zend_ce_arrayaccess"] = 1278832;

var _zend_ce_countable = Module["_zend_ce_countable"] = 1278836;

var _empty_fcall_info_cache = Module["_empty_fcall_info_cache"] = 1099264;

var _zend_ce_serializable = Module["_zend_ce_serializable"] = 1287056;

var _php_glob_stream_ops = Module["_php_glob_stream_ops"] = 1043452;

var _spl_handler_SplObjectStorage = Module["_spl_handler_SplObjectStorage"] = 1194792;

var _empty_fcall_info = Module["_empty_fcall_info"] = 1099216;

var _php_ce_incomplete_class = Module["_php_ce_incomplete_class"] = 1273644;

var _assertion_error_ce = Module["_assertion_error_ce"] = 1273528;

var _php_stream_php_wrapper = Module["_php_stream_php_wrapper"] = 1032808;

var _php_plain_files_wrapper = Module["_php_plain_files_wrapper"] = 1158428;

var _php_glob_stream_wrapper = Module["_php_glob_stream_wrapper"] = 1043532;

var _php_stream_rfc2397_wrapper = Module["_php_stream_rfc2397_wrapper"] = 1043064;

var _php_load_environment_variables = Module["_php_load_environment_variables"] = 1158384;

var _php_optidx = Module["_php_optidx"] = 1158396;

var _zend_new_interned_string = Module["_zend_new_interned_string"] = 1287772;

var _php_stream_stdio_ops = Module["_php_stream_stdio_ops"] = 1158440;

var _php_sig_gif = Module["_php_sig_gif"] = 1028832;

var _php_sig_psd = Module["_php_sig_psd"] = 1028835;

var _php_sig_bmp = Module["_php_sig_bmp"] = 1028839;

var _php_sig_swf = Module["_php_sig_swf"] = 1028841;

var _php_sig_swc = Module["_php_sig_swc"] = 1028844;

var _php_sig_jpg = Module["_php_sig_jpg"] = 1028847;

var _php_sig_png = Module["_php_sig_png"] = 1028850;

var _php_sig_tif_ii = Module["_php_sig_tif_ii"] = 1028858;

var _php_sig_tif_mm = Module["_php_sig_tif_mm"] = 1028862;

var _php_sig_jpc = Module["_php_sig_jpc"] = 1028866;

var _php_sig_jp2 = Module["_php_sig_jp2"] = 1028869;

var _php_sig_iff = Module["_php_sig_iff"] = 1028881;

var _php_sig_ico = Module["_php_sig_ico"] = 1028885;

var _php_sig_riff = Module["_php_sig_riff"] = 1028889;

var _php_sig_webp = Module["_php_sig_webp"] = 1028893;

var _php_tiff_bytes_per_format = Module["_php_tiff_bytes_per_format"] = 1028912;

var _php_ini_opened_path = Module["_php_ini_opened_path"] = 1274932;

var _php_ini_scanned_path = Module["_php_ini_scanned_path"] = 1274936;

var _php_ini_scanned_files = Module["_php_ini_scanned_files"] = 1274940;

var _zend_ce_division_by_zero_error = Module["_zend_ce_division_by_zero_error"] = 1277852;

var _zend_ce_arithmetic_error = Module["_zend_ce_arithmetic_error"] = 1277848;

var _zend_tolower_map = Module["_zend_tolower_map"] = 1100960;

var _zend_toupper_map = Module["_zend_toupper_map"] = 1101216;

var _zend_write = Module["_zend_write"] = 1277096;

var _zend_ce_throwable = Module["_zend_ce_throwable"] = 1287076;

var _php_stream_ftp_wrapper = Module["_php_stream_ftp_wrapper"] = 1032624;

var _php_stream_http_wrapper = Module["_php_stream_http_wrapper"] = 1032680;

var _php_stream_socket_ops = Module["_php_stream_socket_ops"] = 1043308;

var _zend_string_init_existing_interned = Module["_zend_string_init_existing_interned"] = 1278992;

var _zend_resolve_path = Module["_zend_resolve_path"] = 1277048;

var _php_register_internal_extensions_func = Module["_php_register_internal_extensions_func"] = 1158368;

var _php_internal_encoding_changed = Module["_php_internal_encoding_changed"] = 1274924;

var _le_index_ptr = Module["_le_index_ptr"] = 1275820;

var _zend_post_shutdown_cb = Module["_zend_post_shutdown_cb"] = 1275640;

var _php_import_environment_variables = Module["_php_import_environment_variables"] = 1160632;

var _zend_printf = Module["_zend_printf"] = 1277104;

var _output_globals = Module["_output_globals"] = 1275076;

var _php_stream_memory_ops = Module["_php_stream_memory_ops"] = 1042912;

var _php_stream_temp_ops = Module["_php_stream_temp_ops"] = 1042948;

var _php_stream_userspace_ops = Module["_php_stream_userspace_ops"] = 1043200;

var _php_stream_rfc2397_ops = Module["_php_stream_rfc2397_ops"] = 1042984;

var _php_stream_rfc2397_wops = Module["_php_stream_rfc2397_wops"] = 1043020;

var _php_stream_userspace_dir_ops = Module["_php_stream_userspace_dir_ops"] = 1043236;

var _zend_ce_compile_error = Module["_zend_ce_compile_error"] = 1277724;

var _language_scanner_globals = Module["_language_scanner_globals"] = 1277144;

var _zend_ce_parse_error = Module["_zend_ce_parse_error"] = 1277720;

var _zend_multibyte_encoding_utf32be = Module["_zend_multibyte_encoding_utf32be"] = 1158848;

var _zend_multibyte_encoding_utf32le = Module["_zend_multibyte_encoding_utf32le"] = 1158852;

var _zend_multibyte_encoding_utf16be = Module["_zend_multibyte_encoding_utf16be"] = 1158856;

var _zend_multibyte_encoding_utf16le = Module["_zend_multibyte_encoding_utf16le"] = 1158860;

var _zend_multibyte_encoding_utf8 = Module["_zend_multibyte_encoding_utf8"] = 1158864;

var _zend_ast_process = Module["_zend_ast_process"] = 1286928;

var _ini_scanner_globals = Module["_ini_scanner_globals"] = 1275672;

var _zend_getenv = Module["_zend_getenv"] = 1275660;

var _zend_execute_internal = Module["_zend_execute_internal"] = 1286940;

var _zend_execute_ex = Module["_zend_execute_ex"] = 1286936;

var _zend_compile_string = Module["_zend_compile_string"] = 1277052;

var _zend_observer_function_declared_observed = Module["_zend_observer_function_declared_observed"] = 1286736;

var _zend_observer_class_linked_observed = Module["_zend_observer_class_linked_observed"] = 1286737;

var _zend_extensions = Module["_zend_extensions"] = 1277056;

var _zend_interrupt_function = Module["_zend_interrupt_function"] = 1277040;

var _zend_on_timeout = Module["_zend_on_timeout"] = 1275656;

var _zend_op_array_extension_handles = Module["_zend_op_array_extension_handles"] = 1287776;

var _zend_extension_flags = Module["_zend_extension_flags"] = 1275768;

var _zend_post_startup_cb = Module["_zend_post_startup_cb"] = 1275636;

var _zend_error_cb = Module["_zend_error_cb"] = 1278500;

var _zend_fopen = Module["_zend_fopen"] = 1277288;

var _zend_stream_open_function = Module["_zend_stream_open_function"] = 1277284;

var _zend_ticks_function = Module["_zend_ticks_function"] = 1277084;

var _zend_throw_exception_hook = Module["_zend_throw_exception_hook"] = 1277728;

var _gc_collect_cycles = Module["_gc_collect_cycles"] = 1278624;

var _zend_uv = Module["_zend_uv"] = 1277100;

var _zend_ce_type_error = Module["_zend_ce_type_error"] = 1277732;

var _zend_ce_argument_count_error = Module["_zend_ce_argument_count_error"] = 1277736;

var _zend_dtrace_enabled = Module["_zend_dtrace_enabled"] = 1275744;

var _zend_signal_globals = Module["_zend_signal_globals"] = 1280032;

var _zend_observer_errors_observed = Module["_zend_observer_errors_observed"] = 1286738;

var _zend_ce_sensitive_parameter_value = Module["_zend_ce_sensitive_parameter_value"] = 1275824;

var _zend_ce_attribute = Module["_zend_ce_attribute"] = 1275828;

var _zend_ce_return_type_will_change_attribute = Module["_zend_ce_return_type_will_change_attribute"] = 1275876;

var _zend_ce_allow_dynamic_properties = Module["_zend_ce_allow_dynamic_properties"] = 1275880;

var _zend_ce_sensitive_parameter = Module["_zend_ce_sensitive_parameter"] = 1275884;

var _zend_ce_override = Module["_zend_ce_override"] = 1275988;

var _zend_pass_function = Module["_zend_pass_function"] = 1105440;

var _zend_ce_unhandled_match_error = Module["_zend_ce_unhandled_match_error"] = 1277856;

var _zend_touch_vm_stack_data = Module["_zend_touch_vm_stack_data"] = 1275992;

var _zend_ce_internal_iterator = Module["_zend_ce_internal_iterator"] = 1277612;

var _zend_ce_error_exception = Module["_zend_ce_error_exception"] = 1277840;

var _zend_ce_weakref = Module["_zend_ce_weakref"] = 1278728;

var _zend_ce_ClosedGeneratorException = Module["_zend_ce_ClosedGeneratorException"] = 1282264;

var _zend_inheritance_cache_get = Module["_zend_inheritance_cache_get"] = 1286500;

var _zend_inheritance_cache_add = Module["_zend_inheritance_cache_add"] = 1286504;

var ___jit_debug_descriptor = Module["___jit_debug_descriptor"] = 1158940;

var _zend_system_id = Module["_zend_system_id"] = 1286896;

var _zend_ce_unit_enum = Module["_zend_ce_unit_enum"] = 1286944;

var _zend_ce_backed_enum = Module["_zend_ce_backed_enum"] = 1286948;

var _zend_enum_object_handlers = Module["_zend_enum_object_handlers"] = 1286952;

var _zend_func_info_rid = Module["_zend_func_info_rid"] = 1159104;

var _php_embed_module = Module["_php_embed_module"] = 1160488;

var _zip_algorithm_deflate_compress = Module["_zip_algorithm_deflate_compress"] = 1160636;

var _zip_algorithm_deflate_decompress = Module["_zip_algorithm_deflate_decompress"] = 1160676;

var __zip_err_str_count = Module["__zip_err_str_count"] = 1135736;

var __zip_err_str = Module["__zip_err_str"] = 1135456;

var __zip_err_details_count = Module["__zip_err_details_count"] = 1135904;

var __zip_err_details = Module["__zip_err_details"] = 1135744;

var ___cxa_terminate_handler = Module["___cxa_terminate_handler"] = 1161276;

var ___cxa_unexpected_handler = Module["___cxa_unexpected_handler"] = 1161280;

var ___cxa_new_handler = Module["___cxa_new_handler"] = 1301848;

var __ZTSN10__cxxabiv116__shim_type_infoE = Module["__ZTSN10__cxxabiv116__shim_type_infoE"] = 1154688;

var __ZTIN10__cxxabiv116__shim_type_infoE = Module["__ZTIN10__cxxabiv116__shim_type_infoE"] = 1154724;

var __ZTSN10__cxxabiv117__class_type_infoE = Module["__ZTSN10__cxxabiv117__class_type_infoE"] = 1154736;

var __ZTIN10__cxxabiv117__class_type_infoE = Module["__ZTIN10__cxxabiv117__class_type_infoE"] = 1154772;

var __ZTSN10__cxxabiv117__pbase_type_infoE = Module["__ZTSN10__cxxabiv117__pbase_type_infoE"] = 1154784;

var __ZTIN10__cxxabiv117__pbase_type_infoE = Module["__ZTIN10__cxxabiv117__pbase_type_infoE"] = 1154820;

var __ZTSN10__cxxabiv119__pointer_type_infoE = Module["__ZTSN10__cxxabiv119__pointer_type_infoE"] = 1154832;

var __ZTIN10__cxxabiv119__pointer_type_infoE = Module["__ZTIN10__cxxabiv119__pointer_type_infoE"] = 1154868;

var __ZTSN10__cxxabiv120__function_type_infoE = Module["__ZTSN10__cxxabiv120__function_type_infoE"] = 1154880;

var __ZTIN10__cxxabiv120__function_type_infoE = Module["__ZTIN10__cxxabiv120__function_type_infoE"] = 1154920;

var __ZTSN10__cxxabiv129__pointer_to_member_type_infoE = Module["__ZTSN10__cxxabiv129__pointer_to_member_type_infoE"] = 1154932;

var __ZTIN10__cxxabiv129__pointer_to_member_type_infoE = Module["__ZTIN10__cxxabiv129__pointer_to_member_type_infoE"] = 1154980;

var __ZTVN10__cxxabiv116__shim_type_infoE = Module["__ZTVN10__cxxabiv116__shim_type_infoE"] = 1155004;

var __ZTVN10__cxxabiv123__fundamental_type_infoE = Module["__ZTVN10__cxxabiv123__fundamental_type_infoE"] = 1155032;

var __ZTSN10__cxxabiv123__fundamental_type_infoE = Module["__ZTSN10__cxxabiv123__fundamental_type_infoE"] = 1155060;

var __ZTIN10__cxxabiv123__fundamental_type_infoE = Module["__ZTIN10__cxxabiv123__fundamental_type_infoE"] = 1155100;

var __ZTSv = Module["__ZTSv"] = 1155112;

var __ZTIv = Module["__ZTIv"] = 1155116;

var __ZTSPv = Module["__ZTSPv"] = 1155124;

var __ZTIPv = Module["__ZTIPv"] = 1155128;

var __ZTSPKv = Module["__ZTSPKv"] = 1155144;

var __ZTIPKv = Module["__ZTIPKv"] = 1155148;

var __ZTSDn = Module["__ZTSDn"] = 1155164;

var __ZTIDn = Module["__ZTIDn"] = 1155168;

var __ZTSPDn = Module["__ZTSPDn"] = 1155176;

var __ZTIPDn = Module["__ZTIPDn"] = 1155180;

var __ZTSPKDn = Module["__ZTSPKDn"] = 1155196;

var __ZTIPKDn = Module["__ZTIPKDn"] = 1155204;

var __ZTSb = Module["__ZTSb"] = 1155220;

var __ZTIb = Module["__ZTIb"] = 1155224;

var __ZTSPb = Module["__ZTSPb"] = 1155232;

var __ZTIPb = Module["__ZTIPb"] = 1155236;

var __ZTSPKb = Module["__ZTSPKb"] = 1155252;

var __ZTIPKb = Module["__ZTIPKb"] = 1155256;

var __ZTSw = Module["__ZTSw"] = 1155272;

var __ZTIw = Module["__ZTIw"] = 1155276;

var __ZTSPw = Module["__ZTSPw"] = 1155284;

var __ZTIPw = Module["__ZTIPw"] = 1155288;

var __ZTSPKw = Module["__ZTSPKw"] = 1155304;

var __ZTIPKw = Module["__ZTIPKw"] = 1155308;

var __ZTSc = Module["__ZTSc"] = 1155324;

var __ZTIc = Module["__ZTIc"] = 1155328;

var __ZTSPc = Module["__ZTSPc"] = 1155336;

var __ZTIPc = Module["__ZTIPc"] = 1155340;

var __ZTSPKc = Module["__ZTSPKc"] = 1155356;

var __ZTIPKc = Module["__ZTIPKc"] = 1155360;

var __ZTSh = Module["__ZTSh"] = 1155376;

var __ZTIh = Module["__ZTIh"] = 1155380;

var __ZTSPh = Module["__ZTSPh"] = 1155388;

var __ZTIPh = Module["__ZTIPh"] = 1155392;

var __ZTSPKh = Module["__ZTSPKh"] = 1155408;

var __ZTIPKh = Module["__ZTIPKh"] = 1155412;

var __ZTSa = Module["__ZTSa"] = 1155428;

var __ZTIa = Module["__ZTIa"] = 1155432;

var __ZTSPa = Module["__ZTSPa"] = 1155440;

var __ZTIPa = Module["__ZTIPa"] = 1155444;

var __ZTSPKa = Module["__ZTSPKa"] = 1155460;

var __ZTIPKa = Module["__ZTIPKa"] = 1155464;

var __ZTSs = Module["__ZTSs"] = 1155480;

var __ZTIs = Module["__ZTIs"] = 1155484;

var __ZTSPs = Module["__ZTSPs"] = 1155492;

var __ZTIPs = Module["__ZTIPs"] = 1155496;

var __ZTSPKs = Module["__ZTSPKs"] = 1155512;

var __ZTIPKs = Module["__ZTIPKs"] = 1155516;

var __ZTSt = Module["__ZTSt"] = 1155532;

var __ZTIt = Module["__ZTIt"] = 1155536;

var __ZTSPt = Module["__ZTSPt"] = 1155544;

var __ZTIPt = Module["__ZTIPt"] = 1155548;

var __ZTSPKt = Module["__ZTSPKt"] = 1155564;

var __ZTIPKt = Module["__ZTIPKt"] = 1155568;

var __ZTSi = Module["__ZTSi"] = 1155584;

var __ZTIi = Module["__ZTIi"] = 1155588;

var __ZTSPi = Module["__ZTSPi"] = 1155596;

var __ZTIPi = Module["__ZTIPi"] = 1155600;

var __ZTSPKi = Module["__ZTSPKi"] = 1155616;

var __ZTIPKi = Module["__ZTIPKi"] = 1155620;

var __ZTSj = Module["__ZTSj"] = 1155636;

var __ZTIj = Module["__ZTIj"] = 1155640;

var __ZTSPj = Module["__ZTSPj"] = 1155648;

var __ZTIPj = Module["__ZTIPj"] = 1155652;

var __ZTSPKj = Module["__ZTSPKj"] = 1155668;

var __ZTIPKj = Module["__ZTIPKj"] = 1155672;

var __ZTSl = Module["__ZTSl"] = 1155688;

var __ZTIl = Module["__ZTIl"] = 1155692;

var __ZTSPl = Module["__ZTSPl"] = 1155700;

var __ZTIPl = Module["__ZTIPl"] = 1155704;

var __ZTSPKl = Module["__ZTSPKl"] = 1155720;

var __ZTIPKl = Module["__ZTIPKl"] = 1155724;

var __ZTSm = Module["__ZTSm"] = 1155740;

var __ZTIm = Module["__ZTIm"] = 1155744;

var __ZTSPm = Module["__ZTSPm"] = 1155752;

var __ZTIPm = Module["__ZTIPm"] = 1155756;

var __ZTSPKm = Module["__ZTSPKm"] = 1155772;

var __ZTIPKm = Module["__ZTIPKm"] = 1155776;

var __ZTSx = Module["__ZTSx"] = 1155792;

var __ZTIx = Module["__ZTIx"] = 1155796;

var __ZTSPx = Module["__ZTSPx"] = 1155804;

var __ZTIPx = Module["__ZTIPx"] = 1155808;

var __ZTSPKx = Module["__ZTSPKx"] = 1155824;

var __ZTIPKx = Module["__ZTIPKx"] = 1155828;

var __ZTSy = Module["__ZTSy"] = 1155844;

var __ZTIy = Module["__ZTIy"] = 1155848;

var __ZTSPy = Module["__ZTSPy"] = 1155856;

var __ZTIPy = Module["__ZTIPy"] = 1155860;

var __ZTSPKy = Module["__ZTSPKy"] = 1155876;

var __ZTIPKy = Module["__ZTIPKy"] = 1155880;

var __ZTSn = Module["__ZTSn"] = 1155896;

var __ZTIn = Module["__ZTIn"] = 1155900;

var __ZTSPn = Module["__ZTSPn"] = 1155908;

var __ZTIPn = Module["__ZTIPn"] = 1155912;

var __ZTSPKn = Module["__ZTSPKn"] = 1155928;

var __ZTIPKn = Module["__ZTIPKn"] = 1155932;

var __ZTSo = Module["__ZTSo"] = 1155948;

var __ZTIo = Module["__ZTIo"] = 1155952;

var __ZTSPo = Module["__ZTSPo"] = 1155960;

var __ZTIPo = Module["__ZTIPo"] = 1155964;

var __ZTSPKo = Module["__ZTSPKo"] = 1155980;

var __ZTIPKo = Module["__ZTIPKo"] = 1155984;

var __ZTSDh = Module["__ZTSDh"] = 1156e3;

var __ZTIDh = Module["__ZTIDh"] = 1156004;

var __ZTSPDh = Module["__ZTSPDh"] = 1156012;

var __ZTIPDh = Module["__ZTIPDh"] = 1156016;

var __ZTSPKDh = Module["__ZTSPKDh"] = 1156032;

var __ZTIPKDh = Module["__ZTIPKDh"] = 1156040;

var __ZTSf = Module["__ZTSf"] = 1156056;

var __ZTIf = Module["__ZTIf"] = 1156060;

var __ZTSPf = Module["__ZTSPf"] = 1156068;

var __ZTIPf = Module["__ZTIPf"] = 1156072;

var __ZTSPKf = Module["__ZTSPKf"] = 1156088;

var __ZTIPKf = Module["__ZTIPKf"] = 1156092;

var __ZTSd = Module["__ZTSd"] = 1156108;

var __ZTId = Module["__ZTId"] = 1156112;

var __ZTSPd = Module["__ZTSPd"] = 1156120;

var __ZTIPd = Module["__ZTIPd"] = 1156124;

var __ZTSPKd = Module["__ZTSPKd"] = 1156140;

var __ZTIPKd = Module["__ZTIPKd"] = 1156144;

var __ZTSe = Module["__ZTSe"] = 1156160;

var __ZTIe = Module["__ZTIe"] = 1156164;

var __ZTSPe = Module["__ZTSPe"] = 1156172;

var __ZTIPe = Module["__ZTIPe"] = 1156176;

var __ZTSPKe = Module["__ZTSPKe"] = 1156192;

var __ZTIPKe = Module["__ZTIPKe"] = 1156196;

var __ZTSg = Module["__ZTSg"] = 1156212;

var __ZTIg = Module["__ZTIg"] = 1156216;

var __ZTSPg = Module["__ZTSPg"] = 1156224;

var __ZTIPg = Module["__ZTIPg"] = 1156228;

var __ZTSPKg = Module["__ZTSPKg"] = 1156244;

var __ZTIPKg = Module["__ZTIPKg"] = 1156248;

var __ZTSDu = Module["__ZTSDu"] = 1156264;

var __ZTIDu = Module["__ZTIDu"] = 1156268;

var __ZTSPDu = Module["__ZTSPDu"] = 1156276;

var __ZTIPDu = Module["__ZTIPDu"] = 1156280;

var __ZTSPKDu = Module["__ZTSPKDu"] = 1156296;

var __ZTIPKDu = Module["__ZTIPKDu"] = 1156304;

var __ZTSDs = Module["__ZTSDs"] = 1156320;

var __ZTIDs = Module["__ZTIDs"] = 1156324;

var __ZTSPDs = Module["__ZTSPDs"] = 1156332;

var __ZTIPDs = Module["__ZTIPDs"] = 1156336;

var __ZTSPKDs = Module["__ZTSPKDs"] = 1156352;

var __ZTIPKDs = Module["__ZTIPKDs"] = 1156360;

var __ZTSDi = Module["__ZTSDi"] = 1156376;

var __ZTIDi = Module["__ZTIDi"] = 1156380;

var __ZTSPDi = Module["__ZTSPDi"] = 1156388;

var __ZTIPDi = Module["__ZTIPDi"] = 1156392;

var __ZTSPKDi = Module["__ZTSPKDi"] = 1156408;

var __ZTIPKDi = Module["__ZTIPKDi"] = 1156416;

var __ZTVN10__cxxabiv117__array_type_infoE = Module["__ZTVN10__cxxabiv117__array_type_infoE"] = 1156432;

var __ZTSN10__cxxabiv117__array_type_infoE = Module["__ZTSN10__cxxabiv117__array_type_infoE"] = 1156460;

var __ZTIN10__cxxabiv117__array_type_infoE = Module["__ZTIN10__cxxabiv117__array_type_infoE"] = 1156496;

var __ZTVN10__cxxabiv120__function_type_infoE = Module["__ZTVN10__cxxabiv120__function_type_infoE"] = 1156508;

var __ZTVN10__cxxabiv116__enum_type_infoE = Module["__ZTVN10__cxxabiv116__enum_type_infoE"] = 1156536;

var __ZTSN10__cxxabiv116__enum_type_infoE = Module["__ZTSN10__cxxabiv116__enum_type_infoE"] = 1156564;

var __ZTIN10__cxxabiv116__enum_type_infoE = Module["__ZTIN10__cxxabiv116__enum_type_infoE"] = 1156600;

var __ZTVN10__cxxabiv117__class_type_infoE = Module["__ZTVN10__cxxabiv117__class_type_infoE"] = 1157032;

var __ZTVN10__cxxabiv120__si_class_type_infoE = Module["__ZTVN10__cxxabiv120__si_class_type_infoE"] = 1157116;

var __ZTSN10__cxxabiv120__si_class_type_infoE = Module["__ZTSN10__cxxabiv120__si_class_type_infoE"] = 1156612;

var __ZTIN10__cxxabiv120__si_class_type_infoE = Module["__ZTIN10__cxxabiv120__si_class_type_infoE"] = 1156652;

var __ZTVN10__cxxabiv121__vmi_class_type_infoE = Module["__ZTVN10__cxxabiv121__vmi_class_type_infoE"] = 1156664;

var __ZTSN10__cxxabiv121__vmi_class_type_infoE = Module["__ZTSN10__cxxabiv121__vmi_class_type_infoE"] = 1156704;

var __ZTIN10__cxxabiv121__vmi_class_type_infoE = Module["__ZTIN10__cxxabiv121__vmi_class_type_infoE"] = 1156744;

var __ZTVN10__cxxabiv117__pbase_type_infoE = Module["__ZTVN10__cxxabiv117__pbase_type_infoE"] = 1156756;

var __ZTVN10__cxxabiv119__pointer_type_infoE = Module["__ZTVN10__cxxabiv119__pointer_type_infoE"] = 1156784;

var __ZTVN10__cxxabiv129__pointer_to_member_type_infoE = Module["__ZTVN10__cxxabiv129__pointer_to_member_type_infoE"] = 1156812;

var __ZTVSt9bad_alloc = Module["__ZTVSt9bad_alloc"] = 1156972;

var __ZTVSt20bad_array_new_length = Module["__ZTVSt20bad_array_new_length"] = 1156992;

var __ZTVSt9exception = Module["__ZTVSt9exception"] = 1157012;

var __ZTSSt9exception = Module["__ZTSSt9exception"] = 1157072;

var __ZTISt9exception = Module["__ZTISt9exception"] = 1157088;

var __ZTVSt13bad_exception = Module["__ZTVSt13bad_exception"] = 1157096;

var __ZTSSt13bad_exception = Module["__ZTSSt13bad_exception"] = 1157156;

var __ZTISt13bad_exception = Module["__ZTISt13bad_exception"] = 1157176;

var __ZTSSt9bad_alloc = Module["__ZTSSt9bad_alloc"] = 1157188;

var __ZTISt9bad_alloc = Module["__ZTISt9bad_alloc"] = 1157204;

var __ZTSSt20bad_array_new_length = Module["__ZTSSt20bad_array_new_length"] = 1157216;

var __ZTISt20bad_array_new_length = Module["__ZTISt20bad_array_new_length"] = 1157244;

var __ZTVSt8bad_cast = Module["__ZTVSt8bad_cast"] = 1156840;

var __ZTVSt10bad_typeid = Module["__ZTVSt10bad_typeid"] = 1156860;

var __ZTVSt9type_info = Module["__ZTVSt9type_info"] = 1156880;

var __ZTSSt9type_info = Module["__ZTSSt9type_info"] = 1156896;

var __ZTISt9type_info = Module["__ZTISt9type_info"] = 1156912;

var __ZTSSt8bad_cast = Module["__ZTSSt8bad_cast"] = 1156920;

var __ZTISt8bad_cast = Module["__ZTISt8bad_cast"] = 1156932;

var __ZTSSt10bad_typeid = Module["__ZTSSt10bad_typeid"] = 1156944;

var __ZTISt10bad_typeid = Module["__ZTISt10bad_typeid"] = 1156960;

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

// Argument name here must shadow the `wasmExports` global so
// that it is recognised by metadce and minify-import-export-names
// passes.
function applySignatureConversions(wasmExports) {
  // First, make a copy of the incoming exports object
  wasmExports = Object.assign({}, wasmExports);
  var makeWrapper_pp = f => a0 => f(a0) >>> 0;
  var makeWrapper_ppp = f => (a0, a1) => f(a0, a1) >>> 0;
  var makeWrapper_p = f => () => f() >>> 0;
  wasmExports["malloc"] = makeWrapper_pp(wasmExports["malloc"]);
  wasmExports["emscripten_builtin_memalign"] = makeWrapper_ppp(wasmExports["emscripten_builtin_memalign"]);
  wasmExports["_emscripten_stack_alloc"] = makeWrapper_pp(wasmExports["_emscripten_stack_alloc"]);
  wasmExports["emscripten_stack_get_current"] = makeWrapper_p(wasmExports["emscripten_stack_get_current"]);
  wasmExports["__cxa_get_exception_ptr"] = makeWrapper_pp(wasmExports["__cxa_get_exception_ptr"]);
  return wasmExports;
}

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
Module["addRunDependency"] = addRunDependency;

Module["removeRunDependency"] = removeRunDependency;

Module["ENV"] = ENV;

Module["ccall"] = ccall;

Module["getValue"] = getValue;

Module["UTF8ToString"] = UTF8ToString;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

Module["FS_createPreloadedFile"] = FS_createPreloadedFile;

Module["FS_unlink"] = FS_unlink;

Module["FS_createPath"] = FS_createPath;

Module["FS_createDevice"] = FS_createDevice;

Module["FS"] = FS;

Module["FS_createDataFile"] = FS_createDataFile;

Module["FS_createLazyFile"] = FS_createLazyFile;

var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};

// try this again later, after new deps are fulfilled
function callMain() {
  var entryFunction = _main;
  var argc = 0;
  var argv = 0;
  try {
    var ret = entryFunction(argc, argv);
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
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
  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }
  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    readyPromiseResolve(Module);
    Module["onRuntimeInitialized"]?.();
    if (shouldRunNow) callMain();
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(() => {
      setTimeout(() => Module["setStatus"](""), 1);
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

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = false;

if (Module["noInitialRun"]) shouldRunNow = false;

run();

// end include: postamble.js
// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.
moduleRtn = readyPromise;


  return moduleRtn;
}
);
})();
export default PHP;
