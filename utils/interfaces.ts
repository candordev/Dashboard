export interface UserProfile {
  profileId: string;
  _id: string;
  user: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  bio: string;
  donationLink: string;
  candorPoints: number;
  totalCandorCoins: number;
  candorCoinsByGroup: any;
  group: Group[];
  likedPosts: string[];
  dislikedPosts: string[];
  leaderGroups: string[];
  leaderPoints: AdminPoint[];
  deleted: boolean;
  __v: number;
  blocked: boolean;
  numAccepted: number;
  numUpdated: number;
  numFinished: number;
  leaderPointsForGroup: number;
  email?: string[];
  departmentNames: string[];
  acceptedPost: boolean;
}

export interface emptyFields{
  firstName: boolean,
  lastName: boolean,
  email: boolean,
  department: boolean
}

export interface CategoryWithPosts {
  [categoryName: string]: Post[];
}

export interface MemberProfile extends UserProfile {
  isLeader: boolean;
}

export interface OtherLeaderProfile {
  acceptedPost: boolean;
  profile: UserProfile;
  userID: string;
}

export interface AdminPoint {
  _id: string; // TODO: what is this an id for??
  group: string;
  points: number;
}

// TODO: remove user field (redundant, inside of userProfile)
export interface Post {
  aspectRatio: number;
  videoURL: string;
  _id: string;
  user: string;
  title: string;
  group: Group;
  location: string;
  contentType: string;
  upvotes: number;
  downvotes: number;
  content: string;
  pollOptions: string[];
  pollResults: number[];
  comments: string[];
  date: string;
  createdAt: string;
  coinsRaised: number;
  step: number;
  userDownVoted: boolean;
  userUpVoted: boolean;
  userSaved: boolean;
  userProfile: UserProfile;
  imgURL?: string;
  popularity: number;
  deleted: boolean;
  politicianLikes: UserProfile[];
  pastPoliticianLikes: string[]; //array of ids of politicians who previously liked a post
  acceptedPoliticians: string[];
  finishedPoliticians: string[];
  __v: number;
  parentPost: string;
  userVotedIndex: number;
  default: boolean;
  blocked: boolean;
  totalStatusUpdates: number;
  userSeen: boolean;
  bill_id?: string;
  billNumber?: string;
  last_action?: string;
  last_action_date?: string;
  status_data?: string;
  bill_url?: string;
  bill_status?: string;
  suggestedDepartments: Department[];
  deadline: Date;
  neighborhood: string;
  postCreatedFrom: string;
  proposalFromEmail: string;
}

export interface Leader {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Department {
  _id: string;
  name: string;
  leaders: Leader[];
  groupID: string;
}

export interface Update {
  _id: string;
  user: string;
  userProfile: UserProfile;
  title: string;
  group: Group;
  location: string;
  contentType: string;
  upvotes: number;
  downvotes: number;
  content: string;
  pollOptions: string[];
  pollResults: string[];
  comments: string[];
  date: string;
  createdAt: string;
  raised: number;
  step: number;
  userDownVoted: boolean;
  userUpVoted: boolean;
  userSaved: boolean;
  imgURL?: string;
  popularity: number;
  deleted: boolean;
  politicianLikes: number;
  acceptedPoliticians: string[];
  finishedPoliticians: string[];
  __v: number;
  default: boolean;
  blocked: boolean;
}

export interface Group {
  _id: string;
  imgUrl: string;
  name: string;
  unreadIndicator: boolean;
}

export interface CategoryPost {
  name: string; // Name of the category
  checked: boolean;
}

export interface FullGroup extends Group {
  numMembers: number;
  numLeaders: number;
  numPosts: number;
  description: string;
  verification: string;
  additionalVerificationText: string;
  cityState: string;
}

export interface Comment {
  _id: string;
  content: string;
  authorID: string;
  profile: UserProfile;
  parentID?: string;
  replies: Comment[] | string[];
  postID: string;
  date: string;
  replyCount: number;
  likes: string[];
  dislikes: string[];
  numLikes: number;
  numDislikes: number;
  userReaction: UserReaction;
  deleted: boolean;
  groupName: string;
  groupID: string;
  groupPicture: string;
  totalCommentsUnder?: number;
  blocked: boolean;
  postTitle: string;
  isWhisper: boolean;
  contentType: string;
}

export enum UserReaction {
  like = "like",
  dislike = "dislike",
  neither = "neither",
}

export interface Notification {
  _id: string;
  content: string;
  notifiedUser: string;
  title: string;
  data: NotificationData;
  deleted: boolean;
  fireDate: string;
  seen: boolean;
  picture: string;
}

export interface NotificationData {
  contentType: NotificationType;
  postID?: string;
  pollID?: string;
  commentID?: string;
  refPostID?: string;
  updatePostID?: string;
  groupID?: string;
  _id?: string; // only passed in real notification
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface ProgressSelector {
  newSelected: boolean;
  assignedSelected: boolean;
  updatedSelected: boolean;
  completedSelected: boolean;
}

export enum NotificationType {
  commentLike = "commentLike",
  newComment = "newComment",
  updatePost = "updatePost",
  upvote = "upvote",
  announcement = "announcement",
  pollVote = "pollVote",
  proposalAccepted = "proposalAccepted",
  proposalUnaccepted = "proposalUnaccepted",
  proposal = "proposal",
  reminder="reminders"
}

export enum BillStatusType {
  "Prefiled",
  "Introduced",
  "Engrossed",
  "Enrolled",
  "Passed",
}
export interface Status {
  newSelected: boolean;
  assignedSelected: boolean;
  updatedSelected: boolean;
  completedSelected: boolean;
}
