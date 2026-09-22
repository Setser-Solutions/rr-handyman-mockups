#!/usr/bin/env python3
"""Retry failed VLM categorizations with low concurrency + backoff."""
import json, subprocess, os, concurrent.futures, time, random

PHOTO_DIR = "/home/z/my-project/public/handyman-photos"
OUT = "/home/z/my-project/download/icloud/categorization.json"

PROMPT = """You are a categorization assistant for a handyman business website.
Look at this photo and categorize it. Respond ONLY with strict JSON (no markdown fences) with this exact schema:

{
  "category": "<one of: plumbing | carpentry | power_washing | before_after | finished_work | worker_portrait | tools | other>",
  "subcategory": "<short tag, e.g. 'faucet_install', 'deck_build', 'driveway_wash', 'kitchen_remodel'>",
  "description": "<one-sentence description of what is shown>",
  "is_before_after": <true | false>,
  "quality": "<good | average | poor>",
  "hero_suitability": "<high | medium | low>",
  "tags": ["<tag1>", "<tag2>", "<tag3>"]
}

Decision rules:
- "plumbing": sinks, faucets, pipes, water heaters, toilets, drains, plumbing fixtures
- "carpentry": wood framing, decks, fences, cabinets, trim, doors, woodwork, drywall, finish carpentry
- "power_washing": pressure washing surfaces, driveways, patios, siding, decks being washed
- "before_after": split image or clearly before/after renovation comparison
- "finished_work": a polished completed project photo (use this if the result looks like a portfolio shot)
- "worker_portrait": the person is the main subject
- "tools": tools/equipment close-up
- "other": anything else

If a finished carpentry or plumbing project is clearly the subject, prefer the specific trade (plumbing/carpentry) over finished_work.
Be concise. Output ONLY the JSON object."""

def process_one(idx, max_retries=4):
    img = f"{PHOTO_DIR}/img_{idx:03d}.jpg"
    if not os.path.exists(img):
        return idx, None, "missing"
    out_file = f"/tmp/vlm_{idx:03d}.json"
    last_err = ""
    for attempt in range(max_retries):
        try:
            r = subprocess.run([
                "z-ai", "vision",
                "-p", PROMPT,
                "-i", img,
                "-o", out_file,
            ], capture_output=True, text=True, timeout=180)
            if r.returncode != 0:
                last_err = f"exit={r.returncode} err={r.stderr[:150]}"
                # backoff
                time.sleep(2 + attempt*3 + random.random()*2)
                continue
            with open(out_file) as f:
                data = json.load(f)
            content = None
            if isinstance(data, dict):
                content = data.get('content') or data.get('response')
                if not content and 'choices' in data:
                    content = data['choices'][0]['message']['content']
                if not content:
                    content = json.dumps(data)[:400]
            c = content.strip()
            if c.startswith('```'):
                c = content.replace('```json','').replace('```','').strip()
            parsed = json.loads(c)
            return idx, parsed, "ok"
        except subprocess.TimeoutExpired:
            last_err = "timeout"
            time.sleep(3)
        except Exception as e:
            last_err = f"err: {e}"
            time.sleep(2)
    return idx, None, last_err

# Load existing
with open(OUT) as f:
    results = json.load(f)

# Identify which need retry
need_retry = [int(k) for k,v in results.items() if v.get('_status')!='ok']
print(f"Need retry: {len(need_retry)}", flush=True)

# Sequential this time with small backoff between each call
done = 0
for idx in need_retry:
    i, parsed, status = process_one(idx)
    results[str(i)] = {"data": parsed, "_status": status}
    done += 1
    if done % 3 == 0 or done == len(need_retry):
        print(f"  [{done}/{len(need_retry)}] img_{i:03d}: {status}", flush=True)
        with open(OUT,'w') as f:
            json.dump(results, f, indent=2)
    # small inter-call delay
    time.sleep(0.4)

with open(OUT,'w') as f:
    json.dump(results, f, indent=2)
print(f"\nDone.", flush=True)
ok = sum(1 for v in results.values() if v.get('_status')=='ok')
print(f"OK: {ok}/{len(results)}")
cats = {}
for k,v in results.items():
    d = v.get('data') or {}
    c = d.get('category','?') if isinstance(d,dict) else '?'
    cats[c] = cats.get(c,0)+1
print("Categories:", cats)
