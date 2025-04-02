import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

const TodoList = () => {
    const [todo, setTodo] = useState({
        title: "",
    });
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://localhost:3001/item");
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const handleChange = (e) => {
        setTodo({ ...todo, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/item", todo);
            setTodo({ title: "" });
            fetchTodos(); // Refresh the list after adding
            alert("Todo added successfully!");
        } catch (error) {
            console.error("Error adding todo:", error);
            alert("Failed to add todo.");
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/item/${id}`);
            fetchTodos(); // Refresh the list after deleting
            alert("Todo deleted successfully!");
        } catch (error) {
            console.error("Error deleting todo:", error);
            alert("Failed to delete todo.");
        }
    }

    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setIsEditing(true);
        setTodo({ title: todo.title });
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/item/${editingTodo._id}`, todo);
            setTodo({ title: "" });
            setIsEditing(false);
            setEditingTodo(null);
            fetchTodos(); // Refresh the list after updating
            alert("Todo updated successfully!");
        } catch (error) {
            console.error("Error updating todo:", error);
            alert("Failed to update todo.");
        }
    }

    return (
        <div className="form-container">
            <div className="overlay">
                <div className="form-box">
                    <h2>{isEditing ? 'Edit Todo' : 'Add New Todo'}</h2>
                    <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                        <label>Title:</label>
                        <input 
                            type="text" 
                            placeholder="Enter todo title" 
                            value={todo.title} 
                            onChange={handleChange} 
                            name="title" 
                            required 
                        />
                        <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingTodo(null);
                                    setTodo({ title: "" });
                                }}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    <div className="todos-list">
                        <h3>Todo List</h3>
                        {todos.map((item) => (
                            <div key={item._id} className="todo-item">
                                <div className="todo-content">
                                    <div className="todo-info">
                                        <span className="todo-title">{item.title}</span>
                                        <span className="todo-date">
                                            Submitted: {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="todo-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList; 