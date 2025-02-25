async function storeEvaluationData(uniqueId, examDate, subjectStats, totalScore) {
    const urlInput = document.getElementById("answerSheetUrl").value.trim();
    const submissionTime = new Date().toISOString(); // Capture current time in ISO format

    const isPCM = subjectStats.physics?.attempted > 0 || subjectStats.chemistry?.attempted > 0;
    const isMathsAptitude = subjectStats.maths?.attempted > 0 && subjectStats.aptitude?.attempted > 0;
    const isMathsAptitudePlanning = isMathsAptitude && subjectStats.planning?.attempted > 0;

    const payload = {
        id: uniqueId,
        examDate,
        answerSheetUrl: urlInput,
        submissionTime,
        scores: {
            physics: isPCM 
                ? (subjectStats.physics?.correct * 4 - subjectStats.physics?.incorrect + subjectStats.physics?.dropped * 4) 
                : "-",

            chemistry: isPCM 
                ? (subjectStats.chemistry?.correct * 4 - subjectStats.chemistry?.incorrect + subjectStats.chemistry?.dropped * 4) 
                : "-",

            maths: subjectStats.maths?.attempted > 0 
                ? (subjectStats.maths.correct * 4 - subjectStats.maths.incorrect + subjectStats.maths.dropped * 4) 
                : "-",

            aptitude: isMathsAptitude 
                ? (subjectStats.aptitude?.correct * 4 - subjectStats.aptitude?.incorrect + subjectStats.aptitude?.dropped * 4) 
                : "-",

            planning: isMathsAptitudePlanning 
                ? (subjectStats.planning?.correct * 4 - subjectStats.planning?.incorrect + subjectStats.planning?.dropped * 4) 
                : "-",

            totalScore,
        },
    };

    saveToLocalStorage(uniqueId, payload);

    // Send data to InfinityFree database
    try {
        const response = await fetch("https://yourdomain.infinityfreeapp.com/storeScore.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to store score. HTTP status: ${response.status}`);
        }

        console.log("Score stored successfully in the database.");
    } catch (error) {
        console.error("Error storing evaluation score:", error.message);
    }
}
