import React, { useState } from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import OuterComponentView from "./PopoverComponentView";
import DatePicker from "react-datepicker";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";

type DeadlineProps = {
  issue?: Post;
};

const Deadline: React.FC<DeadlineProps> = (props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(props.issue ? props.issue.deadline : ""));

  const handleDateChange = async (date: Date | null) => {
    try {
      let res = await customFetch(Endpoints.setDeadline, {
        method: "POST",
        body: JSON.stringify({
          postID: props.issue ? props.issue._id : "",
          deadline: date, // Assuming issueId is available in this component
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Error adding DEADLINE:", resJson.error);
      } else {
        console.log("DEADLINE added successfully");
        setSelectedDate(date);
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  };

  return (
    <OuterComponentView title={"Deadline"} style={{zIndex: 1}}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="Pp"
      />
    </OuterComponentView>
  );
};

export default Deadline;
