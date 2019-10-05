import { UploadFile } from 'antd/lib/upload/interface';

export interface Shop {
  id?: number;
  shopName: string;
  website: string;
  cateName: string;
  status: number;
  isDel: number;
  logo: string;
}

export interface CustomCategory {
  id: number | string;
  cateName: string;
  imageFiles?: UploadFile[];
  icon?: string;
  i18n?: string;
  level: number;
  parentId: number | string;
  parentIds?: string;
  priority: number;
  children?: CustomCategory[];
  parents?: CustomCategory[];
  shopId?: number | string;
}

export interface CustomCategoryListData {
  list: CustomCategory[];
}

export interface CustomCategoryListParams {}
