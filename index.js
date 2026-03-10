const addNoteBtn = document.getElementById("addNote");
const notesContainer = document.getElementById("notesContainer");
const deleteBtn = document.getElementById("deleteBtn");

function createNote(id = Date.now(), content = "", x = 100, y = 100) {

  // wrapper
  const noteWrapper = document.createElement("div");
  noteWrapper.className = "";
  // noteWrapper.style.left = x + "px";
  // noteWrapper.style.top = y + "px";
  // noteWrapper.style.position = "absolute";

  // textarea
  const textarea = document.createElement("textarea");
  textarea.className = "";
  textarea.value = content;

  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = "X";

  // delete single note
  deleteBtn.addEventListener("click", () => {
    noteWrapper.remove();
    saveNotes();
  });

  textarea.addEventListener("input", saveNotes);

  noteWrapper.appendChild(deleteBtn);
  noteWrapper.appendChild(textarea);

  notesContainer.appendChild(noteWrapper);

  makeDraggable(noteWrapper);
  saveNotes();
}
  
function saveNotes() {
  const notes = Array.from(document.querySelectorAll(".note-wrapper")).map(wrapper => ({
    content: wrapper.querySelector(".note").value,
    x: parseInt(wrapper.style.left),
    y: parseInt(wrapper.style.top)
  }));

  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  const saved = JSON.parse(localStorage.getItem("notes") || "[]");
  saved.forEach((note, index) => {
    createNote(index, note.content, note.x, note.y);
  });
}

addNoteBtn.addEventListener("click", () => createNote());
window.onload = () => loadNotes();
function deleteAllNotes() {
  if (confirm("Are you sure you want to delete all notes?")) {
    localStorage.removeItem("notes");
    document.querySelectorAll(".note").forEach(note => note.remove());
    document.querySelectorAll(".delete-btn").forEach(btn => btn.remove());
  }
}

const deleteAllBtn = document.createElement("button");
deleteAllBtn.textContent = "Delete All Notes";
deleteAllBtn.className = "delete-all-btn";
deleteAllBtn.addEventListener("click", deleteAllNotes);
document.body.appendChild(deleteAllBtn);


function makeDraggable(element) {
  let offsetX, offsetY;

  element.addEventListener("mousedown", e => {
    offsetX = e.clientX - parseInt(element.style.left);
    offsetY = e.clientY - parseInt(element.style.top);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  });

  function mouseMove(e) {
    element.style.left = e.clientX - offsetX + "px";
    element.style.top = e.clientY - offsetY + "px";
  }

  function mouseUp() {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
    saveNotes();
  }
}
function backupNotes() {
  const notes = localStorage.getItem("notes");
  const blob = new Blob([notes], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `sticky-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

///start 


let notes = [];

function loadNotes(){
  const savedNotes=localStorage.getItem('quickNotes')
  return savedNotes ? JSON.parse(savedNotes) : []
}

// Load notes from localStorage when page loads
document.addEventListener("DOMContentLoaded", function () {
  notes=loadNotes()
  renderNotes()

  const savedNotes = localStorage.getItem("quickNotes");

  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  }

  document.getElementById("noteForm").addEventListener("submit", saveNote);

  document.getElementById("noteDialog").addEventListener("click", function (e) {
    if (e.target === this) {
      closeNoteDialog();
    }
  });

});

document.getElementById("noteForm").addEventListener("submit", saveNote);
function saveNote(e) {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (title === "" || content === "") {
    alert("Please fill all fields");
    return;
  }

  const note = {
    id: generateId(),
    title: title,
    content: content
  };

  notes.unshift(note);

  saveNotes();

  document.getElementById("noteForm").reset();

  closeNoteDialog();
}

function generateId() {
  return Date.now().toString();
}

function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function renderNotes(){
  const notesContainer=document.getElementById('notesContainer');
  if(notes.length === 0){
    notesContainer.innerHTML=`
    <div class="empty-state">
      <h2>No notes yet</h2>
      <p>Create your note!</p>
      <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
    </div>   `
    return
  }
  notesContainer.innerHTML=notes.map(note => `
    <div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-container">${note.content}</p>
    </div>
    `
  ).join('')
}

function openNoteDialog() {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");

  dialog.showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  document.getElementById("noteDialog").close();
}

