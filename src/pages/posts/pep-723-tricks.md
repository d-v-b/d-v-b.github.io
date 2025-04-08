---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'PEP 723 and pytest'
pubDate: '2025-04-06'
description: 'Distributing self-contained tests with PEP 723 inline script metadata.'
author: 'Davis Bennett'
tags: ["PEP 723", "pytest"]
---

When I find a bug that I don't understand, I usually want someone else to see the bug, because maybe *they* understand it, and can fix it. This often requires getting another person to run my bugged code. which is in general rather complicated. 

I'm pleased to report some small progress on this problem in the python ecosystem. First, I learned that you can run [`pytest`](https://docs.pytest.org/en/stable/) inside a python script with the following pattern:

```python

import pytest

# define tests here

pytest.main([__file__])
```

Combine this `pytest` feature with [PEP 723 inline script metadata](https://peps.python.org/pep-0723/), and you can do something like this:


```python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pytest",
# ]
# ///

import pytest

@pytest.mark.parametrize('value', [0, 1, 2])
def test_kvstore_list(value):
    assert 1 / value == 1

pytest.main([__file__])
```

This is a bit of an off-label use of `pytest`. Instead of running the test suite of a library, `pytest` is being used as a tool for parameterizing execution of arbitrary python code, in this case code that reveals a "bug", or at least an error. 

`pytest` lets us compactly parametrize the function of interest in this script, and the PEP 723 inline script metadata makes the  script *extremely* distributible. 

Just copy + paste that code and run it with a PEP 723-compatible tool like `uv` or `hatch`:
- `uv run <name of script>` 
- `hatch run <name of script>` 

or get it from [this Github gist](https://gist.github.com/d-v-b/84aa5c5cb5d23bbbfb366a26ee92490f) (e.g., using the Github cli)

I think this offers a fast, expressive way to communicate bug reports or benchmarks. I hope you find it useful!