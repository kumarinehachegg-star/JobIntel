# Database Schema (MongoDB / Mongoose) — Initial drafts

Below are starter Mongoose schema designs for core entities. These are starting points and will be expanded with indexes, validation and relations.

1) User
```js
{
  _id: ObjectId,
  email: String, // unique
  passwordHash: String,
  name: String,
  phone: String,
  roles: [String], // e.g., ["user","admin"]
  tier: String, // free|premium|ultra
  notificationPrefs: {
    email: Boolean,
    whatsapp: Boolean,
    telegram: Boolean
  },
  consent: {
    autoApply: Boolean,
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

2) Company
```js
{
  _id: ObjectId,
  name: String,
  website: String,
  careerPage: String,
  metadata: Object,
  createdAt: Date
}
```

3) Job
```js
{
  _id: ObjectId,
  source: String, // e.g., career-page, ats
  companyId: ObjectId,
  title: String,
  location: String,
  employmentType: String,
  description: String,
  requirements: [String],
  responsibilities: [String],
  ctc: String,
  applyUrl: String,
  externalId: String, // job id on source site
  rawHtml: String, // optional raw capture
  parsedAt: Date,
  status: String, // draft|published|archived
  meta: {
    parserConfidence: Number,
    tags: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

4) Application (user applied to job)
```js
{
  _id: ObjectId,
  userId: ObjectId,
  jobId: ObjectId,
  appliedAt: Date,
  method: String, // manual|auto|semi-auto
  status: String, // submitted|confirmed|rejected
  proof: Object, // screenshot / confirmation id
}
```

5) NotificationLog
```js
{
  _id: ObjectId,
  userId: ObjectId,
  jobId: ObjectId,
  channel: String, // email|whatsapp|telegram
  payload: Object,
  status: String, // queued|sent|failed
  attempts: Number,
  lastError: String,
  createdAt: Date
}
```

6) Referral
```js
{
  _id: ObjectId,
  referrerUserId: ObjectId,
  referredEmail: String,
  jobId: ObjectId,
  status: String, // created|accepted|paid
  commission: Number,
  createdAt: Date
}
```

Indexes & notes
- Add indexes on `email` (User), `externalId` (Job), `companyId` + `status` for fast queries.
- Consider text indexes on `title` and `description` for search.

Next steps (Phase 3 will formalise schemas and add Mongoose models + seeds)
