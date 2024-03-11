import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Button, TextInput,StyleSheet } from 'react-native';
import { customFetch } from '../utils/utils'; // Update the import path as needed
import { Endpoints } from '../utils/Endpoints'; // Update the import path as needed
// import { useErrorModalContext } from '../Hooks/useErrorModalContext'; // Update the import path as needed
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import colors from '../Styles/colors';
import { Linking } from 'react-native'; // At the top with other imports
import { error } from 'console';




type MemberManagementProps = {
    groupID: string;
};

type Document = {
    description: string;
    _id: string;
    name: string;
    link: string; // Ensure this exists and points to your document's location
    // Include other properties that your documents have
  };

const DocumentList = ({ groupID }: MemberManagementProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
    const [nameEdit, setNameEdit] = useState<string>('');
    const [descriptionEdit, setDescriptionEdit] = useState<string>('');
    const fileInputRef = useRef(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);


    // const { errorModalDispatch } = useErrorModalContext();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const endpoint = `${Endpoints.getPinnedDocuments}groupID=${groupID}`; // FIX THIS
                const res = await customFetch(endpoint, { method: 'GET' });
                const resJson = await res.json();

                if (!res.ok) throw new Error(resJson.error);
                console.log(resJson);

                setDocuments(resJson);
            } catch (error) {
                // errorModalDispatch({
                //     type: 'OPEN_MODAL',
                //     payload: {
                //         title: 'Unable to get documents',
                //         content: error.message,
                //     },
                // });
            }
        };

        fetchDocuments();
    }, [groupID]);


    const handleAddDocument = async () => {
        setIsUploading(true);
      
        if (!selectedFile) {
          console.error("No file selected");
          setIsUploading(false);
          return;
        }
      
        const formData = new FormData();
        formData.append('file', selectedFile); // Use the stored file
        formData.append('name', newTitle);
        formData.append('description', newDescription);
        formData.append('groupID', groupID)
        // Add other fields your endpoint might require
      
        try {
            const response = await customFetch(Endpoints.addPinnedDocument, {
             method: "POST",
            body: formData,
         }, 0, true); // Added attempt parameter (0) and set multiPart to true
          
          if (!response.ok) {
            const resJson = await response.json();
            console.error("Error with adding Pinned Document:", resJson.error);
          } else {
            // console.log("emailed akshatpant@ufl.edu the csv")
          }
          
          // Assuming the response includes the newly added document
          const addedDocument = await response.json();
          setDocuments((currentDocuments) => [...currentDocuments, addedDocument]);
      
          // Reset for the next upload
          setNewTitle('');
          setNewDescription('');
          setSelectedFile(null); // Reset selected file
        } catch (error) {
          console.error(error);
        } finally {
          setIsUploading(false);
        }
      };
      
      

    const handleDeleteDocument = async (docId: string) => {
        try {
            // Prepare the data for the request
            const bodyData = {
                documentID: docId,
                groupID: groupID
                // Include other necessary fieldsx
            };

    
            // Make the API call
            const response = await customFetch(`${Endpoints.deletePinnedDocument}`, {
                method: "DELETE",
                body: JSON.stringify(bodyData),
            });
    

            if (!response.ok) {
                throw new Error('Failed to update the document: ', );
            }
                // If the update is successful, update the documents state
            setDocuments(docs => docs.filter(d => d._id != docId));
        } catch (error) {
            console.error('Failed to edit document:', error);
            // Handle errors, e.g., by setting an error state or showing a message
        }
        // Use the DELETE /api/group/deletePinnedDocument route
    };
    const handleEditDocument = async (doc: Document) => {
        try {
            // Prepare the data for the request
            const bodyData = {
                documentID: doc._id,
                groupID: groupID,
                name: nameEdit,
                description: descriptionEdit,
                // Include other necessary fieldsx
            };

    
            // Make the API call
            const response = await customFetch(`${Endpoints.editPinnedDocument}`, {
                method: 'POST',
                body: JSON.stringify(bodyData),
            });
    
            doc.name = nameEdit;
            doc.description = descriptionEdit;

            if (!response.ok) {
                throw new Error('Failed to update the document: ', );
            }
    
            setEditingDocumentId(null);
            // If the update is successful, update the documents state
            setDocuments(docs => docs.map(d => d._id === doc._id ? doc : d));
        } catch (error) {
            console.error('Failed to edit document:', error);
            // Handle errors, e.g., by setting an error state or showing a message
        }
    };


    //handleEditDocument

    // Function to initiate editing
