export const LEVELS = [
  {
    playerStart: { x: 30, y: 320 },
    platforms: [
      { x: 0, y: 400, width: 800, height: 50 },
      { x: 180, y: 340, width: 120, height: 20 },
      { x: 350, y: 270, width: 100, height: 20 },
      { x: 550, y: 320, width: 120, height: 20 },
      { x: 700, y: 240, width: 80, height: 20 },
    ],
    collectibles: [
      { x: 230, y: 310, type: 'fish' },
      { x: 410, y: 240, type: 'fish' },
      { x: 580, y: 290, type: 'fish' },
      { x: 720, y: 210, type: 'gold_fish' },
    ],
    enemies: [
      { x: 380, y: 220, minX: 340, maxX: 700, speed: 80 },
    ],
    obstacles: [
      { type: 'chimney', x: 120, y: 360, width: 40, height: 40 },
      {
        type: 'waterJet',
        x: 460,
        y: 360,
        width: 40,
        height: 40,
        activeDuration: 0.5,
        interval: 0.8,
      },
    ],
    goal: { x: 760, y: 330, width: 30, height: 70 },
  },
  {
    playerStart: { x: 30, y: 320 },
    platforms: [
      { x: 0, y: 400, width: 220, height: 50 },
      { x: 280, y: 360, width: 120, height: 20 },
      { x: 460, y: 320, width: 120, height: 20 },
      { x: 620, y: 280, width: 120, height: 20 },
      { x: 720, y: 240, width: 80, height: 20 },
    ],
    collectibles: [
      { x: 80, y: 360, type: 'fish' },
      { x: 310, y: 330, type: 'fish' },
      { x: 490, y: 290, type: 'fish' },
      { x: 650, y: 250, type: 'fish' },
      { x: 730, y: 210, type: 'gold_fish' },
    ],
    enemies: [
      { x: 290, y: 280, minX: 180, maxX: 435, speed: 90 },
      { x: 630, y: 240, minX: 450, maxX: 720, speed: 100 },
    ],
    obstacles: [
      {
        type: 'waterJet',
        x: 180,
        y: 360,
        width: 40,
        height: 40,
        activeDuration: 0.6,
        interval: 1.0,
      },
    ],
    goal: { x: 770, y: 170, width: 30, height: 70 },
  },
];
