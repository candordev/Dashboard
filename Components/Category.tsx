import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import AddCategory from "./AddCategory";
import OrFullWidth from "./OrFullWidth";
import Text from "./Text";
import { CategoryPost } from "../utils/interfaces";
import { useUserContext } from "../Hooks/useUserContext";
import OuterComponentView from "./PopoverComponentView";

type DropdownItem = {
  label: string;
  value: string;
};

interface CategoryProps {
  issueId?: string; // Assuming issueId is a string
  createPost: boolean;
  onCategoryChange?: (option: string[] | null) => void;
  // ... other props if any
}

const Category: React.FC<CategoryProps> = ({ issueId, createPost, onCategoryChange }) => {
  const {state, dispatch} = useUserContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[] | null>(null);
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [valueChanged, setValueChanged] = useState(false);
  const [categories, setCategories] = useState<CategoryPost[]>([]);
  const [categoryError, setCategoryError] = useState("");


  const getCategories = async () => {
    try {
        console.log("THESE THE LEADER GROUPS", state.leaderGroups[0]);
        
        // Initialize URLSearchParams
        let params = new URLSearchParams({
            groupID: state.leaderGroups[0] // This parameter is always included
        });

        // Add postID only if issueId is defined
        if (issueId && !createPost) {
            params.append('postID', issueId);
        }

        let endpoint = Endpoints.getCategoryForPost + params;

        const res = await customFetch(endpoint, {
            method: 'GET',
        });

        const resJson = await res.json();
        if (!res.ok) {
            console.error(resJson.error);
            return;
        }

        const result = resJson; // Assuming resJson is an array of CategoryPost
        console.log("CATEGORIES ARE...", result);
        setCategories(result);
    } catch (error) {
        console.error("Error loading categories. Please try again later.", error);
    }
};


useEffect(() => {
  getCategories();
}, []); // Depend on categories prop


  useEffect(() => {
    // Map categories to dropdown items
    const dropdownItems = categories.map((category) => ({
      label: category.name,
      value: category.name,
    }));

    // Find which categories are checked
    const checkedCategories = categories
      .filter((category) => category.checked)
      .map((category) => category.name);

    setItems(dropdownItems);
    setValue(checkedCategories.length > 0 ? checkedCategories : null);
  }, [categories]); // Depend on categories prop


  const handleValueChange = (newValues: ValueType[] | null) => {
    console.log("Selected values changed to:", newValues);
    if (newValues != null) {
      setValue(newValues as string[]); // Use type assertion here
      setValueChanged(true); // Indicate that the value has changed
    }
  };

  const updateDropdownAndSelection = (newCategoryName: string) => {
    let updatedItems = [...items];

    updatedItems.push({
      label: newCategoryName,
      value: newCategoryName,
    });

    // Update items state
    setItems(updatedItems);

    // Update selected values to include new leader and department
    let updatedValue = value ? [...value, newCategoryName] : [newCategoryName];
    setValue(updatedValue);
  };

  const handleDropdownClose = async () => {
    if (valueChanged && !createPost ) {
      console.log("Dropdown closed with new value:", value);
      //setValue(value)

      // Check if value is not null and has selected categories

      try {
        let res = await customFetch(Endpoints.addCategory, {
          method: "POST",
          body: JSON.stringify({
            postID: issueId, // Assuming issueId is available in this component
            names: value,
          }),
        });
        if (!res.ok) {
          const resJson = await res.json();
          console.error("Error adding categories:", resJson.error);
        } else {
          console.log("Categories added successfully");
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }

      setValueChanged(false);
    }else{
      if(onCategoryChange){
        onCategoryChange(value);
      }
    }
  };

  const handleNewCategory = async (newCategoryName: string) => {
    setCategoryError("");

    const categoryExists = items.some(item => item.label === newCategoryName);
    if (categoryExists) {
      setCategoryError("Category already exists.");
      return;
    }
    if(!createPost){
        try {
          const updatedValue = value
            ? [...new Set([...value, newCategoryName])]
            : [newCategoryName];


          let res = await customFetch(Endpoints.addCategory, {
            method: "POST",
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
            updateDropdownAndSelection(newCategoryName);

          }
        } catch (error) {
          console.error("Network error, please try again later.", error);
    }
  }else{
    try {
      const updatedValue = value
        ? [...new Set([...value, newCategoryName])]
        : [newCategoryName];


      let res = await customFetch(Endpoints.addCategoryCreatePost, {
        method: "POST",
        body: JSON.stringify({
          groupID: state.leaderGroups[0],
          names: [newCategoryName],
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error adding new category:", resJson.error);
      } else {
        console.log("New Category added successfully");
        updateDropdownAndSelection(newCategoryName);
        if(onCategoryChange){
          onCategoryChange(updatedValue);
        }
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
}
  }
  };

  return (
    <OuterComponentView
      style={{
        zIndex: 1,
      }}
      title="Category"
    >
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
            height: 120
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
      <View style={{ marginTop: 15 }}>
        {value &&
          value.map((category, index) => (
            <Text key={index} style={styles.categoryText}>
              {category}
            </Text>
          ))}
      </View>
      <View>
        <OrFullWidth />
        {categoryError !== "" && (
          <Text style={styles.errorText}>{categoryError}</Text>
         )}
        <AddCategory onCategoryAdded={handleNewCategory} />
      </View>
    </OuterComponentView>
  );
};

const styles = StyleSheet.create({
  categoryText: {
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
    fontFamily: "Montserrat",
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 0,
    fontFamily: "Montserrat",
  },
  // ... other styles ...
});

export default Category;
