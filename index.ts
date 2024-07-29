export class BroadcastService {
  private channel: BroadcastChannel;
  private broadcastChannel: BroadcastChannel;

  public channelId: string;

  private readonly BROADCAST_ID: string = "ctcm";

  private storage: { [channel: string]: any[] } = {};
  private callback: ((event: MessageEvent) => void) | null = null;

  constructor(channelId?: string) {
    this.channelId = channelId || BroadcastService.generateRandomChannelName(6);
    this.channel = new BroadcastChannel(this.channelId);

    this.channel.onmessage = this.handleMessage.bind(this);

    this.broadcastChannel = new BroadcastChannel(this.BROADCAST_ID);
    this.broadcastChannel.onmessage = this.handleMessage.bind(this);
  }

  private handleMessage(event: MessageEvent) {
    if (this.callback) {
      this.callback(event);
    }
  }

  //Send a message to all instances listening on this channel.
  sendMessage(message: any, storeInHistory: boolean = true) {
    this.channel.postMessage(message);
    if (storeInHistory) {
      this.addToStorage(this.channel.name, message);
    }
  }

  private addToStorage(channel: string, message: any) {
    if (!this.storage[channel]) {
      this.storage[channel] = [];
    }
    this.storage[channel]?.push(message);
  }

  onMessage(callback: (event: MessageEvent) => void) {
    this.callback = callback;
  }

  //Send a message to all instances.
  broadcast(message: any) {
    this.broadcastChannel.postMessage(message);
    this.addToStorage(this.broadcastChannel.name, message);
  }

  getHistory(includeBroadcasts: boolean = false) {
    let result: object[] = [];
    result.push(this.storage[this.channel.name] ?? {});
    if (includeBroadcasts) {
      result.push(this.storage[this.broadcastChannel.name] ?? {});
    }
    return result;
  }

  close() {
    this.channel.close();
  }

  static generateRandomChannelName = (length = 6) =>
    Math.random().toString(20).substring(2, length);
}
