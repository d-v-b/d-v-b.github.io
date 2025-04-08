---
title: 'Openorganelle'
pubDate: '2025-04-06'
description: 'An open data portal for FIB-SEM images'
author: 'Davis Bennett'
image:
    url: 'public/20231003Cellmapv2.png'
    alt: 'The Cellmap project team logo'
tags: ["Cellmap", "React"]
---

# OpenOrganelle

[www.openorganelle.org](OpenOrganelle) is a web page for browsing electron microscopy images of cells and tissues at nanometer resolution. 
I designed and built this site for the Cellmap Project team. The frontend is React, and the backend is a combination of postgres (via supabase) and chunked zarr / n5 datasets
saved on s3. It was my first web project and I learned a lot in the process.
