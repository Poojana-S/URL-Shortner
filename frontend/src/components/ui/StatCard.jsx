const StatCard = ({ label, value, icon: Icon, color = "brand", sub }) => {
  const colorMap = {
    brand: "text-brand-400 bg-brand-500/10",
    green: "text-green-400 bg-green-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    orange: "text-orange-400 bg-orange-500/10",
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-sm font-medium">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
            <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      {sub && <p className="text-xs text-white/30 truncate">{sub}</p>}
    </div>
  );
};

export default StatCard;
