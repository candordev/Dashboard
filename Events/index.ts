import { EventEmitter } from "eventemitter3";
export const event = new EventEmitter();

export const enum eventNames {
    //`fetchPost${postId}`,
    ISSUE_CATEGORY_SET = "issueCategorySet",
    FOREGROUND_NOTIFICATION = "foregroundNotification",
    OPENED_FROM_NOTIFICATION = "openedFromNotification",
    // FETCH_NOTIFIATIONS = "fetchNotifications",
    FORCE_SIGNOUT="forceSignout",
    FETCH_NOTIFS="fetchNotifs",
    NOTIFICATIONS_REFRESHED="notfisRefreshed"
}