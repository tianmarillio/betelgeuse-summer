import { Collection } from 'src/collections/entities/collection.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  progress: string;

  @Column({
    unique: true,
  })
  @Generated('increment')
  posVal: number;

  @Column()
  collectionId: string;
  @ManyToOne(() => Collection, (collection) => collection.articles)
  @JoinColumn({ name: 'collectionId' })
  collection: Collection;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
