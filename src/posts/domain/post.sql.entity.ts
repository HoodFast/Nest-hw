import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Users } from '../../users/domain/user.sql.entity';
export enum likesStatuses {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}
@Entity()
export class Post extends BaseEntity {
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
  @ManyToOne(() => Users, (Users) => Users.id, {
    onDelete: 'CASCADE',
  })
  user: string;
  @OneToMany(() => LikePost, (LikePost) => LikePost.user, {
    cascade: true,
    nullable: true,
  })
  likePost: LikePost[];
  @Column()
  createdAt: Date;
}

@Entity()
export class LikePost extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column()
  login: string;
  @ManyToOne(() => Users, (Users) => Users.id, {
    onDelete: 'CASCADE',
  })
  user: string;
  @ManyToOne(() => Post, (Post) => Post.id, {
    onDelete: 'CASCADE',
  })
  post: string;
  @Column({ type: 'enum', enum: likesStatuses, default: likesStatuses.none })
  likesStatus: likesStatuses;
}
