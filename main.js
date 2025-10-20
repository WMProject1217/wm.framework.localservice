/*
* Copyright(c) A.K.A Vociferationem Local Service Framework
* WMProject1217 Studios 2025
* FileName: main.js
* FileVersion: 0.1.0
* Author: WMProject1217
* LatestCommit: 2025-9-30
*
* PRO MANE QUOD VENTVRVM EST!
*/

let _genesis_ = {};
_genesis_.lib = {};
_genesis_.lib.service = {
    async Load(url) {
        try {
            _genesis_.tmp.servicedx = await import(url);
            if (this.Validate(_genesis_.tmp.servicedx)) {
                if (typeof _genesis_.service.get(_genesis_.tmp.servicedx.id) != "undefined") {
                    delete _genesis_.tmp.servicedx;
                    console.warn(`[lib.service]服务 ${url} (${_genesis_.tmp.servicedx.id}) 已被加载过。`);
                    return _genesis_.tmp.servicedx.id;
                }
                if (typeof _genesis_.tmp.servicedx._init_ === 'function') { _genesis_.tmp.servicedx._init_(_genesis_); }

                _genesis_.service.set(_genesis_.tmp.servicedx.id, _genesis_.tmp.servicedx);
                console.log(`[lib.service]服务 ${url} (${_genesis_.tmp.servicedx.id}) 已加载。`);
                return _genesis_.tmp.servicedx.id;
            } else {
                console.error(`[lib.service]服务 ${url} 不合法。`);
                return null;
            }
        } catch (error) {
            console.error(`[lib.service]无法加载 ${url} 上的服务: `, error);
            return null;
        }
    },
    async Unload(serviceId) {
        if (_genesis_.service.has(serviceId)) {
            _genesis_.tmp.servicedx = _genesis_.service.get(serviceId);

            if (typeof _genesis_.tmp.servicedx._unload_ === 'function') { await _genesis_.tmp.servicedx._unload_(); }

            _genesis_.service.delete(serviceId);
            console.log(`[lib.service]服务 ${serviceId} 已成功卸载。`);
            return 0;
        } else {
            console.error(`[lib.service]找不到服务 ${serviceId}。`);
            return 1;
        }
    },
    Validate(servicedx) {
        return servicedx && 
            typeof servicedx._unload_ === 'function' &&
            typeof servicedx._init_ === 'function' &&
            typeof servicedx.id === 'string' &&
            typeof servicedx.name === 'string' &&
            typeof servicedx.version === 'string' &&
            typeof servicedx.description === 'string';
    },
    GetList() {
        return Array.from(_genesis_.service.keys());
    },
    RegisterPathConflictChecker(newPath) {
        let normalizedNewPath = newPath.endsWith('/') ? newPath : newPath + '/';
        let registeredPath = "";
        let normalizedRegisteredPath = "";
        
        // 检查所有已注册路径
        for (registeredPath of _genesis_.servicePathRegistrations.keys()) {
            normalizedRegisteredPath = registeredPath.endsWith('/') ? registeredPath : registeredPath + '/';
            
            // 情况1: 新路径是已注册路径的前缀（新路径覆盖已注册路径）
            // 例如: 已注册 "/path/subdom"，新路径是 "/path"
            if (normalizedNewPath.length < normalizedRegisteredPath.length && normalizedRegisteredPath.startsWith(normalizedNewPath)) { return true; }
            
            // 情况2: 已注册路径是新路径的前缀（已注册路径覆盖新路径）
            // 例如: 已注册 "/path"，新路径是 "/path/subdom"
            if (normalizedRegisteredPath.length < normalizedNewPath.length && normalizedNewPath.startsWith(normalizedRegisteredPath)) { return true; }
            
            // 情况3: 路径完全相同（完全重叠）
            // 例如: 已注册 "/path"，新路径是 "/path/"
            if (normalizedNewPath === normalizedRegisteredPath) { return true; }
        }
        return false;
    },
    RegisterPath(path, serviceId, overwrite = false) {
        if (_genesis_.servicePathRegistrations.has(path)) { if (overwrite == false) { return 1; } }
        if (this.RegisterPathConflictChecker(path) == true) { if (overwrite == false) { return 1; } }
        _genesis_.servicePathRegistrations.set(path, serviceId);
        return 0;
    }
};
_genesis_.service = new Map();
_genesis_.servicePathRegistrations = new Map();
_genesis_.lib.node = {};
_genesis_.lib.node.nm_fs = require("fs");
_genesis_.lib.node.nm_path = {
    format(path) {
        return path.replaceAll("\\", "/").replaceAll("//", "/");
    },
    join(...paths) {
        const parts = paths.filter(Boolean).join('/').split('/');
        const result = [];
        
        for (const part of parts) {
            if (part === '..') {
                result.pop();
            } else if (part !== '.' && part !== '') {
                result.push(part);
            }
        }
        
        return result.join('/').replace(/^\//, '');
    },
    extname(filename) {
        const lastDot = filename.lastIndexOf('.');
        const lastSlash = Math.max(
            filename.lastIndexOf('/'),
            filename.lastIndexOf('\\')
        );
        
        return lastDot > lastSlash && lastDot !== -1 
            ? filename.slice(lastDot) 
            : '';
    }
}
_genesis_.lib.node.nm_http = require("http");
_genesis_.tmp = {};

// 要给小可爱们一些惊喜哦♪
/*private static final String[] */ const PlayerJoin_TipTextList = [
    "Ciallo～(∠・ω< )⌒★", 

    // HK3RD
    "把这个不完美的世界，变成你所期望的样子！",
    "姬子温柔的看着你，不再言语",
    "嗨♪想我了吗~", 
    "芽衣姐....我....不想死......", 
    "鸟，为什么会飞？",
    "比起这个世界，你更重要！",
    "再见了，我的理解者",
    "我守住了，身为姐姐的骄傲",
    "这就是......最后一课了......",
    "现在，我终于可以骄傲的对他们说，大家，久等了",
    "再见了，我的大发明家",
    "师傅，立雪只能陪您到这儿了",
    "科斯魔很怕孤单，我只是不想让他在梦里也是一个人",
    "这就是......律者的宿命吗？",

    // GI
    "让世界，彻底遗忘我",
    "再见，那维莱特，希望你喜欢这五百年来的戏份",
    "蛋，糖，杏仁，大小姐要自己带了",
    "我果然......没在被神明注视着啊",

    // HKSR
    "敬，不完美的明天",
    "再见，卡卡瓦夏......",
    "魔↗术↘技巧",
    "明天见，是世上最伟大的预言",
    "阿雅...你能听到吗？再和我...说句话吧......求你了......", 

    // WMFX
    "明天，终将到来", 
    "不可以，绝对不可以在这里结束！",
    "我在呢，一直都在"
];

const PlayerJoinTipText = PlayerJoin_TipTextList[parseInt(Math.random() * (PlayerJoin_TipTextList.length - 1))];;
console.log(`/*
* Copyright(c) A.K.A Vociferationem Local Service Framework
* WMProject1217 Studios 2025
*
* PRO MANE QUOD VENTVRVM EST!
*/

` + PlayerJoinTipText + "\n");

let HTTPServerProcess_url = "";
let HTTPServerProcess_serviceid = "";
let HTTPServerProcess_serviceobj = null;

_genesis_.lib.node.nm_http.createServer((req, res) => {
    console.log(req.url)
    HTTPServerProcess_url = req.url;
    for (registeredPath of _genesis_.servicePathRegistrations.keys()) {
        if (HTTPServerProcess_url.startsWith(registeredPath)) {
            HTTPServerProcess_serviceid = _genesis_.servicePathRegistrations.get(registeredPath);
            HTTPServerProcess_serviceobj = _genesis_.service.get(HTTPServerProcess_serviceid);
            if (typeof HTTPServerProcess_serviceobj.OnRequest == "function") {
                HTTPServerProcess_serviceobj.OnRequest(req, res);
                return;
            } else {
                console.log("错误: 注册路径的服务 " + HTTPServerProcess_serviceid + " 上的请求处理函数 OnRequest 类型不为 function");
            }
        }
    }
    res.end('Ciallo, World!');
    return;
}).listen(12400, "127.0.0.1");

console.log("Internal Server started on 127.0.0.1:12400");

if (_genesis_.lib.node.nm_fs.existsSync('./plugins')) {
    _genesis_.lib.node.nm_fs.readdirSync('./plugins').forEach(item => {
        let itemPath = "./" + _genesis_.lib.node.nm_path.join('plugins', item);
        let stat = _genesis_.lib.node.nm_fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            let mainJs = "./" + _genesis_.lib.node.nm_path.join(itemPath, 'main.mjs');
            if (_genesis_.lib.node.nm_fs.existsSync(mainJs)) { _genesis_.lib.service.Load(mainJs); }
        } else if (stat.isFile() && _genesis_.lib.node.nm_path.extname(item) === '.mjs') {
            _genesis_.lib.service.Load(itemPath);
        }
    });
}
