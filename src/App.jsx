import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useState, useEffect } from "react";

const days = ["M", "T", "W", "T", "F", "S", "S"];

function App() {
  const [habits, setHabits] = useState(() => {
    return JSON.parse(localStorage.getItem("habits")) || [];
  });

  const [newHabit, setNewHabit] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Get dates for current week
  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();

    const start = new Date();
    start.setDate(today.getDate() - currentDay + weekOffset * 7);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      week.push(date);
    }

    return week;
  };

  // Add new habit
  const addHabit = () => {
    if (!newHabit.trim()) return;

    const habit = {
      id: Date.now(),
      name: newHabit,
      completed: {},
    };

    setHabits([...habits, habit]);
    setNewHabit("");
  };

  // Delete habit
  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const weekDays = getWeekDays();

  return (
    <>
      <div className="container">
        <h1>Habit Tracker App</h1>

        <div className="add-box">
          <input
            type="text"
            placeholder="Add a habit (e.g. Read 30 min)"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />

          <button onClick={addHabit}>Add</button>

          <div className="week-controls">
            <button onClick={() => setWeekOffset(weekOffset - 1)}>
              Previous Week
            </button>

            <button onClick={() => setWeekOffset(0)}>
              Today
            </button>

            <button onClick={() => setWeekOffset(weekOffset + 1)}>
              Next Week
            </button>
          </div>
        </div>

        {habits.length === 0 ? (
          <p className="empty">No habits added yet!</p>
        ) : (
          <div className="table">
            {/* Header */}
            <div className="header row">
              <div className="habit-name">Habits</div>

              {weekDays.map((day, index) => (
                <div key={index} className="day">
                  {days[index]}
                  <br />
                  {day.getDate()}
                </div>
              ))}

              <div className="streak">🔥</div>
              <div className="delete">Delete</div>
            </div>

            {/* Habit Rows */}
            {habits.map((habit) => (
              <div key={habit.id} className="row">
                <div className="habit-name">{habit.name}</div>

                {weekDays.map((day, index) => {
                  const key = day.toDateString();

                  return (
                    <div key={index}>
                      <input
                        type="checkbox"
                        checked={habit.completed[key] || false}
                        onChange={() => {
                          setHabits(
                            habits.map((h) =>
                              h.id === habit.id
                                ? {
                                    ...h,
                                    completed: {
                                      ...h.completed,
                                      [key]: !h.completed[key],
                                    },
                                  }
                                : h
                            )
                          );
                        }}
                      />
                    </div>
                  );
                })}

                <div className="streak">
                  {
                    Object.values(habit.completed).filter(Boolean).length
                  }
                </div>

                <div className="delete">
                  <button
                    className="delete-btn"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;