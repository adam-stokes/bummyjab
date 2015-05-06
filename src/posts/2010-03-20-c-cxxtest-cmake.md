---
layout: post
status: publish
published: true
title: c++, cxxtest, cmake
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 107
wordpress_url: http://beta.astokes.org/c-cxxtest-cmake/
date: '2010-03-20 00:00:59 -0400'
date_gmt: '2010-03-20 00:00:59 -0400'
categories:
- What's New
tags: []
---
<p>Been messing around lately with CMake and how to intregrate<br />
additional testing frameworks such as CxxTest. So far everything<br />
has been very simple to configure and get setup so I thought<br />
I&#39;d post my findings here.</p>
<ul>
<li>Fedora provides both cmake and cxxtest so install these first.</li>
<li>CMake provides a convenience macro called FindCxxTest.cmake</li>
<li>In your CMakeLists.txt append the following:</li>
</ul>
<pre class=&#34;prettyprint&#34;>
# cxxtest
find_package(CxxTest)
if(CXXTEST_FOUND)
set(CXXTEST_USE_PYTHON TRUE)
include_directories(${CXXTEST_INCLUDE_DIR})
enable_testing()
CXXTEST_ADD_TEST(unittest_sos check_sos.cpp ${SOS_TEST_PATH}/check_sos.h)
target_link_libraries(unittest_sos sos)
endif()
</pre>
<p>The only custom variable here is SOS_TEST_PATH which basically points to $HOME/sos/tests/check_sos.h. See the &#39;set&#39; function in the cmake documentation.<br />
This is really all you need to do here. One note is to set the<br />
CXXTEST_USE_PYTHON to TRUE b/c cmake provided in Fedora doesn&#39;t<br />
contain the perl version of the test generator.  I&#39;m not going<br />
to post how I setup the testcases b/c right now they are very simple,<br />
however, if you would like to use my project as an example for implementing<br />
cmake into your code have a look at: libsos</p>
<p>If anyone has any good information on using cmake with python build scripts I&#39;d love to see those. For RPM Builders the spec file was very simple. I used<br />
the syntax within the kde builds:</p>
<pre class=&#34;prettyprint&#34;>
%build
mkdir -p %{_target_platform}
pushd %{_target_platform}
cmake ..
popd
make %{?_smp_mflags} -C %{_target_platform}
%install
rm -rf $RPM_BUILD_ROOT
make -C %{_target_platform} install DESTDIR=$RPM_BUILD_ROOT
%clean
rm -rf $RPM_BUILD_ROOT
%post -p /sbin/ldconfig
%postun -p /sbin/ldconfig
%files
%defattr(-,root,root,-)
%doc
%{_libdir}/%{name}.so.*
%files devel
%defattr(-,root,root,-)
%doc
%{_includedir}/%{name}
%{_libdir}/%{name}.so*
%{_libdir}/pkgconfig/%{name}.pc
</pre>
<p>Hope this little bit will help others who are interested in cmake.</p>
