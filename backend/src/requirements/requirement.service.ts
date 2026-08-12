import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class RequirementService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /*
   * =========================================================
   * ADD REQUIREMENT
   * =========================================================
   */
  async addRequirement(
    project: string,
    requirement: string,
  ): Promise<{
    requirement: any;
    created: boolean;
  } | null> {
    const normalizedProject =
      project.trim();

    const normalizedRequirement =
      requirement.trim();

    if (
      !normalizedProject ||
      !normalizedRequirement
    ) {
      return null;
    }

    /*
     * =======================================================
     * DUPLICATE DETECTION
     * =======================================================
     */

    const requirementKey =
      this.normalizeRequirementKey(
        normalizedRequirement,
      );

    const existingRequirements =
      await this.prisma.projectRequirement.findMany({
        where: {
          project: normalizedProject,
          active: true,
        },
      });

    const existing =
      existingRequirements.find(
        (item) =>
          this.normalizeRequirementKey(
            item.requirement,
          ) === requirementKey,
      );

    /*
     * =======================================================
     * EXISTING REQUIREMENT
     * =======================================================
     */

    if (existing) {
      console.log(
        '[REQUIREMENT EXISTING]',
        {
          project: normalizedProject,
          requirement: normalizedRequirement,
        },
      );

      return {
        requirement: existing,
        created: false,
      };
    }

    /*
     * =======================================================
     * CREATE REQUIREMENT
     * =======================================================
     *
     * IMPORTANT :
     * Ce log nous permet de vérifier exactement
     * quand Prisma reçoit une nouvelle exigence.
     */

    console.log(
      '[REQUIREMENT CREATE]',
      {
        project: normalizedProject,
        requirement: normalizedRequirement,
      },
    );

    const created =
      await this.prisma.projectRequirement.create({
        data: {
          project: normalizedProject,
          requirement: normalizedRequirement,
        },
      });

    console.log(
      '[REQUIREMENT CREATED]',
      {
        id: created.id,
        project: created.project,
        requirement: created.requirement,
      },
    );

    return {
      requirement: created,
      created: true,
    };
  }

  /*
   * =========================================================
   * GET REQUIREMENTS
   * =========================================================
   */

  async getRequirements(
    project: string,
  ) {
    const normalizedProject =
      project.trim();

    if (!normalizedProject) {
      return [];
    }

    return this.prisma.projectRequirement.findMany({
      where: {
        project: normalizedProject,
        active: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /*
   * =========================================================
   * REQUIREMENT EXISTS
   * =========================================================
   */

  async requirementExists(
    project: string,
    requirement: string,
  ) {
    const normalizedProject =
      project.trim();

    const normalizedRequirement =
      requirement.trim();

    if (
      !normalizedProject ||
      !normalizedRequirement
    ) {
      return false;
    }

    const requirementKey =
      this.normalizeRequirementKey(
        normalizedRequirement,
      );

    const existingRequirements =
      await this.prisma.projectRequirement.findMany({
        where: {
          project: normalizedProject,
          active: true,
        },
      });

    return existingRequirements.some(
      (item) =>
        this.normalizeRequirementKey(
          item.requirement,
        ) === requirementKey,
    );
  }

  /*
   * =========================================================
   * COUNT REQUIREMENTS
   * =========================================================
   */

  async countRequirements(
    project: string,
  ) {
    const normalizedProject =
      project.trim();

    if (!normalizedProject) {
      return 0;
    }

    return this.prisma.projectRequirement.count({
      where: {
        project: normalizedProject,
        active: true,
      },
    });
  }

  /*
   * =========================================================
   * REQUIREMENT NORMALIZATION
   * =========================================================
   */

  private normalizeRequirementKey(
    requirement: string,
  ): string {
    let normalized =
      requirement
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.!?,;:]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    /*
     * Retire les débuts de phrase.
     */

    normalized = normalized.replace(
      /^(et\s+)?(il|elle|le systeme|la plateforme)\s+/,
      '',
    );

    /*
     * Retire un éventuel "et" restant.
     */

    normalized = normalized.replace(
      /^et\s+/,
      '',
    );

    return normalized.trim();
  }
}