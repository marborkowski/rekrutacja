import test from 'ava';

import { CORRECT } from '../correctResult';
import { Category, getCategories } from '../mockedApi';
import {
  categoryTree,
  getOrderFromEntry,
  MappedCategory,
  sortCategories,
} from '../task';

test('categoryTree maps categories correctly from API response', async (t) => {
  const results = await getCategories();
  const result = categoryTree(results.data);

  t.deepEqual(result, CORRECT);
});

test('getOrderFromEntry returns numeric order when Title is a number', (t) => {
  const entry: Category = {
    Title: '123',
    id: 1,
    name: 'Cat',
    hasChildren: false,
    url: '',
    MetaTagDescription: '',
    children: [],
  };

  t.is(getOrderFromEntry(entry), 123);
});

test('getOrderFromEntry returns id when Title is not a number', (t) => {
  const entry: Category = {
    Title: 'abc',
    id: 42,
    name: 'Cat',
    hasChildren: false,
    url: '',
    MetaTagDescription: '',
    children: [],
  };

  t.is(getOrderFromEntry(entry), 42);
});

test('getOrderFromEntry returns id when Title is empty', (t) => {
  const entry: Category = {
    Title: '',
    id: 42,
    name: 'Cat',
    hasChildren: false,
    url: '',
    MetaTagDescription: '',
    children: [],
  };

  t.is(getOrderFromEntry(entry), 42);
});

test('sortCategories sorts categories by their order property', (t) => {
  const categories = [
    {
      order: 2,
      id: 1,
      name: 'Cat 1',
      image: '',
      showOnHome: false,
      children: [],
    },
    {
      order: 1,
      id: 2,
      name: 'Cat 2',
      image: '',
      showOnHome: false,
      children: [],
    },
  ];

  const sorted = sortCategories(categories);

  t.deepEqual(sorted, [
    {
      order: 1,
      id: 2,
      name: 'Cat 2',
      image: '',
      showOnHome: false,
      children: [],
    },
    {
      order: 2,
      id: 1,
      name: 'Cat 1',
      image: '',
      showOnHome: false,
      children: [],
    },
  ]);
});

test('categoryTree returns empty array when input data is undefined', (t) => {
  const result = categoryTree(undefined);

  t.deepEqual(result, []);
});

test('categoryTree processes and maps categories without children correctly', (t) => {
  const data: Category[] = [
    {
      id: 1,
      name: 'Cat 1',
      Title: '1',
      MetaTagDescription: 'img1.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
    {
      id: 2,
      name: 'Cat 2',
      Title: '3',
      MetaTagDescription: 'img2.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
  ];

  const expected: MappedCategory[] = [
    {
      id: 1,
      name: 'Cat 1',
      order: 1,
      image: 'img1.jpg',
      showOnHome: true,
      children: [],
    },
    {
      id: 2,
      name: 'Cat 2',
      order: 3,
      image: 'img2.jpg',
      showOnHome: true,
      children: [],
    },
  ];

  const result = categoryTree(data);

  t.deepEqual(result, expected);
});

test('categoryTree sets showOnHome based on visibility threshold', (t) => {
  const data: Category[] = [
    {
      id: 1,
      name: 'Cat 1',
      Title: '1',
      MetaTagDescription: 'img1.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
    {
      id: 2,
      name: 'Cat 2',
      Title: '2',
      MetaTagDescription: 'img2.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
    {
      id: 3,
      name: 'Cat 3',
      Title: '3',
      MetaTagDescription: 'img3.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
    {
      id: 4,
      name: 'Cat 4',
      Title: '4',
      MetaTagDescription: 'img4.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
    {
      id: 5,
      name: 'Cat 5',
      Title: '5',
      MetaTagDescription: 'img5.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
    {
      id: 6,
      name: 'Cat 6',
      Title: '6',
      MetaTagDescription: 'img6.jpg',
      hasChildren: false,
      url: '',
      children: [],
    },
  ];

  const expected: MappedCategory[] = [
    {
      id: 1,
      name: 'Cat 1',
      order: 1,
      image: 'img1.jpg',
      showOnHome: true,
      children: [],
    },
    {
      id: 2,
      name: 'Cat 2',
      order: 2,
      image: 'img2.jpg',
      showOnHome: true,
      children: [],
    },
    {
      id: 3,
      name: 'Cat 3',
      order: 3,
      image: 'img3.jpg',
      showOnHome: true,
      children: [],
    },
    {
      id: 4,
      name: 'Cat 4',
      order: 4,
      image: 'img4.jpg',
      showOnHome: false,
      children: [],
    },
    {
      id: 5,
      name: 'Cat 5',
      order: 5,
      image: 'img5.jpg',
      showOnHome: false,
      children: [],
    },
    {
      id: 6,
      name: 'Cat 6',
      order: 6,
      image: 'img6.jpg',
      showOnHome: false,
      children: [],
    },
  ];

  const result = categoryTree(data);

  t.deepEqual(result, expected);
});

test('categoryTree processes and maps categories with children correctly', (t) => {
  const data: Category[] = [
    {
      id: 1,
      name: 'Parent Cat',
      Title: '1',
      MetaTagDescription: 'parent.jpg',
      hasChildren: true,
      url: '',
      children: [
        {
          id: 2,
          name: 'Child Cat',
          Title: '2',
          MetaTagDescription: 'child.jpg',
          hasChildren: false,
          url: '',
          children: [],
        },
      ],
    },
  ];

  const expected: MappedCategory[] = [
    {
      id: 1,
      name: 'Parent Cat',
      order: 1,
      image: 'parent.jpg',
      showOnHome: true,
      children: [
        {
          id: 2,
          name: 'Child Cat',
          order: 2,
          image: 'child.jpg',
          showOnHome: false,
          children: [],
        },
      ],
    },
  ];

  const result = categoryTree(data);

  t.deepEqual(result, expected);
});
