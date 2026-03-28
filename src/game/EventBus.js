import Phaser from 'phaser';

// Singleton event emitter for React <-> Phaser communication
const EventBus = new Phaser.Events.EventEmitter();

export default EventBus;
