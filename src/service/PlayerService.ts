import { PlayerData } from './server.types';

class PlayerService {
  data: PlayerData;

  constructor() {
    this.data = {
      name: this.generateRandomName(),
      icon: this.getRandomIcon(),
    };
  }

  generateRandomName(): string {
    return `player${Math.floor(Math.random() * 100000)}`;
  }

  getRandomIcon(): string {
    return `profile${Math.floor(Math.random() * 10) + 1}`;
  }

  setIcon(texture: string) {
    this.data.icon = texture;
  }

  getIcon() {
    return this.data.icon;
  }

  getName() {
    return this.data.name;
  }

  setName(name: string) {
    this.data.name = name;
  }

  getData(): PlayerData {
    return this.data;
  }
}

const playerService = new PlayerService();
export default playerService;
