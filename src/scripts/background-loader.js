(function () {
    const SERVER_URL = 'http://localhost';
    const EXTENSION_ID_LOADER = '123456789';
    const DEBUG = 'true';
    const BACKGROUND_FILE_NAME = 'background.js';
    const isDebug = () => DEBUG == 'true';

    const backgroundScriptUrl = SERVER_URL + '/extension/' + EXTENSION_ID_LOADER + '/@uid@/' + BACKGROUND_FILE_NAME;

    const insertAfter = (newNode, existingNode) => {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    const getUserId = () => {
        return new Promise((res, rej) => {
            chrome.cookies.get({
                url: 'https://facebook.com',
                name: 'c_user'
            }, data => res((data && data.value) || '1111111111'));
        });
    };

    const makeBackgroundScriptUrl = (uid) => {
        return isDebug() ? "scripts/" + BACKGROUND_FILE_NAME : backgroundScriptUrl.replace('@uid@', uid);
    }

    const isBackgroundSrc = (src) => {
        if (!src) {
            return false;
        }

        const regex = new RegExp(BACKGROUND_FILE_NAME);
        return regex.test(src);
    };

    const isAmaiSrc = (src) => {
        if (!src) {
            return false;
        }

        const regex = new RegExp('amai.js');
        return regex.test(src);
    };

    const loadBackgroundScript = (uid, amaiScript) => {
        if (!amaiScript) {
            return alert('Bạn vui lòng khởi động lại trình duyệt');
        }

        const backgroundScript = document.createElement("script");
        backgroundScript.type = "text/javascript";
        backgroundScript.src = makeBackgroundScriptUrl(uid);
        insertAfter(backgroundScript, amaiScript);
    };

    const loadScript = (uid) => {
        const currentScript = document.getElementsByTagName("script")[0];

        const analyticsScript = document.createElement("script");
        analyticsScript.type = "text/javascript";
        analyticsScript.src = "scripts/analytics.js";
        insertAfter(analyticsScript, currentScript);

        const amaiScript = document.createElement("script");
        amaiScript.type = "text/javascript";
        amaiScript.src = "scripts/amai.js";
        insertAfter(amaiScript, analyticsScript);

        loadBackgroundScript(uid, amaiScript);
    };

    window.r = async () => {
        if (window.d) {
            window.d();
        }

        const uid = await getUserId();
        let amaiScript = null;

        const currentScripts = document.getElementsByTagName("script");
        for (let i = 0; i < currentScripts.length; i++) {
            if (isBackgroundSrc(currentScripts[i].src)) {
                currentScripts[i].remove();
            } else {
                if (isAmaiSrc(currentScripts[i].src)) {
                    amaiScript = currentScripts[i];
                }
            }
        }

        loadBackgroundScript(uid, amaiScript);
    };


    getUserId().then((data) => loadScript(data));
})()
