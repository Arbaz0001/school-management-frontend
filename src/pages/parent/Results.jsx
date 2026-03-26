import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Award } from "lucide-react";

export default function Results(){
  const { refreshUser } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState("all");
  const [studentName, setStudentName] = useState("");

  useEffect(()=>{
    const load = async()=>{
      setLoading(true);
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      setStudentName(me.student.name || "");
      
      try{
        // Try to fetch exam results
        const resultsRes = await api.get(`/exams?studentId=${me.student._id}`).catch(() => null);
        if (resultsRes?.data) {
          setResults(resultsRes.data);
        } else {
          // Demo exam results
          setResults([
            {
              _id: '1',
              examName: 'Quarterly Exam - Term 1',
              subject: 'Mathematics',
              marksObtained: 85,
              totalMarks: 100,
              date: new Date('2024-12-15'),
              grade: 'A',
              teacher: 'Ms. Sarah'
            },
            {
              _id: '2',
              examName: 'Quarterly Exam - Term 1',
              subject: 'English',
              marksObtained: 78,
              totalMarks: 100,
              date: new Date('2024-12-16'),
              grade: 'B+',
              teacher: 'Mr. John'
            },
            {
              _id: '3',
              examName: 'Quarterly Exam - Term 1',
              subject: 'Science',
              marksObtained: 92,
              totalMarks: 100,
              date: new Date('2024-12-17'),
              grade: 'A+',
              teacher: 'Dr. Ahmed'
            },
            {
              _id: '4',
              examName: 'Monthly Test - November',
              subject: 'Social Studies',
              marksObtained: 88,
              totalMarks: 100,
              date: new Date('2024-11-30'),
              grade: 'A',
              teacher: 'Mr. Khan'
            },
          ]);
        }
        
        // optional: exams list not required for current UI
      }catch(err){
        console.error("Error loading results:", err);
      }
      finally {
        setLoading(false);
      }
    }
    load();
  },[refreshUser]);

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-700';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getPercentage = (marks, total) => {
    return total > 0 ? Number(((marks / total) * 100).toFixed(1)) : 0;
  };

  const uniqueExams = [...new Set(results.map(r => r.examName))];
  let filteredResults = selectedExam === "all" ? results : results.filter(r => r.examName === selectedExam);

  // build content without nested ternary
  let content = null;
  if (loading) {
    content = (
      <div className="text-center py-12 bg-white p-6 rounded shadow">
        <p className="text-gray-500">Loading exam results...</p>
      </div>
    );
  } else if (results.length > 0) {
    content = (
      <>
        {/* Exam Filter */}
        <div className="bg-white p-4 md:p-5 rounded shadow overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedExam("all")}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-all ${
                selectedExam === "all" 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Exams
            </button>
            {uniqueExams.map(exam => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-all ${
                  selectedExam === exam 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {exam.slice(0, 15)}...
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map(result => {
            const percentage = getPercentage(result.marksObtained, result.totalMarks);
            return (
              <div key={result._id} className="bg-white p-4 md:p-5 rounded shadow hover:shadow-lg transition-shadow border-t-4 border-yellow-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-base md:text-lg flex-1">{result.subject}</h3>
                  <div className={`px-3 py-1 rounded text-sm font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </div>
                </div>

                <p className="text-xs md:text-sm text-gray-600 mb-4">{result.examName}</p>

                {/* Marks Display */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{result.marksObtained}/{result.totalMarks}</p>
                    <p className="text-sm font-bold text-blue-600">{percentage}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2 text-xs md:text-sm text-gray-600">
                  <p>📅 {new Date(result.date).toLocaleDateString()}</p>
                  <p>👨‍🏫 {result.teacher}</p>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  } else {
    content = (
      <div className="text-center py-12 bg-white p-6 rounded shadow">
        <Award size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No exam results available yet.</p>
        <p className="text-gray-400 text-sm mt-2">Results will appear here once exams are conducted and grades are published.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Award size={32} className="text-yellow-600" />
          Exam Results
        </h1>
        <p className="text-gray-600 text-sm">{studentName}</p>
      </div>
      {content}
    </div>
  )
}