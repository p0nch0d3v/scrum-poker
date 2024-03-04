
export default class Config {
    static MODE: string = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE;
    static SOCKET_SERVER: string = import.meta.env.VITE_SOCKET_SERVER || '';
} 