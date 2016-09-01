import { Injectable } from '@angular/core';

@Injectable()
export class LevelsService {
  levels = [
    {
      level: 0,
      colors: {
        background: '#E4E8D1',
        foreground: '#889456',
        wonBackground: '#2a3304',
        wonForeground: '#CEF824',
      },
      tiles: [
        {
          type: 3,
          row: 2,
          column: 3,
          rotation: 0
        },
        {
          type: 4,
          row: 2,
          column: 4,
          rotation: 3
        },
        {
          type: 3,
          row: 2,
          column: 5,
          rotation: 1
        },
        {
          type: 3,
          row: 3,
          column: 3,
          rotation: 2
        },
        {
          type: 4,
          row: 3,
          column: 4,
          rotation: 0
        },
        {
          type: 3,
          row: 3,
          column: 5,
          rotation: 1
        }
      ]
    },
    {
      level: 1,
      colors: {
        background: '#E4E8D1',
        foreground: '#889456',
        wonBackground: '#2a3304',
        wonForeground: '#CEF824',
      },
      tiles: [
        {
          type: 3,
          row: 2,
          column: 2,
          rotation: 0
        },
        {
          type: 2,
          row: 2,
          column: 3,
          rotation: 0
        },
        {
          type: 4,
          row: 2,
          column: 4,
          rotation: 0
        },
        {
          type: 3,
          row: 2,
          column: 5,
          rotation: 2
        },
        {
          type: 4,
          row: 3,
          column: 2,
          rotation:3
        },
        {
          type: 4,
          row: 3,
          column: 3,
          rotation:0
        },
        {
          type: 4,
          row: 3,
          column: 4,
          rotation:2
        },
        {
          type: 2,
          row: 3,
          column: 5,
          rotation:1
        },
        {
          type: 2,
          row: 4,
          column: 2,
          rotation: 3
        },
        {
          type: 4,
          row: 4,
          column: 3,
          rotation:0
        },
        {
          type: 4,
          row: 4,
          column: 4,
          rotation: 2
        },
        {
          type: 4,
          row: 4,
          column: 5,
          rotation: 0
        },
        {
          type: 3,
          row: 5,
          column: 2,
          rotation: 0
        },
        {
          type: 4,
          row: 5,
          column: 3,
          rotation: 2
        },
        {
          type: 2,
          row: 5,
          column: 4,
          rotation: 1
        },
        {
          type: 3,
          row: 5,
          column: 5,
          rotation: 3
        }

      ]
    }
  ];

  getLevel(i : number) {
    return this.levels[i];
  }

}