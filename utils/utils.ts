import { NotificationData, NotificationType, Post } from "../utils/interfaces";
import { Endpoints } from "./Endpoints";
import { constants } from "./constants";
import { Linking, Platform } from "react-native";
import { getAuth } from "firebase/auth";
import { event, eventNames } from "../Events";

export const getAuthToken = async (): Promise<string> => {
  try {
    const auth = getAuth();
    // console.log("THIS IS THE AUTH", auth)
    const token = (await auth.currentUser?.getIdToken()) ?? "";
    console.log("THIS IS THE TOKEN", token);
    return token;
  } catch (error) {
    console.error("Error getting auth token: ", error);
    throw error;
  }
};
export const customFetch = async (
  endpoint: string,
  options: { method: string; body?: any },
  attempt: number = 0
): Promise<Response> => {
  try {
    const token: string = await getAuthToken();
    if (!token || token == "") {
      throw new Error("No auth token provided on fetch");
    }
    let res = await Promise.race([
      fetch(endpoint, {
        ...options,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), constants.TIMEOUT)
      ),
    ]);
    if (res.status === 403) {
      // authentication error
      //event.emit(eventNames.FORCE_SIGNOUT);
      throw new Error("Authentication error, signing out...");
    }
    return res;
  } catch (error: any) {
    if (
      error.message === "Timeout" ||
      error.message === "Network request failed"
    ) {
      if (attempt >= constants.MAX_RETRIES) {
        throw new Error(
          "There is a problem with your connection. Please try again later or contact us if this problem persists."
        );
      } else {
        // retry
        await delay(constants.RETRY_WAIT_TIME);
        // console.log('Retrying fetch...');
        return await customFetch(endpoint, options, attempt + 1);
      }
    } else {
      throw error;
    }
  }
};

export const openTermsAndConditions = () => {
  const url = "https://www.candornow.com/legalterms";
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      }
    })
    .catch();
};

const fetchPost = async (postId: string) => {
  try {
    let res: Response = await customFetch(
      Endpoints.getPostById +
        new URLSearchParams({
          postID: postId,
        }),
      {
        method: "GET",
      }
    );
    let resJson = await res.json();
    if (!res.ok) {
    }
    if (res.ok) {
      const result: Post = resJson;
      // console.info("fetched post is ", result);
      return result;
    }
  } catch (error) {}
};

export const clickNotif = async (
  notifData: NotificationData | undefined,
  notifID: string,
  navigation: any
) => {
  console.debug("Clicked notification:", notifData, notifID);
  try {
    let res: Response = await customFetch(Endpoints.seenNotification, {
      method: "POST",
      body: JSON.stringify({
        notificationID: notifID,
      }),
    });
    // console.info(res);
    let resJson = await res.json();
    if (!res.ok) {
      throw new Error(resJson.error);
    }
    if (res.ok) {
      event.emit(eventNames.FETCH_NOTIFS);
      // console.log('Marked notification as seen');
    }
  } catch (error) {
    console.error("Error marking notification as seen: ", error);
  }

  switch (notifData?.contentType) {
    case NotificationType.commentLike:
      navigation.push("post", {
        postID: notifData?.postID,
        commentID: notifData?.commentID,
      });
      break;
    case NotificationType.newComment:
      navigation.push("post", {
        postID: notifData?.postID,
        commentID: notifData?.commentID,
      });
      break;
    case NotificationType.updatePost:
      // TODO
      break;
    case NotificationType.upvote:
      navigation.push("post", {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.announcement:
      navigation.push("post", {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.pollVote:
      navigation.push("post", {
        postID: notifData?.pollID,
      });
      break;
    case NotificationType.proposalAccepted:
      navigation.push("post", {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.proposalUnaccepted:
      navigation.push("post", {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.proposal:
      navigation.push("post", {
        postID: notifData?.postID,
      });
      break;
    default:
      console.error("Unknown notification type:", notifData);
      navigation.navigate("Notifications");
      break;
  }
};

export const getUnreadNotifs = async (): Promise<number> => {
  try {
    let res: Response = await customFetch(Endpoints.unseenNotificationsCount, {
      method: "GET",
    });
    let resJson = await res.json();
    if (!res.ok) {
      throw new Error(resJson.error);
    } else {
      // notifee.setBadgeCount(resJson.notificationCount);
      return resJson.notificationCount as number;
    }
  } catch (err) {
    throw err;
  }
};

export const formatDate = (createdAt: string): string => {
  const now = new Date();
  const createdDate = new Date(createdAt); // Parse the string into a Date object
  const diffMs = now.getTime() - createdDate.getTime(); // difference in milliseconds
  const diffMins = Math.round(diffMs / 60000); // minutes
  const diffHrs = Math.round(diffMins / 60); // hours
  const diffDays = Math.round(diffHrs / 24); // days

  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHrs < 24) {
    return `${diffHrs} hours ago`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    // Format the date to show in "MM/DD/YYYY" format
    return createdDate.toLocaleDateString();
  }
};

export const downloadPDF = async (groupID: string) => {
  try {
    if (!groupID) {
      return;
    }
    // setIsLoading(true);
    console.log("PDF GROUP", groupID);
    const queryParams = new URLSearchParams({
      groupID: groupID,
    });

    const res = await customFetch(
      `${Endpoints.requestPDFInfo}${queryParams.toString()}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      let resJson = await res.json();
      console.error("DOWNLOAD PDF ERROR", resJson.error);
      // setErrorMessage("Failed to download pdf: " + resJson.error);
    } else {
      const blob = await res.blob();

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "group_posts.pdf"; // Set the default file name for download

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the link and revoke the URL
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);

      console.log("PDF downloaded successfully");
    }
    // setIsLoading(false);
  } catch (error) {
    console.error("Error downloading pdf", error);
  }
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
