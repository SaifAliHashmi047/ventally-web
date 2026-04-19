import { io, Socket } from 'socket.io-client';
import { getAccessToken, SOCKET_URL } from './apiInstance';

class SocketService {
  socket: Socket | null = null;
  private pendingListeners = new Map<string, Set<(...args: any[]) => void>>();
  private connecting = false;

  async connect(): Promise<Socket> {
    if (this.socket?.connected) return this.socket;

    if (this.connecting && this.socket) {
      return new Promise((resolve, reject) => {
        this.socket!.once('connect', () => resolve(this.socket!));
        this.socket!.once('connect_error', reject);
      });
    }

    this.connecting = true;

    const token = await getAccessToken();
    if (!token) {
      this.connecting = false;
      throw new Error('No authentication token found');
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] connected:', this.socket?.id);
      this.reattachPendingListeners();
    });
    this.socket.on('connect_error', (err) =>
      console.error('[Socket] connect error:', err.message),
    );
    this.socket.on('disconnect', (reason) =>
      console.log('[Socket] disconnected:', reason),
    );

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.connecting = false;
        reject(new Error('Socket connection timeout'));
      }, 15000);

      this.socket!.once('connect', () => {
        clearTimeout(timeout);
        this.connecting = false;
        resolve(this.socket!);
      });
      this.socket!.once('connect_error', (err) => {
        clearTimeout(timeout);
        this.connecting = false;
        reject(err);
      });
    });
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.pendingListeners.has(event)) {
      this.pendingListeners.set(event, new Set());
    }
    this.pendingListeners.get(event)!.add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.pendingListeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    } else {
      this.pendingListeners.delete(event);
      this.socket?.off(event);
    }
  }

  emit(event: string, data?: any, callback?: (response?: any) => void): void {
    if (!this.socket?.connected) {
      console.warn('[Socket] not connected, trying to reconnect before emit:', event);
      this.connect()
        .then(() => {
          if (callback) {
            this.socket!.emit(event, data, callback);
          } else {
            this.socket!.emit(event, data);
          }
        })
        .catch((err) => console.error('[Socket] emit failed:', event, err));
      return;
    }
    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.pendingListeners.clear();
    this.connecting = false;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  private reattachPendingListeners(): void {
    if (!this.socket) return;
    for (const [event, callbacks] of this.pendingListeners) {
      for (const cb of callbacks) {
        this.socket.off(event, cb);
        this.socket.on(event, cb);
      }
    }
  }
}

const socketService = new SocketService();
export default socketService;
