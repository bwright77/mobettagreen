import * as migration_20260818_220453_initial from './20260818_220453_initial';
import * as migration_20260908_000000_enable_rls from './20260908_000000_enable_rls';

export const migrations = [
  {
    up: migration_20260818_220453_initial.up,
    down: migration_20260818_220453_initial.down,
    name: '20260818_220453_initial'
  },
  {
    up: migration_20260908_000000_enable_rls.up,
    down: migration_20260908_000000_enable_rls.down,
    name: '20260908_000000_enable_rls'
  },
];
