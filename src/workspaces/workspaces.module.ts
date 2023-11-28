import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Workspace } from './entities/workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  imports: [TypeOrmModule.forFeature([Workspace]), AuthModule],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
