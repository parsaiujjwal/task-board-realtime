const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-card">
      <h6>{task.title}</h6>

      {task.description && <p>{task.description}</p>}

      <small>
        {new Date(task.updatedAt).toLocaleTimeString()}
      </small>

      <div className="mt-2">
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;