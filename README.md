# HabitFlow 🧠✅

HabitFlow is a simple and practical **habit tracking web app** built using **pure HTML, CSS, and JavaScript**.  
It helps users create daily habits, track completion progress, and automatically resets habits every day — all **without using any backend or database**.

This project is built to deeply understand **core JavaScript concepts** while creating something actually useful for daily life.

---

## 🚀 Features

- ➕ Add new habits  
- ✅ Mark habits as completed / pending  
- ✏️ Edit existing habits  
- 🗑 Delete habits  
- 📊 Progress bar showing completion percentage  
- 💾 Data saved using `localStorage` (persists after refresh)  
- 🌙 Automatic daily reset at midnight  
- 🔁 Manual “Reset Today” button  
- 🧭 User guidance and empty-state messages  

---

## 🧠 What I Learned From This Project

This project helped me understand and **apply JavaScript concepts practically**, including:

- DOM manipulation from scratch  
- Event handling and **event delegation**  
- State management using arrays and objects  
- Rendering UI from JavaScript state  
- `localStorage` for data persistence  
- `setTimeout` and `setInterval` for time-based logic  
- Calculating derived state (progress percentage)  
- Writing reusable and clean functions  
- Debugging real-world JavaScript issues  
- Building a project suitable for **GitHub Pages**

---

## 🛠 Tech Stack Used

- **HTML** – Structure  
- **CSS** – Styling and layout  
- **JavaScript (Vanilla)** – Logic and interactivity  
- **Browser APIs**
  - DOM API  
  - `localStorage`  
  - Timers (`setTimeout`, `setInterval`)  

No frameworks. No libraries. No backend.

---

## 📂 How the App Works (High Level)

1. Habits are stored as objects inside a JavaScript array.  
2. UI is rendered completely from this array.  
3. Every change (add / edit / delete / toggle) updates the state.  
4. Updated state is saved to `localStorage`.  
5. Progress is recalculated from the state.  
6. A daily timer resets all habits automatically at midnight.  

---

## 📌 Future Improvements

- Habit streak logic  
- Inline editing instead of prompt    
- Mobile-first UI polish  
- Data export / import  

---

## Final Note

This project was built **to learn by doing**, focusing on understanding how JavaScript works under the hood rather than using frameworks.
