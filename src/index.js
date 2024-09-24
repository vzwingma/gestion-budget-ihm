"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var react_1 = __importDefault(require("react"));
var Main_1 = __importDefault(require("./main/Main"));
require("react-toastify/dist/ReactToastify.css");
var client_1 = require("react-dom/client");
var container = document.getElementById('root');
var root = (0, client_1.createRoot)(container);
root.render(<react_1.default.StrictMode><Main_1.default /></react_1.default.StrictMode>);
