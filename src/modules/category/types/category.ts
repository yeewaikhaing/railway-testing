import { Category } from "../entities/category.entity";

export type CreateCategoryInput = {

    name: string
    parent?: Category
    is_disabled?: boolean
   
  }
  export type UpdateCategoryInput = Partial<CreateCategoryInput>