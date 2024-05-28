export const ELEVATOR_COUNT: number = 16;

export const CAR_WIDTH: number = 40;
export const CAR_HEIGHT: number = 40;

export const SHAFT_X_OFFSET: number = 50;
export const SHAFT_WIDTH: number = 50;
export const SHAFT_HEIGHT: number = 300;
export const SHAFT_TOP: number = 50;
export const SHAFT_BOTTOM: number = SHAFT_TOP + SHAFT_HEIGHT - CAR_HEIGHT;
export const SHAFT_SPACING: number = 60;

export const FLOOR_COUNT: number = 5;
export const FLOOR_HEIGHT: number = SHAFT_HEIGHT / FLOOR_COUNT;
export const FLOOR_Y_POSITIONS: number[] = Array.from(
  { length: FLOOR_COUNT },
  (_, i) => SHAFT_TOP + i * FLOOR_HEIGHT
);
export const FLOOR_Y: number = SHAFT_BOTTOM + 10;

export const ACTOR_COUNT: number = 16;
export const ACTOR_WIDTH: number = 10;
export const ACTOR_HEIGHT: number = 10;

export const SLOW_DOWN_FACTOR = 100;