import json
import os.path
import sys

SUBHEADING = 'subheading'
CHECKLIST = 'checklist'
NAME = 'name'

def print_usage():
    print 'Script for exporting checklist json into markdown'
    print 'Usage: ' + sys.argv[0] + ' input_file'
    
def validate_args():
    if len(sys.argv) == 1:
        print_usage()
        return False
        
    if not os.path.isfile(sys.argv[1]):
        print "%s is not a file" % sys.argv[1]
        return False
       
    return True
    
def repeat(repeat_string, repeats):
    return repeat_string * repeats

def print_checklist_list(checklist_list, heading_level=1):
    ''' Prints a list of checklist items
    
    Args: checklist_list: the list of checklist items
          heading_level: level at which to print
    '''
    for item in checklist_list:
        if SUBHEADING in item:
            print_checklist(item, heading_level + 1)
        else:
            print (repeat(" ", heading_level + 2) + "* " + item[NAME])
            
    print('')
            
def print_checklist(checklist_dict, heading_level=1):
    ''' Prints a checklist object into markdown at a certain heading level
    
        Args:
          checklist_dict: a dictionary with headings of 'checklist' and maybe 'sudheading'
          heading_level: the current depth at which to print
    '''
    if 'subheading' in checklist_dict:
        print (repeat(" ", heading_level + 2) + repeat("#", heading_level) + " " + checklist_dict[SUBHEADING])
        print('')
        
    print_checklist_list(checklist_dict[CHECKLIST], heading_level + 1)
    

if __name__ == '__main__':
    if not validate_args():
        raise SystemExit(1)
    
    with open(sys.argv[1]) as checklist_file:
        checklist = json.load(checklist_file)
        print("# Code Review Checklist")
        print("Generated from [my code review checklist](https://github.com/derricks/code-review-checklist-plugin)")
        print('')
        print_checklist(checklist, 0)
