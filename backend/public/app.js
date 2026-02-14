document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const timeDisplay = document.getElementById('timeDisplay');
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    const btnStart = document.getElementById('btnStart');
    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');

    const configPanel = document.getElementById('configPanel');
    const labelInput = document.getElementById('labelInput');
    const workInput = document.getElementById('workInput');
    const breakInput = document.getElementById('breakInput');

    const auraSection = document.getElementById('auraSection');
    const auraCanvas = document.getElementById('auraCanvas');
    const btnCloseAura = document.getElementById('btnCloseAura');
    const auraMessage = document.getElementById('auraMessage');

    const statSessions = document.getElementById('statSessions');
    const statWork = document.getElementById('statWork');
    const sessionsList = document.getElementById('sessionsList');

    // --- State ---
    let timerInterval = null;
    let timeLeft = 25 * 60;
    let totalTime = 25 * 60;
    let isRunning = false;
    let currentMode = 'work'; // 'work' or 'break'

    // --- Init ---
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = 0;

    loadStats();
    loadSessions();

    // --- Timer Logic ---
    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeLeft);
        const percent = (timeLeft / totalTime) * 100;
        setProgress(percent);
    }

    function startTimer() {
        if (isRunning) return;

        // Setup UI
        configPanel.classList.add('hidden');
        btnStart.classList.add('hidden');
        btnPause.classList.remove('hidden');
        circle.classList.add('active');

        isRunning = true;

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                completeSession();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        btnStart.classList.remove('hidden');
        btnStart.textContent = "CONTINUAR";
        btnPause.classList.add('hidden');
        circle.classList.remove('active');
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;

        const workMin = parseInt(workInput.value) || 25;
        totalTime = workMin * 60;
        timeLeft = totalTime;

        updateDisplay();

        // Reset UI
        configPanel.classList.remove('hidden');
        btnStart.classList.remove('hidden');
        btnStart.textContent = "INICIAR";
        btnPause.classList.add('hidden');
        circle.classList.remove('active');
        setProgress(100);
    }

    async function completeSession() {
        clearInterval(timerInterval);
        isRunning = false;

        // Play sound (optional) or notification

        if (currentMode === 'work') {
            // Save Session
            const sessionData = {
                label: labelInput.value || 'Sin etiqueta',
                workMinutes: parseInt(workInput.value),
                breakMinutes: parseInt(breakInput.value),
                notes: 'Completado exitosamente'
            };

            try {
                await fetch('/api/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionData)
                });

                loadStats();
                loadSessions();
                showAura(sessionData.workMinutes);

            } catch (err) {
                console.error(err);
            }

            // Switch to Break (manual start preferred usually, but we can auto-switch setup)
            currentMode = 'break';
            timeLeft = (parseInt(breakInput.value) || 5) * 60;
            totalTime = timeLeft;
            updateDisplay();

            btnStart.textContent = "INICIAR DESCANSO";
            btnStart.classList.remove('hidden');
            btnPause.classList.add('hidden');
            configPanel.classList.remove('hidden'); // Allow changing break time? Or keep hidden?

        } else {
            // Break finished
            currentMode = 'work';
            resetTimer(); // Go back to work setup
            alert("¡Descanso terminado! Listo para volver a trabajar.");
        }
    }

    // --- Aura Visualizer ---
    function showAura(intensityMinutes) {
        auraSection.classList.remove('hidden');
        document.querySelector('.timer-section').classList.add('hidden');

        const ctx = auraCanvas.getContext('2d');
        const w = auraCanvas.width;
        const h = auraCanvas.height;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Gradient Blob
        // Intensity determines color mix
        const cx = w / 2;
        const cy = h / 2;

        // Create dynamic gradient
        const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);

        if (intensityMinutes < 20) {
            grd.addColorStop(0, '#4ECDC4'); // Light teal
            grd.addColorStop(1, 'rgba(78, 205, 196, 0)');
        } else if (intensityMinutes < 45) {
            grd.addColorStop(0, '#FF9F0A'); // Orange
            grd.addColorStop(0.5, '#FF6B6B'); // Red
            grd.addColorStop(1, 'rgba(255, 107, 107, 0)');
        } else {
            grd.addColorStop(0, '#AF52DE'); // Purple
            grd.addColorStop(0.6, '#5E5CE6'); // Indigo
            grd.addColorStop(1, 'rgba(94, 92, 230, 0)');
        }

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        // Add some "noise" or particles
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255, ${Math.random() * 0.5})`;
            ctx.arc(
                Math.random() * w,
                Math.random() * h,
                Math.random() * 2,
                0, Math.PI * 2
            );
            ctx.fill();
        }

        auraMessage.textContent = `¡Has completado ${intensityMinutes} minutos de enfoque puro!`;
    }

    // --- API & Data ---
    async function loadStats() {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            statSessions.textContent = data.totalSessions;
            statWork.textContent = data.totalWorkMinutes;
        } catch (e) { console.error(e); }
    }

    async function loadSessions() {
        try {
            const res = await fetch('/api/sessions');
            const data = await res.json();
            sessionsList.innerHTML = data.map(s => `
                <li class="session-item">
                    <span>${s.label}</span>
                    <span class="session-time">${s.work_minutes} min</span>
                </li>
            `).join('');
        } catch (e) { console.error(e); }
    }

    // --- Events ---
    btnStart.addEventListener('click', startTimer);
    btnPause.addEventListener('click', pauseTimer);
    btnReset.addEventListener('click', resetTimer);

    // Auto-update timer display on input change (if not running)
    workInput.addEventListener('change', () => {
        if (!isRunning && currentMode === 'work') {
            timeLeft = workInput.value * 60;
            totalTime = timeLeft;
            updateDisplay();
        }
    });

    btnCloseAura.addEventListener('click', () => {
        auraSection.classList.add('hidden');
        document.querySelector('.timer-section').classList.remove('hidden');
        resetTimer();
    });

    // Init display
    updateDisplay();
});
