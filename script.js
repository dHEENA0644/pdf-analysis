let extractedText = "";
let questions = [];
let scores = [];
let chartInstance = null;

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

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
            let textPromises = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                textPromises.push(
                    pdf.getPage(i).then(page =>
                        page.getTextContent().then(content =>
                            content.items.map(item => item.str).join(" ")
                        )
                    )
                );
            }

            Promise.all(textPromises).then(texts => {
                extractedText = texts.join(" ").toLowerCase();
                document.getElementById("pdfStatus").innerText =
                    "PDF loaded successfully ✅";
                generateQuestions();
            });
        });
    };

    reader.readAsArrayBuffer(file);
}

function generateQuestions() {
    const keywords = [
        "definition",
        "process",
        "types",
        "advantages",
        "disadvantages",
        "example",
        "function"
    ];

    questions = keywords.filter(k => extractedText.includes(k));
    const qDiv = document.getElementById("questions");
    qDiv.innerHTML = "";

    if (questions.length === 0) {
        qDiv.innerHTML = "<p>No key topics detected. Try another PDF.</p>";
        return;
    }

    questions.forEach((q, i) => {
        qDiv.innerHTML += `
            <div class="question">
                <b>Q${i + 1}: Explain ${q}</b>
                <textarea id="ans${i}" placeholder="Your answer..."></textarea>
            </div>
        `;
    });

    document.getElementById("analyzeBtn").style.display = "inline-block";
}

function analyzeAnswers() {
    let totalScore = 0;
    scores = [];

    questions.forEach((q, i) => {
        const ans = document.getElementById(`ans${i}`).value.toLowerCase();

        if (ans.includes(q)) {
            totalScore += 10;
            scores.push(10);
        } else if (ans.length > 30) {
            totalScore += 5;
            scores.push(5);
        } else {
            scores.push(0);
        }
    });

    const percentage = Math.round(
        (totalScore / (questions.length * 10)) * 100
    );

    let level, motivation;

    if (percentage >= 75) {
        level = "Good Understanding";
        motivation = "Great work! Your concepts are clear.";
    } else if (percentage >= 50) {
        level = "Average Understanding";
        motivation = "You are improving. Revise weak areas.";
    } else {
        level = "Needs Improvement";
        motivation = "Don't worry. Focus on basics and try again.";
    }

    document.getElementById("result").innerHTML = `
        <p><b>Score:</b> ${percentage}%</p>
        <p><b>Understanding Level:</b> ${level}</p>
        <p><b>Feedback:</b> ${motivation}</p>
    `;

    saveAttempt(percentage);
    drawChart();
}

function saveAttempt(score) {
    let history = JSON.parse(localStorage.getItem("attempts")) || [];
    history.push(score);
    localStorage.setItem("attempts", JSON.stringify(history));
}

function drawChart() {
    const history = JSON.parse(localStorage.getItem("attempts")) || [];
    const ctx = document.getElementById("performanceChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

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
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
