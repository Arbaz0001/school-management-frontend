const StatCard = ({ title, value, icon, onClick, bg }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer flex items-center justify-between"
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>

      <div className={`p-3 rounded-full ${bg}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;