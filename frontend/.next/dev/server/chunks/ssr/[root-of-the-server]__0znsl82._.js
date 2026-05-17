module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/utils/authSession.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthSession",
    ()=>clearAuthSession,
    "getAccessToken",
    ()=>getAccessToken,
    "getStoredAuthSession",
    ()=>getStoredAuthSession,
    "setAuthSession",
    ()=>setAuthSession,
    "subscribeAuthSession",
    ()=>subscribeAuthSession
]);
const STORAGE_KEY = 'velocity.auth.session';
let currentSession = null;
const listeners = new Set();
function canUseStorage() {
    return ("TURBOPACK compile-time value", "undefined") !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}
function readSession(storage) {
    if (!storage) return null;
    try {
        const value = storage.getItem(STORAGE_KEY);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        return null;
    }
}
function writeSession(storage, session) {
    if (!storage) return;
    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
    // Ignore storage failures.
    }
}
function clearSession(storage) {
    if (!storage) return;
    try {
        storage.removeItem(STORAGE_KEY);
    } catch (error) {
    // Ignore storage failures.
    }
}
function emit() {
    listeners.forEach((listener)=>listener(currentSession));
}
function getStoredAuthSession() {
    if (currentSession) {
        return currentSession;
    }
    if (!canUseStorage()) {
        return null;
    }
    //TURBOPACK unreachable
    ;
}
function getAccessToken() {
    return getStoredAuthSession()?.accessToken || null;
}
function setAuthSession({ user, accessToken, remember = false }) {
    currentSession = {
        user: user || null,
        accessToken: accessToken || null,
        remember: Boolean(remember),
        updatedAt: Date.now()
    };
    if (canUseStorage()) //TURBOPACK unreachable
    ;
    emit();
    return currentSession;
}
function clearAuthSession() {
    currentSession = null;
    if (canUseStorage()) //TURBOPACK unreachable
    ;
    emit();
}
function subscribeAuthSession(listener) {
    listeners.add(listener);
    return ()=>{
        listeners.delete(listener);
    };
}
}),
"[project]/src/utils/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calendarAPI",
    ()=>calendarAPI,
    "default",
    ()=>__TURBOPACK__default__export__,
    "leadsAPI",
    ()=>leadsAPI,
    "systemAPI",
    ()=>systemAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authSession.js [app-ssr] (ecmascript)");
;
;
const API_ORIGIN = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
const API_URL = API_ORIGIN.endsWith('/api') ? API_ORIGIN : `${API_ORIGIN.replace(/\/$/, '')}/api`;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
let refreshPromise = null;
async function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh', {}, {
            skipAuthRefresh: true
        }).then((response)=>{
            const payload = response.data?.data || {};
            if (payload.accessToken) {
                const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoredAuthSession"])();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSession"])({
                    user: payload.user || session?.user || null,
                    accessToken: payload.accessToken,
                    remember: session?.remember ?? true
                });
            }
            return payload;
        }).finally(()=>{
            refreshPromise = null;
        });
    }
    return refreshPromise;
}
api.interceptors.request.use((config)=>{
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const leadsAPI = {
    getAll: ()=>api.get('/leads'),
    getById: (id)=>api.get(`/leads/${id}`),
    updateScore: (id, score)=>api.patch(`/leads/${id}/score`, {
            score
        }),
    escalateToHuman: (id)=>api.post(`/leads/${id}/escalate`)
};
const calendarAPI = {
    getStatus: ()=>api.get('/calendar/status'),
    getSlots: (date)=>api.get('/calendar/slots', {
            params: {
                date
            }
        }),
    syncCalendar: ()=>api.post('/calendar/sync'),
    updateTimezone: (timezone)=>api.patch('/calendar/timezone', {
            timezone
        })
};
const systemAPI = {
    health: ()=>api.get('/health')
};
// Error handling middleware
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config || {};
    const status = error.response?.status;
    if (originalRequest.skipAuthRefresh || originalRequest._retry || status !== 401) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
    originalRequest._retry = true;
    try {
        await refreshAccessToken();
        return api(originalRequest);
    } catch (refreshError) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthSession"])();
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
});
const __TURBOPACK__default__export__ = api;
}),
"[project]/src/context/AuthContext.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/api.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authSession.js [app-ssr] (ecmascript)");
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
const AuthProvider = ({ children })=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accessToken, setAccessToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Subscribe to cross-tab session changes (safe to register on client only)
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeAuthSession"])((session)=>{
            setUser(session?.user || null);
            setAccessToken(session?.accessToken || null);
        });
        let active = true;
        const bootstrapSession = async ()=>{
            // Only access localStorage/session helpers on the client
            const initialSession = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
            if (initialSession?.accessToken) {
                setUser(initialSession.user || null);
                setAccessToken(initialSession.accessToken || null);
                setLoading(false);
                return;
            }
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/auth/refresh', {}, {
                    skipAuthRefresh: true
                });
                const payload = response.data?.data || {};
                if (payload.accessToken) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSession"])({
                        user: payload.user || null,
                        accessToken: payload.accessToken,
                        remember: true
                    });
                }
            } catch (bootstrapError) {
                // clear any possibly stale session state on failure
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            } finally{
                if (active) {
                    setLoading(false);
                }
            }
        };
        // Only run bootstrap on client
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return ()=>{
            active = false;
            unsubscribe();
        };
    }, []);
    const signUp = async (email, password, fullName, options = {})=>{
        try {
            setError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/auth/register', {
                email,
                password,
                fullName
            }, {
                skipAuthRefresh: true
            });
            const payload = response.data?.data || {};
            if (payload.accessToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSession"])({
                    user: payload.user || null,
                    accessToken: payload.accessToken,
                    remember: options.remember ?? true
                });
            }
            return payload.user || null;
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            throw err;
        }
    };
    const signIn = async (email, password, options = {})=>{
        try {
            setError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/auth/login', {
                email,
                password
            }, {
                skipAuthRefresh: true
            });
            const payload = response.data?.data || {};
            if (payload.accessToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSession"])({
                    user: payload.user || null,
                    accessToken: payload.accessToken,
                    remember: options.remember ?? false
                });
            }
            return payload.user || null;
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            throw err;
        }
    };
    const logout = async ()=>{
        try {
            setError(null);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/auth/logout', {}, {
                skipAuthRefresh: true
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthSession"])();
        }
    };
    const value = {
        user,
        accessToken,
        loading,
        error,
        signUp,
        signIn,
        logout,
        isAuthenticated: !!accessToken
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.jsx",
        lineNumber: 140,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/providers/ProvidersClient.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProvidersClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.jsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function ProvidersClient({ children }) {
    // ProvidersClient is a client component and should only be used on the client.
    // AuthProvider itself guards access to window/localStorage during its bootstrap.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers/ProvidersClient.jsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0znsl82._.js.map