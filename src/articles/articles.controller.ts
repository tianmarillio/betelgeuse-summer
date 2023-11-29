import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { RequestUser } from 'src/auth/auth.interface';
import { QueryFindAllArticles } from './dto/query-find-all-articles.dto';

@Controller('articles')
@UseGuards(AuthGuard)
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Post()
  async create(
    @User() user: RequestUser,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    console.log(createArticleDto)
    return await this.articleService.create(user.id, createArticleDto);
  }

  @Get()
  async findAll(
    @User() user: RequestUser,
    @Query() query: QueryFindAllArticles
  ) {
    return await this.articleService.findAllByCollection(user.id, query.collectionId);
  }

  @Get(':id')
  async findOne(@User() user: RequestUser, @Param('id') id: string) {
    return await this.articleService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleService.update(user.id, id, updateArticleDto);
  }

  @Delete(':id')
  async remove(@User() user: RequestUser, @Param('id') id: string) {
    return await this.articleService.remove(user.id, id);
  }
}
