import { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { PRIORITIES, CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import './TaskFilter.css';

const TaskFilter = () => {
  const { filters, setFilters, fetchTasks } = useContext(TaskContext);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      completed: '',
      priority: '',
      category: '',
      search: '',
      sort: '-createdAt'
    });
  };

  // Apply filters
  const applyFilters = () => {
    fetchTasks();
  };

  return (
    <div className="task-filter">
      <div className="filter-header">
        <h3>🔍 Filter Tasks</h3>
        <button onClick={clearFilters} className="btn-clear">
          Clear All
        </button>
      </div>

      <div className="filter-grid">
        {/* Search */}
        <div className="filter-item">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearch}
            className="filter-search"
          />
        </div>

        {/* Status */}
        <div className="filter-item">
          <select
            value={filters.completed}
            onChange={(e) => handleFilterChange('completed', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="filter-item">
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="filter-item">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="filter-item">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="filter-select"
          >
            {SORT_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Button */}
        <div className="filter-item">
          <button onClick={applyFilters} className="btn-apply">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;