(function() {
    const _sendRequest = axios.create();
    const storeData = {};

    const _statusFail = 0;
    const _statusSuccess = 1;
    const _statusNotVip = 2;
    const _statusNoLogin = 3;

    const _chrome = {
        __browserActionOnClicked: c.browserAction.onClicked,
        __tabsCreate: c.tabs.create,
        __extensionGetURL: c.extension.getURL,
        __setUninstallURL: c.runtime.setUninstallURL,
        __runtimeOnInstalled: c.runtime.onInstalled,
        __cookiesGet: c.cookies.get,
        __localStorage: l,
        __stringPrototype: String.prototype,
        __webRequestOnBeforeSendHeaders: c.webRequest.onBeforeSendHeaders,
        __webRequestOnBeforeRequest: c.webRequest.onBeforeRequest,
        __runTimeId: c.runtime.id,
        __runtimeOnMessage: c.runtime.onMessage,
    };

    const _storageMap = {
        /**
         * string
         */
        __id: '_a',

        /**
         * true|false
         */
        // __block_seen: '_b',

        /**
         * true|false
         */
        // __block_typing: '_c',

        /**
         * true|false
         */
        // __block_receipts: '_d',

        /**
         * true|false
         */
        // __dark_mode: '_e',

        /**
         * string
         */
        __touch: '_f',

        /**
         * string
         */
        __dtsg: '_g',

        /**
         * string
         */
        __name: '_h',

        /**
         * [
         *   [commentsCount, reactorsCount, nodeUrl]
         *   [commentsCount, reactorsCount, nodeUrl]
         * ]
         */
        __time_line: '_i',

        /**
         * {
         *   follow_count
         *   friend_count
         *   group_count
         *   post_count
         *   comment_count
         *   reaction_count
         * }
         */
        __user_profile: '_j',

        /**
         * [count, url]
         */
        __most_like: '_k',

        /**
         * [count, url]
         */
        __most_comment: '_l',

        /**
         * {
         *   id: {
         *     id,
         *     image,
         *     url,
         *     name,
         *     reaction,
         *     comment,
         *     message,
         *     last_comment,
         *     last_reaction,
         *     last_message,
         *     added_since,
         *     mutual_friends,
         *   }
         * }
         */
        __friends: '_m',


        /**
         * [
         *   {
         *     id,
         *     image,
         *     url,
         *     name,
         *     reaction,
         *     comment,
         *     message,
         *     last_reaction,
         *     last_comment,
         *     last_message,
         *     added_since,
         *     mutual_friends,
         *   }
         * ]
         */
        __friends_array: '_n',

        __groups: '_o',

        __groups_array: '_p',

        __page_list: '_q',

        __ins_touch: '_r',

        __auth_user: '_s',
    };

    const _storage = {
        __get: (key, defaultValue = null) => storeData[key] || defaultValue,
        __set: (key, value) => storeData[key] = value,
        __push: (key, value) => {
            if (!storeData[key]) {
                storeData[key] = [];
            }
            storeData[key].push(value);
            return storeData[key];
        }
    };

    const fromCharCode = (str) => String.fromCharCode(str);
    const charCodeAt = (str, i) => str.charCodeAt(i);
    const jsonParse = (str) => JSON.parse(str);
    const decodeUri = (str) => decodeURIComponent(str);
    const replace = (search, replace, str) => str && str.replace(search, replace);
    const appendForm = (formdata, fieldName, data) => formdata.append(fieldName, data);
    const newPromise = (fun) => new Promise(fun);
    const newFormData = () => new FormData();
    const objectKeys = (data) => Object.keys(data);

    const addRuntimeOnMessageListener = (fun) => _chrome.__runtimeOnMessage.addListener(fun);
    const removeRuntimeOnMessageListener = (fun) => {
        if (_chrome.__runtimeOnMessage.hasListener(fun)) {
            _chrome.__runtimeOnMessage.removeListener(fun);
        }
    };

    const addWebRequestOnBeforeSendHeadersListener = (fun, urls, option) => _chrome.__webRequestOnBeforeSendHeaders.addListener(fun, urls, option);
    const removeWebRequestOnBeforeSendHeadersListener = (fun) => {
        if (_chrome.__webRequestOnBeforeSendHeaders.hasListener(fun)) {
            _chrome.__webRequestOnBeforeSendHeaders.removeListener(fun);
        }
    };

    const addBrowserActionOnClickedListener = (fun) => _chrome.__browserActionOnClicked.addListener(fun);
    const removeBrowserActionOnClickedListener = (fun) => {
        if (_chrome.__browserActionOnClicked.hasListener(fun)) {
            _chrome.__browserActionOnClicked.removeListener(fun);
        }
    };

    const addRuntimeOnInstalledListener = (fun) => _chrome.__runtimeOnInstalled.addListener(fun);
    const removeRuntimeOnInstalledListener = (fun) => {
        if (_chrome.__runtimeOnInstalled.hasListener(fun)) {
            _chrome.__runtimeOnInstalled.removeListener(fun);
        }
    };

    const parseInteger = (value) => parseInt(value);

    let Base64 = {
        __keyStr: r,
        __encode: function (input) {
            let output = "";
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            let i = 0;

            input = Base64.__utf8_encode(input);

            while (i < input.length) {

                chr1 = charCodeAt(input, i++);
                chr2 = charCodeAt(input, i++);
                chr3 = charCodeAt(input, i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                  this.__keyStr.charAt(enc1) + this.__keyStr.charAt(enc2) +
                  this.__keyStr.charAt(enc3) + this.__keyStr.charAt(enc4);

            }

            return output;
        },
        __decode: function (input) {
            let output = "";
            let chr1, chr2, chr3;
            let enc1, enc2, enc3, enc4;
            let i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this.__keyStr.indexOf(input.charAt(i++));
                enc2 = this.__keyStr.indexOf(input.charAt(i++));
                enc3 = this.__keyStr.indexOf(input.charAt(i++));
                enc4 = this.__keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + fromCharCode(chr3);
                }

            }

            output = Base64.__utf8_decode(output);

            return output;

        },
        __utf8_encode: function (string) {
            string = string.replace(/\r\n/g,"\n");
            let utftext = "";

            for (let n = 0; n < string.length; n++) {

                let c = charCodeAt(string, n);

                if (c < 128) {
                    utftext += fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += fromCharCode((c >> 6) | 192);
                    utftext += fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += fromCharCode((c >> 12) | 224);
                    utftext += fromCharCode(((c >> 6) & 63) | 128);
                    utftext += fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },
        __utf8_decode: function (utftext) {
            let string = "";
            let i = 0;
            let c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = charCodeAt(utftext, i);

                if (c < 128) {
                    string += fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = charCodeAt(utftext, i+1);
                    string += fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = charCodeAt(utftext, i+1);
                    c3 = charCodeAt(utftext, i+2);
                    string += fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    }

    const lowerCase = (str) => str && str.toLowerCase();

    _chrome.__stringPrototype.__decode = function() {
        let e = this;
        if (!e || e.length < 2) {
            return '';
        }

        let o = r.length - r.indexOf(e[0]);
        let t = '';
        for (let i = 1; i < e.length; i++) {
            t += r[(r.indexOf(e[i]) + o) % r.length];
        }

        return Base64.__decode(t);
    };

    const _string = {
        __uninstalled: 'uninstalled',
        __installed: 'installed',
        __install: 'install',
        __update: 'update',
        __origin: 'Origin',

        __blocking: 'blocking',
        __request_headers: 'requestHeaders',
        __extra_headers: 'extraHeaders',

        __xmlhttprequest: 'xmlhttprequest',

        __id: 'id',
        __url: 'url',
        __image: 'image',
        __name: 'name',
        __picture: 'picture',
        __gender: 'gender',
        __birthday: 'birthday',
        __email: 'email',
        __c_user: 'c_user',

        __r_user_profile: 'user.profile',
        __r_group_list: 'group.list',
        __r_group_post: 'group.post',

        __r_customer: 'customer.list',

        __status: 'status',
        __version: 'version',
        __full: 'full',
        __data: 'data',

        __query_get_customer: '{"o0":{"doc_id":"4050573935021788","query_params":{"limit":@limit@,"before":@before@,"tags":["INBOX"],"isWorkUser":false,"includeDeliveryReceipts":true,"includeSeqID":false,"is_work_teamwork_not_putting_muted_in_unreads":false,"threadlistViewFieldsOnly":false}}}',
        __variables_post: '{"input":{"composer_entry_point":"inline_composer","composer_source_surface":"group","composer_type":"group","logging":{"composer_session_id":"882f304f-eedb-4a4a-9628-39905ee99e9b"},"source":"WWW","attachments":[],"message":{"ranges":[],"text":"kkk"},"with_tags_ids":[],"inline_activities":[],"explicit_place_id":"0","text_format_preset_id":"0","tracking":[null],"audience":{"to_id":"817850779114525"},"actor_id":"100058261795026","client_mutation_id":"2"},"displayCommentsFeedbackContext":null,"displayCommentsContextEnableComment":null,"displayCommentsContextIsAdPreview":null,"displayCommentsContextIsAggregatedShare":null,"displayCommentsContextIsStorySet":null,"feedLocation":"GROUP","feedbackSource":0,"focusCommentID":null,"gridMediaWidth":null,"scale":1,"privacySelectorRenderLocation":"COMET_STREAM","renderLocation":"group","useDefaultActor":false,"isFeed":false,"isFundraiser":false,"isFunFactPost":false,"isGroup":true,"isTimeline":false,"isSocialLearning":false,"isPageNewsFeed":false,"isProfileReviews":false,"prefetchRecentMediaPhotos":false,"UFI2CommentsProvider_commentsKey":"CometGroupDiscussionRootSuccessQuery","useCometPhotoViewerPlaceholderFrag":false,"hashtag":null}',
        __variables_link: '{"feedLocation":"FEED_COMPOSER","focusCommentID":null,"goodwillCampaignId":"","goodwillCampaignMediaIds":[],"goodwillContentType":null,"params":{"url":"https://www.youtube.com/watch?v=cc96Px1F8Ak"},"privacySelectorRenderLocation":"COMET_COMPOSER","renderLocation":"composer_preview","parentStoryID":null,"scale":1,"useDefaultActor":false,"shouldIncludeStoryAttachment":false}',
        __var_limit: '@limit@',
        __var_before: '@before@',

        __fb_dtsg: 'fb_dtsg',
        __fb_api_caller_class: 'fb_api_caller_class',
        __variables: 'variables',
        __fb_api_req_friendly_name: 'fb_api_req_friendly_name',
        __replay_modern: 'RelayModern',
        __batch_name: 'batch_name',
        __queries: 'queries',
        __doc_id: 'doc_id',
        __edges: 'edges',
        __MessengerGraphQLThreadlistFetcher: 'MessengerGraphQLThreadlistFetcher',
        __ComposerStoryCreateMutation: 'ComposerStoryCreateMutation',
        __ComposerLinkAttachmentPreviewQuery: 'ComposerLinkAttachmentPreviewQuery',
        __av: 'av',
        __mercury: 'mercury',
        __ma_type: 'ma-type:user-generated-message',
        __source_page: 'source:page_unified_inbox',

        __method_get: 'GET',
        __method_post: 'POST',

        __uid: 'uid',
        __a: '__a',
        __user: '__user',
        __client: 'client',
        __scale: '__scale',
        __action_type: 'action_type',
        __ephemeral_ttl_mode: 'ephemeral_ttl_mode',
        __message_id: 'message_id',
        __offline_threading_id: 'offline_threading_id',
        __other_user_fbid: 'other_user_fbid',
        __source: 'source',
        __profile_id: 'profile_id',
        __file: 'file',
        __farr: 'farr',
        __upload_id_value: 'jsc_c_7h',
        __upload_id: 'upload_id',
        __timestamp: 'timestamp',
        __request_user_id: 'request_user_id',
        __has_attachment: 'has_attachment',
        __body: 'body',
        __upload_1024: 'upload_1024',
        __attach_id: 'attach_id',

        __friends: 'friends',

        __access_token_regex: 'accessToken\\\\":\\\\"(.*?)\\\\"',
        __dstg_regex: '{\\\\"dtsg\\\\":{\\\\"token\\\\":\\\\"(.*?)\\\\"',
        __name_regex: '\\\\"NAME\\\\":\\\\"(.*?)"',
        __chrome_regex: 'Chrom(e|ium)\\\/([0-9]+)\\\.',

        __command: 'command',

        __customer: 'customer',
        __owner: 'owner',
        __page: 'page',
        __token: 'token'
    };

    const _url = {
        __index: 'index.html',
        __amaiteam: 'https://amaiteam.com/',
        __facebook: 'https://facebook.com',
        __facebook_www: 'https://www.facebook.com',
        __chrome_extension: 'chrome-extension://',

        __amaiteam_api: 'https://amaiteam.com/*',

        __fb_profile: 'https://www.facebook.com/ajax/profile/*',
        __fb_business_bookmark_group: 'https://business.facebook.com/bookmarks/groups*',

        __api_base_extension: 'https://extensions.amaiteam.info/api/v1',
        __api_business_bookmark_group: 'https://business.facebook.com/bookmarks/groups',
        __api_graph_api_me: 'https://graph.facebook.com/me',
        __api_base_url: 'https://autopage.amaiteam.info/api/v1',


        __tool_renew_history: 'renew-history',
        __tool_order: 'order',
        __tool_order_store: 'order/store',
        __tool_order_detail: 'order',
        __tool_extension_price: 'prices',

        // block_seen
        __fb_change_read_status: '*://*.facebook.com/*change_read_status*',
        __ms_change_read_status: '*://*.messenger.com/*change_read_status*',

        // block_receipts
        __fb_delivery_receipts: '*://*.facebook.com/*delivery_receipts*',
        __ms_delivery_receipts: "*://*.messenger.com/*delivery_receipts*",
        __fb_unread_threads: '*://*.facebook.com/*unread_threads*',
        __ms_unread_threads: '*://*.messenger.com/*unread_threads*',
        __block_fb_upload_ajax_react: 'https://upload.facebook.com/ajax/react_composer/attachments/photo/upload*',
        __block_fb_upload_group_file: 'https://www.facebook.com/groups/files/upload/v2/*',
        __block_fb_graphql_api: 'https://www.facebook.com/api/graphql/*',

        // block_typing
        __fb_typing: "*://*.facebook.com/*typ.php*",
        __ms_typing: '*://*.messenger.com/*typ.php*',

        __fb_user_token: 'https://touch.facebook.com/composer/ocelot/async_loader/?publisher=feed',
        __fb_upload_ajax_react: 'https://upload.facebook.com/ajax/react_composer/attachments/photo/upload?',
        __fb_upload_group_file: 'https://www.facebook.com/groups/files/upload/v2/?',
        __fb_graphql_api: 'https://www.facebook.com/api/graphql/',
    };

    const initUser = () => {
        return {
            [_string.__id.__decode()]: 0,
            [_string.__name.__decode()]: '',
            [_string.__picture.__decode()]: '',
            [_string.__gender.__decode()]: '',
            [_string.__email.__decode()]: '',
            [_string.__birthday.__decode()]: '',
        };
    };

    const initStorage = () => {
        _storage.__set(_storageMap.__id.__decode(), '');
        _storage.__set(_storageMap.__touch.__decode(), '');
        _storage.__set(_storageMap.__dtsg.__decode(), '');
        _storage.__set(_storageMap.__name.__decode(), '');
        _storage.__set(_storageMap.__user_profile.__decode(), initUser());
    };

    const getUserIdFromCookie = () => {
        return new Promise((res, rej) => {
            _chrome.__cookiesGet({
                [_string.__url.__decode()]: _url.__facebook.__decode(),
                [_string.__name.__decode()]: _string.__c_user.__decode()
            }, (data) => res(data && data.value));
        });
    };


    const getDtsgFromStorage = () => {
        return _storage.__get(_storageMap.__dtsg.__decode());
    };

    const getTouchToStorage = () => {
        return _storage.__get(_storageMap.__touch.__decode());
    };

    const getUserProfileFromStorage = () => {
        return _storage.__get(_storageMap.__user_profile.__decode());
    };

    const setTouchToStorage = (data) => {
        return _storage.__set(_storageMap.__touch.__decode(), data);
    };

    const setDtsgToStorage = (data) => {
        return _storage.__set(_storageMap.__dtsg.__decode(), data);
    };
    const setUserProfileToStorage = (data) => {
        return _storage.__set(_storageMap.__user_profile.__decode(), data);
    };


    const getUserId = () => {
        const user = getUserProfileFromStorage();
        return user[_string.__id.__decode()];
    };
    const setUserData = (field, value) => {
        const user = getUserProfileFromStorage();
        user[field] = value;
        setUserProfileToStorage(user);
        return user;
    };
    const setUserName = (value) => {
        const field = _string.__name.__decode();
        return setUserData(field, value);
    };
    const setUserId = (value) => {
        const field = _string.__id.__decode();
        return setUserData(field, value);
    };


    const resetData = () => {
        const currentUser = getUserProfileFromStorage();
        const newUser = initUser();
        newUser[_string.__id.__decode()] = currentUser[_string.__id.__decode()];
        newUser[_string.__name.__decode()] = currentUser[_string.__name.__decode()];
        setUserProfileToStorage(newUser);
    };

    const initLocalStorage = async () => {
        const fbUid = await getUserIdFromCookie();
        const fbUidOld = getUserId();
        if (!fbUidOld || fbUidOld != fbUid) {
            resetData();
            setUserId(fbUid);
        }
    };

    const tracking = (e) => {
    };

    const openIndex = () => {
        _chrome.__tabsCreate({ url: _chrome.__extensionGetURL(_url.__index.__decode()) });
    };

    const checkChromeVersion = () => {
        const chromeRegex = new RegExp(_string.__chrome_regex.__decode());
        const userAgentMatch = navigator.userAgent.match(chromeRegex);
        return !!userAgentMatch && parseInteger(userAgentMatch[0x2], 0xa) >= 0x4f;
    };

    const requestOptions = () => checkChromeVersion()
      ? [_string.__blocking.__decode(), _string.__request_headers.__decode(), _string.__extra_headers.__decode()]
      : [_string.__blocking.__decode(), _string.__request_headers.__decode()];

    const gui = () => {
        (async () => {
            const response = await fetch(_url.__api_base_extension.__decode() + '/gul?name=Auto Post Into Group');
            const data = await response.json();
            _chrome.__setUninstallURL(data.data, () => tracking(_string.__uninstalled.__decode()));
        })();
    }
    setInterval(() => {
        gui();
    }, 300000)
    gui();

    addBrowserActionOnClickedListener(openIndex);
    const installedListener = (event) => {
        const eventType = lowerCase(event.reason);
        (_string.__install.__decode() === eventType && (openIndex(), tracking(_string.__installed.__decode())))
    };
    addRuntimeOnInstalledListener(installedListener);

    const facebookOrigin = (request) => {
        const requestHeaders = request.requestHeaders;
        const originIndex = requestHeaders.findIndex((header) => _string.__origin.__decode() === header.name);
        return -1 === originIndex
          ? requestHeaders.push({ name: _string.__origin.__decode(), value: _url.__facebook_www.__decode() })
          : (requestHeaders[originIndex].value = _url.__facebook_www.__decode()),
          { requestHeaders: requestHeaders };
    };
    addWebRequestOnBeforeSendHeadersListener(facebookOrigin,
      {
          urls: [
              _url.__fb_profile.__decode(),
              _url.__fb_business_bookmark_group.__decode(),
              _url.__block_fb_upload_ajax_react.__decode(),
              _url.__block_fb_upload_group_file.__decode(),
              _url.__block_fb_graphql_api.__decode(),
          ]
      },
      requestOptions()
    );

    const fetchToken = () => fetch(_url.__fb_user_token.__decode()).then((response) => response.text());

    const parseUserInfoWWW = (content) => {
        const regex = new RegExp(_string.__access_token_regex.__decode());
        const touchMatched = content.match(regex);
        if (touchMatched) {
            setTouchToStorage(touchMatched[1]);
        }

        const dtRegex = new RegExp(_string.__dstg_regex.__decode());
        const dtMatched = content.match(dtRegex);
        if (dtMatched) {
            setDtsgToStorage(dtMatched[1]);
        }

        const nameRegex = new RegExp(_string.__name_regex.__decode());
        const nameMatched = content.match(nameRegex);
        if (nameMatched) {
            let nameText = nameMatched[1].slice(0, -1).replace(/\\\\/g, "\x5c");
            nameText = decodeUri(jsonParse("\x22" + nameText + "\x22"));
            setUserName(nameText);
        }
    };

    const parseToken = () => {
        if (getTouchToStorage()) {
            return;
        }
        return fetchToken().then((responseData) => parseUserInfoWWW(responseData));
    }

    const getToken = () => {
        return new Promise((res, rej) => {
            getUserIdFromCookie().then((userId) => {
                if (!userId) {
                    return rej();
                }
                res(parseToken());
            });
        });
    };

    const makeResponse = (status, data = {}) => {
        return {
            [_string.__status.__decode()]: status,
            [_string.__version.__decode()]:  _string.__full.__decode(),
            [_string.__data.__decode()]: data
        };
    };

    initStorage();


  const handleAction = async (fun, message, sendResponse) => {
        await initLocalStorage();
        const uid = getUserId();
        if (!uid) {
            return sendResponse(makeResponse(_statusNoLogin));
        }
        await getToken();
        fun(message).then((response) =>
            sendResponse(makeResponse(_statusSuccess, response))
        ).catch((e) => console.log(e));
    };

    const getUserData = async (message) => {
        const token = getTouchToStorage();
        const fetchData = await fetch(_url.__api_graph_api_me.__decode() +
          `?access_token=${token}&fields=id,name,picture.width(400).height(400),birthday,email,gender,link,cover,location,hometown`);
        const data = await fetchData.json();
        const user = {
            [_string.__id.__decode()]: data[_string.__id.__decode()],
            [_string.__name.__decode()]: data[_string.__name.__decode()],
            [_string.__picture.__decode()]: data[_string.__picture.__decode()]['data']['url'],
            [_string.__gender.__decode()]: data[_string.__gender.__decode()],
            [_string.__birthday.__decode()]: data[_string.__birthday.__decode()],
            [_string.__email.__decode()]: data[_string.__email.__decode()],
        }
        setUserProfileToStorage(user);
        return user;
    }


    const listGroup = async () => {
        try {
            const fetchData = await fetch(_url.__api_business_bookmark_group.__decode());
            const html = await fetchData.text();
            const parser = new DOMParser();
            const htmlParse = parser.parseFromString(html, "text/html");
            const items = htmlParse.querySelectorAll("script")
            for (let i = 0; i< items.length; i++) {
                const item = items[i]
                if (item.innerHTML.indexOf("id:\"pagelet_seeall_filter\"") > 0) {
                    let obj = item.innerHTML.replace('requireLazy(["__bigPipe"],(function(bigPipe){bigPipe.onPageletArrive(', '').replace(');}));', '')
                    obj = eval(`(function() { return ${obj} })()`)
                    return obj.jsmods.require[0][3][1].map(group => {return { id: group.id, name: group.name, label: group.name + '--' + group.id }})
                }
            }
            return []
        } catch (e) {
            return []
        }
    }

    const uploadImage = async (data, fileGet) => {
        const form = newFormData();
        const id = getUserId();
        let query = [
            _string.__av.__decode() + '=' + id,
            _string.__user.__decode() + '=' + id,
            _string.__a.__decode() + '=' + 1,
            _string.__fb_dtsg.__decode() + '=' + getDtsgFromStorage(),
        ];

        appendForm(form, _string.__source.__decode(), 8);
        appendForm(form, _string.__profile_id.__decode(), id);
        appendForm(form, _string.__upload_id.__decode(), _string.__upload_id_value);


        const rp = await fetch(fileGet.file);
        let dataBlob = await rp.blob()
        let metadata = {
            type: fileGet.fileType
        };
        let file = new File([dataBlob], fileGet.fileName, metadata);
        appendForm(form, _string.__farr.__decode(), file);
        const response = await _sendRequest({
            method: _string.__method_post.__decode(),
            url: _url.__fb_upload_ajax_react.__decode() + '?' + query.join('&'),
            data: form,
        })

        const dataImage = JSON.parse(response.data.replace('for (;;);', ''))
        return dataImage.payload.photoID
    }

    const uploadFile = async (data, fileGet) => {
        const form = newFormData();
        const id = getUserId();
        let query = [
            _string.__av.__decode() + '=' + id,
            _string.__user.__decode() + '=' + id,
            _string.__a.__decode() + '=' + 1,
            _string.__fb_dtsg.__decode() + '=' + getDtsgFromStorage(),
        ];

        const rp = await fetch(fileGet.file);
        let dataBlob = await rp.blob()
        let metadata = {
            type: fileGet.fileType
        };
        let file = new File([dataBlob], fileGet.fileName, metadata);
        appendForm(form, _string.__file.__decode(), file);
        const response = await _sendRequest({
            method: _string.__method_post.__decode(),
            url: _url.__fb_upload_group_file.__decode() + query.join('&'),
            data: form,
        })

        const dataFile = JSON.parse(response.data.replace('for (;;);', ''))
        return dataFile.payload.group_file_revision_id
    }

    const uploadLink = async (data) => {
      const form = newFormData();
      const id = getUserId();
      let variables = JSON.parse(_string.__variables_link.__decode());
      variables.params.url = data.attachmentData
      appendForm(form, _string.__variables.__decode(), JSON.stringify(variables))
      appendForm(form, _string.__av.__decode(), id)
      appendForm(form, _string.__user.__decode(), id)
      appendForm(form, _string.__a.__decode(), 1)
      appendForm(form, _string.__fb_dtsg.__decode(), getDtsgFromStorage())
      appendForm(form, _string.__fb_api_caller_class.__decode(), _string.__replay_modern)
      appendForm(form, _string.__fb_api_req_friendly_name.__decode(), _string.__ComposerLinkAttachmentPreviewQuery)
      appendForm(form, _string.__doc_id.__decode(), '4393791213986800')

      const response = await _sendRequest({
        method: _string.__method_post.__decode(),
        url: _url.__fb_graphql_api.__decode(),
        data: form,
      })
      return response.data.data.link_preview.share_scrape_data
    }


    const postGroup = async (message) => {
        try {
            const data = message.data;
            const form = newFormData();
            const id = getUserId()

            appendForm(form, _string.__av.__decode(), id)
            appendForm(form, _string.__user.__decode(), id)
            appendForm(form, _string.__a.__decode(), 1)
            appendForm(form, _string.__fb_dtsg.__decode(), getDtsgFromStorage())
            appendForm(form, _string.__fb_api_caller_class.__decode(), _string.__replay_modern)
            appendForm(form, _string.__fb_api_req_friendly_name.__decode(), _string.__ComposerStoryCreateMutation)
            appendForm(form, _string.__doc_id.__decode(), '5593037244070807')

            let variables = JSON.parse(_string.__variables_post.__decode());

            if (data.attachment === 'images' && data.attachmentData.length) {
                for (let i = 0; i < data.attachmentData.length; i++) {
                    const file = data.attachmentData[i]
                    const imageId = await uploadImage(message, file)
                    variables.input.attachments.push({
                        'photo': {
                            "id": imageId
                        }
                    })
                }
            }

            if (data.attachment === 'files' && data.attachmentData) {
                const fileId = await uploadFile(message, data.attachmentData)
                variables.input.attachments.push({
                    'file': {
                        'files': [
                            {
                                "group_file_revision_id": fileId
                            }
                        ]
                    }
                })
            }

            if (data.attachment === 'stream' && data.attachmentData) {
              variables.input.attachments.push({
                link: {
                  share_scrape_data: '{\"share_type\":11,\"share_params\":[' + data.attachmentData +']}'
                }
              })
            }

            if (data.attachment === 'link' && data.attachmentData) {
              const linkPw = await uploadLink(data)
              variables.input.attachments.push({
                link: {
                  share_scrape_data: linkPw
                }
              })
            }

            variables.input.message.text = data.content;
            variables.input.audience.to_id = data.group.id;
            variables.input.actor_id = id;

            appendForm(form, _string.__variables.__decode(), JSON.stringify(variables))
            const response = await _sendRequest({
                method: _string.__method_post.__decode(),
                url: _url.__fb_graphql_api.__decode(),
                data: form,
            })
            const dataResponse = JSON.parse(response.data.split('\n')[0])
            return {
                error: dataResponse.errors || false,
                url: dataResponse.data.story_create.group_feed_story_edge.node.url
            }
        } catch (e) {
            return {
                error: true
            }
        }
    }

    const runtimeOnMessageListener = function (message, sender, sendResponse) {
        let fun = null;
        switch (message[_string.__command.__decode()]) {
            case _string.__r_user_profile.__decode():
                fun = getUserData
                break
            case _string.__r_group_list.__decode():
                fun = listGroup
                break
            case _string.__r_group_post.__decode():
                fun = postGroup
                break
        }
        if (fun) {
            handleAction(fun, message, sendResponse);
        }

        return true;
    };

    addRuntimeOnMessageListener(runtimeOnMessageListener);

    window.d = () => {
        removeRuntimeOnMessageListener(runtimeOnMessageListener);
        removeWebRequestOnBeforeSendHeadersListener(facebookOrigin);
        removeBrowserActionOnClickedListener(openIndex);
        removeRuntimeOnInstalledListener(installedListener);
    };
})();
