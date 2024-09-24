// @ts-ignore
import React from "react";
import Main from "./main/Main";
import 'react-toastify/dist/ReactToastify.css';
import {createRoot} from 'react-dom/client';

const container = document.getElementById('root');
// @ts-ignore
const root = createRoot(container);
root.render(<React.StrictMode><Main/></React.StrictMode>);
