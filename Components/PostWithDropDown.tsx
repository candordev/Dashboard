import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import DropDown from './DropDown'; // Adjust the import path as needed
import colors from '../Styles/colors'; // Adjust the import path as needed
import { customFetch } from '../utils/utils'; // Adjust the import path as needed
import { Endpoints } from '../utils/Endpoints'; // Adjust the import path as needed
import { useUserContext } from '../Hooks/useUserContext';
import Text from './Text'; // Adjust import path as needed

import IssueView from './IssueView'; // Adjust import path as needed
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { setStatusBarHidden } from 'expo-status-bar';


// Define the prop types for the new component
type PostWithDropdownProps = {
  post: any; // Adjust the type as necessary
  onClearPosts: () => void;
};

const PostWithDropdown = ({ post, onClearPosts }: PostWithDropdownProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]); // Adjust the type as necessary
  const { state } = useUserContext();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const { height, width } = useWindowDimensions();
  const [showDropdown, setShowDropdown] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [displayGroup, setDisplayGroup] = useState<string | null>(null);
  const [cardLayout, setCardLayout] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);


    



  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  const clearPost = async () => {
    try {
      const response = await customFetch(Endpoints.clearForwardedPost, {
        method: 'POST',
            
        body: JSON.stringify({ postID: post._id, masterID: state.master._id }),
      });
  
      if (response.ok) {
        console.log('Post cleared successfully');
        // Call the parent callback to re-fetch the posts
        onClearPosts();
      } else {
        console.error('Failed to clear post');
      }
    } catch (error) {
      console.error('Error clearing post:', error);
    }
  };



  // Fetch groups (dropdown items) on component mount
  useEffect(() => {
    console.log("this is the post group: ", post)
    const matchingGroup = state.leaderGroups.find((group: { _id: any; }) => group._id === post.group);

    if(post.group != null){
        setShowDropdown(false);
        setDisplayGroup(matchingGroup.name);
    }
    //setSelectedGroup(post.group)
    const groupItems = state.leaderGroups.map((group: { name: any; _id: any; }) => ({ label: group.name, value: group._id }));
    setGroups(groupItems);
  }, []);

  // Handle group selection for the post
  const handleSelectGroup = async (groupId: any) => {
    try {
        console.log("drop down closed", groupId)
      await customFetch(Endpoints.setGroup, { // Adjust the endpoint as necessary
        method: "POST",
        body: JSON.stringify({ postId: post._id, groupId }),
      });
      console.log("Group set successfully");
    } catch (error) {
      console.error("Failed to set group for post:", error);
    }
  };

  return (
    <View style={styles.card}
        onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setCardLayout({ width, height });
      }}>
      <ScrollView>
        <Text style={styles.cardTitle}>{post.title}</Text>
        <Text style={{ marginBottom: 10 }}>{post.content}</Text>
      </ScrollView>
      <View style={styles.separatorLine} /> {/* Separator line */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {showDropdown && (
                <>
                <View style={{ flex: 1, marginRight: 10 }}> {/* Adjust marginRight as needed */}
                    <DropDown
                    placeholder="Select Group"
                    value={selectedGroup}
                    setValue={setSelectedGroup}
                    items={groups}
                    setItems={setGroups}
                    multiple={false}
                    dropDownDirection='TOP'
                    />
                </View>
                <TouchableOpacity
                    onPress={() => setShowConfirmation(true)}
                    style={[
                        styles.doneButton,
                        !selectedGroup && styles.disabledButton // This adds the disabledButton style if selectedGroup is not there
                    ]}
                    disabled={!selectedGroup} // This disables the touch functionality if selectedGroup is not there
                    >
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
                </>
            )}
            </View>
        {/* Confirmation Popover/Modal */}
        {showConfirmation && (
  <Popover
    isVisible={showConfirmation}
    onRequestClose={() => setShowConfirmation(false)}
    placement={PopoverPlacement.AUTO}
    popoverStyle={{
      width: 400, // Fixed width for the popover
      padding: 20, // Padding inside the popover
      alignItems: 'center', // Center items horizontally
    }}
  >
    <Text style={{
      fontFamily: 'Montserrat', // Ensure the Montserrat font is linked in your project
      textAlign: 'center', // Center the text
    }}>Are you sure? You cannot change it.</Text>

        {isLoading ? (
        <ActivityIndicator size="large" color={colors.purple} style={{ marginVertical: 20 }} />
        ) : (
        <>
            <TouchableOpacity
            onPress={async () => {
                setIsLoading(true); // Start loading
                await handleSelectGroup(selectedGroup);
                setIsLoading(false); // Stop loading once the operation is complete
                setShowDropdown(false);
                setShowConfirmation(false);
                setDisplayGroup(groups.find(group => group.value === selectedGroup)?.label || null);
            }}
            style={{
                backgroundColor: colors.purple, // Purple background for the "Done" button
                paddingVertical: 10,
                width: '100%', // Make the button take up the entire width
                borderRadius: 5,
                marginTop: 20,
                alignItems: 'center',
            }}
            >
            <Text style={{
                color: 'white', // White text for the "Done" button
                fontFamily: 'Montserrat',
            }}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => setShowConfirmation(false)}
            style={{
                backgroundColor: colors.red, // Red background for the "Cancel" button
                paddingVertical: 10,
                width: '100%', // Make the button take up the entire width
                borderRadius: 5,
                marginTop: 10,
                alignItems: 'center',
            }}
            >
            <Text style={{
                color: 'white', // White text for the "Cancel" button
                fontFamily: 'Montserrat',
            }}>Cancel</Text>
            </TouchableOpacity>
        </>
        )}
    </Popover>
    )}


        {!showDropdown && (
            <>
                <Text>Selected Group is: {displayGroup}</Text>
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.editButton]} onPress={togglePopover}>
                    <Text style={[styles.editButtonText, styles.buttonText]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.rowButton]} onPress={clearPost}>
                    <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
                </View>
            </>
            )}
       <Popover
        isVisible={isPopoverVisible}
        onRequestClose={togglePopover}
        onCloseComplete={() => setIsPopoverVisible(false)}
        //from={<View style={styles.hiddenPopoverAnchor} />}
        placement={PopoverPlacement.BOTTOM}
        popoverStyle={{
            borderRadius: 10,
            width: width * 0.7,
            height: height * 0.9,
        }}
      >
        <IssueView issue={post} onPopoverCloseComplete={() => setIsPopoverVisible(false)} />
      </Popover>
      </View>
  );
};


