import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Clock, Book, Calendar } from "lucide-react";

export default function Timetable(){
  const { refreshUser } = useContext(AuthContext);
  const [tt, setTt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("all");
  const [studentName, setStudentName] = useState("");

  useEffect(()=>{
    const load = async()=>{
      setLoading(true);
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      setStudentName(me.student.name || "");
      
      try {
        // Try to fetch from timetable endpoint
        const res = await api.get(`/timetable?class=${me.student.className}`).catch(() => null);
        
        if (res?.data) {
          setTt(res.data);
        } else {
          // Demo static timetable if no API available
          setTt([
            { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'English', teacher: 'Mr. John', room: '101' },
            { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Mathematics', teacher: 'Ms. Sarah', room: '102' },
            { day: 'Monday', time: '11:00 AM - 12:00 PM', subject: 'Science', teacher: 'Dr. Ahmed', room: '103' },
            { day: 'Monday', time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'Social Studies', teacher: 'Mr. Khan', room: '104' },
            { day: 'Tuesday', time: '10:00 AM - 11:00 AM', subject: 'Science', teacher: 'Dr. Ahmed', room: '103' },
            { day: 'Tuesday', time: '11:00 AM - 12:00 PM', subject: 'Mathematics', teacher: 'Ms. Sarah', room: '102' },
            { day: 'Tuesday', time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { day: 'Wednesday', time: '9:00 AM - 10:00 AM', subject: 'English', teacher: 'Mr. John', room: '101' },
            { day: 'Wednesday', time: '10:00 AM - 11:00 AM', subject: 'Hindi', teacher: 'Mrs. Devi', room: '105' },
            { day: 'Wednesday', time: '11:00 AM - 12:00 PM', subject: 'Science', teacher: 'Dr. Ahmed', room: '103' },
            { day: 'Wednesday', time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { day: 'Thursday', time: '9:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Ms. Sarah', room: '102' },
            { day: 'Thursday', time: '10:00 AM - 11:00 AM', subject: 'Computer Science', teacher: 'Mr. Sharma', room: '201' },
            { day: 'Thursday', time: '11:00 AM - 12:00 PM', subject: 'English', teacher: 'Mr. John', room: '101' },
            { day: 'Thursday', time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { day: 'Friday', time: '9:00 AM - 10:00 AM', subject: 'Science', teacher: 'Dr. Ahmed', room: '103' },
            { day: 'Friday', time: '10:00 AM - 11:00 AM', subject: 'Physical Education', teacher: 'Coach Raj', room: 'Ground' },
            { day: 'Friday', time: '11:00 AM - 12:00 PM', subject: 'Art & Craft', teacher: 'Mrs. Priya', room: '106' },
            { day: 'Friday', time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
          ]);
        }
      } catch (err) {
        console.error("Error loading timetable:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[refreshUser]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let filteredTt = selectedDay === "all" ? tt : tt.filter(t => t.day === selectedDay);

  // build content without nested ternary
  let content = null;
  if (loading) {
    content = (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading timetable...</p>
      </div>
    );
  } else if (filteredTt.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTt.map((slot) => (
          <div key={`${slot.day}-${slot.time}-${slot.subject}`} className="bg-white p-4 md:p-5 rounded shadow hover:shadow-lg transition-shadow border-l-4 border-blue-600">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-base md:text-lg text-blue-700">{slot.subject}</h3>
              <Book size={20} className="text-blue-400 shrink-0" />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Clock size={16} />
                {slot.time}
              </p>
              <p>👨‍🏫 {slot.teacher}</p>
              <p>📍 Room: {slot.room}</p>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    content = (
      <div className="text-center py-12 bg-white p-6 rounded shadow">
        <p className="text-gray-500">No timetable classes for this day</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Calendar size={32} className="text-blue-600" />
          Class Timetable
        </h1>
        <p className="text-gray-600 text-sm">{studentName}</p>
      </div>

      {/* Day Filter */}
      <div className="bg-white p-4 md:p-5 rounded shadow">
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => setSelectedDay("all")}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              selectedDay === "all" 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Days
          </button>
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                selectedDay === day 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable */}
      {content}
    </div>
  )
}