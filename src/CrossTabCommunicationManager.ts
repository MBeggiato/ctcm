import { CrossTabCommunicationError } from "./CrossTabCommunicationError";

interface ChannelStorage {
  [channel: string]: any[];
}

/**
 * Manages cross-tab communication using the BroadcastChannel API.
 */
export class CrossTabCommunicationManager {
  private messageChannel: BroadcastChannel;
  private globalChannel: BroadcastChannel;

  public channelId: string;

  private readonly BROADCAST_ID: string = "ctcm";
  private readonly storage: ChannelStorage = {};
  private callback: ((event: MessageEvent) => void) | null = null;

  /**
   * Creates an instance of CrossTabCommunicationManager.
   * @param channelId - The ID of the channel to be used for communication. If not provided, a random ID is generated.
   */
  constructor(channelId?: string) {
    try {
      this.channelId =
        channelId || CrossTabCommunicationManager.generateRandomChannelName(6);
      this.messageChannel = new BroadcastChannel(this.channelId);
      this.globalChannel = new BroadcastChannel(this.BROADCAST_ID);

      this.bindHandlers();
    } catch (error) {
      throw new CrossTabCommunicationError("Failed to initialize channels");
    }
  }

  /**
   * Binds the message handlers to the channels.
   */
  private bindHandlers() {
    this.messageChannel.onmessage = this.handleMessage.bind(this);
    this.globalChannel.onmessage = this.handleMessage.bind(this);
  }

  /**
   * Handles incoming messages and invokes the callback if set.
   * @param event - The message event received from the BroadcastChannel.
   */
  private handleMessage(event: MessageEvent) {
    try {
      if (this.callback) {
        this.callback(event);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      throw new CrossTabCommunicationError("Error handling message");
    }
  }

  /**
   * Sends a message to all instances listening on this channel.
   * @param message - The message to send.
   * @param storeInHistory - Whether to store the message in history.
   */
  sendMessage(message: any, storeInHistory: boolean = true) {
    try {
      this.messageChannel.postMessage(message);
      if (storeInHistory) {
        this.addToStorage(this.messageChannel.name, message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw new CrossTabCommunicationError("Error sending message");
    }
  }

  /**
   * Adds a message to the storage for the specified channel.
   * @param channel - The name of the channel.
   * @param message - The message to add.
   */
  private addToStorage(channel: string, message: any) {
    try {
      if (!this.storage[channel]) {
        this.storage[channel] = [];
      }
      this.storage[channel].push(message);
    } catch (error) {
      console.error("Error adding to storage:", error);
      throw new CrossTabCommunicationError("Error adding to storage");
    }
  }

  /**
   * Sets the callback to be invoked when a message is received.
   * @param callback - The callback function.
   */
  onMessage(callback: (event: MessageEvent) => void) {
    this.callback = callback;
  }

  /**
   * Sends a message to all instances across all channels.
   * @param message - The message to broadcast.
   */
  broadcast(message: any) {
    try {
      this.globalChannel.postMessage(message);
      this.addToStorage(this.globalChannel.name, message);
    } catch (error) {
      console.error("Error broadcasting message:", error);
      throw new CrossTabCommunicationError("Error broadcasting message");
    }
  }

  /**
   * Retrieves the message history.
   * @param includeBroadcasts - Whether to include broadcast messages in the history.
   * @returns An array of message objects.
   */
  getHistory(includeBroadcasts: boolean = false): object[] {
    try {
      let result: object[] = [];
      result.push(this.storage[this.messageChannel.name] ?? {});
      if (includeBroadcasts) {
        result.push(this.storage[this.globalChannel.name] ?? {});
      }
      return result;
    } catch (error) {
      console.error("Error getting history:", error);
      throw new CrossTabCommunicationError("Error getting history");
    }
  }

  /**
   * Closes the communication channel.
   */
  close() {
    try {
      this.messageChannel.close();
    } catch (error) {
      console.error("Error closing channel:", error);
      throw new CrossTabCommunicationError("Error closing channel");
    }
  }

  /**
   * Generates a random channel name.
   * @param length - The length of the random channel name.
   * @returns A random channel name string.
   */
  static generateRandomChannelName(length: number = 6): string {
    return Math.random()
      .toString(20)
      .substring(2, length + 2);
  }
}
