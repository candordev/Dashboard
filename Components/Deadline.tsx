import React, { createElement, forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import OuterComponentView from "./PopoverComponentView";
import colors from "../Styles/colors";
import "react-datepicker/dist/react-datepicker.css";
import "../Styles/DatePickerStyles.css";

type DeadlineProps = {
  issue?: Post;
  createPost?: boolean;
  onChange? : (date: Date | null) => void;
  style?: any;
};

const Deadline: React.FC<DeadlineProps> = (props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    props.issue ? new Date(props.issue.deadline) : null
  );

  useEffect(() => {
    setSelectedDate(props.issue ? new Date(props.issue.deadline) : null)
  }, [props.issue]); // Depend on categories prop

  const handleDateChange = async (date: Date | null) => {
    if (props.createPost && props.onChange) {
      setSelectedDate(date);
      props.onChange(date);
      return;
    }

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
    <OuterComponentView title={"Deadline"} style={props.style}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        className="custom-datepicker"
        //force popover to drop down
        popperPlacement="bottom-start"
      />
    </OuterComponentView>
  );
};

export default Deadline;
