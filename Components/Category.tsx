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

type DropdownItem = {
  label: string;
  value: string;
};

interface CategoryProps {
  issueId: string; // Assuming issueId is a string
  categories: CategoryPost[];
  // ... other props if any
}

const Category: React.FC<CategoryProps> = ({ issueId, categories }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[] | null>(null);
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [valueChanged, setValueChanged] = useState(false);

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
    if (valueChanged) {
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
          //fake set the category here
          //console.log("Categories added successfully");
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
      const updatedValue = value
        ? [...new Set([...value, newCategoryName])]
        : [newCategoryName];

      console.log("UPDATED VALUE", updatedValue);
      console.log("ISSUE ID", issueId);
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

        // Update categories in context

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
        zIndex: 1,
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
