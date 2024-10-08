import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

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
}
