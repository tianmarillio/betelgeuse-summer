import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CollectionsService } from 'src/collections/collections.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    private collectionService: CollectionsService,
  ) {}

  async create(userId: string, createArticleDto: CreateArticleDto) {
    await this.findCollection(userId, createArticleDto.collectionId);

    const newArticle = this.articleRepository.create(createArticleDto);
    return await this.articleRepository.save(newArticle);
  }

  async findAllByCollection(
    userId: string,
    collectionId: string,
  ): Promise<Article[]> {
    await this.findCollection(userId, collectionId);

    return await this.articleRepository.findBy({
      collectionId,
      collection: {
        workspace: {
          userId,
        },
      },
    });
  }

  async findOne(userId: string, id: string): Promise<Article> {
    const article = await this.articleRepository.findOneBy({
      id,
      collection: {
        workspace: {
          userId,
        },
      },
    });

    if (!article) {
      // FIXME:
      throw new Error('article not found');
    }

    return article;
  }

  async update(userId: string, id: string, updateArticleDto: UpdateArticleDto) {
    await this.findOne(userId, id);
    if (updateArticleDto.collectionId) {
      await this.findCollection(userId, updateArticleDto.collectionId);
    }

    return await this.articleRepository.update({ id }, updateArticleDto);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return await this.articleRepository.delete({ id });
  }

  private async findCollection(userId: string, collectionId: string) {
    const collection = await this.collectionService.findOne(
      userId,
      collectionId,
    );

    if (!collection) {
      throw new Error('Collection not found');
      // FIXME: handle not found
    }

    return collection;
  }
}
