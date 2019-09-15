import { UploadFile } from "antd/lib/upload/interface";

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
  id?: number ;
  cateName: string | undefined;
  level: number;
  i18n: string | undefined;
  parentId: number | string;
  children?: CustomCategory[];
  priority: number;
  imageUrls: UploadFile[];
}