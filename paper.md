Absolutely. Here's a more **expert-level, detailed slide deck** that integrates the **figures and arguments from the original paper** to present *Passerine: Agentic Program Repair in an Industrial Codebase* convincingly to your boss.

This version focuses on:

* Incorporating concrete experimental results (e.g. Fig 3, 4, 7, 8, 9)
* Citing detailed comparisons (SWE-Bench vs GITS, Human vs Machine bugs)
* Framing insights as **strategic takeaways for internal engineering or AI adoption**

---

## 🧠 Detailed Slide Deck — Expert-Level Review of "Passerine"

---

### ✅ Slide 1: Title Slide

**Title:**
📘 *Passerine: Industrial-Scale Agentic Program Repair at Google*
**Subtitle:**
Insights from Deploying LLM Agents on Real Bugs at Scale

---

### ✅ Slide 2: Motivation

**Title:**
Why This Paper Matters
**Content:**

* Existing APR (Automated Program Repair) focuses on academic, small-scale bugs
* Google deploys LLM-based agent (Passerine) in their internal codebase
* Evaluates it on 178 curated bugs (from 80K+ real issues in GITS)
* First large-scale analysis of agentic repair on multilingual, production-grade monorepos

---

### ✅ Slide 3: System Architecture

**Title:**
Passerine Agent Design (Fig. 5)
**Content:**

* ReAct-style loop: *"Think → Act → Observe"*
* 5 core commands: `code_search`, `cat`, `edit`, `bazel`, `finish`
* Operates entirely via API-bound commands — no full Linux shell needed
* Accesses internal infra: Code Search, Test infra, Filesystem containers
* No hardcoded flow (no state machine)

📊 Use Fig. 5 to show the modular, minimal design

---

### ✅ Slide 4: Benchmark Construction

**Title:**
GITS-Eval: A Real-World, Curated Benchmark (Fig. 1)
**Content:**

* Constructed via 4-phase funnel (manual + automatic filtering)
* Final benchmark = 178 bugs:

  * 78 Human-reported
  * 50 SAN (Sanitizer errors)
  * 50 TOD (Test Order Dependency)
* Compared against SWE-Bench:

  * Larger, multilingual patches
  * More dispersed edits
  * Fewer identifiable code tokens in descriptions

📊 Show Fig. 1 (pipeline), support with Fig. 3(a–e)

---

### ✅ Slide 5: Dataset Characteristics

**Title:**
GITS vs SWE-Bench: Real-World Bugs Are Harder (Fig. 3)
**Content:**

* GITS bugs have:

  * Fewer code-identifiable tokens → harder to search (Fig. 3a)
  * Patches span more files (3b)
  * Higher patch spread (3c)
  * More hunk edits (3d)
  * More total lines changed (3e)
* Human bugs especially sparse in signals

📊 Use Fig. 3 side-by-side with bullet explanations

---

### ✅ Slide 6: Evaluation Setup

**Title:**
Evaluation Methodology
**Content:**

* Gemini 1.5 Pro (no fine-tuning)
* 20 independent trajectories per bug
* Max 25 steps each
* Patch types:

  * **Plausible**: passes ground-truth test
  * **Valid**: semantically equivalent to ground-truth
* All manual annotation by 3 reviewers
* Separate evaluation for machine vs human bugs

---

### ✅ Slide 7: Key Result 1 – Patch Success

**Title:**
Patch Generation Success (Fig. 7)
**Content:**

* Passerine generates at least 1 plausible patch in:

  * 78% SAN bugs
  * 68% TOD bugs
  * 25.6% Human bugs
* Valid patch rates (manually annotated):

  * 62% SAN
  * 24% TOD
  * 17.9% Human

📊 Show Fig. 7(a)(b) — plausibility vs validity divergence
🧠 Insight: Machine bugs benefit from structured reproduction; human bugs suffer from sparse info

---

### ✅ Slide 8: Key Result 2 – Bug Report Structure Matters

**Title:**
Machine Bugs Yield Better Localization (Fig. 9)
**Content:**

* Even in failure cases (no plausible patch):

  * 54% of machine-bug trajectories still edited correct file
  * Only 3.5% for human-bug trajectories
* File-System Distance used as metric (Fig. 9)
  🧠 Insight:
  Structured bug reports (repro steps, test links) directly enable agent alignment

---

### ✅ Slide 9: Key Result 3 – Adaptive Strategy by Bug Type (Fig. 8)

**Title:**
Agent Self-Adapts to Bug Structure
**Content:**

* Human bugs → starts with `code_search`, `cat`
* Machine bugs → starts with `bazel`, later switches to `edit`
* Fig. 8 shows command usage over 25 steps per bug type
  🧠 Insight: No strategy engine needed — prompt alone allows strategic adaptation

---

### ✅ Slide 10: Trajectory Smells for Optimization

**Title:**
Behavioral Smells Reveal Failure Modes (Table V)
**Content:**

* Failures often show:

  * No test execution (`NO_TEST_SMELL`)
  * Repeated reads/edits (`NO_OP_CAT`, `CONSECUTIVE_EDIT`)
  * Excessive searching (`CONSECUTIVE_SEARCH`)
* Table V shows smell incidence vs bug type & success
  🧠 Insight: These metrics can guide agent pruning & early aborts

---

### ✅ Slide 11: Design & Future Plans

**Title:**
Design Decisions & Research Opportunities
**Content:**

* Limitations:

  * No test synthesis (future: agent-generated tests)
  * Context overflow (2M tokens max)
  * Lacks patch diversity (e.g., beam search)
* Improvements planned:

  * Sliding windows or memory summarization
  * Abstention predictor (avoid expensive no-op runs)
  * Expansion of supported tools (e.g., link/file access)

---

### ✅ Slide 12: Strategic Takeaways

**Title:**
What This Tells Us
**Content:**
✅ Lightweight agents with minimal tool API can fix real bugs
✅ Agent success highly sensitive to bug report structure
✅ Multi-agent architectures + prompt engineering = next frontier
✅ Google’s monorepo strategy, code search infra, and standardized test runners made this viable
✅ Internal evaluation of LLM-based repair agents is feasible — starting with machine-generated bugs

---

Would you like me to export this to a PowerPoint/Keynote format or generate speaker notes next?



 Summary: Industrial-Scale Agentic Program Repair at Google
📊 Benchmark – GITS-Eval (178 Real Bugs)
Curated from Google’s internal issue tracking system (GITS), the GITS-Eval dataset includes:

78 human-reported bugs

100 machine-reported bugs, split into:

50 Sanitizer bugs (via static analysis)

50 TOD bugs (Test Order Dependency)

All bugs are reproducible, testable, and aligned with agent capabilities.

🤖 Agent – Passerine
A lightweight LLM-based agent for automated repair, designed to operate within Google’s developer ecosystem.

Architecture: ReAct loop (Think → Act → Observe)

Command set:

cat: View file contents

code_search: Search monorepo

edit: Modify source

bazel: Build & run tests

finish: Terminate repair

Minimalist yet expressive — fully API-integrated into Google’s infra

📈 Results (Using Gemini 1.5 Pro, 20 trajectories/bug)
Bug Type	Plausible Patch Rate	Valid Patch Rate (Manual)
🧠 Human Bugs	25.6%	17.9%
⚙️ Machine Bugs	73.0%	43.0%

🟢 Machine-reported bugs are significantly easier to fix due to structured bug descriptions (e.g., test targets, repro info).
🔵 Human-reported bugs show challenges in localization and patch precision.

🧠 Key Insight:
Bug report quality, not just model capability, is a primary driver of agent performance.
