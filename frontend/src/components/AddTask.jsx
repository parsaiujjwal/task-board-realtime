import { useState } from "react";
import { createNewTask } from "../services/api";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
 if (!title.trim()) {
    alert("Title is required");
    return;
  }
    await createNewTask({
      title,
      description: desc
    });

    setTitle("");
    setDesc("");
  };

  return (
    <form onSubmit={handleAdd} className="mb-3">
      <div className="row">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary w-100">
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTask;