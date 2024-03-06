import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../Styles/colors'; // Adjust the import path as needed
import { formatDate } from '../utils/utils'; // Adjust the import path as needed

// You might also need to adjust the path or content of this import to match your project structure
import { Comment } from '../utils/interfaces';

interface CommentThreadProps {
    comment: Comment;
    isChild: boolean;
    depth: number;
    onReply: (comment: Comment) => void; // Add this line
  }

const CommentThread: React.FC<CommentThreadProps> = ({ comment, isChild, depth, onReply }) => {
  const lineStyle = {
    width: 2,
    backgroundColor: colors.lightgray,
    marginRight: 10,
    minHeight: comment.replies && comment.replies.length > 0 ? comment.replies.length * 190 : 190 / 2,
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 0 }}>
      {depth > 0 && <View style={lineStyle} />}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: comment.profile.profilePicture }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
          />
          <View>
            <Text style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>{comment.profile.firstName + " " + comment.profile.lastName}</Text>
            <Text style={{color: colors.gray, fontFamily: 'Montserrat', fontWeight: "500", fontSize: 13,
              }}>{formatDate(comment.date)}</Text>
          </View>
        </View>
        <Text style={{ marginTop: 4,fontFamily: 'Montserrat', fontSize: 14 }}>{comment.content}</Text>
        <View style={{   alignSelf: 'flex-end', marginTop: 8, marginRight: 4}}>
          <TouchableOpacity onPress={() => onReply(comment)}>
            <Text style={{ color: colors.gray, fontFamily: 'Montserrat', fontSize: 14}}>Reply</Text>
          </TouchableOpacity>
        </View>
        {comment.replies && comment.replies.filter(reply => typeof reply !== 'string').map((reply, index) => (
        <CommentThread 
            comment={reply as Comment} 
            key={index} 
            isChild={true} 
            depth={depth + 1}
            onReply={onReply} // Pass onReply here as well
        />
        ))}
      </View>
    </View>
  );
};


export default CommentThread;
