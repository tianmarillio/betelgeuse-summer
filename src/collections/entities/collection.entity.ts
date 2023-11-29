import { Article } from 'src/articles/entities/article.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    unique: true,
  })
  @Generated('increment')
  posVal: number;

  @Column()
  workspaceId: string;
  @ManyToOne(() => Workspace, (workspace) => workspace.collections)
  @JoinColumn({ name: 'workspaceId' })
  workspace: Promise<Workspace>;

  @OneToMany(() => Article, (article) => article.collection)
  articles: Article[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
