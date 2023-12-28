import { getAuth, getIdToken } from "firebase/auth"

type setUserProps = {
  resJson: any;
  setError?: any;
  dispatch: any;
};

export const setUser = async ({
  resJson,
  dispatch,
  setError = () => {},
}: setUserProps) => {
  try {

    const auth = getAuth();
    if (!auth.currentUser) return;
    const token = await getIdToken(auth.currentUser, true);

    let user = {
      username: resJson.username,
      firstName: resJson.firstName,
      lastName: resJson.lastName,
      email: resJson.email,
      dob: resJson.dateOfBirth,
      token: token,
      imageUrl: resJson.profilePicture,
      candorPoints: resJson.candorPoints,
      candorPointsByGroup: resJson.candorPointsByGroup,
      totalCandorCoins: resJson.totalCandorCoins,
      candorCoinsByGroup: resJson.candorCoinsByGroup,
      bio: resJson.bio,
      _id: resJson.user,
      leaderPoints: resJson.leaderPoints,
      leaderGroups: resJson.leaderGroups,
    };

    // console.log('This is the user', user);

    dispatch({type: 'SET_USER', payload: user});
  } catch (error) {
    console.error('Could not set user', String(error));
    setError('Could not set user');
  }
};
