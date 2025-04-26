
export class ProfileGenerator {
    static randomAvatar(): string {
      const gender = Math.random() < 0.5 ? 'men' : 'women'; // randomly choose gender
      const number = Math.floor(Math.random() * 100); // 0 to 99
      return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
    }
  
    static randomBio(): string {
      const bios = [
        "Explorer of the unknown 🌎",
        "Passionate about cultures and cuisines 🍜",
        "Wandering spirit with a love for adventure 🧭",
        "Chasing sunsets around the world 🌅",
        "Stamp collector and memory maker ✉️",
        "Life's a journey, not a destination ✈️",
        "Mapping memories one trip at a time 🗺️",
        "From city streets to mountain peaks 🏔️",
      ];
      const index = Math.floor(Math.random() * bios.length);
      return bios[index];
    }
  
    static randomDate(start: Date = new Date(2020, 0, 1), end: Date = new Date()): string {
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return date.toISOString().split('T')[0]; // format "YYYY-MM-DD"
    }
  }
  