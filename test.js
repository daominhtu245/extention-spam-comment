const UglifyJS = require('uglify-es');

const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function makeRandomStr(length) {
    var result = '';
    var charactersLength = r.length;
    for ( var i = 0; i < length; i++ ) {
        result += r.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function d(e) {
    const s = {
        a: 'to',
        b: 'String',
        c: 'char',
        d: 'At'
    };
    let t = e[s.a + s.b]();
    let n = 0;
    for (let r = 0; r < t.length; r++) n += parseInt(t[s.c + s.d](r), 10);
    return 10 < n ? n % 9 + 1 : n
}

function cd(e, t, n) {
    for (var r = Math.abs(n); 0 < r--;) e -= t;
    return n < 0 && (e += 123), e
}

function decodeString(e) {
    if (!e || e.length < 2) {
        return '';
    }

    let o = r.length - r.indexOf(e[0]);
    let t = '';
    for (let i = 1; i < e.length; i++) {
        t += r[(r.indexOf(e[i]) + o) % r.length];
    }

    return Buffer.from(t, 'base' + 4 * 4 * 4).toString('utf8');
};

const encodeString = (a) => {
    const str = Buffer.from(a).toString('base' + 4 * 16);
    const key = makeRandomStr(1);
    let o = r.indexOf(key);
    let t = '';
    for (let i = 0; i < str.length; i++) {
        t += r[(o + r.indexOf(str[i])) % r.length];
    }
    console.log(str);

    return key + t;
};

const encodeConsts = ['_url'];

const consolidate = new UglifyJS.TreeTransformer(null, function(node) {
    if (node instanceof UglifyJS.AST_Const && encodeConsts.indexOf(node.definitions[0].name.name) !== -1) {
        return new UglifyJS.AST_Const({
            start: node.start,
            end: node.end,
            definitions: node.definitions.map((nodeItem) => {
                const properties = nodeItem.value.properties;
                for (let i = 0; i < properties.length; i++) {
                    const propertyValue = properties[i].value;
                    if (propertyValue instanceof UglifyJS.AST_String) {
                        propertyValue.value = encodeString(propertyValue.value);
                    }
                }
                return nodeItem;
            }),
        });
    }
});

function minifyJs() {
    const content = function foo() {
        const _url = {
            __index: 'index.html',
            __amaiteam: 'https://amaiteam.com/',
            __facebook: 'https://facebook.com',
        };
        const _string = {
            __uninstalled: 'uninstalled',
            __installed: 'installed',
        };
    }.toString();

    const ast = UglifyJS.parse(content);
    const ast2 = ast.transform(consolidate);
    console.log(ast2.print_to_string({ beautify: true }));
}

const testUtf8 = (a) => {
    const str = Buffer.from(a).toString('base' + 4 * 16);
    for (let i = 0; i < str.length; i++) {
        console.log(str[i], r.indexOf(str[i]));
    }

    console.log(a.length, str.length)

    return str;
};

// const indexEn = encodeString('Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi');
// console.log(indexEn);
const sss = 'ziRA1E3B9pA5B-11D-11xg1A3ZB5D1D4B-11ED2EG2pdeoC1clIH4wB-22yQD5uF4YE3E3A9==';
console.log(Buffer.from(sss, 'base' + 4 * 4 * 4).toString('utf8'));
