// public/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // ——— LOGOUT ——————————————————————————
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('Token');
      localStorage.removeItem('Id');
      window.location.href = 'index.html';
    });
  
    // ——— AUTH GUARD —————————————————————————
    const token = localStorage.getItem('Token');
    if (!token) {
      alert('Admins only.');
      window.location.href = 'index.html';
      return;
    }
  
    // ——— FETCH HELPER ———————————————————————
    function adminFetch(path, opts = {}) {
      opts.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...opts.headers
      };
      return fetch(path, opts)
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            alert('Access denied.');
            window.location.href = 'index.html';
            throw new Error('not authorized');
          }
          return res.json();
        });
    }
  
    // ——— LOAD & RENDER ——————————————————————
    adminFetch('/api/admin/useractivity')
      .then(json => {
        const data = json.data;
        data.forEach(rec => {
            if (Array.isArray(rec.survey_answers)) {
              rec.survey_answers = rec.survey_answers.filter(ans => ans != null);
            }
          });
        const container = document.getElementById('tables-container');
        container.innerHTML = '';
  
        // 1) Group records by story
        const byStory = data.reduce((acc, rec) => {
          const key = `${rec.story_id}||${rec.storyname}`;
          (acc[key] = acc[key] || []).push(rec);
          return acc;
        }, {});
  
        // 2) For each story, render a table
        Object.entries(byStory).forEach(([key, records]) => {
          const [, storyname] = key.split('||');
          if (!records.length) return;
  
          // 2a) Header questions are the same for all recs in this story
          const headerQuestions = Array.isArray(records[0].questions)
            ? records[0].questions
            : [];
          if (!headerQuestions.length) return;
  
          // 2b) Story title
          const h3 = document.createElement('h3');
          h3.textContent = `Story: ${storyname}`;
          container.appendChild(h3);
  
          // 2c) Build table and header row
          const table = document.createElement('table');
          table.className = 'table table-striped';

          const thead = document.createElement('thead');
          const headRow = document.createElement('tr');
          ['User', 'When', ...headerQuestions].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headRow.appendChild(th);
          });
          thead.appendChild(headRow);
          table.appendChild(thead);

          // 2d) Build body rows
          const tbody = document.createElement('tbody');
          records.forEach(rec => {
            const tr = document.createElement('tr');
  
            // Username cell
            const tdUser = document.createElement('td');
            tdUser.textContent = rec.Username;
            tr.appendChild(tdUser);
  
            // Timestamp cell
            const tdTime = document.createElement('td');
            tdTime.textContent = new Date(rec.activity_timestamp)
              .toLocaleString();
            tr.appendChild(tdTime);
  
            // Answer cells
            console.log(rec.survey_answers);
            headerQuestions.forEach((_, i) => {
              const ans = Array.isArray(rec.survey_answers)
                ? rec.survey_answers[i]
                : null;
              const td = document.createElement('td');
              if (ans === 1)      td.textContent = 'Yes';
              else if (ans === 0) td.textContent = 'No';
              else                td.textContent = '';
              tr.appendChild(td);
            });
  
            tbody.appendChild(tr);
          });
  
          table.appendChild(tbody);
          container.appendChild(table);
        });
      })
      .catch(err => console.error('Failed to load progress:', err));
  });
  