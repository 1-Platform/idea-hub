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
      // utility functions
      function isRequired(field, message) {
        message = message || 'Document must have a ' + field;
        if (!newDoc.hasOwnProperty(field)) throw { forbidden: message };
      }

      function validate(beTrue, message) {
        if (!beTrue) throw { forbidden: message };
      }

      function unchanged(field) {
        if (oldDoc && toJSON(oldDoc[field]) != toJSON(newDoc[field]))
          throw { forbidden: "Field can't be changed: " + field };
      }

      // role functions
      function isUser(rhatUUID) {
        return userCtx.roles.indexOf('user:' + rhatUUID) !== -1;
      }

      function isAdmin() {
        return userCtx.roles.indexOf('_admin') !== -1
      }

      // global validation
      unchanged('createdAt');
      // idea validation
      if (newDoc.type === 'idea') {
        var docFields = [
          'author',
          'title',
          'description',
          'tags',
          'authorId',
          'votes',
          'comments',
          'createdAt',
          'updatedAt',
          'ideaId',
        ];
        
        for (var fieldIndex = 0; fieldIndex < docFields.length; fieldIndex++) {
          isRequired(docFields[fieldIndex]);
        }

        validate(isArray(newDoc.tags), 'Tags must be array');
        if (isUser(newDoc.authorId)) {
          return;
        } else {
          // if not the owner only vote and comment count can change
          // vote and comment count will get automatically validated by aggregration of votes
          for (var fieldIndex = 0; fieldIndex < docFields.length; fieldIndex++) {
            if (docFields[fieldIndex] !== 'votes' && docFields[fieldIndex] !== 'comments') {
              unchanged(docFields[fieldIndex]);
            }
          }
        }
        return;
      }

      // comment validation
      if (newDoc.type === 'comment') {
        var docFields = ['createdAt', 'content', 'votes', 'author', 'authorId', 'ideaId'];
        for (var fieldIndex = 0; fieldIndex < docFields.length; fieldIndex++) {
          isRequired(docFields[fieldIndex]);
        }
        if (isUser(newDoc.authorId)) {
          return;
        } else {
          for (var fieldIndex = 0; fieldIndex < docFields.length; fieldIndex++) {
            if (docFields[fieldIndex] !== 'votes') {
              unchanged(docFields[fieldIndex]);
            }
          }
        }
        return;
      }

      // validation for like
      if (newDoc.type === 'like') {
        var docFields = ['createdAt', 'commentId'];
        for (var fieldIndex = 0; fieldIndex < docFields.length; fieldIndex++) {
          isRequired(docFields[fieldIndex]);
        }

        // like:commentId:rhatUUID
        var idSplittedByColor = newDoc._id.split(':');
        var rhatUUID = idSplittedByColor[idSplittedByColor.length - 1];

        if (isUser(rhatUUID)) {
          return;
        } else {
          throw { forbidden: 'Unauthorized access' };
        }
      }

      // validation for vote
      if (newDoc.type === 'vote') {
        var docFields = ['createdAt', 'ideaId'];
        for (var fieldIndex = 0; fieldIndex < docFields.length; fieldIndex++) {
          isRequired(docFields[fieldIndex]);
        }
        // vote format: vote:ideaId:rhatUUID
        var idSplittedByColor = newDoc._id.split(':');
        var rhatUUID = idSplittedByColor[idSplittedByColor.length - 1];

        if (isUser(rhatUUID)) {
          return;
        } else {
          throw { forbidden: 'Unauthorized access' };
        }
      }

      // deletion of tag admin only
      if (newDoc.type === 'tag') {
        if (newDoc._deleted === true && !isAdmin()) {
          throw { forbidden: 'Unauthorized access' };
        }
        return;
      }

      throw { forbidden: 'Document not recognized' };
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
