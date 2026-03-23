import { useState, useEffect } from "react";
import { updateTaskById } from "../services/api";

const EditTaskModal = ({ task, onClose }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.description || "");
    }
  }, [task]);

  const handleUpdate = async () => {
    await updateTaskById(task._id, {
      ...task,
      title,
      description: desc,
      updatedAt: new Date()
    });

    onClose();
  };

  if (!task) return null;

  return (
    <div className="modal d-block">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Edit Task</h5>

          <input
            className="form-control mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="form-control mb-2"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button className="btn btn-success" onClick={handleUpdate}>
            Update
          </button>
          <button className="btn btn-secondary mt-2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;