const styles = StyleSheet.create({
    doneButton: {
        backgroundColor: colors.purple, // Your preferred shade of purple
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 16, // Adjust padding as needed for your design
        justifyContent: 'center',
        alignItems: 'center',
      },
      doneButtonText: {
        color: 'white',
        fontFamily: 'Montserrat', // Ensure Montserrat font is linked in your project
        fontSize: 15, // Adjust size as needed
        fontWeight: "500"
      },
    confirmationModal: {
        position: 'absolute',
        zIndex: 100, // Ensure it sits above other content
        left: '50%',
        top: '50%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
      },
    hiddenPopoverAnchor: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1,
        top: 0,
        left: 0,
      },
      disabledButton: {
        opacity: 0.5, // Reduce opacity to indicate disabled state
      },
      // Existing styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  separatorLine: {
    borderBottomColor: colors.lightergray, // Ensure this color is defined in your colors object
    borderBottomWidth: 1.4,
    marginVertical: 5,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: colors.lightergray, // Adjust color as necessary

  },
  card: {
    backgroundColor: colors.white,
    padding: 14,
    marginVertical: 5,
    margin: 16,
    borderRadius: 10,
    maxHeight: 300,
    flexDirection: 'column',
    borderColor: colors.black,
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)', // offsetX offsetY blurRadius color
    overflow: 'visible', // This line is crucial for showing shadows
    zIndex: 1, // Try adjusting this value


  },
  
  cardTitle: {
    fontWeight: 600,
    fontFamily: 'Montserrat',
    marginBottom: 6,
    fontSize: 16.5,

  },
  editButtonText: {
    color: colors.white, // Adjust color as necessary
  },
  editButton: {
    backgroundColor: colors.purple
    // Additional styles for the Edit button if needed
  },
  rowButton: {
    
    // Additional styles for the Row button if needed
  },
  buttonText: {
    fontFamily: 'Montserrat',
    fontWeight: "600",
    fontSize: 16,
  },
  // Add other styles as needed
});

export default PostWithDropdown;
