// @ts-ignore
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {createRoot} from 'react-dom/client';
import Main from "./main/Main.tsx";

const container = document.getElementById('root');
// @ts-ignore
const root = createRoot(container);
root.render(<Main/>);
