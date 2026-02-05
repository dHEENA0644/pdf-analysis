let extractedText = "";
let questions = [];
let chartInstance = null;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

// ================= PDF LOAD =================
function loadPDF() {
    const file = document.getElementById("pdfFile").files[0];
    if (!file) {
        alert("Please select a PDF file");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const typedArray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            let promises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                promises.push(
                    pdf.getPage(i).then(page =>
                        page.getTextContent().then(tc =>
                            tc.items.map(item => item.str).join(" ")
                        )
                    )
                );
            }

            Promise.all(promises).then(texts => {
                extractedText = texts.join(" ").toLowerCase();
                document.getElementById("pdfStatus").innerText =
                    "PDF loaded successfully ✅";
                generateQuestions();
            });
        });
    };

    reader.readAsArrayBuffer(file);
}

// ================= QUESTION GENERATION =================
function generateQuestions() {
    const qDiv = document.getElementById("questions");
    qDiv.innerHTML = "";
    questions = [];

    let sentences = extractedText
        .split(/[.!?]/)
        .map(s => s.trim())
        .filter(s => s.length > 40 && s.length < 200);

    if (sentences.length < 3) {
        qDiv.innerHTML =
            "<p>Not enough meaningful content to generate questions.</p>";
        return;
    }

    sentences = shuffle(sentences).slice(0, 5);

    sentences.forEach((s, i) => {
        const question = makeQuestion(s);
        questions.push({ question: question, answerHint: s });

        qDiv.innerHTML += `
            <div class="question">
                <b>Q${i + 1}: ${question}</b>
                <textarea id="ans${i}" placeholder="Your answer..."></textarea>
            </div>
        `;
    });

    document.getElementById("analyzeBtn").style.display = "inline-block";
}

// ================= ANSWER ANALYSIS =================
function analyzeAnswers() {
    let score = 0;

    questions.forEach((q, i) => {
        const ans = document.getElementById(`ans${i}`).value.toLowerCase();
        const keywords = q.answerHint.split(" ").slice(0, 6);

        if (keywords.some(word => ans.includes(word))) {
            score += 10;
        } else if (ans.length > 30) {
            score += 5;
        }
    });

    const percent = Math.round((score / (questions.length * 10)) * 100);
    let level, feedback;

    if (percent >= 75) {
        level = "Good Understanding";
        feedback = "Great work! Your answers reflect strong comprehension.";
    } else if (percent >= 50) {
        level = "Average Understanding";
        feedback = "You are improving. Review the weak points and try again.";
    } else {
        level = "Needs Improvement";
        feedback = "Focus on understanding the key ideas and retry.";
    }

    document.getElementById("result").innerHTML = `
        <p><b>Score:</b> ${percent}%</p>
        <p><b>Level:</b> ${level}</p>
        <p><b>Feedback:</b> ${feedback}</p>
    `;

    saveAttempt(percent);
    drawChart();
}

// ================= HELPERS =================
function makeQuestion(sentence) {
    if (sentence.includes(" is ")) {
        return "What is " + sentence.split(" is ")[0] + "?";
    }
    if (sentence.includes(" occurs")) {
        return "When does " + sentence.replace(" occurs", "") + "?";
    }
    return "Explain this statement: \"" + sentence.substring(0, 60) + "...\"";
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ================= STORAGE + CHART =================
function saveAttempt(score) {
    let history = JSON.parse(localStorage.getItem("attempts")) || [];
    history.push(score);
    localStorage.setItem("attempts", JSON.stringify(history));
}

function drawChart() {
    const history = JSON.parse(localStorage.getItem("attempts")) || [];
    const ctx = document.getElementById("performanceChart");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: history.map((_, i) => `Attempt ${i + 1}`),
            datasets: [{
                label: "Score %",
                data: history,
                borderColor: "#4a6cff",
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}
