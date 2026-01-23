import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import "../../styles/finance.css";

const MoneyDateHeader = ({
  dateLabel,
  onPrevDay,
  onNextDay,
  onOpenCalendar,
}) => {
  return (
    <div className="money-date-header">
      <button
        className="date-nav-button"
        onClick={onPrevDay}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="money-date-center">
        <div className="money-date-text">
          {dateLabel}
        </div>
        <button
          className="calendar-button"
          onClick={onOpenCalendar}
        >
          <Calendar size={16} />
        </button>
      </div>

      <button
        className="date-nav-button"
        onClick={onNextDay}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default MoneyDateHeader;
