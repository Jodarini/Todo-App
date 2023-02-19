import { useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

let dbMock = [
	{
		name: "Task 1",
		isChecked: false,
		id: 0,
		isDragged: false,
	},
	{
		name: "Task 2",
		isChecked: true,
		id: 1,
		isDragged: false,
	},
	{
		name: "Task 3",
		isChecked: true,
		id: 2,
		isDragged: false,
	},
	{
		name: "Task 4",
		isChecked: false,
		id: 3,
		isDragged: false,
	},
	{
		name: "Task 5",
		isChecked: false,
		id: 4,
		isDragged: false,
	},
];

export default function App() {
	const [name, setName] = useState("");
	const [todoList, setTodoList] = useState(dbMock);
	const [filter, setFilter] = useState("all");
	const [draggedTodo, setDraggedTodo] = useState();
	const [isDarkMode, setIsDarkMode] = useState("dark");
	const [isDragged, setIsDragged] = useState(true);

	const handleChangeMode = () => {
		setIsDarkMode(isDarkMode === "light" ? "dark" : "light");
	};

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
		setIsDragged(!isDragged);
		todo.isDragged = isDragged;
	};

	const handleDragOver = (e, todo) => {
		e.preventDefault();
	};

	const handleDragEnd = (e, todo) => {
		setIsDragged(!isDragged);
		todo.isDragged = isDragged;
	};

	const handleTouchStart = (e, todo) => {
		setDraggedTodo(todo);
	};
	const handleTouchEnd = (e, todo) => {
		console.log(todo);
		handleDrop(todo);
	};

	const handleDrop = target => {
		// Here is where the add query to db would be
	};

	const handleDragEnter = target => {
		if (target === draggedTodo) {
			console.log("returning before");
			return;
		}
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
		<div className="flex flex-col items-center">
			<h1 className="text 3xl color font-bold">ToDo app</h1>
			<button className="" onClick={() => handleChangeMode()}>
				{isDarkMode}
			</button>
			<div className="flex flex-col rounded-3xl bg-slate-700 md:w-2/6">
				<form onSubmit={handleSubmit} className="z-50">
					<input
						type="textfield"
						className="w-full rounded-t-3xl border-b border-gray-600 bg-slate-700 p-4 text-slate-200"
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
								<ToDo
									key={todo.id}
									name={todo.name}
									handleOnClick={() => handleOnClick(todo.id)}
									handleOnKeyDown={e => handleOnKeyDown(e, todo.id)}
									id={todo.id}
									handleDelete={() => handleDelete(todo.id)}
									status={todo.isChecked}
									isDragged={todo.isDragged}
									handleDragStart={e => handleDragStart(e, todo)}
									handleDragEnd={e => handleDragEnd(e, todo)}
									handleTouchStart={e => handleDragStart(e, todo)}
									handleDragOver={e => handleDragOver(e, todo)}
									handleDrop={() => handleDrop(todo)}
									handleTouchEnd={() => handleTouchEnd(todo)}
									handleDragEnter={() => handleDragEnter(todo)}
								/>
						  ))
						: "No todo in the list"}
				</ul>

				<div className="flex flex-row justify-center gap-2 border-t border-gray-600 p-2">
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

function Skeleton() {
	return (
		<div className="group relative flex w-full flex-row items-center justify-center align-middle hover:cursor-pointer hover:bg-slate-600 ">
			Hello world
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
	isDragged,
	handleDragStart,
	handleTouchStart,
	handleDrop,
	handleDragOver,
	handleTouchEnd,
	handleDragEnter,
	handleDragEnd,
}) {
	return (
		<>
			<li
				className={`flex w-full cursor-pointer flex-row border-b border-gray-600 bg-slate-700 text-slate-200 ${
					isDragged && "bg-slate-800"
				}`}
			>
				<div
					draggable
					className={`group relative flex w-full flex-row items-center justify-center align-middle hover:cursor-pointer hover:bg-slate-600 `}
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onDragEnter={handleDragEnter}
				>
					<input
						type="checkbox"
						onClick={handleOnClick}
						id={id}
						className="mr-6 hidden align-baseline"
					></input>

					<label
						tabIndex="0"
						onKeyDown={handleOnKeyDown}
						htmlFor={id}
						className="peer w-full p-6 pl-12 text-left hover:cursor-pointer"
					>
						{name}
					</label>

					<label
						htmlFor={id}
						className={`${
							status
								? "bg-gradient-to-b from-blue-500 to-purple-500"
								: "border-2 border-gray-600 group-hover:border-gray-400"
						} absolute left-2 flex h-8 w-8 items-center justify-center rounded-full hover:cursor-pointer`}
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
						className="absolute right-2 cursor-pointer rounded-full hover:bg-slate-400 focus:block group-hover:block md:hidden"
						onClick={handleDelete}
					>
						&times;
					</label>
				</div>
			</li>
		</>
	);
}
