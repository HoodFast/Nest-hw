import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Posts } from '../../posts/domain/post.sql.entity';

@Entity()
export class Blogs extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: Date;
  @Column({ nullable: true })
  isMembership: boolean;
  @OneToMany(() => Posts, (Posts) => Posts.blog, {
    cascade: true,
    nullable: true,
  })
  post: Posts[];
}