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
  