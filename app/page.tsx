"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";

type Todo = {
  id: string;
  date: number;
  title: string;
  completed: boolean;
};

function initilizeTodos() {
  if (sessionStorage && sessionStorage.getItem("__my_todo_manager_todos__")) {
    return JSON.parse(
      sessionStorage.getItem("__my_todo_manager_todos__")!
    ) as Todo[];
  }
  return [] as Todo[];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(initilizeTodos());
  const inputRef = useRef<HTMLInputElement>(null);

  function addTodo() {
    if (!inputRef.current || inputRef.current.value === "") {
      return;
    }
    setTodos(
      todos.concat({
        id: uuidv4(),
        date: Date.now(),
        title: inputRef.current && inputRef.current.value,
        completed: false,
      } as Todo)
    );
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeTodo(key: string) {
    setTodos(todos.filter((e) => e.id != key));
  }

  function checkTodo(key: string) {
    setTodos(
      todos.map((e) =>
        e.id === key ? ({ ...e, completed: !e.completed } as Todo) : e
      )
    );
  }

  useEffect(() => {
    sessionStorage.setItem("__my_todo_manager_todos__", JSON.stringify(todos));
  });

  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <div className="my-auto p-8 w-1/2 min-w-[500px] bg-gray-100 rounded-3xl">
        <h1 className="my-2 text-xl font-semibold text-center">Todo Manager</h1>
        <table className="table-fixed my-8 w-full">
          <tbody>
            {todos.length > 0 ? (
              todos.map((e) => (
                <Row
                  key={e.id}
                  todo={e}
                  checkFunc={checkTodo}
                  removeFunc={removeTodo}
                />
              ))
            ) : (
              <tr>
                <td className="col-span-3 text-center">No todos yet...</td>
              </tr>
            )}
          </tbody>
        </table>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col my-2"
        >
          <input
            type="text"
            placeholder="Your todo..."
            className="my-4 py-2 px-4 rounded-xl"
            ref={inputRef}
          />
          <button
            onClick={addTodo}
            className="my-2 mx-auto p-2 w-40 border-2 rounded-3xl 
                 bg-gray-300 border-gray-300 hover:bg-gray-500 hover:border-gray-500 hover:text-white 
                   transition-all duration-300"
          >
            Add
          </button>
        </form>
      </div>
    </main>
  );
}

function Row(props: {
  key: string;
  todo: Todo;
  checkFunc: (key: string) => void;
  removeFunc: (key: string) => void;
}) {
  return (
    <tr>
      <td className="p-2 w-[120px] text-sm text-gray-600">
        {new Date(props.todo.date).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "numeric",
        })}
      </td>
      <td
        className={`p-2 ${
          props.todo.completed ? "text-gray-400 line-through" : "text-black"
        }`}
      >
        {props.todo.title}
      </td>
      <td className="p-2 w-[50px]">
        <span
          onClick={() => {
            props.checkFunc(props.todo.id);
          }}
          className={`flex flex-row items-center justify-center h-5 w-5 ml-auto rounded-full
                 text-sm text-white hover:opacity-60 cursor-pointer transition-all duration-300 ${
                   props.todo.completed ? "bg-gray-500" : "bg-green-500"
                 }`}
        >
          {props.todo.completed ? "↺" : "✓"}
        </span>
      </td>
      <td className="p-2 w-[50px]">
        <span
          onClick={() => {
            props.removeFunc(props.todo.id);
          }}
          className="flex flex-row items-center justify-center h-5 w-5 ml-auto rounded-full
                 text-sm text-white bg-red-500 hover:opacity-60 cursor-pointer transition-all duration-300"
        >
          x
        </span>
      </td>
    </tr>
  );
}
