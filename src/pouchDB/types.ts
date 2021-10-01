export enum DesignDoc {
  CountOfVotesForAnIdea = 'votes/idea-votes',
  CountOfCommentsForAnIdea = 'comments/idea-comments',
  CountOfLikesForAComment = 'likes/comment-likes',
  CountOfTagsUsed = 'tags/tags-count',
  HomePageFilter = 'filters/homepage',
  IdeaDetailPageFilter = 'filters/ideaDetailPage',
  ReplicationFilter = 'filters/replication',
}

export enum IndexDoc {
  SortedByTypeVoteAuthor = 'type-votes-author-index',
  SortedByTypeIdAuthor = 'type-id-author-index',
  SortedByTypeIdeaidVotes = 'type-ideaId-votes-index',
}

export interface DesignDocument {
  version: number;
  validate_doc_update?: string;
}

interface Updation {
  _rev: string;
}

// _id: idea_<timestamp>
export interface CreateIdeaDoc {
  title: string;
  description: string;
  tags: string[];
}

export interface IdeaDoc extends CreateIdeaDoc, Updation {
  author: string;
  authorId: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  votes: number;
  comments: number;
  isArchived: boolean;
  // this is something not saved in database but rather on second query
  hasVoted: boolean;
  type: 'idea';
  // this is nanoid generated short id for easy sharing
  ideaId: string;
}

// _id: comments:<idea_id>:<timestamp>
export interface CreateIdeaCommentDoc {
  _id: string;
  type: 'comment';
  description: string;
  like: number;
}

export interface IdeaCommentDoc extends CreateIdeaCommentDoc, Updation {}

// _id <tagname>
export interface CreateTagDoc {
  type: 'tag';
  _id: string;
  createdAt: number;
}

export interface TagDoc extends CreateTagDoc, Updation {
  createdAt: number;
}

//_id likes:<idea_id>:comments:timestamp:<user-id>
export interface CreateLikeDoc {
  type: 'like';
  commentId: string;
}

export interface LikeDoc extends CreateLikeDoc, Updation {
  createdAt: number;
}

//_id votes:<idea_id>:<user-id>
export interface CreateVoteDoc {
  type: 'vote';
  ideaId: string;
  createdAt: number;
}

export interface VoteDoc extends CreateVoteDoc, Updation {}

export interface CreateCommentDoc {
  content: string;
  votes: number;
  createdAt: number;
  updatedAt: number;
  author: string;
  authorId: string;
  type: 'comment';
  ideaId: string;
}

export interface CommentDoc extends CreateCommentDoc, Updation {
  updatedBy: number;
  hasLiked: boolean;
}

export interface GetIdeaListArg {
  startKey?: string | number;
  limit?: number;
  skip?: number;
  filter?: {
    author?: string | null;
    category?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GetList<T extends any> {
  hasNextPage: boolean;
  docs: PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta>[];
  cb?: () => Promise<GetList<T>>;
}

export interface GetCommentListArg extends GetIdeaListArg {
  ideaId: string;
}

export interface IdeaFilters {
  category?: string;
  type: string;
}
