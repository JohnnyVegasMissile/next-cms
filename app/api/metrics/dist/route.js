"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.POST = exports.GET = void 0;
var server_1 = require("next/server");
var prisma_1 = require("~/utilities/prisma");
var client_1 = require("@prisma/client");
var dayjs_1 = require("dayjs");
var languages_1 = require("~/utilities/languages");
exports.GET = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('geo', request.geo);
                return [4 /*yield*/, prisma_1.prisma.role.findMany({
                        include: {
                            _count: {
                                select: { logins: true }
                            }
                        }
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, prisma_1.prisma.page.count({ where: { type: client_1.PageType.PAGE } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, prisma_1.prisma.container.count()];
            case 3:
                _a.sent();
                return [4 /*yield*/, prisma_1.prisma.content.count()];
            case 4:
                _a.sent();
                return [2 /*return*/, server_1.NextResponse.json({})];
        }
    });
}); };
exports.POST = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, value, url, newSlug, language, splitSlug, key, slug, today, metric;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, request.json()];
            case 1:
                _a = (_c.sent()), name = _a.name, value = _a.value, url = _a.url;
                console.log('0', name, value, url);
                newSlug = url.substring(1);
                language = undefined;
                splitSlug = newSlug.split('/');
                console.log('1');
                if (!!splitSlug.length) {
                    for (key in Object().keys(client_1.CodeLanguage)) {
                        if (splitSlug[0] === languages_1["default"][key].code) {
                            language = key;
                            break;
                        }
                    }
                }
                console.log('2');
                if (!!language) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.prisma.setting.findUnique({ where: { type: client_1.SettingType.LANGUAGE_PREFERRED } })];
            case 2:
                language = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.value;
                return [3 /*break*/, 4];
            case 3:
                splitSlug.shift();
                newSlug = splitSlug.join('/');
                _c.label = 4;
            case 4:
                console.log('3');
                return [4 /*yield*/, prisma_1.prisma.slug.findUnique({ where: { full: url.substring(1) } })];
            case 5:
                slug = _c.sent();
                if (!slug) {
                    return [2 /*return*/, server_1.NextResponse.json({ error: 'Slug not found' }, { status: 404 })];
                }
                today = dayjs_1["default"]().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
                console.log('3');
                return [4 /*yield*/, prisma_1.prisma.metric.findFirst({
                        where: {
                            name: name,
                            language: language,
                            day: { equals: today.toISOString() },
                            slugId: slug.id
                        }
                    })];
            case 6:
                metric = _c.sent();
                if (!!metric) return [3 /*break*/, 8];
                return [4 /*yield*/, prisma_1.prisma.metric.create({
                        data: {
                            name: name,
                            day: today.toISOString(),
                            value: value,
                            count: 1,
                            language: language,
                            slugId: slug.id
                        }
                    })];
            case 7:
                _c.sent();
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, prisma_1.prisma.metric.update({
                    where: { id: metric.id },
                    data: {
                        value: (metric.value * metric.count + value) / (metric.count + 1),
                        count: metric.count + 1
                    }
                })];
            case 9:
                _c.sent();
                _c.label = 10;
            case 10: return [2 /*return*/, server_1.NextResponse.json({})];
        }
    });
}); };
