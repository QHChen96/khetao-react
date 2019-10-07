import ProductList from './list/index';
export interface Product {
  id?: number;
  prodNo?: string;
  prodName: string;
  summary: string;
  categoryName: string;
  saleType: number;
  status: number;
  saleVolume: number;
  quantity: number;
  artNo: string;
  saleStatus: number;
  price: number;
  picUrl: string;
  picUrls?: string | string[];

  skus?: ProdSku[];
}

export interface ProdSku {
  id?: number;
  key: string;
  score: number;
  price: number | undefined;
  quantity: number | undefined;
  picUrl?: string;
  itemNo: string | undefined;
  propList: SkuProp[];
}

export interface SkuProp {
  prodNameId?: number | string | undefined;
  prodValId?: number | string | undefined;
  propName: string;
  propVal: string;
  score: number;
  key: string;
}

export interface SkuPropName {
  id?: number | string | undefined;
  key: string;
  propName: string;
  score: number;
  propVals: SkuPropVal[];
  propCount: number;
}

export interface SkuPropVal {
  id?: number | string | undefined;
  propId?: number | string | undefined;
  key: string;
  score: number;
  propVal: string;
}

export interface ProductImg {
  id: string;
  url: string;
}
export interface ProductSpu {
  id?: number | string;
  productName: string | undefined;
  productDesc?: string | undefined;
  images: string[] | undefined;
  vedios?: string[] | undefined;
  price: number | undefined;
  stock: number | undefined;
  weight: number | undefined;
  categoryPath: number[] | string[];
  shopCatePath: number[] | string[];
  skuProps: ProductSkuProp[] | undefined;
  skus: ProductSku[] | undefined;
  dimension: ProductDimension | undefined;
  skuCode: string | undefined;
  brand?: string;
  status: number | string | undefined;
  preOrder: boolean;
  daysToShip?: number;
  condition: number;
  attributeModel?: ProductAttribute;
  title: string | undefined;
  keyword: string | undefined;
  description: string | undefined;
  wholesales: ProductWholesale[] | undefined;
  useWholesale: boolean; // 是否批发
}

export interface ProductSkuProp {
  id?: string | number;
  key?: string | number;
  images?: string[] | undefined;
  propName?: string | undefined;
  propValues?: ProductSkuPropValue[] | undefined;
  isError?: boolean;
}

export interface ProductSkuPropValue {
  id?: string | number;
  key?: string | number;
  value?: string;
  isError?: boolean;
}

export interface ProductSku {
  id?: number | string;
  key?: number | string;
  skuCode?: string;
  price?: number | string;
  stock?: number | string;
  skuName?: string;
  propValues?: ProductSkuPropValue[];
}

export interface ProductDimension {
  width?: number | string;
  length?: number | string;
  height?: number | string;
}
export interface ProductWholesale {
  min?: number | string;
  price?: number | string;
  max?: number | string;
}

export interface ProductAttributeModel {
  id?: number | string;
  attributes: ProductAttribute[];
}
export interface ProductAttribute {
  id?: number | string;
  status: number;
  value: string;
}

export interface CategoryModel {
  id?: number | string;
  attributes: CategoryAttribute[];
}
export interface CategoryAttribute {
  id?: number | string;
  categoryModelId: number;
  values: string[];
}
