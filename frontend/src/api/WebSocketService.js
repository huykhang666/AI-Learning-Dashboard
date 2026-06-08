import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.subscribers = new Map(); 
    }

    // Hàm kích hoạt kết nối
    connect(token, onConnectCallback) {
        if (this.isConnected) {
            if (onConnectCallback) onConnectCallback();
            return;
        }

        // Trong production, VITE_API_URL="/api" (relative) nên phải dùng origin của browser
        // Trong dev, VITE_API_URL="http://localhost:8080" nên dùng trực tiếp
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const wsBase = apiBase.startsWith("http") ? apiBase : window.location.origin;
        const socket = new SockJS(`${wsBase}/ws`); 
        
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}` 
            },
            debug: (str) => {
                console.log('✉️ [WebSocket]: ' + str);
            },
            reconnectDelay: 5000, 
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.stompClient.onConnect = (frame) => {
            console.log('Đã kết nối WebSocket thành công!');
            this.isConnected = true;
            if (onConnectCallback) onConnectCallback();
        };

        this.stompClient.onStompError = (frame) => {
            console.error('Lỗi bộ giải mã Broker: ' + frame.headers['message']);
        };

        this.stompClient.activate();
    }

    subscribe(topic, callback) {
        if (!this.stompClient || !this.isConnected) {
            console.warn('⚠️ Hệ thống chưa kết nối WebSocket. Đang đợi...');
            return null;
        }

        if (this.subscribers.has(topic)) {
            this.subscribers.get(topic).unsubscribe();
        }

        const subscription = this.stompClient.subscribe(topic, (stompMessage) => {
            if (stompMessage.body) {
                const data = JSON.parse(stompMessage.body);
                callback(data);
            }
        });

        this.subscribers.set(topic, subscription);
        return subscription;
    }

    // Ngắt kết nối khi đăng xuất (Logout)
    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.isConnected = false;
            this.subscribers.clear();
            console.log('🔌 Đã ngắt kết nối WebSocket an toàn.');
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;