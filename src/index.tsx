import 'react-toastify/dist/ReactToastify.css';
import {createRoot} from 'react-dom/client';
import Main from "./main/Main.tsx";

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);
root.render(<Main/>);
