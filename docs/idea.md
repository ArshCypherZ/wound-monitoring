## The Idea

**One-liner:** An AI-powered post-discharge wound monitoring system that uses smartphone photos + a conversational voice agent to track surgical wound healing, detect complications early, and connect patients to clinicians when needed.

**Core loop:**

1. Hospital registers patient post-surgery → patient gets onboarded
2. Patient uploads daily wound photo via app
3. AI analyzes healing progress (segmentation, tissue classification, scoring)
4. Voice agent (phone call) discusses findings with the patient in their language, answers doubts, gives care tips
5. If anomaly detected → escalates instantly to a medical professional (live call transfer)

**Target wound type:** Post-surgical wounds in **high-risk patients** (diabetics, elderly, obese).

---

**Core approach**

- **Layer 1:** YOLOv8 → wound detection + bounding box crop
- **Layer 2:** Claude via Amazon Bedrock → takes cropped image + structured JSON (patient age, surgery date, days elapsed, previous scores) → returns `{healing_score, tissue_types, anomalies, urgency_level, voice_agent_script}`

> [TIP]
> For hackathon demo, Layer 2 (Bedrock) is the star. Layer 1 gives you credibility. Focus 70% effort on making the voice agent + Bedrock assessment flow buttery smooth.

### Known Risks & Mitigations

**Lighting/angle variation in patient photos**

Add in-app photo guidance (overlay frame, lighting check). Mention Swift's HealX approach as future work.

**Voice agent hallucination on medical advice**

Constrain responses to structured templates. Never diagnose, only "flag + connect". Add disclaimer.

---

## Proposed AWS Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Patient Mobile App                         │
│    (Photo Upload • Reminders • Healing Timeline • Profile)   │
└──────────────┬──────────────────────────┬────────────────────┘
               │ Upload Image             │ Receive Call
               ▼                          ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│   Amazon S3          │    │  Amazon Connect              │
│   (Image Storage)    │    │  (Voice Agent Platform)      │
└──────────┬───────────┘    │  + Amazon Lex (NLU)          │
           │                │  + Amazon Polly (TTS)        │
           ▼                │  + Bedrock Agent (Reasoning) │
┌──────────────────────┐    └──────────┬───────────────────┘
│  AWS Lambda          │               │
│  (Orchestrator)      │◄──────────────┘
└──────────┬───────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
┌─────────┐  ┌──────────────────┐
│ Layer 1 │  │ Layer 2          │
│ YOLOv8  │  │ Amazon Bedrock   │
│ (on     │  │ (Claude/GPT-4o)  │
│ Oracle  │  │ Vision + Text    │
│ Cloud)  │  │ Assessment       │
└────┬────┘  └────────┬─────────┘
     │                │
     └────────┬───────┘
              ▼
┌──────────────────────┐     ┌─────────────────────┐
│  DynamoDB            │────▶│ Hospital Dashboard  │
│  (Patient Records,   │     │ (Clinician View)    │
│   Scores, History)   │     └─────────────────────┘
└──────────────────────┘
```

### Key AWS Services Used

- **Amazon Bedrock**: Foundation model for wound assessment reasoning + voice agent brain
- **Amazon Connect**: Voice call platform (outbound calls to patients)
- **Amazon Lex**: Natural language understanding for voice conversations
- **Amazon Polly**: Text-to-speech (supports Hindi, Tamil, Telugu — key for Bharat)
- **AWS Lambda**: Serverless orchestration
- **Amazon S3**: Image storage
- **Amazon DynamoDB**: Patient data, assessment history
- **Amazon SNS**: Alerts to clinicians on urgent cases

---

## The Voice Agent Flow (USP)

This is what makes the idea unique. Here's the flow:

```
1. Daily wound photo uploaded → AI assesses
2. System triggers outbound call via Amazon Connect
3. Voice agent (powered by Bedrock):
   - "Hi Arsh, I've reviewed your wound photo from today."
   - "Your healing score is 7.2 out of 10, which is good."
   - "I notice the redness has reduced since yesterday."
   - "Are you experiencing any pain or unusual discharge?"
4. Patient responds → Lex processes intent
5. If patient says "yes, there's yellow discharge":
   - Agent flags urgency ↑
   - "I understand. Let me connect you with Dr. Dey right now."
   - Call transfers to clinician via Connect
6. If all good:
   - "Great! Remember to keep the area clean and dry."
   - "I'll check in again tomorrow. Take care!"
```

> [IMPORTANT]
> **Bharat angle:** Voice agent speaks in the patient's language (Hindi, Tamil, etc. via Polly). This is HUGE for rural India where app literacy is low but phone calls are familiar.

---

## India-Specific Impact (The "Bharat" in AWS AI for Bharat)


**74% doctors in cities, rural patients travel 8+ miles for follow-ups**

Remote monitoring eliminates unnecessary visits


**40% of nursing time spent on documentation**

Automated wound assessment saves clinician time


**Low digital literacy in rural areas**

Voice calls > app interactions. Patient doesn't need to read reports.


**Lack of wound care data in India**

Our system builds a structured wound healing database over time


**High post-surgical infection rates due to poor follow-up**

Daily AI monitoring catches infections 2-3 days earlier


**RPM shown to reduce ER visits by 92%, readmission by 40%**

Direct cost savings for hospitals

---

## Business Model (for the 20% criteria)


**Model**: B2B SaaS, sold to hospitals/clinics

**Pricing**: Per-patient per-month (₹200-500/patient/month post-surgery)

**Target**: Large hospitals doing 100+ surgeries/month

**Value prop**: Reduces readmissions (40%), reduces follow-up visits, improves patient 

**Market**: AI wound care market: $0.9B (2025) → $6.6B (2036). India is underserved.

**Go-to-market**: Pilot with 2-3 hospital chains → clinical validation → scale

**Revenue expansion**: Chronic wound management (diabetic ulcers), home healthcare agencies, insurance partners

---

## Headings

**Post-Discharge Wound Care Platform** 

**High-risk post-surgical patients (diabetics, elderly)** 

**Two-layer pipeline: YOLOv8 + Bedrock Vision**

**Proactive AI Voice Agent via Amazon Connect**

**Real-time escalation with live call transfer**

**Structured patient context fed to AI**

---

## What to Build for the Prototype (Scope)

### Must Have

- [ ] Patient photo upload → AI assessment result displayed
- [ ] Voice agent demo call showing assessment summary + Q&A
- [ ] Escalation flow (voice agent → "connecting you to doctor")
- [ ] Healing timeline view (3-5 days of mock progression)
- [ ] Hospital dashboard showing patient list + risk flags

### Nice to Have

- [ ] Hindi/regional language voice agent
- [ ] Medication reminder notifications
- [ ] Photo guidance overlay (in-app frame for wound shots)
- [ ] Real wound model inference (vs. mocked responses)

### Skip for Hackathon

- Full CRM features (appointments, billing, etc.)
- Real patient data integration
- HIPAA compliance implementation
- Mobile app deployment (web app is fine for demo)

> [CAUTION]
> Overbuilding. Focus on the demo flow, not feature completeness. A polished 3-feature demo beats a buggy 10-feature prototype every time.