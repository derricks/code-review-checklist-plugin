Code Revew Checklist Plugin
===========================

The most effective and efficient way to do a code review is to have a checklist listing common gotchas.
This chrome plugin is a tool for managing those checklists.

Installing The Extension
------------------------

  1. Clone this repo
  2. Visit chrome://extensions in your browser
  3. Ensure "Developer mode" checkbox is checked
  4. Click "Load unpacked extension..."
  5. Select the directory where you cloned the repo

How It Works
------------
When you click on the extension's icon, the code will see if you have an existing checklist for that URL.
If you don't, it will create a new one based on a master template.

Each time you check a box on the checklist for the given URL, the checklist will
get saved.

Purging
-------
The extension will purge old checklists as needed.

Todos
-----

  * prettification
    * make it more obvious that subheadings are collapsible
    * better stylings
  * allow user to change master template

Things To Note
--------------
The default template rarely contains things you can use a linter to find. Not only
are the settings for that different for every developer or organization, you can (and should)
use computers to do this checking.

Bibliography
------------
  * _Practical Code Inspection Techniques for Object-Oriented Systems: An Experimental Comparison_: Dunsmore, Roper, Wood
  * _Debugging effort estimation using software metrics_: Gorla, Benander, and Benander
  * _The Last Line Effect_: Beller, Zaidman, and Karpov
  * _Release It!_: Michael Nygard
  * _Feature Toggles: Practitioner Practices and a Case Study_: Rahman, Quere, Rigby, and Adams
