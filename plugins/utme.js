import axios from 'axios';
import Cerebras from 'cerebras';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY || "csk-prcc628w42cc6jhjn48n5pe8xwhyyd26tteyek8x4dy8dpf6",
  warmTCPConnection: false
});

const userScores = new Map();
const userStreaks = new Map();
const currentQuestions = new Map();

module.exports = {
  command: 'utme',
  alias: [],
  description: 'Practice UTME questions',
  category: 'other',
  subjects: {
    'mathematics': 'Mathematics',
    'further-math': 'Further Mathematics',
    'english': 'English Language',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    // Add more subjects here...
  },
  execute: async (sock, m, { args, reply }) => {
    try {
      if (args.length === 0) {
        return reply(`Available subjects: ${Object.keys(this.subjects).join(', ')}`);
      }

      const subject = args[0].toLowerCase();
      const subjectName = this.subjects[subject];

      if (!subjectName) {
        return reply(`Invalid subject. Available subjects: ${Object.keys(this.subjects).join(', ')}`);
      }

      await loadQuestion(sock, m, subject, subjectName, reply);
    } catch (error) {
      console.error('UTME command error:', error);
      reply(`Error: ${error.message}`);
    }
  }
};

async function loadQuestion(sock, m, subject, subjectName, reply) {
  const apiUrl = `https:                                                       
  const response = await axios.get(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'AccessToken': 'QB-e1bc44df0c670fa0b972'
    },
    timeout: 15000
  });

  const questionData = response.data.data[0];
  const correctAnswer = questionData.answer;

  currentQuestions.set(m.chat, { question: questionData, correctAnswer });

  let questionText = `//questions.aloc.com.ng/api/v2/q/1?subject=${subject}`;
  const response = await axios.get(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'AccessToken': 'QB-e1bc44df0c670fa0b972'
    },
    timeout: 15000
  });

  const questionData = response.data.data[0];
  const correctAnswer = questionData.answer;

  currentQuestions.set(m.chat, { question: questionData, correctAnswer });

  let questionText = `📚 *${subjectName}*\n\n`;
  questionText += `❓ *Question:*\n${questionData.question}\n\n`;
  questionText += `*Options:*\n`;
  questionText += `A. ${questionData.option.a}\n`;
  questionText += `B. ${questionData.option.b}\n`;
  questionText += `C. ${questionData.option.c}\n`;
  questionText += `D. ${questionData.option.d}\n`;

  reply(questionText);

                     
  const collector = async (msg) => {
    if (msg.chat !== m.chat) return;

    const answer = msg.text.trim().toUpperCase();
    const correct = answer === correctAnswer;

                    
    if (!userScores.has(msg.sender)) {
      userScores.set(msg.sender, { total: 0, correct: 0, subjects: {} });
    }

    const userScore = userScores.get(msg.sender);
    userScore.total++;
    if (correct) userScore.correct++;

                    
    if (!userStreaks.has(msg.sender)) {
      userStreaks.set(msg.sender, 0);
    }

    const streak = userStreaks.get(msg.sender);
    if (correct) {
      userStreaks.set(msg.sender, streak + 1);
    } else {
      userStreaks.set(msg.sender, 0);
    }

                  
    const result = correct ? '✅ Correct!' : '❌ Wrong!';
    const explanation = await getAIExplanation(questionData.question, correctAnswer, answer, subjectName, correct, questionData.option);
    reply(`// Wait for answers
  const collector = async (msg) => {
    if (msg.chat !== m.chat) return;

    const answer = msg.text.trim().toUpperCase();
    const correct = answer === correctAnswer;

    // Update scores
    if (!userScores.has(msg.sender)) {
      userScores.set(msg.sender, { total: 0, correct: 0, subjects: {} });
    }

    const userScore = userScores.get(msg.sender);
    userScore.total++;
    if (correct) userScore.correct++;

    // Update streak
    if (!userStreaks.has(msg.sender)) {
      userStreaks.set(msg.sender, 0);
    }

    const streak = userStreaks.get(msg.sender);
    if (correct) {
      userStreaks.set(msg.sender, streak + 1);
    } else {
      userStreaks.set(msg.sender, 0);
    }

    // Send result
    const result = correct ? '✅ Correct!' : '❌ Wrong!';
    const explanation = await getAIExplanation(questionData.question, correctAnswer, answer, subjectName, correct, questionData.option);
    reply(`${result}\n\n${explanation}`);

                                   
    setTimeout(async () => {
      loadQuestion(sock, m, subject, subjectName, reply);
    }, 10000);
  };

  sock.on('message', collector);
}

async function getAIExplanation(question, correctAnswer, userAnswer, subject, isCorrect, options) {
  try {
    const prompt = `// Load next question after 10s
    setTimeout(async () => {
      loadQuestion(sock, m, subject, subjectName, reply);
    }, 10000);
  };

  sock.on('message', collector);
}

async function getAIExplanation(question, correctAnswer, userAnswer, subject, isCorrect, options) {
  try {
    const prompt = `You are a UTME/JAMB exam tutor(XADON AI). A student just answered a ${subject} question. Question: ${question} Options: A. ${options.a} B. ${options.b} C. ${options.c} D. ${options.d} Correct Answer: ${correctAnswer} Student's Answer: ${userAnswer} Result: ${isCorrect ? 'CORRECT' : 'WRONG'} ${isCorrect ? 'Provide a brief encouraging explanation (3-4 sentences) of why this answer is correct and reinforce the key concept.' : 'Provide a clear, concise explanation (4-5 sentences) of: 1) Why their answer is wrong, 2) Why the correct answer is right, 3) Key concept to remember.'} Keep it simple, educational, and encouraging. Use Nigerian and USA educational context where relevant. Maximum 400 characters.`;
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [{ role: "user", content: prompt }],
      stream: false
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI explanation error:', error);
    return 'Explanation not available.';
  }
}