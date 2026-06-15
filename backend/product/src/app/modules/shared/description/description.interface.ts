/**
 * Each description item: title + description text.
 * Order preserved as user provides.
 */
export interface IDescriptionItem {
  title: string;
  des: string;
}

/**
 * Description block: array of {title, des} + optional picture.
 * Structure: { [{title, des}], pic }
 */
export interface IDescriptionBlock {
  items: IDescriptionItem[];
  pic?: string;
}

/**
 * Phone description - array of blocks.
 * User controls order; displayed in the same sequence provided.
 */
export type IDescription = IDescriptionBlock[];
