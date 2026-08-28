// app.js - Logic Điều Khiển Hệ Thống Luyện Thi & Đánh Giá Năng Lực Python Nâng Cao
// Đơn vị: TIN HỌC SAO VIỆT THỦ ĐỨC

document.addEventListener("DOMContentLoaded", () => {
  // State variables
  let currentUser = window.userManager.getCurrentUser();
  let currentTab = "study";
  let currentTypeFilter = "all";
  let searchQuery = "";
  
  // Exam State
  let examActive = false;
  let examPart = 1; // 1: MCQ (50 questions), 2: Practical (4 questions)
  let examQuestions = []; // 50 randomized MCQs
  let examPracticalProblems = []; // 4 randomized practical problems
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { qId: answerValue }
  let userPracticalCode = {}; // { probId: codeString }
  let practicalResults = {}; // { probId: { passed, score, feedback } }
  
  let timerSeconds = 50 * 60; // 50 minutes for Part 1, 40 min for Part 2
  let timerInterval = null;
  let isPaused = false;

  // DOM Elements
  const navTabs = document.querySelectorAll(".tab-btn");
  const viewSections = document.querySelectorAll(".view-section");
  const userActionBox = document.getElementById("userActionBox");
  
  // Modals
  const loginModal = document.getElementById("loginModal");
  const pauseModal = document.getElementById("pauseModal");
  const addUserModal = document.getElementById("addUserModal");
  const resultModal = document.getElementById("resultModal");
  
  // Study DOM
  const studyStream = document.getElementById("studyQuestionsStream");
  const typeChips = document.querySelectorAll("#typeChips .chip");
  const studySearchInput = document.getElementById("studySearchInput");
  
  // Exam DOM
  const examLobby = document.getElementById("examLobby");
  const activeExamContainer = document.getElementById("activeExamContainer");
  const btnStartExam = document.getElementById("btnStartExam");
  const btnPart1 = document.getElementById("btnPart1");
  const btnPart2 = document.getElementById("btnPart2");
  const timerDigits = document.getElementById("timerDigits");
  const examTimerBox = document.getElementById("examTimerBox");
  const examStudentName = document.getElementById("examStudentName");
  const examContentArea = document.getElementById("examContentArea");
  const mcqNavGrid = document.getElementById("mcqNavGrid");
  const practicalNavGrid = document.getElementById("practicalNavGrid");
  const examProgressText = document.getElementById("examProgressText");
  const btnPauseExam = document.getElementById("btnPauseExam");
  const btnSubmitExam = document.getElementById("btnSubmitExam");

  // Admin DOM
  const usersTableBody = document.getElementById("usersTableBody");
  const pausedExamsList = document.getElementById("pausedExamsList");
  const addQuestionForm = document.getElementById("addQuestionForm");

  // =========================================================================
  // 1. INITIALIZATION & AUTHENTICATION
  // =========================================================================
  function initApp() {
    renderUserBox();
    renderStudyQuestions();
    setupEventListeners();
    checkPausedExamOnLoad();
    updateAdminTabVisibility();
  }

  function renderUserBox() {
    if (currentUser) {
      userActionBox.innerHTML = `
        <div class="user-profile-badge">
          <div class="user-avatar">${currentUser.fullName.charAt(0)}</div>
          <div class="user-details">
            <span class="u-name">${currentUser.fullName}</span>
            <span class="u-role">${currentUser.role === 'teacher' ? '⭐ Giáo Viên' : '🎓 Học Viên'}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" id="btnLogout">Đăng Xuất</button>
      `;
      document.getElementById("btnLogout").addEventListener("click", () => {
        window.userManager.logout();
        currentUser = null;
        renderUserBox();
        updateAdminTabVisibility();
        switchTab("study");
      });
    } else {
      userActionBox.innerHTML = `
        <button class="btn btn-primary btn-sm" id="btnOpenLogin">🔐 Đăng Nhập</button>
      `;
      document.getElementById("btnOpenLogin").addEventListener("click", () => {
        loginModal.classList.remove("hidden");
      });
    }
  }

  function updateAdminTabVisibility() {
    const adminTab = document.getElementById("tabAdminBtn");
    if (currentUser && currentUser.role === "teacher") {
      adminTab.style.display = "inline-block";
    } else {
      adminTab.style.display = "none";
      if (currentTab === "admin") switchTab("study");
    }
  }

  window.quickFill = function(u, p) {
    document.getElementById("loginUsername").value = u;
    document.getElementById("loginPassword").value = p;
  };

  // =========================================================================
  // 2. TAB SWITCHING
  // =========================================================================
  function switchTab(tabId) {
    currentTab = tabId;
    navTabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
    viewSections.forEach(v => v.classList.toggle("active", v.id === tabId + "View"));

    if (tabId === "admin") {
      renderAdminPanel();
    }
  }

  // =========================================================================
  // 3. STUDY MODE (120 QUESTIONS + DEDUCTION NOTES)
  // =========================================================================
  function renderStudyQuestions() {
    studyStream.innerHTML = "";
    const allQuestions = window.QUIZ_DATA.questions || [];
    const allPracticals = window.QUIZ_DATA.practical_problems || [];

    if (currentTypeFilter === "practical") {
      // Render 10 practical questions
      allPracticals.forEach((p, idx) => {
        const card = document.createElement("div");
        card.className = "q-card";
        card.innerHTML = `
          <div class="q-card-header">
            <span class="q-badge">💻 TỰ LUẬN THỰC HÀNH ${p.id}</span>
          </div>
          <div class="q-card-title">${p.title}</div>
          <p style="margin-bottom: 0.8rem; color: #475569;">${p.description}</p>
          <div class="code-editor-card" style="margin-bottom: 0.8rem;">
            <div class="code-editor-header">Mã nguồn khởi tạo:</div>
            <pre style="background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 0 0 8px 8px; font-family: 'Fira Code', monospace; font-size: 0.88rem;">${p.starter_code}</pre>
          </div>
          <button class="exp-toggle-btn" onclick="toggleExp('p_${p.id}')">💡 Xem code giải mẫu & phân tích logic ▼</button>
          <div class="exp-box" id="exp_p_${p.id}">
            <div class="ans-highlight">Mã nguồn giải chuẩn:</div>
            <pre style="background: #ffffff; border: 1px solid #cbd5e1; padding: 0.8rem; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 0.85rem; color: #0f172a; margin-top: 0.4rem;">${p.solution_code}</pre>
          </div>
        `;
        studyStream.appendChild(card);
      });
      return;
    }

    let filtered = allQuestions.filter(q => {
      const matchType = (currentTypeFilter === "all") || (q.type === currentTypeFilter);
      const matchSearch = searchQuery === "" || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });

    if (filtered.length === 0) {
      studyStream.innerHTML = `<div class="q-card text-center" style="padding: 2rem; color: #64748b;">Không tìm thấy câu hỏi nào phù hợp với bộ lọc.</div>`;
      return;
    }

    filtered.forEach(q => {
      const card = document.createElement("div");
      card.className = "q-card";
      
      let optionsHtml = "";
      if (q.type === "single_choice" || q.type === "multiple_choice" || q.type === "true_false") {
        const labels = ["A", "B", "C", "D"];
        optionsHtml = `<div class="options-list">` + q.options.map((opt, i) => `
          <div class="option-item" onclick="selectStudyOption(this)">
            <span style="font-weight: 700; width: 24px;">${q.type === 'true_false' ? (i === 0 ? '✓' : '✗') : labels[i]}.</span>
            <span>${opt}</span>
          </div>
        `).join("") + `</div>`;
      } else if (q.type === "fill_blank") {
        optionsHtml = `
          <div style="margin-bottom: 1rem;">
            <input type="text" class="form-input" placeholder="Nhập từ khóa em đoán vào đây..." style="max-width: 300px;">
          </div>
        `;
      } else if (q.type === "sequence_order") {
        optionsHtml = `
          <div style="background: #f8fafc; padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #e2e8f0;">
            <small style="color: #64748b; font-weight: 600; display: block; margin-bottom: 0.3rem;">Các dòng lệnh cần sắp xếp:</small>
            ${q.items.map((it, idx) => `<div style="font-family: 'Fira Code', monospace; font-size: 0.85rem; padding: 0.2rem 0;">${idx + 1}. ${it}</div>`).join("")}
          </div>
        `;
      } else if (q.type === "matching") {
        optionsHtml = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
            <div style="background: #f1f5f9; padding: 0.6rem; border-radius: 6px;">
              <small style="font-weight: 700;">Cột Khái Niệm / Lệnh:</small>
              ${q.left_items.map(l => `<div style="font-size: 0.85rem; padding: 0.2rem 0; font-family: monospace;">• ${l}</div>`).join("")}
            </div>
            <div style="background: #f1f5f9; padding: 0.6rem; border-radius: 6px;">
              <small style="font-weight: 700;">Cột Chức Năng:</small>
              ${q.right_items.map(r => `<div style="font-size: 0.85rem; padding: 0.2rem 0;">• ${r}</div>`).join("")}
            </div>
          </div>
        `;
      }

      let answerDisplay = "";
      if (q.type === "single_choice") {
        answerDisplay = `Đáp án đúng: <strong>${["A", "B", "C", "D"][q.correct_answer]}. ${q.options[q.correct_answer]}</strong>`;
      } else if (q.type === "true_false") {
        answerDisplay = `Đáp án đúng: <strong>${q.correct_answer === 0 ? "Đúng (True)" : "Sai (False)"}</strong>`;
      } else if (q.type === "multiple_choice") {
        const correctLabels = q.correct_answer.map(i => ["A", "B", "C", "D"][i]).join(", ");
        answerDisplay = `Các đáp án đúng: <strong>${correctLabels}</strong>`;
      } else if (q.type === "fill_blank") {
        answerDisplay = `Từ khóa chuẩn cần điền: <strong>'${q.correct_answer}'</strong>`;
      } else if (q.type === "sequence_order") {
        const orderStr = q.correct_order.map(i => q.items[i]).join(" ➔ ");
        answerDisplay = `Thứ tự đúng: <br><strong style="font-family: monospace; font-size: 0.82rem;">${orderStr}</strong>`;
      } else if (q.type === "matching") {
        const pairStr = q.pairs.map(p => `• ${p.left} ──▶ ${p.right}`).join("<br>");
        answerDisplay = `Ghép cặp chính xác:<br><strong style="font-size: 0.82rem;">${pairStr}</strong>`;
      }

      card.innerHTML = `
        <div class="q-card-header">
          <span class="q-badge">CÂU ${q.id} • ${q.type_name.toUpperCase()}</span>
        </div>
        <div class="q-card-title">${q.question}</div>
        ${optionsHtml}
        <button class="exp-toggle-btn" onclick="toggleExp(${q.id})">💡 Xem đáp án & chú thích suy luận logic ▼</button>
        <div class="exp-box" id="exp_${q.id}">
          <div class="ans-highlight">${answerDisplay}</div>
          <div class="ans-explanation">🔍 <em>Phương pháp suy luận:</em> ${q.explanation}</div>
        </div>
      `;
      studyStream.appendChild(card);
    });
  }

  window.toggleExp = function(id) {
    const box = document.getElementById("exp_" + id);
    if (box) box.classList.toggle("open");
  };

  window.selectStudyOption = function(el) {
    const parent = el.parentElement;
    parent.querySelectorAll(".option-item").forEach(i => i.classList.remove("selected"));
    el.classList.add("selected");
  };

  // =========================================================================
  // 4. EXAM ENGINE (50 MCQs in 50m + 4 PRACTICAL in 40m + PAUSE STATE)
  // =========================================================================
  function startExam() {
    if (!currentUser) {
      loginModal.classList.remove("hidden");
      return;
    }

    // Check if there is already a paused exam for this user
    const saved = window.userManager.getPausedExam();
    if (saved && saved.userId === currentUser.id) {
      restorePausedExam(saved);
      return;
    }

    // Initialize fresh exam session
    const allQuestions = [...window.QUIZ_DATA.questions];
    // Shuffle and pick 50
    shuffleArray(allQuestions);
    examQuestions = allQuestions.slice(0, 50);

    const allPracticals = [...window.QUIZ_DATA.practical_problems];
    shuffleArray(allPracticals);
    examPracticalProblems = allPracticals.slice(0, 4);

    examPart = 1;
    currentQuestionIndex = 0;
    userAnswers = {};
    userPracticalCode = {};
    practicalResults = {};
    timerSeconds = 50 * 60; // 50 mins

    examActive = true;
    isPaused = false;

    examLobby.classList.add("hidden");
    activeExamContainer.classList.remove("hidden");
    examStudentName.textContent = `Học viên: ${currentUser.fullName} (${currentUser.username})`;

    startTimer();
    renderNavGrids();
    renderCurrentQuestion();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isPaused && examActive) {
        timerSeconds--;
        updateTimerDisplay();

        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
          alert("⏱️ Đã hết thời gian làm bài! Hệ thống tự động nộp bài thi của em.");
          finishAndGradeExam();
        }
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDigits.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    examTimerBox.classList.toggle("danger", timerSeconds <= 300); // Danger under 5 mins
  }

  function renderNavGrids() {
    // Render 50 MCQ buttons
    mcqNavGrid.innerHTML = "";
    for (let i = 0; i < 50; i++) {
      const q = examQuestions[i];
      const btn = document.createElement("button");
      btn.className = "grid-btn";
      btn.textContent = i + 1;
      if (userAnswers[q.id] !== undefined) btn.classList.add("answered");
      if (examPart === 1 && currentQuestionIndex === i) btn.classList.add("current");
      
      btn.addEventListener("click", () => {
        examPart = 1;
        currentQuestionIndex = i;
        btnPart1.classList.add("active");
        btnPart2.classList.remove("active");
        renderNavGrids();
        renderCurrentQuestion();
      });
      mcqNavGrid.appendChild(btn);
    }

    // Render 4 Practical buttons
    practicalNavGrid.innerHTML = "";
    for (let j = 0; j < 4; j++) {
      const prob = examPracticalProblems[j];
      const btn = document.createElement("button");
      btn.className = "grid-btn";
      btn.textContent = `TL ${j + 1}`;
      if (practicalResults[prob.id] && practicalResults[prob.id].passed) btn.classList.add("answered");
      if (examPart === 2 && currentQuestionIndex === j) btn.classList.add("current");

      btn.addEventListener("click", () => {
        examPart = 2;
        currentQuestionIndex = j;
        btnPart2.classList.add("active");
        btnPart1.classList.remove("active");
        renderNavGrids();
        renderCurrentQuestion();
      });
      practicalNavGrid.appendChild(btn);
    }

    // Update progress text
    const answeredMCQ = Object.keys(userAnswers).length;
    const answeredPrac = Object.values(practicalResults).filter(r => r.passed).length;
    examProgressText.textContent = `${answeredMCQ + answeredPrac} / 54 Câu`;
  }

  function renderCurrentQuestion() {
    examContentArea.innerHTML = "";

    if (examPart === 1) {
      // Render MCQ Question
      const q = examQuestions[currentQuestionIndex];
      const qCard = document.createElement("div");
      qCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <span class="q-badge">CÂU TRẮC NGHIỆM ${currentQuestionIndex + 1} / 50 • [${q.type_name}]</span>
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.2rem;">${q.question}</h3>
        <div id="examOptionContainer"></div>
        <div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border);">
          <button class="btn btn-secondary" id="btnPrevQ" ${currentQuestionIndex === 0 ? 'disabled' : ''}>◀ Câu Trước</button>
          <button class="btn btn-primary" id="btnNextQ">${currentQuestionIndex === 49 ? 'Sang Phần Tự Luận ▶' : 'Câu Kế Tiếp ▶'}</button>
        </div>
      `;
      examContentArea.appendChild(qCard);

      const optContainer = document.getElementById("examOptionContainer");

      // Render Options based on type
      if (q.type === "single_choice" || q.type === "true_false") {
        const labels = ["A", "B", "C", "D"];
        q.options.forEach((opt, idx) => {
          const isSelected = userAnswers[q.id] === idx;
          const optDiv = document.createElement("div");
          optDiv.className = `option-item ${isSelected ? 'selected' : ''}`;
          optDiv.innerHTML = `
            <input type="radio" name="q_${q.id}" class="opt-radio" ${isSelected ? 'checked' : ''}>
            <span style="font-weight: 700;">${q.type === 'true_false' ? (idx === 0 ? '✓' : '✗') : labels[idx]}.</span>
            <span>${opt}</span>
          `;
          optDiv.addEventListener("click", () => {
            userAnswers[q.id] = idx;
            renderNavGrids();
            renderCurrentQuestion();
          });
          optContainer.appendChild(optDiv);
        });
      } else if (q.type === "multiple_choice") {
        const labels = ["A", "B", "C", "D"];
        const curAnsList = userAnswers[q.id] || [];
        q.options.forEach((opt, idx) => {
          const isChecked = curAnsList.includes(idx);
          const optDiv = document.createElement("div");
          optDiv.className = `option-item ${isChecked ? 'selected' : ''}`;
          optDiv.innerHTML = `
            <input type="checkbox" class="opt-radio" ${isChecked ? 'checked' : ''}>
            <span style="font-weight: 700;">${labels[idx]}.</span>
            <span>${opt}</span>
          `;
          optDiv.addEventListener("click", () => {
            let list = userAnswers[q.id] ? [...userAnswers[q.id]] : [];
            if (list.includes(idx)) list = list.filter(x => x !== idx);
            else list.push(idx);
            userAnswers[q.id] = list;
            renderNavGrids();
            renderCurrentQuestion();
          });
          optContainer.appendChild(optDiv);
        });
      } else if (q.type === "fill_blank") {
        const curVal = userAnswers[q.id] || "";
        optContainer.innerHTML = `
          <div style="margin-top: 1rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Nhập từ khóa / kết quả vào đây:</label>
            <input type="text" id="fillInput_${q.id}" class="form-input" value="${curVal}" placeholder="Gõ câu trả lời..." style="max-width: 400px;">
          </div>
        `;
        document.getElementById(`fillInput_${q.id}`).addEventListener("input", (e) => {
          userAnswers[q.id] = e.target.value.trim();
          renderNavGrids();
        });
      } else if (q.type === "sequence_order") {
        let order = userAnswers[q.id] || [...Array(q.items.length).keys()];
        optContainer.innerHTML = `
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.8rem;">Bấm các nút ▲ / ▼ để di chuyển dòng lệnh lên/xuống theo đúng thứ tự logic:</p>
          <div id="orderList" style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${order.map((itemIdx, pos) => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid var(--border); padding: 0.5rem 0.8rem; border-radius: 6px;">
                <span style="font-family: 'Fira Code', monospace; font-size: 0.88rem;">${pos + 1}. ${q.items[itemIdx]}</span>
                <div>
                  <button class="btn btn-secondary btn-sm" onclick="moveOrderItem(${q.id}, ${pos}, -1)" ${pos === 0 ? 'disabled' : ''}>▲</button>
                  <button class="btn btn-secondary btn-sm" onclick="moveOrderItem(${q.id}, ${pos}, 1)" ${pos === order.length - 1 ? 'disabled' : ''}>▼</button>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      } else if (q.type === "matching") {
        let userPairs = userAnswers[q.id] || {};
        optContainer.innerHTML = `
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.8rem;">Hãy chọn chức năng tương ứng cho từng khái niệm/câu lệnh:</p>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${q.left_items.map((left, idx) => `
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; align-items: center; background: #f8fafc; padding: 0.5rem 0.8rem; border-radius: 6px; border: 1px solid var(--border);">
                <strong style="font-family: monospace;">${left}</strong>
                <select class="form-input" onchange="selectMatchPair(${q.id}, '${left}', this.value)">
                  <option value="">-- Chọn chức năng ghép nối --</option>
                  ${q.right_items.map(right => `
                    <option value="${right}" ${userPairs[left] === right ? 'selected' : ''}>${right}</option>
                  `).join("")}
                </select>
              </div>
            `).join("")}
          </div>
        `;
      }

      // Navigation listeners
      document.getElementById("btnPrevQ").addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          renderNavGrids();
          renderCurrentQuestion();
        }
      });
      document.getElementById("btnNextQ").addEventListener("click", () => {
        if (currentQuestionIndex < 49) {
          currentQuestionIndex++;
          renderNavGrids();
          renderCurrentQuestion();
        } else {
          // Switch to Practical
          examPart = 2;
          currentQuestionIndex = 0;
          btnPart2.classList.add("active");
          btnPart1.classList.remove("active");
          renderNavGrids();
          renderCurrentQuestion();
        }
      });

    } else {
      // Render Practical Problem with in-browser Code Editor & Runner
      const prob = examPracticalProblems[currentQuestionIndex];
      const savedCode = userPracticalCode[prob.id] !== undefined ? userPracticalCode[prob.id] : prob.starter_code;

      const probCard = document.createElement("div");
      probCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
          <span class="q-badge">💻 BÀI TỰ LUẬN THỰC HÀNH ${currentQuestionIndex + 1} / 4</span>
          <span style="font-size: 0.82rem; font-weight: 600; color: #10b981;">(Điểm tối đa: 2.5đ / bài)</span>
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">${prob.title}</h3>
        <p style="color: #475569; font-size: 0.92rem; margin-bottom: 1rem;">${prob.description}</p>
        
        <div class="code-editor-card">
          <div class="code-editor-header">
            <span>📄 Trình Soạn Thảo Python (Gõ code của em bên dưới):</span>
            <span>UTF-8 • Python 3</span>
          </div>
          <textarea id="practicalCodeInput" class="code-textarea" spellcheck="false">${savedCode}</textarea>
          
          <div class="editor-actions">
            <button class="btn btn-warning" id="btnRunCode">▶️ Chạy Thử Code (Build & Run)</button>
            <button class="btn btn-success" id="btnSubmitPractical">💾 Nộp Bài Tự Luận Này</button>
          </div>

          <div class="console-header">🖥️ Cửa Sổ Console Output Giả Lập:</div>
          <div class="console-output-box" id="consoleOutput">Sẵn sàng thực thi. Hãy bấm '▶️ Chạy Thử Code' để kiểm tra kết quả!</div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);">
          <button class="btn btn-secondary" id="btnPrevProb" ${currentQuestionIndex === 0 ? 'disabled' : ''}>◀ Bài Tự Luận Trước</button>
          <button class="btn btn-primary" id="btnNextProb">${currentQuestionIndex === 3 ? 'Hoàn Thành & Xem Bảng Điểm' : 'Bài Tự Luận Kế Tiếp ▶'}</button>
        </div>
      `;
      examContentArea.appendChild(probCard);

      const codeTextarea = document.getElementById("practicalCodeInput");
      const consoleOutput = document.getElementById("consoleOutput");

      codeTextarea.addEventListener("input", (e) => {
        userPracticalCode[prob.id] = e.target.value;
      });

      // Handle Tab key in textarea
      codeTextarea.addEventListener("keydown", function(e) {
        if (e.key === "Tab") {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;
        }
      });

      // Run Code Button
      document.getElementById("btnRunCode").addEventListener("click", async () => {
        consoleOutput.textContent = "⏳ Đang biên dịch và chạy thử code Python...";
        const code = codeTextarea.value;
        const res = await window.pythonRunner.runCode(code);
        consoleOutput.textContent = res.output;
      });

      // Submit Practical Problem Button
      document.getElementById("btnSubmitPractical").addEventListener("click", () => {
        const code = codeTextarea.value;
        const grade = window.pythonRunner.gradePracticalCode(prob.id, code);
        practicalResults[prob.id] = grade;
        renderNavGrids();
        alert(`✅ Đã nộp bài ${prob.id}!\nĐánh giá tự động: ${grade.feedback}\nĐiểm dự kiến: ${grade.score}/10`);
      });

      // Navigation listeners
      document.getElementById("btnPrevProb").addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          renderNavGrids();
          renderCurrentQuestion();
        }
      });
      document.getElementById("btnNextProb").addEventListener("click", () => {
        if (currentQuestionIndex < 3) {
          currentQuestionIndex++;
          renderNavGrids();
          renderCurrentQuestion();
        } else {
          finishAndGradeExam();
        }
      });
    }
  }

  window.moveOrderItem = function(qId, pos, dir) {
    const q = examQuestions.find(x => x.id === qId);
    let order = userAnswers[qId] || [...Array(q.items.length).keys()];
    const targetPos = pos + dir;
    if (targetPos >= 0 && targetPos < order.length) {
      const temp = order[pos];
      order[pos] = order[targetPos];
      order[targetPos] = temp;
      userAnswers[qId] = order;
      renderNavGrids();
      renderCurrentQuestion();
    }
  };

  window.selectMatchPair = function(qId, left, right) {
    let pairs = userAnswers[qId] || {};
    pairs[left] = right;
    userAnswers[qId] = pairs;
    renderNavGrids();
  };

  // =========================================================================
  // 5. PAUSE EXAM & TEACHER PIN PROTECTION
  // =========================================================================
  function pauseExam() {
    if (!examActive) return;
    isPaused = true;

    // Save full state
    const examState = {
      userId: currentUser.id,
      userName: currentUser.fullName,
      examQuestions,
      examPracticalProblems,
      currentQuestionIndex,
      examPart,
      userAnswers,
      userPracticalCode,
      practicalResults,
      timerSeconds,
      timestamp: new Date().toLocaleString()
    };
    window.userManager.savePausedExam(examState);

    pauseModal.classList.remove("hidden");
    document.getElementById("pinErrorMsg").classList.add("hidden");
    document.getElementById("teacherPinInput").value = "";
  }

  function checkPausedExamOnLoad() {
    const saved = window.userManager.getPausedExam();
    if (saved && currentUser && saved.userId === currentUser.id) {
      if (confirm(`Chào ${currentUser.fullName}, bạn có bài thi đang tạm dừng lúc ${saved.timestamp}. Bạn có muốn tiếp tục làm bài không?`)) {
        restorePausedExam(saved);
      }
    }
  }

  function restorePausedExam(saved) {
    examQuestions = saved.examQuestions;
    examPracticalProblems = saved.examPracticalProblems;
    currentQuestionIndex = saved.currentQuestionIndex || 0;
    examPart = saved.examPart || 1;
    userAnswers = saved.userAnswers || {};
    userPracticalCode = saved.userPracticalCode || {};
    practicalResults = saved.practicalResults || {};
    timerSeconds = saved.timerSeconds || (50 * 60);

    examActive = true;
    isPaused = true;

    switchTab("exam");
    examLobby.classList.add("hidden");
    activeExamContainer.classList.remove("hidden");
    examStudentName.textContent = `Học viên: ${currentUser.fullName} (${currentUser.username})`;

    renderNavGrids();
    renderCurrentQuestion();
    updateTimerDisplay();

    // Show PIN modal to unlock
    pauseModal.classList.remove("hidden");
    document.getElementById("pinErrorMsg").classList.add("hidden");
  }

  // =========================================================================
  // 6. FINISH & GRADE EXAM (AUTOMATED GRADING)
  // =========================================================================
  function finishAndGradeExam() {
    if (!confirm("Em có chắc chắn muốn nộp toàn bộ bài thi cuối khóa không?")) return;

    if (timerInterval) clearInterval(timerInterval);
    examActive = false;
    window.userManager.clearPausedExam();

    // Grade Part 1: 50 MCQs
    let correctMCQ = 0;
    examQuestions.forEach(q => {
      const userAns = userAnswers[q.id];
      if (userAns !== undefined) {
        if (q.type === "single_choice" || q.type === "true_false") {
          if (userAns === q.correct_answer) correctMCQ++;
        } else if (q.type === "multiple_choice") {
          if (Array.isArray(userAns) && arraysEqual(userAns.sort(), q.correct_answer.sort())) correctMCQ++;
        } else if (q.type === "fill_blank") {
          if (typeof userAns === "string" && userAns.toLowerCase() === q.correct_answer.toLowerCase()) correctMCQ++;
        } else if (q.type === "sequence_order") {
          if (Array.isArray(userAns) && arraysEqual(userAns, q.correct_order)) correctMCQ++;
        } else if (q.type === "matching") {
          let allCorrect = true;
          q.pairs.forEach(p => {
            if (userAns[p.left] !== p.right) allCorrect = false;
          });
          if (allCorrect) correctMCQ++;
        }
      }
    });

    // Grade Part 2: 4 Practical Problems
    let totalPracticalPoints = 0;
    examPracticalProblems.forEach(prob => {
      const code = userPracticalCode[prob.id] || prob.starter_code;
      const res = window.pythonRunner.gradePracticalCode(prob.id, code);
      totalPracticalPoints += (res.score / 10) * 1.25; // 4 problems * 1.25 = 5.0 points
    });

    // Calculate final scale 10.0
    // Part 1: (correctMCQ / 50) * 5.0 points
    const mcqPoints = (correctMCQ / 50) * 5.0;
    const finalScore = (mcqPoints + totalPracticalPoints).toFixed(1);

    // Show Results Modal
    document.getElementById("finalTotalScore").textContent = `${finalScore} / 10 Điểm`;
    document.getElementById("mcqScoreDisplay").textContent = `${correctMCQ} / 50 Câu (${mcqPoints.toFixed(1)}đ)`;
    document.getElementById("practicalScoreDisplay").textContent = `${totalPracticalPoints.toFixed(1)} / 5.0 Điểm`;

    let rank = "ĐẠT";
    if (finalScore >= 9.0) rank = "XUẤT SẮC 🏆";
    else if (finalScore >= 8.0) rank = "GIỎI ⭐⭐⭐";
    else if (finalScore >= 6.5) rank = "KHÁ ⭐⭐";
    else if (finalScore >= 5.0) rank = "TRUNG BÌNH ⭐";
    else rank = "CẦN RÈN LUYỆN LẠI 📚";

    document.getElementById("rankDisplay").textContent = rank;
    resultModal.classList.remove("hidden");
  }

  // =========================================================================
  // 7. ADMIN PANEL LOGIC
  // =========================================================================
  function renderAdminPanel() {
    const users = window.userManager.getUsers();
    usersTableBody.innerHTML = "";
    users.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${u.username}</strong></td>
        <td>${u.fullName}</td>
        <td>${u.class || (u.role === 'teacher' ? 'Quản trị viên' : 'Học viên')}</td>
        <td><code>${u.password}</code></td>
        <td>
          ${u.username !== 'admin' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')">Xóa</button>` : '<span style="color: #64748b;">(Hệ thống)</span>'}
        </td>
      `;
      usersTableBody.appendChild(tr);
    });

    // Render Paused Exam
    const paused = window.userManager.getPausedExam();
    if (paused) {
      pausedExamsList.innerHTML = `
        <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 1rem; border-radius: 8px;">
          <h4 style="color: #92400e; margin-bottom: 0.3rem;">📌 Bài thi đang tạm dừng của: ${paused.userName} (${paused.userId})</h4>
          <p style="font-size: 0.85rem; color: #78350f;">Thời gian lưu: ${paused.timestamp} | Còn lại: ${Math.floor(paused.timerSeconds / 60)} phút</p>
          <div style="margin-top: 0.8rem; display: flex; gap: 0.5rem;">
            <button class="btn btn-success btn-sm" onclick="adminQuickUnlock()">🔓 Mở Khóa Cho Học Viên</button>
            <button class="btn btn-danger btn-sm" onclick="adminDeletePaused()">Hủy Bài Thi Này</button>
          </div>
        </div>
      `;
    } else {
      pausedExamsList.innerHTML = `<p style="color: #64748b; font-size: 0.9rem;">Hiện không có học viên nào đang tạm dừng bài thi.</p>`;
    }
  }

  window.deleteUser = function(id) {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
      window.userManager.deleteUser(id);
      renderAdminPanel();
    }
  };

  window.adminQuickUnlock = function() {
    isPaused = false;
    pauseModal.classList.add("hidden");
    alert("✅ Đã mở khóa bài thi thành công! Học viên có thể tiếp tục làm bài.");
  };

  window.adminDeletePaused = function() {
    if (confirm("Hủy bài thi tạm dừng này?")) {
      window.userManager.clearPausedExam();
      renderAdminPanel();
    }
  };

  // =========================================================================
  // 8. EVENT LISTENERS
  // =========================================================================
  function setupEventListeners() {
    // Navigation Tabs
    navTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        if (tab.dataset.tab === "admin" && (!currentUser || currentUser.role !== "teacher")) {
          alert("Khu vực này chỉ dành cho Giáo Viên Quản Trị!");
          return;
        }
        switchTab(tab.dataset.tab);
      });
    });

    // Study Filter Chips
    typeChips.forEach(chip => {
      chip.addEventListener("click", () => {
        typeChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentTypeFilter = chip.dataset.type;
        renderStudyQuestions();
      });
    });

    // Search Input
    studySearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderStudyQuestions();
    });

    // Login Form Submit
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("loginUsername").value;
      const p = document.getElementById("loginPassword").value;
      const res = window.userManager.login(u, p);
      if (res.success) {
        currentUser = res.user;
        loginModal.classList.add("hidden");
        document.getElementById("loginErrorMsg").classList.add("hidden");
        renderUserBox();
        updateAdminTabVisibility();
      } else {
        const err = document.getElementById("loginErrorMsg");
        err.textContent = res.message;
        err.classList.remove("hidden");
      }
    });

    document.getElementById("btnCloseLogin").addEventListener("click", () => {
      loginModal.classList.add("hidden");
    });

    // Unlock PIN Form Submit
    document.getElementById("unlockExamForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = document.getElementById("teacherPinInput").value;
      if (window.userManager.verifyTeacherPin(pin)) {
        isPaused = false;
        pauseModal.classList.add("hidden");
      } else {
        document.getElementById("pinErrorMsg").classList.remove("hidden");
      }
    });

    document.getElementById("btnExitToStudy").addEventListener("click", () => {
      pauseModal.classList.add("hidden");
      activeExamContainer.classList.add("hidden");
      examLobby.classList.remove("hidden");
      switchTab("study");
    });

    // Start Exam Button
    btnStartExam.addEventListener("click", startExam);
    btnPauseExam.addEventListener("click", pauseExam);
    btnSubmitExam.addEventListener("click", finishAndGradeExam);

    // Part Switcher in Exam
    btnPart1.addEventListener("click", () => {
      examPart = 1;
      currentQuestionIndex = 0;
      btnPart1.classList.add("active");
      btnPart2.classList.remove("active");
      renderNavGrids();
      renderCurrentQuestion();
    });
    btnPart2.addEventListener("click", () => {
      examPart = 2;
      currentQuestionIndex = 0;
      btnPart2.classList.add("active");
      btnPart1.classList.remove("active");
      renderNavGrids();
      renderCurrentQuestion();
    });

    // Result Modal Close
    document.getElementById("btnCloseResult").addEventListener("click", () => {
      resultModal.classList.add("hidden");
      activeExamContainer.classList.add("hidden");
      examLobby.classList.remove("hidden");
      switchTab("study");
    });

    // Add User Modal
    document.getElementById("btnOpenAddUserModal").addEventListener("click", () => {
      addUserModal.classList.remove("hidden");
    });
    document.getElementById("btnCloseAddUser").addEventListener("click", () => {
      addUserModal.classList.add("hidden");
    });
    document.getElementById("addUserForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const res = window.userManager.addUser({
        username: document.getElementById("newUsername").value,
        fullName: document.getElementById("newFullName").value,
        class: document.getElementById("newClass").value,
        password: document.getElementById("newPassword").value
      });
      if (res.success) {
        alert("✅ Cấp tài khoản mới thành công!");
        addUserModal.classList.add("hidden");
        renderAdminPanel();
      } else {
        alert("❌ " + res.message);
      }
    });

    // Add Custom Question Form
    addQuestionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const qType = document.getElementById("newQType").value;
      const qText = document.getElementById("newQText").value;
      const qCorrect = document.getElementById("newQCorrect").value;
      const qExp = document.getElementById("newQExp").value;

      let newQ = {
        id: window.QUIZ_DATA.questions.length + 1,
        type: qType,
        type_name: qType === 'single_choice' ? 'Trắc nghiệm ABCD (1 đáp án)' : (qType === 'true_false' ? 'Đúng / Sai' : 'Điền vào chỗ trống'),
        question: qText,
        explanation: qExp
      };

      if (qType === 'single_choice') {
        newQ.options = [
          document.getElementById("optA").value || "Lựa chọn A",
          document.getElementById("optB").value || "Lựa chọn B",
          document.getElementById("optC").value || "Lựa chọn C",
          document.getElementById("optD").value || "Lựa chọn D"
        ];
        newQ.correct_answer = parseInt(qCorrect) || 0;
      } else if (qType === 'true_false') {
        newQ.options = ["Đúng (True)", "Sai (False)"];
        newQ.correct_answer = parseInt(qCorrect) || 0;
      } else {
        newQ.correct_answer = qCorrect;
      }

      window.QUIZ_DATA.questions.push(newQ);
      alert("✅ Đã thêm câu hỏi mới thành công vào ngân hàng!");
      addQuestionForm.reset();
      renderStudyQuestions();
    });
  }

  // Utilities
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Start the application
  initApp();
});
