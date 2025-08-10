import { Principle } from '@/types';
import { principles } from '@/data/principles';

/**
 * Legacy helper functions - now deprecated after migration to JSON translations
 * These functions are maintained for backward compatibility but should use
 * the new message key approach with useTranslations and useMessages hooks.
 */

/**
 * Get a principle by ID
 */
export function getPrincipleById(id: number): Principle | undefined {
  return principles.find(p => p.id === id);
}

/**
 * Get all principles
 */
export function getAllPrinciples(): Principle[] {
  return principles;
}

/**
 * Get principles by stage
 */
export function getPrinciplesByStage(stage: number): Principle[] {
  return principles.filter(p => p.stage === stage);
}

/**
 * Check if a principle exists
 */
export function principleExists(id: number): boolean {
  return principles.some(p => p.id === id);
}