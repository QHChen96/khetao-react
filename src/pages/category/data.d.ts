import { UploadFile } from 'antd/lib/upload/interface';

export interface Category {
  id: number | string;
  cateName: string;
  imageFiles?: UploadFile[];
  icon?: string;
  i18n?: string;
  level: number;
  parentId: number | string;
  parentIds?: string;
  priority: number;
  children?: Category[];
  parents?: Category[];
}

export interface ImageFile extends Partial<UploadFile> {
  uid: string;
  name: string;
  url: string;
  size: number;
}

export interface CategoryListData {
  list: Category[];
}

export interface CategoryListParams {}
