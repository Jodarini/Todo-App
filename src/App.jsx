import { useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

let dbMock = [
	{ name: "Task 1", isChecked: false, id: 0 },
	{ name: "Task 2", isChecked: true, id: 1 },
	{ name: "Task 3", isChecked: true, id: 2 },
	{ name: "Task 4", isChecked: false, id: 3 },
	{ name: "Task 5", isChecked: false, id: 4 },
];

export default function App() {
	const [name, setName] = useState("");
	const [todoList, setTodoList] = useState(dbMock);
	const [filter, setFilter] = useState("all");
	const [draggedTodo, setDraggedTodo] = useState();

	const newTodo = () => {
		let newTodo = {
			name: name,
			isChecked: false,
			id: uuidv4(),
		};
		setTodoList([...todoList, newTodo]);
	};

	const handleSubmit = e => {
		e.preventDefault();
		name.length > 0 && (newTodo(), setName(""));
	};

	const handleOnClick = todoId => {
		const newTodoList = todoList.map(todo => {
			if (todo.id === todoId) {
				todo.isChecked = !todo.isChecked;
				return todo;
			}
			return todo;
		});
		setTodoList(newTodoList);
	};

	const handleOnKeyDown = (e, id) => {
		e.key === "Enter" && handleOnClick(id);
	};

	const handleDelete = todoId => {
		const newTodoList = todoList.filter(
			todo => todoId !== todo.id
		);
		setTodoList(newTodoList);
	};

	const handleFilter = filter => {
		setFilter(filter);
	};

	const filteredList = todoList.filter(todo => {
		if (filter === "all") {
			return true;
		}
		return todo.isChecked === (filter === "complete");
	});

	const handleDeleteCompleted = () => {
		const newTodoList = todoList.filter(
			todo => !todo.isChecked
		);
		setTodoList(newTodoList);
		setFilter("all");
	};

	const handleDragStart = (e, todo) => {
		setDraggedTodo(todo);
	};

	const handleDragOver = e => {
		e.preventDefault();
	};

	const handleDrop = target => {
		const newTodoList = [...todoList];
		const indexOfTarget = newTodoList.indexOf(target);
		const indexOfdraggedTodo = newTodoList.indexOf(draggedTodo);
		if (indexOfdraggedTodo > indexOfTarget) {
			newTodoList.splice(indexOfdraggedTodo, 1);
			newTodoList.splice(indexOfTarget, 0, draggedTodo);
		} else if (indexOfdraggedTodo < indexOfTarget) {
			newTodoList.splice(indexOfdraggedTodo, 1);
			newTodoList.splice(indexOfTarget, 0, draggedTodo);
		} else return;
		setTodoList(newTodoList);
	};
	return (
		<div className="App flex flex-col items-center">
			<h1 className="text 3xl font-bold color">ToDo app</h1>
			<div className="flex flex-col bg-slate-700 w-2/6">
				<form onSubmit={handleSubmit} className="z-50">
					<input
						type="textfield"
						className="bg-slate-700 text-slate-200 p-4 w-full border-b border-gray-600"
						autoFocus
						placeholder="Create a new todo..."
						onChange={e => setName(e.target.value)}
						value={name}
					/>
					<button type="submit" hidden>
						Submit
					</button>
				</form>
				<ul>
					{filteredList.length > 0
						? filteredList.map(todo => (
								<li
									className="flex flex-row bg-slate-700 text-slate-200 w-full cursor-pointer border-b border-gray-600"
									key={todo.id}
								>
									<ToDo
										name={todo.name}
										handleOnClick={() => handleOnClick(todo.id)}
										handleOnKeyDown={e => handleOnKeyDown(e, todo.id)}
										id={todo.id}
										handleDelete={() => handleDelete(todo.id)}
										status={todo.isChecked}
										handleDragStart={e => handleDragStart(e, todo)}
										handleDragOver={e => handleDragOver(e)}
										handleDrop={() => handleDrop(todo)}
									/>
								</li>
						  ))
						: "No todo in the list"}
				</ul>

				<div className="flex flex-row gap-2 justify-center p-2 border-t border-gray-600">
					<button
						onClick={() => handleFilter("all")}
						className={`hover:text-gray-300 ${
							filter === "all" && "text-indigo-400"
						}`}
					>
						All
					</button>
					<button
						onClick={() => handleFilter("active")}
						className={`hover:text-gray-300 ${
							filter === "active" && "text-indigo-400"
						}`}
					>
						Active
					</button>
					<button
						onClick={() => handleFilter("complete")}
						className={`hover:text-gray-300 ${
							filter === "complete" && "text-indigo-400"
						} `}
					>
						Completed
					</button>
					<button
						onClick={() => handleDeleteCompleted()}
						className="hover:text-gray-300"
					>
						Clear all completed
					</button>
				</div>
			</div>
			Drag an drop to move
		</div>
	);
}

function ToDo({
	name,
	handleOnClick,
	handleOnKeyDown,
	id,
	handleDelete,
	status,
	handleDragStart,
	handleDrop,
	handleDragOver,
}) {
	return (
		<>
			<div
				draggable
				className="hover:bg-slate-600 hover:cursor-pointer w-full relative flex flex-row align-middle items-center justify-center group "
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<input
					type="checkbox"
					onClick={handleOnClick}
					id={id}
					className="mr-6 align-baseline hidden"
				></input>

				<label
					tabIndex="0"
					onKeyDown={handleOnKeyDown}
					htmlFor={id}
					className="w-full text-left p-6 hover:cursor-pointer pl-12 peer"
				>
					{name}
				</label>

				<label
					htmlFor={id}
					className={`${
						status
							? "bg-gradient-to-b from-blue-500 to-purple-500"
							: "border-gray-600 border-2 group-hover:border-gray-400"
					} rounded-full h-8 w-8 flex items-center justify-center absolute left-2 hover:cursor-pointer`}
				>
					<svg
						className={`${status ? "block" : "hidden"}`}
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 14L11 18L19 8"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</label>
				<label
					className="hidden rounded-full hover:bg-slate-400 right-2 absolute group-hover:block cursor-pointer peer-focus:block focus:block"
					onClick={handleDelete}
				>
					&times;
				</label>
			</div>
		</>
	);
}
