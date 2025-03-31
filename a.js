// File: media/main.js
(function () {
    const vscode = acquireVsCodeApi();
    const input = document.getElementById('chat-input');
    const dropdown = document.getElementById('dropdown');
  
    const baseOptions = [
      '@File', '@Code', '@Git Diff', '@Current File', '@Terminal', '@Docs', '@Open',
      '@Web', '@Codebase', '@Folder', '@Search', '@Url', '@Clipboard', '@Tree',
      '@Problems', '@Debugger', '@Repository Map', '@Operating System'
    ];
  
    let filteredOptions = [];
    let activeIndex = -1;
    let inSubmenu = false;
    let submenuItems = [];
    let triggerWord = '';
  
    input.addEventListener('input', () => {
      const value = input.value;
      const atIndex = value.lastIndexOf('@');
      if (atIndex >= 0) {
        triggerWord = value.substring(atIndex);
        if (!inSubmenu) {
          filteredOptions = baseOptions.filter(opt => opt.toLowerCase().startsWith(triggerWord.toLowerCase()));
          showDropdown();
        }
      } else {
        dropdown.style.display = 'none';
      }
    });
  
    input.addEventListener('keydown', (e) => {
      if (dropdown.style.display === 'block') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % filteredOptions.length;
          renderDropdown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
          renderDropdown();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeIndex >= 0) {
            const selected = filteredOptions[activeIndex];
            if (selected === '@File' && !inSubmenu) {
              vscode.postMessage({ command: 'getFiles' });
              inSubmenu = true;
              return;
            }
            insertSelectedText(selected);
          }
        } else if (e.key === 'Escape') {
          dropdown.style.display = 'none';
          activeIndex = -1;
          inSubmenu = false;
        }
      }
    });
  
    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.command === 'fileList') {
        submenuItems = msg.files.map(f => `@File:${f}`);
        filteredOptions = submenuItems;
        activeIndex = 0;
        renderDropdown();
        showDropdown();
      }
    });
  
    function insertSelectedText(selected) {
      const atIndex = input.value.lastIndexOf('@');
      input.value = input.value.substring(0, atIndex) + selected + ' ';
      dropdown.style.display = 'none';
      activeIndex = -1;
      inSubmenu = false;
    }
  
    function showDropdown() {
      dropdown.innerHTML = '';
      renderDropdown();
      dropdown.style.display = 'block';
      const rect = input.getBoundingClientRect();
      dropdown.style.left = rect.left + 'px';
      dropdown.style.top = rect.bottom + 'px';
    }
  
    function renderDropdown() {
      dropdown.innerHTML = '';
      filteredOptions.forEach((opt, i) => {
        const div = document.createElement('div');
        div.textContent = opt;
        div.className = 'dropdown-item' + (i === activeIndex ? ' active' : '');
        div.addEventListener('click', () => {
          if (opt === '@File' && !inSubmenu) {
            vscode.postMessage({ command: 'getFiles' });
            inSubmenu = true;
          } else {
            insertSelectedText(opt);
          }
        });
        dropdown.appendChild(div);
      });
    }
  })();
  ////



