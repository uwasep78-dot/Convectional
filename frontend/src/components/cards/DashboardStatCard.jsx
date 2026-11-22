export function DashboardStatCard({ title, value, subtitle, trend, icon: Icon }) {
  return (
    <div className="stat-card">
      {Icon && <div className="stat-icon"><Icon size={20} strokeWidth={2} /></div>}
      <div className="stat-content">
        <p className="stat-title text-muted text-sm">{title}</p>
        <div className="stat-value">{value}</div>
        {subtitle && <p className="stat-subtitle text-muted text-xs">{subtitle}</p>}
      </div>
      {trend && <span className={`stat-trend ${trend.positive ? 'positive' : 'negative'}`}>
        {trend.positive ? '↑' : '↓'} {trend.value}
      </span>}
    </div>
  )
}
