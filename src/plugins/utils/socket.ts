export class Socket {
  private ws:WebSocket | null;
  private url:string;
  private socketStatus:boolean;

  constructor(url:string){
    this.ws = null;
    this.url = url;
    this.socketStatus = false
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = this.onopen.bind(this)
    this.ws.onclose = this.onclose.bind(this)
    this.ws.onerror = this.onerror.bind(this)
  }

  onopen() {
    this.socketStatus = true
    console.log('websocket连接成功', this.ws);
  }


  onclose() {
    this.socketStatus = false
    console.log('websocket连接关闭.')
  }

  onerror() {
    this.socketStatus = false
    console.log('websocket连接失败');
  }

  send(message:any) {
    if (this.ws && this.socketStatus) {
      let msg = {
        event: 'message',
        data: JSON.stringify(message)
      }
      this.ws.send(JSON.stringify(msg))
    }
  }

  getWebSocket(){
    return this.ws
  }
}