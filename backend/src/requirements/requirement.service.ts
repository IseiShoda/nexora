import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class RequirementService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Enregistre une nouvelle exigence pour un projet.
   */
  async addRequirement(
    project: string,
    requirement: string,
  ) {
    const normalizedProject = project.trim();
    const normalizedRequirement = requirement.trim();

    if (
      !normalizedProject ||
      !normalizedRequirement
    ) {
      return null;
    }

    const existing =
      await this.prisma.projectRequirement.findUnique({
        where: {
          project_requirement: {
            project: normalizedProject,
            requirement: normalizedRequirement,
          },
        },
      });

    if (existing) {
      return existing;
    }

    return this.prisma.projectRequirement.create({
      data: {
        project: normalizedProject,
        requirement: normalizedRequirement,
      },
    });
  }

  /**
   * Récupère toutes les exigences actives
   * d'un projet.
   */
  async getRequirements(
    project: string,
  ) {
    const normalizedProject = project.trim();

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

  /**
   * Vérifie si une exigence existe déjà
   * pour un projet.
   */
  async requirementExists(
    project: string,
    requirement: string,
  ) {
    const normalizedProject = project.trim();
    const normalizedRequirement = requirement.trim();

    if (
      !normalizedProject ||
      !normalizedRequirement
    ) {
      return false;
    }

    const existing =
      await this.prisma.projectRequirement.findUnique({
        where: {
          project_requirement: {
            project: normalizedProject,
            requirement: normalizedRequirement,
          },
        },
      });

    return !!existing;
  }

  /**
   * Compte le nombre d'exigences actives
   * d'un projet.
   */
  async countRequirements(
    project: string,
  ) {
    const normalizedProject = project.trim();

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
}