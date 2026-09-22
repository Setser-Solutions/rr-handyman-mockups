#!/usr/bin/env python3
"""Categorize handyman photos using z-ai vision CLI."""
import json, subprocess, os, concurrent.futures, sys, time

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

def process_one(idx):
    img = f"{PHOTO_DIR}/img_{idx:03d}.jpg"
    if not os.path.exists(img):
        return idx, None, "missing"
    out_file = f"/tmp/vlm_{idx:03d}.json"
    try:
        r = subprocess.run([
            "z-ai", "vision",
            "-p", PROMPT,
            "-i", img,
            "-o", out_file,
        ], capture_output=True, text=True, timeout=180)
        if r.returncode != 0:
            return idx, None, f"exit={r.returncode} err={r.stderr[:200]}"
        # Read the JSON output file
        with open(out_file) as f:
            data = json.load(f)
        # The structure may vary; extract content
        content = None
        if isinstance(data, dict):
            # try common paths
            content = data.get('content') or data.get('response') or data.get('data',{}).get('content')
            if not content and 'choices' in data:
                content = data['choices'][0]['message']['content']
            if not content:
                content = json.dumps(data)[:400]
        # Parse JSON from content
        try:
            # Strip markdown fences if present
            c = content.strip()
            if c.startswith('```'):
                c = c.split('```')
                c = ''.join(s for s in c if not s.startswith('json'))[:0] or c
                # simpler: remove fences
                c = content.replace('```json','').replace('```','').strip()
            parsed = json.loads(c)
            return idx, parsed, "ok"
        except Exception as e:
            return idx, {"raw": content}, f"parse_fail: {e}"
    except subprocess.TimeoutExpired:
        return idx, None, "timeout"
    except Exception as e:
        return idx, None, f"err: {e}"

results = {}
# Process in batches of 6
all_idx = list(range(46))
# Resume: if results file exists, skip already-done
if os.path.exists(OUT):
    with open(OUT) as f:
        try:
            results = json.load(f)
        except:
            results = {}
    all_idx = [i for i in all_idx if str(i) not in results or results[str(i)].get('_status') != 'ok']
    print(f"Resuming: {len(all_idx)} remaining", flush=True)

print(f"Processing {len(all_idx)} photos with concurrency 6...", flush=True)
done = 0
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
    futs = {ex.submit(process_one, i): i for i in all_idx}
    for fut in concurrent.futures.as_completed(futs):
        idx, parsed, status = fut.result()
        results[str(idx)] = {"data": parsed, "_status": status}
        done += 1
        if done % 5 == 0 or done == len(all_idx):
            print(f"  [{done}/{len(all_idx)}] img_{idx:03d}: {status}", flush=True)
            # Save progress
            with open(OUT,'w') as f:
                json.dump(results, f, indent=2)

with open(OUT,'w') as f:
    json.dump(results, f, indent=2)
print(f"\nDone. Results saved to {OUT}", flush=True)

# Print summary
ok = sum(1 for v in results.values() if v.get('_status')=='ok')
print(f"OK: {ok}/{len(results)}")
cats = {}
for k,v in results.items():
    d = v.get('data') or {}
    c = d.get('category','?') if isinstance(d,dict) else '?'
    cats[c] = cats.get(c,0)+1
print("Categories:", cats)
