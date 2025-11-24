import { CATEGORIES } from '../../utils/constants';
import './Statistics.css';

const Statistics = ({ stats }) => {
  const { overview, categories } = stats;

  const getCategoryIcon = (categoryValue) => {
    const category = CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : '📌';
  };

  return (
    <div className="statistics">
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{overview.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{overview.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{overview.pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card high">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>{overview.highPriority}</h3>
            <p>High Priority</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="category-stats">
        <h3>Tasks by Category</h3>
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat._id} className="category-item">
              <span className="category-label">
                {getCategoryIcon(cat._id)}
              </span>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;