(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/utils/authSession.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    return ("TURBOPACK compile-time value", "object") !== 'undefined' && typeof window.sessionStorage !== 'undefined';
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
    currentSession = readSession(window.sessionStorage) || readSession(window.localStorage);
    return currentSession;
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
    if (canUseStorage()) {
        clearSession(window.sessionStorage);
        clearSession(window.localStorage);
        if (accessToken) {
            const storage = remember ? window.localStorage : window.sessionStorage;
            writeSession(storage, currentSession);
        }
    }
    emit();
    return currentSession;
}
function clearAuthSession() {
    currentSession = null;
    if (canUseStorage()) {
        clearSession(window.sessionStorage);
        clearSession(window.localStorage);
    }
    emit();
}
function subscribeAuthSession(listener) {
    listeners.add(listener);
    return ()=>{
        listeners.delete(listener);
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authSession.js [app-client] (ecmascript)");
;
;
const API_ORIGIN = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
const API_URL = API_ORIGIN.endsWith('/api') ? API_ORIGIN : `${API_ORIGIN.replace(/\/$/, '')}/api`;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
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
                const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoredAuthSession"])();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthSession"])({
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
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthSession"])();
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/AuthContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authSession.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useAuth = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const AuthProvider = ({ children })=>{
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accessToken, setAccessToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Subscribe to cross-tab session changes (safe to register on client only)
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeAuthSession"])({
                "AuthProvider.useEffect.unsubscribe": (session)=>{
                    setUser(session?.user || null);
                    setAccessToken(session?.accessToken || null);
                }
            }["AuthProvider.useEffect.unsubscribe"]);
            let active = true;
            const bootstrapSession = {
                "AuthProvider.useEffect.bootstrapSession": async ()=>{
                    // Only access localStorage/session helpers on the client
                    const initialSession = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoredAuthSession"])() : "TURBOPACK unreachable";
                    if (initialSession?.accessToken) {
                        setUser(initialSession.user || null);
                        setAccessToken(initialSession.accessToken || null);
                        setLoading(false);
                        return;
                    }
                    try {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/refresh', {}, {
                            skipAuthRefresh: true
                        });
                        const payload = response.data?.data || {};
                        if (payload.accessToken) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthSession"])({
                                user: payload.user || null,
                                accessToken: payload.accessToken,
                                remember: true
                            });
                        }
                    } catch (bootstrapError) {
                        // clear any possibly stale session state on failure
                        if ("TURBOPACK compile-time truthy", 1) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthSession"])();
                    } finally{
                        if (active) {
                            setLoading(false);
                        }
                    }
                }
            }["AuthProvider.useEffect.bootstrapSession"];
            // Only run bootstrap on client
            if ("TURBOPACK compile-time truthy", 1) bootstrapSession();
            return ({
                "AuthProvider.useEffect": ()=>{
                    active = false;
                    unsubscribe();
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
    const signUp = async (email, password, fullName, options = {})=>{
        try {
            setError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/register', {
                email,
                password,
                fullName
            }, {
                skipAuthRefresh: true
            });
            const payload = response.data?.data || {};
            if (payload.accessToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthSession"])({
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login', {
                email,
                password
            }, {
                skipAuthRefresh: true
            });
            const payload = response.data?.data || {};
            if (payload.accessToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthSession"])({
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/logout', {}, {
                skipAuthRefresh: true
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authSession$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthSession"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.jsx",
        lineNumber: 140,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AuthProvider, "hTnLCdo3W2N1uYQ0VwKav2MHcCg=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers/ProvidersClient.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProvidersClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.jsx [app-client] (ecmascript)");
"use client";
;
;
;
function ProvidersClient({ children }) {
    // ProvidersClient is a client component and should only be used on the client.
    // AuthProvider itself guards access to window/localStorage during its bootstrap.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers/ProvidersClient.jsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = ProvidersClient;
var _c;
__turbopack_context__.k.register(_c, "ProvidersClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0xajddw._.js.map