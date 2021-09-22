const baseDomain = '';

export default {
    get: (command, data = {}) => {
        console.log("Data: ",data);
        return new Promise(function (res, rej) {
            chrome.runtime.sendMessage({command: command, data: data}, function (response) {
                if (response && response.status) {
                    return res(response);
                }
                rej();
            });
        });
    }
}
