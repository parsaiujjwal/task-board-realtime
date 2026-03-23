import { useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import EditTaskModal from "./EditTaskModal";

import {
  fetchAllTasks,
  updateTaskById,
  deleteTaskById
} from "../services/api";

import { socket } from "../services/socket";
import { debounce } from "../utils/debounce";

const Board = () => {
  const [taskList, setTaskList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchAllTasks();
      setTaskList(res.data);
    } catch (err) {
      console.log("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    socket.on("new-task-added", (task) => {
      setTaskList((prev) => [...prev, task]);
    });

    socket.on("task-updated", (updatedTask) => {
      setTaskList((prev) => {
        const existing = prev.find((t) => t._id === updatedTask._id);

        if (existing && existing.updatedAt === updatedTask.updatedAt) {
          return prev;
        }

        return prev.map((t) =>
          t._id === updatedTask._id ? updatedTask : t
        );
      });
    });

    socket.on("task-removed", (taskId) => {
      setTaskList((prev) =>
        prev.filter((t) => t._id !== taskId)
      );
    });

    return () => {
      socket.off("new-task-added");
      socket.off("task-updated");
      socket.off("task-removed");
    };
  }, []);

  const handleDelete = async (id) => {
    await deleteTaskById(id);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const task = taskList.find((t) => t._id === taskId);

    if (task.status === newStatus) return;

    await updateTaskById(taskId, {
      ...task,
      status: newStatus,
      updatedAt: new Date()
    });
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchText(value);
      }, 300),
    []
  );

  const filteredTasks = useMemo(() => {
    return taskList.filter((t) => {
      const matchSearch = t.title
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchStatus =
        statusFilter === "all" || t.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [taskList, searchText, statusFilter]);

  const columns = ["todo", "in-progress", "done"];

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container board-wrapper">
      <AddTask />

      <input
        className="form-control mb-3"
        placeholder="Search tasks..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      <select
        className="form-select mb-3"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {taskList.length === 0 && (
        <h5 className="text-center">No tasks available</h5>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          {columns.map((col) => (
            <div className="col-md-4" key={col}>
              <Droppable droppableId={col}>
                {(provided) => (
                  <div
                    className="column-box"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h5 className="mb-3 text-capitalize">{col}</h5>

                    {filteredTasks
                      .filter((t) => t.status === col)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1
                              }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={setSelectedTask}
                                onDelete={handleDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <EditTaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};

export default Board;