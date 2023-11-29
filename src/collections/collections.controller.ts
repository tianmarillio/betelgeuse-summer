import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { User } from 'src/auth/auth.decorator';
import { RequestUser } from 'src/auth/auth.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { QueryFindAllCollections } from './dto/query-find-all-collections.dto';

@Controller('collections')
@UseGuards(AuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async create(
    @User() user: RequestUser,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    return await this.collectionsService.create(user.id, createCollectionDto);
  }

  @Get()
  async findAll(
    @User() user: RequestUser,
    @Query() query: QueryFindAllCollections
  ) {
    return await this.collectionsService.findAllByWorkspace(
      user.id,
      query.workspaceId,
    );
  }

  @Get(':id')
  async findOne(@User() user: RequestUser, @Param('id') id: string) {
    return await this.collectionsService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return await this.collectionsService.update(
      user.id,
      id,
      updateCollectionDto,
    );
  }

  @Delete(':id')
  async remove(@User() user: RequestUser, @Param('id') id: string) {
    return await this.collectionsService.remove(user.id, id);
  }
}
