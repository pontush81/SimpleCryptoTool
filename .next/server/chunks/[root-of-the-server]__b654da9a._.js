module.exports = {

"[project]/.next-internal/server/app/api/technical-analysis/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/lib/indicators.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "calculateEMA": ()=>calculateEMA,
    "calculateMACD": ()=>calculateMACD,
    "calculateRSI": ()=>calculateRSI,
    "generateTradingSignals": ()=>generateTradingSignals,
    "getLatestSignal": ()=>getLatestSignal
});
function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) {
        return [];
    }
    const results = [];
    const gains = [];
    const losses = [];
    for(let i = 1; i < prices.length; i++){
        const change = prices[i] - prices[i - 1];
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);
    }
    for(let i = period - 1; i < gains.length; i++){
        const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b)=>a + b, 0) / period;
        const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b)=>a + b, 0) / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);
        let signal = 'neutral';
        if (rsi <= 30) signal = 'oversold';
        else if (rsi >= 70) signal = 'overbought';
        results.push({
            value: rsi,
            signal,
            timestamp: new Date().toISOString()
        });
    }
    return results;
}
function calculateEMA(prices, period) {
    if (prices.length < period) return [];
    const multiplier = 2 / (period + 1);
    const ema = [];
    ema[0] = prices.slice(0, period).reduce((a, b)=>a + b, 0) / period;
    for(let i = 1; i < prices.length - period + 1; i++){
        ema[i] = (prices[i + period - 1] - ema[i - 1]) * multiplier + ema[i - 1];
    }
    return ema;
}
function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    if (prices.length < slowPeriod + signalPeriod) {
        return [];
    }
    const fastEMA = calculateEMA(prices, fastPeriod);
    const slowEMA = calculateEMA(prices, slowPeriod);
    if (fastEMA.length === 0 || slowEMA.length === 0) return [];
    const macdLine = [];
    const minLength = Math.min(fastEMA.length, slowEMA.length);
    for(let i = 0; i < minLength; i++){
        macdLine.push(fastEMA[i] - slowEMA[i]);
    }
    const signalLine = calculateEMA(macdLine, signalPeriod);
    const results = [];
    for(let i = 0; i < signalLine.length; i++){
        const histogram = macdLine[i] - signalLine[i];
        let crossover = 'none';
        if (i > 0) {
            const prevHistogram = macdLine[i - 1] - signalLine[i - 1];
            if (prevHistogram <= 0 && histogram > 0) crossover = 'bullish';
            else if (prevHistogram >= 0 && histogram < 0) crossover = 'bearish';
        }
        results.push({
            macd: macdLine[i],
            signal: signalLine[i],
            histogram,
            crossover,
            timestamp: new Date().toISOString()
        });
    }
    return results;
}
function generateTradingSignals(rsi, macd) {
    if (rsi.length === 0 || macd.length === 0) return [];
    const signals = [];
    const minLength = Math.min(rsi.length, macd.length);
    for(let i = 0; i < minLength; i++){
        const currentRSI = rsi[i];
        const currentMACD = macd[i];
        let type = 'hold';
        let strength = 50;
        let confidence = 50;
        const reasons = [];
        if (currentRSI.signal === 'oversold' && currentMACD.crossover === 'bullish') {
            type = 'buy';
            strength = 80;
            confidence = 75;
            reasons.push('RSI oversold', 'MACD bullish crossover');
        } else if (currentRSI.signal === 'overbought' && currentMACD.crossover === 'bearish') {
            type = 'sell';
            strength = 80;
            confidence = 75;
            reasons.push('RSI overbought', 'MACD bearish crossover');
        } else if (currentRSI.signal === 'oversold') {
            type = 'buy';
            strength = 60;
            confidence = 60;
            reasons.push('RSI oversold');
        } else if (currentRSI.signal === 'overbought') {
            type = 'sell';
            strength = 60;
            confidence = 60;
            reasons.push('RSI overbought');
        }
        signals.push({
            type,
            strength,
            confidence,
            reasons,
            timestamp: new Date().toISOString()
        });
    }
    return signals;
}
function getLatestSignal(signals) {
    return signals.length > 0 ? signals[signals.length - 1] : null;
}
}),
"[project]/app/api/technical-analysis/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indicators.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol') || 'bitcoin';
        console.log(`🔍 Generating technical analysis for ${symbol}`);
        const cryptoResponse = await fetch(`${request.url.replace('/api/technical-analysis', '/api/crypto')}?symbol=${symbol}`);
        if (!cryptoResponse.ok) {
            throw new Error('Failed to fetch current crypto prices');
        }
        const cryptoData = await cryptoResponse.json();
        const mockPrices = [
            42000,
            42500,
            41800,
            43200,
            44100,
            43800,
            42900,
            43500,
            44200,
            43700,
            44800,
            45200,
            44600,
            43900,
            44700,
            45100,
            44300,
            43600,
            44900,
            45400,
            44800,
            43200,
            44600,
            45800,
            46200,
            45600,
            44900,
            45700,
            46100,
            45300
        ];
        const rsiResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateRSI"])(mockPrices, 14);
        const macdResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateMACD"])(mockPrices, 12, 26, 9);
        const tradingSignals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateTradingSignals"])(rsiResults, macdResults);
        const latestSignal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLatestSignal"])(tradingSignals);
        const latestRSI = rsiResults[rsiResults.length - 1];
        const latestMACD = macdResults[macdResults.length - 1];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            symbol,
            current_price: cryptoData.current_price || 43250,
            indicators: {
                rsi: {
                    value: latestRSI?.value || 50,
                    signal: latestRSI?.signal || 'neutral'
                },
                macd: {
                    value: latestMACD?.macd || 0,
                    signal: latestMACD?.signal || 0,
                    histogram: latestMACD?.histogram || 0,
                    crossover: latestMACD?.crossover || 'none'
                }
            },
            trading_signal: latestSignal || {
                type: 'hold',
                strength: 50,
                confidence: 50,
                reasons: [
                    'Neutral market conditions'
                ],
                timestamp: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in technical analysis:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            symbol: 'bitcoin',
            current_price: 43250,
            indicators: {
                rsi: {
                    value: 50,
                    signal: 'neutral'
                },
                macd: {
                    value: 0,
                    signal: 0,
                    histogram: 0,
                    crossover: 'none'
                }
            },
            trading_signal: {
                type: 'hold',
                strength: 50,
                confidence: 50,
                reasons: [
                    'Using fallback data'
                ],
                timestamp: new Date().toISOString()
            },
            error: 'Using fallback data due to API error',
            timestamp: new Date().toISOString()
        }, {
            status: 200
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__b654da9a._.js.map