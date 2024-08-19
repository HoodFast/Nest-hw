import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Column, Entity, PrimaryGeneratedColumn, DataSource } from 'typeorm';

class CreateUserDto {
  firstName: string;
  lastName: string;
}
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAll(): Promise<any> {
    const result = await this.dataSource.query(`
    SELECT id, "Login"
        FROM public."Users";`);
    return result;
  }
}
