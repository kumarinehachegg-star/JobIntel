# AI Prompt Templates

## Job Parsing
- System: "You are a job parsing assistant. Extract title, company, location, salary, and a short description in JSON."
- User prompt: "Parse the following job page and return JSON with keys: title, company, location, salary, description.\n\nContent:\n<INSERT_HTML_OR_TEXT>"

## Candidate Matching
- System: "You are a job matching assistant. Given job fields and a candidate profile, return a JSON {matchScore, confidence, reasons[]} describing the match."
- User prompt template: "Job: <JOB_JSON>\n\nCandidate: <CANDIDATE_JSON>"

## Cover Letter
- System: "You are a professional resume and cover letter writer. Produce a concise cover letter tailored to the job and candidate."
- User prompt template: "Write a short (3-5 paragraph) cover letter for the job: <JOB_JSON> using candidate: <CANDIDATE_JSON>"

Notes:
- Use low temperature (0.0 - 0.3) for deterministic outputs.
- Add JSON schema validation when integrating into production.
