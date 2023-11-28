import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { RequestUser } from 'src/auth/auth.interface';

@Controller('workspaces')
@UseGuards(AuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(
    @User() user: RequestUser,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return await this.workspacesService.create(user.id, createWorkspaceDto);
  }

  @Get()
  async findAll(@User() user: RequestUser) {
    return await this.workspacesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@User() user: RequestUser, @Param('id') id: string) {
    return await this.workspacesService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return await this.workspacesService.update(user.id, id, updateWorkspaceDto);
  }

  @Delete(':id')
  async remove(@User() user: RequestUser, @Param('id') id: string) {
    return await this.workspacesService.remove(user.id, id);
  }
}
