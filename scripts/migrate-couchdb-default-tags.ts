import { db } from './remote-pouch-db-instance';
import { TagModel } from '../src/pouchDB/api/tag';

const buildDefaultCategories = async () => {
  console.log('Saving default tag to couchdb');

  const tag = new TagModel(db);
  const defaultCategories = ['developer-experience', 'testing', 'deployment', 'automation'];

  try {
    tag.createNewTags(defaultCategories);
    console.log('Completed saving default tags to couchdb');
  } catch (error) {
    if (error.status !== 419) {
      // only when its not a conflict error
      console.error(error.message);
    }
  }
};

buildDefaultCategories();
