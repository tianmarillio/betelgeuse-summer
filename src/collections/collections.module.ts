import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService],
  imports: [
    TypeOrmModule.forFeature([Collection]),
    AuthModule,
    WorkspacesModule,
  ],
  exports: [CollectionsService],
})
export class CollectionsModule {}