const startEditing = (item: any) => {
    setEditingDocumentId(item._id);
    setNameEdit(item.name); // Set initial value to item's current name
    setDescriptionEdit(item.description); // Set initial value to item's current description
};



    const renderItem = ({ item }: { item: Document }) => {
        const isEditing = editingDocumentId === item._id;


        return (
            <View style={styles.itemContainer}>
                <Icon
                    name="file-document-outline"
                    size={24}
                    color={colors.purple}
                    onPress={() => Linking.openURL(item.link)}
                    style={styles.documentIcon}
                />
                {isEditing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={nameEdit}
                            onChangeText={(text) => setNameEdit(text)}
                            placeholder={item.name}
                        />
                        <TextInput
                            style={styles.input}
                            value={descriptionEdit}
                            onChangeText={(text) => setDescriptionEdit(text)}
                            placeholder={item.description}
                        />
                        <Button
                            title="Done"
                            color={colors.purple}
                            onPress={() => handleEditDocument(item)}
                        />
                    </>
                ) : (
                    <View style={styles.infoContainer}>
                        <TouchableOpacity onPress={() => {}}>
                            <Text style={styles.documentTitle}>{item.name}</Text>
                            <Text style={styles.documentDescription}>{item.description}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                 {!isEditing && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity onPress={() => startEditing(item)}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                        <Icon name="delete" size={24} color={colors.red} onPress={() => handleDeleteDocument(item._id)} />
                    </View>
                )}
            </View>
        );
    };
    

    const handleFileSelection = () => {
        (fileInputRef.current as any)?.click();
      };
      const [selectedFile, setSelectedFile] = useState<File | null>(null);

      
      const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          setSelectedFile(file); // Save the file to state
          //await uploadDocument(file);
          // Proceed with your logic to handle the file
        }
      };



    return (
        <View style={styles.container}>
             <Text
                style={{
                    alignSelf: "flex-start",
                    fontWeight: "600",
                    fontSize: 27,
                    fontFamily: "Montserrat",
                    margin: 10
                }}
                >
                Manage Pinned Documents
            </Text>
            <FlatList
                data={documents}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                />
                <View style={styles.addDocumentContainer}>
                    <TextInput
                        style={styles.input}
                        value={newTitle}
                        onChangeText={setNewTitle}
                        placeholder="New Document Title"
                    />
                    <TextInput
                        style={styles.input}
                        value={newDescription}
                        onChangeText={setNewDescription}
                        placeholder="New Document Description"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                    <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'center' }}>
                        <TouchableOpacity style={{ flexDirection: 'row'}}onPress={handleFileSelection}>
                            <Text style={{ fontFamily: 'Montserrat', fontSize: 15, marginRight: 2 }}>Upload PDF</Text>
                            <Icon name="paperclip" size={22} color={colors.purple}></Icon>
                        </TouchableOpacity>
                        {selectedFile && (
                            <Text style={{ fontFamily: 'Montserrat', fontSize: 15, marginLeft: 8 }}>
                                {selectedFile.name}
                            </Text>
                        )}
                    </View>

                    <Button
                        title={isUploading ? "Uploading..." : "Add Document"}
                        onPress={handleAddDocument}
                        color={colors.purple}
                        disabled={isUploading}
                    />
                    </View>
        </View>
      );
    };

const styles = StyleSheet.create({
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 10, // Space after the document icon
    },
    container: {
      flex: 1,
      padding: 10,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingLeft: 10, // Consistent spacing from the info
    },
    documentIcon: {
        marginRight: 10, // Ensure some space between the icon and the text
    },
    title: {
      fontFamily: 'Montserrat',
      fontSize: 20,
      marginBottom: 16,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#e1e1e1',
    },
    documentTitle: {
      fontFamily: 'Montserrat',
      fontSize: 16,
    },
    documentDescription: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      color: '#666',
    },
    iconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
        fontFamily: 'Montserrat',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        marginVertical: 4,
      },
    addButton: {
      backgroundColor: colors.purple,
      padding: 10,
      borderRadius: 5,
      width: 200,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10
    },
    buttonText: {
      fontFamily: 'Montserrat',
      color: colors.white,
    },
    editModal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: '50%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 5,
      elevation: 5,
    },
    editText: {
        color: colors.purple,
        fontFamily: 'Montserrat',
        marginRight: 10, // Adjust this value as needed to space items
    },
    addDocumentContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1',
      },
      
  });
  
  export default DocumentList;
  