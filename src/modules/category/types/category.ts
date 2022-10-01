import { Category } from "../entities/category.entity";

export type CreateCategoryInput = {

    name: string
    parent_id?: string
    is_disabled?: boolean
   
  }
  export type UpdateCategoryInput = Partial<CreateCategoryInput>