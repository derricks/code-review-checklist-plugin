Code Revew Checklist Plugin
===========================

The most effective and efficient way to do a code review is to have a checklist listing common gotchas.
This chrome plugin is a tool for managing those checklists.

How It Works
------------
When you invoke the plugin, it will see if you have an existing checklist for that URL.
Failing that, it will use the URLs it _does_ have for a prefix search.
Finally, it will create a brand new checklist by copying a template.

Each time you check a box on the checklist for the given URL, the checklist will
get saved.

Purging
-------
The plugin uses Chrome's synced storage, so you can use it on different machines if you're logged
into Chrome on each one. However, that imposes constraints on how many items you can save.
The plugin will keep track of the last 500 code reviews, and will purge the
oldest ones (by modification date) first.

Todos
-----

  * implement purging logic
  * use a smaller data structure to allow for using synced storage

    * key = checklist text, selected = true (only set checklist items that are in this blob)

  * allow user to change master template

Things To Note
--------------
The default template rarely contains things you can use a linter to find. Not only
are the settings for that different for every developer or organization, you can (and should)
use computers to do this checking.

Testing
-------
The repo uses karma and jasmine for testing. To start karma:

    node ./node_modules/karma/bin/karma start ./code-review.conf.js

And then in another window:

    node ./node_modules/karma/bin/karma run

Bibliography
------------
_Practical Code Inspection Techniques for Object-Oriented Systems: An Experimental Comparison_: Dunsmore, Roper, Wood, IEEE Software, July August 2003
