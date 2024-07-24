import { Category } from './mockedApi';

export interface MappedCategory {
  name: string;
  id: number;
  image: string;
  order: number;
  children: MappedCategory[];
  showOnHome: boolean;
}

const SHOW_ON_HOME_CATEGORIES_THRESHOLD = 5;
const MAX_TOP_LEVEL_DISPLAY_COUNT = 3;
const SHOW_ON_HOME_TITLE_INDICATOR = '#';

/**
 * Gets the order value from a Category entry.
 * If the title is not a number, it returns the entry id.
 * @param {Category} entry - The category entry.
 * @returns {number} - The order number.
 */
export const getOrderFromEntry = (entry: Category): number => {
  const order = parseInt(entry.Title, 10);

  return isNaN(order) ? entry.id : order;
};

/**
 * Sorts an array of MappedCategory by the order property.
 * @param {MappedCategory[]} categories - The array of categories to sort.
 * @returns {MappedCategory[]} - The sorted array of categories.
 */
export const sortCategories = (
  categories: MappedCategory[]
): MappedCategory[] => {
  return categories.sort((a, b) => {
    if (!a.order) return -1;
    if (!b.order) return 1;

    return a.order - b.order;
  });
};

/**
 * Converts an array of Category objects to a tree of MappedCategory objects.
 * @param {Category[] | undefined} data - The array of category data.
 * @param {boolean} [isTopLevelCategory=true] - Flag to indicate if the current level is top level.
 * @returns {MappedCategory[]} - The array of mapped categories.
 */
export const categoryTree = (
  data: Category[] | undefined,
  isTopLevelCategory = true
): MappedCategory[] => {
  if (!data) {
    return [];
  }

  const mappedCategories: MappedCategory[] = [];

  for (const [index, entry] of data.entries()) {
    const isShowOnHome = isTopLevelCategory
      ? data.length < SHOW_ON_HOME_CATEGORIES_THRESHOLD ||
        entry.Title.includes(SHOW_ON_HOME_TITLE_INDICATOR) ||
        index < MAX_TOP_LEVEL_DISPLAY_COUNT
      : false;

    const mappedCategory: MappedCategory = {
      children: entry.hasChildren ? categoryTree(entry.children, false) : [],
      image: entry.MetaTagDescription,
      showOnHome: isShowOnHome,
      id: entry.id,
      name: entry.name,
      order: getOrderFromEntry(entry),
    };

    mappedCategories.push(mappedCategory);
  }

  return sortCategories(mappedCategories);
};
