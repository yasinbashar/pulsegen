const OpenAI = require('openai');
const addReport = require('./addReport');

const genReport = async (req, res) => {
    const openai = new OpenAI({apiKey : process.env.OPENAI_API_KEY});
    const model = 'gpt-3.5-turbo-0125';
    let messages = [];
    messages.push({
        role: 'system',
        content: process.env.REPORT_SECRET_SAUCE
    });
    if (req.body && Array.isArray(req.body)) {
        messages = [...messages, ...req.body];
    }
    try {
        const completion = await openai.chat.completions.create({
            model,
            messages,
            response_format: { type: "json_object" },
        });
        const aiResponse = completion.choices[0].message.content;
        const report = aiResponse;
        const addedReport = await addReport(report);
        res.status(201).json({ _id: addedReport._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = genReport;