const designDocuments: PouchDB.Core.PutDocument<{ version: number }>[] = [
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
    },
    version: 0.1,
  },
];

export const pouchDBDesignDocCreator = async (db: PouchDB.Database): Promise<void> => {
  designDocuments.map(async (designDocument) => {
    try {
      const res = await db.put(designDocument);
      console.log(res);
    } catch (error) {
      if (error.status === 409) {
        const existingOneId = error.id;
        const exisitingDesignDoc = await db.get<{ version: number }>(existingOneId);
        if (exisitingDesignDoc?.version < designDocument.version) {
          designDocument._rev = exisitingDesignDoc._rev;
          const res = await db.put(designDocument);
          console.log(res);
        }
      } else {
        throw new Error(error);
      }
    }
  });
};
