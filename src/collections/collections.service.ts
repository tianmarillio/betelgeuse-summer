import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    private workspaceService: WorkspacesService,
  ) {}

  async create(userId: string, createCollectionDto: CreateCollectionDto) {
    const { workspaceId } = createCollectionDto;

    // Validations
    await this.findWorkspace(userId, workspaceId);

    const newCollection = this.collectionRepository.create(createCollectionDto);

    return await this.collectionRepository.save(newCollection);
  }

  async findAll(userId: string) {
    return await this.collectionRepository.findBy({
      workspace: {
        userId,
      },
    });
  }

  async findAllByWorkspace(userId: string, workspaceId: string) {
    // Validations
    await this.findWorkspace(userId, workspaceId);

    return await this.collectionRepository.findBy({
      workspaceId,
      workspace: {
        userId,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const collection = await this.collectionRepository.findOneBy({
      id,
      workspace: {
        userId,
      },
    });

    if (!collection) {
      throw new Error('Collection not found');
      // FIXME: handle not found
    }

    return collection;
  }

  // async findOneByWorkspace(userId: string, workspaceId: string, id: string) {
  //   // Validations
  //   await this.findWorkspace(userId, workspaceId);

  //   const collection = await this.collectionRepository.findOneBy({
  //     id,
  //     workspaceId,
  //     workspace: {
  //       userId,
  //     },
  //   });

  //   if (!collection) {
  //     throw new Error('Collection not found');
  //     // FIXME: handle not found
  //   }

  //   return collection;
  // }

  async update(
    userId: string,
    id: string,
    updateCollectionDto: UpdateCollectionDto,
  ) {
    // Validations
    if (updateCollectionDto.workspaceId) {
      await this.findWorkspace(userId, updateCollectionDto.workspaceId);
    }
    await this.findOne(userId, id);

    return await this.collectionRepository.update(
      {
        id,
        // FIXME: fix query with relation validations
        // workspace: {
        //   user: {
        //     id: userId
        //   }
        // },
      },
      updateCollectionDto,
    );
  }

  async remove(userId: string, id: string) {
    // Validations
    await this.findOne(userId, id);

    return await this.collectionRepository.delete({
      id,
      // FIXME: fix query with relation validations
      // workspace: {
      //   user: {
      //     id: userId
      //   }
      // },
    });
  }

  private async findWorkspace(userId: string, workspaceId: string) {
    const workspace = await this.workspaceService.findOne(userId, workspaceId);

    if (!workspace) {
      throw new Error('Workspace not found');
      // FIXME: handle not found
    }
  }
}
