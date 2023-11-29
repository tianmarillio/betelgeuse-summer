import { IsNotEmpty, IsString } from 'class-validator';

export class QueryFindAllArticles {
  @IsString()
  @IsNotEmpty()
  collectionId: string;
}
