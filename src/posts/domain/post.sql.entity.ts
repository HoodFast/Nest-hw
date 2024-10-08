import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LikePost } from './likePost.sql.entity';
export enum likesStatuses {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}
@Entity()
export class Posts extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @Column()
  blogId: string;
  @Column()
  blogName: string;
  @OneToMany(() => LikePost, (LikePost) => LikePost.post, {
    cascade: true,
    nullable: true,
  })
  postLikes: LikePost[];
  @Column()
  createdAt: Date;
}
