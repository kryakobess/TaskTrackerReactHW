import React, { useState, useEffect } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function TaskInput({ onAddTask }) {
    const [newTask, setNewTask] = useState('');

    const handleTaskInputChange = (event) => {
        setNewTask(event.target.value);
    };

    const handleAddTask = () => {
        if (newTask.trim() !== '') {
            onAddTask(newTask.trim());
            setNewTask('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={newTask}
                onChange={handleTaskInputChange}
                placeholder="Add task"
            />
            <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
}

function App() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    const [tasks, setTasks] = useState(storedTasks === null || storedTasks.isEmpty ? {
        ToDo: [],
        InProgress: [],
        Done: []
    } : storedTasks);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (status, task) => {
        setTasks(prevTasks => {
            return {
                ...prevTasks,
                [status]: [...prevTasks[status], task]
            };
        });
    };

    const handleDeleteTask = (status, index) => {
        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks[status]];
            updatedTasks.splice(index, 1);
            return {
                ...prevTasks,
                [status]: updatedTasks
            };
        });
    };

    const handleEditTask = (status, index) => {
        const updatedTask = prompt('Enter the new task:');
        if (updatedTask !== null && updatedTask.trim() !== '') {
            setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks[status]];
                updatedTasks[index] = updatedTask.trim();
                return {
                    ...prevTasks,
                    [status]: updatedTasks
                };
            });
        }
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceTasks = [...tasks[source.droppableId]];
        const destinationTasks = [...tasks[destination.droppableId]];
        const [removed] = sourceTasks.splice(source.index, 1);
        destinationTasks.splice(destination.index, 0, removed);

        setTasks(prevTasks => {
            return {
                ...prevTasks,
                [source.droppableId]: sourceTasks,
                [destination.droppableId]: destinationTasks
            };
        });
    };

    const renderTasks = (status) => {
        return (
            <div className="task-column">
                <h2>{status}</h2>
                <Droppable droppableId={status} key={status}>
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks[status].map((task, index) => (
                                <Draggable key={index} draggableId={`${status}-${index}`} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <span>{task}</span>
                                            <div>
                                                <button onClick={() => handleEditTask(status, index)}>Edit</button>
                                                <button onClick={() => handleDeleteTask(status, index)}>Delete</button>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
                <TaskInput onAddTask={(task) => handleAddTask(status, task)} />
            </div>
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="App">
                <h1>Task Tracker</h1>
                <div className="task-container">
                    {renderTasks('ToDo')}
                    {renderTasks('InProgress')}
                    {renderTasks('Done')}
                </div>
            </div>
        </DragDropContext>
    );
}

export default App;
