// import {HOST} from '@env';

// if (!HOST) {
//   console.error('HOST not defined in .env file. Please run npm run updateIP');
// } else {
//   console.log('Running on host:', HOST);
// }

// local


// export const BASE_URL : string = `http://localhost:4000/api`;


// export const BASE_URL : string = `http://${HOST}:4000/api`;

// DEVELOPMENT
//export const BASE_URL : string = `http://3.221.91.129:4000/api`;

// PRODUCTION
export const BASE_URL: string = `https://candoradmin.com/api`;


//export const BASE_URL: string = `http://184.72.74.25:4000/api`;

export const Endpoints = {
  base: BASE_URL,
  signup: `${BASE_URL}/user/signup`,
  login: `${BASE_URL}/user/login`,
  validEmail: `${BASE_URL}/user/validEmail?`,
  validUsername: `${BASE_URL}/user/validUsername?`,
  restoreLogin: `${BASE_URL}/user/restoreLogin`,
  getPosts: `${BASE_URL}/post/getPosts?`,
  getPostById: `${BASE_URL}/post/getPostById?`,
  getComments: `${BASE_URL}/comment/getComments?`,
  getMoreCommentReplies: `${BASE_URL}/comment/getMoreCommentReplies?`,
  likeComment: `${BASE_URL}/comment/likeComment`,
  dislikeComment: `${BASE_URL}/comment/dislikeComment`,
  likePost: `${BASE_URL}/post/upVote`,
  dislikePost: `${BASE_URL}/post/downVote`,
  createComment: `${BASE_URL}/comment/createComment?`,
  search: `${BASE_URL}/userActivity/search?`,
  groups: `${BASE_URL}/userActivity/groups?`,
  getPostsByGroup: `${BASE_URL}/userActivity/getPostsByGroup?`,
  getHomePagePostsGroups: `${BASE_URL}/userActivity/getHomePagePostsGroups?`,
  getHomePagePostsAll: `${BASE_URL}/userActivity/getHomePagePostsAll?`,
  getProfile: `${BASE_URL}/profile?`,
  createPost: `${BASE_URL}/post/createPost`,
  createProposal: `${BASE_URL}/post/createProposal`,
  createPoll: `${BASE_URL}/post/createPoll`,
  createStatusUpdate: `${BASE_URL}/post/createUpdatePost`,
  deleteComment: `${BASE_URL}/comment/deleteComment?`,
  deletePost: `${BASE_URL}/post/deletePost`,
  updateProfile: `${BASE_URL}/profile/updateProfile`,
  getProfilePosts: `${BASE_URL}/profile/getProfilePosts?`,
  getProfileComments: `${BASE_URL}/profile/getProfileComments?`,
  getProfileLiked: `${BASE_URL}/profile/getLikedPostsByUser?`,
  getPostProgress: `${BASE_URL}/progress?`,
  getGroupLeaders: `${BASE_URL}/group/getGroupLeaders?`,
  getGroupLeadersNoPagination: `${BASE_URL}/group/getGroupLeadersNoPagination?`,
  addToGroup: `${BASE_URL}/group/addToGroup?`,
  removeFromGroup: `${BASE_URL}/group/removeFromGroup?`,
  getGroupByID: `${BASE_URL}/group/getGroupByID?`,
  getEvents: `${BASE_URL}/event/getEvents?`,
  pollVote: `${BASE_URL}/post/pollVote?`,
  donateCoins: `${BASE_URL}/userActivity/donateCoins`,
  acceptProposal: `${BASE_URL}/userActivity/acceptProposal`,
  getGroupMembers: `${BASE_URL}/group/getGroupMembers?`,
  reportPost: `${BASE_URL}/report/reportPost`,
  reportComment: `${BASE_URL}/report/reportComment`,
  validGroupID: `${BASE_URL}/user/checkValidGroupID?`,
  blockUser: `${BASE_URL}/profile/blockUser`,
  unblockUser: `${BASE_URL}/profile/unblockUser`,
  deleteProfile: `${BASE_URL}/profile/deleteProfile`,
  createAnnouncement: `${BASE_URL}/post/createAnnouncement`,
  getAnnouncements: `${BASE_URL}/post/getAnnouncements?`,
  resetGroupIndicator: `${BASE_URL}/userActivity/resetLatestSeenPostInGroup`,
  registerNotificationToken: `${BASE_URL}/notification/registerNotificationToken`,
  getCoinsByUsers: `${BASE_URL}/userActivity/getCoinsByUsers?`,
  getNotificationPage: `${BASE_URL}/notification/getNotificationPage?`,
  seenNotification: `${BASE_URL}/notification/seenNotification`,
  unseenNotificationsCount: `${BASE_URL}/notification/unseenNotificationsCount?`,
  getNotification: `${BASE_URL}/notification/getNotification?`,
  getTopMembers: `${BASE_URL}/group/getTopMembers?`,
  signupFirebase: `${BASE_URL}/user/signupFirebase`,
  loginFirebase: `${BASE_URL}/user/loginFirebase`,
  getUser:  `${BASE_URL}/user/getUser`,
  finishFirebaseLogin: `${BASE_URL}/user/finishFirebaseLogin`,
  getAcceptedPosts: `${BASE_URL}/userActivity/acceptedProposals?`,
  getUpdatedPosts: `${BASE_URL}/userActivity/updatedProposals?`,
  getCompletedPosts: `${BASE_URL}/userActivity/completedProposals?`,
  addGroupsByLocation: `${BASE_URL}/group/addGroupsByLocation`,
  getPostLikes: `${BASE_URL}/post/getPostLikes?`,
  getGroupLeadersForAccept: `${BASE_URL}/group/getGroupLeadersForAccept?`,
  getGroupLeadersForAcceptCustom: `${BASE_URL}/group/getGroupLeadersForAcceptCustom?`,
  addOtherLeaders: `${BASE_URL}/userActivity/addMoreAccepts`,
  getAcceptedLeaders: `${BASE_URL}/userActivity/getAcceptedLeaders?`,
  deleteYourNotifications: `${BASE_URL}/notification/deleteYourNotifications`,
  getCommentLikes: `${BASE_URL}/comment/getCommentLikes?`,
  getPostsByGroupWithoutLazyScroll: `${BASE_URL}/userActivity/getPostsByGroupWithoutLazyScroll?`,
  getYourProposals: `${BASE_URL}/userActivity/getYourProposals?`,
  sendEmailToLeader: `${BASE_URL}/userActivity/sendEmailToLeader`,
  dashboardPosts: `${BASE_URL}/userActivity/dashboardPosts?`,
  categories: `${BASE_URL}/userActivity/categories?`,
  addCategory:`${BASE_URL}/userActivity/addCategory?`,
  getCategoryForPost: `${BASE_URL}/userActivity/getCategoriesForPost?`,
  setAssignees: `${BASE_URL}/userActivity/setAssignees?`,
  getDepartments: `${BASE_URL}/department/getDepartments?`,
  getDepartment: `${BASE_URL}/department/getDepartment?`,
  setDeadline: `${BASE_URL}/post/setDeadline?`,
  getGroupDeadlines: `${BASE_URL}/group/getDeadlines?`,
  setGroupDeadlines: `${BASE_URL}/group/setDeadlines`,
  setNeighborhood: `${BASE_URL}/userActivity/setNeighborhood?`,
  addLeaderCreatePost: `${BASE_URL}/userActivity/addLeaderCreatePost?`,
  addCategoryCreatePost: `${BASE_URL}/userActivity/addCategoryCreatePost?`,
  createDashboardProposal: `${BASE_URL}/post/createDashboardProposal?`,
  getNeighborhoodCreatePost:  `${BASE_URL}/userActivity/getNeighborhoodCreatePost?`,
  getPrivateChats:  `${BASE_URL}/comment/getPrivateChats?`,
  editPost:  `${BASE_URL}/post/editPost?`,
  markDone:  `${BASE_URL}/post/markDone?`,
  sendConstituentChat: `${BASE_URL}/comment/sendConstituentChat?`,
  sendPoliticianChat: `${BASE_URL}/comment/sendPoliticianChat?`,
  deleteCategory: `${BASE_URL}/group/deleteCategory`,
  addDepartment: `${BASE_URL}/department/createDepartment?`,
  deleteDepartment: `${BASE_URL}/department/deleteDepartment?`,
  changeDepartment: `${BASE_URL}/department/changeDepartment?`,
  getUsernameByEmails: `${BASE_URL}/userActivity/getUsernameByEmails?`,
  requestPDFInfo: `${BASE_URL}/group/requestPDFInfo?`,
  mergePost: `${BASE_URL}/userActivity/mergePost?`,
  csvUpload:  `${BASE_URL}/userActivity/csvUpload`,
  kickMember: `${BASE_URL}/group/kickMember`,
  addleader : `${BASE_URL}/group/addLeader`,
  addLeaderDashboardSettings: `${BASE_URL}/group/addLeaderDashboardSettings`,
  removeLeaderDashboardSettings: `${BASE_URL}/group/removeLeaderDashboardSettings`,
  getPinnedDocuments: `${BASE_URL}/group/getPinnedDocuments?`,
  editPinnedDocument: `${BASE_URL}/group/editPinnedDocument?`,
  addPinnedDocument: `${BASE_URL}/group/addPinnedDocument?`,
  deletePinnedDocument: `${BASE_URL}/group/deletePinnedDocument?`,
  addGroupCategory: `${BASE_URL}/group/addCategory?`,
  changeCategory: `${BASE_URL}/group/changeCategory?`,
  getGroupCategories: `${BASE_URL}/group/getGroupCategories?`,
  getForwardedEmails: `${BASE_URL}/master/getForwardedEmails?`,
  setGroup: `${BASE_URL}/master/setGroup?`,
  clearForwardedPost: `${BASE_URL}/master/clearForwardedPost?`,
  getMasterInsights: `${BASE_URL}/master/getMasterInsights?`,
  createGroupInMaster: `${BASE_URL}/master/createGroupInMaster?`,
  getLeadersNotInDepartment: `${BASE_URL}/department/getLeadersNotInDepartment?`,
  getDepartmentsForLeader: `${BASE_URL}/department/getDepartmentsForLeader?`,
  addLeadersToDepartment: `${BASE_URL}/department/addLeader?`,
  removeLeaderFromDepartment: `${BASE_URL}/department/removeLeader?`,
  editCCEmail: `${BASE_URL}/profile/editCCEmail?`,
  getAvailableSupportUsers: `${BASE_URL}/profile/getAvailableSupportUsers?`,
  getChatUsingPhoneNumber: `${BASE_URL}/chat/getChatUsingPhoneNumber`,
  sendMessage:  `${BASE_URL}/chat/sendMessage`,
  updateNumberSettings:  `${BASE_URL}/chat/updateNumberSettings`,
  addFAQ: `${BASE_URL}/group/addFAQ`,
  getFAQs: `${BASE_URL}/group/getFAQs?`,
  editFAQ: `${BASE_URL}/group/editFAQ`,
  deleteFAQ: `${BASE_URL}/group/deleteFAQ`,
  getChatInsights: `${BASE_URL}/chat/getChatInsights`,
  getChatUsingSessionID: `${BASE_URL}/chat/getChatUsingSessionID`,
  getAllWebChats: `${BASE_URL}/chat/getAllWebChats`,
  getChunks: `${BASE_URL}/document/getChunks`,
  addChunk: `${BASE_URL}/document/addChunk`,
  deleteChunk: `${BASE_URL}/document/deleteChunk`,
  editChunk: `${BASE_URL}/document/editChunk`,
  getActivityStatus: `${BASE_URL}/group/getActivityStatus?`,
  editActivityResetDuration: `${BASE_URL}/group/editActivityResetDuration?`,
  getProspectiveClients: `${BASE_URL}/chat/getProspectiveClients?`,
  getAllSMSChats: `${BASE_URL}/chat/getAllSMSChats`,
  editEvent: `${BASE_URL}/event/editEvent`,
  createEvent: `${BASE_URL}/event/createEvent`,
  deleteEvent: `${BASE_URL}/event/deleteEvent`,
  getThirdstoneFAQs: `${BASE_URL}/chat/getThirdstoneFAQs`,
  addThirdstoneFAQ: `${BASE_URL}/chat/addThirdstoneFAQ`,
  editThirdstoneFAQ: `${BASE_URL}/chat/editThirdstoneFAQ`,
  deleteThirdstoneFAQ: `${BASE_URL}/chat/deleteThirdstoneFAQ`,
  getPhoneNumbers: `${BASE_URL}/chat/getNumbersFromGroup?`,
  addPhoneNumber: `${BASE_URL}/chat/addNumberToGroup`,
  deletePhoneNumber: `${BASE_URL}/chat/deleteNumberFromGroup`,
};
