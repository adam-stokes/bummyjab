---
layout: post
status: publish
published: true
title: A new Mojolicious Plugin Blog in the works
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 94
wordpress_url: http://beta.astokes.org/a-new-mojolicious-plugin-blog-in-the-works/
date: '2013-06-01 00:34:18 -0400'
date_gmt: '2013-06-01 00:34:18 -0400'
categories:
- What's New
- Coder
- perl
tags:
- cms
- blog
- library
---
<p>New plugin in the works to integrate a simple blogging system as a plugin for<br />
<a href=&#34;http://mojolicio.us&#34;>Mojolicious</a>.</p>
<p>So far it supports most relational databases through DBIx::Connector and<br />
support for some social networks are coming soon.</p>
<p>Getting it going is straightforward a simple Mojolicious lite_app with a blog<br />
can be done in as a little as a few lines.</p>
<h3 id=&#34;example&#34;>Example</h3>
<pre class=&#34;prettyprint&#34;>
# Set authentication condition
my $conditions = {
  authenticated => sub {
    my $self = shift;
    unless ($self->session(&#39;authenticated&#39;)) {
      $self->flash(
        class   => &#39;alert alert-info&#39;,
        message => &#39;Please log in first!&#39;
      );
      $self->redirect_to(&#39;/login&#39;);
      return;
    }
    return 1;
  },
};

# Mojolicious full
$self->plugin(&#39;Blog&#39; => {
  authCondition => $conditions
  dsn => &#34;dbi:Pg:dbname=myblog&#34;,
  dbuser => &#39;zef&#39;,
  dbpass => &#39;letmein&#39;,
  }
);

# Mojolicious::Lite
plugin &#39;Blog&#39; => {
  authCondition => $conditions,
  dsn => &#34;dbi:Pg:dbname=myblog&#34;,
  dbuser => &#39;zef&#39;,
  dbpass => &#39;letmein&#39;,
};
</pre>
<p>Support for user authentication is handled through an <strong>authCondition</strong> and<br />
a routing bridge. Community contributions is always welcomed and you can visit<br />
the <a href=&#34;https://github.com/battlemidget/Mojolicious-Plugin-Blog&#34;>Project Page</a> to<br />
find out more.</p>
<p>Some immediate future plans are to integrate disqus comments, twitter activity,<br />
and cross posting to sites like <a href=&#34;https://coderwall.com&#34;>coderwall</a> and gravatar<br />
support.</p>
