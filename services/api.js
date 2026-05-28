// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api/study';


// const TEMP_USER_ID = "60c72b2f9b1d8b2bad7f103d"; 

// export const generateFlashcards = async (inputNotes, topic = "General Topic", category = "General") => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/generate`, {
//             userId: TEMP_USER_ID,
//             inputNotes,
//             topic,
//             category,
//             type: 'flashcards'
//         });
//         return response.data; // Passes the array straight to parseFlashcards()
//     } catch (error) {
//         console.error("Error generating flashcards:", error);
//         throw error;
//     }
// };

// export const generateQuiz = async (inputNotes, topic = "General Topic", category = "General") => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/generate`, {
//             userId: TEMP_USER_ID,
//             inputNotes,
//             topic,
//             category,
//             type: 'quiz'
//         });
//         return response.data; // Passes the array straight to parseQuiz()
//     } catch (error) {
//         console.error("Error generating quiz:", error);
//         throw error;
//     }
// };

// export const summarize = async (inputNotes, topic = "General Topic", category = "General") => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/generate`, {
//             userId: TEMP_USER_ID,
//             inputNotes,
//             topic,
//             category,
//             type: 'summary'
//         });
//         return response.data; // Passes the text string straight to normalizeResponse()
//     } catch (error) {
//         console.error("Error generating summary:", error);
//         throw error;
//     }
// };




import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/study';

const getAuthHeaders = () => {
    const token = localStorage.getItem("studyGeniusToken");
    return {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data' 
        }
    };
};


export const processStudyDocument = async (pdfFile) => {
    if (!pdfFile) throw new Error("Please specify an input note document first.");

    // Wrap the file inside standard multi-part FormData matching your backend 'pdf' key
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
        const response = await axios.post(`${API_BASE_URL}/generate`, formData, getAuthHeaders());
        
        if (response.data?._id) {
            localStorage.setItem("activeStudySessionId", response.data._id);
            if (response.data.quiz?.questions) {
                localStorage.setItem("activeQuizQuestionsArray", JSON.stringify(response.data.quiz.questions));
            }
        }
        
        return response.data;
    } catch (error) {
        console.error("💥 UI Engine Document Generation failure:", error.response?.data || error.message);
        throw error.response?.data?.error || error.message;
    }
};

export const askAiEngineQuestion = async (question) => {
    const docId = localStorage.getItem("activeStudySessionId");
    const token = localStorage.getItem("studyGeniusToken");
    
    if (!docId) throw new Error("Please process a workspace document first to map context.");

    try {
        const response = await axios.post(`${API_BASE_URL}/ask-question`, 
            { docId, question },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("💥 AI Query evaluation failure:", error.response?.data || error.message);
        throw error.response?.data?.error || error.message;
    }
};