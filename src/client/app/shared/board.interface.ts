export enum BoardGameMode {
  play = 1,
  winAnimation,
  won,
  design,
  toolbar
}

export interface BoardColors {
  foreground: string;
  background: string;
  wonForeground: string;
  wonBackground: string;
  gridlines: string;
}

export interface BoardMargins {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface BoardData {
  height: number;
  width: number;
  boardMargins: BoardMargins;
  boardColors: BoardColors;
  xTiles: number;
  yTiles: number;
  tileSize: number;
  context: CanvasRenderingContext2D;
  drawGrid: boolean;
  boardGameMode: BoardGameMode;
  startLevel: number;
  dtWinAnimation: number;
}
