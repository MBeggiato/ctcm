# CrossTabCommunicationManager

[![NPM version](https://img.shields.io/npm/v/ctcm.svg?style=flat)](https://www.npmjs.com/package/ctcm) [![NPM monthly downloads](https://img.shields.io/npm/dm/ctcm.svg?style=flat)](https://npmjs.org/package/ctcm) [![NPM total downloads](https://img.shields.io/npm/dt/ctcm.svg?style=flat)](https://npmjs.org/package/ctcm)

CrossTabCommunicationManager is a TypeScript class that facilitates cross-tab communication using the BroadcastChannel API. It allows you to send messages between different browser tabs or windows that are open on the same origin.

## Features

- **Cross-tab communication**: Send and receive messages between different tabs.
- **Message broadcasting**: Broadcast messages to all tabs.
- **Message history**: Keep track of sent messages.
- **Error handling**: Custom error types for better error management.

## Installation

Install the CrossTabCommunicationManager using your desired package manager:

```sh
npm install ctcm
pnpm install ctcm
bun install ctcm
```

## Usage

### Importing the Class

```typescript
import { CrossTabCommunicationManager, CrossTabCommunicationError } from "ctcm";
```

### Creating an Instance

Create an instance of CrossTabCommunicationManager. You can optionally provide a channelId to use a specific channel:

```typescript
const communicationManager = new CrossTabCommunicationManager();
```

### Sending Messages

Send a message to all instances listening on the same channel:

```typescript
communicationManager.sendMessage("Hello, world!");
```

### Broadcasting Messages

Broadcast a message to all instances across all channels:

```typescript
communicationManager.broadcast("This is a broadcast message.");
```

### Receiving Messages

Set a callback to handle incoming messages:

```typescript
communicationManager.onMessage((event: MessageEvent) => {
  console.log("Received message:", event.data);
});
```

### Retrieving Message History

Retrieve the message history, optionally including broadcast messages:

```typescript
const history = communicationManager.getHistory(true);
console.log("Message history:", history);
```

### Closing the Communication Channel

Close the communication channel when it's no longer needed:

```typescript
communicationManager.close();
```

# Changelog

## [0.0.7] - 2024-08-05

### Fixed

- Fixed wrong import instructions in readme

## [0.0.6] - 2024-08-05

### Added

- Added repository to `package.json`

## [0.0.5] - 2024-08-05

### Added

- Added a changelog 🥳

### Removed

- Removed changeset dependency

## [0.0.4] - 2024-08-05

⚠️ This release contains breaking changes! ⚠️

### Added

- Added documentation to the code. 📝

### Changed

- ⚠️ Changed main class name from `BroadcastService` to `CrossTabCommunicationManager` ⚠️

## [0.0.3] - Deprecated ❗

This version is deprecated and should not be used.

## [0.0.2] - Deprecated ❗

This version is deprecated and should not be used.

# License

This project is licensed under the MIT License.
