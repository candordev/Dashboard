import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
import DropDown from "./DropDown";

type DropdownItem = {
  label: string;
  value: string;
};

interface CategoryProps {
  issueId?: string; // Assuming issueId is a string
  createPost: boolean;
  onCategoryChange?: (option: string[] | null) => void;
  style?: any;
  // ... other props if any
}

const Category: React.FC<CategoryProps> = ({
  issueId,
  createPost,
  onCategoryChange,
  style,
}) => {
  const { state, dispatch } = useUserContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[] | null>(null);
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [valueChanged, setValueChanged] = useState(false);
  const [categories, setCategories] = useState<CategoryPost[]>([]);
  const [categoryError, setCategoryError] = useState("");

  const getCategories = async () => {
    try {
      // console.log("THESE THE LEADER GROUPS",state.currentGroup);

      // Initialize URLSearchParams
      let params = new URLSearchParams({
        groupID:state.currentGroup, // This parameter is always included
      });

      // Add postID only if issueId is defined
      if (issueId && !createPost) {
        params.append("postID", issueId);
      }

      let endpoint = Endpoints.getCategoryForPost + params;

      const res = await customFetch(endpoint, {
        method: "GET",
      });

      const resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
        return;
      }

      const result = resJson; // Assuming resJson is an array of CategoryPost
      // console.log("CATEGORIES ARE...", result);
      setCategories(result);
    } catch (error) {
      console.error("Error loading categories. Please try again later.", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [issueId]); // Depend on categories prop

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
    // console.log("new valee", newValues as string[]);
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
    if (valueChanged && !createPost) {
      // console.log("Dropdown closed with new value:", value);
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
          // console.log("Categories added successfully");
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }

      setValueChanged(false);
    } else {
      if (onCategoryChange) {
        onCategoryChange(value);
      }
    }
  };

  const handleNewCategory = async (newCategoryName: string) => {
    setCategoryError("");

    const categoryExists = items.some((item) => item.label === newCategoryName);
    if (categoryExists) {
      setCategoryError("Category already exists.");
      return;
    }
    if (!createPost) {
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
          // console.log("New Category added successfully");
          updateDropdownAndSelection(newCategoryName);
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }
    } else {
      try {
        const updatedValue = value
          ? [...new Set([...value, newCategoryName])]
          : [newCategoryName];

        let res = await customFetch(Endpoints.addCategoryCreatePost, {
          method: "POST",
          body: JSON.stringify({
            groupID:state.currentGroup,
            names: [newCategoryName],
          }),
        });

        if (!res.ok) {
          const resJson = await res.json();
          console.error("Error adding new category:", resJson.error);
        } else {
          // // console.log("New Category added successfully");
          updateDropdownAndSelection(newCategoryName);
          if (onCategoryChange) {
            onCategoryChange(updatedValue);
          }
        }
      } catch (error) {
        console.error("Network error, please try again later.", error);
      }
    }
  };

  return (
    <OuterComponentView style={[style, {maxHeight: 400, flexGrow: 1}]} title="Tag">
      <DropDown
        placeholder="Select tag"
        value={value}
        setValue={handleValueChange}
        items={items}
        setItems={setItems}
        multiple={true}
        backgroundColor={colors.lightestgray}
        onClose={handleDropdownClose}
        multipleText={`${value?.length ?? 0} ${
          (value?.length ?? 0) == 1 ? "tag" : "tags"
        } selected`}
      />
      {/* View to display selected categories */}
      <ScrollView style={{ maxHeight: 150 }} contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
      }}>
      <View style={{ marginTop: 15 }}>
          {value &&
            value.map((category, index) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                }}
              >
                <FeatherIcon name="tag" size={15} color={colors.purple} />
                <Text key={index} style={styles.categoryText}>
                  {category}
                </Text>
              </View>
            ))}    
      </View>
      </ScrollView>
      <ScrollView>
      <View>
        <OrFullWidth />
        {categoryError !== "" && (
          <Text style={{color: colors.red}}>{categoryError}</Text>
        )}
        <AddCategory onCategoryAdded={handleNewCategory} /> 
      </View>
      </ScrollView>
    </OuterComponentView>
  );
};

const styles = StyleSheet.create({
  categoryText: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  // ... other styles ...
});

export default Category;
