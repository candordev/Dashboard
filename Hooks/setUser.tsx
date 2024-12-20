import { getAuth } from "firebase/auth";

type setUserProps = {
  resJson: any;
  postId: string;
  setError?: any;
  dispatch: any;
};

export const setUser = async ({
  resJson,
  postId,
  dispatch,
  setError = () => {},

}: setUserProps) => {
  let token = '';
  try {
    // await Keychain.setGenericPassword(resJson.user.username, resJson.refreshToken);
    token = (await getAuth().currentUser?.getIdToken()) ?? '';
    // console.log('resJson', resJson);
    // console.log('token', token);
    // user: profile.user,
    // username: profile.username,
    // firstName: profile.firstName,
    // lastName: profile.lastName,
    // profilePicture: profile.profilePicture,
    // donationLink: profile.donationLink,
    // bio: profile.bio,
    // followers: userActivity.followers.length,
    // following: userActivity.following.length,
    // groups: userActivity.groups,
    // likedPosts: userActivity.likedPosts,
    // dislikedPosts: userActivity.dislikedPosts,
    // candorPoints: totalCandorPoints,
    // leaderPoints: profile.leaderPoints,
    // leaderGroups: profile.leaderGroups,
    // totalCandorCoins: totalCandorCoins,
    // //candorCoinsByGroup: profile.candorCoinsByGroup,
    // candorCoinsByGroup: newCandorCoinsByGroup,
    // candorPointsByGroup: newCandorPointsByGroup,
    // //candorCoinsByGroup: profile.candorCoinsByGroup,
    // numPosts: userActivity.posts.length,
    // numComments: userActivity.comments.length,
    // numLiked: userActivity.likedPosts.length,

    let user = {
      username: resJson.username,
      firstName: resJson.firstName,
      lastName: resJson.lastName,
      email: resJson.email,
      dob: resJson.dateOfBirth,
      token: token,
      ccEmail: resJson.ccEmail,
      imageUrl: resJson.profilePicture,
      candorPoints: resJson.candorPoints,
      candorPointsByGroup: resJson.candorPointsByGroup,
      totalCandorCoins: resJson.totalCandorCoins,
      candorCoinsByGroup: resJson.candorCoinsByGroup,
      bio: resJson.bio,
      _id: resJson.user,
      leaderPoints: resJson.leaderPoints,
      masterPages: resJson.masterPages,
      leaderGroups: resJson.leaderGroups,
      postId: postId,
      currentGroup: resJson.leaderGroups && resJson.leaderGroups.length > 0 ? resJson.leaderGroups[0]._id : null,
      master: resJson.master
    };

   console.log('This is the user master', user.master);

    dispatch({type: 'SET_USER', payload: user});
  } catch (error) {
    console.error('Could not save jwt to keychain', String(error));
    setError('Could not save jwt to keychain');
  }
};
