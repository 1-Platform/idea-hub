import { DesignDocument } from './types';

const designDocuments: PouchDB.Core.PutDocument<DesignDocument>[] = [
  {
    _id: '_design/votes',
    views: {
      'idea-votes': {
        map: `function (doc) {
            if (doc.type === 'vote') {
                  emit(doc.ideaId);
              }
        }`,
        reduce: `_count`,
      },
    },
    validate_doc_update: `function (newDoc, oldDoc, userCtx, secObj) {
      if (newDoc.type === 'idea' || newDoc.type === 'comment') {
        if (userCtx.roles.indexOf(newDoc.authorId) !== -1) {
          return;
        } else {
          throw { forbidden: 'Unauthorized access' };
        }
      }
      if (newDoc.type === 'like' || newDoc.type === 'vote') {
        var idSplittedByColor = newDoc._id.split(':');
        var rhatUUID = idSplittedByColor[idSplittedByColor.length - 1];

         if (userCtx.roles.indexOf(rhatUUID) !== -1) {
           return;
         } else {
           throw { forbidden: 'Unauthorized access' };
         }
      }

      if(newDoc.type === 'tag' && newDoc._deleted === true){
        if (userCtx.roles.indexOf('_admin') !== -1) {
          return;
        } else {
          throw { forbidden: 'Unauthorized access' };
        }
      }
    }`,
    version: 0.1,
  },
  {
    _id: '_design/tags',
    views: {
      'tags-count': {
        map: `function (doc) {
            if (doc.type === 'idea') {
              doc.tags.forEach(function(tag) {
                emit(tag)
              });
              }
        }`,
        reduce: `_count`,
      },
    },
    version: 0.1,
  },
  {
    _id: '_design/comments',
    views: {
      'idea-comments': {
        map: `function (doc) {
            if (doc.type === 'comment') {
              emit(doc.ideaId);
            }
        }`,
        reduce: `_count`,
      },
    },
    version: 0.1,
  },
  {
    _id: '_design/likes',
    views: {
      'comment-likes': {
        map: `function (doc) {
            if (doc.type === 'like') {
              emit(doc.commentId);
            }
        }`,
        reduce: `_count`,
      },
    },
    version: 0.1,
  },
  {
    _id: '_design/filters',
    filters: {
      homepage: `function (doc, req) {
        if(doc.type === 'comment'){
          return false
        }
        return true
      }`,
      ideaDetailPage: `function (doc, req) {
        if(doc.type === 'idea' && doc.ideaId === req.query.ideaId){
          return true;
        } else if(doc.type === 'comment' && doc.ideaId === req.query.ideaId){
          return true;
        }
        return false;
      }`,
      replication: `function (doc, req) {
         return doc._id.indexOf('_design') !== 0;
      }`,
    },
    version: 0.1,
  },
];

export const pouchDBDesignDocCreator = async (db: PouchDB.Database): Promise<void> => {
  await Promise.all(
    designDocuments.map(async (designDocument) => {
      try {
        await db.put(designDocument);
      } catch (error) {
        if (error.status === 409) {
          const existingOneId = error.docId;
          const exisitingDesignDoc = await db.get<{ version: number }>(existingOneId);
          if (exisitingDesignDoc?.version < designDocument.version) {
            designDocument._rev = exisitingDesignDoc._rev;
            await db.put(designDocument);
          }
        } else {
          console.error(error);
        }
      }
    })
  );
};
