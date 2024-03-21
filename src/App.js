import React, { useState } from 'react';
import './App.css';

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
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: []
    });

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
            setTasks(prevTasks => {
                const updatedTasks = [...prevTasks[status]];
                updatedTasks[index] = updatedTask.trim();
                return {
                    ...prevTasks,
                    [status]: updatedTasks
                };
            });
        }
    };

    const renderTasks = (status) => {
        return (
            <div className="task-column">
                <h2>{status}</h2>
                <ul>
                    {tasks[status].map((task, index) => (
                        <li key={index}>
                            <span>{task}</span>
                            <div>
                                <button onClick={() => handleEditTask(status, index)}>Edit</button>
                                <button onClick={() => handleDeleteTask(status, index)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <TaskInput onAddTask={(task) => handleAddTask(status, task)} />
            </div>
        );
    };

    return (
        <div className="App">
            <h1>Task Tracker</h1>
            <div className="task-container">
                {renderTasks('todo')}
                {renderTasks('inProgress')}
                {renderTasks('done')}
            </div>
        </div>
    );
}

export default App;
