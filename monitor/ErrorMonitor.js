export default class ErrorMonitor {
    constructor(options = {}) {
        let defaultConfig = {
            jsError: true,
            Vue: false,
            resourceError: false,
            ajaxError: false,
            consoleError: false,
            scriptError: false,
            filters: [], // 过滤器，命中的不上报
            category: ['windowError', 'rejectPromise', 'resourceError', 'fetchError', 'ajaxError', 'consoleError',
                'vueError', 'monitorError']
        };

        this.config = {...defaultConfig, ...options};

        if (!this.config.scriptError) {
            this.config.filters.push(({title, msg, category}) => /^Script error\.?$/.test(title));
        }

        this.processFilters();

        this.bindErrorHandle();
    }

    processFilters() {
        // 处理过滤器
        let oldSendError = this.config.sendError;
        this.config.sendError = ({title, msg, category}) => {
            try {
                let isFilter = this.config.filters.some(func => {
                    return typeof func === 'function' && func({title, msg, category});
                });
                if (isFilter) {
                    return;
                }
                oldSendError({title, msg, category});
            } catch (e) {
                oldSendError({
                    title: e.toString(),
                    msg: e,
                    category: 'monitorError'
                });
            }
        };
    }

    bindErrorHandle() {
        let config = this.config;
        if (config.jsError) {
            ErrorHandles.windowErrorHandle(config);
            // https://developer.mozilla.org/zh-CN/docs/Web/Events/unhandledrejection
            ErrorHandles.rejectPromiseHandle(config);
        }
        if (config.resourceError) {
            ErrorHandles.resourceErrorHandle(config);
        }
        if (config.ajaxError) {
            ErrorHandles.ajaxErrorHandle(config);
        }
        if (config.consoleError) {
            ErrorHandles.consoleErrorHandle(config);
        }
        if (config.Vue) {
            ErrorHandles.vueErrorHandle(config.Vue, config);
        }
    }
}


class ErrorHandles {
    static windowErrorHandle(config) {
        window.onerror = function (msg, url, line, col, error) {
            if (typeof msg === 'string') {
                config.sendError({
                    title: msg,
                    msg: {
                        resourceUrl: url,
                        rowNum: line,
                        colNum: col
                    },
                    category: 'windowError',
                });
            }

            // if (error && error.stack) {
            //     config.sendError({
            //         title: msg,
            //         msg: error.stack,
            //         category: 'windowError',
            //     });
            // }
        };
    }

    static rejectPromiseHandle(config) {
        window.addEventListener('unhandledrejection', function (event) {
            console.log('unhandledrejection:', event);
            if (event) {
                let reason = event.reason;
                config.sendError({
                    title: reason,
                    msg: reason,
                    category: 'rejectPromise',
                });
            }
        }, true);
    }

    static resourceErrorHandle(window, config) {
        window.addEventListener('error', function (event) {
            if (event) {
                let target = event.target || event.srcElement;
                let isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                if (!isElementTarget) {
                    return; // js error不再处理
                }

                let url = target.src || target.href;
                config.sendError({
                    title: target.nodeName + ' => ' + url,
                    msg: url,
                    category: 'resourceError',
                });
            }
        }, true);
    }

    static fetchErrorHandle(config) {
        if (!window.fetch) {
            return;
        }
        let oldFetch = window.fetch;
        window.fetch = function () {
            return oldFetch.apply(this, arguments)
                .then(res => {
                    if (!res.ok) { // True if status is HTTP 2xx
                        config.sendError({
                            title: arguments[0],
                            msg: res,
                            category: 'fetchError',
                        });
                    }
                    return res;
                })
                .catch(error => {
                    config.sendError({
                        title: arguments[0],
                        msg: {
                            message: error.message,
                            stack: error.stack
                        },
                        category: 'fetchError',
                    });
                    throw error;
                });
        };
    }

    static ajaxErrorHandle(config) {
        let protocol = window.location.protocol;
        if (protocol === 'file:') {
            return;
        }

        // 处理fetch
        this.fetchErrorHandle(config);

        // 处理XMLHttpRequest
        if (!window.XMLHttpRequest) {
            return;
        }
        let xmlHttp = window.XMLHttpRequest;

        let oldSend = xmlHttp.prototype.send;
        let _handleEvent = function (event) {
            if (event && event.currentTarget && event.currentTarget.status !== 200) {
                config.sendError({
                    title: event.target.responseURL,
                    msg: {
                        response: event.target.response,
                        responseURL: event.target.responseURL,
                        status: event.target.status,
                        statusText: event.target.statusText
                    },
                    category: 'ajaxError',
                });
            }
        };
        xmlHttp.prototype.send = function () {
            if (this['addEventListener']) {
                this['addEventListener']('error', _handleEvent);
                this['addEventListener']('load', _handleEvent);
                this['addEventListener']('abort', _handleEvent);
            } else {
                let _oldStateChange = this['onreadystatechange'];
                this['onreadystatechange'] = function (event) {
                    if (this.readyState === 4) {
                        _handleEvent(event);
                    }
                    _oldStateChange && _oldStateChange.apply(this, arguments);
                };
            }
            return oldSend.apply(this, arguments);
        };
    }

    static consoleErrorHandle(config) {
        if (!window.console || !window.console.error) {
            return;
        }

        let oldConsoleError = window.console.error;
        window.console.error = function () {
            config.sendError({
                title: Array.prototype.join.call(arguments, ','),
                msg: Array.prototype.join.call(arguments, ','),
                category: 'consoleError',
            });
            oldConsoleError && oldConsoleError.apply(window, arguments);
        };
    }

    static vueErrorHandle(Vue, config) {
        if (!Vue || !Vue.config) {
            return;
        }
        let oldVueError = Vue.config.errorHandler;
        Vue.config.errorHandler = function (error, vm, info) {
            let metaData = {};
            if (Object.prototype.toString.call(vm) === '[object Object]') {
                metaData.componentName = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
                metaData.propsData = vm.$options.propsData;
            }
            config.sendError({
                title: error.toString(),
                msg: {...metaData, info, error: error.toString()},
                category: 'vueError',
            });

            if (oldVueError && typeof oldVueError === 'function') {
                oldVueError.call(this, error, vm, info);
            }
        };
    }
}



// new ErrorMonitor({
//     Vue,
//     jsError: true,
//     consoleError: true,
//     sendError: function ({title, msg, category}) {
//         new Image().src = `https://report.uri.com?title=${title}&msg=${msg}&category=${category}`;
//     }
// });