import React, { useMemo } from "react";
import { Lock, Calendar, Award, CheckCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

export const StreakCalendar = ({
  questions,
  isPremium = false,
  maxStreak = 0,
  currentStreak = 0,
}) => {

  
  // Generate all dates for the past year
  const yearDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() + 1);

    let currentDate = new Date(oneYearAgo);
    while (currentDate <= today) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }, []);

  // Check if a question was attempted on a specific date
  const wasDateAttempted = (date) => {
    if (!questions || !Array.isArray(questions)) return false;
    const dateString = date.toISOString().split("T")[0];

    return questions.some((question) => {
      if (!question.attemptDetails || !question.attemptDetails.attemptedAt)
        return false;
      const attemptDate = new Date(question.attemptDetails.attemptedAt)
        .toISOString()
        .split("T")[0];
      return attemptDate === dateString;
    });
  };

  // Track total attempts
  const totalAttempts = useMemo(() => {
    if (!questions || !Array.isArray(questions)) return 0;
    return yearDates.filter((date) => wasDateAttempted(date)).length;
  }, [questions, yearDates]);

  // Organize dates into months with precise control over ordering
  const groupedByMonth = useMemo(() => {
    // First, group by month
    const grouped = {};
    yearDates.forEach((date) => {
      // Create a key that ensures proper sorting: YYYY-MM format
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // +1 because getMonth() is 0-indexed
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!grouped[key]) {
        grouped[key] = {
          monthName: date.toLocaleString("default", { month: "short" }),
          year: year,
          days: [],
        };
      }
      grouped[key].days.push(date);
    });

    // Convert to array and sort in reverse chronological order (newest first)
    return Object.entries(grouped)
      .sort((a, b) => b[0].localeCompare(a[0])) // Sort by key (YYYY-MM) in descending order
      .map(([_, value]) => value);
  }, [yearDates]);

  // Get activity level description
  const getActivityLevel = () => {
    if (totalAttempts === 0) return "No activity";
    if (totalAttempts < 10) return "Just starting";
    if (totalAttempts < 30) return "Building habit";
    if (totalAttempts < 60) return "Consistent";
    if (totalAttempts < 100) return "Dedicated";
    return "Outstanding";
  };

  const navigate = useNavigate();

  // Get activity color
  const getActivityColor = () => {
    if (totalAttempts === 0) return "text-gray-400";
    if (totalAttempts < 10) return "text-blue-500";
    if (totalAttempts < 30) return "text-green-500";
    if (totalAttempts < 60) return "text-emerald-500";
    if (totalAttempts < 100) return "text-purple-500";
    return "text-orange-500";
  };

  return (
    <div className="bg-gray-900 rounded-lg py-10 shadow-md overflow-hidden text-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">
            <span className="text-white">{totalAttempts}</span> submissions in
            the past one year
          </h2>
          {!isPremium && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
              <Lock className="w-3 h-3 mr-1" />
              Premium Feature
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-sm">
            Total active days:{" "}
            <span className="text-white font-medium">{totalAttempts}</span>
          </div>
          {/* <div className="text-sm">
            Max streak: <span className="text-white font-medium">{maxStreak}</span>
          </div> */}
          {/* <div className="relative">
            <button className="flex items-center text-sm bg-gray-800 px-3 py-1 rounded">
              Current
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Calendar */}
      <div className="relative w-full py-4">
        {!isPremium && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-md">
            <Lock className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-300">Premium Feature</p>
            <p className="text-s text-gray-400 mt-1 text-center px-4">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/pricing"); }} className="text-blue-500 hover:text-blue-600 font-medium transition duration-200">
                Upgrade </a> to view your streak history
            </p>
          </div>
        )}

        {/* Main calendar grid - displayed in reverse chronological order */}
        <div className="flex flex-row-reverse justify-between w-full flex-nowrap">
          {groupedByMonth.map((monthData, monthIndex) => {
            // Group days by week for grid layout
            const weeks = [];
            let currentWeek = [];

            // Sort days within the month
            const sortedDays = [...monthData.days].sort(
              (a, b) => a.getDate() - b.getDate()
            );

            // Get the first day of the month to determine day of week
            const firstDayOfMonth = new Date(sortedDays[0]);
            firstDayOfMonth.setDate(1);
            const firstDayOfWeek = firstDayOfMonth.getDay();

            // Fill with empty cells for the first week
            for (let i = 0; i < firstDayOfWeek; i++) {
              currentWeek.push(null);
            }

            // Add all days of the month in order
            sortedDays.forEach((date) => {
              if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
              }
              currentWeek.push(date);
            });

            // Add the last week if not empty
            if (currentWeek.length > 0) {
              // Fill remainder of last week with nulls
              while (currentWeek.length < 7) {
                currentWeek.push(null);
              }
              weeks.push(currentWeek);
            }

            // Display month name with year if it's January or the first month in the display
            const monthLabel =
              monthData.monthName === "Jan" ||
              monthIndex === groupedByMonth.length - 1
                ? `${monthData.monthName} ${monthData.year}`
                : monthData.monthName;

            return (
              <div key={monthIndex} className="flex flex-col items-center px-1">
                {/* Weeks grid */}
                <div className="flex flex-col gap-px">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex gap-px">
                      {week.map((date, dayIndex) => {
                        if (!date)
                          return (
                            <div
                              key={`empty-${dayIndex}`}
                              className="w-3 h-3"
                            ></div>
                          );

                        const isAttempted = wasDateAttempted(date);

                        return (
                          <div
                            key={dayIndex}
                            data-tooltip-id={`tooltip-${monthIndex}-${weekIndex}-${dayIndex}`}
                            className={`w-3 h-3 rounded-sm my-0.5 mx-0.2 ${
                              isAttempted ? "bg-green-500" : "bg-gray-700"
                            }`}
                          >
                            <Tooltip
                              id={`tooltip-${monthIndex}-${weekIndex}-${dayIndex}`}
                              place="top"
                              content={`${date.toDateString()}${
                                isAttempted ? " - Attempted" : " - No attempt"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Month label at the bottom */}
                <div className="mt-1 text-xs text-gray-500">{monthLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
