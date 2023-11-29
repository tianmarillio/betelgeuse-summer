import { IsNotEmpty, IsString } from 'class-validator';

export class QueryFindAllCollections {
  @IsString()
  @IsNotEmpty()
  workspaceId: string;
}
