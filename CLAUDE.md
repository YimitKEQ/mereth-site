@AGENTS.md

## Knowledge graph (read this before grepping the codebase)

`graphify-out/graph.json` is a knowledge graph of this site: every TypeScript symbol with
its imports and calls, the design and product rationale from `DESIGN.md` and `PRODUCT.md`,
the route registry, and the in-world lore from the `Lore/` PDFs.

**Use it first for any "how does X work" or "what touches Y" question.** A query costs a few
hundred tokens and returns the real subgraph. Reading the same answer out of files costs tens
of thousands and usually misses a caller.

```
python -m graphify query "what reads mereth.json?"
python -m graphify explain "OrnateBox"
```

`graphify-out/wiki/index.md` is the same graph as prose, one article per cluster.

The parent mod workspace at `D:/MerethRP` holds a **merged** graph that spans this site and
the devkit together, bridged on the real data dependency: `scripts/export-mereth-data.mjs`
reads `../devkit/data/*.json`, which the devkit's wiki generators write. Ask questions there
when the answer crosses the boundary, for example "where does the crafting page's data come
from". Query it from `D:/MerethRP`, not from here.

Rebuild after changing code, or let the post-commit hook do it:

```
python ../scripts/build-graph.py website   # this site only
python ../scripts/build-graph.py all       # both projects plus the merged graph
```

The site's 158 screenshots under `MerethPics/` and `public/img/` are excluded on purpose:
each would cost a vision call and yield a node like "a screenshot of a tavern". The Lore PDFs
are kept, because their content is real canon. Concepts extracted from prose live in the
committed `graphify-out/semantic.json`; if you edit a doc, the rebuild prints `changed:
<file>` and that file's concepts stay stale until the `/graphify` skill re-extracts it. Code
is always current.