// File: media/main.js
(function () {
  const vscode = acquireVsCodeApi();
  const input = document.getElementById('chat-input');
  const dropdown = document.getElementById('dropdown');

  const baseOptions = [
    { label: 'Files', hint: 'Type to search', icon: 'folder' },
    { label: 'Codebase', hint: 'Automatically find relevant files', icon: 'sparkles' },
    { label: 'Prompt Files', hint: '.prompt files', icon: 'document' },
    { label: 'Code', hint: 'Type to search', icon: 'code' },
    { label: 'Docs', hint: 'Type to search docs', icon: 'book-open' },
    { label: 'Git Diff', hint: 'Reference the current git diff', icon: 'diff' },
    { label: 'Terminal', hint: 'Reference the last terminal command', icon: 'terminal' },
    { label: 'Problems', hint: 'Reference problems in the current file', icon: 'alert' },
    { label: 'Folder', hint: 'Type to search', icon: 'folder' },
    { label: 'Add more context providers', hint: '', icon: 'plus' }
  ];

  let filteredOptions = [];
  let activeIndex = -1;
  let inSubmenu = false;
  let submenuItems = [];
  let triggerWord = '';

  input.addEventListener('input', () => {
    const value = input.value;
    const atIndex = value.lastIndexOf('@');
    if (atIndex >= 0) {
      triggerWord = value.substring(atIndex);
      if (!inSubmenu) {
        filteredOptions = baseOptions.filter(opt => ('@' + opt.label.toLowerCase()).startsWith(triggerWord.toLowerCase()));
        showDropdown();
      }
    } else {
      dropdown.style.display = 'none';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (dropdown.style.display === 'block') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % filteredOptions.length;
        renderDropdown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
        renderDropdown();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0) {
          const selected = filteredOptions[activeIndex];
          if (selected.label === 'Files' && !inSubmenu) {
            vscode.postMessage({ command: 'getFiles' });
            inSubmenu = true;
            return;
          }
          insertSelectedText('@' + selected.label);
        }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        activeIndex = -1;
        inSubmenu = false;
      }
    }
  });

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.command === 'fileList') {
      submenuItems = msg.files.map(f => ({ label: `File:${f}`, hint: '', icon: 'file' }));
      filteredOptions = submenuItems;
      activeIndex = 0;
      renderDropdown();
      showDropdown();
    }
  });

  function insertSelectedText(selected) {
    const atIndex = input.value.lastIndexOf('@');
    input.value = input.value.substring(0, atIndex) + selected + ' ';
    dropdown.style.display = 'none';
    activeIndex = -1;
    inSubmenu = false;
  }

  function showDropdown() {
    dropdown.innerHTML = '';
    renderDropdown();
    dropdown.style.display = 'block';
    const rect = input.getBoundingClientRect();
    dropdown.style.left = rect.left + 'px';
    dropdown.style.top = rect.bottom + 'px';
  }

  function renderDropdown() {
    dropdown.innerHTML = '';
    filteredOptions.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'dropdown-item' + (i === activeIndex ? ' selected' : '');
      btn.innerHTML = `
        <span class="item-content">
          <div class="item-left">
            <span class="item-icon">🔹</span>
            <span class="item-label">${opt.label}</span>
          </div>
          <span class="item-hint${opt.hint ? '' : ' hidden'}">
            ${opt.hint}
          </span>
        </span>
      `;
      btn.addEventListener('click', () => {
        if (opt.label === 'Files' && !inSubmenu) {
          vscode.postMessage({ command: 'getFiles' });
          inSubmenu = true;
        } else {
          insertSelectedText('@' + opt.label);
        }
      });
      dropdown.appendChild(btn);
    });
  }
})();



function renderDropdown() {
  dropdown.innerHTML = '';
  filteredOptions.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'dropdown-item' + (i === activeIndex ? ' selected' : '');
    btn.setAttribute('data-testid', 'context-provider-dropdown-item');

    const iconSVG = getIconSVG(opt.label);
    const hintVisible = opt.hint && opt.hint.trim() !== '';
    const hintIconSVG = getHintIconSVG();

    btn.innerHTML = `
      <span class="item-content">
        <div class="item-left">
          ${iconSVG}
          <span class="item-label" title="${opt.value || opt.label}">${opt.label}</span>
        </div>
        <span class="item-hint${hintVisible ? '' : ' hidden'}">
          ${opt.hint || ''}
          ${hintVisible ? hintIconSVG : ''}
        </span>
      </span>
    `;

    btn.addEventListener('click', () => {
      if (opt.label === 'Files' && !inSubmenu) {
        vscode.postMessage({ command: 'getFiles' });
        inSubmenu = true;
      } else {
        insertSelectedText('@' + opt.label);
      }
    });

    dropdown.appendChild(btn);
  });
}

function getIconSVG(label) {
  switch (label.toLowerCase()) {
    case 'files':
    case 'folder':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'codebase':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'prompt files':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'code':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'docs':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'git diff':
    case 'add more':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 4.5v15m7.5-7.5h-15" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'terminal':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'problems':
      return `<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    default:
      return `<svg class="item-icon" viewBox="0 0 24 24"></svg>`; // fallback
  }
}

function getHintIconSVG() {
  return `<svg class="item-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
