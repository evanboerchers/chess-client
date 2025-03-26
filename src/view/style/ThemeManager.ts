export interface Theme {
  name: string;
  board: BoardTheme;
  ui: UITheme;
}

export interface BoardTheme {
  lightSquareColour: number;
  darkSquareColour: number;
  highlightColour: number;
  previousMoveColour: number;
  attackColour: number;
  moveColour: number;
}

export interface UITheme {
  sidebarColour: number;
  bannerColour: number;
  button: {
    default: {
      stroke: number;
      fill: number;
    };
    active: {
      stroke: number;
      fill: number;
    };
  };
}

const defaultTheme: Theme = {
  name: 'default',
  board: {
    lightSquareColour: 0xf0d9b5,
    darkSquareColour: 0xb58863,
    previousMoveColour: 0x4A90E2, 
    highlightColour: 0x64CBFF,
    attackColour: 0xff0000,
    moveColour: 0x00ff00,
  },
  ui: {
    sidebarColour: 0x2B2B2B ,
    bannerColour: 0x222222,
    button: {
      default: {
        stroke: 0x113255,
        fill: 0x1F5A98,
      },
      active: {
        stroke: 0x1F5A98,
        fill: 0x64CBFF,
      },
    },
  },
};

export class ThemeManager {
  private themes: Theme[] = [defaultTheme];
  private currentTheme: Theme = defaultTheme;

  public addTheme(theme: Theme): void {
    this.themes.push(theme);
  }

  public setTheme(themeName: string): void {
    const theme = this.themes.find((theme) => theme.name === themeName);
    if (theme) {
      this.currentTheme = theme;
    } else {
      console.error(`Theme ${themeName} not found`);
    }
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }
}

export default new ThemeManager();
