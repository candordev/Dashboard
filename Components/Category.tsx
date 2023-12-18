import React, { useState, useEffect } from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ProfileRow from "./ProfileRow";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useCategoryContext } from "../Hooks/useCategoryContext";
import { StyleSheet } from 'react-native';
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import {event, eventNames} from '../Events';
import { useNavigationState } from '../Structure/NavigationProvider';
import {setCategories} from '../Structure/CategoriesContext';
import AddCategory from "./AddCategory";
import OrFullWidth from "./OrFullWidth";



type DropdownItem = {
  label: string;
  value: string;
};

interface CategoryProps {
  issueId: string; // Assuming issueId is a string
  // ... other props if any
}


const Category: React.FC<CategoryProps> = ({ issueId }) => {
  const [open, setOpen] = useState(false);
  const {categoriesState, categoriesDispatch} = useCategoryContext();
  const [value, setValue] = useState<string[] | null>(null);
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [valueChanged, setValueChanged] = useState(false);
  const { setIsCategoryOpen } = useNavigationState();

  // useEffect(() => {
  //   setIsCategoryOpen(true);
  //   return () => setIsCategoryOpen(false);
  // }, []);

    // useEffect(() => {
    //   // Transform the categories to the format required by DropDown
    //   const transformedCategories = categoriesState.categories.map((category: { name: any; }) => ({
    //     label: category.name,
    //     value: category.name,
    //   }));

    //   setItems(transformedCategories);
    // }, [categoriesState.categories]);


    useEffect(() => {
      // Transform the categories to the format required by DropDown
      console.log("values reset here")
      const transformedCategories = categoriesState.categories.map((category: { name: any; }) => ({
        label: category.name,
        value: category.name,
      }));
  
      setItems(transformedCategories);
  
      // Find categories associated with the issueId
      const associatedCategories = categoriesState.categories
        .filter((category: { posts: string | string[]; }) => category.posts.includes(issueId))
        .map((category: { name: any; }) => category.name);
  
      setValue(associatedCategories); // Set these as the selected values in dropdown
    }, [categoriesState.categories, issueId]);


    

    const handleValueChange = (newValues: ValueType[] | null) => {
      console.log("Selected values changed to:", newValues);
      if(newValues != null){
         setValue(newValues as string[]); // Use type assertion here
         setValueChanged(true); // Indicate that the value has changed
      }

    };
    
    
  
    const handleDropdownClose = async () => {
      if (valueChanged) {
        console.log("Dropdown closed with new value:", value);
        //setValue(value)
        
        // Check if value is not null and has selected categories
       
          try {
            let res = await customFetch(Endpoints.addCategory, {
              method: 'POST',
              body: JSON.stringify({
                postID: issueId, // Assuming issueId is available in this component
                names: value,
              }),
            });
    
            if (!res.ok) {
              const resJson = await res.json();
              console.error("Error adding categories:", resJson.error);
            } else {
              //console.log("Categories added successfully");
              setIsCategoryOpen(true)
              
              setCategories(categoriesDispatch)
              //event.emit(eventNames.ISSUE_CATEGORY_SET);
             
              

              // You can handle any additional state updates or notifications here
            }
          } catch (error) {
            console.error("Network error, please try again later.", error);
          }
        
        //ISSUE_CATEGORY_SET = "issueCategorySet",
       
    
        // Reset the value changed tracker
        setValueChanged(false);
      }
    };
    
    const handleNewCategory = async (newCategoryName: string) => {
      try {
        const updatedValue = value ? [...new Set([...value, newCategoryName])] : [newCategoryName];

       console.log("UPDATED VALUE", updatedValue)
       console.log("ISSUE ID", issueId)
        let res = await customFetch(Endpoints.addCategory, {
          method: 'POST',
          body: JSON.stringify({
            postID: issueId,
            names: updatedValue,
          }),
        });
  
        if (!res.ok) {
          const resJson = await res.json();
          console.error("Error adding new category:", resJson.error);
        } else {
          console.log("New Category added successfully");
  
          // Update categories in context
          setCategories(categoriesDispatch);
          setIsCategoryOpen(true)
  
          // Optionally, update local state to include the new category
          //setItems(prevItems => [...prevItems, { label: newCategoryName, value: newCategoryName }]);
          //setValue(prevValue => [...(prevValue || []), newCategoryName]);
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }
    };
  



  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        minHeight: open ? 210 : undefined,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Category
      </Text>
      <DropDownPicker
        multiple={true}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue} // Directly set value using the provided setter
        setItems={setItems}
        onChangeValue={handleValueChange}
        onClose={handleDropdownClose} // Handle when dropdown closes
        dropDownDirection="BOTTOM"
        style={{
            borderColor: colors.lightgray,
            borderWidth: 1,
            backgroundColor: colors.white,
            marginTop: 10,
            minHeight: 30,
        }}
        
        textStyle={{
          fontSize: 15,
          color: colors.black,
          fontWeight: "500",
          fontFamily: "Montserrat",
        }}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={[
          {
            borderTopWidth: 1,
            backgroundColor: colors.white,
            borderColor: colors.lightgray,
            marginTop: 10,
          },
        ]}
        ArrowDownIconComponent={() => (
          <FeatherIcon name={"chevron-down"} size={20} color={colors.gray} />
        )}
        ArrowUpIconComponent={() => (
          <FeatherIcon name={"chevron-up"} size={20} color={colors.gray} />
        )}
        TickIconComponent={() => (
            <FeatherIcon name={"check"} size={17} color={colors.gray} />
        )}
      />
       {/* View to display selected categories */}
       <View style={{ marginTop: 15,}}>
        {value && value.map((category, index) => (
          <Text key={index} style={styles.categoryText}>
            {category}
          </Text>
        ))}
      </View>
          <View>
            <OrFullWidth />
            <AddCategory onCategoryAdded={handleNewCategory} />
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  categoryText: {
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
    fontFamily: "Montserrat",
  },
  // ... other styles ...
});



export default Category;
