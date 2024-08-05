export class CrossTabCommunicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CrossTabCommunicationError";
  }
}
