---
layout: post
status: publish
published: true
title: VMWare Server installed as host on FC6
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 110
wordpress_url: http://beta.astokes.org/vmware-server-installed-as-host-on-fc6/
date: '2006-11-09 00:00:59 -0500'
date_gmt: '2006-11-09 00:00:59 -0500'
categories:
- What's New
tags: []
---
<p>If you run into errors related to this :</p>
<pre class=&#34;prettyprint&#34;>
make[1]: Entering directory `/usr/src/kernels/2.6.18-1.2798.fc6-i686&#39; 
CC [M]  /tmp/vmware-config1/vmnet-only/driver.o 
CC [M]  /tmp/vmware-config1/vmnet-only/hub.o 
CC [M]  /tmp/vmware-config1/vmnet-only/userif.o 
CC [M]  /tmp/vmware-config1/vmnet-only/netif.o
CC [M]  /tmp/vmware-config1/vmnet-only/bridge.o 
CC [M]  /tmp/vmware-config1/vmnet-only/procfs.o
/tmp/vmware-config1/vmnet-only/procfs.c:33:26: error: linux/config.h: No such file or directory
make[2]: *** [/tmp/vmware-config1/vmnet-only/procfs.o] Error 1
make[1]: *** [_module_/tmp/vmware-config1/vmnet-only] Error 2
make[1]: Leaving directory `/usr/src/kernels/2.6.18-1.2798.fc6-i686&#39;
make: *** [vmnet.ko] Error 2
make: Leaving directory `/tmp/vmware-config1/vmnet-only &#39;Unable to build the vmnet module.
</pre>
<p>That is because config.h does not exist and is being deprecated in 2.6.18-1.2798.fc6 and beyond.To solve this :</p>
<pre class=&#34;prettyprint&#34;>
# touch /usr/src/kernels/2.6.18-1.2798.fc6-i686/include/linux/config.h
</pre>
<p>Once complete your VMware server should successfully complete<br />
vmware-config.pl and you can continue using this product.If it stills<br />
fails please see this thread for other ideas :<br />
http://www.vmware.com/community/thread.jspa?messageID=501043&#38;amp;#501043</p>
