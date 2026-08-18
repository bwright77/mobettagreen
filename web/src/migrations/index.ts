import * as migration_20260818_220453_initial from './20260818_220453_initial';

export const migrations = [
  {
    up: migration_20260818_220453_initial.up,
    down: migration_20260818_220453_initial.down,
    name: '20260818_220453_initial'
  },
];
