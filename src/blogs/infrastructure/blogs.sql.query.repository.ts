import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogSortData } from '../../base/sortData/sortData.model';
import { blogMapper } from '../domain/blog.mapper';

@Injectable()
export class UsersSqlQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAllBlogs(sortData: BlogSortData) {
    try {
      const { sortBy, sortDirection, searchNameTerm, pageSize, pageNumber } =
        sortData;
      const offset = (pageNumber - 1) * pageSize;
      const res = await this.dataSource.query(
        `
    SELECT b."id",
      b."name",
      b."description",
      b."websiteUrl",
      b."createdAt",
      b."isMembership",
      
        FROM public."blogs" b
        WHERE u."name" like $1 
        ORDER BY u."${sortBy}" ${sortDirection}
        LIMIT $2 OFFSET $3
    `,
        ['%' + searchNameTerm + '%', pageSize, offset],
      );
      if (!res || res.length === 0) {
        return null;
      }
      const totalCount = await this.dataSource.query(
        `
        SELECT COUNT("id")
        FROM public."blogs" b
        WHERE b."name" like $1 
        `,
        ['%' + searchNameTerm + '%'],
      );
      const pagesCount = Math.ceil(+totalCount[0].count / pageSize);
      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: res.map(blogMapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
