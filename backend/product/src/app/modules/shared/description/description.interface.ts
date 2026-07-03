export interface IDescriptionItem {
  title: string;
  des: string;
}

export interface IDescription {
  items: IDescriptionItem[];
  images?: {url: string; publicId: string}[];
}
[];
