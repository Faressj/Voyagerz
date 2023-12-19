import React, { useState, useEffect } from 'react';
import './styles/TodoList.scss';

const TodoList = ({ listName, tasks, onAddTask, onCompleteTask, onRemoveTask }) => {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      onAddTask(newTask);
      setNewTask('');
    }
  };

  return (
    <div className="todo-section">
      <h3>{listName}</h3>
      <div>
        <input
          type="text"
          placeholder="Nouvelle tache"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className='todolist-input'
        />
        <button className='todolist-button' onClick={addTask}>Ajouter une tache</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              className="checkbox"
              onChange={() => onCompleteTask(index)}
            />
            <span className="task">{task}</span>
            <span
              className="remove-task"
              onClick={() => onRemoveTask(index)}
            >
              &#10005;
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const List = () => {
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState('');

    useEffect(() => {
        const savedLists = JSON.parse(localStorage.getItem('todoLists')) || [];
        setLists(savedLists);
    }, []);

    useEffect(() => {
        localStorage.setItem('todoLists', JSON.stringify(lists));
    }, [lists]);

    const addList = (listName) => {
        const updatedLists = [...lists, { name: listName, tasks: [] }];
        setLists(updatedLists);
    };

    const addTask = (listIndex, task) => {
        const updatedLists = [...lists];
        updatedLists[listIndex].tasks.push(task);
        setLists(updatedLists);
    };

    const completeTask = (listIndex, taskIndex) => {
        const updatedLists = [...lists];
        updatedLists[listIndex].tasks.splice(taskIndex, 1);
        setLists(updatedLists);
    };

    const removeTask = (listIndex, taskIndex) => {
        const updatedLists = [...lists];
        updatedLists[listIndex].tasks.splice(taskIndex, 1);
        setLists(updatedLists);
    };

    return (
        <div className="todolist-container">
            <h2 className='todolist-title'>Todo Liste</h2>
            <div>
                <input
                  type="text"
                  placeholder="Nom de la liste"
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className='todolist-input'
                />
                <button className='todolist-button' onClick={() => addList(selectedList)}>Créer une liste</button>
            </div>
            {lists.map((list, index) => (
                <TodoList
                    key={index}
                    listName={list.name}
                    tasks={list.tasks}
                    onAddTask={(task) => addTask(index, task)}
                    onCompleteTask={(taskIndex) => completeTask(index, taskIndex)}
                    onRemoveTask={(taskIndex) => removeTask(index, taskIndex)}
                />
            ))}
        </div>
    );
};

export default List;
