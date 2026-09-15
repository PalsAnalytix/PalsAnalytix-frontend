import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { Bold, TrendingUp } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);


export const ProgressChart = () => {
  const {user} = useSelector((state) => state.auth)
  const metrics = user.ProgressMetrics;

  // Calculate completion percentages for each course
  const completionRates = Object.entries(metrics.courseWiseProgress).map(([course, data]) => {
    return {
      course,
      rate: Math.round((data.questionsAttempted / data.questionsReceived) * 100)
    };
  });

  // Find course with highest completion rate
  const bestCourse = [...completionRates].sort((a, b) => b.rate - a.rate)[0];

  // Colors matching the brand theme: sand for "received", brand orange for "attempted"
  const colors = {
    received: "rgba(155, 151, 145, 0.5)", // sand-500
    attempted: "rgba(255, 131, 5, 0.75)", // accent-orange2
    border: {
      received: "rgb(119, 115, 108)", // sand-700
      attempted: "rgb(255, 127, 0)" // accent-orange
    }
  };

  const labels = Object.keys(metrics.courseWiseProgress);
  const receivedData = labels.map(course => metrics.courseWiseProgress[course].questionsReceived);
  const attemptedData = labels.map(course => metrics.courseWiseProgress[course].questionsAttempted);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Received",
        data: receivedData,
        backgroundColor: colors.received,
        borderColor: colors.border.received,
        borderWidth: 3,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: "Attempted",
        data: attemptedData,
        backgroundColor: colors.attempted,
        borderColor: colors.border.attempted,
        borderWidth: 3,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 15,
          padding: 15,
          font: {
            size: 13,
            family: "'Source Sans 3', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(20, 19, 17, 0.95)",
        titleColor: "#faf9f6",
        bodyColor: "#d8d5cf",
        borderColor: "rgba(58, 55, 51, 1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label} Course`;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} questions`;
          },
          footer: (tooltipItems) => {
            const dataIndex = tooltipItems[0].dataIndex;
            const course = labels[dataIndex];
            const received = metrics.courseWiseProgress[course].questionsReceived;
            const attempted = metrics.courseWiseProgress[course].questionsAttempted;
            const completion = Math.round((attempted / received) * 100);
            return `Completion rate: ${completion}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(230, 226, 217, 1)",
          drawBorder: false,
        },
        ticks: {
          padding: 10,
          font: {
            size: 11,
          },
          color: "#77736c"
        },
        border: {
          dash: [4, 4]
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          padding: 10,
          font: {
            size: 11,
          },
          color: "#77736c"
        }
      }
    }
  };

  // Calculate overall completion percentage
  const totalReceived = receivedData.reduce((acc, curr) => acc + curr, 0);
  const totalAttempted = attemptedData.reduce((acc, curr) => acc + curr, 0);
  const overallCompletionRate = Math.round((totalAttempted / totalReceived) * 100);

  return (
    <div className="bg-white rounded-lg border border-sand-200 h-full font-sans">
      <div className="p-4 border-b border-sand-200">
        <div className="flex items-center gap-2 font-medium">
          <TrendingUp className="w-5 h-5 text-accent-orange2" />
          <span className="font-sora text-charcoal">Course Progress</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <div className="space-y-1">
            <p className="text-sm text-sand-600">Overall Completion</p>
            <p className="font-sora text-xl font-bold text-charcoal">{overallCompletionRate}%</p>
          </div>
          <div className="bg-accent-yellow/10 px-2.5 py-1 rounded-full text-xs font-medium text-accent-orange2 flex items-center">
            Best in {bestCourse.course}: {bestCourse.rate}%
          </div>
        </div>
        
        <div className="h-52 mt-4">
          <Bar data={data} options={options} />
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-sand-200 text-center">
          {Object.entries(metrics.courseWiseProgress).map(([course, data]) => {
            const completion = Math.round((data.questionsAttempted / data.questionsReceived) * 100);
            return (
              <div key={course} className="space-y-1">
                <p className="text-sm font-medium text-charcoal">{course}</p>
                <div className="relative w-full h-1.5 bg-sand-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-accent-orange2 rounded-full"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-xs font-medium text-sand-700">{completion}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
