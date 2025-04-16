import { CVInformations, CVSkill } from "../../lib/types";

/**
 * Extended version of CVSkill with group property for UI organization
 */
export interface ExtendedCVSkill extends CVSkill {
  group: string;
}

/**
 * Extended version of CVInformations with additional properties for UI purposes
 */
export interface ExtendedCVInformations extends Partial<CVInformations> {
  /**
   * Skills array with group property for UI organization
   * Can be either the full ExtendedCVSkill or a partial version with optional group
   */
  skills?: (Partial<CVSkill> & { group?: string })[];
}
