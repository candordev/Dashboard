import React from 'react';
import { View } from 'react-native';
import colors from '../Styles/colors';
import OuterView from '../Components/OuterView';
import NotificationPopup from '../Components/NotificationPopup';
import DocumentList from '../Components/DocumentList'; // Update the import path as needed
import FAQList from '../Components/FAQList';
import { useUserContext } from '../Hooks/useUserContext';

const TrainChatScreen = ({ navigation }: any) => {

    const { state } = useUserContext();
    const groupID = state.leaderGroups[0]._id;
  
    return (
      <>
        <NotificationPopup navigation={navigation} />
        <OuterView style={{
          backgroundColor: colors.white,
          flexDirection: 'row',  // Ensures horizontal layout
          flex: 1,
          borderRadius: 20,
          overflow: 'visible',
        }}>
            <View style={{ flex: 1 }}>  
              <DocumentList groupID={groupID} />
            </View>
            <View style={{ flex: 1 }}> 
              <FAQList groupID={groupID} />
            </View>
        </OuterView>
      </>
    );
};

  
  
export default TrainChatScreen;
