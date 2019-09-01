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