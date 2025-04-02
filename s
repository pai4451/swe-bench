body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1e1e1e;
  color: #ddd;
}

#chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#messages {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

#input-area {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: #2d2d2d;
  position: relative;
}

#chat-input {
  padding: 0.5rem;
  font-size: 16px;
  background-color: #1e1e1e;
  border: 1px solid #444;
  color: white;
}

#dropdown {
  position: absolute;
  bottom: 2.5rem; /* adjust based on layout */
  left: 0;
  background-color: #252526;
  border: 1px solid #444;
  border-radius: 4px;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

#dropdown.hidden {
  display: none;
}

#dropdown button.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  width: 100%;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
}

#dropdown button.dropdown-item:hover {
  background-color: #3a3d41;
}

#dropdown button.dropdown-item.active {
  background-color: #094771;
  color: white;
}

#dropdown svg {
  flex-shrink: 0;
  color: #ccc;
}


const input = document.getElementById('chat-input');
const dropdown = document.getElementById('dropdown');

const allOptions = ['@File', '@Code', '@Git Diff', '@Current File'];
let filteredOptions = [...allOptions];
let selectedIndex = -1;

input.addEventListener('input', () => {
  const value = input.value;
  const match = value.match(/@(\w*)$/); // Get word after latest "@"
  if (match) {
    const query = match[1].toLowerCase();
    filteredOptions = allOptions.filter(opt => opt.toLowerCase().includes('@' + query));
    selectedIndex = 0;
    showDropdown();
  } else {
    hideDropdown();
  }
});

input.addEventListener('keydown', (e) => {
  const isVisible = !dropdown.classList.contains('hidden');

  if (isVisible) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredOptions.length;
      updateDropdown();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredOptions.length) % filteredOptions.length;
      updateDropdown();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        insertMention(filteredOptions[selectedIndex]);
        hideDropdown();
      }
    } else if (e.key === 'Escape') {
      hideDropdown();
    }
  }
});

dropdown.addEventListener('mouseover', () => {
  selectedIndex = -1;
  updateDropdown();
});

dropdown.addEventListener('click', (e) => {
  const btn = e.target.closest('button.dropdown-item');
  if (btn) {
    const index = parseInt(btn.dataset.index, 10);
    insertMention(filteredOptions[index]);
    hideDropdown();
    input.focus();
  }
});

function insertMention(text) {
  input.value = input.value.replace(/@\w*$/, '') + text + ' ';
}

function showDropdown() {
  dropdown.innerHTML = filteredOptions.map((opt, i) =>
    `<button class="dropdown-item ${i === selectedIndex ? 'active' : ''}" data-index="${i}">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" />
      </svg>
      <span>${opt}</span>
    </button>`
  ).join('');
  dropdown.classList.remove('hidden');
}

function updateDropdown() {
  const buttons = dropdown.querySelectorAll('button.dropdown-item');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === selectedIndex);
  });
}

function hideDropdown() {
  dropdown.classList.add('hidden');
  selectedIndex = -1;
}
