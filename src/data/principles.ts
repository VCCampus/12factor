import { Principle, Stage } from '@/types';

export const principles: Principle[] = [
  // Stage 1: Prepare
  {
    id: 1,
    stage: 1,
    messageKey: 'principle1'
  },
  {
    id: 2,
    stage: 1,
    messageKey: 'principle2'
  },
  {
    id: 3,
    stage: 1,
    messageKey: 'principle3'
  },
  // Stage 2: Execute
  {
    id: 4,
    stage: 2,
    messageKey: 'principle4'
  },
  {
    id: 5,
    stage: 2,
    messageKey: 'principle5'
  },
  {
    id: 6,
    stage: 2,
    messageKey: 'principle6'
  },
  // Stage 3: Collaborate
  {
    id: 7,
    stage: 3,
    messageKey: 'principle7'
  },
  {
    id: 8,
    stage: 3,
    messageKey: 'principle8'
  },
  {
    id: 9,
    stage: 3,
    messageKey: 'principle9'
  },
  // Stage 4: Iterate
  {
    id: 10,
    stage: 4,
    messageKey: 'principle10'
  },
  {
    id: 11,
    stage: 4,
    messageKey: 'principle11'
  },
  {
    id: 12,
    stage: 4,
    messageKey: 'principle12'
  }
];

export const stages: Stage[] = [
  {
    id: 1,
    messageKey: 'stages.stage1',
    principles: [1, 2, 3]
  },
  {
    id: 2,
    messageKey: 'stages.stage2',
    principles: [4, 5, 6]
  },
  {
    id: 3,
    messageKey: 'stages.stage3',
    principles: [7, 8, 9]
  },
  {
    id: 4,
    messageKey: 'stages.stage4',
    principles: [10, 11, 12]
  }
];