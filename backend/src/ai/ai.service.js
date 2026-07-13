const axios = require("axios");

let lastRequestTime = 0;
const MIN_INTERVAL = 2000;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const requestWithRetry = async (fn, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {

      const status = err.response?.status;

      // 503 немесе 429 болса күтеміз
      if (status === 503 || status === 429) {

        const delay = (i + 1) * 3000;

        console.log(
          `AI busy. Retry ${i + 1}/${retries} after ${delay}ms`
        );

        await sleep(delay);

        continue;
      }

      throw err;
    }
  }

  throw new Error("AI retry failed");
};

// мектеп сұрақ тексеру
const isSchoolQuestion = (message) => {
  const keywords = [
    "баға","сабақ","мектеп","оқушы",
    "үй тапсырмасы","мұғалім","кесте",
    "сынып","пән","үлгерім",
    "оқу","балам","баламның","нәтиже",
    "экзамен","тест","күнделік","журнал","мен","админ"
  ];

  const text = message.toLowerCase();
  return keywords.some(word => text.includes(word));
};

const adminPrompt = require("./prompts/admin.prompt");
const teacherPrompt = require("./prompts/teacher.prompt");
const studentPrompt = require("./prompts/student.prompt");
const parentPrompt = require("./prompts/parent.prompt");

/*const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";*/

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

const getCurrentDay = () => {
  const days = [
    "Sunday","Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday"
  ];
  return days[new Date().getDay()];
};

const AIService = {
  handleQuestion: async (user, message, authHeader) => {
    try {
      const now = Date.now();
      if (now - lastRequestTime < MIN_INTERVAL) {
        return "Сәл күтіңіз (AI тым жиі шақырылып жатыр)";
      }
      lastRequestTime = now;

      if (!isSchoolQuestion(message)) {
        return "Мен тек мектеп жүйесіне қатысты сұрақтарға жауап беремін";
      }

      let data = {};

      // ================= ADMIN =================
      if (user.role === "admin") {
        const api = axios.create({
          baseURL: "http://localhost:5000",
          headers: { Authorization: authHeader }
        });

        const [topRes, weakRes, subjectRes, statsRes] = await Promise.all([
          api.get("/api/dashboard/top-students"),
          api.get("/api/dashboard/weak-students"),
          api.get("/api/dashboard/subject-stats"),
          api.get("/api/dashboard/stats")
        ]);

        data = {
          topStudents: topRes.data,
          weakStudents: weakRes.data,
          subjects: subjectRes.data,
          stats: statsRes.data
        };
      }

      // ================= TEACHER =================
      if (user.role === "teacher") {
        const currentDay = getCurrentDay();

        const api = axios.create({
          baseURL: "http://localhost:5000",
          headers: { Authorization: authHeader }
        });

        const [scheduleRes, classRes, subjectRes, gradesRes] =
          await Promise.all([
            api.get(`/api/schedules/teacher/my?day=${currentDay}`),
            api.get("/api/classes/teacher/my-class"),
            api.get("/api/teacher-subjects/me"),
            api.get("/api/grades/teacher/me")
          ]);

        const classId = classRes.data?.id;

        let students = [];
        if (classId) {
          const studentsRes = await api.get(`/api/classes/${classId}/students`);
          students = studentsRes.data;
        }

        data = {
          schedule: scheduleRes.data,
          classes: classRes.data,
          subjects: subjectRes.data,
          grades: gradesRes.data,
          students
        };
      }

      // ================= STUDENT =================
      if (user.role === "student") {
        const currentDay = getCurrentDay();

        const api = axios.create({
          baseURL: "http://localhost:5000",
          headers: { Authorization: authHeader }
        });

        const [profileRes, scheduleRes, gradesRes] = await Promise.all([
          api.get("/api/auth/me"),
          api.get(`/api/schedules/student/my?day=${currentDay}`),
          api.get(`/api/grades/student/${user.student_id}`)
        ]);

        data = {
          profile: profileRes.data,
          schedule: scheduleRes.data,
          grades: gradesRes.data
        };
      }

      // ================= PARENT (ОПТИМИЗАЦИЯ) =================
      if (user.role === "parent") {
        const api = axios.create({
          baseURL: "http://localhost:5000",
          headers: { Authorization: authHeader }
        });

        const childrenRes = await api.get("/api/parents/my-children");
        const children = childrenRes.data;

        const childrenData = await Promise.all(
          children.map(async (child) => {
            try {
              const gradesRes = await api.get(`/api/parents/child/${child.id}/grades`);
              return {
                profile: child,
                grades: gradesRes.data
              };
            } catch {
              return null;
            }
          })
        );

        data = {
          children: childrenData.filter(Boolean)
        };
      }

      // ================= PROMPT =================
      let prompt = "";

      if (user.role === "admin") prompt = adminPrompt(message, data);
      if (user.role === "teacher") prompt = teacherPrompt(message, data);
      if (user.role === "student") prompt = studentPrompt(message, data);
      if (user.role === "parent") {
        const safeData = {children: JSON.stringify(data.children).slice(0, 2000)};
        prompt = parentPrompt(message, safeData);
      }

      // ================= AI REQUEST =================
      
      const response = await requestWithRetry(() =>
  axios.post(
    `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    }
  )
);

      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI жауап бере алмады";

      return text;

    } catch (err) {

  console.error("AI ERROR:", err.response?.data || err.message);

  if (err.response?.status === 429) {
    return "AI лимитіне жетті";
  }

  if (err.response?.status === 503) {
    return "AI сервері бос емес. Қайта көріңіз";
  }

  return "AI уақытша жұмыс істемейді";
}
  }
};

module.exports = AIService;