import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto) {
    const newWorkSpace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      userId: userId,
    });

    return await this.workspaceRepository.save(newWorkSpace);
  }

  async findAll(userId: string) {
    return await this.workspaceRepository.findBy({ userId });
  }

  async findOne(userId: string, id: string) {
    return await this.workspaceRepository.findOneBy({ id, userId });
  }

  async update(
    userId: string,
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return await this.workspaceRepository.update(
      { id, userId },
      updateWorkspaceDto,
    );
  }

  async remove(userId: string, id: string) {
    return await this.workspaceRepository.delete({ id, userId });
  }
}
