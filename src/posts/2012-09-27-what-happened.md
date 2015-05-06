---
layout: post
status: publish
published: true
title: What happened?
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 106
wordpress_url: http://beta.astokes.org/what-happened/
date: '2012-09-27 00:00:59 -0400'
date_gmt: '2012-09-27 00:00:59 -0400'
categories:
- What's New
tags: []
---
<p>Sorry was away, been busy. Setup and migrated my old blog posts over<br />
to octopress and hosting it on Linode.com. Some of the older blog<br />
posts may see double titles. The migration script I used automatically<br />
added them and eventually I&#39;ll get to cleaning them up. With that I&#39;ve<br />
been messing around with some Ruby to wrap my head around it and<br />
hopefully get some Rails development going for certain projects.</p>
<p>Lately, I&#39;ve started noticing a disconnect in services making it<br />
difficult for people to decide what products they should pay for in<br />
developing a web application. I feel the common items should be<br />
included in whatever platform you decide to go with.  For example,<br />
wufoo.com provides a Form building service. While they are good at<br />
what they provide I don&#39;t entirely agree with making this a service<br />
that requires any type of payment. The limit is 3 forms for their free<br />
account and once those are used up it starts at $15/mo. These are<br />
simple forms with a pretty UI for building.</p>
<p>Simply put, this is not a service that should require payment to<br />
build. This falls under a notable feature of a bigger product along<br />
with convenience of having it all accessable through a single<br />
interface. I realize there is an API provided for their service, but,<br />
there again it&#39;ll cost you additional fees if you need to do anything<br />
more than simple contact forms.</p>
<h2 id=&#34;writingrubyplugins&#34;>Writing Ruby plugins</h2>
<p>I was searching around for helpers for building gems for Ruby.  Come<br />
to find out it isn&#39;t that difficult to write a gemspec, however, I did<br />
find an interesting application that pretty much acts in a sane way<br />
when building a Ruby gem. <a href=&#34;https://github.com/lazyatom/gem-this&#34;>gem-this</a> Pretty sweet little application<br />
as it doesn&#39;t add a bunch of less than useful files and pretty much<br />
sticks to the convention of keeping everything in a Rakefile and<br />
having that generate your gemspec during build. Not a bad idea and I<br />
like gem-this simplicity when it comes to building documentation,<br />
adding binaries, little-to-no learning curve, and overall keeping<br />
simple tasks simple.</p>
<pre class=&#34;prettyprint&#34;>
$ gem install gem-this
</pre>
<p>One of the best things about gem-this is that it works on existing<br />
projects.  You&#39;d be suprised how many of these gem helpers require<br />
building a new project and including them as dependencies :\</p>
<pre class=&#34;prettyprint&#34;>
$ gem-this .
</pre>
<p>It&#39;ll append to your existing Rakefile or create a new one. Gemspecs<br />
are then generated with a rake task.</p>
<pre class=&#34;prettyprint&#34;>
$ rake gemspec
</pre>
<p>Other little nice things are including rdoc support and building into<br />
its own directory for easy cleanup.</p>
<pre class=&#34;prettyprint&#34;>
$ rake gem
</pre>
