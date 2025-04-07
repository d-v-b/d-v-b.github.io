---
title: 'PEP 723 and pytest'
pubDate: '2025-04-06'
description: 'Inline script metadata makes it easy to distribute self-contained tests.'
author: 'Davis Bennett'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["PEP 723", "pytest"]
---

I really like the process of writing tests. A lot of my API ideas come from feeling pain when writing 
a test, interpreting that pain as a signal, and using that signal to informs an API change. The logic here is simple -- tests resemble actual usage of a library. If a test for a particular feature is annoying to design and write, it's very likely that a user of that feature will experience similar annoyance.

So anything that makes tests 
easier to write can also make API evolution faster. 

I also like `pytest`, because it provides a lot of tools for parametrically evaluating code. To be
clear, I'm not a "python testing ecosystem" expert. I've only used `pytest`, so maybe 
I'm missing out on something much better, but `pytest` has been perfectly servicable in my hands.

Parametrically evaluating code is an important part of communicating about code. When users report bugs,
developers generally ask for a minimal reproducible example of code that demonstrates the bug. 
If the bug appears in one condition, but not another, then paremetrically evaluating the code can 
demonstrate this behavior compactly. 

```python
import tensorstore as ts
import pytest
@pytest.mark.parametrize('kvstore_path', ('', 'foo'))
def test_kvstore_list(kvstore_path):
    """
    Test that the kvstore list method is independent of the path.
    """
    store = ts.KvStore.open({'driver': 'memory', 'path': kvstore_path}).result()
    dir_name = b'dir_a'
    file_name = b'file_a'
    store.write(dir_name + b'/' + file_name, b'').result()
    assert (store / dir_name).list().result() == [b'/' + file_name]

pytest.main([__file__])
````