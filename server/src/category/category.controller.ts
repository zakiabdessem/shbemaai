import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dtos/category_create.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    try {
      return this.categoryService.findAll();
    } catch (error) {
      throw error;
    }
  }
}
