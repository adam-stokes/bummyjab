---
layout: post
status: publish
published: true
title: Configuring imap with mutt
author: Adam Stokes
date: '2005-07-25 00:00:59 -0400'
date_gmt: '2005-07-25 00:00:59 -0400'
categories:
- What's New
tags: []
---
### Place this in your ~/.muttrc

```
my_hdr From: user@example.com (Joe Blow)
set spoolfile=imaps://mail.server.com/INBOX
set folder=imaps://mail.server.com/
set imap_user=username
set move=no
set mail_check=60
set timeout=15
```
