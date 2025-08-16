module.exports = {

"[project]/.next-internal/server/app/api/crypto/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/api/crypto/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');
        if (symbol) {
            console.log(`📡 Fetching data for specific symbol: ${symbol}`);
            const coinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol}&order=market_cap_desc&sparkline=false&locale=en`, {
                next: {
                    revalidate: 60
                }
            });
            if (!coinResponse.ok) {
                throw new Error(`CoinGecko API error for ${symbol}: ${coinResponse.status}`);
            }
            const coinData = await coinResponse.json();
            if (coinData.length > 0) {
                console.log(`✅ Got data for ${symbol}:`, coinData[0]);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    data: coinData[0],
                    ...coinData[0],
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error(`No data found for symbol: ${symbol}`);
            }
        }
        const coinsResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en', {
            next: {
                revalidate: 60
            }
        });
        if (!coinsResponse.ok) {
            throw new Error(`CoinGecko API error: ${coinsResponse.status}`);
        }
        const coinsData = await coinsResponse.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: coinsData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');
        if (symbol) {
            const symbolFallbacks = {
                'bitcoin': {
                    id: 'bitcoin',
                    name: 'Bitcoin',
                    symbol: 'btc',
                    current_price: 43250.00,
                    price_change_24h: 1250.30,
                    price_change_percentage_24h: 2.98,
                    market_cap: 847000000000,
                    total_volume: 23400000000,
                    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
                },
                'ethereum': {
                    id: 'ethereum',
                    name: 'Ethereum',
                    symbol: 'eth',
                    current_price: 2650.75,
                    price_change_24h: -45.20,
                    price_change_percentage_24h: -1.68,
                    market_cap: 318000000000,
                    total_volume: 12100000000,
                    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
                }
            };
            const fallbackData = symbolFallbacks[symbol] || symbolFallbacks['bitcoin'];
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                data: fallbackData,
                ...fallbackData,
                error: 'Using fallback data due to API error',
                timestamp: new Date().toISOString()
            }, {
                status: 200
            });
        }
        const mockData = [
            {
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'btc',
                current_price: 43250.00,
                price_change_24h: 1250.30,
                price_change_percentage_24h: 2.98,
                market_cap: 847000000000,
                total_volume: 23400000000,
                image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
            },
            {
                id: 'ethereum',
                name: 'Ethereum',
                symbol: 'eth',
                current_price: 2650.75,
                price_change_24h: -45.20,
                price_change_percentage_24h: -1.68,
                market_cap: 318000000000,
                total_volume: 12100000000,
                image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            data: mockData,
            error: 'Using fallback data due to API error',
            timestamp: new Date().toISOString()
        }, {
            status: 200
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__6d7b9e7f._.js.map