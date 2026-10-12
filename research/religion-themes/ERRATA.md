# Errata for report.md and the theme files

Written 2026-10-10, after Astra (an agent on Nate's PC) reviewed this folder. A separate checker tested each of Astra's points against the files; every point below was confirmed or partly confirmed. `report.md` and the theme files are left as they were, so read them together with this page.

None of these changes the headline count of 7 moderate and 9 weak themes, except as noted for R10, and none changes the isnad experiment.

## Evidence ratings

**R10 rests on two clusters, not three.** `report.md` line 11 says a moderate rating needed "about three unconnected clusters". R10's two surviving claims each have two: domain-scoped authority (India and the Latin West, `themes/R10.md` line 29) and competence versus honesty as separate axes (Nyaya and hadith criticism, line 32). Its three-cluster parts, "I don't know" (line 25), precedence rules (line 30) and the pragmatic results test (line 33), are all discounted by R10 itself, as a generic norm, as saying little about minds, or as different tests. So R10 is moderate on the strength of the selective-trust science, below the report's own rough guide. Applied strictly, the count would be 6 moderate and 10 weak. The ranking would probably not change, because it weighs the experiment more than the human evidence (`report.md` line 30). Line 336 should also not describe R10 as resting on "three or four" clusters.

**Ifá's borrowing direction is contested.** `report.md` lines 11 and 178 say "Ifá derives from Arabic geomancy". `themes/R03.md` line 39 says the direction of borrowing is contested. Read both lines as: "Ifá shares the sixteen geomantic figures with Arabic geomancy, so it is not independent of that complex; which way the borrowing ran is contested." R03 stays weak either way.

## Experiment designs

**R04 (custos test): 10 samples can't show a value is below 5%.** `themes/R04.md` line 146 picks a true value "that no model rates above 0.05", using 10 samples per slot for API models (line 144). With 0 hits in 10 draws, the one-sided 95% upper bound is 25.9%. Getting it under 5% takes 59 draws, or 80 if it must hold for all three API models at once. Open-weight models use logprob scoring and aren't affected. The fix: screen at 10 samples, then confirm kept slots at 59 or more, or use logprobs where the API gives them.

**R04 budget: the API sampling is about 5 times the stated count.** Line 190 says Stage 1 is "about 28k calls, about 40M input tokens; most on open weights". As written, it needs 4,800 slots × 10 samples × 3 API models = 144,000 API samples, about 150 to 220 million input tokens before caching. The 28k figure matches 4,800 slots × 6 open-weight models, so the API part seems to have been left out. `report.md` line 92's API budget is probably too low by several hundred dollars to about $1k.

**R10 (trust creep): which factors are crossed isn't stated.** Fully crossing 200 tasks × 6 actions × 6 record conditions × 3 paraphrases × 3 prefixes gives 64,800 calls per monitor, against "about 26k" at `themes/R10.md` line 219. The 26k figure fits if paraphrases rotate across tasks (21,600 full-context calls plus 3,600 record-blind calls), but the file never says so. If everything is crossed, adding the same 3,600 record-blind calls gives 68,400 calls against 25,200, about 2.7 times as many. The cost estimate in `report.md` lines 5 and 76 would rise from about $300 to about $800 without a flagship monitor, and from up to about $2.5k to up to about $7k with one. Two more factors are unallocated: the record sizes "N = 10 / 100 / 1000" in H1 (line 145) aren't among the six record conditions, and the before-or-after placement at line 210 isn't budgeted.

**R10: thresholds and the max rule need tightening.** Line 212 says thresholds are "always" recalibrated under the matching condition, but H1 (line 146) uses one fixed threshold. Both are needed, so this is a wording fix: H1 uses a fixed threshold to measure the combined shift, and H2 recalibrates to isolate discrimination. The "Deuteronomy" protocol that takes the higher of two scores (lines 149 and 182 to 185) also needs three things. The two scores should be rank-normalized before the max. Calibration should use a held-out split. And it needs a compute-matched baseline, such as the max of two differently prompted full-context passes, because it costs two monitor passes. "A record can raise suspicion but never lower it" (`report.md` line 76) holds for scores, not for decisions after recalibration.

**R06 (credit the dropped temptation): the hack labels count honest bugs.** `themes/R06.md` lines 139 to 144 label "passing the visible tests while failing the hidden ones" as a hack, with no judge. An honest but buggy solution does the same. A hack label should require evidence of an exploit, such as a test or conftest edit, special-casing confirmed by perturbing inputs, or exit, monkeypatch or `__eq__` tricks. Line 135 calls any "I considered editing the tests" on locked tasks "performative by construction". That is too strong: the model may not know the tests are locked, and exit or monkeypatch tricks still work there (lines 143 and 200). Measure those mentions as a rate against the other arms instead. These labels feed R06's main metric and its decision rules (lines 182 and 183).

## Prior work found since the report

Already cited in the report, so not new: Goel et al. 2025, Kim et al. 2025, and OpenAI's confessions work.

New and relevant:

- **Kawada & Kellis 2026, "Evidence Integration in Large Language Models" (arXiv 2609.04290).** Models adopt candidate answers they already find probable, and their own characteristic errors more readily than other models'. This is close to the custos test's H1. Custos's remaining novelty is detection with the source in view, and the mechanical-anchor remedy.
- **MARCH 2026 (arXiv 2603.24579).** Already has a checker that answers from the source documents while blinded to the solver's answer. Use it as a baseline arm in custos.
- **"Attack Selection in Agentic AI Control Evaluations Meaningfully Decreases Safety" 2026 (arXiv 2606.06529).** Adjacent to trust creep, without testing reputation. A selective-attacker arm would keep a reputation effect from being confused with attack timing.
- **BashArena (arXiv 2512.15688) and ControlArena (UK AISI and Redwood Research).** Ready-made bash control tasks that could replace R10's 200 custom tasks. ControlArena is MIT-licensed, but check each setting's data licence first.
- **Kaufmann et al. 2026 (arXiv 2603.30036).** Aligned and orthogonal chain-of-thought rewards kept monitorability; in-conflict ones destroyed it. R06 should classify its arms in those terms and justify its RL budget by the declined-exploit bonus specifically.
- **"Reasoning Under Pressure" (arXiv 2512.00218).** Directly optimizing for monitorability did not reliably help. A caution for R06's 15-point target.
- **SpecBench (arXiv 2605.21384), TRACE (arXiv 2601.20103) and "Auditing Reward Hackability in Code RL Training Environments" (arXiv 2606.16062).** Coding-agent grader exploits are well covered. A grader-cheating study should pitch realistic tasks, verified exploits and hardened graders rather than a new category.
