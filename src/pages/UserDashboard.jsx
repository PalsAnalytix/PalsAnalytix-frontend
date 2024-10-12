import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../redux/slices/userSlice";
import {
  Mail,
  Shapes,
  Phone,
  Loader,
  CreditCard,
  Calendar,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import WhatsAppModal from "../components/WhatsappModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDetails = ({
  name,
  email,
  picture,
  phoneNo,
  subscriptionId,
  expiryDate,
  currentChapterForWhatsapp,
  currentCourseForWhatsapp,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0">
            <img
              src={picture}
              alt={name}
              className="h-24 w-24 rounded-md object-cover border-2 border-gray-200"
            />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 truncate">
              {name}
            </h2>
            <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start mt-1">
              <Mail className="w-4 h-4 mr-2" />
              {email}
            </p>
            <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start mt-1">
              <Phone className="w-4 h-4 mr-2" />
              {phoneNo || "Not Available"}
            </p>
          </div>
        </div>
        <div className="mt-5 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Subscription
            </span>
            {subscriptionId ? (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {subscriptionId}
              </span>
            ) : (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                No Subscription
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Expiry Date
            </span>
            {expiryDate ? (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {expiryDate}
              </span>
            ) : (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                N/A
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Current Course (WhatsApp)
            </span>
            {currentCourseForWhatsapp ? (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {currentCourseForWhatsapp}
              </span>
            ) : (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                N/A
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Current Chapter (WhatsApp)
            </span>
            {currentChapterForWhatsapp ? (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {currentChapterForWhatsapp}
              </span>
            ) : (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                N/A
              </span>
            )}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Update WhatsApp Details
            </button>
          </div>
        </div>
      </div>
      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];
const TOTAL_QUESTIONS = 300; // per exam type

const CustomLabel = ({ viewBox, value1, value2, value3 }) => {
  const { cx, cy } = viewBox;
  return (
    <text
      x={cx}
      y={cy}
      fill="#333"
      textAnchor="middle"
      dominantBaseline="central"
    >
      <tspan x={cx} dy="-1.2em" fontSize="24" fontWeight="bold">
        {value1 + value2 + value3}
      </tspan>
      <tspan x={cx} dy="1.6em" fontSize="14">
        Total
      </tspan>
    </text>
  );
};

const UserStats = ({ questionStats }) => {
  const data = [
    { name: "CFA", value: questionStats.CFA },
    { name: "FRM", value: questionStats.FRM },
    { name: "SCR", value: questionStats.SCR },
  ];

  const totalAnswered = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-indigo-100 w-full lg:w-1/2 lg:ml-4 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-indigo-900">
        Question Statistics
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  content={
                    <CustomLabel
                      value1={questionStats.CFA}
                      value2={questionStats.FRM}
                      value3={questionStats.SCR}
                    />
                  }
                  position="center"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-2/3 md:pl-6">
          <div className="grid grid-cols-3 gap-4">
            {data.map((entry, index) => (
              <div key={entry.name} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-4 h-4 rounded-full mr-2`}
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="font-semibold text-lg">{entry.name}</span>
                </div>
                <p className="text-2xl font-bold">{entry.value}</p>
                <p className="text-sm text-gray-600">of {TOTAL_QUESTIONS}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold">Total Progress</p>
            <p className="text-3xl font-bold text-indigo-600">
              {totalAnswered} / {TOTAL_QUESTIONS * 3}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();
  const userData = useSelector((state) => state.userDetails);
  const { loading, error, questionStats } = userData;

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      dispatch(fetchUserData(user.sub));
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-blue-500" size={48} />
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && userData && (
          <div className="flex flex-col lg:flex-row justify-center">
            <UserDetails
              name={userData.name}
              email={userData.email}
              picture={userData.picture}
              phoneNo={userData.phoneNo}
              subscriptionId={userData.subscriptionId}
              expiryDate={userData.expiryDate}
              currentChapterForWhatsapp={userData.currentChapterForWhatsapp}
              currentCourseForWhatsapp={userData.currentCourseForWhatsapp}
            />
            <UserStats questionStats={userData.questionStats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
